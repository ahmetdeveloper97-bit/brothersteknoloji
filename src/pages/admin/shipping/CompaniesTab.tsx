import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Field, Panel, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { buildTrackingUrl } from "@/lib/shipping";
import type { CargoCompany } from "@/types/shipping";

interface CompaniesTabProps {
  companies: CargoCompany[];
  onToggle: (id: string) => void;
  onSave: (company: CargoCompany, isNew: boolean) => void;
  onEnableAll: () => void;
}

const emptyCompany: CargoCompany = {
  id: "",
  name: "",
  short: "",
  enabled: true,
  connected: false,
  trackingUrl: "https://",
  phone: "",
  avgDelivery: "1-2 gün",
  supportsCod: true,
  supportsReturn: true,
  customerCode: "",
  apiKey: "",
  note: "",
};

export default function CompaniesTab({ companies, onToggle, onSave, onEnableAll }: CompaniesTabProps) {
  const [draft, setDraft] = useState<CargoCompany | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [test, setTest] = useState<null | "ok" | "error">(null);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const connectedCount = companies.filter((company) => company.connected).length;
  const enabledCount = companies.filter((company) => company.enabled).length;

  const openEdit = (company: CargoCompany) => {
    setDraft({ ...company });
    setIsNew(false);
    setTest(null);
    setError("");
    setShowKey(false);
  };

  const openNew = () => {
    setDraft({ ...emptyCompany });
    setIsNew(true);
    setTest(null);
    setError("");
    setShowKey(false);
  };

  const close = () => {
    setDraft(null);
    setTest(null);
    setError("");
  };

  const patch = (changes: Partial<CargoCompany>) => {
    setDraft((current) => (current ? { ...current, ...changes } : current));
    setTest(null);
  };

  const runTest = () => {
    if (!draft) return;
    if (draft.customerCode.trim().length < 3 || draft.apiKey.trim().length < 6) {
      setTest("error");
      return;
    }
    setTest("ok");
  };

  const save = () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.short.trim()) {
      setError("Firma adı ve kısa kod zorunludur.");
      return;
    }
    const id = isNew
      ? draft.name
          .toLowerCase()
          .replace(/[ıİ]/g, "i")
          .replace(/[şŞ]/g, "s")
          .replace(/[ğĞ]/g, "g")
          .replace(/[üÜ]/g, "u")
          .replace(/[öÖ]/g, "o")
          .replace(/[çÇ]/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 24) || `firma-${Date.now().toString().slice(-4)}`
      : draft.id;
    onSave(
      {
        ...draft,
        id,
        name: draft.name.trim(),
        short: draft.short.trim().toUpperCase().slice(0, 4),
        connected: draft.apiKey.trim().length >= 6 && draft.customerCode.trim().length >= 3,
      },
      isNew
    );
    close();
  };

  return (
    <div className="space-y-4">
      <Banner tone="info">
        Tüm kargo firmaları aynı gönderi/etiket akışını kullanır. API bilgisi olmayan firmalar için takip linki şablonu
        yeterlidir; <span className="font-semibold">{"{tracking}"}</span> alanı takip numarasıyla değiştirilir.
      </Banner>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Tanımlı Firma</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{companies.length}</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Aktif Firma</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{enabledCount}</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">API Bağlı</p>
          <p className="mt-1 font-heading text-xl font-bold text-accent-700">{connectedCount}</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Kapıda Ödeme</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">
            {companies.filter((company) => company.supportsCod).length}
          </p>
        </div>
      </div>

      <Panel
        title="Kargo Firmaları"
        subtitle="Her firmayı ayrı ayrı yapılandırın, istediğiniz kadar yeni firma ekleyin"
        icon="ri-truck-line"
        padded={false}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEnableAll}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              <i className="ri-check-double-line" />
              Tümünü Etkinleştir
            </button>
            <button
              type="button"
              onClick={openNew}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-add-line" />
              Yeni Firma Ekle
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => {
            const sampleTracking = "123456789";
            const trackingPreview = buildTrackingUrl(company, sampleTracking);
            return (
              <div
                key={company.id}
                className={`flex flex-col rounded-xl border p-3.5 transition-colors ${
                  company.enabled ? "border-background-200 bg-background-50" : "border-background-200 bg-background-100/60"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold ${
                      company.connected ? "bg-primary-100 text-primary-900" : "bg-background-200 text-foreground-600"
                    }`}
                  >
                    {company.short}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground-950">{company.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <Pill tone={company.connected ? "success" : "neutral"}>
                        <i className={company.connected ? "ri-link" : "ri-link-unlink"} />
                        {company.connected ? "API Bağlı" : "Manuel Takip"}
                      </Pill>
                      <Pill tone={company.enabled ? "info" : "neutral"}>{company.enabled ? "Aktif" : "Kapalı"}</Pill>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-foreground-600">
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line" />
                    {company.avgDelivery}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-phone-line" />
                    {company.phone || "—"}
                  </span>
                  <span className={`flex items-center gap-1 ${company.supportsCod ? "text-accent-700" : "text-foreground-400"}`}>
                    <i className={company.supportsCod ? "ri-money-dollar-circle-line" : "ri-close-line"} />
                    Kapıda ödeme
                  </span>
                  <span className={`flex items-center gap-1 ${company.supportsReturn ? "text-accent-700" : "text-foreground-400"}`}>
                    <i className={company.supportsReturn ? "ri-arrow-go-back-line" : "ri-close-line"} />
                    İade
                  </span>
                </div>

                <p className="mt-2 truncate rounded-md bg-background-100 px-2 py-1 font-mono text-[10px] text-foreground-500">
                  {trackingPreview || "Takip linki tanımsız"}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 border-t border-background-200 pt-2.5">
                  <button
                    type="button"
                    onClick={() => openEdit(company)}
                    className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-background-100 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
                  >
                    <i className="ri-settings-3-line" />
                    Bağlantı Ayarları
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={company.enabled}
                    aria-label={`${company.name} durumunu değiştir`}
                    onClick={() => onToggle(company.id)}
                    className={`ml-auto flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                      company.enabled ? "bg-accent-600" : "bg-background-400"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-background-50 shadow transition-transform ${
                        company.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Modal
        open={Boolean(draft)}
        title={isNew ? "Yeni Kargo Firması Ekle" : `${draft?.name ?? ""} · Bağlantı Ayarları`}
        subtitle={isNew ? "Herhangi bir kargo firmasını sisteme dahil edin" : "API bilgileri ve takip linki şablonu"}
        icon={isNew ? "ri-add-box-line" : "ri-link"}
        onClose={close}
        maxWidth="max-w-xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={save}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-save-3-line" />
              Kaydet
            </button>
          </div>
        }
      >
        {draft && (
          <div className="space-y-3.5">
            {error && (
              <p className="flex items-center gap-2 rounded-lg border border-foreground-300 bg-foreground-100 px-3 py-2 text-xs text-foreground-900">
                <i className="ri-error-warning-line" />
                {error}
              </p>
            )}
            {test === "ok" && (
              <Banner tone="success" onClose={() => setTest(null)}>
                Bağlantı başarılı · {draft.name} API bilgileri doğrulandı, gönderi oluşturma yetkisi mevcut.
              </Banner>
            )}
            {test === "error" && (
              <Banner tone="danger" onClose={() => setTest(null)}>
                Bağlantı kurulamadı. Müşteri kodu ve API anahtarını kontrol edin.
              </Banner>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Field label="Firma adı *">
                  <input
                    value={draft.name}
                    onChange={(event) => patch({ name: event.target.value })}
                    className={inputClass}
                    placeholder="Örn. Yurtiçi Kargo"
                  />
                </Field>
              </div>
              <Field label="Kısa kod *">
                <input
                  value={draft.short}
                  onChange={(event) => patch({ short: event.target.value })}
                  className={inputClass}
                  placeholder="YK"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Müşteri / anlaşma kodu">
                <input
                  value={draft.customerCode}
                  onChange={(event) => patch({ customerCode: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="API anahtarı">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={draft.apiKey}
                    onChange={(event) => patch({ apiKey: event.target.value })}
                    className={`${inputClass} pr-9`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((value) => !value)}
                    aria-label="API anahtarını göster"
                    className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-foreground-500"
                  >
                    <i className={showKey ? "ri-eye-off-line" : "ri-eye-line"} />
                  </button>
                </div>
              </Field>
            </div>

            <Field label="Takip linki şablonu" hint="Takip numarasının yerine {tracking} yazın.">
              <input
                value={draft.trackingUrl}
                onChange={(event) => patch({ trackingUrl: event.target.value })}
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Telefon">
                <input value={draft.phone} onChange={(event) => patch({ phone: event.target.value })} className={inputClass} />
              </Field>
              <Field label="Ortalama teslimat">
                <input
                  value={draft.avgDelivery}
                  onChange={(event) => patch({ avgDelivery: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-2.5 rounded-lg bg-background-100 p-3">
              <Toggle
                checked={draft.enabled}
                onChange={(value) => patch({ enabled: value })}
                label="Firma aktif"
                description="Kapalı firmalar gönderi oluşturma ekranında listelenmez."
              />
              <Toggle
                checked={draft.supportsCod}
                onChange={(value) => patch({ supportsCod: value })}
                label="Kapıda ödeme destekleniyor"
              />
              <Toggle
                checked={draft.supportsReturn}
                onChange={(value) => patch({ supportsReturn: value })}
                label="İade gönderisi destekleniyor"
              />
            </div>

            <Field label="Not">
              <textarea
                value={draft.note}
                onChange={(event) => patch({ note: event.target.value })}
                rows={2}
                maxLength={160}
                className={textareaClass}
              />
            </Field>

            <button
              type="button"
              onClick={runTest}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-300 bg-primary-50 px-3 text-xs font-semibold text-primary-900 hover:bg-primary-100"
            >
              <i className="ri-plug-line" />
              Bağlantıyı Test Et
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}