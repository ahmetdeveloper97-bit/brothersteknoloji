import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import TrackingWidget from "@/components/storefront/TrackingWidget";
import { useContactInfo } from "@/hooks/useContactInfo";
import MyShipmentsPanel from "@/pages/tracking/components/MyShipmentsPanel";

const steps = [
  { icon: "ri-file-list-3-line", title: "Siparişiniz onaylanır", text: "Ödeme onayının ardından sipariş aynı gün hazırlanmaya alınır." },
  { icon: "ri-price-tag-3-line", title: "Etiket oluşturulur", text: "Kargo firması seçilir, takip numarası üretilir ve size SMS ile iletilir." },
  { icon: "ri-truck-line", title: "Yola çıkar", text: "16:00'a kadar verilen siparişler aynı gün kuryeye teslim edilir." },
  { icon: "ri-home-smile-line", title: "Kapınızda", text: "Kurye dağıtıma çıktığında aynı gün teslim edilir, kapıda ödeme yapılabilir." },
];

const supports = [
  { icon: "ri-time-line", title: "Canlı durum", text: "Gönderi hareketleri kargo firmasından çekilir ve 15 dakikada bir güncellenir." },
  { icon: "ri-message-2-line", title: "SMS & WhatsApp", text: "Her durum değişiminde otomatik bildirim gönderilir, takip linki iletilir." },
  { icon: "ri-arrow-go-back-line", title: "Kolay iade", text: "14 gün içinde koşulsuz iade; kargo kodunu biz oluşturup size iletiyoruz." },
];

export default function TrackingPage() {
  const [preset, setPreset] = useState("");
  const contact = useContactInfo();

  useEffect(() => {
    if (window.location.hash === "#siparislerim") {
      const target = document.getElementById("siparislerim");
      if (target) {
        window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
      }
    }
  }, []);

  const selectTracking = (tracking: string) => {
    setPreset(tracking);
    document.getElementById("kargo-takip")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <StoreLayout>
      <div className="mx-auto w-full max-w-[1320px] px-4 py-6 md:py-8">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-foreground-500">
          <Link to="/" className="hover:text-foreground-900">
            Anasayfa
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="text-foreground-800">Kargo Takibi</span>
        </nav>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-background-100 px-2.5 py-1 text-[11px] font-medium text-foreground-600">
                <i className="ri-truck-line text-primary-700" />
                Tüm kargo firmaları
              </span>
              <a
                href="#siparislerim"
                className="flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-800 hover:border-primary-300 hover:text-primary-800"
              >
                <i className="ri-file-list-3-line" />
                Siparişlerim
              </a>
            </div>
            <h1 className="mt-3 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Siparişiniz nerede?</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-600">
              Takip numaranız ile gönderinizin hangi aşamada olduğunu anında görün. Tüm kargo firmaları tek ekranda —
              Yurtiçi, Aras, MNG, Sürat, PTT, Sendeo, HepsiJET ve daha fazlası.
            </p>
            <div id="kargo-takip" className="mt-5 scroll-mt-32">
              <TrackingWidget key={preset} initialQuery={preset} />
            </div>
          </div>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-background-200 bg-background-100 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950">
                <i className="ri-customer-service-2-line text-primary-700" />
                Yardım mı gerekiyor?
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground-600">
                Takip numaranızı bulamıyorsanız sipariş numaranızla da sorgulayabilirsiniz. Yine sonuç çıkmazsa
                müşteri hizmetlerimiz kargo firmasıyla sizin adınıza iletişime geçer.
              </p>
              <div className="mt-3 space-y-2 text-xs text-foreground-700">
                {contact.phone && (
                  <a href={contact.phoneHref} className="flex items-center gap-2 hover:text-foreground-950">
                    <i className="ri-phone-line text-base text-primary-700" />
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a href={contact.emailHref} className="flex items-center gap-2 break-all hover:text-foreground-950">
                    <i className="ri-mail-line text-base text-primary-700" />
                    {contact.email}
                  </a>
                )}
                {contact.address && (
                  <p className="flex items-start gap-2 leading-relaxed">
                    <i className="ri-map-pin-line mt-0.5 text-base text-primary-700" />
                    {contact.address}
                  </p>
                )}
                <a href="#siparislerim" className="flex items-center gap-2 font-semibold hover:text-foreground-950">
                  <i className="ri-file-list-3-line text-base text-primary-700" />
                  Siparişlerim listesine git
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground-950">
                <i className="ri-shield-check-line text-accent-600" />
                Güvenli teslimat
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground-600">
                Tüm gönderiler sigortalıdır. Kayıp veya hasar durumunda ürün bedeli 5 iş günü içinde iade edilir.
              </p>
              <Link
                to="/kategoriler"
                className="mt-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-100 px-3 py-2 text-xs font-semibold text-foreground-800 hover:bg-background-200"
              >
                <i className="ri-store-3-line" />
                Alışverişe devam et
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <MyShipmentsPanel onSelect={selectTracking} />
        </div>

        <section className="mt-10">
          <h2 className="font-heading text-lg font-bold text-foreground-950">Teslimat süreci nasıl işliyor?</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
                    <i className={`${step.icon} text-base`} />
                  </span>
                  <span className="font-heading text-xs font-bold text-foreground-400">0{index + 1}</span>
                </div>
                <p className="mt-2.5 text-sm font-semibold text-foreground-950">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-foreground-600">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {supports.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-xl bg-background-100 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                <i className={`${item.icon} text-base`} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground-950">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-foreground-600">{item.text}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </StoreLayout>
  );
}