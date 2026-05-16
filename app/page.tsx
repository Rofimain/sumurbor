import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Users,
  Clock,
  Sparkles,
  Cog,
} from "lucide-react";
import {
  getServices,
  getProjects,
  getArticles,
  getTestimonials,
} from "@/lib/db";
import { siteConfig, stats, trustBadges, whyUs } from "@/data";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

export const revalidate = 60;

const ICON_MAP: Record<string, typeof CheckCircle2> = {
  ShieldCheck,
  Users,
  Clock,
  Cog,
};

export default async function HomePage() {
  const [services, featuredProjects, articles, testimonials] = await Promise.all([
    getServices(),
    getProjects({ featured: true, limit: 3 }),
    getArticles({ published: true, limit: 3 }),
    getTestimonials({ featured: true }),
  ]);

  return (
    <>
      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
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

        <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <span className="eyebrow eyebrow-dot animate-fade-up">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Kontraktor Pondasi Tepercaya
            </span>
            <h1 className="mt-6 text-balance font-heading text-4xl font-bold leading-[1.05] tracking-tight text-ink animate-fade-up animate-fade-up-1 sm:text-5xl lg:text-6xl xl:text-7xl">
              Solusi Sumur Bor & Pondasi <span className="text-gradient-brand">Bor Pile Presisi</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-muted animate-fade-up animate-fade-up-2">
              Peralatan modern, tim bersertifikat, dan garansi pengerjaan untuk
              proyek skala kecil hingga komersial.
            </p>
            <div className="mt-9 flex flex-wrap gap-3 animate-fade-up animate-fade-up-3">
              <Link href="/kontak" className="btn-primary h-12 px-6 text-sm">
                Konsultasi Gratis
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/layanan" className="btn-outline h-12 px-6 text-sm">
                Lihat Layanan
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-subtle animate-fade-up animate-fade-up-4">
              {trustBadges.map((tb) => (
                <div key={tb} className="flex items-center gap-2">
                  <CheckCircle2
                    className="h-4 w-4 text-brand-500"
                    aria-hidden="true"
                  />
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
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
                  Rekam Jejak Kami
                </p>
                <div className="mt-5 grid grid-cols-2 gap-5">
                  {stats.slice(0, 4).map((s) => (
                    <div key={s.label}>
                      <div className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                        {s.value}
                      </div>
                      <div className="mt-1 text-[11px] font-medium uppercase tracking-wider leading-tight text-ink-subtle">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-7 border-t border-surface-line pt-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Jaminan Mutu Pengerjaan
                      </p>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        Setiap proyek mengikuti SOP & dilengkapi dokumentasi
                        teknis lengkap.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHY US ────────────────────────────────────── */}
      <section className="border-t border-surface-line bg-white py-20 sm:py-24">
        <div className="container-page">
          <header className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Keunggulan</span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Kenapa Memilih Kami
            </h2>
            <p className="mt-4 text-pretty text-ink-muted">
              Kombinasi tim ahli, peralatan modern, dan proses transparan untuk
              hasil yang dapat dipertanggungjawabkan.
            </p>
          </header>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((it) => {
              const Icon = ICON_MAP[it.icon] || CheckCircle2;
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
                  <h3 className="relative mt-5 font-heading text-lg font-semibold text-ink">
                    {it.title}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-ink-muted">
                    {it.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ──────────────────────────────────── */}
      {services.length > 0 && (
        <section className="relative border-t border-surface-line bg-surface-alt/60 py-20 sm:py-24">
          <div className="absolute inset-0 bg-dots opacity-50" aria-hidden="true" />
          <div className="container-page relative">
            <header className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow">Layanan</span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Layanan Kami
                </h2>
                <p className="mt-3 text-pretty text-ink-muted">
                  Pondasi dan sumur bor untuk berbagai kebutuhan konstruksi dan
                  air bersih.
                </p>
              </div>
              <Link
                href="/layanan"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-600"
              >
                Lihat semua
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── PROJECTS ──────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="border-t border-surface-line bg-white py-20 sm:py-24">
          <div className="container-page">
            <header className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow">Portofolio</span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Proyek Terbaru
                </h2>
                <p className="mt-3 text-pretty text-ink-muted">
                  Studi kasus pekerjaan yang sudah kami selesaikan.
                </p>
              </div>
              <Link
                href="/proyek"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-600"
              >
                Lihat semua
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ──────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="border-t border-surface-line bg-surface-alt/60 py-20 sm:py-24">
          <div className="container-page">
            <header className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Testimoni</span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Apa Kata Klien
              </h2>
              <p className="mt-3 text-pretty text-ink-muted">
                Hasil & relasi adalah kompas kerja kami.
              </p>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <TestimonialCard key={t.id} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ARTICLES ──────────────────────────────────── */}
      {articles.length > 0 && (
        <section className="border-t border-surface-line bg-white py-20 sm:py-24">
          <div className="container-page">
            <header className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="eyebrow">Insight</span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  Artikel & Edukasi
                </h2>
                <p className="mt-3 text-pretty text-ink-muted">
                  Panduan teknis dan tips memilih jasa pondasi.
                </p>
              </div>
              <Link
                href="/artikel"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-brand-600"
              >
                Lihat semua
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </header>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FINAL CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-surface-line bg-slate-950 py-20 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(at 20% 30%, rgb(var(--brand-500)) 0px, transparent 50%), radial-gradient(at 80% 70%, rgb(var(--brand-400)) 0px, transparent 50%)",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-[0.06]" />
        <div className="container-page relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand-400"
              aria-hidden="true"
            />
            Siap memulai?
          </span>
          <h2 className="mx-auto mt-5 max-w-3xl text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Konsultasi Gratis untuk Proyek Anda
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-white/70">
            {siteConfig.description}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
            >
              Minta Penawaran
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/proyek"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10"
            >
              Lihat Proyek
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
