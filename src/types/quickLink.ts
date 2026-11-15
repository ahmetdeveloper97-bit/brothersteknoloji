export type QuickLinkTargetType = "koleksiyon" | "kategori" | "adres";

export interface QuickLinkItem {
  id: string;
  label: string;
  /** Yuvarlak rozet görseli. Boşsa ikon gösterilir. */
  imageUrl: string;
  /** Görsel yoksa kullanılacak ikon sınıfı */
  icon: string;
  targetType: QuickLinkTargetType;
  /** Koleksiyon anahtarı, kategori slug'ı veya adres */
  target: string;
  active: boolean;
}

export interface QuickLinksSettings {
  items: QuickLinkItem[];
  /** Yeni varsayılan kısayolların bir kez eklenmesini sağlayan sürüm damgası */
  seedVersion?: number;
}