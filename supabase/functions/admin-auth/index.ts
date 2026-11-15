import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/** Panel şifreleri için kullanılan tek yönlü özet (istemci ile aynı algoritma). */
const hashPassword = (value: string): string => {
  let forward = 5381;
  for (let index = 0; index < value.length; index += 1) {
    forward = (forward * 33 + value.charCodeAt(index)) % 2147483647;
  }
  let backward = 7;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    backward = (backward * 31 + value.charCodeAt(index)) % 2147483647;
  }
  return `v1$${forward.toString(36)}$${backward.toString(36)}$${value.length}`;
};

const verifyPassword = (stored: string | undefined | null, input: string): boolean => {
  if (!stored || !input) return false;
  if (stored.startsWith("v1$")) return stored === hashPassword(input);
  return stored === input;
};

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const base32Decode = (input: string): Uint8Array => {
  const clean = input.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
};

const hotpValue = async (keyBytes: Uint8Array, counter: number): Promise<number> => {
  const counterBytes = new Uint8Array(8);
  let remaining = counter;
  for (let index = 7; index >= 0; index -= 1) {
    counterBytes[index] = remaining & 0xff;
    remaining = Math.floor(remaining / 256);
  }
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign("HMAC", key, counterBytes));
  const offset = signature[signature.length - 1] & 0x0f;
  const code =
    ((signature[offset] & 0x7f) << 24) |
    ((signature[offset + 1] & 0xff) << 16) |
    ((signature[offset + 2] & 0xff) << 8) |
    (signature[offset + 3] & 0xff);
  return code % 1000000;
};

const verifyTotpCode = async (secret: string, input: string): Promise<boolean> => {
  const digits = input.replace(/\D/g, "");
  if (digits.length !== 6 || !secret) return false;
  const target = Number(digits);
  const keyBytes = base32Decode(secret);
  if (keyBytes.length === 0) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (const drift of [-1, 0, 1]) {
    const value = await hotpValue(keyBytes, counter + drift);
    if (value === target) return true;
  }
  return false;
};

const PENDING_PREFIX = "2fa.";

const randomToken = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const normalizeEmail = (value: unknown): string => String(value ?? "").trim().toLowerCase();

const asString = (value: unknown, fallback = ""): string => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const asNullableString = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const text = String(value);
  return text.trim() ? text : null;
};

const asBooleanOrNull = (value: unknown): boolean | null => {
  if (value === null || value === undefined) return null;
  return Boolean(value);
};

const asRoles = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter(Boolean);
};

interface StaffPayload {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  roles?: unknown;
  active?: unknown;
  createdAt?: unknown;
  passwordHash?: unknown;
  password?: unknown;
  passwordUpdatedAt?: unknown;
  lastLoginAt?: unknown;
  twoFactorEnabled?: unknown;
  twoFactorSecret?: unknown;
  twoFactorEnabledAt?: unknown;
  avatarUrl?: unknown;
  jobTitle?: unknown;
  city?: unknown;
  bio?: unknown;
  notifyEmail?: unknown;
  notifyTasks?: unknown;
  notifySms?: unknown;
}

const toRow = (input: StaffPayload, includePassword: boolean) => {
  const row: Record<string, unknown> = {
    id: asString(input.id),
    name: asString(input.name).trim(),
    email: normalizeEmail(input.email),
    phone: asString(input.phone),
    roles: asRoles(input.roles),
    active: input.active === undefined ? true : Boolean(input.active),
    created_at: asString(input.createdAt) || new Date().toISOString().slice(0, 10),
    password_updated_at: asNullableString(input.passwordUpdatedAt),
    last_login_at: asNullableString(input.lastLoginAt),
    two_factor_enabled: Boolean(input.twoFactorEnabled),
    two_factor_secret: asNullableString(input.twoFactorSecret),
    two_factor_enabled_at: asNullableString(input.twoFactorEnabledAt),
    avatar_url: asNullableString(input.avatarUrl),
    job_title: asNullableString(input.jobTitle),
    city: asNullableString(input.city),
    bio: asNullableString(input.bio),
    notify_email: asBooleanOrNull(input.notifyEmail),
    notify_tasks: asBooleanOrNull(input.notifyTasks),
    notify_sms: asBooleanOrNull(input.notifySms),
  };

  if (includePassword) {
    const explicit = asString(input.password);
    const stored = asString(input.passwordHash);
    if (explicit) row.password_hash = hashPassword(explicit);
    else if (stored) row.password_hash = stored;
  }

  return row;
};

/** İstemciye dönen kayıt: şifre özeti ve 2FA gizli anahtarı asla gönderilmez. */
const toMember = (row: Record<string, unknown>) => ({
  id: asString(row.id),
  name: asString(row.name),
  email: asString(row.email),
  phone: asString(row.phone),
  roles: asRoles(row.roles),
  active: Boolean(row.active),
  createdAt: asString(row.created_at),
  passwordUpdatedAt: asNullableString(row.password_updated_at) ?? undefined,
  lastLoginAt: asNullableString(row.last_login_at) ?? undefined,
  twoFactorEnabled: Boolean(row.two_factor_enabled),
  twoFactorEnabledAt: asNullableString(row.two_factor_enabled_at) ?? undefined,
  avatarUrl: asNullableString(row.avatar_url) ?? undefined,
  jobTitle: asNullableString(row.job_title) ?? undefined,
  city: asNullableString(row.city) ?? undefined,
  bio: asNullableString(row.bio) ?? undefined,
  notifyEmail: row.notify_email === null ? undefined : Boolean(row.notify_email),
  notifyTasks: row.notify_tasks === null ? undefined : Boolean(row.notify_tasks),
  notifySms: row.notify_sms === null ? undefined : Boolean(row.notify_sms),
});

const SELECT_COLUMNS =
  "id,name,email,phone,roles,active,created_at,password_hash,password_updated_at,last_login_at,two_factor_enabled,two_factor_secret,two_factor_enabled_at,avatar_url,job_title,city,bio,notify_email,notify_tasks,notify_sms";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, code: "not_configured", message: "Sunucu yapılandırması eksik." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const action = String(payload.action ?? "");

  const readRoster = async () => {
    const { data, error } = await admin
      .from("admin_staff")
      .select(SELECT_COLUMNS)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Record<string, unknown>[];
  };

  const resolveSession = async (token: string) => {
    if (!token) return { error: "unauthorized" as const };
    // İki adımlı doğrulama bekleyen ara anahtarlar oturum olarak kabul edilmez.
    if (token.startsWith(PENDING_PREFIX)) return { error: "unauthorized" as const };
    const { data, error } = await admin
      .from("admin_sessions")
      .select("staff_id,expires_at")
      .eq("token", token)
      .maybeSingle();
    if (error) return { error: "db_error" as const };
    if (!data) return { error: "unauthorized" as const };
    if (new Date(String(data.expires_at)).getTime() < Date.now()) {
      await admin.from("admin_sessions").delete().eq("token", token);
      return { error: "expired" as const };
    }
    const { data: member, error: memberError } = await admin
      .from("admin_staff")
      .select(SELECT_COLUMNS)
      .eq("id", String(data.staff_id))
      .maybeSingle();
    if (memberError) return { error: "db_error" as const };
    if (!member) return { error: "unauthorized" as const };
    if (!member.active) return { error: "inactive" as const };
    return { member: member as Record<string, unknown> };
  };

  if (action === "bootstrap") {
    const { count, error: countError } = await admin
      .from("admin_staff")
      .select("id", { count: "exact", head: true });
    if (countError) {
      return json({ ok: false, code: "db_error", message: countError.message }, 500);
    }

    if ((count ?? 0) > 0) {
      return json({ ok: true, created: 0, existing: count ?? 0 });
    }

    const incoming = Array.isArray(payload.staff) ? (payload.staff as StaffPayload[]) : [];
    const rows = incoming
      .map((item) => toRow(item, true))
      .filter((row) => asString(row.id) && asString(row.email) && asString(row.password_hash));

    if (rows.length === 0) {
      rows.push(
        toRow(
          {
            id: "stf-owner",
            name: "Fırat Yönetici",
            email: "demo@brothersteknoloji.com",
            phone: "0532 000 00 01",
            roles: ["yonetici"],
            active: true,
            createdAt: new Date().toISOString().slice(0, 10),
            password: "Yonetici2026",
          },
          true,
        ),
      );
    }

    const { error } = await admin.from("admin_staff").insert(rows);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true, created: rows.length, existing: 0 });
  }

  if (action === "login") {
    const email = normalizeEmail(payload.email);
    const password = String(payload.password ?? "");
    const remember = payload.remember !== false;

    if (!email || !password) {
      return json({ ok: false, code: "missing", message: "E-posta ve şifre gerekli." }, 400);
    }

    const { data, error } = await admin
      .from("admin_staff")
      .select(SELECT_COLUMNS)
      .ilike("email", email)
      .maybeSingle();

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    if (!data) return json({ ok: false, code: "not-found" }, 401);
    if (!verifyPassword(String(data.password_hash ?? ""), password)) {
      return json({ ok: false, code: "wrong-password" }, 401);
    }
    if (!data.active) return json({ ok: false, code: "inactive" }, 403);

    const twoFactorSecret = String(data.two_factor_secret ?? "");
    if (data.two_factor_enabled && twoFactorSecret) {
      const challenge = `${PENDING_PREFIX}${randomToken()}`;
      const challengeExpiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const { error: challengeError } = await admin
        .from("admin_sessions")
        .insert({ token: challenge, staff_id: data.id, expires_at: challengeExpiry });
      if (challengeError) return json({ ok: false, code: "db_error", message: challengeError.message }, 500);
      return json({
        ok: true,
        twoFactorRequired: true,
        challenge,
        member: toMember(data),
      });
    }

    const storedHash = String(data.password_hash ?? "");
    if (storedHash && !storedHash.startsWith("v1$")) {
      const upgraded = hashPassword(password);
      await admin
        .from("admin_staff")
        .update({ password_hash: upgraded, password_updated_at: new Date().toISOString() })
        .eq("id", data.id);
      data.password_hash = upgraded;
      data.password_updated_at = new Date().toISOString();
    }

    const lastLoginAt = new Date().toISOString();
    await admin.from("admin_staff").update({ last_login_at: lastLoginAt }).eq("id", data.id);
    data.last_login_at = lastLoginAt;

    const token = randomToken();
    const expiresAt = new Date(Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();
    const { error: sessionError } = await admin
      .from("admin_sessions")
      .insert({ token, staff_id: data.id, expires_at: expiresAt });
    if (sessionError) return json({ ok: false, code: "db_error", message: sessionError.message }, 500);

    return json({ ok: true, token, expiresAt, member: toMember(data) });
  }

  if (action === "session") {
    const session = await resolveSession(String(payload.token ?? ""));
    if (!session.member) {
      const reason = session.error === "inactive" ? "inactive" : "unauthorized";
      return json({ ok: false, code: reason }, 401);
    }
    return json({ ok: true, member: toMember(session.member) });
  }

  if (action === "logout") {
    const token = String(payload.token ?? "");
    if (token) await admin.from("admin_sessions").delete().eq("token", token);
    return json({ ok: true });
  }

  if (action === "verifyTwoFactor") {
    const challenge = String(payload.challenge ?? "");
    const code = String(payload.otp ?? "");
    const remember = payload.remember !== false;

    if (!challenge.startsWith(PENDING_PREFIX) || !code) {
      return json({ ok: false, code: "invalid-code", message: "Doğrulama kodu geçersiz." }, 400);
    }

    const { data: pending, error: pendingError } = await admin
      .from("admin_sessions")
      .select("staff_id,expires_at")
      .eq("token", challenge)
      .maybeSingle();

    if (pendingError) return json({ ok: false, code: "db_error", message: pendingError.message }, 500);
    if (!pending) {
      return json(
        { ok: false, code: "invalid-code", message: "Doğrulama süresi doldu. Lütfen yeniden giriş yapın." },
        401,
      );
    }
    if (new Date(String(pending.expires_at)).getTime() < Date.now()) {
      await admin.from("admin_sessions").delete().eq("token", challenge);
      return json(
        { ok: false, code: "invalid-code", message: "Doğrulama süresi doldu. Lütfen yeniden giriş yapın." },
        401,
      );
    }

    const { data: staffRow, error: staffError } = await admin
      .from("admin_staff")
      .select(SELECT_COLUMNS)
      .eq("id", String(pending.staff_id))
      .maybeSingle();

    if (staffError) return json({ ok: false, code: "db_error", message: staffError.message }, 500);
    if (!staffRow) return json({ ok: false, code: "unauthorized" }, 401);
    if (!staffRow.active) return json({ ok: false, code: "inactive" }, 403);

    const valid = await verifyTotpCode(String(staffRow.two_factor_secret ?? ""), code);
    if (!valid) {
      return json(
        { ok: false, code: "invalid-code", message: "Kod geçersiz veya süresi dolmuş." },
        401,
      );
    }

    await admin.from("admin_sessions").delete().eq("token", challenge);

    const lastLoginAt = new Date().toISOString();
    await admin.from("admin_staff").update({ last_login_at: lastLoginAt }).eq("id", staffRow.id);
    staffRow.last_login_at = lastLoginAt;

    const token = randomToken();
    const expiresAt = new Date(Date.now() + (remember ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();
    const { error: sessionError } = await admin
      .from("admin_sessions")
      .insert({ token, staff_id: staffRow.id, expires_at: expiresAt });
    if (sessionError) return json({ ok: false, code: "db_error", message: sessionError.message }, 500);

    return json({ ok: true, token, expiresAt, member: toMember(staffRow) });
  }

  const session = await resolveSession(String(payload.token ?? ""));

  if (!session.member) {
    if (session.error === "db_error") {
      return json({ ok: false, code: "db_error" }, 500);
    }
    const reason = session.error === "inactive" ? "inactive" : "unauthorized";
    return json(
      {
        ok: false,
        code: reason,
        message:
          reason === "inactive"
            ? "Bu hesap pasife alınmış."
            : "Oturumunuz sona erdi. Lütfen yeniden giriş yapın.",
      },
      401,
    );
  }

  const current = session.member;

  if (action === "roster") {
    try {
      const rows = await readRoster();
      return json({ ok: true, staff: rows.map(toMember) });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Liste alınamadı.";
      return json({ ok: false, code: "db_error", message }, 500);
    }
  }

  if (action === "sync") {
    const incoming = Array.isArray(payload.staff) ? (payload.staff as StaffPayload[]) : null;
    if (!incoming) {
      return json({ ok: false, code: "invalid", message: "Gönderilen kayıt bulunamadı." }, 400);
    }

    const rows = incoming
      .map((item) => toRow(item, true))
      .filter((row) => asString(row.id) && asString(row.email) && asString(row.name));

    const activeOwners = rows.filter(
      (row) => Boolean(row.active) && asRoles(row.roles).includes("yonetici"),
    );
    if (activeOwners.length === 0) {
      return json(
        {
          ok: false,
          code: "last_owner",
          message: "En az bir aktif genel yönetici kalmalı. Bu değişiklik kaydedilemez.",
        },
        409,
      );
    }

    const emailSet = new Set(rows.map((row) => asString(row.email)));
    if (emailSet.size !== rows.length) {
      return json({ ok: false, code: "duplicate_email", message: "Aynı e-posta birden fazla kez kullanılmış." }, 409);
    }

    const { data: existingRows, error: existingError } = await admin.from("admin_staff").select("id");
    if (existingError) {
      return json({ ok: false, code: "db_error", message: existingError.message }, 500);
    }

    for (const row of rows) {
      // Şifre özeti boş geliyorsa mevcut şifre korunur.
      const cleanRow = { ...row };
      if (!cleanRow.password_hash) delete cleanRow.password_hash;

      const { error } = await admin.from("admin_staff").upsert(cleanRow, { onConflict: "id" });
      if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    }

    const keepIds = new Set(rows.map((row) => asString(row.id)));
    const removeIds = ((existingRows ?? []) as { id: string }[])
      .map((row) => String(row.id))
      .filter((id) => !keepIds.has(id));

    if (removeIds.length) {
      const { error } = await admin.from("admin_staff").delete().in("id", removeIds);
      if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
      await admin.from("admin_sessions").delete().in("staff_id", removeIds);
    }

    try {
      const fresh = await readRoster();
      return json({ ok: true, staff: fresh.map(toMember) });
    } catch {
      return json({ ok: true });
    }
  }

  if (action === "setPassword") {
    const staffId = String(payload.id ?? "");
    const password = String(payload.password ?? "");
    if (!staffId || password.length < 6) {
      return json({ ok: false, code: "invalid", message: "Şifre en az 6 karakter olmalı." }, 400);
    }
    const { error } = await admin
      .from("admin_staff")
      .update({ password_hash: hashPassword(password), password_updated_at: new Date().toISOString() })
      .eq("id", staffId);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    await admin.from("admin_sessions").delete().eq("staff_id", staffId);
    return json({ ok: true });
  }

  if (action === "changePassword") {
    const currentPassword = String(payload.currentPassword ?? "");
    const nextPassword = String(payload.newPassword ?? "");
    if (!verifyPassword(String(current.password_hash ?? ""), currentPassword)) {
      return json({ ok: false, code: "wrong-password", message: "Mevcut şifreniz hatalı." }, 401);
    }
    if (nextPassword.length < 6) {
      return json({ ok: false, code: "invalid", message: "Yeni şifre en az 6 karakter olmalı." }, 400);
    }
    if (verifyPassword(String(current.password_hash ?? ""), nextPassword)) {
      return json(
        { ok: false, code: "same-password", message: "Yeni şifre mevcut şifrenizle aynı olamaz." },
        400,
      );
    }
    const upgraded = hashPassword(nextPassword);
    const { error } = await admin
      .from("admin_staff")
      .update({ password_hash: upgraded, password_updated_at: new Date().toISOString() })
      .eq("id", current.id);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  if (action === "setProfile") {
    const staffId = String(payload.id ?? current.id);
    const patch = (payload.patch ?? {}) as Record<string, unknown>;
    const update: Record<string, unknown> = {};

    if (patch.name !== undefined) {
      const name = asString(patch.name).trim();
      if (!name) return json({ ok: false, code: "invalid", message: "Ad soyad boş olamaz." }, 400);
      update.name = name;
    }
    if (patch.phone !== undefined) update.phone = asString(patch.phone);
    if (patch.avatarUrl !== undefined) update.avatar_url = asNullableString(patch.avatarUrl);
    if (patch.jobTitle !== undefined) update.job_title = asNullableString(patch.jobTitle);
    if (patch.city !== undefined) update.city = asNullableString(patch.city);
    if (patch.bio !== undefined) update.bio = asNullableString(patch.bio);
    if (patch.notifyEmail !== undefined) update.notify_email = Boolean(patch.notifyEmail);
    if (patch.notifyTasks !== undefined) update.notify_tasks = Boolean(patch.notifyTasks);
    if (patch.notifySms !== undefined) update.notify_sms = Boolean(patch.notifySms);

    if (Object.keys(update).length === 0) return json({ ok: true });

    const { error } = await admin.from("admin_staff").update(update).eq("id", staffId);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  if (action === "setTwoFactor") {
    const staffId = String(payload.id ?? current.id);
    const secret = String(payload.secret ?? "");
    if (!secret) return json({ ok: false, code: "invalid", message: "Doğrulama anahtarı gerekli." }, 400);
    const { error } = await admin
      .from("admin_staff")
      .update({
        two_factor_enabled: true,
        two_factor_secret: secret,
        two_factor_enabled_at: new Date().toISOString(),
      })
      .eq("id", staffId);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  if (action === "clearTwoFactor") {
    const staffId = String(payload.id ?? current.id);
    const { error } = await admin
      .from("admin_staff")
      .update({ two_factor_enabled: false, two_factor_secret: null, two_factor_enabled_at: null })
      .eq("id", staffId);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  return json({ ok: false, code: "unknown_action", message: "Bilinmeyen işlem." }, 400);
});
