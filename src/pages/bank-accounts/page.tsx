import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import BankAccountCard from "@/pages/bank-accounts/components/BankAccountCard";
import PaymentSteps from "@/pages/bank-accounts/components/PaymentSteps";
import { fetchBankAccounts, getBankAccounts } from "@/lib/bankAccounts";
import type { BankAccountsSettings } from "@/types/bankAccount";

const setMetaDescription = (value: string) => {
  if (!value) return;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
};

export default function BankAccountsPage() {
  const [settings, setSettings] = useState<BankAccountsSettings>(() => getBankAccounts());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await fetchBankAccounts();
      setSettings(next);
      if (next.accounts.filter((account) => account.active).length === 0) {
        setError("Henüz yayınlanmış bir banka hesabı bulunmuyor.");
      }
    } catch {
      setError("Banka bilgileri yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Havale / EFT ve Banka Bilgileri | Brothers Teknoloji";
    setMetaDescription(
      "Brothers Teknoloji havale ve EFT ile ödeme için banka hesap numaraları, IBAN bilgileri ve ödeme adımları.",
    );
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const accounts = settings.accounts.filter((account) => account.active);

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 md:py-9">
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-500">
            <Link to="/" className="cursor-pointer hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="font-semibold text-foreground-800">Havale / EFT Bilgileri</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            Havale / EFT ve Banka Bilgileri
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-foreground-600">{settings.intro}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-300 bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
              <i className="ri-shield-check-line" />
              Güvenli havale / EFT
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
              <i className="ri-time-line" />
              Ödeme onayı aynı gün
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
              <i className="ri-file-copy-line" />
              Tek tıkla IBAN kopyalama
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        {!settings.enabled && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-4 py-3 text-xs leading-relaxed text-secondary-950">
            <i className="ri-eye-off-line mt-0.5 text-base" />
            <span>
              Havale / EFT ile ödeme şu anda geçici olarak kullanılmıyor. Siparişleriniz için kart ile ödeme
              yapabilir veya destek ekibimizle iletişime geçebilirsiniz.
            </span>
          </div>
        )}

        {settings.notice && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-100 px-4 py-3 text-xs leading-relaxed text-secondary-950">
            <i className="ri-error-warning-line mt-0.5 text-base" />
            <span>{settings.notice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-[240px] animate-pulse rounded-xl border border-background-200 bg-background-100"
                  />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="rounded-xl border border-background-200 bg-background-50 p-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-foreground-400">
                  <i className="ri-bank-line text-2xl" />
                </span>
                <h2 className="mt-3 font-heading text-base font-bold text-foreground-950">Hesap bilgisi bulunamadı</h2>
                <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-foreground-600">
                  {error || "Havale ile ödeme için tanımlanmış bir banka hesabı yayınlanmamış."}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => void load()}
                    className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
                  >
                    <i className="ri-refresh-line" />
                    Tekrar dene
                  </button>
                  <Link
                    to="/kategoriler"
                    className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
                  >
                    <i className="ri-layout-grid-line" />
                    Ürünlere göz at
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {accounts.map((account) => (
                  <BankAccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-[278px]">
            <PaymentSteps />

            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
                <i className="ri-customer-service-2-line text-base text-primary-700" />
                Ödeme ile ilgili yardım
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
                Havale sonrası ödemeniz kısa süre içinde kontrol edilir. Dekontunuzu iletmek veya
                eşleşmeyen ödemeler için bize ulaşabilirsiniz.
              </p>
              <div className="mt-3 space-y-2">
                {settings.supportPhone && (
                  <a
                    href={`tel:${settings.supportPhone.replace(/\s+/g, "")}`}
                    className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 text-xs font-semibold text-background-50 hover:bg-primary-700"
                  >
                    <i className="ri-phone-line" />
                    {settings.supportPhone}
                  </a>
                )}
                {settings.supportEmail && (
                  <a
                    href={`mailto:${settings.supportEmail}`}
                    className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 text-xs font-medium text-foreground-700 hover:bg-background-100"
                  >
                    <i className="ri-mail-send-line" />
                    Dekont gönder
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-background-200 bg-background-50 p-3">
              <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                Faydalı bağlantılar
              </p>
              <div className="space-y-1">
                <Link
                  to="/kargo-takip"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground-700 transition-colors hover:bg-background-100 hover:text-foreground-950"
                >
                  <i className="ri-truck-line text-base text-foreground-400" />
                  <span className="min-w-0 flex-1 truncate">Sipariş / kargo takibi</span>
                  <i className="ri-arrow-right-s-line text-foreground-300" />
                </Link>
                <Link
                  to="/sayfa/mesafeli-satis-sozlesmesi"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground-700 transition-colors hover:bg-background-100 hover:text-foreground-950"
                >
                  <i className="ri-file-text-line text-base text-foreground-400" />
                  <span className="min-w-0 flex-1 truncate">Mesafeli satış sözleşmesi</span>
                  <i className="ri-arrow-right-s-line text-foreground-300" />
                </Link>
                <Link
                  to="/sayfa/mesafeli-satis-sozlesmesi"
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground-700 transition-colors hover:bg-background-100 hover:text-foreground-950"
                >
                  <i className="ri-arrow-go-back-line text-base text-foreground-400" />
                  <span className="min-w-0 flex-1 truncate">İade ve cayma koşulları</span>
                  <i className="ri-arrow-right-s-line text-foreground-300" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}