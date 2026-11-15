import { readJson, writeJson } from "@/lib/persistent";

export type LabelFormatId = "100x150" | "100x100" | "100x50";
export type PrinterType = "thermal" | "a4";

const PREFS_KEY = "eticaretv8_label_printer_prefs";

export interface LabelPrinterPrefs {
  printer: PrinterType;
  formatId: LabelFormatId;
  copies: number;
}

const defaultPrefs: LabelPrinterPrefs = { printer: "thermal", formatId: "100x150", copies: 1 };

/** Yazıcı tercihleri cihazda saklanır; her etikette aynı ayarı yeniden seçmek gerekmez. */
export const loadLabelPrinterPrefs = (): LabelPrinterPrefs => {
  const stored = readJson<Partial<LabelPrinterPrefs>>(PREFS_KEY, {});
  return { ...defaultPrefs, ...stored };
};

export const saveLabelPrinterPrefs = (prefs: LabelPrinterPrefs): void => {
  writeJson(PREFS_KEY, prefs);
};

export interface LabelFormat {
  id: LabelFormatId;
  label: string;
  widthMm: number;
  heightMm: number;
  hint: string;
}

export const LABEL_FORMATS: LabelFormat[] = [
  {
    id: "100x150",
    label: "100 × 150 mm",
    widthMm: 100,
    heightMm: 150,
    hint: "Standart termal kargo etiketi (10 × 15 cm)",
  },
  {
    id: "100x100",
    label: "100 × 100 mm",
    widthMm: 100,
    heightMm: 100,
    hint: "Kompakt etiket — adres ve barkod",
  },
  {
    id: "100x50",
    label: "100 × 50 mm",
    widthMm: 100,
    heightMm: 50,
    hint: "Sadece barkod şeridi — ürün/raf etiketi",
  },
];

export const labelFormat = (id: LabelFormatId): LabelFormat =>
  LABEL_FORMATS.find((item) => item.id === id) ?? LABEL_FORMATS[0];

const PAGE_STYLE_ID = "shipping-label-page-style";

/**
 * Barkod yazıcı için sayfa ölçüsünü ayarlar ve tarayıcı yazdırma penceresini açar.
 * Etiket içeriği `label-print-root` portalinde durur; yazdırma sırasında yalnızca o görünür.
 */
export const printShippingLabel = (printer: PrinterType, formatId: LabelFormatId): void => {
  const size = labelFormat(formatId);
  const pageSize = printer === "a4" ? "A4" : `${size.widthMm}mm ${size.heightMm}mm`;
  const margin = printer === "a4" ? "8mm" : "0";

  document.getElementById(PAGE_STYLE_ID)?.remove();
  const style = document.createElement("style");
  style.id = PAGE_STYLE_ID;
  style.textContent = `@media print { @page { size: ${pageSize}; margin: ${margin}; } }`;
  document.head.appendChild(style);

  const cleanup = () => {
    document.body.classList.remove("label-printing");
    document.getElementById(PAGE_STYLE_ID)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  document.body.classList.add("label-printing");
  window.addEventListener("afterprint", cleanup);

  window.setTimeout(() => {
    window.print();
    window.setTimeout(cleanup, 1200);
  }, 150);
};