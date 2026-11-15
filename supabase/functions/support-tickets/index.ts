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

const BUCKET = "ticket-attachments";
const MAX_FILES = 3;
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const SIGNED_URL_TTL = 60 * 60 * 6;

const STATUSES = new Set(["open", "answered", "customer_reply", "closed"]);
const PRIORITIES = new Set(["low", "normal", "high", "urgent"]);
const CATEGORIES = new Set(["siparis", "kargo", "urun", "odeme", "iade", "teknik", "genel"]);
const TICKET_ROLES = new Set(["yonetici", "ticket-sorumlusu", "teknik-destek", "satis-sonrasi-destek"]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const asText = (value: unknown, max: number): string => String(value ?? "").trim().slice(0, max);
const asEmail = (value: unknown): string => asText(value, 160).toLowerCase();

interface StoredAttachment {
  name: string;
  path: string;
  size: number;
  type: string;
}

interface ClientAttachment {
  name: string;
  size: number;
  type: string;
  url: string;
}

let bucketReady = false;

const ensureBucket = async (admin: ReturnType<typeof createClient>): Promise<void> => {
  if (bucketReady) return;
  try {
    const { data } = await admin.storage.getBucket(BUCKET);
    if (data) {
      bucketReady = true;
      return;
    }
  } catch {
    /* kova yok, oluşturulacak */
  }
  try {
    await admin.storage.createBucket(BUCKET, { public: false });
  } catch {
    /* zaten varsa ya da yetki yoksa devam */
  }
  bucketReady = true;
};

const safeName = (value: string): string => {
  const clean = value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return clean.slice(-60) || "dosya";
};

const decodeBase64 = (value: string): Uint8Array | null => {
  try {
    const raw = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
    const binary = atob(raw);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  } catch {
    return null;
  }
};

const uploadAttachments = async (
  admin: ReturnType<typeof createClient>,
  rawList: unknown,
  ticketNo: string,
  messageKey: string,
): Promise<{ ok: boolean; message?: string; list: StoredAttachment[] }> => {
  if (!Array.isArray(rawList) || rawList.length === 0) return { ok: true, list: [] };
  if (rawList.length > MAX_FILES) {
    return { ok: false, message: `En fazla ${MAX_FILES} dosya ekleyebilirsiniz.`, list: [] };
  }

  await ensureBucket(admin);
  const list: StoredAttachment[] = [];

  for (let index = 0; index < rawList.length; index += 1) {
    const item = (rawList[index] ?? {}) as Record<string, unknown>;
    const name = asText(item.name, 160) || `dosya-${index + 1}`;
    const type = asText(item.type, 100) || "application/octet-stream";
    const encoded = typeof item.dataBase64 === "string" ? item.dataBase64 : "";
    if (!encoded) continue;

    const bytes = decodeBase64(encoded);
    if (!bytes) return { ok: false, message: "Dosya okunamadı. Lütfen tekrar deneyin.", list: [] };
    if (bytes.byteLength > MAX_FILE_BYTES) {
      return { ok: false, message: "Her dosya en fazla 3 MB olabilir.", list: [] };
    }

    const path = `${ticketNo}/${messageKey}/${index + 1}-${safeName(name)}`;
    const { error } = await admin.storage.from(BUCKET).upload(path, bytes, { contentType: type, upsert: true });
    if (error) {
      return { ok: false, message: "Dosya yüklenemedi. Lütfen tekrar deneyin.", list: [] };
    }
    list.push({ name, path, size: bytes.byteLength, type });
  }

  return { ok: true, list };
};

const signAttachments = async (
  admin: ReturnType<typeof createClient>,
  rawList: unknown,
): Promise<ClientAttachment[]> => {
  if (!Array.isArray(rawList) || rawList.length === 0) return [];
  const signed = await Promise.all(
    rawList.map(async (entry) => {
      const item = (entry ?? {}) as Partial<StoredAttachment>;
      let url = "";
      if (item.path) {
        try {
          const { data } = await admin.storage.from(BUCKET).createSignedUrl(String(item.path), SIGNED_URL_TTL);
          url = data?.signedUrl ?? "";
        } catch {
          url = "";
        }
      }
      return {
        name: String(item.name ?? "dosya"),
        size: Number(item.size ?? 0),
        type: String(item.type ?? ""),
        url,
      };
    }),
  );
  return signed;
};

const mapMessage = async (
  admin: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
) => ({
  id: String(row.id ?? ""),
  sender: String(row.sender ?? "customer"),
  authorName: String(row.author_name ?? ""),
  body: String(row.body ?? ""),
  attachments: await signAttachments(admin, row.attachments),
  createdAt: String(row.created_at ?? ""),
});

const mapTicket = async (
  admin: ReturnType<typeof createClient>,
  row: Record<string, unknown>,
  includeAttachments = true,
) => ({
  id: String(row.id ?? ""),
  ticketNo: String(row.ticket_no ?? ""),
  name: String(row.name ?? ""),
  email: String(row.email ?? ""),
  phone: String(row.phone ?? ""),
  subject: String(row.subject ?? ""),
  category: String(row.category ?? "genel"),
  message: String(row.message ?? ""),
  orderNo: String(row.order_no ?? ""),
  status: String(row.status ?? "open"),
  priority: String(row.priority ?? "normal"),
  assignedName: String(row.assigned_name ?? ""),
  attachments: includeAttachments ? await signAttachments(admin, row.attachments) : [],
  lastMessageAt: String(row.last_message_at ?? row.created_at ?? ""),
  closedAt: row.closed_at ? String(row.closed_at) : "",
  createdAt: String(row.created_at ?? ""),
  updatedAt: String(row.updated_at ?? ""),
});

const buildTicketNo = (): string => {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(
    now.getUTCDate(),
  ).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TK-${stamp}-${random}`;
};

const verifyAdmin = async (
  admin: ReturnType<typeof createClient>,
  token: string,
): Promise<{ id: string; name: string; email: string; roles: string[] } | null> => {
  if (!token) return null;
  const { data, error } = await admin
    .from("admin_sessions")
    .select("staff_id,expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  if (new Date(String(data.expires_at)).getTime() < Date.now()) return null;

  const { data: member, error: memberError } = await admin
    .from("admin_staff")
    .select("id,name,email,roles,active")
    .eq("id", String(data.staff_id))
    .maybeSingle();
  if (memberError || !member || !member.active) return null;

  const roles = Array.isArray(member.roles) ? member.roles.map((role: unknown) => String(role)) : [];
  return {
    id: String(member.id),
    name: String(member.name ?? ""),
    email: String(member.email ?? ""),
    roles,
  };
};

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

  const action = String(payload.action ?? "public_create");

  if (action === "public_create") {
    const name = asText(payload.name, 120);
    const email = asEmail(payload.email);
    const phone = asText(payload.phone, 40);
    const subject = asText(payload.subject, 160);
    const message = asText(payload.message, 5000);
    const orderNo = asText(payload.orderNo, 60);
    const categoryRaw = asText(payload.category, 40).toLowerCase();
    const category = CATEGORIES.has(categoryRaw) ? categoryRaw : "genel";
    const attachments = payload.attachments;

    if (name.length < 2) {
      return json({ ok: false, code: "invalid_name", message: "Lütfen adınızı ve soyadınızı yazın." }, 400);
    }
    if (!EMAIL_RE.test(email)) {
      return json({ ok: false, code: "invalid_email", message: "Geçerli bir e-posta adresi girin." }, 400);
    }
    if (subject.length < 3) {
      return json({ ok: false, code: "invalid_subject", message: "Konu en az 3 karakter olmalı." }, 400);
    }
    if (message.length < 10) {
      return json({ ok: false, code: "invalid_message", message: "Talebinizi en az 10 karakterle anlatın." }, 400);
    }

    let ticketNo = buildTicketNo();
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const { data: existing } = await admin
        .from("support_tickets")
        .select("id")
        .eq("ticket_no", ticketNo)
        .maybeSingle();
      if (!existing) break;
      ticketNo = buildTicketNo();
    }

    const uploaded = await uploadAttachments(admin, attachments, ticketNo, "talep");
    if (!uploaded.ok) {
      return json({ ok: false, code: "upload_failed", message: uploaded.message ?? "Dosya yüklenemedi." }, 400);
    }

    const now = new Date().toISOString();
    const { data: ticket, error } = await admin
      .from("support_tickets")
      .insert({
        ticket_no: ticketNo,
        name,
        email,
        phone,
        subject,
        category,
        message,
        order_no: orderNo,
        status: "open",
        priority: "normal",
        attachments: uploaded.list,
        last_message_at: now,
        updated_at: now,
      })
      .select("id,ticket_no")
      .maybeSingle();

    if (error || !ticket) {
      return json({ ok: false, code: "db_error", message: error?.message ?? "Talep oluşturulamadı." }, 500);
    }

    await admin.from("support_ticket_messages").insert({
      ticket_id: String(ticket.id),
      sender: "customer",
      author_name: name,
      author_email: email,
      body: message,
      attachments: uploaded.list,
    });

    return json({ ok: true, ticketNo: String(ticket.ticket_no), id: String(ticket.id) });
  }

  if (action === "public_track" || action === "public_reply") {
    const ticketNo = asText(payload.ticketNo, 40).toUpperCase();
    const email = asEmail(payload.email);
    if (!ticketNo || !EMAIL_RE.test(email)) {
      return json(
        { ok: false, code: "invalid_input", message: "Talep numarası ve e-posta adresi gerekiyor." },
        400,
      );
    }

    const { data: ticket, error } = await admin
      .from("support_tickets")
      .select("*")
      .eq("ticket_no", ticketNo)
      .maybeSingle();

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    if (!ticket || String(ticket.email ?? "").toLowerCase() !== email) {
      return json(
        { ok: false, code: "not_found", message: "Bu numara ve e-posta ile eşleşen bir talep bulunamadı." },
        404,
      );
    }

    if (action === "public_reply") {
      const body = asText(payload.body, 5000);
      if (body.length < 2) {
        return json({ ok: false, code: "invalid_message", message: "Lütfen mesajınızı yazın." }, 400);
      }
      if (String(ticket.status) === "closed") {
        return json(
          { ok: false, code: "ticket_closed", message: "Bu talep kapatılmış. Yeni bir talep oluşturabilirsiniz." },
          400,
        );
      }

      const uploaded = await uploadAttachments(
        admin,
        payload.attachments,
        String(ticket.ticket_no),
        `musteri-${Date.now()}`,
      );
      if (!uploaded.ok) {
        return json({ ok: false, code: "upload_failed", message: uploaded.message ?? "Dosya yüklenemedi." }, 400);
      }

      const now = new Date().toISOString();
      await admin.from("support_ticket_messages").insert({
        ticket_id: String(ticket.id),
        sender: "customer",
        author_name: String(ticket.name ?? ""),
        author_email: String(ticket.email ?? ""),
        body,
        attachments: uploaded.list,
      });
      await admin
        .from("support_tickets")
        .update({ status: "customer_reply", last_message_at: now, updated_at: now })
        .eq("id", String(ticket.id));
    }

    const { data: refreshed } = await admin
      .from("support_tickets")
      .select("*")
      .eq("id", String(ticket.id))
      .maybeSingle();

    const { data: messages } = await admin
      .from("support_ticket_messages")
      .select("*")
      .eq("ticket_id", String(ticket.id))
      .order("created_at", { ascending: true });

    const mapped = await mapTicket(admin, refreshed ?? ticket);
    const mappedMessages = await Promise.all((messages ?? []).map((row) => mapMessage(admin, row)));

    return json({ ok: true, ticket: { ...mapped, messages: mappedMessages } });
  }

  const token = asText(payload.token, 300);
  const member = await verifyAdmin(admin, token);
  if (!member) {
    return json(
      {
        ok: false,
        code: "unauthorized",
        message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapıp tekrar deneyin.",
      },
      401,
    );
  }
  if (!member.roles.some((role) => TICKET_ROLES.has(role))) {
    return json(
      { ok: false, code: "forbidden", message: "Destek taleplerini görüntüleme yetkiniz bulunmuyor." },
      403,
    );
  }

  if (action === "admin_list") {
    const status = asText(payload.status, 20);
    const search = asText(payload.search, 120);

    let query = admin
      .from("support_tickets")
      .select("id,ticket_no,name,email,phone,subject,category,status,priority,assigned_name,last_message_at,created_at,order_no")
      .order("last_message_at", { ascending: false })
      .limit(300);

    if (STATUSES.has(status)) query = query.eq("status", status);
    if (search) {
      const term = `%${search.replace(/[%_]/g, "")}%`;
      query = query.or(`ticket_no.ilike.${term},name.ilike.${term},email.ilike.${term},subject.ilike.${term}`);
    }

    const { data, error } = await query;
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);

    const { data: counters } = await admin.from("support_tickets").select("status");
    const counts = { all: 0, open: 0, answered: 0, customer_reply: 0, closed: 0 };
    (counters ?? []).forEach((row) => {
      counts.all += 1;
      const key = String(row.status ?? "open") as keyof typeof counts;
      if (key in counts && key !== "all") counts[key] += 1;
    });

    return json({
      ok: true,
      counts,
      tickets: (data ?? []).map((row) => ({
        id: String(row.id ?? ""),
        ticketNo: String(row.ticket_no ?? ""),
        name: String(row.name ?? ""),
        email: String(row.email ?? ""),
        phone: String(row.phone ?? ""),
        subject: String(row.subject ?? ""),
        category: String(row.category ?? "genel"),
        status: String(row.status ?? "open"),
        priority: String(row.priority ?? "normal"),
        assignedName: String(row.assigned_name ?? ""),
        orderNo: String(row.order_no ?? ""),
        lastMessageAt: String(row.last_message_at ?? row.created_at ?? ""),
        createdAt: String(row.created_at ?? ""),
      })),
    });
  }

  if (action === "admin_get") {
    const id = asText(payload.id, 60);
    if (!id) return json({ ok: false, code: "invalid_id", message: "Talep bulunamadı." }, 400);

    const { data: ticket, error } = await admin.from("support_tickets").select("*").eq("id", id).maybeSingle();
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    if (!ticket) return json({ ok: false, code: "not_found", message: "Talep bulunamadı." }, 404);

    const { data: messages } = await admin
      .from("support_ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    const mapped = await mapTicket(admin, ticket);
    const mappedMessages = await Promise.all((messages ?? []).map((row) => mapMessage(admin, row)));
    return json({ ok: true, ticket: { ...mapped, messages: mappedMessages } });
  }

  if (action === "admin_reply") {
    const id = asText(payload.id, 60);
    const body = asText(payload.body, 5000);
    if (!id) return json({ ok: false, code: "invalid_id", message: "Talep bulunamadı." }, 400);
    if (body.length < 2) {
      return json({ ok: false, code: "invalid_message", message: "Lütfen yanıtınızı yazın." }, 400);
    }

    const { data: ticket, error } = await admin
      .from("support_tickets")
      .select("id,ticket_no,status,assigned_to,assigned_name")
      .eq("id", id)
      .maybeSingle();
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    if (!ticket) return json({ ok: false, code: "not_found", message: "Talep bulunamadı." }, 404);

    const uploaded = await uploadAttachments(
      admin,
      payload.attachments,
      String(ticket.ticket_no),
      `yanit-${Date.now()}`,
    );
    if (!uploaded.ok) {
      return json({ ok: false, code: "upload_failed", message: uploaded.message ?? "Dosya yüklenemedi." }, 400);
    }

    const now = new Date().toISOString();
    const { error: insertError } = await admin.from("support_ticket_messages").insert({
      ticket_id: id,
      sender: "staff",
      author_name: member.name,
      author_email: member.email,
      body,
      attachments: uploaded.list,
    });
    if (insertError) return json({ ok: false, code: "db_error", message: insertError.message }, 500);

    const patch: Record<string, unknown> = {
      status: "answered",
      last_message_at: now,
      updated_at: now,
      closed_at: null,
    };
    if (!ticket.assigned_to) {
      patch.assigned_to = member.id;
      patch.assigned_name = member.name;
    }

    await admin.from("support_tickets").update(patch).eq("id", id);

    return json({ ok: true });
  }

  if (action === "admin_update") {
    const id = asText(payload.id, 60);
    if (!id) return json({ ok: false, code: "invalid_id", message: "Talep bulunamadı." }, 400);

    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const status = asText(payload.status, 20);
    const priority = asText(payload.priority, 20);

    if (status) {
      if (!STATUSES.has(status)) {
        return json({ ok: false, code: "invalid_status", message: "Geçersiz durum." }, 400);
      }
      patch.status = status;
      patch.closed_at = status === "closed" ? new Date().toISOString() : null;
    }
    if (priority) {
      if (!PRIORITIES.has(priority)) {
        return json({ ok: false, code: "invalid_priority", message: "Geçersiz öncelik." }, 400);
      }
      patch.priority = priority;
    }
    if (payload.claim === true) {
      patch.assigned_to = member.id;
      patch.assigned_name = member.name;
    }
    if (payload.release === true) {
      patch.assigned_to = null;
      patch.assigned_name = null;
    }

    const { error } = await admin.from("support_tickets").update(patch).eq("id", id);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  return json({ ok: false, code: "unknown_action", message: "Bilinmeyen işlem." }, 400);
});
