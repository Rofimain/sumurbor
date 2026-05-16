import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "sumurbor-web" } },
  });
}

export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return null;
  return createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Row types ─────────────────────────────────────────
export interface ProjectRow {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  location: string;
  depth: string;
  diameter: string;
  piles: number | null;
  duration: string;
  year: number;
  status: "completed" | "ongoing" | "upcoming";
  client: string;
  description: string;
  full_description: string;
  cover_image: string | null;
  images: string[];
  tags: string[];
  featured: boolean;
}

export interface ServiceRow {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  full_description: string;
  icon: string;
  cover_image: string | null;
  features: string[];
  process: { step: number; title: string; description: string }[];
  faq: { q: string; a: string }[];
  featured: boolean;
  order: number;
}

export interface ArticleRow {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  author_image: string | null;
  category: string;
  tags: string[];
  cover_image: string | null;
  published_at: string;
  featured: boolean;
  read_time: number;
  published: boolean;
}

export interface TeamRow {
  id: string;
  created_at: string;
  name: string;
  role: string;
  bio: string;
  image: string | null;
  order: number;
  linkedin: string | null;
  instagram: string | null;
  whatsapp: string | null;
}

export interface TestimonialRow {
  id: string;
  created_at: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string | null;
  project_id: string | null;
  featured: boolean;
}

export interface SettingRow {
  id: string;
  updated_at: string;
  key: string;
  value: string;
}
