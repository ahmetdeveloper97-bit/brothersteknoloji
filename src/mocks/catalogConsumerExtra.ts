import type { Product } from "@/types/store";

/** Tüketici elektroniği ve tüketim ürünleri için ek katalog */
export const catalogConsumerExtra: Product[] = [
  // Televizyon
  {
    id: "c599",
    slug: "samsung-55-crystal-uhd-tv",
    name: "Samsung 55\" Crystal UHD 4K Smart TV (UE55CU8000)",
    brand: "Samsung",
    category: "tuketici-tv",
    price: 24900,
    oldPrice: 26900,
    rating: 4.6,
    reviewCount: 214,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=55%20inch%20slim%204k%20smart%20television%20with%20thin%20bezels%20shown%20from%20the%20front%20on%20a%20light%20gray%20studio%20background%2C%20premium%20tv%20product%20photography%20with%20dark%20screen%20and%20soft%20reflection&width=800&height=800&seq=c599-samsung-55-tv&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "Crystal UHD ekran ve Tizen Smart TV platformuyla 55 inç model, toplantı odaları ve bekleme alanları için uygundur.",
    specs: [
      { label: "Ekran", value: "55\" 4K UHD" },
      { label: "Panel", value: "Crystal UHD, 60 Hz" },
      { label: "Akıllı TV", value: "Tizen, Wi-Fi" },
      { label: "Bağlantı", value: "3× HDMI, 2× USB" },
    ],
  },
  {
    id: "c600",
    slug: "lg-65-oled-evo-tv",
    name: "LG 65\" OLED evo 4K Smart TV (OLED65C4)",
    brand: "LG",
    category: "tuketici-tv",
    price: 74900,
    oldPrice: null,
    rating: 4.9,
    reviewCount: 121,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=large%2065%20inch%20oled%20television%20with%20ultra%20thin%20panel%20standing%20on%20a%20slim%20pedestal%20in%20a%20dark%20elegant%20studio%2C%20high%20end%20home%20cinema%20product%20photography%20with%20dramatic%20lighting&width=800&height=800&seq=c600-lg-oled-65&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "OLED evo paneli ve 120 Hz yenileme hızıyla C4, sunum ve video izleme deneyimini üst seviyeye taşır.",
    specs: [
      { label: "Ekran", value: "65\" 4K OLED" },
      { label: "Yenileme", value: "120 Hz" },
      { label: "İşlemci", value: "α9 AI Processor" },
      { label: "Bağlantı", value: "4× HDMI 2.1" },
    ],
  },

  // Giyilebilir
  {
    id: "c601",
    slug: "apple-watch-se-2-44mm",
    name: "Apple Watch SE 2 44mm GPS Akıllı Saat",
    brand: "Apple",
    category: "tuketici-giyilebilir",
    price: 9490,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 186,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=modern%20smartwatch%20with%20large%20rectangular%20display%20and%20sport%20band%20standing%20upright%20on%20a%20clean%20white%20studio%20background%2C%20premium%20wearable%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=c601-watch-se-2&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Watch SE 2, spor ve sağlık takibi özelliklerini uygun fiyatla sunan bir kurumsal hediye alternatifidir.",
    specs: [
      { label: "Ekran", value: "44 mm Retina" },
      { label: "Bağlantı", value: "GPS, Bluetooth 5.3" },
      { label: "Su Dayanımı", value: "50 m" },
      { label: "Pil", value: "18 saate kadar" },
    ],
  },
  {
    id: "c602",
    slug: "garmin-venu-3-akilli-saat",
    name: "Garmin Venu 3 AMOLED Akıllı Saat",
    brand: "Garmin",
    category: "tuketici-giyilebilir",
    price: 13900,
    oldPrice: 14900,
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=round%20amoled%20smartwatch%20with%20metal%20bezel%20and%20silicone%20strap%20on%20a%20light%20neutral%20background%2C%20high%20end%20fitness%20wearable%20product%20photography%20with%20fine%20detail&width=800&height=800&seq=c602-garmin-venu-3&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Venu 3, AMOLED ekranı ve 14 güne varan pil ömrüyle yoğun iş programlarında pratiklik sağlar.",
    specs: [
      { label: "Ekran", value: "1.4\" AMOLED" },
      { label: "Pil", value: "14 güne kadar" },
      { label: "Sensör", value: "Nabız, SpO2, uyku" },
      { label: "Su Dayanımı", value: "5 ATM" },
    ],
  },

  // Ses
  {
    id: "c603",
    slug: "jbl-charge-5-hoparlor",
    name: "JBL Charge 5 Taşınabilir Bluetooth Hoparlör",
    brand: "JBL",
    category: "tuketici-ses",
    price: 4290,
    oldPrice: 4590,
    rating: 4.8,
    reviewCount: 276,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=cylindrical%20portable%20bluetooth%20speaker%20with%20fabric%20mesh%20grille%20standing%20on%20a%20light%20gray%20studio%20surface%2C%20premium%20audio%20product%20photography%20with%20soft%20shadow%20and%20vibrant%20detail&width=800&height=800&seq=c603-jbl-charge-5&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "Charge 5, 20 saat pil ömrü ve IP67 korumasıyla etkinlik ve saha çalışmalarında kullanılır.",
    specs: [
      { label: "Ses", value: "20 W, stereo" },
      { label: "Pil", value: "20 saat" },
      { label: "Koruma", value: "IP67" },
      { label: "Ekstra", value: "Powerbank özelliği" },
    ],
  },
  {
    id: "c604",
    slug: "sony-wh-1000xm5-kulaklik",
    name: "Sony WH-1000XM5 Kablosuz Gürültü Engelleme Kulaklığı",
    brand: "Sony",
    category: "tuketici-ses",
    price: 11900,
    oldPrice: 12900,
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=premium%20over%20ear%20wireless%20headphones%20in%20matte%20black%20resting%20on%20a%20light%20neutral%20studio%20surface%2C%20high%20end%20audio%20product%20photography%20with%20elegant%20soft%20lighting%20and%20fine%20texture&width=800&height=800&seq=c604-sony-xm5&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "XM5, sektör lideri gürültü engellemesi ve 30 saat pil ömrüyle açık ofislerde odaklanmayı kolaylaştırır.",
    specs: [
      { label: "Tip", value: "Over-ear, ANC" },
      { label: "Pil", value: "30 saat" },
      { label: "Bağlantı", value: "Bluetooth 5.2, multipoint" },
      { label: "Şarj", value: "USB-C, hızlı şarj" },
    ],
  },

  // Akıllı ev
  {
    id: "c605",
    slug: "philips-hue-baslangic-seti",
    name: "Philips Hue White & Color Başlangıç Seti (3 Ampul + Bridge)",
    brand: "Philips",
    category: "tuketici-akilli-ev",
    price: 5490,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 128,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=three%20smart%20led%20bulbs%20with%20bridge%20hub%20arranged%20on%20a%20clean%20white%20studio%20surface%2C%20smart%20home%20lighting%20product%20photography%20with%20soft%20colorful%20accent%20glow&width=800&height=800&seq=c605-philips-hue&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Hue seti, toplantı odalarında senaryo bazlı aydınlatma ve zamanlanmış enerji tasarrufu sağlar.",
    specs: [
      { label: "İçerik", value: "3 ampul + Hue Bridge" },
      { label: "Renk", value: "16 milyon renk" },
      { label: "Bağlantı", value: "Zigbee, Wi-Fi" },
      { label: "Kontrol", value: "Uygulama, sesli asistan" },
    ],
  },
  {
    id: "c606",
    slug: "xiaomi-akilli-priz",
    name: "Xiaomi Mi Smart Akıllı Priz (Wi-Fi)",
    brand: "Xiaomi",
    category: "tuketici-akilli-ev",
    price: 490,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 318,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20compact%20smart%20plug%20with%20small%20led%20indicator%20on%20a%20clean%20white%20studio%20surface%2C%20minimal%20home%20automation%20product%20photography%20with%20soft%20shadow%20and%20crisp%20edges&width=800&height=800&seq=c606-xiaomi-priz&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Akıllı priz, cihaz bazlı enerji tüketimini ölçerek ofis giderlerinin takibini kolaylaştırır.",
    specs: [
      { label: "Bağlantı", value: "Wi-Fi 2.4 GHz" },
      { label: "Yük", value: "10 A / 2200 W" },
      { label: "Özellik", value: "Zamanlayıcı, enerji ölçümü" },
      { label: "Uyumluluk", value: "Mi Home, Alexa" },
    ],
  },

  // Fotoğraf
  {
    id: "c607",
    slug: "gopro-hero12-black",
    name: "GoPro HERO12 Black Aksiyon Kamerası",
    brand: "GoPro",
    category: "tuketici-foto",
    price: 14900,
    oldPrice: 15900,
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20action%20camera%20with%20rugged%20housing%20and%20front%20lens%20on%20a%20light%20gray%20studio%20surface%2C%20adventure%20camera%20product%20photography%20with%20crisp%20detail%20and%20soft%20shadow&width=800&height=800&seq=c607-gopro-hero12&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "HERO12, 5.3K video ve gelişmiş görüntü sabitlemeyle saha kayıtları ve tanıtım çekimlerinde kullanılır.",
    specs: [
      { label: "Video", value: "5.3K / 60 fps" },
      { label: "Sabitleme", value: "HyperSmooth 6.0" },
      { label: "Su Dayanımı", value: "10 m" },
      { label: "Ekran", value: "Ön + arka dokunmatik" },
    ],
  },
  {
    id: "c608",
    slug: "canon-eos-r50-kit",
    name: "Canon EOS R50 18-45mm Lens Kit Aynasız Fotoğraf Makinesi",
    brand: "Canon",
    category: "tuketici-foto",
    price: 27900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=mirrorless%20camera%20with%20zoom%20kit%20lens%20attached%20shown%20at%20three%20quarter%20angle%20on%20a%20clean%20neutral%20background%2C%20premium%20photography%20equipment%20product%20photography%20with%20fine%20detail&width=800&height=800&seq=c608-canon-r50&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "R50, 24 MP sensörü ve hafif gövdesiyle ürün ve etkinlik çekimlerine uygun başlangıç seviyesi bir aynasızdır.",
    specs: [
      { label: "Sensör", value: "24.2 MP APS-C" },
      { label: "Video", value: "4K / 30 fps" },
      { label: "Lens", value: "RF-S 18-45mm" },
      { label: "Ekran", value: "Döner dokunmatik" },
    ],
  },

  // Kağıt
  {
    id: "c609",
    slug: "a4-fotokopi-kagidi-80gr-koli",
    name: "A4 Fotokopi Kağıdı 80 gr 5'li Koli (2.500 Sayfa)",
    brand: "Mondi",
    category: "tuketim-kagit",
    price: 990,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 342,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=stack%20of%20white%20a4%20copy%20paper%20reams%20with%20plain%20packaging%20on%20a%20clean%20light%20gray%20studio%20surface%2C%20office%20supplies%20product%20photography%20with%20soft%20shadow%20and%20clean%20lines&width=800&height=800&seq=c609-a4-kagit-koli&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "80 gr A4 kağıt, yüksek beyazlık değeriyle lazer ve inkjet yazıcılarda akıcı baskı sağlar.",
    specs: [
      { label: "Ölçü", value: "A4 (210×297 mm)" },
      { label: "Gramaj", value: "80 gr/m²" },
      { label: "Adet", value: "5 top / 2.500 sayfa" },
      { label: "Beyazlık", value: "161 CIE" },
    ],
  },
  {
    id: "c610",
    slug: "a3-fotokopi-kagidi-80gr",
    name: "A3 Fotokopi Kağıdı 80 gr 2'li Top (1.000 Sayfa)",
    brand: "Mondi",
    category: "tuketim-kagit",
    price: 790,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 118,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=two%20reams%20of%20large%20a3%20white%20paper%20stacked%20neatly%20on%20a%20bright%20studio%20surface%2C%20office%20paper%20product%20photography%20with%20soft%20shadow%20and%20minimal%20clean%20background&width=800&height=800&seq=c610-a3-kagit&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "A3 kağıt, teknik çizim ve büyük tablo baskılarında net sonuç verir.",
    specs: [
      { label: "Ölçü", value: "A3 (297×420 mm)" },
      { label: "Gramaj", value: "80 gr/m²" },
      { label: "Adet", value: "2 top / 1.000 sayfa" },
      { label: "Uyumluluk", value: "Lazer / inkjet" },
    ],
  },

  // Toner
  {
    id: "c611",
    slug: "canon-067-toner",
    name: "Canon 067 Orijinal Siyah Toner Kartuş",
    brand: "Canon",
    category: "tuketim-toner",
    price: 2790,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 146,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20toner%20cartridge%20for%20laser%20printer%20standing%20on%20a%20clean%20white%20studio%20surface%2C%20consumable%20product%20photography%20with%20crisp%20label%20detail%20and%20soft%20shadow&width=800&height=800&seq=c611-canon-067&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Canon 067 toner, i-SENSYS LBP ve MF serisi yazıcılarda 1.350 sayfa verim sunar.",
    specs: [
      { label: "Uyumluluk", value: "i-SENSYS LBP / MF serisi" },
      { label: "Verim", value: "1.350 sayfa" },
      { label: "Renk", value: "Siyah" },
      { label: "Orijinal", value: "Evet" },
    ],
  },
  {
    id: "c612",
    slug: "hp-85a-muadil-toner",
    name: "HP 85A CE285A Muadil Siyah Toner Kartuş",
    brand: "HP",
    category: "tuketim-toner",
    price: 690,
    oldPrice: 790,
    rating: 4.2,
    reviewCount: 289,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20compatible%20toner%20cartridge%20with%20plain%20packaging%20beside%20it%20on%20a%20light%20gray%20studio%20surface%2C%20budget%20printer%20consumable%20product%20photography%20with%20soft%20shadow%20and%20neutral%20tones&width=800&height=800&seq=c612-hp-85a&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Ekonomik", tone: "info" },
    ],
    description:
      "Muadil 85A kartuş, P1102 ve M1132 serisi yazıcılarda ekonomik baskı maliyeti sunar.",
    specs: [
      { label: "Uyumluluk", value: "LaserJet P1102 / M1132" },
      { label: "Verim", value: "1.600 sayfa" },
      { label: "Renk", value: "Siyah" },
      { label: "Orijinal", value: "Hayır (muadil)" },
    ],
  },

  // Temizlik
  {
    id: "c613",
    slug: "ekran-temizleme-seti",
    name: "Ekran ve Klavye Temizleme Seti (Sprey + Mikrofiber)",
    brand: "Ugreen",
    category: "tuketim-temizlik",
    price: 290,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 376,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=screen%20cleaning%20spray%20bottle%20with%20folded%20microfiber%20cloth%20on%20a%20clean%20white%20studio%20surface%2C%20cleaning%20accessory%20product%20photography%20with%20soft%20shadow%20and%20minimal%20styling&width=800&height=800&seq=c613-ekran-temizlik&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Alkol içermeyen sprey, monitör ve dizüstü ekranlarında leke bırakmadan temizlik yapar.",
    specs: [
      { label: "İçerik", value: "100 ml sprey + bez" },
      { label: "Uyumluluk", value: "LCD, LED, cam" },
      { label: "Formül", value: "Alkolsüz" },
      { label: "Adet", value: "1 set" },
    ],
  },
  {
    id: "c614",
    slug: "basincli-hava-spreyi",
    name: "Basınçlı Hava Spreyi 400 ml (Klaveye & Fan Temizliği)",
    brand: "3M",
    category: "tuketim-temizlik",
    price: 190,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 412,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20aerosol%20compressed%20air%20can%20with%20thin%20nozzle%20straw%20on%20a%20clean%20light%20gray%20surface%2C%20maintenance%20supply%20product%20photography%20with%20soft%20shadow%20and%20crisp%20label%20detail&width=800&height=800&seq=c614-basincli-hava&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Basınçlı hava, klavye ve kasa fanlarındaki tozu güvenli biçimde uzaklaştırır.",
    specs: [
      { label: "Hacim", value: "400 ml" },
      { label: "Kullanım", value: "Klavye, fan, anakart" },
      { label: "Ekstra", value: "İnce uçlu hortum" },
      { label: "Adet", value: "1 adet" },
    ],
  },

  // Kırtasiye
  {
    id: "c615",
    slug: "dosya-klasoru-50-li",
    name: "PVC Dosya Klasörü 50'li Paket (Şeffaf)",
    brand: "Ofisim",
    category: "tuketim-kirtasiye",
    price: 390,
    oldPrice: null,
    rating: 4.2,
    reviewCount: 168,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=stack%20of%20transparent%20plastic%20document%20folders%20on%20a%20clean%20white%20studio%20surface%2C%20office%20stationery%20product%20photography%20with%20soft%20shadow%20and%20minimal%20clean%20composition&width=800&height=800&seq=c615-dosya-klasor&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Şeffaf klasörler, arşiv düzenlemesi ve evrak tesliminde pratik koruma sağlar.",
    specs: [
      { label: "Ölçü", value: "A4" },
      { label: "Malzeme", value: "PVC" },
      { label: "Adet", value: "50" },
      { label: "Renk", value: "Şeffaf" },
    ],
  },
  {
    id: "c616",
    slug: "grafit-kalem-12-li",
    name: "Grafit Kurşun Kalem 12'li Kutu (HB)",
    brand: "Faber-Castell",
    category: "tuketim-kirtasiye",
    price: 160,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 224,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=dozen%20hexagonal%20graphite%20pencils%20arranged%20side%20by%20side%20on%20a%20light%20gray%20studio%20surface%2C%20stationery%20product%20photography%20with%20crisp%20detail%20and%20soft%20natural%20light&width=800&height=800&seq=c616-grafit-kalem&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "HB uçlu grafit kalemler, günlük not ve çizim işlerinde kırılmaya dayanıklı uç yapısı sunar.",
    specs: [
      { label: "Uç", value: "HB grafit" },
      { label: "Adet", value: "12" },
      { label: "Gövde", value: "Altıgen ahşap" },
      { label: "Silgi", value: "Uçta silgili" },
    ],
  },
];