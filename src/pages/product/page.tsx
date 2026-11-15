import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/product/ProductCard";
import PaymentBadges from "@/components/base/PaymentBadges";
import DeliveryEstimate from "@/pages/product/components/DeliveryEstimate";
import ReviewsPanel from "@/pages/product/components/ReviewsPanel";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { formatPrice } from "@/lib/format";
import {
  defaultSelection,
  getVariantGroups,
  resolvedStock,
  selectionLabel,
  selectionPrice,
  selectionStock,
  stockLabel,
} from "@/lib/productVariants";
import type { VariantSelection } from "@/lib/productVariants";
import { reviews } from "@/mocks/store";
import { products } from "@/lib/catalog";
import type { Product, StoreReview } from "@/types/store";

const allProducts = products as Product[];
const allReviews = reviews as StoreReview[];
const tabs = ["Ürün Açıklaması", "Teknik Özellikler", "Yorumlar"];

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const [selection, setSelection] = useState<VariantSelection>();

  const product = useMemo(() => {
    if (!slug) return undefined;
    let decoded = slug;
    try {
      decoded = decodeURIComponent(slug);
    } catch {
      decoded = slug;
    }
    const normalize = (value: string) =>
      value
        .toLocaleLowerCase("tr")
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .trim();

    return (
      allProducts.find((item) => item.slug === decoded || item.slug === slug || item.id === decoded) ??
      allProducts.find((item) => normalize(item.slug) === normalize(decoded))
    );
  }, [slug]);
  const favorite = product ? isFavorite(product.id) : false;

  const groups = useMemo(() => (product ? getVariantGroups(product) : []), [product]);

  /** Kullanıcı seçimi geçersizse (ör. sayfa değişti) varsayılana döner. */
  const activeSelection = useMemo(() => {
    const fallback = defaultSelection(groups);
    const merged: VariantSelection = {};
    const current = selection ?? {};
    groups.forEach((group) => {
      const chosen = current[group.id];
      merged[group.id] = group.options.some((option) => option.id === chosen)
        ? (chosen as string)
        : (fallback[group.id] as string);
    });
    return merged;
  }, [groups, selection]);

  const variantLabel = selectionLabel(groups, activeSelection);
  const price = product ? selectionPrice(product, groups, activeSelection) : 0;
  const stock = selectionStock(groups, activeSelection, resolvedStock(product));
  const maxQuantity = Math.max(1, Math.min(stock, 20));

  const chooseOption = (groupId: string, optionId: string) => {
    setSelection((current) => ({ ...current, [groupId]: optionId }));
    setQuantity(1);
  };

  useEffect(() => {
    setQuantity(1);
    setTab(0);
  }, [slug]);

  if (!product) {
    return (
      <StoreLayout>
        <div className="mx-auto w-full max-w-[1320px] px-4 py-24 text-center">
          <i className="ri-emotion-sad-line text-4xl text-foreground-400" />
          <h1 className="mt-4 font-heading text-xl font-bold text-foreground-950">Ürün bulunamadı</h1>
          <p className="mt-1 text-sm text-foreground-600">Aradığınız ürün kaldırılmış veya taşınmış olabilir.</p>
          <Link to="/kategoriler" className="mt-5 inline-block rounded-lg bg-primary-700 px-5 py-2.5 text-sm text-background-50">
            Ürünlere Dön
          </Link>
        </div>
      </StoreLayout>
    );
  }

  const similar = allProducts.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);
  const fallbackSimilar = allProducts.filter((item) => item.id !== product.id).slice(0, 4);
  const similarList = similar.length > 0 ? similar : fallbackSimilar;

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-500">
          <Link to="/" className="hover:text-foreground-900">
            Anasayfa
          </Link>
          <i className="ri-arrow-right-s-line" />
          <Link to="/kategoriler" className="hover:text-foreground-900">
            Ürünler
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="line-clamp-1 text-foreground-800">{product.name}</span>
        </nav>

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="overflow-hidden rounded-2xl border border-background-200 bg-background-50">
            <div className="relative aspect-square bg-background-100">
              <img src={product.image} alt={product.name} title={product.name} className="h-full w-full object-cover" />
              {product.oldPrice && (
                <span className="absolute left-4 top-4 rounded-md bg-primary-700 px-2.5 py-1 text-xs font-semibold text-background-50">
                  %{Math.round(((product.oldPrice - price) / product.oldPrice) * 100)} indirim
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 border-t border-background-200 p-3">
              {[0, 1, 2, 3].map((thumb) => (
                <div key={thumb} className="aspect-square overflow-hidden rounded-lg border border-background-200 bg-background-100">
                  <img src={product.image} alt={`${product.name} görsel ${thumb + 1}`} className="h-full w-full object-cover opacity-90" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground-500">{product.brand}</p>
            <h1 className="mt-1 font-heading text-xl font-bold leading-snug text-foreground-950 md:text-2xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-0.5 text-accent-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <i key={index} className={index < Math.round(product.rating) ? "ri-star-fill" : "ri-star-line"} />
                ))}
              </span>
              <span className="font-medium text-foreground-800">{product.rating.toFixed(1)}</span>
              <span className="text-foreground-500">({product.reviewCount} değerlendirme)</span>
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  stock <= 0
                    ? "bg-background-200 text-foreground-600"
                    : "bg-accent-100 text-accent-800"
                }`}
              >
                <i className={stock <= 0 ? "ri-close-circle-line" : "ri-checkbox-circle-fill"} />
                {stockLabel(stock)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-2">
              <span className="font-heading text-3xl font-extrabold text-foreground-950">{formatPrice(price)}</span>
              {product.oldPrice && (
                <span className="text-base text-foreground-500 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-foreground-500">KDV dahil · 12 aya kadar taksit imkanı</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full border border-background-300 bg-background-100 px-2.5 py-1 text-[11px] font-medium text-foreground-700"
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {groups.length > 0 && (
              <div className="mt-5 space-y-4 rounded-xl border border-background-200 bg-background-100 p-4">
                {groups.map((group) => {
                  const activeOption = group.options.find((option) => option.id === activeSelection[group.id]);
                  return (
                    <div key={group.id}>
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                          {group.name}
                        </p>
                        <p className="text-xs font-medium text-foreground-900">{activeOption?.label}</p>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const active = option.id === activeSelection[group.id];
                          const soldOut = option.stock <= 0;
                          if (group.type === "color") {
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => chooseOption(group.id, option.id)}
                                disabled={soldOut}
                                aria-pressed={active}
                                title={`${option.label}${soldOut ? " (stokta yok)" : ""}`}
                                className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-xs font-medium transition-colors ${
                                  soldOut
                                    ? "cursor-not-allowed border-background-200 bg-background-50 text-foreground-400"
                                    : active
                                      ? "cursor-pointer border-primary-700 bg-background-50 text-foreground-950"
                                      : "cursor-pointer border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300"
                                }`}
                              >
                                <span
                                  className={`h-5 w-5 rounded-full border border-background-300 ${
                                    active ? "ring-2 ring-primary-700 ring-offset-2 ring-offset-background-50" : ""
                                  }`}
                                  style={{ backgroundColor: option.hex ?? "#9ca3af" }}
                                />
                                {option.label}
                              </button>
                            );
                          }
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => chooseOption(group.id, option.id)}
                              disabled={soldOut}
                              aria-pressed={active}
                              className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                soldOut
                                  ? "cursor-not-allowed border-background-200 bg-background-50 text-foreground-400 line-through"
                                  : active
                                    ? "cursor-pointer border-primary-700 bg-primary-700 text-background-50"
                                    : "cursor-pointer border-background-300 bg-background-50 text-foreground-700 hover:border-primary-300"
                              }`}
                            >
                              {option.label}
                              {option.priceDelta > 0 && (
                                <span className={active ? "ml-1.5 opacity-80" : "ml-1.5 text-foreground-500"}>
                                  +{formatPrice(option.priceDelta)}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <p className="flex items-center gap-1.5 text-[11px] text-foreground-500">
                  <i className={stock <= 0 ? "ri-error-warning-line" : "ri-information-line"} />
                  {stock <= 0
                    ? "Seçtiğiniz kombinasyon stokta yok, farklı bir seçenek deneyin."
                    : `Seçili varyant için ${stock} adet stokta. Sipariş adedi stokla sınırlıdır.`}
                </p>
              </div>
            )}

            {product.specs && product.specs.length > 0 && (
              <dl className="mt-5 grid grid-cols-1 gap-x-5 gap-y-2 rounded-xl border border-background-200 bg-background-100 p-4 text-xs sm:grid-cols-2">
                {product.specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-2 border-b border-background-200 pb-1.5 last:border-0">
                    <dt className="text-foreground-500">{spec.label}</dt>
                    <dd className="text-right font-medium text-foreground-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 items-center rounded-lg border border-background-300 sm:w-32">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Adet azalt"
                  className="flex h-full w-10 cursor-pointer items-center justify-center text-foreground-600 hover:text-foreground-950"
                >
                  <i className="ri-subtract-line" />
                </button>
                <span className="flex-1 text-center text-sm font-medium text-foreground-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                  aria-label="Adet artır"
                  className="flex h-full w-10 cursor-pointer items-center justify-center text-foreground-600 hover:text-foreground-950"
                >
                  <i className="ri-add-line" />
                </button>
              </div>

              <button
                type="button"
                disabled={stock <= 0}
                onClick={() => addToCart(product.id, Math.min(quantity, maxQuantity), { variantLabel, unitPrice: price })}
                className={`flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold shadow-sm transition-colors ${
                  stock <= 0
                    ? "cursor-not-allowed bg-background-200 text-foreground-500"
                    : "cursor-pointer bg-gradient-to-r from-primary-800 to-primary-600 text-background-50 hover:from-primary-700 hover:to-primary-500"
                }`}
              >
                <i className={stock <= 0 ? "ri-close-circle-line" : "ri-shopping-cart-2-line"} />
                {stock <= 0 ? "Stokta Yok" : "Sepete Ekle"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (product) toggleFavorite(product.id);
                }}
                aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                aria-pressed={favorite}
                className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                  favorite ? "border-accent-500 bg-accent-50 text-accent-700" : "border-background-300 text-foreground-600 hover:bg-background-100"
                }`}
              >
                <i className={favorite ? "ri-heart-3-fill" : "ri-heart-3-line"} />
              </button>
            </div>

            <DeliveryEstimate />

            <div className="mt-4 space-y-2 rounded-xl border border-background-200 bg-background-100 p-4 text-sm text-foreground-700">
              <p className="flex items-center gap-2">
                <i className="ri-truck-line text-base text-primary-700" />
                16:00'a kadar verilen siparişler aynı gün kargoda
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-arrow-go-back-line text-base text-primary-700" />
                14 gün içinde koşulsuz iade hakkı
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-shield-check-line text-base text-primary-700" />
                256-bit SSL ve 3D Secure ile güvenli ödeme
              </p>
              <PaymentBadges size="sm" className="pt-1" />
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-background-200 bg-background-50">
          <div className="flex gap-1 overflow-x-auto border-b border-background-200 px-3 pt-3">
            {tabs.map((tabLabel, index) => (
              <button
                key={tabLabel}
                type="button"
                onClick={() => setTab(index)}
                className={`whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === index
                    ? "border-b-2 border-primary-700 text-foreground-950"
                    : "text-foreground-500 hover:text-foreground-800"
                }`}
              >
                {tabLabel}
              </button>
            ))}
          </div>

          <div className="p-5 text-sm leading-relaxed text-foreground-700">
            {tab === 0 && (
              <div className="space-y-3">
                <p>
                  {product.description ??
                    `${product.name}, ${product.brand} kalitesiyle günlük kullanımda üstün performans sunar. Orijinal ürün garantisi ve faturalı satış ile birlikte gönderilir.`}
                </p>
                <p>
                  Kurumsal tedarik ekibimiz, proje bazlı keşif ve devreye alma desteği sunar. Ürün orijinal kutusu ve
                  aksesuarlarıyla birlikte faturalı olarak gönderilir.
                </p>
                <ul className="list-inside list-disc space-y-1.5">
                  <li>Orijinal kutu ve aksesuarları ile birlikte gönderilir.</li>
                  <li>Türkiye geneli distribütör garantisi ve teknik destek.</li>
                  <li>Aynı gün kargo ve kapıda ödeme seçeneği.</li>
                  <li>14 gün içinde koşulsuz iade hakkı.</li>
                </ul>
              </div>
            )}

            {tab === 1 && (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg border border-background-200">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ...(product.specs ?? []),
                        ...(groups.length > 0
                          ? [
                              {
                                label: "Varyantlar",
                                value: groups.map((group) => `${group.name}: ${group.options.length} seçenek`).join(" · "),
                              },
                              { label: "Stok Adedi", value: stockLabel(stock) },
                            ]
                          : []),
                        { label: "Marka", value: product.brand },
                        { label: "Garanti", value: "2 Yıl" },
                        { label: "Kutu İçeriği", value: "Ürün, kullanım kılavuzu, garanti belgesi" },
                        { label: "Stok Durumu", value: product.inStock ? "Stokta var" : "Stokta yok" },
                      ].map((row) => (
                        <tr key={row.label} className="border-b border-background-200 last:border-0 odd:bg-background-100/60">
                          <th
                            scope="row"
                            className="w-44 px-3 py-2.5 text-left align-top font-medium text-foreground-800"
                          >
                            {row.label}
                          </th>
                          <td className="px-3 py-2.5 text-foreground-600">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="flex items-start gap-2 text-xs text-foreground-500">
                  <i className="ri-information-line mt-0.5 text-sm text-primary-700" />
                  Teknik özellikler üretici verilerine göre özetlenmiştir. Proje bazlı konfigürasyon ve stok teyidi için
                  teknik ekibimizle iletişime geçebilirsiniz.
                </p>
              </div>
            )}

            {tab === 2 && (
              <ReviewsPanel
                productId={product.id}
                productName={product.name}
                baseReviews={allReviews.slice(0, 3)}
                baseRating={product.rating}
                baseReviewCount={product.reviewCount}
              />
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="mb-5 font-heading text-xl font-bold text-foreground-950">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
            {similarList.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </StoreLayout>
  );
}