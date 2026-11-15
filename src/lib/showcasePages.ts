import { defaultShowcasePages } from "@/mocks/showcasePages";
import { products } from "@/lib/catalog";
import { collections } from "@/lib/collections";
import { readAdminToken } from "@/lib/adminStaffStore";
import { readJson, writeJson } from "@/lib/persistent";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { AdminSectionId } from "@/types/adminRoles";
import type { Product } from "@/types/store";
import type { ShowcasePageKey, ShowcasePageSettings, ShowcasePagesSettings } from "@/types/showcasePage";

const CACHE_KEY = "eticaretv8_showcase_pages_cache";
const SETTINGS_ID = "showcase_pages";
export const SHOWCASE_EVENT = "eticaretv8:showcase-pages-updated";

export const SHOWCASE_KEYS: ShowcasePageKey[] = ["gunun", "haftanin", "kampanya", "gece", "avantajli"];

export const SHOWCASE_PATHS: Record<ShowcasePageKey, string> = {
  gunun: "/gunun-urunleri",
  haftanin: "/haftanin-urunleri",
  kampanya: "/kampanyalar",
  gece: "/gece-indirimi",
  avantajli: "/avantajli-urunler",
};

export const SHOWCASE_META: Record<ShowcasePageKey, { label: string; icon: string; hint: string }> = {
  gunun: {
    label: "Günün Ürünleri",
    icon: "ri-sun-line",
    hint: "Günün öne çıkan ürünlerini seçin; sıralama sayfadaki görünüm sırasıdır.",
  },
  haftanin: {
    label: "Haftanın Ürünleri",
    icon: "ri-calendar-event-line",
    hint: "Haftanın seçkisini oluşturun. Her hafta ürünleri değiştirmeniz yeterli.",
  },
  kampanya: {
    label: "Kampanya Vitrini",
    icon: "ri-percent-line",
    hint: "İndirimli ürünlerin gösterileceği kampanya sayfasının içeriği.",
  },
  gece: {
    label: "Gece İndirimi",
    icon: "ri-moon-line",
    hint: "Saat 23:59'dan sonra geçerli olan gece fırsatı ürünlerini ve saat aralığını yönetin.",
  },
  avantajli: {
    label: "Avantajlı Ürünler",
    icon: "ri-price-tag-3-line",
    hint: "Bütçe dostu ürünlerin listelendiği sayfanın içeriği.",
  },
};

/** Yönetim menüsündeki bölüm kimlikleri */
export const SHOWCASE_SECTIONS: Record<ShowcasePageKey, AdminSectionId> = {
  gunun: "showcase-gunun",
  haftanin: "showcase-haftanin",
  kampanya: "showcase-kampanya",
  gece: "showcase-gece",
  avantajli: "showcase-avantajli",
};

export const showcaseKeyOfSection = (section: AdminSectionId): ShowcasePageKey | null => {
  const entry = (Object.entries(SHOWCASE_SECTIONS) as Array<[ShowcasePageKey, AdminSectionId]>).find(
    ([, id]) => id === section,
  );
  return entry ? entry[0] : null;
};

const catalog = products as Product[];

/** Kayıt yoksa sayfanın boş kalmaması için koleksiyon kurallarıyla öneri listesi üretir. */
const suggestedProductIds = (key: ShowcasePageKey): string[] =>
  collections[key]
    .apply(catalog, { pcIds: new Set<string>() })
    .slice(0, 16)
    .map((product) => product.id);

const defaultPage = (key: ShowcasePageKey): ShowcasePageSettings => ({
  title: defaultShowcasePages[key].title,
  description: defaultShowcasePages[key].description,
  imageUrl: defaultShowcasePages[key].imageUrl,
  productIds: suggestedProductIds(key),
  active: true,
  startTime: defaultShowcasePages[key].startTime ?? "23:59",
  endTime: defaultShowcasePages[key].endTime ?? "06:00",
  scheduleEnabled: defaultShowcasePages[key].scheduleEnabled ?? key === "gece",
});

const defaultSettings = (): ShowcasePagesSettings => ({
  pages: {
    gunun: defaultPage("gunun"),
    haftanin: defaultPage("haftanin"),
    kampanya: defaultPage("kampanya"),
    gece: defaultPage("gece"),
    avantajli: defaultPage("avantajli"),
  },
});

const normalizePage = (key: ShowcasePageKey, raw?: Partial<ShowcasePageSettings> | null): ShowcasePageSettings => {
  if (!raw) return defaultPage(key);
  const fallback = defaultPage(key);
  return {
    title: String(raw.title ?? defaultShowcasePages[key].title),
    description: String(raw.description ?? defaultShowcasePages[key].description),
    imageUrl: String(raw.imageUrl ?? defaultShowcasePages[key].imageUrl),
    productIds: Array.isArray(raw.productIds) ? raw.productIds.map((id) => String(id)) : [],
    active: raw.active === undefined ? true : Boolean(raw.active),
    startTime: String(raw.startTime ?? fallback.startTime ?? "23:59"),
    endTime: String(raw.endTime ?? fallback.endTime ?? "06:00"),
    scheduleEnabled: raw.scheduleEnabled === undefined ? Boolean(fallback.scheduleEnabled) : Boolean(raw.scheduleEnabled),
  };
};

/** Eksik alanları varsayılanlarla tamamlar; kayıtlı boş liste de korunur. */
export const normalizeShowcasePages = (
  raw?: Partial<ShowcasePagesSettings> | null,
): ShowcasePagesSettings => {
  const source = raw?.pages ?? {};
  return {
    pages: {
      gunun: normalizePage("gunun", source.gunun),
      haftanin: normalizePage("haftanin", source.haftanin),
      kampanya: normalizePage("kampanya", source.kampanya),
      gece: normalizePage("gece", source.gece),
      avantajli: normalizePage("avantajli", source.avantajli),
    },
  };
};

let cache: ShowcasePagesSettings = normalizeShowcasePages(
  readJson<Partial<ShowcasePagesSettings> | null>(CACHE_KEY, null),
);
let inFlight: Promise<ShowcasePagesSettings> | null = null;

export const getShowcasePages = (): ShowcasePagesSettings => cache;

export const getShowcasePage = (key: ShowcasePageKey): ShowcasePageSettings => cache.pages[key];

const applyShowcasePages = (value: ShowcasePagesSettings): ShowcasePagesSettings => {
  cache = value;
  writeJson(CACHE_KEY, value);
  try {
    window.dispatchEvent(new Event(SHOWCASE_EVENT));
  } catch {
    /* event may be unavailable */
  }
  return value;
};

/** Ayarları sunucudan okur; hata olursa son bilinen değer korunur. */
export const fetchShowcasePages = async (): Promise<ShowcasePagesSettings> => {
  if (!isSupabaseConfigured) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("site-settings", {
        body: { action: "read", id: SETTINGS_ID },
      });
      if (error) return cache;
      const payload = data as { ok?: boolean; settings?: Partial<ShowcasePagesSettings> | null } | null;
      if (!payload?.ok || !payload.settings) return cache;
      return applyShowcasePages(normalizeShowcasePages(payload.settings));
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

export interface ShowcaseSaveResult {
  ok: boolean;
  code?: string;
  message?: string;
}

/** Tek bir vitrin sayfasını kaydeder, diğer sayfaların ayarlarını korur. */
export const saveShowcasePage = async (
  key: ShowcasePageKey,
  page: ShowcasePageSettings,
): Promise<ShowcaseSaveResult> => {
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

  const next = normalizeShowcasePages({
    pages: { ...cache.pages, [key]: page },
  });

  try {
    const { data, error } = await supabase.functions.invoke("site-settings", {
      body: { action: "save", id: SETTINGS_ID, token, settings: next },
    });

    if (error) {
      return {
        ok: false,
        code: "network",
        message: "Sayfa kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
      };
    }

    const payload = data as { ok?: boolean; code?: string; message?: string } | null;
    if (!payload?.ok) {
      return {
        ok: false,
        code: String(payload?.code ?? "error"),
        message: String(payload?.message ?? "Sayfa kaydedilemedi."),
      };
    }

    applyShowcasePages(next);
    return { ok: true };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Sayfa kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
    };
  }
};

export const subscribeShowcasePages = (listener: () => void): (() => void) => {
  window.addEventListener(SHOWCASE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(SHOWCASE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};

export const SHOWCASE_IMAGE_MAX_BYTES = 8 * 1024 * 1024;

/** Sayfa üstü için geniş görsel: ortadan kırpılıp 1600×480 boyutuna indirilir. */
export const createShowcaseImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      reject(new Error("Yalnızca JPG, PNG veya WEBP görseli yükleyebilirsiniz."));
      return;
    }
    if (file.size > SHOWCASE_IMAGE_MAX_BYTES) {
      reject(new Error("Görsel boyutu en fazla 8 MB olabilir."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Görsel okunamadı. Lütfen başka bir dosya deneyin."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Görsel açılamadı. Lütfen başka bir dosya deneyin."));
      image.onload = () => {
        const targetWidth = 1600;
        const targetHeight = 480;
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Görsel işlenemedi. Lütfen tekrar deneyin."));
          return;
        }

        const targetRatio = targetWidth / targetHeight;
        const sourceRatio = image.width / image.height;
        let sourceWidth = image.width;
        let sourceHeight = image.height;
        if (sourceRatio > targetRatio) {
          sourceWidth = image.height * targetRatio;
        } else {
          sourceHeight = image.width / targetRatio;
        }
        const offsetX = (image.width - sourceWidth) / 2;
        const offsetY = (image.height - sourceHeight) / 2;
        context.drawImage(image, offsetX, offsetY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

        const dataUrl = canvas.toDataURL("image/webp", 0.85);
        resolve(dataUrl.startsWith("data:image/webp") ? dataUrl : canvas.toDataURL("image/jpeg", 0.85));
      };
      image.src = String(reader.result ?? "");
    };
    reader.readAsDataURL(file);
  });