import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import { useAuth } from "@/context/AuthContext";
import { formatDate, initialsOf } from "@/lib/accountFormat";
import ProfileTab from "@/pages/account/components/ProfileTab";
import AddressesTab from "@/pages/account/components/AddressesTab";
import InvoicesTab from "@/pages/account/components/InvoicesTab";
import BillingTab from "@/pages/account/components/BillingTab";
import SecurityTab from "@/pages/account/components/SecurityTab";
import SavedCartsTab from "@/pages/account/components/SavedCartsTab";

const tabs = [
  { id: "profil", label: "Profilim", icon: "ri-user-3-line" },
  { id: "adresler", label: "Adres & İletişim", icon: "ri-map-pin-2-line" },
  { id: "kaydedilen-sepetler", label: "Kaydedilen Sepetler", icon: "ri-bookmark-3-line" },
  { id: "faturalar", label: "Faturalarım", icon: "ri-file-text-line" },
  { id: "fatura-bilgileri", label: "Fatura Bilgileri", icon: "ri-receipt-line" },
  { id: "guvenlik", label: "Güvenlik & 2FA", icon: "ri-shield-keyhole-line" },
];

export default function AccountPage() {
  const { session, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("sekme") ?? "profil";

  useEffect(() => {
    if (!loading && !session) navigate("/giris", { replace: true });
  }, [loading, session, navigate]);

  const goTab = (id: string) => {
    const next = new URLSearchParams(params);
    next.set("sekme", id);
    setParams(next, { replace: true });
  };

  if (loading || !session) {
    return (
      <StoreLayout>
        <div className="flex min-h-[420px] items-center justify-center text-sm text-foreground-500">
          <i className="ri-loader-4-line mr-2 animate-spin text-lg" />
          Hesabınız yükleniyor...
        </div>
      </StoreLayout>
    );
  }

  const displayName = profile?.full_name || session.user.email?.split("@")[0] || "Değerli Müşterimiz";

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-5">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-500">
            <Link to="/" className="hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-foreground-800">Hesabım</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Hesabım</h1>
          <p className="mt-1 text-sm text-foreground-600">
            Profil, adres, fatura ve güvenlik ayarlarınızı tek ekrandan yönetin.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="space-y-3 lg:sticky lg:top-[278px]">
            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-800 to-primary-600 font-heading text-base font-bold text-background-50">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profil fotoğrafı" className="h-full w-full object-cover object-top" />
                  ) : (
                    initialsOf(profile?.full_name, session.user.email)
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground-950">{displayName}</p>
                  <p className="truncate text-xs text-foreground-500">{session.user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-background-100 px-2.5 py-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-500">Üyelik</span>
                <span className="text-[11px] font-medium text-foreground-800">{formatDate(profile?.created_at)}</span>
              </div>
            </div>

            <nav className="overflow-hidden rounded-xl border border-background-200 bg-background-50 p-1.5">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => goTab(tab.id)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-primary-50 font-semibold text-primary-900"
                        : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        active ? "bg-primary-700 text-background-50" : "bg-background-100 text-foreground-600"
                      }`}
                    >
                      <i className={`${tab.icon} text-[13px]`} />
                    </span>
                    <span className="flex-1 text-left">{tab.label}</span>
                    {active && <i className="ri-arrow-right-s-line text-foreground-500" />}
                  </button>
                );
              })}
              <div className="my-1.5 h-px bg-background-200" />
              <button
                type="button"
                onClick={() => void signOut().then(() => navigate("/giris", { replace: true }))}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-foreground-700 transition-colors hover:bg-primary-50 hover:text-primary-900"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-background-100 text-foreground-600">
                  <i className="ri-logout-box-r-line text-[13px]" />
                </span>
                Çıkış Yap
              </button>
            </nav>

            <div className="hidden rounded-xl border border-background-200 bg-background-50 p-4 lg:block">
              <p className="flex items-center gap-1.5 text-xs font-bold text-foreground-900">
                <i className="ri-customer-service-2-line text-primary-700" />
                Yardım mı gerekiyor?
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground-500">
                Sipariş ve teslimat sorularınız için destek ekibimize ulaşabilirsiniz.
              </p>
              <Link
                to="/kargo-takip"
                className="mt-2.5 inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-primary-700 hover:underline"
              >
                Kargo takibi <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </aside>

          <div className="min-w-0">
            {activeTab === "profil" && <ProfileTab />}
            {activeTab === "adresler" && <AddressesTab />}
            {activeTab === "kaydedilen-sepetler" && <SavedCartsTab />}
            {activeTab === "faturalar" && <InvoicesTab onGoBilling={() => goTab("fatura-bilgileri")} />}
            {activeTab === "fatura-bilgileri" && <BillingTab />}
            {activeTab === "guvenlik" && <SecurityTab />}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}