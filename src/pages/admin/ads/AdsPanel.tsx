import { useState } from "react";
import { Banner, Tabs } from "@/components/base/AdminUI";
import ConfirmDialog from "@/components/base/ConfirmDialog";
import AdsOverviewTab from "@/pages/admin/ads/AdsOverviewTab";
import AdsCampaignTab from "@/pages/admin/ads/AdsCampaignTab";
import AdsConversionsTab from "@/pages/admin/ads/AdsConversionsTab";
import AdsSettingsTab from "@/pages/admin/ads/AdsSettingsTab";
import AdCampaignFormModal from "@/pages/admin/ads/AdCampaignFormModal";
import {
  ADS_KEYS,
  budgetStatusOf,
  buildCampaignFromInput,
  emptyGoogleAdsSettings,
  emptyMetaAdsSettings,
  formatMoney,
  isGoogleLinked,
  isMetaLinked,
  loadAdCampaigns,
  loadAdsSettings,
  loadConversionEvents,
  platformLabel,
} from "@/lib/ads";
import { logActivity } from "@/lib/activity";
import { usePersistentState } from "@/lib/persistent";
import type {
  AdBudgetSettings,
  AdCampaign,
  AdCampaignStatus,
  AdPlatform,
  AdsSettings,
  ConversionEvent,
  NewAdCampaignInput,
} from "@/types/ads";

type TabId = "overview" | "google" | "meta" | "conversions" | "settings";

type DeleteTarget =
  | { kind: "campaign"; campaign: AdCampaign }
  | { kind: "bulk"; campaigns: AdCampaign[] }
  | { kind: "event"; event: ConversionEvent }
  | { kind: "account"; platform: AdPlatform }
  | null;

interface DeletedCampaignEntry {
  campaign: AdCampaign;
  index: number;
}

interface UndoSnapshot {
  items: DeletedCampaignEntry[];
  note: string;
}

export default function AdsPanel() {
  const [tab, setTab] = useState<TabId>("overview");
  const [campaigns, setCampaigns] = usePersistentState<AdCampaign[]>(ADS_KEYS.campaigns, loadAdCampaigns());
  const [settings, setSettings] = usePersistentState<AdsSettings>(ADS_KEYS.settings, loadAdsSettings());
  const [events, setEvents] = usePersistentState<ConversionEvent[]>(ADS_KEYS.conversions, loadConversionEvents());
  const [formOpen, setFormOpen] = useState(false);
  const [formPlatform, setFormPlatform] = useState<AdPlatform>("google");
  const [budgetNotice, setBudgetNotice] = useState("");
  const [bulkNotice, setBulkNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);

  const googleLinked = isGoogleLinked(settings.google);
  const metaLinked = isMetaLinked(settings.meta);
  const budget = budgetStatusOf(campaigns, settings.budget);

  const patchGoogle = (patch: Partial<AdsSettings["google"]>) => {
    setSettings((current) => ({ ...current, google: { ...current.google, ...patch } }));
  };

  const patchMeta = (patch: Partial<AdsSettings["meta"]>) => {
    setSettings((current) => ({ ...current, meta: { ...current.meta, ...patch } }));
  };

  const patchBudget = (patch: Partial<AdBudgetSettings>) => {
    setSettings((current) => ({ ...current, budget: { ...current.budget, ...patch } }));
  };

  const openCreate = (platform: AdPlatform) => {
    setFormPlatform(platform);
    setFormOpen(true);
  };

  const createCampaign = (input: NewAdCampaignInput) => {
    const created = buildCampaignFromInput(input);
    setCampaigns((current) => [created, ...current]);
    logActivity({
      category: "ads",
      action: "Yeni reklam kampanyası oluşturdu",
      target: created.name,
      detail: `${created.platform === "google" ? "Google Ads" : "Meta Ads"} · ${created.channel} · günlük ${formatMoney(
        created.dailyBudget,
      )}`,
    });
    if (created.platform === "google") setTab("google");
    else setTab("meta");
  };

  const saveBudgetLimit = (limit: number) => {
    patchBudget({ monthlyLimit: limit });
    setBudgetNotice(`Aylık reklam bütçesi limiti ${formatMoney(limit)} olarak güncellendi.`);
    window.setTimeout(() => setBudgetNotice(""), 3200);
    logActivity({
      category: "ads",
      action: "Aylık reklam bütçesi limitini güncelledi",
      target: formatMoney(limit),
      detail: "Reklam paneli bütçe uyarı eşiği",
    });
  };

  const toggleStatus = (id: string) => {
    const target = campaigns.find((campaign) => campaign.id === id);
    if (!target) return;
    const nextStatus = target.status === "active" ? "paused" : "active";
    setCampaigns((current) =>
      current.map((campaign) => (campaign.id === id ? { ...campaign, status: nextStatus } : campaign)),
    );
    logActivity({
      category: "ads",
      action: nextStatus === "active" ? "Reklam kampanyasını yayına aldı" : "Reklam kampanyasını duraklattı",
      target: target.name,
      detail: `${target.platform === "google" ? "Google Ads" : "Meta Ads"} · ${target.channel} kanalı`,
    });
  };

  const bulkSetStatus = (targets: AdCampaign[], status: AdCampaignStatus) => {
    if (!targets.length) return;
    const ids = targets.map((campaign) => campaign.id);
    setCampaigns((current) =>
      current.map((campaign) => (ids.includes(campaign.id) ? { ...campaign, status } : campaign)),
    );
    const googleCount = targets.filter((campaign) => campaign.platform === "google").length;
    logActivity({
      category: "ads",
      action:
        status === "active"
          ? "Reklam kampanyalarını toplu yayına aldı"
          : "Reklam kampanyalarını toplu duraklattı",
      target: `${targets.length} kampanya`,
      detail: `Google ${googleCount} · Meta ${targets.length - googleCount} · durum "${
        status === "active" ? "Aktif" : "Duraklatıldı"
      }" olarak güncellendi`,
    });
    setBulkNotice(
      `${targets.length} kampanya ${status === "active" ? "yayına alındı" : "duraklatıldı"}.`,
    );
    window.setTimeout(() => setBulkNotice(""), 3200);
  };

  const updateBudget = (id: string, amount: number) => {
    setCampaigns((current) =>
      current.map((campaign) => (campaign.id === id ? { ...campaign, dailyBudget: amount } : campaign)),
    );
  };

  const toggleEvent = (id: string, field: "google" | "meta" | "active") => {
    setEvents((current) =>
      current.map((event) => (event.id === id ? { ...event, [field]: !event[field] } : event)),
    );
  };

  const removeCampaigns = (
    targets: AdCampaign[],
    note: string,
    log: { action: string; target: string; detail: string },
  ) => {
    if (!targets.length) return;
    const ids = targets.map((campaign) => campaign.id);
    const items = campaigns
      .map((campaign, index) => ({ campaign, index }))
      .filter((entry) => ids.includes(entry.campaign.id));
    if (!items.length) return;
    setCampaigns((current) => current.filter((campaign) => !ids.includes(campaign.id)));
    setUndoSnapshot({ items, note });
    logActivity({ category: "ads", action: log.action, target: log.target, detail: log.detail });
  };

  const deleteCampaign = (campaign: AdCampaign) => {
    removeCampaigns([campaign], `${campaign.name} kampanyası silindi.`, {
      action: "Reklam kampanyasını sildi",
      target: campaign.name,
      detail: `${platformLabel[campaign.platform]} · ${campaign.channel} kanalı · ${formatMoney(campaign.spend)} harcama`,
    });
  };

  const bulkDeleteCampaigns = (targets: AdCampaign[]) => {
    if (!targets.length) return;
    const spend = targets.reduce((sum, campaign) => sum + campaign.spend, 0);
    const googleCount = targets.filter((campaign) => campaign.platform === "google").length;
    removeCampaigns(targets, `${targets.length} kampanya silindi.`, {
      action: "Reklam kampanyalarını toplu sildi",
      target: `${targets.length} kampanya`,
      detail: `Google ${googleCount} · Meta ${targets.length - googleCount} · ${formatMoney(spend)} toplam harcama`,
    });
  };

  const undoLastDelete = () => {
    if (!undoSnapshot) return;
    const items = [...undoSnapshot.items].sort((a, b) => a.index - b.index);
    setCampaigns((current) => {
      const next = [...current];
      items.forEach(({ campaign, index }) => {
        if (next.some((item) => item.id === campaign.id)) return;
        next.splice(Math.min(index, next.length), 0, campaign);
      });
      return next;
    });
    logActivity({
      category: "ads",
      action: "Reklam kampanyası silme işlemini geri aldı",
      target: items.length === 1 ? items[0].campaign.name : `${items.length} kampanya`,
      detail: "Silinen kampanyalar kampanya listesine geri eklendi",
    });
    setUndoSnapshot(null);
  };

  const deleteEvent = (event: ConversionEvent) => {
    setEvents((current) => current.filter((item) => item.id !== event.id));
    logActivity({
      category: "ads",
      action: "Dönüşüm olayını sildi",
      target: event.name,
      detail: `${event.eventKey} olayı reklam platformlarına gönderilmeyecek`,
    });
  };

  const deleteAccount = (platform: AdPlatform) => {
    const accountName = platform === "google" ? settings.google.accountName : settings.meta.accountName;
    setSettings((current) => ({
      ...current,
      google: platform === "google" ? emptyGoogleAdsSettings() : current.google,
      meta: platform === "meta" ? emptyMetaAdsSettings() : current.meta,
    }));
    logActivity({
      category: "ads",
      action: "Reklam hesabını sildi",
      target: accountName || platformLabel[platform],
      detail: `${platformLabel[platform]} bağlantısı ve belirteçleri kaldırıldı`,
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "campaign") deleteCampaign(deleteTarget.campaign);
    if (deleteTarget.kind === "bulk") bulkDeleteCampaigns(deleteTarget.campaigns);
    if (deleteTarget.kind === "event") deleteEvent(deleteTarget.event);
    if (deleteTarget.kind === "account") deleteAccount(deleteTarget.platform);
    setDeleteTarget(null);
  };

  const platformTotals = (platform: AdPlatform) => campaigns.filter((campaign) => campaign.platform === platform);

  return (
    <div className="space-y-4">
      {undoSnapshot && (
        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-accent-300 bg-accent-50 px-3.5 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-900">
            <i className="ri-arrow-go-back-line" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-accent-950">Son silme işlemi geri alınabilir</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-accent-900">{undoSnapshot.note}</p>
          </div>
          <button
            type="button"
            onClick={undoLastDelete}
            className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-accent-700 px-3 text-[11px] font-semibold text-background-50 hover:bg-accent-800"
          >
            <i className="ri-arrow-go-back-line" />
            Geri al
          </button>
          <button
            type="button"
            onClick={() => setUndoSnapshot(null)}
            aria-label="Geri alma bandını kapat"
            title="Kapat"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-accent-900 hover:bg-accent-100"
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      {budget.state === "over" && (
        <div className="rounded-xl border border-foreground-400 bg-foreground-100 p-3.5">
          <div className="flex flex-wrap items-start gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground-200 text-foreground-900">
              <i className="ri-alarm-warning-line text-lg" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground-950">Aylık reklam bütçesi aşıldı</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-700">
                Bu ay <strong>{formatMoney(budget.spend)}</strong> harcandı, tanımlı limit{" "}
                <strong>{formatMoney(budget.limit)}</strong>. Limitin {formatMoney(Math.abs(budget.remaining))} üzerindesiniz —
                kampanyaları duraklatmayı veya bütçeyi güncellemeyi düşünün.
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground-200">
                <div className="h-full rounded-full bg-foreground-700" style={{ width: `${Math.min(budget.ratio, 100)}%` }} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTab("settings")}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-foreground-900 px-3 text-[11px] font-semibold text-background-50 hover:bg-foreground-800"
            >
              <i className="ri-settings-3-line" />
              Bütçe ayarları
            </button>
          </div>
        </div>
      )}

      {budget.state === "near" && (
        <Banner tone="warning">
          <span className="flex flex-wrap items-center gap-2">
            <span>
              Aylık reklam bütçesinin <strong>%{Math.round(budget.ratio)}</strong>'i kullanıldı —{" "}
              {formatMoney(budget.spend)} / {formatMoney(budget.limit)}. Kalan {formatMoney(Math.max(budget.remaining, 0))}.
            </span>
            <button
              type="button"
              onClick={() => setTab("settings")}
              className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-secondary-200 px-3 text-[11px] font-bold text-secondary-950 hover:bg-secondary-300"
            >
              <i className="ri-settings-3-line" />
              Limiti düzenle
            </button>
          </span>
        </Banner>
      )}

      {bulkNotice && (
        <Banner tone="success" onClose={() => setBulkNotice("")}>
          {bulkNotice}
        </Banner>
      )}

      {budgetNotice && (
        <Banner tone="success" onClose={() => setBudgetNotice("")}>
          {budgetNotice}
        </Banner>
      )}

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "overview", label: "Genel Bakış", icon: "ri-line-chart-line" },
          { id: "google", label: "Google Ads", icon: "ri-google-line", badge: platformTotals("google").length },
          { id: "meta", label: "Meta Ads", icon: "ri-meta-line", badge: platformTotals("meta").length },
          { id: "conversions", label: "Dönüşüm İzleme", icon: "ri-focus-3-line" },
          { id: "settings", label: "Bağlantı Ayarları", icon: "ri-link-m" },
        ]}
      />

      {tab === "overview" && (
        <AdsOverviewTab
          campaigns={campaigns}
          googleLinked={googleLinked}
          metaLinked={metaLinked}
          budget={settings.budget}
          onOpenPlatform={(platform) => setTab(platform)}
          onOpenSettings={() => setTab("settings")}
          onCreate={() => openCreate("google")}
          onDelete={(campaign) => setDeleteTarget({ kind: "campaign", campaign })}
        />
      )}

      {tab === "google" && (
        <AdsCampaignTab
          platform="google"
          campaigns={campaigns}
          linked={googleLinked}
          accountName={settings.google.accountName}
          onToggleStatus={toggleStatus}
          onBudgetChange={updateBudget}
          onDelete={(campaign) => setDeleteTarget({ kind: "campaign", campaign })}
          onBulkDelete={(targets) => setDeleteTarget({ kind: "bulk", campaigns: targets })}
          onBulkStatus={bulkSetStatus}
          onOpenSettings={() => setTab("settings")}
          onCreate={() => openCreate("google")}
        />
      )}

      {tab === "meta" && (
        <AdsCampaignTab
          platform="meta"
          campaigns={campaigns}
          linked={metaLinked}
          accountName={settings.meta.accountName}
          onToggleStatus={toggleStatus}
          onBudgetChange={updateBudget}
          onDelete={(campaign) => setDeleteTarget({ kind: "campaign", campaign })}
          onBulkDelete={(targets) => setDeleteTarget({ kind: "bulk", campaigns: targets })}
          onBulkStatus={bulkSetStatus}
          onOpenSettings={() => setTab("settings")}
          onCreate={() => openCreate("meta")}
        />
      )}

      {tab === "conversions" && (
        <AdsConversionsTab
          settings={settings}
          events={events}
          onToggleEvent={toggleEvent}
          onDeleteEvent={(event) => setDeleteTarget({ kind: "event", event })}
          onOpenSettings={() => setTab("settings")}
        />
      )}

      {tab === "settings" && (
        <AdsSettingsTab
          settings={settings}
          onGoogle={patchGoogle}
          onMeta={patchMeta}
          onBudget={patchBudget}
          budgetStatus={budget}
          onSaveBudgetLimit={saveBudgetLimit}
          onDeleteAccount={(platform) => setDeleteTarget({ kind: "account", platform })}
        />
      )}

      <AdCampaignFormModal
        open={formOpen}
        defaultPlatform={formPlatform}
        monthlyLimit={settings.budget.monthlyLimit}
        onClose={() => setFormOpen(false)}
        onSave={createCampaign}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title={
          deleteTarget?.kind === "account"
            ? `${platformLabel[deleteTarget.platform]} hesabını sil`
            : deleteTarget?.kind === "event"
              ? "Dönüşüm olayını sil"
              : deleteTarget?.kind === "bulk"
                ? "Seçili kampanyaları sil"
                : "Reklam kampanyasını sil"
        }
        subtitle={
          deleteTarget?.kind === "account"
            ? "Bağlantı bilgileri tamamen kaldırılacak"
            : deleteTarget?.kind === "event"
              ? "Olay takibi durdurulacak"
              : deleteTarget?.kind === "bulk"
                ? "Seçilen kampanyalar listeden kaldırılacak"
                : "Kampanya ve harcama kayıtları listeden kalkacak"
        }
        footnote={
          deleteTarget?.kind === "campaign" || deleteTarget?.kind === "bulk"
            ? "Silme işleminden sonra üstteki banttan geri alabilirsiniz."
            : undefined
        }
        confirmLabel="Evet, sil"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      >
        {deleteTarget?.kind === "campaign" && (
          <div className="space-y-1.5 rounded-lg bg-background-100 p-3 text-xs text-foreground-700">
            <p className="text-sm font-semibold text-foreground-950">{deleteTarget.campaign.name}</p>
            <p className="flex items-center justify-between">
              <span>Platform</span>
              <span className="font-semibold text-foreground-900">{platformLabel[deleteTarget.campaign.platform]}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Kanal</span>
              <span className="font-semibold text-foreground-900">{deleteTarget.campaign.channel}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Harcama</span>
              <span className="font-semibold text-foreground-900">{formatMoney(deleteTarget.campaign.spend)}</span>
            </p>
          </div>
        )}
        {deleteTarget?.kind === "bulk" && (
          <div className="space-y-2 rounded-lg bg-background-100 p-3 text-xs text-foreground-700">
            <p className="text-sm font-semibold text-foreground-950">{deleteTarget.campaigns.length} kampanya silinecek</p>
            <ul className="max-h-32 space-y-1 overflow-y-auto pr-1">
              {deleteTarget.campaigns.slice(0, 6).map((campaign) => (
                <li key={campaign.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{campaign.name}</span>
                  <span className="shrink-0 text-[11px] text-foreground-500">{formatMoney(campaign.spend)}</span>
                </li>
              ))}
              {deleteTarget.campaigns.length > 6 && (
                <li className="text-[11px] text-foreground-500">+{deleteTarget.campaigns.length - 6} kampanya daha</li>
              )}
            </ul>
            <p className="flex items-center justify-between border-t border-background-200 pt-1.5">
              <span>Toplam harcama</span>
              <span className="font-semibold text-foreground-900">
                {formatMoney(deleteTarget.campaigns.reduce((sum, campaign) => sum + campaign.spend, 0))}
              </span>
            </p>
          </div>
        )}
        {deleteTarget?.kind === "event" && (
          <div className="space-y-1.5 rounded-lg bg-background-100 p-3 text-xs text-foreground-700">
            <p className="text-sm font-semibold text-foreground-950">{deleteTarget.event.name}</p>
            <p className="flex items-center justify-between">
              <span>Olay anahtarı</span>
              <span className="font-mono text-[11px] font-semibold text-foreground-900">{deleteTarget.event.eventKey}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>Son 7 gün</span>
              <span className="font-semibold text-foreground-900">{deleteTarget.event.count} olay</span>
            </p>
          </div>
        )}
        {deleteTarget?.kind === "account" && (
          <div className="space-y-1.5 rounded-lg bg-background-100 p-3 text-xs text-foreground-700">
            <p className="flex items-center justify-between">
              <span>Hesap</span>
              <span className="font-semibold text-foreground-950">
                {deleteTarget.platform === "google"
                  ? settings.google.accountName || "Google Ads hesabı"
                  : settings.meta.accountName || "Meta Ads hesabı"}
              </span>
            </p>
            <p className="text-[11px] leading-relaxed text-foreground-600">
              Müşteri kimliği, Pixel ve erişim belirteçleri silinir. Kampanyalar listede kalır ancak yeni
              oluşturulan kampanyalar için hesabı yeniden bağlamanız gerekir.
            </p>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
}