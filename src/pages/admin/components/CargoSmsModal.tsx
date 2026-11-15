import { useMemo, useState } from "react";
import { Banner, Field, Pill, inputClass, textareaClass } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { loadNetgsmSettings } from "@/lib/integrations";
import {
  SMS_UNIT_PRICE,
  buildCargoSmsVars,
  cargoSmsTemplates,
  fillCargoSmsTemplate,
  sendCargoSms,
  smsCharInfo,
} from "@/lib/smsNotify";
import { statusMeta } from "@/lib/shipping";
import type { AdminOrder } from "@/types/store";
import type { Shipment } from "@/types/shipping";

interface CargoSmsModalProps {
  order: AdminOrder;
  shipment: Shipment;
  onClose: () => void;
}

export default function CargoSmsModal({ order, shipment, onClose }: CargoSmsModalProps) {
  const vars = useMemo(() => buildCargoSmsVars(order, shipment), [order, shipment]);
  const [templateId, setTemplateId] = useState(
    shipment.status === "delivered" ? "delivered" : shipment.status === "returned" ? "returned" : "onTheWay"
  );
  const [body, setBody] = useState(
    () => fillCargoSmsTemplate(cargoSmsTemplates.find((item) => item.id === "onTheWay")?.body ?? "", vars)
  );
  const [phone, setPhone] = useState(order.phone);
  const [feedback, setFeedback] = useState<{ tone: "success" | "danger"; text: string; logId?: string } | null>(null);
  const [settings] = useState(() => loadNetgsmSettings());

  const info = smsCharInfo(body);
  const cost = info.parts * SMS_UNIT_PRICE;

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const found = cargoSmsTemplates.find((item) => item.id === id);
    if (found) {
      setBody(fillCargoSmsTemplate(found.body, vars));
      setFeedback(null);
    }
  };

  const send = () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setFeedback({ tone: "danger", text: "Geçerli bir telefon numarası girin." });
      return;
    }
    if (body.trim().length < 10) {
      setFeedback({ tone: "danger", text: "Mesaj en az 10 karakter olmalı." });
      return;
    }
    const result = sendCargoSms({ phone, name: order.customer, body, orderId: order.id });
    setFeedback({
      tone: result.ok ? "success" : "danger",
      text: result.message,
      logId: result.log?.id,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-0 sm:items-center sm:px-4">
      <div onClick={onClose} className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm" />

      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-background-200 bg-background-50 shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-background-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-base font-bold text-foreground-950">Kargo Durumunu SMS ile Bildir</h2>
              <Pill tone="info">
                <i className="ri-mail-send-line" />
                NetGSM
              </Pill>
            </div>
            <p className="mt-1 text-xs text-foreground-500">
              {order.id} · {shipment.tracking} · {statusMeta[shipment.status].label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {feedback && (
            <Banner tone={feedback.tone} onClose={() => setFeedback(null)}>
              <span>
                {feedback.text}
                {feedback.logId && (
                  <span className="mt-1 block font-mono text-[11px] opacity-80">
                    Kayıt no: {feedback.logId} · NetGSM → Raporlar sekmesinde görüntülenebilir.
                  </span>
                )}
              </span>
            </Banner>
          )}

          <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Alıcı numara" hint="Siparişteki numara otomatik gelir">
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className={inputClass} />
            </Field>
            <Field label="Hazır şablon" hint="Değişkenler otomatik doldurulur">
              <select value={templateId} onChange={(event) => applyTemplate(event.target.value)} className={inputClass}>
                {cargoSmsTemplates.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-3">
            <Field label="SMS metni" hint="Değişkenler: {ad} {siparis} {firma} {takip} {eta} {link}">
              <textarea
                rows={4}
                value={body}
                onChange={(event) => {
                  setBody(event.target.value.slice(0, 640));
                  setFeedback(null);
                }}
                className={textareaClass}
              />
            </Field>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-foreground-600">
            <span className="rounded-md bg-background-100 px-2 py-1">{info.chars} karakter</span>
            <span className="rounded-md bg-background-100 px-2 py-1">{info.parts} SMS</span>
            <span className="rounded-md bg-background-100 px-2 py-1">{info.remaining} karakter kaldı</span>
            <span className="rounded-md bg-accent-100 px-2 py-1 font-semibold text-accent-900">
              ≈ {formatPrice(cost)}
            </span>
            <span className="ml-auto flex items-center gap-1 rounded-md bg-background-100 px-2 py-1">
              <i className="ri-coin-line" />
              Kontör {settings.balance}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-background-300 bg-background-100 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-foreground-500">
              <i className="ri-smartphone-line" />
              {settings.senderName || "Brothers Teknoloji"} · şimdi
            </div>
            <div className="rounded-xl rounded-tl-sm bg-background-50 p-3 text-xs leading-relaxed text-foreground-800 shadow-sm">
              {body.trim() || "Mesaj metniniz burada görünecek."}
            </div>
          </div>

          {!settings.enabled && (
            <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-secondary-100 px-3 py-2 text-[11px] leading-relaxed text-secondary-950">
              <i className="ri-error-warning-line mt-0.5" />
              NetGSM entegrasyonu kapalı. Mesaj kaydı oluşturulur fakat gönderim kuyruğa alınır. Entegrasyonu NetGSM →
              Ayarlar sekmesinden açabilirsiniz.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-background-200 px-5 py-3 sm:flex-row sm:items-center">
          <p className="text-[11px] leading-relaxed text-foreground-500 sm:flex-1">
            Gönderim <strong className="font-semibold text-foreground-800">{settings.header}</strong> onaylı başlığı ile
            yapılır ve NetGSM raporlarına işlenir.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-background-300 px-4 text-sm font-medium text-foreground-700 hover:bg-background-100"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={send}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-send-plane-line" />
            SMS Gönder
          </button>
        </div>
      </div>
    </div>
  );
}