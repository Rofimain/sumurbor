import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Award } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getAboutContent, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const about = getAboutContent(lang);
  return buildMetadata({
    locale: lang,
    title: about.title,
    description: about.intro,
    pathSegments: ["tentang"],
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const about = getAboutContent(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.about, url: `${baseUrl}/${locale}/tentang` },
        ])}
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white">
        <div className="container py-12 lg:py-16">
          <Breadcrumb
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.about },
            ]}
          />
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {about.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            {about.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <p className="text-lg leading-relaxed text-slate-700">
              {about.intro}
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  Mission
                </h3>
                <p className="mt-2 text-slate-700">{about.mission}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
                  Vision
                </h3>
                <p className="mt-2 text-slate-700">{about.vision}</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                Values
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {about.values.map((v) => (
                  <div
                    key={v.title}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {v.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">{v.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-brand-600">
                <Award className="h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-semibold">Sertifikasi</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {about.certifications.map((c) => (
                  <li key={c} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-brand-50/40 p-5 text-sm">
              <p className="font-medium text-slate-900">
                {settings.brandName}
              </p>
              <p className="mt-1 text-slate-600">
                {settings.brandTagline[locale]}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
