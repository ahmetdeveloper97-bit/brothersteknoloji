import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "@/components/base/ConfirmDialog";
import { Banner, Kpi, Panel, Pill, inputClass } from "@/components/base/AdminUI";
import PageFormModal from "@/pages/admin/pages/PageFormModal";
import {
  adminDeletePage,
  adminListPages,
  adminSavePage,
  formatPageDate,
} from "@/lib/sitePages";
import type { SitePage, SitePageInput } from "@/types/sitePage";

const basePath = __BASE_PATH__.endsWith("/") ? __BASE_PATH__ : `${__BASE_PATH__}/`;
const pageHref = (slug: string): string => `${basePath}sayfa/${slug}`;

const toInput = (page: SitePage, status: SitePage["status"]): SitePageInput => ({
  id: page.id,
  slug: page.slug,
  title: page.title,
  subtitle: page.subtitle,
  coverImage: page.coverImage,
  sections: page.sections,
  seoTitle: page.seoTitle,
  seoDescription: page.seoDescription,
  status,
  showInFooter: page.showInFooter,
  sortOrder: page.sortOrder,
});

export default function PagesPanel() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SitePage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SitePage | null>(null);
  const [busyId, setBusyId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const result = await adminListPages();
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Sayfalar yüklenemedi.");
      setPages([]);
      return;
    }
    setPages(result.pages);
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("tr");
    if (!query) return pages;
    return pages.filter(
      (page) =>
        page.title.toLocaleLowerCase("tr").includes(query) ||
        page.slug.toLocaleLowerCase("tr").includes(query),
    );
  }, [pages, search]);

  const published = pages.filter((page) => page.status === "published").length;
  const drafts = pages.length - published;
  const footerCount = pages.filter((page) => page.status === "published" && page.showInFooter).length;

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (page: SitePage) => {
    setEditing(page);
    setFormOpen(true);
  };

  const handleSaved = (page: SitePage, isNew: boolean) => {
    setPages((current) => {
      const next = isNew ? [page, ...current] : current.map((item) => (item.id === page.id ? page : item));
      return next;
    });
    setFormOpen(false);
    setEditing(null);
    setNotice(isNew ? "Sayfa oluşturuldu." : "Sayfa güncellendi.");
    void load();
  };

  const toggleStatus = async (page: SitePage) => {
    setBusyId(page.id);
    const nextStatus = page.status === "published" ? "draft" : "published";
    const result = await adminSavePage(toInput(page, nextStatus));
    setBusyId("");
    if (!result.ok) {
      setNotice(result.message ?? "Durum değiştirilemedi.");
      return;
    }
    setNotice(nextStatus === "published" ? "Sayfa yayına alındı." : "Sayfa taslağa alındı.");
    void load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    const result = await adminDeletePage(deleteTarget.id);
    setBusyId("");
    setDeleteTarget(null);
    if (!result.ok) {
      setNotice(result.message ?? "Sayfa silinemedi.");
      return;
    }
    setNotice("Sayfa silindi.");
    void load();
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}${pageHref(slug)}`;
    try {
      await navigator.clipboard.writeText(url);
      setNotice("Sayfa bağlantısı kopyalandı.");
    } catch {
      setNotice(`Bağlantı: ${url}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon="ri-pages-line" label="Toplam sayfa" value={String(pages.length)} hint="Taslak + yayında" tone="info" />
        <Kpi icon="ri-global-line" label="Yayında" value={String(published)} hint="Ziyaretçilere açık" tone="success" />
        <Kpi icon="ri-draft-line" label="Taslak" value={String(drafts)} hint="Yalnızca panelde görünür" tone="warning" />
        <Kpi icon="ri-layout-bottom-line" label="Footer bağlantısı" value={String(footerCount)} hint="Alt bilgide listelenir" tone="neutral" />
      </div>

      {notice && <Banner tone="success" onClose={() => setNotice("")}>{notice}</Banner>}

      {error && (
        <Banner tone="danger">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void load()}
              className="cursor-pointer whitespace-nowrap rounded-md border border-current px-2 py-1 text-[11px] font-semibold"
            >
              Tekrar dene
            </button>
          </div>
        </Banner>
      )}

      <Panel
        title="Site Sayfaları"
        subtitle="Hakkımızda, teslimat, garanti gibi kurumsal sayfaları buradan oluşturun"
        icon="ri-pages-line"
        padded={false}
        action={
          <button
            type="button"
            onClick={openNew}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-add-line" />
            Yeni Sayfa
          </button>
        }
      >
        <div className="border-b border-background-200 px-4 py-3 md:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Sayfa başlığı veya adres ara..."
                className={`${inputClass} pl-9`}
              />
            </div>
            <button
              type="button"
              onClick={() => void load()}
              className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              <i className="ri-refresh-line" />
              Yenile
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-14 text-sm text-foreground-500">
            <i className="ri-loader-4-line animate-spin text-lg" />
            Sayfalar yükleniyor...
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-100 text-foreground-400">
              <i className="ri-file-add-line text-2xl" />
            </span>
            <p className="mt-3 font-heading text-sm font-bold text-foreground-950">
              {pages.length === 0 ? "Henüz sayfa oluşturulmadı" : "Aramanıza uygun sayfa yok"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-foreground-500">
              {pages.length === 0
                ? "Kurumsal sayfalarınızı oluşturarak menüden ve footer'dan bağlantı verebilirsiniz."
                : "Farklı bir kelimeyle aramayı deneyin veya yeni bir sayfa oluşturun."}
            </p>
            {pages.length === 0 && (
              <button
                type="button"
                onClick={openNew}
                className="mt-4 inline-flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-add-line" />
                İlk sayfayı oluştur
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-background-200">
            {filtered.map((page) => (
              <div key={page.id} className="flex flex-col gap-3 px-4 py-3.5 md:flex-row md:items-center md:px-5">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-100 text-foreground-500">
                    {page.coverImage ? (
                      <img src={page.coverImage} alt="" className="h-full w-full object-top" />
                    ) : (
                      <i className="ri-file-text-line text-lg" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground-950">{page.title}</p>
                      <Pill tone={page.status === "published" ? "success" : "warning"}>
                        <i className={page.status === "published" ? "ri-global-line" : "ri-draft-line"} />
                        {page.status === "published" ? "Yayında" : "Taslak"}
                      </Pill>
                      {page.showInFooter && page.status === "published" && (
                        <Pill tone="info">
                          <i className="ri-layout-bottom-line" />
                          Footer
                        </Pill>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-foreground-500">
                      /sayfa/{page.slug} · {page.sections.length} blok · {formatPageDate(page.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => void toggleStatus(page)}
                    disabled={busyId === page.id}
                    className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg border border-background-300 px-2.5 text-[11px] font-medium text-foreground-700 hover:bg-background-100 disabled:opacity-50"
                  >
                    <i className={page.status === "published" ? "ri-eye-off-line" : "ri-send-plane-line"} />
                    {page.status === "published" ? "Taslağa al" : "Yayınla"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void copyLink(page.slug)}
                    aria-label="Bağlantıyı kopyala"
                    title="Bağlantıyı kopyala"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-100"
                  >
                    <i className="ri-link" />
                  </button>
                  {page.status === "published" && (
                    <a
                      href={pageHref(page.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Sayfayı önizle"
                      title="Sayfayı önizle"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-background-100"
                    >
                      <i className="ri-external-link-line" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(page)}
                    className="flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg bg-primary-50 px-2.5 text-[11px] font-semibold text-primary-900 hover:bg-primary-100"
                  >
                    <i className="ri-edit-line" />
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(page)}
                    aria-label="Sayfayı sil"
                    title="Sayfayı sil"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-background-300 text-foreground-600 hover:bg-secondary-50 hover:text-secondary-800"
                  >
                    <i className="ri-delete-bin-6-line" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <PageFormModal
        open={formOpen}
        page={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Sayfayı sil"
        subtitle={deleteTarget?.title}
        confirmLabel="Sayfayı sil"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        footnote="Sayfa yayındaysa bağlantısı anında devre dışı kalır. Bu işlem geri alınamaz."
      >
        <p className="text-xs leading-relaxed text-foreground-700">
          <strong className="font-semibold">/sayfa/{deleteTarget?.slug}</strong> adresindeki sayfa ve tüm içerik blokları
          kalıcı olarak silinecek.
        </p>
      </ConfirmDialog>
    </div>
  );
}