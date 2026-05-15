import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Users } from "lucide-react";
import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/getDictionary";
import {
  getArticles,
  getProjects,
  getServices,
  getSiteSettings,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ServiceCard } from "@/components/ServiceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { ArticleCard } from "@/components/ArticleCard";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  const settings = getSiteSettings();
  return buildMetadata({
    locale: lang,
    title: `${settings.brandName} — ${dict.home.heroTitle}`,
    description: dict.meta.siteDescription,
    pathSegments: [],
  });
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const settings = getSiteSettings();
  const [services, projects, articles] = await Promise.all([
    getServices(locale),
    getProjects(locale),
    getArticles(locale),
  ]);

  const iconForBenefit = [ShieldCheck, Users, Clock, CheckCircle2];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white">
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700">
              {dict.home.heroBadge}
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-600">
              {dict.home.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/${locale}/kontak`} className="btn-primary">
                {dict.home.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href={`/${locale}/layanan`} className="btn-outline">
                {dict.home.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <Stat
                value={`${new Date().getFullYear() - settings.foundingYear}+`}
                label={dict.home.statsExperience}
              />
              <Stat value="200+" label={dict.home.statsProjects} />
              <Stat value="50+" label={dict.home.statsClients} />
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="border-b border-slate-100 bg-white py-16">
        <div className="container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
              {dict.home.whyHeading}
            </h2>
          </header>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.whyItems.map((it, i) => {
              const Icon = iconForBenefit[i] ?? CheckCircle2;
              return (
                <div
                  key={it.title}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <Icon className="h-6 w-6 text-brand-500" aria-hidden="true" />
                  <h3 className="mt-3 text-base font-semibold text-slate-900">
                    {it.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate-600">{it.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="border-b border-slate-100 bg-slate-50 py-16">
        <div className="container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
              {dict.home.servicesHeading}
            </h2>
            <p className="mt-3 text-slate-600">{dict.home.servicesSubheading}</p>
          </header>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.frontmatter.slug}
                locale={locale}
                service={s.frontmatter}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="border-b border-slate-100 bg-white py-16">
          <div className="container">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
                  {dict.home.projectsHeading}
                </h2>
                <p className="mt-2 text-slate-600">
                  {dict.home.projectsSubheading}
                </p>
              </div>
              <Link
                href={`/${locale}/proyek`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {dict.cta.viewAll}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </header>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((p) => (
                <ProjectCard
                  key={p.frontmatter.slug}
                  locale={locale}
                  project={p.frontmatter}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <section className="border-b border-slate-100 bg-slate-50 py-16">
          <div className="container">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
                  {dict.home.articlesHeading}
                </h2>
                <p className="mt-2 text-slate-600">
                  {dict.home.articlesSubheading}
                </p>
              </div>
              <Link
                href={`/${locale}/artikel`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                {dict.cta.viewAll}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </header>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 3).map((a) => (
                <ArticleCard
                  key={a.frontmatter.slug}
                  locale={locale}
                  article={a.frontmatter}
                  dict={dict}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-brand-600 py-16 text-white">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {dict.home.primaryCta}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">
            {dict.home.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${locale}/kontak`}
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
            >
              {dict.cta.quote}
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20"
            >
              {dict.cta.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-semibold text-brand-600">
        {value}
      </div>
      <div className="mt-1 text-xs leading-tight text-slate-500">{label}</div>
    </div>
  );
}
