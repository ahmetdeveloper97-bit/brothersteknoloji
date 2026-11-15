import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Banner, Field, Panel, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import ShowcaseProductPicker from "@/pages/admin/showcase/components/ShowcaseProductPicker";
import { products } from "@/lib/catalog";
import {
  SHOWCASE_META,
  SHOWCASE_PATHS,
  createShowcaseImage,
  fetchShowcasePages,
  getShowcasePage,
  saveShowcasePage,
} from "@/lib/showcasePages";
import type { Product } from "@/types/store";
import type { ShowcasePageKey, ShowcasePageSettings } from "@/types/showcasePage";
import { clockLabel, getNightWindow } from "@/lib/nightDeals";

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

const catalogById = new Map((products as Product[]).map((product) => [product.id, product]));

interface ShowcasePanelProps {
  pageKey: ShowcasePageKey;
}

export default function ShowcasePanel({ pageKey }: ShowcasePanelProps) {
  const meta = SHOWCASE_META[pageKey];
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState<ShowcasePageSettings>(() => getShowcasePage(pageKey));
  const [busyImage, setBusyImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: "success" | "danger"; text: string } | null>(null);

  useEffect(() => {
    let active = true;
    void fetchShowcasePages().then(() => {
      if (active) setDraft(getShowcasePage(pageKey));
    });
    return () => {
      active = false;
    };
  }, [pageKey]);

  const patch = (changes: Partial<ShowcasePageSettings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setStatus(null);
  };

  const selectedProducts = useMemo(
    () => draft.productIds.map((id) => catalogById.get(id)).filter((product): product is Product => Boolean(product)),
    [draft.productIds],
  );

  const toggleProduct = (id: string) => {
    setStatus(null);
    setDraft((current) =>
      current.productIds.includes(id)
        ? { ...current, productIds: current.productIds.filter((item) => item !== id) }
        : { ...current, productIds: [...current.productIds, id] },
    );
  };

  const moveProduct = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= draft.productIds.length) return;
    const next = [...draft.productIds];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    patch({ productIds: next });
  };

  const removeProduct = (id: string) => {
    patch({ productIds: draft.productIds.filter((item) => item !== id) });
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusyImage(true);
    setStatus(null);
    try {
      const dataUrl = await createShowcaseImage(file);
      patch({ imageUrl: dataUrl });
    } catch (error) {
      setStatus({
        tone: "danger",
        text: error instanceof Error ? error.message : "Görsel yüklenemedi.",
      });
    } finally {
      setBusyImage(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const result = await saveShowcasePage(pageKey, draft);
    setSaving(false);
    if (result.ok) {
      setStatus({ tone: "success", text: `${meta.label} sayfası kaydedildi ve mağazada güncellendi.` });
      return;
    }
    setStatus({ tone: "danger", text: result.message ?? "Sayfa kaydedilemedi." });
  };

  const night = getNightWindow(draft);
  const scheduleOn = draft.scheduleEnabled !== false;

  return (
    <div className="space-y-4">
      <Panel
        title={`${meta.label} sayfası`}
        subtitle={meta.hint}
        icon={meta.icon}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={SHOWCASE_PATHS[pageKey]}
              className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 py-2 text-xs font-semibold text-foreground-700 hover:bg-background-100"
            >
              <i className="ri-external-link-line" />
              Sayfayı gör
            </Link>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 py-2 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-3-line"} />
              {saving ? "Kaydediliyor" : "Kaydet"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {status && <Banner tone={status.tone}>{status.text}</Banner>}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="min-w-0">
              <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-foreground-700">
                Üst görsel önizlemesi
              </span>
              <div className="relative h-[120px] w-full overflow-hidden rounded-xl border border-background-200 bg-foreground-950">
                {draft.imageUrl && (
                  <img
                    src={draft.imageUrl}
                    alt="Vitrin üst görseli"
                    className="h-full w-full object-cover object-top"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-foreground-950/90 via-foreground-950/60 to-transparent" />
                <div className="relative flex h-full flex-col justify-center gap-1 px-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-background-200">Vitrin</span>
                  <span className="line-clamp-2 font-heading text-sm font-bold leading-snug text-background-50">
                    {draft.title || meta.label}
                  </span>
                </div>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-500">
                Önerilen ölçü 1600 × 480 piksel. Yüklediğiniz görsel otomatik olarak bu ölçüye kırpılır.
              </p>
            </div>

            <div className="min-w-0 space-y-3">
              <Field label="Sayfa başlığı">
                <input
                  value={draft.title}
                  onChange={(event) => patch({ title: event.target.value })}
                  className={inputClass}
                  maxLength={60}
                  placeholder={meta.label}
                />
              </Field>

              <Field label="Kısa açıklama" hint="Başlığın altında görünen 1-2 cümlelik tanıtım metni.">
                <textarea
                  value={draft.description}
                  onChange={(event) => patch({ description: event.target.value })}
                  className={`${textareaClass} box-border`}
                  rows={2}
                  maxLength={200}
                  placeholder="Bu vitrinde hangi ürünler yer alıyor?"
                />
              </Field>

              <Field label="Üst görsel" hint="Bilgisayarınızdan yükleyebilir veya bir görsel adresi yazabilirsiniz.">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    value={draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl}
                    onChange={(event) => patch({ imageUrl: event.target.value })}
                    className={`${inputClass} min-w-0`}
                    placeholder={draft.imageUrl.startsWith("data:") ? "Yüklenen görsel kullanılıyor" : "https://..."}
                  />
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={busyImage}
                      className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <i className={busyImage ? "ri-loader-4-line animate-spin" : "ri-upload-2-line"} />
                      {busyImage ? "Yükleniyor" : "Görsel Yükle"}
                    </button>
                    {draft.imageUrl && (
                      <button
                        type="button"
                        onClick={() => patch({ imageUrl: "" })}
                        aria-label="Görseli kaldır"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                      >
                        <i className="ri-delete-bin-6-line" />
                      </button>
                    )}
                  </div>
                </div>
              </Field>

              <div className="rounded-lg border border-background-200 bg-background-100 px-3 py-2.5">
                <Toggle
                  checked={draft.active}
                  onChange={(value) => patch({ active: value })}
                  label="Sayfa yayında"
                  description="Kapalıysa ziyaretçiler ürünler yerine 'yayında değil' bilgisini görür."
                />
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => void handleFile(event)}
            className="hidden"
          />
        </div>
      </Panel>

      {pageKey === "gece" && (
        <Panel
          title="Gece saatleri"
          subtitle="Bu sayfadaki ürünlerin hangi saat aralığında satışa açılacağını belirleyin."
          icon="ri-time-line"
          action={
            <Pill tone={scheduleOn ? (night.open ? "success" : "warning") : "info"}>
              <i className={scheduleOn ? (night.open ? "ri-moon-clear-line" : "ri-lock-2-line") : "ri-infinity-line"} />
              {scheduleOn ? (night.open ? "Şu anda açık" : "Şu anda kapalı") : "Saat kuralı kapalı"}
            </Pill>
          }
        >
          <div className="space-y-4">
            <div className="rounded-lg border border-background-200 bg-background-100 px-3 py-2.5">
              <Toggle
                checked={scheduleOn}
                onChange={(value) => patch({ scheduleEnabled: value })}
                label="Saat kuralını uygula"
                description="Açıkken ürünler yalnızca seçilen saat aralığında görünür. Kapalıyken gece indirimi gün boyu yayında kalır."
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Başlangıç saati" hint="Ürünler ve indirimli fiyatlar bu saatte açılır.">
                <input
                  type="time"
                  value={clockLabel(draft.startTime, "23:59")}
                  onChange={(event) => patch({ startTime: event.target.value })}
                  disabled={!scheduleOn}
                  className={`${inputClass} ${scheduleOn ? "" : "cursor-not-allowed bg-background-100 text-foreground-400"}`}
                />
              </Field>
              <Field label="Bitiş saati" hint="Bu saatte gece indirimi otomatik kapanır.">
                <input
                  type="time"
                  value={clockLabel(draft.endTime, "06:00")}
                  onChange={(event) => patch({ endTime: event.target.value })}
                  disabled={!scheduleOn}
                  className={`${inputClass} ${scheduleOn ? "" : "cursor-not-allowed bg-background-100 text-foreground-400"}`}
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-foreground-500">Hazır aralıklar:</span>
              {[
                { start: "23:59", end: "06:00", label: "23:59 – 06:00" },
                { start: "00:00", end: "06:00", label: "00:00 – 06:00" },
                { start: "22:00", end: "08:00", label: "22:00 – 08:00" },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => patch({ startTime: preset.start, endTime: preset.end, scheduleEnabled: true })}
                  className="cursor-pointer whitespace-nowrap rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-medium text-foreground-700 hover:border-primary-300 hover:text-foreground-950"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2.5 text-[11px] leading-relaxed text-foreground-600">
              <i className="ri-information-line mt-0.5 text-primary-700" />
              <span>
                Saat aralığının dışında ziyaretçiler ürünleri ve indirimli fiyatları görmez; sayfada açılış saatine
                geri sayan bir bilgi ekranı gösterilir. Saatler Türkiye saatine göre ziyaretçinin cihazında hesaplanır.
              </span>
            </div>
          </div>
        </Panel>
      )}

      <Panel
        title="Ürün seçimi"
        subtitle="Sayfada yalnızca burada seçtiğiniz ürünler görünür. Sıralama sayfadaki dizilişi belirler."
        icon="ri-shopping-bag-3-line"
        action={<Pill tone="info">{draft.productIds.length} ürün seçili</Pill>}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ShowcaseProductPicker selectedIds={draft.productIds} onToggle={toggleProduct} />

          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-foreground-700">Seçilen ürünler ve sıralama</p>
              {draft.productIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => patch({ productIds: [] })}
                  className="cursor-pointer whitespace-nowrap text-[11px] font-semibold text-foreground-500 hover:text-foreground-900"
                >
                  Tümünü temizle
                </button>
              )}
            </div>

            <div className="max-h-[420px] space-y-1 overflow-y-auto rounded-lg border border-background-200 bg-background-100 p-1.5">
              {selectedProducts.length === 0 && (
                <p className="px-2 py-8 text-center text-xs leading-relaxed text-foreground-500">
                  Henüz ürün seçilmedi. Soldaki listeden ürünlere tıklayarak ekleyin.
                </p>
              )}
              {selectedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 rounded-lg bg-background-50 px-2 py-2"
                >
                  <span className="w-4 shrink-0 text-center text-[11px] font-bold text-foreground-400">
                    {index + 1}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-background-200 bg-background-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover object-top" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-foreground-900">{product.name}</span>
                    <span className="mt-0.5 block text-[11px] text-foreground-500">
                      {money(product.price)} ₺
                      {!product.inStock && <span className="ml-1.5 text-foreground-400">(stok yok)</span>}
                    </span>
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveProduct(index, -1)}
                      disabled={index === 0}
                      aria-label="Yukarı taşı"
                      className={`flex h-7 w-7 items-center justify-center rounded-md border border-background-300 ${
                        index === 0
                          ? "cursor-not-allowed text-foreground-300"
                          : "cursor-pointer text-foreground-600 hover:bg-background-100"
                      }`}
                    >
                      <i className="ri-arrow-up-line text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProduct(index, 1)}
                      disabled={index === selectedProducts.length - 1}
                      aria-label="Aşağı taşı"
                      className={`flex h-7 w-7 items-center justify-center rounded-md border border-background-300 ${
                        index === selectedProducts.length - 1
                          ? "cursor-not-allowed text-foreground-300"
                          : "cursor-pointer text-foreground-600 hover:bg-background-100"
                      }`}
                    >
                      <i className="ri-arrow-down-line text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      aria-label="Ürünü çıkar"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                    >
                      <i className="ri-close-line text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-foreground-500">
              Değişikliklerin mağazada görünmesi için sağ üstteki Kaydet düğmesine basın.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}