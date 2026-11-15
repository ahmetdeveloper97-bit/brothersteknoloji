import { useEffect } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import ContactForm from "@/pages/contact/components/ContactForm";
import ContactChannels from "@/pages/contact/components/ContactChannels";
import { useContactInfo } from "@/hooks/useContactInfo";
import { BUSINESS_WHATSAPP_LABEL, BUSINESS_WHATSAPP_NUMBER, waLink } from "@/lib/whatsapp";

const helpCards = [
  {
    id: "destek",
    icon: "ri-customer-service-2-line",
    title: "Destek talebi",
    text: "Sipariş, kargo veya ürünle ilgili sorunları dosya ekleyerek bildirin.",
    to: "/destek",
    cta: "Talep oluştur",
  },
  {
    id: "kargo",
    icon: "ri-truck-line",
    title: "Kargo takibi",
    text: "Sipariş numaranızla gönderinizin hangi aşamada olduğunu görün.",
    to: "/kargo-takip",
    cta: "Takip et",
  },
  {
    id: "iade",
    icon: "ri-arrow-go-back-line",
    title: "İade ve değişim",
    text: "14 gün cayma hakkı, iade süreci ve değişim adımlarını okuyun.",
    to: "/sayfa/mesafeli-satis-sozlesmesi",
    cta: "Koşulları gör",
  },
];

const setMetaDescription = (value: string) => {
  if (!value) return;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
};

export default function ContactPage() {
  const contact = useContactInfo();
  const whatsappUrl = waLink(BUSINESS_WHATSAPP_NUMBER, "Merhaba, Brothers Teknoloji'den bilgi almak istiyorum.");
  const mapQuery = contact.address || "İstanbul";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "İletişim | Brothers Teknoloji";
    setMetaDescription(
      "Brothers Teknoloji iletişim bilgileri: çağrı merkezi, e-posta, WhatsApp destek, merkez ofis adresi ve destek talebi formu.",
    );
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 md:py-9">
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-500">
            <Link to="/" className="cursor-pointer hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="font-semibold text-foreground-800">İletişim</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            Bize ulaşın, birlikte çözelim
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground-600">
            Sipariş, kargo, teknik destek veya iş birliği talepleriniz için buradayız. Formu kullanabilir, telefonla
            arayabilir ya da destek merkezinden numaralı bir talep açabilirsiniz.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-300 bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
              <i className="ri-time-line" />
              Ortalama yanıt: 4 saat
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
              <i className="ri-shield-check-line" />
              KVKK uyumlu veri işleme
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
              <i className="ri-file-image-line" />
              Dosya ve ekran görüntüsü desteği
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-4">
            <ContactForm />

            <div className="overflow-hidden rounded-xl border border-background-200 bg-background-50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-background-200 px-4 py-3">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground-950">
                  <i className="ri-map-2-line text-base text-primary-700" />
                  Ofis konumumuz
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-primary-800 hover:text-primary-600"
                >
                  Yol tarifi al
                  <i className="ri-arrow-right-up-line" />
                </a>
              </div>
              <iframe
                title="Brothers Teknoloji ofis konumu"
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="h-[300px] w-full border-0 md:h-[340px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {helpCards.map((card) => (
                <Link
                  key={card.id}
                  to={card.to}
                  className="group flex cursor-pointer flex-col gap-2 rounded-xl border border-background-200 bg-background-50 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/40"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-100 text-primary-800">
                    <i className={`${card.icon} text-base`} />
                  </span>
                  <span className="text-sm font-semibold text-foreground-950">{card.title}</span>
                  <span className="text-[11px] leading-relaxed text-foreground-600">{card.text}</span>
                  <span className="mt-auto flex items-center gap-1 pt-1 text-[11px] font-semibold text-primary-800">
                    {card.cta}
                    <i className="ri-arrow-right-line transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="h-fit space-y-3 lg:sticky lg:top-[278px]">
            <ContactChannels contact={contact} whatsappUrl={whatsappUrl} whatsappNumber={BUSINESS_WHATSAPP_LABEL} />
            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
                <i className="ri-calendar-schedule-line text-base text-primary-700" />
                Çalışma saatleri
              </p>
              <div className="mt-2 space-y-1.5 text-[11px] text-foreground-600">
                <p className="flex items-center justify-between gap-2">
                  <span>Pazartesi - Cuma</span>
                  <span className="font-semibold text-foreground-900">09:00 - 18:00</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span>Cumartesi</span>
                  <span className="font-semibold text-foreground-900">10:00 - 14:00</span>
                </p>
                <p className="flex items-center justify-between gap-2">
                  <span>Pazar</span>
                  <span className="font-medium text-foreground-400">Kapalı</span>
                </p>
              </div>
              <p className="mt-3 border-t border-background-200 pt-3 text-[11px] leading-relaxed text-foreground-500">
                Çalışma saatleri dışında iletilen destek talepleri ertesi iş günü öncelik sırasına alınır.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}