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

      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          aria-hidden="true"
        />
        <div className="container relative py-16 lg:py-24">
          <Breadcrumb
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.about },
            ]}
          />
          <span className="mt-6 inline-block eyebrow">{dict.nav.about}</span>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {about.title}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
            {about.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <p className="text-pretty text-lg leading-relaxed text-slate-700">
              {about.intro}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="card-elevated relative overflow-hidden p-6">
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-100 opacity-50 blur-2xl"
                />
                <h3 className="relative text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  Mission
                </h3>
                <p className="relative mt-3 text-slate-700">{about.mission}</p>
              </div>
              <div className="card-elevated relative overflow-hidden p-6">
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-100 opacity-50 blur-2xl"
                />
                <h3 className="relative text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  Vision
                </h3>
                <p className="relative mt-3 text-slate-700">{about.vision}</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Values
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {about.values.map((v) => (
                  <div
                    key={v.title}
                    className="card-elevated card-hover flex gap-3 p-5"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-slate-900">
                        {v.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">
                        {v.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="card-elevated p-6">
              <div className="flex items-center gap-2 text-brand-700">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50">
                  <Award className="h-4 w-4" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold">Sertifikasi</span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
                {about.certifications.map((c) => (
                  <li key={c} className="flex gap-2">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                      aria-hidden="true"
                    />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-sm text-white">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(at 20% 30%, rgb(var(--brand-500)) 0px, transparent 50%), radial-gradient(at 80% 70%, rgb(var(--brand-400)) 0px, transparent 50%)",
                }}
              />
              <p className="relative font-display text-base font-semibold">
                {settings.brandName}
              </p>
              <p className="relative mt-1.5 text-slate-300">
                {settings.brandTagline[locale]}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
