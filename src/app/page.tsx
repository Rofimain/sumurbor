import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Users,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { t } from "@/lib/strings";
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

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSiteSettings();
  return buildMetadata({
    title: `${settings.brandName} — ${t.home.heroTitle}`,
    description: t.meta.siteDescription,
    pathSegments: [],
  });
}

export default async function HomePage() {
  const settings = getSiteSettings();
  const [services, projects, articles] = await Promise.all([
    getServices(),
    getProjects(),
    getArticles(),
  ]);

  const iconForBenefit = [ShieldCheck, Users, Clock, CheckCircle2];

  return (
    <>
      {/* ─── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl animate-float"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -right-20 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="container relative grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <span className="eyebrow eyebrow-dot animate-fade-up">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {t.home.heroBadge}
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-900 animate-fade-up animate-fade-up-1 sm:text-5xl lg:text-6xl xl:text-7xl">
              {t.home.heroTitle.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient-brand">
                {t.home.heroTitle.split(" ").slice(-2).join(" ")}
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 animate-fade-up animate-fade-up-2">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 animate-fade-up animate-fade-up-3">
              <Link href="/kontak" className="btn-primary h-12 px-6 text-sm">
                {t.home.primaryCta}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/layanan" className="btn-outline h-12 px-6 text-sm">
                {t.home.secondaryCta}
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500 animate-fade-up animate-fade-up-4">
              {t.home.trustBadges.map((tb) => (
                <div key={tb} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-500" aria-hidden="true" />
                  <span>{tb}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-brand-200/40 via-brand-100/30 to-transparent blur-2xl"
              />
              <div className="card-elevated relative rounded-3xl p-6 sm:p-8 animate-fade-up animate-fade-up-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                  {t.home.statsHeading}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-4">
                  <Stat
                    value={`${new Date().getFullYear() - settings.foundingYear}+`}
                    label={t.home.statsExperience}
                  />
                  <Stat value="200+" label={t.home.statsProjects} />
                  <Stat value="50+" label={t.home.statsClients} />
                </div>
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t.home.assuranceTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {t.home.assuranceBody}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why us ────────────────────────────────── */}
      <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
        <div className="container">
          <header className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">{t.home.whyEyebrow}</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {t.home.whyHeading}
            </h2>
            <p className="mt-4 text-pretty text-slate-600">{t.home.whySubheading}</p>
          </header>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.whyItems.map((it, i) => {
              const Icon = iconForBenefit[i] ?? CheckCircle2;
              return (
                <div
                  key={it.title}
                  className="card-elevated card-hover relative overflow-hidden p-6"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand-50 opacity-60 blur-2xl"
                  />
                  <div
                    className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-brand-glow"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="relative mt-5 font-display text-lg font-semibold text-slate-900">
                    {it.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-slate-600">
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Services ──────────────────────────────── */}
      {services.length > 0 && (
        <section
          id="services"
          className="relative border-t border-slate-100 bg-slate-50/60 py-20 sm:py-24"
        >
          <div className="absolute inset-0 bg-dots opacity-50" aria-hidden="true" />
          <div className="container relative">
            <header className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow">{t.home.servicesEyebrow}</span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {t.home.servicesHeading}
                </h2>
                <p className="mt-3 text-pretty text-slate-600">
                  {t.home.servicesSubheading}
                </p>
              </div>
              <Link
                href="/layanan"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-brand-600"
              >
                {t.cta.viewAll}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.frontmatter.slug} service={s.frontmatter} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Projects ──────────────────────────────── */}
      {projects.length > 0 && (
        <section className="border-t border-slate-100 bg-white py-20 sm:py-24">
          <div className="container">
            <header className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow">{t.home.projectsEyebrow}</span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {t.home.projectsHeading}
                </h2>
                <p className="mt-3 text-pretty text-slate-600">
                  {t.home.projectsSubheading}
                </p>
              </div>
              <Link
                href="/proyek"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-brand-600"
              >
                {t.cta.viewAll}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 3).map((p) => (
                <ProjectCard key={p.frontmatter.slug} project={p.frontmatter} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Articles ──────────────────────────────── */}
      {articles.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50/60 py-20 sm:py-24">
          <div className="container">
            <header className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow">{t.home.articlesEyebrow}</span>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {t.home.articlesHeading}
                </h2>
                <p className="mt-3 text-pretty text-slate-600">
                  {t.home.articlesSubheading}
                </p>
              </div>
              <Link
                href="/artikel"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-brand-600"
              >
                {t.cta.viewAll}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 3).map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a.frontmatter} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Final CTA ─────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-slate-100 bg-slate-950 py-20 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(at 20% 30%, rgb(var(--brand-500)) 0px, transparent 50%), radial-gradient(at 80% 70%, rgb(var(--brand-400)) 0px, transparent 50%)",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="container relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
            {t.home.ctaEyebrow}
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t.home.primaryCta}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-white/70">
            {t.home.heroSubtitle}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
            >
              {t.cta.quote}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              {t.cta.whatsapp}
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
      <div className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {value}
      </div>
      <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider leading-tight text-slate-500">
        {label}
      </div>
    </div>
  );
}
