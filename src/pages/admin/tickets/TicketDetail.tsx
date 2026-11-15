import { useCallback, useEffect, useState } from "react";
import TicketAttachmentPicker from "@/components/feature/TicketAttachmentPicker";
import { textareaClass } from "@/components/base/AdminUI";
import {
  PRIORITY_META,
  STATUS_META,
  adminGetTicket,
  adminReplyTicket,
  adminUpdateTicket,
  categoryLabel,
  formatFileSize,
  formatTicketDate,
  isImageAttachment,
} from "@/lib/supportTickets";
import type { PendingAttachment, SupportTicketDetail, TicketPriority, TicketStatus } from "@/types/supportTicket";

interface TicketDetailProps {
  ticketId: string;
  onChanged: () => void;
}

const statusOptions: TicketStatus[] = ["open", "customer_reply", "answered", "closed"];
const priorityOptions: TicketPriority[] = ["low", "normal", "high", "urgent"];

export default function TicketDetail({ ticketId, onChanged }: TicketDetailProps) {
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [replyError, setReplyError] = useState("");
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await adminGetTicket(ticketId);
      if (!result.ok || !result.data?.ticket) {
        setTicket(null);
        setError(result.message ?? "Talep yüklenemedi.");
        return;
      }
      setTicket(result.data.ticket);
    } catch {
      setError("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    setReplyBody("");
    setAttachments([]);
    setReplyError("");
    setNotice("");
    void load();
  }, [load]);

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("");
    }
  };

  const handleReply = async () => {
    if (!ticket) return;
    setReplyError("");
    setNotice("");
    if (replyBody.trim().length < 2) {
      setReplyError("Lütfen yanıtınızı yazın.");
      return;
    }
    setSending(true);
    try {
      const result = await adminReplyTicket(ticket.id, replyBody.trim(), attachments);
      if (!result.ok) {
        setReplyError(result.message ?? "Yanıt gönderilemedi.");
        return;
      }
      setReplyBody("");
      setAttachments([]);
      setNotice("Yanıt müşteriye iletildi ve talep yanıtlandı olarak işaretlendi.");
      await load();
      onChanged();
    } catch {
      setReplyError("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSending(false);
    }
  };

  const patchTicket = async (patch: { status?: TicketStatus; priority?: TicketPriority; claim?: boolean }) => {
    if (!ticket) return;
    setBusy(true);
    setNotice("");
    try {
      const result = await adminUpdateTicket(ticket.id, patch);
      if (!result.ok) {
        setError(result.message ?? "İşlem tamamlanamadı.");
        return;
      }
      await load();
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        <div className="h-16 animate-pulse rounded-lg bg-background-100" />
        <div className="h-32 animate-pulse rounded-lg bg-background-100" />
        <div className="h-40 animate-pulse rounded-lg bg-background-100" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="px-4 py-16 text-center">
        <i className="ri-error-warning-line mb-2 block text-3xl text-foreground-300" />
        <p className="text-sm font-medium text-foreground-700">{error || "Talep bulunamadı."}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
        >
          <i className="ri-refresh-line" />
          Tekrar dene
        </button>
      </div>
    );
  }

  const status = STATUS_META[ticket.status];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-background-200 px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void copyValue(ticket.ticketNo, "no")}
            className="flex cursor-pointer items-center gap-1 rounded-full bg-background-100 px-2 py-0.5 font-mono text-[10px] font-bold text-foreground-700 hover:bg-background-200"
            title="Talep numarasını kopyala"
          >
            {ticket.ticketNo}
            <i className={copied === "no" ? "ri-check-line" : "ri-file-copy-line"} />
          </button>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${status.tone}`}>
            <i className={status.icon} />
            {status.label}
          </span>
          <span className="rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-medium text-foreground-600">
            {categoryLabel(ticket.category)}
          </span>
          {ticket.assignedName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-800">
              <i className="ri-user-star-line" />
              {ticket.assignedName}
            </span>
          )}
          <button
            type="button"
            onClick={() => void load()}
            aria-label="Yenile"
            className="ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
          >
            <i className="ri-refresh-line" />
          </button>
        </div>

        <h3 className="mt-1.5 font-heading text-base font-bold text-foreground-950">{ticket.subject}</h3>
        <p className="mt-0.5 text-[11px] text-foreground-500">
          {formatTicketDate(ticket.createdAt)} tarihinde oluşturuldu · Son hareket {formatTicketDate(ticket.lastMessageAt)}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void patchTicket({ claim: true })}
            className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-100 disabled:opacity-60"
          >
            <i className="ri-user-add-line" />
            Üzerime al
          </button>

          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground-600">
            Durum
            <select
              value={ticket.status}
              disabled={busy}
              onChange={(event) => void patchTicket({ status: event.target.value as TicketStatus })}
              className="h-8 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-[11px] font-medium text-foreground-800"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {STATUS_META[option].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground-600">
            Öncelik
            <select
              value={ticket.priority}
              disabled={busy}
              onChange={(event) => void patchTicket({ priority: event.target.value as TicketPriority })}
              className="h-8 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-[11px] font-medium text-foreground-800"
            >
              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {PRIORITY_META[option].label}
                </option>
              ))}
            </select>
          </label>

          {ticket.status === "closed" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void patchTicket({ status: "open" })}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-primary-700 disabled:opacity-60"
            >
              <i className="ri-lock-unlock-line" />
              Yeniden aç
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => void patchTicket({ status: "closed" })}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-100 disabled:opacity-60"
            >
              <i className="ri-lock-line" />
              Talebi kapat
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 border-b border-background-200 bg-background-100/60 px-4 py-3 sm:grid-cols-2 md:px-5">
        <div className="flex items-center gap-2 text-[11px]">
          <i className="ri-user-3-line text-foreground-400" />
          <span className="font-semibold text-foreground-900">{ticket.name}</span>
          {ticket.phone && <span className="text-foreground-500">· {ticket.phone}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <i className="ri-mail-line text-foreground-400" />
          <a href={`mailto:${ticket.email}`} className="cursor-pointer truncate text-primary-800 hover:underline">
            {ticket.email}
          </a>
          <button
            type="button"
            onClick={() => void copyValue(ticket.email, "mail")}
            aria-label="E-posta adresini kopyala"
            className="cursor-pointer text-foreground-400 hover:text-foreground-800"
          >
            <i className={copied === "mail" ? "ri-check-line" : "ri-file-copy-line"} />
          </button>
        </div>
        {ticket.orderNo && (
          <div className="flex items-center gap-2 text-[11px]">
            <i className="ri-shopping-bag-3-line text-foreground-400" />
            <span className="text-foreground-700">Sipariş:</span>
            <span className="font-mono font-semibold text-foreground-900">{ticket.orderNo}</span>
          </div>
        )}
        {ticket.closedAt && (
          <div className="flex items-center gap-2 text-[11px]">
            <i className="ri-lock-line text-foreground-400" />
            <span className="text-foreground-700">Kapanış: {formatTicketDate(ticket.closedAt)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5">
        {ticket.messages.map((msg) => {
          const fromStaff = msg.sender === "staff";
          return (
            <div key={msg.id} className={`flex ${fromStaff ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] rounded-xl border px-3.5 py-2.5 ${
                  fromStaff
                    ? "border-primary-200 bg-primary-50 text-primary-950"
                    : "border-background-200 bg-background-50 text-foreground-900"
                }`}
              >
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide opacity-70">
                  <i className={fromStaff ? "ri-customer-service-2-line" : "ri-user-3-line"} />
                  {fromStaff ? msg.authorName || "Destek Ekibi" : ticket.name}
                  <span className="font-normal normal-case opacity-80">· {formatTicketDate(msg.createdAt)}</span>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed">{msg.body}</p>
                {msg.attachments.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {msg.attachments.map((file, index) => (
                      <li key={`${file.name}-${index}`}>
                        <a
                          href={file.url || undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-background-200 bg-background-50 px-2 py-1.5 text-[11px] text-foreground-800 hover:border-primary-300"
                        >
                          <i className={`${isImageAttachment(file.type) ? "ri-image-line" : "ri-file-pdf-line"} text-sm`} />
                          <span className="min-w-0 flex-1 truncate">{file.name}</span>
                          <span className="shrink-0 text-[10px] text-foreground-400">{formatFileSize(file.size)}</span>
                          <i className="ri-external-link-line shrink-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-background-200 p-4 md:px-5">
        {notice && (
          <div className="mb-2 flex items-start gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2 text-[11px] leading-relaxed text-accent-900">
            <i className="ri-checkbox-circle-line mt-0.5" />
            <span>{notice}</span>
          </div>
        )}
        {ticket.status === "closed" ? (
          <div className="flex items-center gap-2 rounded-lg border border-background-300 bg-background-100 px-3 py-2.5 text-[11px] text-foreground-600">
            <i className="ri-lock-line" />
            Talep kapatıldı. Yanıt yazmak için önce talebi yeniden açın.
          </div>
        ) : (
          <>
            <textarea
              value={replyBody}
              onChange={(event) => setReplyBody(event.target.value)}
              maxLength={3000}
              rows={3}
              placeholder="Müşteriye yanıtınızı yazın..."
              className={textareaClass}
            />
            <div className="mt-2">
              <TicketAttachmentPicker
                value={attachments}
                onChange={setAttachments}
                onError={setReplyError}
                hint="Yanıta dosya ekleyebilirsiniz · Her dosya en fazla 3 MB"
              />
            </div>
            {replyError && (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-secondary-900">
                <i className="ri-error-warning-line" />
                {replyError}
              </p>
            )}
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] leading-relaxed text-foreground-500">
                Yanıt gönderildiğinde talep “Yanıtlandı” olarak işaretlenir.
              </p>
              <button
                type="button"
                onClick={() => void handleReply()}
                disabled={sending}
                className="flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-line" />}
                Yanıtı Gönder
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}