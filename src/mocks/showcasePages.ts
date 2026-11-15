import type { ShowcasePageKey } from "@/types/showcasePage";

interface DefaultShowcasePage {
  title: string;
  description: string;
  imageUrl: string;
  startTime?: string;
  endTime?: string;
  scheduleEnabled?: boolean;
}

export const defaultShowcasePages: Record<ShowcasePageKey, DefaultShowcasePage> = {
  gunun: {
    title: "Günün Ürünleri",
    description:
      "Bugün için seçtiğimiz, indirim oranı en yüksek ürünler. Stoklar ve fiyatlar gün sonuna kadar geçerlidir.",
    imageUrl:
      "https://readdy.ai/api/search-image?query=Wide%20e-commerce%20campaign%20banner%20with%20a%20glossy%20clay%20rendered%20golden%20sun%20rising%20above%20a%20red%20discount%20price%20tag%2C%20warm%20cream%20gradient%20background%2C%20soft%20studio%20lighting%2C%20minimal%20premium%20composition%20with%20generous%20empty%20space%20on%20the%20left%2C%20subtle%20sparkles%2C%20high%20detail%20product%20marketing%20artwork&width=1600&height=480&seq=showcase-gunun-banner-2026&orientation=landscape",
  },
  haftanin: {
    title: "Haftanın Ürünleri",
    description:
      "Bu hafta müşterilerimizin en çok tercih ettiği, yüksek puan alan ürünler. Her hafta yeniden seçilir.",
    imageUrl:
      "https://readdy.ai/api/search-image?query=Wide%20e-commerce%20banner%20with%20clay%20rendered%20weekly%20calendar%20page%20and%20a%20wrapped%20gift%20box%20with%20golden%20star%2C%20soft%20lavender%20gradient%20background%2C%20gentle%20studio%20light%2C%20minimal%20premium%20composition%20with%20empty%20space%20on%20the%20left%2C%20subtle%20sparkles%2C%20high%20detail%20marketing%20artwork&width=1600&height=480&seq=showcase-haftanin-banner-2026&orientation=landscape",
  },
  kampanya: {
    title: "Kampanyalar",
    description:
      "Seçili ürünlerde indirimli fiyatlar. Kampanya stokları sınırlıdır, ürünler tükendiğinde liste güncellenir.",
    imageUrl:
      "https://readdy.ai/api/search-image?query=Wide%20shopping%20campaign%20banner%20with%20glossy%20red%20percent%20badge%2C%20shopping%20bag%20and%20floating%20confetti%20on%20coral%20gradient%20background%2C%20soft%20shadows%2C%20minimal%20premium%20marketing%20composition%20with%20empty%20space%20on%20the%20left%2C%20high%20detail%20clay%20render&width=1600&height=480&seq=showcase-kampanya-banner-2026&orientation=landscape",
  },
  gece: {
    title: "Gece İndirimi",
    description:
      "Saat 23:59'da açılan gece fırsatları. Bu sayfadaki indirimli fiyatlar sabah 06:00'ya kadar geçerlidir.",
    imageUrl:
      "https://readdy.ai/api/search-image?query=Wide%20night%20sale%20banner%20with%20glowing%20crescent%20moon%20above%20a%20glossy%20red%20discount%20tag%20surrounded%20by%20tiny%20stars%2C%20deep%20navy%20blue%20gradient%20sky%20background%20with%20soft%20cyan%20light%2C%20minimal%20premium%20marketing%20composition%20with%20empty%20space%20on%20the%20left%2C%20high%20detail%20clay%20render&width=1600&height=480&seq=showcase-gece-banner-2026&orientation=landscape",
    startTime: "23:59",
    endTime: "06:00",
    scheduleEnabled: true,
  },
  avantajli: {
    title: "Avantajlı Ürünler",
    description:
      "Bütçe dostu, stokta olan ve yüksek puanlı ürünler. Fiyat ile performansı birlikte arayanlar için hazırlandı.",
    imageUrl:
      "https://readdy.ai/api/search-image?query=Wide%20budget%20deals%20banner%20with%20purple%20price%20tags%20and%20coupon%20cards%20floating%20on%20lilac%20gradient%20background%2C%20soft%20studio%20light%2C%20minimal%20premium%20marketing%20composition%20with%20empty%20space%20on%20the%20left%2C%20subtle%20sparkles%2C%20high%20detail%20clay%20render&width=1600&height=480&seq=showcase-avantajli-banner-2026&orientation=landscape",
  },
};