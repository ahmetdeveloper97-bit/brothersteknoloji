import { useEffect, useMemo, useState } from "react";
import { Banner, Field, Kpi, Panel, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import AccountEditorCard from "@/pages/admin/bank/AccountEditorCard";
import BankPreview from "@/pages/admin/bank/BankPreview";
import {
  fetchBankAccounts,
  getBankAccounts,
  plainIban,
  saveBankAccounts,
} from "@/lib/bankAccounts";
import type { BankAccount, BankAccountsSettings } from "@/types/bankAccount";

const newId = (): string => `bank-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const emptyAccount = (): BankAccount => ({
  id: newId(),
  bankName: "",
  accountName: "",
  iban: "",
  branchName: "",
  branchCode: "",
  accountNumber: "",
  currency: "TRY",
  description: "",
  active: true,
});

export default function BankAccountsPanel() {
  const [saved, setSaved] = useState<BankAccountsSettings>(() => getBankAccounts());
  const [draft, setDraft] = useState<BankAccountsSettings>(saved);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetchBankAccounts().then((next) => {
      if (!active) return;
      setSaved(next);
      setDraft(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const patch = (changes: Partial<BankAccountsSettings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setToast("");
  };

  const patchAccount = (id: string, changes: Partial<BankAccount>) => {
    setDraft((current) => ({
      ...current,
      accounts: current.accounts.map((account) =>
        account.id === id ? { ...account, ...changes } : account,
      ),
    }));
    setToast("");
  };

  const addAccount = () => {
    setDraft((current) => ({ ...current, accounts: [...current.accounts, emptyAccount()] }));
    setToast("");
  };

  const removeAccount = (id: string) => {
    setDraft((current) => ({ ...current, accounts: current.accounts.filter((account) => account.id !== id) }));
    setToast("");
  };

  const moveAccount = (id: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.accounts.findIndex((account) => account.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.accounts.length) return current;
      const accounts = [...current.accounts];
      [accounts[index], accounts[target]] = [accounts[target], accounts[index]];
      return { ...current, accounts };
    });
    setToast("");
  };

  const save = async () => {
    if (saving) return;
    const invalidIban = draft.accounts.find(
      (account) => plainIban(account.iban).length > 0 && plainIban(account.iban).length !== 26,
    );
    if (invalidIban) {
      setError(
        `"${invalidIban.bankName || "Yeni hesap"}" için IBAN 26 karakter olmalı. Lütfen IBAN'ı kontrol edin.`,
      );
      return;
    }
    setSaving(true);
    setError("");
    const result = await saveBankAccounts(draft);
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? "Banka bilgileri kaydedilemedi.");
      return;
    }
    const next = getBankAccounts();
    setSaved(next);
    setDraft(next);
    setToast("Banka bilgileri kaydedildi. Site ve footer bağlantısı güncellendi.");
    window.setTimeout(() => setToast(""), 3500);
  };

  const reset = () => {
    setDraft(saved);
    setError("");
    setToast("Değişiklikler geri alındı.");
    window.setTimeout(() => setToast(""), 2500);
  };

  const activeCount = draft.accounts.filter((account) => account.active).length;

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2.5 text-xs text-secondary-950">
          <i className="ri-error-warning-line mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2.5 text-xs text-foreground-600">
          <i className="ri-loader-4-line animate-spin" />
          Sunucudaki güncel banka bilgileri yükleniyor...
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi icon="ri-bank-line" label="Toplam hesap" value={String(draft.accounts.length)} hint="Kayıtlı banka hesabı" />
        <Kpi icon="ri-eye-line" label="Sitede görünen" value={String(activeCount)} hint="Aktif hesaplar" tone="success" />
        <Kpi
          icon="ri-shield-check-line"
          label="Havale ile ödeme"
          value={draft.enabled ? "Açık" : "Kapalı"}
          hint="Footer → Havale / EFT Bilgileri"
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel title="Ödeme Metni" subtitle="Sayfanın üstünde ve uyarı kutusunda görünen metinler" icon="ri-file-text-line">
            <div className="space-y-3">
              <Toggle
                checked={draft.enabled}
                onChange={(value) => patch({ enabled: value })}
                label="Havale / EFT ile ödeme kabul ediliyor"
                description="Kapalıyken sayfa açılır fakat ödeme yönteminin geçici olarak kullanılamadığı bilgisi gösterilir."
              />
              <Field label="Giriş açıklaması" hint="Hesap kartlarının üstünde görünen yönlendirme metni.">
                <textarea
                  value={draft.intro}
                  onChange={(event) => patch({ intro: event.target.value })}
                  rows={3}
                  maxLength={400}
                  className={textareaClass}
                />
              </Field>
              <Field label="Uyarı / önemli not" hint="Sarı uyarı kutusunda gösterilir. Boş bırakılırsa gizlenir.">
                <textarea
                  value={draft.notice}
                  onChange={(event) => patch({ notice: event.target.value })}
                  rows={2}
                  maxLength={300}
                  className={textareaClass}
                />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Destek telefonu">
                  <input
                    value={draft.supportPhone}
                    onChange={(event) => patch({ supportPhone: event.target.value })}
                    className={inputClass}
                    placeholder="0850 222 00 11"
                  />
                </Field>
                <Field label="Destek e-postası">
                  <input
                    type="email"
                    value={draft.supportEmail}
                    onChange={(event) => patch({ supportEmail: event.target.value })}
                    className={inputClass}
                    placeholder="destek@firma.com"
                  />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel
            title="Banka Hesapları"
            subtitle="Sitede listelenen IBAN ve hesap bilgileri"
            icon="ri-bank-card-line"
            action={
              <button
                type="button"
                onClick={addAccount}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Hesap Ekle
              </button>
            }
          >
            <div className="space-y-3">
              {draft.accounts.map((account, index) => (
                <AccountEditorCard
                  key={account.id}
                  account={account}
                  index={index}
                  total={draft.accounts.length}
                  onChange={(changes) => patchAccount(account.id, changes)}
                  onRemove={() => removeAccount(account.id)}
                  onMove={(direction) => moveAccount(account.id, direction)}
                />
              ))}

              {draft.accounts.length === 0 && (
                <Banner tone="warning">
                  Henüz banka hesabı yok. Ziyaretçilerin havale yapabilmesi için en az bir hesap ekleyin.
                </Banner>
              )}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <BankPreview draft={draft} />

          <Panel title="Kısa Bilgi" icon="ri-information-line">
            <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Footer'daki <strong>Havale / EFT Bilgileri</strong> bağlantısı bu sayfayı açar.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                IBAN'lar ziyaretçi tarafında tek tıkla kopyalanabilir.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Gizli işaretlediğiniz hesaplar kaydedilir, sitede görünmez.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Kaydettiğinizde bilgiler Supabase'e yazılır, tüm cihazlarda aynı görünür.
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-background-200 bg-background-50 px-4 py-3 shadow-sm">
        <span className={`text-xs ${dirty ? "text-secondary-800" : "text-foreground-500"}`}>
          {dirty ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={!dirty}
            className={`h-9 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium ${
              dirty ? "cursor-pointer text-foreground-700 hover:bg-background-100" : "cursor-not-allowed text-foreground-400"
            }`}
          >
            Sıfırla
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-3-line"} />
            {saving ? "Kaydediliyor..." : "Banka Bilgilerini Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}