import type { AdminRoleId } from "@/types/adminRoles";

export type ActivityCategory = "auth" | "staff" | "shipping" | "security" | "ads";

export interface ActivityLog {
  id: string;
  at: string;
  category: ActivityCategory;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  target: string;
  detail: string;
}

export type SupportTaskStatus = "open" | "done";

export interface SupportTask {
  id: string;
  title: string;
  detail: string;
  orderId: string;
  shipmentId: string;
  customer: string;
  tracking: string;
  createdAt: string;
  createdBy: string;
  assignedRole: AdminRoleId;
  status: SupportTaskStatus;
  completedAt: string;
  completedBy: string;
}