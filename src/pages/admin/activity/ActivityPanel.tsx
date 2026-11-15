import { useEffect, useMemo, useState } from "react";
import { Kpi, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import {
  ACTIVITY_EVENT,
  activityCategoryLabel,
  formatActivityMoment,
  loadActivity,
} from "@/lib/activity";
import { ADMIN_STAFF_EVENT, readAdminSessionEmail, staffDirectory } from "@/lib/adminStaffStore";
import { usePersistentState } from "@/lib/persistent";
import type { StaffDirectoryEntry } from "@/lib/adminStaffStore";
import type { ActivityCategory, ActivityLog } from "@/types/activity";

type FilterKey = "all" | ActivityCategory;

const categoryIcon: Record<ActivityCategory, string> = {
  auth: "ri-login-box-line",
  staff: "ri-team-line",
  shipping: "ri-truck-line",
  security: "ri-shield-keyhole-line",
  ads: "ri-megaphone-line",
};

const categoryTone: Record<ActivityCategory, "info" | "success" | "warning" | "neutral"> = {
  auth: "info",
  staff: "success",
  shipping: "warning",
  security: "neutral",
  ads: "warning",
};

const filters: Array<{ key: FilterKey; label: string; icon: string }> = [
  { key: "all", label: "Tümü", icon: "ri-list-check-2" },
  { key: "auth", label: "Giriş / Çıkış", icon: "ri-login-box-line" },
  { key: "staff", label: "Personel", icon: "ri-team-line" },
  { key: "shipping", label: "Kargo", icon: "ri-truck-line" },
  { key: "security", label: "Güvenlik", icon: "ri-shield-keyhole-line" },
  { key: "ads", label: "Reklam", icon: "ri-megaphone-line" },
];

const VIEW_KEY = "eticaretv8_admin_activity_view";
const filterKeys: FilterKey[] = ["all", "auth", "staff", "shipping", "security", "ads"];

const dayLabel = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
  if (sameDay(date, today)) return "Bugün";
  if (sameDay(date, yesterday)) return "Dün";
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
};

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr"))
    .join("") || "S";

export default function ActivityPanel() {
  const [logs, setLogs] = useState<ActivityLog[]>(() => loadActivity());
  const [directory, setDirectory] = useState<Record<string, StaffDirectoryEntry>>(() => staffDirectory());
  const [filter, setFilter] = usePersistentState<FilterKey>(`${VIEW_KEY}_category`, "all");
  const [query, setQuery] = usePersistentState<string>(`${VIEW_KEY}_query`, "");
  const [onlyMine, setOnlyMine] = usePersistentState<boolean>(`${VIEW_KEY}_mine`, false);
  const [sessionEmail, setSessionEmail] = useState(() => readAdminSessionEmail());
  const activeFilter: FilterKey = filterKeys.includes(filter) ? filter : "all";

  useEffect(() => {
    const sync = () => {
      setLogs(loadActivity());
      setDirectory(staffDirectory());
      setSessionEmail(readAdminSessionEmail());
    };
    window.addEventListener(ACTIVITY_EVENT, sync);
    window.addEventListener(ADMIN_STAFF_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, sync);
      window.removeEventListener(ADMIN_STAFF_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const myEmail = sessionEmail.toLowerCase();
  const myCount = useMemo(
    () => (myEmail ? logs.filter((log) => log.actorEmail.toLowerCase() === myEmail).length : 0),
    [logs, myEmail],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    return logs.filter((log) => {
      const matchesFilter = activeFilter === "all" || log.category === activeFilter;
      const matchesMine = !onlyMine || (myEmail !== "" && log.actorEmail.toLowerCase() === myEmail);
      const matchesQuery =
        !needle ||
        log.actorName.toLocaleLowerCase("tr").includes(needle) ||
        log.action.toLocaleLowerCase("tr").includes(needle) ||
        log.target.toLocaleLowerCase("tr").includes(needle) ||
        log.detail.toLocaleLowerCase("tr").includes(needle);
      return matchesFilter && matchesMine && matchesQuery;
    });
  }, [logs, activeFilter, query, onlyMine, myEmail]);

  const grouped = useMemo(() => {
    const buckets: Array<{ label: string; items: ActivityLog[] }> = [];
    filtered.forEach((log) => {
      const label = dayLabel(log.at);
      const bucket = buckets.find((entry) => entry.label === label);
      if (bucket) bucket.items.push(log);
      else buckets.push({ label, items: [log] });
    });
    return buckets;
  }, [filtered]);

  const hasActiveView = activeFilter !== "all" || onlyMine || query.trim() !== "";
  const resetView = () => {
    setFilter("all");
    setQuery("");
    setOnlyMine(false);
  };

  const loginCount = logs.filter((log) => log.category === "auth" && log.action.includes("giriş")).length;
  const logoutCount = logs.filter((log) => log.category === "auth" && log.action.includes("çıkış")).length;
  const shippingCount = logs.filter((log) => log.category === "shipping").length;
  const uniqueActors = new Set(logs.map((log) => log.actorEmail)).size;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-login-box-line" label="Giriş Kaydı" value={String(loginCount)} hint="Son 400 işlem içinde" tone="info" />
        <Kpi icon="ri-logout-box-r-line" label="Çıkış Kaydı" value={String(logoutCount)} hint="Oturum kapatma hareketi" tone="neutral" />
        <Kpi icon="ri-truck-line" label="Kargo İşlemi" value={String(shippingCount)} hint="Sevkiyat ve görev tetikleri" tone="warning" />
        <Kpi icon="ri-team-line" label="Aktif Kullanıcı" value={String(uniqueActors)} hint="İşlem yapan hesap sayısı" tone="success" />
      </div>

      <Panel
        title="İşlem Geçmişi"
        subtitle="Yönetici giriş/çıkışları ve panelde yapılan tüm işlemler"
        icon="ri-history-line"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kişi, işlem veya hedef ara"
              className={`${inputClass} h-9 w-48 text-xs`}
            />
            <span className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-50 px-2.5 text-[11px] font-semibold text-primary-900">
              <i className="ri-database-2-line" />
              {onlyMine ? `${filtered.length} / ${logs.length} kayıt` : `${logs.length} kayıt`}
            </span>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOnlyMine((value) => !value)}
            aria-pressed={onlyMine}
            className={`flex h-7 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[11px] font-semibold transition-colors ${
              onlyMine
                ? "border-primary-700 bg-primary-700 text-background-50"
                : "border-background-300 bg-background-50 text-foreground-700 hover:bg-background-100"
            }`}
          >
            <i className={onlyMine ? "ri-checkbox-circle-fill" : "ri-user-line"} />
            Sadece benim işlemlerim
            <span
              className={`rounded-full px-1.5 text-[10px] font-bold ${
                onlyMine ? "bg-background-50/25 text-background-50" : "bg-background-100 text-foreground-600"
              }`}
            >
              {myCount}
            </span>
          </button>
          <span className="h-5 w-px bg-background-300" />
          {filters.map((item) => {
            const count = item.key === "all" ? logs.length : logs.filter((log) => log.category === item.key).length;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  activeFilter === item.key
                    ? "bg-primary-700 text-background-50"
                    : "bg-background-100 text-foreground-600 hover:bg-background-200"
                }`}
              >
                <i className={item.icon} />
                {item.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    activeFilter === item.key
                      ? "bg-background-50/25 text-background-50"
                      : "bg-background-50 text-foreground-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          {hasActiveView && (
            <button
              type="button"
              onClick={resetView}
              className="ml-auto flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium text-foreground-500 hover:bg-background-100"
            >
              <i className="ri-restart-line" />
              Filtreleri sıfırla
            </button>
          )}
        </div>

        <div className="mt-4 space-y-5">
          {grouped.map((bucket) => (
            <div key={bucket.label}>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-500">{bucket.label}</p>
                <span className="h-px flex-1 bg-background-200" />
                <span className="text-[10px] font-medium text-foreground-400">{bucket.items.length} işlem</span>
              </div>

              <div className="space-y-2">
                {bucket.items.map((log) => {
                  const avatar = directory[(log.actorEmail ?? "").toLowerCase()]?.avatarUrl;
                  return (
                  <div
                    key={log.id}
                    className="flex flex-col gap-2 rounded-xl border border-background-200 bg-background-50 p-3 sm:flex-row sm:items-start sm:gap-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-[11px] font-bold text-primary-800 dark:bg-primary-200 dark:text-primary-950">
                      {avatar ? (
                        <img src={avatar} alt={`${log.actorName} profil fotoğrafı`} className="h-full w-full object-cover object-top" />
                      ) : (
                        initials(log.actorName)
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground-950">{log.actorName}</p>
                        <Pill tone={categoryTone[log.category]}>
                          <i className={categoryIcon[log.category]} />
                          {activityCategoryLabel[log.category]}
                        </Pill>
                        <span className="rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-medium text-foreground-600">
                          {log.actorRole}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground-800">
                        {log.action}
                        {log.target && <span className="font-semibold text-foreground-950"> · {log.target}</span>}
                      </p>
                      {log.detail && <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-500">{log.detail}</p>}
                    </div>

                    <div className="shrink-0 text-left sm:text-right">
                      <p className="whitespace-nowrap font-mono text-[11px] font-medium text-foreground-600">
                        {formatActivityMoment(log.at)}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-foreground-400">{log.actorEmail}</p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <i className="ri-history-line mb-2 block text-3xl text-foreground-300" />
              <p className="text-sm font-medium text-foreground-700">
                {onlyMine ? "Kendi işlem kaydınız bulunamadı" : "Bu filtreye uygun işlem kaydı yok"}
              </p>
              <p className="mt-1 text-xs text-foreground-500">
                {onlyMine
                  ? "Sadece benim işlemlerim filtresini kapatıp tüm kayıtları görebilirsiniz."
                  : "Arama kelimesini değiştirin veya tüm kayıtları görüntüleyin."}
              </p>
            </div>
          )}
        </div>
      </Panel>

      <div className="rounded-xl border border-background-200 bg-background-50 p-3.5">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-foreground-600">
          <i className="ri-information-line mt-0.5 text-sm text-primary-700" />
          <span>
            Giriş/çıkış, personel yetkilendirme, şifre sıfırlama ve kargo sevkiyatı gibi kritik hareketler otomatik
            olarak buraya kaydedilir. Kayıtlar yalnızca genel yönetici tarafından görüntülenebilir. Seçtiğiniz kategori,
            arama ve "sadece benim işlemlerim" durumu hatırlanır; küçük bir uyarı: bu tercihler yalnızca bu tarayıcıda
            saklanır.
          </span>
        </p>
      </div>
    </div>
  );
}