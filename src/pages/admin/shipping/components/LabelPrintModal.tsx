import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "@/components/base/Modal";
import { Field } from "@/components/base/AdminUI";
import { logActivity } from "@/lib/activity";
import { printerTestBarcode } from "@/lib/barcode";
import {
  LABEL_FORMATS,
  labelFormat,
  loadLabelPrinterPrefs,
  printShippingLabel,
  saveLabelPrinterPrefs,
  type LabelFormatId,
  type PrinterType,
} from "@/lib/labelPrint";
import ShippingLabelDocument from "@/pages/admin/shipping/components/ShippingLabelDocument";
import type { CargoCompany, Shipment } from "@/types/shipping";

interface LabelPrintModalProps {
  shipments: Shipment[];
  companies: CargoCompany[];
  onClose: () => void;
}

const selectClass =
  "box-border h-10 w-full cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-sm text-foreground-900 outline-none focus:border-primary-500";

export default function LabelPrintModal({ shipments, companies, onClose }: LabelPrintModalProps) {
  const [printer, setPrinter] = useState<PrinterType>(() => loadLabelPrinterPrefs().printer);
  const [formatId, setFormatId] = useState<LabelFormatId>(() => loadLabelPrinterPrefs().formatId);
  const [copies, setCopies] = useState(() => loadLabelPrinterPrefs().copies);
  const [sent, setSent] = useState(false);
  const [target, setTarget] = useState<"real" | "test">("real");

  const format = labelFormat(formatId);
  const companyOf = useMemo(() => {
    const map: Record<string, CargoCompany> = {};
    companies.forEach((company) => {
      map[company.id] = company;
    });
    return map;
  }, [companies]);

  const first = shipments[0];
  const firstCompany = first ? companyOf[first.companyId] : undefined;

  const copiesToPrint = Math.min(Math.max(1, copies || 1), 20);
  const testShipment = useMemo<Shipment | null>(() => {
    if (!first) return null;
    return {
      ...first,
      id: "TEST",
      orderId: "TEST-SIPARIS",
      customer: "TEST ETİKETİ",
      phone: "000 000 00 00",
      city: "İstanbul / Başakşehir",
      address: "Barkod yazıcı hizalama ve okunabilirlik testi",
      tracking: printerTestBarcode(),
      codAmount: 0,
      note: "Bu bir test baskısıdır, kargo gönderisi oluşturmaz.",
      history: [],
    };
  }, [first]);

  const jobs = target === "test" && testShipment ? [testShipment] : shipments;
  const printJobs = Array.from({ length: target === "test" ? 1 : copiesToPrint }).flatMap((_, copyIndex) =>
    jobs.map((shipment) => ({ shipment, key: `${shipment.id}-${shipment.tracking}-${copyIndex}` }))
  );

  const runPrint = (mode: "real" | "test") => {
    setTarget(mode);
    setSent(true);
    saveLabelPrinterPrefs({ printer, formatId, copies: copiesToPrint });
    if (mode === "real") {
      shipments.forEach((shipment) => {
        logActivity({
          category: "shipping",
          action: "Kargo etiketi yazdırdı",
          target: shipment.id,
          detail: `${shipment.orderId} · ${shipment.tracking} · ${format.label}`,
        });
      });
    }
    // Önce baskı içeriğini güncelle, ardından yazdırma penceresini aç
    window.setTimeout(() => printShippingLabel(printer, formatId), 90);
  };

  if (!first) return null;

  return (
    <>
      <Modal
        open
        title="Barkod Yazıcı"
        subtitle={`${shipments.length} gönderi · ${format.label} · Code 39 barkod`}
        icon="ri-printer-line"
        onClose={onClose}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-xs text-foreground-600">
              <i className={sent ? "ri-checkbox-circle-fill text-accent-600" : "ri-information-line"} />
              {sent ? "Yazdırma penceresi açıldı." : "Etiket, seçtiğiniz ölçüde yazıcıya gönderilir."}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => runPrint("test")}
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-test-tube-line" />
                Test Baskı
              </button>
              <button
                type="button"
                onClick={() => runPrint("real")}
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 px-4 text-xs font-semibold text-background-50 hover:from-primary-700 hover:to-primary-500"
              >
                <i className="ri-printer-cloud-line" />
                Barkod Yazıcıya Gönder
              </button>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-2">
            <Field label="Yazıcı tipi">
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-background-100 p-1">
                {(
                  [
                    { id: "thermal", label: "Termal barkod", icon: "ri-barcode-line" },
                    { id: "a4", label: "A4 / ofis", icon: "ri-file-paper-2-line" },
                  ] as Array<{ id: PrinterType; label: string; icon: string }>
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrinter(item.id)}
                    className={`flex cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                      printer === item.id
                        ? "bg-background-50 text-foreground-950 shadow-sm"
                        : "text-foreground-600 hover:text-foreground-900"
                    }`}
                  >
                    <i className={item.icon} />
                    {item.label}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Etiket ölçüsü">
              <select
                value={formatId}
                onChange={(event) => setFormatId(event.target.value as LabelFormatId)}
                className={selectClass}
              >
                {LABEL_FORMATS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground-500">{format.hint}</p>
            </Field>

            <Field label="Kopya sayısı">
              <input
                type="number"
                min={1}
                max={20}
                value={copies}
                onChange={(event) => setCopies(Number(event.target.value))}
                className={selectClass}
              />
            </Field>

            <div className="rounded-lg border border-background-200 bg-background-100 px-3 py-2.5 text-[11px] leading-relaxed text-foreground-600">
              <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground-900">
                <i className="ri-settings-3-line" />
                Yazıcı ayarı ipucu
              </p>
              Termal yazıcılarda yazdırma penceresinde <strong>Kenar boşluğu: Yok</strong> ve{" "}
              <strong>Ölçek: %100</strong> seçin. A4 yazıcıda etiket sayfaya ortalanır.
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-foreground-500">
              <span>Baskı önizleme</span>
              <span className="font-mono text-[10px] normal-case text-foreground-400">{format.label}</span>
            </p>
            <div className="max-h-[520px] overflow-auto rounded-xl border border-background-200 bg-background-200/60 p-3">
              <div className="flex justify-center">
                <div className="shadow-lg">
                  <ShippingLabelDocument shipment={first} company={firstCompany} formatId={formatId} />
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">
              Barkod, kargo firmalarının okuyabildiği Code 39 standardında üretilir ve takip numarasını
              ({first.tracking}) kodlar.
            </p>
          </div>
        </div>
      </Modal>

      {createPortal(
        <div className="label-print-root">
          <div className={printer === "a4" ? "flex flex-wrap gap-[6mm]" : ""}>
            {printJobs.map((job, index) => (
              <div
                key={job.key}
                style={{
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                  pageBreakAfter: printer === "thermal" && index < printJobs.length - 1 ? "always" : "auto",
                }}
              >
                <ShippingLabelDocument
                  shipment={job.shipment}
                  company={companyOf[job.shipment.companyId]}
                  formatId={formatId}
                />
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}