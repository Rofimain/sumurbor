import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronDown, HelpCircle, ArrowRight } from "lucide-react";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getCanonicalBase, getSeoConfig } from "@/lib/seo-settings";
import { getService, getServices } from "@/lib/db";
import { resolveSlugParam } from "@/lib/route-params";
import { siteConfig } from "@/data";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ContentRenderer } from "@/components/ui/ContentRenderer";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/components/ui/JsonLd";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices().catch(() => []);
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = await resolveSlugParam(params);
  const service = await getService(slug);
  if (!service) return {};
  const [canonicalBase, seo] = await Promise.all([
    getCanonicalBase(),
    getSeoConfig(),
  ]);
  return buildMetadata({
    title: service.title,
    description: service.description || service.title,
    pathSegments: ["layanan", slug],
    ogImage: service.cover_image || undefined,
    canonicalBase,
    noindex: seo.globalNoindex,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const slug = await resolveSlugParam(params);
  const service = await getService(slug);
  if (!service) notFound();
  const base = siteUrl();
  const url = base ? `${base}/layanan/${slug}` : `/layanan/${slug}`;

  return (
    <>
      <JsonLd
        data={serviceSchema({
          title: service.title,
          description: service.description,
          url,
          brandName: siteConfig.brandName,
          areaServed: [...siteConfig.areaServed],
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: base ? `${base}/` : "/" },
          { name: "Layanan", url: base ? `${base}/layanan` : "/layanan" },
          { name: service.title, url },
        ])}
      />
      {service.faq.length > 0 && <JsonLd data={faqSchema(service.faq)} />}

      <PageHero
        eyebrow="Layanan"
        title={service.title}
        subtitle={service.description}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Layanan", href: "/layanan" },
          { label: service.title },
        ]}
      />

      {service.cover_image && (
        <div className="bg-white">
          <div className="container-page py-10">
            <img
              src={service.cover_image}
              alt={service.title}
              className="aspect-[16/9] w-full rounded-3xl object-cover shadow-soft-lg"
            />
          </div>
        </div>
      )}

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <article className="prose-content lg:col-span-2">
            <div
              className="inline-flex items-center justify-center h-12 w-12 rounded-xl text-white shadow-brand-glow not-prose"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
              }}
            >
              <ServiceIcon name={service.icon} className="h-6 w-6" />
            </div>

            <ContentRenderer text={service.full_description || service.description} />

            {service.process.length > 0 && (
              <>
                <h2>Tahapan Pekerjaan</h2>
                <ol className="not-prose mt-4 space-y-3">
                  {service.process.map((p) => (
                    <li
                      key={p.step}
                      className="flex gap-4 rounded-2xl border border-surface-line bg-surface-alt/50 p-4"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-600 font-heading font-bold text-white">
                        {p.step}
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-ink">
                          {p.title}
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">
                          {p.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {service.features.length > 0 && (
              <div className="card-elevated p-6">
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
                  Spesifikasi
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                        aria-hidden="true"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(at 20% 30%, rgb(var(--brand-500)) 0px, transparent 50%), radial-gradient(at 80% 70%, rgb(var(--brand-400)) 0px, transparent 50%)",
                }}
              />
              <p className="relative font-heading text-base font-semibold">
                Diskusi proyek Anda
              </p>
              <p className="relative mt-1.5 text-sm text-slate-300">
                Konsultasi awal gratis. Tim engineer akan respons 1×24 jam.
              </p>
              <Link
                href="/kontak"
                className="relative mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
              >
                Minta Penawaran
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {service.faq.length > 0 && (
        <section className="border-t border-surface-line bg-surface-alt/60 py-16 sm:py-20">
          <div className="container-page max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">
                <HelpCircle className="h-3 w-3" aria-hidden="true" />
                FAQ
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Pertanyaan yang sering ditanyakan
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {service.faq.map((f, i) => (
                <details
                  key={i}
                  className="card-elevated group p-5 transition-all open:bg-white open:shadow-soft-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink marker:hidden">
                    <span>{f.q}</span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 group-open:text-brand-600"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
