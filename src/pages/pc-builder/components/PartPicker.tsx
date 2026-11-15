import { useEffect, useMemo, useState } from "react";
import type { PcPart, PcSelection, PcSlot } from "@/types/pcBuilder";
import { incompatibilityReason, partsOfSlot } from "@/lib/pcBuilder";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

interface PartPickerProps {
  slot: PcSlot;
  selection: PcSelection;
  onPick: (partId: string) => void;
}

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

export default function PartPicker({ slot, selection, onPick }: PartPickerProps) {
  const parts = useMemo(() => partsOfSlot(slot.id), [slot.id]);
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState<SortKey>("recommended");

  useEffect(() => {
    setBrand("all");
    setSort("recommended");
  }, [slot.id]);

  const brands = useMemo(() => {
    const map = new Map<string, number>();
    parts.forEach((part) => map.set(part.brand, (map.get(part.brand) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [parts]);

  const list = useMemo(() => {
    let items = brand === "all" ? parts : parts.filter((part) => part.brand === brand);
    items = [...items];
    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items.sort((a, b) => b.price - a.price);
    if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    return items;
  }, [parts, brand, sort]);

  return (
    <section className="rounded-2xl border border-background-200 bg-background-50 p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-background-200 pb-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <i className={`${slot.icon} text-lg`} />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950 md:text-xl">
              {slot.name} seçimi
            </h2>
            <p className="mt-0.5 text-xs text-foreground-600">{slot.hint}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-foreground-600">
            <span className="hidden sm:inline">Sırala:</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-900 outline-none focus:border-primary-500"
            >
              <option value="recommended">Önerilen</option>
              <option value="price-asc">Fiyat (Artan)</option>
              <option value="price-desc">Fiyat (Azalan)</option>
              <option value="rating">Puan</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setBrand("all")}
          className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            brand === "all"
              ? "bg-primary-700 text-background-50"
              : "bg-background-100 text-foreground-700 hover:bg-background-200"
          }`}
        >
          Tüm markalar
          <span className="ml-1 text-[10px] opacity-70">{parts.length}</span>
        </button>
        {brands.map(([name, count]) => (
          <button
            key={name}
            type="button"
            onClick={() => setBrand(name)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              brand === name
                ? "bg-primary-700 text-background-50"
                : "bg-background-100 text-foreground-700 hover:bg-background-200"
            }`}
          >
            {name}
            <span className="ml-1 text-[10px] opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {list.map((part) => {
          const selected = selection[slot.id] === part.id;
          const reason = incompatibilityReason(part, selection);
          const blocked = Boolean(reason) && !selected;
          return (
            <PartRow
              key={part.id}
              part={part}
              selected={selected}
              blocked={blocked}
              reason={reason}
              onPick={() => onPick(part.id)}
            />
          );
        })}
        {list.length === 0 && (
          <p className="rounded-xl border border-dashed border-background-300 px-4 py-10 text-center text-sm text-foreground-500">
            Bu markada ürün bulunmuyor.
          </p>
        )}
      </div>
    </section>
  );
}

interface PartRowProps {
  part: PcPart;
  selected: boolean;
  blocked: boolean;
  reason: string | null;
  onPick: () => void;
}

function PartRow({ part, selected, blocked, reason, onPick }: PartRowProps) {
  return (
    <div
      className={`flex gap-3 rounded-xl border p-3 transition-colors ${
        selected
          ? "border-primary-500 bg-primary-50"
          : blocked
            ? "border-background-200 bg-background-100 opacity-80"
            : "border-background-200 bg-background-50 hover:border-primary-300"
      }`}
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-background-200 bg-background-100">
        <img src={part.image} alt={part.name} title={part.name} className="h-full w-full object-cover object-top" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-secondary-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-900">
            {part.brand}
          </span>
          {part.tags.slice(0, 1).map((tag) => (
            <span
              key={tag.label}
              className="rounded-md bg-accent-100 px-1.5 py-0.5 text-[10px] font-semibold text-accent-800"
            >
              {tag.label}
            </span>
          ))}
        </div>
        <p className="mt-1 text-sm font-semibold leading-snug text-foreground-950">{part.name}</p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
          {(part.specs ?? []).slice(0, 3).map((spec) => (
            <span key={spec.label} className="text-[11px] text-foreground-500">
              {spec.label}:{" "}
              <strong className="font-medium text-foreground-700">{spec.value}</strong>
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-foreground-500">
          <span className="flex items-center gap-0.5 text-accent-700">
            <i className="ri-star-fill text-[11px]" />
            {part.rating.toFixed(1)}
          </span>
          <span>({part.reviewCount} değerlendirme)</span>
          {part.stock !== undefined && part.stock > 0 && (
            <span className="text-primary-700">Stokta {part.stock} adet</span>
          )}
        </div>
        {blocked && reason && (
          <p className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-accent-700">
            <i className="ri-error-warning-line mt-0.5" />
            {reason}
          </p>
        )}
      </div>

      <div className="flex w-24 shrink-0 flex-col items-end justify-between gap-2">
        <div className="text-right">
          <p className="whitespace-nowrap text-sm font-bold text-foreground-950">{money(part.price)} ₺</p>
          {part.oldPrice && (
            <p className="text-[11px] text-foreground-400 line-through">{money(part.oldPrice)} ₺</p>
          )}
        </div>
        <button
          type="button"
          onClick={onPick}
          disabled={blocked}
          className={`w-full whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
            selected
              ? "bg-primary-700 text-background-50"
              : blocked
                ? "cursor-not-allowed bg-background-200 text-foreground-400"
                : "cursor-pointer bg-background-100 text-foreground-800 hover:bg-primary-700 hover:text-background-50"
          }`}
        >
          {selected ? (
            <span className="flex items-center justify-center gap-1">
              <i className="ri-check-line" /> Seçildi
            </span>
          ) : blocked ? (
            "Uyumsuz"
          ) : (
            "Seç"
          )}
        </button>
      </div>
    </div>
  );
}