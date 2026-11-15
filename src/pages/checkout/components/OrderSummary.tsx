import { formatPrice } from "@/lib/format";
import CouponSuggestions from "@/components/storefront/CouponSuggestions";
import PaymentBadges from "@/components/base/PaymentBadges";
import { InlineAlert } from "@/components/base/AccountUI";
import type { Product } from "@/types/store";
import type { InstallmentPlan } from "@/types/integrations";

export interface CartActionMessage {
  tone: "success" | "error";
  text: string;
}

interface OrderSummaryProps {
  lines: Array<{
    key?: string;
    product: Product;
    quantity: number;
    variantLabel?: string;
    unitPrice?: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon: { code: string; label: string } | null;
  couponError: string;
  couponHints: string[];
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  plan: InstallmentPlan | null;
  onClearCart: () => void;
  onSaveCart: () => void;
  savingCart: boolean;
  canSaveCart: boolean;
  cartMessage: CartActionMessage | null;
}

export default function OrderSummary({
  lines,
  subtotal,
  discount,
  shipping,
  total,
  coupon,
  couponError,
  couponHints,
  onApplyCoupon,
  onRemoveCoupon,
  plan,
  onClearCart,
  onSaveCart,
  savingCart,
  canSaveCart,
  cartMessage,
}: OrderSummaryProps) {
  const installmentTotal = plan ? total * (1 + plan.rate / 100) : total;
  const couponLines = lines.map(({ product, quantity, unitPrice }) => ({
    price: unitPrice ?? product.price,
    quantity,
  }));

  return (
    <aside className="space-y-4">
      <div className="rounded-xl border border-background-200 bg-background-50">
        <div className="flex items-center gap-2 border-b border-background-200 px-4 py-3">
          <i className="ri-shopping-bag-3-line text-primary-700" />
          <h2 className="font-heading text-sm font-bold text-foreground-950">Sipariş Özeti</h2>
          <span className="ml-auto text-[11px] text-foreground-500">{lines.reduce((sum, line) => sum + line.quantity, 0)} ürün</span>
        </div>

        <ul className="max-h-[280px] space-y-3 overflow-y-auto px-4 py-4">
          {lines.map(({ key, product, quantity, variantLabel, unitPrice }) => (
            <li key={key ?? product.id + variantLabel} className="flex gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-background-200 bg-background-100">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2-safe text-xs font-medium text-foreground-900">{product.name}</p>
                {variantLabel ? (
                  <p className="mt-0.5 text-[10px] text-foreground-500">{variantLabel}</p>
                ) : null}
                <p className="mt-0.5 text-[11px] text-foreground-500">Adet: {quantity}</p>
              </div>
              <span className="whitespace-nowrap text-xs font-semibold text-foreground-950">
                {formatPrice((unitPrice ?? product.price) * quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-background-200 px-4 py-3">
          {coupon ? (
            <div className="flex items-center justify-between rounded-lg border border-accent-300 bg-accent-50 px-2.5 py-2">
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-accent-900">
                <i className="ri-coupon-3-line shrink-0" />
                <span className="truncate">
                  {coupon.code} · {coupon.label}
                </span>
              </span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="ml-2 shrink-0 cursor-pointer text-[11px] text-accent-800 underline decoration-dotted"
              >
                Kaldır
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                <input
                  id="coupon-input"
                  placeholder="İndirim kuponu"
                  defaultValue=""
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onApplyCoupon((event.target as HTMLInputElement).value);
                    }
                  }}
                  className="box-border h-9 min-w-0 flex-1 rounded-lg border border-background-300 bg-background-50 px-2.5 text-xs text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("coupon-input") as HTMLInputElement | null;
                    onApplyCoupon(input?.value ?? "");
                  }}
                  className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-3 text-xs font-semibold text-foreground-800 hover:bg-background-100"
                >
                  Uygula
                </button>
              </div>
              {couponError ? (
                <p className="mt-1.5 text-[11px] text-foreground-900">{couponError}</p>
              ) : couponHints.length > 0 ? (
                <p className="mt-1.5 text-[11px] text-foreground-500">
                  Geçerli kuponlar: {couponHints.join(" · ")}
                </p>
              ) : (
                <p className="mt-1.5 text-[11px] text-foreground-500">Kampanya sekmesindeki kupon kodları geçerlidir.</p>
              )}
              <div className="mt-2">
                <CouponSuggestions
                  lines={couponLines}
                  cartTotal={subtotal}
                  appliedCode={null}
                  onApply={onApplyCoupon}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-background-200 px-4 py-3 text-xs">
          <div className="flex justify-between text-foreground-600">
            <span>Ara toplam</span>
            <span className="font-medium text-foreground-900">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-accent-800">
              <span>Kupon indirimi</span>
              <span className="font-medium">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-foreground-600">
            <span>Kargo</span>
            <span className="font-medium text-foreground-900">{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</span>
          </div>
          <div className="mt-1 flex items-end justify-between border-t border-background-200 pt-2.5">
            <span className="text-xs font-semibold text-foreground-700">Genel toplam</span>
            <span className="font-heading text-lg font-bold text-foreground-950">{formatPrice(total)}</span>
          </div>
          {plan && plan.count > 1 && (
            <p className="rounded-lg bg-background-100 px-2.5 py-2 text-[11px] text-foreground-600">
              {plan.count} taksitle aylık <strong className="text-foreground-950">{formatPrice(installmentTotal / plan.count)}</strong>{" "}
              · toplam {formatPrice(installmentTotal)}
            </p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-background-200 pt-3">
            <button
              type="button"
              onClick={onSaveCart}
              disabled={savingCart}
              className={`flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-primary-300 bg-primary-50 px-2 text-[11px] font-semibold text-primary-900 hover:bg-primary-100 ${
                savingCart ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              <i className={savingCart ? "ri-loader-4-line animate-spin" : "ri-bookmark-3-line"} />
              {savingCart ? "Kaydediliyor..." : "Sepeti kaydet"}
            </button>
            <button
              type="button"
              onClick={onClearCart}
              className="flex h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-2 text-[11px] font-semibold text-foreground-700 hover:bg-background-100"
            >
              <i className="ri-delete-bin-6-line" />
              Sepeti boşalt
            </button>
          </div>

          {!canSaveCart && (
            <p className="text-[11px] leading-relaxed text-foreground-500">
              Sepeti kaydetmek için hesabınıza giriş yapmanız gerekir.
            </p>
          )}
          {cartMessage && <InlineAlert tone={cartMessage.tone}>{cartMessage.text}</InlineAlert>}
        </div>
      </div>

      <div className="rounded-xl border border-background-200 bg-background-100 p-3.5">
        <div className="flex items-center gap-2 text-[11px] text-foreground-600">
          <i className="ri-shield-check-line text-sm text-accent-700" />
          256-bit SSL ve 3D Secure ile korunuyor
        </div>
        <div className="mt-2">
          <PaymentBadges size="sm" />
        </div>
      </div>
    </aside>
  );
}