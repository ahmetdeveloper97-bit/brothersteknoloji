import {
  adCampaignsSeed,
  adSpendSeries,
  conversionEventsSeed,
  defaultAdBudgetSettings,
  defaultGoogleAdsSettings,
  defaultMetaAdsSettings,
} from "@/mocks/ads";
import { readJson } from "@/lib/persistent";
import type {
  AdBudgetSettings,
  AdCampaign,
  AdCampaignStatus,
  AdPlatform,
  AdSpendPoint,
  AdsSettings,
  AdsTotals,
  BudgetStatus,
  ConversionEvent,
  GoogleAdsSettings,
  MetaAdsSettings,
  NewAdCampaignInput,
} from "@/types/ads";

export const ADS_KEYS = {
  campaigns: "eticaretv8_ads_campaigns",
  settings: "eticaretv8_ads_settings",
  conversions: "eticaretv8_ads_conversions",
};

export const ADS_EVENT = "eticaretv8:ads-updated";

export const loadAdCampaigns = (): AdCampaign[] => {
  const stored = readJson<AdCampaign[] | null>(ADS_KEYS.campaigns, null);
  if (Array.isArray(stored)) return stored;
  return [];
};

export const loadAdsSettings = (): AdsSettings => {
  const stored = readJson<Partial<AdsSettings>>(ADS_KEYS.settings, {});
  return {
    google: { ...emptyGoogleAdsSettings(), ...(stored.google ?? {}) },
    meta: { ...emptyMetaAdsSettings(), ...(stored.meta ?? {}) },
    budget: {
      enabled: false,
      monthlyLimit: 0,
      alertRatio: 85,
      ...(stored.budget ?? {}),
    },
  };
};

export const loadGoogleAdsSettings = (): GoogleAdsSettings => loadAdsSettings().google;

export const loadMetaAdsSettings = (): MetaAdsSettings => loadAdsSettings().meta;

export const loadConversionEvents = (): ConversionEvent[] => {
  const stored = readJson<ConversionEvent[] | null>(ADS_KEYS.conversions, null);
  if (Array.isArray(stored)) return stored;
  return [];
};

export const emptyGoogleAdsSettings = (): GoogleAdsSettings => ({
  enabled: false,
  accountName: "",
  customerId: "",
  developerToken: "",
  conversionId: "",
  conversionLabel: "",
  currency: "TRY",
  autoTagging: false,
  enhancedConversions: false,
  remarketingTag: false,
  connectedAt: "",
});

export const emptyMetaAdsSettings = (): MetaAdsSettings => ({
  enabled: false,
  accountName: "",
  adAccountId: "",
  businessId: "",
  pixelId: "",
  accessToken: "",
  conversionApiToken: "",
  testEventCode: "",
  automaticAdvancedMatching: false,
  advantagePlus: false,
  connectedAt: "",
});

export const hasGoogleAccount = (settings: GoogleAdsSettings): boolean =>
  settings.enabled ||
  settings.accountName.trim() !== "" ||
  settings.customerId.trim() !== "" ||
  settings.developerToken.trim() !== "";

export const hasMetaAccount = (settings: MetaAdsSettings): boolean =>
  settings.enabled ||
  settings.accountName.trim() !== "" ||
  settings.adAccountId.trim() !== "" ||
  settings.pixelId.trim() !== "" ||
  settings.accessToken.trim() !== "";

export const loadSpendSeries = (): AdSpendPoint[] => {
  const stored = readJson<AdSpendPoint[] | null>(`${ADS_KEYS.campaigns}_series`, null);
  return Array.isArray(stored) ? stored : [];
};

export const AD_CHANNELS: Record<AdPlatform, string[]> = {
  google: ["Arama", "Alışveriş", "Performans Max", "Görüntülü Reklam", "Video"],
  meta: ["Advantage+", "Katalog", "Reels", "Retargeting", "Lead Form"],
};

export const AD_OBJECTIVES = ["Satış", "Dönüşüm", "Trafik", "Bilinirlik", "Potansiyel Müşteri"];

export const platformLabel: Record<AdPlatform, string> = {
  google: "Google Ads",
  meta: "Meta Ads",
};

export const platformShort: Record<AdPlatform, string> = {
  google: "Google",
  meta: "Meta",
};

export const campaignStatusLabel: Record<AdCampaignStatus, string> = {
  active: "Aktif",
  paused: "Duraklatıldı",
  ended: "Sona Erdi",
  draft: "Taslak",
};

export const campaignStatusTone: Record<AdCampaignStatus, "success" | "warning" | "neutral" | "info"> = {
  active: "success",
  paused: "warning",
  ended: "neutral",
  draft: "info",
};

export const formatMoney = (value: number): string =>
  `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(Math.round(value))} ₺`;

export const formatCompact = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(".", ",")} Mn`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(".", ",")} B`;
  return new Intl.NumberFormat("tr-TR").format(value);
};

export const formatNumber = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

export const ctrOf = (clicks: number, impressions: number): number =>
  impressions > 0 ? (clicks / impressions) * 100 : 0;

export const cpcOf = (spend: number, clicks: number): number => (clicks > 0 ? spend / clicks : 0);

export const cpaOf = (spend: number, conversions: number): number => (conversions > 0 ? spend / conversions : 0);

export const roasOf = (revenue: number, spend: number): number => (spend > 0 ? revenue / spend : 0);

export const totalsOf = (campaigns: AdCampaign[]): AdsTotals =>
  campaigns.reduce<AdsTotals>(
    (acc, campaign) => ({
      spend: acc.spend + campaign.spend,
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions,
      revenue: acc.revenue + campaign.revenue,
    }),
    { spend: 0, impressions: 0, clicks: 0, conversions: 0, revenue: 0 },
  );

export const campaignDateLabel = (value: string): string => {
  const parts = value.slice(0, 10).split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
};

export const maskToken = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "Tanımsız";
  if (trimmed.length <= 8) return `${trimmed.slice(0, 2)}••••`;
  return `${trimmed.slice(0, 4)}••••••${trimmed.slice(-4)}`;
};

export const isGoogleLinked = (settings: GoogleAdsSettings): boolean =>
  settings.enabled && settings.customerId.trim().length >= 10 && settings.developerToken.trim().length >= 8;

export const isMetaLinked = (settings: MetaAdsSettings): boolean =>
  settings.enabled &&
  settings.adAccountId.trim().startsWith("act_") &&
  settings.pixelId.trim().length >= 10 &&
  settings.accessToken.trim().length >= 8;

export const monthlySpendOf = (campaigns: AdCampaign[]): number =>
  campaigns.reduce((sum, campaign) => sum + campaign.spend, 0);

export const budgetStatusOf = (campaigns: AdCampaign[], budget: AdBudgetSettings): BudgetStatus => {
  const spend = monthlySpendOf(campaigns);
  const limit = Math.max(0, budget.monthlyLimit);
  const ratio = limit > 0 ? (spend / limit) * 100 : 0;
  const remaining = limit - spend;
  let state: BudgetStatus["state"] = "ok";
  if (!budget.enabled || limit <= 0) state = "disabled";
  else if (spend > limit) state = "over";
  else if (ratio >= Math.min(Math.max(budget.alertRatio, 1), 100)) state = "near";
  return { state, limit, spend, ratio, remaining };
};

export const createCampaignId = (platform: AdPlatform): string => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let suffix = "";
  for (let index = 0; index < 5; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${platform === "google" ? "g" : "m"}-${Date.now().toString().slice(-5)}${suffix}`;
};

export const buildCampaignFromInput = (input: NewAdCampaignInput): AdCampaign => ({
  id: createCampaignId(input.platform),
  platform: input.platform,
  name: input.name.trim(),
  channel: input.channel,
  objective: input.objective,
  status: input.status,
  dailyBudget: Math.max(0, Math.round(input.dailyBudget)),
  spend: 0,
  impressions: 0,
  clicks: 0,
  conversions: 0,
  revenue: 0,
  startDate: input.startDate,
});

export const buildCampaignReportRows = (campaigns: AdCampaign[]): Array<Array<string | number>> => [
  [
    "Kampanya",
    "Platform",
    "Kanal",
    "Hedef",
    "Durum",
    "Başlangıç",
    "Günlük Bütçe (₺)",
    "Harcama (₺)",
    "Gösterim",
    "Tıklama",
    "CTR (%)",
    "Dönüşüm",
    "Dönüşüm Başı Maliyet (₺)",
    "Gelir (₺)",
    "ROAS",
  ],
  ...campaigns.map((campaign) => [
    campaign.name,
    platformLabel[campaign.platform],
    campaign.channel,
    campaign.objective,
    campaignStatusLabel[campaign.status],
    campaignDateLabel(campaign.startDate),
    Math.round(campaign.dailyBudget),
    Math.round(campaign.spend),
    campaign.impressions,
    campaign.clicks,
    ctrOf(campaign.clicks, campaign.impressions).toFixed(2),
    campaign.conversions,
    Math.round(cpaOf(campaign.spend, campaign.conversions)),
    Math.round(campaign.revenue),
    roasOf(campaign.revenue, campaign.spend).toFixed(2),
  ]),
];

export const copyToClipboard = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};