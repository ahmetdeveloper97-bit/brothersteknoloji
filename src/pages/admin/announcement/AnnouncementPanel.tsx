import { useEffect, useMemo, useState } from "react";
import { Banner, Panel, Pill } from "@/components/base/AdminUI";
import {
  ANNOUNCEMENT_MAX_LENGTH,
  announcementLine,
  fetchAnnouncementSettings,
  getAnnouncementSettings,
  normalizeAnnouncementSettings,
  saveAnnouncementSettings,
} from "@/lib/announcementSettings";
import type { AnnouncementItem, AnnouncementSettings } from "@/types/announcement";

const newItemId = (): string =>
  `ann-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

export default function AnnouncementPanel() {
  const [saved, setSaved] = useState<AnnouncementSettings>(() => getAnnouncementSettings());
  const [draft, setDraft] = useState<AnnouncementSettings>(saved);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetchAnnouncementSettings().then((next) => {
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
  const activeItem = draft.items.find((item) => item.active && item.text.trim().length > 0) ?? null;
  const previewLine = announcementLine(draft);

  const patchItem = (id: string, changes: Partial<AnnouncementItem>) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
    setToast("");
  };

  /** Yalnızca bir metin yayında olur: seçilen aktif, diğerleri pasif. */
  const activateItem = (id: string) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => ({ ...item, active: item.id === id })),
    }));
    setToast("");
  };

  const hideBar = () => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => ({ ...item, active: false })),
    }));
    setToast("");
  };

  const addItem = () => {
    const item: AnnouncementItem = {
      id: newItemId(),
      text: "",
      active: false,
    };
    setDraft((current) => ({ ...current, items: [...current.items, item] }));
    setToast("");
  };

  const removeItem = (id: string) => {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
    setToast("");
  };

  const save = async () => {
    if (saving) return;
    const tooLong = draft.items.find((item) => item.text.trim().length > ANNOUNCEMENT_MAX_LENGTH);
    if (tooLong) {
      setError(`Her metin en fazla ${ANNOUNCEMENT_MAX_LENGTH} karakter olabilir. Lütfen kısaltın.`);
      return;
    }
    setSaving(true);
    setError("");
    const result = await saveAnnouncementSettings(draft);
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? "Duyuru şeridi kaydedilemedi.");
      return;
    }
    const next = getAnnouncementSettings();
    setSaved(next);
    setDraft(next);
    setToast("Duyuru şeridi kaydedildi. Seçtiğiniz metin mağazanın üstünde kayarak görünecek.");
    window.setTimeout(() => setToast(""), 3500);
  };

  const reset = () => {
    setDraft(saved);
    setError("");
    setToast("Değişiklikler geri alındı.");
    window.setTimeout(() => setToast(""), 2500);
  };

  const restoreDefaults = () => {
    setDraft(normalizeAnnouncementSettings(null));
    setToast("Varsayılan duyurular geri yüklendi. Kaydetmeyi unutmayın.");
    window.setTimeout(() => setToast(""), 3000);
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
        <div className="flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2.5 text-xs text-secondary-950">
          <i className="ri-error-warning-line mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2.5 text-xs text-foreground-600">
          <i className="ri-loader-4-line animate-spin" />
          Sunucudaki güncel duyurular yükleniyor...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel
            title="Üst Duyuru Şeridi"
            subtitle="Menünün üstünde kayarak geçen yazıyı yönetin"
            icon="ri-notification-3-line"
            action={
              <button
                type="button"
                onClick={addItem}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Yeni Metin Ekle
              </button>
            }
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Pill tone="info">
                <i className="ri-list-ordered" />
                {draft.items.length} metin
              </Pill>
              <Pill tone={activeItem ? "success" : "warning"}>
                <i className="ri-eye-line" />
                {activeItem ? "Yayında" : "Şerit kapalı"}
              </Pill>
              <span className="text-[11px] text-foreground-500">
                Aynı anda yalnızca bir metin geçerli olur.
              </span>
            </div>

            <div className="space-y-2.5">
              {draft.items.map((item, index) => {
                const isActive = item.id === activeItem?.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      isActive
                        ? "border-accent-400 bg-accent-50/60"
                        : "border-background-200 bg-background-50"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => activateItem(item.id)}
                        aria-pressed={isActive}
                        className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          isActive
                            ? "bg-accent-600 text-background-50"
                            : "border border-background-300 bg-background-100 text-foreground-600 hover:bg-background-200"
                        }`}
                      >
                        <i className={isActive ? "ri-radio-button-line" : "ri-checkbox-blank-circle-line"} />
                        {isActive ? "Yayında" : "Yayınla"}
                      </button>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">
                        Metin {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Metni sil"
                        className="ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-secondary-100 hover:text-secondary-800"
                      >
                        <i className="ri-delete-bin-line text-sm" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.text}
                      maxLength={ANNOUNCEMENT_MAX_LENGTH}
                      onChange={(event) => patchItem(item.id, { text: event.target.value })}
                      placeholder="Örn. 500 TL üzeri kargo bedava"
                      className="w-full rounded-lg border border-background-300 bg-background-50 px-3 py-2 text-xs text-foreground-900 outline-none focus:border-primary-500"
                    />
                    <p className="mt-1 text-[10px] text-foreground-400">
                      {item.text.trim().length}/{ANNOUNCEMENT_MAX_LENGTH} karakter
                    </p>
                  </div>
                );
              })}
            </div>

            {draft.items.length === 0 && (
              <Banner tone="warning">
                Hiç metin yok. Şeridin mağazada görünmesi için bir metin ekleyip yayınlayın.
              </Banner>
            )}

            {draft.items.length > 0 && (
              <button
                type="button"
                onClick={hideBar}
                className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-background-200 bg-background-100 px-3 py-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
              >
                Şeridi tamamen gizle (hiçbir metni yayınlama)
                <i className="ri-eye-off-line" />
              </button>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Canlı Önizleme" subtitle="Kaydettiğinizde mağazada bu şekilde görünür" icon="ri-eye-line">
            <div className="overflow-hidden rounded-lg border border-background-200">
              <div className="flex h-9 items-center overflow-hidden bg-primary-900 text-primary-50">
                {previewLine ? (
                  <div className="animate-marquee inline-flex whitespace-nowrap">
                    <span className="px-2 text-[13px] font-medium tracking-wide">
                      {previewLine.repeat(4)}
                    </span>
                    <span className="px-2 text-[13px] font-medium tracking-wide">
                      {previewLine.repeat(4)}
                    </span>
                  </div>
                ) : (
                  <span className="px-3 text-[12px] text-primary-200">Şerit gizli</span>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-1.5">
              {draft.items.map((item) => (
                <div
                  key={`row-${item.id}`}
                  className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-2.5 py-1.5"
                >
                  <i
                    className={`${
                      item.id === activeItem?.id
                        ? "ri-checkbox-circle-fill text-accent-600"
                        : "ri-checkbox-blank-circle-line text-foreground-400"
                    } text-xs`}
                  />
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground-800">
                    {item.text.trim() || "(boş metin)"}
                  </span>
                </div>
              ))}
              {draft.items.length === 0 && (
                <p className="px-1 py-2 text-center text-[11px] text-foreground-500">
                  Henüz metin eklenmedi.
                </p>
              )}
            </div>
          </Panel>

          <Panel title="Kısa Bilgi" icon="ri-information-line">
            <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Metinleri burada saklayabilir, dilediğiniz zaman tek tıkla aralarında geçiş yapabilirsiniz.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Uzun metinler kayarak geçtiği için kısa ve vurucu tutmanız daha okunur olur.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Kaydettiğinizde bilgiler Supabase'e yazılır; tüm cihazlarda aynı şerit görünür.
              </li>
            </ul>
            <button
              type="button"
              onClick={restoreDefaults}
              className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-background-200 bg-background-100 px-3 py-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
            >
              Varsayılan metinleri geri yükle
              <i className="ri-history-line" />
            </button>
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
              dirty
                ? "cursor-pointer text-foreground-700 hover:bg-background-100"
                : "cursor-not-allowed text-foreground-400"
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
            {saving ? "Kaydediliyor..." : "Duyuruyu Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}