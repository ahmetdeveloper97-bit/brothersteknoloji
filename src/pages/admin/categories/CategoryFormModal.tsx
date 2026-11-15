import { useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { slugify } from "@/lib/adminStore";
import type { AdminCategory } from "@/types/admin";

interface CategoryFormModalProps {
  open: boolean;
  draft: AdminCategory | null;
  isNew: boolean;
  categories: AdminCategory[];
  onClose: () => void;
  onSave: (category: AdminCategory, isNew: boolean) => void;
}

export default function CategoryFormModal({
  open,
  draft,
  isNew,
  categories,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [form, setForm] = useState<AdminCategory | null>(draft);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const patch = (changes: Partial<AdminCategory>) => {
    setForm((current) => (current ? { ...current, ...changes } : current));
    setError("");
  };

  const rootOptions = categories.filter((category) => !category.parent && category.id !== form?.id);

  const handleName = (name: string) => {
    if (!form) return;
    if (slugTouched) {
      patch({ name });
      return;
    }
    patch({ name, slug: slugify(name) });
  };

  const save = () => {
    if (!form) return;
    if (!form.name.trim()) {
      setError("Kategori adı zorunludur.");
      return;
    }
    if (!form.slug.trim()) {
      setError("URL adresi (slug) zorunludur.");
      return;
    }
    const duplicate = categories.some(
      (category) => category.slug === form.slug.trim() && category.id !== form.id
    );
    if (duplicate) {
      setError("Bu URL adresi başka bir kategoride kullanılıyor.");
      return;
    }
    onSave(
      {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        order: Number.isFinite(form.order) ? form.order : 1,
      },
      isNew
    );
  };

  return (
    <Modal
      open={open && Boolean(form)}
      title={isNew ? "Yeni Kategori Ekle" : `${draft?.name ?? ""} Düzenle`}
      subtitle={isNew ? "Ana kategori veya alt kategori oluşturun" : "Kategori bilgileri ve SEO ayarları"}
      icon="ri-price-tag-3-line"
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
      {form && (
        <div className="space-y-3.5">
          {error && (
            <p className="flex items-center gap-2 rounded-lg border border-foreground-300 bg-foreground-100 px-3 py-2 text-xs text-foreground-900">
              <i className="ri-error-warning-line" />
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Kategori adı *">
              <input
                value={form.name}
                onChange={(event) => handleName(event.target.value)}
                className={inputClass}
                placeholder="Örn. Akıllı Saatler"
              />
            </Field>
            <Field label="Üst kategori">
              <select
                value={form.parent ?? ""}
                onChange={(event) => patch({ parent: event.target.value || null })}
                className={inputClass}
              >
                <option value="">Ana kategori</option>
                {rootOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="URL adresi (slug)" hint="/kategori/akilli-saatler biçiminde görünür.">
            <input
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true);
                patch({ slug: slugify(event.target.value) });
              }}
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>

          <Field label="Kategori açıklaması">
            <textarea
              value={form.description}
              onChange={(event) => patch({ description: event.target.value })}
              rows={2}
              maxLength={240}
              className={textareaClass}
              placeholder="Kategori sayfasının üstünde gösterilecek kısa açıklama"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="SEO başlığı" hint="60 karakteri geçmemesi önerilir.">
              <input
                value={form.seoTitle}
                onChange={(event) => patch({ seoTitle: event.target.value })}
                maxLength={70}
                className={inputClass}
              />
            </Field>
            <Field label="Vitrin sırası">
              <input
                type="number"
                min={1}
                value={form.order}
                onChange={(event) => patch({ order: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="SEO açıklaması" hint="120-160 karakter arası önerilir.">
            <textarea
              value={form.seoDescription}
              onChange={(event) => patch({ seoDescription: event.target.value })}
              rows={2}
              maxLength={180}
              className={textareaClass}
            />
          </Field>

          <div className="space-y-2.5 rounded-lg bg-background-100 p-3">
            <Toggle
              checked={form.active}
              onChange={(value) => patch({ active: value })}
              label="Kategori yayında"
              description="Kapalı kategoriler mağaza menüsünde görünmez."
            />
            <Toggle
              checked={form.showOnHome}
              onChange={(value) => patch({ showOnHome: value })}
              label="Ana sayfa vitrininde göster"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}