import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/base/Logo";
import ThemeToggle from "@/components/base/ThemeToggle";
import CategoryNav from "@/components/layout/CategoryNav";
import QuickLinksStrip, { QuickLinkBadge } from "@/components/layout/QuickLinksStrip";
import HeaderSearch from "@/components/layout/HeaderSearch";
import { useAuth } from "@/context/AuthContext";
import { initialsOf } from "@/lib/accountFormat";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useStoreCategories } from "@/hooks/useStoreCategories";
import { useQuickLinks } from "@/hooks/useQuickLinks";
import { useAnnouncementBanner } from "@/hooks/useAnnouncementBanner";
import { resolveQuickLinkHref } from "@/lib/quickLinks";

export default function Header() {
  const bannerLine = useAnnouncementBanner();
  const { count, openCart } = useCart();
  const { count: favoriteCount } = useFavorites();
  const { roots } = useStoreCategories();
  const quickLinks = useQuickLinks();
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);

  const isLoggedIn = Boolean(session);
  const accountLabel = isLoggedIn ? (profile?.full_name?.split(" ")[0] || "Hesabım") : "Hesap";

  const handleSignOut = async () => {
    setAccountOpen(false);
    setMobileOpen(false);
    await signOut();
    navigate("/");
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {bannerLine && (
          <div className="hidden h-9 items-center overflow-hidden bg-primary-900 text-primary-50 lg:flex">
            <div className="animate-marquee inline-flex whitespace-nowrap">
              <span className="px-2 text-[13px] font-medium tracking-wide">{bannerLine.repeat(6)}</span>
              <span className="px-2 text-[13px] font-medium tracking-wide">{bannerLine.repeat(6)}</span>
            </div>
          </div>
        )}

        <div className="w-full border-b border-background-200 bg-background-50">
          <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center gap-3 px-4">
            <Logo />

            <HeaderSearch className="mx-2 hidden min-w-0 flex-1 lg:block lg:max-w-md xl:max-w-xl" />

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Link
                to="/kategoriler"
                aria-label="Ürün ara"
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground-700 hover:bg-background-100 lg:hidden"
              >
                <i className="ri-search-line text-lg" />
              </Link>

              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((value) => !value)}
                  className="flex h-10 max-w-[150px] cursor-pointer items-center gap-2 rounded-md px-3 text-sm font-medium text-foreground-700 transition-colors hover:bg-background-100 hover:text-foreground-950"
                >
                  <i className="ri-user-3-line shrink-0 text-lg" />
                  <span className="min-w-0 truncate">{accountLabel}</span>
                  <i className={`shrink-0 ri-arrow-down-s-line transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                {accountOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Kapat"
                      onClick={() => setAccountOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <div className="absolute right-0 top-12 z-40 w-60 overflow-hidden rounded-xl border border-background-200 bg-background-50 py-2 shadow-xl animate-fadeUp">
                      {isLoggedIn ? (
                        <>
                          <div className="flex items-center gap-2.5 border-b border-background-200 px-4 pb-2.5 pt-1">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-700 text-xs font-bold text-background-50">
                              {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profil fotoğrafı" className="h-full w-full object-cover object-top" />
                              ) : (
                                initialsOf(profile?.full_name, session?.user.email)
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground-950">
                                {profile?.full_name || "Değerli Müşterimiz"}
                              </p>
                              <p className="truncate text-[11px] text-foreground-500">{session?.user.email}</p>
                            </div>
                          </div>
                          <Link
                            to="/hesabim"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-user-settings-line text-base" />
                            Hesabım
                          </Link>
                          <Link
                            to="/hesabim?sekme=faturalar"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-file-text-line text-base" />
                            Faturalarım
                          </Link>
                          <Link
                            to="/kargo-takip#siparislerim"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-truck-line text-base" />
                            Sipariş & Kargo
                          </Link>
                          <Link
                            to="/favoriler"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-heart-3-line text-base" />
                            Favorilerim
                          </Link>
                          <Link
                            to="/destek"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-customer-service-2-line text-base" />
                            Destek Merkezi
                          </Link>
                          <Link
                            to="/sikca-sorulan-sorular"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-question-line text-base" />
                            Sık Sorulan Sorular
                          </Link>
                          <Link
                            to="/iletisim"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-mail-line text-base" />
                            İletişim
                          </Link>
                          <div className="my-1 h-px bg-background-200" />
                          <button
                            type="button"
                            onClick={() => void handleSignOut()}
                            className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-foreground-700 hover:bg-background-100"
                          >
                            <i className="ri-logout-box-r-line text-base" />
                            Çıkış Yap
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/giris"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-login-box-line text-base" />
                            Giriş Yap
                          </Link>
                          <Link
                            to="/giris"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-user-add-line text-base" />
                            Üye Ol
                          </Link>
                          <div className="my-1 h-px bg-background-200" />
                          <Link
                            to="/kargo-takip#siparislerim"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-file-list-3-line text-base" />
                            Siparişlerim
                          </Link>
                          <Link
                            to="/kargo-takip"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-truck-line text-base" />
                            Kargo Takibi
                          </Link>
                          <Link
                            to="/favoriler"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-heart-3-line text-base" />
                            Favorilerim
                          </Link>
                          <div className="my-1 h-px bg-background-200" />
                          <Link
                            to="/destek"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-customer-service-2-line text-base" />
                            Destek Merkezi
                          </Link>
                          <Link
                            to="/sikca-sorulan-sorular"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-question-line text-base" />
                            Sık Sorulan Sorular
                          </Link>
                          <Link
                            to="/iletisim"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                          >
                            <i className="ri-mail-line text-base" />
                            İletişim
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>

              <Link
                to="/favoriler"
                aria-label="Favoriler"
                className="relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground-700 hover:bg-background-100 lg:flex"
              >
                <i className="ri-heart-3-line text-lg" />
                {favoriteCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-background-50">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                aria-label="Sepeti Görüntüle"
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-shopping-cart-2-line text-lg" />
                {count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-background-50">
                    {count}
                  </span>
                )}
              </button>

              <ThemeToggle className="hidden lg:flex" />

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Menü"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground-700 hover:bg-background-100 lg:hidden"
              >
                <i className="ri-menu-line text-xl" />
              </button>
            </div>
          </div>
        </div>

        <QuickLinksStrip />
        <CategoryNav />
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-primary-950/50" />
          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-background-50 shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-background-200 px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Menüyü kapat"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground-600 hover:bg-background-100"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <HeaderSearch
                variant="drawer"
                className="mb-4"
                onNavigate={() => setMobileOpen(false)}
              />
              {isLoggedIn && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-background-200 bg-background-100 px-3 py-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-700 text-xs font-bold text-background-50">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profil fotoğrafı" className="h-full w-full object-cover object-top" />
                    ) : (
                      <i className="ri-user-3-line" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground-950">
                      {profile?.full_name || "Değerli Müşterimiz"}
                    </p>
                    <p className="truncate text-[11px] text-foreground-500">{session?.user.email}</p>
                  </div>
                </div>
              )}
              <Link
                to="/pc-toplama"
                onClick={() => setMobileOpen(false)}
                className="mb-4 flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm font-semibold text-primary-800"
              >
                <i className="ri-cpu-line text-base" />
                Sistem Toplama
                <i className="ri-arrow-right-line ml-auto" />
              </Link>
              {quickLinks.length > 0 && (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-400">Öne çıkanlar</p>
                  <div className="mb-4 grid grid-cols-2 gap-1.5">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.id}
                        to={resolveQuickLinkHref(item)}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-50 px-2 py-2 text-xs font-medium text-foreground-800 transition-colors hover:bg-background-100"
                      >
                        <QuickLinkBadge item={item} size="sm" />
                        <span className="line-clamp-2 min-w-0 flex-1 leading-snug">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground-400">Kategoriler</p>
              <div className="space-y-1">
                {roots.map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/kategoriler/${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-100">
                          <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{category.name}</span>
                      </Link>
                      {category.children.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMobileCategory((current) => (current === category.id ? null : category.id))
                          }
                          aria-label={`${category.name} alt kategorilerini ${
                            openMobileCategory === category.id ? "kapat" : "aç"
                          }`}
                          aria-expanded={openMobileCategory === category.id}
                          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
                        >
                          <i
                            className={`text-base ${
                              openMobileCategory === category.id ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"
                            }`}
                          />
                        </button>
                      )}
                    </div>
                    {category.children.length > 0 && openMobileCategory === category.id && (
                      <div className="ml-11 space-y-0.5 border-l border-background-200 py-1 pl-2">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/kategoriler/${child.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="block truncate rounded-md px-2 py-1.5 text-xs text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 border-t border-background-200 pt-4">
                {isLoggedIn ? (
                  <>
                    <Link to="/hesabim" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                      <i className="ri-user-settings-line" /> Hesabım
                    </Link>
                    <Link to="/hesabim?sekme=faturalar" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                      <i className="ri-file-text-line" /> Faturalarım
                    </Link>
                  </>
                ) : (
                  <Link to="/giris" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                    <i className="ri-login-box-line" /> Giriş Yap / Üye Ol
                  </Link>
                )}
                <Link to="/favoriler" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                  <i className="ri-heart-3-line" /> Favorilerim
                  {favoriteCount > 0 && (
                    <span className="ml-auto rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-800">
                      {favoriteCount}
                    </span>
                  )}
                </Link>
                <Link to="/kargo-takip#siparislerim" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                  <i className="ri-file-list-3-line" /> Siparişlerim
                </Link>
                <Link to="/kargo-takip" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                  <i className="ri-truck-line" /> Kargo Takibi
                </Link>
                <Link to="/destek" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                  <i className="ri-customer-service-2-line" /> Destek Merkezi
                </Link>
                <Link to="/sikca-sorulan-sorular" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                  <i className="ri-question-line" /> Sık Sorulan Sorular
                </Link>
                <Link to="/iletisim" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-800 hover:bg-background-100">
                  <i className="ri-mail-line" /> İletişim
                </Link>
                {isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => void handleSignOut()}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2.5 text-sm text-foreground-700 hover:bg-background-100"
                  >
                    <i className="ri-logout-box-r-line" /> Çıkış Yap
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}