import { getSettings } from "@/lib/db";

export interface AnalyticsConfig {
  enabled: boolean;
  ga4Id: string;
  gtmId: string;
}

/** Extract GA4 measurement ID (G-XXXXXXXX) from pasted value or URL */
export function normalizeGa4Id(raw: string | undefined): string {
  if (!raw?.trim()) return "";
  const match = raw.trim().match(/G-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : "";
}

/** Extract GTM container ID (GTM-XXXXXXX) */
export function normalizeGtmId(raw: string | undefined): string {
  if (!raw?.trim()) return "";
  const match = raw.trim().match(/GTM-[A-Z0-9]+/i);
  return match ? match[0].toUpperCase() : "";
}

export async function getAnalyticsConfig(): Promise<AnalyticsConfig> {
  const db = await getSettings().catch(() => ({} as Record<string, string>));
  const enabled = db.analytics_enabled !== "false";

  const ga4Id = normalizeGa4Id(
    db.google_analytics_id ||
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
      "",
  );
  const gtmId = normalizeGtmId(db.google_tag_manager_id || "");

  const active = enabled && Boolean(ga4Id || gtmId);

  return {
    enabled: active,
    ga4Id: active ? ga4Id : "",
    gtmId: active ? gtmId : "",
  };
}
