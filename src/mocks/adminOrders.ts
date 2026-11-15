import type { AdminOrder } from "@/types/store";

export const adminOrders: AdminOrder[] = [
  {
    id: "#TR-10482",
    customer: "Zeynep Kaya",
    email: "zeynep.kaya@mail.com",
    phone: "0532 482 19 20",
    date: "26.10.2026",
    status: "Teslim Edildi",
    payment: "Kredi Kartı · 3D Secure",
    address: "Caferağa Mah. Moda Cad. No:42 D:7",
    city: "İstanbul / Kadıköy",
    cargo: "Yurtiçi Kargo",
    tracking: "YK-8842910374",
    note: "Kapıcıya bırakılabilir.",
    lines: [
      {
        name: "Samsung Galaxy Z Fold7 16 GB RAM / 1 TB Akıllı Telefon (Gölge Mavisi)",
        brand: "Samsung",
        image:
          "https://readdy.ai/api/search-image?query=blue%20foldable%20smartphone%20open%20showing%20large%20inner%20display%20on%20clean%20white%20studio%20background%2C%20premium%20e-commerce%20product%20photo&width=800&height=800&seq=store-prod-fold7&orientation=squarish",
        quantity: 1,
        price: 132999,
      },
    ],
  },
  {
    id: "#TR-10481",
    customer: "Mert Aydın",
    email: "mert.aydin@mail.com",
    phone: "0545 117 63 08",
    date: "26.10.2026",
    status: "Kargoda",
    payment: "Kapıda Ödeme",
    address: "Kültür Mah. 1382 Sok. No:11 D:3",
    city: "İzmir / Konak",
    cargo: "Aras Kargo",
    tracking: "AR-5520819446",
    note: "Teslimattan önce aranmak istiyor.",
    lines: [
      {
        name: "Apple HomePod (2. Nesil) Akıllı Hoparlör - Uzay Grisi",
        brand: "Apple",
        image:
          "https://readdy.ai/api/search-image?query=space%20gray%20fabric%20cylindrical%20smart%20speaker%20on%20clean%20white%20studio%20background%2C%20premium%20e-commerce%20product%20photography&width=800&height=800&seq=store-prod-homepod&orientation=squarish",
        quantity: 1,
        price: 20315.94,
      },
      {
        name: "Apple HomePod Mini Akıllı Hoparlör - Beyaz",
        brand: "Apple",
        image:
          "https://readdy.ai/api/search-image?query=small%20white%20spherical%20smart%20speaker%20on%20clean%20white%20studio%20background%2C%20premium%20e-commerce%20product%20photography&width=800&height=800&seq=store-prod-homepod-mini&orientation=squarish",
        quantity: 1,
        price: 6140.94,
      },
    ],
  },
  {
    id: "#TR-10480",
    customer: "Elif Demir",
    email: "elif.demir@mail.com",
    phone: "0507 908 44 12",
    date: "25.10.2026",
    status: "Hazırlanıyor",
    payment: "Havale / EFT",
    address: "Bahçelievler Mah. 7. Cad. No:88 D:12",
    city: "Ankara / Çankaya",
    cargo: "MNG Kargo",
    tracking: "—",
    note: "Fatura kurumsal olarak kesilecek.",
    lines: [
      {
        name: "iPhone 14 128GB Akıllı Telefon Mavi",
        brand: "Apple",
        image:
          "https://readdy.ai/api/search-image?query=blue%20smartphone%20back%20view%20with%20dual%20camera%20on%20clean%20white%20studio%20background%2C%20premium%20e-commerce%20product%20photo&width=800&height=800&seq=store-prod-iphone14&orientation=squarish",
        quantity: 1,
        price: 43999,
      },
    ],
  },
  {
    id: "#TR-10479",
    customer: "Burak Tunç",
    email: "burak.tunc@mail.com",
    phone: "0533 221 75 61",
    date: "25.10.2026",
    status: "Kargoda",
    payment: "Kredi Kartı · Tek Çekim",
    address: "Yıldız Mah. Çiçek Sok. No:5 D:2",
    city: "Bursa / Nilüfer",
    cargo: "Sürat Kargo",
    tracking: "SR-7719235580",
    note: "",
    lines: [
      {
        name: "Philips The One 55PUS9000 55 inç 139 Ekran Ambilight 4K UHD QLED Smart TV",
        brand: "Philips",
        image:
          "https://readdy.ai/api/search-image?query=qled%20smart%20television%20with%20slim%20bezel%20and%20ambient%20backlight%20on%20clean%20white%20studio%20background%2C%20e-commerce%20product%20photo&width=800&height=800&seq=store-prod-tv-philips&orientation=squarish",
        quantity: 1,
        price: 40999,
      },
    ],
  },
  {
    id: "#TR-10478",
    customer: "Selin Yalçın",
    email: "selin.yalcin@mail.com",
    phone: "0555 630 82 47",
    date: "24.10.2026",
    status: "İptal",
    payment: "Kredi Kartı · 6 Taksit",
    address: "Alsancak Mah. Kıbrıs Şehitleri Cad. No:120 D:9",
    city: "İzmir / Konak",
    cargo: "—",
    tracking: "—",
    note: "Müşteri talebiyle iptal edildi, tutar iade edildi.",
    lines: [
      {
        name: "Apple MacBook Air 13 inç M3 8GB 256GB Gece Yarısı",
        brand: "Apple",
        image:
          "https://readdy.ai/api/search-image?query=thin%20dark%20blue%20ultrabook%20laptop%20open%20on%20clean%20white%20studio%20background%2C%20premium%20e-commerce%20product%20photography&width=800&height=800&seq=store-prod-macbook-air&orientation=squarish",
        quantity: 1,
        price: 69770.92,
      },
      {
        name: "Samsung Galaxy Z Flip7 12GB/256GB Katlanabilir Akıllı Telefon Gece Siyahı",
        brand: "Samsung",
        image:
          "https://readdy.ai/api/search-image?query=black%20foldable%20flip%20smartphone%20closed%20at%20an%20angle%20on%20clean%20white%20studio%20background%2C%20premium%20e-commerce%20product%20photo&width=800&height=800&seq=store-prod-flip7&orientation=squarish",
        quantity: 1,
        price: 134.99,
      },
    ],
  },
  {
    id: "#TR-10477",
    customer: "Kerem Öztürk",
    email: "kerem.ozturk@mail.com",
    phone: "0542 344 90 15",
    date: "24.10.2026",
    status: "Teslim Edildi",
    payment: "Kredi Kartı · 9 Taksit",
    address: "Güzelyalı Mah. Sahil Cad. No:17 D:4",
    city: "Antalya / Muratpaşa",
    cargo: "Yurtiçi Kargo",
    tracking: "YK-6612774891",
    note: "Kurulum için teknik servis yönlendirmesi yapıldı.",
    lines: [
      {
        name: "LG 55QNED80 55 İnç 140 Ekran Uydu Alıcılı 4K Ultra HD Smart QNED TV",
        brand: "LG",
        image:
          "https://readdy.ai/api/search-image?query=4k%20qned%20smart%20tv%20front%20view%20with%20colorful%20screen%20on%20clean%20white%20studio%20background%2C%20e-commerce%20product%20photo&width=800&height=800&seq=store-prod-tv-lg&orientation=squarish",
        quantity: 1,
        price: 36999,
      },
    ],
  },
];