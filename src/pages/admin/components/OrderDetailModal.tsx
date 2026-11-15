import { useEffect, useState } from "react";
import { Pill } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { statusIcons, statusList, statusStyles } from "@/lib/orderStatus";
import { shipmentsForOrder, loadCargoCompanies, statusMeta } from "@/lib/shipping";
import { createShipmentForOrder } from "@/lib/orderShipping";
import { orderTotal } from "@/hooks/useAdminOrders";
import CreateShipmentModal from "@/pages/admin/components/CreateShipmentModal";
import CargoSmsModal from "@/pages/admin/components/CargoSmsModal";
import LabelPrintModal from "@/pages/admin/shipping/components/LabelPrintModal";
import type { AdminOrder, OrderStatus } from "@/types/store";
import type { Shipment } from "@/types/shipping";

interface OrderDetailModalProps {
  order: AdminOrder;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export default function OrderDetailModal({ order, onClose, onUpdateStatus }: OrderDetailModalProps) {
  const [selected, setSelected] = useState<OrderStatus>(order.status);
  const [saved, setSaved] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(() => shipmentsForOrder(order.id) ?? null);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [oneClickDone, setOneClickDone] = useState(false);
  const [companies] = useState(() => loadCargoCompanies());
  const shipmentCompany = shipment ? companies.find((company) => company.id === shipment.companyId) : undefined;

  const handleShipmentCreated = (next: Shipment) => {
    setShipment(next);
    if (order.status === "Hazırlanıyor") {
      onUpdateStatus(order.id, "Kargoda");
      setSelected("Kargoda");
      setSaved(false);
    }
  };

  // Tek tıkla: varsayılan kargo ayarlarıyla etiketi üretir, siparişi "Kargoda"ya çeker
  // ve doğrudan barkod yazıcı ekranını açar.
  const createLabelOneClick = () => {
    const next = shipment ?? createShipmentForOrder(order);
    handleShipmentCreated(next);
    setOneClickDone(true);
    setShowLabelModal(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const total = orderTotal(order);
  const addressLabel = `${order.address}, ${order.city}`;

  const save = () => {
    onUpdateStatus(order.id, selected);
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center px-0 sm:items-center sm:px-4">
      <div onClick={onClose} className="absolute inset-0 bg-primary-950/55 backdrop-blur-sm" />

      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-background-200 bg-background-50 shadow-2xl sm:rounded-2xl animate-fadeUp">
        <div className="flex items-start justify-between gap-3 border-b border-background-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-lg font-bold text-foreground-950">{order.id}</h2>
              <span
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium ${statusStyles[selected]}`}
              >
                <i className={statusIcons[selected]} />
                {selected}
              </span>
            </div>
            <p className="mt-1 text-xs text-foreground-500">
              {order.date} · {order.lines.length} kalem · {order.payment}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100 hover:text-foreground-900"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-background-200 bg-background-100 p-3.5">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                <i className="ri-user-3-line text-sm" />
                Müşteri
              </p>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-800">
                  {order.customer
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="text-sm font-semibold text-foreground-900">{order.customer}</span>
              </div>
              <p className="mt-2 break-all text-xs text-foreground-700">{order.email}</p>
              <p className="text-xs text-foreground-700">{order.phone}</p>
            </div>

            <div className="rounded-xl border border-background-200 bg-background-100 p-3.5">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                <i className="ri-map-pin-2-line text-sm" />
                Teslimat
              </p>
              <p className="text-xs leading-relaxed text-foreground-800">{addressLabel}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-600">
                <span className="flex items-center gap-1">
                  <i className="ri-truck-line text-sm" />
                  {shipmentCompany?.name ?? order.cargo}
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-barcode-line text-sm" />
                  {shipment?.tracking ?? order.tracking}
                </span>
              </div>
            </div>
          </div>

          {order.note && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-accent-50 px-3 py-2 text-xs text-accent-800">
              <i className="ri-sticky-note-line mt-0.5" />
              <span>{order.note}</span>
            </p>
          )}

          <div className="mt-3 rounded-xl border border-background-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                <i className="ri-truck-line text-sm" />
                Kargo Gönderisi
              </p>
              {shipment && (
                <Pill tone={statusMeta[shipment.status].tone}>
                  <i className={statusMeta[shipment.status].icon} />
                  {statusMeta[shipment.status].label}
                </Pill>
              )}
            </div>

            {shipment ? (
              <div className="mt-2.5 space-y-2.5">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-600">
                  <span className="flex items-center gap-1.5 rounded-md bg-background-100 px-2 py-1">
                    <i className="ri-barcode-line text-foreground-800" />
                    <span className="font-mono text-xs font-semibold text-foreground-950">{shipment.tracking}</span>
                  </span>
                  <span>
                    {shipment.desi} desi · {shipment.packages} paket
                  </span>
                  <span>
                    {shipmentCompany?.name ?? "Kargo"} · Tahmini teslim {shipment.eta}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={createLabelOneClick}
                    className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 px-2.5 text-[11px] font-semibold text-background-50 hover:from-primary-700 hover:to-primary-500"
                  >
                    <i className="ri-printer-cloud-line" />
                    Barkod Etiketi Yazdır
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSmsModal(true)}
                    className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-accent-500 bg-accent-50 px-2.5 text-[11px] font-semibold text-accent-900 hover:bg-accent-100"
                  >
                    <i className="ri-message-2-line" />
                    Kargo Durumunu SMS ile Bildir
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShipmentModal(true)}
                    className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-semibold text-foreground-700 hover:bg-background-100"
                  >
                    <i className="ri-settings-3-line" />
                    Gönderi Detayı
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-xs text-foreground-600">
                  Bu sipariş için henüz kargo gönderisi oluşturulmadı. Tek tıkla varsayılan kargo ayarlarıyla etiket
                  üretilir, takip numarası atanır ve sipariş &quot;Kargoda&quot; durumuna geçer.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={createLabelOneClick}
                    className="flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 px-4 text-xs font-semibold text-background-50 hover:from-primary-700 hover:to-primary-500"
                  >
                    <i className="ri-flashlight-line" />
                    Tek Tıkla Etiket Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShipmentModal(true)}
                    className="flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
                  >
                    <i className="ri-settings-3-line" />
                    Detaylı Oluştur
                  </button>
                </div>
              </div>
            )}

            {oneClickDone && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-accent-300 bg-accent-50 px-2.5 py-2 text-[11px] text-accent-900">
                <i className="ri-checkbox-circle-fill mt-0.5" />
                Etiket oluşturuldu ve sipariş Kargoda durumuna alındı. Barkod yazıcı ekranından etiketi yazdırabilirsiniz.
              </p>
            )}
          </div>

          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Sipariş Kalemleri</p>
            <div className="divide-y divide-background-200 overflow-hidden rounded-xl border border-background-200">
              {order.lines.map((line) => (
                <div key={line.name} className="flex items-center gap-3 bg-background-50 px-3 py-3">
                  <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-background-200 bg-background-100">
                    <img src={line.image} alt={line.name} title={line.name} className="h-full w-full object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2-safe text-sm font-medium text-foreground-900">{line.name}</p>
                    <p className="mt-0.5 text-xs text-foreground-500">
                      {line.brand} · {line.quantity} adet
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground-900">{formatPrice(line.price * line.quantity)}</p>
                    {line.quantity > 1 && (
                      <p className="text-[11px] text-foreground-500">Birim {formatPrice(line.price)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-1.5 rounded-xl border border-background-200 bg-background-100 px-4 py-3 text-sm">
            <div className="flex items-center justify-between text-foreground-600">
              <span>Ara toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between text-foreground-600">
              <span>Kargo</span>
              <span className="text-accent-700">Ücretsiz</span>
            </div>
            <div className="flex items-center justify-between border-t border-background-200 pt-2 font-semibold text-foreground-950">
              <span>Genel toplam</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-background-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
                Sipariş Durumunu Güncelle
              </p>
              {saved && (
                <span className="flex items-center gap-1 text-xs font-medium text-accent-700">
                  <i className="ri-checkbox-circle-fill" />
                  Durum kaydedildi
                </span>
              )}
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {statusList.map((status) => {
                const active = selected === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setSelected(status);
                      setSaved(false);
                    }}
                    className={`flex cursor-pointer flex-col items-center gap-1 whitespace-nowrap rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary-600 bg-primary-50 text-primary-900"
                        : "border-background-300 text-foreground-600 hover:bg-background-100"
                    }`}
                  >
                    <i className={`${statusIcons[status]} text-base`} />
                    {status}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={save}
                disabled={selected === order.status || saved}
                className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 transition-all hover:from-primary-700 hover:to-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="ri-save-3-line" />
                Durumu Kaydet
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-background-300 px-5 text-sm font-medium text-foreground-700 hover:bg-background-100"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>

      {showShipmentModal && (
        <CreateShipmentModal
          order={order}
          existing={shipment}
          onClose={() => setShowShipmentModal(false)}
          onCreated={handleShipmentCreated}
        />
      )}

      {showSmsModal && shipment && (
        <CargoSmsModal order={order} shipment={shipment} onClose={() => setShowSmsModal(false)} />
      )}

      {showLabelModal && shipment && (
        <LabelPrintModal shipments={[shipment]} companies={companies} onClose={() => setShowLabelModal(false)} />
      )}
    </div>
  );
}