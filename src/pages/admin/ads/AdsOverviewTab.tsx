import { Banner, Kpi, Panel, Pill } from "@/components/base/AdminUI";
import {
  budgetStatusOf,
  buildCampaignReportRows,
  cpaOf,
  ctrOf,
  formatCompact,
  formatMoney,
  formatNumber,
  loadSpendSeries,
  platformLabel,
  roasOf,
  totalsOf,
} from "@/lib/ads";
import { csvStamp, downloadCsv } from "@/lib/csv";
import { logActivity } from "@/lib/activity";
import type { AdBudgetSettings, AdCampaign, AdPlatform } from "@/types/ads";

interface AdsOverviewTabProps {
  campaigns: AdCampaign[];
  googleLinked: boolean;
  metaLinked: boolean;
  budget: AdBudgetSettings;
  onOpenPlatform: (platform: AdPlatform) => void;
  onOpenSettings: () => void;
  onCreate: () => void;
  onDelete: (campaign: AdCampaign) => void;
}

const platformIcon: Record<AdPlatform, string> = {
  google: "ri-google-fill",
  meta: "ri-meta-fill",
};

export default function AdsOverviewTab({
  campaigns,
  googleLinked,
  metaLinked,
  budget,
  onOpenPlatform,
  onOpenSettings,
  onCreate,
  onDelete,
}: AdsOverviewTabProps) {
  const series = loadSpendSeries();
  const totals = totalsOf(campaigns);
  const budgetStatus = budgetStatusOf(campaigns, budget);
  const maxDay = Math.max(...series.map((point) => point.google + point.meta), 1);
  const seriesTotal = series.reduce((sum, point) => sum + point.google + point.meta, 0);
  const seriesAverage = series.length > 0 ? seriesTotal / series.length : 0;
  const googleTotals = totalsOf(campaigns.filter((campaign) => campaign.platform === "google"));
  const metaTotals = totalsOf(campaigns.filter((campaign) => campaign.platform === "meta"));
  const googleShare = totals.spend > 0 ? (googleTotals.spend / totals.spend) * 100 : 0;
  const topCampaigns = [...campaigns].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const missing = [!googleLinked ? "Google Ads" : "", !metaLinked ? "Meta Ads" : ""].filter(Boolean);

  const exportAll = () => {
    if (!campaigns.length) return;
    downloadCsv(`reklam-raporu-tum-kampanyalar-${csvStamp()}.csv`, buildCampaignReportRows(campaigns));
    logActivity({
      category: "ads",
      action: "Tüm reklam raporunu CSV olarak indirdi",
      target: `${campaigns.length} kampanya`,
      detail: "Google ve Meta kampanyalarının birleşik raporu",
    });
  };

  return (
    <div className="space-y-4">
      {missing.length > 0 && (
        <Banner tone="warning">
          <span className="flex flex-wrap items-center gap-2">
            <span>
              <strong>{missing.join(" ve ")}</strong> bağlantısı tamamlanmadı. Eksik bilgiler nedeniyle bu platformun
              harcama ve dönüşüm verileri sağlıklı görüntülenemiyor.
            </span>
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-secondary-200 px-3 text-[11px] font-bold text-secondary-950 hover:bg-secondary-300"
            >
              <i className="ri-link-m" />
              Ayarlara git
            </button>
          </span>
        </Banner>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          icon="ri-money-dollar-circle-line"
          label="Toplam Reklam Harcaması"
          value={formatMoney(totals.spend)}
          hint="Son 30 gün · iki platform"
          tone="warning"
        />
        <Kpi
          icon="ri-cursor-line"
          label="Tıklama"
          value={formatCompact(totals.clicks)}
          hint={`CTR %${ctrOf(totals.clicks, totals.impressions).toFixed(2)}`}
          tone="info"
        />
        <Kpi
          icon="ri-shopping-bag-3-line"
          label="Dönüşüm"
          value={formatNumber(totals.conversions)}
          hint={`Dönüşüm başı ${formatMoney(cpaOf(totals.spend, totals.conversions))}`}
          tone="success"
        />
        <Kpi
          icon="ri-line-chart-line"
          label="ROAS"
          value={`${roasOf(totals.revenue, totals.spend).toFixed(2)}x`}
          hint={`${formatMoney(totals.revenue)} reklam geliri`}
          tone="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          title="Günlük Harcama"
          subtitle="Son 14 gün · Google ve Meta dağılımı"
          icon="ri-bar-chart-2-line"
          className="xl:col-span-2"
          action={
            <div className="flex items-center gap-3 text-[11px] text-foreground-600">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary-700" />
                Google
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent-500" />
                Meta
              </span>
            </div>
          }
        >
          {series.length === 0 && (
            <div className="flex h-52 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-background-300 bg-background-100/60 text-center">
              <i className="ri-bar-chart-2-line text-2xl text-foreground-400" />
              <p className="text-sm font-medium text-foreground-700">Harcama verisi yok</p>
              <p className="max-w-xs text-xs text-foreground-500">
                Platformlar bağlandığında günlük harcama dağılımı burada görünecek.
              </p>
            </div>
          )}
          <div className={`flex h-52 items-end gap-1.5 ${series.length === 0 ? "hidden" : ""}`}>
            {series.map((point) => {
              const total = point.google + point.meta;
              const height = Math.max((total / maxDay) * 100, 4);
              const googleHeight = total > 0 ? (point.google / total) * 100 : 50;
              return (
                <div key={point.label} className="group flex min-w-0 flex-1 flex-col items-center gap-1">
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="flex w-full flex-col overflow-hidden rounded-t-md transition-all"
                      style={{ height: `${height}%` }}
                      title={`${point.label} · ${formatMoney(total)}`}
                    >
                      <div style={{ height: `${100 - googleHeight}%` }} className="bg-accent-500" />
                      <div style={{ height: `${googleHeight}%` }} className="bg-primary-700" />
                    </div>
                  </div>
                  <span className="hidden whitespace-nowrap text-[9px] text-foreground-500 sm:block">{point.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
            <p className="text-[11px] text-foreground-600">
              14 günlük toplam harcama
              <span className="ml-1.5 font-heading text-sm font-bold text-foreground-950">
                {formatMoney(seriesTotal)}
              </span>
            </p>
            <p className="text-[11px] text-foreground-600">
              Günlük ortalama
              <span className="ml-1.5 font-semibold text-foreground-900">
                {formatMoney(seriesAverage)}
              </span>
            </p>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Harcama Payı" icon="ri-pie-chart-line">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-background-200">
              <div className="bg-primary-700" style={{ width: `${googleShare}%` }} />
              <div className="bg-accent-500" style={{ width: `${100 - googleShare}%` }} />
            </div>
            <div className="mt-3 space-y-2.5">
              {[
                { platform: "google" as AdPlatform, totals: googleTotals, linked: googleLinked },
                { platform: "meta" as AdPlatform, totals: metaTotals, linked: metaLinked },
              ].map((entry) => (
                <div key={entry.platform} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-background-100 text-primary-800">
                    <i className={`${platformIcon[entry.platform]} text-sm`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground-900">{platformLabel[entry.platform]}</p>
                    <p className="text-[10px] text-foreground-500">
                      {formatMoney(entry.totals.spend)} · ROAS {roasOf(entry.totals.revenue, entry.totals.spend).toFixed(2)}x
                    </p>
                  </div>
                  <Pill tone={entry.linked ? "success" : "danger"}>{entry.linked ? "Bağlı" : "Kesik"}</Pill>
                </div>
              ))}
            </div>

            <div className="mt-3 border-t border-background-200 pt-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-foreground-700">Aylık bütçe kullanımı</p>
                <Pill tone={budgetStatus.state === "over" ? "danger" : budgetStatus.state === "near" ? "warning" : "success"}>
                  %{Math.round(budgetStatus.ratio)}
                </Pill>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-background-200">
                <div
                  className={`h-full rounded-full ${
                    budgetStatus.state === "over"
                      ? "bg-foreground-700"
                      : budgetStatus.state === "near"
                        ? "bg-secondary-500"
                        : "bg-accent-500"
                  }`}
                  style={{ width: `${Math.min(budgetStatus.ratio, 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-foreground-500">
                {formatMoney(budgetStatus.spend)} / {formatMoney(budgetStatus.limit)} ·{" "}
                {budgetStatus.remaining >= 0
                  ? `${formatMoney(budgetStatus.remaining)} kaldı`
                  : `${formatMoney(Math.abs(budgetStatus.remaining))} aşım`}
              </p>
              <button
                type="button"
                onClick={onOpenSettings}
                className="mt-2 flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 text-[11px] font-semibold text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-settings-3-line" />
                Bütçe limitini düzenle
              </button>
            </div>
          </Panel>

          <Panel title="Hızlı Geçiş" icon="ri-flashlight-line">
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={onCreate}
                className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Yeni kampanya oluştur
                <i className="ri-arrow-right-s-line ml-auto" />
              </button>
              <button
                type="button"
                onClick={exportAll}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-file-excel-2-line text-primary-700" />
                Tüm raporu CSV indir
                <i className="ri-download-2-line ml-auto" />
              </button>
              <button
                type="button"
                onClick={() => onOpenPlatform("google")}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-google-line text-primary-700" />
                Google kampanyalarını yönet
                <i className="ri-arrow-right-s-line ml-auto" />
              </button>
              <button
                type="button"
                onClick={() => onOpenPlatform("meta")}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-meta-line text-primary-700" />
                Meta kampanyalarını yönet
                <i className="ri-arrow-right-s-line ml-auto" />
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-key-2-line text-primary-700" />
                API bağlantılarını düzenle
                <i className="ri-arrow-right-s-line ml-auto" />
              </button>
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        title="En Çok Gelir Getiren Kampanyalar"
        subtitle="Son 30 gün · reklam gelirine göre sıralı"
        icon="ri-trophy-line"
        action={
          topCampaigns.length > 0 ? (
            <span className="text-[11px] text-foreground-500">{topCampaigns.length} kampanya</span>
          ) : undefined
        }
      >
        <div className="space-y-2">
          {topCampaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-background-200 bg-background-100/60 px-3 py-2.5"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background-50 text-[10px] font-bold text-foreground-600">
                {index + 1}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-background-50 text-primary-800">
                <i className={`${platformIcon[campaign.platform]} text-sm`} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground-950">{campaign.name}</p>
                <p className="text-[10px] text-foreground-500">
                  {platformLabel[campaign.platform]} · {campaign.channel}
                </p>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="hidden sm:block">
                  <p className="text-[10px] text-foreground-500">Harcama</p>
                  <p className="text-xs font-semibold text-foreground-900">{formatMoney(campaign.spend)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-foreground-500">Gelir</p>
                  <p className="text-xs font-semibold text-foreground-950">{formatMoney(campaign.revenue)}</p>
                </div>
                <Pill tone={roasOf(campaign.revenue, campaign.spend) >= 5 ? "success" : "warning"}>
                  {roasOf(campaign.revenue, campaign.spend).toFixed(1)}x
                </Pill>
              </div>
              <button
                type="button"
                onClick={() => onDelete(campaign)}
                aria-label={`${campaign.name} kampanyasını sil`}
                title="Kampanyayı sil"
                className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-foreground-300 text-[11px] text-foreground-700 transition-colors hover:bg-foreground-100"
              >
                <i className="ri-delete-bin-6-line" />
              </button>
            </div>
          ))}

          {topCampaigns.length === 0 && (
            <div className="py-8 text-center">
              <i className="ri-trophy-line mb-2 block text-3xl text-foreground-300" />
              <p className="text-sm font-medium text-foreground-700">Henüz kampanya verisi yok</p>
              <p className="mt-1 text-xs text-foreground-500">
                Yeni bir kampanya oluşturduğunuzda gelir sıralaması burada görünecek.
              </p>
              <button
                type="button"
                onClick={onCreate}
                className="mt-3 inline-flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                Yeni kampanya
              </button>
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}