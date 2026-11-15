import {
  defaultEtbisSettings,
  defaultStoreSettings,
} from "@/mocks/adminStore";
import { catalogCategorySeed } from "@/mocks/categorySeed";
import { readJson, writeJson } from "@/lib/persistent";
import type {
  AdminCategory,
  AdminCustomer,
  AdminReview,
  Campaign,
  CampaignState,
  CustomerSegment,
  EtbisSettings,
  StoreSettings,
} from "@/types/admin";

export const ADMIN_STORE_KEYS = {
  categories: "eticaretv8_admin_categories",
  customers: "eticaretv8_admin_customers",
  campaigns: "eticaretv8_admin_campaigns",
  reviews: "eticaretv8_admin_reviews",
  settings: "eticaretv8_admin_settings",
  etbis: "eticaretv8_etbis_settings",
};

export const ETBIS_EVENT = "eticaretv8:etbis-updated";

export const normalizeEtbisUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const loadEtbisSettings = (): EtbisSettings => {
  const stored = readJson<Partial<EtbisSettings> | null>(ADMIN_STORE_KEYS.etbis, null);
  const base = defaultEtbisSettings;
  if (!stored) return { ...base };
  return {
    ...base,
    ...stored,
    profileUrl: normalizeEtbisUrl(stored.profileUrl ?? base.profileUrl),
  };
};

export const saveEtbisSettings = (value: EtbisSettings): void => {
  const next: EtbisSettings = {
    ...value,
    profileUrl: normalizeEtbisUrl(value.profileUrl),
  };
  writeJson(ADMIN_STORE_KEYS.etbis, next);
  try {
    window.dispatchEvent(new Event(ETBIS_EVENT));
  } catch {
    /* event may be unavailable */
  }
};

const dateFromOffset = (offset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

/** Eski demo katalog kategori kimlikleri; yeni katalog yapısına geçişte temizlenir. */
const LEGACY_CATEGORY_IDS = [
  "iphone",
  "samsung",
  "bilgisayar",
  "notebook",
  "oyun",
  "elektronik",
  "ses",
  "akilli-ev",
  "ev-aletleri",
  "kisisel-bakim",
  "iphone-aksesuar",
  "iphone-kilif",
  "samsung-aksesuar",
  "notebook-oyun",
  "ses-kulaklik",
  "ses-hoparlor",
  "elektronik-tv",
  "elektronik-kamera",
  "akilli-ev-guvenlik",
  /** Yeni 13 ana kategorili yapıya geçişte kaldırılan kök kategori. */
  "sunucu-depolama",
];

const CATEGORY_SEED_VERSION_KEY = "eticaretv8_admin_categories_seed_version";
const CATEGORY_SEED_VERSION = 4;

const seedCategories = (): AdminCategory[] => catalogCategorySeed.map((category) => ({ ...category }));

/**
 * Kategori listesini yükler. Demo katalogdan kalan kategoriler bir kez temizlenir,
 * kullanıcı tanımlı kategoriler korunur ve yeni katalog kategori ağacı eklenir.
 */
export const loadCategories = (): AdminCategory[] => {
  const stored = readJson<AdminCategory[] | null>(ADMIN_STORE_KEYS.categories, null);
  if (!stored || !Array.isArray(stored) || !stored.length) return seedCategories();

  const version = readJson<number | null>(CATEGORY_SEED_VERSION_KEY, null);
  if (version === CATEGORY_SEED_VERSION) return stored;

  const kept = stored.filter((category) => category && !LEGACY_CATEGORY_IDS.includes(category.id));
  const keptIds = new Set(kept.map((category) => category.id));
  const seedById = new Map(catalogCategorySeed.map((category) => [category.id, category]));
  const normalized = kept.map((category) => {
    const seed = seedById.get(category.id);
    if (seed) {
      // Katalog yapısı (ad, slug, üst kategori, sıra) şablondan gelir;
      // yayın durumu kullanıcının ayarını korur, vitrin seçimi şablonu izler.
      return {
        ...category,
        name: seed.name,
        slug: seed.slug,
        parent: seed.parent,
        description: seed.description,
        seoTitle: seed.seoTitle,
        seoDescription: seed.seoDescription,
        order: seed.order,
        productCount: seed.productCount,
        showOnHome: seed.showOnHome,
      };
    }
    const parentMissing = Boolean(category.parent) && !keptIds.has(category.parent as string);
    return parentMissing ? { ...category, parent: null } : category;
  });
  const merged = [...normalized];
  const normalizedIds = new Set(normalized.map((category) => category.id));
  catalogCategorySeed.forEach((category) => {
    if (!normalizedIds.has(category.id)) merged.push({ ...category });
  });
  merged.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "tr"));
  writeJson(ADMIN_STORE_KEYS.categories, merged);
  writeJson(CATEGORY_SEED_VERSION_KEY, CATEGORY_SEED_VERSION);
  return merged;
};

export const loadCustomers = (): AdminCustomer[] => {
  const stored = readJson<AdminCustomer[] | null>(ADMIN_STORE_KEYS.customers, null);
  if (stored && Array.isArray(stored)) return stored;
  return [];
};

export const loadCampaigns = (): Campaign[] => {
  const stored = readJson<Campaign[] | null>(ADMIN_STORE_KEYS.campaigns, null);
  if (stored && Array.isArray(stored)) return stored;
  return [];
};

export const loadReviews = (): AdminReview[] => {
  const stored = readJson<AdminReview[] | null>(ADMIN_STORE_KEYS.reviews, null);
  if (stored && Array.isArray(stored)) return stored;
  return [];
};

export const loadStoreSettings = (): StoreSettings => {
  const stored = readJson<Partial<StoreSettings> | null>(ADMIN_STORE_KEYS.settings, null);
  const base = defaultStoreSettings;
  if (!stored) return { ...base, notifications: { ...base.notifications, channels: { ...base.notifications.channels } } };
  return {
    ...base,
    ...stored,
    notifications: {
      ...base.notifications,
      ...(stored.notifications ?? {}),
      channels: { ...base.notifications.channels, ...(stored.notifications?.channels ?? {}) },
    },
  };
};

export const slugify = (value: string): string =>
  value
    .toLocaleLowerCase("tr")
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const formatDateTr = (value: string): string => {
  if (!value) return "—";
  const parts = value.slice(0, 10).split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

export const formatNumberTr = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

export const segmentTone = (segment: CustomerSegment): "success" | "warning" | "info" | "neutral" | "danger" => {
  switch (segment) {
    case "VIP":
      return "warning";
    case "Sadık":
      return "success";
    case "Yeni":
      return "info";
    case "Riskli":
      return "danger";
    default:
      return "neutral";
  }
};

export const campaignState = (campaign: Campaign): CampaignState => {
  if (!campaign.active) return "paused";
  const today = new Date().toISOString().slice(0, 10);
  if (campaign.endDate < today) return "expired";
  if (campaign.startDate > today) return "scheduled";
  return "active";
};

export const campaignStateLabel: Record<CampaignState, string> = {
  active: "Aktif",
  scheduled: "Planlandı",
  expired: "Sona Erdi",
  paused: "Duraklatıldı",
};

export const campaignStateTone = (state: CampaignState): "success" | "info" | "neutral" | "danger" => {
  switch (state) {
    case "active":
      return "success";
    case "scheduled":
      return "info";
    case "expired":
      return "danger";
    default:
      return "neutral";
  }
};

export const campaignValueLabel = (campaign: Campaign): string => {
  switch (campaign.type) {
    case "percentage":
      return `%${campaign.value}`;
    case "fixed":
      return `${formatNumberTr(campaign.value)} TL`;
    case "xForY":
      return `${campaign.value} Al 1 Öde`;
    default:
      return "Ücretsiz Kargo";
  }
};

export const campaignTypeLabel = (campaign: Campaign): string => {
  switch (campaign.type) {
    case "percentage":
      return "Yüzde İndirim";
    case "fixed":
      return "Tutar İndirimi";
    case "xForY":
      return "X Al Y Öde";
    default:
      return "Ücretsiz Kargo";
  }
};

export const averageRating = (reviews: AdminReview[]): number => {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
};

export const categoryHasChildren = (categories: AdminCategory[], id: string): boolean =>
  categories.some((category) => category.parent === id);