import type { Product } from "@/types/store";

/** Çevre birimleri ve baskı çözümleri için ek katalog */
export const catalogPeripheralExtra: Product[] = [
  // Monitör
  {
    id: "c523",
    slug: "samsung-viewfinity-s6-27-2k",
    name: "Samsung ViewFinity S6 27\" QHD IPS 100Hz Monitör",
    brand: "Samsung",
    category: "cevre-monitor",
    price: 7490,
    oldPrice: 8190,
    rating: 4.6,
    reviewCount: 84,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=slim%20bezel%2027%20inch%20qhd%20monitor%20with%20ergonomic%20stand%20on%20a%20light%20gray%20studio%20background%2C%20modern%20display%20product%20photography%20with%20soft%20reflection%20and%20clean%20minimal%20composition&width=800&height=800&seq=c523-viewfinity-s6&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "QHD çözünürlük ve 100 Hz yenileme hızıyla S6, tablo ve rapor okumada metinleri netleştirir.",
    specs: [
      { label: "Ekran", value: "27\" IPS, 2560×1440" },
      { label: "Yenileme", value: "100 Hz" },
      { label: "Bağlantı", value: "HDMI, DP, USB-C 90W" },
      { label: "Stand", value: "Yükseklik / pivot" },
    ],
  },
  {
    id: "c524",
    slug: "philips-243v7qdsb-24-monitor",
    name: "Philips 243V7QDSB 24\" Full HD IPS Monitör",
    brand: "Philips",
    category: "cevre-monitor",
    price: 3290,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 136,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=simple%2024%20inch%20office%20monitor%20with%20narrow%20borders%20on%20a%20plain%20white%20studio%20background%2C%20budget%20display%20product%20photography%20with%20even%20lighting%20and%20subtle%20ground%20shadow&width=800&height=800&seq=c524-philips-243v7&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Flicker-free teknolojisi ve düşük mavi ışık moduyla 243V7, gün boyu ekran başında çalışanlar için uygundur.",
    specs: [
      { label: "Ekran", value: "23.8\" IPS, 1920×1080" },
      { label: "Bağlantı", value: "HDMI, DVI, VGA" },
      { label: "Özellik", value: "Flicker-free, LowBlue" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // Klavye & mouse
  {
    id: "c525",
    slug: "logitech-mk295-kablosuz-set",
    name: "Logitech MK295 Sessiz Kablosuz Klavye Mouse Seti",
    brand: "Logitech",
    category: "cevre-klavye-mouse",
    price: 1190,
    oldPrice: 1290,
    rating: 4.5,
    reviewCount: 187,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20silent%20wireless%20keyboard%20with%20matching%20mouse%20on%20a%20light%20gray%20studio%20surface%2C%20clean%20office%20accessory%20product%20photography%20with%20soft%20shadows%20and%20minimal%20background%20detail&width=800&height=800&seq=c525-mk295&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "MK295'in sessiz tuşları ve suya dayanıklı gövdesi, açık ofislerde rahatsızlık vermeden çalışmayı sağlar.",
    specs: [
      { label: "Bağlantı", value: "2.4 GHz USB alıcı" },
      { label: "Klavye", value: "Türkçe Q, sessiz tuş" },
      { label: "Pil Ömrü", value: "24 ay" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c526",
    slug: "microsoft-designer-bluetooth-set",
    name: "Microsoft Designer Bluetooth Masaüstü Klavye Mouse Seti",
    brand: "Microsoft",
    category: "cevre-klavye-mouse",
    price: 2390,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 63,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=slim%20black%20bluetooth%20keyboard%20with%20compact%20mouse%20arranged%20neatly%20on%20a%20white%20studio%20surface%2C%20modern%20minimal%20desk%20accessory%20photography%20with%20crisp%20lighting%20and%20fine%20texture&width=800&height=800&seq=c526-designer-bt&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "İnce profilli tasarımı ve Bluetooth eşleştirmesiyle Designer seti, toplantı odalarında masaüstünü sadeleştirir.",
    specs: [
      { label: "Bağlantı", value: "Bluetooth 4.0" },
      { label: "Klavye", value: "İnce profil, Türkçe Q" },
      { label: "Pil Ömrü", value: "6 ay" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Kulaklık
  {
    id: "c527",
    slug: "poly-voyager-4320-kulaklik",
    name: "Poly Voyager 4320 UC Kablosuz Ofis Kulaklığı",
    brand: "Poly",
    category: "cevre-kulaklik",
    price: 6490,
    oldPrice: 6990,
    rating: 4.7,
    reviewCount: 92,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20professional%20wireless%20headset%20with%20boom%20microphone%20and%20charging%20base%20on%20a%20light%20gray%20studio%20background%2C%20premium%20corporate%20audio%20product%20photography%2C%20soft%20even%20lighting%2C%20clean%20lines&width=800&height=800&seq=c527-voyager-4320&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Çift bağlantı desteğiyle Voyager 4320, masaüstü telefonu ve bilgisayar arasında kesintisiz görüşme geçişi sunar.",
    specs: [
      { label: "Bağlantı", value: "Bluetooth + USB adaptör" },
      { label: "Görüşme Süresi", value: "24 saate kadar" },
      { label: "Mikrofon", value: "Çift yönlü gürültü engelleme" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c528",
    slug: "logitech-zone-wired-kulaklik",
    name: "Logitech Zone Wired USB-C Kulaklık",
    brand: "Logitech",
    category: "cevre-kulaklik",
    price: 3290,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=graphite%20over%20ear%20wired%20headset%20with%20flexible%20microphone%20resting%20on%20a%20light%20neutral%20surface%2C%20clean%20business%20audio%20gear%20photography%20with%20soft%20shadow%20and%20fine%20material%20detail&width=800&height=800&seq=c528-zone-wired&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Zone Wired, sertifikalı yazılım desteği ve kulak üstü konforuyla uzun toplantı günlerinde tercih edilir.",
    specs: [
      { label: "Bağlantı", value: "USB-C (USB-A adaptör dahil)" },
      { label: "Ses", value: "Stereo, 40 mm sürücü" },
      { label: "Sertifikasyon", value: "MS Teams, Zoom" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Web kamera
  {
    id: "c529",
    slug: "logitech-c920e-webcam",
    name: "Logitech C920e Business Full HD Web Kamerası",
    brand: "Logitech",
    category: "cevre-webcam",
    price: 2390,
    oldPrice: 2590,
    rating: 4.5,
    reviewCount: 168,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=full%20hd%20business%20webcam%20with%20glass%20lens%20mounted%20on%20a%20monitor%20clip%20on%20a%20light%20gray%20background%2C%20clean%20video%20conferencing%20device%20product%20photography%20with%20soft%20shadow&width=800&height=800&seq=c529-c920e&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "C920e, otomatik ışık dengelemesi ve çift mikrofonuyla uzaktan toplantılarda net görüntü ve ses sağlar.",
    specs: [
      { label: "Çözünürlük", value: "1080p / 30 fps" },
      { label: "Görüş Açısı", value: "78°" },
      { label: "Bağlantı", value: "USB-A" },
      { label: "Ekstra", value: "Çift mikrofon, monitör kelepçesi" },
    ],
  },
  {
    id: "c530",
    slug: "poly-studio-p5-webcam",
    name: "Poly Studio P5 Full HD Profesyonel Web Kamerası",
    brand: "Poly",
    category: "cevre-webcam",
    price: 3290,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 57,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=professional%20hd%20webcam%20with%20privacy%20shutter%20and%20tripod%20thread%20on%20a%20clean%20neutral%20studio%20background%2C%20premium%20video%20conferencing%20hardware%20photography%20with%20crisp%20detail%20and%20soft%20light&width=800&height=800&seq=c530-studio-p5&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Studio P5, otomatik ışık ayarı ve gizlilik kapağıyla bireysel çalışma alanları için tasarlandı.",
    specs: [
      { label: "Çözünürlük", value: "1080p / 30 fps" },
      { label: "Görüş Açısı", value: "80°" },
      { label: "Bağlantı", value: "USB-A" },
      { label: "Ekstra", value: "Gizlilik kapağı, tripod dişi" },
    ],
  },

  // Docking
  {
    id: "c531",
    slug: "hp-usb-c-dock-g5-120w",
    name: "HP USB-C Dock G5 120W Docking Station",
    brand: "HP",
    category: "cevre-dock",
    price: 4290,
    oldPrice: 4590,
    rating: 4.5,
    reviewCount: 116,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20usb%20c%20docking%20station%20with%20front%20usb%20ports%20and%20rubber%20feet%20on%20a%20clean%20light%20gray%20studio%20surface%2C%20corporate%20accessory%20product%20photography%20with%20soft%20lighting%20and%20fine%20detail&width=800&height=800&seq=c531-hp-dock-g5&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "HP Dock G5, tek kabloyla çift 4K ekran, gigabit ağ ve 100 W şarj sağlayarak masaüstünü toplar.",
    specs: [
      { label: "Ekran Desteği", value: "2× 4K @ 60 Hz" },
      { label: "Şarj", value: "100 W USB-C PD" },
      { label: "Portlar", value: "2× DP, HDMI, RJ45, 4× USB-A" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c532",
    slug: "lenovo-thinkpad-hybrid-usb-c-dock",
    name: "Lenovo ThinkPad Hybrid USB-C Dock 90W",
    brand: "Lenovo",
    category: "cevre-dock",
    price: 3890,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 79,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20black%20laptop%20docking%20station%20with%20usb%20c%20cable%20coiled%20beside%20it%20on%20a%20neutral%20background%2C%20office%20hardware%20product%20photography%20with%20even%20lighting%20and%20refined%20texture&width=800&height=800&seq=c532-thinkpad-hybrid-dock&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "USB-C ve USB-A dizüstülerle uyumlu Hybrid Dock, karma filolarda tek tip masaüstü kurulumu sağlar.",
    specs: [
      { label: "Ekran Desteği", value: "2× FHD / 1× 4K" },
      { label: "Şarj", value: "60 W" },
      { label: "Portlar", value: "2× DP, HDMI, RJ45, 3× USB-A" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // Lazer yazıcı
  {
    id: "c533",
    slug: "hp-laserjet-pro-m404dn",
    name: "HP LaserJet Pro M404dn Mono Lazer Yazıcı",
    brand: "HP",
    category: "baski-lazer",
    price: 9490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20and%20gray%20mono%20laser%20printer%20with%20output%20tray%20on%20a%20clean%20light%20studio%20background%2C%20professional%20office%20printer%20product%20photography%20with%20soft%20shadow%20and%20crisp%20edges&width=800&height=800&seq=c533-m404dn&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dakikada 38 sayfa baskı hızı ve çift taraflı baskısıyla M404dn, yoğun belge üreten birimlere uygundur.",
    specs: [
      { label: "Baskı Hızı", value: "38 sayfa/dk mono" },
      { label: "Aylık Hacim", value: "80.000 sayfa" },
      { label: "Bağlantı", value: "USB, Ethernet" },
      { label: "Ekstra", value: "Otomatik çift taraflı" },
    ],
  },
  {
    id: "c534",
    slug: "canon-i-sensys-mf445dw",
    name: "Canon i-SENSYS MF445dw Çok Fonksiyonlu Lazer Yazıcı",
    brand: "Canon",
    category: "baski-lazer",
    price: 12490,
    oldPrice: 13290,
    rating: 4.5,
    reviewCount: 88,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20multifunction%20laser%20printer%20with%20scanner%20lid%20and%20touch%20panel%20on%20a%20light%20gray%20studio%20surface%2C%20office%20equipment%20product%20photography%20with%20soft%20lighting%20and%20clean%20background&width=800&height=800&seq=c534-mf445dw&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Yazdırma, tarama, kopyalama ve faks işlevlerini tek gövdede sunan MF445dw, küçük ofislerde yer kazandırır.",
    specs: [
      { label: "Fonksiyon", value: "Yazdır / Tara / Kopyala / Faks" },
      { label: "Baskı Hızı", value: "38 sayfa/dk" },
      { label: "Bağlantı", value: "USB, Ethernet, Wi-Fi" },
      { label: "Ekran", value: "6 satır dokunmatik" },
    ],
  },

  // Mürekkep
  {
    id: "c535",
    slug: "epson-ecotank-l3250",
    name: "Epson EcoTank L3250 Wi-Fi Tanklı Mürekkep Püskürtmeli Yazıcı",
    brand: "Epson",
    category: "baski-murekkep",
    price: 6490,
    oldPrice: 6990,
    rating: 4.5,
    reviewCount: 211,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20tank%20inkjet%20printer%20with%20visible%20ink%20reservoirs%20on%20the%20front%2C%20placed%20on%20a%20clean%20light%20studio%20background%2C%20consumer%20printer%20product%20photography%20with%20soft%20shadow%20and%20fine%20texture&width=800&height=800&seq=c535-ecotank-l3250&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Yüksek kapasiteli mürekkep tanklarıyla L3250, sayfa başı maliyeti düşük renkli baskı çözümü sunar.",
    specs: [
      { label: "Tip", value: "Tanklı inkjet, renkli" },
      { label: "Fonksiyon", value: "Yazdır / Tara / Kopyala" },
      { label: "Set Verimi", value: "Yaklaşık 4.500 sayfa" },
      { label: "Bağlantı", value: "Wi-Fi, USB" },
    ],
  },
  {
    id: "c536",
    slug: "canon-pixma-g3470",
    name: "Canon PIXMA G3470 Tanklı Wi-Fi Çok Fonksiyonlu Yazıcı",
    brand: "Canon",
    category: "baski-murekkep",
    price: 5890,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 97,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20multifunction%20inkjet%20printer%20with%20flatbed%20scanner%20and%20ink%20tanks%20on%20a%20white%20studio%20surface%2C%20clean%20home%20office%20printer%20product%20photography%20with%20soft%20even%20lighting&width=800&height=800&seq=c536-pixma-g3470&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "G3470, otomatik belge besleyicisi ve tanklı sistemiyle küçük ekiplerde düşük maliyetli baskı sağlar.",
    specs: [
      { label: "Tip", value: "Tanklı inkjet, renkli" },
      { label: "ADF", value: "35 sayfa" },
      { label: "Bağlantı", value: "Wi-Fi, USB" },
      { label: "Ekstra", value: "Otomatik çift taraflı" },
    ],
  },

  // Tarayıcı
  {
    id: "c537",
    slug: "fujitsu-fi-8170-belge-tarayici",
    name: "Fujitsu fi-8170 A4 Profesyonel Belge Tarayıcı",
    brand: "Fujitsu",
    category: "baski-tarayici",
    price: 34900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 34,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=professional%20document%20scanner%20with%20front%20paper%20feeder%20on%20a%20clean%20gray%20studio%20background%2C%20high%20end%20office%20equipment%20product%20photography%20with%20precise%20detail%20and%20soft%20directional%20light&width=800&height=800&seq=c537-fi-8170&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Dakikada 70 sayfa tarama hızıyla fi-8170, arşiv dijitalleştirme projelerinde yoğun iş yükünü kaldırır.",
    specs: [
      { label: "Tarama Hızı", value: "70 sayfa/dk" },
      { label: "ADF", value: "100 sayfa" },
      { label: "Çözünürlük", value: "600 dpi" },
      { label: "Bağlantı", value: "USB 3.2, Ethernet" },
    ],
  },
  {
    id: "c538",
    slug: "epson-workforce-ds-770ii",
    name: "Epson WorkForce DS-770II Belge Tarayıcı",
    brand: "Epson",
    category: "baski-tarayici",
    price: 22900,
    oldPrice: 24400,
    rating: 4.6,
    reviewCount: 41,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20desktop%20document%20scanner%20with%20folded%20paper%20guides%20on%20a%20light%20neutral%20surface%2C%20office%20scanning%20hardware%20product%20photography%20with%20crisp%20focus%20and%20clean%20minimal%20styling&width=800&height=800&seq=c538-ds-770ii&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "DS-770II, 45 sayfa/dk hızı ve 100 sayfalık besleyicisiyle muhasebe arşivlerini hızla dijitalleştirir.",
    specs: [
      { label: "Tarama Hızı", value: "45 sayfa/dk" },
      { label: "ADF", value: "100 sayfa" },
      { label: "Çözünürlük", value: "600 dpi" },
      { label: "Bağlantı", value: "USB 3.0" },
    ],
  },

  // Etiket & fiş
  {
    id: "c539",
    slug: "zebra-zd230-etiket-yazici",
    name: "Zebra ZD230 Termal Transfer Barkod Etiket Yazıcı",
    brand: "Zebra",
    category: "baski-etiket",
    price: 7490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 118,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20desktop%20thermal%20label%20printer%20with%20media%20roll%20visible%20on%20a%20light%20gray%20studio%20background%2C%20clean%20industrial%20hardware%20product%20photography%20with%20soft%20shadow%20and%20sharp%20detail&width=800&height=800&seq=c539-zebra-zd230&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "ZD230, 203 dpi çözünürlüğü ve kompakt gövdesiyle mağaza ve depo etiketlerinde hızlı baskı yapar.",
    specs: [
      { label: "Baskı", value: "Termal transfer, 203 dpi" },
      { label: "Hız", value: "152 mm/sn" },
      { label: "Bağlantı", value: "USB, Ethernet" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c540",
    slug: "epson-tm-t20iii-fis-yazici",
    name: "Epson TM-T20III Termal Fiş Yazıcı",
    brand: "Epson",
    category: "baski-etiket",
    price: 5290,
    oldPrice: 5590,
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=small%20black%20pos%20receipt%20printer%20with%20paper%20roll%20on%20a%20white%20studio%20surface%2C%20retail%20payment%20hardware%20product%20photography%20with%20clean%20lighting%20and%20precise%20proportions&width=800&height=800&seq=c540-tm-t20iii&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "TM-T20III, 250 mm/sn baskı hızıyla kasa önünde kuyruk oluşmasını engeller.",
    specs: [
      { label: "Baskı", value: "Termal, 80 mm" },
      { label: "Hız", value: "250 mm/sn" },
      { label: "Bağlantı", value: "USB, Ethernet" },
      { label: "Ekstra", value: "Kesici, otomatik" },
    ],
  },

  // Sarf
  {
    id: "c541",
    slug: "hp-26a-cf226a-toner",
    name: "HP 26A CF226A Orijinal Siyah Toner Kartuş",
    brand: "HP",
    category: "baski-sarf",
    price: 2490,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20laser%20printer%20toner%20cartridge%20standing%20upright%20on%20a%20clean%20white%20studio%20surface%2C%20simple%20consumable%20product%20photography%20with%20soft%20shadow%20and%20clear%20label%20detail&width=800&height=800&seq=c541-hp-26a-toner&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "HP 26A orijinal toner, LaserJet Pro M402/M426 serisi için 3.100 sayfa verim sunar.",
    specs: [
      { label: "Uyumluluk", value: "LaserJet Pro M402 / M426" },
      { label: "Verim", value: "3.100 sayfa" },
      { label: "Renk", value: "Siyah" },
      { label: "Orijinal", value: "Evet" },
    ],
  },
  {
    id: "c542",
    slug: "epson-103-murekkep-seti",
    name: "Epson 103 Uyumlu 4 Renk Mürekkep Şişesi Seti",
    brand: "Epson",
    category: "baski-sarf",
    price: 890,
    oldPrice: 990,
    rating: 4.4,
    reviewCount: 267,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=four%20small%20ink%20bottles%20in%20cyan%20magenta%20yellow%20and%20black%20arranged%20in%20a%20row%20on%20a%20light%20gray%20surface%2C%20clean%20printer%20consumable%20product%20photography%20with%20soft%20reflection&width=800&height=800&seq=c542-epson-103-set&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "EcoTank L3150 ve L3250 serisi için hazırlanan 4 renk set, uzun süreli baskı maliyeti düşürür.",
    specs: [
      { label: "Uyumluluk", value: "EcoTank L3150 / L3250" },
      { label: "Renk", value: "C, M, Y, K" },
      { label: "Hacim", value: "4× 65 ml" },
      { label: "Orijinal", value: "Evet" },
    ],
  },
];