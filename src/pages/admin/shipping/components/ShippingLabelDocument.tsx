import Barcode from "@/components/base/Barcode";
import { formatPrice } from "@/lib/format";
import { labelFormat, type LabelFormatId } from "@/lib/labelPrint";
import type { CargoCompany, Shipment } from "@/types/shipping";

interface ShippingLabelDocumentProps {
  shipment: Shipment;
  company?: CargoCompany;
  formatId: LabelFormatId;
}

const SENDER_NAME = "Brothers Teknoloji";
const SENDER_ADDRESS = "İkitelli OSB, Başakşehir / İstanbul";
const SENDER_CONTACT = "444 9 999 · destek@brothersteknoloji.com";

export default function ShippingLabelDocument({ shipment, company, formatId }: ShippingLabelDocumentProps) {
  const format = labelFormat(formatId);
  const strip = formatId === "100x50";
  const compact = formatId === "100x100";
  const barcodeHeight = strip ? "30px" : compact ? "80px" : "132px";
  const padding = strip ? "3mm" : "4mm";

  return (
    <div
      className="ship-label box-border flex flex-col overflow-hidden rounded-md border border-foreground-900"
      style={{ width: `${format.widthMm}mm`, height: `${format.heightMm}mm`, padding }}
    >
      {!strip && (
        <div className="flex items-start justify-between gap-2 border-b border-foreground-900 pb-1.5">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold leading-tight text-foreground-950">{SENDER_NAME}</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground-500">
              Kargo Gönderi Etiketi
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 rounded bg-foreground-950 px-1.5 py-0.5 text-[9px] font-bold uppercase text-background-50">
              {company?.short ?? "KRG"}
            </span>
            <p className="mt-0.5 text-[9px] font-semibold text-foreground-700">{shipment.desi} desi</p>
          </div>
        </div>
      )}

      <div className={strip ? "mt-0" : compact ? "mt-1.5" : "mt-2"}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-foreground-500">Alıcı</p>
            <p className="truncate text-[15px] font-extrabold leading-tight text-foreground-950">{shipment.customer}</p>
            {!strip && <p className="text-[11px] font-semibold text-foreground-800">{shipment.phone}</p>}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-foreground-500">Sipariş</p>
            <p className="font-mono text-[10px] font-bold text-foreground-900">{shipment.orderId}</p>
          </div>
        </div>

        {!strip && (
          <p
            className={`mt-1 leading-snug text-foreground-800 ${compact ? "line-clamp-2 text-[10px]" : "text-[11px]"}`}
          >
            {shipment.address}
            <br />
            <span className="font-bold text-foreground-950">{shipment.city}</span>
          </p>
        )}

        {strip && (
          <p className="mt-0.5 truncate text-[9px] text-foreground-700">
            {shipment.address} · {shipment.city}
          </p>
        )}
      </div>

      <div className={`${strip ? "mt-1" : "mt-2"} flex flex-1 flex-col justify-center`}>
        <Barcode
          value={shipment.tracking}
          height={barcodeHeight}
          showText={!strip}
          wideRatio={3}
          textClassName={compact ? "text-[11px]" : "text-[13px]"}
        />
        {strip && (
          <p className="mt-0.5 text-center font-mono text-[10px] font-bold tracking-[0.14em] text-foreground-950">
            {shipment.tracking}
          </p>
        )}
      </div>

      {!strip && (
        <div className="mt-1.5 flex items-end justify-between gap-2 border-t border-dashed border-foreground-400 pt-1.5">
          <div className="min-w-0 flex-1 text-[9px] leading-snug text-foreground-600">
            <p className="truncate font-semibold text-foreground-800">
              Gönderen: {SENDER_NAME} · {SENDER_ADDRESS}
            </p>
            {!compact && <p className="truncate">{SENDER_CONTACT}</p>}
            <p className="truncate">
              {shipment.date} · {shipment.packages} paket · {company?.name ?? "Kargo"}
            </p>
          </div>
          <div className="shrink-0 text-right">
            {shipment.codAmount > 0 ? (
              <p className="rounded border border-foreground-900 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground-950">
                KAPIDA ÖDEME: {formatPrice(shipment.codAmount)}
              </p>
            ) : (
              <p className="rounded bg-foreground-100 px-1.5 py-0.5 text-[10px] font-bold text-foreground-800">
                ÖDEME ALINDI
              </p>
            )}
            {!compact && shipment.note && (
              <p className="mt-0.5 line-clamp-1 max-w-[42mm] text-[8px] text-foreground-500">Not: {shipment.note}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}