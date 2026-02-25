/**
 * supabase/functions/send-notifications/index.ts
 *
 * Internal notification dispatcher.
 *
 * Security:
 * - verify_jwt=false; MUST NOT be publicly callable.
 * - Require Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 *   OR x-internal-secret: <INTERNAL_FUNCTION_SECRET>
 *
 * Supports:
 * - WhatsApp admin ping (optional)
 * - Email via Resend (optional)
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

type NotificationPayload = {
  event_type: string;
  order?: any;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isAuthorized(req: Request): boolean {
  const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const hdrSecret = req.headers.get("x-internal-secret");
  if (internalSecret && hdrSecret && hdrSecret === internalSecret) return true;

  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (
    serviceKey &&
    auth &&
    auth.startsWith("Bearer ") &&
    auth.slice("Bearer ".length) === serviceKey
  ) {
    return true;
  }

  return false;
}

async function maybeSendWhatsApp(payload: NotificationPayload) {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const adminPhone = Deno.env.get("WHATSAPP_ADMIN_PHONE");

  if (!token || !phoneNumberId || !adminPhone) return { skipped: true };

  const orderNumber = payload.order?.order_number ? ` ${payload.order.order_number}` : "";
  const msg = `TropiNord: ${payload.event_type}${orderNumber}`;

  const resp = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: adminPhone.replace(/^\+/, ""),
      type: "text",
      text: { body: msg },
    }),
  });

  const body = await resp.text();
  if (!resp.ok) return { skipped: false, ok: false, status: resp.status, body };
  return { skipped: false, ok: true, body };
}

function formatMoney(cents: number, currency: string) {
  const amount = (Number(cents || 0) / 100).toFixed(2);
  return `${amount} ${String(currency || "").toUpperCase()}`;
}

async function maybeSendEmailResend(payload: NotificationPayload) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM"); // e.g. "TropiNord <orders@tropinord.com>"
  const adminEmail = Deno.env.get("ADMIN_EMAIL"); // e.g. "admin@tropinord.com"

  if (!resendKey || !from || !adminEmail) return { skipped: true };

  const order = payload.order ?? {};
  const orderNumber = order.order_number ?? "";
  const total = order?.totals?.total ?? 0;
  const currency = order.currency ?? "SEK";

  const customerEmail = String(order.email ?? "").trim();

  const results: any = { skipped: false, customer: null, admin: null };

  // Customer email (only if we have one)
  if (customerEmail) {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [customerEmail],
        subject: `Order confirmed – ${orderNumber}`,
        html: `
          <h2>Thank you for your order</h2>
          <p>Order number: <strong>${orderNumber}</strong></p>
          <p>Total: <strong>${formatMoney(total, currency)}</strong></p>
        `,
      }),
    });

    const body = await resp.text();
    results.customer = resp.ok ? { ok: true } : { ok: false, status: resp.status, body };
  } else {
    results.customer = { ok: false, reason: "No customer email on order" };
  }

  // Admin email
  {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [adminEmail],
        subject: `New paid order – ${orderNumber}`,
        html: `
          <h2>New paid order</h2>
          <p>Order: <strong>${orderNumber}</strong></p>
          <p>Name: ${order.full_name ?? ""}</p>
          <p>Email: ${order.email ?? ""}</p>
          <p>Total: <strong>${formatMoney(total, currency)}</strong></p>
        `,
      }),
    });

    const body = await resp.text();
    results.admin = resp.ok ? { ok: true } : { ok: false, status: resp.status, body };
  }

  return results;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (!isAuthorized(req)) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase =
    supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

  try {
    const payload = (await req.json()) as NotificationPayload;
    if (!payload?.event_type) return json({ error: "Missing event_type" }, 400);

    console.log("Notification requested:", payload.event_type);

    // Best-effort persist (if table exists)
    if (supabase) {
      try {
        await supabase.from("notification_events").insert({
          event_type: payload.event_type,
          raw: payload,
        });
      } catch (_e) {
        // ignore if table doesn't exist
      }
    }

    const whatsappResult = await maybeSendWhatsApp(payload);
    const emailResult = await maybeSendEmailResend(payload);

    return json({ ok: true, whatsapp: whatsappResult, email: emailResult }, 200);
  } catch (error) {
    console.error("send-notifications error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});