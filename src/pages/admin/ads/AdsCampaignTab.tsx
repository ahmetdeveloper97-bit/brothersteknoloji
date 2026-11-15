import { useEffect, useMemo, useRef, useState } from "react";
import { Banner, Kpi, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import {
  buildCampaignReportRows,
  campaignDateLabel,
  campaignStatusLabel,
  campaignStatusTone,
  cpaOf,
  ctrOf,
  formatCompact,
  formatMoney,
  formatNumber,
  platformLabel,
  platformShort,
  roasOf,
  totalsOf,
} from "@/lib/ads";
import { csvStamp, downloadCsv } from "@/lib/csv";
import { logActivity } from "@/lib/activity";
import type { AdCampaign, AdCampaignStatus, AdPlatform } from "@/types/ads";

type StatusFilter = "all" | AdCampaignStatus;

interface AdsCampaignTabProps {
  platform: AdPlatform;
  campaigns: AdCampaign[];
  linked: boolean;
  accountName: string;
  onToggleStatus: (id: string) => void;
  onBudgetChange: (id: string, budget: number) => void;
  onDelete: (campaign: AdCampaign) => void;
  onBulkDelete: (campaigns: AdCampaign[]) => void;
  onBulkStatus: (campaigns: AdCampaign[], status: AdCampaignStatus) => void;
  onOpenSettings: () => void;
  onCreate: () => void;
}

const platformIcon: Record<AdPlatform, string> = {
  google: "ri-google-fill",
  meta: "ri-meta-fill",
};

const platformNote: Record<AdPlatform, string> = {
  google: "Arama, Alışveriş, Performans Max ve remarketing kampanyaları tek listede.",
  meta: "Facebook ve Instagram kampanyaları, katalog ve Advantage+ dahil tek listede.",
};

export default function AdsCampaignTab({
  platform,
  campaigns,
  linked,
  accountName,
  onToggleStatus,
  onBudgetChange,
  onDelete,
  onBulkDelete,
  onBulkStatus,
  onOpenSettings,
  onCreate,
}: AdsCampaignTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [exported, setExported] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);
  const bulkMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bulkMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (bulkMenuRef.current && !bulkMenuRef.current.contains(event.target as Node)) {
        setBulkMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [bulkMenuOpen]);

  const platformCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.platform === platform),
    [campaigns, platform],
  );
  const totals = totalsOf(platformCampaigns);
  const activeCount = platformCampaigns.filter((campaign) => campaign.status === "active").length;

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("tr");
    return platformCampaigns.filter((campaign) => {
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      const matchesQuery =
        !needle ||
        campaign.name.toLocaleLowerCase("tr").includes(needle) ||
        campaign.channel.toLocaleLowerCase("tr").includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [platformCampaigns, statusFilter, query]);

  const selectedCampaigns = useMemo(
    () => platformCampaigns.filter((campaign) => selectedIds.includes(campaign.id)),
    [platformCampaigns, selectedIds],
  );
  const selectedCount = selectedCampaigns.length;
  const allSelected = filtered.length > 0 && filtered.every((campaign) => selectedIds.includes(campaign.id));
  const someSelected = filtered.some((campaign) => selectedIds.includes(campaign.id));
  const bulkSpend = selectedCampaigns.reduce((sum, campaign) => sum + campaign.spend, 0);
  const pausableCount = selectedCampaigns.filter((campaign) => campaign.status === "active").length;
  const activatableCount = selectedCampaigns.filter(
    (campaign) => campaign.status === "paused" || campaign.status === "draft",
  ).length;

  const runBulkStatus = (status: "active" | "paused") => {
    const targets =
      status === "paused"
        ? selectedCampaigns.filter((campaign) => campaign.status === "active")
        : selectedCampaigns.filter((campaign) => campaign.status === "paused" || campaign.status === "draft");
    if (!targets.length) return;
    onBulkStatus(targets, status);
    setBulkMenuOpen(false);
    setSelectedIds([]);
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      const visibleIds = filtered.map((campaign) => campaign.id);
      setSelectedIds((current) => current.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds((current) => {
      const merged = [...current];
      filtered.forEach((campaign) => {
        if (!merged.includes(campaign.id)) merged.push(campaign.id);
      });
      return merged;
    });
  };

  const exportReport = () => {
    if (!filtered.length) return;
    downloadCsv(`reklam-raporu-${platform}-${csvStamp()}.csv`, buildCampaignReportRows(filtered));
    setExported(true);
    window.setTimeout(() => setExported(false), 2600);
    logActivity({
      category: "ads",
      action: "Reklam raporunu CSV olarak indirdi",
      target: `${platformLabel[platform]} · ${filtered.length} kampanya`,
      detail: "Kampanya bazında harcama, dönüşüm ve ROAS raporu",
    });
  };

  const statusFilters: Array<{ key: StatusFilter; label: string }> = [
    { key: "all", label: "Tümü" },
    { key: "active", label: "Aktif" },
    { key: "paused", label: "Duraklatıldı" },
    { key: "ended", label: "Sona Erdi" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-background-200 bg-background-50 px-4 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
          <i className={`${platformIcon[platform]} text-lg`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-foreground-950">
            {platformLabel[platform]}
            <Pill tone={linked ? "success" : "danger"}>{linked ? "Bağlı" : "Bağlantı eksik"}</Pill>
          </p>
          <p className="mt-0.5 truncate text-[11px] text-foreground-500">
            {accountName} · {platformNote[platform]}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden text-[11px] text-foreground-600 sm:block">
            <strong className="text-foreground-950">{activeCount}</strong> aktif kampanya
          </span>
          <button
            type="button"
            onClick={exportReport}
            disabled={!filtered.length}
            className={`flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-[11px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              exported
                ? "border-accent-400 bg-accent-50 text-accent-900"
                : "border-background-300 text-foreground-700 hover:bg-background-100"
            }`}
          >
            <i className={exported ? "ri-checkbox-circle-line" : "ri-download-2-line"} />
            {exported ? "CSV indirildi" : "CSV indir"}
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-add-line" />
            Yeni kampanya
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Hesap ayarları"
            title="Hesap ayarları"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-[11px] font-semibold text-foreground-700 hover:bg-background-100"
          >
            <i className="ri-settings-3-line" />
          </button>
        </div>
      </div>

      {!linked && (
        <Banner tone="warning">
          {platformLabel[platform]} bağlantısı doğrulanamadı. Kampanya durumlarını değiştirmeden önce hesap
          bilgilerini kontrol edin.
        </Banner>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-wallet-3-line" label="Harcama" value={formatMoney(totals.spend)} hint="Son 30 gün" tone="warning" />
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
          hint={`${formatMoney(totals.revenue)} gelir`}
          tone="neutral"
        />
      </div>

      <Panel
        title="Kampanyalar"
        subtitle="Durumu değiştirebilir, günlük bütçeyi düzenleyebilirsiniz"
        icon="ri-list-check-2"
        action={
          <div className="flex items-center gap-1.5">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Kampanya ara"
              className={`${inputClass} h-9 w-36 text-xs sm:w-44`}
            />
          </div>
        }
      >
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {statusFilters.map((item) => {
            const count =
              item.key === "all"
                ? platformCampaigns.length
                : platformCampaigns.filter((campaign) => campaign.status === item.key).length;
            const active = statusFilter === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setStatusFilter(item.key)}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  active
                    ? "bg-primary-700 text-background-50"
                    : "bg-background-100 text-foreground-600 hover:bg-background-200"
                }`}
              >
                {item.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    active ? "bg-background-50/25 text-background-50" : "bg-background-50 text-foreground-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
          <span className="ml-auto hidden text-[10px] text-foreground-400 sm:block">
            {filtered.length} kampanya · {platformShort[platform]} raporu CSV olarak indirilebilir
          </span>
          {(statusFilter !== "all" || query.trim() !== "") && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setQuery("");
              }}
              className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-background-100 px-2.5 text-[11px] font-medium text-foreground-500 hover:bg-background-200"
            >
              <i className="ri-restart-line" />
              Filtreyi sıfırla
            </button>
          )}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-background-200 bg-background-100/60 px-3 py-2">
          <button
            type="button"
            onClick={toggleSelectAll}
            disabled={filtered.length === 0}
            className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-foreground-700 transition-colors hover:text-foreground-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i
              className={`text-base text-primary-800 ${
                allSelected ? "ri-checkbox-fill" : someSelected ? "ri-checkbox-indeterminate-fill" : "ri-checkbox-blank-line"
              }`}
            />
            {allSelected ? "Seçimi kaldır" : "Tümünü seç"}
          </button>
          <span className="text-[11px] text-foreground-500">
            {selectedCount > 0
              ? `${selectedCount} kampanya seçildi · ${formatMoney(bulkSpend)} harcama`
              : "Toplu işlem için kampanya seçin"}
          </span>
          {selectedCount > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-medium text-foreground-600 hover:bg-background-200"
              >
                <i className="ri-close-line" />
                Seçimi temizle
              </button>
              <div ref={bulkMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setBulkMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={bulkMenuOpen}
                  className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-primary-800 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
                >
                  <i className="ri-stack-line" />
                  Toplu işlem
                  <i className={`text-xs ${bulkMenuOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}`} />
                </button>
                {bulkMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-30 mt-1.5 w-64 overflow-hidden rounded-xl border border-background-200 bg-background-50 p-1 shadow-xl"
                  >
                    <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">
                      {selectedCount} kampanya seçili
                    </p>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={pausableCount === 0}
                      onClick={() => runBulkStatus("paused")}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold text-foreground-800 hover:bg-background-100 disabled:cursor-not-allowed disabled:text-foreground-400 disabled:hover:bg-transparent"
                    >
                      <i className="ri-pause-circle-line text-sm text-primary-800 disabled:text-foreground-300" />
                      Seçilenleri duraklat
                      <span className="ml-auto rounded-full bg-background-100 px-1.5 text-[10px] font-bold text-foreground-500">
                        {pausableCount}
                      </span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={activatableCount === 0}
                      onClick={() => runBulkStatus("active")}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold text-foreground-800 hover:bg-background-100 disabled:cursor-not-allowed disabled:text-foreground-400 disabled:hover:bg-transparent"
                    >
                      <i className="ri-play-circle-line text-sm text-accent-700" />
                      Seçilenleri yayına al
                      <span className="ml-auto rounded-full bg-background-100 px-1.5 text-[10px] font-bold text-foreground-500">
                        {activatableCount}
                      </span>
                    </button>
                    <div className="my-1 h-px bg-background-200" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setBulkMenuOpen(false);
                        onBulkDelete(selectedCampaigns);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold text-foreground-800 hover:bg-background-100"
                    >
                      <i className="ri-delete-bin-6-line text-sm text-foreground-600" />
                      Seçilenleri sil
                      <span className="ml-auto rounded-full bg-background-100 px-1.5 text-[10px] font-bold text-foreground-500">
                        {selectedCount}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {filtered.map((campaign) => (
            <div
              key={campaign.id}
              className={`rounded-xl border p-3 transition-colors ${
                selectedIds.includes(campaign.id)
                  ? "border-primary-300 bg-primary-50/60"
                  : "border-background-200 bg-background-100/50 hover:border-background-300"
              }`}
            >
              <div className="flex flex-wrap items-start gap-2">
                <button
                  type="button"
                  onClick={() => toggleSelected(campaign.id)}
                  aria-label={`${campaign.name} kampanyasını seç`}
                  aria-pressed={selectedIds.includes(campaign.id)}
                  title="Seç"
                  className="mt-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-base text-primary-800 hover:bg-background-200"
                >
                  <i className={selectedIds.includes(campaign.id) ? "ri-checkbox-fill" : "ri-checkbox-blank-line"} />
                </button>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-50 text-primary-800">
                  <i className={`${platformIcon[campaign.platform]} text-sm`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground-950">{campaign.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-foreground-500">
                    <span className="rounded-full bg-background-50 px-1.5 py-0.5 font-medium text-foreground-700">
                      {campaign.channel}
                    </span>
                    <span>{campaign.objective}</span>
                    <span>·</span>
                    <span>{campaignDateLabel(campaign.startDate)} tarihinden beri</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={campaignStatusTone[campaign.status]}>{campaignStatusLabel[campaign.status]}</Pill>
                  <button
                    type="button"
                    onClick={() => onToggleStatus(campaign.id)}
                    aria-label={campaign.status === "active" ? "Kampanyayı duraklat" : "Kampanyayı yayına al"}
                    title={campaign.status === "active" ? "Duraklat" : "Yayına al"}
                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-xs transition-colors ${
                      campaign.status === "active"
                        ? "border-background-300 text-foreground-600 hover:bg-background-200"
                        : "border-accent-300 bg-accent-50 text-accent-800 hover:bg-accent-100"
                    }`}
                  >
                    <i className={campaign.status === "active" ? "ri-pause-line" : "ri-play-line"} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(campaign)}
                    aria-label={`${campaign.name} kampanyasını sil`}
                    title="Kampanyayı sil"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-foreground-300 text-xs text-foreground-700 transition-colors hover:bg-foreground-100"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                <div className="rounded-lg bg-background-50 px-2.5 py-1.5">
                  <p className="text-[9px] uppercase tracking-wide text-foreground-400">Günlük bütçe</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      step={10}
                      value={campaign.dailyBudget}
                      onChange={(event) => onBudgetChange(campaign.id, Math.max(0, Number(event.target.value) || 0))}
                      className="w-16 rounded border border-background-300 bg-background-50 px-1 py-0.5 text-[11px] font-semibold text-foreground-900 outline-none focus:border-primary-500"
                    />
                    <span className="text-[10px] text-foreground-500">₺</span>
                  </div>
                </div>
                <div className="rounded-lg bg-background-50 px-2.5 py-1.5">
                  <p className="text-[9px] uppercase tracking-wide text-foreground-400">Harcama</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-foreground-900">{formatMoney(campaign.spend)}</p>
                </div>
                <div className="rounded-lg bg-background-50 px-2.5 py-1.5">
                  <p className="text-[9px] uppercase tracking-wide text-foreground-400">Gösterim</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-foreground-900">{formatCompact(campaign.impressions)}</p>
                </div>
                <div className="rounded-lg bg-background-50 px-2.5 py-1.5">
                  <p className="text-[9px] uppercase tracking-wide text-foreground-400">Tıklama / CTR</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-foreground-900">
                    {formatCompact(campaign.clicks)} · %{ctrOf(campaign.clicks, campaign.impressions).toFixed(1)}
                  </p>
                </div>
                <div className="rounded-lg bg-background-50 px-2.5 py-1.5">
                  <p className="text-[9px] uppercase tracking-wide text-foreground-400">Dönüşüm</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-foreground-900">
                    {campaign.conversions} · {formatMoney(cpaOf(campaign.spend, campaign.conversions))}
                  </p>
                </div>
                <div className="rounded-lg bg-background-50 px-2.5 py-1.5">
                  <p className="text-[9px] uppercase tracking-wide text-foreground-400">Gelir / ROAS</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-foreground-900">
                    {formatMoney(campaign.revenue)} · {roasOf(campaign.revenue, campaign.spend).toFixed(1)}x
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center">
            <i className="ri-file-search-line mb-2 block text-3xl text-foreground-300" />
            <p className="text-sm font-medium text-foreground-700">Bu filtreye uygun kampanya yok</p>
            <p className="mt-1 text-xs text-foreground-500">Arama kelimesini değiştirin veya yeni bir kampanya oluşturun.</p>
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
      </Panel>
    </div>
  );
}