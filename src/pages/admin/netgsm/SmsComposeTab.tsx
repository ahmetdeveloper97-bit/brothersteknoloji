import { useMemo, useState } from "react";
import { Banner, Field, Kpi, Panel, inputClass, textareaClass } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { smsGroups, smsLengthInfo } from "@/lib/integrations";
import type { NetgsmSettings, SmsContact, SmsMessage, SmsTemplate } from "@/types/integrations";

interface SmsComposeTabProps {
  settings: NetgsmSettings;
  contacts: SmsContact[];
  templates: SmsTemplate[];
  logs: SmsMessage[];
  onLogs: (logs: SmsMessage[]) => void;
  onBalance: (balance: number) => void;
}

const SMS_UNIT_PRICE = 0.065;

export default function SmsComposeTab({ settings, contacts, templates, logs, onLogs, onBalance }: SmsComposeTabProps) {
  const [group, setGroup] = useState("Tüm Müşteriler");
  const [templateId, setTemplateId] = useState("");
  const [body, setBody] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "danger" | "warning"; text: string } | null>(null);

  const recipients = useMemo(
    () => contacts.filter((contact) => contact.group === group && (settings.iysFilter ? contact.optIn : true)),
    [contacts, group, settings.iysFilter]
  );

  const info = smsLengthInfo(body);
  const cost = recipients.length * info.parts * SMS_UNIT_PRICE;

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const found = templates.find((template) => template.id === id);
    if (found) setBody(found.body);
  };

  const stamp = () =>
    new Date().toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendBulk = () => {
    if (!settings.enabled) {
      setFeedback({ tone: "warning", text: "NetGSM entegrasyonu kapalı. Ayarlar sekmesinden aktifleştirin." });
      return;
    }
    if (body.trim().length < 10) {
      setFeedback({ tone: "danger", text: "Mesaj en az 10 karakter olmalı." });
      return;
    }
    if (recipients.length === 0) {
      setFeedback({ tone: "danger", text: "Bu grupta gönderilebilir (İYS onaylı) kişi yok." });
      return;
    }
    if (settings.balance < recipients.length * info.parts) {
      setFeedback({ tone: "danger", text: "Kontör bakiyesi yetersiz. Ayarlar sekmesinden kontör yükleyin." });
      return;
    }

    const created: SmsMessage[] = recipients.map((contact, index) => ({
      id: `SMS-${Date.now().toString().slice(-6)}${index}`,
      to: contact.phone,
      name: contact.name,
      body: body.trim(),
      status: "delivered",
      date: stamp(),
      header: settings.header,
    }));

    onLogs([...created, ...logs]);
    onBalance(settings.balance - recipients.length * info.parts);
    setFeedback({
      tone: "success",
      text: `${recipients.length} kişiye ${info.parts} SMS gönderildi. Tahmini maliyet ${formatPrice(cost)}.`,
    });
  };

  const sendTest = () => {
    if (testPhone.replace(/\D/g, "").length < 10) {
      setFeedback({ tone: "danger", text: "Test için geçerli bir telefon numarası girin." });
      return;
    }
    const created: SmsMessage = {
      id: `SMS-T${Date.now().toString().slice(-6)}`,
      to: testPhone,
      name: "Test Gönderimi",
      body: body.trim() || "Brothers Teknoloji NetGSM test mesajı.",
      status: settings.enabled ? "delivered" : "queued",
      date: stamp(),
      header: settings.header,
    };
    onLogs([created, ...logs]);
    setFeedback({ tone: "success", text: `Test SMS ${testPhone} numarasına gönderildi.` });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        {feedback && (
          <Banner tone={feedback.tone} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Banner>
        )}

        <Panel title="Toplu SMS Gönderimi" subtitle="Grup seçin, şablon uygulayın ve gönderin" icon="ri-send-plane-line">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Alıcı grubu" hint={`${recipients.length} kişi · İYS filtresi ${settings.iysFilter ? "açık" : "kapalı"}`}>
                <select value={group} onChange={(event) => setGroup(event.target.value)} className={inputClass}>
                  {smsGroups.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Hazır şablon">
                <select value={templateId} onChange={(event) => applyTemplate(event.target.value)} className={inputClass}>
                  <option value="">Şablon seçin</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="SMS metni" hint="Başlık gönderici adı olarak eklenir, mesaja dahil değildir.">
              <textarea
                rows={5}
                value={body}
                onChange={(event) => setBody(event.target.value.slice(0, 640))}
                placeholder="Sayin {ad}, ..."
                className={textareaClass}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-foreground-600">
              <span className="rounded-md bg-background-100 px-2 py-1">{info.chars} karakter</span>
              <span className="rounded-md bg-background-100 px-2 py-1">{info.parts} SMS / kişi</span>
              <span className="rounded-md bg-background-100 px-2 py-1">
                {recipients.length} alıcı · {recipients.length * info.parts} kontör
              </span>
              <span className="rounded-md bg-accent-100 px-2 py-1 font-semibold text-accent-900">
                ≈ {formatPrice(cost)}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={sendBulk}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-send-plane-line" />
                Toplu Gönder
              </button>
              <p className="text-[11px] text-foreground-500">
                Gönderim NetGSM {settings.header} başlığı ile yapılır.
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Test Gönderimi" subtitle="Kampanyayı yayınlamadan önce kendinize gönderin" icon="ri-test-tube-line">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={testPhone}
              onChange={(event) => setTestPhone(event.target.value)}
              placeholder="05xx xxx xx xx"
              className={inputClass}
            />
            <button
              type="button"
              onClick={sendTest}
              className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-4 text-sm font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-smartphone-line" />
              Test Gönder
            </button>
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Kpi icon="ri-coin-line" label="Kontör" value={String(settings.balance)} hint="Kalan bakiye" tone="success" />
          <Kpi icon="ri-signal-tower-line" label="Başlık" value={settings.header} hint="Onaylı gönderici" tone="info" />
        </div>

        <Panel title="Mesaj Önizleme" subtitle="Alıcının telefonunda nasıl görünür" icon="ri-smartphone-line">
          <div className="rounded-2xl border border-background-300 bg-background-100 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-foreground-500">
              <i className="ri-message-2-line" />
              {settings.senderName} · şimdi
            </div>
            <div className="rounded-xl rounded-tl-sm bg-background-50 p-3 text-xs leading-relaxed text-foreground-800 shadow-sm">
              {body.trim() || "Mesaj metniniz burada görünecek."}
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-foreground-500">
            İYS filtresi açıkken yalnızca onaylı kişilere gönderim yapılır. Ticari mesajlar için İYS kaydı zorunludur.
          </p>
        </Panel>
      </div>
    </div>
  );
}