import {
  getSupabaseClient,
  getSupabaseAdminClient,
  type ProjectRow,
  type ServiceRow,
  type ArticleRow,
  type TeamRow,
  type TestimonialRow,
} from "./supabase";

function isConfigured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ── PROJECTS ─────────────────────────────────────────────
export async function getProjects(opts?: {
  featured?: boolean;
  status?: string;
  limit?: number;
}): Promise<ProjectRow[]> {
  if (!isConfigured()) return [];
  const db = getSupabaseClient();
  if (!db) return [];
  let q = db
    .from("projects")
    .select("*")
    .order("year", { ascending: false });
  if (opts?.featured) q = q.eq("featured", true);
  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error("getProjects:", error.message);
    return [];
  }
  return (data ?? []) as ProjectRow[];
}

export async function getProject(slug: string): Promise<ProjectRow | null> {
  if (!isConfigured()) return null;
  const db = getSupabaseClient();
  if (!db) return null;
  const { data, error } = await db
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as ProjectRow;
}

export async function upsertProject(
  payload: Record<string, unknown>,
): Promise<ProjectRow> {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const body = { ...payload, updated_at: new Date().toISOString() };
  if (payload.id) {
    const { data, error } = await admin
      .from("projects")
      .update(body)
      .eq("id", payload.id as string)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ProjectRow;
  }
  const { data, error } = await admin
    .from("projects")
    .insert(body)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ProjectRow;
}

export async function deleteProject(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const { error } = await admin.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── SERVICES ─────────────────────────────────────────────
export async function getServices(): Promise<ServiceRow[]> {
  if (!isConfigured()) return [];
  const db = getSupabaseClient();
  if (!db) return [];
  const { data, error } = await db
    .from("services")
    .select("*")
    .order("order", { ascending: true });
  if (error) {
    console.error("getServices:", error.message);
    return [];
  }
  return (data ?? []) as ServiceRow[];
}

export async function getService(slug: string): Promise<ServiceRow | null> {
  if (!isConfigured()) return null;
  const db = getSupabaseClient();
  if (!db) return null;
  const { data, error } = await db
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as ServiceRow;
}

export async function upsertService(
  payload: Record<string, unknown>,
): Promise<ServiceRow> {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const body = { ...payload, updated_at: new Date().toISOString() };
  if (payload.id) {
    const { data, error } = await admin
      .from("services")
      .update(body)
      .eq("id", payload.id as string)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ServiceRow;
  }
  const { data, error } = await admin
    .from("services")
    .insert(body)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ServiceRow;
}

export async function deleteService(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const { error } = await admin.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── ARTICLES (blog_posts table) ──────────────────────────
export async function getArticles(opts?: {
  featured?: boolean;
  published?: boolean;
  limit?: number;
}): Promise<ArticleRow[]> {
  if (!isConfigured()) return [];
  const db = getSupabaseClient();
  if (!db) return [];
  let q = db
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });
  if (opts?.featured !== undefined) q = q.eq("featured", opts.featured);
  if (opts?.published !== undefined) q = q.eq("published", opts.published);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error("getArticles:", error.message);
    return [];
  }
  return (data ?? []) as ArticleRow[];
}

export async function getArticle(slug: string): Promise<ArticleRow | null> {
  if (!isConfigured()) return null;
  const db = getSupabaseClient();
  if (!db) return null;
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data as ArticleRow;
}

export async function upsertArticle(
  payload: Record<string, unknown>,
): Promise<ArticleRow> {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const body = { ...payload, updated_at: new Date().toISOString() };
  if (payload.id) {
    const { data, error } = await admin
      .from("articles")
      .update(body)
      .eq("id", payload.id as string)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as ArticleRow;
  }
  const { data, error } = await admin
    .from("articles")
    .insert(body)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as ArticleRow;
}

export async function deleteArticle(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const { error } = await admin.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── TEAM ─────────────────────────────────────────────────
export async function getTeam(): Promise<TeamRow[]> {
  if (!isConfigured()) return [];
  const db = getSupabaseClient();
  if (!db) return [];
  const { data, error } = await db
    .from("team")
    .select("*")
    .order("order", { ascending: true });
  if (error) {
    console.error("getTeam:", error.message);
    return [];
  }
  return (data ?? []) as TeamRow[];
}

export async function upsertTeamMember(
  payload: Record<string, unknown>,
): Promise<TeamRow> {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  if (payload.id) {
    const { data, error } = await admin
      .from("team")
      .update(payload)
      .eq("id", payload.id as string)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as TeamRow;
  }
  const { data, error } = await admin
    .from("team")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as TeamRow;
}

export async function deleteTeamMember(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const { error } = await admin.from("team").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── TESTIMONIALS ─────────────────────────────────────────
export async function getTestimonials(opts?: {
  featured?: boolean;
}): Promise<TestimonialRow[]> {
  if (!isConfigured()) return [];
  const db = getSupabaseClient();
  if (!db) return [];
  let q = db
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  if (opts?.featured !== undefined) q = q.eq("featured", opts.featured);
  const { data, error } = await q;
  if (error) {
    console.error("getTestimonials:", error.message);
    return [];
  }
  return (data ?? []) as TestimonialRow[];
}

export async function upsertTestimonial(
  payload: Record<string, unknown>,
): Promise<TestimonialRow> {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  if (payload.id) {
    const { data, error } = await admin
      .from("testimonials")
      .update(payload)
      .eq("id", payload.id as string)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as TestimonialRow;
  }
  const { data, error } = await admin
    .from("testimonials")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as TestimonialRow;
}

export async function deleteTestimonial(id: string) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const { error } = await admin.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── SETTINGS ─────────────────────────────────────────────
export async function getSettings(): Promise<Record<string, string>> {
  if (!isConfigured()) return {};
  const db = getSupabaseClient();
  if (!db) return {};
  const { data, error } = await db.from("settings").select("*");
  if (error) {
    console.error("getSettings:", error.message);
    return {};
  }
  return Object.fromEntries(
    (data ?? []).map((s: { key: string; value: string }) => [s.key, s.value]),
  );
}

export async function updateSettings(settings: Record<string, string>) {
  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase admin not configured");
  const rows = Object.entries(settings).map(([key, value]) => ({
    key,
    value: value ?? "",
    updated_at: new Date().toISOString(),
  }));
  const { error } = await admin
    .from("settings")
    .upsert(rows, { onConflict: "key" });
  if (error) throw new Error(error.message);
}
