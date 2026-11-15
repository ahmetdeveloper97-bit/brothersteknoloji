import type { Product, ProductVariantGroup, ProductVariantOption } from "@/types/store";

/**
 * Ürün varyantları.
 *
 * Kural: yalnızca gerçekten var olan seçenekler gösterilir.
 * - Renk seçenekleri fiyatı DEĞİŞTİRMEZ (aynı ürün, aynı fiyat).
 * - Kapasite / model / paket gibi uydurma gruplar oluşturulmaz.
 * - Seçeneği olmayan ürünler tek SKU olarak, tek fiyat ve tek stokla listelenir.
 */

export interface VariantSelection {
  [groupId: string]: string;
}

const hexPalette: Record<string, string> = {
  Siyah: "#1f2937",
  "Uzay Grisi": "#6b7280",
  Gümüş: "#d1d5db",
  "Platin Gümüş": "#c8ccd2",
  Beyaz: "#f8fafc",
  Grafit: "#374151",
  "Gece Mavisi": "#22314f",
  "Gece Yarısı": "#23262b",
  "Yıldız Işığı": "#f0e9dd",
  Lacivert: "#1e3a8a",
  Mavi: "#2563eb",
  Kırmızı: "#dc2626",
  Yeşil: "#15803d",
  Bej: "#e7e5e4",
  Turuncu: "#ea580c",
};

/**
 * Üreticinin gerçekten sunduğu renk seçenekleri.
 * Burada adı geçmeyen ürünlerde renk varyantı yoktur (tek renk satılır).
 */
const productColors: Record<string, string[]> = {
  // Sony WH-1000XM5 — siyah, platin gümüş, gece mavisi
  c604: ["Siyah", "Platin Gümüş", "Gece Mavisi"],
  // Apple Watch SE 2 44mm — gece yarısı, yıldız ışığı, gümüş
  c601: ["Gece Yarısı", "Yıldız Işığı", "Gümüş"],
  // Garmin Venu 3 — siyah, gümüş
  c602: ["Siyah", "Gümüş"],
  // JBL Charge 5 — siyah, mavi, kırmızı
  c603: ["Siyah", "Mavi", "Kırmızı"],
};

/** Kimlikten sabit bir sayı üretir (0..mod-1). */
const hash = (input: string, mod: number): number => {
  let value = 0;
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 31 + input.charCodeAt(index)) % 1000003;
  }
  return value % mod;
};

/** Ürün için geçerli stok adedi (yönetici güncellemesi varsa o esas alınır). */
export const resolvedStock = (product: Product): number => {
  if (typeof product.stock === "number") return product.stock;
  if (!product.inStock) return 0;
  return hash(`${product.id}-stock`, 26) + 8;
};

const optionStock = (product: Product, key: string): number => {
  if (!product.inStock) return 0;
  if (typeof product.stock === "number") return product.stock;
  return hash(`${product.id}-${key}`, 24) + 4;
};

const cache = new Map<string, ProductVariantGroup[]>();

export const getVariantGroups = (product: Product): ProductVariantGroup[] => {
  if (product.variants && product.variants.length > 0) return product.variants;
  const cached = cache.get(product.id);
  if (cached) return cached;

  const groups: ProductVariantGroup[] = [];
  const colors = productColors[product.id] ?? [];

  if (colors.length > 1) {
    groups.push({
      id: "renk",
      name: "Renk",
      type: "color",
      options: colors.map<ProductVariantOption>((label, index) => ({
        id: `renk-${index + 1}`,
        label,
        hex: hexPalette[label] ?? "#9ca3af",
        // Renk seçimi fiyatı değiştirmez.
        priceDelta: 0,
        stock: optionStock(product, `renk-${index + 1}`),
      })),
    });
  }

  cache.set(product.id, groups);
  return groups;
};

/** Varsayılan seçim: her grupta stoğu olan ilk seçenek. */
export const defaultSelection = (groups: ProductVariantGroup[]): VariantSelection => {
  const selection: VariantSelection = {};
  groups.forEach((group) => {
    const available = group.options.find((option) => option.stock > 0) ?? group.options[0];
    if (available) selection[group.id] = available.id;
  });
  return selection;
};

const optionOf = (group: ProductVariantGroup, id: string | undefined): ProductVariantOption | undefined =>
  group.options.find((option) => option.id === id) ?? group.options[0];

export const selectionLabel = (groups: ProductVariantGroup[], selection: VariantSelection): string =>
  groups
    .map((group) => optionOf(group, selection[group.id])?.label)
    .filter((label): label is string => Boolean(label))
    .join(" · ");

export const selectionPrice = (
  product: Product,
  groups: ProductVariantGroup[],
  selection: VariantSelection
): number =>
  groups.reduce((price, group) => {
    const option = optionOf(group, selection[group.id]);
    return price + (option?.priceDelta ?? 0);
  }, product.price);

/**
 * Seçili kombinasyonun stoğu.
 * Ürünün varyantı yoksa `fallback` (ürünün kendi stoğu) döner.
 */
export const selectionStock = (
  groups: ProductVariantGroup[],
  selection: VariantSelection,
  fallback = 0
): number => {
  const stocks = groups
    .map((group) => optionOf(group, selection[group.id])?.stock)
    .filter((stock): stock is number => typeof stock === "number");
  if (stocks.length === 0) return fallback;
  return Math.min(...stocks);
};

export const totalStock = (product: Product): number => {
  const groups = getVariantGroups(product);
  if (groups.length === 0) return resolvedStock(product);
  return selectionStock(groups, defaultSelection(groups), resolvedStock(product));
};

export const defaultVariantPrice = (product: Product): number => {
  const groups = getVariantGroups(product);
  if (groups.length === 0) return product.price;
  return selectionPrice(product, groups, defaultSelection(groups));
};

/** Stok durumunu okunabilir metne çevirir. */
export const stockLabel = (stock: number): string => {
  if (stock <= 0) return "Stokta yok";
  if (stock <= 5) return `Son ${stock} adet`;
  return `Stokta ${stock} adet`;
};