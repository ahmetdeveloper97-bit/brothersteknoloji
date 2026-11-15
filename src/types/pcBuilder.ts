import type { Product } from "@/types/store";

/** Sistem toplama ekranındaki bileşen yuvaları */
export type PcSlotId =
  | "cpu"
  | "mainboard"
  | "ram"
  | "gpu"
  | "storage"
  | "case"
  | "psu"
  | "cooler"
  | "monitor"
  | "keyboard"
  | "os";

/** Sistem toplama bileşeni: katalog ürünü + uyumluluk bilgileri */
export interface PcPart extends Product {
  slot: PcSlotId;
  /** İşlemci / anakart soketi (LGA1700, AM5, AM4) */
  socket?: string;
  /** Soğutucunun desteklediği soketler */
  sockets?: string[];
  /** İşlemcinin desteklediği bellek tipleri */
  memorySupport?: Array<"DDR4" | "DDR5">;
  /** Anakartın bellek tipi */
  memoryType?: "DDR4" | "DDR5";
  /** Anakartın form faktörü */
  formFactor?: string;
  /** Kasanın desteklediği anakart form faktörleri */
  supportedFormFactors?: string[];
  /** İşlemci TDP değeri (W) */
  tdp?: number;
  /** Güç kaynağı watt değeri */
  wattage?: number;
  /** Ekran kartı için önerilen güç kaynağı (W) */
  requiredWatt?: number;
  /** Ekran kartı uzunluğu (mm) */
  lengthMm?: number;
  /** Kasanın desteklediği maksimum ekran kartı uzunluğu (mm) */
  maxLengthMm?: number;
  /** Soğutucu yüksekliği (mm) */
  heightMm?: number;
  /** Kasanın desteklediği maksimum soğutucu yüksekliği (mm) */
  maxHeightMm?: number;
  /** İşlemci nesli / seri bilgisi */
  generation?: string;
}

export interface PcSlot {
  id: PcSlotId;
  name: string;
  icon: string;
  hint: string;
  required: boolean;
}

export interface PcSelection {
  [slotId: string]: string;
}

export interface PcIssue {
  slot: PcSlotId;
  message: string;
}