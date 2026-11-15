import type { Product } from "@/types/store";

/** Kablo ve çevirici ürünleri için ek katalog */
export const catalogCableExtra: Product[] = [
  // Ağ kablosu
  {
    id: "c617",
    slug: "cat6-patch-kablo-3m",
    name: "CAT6 UTP Patch Kablo 3 m (Mavi)",
    brand: "Ugreen",
    category: "kablo-ag",
    price: 90,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 428,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=coiled%20blue%20cat6%20ethernet%20patch%20cable%20with%20rj45%20connectors%20on%20a%20clean%20white%20studio%20surface%2C%20network%20accessory%20product%20photography%20with%20soft%20shadow%20and%20crisp%20detail&width=800&height=800&seq=c617-cat6-3m&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "CAT6 patch kablo, 1 Gbps ve üzeri hızlar için ekranlanmamış bakır iletken yapısı sunar.",
    specs: [
      { label: "Kategori", value: "CAT6 UTP" },
      { label: "Uzunluk", value: "3 m" },
      { label: "Konumlandırma", value: "RJ45 - RJ45" },
      { label: "Renk", value: "Mavi" },
    ],
  },
  {
    id: "c618",
    slug: "cat6a-patch-kablo-5m",
    name: "CAT6A S/FTP Patch Kablo 5 m (Gri)",
    brand: "Ugreen",
    category: "kablo-ag",
    price: 190,
    oldPrice: 220,
    rating: 4.6,
    reviewCount: 264,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=gray%20shielded%20cat6a%20network%20cable%20coiled%20neatly%20with%20connectors%20visible%20on%20a%20light%20neutral%20surface%2C%20networking%20cable%20product%20photography%20with%20sharp%20detail%20and%20soft%20light&width=800&height=800&seq=c618-cat6a-5m&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "CAT6A kablo, 10 Gbps hızları destekleyen çift ekranlı yapısıyla veri merkezi bağlantılarına uygundur.",
    specs: [
      { label: "Kategori", value: "CAT6A S/FTP" },
      { label: "Uzunluk", value: "5 m" },
      { label: "Hız", value: "10 Gbps" },
      { label: "Renk", value: "Gri" },
    ],
  },

  // HDMI
  {
    id: "c619",
    slug: "hdmi-2-1-kablo-2m-8k",
    name: "HDMI 2.1 Kablo 2 m 8K 60Hz Altın Kaplama",
    brand: "Ugreen",
    category: "kablo-hdmi",
    price: 240,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=braided%20hdmi%20cable%20with%20gold%20plated%20connectors%20coiled%20on%20a%20clean%20light%20gray%20studio%20surface%2C%20av%20accessory%20product%20photography%20with%20soft%20shadow%20and%20fine%20braid%20texture&width=800&height=800&seq=c619-hdmi-21-2m&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "HDMI 2.1 kablo, 8K çözünürlük ve 48 Gbps bant genişliğiyle toplantı ekranlarına bağlanır.",
    specs: [
      { label: "Standart", value: "HDMI 2.1" },
      { label: "Uzunluk", value: "2 m" },
      { label: "Bant Genişliği", value: "48 Gbps" },
      { label: "Çözünürlük", value: "8K / 60 Hz" },
    ],
  },
  {
    id: "c620",
    slug: "displayport-1-4-kablo-2m",
    name: "DisplayPort 1.4 Kablo 2 m (4K 144Hz)",
    brand: "Ugreen",
    category: "kablo-hdmi",
    price: 210,
    oldPrice: 240,
    rating: 4.5,
    reviewCount: 187,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20displayport%20cable%20with%20locking%20connectors%20coiled%20on%20a%20plain%20white%20studio%20background%2C%20computer%20accessory%20product%20photography%20with%20crisp%20detail%20and%20minimal%20styling&width=800&height=800&seq=c620-dp-14-2m&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "DisplayPort 1.4 kablo, yüksek yenileme hızlı monitörlerde kilitli konnektör yapısıyla güvenli bağlantı sağlar.",
    specs: [
      { label: "Standart", value: "DisplayPort 1.4" },
      { label: "Uzunluk", value: "2 m" },
      { label: "Çözünürlük", value: "4K / 144 Hz" },
      { label: "Ekstra", value: "Kilitli konnektör" },
    ],
  },

  // USB
  {
    id: "c621",
    slug: "usb-c-100w-kablo-2m",
    name: "USB-C - USB-C 100W Şarj Kablosu 2 m",
    brand: "Anker",
    category: "kablo-usb",
    price: 190,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 396,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=braided%20usb%20c%20to%20usb%20c%20charging%20cable%20coiled%20neatly%20on%20a%20light%20gray%20studio%20surface%2C%20premium%20charging%20accessory%20product%20photography%20with%20soft%20shadow%20and%20fine%20texture&width=800&height=800&seq=c621-usbc-100w&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "100W destekli kablo, dizüstü bilgisayarları hızlı şarj ederken veri aktarımı da yapar.",
    specs: [
      { label: "Güç", value: "100 W (20V/5A)" },
      { label: "Uzunluk", value: "2 m" },
      { label: "Veri", value: "480 Mbps" },
      { label: "Gövde", value: "Örgü kaplama" },
    ],
  },
  {
    id: "c622",
    slug: "usb-3-0-uzatma-kablo-3m",
    name: "USB 3.0 Uzatma Kablosu 3 m (A-A)",
    brand: "Ugreen",
    category: "kablo-usb",
    price: 130,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 208,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20usb%203.0%20extension%20cable%20with%20type%20a%20connectors%20coiled%20on%20a%20clean%20white%20studio%20background%2C%20computer%20cable%20product%20photography%20with%20soft%20shadow%20and%20crisp%20connectors&width=800&height=800&seq=c622-usb30-uzatma&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "USB 3.0 uzatma kablosu, yazıcı ve okuyucuların bilgisayara uzak konumlandırılmasını sağlar.",
    specs: [
      { label: "Standart", value: "USB 3.0 (5 Gbps)" },
      { label: "Uzunluk", value: "3 m" },
      { label: "Uç", value: "USB-A - USB-A" },
      { label: "Ekranlama", value: "Var" },
    ],
  },

  // Adaptör
  {
    id: "c623",
    slug: "usb-c-hdmi-adaptor-4k",
    name: "USB-C - HDMI Adaptör 4K 60Hz",
    brand: "Anker",
    category: "kablo-adaptor",
    price: 320,
    oldPrice: 360,
    rating: 4.5,
    reviewCount: 274,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20aluminium%20usb%20c%20to%20hdmi%20adapter%20on%20a%20clean%20white%20studio%20surface%2C%20tech%20accessory%20product%20photography%20with%20soft%20reflection%20and%20precise%20metallic%20detail&width=800&height=800&seq=c623-usbc-hdmi&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Adaptör, USB-C çıkışlı dizüstüleri HDMI girişli projeksiyon ve ekranlara bağlar.",
    specs: [
      { label: "Giriş", value: "USB-C" },
      { label: "Çıkış", value: "HDMI 2.0" },
      { label: "Çözünürlük", value: "4K / 60 Hz" },
      { label: "Gövde", value: "Alüminyum" },
    ],
  },
  {
    id: "c624",
    slug: "usb-c-7-in-1-coklayici",
    name: "USB-C 7-in-1 Çoklayıcı (HDMI + USB + SD)",
    brand: "Ugreen",
    category: "kablo-adaptor",
    price: 590,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 186,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=slim%20grey%20usb%20c%20hub%20with%20multiple%20ports%20and%20short%20cable%20lying%20on%20a%20light%20neutral%20surface%2C%20technology%20accessory%20product%20photography%20with%20clean%20lighting%20and%20fine%20detail&width=800&height=800&seq=c624-usbc-7in1&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "7-in-1 çoklayıcı, sunum öncesi ekran, ağ ve kart okuyucu ihtiyacını tek adaptörde toplar.",
    specs: [
      { label: "Portlar", value: "HDMI, 2× USB-A, USB-C, SD, microSD" },
      { label: "Güç", value: "100 W PD geçiş" },
      { label: "Çözünürlük", value: "4K / 30 Hz" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Güç kablosu
  {
    id: "c625",
    slug: "schuko-guc-kablosu-1-8m",
    name: "Schuko Güç Kablosu 1.8 m (16A)",
    brand: "Viko",
    category: "kablo-guc",
    price: 90,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 264,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20schuko%20power%20cable%20with%20plug%20and%20socket%20ends%20laid%20out%20on%20a%20clean%20white%20studio%20surface%2C%20electrical%20accessory%20product%20photography%20with%20soft%20shadow%20and%20crisp%20detail&width=800&height=800&seq=c625-schuko-kablo&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Topraklı güç kablosu, bilgisayar ve yazıcıların güvenli şebeke bağlantısını sağlar.",
    specs: [
      { label: "Uzunluk", value: "1.8 m" },
      { label: "Akım", value: "16 A" },
      { label: "Kesit", value: "3× 1.5 mm²" },
      { label: "Uç", value: "Schuko - IEC C13" },
    ],
  },
  {
    id: "c626",
    slug: "6-li-grup-priz-3m",
    name: "6'lı Grup Priz 3 m Kablolu (Anahtarlı)",
    brand: "Viko",
    category: "kablo-guc",
    price: 340,
    oldPrice: 380,
    rating: 4.4,
    reviewCount: 218,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20six%20socket%20power%20strip%20with%20switch%20and%20cable%20on%20a%20clean%20bright%20studio%20surface%2C%20electrical%20accessory%20product%20photography%20with%20soft%20shadow%20and%20clean%20minimal%20styling&width=800&height=800&seq=c626-grup-priz&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Grup priz, masa altındaki bilgisayar, monitör ve yazıcıyı tek noktadan besler.",
    specs: [
      { label: "Priz", value: "6× topraklı" },
      { label: "Kablo", value: "3 m" },
      { label: "Anahtar", value: "Işıklı" },
      { label: "Akım", value: "16 A" },
    ],
  },
];