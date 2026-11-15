import { useMemo, useState } from "react";
import { Banner, Field, Panel, Pill, Tabs, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import { ADMIN_STORE_KEYS, loadStoreSettings } from "@/lib/adminStore";
import { TR_CITIES } from "@/lib/trCities";
import { useMaintenanceConfig } from "@/lib/maintenance";
import MaintenanceControl from "@/pages/admin/settings/components/MaintenanceControl";
import type { NotificationSettings, StoreSettings } from "@/types/admin";

type TabId = "store" | "contact" | "notifications" | "rules" | "integrations";

const notificationRows: Array<{ key: keyof Omit<NotificationSettings, "channels">; title: string; description: string }> = [
  { key: "orderCreated", title: "Sipariş oluşturuldu", description: "Yeni sipariş geldiğinde yöneticiye bildirim gönder." },
  { key: "orderShipped", title: "Kargoya verildi", description: "Gönderi kargoya verildiğinde müşteriye takip numarası ilet." },
  { key: "orderDelivered", title: "Teslim edildi", description: "Teslimat tamamlandığında müşteriye teşekkür mesajı gönder." },
  { key: "abandonedCart", title: "Terk edilen sepet", description: "Sepette ürün bırakan müşteriye 1 saat sonra hatırlatma gönder." },
  { key: "newReview", title: "Yeni yorum", description: "Yeni bir ürün yorumu geldiğinde yöneticiyi bilgilendir." },
  { key: "lowStock", title: "Kritik stok", description: "Stok 5 adedin altına düştüğünde uyarı gönder." },
];

interface SettingsPanelProps {
  onNavigate: (id: string) => void;
}

export default function SettingsPanel({ onNavigate }: SettingsPanelProps) {
  const [settings, setSettings] = usePersistentState<StoreSettings>(ADMIN_STORE_KEYS.settings, loadStoreSettings());
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [tab, setTab] = useState<TabId>("store");
  const [toast, setToast] = useState("");
  const maintenance = useMaintenanceConfig();

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(settings), [draft, settings]);

  const patch = (changes: Partial<StoreSettings>) => {
    setDraft((current) => ({ ...current, ...changes }));
    setToast("");
  };

  const patchNotifications = (changes: Partial<NotificationSettings>) => {
    setDraft((current) => ({ ...current, notifications: { ...current.notifications, ...changes } }));
    setToast("");
  };

  const patchChannels = (changes: Partial<NotificationSettings["channels"]>) => {
    setDraft((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        channels: { ...current.notifications.channels, ...changes },
      },
    }));
    setToast("");
  };

  const save = () => {
    setSettings(draft);
    setToast("Ayarlar kaydedildi ve mağazaya uygulandı.");
    window.setTimeout(() => setToast(""), 3000);
  };

  const reset = () => {
    setDraft(settings);
    setToast("Değişiklikler geri alındı.");
    window.setTimeout(() => setToast(""), 2500);
  };

  const integrations = [
    {
      id: "shipping",
      title: "Kargo Yönetimi",
      description: "14 hazır kargo firması, gönderi etiketleri ve fiyat tarifeleri.",
      icon: "ri-truck-line",
      status: "Bağlı",
      tone: "success" as const,
    },
    {
      id: "payments",
      title: "iyzico Ödeme",
      description: "Sanal POS işlemleri, taksit planları ve 3D Secure ayarları.",
      icon: "ri-bank-card-line",
      status: "Bağlı",
      tone: "success" as const,
    },
    {
      id: "sms",
      title: "NetGSM SMS",
      description: "Kargo bildirimleri, kampanya SMS'leri ve kontör takibi.",
      icon: "ri-message-2-line",
      status: "Bağlı",
      tone: "success" as const,
    },
    {
      id: "whatsapp",
      title: "WhatsApp Modülleri",
      description: "Sepet hatırlatma ve canlı destek yanıt şablonları.",
      icon: "ri-whatsapp-line",
      status: "Bağlı",
      tone: "success" as const,
    },
    {
      id: "ads",
      title: "Google & Meta Reklam",
      description: "Kampanya bütçeleri, harcama raporları ve dönüşüm izleme.",
      icon: "ri-megaphone-line",
      status: "Bağlı",
      tone: "success" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "store", label: "Mağaza Bilgileri", icon: "ri-store-3-line" },
          { id: "contact", label: "İletişim & Destek", icon: "ri-customer-service-2-line" },
          { id: "notifications", label: "Bildirimler", icon: "ri-notification-3-line" },
          { id: "rules", label: "Sipariş Kuralları", icon: "ri-shopping-cart-2-line" },
          { id: "integrations", label: "Entegrasyonlar", icon: "ri-plug-line" },
        ]}
      />

      {toast && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-300 bg-accent-50 px-3 py-2.5 text-xs text-accent-900">
          <i className="ri-checkbox-circle-line" />
          {toast}
        </div>
      )}

      {tab === "store" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <Panel title="Mağaza Bilgileri" subtitle="Fatura ve yasal metinlerde kullanılır" icon="ri-store-3-line">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Mağaza adı">
                  <input value={draft.storeName} onChange={(event) => patch({ storeName: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Ticari unvan">
                  <input value={draft.legalName} onChange={(event) => patch({ legalName: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Vergi numarası">
                  <input value={draft.taxNumber} onChange={(event) => patch({ taxNumber: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Vergi dairesi">
                  <input value={draft.taxOffice} onChange={(event) => patch({ taxOffice: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Para birimi">
                  <select value={draft.currency} onChange={(event) => patch({ currency: event.target.value })} className={inputClass}>
                    <option value="TRY">Türk Lirası (₺)</option>
                    <option value="USD">Amerikan Doları ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </Field>
                <Field label="Posta kodu">
                  <input value={draft.postalCode} onChange={(event) => patch({ postalCode: event.target.value })} className={inputClass} />
                </Field>
              </div>
              <div className="mt-3 space-y-3">
                <Field label="Açık adres">
                  <textarea
                    value={draft.address}
                    onChange={(event) => patch({ address: event.target.value })}
                    rows={2}
                    maxLength={200}
                    className={textareaClass}
                  />
                </Field>
                <Field label="Şehir / ilçe">
                  <input
                    value={draft.city}
                    onChange={(event) => patch({ city: event.target.value })}
                    list="store-city-options"
                    className={inputClass}
                  />
                  <datalist id="store-city-options">
                    {TR_CITIES.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </Field>
              </div>
            </Panel>

            <Panel title="Mağaza Davranışı" icon="ri-settings-5-line">
              <div className="space-y-3">
                <Toggle
                  checked={draft.reviewsAutoApprove}
                  onChange={(value) => patch({ reviewsAutoApprove: value })}
                  label="Yorumları otomatik onayla"
                  description="Kapalıyken tüm yorumlar Yorumlar sekmesinde onay bekler."
                />
                <div className="h-px bg-background-200" />
                <Toggle
                  checked={draft.showStockCount}
                  onChange={(value) => patch({ showStockCount: value })}
                  label="Ürün sayfasında stok adedi göster"
                  description="Az kalan stoklarda aciliyet algısı oluşturur."
                />
              </div>
            </Panel>

            <MaintenanceControl />
          </div>

          <div className="space-y-4">
            <Panel title="Mağaza Önizleme" icon="ri-eye-line">
              <div className="rounded-lg border border-background-200 bg-background-100 p-3">
                <p className="font-heading text-sm font-bold text-foreground-950">{draft.storeName || "Mağaza adı"}</p>
                <p className="mt-0.5 text-[11px] text-foreground-500">{draft.legalName || "Ticari unvan"}</p>
                <div className="mt-2.5 space-y-1 text-[11px] text-foreground-600">
                  <p className="flex items-center gap-1.5">
                    <i className="ri-mail-line" />
                    {draft.email || "—"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <i className="ri-phone-line" />
                    {draft.phone || "—"}
                  </p>
                  <p className="flex items-start gap-1.5">
                    <i className="ri-map-pin-line mt-0.5" />
                    <span>
                      {draft.address}
                      {draft.city ? `, ${draft.city}` : ""}
                    </span>
                  </p>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  <Pill tone="info">{draft.currency}</Pill>
                  <Pill tone={maintenance.enabled ? "warning" : "success"}>
                    {maintenance.enabled ? "Bakım Modu" : "Yayında"}
                  </Pill>
                </div>
              </div>
            </Panel>

            <Panel title="Hızlı İşlemler" icon="ri-flashlight-line">
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => onNavigate("shipping")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
                >
                  <i className="ri-truck-line text-primary-700" />
                  Kargo ayarlarını düzenle
                  <i className="ri-arrow-right-s-line ml-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("campaigns")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
                >
                  <i className="ri-coupon-3-line text-primary-700" />
                  Kampanya oluştur
                  <i className="ri-arrow-right-s-line ml-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("reviews")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
                >
                  <i className="ri-chat-3-line text-primary-700" />
                  Yorumları incele
                  <i className="ri-arrow-right-s-line ml-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("footer")}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-foreground-700 hover:bg-background-100"
                >
                  <i className="ri-layout-bottom-line text-primary-700" />
                  Footer ve linkleri düzenle
                  <i className="ri-arrow-right-s-line ml-auto" />
                </button>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {tab === "contact" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
              <p className="text-[11px] leading-relaxed text-primary-900">
                Mağazada görünen telefon, e-posta, adres ve sosyal medya hesapları{" "}
                <strong>Footer & İletişim</strong> bölümünden yönetilir; footer, kargo takibi ve yasal sayfalar
                oradan beslenir.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("footer")}
                className="flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-3 text-[11px] font-semibold text-background-50 hover:bg-primary-700"
              >
                <i className="ri-layout-bottom-line" />
                Footer & İletişim'e git
              </button>
            </div>
            <Panel title="İletişim Bilgileri" subtitle="Mağaza iletişim sayfası ve e-postalarda görünür" icon="ri-customer-service-2-line">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Destek e-postası">
                  <input type="email" value={draft.email} onChange={(event) => patch({ email: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Telefon">
                  <input value={draft.phone} onChange={(event) => patch({ phone: event.target.value })} className={inputClass} />
                </Field>
                <Field label="WhatsApp numarası">
                  <input value={draft.whatsapp} onChange={(event) => patch({ whatsapp: event.target.value })} className={inputClass} />
                </Field>
                <Field label="Destek saatleri">
                  <input value={draft.supportHours} onChange={(event) => patch({ supportHours: event.target.value })} className={inputClass} />
                </Field>
              </div>
              <div className="mt-3">
                <Banner tone="info">
                  WhatsApp numarası mağazadaki canlı destek widget'ında kullanılır. Numarayı ülke koduyla birlikte
                  girin (+90 5xx ...).
                </Banner>
              </div>
            </Panel>
          </div>

          <Panel title="Kanallar" icon="ri-share-line">
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 p-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                  <i className="ri-whatsapp-line" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground-900">WhatsApp</p>
                  <p className="truncate text-[11px] text-foreground-500">{draft.whatsapp || "Tanımsız"}</p>
                </div>
                <Pill tone={draft.whatsapp ? "success" : "neutral"}>{draft.whatsapp ? "Aktif" : "Kapalı"}</Pill>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 p-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                  <i className="ri-mail-line" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground-900">E-posta</p>
                  <p className="truncate text-[11px] text-foreground-500">{draft.email || "Tanımsız"}</p>
                </div>
                <Pill tone={draft.email ? "success" : "neutral"}>{draft.email ? "Aktif" : "Kapalı"}</Pill>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100 p-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-50 text-primary-700">
                  <i className="ri-phone-line" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground-900">Çağrı Merkezi</p>
                  <p className="truncate text-[11px] text-foreground-500">{draft.supportHours || "—"}</p>
                </div>
                <Pill tone="info">Aktif</Pill>
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === "notifications" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <Panel title="Bildirim Olayları" subtitle="Hangi durumlarda bildirim gönderileceğini seçin" icon="ri-notification-3-line">
              <div className="space-y-3">
                {notificationRows.map((row, index) => (
                  <div key={row.key}>
                    {index > 0 && <div className="mb-3 h-px bg-background-200" />}
                    <Toggle
                      checked={draft.notifications[row.key]}
                      onChange={(value) => patchNotifications({ [row.key]: value } as Partial<NotificationSettings>)}
                      label={row.title}
                      description={row.description}
                    />
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Gönderim Kanalları" icon="ri-send-plane-line">
              <div className="space-y-3">
                <Toggle
                  checked={draft.notifications.channels.email}
                  onChange={(value) => patchChannels({ email: value })}
                  label="E-posta"
                  description="Sipariş ve kargo bilgilendirmeleri."
                />
                <div className="h-px bg-background-200" />
                <Toggle
                  checked={draft.notifications.channels.sms}
                  onChange={(value) => patchChannels({ sms: value })}
                  label="SMS (NetGSM)"
                  description="Kontör bakiyesinden düşülür."
                />
                <div className="h-px bg-background-200" />
                <Toggle
                  checked={draft.notifications.channels.whatsapp}
                  onChange={(value) => patchChannels({ whatsapp: value })}
                  label="WhatsApp"
                  description="Onaylı şablon mesajları ile gönderilir."
                />
              </div>
            </Panel>

            <Panel title="Aktif Kanal Özeti" icon="ri-pie-chart-line">
              <p className="font-heading text-2xl font-bold text-foreground-950">
                {Object.values(draft.notifications.channels).filter(Boolean).length} / 3
              </p>
              <p className="mt-0.5 text-[11px] text-foreground-500">kanal etkin durumda</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {draft.notifications.channels.email && <Pill tone="info">E-posta</Pill>}
                {draft.notifications.channels.sms && <Pill tone="success">SMS</Pill>}
                {draft.notifications.channels.whatsapp && <Pill tone="warning">WhatsApp</Pill>}
              </div>
            </Panel>
          </div>
        </div>
      )}

      {tab === "rules" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="space-y-4 xl:col-span-2">
            <Panel title="Sipariş Kuralları" subtitle="Sepet ve kargo hesaplamalarını etkiler" icon="ri-shopping-cart-2-line">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Sipariş numarası öneki" hint="Örn. TR → #TR-10482">
                  <input value={draft.orderPrefix} onChange={(event) => patch({ orderPrefix: event.target.value.toLocaleUpperCase("tr") })} className={inputClass} maxLength={4} />
                </Field>
                <Field label="Varsayılan desi" hint="Kargo fiyat hesabında kullanılır.">
                  <input
                    type="number"
                    min={1}
                    value={draft.defaultDesi}
                    onChange={(event) => patch({ defaultDesi: Number(event.target.value) })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Ücretsiz kargo limiti (₺)">
                  <input
                    type="number"
                    min={0}
                    value={draft.freeShippingLimit}
                    onChange={(event) => patch({ freeShippingLimit: Number(event.target.value) })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Minimum sepet tutarı (₺)">
                  <input
                    type="number"
                    min={0}
                    value={draft.minBasket}
                    onChange={(event) => patch({ minBasket: Number(event.target.value) })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="mt-3 space-y-3">
                <div className="h-px bg-background-200" />
                <Toggle
                  checked={draft.codEnabled}
                  onChange={(value) => patch({ codEnabled: value })}
                  label="Kapıda ödeme kabul edilsin"
                  description="Kargo etiketine tahsilat tutarı basılır ve kargo firmasına iletilir."
                />
                {draft.codEnabled && (
                  <Field label="Kapıda ödeme hizmet bedeli (₺)">
                    <input
                      type="number"
                      min={0}
                      value={draft.codFee}
                      onChange={(event) => patch({ codFee: Number(event.target.value) })}
                      className={inputClass}
                    />
                  </Field>
                )}
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="Kural Özeti" icon="ri-file-list-3-line">
              <ul className="space-y-2 text-xs leading-relaxed text-foreground-600">
                <li className="flex items-start gap-1.5">
                  <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                  {draft.freeShippingLimit > 0
                    ? `${draft.freeShippingLimit.toLocaleString("tr-TR")} ₺ üzerindeki siparişlerde kargo ücretsiz.`
                    : "Ücretsiz kargo limiti kapalı."}
                </li>
                <li className="flex items-start gap-1.5">
                  <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                  {draft.minBasket > 0
                    ? `Minimum sepet tutarı ${draft.minBasket.toLocaleString("tr-TR")} ₺.`
                    : "Minimum sepet tutarı yok."}
                </li>
                <li className="flex items-start gap-1.5">
                  <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                  {draft.codEnabled
                    ? `Kapıda ödeme aktif, hizmet bedeli ${draft.codFee.toLocaleString("tr-TR")} ₺.`
                    : "Kapıda ödeme kapalı."}
                </li>
                <li className="flex items-start gap-1.5">
                  <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                  Sipariş numaraları #{draft.orderPrefix || "TR"}-10xxx biçiminde üretilir.
                </li>
              </ul>
            </Panel>

            <button
              type="button"
              onClick={() => onNavigate("shipping")}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-background-200 bg-background-50 px-4 py-3 text-left hover:bg-background-100"
            >
              <span className="flex items-center gap-2 text-xs font-semibold text-foreground-800">
                <i className="ri-truck-line text-primary-700" />
                Kargo fiyat tarifeleri
              </span>
              <i className="ri-arrow-right-s-line text-foreground-500" />
            </button>
          </div>
        </div>
      )}

      {tab === "integrations" && (
        <div className="space-y-4">
          <Banner tone="info">
            Entegrasyon bilgileri ilgili modülden yönetilir. Canlıya geçişte API anahtarlarının sunucu tarafında
            saklanması gerekir.
          </Banner>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {integrations.map((integration) => (
              <div key={integration.id} className="flex flex-col rounded-xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-start gap-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-800">
                    <i className={`${integration.icon} text-lg`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground-950">{integration.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-foreground-500">{integration.description}</p>
                  </div>
                  <Pill tone={integration.tone}>{integration.status}</Pill>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(integration.id)}
                  className="mt-3 flex h-8 cursor-pointer items-center gap-1.5 self-start whitespace-nowrap rounded-lg bg-background-100 px-3 text-[11px] font-semibold text-foreground-700 hover:bg-background-200"
                >
                  Modüle git
                  <i className="ri-arrow-right-line" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab !== "integrations" && (
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-background-200 bg-background-50 px-4 py-3 shadow-sm">
          <span className={`text-xs ${dirty ? "text-secondary-800" : "text-foreground-500"}`}>
            {dirty ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              disabled={!dirty}
              className={`h-9 whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium ${
                dirty ? "cursor-pointer text-foreground-700 hover:bg-background-100" : "cursor-not-allowed text-foreground-400"
              }`}
            >
              Sıfırla
            </button>
            <button
              type="button"
              onClick={save}
              className="flex h-9 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg bg-primary-800 px-4 text-xs font-semibold text-background-50 hover:bg-primary-700"
            >
              <i className="ri-save-3-line" />
              Ayarları Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}