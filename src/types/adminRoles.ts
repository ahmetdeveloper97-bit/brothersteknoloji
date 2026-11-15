export type AdminSectionId =
  | "dashboard"
  | "products"
  | "orders"
  | "shipping"
  | "whatsapp"
  | "ai"
  | "sms"
  | "payments"
  | "ads"
  | "categories"
  | "quicklinks"
  | "announcement"
  | "showcase-gunun"
  | "showcase-haftanin"
  | "showcase-kampanya"
  | "showcase-gece"
  | "showcase-avantajli"
  | "customers"
  | "campaigns"
  | "reviews"
  | "etbis"
  | "footer"
  | "pages"
  | "bank"
  | "tickets"
  | "tasks"
  | "activity"
  | "settings"
  | "security"
  | "profile"
  | "staff";

export type AdminRoleId =
  | "yonetici"
  | "muhasebe"
  | "satis-temsilcisi"
  | "teknik-destek"
  | "satis-sonrasi-destek"
  | "kargo-sorumlusu"
  | "ticket-sorumlusu"
  | "depo-urun-sorumlusu";

export interface AdminRoleDefinition {
  id: AdminRoleId;
  label: string;
  description: string;
  icon: string;
  sections: AdminSectionId[];
}

export interface AdminStaffProfile {
  avatarUrl?: string;
  jobTitle?: string;
  city?: string;
  bio?: string;
  notifyEmail?: boolean;
  notifyTasks?: boolean;
  notifySms?: boolean;
}

export interface AdminStaff extends AdminStaffProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: AdminRoleId[];
  active: boolean;
  createdAt: string;
  passwordHash?: string;
  passwordUpdatedAt?: string;
  lastLoginAt?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorEnabledAt?: string;
}