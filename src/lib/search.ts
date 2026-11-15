import type { Product } from "@/types/store";

/**
 * Türkçe karakterleri sadeleştirir. "Dizüstü" -> "dizustu", "İstanbul" -> "istanbul".
 * Böylece kullanıcı Türkçe harfleri yazmasa da ürünü bulabilir.
 */
const TR_FOLD: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

export const normalizeSearchText = (value: string): string =>
  value
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşüâîû]/g, (character) => TR_FOLD[character] ?? character)
    .replace(/[^a-z0-9\s+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Ürün için aranabilir metni üretir: ad, marka, açıklama, etiket, teknik özellik ve kategori. */
export const buildProductHaystack = (product: Product, categoryName?: string): string => {
  const parts: string[] = [
    product.name,
    product.brand,
    product.description ?? "",
    categoryName ?? "",
  ];

  (product.tags ?? []).forEach((tag) => {
    if (tag?.label) parts.push(tag.label);
  });

  (product.specs ?? []).forEach((spec) => {
    if (spec?.label) parts.push(spec.label);
    if (spec?.value) parts.push(spec.value);
  });

  return normalizeSearchText(parts.join(" "));
};

export const splitSearchTerms = (query: string): string[] =>
  normalizeSearchText(query).split(" ").filter(Boolean);

/** Tüm kelimeler haystack içinde geçiyorsa eşleşir (kelime sırası önemsiz). */
export const matchesSearch = (haystack: string, terms: string[]): boolean => {
  if (terms.length === 0) return true;
  return terms.every((term) => haystack.includes(term));
};

export interface ProductSearchIndex {
  product: Product;
  haystack: string;
}

export const buildSearchIndex = (
  list: Product[],
  categoryNameById?: Map<string, string>,
): ProductSearchIndex[] =>
  list.map((product) => ({
    product,
    haystack: buildProductHaystack(product, categoryNameById?.get(product.category)),
  }));

export interface SearchResult {
  product: Product;
  score: number;
}

/** Sorguya göre sıralı sonuç listesi: ada tam eşleşme ve baştan eşleşme öne çıkar. */
export const searchProducts = (
  index: ProductSearchIndex[],
  query: string,
  limit = 8,
): SearchResult[] => {
  const terms = splitSearchTerms(query);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  index.forEach((entry) => {
    if (!matchesSearch(entry.haystack, terms)) return;
    const name = normalizeSearchText(entry.product.name);
    const brand = normalizeSearchText(entry.product.brand);
    const joined = terms.join(" ");

    let score = 0;
    if (name === joined) score += 120;
    if (name.startsWith(joined)) score += 80;
    if (name.includes(joined)) score += 40;
    if (brand === joined) score += 35;
    if (brand.startsWith(joined)) score += 20;
    if (entry.product.inStock) score += 6;
    score += Math.min(entry.product.rating, 5);

    results.push({ product: entry.product, score });
  });

  results.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "tr"));
  return results.slice(0, limit);
};