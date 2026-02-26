import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "https://tropinord-store.vercel.app",
]);

function buildCorsHeaders(origin: string | null) {
  const isAllowed = !!origin && ALLOWED_ORIGINS.has(origin);
  const allowOrigin = isAllowed ? origin! : "null";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...buildCorsHeaders(origin), "Content-Type": "application/json" },
  });
}

function normalizeLang(input: unknown) {
  const raw = String(input || "").toLowerCase();
  if (raw === "sv") return "sv";
  if (raw === "en") return "en";
  return "en";
}

function randomOrderNumber() {
  const d = new Date();
  const y = d.getFullYear().toString();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = crypto.randomUUID().slice(0, 6).toUpperCase();
  return `TN-${y}${m}${day}-${rand}`;
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type Payload = {
  items: { product_id: string; quantity: number }[];
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  lang?: string;
  client_totals?: unknown;
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  // ✅ Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  // ✅ Block unknown origins (prevents accidental “localhost fallback” in prod)
  if (corsHeaders["Access-Control-Allow-Origin"] === "null") {
    return new Response(JSON.stringify({ ok: false, error: "Origin not allowed" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return json(origin, { ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const siteUrl = Deno.env.get("SITE_URL") ?? "http://localhost:8081";

    if (!stripeKey) return json(origin, { ok: false, error: "STRIPE_SECRET_KEY missing" }, 500);
    if (!supabaseUrl || !serviceKey) return json(origin, { ok: false, error: "Supabase env vars missing" }, 500);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-05-28.basil" });
    const supabase = createClient(supabaseUrl, serviceKey);

    // ✅ Identify caller (optional): set orders.user_id if signed in
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length);
      const { data, error } = await supabase.auth.getUser(token);
      if (!error) userId = data.user?.id ?? null;
    }

    const payload = (await req.json()) as Payload;

    if (!payload.items?.length) return json(origin, { ok: false, error: "No items provided" }, 400);
    if (!payload.customer_name?.trim()) return json(origin, { ok: false, error: "Missing customer_name" }, 400);

    if (
      !payload.address?.street ||
      !payload.address?.city ||
      !payload.address?.postal_code ||
      !payload.address?.country
    ) {
      return json(origin, { ok: false, error: "Missing address" }, 400);
    }

    for (const it of payload.items) {
      if (!it.product_id || !Number.isInteger(it.quantity) || it.quantity <= 0) {
        return json(origin, { ok: false, error: "Invalid items" }, 400);
      }
    }

    const lang = normalizeLang(payload.lang);
    const checkoutBase = `${siteUrl}/${lang}`;

    // Load products from DB (server source of truth)
    const ids = payload.items.map((i) => i.product_id);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id,title,price_cents,currency,status,inventory")
      .in("id", ids);

    if (pErr || !products) return json(origin, { ok: false, error: "Product lookup failed" }, 500);
    if (products.length !== ids.length) return json(origin, { ok: false, error: "Some products not found" }, 400);

    // ✅ Enforce purchasable products (prevents 0-price and out-of-stock checkout)
    for (const p of products) {
      const inv = Number(p.inventory ?? 0);
      const price = Number(p.price_cents ?? 0);
      if (String(p.status).toUpperCase() !== "PUBLISHED") {
        return json(origin, { ok: false, error: `Product not published: ${p.id}` }, 400);
      }
      if (price <= 0) {
        return json(origin, { ok: false, error: `Product has no price: ${p.id}` }, 400);
      }
      if (inv <= 0) {
        return json(origin, { ok: false, error: `Product out of stock: ${p.id}` }, 400);
      }
    }

    // Ensure single currency per checkout
    const currencySet = new Set(products.map((p) => (p.currency ?? "SEK").toUpperCase()));
    if (currencySet.size !== 1) {
      return json(origin, { ok: false, error: "Mixed currencies not supported" }, 400);
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

    const subtotal = items.reduce((sum, it) => sum + it.price_cents * it.quantity, 0);
    const totals = { subtotal, shipping: 0, tax: 0, total: subtotal };

    const order_number = randomOrderNumber();

    // ✅ Guest token for public receipt (Stripe guest flow)
    const guestToken =
      crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const guestTokenHash = await sha256Hex(guestToken);
    const guestTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        order_number,
        user_id: userId,

        full_name: payload.customer_name,
        email: payload.customer_email ?? "",
        phone: payload.customer_phone ?? null,
        address: payload.address,
        items,
        totals,
        currency,

        payment_method: "CARD",
        payment_provider: "STRIPE",
        payment_status: "AWAITING_PAYMENT",

        // ✅ used by get-order-public
        guest_access_token_hash: guestTokenHash,
        guest_access_token_expires_at: guestTokenExpiresAt,
      })
      .select("id,order_number")
      .single();

    if (oErr || !order) return json(origin, { ok: false, error: "Failed to create order" }, 500);

    const line_items = items.map((it) => ({
      quantity: it.quantity,
      price_data: {
        currency: stripeCurrency,
        unit_amount: it.price_cents,
        product_data: { name: it.title },
      },
    }));

    // ✅ CRITICAL: match your OrderConfirmation expectations: ?order=...&token=...
    const successUrl =
      `${checkoutBase}/order-confirmation` +
      `?order=${encodeURIComponent(order.order_number)}` +
      `&token=${encodeURIComponent(guestToken)}`;

    const cancelUrl = `${checkoutBase}/checkout?canceled=1`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      ...(payload.customer_email?.trim()
        ? { customer_email: payload.customer_email.trim() }
        : {}),
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
        lang,
      },
    });

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

    return json(origin, { ok: true, url: session.url, order_number: order.order_number }, 200);
  } catch (err: any) {
    console.error(err);
    return json(origin, { ok: false, error: err?.message ?? "Unknown error" }, 500);
  }
});