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

function normalizeLang(input: unknown) {
  const raw = String(input || "").toLowerCase();
  if (raw === "sv") return "sv";
  if (raw === "en") return "en";
  return "en";
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = cors(origin);

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  if (headers["Access-Control-Allow-Origin"] === "null") {
    return json(origin, { ok: false, error: "Origin not allowed" }, 403);
  }

  if (req.method !== "POST") return json(origin, { ok: false, error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return json(origin, { ok: false, error: "Supabase env vars missing" }, 500);

    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const order_number = String(body?.order_number || "").trim();
    const guestToken = body?.token ? String(body.token) : null;
    const lang = normalizeLang(body?.lang);

    if (!order_number) return json(origin, { ok: false, error: "Missing order_number" }, 400);

    // Need these columns to exist in your orders table (they already do in your functions)
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("id, guest_access_token_hash, guest_access_token_expires_at")
      .eq("order_number", order_number)
      .single();

    if (oErr || !order) return json(origin, { ok: false, error: "Order not found" }, 404);

    // Guest validation if order is guest-protected
    if (order.guest_access_token_hash) {
      if (!guestToken) return json(origin, { ok: false, error: "Missing guest token" }, 401);

      const expires = order.guest_access_token_expires_at ? new Date(order.guest_access_token_expires_at) : null;
      if (expires && Number.isFinite(expires.getTime()) && expires.getTime() < Date.now()) {
        return json(origin, { ok: false, error: "Guest token expired" }, 401);
      }

      const hash = await sha256Hex(guestToken);
      if (hash !== order.guest_access_token_hash) return json(origin, { ok: false, error: "Invalid guest token" }, 401);
    }

    const reviewToken = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

    const { error: insErr } = await supabase.from("review_tokens").insert({
      order_id: order.id,
      token: reviewToken,
      expires_at: expiresAt,
    });

    if (insErr) return json(origin, { ok: false, error: "Failed to create review token" }, 500);

    return json(origin, { ok: true, token: reviewToken, lang }, 200);
  } catch (e) {
    console.error(e);
    return json(origin, { ok: false, error: (e as Error).message ?? "Unknown error" }, 500);
  }
});