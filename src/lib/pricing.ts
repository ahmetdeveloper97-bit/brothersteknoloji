import type { Product } from "@/types/store";

/**
 * Site geneli fiyat kuralı.
 * - 10.000 TL altındaki ürünlere %75 zam
 * - 10.000 TL ve üzerindeki ürünlere %100 zam
 * Oran, ürünün kural öncesi liste fiyatına göre belirlenir.
 */
export const PRICE_RULE = {
  threshold: 10000,
  belowRate: 0.75,
  aboveRate: 1,
};

const roundPrice = (value: number): number => Math.round(value);

/** Kural öncesi fiyata göre uygulanacak zam oranını döndürür (0.75 = %75). */
export const markupRateFor = (price: number): number =>
  price < PRICE_RULE.threshold ? PRICE_RULE.belowRate : PRICE_RULE.aboveRate;

/** Tek bir fiyata kuralı uygular. */
export const applyMarkup = (price: number): number =>
  roundPrice(price * (1 + markupRateFor(price)));

/**
 * Ürünün fiyatını, varsa eski (üstü çizili) fiyatını ve varyant fiyat farklarını
 * aynı oranla günceller. Böylece indirim etiketleri tutarlı kalır.
 */
export const applyPriceRule = <T extends Product>(product: T): T => {
  const factor = 1 + markupRateFor(product.price);

  return {
    ...product,
    price: roundPrice(product.price * factor),
    oldPrice:
      product.oldPrice !== null && product.oldPrice !== undefined
        ? roundPrice(product.oldPrice * factor)
        : null,
    variants: product.variants?.map((group) => ({
      ...group,
      options: group.options.map((option) => ({
        ...option,
        priceDelta: roundPrice(option.priceDelta * factor),
      })),
    })),
  };
};