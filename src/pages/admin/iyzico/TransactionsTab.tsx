import { useMemo, useState } from "react";
import { Kpi, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import type { Tone } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import type { PaymentStatus, PaymentTransaction } from "@/types/integrations";

const statusMeta: Record<PaymentStatus, { label: string; tone: Tone }> = {
  success: { label: "Başarılı", tone: "success" },
  pending3d: { label: "3D Bekliyor", tone: "warning" },
  failed: { label: "Reddedildi", tone: "danger" },
  refunded: { label: "İade Edildi", tone: "neutral" },
};

interface TransactionsTabProps {
  payments: PaymentTransaction[];
  onPayments: (payments: PaymentTransaction[]) => void;
}

export default function TransactionsTab({ payments, onPayments }: TransactionsTabProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | PaymentStatus>("all");
  const [flash, setFlash] = useState("");

  const stats = useMemo(() => {
    const success = payments.filter((payment) => payment.status === "success");
    return {
      revenue: success.reduce((sum, payment) => sum + payment.amount, 0),
      success: success.length,
      pending: payments.filter((payment) => payment.status === "pending3d").length,
      refunded: payments.filter((payment) => payment.status === "refunded").length,
    };
  }, [payments]);

  const visible = payments.filter((payment) => {
    const matchesStatus = status === "all" || payment.status === status;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      payment.customer.toLowerCase().includes(query) ||
      payment.id.toLowerCase().includes(query) ||
      payment.email.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const update = (id: string, next: PaymentStatus) => {
    onPayments(payments.map((payment) => (payment.id === id ? { ...payment, status: next } : payment)));
  };

  const approve = (payment: PaymentTransaction) => {
    update(payment.id, "success");
    setFlash(`${payment.id} · 3D doğrulama tamamlandı, ödeme başarılı.`);
  };

  const refund = (payment: PaymentTransaction) => {
    update(payment.id, "refunded");
    setFlash(`${payment.id} · ${formatPrice(payment.amount)} iade talebi oluşturuldu.`);
  };

  return (
    <div className="space-y-4">
      {flash && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          <span className="flex-1">{flash}</span>
          <button type="button" onClick={() => setFlash("")} aria-label="Kapat" className="cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-bank-card-line" label="Başarılı Ciro" value={formatPrice(stats.revenue)} hint="Tahsil edilen" tone="success" />
        <Kpi icon="ri-checkbox-circle-line" label="Başarılı İşlem" value={String(stats.success)} hint="Son 30 gün" tone="info" />
        <Kpi icon="ri-shield-check-line" label="3D Bekleyen" value={String(stats.pending)} hint="Doğrulama gerekli" tone="warning" />
        <Kpi icon="ri-arrow-go-back-line" label="İade" value={String(stats.refunded)} hint="Tamamlanan iadeler" tone="neutral" />
      </div>

      <Panel
        title="Sanal POS İşlemleri"
        subtitle="iyzico üzerinden alınan ödemeler"
        icon="ri-secure-payment-line"
        padded={false}
        action={
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="İşlem no / müşteri"
              className={`${inputClass} h-9 w-40 text-xs`}
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as "all" | PaymentStatus)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-800 outline-none"
            >
              <option value="all">Tümü</option>
              <option value="success">Başarılı</option>
              <option value="pending3d">3D Bekliyor</option>
              <option value="failed">Reddedildi</option>
              <option value="refunded">İade</option>
            </select>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-4 py-2.5 font-semibold">İşlem</th>
                <th className="px-3 py-2.5 font-semibold">Müşteri</th>
                <th className="px-3 py-2.5 font-semibold">Tutar</th>
                <th className="px-3 py-2.5 font-semibold">Taksit</th>
                <th className="px-3 py-2.5 font-semibold">Kart</th>
                <th className="px-3 py-2.5 font-semibold">Durum</th>
                <th className="px-4 py-2.5 text-right font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((payment) => (
                <tr key={payment.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-foreground-950">{payment.id}</p>
                    <p className="mt-0.5 text-[10px] text-foreground-500">{payment.date}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-medium text-foreground-900">{payment.customer}</p>
                    <p className="mt-0.5 truncate text-[10px] text-foreground-500">{payment.email}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-foreground-950">
                    {formatPrice(payment.amount)}
                  </td>
                  <td className="px-3 py-3 text-xs text-foreground-700">
                    {payment.installment === 1 ? "Tek çekim" : `${payment.installment} taksit`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[11px] text-foreground-600">{payment.cardMask}</td>
                  <td className="px-3 py-3">
                    <Pill tone={statusMeta[payment.status].tone}>{statusMeta[payment.status].label}</Pill>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {payment.status === "pending3d" && (
                        <button
                          type="button"
                          onClick={() => approve(payment)}
                          className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-accent-100 px-2 text-[11px] font-semibold text-accent-900 hover:bg-accent-200"
                        >
                          <i className="ri-shield-check-line" />
                          Onayla
                        </button>
                      )}
                      {payment.status === "success" && (
                        <button
                          type="button"
                          onClick={() => refund(payment)}
                          className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-background-100 px-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
                        >
                          <i className="ri-arrow-go-back-line" />
                          İade
                        </button>
                      )}
                      {payment.status !== "pending3d" && payment.status !== "success" && (
                        <span className="text-[11px] text-foreground-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-foreground-500">
                    İşlem bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}