import { readAdminToken } from "@/lib/adminStaffStore";
import { defaultBankAccounts } from "@/mocks/bankAccounts";
import { readJson, writeJson } from "@/lib/persistent";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { BankAccount, BankAccountsSaveResult, BankAccountsSettings } from "@/types/bankAccount";

const CACHE_KEY = "eticaretv8_bank_accounts_cache";
export const BANK_ACCOUNTS_EVENT = "eticaretv8:bank-accounts-updated";
const SETTINGS_ID = "bank_accounts";

/** IBAN'ı 4'lü gruplar hâlinde okunaklı yazar. */
export const formatIban = (value: string): string => {
  const clean = String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return clean.replace(/(.{4})/g, "$1 ").trim();
};

/** Kopyalama için boşluksuz IBAN üretir. */
export const plainIban = (value: string): string =>
  String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

export const currencyShort = (value: string): string => {
  if (value === "TRY") return "TL";
  return value || "TL";
};

const cloneAccount = (raw?: Partial<BankAccount> | null): BankAccount => ({
  id: String(raw?.id ?? ""),
  bankName: String(raw?.bankName ?? ""),
  accountName: String(raw?.accountName ?? ""),
  iban: formatIban(String(raw?.iban ?? "")),
  branchName: String(raw?.branchName ?? ""),
  branchCode: String(raw?.branchCode ?? ""),
  accountNumber: String(raw?.accountNumber ?? ""),
  currency: String(raw?.currency ?? "TRY"),
  description: String(raw?.description ?? ""),
  active: raw?.active === undefined ? true : Boolean(raw?.active),
});

export const normalizeBankAccounts = (
  raw?: Partial<BankAccountsSettings> | null,
): BankAccountsSettings => {
  const base = defaultBankAccounts;
  const source = raw ?? {};
  return {
    enabled: source.enabled === undefined ? base.enabled : Boolean(source.enabled),
    intro: String(source.intro ?? base.intro),
    notice: String(source.notice ?? base.notice),
    supportPhone: String(source.supportPhone ?? base.supportPhone),
    supportEmail: String(source.supportEmail ?? base.supportEmail),
    accounts: Array.isArray(source.accounts) ? source.accounts.map(cloneAccount) : base.accounts.map(cloneAccount),
  };
};

let cache: BankAccountsSettings = normalizeBankAccounts(
  readJson<Partial<BankAccountsSettings> | null>(CACHE_KEY, null),
);
let inFlight: Promise<BankAccountsSettings> | null = null;

export const getBankAccounts = (): BankAccountsSettings => cache;

const applySettings = (value: BankAccountsSettings): BankAccountsSettings => {
  cache = value;
  writeJson(CACHE_KEY, value);
  try {
    window.dispatchEvent(new Event(BANK_ACCOUNTS_EVENT));
  } catch {
    /* event desteklenmiyorsa geç */
  }
  return value;
};

/** Banka bilgilerini sunucudan okur. Hata olursa son bilinen değer korunur. */
export const fetchBankAccounts = async (): Promise<BankAccountsSettings> => {
  if (!isSupabaseConfigured) return cache;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const { data, error } = await supabase.functions.invoke("site-settings", {
        body: { action: "read", id: SETTINGS_ID },
      });
      if (error) return cache;
      const payload = data as { ok?: boolean; settings?: Partial<BankAccountsSettings> | null } | null;
      if (!payload?.ok || !payload.settings) return cache;
      return applySettings(normalizeBankAccounts(payload.settings));
    } catch {
      return cache;
    }
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
};

/** Banka bilgilerini sunucuya yazar. Yönetici oturumu ile doğrulanır. */
export const saveBankAccounts = async (
  value: BankAccountsSettings,
): Promise<BankAccountsSaveResult> => {
  const normalized = normalizeBankAccounts(value);
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }

  const token = readAdminToken();
  if (!token) {
    return {
      ok: false,
      code: "unauthorized",
      message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapıp tekrar deneyin.",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("site-settings", {
      body: { action: "save", id: SETTINGS_ID, token, settings: normalized },
    });

    if (error) {
      let code = "network";
      let message = "Banka bilgileri kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.";
      try {
        const context = (error as unknown as { context?: { json?: () => Promise<unknown> } }).context;
        if (context && typeof context.json === "function") {
          const parsed = (await context.json()) as { code?: string; message?: string } | null;
          if (parsed?.code) code = String(parsed.code);
          if (parsed?.message) message = String(parsed.message);
        }
      } catch {
        /* gövde okunamadı */
      }
      return { ok: false, code, message };
    }

    const payload = data as { ok?: boolean; code?: string; message?: string } | null;
    if (!payload?.ok) {
      return {
        ok: false,
        code: String(payload?.code ?? "error"),
        message: String(payload?.message ?? "Banka bilgileri kaydedilemedi."),
      };
    }

    applySettings(normalized);
    return { ok: true };
  } catch {
    return {
      ok: false,
      code: "network",
      message: "Banka bilgileri kaydedilemedi. Bağlantınızı kontrol edip tekrar deneyin.",
    };
  }
};

export const subscribeBankAccounts = (listener: () => void): (() => void) => {
  window.addEventListener(BANK_ACCOUNTS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(BANK_ACCOUNTS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
};