import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Images } from "lucide-react";
import { t } from "@/lib/strings";
import { getProject, getProjects, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema, projectSchema } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    pathSegments: ["proyek", slug],
    ogImage: project.frontmatter.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const url = `${baseUrl}/proyek/${slug}`;
  const fm = project.frontmatter;

  const specs: { label: string; value: string | number | undefined }[] = [
    { label: t.projects.location, value: fm.location },
    { label: t.projects.year, value: fm.year },
    { label: t.projects.type, value: fm.serviceType },
    { label: t.projects.depth, value: fm.depth },
  ];

  return (
    <>
      <JsonLd data={projectSchema(fm, url, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.projects, url: `${baseUrl}/proyek` },
          { name: fm.title, url },
        ])}
      />

      <PageHero
        eyebrow={t.nav.projects}
        title={fm.title}
        subtitle={fm.summary}
        breadcrumb={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.projects, href: "/proyek" },
          { label: fm.title },
        ]}
      />

      {fm.coverImage && (
        <div className="bg-white">
          <div className="container py-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fm.coverImage}
              alt={fm.title}
              className="aspect-[16/9] w-full rounded-3xl object-cover shadow-soft-lg"
            />
          </div>
        </div>
      )}

      <section className="bg-white pb-16 sm:pb-20">
        <div className="container grid gap-12 lg:grid-cols-3">
          <article
            className="prose-content lg:col-span-2"
            dangerouslySetInnerHTML={{ __html: project.html }}
          />
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-elevated p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                Spesifikasi Proyek
              </h3>
              <dl className="mt-4 divide-y divide-slate-100 text-sm">
                {specs
                  .filter((s) => s.value !== undefined && s.value !== "")
                  .map((s) => (
                    <div
                      key={s.label}
                      className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <dt className="text-slate-500">{s.label}</dt>
                      <dd className="font-semibold text-slate-900">{s.value}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {fm.gallery && fm.gallery.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/60 py-16 sm:py-20">
          <div className="container">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Images className="h-4 w-4" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Galeri Proyek
              </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fm.gallery.map((src) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={src}
                  src={src}
                  alt={fm.title}
                  className="aspect-[4/3] w-full rounded-2xl object-cover shadow-soft transition-transform duration-500 hover:scale-[1.02]"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
