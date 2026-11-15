import {
  calculateCargoPrice,
  cityZone,
  deliveryDays,
  estimatedDeliveryDate,
  formatDateTime,
  generateTracking,
  loadCargoCompanies,
  loadCargoTariffs,
  loadShippingSettings,
  saveShipment,
} from "@/lib/shipping";
import type { AdminOrder } from "@/types/store";
import type { Shipment } from "@/types/shipping";

export const orderAmount = (order: AdminOrder): number =>
  order.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

export interface OrderShipmentOptions {
  companyId?: string;
  desi?: number;
  packages?: number;
}

export const buildShipmentFromOrder = (order: AdminOrder, options: OrderShipmentOptions = {}): Shipment => {
  const settings = loadShippingSettings();
  const companies = loadCargoCompanies().filter((company) => company.enabled);
  const tariffs = loadCargoTariffs();
  const company =
    companies.find((item) => item.id === (options.companyId ?? settings.defaultCompanyId)) ?? companies[0];
  const tariff = tariffs.find((item) => item.companyId === company?.id);
  const zone = cityZone(settings, order.city || "İstanbul");
  const desi = Math.max(0.5, Math.round((options.desi ?? settings.defaultDesi) * 10) / 10);
  const isCod = order.payment.toLowerCase().includes("kapıda");
  const codAmount = isCod ? orderAmount(order) : 0;
  const cost = calculateCargoPrice(tariff, desi, {
    zoneMultiplier: zone.multiplier,
    cod: isCod,
    insurance: settings.insuranceEnabled,
  });
  const now = new Date();
  const eta = estimatedDeliveryDate(deliveryDays(company?.avgDelivery ?? "2-3 gün"), now);

  return {
    id: `SHP-${String(now.getTime()).slice(-5)}`,
    orderId: order.id,
    customer: order.customer,
    phone: order.phone,
    city: order.city,
    address: order.address,
    companyId: company?.id ?? "yurtici",
    tracking: generateTracking(company),
    status: "label",
    desi,
    packages: Math.max(1, options.packages ?? 1),
    cost,
    codAmount,
    date: formatDateTime(now),
    eta: eta.toLocaleDateString("tr-TR"),
    note: order.note,
    history: [
      {
        status: "label",
        date: formatDateTime(now),
        location: "Brothers Teknoloji Lojistik",
        note: `${company?.name ?? "Kargo"} için etiket oluşturuldu.`,
      },
    ],
  };
};

export const createShipmentForOrder = (order: AdminOrder, options: OrderShipmentOptions = {}): Shipment => {
  const shipment = buildShipmentFromOrder(order, options);
  saveShipment(shipment);
  return shipment;
};