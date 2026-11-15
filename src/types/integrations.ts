export interface QuickReply {
  id: string;
  label: string;
  text: string;
}

export interface WhatsAppSettings {
  businessNumber: string;
  displayName: string;
  cartReminderEnabled: boolean;
  liveSupportEnabled: boolean;
  reminderDelayHours: number;
  reminderMessage: string;
  couponCode: string;
  couponPercent: number;
  greeting: string;
  awayMessage: string;
  workingHours: string;
  quickReplies: QuickReply[];
}

export type CartStatus = "pending" | "sent" | "recovered" | "expired";

export interface AbandonedCartItem {
  name: string;
  quantity: number;
  price: number;
}

export interface AbandonedCart {
  id: string;
  customer: string;
  phone: string;
  email: string;
  items: AbandonedCartItem[];
  total: number;
  abandonedAt: string;
  status: CartStatus;
  reminders: number;
  source: string;
}

export interface LiveConversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  topic: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  category: string;
  body: string;
}

export interface SmsContact {
  id: string;
  name: string;
  phone: string;
  group: string;
  optIn: boolean;
}

export type SmsStatus = "delivered" | "queued" | "failed";

export interface SmsMessage {
  id: string;
  to: string;
  name: string;
  body: string;
  status: SmsStatus;
  date: string;
  header: string;
}

export interface NetgsmSettings {
  usercode: string;
  password: string;
  header: string;
  senderName: string;
  enabled: boolean;
  iysFilter: boolean;
  balance: number;
}

export interface InstallmentPlan {
  count: number;
  rate: number;
}

export interface IyzicoSettings {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  merchantId: string;
  threeDSecure: boolean;
  enabled: boolean;
  plans: InstallmentPlan[];
}

export type PaymentStatus = "success" | "pending3d" | "failed" | "refunded";

export interface PaymentTransaction {
  id: string;
  customer: string;
  email: string;
  amount: number;
  installment: number;
  cardMask: string;
  status: PaymentStatus;
  date: string;
}