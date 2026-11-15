import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { products } from "@/lib/catalog";
import { buildSearchIndex, searchProducts } from "@/lib/search";
import { useStoreCategories } from "@/hooks/useStoreCategories";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/store";

interface HeaderSearchProps {
  className?: string;
  /** Mobil menüdeki arama kutusu için daha sade görünüm. */
  variant?: "desktop" | "drawer";
  onNavigate?: () => void;
}

const allProducts = products as Product[];

export default function HeaderSearch({ className = "", variant = "desktop", onNavigate }: HeaderSearchProps) {
  const navigate = useNavigate();
  const { flat } = useStoreCategories();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const index = useMemo(() => {
    const nameById = new Map(flat.map((category) => [category.id, category.name]));
    return buildSearchIndex(allProducts, nameById);
  }, [flat]);

  const trimmed = query.trim();
  const results = useMemo(() => searchProducts(index, trimmed, 6), [index, trimmed]);
  const showPanel = open && trimmed.length >= 2 && variant === "desktop";

  const goToResults = () => {
    setOpen(false);
    onNavigate?.();
    navigate(trimmed ? `/kategoriler?q=${encodeURIComponent(trimmed)}` : "/kategoriler");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    goToResults();
  };

  const handlePick = () => {
    setOpen(false);
    onNavigate?.();
  };

  if (variant === "drawer") {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className="flex items-center gap-2 rounded-full bg-background-100 px-4">
          <i className="ri-search-line text-foreground-500" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün, kategori veya marka ara..."
            className="h-10 flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-foreground-500"
          />
          <button
            type="submit"
            aria-label="Ara"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary-700 text-background-50"
          >
            <i className="ri-arrow-right-line text-sm" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <i className="ri-search-line pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-foreground-500" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder="Ürün, kategori veya marka ara..."
            aria-label="Ürün ara"
            className="h-10 w-full rounded-full border-0 bg-background-100 pl-11 pr-12 text-sm text-foreground-900 outline-none transition-all placeholder:text-foreground-500 focus:bg-background-50 focus:ring-1 focus:ring-background-300"
          />
          <button
            type="submit"
            aria-label="Ara"
            className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-primary-800 to-primary-600 text-background-50 hover:from-primary-700 hover:to-primary-500"
          >
            <i className="ri-search-line text-sm" />
          </button>
        </div>
      </form>

      {showPanel && (
        <>
          <button
            type="button"
            aria-label="Aramayı kapat"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-background-200 bg-background-50 shadow-xl animate-fadeUp">
            {results.length > 0 ? (
              <>
                <p className="border-b border-background-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                  Ürünler · {results.length} sonuç
                </p>
                <ul className="max-h-[320px] overflow-y-auto py-1">
                  {results.map(({ product }) => (
                    <li key={product.id}>
                      <Link
                        to={`/urunler/${product.slug}`}
                        onClick={handlePick}
                        className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-background-100"
                      >
                        <span className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-background-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover object-top"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-foreground-900">
                            {product.name}
                          </span>
                          <span className="block truncate text-[11px] text-foreground-500">
                            {product.brand}
                            {!product.inStock && " · Stokta yok"}
                          </span>
                        </span>
                        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-foreground-950">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={goToResults}
                  className="flex w-full cursor-pointer items-center justify-between border-t border-background-200 px-4 py-2.5 text-[13px] font-semibold text-primary-700 hover:bg-background-100"
                >
                  Tüm sonuçları görüntüle
                  <i className="ri-arrow-right-line" />
                </button>
              </>
            ) : (
              <div className="px-4 py-6 text-center">
                <i className="ri-search-eye-line text-2xl text-foreground-400" />
                <p className="mt-2 text-sm font-medium text-foreground-900">
                  &ldquo;{trimmed}&rdquo; için ürün bulunamadı
                </p>
                <p className="mt-1 text-xs text-foreground-500">
                  Farklı bir kelime deneyin veya tüm kataloğa göz atın.
                </p>
                <button
                  type="button"
                  onClick={goToResults}
                  className="mt-3 cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-4 py-2 text-xs font-semibold text-background-50 hover:bg-primary-600"
                >
                  Tüm ürünlerde ara
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}