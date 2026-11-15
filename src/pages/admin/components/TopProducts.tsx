import { useMemo } from "react";
import { formatPrice } from "@/lib/format";
import { useAdminOrders } from "@/hooks/useAdminOrders";

interface TopRow {
  name: string;
  sold: number;
  revenue: number;
  share: number;
}

export default function TopProducts() {
  const { orders } = useAdminOrders();

  const top = useMemo<TopRow[]>(() => {
    const map = new Map<string, { sold: number; revenue: number }>();
    orders.forEach((order) => {
      (order.lines ?? []).forEach((line) => {
        const key = line.name || "Diğer";
        const current = map.get(key) ?? { sold: 0, revenue: 0 };
        current.sold += line.quantity;
        current.revenue += line.price * line.quantity;
        map.set(key, current);
      });
    });

    const rows = [...map.entries()]
      .map(([name, value]) => ({ name, sold: value.sold, revenue: value.revenue }))
      .sort((first, second) => second.sold - first.sold)
      .slice(0, 5);

    const maxSold = rows.length ? rows[0].sold : 0;
    return rows.map((row) => ({
      ...row,
      share: maxSold > 0 ? Math.round((row.sold / maxSold) * 100) : 0,
    }));
  }, [orders]);

  return (
    <div className="rounded-xl border border-background-200 bg-background-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-base font-bold text-foreground-950">En Çok Satanlar</h2>
        <span className="text-xs text-foreground-500">Tüm siparişler</span>
      </div>

      {top.length > 0 ? (
        <ul className="space-y-4">
          {top.map((product) => (
            <li key={product.name}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-foreground-900">{product.name}</span>
                <span className="whitespace-nowrap text-xs text-foreground-600">{product.sold} adet</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background-200">
                <span className="block h-full rounded-full bg-accent-500" style={{ width: `${product.share}%` }} />
              </div>
              <p className="mt-1 text-[11px] text-foreground-500">{formatPrice(product.revenue)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-background-300 bg-background-100/60 px-3 py-8 text-center">
          <i className="ri-shopping-bag-3-line text-xl text-foreground-400" />
          <p className="text-xs text-foreground-600">Sipariş kalemleri oluştuğunda burada listelenir.</p>
        </div>
      )}
    </div>
  );
}