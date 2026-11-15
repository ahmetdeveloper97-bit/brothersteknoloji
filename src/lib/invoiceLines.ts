import type { InvoiceRow } from "@/types/account";

export interface InvoiceLine {
  name: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Returns the invoice line items. Invoices created before line items existed
 * fall back to a single summary row so the document stays usable.
 */
export const invoiceLines = (invoice: InvoiceRow): InvoiceLine[] => {
  const items = Array.isArray(invoice.items) ? invoice.items : [];
  const lines = items
    .map((item) => {
      const name = (item?.name ?? "").trim();
      const quantity = Number(item?.quantity ?? 0);
      const unitPrice = Number(item?.unit_price ?? 0);
      if (!name || !Number.isFinite(quantity) || quantity <= 0) return null;
      return {
        name,
        brand: (item?.brand ?? "").trim(),
        quantity,
        unitPrice: round2(unitPrice),
        total: round2(unitPrice * quantity),
      };
    })
    .filter((line): line is InvoiceLine => line !== null);

  if (lines.length > 0) return lines;

  const amount = Number(invoice.amount ?? 0);
  const vat = Number(invoice.vat ?? 0);
  const net = Math.max(0, round2(amount - vat));
  return [
    {
      name: `Sipariş ${invoice.order_no ?? invoice.invoice_no} ürün bedeli`,
      brand: "",
      quantity: 1,
      unitPrice: net,
      total: net,
    },
  ];
};

export const invoiceItemCount = (invoice: InvoiceRow): number =>
  invoiceLines(invoice).reduce((sum, line) => sum + line.quantity, 0);