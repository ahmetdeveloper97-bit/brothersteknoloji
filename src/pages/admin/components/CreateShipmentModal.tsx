import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Field, Pill } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import {
  buildTrackingUrl,
  calculateCargoPrice,
  cityZone,
  loadCargoCompanies,
  loadCargoTariffs,
  loadShippingSettings,
  statusMeta,
} from "@/lib/shipping";
import { createShipmentForOrder, orderAmount } from "@/lib/orderShipping";
import ShipmentLabel from "@/pages/admin/shipping/components/ShipmentLabel";
import LabelPrintModal from "@/pages/admin/shipping/components/LabelPrintModal";
import type { AdminOrder } from "@/types/store";
import type { Shipment } from "@/types/shipping";

interface CreateShipmentModalProps {
  order: AdminOrder;
  existing?: Shipment | null;
  onClose: () => void;
  onCreated?: (shipment: Shipment) => void;
}

const selectClass =
  "box-border h-10 w-full cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-sm text-foreground-900 outline-none focus:border-primary-500";

export default function CreateShipmentModal({ order, existing, onClose, onCreated }: CreateShipmentModalProps) {
  const [companies] = useState(() => loadCargoCompanies());
  const [tariffs] = useState(() => loadCargoTariffs());
  const [settings] = useState(() => loadShippingSettings());
  const enabledCompanies = useMemo(() => companies.filter((company) => company.enabled), [companies]);

  const [companyId, setCompanyId] = useState(
    () => enabledCompanies.find((item) => item.id === settings.defaultCompanyId)?.id ?? enabledCompanies[0]?.id ?? "yurtici"
  );
  const [desi, setDesi] = useState(String(settings.defaultDesi));
  const [packages, setPackages] = useState("1");
  const [created, setCreated] = useState<Shipment | null>(existing ?? null);
  const [copied, setCopied] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);

  const shipment = created;
  const activeCompany = companies.find((company) => company.id === (shipment?.companyId ?? companyId));
  const isCod = order.payment.toLowerCase().includes("kapıda");
  const zone = cityZone(settings, order.city || "İstanbul");
  const tariff = tariffs.find((item) => item.companyId === companyId);
  const desiValue = Math.max(0.5, Number(desi) || settings.defaultDesi);
  const estimatedCost = calculateCargoPrice(tariff, desiValue, {
    zoneMultiplier: zone.multiplier,
    cod: isCod,
    insurance: settings.insuranceEnabled,
  });
  const trackingUrl = shipment ? buildTrackingUrl(activeCompany, shipment.tracking) : "";

  const create = () => {
    const next = createShipmentForOrder(order, {
      companyId,
      desi: desiValue,
      packages: Math.max(1, Number(packages) || 1),
    });
    setCreated(next);
    onCreated?.(next);
  };

  const copyTracking = async () => {
    if (!shipment) return;
    try {
      await navigator.clipboard.writeText(shipment.tracking);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
    <Modal
      open
      title={shipment ? "Kargo Etiketi Hazır" : "Kargo Gönderisi Oluştur"}
      subtitle={`${order.id} · ${order.customer}`}
      icon="ri-truck-line"
      onClose={onClose}
      maxWidth={shipment ? "max-w-2xl" : "max-w-lg"}
      footer={
        shipment ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs font-medium text-accent-700">
              <i className="ri-checkbox-circle-fill" />
              Etiket oluşturuldu · takip numarası alıcıya SMS ile gönderilir
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLabelModal(true)}
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-printer-line" />
                Etiketi Yazdır
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-foreground-600">
              Tahmini bedel: <span className="font-semibold text-foreground-950">{formatPrice(estimatedCost)}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={create}
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 px-4 text-xs font-semibold text-background-50 hover:from-primary-700 hover:to-primary-500"
              >
                <i className="ri-flashlight-line" />
                Tek Tıkla Etiket Oluştur
              </button>
            </div>
          </div>
        )
      }
    >
      {shipment ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={statusMeta[shipment.status].tone}>
              <i className={statusMeta[shipment.status].icon} />
              {statusMeta[shipment.status].label}
            </Pill>
            <Pill tone="info">
              <i className="ri-truck-line" />
              {activeCompany?.name ?? "Kargo"}
            </Pill>
            <Pill tone="neutral">
              <i className="ri-calendar-check-line" />
              Tahmini teslim {shipment.eta}
            </Pill>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold text-foreground-800">{shipment.tracking}</span>
              <button
                type="button"
                onClick={copyTracking}
                aria-label="Takip numarasını kopyala"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-background-100 text-foreground-600 hover:bg-background-200"
              >
                <i className={copied ? "ri-check-line text-accent-700" : "ri-file-copy-line"} />
              </button>
            </span>
          </div>

          <ShipmentLabel shipment={shipment} company={activeCompany} />

          <div className="flex flex-col gap-2 rounded-lg bg-background-100 px-3 py-2.5 text-xs text-foreground-600 sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-1.5">
              <i className="ri-information-line" />
              Gönderi durumunu Kargo → Gönderiler ekranından ilerletebilirsiniz.
            </span>
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 whitespace-nowrap font-medium text-primary-700 hover:text-primary-900"
              >
                <i className="ri-external-link-line" />
                Kargo Takibi
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="rounded-lg bg-background-100 px-3 py-2.5 text-xs leading-relaxed text-foreground-600">
            <span className="font-semibold text-foreground-900">{order.customer}</span> · {order.city}
            <br />
            {order.address}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
              <span className="flex items-center gap-1">
                <i className="ri-shopping-bag-3-line" />
                {formatPrice(orderAmount(order))}
              </span>
              <span className={`flex items-center gap-1 ${isCod ? "text-accent-700" : ""}`}>
                <i className={isCod ? "ri-money-dollar-circle-line" : "ri-checkbox-circle-line"} />
                {isCod ? "Kapıda ödeme" : "Ödeme alındı"}
              </span>
              <span className="flex items-center gap-1">
                <i className="ri-map-2-line" />
                {zone.name}
              </span>
            </p>
          </div>

          <Field label="Kargo firması">
            <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} className={selectClass}>
              {enabledCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} · {company.avgDelivery}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Desi">
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={desi}
                onChange={(event) => setDesi(event.target.value)}
                className={selectClass}
              />
            </Field>
            <Field label="Paket sayısı">
              <input
                type="number"
                min="1"
                value={packages}
                onChange={(event) => setPackages(event.target.value)}
                className={selectClass}
              />
            </Field>
          </div>

          <p className="flex items-start gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-[11px] leading-relaxed text-primary-900">
            <i className="ri-flashlight-line mt-0.5" />
            Tek tıkla oluşturduğunuzda varsayılan firma, desi ve sigorta ayarları kullanılır; sipariş durumu otomatik
            olarak &quot;Kargoda&quot;ya çekilir.
          </p>
        </div>
      )}
    </Modal>

      {showLabelModal && shipment && (
        <LabelPrintModal shipments={[shipment]} companies={companies} onClose={() => setShowLabelModal(false)} />
      )}
    </>
  );
}