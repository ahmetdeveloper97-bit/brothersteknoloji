import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { formatPrice } from "@/lib/format";
import { products } from "@/lib/catalog";
import {
  loadCustomProducts,
  removeCustomProduct,
  saveProductOverride,
  upsertCustomProduct,
} from "@/lib/productAdminStore";
import type { Product } from "@/types/store";
import ProductEditModal from "@/pages/admin/components/ProductEditModal";
import type { EditableProduct } from "@/pages/admin/components/ProductEditModal";

interface Row {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  stock: number;
  inStock: boolean;
}

const customIds = (): Set<string> => new Set(loadCustomProducts().map((item) => item.id));

const toRow = (product: Product, index: number): Row => {
  const stock = typeof product.stock === "number" ? product.stock : 12 + index * 7;
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: product.image,
    price: product.price,
    stock,
    inStock: product.inStock !== false && stock > 0,
  };
};

const buildInitialRows = (): Row[] => (products as Product[]).map(toRow);

const NEW_PRODUCT_IMAGE =
  "https://readdy.ai/api/search-image?query=generic%20product%20placeholder%20box%20on%20clean%20white%20studio%20background%2C%20e-commerce%20thumbnail&width=200&height=200&seq=store-admin-new-product&orientation=squarish";

export default function ProductsTable() {
  const [rows, setRows] = useState<Row[]>(buildInitialRows);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("10");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const editingRow = useMemo(() => rows.find((row) => row.id === editingId) ?? null, [rows, editingId]);

  const filtered = rows.filter((row) =>
    `${row.name} ${row.brand}`.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr"))
  );

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const addProduct = (event: FormEvent) => {
    event.preventDefault();
    const price = Number(newPrice.replace(/\./g, "").replace(",", "."));
    const stock = Number(newStock.replace(/[^0-9]/g, ""));
    if (!newName.trim() || !Number.isFinite(price) || price <= 0) return;

    const id = `admin-${Date.now()}`;
    const product: Product = {
      id,
      slug: `admin-urun-${Date.now()}`,
      name: newName.trim(),
      brand: newBrand.trim() || "Diğer",
      category: "genel",
      price: Math.round(price),
      oldPrice: null,
      rating: 4.6,
      reviewCount: 0,
      inStock: true,
      image: NEW_PRODUCT_IMAGE,
      tags: [],
      stock: Number.isFinite(stock) ? stock : 10,
    };

    upsertCustomProduct(product);
    setRows((current) => [toRow(product, 0), ...current]);
    setNewName("");
    setNewBrand("");
    setNewPrice("");
    setNewStock("10");
    setModalOpen(false);
    flash("Yeni ürün kataloğa eklendi.");
  };

  const persistRow = (row: Row) => {
    const next: Row = { ...row, inStock: row.stock > 0 && row.inStock };
    if (customIds().has(row.id)) {
      const existing = loadCustomProducts().find((item) => item.id === row.id);
      if (existing) {
        upsertCustomProduct({
          ...existing,
          name: next.name,
          brand: next.brand,
          price: next.price,
          stock: next.stock,
          inStock: next.inStock,
        });
      }
    } else {
      saveProductOverride(row.id, {
        name: next.name,
        brand: next.brand,
        price: next.price,
        stock: next.stock,
        inStock: next.inStock,
      });
    }
    setRows((current) => current.map((item) => (item.id === next.id ? next : item)));
  };

  const handleSaveEdit = (values: { name: string; brand: string; price: number; stock: number; inStock: boolean }) => {
    if (!editingRow) return;
    persistRow({ ...editingRow, ...values });
    setEditingId(null);
    flash("Ürün bilgileri güncellendi.");
  };

  const toggleStock = (row: Row) => {
    persistRow({ ...row, stock: row.stock > 0 ? 0 : 10, inStock: row.stock === 0 });
    flash(row.stock > 0 ? "Ürün satışa kapatıldı." : "Ürün yeniden satışa açıldı.");
  };

  const deleteProduct = (row: Row) => {
    if (customIds().has(row.id)) {
      removeCustomProduct(row.id);
    } else {
      saveProductOverride(row.id, { hidden: true });
    }
    setRows((current) => current.filter((item) => item.id !== row.id));
    if (editingId === row.id) setEditingId(null);
    flash("Ürün katalogdan kaldırıldı.");
  };

  const editable: EditableProduct | null = editingRow
    ? {
        id: editingRow.id,
        name: editingRow.name,
        brand: editingRow.brand,
        image: editingRow.image,
        price: editingRow.price,
        stock: editingRow.stock,
      }
    : null;

  return (
    <div className="space-y-3">
      {notice && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-100 px-4 py-2.5 text-xs font-medium text-accent-900">
          <i className="ri-checkbox-circle-line text-sm" />
          {notice}
        </div>
      )}

      <div className="rounded-xl border border-background-200 bg-background-50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 px-5 py-4">
          <div>
            <h2 className="font-heading text-base font-bold text-foreground-950">Ürün Listesi</h2>
            <p className="text-xs text-foreground-500">
              {rows.length} ürün yönetiliyor · düzenlemek için satırdaki kalem simgesini kullanın
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ürün ara..."
                className="h-9 w-44 rounded-lg border border-background-200 bg-background-100 pl-8 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-500 focus:bg-background-50"
              />
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-700 px-3 text-xs font-semibold text-background-50 hover:bg-primary-600"
            >
              <i className="ri-add-line" />
              Yeni Ürün
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                <th className="px-5 py-3 font-medium">Ürün</th>
                <th className="px-5 py-3 font-medium">Marka</th>
                <th className="px-5 py-3 font-medium">Fiyat</th>
                <th className="px-5 py-3 font-medium">Stok</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-background-200 bg-background-100">
                        <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
                      </span>
                      <span className="line-clamp-2-safe max-w-[280px] text-foreground-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-foreground-600">{row.brand}</td>
                  <td className="whitespace-nowrap px-5 py-3 font-semibold text-foreground-900">
                    {formatPrice(row.price)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-foreground-600">{row.stock} adet</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-medium ${
                        row.inStock && row.stock > 0
                          ? "bg-accent-100 text-accent-800"
                          : "bg-background-200 text-foreground-600"
                      }`}
                    >
                      {row.inStock && row.stock > 0 ? "Yayında" : "Stokta Yok"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(row.id)}
                        aria-label="Ürünü düzenle"
                        title="Düzenle"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-primary-700 hover:bg-primary-100"
                      >
                        <i className="ri-edit-2-line" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStock(row)}
                        aria-label="Stok durumunu değiştir"
                        title="Stok durumu"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-foreground-900"
                      >
                        <i className="ri-toggle-line" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(row)}
                        aria-label="Ürünü sil"
                        title="Sil"
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-200 hover:text-accent-700"
                      >
                        <i className="ri-delete-bin-6-line" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-foreground-500">
                    Aramanızla eşleşen ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductEditModal
        open={Boolean(editingRow)}
        product={editable}
        onClose={() => setEditingId(null)}
        onSave={handleSaveEdit}
      />

      {modalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center px-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-primary-950/50" />
          <form
            onSubmit={addProduct}
            className="relative w-full max-w-md rounded-xl border border-background-200 bg-background-50 p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground-950">Yeni Ürün Ekle</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Kapat"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground-500 hover:bg-background-100"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="p-name">
                  Ürün adı
                </label>
                <input
                  id="p-name"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  className="h-9 w-full rounded-md border border-background-300 px-3 text-sm outline-none focus:border-primary-500"
                  placeholder="Örn. Samsung Galaxy S25"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="p-brand">
                    Marka
                  </label>
                  <input
                    id="p-brand"
                    value={newBrand}
                    onChange={(event) => setNewBrand(event.target.value)}
                    className="h-9 w-full rounded-md border border-background-300 px-3 text-sm outline-none focus:border-primary-500"
                    placeholder="Samsung"
                  />
                </div>
                <div className="min-w-0">
                  <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="p-price">
                    Fiyat (₺)
                  </label>
                  <input
                    id="p-price"
                    value={newPrice}
                    onChange={(event) => setNewPrice(event.target.value)}
                    className="h-9 w-full rounded-md border border-background-300 px-3 text-sm outline-none focus:border-primary-500"
                    placeholder="24999"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="p-stock">
                  Stok adedi
                </label>
                <input
                  id="p-stock"
                  value={newStock}
                  onChange={(event) => setNewStock(event.target.value)}
                  className="h-9 w-full rounded-md border border-background-300 px-3 text-sm outline-none focus:border-primary-500"
                  placeholder="10"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary-700 text-sm font-semibold text-background-50 hover:bg-primary-600"
            >
              Ürünü Kaydet
            </button>
          </form>
        </div>
      )}
    </div>
  );
}