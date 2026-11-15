import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCookiePrefs } from "@/lib/cookieConsent";

export default function CookieConsent() {
  const { pathname } = useLocation();
  const [prefs, save] = useCookiePrefs();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  if (prefs.decided) return null;
  if (pathname.startsWith("/arteadmin")) return null;
  if (pathname.startsWith("/cerez-politikasi")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-3 pb-3 md:px-4 md:pb-4">
      <div className="animate-fadeUp mx-auto w-full max-w-[1320px] overflow-hidden rounded-2xl border border-background-200 bg-background-50 shadow-2xl">
        <div className="flex flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <i className="ri-shield-keyhole-line text-xl" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground-950">Çerez tercihlerinizi birlikte belirleyelim</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground-600 md:text-[13px]">
                Alışveriş deneyimini iyileştirmek, sepetinizi hatırlamak ve size daha uygun ürünler göstermek için
                çerezler kullanıyoruz. Detayları inceleyebilir, dilerseniz yalnızca zorunlu çerezlerle devam
                edebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => setDetailsOpen((value) => !value)}
                className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-600"
              >
                <i className={`${detailsOpen ? "ri-subtract-line" : "ri-add-line"} text-sm`} />
                {detailsOpen ? "Detayları gizle" : "Detayları incele"}
              </button>
              <Link
                to="/cerez-politikasi"
                className="ml-3 mt-2 inline-flex items-center gap-1 text-xs font-semibold text-foreground-600 underline decoration-dotted hover:text-foreground-900"
              >
                Çerez politikası
              </Link>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
            <button
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
              className="w-full cursor-pointer whitespace-nowrap rounded-xl border border-background-300 px-5 py-2.5 text-sm font-semibold text-foreground-800 transition-colors hover:bg-background-100 sm:w-auto"
            >
              Sadece zorunlu
            </button>
            <button
              type="button"
              onClick={() => save({ analytics: true, marketing: true })}
              className="w-full cursor-pointer whitespace-nowrap rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-background-50 shadow-sm transition-colors hover:bg-primary-700 sm:w-auto"
            >
              Onaylıyorum
            </button>
          </div>
        </div>

        {detailsOpen && (
          <div className="border-t border-background-200 bg-background-100/70 px-4 py-4 md:px-5 animate-fadeUp">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-background-200 bg-background-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground-900">Zorunlu çerezler</p>
                  <span className="rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-semibold text-foreground-500">
                    Her zaman açık
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
                  Oturum, sepet ve güvenlik işlemleri için gereklidir. Kapatılamaz.
                </p>
              </div>

              <div className="rounded-xl border border-background-200 bg-background-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground-900">Analitik</p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={analytics}
                    aria-label="Analitik çerezler"
                    onClick={() => setAnalytics((value) => !value)}
                    className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
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
                <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
                  Hangi sayfaların ilgi çektiğini anonim olarak ölçmemize yardımcı olur.
                </p>
              </div>

              <div className="rounded-xl border border-background-200 bg-background-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-foreground-900">Pazarlama</p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={marketing}
                    aria-label="Pazarlama çerezleri"
                    onClick={() => setMarketing((value) => !value)}
                    className={`relative h-5 w-9 cursor-pointer rounded-full transition-colors ${
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
                <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
                  İlgi alanınıza uygun kampanya ve ürün önerileri göstermemizi sağlar.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-foreground-500">
                Tercihleriniz bu tarayıcıda saklanır, dilediğiniz zaman değiştirebilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => save({ analytics, marketing })}
                className="w-full cursor-pointer whitespace-nowrap rounded-lg bg-foreground-950 px-4 py-2 text-xs font-semibold text-background-50 transition-opacity hover:opacity-90 sm:w-auto"
              >
                Seçimlerimi kaydet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}