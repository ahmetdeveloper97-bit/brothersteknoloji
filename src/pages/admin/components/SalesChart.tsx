import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { orderTotal, useAdminOrders } from "@/hooks/useAdminOrders";

interface SeriesRow {
  key: string;
  month: string;
  revenue: number;
  orders: number;
}

export default function SalesChart() {
  const { orders } = useAdminOrders();

  const { series, hasData } = useMemo(() => {
    const now = new Date();
    const rows: SeriesRow[] = [];
    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      rows.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleDateString("tr-TR", { month: "short" }),
        revenue: 0,
        orders: 0,
      });
    }

    orders.forEach((order) => {
      if (!order.createdAt) return;
      const created = new Date(order.createdAt);
      if (Number.isNaN(created.getTime())) return;
      const row = rows.find((item) => item.key === `${created.getFullYear()}-${created.getMonth()}`);
      if (!row) return;
      row.revenue += orderTotal(order) / 1000;
      row.orders += 1;
    });

    return {
      series: rows.map(({ key, ...rest }) => ({ ...rest, revenue: Math.round(rest.revenue * 10) / 10 })),
      hasData: rows.some((row) => row.orders > 0),
    };
  }, [orders]);

  return (
    <div className="rounded-xl border border-background-200 bg-background-50 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-base font-bold text-foreground-950">Satış Performansı</h2>
          <p className="text-xs text-foreground-500">Son 7 aylık ciro ve sipariş karşılaştırması</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-foreground-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-500" />
            Ciro (bin ₺)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary-500" />
            Sipariş
          </span>
        </div>
      </div>

      {hasData ? (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(var(--accent-500))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="oklch(var(--accent-500))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="orderFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(var(--primary-500))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="oklch(var(--primary-500))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(var(--background-200))" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid oklch(var(--background-300))",
                  background: "oklch(var(--background-50))",
                  fontSize: 12,
                  color: "oklch(var(--foreground-900))",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Ciro"
                stroke="oklch(var(--accent-600))"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                name="Sipariş"
                stroke="oklch(var(--primary-500))"
                strokeWidth={2}
                fill="url(#orderFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-background-300 bg-background-100/60 text-center">
          <i className="ri-line-chart-line text-2xl text-foreground-400" />
          <p className="text-sm font-medium text-foreground-700">Henüz satış verisi yok</p>
          <p className="max-w-xs text-xs text-foreground-500">
            İlk sipariş tamamlandığında grafik otomatik olarak oluşmaya başlayacak.
          </p>
        </div>
      )}
    </div>
  );
}