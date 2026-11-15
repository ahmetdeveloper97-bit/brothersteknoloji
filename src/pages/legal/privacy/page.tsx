import { Link } from "react-router-dom";
import { useContactInfo } from "@/hooks/useContactInfo";
import type { ContactInfo } from "@/hooks/useContactInfo";
import LegalLayout from "@/pages/legal/components/LegalLayout";

const buildSections = (contact: ContactInfo) => [
  {
    title: "1. Veri sorumlusu",
    body: (
      <>
        <p>
          Bu mağaza, <strong className="font-semibold text-foreground-950">Brothers Teknoloji</strong> (bundan sonra
          &quot;Mağaza&quot;) tarafından işletilmektedir. 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
          kapsamında veri sorumlusu Brothers Teknoloji&apos;dir. Kişisel verileriniz aşağıda açıklanan kapsam ve amaçlarla
          işlenmektedir.
        </p>
        <p>
          İletişim:{" "}
          {contact.email ? (
            <a href={contact.emailHref} className="font-medium text-primary-800 underline decoration-dotted">
              {contact.email}
            </a>
          ) : null}
          {contact.phone ? <> · {contact.phone}</> : null}
          {contact.address ? <> · {contact.address}</> : null}
        </p>
      </>
    ),
  },
  {
    title: "2. Toplanan kişisel veriler",
    body: (
      <>
        <ul className="list-inside list-disc space-y-1.5 marker:text-primary-600">
          <li>
            <strong className="font-semibold text-foreground-900">Kimlik bilgileri:</strong> ad, soyad, fatura ve
            teslimat adresi.
          </li>
          <li>
            <strong className="font-semibold text-foreground-900">İletişim bilgileri:</strong> e-posta adresi, cep
            telefonu, gerektiğinde sabit telefon.
          </li>
          <li>
            <strong className="font-semibold text-foreground-900">Müşteri işlem bilgileri:</strong> sipariş geçmişi,
            sepet içeriği, kupon kullanımı, iade ve değişim kayıtları.
          </li>
          <li>
            <strong className="font-semibold text-foreground-900">Ödeme bilgileri:</strong> maskelenmiş kart numarası ve
            taksit tercihi. Kart bilgileri sitemizde saklanmaz; ödeme iyzico altyapısında işlenir.
          </li>
          <li>
            <strong className="font-semibold text-foreground-900">İşlem güvenliği bilgileri:</strong> IP adresi, cihaz
            ve tarayıcı bilgisi, çerez kayıtları.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "3. İşleme amaçları ve hukuki sebep",
    body: (
      <>
        <p>Kişisel verileriniz aşağıdaki amaçlarla, KVKK m.5 ve m.6&apos;da sayılan hukuki sebeplere dayanılarak işlenir:</p>
        <ul className="list-inside list-disc space-y-1.5 marker:text-primary-600">
          <li>Siparişin oluşturulması, hazırlanması, kargoya teslimi ve faturalandırılması (sözleşmenin ifası).</li>
          <li>Üyelik işlemleri, favoriler ve sepet bilgisinin hatırlanması (meşru menfaat).</li>
          <li>Müşteri hizmetleri, iade ve garanti süreçlerinin yürütülmesi.</li>
          <li>Onayınız bulunması halinde kampanya, indirim ve hatırlatma bildirimlerinin gönderilmesi.</li>
          <li>Dolandırıcılık girişimlerinin tespiti ve hukuki yükümlülüklerin yerine getirilmesi.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Verilerin aktarılması",
    body: (
      <>
        <p>
          Verileriniz; kargo ve lojistik firmaları, ödeme kuruluşu (iyzico), e-fatura ve muhasebe hizmet sağlayıcıları,
          SMS ve e-posta bildirim sağlayıcıları ile yalnızca hizmetin gerektirdiği ölçüde paylaşılır. Yasal olarak
          yetkili kamu kurumlarına yapılan aktarımlar saklıdır. Yurt dışına aktarım yapılmamaktadır.
        </p>
      </>
    ),
  },
  {
    title: "5. Saklama süresi",
    body: (
      <>
        <p>
          Sipariş ve fatura kayıtları, Vergi Usul Kanunu ve Türk Ticaret Kanunu gereği <strong className="font-semibold text-foreground-900">10 yıl</strong>{" "}
          saklanır. Üyelik verileri, üyeliğin sona ermesinden itibaren 2 yıl; pazarlama izinleri ise iznin geri
          alınmasına kadar tutulur. Süre sonunda veriler silinir, yok edilir veya anonim hale getirilir.
        </p>
      </>
    ),
  },
  {
    title: "6. KVKK kapsamındaki haklarınız",
    body: (
      <>
        <ul className="list-inside list-disc space-y-1.5 marker:text-primary-600">
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,</li>
          <li>Silinmesini veya yok edilmesini talep etme,</li>
          <li>Otomatik sistemlerle yapılan analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme.</li>
        </ul>
        <p>
          Taleplerinizi {contact.email ? contact.email : "mağaza iletişim adresine"} adresine iletebilirsiniz.
          Başvurular en geç 30 gün içinde yanıtlanır.
        </p>
      </>
    ),
  },
  {
    title: "7. Çerezler ve güvenlik",
    body: (
      <>
        <p>
          Sitede zorunlu, analitik ve pazarlama çerezleri kullanılmaktadır. Tercihlerinizi dilediğiniz zaman{" "}
          <Link to="/cerez-politikasi" className="font-medium text-primary-800 underline decoration-dotted">
            Çerez Politikası
          </Link>{" "}
          sayfasından değiştirebilirsiniz. Tüm ödeme işlemleri 256-bit SSL ve 3D Secure ile korunur.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  const contact = useContactInfo();
  const sections = buildSections(contact);

  return (
    <LegalLayout
      title="Gizlilik Politikası"
      subtitle="Kişisel verilerinizi hangi amaçla topladığımızı, nasıl koruduğumuzu ve haklarınızı bu sayfada açıklıyoruz."
      updatedAt="12.09.2026"
    >
      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 font-heading text-base font-bold text-foreground-950">{section.title}</h2>
          <div className="space-y-2.5">{section.body}</div>
        </section>
      ))}

      <div className="rounded-lg border border-background-200 bg-background-100 p-4 text-xs text-foreground-600">
        <p className="flex items-start gap-2">
          <i className="ri-information-line mt-0.5 text-base text-primary-700" />
          <span>
            Bu metin bilgilendirme amaçlıdır ve mağazanın faaliyetlerine göre güncellenebilir. Güncel sürüm her zaman
            bu sayfada yayımlanır.
          </span>
        </p>
      </div>
    </LegalLayout>
  );
}