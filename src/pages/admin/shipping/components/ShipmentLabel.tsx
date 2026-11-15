import Barcode from "@/components/base/Barcode";
import { formatPrice } from "@/lib/format";
import type { CargoCompany, Shipment } from "@/types/shipping";

interface ShipmentLabelProps {
  shipment: Shipment;
  company?: CargoCompany;
}

export default function ShipmentLabel({ shipment, company }: ShipmentLabelProps) {
  return (
    <div className="rounded-xl border-2 border-foreground-900 bg-background-50 p-4">
      <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-foreground-300 pb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-500">Gönderi Etiketi</p>
          <p className="mt-0.5 font-heading text-base font-bold text-foreground-950">{company?.name ?? "Kargo"}</p>
          <p className="text-[11px] text-foreground-600">{shipment.id} · {shipment.orderId}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1 rounded-md bg-foreground-950 px-2 py-1 text-[10px] font-bold text-background-50">
            <i className="ri-truck-line" />
            {shipment.desi} DESİ
          </span>
          <p className="mt-1 text-[10px] text-foreground-500">{shipment.packages} paket</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-wide text-foreground-400">Alıcı</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground-950">{shipment.customer}</p>
          <p className="text-foreground-700">{shipment.phone}</p>
          <p className="mt-1 leading-relaxed text-foreground-600">
            {shipment.address}
            <br />
            {shipment.city}
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wide text-foreground-400">Gönderici</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground-950">Brothers Teknoloji</p>
          <p className="text-foreground-700">İkitelli OSB, Başakşehir / İstanbul</p>
          <p className="mt-1 text-foreground-600">444 9 999 · destek@brothersteknoloji.com</p>
        </div>
      </div>

      <div className="mt-3 rounded-md bg-white px-2 py-2">
        <Barcode value={shipment.tracking} height="56px" textClassName="text-[12px]" />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-sm font-bold tracking-wider text-foreground-950">{shipment.tracking}</p>
        {shipment.codAmount > 0 ? (
          <p className="rounded-md border border-foreground-900 px-2 py-1 text-[11px] font-bold text-foreground-950">
            KAPIDA ÖDEME · {formatPrice(shipment.codAmount)}
          </p>
        ) : (
          <p className="rounded-md bg-background-100 px-2 py-1 text-[11px] font-semibold text-foreground-700">
            ÖDEME ALINDI
          </p>
        )}
      </div>

      {shipment.note && (
        <p className="mt-2 border-t border-dashed border-foreground-300 pt-2 text-[10px] text-foreground-600">
          Not: {shipment.note}
        </p>
      )}
    </div>
  );
}