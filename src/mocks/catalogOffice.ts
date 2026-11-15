import type { Product } from "@/types/store";

/** Baskı çözümleri, yazılım ve network kataloğu */
export const catalogOffice: Product[] = [
  // Baskı Çözümleri → Lazer
  {
    id: "c201",
    slug: "hp-laserjet-pro-m428fdw-lazer-yazici",
    name: "HP LaserJet Pro M428fdw Çok Fonksiyonlu Lazer Yazıcı",
    brand: "HP",
    category: "baski-lazer",
    price: 11900,
    oldPrice: 12900,
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=HP%20LaserJet%20Pro%20M428fdw%20multifunction%20laser%20printer%2C%20light%20grey%20and%20white%20body%20with%20a%20flatbed%20scanner%20lid%20on%20top%20and%20a%2050%20sheet%20automatic%20document%20feeder%2C%20small%20black%20control%20panel%20with%20keypad%2C%20paper%20tray%20at%20the%20bottom%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20office%20equipment%20product%20photography&width=800&height=800&seq=catalog-m428fdw&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "Yazdırma, tarama, kopyalama ve faks işlevlerini tek gövdede toplayan M428fdw, otomatik çift taraflı baskı ile kağıt tüketimini azaltır.",
    specs: [
      { label: "Baskı Hızı", value: "38 sayfa/dakika" },
      { label: "Aylık Hacim", value: "4.000 sayfaya kadar" },
      { label: "Bağlantı", value: "Wi-Fi, Ethernet, USB" },
      { label: "ADF", value: "50 sayfa otomatik besleyici" },
    ],
  },
  {
    id: "c202",
    slug: "canon-i-sensys-mf452dw-lazer-yazici",
    name: "Canon i-SENSYS MF452dw Çok Fonksiyonlu Lazer Yazıcı",
    brand: "Canon",
    category: "baski-lazer",
    price: 10450,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 88,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Canon%20i-SENSYS%20MF452dw%20monochrome%20multifunction%20laser%20printer%2C%20black%20and%20dark%20grey%20angular%20body%20with%20a%20top%20scanner%20and%20document%20feeder%2C%205%20inch%20colour%20touchscreen%20tilted%20on%20the%20front%2C%20output%20tray%20below%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20business%20equipment%20product%20photography&width=800&height=800&seq=catalog-mf452dw&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dokunmatik paneli ve mobil yazdırma desteğiyle MF452dw, şube ofislerinde paylaşımlı kullanım için idealdir.",
    specs: [
      { label: "Baskı Hızı", value: "38 sayfa/dakika" },
      { label: "Çözünürlük", value: "1200 × 1200 dpi" },
      { label: "Bağlantı", value: "Wi-Fi Direct, Ethernet" },
      { label: "Panel", value: "5 inç dokunmatik" },
    ],
  },

  // Mürekkep püskürtmeli
  {
    id: "c203",
    slug: "epson-ecotank-l4260-tankli-yazici",
    name: "Epson EcoTank L4260 Tanklı Çok Fonksiyonlu Yazıcı",
    brand: "Epson",
    category: "baski-murekkep",
    price: 7290,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 196,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Epson%20EcoTank%20L4260%20inkjet%20all%20in%20one%20printer%2C%20compact%20black%20body%20with%20four%20transparent%20front%20ink%20tank%20reservoirs%20visible%20on%20the%20right%20side%2C%20flatbed%20scanner%20lid%20on%20top%2C%20small%20control%20panel%20with%20LCD%2C%20paper%20tray%20at%20the%20front%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20consumer%20printer%20product%20photography&width=800&height=800&seq=catalog-l4260&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Yüksek kapasiteli mürekkep tankları sayesinde L4260, tek dolumla binlerce sayfa basarak sayfa maliyetini düşürür.",
    specs: [
      { label: "Baskı Teknolojisi", value: "Micro Piezo mürekkep püskürtmeli" },
      { label: "Çift Taraflı", value: "Otomatik" },
      { label: "Bağlantı", value: "Wi-Fi, USB, Epson Smart Panel" },
      { label: "Dolum", value: "Ortalama 7.500 sayfa (siyah)" },
    ],
  },
  {
    id: "c204",
    slug: "canon-pixma-g3470-tankli-yazici",
    name: "Canon PIXMA G3470 Tanklı Çok Fonksiyonlu Yazıcı",
    brand: "Canon",
    category: "baski-murekkep",
    price: 5990,
    oldPrice: 6490,
    rating: 4.5,
    reviewCount: 121,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Canon%20PIXMA%20G3470%20inkjet%20all%20in%20one%20printer%2C%20black%20body%20with%20front%20facing%20ink%20tank%20windows%20showing%20black%20cyan%20magenta%20and%20yellow%20levels%2C%20top%20scanner%20lid%2C%20small%20LCD%20panel%2C%20compact%20footprint%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20printer%20product%20photography&width=800&height=800&seq=catalog-g3470&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Küçük ofisler için tasarlanan G3470, kablosuz bağlantı ve uygun maliyetli renkli baskı sunar.",
    specs: [
      { label: "Baskı Hızı", value: "11 siyah / 6 renkli ipm" },
      { label: "Tarayıcı", value: "CIS 600 × 1200 dpi" },
      { label: "Bağlantı", value: "Wi-Fi, USB" },
      { label: "Ekran", value: "1.2 inç LCD" },
    ],
  },

  // Tarayıcı
  {
    id: "c205",
    slug: "epson-workforce-ds-530-tarayici",
    name: "Epson WorkForce DS-530 II Belge Tarayıcı",
    brand: "Epson",
    category: "baski-tarayici",
    price: 13900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 64,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Epson%20WorkForce%20DS-530%20II%20desktop%20document%20scanner%2C%20black%20compact%20body%20with%20an%20automatic%20document%20feeder%20tray%20extended%20upward%20and%20output%20tray%20in%20front%2C%20small%20control%20buttons%20on%20the%20side%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20office%20equipment%20product%20photography&width=800&height=800&seq=catalog-ds530&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Günlük 4.000 sayfa kapasiteli DS-530 II, arşiv dijitalleştirme projelerinde çift taraflı hızlı tarama sağlar.",
    specs: [
      { label: "Tarama Hızı", value: "35 sayfa/dakika" },
      { label: "ADF Kapasitesi", value: "50 sayfa" },
      { label: "Çözünürlük", value: "600 dpi optik" },
      { label: "Bağlantı", value: "USB 3.0" },
    ],
  },
  {
    id: "c206",
    slug: "fujitsu-scansnap-ix1600-tarayici",
    name: "Fujitsu ScanSnap iX1600 Kablosuz Belge Tarayıcı",
    brand: "Fujitsu",
    category: "baski-tarayici",
    price: 16400,
    oldPrice: 17800,
    rating: 4.8,
    reviewCount: 47,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=Fujitsu%20ScanSnap%20iX1600%20compact%20document%20scanner%2C%20black%20body%20with%20a%20colour%20touchscreen%20on%20the%20front%20and%20a%20folded%20paper%20feed%20guide%20on%20top%2C%20slim%20upright%20design%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20office%20scanner%20product%20photography&width=800&height=800&seq=catalog-ix1600&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dokunmatik ekranı üzerinden buluta doğrudan aktarım yapabilen iX1600, kâğıtsız ofise geçişi hızlandırır.",
    specs: [
      { label: "Tarama Hızı", value: "40 sayfa/dakika" },
      { label: "ADF Kapasitesi", value: "50 sayfa" },
      { label: "Bağlantı", value: "Wi-Fi, USB, bulut" },
      { label: "Ekran", value: "4.3 inç dokunmatik" },
    ],
  },

  // Etiket & fiş
  {
    id: "c207",
    slug: "zebra-zd230-etiket-yazici",
    name: "Zebra ZD230 Termal Transfer Barkod Etiket Yazıcı",
    brand: "Zebra",
    category: "baski-etiket",
    price: 8490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 73,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Zebra%20ZD230%20desktop%20thermal%20transfer%20label%20printer%2C%20black%20compact%20boxy%20body%20with%20a%20top%20loading%20media%20cover%20partly%20open%20showing%20a%20label%20roll%2C%20small%20status%20LED%20and%20button%20on%20the%20front%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20industrial%20barcode%20equipment%20product%20photography&width=800&height=800&seq=catalog-zd230&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "ZD230, raf etiketi ve kargo etiketi baskısında 203 dpi çözünürlüğüyle depo operasyonlarına uygun dayanıklı bir yazıcıdır.",
    specs: [
      { label: "Baskı Yöntemi", value: "Termal transfer / direkt termal" },
      { label: "Çözünürlük", value: "203 dpi" },
      { label: "Baskı Hızı", value: "152 mm/sn" },
      { label: "Bağlantı", value: "USB, Ethernet" },
    ],
  },
  {
    id: "c208",
    slug: "epson-tm-t20iii-fis-yazici",
    name: "Epson TM-T20III Termal Fiş Yazıcısı (USB + Ethernet)",
    brand: "Epson",
    category: "baski-etiket",
    price: 5890,
    oldPrice: 6290,
    rating: 4.5,
    reviewCount: 158,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Epson%20TM-T20III%20compact%20black%20pos%20receipt%20printer%2C%20small%20rectangular%20body%20with%20a%20front%20paper%20exit%20slot%20and%20auto%20cutter%2C%20paper%20roll%20compartment%20cover%20on%20top%2C%20small%20status%20LEDs%20and%20button%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20retail%20point%20of%20sale%20hardware%20product%20photography&width=800&height=800&seq=catalog-tmt20iii&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kasa arkası alanı verimli kullanan TM-T20III, 250 mm/sn baskı hızıyla yoğun mağazalarda kuyruk oluşmasını önler.",
    specs: [
      { label: "Baskı Hızı", value: "250 mm/sn" },
      { label: "Kağıt", value: "80 mm termal rulo" },
      { label: "Bağlantı", value: "USB + Ethernet" },
      { label: "Kesici", value: "Otomatik" },
    ],
  },

  // Sarf
  {
    id: "c209",
    slug: "hp-58a-cf258a-orijinal-toner",
    name: "HP 58A (CF258A) Orijinal Siyah Toner Kartuş",
    brand: "HP",
    category: "baski-sarf",
    price: 2790,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 187,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=HP%2058A%20black%20toner%20cartridge%2C%20rectangular%20black%20plastic%20cartridge%20with%20a%20green%20drum%20cover%20and%20small%20HP%20label%2C%20standing%20upright%20beside%20its%20blue%20and%20white%20retail%20box%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20printer%20consumable%20product%20photography&width=800&height=800&seq=catalog-hp58a&orientation=squarish&nocache=true",
    tags: [{ label: "Orijinal", tone: "primary" }],
    description:
      "HP LaserJet Pro M404 serisi için orijinal 58A toner, 3.000 sayfa kapasitesiyle baskı kalitesini korur.",
    specs: [
      { label: "Uyumlu Seri", value: "LaserJet Pro M404 / MFP M428" },
      { label: "Verim", value: "3.000 sayfa" },
      { label: "Renk", value: "Siyah" },
      { label: "Garanti", value: "Orijinal ürün garantisi" },
    ],
  },
  {
    id: "c210",
    slug: "canon-054h-yuksek-kapasite-toner",
    name: "Canon 054H Yüksek Kapasiteli Siyah Toner",
    brand: "Canon",
    category: "baski-sarf",
    price: 3190,
    oldPrice: 3490,
    rating: 4.4,
    reviewCount: 62,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Canon%20054H%20black%20toner%20cartridge%2C%20long%20black%20plastic%20cartridge%20with%20a%20small%20Canon%20label%20and%20protective%20orange%20clips%2C%20lying%20at%20a%20slight%20angle%20next%20to%20a%20plain%20carton%20box%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20consumable%20supply%20product%20photography&width=800&height=800&seq=catalog-canon054h&orientation=squarish&nocache=true",
    tags: [{ label: "Orijinal", tone: "primary" }],
    description:
      "i-SENSYS LBP620 serisi için yüksek kapasiteli 054H toner, sayfa başı maliyeti düşürerek yoğun baskıda tasarruf sağlar.",
    specs: [
      { label: "Uyumlu Seri", value: "i-SENSYS MF640 / LBP620" },
      { label: "Verim", value: "3.100 sayfa" },
      { label: "Renk", value: "Siyah" },
      { label: "Tip", value: "Yüksek kapasite" },
    ],
  },

  // Yazılım → İşletim sistemi
  {
    id: "c211",
    slug: "microsoft-windows-11-pro-lisans",
    name: "Microsoft Windows 11 Pro 64-bit OEM Lisans",
    brand: "Microsoft",
    category: "yazilim-isletim",
    price: 4290,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Microsoft%20Windows%2011%20Pro%20retail%20product%20card%2C%20slim%20rectangular%20card%20with%20a%20blue%20gradient%20Windows%2011%20logo%20on%20a%20light%20desk%20surface%2C%20slight%20perspective%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20digital%20product%20mockup%20photography&width=800&height=800&seq=catalog-win11pro&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "BitLocker ve uzak masaüstü desteğiyle Windows 11 Pro, kurumsal cihaz filolarında güvenli yönetim sağlar.",
    specs: [
      { label: "Sürüm", value: "Windows 11 Pro 64-bit" },
      { label: "Lisans Tipi", value: "OEM" },
      { label: "Dil", value: "Türkçe / İngilizce" },
      { label: "Teslimat", value: "Dijital anahtar" },
    ],
  },
  {
    id: "c212",
    slug: "microsoft-windows-server-2022-standard",
    name: "Microsoft Windows Server 2022 Standard 16 Çekirdek Lisans",
    brand: "Microsoft",
    category: "yazilim-isletim",
    price: 32900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 38,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Microsoft%20Windows%20Server%202022%20Standard%20license%20kit%2C%20flat%20retail%20box%20and%20a%20slim%20license%20card%20with%20a%20blue%20server%20logo%2C%20placed%20on%20a%20neutral%20grey%20surface%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20corporate%20software%20product%20photography&width=800&height=800&seq=catalog-win-server-2022&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Windows Server 2022 Standard, Hyper-V sanallaştırma ve gelişmiş güvenlik katmanlarıyla sunucu altyapısını yönetir.",
    specs: [
      { label: "Sürüm", value: "Server 2022 Standard" },
      { label: "Kapsam", value: "16 çekirdek / 2 sanal makine" },
      { label: "Kanal", value: "OEM / Open License" },
      { label: "Teslimat", value: "Dijital anahtar" },
    ],
  },

  // Ofis
  {
    id: "c213",
    slug: "microsoft-365-business-standard-yillik",
    name: "Microsoft 365 Business Standard Yıllık Abonelik (Kullanıcı)",
    brand: "Microsoft",
    category: "yazilim-ofis",
    price: 6490,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 274,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Microsoft%20365%20Business%20subscription%20activation%20card%2C%20slim%20white%20card%20with%20orange%20and%20blue%20Microsoft%20365%20logo%20lying%20on%20a%20laptop%20keyboard%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20digital%20product%20mockup%20photography&width=800&height=800&seq=catalog-m365-business&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Teams, Outlook ve 1 TB OneDrive alanıyla gelen Business Standard, ekiplerin uzaktan çalışma düzenini tek abonelikte toplar.",
    specs: [
      { label: "Kapsam", value: "1 kullanıcı / yıllık" },
      { label: "Uygulamalar", value: "Word, Excel, Teams, Outlook" },
      { label: "Depolama", value: "1 TB OneDrive" },
      { label: "Kurulum", value: "Bulut / 5 cihaz" },
    ],
  },
  {
    id: "c214",
    slug: "adobe-acrobat-pro-kurumsal-lisans",
    name: "Adobe Acrobat Pro Kurumsal Yıllık Lisans",
    brand: "Adobe",
    category: "yazilim-ofis",
    price: 7290,
    oldPrice: 7890,
    rating: 4.5,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Adobe%20Acrobat%20Pro%20subscription%20card%2C%20slim%20card%20with%20a%20red%20Adobe%20Acrobat%20logo%20standing%20on%20a%20clean%20desk%20surface%20beside%20a%20closed%20notebook%2C%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20minimal%20digital%20product%20mockup%20photography&width=800&height=800&seq=catalog-acrobat-pro&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PDF düzenleme, e-imza ve belge güvenliği araçlarını bir arada sunan Acrobat Pro, sözleşme süreçlerini hızlandırır.",
    specs: [
      { label: "Kapsam", value: "1 kullanıcı / yıllık" },
      { label: "Platform", value: "Windows / macOS" },
      { label: "Özellik", value: "E-imza, OCR, şifreleme" },
      { label: "Teslimat", value: "Dijital lisans" },
    ],
  },

  // Güvenlik yazılımı
  {
    id: "c215",
    slug: "kaspersky-endpoint-security-business",
    name: "Kaspersky Endpoint Security for Business (10 Cihaz / 1 Yıl)",
    brand: "Kaspersky",
    category: "yazilim-guvenlik",
    price: 4890,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 84,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Kaspersky%20Endpoint%20Security%20for%20Business%20license%20box%2C%20flat%20software%20box%20with%20green%20and%20white%20branding%20and%20a%20shield%20emblem%2C%20standing%20upright%20on%20a%20clean%20desk%20surface%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20corporate%20security%20software%20product%20photography&width=800&height=800&seq=catalog-kaspersky-endpoint&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Uç nokta koruma, dosya şifreleme ve merkezi yönetim konsolunu içeren paket, KOBİ ölçeğinde hızlı devreye alınır.",
    specs: [
      { label: "Kapsam", value: "10 cihaz / 1 yıl" },
      { label: "Modüller", value: "Antivirüs, EDR, şifreleme" },
      { label: "Yönetim", value: "Bulut konsol" },
      { label: "Platform", value: "Windows, macOS, Linux" },
    ],
  },
  {
    id: "c216",
    slug: "eset-protect-enterprise-25-cihaz",
    name: "ESET PROTECT Entry (25 Cihaz / 1 Yıl)",
    brand: "ESET",
    category: "yazilim-guvenlik",
    price: 6890,
    oldPrice: 7490,
    rating: 4.5,
    reviewCount: 57,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=ESET%20PROTECT%20Entry%20software%20license%20box%2C%20slim%20retail%20box%20with%20a%20teal%20and%20white%20ESET%20logo%20and%20a%20small%20robot%20mascot%2C%20placed%20upright%20on%20a%20light%20office%20desk%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20security%20software%20product%20photography&width=800&height=800&seq=catalog-eset-protect&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "ESET PROTECT Entry, zararlı yazılım korumasını bulut konsoldan yönetilebilir hale getirerek BT ekiplerinin işini kolaylaştırır.",
    specs: [
      { label: "Kapsam", value: "25 cihaz / 1 yıl" },
      { label: "Modüller", value: "Antivirüs, firewall, spam filtre" },
      { label: "Yönetim", value: "ESET PROTECT Cloud" },
      { label: "Destek", value: "Yerel teknik destek" },
    ],
  },

  // Yedekleme
  {
    id: "c217",
    slug: "veeam-backup-replication-5-workload",
    name: "Veeam Backup & Replication Standard (5 İş Yükü / 1 Yıl)",
    brand: "Veeam",
    category: "yazilim-yedekleme",
    price: 18900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 41,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Veeam%20Backup%20and%20Replication%20license%20kit%2C%20slim%20dark%20green%20retail%20card%20with%20a%20white%20Veeam%20logo%20resting%20on%20a%20brushed%20grey%20surface%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20enterprise%20software%20mockup%20photography&width=800&height=800&seq=catalog-veeam-backup&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Sanal makine ve fiziksel sunucu yedeklerini tek konsoldan yöneten Veeam, felaket kurtarma sürelerini kısaltır.",
    specs: [
      { label: "Kapsam", value: "5 iş yükü / 1 yıl" },
      { label: "Desteklenen", value: "VMware, Hyper-V, fiziksel" },
      { label: "Özellik", value: "Anlık geri dönüş, şifreli yedek" },
      { label: "Teslimat", value: "Dijital lisans" },
    ],
  },
  {
    id: "c218",
    slug: "acronis-cyber-protect-server",
    name: "Acronis Cyber Protect Server (Sunucu Lisansı / 1 Yıl)",
    brand: "Acronis",
    category: "yazilim-yedekleme",
    price: 12400,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 33,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Acronis%20Cyber%20Protect%20Server%20license%20card%2C%20white%20and%20orange%20card%20with%20a%20circular%20Acronis%20logo%20propped%20against%20a%20small%20server%20hard%20drive%20on%20a%20clean%20desk%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20corporate%20software%20product%20photography&width=800&height=800&seq=catalog-acronis-server&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Yedekleme ile uç nokta korumasını aynı panelde birleştiren Acronis, tek lisansla sunucu güvenliğini tamamlar.",
    specs: [
      { label: "Kapsam", value: "1 sunucu / 1 yıl" },
      { label: "Özellik", value: "İmaj yedek, bare-metal kurtarma" },
      { label: "Yönetim", value: "Bulut konsol" },
      { label: "Platform", value: "Windows / Linux" },
    ],
  },

  // Network → Wi-Fi
  {
    id: "c219",
    slug: "tp-link-archer-axe75-wifi-6e-router",
    name: "TP-Link Archer AXE75 AXE5400 Tri-Band Wi-Fi 6E Router",
    brand: "TP-Link",
    category: "ag-wifi",
    price: 6490,
    oldPrice: 7190,
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=TP-Link%20Archer%20AXE75%20tri%20band%20wifi%206e%20router%2C%20glossy%20black%20angular%20body%20with%20six%20upright%20external%20antennas%2C%20small%20status%20LEDs%20on%20the%20front%20edge%20and%20TP-Link%20logo%2C%20clean%20white%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20networking%20hardware%20product%20photography&width=800&height=800&seq=catalog-axe75&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%10", tone: "discount" },
    ],
    description:
      "6 GHz bandıyla girişim oluşturan AXE75, yoğun ofis ortamlarında gecikmesiz kablosuz bağlantı sağlar.",
    specs: [
      { label: "Wi-Fi Standardı", value: "Wi-Fi 6E (6 GHz destekli)" },
      { label: "Toplam Hız", value: "5400 Mbps" },
      { label: "Port Yapısı", value: "1× 2.5G WAN + 4× Gigabit LAN" },
      { label: "Anten", value: "6× harici + Beamforming" },
    ],
  },
  {
    id: "c220",
    slug: "mikrotik-chateau-lte6-ax-router",
    name: "MikroTik Chateau LTE6 ax Kablosuz Router",
    brand: "MikroTik",
    category: "ag-wifi",
    price: 5890,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 36,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=MikroTik%20Chateau%20LTE6%20ax%20router%2C%20white%20plastic%20housing%20with%20four%20vertical%20antennas%20and%20a%20front%20panel%20with%20status%20LEDs%20and%20a%20small%20MikroTik%20logo%2C%20standing%20on%20a%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20technical%20networking%20product%20photography&width=800&height=800&seq=catalog-chateau-lte6&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "LTE yedekli bağlantı isteyen şubeler için Chateau LTE6 ax, fiber kesildiğinde otomatik olarak hücresel ağa geçer.",
    specs: [
      { label: "Kablosuz", value: "Wi-Fi 6 dual band" },
      { label: "Hücresel", value: "LTE Cat6 yedek bağlantı" },
      { label: "Port Yapısı", value: "5× Gigabit" },
      { label: "İşletim Sistemi", value: "RouterOS L4" },
    ],
  },

  // Access point
  {
    id: "c221",
    slug: "tp-link-eap610-outdoor-access-point",
    name: "TP-Link Omada EAP610-Outdoor AX1800 Dış Mekan Access Point",
    brand: "TP-Link",
    category: "ag-access-point",
    price: 5890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 52,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=TP-Link%20Omada%20EAP610%20outdoor%20wifi%20access%20point%2C%20white%20weatherproof%20rectangular%20housing%20with%20rounded%20corners%20and%20a%20metal%20pole%20mounting%20bracket%2C%20small%20TP-Link%20logo%20on%20the%20front%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20rugged%20networking%20hardware%20product%20photography&width=800&height=800&seq=catalog-eap610-outdoor&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "IP67 korumalı EAP610-Outdoor, depo bahçesi ve otopark gibi açık alanlarda kesintisiz Wi-Fi kapsama sağlar.",
    specs: [
      { label: "Wi-Fi Standardı", value: "Wi-Fi 6 AX1800" },
      { label: "Koruma Sınıfı", value: "IP67" },
      { label: "Besleme", value: "802.3at PoE+" },
      { label: "Yönetim", value: "Omada SDN" },
    ],
  },
  {
    id: "c222",
    slug: "ubiquiti-unifi-u6-enterprise-ap",
    name: "Ubiquiti UniFi U6 Enterprise Wi-Fi 6E Access Point",
    brand: "Ubiquiti",
    category: "ag-access-point",
    price: 11900,
    oldPrice: null,
    rating: 4.9,
    reviewCount: 43,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Ubiquiti%20UniFi%20U6%20Enterprise%20ceiling%20access%20point%2C%20large%20flat%20white%20circular%20disc%20with%20a%20subtle%20silver%20ring%20and%20small%20blue%20LED%2C%20mounting%20plate%20beside%20it%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20enterprise%20networking%20product%20photography&width=800&height=800&seq=catalog-u6-enterprise&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "U6 Enterprise, 6 GHz bandı ve 2.5 GbE uplink ile konferans salonu ve fabrika sahalarında yüksek yoğunluğu kaldırır.",
    specs: [
      { label: "Wi-Fi Standardı", value: "Wi-Fi 6E tri-band" },
      { label: "Uplink", value: "2.5 GbE" },
      { label: "İstemci Kapasitesi", value: "600+" },
      { label: "Besleme", value: "802.3at PoE+" },
    ],
  },

  // Switch
  {
    id: "c223",
    slug: "cisco-cbs350-24p-poe-switch",
    name: "Cisco CBS350-24P 24 Port Gigabit PoE Yönetilebilir Switch",
    brand: "Cisco",
    category: "ag-switch",
    price: 18900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 34,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Cisco%20CBS350-24P%2024%20port%20gigabit%20poe%20managed%20network%20switch%2C%20wide%20rack%20mount%20metal%20chassis%20with%20two%20rows%20of%20RJ45%20ports%20and%20status%20LEDs%2C%20small%20Cisco%20logo%20on%20the%20front%20left%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20enterprise%20networking%20hardware%20photography&width=800&height=800&seq=catalog-cbs350-24p&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "24 PoE+ portu ve 4 SFP uplink bağlantısıyla CBS350, kamera ve access point projelerinde kablolamayı tek cihazda toplar.",
    specs: [
      { label: "Port Sayısı", value: "24× Gigabit PoE+" },
      { label: "PoE Bütçesi", value: "195 W" },
      { label: "Uplink", value: "4× SFP" },
      { label: "Yönetim", value: "Web, CLI, VLAN, LACP" },
    ],
  },
  {
    id: "c224",
    slug: "zyxel-gs1100-8hp-poe-switch",
    name: "Zyxel GS1100-8HP 8 Port Gigabit PoE Switch",
    brand: "Zyxel",
    category: "ag-switch",
    price: 3290,
    oldPrice: 3590,
    rating: 4.3,
    reviewCount: 68,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Zyxel%20GS1100-8HP%20small%20desktop%208%20port%20gigabit%20poe%20switch%2C%20compact%20grey%20metal%20housing%20with%20RJ45%20ports%20across%20the%20front%20and%20green%20link%20LEDs%2C%20fanless%20design%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20compact%20networking%20hardware%20product%20photography&width=800&height=800&seq=catalog-gs1100-8hp&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Küçük mağaza ve ofislerde 4-8 IP kamera beslemek için yeterli PoE bütçesi sunan sessiz ve kompakt bir switch.",
    specs: [
      { label: "Port Sayısı", value: "8× Gigabit (4× PoE)" },
      { label: "PoE Bütçesi", value: "60 W" },
      { label: "Gövde", value: "Fansız metal kasa" },
      { label: "Montaj", value: "Masaüstü / duvar" },
    ],
  },

  // Firewall
  {
    id: "c225",
    slug: "fortinet-fortigate-60f-firewall",
    name: "Fortinet FortiGate 60F Kurumsal Güvenlik Duvarı",
    brand: "Fortinet",
    category: "ag-firewall",
    price: 34900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 39,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Fortinet%20FortiGate%2060F%20desktop%20firewall%20appliance%2C%20white%20compact%20chassis%20with%20a%20red%20Fortinet%20logo%2C%20a%20row%20of%20gigabit%20RJ45%20ports%20and%20small%20status%20LEDs%20on%20the%20front%2C%20clean%20white%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20network%20security%20hardware%20product%20photography&width=800&height=800&seq=catalog-fgt60f&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "FortiGate 60F, şube ofislerde SD-WAN ve gelişmiş tehdit korumasını tek cihazda sunarak ağ sınırını güçlendirir.",
    specs: [
      { label: "Port Yapısı", value: "10× GbE RJ45" },
      { label: "Firewall Performansı", value: "10 Gbps" },
      { label: "Tehdit Koruması", value: "700 Mbps" },
      { label: "VPN", value: "IPsec / SSL VPN" },
    ],
  },
  {
    id: "c226",
    slug: "tp-link-er605-v2-ag-gecidi",
    name: "TP-Link ER605 V2 Omada Gigabit VPN Router",
    brand: "TP-Link",
    category: "ag-firewall",
    price: 2190,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 124,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=TP-Link%20Omada%20ER605%20gigabit%20VPN%20router%2C%20small%20black%20metal%20box%20with%20five%20gigabit%20RJ45%20ports%20and%20green%20LEDs%20on%20the%20front%2C%20TP-Link%20logo%2C%20fanless%20compact%20design%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20compact%20enterprise%20router%20product%20photography&width=800&height=800&seq=catalog-er605&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Çoklu WAN yük dengeleme desteğiyle ER605, küçük ofislerde internet kesintisini kullanıcıya hissettirmez.",
    specs: [
      { label: "Port Yapısı", value: "5× Gigabit" },
      { label: "WAN", value: "Çoklu WAN + yük dengeleme" },
      { label: "VPN", value: "IPsec / OpenVPN / L2TP" },
      { label: "Yönetim", value: "Omada SDN" },
    ],
  },

  // Kablosuz adaptör
  {
    id: "c227",
    slug: "tp-link-archer-tx50e-wifi-6e-adaptor",
    name: "TP-Link Archer TX50E Wi-Fi 6E PCIe Masaüstü Adaptörü",
    brand: "TP-Link",
    category: "ag-adaptor",
    price: 1690,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 71,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=TP-Link%20Archer%20TX50E%20pcie%20wifi%20adapter%20card%2C%20small%20black%20and%20silver%20low%20profile%20pcie%20x1%20card%20with%20a%20gold%20connector%20edge%20and%20two%20external%20antenna%20connectors%2C%20heatsink%20cover%20on%20top%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20computer%20hardware%20expansion%20card%20photography&width=800&height=800&seq=catalog-tx50e&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kablosuz ağa geçmek isteyen masaüstü sistemlerde TX50E, 6 GHz desteği ve harici antenleriyle düşük gecikme sağlar.",
    specs: [
      { label: "Standart", value: "Wi-Fi 6E (6 GHz)" },
      { label: "Arayüz", value: "PCIe x1" },
      { label: "Hız", value: "2402 Mbps (6 GHz)" },
      { label: "Bluetooth", value: "5.2" },
    ],
  },
  {
    id: "c228",
    slug: "ugreen-usb-ax1800-wifi-adaptor",
    name: "Ugreen USB AX1800 Kablosuz Ağ Adaptörü",
    brand: "Ugreen",
    category: "ag-adaptor",
    price: 790,
    oldPrice: null,
    rating: 4.2,
    reviewCount: 163,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Ugreen%20USB%20AX1800%20wifi%20dongle%2C%20small%20black%20rectangular%20usb%203.0%20adapter%20with%20two%20short%20foldable%20antennas%20and%20a%20tiny%20LED%2C%20clean%20white%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20minimal%20computer%20accessory%20product%20photography&width=800&height=800&seq=catalog-ugreen-ax1800&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dizüstü ve masaüstünde hızlı kurulum için tasarlanan AX1800 USB adaptör, Wi-Fi 6 desteği olmayan cihazları günceller.",
    specs: [
      { label: "Standart", value: "Wi-Fi 6 (802.11ax)" },
      { label: "Hız", value: "1800 Mbps" },
      { label: "Arayüz", value: "USB 3.0" },
      { label: "Uyumluluk", value: "Windows / Linux" },
    ],
  },
];