import { Pill } from "@/components/base/AdminUI";
import { roleLabels, sectionsForRoles } from "@/lib/adminRoles";
import type { AdminSectionId, AdminStaff } from "@/types/adminRoles";

interface AccountSummaryCardProps {
  staff: AdminStaff;
  onChangePassword: () => void;
  onOpenSection: (section: AdminSectionId) => void;
}

const formatDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
};

const formatDateTime = (value?: string): string => {
  if (!value) return "Henüz kayıt yok";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AccountSummaryCard({ staff, onChangePassword, onOpenSection }: AccountSummaryCardProps) {
  const sections = sectionsForRoles(staff.roles);

  const rows: Array<{ label: string; value: string; icon: string }> = [
    { label: "Hesap oluşturma", value: formatDate(staff.createdAt), icon: "ri-calendar-check-line" },
    { label: "Son giriş", value: formatDateTime(staff.lastLoginAt), icon: "ri-login-box-line" },
    { label: "Şifre güncelleme", value: formatDate(staff.passwordUpdatedAt), icon: "ri-lock-password-line" },
    {
      label: "İki adımlı doğrulama",
      value: staff.twoFactorEnabled ? `Açık · ${formatDate(staff.twoFactorEnabledAt)}` : "Kapalı",
      icon: "ri-shield-keyhole-line",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-background-200 bg-background-50">
        <div className="flex items-center gap-2 border-b border-background-200 px-4 py-3 md:px-5">
          <i className="ri-shield-user-line text-base text-primary-700" />
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-sm font-bold text-foreground-950">Rollerim ve Yetkim</h2>
            <p className="mt-0.5 text-xs text-foreground-500">Roller yalnızca genel yönetici tarafından değiştirilir.</p>
          </div>
          <Pill tone="info">{sections.length} ekran</Pill>
        </div>
        <div className="space-y-3 p-4 md:p-5">
          <div className="flex flex-wrap gap-1.5">
            {roleLabels(staff.roles).map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-1 text-[11px] font-semibold text-primary-900 dark:bg-primary-200 dark:text-primary-950"
              >
                <i className="ri-user-star-line" />
                {label}
              </span>
            ))}
          </div>
          <p className="text-[11px] leading-relaxed text-foreground-500">
            Yetkileriniz birleşik olarak uygulanır: birden fazla rolünüz varsa her rolün ekranları birlikte açılır.
          </p>

          <div className="space-y-2 border-t border-background-200 pt-3">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-1.5 text-xs text-foreground-500">
                  <i className={`${row.icon} text-sm text-foreground-400`} />
                  {row.label}
                </span>
                <span className="text-right text-xs font-medium text-foreground-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-background-200 bg-background-50">
        <div className="flex items-center gap-2 border-b border-background-200 px-4 py-3 md:px-5">
          <i className="ri-lock-2-line text-base text-primary-700" />
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-sm font-bold text-foreground-950">Hesap Güvenliği</h2>
            <p className="mt-0.5 text-xs text-foreground-500">Şifre ve iki adımlı doğrulama ayarlarınız.</p>
          </div>
        </div>
        <div className="space-y-3 p-4 md:p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onChangePassword}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-lock-password-line text-primary-700" />
              Şifremi Değiştir
            </button>
            <button
              type="button"
              onClick={() => onOpenSection("security")}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-shield-keyhole-line text-primary-700" />
              2FA Ayarları
            </button>
          </div>

          <div
            className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[11px] leading-relaxed ${
              staff.twoFactorEnabled
                ? "border-accent-300 bg-accent-50 text-accent-900"
                : "border-secondary-300 bg-secondary-100 text-secondary-950"
            }`}
          >
            <i className={`mt-0.5 text-sm ${staff.twoFactorEnabled ? "ri-shield-check-line" : "ri-error-warning-line"}`} />
            <div className="min-w-0 flex-1">
              {staff.twoFactorEnabled
                ? "İki adımlı doğrulama açık. Girişte şifrenizden sonra doğrulama kodu istenir."
                : "İki adımlı doğrulama kapalı. Hesabınızı korumak için 2FA Ayarları'ndan kurulum yapabilirsiniz."}
            </div>
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-foreground-500">
            <i className="ri-information-line" />
            Şifre gücü önerisi: en az 8 karakter, harf ve rakam birlikte.
          </p>
        </div>
      </section>
    </div>
  );
}