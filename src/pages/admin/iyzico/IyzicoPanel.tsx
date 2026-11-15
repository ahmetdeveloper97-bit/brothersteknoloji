import { useState } from "react";
import { Tabs } from "@/components/base/AdminUI";
import TransactionsTab from "@/pages/admin/iyzico/TransactionsTab";
import InstallmentsTab from "@/pages/admin/iyzico/InstallmentsTab";
import IyzicoSettingsTab from "@/pages/admin/iyzico/IyzicoSettingsTab";
import { KEYS, loadIyzicoSettings, loadPayments } from "@/lib/integrations";
import { usePersistentState } from "@/lib/persistent";
import type { IyzicoSettings, PaymentTransaction } from "@/types/integrations";

type TabId = "transactions" | "installments" | "settings";

export default function IyzicoPanel() {
  const [tab, setTab] = useState<TabId>("transactions");
  const [settings, setSettings] = usePersistentState<IyzicoSettings>(KEYS.iyzico, loadIyzicoSettings());
  const [payments, setPayments] = usePersistentState<PaymentTransaction[]>(KEYS.payments, loadPayments());

  const patchSettings = (patch: Partial<IyzicoSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  const pending = payments.filter((payment) => payment.status === "pending3d").length;

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "transactions", label: "İşlemler", icon: "ri-bank-card-line", badge: pending },
          { id: "installments", label: "Taksit & Komisyon", icon: "ri-calendar-2-line" },
          { id: "settings", label: "Ayarlar", icon: "ri-settings-3-line" },
        ]}
      />

      {tab === "transactions" && <TransactionsTab payments={payments} onPayments={setPayments} />}
      {tab === "installments" && <InstallmentsTab settings={settings} onSettings={patchSettings} />}
      {tab === "settings" && <IyzicoSettingsTab settings={settings} onSettings={patchSettings} />}
    </div>
  );
}