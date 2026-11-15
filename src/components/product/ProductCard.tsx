import { Link } from "react-router-dom";
import FavoriteButton from "@/components/product/FavoriteButton";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import {
  defaultSelection,
  getVariantGroups,
  resolvedStock,
  selectionLabel,
  selectionPrice,
  selectionStock,
} from "@/lib/productVariants";
import type { Product } from "@/types/store";

const toneClasses: Record<string, string> = {
  discount: "bg-primary-700 text-background-50",
  accent: "bg-accent-50 text-accent-700 border border-accent-200",
  info: "bg-secondary-100 text-primary-700 border border-secondary-200",
  secondary: "bg-secondary-100 text-secondary-700 border border-secondary-200",
  warning: "bg-accent-100 text-accent-800 border border-accent-200",
  primary: "bg-primary-100 text-primary-800 border border-primary-200",
  new: "bg-background-100 text-accent-700",
};

interface ProductCardProps {
  product: Product;
  showNewLabel?: boolean;
}

export default function ProductCard({ product, showNewLabel = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const groups = getVariantGroups(product);
  const selection = defaultSelection(groups);
  const price = selectionPrice(product, groups, selection);
  const stock = selectionStock(groups, selection, resolvedStock(product));
  const colorGroup = groups.find((group) => group.type === "color");
  const capacityGroup = groups.find((group) => group.type === "capacity");

  const stockText = stock <= 0 ? "Stokta yok" : stock <= 5 ? `Son ${stock} adet` : "Stokta";
  const stockTone =
    stock <= 0 ? "text-foreground-500" : stock <= 5 ? "text-primary-700" : "text-accent-600";

  return (
    <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-background-200 bg-background-50 transition-all duration-300 hover:border-background-300 hover:shadow-lg">
      <Link
        to={`/urunler/${product.slug}`}
        aria-label={`${product.name} ürün detayına git`}
        className="absolute inset-0 z-[1]"
      />
      <div className="relative bg-background-100">
        <Link to={`/urunler/${product.slug}`} className="block aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            title={`${product.name} - ${product.brand}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-3.5rem)] flex-col gap-1">
          {discount > 0 && (
            <span className="w-fit rounded-md bg-primary-700 px-2 py-0.5 text-xs font-semibold text-background-50">
              %{discount}
            </span>
          )}
          <div className="flex flex-wrap gap-1.5">
            {product.tags
              .filter((tag) => tag.tone !== "new")
              .map((tag) => (
                <span
                  key={tag.label}
                  className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${
                    toneClasses[tag.tone] ?? "bg-secondary-100 text-secondary-700"
                  }`}
                >
                  {tag.label}
                </span>
              ))}
          </div>
        </div>
        <FavoriteButton productId={product.id} className="absolute right-2 top-2 z-10" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex-1 space-y-1">
          <p className="text-xs text-foreground-500">{product.brand}</p>
          <Link to={`/urunler/${product.slug}`}>
            <h3 className="line-clamp-2-safe min-h-[2.5rem] text-sm font-medium text-foreground-900 transition-colors group-hover:text-foreground-600 sm:text-base">
              {product.name}
            </h3>
          </Link>

          {colorGroup && colorGroup.options.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex items-center gap-1">
                {colorGroup.options.slice(0, 4).map((option) => (
                  <span
                    key={option.id}
                    title={option.label}
                    className="h-3.5 w-3.5 rounded-full border border-background-300"
                    style={{ backgroundColor: option.hex ?? "#9ca3af" }}
                  />
                ))}
              </div>
              {capacityGroup && capacityGroup.options.length > 1 && (
                <span className="text-[10px] text-foreground-500">
                  {capacityGroup.options.length} seçenek
                </span>
              )}
            </div>
          )}

          <p className={`flex items-center gap-1 text-xs ${stockTone}`}>
            <i className={stock <= 0 ? "ri-close-circle-line" : "ri-checkbox-circle-fill"} />
            {stockText}
          </p>
        </div>

        {showNewLabel && (
          <span className="w-fit text-[10px] font-semibold uppercase tracking-wide text-accent-700">Yeni</span>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground-950 sm:text-lg">{formatPrice(price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-foreground-500 line-through sm:text-sm">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={stock <= 0}
            onClick={() =>
              addToCart(product.id, 1, {
                variantLabel: selectionLabel(groups, selection),
                unitPrice: price,
              })
            }
            className={`relative z-10 flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium shadow-sm transition-all duration-300 ${
              stock <= 0
                ? "cursor-not-allowed bg-background-200 text-foreground-500"
                : "cursor-pointer bg-gradient-to-r from-primary-700 to-primary-600 text-background-50 hover:from-primary-600 hover:to-primary-500 hover:shadow-md"
            }`}
          >
            <i className={stock <= 0 ? "ri-close-circle-line" : "ri-shopping-cart-2-line"} />
            {stock <= 0 ? "Stokta Yok" : "Sepete Ekle"}
          </button>
        </div>
      </div>
    </article>
  );
}