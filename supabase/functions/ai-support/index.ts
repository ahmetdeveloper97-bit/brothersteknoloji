import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const SETTINGS_ID = "default";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiConfig {
  provider: string;
  api_base_url: string;
  model: string;
  api_key: string;
  system_prompt: string;
  welcome_message: string;
  quick_questions: string[];
  enabled: boolean;
}

const DEFAULT_BASE: Record<string, string> = {
  chatgpt: "https://api.openai.com/v1",
  openai: "https://api.openai.com/v1",
  compatible: "",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  claude: "https://api.anthropic.com/v1",
};

const DEFAULT_MODEL: Record<string, string> = {
  chatgpt: "gpt-4o-mini",
  openai: "gpt-4o-mini",
  compatible: "gpt-4o-mini",
  gemini: "gemini-2.5-flash",
  claude: "claude-3-5-sonnet-latest",
};

const DEFAULT_SYSTEM_PROMPT =
  "Sen Brothers Teknoloji mağazasının yapay zeka destek asistanısın. Türkçe, kısa ve net yanıtlar ver. " +
  "Ürünler, kargo süreleri, ödeme seçenekleri, iade ve garanti konularında yardımcı ol. " +
  "Bilmediğin ya da emin olmadığın bilgileri uydurma; gerekirse müşteriyi WhatsApp destek hattına yönlendir.";

const DEFAULT_WELCOME =
  "Merhaba! Ben yapay zeka destek asistanıyım. Ürünler, kargo, ödeme ve garanti konularında yardımcı olabilirim.";

const DEFAULT_QUESTIONS = ["Kargo ne zaman gelir?", "İade koşulları nedir?", "Taksit seçenekleri neler?"];

const cleanText = (value: unknown, max = 2000): string =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const verifyAdminSession = async (
  admin: ReturnType<typeof createClient>,
  token: string,
): Promise<boolean> => {
  if (!token) return false;
  const { data, error } = await admin
    .from("admin_sessions")
    .select("staff_id,expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return false;
  if (new Date(String(data.expires_at)).getTime() < Date.now()) return false;

  const { data: member, error: memberError } = await admin
    .from("admin_staff")
    .select("id,active")
    .eq("id", String(data.staff_id))
    .maybeSingle();
  if (memberError || !member) return false;
  return Boolean(member.active);
};

const normalizeBase = (provider: string, raw: string): string => {
  const value = String(raw ?? "").trim().replace(/\/+$/, "");
  if (!value) return DEFAULT_BASE[provider] ?? "";
  return value;
};

const maskKey = (key: string): string => {
  if (!key) return "";
  return `••••••••••••${key.slice(-4)}`;
};

const errorText = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    if (!text) return `Sağlayıcı ${response.status} hatası döndü.`;
    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      const err = parsed?.error as Record<string, unknown> | string | undefined;
      if (typeof err === "string") return cleanText(err, 240);
      if (err && typeof err === "object") {
        const message = cleanText(err.message ?? err.status ?? "", 240);
        if (message) return message;
      }
      const message = cleanText(parsed?.message ?? "", 240);
      if (message) return message;
      return cleanText(text, 240);
    } catch {
      return cleanText(text, 240);
    }
  } catch {
    return `Sağlayıcı ${response.status} hatası döndü.`;
  }
};

type CallResult = { ok: true; reply: string } | { ok: false; message: string };

const callProvider = async (config: AiConfig, rawMessages: ChatMessage[]): Promise<CallResult> => {
  const provider = String(config.provider || "openai");
  const base = normalizeBase(provider, config.api_base_url);
  const model = String(config.model || "").trim() || DEFAULT_MODEL[provider] || "";
  const key = String(config.api_key || "").trim();
  const system = String(config.system_prompt || "").trim() || DEFAULT_SYSTEM_PROMPT;

  if (!base) return { ok: false, message: "API adresi tanımlı değil." };
  if (!key) return { ok: false, message: "API anahtarı tanımlı değil." };
  if (!model) return { ok: false, message: "Model adı tanımlı değil." };

  const messages: ChatMessage[] = rawMessages
    .slice(-12)
    .map((item) => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: cleanText(item.content, 1200),
    }))
    .filter((item) => item.content.length > 0);

  if (messages.length === 0) return { ok: false, message: "Mesaj bulunamadı." };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 28000);

  try {
    if (provider === "gemini") {
      const url = `${base}/models/${encodeURIComponent(model)}:generateContent`;
      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [{ text: message.content }],
          })),
          generationConfig: { temperature: 0.6, maxOutputTokens: 900 },
        }),
      });
      if (!response.ok) return { ok: false, message: await errorText(response) };
      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const reply =
        data.candidates?.[0]?.content?.parts
          ?.map((part) => String(part?.text ?? ""))
          .join("")
          .trim() ?? "";
      if (!reply) return { ok: false, message: "Sağlayıcıdan yanıt alınamadı." };
      return { ok: true, reply };
    }

    if (provider === "claude") {
      const url = `${base}/messages`;
      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model, max_tokens: 900, temperature: 0.6, system, messages }),
      });
      if (!response.ok) return { ok: false, message: await errorText(response) };
      const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> };
      const reply =
        data.content
          ?.filter((block) => block?.type === "text")
          .map((block) => String(block?.text ?? ""))
          .join("")
          .trim() ?? "";
      if (!reply) return { ok: false, message: "Sağlayıcıdan yanıt alınamadı." };
      return { ok: true, reply };
    }

    const url = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
    const response = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 900,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    if (!response.ok) return { ok: false, message: await errorText(response) };
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = String(data.choices?.[0]?.message?.content ?? "").trim();
    if (!reply) return { ok: false, message: "Sağlayıcıdan yanıt alınamadı." };
    return { ok: true, reply };
  } catch (error) {
    const aborted = (error as { name?: string })?.name === "AbortError";
    return {
      ok: false,
      message: aborted
        ? "Yapay zeka sağlayıcısı zamanında yanıt vermedi."
        : "Yapay zeka sağlayıcısına bağlanılamadı. API adresini kontrol edin.",
    };
  } finally {
    clearTimeout(timer);
  }
};

const normalizeQuestions = (value: unknown): string[] => {
  if (!Array.isArray(value)) return DEFAULT_QUESTIONS;
  const list = value.map((item) => cleanText(item, 90)).filter((item) => item.length > 0);
  return list.slice(0, 4);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, code: "not_configured", message: "Sunucu yapılandırması eksik." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const action = String(payload.action ?? "public_config");

  const readConfig = async (): Promise<AiConfig | null> => {
    const { data, error } = await admin
      .from("ai_support_settings")
      .select("*")
      .eq("id", SETTINGS_ID)
      .maybeSingle();
    if (error || !data) return null;
    return {
      provider: String(data.provider ?? "openai"),
      api_base_url: String(data.api_base_url ?? ""),
      model: String(data.model ?? ""),
      api_key: String(data.api_key ?? ""),
      system_prompt: String(data.system_prompt ?? ""),
      welcome_message: String(data.welcome_message ?? ""),
      quick_questions: normalizeQuestions(data.quick_questions),
      enabled: Boolean(data.enabled),
    };
  };

  if (action === "public_config") {
    const config = await readConfig();
    if (!config) {
      return json({
        ok: true,
        config: {
          enabled: false,
          welcomeMessage: DEFAULT_WELCOME,
          quickQuestions: DEFAULT_QUESTIONS,
          provider: "openai",
          ready: false,
        },
      });
    }
    return json({
      ok: true,
      config: {
        enabled: config.enabled,
        welcomeMessage: config.welcome_message || DEFAULT_WELCOME,
        quickQuestions: config.quick_questions.length > 0 ? config.quick_questions : DEFAULT_QUESTIONS,
        provider: config.provider,
        ready: config.enabled && Boolean(config.api_key),
      },
    });
  }

  if (action === "chat") {
    const config = await readConfig();
    if (!config) {
      return json({ ok: false, code: "not_configured", message: "Yapay zeka destek asistanı henüz ayarlanmadı." });
    }
    if (!config.enabled) {
      return json({
        ok: false,
        code: "disabled",
        message: "Yapay zeka asistanı şu anda kapalı. WhatsApp destek hattımızdan bize ulaşabilirsiniz.",
      });
    }

    const incoming = Array.isArray(payload.messages) ? (payload.messages as ChatMessage[]) : [];
    const result = await callProvider(config, incoming);
    if (!result.ok) {
      return json({ ok: false, code: "provider_error", message: result.message });
    }
    return json({ ok: true, reply: result.reply });
  }

  const token = String(payload.token ?? "").trim();
  const authorized = await verifyAdminSession(admin, token);
  if (!authorized) {
    return json(
      {
        ok: false,
        code: "unauthorized",
        message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapıp tekrar deneyin.",
      },
      401,
    );
  }

  if (action === "admin_read") {
    const config = await readConfig();
    return json({
      ok: true,
      config: config
        ? {
            provider: config.provider,
            apiBaseUrl: config.api_base_url,
            model: config.model,
            hasKey: Boolean(config.api_key),
            keyHint: maskKey(config.api_key),
            systemPrompt: config.system_prompt,
            welcomeMessage: config.welcome_message,
            quickQuestions: config.quick_questions,
            enabled: config.enabled,
          }
        : {
            provider: "chatgpt",
            apiBaseUrl: "",
            model: "",
            hasKey: false,
            keyHint: "",
            systemPrompt: "",
            welcomeMessage: DEFAULT_WELCOME,
            quickQuestions: DEFAULT_QUESTIONS,
            enabled: false,
          },
    });
  }

  if (action === "admin_save") {
    const provider = String(payload.provider ?? "chatgpt").trim();
    const apiBaseUrl = cleanText(payload.apiBaseUrl, 300);
    const model = cleanText(payload.model, 120);
    const apiKey = String(payload.apiKey ?? "").trim();
    const systemPrompt = String(payload.systemPrompt ?? "").slice(0, 4000);
    const welcomeMessage = cleanText(payload.welcomeMessage, 300);
    const enabled = Boolean(payload.enabled);
    const quickQuestions = normalizeQuestions(payload.quickQuestions);

    if (apiBaseUrl && !/^https?:\/\//i.test(apiBaseUrl)) {
      return json({ ok: false, code: "invalid_url", message: "API adresi https:// ile başlamalı." }, 400);
    }

    const existing = await readConfig();
    const finalKey = apiKey || existing?.api_key || "";

    if (enabled && !finalKey) {
      return json(
        { ok: false, code: "missing_key", message: "Asistanı açmadan önce API anahtarını girmelisiniz." },
        400,
      );
    }

    const { error } = await admin.from("ai_support_settings").upsert(
      {
        id: SETTINGS_ID,
        provider,
        api_base_url: apiBaseUrl,
        model,
        api_key: finalKey,
        system_prompt: systemPrompt,
        welcome_message: welcomeMessage,
        quick_questions: quickQuestions,
        enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true, hasKey: Boolean(finalKey), keyHint: maskKey(finalKey) });
  }

  if (action === "admin_clear_key") {
    const { error } = await admin
      .from("ai_support_settings")
      .upsert({ id: SETTINGS_ID, api_key: "", enabled: false }, { onConflict: "id" });
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  if (action === "admin_test") {
    const provider = String(payload.provider ?? "chatgpt").trim();
    const existing = await readConfig();
    const apiKey = String(payload.apiKey ?? "").trim() || existing?.api_key || "";
    const systemPrompt = String(payload.systemPrompt ?? "").slice(0, 4000) || DEFAULT_SYSTEM_PROMPT;

    const config: AiConfig = {
      provider,
      api_base_url: cleanText(payload.apiBaseUrl, 300),
      model: cleanText(payload.model, 120),
      api_key: apiKey,
      system_prompt: systemPrompt,
      welcome_message: "",
      quick_questions: [],
      enabled: true,
    };

    const result = await callProvider(config, [
      { role: "user", content: "Merhaba, bu bir bağlantı testidir. Kısa bir selamla yanıt ver." },
    ]);
    if (!result.ok) return json({ ok: false, code: "provider_error", message: result.message });
    return json({ ok: true, reply: result.reply });
  }

  return json({ ok: false, code: "unknown_action", message: "Bilinmeyen işlem." }, 400);
});
