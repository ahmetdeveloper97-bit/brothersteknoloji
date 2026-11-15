import { useMemo, useState } from "react";
import { inputClass } from "@/components/base/AdminUI";
import { products } from "@/lib/catalog";
import { useStoreCategories } from "@/hooks/useStoreCategories";
import { normalizeSearchText } from "@/lib/search";
import type { Product } from "@/types/store";

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

interface ShowcaseProductPickerProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function ShowcaseProductPicker({ selectedIds, onToggle }: ShowcaseProductPickerProps) {
  const { flat } = useStoreCategories();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    flat.forEach((item) => map.set(item.id, item.name));
    return map;
  }, [flat]);

  const categories = useMemo(() => {
    const ids = Array.from(new Set((products as Product[]).map((product) => product.category)));
    return ids
      .map((id) => ({ id, name: categoryNames.get(id) ?? id }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [categoryNames]);

  const list = useMemo(() => {
    const term = normalizeSearchText(query.trim());
    let items = products as Product[];
    if (category) items = items.filter((product) => product.category === category);
    if (term) {
      items = items.filter((product) =>
        normalizeSearchText(`${product.name} ${product.brand}`).includes(term),
      );
    }
    return items.slice(0, 60);
  }, [query, category]);

  return (
    <div className="flex min-w-0 flex-col">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="relative min-w-0">
          <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün veya marka ara"
            className={`${inputClass} pl-8`}
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={`${inputClass} min-w-0 cursor-pointer`}
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-2 max-h-[420px] min-w-0 space-y-1 overflow-y-auto rounded-lg border border-background-200 bg-background-100 p-1.5">
        {list.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-foreground-500">Aramanızla eşleşen ürün bulunamadı.</p>
        )}
        {list.map((product) => {
          const selected = selectedIds.includes(product.id);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onToggle(product.id)}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors ${
                selected ? "bg-primary-100" : "hover:bg-background-200"
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-background-200 bg-background-50">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover object-top" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-foreground-900">{product.name}</span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-foreground-500">
                  <span className="truncate">{product.brand}</span>
                  <span className="text-foreground-300">|</span>
                  <span className="whitespace-nowrap">{money(product.price)} ₺</span>
                </span>
              </span>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  selected ? "border-primary-700 bg-primary-700 text-background-50" : "border-background-400 text-transparent"
                }`}
              >
                <i className="ri-check-line text-[13px]" />
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-foreground-500">
        Listede ilk 60 ürün gösterilir. Aramayı daraltarak diğer ürünlere ulaşabilirsiniz.
      </p>
    </div>
  );
}