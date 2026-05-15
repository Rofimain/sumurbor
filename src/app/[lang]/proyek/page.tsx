import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getProjects, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
import { Breadcrumb } from "@/components/Breadcrumb";
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
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white py-12 lg:py-16">
        <div className="container">
          <Breadcrumb
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.projects },
            ]}
          />
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {dict.projects.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            {dict.projects.subheading}
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
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
