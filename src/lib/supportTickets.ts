import { readAdminToken } from "@/lib/adminStaffStore";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type {
  PendingAttachment,
  SupportTicketDetail,
  SupportTicketSummary,
  TicketAttachment,
  TicketCounts,
  TicketCreateInput,
  TicketPriority,
  TicketResult,
  TicketStatus,
} from "@/types/supportTicket";

export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
export const ACCEPTED_ATTACHMENTS = "image/png,image/jpeg,image/webp,image/gif,application/pdf";

export const TICKET_CATEGORIES: Array<{ id: string; label: string; icon: string }> = [
  { id: "siparis", label: "Sipariş", icon: "ri-shopping-bag-3-line" },
  { id: "kargo", label: "Kargo & Teslimat", icon: "ri-truck-line" },
  { id: "urun", label: "Ürün Bilgisi", icon: "ri-cpu-line" },
  { id: "odeme", label: "Ödeme & Fatura", icon: "ri-bank-card-line" },
  { id: "iade", label: "İade & Değişim", icon: "ri-arrow-go-back-line" },
  { id: "teknik", label: "Teknik Destek", icon: "ri-tools-line" },
  { id: "genel", label: "Genel Bilgi", icon: "ri-question-line" },
];

export const STATUS_META: Record<TicketStatus, { label: string; icon: string; tone: string }> = {
  open: { label: "Yeni Talep", icon: "ri-mail-unread-line", tone: "bg-secondary-200 text-secondary-950" },
  customer_reply: {
    label: "Müşteri Yanıtladı",
    icon: "ri-reply-line",
    tone: "bg-primary-100 text-primary-900 dark:bg-primary-200 dark:text-primary-950",
  },
  answered: { label: "Yanıtlandı", icon: "ri-check-double-line", tone: "bg-accent-100 text-accent-900" },
  closed: { label: "Kapatıldı", icon: "ri-lock-line", tone: "bg-background-200 text-foreground-700" },
};

export const PRIORITY_META: Record<TicketPriority, { label: string; tone: string }> = {
  low: { label: "Düşük", tone: "bg-background-200 text-foreground-700" },
  normal: { label: "Normal", tone: "bg-background-100 text-foreground-800" },
  high: { label: "Yüksek", tone: "bg-secondary-200 text-secondary-950" },
  urgent: { label: "Acil", tone: "bg-foreground-900 text-background-50" },
};

export const categoryLabel = (id: string): string =>
  TICKET_CATEGORIES.find((item) => item.id === id)?.label ?? "Genel Bilgi";

export const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatTicketDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTicketShortDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return date.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
};

export const isImageAttachment = (type: string): boolean => type.startsWith("image/");

/** Dosyayı base64'e çevirir (yükleme sunucu üzerinden yapılır). */
export const readFileAsBase64 = (file: File): Promise<PendingAttachment> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const base64 = result.includes(",") ? result.slice(result.indexOf(",") + 1) : result;
      resolve({ name: file.name, type: file.type || "application/octet-stream", size: file.size, dataBase64: base64 });
    };
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });

export const hasAttachmentUrl = (attachment: TicketAttachment): boolean => Boolean(attachment.url);

const extractError = async (error: unknown): Promise<{ code: string; message: string }> => {
  const fallback = { code: "network", message: "Sunucuya ulaşılamadı. Bağlantınızı kontrol edin." };
  try {
    const context = (error as { context?: { json?: () => Promise<unknown> } } | null)?.context;
    if (context && typeof context.json === "function") {
      const parsed = (await context.json()) as { code?: string; message?: string } | null;
      return {
        code: parsed?.code ? String(parsed.code) : fallback.code,
        message: parsed?.message ? String(parsed.message) : fallback.message,
      };
    }
  } catch {
    /* yanıt gövdesi okunamadı */
  }
  return fallback;
};

const invoke = async <T>(body: Record<string, unknown>): Promise<TicketResult<T>> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }
  try {
    const { data, error } = await supabase.functions.invoke("support-tickets", { body });
    if (error) {
      const parsed = await extractError(error);
      return { ok: false, code: parsed.code, message: parsed.message };
    }
    const payload = (data ?? {}) as { ok?: boolean; code?: string; message?: string } & Record<string, unknown>;
    if (payload.ok !== true) {
      return {
        ok: false,
        code: payload.code ? String(payload.code) : "error",
        message: payload.message ? String(payload.message) : "İşlem tamamlanamadı.",
      };
    }
    return { ok: true, data: payload as unknown as T };
  } catch (error) {
    const parsed = await extractError(error);
    return { ok: false, code: parsed.code, message: parsed.message };
  }
};

const adminInvoke = async <T>(body: Record<string, unknown>): Promise<TicketResult<T>> => {
  const token = readAdminToken();
  if (!token) {
    return {
      ok: false,
      code: "unauthorized",
      message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapın.",
    };
  }
  return invoke<T>({ ...body, token });
};

export const createSupportTicket = async (
  input: TicketCreateInput,
): Promise<TicketResult<{ ticketNo: string; id: string }>> =>
  invoke<{ ticketNo: string; id: string }>({ action: "public_create", ...input });

export const trackSupportTicket = async (
  ticketNo: string,
  email: string,
): Promise<TicketResult<{ ticket: SupportTicketDetail }>> =>
  invoke<{ ticket: SupportTicketDetail }>({ action: "public_track", ticketNo, email });

export const replySupportTicket = async (
  ticketNo: string,
  email: string,
  body: string,
  attachments: PendingAttachment[],
): Promise<TicketResult<{ ticket: SupportTicketDetail }>> =>
  invoke<{ ticket: SupportTicketDetail }>({ action: "public_reply", ticketNo, email, body, attachments });

export const adminListTickets = async (
  status: string,
  search: string,
): Promise<TicketResult<{ tickets: SupportTicketSummary[]; counts: TicketCounts }>> =>
  adminInvoke<{ tickets: SupportTicketSummary[]; counts: TicketCounts }>({ action: "admin_list", status, search });

export const adminGetTicket = async (
  id: string,
): Promise<TicketResult<{ ticket: SupportTicketDetail }>> =>
  adminInvoke<{ ticket: SupportTicketDetail }>({ action: "admin_get", id });

export const adminReplyTicket = async (
  id: string,
  body: string,
  attachments: PendingAttachment[],
): Promise<TicketResult<unknown>> => adminInvoke({ action: "admin_reply", id, body, attachments });

export const adminUpdateTicket = async (
  id: string,
  patch: { status?: TicketStatus; priority?: TicketPriority; claim?: boolean; release?: boolean },
): Promise<TicketResult<unknown>> => adminInvoke({ action: "admin_update", id, ...patch });