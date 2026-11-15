import { KEYS, loadNetgsmSettings, loadSmsLogs } from "@/lib/integrations";
import { writeJson } from "@/lib/persistent";
import { buildTrackingUrl, loadCargoCompanies } from "@/lib/shipping";
import type { NetgsmSettings, SmsMessage } from "@/types/integrations";
import type { AdminOrder } from "@/types/store";
import type { Shipment } from "@/types/shipping";

export const SMS_UNIT_PRICE = 0.065;

export const smsCharInfo = (body: string): { chars: number; parts: number; remaining: number } => {
  const chars = body.length;
  const parts = Math.max(1, Math.ceil(chars / 160));
  return { chars, parts, remaining: parts * 160 - chars };
};

export const cargoSmsTemplates: Array<{ id: string; label: string; body: string }> = [
  {
    id: "onTheWay",
    label: "Yola çıktı bildirimi",
    body: "Sayin {ad}, {siparis} numarali siparisiniz {firma} ile yola cikti. Takip no: {takip} Tahmini teslim: {eta}.",
  },
  {
    id: "outForDelivery",
    label: "Dağıtımda bildirimi",
    body: "Sayin {ad}, {siparis} numarali siparisiniz bugun dagitimda. Kuryemiz teslimattan once sizi arayacak. Takip: {takip}",
  },
  {
    id: "delivered",
    label: "Teslim edildi bildirimi",
    body: "Sayin {ad}, {siparis} numarali siparisiniz teslim edildi. Bizi tercih ettiginiz icin tesekkur ederiz. Takip: {takip}",
  },
  {
    id: "returned",
    label: "İade süreci bildirimi",
    body: "Sayin {ad}, {siparis} numarali gonderiniz iade surecine alindi. Ucret iadesi 3 is gunu icinde yapilacaktir. Takip: {takip}",
  },
];

export interface CargoSmsVars {
  ad: string;
  siparis: string;
  firma: string;
  takip: string;
  durum: string;
  eta: string;
  link: string;
}

export const buildCargoSmsVars = (order: AdminOrder, shipment: Shipment): CargoSmsVars => {
  const companies = loadCargoCompanies();
  const company = companies.find((item) => item.id === shipment.companyId);
  return {
    ad: order.customer.split(" ")[0] || order.customer,
    siparis: order.id,
    firma: company?.name ?? order.cargo,
    takip: shipment.tracking,
    durum: shipment.status,
    eta: shipment.eta,
    link: buildTrackingUrl(company, shipment.tracking),
  };
};

export const fillCargoSmsTemplate = (template: string, vars: CargoSmsVars): string =>
  template
    .replace(/\{ad\}/g, vars.ad)
    .replace(/\{siparis\}/g, vars.siparis)
    .replace(/\{firma\}/g, vars.firma)
    .replace(/\{takip\}/g, vars.takip)
    .replace(/\{eta\}/g, vars.eta)
    .replace(/\{durum\}/g, vars.durum)
    .replace(/\{link\}/g, vars.link || "brothersteknoloji.com/kargo-takip");

const stamp = (): string =>
  new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export interface CargoSmsResult {
  ok: boolean;
  message: string;
  log?: SmsMessage;
  settings: NetgsmSettings;
}

export const sendCargoSms = (params: {
  phone: string;
  name: string;
  body: string;
  orderId?: string;
}): CargoSmsResult => {
  const settings = loadNetgsmSettings();
  const body = params.body.trim();
  const info = smsCharInfo(body);

  if (settings.balance < info.parts) {
    return {
      ok: false,
      message: `Kontör bakiyesi yetersiz. Bu mesaj ${info.parts} kontör gerektiriyor, bakiyeniz ${settings.balance}. NetGSM → Ayarlar sekmesinden kontör yükleyin.`,
      settings,
    };
  }

  const log: SmsMessage = {
    id: `SMS-K${Date.now().toString().slice(-6)}`,
    to: params.phone,
    name: params.name,
    body,
    status: settings.enabled ? "delivered" : "queued",
    date: stamp(),
    header: settings.header,
  };

  writeJson(KEYS.smsLogs, [log, ...loadSmsLogs()]);

  const nextSettings: NetgsmSettings = { ...settings, balance: settings.balance - info.parts };
  writeJson(KEYS.netgsm, nextSettings);

  return {
    ok: true,
    message: settings.enabled
      ? `SMS ${params.phone} numarasına iletildi. ${info.parts} kontör düşüldü, kalan bakiye ${nextSettings.balance}.`
      : `NetGSM entegrasyonu kapalı olduğu için SMS kuyruğa alındı. Entegrasyon açıldığında otomatik gönderilecek.`,
    log,
    settings: nextSettings,
  };
};