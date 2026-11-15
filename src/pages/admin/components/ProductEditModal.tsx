import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Modal from "@/components/base/Modal";
import { formatPrice } from "@/lib/format";

export interface EditableProduct {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  stock: number;
}

interface ProductEditModalProps {
  open: boolean;
  product: EditableProduct | null;
  onClose: () => void;
  onSave: (values: { name: string; brand: string; price: number; stock: number; inStock: boolean }) => void;
}

export default function ProductEditModal({ open, product, onClose, onSave }: ProductEditModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [inStock, setInStock] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product) return;
    setName(product.name);
    setBrand(product.brand);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setInStock(product.stock > 0);
    setError("");
  }, [product]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedPrice = Number(price.replace(/\./g, "").replace(",", "."));
    const parsedStock = Number(stock.replace(/[^0-9]/g, ""));
    if (!name.trim()) {
      setError("Ürün adı boş olamaz.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Geçerli bir fiyat girin.");
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError("Geçerli bir stok adedi girin.");
      return;
    }
    onSave({
      name: name.trim(),
      brand: brand.trim() || "Diğer",
      price: Math.round(parsedPrice),
      stock: parsedStock,
      inStock: inStock && parsedStock > 0,
    });
  };

  const totalPreview = Number(price.replace(/\./g, "").replace(",", "."));

  return (
    <Modal
      open={open && Boolean(product)}
      title="Ürünü Düzenle"
      subtitle={product ? `Ürün kodu: ${product.id}` : undefined}
      icon="ri-edit-2-line"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 cursor-pointer items-center whitespace-nowrap rounded-lg px-4 text-sm font-medium text-foreground-700 hover:bg-background-200"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            form="product-edit-form"
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-700 px-4 text-sm font-semibold text-background-50 hover:bg-primary-600"
          >
            <i className="ri-save-3-line" />
            Değişiklikleri Kaydet
          </button>
        </div>
      }
    >
      <form id="product-edit-form" onSubmit={submit} className="space-y-4">
        {product && (
          <div className="flex items-center gap-3 rounded-xl border border-background-200 bg-background-100 p-3">
            <span className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-background-200 bg-background-50">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-500">Güncel fiyat</p>
              <p className="text-base font-bold text-foreground-950">{formatPrice(product.price)}</p>
            </div>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="edit-name">
            Ürün adı
          </label>
          <input
            id="edit-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
            placeholder="Örn. Samsung Galaxy S25"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="edit-brand">
              Marka
            </label>
            <input
              id="edit-brand"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
              placeholder="Samsung"
            />
          </div>
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="edit-price">
              Fiyat (₺)
            </label>
            <input
              id="edit-price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputMode="decimal"
              className="h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
              placeholder="24999"
            />
            {Number.isFinite(totalPreview) && totalPreview > 0 && (
              <p className="mt-1 text-[11px] text-foreground-500">Vitrinde: {formatPrice(Math.round(totalPreview))}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label className="mb-1 block text-xs font-medium text-foreground-700" htmlFor="edit-stock">
              Stok adedi
            </label>
            <input
              id="edit-stock"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              inputMode="numeric"
              className="h-10 w-full rounded-lg border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none focus:border-primary-500"
              placeholder="12"
            />
          </div>
          <div className="min-w-0">
            <span className="mb-1 block text-xs font-medium text-foreground-700">Satış durumu</span>
            <button
              type="button"
              onClick={() => setInStock((current) => !current)}
              className={`flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border px-3 text-sm font-medium transition-colors ${
                inStock
                  ? "border-accent-300 bg-accent-100 text-accent-900"
                  : "border-background-300 bg-background-100 text-foreground-600"
              }`}
            >
              {inStock ? "Satışta" : "Satışa kapalı"}
              <i className={`${inStock ? "ri-toggle-fill" : "ri-toggle-line"} text-xl`} />
            </button>
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-1.5 rounded-lg bg-accent-100 px-3 py-2 text-xs font-medium text-accent-900">
            <i className="ri-error-warning-line text-sm" />
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}