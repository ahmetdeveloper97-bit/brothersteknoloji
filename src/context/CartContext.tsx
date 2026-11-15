import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { products } from "@/lib/catalog";
import { consumeCoupon, evaluateCoupon } from "@/lib/coupons";
import type { CartLine, Product } from "@/types/store";

export interface AppliedCoupon {
  code: string;
  campaignId: string;
  label: string;
  discount: number;
  freeShipping: boolean;
}

export interface CartDetailedLine {
  key: string;
  product: Product;
  quantity: number;
  variantLabel: string;
  unitPrice: number;
}

interface CouponApplyResult {
  ok: boolean;
  message: string;
}

interface AddToCartOptions {
  variantLabel?: string;
  unitPrice?: number;
}

interface CartContextValue {
  lines: CartLine[];
  detailed: CartDetailedLine[];
  count: number;
  total: number;
  discount: number;
  payableTotal: number;
  coupon: AppliedCoupon | null;
  couponFreeShipping: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, quantity?: number, options?: AddToCartOptions) => void;
  removeFromCart: (productId: string) => void;
  removeLine: (key: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setLineQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  replaceCart: (lines: CartLine[]) => void;
  applyCoupon: (code: string) => CouponApplyResult;
  removeCoupon: () => void;
  commitCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "eticaretv8_cart";

/** Aynı ürünün farklı varyantları sepette ayrı satır olarak tutulur. */
export const cartLineKey = (line: CartLine): string => `${line.productId}::${line.variantLabel ?? ""}`;

const readStoredCart = (): CartLine[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line: CartLine) => typeof line?.productId === "string" && Number(line?.quantity) > 0
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLines(readStoredCart());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage might be unavailable */
    }
  }, [lines]);

  const addToCart = useCallback(
    (productId: string, quantity = 1, options?: AddToCartOptions) => {
      const nextLine: CartLine = {
        productId,
        quantity,
        variantLabel: options?.variantLabel,
        unitPrice: options?.unitPrice,
      };
      const key = cartLineKey(nextLine);
      setLines((current) => {
        const existing = current.find((line) => cartLineKey(line) === key);
        if (existing) {
          return current.map((line) =>
            cartLineKey(line) === key ? { ...line, quantity: line.quantity + quantity } : line
          );
        }
        return [...current, nextLine];
      });
      setIsOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((current) => current.filter((line) => cartLineKey(line) !== key));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.productId !== productId)
        : current.map((line) => (line.productId === productId ? { ...line, quantity } : line))
    );
  }, []);

  const setLineQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => cartLineKey(line) !== key)
        : current.map((line) => (cartLineKey(line) === key ? { ...line, quantity } : line))
    );
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setCouponCode("");
  }, []);

  const replaceCart = useCallback((next: CartLine[]) => {
    setLines(next.filter((line) => line && typeof line.productId === "string" && Number(line.quantity) > 0));
    setCouponCode("");
  }, []);

  const detailed = useMemo(() => {
    const catalog = products as Product[];
    return lines
      .map<CartDetailedLine | null>((line) => {
        const product = catalog.find((item) => item.id === line.productId);
        if (!product) return null;
        return {
          key: cartLineKey(line),
          product,
          quantity: line.quantity,
          variantLabel: line.variantLabel ?? "",
          // Fiyat artışı sonrası eski sepetlerdeki düşük birim fiyatlar
          // güncel katalog fiyatıyla yenilenir.
          unitPrice:
            typeof line.unitPrice === "number" && line.unitPrice >= product.price
              ? line.unitPrice
              : product.price,
        };
      })
      .filter((entry): entry is CartDetailedLine => entry !== null);
  }, [lines]);

  const count = useMemo(() => detailed.reduce((sum, entry) => sum + entry.quantity, 0), [detailed]);
  const total = useMemo(
    () => detailed.reduce((sum, entry) => sum + entry.unitPrice * entry.quantity, 0),
    [detailed]
  );

  const couponLines = useMemo(
    () => detailed.map((entry) => ({ price: entry.unitPrice, quantity: entry.quantity })),
    [detailed]
  );

  const couponResult = useMemo(
    () => (couponCode ? evaluateCoupon(couponCode, couponLines) : null),
    [couponCode, couponLines]
  );

  const coupon: AppliedCoupon | null =
    couponResult && couponResult.ok && couponResult.campaign
      ? {
          code: couponResult.code,
          campaignId: couponResult.campaign.id,
          label: couponResult.label,
          discount: couponResult.discount,
          freeShipping: couponResult.freeShipping,
        }
      : null;

  const discount = coupon?.discount ?? 0;
  const payableTotal = Math.max(0, total - discount);

  const applyCoupon = useCallback(
    (code: string): CouponApplyResult => {
      const result = evaluateCoupon(code, couponLines);
      if (result.ok) setCouponCode(result.code);
      return { ok: result.ok, message: result.message };
    },
    [couponLines]
  );

  const removeCoupon = useCallback(() => setCouponCode(""), []);

  const commitCoupon = useCallback(() => {
    if (coupon) consumeCoupon(coupon.campaignId);
    setCouponCode("");
  }, [coupon]);

  const value: CartContextValue = {
    lines,
    detailed,
    count,
    total,
    discount,
    payableTotal,
    coupon,
    couponFreeShipping: coupon?.freeShipping ?? false,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addToCart,
    removeFromCart,
    removeLine,
    setQuantity,
    setLineQuantity,
    clearCart,
    replaceCart,
    applyCoupon,
    removeCoupon,
    commitCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};