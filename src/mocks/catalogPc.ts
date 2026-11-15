import type { Product } from "@/types/store";

/** Kişisel bilgisayarlar, bileşenler ve çevre birimleri kataloğu */
export const catalogPc: Product[] = [
  // Kişisel Bilgisayarlar → Dizüstü
  {
    id: "c101",
    slug: "hp-probook-450-g10-i5-1335u",
    name: "HP ProBook 450 G10 Core i5-1335U 16GB 512GB 15.6\" Dizüstü",
    brand: "HP",
    category: "kisisel-dizustu",
    price: 32900,
    oldPrice: 35900,
    rating: 4.5,
    reviewCount: 86,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=silver%20aluminium%20HP%20ProBook%20450%20G10%20corporate%20laptop%2C%2015.6%20inch%20matte%20screen%20open%20at%20a%20100%20degree%20angle%2C%20black%20spill-resistant%20keyboard%20deck%2C%20round%20HP%20logo%20on%20the%20silver%20lid%2C%20thin%20black%20plastic%20bezels%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20studio%20lighting%2C%20centered%20commercial%20product%20photography&width=800&height=800&seq=catalog-probook-450&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "13. nesil Intel işlemcili ProBook 450, parmak izi okuyucu ve aydınlatmalı klavyesiyle ofis çalışanları için hazırlanmış dayanıklı bir dizüstüdür.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-1335U (10C)" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB NVMe" },
      { label: "Ekran", value: "15.6\" FHD IPS" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c102",
    slug: "lenovo-thinkpad-e16-gen1-ryzen-7",
    name: "Lenovo ThinkPad E16 Gen 1 Ryzen 7 7730U 16GB 512GB",
    brand: "Lenovo",
    category: "kisisel-dizustu",
    price: 38500,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 54,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=matte%20black%20Lenovo%20ThinkPad%20E16%20Gen%201%20business%20laptop%20open%20at%20a%20wide%20angle%2C%2016%20inch%20widescreen%20display%2C%20black%20chiclet%20keyboard%20with%20white%20letters%20and%20red%20TrackPoint%20nub%20between%20the%20G%20H%20and%20B%20keys%2C%20ThinkPad%20logo%20with%20red%20dot%20on%20the%20lid%20corner%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20product%20photography&width=800&height=800&seq=catalog-thinkpad-e16&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Askeri standart dayanım testlerinden geçen ThinkPad E16, 16 inç ekranı ve geniş tuş yapısıyla yoğun kullanımda konfor sunar.",
    specs: [
      { label: "İşlemci", value: "AMD Ryzen 7 7730U" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB SSD" },
      { label: "Ekran", value: "16\" WUXGA IPS" },
      { label: "Ağırlık", value: "1.81 kg" },
    ],
  },

  // Masaüstü
  {
    id: "c103",
    slug: "dell-optiplex-7010-sff-i5-13500",
    name: "Dell OptiPlex 7010 SFF Core i5-13500 16GB 512GB Masaüstü",
    brand: "Dell",
    category: "kisisel-masaustu",
    price: 27400,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 62,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=compact%20black%20Dell%20OptiPlex%207010%20small%20form%20factor%20desktop%20chassis%2C%20short%20wide%20body%20with%20a%20mesh%20front%20panel%2C%20front%20USB%20ports%20and%20round%20power%20button%2C%20silver%20Dell%20badge%2C%20standing%20upright%20on%20a%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20corporate%20hardware%20product%20photography&width=800&height=800&seq=catalog-optiplex-7010&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "OptiPlex 7010 SFF, küçük gövdesine rağmen 13. nesil i5 işlemcisiyle çağrı merkezi ve muhasebe birimlerinde akıcı performans verir.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-13500 (14C)" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB NVMe" },
      { label: "Form Faktör", value: "Small Form Factor" },
      { label: "Garanti", value: "3 yıl yerinde servis" },
    ],
  },
  {
    id: "c104",
    slug: "hp-prodesk-400-g9-mt-i5",
    name: "HP ProDesk 400 G9 MT Core i5-12500 8GB 256GB Masaüstü",
    brand: "HP",
    category: "kisisel-masaustu",
    price: 21900,
    oldPrice: 23900,
    rating: 4.3,
    reviewCount: 41,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20HP%20ProDesk%20400%20G9%20micro%20tower%20desktop%20pc%20standing%20upright%20with%20its%20distinctive%20honeycomb%20mesh%20front%20grille%2C%20round%20HP%20logo%20badge%2C%20front%20USB%20ports%20and%20small%20power%20button%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20lighting%2C%20centered%20office%20hardware%20product%20photography&width=800&height=800&seq=catalog-prodesk-400&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "Yükseltilebilir gövde yapısıyla öne çıkan ProDesk 400, standart ofis yazılımları için dengeli ve sessiz bir masaüstü çözümüdür.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-12500 (6C)" },
      { label: "Bellek / Disk", value: "8 GB DDR4 / 256 GB SSD" },
      { label: "Port Yapısı", value: "8× USB, 2× DP, 1× HDMI" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // All-in-One
  {
    id: "c105",
    slug: "lenovo-ideacentre-aio-24-i5",
    name: "Lenovo IdeaCentre AIO 24 Core i5-12450H 16GB 512GB All-in-One",
    brand: "Lenovo",
    category: "kisisel-aio",
    price: 31900,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 38,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Lenovo%20IdeaCentre%20AIO%2024%20all%20in%20one%20desktop%20computer%2C%2023.8%20inch%20display%20with%20a%20very%20thin%20black%20bezel%20and%20glossy%20glass%20front%2C%20silver%20aluminium%20curved%20stand%20with%20hidden%20cable%20channel%2C%20small%20webcam%20bump%20on%20the%20top%20edge%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20premium%20electronics%20product%20photography&width=800&height=800&seq=catalog-aio-24-lenovo&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "23.8 inç ekranı, ince çerçevesi ve tek kablo kurulumuyla resepsiyon ile toplantı odalarına düzenli bir görünüm kazandırır.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-12450H" },
      { label: "Ekran", value: "23.8\" FHD IPS" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB SSD" },
      { label: "Kamera", value: "Dahili 1080p + mikrofon" },
    ],
  },
  {
    id: "c106",
    slug: "hp-proone-440-g9-aio-i5",
    name: "HP ProOne 440 G9 AIO Core i5-12500 23.8\" 16GB 512GB",
    brand: "HP",
    category: "kisisel-aio",
    price: 34600,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 27,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=HP%20ProOne%20440%20G9%20business%20all%20in%20one%20computer%2C%2023.8%20inch%20flat%20screen%20with%20a%20thin%20black%20bezel%2C%20pop-up%20webcam%20on%20the%20top%20edge%2C%20silver%20height%20adjustable%20stand%20with%20tilt%20mechanism%2C%20round%20HP%20logo%20under%20the%20screen%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20corporate%20product%20photography&width=800&height=800&seq=catalog-proone-440&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kurumsal filo yönetimine uygun ProOne 440, yükseklik ayarlı standı ve vPro desteğiyle banko kullanımında güvenilir bir seçenektir.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-12500 vPro" },
      { label: "Ekran", value: "23.8\" FHD IPS" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB SSD" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // İş istasyonu
  {
    id: "c107",
    slug: "hp-z2-tower-g9-xeon-w3-rtx-a2000",
    name: "HP Z2 Tower G9 Xeon W3-2423 32GB 1TB RTX A2000 İş İstasyonu",
    brand: "HP",
    category: "kisisel-is-istasyonu",
    price: 89900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 19,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=HP%20Z2%20Tower%20G9%20professional%20workstation%20desktop%2C%20large%20matte%20black%20tower%20chassis%20with%20a%20honeycomb%20mesh%20front%20panel%2C%20silver%20aluminium%20carry%20handle%20on%20the%20top%2C%20small%20HP%20badge%2C%20front%20drive%20slots%20and%20power%20button%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20engineering%20hardware%20product%20photography&width=800&height=800&seq=catalog-z2-tower&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "CAD ve mimari projelerde sertifikalı RTX A2000 ekran kartıyla çalışan Z2 Tower, ISV onaylı sürücüleriyle 7/24 üretim ortamlarına uygundur.",
    specs: [
      { label: "İşlemci", value: "Intel Xeon W3-2423 (6C)" },
      { label: "Bellek", value: "32 GB DDR5 ECC" },
      { label: "Ekran Kartı", value: "NVIDIA RTX A2000 12 GB" },
      { label: "Disk", value: "1 TB NVMe + 2 TB HDD" },
    ],
  },
  {
    id: "c108",
    slug: "dell-precision-3660-i7-rtx-a2000",
    name: "Dell Precision 3660 i7-13700 32GB 1TB RTX A2000 İş İstasyonu",
    brand: "Dell",
    category: "kisisel-is-istasyonu",
    price: 96500,
    oldPrice: 102000,
    rating: 4.6,
    reviewCount: 16,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Dell%20Precision%203660%20tower%20workstation%2C%20tall%20matte%20black%20chassis%20with%20vertical%20front%20ventilation%20slots%2C%20silver%20Dell%20badge%2C%20front%20optical%20drive%20bay%20and%20USB%20ports%20on%20the%20top%20section%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20professional%20engineering%20computer%20product%20photography&width=800&height=800&seq=catalog-precision-3660&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "3D modelleme ve video kurgu için 16 çekirdekli i7 işlemcisi ve ECC bellek desteğiyle Precision 3660, yoğun render iş yüklerini kısa sürede tamamlar.",
    specs: [
      { label: "İşlemci", value: "Intel Core i7-13700 (16C)" },
      { label: "Bellek", value: "32 GB DDR5 (128 GB'a kadar)" },
      { label: "Ekran Kartı", value: "NVIDIA RTX A2000 12 GB" },
      { label: "Disk", value: "1 TB NVMe" },
    ],
  },

  // Mini PC
  {
    id: "c109",
    slug: "intel-nuc-13-pro-i5-1340p",
    name: "Intel NUC 13 Pro Kit Core i5-1340P Mini PC (Barebone)",
    brand: "Intel",
    category: "kisisel-mini-pc",
    price: 15900,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 33,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=tiny%20square%20Intel%20NUC%2013%20Pro%20mini%20pc%20barebone%2C%20black%20textured%20plastic%20chassis%20only%20about%20four%20inches%20wide%2C%20front%20USB%20ports%20and%20power%20button%2C%20small%20Intel%20NUC%20logo%2C%20VESA%20mount%20screw%20holes%20on%20the%20bottom%20edge%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20compact%20tech%20hardware%20photography&width=800&height=800&seq=catalog-nuc-13-pro&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "0.5 litre hacimde i5 performansı sunan NUC 13 Pro, dijital tabela ve kiosk projelerinde arkasına monte edilebilen kompakt bir çözümdür.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-1340P" },
      { label: "Bellek / Disk", value: "2× SO-DIMM / 1× M.2 (hariç)" },
      { label: "Video Çıkışı", value: "2× HDMI 2.1, 2× DP" },
      { label: "Ağ", value: "2.5 GbE + Wi-Fi 6E" },
    ],
  },
  {
    id: "c110",
    slug: "lenovo-thinkcentre-m90q-tiny-i5",
    name: "Lenovo ThinkCentre M90q Tiny i5-12500T 16GB 512GB",
    brand: "Lenovo",
    category: "kisisel-mini-pc",
    price: 18900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 24,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Lenovo%20ThinkCentre%20M90q%20Tiny%20one%20litre%20micro%20desktop%2C%20small%20flat%20matte%20black%20box%20with%20a%20ventilated%20top%20cover%2C%20front%20USB%20ports%20and%20headphone%20jack%2C%20ThinkCentre%20badge%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20minimal%20corporate%20hardware%20photography&width=800&height=800&seq=catalog-m90q-tiny&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "M90q Tiny, monitör arkası montaj kitiyle masa üstünde hiç yer kaplamadan çağrı merkezi istasyonlarına kurulabilir.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-12500T (35W)" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB NVMe" },
      { label: "Boyut", value: "1 litre gövde" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // Bilgisayar Bileşenleri → İşlemci
  {
    id: "c111",
    slug: "intel-core-i5-14400f-islemci",
    name: "Intel Core i5-14400F 10 Çekirdek 20MB Önbellek LGA1700 İşlemci",
    brand: "Intel",
    category: "bilesen-islemci",
    price: 6890,
    oldPrice: 7490,
    rating: 4.7,
    reviewCount: 142,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Intel%20Core%20i5-14400F%20desktop%20cpu%2C%20square%20LGA1700%20processor%20with%20a%20polished%20silver%20nickel%20heat%20spreader%20and%20dark%20green%20pcb%20visible%20at%20the%20edges%2C%20notch%20and%20contact%20pads%20visible%20on%20the%20side%2C%20slight%20top%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20macro%20technology%20product%20photography&width=800&height=800&seq=catalog-i5-14400f&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "Dengeli fiyat performans sunan i5-14400F, ofis ve hafif içerik üretimi için yeterli çok çekirdek gücünü sağlar.",
    specs: [
      { label: "Çekirdek / İş Parçacığı", value: "10C / 16T" },
      { label: "Soket", value: "LGA1700" },
      { label: "Temel / Turbo Hız", value: "2.5 / 4.7 GHz" },
      { label: "TDP", value: "65 W" },
    ],
  },
  {
    id: "c112",
    slug: "amd-ryzen-7-5700x-islemci",
    name: "AMD Ryzen 7 5700X 8 Çekirdek 32MB AM4 İşlemci",
    brand: "AMD",
    category: "bilesen-islemci",
    price: 6490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 118,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=AMD%20Ryzen%207%205700X%20AM4%20desktop%20processor%2C%20rectangular%20chip%20with%20a%20silver%20heat%20spreader%20and%20orange%20amber%20pcb%20corners%2C%20gold%20pin%20pads%20underneath%20partly%20visible%2C%20photographed%20from%20above%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20macro%20hardware%20product%20photography&width=800&height=800&seq=catalog-ryzen-5700x&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "8 çekirdekli Ryzen 7 5700X, AM4 platformunda mevcut sistemleri yenilemek için yüksek çoklu görev kapasitesi sunar.",
    specs: [
      { label: "Çekirdek / İş Parçacığı", value: "8C / 16T" },
      { label: "Soket", value: "AM4" },
      { label: "Temel / Boost Hız", value: "3.4 / 4.6 GHz" },
      { label: "TDP", value: "65 W" },
    ],
  },

  // Anakart
  {
    id: "c113",
    slug: "asus-prime-b760m-a-wifi-ddr5",
    name: "ASUS PRIME B760M-A WIFI DDR5 LGA1700 Micro-ATX Anakart",
    brand: "ASUS",
    category: "bilesen-anakart",
    price: 4790,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=ASUS%20PRIME%20B760M-A%20WIFI%20DDR5%20micro%20ATX%20motherboard%20laid%20flat%20viewed%20from%20directly%20above%2C%20black%20pcb%20with%20silver%20and%20white%20vrm%20heatsinks%2C%20LGA1700%20socket%2C%20four%20DDR5%20dimm%20slots%2C%20two%20m.2%20slots%2C%20rear%20io%20shield%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20lighting%2C%20clean%20technical%20hardware%20photography&width=800&height=800&seq=catalog-b760m-a&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Dahili Wi-Fi 6 ve 2.5 GbE bağlantısı bulunan B760M-A, kurumsal masaüstü toplamalarında kablo karmaşasını azaltır.",
    specs: [
      { label: "Chipset / Soket", value: "B760 / LGA1700" },
      { label: "Bellek", value: "4× DDR5 (128 GB'a kadar)" },
      { label: "Form Faktör", value: "Micro-ATX" },
      { label: "Ağ", value: "2.5 GbE + Wi-Fi 6" },
    ],
  },
  {
    id: "c114",
    slug: "msi-pro-b650m-p-am5-anakart",
    name: "MSI PRO B650M-P AM5 DDR5 Micro-ATX Anakart",
    brand: "MSI",
    category: "bilesen-anakart",
    price: 4290,
    oldPrice: 4590,
    rating: 4.3,
    reviewCount: 51,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=MSI%20PRO%20B650M-P%20AM5%20micro%20ATX%20motherboard%20laid%20flat%2C%20dark%20black%20pcb%20with%20black%20aluminium%20chipset%20and%20vrm%20heatsinks%2C%20AM5%20socket%2C%20four%20DDR5%20dimm%20slots%2C%20two%20m.2%20slots%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20lighting%2C%20precise%20computer%20hardware%20product%20photography&width=800&height=800&seq=catalog-b650m-p&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "PRO B650M-P, AM5 platformunda uzun ömürlü kondansatörleri ve DDR5 desteğiyle ofis sistemlerinde kararlı çalışır.",
    specs: [
      { label: "Chipset / Soket", value: "B650 / AM5" },
      { label: "Bellek", value: "4× DDR5 (128 GB'a kadar)" },
      { label: "M.2 Yuvası", value: "2× Gen4" },
      { label: "Ağ", value: "2.5 GbE" },
    ],
  },

  // Bellek
  {
    id: "c115",
    slug: "kingston-fury-beast-16gb-ddr5-5600",
    name: "Kingston Fury Beast 16GB DDR5 5600MHz CL36 Bellek",
    brand: "Kingston",
    category: "bilesen-bellek",
    price: 2190,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 163,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=single%20Kingston%20Fury%20Beast%20DDR5%2016GB%20memory%20module%2C%20low%20profile%20black%20aluminium%20heat%20spreader%20with%20white%20Fury%20logo%2C%20gold%20contact%20edge%20visible%20at%20the%20bottom%2C%20standing%20upright%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20ram%20product%20photography&width=800&height=800&seq=catalog-fury-ddr5&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Düşük profilli soğutucu bloğu sayesinde dar kasalara uyum sağlayan Fury Beast, günlük ofis yüklerinde yüksek bant genişliği sunar.",
    specs: [
      { label: "Kapasite", value: "16 GB (1× 16 GB)" },
      { label: "Hız / Gecikme", value: "5600 MHz / CL36" },
      { label: "Tip", value: "DDR5 UDIMM" },
      { label: "Garanti", value: "Ömür boyu" },
    ],
  },
  {
    id: "c116",
    slug: "corsair-vengeance-32gb-ddr4-3200",
    name: "Corsair Vengeance LPX 32GB (2×16GB) DDR4 3200MHz Bellek Kit",
    brand: "Corsair",
    category: "bilesen-bellek",
    price: 2890,
    oldPrice: 3190,
    rating: 4.6,
    reviewCount: 97,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=two%20Corsair%20Vengeance%20LPX%20DDR4%20memory%20modules%2C%20matte%20black%20low%20profile%20aluminium%20heat%20spreaders%20with%20white%20Vengeance%20lettering%2C%20standing%20side%20by%20side%20at%20a%20slight%20angle%20with%20gold%20contacts%20visible%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20minimal%20hardware%20product%20photography&width=800&height=800&seq=catalog-vengeance-32&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Çift kanal kit olarak gelen Vengeance LPX, çoklu sekme ve sanal makine kullanan kullanıcılar için geniş bellek alanı sağlar.",
    specs: [
      { label: "Kapasite", value: "32 GB (2× 16 GB)" },
      { label: "Hız / Gecikme", value: "3200 MHz / CL16" },
      { label: "Tip", value: "DDR4 UDIMM" },
      { label: "Garanti", value: "Ömür boyu" },
    ],
  },

  // SSD & HDD
  {
    id: "c117",
    slug: "samsung-990-pro-1tb-nvme-ssd",
    name: "Samsung 990 PRO 1TB NVMe PCIe 4.0 M.2 SSD",
    brand: "Samsung",
    category: "bilesen-disk",
    price: 3690,
    oldPrice: null,
    rating: 4.9,
    reviewCount: 288,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Samsung%20990%20PRO%201TB%20NVMe%20m.2%20ssd%20stick%20lying%20at%20a%20slight%20angle%2C%20black%20label%20with%20red%20accent%20and%20white%20990%20PRO%20text%2C%20gold%20m.2%20connector%20pins%20visible%20at%20the%20end%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20macro%20technology%20product%20photography&width=800&height=800&seq=catalog-990-pro&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "990 PRO, 7450 MB/s okuma hızıyla işletim sistemi ve yoğun uygulama açılışlarında belirgin hız artışı sağlar.",
    specs: [
      { label: "Kapasite", value: "1 TB" },
      { label: "Arayüz", value: "PCIe 4.0 x4 NVMe 2.0" },
      { label: "Okuma / Yazma", value: "7450 / 6900 MB/s" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },
  {
    id: "c118",
    slug: "seagate-ironwolf-8tb-nas-disk",
    name: "Seagate IronWolf 8TB 3.5\" 7200rpm NAS Sabit Disk",
    brand: "Seagate",
    category: "bilesen-disk",
    price: 8490,
    oldPrice: 8990,
    rating: 4.6,
    reviewCount: 131,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Seagate%20IronWolf%208TB%203.5%20inch%20internal%20hard%20drive%2C%20silver%20aluminium%20top%20cover%20with%20a%20dark%20green%20and%20black%20IronWolf%20label%2C%20sata%20data%20and%20power%20connectors%20visible%20on%20the%20rear%20edge%2C%20lying%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20detailed%20storage%20hardware%20product%20photography&width=800&height=800&seq=catalog-ironwolf-8tb&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "IronWolf, çok yuvalı NAS sistemlerinde titreşim sensörleri ve 7/24 çalışma sertifikasıyla uzun ömürlü arşivleme sunar.",
    specs: [
      { label: "Kapasite", value: "8 TB" },
      { label: "Devir / Önbellek", value: "7200 rpm / 256 MB" },
      { label: "Arayüz", value: "SATA 6 Gb/s" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // Ekran kartı
  {
    id: "c119",
    slug: "asus-dual-rtx-4060-8gb",
    name: "ASUS Dual GeForce RTX 4060 OC 8GB GDDR6 Ekran Kartı",
    brand: "ASUS",
    category: "bilesen-ekran-karti",
    price: 13900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 108,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=ASUS%20Dual%20GeForce%20RTX%204060%20OC%20graphics%20card%2C%20short%20compact%20dual%20fan%20black%20shroud%20with%20a%20thin%20silver%20accent%20stripe%2C%20two%20axial%20fans%2C%20metal%20backplate%2C%20single%208%20pin%20power%20connector%20on%20the%20top%20edge%2C%20photographed%20at%20a%20three%20quarter%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20gaming%20hardware%20product%20photography&width=800&height=800&seq=catalog-dual-4060&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Çift fanlı soğutma tasarımıyla RTX 4060, tasarım ve hafif render işlerinde sessiz çalışırken DLSS 3 desteği sunar.",
    specs: [
      { label: "Bellek", value: "8 GB GDDR6" },
      { label: "Veri Yolu", value: "PCIe 4.0, 128-bit" },
      { label: "Çıkışlar", value: "3× DP 1.4, 1× HDMI 2.1" },
      { label: "Güç", value: "8-pin, 115 W" },
    ],
  },
  {
    id: "c120",
    slug: "gigabyte-rtx-a2000-12gb-profesyonel",
    name: "Gigabyte NVIDIA RTX A2000 12GB Profesyonel Ekran Kartı",
    brand: "Gigabyte",
    category: "bilesen-ekran-karti",
    price: 24900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 42,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=NVIDIA%20RTX%20A2000%2012GB%20professional%20workstation%20graphics%20card%2C%20compact%20low%20profile%20dual%20slot%20body%2C%20single%20small%20blower%20fan%2C%20black%20and%20silver%20shroud%2C%20four%20mini%20displayport%20outputs%20on%20the%20bracket%2C%20no%20external%20power%20connector%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20precise%20engineering%20hardware%20photography&width=800&height=800&seq=catalog-a2000-12gb&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Tek yuvalık A2000, ISV sertifikalı sürücüleriyle CAD yazılımlarında ve çoklu monitör kurulumlarında stabil çalışır.",
    specs: [
      { label: "Bellek", value: "12 GB GDDR6 ECC" },
      { label: "Form", value: "Tek yuva, düşük profil" },
      { label: "Çıkışlar", value: "4× mini DP 1.4" },
      { label: "Güç", value: "70 W, harici güç gerekmez" },
    ],
  },

  // Kasa & Güç
  {
    id: "c121",
    slug: "corsair-4000d-airflow-kasa",
    name: "Corsair 4000D Airflow Mid-Tower ATX Bilgisayar Kasası",
    brand: "Corsair",
    category: "bilesen-kasa-guc",
    price: 2790,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Corsair%204000D%20Airflow%20mid%20tower%20atx%20pc%20case%2C%20matte%20black%20steel%20body%2C%20dense%20mesh%20front%20panel%20with%20a%20small%20Corsair%20sail%20logo%2C%20dark%20tinted%20tempered%20glass%20side%20panel%20showing%20the%20empty%20interior%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20hardware%20product%20photography&width=800&height=800&seq=catalog-4000d&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Mesh ön paneli sayesinde hava akışını artıran 4000D, toz filtreleri ve kablo yönetimi kanallarıyla kurumsal sistemlerde bakımı kolaylaştırır.",
    specs: [
      { label: "Form Faktör", value: "Mid-Tower ATX" },
      { label: "Anakart Desteği", value: "ATX / mATX / ITX" },
      { label: "Fan", value: "2× 120 mm dahil" },
      { label: "Panel", value: "Temperli cam yan panel" },
    ],
  },
  {
    id: "c122",
    slug: "corsair-rm750e-750w-80-plus-gold",
    name: "Corsair RM750e 750W 80+ Gold Tam Modüler Güç Kaynağı",
    brand: "Corsair",
    category: "bilesen-kasa-guc",
    price: 3490,
    oldPrice: 3790,
    rating: 4.8,
    reviewCount: 203,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Corsair%20RM750e%20750W%20fully%20modular%20power%20supply%2C%20matte%20black%20rectangular%20atx%20unit%20with%20a%20large%20140mm%20fan%20grille%20and%20white%20Corsair%20label%20on%20the%20side%2C%20modular%20connector%20panel%20partly%20visible%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20technical%20pc%20hardware%20product%20photography&width=800&height=800&seq=catalog-rm750e&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "80+ Gold verimliliği ve tam modüler kablolarıyla RM750e, ofis sistemlerinde enerji maliyetini ve kablo karmaşasını azaltır.",
    specs: [
      { label: "Güç", value: "750 W" },
      { label: "Sertifika", value: "80+ Gold" },
      { label: "Kablo", value: "Tam modüler" },
      { label: "Garanti", value: "7 yıl" },
    ],
  },

  // Çevre Birimleri → Monitör
  {
    id: "c123",
    slug: "dell-p2422h-24-fhd-ips-monitor",
    name: "Dell P2422H 24\" Full HD IPS Monitör (Yükseklik Ayarlı)",
    brand: "Dell",
    category: "cevre-monitor",
    price: 4590,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 174,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Dell%20P2422H%2024%20inch%20office%20monitor%20in%20landscape%20orientation%2C%20thin%20black%20bezels%2C%20matte%20dark%20panel%20with%20a%20small%20silver%20Dell%20logo%20in%20the%20center%2C%20black%20height%20adjustable%20stand%20with%20a%20cable%20hole%20and%20hexagonal%20base%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20display%20product%20photography&width=800&height=800&seq=catalog-p2422h&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Ergonomik standı ve ComfortView düşük mavi ışık modu ile P2422H, uzun çalışma saatlerinde göz yorgunluğunu azaltır.",
    specs: [
      { label: "Ekran", value: "23.8\" IPS, 1920×1080" },
      { label: "Bağlantı", value: "HDMI, DP, VGA, USB hub" },
      { label: "Stand", value: "Yükseklik / pivot / tilt" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c124",
    slug: "lg-27up650-27-4k-ips-monitor",
    name: "LG 27UP650 27\" 4K UHD IPS HDR10 Monitör",
    brand: "LG",
    category: "cevre-monitor",
    price: 8990,
    oldPrice: 9790,
    rating: 4.7,
    reviewCount: 92,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=LG%2027UP650%2027%20inch%204K%20UHD%20IPS%20monitor%2C%20almost%20borderless%20panel%2C%20silver%20white%20crescent%20shaped%20stand%2C%20black%20rear%20housing%2C%20LG%20logo%20on%20the%20bottom%20bezel%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20display%20product%20photography&width=800&height=800&seq=catalog-27up650&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "4K çözünürlüklü 27UP650, tasarım ve video işleri için geniş renk aralığı ve HDR10 desteğiyle detayları netleştirir.",
    specs: [
      { label: "Ekran", value: "27\" IPS, 3840×2160" },
      { label: "Renk", value: "DCI-P3 %95" },
      { label: "Bağlantı", value: "2× HDMI, 1× DP, USB-C" },
      { label: "Güç", value: "HDR10, FreeSync" },
    ],
  },

  // Klavye & Mouse
  {
    id: "c125",
    slug: "logitech-mk540-kablosuz-set",
    name: "Logitech MK540 Advanced Kablosuz Klavye Mouse Seti",
    brand: "Logitech",
    category: "cevre-klavye-mouse",
    price: 1490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 231,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Logitech%20MK540%20Advanced%20wireless%20keyboard%20and%20mouse%20combo%2C%20full%20size%20black%20keyboard%20with%20a%20palm%20rest%20and%20media%20shortcut%20keys%2C%20curved%20black%20wireless%20mouse%20beside%20it%2C%20arranged%20neatly%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20office%20peripheral%20product%20photography&width=800&height=800&seq=catalog-mk540&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Tek alıcıyla çalışan MK540 seti, sessiz tuşları ve su dökülmesine dayanıklı tasarımıyla ofis kullanımı için pratiktir.",
    specs: [
      { label: "Bağlantı", value: "2.4 GHz USB alıcı" },
      { label: "Klavye", value: "Türkçe Q, sessiz tuşlar" },
      { label: "Pil Ömrü", value: "Klavye 36 ay / mouse 18 ay" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c126",
    slug: "logitech-mx-keys-combo-klavye-mouse",
    name: "Logitech MX Keys Combo Kablosuz Klavye ve MX Master 3S Seti",
    brand: "Logitech",
    category: "cevre-klavye-mouse",
    price: 4290,
    oldPrice: 4690,
    rating: 4.8,
    reviewCount: 76,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Logitech%20MX%20Keys%20graphite%20wireless%20keyboard%20with%20a%20low%20profile%20grey%20aluminium%20top%20plate%20and%20softly%20backlit%20keys%2C%20next%20to%20a%20dark%20graphite%20MX%20Master%203S%20ergonomic%20mouse%20with%20thumb%20wheel%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20high%20end%20desk%20accessory%20product%20photography&width=800&height=800&seq=catalog-mx-keys-combo&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "Çoklu cihaz geçişi ve sessiz manyetik tuş yapısıyla MX Keys Combo, yoğun yazı yazan ekipler için tasarlandı.",
    specs: [
      { label: "Bağlantı", value: "Bluetooth + Logi Bolt" },
      { label: "Çoklu Cihaz", value: "3 cihaz arası geçiş" },
      { label: "Şarj", value: "USB-C" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Kulaklık
  {
    id: "c127",
    slug: "jabra-evolve2-40-usb-c-kulaklik",
    name: "Jabra Evolve2 40 USB-C Kablolu Ofis Kulaklığı",
    brand: "Jabra",
    category: "cevre-kulaklik",
    price: 3490,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 118,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Jabra%20Evolve2%2040%20black%20wired%20office%20headset%2C%20on%20ear%20design%20with%20soft%20leatherette%20cushions%2C%20slim%20boom%20microphone%20arm%2C%20braided%20usb-c%20cable%2C%20resting%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20corporate%20audio%20product%20photography&width=800&height=800&seq=catalog-evolve2-40&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Sertifikalı yazılım uyumluluğu ve gürültü engelleyen mikrofonuyla Evolve2 40, çağrı merkezlerinde net görüşme sağlar.",
    specs: [
      { label: "Bağlantı", value: "USB-C / USB-A" },
      { label: "Mikrofon", value: "3 mikrofonlu gürültü engelleme" },
      { label: "Sertifikasyon", value: "MS Teams, Zoom" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c128",
    slug: "poly-blackwire-3320-headset",
    name: "Poly Blackwire 3320 Stereo USB Kulaklık",
    brand: "Poly",
    category: "cevre-kulaklik",
    price: 2190,
    oldPrice: 2490,
    rating: 4.4,
    reviewCount: 67,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Poly%20Blackwire%203320%20stereo%20usb%20office%20headset%2C%20black%20over%20ear%20headband%20with%20soft%20leatherette%20ear%20cushions%2C%20flexible%20boom%20microphone%2C%20inline%20call%20control%20unit%20on%20the%20cable%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20professional%20communication%20hardware%20photography&width=800&height=800&seq=catalog-blackwire-3320&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kulak üstü yastıkları ve tak-çalıştır USB bağlantısıyla Blackwire 3320, uzaktan çalışan ekiplerin standart ekipmanıdır.",
    specs: [
      { label: "Bağlantı", value: "USB-A" },
      { label: "Ses", value: "Stereo, pasif gürültü engelleme" },
      { label: "Kumanda", value: "Hat üstü ses ve mute" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // Web kamera
  {
    id: "c129",
    slug: "logitech-brio-505-webcam",
    name: "Logitech Brio 505 Full HD 1080p Web Kamerası",
    brand: "Logitech",
    category: "cevre-webcam",
    price: 3490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 143,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Logitech%20Brio%20505%20full%20hd%20webcam%2C%20small%20rounded%20graphite%20grey%20body%20with%20a%20glass%20lens%20and%20a%20sliding%20privacy%20shutter%20on%20top%2C%20foldable%20monitor%20mount%20clip%2C%20standing%20freestanding%20at%20a%20three%20quarter%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20video%20conferencing%20device%20photography&width=800&height=800&seq=catalog-brio-505&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Otomatik ışık dengeleme ve gizlilik kapağı bulunan Brio 505, toplantı odalarında ve ev ofislerinde net görüntü verir.",
    specs: [
      { label: "Çözünürlük", value: "1080p / 30 fps" },
      { label: "Görüş Açısı", value: "90°" },
      { label: "Bağlantı", value: "USB-C" },
      { label: "Ekstra", value: "Gizlilik kapağı, çift mikrofon" },
    ],
  },
  {
    id: "c130",
    slug: "hp-965-4k-webcam",
    name: "HP 965 4K Akış Web Kamerası",
    brand: "HP",
    category: "cevre-webcam",
    price: 4890,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 41,
    inStock: false,
    image:
      "https://readdy.ai/api/search-image?query=HP%20965%204K%20streaming%20webcam%2C%20compact%20black%20cylindrical%20body%20with%20a%20large%20glass%20lens%20and%20a%20thin%20silver%20trim%20ring%2C%20built%20in%20tripod%20thread%20and%20clip%20mount%20underneath%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20professional%20broadcast%20camera%20product%20photography&width=800&height=800&seq=catalog-hp-965&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "4K çözünürlüğü ve otomatik çerçeveleme özelliğiyle HP 965, webinar ve canlı yayınlar için stüdyo kalitesinde görüntü üretir.",
    specs: [
      { label: "Çözünürlük", value: "4K / 30 fps" },
      { label: "Özellik", value: "Otomatik ışık ve çerçeveleme" },
      { label: "Bağlantı", value: "USB-C, tripod dişi" },
      { label: "Ses", value: "Çift yönlü mikrofon" },
    ],
  },

  // Docking
  {
    id: "c131",
    slug: "dell-wd19s-180w-docking-station",
    name: "Dell WD19S 180W USB-C Docking Station",
    brand: "Dell",
    category: "cevre-dock",
    price: 5490,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 128,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Dell%20WD19S%20180W%20usb-c%20docking%20station%2C%20flat%20rounded%20rectangular%20matte%20black%20body%20with%20a%20silver%20edge%2C%20rear%20port%20cluster%20with%20displayport%20hdmi%20usb%20and%20ethernet%2C%20thick%20usb-c%20cable%20coiled%20beside%20it%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20corporate%20accessory%20product%20photography&width=800&height=800&seq=catalog-wd19s&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Tek USB-C kabloyla çift 4K ekran, gigabit ağ ve 90 W şarj sağlayan WD19S, masaüstü kurulumunu tek bağlantıya indirir.",
    specs: [
      { label: "Ekran Desteği", value: "2× 4K @ 60 Hz" },
      { label: "Şarj", value: "90 W dizüstü şarjı" },
      { label: "Portlar", value: "2× DP, HDMI, USB-A/C, RJ45" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c132",
    slug: "ugreen-usb-c-9-in-1-hub",
    name: "Ugreen USB-C 9-in-1 Çoklayıcı Hub (HDMI + RJ45 + SD)",
    brand: "Ugreen",
    category: "cevre-dock",
    price: 1290,
    oldPrice: 1490,
    rating: 4.4,
    reviewCount: 214,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Ugreen%209%20in%201%20usb-c%20hub%2C%20slim%20space%20grey%20aluminium%20rectangular%20body%20with%20a%20short%20braided%20usb-c%20pigtail%20cable%2C%20hdmi%20ethernet%20sd%20card%20and%20usb%20ports%20visible%20along%20one%20side%2C%20lying%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20minimal%20tech%20accessory%20product%20photography&width=800&height=800&seq=catalog-ugreen-9in1&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Seyahat çantasına sığan 9-in-1 hub, sunum öncesi HDMI ve ağ bağlantısını tek kabloyla tamamlar.",
    specs: [
      { label: "Portlar", value: "HDMI 4K, 3× USB-A, USB-C, RJ45, SD/microSD" },
      { label: "Güç", value: "100 W PD geçiş" },
      { label: "Gövde", value: "Alüminyum" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
];