import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreLayout from "@/components/layout/StoreLayout";
import PaymentBadges from "@/components/base/PaymentBadges";
import PaymentForm from "@/pages/checkout/components/PaymentForm";
import OrderSummary from "@/pages/checkout/components/OrderSummary";
import ThreeDSecureModal from "@/pages/checkout/components/ThreeDSecureModal";
import DeliverySection, { emptyDelivery } from "@/pages/checkout/components/DeliverySection";
import BillingSection from "@/pages/checkout/components/BillingSection";
import CheckoutSteps from "@/pages/checkout/components/CheckoutSteps";
import ConfirmDialog from "@/components/base/ConfirmDialog";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { saveCartToAccount } from "@/lib/savedCarts";
import { useCheckoutPrefill } from "@/hooks/useCheckoutPrefill";
import { createInvoiceForOrder, saveCheckoutAddress } from "@/lib/orderInvoice";
import { savePlacedOrder } from "@/lib/adminOrders";
import { basePath } from "@/lib/supabase";
import {
  isLiveCheckoutAvailable,
  redirectToPaymentPage,
  startLivePayment,
  type LivePaymentItem,
} from "@/lib/iyzico";
import { KEYS, loadIyzicoSettings, loadPayments } from "@/lib/integrations";
import { loadShippingSettings } from "@/lib/shipping";
import { availableCoupons, couponHintLabel } from "@/lib/coupons";
import { writeJson } from "@/lib/persistent";
import { formatPrice } from "@/lib/format";
import type { DeliveryDetails, InvoiceItem } from "@/types/account";
import type { IyzicoSettings, PaymentTransaction } from "@/types/integrations";
import type { CartActionMessage } from "@/pages/checkout/components/OrderSummary";

const SHIPPING_FEE = 49.9;

export default function CheckoutPage() {
  const {
    detailed,
    count,
    total,
    discount,
    payableTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    commitCoupon,
    clearCart,
  } = useCart();
  const { user, profile } = useAuth();
  const { addresses, billing, loading: prefillLoading } = useCheckoutPrefill(user?.id);

  const [settings] = useState<IyzicoSettings>(() => loadIyzicoSettings());
  const [shippingSettings] = useState(() => loadShippingSettings());
  const [installment, setInstallment] = useState(1);
  const [couponError, setCouponError] = useState("");
  const [couponHints] = useState<string[]>(() =>
    availableCoupons()
      .slice(0, 3)
      .map((campaign) => `${campaign.code} · ${couponHintLabel(campaign)}`)
  );
  const [threeD, setThreeD] = useState<{ cardMask: string; cardName: string } | null>(null);
  const [done, setDone] = useState<PaymentTransaction | null>(null);
  const [invoiceCreated, setInvoiceCreated] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryDetails>(emptyDelivery);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [autofilled, setAutofilled] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [savingCart, setSavingCart] = useState(false);
  const [cartMessage, setCartMessage] = useState<CartActionMessage | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const shipping =
    shippingSettings.freeShippingEnabled ||
    coupon?.freeShipping ||
    payableTotal >= shippingSettings.freeShippingThreshold
      ? 0
      : SHIPPING_FEE;
  const grandTotal = payableTotal + shipping;

  const deliveryDone =
    delivery.fullName.trim().length >= 3 &&
    delivery.phone.replace(/\D/g, "").length >= 10 &&
    delivery.address.trim().length >= 10 &&
    delivery.city.trim().length > 0;
  const billingDone = Boolean(billing);

  const selectedPlan = useMemo(
    () => settings.plans.find((plan) => plan.count === installment) ?? settings.plans[0],
    [installment, settings.plans]
  );
  const payable = grandTotal * (1 + (selectedPlan?.rate ?? 0) / 100);

  // Fill empty fields from the customer profile right after sign-in.
  useEffect(() => {
    if (!user) return;
    setDelivery((current) => ({
      fullName: current.fullName || profile?.full_name || "",
      phone: current.phone || profile?.phone || "",
      address: current.address,
      city: current.city,
      district: current.district,
    }));
  }, [user, profile]);

  // Select the default saved address automatically.
  useEffect(() => {
    if (addresses.length === 0) return;
    setSelectedAddressId((current) => (current === "" ? addresses[0].id : current));
  }, [addresses]);

  // Apply the selected saved address to the delivery form.
  useEffect(() => {
    const row = addresses.find((item) => item.id === selectedAddressId);
    if (!row) return;
    setDelivery({
      fullName: row.full_name || profile?.full_name || "",
      phone: row.phone || profile?.phone || "",
      address: row.address_line || "",
      city: row.city || "",
      district: row.district || "",
    });
    setAutofilled(true);
  }, [selectedAddressId, addresses, profile]);

  const updateDelivery = (patch: Partial<DeliveryDetails>) => {
    setDelivery((current) => ({ ...current, ...patch }));
    setAutofilled(false);
  };

  const handleApplyCoupon = (code: string) => {
    const result = applyCoupon(code);
    setCouponError(result.ok ? "" : result.message);
  };

  const handleSaveCart = async () => {
    if (!user) {
      setCartMessage({ tone: "error", text: "Sepeti kaydetmek için hesabınıza giriş yapmanız gerekiyor." });
      return;
    }
    if (detailed.length === 0) return;
    setSavingCart(true);
    setCartMessage(null);
    try {
      const cartLines = detailed.map(({ product, quantity, variantLabel, unitPrice }) => ({
        productId: product.id,
        quantity,
        variantLabel: variantLabel || undefined,
        unitPrice,
      }));
      await saveCartToAccount({ userId: user.id, lines: cartLines, itemCount: count, total });
      setCartMessage({
        tone: "success",
        text: "Sepetiniz hesabınıza kaydedildi. Hesabım sayfasındaki “Kaydedilen Sepetler” bölümünden dilediğiniz zaman geri yükleyebilirsiniz.",
      });
    } catch {
      setCartMessage({ tone: "error", text: "Sepet kaydedilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin." });
    } finally {
      setSavingCart(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setCouponError("");
    setCartMessage(null);
    setClearConfirmOpen(false);
  };

  const buildBasket = (): LivePaymentItem[] => {
    const lines: LivePaymentItem[] = detailed.map(({ product, quantity, variantLabel, unitPrice }) => ({
      id: product.id,
      name: variantLabel ? `${product.name} (${variantLabel})` : product.name,
      price: unitPrice,
      quantity,
    }));
    if (shipping > 0) {
      lines.push({ id: "SHIPPING", name: "Kargo ücreti", price: Number(shipping.toFixed(2)), quantity: 1 });
    }
    const interest = Number((payable - grandTotal).toFixed(2));
    if (interest > 0.01) {
      lines.push({ id: "INSTALLMENT", name: `Taksit farkı (${installment} taksit)`, price: interest, quantity: 1 });
    }
    return lines;
  };

  const handleSubmit = async () => {
    if (delivery.fullName.trim().length < 3) {
      setDeliveryError("Teslimat için ad soyad girin.");
      return;
    }
    if (delivery.phone.replace(/\D/g, "").length < 10) {
      setDeliveryError("Geçerli bir telefon numarası girin.");
      return;
    }
    if (delivery.address.trim().length < 10) {
      setDeliveryError("Açık adres bilgisini girin (en az 10 karakter).");
      return;
    }
    if (!delivery.city) {
      setDeliveryError("İl seçin.");
      return;
    }
    setDeliveryError("");
    setPaymentError("");

    if (!isLiveCheckoutAvailable()) {
      setThreeD({ cardMask: "**** **** **** 0000", cardName: delivery.fullName });
      return;
    }

    setProcessing(true);
    const result = await startLivePayment({
      items: buildBasket(),
      buyer: {
        fullName: delivery.fullName,
        email: user?.email ?? "misafir.musteri@brothersteknoloji.com",
        phone: delivery.phone,
        address: `${delivery.address}${delivery.district ? ` / ${delivery.district}` : ""}`,
        city: delivery.city,
      },
      installment,
      siteUrl: `${window.location.origin}${basePath.replace(/\/+$/, "")}`,
    });
    setProcessing(false);

    if (result.ok) {
      redirectToPaymentPage(result.paymentPageUrl);
      return;
    }

    setPaymentError(result.message);
  };

  const approvePayment = () => {
    const orderNo = `iyz-${Date.now().toString().slice(-7)}`;
    const transaction: PaymentTransaction = {
      id: orderNo,
      customer: threeD?.cardName ?? delivery.fullName,
      email: user?.email ?? "misafir.musteri@brothersteknoloji.com",
      amount: payable,
      installment,
      cardMask: threeD?.cardMask ?? "**** **** **** 0000",
      status: "success",
      date: new Date().toLocaleString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const invoiceItems: InvoiceItem[] = detailed.map(({ product, quantity, variantLabel, unitPrice }) => ({
      name: variantLabel ? `${product.name} (${variantLabel})` : product.name,
      brand: product.brand,
      quantity,
      unit_price: unitPrice,
    }));

    writeJson(KEYS.payments, [transaction, ...loadPayments()]);
    savePlacedOrder({
      id: `#${orderNo.toUpperCase()}`,
      orderNo,
      source: "local",
      customer: transaction.customer,
      email: transaction.email,
      phone: delivery.phone,
      date: transaction.date,
      createdAt: new Date().toISOString(),
      status: "Hazırlanıyor",
      payment: `${installment > 1 ? `${installment} taksit` : "Tek çekim"} · ${transaction.cardMask}`,
      address: delivery.address,
      city: `${delivery.city}${delivery.district ? ` / ${delivery.district}` : ""}`,
      cargo: "—",
      tracking: "—",
      note: "",
      amount: payable,
      lines: detailed.map(({ product, quantity, variantLabel, unitPrice }) => ({
        name: variantLabel ? `${product.name} (${variantLabel})` : product.name,
        brand: product.brand,
        image: product.image,
        quantity,
        price: unitPrice,
      })),
    });
    commitCoupon();
    setThreeD(null);
    setDone(transaction);
    setInvoiceCreated(false);
    clearCart();

    const currentUser = user;
    const currentDelivery = delivery;
    const shouldSaveAddress = saveAddress && !selectedAddressId && currentDelivery.address.trim().length > 0;
    if (!currentUser) return;

    void (async () => {
      const created = await createInvoiceForOrder({
        userId: currentUser.id,
        orderNo: transaction.id.toUpperCase(),
        amount: payable,
        billing,
        fallbackName: currentDelivery.fullName,
        items: invoiceItems,
      });
      setInvoiceCreated(created);

      if (shouldSaveAddress) {
        await saveCheckoutAddress({
          userId: currentUser.id,
          delivery: currentDelivery,
          isDefault: addresses.length === 0,
        });
      }
    })();
  };

  if (done) {
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
              Sipariş numaranız <strong className="font-semibold text-foreground-900">#{done.id.toUpperCase()}</strong>. Onay
              e-postası kısa süre içinde gönderilecek.
            </p>

            <div className="mt-5 space-y-2 rounded-lg bg-background-100 p-3.5 text-left text-xs">
              <div className="flex justify-between text-foreground-600">
                <span>Tahsil edilen tutar</span>
                <span className="font-semibold text-foreground-950">{formatPrice(done.amount)}</span>
              </div>
              <div className="flex justify-between text-foreground-600">
                <span>Ödeme yöntemi</span>
                <span className="font-medium text-foreground-900">
                  {done.installment === 1 ? "Tek çekim" : `${done.installment} taksit`} · {done.cardMask}
                </span>
              </div>
              <div className="flex justify-between text-foreground-600">
                <span>Teslimat</span>
                <span className="font-medium text-foreground-900">
                  {delivery.city} · {delivery.fullName}
                </span>
              </div>
            </div>

            {invoiceCreated && (
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-left text-[11px] leading-relaxed text-accent-900">
                <i className="ri-file-text-line mt-0.5" />
                <span>
                  E-faturanız otomatik oluşturuldu.{" "}
                  <Link to="/hesabim?sekme=faturalar" className="font-semibold underline decoration-dotted">
                    Faturalarım
                  </Link>{" "}
                  sekmesinden görüntüleyebilirsiniz.
                </span>
              </div>
            )}

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

  if (detailed.length === 0) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-lg px-4 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background-100">
            <i className="ri-shopping-cart-2-line text-2xl text-foreground-400" />
          </span>
          <h1 className="mt-4 font-heading text-lg font-bold text-foreground-950">Sepetiniz boş</h1>
          <p className="mt-1.5 text-sm text-foreground-500">Ödeme adımına geçmek için sepetinize ürün ekleyin.</p>
          <Link
            to="/"
            className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary-800 px-5 text-sm font-semibold text-background-50 hover:bg-primary-700"
          >
            Ürünleri Keşfet
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <nav className="flex items-center gap-1.5 text-[11px] text-foreground-500">
          <Link to="/" className="hover:text-foreground-900">
            Anasayfa
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span>Sepet</span>
          <i className="ri-arrow-right-s-line" />
          <span className="font-semibold text-foreground-900">Güvenli Ödeme</span>
        </nav>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground-950 md:text-2xl">Güvenli Ödeme</h1>
            <p className="mt-1 text-sm text-foreground-500">Teslimat bilgilerini girin ve kartınızla ödemeyi tamamlayın.</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="flex items-center gap-1.5 rounded-lg border border-background-200 bg-background-50 px-2.5 py-1.5 text-[11px] text-foreground-600">
              <i className="ri-lock-2-line text-accent-700" />
              iyzico ile korunan ödeme
            </div>
            <PaymentBadges size="sm" />
          </div>
        </div>

        <div className="mt-4">
          <CheckoutSteps deliveryDone billingDone paid={false} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div id="adim-teslimat" className="scroll-mt-28">
              <DeliverySection
                addresses={addresses}
                loading={prefillLoading}
                form={delivery}
                autofilled={autofilled}
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
                onChange={updateDelivery}
                saveAddress={saveAddress}
                onToggleSaveAddress={setSaveAddress}
                loggedIn={Boolean(user)}
                error={deliveryError}
              />
            </div>

            <div id="adim-fatura" className="scroll-mt-28">
              <BillingSection billing={billing} loading={prefillLoading} loggedIn={Boolean(user)} email={user?.email ?? ""} />
            </div>

            <div id="adim-odeme" className="scroll-mt-28">
              <PaymentForm
                plans={settings.plans}
                total={grandTotal}
                installment={installment}
                onInstallment={setInstallment}
                onSubmit={handleSubmit}
                threeDSecure={settings.threeDSecure}
                enabled={settings.enabled}
                processing={processing}
              />
              {paymentError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-secondary-300 bg-secondary-100 px-3 py-2.5 text-xs leading-relaxed text-secondary-950">
                  <i className="ri-error-warning-line mt-0.5" />
                  <span>{paymentError}</span>
                </div>
              )}
            </div>
          </div>

          <OrderSummary
            lines={detailed}
            subtotal={total}
            discount={discount}
            shipping={shipping}
            total={grandTotal}
            coupon={coupon}
            couponError={couponError}
            couponHints={couponHints}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={() => {
              removeCoupon();
              setCouponError("");
            }}
            plan={selectedPlan ?? null}
            onClearCart={() => setClearConfirmOpen(true)}
            onSaveCart={() => void handleSaveCart()}
            savingCart={savingCart}
            canSaveCart={Boolean(user)}
            cartMessage={cartMessage}
          />
        </div>
      </div>

      <ConfirmDialog
        open={clearConfirmOpen}
        title="Sepeti boşalt"
        subtitle="Sepetinizdeki tüm ürünler kaldırılacak"
        icon="ri-delete-bin-6-line"
        confirmLabel="Sepeti boşalt"
        onCancel={() => setClearConfirmOpen(false)}
        onConfirm={handleClearCart}
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          Sepetinizde <strong className="font-semibold text-foreground-950">{count} ürün</strong> bulunuyor. Devam
          ederseniz tüm ürünler ve uygulanan kupon kaldırılacak.
        </p>
      </ConfirmDialog>

      <ThreeDSecureModal
        open={threeD !== null}
        amount={payable}
        cardMask={threeD?.cardMask ?? ""}
        merchant="Brothers Teknoloji"
        onClose={() => setThreeD(null)}
        onApprove={approvePayment}
      />
    </StoreLayout>
  );
}