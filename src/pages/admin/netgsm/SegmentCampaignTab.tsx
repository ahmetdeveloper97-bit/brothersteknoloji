import { useMemo, useState } from "react";
import { Banner, Field, Kpi, Panel, Pill, inputClass, textareaClass } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import {
  ADMIN_STORE_KEYS,
  campaignState,
  formatNumberTr,
  loadCampaigns,
  loadCustomers,
  segmentTone,
} from "@/lib/adminStore";
import { couponHintLabel } from "@/lib/coupons";
import { formatPrice } from "@/lib/format";
import { SMS_UNIT_PRICE, smsCharInfo } from "@/lib/smsNotify";
import {
  eligibleRecipients,
  fillSegmentTemplate,
  segmentCampaignTemplates,
  segmentOptions,
  segmentRecipients,
  sendSegmentCampaign,
} from "@/lib/segmentSms";
import type { SegmentKey } from "@/lib/segmentSms";
import type { AdminCustomer } from "@/types/admin";
import type { NetgsmSettings, SmsMessage } from "@/types/integrations";

interface SegmentCampaignTabProps {
  settings: NetgsmSettings;
  logs: SmsMessage[];
  onLogs: (logs: SmsMessage[]) => void;
  onSettings: (patch: Partial<NetgsmSettings>) => void;
}

const SEGMENT_LINK = "brothersteknoloji.com/kampanyalar";
const STORE_NAME = "Brothers Teknoloji";

const firstName = (name: string): string => name.split(" ")[0] || name;

export default function SegmentCampaignTab({ settings, logs, onLogs, onSettings }: SegmentCampaignTabProps) {
  const [customers] = usePersistentState<AdminCustomer[]>(ADMIN_STORE_KEYS.customers, loadCustomers());
  const [segment, setSegment] = useState<SegmentKey>("all");
  const [templateId, setTemplateId] = useState(segmentCampaignTemplates[0].id);
  const [body, setBody] = useState(segmentCampaignTemplates[0].body);
  const [couponId, setCouponId] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "success" | "danger" | "warning"; text: string } | null>(null);

  const campaigns = useMemo(
    () => loadCampaigns().filter((campaign) => campaignState(campaign) === "active"),
    []
  );

  const selectedCampaign = campaigns.find((campaign) => campaign.id === couponId) ?? null;
  const discountLabel = selectedCampaign ? couponHintLabel(selectedCampaign) : "%10";
  const couponCode = selectedCampaign?.code ?? "";

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    segmentOptions.forEach((option) => {
      map[option.id] =
        option.id === "all"
          ? customers.length
          : customers.filter((customer) => customer.segment === option.id).length;
    });
    return map;
  }, [customers]);

  const matched = useMemo(() => segmentRecipients(customers, segment), [customers, segment]);
  const recipients = useMemo(() => eligibleRecipients(customers, segment), [customers, segment]);
  const skipped = matched.length - recipients.length;

  const sample = recipients[0] ?? matched[0] ?? null;
  const sampleVars = {
    ad: sample ? firstName(sample.name) : "Ahmet",
    segment: segmentOptions.find((option) => option.id === segment)?.label ?? "Müşteri",
    kod: couponCode || "KUPON",
    indirim: discountLabel,
    link: SEGMENT_LINK,
    magaza: STORE_NAME,
  };
  const previewBody = fillSegmentTemplate(
    body.trim() || "Mesaj metniniz burada görünecek.",
    sampleVars
  );
  const info = smsCharInfo(previewBody);

  const estimatedCredits = useMemo(() => {
    if (body.trim().length < 10) return 0;
    return recipients.reduce((sum, customer) => {
      const message = fillSegmentTemplate(body, {
        ad: firstName(customer.name),
        segment: customer.segment,
        kod: couponCode || "KUPON",
        indirim: discountLabel,
        link: SEGMENT_LINK,
        magaza: STORE_NAME,
      });
      return sum + smsCharInfo(message).parts;
    }, 0);
  }, [body, recipients, couponCode, discountLabel]);

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const found = segmentCampaignTemplates.find((template) => template.id === id);
    if (found) setBody(found.body);
  };

  const handleSend = () => {
    const result = sendSegmentCampaign({
      customers,
      segment,
      template: body,
      code: couponCode,
      discountLabel,
      link: SEGMENT_LINK,
      storeName: STORE_NAME,
      settings,
    });

    if (result.logs.length > 0) onLogs([...result.logs, ...logs]);
    if (result.ok && result.balance !== settings.balance) onSettings({ balance: result.balance });

    setFeedback({
      tone: result.ok ? "success" : "danger",
      text: result.ok ? `${result.message} Tahmini maliyet ${formatPrice(result.cost)}.` : result.message,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        {feedback && (
          <Banner tone={feedback.tone} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Banner>
        )}

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Kpi icon="ri-team-line" label="Segment" value={formatNumberTr(matched.length)} hint="Seçili segmentteki müşteri" tone="info" />
          <Kpi icon="ri-checkbox-circle-line" label="Gönderilebilir" value={formatNumberTr(recipients.length)} hint={`${skipped} kişi izin/numara nedeniyle atlanır`} tone="success" />
          <Kpi icon="ri-coin-line" label="Tahmini Kontör" value={String(estimatedCredits)} hint={`≈ ${formatPrice(estimatedCredits * SMS_UNIT_PRICE)}`} tone="warning" />
          <Kpi icon="ri-wallet-3-line" label="Kontör Bakiyesi" value={String(settings.balance)} hint={settings.enabled ? "NetGSM aktif" : "Entegrasyon kapalı"} tone="neutral" />
        </div>

        <Panel
          title="Segment Kampanya SMS'i"
          subtitle="Müşteri segmentini seçin, kupon tanımlayın ve NetGSM ile gönderin"
          icon="ri-user-star-line"
        >
          <div className="space-y-4">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-foreground-700">Hedef segment</span>
              <div className="flex flex-wrap gap-1.5">
                {segmentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSegment(option.id)}
                    className={`h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                      segment === option.id
                        ? "bg-primary-800 text-background-50"
                        : "bg-background-100 text-foreground-600 hover:bg-background-200"
                    }`}
                  >
                    {option.label}
                    <span className="ml-1 opacity-70">{counts[option.id] ?? 0}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-foreground-500">
                {segmentOptions.find((option) => option.id === segment)?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Hazır şablon">
                <select value={templateId} onChange={(event) => applyTemplate(event.target.value)} className={inputClass}>
                  {segmentCampaignTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Kampanya kuponu" hint="Kupon kodu mesaja {kod} olarak eklenir">
                <select value={couponId} onChange={(event) => setCouponId(event.target.value)} className={inputClass}>
                  <option value="">Kupon ekleme ({discountLabel})</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.code} · {couponHintLabel(campaign)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="SMS metni" hint="Değişkenler: {ad} {segment} {kod} {indirim} {link} {magaza}">
              <textarea
                rows={4}
                value={body}
                onChange={(event) => setBody(event.target.value.slice(0, 640))}
                placeholder="Sayin {ad}, ..."
                className={textareaClass}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-foreground-600">
              <span className="rounded-md bg-background-100 px-2 py-1">{info.chars} karakter</span>
              <span className="rounded-md bg-background-100 px-2 py-1">{info.parts} SMS / kişi</span>
              <span className="rounded-md bg-background-100 px-2 py-1">{recipients.length} alıcı</span>
              <span className="rounded-md bg-accent-100 px-2 py-1 font-semibold text-accent-900">
                ≈ {formatPrice(estimatedCredits * SMS_UNIT_PRICE)}
              </span>
              {!settings.enabled && (
                <span className="rounded-md bg-secondary-100 px-2 py-1 font-semibold text-secondary-950">
                  Entegrasyon kapalı · kuyruğa alınır
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleSend}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-send-plane-line" />
                Segment Kampanyasını Gönder
              </button>
              <p className="text-[11px] text-foreground-500">
                Yalnızca SMS izni (İYS) olan müşterilere gönderilir. {settings.header} başlığı kullanılır.
              </p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Alıcı Listesi"
          subtitle={`${recipients.length} gönderilebilir · ${skipped} atlanan`}
          icon="ri-list-check-2"
          padded={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-2.5 font-semibold">Müşteri</th>
                  <th className="px-3 py-2.5 font-semibold">Telefon</th>
                  <th className="px-3 py-2.5 font-semibold">Segment</th>
                  <th className="px-3 py-2.5 font-semibold">SMS İzni</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Durum</th>
                </tr>
              </thead>
              <tbody>
                {matched.slice(0, 10).map((customer) => {
                  const allowed = recipients.some((item) => item.id === customer.id);
                  return (
                    <tr key={customer.id} className="border-b border-background-100 last:border-0">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-foreground-950">{customer.name}</p>
                        <p className="text-[11px] text-foreground-500">{customer.email}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-xs text-foreground-600">{customer.phone}</td>
                      <td className="px-3 py-2.5">
                        <Pill tone={segmentTone(customer.segment)}>{customer.segment}</Pill>
                      </td>
                      <td className="px-3 py-2.5">
                        <Pill tone={customer.smsOptIn ? "success" : "neutral"}>
                          {customer.smsOptIn ? "İzinli" : "İzinsiz"}
                        </Pill>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[11px] font-semibold">
                        {allowed ? (
                          <span className="text-accent-800">Gönderilecek</span>
                        ) : (
                          <span className="text-foreground-500">Atlanacak</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {matched.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-foreground-500">
                      Bu segmentte müşteri bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {matched.length > 10 && (
            <p className="border-t border-background-200 px-4 py-2 text-[11px] text-foreground-500">
              + {matched.length - 10} müşteri daha listede
            </p>
          )}
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Mesaj Önizleme" subtitle={`${sample?.name ?? "Örnek müşteri"} için`} icon="ri-smartphone-line">
          <div className="rounded-2xl border border-background-300 bg-background-100 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-foreground-500">
              <i className="ri-message-2-line" />
              {settings.senderName} · şimdi
            </div>
            <div className="rounded-xl rounded-tl-sm bg-background-50 p-3 text-xs leading-relaxed text-foreground-800 shadow-sm">
              {previewBody}
            </div>
          </div>
          {selectedCampaign && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-primary-200 bg-primary-50 px-2.5 py-2 text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-primary-900">
                <i className="ri-coupon-3-line" />
                {selectedCampaign.code}
              </span>
              <span className="text-primary-800">{couponHintLabel(selectedCampaign)}</span>
            </div>
          )}
        </Panel>

        <Panel title="Segment Kuralları" subtitle="Kampanya öncesi kontrol listesi" icon="ri-shield-check-line">
          <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-accent-700" />
              SMS izni olmayan müşteriler otomatik olarak listeden çıkarılır.
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-accent-700" />
              Her mesaj için kontör, karakter sayısına göre hesaplanır.
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-accent-700" />
              Kupon kodu müşteriye özel değişken olarak eklenir.
            </li>
            <li className="flex items-start gap-2">
              <i className="ri-check-line mt-0.5 text-accent-700" />
              Gönderimler NetGSM → Raporlar sekmesine kayıt olarak düşer.
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}