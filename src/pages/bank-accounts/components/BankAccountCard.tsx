import { useState } from "react";
import { currencyShort, formatIban, plainIban } from "@/lib/bankAccounts";
import type { BankAccount } from "@/types/bankAccount";

const copyText = async (value: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* panoya erişilemedi, yedek yol denenecek */
  }
  try {
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const done = document.execCommand("copy");
    document.body.removeChild(area);
    return done;
  } catch {
    return false;
  }
};

interface BankAccountCardProps {
  account: BankAccount;
}

export default function BankAccountCard({ account }: BankAccountCardProps) {
  const [copied, setCopied] = useState<"iban" | "holder" | "">("");

  const handleCopy = async (kind: "iban" | "holder") => {
    const value = kind === "iban" ? plainIban(account.iban) : account.accountName;
    const ok = await copyText(value);
    if (!ok) return;
    setCopied(kind);
    window.setTimeout(() => setCopied(""), 2200);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-background-200 bg-background-50">
      <div className="flex items-center gap-3 border-b border-background-200 bg-background-100 px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <i className="ri-bank-line text-lg" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-heading text-sm font-bold text-foreground-950 md:text-base">
            {account.bankName}
          </h2>
          <p className="mt-0.5 truncate text-[11px] text-foreground-500">
            {account.branchName || "Şube bilgisi belirtilmedi"}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-bold text-primary-800">
          {currencyShort(account.currency)}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">Hesap sahibi</p>
          <div className="mt-1 flex items-start justify-between gap-2">
            <p className="min-w-0 text-sm font-medium leading-relaxed text-foreground-900">{account.accountName}</p>
            <button
              type="button"
              onClick={() => void handleCopy("holder")}
              aria-label="Hesap sahibi adını kopyala"
              className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-medium text-foreground-600 transition-colors hover:bg-background-100 hover:text-foreground-900"
            >
              <i className={copied === "holder" ? "ri-check-line text-accent-700" : "ri-file-copy-line"} />
              {copied === "holder" ? "Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-background-200 bg-background-100 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">IBAN</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="min-w-0 break-all font-mono text-sm font-semibold tracking-tight text-foreground-950 md:text-base">
              {formatIban(account.iban)}
            </p>
            <button
              type="button"
              onClick={() => void handleCopy("iban")}
              aria-label="IBAN numarasını kopyala"
              className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 transition-colors hover:bg-primary-700"
            >
              <i className={copied === "iban" ? "ri-check-line" : "ri-file-copy-line"} />
              {copied === "iban" ? "Kopyalandı" : "IBAN Kopyala"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">Şube kodu</p>
            <p className="mt-0.5 text-sm text-foreground-800">{account.branchCode || "—"}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">Hesap no</p>
            <p className="mt-0.5 text-sm text-foreground-800">{account.accountNumber || "—"}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">Para birimi</p>
            <p className="mt-0.5 text-sm text-foreground-800">{currencyShort(account.currency)}</p>
          </div>
        </div>

        {account.description && (
          <p className="flex items-start gap-1.5 border-t border-background-200 pt-3 text-[11px] leading-relaxed text-foreground-600">
            <i className="ri-information-line mt-0.5 text-base text-foreground-400" />
            <span>{account.description}</span>
          </p>
        )}
      </div>
    </article>
  );
}