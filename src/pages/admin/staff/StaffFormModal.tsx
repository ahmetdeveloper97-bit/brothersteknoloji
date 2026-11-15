import { useEffect, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Field, inputClass } from "@/components/base/AdminUI";
import { ADMIN_ROLES, sectionLabel, sectionsForRoles } from "@/lib/adminRoles";
import { createStaffId } from "@/lib/adminStaffStore";
import { generatePassword } from "@/lib/password";
import type { AdminRoleId, AdminStaff } from "@/types/adminRoles";

interface StaffFormModalProps {
  open: boolean;
  initial: AdminStaff | null;
  staff: AdminStaff[];
  onClose: () => void;
  onSave: (member: AdminStaff, newPassword?: string) => void;
}

export default function StaffFormModal({ open, initial, staff, onClose, onSave }: StaffFormModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<AdminRoleId[]>([]);
  const [active, setActive] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setEmail(initial?.email ?? "");
    setPhone(initial?.phone ?? "");
    setRoles(initial?.roles ? [...initial.roles] : []);
    setActive(initial?.active ?? true);
    setPassword("");
    setPasswordRepeat("");
    setShowPassword(false);
    setError("");
  }, [open, initial]);

  const toggleRole = (roleId: AdminRoleId) => {
    setRoles((current) =>
      current.includes(roleId) ? current.filter((item) => item !== roleId) : [...current, roleId],
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Yönetici adı ve soyadı zorunlu.");
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    const duplicate = staff.some(
      (member) => member.email.toLowerCase() === normalizedEmail && member.id !== initial?.id,
    );
    if (duplicate) {
      setError("Bu e-posta ile kayıtlı başka bir yönetici var.");
      return;
    }
    if (roles.length === 0) {
      setError("En az bir rol seçmelisiniz.");
      return;
    }

    const wantsPassword = password.trim().length > 0 || passwordRepeat.trim().length > 0;
    if (!initial && !wantsPassword) {
      setError("Yeni yönetici için giriş şifresi belirlemelisiniz.");
      return;
    }
    if (wantsPassword) {
      if (password.trim().length < 6) {
        setError("Şifre en az 6 karakter olmalı.");
        return;
      }
      if (password !== passwordRepeat) {
        setError("Şifreler birbiriyle uyuşmuyor.");
        return;
      }
    }

    onSave(
      {
        ...(initial ?? {}),
        id: initial?.id ?? createStaffId(),
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        roles,
        active,
        createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
        passwordHash: initial?.passwordHash,
        passwordUpdatedAt: initial?.passwordUpdatedAt,
        twoFactorEnabled: initial?.twoFactorEnabled,
        twoFactorSecret: initial?.twoFactorSecret,
        twoFactorEnabledAt: initial?.twoFactorEnabledAt,
      },
      wantsPassword ? password : undefined,
    );
  };

  const allowedSections = sectionsForRoles(roles);

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon="ri-user-settings-line"
      title={initial ? "Yöneticiyi Düzenle" : "Yeni Yönetici Ekle"}
      subtitle="Bir kişiye birden fazla rol verebilirsiniz, yetkiler birleşir"
      maxWidth="max-w-2xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 py-2 text-sm font-semibold text-foreground-800 hover:bg-background-100 sm:w-auto"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-700 px-5 py-2 text-sm font-semibold text-background-50 hover:bg-primary-800 sm:w-auto"
          >
            <i className="ri-save-3-line" />
            Kaydet
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <Banner tone="warning">{error}</Banner>}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Ad Soyad">
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Örn. Ayşe Demir"
            />
          </Field>
          <Field label="E-posta">
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ornek@brothersteknoloji.com"
            />
          </Field>
          <Field label="Telefon" hint="İsteğe bağlı, dahili iletişim için">
            <input
              className={inputClass}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0532 000 00 00"
            />
          </Field>
          <Field label="Durum">
            <button
              type="button"
              onClick={() => setActive((value) => !value)}
              className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-800"
            >
              <span className="flex items-center gap-2">
                <i className={active ? "ri-checkbox-circle-line text-accent-700" : "ri-close-circle-line text-foreground-400"} />
                {active ? "Aktif - panele giriş yapabilir" : "Pasif - giriş yapamaz"}
              </span>
              <i className="ri-arrow-down-s-line text-foreground-400" />
            </button>
          </Field>
        </div>

        <div className="rounded-xl border border-background-200 bg-background-100/60 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-800">
              <i className="ri-lock-password-line text-sm text-primary-700" />
              Giriş Şifresi
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-medium text-foreground-600 hover:text-foreground-900"
              >
                <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                {showPassword ? "Gizle" : "Göster"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const generated = generatePassword();
                  setPassword(generated);
                  setPasswordRepeat(generated);
                  setShowPassword(true);
                }}
                className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-background-50 px-2 py-1 text-[11px] font-semibold text-primary-700 hover:bg-primary-50"
              >
                <i className="ri-magic-line" />
                Şifre Üret
              </button>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Şifre" hint={initial ? "Boş bırakırsanız mevcut şifre korunur" : "En az 6 karakter"}>
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
              />
            </Field>
            <Field label="Şifre (tekrar)">
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass}
                value={passwordRepeat}
                onChange={(event) => setPasswordRepeat(event.target.value)}
                placeholder="••••••"
                autoComplete="new-password"
              />
            </Field>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">
            Her yönetici kendi şifresiyle giriş yapar. Şifreyi unutan kişiler için Yöneticiler ekranındaki kilit
            simgesinden sıfırlama yapabilirsiniz.
          </p>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-foreground-700">Roller (birden fazla seçilebilir)</p>
            <span className="rounded-full bg-background-100 px-2 py-0.5 text-[11px] font-medium text-foreground-600">
              {roles.length} rol · {allowedSections.length} ekran
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ADMIN_ROLES.map((role) => {
              const checked = roles.includes(role.id);
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  aria-pressed={checked}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    checked
                      ? "border-primary-400 bg-primary-50"
                      : "border-background-200 bg-background-50 hover:border-background-300 hover:bg-background-100"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      checked
                        ? "border-primary-700 bg-primary-700 text-background-50"
                        : "border-background-400 bg-background-50"
                    }`}
                  >
                    {checked && <i className="ri-check-line text-[11px]" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground-900">
                      <i className={`${role.icon} text-sm text-primary-700`} />
                      <span className="truncate">{role.label}</span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-foreground-500">{role.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-background-200 bg-background-100 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Erişebileceği ekranlar</p>
          <p className="mt-1 text-xs leading-relaxed text-foreground-700">
            {allowedSections.length > 0 ? allowedSections.map(sectionLabel).join(" · ") : "Henüz rol seçilmedi"}
          </p>
        </div>
      </div>
    </Modal>
  );
}