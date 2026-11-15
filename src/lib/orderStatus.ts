import type { OrderStatus } from "@/types/store";

export const statusList: OrderStatus[] = ["Hazırlanıyor", "Kargoda", "Teslim Edildi", "İptal"];

export const statusStyles: Record<OrderStatus, string> = {
  Hazırlanıyor: "bg-accent-50 text-accent-700 border border-accent-200",
  Kargoda: "bg-secondary-200 text-secondary-800",
  "Teslim Edildi": "bg-accent-100 text-accent-800",
  İptal: "bg-background-200 text-foreground-600",
};

export const statusIcons: Record<OrderStatus, string> = {
  Hazırlanıyor: "ri-time-line",
  Kargoda: "ri-truck-line",
  "Teslim Edildi": "ri-checkbox-circle-line",
  İptal: "ri-close-circle-line",
};