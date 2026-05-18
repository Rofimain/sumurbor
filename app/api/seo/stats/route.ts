import { NextResponse } from "next/server";
import { buildSitemapEntries, getSeoConfig } from "@/lib/seo-settings";
import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";

export async function GET() {
  const config = await getSeoConfig();
  const entries = await buildSitemapEntries();
  const base = config.canonicalBase || siteUrl();

  return NextResponse.json({
    urlCount: entries.length,
    sitemapEnabled: config.sitemapEnabled,
    canonicalBase: base,
    sitemapUrl: base ? `${base}/sitemap.xml` : null,
    robotsUrl: base ? `${base}/robots.txt` : null,
    includes: {
      services: config.includeServices,
      projects: config.includeProjects,
      articles: config.includeArticles,
      extraUrls: config.sitemapExtraUrls.length,
    },
  });
}
