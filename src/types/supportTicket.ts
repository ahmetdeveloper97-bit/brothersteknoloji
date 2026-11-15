export type TicketStatus = "open" | "answered" | "customer_reply" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketSender = "customer" | "staff" | "system";

export interface TicketAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface TicketMessage {
  id: string;
  sender: TicketSender;
  authorName: string;
  body: string;
  attachments: TicketAttachment[];
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNo: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  orderNo: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedName: string;
  attachments: TicketAttachment[];
  lastMessageAt: string;
  closedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketDetail extends SupportTicket {
  messages: TicketMessage[];
}

export interface SupportTicketSummary {
  id: string;
  ticketNo: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedName: string;
  orderNo: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface TicketCounts {
  all: number;
  open: number;
  answered: number;
  customer_reply: number;
  closed: number;
}

/** Formda seçilen, henüz yüklenmemiş dosya. */
export interface PendingAttachment {
  name: string;
  type: string;
  size: number;
  dataBase64: string;
}

export interface TicketCreateInput {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
  orderNo: string;
  attachments: PendingAttachment[];
}

export interface TicketResult<T> {
  ok: boolean;
  code?: string;
  message?: string;
  data?: T;
}