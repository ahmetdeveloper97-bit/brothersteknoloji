import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountButton, AccountCard, InlineAlert } from "@/components/base/AccountUI";
import ConfirmDialog from "@/components/base/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/catalog";
import { deleteSavedCart, listSavedCarts } from "@/lib/savedCarts";
import { formatPrice } from "@/lib/format";
import { formatDateTime } from "@/lib/accountFormat";
import type { SavedCartRow } from "@/types/savedCart";

export default function SavedCartsTab() {
  const { user } = useAuth();
  const { replaceCart } = useCart();
  const navigate = useNavigate();

  const [rows, setRows] = useState<SavedCartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingDelete, setPendingDelete] = useState<SavedCartRow | null>(null);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      setRows(await listSavedCarts(user.id));
    } catch {
      setError("Kaydedilen sepetler yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const restore = (row: SavedCartRow) => {
    const items = Array.isArray(row.items) ? row.items : [];
    const available = items.filter((line) => products.some((product) => product.id === line.productId));
    if (available.length === 0) {
      setNotice("Bu sepetteki ürünler artık satışta değil, geri yüklenemedi.");
      return;
    }
    replaceCart(
      available.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        variantLabel: line.variantLabel,
        unitPrice: line.unitPrice,
      }))
    );
    navigate("/odeme");
  };

  const remove = async () => {
    if (!user || !pendingDelete) return;
    const target = pendingDelete;
    setBusyId(target.id);
    try {
      await deleteSavedCart(target.id, user.id);
      setRows((current) => current.filter((row) => row.id !== target.id));
      setNotice("Kaydedilen sepet silindi.");
    } catch {
      setError("Sepet silinemedi. Lütfen tekrar deneyin.");
    } finally {
      setBusyId("");
      setPendingDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <AccountCard
        title="Kaydedilen Sepetler"
        subtitle="Ödeme adımında kaydettiğiniz sepetler burada listelenir. Dilediğiniz zaman geri yükleyip alışverişe devam edebilirsiniz."
        icon="ri-bookmark-3-line"
        action={
          <AccountButton variant="ghost" icon="ri-refresh-line" onClick={() => void load()}>
            Yenile
          </AccountButton>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-foreground-500">
            <i className="ri-loader-4-line mr-2 animate-spin text-lg" />
            Kaydedilen sepetler yükleniyor...
          </div>
        ) : error && rows.length === 0 ? (
          <div className="space-y-3">
            <InlineAlert tone="error">{error}</InlineAlert>
            <AccountButton onClick={() => void load()} variant="ghost" icon="ri-refresh-line">
              Tekrar Dene
            </AccountButton>
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-background-300 bg-background-100/60 px-6 py-12 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-200 text-foreground-600">
              <i className="ri-bookmark-line text-2xl" />
            </span>
            <h3 className="mt-3 font-heading text-sm font-bold text-foreground-950">Kaydedilmiş sepetiniz yok</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-foreground-500">
              Ödeme sayfasındaki sipariş özetinde “Sepeti kaydet” seçeneğini kullanarak sepetinizi daha sonra devam
              etmek üzere saklayabilirsiniz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notice && <InlineAlert tone="success">{notice}</InlineAlert>}
            {error && <InlineAlert tone="error">{error}</InlineAlert>}
            {rows.map((row) => {
              const items = Array.isArray(row.items) ? row.items : [];
              const preview = items.slice(0, 3);
              return (
                <div key={row.id} className="rounded-xl border border-background-200 bg-background-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-bold text-foreground-950">
                        <i className="ri-bookmark-3-line text-primary-700" />
                        <span className="truncate">{row.name}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-500">
                        {formatDateTime(row.created_at)} · {row.item_count} ürün
                      </p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-bold text-primary-900">
                      {formatPrice(Number(row.total) || 0)}
                    </span>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {preview.map((line, index) => {
                      const product = products.find((item) => item.id === line.productId);
                      return (
                        <li
                          key={`${row.id}-${line.productId}-${index}`}
                          className="flex min-w-0 items-center gap-2 rounded-lg border border-background-200 bg-background-100/60 px-2 py-1.5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background-200">
                            {product ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <i className="ri-image-line text-foreground-500" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block max-w-[160px] truncate text-[11px] font-medium text-foreground-900">
                              {product ? product.name : "Ürün artık satışta değil"}
                            </span>
                            <span className="block text-[10px] text-foreground-500">Adet: {line.quantity}</span>
                          </span>
                        </li>
                      );
                    })}
                    {items.length > preview.length && (
                      <li className="flex items-center rounded-lg bg-background-100 px-2.5 py-1.5 text-[11px] font-medium text-foreground-600">
                        +{items.length - preview.length} ürün daha
                      </li>
                    )}
                  </ul>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-background-200 pt-3">
                    <button
                      type="button"
                      onClick={() => restore(row)}
                      className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 py-2 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
                    >
                      <i className="ri-shopping-cart-2-line" /> Sepete geri yükle
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(row)}
                      disabled={busyId === row.id}
                      className="ml-auto flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-primary-800 hover:bg-primary-50 disabled:opacity-50"
                    >
                      <i className="ri-delete-bin-6-line" /> Sil
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AccountCard>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Kaydedilen sepeti sil"
        subtitle={pendingDelete?.name}
        icon="ri-delete-bin-6-line"
        confirmLabel="Sil"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => void remove()}
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          Bu kayıtlı sepet kalıcı olarak silinecek. Sepetinizdeki ürünler mevcut sepetinizi etkilemez.
        </p>
      </ConfirmDialog>
    </div>
  );
}