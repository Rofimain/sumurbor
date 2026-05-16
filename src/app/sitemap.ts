import type { MetadataRoute } from "next";
import {
  getArticles,
  getProjects,
  getServices,
  getSiteSettings,
} from "@/lib/content";

export const dynamic = "force-static";

const staticPaths = ["", "tentang", "layanan", "proyek", "artikel", "kontak"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = getSiteSettings();
  const base = settings.siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const p of staticPaths) {
    entries.push({
      url: p ? `${base}/${p}` : `${base}/`,
      lastModified: new Date(),
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.7,
    });
  }

  const services = await getServices();
  for (const s of services) {
    entries.push({
      url: `${base}/layanan/${s.frontmatter.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  const articles = await getArticles();
  for (const a of articles) {
    entries.push({
      url: `${base}/artikel/${a.frontmatter.slug}`,
      lastModified: new Date(a.frontmatter.date),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  const projects = await getProjects();
  for (const p of projects) {
    entries.push({
      url: `${base}/proyek/${p.frontmatter.slug}`,
      lastModified: new Date(`${p.frontmatter.year}-01-01`),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
