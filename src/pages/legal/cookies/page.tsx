import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LegalLayout from "@/pages/legal/components/LegalLayout";
import { formatCookieDate, useCookiePrefs } from "@/lib/cookieConsent";

const cookieRows = [
  {
    name: "cerez-onayi-v1",
    provider: "brothersteknoloji.com",
    purpose: "Çerez tercihlerinizi hatırlar, onay şeridinin tekrar gösterilmesini engeller.",
    duration: "12 ay",
    type: "Zorunlu",
  },
  {
    name: "sepet-verisi",
    provider: "brothersteknoloji.com",
    purpose: "Sepetinizdeki ürünleri ve adetlerini tarayıcınızda saklar.",
    duration: "30 gün",
    type: "Zorunlu",
  },
  {
    name: "favoriler",
    provider: "brothersteknoloji.com",
    purpose: "Beğendiğiniz ürünleri favori listesinde tutar.",
    duration: "12 ay",
    type: "Zorunlu",
  },
  {
    name: "tema-tercihi",
    provider: "brothersteknoloji.com",
    purpose: "Açık veya koyu tema seçiminizi korur.",
    duration: "12 ay",
    type: "Zorunlu",
  },
  {
    name: "_ga / _ga_*",
    provider: "Google Analytics",
    purpose: "Hangi sayfaların görüntülendiğini anonim olarak ölçer, ziyaret sayılarını raporlar.",
    duration: "24 ay",
    type: "Analitik",
  },
  {
    name: "_gcl_au",
    provider: "Google Ads",
    purpose: "Reklam kampanyalarının dönüşüm performansını ölçer.",
    duration: "3 ay",
    type: "Pazarlama",
  },
  {
    name: "_fbp",
    provider: "Meta",
    purpose: "İlgi alanınıza uygun ürün ve kampanya önerileri gösterir.",
    duration: "3 ay",
    type: "Pazarlama",
  },
];

const typeTone: Record<string, string> = {
  Zorunlu: "bg-background-100 text-foreground-600",
  Analitik: "bg-secondary-100 text-secondary-900",
  Pazarlama: "bg-accent-100 text-accent-900",
};

export default function CookiePolicyPage() {
  const [prefs, update] = useCookiePrefs();
  const [analytics, setAnalytics] = useState(prefs.analytics || !prefs.updatedAt);
  const [marketing, setMarketing] = useState(prefs.marketing || !prefs.updatedAt);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setAnalytics(prefs.analytics);
    setMarketing(prefs.marketing);
  }, [prefs.updatedAt, prefs.analytics, prefs.marketing]);

  const save = (next: { analytics: boolean; marketing: boolean }, message: string) => {
    update(next);
    setStatus(message);
  };

  return (
    <LegalLayout
      title="Çerez Politikası"
      subtitle="Hangi çerezleri neden kullandığımızı ve tercihlerinizi nasıl yönetebileceğinizi açıklıyoruz."
      updatedAt="12.09.2026"
    >
      <section>
        <h2 className="mb-2 font-heading text-base font-bold text-foreground-950">Çerez nedir?</h2>
        <p>
          Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza kaydedilen küçük metin dosyalarıdır.
          Sitenin çalışması, sepetinizin korunması, tercihlerinizin hatırlanması ve ziyaretlerin ölçülmesi için
          kullanılırlar. Çerezler kişisel dosyalarınıza erişemez ve virüs taşımazlar.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-heading text-base font-bold text-foreground-950">Çerez tercihleriniz</h2>
        <p className="mb-3">
          Aşağıdaki anahtarlarla hangi çerez kategorilerine izin vereceğinizi belirleyebilirsiniz. Zorunlu çerezler
          sitenin ve sepetin çalışması için gerektiğinden kapatılamaz.
        </p>

        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3 rounded-lg border border-background-200 bg-background-100 p-3.5">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground-950">
                Zorunlu çerezler
                <span className="rounded-full bg-background-50 px-2 py-0.5 text-[10px] font-semibold text-foreground-500">
                  Her zaman açık
                </span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600">
                Oturum, sepet, favoriler ve güvenlik işlemleri için gereklidir.
              </p>
            </div>
            <span className="relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full bg-primary-600/60">
              <span className="absolute left-[18px] h-4 w-4 rounded-full bg-background-50 shadow" />
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 rounded-lg border border-background-200 bg-background-50 p-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground-950">Analitik çerezler</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600">
                Ziyaret sayılarını ve sayfa performansını anonim olarak ölçmemizi sağlar.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={analytics}
              aria-label="Analitik çerezler"
              onClick={() => {
                setAnalytics((value) => !value);
                setStatus("");
              }}
              className={`relative mt-0.5 h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                analytics ? "bg-primary-600" : "bg-background-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-background-50 shadow transition-all ${
                  analytics ? "left-[18px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between gap-3 rounded-lg border border-background-200 bg-background-50 p-3.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground-950">Pazarlama çerezleri</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600">
                İlgi alanınıza uygun kampanya ve ürün önerileri göstermek için kullanılır.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={marketing}
              aria-label="Pazarlama çerezleri"
              onClick={() => {
                setMarketing((value) => !value);
                setStatus("");
              }}
              className={`relative mt-0.5 h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${
                marketing ? "bg-primary-600" : "bg-background-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-background-50 shadow transition-all ${
                  marketing ? "left-[18px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => save({ analytics, marketing }, "Tercihleriniz kaydedildi. Teşekkürler!")}
            className="w-full cursor-pointer whitespace-nowrap rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600 sm:w-auto"
          >
            Seçimlerimi kaydet
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: true, marketing: true }, "Tüm çerezler için onay verildi.")}
            className="w-full cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 py-2.5 text-xs font-semibold text-foreground-800 transition-colors hover:bg-background-100 sm:w-auto"
          >
            Tümünü kabul et
          </button>
          <button
            type="button"
            onClick={() => save({ analytics: false, marketing: false }, "Yalnızca zorunlu çerezler etkin.")}
            className="w-full cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 py-2.5 text-xs font-semibold text-foreground-800 transition-colors hover:bg-background-100 sm:w-auto"
          >
            Sadece zorunlular
          </button>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground-500">
          {status ? (
            <span className="flex items-center gap-1 font-medium text-accent-800">
              <i className="ri-check-line" />
              {status}
            </span>
          ) : (
            <span>Tercihleriniz bu tarayıcıda saklanır.</span>
          )}
          <span>Son kayıt: {formatCookieDate(prefs.updatedAt)}</span>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-heading text-base font-bold text-foreground-950">Kullandığımız çerezler</h2>
        <div className="overflow-x-auto rounded-lg border border-background-200">
          <table className="w-full min-w-[620px] border-collapse text-left text-xs">
            <thead className="bg-background-100 text-foreground-600">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Çerez</th>
                <th className="px-3 py-2.5 font-semibold">Sağlayıcı</th>
                <th className="px-3 py-2.5 font-semibold">Amaç</th>
                <th className="px-3 py-2.5 font-semibold">Süre</th>
                <th className="px-3 py-2.5 font-semibold">Tür</th>
              </tr>
            </thead>
            <tbody>
              {cookieRows.map((row) => (
                <tr key={row.name} className="border-t border-background-200 align-top">
                  <td className="px-3 py-2.5 font-mono text-[11px] text-foreground-900">{row.name}</td>
                  <td className="px-3 py-2.5 text-foreground-600">{row.provider}</td>
                  <td className="px-3 py-2.5 text-foreground-600">{row.purpose}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-foreground-600">{row.duration}</td>
                  <td className="px-3 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeTone[row.type]}`}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-heading text-base font-bold text-foreground-950">Tarayıcıdan çerez silme</h2>
        <p>
          Tarayıcı ayarlarınızdan mevcut çerezleri silebilir veya yeni çerezleri engelleyebilirsiniz. Zorunlu çerezleri
          engellemeniz halinde sepet ve üyelik işlemleri çalışmayabilir. Tercihlerinizi değiştirdikten sonra onay
          şeridi yeniden görünmez; ayarlarınızı bu sayfadan güncelleyebilirsiniz.
        </p>
        <p className="mt-2">
          Kişisel verilerin işlenmesine ilişkin detaylar için{" "}
          <Link to="/gizlilik-politikasi" className="font-medium text-primary-800 underline decoration-dotted">
            Gizlilik Politikası
          </Link>{" "}
          sayfamıza göz atabilirsiniz.
        </p>
      </section>
    </LegalLayout>
  );
}