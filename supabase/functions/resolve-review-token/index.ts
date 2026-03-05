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
    if (!token) return json(origin, { ok: false, error: "Missing token" }, 400);

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

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("order_number, items, full_name, address")
      .eq("id", tok.order_id)
      .single();

    if (oErr || !order) return json(origin, { ok: false, error: "Order not found" }, 404);

    const items = (order.items ?? []) as unknown as OrderItem[];
    const suggested_country =
      (order.address && typeof order.address === "object" && (order.address as any).country)
        ? String((order.address as any).country)
        : null;

    return json(origin, {
      ok: true,
      order_number: order.order_number,
      items,
      suggested_name: order.full_name ? String(order.full_name).split(" ")[0] : null,
      suggested_country,
    });
  } catch (e) {
    console.error(e);
    return json(origin, { ok: false, error: (e as Error).message ?? "Unknown error" }, 500);
  }
});