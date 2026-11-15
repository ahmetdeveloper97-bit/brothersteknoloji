import type { Product } from "@/types/store";

/** Kişisel bilgisayarlar ve bileşenler için ek katalog */
export const catalogPcExtra: Product[] = [
  // Dizüstü
  {
    id: "c501",
    slug: "asus-expertbook-b1-i5-1235u",
    name: "ASUS ExpertBook B1 Core i5-1235U 8GB 512GB 15.6\" Dizüstü",
    brand: "ASUS",
    category: "kisisel-dizustu",
    price: 24900,
    oldPrice: 26400,
    rating: 4.4,
    reviewCount: 63,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=dark%20grey%20ASUS%20ExpertBook%20B1%2015.6%20inch%20business%20laptop%2C%20matte%20plastic%20body%20open%20at%20a%20110%20degree%20angle%2C%20black%20chiclet%20keyboard%20with%20numeric%20keypad%2C%20silver%20ASUS%20logo%20on%20the%20lid%2C%20thin%20black%20bezels%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20centered%20corporate%20notebook%20product%20photography&width=800&height=800&seq=c501-expertbook-b1&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "ExpertBook B1, askeri standart dayanım testleri ve parmak izi okuyucusuyla saha ekipleri için hazırlanmış ekonomik bir dizüstüdür.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-1235U" },
      { label: "Bellek / Disk", value: "8 GB DDR4 / 512 GB NVMe" },
      { label: "Ekran", value: "15.6\" FHD IPS" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
  {
    id: "c502",
    slug: "hp-elitebook-840-g10-i7",
    name: "HP EliteBook 840 G10 Core i7-1355U 16GB 1TB 14\" Dizüstü",
    brand: "HP",
    category: "kisisel-dizustu",
    price: 44900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 71,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=silver%20aluminium%20HP%20EliteBook%20840%20G10%2014%20inch%20executive%20laptop%2C%20thin%20magnesium%20chassis%20half%20open%20showing%20a%20narrow%20bezel%20matte%20display%2C%20black%20backlit%20keyboard%2C%20round%20HP%20logo%20on%20the%20lid%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20refined%20corporate%20hardware%20product%20photography&width=800&height=800&seq=c502-elitebook-840&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Alüminyum gövdesi, vPro yönetimi ve gelişmiş kamera gizlilik kapağıyla EliteBook 840, yönetici seviyesinde mobilite sunar.",
    specs: [
      { label: "İşlemci", value: "Intel Core i7-1355U vPro" },
      { label: "Bellek / Disk", value: "16 GB DDR5 / 1 TB NVMe" },
      { label: "Ekran", value: "14\" WUXGA 400 nit" },
      { label: "Ağırlık", value: "1.36 kg" },
    ],
  },

  // Masaüstü
  {
    id: "c503",
    slug: "hp-elitedesk-800-g9-sff-i7",
    name: "HP EliteDesk 800 G9 SFF Core i7-13700 16GB 512GB Masaüstü",
    brand: "HP",
    category: "kisisel-masaustu",
    price: 33900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 44,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20HP%20EliteDesk%20800%20G9%20small%20form%20factor%20corporate%20desktop%2C%20low%20wide%20chassis%20with%20a%20dotted%20pattern%20front%20panel%2C%20front%20USB%20ports%20and%20slim%20slot%2C%20round%20HP%20logo%2C%20standing%20upright%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20business%20hardware%20product%20photography&width=800&height=800&seq=c503-elitedesk-800&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "13. nesil i7 işlemcisi ve üç yıl yerinde servis desteğiyle EliteDesk 800, yoğun ofis kullanımında uzun ömürlü bir yatırımdır.",
    specs: [
      { label: "İşlemci", value: "Intel Core i7-13700 (16C)" },
      { label: "Bellek / Disk", value: "16 GB DDR5 / 512 GB NVMe" },
      { label: "Portlar", value: "USB-C, 4× USB-A, 2× DP" },
      { label: "Garanti", value: "3 yıl yerinde servis" },
    ],
  },
  {
    id: "c504",
    slug: "asus-expertcenter-d500-mt-i5",
    name: "ASUS ExpertCenter D500 MT Core i5-13400 16GB 512GB Masaüstü",
    brand: "ASUS",
    category: "kisisel-masaustu",
    price: 22900,
    oldPrice: 24400,
    rating: 4.4,
    reviewCount: 36,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20ASUS%20ExpertCenter%20D500%20mid%20tower%20office%20desktop%20computer%2C%20vertical%20ventilation%20grille%20on%20the%20front%20panel%2C%20front%20USB%20ports%20and%20optical%20drive%20slot%2C%20ASUS%20logo%20badge%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20lighting%2C%20minimal%20corporate%20hardware%20product%20photography&width=800&height=800&seq=c504-expertcenter-d500&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Kolay erişilebilir gövde yapısı ve toz filtreleriyle ExpertCenter D500, bakım gerektiren ortamlarda parça değişimini hızlandırır.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-13400 (10C)" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB SSD" },
      { label: "Form Faktör", value: "Mid-Tower" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // All-in-One
  {
    id: "c505",
    slug: "dell-optiplex-aio-7420-i5",
    name: "Dell OptiPlex AIO 7420 Core i5-13500 23.8\" 16GB 512GB",
    brand: "Dell",
    category: "kisisel-aio",
    price: 39900,
    oldPrice: 42500,
    rating: 4.6,
    reviewCount: 29,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Dell%20OptiPlex%207420%20all%20in%20one%20desktop%20computer%2C%2023.8%20inch%20narrow%20bezel%20display%2C%20slim%20silver%20aluminium%20stand%20with%20articulation%2C%20pop-up%20webcam%20on%20the%20top%20edge%2C%20silver%20Dell%20logo%20on%20the%20bottom%20bezel%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20office%20technology%20product%20photography&width=800&height=800&seq=c505-optiplex-aio-7420&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Döner standı ve pop-up kamerasıyla OptiPlex AIO 7420, banko ve müşteri karşılama alanlarında hem güvenli hem düzenli bir çözüm sunar.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-13500" },
      { label: "Ekran", value: "23.8\" FHD IPS, dokunmatik" },
      { label: "Bellek / Disk", value: "16 GB DDR5 / 512 GB SSD" },
      { label: "Kamera", value: "Pop-up 5 MP" },
    ],
  },
  {
    id: "c506",
    slug: "hp-proone-240-g10-aio-i3",
    name: "HP ProOne 240 G10 AIO Core i3-1315U 23.8\" 8GB 256GB",
    brand: "HP",
    category: "kisisel-aio",
    price: 22900,
    oldPrice: null,
    rating: 4.2,
    reviewCount: 22,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=HP%20ProOne%20240%20G10%20all%20in%20one%20desktop%20computer%2C%2023.8%20inch%20flat%20panel%20with%20slim%20white%20silver%20bezel%2C%20simple%20white%20plastic%20tilted%20stand%2C%20round%20HP%20logo%20under%20the%20screen%2C%20clean%20bright%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20affordable%20office%20technology%20product%20photography&width=800&height=800&seq=c506-proone-240&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "ProOne 240, tek prizle çalışan kompakt yapısıyla şube ve depo ofislerinde kablo kalabalığını ortadan kaldırır.",
    specs: [
      { label: "İşlemci", value: "Intel Core i3-1315U" },
      { label: "Ekran", value: "23.8\" FHD IPS" },
      { label: "Bellek / Disk", value: "8 GB DDR4 / 256 GB SSD" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },

  // İş istasyonu
  {
    id: "c507",
    slug: "lenovo-thinkstation-p3-tower-i7",
    name: "Lenovo ThinkStation P3 Tower i7-13700 32GB 1TB RTX A2000",
    brand: "Lenovo",
    category: "kisisel-is-istasyonu",
    price: 84900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 21,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Lenovo%20ThinkStation%20P3%20Tower%20professional%20workstation%2C%20large%20matte%20black%20chassis%20with%20a%20mesh%20front%20panel%20and%20integrated%20carry%20handle%2C%20ThinkStation%20badge%2C%20front%20drive%20bays%20and%20red%20accent%20ring%20on%20the%20power%20button%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20lighting%2C%20engineering%20grade%20computer%20product%20photography&width=800&height=800&seq=c507-thinkstation-p3&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "ISV sertifikalı ThinkStation P3, mimari görselleştirme ve CAD yazılımlarında kararlı sürücü desteğiyle çalışır.",
    specs: [
      { label: "İşlemci", value: "Intel Core i7-13700 (16C)" },
      { label: "Bellek", value: "32 GB DDR5" },
      { label: "Ekran Kartı", value: "NVIDIA RTX A2000 12 GB" },
      { label: "Disk", value: "1 TB NVMe" },
    ],
  },
  {
    id: "c508",
    slug: "dell-precision-5860-tower-xeon",
    name: "Dell Precision 5860 Tower Xeon W5-2445 64GB 2TB RTX A4000",
    brand: "Dell",
    category: "kisisel-is-istasyonu",
    price: 189900,
    oldPrice: 199900,
    rating: 4.8,
    reviewCount: 11,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Dell%20Precision%205860%20Tower%20large%20professional%20workstation%2C%20tall%20matte%20black%20chassis%20with%20vertical%20front%20ventilation%20grille%2C%20side%20carry%20handle%20integrated%20into%20the%20top%2C%20silver%20Dell%20badge%2C%20front%20port%20cluster%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20dramatic%20studio%20lighting%2C%20high%20end%20engineering%20hardware%20product%20photography&width=800&height=800&seq=c508-precision-5860&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Xeon W işlemcisi ve 64 GB ECC belleğiyle Precision 5860, simülasyon ve render çiftliklerinde uzun süreli yükleri kaldırır.",
    specs: [
      { label: "İşlemci", value: "Intel Xeon W5-2445 (10C)" },
      { label: "Bellek", value: "64 GB DDR5 ECC" },
      { label: "Ekran Kartı", value: "NVIDIA RTX A4000 16 GB" },
      { label: "Disk", value: "2 TB NVMe" },
    ],
  },

  // Mini PC
  {
    id: "c509",
    slug: "hp-elite-mini-800-g9-i7",
    name: "HP Elite Mini 800 G9 i7-13700T 16GB 512GB Mini PC",
    brand: "HP",
    category: "kisisel-mini-pc",
    price: 27900,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 34,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=HP%20Elite%20Mini%20800%20G9%20very%20compact%20square%20mini%20desktop%20computer%2C%20flat%20matte%20black%20box%20with%20a%20textured%20top%20cover%2C%20front%20USB%20ports%20and%20headphone%20jack%2C%20round%20HP%20logo%2C%20rear%20ports%20partly%20visible%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20minimal%20corporate%20hardware%20product%20photography&width=800&height=800&seq=c509-elite-mini-800&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Elite Mini 800, monitör arkası montaj ile masa üstünde iz bırakmadan çağrı merkezi istasyonlarına kurulur.",
    specs: [
      { label: "İşlemci", value: "Intel Core i7-13700T (35W)" },
      { label: "Bellek / Disk", value: "16 GB DDR5 / 512 GB NVMe" },
      { label: "Çıkışlar", value: "2× DP, HDMI, 6× USB" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c510",
    slug: "asus-pn64-mini-pc-i5",
    name: "ASUS ExpertCenter PN64 Core i5-12500H 16GB 512GB Mini PC",
    brand: "ASUS",
    category: "kisisel-mini-pc",
    price: 19900,
    oldPrice: 21400,
    rating: 4.4,
    reviewCount: 27,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=ASUS%20ExpertCenter%20PN64%20compact%20mini%20pc%2C%20small%20rounded%20dark%20grey%20body%20with%20a%20brushed%20lid%2C%20multiple%20rear%20ports%20including%20hdmi%20and%20ethernet%2C%20subtle%20ASUS%20logo%20on%20the%20top%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20compact%20technology%20product%20photography&width=800&height=800&seq=c510-asus-pn64&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Sessiz çalışan PN64, dijital tabela ve toplantı odası bilgisayarı olarak 4K ekran çıkışı sunar.",
    specs: [
      { label: "İşlemci", value: "Intel Core i5-12500H" },
      { label: "Bellek / Disk", value: "16 GB DDR4 / 512 GB NVMe" },
      { label: "Video", value: "2× HDMI, 1× DP" },
      { label: "Ağ", value: "2.5 GbE + Wi-Fi 6E" },
    ],
  },

  // İşlemci
  {
    id: "c511",
    slug: "intel-core-i7-14700k-islemci",
    name: "Intel Core i7-14700K 20 Çekirdek 33MB LGA1700 İşlemci",
    brand: "Intel",
    category: "bilesen-islemci",
    price: 13900,
    oldPrice: 14900,
    rating: 4.8,
    reviewCount: 176,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Intel%20Core%20i7-14700K%20desktop%20processor%2C%20square%20LGA1700%20chip%20with%20a%20polished%20silver%20heat%20spreader%2C%20green%20pcb%20edges%20and%20gold%20contact%20pads%20visible%2C%20photographed%20from%20above%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20premium%20macro%20technology%20photography&width=800&height=800&seq=c511-i7-14700k&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "20 çekirdekli i7-14700K, içerik üretimi ve çoklu görev yüklerinde yüksek frekans avantajı sunar.",
    specs: [
      { label: "Çekirdek / İş Parçacığı", value: "20C / 28T" },
      { label: "Soket", value: "LGA1700" },
      { label: "Turbo Hız", value: "5.6 GHz" },
      { label: "TDP", value: "125 W" },
    ],
  },
  {
    id: "c512",
    slug: "amd-ryzen-9-7900x-islemci",
    name: "AMD Ryzen 9 7900X 12 Çekirdek 64MB AM5 İşlemci",
    brand: "AMD",
    category: "bilesen-islemci",
    price: 15900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 132,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=AMD%20Ryzen%209%207900X%20AM5%20desktop%20processor%2C%20rectangular%20chip%20with%20a%20silver%20heat%20spreader%20and%20orange%20pcb%20corners%2C%20gold%20pin%20pads%20underneath%2C%20photographed%20from%20above%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20cool%20blue%20rim%20light%2C%20premium%20macro%20hardware%20product%20photography&width=800&height=800&seq=c512-ryzen-9-7900x&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "AM5 platformunun 12 çekirdekli modeli, sanal makine ve derleme işlerinde yüksek paralel performans verir.",
    specs: [
      { label: "Çekirdek / İş Parçacığı", value: "12C / 24T" },
      { label: "Soket", value: "AM5" },
      { label: "Boost Hız", value: "5.6 GHz" },
      { label: "TDP", value: "170 W" },
    ],
  },

  // Anakart
  {
    id: "c513",
    slug: "gigabyte-b760m-ds3h-ddr4",
    name: "Gigabyte B760M DS3H DDR4 LGA1700 Micro-ATX Anakart",
    brand: "Gigabyte",
    category: "bilesen-anakart",
    price: 3390,
    oldPrice: 3590,
    rating: 4.4,
    reviewCount: 88,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Gigabyte%20B760M%20DS3H%20DDR4%20micro%20ATX%20motherboard%20laid%20flat%20viewed%20from%20above%2C%20black%20pcb%20with%20silver%20aluminium%20heatsinks%2C%20LGA1700%20socket%2C%20four%20DDR4%20dimm%20slots%2C%20two%20m.2%20slots%2C%20rear%20io%20panel%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20even%20lighting%2C%20technical%20computer%20hardware%20photography&width=800&height=800&seq=c513-b760m-ds3h&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Ekonomik kurumsal toplamalar için ideal olan DS3H, çift M.2 yuvası ve 2.5 GbE ağ kartıyla gelir.",
    specs: [
      { label: "Chipset / Soket", value: "B760 / LGA1700" },
      { label: "Bellek", value: "4× DDR4 (128 GB'a kadar)" },
      { label: "M.2", value: "2× Gen4" },
      { label: "Form Faktör", value: "Micro-ATX" },
    ],
  },
  {
    id: "c514",
    slug: "asus-tuf-gaming-b650-plus-wifi",
    name: "ASUS TUF Gaming B650-PLUS WIFI AM5 ATX Anakart",
    brand: "ASUS",
    category: "bilesen-anakart",
    price: 6990,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 64,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=ASUS%20TUF%20Gaming%20B650-PLUS%20WIFI%20full%20ATX%20motherboard%20laid%20flat%2C%20black%20pcb%20covered%20with%20rugged%20dark%20grey%20armour%20panels%20and%20heatsinks%2C%20AM5%20socket%2C%20four%20DDR5%20dimm%20slots%2C%20three%20m.2%20slots%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20professional%20pc%20building%20hardware%20photography&width=800&height=800&seq=c514-tuf-b650&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "TUF serisi dayanıklılık bileşenleri ve Wi-Fi 6 desteğiyle B650-PLUS, uzun ömürlü AM5 sistemler için tercih edilir.",
    specs: [
      { label: "Chipset / Soket", value: "B650 / AM5" },
      { label: "Bellek", value: "4× DDR5 (192 GB'a kadar)" },
      { label: "M.2", value: "3× Gen4" },
      { label: "Ağ", value: "2.5 GbE + Wi-Fi 6" },
    ],
  },

  // Bellek
  {
    id: "c515",
    slug: "kingston-kvr32-16gb-ddr4-3200",
    name: "Kingston ValueRAM 16GB DDR4 3200MHz CL22 Bellek",
    brand: "Kingston",
    category: "bilesen-bellek",
    price: 1190,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 205,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Kingston%20ValueRAM%2016GB%20DDR4%20memory%20module%2C%20plain%20green%20pcb%20without%20heat%20spreader%2C%20black%20memory%20chips%20visible%20on%20both%20sides%2C%20standing%20upright%20at%20a%20slight%20angle%20with%20gold%20contacts%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20simple%20and%20precise%20ram%20product%20photography&width=800&height=800&seq=c515-kvr32-16gb&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Ofis sistemlerinde bellek yükseltmesi için standart uyumluluk sunan ValueRAM, filo yenilemede ekonomik seçenektir.",
    specs: [
      { label: "Kapasite", value: "16 GB (1× 16 GB)" },
      { label: "Hız / Gecikme", value: "3200 MHz / CL22" },
      { label: "Tip", value: "DDR4 UDIMM" },
      { label: "Garanti", value: "Ömür boyu" },
    ],
  },
  {
    id: "c516",
    slug: "samsung-16gb-ddr5-4800-ecc",
    name: "Samsung 16GB DDR5 4800MHz ECC UDIMM Sunucu Belleği",
    brand: "Samsung",
    category: "bilesen-bellek",
    price: 3290,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 43,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Samsung%2016GB%20DDR5%20ECC%20UDIMM%20server%20memory%20module%2C%20black%20pcb%20without%20heat%20spreader%2C%20white%20Samsung%20label%20and%20visible%20memory%20chips%2C%20standing%20upright%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20cool%20lighting%2C%20enterprise%20hardware%20product%20photography&width=800&height=800&seq=c516-samsung-ddr5-ecc&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "ECC hata düzeltmeli DDR5 modül, sunucu ve iş istasyonlarında veri bütünlüğünü korur.",
    specs: [
      { label: "Kapasite", value: "16 GB" },
      { label: "Hız", value: "4800 MHz ECC" },
      { label: "Tip", value: "DDR5 UDIMM" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // Disk
  {
    id: "c517",
    slug: "wd-black-sn850x-2tb-ssd",
    name: "WD Black SN850X 2TB NVMe PCIe 4.0 M.2 SSD",
    brand: "WD",
    category: "bilesen-disk",
    price: 6290,
    oldPrice: 6790,
    rating: 4.9,
    reviewCount: 194,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=WD%20Black%20SN850X%202TB%20NVMe%20m.2%20ssd%2C%20black%20label%20with%20white%20WD_BLACK%20lettering%20lying%20diagonally%2C%20gold%20m.2%20connector%20pins%20visible%20at%20one%20end%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20cool%20lighting%2C%20premium%20storage%20hardware%20macro%20product%20photography&width=800&height=800&seq=c517-sn850x-2tb&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "7300 MB/s okuma hızı sunan SN850X, büyük proje dosyaları ve video kurgu iş akışlarında bekleme süresini kısaltır.",
    specs: [
      { label: "Kapasite", value: "2 TB" },
      { label: "Arayüz", value: "PCIe 4.0 x4 NVMe" },
      { label: "Okuma / Yazma", value: "7300 / 6600 MB/s" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },
  {
    id: "c518",
    slug: "crucial-mx500-1tb-sata-ssd",
    name: "Crucial MX500 1TB 2.5\" SATA 3D NAND SSD",
    brand: "Crucial",
    category: "bilesen-disk",
    price: 2390,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 246,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Crucial%20MX500%201TB%20two%20and%20a%20half%20inch%20SATA%20ssd%2C%20silver%20grey%20metal%20body%20with%20a%20blue%20and%20white%20label%2C%20sata%20data%20and%20power%20connectors%20visible%20on%20the%20edge%2C%20lying%20at%20a%20slight%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20straightforward%20storage%20hardware%20product%20photography&width=800&height=800&seq=c518-mx500-1tb&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "MX500, eski masaüstü ve dizüstüleri düşük maliyetle hızlandırmak için güvenilir bir SATA seçeneğidir.",
    specs: [
      { label: "Kapasite", value: "1 TB" },
      { label: "Arayüz", value: "SATA 6 Gb/s" },
      { label: "Okuma / Yazma", value: "560 / 510 MB/s" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },

  // Ekran kartı
  {
    id: "c519",
    slug: "msi-rtx-4070-ventus-3x-12gb",
    name: "MSI GeForce RTX 4070 Ventus 3X 12GB GDDR6X Ekran Kartı",
    brand: "MSI",
    category: "bilesen-ekran-karti",
    price: 27900,
    oldPrice: 29900,
    rating: 4.7,
    reviewCount: 87,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=MSI%20GeForce%20RTX%204070%20Ventus%203X%20graphics%20card%2C%20long%20triple%20fan%20black%20shroud%2C%20dark%20metal%20backplate%2C%208%20pin%20power%20connector%20on%20the%20top%20edge%2C%20shown%20at%20a%20three%20quarter%20angle%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20high%20end%20gpu%20product%20photography&width=800&height=800&seq=c519-rtx-4070-ventus&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Üç fanlı Ventus soğutması, render ve yapay zekâ çıkarım işlerinde düşük sıcaklıkta yüksek performans sağlar.",
    specs: [
      { label: "Bellek", value: "12 GB GDDR6X" },
      { label: "Veri Yolu", value: "PCIe 4.0, 192-bit" },
      { label: "Çıkışlar", value: "3× DP 1.4a, 1× HDMI 2.1" },
      { label: "Güç", value: "8-pin, 200 W" },
    ],
  },
  {
    id: "c520",
    slug: "nvidia-t400-4gb-profesyonel",
    name: "PNY NVIDIA T400 4GB GDDR6 Profesyonel Ekran Kartı",
    brand: "PNY",
    category: "bilesen-ekran-karti",
    price: 8990,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 58,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=NVIDIA%20T400%204GB%20professional%20graphics%20card%2C%20very%20compact%20low%20profile%20body%20with%20a%20single%20small%20fan%20and%20black%20shroud%2C%20three%20mini%20displayport%20outputs%20on%20the%20bracket%2C%20no%20external%20power%20connector%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20lighting%2C%20precise%20workstation%20hardware%20product%20photography&width=800&height=800&seq=c520-nvidia-t400&orientation=squarish&nocache=true",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Düşük profil T400, dört ekran çıkışı ve düşük güç tüketimiyle ofis ve CAD istasyonlarında idealdir.",
    specs: [
      { label: "Bellek", value: "4 GB GDDR6" },
      { label: "Form", value: "Düşük profil, tek yuva" },
      { label: "Çıkışlar", value: "3× mini DP 1.4" },
      { label: "Güç", value: "30 W, harici güç gerekmez" },
    ],
  },

  // Kasa & güç
  {
    id: "c521",
    slug: "cooler-master-n300-kasa",
    name: "Cooler Master N300 Mid-Tower ATX Bilgisayar Kasası",
    brand: "Cooler Master",
    category: "bilesen-kasa-guc",
    price: 1490,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 112,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=Cooler%20Master%20N300%20mid%20tower%20atx%20computer%20case%2C%20matte%20black%20steel%20chassis%20with%20a%20mesh%20front%20panel%20and%20top%20front%20USB%20ports%2C%20plain%20side%20panel%2C%20standing%20on%20a%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20budget%20pc%20chassis%20product%20photography&width=800&height=800&seq=c521-cm-n300&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "N300, ön panelinde USB 3.0 portları ve geniş iç hacmiyle ekonomik kurumsal toplamalara uygundur.",
    specs: [
      { label: "Form Faktör", value: "Mid-Tower ATX" },
      { label: "Anakart Desteği", value: "ATX / mATX / ITX" },
      { label: "Fan", value: "1× 120 mm dahil" },
      { label: "Sürücü Yuvası", value: "2× 3.5\", 2× 2.5\"" },
    ],
  },
  {
    id: "c522",
    slug: "be-quiet-system-power-10-650w",
    name: "be quiet! System Power 10 650W 80+ Bronze Güç Kaynağı",
    brand: "be quiet!",
    category: "bilesen-kasa-guc",
    price: 2190,
    oldPrice: 2390,
    rating: 4.6,
    reviewCount: 94,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=be%20quiet%20System%20Power%2010%20650W%20power%20supply%20unit%2C%20black%20rectangular%20atx%20body%20with%20a%20large%20120mm%20silent%20fan%20grille%20and%20black%20fan%20blades%2C%20be%20quiet%20label%20on%20the%20side%2C%20clean%20light%20gray%20seamless%20studio%20background%2C%20soft%20studio%20lighting%2C%20clean%20pc%20hardware%20product%20photography&width=800&height=800&seq=c522-system-power-10&orientation=squarish&nocache=true",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Sessiz fan yapısı ve 80+ Bronze verimliliğiyle System Power 10, ofis sistemlerinde gürültüyü azaltır.",
    specs: [
      { label: "Güç", value: "650 W" },
      { label: "Sertifika", value: "80+ Bronze" },
      { label: "Fan", value: "120 mm sessiz fan" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },
];