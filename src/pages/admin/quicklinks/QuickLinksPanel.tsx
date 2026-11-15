import { useEffect, useMemo, useState } from "react";
import { Banner, Panel, Pill } from "@/components/base/AdminUI";
import QuickLinkEditorRow from "@/pages/admin/quicklinks/QuickLinkEditorRow";
import type { QuickLinkOption } from "@/pages/admin/quicklinks/QuickLinkEditorRow";
import { QuickLinkBadge } from "@/components/layout/QuickLinksStrip";
import { useStoreCategories } from "@/hooks/useStoreCategories";
import { collections, collectionKeys } from "@/lib/collections";
import {
  fetchQuickLinks,
  getQuickLinks,
  normalizeQuickLinks,
  saveQuickLinks,
  visibleQuickLinks,
} from "@/lib/quickLinks";
import type { QuickLinkItem, QuickLinksSettings } from "@/types/quickLink";

const newItemId = (): string => `ql-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

export default function QuickLinksPanel() {
  const [saved, setSaved] = useState<QuickLinksSettings>(() => getQuickLinks());
  const [draft, setDraft] = useState<QuickLinksSettings>(saved);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const { flat } = useStoreCategories();

  useEffect(() => {
    let active = true;
    void fetchQuickLinks().then((next) => {
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
  const activeCount = visibleQuickLinks(draft).length;

  const collectionOptions = useMemo<QuickLinkOption[]>(
    () =>
      collectionKeys.map((key) => ({
        value: key,
        label: `${collections[key].label} – ${collections[key].description.slice(0, 42)}...`,
      })),
    [],
  );

  const categoryOptions = useMemo<QuickLinkOption[]>(
    () =>
      flat.map((node) => ({
        value: node.slug,
        label: `${node.parent ? "› " : ""}${node.name}`,
      })),
    [flat],
  );

  const patchItem = (id: string, changes: Partial<QuickLinkItem>) => {
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
    setToast("");
  };

  const addItem = () => {
    const item: QuickLinkItem = {
      id: newItemId(),
      label: "Yeni Kısayol",
      imageUrl: "",
      icon: "ri-flashlight-line",
      targetType: "koleksiyon",
      target: collectionKeys[0] ?? "gunun",
      active: true,
    };
    setDraft((current) => ({ ...current, items: [...current.items, item] }));
    setToast("");
  };

  const removeItem = (id: string) => {
    setDraft((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
    setToast("");
  };

  const moveItem = (id: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.items.findIndex((item) => item.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.items.length) return current;
      const items = [...current.items];
      [items[index], items[target]] = [items[target], items[index]];
      return { ...current, items };
    });
    setToast("");
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    const result = await saveQuickLinks(draft);
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? "Kısayollar kaydedilemedi.");
      return;
    }
    const next = getQuickLinks();
    setSaved(next);
    setDraft(next);
    setToast("Kısayollar kaydedildi. Menü üstündeki şerit tüm cihazlarda aynı görünecek.");
    window.setTimeout(() => setToast(""), 3500);
  };

  const reset = () => {
    setDraft(saved);
    setError("");
    setToast("Değişiklikler geri alındı.");
    window.setTimeout(() => setToast(""), 2500);
  };

  const restoreDefaults = () => {
    setDraft(normalizeQuickLinks(null));
    setToast("Varsayılan kısayollar geri yüklendi. Kaydetmeyi unutmayın.");
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
          Sunucudaki güncel kısayollar yükleniyor...
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel
            title="Menü Üstü Kısayollar"
            subtitle="Yuvarlak rozetler, adları ve gidecekleri sayfa"
            icon="ri-layout-top-line"
            action={
              <button
                type="button"
                onClick={addItem}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Kısayol Ekle
              </button>
            }
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Pill tone="info">
                <i className="ri-list-ordered" />
                {draft.items.length} kısayol
              </Pill>
              <Pill tone={activeCount > 0 ? "success" : "warning"}>
                <i className="ri-eye-line" />
                {activeCount} yayında
              </Pill>
              <span className="text-[11px] text-foreground-500">
                Sıra, mağazadaki soldan sağa dizilişi belirler.
              </span>
            </div>

            <div className="space-y-2.5">
              {draft.items.map((item, index) => (
                <QuickLinkEditorRow
                  key={item.id}
                  item={item}
                  index={index}
                  total={draft.items.length}
                  collectionOptions={collectionOptions}
                  categoryOptions={categoryOptions}
                  onChange={(changes) => patchItem(item.id, changes)}
                  onRemove={() => removeItem(item.id)}
                  onMove={(direction) => moveItem(item.id, direction)}
                />
              ))}
            </div>

            {draft.items.length === 0 && (
              <Banner tone="warning">
                Hiç kısayol yok. Şeridin mağazada görünmesi için en az bir kısayol ekleyip kaydedin.
              </Banner>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Canlı Önizleme" subtitle="Kaydettiğinizde şerit bu şekilde görünür" icon="ri-eye-line">
            <div className="rounded-lg border border-background-200 bg-background-50 p-2">
              <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">
                Menü üstü şerit
              </p>
              <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
                {visibleQuickLinks(draft).map((item) => (
                  <div key={item.id} className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 px-0.5 py-1.5">
                    <QuickLinkBadge item={item} />
                    <span className="line-clamp-2 h-7 text-center text-[11px] leading-[14px] text-foreground-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              {activeCount === 0 && (
                <p className="px-1 py-4 text-center text-[11px] text-foreground-500">
                  Yayında kısayol yok, şerit mağazada gizlenir.
                </p>
              )}
            </div>

            <div className="mt-3 space-y-1.5">
              {draft.items.map((item) => (
                <div
                  key={`row-${item.id}`}
                  className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-2.5 py-1.5"
                >
                  <i className={`${item.active ? "ri-checkbox-circle-fill text-accent-600" : "ri-checkbox-blank-circle-line text-foreground-400"} text-xs`} />
                  <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-foreground-800">{item.label}</span>
                  <span className="shrink-0 text-[10px] text-foreground-500">
                    {item.targetType === "koleksiyon"
                      ? collections[item.target as keyof typeof collections]?.label ?? item.target
                      : item.targetType === "kategori"
                        ? "Kategori"
                        : "Adres"}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Kısa Bilgi" icon="ri-information-line">
            <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Rozet görselleri kare olduğunda en iyi görünür; şerit görseli otomatik olarak yuvarlak kırpar.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Görsel yüklemezseniz aynı boyutta ikon gösterilir, şerit yine düzenli kalır.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Koleksiyon seçtiğinizde ürünler otomatik listelenir; yeni ürünler kendiliğinden dahil olur.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Kaydettiğinizde bilgiler Supabase'e yazılır, farklı cihaz ve tarayıcılarda aynı şerit görünür.
              </li>
            </ul>
            <button
              type="button"
              onClick={restoreDefaults}
              className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-background-200 bg-background-100 px-3 py-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
            >
              Varsayılan kısayolları geri yükle
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
            {saving ? "Kaydediliyor..." : "Kısayolları Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}