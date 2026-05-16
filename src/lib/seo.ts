import type { Metadata } from "next";
import { getSiteSettings } from "./content";

interface BuildMetadataInput {
  title: string;
  description: string;
  pathSegments: string[];
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}

export function buildMetadata({
  title,
  description,
  pathSegments,
  ogImage,
  type = "website",
  publishedTime,
  noindex,
}: BuildMetadataInput): Metadata {
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const url =
    baseUrl + (pathSegments.length ? "/" + pathSegments.join("/") : "/");
  const image = ogImage || settings.ogImage || "/images/branding/og-default.png";

  return {
    title,
    description,
    metadataBase: new URL(settings.siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: settings.brandName,
      locale: "id_ID",
      images: [{ url: image }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    icons: {
      icon: settings.favicon || "/favicon.ico",
    },
    other: {
      "geo.region": "ID-JK",
      "geo.country": "ID",
    },
  };
}
