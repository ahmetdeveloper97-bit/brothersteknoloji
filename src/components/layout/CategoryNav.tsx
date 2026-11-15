import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStoreCategories } from "@/hooks/useStoreCategories";

interface QuickLink {
  key: string;
  label: string;
  to: string;
}

/** Üst menüde öne çıkan ana kategoriler (önce tedarikte güçlü olduğumuz başlıklar). */
const PRIORITY_SLUGS = [
  "ag-urunleri",
  "kurumsal-urunler",
  "guvenlik-sistemleri",
  "kisisel-bilgisayarlar",
  "cevre-birimleri",
  "tuketici-elektronigi",
];

export default function CategoryNav() {
  const [openCats, setOpenCats] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(99);
  const { roots } = useStoreCategories();

  const navRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo<QuickLink[]>(() => {
    const prioritized = PRIORITY_SLUGS.map((slug) => roots.find((root) => root.slug === slug)).filter(
      (root): root is (typeof roots)[number] => Boolean(root),
    );
    const rest = roots.filter((root) => !PRIORITY_SLUGS.includes(root.slug));
    const ordered = [...prioritized, ...rest];

    return [
      { key: "home", label: "Anasayfa", to: "/" },
      ...ordered.map((root) => ({
        key: root.id,
        label: root.name,
        to: `/kategoriler/${root.slug}`,
      })),
    ];
  }, [roots]);

  useLayoutEffect(() => {
    const navEl = navRef.current;
    const measureEl = measureRef.current;
    if (!navEl || !measureEl) return undefined;

    const compute = () => {
      const available = navEl.clientWidth;
      if (!available) return;
      const children = Array.from(measureEl.children) as HTMLElement[];
      if (children.length === 0) return;

      let total = 0;
      let count = 0;

      for (let index = 0; index < children.length; index += 1) {
        const width = children[index].offsetWidth + 2;
        if (total + width <= available) {
          total += width;
          count += 1;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(navEl);
    window.addEventListener("resize", compute);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(compute).catch(() => undefined);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [items]);

  const closeMenu = () => {
    setOpenCats(false);
    setExpandedId(null);
  };

  const safeCount = Math.min(visibleCount, items.length);
  const visibleItems = items.slice(0, safeCount);

  return (
    <div className="relative hidden w-full border-b border-background-200 bg-background-100 lg:block">
      {openCats && (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={closeMenu}
          className="fixed inset-0 top-[234px] z-20 cursor-default"
        />
      )}

      <div className="mx-auto flex h-14 w-full max-w-[1320px] items-center gap-3 px-4">
        <div className="relative z-30 shrink-0">
          <button
            type="button"
            onClick={() => {
              setOpenCats((value) => !value);
              setExpandedId(null);
            }}
            className="flex h-10 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 px-3.5 text-sm font-medium text-background-50 shadow-sm transition-all duration-200 hover:from-primary-700 hover:to-primary-500"
          >
            <i className="ri-menu-unfold-line text-base" />
            <span className="whitespace-nowrap">Tüm Kategoriler</span>
            <i className={`ri-arrow-down-s-line transition-transform ${openCats ? "rotate-180" : ""}`} />
          </button>

          {openCats && (
            <div className="absolute left-0 top-12 z-40 max-h-[70vh] w-[340px] overflow-y-auto rounded-xl border border-background-200 bg-background-50 py-2 shadow-xl animate-fadeUp">
              {roots.map((category) => {
                const expanded = expandedId === category.id;
                const hasChildren = category.children.length > 0;
                return (
                  <div key={category.id} className="px-1">
                    <div
                      className={`flex items-center gap-2 rounded-lg pl-3 pr-1 transition-colors ${
                        expanded ? "bg-background-100" : "hover:bg-background-100"
                      }`}
                    >
                      <Link
                        to={`/kategoriler/${category.slug}`}
                        onClick={closeMenu}
                        className="flex min-w-0 flex-1 items-center gap-3 py-2.5 text-sm font-medium text-foreground-800 hover:text-foreground-950"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-100">
                          <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{category.name}</span>
                      </Link>
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : category.id)}
                          aria-label={`${category.name} alt kategorilerini ${expanded ? "kapat" : "aç"}`}
                          aria-expanded={expanded}
                          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-200 hover:text-foreground-900"
                        >
                          <i className={`text-sm ${expanded ? "ri-arrow-down-s-line" : "ri-arrow-right-s-line"}`} />
                        </button>
                      ) : (
                        <span className="h-7 w-7 shrink-0" />
                      )}
                    </div>
                    {hasChildren && expanded && (
                      <div className="mb-1 ml-11 space-y-0.5 border-l border-background-200 py-1 pl-2">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/kategoriler/${child.slug}`}
                            onClick={closeMenu}
                            className="block truncate rounded-md px-2 py-1.5 text-xs text-foreground-600 transition-colors hover:bg-background-100 hover:text-foreground-950"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {roots.length === 0 && (
                <p className="px-4 py-6 text-center text-xs text-foreground-500">Yayında kategori bulunmuyor.</p>
              )}
            </div>
          )}
        </div>

        <nav ref={navRef} className="relative flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
          {visibleItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-medium text-foreground-700 transition-colors hover:bg-background-200 hover:text-foreground-950"
            >
              {item.label}
            </Link>
          ))}

          <div
            ref={measureRef}
            aria-hidden="true"
            className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-0.5 whitespace-nowrap"
          >
            {items.map((item) => (
              <span
                key={`measure-${item.key}`}
                className="shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-medium"
              >
                {item.label}
              </span>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/pc-toplama"
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1.5 text-[13px] font-semibold text-primary-800 transition-colors hover:bg-primary-100 xl:flex"
          >
            <i className="ri-cpu-line" />
            Sistem Toplama
          </Link>
          <Link
            to="/kampanyalar"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-accent-700 transition-colors hover:bg-accent-50"
          >
            <i className="ri-flashlight-line" />
            Fırsat Ürünleri
          </Link>
        </div>
      </div>
    </div>
  );
}