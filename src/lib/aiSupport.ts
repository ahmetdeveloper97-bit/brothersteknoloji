import { readAdminToken } from "@/lib/adminStaffStore";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type {
  AiActionResult,
  AiAdminConfig,
  AiChatMessage,
  AiProviderId,
  AiPublicConfig,
} from "@/types/aiSupport";

export interface AiProviderMeta {
  id: AiProviderId;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
  defaultBase: string;
  defaultModel: string;
  modelSuggestions: string[];
  basePlaceholder: string;
  keyLabel: string;
  keyUrl: string;
}

export const AI_PROVIDERS: AiProviderMeta[] = [
  {
    id: "chatgpt",
    label: "ChatGPT (OpenAI)",
    shortLabel: "ChatGPT",
    description: "OpenAI'nin ChatGPT modelleri. En yaygın ve hızlı kurulum.",
    icon: "ri-chat-3-line",
    defaultBase: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    modelSuggestions: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-3.5-turbo"],
    basePlaceholder: "https://api.openai.com/v1",
    keyLabel: "OpenAI API anahtarı",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "openai",
    label: "OpenAI API (Özel adres)",
    shortLabel: "OpenAI",
    description: "OpenAI kurumsal / proxy adresinizi kullanın. OpenAI uyumlu protokol.",
    icon: "ri-robot-2-line",
    defaultBase: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    modelSuggestions: ["gpt-4o-mini", "gpt-4o", "gpt-4.1"],
    basePlaceholder: "https://api.openai.com/v1",
    keyLabel: "OpenAI API anahtarı",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    shortLabel: "Gemini",
    description: "Google AI Studio üzerinden alınan Gemini API anahtarı ile çalışır.",
    icon: "ri-flashlight-line",
    defaultBase: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-2.5-flash",
    modelSuggestions: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"],
    basePlaceholder: "https://generativelanguage.googleapis.com/v1beta",
    keyLabel: "Gemini API anahtarı",
    keyUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "claude",
    label: "Anthropic Claude",
    shortLabel: "Claude",
    description: "Anthropic Claude modelleri. Uzun ve detaylı yanıtlarda güçlüdür.",
    icon: "ri-sparkling-line",
    defaultBase: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-5-sonnet-latest",
    modelSuggestions: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-opus-latest"],
    basePlaceholder: "https://api.anthropic.com/v1",
    keyLabel: "Anthropic API anahtarı",
    keyUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "compatible",
    label: "Diğer (OpenAI uyumlu)",
    shortLabel: "Diğer",
    description: "OpenAI protokolünü destekleyen yerli veya özel bir sağlayıcı kullanın.",
    icon: "ri-plug-line",
    defaultBase: "",
    defaultModel: "",
    modelSuggestions: ["gpt-4o-mini"],
    basePlaceholder: "https://sunucunuz.com/v1",
    keyLabel: "API anahtarı",
    keyUrl: "",
  },
];

export const providerMeta = (id: AiProviderId): AiProviderMeta =>
  AI_PROVIDERS.find((item) => item.id === id) ?? AI_PROVIDERS[0];

const isProviderId = (value: unknown): value is AiProviderId =>
  AI_PROVIDERS.some((item) => item.id === value);

const CHAT_KEY = "eticaretv8_ai_support_chat";
const MAX_CHAT_MESSAGES = 60;

export const readChatHistory = (): AiChatMessage[] => {
  try {
    const raw = window.sessionStorage.getItem(CHAT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AiChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && (item.role === "user" || item.role === "assistant"))
      .slice(-MAX_CHAT_MESSAGES);
  } catch {
    return [];
  }
};

export const writeChatHistory = (messages: AiChatMessage[]): void => {
  try {
    window.sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-MAX_CHAT_MESSAGES)));
  } catch {
    /* storage may be unavailable */
  }
};

export const clearChatHistory = (): void => {
  try {
    window.sessionStorage.removeItem(CHAT_KEY);
  } catch {
    /* storage may be unavailable */
  }
};

const invoke = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }
  try {
    const { data, error } = await supabase.functions.invoke("ai-support", { body });
    if (error) {
      let message = "Yapay zeka servisine ulaşılamadı. Lütfen tekrar deneyin.";
      let code = "network";
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
    return (data as Record<string, unknown> | null) ?? { ok: false, code: "empty", message: "Boş yanıt." };
  } catch {
    return { ok: false, code: "network", message: "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin." };
  }
};

const DEFAULT_PUBLIC: AiPublicConfig = {
  enabled: false,
  ready: false,
  welcomeMessage: "Merhaba! Size nasıl yardımcı olabilirim?",
  quickQuestions: [],
  provider: "chatgpt",
};

export const fetchAiPublicConfig = async (): Promise<AiPublicConfig> => {
  const payload = await invoke({ action: "public_config" });
  const raw = payload.config as Record<string, unknown> | undefined;
  if (!payload.ok || !raw) return DEFAULT_PUBLIC;
  const provider = isProviderId(raw.provider) ? raw.provider : "chatgpt";
  return {
    enabled: Boolean(raw.enabled),
    ready: Boolean(raw.ready),
    welcomeMessage: String(raw.welcomeMessage ?? DEFAULT_PUBLIC.welcomeMessage),
    quickQuestions: Array.isArray(raw.quickQuestions)
      ? raw.quickQuestions.map((item) => String(item)).filter((item) => item.length > 0).slice(0, 4)
      : [],
    provider,
  };
};

export interface AiChatResult {
  ok: boolean;
  reply?: string;
  message?: string;
}

export const sendAiChatMessage = async (
  messages: AiChatMessage[],
  page?: string,
): Promise<AiChatResult> => {
  const payload = await invoke({
    action: "chat",
    page: page ?? "",
    messages: messages.map((item) => ({ role: item.role, content: item.content.slice(0, 1200) })),
  });
  if (!payload.ok) {
    return { ok: false, message: String(payload.message ?? "Yanıt alınamadı.") };
  }
  return { ok: true, reply: String(payload.reply ?? "") };
};

const adminCall = async (body: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const token = readAdminToken();
  if (!token) {
    return {
      ok: false,
      code: "unauthorized",
      message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapın.",
    };
  }
  return invoke({ ...body, token });
};

const EMPTY_ADMIN: AiAdminConfig = {
  provider: "chatgpt",
  apiBaseUrl: "",
  model: "",
  hasKey: false,
  keyHint: "",
  systemPrompt: "",
  welcomeMessage: "Merhaba! Ben yapay zeka destek asistanıyım. Size nasıl yardımcı olabilirim?",
  quickQuestions: ["Kargo ne zaman gelir?", "İade koşulları nedir?", "Taksit seçenekleri neler?"],
  enabled: false,
};

export interface AiAdminReadResult {
  ok: boolean;
  message?: string;
  config: AiAdminConfig;
}

export const readAiConfig = async (): Promise<AiAdminReadResult> => {
  const payload = await adminCall({ action: "admin_read" });
  if (!payload.ok) {
    return {
      ok: false,
      message: String(payload.message ?? "Ayarlar yüklenemedi."),
      config: EMPTY_ADMIN,
    };
  }
  const raw = (payload.config as Record<string, unknown> | undefined) ?? {};
  return {
    ok: true,
    config: {
      provider: isProviderId(raw.provider) ? raw.provider : "chatgpt",
      apiBaseUrl: String(raw.apiBaseUrl ?? ""),
      model: String(raw.model ?? ""),
      hasKey: Boolean(raw.hasKey),
      keyHint: String(raw.keyHint ?? ""),
      systemPrompt: String(raw.systemPrompt ?? ""),
      welcomeMessage: String(raw.welcomeMessage ?? EMPTY_ADMIN.welcomeMessage),
      quickQuestions: Array.isArray(raw.quickQuestions)
        ? raw.quickQuestions.map((item) => String(item)).slice(0, 4)
        : [],
      enabled: Boolean(raw.enabled),
    },
  };
};

export const saveAiConfig = async (
  config: AiAdminConfig,
  apiKey: string,
): Promise<AiActionResult & { keyHint?: string; hasKey?: boolean }> => {
  const payload = await adminCall({
    action: "admin_save",
    provider: config.provider,
    apiBaseUrl: config.apiBaseUrl,
    model: config.model,
    apiKey,
    systemPrompt: config.systemPrompt,
    welcomeMessage: config.welcomeMessage,
    quickQuestions: config.quickQuestions,
    enabled: config.enabled,
  });
  if (!payload.ok) {
    return { ok: false, code: String(payload.code ?? "error"), message: String(payload.message ?? "Ayarlar kaydedilemedi.") };
  }
  return { ok: true, keyHint: String(payload.keyHint ?? ""), hasKey: Boolean(payload.hasKey) };
};

export const testAiConfig = async (
  config: AiAdminConfig,
  apiKey: string,
): Promise<AiActionResult> => {
  const payload = await adminCall({
    action: "admin_test",
    provider: config.provider,
    apiBaseUrl: config.apiBaseUrl,
    model: config.model,
    apiKey,
    systemPrompt: config.systemPrompt,
  });
  if (!payload.ok) {
    return { ok: false, code: String(payload.code ?? "error"), message: String(payload.message ?? "Bağlantı testi başarısız.") };
  }
  return { ok: true, reply: String(payload.reply ?? "") };
};

export const clearAiApiKey = async (): Promise<AiActionResult> => {
  const payload = await adminCall({ action: "admin_clear_key" });
  if (!payload.ok) {
    return { ok: false, message: String(payload.message ?? "Anahtar silinemedi.") };
  }
  return { ok: true };
};