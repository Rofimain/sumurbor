import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Images, MapPin, Calendar, Clock, User, Building2 } from "lucide-react";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getCanonicalBase, getSeoConfig } from "@/lib/seo-settings";
import { getProject, getProjects } from "@/lib/db";
import { resolveSlugParam } from "@/lib/route-params";
import { siteConfig } from "@/data";
import { PageHero } from "@/components/ui/PageHero";
import { ContentRenderer } from "@/components/ui/ContentRenderer";
import { JsonLd, breadcrumbSchema } from "@/components/ui/JsonLd";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects().catch(() => []);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = await resolveSlugParam(params);
  const project = await getProject(slug);
  if (!project) return {};
  const [canonicalBase, seo] = await Promise.all([
    getCanonicalBase(),
    getSeoConfig(),
  ]);
  return buildMetadata({
    title: project.title,
    description: project.description || project.title,
    pathSegments: ["proyek", slug],
    ogImage: project.cover_image || undefined,
    canonicalBase,
    noindex: seo.globalNoindex,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const slug = await resolveSlugParam(params);
  const project = await getProject(slug);
  if (!project) notFound();
  const base = siteUrl();
  const url = base ? `${base}/proyek/${slug}` : `/proyek/${slug}`;

  const specs = [
    { icon: MapPin, label: "Lokasi", value: project.location },
    { icon: Calendar, label: "Tahun", value: String(project.year) },
    { icon: Building2, label: "Jenis", value: project.category },
    { icon: Clock, label: "Durasi", value: project.duration },
    { icon: User, label: "Klien", value: project.client },
  ].filter((s) => s.value);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: base ? `${base}/` : "/" },
          { name: "Proyek", url: base ? `${base}/proyek` : "/proyek" },
          { name: project.title, url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.description,
          image: project.cover_image || undefined,
          dateCreated: String(project.year),
          locationCreated: { "@type": "Place", name: project.location },
          creator: {
            "@type": "Organization",
            name: siteConfig.brandName,
          },
          url,
        }}
      />

      <PageHero
        eyebrow={project.category || "Proyek"}
        title={project.title}
        subtitle={project.description}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Proyek", href: "/proyek" },
          { label: project.title },
        ]}
      />

      {project.cover_image && (
        <div className="bg-white">
          <div className="container-page py-10">
            <img
              src={project.cover_image}
              alt={project.title}
              className="aspect-[16/9] w-full rounded-3xl object-cover shadow-soft-lg"
            />
          </div>
        </div>
      )}

      <section className="bg-white pb-16 sm:pb-20">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <article className="prose-content lg:col-span-2">
            <h2>Tentang Proyek</h2>
            <ContentRenderer
              text={project.full_description || project.description}
            />

            {project.tags.length > 0 && (
              <div className="not-prose mt-8 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card-elevated p-6">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                Spesifikasi Proyek
              </h3>
              <dl className="mt-4 divide-y divide-surface-line text-sm">
                {specs.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <dt className="inline-flex items-center gap-2 text-ink-subtle">
                        <Icon
                          className="h-3.5 w-3.5 text-brand-500"
                          aria-hidden="true"
                        />
                        {s.label}
                      </dt>
                      <dd className="text-right font-semibold text-ink">
                        {s.value}
                      </dd>
                    </div>
                  );
                })}
                {project.depth && (
                  <div className="flex justify-between gap-3 py-3">
                    <dt className="text-ink-subtle">Kedalaman</dt>
                    <dd className="font-semibold text-ink">{project.depth}</dd>
                  </div>
                )}
                {project.diameter && (
                  <div className="flex justify-between gap-3 py-3">
                    <dt className="text-ink-subtle">Diameter</dt>
                    <dd className="font-semibold text-ink">{project.diameter}</dd>
                  </div>
                )}
                {project.piles != null && project.piles > 0 && (
                  <div className="flex justify-between gap-3 py-3 last:pb-0">
                    <dt className="text-ink-subtle">Jumlah titik</dt>
                    <dd className="font-semibold text-ink">{project.piles}</dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {project.images.length > 0 && (
        <section className="border-t border-surface-line bg-surface-alt/60 py-16 sm:py-20">
          <div className="container-page">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Images className="h-4 w-4" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Galeri Proyek
              </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.images.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt={`${project.title} ${i + 1}`}
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
