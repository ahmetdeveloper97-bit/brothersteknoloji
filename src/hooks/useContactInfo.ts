import { useMemo } from "react";
import { useFooterSettings } from "@/hooks/useFooterSettings";
import type { FooterSocial } from "@/types/admin";

export interface ContactInfo {
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  address: string;
  socials: FooterSocial[];
}

const toTelHref = (phone: string): string => {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
};

/**
 * Mağazanın iletişim bilgileri tek merkezden (Footer & İletişim ayarları) beslenir.
 * Footer, kargo takip, bakım ekranı ve yasal metinler bu kancayı kullanır.
 */
export function useContactInfo(): ContactInfo {
  const settings = useFooterSettings();

  return useMemo(
    () => ({
      phone: settings.phone,
      phoneHref: toTelHref(settings.phone),
      email: settings.email,
      emailHref: settings.email ? `mailto:${settings.email}` : "",
      address: settings.address,
      socials: settings.socials.filter((social) => social.url.trim().length > 0),
    }),
    [settings],
  );
}