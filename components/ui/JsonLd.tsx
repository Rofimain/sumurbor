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

export interface OrganizationSettings {
  brandName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region?: string;
  postalCode?: string;
  country?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  foundingYear?: string;
}

export function organizationSchema(settings: OrganizationSettings) {
  const sameAs = [
    settings.instagram,
    settings.facebook,
    settings.linkedin,
    settings.youtube,
    settings.tiktok,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: settings.brandName,
    description: settings.description,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.region,
      postalCode: settings.postalCode,
      addressCountry: settings.country || "ID",
    },
    foundingDate: settings.foundingYear,
    sameAs: sameAs.length ? sameAs : undefined,
    openingHours: "Mo-Sa 08:00-17:00",
  };
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
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

export function articleSchema(article: {
  title: string;
  excerpt: string;
  cover_image?: string | null;
  published_at: string;
  author?: string;
  slug: string;
  brandName: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image || undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      "@type": "Organization",
      name: article.author || article.brandName,
    },
    publisher: {
      "@type": "Organization",
      name: article.brandName,
    },
    mainEntityOfPage: article.url,
  };
}

export function serviceSchema(service: {
  title: string;
  description: string;
  url: string;
  brandName: string;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: service.brandName,
    },
    areaServed: service.areaServed?.map((a) => ({
      "@type": "City",
      name: a,
    })),
    url: service.url,
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
