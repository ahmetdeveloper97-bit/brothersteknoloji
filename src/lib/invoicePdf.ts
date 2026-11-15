import { formatDate, formatDateTime, formatMoney } from "@/lib/accountFormat";
import { invoiceLines } from "@/lib/invoiceLines";
import type { InvoiceRow } from "@/types/account";

interface InvoicePdfOptions {
  customerName?: string | null;
  customerEmail?: string | null;
}

const A4_WIDTH_PX = 794;

const escapeHtml = (value?: string | null): string =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });

const statusLabel = (status: string): string => {
  if (status === "paid") return "Ödendi";
  if (status === "refunded") return "İade Edildi";
  if (status === "pending") return "Bekliyor";
  return status;
};

/**
 * Builds a paper-like invoice sheet with explicit hex colors only, so the
 * canvas renderer never has to deal with theme (oklch) color functions.
 */
const buildInvoiceSheet = (invoice: InvoiceRow, options: InvoicePdfOptions): string => {
  const amount = Number(invoice.amount ?? 0);
  const vat = Number(invoice.vat ?? 0);
  const net = Math.max(0, amount - vat);
  const vatRate = net > 0 ? Math.round((vat / net) * 100) : 20;
  const lines = invoiceLines(invoice);
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const itemsTotal = lines.reduce((sum, line) => sum + line.total, 0);

  const rows = lines
    .map(
      (line) => `
      <tr>
        <td style="padding:9px 10px;border-bottom:1px solid #e8ecf1;color:#0f172a;font-size:11px;line-height:1.45;">
          <span style="display:block;font-weight:600;">${escapeHtml(line.name)}</span>
          ${line.brand ? `<span style="display:block;color:#7b8794;font-size:9px;margin-top:2px;">${escapeHtml(line.brand)}</span>` : ""}
        </td>
        <td style="padding:9px 8px;border-bottom:1px solid #e8ecf1;text-align:center;color:#475569;font-size:11px;">${line.quantity}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e8ecf1;text-align:right;color:#475569;font-size:11px;white-space:nowrap;">${formatMoney(line.unitPrice)}</td>
        <td style="padding:9px 10px;border-bottom:1px solid #e8ecf1;text-align:right;color:#0f172a;font-size:11px;font-weight:600;white-space:nowrap;">${formatMoney(line.total)}</td>
      </tr>`,
    )
    .join("");

  return `
  <div style="width:${A4_WIDTH_PX}px;box-sizing:border-box;background:#ffffff;padding:44px 44px 36px;font-family:'Inter','Segoe UI',Arial,sans-serif;color:#0f172a;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;">
          <table style="border-collapse:collapse;">
            <tr>
              <td style="width:38px;vertical-align:middle;">
                <div style="width:34px;height:34px;border-radius:8px;background:#123a4f;color:#ffffff;text-align:center;line-height:34px;font-weight:700;font-size:14px;">TM</div>
              </td>
              <td style="padding-left:10px;vertical-align:middle;">
                <div style="font-size:14px;font-weight:700;color:#0f172a;letter-spacing:-0.2px;">Brothers Teknoloji</div>
                <div style="font-size:9px;color:#64748b;margin-top:2px;">Teknoloji mağazası · brothersteknoloji.com</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <div style="font-size:9px;font-weight:700;letter-spacing:2px;color:#94a3b8;">E-FATURA</div>
          <div style="font-size:14px;font-weight:700;color:#0f172a;margin-top:4px;">${escapeHtml(invoice.invoice_no)}</div>
          <div style="font-size:10px;color:#64748b;margin-top:2px;">${formatDate(invoice.issued_at)}</div>
          <div style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:999px;background:#e7f6ee;color:#166534;font-size:9px;font-weight:700;">${escapeHtml(statusLabel(invoice.status))}</div>
        </td>
      </tr>
    </table>

    <div style="height:2px;background:#123a4f;margin:16px 0 0;"></div>

    <table style="width:100%;border-collapse:collapse;margin-top:14px;">
      <tr>
        <td style="width:55%;vertical-align:top;padding-right:16px;">
          <div style="font-size:9px;font-weight:700;letter-spacing:1px;color:#94a3b8;">FATURA EDİLEN</div>
          <div style="font-size:11px;font-weight:600;color:#0f172a;margin-top:4px;">${escapeHtml(invoice.billing_name || options.customerName || "—")}</div>
          ${invoice.billing_tax_number ? `<div style="font-size:10px;color:#475569;margin-top:2px;">VKN / TCKN: ${escapeHtml(invoice.billing_tax_number)}</div>` : ""}
          ${options.customerEmail ? `<div style="font-size:10px;color:#475569;margin-top:2px;">${escapeHtml(options.customerEmail)}</div>` : ""}
        </td>
        <td style="vertical-align:top;text-align:right;">
          <div style="font-size:9px;font-weight:700;letter-spacing:1px;color:#94a3b8;">SİPARİŞ BİLGİSİ</div>
          <div style="font-size:10px;color:#475569;margin-top:4px;">Sipariş no: <span style="font-weight:600;color:#0f172a;">${escapeHtml(invoice.order_no ?? "—")}</span></div>
          <div style="font-size:10px;color:#475569;margin-top:2px;">Düzenleme: ${formatDateTime(invoice.issued_at)}</div>
        </td>
      </tr>
    </table>

    <table style="width:100%;border-collapse:collapse;margin-top:16px;border:1px solid #e8ecf1;">
      <thead>
        <tr style="background:#f4f7fa;">
          <th style="padding:8px 10px;text-align:left;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;">Ürün / Açıklama</th>
          <th style="padding:8px;text-align:center;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;width:42px;">Adet</th>
          <th style="padding:8px 10px;text-align:right;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;width:86px;">Birim Fiyat</th>
          <th style="padding:8px 10px;text-align:right;font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.6px;width:86px;">Tutar</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr style="background:#f4f7fa;">
          <td style="padding:8px 10px;font-size:9px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.6px;">Toplam ${lines.length} kalem · ${totalQuantity} adet</td>
          <td style="padding:8px;text-align:center;font-size:10px;font-weight:700;color:#334155;">${totalQuantity}</td>
          <td style="padding:8px 10px;"></td>
          <td style="padding:8px 10px;text-align:right;font-size:11px;font-weight:700;color:#0f172a;white-space:nowrap;">${formatMoney(itemsTotal)}</td>
        </tr>
      </tfoot>
    </table>
    <div style="font-size:9px;color:#94a3b8;margin-top:5px;">Birim fiyatlar KDV dahildir.</div>

    <table style="width:100%;border-collapse:collapse;margin-top:14px;">
      <tr>
        <td style="width:55%;vertical-align:top;"></td>
        <td style="vertical-align:top;">
          <table style="width:100%;border-collapse:collapse;background:#f4f7fa;border-radius:6px;">
            <tr>
              <td style="padding:6px 10px;font-size:10px;color:#475569;">Ara toplam (KDV hariç)</td>
              <td style="padding:6px 10px;text-align:right;font-size:10px;color:#334155;font-weight:600;">${formatMoney(net)}</td>
            </tr>
            <tr>
              <td style="padding:4px 10px;font-size:10px;color:#475569;">KDV (%${vatRate})</td>
              <td style="padding:4px 10px;text-align:right;font-size:10px;color:#334155;font-weight:600;">${formatMoney(vat)}</td>
            </tr>
            <tr>
              <td style="padding:8px 10px;border-top:1px solid #dbe3ea;font-size:11px;font-weight:700;color:#0f172a;">Genel toplam</td>
              <td style="padding:8px 10px;border-top:1px solid #dbe3ea;text-align:right;font-size:12px;font-weight:700;color:#0f172a;white-space:nowrap;">${formatMoney(amount)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin-top:22px;border-top:1px solid #e8ecf1;padding-top:10px;font-size:9px;line-height:1.6;color:#64748b;">
      <div style="font-weight:700;color:#334155;">Brothers Teknoloji A.Ş.</div>
      <div>İkitelli OSB, Başakşehir / İstanbul · 0850 222 00 11 · destek@brothersteknoloji.com</div>
      <div style="margin-top:4px;">Bu belge bilgilendirme amaçlı e-fatura örneğidir. Resmî e-Arşiv faturanız kayıtlı e-posta adresinize iletilir.</div>
    </div>
  </div>`;
};

/**
 * Creates a real PDF file from the invoice data and triggers a download.
 * Falls back to a thrown error so the caller can inform the customer.
 */
export const downloadInvoicePdf = async (
  invoice: InvoiceRow,
  options: InvoicePdfOptions = {},
): Promise<void> => {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  const holder = document.createElement("div");
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText = `position:absolute;left:-9999px;top:0;width:${A4_WIDTH_PX}px;background:#ffffff;pointer-events:none;`;
  holder.innerHTML = buildInvoiceSheet(invoice, options);
  document.body.appendChild(holder);

  try {
    const canvas = await html2canvas(holder, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
    });

    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;
    const ratio = contentWidth / canvas.width;

    if (canvas.height * ratio <= contentHeight) {
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.96), "JPEG", margin, margin, contentWidth, canvas.height * ratio);
    } else {
      const sliceHeight = Math.floor(contentHeight / ratio);
      let offset = 0;
      let page = 0;
      while (offset < canvas.height && page < 6) {
        const height = Math.min(sliceHeight, canvas.height - offset);
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = height;
        const context = slice.getContext("2d");
        if (context) {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, slice.width, height);
          context.drawImage(canvas, 0, offset, canvas.width, height, 0, 0, canvas.width, height);
        }
        if (page > 0) pdf.addPage();
        pdf.addImage(slice.toDataURL("image/jpeg", 0.96), "JPEG", margin, margin, contentWidth, height * ratio);
        offset += height;
        page += 1;
      }
    }

    pdf.save(`${invoice.invoice_no || "fatura"}.pdf`);
  } finally {
    holder.remove();
  }
};