import type { AdminStaff } from "@/types/adminRoles";

export const adminStaffSeed: AdminStaff[] = [
  {
    id: "stf-owner",
    name: "Fırat Yönetici",
    email: "demo@brothersteknoloji.com",
    phone: "0532 000 00 01",
    roles: ["yonetici"],
    active: true,
    createdAt: "2026-01-04",
    passwordHash: "Yonetici2026",
    passwordUpdatedAt: "2026-01-04",
  },
];