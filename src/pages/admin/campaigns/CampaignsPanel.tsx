import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Panel, Pill } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import {
  ADMIN_STORE_KEYS,
  campaignState,
  campaignStateLabel,
  campaignStateTone,
  campaignTypeLabel,
  campaignValueLabel,
  formatDateTr,
  formatNumberTr,
  loadCampaigns,
} from "@/lib/adminStore";
import type { Campaign, CampaignState } from "@/types/admin";
import CampaignFormModal from "@/pages/admin/campaigns/CampaignFormModal";

type Filter = "all" | CampaignState;

const todayStr = (): string => new Date().toISOString().slice(0, 10);

const emptyCampaign = (): Campaign => {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + 14);
  return {
    id: "",
    code: "",
    title: "",
    type: "percentage",
    value: 10,
    minBasket: 0,
    usageLimit: 100,
    used: 0,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    active: true,
    channels: ["Web", "Mobil"],
    note: "",
  };
};

export default function CampaignsPanel() {
  const [campaigns, setCampaigns] = usePersistentState<Campaign[]>(
    ADMIN_STORE_KEYS.campaigns,
    loadCampaigns()
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [formState, setFormState] = useState<{ draft: Campaign; isNew: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const withState = useMemo(
    () => campaigns.map((campaign) => ({ campaign, state: campaignState(campaign) })),
    [campaigns]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: campaigns.length };
    withState.forEach(({ state }) => {
      map[state] = (map[state] ?? 0) + 1;
    });
    return map;
  }, [withState, campaigns.length]);

  const visible = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("tr");
    return withState.filter(({ campaign, state }) => {
      if (filter !== "all" && state !== filter) return false;
      if (!term) return true;
      return `${campaign.code} ${campaign.title}`.toLocaleLowerCase("tr").includes(term);
    });
  }, [withState, filter, search]);

  const totals = useMemo(() => {
    const used = campaigns.reduce((sum, campaign) => sum + campaign.used, 0);
    const limit = campaigns.reduce((sum, campaign) => sum + campaign.usageLimit, 0);
    return { used, limit, rate: limit ? (used / limit) * 100 : 0 };
  }, [campaigns]);

  const saveCampaign = (campaign: Campaign, isNew: boolean) => {
    if (isNew) {
      setCampaigns((current) => [{ ...campaign, id: `cmp-${Date.now().toString().slice(-6)}` }, ...current]);
    } else {
      setCampaigns((current) => current.map((item) => (item.id === campaign.id ? campaign : item)));
    }
    setFormState(null);
  };

  const toggleActive = (id: string) => {
    setCampaigns((current) =>
      current.map((campaign) => (campaign.id === id ? { ...campaign, active: !campaign.active } : campaign))
    );
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Aktif Kampanya</p>
          <p className="mt-1 font-heading text-xl font-bold text-accent-700">{counts.active ?? 0}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{counts.scheduled ?? 0} kampanya planlandı</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Toplam Kupon</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{campaigns.length}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{counts.expired ?? 0} sona erdi</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Toplam Kullanım</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{formatNumberTr(totals.used)}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{formatNumberTr(totals.limit)} kullanım limiti</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Limit Doluluk</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">%{Math.round(totals.rate)}</p>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background-200">
            <div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, totals.rate)}%` }} />
          </div>
        </div>
      </div>

      <Banner tone="info">
        Kupon kodu kontenjanı dolan kampanyalar otomatik olarak reddedilir. Tarihi geçen kampanyaları duraklatıp
        arşivleyebilirsiniz.
      </Banner>

      <Panel
        title="Kampanyalar"
        subtitle="Kupon kodları, indirim senaryoları ve kullanım performansı"
        icon="ri-discount-percent-line"
        padded={false}
        action={
          <button
            type="button"
            onClick={() => setFormState({ draft: emptyCampaign(), isNew: true })}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-add-line" />
            Yeni Kampanya
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3">
          <div className="relative min-w-0 flex-1">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kupon kodu veya kampanya adı ara..."
              className="h-9 w-full rounded-lg border border-background-300 bg-background-50 pl-8 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {([
              { id: "all", label: "Tümü" },
              { id: "active", label: "Aktif" },
              { id: "scheduled", label: "Planlandı" },
              { id: "expired", label: "Sona Erdi" },
              { id: "paused", label: "Duraklatıldı" },
            ] as Array<{ id: Filter; label: string }>).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                  filter === item.id
                    ? "bg-primary-800 text-background-50"
                    : "bg-background-100 text-foreground-600 hover:bg-background-200"
                }`}
              >
                {item.label}
                <span className="ml-1 opacity-70">{counts[item.id] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-2">
          {visible.map(({ campaign, state }) => {
            const usedPercent = campaign.usageLimit ? Math.min(100, (campaign.used / campaign.usageLimit) * 100) : 0;
            return (
              <div
                key={campaign.id}
                className={`flex flex-col rounded-xl border p-3.5 ${
                  state === "active"
                    ? "border-background-200 bg-background-50"
                    : "border-background-200 bg-background-100/60"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyCode(campaign.code)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-dashed border-primary-300 bg-primary-50 px-2 py-0.5 font-mono text-xs font-bold text-primary-900 hover:bg-primary-100"
                        title="Kodu kopyala"
                      >
                        {campaign.code}
                        <i className={copied === campaign.code ? "ri-check-line text-[11px]" : "ri-file-copy-line text-[11px]"} />
                      </button>
                      <Pill tone={campaignStateTone(state)}>{campaignStateLabel[state]}</Pill>
                    </div>
                    <p className="mt-1.5 truncate text-sm font-semibold text-foreground-950">{campaign.title}</p>
                    <p className="text-[11px] text-foreground-500">{campaignTypeLabel(campaign)}</p>
                  </div>
                  <span className="flex h-11 min-w-[52px] shrink-0 items-center justify-center rounded-xl bg-accent-100 px-2 font-heading text-sm font-bold text-accent-900">
                    {campaignValueLabel(campaign)}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-foreground-600">
                  <span className="flex items-center gap-1">
                    <i className="ri-shopping-basket-line" />
                    min. {formatNumberTr(campaign.minBasket)} ₺
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-calendar-line" />
                    {formatDateTr(campaign.startDate)} – {formatDateTr(campaign.endDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-device-line" />
                    {campaign.channels.join(" · ")}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-time-line" />
                    {campaign.endDate < todayStr() ? "Süre doldu" : `${Math.max(1, Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / 86400000))} gün kaldı`}
                  </span>
                </div>

                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[11px] text-foreground-600">
                    <span>Kullanım</span>
                    <span className="font-semibold text-foreground-900">
                      {campaign.used} / {campaign.usageLimit}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-background-200">
                    <div
                      className={`h-full rounded-full ${
                        usedPercent >= 100 ? "bg-secondary-500" : usedPercent > 70 ? "bg-primary-500" : "bg-accent-500"
                      }`}
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                </div>

                {campaign.note && (
                  <p className="mt-2 line-clamp-2 rounded-md bg-background-100 px-2 py-1 text-[11px] text-foreground-500">
                    {campaign.note}
                  </p>
                )}

                <div className="mt-2.5 flex items-center gap-1.5 border-t border-background-200 pt-2.5">
                  <button
                    type="button"
                    onClick={() => setFormState({ draft: { ...campaign, channels: [...campaign.channels] }, isNew: false })}
                    className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-background-100 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
                  >
                    <i className="ri-edit-line" />
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(campaign)}
                    aria-label="Kampanyayı sil"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-500 hover:bg-background-200 hover:text-accent-700"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={campaign.active}
                    aria-label={`${campaign.code} durumunu değiştir`}
                    onClick={() => toggleActive(campaign.id)}
                    className={`ml-auto flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                      campaign.active ? "bg-accent-600" : "bg-background-400"
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded-full bg-background-50 shadow transition-transform ${
                        campaign.active ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!visible.length && (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <i className="ri-coupon-3-line text-2xl text-foreground-400" />
            <p className="text-sm text-foreground-600">Bu filtreye uygun kampanya bulunamadı.</p>
          </div>
        )}
      </Panel>

      {formState && (
        <CampaignFormModal
          open
          draft={formState.draft}
          isNew={formState.isNew}
          onClose={() => setFormState(null)}
          onSave={saveCampaign}
        />
      )}

      <Modal
        open={Boolean(deleteTarget)}
        title="Kampanyayı sil"
        subtitle={deleteTarget?.code}
        icon="ri-delete-bin-6-line"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => {
                if (!deleteTarget) return;
                setCampaigns((current) => current.filter((item) => item.id !== deleteTarget.id));
                setDeleteTarget(null);
              }}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg bg-accent-700 px-4 text-xs font-semibold text-background-50 hover:bg-accent-600"
            >
              Kampanyayı Sil
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          <strong className="text-foreground-950">{deleteTarget?.code}</strong> kuponu silinecek. Kuponu kullanan
          geçmiş siparişler etkilenmez.
        </p>
      </Modal>
    </div>
  );
}