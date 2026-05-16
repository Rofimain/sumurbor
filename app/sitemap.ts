import type { MetadataRoute } from "next";
import { getArticles, getProjects, getServices } from "@/lib/db";
import { siteUrl } from "@/lib/seo";

const STATIC_PATHS = ["", "tentang", "layanan", "proyek", "artikel", "kontak"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  if (!base) return [];

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: p ? `${base}/${p}` : `${base}/`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));

  const [services, projects, articles] = await Promise.all([
    getServices(),
    getProjects(),
    getArticles({ published: true }),
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
      lastModified: new Date(a.published_at),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
