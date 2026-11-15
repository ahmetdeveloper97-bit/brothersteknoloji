import { useRef } from "react";
import type { BrandOption } from "@/pages/category/components/CategoryFilters";

interface BrandStripProps {
  brands: BrandOption[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  onClearBrands: () => void;
}

/** Marka adından tek harfli logo işareti üretir. */
const monogram = (name: string): string => {
  const cleaned = name.replace(/[^A-Za-zÀ-ÿĞÜŞİÖÇğüşiöç]/g, " ").trim();
  const first = cleaned.charAt(0);
  return first ? first.toLocaleUpperCase("tr") : "•";
};

export default function BrandStrip({ brands, selectedBrands, onToggleBrand, onClearBrands }: BrandStripProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  if (brands.length === 0) return null;

  return (
    <section className="mb-4 rounded-xl border border-background-200 bg-background-50 px-3 py-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
          <i className="ri-store-2-line text-sm" />
          Markalar
          <span className="font-normal normal-case tracking-normal text-foreground-400">
            ({brands.length})
          </span>
        </h2>
        <div className="flex items-center gap-1">
          {selectedBrands.length > 0 && (
            <button
              type="button"
              onClick={onClearBrands}
              className="mr-1 cursor-pointer whitespace-nowrap text-[11px] font-medium text-primary-700 hover:underline"
            >
              Seçimi temizle
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Markaları sola kaydır"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-600 transition-colors hover:border-primary-300 hover:text-foreground-900"
          >
            <i className="ri-arrow-left-s-line" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Markaları sağa kaydır"
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-600 transition-colors hover:border-primary-300 hover:text-foreground-900"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => {
          const active = selectedBrands.includes(brand.name);
          return (
            <button
              key={brand.name}
              type="button"
              onClick={() => onToggleBrand(brand.name)}
              aria-pressed={active}
              title={`${brand.name} · ${brand.count} ürün`}
              className={`flex min-w-[132px] shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all duration-200 ${
                active
                  ? "border-primary-700 bg-primary-50 shadow-sm"
                  : "border-background-200 bg-background-50 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-sm"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-heading text-sm font-extrabold tracking-tight ${
                  active
                    ? "bg-primary-700 text-background-50"
                    : "bg-background-100 text-foreground-800"
                }`}
              >
                {monogram(brand.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-semibold uppercase tracking-wide text-foreground-900">
                  {brand.name}
                </span>
                <span className="block text-[10px] text-foreground-500">{brand.count} ürün</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}