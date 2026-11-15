import { useCallback, useEffect, useMemo, useState } from "react";
import {
  mergeOrders,
  normalizeOrderStatus,
  orderItemCountOf,
  orderTotalOf,
  readLocalOrders,
  saveLocalOrderStatus,
} from "@/lib/adminOrders";
import { panelListOrders, panelUpdateOrderStatus, readPanelKey } from "@/lib/panelOrders";
import { orderFromPanelRow } from "@/lib/adminOrders";
import type { AdminOrder, OrderStatus } from "@/types/store";

export const ORDERS_UPDATED_EVENT = "eticaretv8:orders-updated";

export const emitOrdersUpdated = (): void => {
  try {
    window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
  } catch {
    /* event may be unavailable */
  }
};

export const orderTotal = (order: AdminOrder): number => orderTotalOf(order);

export const orderItemCount = (order: AdminOrder): number => orderItemCountOf(order);

export function useAdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveConnected, setLiveConnected] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((value) => value + 1), []);

  useEffect(() => {
    const handler = () => setReloadToken((value) => value + 1);
    window.addEventListener(ORDERS_UPDATED_EVENT, handler);
    return () => window.removeEventListener(ORDERS_UPDATED_EVENT, handler);
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError("");
      const local = readLocalOrders();
      const key = readPanelKey();
      let live: AdminOrder[] = [];
      let connected = false;
      let failure = "";
      let setupMissing = key === "";

      if (key) {
        const result = await panelListOrders(key);
        if (result.ok) {
          live = (result.data?.orders ?? []).map(orderFromPanelRow);
          connected = true;
          setupMissing = false;
        } else if (result.code === "unauthorized") {
          failure = "Panel anahtarı geçersiz. Sipariş bağlantısını yeniden kurun.";
          setupMissing = false;
        } else if (result.code === "not_configured") {
          failure = "";
          setupMissing = true;
        } else {
          failure = result.message || "Canlı siparişler yüklenemedi.";
          setupMissing = false;
        }
      }

      if (!active) return;
      setLiveConnected(connected);
      setNeedsSetup(setupMissing);
      setError(failure);
      setOrders(mergeOrders(live, local));
      setLoading(false);
    };

    void run();
    return () => {
      active = false;
    };
  }, [reloadToken]);

  const updateStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const target = orders.find((order) => order.id === orderId);
      const safeStatus = normalizeOrderStatus(status);

      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status: safeStatus } : order)),
      );

      if (target?.source === "live" && target.orderNo) {
        const key = readPanelKey();
        if (!key) {
          setError("Canlı siparişi güncellemek için panel bağlantısı gerekli.");
          return;
        }
        void panelUpdateOrderStatus(key, target.orderNo, safeStatus).then((result) => {
          if (!result.ok) {
            setError(result.message || "Sipariş durumu sunucuya kaydedilemedi.");
            setOrders((current) =>
              current.map((order) => (order.id === orderId ? { ...order, status: target.status } : order)),
            );
          }
        });
        return;
      }

      saveLocalOrderStatus(orderId, safeStatus);
    },
    [orders],
  );

  const counts = useMemo(() => {
    return {
      total: orders.length,
      preparing: orders.filter((order) => order.status === "Hazırlanıyor").length,
      shipping: orders.filter((order) => order.status === "Kargoda").length,
      delivered: orders.filter((order) => order.status === "Teslim Edildi").length,
      cancelled: orders.filter((order) => order.status === "İptal").length,
    };
  }, [orders]);

  return { orders, updateStatus, counts, loading, error, liveConnected, needsSetup, reload };
}