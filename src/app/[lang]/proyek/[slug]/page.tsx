import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getProject,
  getProjects,
  getSiteSettings,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  JsonLd,
  breadcrumbSchema,
  projectSchema,
} from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    const projects = await getProjects(lang);
    for (const p of projects) {
      params.push({ lang, slug: p.frontmatter.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = await getProject(lang, slug);
  if (!project) return {};
  return buildMetadata({
    locale: lang,
    title: project.frontmatter.title,
    description: project.frontmatter.summary,
    pathSegments: ["proyek", slug],
    ogImage: project.frontmatter.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const project = await getProject(locale, slug);
  if (!project) notFound();
  const dict = getDictionary(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const url = `${baseUrl}/${locale}/proyek/${slug}`;
  const fm = project.frontmatter;

  const specs: { label: string; value: string | number | undefined }[] = [
    { label: dict.projects.location, value: fm.location },
    { label: dict.projects.year, value: fm.year },
    { label: dict.projects.type, value: fm.serviceType },
    { label: dict.projects.depth, value: fm.depth },
  ];

  return (
    <>
      <JsonLd data={projectSchema(fm, url, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.projects, url: `${baseUrl}/${locale}/proyek` },
          { name: fm.title, url },
        ])}
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white py-12 lg:py-16">
        <div className="container">
          <Breadcrumb
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.projects, href: `/${locale}/proyek` },
              { label: fm.title },
            ]}
          />
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {fm.title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">{fm.summary}</p>
        </div>
      </section>

      {fm.coverImage && (
        <div className="bg-white">
          <div className="container py-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fm.coverImage}
              alt={fm.title}
              className="aspect-[16/9] w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      )}

      <section className="bg-white pb-14">
        <div className="container grid gap-10 lg:grid-cols-3">
          <article
            className="prose-content lg:col-span-2"
            dangerouslySetInnerHTML={{ __html: project.html }}
          />
          <aside>
            <dl className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm">
              {specs
                .filter((s) => s.value !== undefined && s.value !== "")
                .map((s) => (
                  <div
                    key={s.label}
                    className="flex justify-between gap-3 border-b border-slate-200 py-2 last:border-0"
                  >
                    <dt className="text-slate-500">{s.label}</dt>
                    <dd className="font-medium text-slate-900">{s.value}</dd>
                  </div>
                ))}
            </dl>
          </aside>
        </div>
      </section>

      {fm.gallery && fm.gallery.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50 py-14">
          <div className="container">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
              Galeri
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fm.gallery.map((src) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={src}
                  src={src}
                  alt={fm.title}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
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
