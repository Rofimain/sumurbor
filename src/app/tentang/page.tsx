import type { Metadata } from "next";
import { CheckCircle2, Award } from "lucide-react";
import { t } from "@/lib/strings";
import { getAboutContent, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const about = getAboutContent();
  return buildMetadata({
    title: about.title,
    description: about.intro,
    pathSegments: ["tentang"],
  });
}

export default async function AboutPage() {
  const about = getAboutContent();
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.about, url: `${baseUrl}/tentang` },
        ])}
      />

      <PageHero
        eyebrow={t.nav.about}
        title={about.title}
        subtitle={about.subtitle}
        breadcrumb={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.about },
        ]}
      />

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
                  Misi
                </h3>
                <p className="relative mt-3 text-slate-700">{about.mission}</p>
              </div>
              <div className="card-elevated relative overflow-hidden p-6">
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-100 opacity-50 blur-2xl"
                />
                <h3 className="relative text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
                  Visi
                </h3>
                <p className="relative mt-3 text-slate-700">{about.vision}</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Nilai
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {about.values.map((v) => (
                  <div key={v.title} className="card-elevated card-hover flex gap-3 p-5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-slate-900">{v.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{v.body}</p>
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
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
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
              <p className="relative mt-1.5 text-slate-300">{settings.brandTagline}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
