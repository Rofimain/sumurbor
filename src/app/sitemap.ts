import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
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

  for (const lang of locales) {
    for (const p of staticPaths) {
      const url = p ? `${base}/${lang}/${p}` : `${base}/${lang}`;
      const alternates: Record<string, string> = {};
      for (const l of locales) {
        alternates[l] = p ? `${base}/${l}/${p}` : `${base}/${l}`;
      }
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1 : 0.7,
        alternates: { languages: alternates },
      });
    }

    const services = await getServices(lang);
    for (const s of services) {
      const alternates: Record<string, string> = {};
      for (const l of locales) {
        alternates[l] = `${base}/${l}/layanan/${s.frontmatter.slug}`;
      }
      entries.push({
        url: `${base}/${lang}/layanan/${s.frontmatter.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates },
      });
    }

    const articles = await getArticles(lang);
    for (const a of articles) {
      const alternates: Record<string, string> = {};
      for (const l of locales) {
        alternates[l] = `${base}/${l}/artikel/${a.frontmatter.slug}`;
      }
      entries.push({
        url: `${base}/${lang}/artikel/${a.frontmatter.slug}`,
        lastModified: new Date(a.frontmatter.date),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: alternates },
      });
    }

    const projects = await getProjects(lang);
    for (const p of projects) {
      const alternates: Record<string, string> = {};
      for (const l of locales) {
        alternates[l] = `${base}/${l}/proyek/${p.frontmatter.slug}`;
      }
      entries.push({
        url: `${base}/${lang}/proyek/${p.frontmatter.slug}`,
        lastModified: new Date(`${p.frontmatter.year}-01-01`),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
