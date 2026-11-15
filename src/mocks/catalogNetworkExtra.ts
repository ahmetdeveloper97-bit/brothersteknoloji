import type { Product } from "@/types/store";

/** Yazılım ve network ürünleri için ek katalog */
export const catalogNetworkExtra: Product[] = [
  // İşletim sistemi
  {
    id: "c543",
    slug: "microsoft-windows-11-pro-lisans",
    name: "Microsoft Windows 11 Pro 64-bit OEM Lisans",
    brand: "Microsoft",
    category: "yazilim-isletim",
    price: 4890,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 312,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=software%20license%20retail%20box%20with%20blue%20accent%20placed%20on%20a%20clean%20white%20studio%20surface%2C%20simple%20and%20elegant%20product%20photography%20of%20pc%20software%20packaging%20with%20soft%20shadow%20and%20clean%20composition&width=800&height=800&seq=c543-win11-pro&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Windows 11 Pro, BitLocker ve uzak masaüstü desteğiyle kurumsal cihazların güvenli yönetimini sağlar.",
    specs: [
      { label: "Sürüm", value: "Windows 11 Pro 64-bit" },
      { label: "Lisans Tipi", value: "OEM" },
      { label: "Dil", value: "Türkçe / İngilizce" },
      { label: "Aktivasyon", value: "Tek cihaz" },
    ],
  },
  {
    id: "c544",
    slug: "windows-server-2022-standard-16-core",
    name: "Microsoft Windows Server 2022 Standard 16 Çekirdek Lisans",
    brand: "Microsoft",
    category: "yazilim-isletim",
    price: 32900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 47,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=server%20software%20license%20package%20with%20dark%20blue%20design%20standing%20on%20a%20neutral%20gray%20studio%20background%2C%20professional%20enterprise%20software%20product%20photography%20with%20clean%20lighting%20and%20sharp%20typography&width=800&height=800&seq=c544-server-2022&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Windows Server 2022 Standard, sanallaştırma hakları ve güvenli çekirdek yapısıyla veri merkezi iş yüklerini taşır.",
    specs: [
      { label: "Sürüm", value: "Server 2022 Standard" },
      { label: "Çekirdek", value: "16 çekirdek" },
      { label: "Lisans Tipi", value: "OEM / VL" },
      { label: "Kalıcılık", value: "Süresiz" },
    ],
  },

  // Ofis
  {
    id: "c545",
    slug: "microsoft-365-business-standard-yillik",
    name: "Microsoft 365 Business Standard Yıllık Lisans (1 Kullanıcı)",
    brand: "Microsoft",
    category: "yazilim-ofis",
    price: 4290,
    oldPrice: 4690,
    rating: 4.7,
    reviewCount: 268,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=cloud%20office%20software%20subscription%20card%20with%20colorful%20accent%20on%20a%20white%20studio%20background%2C%20modern%20digital%20product%20photography%20with%20soft%20gradient%20and%20minimal%20styling%2C%20crisp%20detail&width=800&height=800&seq=c545-m365-business&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%8", tone: "discount" },
    ],
    description:
      "Teams, Exchange ve Office uygulamalarını tek abonelikte birleştiren paket, hibrit çalışma düzenine uygundur.",
    specs: [
      { label: "Kapsam", value: "Office + Teams + Exchange" },
      { label: "Cihaz", value: "5 cihaz / kullanıcı" },
      { label: "Süre", value: "12 ay" },
      { label: "Depolama", value: "1 TB OneDrive" },
    ],
  },
  {
    id: "c546",
    slug: "adobe-acrobat-pro-yillik",
    name: "Adobe Acrobat Pro Yıllık Abonelik (1 Kullanıcı)",
    brand: "Adobe",
    category: "yazilim-ofis",
    price: 6490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 92,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=digital%20document%20software%20subscription%20box%20with%20red%20accent%20standing%20on%20a%20clean%20light%20studio%20surface%2C%20elegant%20software%20product%20photography%20with%20soft%20shadow%20and%20minimal%20clean%20background&width=800&height=800&seq=c546-acrobat-pro&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Acrobat Pro, e-imza ve belge düzenleme araçlarıyla sözleşme süreçlerini dijitalleştirir.",
    specs: [
      { label: "Kapsam", value: "PDF düzenleme + e-imza" },
      { label: "Cihaz", value: "2 cihaz" },
      { label: "Süre", value: "12 ay" },
      { label: "Bulut", value: "Adobe Document Cloud" },
    ],
  },

  // Güvenlik
  {
    id: "c547",
    slug: "kaspersky-endpoint-security-10",
    name: "Kaspersky Endpoint Security 10 Kullanıcı 1 Yıl",
    brand: "Kaspersky",
    category: "yazilim-guvenlik",
    price: 8990,
    oldPrice: 9690,
    rating: 4.6,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=cyber%20security%20software%20license%20box%20with%20green%20geometric%20design%20on%20a%20dark%20gray%20background%2C%20professional%20antivirus%20product%20photography%20with%20modern%20lighting%20and%20sharp%20edges&width=800&height=800&seq=c547-kaspersky-eps&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Uç nokta koruma, disk şifreleme ve merkezi yönetim konsolu tek lisansta toplanır.",
    specs: [
      { label: "Kullanıcı", value: "10 kullanıcı" },
      { label: "Süre", value: "1 yıl" },
      { label: "Kapsam", value: "Uç nokta + dosya sunucusu" },
      { label: "Yönetim", value: "Bulut konsol" },
    ],
  },
  {
    id: "c548",
    slug: "eset-protect-entry-15",
    name: "ESET PROTECT Entry 15 Kullanıcı 1 Yıl",
    brand: "ESET",
    category: "yazilim-guvenlik",
    price: 7490,
    oldPrice: null,
    rating: 4.5,
    reviewCount: 61,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=antivirus%20software%20product%20box%20with%20blue%20and%20yellow%20logo%20accent%20on%20a%20clean%20white%20studio%20surface%2C%20corporate%20security%20software%20photography%20with%20subtle%20reflection%20and%20minimal%20styling&width=800&height=800&seq=c548-eset-protect&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "ESET PROTECT Entry, hafif istemcisi ve merkezi paneliyle küçük ekiplerin güvenliğini yönetir.",
    specs: [
      { label: "Kullanıcı", value: "15 kullanıcı" },
      { label: "Süre", value: "1 yıl" },
      { label: "Kapsam", value: "Antivirüs + e-posta koruma" },
      { label: "Yönetim", value: "ESET PROTECT Cloud" },
    ],
  },

  // Yedekleme
  {
    id: "c549",
    slug: "veeam-backup-essentials-5vm",
    name: "Veeam Backup Essentials 5 VM Yıllık Lisans",
    brand: "Veeam",
    category: "yazilim-yedekleme",
    price: 18900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 38,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=backup%20software%20license%20package%20with%20green%20accent%20on%20a%20light%20gray%20studio%20background%2C%20enterprise%20software%20product%20photography%20with%20clean%20lighting%20and%20professional%20minimal%20composition&width=800&height=800&seq=c549-veeam-essentials&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "Veeam Backup Essentials, sanal makineler için hızlı geri dönüş ve doğrulama testleri sağlar.",
    specs: [
      { label: "Kapasite", value: "5 VM" },
      { label: "Süre", value: "12 ay" },
      { label: "Kapsam", value: "VMware / Hyper-V" },
      { label: "Destek", value: "7/24 teknik destek" },
    ],
  },
  {
    id: "c550",
    slug: "acronis-cyber-protect-10",
    name: "Acronis Cyber Protect 10 Cihaz 1 Yıl",
    brand: "Acronis",
    category: "yazilim-yedekleme",
    price: 12900,
    oldPrice: 13900,
    rating: 4.5,
    reviewCount: 44,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=data%20protection%20software%20license%20box%20with%20orange%20accent%20placed%20on%20a%20clean%20neutral%20surface%2C%20modern%20backup%20software%20product%20photography%20with%20soft%20lighting%20and%20fine%20detail&width=800&height=800&seq=c550-acronis-cyber&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Yedekleme ve siber korumayı tek panelde birleştiren Acronis, hibrit filoları tek noktadan yönetir.",
    specs: [
      { label: "Cihaz", value: "10 cihaz" },
      { label: "Süre", value: "1 yıl" },
      { label: "Kapsam", value: "Yedek + antivirüs + MDM" },
      { label: "Depolama", value: "500 GB bulut" },
    ],
  },

  // Wi-Fi
  {
    id: "c551",
    slug: "tp-link-archer-ax55-router",
    name: "TP-Link Archer AX55 AX3000 Wi-Fi 6 Router",
    brand: "TP-Link",
    category: "ag-wifi",
    price: 2890,
    oldPrice: 3190,
    rating: 4.6,
    reviewCount: 214,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20wifi%206%20router%20with%20four%20external%20antennas%20on%20a%20light%20gray%20studio%20surface%2C%20networking%20hardware%20product%20photography%20with%20soft%20shadow%20and%20sharp%20antenna%20detail&width=800&height=800&seq=c551-archer-ax55&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "%9", tone: "discount" },
    ],
    description:
      "AX3000 hızı ve OFDMA desteğiyle Archer AX55, kalabalık ofislerde gecikmeyi azaltır.",
    specs: [
      { label: "Hız", value: "AX3000 (2402 + 574 Mbps)" },
      { label: "Port", value: "4× Gigabit LAN, 1× WAN" },
      { label: "Özellik", value: "OFDMA, WPA3" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },
  {
    id: "c552",
    slug: "mikrotik-hap-ax3-router",
    name: "MikroTik hAP ax3 Wi-Fi 6 Router",
    brand: "MikroTik",
    category: "ag-wifi",
    price: 4290,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 96,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20wifi%206%20router%20with%20four%20antennas%20and%20front%20led%20indicators%20on%20a%20clean%20light%20background%2C%20professional%20network%20device%20product%20photography%20with%20even%20lighting%20and%20crisp%20detail&width=800&height=800&seq=c552-hap-ax3&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "RouterOS ile gelişmiş yönlendirme ve VLAN desteği sunan hAP ax3, teknik ekipler için esneklik sağlar.",
    specs: [
      { label: "Kablosuz", value: "Wi-Fi 6, 2×2 MIMO" },
      { label: "Port", value: "5× Gigabit, 1× 2.5G" },
      { label: "Yazılım", value: "RouterOS L4" },
      { label: "PoE", value: "Giriş PoE desteği" },
    ],
  },

  // Access point
  {
    id: "c553",
    slug: "ubiquiti-u6-pro-access-point",
    name: "Ubiquiti UniFi U6 Pro Wi-Fi 6 Access Point",
    brand: "Ubiquiti",
    category: "ag-access-point",
    price: 5890,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 158,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20circular%20ceiling%20access%20point%20with%20subtle%20led%20ring%20shown%20from%20above%20on%20a%20clean%20light%20gray%20background%2C%20modern%20networking%20hardware%20photography%20with%20soft%20shadow%20and%20minimal%20styling&width=800&height=800&seq=c553-u6-pro&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Çok Satan", tone: "primary" },
    ],
    description:
      "U6 Pro, 300'den fazla eşzamanlı istemciyi kararlı biçimde taşıyan tavan tipi Wi-Fi 6 erişim noktasıdır.",
    specs: [
      { label: "Kablosuz", value: "Wi-Fi 6, 4×4 MIMO" },
      { label: "Hız", value: "4.8 Gbps toplam" },
      { label: "Güç", value: "PoE+ (802.3at)" },
      { label: "Kapsama", value: "140 m²'ye kadar" },
    ],
  },
  {
    id: "c554",
    slug: "tp-link-eap670-access-point",
    name: "TP-Link Omada EAP670 AX5400 Access Point",
    brand: "TP-Link",
    category: "ag-access-point",
    price: 4490,
    oldPrice: 4790,
    rating: 4.6,
    reviewCount: 83,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20flat%20ceiling%20wifi%20access%20point%20with%20subtle%20branding%20viewed%20from%20a%20slight%20angle%20on%20a%20light%20neutral%20surface%2C%20networking%20product%20photography%20with%20soft%20lighting%20and%20clean%20composition&width=800&height=800&seq=c554-eap670&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "EAP670, Omada merkezi yönetimiyle çok şubeli kurulumlarda tek panelden yapılandırılır.",
    specs: [
      { label: "Kablosuz", value: "Wi-Fi 6, AX5400" },
      { label: "Port", value: "1× 2.5G PoE" },
      { label: "Yönetim", value: "Omada Controller" },
      { label: "Garanti", value: "3 yıl" },
    ],
  },

  // Switch
  {
    id: "c555",
    slug: "tp-link-tl-sg3428mp-switch",
    name: "TP-Link TL-SG3428MP 28 Port Gigabit PoE+ Switch",
    brand: "TP-Link",
    category: "ag-switch",
    price: 12900,
    oldPrice: null,
    rating: 4.6,
    reviewCount: 67,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=black%20rack%20mountable%20poe%20network%20switch%20with%20many%20ethernet%20ports%20on%20a%20light%20gray%20studio%20surface%2C%20enterprise%20networking%20hardware%20photography%20with%20sharp%20port%20detail%20and%20even%20lighting&width=800&height=800&seq=c555-sg3428mp&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "24 PoE+ portu ve 384 W bütçesiyle SG3428MP, kamera ve access point beslemesini tek cihazda toplar.",
    specs: [
      { label: "Port", value: "24× PoE+ + 4× SFP" },
      { label: "PoE Bütçesi", value: "384 W" },
      { label: "Yönetim", value: "L2+, Omada uyumlu" },
      { label: "Garanti", value: "5 yıl" },
    ],
  },
  {
    id: "c556",
    slug: "ubiquiti-usw-24-poe-switch",
    name: "Ubiquiti UniFi USW-24-PoE 24 Port Switch",
    brand: "Ubiquiti",
    category: "ag-switch",
    price: 15900,
    oldPrice: null,
    rating: 4.7,
    reviewCount: 52,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=silver%20fanless%20poe%20switch%20with%20front%20ports%20and%20small%20touch%20display%20on%20a%20light%20neutral%20background%2C%20premium%20networking%20equipment%20photography%20with%20soft%20reflections%20and%20precise%20detail&width=800&height=800&seq=c556-usw-24-poe&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "USW-24-PoE, fansız gövdesi ve UniFi paneliyle sessiz çalışan kurumsal ağ kabinlerine uygundur.",
    specs: [
      { label: "Port", value: "16× PoE + 8× Gigabit + 2× SFP" },
      { label: "PoE Bütçesi", value: "95 W" },
      { label: "Soğutma", value: "Fansız" },
      { label: "Yönetim", value: "UniFi Network" },
    ],
  },

  // Firewall
  {
    id: "c557",
    slug: "fortinet-fortigate-60f-firewall",
    name: "Fortinet FortiGate 60F Kurumsal Güvenlik Duvarı",
    brand: "Fortinet",
    category: "ag-firewall",
    price: 22900,
    oldPrice: null,
    rating: 4.8,
    reviewCount: 74,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=white%20desktop%20firewall%20appliance%20with%20red%20accent%20logo%20and%20several%20network%20ports%20on%20a%20clean%20light%20studio%20background%2C%20enterprise%20security%20hardware%20photography%20with%20sharp%20detail&width=800&height=800&seq=c557-fortigate-60f&orientation=squarish",
    tags: [
      { label: "Distribütör", tone: "primary" },
      { label: "Kurumsal", tone: "info" },
    ],
    description:
      "FortiGate 60F, SD-WAN ve IPS özellikleriyle şube ofislerinde güvenli internet çıkışı sağlar.",
    specs: [
      { label: "Firewall Throughput", value: "10 Gbps" },
      { label: "Port", value: "10× GE RJ45" },
      { label: "Özellik", value: "IPS, SD-WAN, SSL VPN" },
      { label: "Kullanıcı", value: "Orta ölçek şube" },
    ],
  },
  {
    id: "c558",
    slug: "ubiquiti-udm-pro-gateway",
    name: "Ubiquiti UniFi Dream Machine Pro Ağ Geçidi",
    brand: "Ubiquiti",
    category: "ag-firewall",
    price: 27900,
    oldPrice: 29400,
    rating: 4.7,
    reviewCount: 61,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=rack%20mount%20network%20gateway%20appliance%20with%20small%20lcd%20display%20on%20the%20front%20panel%20on%20a%20light%20gray%20background%2C%20premium%20enterprise%20networking%20hardware%20photography%20with%20fine%20detail&width=800&height=800&seq=c558-udm-pro&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "UDM Pro; güvenlik duvarı, UniFi kontrolcü ve NVR işlevlerini tek rack cihazında birleştirir.",
    specs: [
      { label: "Port", value: "8× GbE, 2× 10G SFP+" },
      { label: "Disk", value: "3.5\" yuva (NVR için)" },
      { label: "Yönetim", value: "UniFi OS" },
      { label: "Kapsam", value: "Firewall + Controller + NVR" },
    ],
  },

  // Ağ adaptörü
  {
    id: "c559",
    slug: "tp-link-archer-tx50e-pcie",
    name: "TP-Link Archer TX50E Wi-Fi 6 PCIe Ağ Adaptörü",
    brand: "TP-Link",
    category: "ag-adaptor",
    price: 1290,
    oldPrice: 1390,
    rating: 4.5,
    reviewCount: 143,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=pcie%20wifi%20card%20with%20two%20antennas%20and%20black%20heatsink%20on%20a%20light%20gray%20studio%20surface%2C%20computer%20expansion%20card%20product%20photography%20with%20sharp%20detail%20and%20clean%20minimal%20styling&width=800&height=800&seq=c559-tx50e&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "TX50E, masaüstü bilgisayarlara Wi-Fi 6 ve Bluetooth 5.2 desteği kazandırarak kablo ihtiyacını azaltır.",
    specs: [
      { label: "Arayüz", value: "PCIe x1" },
      { label: "Hız", value: "2402 Mbps" },
      { label: "Bluetooth", value: "5.2" },
      { label: "Anten", value: "2× harici" },
    ],
  },
  {
    id: "c560",
    slug: "ugreen-usb-wifi-6-adaptor",
    name: "Ugreen USB Wi-Fi 6 AX1800 Kablosuz Ağ Adaptörü",
    brand: "Ugreen",
    category: "ag-adaptor",
    price: 690,
    oldPrice: null,
    rating: 4.3,
    reviewCount: 198,
    inStock: true,
    image:
      "https://readdy.ai/api/search-image?query=small%20black%20usb%20wifi%20adapter%20with%20short%20antenna%20on%20a%20clean%20white%20studio%20surface%2C%20compact%20tech%20accessory%20product%20photography%20with%20soft%20shadow%20and%20crisp%20edges&width=800&height=800&seq=c560-ugreen-wifi6&orientation=squarish",
    tags: [{ label: "Distribütör", tone: "primary" }],
    description:
      "Tak-çalıştır USB adaptör, ağ kartı olmayan dizüstülerde hızlı Wi-Fi 6 bağlantısı sağlar.",
    specs: [
      { label: "Arayüz", value: "USB 3.0" },
      { label: "Hız", value: "AX1800" },
      { label: "Uyumluluk", value: "Windows / Linux" },
      { label: "Garanti", value: "2 yıl" },
    ],
  },
];