export interface ProductTag {
  label: string;
  tone: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export type ProductVariantType = "color" | "capacity";

export interface ProductVariantOption {
  id: string;
  label: string;
  /** Renk seçenekleri için gösterilecek renk kodu */
  hex?: string;
  /** Ürünün temel fiyatına eklenecek tutar */
  priceDelta: number;
  stock: number;
}

export interface ProductVariantGroup {
  id: string;
  name: string;
  type: ProductVariantType;
  options: ProductVariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  image: string;
  tags: ProductTag[];
  description?: string;
  specs?: ProductSpec[];
  /** Toplam stok adedi (varyant yoksa kullanılır) */
  stock?: number;
  variants?: ProductVariantGroup[];
}

export interface CartLine {
  productId: string;
  quantity: number;
  /** Seçilen varyantın okunabilir etiketi (örn. "Siyah · 16 GB / 512 GB") */
  variantLabel?: string;
  /** Sepete eklendiği andaki birim fiyat */
  unitPrice?: number;
}

export interface StoreReview {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  product: string;
}

export type OrderStatus = "Hazırlanıyor" | "Kargoda" | "Teslim Edildi" | "İptal";

export interface OrderLine {
  name: string;
  brand: string;
  image: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: OrderStatus;
  payment: string;
  address: string;
  city: string;
  cargo: string;
  tracking: string;
  note: string;
  lines: OrderLine[];
  /** Sunucudaki sipariş numarası (canlı kayıtlar için) */
  orderNo?: string;
  /** Kaydın kaynağı: canlı ödeme veya bu tarayıcıda tamamlanan ödeme */
  source?: "live" | "local";
  /** Kalem detayı olmayan kayıtlar için doğrudan tutar */
  amount?: number;
  /** ISO tarih (grafik ve sıralama için) */
  createdAt?: string;
}