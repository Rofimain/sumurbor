import type { Metadata } from "next";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getServices } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { JsonLd, breadcrumbSchema } from "@/components/ui/JsonLd";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Layanan",
  description:
    "Layanan lengkap pondasi bor pile, sumur bor dalam, dan strauss pile dengan tim bersertifikat.",
  pathSegments: ["layanan"],
});

export default async function ServicesPage() {
  const services = await getServices();
  const base = siteUrl();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: `${base}/` },
          { name: "Layanan", url: `${base}/layanan` },
        ])}
      />
      <PageHero
        eyebrow="Layanan"
        title="Layanan Kami"
        subtitle="Pondasi dan sumur bor untuk berbagai kebutuhan konstruksi dan air bersih."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Layanan" },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          {services.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
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
      <p className="font-heading text-lg font-semibold text-ink">
        Belum ada layanan
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Layanan akan tampil di sini setelah ditambahkan dari admin panel.
      </p>
    </div>
  );
}
