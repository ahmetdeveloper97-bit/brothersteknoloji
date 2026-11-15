import { useMemo } from "react";
import { categories as mockCategories } from "@/mocks/store";
import { loadCategories } from "@/lib/adminStore";
import type { AdminCategory } from "@/types/admin";

export interface StoreCategoryNode {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  showOnHome: boolean;
  parent: string | null;
  children: StoreCategoryNode[];
}

const imageById = new Map<string, string>();
const imageBySlug = new Map<string, string>();

mockCategories.forEach((category) => {
  imageById.set(category.id, category.image);
  imageBySlug.set(category.slug, category.image);
});

const fallbackImage = mockCategories[0]?.image ?? "";

const resolveImage = (category: AdminCategory): string =>
  imageById.get(category.id) ?? imageBySlug.get(category.slug) ?? fallbackImage;

const toNode = (category: AdminCategory): StoreCategoryNode => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  image: resolveImage(category),
  description: category.description,
  productCount: category.productCount,
  showOnHome: category.showOnHome,
  parent: category.parent ?? null,
  children: [],
});

/** Kategori ağacında verilen düğümü (kök ya da alt) bulur. */
export const findCategoryNode = (
  nodes: StoreCategoryNode[],
  id: string
): StoreCategoryNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findCategoryNode(node.children, id);
    if (found) return found;
  }
  return null;
};

/** Seçili kategori ve tüm alt kategorilerinin id kümesini üretir. */
export const collectCategoryIds = (
  roots: StoreCategoryNode[],
  id: string
): Set<string> => {
  const ids = new Set<string>([id]);
  const node = findCategoryNode(roots, id);
  const walk = (item: StoreCategoryNode) => {
    item.children.forEach((child) => {
      ids.add(child.id);
      walk(child);
    });
  };
  if (node) walk(node);
  return ids;
};

export interface StoreCategoriesState {
  roots: StoreCategoryNode[];
  homeCategories: StoreCategoryNode[];
  flat: StoreCategoryNode[];
  total: number;
}

/**
 * Mağaza vitrininin kategori listesini yönetim panelindeki kategori
 * düzenlemelerinden türetir. Pasif kategoriler menüde ve vitrinde görünmez,
 * sıralama yönetim panelindeki order alanını takip eder.
 */
export function useStoreCategories(): StoreCategoriesState {
  return useMemo(() => {
    const active = loadCategories().filter((category) => category.active);
    const sorted = [...active].sort(
      (a, b) => a.order - b.order || a.name.localeCompare(b.name, "tr")
    );

    const childrenByParent = new Map<string, AdminCategory[]>();
    sorted.forEach((category) => {
      if (!category.parent) return;
      const bucket = childrenByParent.get(category.parent) ?? [];
      bucket.push(category);
      childrenByParent.set(category.parent, bucket);
    });

    const roots = sorted
      .filter((category) => !category.parent)
      .map((category) => ({
        ...toNode(category),
        children: (childrenByParent.get(category.id) ?? [])
          .sort((a, b) => a.order - b.order)
          .map(toNode),
      }));

    const flat = sorted.map(toNode);
    // Vitrinde önce ana kategoriler, ardından öne çıkan alt kategoriler sıralanır.
    const homeRoots = roots.filter((node) => node.showOnHome);
    const homeChildren = roots.flatMap((node) => node.children.filter((child) => child.showOnHome));
    const homeCategories = [...homeRoots, ...homeChildren];

    return { roots, homeCategories, flat, total: active.length };
  }, []);
}