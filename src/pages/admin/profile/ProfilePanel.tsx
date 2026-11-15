import { useState } from "react";
import { Pill } from "@/components/base/AdminUI";
import ProfilePhotoCard from "@/pages/admin/profile/components/ProfilePhotoCard";
import ProfileInfoCard from "@/pages/admin/profile/components/ProfileInfoCard";
import AccountSummaryCard from "@/pages/admin/profile/components/AccountSummaryCard";
import MyRecentActivity from "@/pages/admin/profile/components/MyRecentActivity";
import ChangePasswordModal from "@/pages/admin/components/ChangePasswordModal";
import { roleLabels } from "@/lib/adminRoles";
import { staffInitials } from "@/lib/adminStaffStore";
import type { AdminSectionId, AdminStaff } from "@/types/adminRoles";

interface ProfilePanelProps {
  staff: AdminStaff;
  onChanged: () => void;
  onOpenSection: (section: AdminSectionId) => void;
}

export default function ProfilePanel({ staff, onChanged, onOpenSection }: ProfilePanelProps) {
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-background-200 bg-background-50">
        <div className="flex flex-col gap-4 bg-primary-800 px-4 py-5 text-background-50 sm:flex-row sm:items-center md:px-6">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background-50/40 bg-background-50/15">
            {staff.avatarUrl ? (
              <img
                src={staff.avatarUrl}
                alt={`${staff.name} profil fotoğrafı`}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <span className="font-heading text-base font-bold">{staffInitials(staff.name)}</span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-heading text-lg font-bold md:text-xl">{staff.name}</h2>
            <p className="truncate text-xs text-background-50/80">
              {staff.jobTitle?.trim() ? staff.jobTitle : "Yönetici"} · {staff.email}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {roleLabels(staff.roles).map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-background-50/15 px-2 py-0.5 text-[10px] font-semibold text-background-50"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <Pill tone={staff.twoFactorEnabled ? "success" : "warning"}>
              <i className={staff.twoFactorEnabled ? "ri-shield-check-line" : "ri-shield-keyhole-line"} />
              {staff.twoFactorEnabled ? "2FA açık" : "2FA kapalı"}
            </Pill>
            <span className="text-[10px] text-background-50/70">Hesap durumu: {staff.active ? "Aktif" : "Pasif"}</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <ProfilePhotoCard staff={staff} onChanged={onChanged} />
          <ProfileInfoCard staff={staff} onChanged={onChanged} />
        </div>
        <AccountSummaryCard
          staff={staff}
          onChangePassword={() => setPasswordOpen(true)}
          onOpenSection={onOpenSection}
        />
      </div>

      <MyRecentActivity staff={staff} />

      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} onSaved={onChanged} />
    </div>
  );
}