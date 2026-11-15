import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { buildPriceBands, isBandActive } from "@/lib/priceBands";

export interface BrandOption {
  name: string;
  count: number;
}

interface CategoryFiltersProps {
  brands: BrandOption[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  onClearBrands: () => void;
  price: { min: number; max: number };
  bounds: { min: number; max: number };
  onPriceChange: (price: { min: number; max: number }) => void;
  onReset: () => void;
  activeCount: number;
  stockOnly: boolean;
  freeShippingOnly: boolean;
  onToggleStock: () => void;
  onToggleFreeShipping: () => void;
  stockCount: number;
  freeShippingCount: number;
  freeShippingThreshold: number;
  freeShippingAlways?: boolean;
}

const formatInput = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

const parseInput = (value: string): number => Number(value.replace(/[^\d]/g, ""));

/** Kaydırıcı adımı: aralığın büyüklüğüne göre 1 / 2 / 5 / 10 dilimlerine oturur. */
const resolveStep = (min: number, max: number): number => {
  const span = max - min;
  if (span <= 0) return 1;
  const raw = span / 120;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return Math.max(1, factor * magnitude);
};

export default function CategoryFilters({
  brands,
  selectedBrands,
  onToggleBrand,
  onClearBrands,
  price,
  bounds,
  onPriceChange,
  onReset,
  activeCount,
  stockOnly,
  freeShippingOnly,
  onToggleStock,
  onToggleFreeShipping,
  stockCount,
  freeShippingCount,
  freeShippingThreshold,
  freeShippingAlways,
}: CategoryFiltersProps) {
  const [minInput, setMinInput] = useState(formatInput(price.min));
  const [maxInput, setMaxInput] = useState(formatInput(price.max));
  const [brandQuery, setBrandQuery] = useState("");

  useEffect(() => {
    setMinInput(formatInput(price.min));
    setMaxInput(formatInput(price.max));
  }, [price.min, price.max]);

  useEffect(() => {
    setBrandQuery("");
  }, [brands]);

  const applyInputs = () => {
    const min = Math.max(bounds.min, Math.min(parseInput(minInput) || bounds.min, bounds.max));
    const max = Math.max(min, Math.min(parseInput(maxInput) || bounds.max, bounds.max));
    setMinInput(formatInput(min));
    setMaxInput(formatInput(max));
    onPriceChange({ min, max });
  };

  const onEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyInputs();
    }
  };

  const step = useMemo(() => resolveStep(bounds.min, bounds.max), [bounds.min, bounds.max]);
  const priceBands = useMemo(() => buildPriceBands(bounds), [bounds.min, bounds.max]);

  const applyBand = (bandMin: number, bandMax: number) => {
    onPriceChange({ min: bandMin, max: bandMax });
  };

  const span = bounds.max - bounds.min;
  const leftPct = span > 0 ? ((price.min - bounds.min) / span) * 100 : 0;
  const rightPct = span > 0 ? 100 - ((price.max - bounds.min) / span) * 100 : 0;

  const searchTerm = brandQuery.trim().toLocaleLowerCase("tr");
  const visibleBrands = useMemo(() => {
    if (!searchTerm) return brands;
    return brands.filter(
      (brand) =>
        brand.name.toLocaleLowerCase("tr").includes(searchTerm) || selectedBrands.includes(brand.name)
    );
  }, [brands, searchTerm, selectedBrands]);

  const quickFilters = [
    {
      key: "stock",
      label: "Stokta olanlar",
      icon: "ri-checkbox-circle-line",
      active: stockOnly,
      count: stockCount,
      onClick: onToggleStock,
    },
    {
      key: "shipping",
      label: "Ücretsiz kargo",
      icon: "ri-truck-line",
      active: freeShippingOnly,
      count: freeShippingCount,
      onClick: onToggleFreeShipping,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-bold text-foreground-950">Filtreler</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-medium text-primary-700 hover:underline"
          >
            <i className="ri-refresh-line" />
            Temizle
          </button>
        )}
      </div>

      <div className="rounded-xl border border-background-200 bg-background-50 p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-500">
          <i className="ri-flashlight-line text-sm" />
          Hızlı Filtreler
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {quickFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.onClick}
              aria-pressed={filter.active}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                filter.active
                  ? "border-primary-700 bg-primary-700 text-background-50"
                  : "border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-foreground-950"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center">
                <i className={`${filter.active ? "ri-check-line" : filter.icon} text-[13px]`} />
              </span>
              {filter.label}
              <span className={`text-[10px] ${filter.active ? "opacity-80" : "text-foreground-400"}`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-foreground-400">
          {freeShippingAlways
            ? "Tüm siparişlerde kargo ücretsiz."
            : `${formatInput(freeShippingThreshold)} ₺ ve üzeri siparişlerde kargo ücretsiz.`}
        </p>
      </div>

      <div className="rounded-xl border border-background-200 bg-background-50 p-4">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-500">
            <i className="ri-price-tag-3-line text-sm" />
            Marka
          </h3>
          {selectedBrands.length > 0 && (
            <button
              type="button"
              onClick={onClearBrands}
              className="cursor-pointer whitespace-nowrap text-[11px] font-medium text-primary-700 hover:underline"
            >
              Seçili {selectedBrands.length}
            </button>
          )}
        </div>

        {brands.length > 6 && (
          <div className="relative mb-2.5">
            <span className="pointer-events-none absolute left-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-foreground-400">
              <i className="ri-search-line text-sm" />
            </span>
            <input
              type="search"
              value={brandQuery}
              onChange={(event) => setBrandQuery(event.target.value)}
              placeholder="Marka ara"
              aria-label="Marka ara"
              className="h-9 w-full rounded-md border border-background-300 bg-background-50 pl-8 pr-7 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
            />
            {brandQuery && (
              <button
                type="button"
                onClick={() => setBrandQuery("")}
                aria-label="Marka aramasını temizle"
                className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-foreground-400 hover:bg-background-100 hover:text-foreground-900"
              >
                <i className="ri-close-line text-sm" />
              </button>
            )}
          </div>
        )}

        <ul className="max-h-64 space-y-0.5 overflow-y-auto pr-1">
          {visibleBrands.map((brand) => {
            const checked = selectedBrands.includes(brand.name);
            return (
              <li key={brand.name}>
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1.5 text-sm transition-colors hover:bg-background-100">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleBrand(brand.name)}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-primary-700"
                  />
                  <span
                    className={`min-w-0 flex-1 truncate ${
                      checked ? "font-semibold text-foreground-950" : "text-foreground-700"
                    }`}
                  >
                    {brand.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-foreground-400">{brand.count}</span>
                </label>
              </li>
            );
          })}
          {visibleBrands.length === 0 && (
            <li className="px-1.5 py-2 text-xs text-foreground-500">
              {searchTerm ? `"${brandQuery.trim()}" ile eşleşen marka yok.` : "Marka bulunamadı."}
            </li>
          )}
        </ul>

        {searchTerm && visibleBrands.length > 0 && (
          <p className="mt-2 text-[11px] text-foreground-400">{visibleBrands.length} marka listeleniyor</p>
        )}
      </div>

      <div className="rounded-xl border border-background-200 bg-background-50 p-4">
        <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-500">
          <i className="ri-wallet-3-line text-sm" />
          Fiyat Aralığı
        </h3>

        {priceBands.length > 0 && (
          <div className="mb-3">
            <p className="mb-1.5 flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-foreground-400">
              <i className="ri-filter-3-line text-[13px]" />
              Hızlı bantlar
            </p>
            <div className="flex flex-wrap gap-1.5">
              {priceBands.map((band) => {
                const active = isBandActive(band, price);
                return (
                  <button
                    key={band.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      active
                        ? onPriceChange({ min: bounds.min, max: bounds.max })
                        : applyBand(band.min, band.max)
                    }
                    className={`cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[11px] font-medium tabular-nums transition-colors ${
                      active
                        ? "border-primary-700 bg-primary-700 text-background-50"
                        : "border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300 hover:text-foreground-950"
                    }`}
                  >
                    {band.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-md bg-background-100 px-2 py-1 text-xs font-semibold tabular-nums text-foreground-900">
            {formatInput(price.min)} ₺
          </span>
          <span className="h-px flex-1 bg-background-300" />
          <span className="rounded-md bg-background-100 px-2 py-1 text-xs font-semibold tabular-nums text-foreground-900">
            {formatInput(price.max)} ₺
          </span>
        </div>

        <div className="relative h-7">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-background-300" />
          <div
            className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary-700"
            style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
          />
          <input
            type="range"
            className="dual-range-input"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={price.min}
            onChange={(event) => {
              const next = Number(event.target.value);
              onPriceChange({ min: Math.min(next, price.max), max: price.max });
            }}
            aria-label="En az fiyat kaydırıcısı"
          />
          <input
            type="range"
            className="dual-range-input"
            min={bounds.min}
            max={bounds.max}
            step={step}
            value={price.max}
            onChange={(event) => {
              const next = Number(event.target.value);
              onPriceChange({ min: price.min, max: Math.max(next, price.min) });
            }}
            aria-label="En çok fiyat kaydırıcısı"
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={minInput}
            onChange={(event) => setMinInput(event.target.value)}
            onBlur={applyInputs}
            onKeyDown={onEnter}
            aria-label="En az fiyat"
            className="h-9 w-full min-w-0 rounded-md border border-background-300 bg-background-50 px-2 text-sm text-foreground-900 outline-none focus:border-primary-500"
          />
          <span className="text-foreground-400">–</span>
          <input
            type="text"
            inputMode="numeric"
            value={maxInput}
            onChange={(event) => setMaxInput(event.target.value)}
            onBlur={applyInputs}
            onKeyDown={onEnter}
            aria-label="En çok fiyat"
            className="h-9 w-full min-w-0 rounded-md border border-background-300 bg-background-50 px-2 text-sm text-foreground-900 outline-none focus:border-primary-500"
          />
        </div>

        {(price.min !== bounds.min || price.max !== bounds.max) && (
          <button
            type="button"
            onClick={() => onPriceChange({ min: bounds.min, max: bounds.max })}
            className="mt-2 flex cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-medium text-primary-700 hover:underline"
          >
            <i className="ri-refresh-line" />
            Fiyat aralığını sıfırla
          </button>
        )}

        <p className="mt-2 text-[11px] text-foreground-400">
          Ürün fiyatları {formatInput(bounds.min)} ₺ – {formatInput(bounds.max)} ₺ arasında.
        </p>
      </div>
    </div>
  );
}