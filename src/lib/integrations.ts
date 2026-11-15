import {
  defaultIyzicoSettings,
  defaultNetgsmSettings,
  defaultWhatsAppSettings,
  smsTemplatesMock,
} from "@/mocks/integrations";
import { readJson, writeJson } from "@/lib/persistent";
import { BUSINESS_WHATSAPP_NUMBER, normalizeTrPhone } from "@/lib/whatsapp";
import type {
  AbandonedCart,
  IyzicoSettings,
  NetgsmSettings,
  PaymentTransaction,
  SmsContact,
  SmsMessage,
  SmsTemplate,
  WhatsAppSettings,
} from "@/types/integrations";

export const KEYS = {
  waSettings: "eticaretv8_wa_settings",
  carts: "eticaretv8_abandoned_carts",
  netgsm: "eticaretv8_netgsm_settings",
  smsLogs: "eticaretv8_sms_logs",
  smsContacts: "eticaretv8_sms_contacts",
  smsTemplates: "eticaretv8_sms_templates",
  iyzico: "eticaretv8_iyzico_settings",
  payments: "eticaretv8_payments",
  couponReminders: "eticaretv8_coupon_reminders",
  couponReminderSettings: "eticaretv8_coupon_reminder_settings",
};

const LEGACY_WA_NUMBERS = ["905325551234", "05325551234"];
/** Eski/kişisel numaraların bir kez resmi hatta taşındığını işaretler. */
const WA_NUMBER_SYNC_KEY = "eticaretv8_wa_number_sync_v1";

/** Mağaza adı içermeyen eski varsayılan hatırlatma metinleri. */
const LEGACY_REMINDER_MESSAGES = [
  "Merhaba {ad}, sepetinizde {urun_sayisi} ürün sizi bekliyor. Toplam tutar {sepet_tutari}. Siparişinizi tamamlamak için: {link} — {kupon} kodu ile %{indirim} indirim sizi bekliyor.",
  "Merhaba {ad}, {magaza} mağazamızdaki sepetinizde {urun_sayisi} ürün sizi bekliyor. Toplam tutar {sepet_tutari}. Siparişinizi tamamlamak için: {link} — {kupon} kodu ile %{indirim} indirim sizi bekliyor.",
];

export const loadWhatsAppSettings = (): WhatsAppSettings => {
  const stored = readJson<Partial<WhatsAppSettings>>(KEYS.waSettings, {});
  const storedNumber = String(stored.businessNumber ?? "").trim();
  const digits = normalizeTrPhone(storedNumber);
  const synced = readJson<boolean>(WA_NUMBER_SYNC_KEY, false) === true;
  const isLegacyOrMissing = !storedNumber || LEGACY_WA_NUMBERS.includes(storedNumber) || digits.length !== 10;
  const businessNumber = !synced || isLegacyOrMissing ? BUSINESS_WHATSAPP_NUMBER : storedNumber;

  const storedMessage = String(stored.reminderMessage ?? "").trim();
  const reminderMessage =
    !storedMessage || LEGACY_REMINDER_MESSAGES.includes(storedMessage)
      ? defaultWhatsAppSettings.reminderMessage
      : storedMessage;

  const settings: WhatsAppSettings = {
    ...(defaultWhatsAppSettings as WhatsAppSettings),
    ...stored,
    businessNumber,
    reminderMessage,
    quickReplies: stored.quickReplies?.length
      ? stored.quickReplies
      : (defaultWhatsAppSettings.quickReplies as WhatsAppSettings["quickReplies"]),
  };

  if (!synced || businessNumber !== stored.businessNumber || reminderMessage !== stored.reminderMessage) {
    writeJson(KEYS.waSettings, settings);
    writeJson(WA_NUMBER_SYNC_KEY, true);
  }

  return settings;
};

export const loadAbandonedCarts = (): AbandonedCart[] => {
  const stored = readJson<AbandonedCart[]>(KEYS.carts, []);
  return Array.isArray(stored) ? stored : [];
};

export const loadNetgsmSettings = (): NetgsmSettings => ({
  ...(defaultNetgsmSettings as NetgsmSettings),
  ...readJson<Partial<NetgsmSettings>>(KEYS.netgsm, {}),
});

export const loadSmsLogs = (): SmsMessage[] => {
  const stored = readJson<SmsMessage[]>(KEYS.smsLogs, []);
  return Array.isArray(stored) ? stored : [];
};

export const loadSmsContacts = (): SmsContact[] => {
  const stored = readJson<SmsContact[]>(KEYS.smsContacts, []);
  return Array.isArray(stored) ? stored : [];
};

export const loadSmsTemplates = (): SmsTemplate[] =>
  readJson<SmsTemplate[]>(KEYS.smsTemplates, smsTemplatesMock as SmsTemplate[]);

export const loadIyzicoSettings = (): IyzicoSettings => {
  const stored = readJson<Partial<IyzicoSettings>>(KEYS.iyzico, {});
  return {
    ...(defaultIyzicoSettings as IyzicoSettings),
    ...stored,
    plans: stored.plans?.length ? stored.plans : (defaultIyzicoSettings.plans as IyzicoSettings["plans"]),
  };
};

export const loadPayments = (): PaymentTransaction[] => {
  const stored = readJson<PaymentTransaction[]>(KEYS.payments, []);
  return Array.isArray(stored) ? stored : [];
};

export const smsGroups = ["Tüm Müşteriler", "VIP", "Kampanya", "Terk Edilen Sepet"];

export const smsLengthInfo = (body: string): { chars: number; parts: number; remaining: number } => {
  const chars = body.length;
  const parts = Math.max(1, Math.ceil(chars / 160));
  const remaining = parts * 160 - chars;
  return { chars, parts, remaining };
};