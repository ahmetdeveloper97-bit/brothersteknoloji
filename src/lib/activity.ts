import { readJson, writeJson } from "@/lib/persistent";
import { findStaffByEmail, readAdminSessionEmail } from "@/lib/adminStaffStore";
import { roleLabels } from "@/lib/adminRoles";
import type { ActivityCategory, ActivityLog, SupportTask } from "@/types/activity";

export const ACTIVITY_KEY = "eticaretv8_admin_activity";
export const SUPPORT_TASK_KEY = "eticaretv8_support_tasks";
export const ACTIVITY_EVENT = "eticaretv8:activity-updated";
export const TASK_EVENT = "eticaretv8:tasks-updated";

const emit = (eventName: string) => {
  try {
    window.dispatchEvent(new Event(eventName));
  } catch {
    /* event may be unavailable */
  }
};

const sortByDateDesc = (logs: ActivityLog[]): ActivityLog[] =>
  [...logs].sort((first, second) => (first.at < second.at ? 1 : -1));

export const loadActivity = (): ActivityLog[] => {
  const stored = readJson<ActivityLog[] | null>(ACTIVITY_KEY, null);
  if (stored && Array.isArray(stored)) return sortByDateDesc(stored);
  return [];
};

interface LogInput {
  category: ActivityCategory;
  action: string;
  target?: string;
  detail?: string;
  actorName?: string;
  actorEmail?: string;
  actorRole?: string;
}

export const logActivity = (input: LogInput): void => {
  const member = findStaffByEmail(readAdminSessionEmail());
  const entry: ActivityLog = {
    id: `log-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    category: input.category,
    actorName: input.actorName ?? member?.name ?? "Sistem",
    actorEmail: input.actorEmail ?? member?.email ?? "sistem@brothersteknoloji.com",
    actorRole: input.actorRole ?? (member ? roleLabels(member.roles).join(" + ") : "Otomasyon"),
    action: input.action,
    target: input.target ?? "",
    detail: input.detail ?? "",
  };
  writeJson(ACTIVITY_KEY, [entry, ...loadActivity()].slice(0, 400));
  emit(ACTIVITY_EVENT);
};

export const loadTasks = (): SupportTask[] => {
  const stored = readJson<SupportTask[] | null>(SUPPORT_TASK_KEY, null);
  if (stored && Array.isArray(stored)) return stored.map((task) => ({ ...task }));
  return [];
};

export const saveTasks = (tasks: SupportTask[]): void => {
  writeJson(SUPPORT_TASK_KEY, tasks);
  emit(TASK_EVENT);
};

interface CreateTaskInput {
  title: string;
  detail: string;
  orderId: string;
  shipmentId: string;
  customer: string;
  tracking: string;
}

export const createSupportTask = (input: CreateTaskInput): boolean => {
  const tasks = loadTasks();
  const duplicate = tasks.some((task) => task.status === "open" && task.shipmentId === input.shipmentId);
  if (duplicate) return false;

  const member = findStaffByEmail(readAdminSessionEmail());
  const task: SupportTask = {
    id: `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    title: input.title,
    detail: input.detail,
    orderId: input.orderId,
    shipmentId: input.shipmentId,
    customer: input.customer,
    tracking: input.tracking,
    createdAt: new Date().toISOString(),
    createdBy: member?.name ?? "Kargo Sorumlusu",
    assignedRole: "satis-sonrasi-destek",
    status: "open",
    completedAt: "",
    completedBy: "",
  };
  saveTasks([task, ...tasks]);
  logActivity({
    category: "shipping",
    action: "Otomatik görev oluşturdu",
    target: "Satış Sonrası Destek",
    detail: `${input.orderId} sevkiyatı için teslim takibi görevi açıldı`,
    actorName: "Sistem",
    actorEmail: "sistem@brothersteknoloji.com",
    actorRole: "Otomasyon",
  });
  return true;
};

export const completeTask = (id: string): void => {
  const member = findStaffByEmail(readAdminSessionEmail());
  saveTasks(
    loadTasks().map((task) =>
      task.id === id
        ? { ...task, status: "done", completedAt: new Date().toISOString(), completedBy: member?.name ?? "Destek" }
        : task,
    ),
  );
};

export const reopenTask = (id: string): void => {
  saveTasks(
    loadTasks().map((task) => (task.id === id ? { ...task, status: "open", completedAt: "", completedBy: "" } : task)),
  );
};

export const openTaskCount = (): number => loadTasks().filter((task) => task.status === "open").length;

/** Kişinin "görev bildirimleri" tercihi kapalıysa zil/menü sayacı gösterilmez. */
export const taskAlertsEnabled = (): boolean => {
  const member = findStaffByEmail(readAdminSessionEmail());
  return member ? member.notifyTasks !== false : true;
};

export const alertingTaskCount = (): number => (taskAlertsEnabled() ? openTaskCount() : 0);

export const formatActivityMoment = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()} · ${hours}:${minutes}`;
};

export const activityCategoryLabel: Record<ActivityCategory, string> = {
  auth: "Giriş / Çıkış",
  staff: "Personel",
  shipping: "Kargo",
  security: "Güvenlik",
  ads: "Reklam",
};