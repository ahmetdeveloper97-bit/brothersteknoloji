import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/product/ProductCard";
import HeroSlider from "@/pages/home/components/HeroSlider";
import CorporateSolutions from "@/pages/home/components/CorporateSolutions";
import ReviewsSection from "@/pages/home/components/ReviewsSection";
import { featuredProducts, newArrivalProducts } from "@/lib/showcase";
import { useStoreCategories } from "@/hooks/useStoreCategories";

const featured = featuredProducts;
const newArrivals = newArrivalProducts;

const trustItems = [
  { icon: "ri-truck-line", title: "Aynı Gün Kargo", text: "16:00'a kadar verilen siparişler aynı gün kargoda" },
  { icon: "ri-arrow-go-back-line", title: "14 Gün İade", text: "Koşulsuz iade ve değişim hakkı" },
  { icon: "ri-shield-check-line", title: "Güvenli Ödeme", text: "256-bit SSL ile 3D Secure koruması" },
  { icon: "ri-customer-service-2-line", title: "Teknik Destek", text: "Keşif, projelendirme ve kurulum desteği" },
];

export default function HomePage() {
  const { homeCategories } = useStoreCategories();

  return (
    <StoreLayout>
      <h1 className="sr-only">Kurumsal Teknoloji - Ağ, Sunucu ve Güvenlik Çözümleri</h1>
      <HeroSlider />

      <section className="mx-auto w-full max-w-[1320px] px-4 pb-2">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-background-200 bg-background-50 p-4 md:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background-100 text-primary-700">
                <i className={`${item.icon} text-lg`} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground-900">{item.title}</p>
                <p className="mt-0.5 hidden text-xs leading-snug text-foreground-500 sm:block">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background-50 py-8">
        <div className="mx-auto w-full max-w-[1320px] px-4">
          <div className="mb-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Öne Çıkan Ürünler</h2>
            <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-primary-800 to-primary-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 lg:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/kategoriler"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-6 py-2.5 text-sm font-medium text-foreground-800 transition-colors hover:bg-background-100"
            >
              Tüm Ürünleri Görüntüle
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </section>

      <CorporateSolutions />

      <section className="pb-4 pt-2">
        <div className="mx-auto w-full max-w-[1320px] px-4">
          <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Öne Çıkan Kategoriler</h2>
              <p className="mt-1 text-sm text-foreground-600">
                Ağ, sunucu ve güvenlik ürünleri ana kategori sırasına göre listelenir.
              </p>
            </div>
            <Link
              to="/kategoriler"
              className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-primary-700 hover:underline"
            >
              Tüm kategoriler
              <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
            {homeCategories.map((category) => (
              <Link
                key={category.id}
                to={`/kategoriler/${category.slug}`}
                className="group overflow-hidden rounded-xl border border-background-200 bg-background-50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-background-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    title={`${category.name} kategorisi`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary-950/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-md bg-background-50/90 px-3 py-1.5 text-xs font-semibold text-foreground-900">
                      Keşfet
                    </span>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="truncate text-center text-xs font-medium text-foreground-900 sm:text-sm">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-100 py-10">
        <div className="mx-auto w-full max-w-[1320px] px-4">
          <div className="mb-8 flex flex-col items-center justify-between gap-2 sm:flex-row">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Yeni Gelenler</h2>
              <p className="mt-1 text-sm text-foreground-600">Bu hafta kataloğa eklenen yeni ürünler.</p>
            </div>
            <Link
              to="/kategoriler"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-4 py-2 text-sm font-medium text-foreground-800 hover:bg-background-50/60"
            >
              Tüm Ürünleri Gör
              <i className="ri-arrow-right-line" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} showNewLabel />
            ))}
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="pb-10">
        <div className="mx-auto w-full max-w-[1320px] px-4">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="https://readdy.ai/api/search-image?query=corporate%20network%20infrastructure%20banner%20with%20switches%20and%20fiber%20optic%20cables%20in%20modern%20server%20room%2C%20cool%20neutral%20tones%2C%20professional%20technology%20advertising%20photography&width=1920&height=600&seq=store-banner-network-cta-02&orientation=landscape&nocache=true"
              alt="Kurumsal ağ projeleri"
              title="Kurumsal Ağ Projeleri"
              className="h-56 w-full object-cover sm:h-72"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-950/85 via-primary-950/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">Proje tedariki</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold text-background-50 dark:text-background-950 sm:text-4xl">
                Kurumsal Ağ Projeleri
              </h2>
              <p className="mt-2 max-w-sm text-sm text-background-100 dark:text-background-800">
                Switch, access point ve güvenlik duvarı seçiminde teknik ekibimizden destek alın.
              </p>
              <Link
                to="/kategoriler/ag-urunleri"
                className="mt-4 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-background-50 px-5 py-2.5 text-sm font-semibold text-foreground-950 hover:bg-background-100 dark:bg-background-950 dark:text-background-50"
              >
                Network Ürünlerini İncele
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}