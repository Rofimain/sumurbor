import type { MetadataRoute } from "next";
import { getArticles, getProjects, getServices, getSettings } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

export interface SeoConfig {
  canonicalBase: string;
  sitemapEnabled: boolean;
  includeServices: boolean;
  includeProjects: boolean;
  includeArticles: boolean;
  sitemapExtraUrls: string[];
  homePriority: number;
  homeChangeFreq: MetadataRoute.Sitemap[0]["changeFrequency"];
  staticPagePriority: number;
  staticPageChangeFreq: MetadataRoute.Sitemap[0]["changeFrequency"];
  robotsDisallowExtra: string[];
  googleVerification: string;
  bingVerification: string;
  globalNoindex: boolean;
}

const STATIC_PATHS = ["", "tentang", "layanan", "proyek", "artikel", "kontak"];

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

function parseLines(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function parsePriority(value: string | undefined, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(1, Math.max(0, n));
}

export async function getSeoConfig(): Promise<SeoConfig> {
  const db = await getSettings().catch(() => ({} as Record<string, string>));
  const envBase = siteUrl();
  const canonicalBase = (db.canonical_url?.trim() || envBase).replace(/\/$/, "");

  return {
    canonicalBase,
    sitemapEnabled: parseBool(db.sitemap_enabled, true),
    includeServices: parseBool(db.sitemap_include_services, true),
    includeProjects: parseBool(db.sitemap_include_projects, true),
    includeArticles: parseBool(db.sitemap_include_articles, true),
    sitemapExtraUrls: parseLines(db.sitemap_extra_urls),
    homePriority: parsePriority(db.sitemap_priority_home, 1),
    homeChangeFreq:
      (db.sitemap_changefreq_home as SeoConfig["homeChangeFreq"]) || "weekly",
    staticPagePriority: parsePriority(db.sitemap_priority_static, 0.7),
    staticPageChangeFreq:
      (db.sitemap_changefreq_static as SeoConfig["staticPageChangeFreq"]) ||
      "monthly",
    robotsDisallowExtra: parseLines(db.robots_disallow_extra),
    googleVerification:
      db.google_site_verification ||
      process.env.GOOGLE_SITE_VERIFICATION ||
      "",
    bingVerification:
      db.bing_site_verification || process.env.BING_SITE_VERIFICATION || "",
    globalNoindex: parseBool(db.seo_global_noindex, false),
  };
}

export async function getCanonicalBase(): Promise<string> {
  const config = await getSeoConfig();
  return config.canonicalBase;
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const config = await getSeoConfig();
  if (!config.sitemapEnabled || !config.canonicalBase) return [];

  const base = config.canonicalBase;
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: p ? `${base}/${p}` : `${base}/`,
    lastModified: new Date(),
    changeFrequency: p === "" ? config.homeChangeFreq : config.staticPageChangeFreq,
    priority: p === "" ? config.homePriority : config.staticPagePriority,
  }));

  const [services, projects, articles] = await Promise.all([
    config.includeServices ? getServices() : Promise.resolve([]),
    config.includeProjects ? getProjects() : Promise.resolve([]),
    config.includeArticles
      ? getArticles({ published: true })
      : Promise.resolve([]),
  ]);

  for (const s of services) {
    entries.push({
      url: `${base}/layanan/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }
  for (const p of projects) {
    entries.push({
      url: `${base}/proyek/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }
  for (const a of articles) {
    entries.push({
      url: `${base}/artikel/${a.slug}`,
      lastModified: new Date(a.published_at || a.updated_at),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  for (const raw of config.sitemapExtraUrls) {
    const url = raw.startsWith("http") ? raw : `${base}/${raw.replace(/^\//, "")}`;
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}

export async function buildRobotsConfig(): Promise<MetadataRoute.Robots> {
  const config = await getSeoConfig();
  const base = config.canonicalBase;

  const disallow = ["/admin/", "/api/", "/_next/", ...config.robotsDisallowExtra];

  return {
    rules: config.globalNoindex
      ? [{ userAgent: "*", disallow: "/" }]
      : [
          {
            userAgent: "*",
            allow: "/",
            disallow,
          },
        ],
    sitemap: base ? `${base}/sitemap.xml` : undefined,
    host: base || undefined,
  };
}

/** Default keys for admin SEO form */
export const SEO_SETTING_KEYS = {
  canonical_url: "",
  sitemap_enabled: "true",
  sitemap_include_services: "true",
  sitemap_include_projects: "true",
  sitemap_include_articles: "true",
  sitemap_extra_urls: "",
  sitemap_priority_home: "1",
  sitemap_changefreq_home: "weekly",
  sitemap_priority_static: "0.7",
  sitemap_changefreq_static: "monthly",
  robots_disallow_extra: "",
  seo_global_noindex: "false",
  google_site_verification: "",
  bing_site_verification: "",
  analytics_enabled: "true",
  google_analytics_id: "",
  google_tag_manager_id: "",
} as const;
