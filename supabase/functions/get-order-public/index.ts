import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "https://tropinord-store.vercel.app",
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

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json(origin, { error: "Missing Supabase env vars" }, 500);
    }

    const { order_number, token } = await req.json();

    if (!order_number) {
      return json(origin, { error: "Missing order_number" }, 400);
    }

    // Use service role to read the order (RLS bypass on server)
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id,order_number,user_id,full_name,email,phone,address,items,totals,currency,created_at,payment_method,payment_provider,payment_status,paid_at,provider_metadata,guest_access_token_hash,guest_access_token_expires_at",
      )
      .eq("order_number", String(order_number))
      .maybeSingle();

    if (error) return json(origin, { error: error.message }, 500);
    if (!order) return json(origin, { error: "Order not found" }, 404);

    // --- Auth path (logged in user can view their own order) ---
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    let authedUserId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const jwt = authHeader.slice("Bearer ".length);
      const supabaseUser = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
      });
      const { data: userData } = await supabaseUser.auth.getUser();
      authedUserId = userData?.user?.id ?? null;
    }

    const isOwner =
      authedUserId && order.user_id && authedUserId === order.user_id;

    // --- Guest token path ---
    let guestOk = false;
    if (token) {
      const tokenHash = await sha256Hex(String(token));

      if (
        order.guest_access_token_hash &&
        order.guest_access_token_hash === tokenHash
      ) {
        const exp = order.guest_access_token_expires_at
          ? new Date(order.guest_access_token_expires_at).getTime()
          : 0;

        if (exp && Date.now() <= exp) {
          guestOk = true;
        }
      }
    }

    if (!isOwner && !guestOk) {
      return json(origin, { error: "Unauthorized" }, 403);
    }

    // Strip secrets before returning
    const {
      guest_access_token_hash,
      guest_access_token_expires_at,
      user_id,
      id,
      ...safe
    } = order as any;

    // Return FLAT object (easy for React: setOrder(data))
    return json(origin, { ok: true, ...safe }, 200);
  } catch (e) {
    return json(
      origin,
      { error: e instanceof Error ? e.message : "Unknown error" },
      500,
    );
  }
});
