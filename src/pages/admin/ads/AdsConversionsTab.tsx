import { useState } from "react";
import { Banner, Kpi, Panel, Pill, Toggle } from "@/components/base/AdminUI";
import { copyToClipboard, formatNumber, maskToken } from "@/lib/ads";
import type { AdsSettings, ConversionEvent } from "@/types/ads";

interface AdsConversionsTabProps {
  settings: AdsSettings;
  events: ConversionEvent[];
  onToggleEvent: (id: string, field: "google" | "meta" | "active") => void;
  onDeleteEvent: (event: ConversionEvent) => void;
  onOpenSettings: () => void;
}

export default function AdsConversionsTab({ settings, events, onToggleEvent, onDeleteEvent, onOpenSettings }: AdsConversionsTabProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    const ok = await copyToClipboard(value);
    setCopied(ok ? key : null);
    window.setTimeout(() => setCopied(null), 2000);
  };

  const activeEvents = events.filter((event) => event.active);
  const googleEvents = activeEvents.filter((event) => event.google);
  const metaEvents = activeEvents.filter((event) => event.meta);
  const totalCount = activeEvents.reduce((sum, event) => sum + event.count, 0);
  const googleTag = `AW-${settings.google.conversionId.replace(/^AW-/, "")}/${settings.google.conversionLabel}`;
  const googleSnippet = `gtag('event', 'conversion', {\n  'send_to': '${googleTag}',\n  'value': {{ siparis_tutari }},\n  'currency': 'TRY',\n  'transaction_id': '{{ siparis_no }}'\n});`;

  const copyButton = (key: string, value: string, label: string) => (
    <button
      type="button"
      onClick={() => copy(key, value)}
      className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-background-300 px-2.5 text-[10px] font-semibold text-foreground-700 hover:bg-background-100"
    >
      <i className={copied === key ? "ri-check-line text-accent-700" : "ri-file-copy-line"} />
      {copied === key ? "Kopyalandı" : label}
    </button>
  );

  return (
    <div className="space-y-4">
      <Banner tone="info">
        Dönüşüm izleme, reklam platformlarına hangi olayların "satış" olarak sayılacağını söyler. Kapalı olan olaylar
        raporlamada görünmez; açmadan önce ölçüm aracının sahada doğru çalıştığından emin olun.
      </Banner>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-focus-3-line" label="Takip Edilen Olay" value={`${activeEvents.length} / ${events.length}`} hint="Aktif olay sayısı" tone="info" />
        <Kpi icon="ri-google-line" label="Google Dönüşümü" value={String(googleEvents.length)} hint="Google Ads etiketine gönderiliyor" tone="warning" />
        <Kpi icon="ri-meta-line" label="Meta Dönüşümü" value={String(metaEvents.length)} hint="Pixel + Conversions API" tone="success" />
        <Kpi icon="ri-bar-chart-box-line" label="7 Günlük Olay" value={formatNumber(totalCount)} hint="Tüm aktif olayların toplamı" tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Google Ads Dönüşüm Etiketi" subtitle="Satın alma dönüşümü için kullanılan etiket" icon="ri-google-line">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Dönüşüm kimliği</p>
                <p className="truncate font-mono text-xs font-semibold text-foreground-950">{settings.google.conversionId}</p>
              </div>
              {copyButton("gid", settings.google.conversionId, "Kopyala")}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Dönüşüm etiketi</p>
                <p className="truncate font-mono text-xs font-semibold text-foreground-950">{settings.google.conversionLabel}</p>
              </div>
              {copyButton("glabel", settings.google.conversionLabel, "Kopyala")}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-500">Örnek olay kodu</p>
                {copyButton("gsnippet", googleSnippet, "Kodu kopyala")}
              </div>
              <pre className="max-h-40 overflow-auto rounded-lg bg-foreground-950 p-3 font-mono text-[10px] leading-relaxed text-background-100">
                {googleSnippet}
              </pre>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-background-200 px-3 py-2">
              <div>
                <p className="text-xs font-semibold text-foreground-900">Gelişmiş dönüşümler</p>
                <p className="text-[10px] text-foreground-500">E-posta ve telefon eşleşmesi ile ölçüm doğruluğu artar.</p>
              </div>
              <Pill tone={settings.google.enhancedConversions ? "success" : "neutral"}>
                {settings.google.enhancedConversions ? "Açık" : "Kapalı"}
              </Pill>
            </div>
          </div>
        </Panel>

        <Panel title="Meta Pixel & Conversions API" subtitle="Sunucu taraflı olay gönderimi" icon="ri-meta-line">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Pixel kimliği</p>
                <p className="truncate font-mono text-xs font-semibold text-foreground-950">{settings.meta.pixelId}</p>
              </div>
              {copyButton("pixel", settings.meta.pixelId, "Kopyala")}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Conversions API belirteci</p>
                <p className="truncate font-mono text-xs font-semibold text-foreground-950">
                  {maskToken(settings.meta.conversionApiToken)}
                </p>
              </div>
              <Pill tone={settings.meta.conversionApiToken.trim() ? "success" : "danger"}>
                {settings.meta.conversionApiToken.trim() ? "Tanımlı" : "Eksik"}
              </Pill>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Test olay kodu</p>
                <p className="truncate font-mono text-xs font-semibold text-foreground-950">
                  {settings.meta.testEventCode || "Tanımsız"}
                </p>
              </div>
              {copyButton("testcode", settings.meta.testEventCode, "Kopyala")}
            </div>
            <div className="space-y-2.5 rounded-lg border border-background-200 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground-900">Otomatik gelişmiş eşleştirme</p>
                <Pill tone={settings.meta.automaticAdvancedMatching ? "success" : "neutral"}>
                  {settings.meta.automaticAdvancedMatching ? "Açık" : "Kapalı"}
                </Pill>
              </div>
              <p className="text-[10px] leading-relaxed text-foreground-500">
                Eşleştirme kalitesi yükseldikçe aynı bütçeyle daha fazla dönüşüm bulunur. Ayarları değiştirmek için
                bağlantı ayarları sekmesini kullanın.
              </p>
              <button
                type="button"
                onClick={onOpenSettings}
                className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-background-100 px-2.5 text-[10px] font-semibold text-foreground-700 hover:bg-background-200"
              >
                <i className="ri-settings-3-line" />
                Ayarlara git
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <Panel title="Dönüşüm Olayları" subtitle="Hangi olayın hangi platforma gönderileceğini seçin" icon="ri-list-settings-line">
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className={`rounded-xl border p-3 transition-colors ${
                event.active ? "border-background-200 bg-background-100/50" : "border-background-200 bg-background-50 opacity-80"
              }`}
            >
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-foreground-950">
                    {event.name}
                    <code className="rounded bg-background-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-foreground-600">
                      {event.eventKey}
                    </code>
                    {!event.active && <Pill tone="neutral">Pasif</Pill>}
                  </p>
                  <p className="mt-0.5 text-[10px] text-foreground-500">
                    Değer: {event.value} · Son 7 günde {formatNumber(event.count)} olay
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-28">
                    <Toggle
                      checked={event.google}
                      onChange={() => onToggleEvent(event.id, "google")}
                      label="Google"
                    />
                  </div>
                  <div className="w-24">
                    <Toggle checked={event.meta} onChange={() => onToggleEvent(event.id, "meta")} label="Meta" />
                  </div>
                  <div className="w-24">
                    <Toggle checked={event.active} onChange={() => onToggleEvent(event.id, "active")} label="Aktif" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteEvent(event)}
                    aria-label={`${event.name} olayını sil`}
                    title="Olayı sil"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-foreground-300 text-xs text-foreground-700 transition-colors hover:bg-foreground-100"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <div className="py-8 text-center">
            <i className="ri-focus-3-line mb-2 block text-3xl text-foreground-300" />
            <p className="text-sm font-medium text-foreground-700">Takip edilen dönüşüm olayı kalmadı</p>
            <p className="mt-1 text-xs text-foreground-500">
              Silinen olaylar reklam platformlarına gönderilmez. Yeni bir olay tanımlamak için dönüşüm ayarlarını
              kullanın.
            </p>
          </div>
        )}
        <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-foreground-500">
          <i className="ri-information-line mt-0.5 text-primary-700" />
          Değişiklikler anında kaydedilir ve bu tarayıcıda hatırlanır. Canlıya geçişte olay kodlarının mağaza
          temasına eklenmesi gerekir.
        </p>
      </Panel>
    </div>
  );
}