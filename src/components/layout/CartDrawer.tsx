import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { loadShippingSettings } from "@/lib/shipping";
import CartReminderCard from "@/components/storefront/CartReminderCard";
import CouponSuggestions from "@/components/storefront/CouponSuggestions";
import PaymentBadges from "@/components/base/PaymentBadges";
import ConfirmDialog from "@/components/base/ConfirmDialog";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    detailed,
    count,
    total,
    discount,
    payableTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    setLineQuantity,
    removeLine,
    clearCart,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [shippingSettings] = useState(() => loadShippingSettings());

  const handleCoupon = () => {
    const result = applyCoupon(couponInput);
    if (result.ok) {
      setCouponInput("");
      setCouponError("");
      return;
    }
    setCouponError(result.message);
  };

  const applySuggestedCoupon = (code: string) => {
    const result = applyCoupon(code);
    setCouponError(result.ok ? "" : result.message);
    if (result.ok) setCouponInput("");
  };

  const couponLines = detailed.map(({ unitPrice, quantity }) => ({ price: unitPrice, quantity }));

  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-primary-950/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background-50 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-background-200 px-5">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-foreground-950">
            <i className="ri-shopping-bag-3-line" />
            Sepetim
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Sepeti kapat"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground-600 hover:bg-background-100"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {detailed.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
                <i className="ri-shopping-cart-2-line text-2xl text-foreground-400" />
              </span>
              <p className="font-medium text-foreground-800">Sepetiniz henüz boş</p>
              <p className="max-w-[240px] text-sm text-foreground-500">
                Beğendiğiniz ürünleri sepete ekleyerek alışverişe başlayın.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-1 cursor-pointer rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-background-50 hover:bg-primary-600"
              >
                Alışverişe Devam Et
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {detailed.map(({ key, product, quantity, variantLabel, unitPrice }) => (
                <li key={key} className="flex gap-3">
                  <Link
                    to={`/urunler/${product.slug}`}
                    onClick={closeCart}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-background-200 bg-background-100"
                  >
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2-safe text-sm font-medium text-foreground-900">{product.name}</p>
                    {variantLabel && (
                      <p className="mt-0.5 text-[11px] text-foreground-500">{variantLabel}</p>
                    )}
                    <p className="mt-1 text-sm font-semibold text-foreground-950">{formatPrice(unitPrice)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-md border border-background-300">
                        <button
                          type="button"
                          onClick={() => setLineQuantity(key, quantity - 1)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center text-foreground-600 hover:text-foreground-950"
                          aria-label="Adet azalt"
                        >
                          <i className="ri-subtract-line" />
                        </button>
                        <span className="w-6 text-center text-sm text-foreground-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setLineQuantity(key, quantity + 1)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center text-foreground-600 hover:text-foreground-950"
                          aria-label="Adet artır"
                        >
                          <i className="ri-add-line" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(key)}
                        className="flex cursor-pointer items-center gap-1 text-xs text-foreground-500 hover:text-foreground-900"
                      >
                        <i className="ri-delete-bin-6-line" />
                        Kaldır
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {detailed.length > 0 && (
          <div className="space-y-4 border-t border-background-200 px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-foreground-500">{count} ürün sepette</span>
              <button
                type="button"
                onClick={() => setClearOpen(true)}
                className="flex shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold text-primary-800 hover:bg-primary-50"
              >
                <i className="ri-delete-bin-6-line" />
                Sepeti boşalt
              </button>
            </div>
            <CartReminderCard />
            {!coupon && (
              <CouponSuggestions
                lines={couponLines}
                cartTotal={total}
                appliedCode={null}
                onApply={applySuggestedCoupon}
              />
            )}
            {coupon ? (
              <div className="flex items-center justify-between rounded-lg border border-accent-300 bg-accent-50 px-3 py-2">
                <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-accent-900">
                  <i className="ri-coupon-3-line shrink-0" />
                  <span className="truncate">
                    {coupon.code} · {coupon.label}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="ml-2 shrink-0 cursor-pointer text-[11px] text-accent-800 underline decoration-dotted"
                >
                  Kaldır
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(event) => {
                      setCouponInput(event.target.value);
                      setCouponError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleCoupon();
                      }
                    }}
                    placeholder="Kupon kodu"
                    className="box-border h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-2.5 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={handleCoupon}
                    className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
                  >
                    Uygula
                  </button>
                </div>
                {couponError && <p className="mt-1 text-[11px] text-foreground-700">{couponError}</p>}
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-foreground-600">
              <span>Ara toplam</span>
              <span className="font-semibold text-foreground-900">{formatPrice(total)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-accent-800">
                <span>Kupon indirimi</span>
                <span className="font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-background-200 pt-2.5 text-sm text-foreground-700">
              <span>Ödenecek tutar</span>
              <span className="text-lg font-bold text-foreground-950">{formatPrice(payableTotal)}</span>
            </div>
            <Link
              to="/odeme"
              onClick={closeCart}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 shadow-sm hover:from-primary-700 hover:to-primary-500"
            >
              <i className="ri-lock-2-line" />
              Ödemeye Geç
            </Link>
            <PaymentBadges size="sm" className="justify-center" />
            <p className="text-center text-xs text-foreground-500">
              {shippingSettings.freeShippingEnabled
                ? "Tüm siparişlerde kargo ücretsiz."
                : `${formatPrice(shippingSettings.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsiz.`}
            </p>
          </div>
        )}
      </aside>

      <ConfirmDialog
        open={clearOpen}
        title="Sepeti boşalt"
        subtitle="Sepetinizdeki tüm ürünler kaldırılacak"
        icon="ri-delete-bin-6-line"
        confirmLabel="Sepeti boşalt"
        onCancel={() => setClearOpen(false)}
        onConfirm={() => {
          clearCart();
          setClearOpen(false);
        }}
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          Sepetinizde <strong className="font-semibold text-foreground-950">{count} ürün</strong> bulunuyor. Devam
          ederseniz tüm ürünler ve uygulanan kupon kaldırılacak.
        </p>
      </ConfirmDialog>
    </div>
  );
}