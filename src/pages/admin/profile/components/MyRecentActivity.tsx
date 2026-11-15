import { useEffect, useMemo, useState } from "react";
import {
  ACTIVITY_EVENT,
  activityCategoryLabel,
  formatActivityMoment,
  loadActivity,
} from "@/lib/activity";
import { staffInitials } from "@/lib/adminStaffStore";
import type { ActivityCategory, ActivityLog } from "@/types/activity";
import type { AdminStaff } from "@/types/adminRoles";

const categoryIcon: Record<ActivityCategory, string> = {
  auth: "ri-login-box-line",
  staff: "ri-team-line",
  shipping: "ri-truck-line",
  security: "ri-shield-keyhole-line",
};

const categoryTone: Record<ActivityCategory, string> = {
  auth: "bg-primary-100 text-primary-900 dark:bg-primary-200 dark:text-primary-950",
  staff: "bg-accent-100 text-accent-900",
  shipping: "bg-secondary-100 text-secondary-950",
  security: "bg-background-200 text-foreground-800",
};

const MAX_ITEMS = 10;

interface MyRecentActivityProps {
  staff: AdminStaff;
}

export default function MyRecentActivity({ staff }: MyRecentActivityProps) {
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadActivity());

  useEffect(() => {
    const sync = () => setLogs(loadActivity());
    window.addEventListener(ACTIVITY_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const mine = useMemo(() => {
    const email = staff.email.toLowerCase();
    return logs.filter((log) => log.actorEmail.toLowerCase() === email).slice(0, MAX_ITEMS);
  }, [logs, staff.email]);

  const todayCount = useMemo(() => {
    const today = new Date();
    return mine.filter((log) => {
      const date = new Date(log.at);
      return (
        !Number.isNaN(date.getTime()) &&
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }).length;
  }, [mine]);

  return (
    <section className="rounded-xl border border-background-200 bg-background-50">
      <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3 md:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-[11px] font-bold text-primary-900">
          {staff.avatarUrl ? (
            <img
              src={staff.avatarUrl}
              alt={`${staff.name} profil fotoğrafı`}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            staffInitials(staff.name)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-sm font-bold text-foreground-950">Son 10 İşlemim</h2>
          <p className="mt-0.5 text-xs text-foreground-500">Kendi hesabınızla yaptığınız son hareketler.</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-background-100 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
            {mine.length} kayıt
          </span>
          <span className="rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
            Bugün {todayCount}
          </span>
        </div>
      </div>

      {mine.length > 0 ? (
        <ol className="divide-y divide-background-100">
          {mine.map((log) => (
            <li key={log.id} className="flex items-start gap-2.5 px-4 py-2.5 md:px-5">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${categoryTone[log.category]}`}
              >
                <i className={categoryIcon[log.category]} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground-900">
                  {log.action}
                  {log.target && <span className="font-medium text-foreground-600"> · {log.target}</span>}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-foreground-500">
                  <span>{activityCategoryLabel[log.category]}</span>
                  <span className="text-foreground-300">|</span>
                  <span className="whitespace-nowrap font-mono">{formatActivityMoment(log.at)}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="flex flex-col items-center gap-1.5 px-4 py-8 text-center">
          <i className="ri-history-line text-2xl text-foreground-300" />
          <p className="text-sm font-medium text-foreground-700">Henüz işlem kaydınız yok</p>
          <p className="text-xs text-foreground-500">
            Panelde yaptığınız giriş, personel ve kargo işlemleri burada listelenir.
          </p>
        </div>
      )}
    </section>
  );
}