import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
]);

function corsHeaders(origin: string | null) {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "http://localhost:8081";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

function normalizeLang(input: unknown) {
  const raw = String(input || "").toLowerCase();
  if (raw === "sv") return "sv";
  if (raw === "en") return "en";
  return "en";
}

function randomOrderNumber() {
  // TN-YYYYMMDD-XXXXXX
  const d = new Date();
  const y = d.getFullYear().toString();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `TN-${y}${m}${day}-${rand}`;
}

type Payload = {
  items: { product_id: string; quantity: number }[];
  customer_name: string;
  customer_phone?: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  lang?: string;

  // Optional - your UI collects email; pass it if you can
  customer_email?: string;

  // Optional debug/client totals, server computes truth anyway
  client_totals?: unknown;
};

serve(async (req) => {
  const origin = req.headers.get("origin");

  // ✅ Preflight (fixes OPTIONS 405)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return json(origin, { error: "Method not allowed" }, 405);
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:8081";

    if (!stripeKey)
      return json(origin, { error: "STRIPE_SECRET_KEY missing" }, 500);
    if (!supabaseUrl || !serviceKey)
      return json(origin, { error: "Supabase env vars missing" }, 500);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabase = createClient(supabaseUrl, serviceKey);

    const payload = (await req.json()) as Payload;

    if (!payload.items?.length) {
      return json(origin, { error: "No items provided" }, 400);
    }
    if (!payload.customer_name?.trim()) {
      return json(origin, { error: "Missing customer_name" }, 400);
    }
    if (
      !payload.address?.street ||
      !payload.address?.city ||
      !payload.address?.postal_code ||
      !payload.address?.country
    ) {
      return json(origin, { error: "Missing address" }, 400);
    }

    // Basic item validation
    for (const it of payload.items) {
      if (
        !it.product_id ||
        !Number.isInteger(it.quantity) ||
        it.quantity <= 0
      ) {
        return json(origin, { error: "Invalid items" }, 400);
      }
    }

    const lang = normalizeLang(payload.lang);
    const checkoutBase = `${siteUrl}/${lang}`;

    // Load products
    const ids = payload.items.map((i) => i.product_id);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id,title,price_cents,currency")
      .in("id", ids);

    if (pErr || !products)
      return json(origin, { error: "Product lookup failed" }, 500);
    if (products.length !== ids.length)
      return json(origin, { error: "Some products not found" }, 400);

    // Ensure single currency
    const currencySet = new Set(
      products.map((p) => (p.currency ?? "SEK").toUpperCase()),
    );
    if (currencySet.size !== 1) {
      return json(origin, { error: "Mixed currencies not supported" }, 400);
    }
    const currency = [...currencySet][0].toUpperCase();
    const stripeCurrency = currency.toLowerCase();

    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = payload.items.map((it) => {
      const p = productMap.get(it.product_id)!;
      return {
        product_id: p.id,
        title: p.title,
        quantity: it.quantity,
        price_cents: p.price_cents,
        currency,
      };
    });

    // Compute totals server-side
    const subtotal = items.reduce(
      (sum, it) => sum + it.price_cents * it.quantity,
      0,
    );
    const totals = { subtotal, shipping: 0, tax: 0, total: subtotal };

    // Create local order first
    const order_number = randomOrderNumber();

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        order_number,
        // If you want to attach user_id, do it in the Edge Function by verifying JWT.
        // For now (verify_jwt=false), keep null:
        user_id: null,

        full_name: payload.customer_name,
        email: payload.customer_email ?? "", // if you require email, enforce it in UI and send it
        phone: payload.customer_phone ?? null,
        address: payload.address,
        items,
        totals,
        currency,

        payment_method: "CARD",
        payment_provider: "STRIPE",
        payment_status: "AWAITING_PAYMENT",
      })
      .select("id,order_number")
      .single();

    if (oErr || !order)
      return json(origin, { error: "Failed to create order" }, 500);

    // Stripe line items
    const line_items = items.map((it) => ({
      quantity: it.quantity,
      price_data: {
        currency: stripeCurrency,
        unit_amount: it.price_cents,
        product_data: { name: it.title },
      },
    }));

    // ✅ Success goes to existing receipt page
    const successUrl = `${checkoutBase}/order-confirmation?order=${encodeURIComponent(order.order_number)}`;
    const cancelUrl = `${checkoutBase}/checkout?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      // ✅ Makes PayPal show (if enabled + eligible)
      automatic_payment_methods: { enabled: true },

      success_url: successUrl,
      cancel_url: cancelUrl,

      // Helpful for webhook mapping
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        lang,
      },
    });

    // Save Stripe session id on the order
    await supabase
      .from("orders")
      .update({
        provider_session_id: session.id,
        provider_metadata: {
          stripe_session_id: session.id,
          stripe_mode: session.livemode ? "live" : "test",
        },
      })
      .eq("id", order.id);

    // Audit event
    await supabase.from("payment_events").insert({
      order_id: order.id,
      provider: "STRIPE",
      event_type: "checkout.session.created",
      raw: {
        order_id: order.id,
        order_number: order.order_number,
        stripe_session_id: session.id,
        currency,
        amount_cents: totals.total,
      },
    });

    return json(
      origin,
      { url: session.url, order_number: order.order_number },
      200,
    );
  } catch (err: any) {
    console.error(err);
    return json(origin, { error: err?.message ?? "Unknown error" }, 500);
  }
});
