import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import CheckoutSteps from "@/pages/checkout/components/CheckoutSteps";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { KEYS, loadPayments } from "@/lib/integrations";
import { writeJson } from "@/lib/persistent";
import { formatPrice } from "@/lib/format";
import { fetchPaymentResult, type PaymentResultInfo } from "@/lib/iyzico";
import { savePlacedOrder } from "@/lib/adminOrders";
import type { PaymentTransaction } from "@/types/integrations";

type ScreenState = "loading" | "success" | "failed";

const formatNow = (): string =>
  new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function PaymentResultPage() {
  const [params] = useSearchParams();
  const orderNo = params.get("order") ?? "";
  const [state, setState] = useState<ScreenState>("loading");
  const [info, setInfo] = useState<PaymentResultInfo | null>(null);
  const handled = useRef(false);
  const { clearCart, commitCoupon, detailed } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    if (!orderNo) {
      setState("failed");
      return () => {
        active = false;
      };
    }
    void (async () => {
      const data = await fetchPaymentResult(orderNo);
      if (!active) return;
      setInfo(data);
      setState(data && data.status === "success" ? "success" : "failed");
    })();
    return () => {
      active = false;
    };
  }, [orderNo]);

  useEffect(() => {
    if (state !== "success" || handled.current) return;
    handled.current = true;

    const transaction: PaymentTransaction = {
      id: orderNo.toLowerCase(),
      customer: info?.buyerName || user?.email || "Müşteri",
      email: user?.email ?? "",
      amount: info?.amount ?? 0,
      installment: info?.installment ?? 1,
      cardMask: info?.cardMask || "**** **** **** ----",
      status: "success",
      date: formatNow(),
    };
    writeJson(KEYS.payments, [transaction, ...loadPayments()]);
    savePlacedOrder({
      id: `#${orderNo.toUpperCase()}`,
      orderNo,
      source: "local",
      customer: info?.buyerName || transaction.customer,
      email: user?.email ?? transaction.email ?? "",
      phone: "",
      date: formatNow(),
      createdAt: new Date().toISOString(),
      status: "Hazırlanıyor",
      payment: `${transaction.installment > 1 ? `${transaction.installment} taksit` : "Tek çekim"} · ${transaction.cardMask}`,
      address: "",
      city: "",
      cargo: "—",
      tracking: "—",
      note: "Ödeme banka onayı ile tamamlandı.",
      amount: info?.amount ?? 0,
      lines: detailed.map(({ product, quantity, variantLabel, unitPrice }) => ({
        name: variantLabel ? `${product.name} (${variantLabel})` : product.name,
        brand: product.brand,
        image: product.image,
        quantity,
        price: unitPrice,
      })),
    });
    commitCoupon();
    clearCart();
  }, [state, info, orderNo, user, commitCoupon, clearCart]);

  if (state === "loading") {
    return (
      <StoreLayout>
        <div className="mx-auto flex min-h-[420px] w-full max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
            <i className="ri-loader-4-line animate-spin text-2xl text-primary-700" />
          </span>
          <h1 className="mt-4 font-heading text-lg font-bold text-foreground-950">Ödemeniz doğrulanıyor</h1>
          <p className="mt-1.5 text-sm text-foreground-500">Banka onayı kontrol ediliyor, lütfen sayfayı kapatmayın.</p>
        </div>
      </StoreLayout>
    );
  }

  if (state === "failed") {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
          <CheckoutSteps deliveryDone billingDone paid={false} />
          <div className="mt-4 rounded-2xl border border-background-200 bg-background-50 p-6 text-center md:p-8">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100 text-secondary-800">
              <i className="ri-close-circle-line text-3xl" />
            </span>
            <h1 className="mt-4 font-heading text-xl font-bold text-foreground-950">Ödeme tamamlanamadı</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground-600">
              {info?.errorMessage || "Banka onayı alınamadı veya işlem iptal edildi."}
            </p>
            {orderNo && (
              <p className="mt-3 rounded-lg bg-background-100 px-3 py-2 text-xs text-foreground-600">
                İşlem referansı: <strong className="font-semibold text-foreground-900">{orderNo}</strong>
              </p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-foreground-500">
              Sepetiniz olduğu gibi korundu. Kart bilgilerinizi kontrol edip tekrar deneyebilirsiniz.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/odeme"
                className="flex h-10 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary-800 text-sm font-semibold text-background-50 hover:bg-primary-700"
              >
                Ödemeye Dön
              </Link>
              <Link
                to="/kategoriler"
                className="flex h-10 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-background-300 text-sm font-semibold text-foreground-800 hover:bg-background-100"
              >
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-lg px-4 py-12 md:py-16">
        <CheckoutSteps deliveryDone billingDone paid />
        <div className="mt-4 rounded-2xl border border-background-200 bg-background-50 p-6 text-center md:p-8">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700">
            <i className="ri-checkbox-circle-fill text-3xl" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-bold text-foreground-950">Ödemeniz alındı</h1>
          <p className="mt-1.5 text-sm text-foreground-600">
            Sipariş numaranız{" "}
            <strong className="font-semibold text-foreground-900">#{orderNo}</strong>. Onay e-postası kısa süre içinde
            gönderilecek.
          </p>

          <div className="mt-5 space-y-2 rounded-lg bg-background-100 p-3.5 text-left text-xs">
            <div className="flex justify-between text-foreground-600">
              <span>Tahsil edilen tutar</span>
              <span className="font-semibold text-foreground-950">{formatPrice(info?.amount ?? 0)}</span>
            </div>
            <div className="flex justify-between text-foreground-600">
              <span>Ödeme yöntemi</span>
              <span className="font-medium text-foreground-900">
                {(info?.installment ?? 1) === 1 ? "Tek çekim" : `${info?.installment} taksit`}
                {info?.cardMask ? ` · ${info.cardMask}` : ""}
              </span>
            </div>
            <div className="flex justify-between text-foreground-600">
              <span>Alıcı</span>
              <span className="font-medium text-foreground-900">{info?.buyerName || "—"}</span>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-left text-[11px] leading-relaxed text-accent-900">
            <i className="ri-truck-line mt-0.5" />
            <span>Siparişiniz hazırlanmaya alındı. Kargoya verildiğinde takip numarası e-posta ile paylaşılacaktır.</span>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              to="/"
              className="flex h-10 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary-800 text-sm font-semibold text-background-50 hover:bg-primary-700"
            >
              Anasayfaya Dön
            </Link>
            <Link
              to="/kategoriler"
              className="flex h-10 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-background-300 text-sm font-semibold text-foreground-800 hover:bg-background-100"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}