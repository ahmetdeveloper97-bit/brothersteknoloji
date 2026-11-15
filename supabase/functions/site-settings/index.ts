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

const SETTINGS_ID = "footer";

/** Kayıt anahtarları; her anahtar site_settings tablosunda ayrı bir satırdır. */
const ALLOWED_SETTINGS_IDS = ["footer", "bank_accounts", "quick_links", "showcase_pages", "announcement"];

const resolveSettingsId = (value: unknown, fallback: string): string | null => {
  if (value === undefined || value === null || value === "") return fallback;
  const id = String(value);
  return ALLOWED_SETTINGS_IDS.includes(id) ? id : null;
};

/** Yönetici oturum anahtarını (admin_sessions) doğrular. Aktif personel yoksa false döner. */
const verifyAdminSession = async (
  admin: ReturnType<typeof createClient>,
  token: string,
): Promise<boolean> => {
  if (!token) return false;
  const { data, error } = await admin
    .from("admin_sessions")
    .select("staff_id,expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return false;
  if (new Date(String(data.expires_at)).getTime() < Date.now()) return false;

  const { data: member, error: memberError } = await admin
    .from("admin_staff")
    .select("id,active")
    .eq("id", String(data.staff_id))
    .maybeSingle();
  if (memberError || !member) return false;
  return Boolean(member.active);
};

/** Eski panel anahtarı yalnızca yedek yol olarak desteklenir. */
const verifyPanelKey = async (
  admin: ReturnType<typeof createClient>,
  key: string,
): Promise<boolean> => {
  if (!key) return false;
  const { data, error } = await admin.from("panel_access").select("access_key").eq("id", 1).limit(1);
  if (error || !data || data.length === 0) return false;
  return String(data[0].access_key) === key;
};

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

  const action = String(payload.action ?? "read");

  if (action === "read") {
    const settingsId = resolveSettingsId(payload.id, SETTINGS_ID);
    if (!settingsId) {
      return json({ ok: false, code: "invalid_settings_id", message: "Geçersiz ayar anahtarı." }, 400);
    }

    const { data, error } = await admin
      .from("site_settings")
      .select("data")
      .eq("id", settingsId)
      .maybeSingle();

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true, settings: data?.data ?? null });
  }

  if (action === "save") {
    const token = String(payload.token ?? "").trim();
    const key = String(payload.key ?? "").trim();
    const settingsId = resolveSettingsId(payload.id, SETTINGS_ID);
    if (!settingsId) {
      return json({ ok: false, code: "invalid_settings_id", message: "Geçersiz ayar anahtarı." }, 400);
    }

    const authorized = (await verifyAdminSession(admin, token)) || (await verifyPanelKey(admin, key));
    if (!authorized) {
      return json(
        {
          ok: false,
          code: "unauthorized",
          message: "Oturumunuz sona erdi. Lütfen Panel'e yeniden giriş yapıp tekrar deneyin.",
        },
        401,
      );
    }

    const settings = payload.settings;
    if (!settings || typeof settings !== "object") {
      return json({ ok: false, code: "invalid_settings", message: "Kaydedilecek ayar bulunamadı." }, 400);
    }

    const { error } = await admin.from("site_settings").upsert(
      {
        id: settingsId,
        data: settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  return json({ ok: false, code: "unknown_action", message: "Bilinmeyen işlem." }, 400);
});
