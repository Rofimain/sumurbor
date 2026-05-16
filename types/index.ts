export type {
  ProjectRow,
  ServiceRow,
  ArticleRow,
  TeamRow,
  TestimonialRow,
  SettingRow,
} from "@/lib/supabase";

export interface MergedSettings {
  site_name?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  phone_display?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  business_hours?: string;
  founding_year?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  google_maps_url?: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
