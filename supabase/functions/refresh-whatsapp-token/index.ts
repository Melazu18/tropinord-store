/**
 * supabase/functions/refresh-whatsapp-token/index.ts
 *
 * Validates the configured WhatsApp Business API access token.
 *
 * Security:
 * - verify_jwt=false in supabase/config.toml.
 * - Require either:
 *   - x-internal-secret header matching INTERNAL_FUNCTION_SECRET, OR
 *   - Authorization: Bearer matching SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

function isAuthorized(req: Request): boolean {
  const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const hdrSecret = req.headers.get("x-internal-secret");
  if (internalSecret && hdrSecret && hdrSecret === internalSecret) return true;

  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (
    serviceKey &&
    auth &&
    auth.startsWith("Bearer ") &&
    auth.slice("Bearer ".length) === serviceKey
  ) {
    return true;
  }

  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!isAuthorized(req)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401,
    });
  }

  try {
    const currentToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
    if (!currentToken) {
      return new Response(JSON.stringify({ error: "WHATSAPP_ACCESS_TOKEN not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    if (!phoneNumberId) {
      return new Response(JSON.stringify({ error: "WHATSAPP_PHONE_NUMBER_ID not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const testResponse = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    const isJson = (testResponse.headers.get("content-type") || "").includes("application/json");
    const payload = isJson ? await testResponse.json() : await testResponse.text();

    if (!testResponse.ok) {
      return new Response(
        JSON.stringify({
          status: "token_invalid",
          message: "WhatsApp token appears invalid or expired",
          checked_at: new Date().toISOString(),
          details: payload,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    return new Response(
      JSON.stringify({
        status: "valid",
        message: "WhatsApp token is valid",
        checked_at: new Date().toISOString(),
        details: payload,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
