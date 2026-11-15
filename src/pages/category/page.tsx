import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/product/ProductCard";
import CategoryFilters from "@/pages/category/components/CategoryFilters";
import BrandStrip from "@/pages/category/components/BrandStrip";
import CategoryTreeNav from "@/pages/category/components/CategoryTreeNav";
import { products } from "@/lib/catalog";
import { loadShippingSettings } from "@/lib/shipping";
import { buildSearchIndex, matchesSearch, splitSearchTerms } from "@/lib/search";
import { getCollection } from "@/lib/collections";
import { collectCategoryIds, useStoreCategories } from "@/hooks/useStoreCategories";
import type { StoreCategoryNode } from "@/hooks/useStoreCategories";
import type { Product } from "@/types/store";

const allProducts = products as Product[];

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const collectionKey = searchParams.get("koleksiyon");
  const collection = useMemo(() => getCollection(collectionKey), [collectionKey]);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [price, setPrice] = useState<{ min: number; max: number } | null>(null);
  const [stockOnly, setStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const shippingSettings = useMemo(() => loadShippingSettings(), []);
  const freeShippingEnabled = shippingSettings.freeShippingEnabled;
  const freeShippingThreshold = freeShippingEnabled ? 0 : shippingSettings.freeShippingThreshold;
  const { roots, flat } = useStoreCategories();

  const category = flat.find((item) => item.slug === slug);

  /** Seçili kategori + alt kategorileri: filtrelenen ürün kapsamı */
  const scopedIds = useMemo(
    () => (category ? collectCategoryIds(roots, category.id) : null),
    [category, roots]
  );

  /** Kategori ağacındaki ürün sayıları (alt kategoriler dahil) */
  const counts = useMemo(() => {
    const own = new Map<string, number>();
    allProducts.forEach((product) => {
      own.set(product.category, (own.get(product.category) ?? 0) + 1);
    });
    const result: Record<string, number> = {};
    const sum = (node: StoreCategoryNode): number => {
      const total = (own.get(node.id) ?? 0) + node.children.reduce((acc, child) => acc + sum(child), 0);
      result[node.id] = total;
      return total;
    };
    roots.forEach(sum);
    return result;
  }, [roots]);

  /** Kişisel bilgisayarlar ağacı: gamer sistemleri ekipmanlardan ayırmak için */
  const pcIds = useMemo(() => {
    const root = roots.find((item) => item.slug === "kisisel-bilgisayarlar");
    return root ? collectCategoryIds(roots, root.id) : new Set<string>();
  }, [roots]);

  useEffect(() => {
    setSelectedBrands([]);
    setPrice(null);
    setStockOnly(false);
    setFreeShippingOnly(false);
    setFiltersOpen(false);
  }, [slug, query, collectionKey]);

  /** Arama metni: Türkçe karakterler sadeleştirilir, tüm kelimeler aranır */
  const searchTerms = useMemo(() => splitSearchTerms(query), [query]);

  const haystackById = useMemo(() => {
    const nameById = new Map(flat.map((item) => [item.id, item.name]));
    const index = buildSearchIndex(allProducts, nameById);
    return new Map(index.map((entry) => [entry.product.id, entry.haystack]));
  }, [flat]);

  const base = useMemo(() => {
    let list = allProducts;
    if (scopedIds) {
      list = allProducts.filter((product) => scopedIds.has(product.category));
    }
    if (collection) {
      list = collection.apply(list, { pcIds });
    }
    if (searchTerms.length > 0) {
      list = list.filter((product) => matchesSearch(haystackById.get(product.id) ?? "", searchTerms));
    }
    return list;
  }, [scopedIds, searchTerms, haystackById, collection, pcIds]);

  const brands = useMemo(() => {
    const map = new Map<string, number>();
    base.forEach((product) => {
      map.set(product.brand, (map.get(product.brand) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr"));
  }, [base]);

  const bounds = useMemo(() => {
    if (base.length === 0) return { min: 0, max: 100000 };
    const prices = base.map((product) => product.price);
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [base]);

  const effectivePrice = price ?? bounds;

  /** Hızlı filtre sayaçları: kategori kapsamındaki ürünler üzerinden hesaplanır */
  const stockCount = useMemo(() => base.filter((product) => product.inStock).length, [base]);
  const freeShippingCount = useMemo(
    () => base.filter((product) => product.price >= freeShippingThreshold).length,
    [base, freeShippingThreshold]
  );

  const filtered = useMemo(() => {
    let list = base;
    if (stockOnly) list = list.filter((product) => product.inStock);
    if (freeShippingOnly) list = list.filter((product) => product.price >= freeShippingThreshold);
    if (selectedBrands.length > 0) {
      list = list.filter((product) => selectedBrands.includes(product.brand));
    }
    list = list.filter(
      (product) => product.price >= effectivePrice.min && product.price <= effectivePrice.max
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [
    base,
    stockOnly,
    freeShippingOnly,
    freeShippingThreshold,
    selectedBrands,
    effectivePrice.min,
    effectivePrice.max,
    sort,
  ]);

  /** Her ürün kategorisinin bağlı olduğu ana kategori (grup) kimliği */
  const rootOf = useMemo(() => {
    const map = new Map<string, string>();
    roots.forEach((root) => {
      collectCategoryIds(roots, root.id).forEach((id) => map.set(id, root.id));
    });
    return map;
  }, [roots]);

  /**
   * Tüm ürünler görünümünde ürünler, katalogdaki ana kategori sırasına
   * göre ayrı gruplar halinde listelenir.
   */
  const grouped = useMemo(() => {
    if (category || query || collection) return null;
    const buckets = roots.map((root) => ({
      root,
      items: filtered.filter((product) => rootOf.get(product.category) === root.id),
    }));
    const known = new Set(roots.map((root) => root.id));
    const others = filtered.filter((product) => !known.has(rootOf.get(product.category) ?? ""));
    return { buckets: buckets.filter((bucket) => bucket.items.length > 0), others };
  }, [category, query, collection, roots, rootOf, filtered]);

  /** Alt kategori hızlı geçişleri: kök kategoride ya da alt kategorideyken aynı grup gösterilir */
  const chipGroup = useMemo<StoreCategoryNode | null>(() => {
    if (!category) return null;
    if (category.children.length > 0) return category;
    if (!category.parent) return null;
    return roots.find((root) => root.id === category.parent) ?? null;
  }, [category, roots]);

  const priceFiltered = effectivePrice.min !== bounds.min || effectivePrice.max !== bounds.max;
  const activeCount =
    selectedBrands.length + (priceFiltered ? 1 : 0) + (stockOnly ? 1 : 0) + (freeShippingOnly ? 1 : 0);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((current) =>
      current.includes(brand) ? current.filter((item) => item !== brand) : [...current, brand]
    );
  };

  const clearBrands = () => setSelectedBrands([]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setPrice(null);
    setStockOnly(false);
    setFreeShippingOnly(false);
  };

  const title = category
    ? collection
      ? `${collection.label} · ${category.name}`
      : category.name
    : query
      ? `"${query}" arama sonuçları`
      : collection
        ? collection.label
        : "Tüm Ürünler";

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-foreground-500">
            <Link to="/" className="hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-foreground-800">{title}</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">{title}</h1>
          {collection && (
            <p className="mt-1 max-w-2xl text-sm text-foreground-600">{collection.description}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-foreground-600">
            <span>{filtered.length} ürün listeleniyor</span>
            {collection && (
              <Link
                to={category ? `/kategoriler/${category.slug}` : "/kategoriler"}
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-800 hover:bg-primary-100"
              >
                <i className="ri-bookmark-3-line text-[11px]" />
                {collection.label}
                <i className="ri-close-line text-[11px]" />
              </Link>
            )}
            {query && (
              <Link
                to={category ? `/kategoriler/${category.slug}` : "/kategoriler"}
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-secondary-100 px-2.5 py-1 text-xs font-medium text-secondary-900 hover:bg-secondary-200"
              >
                <i className="ri-search-line text-[11px]" />
                {query}
                <i className="ri-close-line text-[11px]" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <div className="lg:sticky lg:top-[282px] lg:space-y-4">
            <CategoryTreeNav
              roots={roots}
              activeId={category?.id}
              totalCount={allProducts.length}
              counts={counts}
            />

            <div className="mt-4 lg:mt-0">
              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-xl border border-background-200 bg-background-50 px-4 py-3 text-sm font-semibold text-foreground-900 lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <i className="ri-filter-3-line" />
                  Filtreler
                  {activeCount > 0 && (
                    <span className="rounded-full bg-primary-700 px-2 py-0.5 text-[10px] font-bold text-background-50">
                      {activeCount}
                    </span>
                  )}
                </span>
                <i className={`ri-arrow-down-s-line transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
              </button>

              <div className={filtersOpen ? "block" : "hidden lg:block"}>
                <CategoryFilters
                  brands={brands}
                  selectedBrands={selectedBrands}
                  onToggleBrand={toggleBrand}
                  onClearBrands={clearBrands}
                  price={effectivePrice}
                  bounds={bounds}
                  onPriceChange={setPrice}
                  onReset={resetFilters}
                  activeCount={activeCount}
                  stockOnly={stockOnly}
                  freeShippingOnly={freeShippingOnly}
                  onToggleStock={() => setStockOnly((value) => !value)}
                  onToggleFreeShipping={() => setFreeShippingOnly((value) => !value)}
                  stockCount={stockCount}
                  freeShippingCount={freeShippingCount}
                  freeShippingThreshold={freeShippingThreshold}
                  freeShippingAlways={freeShippingEnabled}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <BrandStrip
            brands={brands}
            selectedBrands={selectedBrands}
            onToggleBrand={toggleBrand}
            onClearBrands={clearBrands}
          />

          {chipGroup && chipGroup.children.length > 0 && (
            <div className="mb-4 rounded-xl border border-background-200 bg-background-50 px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                  <i className="ri-node-tree" />
                  Alt kategoriler
                </span>
                <Link
                  to={`/kategoriler/${chipGroup.slug}`}
                  className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    category?.id === chipGroup.id
                      ? "bg-primary-700 text-background-50"
                      : "bg-background-100 text-foreground-700 hover:bg-background-200"
                  }`}
                >
                  Tümü
                  <span className="text-[10px] opacity-70">{counts[chipGroup.id] ?? 0}</span>
                </Link>
                {chipGroup.children.map((child) => {
                  const active = child.id === category?.id;
                  return (
                    <Link
                      key={child.id}
                      to={`/kategoriler/${child.slug}`}
                      className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary-700 text-background-50"
                          : "bg-background-100 text-foreground-700 hover:bg-background-200"
                      }`}
                    >
                      {child.name}
                      <span className="text-[10px] opacity-70">{counts[child.id] ?? 0}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStockOnly((value) => !value)}
              aria-pressed={stockOnly}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                stockOnly
                  ? "border-primary-700 bg-primary-700 text-background-50"
                  : "border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center">
                <i className={`${stockOnly ? "ri-check-line" : "ri-checkbox-circle-line"} text-[13px]`} />
              </span>
              Stokta olanlar
              <span className={`text-[10px] ${stockOnly ? "opacity-80" : "text-foreground-400"}`}>
                {stockCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFreeShippingOnly((value) => !value)}
              aria-pressed={freeShippingOnly}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                freeShippingOnly
                  ? "border-accent-700 bg-accent-700 text-background-50"
                  : "border-background-300 bg-background-50 text-foreground-700 hover:border-accent-400"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center">
                <i className={`${freeShippingOnly ? "ri-check-line" : "ri-truck-line"} text-[13px]`} />
              </span>
              Ücretsiz kargo
              <span className={`text-[10px] ${freeShippingOnly ? "opacity-80" : "text-foreground-400"}`}>
                {freeShippingCount}
              </span>
            </button>
            <span className="text-[11px] text-foreground-400">
              {freeShippingEnabled
                ? "Tüm siparişlerde ücretsiz kargo"
                : `${money(freeShippingThreshold)} ₺ üzeri ücretsiz kargo`}
            </span>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-background-200 bg-background-50 px-4 py-3">
            <p className="text-sm text-foreground-600">
              <strong className="font-semibold text-foreground-900">{filtered.length}</strong> ürün
              {activeCount > 0 && <span className="ml-1 text-xs text-foreground-500">(filtrelenmiş)</span>}
            </p>
            <label className="flex items-center gap-2 text-sm text-foreground-600">
              Sırala:
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-9 cursor-pointer rounded-md border border-background-300 bg-background-50 px-2 text-sm text-foreground-900 outline-none focus:border-primary-500"
              >
                <option value="recommended">Önerilen</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
                <option value="rating">Puan</option>
              </select>
            </label>
          </div>

          {activeCount > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {selectedBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-medium text-secondary-900 hover:bg-secondary-200"
                >
                  {brand}
                  <i className="ri-close-line" />
                </button>
              ))}
              {priceFiltered && (
                <button
                  type="button"
                  onClick={() => setPrice(null)}
                  className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-medium text-secondary-900 hover:bg-secondary-200"
                >
                  {money(effectivePrice.min)} ₺ – {money(effectivePrice.max)} ₺
                  <i className="ri-close-line" />
                </button>
              )}
              {stockOnly && (
                <button
                  type="button"
                  onClick={() => setStockOnly(false)}
                  className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-medium text-secondary-900 hover:bg-secondary-200"
                >
                  Stokta olanlar
                  <i className="ri-close-line" />
                </button>
              )}
              {freeShippingOnly && (
                <button
                  type="button"
                  onClick={() => setFreeShippingOnly(false)}
                  className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-medium text-secondary-900 hover:bg-secondary-200"
                >
                  Ücretsiz kargo
                  <i className="ri-close-line" />
                </button>
              )}
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer whitespace-nowrap text-xs font-medium text-primary-700 hover:underline"
              >
                Tüm filtreleri temizle
              </button>
            </div>
          )}

          {filtered.length > 0 && grouped && grouped.buckets.length > 0 ? (
            <div className="space-y-12">
              {grouped.buckets.map((bucket) => (
                <section key={bucket.root.id}>
                  <div className="mb-3 flex flex-wrap items-end justify-between gap-2 border-b border-background-200 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-100 text-primary-700">
                        <i className="ri-price-tag-3-line text-sm" />
                      </span>
                      <div>
                        <h2 className="font-heading text-lg font-bold text-foreground-950">{bucket.root.name}</h2>
                        <p className="text-xs text-foreground-500">{bucket.items.length} ürün</p>
                      </div>
                    </div>
                    <Link
                      to={`/kategoriler/${bucket.root.slug}`}
                      className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-xs font-medium text-primary-700 hover:underline"
                    >
                      Tümünü gör
                      <i className="ri-arrow-right-line" />
                    </Link>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-1.5">
                    {bucket.root.children.map((child) => {
                      const childCount = bucket.items.filter((product) => product.category === child.id).length;
                      if (childCount === 0) return null;
                      return (
                        <Link
                          key={child.id}
                          to={`/kategoriler/${child.slug}`}
                          className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-background-100 px-3 py-1.5 text-xs font-medium text-foreground-700 transition-colors hover:bg-background-200"
                        >
                          {child.name}
                          <span className="text-[10px] text-foreground-400">{childCount}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                    {bucket.items.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}

              {grouped.others.length > 0 && (
                <section>
                  <div className="mb-3 border-b border-background-200 pb-2.5">
                    <h2 className="font-heading text-lg font-bold text-foreground-950">Diğer Ürünler</h2>
                    <p className="text-xs text-foreground-500">{grouped.others.length} ürün</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                    {grouped.others.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : filtered.length === 0 && category && base.length === 0 ? (
            <div className="rounded-xl border border-background-200 bg-background-50 px-6 py-16 text-center">
              <i className="ri-inbox-archive-line text-3xl text-foreground-400" />
              <p className="mt-3 font-medium text-foreground-900">Bu kategoride henüz ürün bulunmuyor</p>
              <p className="mt-1 text-sm text-foreground-600">
                {category.name} kategorisi yeni açıldı. Alt kategorileri inceleyebilir veya tüm kataloğa göz
                atabilirsiniz.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {chipGroup &&
                  chipGroup.id !== category.id &&
                  chipGroup.children.slice(0, 4).map((child) => (
                    <Link
                      key={child.id}
                      to={`/kategoriler/${child.slug}`}
                      className="cursor-pointer whitespace-nowrap rounded-full bg-background-100 px-3 py-1.5 text-xs font-medium text-foreground-700 hover:bg-background-200"
                    >
                      {child.name}
                    </Link>
                  ))}
                <Link
                  to="/kategoriler"
                  className="cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
                >
                  Tüm Kataloğu Gör
                </Link>
              </div>
            </div>
          ) : filtered.length === 0 && query ? (
            <div className="rounded-xl border border-background-200 bg-background-50 px-6 py-14 text-center">
              <i className="ri-search-eye-line text-3xl text-foreground-400" />
              <p className="mt-3 font-medium text-foreground-900">
                &ldquo;{query}&rdquo; için ürün bulunamadı
              </p>
              <p className="mt-1 text-sm text-foreground-600">
                Yazımı kontrol edin veya aşağıdaki kategorilerden birine göz atın.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {roots.slice(0, 4).map((root) => (
                  <Link
                    key={root.id}
                    to={`/kategoriler/${root.slug}`}
                    className="cursor-pointer whitespace-nowrap rounded-full bg-background-100 px-3 py-1.5 text-xs font-medium text-foreground-700 hover:bg-background-200"
                  >
                    {root.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Link
                  to="/kategoriler"
                  className="cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
                >
                  Tüm Ürünleri Gör
                </Link>
                <Link
                  to="/destek"
                  className="cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-5 py-2.5 text-sm font-medium text-foreground-800 hover:bg-background-100"
                >
                  Aradığımı bulamadım
                </Link>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-background-200 bg-background-50 px-6 py-16 text-center">
              <i className="ri-search-eye-line text-3xl text-foreground-400" />
              <p className="mt-3 font-medium text-foreground-900">Seçili filtrelerle eşleşen ürün bulunamadı</p>
              <p className="mt-1 text-sm text-foreground-600">Filtreleri temizleyerek tekrar deneyebilirsiniz.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 cursor-pointer rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}