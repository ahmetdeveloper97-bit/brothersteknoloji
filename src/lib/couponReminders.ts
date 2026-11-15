import { campaignState, loadCampaigns, loadCustomers } from "@/lib/adminStore";
import { couponDaysLeft, couponHintLabel } from "@/lib/coupons";
import { KEYS } from "@/lib/integrations";
import { readJson } from "@/lib/persistent";
import { eligibleRecipients, fillSegmentTemplate, sendSegmentCampaign } from "@/lib/segmentSms";
import type { AdminCustomer, Campaign, CustomerSegment } from "@/types/admin";
import type { CouponReminder, CouponReminderSettings } from "@/types/couponReminder";
import type { NetgsmSettings, SmsMessage } from "@/types/integrations";

export const REMINDER_LINK = "brothersteknoloji.com/kuponlarim";
export const REMINDER_STORE_NAME = "Brothers Teknoloji";

export const todayStr = (): string => new Date().toISOString().slice(0, 10);

export const reminderTemplates: Array<{ id: string; label: string; body: string }> = [
  {
    id: "lastCall",
    label: "Son fırsat",
    body:
      "Sayin {ad}, {kod} kodlu {indirim} kuponunuz {kalan} gun icinde sona eriyor. Sepetinizi tamamlayin: {link}",
  },
  {
    id: "expiring",
    label: "Süre hatırlatma",
    body: "Sayin {ad}, {kod} kuponunuzun suresi {kalan} gun sonra doluyor. {indirim} firsatini kacirmayin: {link}",
  },
  {
    id: "vip",
    label: "VIP hatırlatma",
    body: "Sayin {ad}, size ozel {kod} kodlu {indirim} kuponunuz {kalan} gun gecerli. Sizi bekliyoruz: {link}",
  },
];

export const defaultReminderSettings: CouponReminderSettings = {
  autoEnabled: true,
  daysBefore: 3,
  segment: "all",
  template: reminderTemplates[0].body,
};

export const loadCouponReminders = (): CouponReminder[] =>
  readJson<CouponReminder[]>(KEYS.couponReminders, []);

export const loadCouponReminderSettings = (): CouponReminderSettings => {
  const stored = readJson<Partial<CouponReminderSettings> | null>(KEYS.couponReminderSettings, null);
  if (!stored) return { ...defaultReminderSettings };
  return {
    autoEnabled: stored.autoEnabled ?? defaultReminderSettings.autoEnabled,
    daysBefore: stored.daysBefore ?? defaultReminderSettings.daysBefore,
    segment: stored.segment ?? defaultReminderSettings.segment,
    template: stored.template && stored.template.trim() ? stored.template : defaultReminderSettings.template,
  };
};

/** Bitişine `daysBefore` günden az kalan aktif kuponlar — "Kuponlarım" kartındaki uyarıyla aynı küme. */
export const expiringCoupons = (daysBefore = 3): Campaign[] =>
  loadCampaigns()
    .filter((campaign) => {
      if (campaignState(campaign) !== "active") return false;
      if (campaign.used >= campaign.usageLimit) return false;
      const days = couponDaysLeft(campaign);
      return days >= 0 && days <= daysBefore;
    })
    .sort((a, b) => couponDaysLeft(a) - couponDaysLeft(b));

export const firstName = (name: string): string => name.split(" ")[0] || name;

export const reminderRecipients = (segment: CustomerSegment | "all"): AdminCustomer[] =>
  eligibleRecipients(loadCustomers(), segment);

export const estimateReminderCredits = (params: {
  template: string;
  code: string;
  discountLabel: string;
  segment: CustomerSegment | "all";
  daysLeft: number;
}): number => {
  if (params.template.trim().length < 10) return 0;
  return reminderRecipients(params.segment).reduce((sum, customer) => {
    const body = fillSegmentTemplate(params.template, {
      ad: firstName(customer.name),
      segment: customer.segment,
      kod: params.code,
      indirim: params.discountLabel,
      link: REMINDER_LINK,
      magaza: REMINDER_STORE_NAME,
      kalan: String(Math.max(0, params.daysLeft)),
    });
    return sum + Math.max(1, Math.ceil(body.length / 160));
  }, 0);
};

export const buildReminder = (
  campaign: Campaign,
  options: {
    segment: CustomerSegment | "all";
    template: string;
    sendDate: string;
    auto: boolean;
  }
): CouponReminder => ({
  id: `KR-${Date.now().toString().slice(-6)}${Math.random().toString(36).slice(2, 5)}`,
  campaignId: campaign.id,
  code: campaign.code,
  title: campaign.title,
  discountLabel: couponHintLabel(campaign),
  endDate: campaign.endDate,
  sendDate: options.sendDate || todayStr(),
  segment: options.segment,
  template: options.template,
  status: "scheduled",
  createdAt: todayStr(),
  sentAt: null,
  recipients: reminderRecipients(options.segment).length,
  credits: 0,
  auto: options.auto,
});

export const pendingReminderFor = (
  reminders: CouponReminder[],
  campaignId: string
): CouponReminder | null =>
  reminders.find((reminder) => reminder.campaignId === campaignId && reminder.status === "scheduled") ?? null;

export const dueReminders = (reminders: CouponReminder[]): CouponReminder[] => {
  const today = todayStr();
  return reminders.filter((reminder) => reminder.status === "scheduled" && reminder.sendDate <= today);
};

export const autoPlanReminders = (
  reminders: CouponReminder[],
  settings: CouponReminderSettings
): CouponReminder[] => {
  if (!settings.autoEnabled) return [];
  const created = expiringCoupons(settings.daysBefore)
    .filter((campaign) => !pendingReminderFor(reminders, campaign.id))
    .map((campaign) =>
      buildReminder(campaign, {
        segment: settings.segment,
        template: settings.template,
        sendDate: todayStr(),
        auto: true,
      })
    );
  return created;
};

export interface ReminderSendResult {
  ok: boolean;
  message: string;
  logs: SmsMessage[];
  balance: number;
  credits: number;
  recipients: number;
  status: "sent";
}

export const sendReminder = (reminder: CouponReminder, settings: NetgsmSettings): ReminderSendResult => {
  const campaign = loadCampaigns().find((item) => item.id === reminder.campaignId) ?? null;
  const daysLeft = campaign ? Math.max(0, couponDaysLeft(campaign)) : 0;

  const result = sendSegmentCampaign({
    customers: loadCustomers(),
    segment: reminder.segment,
    template: reminder.template,
    code: reminder.code,
    discountLabel: reminder.discountLabel,
    link: REMINDER_LINK,
    storeName: REMINDER_STORE_NAME,
    settings,
    daysLeft,
  });

  return {
    ok: result.ok,
    message: result.message,
    logs: result.logs,
    balance: result.balance,
    credits: result.credits,
    recipients: result.sent,
    status: "sent",
  };
};

/** Geçmişte gönderilmiş kayıtlar "Raporlar" sekmesinde de görünsün diye SMS logları ile birleştirilir. */
export const reminderLogSummary = (reminders: CouponReminder[]): { sent: number; planned: number } => {
  const sent = reminders.filter((reminder) => reminder.status === "sent").length;
  const planned = reminders.filter((reminder) => reminder.status === "scheduled").length;
  return { sent, planned };
};