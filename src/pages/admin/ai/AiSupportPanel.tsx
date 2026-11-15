import { useEffect, useMemo, useState } from "react";
import { Banner, Field, Panel, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import {
  AI_PROVIDERS,
  clearAiApiKey,
  providerMeta,
  readAiConfig,
  saveAiConfig,
  testAiConfig,
} from "@/lib/aiSupport";
import type { AiAdminConfig, AiProviderId } from "@/types/aiSupport";

const DEFAULT_QUESTIONS = ["Kargo ne zaman gelir?", "İade koşulları nedir?", "Taksit seçenekleri neler?"];

const emptyConfig: AiAdminConfig = {
  provider: "chatgpt",
  apiBaseUrl: "",
  model: "",
  hasKey: false,
  keyHint: "",
  systemPrompt: "",
  welcomeMessage: "",
  quickQuestions: DEFAULT_QUESTIONS,
  enabled: false,
};

export default function AiSupportPanel() {
  const [config, setConfig] = useState<AiAdminConfig>(emptyConfig);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    let active = true;
    void readAiConfig().then((result) => {
      if (!active) return;
      setConfig(result.config);
      if (!result.ok) setError(result.message ?? "Ayarlar yüklenemedi.");
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const meta = useMemo(() => providerMeta(config.provider), [config.provider]);

  const patch = (changes: Partial<AiAdminConfig>) => {
    setConfig((current) => ({ ...current, ...changes }));
    setToast("");
  };

  const changeProvider = (id: AiProviderId) => {
    const nextMeta = providerMeta(id);
    setConfig((current) => {
      const currentMeta = providerMeta(current.provider);
      const baseIsDefault =
        !current.apiBaseUrl.trim() || current.apiBaseUrl.trim().replace(/\/+$/, "") === currentMeta.defaultBase;
      const modelIsDefault = !current.model.trim() || current.model.trim() === currentMeta.defaultModel;
      return {
        ...current,
        provider: id,
        apiBaseUrl: baseIsDefault ? nextMeta.defaultBase : current.apiBaseUrl,
        model: modelIsDefault ? nextMeta.defaultModel : current.model,
      };
    });
    setToast("");
    setTestResult("");
  };

  const patchQuestion = (index: number, value: string) => {
    setConfig((current) => {
      const next = [...current.quickQuestions];
      next[index] = value;
      return { ...current, quickQuestions: next };
    });
    setToast("");
  };

  const save = async () => {
    if (saving) return;
    if (config.apiBaseUrl.trim() && !/^https?:\/\//i.test(config.apiBaseUrl.trim())) {
      setError("API adresi https:// ile başlamalı.");
      return;
    }
    if (config.enabled && !apiKey.trim() && !config.hasKey) {
      setError("Asistanı açmadan önce API anahtarını girmelisiniz.");
      return;
    }
    setSaving(true);
    setError("");
    const result = await saveAiConfig(
      {
        ...config,
        quickQuestions: config.quickQuestions.map((item) => item.trim()).filter((item) => item.length > 0).slice(0, 4),
      },
      apiKey.trim(),
    );
    setSaving(false);

    if (!result.ok) {
      setError(result.message ?? "Ayarlar kaydedilemedi.");
      return;
    }

    setConfig((current) => ({
      ...current,
      hasKey: Boolean(result.hasKey),
      keyHint: result.keyHint ?? current.keyHint,
    }));
    setApiKey("");
    setToast("Yapay zeka destek ayarları kaydedildi. Mağazadaki asistan bu ayarlarla yanıt verir.");
    window.setTimeout(() => setToast(""), 4000);
  };

  const test = async () => {
    if (testing) return;
    if (!apiKey.trim() && !config.hasKey) {
      setError("Test için önce API anahtarını girin.");
      return;
    }
    setTesting(true);
    setError("");
    setTestResult("");
    const result = await testAiConfig(config, apiKey.trim());
    setTesting(false);
    if (!result.ok) {
      setError(`Bağlantı testi başarısız: ${result.message ?? "bilinmeyen hata"}`);
      return;
    }
    setTestResult(result.reply ?? "Bağlantı başarılı.");
  };

  const clearKey = async () => {
    setSaving(true);
    const result = await clearAiApiKey();
    setSaving(false);
    if (!result.ok) {
      setError(result.message ?? "Anahtar silinemedi.");
      return;
    }
    setApiKey("");
    setConfig((current) => ({ ...current, hasKey: false, keyHint: "", enabled: false }));
    setToast("Kayıtlı API anahtarı silindi ve asistan kapatıldı.");
    window.setTimeout(() => setToast(""), 3500);
  };

  return (
    <div className="space-y-4">
      {toast && <Banner tone="success" onClose={() => setToast("")}>{toast}</Banner>}
      {error && <Banner tone="warning" onClose={() => setError("")}>{error}</Banner>}

      {testResult && (
        <div className="flex items-start gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs leading-relaxed text-accent-900">
          <i className="ri-message-3-line mt-0.5" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Test yanıtı</p>
            <p className="mt-0.5 whitespace-pre-wrap">{testResult}</p>
          </div>
          <button
            type="button"
            onClick={() => setTestResult("")}
            aria-label="Test sonucunu kapat"
            className="flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center"
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2.5 text-xs text-foreground-600">
          <i className="ri-loader-4-line animate-spin" />
          Sunucudaki yapay zeka ayarları yükleniyor...
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-background-200 bg-background-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-400">Asistan Durumu</p>
          <p className={`mt-1.5 flex items-center gap-1.5 text-sm font-bold ${config.enabled ? "text-accent-700" : "text-foreground-600"}`}>
            <i className={config.enabled ? "ri-checkbox-circle-fill" : "ri-pause-circle-line"} />
            {config.enabled ? "Sitede aktif" : "Kapalı"}
          </p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-400">Sağlayıcı</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-foreground-900">
            <i className={`${meta.icon} text-base`} />
            {meta.shortLabel}
          </p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-400">API Anahtarı</p>
          <p className={`mt-1.5 flex items-center gap-1.5 text-sm font-bold ${config.hasKey ? "text-accent-700" : "text-secondary-700"}`}>
            <i className={config.hasKey ? "ri-key-2-fill" : "ri-key-2-line"} />
            {config.hasKey ? config.keyHint : "Kayıtlı değil"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel
            title="Yapay Zeka Sağlayıcısı"
            subtitle="Asistanın hangi yapay zeka servisini kullanacağını seçin"
            icon="ri-robot-2-line"
          >
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {AI_PROVIDERS.map((provider) => {
                const active = config.provider === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => changeProvider(provider.id)}
                    className={`flex cursor-pointer flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                      active
                        ? "border-primary-500 bg-primary-50 ring-1 ring-primary-300"
                        : "border-background-200 bg-background-50 hover:border-primary-300 hover:bg-background-100"
                    }`}
                  >
                    <span className="flex w-full items-center gap-2">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          active ? "bg-primary-800 text-background-50" : "bg-background-100 text-foreground-700"
                        }`}
                      >
                        <i className={`${provider.icon} text-base`} />
                      </span>
                      <span className="min-w-0 flex-1 truncate font-heading text-xs font-bold text-foreground-950">
                        {provider.label}
                      </span>
                      {active && <i className="ri-checkbox-circle-fill shrink-0 text-primary-700" />}
                    </span>
                    <span className="text-[11px] leading-relaxed text-foreground-500">{provider.description}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          <Panel
            title="Bağlantı Bilgileri"
            subtitle={`${meta.label} için API adresi, anahtar ve model`}
            icon="ri-link-m"
          >
            <div className="space-y-3">
              <Field
                label="API adresi"
                hint={
                  meta.defaultBase
                    ? `Boş bırakılırsa varsayılan adres kullanılır: ${meta.defaultBase}`
                    : "Sağlayıcınızın OpenAI uyumlu temel adresini girin. Örnek: https://sunucunuz.com/v1"
                }
              >
                <input
                  value={config.apiBaseUrl}
                  onChange={(event) => patch({ apiBaseUrl: event.target.value })}
                  className={inputClass}
                  placeholder={meta.basePlaceholder || "https://sunucunuz.com/v1"}
                  spellCheck={false}
                />
              </Field>

              <Field
                label={meta.keyLabel}
                hint={
                  config.hasKey
                    ? "Anahtar kayıtlı. Değiştirmek istemiyorsanız bu alanı boş bırakın."
                    : "API anahtarı yalnızca sunucuda saklanır, tarayıcıya veya koda yazılmaz."
                }
              >
                <input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  className={inputClass}
                  placeholder={config.hasKey ? `Kayıtlı: ${config.keyHint}` : "API anahtarını yapıştırın"}
                  autoComplete="new-password"
                  spellCheck={false}
                />
              </Field>

              <Field
                label="Model adı"
                hint="Örnek: gpt-4o-mini, gemini-2.5-flash, claude-3-5-sonnet-latest"
              >
                <input
                  value={config.model}
                  onChange={(event) => patch({ model: event.target.value })}
                  className={inputClass}
                  placeholder={meta.defaultModel || "model adı"}
                  list="ai-model-suggestions"
                  spellCheck={false}
                />
                <datalist id="ai-model-suggestions">
                  {meta.modelSuggestions.map((model) => (
                    <option key={model} value={model} />
                  ))}
                </datalist>
              </Field>

              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-background-100 p-2.5">
                <button
                  type="button"
                  onClick={test}
                  disabled={testing}
                  className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-3 text-xs font-semibold text-foreground-700 hover:bg-background-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <i className={testing ? "ri-loader-4-line animate-spin" : "ri-plug-line"} />
                  {testing ? "Test ediliyor..." : "Bağlantıyı Test Et"}
                </button>
                {meta.keyUrl && (
                  <a
                    href={meta.keyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-background-300 bg-background-50 px-3 text-xs font-semibold text-foreground-700 hover:bg-background-200"
                  >
                    <i className="ri-external-link-line" />
                    API anahtarı al
                  </a>
                )}
                {config.hasKey && (
                  <button
                    type="button"
                    onClick={clearKey}
                    disabled={saving}
                    className="ml-auto flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-secondary-300 px-3 text-xs font-semibold text-secondary-800 hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i className="ri-delete-bin-6-line" />
                    Anahtarı Sil
                  </button>
                )}
              </div>
            </div>
          </Panel>

          <Panel title="Asistan Davranışı" subtitle="Karşılama mesajı, hızlı sorular ve yanıt kuralları" icon="ri-chat-settings-line">
            <div className="space-y-3">
              <Field label="Karşılama mesajı" hint="Sohbet açıldığında ilk gösterilen mesaj.">
                <input
                  value={config.welcomeMessage}
                  onChange={(event) => patch({ welcomeMessage: event.target.value.slice(0, 300) })}
                  className={inputClass}
                  placeholder="Merhaba! Size nasıl yardımcı olabilirim?"
                />
              </Field>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-foreground-800">Hazır sorular</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {config.quickQuestions.map((question, index) => (
                    <input
                      key={`q-${index}`}
                      value={question}
                      onChange={(event) => patchQuestion(index, event.target.value.slice(0, 90))}
                      className={inputClass}
                      placeholder={`Soru ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-foreground-500">
                  Sohbet boşken bu sorular tıklanabilir kısayol olarak görünür.
                </p>
              </div>

              <Field
                label="Sistem talimatı (asistanın kişiliği)"
                hint="Mağaza bilgileri, üslup, yanıt sınırları. Boş bırakılırsa genel bir mağaza asistanı tanımı kullanılır."
              >
                <textarea
                  value={config.systemPrompt}
                  onChange={(event) => patch({ systemPrompt: event.target.value.slice(0, 4000) })}
                  rows={6}
                  className={textareaClass}
                  placeholder="Sen mağazamızın destek asistanısın. Kısa ve net yanıt ver; kargo süresi 1-3 iş günüdür..."
                />
              </Field>

              <Toggle
                checked={config.enabled}
                onChange={(value) => patch({ enabled: value })}
                label="Yapay zeka asistanını sitede göster"
                description="Kapalıyken mağazada sohbet balonu görünmez. Açmak için kayıtlı bir API anahtarı gerekir."
              />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Nasıl Çalışır?" icon="ri-information-line">
            <ol className="space-y-2.5 text-[11px] leading-relaxed text-foreground-600">
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-900">1</span>
                Sağlayıcıyı seçin (ChatGPT, OpenAI, Gemini veya Claude).
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-900">2</span>
                Sağlayıcının size verdiği API adresini ve API anahtarını girin.
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-900">3</span>
                <span>
                  <strong>Bağlantıyı Test Et</strong> ile bir deneme yanıtı alın.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-900">4</span>
                Asistanı açıp kaydedin. Balon tüm mağaza sayfalarında görünür.
              </li>
            </ol>
          </Panel>

          <Panel title="Güvenlik" icon="ri-shield-check-line">
            <div className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
              <p className="flex items-start gap-1.5">
                <i className="ri-lock-line mt-0.5 text-accent-600" />
                API anahtarı veritabanında yalnızca sunucu tarafında tutulur; site koduna veya tarayıcıya gönderilmez.
              </p>
              <p className="flex items-start gap-1.5">
                <i className="ri-eye-off-line mt-0.5 text-accent-600" />
                Müşteriler sohbetten yalnızca cevap alır; anahtarı göremez.
              </p>
              <p className="flex items-start gap-1.5">
                <i className="ri-money-dollar-circle-line mt-0.5 text-accent-600" />
                Kullanım ücreti doğrudan seçtiğiniz yapay zeka sağlayıcısının hesabından düşer.
              </p>
            </div>
          </Panel>

          <Panel title="Sohbet Ayarı Önerisi" icon="ri-lightbulb-line">
            <p className="text-[11px] leading-relaxed text-foreground-600">
              Aynı anda hem WhatsApp hem yapay zeka balonu görünür. Dilerseniz WhatsApp canlı desteği kapatarak
              yalnızca yapay zeka asistanını öne çıkarabilirsiniz.
            </p>
            <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-background-100 px-3 py-2">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-foreground-700">
                <i className="ri-chat-ai-line" />
                Müşteri görünürlüğü
              </span>
              <Pill tone={config.enabled ? "success" : "neutral"}>{config.enabled ? "Yayında" : "Taslak"}</Pill>
            </div>
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-background-200 bg-background-50 px-4 py-3 shadow-sm">
        <span className="text-xs text-foreground-500">
          {config.hasKey ? "API anahtarı kayıtlı." : "Henüz API anahtarı kaydedilmedi."}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setApiKey("");
              setError("");
              setTestResult("");
              void readAiConfig().then((result) => {
                if (result.ok) setConfig(result.config);
              });
            }}
            className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
          >
            Sıfırla
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-3-line"} />
            {saving ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}