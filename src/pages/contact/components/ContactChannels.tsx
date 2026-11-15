import { Link } from "react-router-dom";
import { socialMeta } from "@/lib/siteSettings";
import type { ContactInfo } from "@/hooks/useContactInfo";

interface ContactChannelsProps {
  contact: ContactInfo;
  whatsappUrl: string;
  whatsappNumber?: string;
}

export default function ContactChannels({ contact, whatsappUrl, whatsappNumber }: ContactChannelsProps) {
  const channels = [
    {
      id: "phone",
      icon: "ri-phone-line",
      label: "Çağrı merkezi",
      value: contact.phone || "Numara belirtilmedi",
      hint: "Hafta içi 09:00 - 18:00",
      href: contact.phoneHref,
    },
    {
      id: "email",
      icon: "ri-mail-line",
      label: "E-posta",
      value: contact.email || "Adres belirtilmedi",
      hint: "Ortalama yanıt süresi 4 saat",
      href: contact.emailHref,
    },
    {
      id: "whatsapp",
      icon: "ri-whatsapp-line",
      label: "WhatsApp destek",
      value: whatsappNumber || "Sohbeti başlat",
      hint: "Hızlı sorular için en pratik yol",
      href: whatsappUrl,
    },
  ];

  return (
    <div className="space-y-3">
      {channels.map((channel) => {
        const inner = (
          <>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800">
              <i className={`${channel.icon} text-lg`} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                {channel.label}
              </span>
              <span className="mt-0.5 block truncate text-sm font-semibold text-foreground-950">{channel.value}</span>
              <span className="mt-0.5 block text-[11px] text-foreground-500">{channel.hint}</span>
            </span>
            {channel.href && <i className="ri-arrow-right-up-line shrink-0 text-foreground-400" />}
          </>
        );

        return channel.href ? (
          <a
            key={channel.id}
            href={channel.href}
            target={channel.id === "whatsapp" ? "_blank" : undefined}
            rel={channel.id === "whatsapp" ? "noopener noreferrer" : undefined}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-background-200 bg-background-50 p-3.5 transition-colors hover:border-primary-300 hover:bg-primary-50/40"
          >
            {inner}
          </a>
        ) : (
          <div key={channel.id} className="flex items-center gap-3 rounded-xl border border-background-200 bg-background-50 p-3.5">
            {inner}
          </div>
        );
      })}

      <div className="rounded-xl border border-background-200 bg-background-50 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
          <i className="ri-map-pin-line text-base text-primary-700" />
          Merkez ofis
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-foreground-600">
          {contact.address || "Adres bilgisi henüz eklenmedi."}
        </p>
        {contact.socials.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {contact.socials.map((social) => {
              const meta = socialMeta(social.platform);
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={meta.label}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-background-300 text-foreground-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800"
                >
                  <i className={`${meta.icon} text-sm`} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      <Link
        to="/destek"
        className="flex cursor-pointer flex-col gap-2 rounded-xl border border-primary-200 bg-primary-50 p-4 transition-colors hover:border-primary-400 hover:bg-primary-100"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-primary-900 dark:text-primary-950">
          <i className="ri-customer-service-2-line text-lg" />
          Destek talebi oluştur
        </span>
        <span className="text-[11px] leading-relaxed text-primary-900/80 dark:text-primary-950/80">
          Sipariş numaranızla birlikte ekran görüntüsü veya dosya ekleyebilir, talebinizi numarasıyla takip
          edebilirsiniz.
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-primary-800 dark:text-primary-950">
          Destek merkezine git
          <i className="ri-arrow-right-line" />
        </span>
      </Link>
    </div>
  );
}