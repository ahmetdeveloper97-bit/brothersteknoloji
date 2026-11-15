import { Field, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { BANK_CURRENCIES, type BankAccount } from "@/types/bankAccount";
import { formatIban } from "@/lib/bankAccounts";

interface AccountEditorCardProps {
  account: BankAccount;
  index: number;
  total: number;
  onChange: (changes: Partial<BankAccount>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}

export default function AccountEditorCard({
  account,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: AccountEditorCardProps) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-100 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
          <i className="ri-bank-line text-base" />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground-950">
          {account.bankName || "Yeni hesap"}
        </p>
        <Pill tone={account.active ? "success" : "neutral"}>
          {account.active ? "Sitede görünür" : "Gizli"}
        </Pill>
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          aria-label="Hesabı yukarı taşı"
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-background-300 ${
            index === 0 ? "cursor-not-allowed text-foreground-300" : "cursor-pointer text-foreground-600 hover:bg-background-200"
          }`}
        >
          <i className="ri-arrow-up-line" />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          aria-label="Hesabı aşağı taşı"
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-background-300 ${
            index === total - 1
              ? "cursor-not-allowed text-foreground-300"
              : "cursor-pointer text-foreground-600 hover:bg-background-200"
          }`}
        >
          <i className="ri-arrow-down-line" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Hesabı sil"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
        >
          <i className="ri-delete-bin-line" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Banka adı">
          <input
            value={account.bankName}
            onChange={(event) => onChange({ bankName: event.target.value })}
            className={inputClass}
            placeholder="Ziraat Bankası"
          />
        </Field>
        <Field label="Hesap sahibi">
          <input
            value={account.accountName}
            onChange={(event) => onChange({ accountName: event.target.value })}
            className={inputClass}
            placeholder="Firma unvanı"
          />
        </Field>
        <Field label="IBAN" hint="Boşluklar otomatik olarak 4'lü gruplara ayrılır.">
          <input
            value={account.iban}
            onChange={(event) => onChange({ iban: formatIban(event.target.value) })}
            className={`${inputClass} font-mono tracking-tight`}
            placeholder="TR00 0000 0000 0000 0000 0000 00"
            maxLength={34}
          />
        </Field>
        <Field label="Para birimi">
          <select
            value={account.currency}
            onChange={(event) => onChange({ currency: event.target.value })}
            className={inputClass}
          >
            {BANK_CURRENCIES.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Şube">
          <input
            value={account.branchName}
            onChange={(event) => onChange({ branchName: event.target.value })}
            className={inputClass}
            placeholder="Kadıköy / İstanbul"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Şube kodu">
            <input
              value={account.branchCode}
              onChange={(event) => onChange({ branchCode: event.target.value })}
              className={inputClass}
              placeholder="0123"
            />
          </Field>
          <Field label="Hesap no">
            <input
              value={account.accountNumber}
              onChange={(event) => onChange({ accountNumber: event.target.value })}
              className={inputClass}
              placeholder="12345678-5001"
            />
          </Field>
        </div>
      </div>

      <div className="mt-3">
        <Field label="Hesap notu" hint="Kart üzerinde IBAN'ın altında görünen kısa açıklama.">
          <textarea
            value={account.description}
            onChange={(event) => onChange({ description: event.target.value })}
            rows={2}
            maxLength={180}
            className={textareaClass}
            placeholder="Tüm siparişlerde kullanılabilir."
          />
        </Field>
      </div>

      <div className="mt-3">
        <Toggle
          checked={account.active}
          onChange={(value) => onChange({ active: value })}
          label="Bu hesabı sitede göster"
          description="Kapalıysa hesap kaydedilir ama ziyaretçiye görünmez."
        />
      </div>
    </div>
  );
}