import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { AccountButton, AccountCard, InlineAlert } from "@/components/base/AccountUI";
import { useAuth } from "@/context/AuthContext";
import { formatDate, formatDateTime, formatMoney } from "@/lib/accountFormat";
import { downloadInvoicePdf } from "@/lib/invoicePdf";
import { supabase } from "@/lib/supabase";
import InvoiceDocument from "@/pages/account/components/InvoiceDocument";
import type { InvoiceRow } from "@/types/account";

const statusLabels: Record<string, { label: string; className: string }> = {
  paid: { label: "Ödendi", className: "bg-accent-100 text-accent-800" },
  pending: { label: "Bekliyor", className: "bg-secondary-100 text-secondary-900" },
  refunded: { label: "İade edildi", className: "bg-background-200 text-foreground-700" },
};

export default function InvoicesTab({ onGoBilling }: { onGoBilling: () => void }) {
  const { user, profile } = useAuth();
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<InvoiceRow | null>(null);
  const [pdfBusyId, setPdfBusyId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState("");

  const download = useCallback(
    async (row: InvoiceRow) => {
      setPdfError("");
      setPdfBusyId(row.id);
      try {
        await downloadInvoicePdf(row, {
          customerName: row.billing_name || profile?.full_name,
          customerEmail: user?.email,
        });
      } catch {
        setPdfError("PDF oluşturulamadı. Lütfen tekrar deneyin.");
      } finally {
        setPdfBusyId(null);
      }
    },
    [profile?.full_name, user?.email],
  );

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const { data, error: queryError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });
      if (queryError) throw queryError;
      setRows((data ?? []) as InvoiceRow[]);
    } catch {
      setError("Faturalar yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = useMemo(() => {
    const gross = rows.reduce((sum, row) => sum + Number(row.amount ?? 0), 0);
    const vat = rows.reduce((sum, row) => sum + Number(row.vat ?? 0), 0);
    return { gross, vat };
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Toplam fatura", value: String(rows.length), icon: "ri-file-list-3-line" },
          { label: "Toplam tutar", value: formatMoney(totals.gross), icon: "ri-wallet-3-line" },
          { label: "KDV toplamı", value: formatMoney(totals.vat), icon: "ri-percent-line" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-background-200 bg-background-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">{item.label}</p>
              <i className={`${item.icon} text-base text-primary-700`} />
            </div>
            <p className="mt-2 font-heading text-lg font-bold text-foreground-950">{item.value}</p>
          </div>
        ))}
      </div>

      <AccountCard
        title="Faturalarım"
        subtitle="Siparişlerinize ait e-faturaları görüntüleyin."
        icon="ri-file-text-line"
        action={
          <AccountButton variant="ghost" onClick={() => void load()} icon="ri-refresh-line">
            Yenile
          </AccountButton>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-foreground-500">
            <i className="ri-loader-4-line mr-2 animate-spin text-lg" />
            Faturalar yükleniyor...
          </div>
        ) : error ? (
          <div className="space-y-3">
            <InlineAlert tone="error">{error}</InlineAlert>
            <AccountButton variant="ghost" onClick={() => void load()} icon="ri-refresh-line">
              Tekrar Dene
            </AccountButton>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-background-300 bg-background-100/60 px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-200 text-foreground-600">
              <i className="ri-file-list-3-line text-2xl" />
            </span>
            <h3 className="mt-3 font-heading text-sm font-bold text-foreground-950">Henüz faturanız yok</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-foreground-500">
              Siparişiniz tamamlandığında e-faturanız otomatik olarak burada listelenir. Fatura bilgilerinizi şimdiden
              kaydedebilirsiniz.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <AccountButton onClick={onGoBilling} icon="ri-receipt-line">
                Fatura Bilgilerim
              </AccountButton>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-background-200 text-left text-[11px] uppercase tracking-wide text-foreground-500">
                  <th className="py-2.5 pr-3 font-semibold">Fatura No</th>
                  <th className="py-2.5 pr-3 font-semibold">Tarih</th>
                  <th className="py-2.5 pr-3 font-semibold">Sipariş</th>
                  <th className="py-2.5 pr-3 text-right font-semibold">Tutar</th>
                  <th className="py-2.5 pr-3 font-semibold">Durum</th>
                  <th className="py-2.5 text-right font-semibold"> </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const status = statusLabels[row.status] ?? statusLabels.pending;
                  return (
                    <tr key={row.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                      <td className="py-3 pr-3 font-semibold text-foreground-900">{row.invoice_no}</td>
                      <td className="py-3 pr-3 text-xs text-foreground-600">{formatDate(row.issued_at)}</td>
                      <td className="py-3 pr-3 text-xs text-foreground-600">{row.order_no ?? "—"}</td>
                      <td className="py-3 pr-3 text-right font-semibold text-foreground-900">{formatMoney(Number(row.amount))}</td>
                      <td className="py-3 pr-3">
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelected(row)}
                            className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold text-primary-700 hover:bg-primary-50"
                          >
                            <i className="ri-eye-line" /> Görüntüle
                          </button>
                          <button
                            type="button"
                            disabled={pdfBusyId === row.id}
                            onClick={() => void download(row)}
                            title="PDF indir"
                            aria-label="PDF indir"
                            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-600 hover:bg-background-200 hover:text-foreground-950 disabled:cursor-wait disabled:opacity-60"
                          >
                            <i className={pdfBusyId === row.id ? "ri-loader-4-line animate-spin" : "ri-download-2-line"} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AccountCard>

      {pdfError && <InlineAlert tone="error">{pdfError}</InlineAlert>}

      <Modal
        open={Boolean(selected)}
        title={selected ? `Fatura ${selected.invoice_no}` : "Fatura"}
        subtitle={selected ? formatDateTime(selected.issued_at) : undefined}
        icon="ri-file-text-line"
        maxWidth="max-w-2xl"
        onClose={() => setSelected(null)}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[11px] text-foreground-500">
              <i className="ri-file-pdf-2-line" />
              Fatura PDF olarak indirilir, yazdırmak için dosyayı açabilirsiniz.
            </p>
            <div className="flex items-center gap-2">
              <AccountButton variant="ghost" onClick={() => setSelected(null)}>
                Kapat
              </AccountButton>
              <AccountButton
                onClick={() => selected && void download(selected)}
                icon={selected && pdfBusyId === selected.id ? "ri-loader-4-line" : "ri-download-2-line"}
              >
                {selected && pdfBusyId === selected.id ? "Hazırlanıyor..." : "PDF İndir"}
              </AccountButton>
            </div>
          </div>
        }
      >
        {selected && (
          <InvoiceDocument
            invoice={selected}
            customerName={selected.billing_name || profile?.full_name}
            customerEmail={user?.email}
          />
        )}
      </Modal>
    </div>
  );
}