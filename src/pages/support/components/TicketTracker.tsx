import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { inputClass, textareaClass } from "@/components/base/AdminUI";
import TicketAttachmentPicker from "@/components/feature/TicketAttachmentPicker";
import {
  STATUS_META,
  categoryLabel,
  formatFileSize,
  formatTicketDate,
  isImageAttachment,
  replySupportTicket,
  trackSupportTicket,
} from "@/lib/supportTickets";
import type { PendingAttachment, SupportTicketDetail } from "@/types/supportTicket";

interface TicketTrackerProps {
  initialTicketNo?: string;
  initialEmail?: string;
}

export default function TicketTracker({ initialTicketNo = "", initialEmail = "" }: TicketTrackerProps) {
  const [ticketNo, setTicketNo] = useState(initialTicketNo);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState<SupportTicketDetail | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [replyError, setReplyError] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (initialTicketNo) setTicketNo(initialTicketNo);
    if (initialEmail) setEmail(initialEmail);
  }, [initialTicketNo, initialEmail]);

  const load = async (no: string, mail: string) => {
    setError("");
    setNotice("");
    if (!no.trim() || !mail.trim()) {
      setError("Talep numarası ve e-posta adresi gerekiyor.");
      return;
    }
    setLoading(true);
    try {
      const result = await trackSupportTicket(no.trim().toUpperCase(), mail.trim().toLowerCase());
      if (!result.ok || !result.data?.ticket) {
        setTicket(null);
        setError(result.message ?? "Talep bulunamadı. Numarayı kontrol edin.");
        return;
      }
      setTicket(result.data.ticket);
    } catch {
      setError("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    void load(ticketNo, email);
  };

  const handleReply = async () => {
    if (!ticket) return;
    setReplyError("");
    if (replyBody.trim().length < 2) {
      setReplyError("Lütfen mesajınızı yazın.");
      return;
    }
    setSendingReply(true);
    try {
      const result = await replySupportTicket(
        ticket.ticketNo,
        ticket.email,
        replyBody.trim(),
        attachments,
      );
      if (!result.ok || !result.data?.ticket) {
        setReplyError(result.message ?? "Mesajınız gönderilemedi.");
        return;
      }
      setTicket(result.data.ticket);
      setReplyBody("");
      setAttachments([]);
      setNotice("Mesajınız destek ekibine iletildi.");
    } catch {
      setReplyError("Bağlantı kurulamadı. Lütfen tekrar deneyin.");
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="rounded-xl border border-background-200 bg-background-50 p-4 md:p-5">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
          <i className="ri-search-eye-line text-base text-primary-700" />
          Talebinizi sorgulayın
        </h2>
        <p className="mt-0.5 text-[11px] text-foreground-500">
          Talep numarası ve talep oluştururken kullandığınız e-posta adresi ile geçmişi görüntüleyin.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)_auto]">
          <input
            value={ticketNo}
            onChange={(event) => setTicketNo(event.target.value)}
            placeholder="TK-20261111-1234"
            className={`${inputClass} font-mono uppercase`}
          />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ornek@eposta.com"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-search-line" />}
            Sorgula
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2.5 text-xs leading-relaxed text-secondary-950">
            <i className="ri-error-warning-line mt-0.5 text-base" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {ticket && (
        <div className="rounded-xl border border-background-200 bg-background-50">
          <div className="flex flex-col gap-2 border-b border-background-200 px-4 py-3 md:flex-row md:items-center md:px-5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-primary-800">{ticket.ticketNo}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[ticket.status].tone}`}>
                  <i className={STATUS_META[ticket.status].icon} />
                  {STATUS_META[ticket.status].label}
                </span>
                <span className="rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-medium text-foreground-600">
                  {categoryLabel(ticket.category)}
                </span>
              </div>
              <h3 className="mt-1 font-heading text-base font-bold text-foreground-950">{ticket.subject}</h3>
              <p className="mt-0.5 text-[11px] text-foreground-500">
                {formatTicketDate(ticket.createdAt)} tarihinde oluşturuldu
                {ticket.orderNo && ` · Sipariş: ${ticket.orderNo}`}
                {ticket.assignedName && ` · İlgilenen: ${ticket.assignedName}`}
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 md:p-5">
            {ticket.messages.map((msg) => {
              const fromStaff = msg.sender === "staff";
              return (
                <div key={msg.id} className={`flex ${fromStaff ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl border px-3.5 py-2.5 ${
                      fromStaff
                        ? "border-primary-200 bg-primary-50 text-primary-950"
                        : "border-background-200 bg-background-100 text-foreground-900"
                    }`}
                  >
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide opacity-70">
                      <i className={fromStaff ? "ri-customer-service-2-line" : "ri-user-3-line"} />
                      {fromStaff ? msg.authorName || "Destek Ekibi" : "Siz"}
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
                              <i className="ri-download-2-line shrink-0" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}

            {ticket.status === "closed" ? (
              <div className="rounded-lg border border-background-300 bg-background-100 px-3 py-2.5 text-xs leading-relaxed text-foreground-600">
                <i className="ri-lock-line mr-1" />
                Bu talep kapatıldı. Yeni bir konu için yeni talep oluşturabilirsiniz.
              </div>
            ) : (
              <div className="rounded-xl border border-background-200 bg-background-50 p-3">
                <p className="mb-2 text-xs font-semibold text-foreground-800">Talebe ek bilgi gönder</p>
                <textarea
                  value={replyBody}
                  onChange={(event) => setReplyBody(event.target.value)}
                  maxLength={1500}
                  rows={3}
                  placeholder="Eklemek istediğiniz bilgi, dosya açıklaması veya sorunuz..."
                  className={textareaClass}
                />
                <div className="mt-2">
                  <TicketAttachmentPicker
                    value={attachments}
                    onChange={setAttachments}
                    onError={setReplyError}
                    hint="PNG, JPG, WEBP, GIF veya PDF · Her dosya en fazla 3 MB"
                  />
                </div>
                {replyError && (
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-secondary-900">
                    <i className="ri-error-warning-line" />
                    {replyError}
                  </p>
                )}
                {notice && (
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-accent-800">
                    <i className="ri-checkbox-circle-line" />
                    {notice}
                  </p>
                )}
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void handleReply()}
                    disabled={sendingReply}
                    className="flex h-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sendingReply ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-send-plane-line" />}
                    Mesajı gönder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}