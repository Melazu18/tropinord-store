import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

/**
 * Stripe webhook handler:
 * - Verifies Stripe signature using raw body
 * - Updates order payment_status
 * - Inserts payment_events audit rows
 * - Triggers internal send-notifications function on PAID (and optionally CANCELLED)
 *
 * Env required:
 *  STRIPE_SECRET_KEY
 *  STRIPE_WEBHOOK_SECRET
 *  SUPABASE_URL
 *  SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional (recommended):
 *  SUPABASE_FUNCTIONS_URL   (e.g. https://<project-ref>.supabase.co/functions/v1)
 *  INTERNAL_FUNCTION_SECRET (must match send-notifications function)
 */

const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, stripe-signature",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
});

function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

type OrderRow = {
  id: string;
  order_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: unknown;
  items: unknown;
  totals: unknown;
  currency: string;
  payment_status: string;
  provider_session_id: string | null;
  paid_at: string | null;
};

function getFunctionsBaseUrl() {
  const explicit = Deno.env.get("SUPABASE_FUNCTIONS_URL");
  if (explicit) return explicit.replace(/\/$/, "");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) throw new Error("SUPABASE_URL missing");

  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1`;
}

async function callSendNotifications(event_type: string, order: OrderRow) {
  const functionsBase = getFunctionsBaseUrl();

  const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (internalSecret && internalSecret.trim().length > 0) {
    headers["x-internal-secret"] = internalSecret.trim();
  } else if (serviceKey && serviceKey.trim().length > 0) {
    headers["Authorization"] = `Bearer ${serviceKey.trim()}`;
  } else {
    console.error(
      "No INTERNAL_FUNCTION_SECRET or SUPABASE_SERVICE_ROLE_KEY available to authorize notifications.",
    );
    return {
      ok: false,
      status: 0,
      body: "Missing auth for send-notifications",
    };
  }

  const resp = await fetch(`${functionsBase}/send-notifications`, {
    method: "POST",
    headers,
    body: JSON.stringify({ event_type, order }),
  });

  const text = await resp.text();
  if (!resp.ok) {
    console.error("send-notifications failed:", resp.status, text);
    return { ok: false, status: resp.status, body: text };
  }

  console.log("send-notifications ok:", event_type, order.order_number);
  return { ok: true, body: text };
}

serve(async (req) => {
  const origin = req.headers.get("origin");

  // Preflight (Stripe won't send OPTIONS; useful for manual/local tests)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders(origin) });
  }

  try {
    if (req.method !== "POST") {
      return json(origin, { error: "Method not allowed" }, 405);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceKey) {
      return json(origin, { error: "Missing env" }, 500);
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-05-28.basil" });
    const supabase = createClient(supabaseUrl, serviceKey);

    const sig = req.headers.get("stripe-signature");
    if (!sig) return json(origin, { error: "Missing stripe-signature" }, 400);

    // IMPORTANT: raw body for signature verification
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (e) {
      console.error("Webhook signature verification failed:", e);
      return json(origin, { error: "Invalid signature" }, 400);
    }

    const providerEventId = event.id;
    console.log("Stripe webhook received:", event.type, providerEventId);

    // ---------------------------
    // checkout.session.completed
    // ---------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id ?? null;
      const sessionId = session.id;

      // Idempotency: if we already have this Stripe event recorded, skip notifications
      // (Best if you also add a unique index on (provider, provider_event_id).)
      let isDuplicate = false;
      try {
        const { error: peErr } = await supabase.from("payment_events").insert({
          order_id: orderId, // might be null
          provider: "STRIPE",
          event_type: "checkout.session.completed",
          provider_event_id: providerEventId,
          raw: {
            stripe_session_id: sessionId,
            metadata: session.metadata ?? {},
          },
        });

        if (peErr) {
          console.warn(
            "payment_events insert error (possible duplicate):",
            peErr.message,
          );
          // If unique constraint exists, treat as duplicate.
          if (
            String(peErr.message || "")
              .toLowerCase()
              .includes("duplicate")
          ) {
            isDuplicate = true;
          }
        }
      } catch (e) {
        console.warn("payment_events insert failed (possible duplicate):", e);
      }

      // Update order to PAID and fetch full row
      let order: OrderRow | null = null;

      if (orderId) {
        const { data, error } = await supabase
          .from("orders")
          .update({
            payment_status: "PAID",
            payment_method: "CARD",
            paid_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .select(
            "id,order_number,full_name,email,phone,address,items,totals,currency,payment_status,provider_session_id,paid_at",
          )
          .single();

        if (error) console.error("Order update error:", error);
        order = (data as OrderRow) ?? null;
      } else {
        const { data, error } = await supabase
          .from("orders")
          .update({
            payment_status: "PAID",
            payment_method: "CARD",
            paid_at: new Date().toISOString(),
          })
          .eq("provider_session_id", sessionId)
          .select(
            "id,order_number,full_name,email,phone,address,items,totals,currency,payment_status,provider_session_id,paid_at",
          )
          .single();

        if (error) console.error("Order update error:", error);
        order = (data as OrderRow) ?? null;
      }

      if (!order) {
        console.error(
          "No order found to update/notify for session:",
          sessionId,
        );
        return json(origin, { received: true }, 200); // don't retry forever
      }

      // Only send notifications if not duplicate
      if (isDuplicate) {
        console.log(
          "Duplicate webhook event; skipping notifications:",
          providerEventId,
        );
      } else {
        await callSendNotifications("order.paid", order);
      }
    }

    // ---------------------------
    // checkout.session.expired
    // ---------------------------
    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id ?? null;
      const sessionId = session.id;

      // Audit event (best effort)
      try {
        await supabase.from("payment_events").insert({
          order_id: orderId,
          provider: "STRIPE",
          event_type: "checkout.session.expired",
          provider_event_id: providerEventId,
          raw: {
            stripe_session_id: sessionId,
            metadata: session.metadata ?? {},
          },
        });
      } catch (e) {
        console.warn("payment_events insert failed (maybe duplicate):", e);
      }

      if (orderId) {
        await supabase
          .from("orders")
          .update({ payment_status: "CANCELLED" })
          .eq("id", orderId);
      } else {
        await supabase
          .from("orders")
          .update({ payment_status: "CANCELLED" })
          .eq("provider_session_id", sessionId);
      }

      // Optional: notify admin about expired/cancelled
      // If you want this too, fetch order and send:
      // const { data: order } = orderId
      //   ? await supabase.from("orders").select("*").eq("id", orderId).single()
      //   : await supabase.from("orders").select("*").eq("provider_session_id", sessionId).single();
      // if (order) await callSendNotifications("order.cancelled", order as OrderRow);
    }

    return json(origin, { received: true }, 200);
  } catch (e) {
    console.error("Webhook error:", e);
    return json(origin, { error: "Webhook error" }, 500);
  }
});
