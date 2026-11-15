import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const PANEL_KEY_STORAGE = "eticaretv8_panel_key";

export interface PanelOrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PanelOrderRow {
  order_no: string;
  status: string;
  order_status: string | null;
  amount: number;
  installment: number;
  buyer_name: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  buyer_city: string | null;
  buyer_address: string | null;
  card_mask: string | null;
  items: PanelOrderItem[] | null;
  error_message: string | null;
  created_at: string;
}

export interface PanelResult<T> {
  ok: boolean;
  code?: string;
  message?: string;
  data?: T;
}

export const readPanelKey = (): string => {
  try {
    return window.localStorage.getItem(PANEL_KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
};

export const writePanelKey = (key: string): void => {
  try {
    window.localStorage.setItem(PANEL_KEY_STORAGE, key);
  } catch {
    /* storage may be unavailable */
  }
};

export const clearPanelKey = (): void => {
  try {
    window.localStorage.removeItem(PANEL_KEY_STORAGE);
  } catch {
    /* storage may be unavailable */
  }
};

/** Tarayıcıda güvenli rastgele anahtar üretir. */
export const generatePanelKey = (): string => {
  const alphabet = "abcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => alphabet[byte % alphabet.length])
    .join("");
};

const invoke = async <T>(body: Record<string, unknown>): Promise<PanelResult<T>> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }

  try {
    const { data, error } = await supabase.functions.invoke("panel-orders", { body });

    if (error) {
      let code = "network";
      let message = "Sipariş servisine ulaşılamadı.";
      try {
        const context = (error as unknown as { context?: { json?: () => Promise<unknown> } }).context;
        if (context && typeof context.json === "function") {
          const parsed = (await context.json()) as { code?: string; message?: string } | null;
          if (parsed?.code) code = String(parsed.code);
          if (parsed?.message) message = String(parsed.message);
        }
      } catch {
        /* yanıt gövdesi okunamadı */
      }
      return { ok: false, code, message };
    }

    if (!data || data.ok !== true) {
      return {
        ok: false,
        code: String(data?.code ?? "error"),
        message: String(data?.message ?? "İşlem tamamlanamadı."),
      };
    }

    return { ok: true, data: data as T };
  } catch {
    return { ok: false, code: "network", message: "Sipariş servisine ulaşılamadı." };
  }
};

export const panelKeyExists = async (): Promise<PanelResult<{ configured: boolean }>> =>
  invoke<{ configured: boolean }>({ action: "exists" });

export const panelSetupKey = async (key: string): Promise<PanelResult<Record<string, never>>> =>
  invoke<Record<string, never>>({ action: "setup", key });

export const panelListOrders = async (key: string): Promise<PanelResult<{ orders: PanelOrderRow[] }>> =>
  invoke<{ orders: PanelOrderRow[] }>({ action: "list", key });

export const panelUpdateOrderStatus = async (
  key: string,
  orderNo: string,
  orderStatus: string,
): Promise<PanelResult<Record<string, never>>> =>
  invoke<Record<string, never>>({ action: "status", key, orderNo, orderStatus });