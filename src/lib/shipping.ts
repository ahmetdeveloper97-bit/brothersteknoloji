import { readJson, writeJson } from "@/lib/persistent";
import { TR_CITY_ZONES } from "@/lib/trCities";
import type { Tone } from "@/components/base/AdminUI";
import {
  cargoCompaniesMock,
  cargoTariffsMock,
  cargoZonesMock,
  defaultShippingSettings,
} from "@/mocks/shipping";
import type {
  CargoCompany,
  CargoStatus,
  CargoTariff,
  Shipment,
  ShippingSettings,
} from "@/types/shipping";

export const SHIPPING_KEYS = {
  companies: "eticaretv8_cargo_companies",
  tariffs: "eticaretv8_cargo_tariffs",
  shipments: "eticaretv8_shipments",
  settings: "eticaretv8_shipping_settings",
};

export const loadCargoCompanies = (): CargoCompany[] => {
  const stored = readJson<CargoCompany[]>(SHIPPING_KEYS.companies, []);
  const merged = [...stored];
  (cargoCompaniesMock as CargoCompany[]).forEach((company) => {
    if (!merged.some((item) => item.id === company.id)) merged.push(company);
  });
  return merged;
};

export const loadCargoTariffs = (): CargoTariff[] => {
  const stored = readJson<CargoTariff[]>(SHIPPING_KEYS.tariffs, []);
  const merged = [...stored];
  (cargoTariffsMock as CargoTariff[]).forEach((tariff) => {
    if (!merged.some((item) => item.companyId === tariff.companyId)) merged.push(tariff);
  });
  return merged;
};

export const loadShipments = (): Shipment[] => {
  const stored = readJson<Shipment[]>(SHIPPING_KEYS.shipments, []);
  return Array.isArray(stored) ? stored : [];
};

/**
 * Kayıtlı bölgeler eski/eksik il listeleriyle gelmiş olabilir.
 * Bu fonksiyon her bölgeyi 81 ili kapsayacak şekilde tamamlar,
 * böylece hiçbir şehir bölge dışında kalmaz.
 */
const withFullCityCoverage = (zones: ShippingSettings["zones"]): ShippingSettings["zones"] =>
  zones.map((zone) => {
    const full = TR_CITY_ZONES[zone.id];
    if (!full) return zone;
    const merged = [...full];
    zone.cities.forEach((city) => {
      if (!merged.some((item) => item.toLowerCase() === city.toLowerCase())) merged.push(city);
    });
    return { ...zone, cities: merged };
  });

export const loadShippingSettings = (): ShippingSettings => {
  const stored = readJson<Partial<ShippingSettings>>(SHIPPING_KEYS.settings, {});
  const zones = stored.zones?.length ? stored.zones : (cargoZonesMock as ShippingSettings["zones"]);
  return {
    ...(defaultShippingSettings as ShippingSettings),
    ...stored,
    zones: withFullCityCoverage(zones),
  };
};

export const statusOrder: CargoStatus[] = [
  "label",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "returned",
];

export const statusMeta: Record<CargoStatus, { label: string; icon: string; tone: Tone; hint: string }> = {
  label: { label: "Etiket Hazır", icon: "ri-price-tag-3-line", tone: "neutral", hint: "Kurye bekleniyor" },
  picked_up: { label: "Kargoya Verildi", icon: "ri-inbox-archive-line", tone: "info", hint: "Araç yüklendi" },
  in_transit: { label: "Yolda", icon: "ri-truck-line", tone: "warning", hint: "Aktarmada" },
  out_for_delivery: { label: "Dağıtımda", icon: "ri-e-bike-2-line", tone: "warning", hint: "Kurye yolda" },
  delivered: { label: "Teslim Edildi", icon: "ri-checkbox-circle-line", tone: "success", hint: "Alıcıya ulaştı" },
  returned: { label: "İade", icon: "ri-arrow-go-back-line", tone: "danger", hint: "Geri gönderim" },
};

export const forwardStatus: CargoStatus[] = ["label", "picked_up", "in_transit", "out_for_delivery", "delivered"];

export const nextCargoStatus = (current: CargoStatus): CargoStatus | null => {
  const index = forwardStatus.indexOf(current);
  if (index < 0 || index >= forwardStatus.length - 1) return null;
  return forwardStatus[index + 1];
};

export const buildTrackingUrl = (company: CargoCompany | undefined, tracking: string): string => {
  if (!company) return "";
  const template = company.trackingUrl?.trim();
  if (!template) return "";
  return template.includes("{tracking}") ? template.replace("{tracking}", tracking) : `${template}${tracking}`;
};

export const generateTracking = (company: CargoCompany | undefined): string => {
  const digits = String(Date.now()).slice(-8) + String(Math.floor(Math.random() * 90) + 10);
  return `${company?.short ?? "KRG"}-${digits}`;
};

export const desiFromDimensions = (width: number, height: number, length: number): number => {
  if (!width || !height || !length) return 0;
  return Math.round(((width * height * length) / 3000) * 10) / 10;
};

interface PriceOptions {
  zoneMultiplier?: number;
  cod?: boolean;
  insurance?: boolean;
}

export const calculateCargoPrice = (
  tariff: CargoTariff | undefined,
  desi: number,
  options: PriceOptions = {}
): number => {
  if (!tariff) return 0;
  const { zoneMultiplier = 1, cod = false, insurance = false } = options;
  const billable = Math.max(1, Math.ceil(desi));
  const base = tariff.basePrice + Math.max(0, billable - 1) * tariff.perDesi;
  const insuranceFee = insurance ? Math.max(8.9, base * 0.04) : 0;
  const total = (base + insuranceFee + (cod ? tariff.codFee : 0)) * zoneMultiplier;
  return Math.round(total * 100) / 100;
};

const normalizeCityName = (value: string): string =>
  value
    .split("/")[0]
    .trim()
    .replace(/â/g, "a")
    .toLocaleLowerCase("tr-TR");

export const cityZone = (settings: ShippingSettings, city: string) => {
  const normalized = normalizeCityName(city);
  return (
    settings.zones.find((zone) => zone.cities.some((item) => normalizeCityName(item) === normalized)) ??
    settings.zones[settings.zones.length - 1]
  );
};

export const saveShipment = (shipment: Shipment): void => {
  const current = loadShipments();
  writeJson(SHIPPING_KEYS.shipments, [shipment, ...current.filter((item) => item.id !== shipment.id)]);
};

export const shipmentsForOrder = (orderId: string): Shipment | undefined =>
  loadShipments().find((item) => item.orderId === orderId);

export const formatDateTime = (date: Date): string =>
  `${date.toLocaleDateString("tr-TR")} ${date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;

export const deliveryDays = (avgDelivery: string): number => {
  const numbers = avgDelivery.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 3;
  return Math.max(...numbers.map((item) => Number(item)));
};

export const estimatedDeliveryDate = (days: number, from: Date = new Date()): Date => {
  const date = new Date(from.getTime());
  let added = 0;
  while (added < Math.max(1, days)) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) added += 1;
  }
  return date;
};

export const formatShortDate = (date: Date): string =>
  date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "short" });

export const cargoStats = (shipments: Shipment[]) => {
  const active = shipments.filter((item) => item.status !== "delivered" && item.status !== "returned");
  const delivered = shipments.filter((item) => item.status === "delivered");
  const waiting = shipments.filter((item) => item.status === "label");
  const returned = shipments.filter((item) => item.status === "returned");
  const totalCost = shipments.reduce((sum, item) => sum + item.cost, 0);
  return {
    total: shipments.length,
    active: active.length,
    delivered: delivered.length,
    waiting: waiting.length,
    returned: returned.length,
    totalCost,
    avgCost: shipments.length ? totalCost / shipments.length : 0,
  };
};