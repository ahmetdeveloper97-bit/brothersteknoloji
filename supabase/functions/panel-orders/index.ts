import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const ORDER_STATUSES = ["Hazırlanıyor", "Kargoda", "Teslim Edildi", "İptal"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, code: "not_configured", message: "Sunucu yapılandırması eksik." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const action = String(payload.action ?? "list");
  const key = String(payload.key ?? "").trim();

  if (action === "exists") {
    const { data, error } = await admin.from("panel_access").select("id").limit(1);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true, configured: Array.isArray(data) && data.length > 0 });
  }

  if (action === "setup") {
    if (key.length < 16) {
      return json({ ok: false, code: "weak_key", message: "Panel anahtarı en az 16 karakter olmalı." }, 400);
    }
    const { data: existing, error: readError } = await admin.from("panel_access").select("id").limit(1);
    if (readError) return json({ ok: false, code: "db_error", message: readError.message }, 500);
    if (existing && existing.length > 0) {
      return json(
        { ok: false, code: "already_configured", message: "Panel anahtarı daha önce oluşturulmuş." },
        409,
      );
    }
    const { error } = await admin.from("panel_access").insert({ id: 1, access_key: key });
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  const { data: accessRows, error: accessError } = await admin
    .from("panel_access")
    .select("access_key")
    .eq("id", 1)
    .limit(1);

  if (accessError) {
    return json({ ok: false, code: "db_error", message: accessError.message }, 500);
  }
  if (!accessRows || accessRows.length === 0) {
    return json({ ok: false, code: "not_configured", message: "Panel anahtarı henüz oluşturulmamış." }, 409);
  }
  if (String(accessRows[0].access_key) !== key) {
    return json({ ok: false, code: "unauthorized", message: "Panel anahtarı geçersiz." }, 401);
  }

  if (action === "list") {
    const { data, error } = await admin
      .from("iyzico_payments")
      .select(
        "order_no,status,order_status,amount,installment,buyer_name,buyer_email,buyer_phone,buyer_city,buyer_address,card_mask,items,error_message,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true, orders: data ?? [] });
  }

  if (action === "status") {
    const orderNo = String(payload.orderNo ?? "").trim();
    const orderStatus = String(payload.orderStatus ?? "").trim();
    if (!orderNo) {
      return json({ ok: false, code: "invalid_order", message: "Sipariş numarası gerekli." }, 400);
    }
    if (!ORDER_STATUSES.includes(orderStatus)) {
      return json({ ok: false, code: "invalid_status", message: "Geçersiz sipariş durumu." }, 400);
    }
    const { error } = await admin
      .from("iyzico_payments")
      .update({ order_status: orderStatus, updated_at: new Date().toISOString() })
      .eq("order_no", orderNo);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  return json({ ok: false, code: "unknown_action", message: "Bilinmeyen işlem." }, 400);
});
