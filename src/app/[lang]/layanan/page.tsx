import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getServices, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ServiceCard } from "@/components/ServiceCard";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: dict.services.heading,
    description: dict.services.subheading,
    pathSegments: ["layanan"],
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const services = await getServices(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.services, url: `${baseUrl}/${locale}/layanan` },
        ])}
      />
      <PageHero
        eyebrow={dict.nav.services}
        title={dict.services.heading}
        subtitle={dict.services.subheading}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.services },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.frontmatter.slug}
                locale={locale}
                service={s.frontmatter}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
