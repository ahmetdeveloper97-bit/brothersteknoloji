import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/base/ThemeToggle";
import { alertingTaskCount, openTaskCount, taskAlertsEnabled, TASK_EVENT } from "@/lib/activity";
import { ADMIN_STAFF_EVENT } from "@/lib/adminStaffStore";

interface AdminTopbarProps {
  title: string;
  subtitle: string;
  adminEmail: string;
  adminName: string;
  adminRoles: string[];
  adminAvatarUrl?: string;
  onOpenMobile: () => void;
  onChangePassword: () => void;
  onOpenProfile?: () => void;
  onOpenSecurity?: () => void;
  onOpenTasks?: () => void;
}

export default function AdminTopbar({
  title,
  subtitle,
  adminEmail,
  adminName,
  adminRoles,
  adminAvatarUrl,
  onOpenMobile,
  onChangePassword,
  onOpenProfile,
  onOpenSecurity,
  onOpenTasks,
}: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pendingTasks, setPendingTasks] = useState(() => alertingTaskCount());
  const [alertsOff, setAlertsOff] = useState(() => !taskAlertsEnabled());
  const [openTaskTotal, setOpenTaskTotal] = useState(() => openTaskCount());
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sync = () => {
      setPendingTasks(alertingTaskCount());
      setAlertsOff(!taskAlertsEnabled());
      setOpenTaskTotal(openTaskCount());
    };
    sync();
    window.addEventListener(TASK_EVENT, sync);
    window.addEventListener(ADMIN_STAFF_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(TASK_EVENT, sync);
      window.removeEventListener(ADMIN_STAFF_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    if (!bellOpen) return;
    const close = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [bellOpen]);

  const handleBellClick = () => {
    if (alertsOff) {
      setBellOpen((value) => !value);
      return;
    }
    onOpenTasks?.();
  };

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const initials =
    adminName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toLocaleUpperCase("tr"))
      .join("") || "AD";
  const primaryRole = adminRoles[0] ?? "Yönetici";
  const extraRoles = adminRoles.length > 1 ? ` +${adminRoles.length - 1}` : "";

  return (
    <div className="sticky top-0 z-40 border-b border-background-200 bg-background-50/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Menüyü aç"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground-700 hover:bg-background-100 lg:hidden"
        >
          <i className="ri-menu-line text-xl" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-heading text-base font-bold text-foreground-950 md:text-lg">{title}</h1>
          <p className="hidden truncate text-xs text-foreground-500 sm:block">{subtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative hidden md:block">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500" />
            <input
              type="search"
              placeholder="Sipariş, ürün veya müşteri ara..."
              className="h-9 w-56 rounded-full border border-background-200 bg-background-100 pl-9 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-500 focus:bg-background-50 focus:ring-1 focus:ring-background-300"
            />
          </div>

          <div className="relative" ref={bellRef}>
            <button
              type="button"
              aria-label={alertsOff ? "Görev bildirimleri kapalı" : "Bildirimler"}
              aria-expanded={bellOpen}
              onClick={handleBellClick}
              className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-background-100 ${
                alertsOff ? "text-foreground-400" : "text-foreground-700"
              }`}
            >
              <i className={`${alertsOff ? "ri-notification-off-line" : "ri-notification-3-line"} text-lg`} />
              {pendingTasks > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-600 px-1 text-[9px] font-bold text-background-50">
                  {pendingTasks}
                </span>
              ) : (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-background-400" />
              )}
            </button>

            {bellOpen && alertsOff && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-secondary-300 bg-background-50 shadow-xl">
                <div className="flex items-start gap-2 border-b border-background-200 bg-secondary-100 px-3 py-2.5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-secondary-950">
                    <i className="ri-notification-off-line text-xs" />
                  </span>
                  <p className="text-[11px] leading-relaxed text-secondary-950">
                    Görev bildirimleriniz kapalı. Bu yüzden zilde görev sayısı gösterilmiyor.
                    {openTaskTotal > 0 && (
                      <span className="font-semibold"> Şu anda {openTaskTotal} açık görev var.</span>
                    )}
                  </p>
                </div>
                <div className="p-1">
                  {onOpenProfile && (
                    <button
                      type="button"
                      onClick={() => {
                        setBellOpen(false);
                        onOpenProfile();
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-foreground-800 hover:bg-background-100"
                    >
                      <i className="ri-settings-3-line text-sm text-primary-700" />
                      Profilden bildirimleri aç
                    </button>
                  )}
                  {onOpenTasks && (
                    <button
                      type="button"
                      onClick={() => {
                        setBellOpen(false);
                        onOpenTasks();
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-foreground-700 hover:bg-background-100"
                    >
                      <i className="ri-task-line text-sm text-foreground-500" />
                      Görevleri yine de görüntüle
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle className="hidden sm:flex" />

          <div className="relative ml-1" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-background-200 py-1 pl-1 pr-2.5 hover:bg-background-100"
              title={adminEmail}
            >
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-[11px] font-bold text-primary-800 dark:bg-primary-200 dark:text-primary-950">
                {adminAvatarUrl ? (
                  <img src={adminAvatarUrl} alt={`${adminName} profil fotoğrafı`} className="h-full w-full object-cover object-top" />
                ) : (
                  initials
                )}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="max-w-[130px] truncate text-xs font-semibold text-foreground-900">{adminName}</p>
                <p className="max-w-[130px] truncate text-[10px] text-foreground-500">
                  {primaryRole}
                  {extraRoles}
                </p>
              </div>
              <i className="ri-arrow-down-s-line text-sm text-foreground-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-background-200 bg-background-50 shadow-xl">
                <div className="border-b border-background-200 px-3 py-2.5">
                  <p className="truncate text-xs font-semibold text-foreground-950">{adminName}</p>
                  <p className="truncate text-[11px] text-foreground-500">{adminEmail}</p>
                  <p className="mt-1 text-[10px] font-medium text-primary-700">{adminRoles.join(" + ")}</p>
                </div>
                {onOpenProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-xs font-medium text-foreground-800 hover:bg-background-100"
                  >
                    <i className="ri-user-3-line text-sm text-primary-700" />
                    Profilim
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onChangePassword();
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-xs font-medium text-foreground-800 hover:bg-background-100"
                >
                  <i className="ri-lock-password-line text-sm text-primary-700" />
                  Şifremi Değiştir
                </button>
                {onOpenSecurity && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSecurity();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-xs font-medium text-foreground-800 hover:bg-background-100"
                  >
                    <i className="ri-shield-keyhole-line text-sm text-primary-700" />
                    İki Adımlı Doğrulama
                  </button>
                )}
                {onOpenTasks && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenTasks();
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-xs font-medium text-foreground-800 hover:bg-background-100"
                  >
                    <i className="ri-task-line text-sm text-primary-700" />
                    Görevlerim
                    {pendingTasks > 0 && (
                      <span className="ml-auto rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-900">
                        {pendingTasks}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}