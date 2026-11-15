import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import FaqAccordion from "@/pages/faq/components/FaqAccordion";
import FaqSidebar from "@/pages/faq/components/FaqSidebar";
import { useContactInfo } from "@/hooks/useContactInfo";
import { faqCategories, faqItems } from "@/mocks/faqs";

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

const normalize = (value: string): string => value.toLocaleLowerCase("tr").trim();

export default function FaqPage() {
  const contact = useContactInfo();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Sıkça Sorulan Sorular | Brothers Teknoloji";
    setMetaDescription(
      "Sipariş, ödeme, kargo, iade, garanti ve teknik destek hakkında en sık sorulan soruların yanıtları. Aradığınızı bulamazsanız numaralı destek talebi oluşturun.",
    );
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-structured-data";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById("faq-structured-data")?.remove();
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = normalize(query);
    return faqItems.filter((item) => {
      const matchCategory = categoryId === "all" || item.categoryId === categoryId;
      if (!matchCategory) return false;
      if (!needle) return true;
      const haystack = normalize(`${item.question} ${item.answer} ${item.keywords.join(" ")}`);
      return haystack.includes(needle);
    });
  }, [query, categoryId]);

  const groups = useMemo(
    () =>
      faqCategories
        .map((category) => ({
          category,
          items: filtered.filter((item) => item.categoryId === category.id),
        }))
        .filter((group) => group.items.length > 0),
    [filtered],
  );

  const featured = useMemo(() => faqItems.filter((item) => item.featured), []);
  const activeCategory = faqCategories.find((category) => category.id === categoryId);

  const openQuestion = (id: string) => {
    setQuery("");
    setCategoryId("all");
    setOpenId(id);
    window.setTimeout(() => {
      document.getElementById(`faq-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const resetFilters = () => {
    setQuery("");
    setCategoryId("all");
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
            <span className="font-semibold text-foreground-800">Sıkça Sorulan Sorular</span>
          </nav>
          <h1 className="mt-2 font-heading text-2xl font-bold text-foreground-950 md:text-3xl">
            Sıkça sorulan sorular
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-foreground-600">
            Sipariş, ödeme, kargo, iade, garanti ve teknik konularda en çok merak edilen soruları tek sayfada
            topladık. Aradığınız yanıtı bulamazsanız alttaki destek kanallarından bize ulaşabilirsiniz.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
              <i className="ri-question-line" />
              {faqItems.length} soru, {faqCategories.length} kategori
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-300 bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-900">
              <i className="ri-time-line" />
              Ortalama yanıt: 4 saat
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] font-semibold text-foreground-700">
              <i className="ri-arrow-go-back-line" />
              14 gün cayma hakkı
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-4">
            <div className="rounded-xl border border-background-200 bg-background-50 p-4">
              <label htmlFor="faq-search" className="sr-only">
                Sorularda ara
              </label>
              <div className="relative">
                <i className="ri-search-line pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-foreground-400" />
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Sorularda ara: iade, kargo, garanti, taksit..."
                  className="h-11 w-full box-border rounded-lg border border-background-300 bg-background-50 pl-10 pr-10 text-sm text-foreground-900 outline-none transition-colors placeholder:text-foreground-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Aramayı temizle"
                    className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-foreground-400 hover:bg-background-100 hover:text-foreground-800"
                  >
                    <i className="ri-close-line text-base" />
                  </button>
                )}
              </div>

              <div className="mt-3 inline-flex w-full flex-wrap gap-1 rounded-xl border border-background-200 bg-background-100 p-1">
                <button
                  type="button"
                  onClick={() => setCategoryId("all")}
                  className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    categoryId === "all"
                      ? "bg-primary-800 text-background-50"
                      : "text-foreground-600 hover:bg-background-50 hover:text-foreground-950"
                  }`}
                >
                  <i className="ri-apps-2-line text-sm" />
                  Tümü
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold ${
                      categoryId === "all" ? "bg-background-50/25" : "bg-background-200 text-foreground-500"
                    }`}
                  >
                    {faqItems.length}
                  </span>
                </button>
                {faqCategories.map((category) => {
                  const count = faqItems.filter((item) => item.categoryId === category.id).length;
                  const active = categoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setCategoryId(category.id)}
                      className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? "bg-primary-800 text-background-50"
                          : "text-foreground-600 hover:bg-background-50 hover:text-foreground-950"
                      }`}
                    >
                      <i className={`${category.icon} text-sm`} />
                      {category.label}
                      <span
                        className={`rounded-full px-1.5 text-[10px] font-bold ${
                          active ? "bg-background-50/25" : "bg-background-200 text-foreground-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {(query || categoryId !== "all") && (
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground-500">
                  <p>
                    <strong className="font-semibold text-foreground-900">{filtered.length}</strong> sonuç
                    {query ? (
                      <>
                        {" "}
                        — “<span className="font-medium text-foreground-800">{query}</span>”
                      </>
                    ) : null}
                    {activeCategory ? ` · ${activeCategory.label}` : ""}
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex cursor-pointer items-center gap-1 whitespace-nowrap font-semibold text-primary-800 hover:text-primary-600"
                  >
                    <i className="ri-refresh-line" />
                    Filtreleri temizle
                  </button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-background-200 bg-background-50 px-6 py-12 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-foreground-400">
                  <i className="ri-search-eye-line text-2xl" />
                </span>
                <p className="mt-3 font-heading text-base font-bold text-foreground-950">
                  Bu aramaya uygun soru bulunamadı
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-foreground-600">
                  Farklı bir kelime deneyebilir veya sorunuzu doğrudan destek ekibimize iletebilirsiniz.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-semibold text-foreground-700 hover:bg-background-100"
                  >
                    <i className="ri-refresh-line" />
                    Tüm soruları göster
                  </button>
                  <Link
                    to="/destek"
                    className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
                  >
                    <i className="ri-ticket-2-line" />
                    Destek talebi oluştur
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {groups.map((group) => (
                  <section key={group.category.id}>
                    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-100 text-primary-800">
                          <i className={`${group.category.icon} text-base`} />
                        </span>
                        <div className="min-w-0">
                          <h2 className="font-heading text-sm font-bold text-foreground-950">{group.category.label}</h2>
                          <p className="text-[11px] text-foreground-500">{group.category.description}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-background-100 px-2 py-0.5 text-[10px] font-semibold text-foreground-500">
                        {group.items.length} soru
                      </span>
                    </div>
                    <FaqAccordion
                      items={group.items}
                      openId={openId}
                      onToggle={(id) => setOpenId((current) => (current === id ? null : id))}
                    />
                  </section>
                ))}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-primary-200 bg-primary-50">
              <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                <div className="min-w-0">
                  <p className="font-heading text-base font-bold text-primary-900 dark:text-primary-950">
                    Cevabını bulamadığınız bir konu mu var?
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-primary-900/80 dark:text-primary-950/80">
                    Talebinizi ekran görüntüsü veya dosya ekleyerek iletin. Numaranızla süreci adım adım takip edin.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to="/destek"
                    className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
                  >
                    <i className="ri-ticket-2-line" />
                    Destek talebi
                  </Link>
                  <Link
                    to="/iletisim"
                    className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-300 bg-background-50 px-4 text-xs font-semibold text-primary-900 hover:bg-primary-100 dark:text-primary-950"
                  >
                    <i className="ri-mail-line" />
                    İletişim
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <FaqSidebar featured={featured} contact={contact} onOpenQuestion={openQuestion} />
        </div>
      </div>
    </StoreLayout>
  );
}