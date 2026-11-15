import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Field, Pill, Toggle, inputClass } from "@/components/base/AdminUI";
import { QUICK_LINK_TARGET_LABELS, createQuickLinkImage } from "@/lib/quickLinks";
import { QuickLinkBadge } from "@/components/layout/QuickLinksStrip";
import type { QuickLinkItem, QuickLinkTargetType } from "@/types/quickLink";

export interface QuickLinkOption {
  value: string;
  label: string;
}

interface QuickLinkEditorRowProps {
  item: QuickLinkItem;
  index: number;
  total: number;
  collectionOptions: QuickLinkOption[];
  categoryOptions: QuickLinkOption[];
  onChange: (changes: Partial<QuickLinkItem>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}

export default function QuickLinkEditorRow({
  item,
  index,
  total,
  collectionOptions,
  categoryOptions,
  onChange,
  onRemove,
  onMove,
}: QuickLinkEditorRowProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const dataUrl = await createQuickLinkImage(file);
      onChange({ imageUrl: dataUrl });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi.");
    } finally {
      setBusy(false);
    }
  };

  const options = item.targetType === "kategori" ? categoryOptions : collectionOptions;
  const knownTarget = options.some((option) => option.value === item.target);

  return (
    <div className="rounded-xl border border-background-200 bg-background-100 p-3">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="flex shrink-0 items-start gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <QuickLinkBadge item={item} />
            <span className="text-[10px] font-semibold text-foreground-400">#{index + 1}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 lg:hidden">
            <Pill tone={item.active ? "success" : "neutral"}>{item.active ? "Yayında" : "Gizli"}</Pill>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field label="Kısayol adı">
              <input
                value={item.label}
                onChange={(event) => onChange({ label: event.target.value })}
                className={inputClass}
                maxLength={40}
                placeholder="Örn. Günün Ürünleri"
              />
            </Field>

            <Field label="Bağlantı türü">
              <select
                value={item.targetType}
                onChange={(event) => {
                  const targetType = event.target.value as QuickLinkTargetType;
                  const first =
                    targetType === "kategori"
                      ? categoryOptions[0]?.value ?? ""
                      : targetType === "koleksiyon"
                        ? collectionOptions[0]?.value ?? ""
                        : "/kategoriler";
                  onChange({ targetType, target: first });
                }}
                className={inputClass}
              >
                {(Object.keys(QUICK_LINK_TARGET_LABELS) as QuickLinkTargetType[]).map((type) => (
                  <option key={type} value={type}>
                    {QUICK_LINK_TARGET_LABELS[type]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label={item.targetType === "adres" ? "Adres" : item.targetType === "kategori" ? "Kategori" : "Vitrin koleksiyonu"}
            hint={
              item.targetType === "adres"
                ? "Site içi adres / ile başlar (örn. /kategoriler). Dış adres için https:// ile tam yazın."
                : "Vitrin koleksiyonları kendi sayfalarına gider. Ürünleri menüdeki Günün / Haftanın / Kampanya / Avantajlı ekranlarından seçersiniz."
            }
          >
            {item.targetType === "adres" ? (
              <input
                value={item.target}
                onChange={(event) => onChange({ target: event.target.value })}
                className={inputClass}
                placeholder="/kategoriler"
              />
            ) : (
              <select
                value={knownTarget ? item.target : ""}
                onChange={(event) => onChange({ target: event.target.value })}
                className={inputClass}
              >
                {!knownTarget && <option value="">{item.target || "Seçim yapın"}</option>}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Rozet görseli" hint="Kare görseller en iyi sonucu verir. Yüklemezseniz yerine ikon gösterilir.">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={item.imageUrl.startsWith("data:") ? "" : item.imageUrl}
                onChange={(event) => onChange({ imageUrl: event.target.value })}
                className={inputClass}
                placeholder={item.imageUrl.startsWith("data:") ? "Yüklenen görsel kullanılıyor" : "https://..."}
              />
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                  className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <i className={busy ? "ri-loader-4-line animate-spin" : "ri-upload-2-line"} />
                  {busy ? "Yükleniyor" : "Görsel Yükle"}
                </button>
                {item.imageUrl && (
                  <button
                    type="button"
                    onClick={() => onChange({ imageUrl: "" })}
                    aria-label="Görseli kaldır"
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                )}
              </div>
            </div>
          </Field>

          <Field label="Görsel yoksa kullanılacak ikon" hint="Remix Icon adı. Örn. ri-sun-line, ri-gamepad-line">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-background-300 bg-background-50 text-foreground-700">
                <i className={`${item.icon} text-lg`} />
              </span>
              <input
                value={item.icon}
                onChange={(event) => onChange({ icon: event.target.value })}
                className={inputClass}
                placeholder="ri-flashlight-line"
              />
            </div>
          </Field>

          {error && (
            <p className="flex items-start gap-1.5 rounded-lg border border-secondary-300 bg-secondary-50 px-2.5 py-2 text-[11px] leading-relaxed text-secondary-950">
              <i className="ri-error-warning-line mt-0.5" />
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-background-200 pt-2.5">
            <div className="min-w-0 flex-1">
              <Toggle
                checked={item.active}
                onChange={(value) => onChange({ active: value })}
                label="Mağazada göster"
                description="Kapalıysa kısayol menü üstünde görünmez."
              />
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onMove(-1)}
                disabled={index === 0}
                aria-label="Sola taşı"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border border-background-300 ${
                  index === 0 ? "cursor-not-allowed text-foreground-300" : "cursor-pointer text-foreground-600 hover:bg-background-200"
                }`}
              >
                <i className="ri-arrow-left-line" />
              </button>
              <button
                type="button"
                onClick={() => onMove(1)}
                disabled={index === total - 1}
                aria-label="Sağa taşı"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border border-background-300 ${
                  index === total - 1
                    ? "cursor-not-allowed text-foreground-300"
                    : "cursor-pointer text-foreground-600 hover:bg-background-200"
                }`}
              >
                <i className="ri-arrow-right-line" />
              </button>
              <button
                type="button"
                onClick={onRemove}
                aria-label="Kısayolu sil"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-200 hover:text-foreground-950"
              >
                <i className="ri-delete-bin-line" />
              </button>
            </div>
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
  );
}