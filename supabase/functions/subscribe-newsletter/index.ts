// supabase/functions/subscribe-newsletter/index.ts

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// ✅ Add your frontend origins here (local + production)
const ALLOWED_ORIGINS = new Set([
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  // Change this if your Vercel URL is different
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

function isValidEmail(email: string) {
  const e = email.trim();
  // Simple practical check (avoid over-complication)
  return e.length <= 254 && e.includes("@") && e.includes(".");
}

serve(async (req) => {
  const origin = req.headers.get("origin");

  // ✅ Preflight must return 200
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
      return json(origin, { error: "Missing Supabase env vars" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const { email } = (await req.json()) as { email?: string };

    if (!email || !isValidEmail(email)) {
      return json(origin, { error: "Invalid email" }, 400);
    }

    // ✅ Insert subscriber
    // If email already exists (unique constraint), treat as "already subscribed"
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      // Postgres unique violation is usually code "23505"
      // Supabase error structure varies a bit, so we handle broadly.
      const msg = String(error.message || "").toLowerCase();
      const isDuplicate =
        (error as any).code === "23505" || msg.includes("duplicate");

      if (isDuplicate) {
        return json(origin, { ok: true, already: true }, 200);
      }

      return json(
        origin,
        { error: "Insert failed", details: error.message },
        500,
      );
    }

    return json(origin, { ok: true }, 200);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return json(origin, { error: msg }, 500);
  }
});
