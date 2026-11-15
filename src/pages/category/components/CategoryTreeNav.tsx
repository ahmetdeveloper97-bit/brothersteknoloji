import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { StoreCategoryNode } from "@/hooks/useStoreCategories";

interface CategoryTreeNavProps {
  roots: StoreCategoryNode[];
  activeId?: string;
  totalCount: number;
  /** Kategori id -> ürün sayısı (alt kategoriler dahil) */
  counts: Record<string, number>;
}

const rowBase =
  "flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors";

export default function CategoryTreeNav({ roots, activeId, totalCount, counts }: CategoryTreeNavProps) {
  const activeRoot = roots.find(
    (root) => root.id === activeId || root.children.some((child) => child.id === activeId)
  );

  const [openIds, setOpenIds] = useState<string[]>(() => (activeRoot ? [activeRoot.id] : []));

  useEffect(() => {
    if (!activeRoot) return;
    setOpenIds((current) => (current.includes(activeRoot.id) ? current : [...current, activeRoot.id]));
  }, [activeRoot]);

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="rounded-xl border border-background-200 bg-background-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-sm font-bold text-foreground-950">Kategoriler</h2>
        <span className="text-[11px] text-foreground-400">{roots.length} ana kategori</span>
      </div>

      <ul className="space-y-0.5">
        <li>
          <Link
            to="/kategoriler"
            className={`${rowBase} ${
              !activeId
                ? "bg-primary-100 font-semibold text-primary-900"
                : "text-foreground-700 hover:bg-background-100"
            }`}
          >
            <span className="min-w-0 flex-1 truncate">Tüm Ürünler</span>
            <span className="shrink-0 text-[11px] font-medium text-foreground-400">{totalCount}</span>
          </Link>
        </li>

        {roots.map((root) => {
          const open = openIds.includes(root.id);
          const rootActive = root.id === activeId;
          const hasChildren = root.children.length > 0;
          const childActive = root.children.some((child) => child.id === activeId);

          return (
            <li key={root.id}>
              <div
                className={`flex items-center gap-1 rounded-md ${
                  rootActive ? "bg-primary-100" : childActive ? "bg-background-100" : ""
                }`}
              >
                <Link
                  to={`/kategoriler/${root.slug}`}
                  className={`min-w-0 flex-1 cursor-pointer truncate px-2.5 py-2 text-sm transition-colors ${
                    rootActive
                      ? "font-semibold text-primary-900"
                      : childActive
                        ? "font-medium text-foreground-900"
                        : "text-foreground-700 hover:text-foreground-950"
                  }`}
                >
                  {root.name}
                </Link>
                <span className="shrink-0 text-[11px] text-foreground-400">
                  {(counts[root.id] ?? 0) > 0 ? counts[root.id] : null}
                </span>
                {hasChildren && (
                  <button
                    type="button"
                    onClick={() => toggle(root.id)}
                    aria-label={`${root.name} alt kategorilerini ${open ? "kapat" : "aç"}`}
                    aria-expanded={open}
                    className="mr-1 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-background-200 hover:text-foreground-900"
                  >
                    <i className={`text-sm ${open ? "ri-subtract-line" : "ri-add-line"}`} />
                  </button>
                )}
              </div>

              {hasChildren && open && (
                <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-background-200 pl-2">
                  {root.children.map((child) => {
                    const isActive = child.id === activeId;
                    return (
                      <li key={child.id}>
                        <Link
                          to={`/kategoriler/${child.slug}`}
                          className={`${rowBase} text-[13px] ${
                            isActive
                              ? "bg-primary-50 font-semibold text-primary-900"
                              : "text-foreground-600 hover:bg-background-100 hover:text-foreground-900"
                          }`}
                        >
                          <span className="min-w-0 flex-1 truncate">{child.name}</span>
                          <span className="shrink-0 text-[11px] text-foreground-400">
                            {(counts[child.id] ?? 0) > 0 ? counts[child.id] : null}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}