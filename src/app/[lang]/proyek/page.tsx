import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getProjects, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
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
    title: dict.projects.heading,
    description: dict.projects.subheading,
    pathSegments: ["proyek"],
  });
}

export default async function ProjectsPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const projects = await getProjects(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.projects, url: `${baseUrl}/${locale}/proyek` },
        ])}
      />
      <PageHero
        eyebrow={dict.nav.projects}
        title={dict.projects.heading}
        subtitle={dict.projects.subheading}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.projects },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard
                key={p.frontmatter.slug}
                locale={locale}
                project={p.frontmatter}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
