import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("authorization") ?? "";
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

    if (!attempt_id || !order_id)
      return json({ error: "Missing attempt_id or order_id" }, 400);

    // Update attempt
    const { error: aErr } = await supabase
      .from("payment_attempts")
      .update({ status: "paid", swish_verified_at: new Date().toISOString() })
      .eq("id", attempt_id)
      .eq("order_id", order_id);

    if (aErr) return json({ error: aErr.message }, 500);

    // Update order
    const { error: oErr } = await supabase
      .from("orders")
      .update({
        payment_status: "PAID",
        payment_method: "SWISH",
        paid_at: new Date().toISOString(),
      })
      .eq("id", order_id);

    if (oErr) return json({ error: oErr.message }, 500);

    return json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return json({ error: msg }, 500);
  }
});
