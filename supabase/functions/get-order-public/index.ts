import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
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
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { order_number, token } = await req.json();

    if (!order_number || !token) {
      return json({ error: "Missing order_number or token" }, 400);
    }

    const tokenHash = await sha256Hex(String(token));

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "order_number,full_name,email,phone,address,items,totals,currency,created_at,payment_method,payment_provider,payment_status,provider_metadata,paid_at,guest_access_token_hash,guest_access_token_expires_at",
      )
      .eq("order_number", String(order_number))
      .maybeSingle();

    if (error) return json({ error: error.message }, 500);
    if (!order) return json({ error: "Order not found" }, 404);

    if (
      !order.guest_access_token_hash ||
      order.guest_access_token_hash !== tokenHash
    ) {
      return json({ error: "Invalid token" }, 403);
    }

    const exp = order.guest_access_token_expires_at
      ? new Date(order.guest_access_token_expires_at).getTime()
      : 0;

    if (!exp || Date.now() > exp) return json({ error: "Token expired" }, 403);

    // Strip secrets before returning
    const { guest_access_token_hash, guest_access_token_expires_at, ...safe } =
      order as any;

    return json({ ok: true, order: safe }, 200);
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      500,
    );
  }
});
