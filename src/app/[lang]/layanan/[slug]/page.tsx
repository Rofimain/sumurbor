import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronDown, HelpCircle } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getService, getServices, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    const services = await getServices(lang);
    for (const s of services) {
      params.push({ lang, slug: s.frontmatter.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const service = await getService(lang, slug);
  if (!service) return {};
  return buildMetadata({
    locale: lang,
    title: service.frontmatter.title,
    description: service.frontmatter.excerpt,
    pathSegments: ["layanan", slug],
    ogImage: service.frontmatter.coverImage,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const service = await getService(locale, slug);
  if (!service) notFound();
  const dict = getDictionary(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const url = `${baseUrl}/${locale}/layanan/${slug}`;
  const fm = service.frontmatter;

  return (
    <>
      <JsonLd data={serviceSchema(fm, url, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.services, url: `${baseUrl}/${locale}/layanan` },
          { name: fm.title, url },
        ])}
      />
      {fm.faq && fm.faq.length > 0 && <JsonLd data={faqSchema(fm.faq)} />}

      <PageHero
        eyebrow={dict.nav.services}
        title={fm.title}
        subtitle={fm.excerpt}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.services, href: `/${locale}/layanan` },
          { label: fm.title },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-3">
          <article
            className="prose-content lg:col-span-2"
            dangerouslySetInnerHTML={{ __html: service.html }}
          />
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {fm.features && fm.features.length > 0 && (
              <div className="card-elevated p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  Spesifikasi
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                  {fm.features.map((f) => (
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
              <p className="relative font-display text-base font-semibold">
                {dict.cta.quote}
              </p>
              <p className="relative mt-1.5 text-sm text-slate-300">
                {dict.contact.subheading}
              </p>
              <div className="relative mt-5 flex flex-col gap-2.5">
                <Link
                  href={`/${locale}/kontak`}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
                >
                  {dict.cta.quote}
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  {dict.cta.whatsapp}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {fm.faq && fm.faq.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/60 py-16 sm:py-20">
          <div className="container max-w-3xl">
            <div className="text-center">
              <span className="eyebrow">
                <HelpCircle className="h-3 w-3" aria-hidden="true" />
                FAQ
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Pertanyaan yang sering ditanyakan
              </h2>
            </div>
            <div className="mt-10 space-y-3">
              {fm.faq.map((f) => (
                <details
                  key={f.q}
                  className="card-elevated group p-5 transition-all open:bg-white open:shadow-soft-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-slate-900 marker:hidden">
                    <span>{f.q}</span>
                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180 group-open:text-brand-600"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
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
