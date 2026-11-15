import type { AdminRoleDefinition, AdminRoleId, AdminSectionId, AdminStaff } from "@/types/adminRoles";

export const ALL_ADMIN_SECTIONS: AdminSectionId[] = [
  "dashboard",
  "products",
  "orders",
  "shipping",
  "whatsapp",
  "ai",
  "sms",
  "payments",
  "ads",
  "categories",
  "quicklinks",
  "announcement",
  "showcase-gunun",
  "showcase-haftanin",
  "showcase-kampanya",
  "showcase-gece",
  "showcase-avantajli",
  "customers",
  "campaigns",
  "reviews",
  "etbis",
  "tickets",
  "tasks",
  "activity",
  "settings",
  "footer",
  "pages",
  "bank",
  "security",
  "profile",
  "staff",
];

export const ADMIN_ROLES: AdminRoleDefinition[] = [
  {
    id: "yonetici",
    label: "Genel Yönetici",
    description: "Tüm ekranlara ve yönetici yönetimine tam erişim",
    icon: "ri-shield-star-line",
    sections: ALL_ADMIN_SECTIONS,
  },
  {
    id: "muhasebe",
    label: "Muhasebe",
    description: "Ciro, ödeme işlemleri, faturalar ve kampanya maliyetleri",
    icon: "ri-calculator-line",
    sections: ["dashboard", "orders", "payments", "ads", "campaigns", "customers", "bank"],
  },
  {
    id: "satis-temsilcisi",
    label: "Satış Temsilcisi",
    description: "Ürünler, siparişler, müşteriler ve kampanyalar",
    icon: "ri-user-voice-line",
    sections: ["dashboard", "products", "orders", "customers", "campaigns", "ads", "categories", "quicklinks", "announcement", "showcase-gunun", "showcase-haftanin", "showcase-kampanya", "showcase-gece", "showcase-avantajli", "reviews"],
  },
  {
    id: "teknik-destek",
    label: "Teknik Destek",
    description: "Teknik talepler, ürün soruları ve yorum yanıtları",
    icon: "ri-customer-service-2-line",
    sections: ["dashboard", "whatsapp", "ai", "reviews", "products", "settings", "footer", "tickets"],
  },
  {
    id: "satis-sonrasi-destek",
    label: "Satış Sonrası Destek",
    description: "Sipariş takibi, kargo durumu ve müşteri iletişimi",
    icon: "ri-service-line",
    sections: ["dashboard", "orders", "shipping", "tasks", "reviews", "customers", "whatsapp", "ai", "tickets"],
  },
  {
    id: "ticket-sorumlusu",
    label: "Ticket Sorumlusu",
    description: "Destek taleplerini yanıtlama, dosya inceleme ve talep takibi",
    icon: "ri-ticket-2-line",
    sections: ["dashboard", "tickets", "customers", "orders", "profile", "security"],
  },
  {
    id: "kargo-sorumlusu",
    label: "Kargo Sorumlusu",
    description: "Kargo firmaları, gönderiler, etiketler ve teslimat",
    icon: "ri-truck-line",
    sections: ["dashboard", "shipping", "orders", "tasks"],
  },
  {
    id: "depo-urun-sorumlusu",
    label: "Depo ve Ürün Sorumlusu",
    description: "Stok, ürün kartları, kategoriler ve sevkiyat",
    icon: "ri-archive-2-line",
    sections: ["dashboard", "products", "categories", "showcase-gunun", "showcase-haftanin", "showcase-kampanya", "showcase-gece", "showcase-avantajli", "shipping"],
  },
];

export const getRoleDefinition = (id: AdminRoleId): AdminRoleDefinition | undefined =>
  ADMIN_ROLES.find((role) => role.id === id);

export const roleLabel = (id: AdminRoleId): string => getRoleDefinition(id)?.label ?? id;

export const roleLabels = (roles: AdminRoleId[]): string[] => roles.map(roleLabel);

export const sectionsForRoles = (roles: AdminRoleId[]): AdminSectionId[] => {
  if (roles.length === 0) return [];
  const collected = new Set<AdminSectionId>();
  roles.forEach((roleId) => {
    const definition = getRoleDefinition(roleId);
    definition?.sections.forEach((section) => collected.add(section));
  });
  const sections = ALL_ADMIN_SECTIONS.filter((section) => collected.has(section));
  // Her yönetici kendi profil ve güvenlik (2FA) ekranına erişebilir.
  if (!sections.includes("security")) sections.push("security");
  if (!sections.includes("profile")) sections.push("profile");
  return sections;
};

export const canAccessSection = (member: AdminStaff | null, section: AdminSectionId): boolean => {
  if (!member || !member.active) return false;
  return sectionsForRoles(member.roles).includes(section);
};

export const sectionLabel = (section: AdminSectionId): string => {
  const map: Record<AdminSectionId, string> = {
    dashboard: "Genel Bakış",
    products: "Ürünler",
    orders: "Siparişler",
    shipping: "Kargo",
    whatsapp: "WhatsApp",
    ai: "Yapay Zeka Destek",
    sms: "SMS / NetGSM",
    payments: "Ödeme / iyzico",
    ads: "Reklam Yönetimi",
    categories: "Kategoriler",
    quicklinks: "Vitrin Kısayolları",
    announcement: "Duyuru Şeridi",
    "showcase-gunun": "Günün Ürünleri",
    "showcase-haftanin": "Haftanın Ürünleri",
    "showcase-kampanya": "Kampanya Vitrini",
    "showcase-gece": "Gece İndirimi",
    "showcase-avantajli": "Avantajlı Ürünler",
    customers: "Müşteriler",
    campaigns: "Kampanyalar",
    reviews: "Yorumlar",
    etbis: "ETBIS",
    footer: "Footer & İletişim",
    pages: "Sayfalar",
    bank: "Havale & Banka",
    tickets: "Destek Talepleri",
    tasks: "Görevler",
    activity: "İşlem Geçmişi",
    settings: "Ayarlar",
    security: "2FA Güvenliği",
    profile: "Profilim",
    staff: "Yöneticiler",
  };
  return map[section];
};