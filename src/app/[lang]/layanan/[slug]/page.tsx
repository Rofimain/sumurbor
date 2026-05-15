import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getService, getServices, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
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

      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white py-12 lg:py-16">
        <div className="container">
          <Breadcrumb
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.services, href: `/${locale}/layanan` },
              { label: fm.title },
            ]}
          />
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {fm.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{fm.excerpt}</p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container grid gap-10 lg:grid-cols-3">
          <article
            className="prose-content lg:col-span-2"
            dangerouslySetInnerHTML={{ __html: service.html }}
          />
          <aside className="space-y-4">
            {fm.features && fm.features.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  Spesifikasi
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {fm.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-5">
              <p className="text-sm font-medium text-slate-900">
                {dict.cta.quote}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {dict.contact.subheading}
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href={`/${locale}/kontak`} className="btn-primary w-full">
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
        <section className="border-t border-slate-100 bg-slate-50 py-14">
          <div className="container max-w-3xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              FAQ
            </h2>
            <div className="mt-6 space-y-3">
              {fm.faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 bg-white p-5 open:border-brand-300"
                >
                  <summary className="cursor-pointer list-none text-base font-medium text-slate-900 marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
