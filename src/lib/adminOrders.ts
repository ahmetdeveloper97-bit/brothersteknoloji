import { loadPayments } from "@/lib/integrations";
import { readJson, writeJson } from "@/lib/persistent";
import type { PanelOrderRow } from "@/lib/panelOrders";
import type { AdminOrder, OrderLine, OrderStatus } from "@/types/store";
import type { PaymentTransaction } from "@/types/integrations";

export const PLACED_ORDERS_KEY = "eticaretv8_placed_orders";
export const LOCAL_ORDER_STATUS_KEY = "eticaretv8_local_order_status";

export const ORDER_STATUSES: OrderStatus[] = ["Hazırlanıyor", "Kargoda", "Teslim Edildi", "İptal"];

export const normalizeOrderStatus = (value: unknown): OrderStatus => {
  const text = String(value ?? "").trim();
  return (ORDER_STATUSES as string[]).includes(text) ? (text as OrderStatus) : "Hazırlanıyor";
};

const formatIsoDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const paymentLabel = (installment: number, cardMask?: string | null): string => {
  const plan = installment > 1 ? `${installment} taksit` : "Tek çekim";
  const last4 = (cardMask ?? "").replace(/\D/g, "").slice(-4);
  return last4 ? `Kredi Kartı · ${plan} · **** ${last4}` : `Kredi Kartı · ${plan}`;
};

export const orderFromPanelRow = (row: PanelOrderRow): AdminOrder => ({
  id: `#${String(row.order_no ?? "").toUpperCase()}`,
  orderNo: row.order_no,
  source: "live",
  customer: row.buyer_name || "İsimsiz müşteri",
  email: row.buyer_email || "",
  phone: row.buyer_phone || "",
  date: formatIsoDate(row.created_at),
  createdAt: row.created_at,
  status: normalizeOrderStatus(row.order_status),
  payment: paymentLabel(Number(row.installment ?? 1), row.card_mask),
  address: row.buyer_address || "",
  city: row.buyer_city || "",
  cargo: "—",
  tracking: "—",
  note:
    row.status === "success"
      ? ""
      : `Ödeme durumu: ${row.status}${row.error_message ? ` · ${row.error_message}` : ""}`,
  amount: Number(row.amount ?? 0),
  lines: (row.items ?? []).map((item) => ({
    name: String(item?.name ?? "Ürün"),
    brand: "",
    image: "",
    quantity: Number(item?.quantity ?? 1),
    price: Number(item?.price ?? 0),
  })),
});

const orderFromPayment = (payment: PaymentTransaction): AdminOrder => ({
  id: `#${String(payment.id ?? "").toUpperCase()}`,
  orderNo: String(payment.id ?? ""),
  source: "local",
  customer: payment.customer || "İsimsiz müşteri",
  email: payment.email || "",
  phone: "",
  date: payment.date || "",
  status: "Hazırlanıyor",
  payment: paymentLabel(Number(payment.installment ?? 1), payment.cardMask),
  address: "",
  city: "",
  cargo: "—",
  tracking: "—",
  note: "Bu tarayıcıda tamamlanan ödeme kaydı.",
  amount: Number(payment.amount ?? 0),
  lines: [],
});

export const readPlacedOrders = (): AdminOrder[] => {
  const stored = readJson<AdminOrder[] | null>(PLACED_ORDERS_KEY, null);
  if (!Array.isArray(stored)) return [];
  return stored
    .filter((order) => order && order.id)
    .map((order) => ({ ...order, source: order.source ?? "local", lines: order.lines ?? [] }));
};

export const savePlacedOrder = (order: AdminOrder): void => {
  const current = readPlacedOrders().filter((item) => item.id !== order.id);
  writeJson(PLACED_ORDERS_KEY, [{ ...order, source: order.source ?? "local" }, ...current].slice(0, 200));
};

const readLocalStatuses = (): Record<string, OrderStatus> => {
  const stored = readJson<Record<string, OrderStatus> | null>(LOCAL_ORDER_STATUS_KEY, null);
  return stored && typeof stored === "object" ? stored : {};
};

export const saveLocalOrderStatus = (orderId: string, status: OrderStatus): void => {
  const next = { ...readLocalStatuses(), [orderId]: status };
  writeJson(LOCAL_ORDER_STATUS_KEY, next);
};

/** Bu tarayıcıya ait siparişler: tamamlanan ödemeler + kaydedilen siparişler. */
export const readLocalOrders = (): AdminOrder[] => {
  const statuses = readLocalStatuses();
  const placed = readPlacedOrders();
  const knownIds = new Set(placed.map((order) => order.id));
  const fromPayments = loadPayments()
    .filter((payment) => payment?.id)
    .map(orderFromPayment)
    .filter((order) => !knownIds.has(order.id));

  return [...placed, ...fromPayments].map((order) =>
    statuses[order.id] ? { ...order, status: statuses[order.id] } : order,
  );
};

export const orderTotalOf = (order: AdminOrder): number => {
  const lineTotal = (order.lines ?? []).reduce((sum, line) => sum + line.price * line.quantity, 0);
  if (lineTotal > 0) return lineTotal;
  return Number(order.amount ?? 0);
};

export const orderItemCountOf = (order: AdminOrder): number => {
  const count = (order.lines ?? []).reduce((sum, line) => sum + line.quantity, 0);
  return count > 0 ? count : 0;
};

export const mergeOrders = (live: AdminOrder[], local: AdminOrder[]): AdminOrder[] => {
  const seen = new Set(live.map((order) => order.id));
  const merged = [...live, ...local.filter((order) => !seen.has(order.id))];
  return merged.sort((first, second) => {
    const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : 0;
    const secondTime = second.createdAt ? new Date(second.createdAt).getTime() : 0;
    if (firstTime || secondTime) return secondTime - firstTime;
    return second.id.localeCompare(first.id);
  });
};

export const emptyOrderLines = (lines: OrderLine[]): OrderLine[] => lines ?? [];