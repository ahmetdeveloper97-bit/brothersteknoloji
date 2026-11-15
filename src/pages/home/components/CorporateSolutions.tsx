import { Link } from "react-router-dom";

const solutions = [
  {
    icon: "ri-router-line",
    title: "Ağ & Wi-Fi Altyapısı",
    text: "Ofis, otel ve mağaza ağlarında router, access point ve switch seçimi ile yapılandırma desteği.",
    slug: "ag-urunleri",
  },
  {
    icon: "ri-hard-drive-3-line",
    title: "Sunucu & Depolama",
    text: "NAS, tower sunucu, kurumsal disk ve UPS bileşenleriyle yedekleme odaklı mimari kurulumu.",
    slug: "kurumsal-urunler",
  },
  {
    icon: "ri-shield-check-line",
    title: "IP Güvenlik Sistemleri",
    text: "Kamera, NVR ve geçiş kontrolü ürünlerinde keşif, projelendirme ve devreye alma desteği.",
    slug: "guvenlik-sistemleri",
  },
  {
    icon: "ri-customer-service-2-line",
    title: "Kurumsal Tedarik & Destek",
    text: "Proje bazlı fiyatlandırma, e-faturalı satış ve kurulum sonrası teknik destek hattı.",
    slug: "ag-urunleri",
  },
];

const brands = [
  "TP-Link",
  "Ubiquiti",
  "MikroTik",
  "Fortinet",
  "Cisco",
  "Synology",
  "QNAP",
  "HPE",
  "Dell",
  "Lenovo",
  "HP",
  "Asus",
  "Intel",
  "AMD",
  "Kingston",
  "Samsung",
  "Seagate",
  "Western Digital",
  "Hikvision",
  "Dahua",
  "Axis",
  "Zebra",
  "Honeywell",
  "APC",
  "Eaton",
  "Canon",
  "Epson",
  "Logitech",
  "Jabra",
  "Microsoft",
];

export default function CorporateSolutions() {
  return (
    <section className="py-10">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <div className="overflow-hidden rounded-3xl bg-foreground-950 text-background-50">
          <div className="grid grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-background-50/10 px-3 py-1 text-xs font-medium text-background-100">
                <i className="ri-building-4-line" />
                Kurumsal Çözümler
              </span>
              <h2 className="mt-4 font-heading text-2xl font-extrabold leading-tight md:text-3xl lg:text-4xl">
                Projenin tamamını tek adresten tedarik edin
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-background-200 md:text-base">
                2004'ten bu yana kurumsal ağ, sunucu ve güvenlik projelerinde ürün tedariki yapıyoruz. Marka bağımsız
                yaklaşımımızla ihtiyacınıza en uygun konfigürasyonu birlikte belirliyoruz.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-background-200">
                {[
                  "Üretici yetkili distribütör garantili ürünler",
                  "Proje bazlı fiyatlandırma ve stok teyidi",
                  "Kurulum öncesi keşif ve teknik şartname desteği",
                  "Devreye alma sonrası 7/24 destek hattı",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <i className="ri-checkbox-circle-fill mt-0.5 text-accent-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/kategoriler"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-background-50 px-5 py-2.5 text-sm font-semibold text-foreground-950 transition-transform hover:scale-105 dark:bg-background-950 dark:text-background-50"
                >
                  Kurumsal Kataloğu Gör
                  <i className="ri-arrow-right-line" />
                </Link>
                <Link
                  to="/iletisim"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-background-50/30 px-5 py-2.5 text-sm font-medium text-background-50 transition-colors hover:bg-background-50/10"
                >
                  <i className="ri-mail-send-line" />
                  Proje Talebi Gönder
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {solutions.map((solution) => (
                <Link
                  key={solution.title}
                  to={`/kategoriler/${solution.slug}`}
                  className="group rounded-2xl border border-background-50/10 bg-background-50/5 p-4 transition-colors hover:border-accent-400/40 hover:bg-background-50/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-background-50/10 text-accent-300">
                    <i className={`${solution.icon} text-lg`} />
                  </span>
                  <h3 className="mt-3 font-heading text-base font-semibold text-background-50">{solution.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-background-300">{solution.text}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-accent-300">
                    Ürünleri gör
                    <i className="ri-arrow-right-up-line" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-background-50/10 px-6 py-5 md:px-10">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background-400">
                Yetkili Satış · 30+ marka
              </span>
              {brands.map((brand) => (
                <span key={brand} className="text-sm font-medium text-background-200">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}