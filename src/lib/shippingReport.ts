import type { CargoCompany, Shipment } from "@/types/shipping";

export interface CompanyReport {
  company: CargoCompany;
  total: number;
  delivered: number;
  active: number;
  returned: number;
  avgCost: number;
  avgDays: number | null;
  onTimeRate: number | null;
  score: number;
}

const parseTrDate = (value: string): Date | null => {
  const datePart = value.split(" ")[0];
  const [day, month, year] = datePart.split(".").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

export const parseShipmentDate = parseTrDate;

const deliveryDuration = (shipment: Shipment): number | null => {
  const start = parseTrDate(shipment.date);
  const deliveredMovement = [...shipment.history].reverse().find((item) => item.status === "delivered");
  const end = deliveredMovement ? parseTrDate(deliveredMovement.date) : null;
  if (!start || !end) return null;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000));
};

const isOnTime = (shipment: Shipment): boolean | null => {
  const deliveredMovement = [...shipment.history].reverse().find((item) => item.status === "delivered");
  const deliveredAt = deliveredMovement ? parseTrDate(deliveredMovement.date) : null;
  const eta = parseTrDate(shipment.eta);
  if (!deliveredAt || !eta) return null;
  return deliveredAt.getTime() <= eta.getTime();
};

const average = (values: number[]): number | null =>
  values.length ? values.reduce((sum, item) => sum + item, 0) / values.length : null;

const clamp = (value: number): number => Math.min(1, Math.max(0, value));

export const buildCompanyReports = (companies: CargoCompany[], shipments: Shipment[]): CompanyReport[] => {
  const rows = companies
    .map((company) => {
      const items = shipments.filter((shipment) => shipment.companyId === company.id);
      const deliveredItems = items.filter((shipment) => shipment.status === "delivered");
      const durations = deliveredItems.map(deliveryDuration).filter((value): value is number => value !== null);
      const onTimeFlags = deliveredItems.map(isOnTime).filter((value): value is boolean => value !== null);
      const costs = items.map((shipment) => shipment.cost);

      return {
        company,
        total: items.length,
        delivered: deliveredItems.length,
        active: items.filter((item) => item.status !== "delivered" && item.status !== "returned").length,
        returned: items.filter((item) => item.status === "returned").length,
        avgCost: costs.length ? costs.reduce((sum, item) => sum + item, 0) / costs.length : 0,
        avgDays: average(durations),
        onTimeRate: onTimeFlags.length
          ? onTimeFlags.filter(Boolean).length / onTimeFlags.length
          : null,
        score: 0,
      } as CompanyReport;
    })
    .filter((row) => row.total > 0);

  const maxCost = Math.max(...rows.map((row) => row.avgCost), 1);
  const maxDays = Math.max(...rows.map((row) => row.avgDays ?? 0), 1);

  return rows
    .map((row) => {
      const speedScore = row.avgDays === null ? 0.5 : clamp(1 - (row.avgDays - 1) / Math.max(3, maxDays));
      const costScore = clamp(1 - row.avgCost / maxCost);
      const onTimeScore = row.onTimeRate ?? 0.5;
      const volumeBonus = clamp(row.total / 4) * 0.05;
      const score = clamp(onTimeScore * 0.45 + speedScore * 0.35 + costScore * 0.2 + volumeBonus);
      return { ...row, score };
    })
    .sort((a, b) => b.score - a.score);
};

export interface ShippingReportSummary {
  total: number;
  delivered: number;
  returned: number;
  onTimeRate: number | null;
  avgDays: number | null;
  avgCost: number;
}

export const buildReportSummary = (shipments: Shipment[]): ShippingReportSummary => {
  const deliveredItems = shipments.filter((shipment) => shipment.status === "delivered");
  const durations = deliveredItems.map(deliveryDuration).filter((value): value is number => value !== null);
  const onTimeFlags = deliveredItems.map(isOnTime).filter((value): value is boolean => value !== null);
  const costs = shipments.map((shipment) => shipment.cost);
  return {
    total: shipments.length,
    delivered: deliveredItems.length,
    returned: shipments.filter((shipment) => shipment.status === "returned").length,
    onTimeRate: onTimeFlags.length ? onTimeFlags.filter(Boolean).length / onTimeFlags.length : null,
    avgDays: average(durations),
    avgCost: costs.length ? costs.reduce((sum, item) => sum + item, 0) / costs.length : 0,
  };
};

export type ReportRangePreset = "7" | "30" | "90" | "all" | "custom";

export interface ReportRange {
  preset: ReportRangePreset;
  start: string;
  end: string;
}

const endOfDay = (date: Date): Date => {
  const copy = new Date(date.getTime());
  copy.setHours(23, 59, 59, 999);
  return copy;
};

export const latestShipmentDate = (shipments: Shipment[]): Date => {
  const values = shipments.map((shipment) => parseTrDate(shipment.date)).filter((value): value is Date => value !== null);
  if (!values.length) return endOfDay(new Date());
  return endOfDay(new Date(Math.max(...values.map((value) => value.getTime()))));
};

export const filterShipmentsByRange = (shipments: Shipment[], range: ReportRange): Shipment[] => {
  if (range.preset === "all") return shipments;

  if (range.preset === "custom") {
    const start = range.start ? new Date(`${range.start}T00:00:00`) : null;
    const end = range.end ? new Date(`${range.end}T23:59:59`) : null;
    return shipments.filter((shipment) => {
      const date = parseTrDate(shipment.date);
      if (!date) return false;
      if (start && date.getTime() < start.getTime()) return false;
      if (end && date.getTime() > end.getTime()) return false;
      return true;
    });
  }

  const anchor = latestShipmentDate(shipments);
  const days = Number(range.preset);
  const from = new Date(anchor.getTime());
  from.setDate(from.getDate() - (days - 1));
  from.setHours(0, 0, 0, 0);

  return shipments.filter((shipment) => {
    const date = parseTrDate(shipment.date);
    if (!date) return false;
    return date.getTime() >= from.getTime() && date.getTime() <= anchor.getTime();
  });
};

const deliveredDate = (shipment: Shipment): string => {
  const movement = [...shipment.history].reverse().find((item) => item.status === "delivered");
  return movement?.date ?? "";
};

const statusLabels: Record<Shipment["status"], string> = {
  label: "Etiket Hazır",
  picked_up: "Kargoya Verildi",
  in_transit: "Yolda",
  out_for_delivery: "Dağıtımda",
  delivered: "Teslim Edildi",
  returned: "İade",
};

export const buildShipmentCsvRows = (
  shipments: Shipment[],
  companies: CargoCompany[]
): Array<Array<string | number>> => {
  const header = [
    "Gönderi No",
    "Sipariş No",
    "Müşteri",
    "Telefon",
    "Şehir",
    "Kargo Firması",
    "Takip No",
    "Durum",
    "Etiket Tarihi",
    "Teslim Tarihi",
    "Tahmini Teslim",
    "Desi",
    "Paket",
    "Kargo Bedeli (TL)",
    "Kapıda Ödeme (TL)",
  ];

  const rows = shipments.map((shipment) => {
    const company = companies.find((item) => item.id === shipment.companyId);
    return [
      shipment.id,
      shipment.orderId,
      shipment.customer,
      shipment.phone,
      shipment.city,
      company?.name ?? "—",
      shipment.tracking,
      statusLabels[shipment.status],
      shipment.date,
      deliveredDate(shipment) || "—",
      shipment.eta,
      shipment.desi,
      shipment.packages,
      shipment.cost.toFixed(2).replace(".", ","),
      shipment.codAmount.toFixed(2).replace(".", ","),
    ];
  });

  return [header, ...rows];
};

export const buildCompanyCsvRows = (
  companies: CargoCompany[],
  shipments: Shipment[]
): Array<Array<string | number>> => {
  const header = [
    "Kargo Firması",
    "Gönderi",
    "Teslim",
    "İade",
    "Ortalama Süre (gün)",
    "Zamanında Teslim (%)",
    "Ortalama Maliyet (TL)",
    "Skor",
  ];

  const rows = buildCompanyReports(companies, shipments).map((row) => [
    row.company.name,
    row.total,
    row.delivered,
    row.returned,
    row.avgDays === null ? "—" : row.avgDays.toFixed(1).replace(".", ","),
    row.onTimeRate === null ? "—" : Math.round(row.onTimeRate * 100),
    row.avgCost.toFixed(2).replace(".", ","),
    Math.round(row.score * 100),
  ]);

  return [header, ...rows];
};