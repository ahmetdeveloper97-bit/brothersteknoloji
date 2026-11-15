import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface LivePaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface LivePaymentBuyer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export interface StartPaymentInput {
  items: LivePaymentItem[];
  buyer: LivePaymentBuyer;
  installment: number;
  siteUrl: string;
}

export interface StartPaymentSuccess {
  ok: true;
  orderNo: string;
  paymentPageUrl: string;
  amount: number;
}

export interface StartPaymentFailure {
  ok: false;
  code: string;
  message: string;
}

export type StartPaymentResult = StartPaymentSuccess | StartPaymentFailure;

export interface PaymentResultInfo {
  orderNo: string;
  status: string;
  amount: number;
  installment: number;
  buyerName: string;
  cardMask: string;
  errorMessage: string;
}

export const isLiveCheckoutAvailable = (): boolean => isSupabaseConfigured;

export const startLivePayment = async (input: StartPaymentInput): Promise<StartPaymentResult> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Ödeme sunucusu yapılandırılmamış." };
  }

  try {
    const { data, error } = await supabase.functions.invoke("iyzico-init", { body: input });

    if (error) {
      return { ok: false, code: "network", message: "Ödeme servisine ulaşılamadı. Lütfen tekrar deneyin." };
    }

    if (!data || data.ok !== true) {
      return {
        ok: false,
        code: String(data?.code ?? "iyzico_error"),
        message: String(data?.message ?? "Ödeme başlatılamadı."),
      };
    }

    return {
      ok: true,
      orderNo: String(data.orderNo),
      paymentPageUrl: String(data.paymentPageUrl),
      amount: Number(data.amount ?? 0),
    };
  } catch {
    return { ok: false, code: "network", message: "Ödeme servisine ulaşılamadı. Lütfen tekrar deneyin." };
  }
};

export const fetchPaymentResult = async (orderNo: string): Promise<PaymentResultInfo | null> => {
  if (!isSupabaseConfigured || !orderNo) return null;

  try {
    const { data, error } = await supabase.functions.invoke("iyzico-verify", {
      body: { order: orderNo },
    });
    if (error || !data || data.ok !== true) return null;

    return {
      orderNo: String(data.orderNo ?? orderNo),
      status: String(data.status ?? "pending"),
      amount: Number(data.amount ?? 0),
      installment: Number(data.installment ?? 1),
      buyerName: String(data.buyerName ?? ""),
      cardMask: String(data.cardMask ?? ""),
      errorMessage: String(data.errorMessage ?? ""),
    };
  } catch {
    return null;
  }
};

/**
 * Kart bilgisi toplamadan, iyzico'nun kendi barındırdığı ödeme sayfasına yönlendirir.
 * Böylece kart verisi hiçbir zaman sitemizin sunucusuna veya tarayıcı deposuna yazılmaz.
 */
export const redirectToPaymentPage = (paymentPageUrl: string): void => {
  const link = document.createElement("a");
  link.href = paymentPageUrl;
  link.rel = "noopener noreferrer";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => link.remove(), 1000);
};