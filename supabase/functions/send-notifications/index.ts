/**
 * supabase/functions/send-notifications/index.ts
 *
 * Internal notification dispatcher.
 *
 * Security:
 * - verify_jwt=false; this MUST NOT be publicly callable.
 * - Require Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
 *   OR x-internal-secret: <INTERNAL_FUNCTION_SECRET>
 *
 * Behavior (safe default):
 * - Logs the notification request.
 * - Optionally sends WhatsApp message if env vars are configured.
 * - You can extend this to send email (Resend/SendGrid/Postmark) later.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

type NotificationPayload = {
  event_type: string;
  order?: unknown;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

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

async function maybeSendWhatsApp(payload: NotificationPayload) {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const adminPhone = Deno.env.get("WHATSAPP_ADMIN_PHONE"); // E.164, e.g. +4670...

  if (!token || !phoneNumberId || !adminPhone) return { skipped: true };

  // Keep message short and non-sensitive
  const msg = `TropiNord: ${payload.event_type} (order update).`;

  const resp = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: adminPhone.replace(/^\+/, ""), // Meta expects digits in many examples
      type: "text",
      text: { body: msg },
    }),
  });

  const body = await resp.text();
  if (!resp.ok) return { skipped: false, ok: false, status: resp.status, body };

  return { skipped: false, ok: true, body };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  if (!isAuthorized(req)) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

  try {
    const payload = (await req.json()) as NotificationPayload;
    if (!payload?.event_type) return json({ error: "Missing event_type" }, 400);

    console.log("Notification requested:", payload.event_type);

    // Best-effort persist (if table exists)
    if (supabase) {
      try {
        await supabase.from("notification_events").insert({
          event_type: payload.event_type,
          raw: payload,
        });
      } catch (e) {
        // Table may not exist; ignore.
      }
    }

    const whatsappResult = await maybeSendWhatsApp(payload);

    return json({ ok: true, whatsapp: whatsappResult }, 200);
  } catch (error) {
    console.error("send-notifications error:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
