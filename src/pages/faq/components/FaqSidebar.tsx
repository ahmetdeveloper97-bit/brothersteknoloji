import { Link } from "react-router-dom";
import type { ContactInfo } from "@/hooks/useContactInfo";
import type { FaqItem } from "@/types/faq";

interface FaqSidebarProps {
  featured: FaqItem[];
  contact: ContactInfo;
  onOpenQuestion: (id: string) => void;
}

const shortcuts = [
  { id: "destek", icon: "ri-customer-service-2-line", label: "Destek talebi oluştur", to: "/destek" },
  { id: "kargo", icon: "ri-truck-line", label: "Kargo takibi", to: "/kargo-takip" },
  { id: "havale", icon: "ri-bank-card-line", label: "Havale / EFT bilgileri", to: "/havale-banka-bilgileri" },
  { id: "mesafeli", icon: "ri-file-shield-2-line", label: "Mesafeli satış sözleşmesi", to: "/sayfa/mesafeli-satis-sozlesmesi" },
];

export default function FaqSidebar({ featured, contact, onOpenQuestion }: FaqSidebarProps) {
  return (
    <aside className="h-fit space-y-3 lg:sticky lg:top-[278px]">
      <div className="rounded-xl border border-background-200 bg-background-50 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-400">
          <i className="ri-fire-line text-base text-accent-600" />
          En çok merak edilenler
        </p>
        <div className="mt-2.5 space-y-1">
          {featured.slice(0, 6).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenQuestion(item.id)}
              className="flex w-full cursor-pointer items-start gap-2 rounded-lg px-1.5 py-2 text-left transition-colors hover:bg-background-100"
            >
              <span className="mt-0.5 w-4 shrink-0 text-[11px] font-bold text-primary-700">{index + 1}</span>
              <span className="min-w-0 flex-1 text-xs leading-snug text-foreground-700">{item.question}</span>
              <i className="ri-arrow-right-s-line mt-0.5 shrink-0 text-foreground-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-background-200 bg-background-50 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
          <i className="ri-links-line text-base text-primary-700" />
          Hızlı bağlantılar
        </p>
        <div className="mt-2.5 space-y-1">
          {shortcuts.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-2 text-xs text-foreground-700 transition-colors hover:bg-background-100 hover:text-foreground-950"
            >
              <i className={`${item.icon} text-sm text-foreground-400`} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <i className="ri-arrow-right-s-line shrink-0 text-foreground-300" />
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-primary-900 dark:text-primary-950">
          <i className="ri-customer-service-2-line text-base" />
          Cevabını bulamadınız mı?
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-primary-900/80 dark:text-primary-950/80">
          Uzman ekibimiz hafta içi 09:00 - 18:00 arasında sorularınızı yanıtlıyor. Ortalama yanıt süresi 4 saat.
        </p>
        <div className="mt-3 space-y-2">
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
            to="/destek"
            className="flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-300 bg-background-50 text-xs font-semibold text-primary-900 hover:bg-primary-100 dark:text-primary-950"
          >
            <i className="ri-ticket-2-line" />
            Destek talebi aç
          </Link>
          {contact.email && (
            <a
              href={contact.emailHref}
              className="flex cursor-pointer items-center justify-center gap-1.5 pt-0.5 text-[11px] font-medium text-primary-800 hover:underline dark:text-primary-950"
            >
              <i className="ri-mail-line" />
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}