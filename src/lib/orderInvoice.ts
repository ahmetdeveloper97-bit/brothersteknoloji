import { supabase } from "@/lib/supabase";
import type { BillingProfileRow, DeliveryDetails, InvoiceItem } from "@/types/account";

const VAT_RATE = 0.2;

export const buildInvoiceNo = (): string => {
  const now = new Date();
  const sequence = `${now.getTime()}`.slice(-6);
  return `TM-${now.getFullYear()}-${sequence}`;
};

export const invoiceAmounts = (gross: number): { amount: number; vat: number } => {
  const amount = Math.round(gross * 100) / 100;
  const vat = Math.round((amount - amount / (1 + VAT_RATE)) * 100) / 100;
  return { amount, vat };
};

export interface InvoiceInput {
  userId: string;
  orderNo: string;
  amount: number;
  billing: BillingProfileRow | null;
  fallbackName: string;
  items: InvoiceItem[];
}

/**
 * Creates the e-invoice record for a completed order.
 * Returns true when the row was stored successfully.
 */
export const createInvoiceForOrder = async (input: InvoiceInput): Promise<boolean> => {
  try {
    const { amount, vat } = invoiceAmounts(input.amount);
    const billingName =
      input.billing?.invoice_type === "corporate" && input.billing?.company_name
        ? input.billing.company_name
        : input.billing?.full_name || input.fallbackName || null;

    const { error } = await supabase.from("invoices").insert({
      user_id: input.userId,
      invoice_no: buildInvoiceNo(),
      order_no: input.orderNo,
      amount,
      vat,
      status: "paid",
      billing_name: billingName,
      billing_tax_number: input.billing?.tax_number?.trim() || null,
      items: input.items ?? [],
    });

    return !error;
  } catch {
    return false;
  }
};

export interface SaveAddressInput {
  userId: string;
  delivery: DeliveryDetails;
  isDefault: boolean;
}

/**
 * Stores the delivery details typed at checkout into the customer's address book.
 */
export const saveCheckoutAddress = async (input: SaveAddressInput): Promise<boolean> => {
  const { delivery } = input;
  if (!delivery.fullName.trim() || !delivery.address.trim() || !delivery.city.trim()) return false;

  try {
    const { error } = await supabase.from("addresses").insert({
      user_id: input.userId,
      title: "Teslimat",
      full_name: delivery.fullName.trim(),
      phone: delivery.phone.trim() || null,
      city: delivery.city.trim(),
      district: delivery.district.trim() || null,
      address_line: delivery.address.trim(),
      is_default: input.isDefault,
    });
    return !error;
  } catch {
    return false;
  }
};