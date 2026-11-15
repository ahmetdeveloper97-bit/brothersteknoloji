import { defaultAnnouncementItems } from "@/mocks/announcement";
import { readAdminToken } from "@/lib/adminStaffStore";
import { readJson, writeJson } from "@/lib/persistent";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { AnnouncementItem, AnnouncementSettings } from "@/types/announcement";

const CACHE_KEY = "eticaretv8_announcement_settings_cache";
const SETTINGS_ID = "announcement";
export const ANNOUNCEMENT_EVENT = "eticaretv8:announcement-updated";
export const ANNOUNCEMENT_MAX_LENGTH = 120;

const cloneItem = (raw: Partial<AnnouncementItem> | null | undefined, index: number): AnnouncementItem => ({
  id: String(raw?.id ?? `ann-${index}-${Date.now().toString(36)}`),
  text: String(raw?.text ?? ""),
  active: raw?.active === undefined ? true : Boolean(raw.active),
});

export const normalizeAnnouncementSettings = (
  raw?: Partial<AnnouncementSettings> | null,
): AnnouncementSettings => {
  if (!raw || !Array.isArray(raw.items)) {
    return { items: defaultAnnouncementItems.map((item, index) => cloneItem(item, index)) };
  }
  return { items: raw.items.map((item, index) => cloneItem(item, index)) };
};

let cache: AnnouncementSettings = normalizeAnnouncementSettings(
  readJson<Partial<AnnouncementSettings> | null>(CACHE_KEY, null),
);
let inFlight: Promise<AnnouncementSettings> | null = null;

export const getAnnouncementSettings = (): AnnouncementSettings => cache;

const applySettings = (value: AnnouncementSettings): AnnouncementSettings => {
  cache = value;
  writeJson(CACHE_KEY, value);
  try {
    window.dispatchEvent(new Event(ANNOUNCEMENT_EVENT));
  } catch {
    /* event may be unavailable */
  }
  return value;
};

/** Sadece aktif ve dolu mesajlar gösterilir. */
export const visibleAnnouncementItems = (settings: AnnouncementSettings): AnnouncementItem[] =>
  settings.items.filter((item) => item.active && item.text.trim().length > 0);

/** Şeritte kayarak geçecek metni üretir. */
export const announcementLine = (settings: AnnouncementSettings): string => {
  const parts = visibleAnnouncementItems(settings).map((item) => item.text.trim());
  if (parts.length === 0) return "";
  return `${parts.join(" • ")} • `;
};

/** Ayarları sunucudan okur; hata olursa son bilinen değer korunur. */
export const fetchAnnouncementSettings = async (): Promise<AnnouncementSettings> => {
  if (!isSupabaseConfigured) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("site-settings", {
        body: { action: "read", id: SETTINGS_ID },
      });
      if (error) return cache;
      const payload = data as { ok?: boolean; settings?: Partial<AnnouncementSettings> | null } | null;
      if (!payload?.ok || !payload.settings) return cache;
      return applySettings(normalizeAnnouncementSettings(payload.settings));
    } catch {
      return cache;
    }
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
};

export interface AnnouncementSaveResult {
  ok: boolean;
  code?: string;
  message?: string;
}

/** Ayarları sunucuya yazar; yazma işlemi yönetici oturumu ile doğrulanır. */
export const saveAnnouncementSettings = async (
  value: AnnouncementSettings,
): Promise<AnnouncementSaveResult> => {
  const normalized = normalizeAnnouncementSettings(value);
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }

  const token = readAdminToken();
  if (!token) {
    return {
      ok: false,
      code: "unauthorized",
      message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapıp tekrar deneyin.",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("site-settings", {
      body: { action: "save", id: SETTINGS_ID, token, settings: normalized },
    });

    if (error) {
      return {
        ok: false,
        code: "network",
        message: "Duyuru şeridi kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
      };
    }

    const payload = data as { ok?: boolean; code?: string; message?: string } | null;
    if (!payload?.ok) {
      return {
        ok: false,
        code: String(payload?.code ?? "error"),
        message: String(payload?.message ?? "Duyuru şeridi kaydedilemedi."),
      };
    }

    applySettings(normalized);
    return { ok: true };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Duyuru şeridi kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
    };
  }
};

export const subscribeAnnouncementSettings = (listener: () => void): (() => void) => {
  window.addEventListener(ANNOUNCEMENT_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(ANNOUNCEMENT_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};