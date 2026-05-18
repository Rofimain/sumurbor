import { NextResponse } from "next/server";
import { getAnalyticsConfig } from "@/lib/analytics";
import { buildSitemapEntries, getSeoConfig } from "@/lib/seo-settings";
import { siteUrl } from "@/lib/seo";

export const runtime = "nodejs";

export async function GET() {
  const [config, entries, analytics] = await Promise.all([
    getSeoConfig(),
    buildSitemapEntries(),
    getAnalyticsConfig(),
  ]);
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
    analytics: {
      enabled: analytics.enabled,
      ga4Id: analytics.ga4Id || null,
      gtmId: analytics.gtmId || null,
    },
  });
}
