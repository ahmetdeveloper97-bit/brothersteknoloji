import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/product/ProductCard";
import ShowcaseHero from "@/pages/showcase/components/ShowcaseHero";
import { NightDealBanner, NightDealLock } from "@/pages/showcase/components/NightDealNotice";
import { useShowcasePage } from "@/hooks/useShowcasePage";
import { useNightWindow } from "@/hooks/useNightWindow";
import { products } from "@/lib/catalog";
import { discountRate } from "@/lib/collections";
import { SHOWCASE_KEYS, SHOWCASE_META, SHOWCASE_PATHS } from "@/lib/showcasePages";
import type { Product } from "@/types/store";
import type { ShowcasePageKey } from "@/types/showcasePage";

type SortKey = "manual" | "price-asc" | "price-desc" | "rating" | "discount";

const byId = new Map((products as Product[]).map((product) => [product.id, product]));

const money = (value: number): string => new Intl.NumberFormat("tr-TR").format(Math.round(value));

interface ShowcasePageProps {
  showcaseKey: ShowcasePageKey;
}

export default function ShowcasePage({ showcaseKey }: ShowcasePageProps) {
  const page = useShowcasePage(showcaseKey);
  const meta = SHOWCASE_META[showcaseKey];
  const night = useNightWindow(page);
  const isNightDeal = showcaseKey === "gece";
  const nightLocked = isNightDeal && night.enforced && !night.open;
  const [sort, setSort] = useState<SortKey>("manual");
  const [brand, setBrand] = useState<string | null>(null);

  /** Panelden seçilen ürünler, seçim sırası korunarak listelenir */
  const selected = useMemo(
    () => page.productIds.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product)),
    [page.productIds],
  );

  const brands = useMemo(() => {
    const names = Array.from(new Set(selected.map((product) => product.brand)));
    return names.sort((a, b) => a.localeCompare(b, "tr"));
  }, [selected]);

  const visible = useMemo(() => {
    let list = selected;
    if (brand) list = list.filter((product) => product.brand === brand);
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "discount") return [...list].sort((a, b) => discountRate(b) - discountRate(a));
    return list;
  }, [selected, sort, brand]);

  const totalSaving = useMemo(
    () =>
      selected.reduce(
        (sum, product) => (product.oldPrice && product.oldPrice > product.price ? sum + (product.oldPrice - product.price) : sum),
        0,
      ),
    [selected],
  );

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-[1320px] px-4 pb-12 pt-5">
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-foreground-500">
          <Link to="/" className="whitespace-nowrap hover:text-foreground-900">
            Anasayfa
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="truncate text-foreground-800">{page.title}</span>
        </nav>

        <ShowcaseHero
          title={page.title}
          description={page.description}
          imageUrl={page.imageUrl}
          count={selected.length}
          icon={meta.icon}
        />

        {isNightDeal && page.active && (!night.enforced || night.open) && <NightDealBanner state={night} />}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {SHOWCASE_KEYS.filter((key) => key !== showcaseKey).map((key) => (
            <Link
              key={key}
              to={SHOWCASE_PATHS[key]}
              className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-background-300 bg-background-50 px-3 py-1.5 text-xs font-medium text-foreground-700 transition-colors hover:border-primary-300 hover:text-foreground-950"
            >
              <i className={`${SHOWCASE_META[key].icon} text-[13px]`} />
              {SHOWCASE_META[key].label}
            </Link>
          ))}
        </div>

        {!page.active ? (
          <div className="mt-6 rounded-xl border border-background-200 bg-background-50 px-6 py-16 text-center">
            <i className="ri-eye-off-line text-3xl text-foreground-400" />
            <p className="mt-3 font-medium text-foreground-900">Bu vitrin şu anda yayında değil</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-foreground-600">
              Sayfa yönetim panelinden geçici olarak kapatıldı. Diğer vitrinlere göz atabilir veya tüm ürünleri
              inceleyebilirsiniz.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/kategoriler"
                className="cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
              >
                Tüm Ürünleri Gör
              </Link>
              <Link
                to="/"
                className="cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-5 py-2.5 text-sm font-medium text-foreground-800 hover:bg-background-100"
              >
                Anasayfa
              </Link>
            </div>
          </div>
        ) : nightLocked ? (
          <NightDealLock state={night} productCount={selected.length} />
        ) : selected.length === 0 ? (
          <div className="mt-6 rounded-xl border border-background-200 bg-background-50 px-6 py-16 text-center">
            <i className="ri-inbox-archive-line text-3xl text-foreground-400" />
            <p className="mt-3 font-medium text-foreground-900">Bu vitrin için henüz ürün seçilmedi</p>
            <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-foreground-600">
              Yönetim panelindeki {meta.label} ekranından ürün seçtiğinizde bu sayfa otomatik olarak dolacak.
            </p>
            <Link
              to="/kategoriler"
              className="mt-4 inline-block cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
            >
              Tüm Ürünleri Gör
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-background-200 bg-background-50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <p className="text-foreground-600">
                  <strong className="font-semibold text-foreground-900">{visible.length}</strong> ürün listeleniyor
                </p>
                {totalSaving > 0 && (
                  <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
                    <i className="ri-arrow-down-circle-line text-[13px]" />
                    Toplam {money(totalSaving)} ₺ avantaj
                  </span>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground-600">
                Sırala:
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="h-9 cursor-pointer rounded-md border border-background-300 bg-background-50 px-2 text-sm text-foreground-900 outline-none focus:border-primary-500"
                >
                  <option value="manual">Vitrin sırası</option>
                  <option value="price-asc">Fiyat (Artan)</option>
                  <option value="price-desc">Fiyat (Azalan)</option>
                  <option value="rating">Puan</option>
                  <option value="discount">İndirim oranı</option>
                </select>
              </label>
            </div>

            {brands.length > 1 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setBrand(null)}
                  className={`cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    brand === null
                      ? "bg-primary-700 text-background-50"
                      : "bg-background-100 text-foreground-700 hover:bg-background-200"
                  }`}
                >
                  Tüm markalar
                </button>
                {brands.map((name) => (
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
                  </button>
                ))}
              </div>
            )}

            {visible.length === 0 ? (
              <div className="mt-5 rounded-xl border border-background-200 bg-background-50 px-6 py-12 text-center">
                <i className="ri-filter-off-line text-3xl text-foreground-400" />
                <p className="mt-3 font-medium text-foreground-900">Bu markada ürün bulunmuyor</p>
                <button
                  type="button"
                  onClick={() => setBrand(null)}
                  className="mt-3 cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
                >
                  Tüm markaları göster
                </button>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </StoreLayout>
  );
}