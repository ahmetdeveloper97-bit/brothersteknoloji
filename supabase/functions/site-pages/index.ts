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

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const RESERVED_SLUGS = new Set([
  "arteadmin",
  "admin",
  "api",
  "auth",
  "giris",
  "hesabim",
  "odeme",
  "odeme-sonuc",
  "favoriler",
  "kargo-takip",
  "kategoriler",
  "urunler",
  "pc-toplama",
  "sayfa",
  "sepet",
  "gizlilik-politikasi",
  "cerez-politikasi",
]);

const asText = (value: unknown, max: number): string => String(value ?? "").trim().slice(0, max);

const normalizeSections = (raw: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw
    .slice(0, 40)
    .map((item, index) => {
      const source = (item ?? {}) as Record<string, unknown>;
      const bullets = Array.isArray(source.bullets)
        ? source.bullets.map((entry) => asText(entry, 300)).filter((entry) => entry.length > 0).slice(0, 12)
        : [];
      let id = asText(source.id, 60) || `blok-${index + 1}`;
      if (seen.has(id)) id = `${id}-${index + 1}`;
      seen.add(id);
      return {
        id,
        heading: asText(source.heading, 160),
        body: asText(source.body, 6000),
        image: asText(source.image, 600),
        bullets,
      };
    })
    .filter((section) => section.heading || section.body || section.image || section.bullets.length > 0);
};

const normalizePage = (raw: Record<string, unknown>) => {
  const orderRaw = Number(raw.sortOrder ?? raw.sort_order ?? 0);
  return {
    slug: asText(raw.slug, 80).toLowerCase(),
    title: asText(raw.title, 140),
    subtitle: asText(raw.subtitle, 320),
    cover_image: asText(raw.coverImage ?? raw.cover_image, 600),
    sections: normalizeSections(raw.sections),
    seo_title: asText(raw.seoTitle ?? raw.seo_title, 160),
    seo_description: asText(raw.seoDescription ?? raw.seo_description, 320),
    status: raw.status === "published" ? "published" : "draft",
    show_in_footer: Boolean(raw.showInFooter ?? raw.show_in_footer),
    sort_order: Number.isFinite(orderRaw) ? Math.trunc(orderRaw) : 0,
    updated_at: new Date().toISOString(),
  };
};

const toClient = (row: Record<string, unknown>) => {
  const sections = Array.isArray(row.sections) ? row.sections : [];
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    subtitle: String(row.subtitle ?? ""),
    coverImage: String(row.cover_image ?? ""),
    sections: sections.map((item) => {
      const section = (item ?? {}) as Record<string, unknown>;
      return {
        id: String(section.id ?? ""),
        heading: String(section.heading ?? ""),
        body: String(section.body ?? ""),
        image: String(section.image ?? ""),
        bullets: Array.isArray(section.bullets) ? section.bullets.map((entry) => String(entry)) : [],
      };
    }),
    seoTitle: String(row.seo_title ?? ""),
    seoDescription: String(row.seo_description ?? ""),
    status: row.status === "published" ? "published" : "draft",
    showInFooter: Boolean(row.show_in_footer),
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
};

const verifyAdminSession = async (
  admin: ReturnType<typeof createClient>,
  token: string,
): Promise<boolean> => {
  if (!token) return false;
  const { data, error } = await admin
    .from("admin_sessions")
    .select("staff_id,expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return false;
  if (new Date(String(data.expires_at)).getTime() < Date.now()) return false;

  const { data: member, error: memberError } = await admin
    .from("admin_staff")
    .select("id,active")
    .eq("id", String(data.staff_id))
    .maybeSingle();
  if (memberError || !member) return false;
  return Boolean(member.active);
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

  const action = String(payload.action ?? "public_list");

  if (action === "public_list") {
    const { data, error } = await admin
      .from("site_pages")
      .select("slug,title,subtitle,cover_image,show_in_footer,sections,updated_at")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);

    return json({
      ok: true,
      pages: (data ?? []).map((row) => {
        const page = toClient({ ...row, status: "published" });
        return {
          slug: page.slug,
          title: page.title,
          subtitle: page.subtitle,
          coverImage: page.coverImage,
          showInFooter: page.showInFooter,
          sectionCount: page.sections.length,
          updatedAt: page.updatedAt,
        };
      }),
    });
  }

  if (action === "public_get") {
    const slug = asText(payload.slug, 80).toLowerCase();
    if (!slug) return json({ ok: false, code: "invalid_slug", message: "Sayfa adresi eksik." }, 400);

    const { data, error } = await admin
      .from("site_pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    if (!data) return json({ ok: false, code: "not_found", message: "Sayfa bulunamadı." }, 404);
    return json({ ok: true, page: toClient(data) });
  }

  const token = asText(payload.token, 200);
  const authorized = await verifyAdminSession(admin, token);
  if (!authorized) {
    return json(
      {
        ok: false,
        code: "unauthorized",
        message: "Oturumunuz sona erdi. Lütfen panele yeniden giriş yapıp tekrar deneyin.",
      },
      401,
    );
  }

  if (action === "admin_list") {
    const { data, error } = await admin
      .from("site_pages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });

    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true, pages: (data ?? []).map(toClient) });
  }

  if (action === "admin_save") {
    const page = normalizePage(payload);

    if (page.title.length < 2) {
      return json({ ok: false, code: "invalid_title", message: "Sayfa başlığı en az 2 karakter olmalı." }, 400);
    }
    if (!SLUG_RE.test(page.slug) || page.slug.length < 2) {
      return json(
        {
          ok: false,
          code: "invalid_slug",
          message: "Sayfa adresi yalnızca küçük harf, rakam ve tire içerebilir (örn. hakkimizda).",
        },
        400,
      );
    }
    if (RESERVED_SLUGS.has(page.slug)) {
      return json(
        { ok: false, code: "reserved_slug", message: "Bu adres mağaza tarafından kullanılıyor. Farklı bir adres seçin." },
        400,
      );
    }
    if (page.sections.length === 0 && page.subtitle.length === 0) {
      return json(
        { ok: false, code: "empty_content", message: "Sayfaya en az bir içerik bloğu veya kısa açıklama ekleyin." },
        400,
      );
    }

    const id = asText(payload.id, 60);

    if (id) {
      const { data, error } = await admin
        .from("site_pages")
        .update(page)
        .eq("id", id)
        .select("*")
        .maybeSingle();

      if (error) {
        if (error.code === "23505") {
          return json({ ok: false, code: "duplicate_slug", message: "Bu sayfa adresi zaten kullanılıyor." }, 409);
        }
        return json({ ok: false, code: "db_error", message: error.message }, 500);
      }
      if (!data) return json({ ok: false, code: "not_found", message: "Sayfa bulunamadı." }, 404);
      return json({ ok: true, page: toClient(data) });
    }

    const { data, error } = await admin.from("site_pages").insert(page).select("*").maybeSingle();
    if (error) {
      if (error.code === "23505") {
        return json({ ok: false, code: "duplicate_slug", message: "Bu sayfa adresi zaten kullanılıyor." }, 409);
      }
      return json({ ok: false, code: "db_error", message: error.message }, 500);
    }
    return json({ ok: true, page: toClient(data ?? {}) });
  }

  if (action === "admin_delete") {
    const id = asText(payload.id, 60);
    if (!id) return json({ ok: false, code: "invalid_id", message: "Silinecek sayfa bulunamadı." }, 400);

    const { error } = await admin.from("site_pages").delete().eq("id", id);
    if (error) return json({ ok: false, code: "db_error", message: error.message }, 500);
    return json({ ok: true });
  }

  return json({ ok: false, code: "unknown_action", message: "Bilinmeyen işlem." }, 400);
});
