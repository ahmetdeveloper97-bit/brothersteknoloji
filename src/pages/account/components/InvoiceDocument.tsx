import { formatDate, formatDateTime, formatMoney } from "@/lib/accountFormat";
import { invoiceLines } from "@/lib/invoiceLines";
import type { InvoiceRow } from "@/types/account";

interface InvoiceDocumentProps {
  invoice: InvoiceRow;
  customerName?: string | null;
  customerEmail?: string | null;
}

const statusLabel = (status: string): string => {
  if (status === "paid") return "Ödendi";
  if (status === "refunded") return "İade Edildi";
  if (status === "pending") return "Bekliyor";
  return status;
};

const statusClass = (status: string): string => {
  if (status === "paid") return "bg-accent-100 text-accent-900";
  if (status === "refunded") return "bg-background-200 text-foreground-700";
  return "bg-secondary-100 text-secondary-900";
};

export default function InvoiceDocument({ invoice, customerName, customerEmail }: InvoiceDocumentProps) {
  const amount = Number(invoice.amount ?? 0);
  const vat = Number(invoice.vat ?? 0);
  const net = Math.max(0, amount - vat);
  const vatRate = net > 0 ? Math.round((vat / net) * 100) : 20;
  const lines = invoiceLines(invoice);
  const hasItems = Array.isArray(invoice.items) && invoice.items.length > 0;
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <article className="invoice-sheet rounded-xl border border-background-200 bg-background-50 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-background-200 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-800 text-background-50">
            <i className="ri-store-2-line text-lg" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-foreground-950">Brothers Teknoloji</p>
            <p className="text-[10px] text-foreground-500">Teknoloji mağazası · brothersteknoloji.com</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-400">E-Fatura</p>
          <p className="mt-1 font-heading text-sm font-bold text-foreground-950">{invoice.invoice_no}</p>
          <p className="text-[11px] text-foreground-500">{formatDate(invoice.issued_at)}</p>
          <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(invoice.status)}`}>
            {statusLabel(invoice.status)}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 border-b border-background-200 py-4 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Fatura Edilen</p>
          <p className="mt-1 text-xs font-semibold text-foreground-950">
            {invoice.billing_name || customerName || "—"}
          </p>
          {invoice.billing_tax_number && (
            <p className="mt-0.5 text-[11px] text-foreground-600">VKN / TCKN: {invoice.billing_tax_number}</p>
          )}
          {customerEmail && <p className="mt-0.5 break-all text-[11px] text-foreground-600">{customerEmail}</p>}
        </div>
        <div className="min-w-0 sm:text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Sipariş Bilgisi</p>
          <p className="mt-1 text-[11px] text-foreground-600">
            Sipariş no:{" "}
            <span className="font-semibold text-foreground-950">{invoice.order_no ?? "—"}</span>
          </p>
          <p className="mt-0.5 text-[11px] text-foreground-600">Düzenleme: {formatDateTime(invoice.issued_at)}</p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-background-200">
        <table className="w-full border-collapse text-[11px]">
          <thead className="bg-background-100 text-foreground-500">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Ürün / Açıklama</th>
              <th className="w-12 px-2 py-2 text-center font-semibold">Adet</th>
              <th className="w-24 px-3 py-2 text-right font-semibold">Birim Fiyat</th>
              <th className="w-24 px-3 py-2 text-right font-semibold">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={`${line.name}-${index}`} className="border-t border-background-200">
                <td className="px-3 py-2.5 text-foreground-900">
                  <span className="block font-medium">{line.name}</span>
                  {line.brand && <span className="mt-0.5 block text-[10px] text-foreground-500">{line.brand}</span>}
                </td>
                <td className="px-2 py-2.5 text-center text-foreground-700">{line.quantity}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right text-foreground-700">
                  {formatMoney(line.unitPrice)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold text-foreground-950">
                  {formatMoney(line.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-background-300 bg-background-100/70">
              <td className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-600">
                Toplam {lines.length} kalem · {totalQuantity} adet
              </td>
              <td className="px-2 py-2 text-center text-[10px] font-semibold text-foreground-700">{totalQuantity}</td>
              <td className="px-3 py-2" />
              <td className="whitespace-nowrap px-3 py-2 text-right text-xs font-bold text-foreground-950">
                {formatMoney(hasItems ? lines.reduce((sum, line) => sum + line.total, 0) : net)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {hasItems && (
        <p className="mt-1.5 text-[10px] text-foreground-500">Birim fiyatlar KDV dahildir.</p>
      )}

      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end">
        <dl className="w-full space-y-1.5 rounded-lg bg-background-100 p-3 text-[11px] sm:w-64">
          <div className="flex items-center justify-between">
            <dt className="text-foreground-600">Ara toplam (KDV hariç)</dt>
            <dd className="font-medium text-foreground-900">{formatMoney(net)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-foreground-600">KDV (%{vatRate})</dt>
            <dd className="font-medium text-foreground-900">{formatMoney(vat)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-background-300 pt-1.5">
            <dt className="text-xs font-bold text-foreground-950">Genel toplam</dt>
            <dd className="text-xs font-bold text-foreground-950">{formatMoney(amount)}</dd>
          </div>
        </dl>
      </div>

      <footer className="mt-5 border-t border-background-200 pt-3 text-[10px] leading-relaxed text-foreground-500">
        <p className="font-semibold text-foreground-700">Brothers Teknoloji A.Ş.</p>
        <p>İkitelli OSB, Başakşehir / İstanbul · 0850 222 00 11 · destek@brothersteknoloji.com</p>
        <p className="mt-1">
          Bu belge bilgilendirme amaçlı e-fatura örneğidir. Resmî e-Arşiv faturanız kayıtlı e-posta adresinize
          iletilir.
        </p>
      </footer>
    </article>
  );
}