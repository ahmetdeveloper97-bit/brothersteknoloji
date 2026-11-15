import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/base/Logo";
import PaymentBadges from "@/components/base/PaymentBadges";
import EtbisBadge from "@/components/base/EtbisBadge";
import { useEtbisSettings } from "@/hooks/useEtbisSettings";
import { useFooterSettings } from "@/hooks/useFooterSettings";
import { usePublicPages } from "@/hooks/usePublicPages";
import { useStoreCategories } from "@/hooks/useStoreCategories";
import { socialMeta } from "@/lib/siteSettings";

const isInternal = (url: string): boolean => url.startsWith("/");

function FooterAnchor({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  if (!url) return <span className={className}>{children}</span>;
  if (isInternal(url)) {
    return (
      <Link to={url} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={url}
      target={url.startsWith("http") ? "_blank" : undefined}
      rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
      className={className}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { roots } = useStoreCategories();
  const etbis = useEtbisSettings();
  const settings = useFooterSettings();
  const sitePages = usePublicPages().filter((page) => page.showInFooter);
  const gridCols = settings.groups.length >= 4 ? "lg:grid-cols-6" : "lg:grid-cols-5";
  const bottomLinks = [
    ...settings.bottomLinks,
    ...sitePages.map((page) => ({ id: `page-${page.slug}`, label: page.title, url: `/sayfa/${page.slug}` })),
  ];

  return (
    <footer className="mt-12 border-t border-background-200 bg-background-100">
      <div
        className={`mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 ${gridCols}`}
      >
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-600">{settings.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground-700">
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="flex cursor-pointer items-center gap-2 hover:text-foreground-950"
              >
                <i className="ri-phone-line text-base" />
                {settings.phone}
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="flex cursor-pointer items-center gap-2 hover:text-foreground-950"
              >
                <i className="ri-mail-line text-base" />
                {settings.email}
              </a>
            )}
            {settings.trackingUrl && (
              <FooterAnchor
                url={settings.trackingUrl}
                className="flex cursor-pointer items-center gap-2 hover:text-foreground-950"
              >
                <i className="ri-truck-line text-base" />
                {settings.trackingLabel}
              </FooterAnchor>
            )}
          </div>

          {settings.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex max-w-sm cursor-pointer items-start gap-2 text-sm leading-relaxed text-foreground-700 hover:text-foreground-950"
            >
              <i className="ri-map-pin-line mt-0.5 text-base" />
              <span>{settings.address}</span>
            </a>
          )}

          {settings.socials.some((social) => social.url.trim().length > 0) && (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                Bizi takip edin
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {settings.socials
                  .filter((social) => social.url.trim().length > 0)
                  .map((social) => {
                    const meta = socialMeta(social.platform);
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={meta.label}
                        title={meta.label}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-background-300 bg-background-50 text-foreground-600 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-800"
                      >
                        <i className={`${meta.icon} text-base`} />
                      </a>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
              Güvenli ödeme yöntemleri
            </p>
            <PaymentBadges size="sm" />
          </div>
          {settings.trustNote && (
            <p className="mt-4 flex items-center gap-2 text-xs text-accent-700">
              <i className="ri-verified-badge-line text-base" />
              {settings.trustNote}
            </p>
          )}
          {etbis.enabled && (
            <div className="mt-4 flex">
              <EtbisBadge settings={etbis} />
            </div>
          )}
        </div>

        {settings.groups.map((group) => {
          const items =
            group.useCategoryLinks && roots.length > 0
              ? roots.slice(0, 6).map((category) => ({
                  id: category.slug,
                  label: category.name,
                  to: `/kategoriler/${category.slug}`,
                }))
              : group.links.map((link) => ({ id: link.id, label: link.label, to: link.url }));

          return (
            <div key={group.id}>
              <h4 className="mb-4 font-heading text-sm font-bold text-foreground-950">
                <a href="#footer" className="hover:text-accent-700">
                  {group.title}
                </a>
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <FooterAnchor
                      url={item.to}
                      className="cursor-pointer text-sm text-foreground-600 transition-colors hover:text-foreground-950"
                    >
                      {item.label}
                    </FooterAnchor>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="border-t border-background-200">
        <div className="mx-auto flex w-full max-w-[1320px] flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-foreground-500 sm:flex-row">
          <p className="text-center sm:text-left">
            {settings.copyrightText}
            {settings.providerLabel && (
              <>
                {" · Infrastructure Provider "}
                <a
                  href={settings.providerUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer font-medium text-foreground-600 underline-offset-2 transition-colors hover:text-accent-700 hover:underline"
                >
                  {settings.providerLabel}
                </a>
              </>
            )}
          </p>
          {bottomLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {bottomLinks.map((link, index) => (
                <span key={link.id} className="flex items-center gap-3">
                  {index > 0 && <span className="h-3 w-px bg-background-300" />}
                  <FooterAnchor
                    url={link.url}
                    className="cursor-pointer whitespace-nowrap hover:text-foreground-900"
                  >
                    {link.label}
                  </FooterAnchor>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}