import { SMS_UNIT_PRICE, smsCharInfo } from "@/lib/smsNotify";
import type { AdminCustomer, CustomerSegment } from "@/types/admin";
import type { NetgsmSettings, SmsMessage } from "@/types/integrations";

export type SegmentKey = CustomerSegment | "all";

export const segmentOptions: Array<{ id: SegmentKey; label: string; description: string }> = [
  { id: "all", label: "Tüm Müşteriler", description: "SMS izni olan tüm kayıtlı müşteriler" },
  { id: "VIP", label: "VIP", description: "Yüksek harcama yapan müşteriler" },
  { id: "Sadık", label: "Sadık", description: "Düzenli sipariş veren müşteriler" },
  { id: "Yeni", label: "Yeni", description: "Yakın zamanda kaydolan müşteriler" },
  { id: "Riskli", label: "Riskli", description: "İade geçmişi olan müşteriler" },
  { id: "Pasif", label: "Pasif", description: "Uzun süredir sipariş vermeyenler" },
];

export const segmentCampaignTemplates: Array<{ id: string; label: string; body: string }> = [
  {
    id: "coupon",
    label: "Segment kuponu",
    body:
      "Sayin {ad}, size ozel {indirim} kuponunuz hazir. Kupon kodu: {kod}. Alisveris icin: {link}",
  },
  {
    id: "vip",
    label: "VIP teşekkür",
    body:
      "Sayin {ad}, VIP musterimiz oldugunuz icin tesekkurler. {indirim} kuponunuz: {kod}. {link}",
  },
  {
    id: "winback",
    label: "Yeniden kazanım",
    body:
      "Sayin {ad}, sizi ozledik! Geri donusunuz icin {indirim} kuponunuz: {kod}. {link}",
  },
  {
    id: "new",
    label: "Yeni üye karşılama",
    body:
      "Sayin {ad}, aramiza hos geldiniz. Ilk siparisinizde {indirim} indirim: {kod}. {link}",
  },
];

export interface SegmentSmsVars {
  ad: string;
  segment: string;
  kod: string;
  indirim: string;
  link: string;
  magaza: string;
  kalan?: string;
}

export const fillSegmentTemplate = (template: string, vars: SegmentSmsVars): string =>
  template
    .replace(/\{ad\}/g, vars.ad)
    .replace(/\{segment\}/g, vars.segment)
    .replace(/\{kod\}/g, vars.kod)
    .replace(/\{indirim\}/g, vars.indirim)
    .replace(/\{link\}/g, vars.link)
    .replace(/\{magaza\}/g, vars.magaza)
    .replace(/\{kalan\}/g, vars.kalan ?? "");

const phoneDigits = (phone: string): string => phone.replace(/\D/g, "");

export const segmentRecipients = (
  customers: AdminCustomer[],
  segment: SegmentKey
): AdminCustomer[] =>
  segment === "all"
    ? customers
    : customers.filter((customer) => customer.segment === segment);

export const eligibleRecipients = (
  customers: AdminCustomer[],
  segment: SegmentKey
): AdminCustomer[] =>
  segmentRecipients(customers, segment).filter(
    (customer) => customer.smsOptIn && phoneDigits(customer.phone).length >= 10
  );

const stamp = (): string =>
  new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export interface SegmentSendParams {
  customers: AdminCustomer[];
  segment: SegmentKey;
  template: string;
  code: string;
  discountLabel: string;
  link: string;
  storeName: string;
  settings: NetgsmSettings;
  /** Kupon bitişine kalan gün — {kalan} değişkenini doldurur. */
  daysLeft?: number;
}

export interface SegmentSendResult {
  ok: boolean;
  message: string;
  logs: SmsMessage[];
  balance: number;
  sent: number;
  skipped: number;
  credits: number;
  cost: number;
}

export const sendSegmentCampaign = (params: SegmentSendParams): SegmentSendResult => {
  const matched = segmentRecipients(params.customers, params.segment);
  const recipients = eligibleRecipients(params.customers, params.segment);
  const skipped = matched.length - recipients.length;
  const template = params.template.trim();

  if (template.length < 10) {
    return {
      ok: false,
      message: "Mesaj metni en az 10 karakter olmalı.",
      logs: [],
      balance: params.settings.balance,
      sent: 0,
      skipped,
      credits: 0,
      cost: 0,
    };
  }

  if (recipients.length === 0) {
    return {
      ok: false,
      message: "Bu segmentte SMS izni olan geçerli numaraya sahip müşteri yok.",
      logs: [],
      balance: params.settings.balance,
      sent: 0,
      skipped,
      credits: 0,
      cost: 0,
    };
  }

  const prepared = recipients.map((customer) => {
    const body = fillSegmentTemplate(template, {
      ad: customer.name.split(" ")[0] || customer.name,
      segment: customer.segment,
      kod: params.code || "KUPON",
      indirim: params.discountLabel,
      link: params.link,
      magaza: params.storeName,
      kalan: params.daysLeft !== undefined ? String(Math.max(0, params.daysLeft)) : "",
    });
    return { customer, body, parts: smsCharInfo(body).parts };
  });

  const credits = prepared.reduce((sum, item) => sum + item.parts, 0);
  const date = stamp();

  if (!params.settings.enabled) {
    const logs: SmsMessage[] = prepared.map((item, index) => ({
      id: `SMS-C${Date.now().toString().slice(-5)}${index}`,
      to: item.customer.phone,
      name: item.customer.name,
      body: item.body,
      status: "queued",
      date,
      header: params.settings.header,
    }));
    return {
      ok: true,
      message: `NetGSM entegrasyonu kapalı olduğu için ${logs.length} mesaj kuyruğa alındı. Entegrasyon açılınca otomatik gönderilecek.`,
      logs,
      balance: params.settings.balance,
      sent: logs.length,
      skipped,
      credits: 0,
      cost: 0,
    };
  }

  if (params.settings.balance < credits) {
    return {
      ok: false,
      message: `Kontör bakiyesi yetersiz. Bu kampanya ${credits} kontör gerektiriyor, bakiyeniz ${params.settings.balance}. NetGSM → Ayarlar sekmesinden kontör yükleyin.`,
      logs: [],
      balance: params.settings.balance,
      sent: 0,
      skipped,
      credits,
      cost: credits * SMS_UNIT_PRICE,
    };
  }

  const logs: SmsMessage[] = prepared.map((item, index) => ({
    id: `SMS-C${Date.now().toString().slice(-5)}${index}`,
    to: item.customer.phone,
    name: item.customer.name,
    body: item.body,
    status: "delivered",
    date,
    header: params.settings.header,
  }));

  return {
    ok: true,
    message: `${logs.length} müşteriye segment kampanya SMS'i gönderildi. ${credits} kontör düşüldü, ${skipped} kişi İYS/numara nedeniyle atlandı.`,
    logs,
    balance: params.settings.balance - credits,
    sent: logs.length,
    skipped,
    credits,
    cost: credits * SMS_UNIT_PRICE,
  };
};