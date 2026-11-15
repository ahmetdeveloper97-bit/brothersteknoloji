import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { campaignTypeLabel, campaignValueLabel } from "@/lib/adminStore";
import type { Campaign, CampaignType } from "@/types/admin";

const types: CampaignType[] = ["percentage", "fixed", "xForY", "freeShipping"];

const typeLabels: Record<CampaignType, string> = {
  percentage: "Yüzde İndirim",
  fixed: "Tutar İndirimi",
  xForY: "X Al Y Öde",
  freeShipping: "Ücretsiz Kargo",
};

const randomCode = (): string => {
  const words = ["FIRSAT", "KAMPANYA", "SEPET", "EKIM", "VIP", "YENI"];
  const word = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(10 + Math.random() * 89);
  return `${word}${number}`;
};

interface CampaignFormModalProps {
  open: boolean;
  draft: Campaign;
  isNew: boolean;
  onClose: () => void;
  onSave: (campaign: Campaign, isNew: boolean) => void;
}

export default function CampaignFormModal({ open, draft, isNew, onClose, onSave }: CampaignFormModalProps) {
  const [form, setForm] = useState<Campaign>(draft);
  const [error, setError] = useState("");

  const patch = (changes: Partial<Campaign>) => {
    setForm((current) => ({ ...current, ...changes }));
    setError("");
  };

  const toggleChannel = (channel: string) => {
    setForm((current) => ({
      ...current,
      channels: current.channels.includes(channel)
        ? current.channels.filter((item) => item !== channel)
        : [...current.channels, channel],
    }));
  };

  const save = () => {
    if (!form.title.trim()) {
      setError("Kampanya başlığı zorunludur.");
      return;
    }
    if (!/^[A-Z0-9]{3,20}$/.test(form.code.trim())) {
      setError("Kupon kodu 3-20 karakter olmalı, sadece büyük harf ve rakam içermelidir.");
      return;
    }
    if (form.startDate > form.endDate) {
      setError("Başlangıç tarihi bitiş tarihinden sonra olamaz.");
      return;
    }
    if (!form.channels.length) {
      setError("En az bir kanal seçmelisiniz.");
      return;
    }
    if (form.type !== "freeShipping" && form.type !== "xForY" && form.value <= 0) {
      setError("İndirim değeri sıfırdan büyük olmalıdır.");
      return;
    }
    onSave({ ...form, title: form.title.trim(), code: form.code.trim() }, isNew);
  };

  const valueField = () => {
    if (form.type === "freeShipping") {
      return (
        <Field label="Ücretsiz kargo koşulu" hint="Bu tutarın üzerindeki sepetlerde kargo ücretsiz olur.">
          <input
            type="number"
            min={0}
            value={form.minBasket}
            onChange={(event) => patch({ minBasket: Number(event.target.value) })}
            className={inputClass}
          />
        </Field>
      );
    }
    if (form.type === "xForY") {
      return (
        <Field label="Alınacak adet (X)" hint="X ürün alındığında 1 ürün ücretsiz olur.">
          <input
            type="number"
            min={2}
            max={10}
            value={form.value}
            onChange={(event) => patch({ value: Number(event.target.value) })}
            className={inputClass}
          />
        </Field>
      );
    }
    return (
      <Field label={form.type === "percentage" ? "İndirim oranı (%)" : "İndirim tutarı (₺)"}>
        <input
          type="number"
          min={0}
          value={form.value}
          onChange={(event) => patch({ value: Number(event.target.value) })}
          className={inputClass}
        />
      </Field>
    );
  };

  return (
    <Modal
      open={open}
      title={isNew ? "Yeni Kampanya" : `${form.code} Düzenle`}
      subtitle={isNew ? "Kupon kodu veya otomatik indirim senaryosu oluşturun" : campaignTypeLabel(form)}
      icon="ri-discount-percent-line"
      onClose={onClose}
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
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
      <div className="space-y-3.5">
        {error && (
          <p className="flex items-center gap-2 rounded-lg border border-foreground-300 bg-foreground-100 px-3 py-2 text-xs text-foreground-900">
            <i className="ri-error-warning-line" />
            {error}
          </p>
        )}

        <Field label="Kampanya başlığı *">
          <input
            value={form.title}
            onChange={(event) => patch({ title: event.target.value })}
            className={inputClass}
            placeholder="Örn. Ekim Ayı Sepette %25"
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Kupon kodu *">
            <div className="flex gap-1.5">
              <input
                value={form.code}
                onChange={(event) => patch({ code: event.target.value.toLocaleUpperCase("tr").replace(/\s+/g, "") })}
                className={`${inputClass} font-mono`}
                maxLength={20}
              />
              <button
                type="button"
                onClick={() => patch({ code: randomCode() })}
                aria-label="Rastgele kod üret"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-100"
              >
                <i className="ri-refresh-line" />
              </button>
            </div>
          </Field>
          <Field label="Kampanya tipi">
            <select
              value={form.type}
              onChange={(event) => patch({ type: event.target.value as CampaignType })}
              className={inputClass}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {typeLabels[type]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {valueField()}
          <Field label="Minimum sepet (₺)">
            <input
              type="number"
              min={0}
              value={form.minBasket}
              onChange={(event) => patch({ minBasket: Number(event.target.value) })}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Kullanım limiti">
            <input
              type="number"
              min={1}
              value={form.usageLimit}
              onChange={(event) => patch({ usageLimit: Number(event.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Şu ana kadar kullanım">
            <input
              type="number"
              min={0}
              value={form.used}
              onChange={(event) => patch({ used: Number(event.target.value) })}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Başlangıç tarihi">
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => patch({ startDate: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Bitiş tarihi">
            <input
              type="date"
              value={form.endDate}
              onChange={(event) => patch({ endDate: event.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Geçerli kanallar">
          <div className="flex flex-wrap gap-2">
            {["Web", "Mobil"].map((channel) => {
              const active = form.channels.includes(channel);
              return (
                <button
                  key={channel}
                  type="button"
                  onClick={() => toggleChannel(channel)}
                  className={`h-9 cursor-pointer whitespace-nowrap rounded-lg border px-3 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary-400 bg-primary-100 text-primary-900"
                      : "border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100"
                  }`}
                >
                  <i className={`${active ? "ri-checkbox-circle-fill" : "ri-checkbox-blank-circle-line"} mr-1`} />
                  {channel}
                </button>
              );
            })}
          </div>
        </Field>

        <div className="rounded-lg bg-background-100 p-3">
          <Toggle
            checked={form.active}
            onChange={(value) => patch({ active: value })}
            label="Kampanya aktif"
            description="Kapalı kampanyalar kupon sorgusunda reddedilir."
          />
        </div>

        <Field label="Not">
          <textarea
            value={form.note}
            onChange={(event) => patch({ note: event.target.value })}
            rows={2}
            maxLength={200}
            className={textareaClass}
          />
        </Field>

        <div className="rounded-lg border border-background-200 bg-background-50 px-3 py-2.5 text-xs text-foreground-600">
          <span className="font-semibold text-foreground-900">Özet:</span> {campaignValueLabel(form)}
          {form.minBasket > 0 ? ` · min. ${form.minBasket.toLocaleString("tr-TR")} ₺ sepet` : ""} ·{" "}
          {form.startDate} → {form.endDate}
        </div>
      </div>
    </Modal>
  );
}