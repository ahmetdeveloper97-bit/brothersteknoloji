import { useMemo, useState } from "react";
import OrderDetailModal from "@/pages/admin/components/OrderDetailModal";
import OrdersConnectionCard from "@/pages/admin/components/OrdersConnectionCard";
import { emitOrdersUpdated, orderItemCount, orderTotal, useAdminOrders } from "@/hooks/useAdminOrders";
import { formatPrice } from "@/lib/format";
import { statusList, statusStyles } from "@/lib/orderStatus";
import type { AdminOrder, OrderStatus } from "@/types/store";

type FilterKey = "all" | OrderStatus;

export default function OrdersTable() {
  const { orders, updateStatus, counts, loading, error, liveConnected, needsSetup, reload } = useAdminOrders();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [activeOrder, setActiveOrder] = useState<AdminOrder | null>(null);
  const [connectionKey, setConnectionKey] = useState("");
  const [keyCopied, setKeyCopied] = useState(false);

  const copyConnectionKey = async () => {
    try {
      await navigator.clipboard.writeText(connectionKey);
      setKeyCopied(true);
      window.setTimeout(() => setKeyCopied(false), 2500);
    } catch {
      setKeyCopied(false);
    }
  };

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter]
  );

  const liveActive = activeOrder ? orders.find((order) => order.id === activeOrder.id) ?? null : null;

  const filters: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: "all", label: "Tümü", count: counts.total },
    ...statusList.map((status) => ({
      key: status as FilterKey,
      label: status,
      count:
        status === "Hazırlanıyor"
          ? counts.preparing
          : status === "Kargoda"
            ? counts.shipping
            : status === "Teslim Edildi"
              ? counts.delivered
              : counts.cancelled,
    })),
  ];

  const showConnection = needsSetup || Boolean(error);

  return (
    <>
      {showConnection && (
        <OrdersConnectionCard
          onConnected={(key) => {
            setConnectionKey(key);
            emitOrdersUpdated();
            reload();
          }}
          invalidKey={Boolean(error) && !needsSetup}
        />
      )}

      {connectionKey && !showConnection && (
        <div className="flex flex-col gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 sm:flex-row sm:items-center">
          <p className="flex min-w-0 flex-1 items-center gap-1.5 text-[11px] text-accent-900">
            <i className="ri-shield-check-line" />
            Canlı bağlantı kuruldu. Başka bir tarayıcı için panel anahtarınız:
            <code className="truncate rounded bg-background-50 px-1.5 py-0.5 font-mono text-[10px] text-foreground-900">
              {connectionKey}
            </code>
          </p>
          <button
            type="button"
            onClick={copyConnectionKey}
            className="flex h-7 shrink-0 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-md border border-accent-400 px-2 text-[11px] font-semibold text-accent-900 hover:bg-accent-100"
          >
            <i className={keyCopied ? "ri-check-line" : "ri-file-copy-line"} />
            {keyCopied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      )}

      {error && !needsSetup && (
        <div className="flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2.5 text-xs leading-relaxed text-secondary-950">
          <i className="ri-error-warning-line mt-0.5" />
          <span className="flex-1">{error}</span>
          <button type="button" onClick={reload} className="cursor-pointer font-semibold underline decoration-dotted">
            Tekrar dene
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-background-200 bg-background-50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-bold text-foreground-950">Siparişler</h2>
            <p className="text-xs text-foreground-500">
              Satıra tıklayarak sipariş detayını açın ve durumunu güncelleyin
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-medium ${
                liveConnected
                  ? "bg-accent-100 text-accent-900"
                  : "bg-background-100 text-foreground-600"
              }`}
            >
              <i className={liveConnected ? "ri-cloud-line" : "ri-cloud-off-line"} />
              {liveConnected ? "Canlı bağlı" : "Yerel kayıtlar"}
            </span>
            <button
              type="button"
              onClick={reload}
              className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-medium text-foreground-700 hover:bg-background-100"
            >
              <i className={`ri-refresh-line ${loading ? "animate-spin" : ""}`} />
              Yenile
            </button>
            <span className="whitespace-nowrap rounded-full bg-background-100 px-3 py-1.5 text-xs font-medium text-foreground-600">
              {filtered.length} kayıt
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-background-200 px-5 py-3">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === item.key
                  ? "bg-primary-700 text-background-50"
                  : "bg-background-100 text-foreground-600 hover:bg-background-200"
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  filter === item.key ? "bg-background-50/25 text-background-50" : "bg-background-50 text-foreground-600"
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-5 py-3 font-medium">Sipariş</th>
                <th className="px-5 py-3 font-medium">Müşteri</th>
                <th className="px-5 py-3 font-medium">Tarih</th>
                <th className="px-5 py-3 font-medium">Tutar</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <span className="inline-flex items-center gap-2 text-sm text-foreground-500">
                      <i className="ri-loader-4-line animate-spin text-lg" />
                      Siparişler yükleniyor...
                    </span>
                  </td>
                </tr>
              )}

              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className="cursor-pointer border-b border-background-100 transition-colors last:border-0 hover:bg-background-100/70"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <span className="font-medium text-foreground-900">{order.id}</span>
                    <span className="ml-2 text-[11px] text-foreground-500">
                      {orderItemCount(order) > 0 ? `${orderItemCount(order)} kalem` : "kalem bilgisi yok"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-background-200 text-[10px] font-bold text-foreground-700">
                        {(order.customer || "?")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate whitespace-nowrap text-foreground-800">{order.customer}</span>
                        {order.email && (
                          <span className="block truncate text-[11px] text-foreground-500">{order.email}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-foreground-600">{order.date || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-3 font-semibold text-foreground-900">
                    {formatPrice(orderTotal(order))}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Sipariş detayı"
                      className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-foreground-900"
                    >
                      <i className="ri-arrow-right-s-line" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center">
              <i className="ri-file-list-3-line text-2xl text-foreground-400" />
              <p className="text-sm font-medium text-foreground-700">
                {orders.length === 0 ? "Henüz sipariş bulunmuyor" : "Bu durumda sipariş bulunmuyor"}
              </p>
              <p className="max-w-sm text-xs leading-relaxed text-foreground-500">
                {orders.length === 0
                  ? "Mağazadan ödeme tamamlandığında sipariş burada otomatik olarak görünecek."
                  : "Farklı bir durum filtresi seçebilirsiniz."}
              </p>
            </div>
          )}
        </div>
      </div>

      {liveActive && (
        <OrderDetailModal
          order={liveActive}
          onClose={() => setActiveOrder(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </>
  );
}