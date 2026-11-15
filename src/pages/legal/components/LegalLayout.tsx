import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";

export const legalLinks = [
  { to: "/gizlilik-politikasi", label: "Gizlilik Politikası", icon: "ri-shield-user-line" },
  { to: "/cerez-politikasi", label: "Çerez Politikası", icon: "ri-shield-keyhole-line" },
];

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  updatedAt: string;
  children: ReactNode;
}

export default function LegalLayout({ title, subtitle, updatedAt, children }: LegalLayoutProps) {
  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 md:py-9">
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-500">
            <Link to="/" className="hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="font-semibold text-foreground-800">{title}</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground-600">{subtitle}</p>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-foreground-500">
            <i className="ri-refresh-line" />
            Son güncelleme: {updatedAt}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-background-200 bg-background-50 p-3 lg:sticky lg:top-[278px]">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
              Yasal metinler
            </p>
            <div className="space-y-1">
              {legalLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-primary-50 font-semibold text-primary-900"
                        : "text-foreground-700 hover:bg-background-100"
                    }`
                  }
                >
                  <i className={`${item.icon} text-base`} />
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-background-100 p-3">
              <p className="text-[11px] leading-relaxed text-foreground-600">
                Sorularınız için
                <a href="mailto:kvkk@brothersteknoloji.com" className="mt-1 block font-semibold text-primary-800 underline decoration-dotted">
                  kvkk@brothersteknoloji.com
                </a>
              </p>
            </div>
          </aside>

          <article className="min-w-0 rounded-xl border border-background-200 bg-background-50 p-5 md:p-7">
            <div className="legal-content space-y-5 text-sm leading-relaxed text-foreground-700">{children}</div>
          </article>
        </div>
      </div>
    </StoreLayout>
  );
}