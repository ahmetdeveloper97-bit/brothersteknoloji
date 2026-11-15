import { useCallback, useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Panel } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import { ADMIN_STORE_KEYS, categoryHasChildren, formatNumberTr, loadCategories } from "@/lib/adminStore";
import { products } from "@/lib/catalog";
import type { AdminCategory } from "@/types/admin";
import CategoryFormModal from "@/pages/admin/categories/CategoryFormModal";
import CategoryTable from "@/pages/admin/categories/CategoryTable";
import type { CategoryRow } from "@/pages/admin/categories/CategoryTable";

type Filter = "all" | "active" | "passive" | "home";

const emptyCategory: AdminCategory = {
  id: "",
  name: "",
  slug: "",
  parent: null,
  description: "",
  seoTitle: "",
  seoDescription: "",
  productCount: 0,
  order: 1,
  active: true,
  showOnHome: false,
};

const parentKey = (category: AdminCategory): string => category.parent ?? "";

export default function CategoriesPanel() {
  const [categories, setCategories] = usePersistentState<AdminCategory[]>(
    ADMIN_STORE_KEYS.categories,
    loadCategories()
  );
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [formState, setFormState] = useState<{ draft: AdminCategory; isNew: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [undoState, setUndoState] = useState<{ categories: AdminCategory[]; label: string } | null>(null);

  const remember = (label: string) => {
    setUndoState({ categories, label });
  };

  const undoLastAction = () => {
    if (!undoState) return;
    setCategories(undoState.categories);
    setSelected([]);
    setUndoState(null);
  };

  const roots = useMemo(
    () => categories.filter((category) => !category.parent).sort((a, b) => a.order - b.order),
    [categories]
  );

  const childrenOf = (id: string) =>
    categories.filter((category) => category.parent === id).sort((a, b) => a.order - b.order);

  const countOf = useCallback(
    (category: AdminCategory): number => {
      const own = new Map<string, number>();
      products.forEach((product) => {
        own.set(product.category, (own.get(product.category) ?? 0) + 1);
      });
      const sum = (id: string): number =>
        (own.get(id) ?? 0) +
        categories
          .filter((item) => item.parent === id)
          .reduce((total, child) => total + sum(child.id), 0);
      return sum(category.id);
    },
    [categories]
  );

  const matches = (category: AdminCategory) => {
    const term = search.trim().toLocaleLowerCase("tr");
    if (term && !`${category.name} ${category.slug}`.toLocaleLowerCase("tr").includes(term)) return false;
    if (filter === "active") return category.active;
    if (filter === "passive") return !category.active;
    if (filter === "home") return category.showOnHome;
    return true;
  };

  const visibleRows = useMemo(() => {
    const rows: CategoryRow[] = [];
    roots.forEach((root) => {
      const children = childrenOf(root.id);
      const rootMatch = matches(root);
      const visibleChildren = children.filter(matches);
      if (!rootMatch && !visibleChildren.length) return;
      rows.push({ category: { ...root, productCount: countOf(root) }, depth: 0, hasChildren: children.length > 0 });
      if (expanded.includes(root.id) || filter !== "all" || search.trim()) {
        (rootMatch ? children : visibleChildren).forEach((child) => {
          rows.push({ category: { ...child, productCount: countOf(child) }, depth: 1, hasChildren: false });
        });
      }
    });
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, filter, search, expanded, roots, countOf]);

  const visibleIds = useMemo(() => visibleRows.map((row) => row.category.id), [visibleRows]);
  const selectedIds = useMemo(
    () => selected.filter((id) => categories.some((category) => category.id === id)),
    [selected, categories]
  );
  const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const dragEnabled = !search.trim() && filter === "all";

  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((category) => category.active).length;
    const home = categories.filter((category) => category.showOnHome).length;
    return { total, active, home, products: products.length };
  }, [categories]);

  const toggleExpand = (id: string) => {
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const toggleSelect = (id: string) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const toggleSelectAll = () => {
    setSelected(allSelected ? selectedIds.filter((id) => !visibleIds.includes(id)) : [...new Set([...selectedIds, ...visibleIds])]);
  };

  const move = (category: AdminCategory, direction: -1 | 1) => {
    const siblings = categories
      .filter((item) => parentKey(item) === parentKey(category))
      .sort((a, b) => a.order - b.order);
    const index = siblings.findIndex((item) => item.id === category.id);
    const target = siblings[index + direction];
    if (!target) return;
    remember(`"${category.name}" sırası değiştirildi.`);
    setCategories((current) =>
      current.map((item) => {
        if (item.id === category.id) return { ...item, order: target.order };
        if (item.id === target.id) return { ...item, order: category.order };
        return item;
      })
    );
  };

  const canDrop = (draggedId: string, targetId: string): boolean => {
    const dragged = categories.find((category) => category.id === draggedId);
    const target = categories.find((category) => category.id === targetId);
    if (!dragged || !target) return false;
    return parentKey(dragged) === parentKey(target);
  };

  const reorder = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    const dragged = categories.find((category) => category.id === draggedId);
    if (!dragged || !canDrop(draggedId, targetId)) return;

    const siblings = categories
      .filter((category) => parentKey(category) === parentKey(dragged))
      .sort((a, b) => a.order - b.order);
    const from = siblings.findIndex((category) => category.id === draggedId);
    const to = siblings.findIndex((category) => category.id === targetId);
    if (from < 0 || to < 0) return;

    const next = [...siblings];
    next.splice(to, 0, ...next.splice(from, 1));
    const orderMap = new Map(next.map((category, index) => [category.id, index + 1]));

    remember(`"${dragged.name}" yeni sırasına taşındı.`);
    setCategories((current) =>
      current.map((category) =>
        orderMap.has(category.id) ? { ...category, order: orderMap.get(category.id) as number } : category
      )
    );
  };

  const toggleActive = (id: string) => {
    const target = categories.find((category) => category.id === id);
    if (target) remember(`"${target.name}" yayın durumu güncellendi.`);
    setCategories((current) =>
      current.map((category) => (category.id === id ? { ...category, active: !category.active } : category))
    );
  };

  const bulkApply = (patch: Partial<AdminCategory>, message: (count: number) => string) => {
    if (!selectedIds.length) return;
    const ids = selectedIds;
    remember(message(ids.length));
    setCategories((current) =>
      current.map((category) => (ids.includes(category.id) ? { ...category, ...patch } : category))
    );
    setSelected([]);
  };

  const saveCategory = (category: AdminCategory, isNew: boolean) => {
    remember(isNew ? `"${category.name}" kategorisi eklendi.` : `"${category.name}" güncellendi.`);
    if (isNew) {
      const id = category.slug || `kategori-${Date.now().toString().slice(-5)}`;
      const siblings = categories.filter((item) => item.parent === category.parent);
      setCategories((current) => [
        ...current,
        {
          ...category,
          id,
          order: category.order || siblings.length + 1,
          productCount: 0,
        },
      ]);
      if (category.parent) {
        setExpanded((current) => (current.includes(category.parent as string) ? current : [...current, category.parent as string]));
      }
    } else {
      setCategories((current) => current.map((item) => (item.id === category.id ? category : item)));
    }
    setFormState(null);
  };

  const removeCategory = (category: AdminCategory) => {
    const children = categories.filter((item) => item.parent === category.id);
    remember(`"${category.name}" kategorisi silindi.`);
    setCategories((current) =>
      current.filter((item) => item.id !== category.id && !children.some((child) => child.id === item.id))
    );
    setSelected((current) => current.filter((id) => id !== category.id));
    setDeleteTarget(null);
  };

  const openChildForm = (parent: AdminCategory) => {
    const siblings = childrenOf(parent.id);
    setExpanded((current) => (current.includes(parent.id) ? current : [...current, parent.id]));
    setFormState({
      draft: {
        ...emptyCategory,
        parent: parent.id,
        order: siblings.length + 1,
      },
      isNew: true,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Toplam Kategori</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{stats.total}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{roots.length} ana · {stats.total - roots.length} alt</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Yayında</p>
          <p className="mt-1 font-heading text-xl font-bold text-accent-700">{stats.active}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{stats.total - stats.active} kategori pasif</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Vitrinde</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{stats.home}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Ana sayfada gösteriliyor</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Bağlı Ürün</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{formatNumberTr(stats.products)}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Kategorilere dağıtılmış</p>
        </div>
      </div>

      <Banner tone="info">
        Satırı tutup sürükleyerek sıralayın — aynı seviyedeki kategoriler arasında taşıma yapılır ve mağaza menüsü anında
        güncellenir. Ana kategorilerin satırındaki <strong className="font-semibold">Alt kategori</strong> butonuyla hızlıca
        alt kategori açabilirsiniz. Sol taraftaki kutulardan birden fazla kategori seçip toplu işlem yapabilir, son işlemi
        alttaki şeritten geri alabilirsiniz.
      </Banner>

      <Panel
        title="Kategori Ağacı"
        subtitle="Ana ve alt kategoriler, vitrin sıralaması ve SEO alanları"
        icon="ri-node-tree"
        padded={false}
        action={
          <button
            type="button"
            onClick={() => setFormState({ draft: { ...emptyCategory, order: roots.length + 1 }, isNew: true })}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-xs font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-add-line" />
            Yeni Kategori
          </button>
        }
      >
        <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3">
          <div className="relative min-w-0 flex-1">
            <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Kategori adı veya URL ara..."
              className="h-9 w-full rounded-lg border border-background-300 bg-background-50 pl-8 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {([
              { id: "all", label: "Tümü" },
              { id: "active", label: "Yayında" },
              { id: "passive", label: "Pasif" },
              { id: "home", label: "Vitrin" },
            ] as Array<{ id: Filter; label: string }>).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                  filter === item.id
                    ? "bg-primary-800 text-background-50"
                    : "bg-background-100 text-foreground-600 hover:bg-background-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {!dragEnabled && (
          <p className="flex items-center gap-2 border-b border-background-200 bg-background-100 px-4 py-2 text-[11px] text-foreground-600">
            <i className="ri-information-line" />
            Sürükleyerek sıralama yalnızca filtre ve arama kapalıyken kullanılabilir. Ok tuşlarıyla her zaman sıralayabilirsiniz.
          </p>
        )}

        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-primary-200 bg-primary-50 px-4 py-2.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary-900">
              <i className="ri-checkbox-multiple-line" />
              {selectedIds.length} kategori seçildi
            </span>
            <span className="mx-1 hidden h-4 w-px bg-primary-200 sm:block" />
            <button
              type="button"
              onClick={() => bulkApply({ active: true }, (count) => `${count} kategori yayına alındı.`)}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-accent-700 px-3 text-xs font-semibold text-background-50 hover:bg-accent-600"
            >
              <i className="ri-eye-line" />
              Yayınla
            </button>
            <button
              type="button"
              onClick={() => bulkApply({ active: false }, (count) => `${count} kategori yayından kaldırıldı.`)}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-eye-off-line" />
              Yayından Kaldır
            </button>
            <button
              type="button"
              onClick={() => bulkApply({ showOnHome: true }, (count) => `${count} kategori ana sayfa vitrinine eklendi.`)}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-home-4-line" />
              Vitrine Ekle
            </button>
            <button
              type="button"
              onClick={() => bulkApply({ showOnHome: false }, (count) => `${count} kategori vitrinden çıkarıldı.`)}
              className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
            >
              <i className="ri-home-8-line" />
              Vitrinden Çıkar
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected([]);
              }}
              className="ml-auto flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-lg px-2 text-xs text-foreground-600 hover:text-foreground-900"
            >
              <i className="ri-close-line" />
              Seçimi temizle
            </button>
          </div>
        )}

        {undoState && (
          <div className="flex flex-wrap items-center gap-2 border-b border-accent-200 bg-accent-50 px-4 py-2">
            <span className="flex min-w-0 flex-1 items-center gap-2 text-[11px] font-medium text-accent-900">
              <i className="ri-checkbox-circle-line shrink-0" />
              <span className="truncate">{undoState.label}</span>
            </span>
            <button
              type="button"
              onClick={undoLastAction}
              className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-accent-700 px-2.5 text-[11px] font-semibold text-background-50 hover:bg-accent-600"
            >
              <i className="ri-arrow-go-back-line" />
              Geri Al
            </button>
            <button
              type="button"
              onClick={() => setUndoState(null)}
              aria-label="Geri al şeridini kapat"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-accent-800 hover:bg-accent-100"
            >
              <i className="ri-close-line" />
            </button>
          </div>
        )}

        <CategoryTable
          rows={visibleRows}
          selected={selectedIds}
          expanded={expanded}
          dragEnabled={dragEnabled}
          allSelected={allSelected}
          canDrop={canDrop}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleSelectAll}
          onToggleExpand={toggleExpand}
          onReorder={reorder}
          onMove={move}
          onToggleActive={toggleActive}
          onEdit={(category) => setFormState({ draft: { ...category }, isNew: false })}
          onAddChild={openChildForm}
          onDelete={setDeleteTarget}
        />
      </Panel>

      {formState && (
        <CategoryFormModal
          open
          draft={formState.draft}
          isNew={formState.isNew}
          categories={categories}
          onClose={() => setFormState(null)}
          onSave={saveCategory}
        />
      )}

      <Modal
        open={Boolean(deleteTarget)}
        title="Kategoriyi sil"
        subtitle={deleteTarget?.name}
        icon="ri-delete-bin-6-line"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => deleteTarget && removeCategory(deleteTarget)}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg bg-accent-700 px-4 text-xs font-semibold text-background-50 hover:bg-accent-600"
            >
              Kalıcı Olarak Sil
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          <strong className="text-foreground-950">{deleteTarget?.name}</strong> kategorisi silinecek. Bağlı ürünler
          silinmez, kategorisiz kalır. Aşağıdaki bilgileri kontrol edin.
        </p>
        <div className="mt-3 space-y-2 rounded-lg bg-background-100 p-3 text-xs text-foreground-600">
          <p className="flex items-center justify-between">
            <span>Bağlı ürün sayısı</span>
            <span className="font-semibold text-foreground-900">{deleteTarget ? countOf(deleteTarget) : 0}</span>
          </p>
          <p className="flex items-center justify-between">
            <span>Alt kategori</span>
            <span className="font-semibold text-foreground-900">
              {deleteTarget ? categories.filter((item) => item.parent === deleteTarget.id).length : 0} adet
            </span>
          </p>
        </div>
        {deleteTarget && categoryHasChildren(categories, deleteTarget.id) && (
          <p className="mt-3 flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2 text-xs text-secondary-950">
            <i className="ri-alert-line mt-0.5" />
            Bu kategori silinince alt kategorileri de birlikte silinir.
          </p>
        )}
      </Modal>
    </div>
  );
}