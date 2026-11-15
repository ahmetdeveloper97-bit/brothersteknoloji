import { useState } from "react";
import { Banner, Field, Panel, Pill, Toggle, inputClass } from "@/components/base/AdminUI";
import { campaignDateLabel, formatMoney, hasGoogleAccount, hasMetaAccount, isGoogleLinked, isMetaLinked, maskToken } from "@/lib/ads";
import type {
  AdBudgetSettings,
  AdPlatform,
  AdsSettings,
  BudgetStatus,
  GoogleAdsSettings,
  MetaAdsSettings,
} from "@/types/ads";

interface AdsSettingsTabProps {
  settings: AdsSettings;
  onGoogle: (patch: Partial<GoogleAdsSettings>) => void;
  onMeta: (patch: Partial<MetaAdsSettings>) => void;
  onBudget: (patch: Partial<AdBudgetSettings>) => void;
  budgetStatus: BudgetStatus;
  onSaveBudgetLimit: (limit: number) => void;
  onDeleteAccount: (platform: AdPlatform) => void;
}

type TestState = null | "ok" | "error";

export default function AdsSettingsTab({
  settings,
  onGoogle,
  onMeta,
  onBudget,
  budgetStatus,
  onSaveBudgetLimit,
  onDeleteAccount,
}: AdsSettingsTabProps) {
  const [showGoogleToken, setShowGoogleToken] = useState(false);
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [showCapiToken, setShowCapiToken] = useState(false);
  const [googleTest, setGoogleTest] = useState<TestState>(null);
  const [metaTest, setMetaTest] = useState<TestState>(null);
  const [limitDraft, setLimitDraft] = useState(String(settings.budget.monthlyLimit));
  const [budgetError, setBudgetError] = useState("");

  const googleLinked = isGoogleLinked(settings.google);
  const metaLinked = isMetaLinked(settings.meta);
  const googleAccountExists = hasGoogleAccount(settings.google);
  const metaAccountExists = hasMetaAccount(settings.meta);

  const runGoogleTest = () => setGoogleTest(isGoogleLinked(settings.google) ? "ok" : "error");
  const runMetaTest = () => setMetaTest(isMetaLinked(settings.meta) ? "ok" : "error");

  const saveBudget = () => {
    const parsed = Number(limitDraft);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setBudgetError("Aylık limit sıfırdan büyük bir tutar olmalıdır.");
      return;
    }
    setBudgetError("");
    onBudget({ monthlyLimit: Math.round(parsed) });
    onSaveBudgetLimit(Math.round(parsed));
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Aylık Reklam Bütçesi"
        subtitle="Toplam harcama limiti ve uyarı eşiği"
        icon="ri-wallet-3-line"
        action={
          <Pill
            tone={budgetStatus.state === "over" ? "danger" : budgetStatus.state === "near" ? "warning" : "success"}
          >
            %{Math.round(budgetStatus.ratio)} kullanıldı
          </Pill>
        }
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3.5">
            {budgetError && (
              <Banner tone="danger" onClose={() => setBudgetError("")}>
                {budgetError}
              </Banner>
            )}

            <Toggle
              checked={settings.budget.enabled}
              onChange={(value) => onBudget({ enabled: value })}
              label="Bütçe uyarıları aktif"
              description="Kapalıyken limit aşımı olsa da panelde uyarı şeridi gösterilmez."
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Aylık reklam bütçesi (₺)" hint="Bu tutarın üzerine çıkıldığında panelde uyarı çıkar.">
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={limitDraft}
                  onChange={(event) => {
                    setLimitDraft(event.target.value);
                    setBudgetError("");
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="Uyarı eşiği" hint="Limitin bu yüzdesine ulaşınca erken uyarı gösterilir.">
                <select
                  value={settings.budget.alertRatio}
                  onChange={(event) => onBudget({ alertRatio: Number(event.target.value) })}
                  className={inputClass}
                >
                  {[50, 70, 80, 85, 90, 95].map((ratio) => (
                    <option key={ratio} value={ratio}>
                      %{ratio}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[50000, 100000, 150000, 200000, 300000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setLimitDraft(String(amount));
                    setBudgetError("");
                  }}
                  className={`h-8 cursor-pointer whitespace-nowrap rounded-full border px-3 text-[11px] font-semibold transition-colors ${
                    Number(limitDraft) === amount
                      ? "border-primary-400 bg-primary-100 text-primary-900"
                      : "border-background-300 text-foreground-600 hover:bg-background-100"
                  }`}
                >
                  {formatMoney(amount)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={saveBudget}
                className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-save-3-line" />
                Bütçeyi kaydet
              </button>
              <span className="text-[11px] text-foreground-500">
                Bu ay harcanan {formatMoney(budgetStatus.spend)} · {formatMoney(budgetStatus.limit)} limit
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-background-200 bg-background-100 p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Bütçe durumu</p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground-950">%{Math.round(budgetStatus.ratio)}</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background-300">
              <div
                className={`h-full rounded-full ${
                  budgetStatus.state === "over"
                    ? "bg-foreground-700"
                    : budgetStatus.state === "near"
                      ? "bg-secondary-500"
                      : "bg-accent-600"
                }`}
                style={{ width: `${Math.min(budgetStatus.ratio, 100)}%` }}
              />
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] text-foreground-600">
              <p className="flex items-center justify-between">
                <span>Harcama</span>
                <span className="font-semibold text-foreground-950">{formatMoney(budgetStatus.spend)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Limit</span>
                <span className="font-semibold text-foreground-950">{formatMoney(budgetStatus.limit)}</span>
              </p>
              <p className="flex items-center justify-between">
                <span>{budgetStatus.remaining >= 0 ? "Kalan" : "Aşım"}</span>
                <span
                  className={`font-semibold ${
                    budgetStatus.remaining >= 0 ? "text-accent-800" : "text-foreground-900"
                  }`}
                >
                  {formatMoney(Math.abs(budgetStatus.remaining))}
                </span>
              </p>
            </div>
            <p className="mt-3 rounded-lg bg-background-50 px-2.5 py-2 text-[10px] leading-relaxed text-foreground-500">
              {budgetStatus.state === "over"
                ? "Limit aşıldı — panel üstünde kalıcı uyarı şeridi görünüyor."
                : "Limit aşılınca panelde uyarı şeridi görünür."}
            </p>
          </div>
        </div>
      </Panel>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Google Ads Bağlantısı" subtitle="Müşteri kimliği ve dönüşüm etiketi" icon="ri-google-line">
          <div className="space-y-4">
            {googleTest === "ok" && (
              <Banner tone="success" onClose={() => setGoogleTest(null)}>
                Bağlantı doğrulandı · {settings.google.accountName} hesabına erişim sağlandı.
              </Banner>
            )}
            {googleTest === "error" && (
              <Banner tone="danger" onClose={() => setGoogleTest(null)}>
                Bağlantı kurulamadı. Müşteri kimliği (123-456-7890) ve geliştirici belirtecini kontrol edin.
              </Banner>
            )}

            <Toggle
              checked={settings.google.enabled}
              onChange={(value) => onGoogle({ enabled: value })}
              label="Google Ads entegrasyonu aktif"
              description="Kapatıldığında harcama verileri çekilmez ve dönüşüm etiketi gönderilmez."
            />

            <Field label="Hesap adı">
              <input
                value={settings.google.accountName}
                onChange={(event) => onGoogle({ accountName: event.target.value })}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Müşteri kimliği" hint="Google Ads panelinde sağ üstte görünen 3-3-4 haneli numara.">
                <input
                  value={settings.google.customerId}
                  onChange={(event) => onGoogle({ customerId: event.target.value })}
                  placeholder="123-456-7890"
                  className={inputClass}
                />
              </Field>
              <Field label="Para birimi">
                <select
                  value={settings.google.currency}
                  onChange={(event) => onGoogle({ currency: event.target.value })}
                  className={inputClass}
                >
                  <option value="TRY">Türk Lirası (₺)</option>
                  <option value="USD">Amerikan Doları ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </Field>
            </div>

            <Field label="Geliştirici belirteci" hint="Yalnızca yönetici API erişimi için kullanılır, tarayıcıya gönderilmez.">
              <div className="relative">
                <input
                  type={showGoogleToken ? "text" : "password"}
                  value={settings.google.developerToken}
                  onChange={(event) => onGoogle({ developerToken: event.target.value })}
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowGoogleToken((value) => !value)}
                  aria-label="Belirteci göster"
                  className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-foreground-500"
                >
                  <i className={showGoogleToken ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Dönüşüm kimliği" hint="Örn. AW-1084223619">
                <input
                  value={settings.google.conversionId}
                  onChange={(event) => onGoogle({ conversionId: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Dönüşüm etiketi">
                <input
                  value={settings.google.conversionLabel}
                  onChange={(event) => onGoogle({ conversionLabel: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-3 rounded-lg bg-background-100 p-3">
              <Toggle
                checked={settings.google.autoTagging}
                onChange={(value) => onGoogle({ autoTagging: value })}
                label="Otomatik etiketleme"
                description="Reklam tıklamalarını GCLID ile eşleştirir."
              />
              <div className="h-px bg-background-200" />
              <Toggle
                checked={settings.google.enhancedConversions}
                onChange={(value) => onGoogle({ enhancedConversions: value })}
                label="Gelişmiş dönüşümler"
                description="Müşteri verisi karma hâle getirilerek eşleştirilir."
              />
              <div className="h-px bg-background-200" />
              <Toggle
                checked={settings.google.remarketingTag}
                onChange={(value) => onGoogle({ remarketingTag: value })}
                label="Remarketing etiketi"
                description="Siteyi ziyaret edenler için izleyici kitle listeleri oluşturulur."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={runGoogleTest}
                className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-shield-check-line" />
                Bağlantıyı Test Et
              </button>
              <span className="text-[11px] text-foreground-500">
                Son bağlantı: {settings.google.connectedAt ? campaignDateLabel(settings.google.connectedAt) : "—"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-foreground-300 bg-foreground-100/60 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground-950">Google reklam hesabını sil</p>
                <p className="text-[10px] leading-relaxed text-foreground-600">
                  Hesap, müşteri kimliği ve tüm belirteçler kaldırılır; bağlantı kurulmamış duruma döner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteAccount("google")}
                disabled={!googleAccountExists}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-foreground-400 bg-background-50 px-3 text-[11px] font-semibold text-foreground-900 hover:bg-foreground-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="ri-delete-bin-6-line" />
                Hesabı sil
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Meta Ads Bağlantısı" subtitle="Reklam hesabı, Pixel ve Conversions API" icon="ri-meta-line">
          <div className="space-y-4">
            {metaTest === "ok" && (
              <Banner tone="success" onClose={() => setMetaTest(null)}>
                Bağlantı doğrulandı · {settings.meta.accountName} reklam hesabına erişim sağlandı.
              </Banner>
            )}
            {metaTest === "error" && (
              <Banner tone="danger" onClose={() => setMetaTest(null)}>
                Bağlantı kurulamadı. Reklam hesabı kimliği (act_...), Pixel kimliği ve erişim belirtecini kontrol edin.
              </Banner>
            )}

            <Toggle
              checked={settings.meta.enabled}
              onChange={(value) => onMeta({ enabled: value })}
              label="Meta Ads entegrasyonu aktif"
              description="Kapatıldığında Pixel olayları ve harcama verileri gönderilmez."
            />

            <Field label="Hesap adı">
              <input
                value={settings.meta.accountName}
                onChange={(event) => onMeta({ accountName: event.target.value })}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Reklam hesabı kimliği" hint="act_ ile başlar.">
                <input
                  value={settings.meta.adAccountId}
                  onChange={(event) => onMeta({ adAccountId: event.target.value })}
                  placeholder="act_1234567890"
                  className={inputClass}
                />
              </Field>
              <Field label="Business Manager kimliği">
                <input
                  value={settings.meta.businessId}
                  onChange={(event) => onMeta({ businessId: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Pixel kimliği">
                <input
                  value={settings.meta.pixelId}
                  onChange={(event) => onMeta({ pixelId: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Test olay kodu" hint="Test olaylarını Meta panelinde ayırt etmek için.">
                <input
                  value={settings.meta.testEventCode}
                  onChange={(event) => onMeta({ testEventCode: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Erişim belirteci" hint="Sistem kullanıcısı belirteci önerilir, süresi uzun olur.">
              <div className="relative">
                <input
                  type={showMetaToken ? "text" : "password"}
                  value={settings.meta.accessToken}
                  onChange={(event) => onMeta({ accessToken: event.target.value })}
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowMetaToken((value) => !value)}
                  aria-label="Erişim belirtecini göster"
                  className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-foreground-500"
                >
                  <i className={showMetaToken ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>
            </Field>

            <Field label="Conversions API belirteci" hint="Sunucu taraflı olay gönderimi için kullanılır.">
              <div className="relative">
                <input
                  type={showCapiToken ? "text" : "password"}
                  value={settings.meta.conversionApiToken}
                  onChange={(event) => onMeta({ conversionApiToken: event.target.value })}
                  className={`${inputClass} pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowCapiToken((value) => !value)}
                  aria-label="Conversions API belirtecini göster"
                  className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-foreground-500"
                >
                  <i className={showCapiToken ? "ri-eye-off-line" : "ri-eye-line"} />
                </button>
              </div>
            </Field>

            <div className="space-y-3 rounded-lg bg-background-100 p-3">
              <Toggle
                checked={settings.meta.automaticAdvancedMatching}
                onChange={(value) => onMeta({ automaticAdvancedMatching: value })}
                label="Otomatik gelişmiş eşleştirme"
                description="Ziyaretçi bilgileriyle kitle eşleşmesi iyileşir."
              />
              <div className="h-px bg-background-200" />
              <Toggle
                checked={settings.meta.advantagePlus}
                onChange={(value) => onMeta({ advantagePlus: value })}
                label="Advantage+ kampanyaları"
                description="Otomatik hedefleme ve kreatif optimizasyonuna izin verir."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={runMetaTest}
                className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-shield-check-line" />
                Bağlantıyı Test Et
              </button>
              <span className="text-[11px] text-foreground-500">
                Son bağlantı: {settings.meta.connectedAt ? campaignDateLabel(settings.meta.connectedAt) : "—"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-foreground-300 bg-foreground-100/60 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground-950">Meta reklam hesabını sil</p>
                <p className="text-[10px] leading-relaxed text-foreground-600">
                  Reklam hesabı, Pixel ve erişim belirteçleri kaldırılır; bağlantı kurulmamış duruma döner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteAccount("meta")}
                disabled={!metaAccountExists}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-foreground-400 bg-background-50 px-3 text-[11px] font-semibold text-foreground-900 hover:bg-foreground-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <i className="ri-delete-bin-6-line" />
                Hesabı sil
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Bağlantı Özeti" icon="ri-plug-line">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                <i className="ri-google-line" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground-900">Google Ads</p>
                <p className="truncate font-mono text-[10px] text-foreground-500">{settings.google.customerId}</p>
              </div>
              <Pill tone={googleLinked ? "success" : "danger"}>{googleLinked ? "Bağlı" : "Eksik"}</Pill>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 px-3 py-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                <i className="ri-meta-line" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground-900">Meta Ads</p>
                <p className="truncate font-mono text-[10px] text-foreground-500">{settings.meta.adAccountId}</p>
              </div>
              <Pill tone={metaLinked ? "success" : "danger"}>{metaLinked ? "Bağlı" : "Eksik"}</Pill>
            </div>
            <div className="rounded-lg border border-background-200 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400">Saklanan belirteçler</p>
              <ul className="mt-1 space-y-1 font-mono text-[10px] text-foreground-600">
                <li className="flex items-center justify-between gap-2">
                  <span>google.developerToken</span>
                  <span className="text-foreground-900">{maskToken(settings.google.developerToken)}</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>meta.accessToken</span>
                  <span className="text-foreground-900">{maskToken(settings.meta.accessToken)}</span>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <span>meta.conversionApiToken</span>
                  <span className="text-foreground-900">{maskToken(settings.meta.conversionApiToken)}</span>
                </li>
              </ul>
            </div>
          </div>
        </Panel>

        <Panel title="Kurulum Kontrol Listesi" icon="ri-checkbox-multiple-line">
          <ol className="space-y-2.5">
            {[
              { title: "Google Ads müşteri kimliğini girin", done: googleLinked },
              { title: "Dönüşüm kimliği ve etiketini tanımlayın", done: settings.google.conversionId.trim() !== "" },
              { title: "Meta reklam hesabı ve Pixel kimliğini bağlayın", done: metaLinked },
              { title: "Conversions API belirtecini ekleyin", done: settings.meta.conversionApiToken.trim() !== "" },
              { title: "Test olayı gönderip raporları doğrulayın", done: googleTest === "ok" && metaTest === "ok" },
            ].map((step) => (
              <li key={step.title} className="flex items-start gap-2 text-xs">
                <i
                  className={`mt-0.5 text-sm ${
                    step.done ? "ri-checkbox-circle-fill text-accent-600" : "ri-checkbox-blank-circle-line text-foreground-300"
                  }`}
                />
                <span className={step.done ? "text-foreground-600 line-through" : "text-foreground-800"}>{step.title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-3 rounded-lg bg-secondary-100 p-2.5">
            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-secondary-950">
              <i className="ri-lock-2-line mt-0.5" />
              Belirteçler üretim ortamında sunucu tarafında saklanmalı, tarayıcıya gönderilmemelidir. Bu panelde
              girilen değerler yalnızca bu tarayıcıda tutulur.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}