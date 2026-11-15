import type { Product } from "@/types/store";

/** Barkod, PDKS ve güvenlik ürünleri için ek katalog */
export const catalogSecurityExtra: Product[] = [
  // Barkod yazıcı
  {
    id: "c579",
    slug: "zebra-zt411-endustriyel-yazici",
    name: "Zebra ZT411 Endüstriyel Termal Transfer Etiket Yazıcı",
    brand: "Zebra",
    category: "otvt-barkod-yazici",
    price: 32900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 46,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=industrial%20metal%20label%20printer%20with%20large%20media%20roll%20and%20touch%20display%20on%20a%20light%20gray%20studio%20surface%2C%20rugged%20industrial%20hardware%20photography%20with%20precise%20detail%20and%20soft%20shadow&width=800&height=800&seq=c579-zebra-zt411&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "ZT411, metal gövdesi ve dokunmatik paneliyle üretim hatlarında 7/24 etiket baskısı yapar.",
    specs: [
      { label: "Baskı", value: "Termal transfer, 300 dpi" },
      { label: "Hız", value: "356 mm/sn" },
      { label: "Bağlantı", value: "USB, Ethernet, Seri" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c580",
    slug: "honeywell-pm42-etiket-yazici",
    name: "Honeywell PM42 Endüstriyel Barkod Yazıcı",
    brand: "Honeywell",
    category: "otvt-barkod-yazici",
    price: 27900,
    oldPrice: 29400,
    rating: 4.6,
    reviewCount: 34,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20industrial%20label%20printer%20with%20metal%20side%20panel%20and%20visible%20label%20output%20on%20a%20clean%20neutral%20background%2C%20warehouse%20equipment%20product%20photography%20with%20sharp%20edges&width=800&height=800&seq=c580-honeywell-pm42&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PM42, çok yönlü medya desteği ve dayanıklı gövdesiyle depo etiketlemede verim sağlar.",
    specs: [
      { label: "Baskı", value: "Termal transfer, 203 dpi" },
      { label: "Hız", value: "300 mm/sn" },
      { label: "Medya", value: "Etiket, karton, film" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Barkod okuyucu
  {
    id: "c581",
    slug: "honeywell-voyager-1470g-okuyucu",
    name: "Honeywell Voyager 1470g 2D Kablolu Barkod Okuyucu",
    brand: "Honeywell",
    category: "otvt-barkod-okuyucu",
    price: 2290,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 187,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20handheld%202d%20barcode%20scanner%20with%20ergonomic%20grip%20and%20stand%20on%20a%20light%20gray%20studio%20surface%2C%20retail%20hardware%20product%20photography%20with%20crisp%20detail%20and%20soft%20shadow&width=800&height=800&seq=c581-voyager-1470g&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "1470g, ekrandan ve hasarlı etiketlerden bile hızlı okuma yaparak kasa önünde bekleme süresini kısaltır.",
    specs: [
      { label: "Okuma", value: "1D / 2D / QR" },
      { label: "Bağlantı", value: "USB" },
      { label: "Dayanıklılık", value: "1.8 m düşme testi" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c582",
    slug: "datalogic-quickscan-qbt2400",
    name: "Datalogic QuickScan QBT2400 Kablosuz 2D Okuyucu",
    brand: "Datalogic",
    category: "otvt-barkod-okuyucu",
    price: 3890,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 92,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=wireless%20handheld%20barcode%20scanner%20with%20charging%20cradle%20on%20a%20clean%20light%20neutral%20surface%2C%20warehouse%20scanning%20device%20product%20photography%20with%20soft%20lighting%20and%20fine%20texture&width=800&height=800&seq=c582-quickscan-qbt2400&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kablosuz QuickScan, 25 metreye kadar menziliyle raf aralarında sayım işlerini hızlandırır.",
    specs: [
      { label: "Okuma", value: "1D / 2D" },
      { label: "Bağlantı", value: "Bluetooth + cradle" },
      { label: "Menzil", value: "25 m (açık alan)" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // El terminali
  {
    id: "c583",
    slug: "zebra-tc22-el-terminali",
    name: "Zebra TC22 Android 13 El Terminali 2D Okuyuculu",
    brand: "Zebra",
    category: "otvt-el-terminali",
    price: 42900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 38,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=rugged%20handheld%20android%20terminal%20with%20touch%20screen%20and%20scanner%20head%20held%20upright%20on%20a%20light%20gray%20studio%20background%2C%20industrial%20mobile%20device%20photography%20with%20fine%20detail&width=800&height=800&seq=c583-zebra-tc22&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "TC22, depo sayımı ve mal kabul süreçlerinde Android uygulamalarıyla entegre çalışır.",
    specs: [
      { label: "İşletim Sistemi", value: "Android 13" },
      { label: "Ekran", value: "5.4\" dokunmatik" },
      { label: "Okuyucu", value: "2D imager" },
      { label: "Batarya", value: "Değiştirilebilir" },
    ],
  },
  {
    id: "c584",
    slug: "honeywell-eda52-el-terminali",
    name: "Honeywell ScanPal EDA52 Android El Terminali",
    brand: "Honeywell",
    category: "otvt-el-terminali",
    price: 34900,
    oldPrice: 36900,
    rating: 4.5,
    reviewCount: 44,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20rugged%20android%20handheld%20scanner%20device%20with%20large%20screen%20on%20a%20neutral%20light%20surface%2C%20logistics%20hardware%20product%20photography%20with%20even%20lighting%20and%20sharp%20detail&width=800&height=800&seq=c584-eda52&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "EDA52, uzun pil ömrü ve düşmeye dayanıklı gövdesiyle saha ekipleri için pratiktir.",
    specs: [
      { label: "İşletim Sistemi", value: "Android 11" },
      { label: "Ekran", value: "5.5\" HD dokunmatik" },
      { label: "Batarya", value: "4500 mAh" },
      { label: "Ağ", value: "4G, Wi-Fi, Bluetooth" },
    ],
  },

  // PDKS
  {
    id: "c585",
    slug: "zkteco-f18-pdks",
    name: "ZKTeco F18 Parmak İzi + Kart PDKS Cihazı",
    brand: "ZKTeco",
    category: "otvt-pdks",
    price: 7490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 168,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20wall%20mounted%20fingerprint%20time%20attendance%20terminal%20with%20keypad%20and%20sensor%20on%20a%20light%20gray%20background%2C%20access%20control%20hardware%20product%20photography%20with%20crisp%20detail&width=800&height=800&seq=c585-zkteco-f18&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "F18, parmak izi ve kart ile giriş kaydı tutarak personel devam kontrolünü tek cihazda toplar.",
    specs: [
      { label: "Kullanıcı", value: "3.000 parmak izi" },
      { label: "Doğrulama", value: "Parmak izi + RFID" },
      { label: "Bağlantı", value: "TCP/IP, USB" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c586",
    slug: "suprema-biostation-3-pdks",
    name: "Suprema BioStation 3 Yüz Tanıma PDKS Cihazı",
    brand: "Suprema",
    category: "otvt-pdks",
    price: 27900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 41,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=sleek%20facial%20recognition%20access%20terminal%20with%20large%20camera%20and%20display%20mounted%20on%20a%20light%20neutral%20wall%2C%20modern%20security%20device%20product%20photography%20with%20soft%20lighting&width=800&height=800&seq=c586-biostation-3&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "BioStation 3, temassız yüz tanıma ile giriş süresini kısaltır ve hijyenik bir deneyim sunar.",
    specs: [
      { label: "Kullanıcı", value: "100.000'e kadar" },
      { label: "Doğrulama", value: "Yüz + kart + QR" },
      { label: "Ekran", value: "5\" dokunmatik" },
      { label: "Ağ", value: "Ethernet, Wi-Fi" },
    ],
  },

  // Sarf
  {
    id: "c587",
    slug: "rfid-kart-100-lu",
    name: "Temassız RFID Kart 13.56 MHz 100'lü Paket",
    brand: "ZKTeco",
    category: "otvt-sarf",
    price: 1890,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 132,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=stack%20of%20blank%20white%20rfid%20proximity%20cards%20fanned%20out%20on%20a%20clean%20light%20studio%20surface%2C%20access%20control%20consumable%20product%20photography%20with%20soft%20shadow%20and%20crisp%20edges&width=800&height=800&seq=c587-rfid-kart&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "100'lü RFID kart paketi, PDKS ve geçiş kontrolü kurulumlarında baskıya hazır boş kart sağlar.",
    specs: [
      { label: "Frekans", value: "13.56 MHz (MIFARE)" },
      { label: "Adet", value: "100" },
      { label: "Baskı", value: "Termal / UV baskıya uygun" },
      { label: "Garanti", value: "1 yıl" },
    ],
  },
  {
    id: "c588",
    slug: "termal-etiket-rulosu-100x150",
    name: "Termal Etiket Rulosu 100×150 mm (500'li)",
    brand: "Zebra",
    category: "otvt-sarf",
    price: 490,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 244,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=roll%20of%20white%20thermal%20label%20stickers%20on%20a%20plain%20light%20gray%20studio%20surface%2C%20packaging%20consumable%20product%20photography%20with%20clean%20minimal%20composition%20and%20soft%20shadow&width=800&height=800&seq=c588-etiket-rulo&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kargo ve raf etiketleri için uygun termal rulo, yüksek kontrastlı baskı verir.",
    specs: [
      { label: "Ölçü", value: "100 × 150 mm" },
      { label: "Adet", value: "500 etiket" },
      { label: "Tip", value: "Direkt termal" },
      { label: "Çekirdek", value: "25 mm" },
    ],
  },

  // IP kamera
  {
    id: "c589",
    slug: "hikvision-ds-2cd2143g2-4mp",
    name: "Hikvision DS-2CD2143G2-I 4MP Dome IP Kamera",
    brand: "Hikvision",
    category: "guvenlik-ip-kamera",
    price: 4290,
    oldPrice: 4590,
    rating: 4.6,
    reviewCount: 176,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20dome%20security%20camera%20with%20dark%20glass%20lens%20on%20a%20light%20gray%20studio%20background%2C%20professional%20surveillance%20hardware%20product%20photography%20with%20soft%20reflection%20and%20sharp%20detail&width=800&height=800&seq=c589-hikvision-dome&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "4 MP çözünürlüklü dome kamera, 30 metre IR mesafesi ve IP67 korumasıyla iç-dış mekânda çalışır.",
    specs: [
      { label: "Çözünürlük", value: "4 MP (2560×1440)" },
      { label: "Gece Görüşü", value: "30 m IR" },
      { label: "Koruma", value: "IP67, IK10" },
      { label: "Güç", value: "PoE" },
    ],
  },
  {
    id: "c590",
    slug: "dahua-ipc-hdw3549-5mp",
    name: "Dahua IPC-HDW3549H-AS 5MP Turret IP Kamera",
    brand: "Dahua",
    category: "guvenlik-ip-kamera",
    price: 4890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 118,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20turret%20style%20surveillance%20camera%20with%20black%20lens%20area%20on%20a%20clean%20neutral%20background%2C%20security%20camera%20product%20photography%20with%20even%20lighting%20and%20fine%20material%20detail&width=800&height=800&seq=c590-dahua-turret&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "5 MP turret kamera, akıllı hareket algılama ve renkli gece görüşüyle kayıt kalitesini artırır.",
    specs: [
      { label: "Çözünürlük", value: "5 MP" },
      { label: "Gece Görüşü", value: "Renkli, 40 m" },
      { label: "Özellik", value: "Akıllı hareket algılama" },
      { label: "Güç", value: "PoE" },
    ],
  },

  // NVR
  {
    id: "c591",
    slug: "hikvision-ds-7616ni-k2-nvr",
    name: "Hikvision DS-7616NI-K2 16 Kanal 4K NVR",
    brand: "Hikvision",
    category: "guvenlik-nvr",
    price: 7490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 94,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20rack%20style%20network%20video%20recorder%20with%20front%20usb%20ports%20on%20a%20light%20gray%20studio%20surface%2C%20surveillance%20recording%20hardware%20photography%20with%20sharp%20detail%20and%20soft%20shadow&width=800&height=800&seq=c591-hikvision-nvr&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "16 kanallı NVR, 4K kayıt ve çift disk yuvasıyla orta ölçek kurulumlara uygundur.",
    specs: [
      { label: "Kanal", value: "16 IP kanal" },
      { label: "Çözünürlük", value: "4K'ya kadar" },
      { label: "Disk", value: "2× SATA (16 TB)" },
      { label: "Bant Genişliği", value: "160 Mbps" },
    ],
  },
  {
    id: "c592",
    slug: "dahua-nvr5216-16p-4ks2e",
    name: "Dahua NVR5216-16P-4KS2E 16 Kanal PoE NVR",
    brand: "Dahua",
    category: "guvenlik-nvr",
    price: 12900,
    oldPrice: 13900,
    rating: 4.6,
    reviewCount: 61,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%201u%20network%20video%20recorder%20with%20poe%20ports%20on%20the%20rear%20panel%20on%20a%20clean%20light%20background%2C%20professional%20security%20recording%20equipment%20photography%20with%20crisp%20detail&width=800&height=800&seq=c592-dahua-nvr&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "16 port PoE NVR, kameraları doğrudan besleyerek ek switch ihtiyacını ortadan kaldırır.",
    specs: [
      { label: "Kanal", value: "16 kanal + 16 PoE" },
      { label: "PoE Bütçesi", value: "240 W" },
      { label: "Disk", value: "4× SATA" },
      { label: "Çözünürlük", value: "4K" },
    ],
  },

  // Hazır set
  {
    id: "c593",
    slug: "guvenlik-seti-8-kanal-8-kamera",
    name: "8 Kanallı 8 Kameralı 4 MP Hazır Güvenlik Seti",
    brand: "Hikvision",
    category: "guvenlik-set",
    price: 34900,
    oldPrice: 37900,
    rating: 4.6,
    reviewCount: 73,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=security%20camera%20kit%20with%20eight%20white%20cameras%20arranged%20beside%20a%20recorder%20on%20a%20light%20gray%20studio%20surface%2C%20packaged%20surveillance%20system%20product%20photography%20with%20clean%20layout&width=800&height=800&seq=c593-set-8-kanal&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Set içinde 8 IP kamera, 8 kanallı NVR, 2 TB disk ve kablolar bulunur; kuruluma hazırdır.",
    specs: [
      { label: "Kamera", value: "8× 4 MP IP" },
      { label: "Kayıt", value: "8 kanal NVR" },
      { label: "Disk", value: "2 TB" },
      { label: "Kapsam", value: "Kablo ve adaptörler dahil" },
    ],
  },
  {
    id: "c594",
    slug: "guvenlik-seti-4-kanal-4-kamera",
    name: "4 Kanallı 4 Kameralı 4 MP Hazır Güvenlik Seti",
    brand: "Dahua",
    category: "guvenlik-set",
    price: 19900,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=small%20security%20camera%20bundle%20with%20four%20cameras%20and%20compact%20recorder%20on%20a%20clean%20white%20surface%2C%20retail%20surveillance%20kit%20product%20photography%20with%20soft%20shadow%20and%20clear%20detail&width=800&height=800&seq=c594-set-4-kanal&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Küçük işletmeler için hazırlanan set, dört kamera ve 1 TB disk ile temel güvenlik ihtiyacını karşılar.",
    specs: [
      { label: "Kamera", value: "4× 4 MP IP" },
      { label: "Kayıt", value: "4 kanal NVR" },
      { label: "Disk", value: "1 TB" },
      { label: "Kapsam", value: "Kablo ve adaptörler dahil" },
    ],
  },

  // Geçiş kontrolü
  {
    id: "c595",
    slug: "suprema-xpass-2-okuyucu",
    name: "Suprema XPass 2 RFID Kart Okuyucu",
    brand: "Suprema",
    category: "guvenlik-gecis",
    price: 4890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 57,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=slim%20black%20wall%20mounted%20rfid%20card%20reader%20with%20led%20indicator%20on%20a%20light%20neutral%20background%2C%20access%20control%20hardware%20product%20photography%20with%20crisp%20edges%20and%20soft%20light&width=800&height=800&seq=c595-xpass-2&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "XPass 2, IP65 koruması ve çoklu kart desteğiyle kapı girişlerinde güvenli okuma yapar.",
    specs: [
      { label: "Okuma", value: "MIFARE, DESFire, NFC" },
      { label: "Koruma", value: "IP65" },
      { label: "Arayüz", value: "Wiegand, RS-485" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c596",
    slug: "dahua-vto2211-ip-kapi-stationu",
    name: "Dahua VTO2211G-WP IP Kapı Stationu",
    brand: "Dahua",
    category: "guvenlik-gecis",
    price: 8490,
    oldPrice: 8990,
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=outdoor%20ip%20video%20intercom%20door%20station%20with%20camera%20and%20call%20button%20on%20a%20light%20gray%20background%2C%20access%20control%20product%20photography%20with%20soft%20shadow%20and%20fine%20detail&width=800&height=800&seq=c596-vto2211&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "IP kapı stationu, ziyaretçi görüşmesi ve uzaktan kapı açma işlevlerini tek cihazda sunar.",
    specs: [
      { label: "Kamera", value: "2 MP geniş açı" },
      { label: "Görüşme", value: "Çift yönlü ses" },
      { label: "Koruma", value: "IP65, IK08" },
      { label: "Güç", value: "PoE" },
    ],
  },

  // Alarm
  {
    id: "c597",
    slug: "paradox-sp5500-alarm-paneli",
    name: "Paradox SP5500 Hırsız Alarm Paneli",
    brand: "Paradox",
    category: "guvenlik-alarm",
    price: 4790,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 68,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=metal%20alarm%20control%20panel%20board%20with%20terminal%20blocks%20on%20a%20clean%20light%20gray%20surface%2C%20security%20electronics%20product%20photography%20with%20precise%20technical%20detail%20and%20even%20lighting&width=800&height=800&seq=c597-paradox-sp5500&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "SP5500, genişletilebilir bölge yapısı ve uzaktan yönetim desteğiyle ticari alarm kurulumlarına uygundur.",
    specs: [
      { label: "Bölge", value: "5 giriş, 32'ye genişletilebilir" },
      { label: "Kullanıcı", value: "48 şifre" },
      { label: "Haberleşme", value: "IP / GSM modül desteği" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c598",
    slug: "bosch-hareket-dedektoru",
    name: "Bosch ISC-BPR2 PIR Hareket Dedektörü",
    brand: "Bosch",
    category: "guvenlik-alarm",
    price: 890,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 124,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20pir%20motion%20detector%20sensor%20for%20alarm%20systems%20on%20a%20clean%20white%20studio%20surface%2C%20compact%20security%20sensor%20product%20photography%20with%20soft%20shadow%20and%20crisp%20edges&width=800&height=800&seq=c598-bosch-pir&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PIR dedektör, 12 metre algılama mesafesi ve yanlış alarm filtreleriyle iç mekân koruması sağlar.",
    specs: [
      { label: "Algılama", value: "12 m / 90°" },
      { label: "Montaj", value: "Duvar, köşe" },
      { label: "Filtre", value: "Yanlış alarm önleyici" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
];