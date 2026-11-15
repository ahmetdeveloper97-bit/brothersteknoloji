import type { Product } from "@/types/store";
import { readJson, writeJson } from "@/lib/persistent";

/** Yönetici panelinden yapılan ürün güncellemeleri (kalıcı). */
export interface ProductOverride {
  name?: string;
  brand?: string;
  price?: number;
  oldPrice?: number | null;
  stock?: number;
  inStock?: boolean;
  hidden?: boolean;
}

const OVERRIDES_KEY = "eticaretv8_admin_product_overrides";
const CUSTOM_KEY = "eticaretv8_admin_custom_products";

export const PRODUCT_ADMIN_EVENT = "eticaretv8:admin-products-updated";

const notify = (): void => {
  try {
    window.dispatchEvent(new Event(PRODUCT_ADMIN_EVENT));
  } catch {
    /* event may be unavailable */
  }
};

export const loadProductOverrides = (): Record<string, ProductOverride> => {
  const stored = readJson<Record<string, ProductOverride> | null>(OVERRIDES_KEY, null);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return {};
  return stored;
};

/** Kaydedilen alanları ürüne uygular; patch null ise ürün eski haline döner. */
export const saveProductOverride = (id: string, patch: ProductOverride | null): void => {
  const map = { ...loadProductOverrides() };
  if (patch === null) {
    delete map[id];
  } else {
    map[id] = { ...(map[id] ?? {}), ...patch };
  }
  writeJson(OVERRIDES_KEY, map);
  notify();
};

export const isProductHidden = (id: string): boolean => Boolean(loadProductOverrides()[id]?.hidden);

export const loadCustomProducts = (): Product[] => {
  const stored = readJson<Product[] | null>(CUSTOM_KEY, null);
  return Array.isArray(stored) ? stored : [];
};

export const upsertCustomProduct = (product: Product): void => {
  const list = loadCustomProducts();
  const index = list.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    list[index] = product;
  } else {
    list.unshift(product);
  }
  writeJson(CUSTOM_KEY, list);
  notify();
};

export const removeCustomProduct = (id: string): void => {
  const list = loadCustomProducts().filter((item) => item.id !== id);
  writeJson(CUSTOM_KEY, list);
  notify();
};

const applyOverride = (product: Product, override: ProductOverride | undefined): Product => {
  if (!override) return product;
  const next: Product = { ...product };
  if (override.name) next.name = override.name;
  if (override.brand) next.brand = override.brand;
  if (typeof override.price === "number") next.price = override.price;
  if (override.oldPrice !== undefined) next.oldPrice = override.oldPrice;
  if (typeof override.stock === "number") next.stock = override.stock;
  if (typeof override.inStock === "boolean") next.inStock = override.inStock;
  return next;
};

/**
 * Panelden eklenen ürünleri ve yapılan güncellemeleri kataloğa uygular.
 * Silinen (gizlenen) ürünler listeden çıkarılır.
 */
export const applyAdminProducts = (base: Product[]): Product[] => {
  const overrides = loadProductOverrides();
  const baseUpdated = base
    .map((product) => applyOverride(product, overrides[product.id]))
    .filter((product) => !overrides[product.id]?.hidden);
  return [...loadCustomProducts(), ...baseUpdated];
};