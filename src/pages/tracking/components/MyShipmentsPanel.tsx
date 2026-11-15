import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pill } from "@/components/base/AdminUI";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatMoney } from "@/lib/accountFormat";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { loadPayments } from "@/lib/integrations";
import { loadCargoCompanies, loadShipments, statusMeta } from "@/lib/shipping";
import { supabase } from "@/lib/supabase";
import type { InvoiceRow } from "@/types/account";
import type { PaymentTransaction } from "@/types/integrations";
import type { Shipment } from "@/types/shipping";

interface MyShipmentsPanelProps {
  onSelect: (tracking: string) => void;
}

interface OrderRow {
  invoice: InvoiceRow;
  payment: PaymentTransaction | null;
  shipment: Shipment | null;
}

const normalize = (value?: string | null): string => (value ?? "").replace(/^#/, "").trim().toLowerCase();

type OrderStage = "paid" | "transit" | "delivered" | "other";
type StageFilter = "all" | "paid" | "transit" | "delivered";

const stageOf = (row: OrderRow): OrderStage => {
  const status = row.shipment?.status;
  if (status === "delivered") return "delivered";
  if (status === "returned") return "other";
  if (status === "picked_up" || status === "in_transit" || status === "out_for_delivery") return "transit";
  const isPaid = row.payment?.status === "success" || (!row.payment && row.invoice.status === "paid");
  return isPaid ? "paid" : "other";
};

const paymentMeta: Record<string, { label: string; className: string; icon: string }> = {
  success: { label: "Ödendi", className: "bg-accent-100 text-accent-900", icon: "ri-checkbox-circle-line" },
  pending3d: { label: "3D Onayı Bekliyor", className: "bg-secondary-100 text-secondary-900", icon: "ri-time-line" },
  failed: { label: "Ödeme Başarısız", className: "bg-background-200 text-foreground-700", icon: "ri-close-circle-line" },
  refunded: { label: "İade Edildi", className: "bg-background-200 text-foreground-700", icon: "ri-arrow-go-back-line" },
};

export default function MyShipmentsPanel({ onSelect }: MyShipmentsPanelProps) {
  const { user, profile } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<StageFilter>("all");
  const [pdfBusyId, setPdfBusyId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState("");

  const downloadInvoice = useCallback(
    async (invoice: InvoiceRow) => {
      setPdfError("");
      setPdfBusyId(invoice.id);
      try {
        await downloadInvoicePdf(invoice, {
          customerName: invoice.billing_name || profile?.full_name,
          customerEmail: user?.email,
        });
      } catch {
        setPdfError("Fatura PDF olarak indirilemedi. Lütfen tekrar deneyin.");
      } finally {
        setPdfBusyId(null);
      }
    },
    [profile?.full_name, user?.email],
  );

  const load = useCallback(async () => {
    if (!user) {
      setInvoices([]);
      setPayments([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data, error: queryError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      if (queryError) throw queryError;
      setInvoices((data ?? []) as InvoiceRow[]);
      setPayments(loadPayments());
    } catch {
      setError("Siparişleriniz yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const companies = useMemo(() => loadCargoCompanies(), []);

  const rows = useMemo<OrderRow[]>(() => {
    const shipments = loadShipments();
    return invoices.map((invoice) => {
      const orderKey = normalize(invoice.order_no);
      const payment = orderKey ? payments.find((item) => normalize(item.id) === orderKey) ?? null : null;
      const shipment = orderKey ? shipments.find((item) => normalize(item.orderId) === orderKey) ?? null : null;
      return { invoice, payment, shipment };
    });
  }, [invoices, payments]);

  const paidCount = rows.filter((row) => stageOf(row) === "paid").length;
  const inTransitCount = rows.filter((row) => stageOf(row) === "transit").length;
  const deliveredCount = rows.filter((row) => stageOf(row) === "delivered").length;
  const visibleRows = filter === "all" ? rows : rows.filter((row) => stageOf(row) === filter);
  const tabs: Array<{ key: StageFilter; label: string; icon: string; count: number }> = [
    { key: "all", label: "Tümü", icon: "ri-list-check", count: rows.length },
    { key: "paid", label: "Ödendi", icon: "ri-checkbox-circle-line", count: paidCount },
    { key: "transit", label: "Yolda", icon: "ri-truck-line", count: inTransitCount },
    { key: "delivered", label: "Teslim edildi", icon: "ri-home-smile-line", count: deliveredCount },
  ];
  const totalAmount = rows.reduce((sum, row) => sum + Number(row.invoice.amount ?? 0), 0);
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Müşterimiz";

  return (
    <section id="siparislerim" className="scroll-mt-32 rounded-2xl border border-background-200 bg-background-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3 md:px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <i className="ri-file-list-3-line text-base" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-sm font-bold text-foreground-950">Siparişlerim</h2>
          <p className="text-[11px] text-foreground-500">
            {user
              ? `${displayName} · sipariş, ödeme ve fatura kayıtlarınız eşleştirildi`
              : "Siparişlerinizi görmek için giriş yapın"}
          </p>
        </div>
        {user ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => void load()}
              title="Yenile"
              aria-label="Yenile"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-100"
            >
              <i className="ri-refresh-line" />
            </button>
            <Link
              to="/hesabim?sekme=faturalar"
              className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-file-text-line" />
              Faturalarım
            </Link>
          </div>
        ) : (
          <Link
            to="/giris"
            className="flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-login-box-line" />
            Giriş Yap
          </Link>
        )}
      </div>

      {!user && (
        <div className="flex flex-col items-start gap-3 px-4 py-5 sm:flex-row sm:items-center md:px-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background-100 text-foreground-500">
            <i className="ri-lock-2-line text-lg" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground-900">Siparişlerinizi görmek için giriş yapın</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground-600">
              Siparişleriniz üyelik bilgilerinizle eşleştirilir; ödeme kaydı, e-faturanız ve kargo takip numaranız tek
              ekranda görünür.
            </p>
          </div>
          <Link
            to="/giris"
            className="flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-100 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-200"
          >
            <i className="ri-user-3-line" />
            Siparişlerim / Giriş
          </Link>
        </div>
      )}

      {user && (
        <div className="px-4 py-4 md:px-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-background-100 p-1">
              {tabs.map((tab) => {
                const active = filter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    aria-pressed={active}
                    className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                      active
                        ? "bg-primary-800 text-background-50 shadow-sm"
                        : "text-foreground-700 hover:bg-background-200"
                    }`}
                  >
                    <i className={tab.icon} />
                    {tab.label}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-bold ${
                        active ? "bg-background-50/25 text-background-50" : "bg-background-200 text-foreground-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="rounded-md bg-background-100 px-2 py-1 text-[11px] font-semibold text-foreground-800">
              Toplam {formatMoney(totalAmount)}
            </span>
          </div>

          {pdfError && (
            <p className="mb-3 flex items-center gap-1.5 rounded-lg border border-background-300 bg-background-100 px-3 py-2 text-[11px] text-foreground-800">
              <i className="ri-error-warning-line text-primary-700" />
              {pdfError}
            </p>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-10 text-xs text-foreground-500">
              <i className="ri-loader-4-line mr-2 animate-spin text-base" />
              Siparişleriniz getiriliyor...
            </div>
          ) : error ? (
            <div className="flex flex-col items-start gap-2 rounded-xl border border-background-300 bg-background-100 px-3 py-4">
              <p className="flex items-center gap-1.5 text-xs text-foreground-800">
                <i className="ri-error-warning-line text-primary-700" />
                {error}
              </p>
              <button
                type="button"
                onClick={() => void load()}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-2.5 text-[11px] font-semibold text-foreground-800 hover:bg-background-200"
              >
                <i className="ri-refresh-line" /> Tekrar Dene
              </button>
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-background-300 px-3 py-8 text-center">
              <p className="text-xs font-semibold text-foreground-800">Henüz siparişiniz yok</p>
              <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-foreground-500">
                Siparişiniz tamamlandığında ödeme kaydı, e-faturanız ve kargo takip bilgisi burada birlikte görünür.
              </p>
              <Link
                to="/kategoriler"
                className="mt-3 inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-100 px-3 text-[11px] font-semibold text-foreground-800 hover:bg-background-200"
              >
                <i className="ri-store-3-line" /> Alışverişe başla
              </Link>
            </div>
          ) : visibleRows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-background-300 px-3 py-8 text-center">
              <p className="text-xs font-semibold text-foreground-800">Bu durumda sipariş yok</p>
              <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-foreground-500">
                Başka bir sekmeye geçerek diğer siparişlerinizi görebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-3 inline-flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-100 px-3 text-[11px] font-semibold text-foreground-800 hover:bg-background-200"
              >
                <i className="ri-list-check" /> Tümünü göster
              </button>
            </div>
          ) : (
            <div className="divide-y divide-background-200 overflow-hidden rounded-xl border border-background-200">
              {visibleRows.map(({ invoice, payment, shipment }) => {
                const company = shipment ? companies.find((item) => item.id === shipment.companyId) : undefined;
                const payMeta = payment
                  ? paymentMeta[payment.status] ?? paymentMeta.success
                  : invoice.status === "paid"
                    ? { label: "Ödendi", className: "bg-accent-100 text-accent-900", icon: "ri-checkbox-circle-line" }
                    : { label: "Bekliyor", className: "bg-secondary-100 text-secondary-900", icon: "ri-time-line" };
                const orderLabel = invoice.order_no
                  ? `#${invoice.order_no.replace(/^#/, "").toUpperCase()}`
                  : invoice.invoice_no;

                return (
                  <div
                    key={invoice.id}
                    className="flex flex-col gap-2 bg-background-50 px-3 py-3 sm:flex-row sm:items-center"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-100 text-[9px] font-bold text-primary-900">
                      {company?.short ?? "TM"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground-950">{orderLabel}</span>
                        <span
                          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${payMeta.className}`}
                        >
                          <i className={payMeta.icon} />
                          {payMeta.label}
                        </span>
                        {shipment && (
                          <Pill tone={statusMeta[shipment.status].tone}>
                            <i className={statusMeta[shipment.status].icon} />
                            {statusMeta[shipment.status].label}
                          </Pill>
                        )}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] text-foreground-600">
                        <span className="flex items-center gap-1">
                          <i className="ri-file-text-line" />
                          {invoice.invoice_no}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-calendar-line" />
                          {formatDate(invoice.issued_at)}
                        </span>
                        {payment && (
                          <span className="flex items-center gap-1">
                            <i className="ri-bank-card-line" />
                            {payment.installment === 1 ? "Tek çekim" : `${payment.installment} taksit`} ·{" "}
                            {payment.cardMask}
                          </span>
                        )}
                        {shipment ? (
                          <span className="flex items-center gap-1">
                            <i className="ri-truck-line" />
                            {shipment.tracking} · {shipment.city} · {shipment.eta}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <i className="ri-time-line" />
                            Kargo kaydı hazırlanıyor
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-foreground-400">Tutar</p>
                        <p className="text-[11px] font-semibold text-foreground-950">
                          {formatMoney(Number(invoice.amount))}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={pdfBusyId === invoice.id}
                        onClick={() => void downloadInvoice(invoice)}
                        title="Fatura PDF indir"
                        className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-background-300 bg-background-100 px-2.5 text-[11px] font-semibold text-foreground-800 hover:border-primary-300 hover:text-primary-800 disabled:cursor-wait disabled:opacity-60"
                      >
                        <i className={pdfBusyId === invoice.id ? "ri-loader-4-line animate-spin" : "ri-file-pdf-2-line"} />
                        PDF
                      </button>
                      {shipment && (
                        <button
                          type="button"
                          onClick={() => onSelect(shipment.tracking)}
                          className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-background-300 bg-background-100 px-2.5 text-[11px] font-semibold text-foreground-800 hover:border-primary-300 hover:text-primary-800"
                        >
                          <i className="ri-truck-line" />
                          Takip Et
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}