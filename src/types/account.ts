export interface ProfileRow {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  birth_date: string | null;
  newsletter: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AddressRow {
  id: string;
  user_id: string;
  title: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  district: string | null;
  address_line: string | null;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
}

export type InvoiceType = "individual" | "corporate";

export interface BillingProfileRow {
  user_id: string;
  invoice_type: InvoiceType;
  full_name: string | null;
  company_name: string | null;
  tax_office: string | null;
  tax_number: string | null;
  address_line: string | null;
  city: string | null;
  district: string | null;
  phone: string | null;
  email: string | null;
  updated_at: string;
}

export interface InvoiceItem {
  name: string;
  brand?: string | null;
  quantity: number;
  unit_price: number;
}

export interface InvoiceRow {
  id: string;
  user_id: string;
  invoice_no: string;
  order_no: string | null;
  issued_at: string;
  amount: number;
  vat: number;
  status: string;
  billing_name: string | null;
  billing_tax_number: string | null;
  items: InvoiceItem[] | null;
  created_at: string;
}

export interface MfaFactorView {
  id: string;
  friendlyName: string;
  verified: boolean;
  createdAt: string;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}