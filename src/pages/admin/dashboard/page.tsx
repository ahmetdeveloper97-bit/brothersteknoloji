import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/pages/admin/components/AdminSidebar";
import AdminTopbar from "@/pages/admin/components/AdminTopbar";
import StatCards from "@/pages/admin/components/StatCards";
import SalesChart from "@/pages/admin/components/SalesChart";
import OrdersTable from "@/pages/admin/components/OrdersTable";
import ProductsTable from "@/pages/admin/components/ProductsTable";
import TopProducts from "@/pages/admin/components/TopProducts";
import WhatsAppPanel from "@/pages/admin/whatsapp/WhatsAppPanel";
import AiSupportPanel from "@/pages/admin/ai/AiSupportPanel";
import NetgsmPanel from "@/pages/admin/netgsm/NetgsmPanel";
import IyzicoPanel from "@/pages/admin/iyzico/IyzicoPanel";
import AdsPanel from "@/pages/admin/ads/AdsPanel";
import ShippingPanel from "@/pages/admin/shipping/ShippingPanel";
import CategoriesPanel from "@/pages/admin/categories/CategoriesPanel";
import QuickLinksPanel from "@/pages/admin/quicklinks/QuickLinksPanel";
import AnnouncementPanel from "@/pages/admin/announcement/AnnouncementPanel";
import ShowcasePanel from "@/pages/admin/showcase/ShowcasePanel";
import CustomersPanel from "@/pages/admin/customers/CustomersPanel";
import CampaignsPanel from "@/pages/admin/campaigns/CampaignsPanel";
import ReviewsPanel from "@/pages/admin/reviews/ReviewsPanel";
import EtbisPanel from "@/pages/admin/etbis/EtbisPanel";
import FooterPanel from "@/pages/admin/footer/FooterPanel";
import PagesPanel from "@/pages/admin/pages/PagesPanel";
import BankAccountsPanel from "@/pages/admin/bank/BankAccountsPanel";
import TicketsPanel from "@/pages/admin/tickets/TicketsPanel";
import SettingsPanel from "@/pages/admin/settings/SettingsPanel";
import TwoFactorPanel from "@/pages/admin/security/TwoFactorPanel";
import StaffPanel from "@/pages/admin/staff/StaffPanel";
import ActivityPanel from "@/pages/admin/activity/ActivityPanel";
import SupportTasksPanel from "@/pages/admin/tasks/SupportTasksPanel";
import ProfilePanel from "@/pages/admin/profile/ProfilePanel";
import ChangePasswordModal from "@/pages/admin/components/ChangePasswordModal";
import { logActivity } from "@/lib/activity";
import { adminLogout, loadAdminSession, refreshStaff } from "@/lib/adminStaffStore";
import { roleLabels, sectionsForRoles } from "@/lib/adminRoles";
import type { AdminSectionId, AdminStaff } from "@/types/adminRoles";

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Genel Bakış", subtitle: "Mağazanızın güncel performans özeti" },
  products: { title: "Ürünler", subtitle: "Ürün kataloğunuzu yönetin" },
  orders: { title: "Siparişler", subtitle: "Sipariş durumlarını takip edin" },
  shipping: { title: "Kargo Yönetimi", subtitle: "Tüm kargo firmaları, gönderiler ve etiketler" },
  whatsapp: { title: "WhatsApp Modülleri", subtitle: "Sepet hatırlatma ve canlı destek yönetimi" },
  ai: { title: "Yapay Zeka Destek", subtitle: "Canlı destek asistanı, sağlayıcı ve API ayarları" },
  sms: { title: "NetGSM Entegrasyonu", subtitle: "Toplu SMS, kişi, şablon ve rapor yönetimi" },
  payments: { title: "Ödeme Altyapısı", subtitle: "iyzico sanal POS işlemleri ve taksit ayarları" },
  ads: { title: "Reklam Yönetimi", subtitle: "Google Ads ve Meta Ads kampanyaları, harcama ve dönüşüm takibi" },
  categories: { title: "Kategoriler", subtitle: "Kategori ağacınızı düzenleyin" },
  quicklinks: { title: "Vitrin Kısayolları", subtitle: "Menü üstündeki yuvarlak rozetleri ve bağlantılarını yönetin" },
  announcement: { title: "Duyuru Şeridi", subtitle: "Menünün üstünde kayan duyuru metinlerini yönetin" },
  "showcase-gunun": { title: "Günün Ürünleri", subtitle: "Günün vitrin sayfasının başlığını, görselini ve ürünlerini yönetin" },
  "showcase-haftanin": { title: "Haftanın Ürünleri", subtitle: "Haftanın vitrin sayfasının başlığını, görselini ve ürünlerini yönetin" },
  "showcase-kampanya": { title: "Kampanya Vitrini", subtitle: "Kampanyalar sayfasının başlığını, görselini ve ürünlerini yönetin" },
  "showcase-gece": { title: "Gece İndirimi", subtitle: "Saat 23:59'da açılan gece indirimi ürünlerini ve saat aralığını yönetin" },
  "showcase-avantajli": { title: "Avantajlı Ürünler", subtitle: "Avantajlı ürünler sayfasının başlığını, görselini ve ürünlerini yönetin" },
  customers: { title: "Müşteriler", subtitle: "Müşteri listesi ve segmentler" },
  campaigns: { title: "Kampanyalar", subtitle: "İndirim ve kupon yönetimi" },
  reviews: { title: "Yorumlar", subtitle: "Müşteri yorumlarını yönetin" },
  etbis: { title: "ETBIS Modülü", subtitle: "ETBIS kayıt bilgileri ve güven QR kodu" },
  footer: { title: "Footer & İletişim", subtitle: "Mağaza alt bilgisi, iletişim kanalları ve link kolonları" },
  pages: { title: "Sayfalar", subtitle: "Site için kurumsal sayfalar oluşturun ve yayınlayın" },
  bank: { title: "Havale & Banka", subtitle: "Havale/EFT hesaplarınızı ve ödeme açıklamalarını yönetin" },
  tickets: { title: "Destek Talepleri", subtitle: "Müşteri taleplerini yanıtlayın, dosyaları inceleyin ve durumu güncelleyin" },
  tasks: { title: "Görevler", subtitle: "Kargo sevkiyatlarından gelen otomatik destek görevleri" },
  activity: { title: "İşlem Geçmişi", subtitle: "Yönetici giriş/çıkışları ve panel işlemleri" },
  settings: { title: "Ayarlar", subtitle: "Mağaza ve entegrasyon ayarları" },
  security: { title: "2FA Güvenliği", subtitle: "İki adımlı doğrulama ile hesabınızı koruyun" },
  profile: { title: "Profilim", subtitle: "Kişisel bilgileriniz, fotoğrafınız ve hesap güvenliğiniz" },
  staff: { title: "Yöneticiler", subtitle: "Personel ekleyin ve rollerini belirleyin" },
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<AdminSectionId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [staffMember, setStaffMember] = useState<AdminStaff | null>(null);
  const [version, setVersion] = useState(0);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolveSession = async () => {
      const session = await loadAdminSession();
      if (cancelled) return;
      if (!session.member) {
        navigate("/arteadmin/login", { replace: true });
        return;
      }
      setStaffMember(session.member);
      setReady(true);
      void refreshStaff();
    };

    void resolveSession();
    return () => {
      cancelled = true;
    };
  }, [navigate, version]);

  const allowedSections: AdminSectionId[] = useMemo(
    () => (staffMember ? sectionsForRoles(staffMember.roles) : []),
    [staffMember],
  );

  useEffect(() => {
    if (!staffMember) return;
    if (!allowedSections.includes(active)) {
      setActive(allowedSections[0] ?? "dashboard");
    }
  }, [staffMember, allowedSections, active]);

  const logout = () => {
    logActivity({ category: "auth", action: "Panelden çıkış yaptı", target: "Yönetim paneli", detail: "Oturum güvenli şekilde kapatıldı" });
    void adminLogout();
    navigate("/arteadmin/login", { replace: true });
  };

  if (!ready || !staffMember) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-100">
        <span className="flex items-center gap-2 text-sm text-foreground-500">
          <i className="ri-loader-4-line animate-spin text-lg" />
          Yetkileriniz kontrol ediliyor...
        </span>
      </div>
    );
  }

  const meta = pageMeta[active] ?? pageMeta.dashboard;
  const allowed = (section: AdminSectionId) => allowedSections.includes(section);

  return (
    <div className="flex min-h-screen bg-background-100">
      <AdminSidebar
        active={active}
        onChange={(id) => setActive(id as AdminSectionId)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={logout}
        allowedSections={allowedSections}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          title={meta.title}
          subtitle={meta.subtitle}
          adminEmail={staffMember.email}
          adminName={staffMember.name}
          adminRoles={roleLabels(staffMember.roles)}
          adminAvatarUrl={staffMember.avatarUrl}
          onOpenMobile={() => setMobileOpen(true)}
          onChangePassword={() => setPasswordOpen(true)}
          onOpenProfile={() => setActive("profile")}
          onOpenSecurity={() => setActive("security")}
          onOpenTasks={allowedSections.includes("tasks") ? () => setActive("tasks") : undefined}
        />

        <main className="flex-1 space-y-4 p-4 md:p-6">
          {allowed("dashboard") && active === "dashboard" && (
            <>
              <StatCards />
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <SalesChart />
                </div>
                <TopProducts />
              </div>
              <OrdersTable />
            </>
          )}

          {allowed("products") && active === "products" && <ProductsTable />}

          {allowed("whatsapp") && active === "whatsapp" && <WhatsAppPanel />}

          {allowed("ai") && active === "ai" && <AiSupportPanel />}

          {allowed("sms") && active === "sms" && <NetgsmPanel />}

          {allowed("payments") && active === "payments" && <IyzicoPanel />}

          {allowed("ads") && active === "ads" && <AdsPanel />}

          {allowed("shipping") && active === "shipping" && <ShippingPanel />}

          {allowed("orders") && active === "orders" && (
            <>
              <StatCards />
              <OrdersTable />
            </>
          )}

          {allowed("categories") && active === "categories" && <CategoriesPanel />}

          {allowed("quicklinks") && active === "quicklinks" && <QuickLinksPanel />}

          {allowed("announcement") && active === "announcement" && <AnnouncementPanel />}

          {allowed("showcase-gunun") && active === "showcase-gunun" && <ShowcasePanel pageKey="gunun" />}

          {allowed("showcase-haftanin") && active === "showcase-haftanin" && (
            <ShowcasePanel pageKey="haftanin" />
          )}

          {allowed("showcase-kampanya") && active === "showcase-kampanya" && (
            <ShowcasePanel pageKey="kampanya" />
          )}

          {allowed("showcase-gece") && active === "showcase-gece" && <ShowcasePanel pageKey="gece" />}

          {allowed("showcase-avantajli") && active === "showcase-avantajli" && (
            <ShowcasePanel pageKey="avantajli" />
          )}

          {allowed("customers") && active === "customers" && <CustomersPanel />}

          {allowed("campaigns") && active === "campaigns" && <CampaignsPanel />}

          {allowed("reviews") && active === "reviews" && <ReviewsPanel />}

          {allowed("etbis") && active === "etbis" && <EtbisPanel />}

          {allowed("footer") && active === "footer" && (
            <FooterPanel onNavigate={(id) => setActive(id as AdminSectionId)} />
          )}

          {allowed("pages") && active === "pages" && <PagesPanel />}

          {allowed("bank") && active === "bank" && <BankAccountsPanel />}

          {allowed("tickets") && active === "tickets" && <TicketsPanel />}

          {allowed("activity") && active === "activity" && <ActivityPanel />}

          {allowed("tasks") && active === "tasks" && <SupportTasksPanel />}

          {allowed("settings") && active === "settings" && (
            <SettingsPanel onNavigate={(id) => setActive(id as AdminSectionId)} />
          )}

          {allowed("security") && active === "security" && (
            <TwoFactorPanel staff={staffMember} onChanged={() => setVersion((value) => value + 1)} />
          )}

          {allowed("profile") && active === "profile" && (
            <ProfilePanel
              staff={staffMember}
              onChanged={() => setVersion((value) => value + 1)}
              onOpenSection={(section) => setActive(section)}
            />
          )}

          {allowed("staff") && active === "staff" && (
            <StaffPanel currentStaffId={staffMember.id} onChanged={() => setVersion((value) => value + 1)} />
          )}
        </main>
      </div>

      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  );
}