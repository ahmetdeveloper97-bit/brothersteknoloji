import { Banner, Field, Panel, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import type { CargoCompany, ShippingSettings } from "@/types/shipping";

interface ShippingSettingsTabProps {
  settings: ShippingSettings;
  companies: CargoCompany[];
  onSettings: (patch: Partial<ShippingSettings>) => void;
}

export default function ShippingSettingsTab({ settings, companies, onSettings }: ShippingSettingsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="space-y-4">
        <Panel title="Ücretsiz Kargo" subtitle="Tüm siparişlerde kargo bedelini kaldırın" icon="ri-truck-line">
          <div
            className={`rounded-xl border p-3.5 transition-colors ${
              settings.freeShippingEnabled
                ? "border-accent-300 bg-accent-50"
                : "border-background-200 bg-background-100"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground-950">
                  <i className={settings.freeShippingEnabled ? "ri-checkbox-circle-fill text-accent-700" : "ri-checkbox-blank-circle-line text-foreground-400"} />
                  Ücretsiz kargo modu
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-foreground-600">
                  {settings.freeShippingEnabled
                    ? "Açık. Sepetteki tutar ne olursa olsun tüm kargo gönderileri ücretsiz hesaplanır."
                    : "Kapalı. Kargo bedeli tarifelere ve ücretsiz kargo limitine göre hesaplanır."}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.freeShippingEnabled}
                onClick={() => onSettings({ freeShippingEnabled: !settings.freeShippingEnabled })}
                className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  settings.freeShippingEnabled ? "bg-accent-600" : "bg-background-300"
                }`}
              >
                <span
                  className={`absolute h-5 w-5 rounded-full bg-background-50 shadow-sm transition-transform ${
                    settings.freeShippingEnabled ? "translate-x-[22px]" : "translate-x-[2px]"
                  }`}
                />
              </button>
            </div>

            <div className="mt-3 rounded-lg bg-background-50 px-3 py-2.5 text-[11px] leading-relaxed text-foreground-600">
              {settings.freeShippingEnabled ? (
                <span className="flex items-start gap-1.5 text-accent-900">
                  <i className="ri-information-line mt-0.5" />
                  <span>
                    Ödeme adımında kargo bedeli <strong>0 ₺ (Ücretsiz)</strong> görünür; limit altındaki siparişlerde de
                    kargo alınmaz.
                  </span>
                </span>
              ) : (
                <span className="flex items-start gap-1.5">
                  <i className="ri-information-line mt-0.5" />
                  <span>
                    Kargo bedeli, {formatPrice(settings.freeShippingThreshold)} ve üzeri siparişlerde otomatik olarak
                    ücretsizdir.
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-background-100 p-3">
            <Toggle
              checked={settings.freeShippingEnabled}
              onChange={(value) => onSettings({ freeShippingEnabled: value })}
              label="Ana anahtar"
              description="Kapalıyken sipariş tutarına göre kargo ücreti uygulanır."
            />
          </div>
        </Panel>

        <Panel title="Gönderi Ayarları" subtitle="Varsayılan kargo davranışları" icon="ri-settings-3-line">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Varsayılan kargo firması">
                <select
                  value={settings.defaultCompanyId}
                  onChange={(event) => onSettings({ defaultCompanyId: event.target.value })}
                  className={inputClass}
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Günlük kurye saatı" hint="Bu saatten sonraki siparişler ertesi gün çıkar.">
                <input
                  type="time"
                  value={settings.cutoff}
                  onChange={(event) => onSettings({ cutoff: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Ücretsiz kargo limiti (₺)">
                <input
                  type="number"
                  min="0"
                  value={settings.freeShippingThreshold}
                  onChange={(event) => onSettings({ freeShippingThreshold: Number(event.target.value) || 0 })}
                  className={inputClass}
                />
              </Field>
              <Field label="Varsayılan desi">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={settings.defaultDesi}
                  onChange={(event) => onSettings({ defaultDesi: Number(event.target.value) || 1 })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Kurye çıkış adresi">
              <textarea
                value={settings.pickupAddress}
                onChange={(event) => onSettings({ pickupAddress: event.target.value })}
                rows={2}
                maxLength={200}
                className={textareaClass}
              />
            </Field>

            <Field label="İade adresi">
              <textarea
                value={settings.returnAddress}
                onChange={(event) => onSettings({ returnAddress: event.target.value })}
                rows={2}
                maxLength={200}
                className={textareaClass}
              />
            </Field>

            <div className="space-y-3 rounded-lg bg-background-100 p-3">
              <Toggle
                checked={settings.autoLabel}
                onChange={(value) => onSettings({ autoLabel: value })}
                label="Sipariş onaylanınca otomatik etiket"
                description="Ödeme onaylandığı anda seçili kargo firmasında gönderi ve etiket oluşturulur."
              />
              <Toggle
                checked={settings.insuranceEnabled}
                onChange={(value) => onSettings({ insuranceEnabled: value })}
                label="Sigorta varsayılan açık"
                description="Elektronik ürünlerde kayıp ve hasar güvencesi."
              />
              <Toggle
                checked={settings.notifySms}
                onChange={(value) => onSettings({ notifySms: value })}
                label="Kargo hareketlerini SMS ile bildir"
                description="NetGSM modülündeki onaylı başlık üzerinden gönderilir."
              />
              <Toggle
                checked={settings.notifyWhatsApp}
                onChange={(value) => onSettings({ notifyWhatsApp: value })}
                label="Kargo hareketlerini WhatsApp ile bildir"
                description="WhatsApp modülündeki mesaj şablonu kullanılır."
              />
            </div>

            <p className="text-[11px] text-foreground-500">
              Değişiklikler otomatik kaydedilir. Ücretsiz kargo limiti {formatPrice(settings.freeShippingThreshold)}.
            </p>
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Kargo Akışı" icon="ri-flow-chart">
          <ol className="space-y-3">
            {[
              { title: "Sipariş onayı", text: "Ödeme alındığında gönderi kaydı oluşur, stok rezerve edilir." },
              { title: "Etiket oluşturma", text: "Seçili kargo firmasının API'sine gönderi iletilir, takip numarası alınır." },
              { title: "Kurye teslim alma", text: "Kurye etiketi okutur, durum otomatik olarak 'Kargoda' olur." },
              { title: "Dağıtım ve teslim", text: "Hareketler webhook ile alınır, müşteriye SMS/WhatsApp gider." },
              { title: "İade yönetimi", text: "Teslim alınmayan gönderiler iade sürecine alınır, stok geri eklenir." },
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

        <Panel title="Entegrasyon Durumu" icon="ri-plug-line">
          <div className="space-y-2">
            <Banner tone="success">Tüm kargo firmaları tek etiket formatında çalışır, firma değişse de akış bozulmaz.</Banner>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2.5 text-xs">
              <span className="text-foreground-700">API ile bağlı firma</span>
              <span className="font-semibold text-foreground-950">
                {companies.filter((company) => company.connected).length} / {companies.length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2.5 text-xs">
              <span className="text-foreground-700">Kapıda ödeme destekli</span>
              <span className="font-semibold text-foreground-950">
                {companies.filter((company) => company.supportsCod).length} firma
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2.5 text-xs">
              <span className="text-foreground-700">SMS bildirimi</span>
              <span className={`font-semibold ${settings.notifySms ? "text-accent-700" : "text-foreground-500"}`}>
                {settings.notifySms ? "Aktif" : "Kapalı"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-background-100 px-3 py-2.5 text-xs">
              <span className="text-foreground-700">WhatsApp bildirimi</span>
              <span className={`font-semibold ${settings.notifyWhatsApp ? "text-accent-700" : "text-foreground-500"}`}>
                {settings.notifyWhatsApp ? "Aktif" : "Kapalı"}
              </span>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-foreground-500">
            Canlıya geçerken kargo firmalarının API anahtarlarının sunucu tarafında saklanması gerekir. Readdy Backend
            veya kendi Supabase projenizi bağlayarak anahtarları güvenli biçimde taşıyabiliriz.
          </p>
        </Panel>
      </div>
    </div>
  );
}