import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Field, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { RESERVED_SLUGS, adminSavePage, slugifyPage } from "@/lib/sitePages";
import type { SitePage, SitePageSection, SitePageStatus } from "@/types/sitePage";

const uid = (): string => `blok-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

interface FormState {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string;
  sections: SitePageSection[];
  seoTitle: string;
  seoDescription: string;
  status: SitePageStatus;
  showInFooter: boolean;
  sortOrder: number;
}

const emptySection = (): SitePageSection => ({ id: uid(), heading: "", body: "", image: "", bullets: [] });

const emptyForm = (): FormState => ({
  id: "",
  slug: "",
  title: "",
  subtitle: "",
  coverImage: "",
  sections: [emptySection()],
  seoTitle: "",
  seoDescription: "",
  status: "draft",
  showInFooter: false,
  sortOrder: 0,
});

const toForm = (page: SitePage): FormState => ({
  id: page.id,
  slug: page.slug,
  title: page.title,
  subtitle: page.subtitle,
  coverImage: page.coverImage,
  sections: page.sections.length > 0 ? page.sections.map((section) => ({ ...section, bullets: [...section.bullets] })) : [emptySection()],
  seoTitle: page.seoTitle,
  seoDescription: page.seoDescription,
  status: page.status,
  showInFooter: page.showInFooter,
  sortOrder: page.sortOrder,
});

interface PageFormModalProps {
  open: boolean;
  page: SitePage | null;
  onClose: () => void;
  onSaved: (page: SitePage, isNew: boolean) => void;
}

export default function PageFormModal({ open, page, onClose, onSaved }: PageFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"content" | "seo">("content");

  useEffect(() => {
    if (!open) return;
    setForm(page ? toForm(page) : emptyForm());
    setSlugTouched(Boolean(page));
    setError("");
    setSaving(false);
    setTab("content");
  }, [open, page]);

  const slugPreview = useMemo(() => form.slug || slugifyPage(form.title) || "sayfa-adresi", [form.slug, form.title]);

  const patch = (values: Partial<FormState>) => setForm((current) => ({ ...current, ...values }));

  const updateSection = (id: string, values: Partial<SitePageSection>) =>
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section) => (section.id === id ? { ...section, ...values } : section)),
    }));

  const moveSection = (index: number, direction: -1 | 1) => {
    setForm((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.sections.length) return current;
      const next = [...current.sections];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...current, sections: next };
    });
  };

  const removeSection = (id: string) =>
    setForm((current) => ({
      ...current,
      sections: current.sections.length > 1 ? current.sections.filter((section) => section.id !== id) : current.sections,
    }));

  const handleTitle = (value: string) => {
    const nextTitle = value.slice(0, 140);
    setForm((current) => ({
      ...current,
      title: nextTitle,
      slug: slugTouched ? current.slug : slugifyPage(nextTitle),
    }));
  };

  const handleSlug = (value: string) => {
    setSlugTouched(true);
    patch({ slug: value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 70) });
  };

  const save = async () => {
    const title = form.title.trim();
    const slug = (form.slug || slugifyPage(title)).trim();
    const sections = form.sections.filter(
      (section) => section.heading.trim() || section.body.trim() || section.image.trim() || section.bullets.join("").trim(),
    );

    if (title.length < 2) {
      setError("Sayfa başlığı en az 2 karakter olmalı.");
      setTab("content");
      return;
    }
    if (slug.length < 2) {
      setError("Sayfa adresi (slug) en az 2 karakter olmalı.");
      setTab("content");
      return;
    }
    if (RESERVED_SLUGS.includes(slug)) {
      setError("Bu adres mağazanın kendi sayfalarında kullanılıyor. Farklı bir adres seçin.");
      setTab("content");
      return;
    }
    if (sections.length === 0 && form.subtitle.trim().length === 0) {
      setError("Sayfaya en az bir içerik bloğu veya kısa açıklama ekleyin.");
      setTab("content");
      return;
    }

    setSaving(true);
    setError("");
    const result = await adminSavePage({
      id: form.id,
      slug,
      title,
      subtitle: form.subtitle.trim(),
      coverImage: form.coverImage.trim(),
      sections: sections.map((section) => ({
        id: section.id,
        heading: section.heading.trim(),
        body: section.body.trim(),
        image: section.image.trim(),
        bullets: section.bullets.map((item) => item.trim()).filter((item) => item.length > 0),
      })),
      seoTitle: form.seoTitle.trim() || title,
      seoDescription: form.seoDescription.trim() || form.subtitle.trim(),
      status: form.status,
      showInFooter: form.showInFooter,
      sortOrder: Number.isFinite(form.sortOrder) ? form.sortOrder : 0,
    });
    setSaving(false);

    if (!result.ok || !result.page) {
      setError(result.message ?? "Sayfa kaydedilemedi.");
      return;
    }
    onSaved(result.page, !form.id);
  };

  return (
    <Modal
      open={open}
      title={page ? "Sayfayı Düzenle" : "Yeni Sayfa Oluştur"}
      subtitle="Başlık, adres ve içerik bloklarıyla kendi sayfanızı oluşturun"
      icon="ri-pages-line"
      onClose={onClose}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-foreground-500">
            <i className={`${form.status === "published" ? "ri-checkbox-circle-line" : "ri-draft-line"}`} />
            {form.status === "published" ? "Yayında olarak kaydedilecek" : "Taslak olarak kaydedilecek"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-3-line"} />
              {saving ? "Kaydediliyor..." : "Sayfayı Kaydet"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <Banner tone="danger" onClose={() => setError("")}>{error}</Banner>}

        <div className="flex gap-1 rounded-lg bg-background-100 p-1">
          {[
            { id: "content" as const, label: "İçerik", icon: "ri-file-text-line" },
            { id: "seo" as const, label: "SEO & Yayın", icon: "ri-search-eye-line" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === item.id ? "bg-background-50 text-foreground-950 shadow-sm" : "text-foreground-600 hover:text-foreground-900"
              }`}
            >
              <i className={`${item.icon} text-sm`} />
              {item.label}
            </button>
          ))}
        </div>

        {tab === "content" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Sayfa başlığı">
                <input
                  value={form.title}
                  onChange={(event) => handleTitle(event.target.value)}
                  placeholder="Örn. Hakkımızda"
                  className={inputClass}
                />
              </Field>
              <Field label="Sayfa adresi (slug)" hint={`Adres: /sayfa/${slugPreview}`}>
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 rounded-lg bg-background-100 px-2 py-2 text-[11px] text-foreground-500">/sayfa/</span>
                  <input
                    value={form.slug}
                    onChange={(event) => handleSlug(event.target.value)}
                    placeholder="hakkimizda"
                    className={inputClass}
                  />
                </div>
              </Field>
            </div>

            <Field label="Kısa açıklama" hint="Sayfa başlığının altında görünen 1-2 cümlelik özet.">
              <textarea
                value={form.subtitle}
                onChange={(event) => patch({ subtitle: event.target.value.slice(0, 320) })}
                rows={2}
                maxLength={320}
                placeholder="Sayfanın amacını kısaca anlatın."
                className={`${textareaClass} resize-none`}
              />
            </Field>

            <Field label="Kapak görseli (isteğe bağlı)" hint="Görsel bağlantısı (https ile başlamalı). Boş bırakırsanız sade başlık alanı kullanılır.">
              <input
                value={form.coverImage}
                onChange={(event) => patch({ coverImage: event.target.value })}
                placeholder="https://..."
                className={inputClass}
              />
            </Field>

            <div className="rounded-xl border border-background-200">
              <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-3 py-2.5">
                <i className="ri-layout-masonry-line text-base text-primary-700" />
                <p className="min-w-0 flex-1 text-xs font-semibold text-foreground-800">
                  İçerik blokları <span className="font-normal text-foreground-500">({form.sections.length})</span>
                </p>
                <button
                  type="button"
                  onClick={() => patch({ sections: [...form.sections, emptySection()] })}
                  className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-primary-50 px-2.5 text-[11px] font-semibold text-primary-900 hover:bg-primary-100"
                >
                  <i className="ri-add-line" />
                  Blok ekle
                </button>
              </div>

              <div className="space-y-3 p-3">
                {form.sections.map((section, index) => (
                  <div key={section.id} className="rounded-lg border border-background-200 bg-background-100/60 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-background-50 text-[11px] font-bold text-foreground-600">
                        {index + 1}
                      </span>
                      <p className="min-w-0 flex-1 truncate text-[11px] font-semibold text-foreground-600">
                        {section.heading || "Başlıksız blok"}
                      </p>
                      <button
                        type="button"
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        aria-label="Bloğu yukarı taşı"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <i className="ri-arrow-up-line" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(index, 1)}
                        disabled={index === form.sections.length - 1}
                        aria-label="Bloğu aşağı taşı"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <i className="ri-arrow-down-line" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        disabled={form.sections.length === 1}
                        aria-label="Bloğu sil"
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-50 hover:text-secondary-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <i className="ri-delete-bin-6-line" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        value={section.heading}
                        onChange={(event) => updateSection(section.id, { heading: event.target.value.slice(0, 160) })}
                        placeholder="Blok başlığı"
                        className={inputClass}
                      />
                      <textarea
                        value={section.body}
                        onChange={(event) => updateSection(section.id, { body: event.target.value.slice(0, 6000) })}
                        rows={3}
                        placeholder="Paragraf metni..."
                        className={`${textareaClass} resize-y`}
                      />
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <input
                          value={section.image}
                          onChange={(event) => updateSection(section.id, { image: event.target.value })}
                          placeholder="Görsel bağlantısı (isteğe bağlı)"
                          className={inputClass}
                        />
                        <textarea
                          value={section.bullets.join("\n")}
                          onChange={(event) => updateSection(section.id, { bullets: event.target.value.split("\n") })}
                          rows={2}
                          placeholder={"Madde listesi (her satır bir madde)"}
                          className={`${textareaClass} resize-none text-xs`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Yayın durumu">
                <div className="flex gap-1 rounded-lg bg-background-100 p-1">
                  {[
                    { id: "draft" as const, label: "Taslak", icon: "ri-draft-line" },
                    { id: "published" as const, label: "Yayında", icon: "ri-global-line" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => patch({ status: item.id })}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium ${
                        form.status === item.id
                          ? "bg-background-50 text-foreground-950 shadow-sm"
                          : "text-foreground-600 hover:text-foreground-900"
                      }`}
                    >
                      <i className={`${item.icon} text-sm`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Sıralama" hint="Küçük sayı önce görünür.">
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => patch({ sortOrder: Number(event.target.value) })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="rounded-lg border border-background-200 p-3">
              <Toggle
                checked={form.showInFooter}
                onChange={(value) => patch({ showInFooter: value })}
                label="Footer'da bağlantı olarak göster"
                description="Sayfa yayındayken alt bilgideki bağlantı satırına eklenir."
              />
            </div>

            <Field label="SEO başlığı" hint="Arama sonuçlarında görünen başlık. Boş bırakılırsa sayfa başlığı kullanılır.">
              <input
                value={form.seoTitle}
                onChange={(event) => patch({ seoTitle: event.target.value.slice(0, 160) })}
                placeholder={form.title || "Sayfa başlığı"}
                className={inputClass}
              />
            </Field>

            <Field label="SEO açıklaması" hint="120-160 karakter arası öneririz.">
              <textarea
                value={form.seoDescription}
                onChange={(event) => patch({ seoDescription: event.target.value.slice(0, 320) })}
                rows={3}
                placeholder={form.subtitle || "Sayfanın kısa açıklaması"}
                className={`${textareaClass} resize-none`}
              />
              <span className="mt-1 block text-right text-[10px] text-foreground-400">
                {form.seoDescription.length}/320
              </span>
            </Field>

            {form.status === "published" && (
              <Banner tone="info">
                Sayfa kaydedildiğinde <strong className="font-semibold">/sayfa/{slugPreview}</strong> adresinde yayında olur.
              </Banner>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}