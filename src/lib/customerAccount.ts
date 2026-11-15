import { readPlacedOrders } from "@/lib/adminOrders";
import { loadShipments } from "@/lib/shipping";
import type { AdminOrder } from "@/types/store";
import type { Shipment } from "@/types/shipping";

const SESSION_KEY = "eticaretv8_user";

export const DEMO_EMAIL = "demo@musteri.com";

export interface CustomerSession {
  email: string;
}

export interface CustomerShipment {
  shipment: Shipment;
  order?: AdminOrder;
}

export const loadCustomerSession = (): CustomerSession | null => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed?.email ? { email: parsed.email } : null;
  } catch {
    return null;
  }
};

export const clearCustomerSession = (): void => {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage may be unavailable */
  }
};

const dateValue = (value: string): number => {
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = (datePart ?? "").split(".").map(Number);
  if (!day || !month || !year) return 0;
  const [hour, minute] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(year, month - 1, day, hour || 0, minute || 0).getTime();
};

export const loadCustomerShipments = (session: CustomerSession | null): CustomerShipment[] => {
  if (!session) return [];
  const email = session.email.toLowerCase();
  const isDemo = email === DEMO_EMAIL;
  const shipments = [...loadShipments()].sort((a, b) => dateValue(b.date) - dateValue(a.date));

  return shipments
    .map((shipment) => ({
      shipment,
      order: readPlacedOrders().find((order) => order.id === shipment.orderId),
    }))
    .filter((item) => isDemo || item.order?.email.toLowerCase() === email)
    .slice(0, 6);
};