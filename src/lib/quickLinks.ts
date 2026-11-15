import { defaultQuickLinkItems } from "@/mocks/quickLinks";
import { getCollection } from "@/lib/collections";
import { readAdminToken } from "@/lib/adminStaffStore";
import { readJson, writeJson } from "@/lib/persistent";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { QuickLinkItem, QuickLinksSettings, QuickLinkTargetType } from "@/types/quickLink";

const CACHE_KEY = "eticaretv8_quick_links_cache";
const SETTINGS_ID = "quick_links";
export const QUICK_LINKS_EVENT = "eticaretv8:quick-links-updated";

export const QUICK_LINK_TARGET_LABELS: Record<QuickLinkTargetType, string> = {
  koleksiyon: "Vitrin koleksiyonu",
  kategori: "Kategori sayfası",
  adres: "Özel adres",
};

const isTargetType = (value: unknown): value is QuickLinkTargetType =>
  value === "koleksiyon" || value === "kategori" || value === "adres";

const cloneItem = (raw: Partial<QuickLinkItem> | null | undefined, index: number): QuickLinkItem => ({
  id: String(raw?.id ?? `ql-${index}-${Date.now().toString(36)}`),
  label: String(raw?.label ?? "Yeni Kısayol"),
  imageUrl: String(raw?.imageUrl ?? ""),
  icon: String(raw?.icon ?? "ri-flashlight-line"),
  targetType: isTargetType(raw?.targetType) ? raw.targetType : "koleksiyon",
  target: String(raw?.target ?? "gunun"),
  active: raw?.active === undefined ? true : Boolean(raw.active),
});

const QUICK_LINKS_SEED_VERSION = 3;

const defaultSettings = (): QuickLinksSettings => ({
  items: defaultQuickLinkItems.map((item, index) => cloneItem(item as Partial<QuickLinkItem>, index)),
  seedVersion: QUICK_LINKS_SEED_VERSION,
});

/**
 * Eksik alanları varsayılanlarla tamamlar; eski kayıtlarla uyumludur.
 * Kayıtlı ayarlarda gece indirimi kısayolu yoksa bir kez otomatik eklenir.
 */
export const normalizeQuickLinks = (raw?: Partial<QuickLinksSettings> | null): QuickLinksSettings => {
  if (!raw || !Array.isArray(raw.items)) return defaultSettings();

  const items = raw.items.map((item, index) => cloneItem(item, index));
  const seedVersion = Number(raw.seedVersion ?? 1);

  if (seedVersion < 2 && !items.some((item) => item.target === "gece")) {
    const template = defaultQuickLinkItems.find((item) => item.target === "gece");
    if (template) {
      const nightItem = cloneItem(template as Partial<QuickLinkItem>, items.length);
      const avantajIndex = items.findIndex((item) => item.target === "avantajli");
      if (avantajIndex >= 0) items.splice(avantajIndex, 0, nightItem);
      else items.push(nightItem);
    }
  }

  // Gece indirimi rozeti eski görselle kaydedilmişse yeni gece logosuna geçir.
  if (seedVersion < 3) {
    const nightTemplate = defaultQuickLinkItems.find((item) => item.target === "gece");
    const nightItem = items.find((item) => item.target === "gece");
    const isLegacyNightImage =
      Boolean(nightItem?.imageUrl) &&
      nightItem!.imageUrl.includes("ql-gece-2026") &&
      !nightItem!.imageUrl.includes("nocache=true");
    if (nightTemplate && nightItem && isLegacyNightImage) {
      nightItem.imageUrl = String(nightTemplate.imageUrl);
    }
  }

  return { items, seedVersion: QUICK_LINKS_SEED_VERSION };
};

let cache: QuickLinksSettings = normalizeQuickLinks(readJson<Partial<QuickLinksSettings> | null>(CACHE_KEY, null));
let inFlight: Promise<QuickLinksSettings> | null = null;

export const getQuickLinks = (): QuickLinksSettings => cache;

const applyQuickLinks = (value: QuickLinksSettings): QuickLinksSettings => {
  cache = value;
  writeJson(CACHE_KEY, value);
  try {
    window.dispatchEvent(new Event(QUICK_LINKS_EVENT));
  } catch {
    /* event may be unavailable */
  }
  return value;
};

/** Kısayolları sunucudan okur; hata olursa son bilinen değer korunur. */
export const fetchQuickLinks = async (): Promise<QuickLinksSettings> => {
  if (!isSupabaseConfigured) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("site-settings", {
        body: { action: "read", id: SETTINGS_ID },
      });
      if (error) return cache;
      const payload = data as { ok?: boolean; settings?: Partial<QuickLinksSettings> | null } | null;
      if (!payload?.ok || !payload.settings) return cache;
      return applyQuickLinks(normalizeQuickLinks(payload.settings));
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

export interface QuickLinksSaveResult {
  ok: boolean;
  code?: string;
  message?: string;
}

/** Kısayolları sunucuya yazar; yazma işlemi yönetici oturumu ile doğrulanır. */
export const saveQuickLinks = async (value: QuickLinksSettings): Promise<QuickLinksSaveResult> => {
  const normalized = normalizeQuickLinks(value);
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
        message: "Kısayollar kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
      };
    }

    const payload = data as { ok?: boolean; code?: string; message?: string } | null;
    if (!payload?.ok) {
      return {
        ok: false,
        code: String(payload?.code ?? "error"),
        message: String(payload?.message ?? "Kısayollar kaydedilemedi."),
      };
    }

    applyQuickLinks(normalized);
    return { ok: true };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Kısayollar kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
    };
  }
};

export const subscribeQuickLinks = (listener: () => void): (() => void) => {
  window.addEventListener(QUICK_LINKS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(QUICK_LINKS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};

/** Kısayolun gideceği adresi üretir. */
export const resolveQuickLinkHref = (item: QuickLinkItem): string => {
  const target = item.target.trim();
  if (!target) return "/kategoriler";
  if (item.targetType === "koleksiyon") {
    const collection = getCollection(target);
    if (collection) return collection.path;
    return `/kategoriler?koleksiyon=${encodeURIComponent(target)}`;
  }
  if (item.targetType === "kategori") {
    return target.startsWith("/") ? target : `/kategoriler/${encodeURIComponent(target)}`;
  }
  return target;
};

/** Mağaza vitrininde görünecek (aktif) kısayollar. */
export const visibleQuickLinks = (settings: QuickLinksSettings): QuickLinkItem[] =>
  settings.items.filter((item) => item.active);

export const QUICK_LINK_BADGE_MAX_BYTES = 6 * 1024 * 1024;

/** Yuvarlak rozet için yüklenen görseli kareye kırpıp küçültür. */
export const createQuickLinkImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Yalnızca JPG, PNG veya WEBP görseli yükleyebilirsiniz."));
      return;
    }
    if (file.size > QUICK_LINK_BADGE_MAX_BYTES) {
      reject(new Error("Görsel boyutu en fazla 6 MB olabilir."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Görsel okunamadı. Lütfen başka bir dosya deneyin."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Görsel açılamadı. Lütfen başka bir dosya deneyin."));
      image.onload = () => {
        const size = 320;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Görsel işlenemedi. Lütfen tekrar deneyin."));
          return;
        }

        const source = Math.min(image.width, image.height);
        const offsetX = (image.width - source) / 2;
        const offsetY = (image.height - source) / 2;
        context.drawImage(image, offsetX, offsetY, source, source, 0, 0, size, size);

        const dataUrl = canvas.toDataURL("image/webp", 0.85);
        resolve(dataUrl.startsWith("data:image/webp") ? dataUrl : canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = String(reader.result ?? "");
    };
    reader.readAsDataURL(file);
  });