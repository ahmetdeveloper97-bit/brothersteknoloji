import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import { useContactInfo } from "@/hooks/useContactInfo";
import { usePublicPages } from "@/hooks/usePublicPages";
import { fetchPublicPage, formatPageDate } from "@/lib/sitePages";
import type { SitePage } from "@/types/sitePage";

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

export default function SitePageView() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [page, setPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const allPages = usePublicPages();
  const contact = useContactInfo();

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      const result = await fetchPublicPage(slug);
      if (!active) return;
      setLoading(false);
      if (!result.ok || !result.page) {
        setPage(null);
        setError(result.code === "not_found" ? "Sayfa bulunamadı veya yayından kaldırılmış." : result.message ?? "Sayfa yüklenemedi.");
        return;
      }
      setPage(result.page);
    };

    if (slug) void load();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!page) return;
    const previousTitle = document.title;
    document.title = `${page.seoTitle || page.title} | Brothers Teknoloji`;
    setMetaDescription(page.seoDescription || page.subtitle);
    return () => {
      document.title = previousTitle;
    };
  }, [page]);

  const others = useMemo(() => allPages.filter((item) => item.slug !== slug).slice(0, 6), [allPages, slug]);

  if (loading) {
    return (
      <StoreLayout>
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-center gap-2 px-4 py-24 text-sm text-foreground-500">
          <i className="ri-loader-4-line animate-spin text-lg" />
          Sayfa yükleniyor...
        </div>
      </StoreLayout>
    );
  }

  if (error || !page) {
    return (
      <StoreLayout>
        <div className="mx-auto w-full max-w-[1320px] px-4 py-20">
          <div className="mx-auto max-w-md rounded-2xl border border-background-200 bg-background-50 p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-foreground-400">
              <i className="ri-file-search-line text-2xl" />
            </span>
            <h1 className="mt-4 font-heading text-lg font-bold text-foreground-950">Sayfa açılamadı</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">{error || "Aradığınız sayfa bulunamadı."}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/"
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-home-5-line" />
                Anasayfaya dön
              </Link>
              <Link
                to="/kategoriler"
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
              >
                <i className="ri-layout-grid-line" />
                Kategoriler
              </Link>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-7 md:py-9">
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] text-foreground-500">
            <Link to="/" className="hover:text-foreground-900">
              Anasayfa
            </Link>
            <i className="ri-arrow-right-s-line" />
            <span className="font-semibold text-foreground-800">{page.title}</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">{page.title}</h1>
          {page.subtitle && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground-600">{page.subtitle}</p>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-foreground-500">
            <i className="ri-refresh-line" />
            Son güncelleme: {formatPageDate(page.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0 space-y-6">
            {page.coverImage && (
              <div className="h-[220px] w-full overflow-hidden rounded-xl border border-background-200 bg-background-100 md:h-[320px]">
                <img src={page.coverImage} alt={`${page.title} kapak görseli`} title={`${page.title} Brothers Teknoloji`} className="h-full w-full object-top" />
              </div>
            )}

            <div className="rounded-xl border border-background-200 bg-background-50 p-5 md:p-7">
              {page.sections.length === 0 ? (
                <p className="text-sm leading-relaxed text-foreground-700">{page.subtitle}</p>
              ) : (
                <div className="space-y-7">
                  {page.sections.map((section, index) => (
                    <section key={section.id} className={index > 0 ? "border-t border-background-200 pt-7" : ""}>
                      {section.heading && (
                        <h2 className="mb-2 font-heading text-base font-bold text-foreground-950 md:text-lg">
                          {section.heading}
                        </h2>
                      )}
                      {section.body && (
                        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground-700">{section.body}</p>
                      )}
                      {section.bullets.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-foreground-700">
                          {section.bullets.map((bullet, bulletIndex) => (
                            <li key={`${section.id}-${bulletIndex}`} className="flex items-start gap-2">
                              <i className="ri-checkbox-circle-line mt-0.5 text-base text-accent-600" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.image && (
                        <div className="mt-4 h-[200px] w-full overflow-hidden rounded-lg border border-background-200 bg-background-100 md:h-[280px]">
                          <img
                            src={section.image}
                            alt={section.heading || page.title}
                            title={`${section.heading || page.title} Brothers Teknoloji`}
                            className="h-full w-full object-top"
                          />
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
            </div>
          </article>

          <aside className="h-fit space-y-4 lg:sticky lg:top-[278px]">
            {others.length > 0 && (
              <div className="rounded-xl border border-background-200 bg-background-50 p-3">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                  Diğer sayfalar
                </p>
                <div className="space-y-1">
                  {others.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/sayfa/${item.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground-700 transition-colors hover:bg-background-100 hover:text-foreground-950"
                    >
                      <i className="ri-file-text-line text-base text-foreground-400" />
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      <i className="ri-arrow-right-s-line text-foreground-300" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground-900">
                <i className="ri-customer-service-2-line text-base text-primary-700" />
                Yardım mı gerekiyor?
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
                Sipariş, teslimat ve garanti süreçleriyle ilgili sorularınız için destek ekibimize
                <Link to="/kargo-takip" className="mx-1 font-semibold text-primary-800 underline decoration-dotted">
                  kargo takip
                </Link>
                ekranından ulaşabilirsiniz.
              </p>
              <a
                href={contact.emailHref || "mailto:destek@brothersteknoloji.com"}
                className="mt-3 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 text-xs font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-mail-send-line" />
                Bize yazın
              </a>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}