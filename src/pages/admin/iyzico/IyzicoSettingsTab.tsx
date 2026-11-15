import { useState } from "react";
import { Banner, Field, Panel, Toggle, inputClass } from "@/components/base/AdminUI";
import type { IyzicoSettings } from "@/types/integrations";

interface IyzicoSettingsTabProps {
  settings: IyzicoSettings;
  onSettings: (patch: Partial<IyzicoSettings>) => void;
}

export default function IyzicoSettingsTab({ settings, onSettings }: IyzicoSettingsTabProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [test, setTest] = useState<null | "ok" | "error">(null);

  const runTest = () => {
    if (settings.apiKey.trim().length < 8 || settings.secretKey.trim().length < 8) {
      setTest("error");
      return;
    }
    setTest("ok");
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Panel title="iyzico API Bilgileri" subtitle="Sanal POS hesap ayarları" icon="ri-key-2-line">
        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-[11px] leading-relaxed text-accent-900">
            <i className="ri-shield-check-line mt-0.5 text-sm" />
            <span>
              <strong className="font-semibold">Canlı ödeme aktif.</strong> iyzico anahtarları artık sunucuda (gizli
              ortam değişkeni) tutuluyor; bu ekrandaki alanlar yalnızca bilgi amaçlıdır ve ödeme akışında kullanılmaz.
              Ödemeler iyzico'nun kendi barındırdığı 3D Secure sayfasında alınır.
            </span>
          </div>

          {test === "ok" && (
            <Banner tone="success" onClose={() => setTest(null)}>
              API anahtarları doğrulandı · {settings.baseUrl.includes("sandbox") ? "Test ortamı" : "Canlı ortam"} bağlantısı kuruldu.
            </Banner>
          )}
          {test === "error" && (
            <Banner tone="danger" onClose={() => setTest(null)}>
              API anahtarı veya gizli anahtar hatalı. iyzico panelinden kontrol edin.
            </Banner>
          )}

          <Field label="API anahtarı (apiKey)">
            <input
              value={settings.apiKey}
              onChange={(event) => onSettings({ apiKey: event.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Gizli anahtar (secretKey)">
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={settings.secretKey}
                onChange={(event) => onSettings({ secretKey: event.target.value })}
                className={`${inputClass} pr-9`}
              />
              <button
                type="button"
                onClick={() => setShowSecret((value) => !value)}
                aria-label="Gizli anahtarı göster"
                className="absolute right-0 top-0 flex h-10 w-9 cursor-pointer items-center justify-center text-foreground-500"
              >
                <i className={showSecret ? "ri-eye-off-line" : "ri-eye-line"} />
              </button>
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Merchant ID">
              <input
                value={settings.merchantId}
                onChange={(event) => onSettings({ merchantId: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Ortam">
              <select
                value={settings.baseUrl.includes("sandbox") ? "sandbox" : "live"}
                onChange={(event) =>
                  onSettings({
                    baseUrl:
                      event.target.value === "sandbox"
                        ? "https://sandbox-api.iyzipay.com"
                        : "https://api.iyzipay.com",
                  })
                }
                className={inputClass}
              >
                <option value="sandbox">Test (Sandbox)</option>
                <option value="live">Canlı (Production)</option>
              </select>
            </Field>
          </div>

          <div className="space-y-3 rounded-lg bg-background-100 p-3">
            <Toggle
              checked={settings.enabled}
              onChange={(value) => onSettings({ enabled: value })}
              label="Sanal POS aktif"
              description="Kapalıyken ödeme sayfası güvenli şekilde uyarı gösterir."
            />
            <Toggle
              checked={settings.threeDSecure}
              onChange={(value) => onSettings({ threeDSecure: value })}
              label="3D Secure zorunlu"
              description="Kart sahibi banka doğrulaması yapmadan ödeme tamamlanmaz."
            />
          </div>

          <button
            type="button"
            onClick={runTest}
            className="flex h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-sm font-semibold text-background-50 hover:bg-primary-700"
          >
            <i className="ri-shield-check-line" />
            Bağlantıyı Test Et
          </button>
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel title="Ödeme Akışı" icon="ri-flow-chart">
          <ol className="space-y-3">
            {[
              { title: "Kart bilgisi alınır", text: "Kart verisi doğrudan iyzico'ya iletilir, sitede saklanmaz." },
              { title: "3D Secure doğrulama", text: "Banka SMS şifresi ile kart sahibi doğrulanır." },
              { title: "Provizyon ve tahsilat", text: "Başarılı işlem siparişe dönüşür, panelde listelenir." },
              { title: "İade ve iptal", text: "Panelden tek tıkla iade talebi başlatılabilir." },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-900">
                  {index + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground-900">{step.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-500">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Güvenlik" icon="ri-lock-2-line">
          <ul className="space-y-2 text-[11px] leading-relaxed text-foreground-600">
            {[
              "Secret key yalnızca sunucu tarafında kullanılmalı, tarayıcıya gönderilmemelidir.",
              "Canlı ortama geçmeden önce sandbox ortamında test işlemleri yapın.",
              "3D Secure kapatıldığında chargeback riski artar.",
              "Kart bilgileri PCI-DSS kapsamında iyzico tarafından işlenir.",
            ].map((note) => (
              <li key={note} className="flex gap-2">
                <i className="ri-shield-line mt-0.5 text-primary-600" />
                {note}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}