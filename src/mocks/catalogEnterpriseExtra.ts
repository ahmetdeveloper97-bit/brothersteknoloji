import type { Product } from "@/types/store";

/** Kurumsal ürünler ve kesintisiz güç kaynakları için ek katalog */
export const catalogEnterpriseExtra: Product[] = [
  // NAS
  {
    id: "c561",
    slug: "synology-ds1522-plus-nas",
    name: "Synology DiskStation DS1522+ 5 Yuvalı NAS (Disk Hariç)",
    brand: "Synology",
    category: "sunucu-nas",
    price: 32900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 78,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20five%20bay%20nas%20enclosure%20with%20drive%20trays%20visible%20on%20a%20light%20gray%20studio%20background%2C%20professional%20network%20storage%20product%20photography%20with%20soft%20shadow%20and%20precise%20detail&width=800&height=800&seq=c561-ds1522-plus&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "DS1522+, genişletme birimi desteği ve snapshot özellikleriyle orta ölçekli ekiplerin dosya sunucusu ihtiyacını karşılar.",
    specs: [
      { label: "Disk Yuvası", value: "5 (genişletilebilir)" },
      { label: "İşlemci", value: "AMD Ryzen R1600" },
      { label: "Bellek", value: "8 GB DDR4 ECC" },
      { label: "Ağ", value: "4× 1GbE" },
    ],
  },
  {
    id: "c562",
    slug: "qnap-ts-464-4-bay-nas",
    name: "QNAP TS-464 4 Yuvalı 2.5GbE NAS (Disk Hariç)",
    brand: "QNAP",
    category: "sunucu-nas",
    price: 24900,
    oldPrice: 26400,
    rating: 4.6,
    reviewCount: 54,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20four%20bay%20nas%20device%20with%20front%20usb%20port%20and%20drive%20caddies%20on%20a%20clean%20light%20background%2C%20storage%20hardware%20product%20photography%20with%20even%20lighting%20and%20crisp%20texture&width=800&height=800&seq=c562-ts-464&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "TS-464, çift 2.5GbE portu ve 4K HDMI çıkışıyla yedekleme ve medya sunucusu işlerini birlikte yürütür.",
    specs: [
      { label: "Disk Yuvası", value: "4" },
      { label: "İşlemci", value: "Intel Celeron N5095" },
      { label: "Bellek", value: "8 GB DDR4" },
      { label: "Ağ", value: "2× 2.5GbE" },
    ],
  },

  // Sunucu
  {
    id: "c563",
    slug: "hpe-proliant-ml350-gen11-xeon-silver",
    name: "HPE ProLiant ML350 Gen11 Xeon Silver 4410Y 32GB Tower Sunucu",
    brand: "HPE",
    category: "sunucu-server",
    price: 189900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 23,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=tower%20server%20chassis%20with%20front%20access%20panels%20and%20ventilation%20grille%20on%20a%20neutral%20gray%20studio%20background%2C%20enterprise%20server%20product%20photography%20with%20soft%20directional%20light%20and%20fine%20detail&width=800&height=800&seq=c563-ml350-gen11&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "ML350 Gen11, dört kanallı bellek mimarisi ve yedekli güç seçeneğiyle şirket içi sanallaştırma için uygundur.",
    specs: [
      { label: "İşlemci", value: "Xeon Silver 4410Y (12C)" },
      { label: "Bellek", value: "32 GB DDR5 ECC" },
      { label: "Disk Yuvası", value: "8× SFF" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c564",
    slug: "dell-poweredge-t360-xeon-e-2434",
    name: "Dell PowerEdge T360 Xeon E-2434 16GB Tower Sunucu",
    brand: "Dell",
    category: "sunucu-server",
    price: 79900,
    oldPrice: 84900,
    rating: 4.5,
    reviewCount: 31,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20tower%20server%20with%20front%20bezel%20and%20small%20display%20panel%20on%20a%20clean%20light%20gray%20surface%2C%20professional%20data%20center%20hardware%20photography%20with%20soft%20shadow%20and%20clean%20lines&width=800&height=800&seq=c564-poweredge-t360&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "T360, sessiz çalışan gövdesiyle küçük ofislerde dosya ve uygulama sunucusu olarak konumlandırılabilir.",
    specs: [
      { label: "İşlemci", value: "Xeon E-2434 (4C)" },
      { label: "Bellek", value: "16 GB DDR5 ECC" },
      { label: "Disk Yuvası", value: "4× 3.5\" hot-plug" },
      { label: "Garanti", value: "3 yıl yerinde" },
    ],
  },

  // Depolama diski
  {
    id: "c565",
    slug: "seagate-exos-x18-16tb",
    name: "Seagate Exos X18 16TB 3.5\" 7200rpm Kurumsal Sabit Disk",
    brand: "Seagate",
    category: "sunucu-disk",
    price: 14900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=large%20enterprise%20hard%20drive%20with%20silver%20label%20on%20a%20clean%20white%20studio%20surface%2C%20data%20storage%20hardware%20product%20photography%20with%20sharp%20reflection%20and%20precise%20metallic%20detail&width=800&height=800&seq=c565-exos-x18&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Exos X18, 7/24 çalışma sertifikası ve yüksek aktarım hızıyla yedekleme havuzlarında kullanılır.",
    specs: [
      { label: "Kapasite", value: "16 TB" },
      { label: "Devir / Önbellek", value: "7200 rpm / 256 MB" },
      { label: "Arayüz", value: "SATA 6 Gb/s" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },
  {
    id: "c566",
    slug: "wd-red-pro-6tb-nas-disk",
    name: "WD Red Pro 6TB 3.5\" 7200rpm NAS Sabit Disk",
    brand: "WD",
    category: "sunucu-disk",
    price: 7490,
    oldPrice: 7990,
    rating: 4.6,
    reviewCount: 112,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=nas%20grade%20hard%20disk%20drive%20with%20red%20label%20lying%20on%20a%20light%20gray%20studio%20surface%2C%20clean%20storage%20hardware%20product%20photography%20with%20soft%20shadow%20and%20crisp%20label%20detail&width=800&height=800&seq=c566-red-pro-6tb&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Red Pro, titreşim dengeleme teknolojisiyle çok yuvalı NAS sistemlerinde kararlı çalışır.",
    specs: [
      { label: "Kapasite", value: "6 TB" },
      { label: "Devir / Önbellek", value: "7200 rpm / 256 MB" },
      { label: "Arayüz", value: "SATA 6 Gb/s" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },

  // Sunucu aksesuarı
  {
    id: "c567",
    slug: "rack-kabin-42u-800mm",
    name: "19\" 42U Rack Kabin 800×1000 mm (Cam Kapaklı)",
    brand: "TSE",
    category: "kurumsal-sunucu-aksesuar",
    price: 29900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 41,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20server%20rack%20cabinet%20with%20glass%20front%20door%20and%20perforated%20panels%20standing%20in%20a%20clean%20bright%20room%2C%20data%20center%20equipment%20photography%20with%20even%20lighting%20and%20clean%20perspective&width=800&height=800&seq=c567-rack-42u&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "42U kabin, kilitli cam kapak ve havalandırma panelleriyle sunucu odalarında güvenli montaj sağlar.",
    specs: [
      { label: "Yükseklik", value: "42U" },
      { label: "Ölçüler", value: "800 × 1000 mm" },
      { label: "Kapak", value: "Cam ön kapak, kilitli" },
      { label: "Taşıma", value: "2.000 kg statik" },
    ],
  },
  {
    id: "c568",
    slug: "dell-1u-rail-kit",
    name: "Dell PowerEdge 1U Ray Kiti (Sliding Rails)",
    brand: "Dell",
    category: "kurumsal-sunucu-aksesuar",
    price: 4290,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 28,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=metal%20server%20rail%20kit%20components%20laid%20out%20on%20a%20light%20gray%20studio%20surface%2C%20technical%20data%20center%20accessory%20product%20photography%20with%20precise%20metallic%20detail%20and%20even%20lighting&width=800&height=800&seq=c568-dell-rail-kit&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kayar ray kiti, PowerEdge 1U sunucuların rack kabin içinde kolay servis edilmesini sağlar.",
    specs: [
      { label: "Uyumluluk", value: "PowerEdge 1U modeller" },
      { label: "Tip", value: "Kayar ray (sliding)" },
      { label: "Malzeme", value: "Çelik" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // POS & Kiosk
  {
    id: "c569",
    slug: "pos-terminal-15-6-dokunmatik",
    name: "15.6\" Dokunmatik POS Terminali i5 8GB 128GB",
    brand: "Partner Tech",
    category: "kurumsal-pos",
    price: 27900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 47,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20touchscreen%20point%20of%20sale%20terminal%20with%20aluminium%20stand%20on%20a%20clean%20light%20gray%20studio%20background%2C%20retail%20technology%20product%20photography%20with%20soft%20reflection%20and%20sharp%20screen%20detail&width=800&height=800&seq=c569-pos-terminal&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Kasa önü kullanım için tasarlanan terminal, darbeye dayanıklı dokunmatik ekranıyla hızlı işlem yapılmasını sağlar.",
    specs: [
      { label: "Ekran", value: "15.6\" kapasitif dokunmatik" },
      { label: "İşlemci", value: "Intel Core i5" },
      { label: "Bellek / Disk", value: "8 GB / 128 GB SSD" },
      { label: "Ekstra", value: "MSR, 2. satır müşteri ekranı" },
    ],
  },
  {
    id: "c570",
    slug: "self-servis-kiosk-27",
    name: "27\" Self Servis Dokunmatik Kiosk Ünitesi",
    brand: "KioskPro",
    category: "kurumsal-pos",
    price: 64900,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 19,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=tall%20freestanding%20self%20service%20kiosk%20with%20large%20touch%20display%20standing%20in%20a%20bright%20modern%20lobby%2C%20commercial%20display%20product%20photography%20with%20clean%20lines%20and%20soft%20neutral%20palette&width=800&height=800&seq=c570-self-kiosk&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Sıra numarası ve bilgi ekranı senaryoları için hazırlanan kiosk, banket ve şube girişlerinde kullanılır.",
    specs: [
      { label: "Ekran", value: "27\" dokunmatik, 1080p" },
      { label: "Gövde", value: "Toz boyalı çelik" },
      { label: "Bilgisayar", value: "Mini PC yuvası" },
      { label: "Montaj", value: "Zemin sabitleme" },
    ],
  },

  // UPS
  {
    id: "c571",
    slug: "apc-smart-ups-smt1500i",
    name: "APC Smart-UPS SMT1500I 1500VA LCD Line-Interactive UPS",
    brand: "APC",
    category: "sunucu-ups",
    price: 24900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 132,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20tower%20ups%20unit%20with%20lcd%20display%20panel%20on%20the%20front%20standing%20on%20a%20light%20gray%20studio%20surface%2C%20professional%20power%20protection%20hardware%20photography%20with%20soft%20shadow%20and%20crisp%20detail&width=800&height=800&seq=c571-smt1500i&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "SMT1500I, LCD paneli ve akıllı yönetim yazılımıyla sunucu ve ağ kabinlerini güvenle kapatır.",
    specs: [
      { label: "Güç", value: "1500 VA / 1000 W" },
      { label: "Topoloji", value: "Line-Interactive" },
      { label: "Çıkış", value: "8× IEC C13" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c572",
    slug: "eaton-5e-2000va-ups",
    name: "Eaton 5E 2000VA Line-Interactive UPS",
    brand: "Eaton",
    category: "sunucu-ups",
    price: 16900,
    oldPrice: 17900,
    rating: 4.5,
    reviewCount: 88,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20ups%20device%20with%20small%20status%20display%20and%20schuko%20outlets%20on%20a%20clean%20white%20studio%20background%2C%20power%20backup%20hardware%20product%20photography%20with%20soft%20lighting%20and%20clean%20geometry&width=800&height=800&seq=c572-eaton-5e-2000&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "5E 2000VA, ofis ekipmanları ve küçük sunucular için ekonomik voltaj koruması sunar.",
    specs: [
      { label: "Güç", value: "2000 VA / 1200 W" },
      { label: "Çıkış", value: "6× Schuko" },
      { label: "Topoloji", value: "Line-Interactive" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Akü
  {
    id: "c573",
    slug: "apc-rbc7-yedek-aku",
    name: "APC RBC7 Yedek Akü Kartuşu (Smart-UPS 1500)",
    brand: "APC",
    category: "guc-aku",
    price: 5490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20sealed%20battery%20cartridge%20for%20ups%20with%20connectors%20on%20a%20light%20gray%20studio%20surface%2C%20industrial%20battery%20product%20photography%20with%20soft%20shadow%20and%20clear%20hardware%20detail&width=800&height=800&seq=c573-rbc7&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "RBC7 akü kartuşu, Smart-UPS 1500 modellerinde ömrünü tamamlayan bataryayı yeniler.",
    specs: [
      { label: "Uyumluluk", value: "Smart-UPS 1500" },
      { label: "Tip", value: "Kurşun asit, bakımsız" },
      { label: "Gerilim", value: "24 V" },
      { label: "Garanti", value: "1 yıl" },
    ],
  },
  {
    id: "c574",
    slug: "ups-akü-12v-9ah",
    name: "12V 9Ah Bakımsız UPS Aküsü",
    brand: "CSB",
    category: "guc-aku",
    price: 1190,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 156,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=rectangular%20sealed%20lead%20acid%20battery%20with%20red%20and%20black%20terminals%20on%20a%20clean%20white%20studio%20background%2C%20industrial%20battery%20product%20photography%20with%20soft%20even%20lighting&width=800&height=800&seq=c574-ups-battery-12v&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Standart 12V 9Ah akü, küçük UPS ve alarm panellerinde yedek güç sağlar.",
    specs: [
      { label: "Gerilim", value: "12 V" },
      { label: "Kapasite", value: "9 Ah" },
      { label: "Tip", value: "VRLA, bakımsız" },
      { label: "Garanti", value: "1 yıl" },
    ],
  },

  // Regülatör
  {
    id: "c575",
    slug: "makelsan-5kva-regulator",
    name: "Makelsan 5 kVA Voltaj Regülatörü",
    brand: "Makelsan",
    category: "guc-regulator",
    price: 12900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 52,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=gray%20industrial%20voltage%20stabilizer%20box%20with%20analog%20meter%20on%20a%20clean%20light%20gray%20studio%20surface%2C%20power%20equipment%20product%20photography%20with%20soft%20shadow%20and%20precise%20detail&width=800&height=800&seq=c575-makelsan-5kva&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "5 kVA regülatör, dalgalanan şebeke gerilimini hassas cihazlar için sabit seviyede tutar.",
    specs: [
      { label: "Güç", value: "5 kVA" },
      { label: "Giriş Aralığı", value: "130–280 V" },
      { label: "Çıkış", value: "220 V ± %3" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c576",
    slug: "akim-korumali-6-li-priz",
    name: "6'lı Akım Korumalı Grup Priz (2 m Kablo)",
    brand: "Schneider",
    category: "guc-regulator",
    price: 690,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 218,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20six%20outlet%20power%20strip%20with%20surge%20protection%20switch%20on%20a%20clean%20white%20studio%20background%2C%20household%20electronics%20product%20photography%20with%20soft%20shadow%20and%20clean%20minimal%20styling&width=800&height=800&seq=c576-surge-priz&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Grup priz, ani gerilim dalgalanmalarını sönümleyerek bilgisayar ve yazıcıları korur.",
    specs: [
      { label: "Priz", value: "6× topraklı" },
      { label: "Kablo", value: "2 m" },
      { label: "Koruma", value: "Akım / gerilim" },
      { label: "Anahtar", value: "Işıklı açma-kapama" },
    ],
  },

  // PDU
  {
    id: "c577",
    slug: "apc-rack-pdu-8-priz",
    name: "APC Rack PDU 8 Priz 1U 16A",
    brand: "APC",
    category: "guc-pdu",
    price: 4290,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 63,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%201u%20rack%20power%20distribution%20unit%20with%20eight%20outlets%20mounted%20horizontally%20on%20a%20light%20gray%20background%2C%20data%20center%20power%20hardware%20photography%20with%20sharp%20detail&width=800&height=800&seq=c577-rack-pdu-8&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "1U PDU, rack kabin içindeki cihazlara düzenli ve güvenli güç dağıtımı sağlar.",
    specs: [
      { label: "Priz", value: "8× C13" },
      { label: "Akım", value: "16 A" },
      { label: "Montaj", value: "1U rack" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c578",
    slug: "pdu-16a-12-priz-metre",
    name: "Rack PDU 16A 12 Priz Dikey Güç Dağıtım Ünitesi",
    brand: "Vertiv",
    category: "guc-pdu",
    price: 5890,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 37,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=vertical%20rack%20power%20strip%20with%20many%20outlets%20and%20digital%20meter%20standing%20on%20a%20light%20neutral%20background%2C%20professional%20data%20center%20power%20product%20photography%20with%20precise%20detail&width=800&height=800&seq=c578-vertical-pdu&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dikey PDU, yüksek yoğunluklu kabinlerde priz erişimini kolaylaştırır ve akım tüketimini gösterir.",
    specs: [
      { label: "Priz", value: "12× C13 + 2× C19" },
      { label: "Akım", value: "16 A" },
      { label: "Gösterge", value: "Dijital ampermetre" },
      { label: "Montaj", value: "Dikey (0U)" },
    ],
  },
];