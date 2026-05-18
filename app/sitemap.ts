import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/seo-settings";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
