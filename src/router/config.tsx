import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/home/page";
import UserLoginPage from "@/pages/auth/page";
import AuthCallbackPage from "@/pages/auth/callback/page";
import AccountPage from "@/pages/account/page";
import CategoryPage from "@/pages/category/page";
import ShowcasePage from "@/pages/showcase/page";
import ProductDetailPage from "@/pages/product/page";
import PcBuilderPage from "@/pages/pc-builder/page";
import FavoritesPage from "@/pages/favorites/page";
import TrackingPage from "@/pages/tracking/page";
import CheckoutPage from "@/pages/checkout/page";
import PaymentResultPage from "@/pages/checkout/result/page";
import SitePageView from "@/pages/site-page/page";
import BankAccountsPage from "@/pages/bank-accounts/page";
import ContactPage from "@/pages/contact/page";
import SupportPage from "@/pages/support/page";
import FaqPage from "@/pages/faq/page";
import PrivacyPolicyPage from "@/pages/legal/privacy/page";
import CookiePolicyPage from "@/pages/legal/cookies/page";
import AdminLoginPage from "@/pages/admin/login/page";
import AdminDashboardPage from "@/pages/admin/dashboard/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/giris",
    element: <UserLoginPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallbackPage />,
  },
  {
    path: "/hesabim",
    element: <AccountPage />,
  },
  {
    path: "/favoriler",
    element: <FavoritesPage />,
  },
  {
    path: "/kargo-takip",
    element: <TrackingPage />,
  },
  {
    path: "/odeme",
    element: <CheckoutPage />,
  },
  {
    path: "/odeme-sonuc",
    element: <PaymentResultPage />,
  },
  {
    path: "/gizlilik-politikasi",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/cerez-politikasi",
    element: <CookiePolicyPage />,
  },
  {
    path: "/sayfa/:slug",
    element: <SitePageView />,
  },
  {
    path: "/havale-banka-bilgileri",
    element: <BankAccountsPage />,
  },
  {
    path: "/iletisim",
    element: <ContactPage />,
  },
  {
    path: "/destek",
    element: <SupportPage />,
  },
  {
    path: "/sikca-sorulan-sorular",
    element: <FaqPage />,
  },
  {
    path: "/kategoriler",
    element: <CategoryPage />,
  },
  {
    path: "/kategoriler/:slug",
    element: <CategoryPage />,
  },
  {
    path: "/gunun-urunleri",
    element: <ShowcasePage showcaseKey="gunun" />,
  },
  {
    path: "/haftanin-urunleri",
    element: <ShowcasePage showcaseKey="haftanin" />,
  },
  {
    path: "/kampanyalar",
    element: <ShowcasePage showcaseKey="kampanya" />,
  },
  {
    path: "/gece-indirimi",
    element: <ShowcasePage showcaseKey="gece" />,
  },
  {
    path: "/avantajli-urunler",
    element: <ShowcasePage showcaseKey="avantajli" />,
  },
  {
    path: "/urunler/:slug",
    element: <ProductDetailPage />,
  },
  {
    path: "/pc-toplama",
    element: <PcBuilderPage />,
  },
  {
    path: "/arteadmin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/arteadmin",
    element: <AdminDashboardPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;