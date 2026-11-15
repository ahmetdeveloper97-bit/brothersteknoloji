import type { FaqCategory, FaqItem } from "@/types/faq";

export const faqCategories: FaqCategory[] = [
  {
    id: "siparis",
    label: "Sipariş ve Ödeme",
    icon: "ri-shopping-bag-3-line",
    description: "Sipariş oluşturma, ödeme yöntemleri, fatura ve taksit süreçleri.",
  },
  {
    id: "kargo",
    label: "Kargo ve Teslimat",
    icon: "ri-truck-line",
    description: "Gönderim süreleri, kargo takibi, teslimat adresi ve teslim alma.",
  },
  {
    id: "iade",
    label: "İade ve Değişim",
    icon: "ri-arrow-go-back-line",
    description: "14 gün cayma hakkı, iade adımları, değişim ve geri ödeme süreleri.",
  },
  {
    id: "urun",
    label: "Ürün ve Garanti",
    icon: "ri-shield-check-line",
    description: "Garanti kapsamı, servis, teknik özellikler ve ürün karşılaştırma.",
  },
  {
    id: "hesap",
    label: "Hesap ve Güvenlik",
    icon: "ri-shield-user-line",
    description: "Üyelik, şifre, doğrulama, adres defteri ve kişisel veriler.",
  },
  {
    id: "teknik",
    label: "Teknik Destek",
    icon: "ri-tools-line",
    description: "Kurulum, montaj, uyumluluk ve arıza tespitiyle ilgili sorular.",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "faq-siparis-nasil",
    categoryId: "siparis",
    question: "Siparişim ne zaman onaylanır?",
    answer:
      "Havale/EFT dışındaki ödemelerde sipariş, ödeme onayı alındığı anda otomatik olarak onaylanır ve depo hazırlık listesine girer. Havale ile ödeme yaptıysanız açıklamaya sipariş numaranızı yazmanız yeterlidir; ödeme kontrolü hafta içi mesai saatlerinde en geç 2 saat içinde tamamlanır. Onay bilgisi hem e-posta hem de hesabınızdaki Siparişlerim ekranında görünür.",
    featured: true,
    keywords: ["onay", "sipariş", "havale", "ödeme", "durum"],
  },
  {
    id: "faq-odeme-yontemleri",
    categoryId: "siparis",
    question: "Hangi ödeme yöntemlerini kullanabilirim?",
    answer:
      "Kredi kartı (tek çekim ve 12 taksite kadar), banka kartı, havale/EFT ve kapıda ödeme seçeneklerini sunuyoruz. Kredi kartı ödemelerinde 3D Secure doğrulaması zorunludur. Havale ile ödeme yapacaksanız sipariş sonrası gösterilen IBAN bilgilerini kullanabilir veya sitemizdeki Havale / EFT Bilgileri sayfasından tüm hesaplarımızı görebilirsiniz.",
    featured: true,
    keywords: ["ödeme", "kredi kartı", "havale", "eft", "taksit", "kapıda ödeme"],
  },
  {
    id: "faq-taksit",
    categoryId: "siparis",
    question: "Taksit seçenekleri nasıl hesaplanıyor?",
    answer:
      "Taksit seçenekleri, ödeme adımında kartınızın bankasına göre otomatik listelenir. 6 taksite kadar vade farkı uygulanmaz; 9 ve 12 taksitlerde banka vade farkı bulunabilir. Fark tutarı ödeme ekranında toplam bedele eklenmiş olarak gösterilir, sonradan ek bir kesinti yapılmaz. Kampanya dönemlerinde vade farkı taksit sayısı artırılarak da sunulabilir.",
    featured: false,
    keywords: ["taksit", "vade", "banka", "kart"],
  },
  {
    id: "faq-fatura",
    categoryId: "siparis",
    question: "Faturamı nereden indirebilirim?",
    answer:
      "Sipariş kargoya hazırlandığında e-Arşiv faturanız hesabınıza yüklenir. Hesabım menüsündeki Faturalarım ekranından tüm faturalarınızı PDF olarak görüntüleyebilir ve indirebilirsiniz. Kurumsal alımlarda vergi numarası ve şirket ünvanı ile düzenlenen faturalar, talep etmeniz halinde e-posta ile de gönderilir.",
    featured: false,
    keywords: ["fatura", "e-arşiv", "pdf", "kurumsal"],
  },
  {
    id: "faq-siparis-iptal",
    categoryId: "siparis",
    question: "Siparişimi hazırlık aşamasında iptal edebilir miyim?",
    answer:
      "Sipariş durumu \"Hazırlanıyor\" olarak görünüyorsa hesabınızdaki Siparişlerim ekranından veya destek talebi açarak iptal talebinde bulunabilirsiniz. Kargoya verilmemiş siparişlerde iptal ücretsizdir ve ödeme 1-3 iş günü içinde kartınıza iade edilir. Kargoya verilen siparişlerde iptal yerine teslimattan sonra 14 gün cayma hakkı kullanılır.",
    featured: true,
    keywords: ["iptal", "sipariş iptali", "iade", "hazırlık"],
  },
  {
    id: "faq-kargo-suresi",
    categoryId: "kargo",
    question: "Siparişim ne kadar sürede elime ulaşır?",
    answer:
      "Saat 16:00'a kadar verilen ve ödemesi onaylanan siparişler aynı iş günü kargoya verilir. İstanbul, Ankara, İzmir ve Bursa için 1-2 iş günü, diğer il merkezlerinde 2-3 iş günü, köy ve kırsal mahallelerde 3-5 iş günü teslimat öngörülüyor. Resmi tatillerde kargo firmalarının operasyon takvimi geçerlidir.",
    featured: true,
    keywords: ["kargo", "teslimat", "süre", "kaç gün", "aynı gün"],
  },
  {
    id: "faq-kargo-takip",
    categoryId: "kargo",
    question: "Kargo takip numaramı nasıl görürüm?",
    answer:
      "Sipariş kargoya verildiğinde takip numarası SMS ve e-posta ile iletilir; ayrıca Kargo Takibi ekranında sipariş numaranız ile sorgulayabilirsiniz. Takip numarası ile kargo firmasının sitesinden gönderinin nerede olduğunu, kaç kez dağıtıma çıktığını görebilirsiniz. SMS gelmediyse hesabınızdaki Siparişlerim ekranına bakın.",
    featured: true,
    keywords: ["kargo takip", "takip numarası", "sms", "gönderi"],
  },
  {
    id: "faq-ucretsiz-kargo",
    categoryId: "kargo",
    question: "Ücretsiz kargo limiti nedir?",
    answer:
      "1.500 TL ve üzeri tüm siparişlerde kargo ücretsizdir. Bu limitin altındaki siparişlerde kargo ücreti, sepet tutarına ve teslimat bölgesine göre ödeme adımında ayrıca hesaplanır. Kasa, monitör ve masa gibi büyük hacimli ürünlerde desi farkı, ürün sayfasında belirtilir.",
    featured: false,
    keywords: ["ücretsiz kargo", "kargo ücreti", "limit", "desi"],
  },
  {
    id: "faq-adres-degisikligi",
    categoryId: "kargo",
    question: "Teslimat adresimi değiştirebilir miyim?",
    answer:
      "Sipariş kargoya verilmeden önce adres değişikliği yapılabilir. Destek talebi açarak sipariş numaranız ve yeni adresinizle başvurmanız yeterlidir. Kargoya verilmiş gönderilerde adres değişikliği kargo firmasının dağıtım bölgesine bağlı olduğundan, kurye ile iletişime geçmeniz veya teslimat şubesinden teslim almanız gerekir.",
    featured: false,
    keywords: ["adres", "değişiklik", "teslimat adresi", "kurye"],
  },
  {
    id: "faq-teslim-alamadim",
    categoryId: "kargo",
    question: "Kurye geldi ancak evde yoktum, ne olacak?",
    answer:
      "Kurye adreste bulamadığında gönderi, aynı gün akşam tekrar dağıtıma çıkar. İkinci denemede de teslim edilemezse paket 3 iş günü boyunca en yakın kargo şubesinde bekletilir. Bu sürede şubeden kendi kimliğinizle teslim alabilirsiniz. 3 iş günü sonunda gönderi tarafımıza iade olur ve ücret iadesi süreci başlatılır.",
    featured: false,
    keywords: ["teslim", "kurye", "şube", "iade"],
  },
  {
    id: "faq-cayma-hakki",
    categoryId: "iade",
    question: "Cayma hakkım kaç gün ve nasıl kullanılır?",
    answer:
      "Teslimat tarihinden itibaren 14 gün içinde gerekçe göstermeksizin cayma hakkınızı kullanabilirsiniz. Destek talebi açarak veya hesabınızdaki iade başvurusu ile bildirim yapmanız yeterlidir. Ürünü orijinal ambalajı, tüm aksesuarları ve faturasıyla birlikte kargoya vermeniz beklenir. Yasal süreç hakkında ayrıntılar Mesafeli Satış Sözleşmesi sayfasında yer alır.",
    featured: true,
    keywords: ["cayma hakkı", "14 gün", "iade", "geri gönderim"],
  },
  {
    id: "faq-iade-sureci",
    categoryId: "iade",
    question: "İade süreci adım adım nasıl işliyor?",
    answer:
      "1) Hesabınızdan veya destek talebi ile iade bildirimi yaparsınız. 2) Size özel iade kargo kodu iletiIir; bu kodla gönderim ücretsizdir. 3) Ürün depomuza ulaşınca kontrol edilir, ortalama 2 iş günü sürer. 4) Onay sonrası ücret, ödeme yaptığınız yönteme 1-5 iş günü içinde iade edilir. Kredi kartı iadeleri bankanın ekstre dönemine göre görünür.",
    featured: true,
    keywords: ["iade süreci", "geri ödeme", "kargo kodu", "kontrol"],
  },
  {
    id: "faq-iade-kosullari",
    categoryId: "iade",
    question: "Hangi ürünler iade edilemez?",
    answer:
      "Kişiye özel üretilen ürünler, açılmış yazılım ve dijital lisanslar, tek kullanımlık hijyen ürünleri, ambalajı açılmış kulaklık ve hijyenik aksesuarlar ile montajı yapılmış özel konfigürasyonlu sistemler cayma hakkı kapsamı dışındadır. Bu ürünlerde üretim hatası olması halinde garanti süreçleri uygulanır.",
    featured: false,
    keywords: ["iade edilemez", "istisna", "ambalaj", "hijyen"],
  },
  {
    id: "faq-degisim",
    categoryId: "iade",
    question: "Ürün değişimi yapabilir miyim?",
    answer:
      "Evet. Aynı ürünün farklı rengi veya farklı bir ürünle değişim talebinde bulunabilirsiniz. Stok durumuna göre değişim, iade süreci tamamlandıktan sonra yeni sipariş olarak oluşturulur. Fiyat farkı varsa aradaki tutar tahsil edilir veya iade edilir. Değişim talebini de aynı 14 günlük süre içinde iletmeniz gerekir.",
    featured: false,
    keywords: ["değişim", "farklı ürün", "stok", "fiyat farkı"],
  },
  {
    id: "faq-garanti-suresi",
    categoryId: "urun",
    question: "Ürünlerde garanti süresi ne kadar?",
    answer:
      "Tüm ürünlerimiz en az 2 yıl yasal garanti kapsamındadır. Apple, Samsung ve bazı markalarda üretici garantisi 2 yıl olup yetkili servis ağı üzerinden işler. Hazır sistemlerde her bileşen kendi garanti süresine sahiptir; garanti belgesi sipariş teslimiyle birlikte dijital olarak hesabınıza yüklenir.",
    featured: true,
    keywords: ["garanti", "2 yıl", "servis", "bileşen"],
  },
  {
    id: "faq-servis",
    categoryId: "urun",
    question: "Arıza durumunda servis süreci nasıl başlatılır?",
    answer:
      "Destek merkezinden \"Ürün\" kategorisiyle bir talep açın; fatura ve arıza tanımını ekleyin. Teknik ekibimiz uzaktan çözüm denedikten sonra gerekirse kargo kodu tanımlar. Yetkili servise ulaşan ürünlerde onarım süresi markaya göre 5-20 iş günü arasında değişir. Süreç boyunca talep numaranız üzerinden durum takibi yapabilirsiniz.",
    featured: false,
    keywords: ["servis", "arıza", "onarım", "teknik"],
  },
  {
    id: "faq-uyumluluk",
    categoryId: "urun",
    question: "Seçtiğim parçalar birbiriyle uyumlu mu?",
    answer:
      "PC Toplama aracımız anakart soketi, bellek tipi, güç kaynağı kapasitesi ve kasa ölçüleri gibi temel uyumluluk kontrollerini otomatik yapar. Yine de özel soğutma veya ekran kartı uzunluğu gibi durumlar için ürün sayfasındaki teknik tabloyu kontrol etmenizi öneririz. Emin değilseniz teknik destek ekibimiz yapılandırmayı ücretsiz inceler.",
    featured: false,
    keywords: ["uyumluluk", "anakart", "bellek", "pc toplama"],
  },
  {
    id: "faq-teshir",
    categoryId: "urun",
    question: "Ürünleri mağazada görebilir miyim?",
    answer:
      "Merkez ofisimizde seçili ürünlerin teşhir alanı bulunuyor; ziyaret öncesi randevu almanızı öneririz. Teşhirde bulunmayan ürünler için sipariş oluşturup teslimat sonrası inceleme yapabilirsiniz; 14 gün cayma hakkı bu durumda da geçerlidir.",
    featured: false,
    keywords: ["mağaza", "teşhir", "randevu", "ziyaret"],
  },
  {
    id: "faq-uyelik",
    categoryId: "hesap",
    question: "Sipariş için üye olmam gerekiyor mu?",
    answer:
      "Üye olmadan da sipariş verebilirsiniz; ancak üyelik ile sipariş geçmişinizi, faturalarınızı ve adres defterinizi tek yerden yönetebilirsiniz. Üyelik ücretsizdir ve sipariş sırasında oluşturduğunuz hesap otomatik olarak aktif olur.",
    featured: false,
    keywords: ["üyelik", "üye ol", "hesap", "kayıt"],
  },
  {
    id: "faq-sifre",
    categoryId: "hesap",
    question: "Şifremi unuttum, nasıl sıfırlarım?",
    answer:
      "Giriş ekranındaki \"Şifremi unuttum\" bağlantısına tıklayıp kayıtlı e-posta adresinizi girin. Birkaç dakika içinde gelen sıfırlama bağlantısı 30 dakika geçerlidir. E-posta gelmiyorsa spam klasörünü kontrol edin; sorun sürüyorsa destek talebi açın.",
    featured: true,
    keywords: ["şifre", "sıfırlama", "unuttum", "giriş"],
  },
  {
    id: "faq-guvenlik",
    categoryId: "hesap",
    question: "Kart bilgilerim güvende mi?",
    answer:
      "Kart bilgileriniz sitemizde saklanmaz. Ödeme, 3D Secure destekli ödeme kuruluşu altyapısı üzerinden PCI-DSS uyumlu olarak işlenir. Tüm sayfalar HTTPS ile şifrelenir; hesabınızda iki adımlı doğrulamayı etkinleştirerek girişlerinizi ayrıca koruyabilirsiniz.",
    featured: true,
    keywords: ["güvenlik", "kart", "3d secure", "kvkk", "ssl"],
  },
  {
    id: "faq-veri",
    categoryId: "hesap",
    question: "Verilerimi silmek istiyorum, ne yapmalıyım?",
    answer:
      "KVKK kapsamında hesabınızın ve kişisel verilerinizin silinmesini talep edebilirsiniz. Destek talebi veya iletişim formu üzerinden yazılı başvuru yapmanız yeterlidir; talepler en geç 30 gün içinde yanıtlanır. Yasal saklama yükümlülüğü bulunan fatura ve muhasebe kayıtları mevzuatta öngörülen süre boyunca tutulmaya devam eder.",
    featured: false,
    keywords: ["kvkk", "veri silme", "kişisel veri", "başvuru"],
  },
  {
    id: "faq-kurulum",
    categoryId: "teknik",
    question: "Hazır sistemler kurulu olarak mı geliyor?",
    answer:
      "Hazır sistemler, montajı yapılmış, işletim sistemi kurulmuş ve stres testinden geçmiş şekilde gönderilir. Kablolama ve BIOS güncellemeleri tamamlanmış olur; kutudan çıkardıktan sonra güç kablosunu takıp monitöre bağlamanız yeterlidir. Kurulum rehberi kutu içeriğinde ve hesabınızda yer alır.",
    featured: true,
    keywords: ["hazır sistem", "montaj", "kurulum", "windows"],
  },
  {
    id: "faq-uzaktan-destek",
    categoryId: "teknik",
    question: "Uzaktan teknik destek alabilir miyim?",
    answer:
      "Evet. Yazılım, sürücü, BIOS ve performans konularında uzaktan bağlantı ile destek sağlıyoruz. Destek talebi açarken \"Teknik Destek\" kategorisini seçin ve uygun saat aralığını belirtin. Uzaktan bağlantı yalnızca sizin onayınızla ve oturum süresince aktif olur.",
    featured: false,
    keywords: ["uzaktan destek", "sürücü", "bios", "performans"],
  },
  {
    id: "faq-ses-sorunu",
    categoryId: "teknik",
    question: "Yeni aldığım ekran kartından ses geliyor, normal mi?",
    answer:
      "Yük altında duyulan hafif bobin (coil whine) sesi bir arıza değildir ve performansı etkilemez. Ses rahatsız edici seviyedeyse kasa havalandırmasını kontrol edin, güç kaynağı bağlantılarının tam oturduğundan emin olun. Sorun devam ederse ürünü garanti kapsamında incelemeye alabiliriz.",
    featured: false,
    keywords: ["ekran kartı", "ses", "coil whine", "arıza"],
  },
  {
    id: "faq-işletim-sistemi",
    categoryId: "teknik",
    question: "İşletim sistemi kurulu gelmiyor mu?",
    answer:
      "Hazır sistemlerde lisanslı Windows 11 kurulu olarak gelir. Bileşen bazlı alımlarda işletim sistemi dahil değildir; ancak sipariş notuna eklemeniz halinde ücreti karşılığında kurulum ve lisans temin edilebilir. Linux dağıtımları için sürücü uyumluluğu konusunda önceden bilgi almanızı öneririz.",
    featured: false,
    keywords: ["windows", "işletim sistemi", "lisans", "linux"],
  },
  {
    id: "faq-monitor-uyumluluk",
    categoryId: "teknik",
    question: "Monitör ile ekran kartı uyumunu nasıl anlarım?",
    answer:
      "Ekran kartının çıkışları (HDMI 2.1, DisplayPort 1.4) ile monitörün girişlerini karşılaştırın. Yüksek yenileme hızı (144 Hz ve üzeri) için DisplayPort kablosu önerilir. Ürün sayfalarındaki teknik tablolarda çözünürlük, yenileme hızı ve bağlantı tipleri ayrıntılı olarak listelenir.",
    featured: false,
    keywords: ["monitör", "ekran kartı", "hdmi", "displayport", "hz"],
  },
  {
    id: "faq-kurumsal",
    categoryId: "siparis",
    question: "Kurumsal alım ve teklif alabilir miyim?",
    answer:
      "Evet. 10 adet ve üzeri alımlarda, proje bazlı sistemlerde ve yıllık bakım anlaşmalarında özel fiyat teklifi hazırlıyoruz. İletişim formunda \"Kurumsal\" konusunu seçerek vergi bilgileriniz ve ihtiyaç listenizle başvurabilirsiniz. Teklifler genellikle 1 iş günü içinde iletilir.",
    featured: false,
    keywords: ["kurumsal", "teklif", "toptan", "proje"],
  },
  {
    id: "faq-kampanya",
    categoryId: "siparis",
    question: "Kampanya ve kupon kodunu nasıl kullanırım?",
    answer:
      "Sepet ekranındaki \"Kupon kodu\" alanına kodu yazıp uygula butonuna basmanız yeterlidir. Kuponlar genellikle tek kullanımlıktır, belirli kategorilerde geçerli olabilir ve alt limiti vardır. Aynı siparişte tek kupon kullanılabilir; indirimli ürünlerde kupon geçerli olmayabilir.",
    featured: false,
    keywords: ["kupon", "kampanya", "indirim", "kod"],
  },
  {
    id: "faq-takas",
    categoryId: "siparis",
    question: "Eski bilgisayarımı takas edebilir miyim?",
    answer:
      "Seçili bileşenlerde takas programımız bulunuyor. Ürünün modeli, çalışır durumda olması ve garanti durumu değerlendirilerek indirim tutarı belirlenir. Değerlendirme için iletişim formundan \"Takas\" konusuyla başvurabilir, cihaz bilgilerini paylaşabilirsiniz.",
    featured: false,
    keywords: ["takas", "eski bilgisayar", "indirim", "değerlendirme"],
  },
  {
    id: "faq-sss-nerede",
    categoryId: "hesap",
    question: "Sorunumun cevabını burada bulamadım, ne yapmalıyım?",
    answer:
      "Destek merkezinden numaralı bir talep oluşturabilir, dosya veya ekran görüntüsü ekleyebilirsiniz. Acil konularda çağrı merkezimizi arayabilir ya da WhatsApp üzerinden yazabilirsiniz. Tüm talepler kayıt altına alınır ve yanıt süresi boyunca aynı numara üzerinden takip edilir.",
    featured: false,
    keywords: ["destek", "yardım", "iletişim", "talep"],
  },
];