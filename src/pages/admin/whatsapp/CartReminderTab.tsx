import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Field, Kpi, Panel, Pill, Toggle, inputClass, textareaClass } from "@/components/base/AdminUI";
import type { Tone } from "@/components/base/AdminUI";
import { formatPrice } from "@/lib/format";
import { buildCartMessage, storeCartLink, storeDisplayName, waLink } from "@/lib/whatsapp";
import type { AbandonedCart, CartStatus, WhatsAppSettings } from "@/types/integrations";

const statusMeta: Record<CartStatus, { label: string; tone: Tone }> = {
  pending: { label: "Bekliyor", tone: "warning" },
  sent: { label: "Hatırlatıldı", tone: "info" },
  recovered: { label: "Geri Kazanıldı", tone: "success" },
  expired: { label: "Süresi Doldu", tone: "danger" },
};

interface CartReminderTabProps {
  settings: WhatsAppSettings;
  onSettings: (patch: Partial<WhatsAppSettings>) => void;
  carts: AbandonedCart[];
  onCarts: (carts: AbandonedCart[]) => void;
}

export default function CartReminderTab({ settings, onSettings, carts, onCarts }: CartReminderTabProps) {
  const [filter, setFilter] = useState<"all" | CartStatus>("all");
  const [detail, setDetail] = useState<AbandonedCart | null>(null);
  const [flash, setFlash] = useState("");

  const stats = useMemo(() => {
    const pending = carts.filter((cart) => cart.status === "pending");
    const recovered = carts.filter((cart) => cart.status === "recovered");
    const revenue = recovered.reduce((sum, cart) => sum + cart.total, 0);
    const sentCount = carts.filter((cart) => cart.reminders > 0).length;
    const conversion = sentCount > 0 ? Math.round((recovered.length / sentCount) * 100) : 0;
    return {
      pending: pending.length,
      pendingValue: pending.reduce((sum, cart) => sum + cart.total, 0),
      recovered: recovered.length,
      revenue,
      conversion,
    };
  }, [carts]);

  const visible = filter === "all" ? carts : carts.filter((cart) => cart.status === filter);

  const update = (id: string, patch: Partial<AbandonedCart>) => {
    onCarts(carts.map((cart) => (cart.id === id ? { ...cart, ...patch } : cart)));
  };

  const sendReminder = (cart: AbandonedCart) => {
    window.open(waLink(settings.businessNumber, buildCartMessage(cart, settings)), "_blank", "noopener,noreferrer");
    update(cart.id, { status: cart.status === "recovered" ? "recovered" : "sent", reminders: cart.reminders + 1 });
    setFlash(`${cart.customer} için WhatsApp hatırlatma mesajı hazırlandı.`);
  };

  const filters: Array<{ id: "all" | CartStatus; label: string }> = [
    { id: "all", label: `Tümü (${carts.length})` },
    { id: "pending", label: "Bekleyen" },
    { id: "sent", label: "Hatırlatılan" },
    { id: "recovered", label: "Geri Kazanılan" },
    { id: "expired", label: "Süresi Dolan" },
  ];

  return (
    <div className="space-y-4">
      {flash && <Banner tone="success" onClose={() => setFlash("")}>{flash}</Banner>}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi icon="ri-shopping-basket-line" label="Bekleyen Sepet" value={String(stats.pending)} hint="Hatırlatma sırasında" tone="warning" />
        <Kpi icon="ri-money-dollar-circle-line" label="Riskteki Ciro" value={formatPrice(stats.pendingValue)} hint="Tamamlanmayı bekliyor" tone="info" />
        <Kpi icon="ri-arrow-go-back-line" label="Geri Kazanılan" value={String(stats.recovered)} hint={`${formatPrice(stats.revenue)} ciro`} tone="success" />
        <Kpi icon="ri-line-chart-line" label="Dönüşüm Oranı" value={`%${stats.conversion}`} hint="Hatırlatma sonrası" tone="neutral" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Terk Edilen Sepetler"
          subtitle="WhatsApp hatırlatması gönderin, sepeti kurtarın"
          icon="ri-whatsapp-line"
          action={
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as "all" | CartStatus)}
              className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-800 outline-none"
            >
              {filters.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          }
          padded={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-background-200 text-[11px] uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-2.5 font-semibold">Müşteri</th>
                  <th className="px-3 py-2.5 font-semibold">Sepet</th>
                  <th className="px-3 py-2.5 font-semibold">Tarih</th>
                  <th className="px-3 py-2.5 font-semibold">Durum</th>
                  <th className="px-4 py-2.5 text-right font-semibold">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((cart) => (
                  <tr key={cart.id} className="border-b border-background-100 last:border-0 hover:bg-background-100/60">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDetail(cart)}
                        className="cursor-pointer text-left font-medium text-foreground-950 hover:text-primary-700"
                      >
                        {cart.customer}
                      </button>
                      <p className="mt-0.5 text-[11px] text-foreground-500">{cart.phone}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-foreground-900">{formatPrice(cart.total)}</p>
                      <p className="mt-0.5 text-[11px] text-foreground-500">
                        {cart.items.reduce((sum, item) => sum + item.quantity, 0)} ürün · {cart.reminders} hatırlatma
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[11px] text-foreground-600">{cart.abandonedAt}</td>
                    <td className="px-3 py-3">
                      <Pill tone={statusMeta[cart.status].tone}>{statusMeta[cart.status].label}</Pill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => sendReminder(cart)}
                          title="WhatsApp hatırlatma gönder"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-accent-100 text-accent-800 hover:bg-accent-200"
                        >
                          <i className="ri-whatsapp-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => update(cart.id, { status: "recovered" })}
                          disabled={cart.status === "recovered"}
                          title="Geri kazanıldı olarak işaretle"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-background-100 text-foreground-700 hover:bg-background-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <i className="ri-check-double-line" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDetail(cart)}
                          title="Sepet detayı"
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-background-100 text-foreground-700 hover:bg-background-200"
                        >
                          <i className="ri-eye-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-foreground-500">
                      Bu filtrede sepet bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Hatırlatma Ayarları" subtitle="Mesaj, kupon ve zamanlama" icon="ri-settings-3-line">
          <div className="space-y-4">
            <Toggle
              checked={settings.cartReminderEnabled}
              onChange={(value) => onSettings({ cartReminderEnabled: value })}
              label="Sepet hatırlatması aktif"
              description="Mağaza sepetinde hatırlatma formu gösterilir."
            />

            <Field label="Hatırlatma süresi (saat)" hint="Sepet bu süre sonunda hatırlatma listesine düşer.">
              <input
                type="number"
                min={1}
                max={48}
                value={settings.reminderDelayHours}
                onChange={(event) => onSettings({ reminderDelayHours: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Kupon kodu">
                <input
                  value={settings.couponCode}
                  onChange={(event) => onSettings({ couponCode: event.target.value.toUpperCase() })}
                  className={inputClass}
                />
              </Field>
              <Field label="İndirim (%)">
                <input
                  type="number"
                  min={0}
                  max={70}
                  value={settings.couponPercent}
                  onChange={(event) => onSettings({ couponPercent: Number(event.target.value) })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Mesaj şablonu"
              hint="Değişkenler: {ad} {magaza} {urun_sayisi} {sepet_tutari} {kupon} {indirim} {link}"
            >
              <textarea
                rows={4}
                value={settings.reminderMessage}
                onChange={(event) => onSettings({ reminderMessage: event.target.value })}
                className={textareaClass}
              />
            </Field>

            <div className="space-y-1 rounded-lg border border-background-200 bg-background-100 px-3 py-2 text-[11px] text-foreground-600">
              <p className="flex flex-wrap items-center gap-1">
                <i className="ri-store-2-line text-foreground-500" />
                Mağaza adı: <strong className="font-semibold text-foreground-900">{storeDisplayName()}</strong>
              </p>
              <p className="flex flex-wrap items-center gap-1">
                <i className="ri-link text-foreground-500" />
                Bağlantı: <strong className="font-semibold text-foreground-900">{storeCartLink()}</strong>
              </p>
              <p className="text-foreground-500">
                Bu bilgiler Mağaza Ayarları&apos;ndaki mağaza adı ve e-posta adresinden otomatik üretilir.
              </p>
            </div>

            <div className="rounded-lg border border-accent-200 bg-accent-50 p-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-accent-900">
                <i className="ri-whatsapp-line" />
                Önizleme
              </p>
              <p className="text-[11px] leading-relaxed text-accent-800">
                {carts[0] ? buildCartMessage(carts[0], settings) : "Sepet verisi yok."}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.customer ?? ""}
        subtitle={detail ? `${detail.phone} · ${detail.abandonedAt}` : ""}
        icon="ri-shopping-basket-line"
        maxWidth="max-w-xl"
        footer={
          detail && (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="h-9 cursor-pointer rounded-lg border border-background-300 px-3 text-sm text-foreground-700 hover:bg-background-100"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => {
                  sendReminder(detail);
                  setDetail(null);
                }}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-accent-600 px-3 text-sm font-semibold text-background-50 hover:bg-accent-700"
              >
                <i className="ri-whatsapp-line" />
                WhatsApp Hatırlatma Gönder
              </button>
            </div>
          )
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-background-200 bg-background-100 p-2.5">
                <p className="text-foreground-500">Sepet tutarı</p>
                <p className="mt-0.5 font-heading text-base font-bold text-foreground-950">{formatPrice(detail.total)}</p>
              </div>
              <div className="rounded-lg border border-background-200 bg-background-100 p-2.5">
                <p className="text-foreground-500">Kaynak</p>
                <p className="mt-0.5 font-semibold text-foreground-900">{detail.source}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-foreground-700">Sepetteki ürünler</p>
              <ul className="space-y-2">
                {detail.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-background-200 px-3 py-2 text-xs"
                  >
                    <span className="min-w-0 flex-1 text-foreground-800">
                      {item.name} <span className="text-foreground-500">× {item.quantity}</span>
                    </span>
                    <span className="whitespace-nowrap font-semibold text-foreground-950">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-accent-200 bg-accent-50 p-3 text-[11px] leading-relaxed text-accent-800">
              {buildCartMessage(detail, settings)}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}