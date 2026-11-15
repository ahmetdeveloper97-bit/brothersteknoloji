import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { readJson, writeJson } from "@/lib/persistent";
import type { AdminStaff, AdminStaffProfile } from "@/types/adminRoles";

export const ADMIN_STAFF_EVENT = "eticaretv8:admin-staff-updated";
export const ADMIN_SESSION_KEY = "eticaretv8_admin";
export const ADMIN_TOKEN_KEY = "eticaretv8_admin_token";

/** Önceki sürümlerde hesapların tutulduğu yerel kayıt; yalnızca tek seferlik taşıma için okunur. */
const LEGACY_STAFF_KEY = "eticaretv8_admin_staff";

export type CredentialError = "not-found" | "wrong-password" | "inactive" | "network";

export interface CredentialResult {
  member?: AdminStaff;
  error?: CredentialError;
  message?: string;
  twoFactor?: { challenge: string; member: AdminStaff };
}

export interface StaffMutationResult {
  ok: boolean;
  message?: string;
}

interface FunctionResult {
  ok: boolean;
  code?: string;
  message?: string;
  data?: Record<string, unknown>;
}

let rosterCache: AdminStaff[] = [];

const cloneStaff = (staff: AdminStaff[]): AdminStaff[] =>
  staff.map((member) => ({ ...member, roles: [...member.roles] }));

const emitStaffChange = (): void => {
  try {
    window.dispatchEvent(new Event(ADMIN_STAFF_EVENT));
  } catch {
    /* event may be unavailable */
  }
};

const readToken = (): string => {
  try {
    return window.localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};

/** Geçerli yönetici oturum anahtarını döner (yoksa boş metin). */
export const readAdminToken = (): string => readToken();

const writeToken = (token: string): void => {
  try {
    if (token) window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
    else window.localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    /* storage may be unavailable */
  }
};

const extractError = async (error: unknown): Promise<{ code: string; message: string }> => {
  const fallback = { code: "network", message: "Sunucuya ulaşılamadı. Bağlantınızı kontrol edin." };
  try {
    const context = (error as { context?: { json?: () => Promise<unknown> } } | null)?.context;
    if (context && typeof context.json === "function") {
      const parsed = (await context.json()) as { code?: string; message?: string } | null;
      return {
        code: parsed?.code ? String(parsed.code) : fallback.code,
        message: parsed?.message ? String(parsed.message) : fallback.message,
      };
    }
  } catch {
    /* yanıt gövdesi okunamadı */
  }
  return fallback;
};

const invoke = async (body: Record<string, unknown>): Promise<FunctionResult> => {
  if (!isSupabaseConfigured) {
    return { ok: false, code: "not_configured", message: "Sunucu bağlantısı yapılandırılmamış." };
  }

  try {
    const { data, error } = await supabase.functions.invoke("admin-auth", { body });
    if (error) {
      const parsed = await extractError(error);
      return { ok: false, code: parsed.code, message: parsed.message };
    }
    const payload = (data ?? {}) as Record<string, unknown>;
    if (payload.ok !== true) {
      return {
        ok: false,
        code: payload.code ? String(payload.code) : "error",
        message: payload.message ? String(payload.message) : "İşlem tamamlanamadı.",
        data: payload,
      };
    }
    return { ok: true, data: payload };
  } catch (error) {
    const parsed = await extractError(error);
    return { ok: false, code: parsed.code, message: parsed.message };
  }
};

const asMembers = (value: unknown): AdminStaff[] => {
  if (!Array.isArray(value)) return [];
  return (value as AdminStaff[]).map((member) => ({ ...member, roles: [...(member.roles ?? [])] }));
};

const setCache = (staff: AdminStaff[]): AdminStaff[] => {
  rosterCache = cloneStaff(staff);
  emitStaffChange();
  return loadStaff();
};

const upsertCache = (member: AdminStaff): void => {
  const index = rosterCache.findIndex((item) => item.id === member.id);
  if (index >= 0) rosterCache = rosterCache.map((item) => (item.id === member.id ? member : item));
  else rosterCache = [...rosterCache, member];
  emitStaffChange();
};

/**
 * Sunucuda henüz hesap yoksa mevcut yerel kayıtları (varsa) ya da varsayılan genel yöneticiyi
 * bir kez oluşturur. Yalnızca ilk kurulumda çalışır.
 */
export const bootstrapAdminAuth = async (): Promise<void> => {
  const legacy = readJson<AdminStaff[] | null>(LEGACY_STAFF_KEY, null);
  const staff = Array.isArray(legacy) ? legacy : [];
  await invoke({ action: "bootstrap", staff });
};

export const adminLogin = async (
  email: string,
  password: string,
  remember: boolean,
): Promise<CredentialResult> => {
  const attempt = await invoke({ action: "login", email, password, remember });

  if (!attempt.ok && attempt.code === "not-found") {
    // İlk kurulumda hesaplar sunucuda olmayabilir; bir kez taşıyıp yeniden deniyoruz.
    await bootstrapAdminAuth();
    const retry = await invoke({ action: "login", email, password, remember });
    return handleLoginResult(retry, remember);
  }

  return handleLoginResult(attempt, remember);
};

const handleLoginResult = (result: FunctionResult, remember: boolean): CredentialResult => {
  if (!result.ok) {
    if (result.code === "not-found") {
      return {
        error: "not-found",
        message: "Bu e-posta ile kayıtlı bir yönetici bulunamadı.",
      };
    }
    if (result.code === "wrong-password") {
      return { error: "wrong-password", message: "Şifre hatalı." };
    }
    if (result.code === "inactive") {
      return { error: "inactive", message: "Bu hesap pasife alınmış." };
    }
    return { error: "network", message: result.message ?? "Giriş yapılamadı." };
  }

  const payload = result.data ?? {};

  if (payload.twoFactorRequired === true) {
    const challenge = String(payload.challenge ?? "");
    const member = payload.member ? (payload.member as AdminStaff) : undefined;
    if (!challenge || !member) {
      return { error: "network", message: "Doğrulama başlatılamadı. Lütfen tekrar deneyin." };
    }
    return { twoFactor: { challenge, member } };
  }

  const token = String(payload.token ?? "");
  const member = payload.member ? (payload.member as AdminStaff) : undefined;
  if (!token || !member) {
    return { error: "network", message: "Giriş yanıtı okunamadı. Lütfen tekrar deneyin." };
  }

  writeToken(token);
  writeJson(ADMIN_SESSION_KEY, { email: member.email, name: member.name, remember });
  setCache([...rosterCache.filter((item) => item.id !== member.id), member]);
  return { member };
};

/** İki adımlı doğrulama kodunu sunucuda doğrular ve oturumu açar. */
export const adminVerifyTwoFactor = async (
  challenge: string,
  otp: string,
  remember: boolean,
): Promise<CredentialResult> => {
  const result = await invoke({ action: "verifyTwoFactor", challenge, otp, remember });
  if (!result.ok) {
    return {
      error: result.code === "inactive" ? "inactive" : "network",
      message: result.message ?? "Kod doğrulanamadı.",
    };
  }
  return handleLoginResult(result, remember);
};

export interface SessionResult {
  member?: AdminStaff;
  error?: "unauthorized" | "inactive" | "network";
}

/** Kayıtlı oturumu sunucuda doğrular ve güncel yönetici kaydını döner. */
export const loadAdminSession = async (): Promise<SessionResult> => {
  const token = readToken();
  if (!token) return { error: "unauthorized" };

  const result = await invoke({ action: "session", token });
  if (!result.ok) {
    if (result.code === "inactive") return { error: "inactive" };
    if (result.code === "db_error") return { error: "network" };
    writeToken("");
    return { error: "unauthorized" };
  }

  const member = result.data?.member as AdminStaff | undefined;
  if (!member) {
    writeToken("");
    return { error: "unauthorized" };
  }

  upsertCache(member);
  return { member };
};

export const adminLogout = async (): Promise<void> => {
  const token = readToken();
  writeToken("");
  try {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* storage may be unavailable */
  }
  if (token) await invoke({ action: "logout", token });
};

/** Sunucudaki güncel yönetici listesini getirir. */
export const refreshStaff = async (): Promise<AdminStaff[]> => {
  const token = readToken();
  if (!token) return loadStaff();
  const result = await invoke({ action: "roster", token });
  if (!result.ok) return loadStaff();
  return setCache(asMembers(result.data?.staff));
};

export const loadStaff = (): AdminStaff[] => cloneStaff(rosterCache);

export const findStaffByEmail = (email: string): AdminStaff | undefined => {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  return rosterCache.find((member) => member.email.toLowerCase() === normalized);
};

export const findStaffById = (staffId: string): AdminStaff | undefined =>
  rosterCache.find((member) => member.id === staffId);

/** Personel listesini sunucuya kaydeder. */
export const saveStaff = async (staff: AdminStaff[]): Promise<StaffMutationResult> => {
  setCache(staff);

  const token = readToken();
  if (!token) {
    return { ok: false, message: "Oturum bulunamadı. Lütfen yeniden giriş yapın." };
  }

  const result = await invoke({ action: "sync", token, staff });
  if (!result.ok) {
    return { ok: false, message: result.message ?? "Değişiklikler kaydedilemedi." };
  }

  if (result.data?.staff) setCache(asMembers(result.data.staff));
  return { ok: true };
};

const pushProfile = async (staffId: string, patch: Record<string, unknown>): Promise<StaffMutationResult> => {
  const token = readToken();
  if (!token) return { ok: false, message: "Oturum bulunamadı." };
  const result = await invoke({ action: "setProfile", token, id: staffId, patch });
  return result.ok ? { ok: true } : { ok: false, message: result.message };
};

const applyCachePatch = (staffId: string, patch: Partial<AdminStaff>): void => {
  rosterCache = rosterCache.map((member) => (member.id === staffId ? { ...member, ...patch } : member));
  emitStaffChange();
};

export const updateStaffProfile = async (
  staffId: string,
  patch: AdminStaffProfile,
): Promise<StaffMutationResult> => {
  applyCachePatch(staffId, patch);
  return pushProfile(staffId, { ...patch });
};

export const setStaffName = async (staffId: string, name: string): Promise<StaffMutationResult> => {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, message: "Ad soyad boş olamaz." };
  applyCachePatch(staffId, { name: trimmed });
  return pushProfile(staffId, { name: trimmed });
};

export const setStaffPassword = async (staffId: string, rawPassword: string): Promise<StaffMutationResult> => {
  const token = readToken();
  if (!token) return { ok: false, message: "Oturum bulunamadı." };

  const result = await invoke({ action: "setPassword", token, id: staffId, password: rawPassword });
  if (!result.ok) return { ok: false, message: result.message ?? "Şifre kaydedilemedi." };

  applyCachePatch(staffId, { passwordUpdatedAt: new Date().toISOString(), passwordHash: undefined });
  return { ok: true };
};

export const changeAdminPassword = async (
  currentPassword: string,
  nextPassword: string,
): Promise<StaffMutationResult> => {
  const token = readToken();
  if (!token) return { ok: false, message: "Oturum bulunamadı." };
  const result = await invoke({ action: "changePassword", token, currentPassword, newPassword: nextPassword });
  if (!result.ok) return { ok: false, message: result.message ?? "Şifre güncellenemedi." };

  const email = readAdminSessionEmail();
  const member = findStaffByEmail(email);
  if (member) applyCachePatch(member.id, { passwordUpdatedAt: new Date().toISOString() });
  return { ok: true };
};

export const setStaffTwoFactor = async (staffId: string, secret: string): Promise<StaffMutationResult> => {
  const token = readToken();
  if (!token) return { ok: false, message: "Oturum bulunamadı." };
  const result = await invoke({ action: "setTwoFactor", token, id: staffId, secret });
  if (!result.ok) return { ok: false, message: result.message ?? "İki adımlı doğrulama kaydedilemedi." };

  applyCachePatch(staffId, {
    twoFactorEnabled: true,
    twoFactorEnabledAt: new Date().toISOString(),
  });
  return { ok: true };
};

export const clearStaffTwoFactor = async (staffId: string): Promise<StaffMutationResult> => {
  const token = readToken();
  if (!token) return { ok: false, message: "Oturum bulunamadı." };
  const result = await invoke({ action: "clearTwoFactor", token, id: staffId });
  if (!result.ok) return { ok: false, message: result.message ?? "İşlem tamamlanamadı." };

  applyCachePatch(staffId, {
    twoFactorEnabled: false,
    twoFactorSecret: undefined,
    twoFactorEnabledAt: undefined,
  });
  return { ok: true };
};

export const createStaffId = (): string =>
  `stf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const staffInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase("tr"))
    .join("") || "AD";

export const readAdminSessionEmail = (): string => {
  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed?.email ?? "";
  } catch {
    return "";
  }
};

export interface StaffDirectoryEntry {
  name: string;
  avatarUrl?: string;
}

/** E-posta anahtarıyla personel adı ve profil fotoğrafını verir. */
export const staffDirectory = (): Record<string, StaffDirectoryEntry> => {
  const directory: Record<string, StaffDirectoryEntry> = {};
  rosterCache.forEach((member) => {
    directory[member.email.toLowerCase()] = { name: member.name, avatarUrl: member.avatarUrl };
  });
  return directory;
};

export const avatarForEmail = (email: string, directory?: Record<string, StaffDirectoryEntry>): string | undefined => {
  const map = directory ?? staffDirectory();
  return map[(email ?? "").toLowerCase()]?.avatarUrl;
};