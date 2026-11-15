import { readAdminToken } from "@/lib/adminStaffStore";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { SitePage, SitePageInput, SitePageResult, SitePageSummary } from "@/types/sitePage";

export const SITE_PAGES_EVENT = "eticaretv8:site-pages-updated";

/** Mağazanın kendi kullandığı adresler; sayfa oluştururken kullanılamaz. */
export const RESERVED_SLUGS = [
  "arteadmin",
  "admin",
  "api",
  "auth",
  "giris",
  "hesabim",
  "odeme",
  "odeme-sonuc",
  "favoriler",
  "kargo-takip",
  "kategoriler",
  "urunler",
  "pc-toplama",
  "sayfa",
  "sepet",
  "gizlilik-politikasi",
  "cerez-politikasi",
  "iletisim",
  "destek",
  "sikca-sorulan-sorular",
  "havale-banka-bilgileri",
];

export const slugifyPage = (value: string): string =>
  value
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);

export const formatPageDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
};

let cachedPages: SitePageSummary[] = [];
let publicInFlight: Promise<SitePageSummary[]> | null = null;

export const getCachedPublicPages = (): SitePageSummary[] => cachedPages;

const applyPublicPages = (pages: SitePageSummary[]): SitePageSummary[] => {
  cachedPages = pages;
  try {
    window.dispatchEvent(new Event(SITE_PAGES_EVENT));
  } catch {
    /* event desteklenmiyorsa geç */
  }
  return pages;
};

export const fetchPublicPages = async (force = false): Promise<SitePageSummary[]> => {
  if (!isSupabaseConfigured) return cachedPages;
  if (publicInFlight) return publicInFlight;

  publicInFlight = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("site-pages", {
        body: { action: "public_list" },
      });
      if (error) return cachedPages;
      const payload = data as { ok?: boolean; pages?: SitePageSummary[] } | null;
      if (!payload?.ok || !Array.isArray(payload.pages)) return cachedPages;
      const normalized = payload.pages.map((page) => ({
        slug: String(page.slug ?? ""),
        title: String(page.title ?? ""),
        subtitle: String(page.subtitle ?? ""),
        coverImage: String(page.coverImage ?? ""),
        showInFooter: Boolean(page.showInFooter),
        sectionCount: Number(page.sectionCount ?? 0),
        updatedAt: String(page.updatedAt ?? ""),
      }));
      return force || cachedPages.length === 0 ? applyPublicPages(normalized) : normalized;
    } catch {
      return cachedPages;
    }
  })();

  try {
    return await publicInFlight;
  } finally {
    publicInFlight = null;
  }
};

/** Yönetici işlemlerinden sonra yayındaki sayfa listesini tazeler. */
const invalidatePublicPages = (): void => {
  cachedPages = [];
  void fetchPublicPages(true);
};

export const subscribePublicPages = (listener: () => void): (() => void) => {
  window.addEventListener(SITE_PAGES_EVENT, listener);
  return () => window.removeEventListener(SITE_PAGES_EVENT, listener);
};

export interface SitePageReadResult {
  ok: boolean;
  code?: string;
  message?: string;
  page?: SitePage;
}

export const fetchPublicPage = async (slug: string): Promise<SitePageReadResult> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }
  try {
    const { data, error } = await supabase.functions.invoke("site-pages", {
      body: { action: "public_get", slug },
    });
    if (error) {
      return { ok: false, code: "network", message: "Sayfa yüklenemedi. Lütfen tekrar deneyin." };
    }
    const payload = data as { ok?: boolean; code?: string; message?: string; page?: SitePage } | null;
    if (!payload?.ok || !payload.page) {
      return {
        ok: false,
        code: String(payload?.code ?? "not_found"),
        message: String(payload?.message ?? "Sayfa bulunamadı."),
      };
    }
    return { ok: true, page: payload.page };
  } catch {
    return { ok: false, code: "network", message: "Bağlantı kurulamadı." };
  }
};

const adminInvoke = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }
  const token = readAdminToken();
  if (!token) {
    return {
      ok: false,
      code: "unauthorized",
      message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapın.",
    };
  }
  try {
    const { data, error } = await supabase.functions.invoke("site-pages", { body: { ...body, token } });
    if (error) {
      let code = "network";
      let message = "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
      try {
        const context = (error as unknown as { context?: { json?: () => Promise<unknown> } }).context;
        if (context && typeof context.json === "function") {
          const parsed = (await context.json()) as { code?: string; message?: string } | null;
          if (parsed?.code) code = String(parsed.code);
          if (parsed?.message) message = String(parsed.message);
        }
      } catch {
        /* gövde okunamadı */
      }
      return { ok: false, code, message };
    }
    return (data as Record<string, unknown> | null) ?? { ok: false, code: "empty", message: "Boş yanıt." };
  } catch {
    return { ok: false, code: "network", message: "Bağlantı kurulamadı." };
  }
};

export interface AdminPagesResult {
  ok: boolean;
  code?: string;
  message?: string;
  pages: SitePage[];
}

export const adminListPages = async (): Promise<AdminPagesResult> => {
  const payload = await adminInvoke({ action: "admin_list" });
  if (!payload.ok) {
    return {
      ok: false,
      code: String(payload.code ?? "error"),
      message: String(payload.message ?? "Sayfalar yüklenemedi."),
      pages: [],
    };
  }
  return { ok: true, pages: Array.isArray(payload.pages) ? (payload.pages as SitePage[]) : [] };
};

export const adminSavePage = async (input: SitePageInput): Promise<SitePageResult> => {
  const payload = await adminInvoke({
    action: "admin_save",
    id: input.id,
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle,
    coverImage: input.coverImage,
    sections: input.sections,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    status: input.status,
    showInFooter: input.showInFooter,
    sortOrder: input.sortOrder,
  });
  if (!payload.ok) {
    return { ok: false, code: String(payload.code ?? "error"), message: String(payload.message ?? "Sayfa kaydedilemedi.") };
  }
  invalidatePublicPages();
  return { ok: true, page: payload.page as SitePage | undefined };
};

export const adminDeletePage = async (id: string): Promise<SitePageResult> => {
  const payload = await adminInvoke({ action: "admin_delete", id });
  if (!payload.ok) {
    return { ok: false, code: String(payload.code ?? "error"), message: String(payload.message ?? "Sayfa silinemedi.") };
  }
  invalidatePublicPages();
  return { ok: true };
};