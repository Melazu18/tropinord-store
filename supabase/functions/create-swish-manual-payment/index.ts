import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import QRCode from "https://esm.sh/qrcode@1.5.4";

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

// Swish QR payload: C<payee>;<amount>;<message>;<lock_mask>
function buildSwishQrPayload(
  payee: string,
  amountCents: number,
  message: string,
) {
  const payeeDigits = String(payee).replace(/\D/g, "");
  const amount = (amountCents / 100).toFixed(2).replace(".", ",");
  const msgRaw = String(message).replace(/;/g, "").slice(0, 50);
  const msgEnc = encodeURIComponent(msgRaw);
  return `C${payeeDigits};${amount};${msgEnc};0`;
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
  customer_email: string;
  customer_phone?: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  lang?: string;
};

serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return json(origin, { error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      return json(origin, { error: "Supabase env vars missing" }, 500);
    }

    // ✅ Force old Swish number as default
    const swishNumber = Deno.env.get("SWISH_NUMBER") ?? "1230558973";

    const supabase = createClient(supabaseUrl, serviceKey);

    const payload = (await req.json()) as Payload;

    if (!payload.items?.length) return json(origin, { error: "No items" }, 400);
    if (!payload.customer_name?.trim())
      return json(origin, { error: "Missing name" }, 400);
    if (!payload.customer_email?.trim())
      return json(origin, { error: "Missing email" }, 400);

    for (const it of payload.items) {
      if (
        !it.product_id ||
        !Number.isInteger(it.quantity) ||
        it.quantity <= 0
      ) {
        return json(origin, { error: "Invalid items" }, 400);
      }
    }

    // Load products and compute totals server-side
    const ids = payload.items.map((i) => i.product_id);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("id,title,price_cents,currency")
      .in("id", ids);

    if (pErr || !products)
      return json(origin, { error: "Product lookup failed" }, 500);
    if (products.length !== ids.length)
      return json(origin, { error: "Some products not found" }, 400);

    const currencySet = new Set(
      products.map((p) => (p.currency ?? "SEK").toUpperCase()),
    );
    if (currencySet.size !== 1)
      return json(origin, { error: "Mixed currencies not supported" }, 400);

    const currency = [...currencySet][0].toUpperCase();
    if (currency !== "SEK")
      return json(origin, { error: "Swish requires SEK" }, 400);

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

    const subtotal = items.reduce(
      (sum, it) => sum + it.price_cents * it.quantity,
      0,
    );
    const totals = { subtotal, shipping: 0, tax: 0, total: subtotal };

    const order_number = randomOrderNumber();
    const reference = `SWISH-${order_number}`;

    // ✅ Build QR payload + QR image
    const qr_payload = buildSwishQrPayload(
      swishNumber,
      totals.total,
      reference,
    );

    const qr_png_data_url = await QRCode.toDataURL(qr_payload, {
      errorCorrectionLevel: "H",
      width: 420,
      margin: 2,
    });

    // Optional deeplink (device-dependent)
    const swish_deeplink = `swish://payment?data=${encodeURIComponent(
      JSON.stringify({
        version: 1,
        payee: { value: swishNumber.replace(/\D/g, ""), editable: false },
        amount: { value: totals.total, editable: false }, // öre
        message: { value: reference.slice(0, 50), editable: false },
      }),
    )}`;

    // ✅ Store Swish info in provider_metadata so Admin can see it
    const provider_metadata = {
      swish_number: swishNumber,
      swish_reference: reference,
      swish_qr_payload: qr_payload,
      swish_amount_cents: totals.total,
      swish_currency: "SEK",
      swish_deeplink,
    };

    // Create order (pending swish payment)
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        order_number,
        full_name: payload.customer_name,
        email: payload.customer_email,
        phone: payload.customer_phone ?? null,
        address: payload.address,
        items,
        totals,
        currency,
        payment_method: "SWISH",
        payment_provider: "SWISH",
        payment_status: "AWAITING_PAYMENT",
        provider_metadata,
      })
      .select("id,order_number,provider_metadata")
      .single();

    if (oErr || !order)
      return json(origin, { error: "Failed to create order" }, 500);

    // Audit event
    await supabase.from("payment_events").insert({
      order_id: order.id,
      provider: "SWISH",
      event_type: "swish_manual.created",
      raw: {
        order_id: order.id,
        reference,
        swish_number: swishNumber,
        amount_cents: totals.total,
      },
    });

    return json(origin, {
      order_id: order.id,
      order_number: order.order_number,
      swish_number: swishNumber,
      reference,
      amount_cents: totals.total,
      currency: "SEK",
      qr_payload,
      qr_png_data_url,
      swish_deeplink,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return json(origin, { error: msg }, 500);
  }
});
