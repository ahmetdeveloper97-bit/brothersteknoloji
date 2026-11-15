import type { Product } from "@/types/store";

export type CollectionKey =
  | "gunun"
  | "haftanin"
  | "kampanya"
  | "gece"
  | "gamer-ekipmanlari"
  | "gamer-sistemler"
  | "avantajli";

export interface CollectionContext {
  /** Kişisel bilgisayarlar ağacındaki tüm kategori kimlikleri */
  pcIds: Set<string>;
}

export interface CollectionDef {
  key: CollectionKey;
  label: string;
  description: string;
  /** Koleksiyonun kendi sayfa adresi */
  path: string;
  /** Koleksiyon filtresi; sıralama da burada belirlenir */
  apply: (list: Product[], context: CollectionContext) => Product[];
}

/** İndirim oranı (0 - 1 arası). İndirim yoksa 0 döner. */
export const discountRate = (product: Product): number => {
  if (!product.oldPrice || product.oldPrice <= product.price) return 0;
  return (product.oldPrice - product.price) / product.oldPrice;
};

/** Ürünün oyun/gamer ile ilgili olup olmadığını tespit etmek için metin havuzu */
const gamerHaystack = (product: Product): string =>
  [
    product.name,
    product.brand,
    product.description ?? "",
    ...(product.specs ?? []).map((spec) => `${spec.label} ${spec.value}`),
    ...product.tags.map((tag) => tag.label),
  ].join(" ");

const GAMER_PATTERN = /gaming|gamer|oyuncu|oyun bilgisayarı|rgb|rtx/i;
const isGamer = (product: Product): boolean => GAMER_PATTERN.test(gamerHaystack(product));

const byDiscountDesc = (a: Product, b: Product): number => discountRate(b) - discountRate(a);
const byRatingDesc = (a: Product, b: Product): number =>
  b.rating - a.rating || b.reviewCount - a.reviewCount;

export const collections: Record<CollectionKey, CollectionDef> = {
  gunun: {
    key: "gunun",
    label: "Günün Ürünleri",
    description: "Bugün en yüksek indirim oranına sahip seçili ürünler.",
    path: "/gunun-urunleri",
    apply: (list) => list.filter((product) => discountRate(product) >= 0.08).sort(byDiscountDesc).slice(0, 20),
  },
  haftanin: {
    key: "haftanin",
    label: "Haftanın Ürünleri",
    description: "Bu hafta müşterilerimizin en çok tercih ettiği yüksek puanlı ürünler.",
    path: "/haftanin-urunleri",
    apply: (list) => list.filter((product) => product.rating >= 4.4).sort(byRatingDesc).slice(0, 20),
  },
  kampanya: {
    key: "kampanya",
    label: "Kampanyalar",
    description: "İndirimli fiyatlarla sunulan tüm ürünler, indirim oranına göre sıralanır.",
    path: "/kampanyalar",
    apply: (list) => list.filter((product) => discountRate(product) > 0).sort(byDiscountDesc),
  },
  "gamer-ekipmanlari": {
    key: "gamer-ekipmanlari",
    label: "Gamer Ekipmanları",
    description: "Oyuncu klavyeleri, mouse, kulaklık ve çevre birimleri.",
    path: "/kategoriler?koleksiyon=gamer-ekipmanlari",
    apply: (list, context) =>
      list
        .filter((product) => isGamer(product) && !context.pcIds.has(product.category))
        .sort(byRatingDesc),
  },
  "gamer-sistemler": {
    key: "gamer-sistemler",
    label: "Gamer Sistemler",
    description: "Yüksek kare hızı için hazır oyuncu bilgisayarları ve dizüstü modelleri.",
    path: "/kategoriler?koleksiyon=gamer-sistemler",
    apply: (list, context) =>
      list.filter((product) => isGamer(product) && context.pcIds.has(product.category)).sort(byRatingDesc),
  },
  avantajli: {
    key: "avantajli",
    label: "Avantajlı Ürünler",
    description: "Stokta olan, yüksek puanlı ve bütçe dostu ürünler.",
    path: "/avantajli-urunler",
    apply: (list) =>
      list
        .filter((product) => product.inStock && product.rating >= 4.3)
        .sort((a, b) => a.price - b.price)
        .slice(0, 24),
  },
  gece: {
    key: "gece",
    label: "Gece İndirimi",
    description: "Saat 23:59'dan sonra geçerli olan gece fırsatı ürünleri.",
    path: "/gece-indirimi",
    apply: (list) =>
      list
        .filter((product) => product.inStock && discountRate(product) > 0)
        .sort(byDiscountDesc)
        .slice(0, 24),
  },
};

export const getCollection = (value: string | null): CollectionDef | null => {
  if (!value) return null;
  return collections[value as CollectionKey] ?? null;
};

export const collectionKeys = Object.keys(collections) as CollectionKey[];