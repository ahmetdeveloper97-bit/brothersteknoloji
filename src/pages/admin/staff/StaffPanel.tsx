import { useEffect, useMemo, useState } from "react";
import { Banner, Panel, Pill } from "@/components/base/AdminUI";
import StaffFormModal from "@/pages/admin/staff/StaffFormModal";
import PasswordResetModal from "@/pages/admin/staff/PasswordResetModal";
import { ADMIN_ROLES, roleLabel, sectionsForRoles } from "@/lib/adminRoles";
import { loadStaff, refreshStaff, saveStaff, setStaffPassword, staffInitials } from "@/lib/adminStaffStore";
import { logActivity } from "@/lib/activity";
import type { AdminStaff } from "@/types/adminRoles";

interface StaffPanelProps {
  currentStaffId: string;
  onChanged: () => void;
}

export default function StaffPanel({ currentStaffId, onChanged }: StaffPanelProps) {
  const [staff, setStaff] = useState<AdminStaff[]>(() => loadStaff());
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminStaff | null>(null);
  const [message, setMessage] = useState("");
  const [resetTarget, setResetTarget] = useState<AdminStaff | null>(null);

  useEffect(() => {
    let cancelled = false;
    void refreshStaff().then((list) => {
      if (!cancelled) setStaff(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeOwners = staff.filter((member) => member.active && member.roles.includes("yonetici"));
  const isLastOwner = (member: AdminStaff) =>
    member.roles.includes("yonetici") && activeOwners.length <= 1 && member.active;

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    if (!needle) return staff;
    return staff.filter(
      (member) =>
        member.name.toLocaleLowerCase("tr").includes(needle) ||
        member.email.toLocaleLowerCase("tr").includes(needle) ||
        member.roles.some((role) => roleLabel(role).toLocaleLowerCase("tr").includes(needle)),
    );
  }, [staff, query]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (member: AdminStaff) => {
    setEditing(member);
    setFormOpen(true);
  };

  const handleSave = async (member: AdminStaff, newPassword?: string) => {
    const exists = staff.some((item) => item.id === member.id);
    const next = exists ? staff.map((item) => (item.id === member.id ? member : item)) : [member, ...staff];
    setStaff(next);

    const saved = await saveStaff(next);
    if (!saved.ok) {
      setMessage(saved.message ?? "Yönetici kaydedilemedi. Lütfen tekrar deneyin.");
      return;
    }

    if (newPassword) {
      const passwordResult = await setStaffPassword(member.id, newPassword);
      if (!passwordResult.ok) {
        setMessage(passwordResult.message ?? "Şifre kaydedilemedi.");
        return;
      }
      setStaff(loadStaff());
    }

    logActivity({
      category: "staff",
      action: exists ? "Yönetici kaydını güncelledi" : "Panele yeni yönetici ekledi",
      target: member.name,
      detail: `${roleLabel(member.roles[0])}${member.roles.length > 1 ? ` +${member.roles.length - 1}` : ""} · ${member.email}${
        newPassword ? " · şifre belirlendi" : ""
      }`,
    });
    setFormOpen(false);
    setMessage(exists ? `${member.name} güncellendi.` : `${member.name} panele eklendi.`);
    onChanged();
  };

  const handlePasswordReset = async (member: AdminStaff, password: string) => {
    const result = await setStaffPassword(member.id, password);
    if (!result.ok) {
      setMessage(result.message ?? "Şifre sıfırlanamadı.");
      return;
    }
    setStaff(loadStaff());
    logActivity({
      category: "security",
      action: "Geçici şifre oluşturdu",
      target: member.name,
      detail: `${member.email} hesabı için şifre sıfırlandı, kullanıcıya yeni şifre iletildi`,
    });
    setMessage(`${member.name} için geçici şifre oluşturuldu.`);
  };

  const openReset = (member: AdminStaff) => {
    setResetTarget(member);
  };

  const toggleActive = async (member: AdminStaff) => {
    if (member.id === currentStaffId) {
      setMessage("Kendi hesabınızı pasife alamazsınız.");
      return;
    }
    if (isLastOwner(member)) {
      setMessage("Son aktif genel yöneticiyi pasife alamazsınız.");
      return;
    }
    const next = staff.map((item) => (item.id === member.id ? { ...item, active: !item.active } : item));
    setStaff(next);
    const result = await saveStaff(next);
    if (!result.ok) {
      setMessage(result.message ?? "Değişiklik kaydedilemedi.");
      return;
    }
    logActivity({
      category: "staff",
      action: member.active ? "Yöneticiyi pasife aldı" : "Yöneticiyi aktifleştirdi",
      target: member.name,
      detail: member.active ? "Panele giriş yetkisi kapatıldı" : "Panele giriş yetkisi yeniden açıldı",
    });
    setMessage(`${member.name} ${member.active ? "pasife alındı, panele giriş yapamaz." : "aktifleştirildi."}`);
    onChanged();
  };

  const removeMember = async (member: AdminStaff) => {
    if (member.id === currentStaffId) {
      setMessage("Kendi hesabınızı silemezsiniz.");
      return;
    }
    if (isLastOwner(member)) {
      setMessage("Son aktif genel yöneticiyi silemezsiniz.");
      return;
    }
    const next = staff.filter((item) => item.id !== member.id);
    setStaff(next);
    const result = await saveStaff(next);
    if (!result.ok) {
      setMessage(result.message ?? "Yönetici kaldırılamadı.");
      return;
    }
    logActivity({
      category: "staff",
      action: "Yöneticiyi panelden kaldırdı",
      target: member.name,
      detail: `${member.email} hesabı ve rol atamaları silindi`,
    });
    setMessage(`${member.name} panelden kaldırıldı.`);
    onChanged();
  };

  return (
    <div className="space-y-4">
      {message && (
        <Banner tone="success" onClose={() => setMessage("")}>
          {message}
        </Banner>
      )}

      <Panel
        title="Yöneticiler ve Yetkiler"
        subtitle="Personel ekleyin, aynı kişiye birden fazla rol verin"
        icon="ri-shield-user-line"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-700 px-3.5 py-2 text-xs font-semibold text-background-50 hover:bg-primary-800"
          >
            <i className="ri-user-add-line text-sm" />
            Yönetici Ekle
          </button>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="İsim, e-posta veya rol ara..."
              className="h-9 w-full rounded-lg border border-background-200 bg-background-100 pl-9 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:bg-background-50 focus:ring-1 focus:ring-background-300"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] text-foreground-600">
            <Pill tone="info">{staff.length} yönetici</Pill>
            <Pill tone="success">{staff.filter((member) => member.active).length} aktif</Pill>
            <Pill tone="neutral">{staff.filter((member) => !member.active).length} pasif</Pill>
          </div>
        </div>

        <div className="mt-4 hidden grid-cols-[2.2fr_1.6fr_1.2fr_0.8fr_auto] gap-3 border-b border-background-200 pb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400 lg:grid">
          <span>Yönetici</span>
          <span>Roller</span>
          <span>Erişim</span>
          <span>Durum</span>
          <span className="text-right">İşlem</span>
        </div>

        <div className="divide-y divide-background-200">
          {filtered.map((member) => {
            const sections = sectionsForRoles(member.roles);
            return (
              <div
                key={member.id}
                className="grid grid-cols-1 gap-2 py-3 lg:grid-cols-[2.2fr_1.6fr_1.2fr_0.8fr_auto] lg:items-center lg:gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-[11px] font-bold text-primary-800 dark:bg-primary-200 dark:text-primary-950">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={`${member.name} profil fotoğrafı`}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      staffInitials(member.name)
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground-950">
                      {member.name}
                      {member.id === currentStaffId && (
                        <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-800">
                          siz
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[11px] text-foreground-500">{member.email}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-foreground-400">
                      <i className="ri-lock-line" />
                      {member.passwordUpdatedAt ? "Kişisel şifre aktif" : "Varsayılan şifre"}
                    </p>
                    {member.twoFactorEnabled && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] font-semibold text-accent-700">
                        <i className="ri-shield-check-line" />
                        2FA korumalı
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {member.roles.map((role) => (
                    <Pill key={role} tone="info">
                      {roleLabel(role)}
                    </Pill>
                  ))}
                </div>

                <div className="text-xs text-foreground-600">
                  <span className="lg:hidden">Erişim: </span>
                  {sections.length} ekran
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(member)}
                    className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      member.active ? "bg-accent-100 text-accent-900" : "bg-background-200 text-foreground-600"
                    }`}
                  >
                    <i className={member.active ? "ri-checkbox-circle-fill text-[11px]" : "ri-close-circle-line text-[11px]"} />
                    {member.active ? "Aktif" : "Pasif"}
                  </button>
                </div>

                <div className="flex items-center justify-start gap-1 lg:justify-end">
                  <button
                    type="button"
                    onClick={() => openReset(member)}
                    aria-label={`${member.name} şifresini sıfırla`}
                    title="Şifre sıfırla"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                  >
                    <i className="ri-lock-password-line text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(member)}
                    aria-label={`${member.name} düzenle`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                  >
                    <i className="ri-edit-line text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMember(member)}
                    aria-label={`${member.name} kaldır`}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                  >
                    <i className="ri-delete-bin-6-line text-base" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-foreground-500">
              <i className="ri-user-search-line mb-2 block text-2xl text-foreground-300" />
              Aramanıza uygun yönetici bulunamadı.
            </div>
          )}
        </div>
      </Panel>

      <Panel title="Rol Tanımları" subtitle="Her rolün panelde görebildiği ekranlar" icon="ri-shield-keyhole-line">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {ADMIN_ROLES.map((role) => (
            <div key={role.id} className="rounded-xl border border-background-200 bg-background-100/60 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                  <i className={`${role.icon} text-sm`} />
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground-950">{role.label}</p>
                <span className="rounded-full bg-background-50 px-1.5 py-0.5 text-[10px] font-semibold text-foreground-500">
                  {staff.filter((member) => member.roles.includes(role.id)).length} kişi
                </span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">{role.description}</p>
              <p className="mt-1 text-[10px] font-medium text-foreground-400">{role.sections.length} ekran erişimi</p>
            </div>
          ))}
        </div>
      </Panel>

      <StaffFormModal
        open={formOpen}
        initial={editing}
        staff={staff}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <PasswordResetModal
        open={Boolean(resetTarget)}
        member={resetTarget}
        onClose={() => setResetTarget(null)}
        onReset={handlePasswordReset}
      />
    </div>
  );
}