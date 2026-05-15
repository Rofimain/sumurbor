import type { Locale } from "@/i18n/config";
import type {
  ArticleFrontmatter,
  ProjectFrontmatter,
  ServiceFrontmatter,
  SiteSettings,
} from "@/lib/content";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function localBusinessSchema(settings: SiteSettings, locale: Locale) {
  const sameAs = Object.values(settings.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${settings.siteUrl}#business`,
    name: settings.brandName,
    description: settings.brandTagline[locale],
    url: settings.siteUrl,
    telephone: settings.phone,
    email: settings.email,
    image: settings.ogImage
      ? `${settings.siteUrl}${settings.ogImage}`
      : undefined,
    logo: settings.logo
      ? `${settings.siteUrl}${settings.logo}`
      : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address.street,
      addressLocality: settings.address.city,
      addressRegion: settings.address.region,
      postalCode: settings.address.postalCode,
      addressCountry: settings.address.country,
    },
    areaServed: settings.areaServed.map((a) => ({ "@type": "City", name: a })),
    foundingDate: String(settings.foundingYear),
    sameAs: sameAs.length ? sameAs : undefined,
    openingHours: "Mo-Sa 08:00-17:00",
  };
}

export function breadcrumbSchema(
  trail: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.url,
    })),
  };
}

export function articleSchema(
  article: ArticleFrontmatter,
  url: string,
  settings: SiteSettings,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage
      ? `${settings.siteUrl}${article.coverImage}`
      : undefined,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: article.author ?? settings.brandName,
    },
    publisher: {
      "@type": "Organization",
      name: settings.brandName,
      logo: settings.logo
        ? {
            "@type": "ImageObject",
            url: `${settings.siteUrl}${settings.logo}`,
          }
        : undefined,
    },
    mainEntityOfPage: url,
  };
}

export function serviceSchema(
  service: ServiceFrontmatter,
  url: string,
  settings: SiteSettings,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.excerpt,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${settings.siteUrl}#business`,
      name: settings.brandName,
    },
    areaServed: settings.areaServed.map((a) => ({ "@type": "City", name: a })),
    url,
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function projectSchema(
  project: ProjectFrontmatter,
  url: string,
  settings: SiteSettings,
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.coverImage
      ? `${settings.siteUrl}${project.coverImage}`
      : undefined,
    dateCreated: String(project.year),
    locationCreated: {
      "@type": "Place",
      name: project.location,
    },
    creator: {
      "@type": "Organization",
      "@id": `${settings.siteUrl}#business`,
      name: settings.brandName,
    },
    url,
  };
}
