import type { Metadata } from "next";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getProjects } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { JsonLd, breadcrumbSchema } from "@/components/ui/JsonLd";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Proyek",
  description:
    "Portofolio proyek bored pile, sumur bor dalam, dan strauss pile yang sudah kami selesaikan.",
  pathSegments: ["proyek"],
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  const base = siteUrl();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: `${base}/` },
          { name: "Proyek", url: `${base}/proyek` },
        ])}
      />
      <PageHero
        eyebrow="Portofolio"
        title="Proyek Kami"
        subtitle="Beberapa proyek yang sudah kami selesaikan untuk klien residensial, komersial, dan industri."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Proyek" },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          {projects.length === 0 ? (
            <div className="card-elevated mx-auto max-w-md p-10 text-center">
              <p className="font-heading text-lg font-semibold text-ink">
                Belum ada proyek
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Proyek akan tampil di sini setelah dipublikasikan dari admin panel.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
