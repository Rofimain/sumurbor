import type { MetadataRoute } from "next";
import { buildRobotsConfig } from "@/lib/seo-settings";

export const revalidate = 60;

export default async function robots(): Promise<MetadataRoute.Robots> {
  return buildRobotsConfig();
}
