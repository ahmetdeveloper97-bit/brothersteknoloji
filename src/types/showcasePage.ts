/** Ayrı sayfası olan vitrinler */
export type ShowcasePageKey = "gunun" | "haftanin" | "kampanya" | "gece" | "avantajli";

export interface ShowcasePageSettings {
  /** Sayfa başlığı */
  title: string;
  /** Başlığın altındaki kısa açıklama */
  description: string;
  /** Sayfa üstü geniş görsel */
  imageUrl: string;
  /** Panelden elle seçilen ürünler (sıra korunur) */
  productIds: string[];
  /** Sayfa mağazada yayında mı */
  active: boolean;
  /** Saat aralığı başlangıcı (SS:DD). Gece indirimi için kullanılır. */
  startTime?: string;
  /** Saat aralığı bitişi (SS:DD). Gece indirimi için kullanılır. */
  endTime?: string;
  /** Saat kuralı uygulanacak mı */
  scheduleEnabled?: boolean;
}

export interface ShowcasePagesSettings {
  pages: Record<ShowcasePageKey, ShowcasePageSettings>;
}