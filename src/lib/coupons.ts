import {
  ADMIN_STORE_KEYS,
  campaignState,
  formatNumberTr,
  loadCampaigns,
} from "@/lib/adminStore";
import { writeJson } from "@/lib/persistent";
import type { Campaign } from "@/types/admin";

export interface CouponLine {
  price: number;
  quantity: number;
}

export interface CouponEvaluation {
  ok: boolean;
  message: string;
  code: string;
  campaign: Campaign | null;
  discount: number;
  freeShipping: boolean;
  label: string;
}

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const fail = (message: string, code = ""): CouponEvaluation => ({
  ok: false,
  message,
  code,
  campaign: null,
  discount: 0,
  freeShipping: false,
  label: "",
});

export const couponHintLabel = (campaign: Campaign): string => {
  switch (campaign.type) {
    case "percentage":
      return `%${campaign.value} indirim`;
    case "fixed":
      return `${formatNumberTr(campaign.value)} ₺ indirim`;
    case "xForY":
      return `${campaign.value} Al 1 Öde`;
    default:
      return "ücretsiz kargo";
  }
};

export const evaluateCoupon = (rawCode: string, lines: CouponLine[]): CouponEvaluation => {
  const code = rawCode.trim().toLocaleUpperCase("tr");
  if (!code) return fail("Kupon kodu girin.");

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  if (subtotal <= 0) return fail("Sepetinizde ürün bulunmuyor.", code);

  const campaign = loadCampaigns().find(
    (item) => item.code.toLocaleUpperCase("tr") === code
  );
  if (!campaign) return fail("Kupon kodu geçersiz.", code);

  const state = campaignState(campaign);
  if (state === "expired") return fail("Bu kuponun süresi dolmuş.", code);
  if (state === "scheduled") return fail("Bu kupon henüz başlamadı.", code);
  if (state === "paused") return fail("Bu kupon duraklatılmış.", code);
  if (campaign.used >= campaign.usageLimit) return fail("Kupon kontenjanı doldu.", code);
  if (subtotal < campaign.minBasket) {
    return fail(
      `Bu kupon için minimum sepet tutarı ${formatNumberTr(campaign.minBasket)} ₺.`,
      code
    );
  }

  let discount = 0;
  let freeShipping = false;

  switch (campaign.type) {
    case "percentage":
      discount = (subtotal * campaign.value) / 100;
      break;
    case "fixed":
      discount = Math.min(campaign.value, subtotal);
      break;
    case "freeShipping":
      freeShipping = true;
      break;
    case "xForY": {
      const groupSize = Math.max(2, Math.round(campaign.value));
      if (quantity < groupSize) {
        return fail(`Bu kupon için en az ${groupSize} adet ürün gerekli.`, code);
      }
      const unitPrice = subtotal / quantity;
      const freeItems = Math.floor(quantity / groupSize);
      discount = unitPrice * freeItems;
      break;
    }
    default:
      return fail("Bu kupon sepetinizde kullanılamıyor.", code);
  }

  discount = Math.min(roundMoney(discount), roundMoney(subtotal));
  const label = couponHintLabel(campaign);

  return {
    ok: true,
    message: freeShipping
      ? `${campaign.code} uygulandı · kargo ücretsiz`
      : `${campaign.code} uygulandı · ${label}`,
    code: campaign.code,
    campaign,
    discount,
    freeShipping,
    label,
  };
};

export const availableCoupons = (): Campaign[] =>
  loadCampaigns().filter(
    (campaign) => campaignState(campaign) === "active" && campaign.used < campaign.usageLimit
  );

const DAY_MS = 24 * 60 * 60 * 1000;

/** Kuponun bitişine kalan gün sayısı (bitiş günü dahil). */
export const couponDaysLeft = (campaign: Campaign): number => {
  if (!campaign.endDate) return Number.POSITIVE_INFINITY;
  const end = new Date(`${campaign.endDate.slice(0, 10)}T23:59:59`).getTime();
  if (Number.isNaN(end)) return Number.POSITIVE_INFINITY;
  return Math.ceil((end - Date.now()) / DAY_MS);
};

/** Kupon aktif ve son günlerine girdiyse "yakında sona eriyor" uyarısı verir. */
export const couponEndingSoon = (campaign: Campaign, threshold = 3): boolean => {
  if (campaignState(campaign) !== "active") return false;
  const days = couponDaysLeft(campaign);
  return days >= 0 && days <= threshold;
};

export const couponExpiryLabel = (campaign: Campaign): string => {
  const days = couponDaysLeft(campaign);
  if (!Number.isFinite(days)) return "";
  if (days <= 0) return "Bugün son gün";
  if (days === 1) return "Son 1 gün";
  return `Son ${days} gün`;
};

/** Ödeme tamamlandığında kupon kullanım sayacını bir artırır. */
export const consumeCoupon = (campaignId: string): void => {
  const campaigns = loadCampaigns();
  const next = campaigns.map((campaign) =>
    campaign.id === campaignId
      ? { ...campaign, used: Math.min(campaign.usageLimit, campaign.used + 1) }
      : campaign
  );
  writeJson(ADMIN_STORE_KEYS.campaigns, next);
};