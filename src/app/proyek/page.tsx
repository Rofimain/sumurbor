import type { Metadata } from "next";
import { t } from "@/lib/strings";
import { getProjects, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: t.projects.heading,
    description: t.projects.subheading,
    pathSegments: ["proyek"],
  });
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.projects, url: `${baseUrl}/proyek` },
        ])}
      />
      <PageHero
        eyebrow={t.nav.projects}
        title={t.projects.heading}
        subtitle={t.projects.subheading}
        breadcrumb={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.projects },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container">
          {projects.length === 0 ? (
            <div className="card-elevated mx-auto max-w-md p-10 text-center">
              <p className="font-display text-lg font-semibold text-slate-900">
                Belum ada proyek
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Proyek akan tampil di sini setelah dipublikasikan dari admin.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.frontmatter.slug} project={p.frontmatter} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
