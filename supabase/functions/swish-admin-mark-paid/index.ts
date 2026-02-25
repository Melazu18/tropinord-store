import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

type OrderRow = {
  id: string;
  order_number: string;
  full_name: string;
  email: string;
  phone: string | null;
  address: unknown;
  items: unknown;
  totals: unknown;
  currency: string;
  payment_status: string;
  provider_session_id: string | null;
  paid_at: string | null;
};

function getFunctionsBaseUrl() {
  const explicit = Deno.env.get("SUPABASE_FUNCTIONS_URL");
  if (explicit) return explicit.replace(/\/$/, "");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  return `${supabaseUrl.replace(/\/$/, "")}/functions/v1`;
}

async function notifyPaid(order: OrderRow) {
  const functionsBase = getFunctionsBaseUrl();
  const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (internalSecret && internalSecret.trim()) headers["x-internal-secret"] = internalSecret.trim();
  else headers["Authorization"] = `Bearer ${serviceKey}`;

  const resp = await fetch(`${functionsBase}/send-notifications`, {
    method: "POST",
    headers,
    body: JSON.stringify({ event_type: "order.paid", order }),
  });

  const text = await resp.text();
  if (!resp.ok) {
    console.error("send-notifications failed:", resp.status, text);
  }
}

serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("authorization") ?? req.headers.get("Authorization") ?? "";
    const supabaseUser = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData } = await supabaseUser.auth.getUser();
    if (!userData?.user) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(supabaseUrl, serviceKey);

    // Admin check
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const { attempt_id, order_id } = await req.json();
    if (!attempt_id || !order_id) return json({ error: "Missing attempt_id or order_id" }, 400);

    // Load attempt and ensure it matches order + is pending
    const { data: attempt, error: atErr } = await supabase
      .from("payment_attempts")
      .select("id,order_id,status,reference")
      .eq("id", attempt_id)
      .single();

    if (atErr || !attempt) return json({ error: "Attempt not found" }, 404);
    if (attempt.order_id !== order_id) return json({ error: "Attempt/order mismatch" }, 400);
    if (attempt.status === "paid") return json({ ok: true, already_paid: true });

    // Update attempt
    const { error: aErr } = await supabase
      .from("payment_attempts")
      .update({ status: "paid", swish_verified_at: new Date().toISOString() })
      .eq("id", attempt_id)
      .eq("order_id", order_id);

    if (aErr) return json({ error: aErr.message }, 500);

    // Update order + fetch full row for notification payload
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .update({
        payment_status: "PAID",
        payment_method: "SWISH",
        payment_provider: "SWISH",
        paid_at: new Date().toISOString(),
      })
      .eq("id", order_id)
      .select("id,order_number,full_name,email,phone,address,items,totals,currency,payment_status,provider_session_id,paid_at")
      .single();

    if (oErr || !order) return json({ error: oErr?.message ?? "Order update failed" }, 500);

    // Audit
    await supabase.from("payment_events").insert({
      order_id,
      provider: "SWISH",
      event_type: "swish_manual.verified_paid",
      raw: { attempt_id, reference: attempt.reference, verified_by: userData.user.id },
    });

    // Notify (customer + admin)
    await notifyPaid(order as OrderRow);

    return json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return json({ error: msg }, 500);
  }
});