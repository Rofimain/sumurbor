import type { Metadata } from "next";
import { siteConfig } from "@/data";

interface BuildMetadataInput {
  title: string;
  description: string;
  pathSegments: string[];
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl || ""
  ).replace(/\/$/, "");
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
  const base = siteUrl();
  const url = base + (pathSegments.length ? "/" + pathSegments.join("/") : "/");
  const image = ogImage || siteConfig.ogImage;

  return {
    title,
    description,
    metadataBase: base ? new URL(base) : undefined,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.brandName,
      locale: "id_ID",
      images: image ? [{ url: image }] : undefined,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    other: {
      "geo.region": "ID-JK",
      "geo.country": "ID",
    },
  };
}
