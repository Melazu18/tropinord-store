import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "https://tropinord-store.vercel.app",
  "https://tropinord.com",
  "https://www.tropinord.com",
  "https://tropinord.se",
  "https://www.tropinord.se",
]);

function cors(origin: string | null) {
  const ok = !!origin && ALLOWED_ORIGINS.has(origin);
  const allowOrigin = ok ? origin! : "null";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json" },
  });
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

type OrderItem = { product_id: string; title: string; quantity: number };

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = cors(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (headers["Access-Control-Allow-Origin"] === "null") return json(origin, { ok: false, error: "Origin not allowed" }, 403);
  if (req.method !== "POST") return json(origin, { ok: false, error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return json(origin, { ok: false, error: "Supabase env vars missing" }, 500);

    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();

    const token = String(body?.token || "").trim();
    const product_id = String(body?.product_id || "").trim();
    const rating = Number(body?.rating ?? 0);

    const title = body?.title ? String(body.title).trim() : null;
    const reviewBody = body?.body ? String(body.body).trim() : "";
    const customer_name = body?.customer_name ? String(body.customer_name).trim() : "";
    const country = body?.country ? String(body.country).trim() : null;

    if (!token) return json(origin, { ok: false, error: "Missing token" }, 400);
    if (!product_id) return json(origin, { ok: false, error: "Missing product_id" }, 400);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) return json(origin, { ok: false, error: "Invalid rating" }, 400);
    if (!reviewBody) return json(origin, { ok: false, error: "Missing body" }, 400);
    if (!customer_name) return json(origin, { ok: false, error: "Missing customer_name" }, 400);

    // Validate token
    const { data: tok, error: tErr } = await supabase
      .from("review_tokens")
      .select("order_id, expires_at")
      .eq("token", token)
      .single();

    if (tErr || !tok) return json(origin, { ok: false, error: "Invalid token" }, 401);

    const exp = new Date(tok.expires_at);
    if (Number.isFinite(exp.getTime()) && exp.getTime() < Date.now()) {
      return json(origin, { ok: false, error: "Token expired" }, 401);
    }

    // Load order items and ensure product_id belongs to the order
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("items")
      .eq("id", tok.order_id)
      .single();

    if (oErr || !order) return json(origin, { ok: false, error: "Order not found" }, 404);

    const items = (order.items ?? []) as unknown as OrderItem[];
    const inOrder = items.some((it) => String(it.product_id) === product_id);
    if (!inOrder) return json(origin, { ok: false, error: "Product not in order" }, 403);

    // Enforce one review per product per token using hash
    const review_token_hash = await sha256Hex(token);

    // Insert PENDING review
    const { error: insErr } = await supabase.from("reviews").insert({
      product_id,
      rating,
      title,
      body: reviewBody,
      status: "PENDING",
      customer_name,
      country,
      review_token_hash,
    });

    if (insErr) {
      // If duplicate (unique index), return friendly message
      return json(origin, { ok: false, error: "You have already reviewed this product for this order." }, 409);
    }

    return json(origin, { ok: true }, 200);
  } catch (e) {
    console.error(e);
    return json(origin, { ok: false, error: (e as Error).message ?? "Unknown error" }, 500);
  }
});