import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

serve(async (req) => {
  try {
    if (req.method !== "POST")
      return new Response("Method not allowed", { status: 405 });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceKey) {
      return new Response("Missing env", { status: 500 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabase = createClient(supabaseUrl, serviceKey);

    const sig = req.headers.get("stripe-signature");
    if (!sig) return new Response("Missing stripe-signature", { status: 400 });

    // IMPORTANT: raw body
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch {
      return new Response("Invalid signature", { status: 400 });
    }

    // Handle the events you care about
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.order_id ?? null;
      const sessionId = session.id;

      // Update order to PAID
      if (orderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "PAID",
            payment_method: "CARD",
            paid_at: new Date().toISOString(),
          })
          .eq("id", orderId);
      } else {
        // fallback: if you store stripe_session_id on order
        await supabase
          .from("orders")
          .update({
            payment_status: "PAID",
            payment_method: "CARD",
            paid_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", sessionId);
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id ?? null;
      const sessionId = session.id;

      if (orderId) {
        await supabase
          .from("orders")
          .update({ payment_status: "CANCELLED" })
          .eq("id", orderId);
      } else {
        await supabase
          .from("orders")
          .update({ payment_status: "CANCELLED" })
          .eq("stripe_session_id", sessionId);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response("Webhook error", { status: 500 });
  }
});
