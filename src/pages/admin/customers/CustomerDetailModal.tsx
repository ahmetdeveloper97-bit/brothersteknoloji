import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { formatNumberTr, segmentTone } from "@/lib/adminStore";
import type { AdminCustomer, CustomerSegment } from "@/types/admin";

const segments: CustomerSegment[] = ["VIP", "Sadık", "Yeni", "Riskli", "Pasif"];

interface CustomerDetailModalProps {
  open: boolean;
  draft: AdminCustomer;
  isNew: boolean;
  onClose: () => void;
  onSave: (customer: AdminCustomer, isNew: boolean) => void;
}

export default function CustomerDetailModal({ open, draft, isNew, onClose, onSave }: CustomerDetailModalProps) {
  const [form, setForm] = useState<AdminCustomer>(draft);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const patch = (changes: Partial<AdminCustomer>) => {
    setForm((current) => ({ ...current, ...changes }));
    setError("");
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (form.tags.includes(value)) {
      setTagInput("");
      return;
    }
    patch({ tags: [...form.tags, value] });
    setTagInput("");
  };

  const save = () => {
    if (!form.name.trim()) {
      setError("Müşteri adı zorunludur.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    onSave(
      {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        note: form.note.trim(),
      },
      isNew
    );
  };

  return (
    <Modal
      open={open}
      title={isNew ? "Yeni Müşteri Ekle" : form.name}
      subtitle={isNew ? "Manuel müşteri kaydı oluşturun" : form.email}
      icon={isNew ? "ri-user-add-line" : "ri-user-3-line"}
      onClose={onClose}
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
          >
            {isNew ? "Vazgeç" : "Kapat"}
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

        {!isNew && (
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-background-200 bg-background-100 p-2.5 text-center">
              <p className="text-[11px] text-foreground-500">Sipariş</p>
              <p className="font-heading text-base font-bold text-foreground-950">{form.orderCount}</p>
            </div>
            <div className="rounded-lg border border-background-200 bg-background-100 p-2.5 text-center">
              <p className="text-[11px] text-foreground-500">Harcama</p>
              <p className="font-heading text-base font-bold text-foreground-950">{formatNumberTr(form.totalSpend)} ₺</p>
            </div>
            <div className="rounded-lg border border-background-200 bg-background-100 p-2.5 text-center">
              <p className="text-[11px] text-foreground-500">Segment</p>
              <span className="mt-1 inline-flex">
                <Pill tone={segmentTone(form.segment)}>{form.segment}</Pill>
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Ad soyad *">
            <input value={form.name} onChange={(event) => patch({ name: event.target.value })} className={inputClass} />
          </Field>
          <Field label="E-posta *">
            <input
              type="email"
              value={form.email}
              onChange={(event) => patch({ email: event.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Telefon">
            <input value={form.phone} onChange={(event) => patch({ phone: event.target.value })} className={inputClass} />
          </Field>
          <Field label="Şehir / ilçe">
            <input value={form.city} onChange={(event) => patch({ city: event.target.value })} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Segment">
            <select
              value={form.segment}
              onChange={(event) => patch({ segment: event.target.value as CustomerSegment })}
              className={inputClass}
            >
              {segments.map((segment) => (
                <option key={segment} value={segment}>
                  {segment}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Son sipariş">
            <input
              value={form.lastOrder ?? ""}
              onChange={(event) => patch({ lastOrder: event.target.value || null })}
              className={inputClass}
              placeholder="gg.aa.yyyy"
            />
          </Field>
        </div>

        <Field label="Etiketler" hint="Enter'a basarak etiket ekleyin.">
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-background-300 bg-background-50 p-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[11px] font-medium text-primary-900"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => patch({ tags: form.tags.filter((item) => item !== tag) })}
                  aria-label={`${tag} etiketini kaldır`}
                  className="cursor-pointer opacity-60 hover:opacity-100"
                >
                  <i className="ri-close-line text-xs" />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="Etiket ekle..."
              className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-xs text-foreground-900 outline-none placeholder:text-foreground-400"
            />
          </div>
        </Field>

        <div className="space-y-2.5 rounded-lg bg-background-100 p-3">
          <Toggle
            checked={form.emailOptIn}
            onChange={(value) => patch({ emailOptIn: value })}
            label="E-posta izni var"
            description="Kampanya ve bülten e-postaları gönderilebilir."
          />
          <Toggle
            checked={form.smsOptIn}
            onChange={(value) => patch({ smsOptIn: value })}
            label="SMS izni var"
            description="NetGSM üzerinden bilgilendirme SMS'i gönderilebilir."
          />
        </div>

        <Field label="Müşteri notu">
          <textarea
            value={form.note}
            onChange={(event) => patch({ note: event.target.value })}
            rows={2}
            maxLength={240}
            className={textareaClass}
          />
        </Field>
      </div>
    </Modal>
  );
}