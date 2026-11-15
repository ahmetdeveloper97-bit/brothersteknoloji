export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  description: string;
  seoTitle: string;
  seoDescription: string;
  productCount: number;
  order: number;
  active: boolean;
  showOnHome: boolean;
}

export type CustomerSegment = "VIP" | "Sadık" | "Yeni" | "Riskli" | "Pasif";

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  registeredAt: string;
  lastOrder: string | null;
  orderCount: number;
  totalSpend: number;
  segment: CustomerSegment;
  emailOptIn: boolean;
  smsOptIn: boolean;
  note: string;
  tags: string[];
}

export type CampaignType = "percentage" | "fixed" | "xForY" | "freeShipping";

export interface Campaign {
  id: string;
  code: string;
  title: string;
  type: CampaignType;
  value: number;
  minBasket: number;
  usageLimit: number;
  used: number;
  startDate: string;
  endDate: string;
  active: boolean;
  channels: string[];
  note: string;
}

export interface CampaignSeed extends Omit<Campaign, "startDate" | "endDate"> {
  startOffset: number;
  endOffset: number;
}

export type CampaignState = "active" | "scheduled" | "expired" | "paused";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface AdminReview {
  id: string;
  customer: string;
  product: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  status: ReviewStatus;
  reply: string | null;
  repliedBy?: string;
  repliedByEmail?: string;
  repliedByRole?: string;
  repliedAt?: string;
  verified: boolean;
}

export interface NotificationSettings {
  orderCreated: boolean;
  orderShipped: boolean;
  orderDelivered: boolean;
  abandonedCart: boolean;
  newReview: boolean;
  lowStock: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
}

export interface EtbisSettings {
  enabled: boolean;
  showQr: boolean;
  companyName: string;
  registrationNumber: string;
  profileUrl: string;
  note: string;
}

export interface StoreSettings {
  storeName: string;
  legalName: string;
  email: string;
  phone: string;
  whatsapp: string;
  taxNumber: string;
  taxOffice: string;
  address: string;
  city: string;
  postalCode: string;
  currency: string;
  supportHours: string;
  orderPrefix: string;
  freeShippingLimit: number;
  minBasket: number;
  defaultDesi: number;
  codEnabled: boolean;
  codFee: number;
  maintenanceMode: boolean;
  reviewsAutoApprove: boolean;
  showStockCount: boolean;
  notifications: NotificationSettings;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export type SocialPlatform = "instagram" | "x" | "linkedin" | "facebook" | "youtube" | "whatsapp";

export interface FooterSocial {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface FooterGroup {
  id: string;
  title: string;
  useCategoryLinks: boolean;
  links: FooterLink[];
}

export interface FooterSettings {
  description: string;
  phone: string;
  email: string;
  address: string;
  socials: FooterSocial[];
  trackingLabel: string;
  trackingUrl: string;
  trustNote: string;
  copyrightText: string;
  providerLabel: string;
  providerUrl: string;
  groups: FooterGroup[];
  bottomLinks: FooterLink[];
}