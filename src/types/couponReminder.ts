import type { CustomerSegment } from "@/types/admin";

export type CouponReminderStatus = "scheduled" | "sent" | "cancelled";

export interface CouponReminder {
  id: string;
  campaignId: string;
  code: string;
  title: string;
  discountLabel: string;
  endDate: string;
  sendDate: string;
  segment: CustomerSegment | "all";
  template: string;
  status: CouponReminderStatus;
  createdAt: string;
  sentAt: string | null;
  recipients: number;
  credits: number;
  auto: boolean;
}

export interface CouponReminderSettings {
  autoEnabled: boolean;
  daysBefore: number;
  segment: CustomerSegment | "all";
  template: string;
}