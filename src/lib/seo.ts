import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getSiteSettings } from "./content";
import { alternateUrls } from "./url";

interface BuildMetadataInput {
  locale: Locale;
  title: string;
  description: string;
  pathSegments: string[];
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}

export function buildMetadata({
  locale,
  title,
  description,
  pathSegments,
  ogImage,
  type = "website",
  publishedTime,
  noindex,
}: BuildMetadataInput): Metadata {
  const settings = getSiteSettings();
  const { canonical, languages } = alternateUrls(settings.siteUrl, pathSegments);
  const url = `${settings.siteUrl.replace(/\/$/, "")}/${locale}${
    pathSegments.length ? "/" + pathSegments.join("/") : ""
  }`;
  const image = ogImage ?? settings.ogImage ?? "/images/branding/og-default.png";

  return {
    title,
    description,
    metadataBase: new URL(settings.siteUrl),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: settings.brandName,
      locale: locale === "id" ? "id_ID" : "en_US",
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

export { alternateUrls };
