import { useMemo, useState } from "react";
import { Kpi, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { cargoStats, statusMeta, statusOrder } from "@/lib/shipping";
import { createSupportTask, logActivity } from "@/lib/activity";
import NewShipmentModal from "@/pages/admin/shipping/components/NewShipmentModal";
import ShipmentDetailModal from "@/pages/admin/shipping/components/ShipmentDetailModal";
import LabelPrintModal from "@/pages/admin/shipping/components/LabelPrintModal";
import type { CargoCompany, CargoStatus, CargoTariff, Shipment, ShippingSettings } from "@/types/shipping";

type FilterKey = "all" | CargoStatus;

interface ShipmentsTabProps {
  shipments: Shipment[];
  companies: CargoCompany[];
  tariffs: CargoTariff[];
  settings: ShippingSettings;
  onShipments: (next: Shipment[]) => void;
}

const formatNow = (): string => {
  const now = new Date();
  return `${now.toLocaleDateString("tr-TR")} ${now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
};

export default function ShipmentsTab({ shipments, companies, tariffs, settings, onShipments }: ShipmentsTabProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [flash, setFlash] = useState("");
  const [printIds, setPrintIds] = useState<string[]>([]);

  const stats = cargoStats(shipments);

  const companyById = useMemo(() => {
    const map: Record<string, CargoCompany> = {};
    companies.forEach((company) => {
      map[company.id] = company;
    });
    return map;
  }, [companies]);

  const visible = shipments.filter((shipment) => {
    const matchesStatus = filter === "all" || shipment.status === filter;
    const matchesCompany = companyFilter === "all" || shipment.companyId === companyFilter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      shipment.customer.toLowerCase().includes(query) ||
      shipment.tracking.toLowerCase().includes(query) ||
      shipment.orderId.toLowerCase().includes(query) ||
      shipment.city.toLowerCase().includes(query);
    return matchesStatus && matchesCompany && matchesSearch;
  });

  const activeShipment = shipments.find((shipment) => shipment.id === activeId) ?? null;

  const toggleSelect = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const toggleAll = () => {
    setSelected((current) => (current.length === visible.length ? [] : visible.map((shipment) => shipment.id)));
  };

  const createShipment = (shipment: Shipment) => {
    onShipments([shipment, ...shipments]);
    setCreating(false);
    setFlash(`${shipment.id} için ${companyById[shipment.companyId]?.name ?? "kargo"} etiketi oluşturuldu.`);
  };

  const setStatus = (id: string, status: CargoStatus) => {
    const date = formatNow();
    const target = shipments.find((shipment) => shipment.id === id);
    onShipments(
      shipments.map((shipment) =>
        shipment.id === id
          ? {
              ...shipment,
              status,
              history: [
                ...shipment.history,
                { status, date, location: "Brothers Teknoloji Lojistik", note: "Durum panelden güncellendi." },
              ],
            }
          : shipment
      )
    );
    if (target && status === "picked_up") {
      handOverToSupport(target);
      setFlash(`${target.id} kargoya verildi. Satış sonrası destek için otomatik görev oluşturuldu.`);
    }
  };

  const handOverToSupport = (shipment: Shipment) => {
    const companyName = companyById[shipment.companyId]?.name ?? "kargo";
    createSupportTask({
      title: `${shipment.orderId} kargoya verildi`,
      detail: `${shipment.customer} (${shipment.city}) siparişi ${companyName} ile sevk edildi. Takip numarası müşteriyle paylaşılmalı ve teslim süreci izlenmeli.`,
      orderId: shipment.orderId,
      shipmentId: shipment.id,
      customer: shipment.customer,
      tracking: shipment.tracking,
    });
    logActivity({
      category: "shipping",
      action: "Gönderiyi kargoya verdi",
      target: shipment.id,
      detail: `${shipment.orderId} · ${companyName} · ${shipment.tracking}`,
    });
  };

  const bulkPickUp = () => {
    if (selected.length === 0) return;
    const date = formatNow();
    onShipments(
      shipments.map((shipment) =>
        selected.includes(shipment.id)
          ? {
              ...shipment,
              status: "picked_up",
              history: [
                ...shipment.history,
                { status: "picked_up", date, location: "Brothers Teknoloji Lojistik", note: "Toplu olarak kargoya verildi." },
              ],
            }
          : shipment
      )
    );
    setFlash(`${selected.length} gönderi kargoya verildi olarak işaretlendi. Satış sonrası destek görevleri oluşturuldu.`);
    shipments.filter((shipment) => selected.includes(shipment.id)).forEach(handOverToSupport);
    setSelected([]);
  };

  const filters: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: "all", label: "Tümü", count: shipments.length },
    ...statusOrder.map((status) => ({
      key: status as FilterKey,
      label: statusMeta[status].label,
      count: shipments.filter((shipment) => shipment.status === status).length,
    })),
  ];

  return (
    <div className="space-y-4">
      {flash && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          <span className="flex-1">{flash}</span>
          <button type="button" onClick={() => setFlash("")} aria-label="Kapat" className="cursor-pointer">
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-truck-line" label="Yolda Olan" value={String(stats.active)} hint="Teslim bekleyen gönderi" tone="info" />
        <Kpi icon="ri-checkbox-circle-line" label="Teslim Edilen" value={String(stats.delivered)} hint="Bu ay tamamlanan" tone="success" />
        <Kpi icon="ri-price-tag-3-line" label="Etiket Bekleyen" value={String(stats.waiting)} hint="Kurye teslim alacak" tone="warning" />
        <Kpi icon="ri-wallet-3-line" label="Kargo Maliyeti" value={formatPrice(stats.totalCost)} hint={`Ortalama ${formatPrice(stats.avgCost)}`} tone="neutral" />
      </div>

      <Panel
        title="Kargo Gönderileri"
        subtitle="Tüm kargo firmalarındaki gönderiler tek ekranda"
        icon="ri-truck-line"
        padded={false}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Müşteri / takip no / sipariş"
              className={`${inputClass} h-9 w-44 text-xs`}
            />
            <select
              value={companyFilter}
              onChange={(event) => setCompanyFilter(event.target.value)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-800 outline-none"
            >
              <option value="all">Tüm firmalar</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-add-line" />
              Yeni Gönderi
            </button>
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-1.5 border-b border-background-200 px-4 py-2.5">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                filter === item.key
                  ? "bg-primary-700 text-background-50"
                  : "bg-background-100 text-foreground-600 hover:bg-background-200"
              }`}
            >
              {item.label}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  filter === item.key ? "bg-background-50/25 text-background-50" : "bg-background-50 text-foreground-600"
                }`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-background-200 bg-primary-50 px-4 py-2.5">
            <span className="text-xs font-semibold text-primary-900">{selected.length} gönderi seçildi</span>
            <button
              type="button"
              onClick={bulkPickUp}
              className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-primary-800 px-2 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-inbox-archive-line" />
              Kargoya Ver
            </button>
            <button
              type="button"
              onClick={() => setPrintIds([...selected])}
              className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-background-50 px-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
            >
              <i className="ri-printer-line" />
              Barkod Etiketi
            </button>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="ml-auto cursor-pointer text-[11px] text-foreground-500 hover:text-foreground-900"
            >
              Seçimi temizle
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="w-10 px-4 py-2.5">
                  <button
                    type="button"
                    onClick={toggleAll}
                    aria-label="Tümünü seç"
                    className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border text-[9px] ${
                      selected.length === visible.length && visible.length > 0
                        ? "border-primary-700 bg-primary-700 text-background-50"
                        : "border-background-400 bg-transparent text-transparent"
                    }`}
                  >
                    <i className="ri-check-line" />
                  </button>
                </th>
                <th className="px-3 py-2.5 font-semibold">Gönderi</th>
                <th className="px-3 py-2.5 font-semibold">Müşteri</th>
                <th className="px-3 py-2.5 font-semibold">Firma</th>
                <th className="px-3 py-2.5 font-semibold">Takip No</th>
                <th className="px-3 py-2.5 font-semibold">Desi</th>
                <th className="px-3 py-2.5 font-semibold">Bedel</th>
                <th className="px-3 py-2.5 font-semibold">Durum</th>
                <th className="px-4 py-2.5 text-right font-semibold" />
              </tr>
            </thead>
            <tbody>
              {visible.map((shipment) => {
                const company = companyById[shipment.companyId];
                const meta = statusMeta[shipment.status];
                const isSelected = selected.includes(shipment.id);
                return (
                  <tr
                    key={shipment.id}
                    onClick={() => setActiveId(shipment.id)}
                    className={`cursor-pointer border-b border-background-100 transition-colors last:border-0 ${
                      isSelected ? "bg-primary-50/60" : "hover:bg-background-100/60"
                    }`}
                  >
                    <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleSelect(shipment.id)}
                        aria-label="Gönderiyi seç"
                        className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded border text-[9px] ${
                          isSelected
                            ? "border-primary-700 bg-primary-700 text-background-50"
                            : "border-background-400 text-transparent"
                        }`}
                      >
                        <i className="ri-check-line" />
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <p className="whitespace-nowrap font-mono text-xs font-semibold text-foreground-950">{shipment.id}</p>
                      <p className="mt-0.5 whitespace-nowrap text-[10px] text-foreground-500">{shipment.orderId}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="whitespace-nowrap text-xs font-medium text-foreground-900">{shipment.customer}</p>
                      <p className="mt-0.5 whitespace-nowrap text-[10px] text-foreground-500">{shipment.city}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-background-100 px-2 py-1 text-[11px] font-medium text-foreground-800">
                        <span className="flex h-4 w-4 items-center justify-center rounded bg-primary-100 text-[8px] font-bold text-primary-900">
                          {company?.short ?? "?"}
                        </span>
                        {company?.name ?? "Tanımsız"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-foreground-600">{shipment.tracking}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-foreground-700">
                      {shipment.desi} / {shipment.packages}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-foreground-950">
                      {formatPrice(shipment.cost)}
                    </td>
                    <td className="px-3 py-3">
                      <Pill tone={meta.tone}>
                        <i className={meta.icon} />
                        {meta.label}
                      </Pill>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-foreground-500">
                        <i className="ri-arrow-right-s-line" />
                      </span>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-foreground-500">
                    Bu filtrelere uygun gönderi bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <NewShipmentModal
        open={creating}
        companies={companies}
        tariffs={tariffs}
        settings={settings}
        onClose={() => setCreating(false)}
        onCreate={createShipment}
      />

      {activeShipment && (
        <ShipmentDetailModal
          shipment={activeShipment}
          company={companyById[activeShipment.companyId]}
          onClose={() => setActiveId(null)}
          onStatus={(status) => setStatus(activeShipment.id, status)}
        />
      )}

      {printIds.length > 0 && (
        <LabelPrintModal
          shipments={shipments.filter((shipment) => printIds.includes(shipment.id))}
          companies={companies}
          onClose={() => setPrintIds([])}
        />
      )}
    </div>
  );
}