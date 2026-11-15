import { useState } from "react";
import { Tabs } from "@/components/base/AdminUI";
import CartReminderTab from "@/pages/admin/whatsapp/CartReminderTab";
import LiveSupportTab from "@/pages/admin/whatsapp/LiveSupportTab";
import { KEYS, loadAbandonedCarts, loadWhatsAppSettings } from "@/lib/integrations";
import { usePersistentState } from "@/lib/persistent";
import type { AbandonedCart, WhatsAppSettings } from "@/types/integrations";

export default function WhatsAppPanel() {
  const [tab, setTab] = useState<"cart" | "support">("cart");
  const [settings, setSettings] = usePersistentState<WhatsAppSettings>(KEYS.waSettings, loadWhatsAppSettings());
  const [carts, setCarts] = usePersistentState<AbandonedCart[]>(KEYS.carts, loadAbandonedCarts());

  const patchSettings = (patch: Partial<WhatsAppSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  const pending = carts.filter((cart) => cart.status === "pending").length;

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "cart", label: "Sepet Hatırlatma", icon: "ri-shopping-basket-line", badge: pending },
          { id: "support", label: "Canlı Destek", icon: "ri-customer-service-2-line" },
        ]}
      />

      {tab === "cart" ? (
        <CartReminderTab settings={settings} onSettings={patchSettings} carts={carts} onCarts={setCarts} />
      ) : (
        <LiveSupportTab settings={settings} onSettings={patchSettings} />
      )}
    </div>
  );
}