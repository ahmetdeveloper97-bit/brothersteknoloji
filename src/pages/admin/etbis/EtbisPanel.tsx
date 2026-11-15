import { useMemo, useState } from "react";
import { Banner, Field, Panel, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import EtbisBadge from "@/components/base/EtbisBadge";
import { loadEtbisSettings, normalizeEtbisUrl, saveEtbisSettings } from "@/lib/adminStore";
import type { EtbisSettings } from "@/types/admin";

export default function EtbisPanel() {
  const [saved, setSaved] = useState<EtbisSettings>(() => loadEtbisSettings());
  const [draft, setDraft] = useState<EtbisSettings>(saved);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const patch = (changes: Partial<EtbisSettings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setToast("");
    setError("");
  };

  const save = () => {
    const url = normalizeEtbisUrl(draft.profileUrl);
    if (draft.enabled && !url) {
      setError("Modülü aktif etmek için ETBIS profil adresi girmelisiniz.");
      return;
    }
    if (url && !/^https?:\/\/[^\s.]+\.[^\s]+/i.test(url)) {
      setError("Geçerli bir profil adresi girin. Örnek: https://etbis.ticaret.gov.tr/tr/firma/...");
      return;
    }
    const next: EtbisSettings = { ...draft, profileUrl: url };
    saveEtbisSettings(next);
    setSaved(next);
    setDraft(next);
    setError("");
    setToast("ETBIS ayarları kaydedildi ve mağazaya uygulandı.");
    window.setTimeout(() => setToast(""), 3000);
  };

  const reset = () => {
    setDraft(saved);
    setToast("Değişiklikler geri alındı.");
    setError("");
    window.setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          {toast}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2.5 text-xs text-secondary-950">
          <i className="ri-error-warning-line" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel
            title="ETBIS Modülü"
            subtitle="Aktif edildiğinde mağaza alt bilgisinde QR kod görünür"
            icon="ri-qr-code-line"
            action={<Pill tone={saved.enabled ? "success" : "neutral"}>{saved.enabled ? "Aktif" : "Kapalı"}</Pill>}
          >
            <div className="space-y-3">
              <Toggle
                checked={draft.enabled}
                onChange={(value) => patch({ enabled: value })}
                label="ETBIS modülünü aktif et"
                description="Kapalıyken alt bilgide ETBIS alanı hiç gösterilmez."
              />
              <div className="h-px bg-background-200" />
              <Toggle
                checked={draft.showQr}
                onChange={(value) => patch({ showQr: value })}
                label="QR kodu göster"
                description="Kapatırsanız yalnızca yazılı ETBIS kutusu görünür, QR kod gizlenir."
              />
            </div>
          </Panel>

          <Panel
            title="Kayıt Bilgileri"
            subtitle="QR kodun hedefi ve kartın bağlantı bilgileri buradan yönetilir"
            icon="ri-building-4-line"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Firma / mağaza adı">
                <input
                  value={draft.companyName}
                  onChange={(event) => patch({ companyName: event.target.value })}
                  maxLength={80}
                  placeholder="Brothers Teknoloji"
                  className={inputClass}
                />
              </Field>
              <Field label="ETBIS kayıt numarası" hint="Kartın üzerine gelindiğinde ipucu olarak görünür, opsiyoneldir.">
                <input
                  value={draft.registrationNumber}
                  onChange={(event) => patch({ registrationNumber: event.target.value })}
                  maxLength={30}
                  placeholder="0123456789"
                  className={inputClass}
                />
              </Field>
            </div>
            <div className="mt-3 space-y-3">
              <Field
                label="ETBIS profil adresi"
                hint="QR kod ve karta tıklanınca bu adres yeni sekmede açılır. Başında https:// yoksa otomatik eklenir."
              >
                <input
                  value={draft.profileUrl}
                  onChange={(event) => patch({ profileUrl: event.target.value })}
                  maxLength={300}
                  placeholder="https://etbis.ticaret.gov.tr/tr/firma/..."
                  className={inputClass}
                />
              </Field>
              <Field label="Kısa açıklama" hint="Opsiyonel. Kartın üzerine gelindiğinde ipucu olarak ve bağlantı etiketinde kullanılır.">
                <textarea
                  value={draft.note}
                  onChange={(event) => patch({ note: event.target.value })}
                  rows={2}
                  maxLength={160}
                  placeholder="ETBIS'e kayıtlı e-ticaret sitesi"
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="mt-3">
              <Banner tone="info">
                ETBIS kaydınızın gerçek profil bağlantısını girin. QR kod okutulduğunda ziyaretçi doğrudan resmi ETBIS
                sayfanıza gider, bu da güven algısını güçlendirir.
              </Banner>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Mağaza Önizleme" subtitle="Alt bilgide birebir bu şekilde görünür" icon="ri-eye-line">
            <div className="rounded-xl border border-background-200 bg-background-100 p-3">
              <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">
                <i className="ri-verified-badge-line text-xs" />
                Site uzman kadromuz tarafından desteklenmektedir.
              </p>
              {draft.enabled ? (
                <EtbisBadge settings={draft} />
              ) : (
                <div className="rounded-xl border border-dashed border-background-300 bg-background-50 px-3 py-6 text-center text-[11px] text-foreground-500">
                  Modül kapalı — alt bilgide ETBIS alanı görünmüyor.
                </div>
              )}
            </div>
            {draft.enabled && (
              <div className="mt-3 space-y-1.5 text-[11px] text-foreground-600">
                <p className="flex items-start gap-1.5">
                  <i className="ri-building-4-line mt-0.5 text-primary-700" />
                  <span className="truncate">
                    {draft.companyName || "Firma adı girilmedi"}
                    {draft.registrationNumber ? ` · Kayıt No: ${draft.registrationNumber}` : ""}
                  </span>
                </p>
                <p className="flex items-start gap-1.5">
                  <i className="ri-map-pin-user-line mt-0.5 text-primary-700" />
                  <span className="break-all">{normalizeEtbisUrl(draft.profileUrl) || "Profil adresi girilmedi"}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <i className="ri-qr-scan-2-line mt-0.5 text-primary-700" />
                  {draft.showQr ? "QR kod aktif" : "QR kod gizli"}
                </p>
              </div>
            )}
          </Panel>

          <Panel title="Nasıl çalışır?" icon="ri-lightbulb-line">
            <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Modül açıkken alt bilgide, destek yazısının hemen altında en solda ETBIS kartı çıkar.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                QR kodu veya karta tıklanınca girdiğiniz profil adresi yeni sekmede açılır.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Modülü kapatınca alan tamamen kalkar; ayarlar korunur, tekrar açabilirsiniz.
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
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-save-3-line" />
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}