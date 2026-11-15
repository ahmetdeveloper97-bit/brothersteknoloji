import { products } from "@/lib/catalog";
import type { Product } from "@/types/store";

/**
 * Vitrin seçkileri: öne çıkan ve yeni gelen ürünler tek bir kategori ya da
 * markaya yığılmasın diye ana kategori ailesi, alt kategori ve marka
 * çeşitliliği birlikte gözetilerek seçilir. Yeni ürünler kataloğa en son
 * eklenen ürünlerden gelir.
 */

const discountRate = (product: Product): number =>
  product.oldPrice && product.oldPrice > product.price
    ? (product.oldPrice - product.price) / product.oldPrice
    : 0;

const featuredScore = (product: Product): number =>
  product.rating * 12 + Math.min(product.reviewCount, 300) / 24 + discountRate(product) * 40;

/** Ana kategori ailesi: kategori kimliğinin ilk parçası. */
const familyOf = (product: Product): string => product.category.split("-")[0] ?? product.category;

interface DiversityRules {
  perFamily: number;
  perCategory: number;
  perBrand: number;
}

const pickDiverse = (source: Product[], limit: number, rules: DiversityRules): Product[] => {
  const picked: Product[] = [];
  const familyCount = new Map<string, number>();
  const categoryCount = new Map<string, number>();
  const brandCount = new Map<string, number>();

  const passes: DiversityRules[] = [
    rules,
    {
      perFamily: rules.perFamily + 1,
      perCategory: rules.perCategory + 1,
      perBrand: rules.perBrand + 1,
    },
    {
      perFamily: rules.perFamily + 3,
      perCategory: rules.perCategory + 2,
      perBrand: rules.perBrand + 3,
    },
  ];

  for (const pass of passes) {
    for (const product of source) {
      if (picked.length >= limit) break;
      if (picked.includes(product)) continue;
      const family = familyOf(product);
      const inFamily = familyCount.get(family) ?? 0;
      const inCategory = categoryCount.get(product.category) ?? 0;
      const inBrand = brandCount.get(product.brand) ?? 0;
      if (inFamily >= pass.perFamily || inCategory >= pass.perCategory || inBrand >= pass.perBrand) {
        continue;
      }
      picked.push(product);
      familyCount.set(family, inFamily + 1);
      categoryCount.set(product.category, inCategory + 1);
      brandCount.set(product.brand, inBrand + 1);
    }
    if (picked.length >= limit) break;
  }

  return picked;
};

const catalog = products as Product[];

const featuredSource = [...catalog].sort((a, b) => featuredScore(b) - featuredScore(a));

export const featuredProducts: Product[] = pickDiverse(featuredSource, 15, {
  perFamily: 2,
  perCategory: 1,
  perBrand: 1,
});

/** Kataloğa en son eklenen ürünler önce gelir. */
const newestSource = [...catalog].reverse();

/**
 * Yeni ürünleri ana kategori ailelerine böler ve sırayla harmanlar.
 * Böylece "Yeni Gelenler" vitrini en son eklenen 2-3 grupta sıkışmaz.
 */
const interleaveByFamily = (source: Product[]): Product[] => {
  const families = new Map<string, Product[]>();
  source.forEach((product) => {
    const family = familyOf(product);
    const bucket = families.get(family) ?? [];
    bucket.push(product);
    families.set(family, bucket);
  });

  const queues = Array.from(families.values());
  const longest = queues.reduce((max, queue) => Math.max(max, queue.length), 0);
  const merged: Product[] = [];
  for (let index = 0; index < longest; index += 1) {
    queues.forEach((queue) => {
      const product = queue[index];
      if (product) merged.push(product);
    });
  }
  return merged;
};

export const newArrivalProducts: Product[] = pickDiverse(interleaveByFamily(newestSource), 12, {
  perFamily: 1,
  perCategory: 1,
  perBrand: 1,
});