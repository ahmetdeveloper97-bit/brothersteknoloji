import { useEffect, useState } from "react";
import { loadWhatsAppSettings } from "@/lib/integrations";
import { emitSupportPanel, subscribeSupportPanel } from "@/lib/supportWidgets";
import { BUSINESS_WHATSAPP_LABEL, formatTrPhone, waLink } from "@/lib/whatsapp";
import type { WhatsAppSettings } from "@/types/integrations";

export default function WhatsAppWidget() {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);

  useEffect(() => {
    setSettings(loadWhatsAppSettings());
  }, []);

  useEffect(() => {
    emitSupportPanel("whatsapp", open);
  }, [open]);

  useEffect(
    () =>
      subscribeSupportPanel(({ source, open: isOpen }) => {
        if (source === "whatsapp") return;
        setOtherOpen(isOpen);
        if (isOpen) setOpen(false);
      }),
    [],
  );

  if (!settings || !settings.liveSupportEnabled) return null;

  const send = () => {
    const text = message.trim() || "Merhaba, canlı destek almak istiyorum.";
    window.open(waLink(settings.businessNumber, text), "_blank", "noopener,noreferrer");
    setOpened(true);
  };

  return (
    <>
      <div
        className={`fixed bottom-24 right-4 z-[60] w-[calc(100vw-2rem)] max-w-[360px] origin-bottom-right transition-all duration-200 md:right-6 ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-background-200 bg-background-50 shadow-2xl">
          <div className="flex items-start gap-3 bg-accent-700 px-4 py-3.5 text-background-50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-50/20">
              <i className="ri-whatsapp-line text-xl" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-bold">{settings.displayName}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-background-50/90">
                <i className="ri-phone-line" />
                <span className="font-semibold">{formatTrPhone(settings.businessNumber) || BUSINESS_WHATSAPP_LABEL}</span>
                <span className="text-background-50/60">·</span>
                <span className="flex items-center gap-1 text-background-50/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-background-50" />
                  Genellikle 2 dakikada yanıt
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Destek penceresini kapat"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-background-50/80 hover:bg-background-50/15 hover:text-background-50"
            >
              <i className="ri-close-line" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background-100 px-4 py-4">
            <div className="max-w-[95%] rounded-xl rounded-tl-sm border border-background-200 bg-background-50 px-3 py-2.5 text-xs leading-relaxed text-foreground-800">
              {settings.greeting}
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-foreground-500">
              <i className="ri-time-line" />
              {settings.workingHours}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {settings.quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  onClick={() => {
                    setMessage(reply.text);
                    setOpened(false);
                  }}
                  className="cursor-pointer whitespace-nowrap rounded-full border border-accent-300 bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-900 hover:bg-accent-100"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-background-200 bg-background-50 px-3 py-3">
            <textarea
              value={message}
              onChange={(event) => {
                setMessage(event.target.value.slice(0, 500));
                setOpened(false);
              }}
              placeholder="Mesajınızı yazın..."
              rows={2}
              className="box-border w-full resize-none rounded-lg border border-background-300 bg-background-100 px-3 py-2 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-accent-500 focus:bg-background-50"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="truncate text-[10px] text-foreground-400">{formatTrPhone(settings.businessNumber) || BUSINESS_WHATSAPP_LABEL} numarasına gönderilir</span>
              <button
                type="button"
                onClick={send}
                className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-accent-600 px-3 text-xs font-semibold text-background-50 hover:bg-accent-700"
              >
                <i className="ri-whatsapp-line text-base" />
                Gönder
              </button>
            </div>
            {opened && (
              <p className="mt-2 flex items-center gap-1 rounded-md bg-accent-50 px-2 py-1.5 text-[11px] text-accent-900">
                <i className="ri-checkbox-circle-line" />
                WhatsApp açıldı, mesajı göndererek sohbeti başlatabilirsiniz.
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="WhatsApp canlı destek"
        className={`fixed bottom-5 right-4 z-[60] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent-600 text-background-50 shadow-lg shadow-accent-900/25 transition-all hover:scale-105 hover:bg-accent-700 md:bottom-6 md:right-6 ${
          otherOpen && !open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
        }`}
      >
        <i className={`${open ? "ri-close-line" : "ri-whatsapp-line"} text-2xl`} />
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background-50 bg-foreground-950 text-[9px] font-bold text-background-50">
            1
          </span>
        )}
      </button>
    </>
  );
}