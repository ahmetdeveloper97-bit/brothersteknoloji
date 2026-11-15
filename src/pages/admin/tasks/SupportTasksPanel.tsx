import { useEffect, useState } from "react";
import { Kpi, Panel, Pill } from "@/components/base/AdminUI";
import {
  TASK_EVENT,
  completeTask,
  formatActivityMoment,
  loadTasks,
  logActivity,
  reopenTask,
} from "@/lib/activity";
import { ADMIN_STAFF_EVENT, findStaffByEmail, readAdminSessionEmail, updateStaffProfile } from "@/lib/adminStaffStore";
import { usePersistentState } from "@/lib/persistent";
import type { SupportTask } from "@/types/activity";

type FilterKey = "open" | "done" | "all";

const TASK_VIEW_KEY = "eticaretv8_admin_tasks_view";
const filterKeys: FilterKey[] = ["open", "done", "all"];

const filters: Array<{ key: FilterKey; label: string; icon: string }> = [
  { key: "open", label: "Bekleyen", icon: "ri-time-line" },
  { key: "done", label: "Tamamlanan", icon: "ri-checkbox-circle-line" },
  { key: "all", label: "Tümü", icon: "ri-list-check-2" },
];

export default function SupportTasksPanel() {
  const [tasks, setTasks] = useState<SupportTask[]>(() => loadTasks());
  const [filter, setFilter] = usePersistentState<FilterKey>(TASK_VIEW_KEY, "open");
  const activeFilter: FilterKey = filterKeys.includes(filter) ? filter : "open";
  const [flash, setFlash] = useState("");
  const [notifyTasks, setNotifyTasks] = useState(() => {
    const member = findStaffByEmail(readAdminSessionEmail());
    return member ? member.notifyTasks !== false : false;
  });
  const [signedIn, setSignedIn] = useState(() => Boolean(findStaffByEmail(readAdminSessionEmail())));

  useEffect(() => {
    const syncPref = () => {
      const member = findStaffByEmail(readAdminSessionEmail());
      setSignedIn(Boolean(member));
      setNotifyTasks(member ? member.notifyTasks !== false : false);
    };
    syncPref();
    window.addEventListener(ADMIN_STAFF_EVENT, syncPref);
    window.addEventListener("focus", syncPref);
    return () => {
      window.removeEventListener(ADMIN_STAFF_EVENT, syncPref);
      window.removeEventListener("focus", syncPref);
    };
  }, []);

  const toggleNotify = () => {
    const member = findStaffByEmail(readAdminSessionEmail());
    if (!member) {
      setFlash("Görev bildirimi tercihini değiştirmek için yönetici hesabıyla giriş yapmalısınız.");
      return;
    }
    const next = !notifyTasks;
    updateStaffProfile(member.id, { notifyTasks: next });
    setNotifyTasks(next);
    logActivity({
      category: "staff",
      action: next ? "Görev bildirimleri açıldı" : "Görev bildirimleri kapatıldı",
      target: member.name,
      detail: next
        ? "Yeni destek görevi oluştuğunda bildirim alacak"
        : "Destek görevi bildirimleri kapatıldı, görevler yalnızca panelden takip edilecek",
    });
    setFlash(
      next
        ? "Görev bildirimleri açıldı. Kargo bir gönderiyi kargoya verdiğinde haber verilecek."
        : "Görev bildirimleri kapatıldı. Görevleri yalnızca bu ekrandan takip edeceksiniz.",
    );
  };

  useEffect(() => {
    const sync = () => setTasks(loadTasks());
    window.addEventListener(TASK_EVENT, sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener(TASK_EVENT, sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const visible = tasks.filter((task) => activeFilter === "all" || task.status === activeFilter);
  const openCount = tasks.filter((task) => task.status === "open").length;
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const todayCount = tasks.filter((task) => task.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;

  const handleComplete = (task: SupportTask) => {
    completeTask(task.id);
    setTasks(loadTasks());
    setFlash(`${task.orderId} için görev tamamlandı olarak işaretlendi.`);
  };

  const handleReopen = (task: SupportTask) => {
    reopenTask(task.id);
    setTasks(loadTasks());
    setFlash(`${task.orderId} görevi yeniden açıldı.`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-time-line" label="Bekleyen Görev" value={String(openCount)} hint="Destek ekibi aksiyonu bekliyor" tone="warning" />
        <Kpi icon="ri-checkbox-circle-line" label="Tamamlanan" value={String(doneCount)} hint="Kapatılan görev sayısı" tone="success" />
        <Kpi icon="ri-calendar-check-line" label="Bugün Açılan" value={String(todayCount)} hint="Kargodan gelen otomatik görev" tone="info" />
        <Kpi icon="ri-truck-line" label="Toplam Görev" value={String(tasks.length)} hint="Tüm otomasyon kayıtları" tone="neutral" />
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-background-200 bg-background-50 px-3.5 py-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            notifyTasks ? "bg-accent-100 text-accent-900" : "bg-background-200 text-foreground-500"
          }`}
        >
          <i className={notifyTasks ? "ri-notification-3-line" : "ri-notification-off-line"} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-foreground-950">
            Görev bildirimleri
            <Pill tone={notifyTasks ? "success" : "neutral"}>{notifyTasks ? "Açık" : "Kapalı"}</Pill>
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-500">
            {signedIn
              ? "Yeni bir satış sonrası destek görevi oluştuğunda bildirim alın. Bu tercih profil ayarlarınıza kaydedilir."
              : "Bildirim tercihi için oturum açmış bir yönetici hesabı gerekiyor."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={notifyTasks}
          aria-label="Görev bildirimlerini aç veya kapat"
          onClick={toggleNotify}
          className={`flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
            notifyTasks ? "bg-accent-600" : "bg-background-400"
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-background-50 shadow transition-transform ${
              notifyTasks ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {flash && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          <span className="flex-1">{flash}</span>
          <button type="button" onClick={() => setFlash("")} aria-label="Kapat" className="cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      <Panel
        title="Satış Sonrası Destek Görevleri"
        subtitle="Kargo sorumlusu bir gönderiyi kargoya verdiğinde görev otomatik olarak buraya düşer"
        icon="ri-task-line"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((item) => {
            const count =
              item.key === "all" ? tasks.length : tasks.filter((task) => task.status === item.key).length;
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
                    activeFilter === item.key ? "bg-background-50/25 text-background-50" : "bg-background-50 text-foreground-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          <span className="ml-auto flex items-center gap-1 whitespace-nowrap text-[10px] font-medium text-foreground-400">
            <i className="ri-bookmark-line" />
            Seçilen filtre hatırlanır
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {!notifyTasks && (
            <div className="flex flex-col gap-2 rounded-xl border border-secondary-300 bg-secondary-50 px-3.5 py-3 sm:flex-row sm:items-start">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary-200 text-secondary-950">
                <i className="ri-notification-off-line" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-secondary-950">Sessiz mod açık — yeni görevler için bildirim gelmiyor</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-secondary-900">
                  Bildirim tercihi kapalı olduğu için kargo sorumlusu bir gönderiyi kargoya verdiğinde haber verilmez.{" "}
                  {openCount > 0
                    ? `Bu listedeki ${openCount} bekleyen görevi düzenli kontrol etmen gerekiyor.`
                    : "Şu an bekleyen görev yok, yeni görevler bu listede birikecek."}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleNotify}
                className="flex h-8 w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700 sm:w-auto"
              >
                <i className="ri-notification-3-line" />
                Bildirimleri aç
              </button>
            </div>
          )}
          {visible.map((task) => (
            <div
              key={task.id}
              className={`rounded-xl border p-3.5 transition-colors ${
                task.status === "open"
                  ? "border-accent-300 bg-accent-50/50"
                  : "border-background-200 bg-background-50"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    task.status === "open"
                      ? "bg-accent-200 text-accent-900"
                      : "bg-background-200 text-foreground-600"
                  }`}
                >
                  <i className={task.status === "open" ? "ri-notification-3-line" : "ri-check-line"} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground-950">{task.title}</p>
                    <Pill tone={task.status === "open" ? "warning" : "success"}>
                      {task.status === "open" ? "Bekliyor" : "Tamamlandı"}
                    </Pill>
                    <span className="rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-medium text-foreground-600">
                      Satış Sonrası Destek
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-700">{task.detail}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground-500">
                    <span className="flex items-center gap-1">
                      <i className="ri-shopping-bag-3-line" />
                      {task.orderId}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-user-line" />
                      {task.customer}
                    </span>
                    <span className="flex items-center gap-1 font-mono">{task.tracking}</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-truck-line" />
                      {task.shipmentId}
                    </span>
                  </div>

                  <p className="mt-1.5 text-[10px] text-foreground-400">
                    {formatActivityMoment(task.createdAt)} · {task.createdBy} tarafından oluşturuldu
                    {task.status === "done" && task.completedBy && ` · ${task.completedBy} tarafından kapatıldı`}
                  </p>
                </div>

                <div className="shrink-0">
                  {task.status === "open" ? (
                    <button
                      type="button"
                      onClick={() => handleComplete(task)}
                      className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700 sm:w-auto"
                    >
                      <i className="ri-check-double-line" />
                      Görevi Tamamla
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReopen(task)}
                      className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-[11px] font-semibold text-foreground-700 hover:bg-background-100 sm:w-auto"
                    >
                      <i className="ri-arrow-go-back-line" />
                      Yeniden Aç
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <div className="py-12 text-center">
              <i className="ri-task-line mb-2 block text-3xl text-foreground-300" />
              <p className="text-sm font-medium text-foreground-700">
                {activeFilter === "open" ? "Bekleyen görev yok, her şey güncel" : "Bu listede görev bulunmuyor"}
              </p>
              <p className="mt-1 text-xs text-foreground-500">
                Kargo panelinde bir gönderi “kargoya verildi” olarak işaretlendiğinde görev burada otomatik oluşur.
              </p>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}