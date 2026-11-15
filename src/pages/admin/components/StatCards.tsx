import { useMemo } from "react";
import { formatPrice } from "@/lib/format";
import { orderTotal, useAdminOrders } from "@/hooks/useAdminOrders";

export default function StatCards() {
  const { orders } = useAdminOrders();

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + orderTotal(order), 0);
    const count = orders.length;
    const average = count > 0 ? revenue / count : 0;
    const delivered = orders.filter((order) => order.status === "Teslim Edildi").length;
    const preparing = orders.filter((order) => order.status === "Hazırlanıyor").length;

    return [
      {
        id: "revenue",
        label: "Toplam Ciro",
        value: formatPrice(revenue),
        hint: "Canlı ve bu tarayıcıdaki siparişler",
        icon: "ri-wallet-3-line",
      },
      {
        id: "orders",
        label: "Sipariş Sayısı",
        value: String(count),
        hint: count > 0 ? `${preparing} sipariş hazırlanıyor` : "Henüz sipariş yok",
        icon: "ri-file-list-3-line",
      },
      {
        id: "basket",
        label: "Ortalama Sepet",
        value: formatPrice(average),
        hint: "Sipariş başına ortalama tutar",
        icon: "ri-shopping-basket-2-line",
      },
      {
        id: "delivered",
        label: "Teslim Edilen",
        value: String(delivered),
        hint: count > 0 ? `${count} sipariş içinde` : "Henüz sipariş yok",
        icon: "ri-truck-line",
      },
    ];
  }, [orders]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.id} className="rounded-xl border border-background-200 bg-background-50 p-5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground-500">{stat.label}</p>
              <p className="mt-1.5 truncate font-heading text-2xl font-bold text-foreground-950">{stat.value}</p>
            </div>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-100 text-primary-700">
              <i className={`${stat.icon} text-lg`} />
            </span>
          </div>
          <p className="mt-3 text-xs text-foreground-500">{stat.hint}</p>
        </div>
      ))}
    </div>
  );
}