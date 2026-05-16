import type { Metadata } from "next";
import { t } from "@/lib/strings";
import { getServices, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ServiceCard } from "@/components/ServiceCard";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: t.services.heading,
    description: t.services.subheading,
    pathSegments: ["layanan"],
  });
}

export default async function ServicesPage() {
  const services = await getServices();
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.services, url: `${baseUrl}/layanan` },
        ])}
      />
      <PageHero
        eyebrow={t.nav.services}
        title={t.services.heading}
        subtitle={t.services.subheading}
        breadcrumb={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.services },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container">
          {services.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.frontmatter.slug} service={s.frontmatter} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="card-elevated mx-auto max-w-md p-10 text-center">
      <p className="font-display text-lg font-semibold text-slate-900">
        Belum ada layanan
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Layanan akan tampil di sini setelah ditambahkan dari admin.
      </p>
    </div>
  );
}
