import { Panel } from "@/components/base/AdminUI";
import { currencyShort } from "@/lib/bankAccounts";
import type { BankAccountsSettings } from "@/types/bankAccount";

export default function BankPreview({ draft }: { draft: BankAccountsSettings }) {
  const visible = draft.accounts.filter((account) => account.active);

  return (
    <Panel title="Canlı Önizleme" subtitle="Sitede görünecek hesap kartları" icon="ri-eye-line">
      <div className="rounded-lg border border-background-200 bg-background-100 p-3.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
          <i className="ri-bank-card-line" />
          Havale / EFT
        </p>
        <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-foreground-600">{draft.intro}</p>

        <div className="mt-3 space-y-2">
          {visible.length === 0 && (
            <p className="rounded-lg border border-dashed border-background-300 bg-background-50 px-3 py-4 text-center text-[11px] text-foreground-500">
              Görünen hesap yok. En az bir hesabı açık duruma getirin.
            </p>
          )}
          {visible.map((account) => (
            <div key={account.id} className="rounded-lg border border-background-200 bg-background-50 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="min-w-0 flex-1 truncate text-[11px] font-bold text-foreground-950">
                  {account.bankName || "Banka adı"}
                </p>
                <span className="shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-[9px] font-bold text-primary-800">
                  {currencyShort(account.currency)}
                </span>
              </div>
              <p className="mt-1 truncate font-mono text-[10px] text-foreground-600">{account.iban || "TR00 ..."}</p>
            </div>
          ))}
        </div>
      </div>

      {draft.notice && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2.5 text-[11px] leading-relaxed text-secondary-950">
          <i className="ri-error-warning-line mt-0.5" />
          <span className="line-clamp-4">{draft.notice}</span>
        </div>
      )}

      <div className="mt-3 space-y-1.5 text-[11px] text-foreground-600">
        {draft.supportPhone && (
          <p className="flex items-center gap-1.5">
            <i className="ri-phone-line" />
            {draft.supportPhone}
          </p>
        )}
        {draft.supportEmail && (
          <p className="flex items-center gap-1.5">
            <i className="ri-mail-line" />
            {draft.supportEmail}
          </p>
        )}
      </div>

      {!draft.enabled && (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2 text-[11px] leading-relaxed text-secondary-950">
          <i className="ri-eye-off-line mt-0.5" />
          Havale ile ödeme kapalı. Sayfa açılır ama ödeme yöntemi kullanılamıyor uyarısı gösterilir.
        </p>
      )}
    </Panel>
  );
}