import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "@/components/base/Logo";
import { adminMenu } from "@/mocks/store";
import { TASK_EVENT, alertingTaskCount } from "@/lib/activity";
import { ADMIN_STAFF_EVENT } from "@/lib/adminStaffStore";
import { ADMIN_STORE_KEYS, loadReviews } from "@/lib/adminStore";
import { PERSISTENT_EVENT, readJson } from "@/lib/persistent";
import type { AdminReview } from "@/types/admin";
import type { AdminSectionId } from "@/types/adminRoles";

const countWaitingReplies = (): number =>
  readJson<AdminReview[]>(ADMIN_STORE_KEYS.reviews, loadReviews()).filter((review) => !review.reply).length;

interface AdminSidebarProps {
  active: string;
  onChange: (id: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  allowedSections: AdminSectionId[];
}

export default function AdminSidebar({
  active,
  onChange,
  mobileOpen,
  onCloseMobile,
  onLogout,
  allowedSections,
}: AdminSidebarProps) {
  const [pendingTasks, setPendingTasks] = useState(() => alertingTaskCount());
  const [waitingReplies, setWaitingReplies] = useState(() => countWaitingReplies());

  useEffect(() => {
    const syncReplies = () => setWaitingReplies(countWaitingReplies());
    window.addEventListener(PERSISTENT_EVENT, syncReplies);
    window.addEventListener("storage", syncReplies);
    window.addEventListener("focus", syncReplies);
    return () => {
      window.removeEventListener(PERSISTENT_EVENT, syncReplies);
      window.removeEventListener("storage", syncReplies);
      window.removeEventListener("focus", syncReplies);
    };
  }, []);

  useEffect(() => {
    const sync = () => setPendingTasks(alertingTaskCount());
    window.addEventListener(TASK_EVENT, sync);
    window.addEventListener(ADMIN_STAFF_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(TASK_EVENT, sync);
      window.removeEventListener(ADMIN_STAFF_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const visibleMenu = adminMenu.filter((item) => allowedSections.includes(item.id as AdminSectionId));
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-background-200 px-5">
        <Logo />
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Menüyü kapat"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100 lg:hidden"
        >
          <i className="ri-close-line text-lg" />
        </button>
      </div>

      <div className="px-5 pb-2 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-400">Yönetim</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {visibleMenu.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChange(item.id);
                onCloseMobile();
              }}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-primary-100 font-semibold text-primary-900 dark:bg-primary-200 dark:text-primary-950"
                  : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
              }`}
            >
              <i className={`${item.icon} text-lg`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === "reviews" && waitingReplies > 0 && (
                <span
                  className="rounded-full bg-secondary-200 px-1.5 py-0.5 text-[10px] font-bold text-secondary-950"
                  title={`${waitingReplies} yorum yanıt bekliyor`}
                >
                  {waitingReplies}
                </span>
              )}
              {item.id !== "reviews" && item.badge && (
                <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {allowedSections.includes("tasks") && (
          <button
            type="button"
            onClick={() => {
              onChange("tasks");
              onCloseMobile();
            }}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active === "tasks"
                ? "bg-primary-100 font-semibold text-primary-900 dark:bg-primary-200 dark:text-primary-950"
                : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
            }`}
          >
            <i className="ri-task-line text-lg" />
            <span className="flex-1 text-left">Görevler</span>
            {pendingTasks > 0 && (
              <span className="rounded-full bg-accent-100 px-1.5 py-0.5 text-[10px] font-bold text-accent-800">
                {pendingTasks}
              </span>
            )}
          </button>
        )}

        {allowedSections.includes("activity") && (
          <button
            type="button"
            onClick={() => {
              onChange("activity");
              onCloseMobile();
            }}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active === "activity"
                ? "bg-primary-100 font-semibold text-primary-900 dark:bg-primary-200 dark:text-primary-950"
                : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
            }`}
          >
            <i className="ri-history-line text-lg" />
            <span className="flex-1 text-left">İşlem Geçmişi</span>
          </button>
        )}

        {allowedSections.includes("staff") && (
          <button
            type="button"
            onClick={() => {
              onChange("staff");
              onCloseMobile();
            }}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active === "staff"
                ? "bg-primary-100 font-semibold text-primary-900 dark:bg-primary-200 dark:text-primary-950"
                : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
            }`}
          >
            <i className="ri-shield-user-line text-lg" />
            <span className="flex-1 text-left">Yöneticiler</span>
          </button>
        )}
      </nav>

      <div className="border-t border-background-200 px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-[10px] leading-relaxed text-foreground-400">
          <i className="ri-lock-line" />
          Menü rolünüze göre listelenir
        </p>
      </div>

      <div className="space-y-2 border-t border-background-200 p-3">
        {allowedSections.includes("profile") && (
          <button
            type="button"
            onClick={() => {
              onChange("profile");
              onCloseMobile();
            }}
            className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active === "profile"
                ? "bg-primary-100 font-semibold text-primary-900 dark:bg-primary-200 dark:text-primary-950"
                : "text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
            }`}
          >
            <i className="ri-user-settings-line text-lg" />
            Profilim
          </button>
        )}
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
        >
          <i className="ri-store-2-line text-lg" />
          Mağazaya Git
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground-700 hover:bg-background-100 hover:text-foreground-950"
        >
          <i className="ri-logout-box-r-line text-lg" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-background-200 bg-background-50 lg:block">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div onClick={onCloseMobile} className="absolute inset-0 bg-primary-950/50" />
          <div className="absolute left-0 top-0 h-full w-72 bg-background-50 shadow-2xl">{content}</div>
        </div>
      )}
    </>
  );
}