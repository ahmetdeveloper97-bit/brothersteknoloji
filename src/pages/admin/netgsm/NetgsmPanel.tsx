import { useState } from "react";
import { Tabs } from "@/components/base/AdminUI";
import SmsComposeTab from "@/pages/admin/netgsm/SmsComposeTab";
import SegmentCampaignTab from "@/pages/admin/netgsm/SegmentCampaignTab";
import CouponReminderTab from "@/pages/admin/netgsm/CouponReminderTab";
import SmsContactsTab from "@/pages/admin/netgsm/SmsContactsTab";
import SmsTemplatesTab from "@/pages/admin/netgsm/SmsTemplatesTab";
import SmsReportsTab from "@/pages/admin/netgsm/SmsReportsTab";
import SmsSettingsTab from "@/pages/admin/netgsm/SmsSettingsTab";
import {
  KEYS,
  loadNetgsmSettings,
  loadSmsContacts,
  loadSmsLogs,
  loadSmsTemplates,
} from "@/lib/integrations";
import { usePersistentState } from "@/lib/persistent";
import type { NetgsmSettings, SmsContact, SmsMessage, SmsTemplate } from "@/types/integrations";

type TabId = "compose" | "segments" | "coupons" | "contacts" | "templates" | "reports" | "settings";

export default function NetgsmPanel() {
  const [tab, setTab] = useState<TabId>("compose");
  const [settings, setSettings] = usePersistentState<NetgsmSettings>(KEYS.netgsm, loadNetgsmSettings());
  const [contacts, setContacts] = usePersistentState<SmsContact[]>(KEYS.smsContacts, loadSmsContacts());
  const [templates, setTemplates] = usePersistentState<SmsTemplate[]>(KEYS.smsTemplates, loadSmsTemplates());
  const [logs, setLogs] = usePersistentState<SmsMessage[]>(KEYS.smsLogs, loadSmsLogs());

  const patchSettings = (patch: Partial<NetgsmSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "compose", label: "Toplu SMS", icon: "ri-send-plane-line" },
          { id: "segments", label: "Segment Kampanyası", icon: "ri-user-star-line" },
          { id: "coupons", label: "Kupon Hatırlatma", icon: "ri-notification-3-line" },
          { id: "contacts", label: "Kişiler", icon: "ri-contacts-book-2-line", badge: contacts.length },
          { id: "templates", label: "Şablonlar", icon: "ri-file-text-line" },
          { id: "reports", label: "Raporlar", icon: "ri-file-chart-line" },
          { id: "settings", label: "Ayarlar", icon: "ri-settings-3-line" },
        ]}
      />

      {tab === "compose" && (
        <SmsComposeTab
          settings={settings}
          contacts={contacts}
          templates={templates}
          logs={logs}
          onLogs={setLogs}
          onBalance={(balance) => patchSettings({ balance })}
        />
      )}
      {tab === "segments" && (
        <SegmentCampaignTab
          settings={settings}
          logs={logs}
          onLogs={setLogs}
          onSettings={patchSettings}
        />
      )}
      {tab === "coupons" && (
        <CouponReminderTab settings={settings} logs={logs} onLogs={setLogs} onSettings={patchSettings} />
      )}
      {tab === "contacts" && <SmsContactsTab contacts={contacts} onContacts={setContacts} />}
      {tab === "templates" && <SmsTemplatesTab templates={templates} onTemplates={setTemplates} />}
      {tab === "reports" && <SmsReportsTab logs={logs} />}
      {tab === "settings" && <SmsSettingsTab settings={settings} onSettings={patchSettings} />}
    </div>
  );
}