import { useEffect, useState } from "react";
import Modal from "@/components/base/Modal";
import { Pill } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { buildTrackingUrl, forwardStatus, statusMeta } from "@/lib/shipping";
import ShipmentLabel from "@/pages/admin/shipping/components/ShipmentLabel";
import LabelPrintModal from "@/pages/admin/shipping/components/LabelPrintModal";
import type { CargoCompany, CargoStatus, Shipment } from "@/types/shipping";

interface ShipmentDetailModalProps {
  shipment: Shipment;
  company?: CargoCompany;
  onClose: () => void;
  onStatus: (status: CargoStatus) => void;
}

export default function ShipmentDetailModal({ shipment, company, onClose, onStatus }: ShipmentDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState("");
  const [showLabelModal, setShowLabelModal] = useState(false);
  const meta = statusMeta[shipment.status];
  const trackingUrl = buildTrackingUrl(company, shipment.tracking);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(""), 2600);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const copyTracking = async () => {
    try {
      await navigator.clipboard.writeText(shipment.tracking);
      setCopied(true);
    } catch {
      setFlash("Takip numarası kopyalanamadı, elle seçebilirsiniz.");
    }
  };

  const advance = (status: CargoStatus) => {
    onStatus(status);
    setFlash(`Durum "${statusMeta[status].label}" olarak güncellendi.`);
  };

  const currentIndex = forwardStatus.indexOf(shipment.status);

  return (
    <Modal
      open
      title={`${shipment.id} · ${shipment.customer}`}
      subtitle={`${shipment.date} · ${shipment.city}`}
      icon="ri-truck-line"
      onClose={onClose}
      maxWidth="max-w-4xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={meta.tone}>
              <i className={meta.icon} />
              {meta.label}
            </Pill>
            {flash && <span className="text-xs font-medium text-accent-700">{flash}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-external-link-line" />
                Kargo Takibi
              </a>
            )}
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
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <div className="rounded-xl border border-background-200 bg-background-100 p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Takip Numarası</p>
                <p className="mt-0.5 font-mono text-sm font-bold text-foreground-950">{shipment.tracking}</p>
              </div>
              <button
                type="button"
                onClick={copyTracking}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-background-50 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
              >
                <i className={copied ? "ri-check-line text-accent-700" : "ri-file-copy-line"} />
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Firma</p>
                <p className="mt-0.5 font-medium text-foreground-900">{company?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Desi</p>
                <p className="mt-0.5 font-medium text-foreground-900">{shipment.desi} / {shipment.packages} paket</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Kargo Bedeli</p>
                <p className="mt-0.5 font-medium text-foreground-900">{formatPrice(shipment.cost)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Tahmini Teslim</p>
                <p className="mt-0.5 font-medium text-foreground-900">{shipment.eta}</p>
              </div>
            </div>

            <div className="mt-3 border-t border-background-200 pt-2.5 text-xs leading-relaxed text-foreground-700">
              <span className="font-semibold text-foreground-900">{shipment.customer}</span> · {shipment.phone}
              <br />
              {shipment.address}, {shipment.city}
              {shipment.note && <p className="mt-1.5 text-[11px] text-foreground-500">Not: {shipment.note}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-background-200 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Gönderi Hareketleri</p>
            <ol className="space-y-0">
              {forwardStatus.map((status, index) => {
                const done = shipment.status === "returned" ? true : index <= currentIndex;
                const isCurrent = shipment.status !== "returned" && index === currentIndex;
                const movement = [...shipment.history].reverse().find((item) => item.status === status);
                const item = statusMeta[status];
                return (
                  <li key={status} className="flex gap-3 pb-3 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${
                          done
                            ? "bg-accent-600 text-background-50"
                            : "border border-background-300 bg-background-50 text-foreground-400"
                        } ${isCurrent ? "ring-2 ring-accent-300" : ""}`}
                      >
                        <i className={item.icon} />
                      </span>
                      {index < forwardStatus.length - 1 && (
                        <span className={`mt-1 h-full w-px flex-1 ${done ? "bg-accent-300" : "bg-background-200"}`} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <p className={`text-xs font-semibold ${done ? "text-foreground-900" : "text-foreground-400"}`}>
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-500">
                        {movement ? `${movement.date} · ${movement.location}` : "Bekliyor"}
                      </p>
                      {movement?.note && <p className="text-[11px] text-foreground-400">{movement.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>

            {shipment.status === "returned" && (
              <p className="mt-1 flex items-start gap-2 rounded-lg bg-foreground-100 px-3 py-2 text-[11px] text-foreground-800">
                <i className="ri-arrow-go-back-line mt-0.5" />
                Gönderi iade sürecinde. Ürün depoya ulaştığında stok otomatik güncellenir.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-background-200 p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Durumu İlerlet</p>
            <div className="flex flex-wrap gap-1.5">
              {forwardStatus.map((status) => {
                const active = shipment.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => advance(status)}
                    disabled={active}
                    className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors disabled:cursor-not-allowed ${
                      active
                        ? "border-accent-500 bg-accent-50 text-accent-900"
                        : "border-background-300 text-foreground-600 hover:bg-background-100"
                    }`}
                  >
                    <i className={statusMeta[status].icon} />
                    {statusMeta[status].label}
                  </button>
                );
              })}
              {shipment.status !== "returned" && shipment.status !== "delivered" && (
                <button
                  type="button"
                  onClick={() => advance("returned")}
                  className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-foreground-300 px-2.5 py-1.5 text-[11px] font-medium text-foreground-700 hover:bg-foreground-100"
                >
                  <i className="ri-arrow-go-back-line" />
                  İadeye Al
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ShipmentLabel shipment={shipment} company={company} />
          <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">
            Etiket, kargo firmasının standart 10x15 cm termal etiket ölçüsüne göre hazırlanır. Yazdırdıktan sonra paketin
            üzerine yapıştırıp kuryeye teslim edin.
          </p>
        </div>
      </div>

      {showLabelModal && (
        <LabelPrintModal
          shipments={[shipment]}
          companies={company ? [company] : []}
          onClose={() => setShowLabelModal(false)}
        />
      )}
    </Modal>
  );
}