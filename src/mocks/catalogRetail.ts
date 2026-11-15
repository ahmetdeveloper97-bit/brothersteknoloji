import type { Product } from "@/types/store";

/** Güvenlik, tüketici elektroniği, tüketim ve kablo kataloğu */
export const catalogRetail: Product[] = [
  // Güvenlik → IP kamera
  {
    id: "c401",
    slug: "dahua-ipc-hfw2431t-4mp-kamera",
    name: "Dahua IPC-HFW2431T-AS 4MP IR Bullet IP Kamera",
    brand: "Dahua",
    category: "guvenlik-ip-kamera",
    price: 2390,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 156,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20bullet%20ip%20security%20camera%20with%20metal%20bracket%20on%20clean%20light%20gray%20studio%20background%2C%20surveillance%20hardware%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=catalog-dahua-2431&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "4 MP çözünürlüklü Dahua bullet kamera, 30 metre IR mesafesi ve IP67 gövdesiyle dış cephelerde güvenilir kayıt alır.",
    specs: [
      { label: "Çözünürlük", value: "4 MP (2560 × 1440)" },
      { label: "Lens", value: "2.8 mm sabit" },
      { label: "Gece Görüşü", value: "IR 30 m" },
      { label: "Koruma", value: "IP67, PoE" },
    ],
  },
  {
    id: "c402",
    slug: "axis-m3086-v-4k-dome-kamera",
    name: "Axis M3086-V 4K Dome IP Kamera",
    brand: "Axis",
    category: "guvenlik-ip-kamera",
    price: 12900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 38,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=white%20dome%20indoor%20security%20camera%20with%20clear%20cover%20on%20light%20neutral%20studio%20background%2C%20premium%20surveillance%20camera%20product%20photo&width=800&height=800&seq=catalog-axis-m3086&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "4K dome kamera, mağaza içi raf ve kasa görüntülerinde geniş açı ve düşük ışıkta netlik sağlar.",
    specs: [
      { label: "Çözünürlük", value: "4K UHD (3840 × 2160)" },
      { label: "Görüş Açısı", value: "102° yatay" },
      { label: "Besleme", value: "802.3af PoE" },
      { label: "Analitik", value: "Hareket ve bölge algılama" },
    ],
  },

  // NVR
  {
    id: "c403",
    slug: "dahua-nvr4108hs-8-kanal-nvr",
    name: "Dahua NVR4108HS-8P-4KS3 8 Kanal 4K PoE NVR",
    brand: "Dahua",
    category: "guvenlik-nvr",
    price: 5790,
    oldPrice: 6290,
    rating: 4.5,
    reviewCount: 87,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20network%20video%20recorder%20with%20poe%20ports%20on%20the%20rear%20panel%20on%20light%20gray%20background%2C%20surveillance%20recorder%20product%20photography&width=800&height=800&seq=catalog-dahua-nvr4108&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dahili PoE portlarıyla kameraları doğrudan besleyen NVR, 8 kanalda 4K kayıt ve mobil izleme sunar.",
    specs: [
      { label: "Kanal", value: "8 kanal IP + 8 port PoE" },
      { label: "Çözünürlük", value: "4K'ya kadar" },
      { label: "Disk Yuvası", value: "1× SATA (16 TB'a kadar)" },
      { label: "İzleme", value: "Mobil uygulama + web" },
    ],
  },
  {
    id: "c404",
    slug: "synology-dva1622-deep-learning-nvr",
    name: "Synology DVA1622 Deep Learning NVR (2 Disk Yuvası)",
    brand: "Synology",
    category: "guvenlik-nvr",
    price: 28900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 22,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20black%20network%20video%20recorder%20appliance%20with%20two%20drive%20bays%20on%20light%20neutral%20background%2C%20smart%20surveillance%20appliance%20product%20photo&width=800&height=800&seq=catalog-dva1622&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Yapay zekâ destekli DVA1622, yüz ve plaka tanıma analitiğiyle kayıtları aranabilir hale getirir.",
    specs: [
      { label: "Kanal", value: "8 kanal (lisansla artırılabilir)" },
      { label: "Disk Yuvası", value: "2× 3.5\" hot-swap" },
      { label: "Analitik", value: "Yüz / plaka / nesne tanıma" },
      { label: "Ağ", value: "2× 1GbE" },
    ],
  },

  // Hazır set
  {
    id: "c405",
    slug: "dahua-8-kamerali-poe-guvenlik-seti",
    name: "Dahua 8 Kameralı 4MP PoE Güvenlik Seti + 8 Kanal NVR",
    brand: "Dahua",
    category: "guvenlik-set",
    price: 24900,
    oldPrice: 27900,
    rating: 4.5,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=security%20camera%20kit%20with%20eight%20white%20cameras%20recorder%20and%20cables%20arranged%20on%20clean%20light%20background%2C%20commercial%20surveillance%20bundle%20product%20photography&width=800&height=800&seq=catalog-dahua-kit8&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%11", tone: "discount" },
    ],
    description:
      "8 kamera, PoE NVR, 2 TB izleme diski ve kabloları içeren set, orta ölçekli işletmeler için anahtar teslim kurulum sağlar.",
    specs: [
      { label: "Kamera", value: "8× 4 MP IP" },
      { label: "Kayıt", value: "8 kanal PoE NVR + 2 TB disk" },
      { label: "Kablo", value: "8× 20 m CAT6" },
      { label: "Kurulum", value: "Uzaktan yapılandırma desteği" },
    ],
  },
  {
    id: "c406",
    slug: "hikvision-2-kamerali-kablosuz-set",
    name: "Hikvision 2 Kameralı Kablosuz Güvenlik Seti (Wi-Fi NVR)",
    brand: "Hikvision",
    category: "guvenlik-set",
    price: 9900,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 118,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=two%20white%20wireless%20security%20cameras%20with%20small%20recorder%20unit%20on%20light%20gray%20background%2C%20home%20security%20kit%20product%20photography&width=800&height=800&seq=catalog-hik-kit2w&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kablolama gerektirmeyen kablosuz set, kafe ve küçük ofislerde hızlı kurulum imkânı verir.",
    specs: [
      { label: "Kamera", value: "2× 3 MP Wi-Fi" },
      { label: "Kayıt", value: "4 kanal Wi-Fi NVR" },
      { label: "Disk", value: "1 TB dahil" },
      { label: "Mobil", value: "iOS / Android izleme" },
    ],
  },

  // Geçiş kontrolü
  {
    id: "c407",
    slug: "zkteco-inbio260-kart-okuyucu",
    name: "ZKTeco inBio260 Kart Okuyucu ve Kontrol Paneli",
    brand: "ZKTeco",
    category: "guvenlik-gecis",
    price: 6490,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 46,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=metal%20access%20control%20panel%20with%20card%20reader%20and%20enclosure%20on%20light%20neutral%20background%2C%20security%20access%20hardware%20product%20photography&width=800&height=800&seq=catalog-inbio260&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "inBio260, kapı kontrollü geçiş noktalarında kart ve parmak izi doğrulamasını tek panelde toplar.",
    specs: [
      { label: "Kapı Kapasitesi", value: "4 kapı" },
      { label: "Kullanıcı", value: "30.000 kart" },
      { label: "Bağlantı", value: "TCP/IP, RS485" },
      { label: "Yedekleme", value: "Dahili hafıza" },
    ],
  },
  {
    id: "c408",
    slug: "dahua-asi7213x-yuz-tanima-terminali",
    name: "Dahua ASI7213X Yüz Tanıma ve Kart Geçiş Terminali",
    brand: "Dahua",
    category: "guvenlik-gecis",
    price: 14900,
    oldPrice: 15900,
    rating: 4.5,
    reviewCount: 31,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=wall%20mount%20face%20recognition%20access%20terminal%20with%20camera%20and%20lcd%20on%20light%20gray%20background%2C%20modern%20biometric%20access%20device%20photography&width=800&height=800&seq=catalog-asi7213x&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Temassız yüz tanıma ile kapı açan terminal, kart kaybı durumunda bile personelin erişimini sürdürür.",
    specs: [
      { label: "Doğrulama", value: "Yüz tanıma + kart + şifre" },
      { label: "Kapasite", value: "50.000 kullanıcı" },
      { label: "Ekran", value: "7 inç dokunmatik" },
      { label: "Bağlantı", value: "PoE, Wi-Fi opsiyonu" },
    ],
  },

  // Alarm
  {
    id: "c409",
    slug: "parado-hybrid-alarm-paneli",
    name: "Paradox MG5050 Hibrit Alarm Paneli (32 Bölge)",
    brand: "Paradox",
    category: "guvenlik-alarm",
    price: 4890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 64,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=metal%20alarm%20control%20panel%20box%20with%20circuit%20board%20visible%20on%20light%20gray%20studio%20background%2C%20security%20system%20electronics%20product%20photo&width=800&height=800&seq=catalog-paradox-mg5050&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Hibrit panel, kablolu ve kablosuz dedektörleri aynı sistemde yöneterek mağaza ve depo alarmını merkezileştirir.",
    specs: [
      { label: "Bölge", value: "32 bölge (5 kablo + kablosuz)" },
      { label: "Kullanıcı", value: "96 kullanıcı kodu" },
      { label: "Haberleşme", value: "IP / GSM modül uyumlu" },
      { label: "Uygulama", value: "Mobil kontrol" },
    ],
  },
  {
    id: "c410",
    slug: "bosch-hareket-dedektoru-isc-bpr2",
    name: "Bosch ISC-BPR2 Hareket Dedektörü (12 m)",
    brand: "Bosch",
    category: "guvenlik-alarm",
    price: 690,
    oldPrice: 790,
    rating: 4.6,
    reviewCount: 132,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20pir%20motion%20sensor%20for%20alarm%20systems%20on%20clean%20light%20background%2C%20security%20detector%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=catalog-bosch-isc-bpr2&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PIR dedektör, 12 metre algılama mesafesi ve yanlış alarm filtreleriyle ofis içi hareketleri güvenilir şekilde raporlar.",
    specs: [
      { label: "Algılama", value: "12 m / 85°" },
      { label: "Teknoloji", value: "PIR" },
      { label: "Montaj", value: "Duvar / köşe" },
      { label: "Besleme", value: "9–15 V DC" },
    ],
  },

  // Tüketici → Televizyon
  {
    id: "c411",
    slug: "samsung-crystal-uhd-cu8500-55",
    name: "Samsung Crystal UHD CU8500 55\" 4K Smart TV",
    brand: "Samsung",
    category: "tuketici-tv",
    price: 27900,
    oldPrice: 31900,
    rating: 4.6,
    reviewCount: 214,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=large%2055%20inch%20smart%20television%20with%20ultra%20thin%20bezel%20on%20light%20gray%20studio%20background%2C%20premium%20tv%20product%20photography%20with%20subtle%20reflection&width=800&height=800&seq=catalog-samsung-cu8500&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%12", tone: "discount" },
    ],
    description:
      "Crystal UHD işlemcisiyle içerikleri 4K'ya yükselten CU8500, toplantı odası ve bekleme alanları için ideal ekran boyutu sunar.",
    specs: [
      { label: "Ekran", value: "55\" 4K UHD" },
      { label: "Platform", value: "Tizen Smart TV" },
      { label: "Bağlantı", value: "3× HDMI, 2× USB, Wi-Fi" },
      { label: "Teknoloji", value: "HDR10+, Motion Xcelerator" },
    ],
  },
  {
    id: "c412",
    slug: "lg-oled-evo-c4-48",
    name: "LG OLED evo C4 48\" 4K Smart TV",
    brand: "LG",
    category: "tuketici-tv",
    price: 42900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=oled%20television%20with%20paper%20thin%20display%20and%20slim%20stand%20on%20neutral%20light%20background%2C%20high%20end%20television%20product%20photography&width=800&height=800&seq=catalog-lg-c4-48&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "OLED evo paneliyle siyah detayları derinleştiren C4, sunum ve video izleme için referans görüntü kalitesi sunar.",
    specs: [
      { label: "Ekran", value: "48\" OLED evo 4K" },
      { label: "İşlemci", value: "α9 AI Processor Gen7" },
      { label: "Platform", value: "webOS 24" },
      { label: "Oyun", value: "4× HDMI 2.1, 144 Hz" },
    ],
  },

  // Akıllı saat
  {
    id: "c413",
    slug: "apple-watch-se-2-44mm",
    name: "Apple Watch SE 2. Nesil 44mm GPS Akıllı Saat",
    brand: "Apple",
    category: "tuketici-giyilebilir",
    price: 9490,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 342,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=modern%20square%20smartwatch%20with%20sport%20band%20on%20clean%20white%20studio%20background%2C%20premium%20wearable%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=catalog-watch-se2&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Watch SE, sağlık ve hareket takibi özelliklerini kurumsal hediye bütçesine uygun bir fiyatla sunar.",
    specs: [
      { label: "Ekran", value: "44 mm Retina" },
      { label: "Bağlantı", value: "GPS, Bluetooth 5.3" },
      { label: "Pil", value: "18 saate kadar" },
      { label: "Su Direnci", value: "50 m" },
    ],
  },
  {
    id: "c414",
    slug: "garmin-venu-sq2-akilli-saat",
    name: "Garmin Venu Sq 2 GPS Akıllı Saat",
    brand: "Garmin",
    category: "tuketici-giyilebilir",
    price: 7290,
    oldPrice: 7890,
    rating: 4.5,
    reviewCount: 187,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=rectangular%20gps%20fitness%20smartwatch%20with%20silicone%20strap%20on%20light%20neutral%20surface%2C%20sport%20wearable%20product%20photography&width=800&height=800&seq=catalog-venu-sq2&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "AMOLED ekranı ve 11 güne kadar pil ömrüyle Venu Sq 2, saha ekiplerinin günlük takibinde pratiktir.",
    specs: [
      { label: "Ekran", value: "1.41\" AMOLED" },
      { label: "Pil", value: "11 güne kadar" },
      { label: "Spor Modu", value: "25+ aktivite" },
      { label: "Sağlık", value: "Nabız, uyku, SpO2" },
    ],
  },

  // Ses
  {
    id: "c415",
    slug: "jbl-charge-5-bluetooth-hoparlor",
    name: "JBL Charge 5 Taşınabilir Bluetooth Hoparlör",
    brand: "JBL",
    category: "tuketici-ses",
    price: 4290,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 428,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=cylindrical%20portable%20bluetooth%20speaker%20in%20black%20with%20fabric%20mesh%20on%20light%20gray%20studio%20background%2C%20audio%20product%20photography%20with%20soft%20light&width=800&height=800&seq=catalog-jbl-charge5&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "IP67 su geçirmez gövdesi ve güçlü basıyla Charge 5, etkinlik ve toplantı alanlarında dış mekânda da kullanılabilir.",
    specs: [
      { label: "Ses", value: "20 W, JBL Pro Sound" },
      { label: "Pil", value: "20 saate kadar" },
      { label: "Bağlantı", value: "Bluetooth 5.1" },
      { label: "Dayanıklılık", value: "IP67" },
    ],
  },
  {
    id: "c416",
    slug: "sony-soundbar-ht-s2000",
    name: "Sony HT-S2000 3.1 Kanal Soundbar",
    brand: "Sony",
    category: "tuketici-ses",
    price: 11900,
    oldPrice: 12900,
    rating: 4.6,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20slim%20soundbar%20with%20metal%20grille%20on%20light%20neutral%20studio%20background%2C%20home%20audio%20product%20photography%20with%20clean%20reflection&width=800&height=800&seq=catalog-ht-s2000&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dahili subwoofer ve Dolby Atmos desteğiyle HT-S2000, toplantı odası seslendirmesini belirgin şekilde iyileştirir.",
    specs: [
      { label: "Kanal", value: "3.1 kanal" },
      { label: "Ses Formatı", value: "Dolby Atmos / DTS" },
      { label: "Bağlantı", value: "HDMI eARC, Bluetooth" },
      { label: "Güç", value: "250 W" },
    ],
  },

  // Akıllı ev
  {
    id: "c417",
    slug: "philips-hue-baslangic-seti-e27",
    name: "Philips Hue Beyaz Renkli Başlangıç Seti (3× E27 + Bridge)",
    brand: "Philips",
    category: "tuketici-akilli-ev",
    price: 5490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 158,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=smart%20light%20bulbs%20with%20bridge%20hub%20arranged%20on%20light%20gray%20studio%20surface%2C%20home%20automation%20product%20photography%20with%20soft%20glow&width=800&height=800&seq=catalog-hue-start&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Hue başlangıç seti, ofis aydınlatmasını senaryolara bağlayarak enerji verimliliği ve ambiyans sağlar.",
    specs: [
      { label: "İçerik", value: "3× E27 ampul + Hue Bridge" },
      { label: "Renk", value: "16 milyon renk" },
      { label: "Bağlantı", value: "Zigbee + Wi-Fi" },
      { label: "Kontrol", value: "Uygulama, sesli asistan" },
    ],
  },
  {
    id: "c418",
    slug: "xiaomi-akilli-priz-pro",
    name: "Xiaomi Mi Akıllı Priz Pro (Wi-Fi, Enerji Ölçer)",
    brand: "Xiaomi",
    category: "tuketici-akilli-ev",
    price: 490,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 263,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20smart%20wifi%20plug%20with%20small%20led%20indicator%20on%20clean%20white%20studio%20background%2C%20minimal%20smart%20home%20device%20product%20photography&width=800&height=800&seq=catalog-xiaomi-priz&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Enerji tüketimini raporlayan akıllı priz, ofis cihazlarının mesai dışında kapatılmasını otomatikleştirir.",
    specs: [
      { label: "Bağlantı", value: "Wi-Fi 2.4 GHz" },
      { label: "Yük", value: "16 A / 3680 W" },
      { label: "Ölçüm", value: "Anlık enerji tüketimi" },
      { label: "Entegrasyon", value: "Mi Home, Alexa, Google" },
    ],
  },

  // Fotoğraf
  {
    id: "c419",
    slug: "gopro-hero12-black-aksiyon-kamerasi",
    name: "GoPro HERO12 Black Aksiyon Kamerası",
    brand: "GoPro",
    category: "tuketici-foto",
    price: 17900,
    oldPrice: 18900,
    rating: 4.7,
    reviewCount: 129,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=rugged%20action%20camera%20with%20wide%20lens%20and%20mounting%20fingers%20on%20light%20gray%20studio%20background%2C%20outdoor%20camera%20product%20photography&width=800&height=800&seq=catalog-hero12&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "5.3K video ve HyperSmooth 6.0 sabitleme sunan HERO12, saha denetimi ve tanıtım çekimlerinde kullanılabilir.",
    specs: [
      { label: "Video", value: "5.3K60 / 4K120" },
      { label: "Sabitleme", value: "HyperSmooth 6.0" },
      { label: "Su Direnci", value: "10 m (kutusuz)" },
      { label: "Pil", value: "Enduro, 90 dk kayıt" },
    ],
  },
  {
    id: "c420",
    slug: "canon-eos-r50-kit-lens",
    name: "Canon EOS R50 18-45mm Kit Aynasız Fotoğraf Makinesi",
    brand: "Canon",
    category: "tuketici-foto",
    price: 32900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 68,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=compact%20mirrorless%20camera%20with%20kit%20lens%20attached%20photographed%20on%20light%20gray%20studio%20surface%2C%20clean%20camera%20product%20photography&width=800&height=800&seq=catalog-eos-r50&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "24.2 MP sensörü ve 4K video desteğiyle EOS R50, ürün ve etkinlik çekimlerinde hafif bir çözüm sunar.",
    specs: [
      { label: "Sensör", value: "24.2 MP APS-C" },
      { label: "Video", value: "4K 30p" },
      { label: "Kit Lens", value: "RF-S 18-45 mm" },
      { label: "Ekran", value: "Döner dokunmatik" },
    ],
  },

  // Tüketim → Kağıt
  {
    id: "c421",
    slug: "a4-fotokopi-kagidi-80gr-5-koli",
    name: "A4 Fotokopi Kağıdı 80 gr (5 Koli / 25.000 Yaprak)",
    brand: "Asel",
    category: "tuketim-kagit",
    price: 3490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 196,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=stack%20of%20white%20a4%20paper%20reams%20wrapped%20in%20packaging%20on%20light%20gray%20studio%20background%2C%20office%20supply%20product%20photography%20with%20clean%20composition&width=800&height=800&seq=catalog-a4-kagit&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Yüksek beyazlık oranına sahip A4 kağıt, çift taraflı baskıda sıkışma yapmadan yoğun yazıcılarda çalışır.",
    specs: [
      { label: "Ölçü", value: "A4 (210 × 297 mm)" },
      { label: "Gramaj", value: "80 gr/m²" },
      { label: "Paket", value: "5 koli / 25.000 yaprak" },
      { label: "Uyumluluk", value: "Lazer ve inkjet" },
    ],
  },
  {
    id: "c422",
    slug: "termal-fis-rulosu-80mm-20li",
    name: "Termal Fiş Rulosu 80×80 mm (20'li Paket)",
    brand: "Kores",
    category: "tuketim-kagit",
    price: 890,
    oldPrice: 990,
    rating: 4.4,
    reviewCount: 241,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=several%20white%20thermal%20receipt%20paper%20rolls%20stacked%20on%20light%20neutral%20surface%2C%20retail%20consumable%20product%20photography%20with%20soft%20shadows&width=800&height=800&seq=catalog-fis-rulosu&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "POS yazıcılar için üretilen termal rulolar, uzun arşiv ömrü ve net baskı kalitesi sağlar.",
    specs: [
      { label: "Ölçü", value: "80 mm × 80 m" },
      { label: "Paket", value: "20 rulo" },
      { label: "Tip", value: "Termal, BPA içermez" },
      { label: "Uyumluluk", value: "Epson, Bixolon, Posbank" },
    ],
  },

  // Toner
  {
    id: "c423",
    slug: "xerox-3020-toner-kartus",
    name: "Xerox 3020 (106R02773) Uyumlu Siyah Toner",
    brand: "Xerox",
    category: "tuketim-toner",
    price: 1490,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 112,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20toner%20cartridge%20with%20brand%20neutral%20packaging%20on%20light%20gray%20studio%20surface%2C%20printer%20consumable%20product%20photography&width=800&height=800&seq=catalog-xerox-3020&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Phaser 3020 serisi için hazırlanan toner, 1.500 sayfa verimiyle küçük ofislerin baskı ihtiyacını karşılar.",
    specs: [
      { label: "Uyumlu Model", value: "Phaser 3020 / 3025" },
      { label: "Verim", value: "1.500 sayfa" },
      { label: "Renk", value: "Siyah" },
      { label: "Garanti", value: "1 yıl" },
    ],
  },
  {
    id: "c424",
    slug: "hp-415a-renkli-toner-seti",
    name: "HP 415A Renkli Toner Seti (C/M/Y)",
    brand: "HP",
    category: "tuketim-toner",
    price: 6890,
    oldPrice: 7390,
    rating: 4.6,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=set%20of%20three%20color%20toner%20cartridges%20cyan%20magenta%20yellow%20side%20by%20side%20on%20light%20neutral%20background%2C%20printer%20supply%20product%20photography&width=800&height=800&seq=catalog-hp-415a&orientation=squarish",
    tags: [{ label: "Orijinal", tone: "primary" }],
    description:
      "Color LaserJet Pro M454 serisi için orijinal renkli toner seti, kurumsal dokümanlarda tutarlı renk doğruluğu sağlar.",
    specs: [
      { label: "Uyumlu Model", value: "LaserJet Pro M454 / MFP M479" },
      { label: "Verim", value: "2.100 sayfa (renk başına)" },
      { label: "Renk", value: "Cyan / Magenta / Yellow" },
      { label: "Tip", value: "Orijinal" },
    ],
  },

  // Temizlik
  {
    id: "c425",
    slug: "ekran-temizleme-seti-200ml",
    name: "Ekran ve Elektronik Temizleme Seti 200 ml (Mikrofiberli)",
    brand: "3M",
    category: "tuketim-temizlik",
    price: 290,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 318,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=screen%20cleaning%20spray%20bottle%20with%20microfiber%20cloth%20folded%20beside%20it%20on%20light%20gray%20surface%2C%20clean%20office%20care%20product%20photography&width=800&height=800&seq=catalog-ekran-temizleme&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Alkol içermeyen formülü sayesinde ekran kaplamalarına zarar vermeden leke ve parmak izlerini temizler.",
    specs: [
      { label: "Hacim", value: "200 ml sprey" },
      { label: "İçerik", value: "Mikrofiber bez dahil" },
      { label: "Kullanım", value: "Ekran, klavye, cam" },
      { label: "Formül", value: "Alkol ve amonyak içermez" },
    ],
  },
  {
    id: "c426",
    slug: "basinc-hava-spreyi-400ml",
    name: "Basınçlı Hava Spreyi 400 ml (Elektronik Temizlik)",
    brand: "Fellowes",
    category: "tuketim-temizlik",
    price: 340,
    oldPrice: 390,
    rating: 4.3,
    reviewCount: 187,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compressed%20air%20duster%20spray%20can%20with%20thin%20nozzle%20on%20light%20neutral%20background%2C%20computer%20maintenance%20product%20photography&width=800&height=800&seq=catalog-basinc-hava&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Klavye ve kasa içi tozları hızlıca temizleyen basınçlı hava, cihaz ömrünü uzatan rutin bakımın parçasıdır.",
    specs: [
      { label: "Hacim", value: "400 ml" },
      { label: "Nozül", value: "İnce uzatma başlığı" },
      { label: "Kullanım", value: "Klavye, kasa, yazıcı" },
      { label: "Uyarı", value: "Ters kullanımda sıvı çıkabilir" },
    ],
  },

  // Kırtasiye
  {
    id: "c427",
    slug: "dosya-klasoru-arsiv-kutusu-20li",
    name: "Arşiv Dosya Klasörü ve Kutusu Seti (20'li)",
    brand: "Leitz",
    category: "tuketim-kirtasiye",
    price: 890,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=stack%20of%20grey%20archive%20folders%20and%20document%20boxes%20on%20light%20neutral%20studio%20surface%2C%20office%20organization%20product%20photography&width=800&height=800&seq=catalog-arsiv-dosya&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Sırt etiketli arşiv dosyaları, sözleşme ve fatura saklama süreçlerini düzenli tutmak için hazırlanmıştır.",
    specs: [
      { label: "İçerik", value: "20 adet klasör + 5 kutu" },
      { label: "Malzeme", value: "Geri dönüştürülmüş mukavva" },
      { label: "Ölçü", value: "A4 uyumlu" },
      { label: "Etiket", value: "Yazılabilir sırt alanı" },
    ],
  },
  {
    id: "c428",
    slug: "jel-kalem-seti-50li-mavi",
    name: "Jel Kalem Seti 0.7 mm Mavi (50'li Kutu)",
    brand: "Bic",
    category: "tuketim-kirtasiye",
    price: 390,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 214,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=box%20of%20blue%20gel%20pens%20arranged%20neatly%20on%20light%20gray%20surface%2C%20office%20stationery%20product%20photography%20with%20clean%20styling&width=800&height=800&seq=catalog-jel-kalem&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Hızlı kuruyan mürekkebiyle belge imzalama ve not almada leke bırakmayan ekonomik jel kalem seti.",
    specs: [
      { label: "Uç Kalınlığı", value: "0.7 mm" },
      { label: "Renk", value: "Mavi" },
      { label: "Adet", value: "50 kalem" },
      { label: "Mürekkep", value: "Hızlı kuruyan jel" },
    ],
  },

  // Kablo → Ağ kablosu
  {
    id: "c429",
    slug: "cat6-patch-kablo-2m-10lu",
    name: "CAT6 UTP Patch Kablo 2 m (10'lu Paket, Mavi)",
    brand: "Digitus",
    category: "kablo-ag",
    price: 690,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 176,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=bundle%20of%20blue%20cat6%20network%20patch%20cables%20with%20rj45%20connectors%20coiled%20on%20light%20neutral%20background%2C%20networking%20accessory%20product%20photo&width=800&height=800&seq=catalog-cat6-patch&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kalay kaplı bakır iletkenleriyle CAT6 patch kablolar, gigabit bağlantıda veri kaybını en aza indirir.",
    specs: [
      { label: "Kategori", value: "CAT6 UTP" },
      { label: "Uzunluk", value: "2 m" },
      { label: "Paket", value: "10 adet" },
      { label: "Konnektör", value: "RJ45, altın kaplama" },
    ],
  },
  {
    id: "c430",
    slug: "cat6a-kablo-makara-305m",
    name: "CAT6A F/UTP Kablo Makarası 305 m (Kutu, Yeşil)",
    brand: "Nexans",
    category: "kablo-ag",
    price: 8990,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 63,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=large%20green%20network%20cable%20spool%20on%20light%20gray%20studio%20background%2C%20structured%20cabling%20product%20photography%20with%20industrial%20feel&width=800&height=800&seq=catalog-cat6a-makara&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "305 metrelik makara, bina içi yapısal kablolama projelerinde 10G bağlantı altyapısı kurmak için yeterli uzunluk sağlar.",
    specs: [
      { label: "Kategori", value: "CAT6A F/UTP" },
      { label: "Uzunluk", value: "305 m makara" },
      { label: "İletken", value: "%100 bakır, 23 AWG" },
      { label: "Standart", value: "LSZH kılıf" },
    ],
  },

  // HDMI
  {
    id: "c431",
    slug: "hdmi-2-1-kablo-8k-2m",
    name: "HDMI 2.1 Kablo 8K 60Hz 2 m (Altın Kaplama)",
    brand: "Ugreen",
    category: "kablo-hdmi",
    price: 390,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 254,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20braided%20hdmi%20cable%20with%20gold%20connectors%20coiled%20on%20light%20gray%20surface%2C%20premium%20cable%20product%20photography%20with%20clean%20styling&width=800&height=800&seq=catalog-hdmi21&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "8K 60Hz ve 4K 120Hz destekli kablo, toplantı odası ekranları ile sunum cihazlarını güvenle eşleştirir.",
    specs: [
      { label: "Sürüm", value: "HDMI 2.1" },
      { label: "Çözünürlük", value: "8K 60Hz / 4K 120Hz" },
      { label: "Uzunluk", value: "2 m" },
      { label: "Konnektör", value: "Altın kaplama" },
    ],
  },
  {
    id: "c432",
    slug: "displayport-kablo-4k-3m",
    name: "DisplayPort 1.4 Kablo 4K 60Hz 3 m",
    brand: "Vention",
    category: "kablo-hdmi",
    price: 290,
    oldPrice: 340,
    rating: 4.3,
    reviewCount: 138,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=displayport%20cable%20with%20locking%20connectors%20on%20neutral%20light%20background%2C%20computer%20accessory%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=catalog-dp14&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kilitli konnektörleriyle monitör bağlantısının kazara çıkmasını önleyen DisplayPort kablosu.",
    specs: [
      { label: "Sürüm", value: "DisplayPort 1.4" },
      { label: "Çözünürlük", value: "4K 60Hz" },
      { label: "Uzunluk", value: "3 m" },
      { label: "Özellik", value: "Kilitli konnektör" },
    ],
  },

  // USB
  {
    id: "c433",
    slug: "usb-c-sarj-kablosu-100w-2m",
    name: "USB-C - USB-C Şarj ve Veri Kablosu 100W 2 m",
    brand: "Baseus",
    category: "kablo-usb",
    price: 290,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 342,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=braided%20usb%20c%20to%20usb%20c%20cable%20coiled%20with%20both%20connectors%20visible%20on%20light%20gray%20surface%2C%20clean%20cable%20product%20photography&width=800&height=800&seq=catalog-usbc-100w&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "100 W güç aktarımı destekleyen kablo, dizüstü bilgisayarları tek kabloyla hızlı şarj eder.",
    specs: [
      { label: "Tip", value: "USB-C - USB-C" },
      { label: "Güç", value: "100 W (20V/5A)" },
      { label: "Uzunluk", value: "2 m" },
      { label: "Veri", value: "480 Mbps" },
    ],
  },
  {
    id: "c434",
    slug: "usb-3-0-uzatma-kablosu-5m",
    name: "USB 3.0 Aktif Uzatma Kablosu 5 m",
    brand: "Digitus",
    category: "kablo-usb",
    price: 490,
    oldPrice: null,
    rating: 4.2,
    reviewCount: 87,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=usb%20extension%20cable%20with%20male%20and%20female%20connectors%20on%20light%20neutral%20background%2C%20technical%20accessory%20product%20photography&width=800&height=800&seq=catalog-usb30-uzatma&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Aktif sinyal yükselticisi sayesinde 5 metre mesafede kamera ve yazıcı bağlantısında veri kaybı yaşanmaz.",
    specs: [
      { label: "Tip", value: "USB 3.0 A uzatma" },
      { label: "Uzunluk", value: "5 m" },
      { label: "Hız", value: "5 Gbps" },
      { label: "Özellik", value: "Aktif sinyal yükseltici" },
    ],
  },

  // Adaptör
  {
    id: "c435",
    slug: "usb-c-hdmi-4k-adaptor",
    name: "USB-C - HDMI 4K Dönüştürücü Adaptör",
    brand: "Ugreen",
    category: "kablo-adaptor",
    price: 390,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 196,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=small%20aluminium%20usb%20c%20to%20hdmi%20adapter%20on%20clean%20light%20background%2C%20minimal%20tech%20accessory%20product%20photography&width=800&height=800&seq=catalog-usbc-hdmi&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Sunum öncesi dizüstü bilgisayarı projeksiyona bağlamak için çantada taşınabilecek kompakt dönüştürücü.",
    specs: [
      { label: "Giriş / Çıkış", value: "USB-C → HDMI" },
      { label: "Çözünürlük", value: "4K 60Hz" },
      { label: "Gövde", value: "Alüminyum" },
      { label: "Uyumluluk", value: "Windows / macOS" },
    ],
  },
  {
    id: "c436",
    slug: "usb-c-guc-adaptoru-65w",
    name: "USB-C 65W GaN Hızlı Şarj Adaptörü (2 Port)",
    brand: "Anker",
    category: "kablo-adaptor",
    price: 890,
    oldPrice: 990,
    rating: 4.7,
    reviewCount: 287,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20white%20gan%20usb%20c%20charger%20with%20two%20ports%20on%20light%20gray%20studio%20background%2C%20modern%20power%20adapter%20product%20photography&width=800&height=800&seq=catalog-gan-65w&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "GaN teknolojisiyle küçülen 65 W adaptör, dizüstü ve telefonu aynı anda şarj ederek masadaki kablo sayısını azaltır.",
    specs: [
      { label: "Güç", value: "65 W toplam" },
      { label: "Port", value: "2× USB-C (PD)" },
      { label: "Teknoloji", value: "GaN II" },
      { label: "Boyut", value: "Cep boyutu" },
    ],
  },

  // Güç kablosu
  {
    id: "c437",
    slug: "grup-priz-6li-akim-korumali",
    name: "6'lı Akım Korumalı Grup Priz (3 m, Anahtarlı)",
    brand: "Schneider Electric",
    category: "kablo-guc",
    price: 590,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 204,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20six%20outlet%20power%20strip%20with%20switch%20and%20cable%20on%20light%20neutral%20surface%2C%20office%20electrical%20accessory%20product%20photography&width=800&height=800&seq=catalog-grup-priz&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Akım koruma devresi bulunan grup priz, ani gerilim dalgalanmalarında bağlı cihazları korur.",
    specs: [
      { label: "Priz", value: "6× topraklı" },
      { label: "Kablo", value: "3 m" },
      { label: "Koruma", value: "Aşırı akım ve gerilim" },
      { label: "Anahtar", value: "Işıklı açma kapama" },
    ],
  },
  {
    id: "c438",
    slug: "ups-guc-kablosu-iec-c13-3m",
    name: "Güç Kablosu IEC C13 - Schuko 3 m (10 A)",
    brand: "Vention",
    category: "kablo-guc",
    price: 190,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 148,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20power%20cable%20with%20schuko%20plug%20and%20iec%20c13%20connector%20coiled%20on%20light%20gray%20surface%2C%20electrical%20cable%20product%20photography&width=800&height=800&seq=catalog-iec-c13&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "UPS ve sunucu beslemesi için üretilen kablo, 10 A akım kapasitesiyle rack kabinlerde güvenli bağlantı sağlar.",
    specs: [
      { label: "Tip", value: "Schuko → IEC C13" },
      { label: "Uzunluk", value: "3 m" },
      { label: "Akım", value: "10 A / 250 V" },
      { label: "İletken", value: "3× 0.75 mm²" },
    ],
  },
];