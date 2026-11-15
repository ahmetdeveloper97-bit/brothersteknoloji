import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import TicketForm from "@/pages/support/components/TicketForm";
import TicketTracker from "@/pages/support/components/TicketTracker";
import { useContactInfo } from "@/hooks/useContactInfo";

type TabKey = "new" | "track";

const steps = [
  { id: "1", icon: "ri-edit-2-line", title: "Talebi anlatın", text: "Konu ve kategori seçin, sorunu kısaca yazın." },
  { id: "2", icon: "ri-attachment-2", title: "Dosya ekleyin", text: "Ekran görüntüsü, fatura veya PDF ekleyebilirsiniz." },
  { id: "3", icon: "ri-ticket-2-line", title: "Numaranızı alın", text: "Talebiniz numaralanır, e-posta ile eşleşir." },
  { id: "4", icon: "ri-chat-check-line", title: "Yanıtı görün", text: "Aynı numarayla takip edin, ek bilgi gönderin." },
];

const faqs = [
  {
    id: "sure",
    q: "Yanıt ne kadar sürede gelir?",
    a: "Hafta içi mesai saatlerinde ortalama 4 saat içinde dönüş yapıyoruz. Yoğun dönemlerde bu süre bir iş gününe çıkabilir.",
  },
  {
    id: "dosya",
    q: "Hangi dosyaları ekleyebilirim?",
    a: "PNG, JPG, WEBP, GIF görselleri ve PDF belgeleri ekleyebilirsiniz. Her dosya en fazla 3 MB, toplam 3 dosya.",
  },
  {
    id: "takip",
    q: "Talebimi nasıl takip ederim?",
    a: "Talep oluşturduğunuzda verilen talep numarası ve e-posta adresinizle bu sayfadaki sorgulama alanını kullanın.",
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

export default function SupportPage() {
  const contact = useContactInfo();
  const [tab, setTab] = useState<TabKey>("new");
  const [trackNo, setTrackNo] = useState("");
  const [trackEmail, setTrackEmail] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Destek Merkezi ve Talep Takibi | Brothers Teknoloji";
    setMetaDescription(
      "Brothers Teknoloji destek merkezi: dosya ekleyerek destek talebi oluşturun, talep numaranızla geçmişi takip edin ve ek bilgi gönderin.",
    );
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const openTracker = (ticketNo: string, email: string) => {
    setTrackNo(ticketNo);
    setTrackEmail(email);
    setTab("track");
  };

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 md:py-9">
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-500">
            <Link to="/" className="cursor-pointer hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <Link to="/iletisim" className="cursor-pointer hover:text-foreground-900">
              İletişim
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="font-semibold text-foreground-800">Destek Merkezi</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            Destek Merkezi
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground-600">
            Sipariş, kargo, ödeme veya teknik konularda talebinizi dosya ekleyerek iletin. Talebiniz numaralanır,
            yanıtları aynı ekrandan takip edebilirsiniz.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-4">
            <div className="inline-flex rounded-full border border-background-200 bg-background-50 px-1 py-1">
              <button
                type="button"
                onClick={() => setTab("new")}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  tab === "new"
                    ? "bg-primary-800 text-background-50"
                    : "text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                }`}
              >
                <i className="ri-add-circle-line text-sm" />
                Yeni Talep
              </button>
              <button
                type="button"
                onClick={() => setTab("track")}
                className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  tab === "track"
                    ? "bg-primary-800 text-background-50"
                    : "text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                }`}
              >
                <i className="ri-search-eye-line text-sm" />
                Talebimi Sorgula
                {trackNo && (
                  <span className="rounded-full bg-background-50/25 px-1.5 text-[10px] font-bold">{trackNo.slice(-4)}</span>
                )}
              </button>
            </div>

            {tab === "new" ? <TicketForm onOpenTracker={openTracker} /> : <TicketTracker initialTicketNo={trackNo} initialEmail={trackEmail} />}
          </div>

          <aside className="h-fit space-y-3 lg:sticky lg:top-[278px]">
            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
                <i className="ri-route-line text-base text-primary-700" />
                Süreç nasıl işliyor?
              </p>
              <ol className="mt-3 space-y-2.5">
                {steps.map((step) => (
                  <li key={step.id} className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-800">
                      {step.id}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-foreground-900">{step.title}</span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-foreground-600">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
                <i className="ri-question-answer-line text-base text-primary-700" />
                Sık sorulan sorular
              </p>
              <div className="mt-2 divide-y divide-background-200">
                {faqs.map((faq) => (
                  <div key={faq.id} className="py-2">
                    <button
                      type="button"
                      onClick={() => setOpenFaq((current) => (current === faq.id ? null : faq.id))}
                      className="flex w-full cursor-pointer items-start gap-2 text-left text-[11px] font-semibold text-foreground-800 hover:text-foreground-950"
                    >
                      <span className="min-w-0 flex-1">{faq.q}</span>
                      <i className={`${openFaq === faq.id ? "ri-subtract-line" : "ri-add-line"} shrink-0`} />
                    </button>
                    {openFaq === faq.id && (
                      <p className="mt-1 text-[11px] leading-relaxed text-foreground-600">{faq.a}</p>
                    )}
                  </div>
                ))}
              </div>
              <Link
                to="/sikca-sorulan-sorular"
                className="mt-2 flex cursor-pointer items-center gap-1 border-t border-background-200 pt-2.5 text-[11px] font-semibold text-primary-800 hover:text-primary-600"
              >
                Tüm soruları görüntüle
                <i className="ri-arrow-right-line" />
              </Link>
            </div>

            <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-primary-950">Acil bir durum mu var?</p>
              <p className="mt-1 text-[11px] leading-relaxed text-primary-900/80 dark:text-primary-950/80">
                Kargo ve ödeme sorunlarında bizi doğrudan arayabilirsiniz.
              </p>
              <div className="mt-2.5 space-y-2">
                {contact.phone && (
                  <a
                    href={contact.phoneHref}
                    className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 text-xs font-semibold text-background-50 hover:bg-primary-700"
                  >
                    <i className="ri-phone-line" />
                    {contact.phone}
                  </a>
                )}
                <Link
                  to="/iletisim"
                  className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-300 bg-background-50 text-xs font-semibold text-primary-900 hover:bg-primary-100"
                >
                  <i className="ri-mail-line" />
                  İletişim sayfası
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}