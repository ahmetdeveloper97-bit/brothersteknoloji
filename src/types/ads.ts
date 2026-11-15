export type AdPlatform = "google" | "meta";

export type AdCampaignStatus = "active" | "paused" | "ended" | "draft";

export interface AdCampaign {
  id: string;
  platform: AdPlatform;
  name: string;
  channel: string;
  objective: string;
  status: AdCampaignStatus;
  dailyBudget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  startDate: string;
}

export interface GoogleAdsSettings {
  enabled: boolean;
  accountName: string;
  customerId: string;
  developerToken: string;
  conversionId: string;
  conversionLabel: string;
  currency: string;
  autoTagging: boolean;
  enhancedConversions: boolean;
  remarketingTag: boolean;
  connectedAt: string;
}

export interface MetaAdsSettings {
  enabled: boolean;
  accountName: string;
  adAccountId: string;
  businessId: string;
  pixelId: string;
  accessToken: string;
  conversionApiToken: string;
  testEventCode: string;
  automaticAdvancedMatching: boolean;
  advantagePlus: boolean;
  connectedAt: string;
}

export interface AdBudgetSettings {
  enabled: boolean;
  monthlyLimit: number;
  alertRatio: number;
}

export interface AdsSettings {
  google: GoogleAdsSettings;
  meta: MetaAdsSettings;
  budget: AdBudgetSettings;
}

export interface NewAdCampaignInput {
  platform: AdPlatform;
  name: string;
  channel: string;
  objective: string;
  dailyBudget: number;
  startDate: string;
  status: AdCampaignStatus;
}

export type BudgetState = "disabled" | "ok" | "near" | "over";

export interface BudgetStatus {
  state: BudgetState;
  limit: number;
  spend: number;
  ratio: number;
  remaining: number;
}

export interface ConversionEvent {
  id: string;
  name: string;
  eventKey: string;
  google: boolean;
  meta: boolean;
  value: string;
  count: number;
  active: boolean;
}

export interface AdSpendPoint {
  label: string;
  google: number;
  meta: number;
}

export interface AdsTotals {
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}