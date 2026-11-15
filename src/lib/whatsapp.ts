import { loadStoreSettings } from "@/lib/adminStore";
import { formatPrice } from "@/lib/format";
import type { AbandonedCart, WhatsAppSettings } from "@/types/integrations";

export const digitize = (value: string): string => value.replace(/\D/g, "");

export const normalizeTrPhone = (value: string): string => {
  let digits = digitize(value);
  if (digits.startsWith("90") && digits.length > 10) digits = digits.slice(2);
  digits = digits.replace(/^0+/, "");
  return digits.slice(0, 10);
};

export const formatTrPhone = (value: string): string => {
  const digits = normalizeTrPhone(value);
  if (digits.length < 10) return value;
  return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
};

export const isValidTrPhone = (value: string): boolean => {
  const digits = normalizeTrPhone(value);
  return digits.length === 10 && digits.startsWith("5");
};

/** Mağazanın tek resmi WhatsApp hattı. Tüm WhatsApp bağlantıları bu numarayı kullanır. */
export const BUSINESS_WHATSAPP_NUMBER = "08503077215";
export const BUSINESS_WHATSAPP_LABEL = "0850 307 72 15";

export const waLink = (businessNumber: string, text: string): string => {
  const number = `90${normalizeTrPhone(businessNumber)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const fillTemplate = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);

/** Mağaza adı tek kaynaktan (mağaza ayarları) okunur. */
export const storeDisplayName = (): string => {
  const name = String(loadStoreSettings().storeName ?? "").trim();
  return name || "Mağazamız";
};

const FREE_MAIL_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "yandex.com",
  "yandex.com.tr",
  "protonmail.com",
];

const slugForDomain = (value: string): string =>
  value
    .toLocaleLowerCase("tr")
    .replace(/[ıİ]/g, "i")
    .replace(/[şŞ]/g, "s")
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[^a-z0-9]/g, "");

/** Mağaza adından (ya da kurumsal e-posta alan adından) site adresi üretir. */
export const storeDomainName = (): string => {
  const settings = loadStoreSettings();
  const mailDomain = String(settings.email ?? "")
    .split("@")[1]
    ?.trim()
    .toLowerCase() ?? "";
  if (mailDomain && !FREE_MAIL_DOMAINS.includes(mailDomain)) return mailDomain;
  const slug = slugForDomain(String(settings.storeName ?? ""));
  return slug ? `${slug}.com` : "example.com";
};

/** Hatırlatma mesajında kullanılan mağaza bağlantısı. */
export const storeCartLink = (): string => `https://${storeDomainName()}/`;

export const buildCartMessage = (cart: AbandonedCart, settings: WhatsAppSettings): string => {
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return fillTemplate(settings.reminderMessage, {
    ad: cart.customer.split(" ")[0],
    magaza: storeDisplayName(),
    urun_sayisi: String(itemCount),
    sepet_tutari: formatPrice(cart.total),
    kupon: settings.couponCode,
    indirim: String(settings.couponPercent),
    link: storeCartLink(),
  });
};