export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
  branchName: string;
  branchCode: string;
  accountNumber: string;
  currency: string;
  description: string;
  active: boolean;
}

export interface BankAccountsSettings {
  enabled: boolean;
  intro: string;
  notice: string;
  supportPhone: string;
  supportEmail: string;
  accounts: BankAccount[];
}

export interface BankAccountsSaveResult {
  ok: boolean;
  code?: string;
  message?: string;
}

export const BANK_CURRENCIES: Array<{ id: string; label: string; short: string }> = [
  { id: "TRY", label: "Türk Lirası (TL)", short: "TL" },
  { id: "USD", label: "Amerikan Doları (USD)", short: "USD" },
  { id: "EUR", label: "Euro (EUR)", short: "EUR" },
  { id: "GBP", label: "İngiliz Sterlini (GBP)", short: "GBP" },
];