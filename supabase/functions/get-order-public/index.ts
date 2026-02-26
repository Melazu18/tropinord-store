import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    Vary: "Origin",
  };
}

function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...buildCorsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getBearerToken(req: Request) {
  const h =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

type Body = {
  order_number?: unknown;
  token?: unknown;
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = buildCorsHeaders(origin);

  // ✅ Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  // ✅ Block unknown origins explicitly
  if (corsHeaders["Access-Control-Allow-Origin"] === "null") {
    return new Response(
      JSON.stringify({ ok: false, error: "Origin not allowed" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (req.method !== "POST") {
    return json(origin, { ok: false, error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json(
        origin,
        { ok: false, error: "Supabase env vars missing" },
        500,
      );
    }

    // Admin client bypasses RLS
    const admin = createClient(supabaseUrl, serviceKey);

    // Only for validating a real user JWT
    const authClient = createClient(supabaseUrl, anonKey);

    let parsed: Body;
    try {
      parsed = (await req.json()) as Body;
    } catch {
      return json(origin, { ok: false, error: "Invalid JSON body" }, 400);
    }

    const order_number = String(parsed.order_number ?? "").trim();
    const token = parsed.token != null ? String(parsed.token).trim() : "";

    if (!order_number) {
      return json(origin, { ok: false, error: "Missing order_number" }, 400);
    }

    const { data: order, error } = await admin
      .from("orders")
      .select(
        [
          "order_number",
          "full_name",
          "email",
          "phone",
          "address",
          "items",
          "totals",
          "currency",
          "created_at",
          "payment_method",
          "payment_provider",
          "payment_status",
          "provider_metadata",
          "paid_at",
          "user_id",
          "guest_access_token_hash",
          "guest_access_token_expires_at",
        ].join(","),
      )
      .eq("order_number", order_number)
      .maybeSingle();

    if (error) return json(origin, { ok: false, error: error.message }, 500);
    if (!order)
      return json(origin, { ok: false, error: "Order not found" }, 404);

    // ✅ 1) Guest token path
    if (token) {
      const tokenHash = await sha256Hex(token);

      if (
        !order.guest_access_token_hash ||
        order.guest_access_token_hash !== tokenHash
      ) {
        return json(origin, { ok: false, error: "Invalid token" }, 403);
      }

      const exp = order.guest_access_token_expires_at
        ? new Date(order.guest_access_token_expires_at).getTime()
        : 0;

      if (!exp || Date.now() > exp) {
        return json(origin, { ok: false, error: "Token expired" }, 403);
      }

      const {
        guest_access_token_hash,
        guest_access_token_expires_at,
        ...safe
      } = order as any;
      return json(origin, { ok: true, order: safe }, 200);
    }

    // ✅ 2) Signed-in user path
    const bearer = getBearerToken(req);

    // If bearer missing OR is an sb_* style token, treat as not signed in
    if (!bearer || bearer.startsWith("sb_")) {
      return json(
        origin,
        { ok: false, error: "Missing token. Please sign in." },
        401,
      );
    }

    const { data: userRes, error: userErr } =
      await authClient.auth.getUser(bearer);
    if (userErr || !userRes?.user) {
      return json(origin, { ok: false, error: "Unauthorized" }, 401);
    }

    if (!order.user_id || order.user_id !== userRes.user.id) {
      return json(origin, { ok: false, error: "Not allowed" }, 403);
    }

    const { guest_access_token_hash, guest_access_token_expires_at, ...safe } =
      order as any;
    return json(origin, { ok: true, order: safe }, 200);
  } catch (e) {
    return json(
      origin,
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      500,
    );
  }
});
