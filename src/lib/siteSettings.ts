import { defaultFooterSettings } from "@/mocks/adminStore";
import { readAdminToken } from "@/lib/adminStaffStore";
import { readJson, writeJson } from "@/lib/persistent";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { FooterGroup, FooterLink, FooterSettings, FooterSocial, SocialPlatform } from "@/types/admin";

const CACHE_KEY = "eticaretv8_footer_settings_cache";
export const FOOTER_EVENT = "eticaretv8:footer-updated";

export interface SocialPlatformMeta {
  id: SocialPlatform;
  label: string;
  icon: string;
  placeholder: string;
}

export const SOCIAL_PLATFORMS: SocialPlatformMeta[] = [
  { id: "instagram", label: "Instagram", icon: "ri-instagram-line", placeholder: "https://instagram.com/hesabiniz" },
  { id: "x", label: "X (Twitter)", icon: "ri-twitter-x-line", placeholder: "https://x.com/hesabiniz" },
  { id: "linkedin", label: "LinkedIn", icon: "ri-linkedin-fill", placeholder: "https://linkedin.com/company/hesabiniz" },
  { id: "facebook", label: "Facebook", icon: "ri-facebook-circle-line", placeholder: "https://facebook.com/hesabiniz" },
  { id: "youtube", label: "YouTube", icon: "ri-youtube-line", placeholder: "https://youtube.com/@hesabiniz" },
  { id: "whatsapp", label: "WhatsApp", icon: "ri-whatsapp-line", placeholder: "https://wa.me/905000000000" },
];

export const socialMeta = (platform: SocialPlatform): SocialPlatformMeta =>
  SOCIAL_PLATFORMS.find((item) => item.id === platform) ?? SOCIAL_PLATFORMS[0];

const isPlatform = (value: unknown): value is SocialPlatform =>
  SOCIAL_PLATFORMS.some((item) => item.id === value);

const cloneLink = (link: FooterLink): FooterLink => ({
  id: String(link?.id ?? ""),
  label: String(link?.label ?? ""),
  url: String(link?.url ?? ""),
});

const cloneGroup = (group: FooterGroup): FooterGroup => ({
  id: String(group?.id ?? ""),
  title: String(group?.title ?? ""),
  useCategoryLinks: Boolean(group?.useCategoryLinks),
  links: Array.isArray(group?.links) ? group.links.map(cloneLink) : [],
});

const cloneSocial = (social: FooterSocial): FooterSocial => ({
  id: String(social?.id ?? ""),
  platform: isPlatform(social?.platform) ? social.platform : "instagram",
  url: String(social?.url ?? ""),
});

/** Eksik alanları varsayılanlarla tamamlar; eski kayıtlarla uyumludur. */
export const normalizeFooterSettings = (raw?: Partial<FooterSettings> | null): FooterSettings => {
  const base = defaultFooterSettings;
  const source = raw ?? {};

  const groups = Array.isArray(source.groups) ? source.groups.map(cloneGroup) : base.groups.map(cloneGroup);
  const socials = Array.isArray(source.socials) ? source.socials.map(cloneSocial) : base.socials.map(cloneSocial);
  const bottomLinks = Array.isArray(source.bottomLinks)
    ? source.bottomLinks.map(cloneLink)
    : base.bottomLinks.map(cloneLink);

  return {
    description: String(source.description ?? base.description),
    phone: String(source.phone ?? base.phone),
    email: String(source.email ?? base.email),
    address: String(source.address ?? base.address),
    socials,
    trackingLabel: String(source.trackingLabel ?? base.trackingLabel),
    trackingUrl: String(source.trackingUrl ?? base.trackingUrl),
    trustNote: String(source.trustNote ?? base.trustNote),
    copyrightText: String(source.copyrightText ?? base.copyrightText),
    providerLabel: String(source.providerLabel ?? base.providerLabel),
    providerUrl: String(source.providerUrl ?? base.providerUrl),
    groups,
    bottomLinks,
  };
};

let cache: FooterSettings = normalizeFooterSettings(
  readJson<Partial<FooterSettings> | null>(CACHE_KEY, null),
);
let inFlight: Promise<FooterSettings> | null = null;

export const getFooterSettings = (): FooterSettings => cache;

const applySettings = (value: FooterSettings): FooterSettings => {
  cache = value;
  writeJson(CACHE_KEY, value);
  try {
    window.dispatchEvent(new Event(FOOTER_EVENT));
  } catch {
    /* event may be unavailable */
  }
  return value;
};

/** Ayarları sunucudan okur. Hata olursa son bilinen değer korunur. */
export const fetchFooterSettings = async (): Promise<FooterSettings> => {
  if (!isSupabaseConfigured) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("site-settings", { body: { action: "read" } });
      if (error) return cache;
      const payload = data as { ok?: boolean; settings?: Partial<FooterSettings> | null } | null;
      if (!payload?.ok) return cache;
      if (!payload.settings) return cache;
      return applySettings(normalizeFooterSettings(payload.settings));
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

export interface FooterSaveResult {
  ok: boolean;
  code?: string;
  message?: string;
}

/** Ayarları sunucuya yazar. Yazma işlemi yönetici oturumu ile doğrulanır. */
export const saveFooterSettings = async (value: FooterSettings): Promise<FooterSaveResult> => {
  const normalized = normalizeFooterSettings(value);
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }

  const token = readAdminToken();
  if (!token) {
    return {
      ok: false,
      code: "unauthorized",
      message: "Oturumunuz sona erdi. Lütfen Panel'e yeniden giriş yapıp tekrar deneyin.",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("site-settings", {
      body: { action: "save", token, settings: normalized },
    });

    if (error) {
      let code = "network";
      let message = "Ayarlar kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.";
      try {
        const context = (error as unknown as { context?: { json?: () => Promise<unknown> } }).context;
        if (context && typeof context.json === "function") {
          const parsed = (await context.json()) as { code?: string; message?: string } | null;
          if (parsed?.code) code = String(parsed.code);
          if (parsed?.message) message = String(parsed.message);
        }
      } catch {
        /* yanıt gövdesi okunamadı */
      }
      return { ok: false, code, message };
    }

    const payload = data as { ok?: boolean; code?: string; message?: string } | null;
    if (!payload?.ok) {
      return {
        ok: false,
        code: String(payload?.code ?? "error"),
        message: String(payload?.message ?? "Ayarlar kaydedilemedi."),
      };
    }

    applySettings(normalized);
    return { ok: true };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Ayarlar kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
    };
  }
};

export const subscribeFooterSettings = (listener: () => void): (() => void) => {
  window.addEventListener(FOOTER_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(FOOTER_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};