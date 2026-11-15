import { useState } from "react";
import { Pill } from "@/components/base/AdminUI";
import type { AdminCategory } from "@/types/admin";

export interface CategoryRow {
  category: AdminCategory;
  depth: number;
  hasChildren: boolean;
}

interface CategoryTableProps {
  rows: CategoryRow[];
  selected: string[];
  expanded: string[];
  dragEnabled: boolean;
  allSelected: boolean;
  canDrop: (draggedId: string, targetId: string) => boolean;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  onToggleExpand: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onMove: (category: AdminCategory, direction: -1 | 1) => void;
  onToggleActive: (id: string) => void;
  onEdit: (category: AdminCategory) => void;
  onAddChild: (category: AdminCategory) => void;
  onDelete: (category: AdminCategory) => void;
}

export default function CategoryTable({
  rows,
  selected,
  expanded,
  dragEnabled,
  allSelected,
  canDrop,
  onToggleSelect,
  onToggleAll,
  onToggleExpand,
  onReorder,
  onMove,
  onToggleActive,
  onEdit,
  onAddChild,
  onDelete,
}: CategoryTableProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const resetDrag = () => {
    setDragId(null);
    setOverId(null);
  };

  if (!rows.length) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <i className="ri-search-eye-line text-2xl text-foreground-400" />
        <p className="text-sm text-foreground-600">Aramanıza uygun kategori bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
            <th className="w-16 py-2.5 pl-4 pr-1 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="flex w-6 items-center justify-center text-foreground-300">
                  <i className="ri-drag-move-2-line text-xs" />
                </span>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Görünen kategorilerin tümünü seç"
                  className="h-3.5 w-3.5 cursor-pointer accent-primary-800"
                />
              </div>
            </th>
            <th className="px-2 py-2.5 font-medium">Kategori</th>
            <th className="px-3 py-2.5 font-medium">Ürün</th>
            <th className="px-3 py-2.5 font-medium">Durum</th>
            <th className="px-3 py-2.5 font-medium">Vitrin</th>
            <th className="px-3 py-2.5 font-medium">Sıra</th>
            <th className="px-4 py-2.5 text-right font-medium">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ category, depth, hasChildren }) => {
            const isSelected = selected.includes(category.id);
            const isDragging = dragId === category.id;
            const isOver = overId === category.id && dragId !== category.id;

            return (
              <tr
                key={category.id}
                draggable={dragEnabled}
                onDragStart={(event) => {
                  if (!dragEnabled) return;
                  setDragId(category.id);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", category.id);
                }}
                onDragOver={(event) => {
                  if (!dragEnabled || !dragId) return;
                  if (!canDrop(dragId, category.id)) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  setOverId(category.id);
                }}
                onDragLeave={() => setOverId((current) => (current === category.id ? null : current))}
                onDrop={(event) => {
                  if (!dragEnabled) return;
                  event.preventDefault();
                  if (dragId) onReorder(dragId, category.id);
                  resetDrag();
                }}
                onDragEnd={resetDrag}
                className={`border-b border-background-100 transition-colors last:border-0 ${
                  isSelected ? "bg-primary-50" : "hover:bg-background-100/60"
                } ${isOver ? "bg-secondary-100" : ""} ${isDragging ? "opacity-40" : ""}`}
              >
                <td className="py-2.5 pl-4 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded text-foreground-400 ${
                        dragEnabled ? "cursor-grab active:cursor-grabbing hover:bg-background-200 hover:text-foreground-700" : "opacity-40"
                      }`}
                      title={dragEnabled ? "Sürükleyerek sırala" : "Sıralama için filtreleri temizleyin"}
                    >
                      <i className="ri-drag-move-2-line text-sm" />
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(category.id)}
                      aria-label={`${category.name} kategorisini seç`}
                      className="h-3.5 w-3.5 cursor-pointer accent-primary-800"
                    />
                  </div>
                </td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-2" style={{ paddingLeft: depth * 22 }}>
                    {depth === 0 && hasChildren ? (
                      <button
                        type="button"
                        onClick={() => onToggleExpand(category.id)}
                        aria-label="Alt kategorileri aç/kapat"
                        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-200"
                      >
                        <i className={expanded.includes(category.id) ? "ri-subtract-line" : "ri-add-line"} />
                      </button>
                    ) : (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-foreground-300">
                        {depth > 0 ? <i className="ri-corner-down-right-line text-xs" /> : null}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className={`truncate ${depth === 0 ? "font-semibold text-foreground-950" : "text-foreground-800"}`}>
                        {category.name}
                      </p>
                      <p className="truncate font-mono text-[11px] text-foreground-500">/kategori/{category.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-foreground-600">{category.productCount} adet</td>
                <td className="px-3 py-2.5">
                  <Pill tone={category.active ? "success" : "neutral"}>{category.active ? "Yayında" : "Pasif"}</Pill>
                </td>
                <td className="px-3 py-2.5">
                  {category.showOnHome ? (
                    <Pill tone="info">
                      <i className="ri-home-4-line" />
                      Vitrin
                    </Pill>
                  ) : (
                    <span className="text-xs text-foreground-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onMove(category, -1)}
                      aria-label="Yukarı taşı"
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-foreground-500 hover:bg-background-200"
                    >
                      <i className="ri-arrow-up-line text-xs" />
                    </button>
                    <span className="w-5 text-center text-xs text-foreground-600">{category.order}</span>
                    <button
                      type="button"
                      onClick={() => onMove(category, 1)}
                      aria-label="Aşağı taşı"
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-foreground-500 hover:bg-background-200"
                    >
                      <i className="ri-arrow-down-line text-xs" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    {depth === 0 && (
                      <button
                        type="button"
                        onClick={() => onAddChild(category)}
                        aria-label={`${category.name} altına yeni alt kategori ekle`}
                        title="Alt kategori ekle"
                        className="flex h-7 cursor-pointer items-center gap-1 rounded-full px-2 text-[11px] font-medium text-foreground-500 hover:bg-background-200 hover:text-primary-800"
                      >
                        <i className="ri-add-box-line" />
                        <span className="hidden xl:inline">Alt kategori</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleActive(category.id)}
                      aria-label="Yayın durumunu değiştir"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-foreground-900"
                    >
                      <i className={category.active ? "ri-eye-off-line" : "ri-eye-line"} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      aria-label="Kategoriyi düzenle"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-primary-800"
                    >
                      <i className="ri-edit-line" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      aria-label="Kategoriyi sil"
                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-accent-700"
                    >
                      <i className="ri-delete-bin-6-line" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}