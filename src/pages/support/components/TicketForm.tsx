import { useState } from "react";
import type { FormEvent } from "react";
import { inputClass, textareaClass } from "@/components/base/AdminUI";
import TicketAttachmentPicker from "@/components/feature/TicketAttachmentPicker";
import { TICKET_CATEGORIES, createSupportTicket } from "@/lib/supportTickets";
import type { PendingAttachment } from "@/types/supportTicket";

interface TicketFormProps {
  onOpenTracker: (ticketNo: string, email: string) => void;
}

type Status = "idle" | "sending";

export default function TicketForm({ onOpenTracker }: TicketFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("genel");
  const [subject, setSubject] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [createdNo, setCreatedNo] = useState("");
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCategory("genel");
    setSubject("");
    setOrderNo("");
    setMessage("");
    setAttachments([]);
    setError("");
    setCreatedNo("");
    setCopied(false);
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Lütfen adınızı ve soyadınızı yazın.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Geçerli bir e-posta adresi girin. Yanıtımız bu adrese gönderilecek.");
      return;
    }
    if (subject.trim().length < 3) {
      setError("Konu en az 3 karakter olmalı.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Talebinizi en az 10 karakterle anlatın.");
      return;
    }

    setStatus("sending");
    try {
      const result = await createSupportTicket({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: subject.trim(),
        category,
        message: message.trim(),
        orderNo: orderNo.trim(),
        attachments,
      });

      if (!result.ok) {
        setError(result.message ?? "Talebiniz oluşturulamadı. Lütfen tekrar deneyin.");
        setStatus("idle");
        return;
      }

      const ticketNo = String(result.data?.ticketNo ?? "");
      setCreatedNo(ticketNo);
      setStatus("idle");
    } catch {
      setError("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
      setStatus("idle");
    }
  };

  const copyTicketNo = async () => {
    try {
      await navigator.clipboard.writeText(createdNo);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (createdNo) {
    return (
      <div className="rounded-xl border border-background-200 bg-background-50 p-5 md:p-8">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-800">
            <i className="ri-checkbox-circle-line text-2xl" />
          </span>
          <h2 className="mt-3 font-heading text-lg font-bold text-foreground-950">Talebiniz oluşturuldu</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">
            Destek ekibimiz talebinizi inceleyip <strong className="font-semibold text-foreground-900">{email}</strong>{" "}
            adresine yanıt verecek.
          </p>

          <div className="mt-4 rounded-xl border border-dashed border-primary-300 bg-primary-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-800">Talep numaranız</p>
            <p className="mt-1 font-mono text-xl font-bold tracking-wide text-primary-950">{createdNo}</p>
            <button
              type="button"
              onClick={() => void copyTicketNo()}
              className="mt-2 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 py-1.5 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
              {copied ? "Kopyalandı" : "Numarayı kopyala"}
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-foreground-500">
            Bu numarayı saklayın. Aynı numara ve e-posta ile talebinizi takip edebilir, ek bilgi veya dosya
            gönderebilirsiniz.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => onOpenTracker(createdNo, email)}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-5 text-sm font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-search-eye-line" />
              Talebimi görüntüle
            </button>
            <button
              type="button"
              onClick={reset}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-background-300 px-5 text-sm font-medium text-foreground-700 hover:bg-background-100"
            >
              <i className="ri-add-line" />
              Yeni talep oluştur
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="rounded-xl border border-background-200 bg-background-50">
      <div className="border-b border-background-200 px-4 py-3 md:px-5">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground-950">
          <i className="ri-ticket-2-line text-base text-primary-700" />
          Yeni destek talebi
        </h2>
        <p className="mt-0.5 text-[11px] text-foreground-500">
          Formu doldurun, talebiniz numaralanır ve destek ekibinin kuyruğuna düşer.
        </p>
      </div>

      <div className="space-y-3 p-4 md:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Ad Soyad *</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder="Adınız Soyadınız"
              className={inputClass}
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-foreground-700">E-posta *</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={120}
              placeholder="ornek@eposta.com"
              className={inputClass}
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Telefon</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              maxLength={30}
              placeholder="05xx xxx xx xx"
              className={inputClass}
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Sipariş numarası</span>
            <input
              value={orderNo}
              onChange={(event) => setOrderNo(event.target.value)}
              maxLength={40}
              placeholder="Örn. BT-2026-1042"
              className={inputClass}
            />
          </label>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Talep konusu *</span>
          <div className="flex flex-wrap gap-1.5">
            {TICKET_CATEGORIES.map((item) => {
              const active = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    active
                      ? "border-primary-700 bg-primary-800 text-background-50"
                      : "border-background-300 bg-background-50 text-foreground-600 hover:border-primary-300 hover:bg-primary-50"
                  }`}
                >
                  <i className={item.icon} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block min-w-0">
          <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Konu başlığı *</span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={140}
            placeholder="Örn. Kargom iki gündür hareket etmiyor"
            className={inputClass}
          />
        </label>

        <label className="block min-w-0">
          <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-foreground-700">
            Talebiniz *
            <span className="font-normal text-foreground-400">{message.length}/1500</span>
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={1500}
            rows={6}
            placeholder="Sorunu veya talebinizi detaylı anlatın. Hata mesajı varsa aynen yazabilirsiniz."
            className={textareaClass}
          />
        </label>

        <TicketAttachmentPicker value={attachments} onChange={setAttachments} onError={setError} />

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-50 px-3 py-2.5 text-xs leading-relaxed text-secondary-950">
            <i className="ri-error-warning-line mt-0.5 text-base" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-background-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] leading-relaxed text-foreground-500">
            * Zorunlu alanlar. Talebiniz e-posta adresinize bağlanır.
          </p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-5 text-sm font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "sending" ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                Gönderiliyor
              </>
            ) : (
              <>
                <i className="ri-send-plane-line" />
                Talebi Gönder
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}