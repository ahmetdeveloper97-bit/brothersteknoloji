import type { Product } from "@/types/store";

/** Kurumsal ürünler, kesintisiz güç ve barkod/PDKS kataloğu */
export const catalogEnterprise: Product[] = [
  // Kurumsal → NAS
  {
    id: "c301",
    slug: "synology-ds1522-plus-nas",
    name: "Synology DiskStation DS1522+ 5 Yuvalı NAS",
    brand: "Synology",
    category: "sunucu-nas",
    price: 42900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 51,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=five%20bay%20desktop%20nas%20enclosure%20with%20drive%20trays%20partially%20visible%20on%20clean%20white%20studio%20background%2C%20premium%20storage%20hardware%20product%20photography&width=800&height=800&seq=catalog-ds1522&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "DS1522+, genişletme üniteleriyle 15 diske kadar büyüyebilen yapısıyla dosya sunucusu ve sanal makine deposu olarak kullanılabilir.",
    specs: [
      { label: "Disk Yuvası", value: "5× 3.5\" hot-swap" },
      { label: "İşlemci", value: "AMD Ryzen R1600 (2C/4T)" },
      { label: "Ağ", value: "4× 1GbE" },
      { label: "Bellek", value: "8 GB DDR4 ECC (32 GB'a kadar)" },
    ],
  },
  {
    id: "c302",
    slug: "qnap-ts-253e-8g-nas",
    name: "QNAP TS-253E-8G 2 Yuvalı Kompakt NAS",
    brand: "QNAP",
    category: "sunucu-nas",
    price: 16900,
    oldPrice: 18200,
    rating: 4.5,
    reviewCount: 29,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=two%20bay%20compact%20nas%20device%20with%20front%20usb%20port%20on%20light%20neutral%20background%2C%20small%20business%20storage%20product%20photography&width=800&height=800&seq=catalog-ts253e&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Şube ofisler için sessiz çalışan TS-253E, anlık görüntü yedekleme ve uzak erişim özellikleriyle dosya paylaşımını merkezileştirir.",
    specs: [
      { label: "Disk Yuvası", value: "2× 3.5\" hot-swap" },
      { label: "İşlemci", value: "Intel Celeron J6412 (4C)" },
      { label: "Bellek", value: "8 GB DDR4" },
      { label: "Ağ", value: "2× 2.5GbE" },
    ],
  },

  // Sunucu
  {
    id: "c303",
    slug: "hpe-proliant-dl360-gen11-rack-sunucu",
    name: "HPE ProLiant DL360 Gen11 Xeon Silver 4410Y 32GB Rack Sunucu",
    brand: "HPE",
    category: "sunucu-server",
    price: 198900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 12,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=1u%20rack%20server%20with%20front%20drive%20bays%20and%20vents%20on%20light%20gray%20studio%20background%2C%20enterprise%20data%20center%20hardware%20product%20photography&width=800&height=800&seq=catalog-dl360-g11&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "1U form faktöründeki DL360 Gen11, sanallaştırma kümelerinde yüksek yoğunluk ve iLO 6 ile uzaktan yönetim sunar.",
    specs: [
      { label: "İşlemci", value: "Xeon Silver 4410Y (12C)" },
      { label: "Bellek", value: "32 GB DDR5 ECC" },
      { label: "Disk Yuvası", value: "8× SFF hot-plug" },
      { label: "Form Faktör", value: "1U rack" },
    ],
  },
  {
    id: "c304",
    slug: "dell-poweredge-r450-rack-sunucu",
    name: "Dell PowerEdge R450 Xeon Silver 4310 32GB Rack Sunucu",
    brand: "Dell",
    category: "sunucu-server",
    price: 164500,
    oldPrice: 172000,
    rating: 4.6,
    reviewCount: 17,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20rack%20mount%20server%20chassis%20with%20perforated%20front%20bezel%20on%20neutral%20light%20background%2C%20professional%20server%20hardware%20photography&width=800&height=800&seq=catalog-r450&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "R450, iDRAC9 ile uzaktan bakım kolaylığı ve dengeli fiyat performansıyla KOBİ veri merkezleri için uygun bir rack sunucudur.",
    specs: [
      { label: "İşlemci", value: "Xeon Silver 4310 (12C)" },
      { label: "Bellek", value: "32 GB DDR4 ECC" },
      { label: "Disk Yuvası", value: "4× 3.5\" hot-plug" },
      { label: "Yönetim", value: "iDRAC9 Enterprise" },
    ],
  },

  // Depolama diskleri
  {
    id: "c305",
    slug: "seagate-exos-7e8-8tb-kurumsal-disk",
    name: "Seagate Exos 7E8 8TB 3.5\" Kurumsal Sabit Disk",
    brand: "Seagate",
    category: "sunucu-disk",
    price: 9290,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 44,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=enterprise%20class%203.5%20inch%20hard%20drive%20with%20silver%20label%20on%20clean%20light%20background%2C%20storage%20hardware%20product%20photography&width=800&height=800&seq=catalog-exos-7e8&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "7/24 çalışma için tasarlanan Exos 7E8, sunucu ve yedekleme ünitelerinde yüksek yazma dayanımı sağlar.",
    specs: [
      { label: "Kapasite", value: "8 TB" },
      { label: "Devir / Önbellek", value: "7200 rpm / 256 MB" },
      { label: "Çalışma Yükü", value: "550 TB/yıl" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },
  {
    id: "c306",
    slug: "samsung-pm893a-1-92tb-enterprise-ssd",
    name: "Samsung PM893 1.92TB SATA Kurumsal SSD",
    brand: "Samsung",
    category: "sunucu-disk",
    price: 11400,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 31,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=data%20center%202.5%20inch%20enterprise%20ssd%20with%20grey%20casing%20on%20light%20neutral%20surface%2C%20server%20storage%20product%20photography&width=800&height=800&seq=catalog-pm893&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PM893, güç kaybı koruması ve yüksek dayanımıyla sunucularda veritabanı diski olarak güvenle kullanılır.",
    specs: [
      { label: "Kapasite", value: "1.92 TB" },
      { label: "Arayüz", value: "SATA 6 Gb/s" },
      { label: "Okuma / Yazma", value: "550 / 520 MB/s" },
      { label: "Dayanım", value: "1.3 DWPD" },
    ],
  },

  // Sunucu aksesuarı
  {
    id: "c307",
    slug: "rack-kabin-22u-cam-kapili",
    name: "19\" 22U Cam Kapılı Rack Kabin (600×800 mm)",
    brand: "Digitus",
    category: "kurumsal-sunucu-aksesuar",
    price: 13900,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 26,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20server%20rack%20cabinet%20with%20glass%20front%20door%20standing%20on%20light%20gray%20studio%20background%2C%20data%20center%20furniture%20product%20photography&width=800&height=800&seq=catalog-rack-22u&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "22U kabin, sunucu ve switch montajı için ayarlanabilir rayları ve kilitli cam kapısıyla sistem odası düzenini sağlar.",
    specs: [
      { label: "Yükseklik", value: "22U" },
      { label: "Ölçü", value: "600 × 800 mm" },
      { label: "Kapasite", value: "600 kg statik yük" },
      { label: "Aksesuar", value: "Fan kiti, PDU montaj rayları" },
    ],
  },
  {
    id: "c308",
    slug: "apc-rack-pdu-8-prizli",
    name: "APC Rack PDU 8 Prizli 1U Güç Dağıtım Ünitesi",
    brand: "APC",
    category: "kurumsal-sunucu-aksesuar",
    price: 4290,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 38,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=1u%20rack%20power%20distribution%20unit%20with%20eight%20outlets%20on%20light%20gray%20studio%20background%2C%20data%20center%20power%20hardware%20product%20photo&width=800&height=800&seq=catalog-apc-pdu&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "1U PDU, rack içindeki cihazlara dengeli güç dağıtımı yaparak kablo karmaşasını ve aşırı yüklenmeyi önler.",
    specs: [
      { label: "Priz Sayısı", value: "8× IEC C13" },
      { label: "Akım", value: "16 A" },
      { label: "Montaj", value: "1U rack" },
      { label: "Koruma", value: "Aşırı yük göstergesi" },
    ],
  },

  // POS
  {
    id: "c309",
    slug: "posbank-apex-dokunmatik-pos",
    name: "Posbank Apexa G 15.6\" Dokunmatik POS Terminali",
    brand: "Posbank",
    category: "kurumsal-pos",
    price: 24900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20touchscreen%20point%20of%20sale%20terminal%20with%20aluminium%20stand%20on%20light%20neutral%20background%2C%20retail%20pos%20hardware%20product%20photography&width=800&height=800&seq=catalog-posbank-apexa&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Fansız gövdesi ve kapasitif dokunmatik ekranıyla Apexa G, yoğun mağaza kasalarında günlerce kesintisiz çalışır.",
    specs: [
      { label: "Ekran", value: "15.6\" kapasitif dokunmatik" },
      { label: "İşlemci", value: "Intel Celeron J6412" },
      { label: "Bellek / Disk", value: "8 GB / 128 GB SSD" },
      { label: "İşletim Sistemi", value: "Windows 10 IoT" },
    ],
  },
  {
    id: "c310",
    slug: "kiosk-self-servis-terminali-32",
    name: "32\" Self Servis Kiosk Terminali (Dokunmatik, Masüstü)",
    brand: "Posbank",
    category: "kurumsal-pos",
    price: 42900,
    oldPrice: 46900,
    rating: 4.3,
    reviewCount: 18,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=freestanding%20self%20service%20kiosk%20with%20large%20touchscreen%20on%20light%20gray%20studio%20background%2C%20modern%20retail%20technology%20product%20photography&width=800&height=800&seq=catalog-kiosk-32&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%9", tone: "discount" },
    ],
    description:
      "Sıra numarası ve bilgilendirme ekranı olarak kullanılabilen kiosk, banko önlerindeki yoğunluğu azaltır.",
    specs: [
      { label: "Ekran", value: "32\" dokunmatik, 1080p" },
      { label: "Gövde", value: "Elektrostatik boyalı metal" },
      { label: "Bağlantı", value: "RJ45, Wi-Fi, USB" },
      { label: "Kurulum", value: "Zemin / duvar opsiyonu" },
    ],
  },

  // UPS
  {
    id: "c311",
    slug: "eaton-5p-1550i-ups",
    name: "Eaton 5P 1550i LCD Line-Interactive UPS",
    brand: "Eaton",
    category: "sunucu-ups",
    price: 14900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 66,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20tower%20ups%20unit%20with%20lcd%20panel%20and%20power%20button%20on%20light%20gray%20studio%20background%2C%20power%20protection%20hardware%20product%20photography&width=800&height=800&seq=catalog-eaton-5p1550&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "5P 1550i, enerji verimliliği yüksek line-interactive topolojisiyle küçük sunucu odalarında güvenli kapanış süresi tanır.",
    specs: [
      { label: "Güç", value: "1550 VA / 1100 W" },
      { label: "Çıkışlar", value: "8× IEC C13" },
      { label: "Ekran", value: "LCD bilgi paneli" },
      { label: "Yazılım", value: "Eaton UPS Companion" },
    ],
  },
  {
    id: "c312",
    slug: "makelsan-lion-2000-ups",
    name: "Makelsan Lion 2000 VA Line-Interactive UPS",
    brand: "Makelsan",
    category: "sunucu-ups",
    price: 8990,
    oldPrice: 9490,
    rating: 4.4,
    reviewCount: 91,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20ups%20device%20with%20schuko%20outlets%20and%20small%20display%20on%20neutral%20studio%20background%2C%20local%20power%20backup%20hardware%20product%20photo&width=800&height=800&seq=catalog-makelsan-lion&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Lion 2000, yoğun voltaj dalgalanmalarının olduğu bölgelerde kasa ve ağ cihazlarını korur.",
    specs: [
      { label: "Güç", value: "2000 VA / 1200 W" },
      { label: "Çıkışlar", value: "4× Schuko" },
      { label: "Topoloji", value: "Line-interactive, AVR" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Akü
  {
    id: "c313",
    slug: "apc-rbc7-yedek-aku",
    name: "APC RBC7 Yedek Akü Kartuşu (Smart-UPS 1500)",
    brand: "APC",
    category: "guc-aku",
    price: 5490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 58,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=sealed%20lead%20acid%20battery%20cartridge%20pack%20for%20ups%20on%20light%20gray%20studio%20background%2C%20power%20backup%20component%20product%20photography&width=800&height=800&seq=catalog-rbc7&orientation=squarish",
    tags: [{ label: "Orijinal", tone: "primary" }],
    description:
      "Smart-UPS 1500 serisi için orijinal RBC7 akü kartuşu, cihazın kesintisiz çalışma süresini ilk günkü seviyeye döndürür.",
    specs: [
      { label: "Uyumlu Model", value: "Smart-UPS 1500 VA" },
      { label: "Tip", value: "Kurşun asit, sızdırmaz" },
      { label: "Kullanım Ömrü", value: "3–5 yıl" },
      { label: "Montaj", value: "Sökülebilir kartuş" },
    ],
  },
  {
    id: "c314",
    slug: "inform-12v-9ah-aku-grubu",
    name: "Inform 12V 9Ah UPS Akü Grubu (4'lü Set)",
    brand: "Inform",
    category: "guc-aku",
    price: 3790,
    oldPrice: 4190,
    rating: 4.3,
    reviewCount: 37,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=four%20small%20sealed%20batteries%20arranged%20in%20block%20for%20ups%20replacement%20on%20light%20neutral%20background%2C%20battery%20hardware%20product%20photo&width=800&height=800&seq=catalog-aku-12v9ah&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "4'lü akü seti, ups bakım planlamasında toplu değişim yapmak isteyen teknik servisler için pratik bir çözümdür.",
    specs: [
      { label: "Gerilim / Kapasite", value: "12 V / 9 Ah" },
      { label: "Paket", value: "4 adet" },
      { label: "Bağlantı", value: "Faston terminal" },
      { label: "Garanti", value: "1 yıl" },
    ],
  },

  // Regülatör
  {
    id: "c315",
    slug: "makelsan-regulator-5kva",
    name: "Makelsan 5 kVA Servo Voltaj Regülatörü",
    brand: "Makelsan",
    category: "guc-regulator",
    price: 16900,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 22,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=industrial%20voltage%20regulator%20box%20with%20analog%20meter%20on%20light%20gray%20studio%20background%2C%20electrical%20protection%20equipment%20product%20photography&width=800&height=800&seq=catalog-regulator-5kva&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Servo regülatör, laboratuvar ve üretim hatlarında hassas cihazlara sabit gerilim sağlar.",
    specs: [
      { label: "Güç", value: "5 kVA" },
      { label: "Regülasyon", value: "±1%" },
      { label: "Giriş Aralığı", value: "150–260 V" },
      { label: "Soğutma", value: "Fanlı" },
    ],
  },
  {
    id: "c316",
    slug: "parafudr-tip2-3-faz",
    name: "Tip 2 Parafudr 3 Faz 40 kA (Yıldırım ve Aşırı Gerilim)",
    brand: "Schneider Electric",
    category: "guc-regulator",
    price: 3490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 29,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=din%20rail%20surge%20protection%20device%20module%20with%20indicator%20window%20on%20light%20neutral%20background%2C%20electrical%20component%20product%20photography&width=800&height=800&seq=catalog-parafudr-tip2&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Pano içine monte edilen Tip 2 parafudr, yıldırım kaynaklı aşırı gerilimleri topraklayarak elektronik cihazları korur.",
    specs: [
      { label: "Tip", value: "Tip 2 (Class II)" },
      { label: "Deşarj Akımı", value: "40 kA (8/20 µs)" },
      { label: "Kutup", value: "3 faz + N" },
      { label: "Montaj", value: "35 mm DIN ray" },
    ],
  },

  // PDU
  {
    id: "c317",
    slug: "vertiv-rack-pdu-16a-metered",
    name: "Vertiv 16A Metreli Rack PDU (8× C13 + 1× C19)",
    brand: "Vertiv",
    category: "guc-pdu",
    price: 6890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 24,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=vertical%20rack%20power%20strip%20with%20digital%20current%20meter%20on%20clean%20light%20background%2C%20data%20center%20power%20distribution%20product%20photography&width=800&height=800&seq=catalog-vertiv-pdu&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Dijital ölçer ekranıyla anlık akım tüketimini gösteren PDU, kabin kapasitesinin aşılmamasını sağlar.",
    specs: [
      { label: "Prizler", value: "8× C13 + 1× C19" },
      { label: "Akım", value: "16 A" },
      { label: "Ekran", value: "Dijital ampermetre" },
      { label: "Montaj", value: "Dikey / 1U" },
    ],
  },
  {
    id: "c318",
    slug: "apc-ats-otomatik-transfer-salteri",
    name: "APC Rack ATS Otomatik Transfer Şalteri 16A",
    brand: "APC",
    category: "guc-pdu",
    price: 12900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 15,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=1u%20rack%20automatic%20transfer%20switch%20device%20with%20dual%20power%20inputs%20on%20neutral%20light%20background%2C%20data%20center%20redundancy%20hardware%20photography&width=800&height=800&seq=catalog-apc-ats&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Çift beslemeli sunucular için ATS, bir kaynak kesildiğinde yükü milisaniyeler içinde diğer hatta aktarır.",
    specs: [
      { label: "Giriş", value: "2× 16 A kaynak" },
      { label: "Çıkış", value: "8× C13" },
      { label: "Geçiş Süresi", value: "8–12 ms" },
      { label: "Form", value: "1U rack" },
    ],
  },

  // Barkod yazıcı
  {
    id: "c319",
    slug: "zebra-zt411-endustriyel-barkod-yazici",
    name: "Zebra ZT411 Endüstriyel Termal Transfer Barkod Yazıcı",
    brand: "Zebra",
    category: "otvt-barkod-yazici",
    price: 27900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 33,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=metal%20industrial%20thermal%20label%20printer%20with%20ribbon%20access%20door%20open%20on%20light%20gray%20background%2C%20warehouse%20barcode%20equipment%20photography&width=800&height=800&seq=catalog-zt411&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Metal gövdesi ve 600 metre şerit kapasitesiyle ZT411, üretim hatlarında kesintisiz etiket basımı yapar.",
    specs: [
      { label: "Çözünürlük", value: "300 dpi" },
      { label: "Baskı Hızı", value: "356 mm/sn" },
      { label: "Bağlantı", value: "USB, Ethernet, Seri" },
      { label: "Gövde", value: "Endüstriyel metal" },
    ],
  },
  {
    id: "c320",
    slug: "godex-g500-masaustu-barkod-yazici",
    name: "Godex G500 Masaüstü Barkod Yazıcı (203 dpi)",
    brand: "Godex",
    category: "otvt-barkod-yazici",
    price: 4790,
    oldPrice: 5190,
    rating: 4.3,
    reviewCount: 86,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20desktop%20barcode%20label%20printer%20with%20media%20roll%20loaded%20on%20neutral%20light%20background%2C%20minimal%20industrial%20printer%20product%20photo&width=800&height=800&seq=catalog-godex-g500&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Mağaza içi raf ve promosyon etiketi baskısında ekonomik bir çözüm arayanlar için pratik masaüstü yazıcı.",
    specs: [
      { label: "Çözünürlük", value: "203 dpi" },
      { label: "Baskı Hızı", value: "127 mm/sn" },
      { label: "Bağlantı", value: "USB + Seri" },
      { label: "Etiket Genişliği", value: "110 mm'ye kadar" },
    ],
  },

  // Okuyucu
  {
    id: "c321",
    slug: "honeywell-1470g-2d-barkod-okuyucu",
    name: "Honeywell Voyager 1470g 2D Kablolu Barkod Okuyucu",
    brand: "Honeywell",
    category: "otvt-barkod-okuyucu",
    price: 2490,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 128,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=handheld%202d%20barcode%20scanner%20with%20stand%20and%20cable%20on%20light%20gray%20studio%20background%2C%20retail%20scanning%20hardware%20product%20photography&width=800&height=800&seq=catalog-1470g&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Ekrandaki QR kodları ve hasarlı etiketleri okuyabilen 1470g, kasa ve depo noktalarında hızlı işlem sağlar.",
    specs: [
      { label: "Okuma Tipi", value: "1D / 2D / QR / ekran" },
      { label: "Bağlantı", value: "USB kablolu" },
      { label: "Dayanıklılık", value: "1.8 m düşme testi" },
      { label: "Stand", value: "Ayarlanabilir stand dahil" },
    ],
  },
  {
    id: "c322",
    slug: "datalogic-quickscan-qbt2400-kablosuz",
    name: "Datalogic QuickScan QBT2400 Kablosuz 2D Okuyucu",
    brand: "Datalogic",
    category: "otvt-barkod-okuyucu",
    price: 4890,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 54,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=wireless%20handheld%20barcode%20scanner%20resting%20in%20charging%20cradle%20on%20clean%20white%20background%2C%20professional%20retail%20equipment%20photography&width=800&height=800&seq=catalog-qbt2400&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Şarj standı ve 25 metre kablosuz menziliyle QBT2400, raf aralarında dolaşarak sayım yapmayı kolaylaştırır.",
    specs: [
      { label: "Okuma Tipi", value: "1D / 2D / ekran" },
      { label: "Bağlantı", value: "Bluetooth 4.0" },
      { label: "Menzil", value: "25 m" },
      { label: "Pil", value: "Değiştirilebilir batarya" },
    ],
  },

  // El terminali
  {
    id: "c323",
    slug: "zebra-tc22-el-terminali",
    name: "Zebra TC22 Android 13 El Terminali (2D Okuyucu, Wi-Fi)",
    brand: "Zebra",
    category: "otvt-el-terminali",
    price: 32900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 21,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=rugged%20handheld%20android%20terminal%20with%20barcode%20scanner%20module%20on%20light%20neutral%20background%2C%20warehouse%20mobility%20device%20product%20photography&width=800&height=800&seq=catalog-tc22&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "TC22, depo sayımı ve kargo aktarma işlemlerinde tek elle kullanılabilecek ergonomiye sahip Android tabanlı bir terminaldir.",
    specs: [
      { label: "İşletim Sistemi", value: "Android 13" },
      { label: "Ekran", value: "5.4\" dokunmatik" },
      { label: "Okuyucu", value: "2D imager" },
      { label: "Dayanıklılık", value: "IP65, 1.5 m düşme" },
    ],
  },
  {
    id: "c324",
    slug: "urovo-rt40-el-terminali",
    name: "Urovo RT40 Android El Terminali (4G + 2D)",
    brand: "Urovo",
    category: "otvt-el-terminali",
    price: 22900,
    oldPrice: 24900,
    rating: 4.3,
    reviewCount: 34,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=industrial%20handheld%20terminal%20with%20physical%20keypad%20and%20screen%20on%20light%20gray%20background%2C%20logistics%20scanning%20device%20product%20photo&width=800&height=800&seq=catalog-urovo-rt40&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Fiziksel tuş takımı bulunan RT40, eldivenli kullanımda saha ekiplerinin veri girişini hızlandırır.",
    specs: [
      { label: "İşletim Sistemi", value: "Android 11" },
      { label: "Bağlantı", value: "Wi-Fi, 4G, Bluetooth" },
      { label: "Pil", value: "5.000 mAh değiştirilebilir" },
      { label: "Okuyucu", value: "1D / 2D imager" },
    ],
  },

  // PDKS
  {
    id: "c325",
    slug: "zkteco-f18-pdks-parmak-izi",
    name: "ZKTeco F18 Parmak İzi Personel Devam Kontrol Cihazı",
    brand: "ZKTeco",
    category: "otvt-pdks",
    price: 4290,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 142,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=wall%20mounted%20fingerprint%20time%20attendance%20terminal%20with%20keypad%20on%20light%20gray%20studio%20background%2C%20access%20control%20hardware%20product%20photography&width=800&height=800&seq=catalog-zkteco-f18&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "F18, 3.000 kullanıcı kapasitesi ve TCP/IP bağlantısıyla personel giriş çıkış kayıtlarını merkezi sisteme aktarır.",
    specs: [
      { label: "Doğrulama", value: "Parmak izi + şifre" },
      { label: "Kapasite", value: "3.000 kullanıcı" },
      { label: "Bağlantı", value: "TCP/IP, USB" },
      { label: "Raporlama", value: "PDKS yazılımı uyumlu" },
    ],
  },
  {
    id: "c326",
    slug: "suprema-facestation-2-yuz-tanima",
    name: "Suprema FaceStation 2 Yüz Tanıma Terminali",
    brand: "Suprema",
    category: "otvt-pdks",
    price: 27900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 28,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=modern%20face%20recognition%20access%20terminal%20with%20large%20display%20mounted%20on%20wall%20on%20light%20background%2C%20biometric%20security%20device%20product%20photography&width=800&height=800&seq=catalog-facestation2&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Temassız yüz tanıma ile giriş kaydı alan FaceStation 2, hijyen hassasiyeti olan üretim tesisleri için uygundur.",
    specs: [
      { label: "Doğrulama", value: "Yüz tanıma + kart" },
      { label: "Kapasite", value: "30.000 kullanıcı" },
      { label: "Ekran", value: "4 inç dokunmatik" },
      { label: "Bağlantı", value: "PoE, Ethernet" },
    ],
  },

  // Kart & bileklik
  {
    id: "c327",
    slug: "rfid-temassiz-kart-100lu",
    name: "Mifare 13.56 MHz Temassız Personel Kartı (100'lü Paket)",
    brand: "HID",
    category: "otvt-sarf",
    price: 1890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 73,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=stack%20of%20blank%20white%20contactless%20rfid%20access%20cards%20fanned%20out%20on%20light%20gray%20surface%2C%20clean%20access%20control%20consumable%20photography&width=800&height=800&seq=catalog-rfid-kart&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PDKS ve geçiş kontrol sistemlerinde kullanılan temassız kartlar, toplu paket halinde baskıya hazır olarak sunulur.",
    specs: [
      { label: "Frekans", value: "13.56 MHz (Mifare)" },
      { label: "Paket", value: "100 adet" },
      { label: "Baskı", value: "Baskıya uygun yüzey" },
      { label: "Kullanım", value: "PDKS / geçiş kontrol" },
    ],
  },
  {
    id: "c328",
    slug: "termal-barkod-etiket-rulo-100x50",
    name: "Termal Barkod Etiketi 100×50 mm (1.000'li Rulo)",
    brand: "Zebra",
    category: "otvt-sarf",
    price: 590,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 165,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=roll%20of%20white%20thermal%20label%20stickers%20on%20light%20neutral%20background%2C%20warehouse%20consumable%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=catalog-etiket-rulo&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kargo ve raf etiketi baskısı için uygun termal rulo etiket, yüksek yapışma gücüyle okutma sorunlarını azaltır.",
    specs: [
      { label: "Ölçü", value: "100 × 50 mm" },
      { label: "Adet", value: "1.000 etiket / rulo" },
      { label: "Tip", value: "Direkt termal" },
      { label: "Yapışkan", value: "Kalıcı akrilik" },
    ],
  },
];