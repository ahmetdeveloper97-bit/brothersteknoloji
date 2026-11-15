import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/product/ProductCard";
import { useFavorites } from "@/context/FavoritesContext";
import { products } from "@/lib/catalog";
import type { Product } from "@/types/store";

const allProducts = products as Product[];

export default function FavoritesPage() {
  const { ids, clearFavorites } = useFavorites();
  const favorites = allProducts.filter((product) => ids.includes(product.id));
  const suggestions = allProducts.filter((product) => !ids.includes(product.id)).slice(0, 4);

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-6">
          <nav className="flex items-center gap-1.5 text-xs text-foreground-500">
            <Link to="/" className="hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-foreground-800">Favorilerim</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Favorilerim</h1>
          <p className="mt-1 text-sm text-foreground-600">
            {favorites.length > 0
              ? `Listenizde ${favorites.length} ürün var. Beğendiklerinizi sonra da buradan bulabilirsiniz.`
              : "Beğendiğiniz ürünleri kalp ikonuyla kaydedin, burada sizi beklesin."}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        {favorites.length > 0 ? (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-foreground-600">
                <strong className="font-semibold text-foreground-900">{favorites.length}</strong> ürün listeleniyor
              </p>
              <button
                type="button"
                onClick={clearFavorites}
                className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 py-2 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-delete-bin-6-line" />
                Listeyi Temizle
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {favorites.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-background-200 bg-background-50 px-6 py-16 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-600">
              <i className="ri-heart-3-line text-3xl" />
            </span>
            <h2 className="mt-4 font-heading text-lg font-bold text-foreground-950">Henüz favori ürününüz yok</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-foreground-600">
              Ürün kartlarındaki kalp ikonuna dokunarak beğendiğiniz ürünleri buraya ekleyebilirsiniz.
            </p>
            <Link
              to="/kategoriler"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 px-5 py-2.5 text-sm font-semibold text-background-50 hover:from-primary-700 hover:to-primary-500"
            >
              <i className="ri-shopping-bag-3-line" />
              Ürünlere Göz At
            </Link>
          </div>
        )}

        {suggestions.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground-950">
                {favorites.length > 0 ? "Bunlar da ilginizi çekebilir" : "Öne çıkan ürünler"}
              </h2>
              <Link to="/kategoriler" className="text-sm font-medium text-primary-700 hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
}