import type { Metadata } from "next";
import { CheckCircle2, Award, Target, Compass } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getCanonicalBase, getSeoConfig } from "@/lib/seo-settings";
import { getTeam } from "@/lib/db";
import { siteConfig, values, certifications, stats } from "@/data";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/ui/JsonLd";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [canonicalBase, seo] = await Promise.all([
    getCanonicalBase(),
    getSeoConfig(),
  ]);
  return buildMetadata({
    title: "Tentang Kami",
    description: `Mitra pondasi tepercaya sejak ${siteConfig.foundingYear}. ${siteConfig.description}`,
    pathSegments: ["tentang"],
    canonicalBase,
    noindex: seo.globalNoindex,
  });
}

export default async function AboutPage() {
  const team = await getTeam();
  const base = await getCanonicalBase();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: `${base}/` },
          { name: "Tentang", url: `${base}/tentang` },
        ])}
      />

      <PageHero
        eyebrow="Tentang"
        title={`Tentang ${siteConfig.brandName}`}
        subtitle={`Mitra pondasi tepercaya sejak ${siteConfig.foundingYear}`}
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Tentang" },
        ]}
      />

      {/* ── Intro + Mission / Vision ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <p className="text-pretty text-lg leading-relaxed text-ink-soft">
              {siteConfig.brandName} adalah kontraktor spesialis sumur bor dan
              pondasi bor pile dengan pengalaman lebih dari satu dekade melayani
              proyek residensial, komersial, dan infrastruktur di seluruh
              Indonesia.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="card-elevated relative overflow-hidden p-6">
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-100 opacity-50 blur-2xl"
                />
                <div className="relative flex items-center gap-2 text-brand-700">
                  <Target className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
                    Misi
                  </span>
                </div>
                <p className="relative mt-3 text-ink-soft">
                  Memberikan solusi pondasi presisi tinggi dengan peralatan
                  modern dan tim bersertifikat, didukung komitmen transparansi
                  serta garansi pengerjaan.
                </p>
              </div>
              <div className="card-elevated relative overflow-hidden p-6">
                <div
                  aria-hidden="true"
                  className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-brand-100 opacity-50 blur-2xl"
                />
                <div className="relative flex items-center gap-2 text-brand-700">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
                    Visi
                  </span>
                </div>
                <p className="relative mt-3 text-ink-soft">
                  Menjadi mitra kontraktor pondasi terpercaya di Asia Tenggara
                  dengan standar mutu kelas dunia.
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Nilai
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="card-elevated card-hover flex gap-3 p-5"
                  >
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-ink">
                        {v.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
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
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em]">
                  Sertifikasi
                </span>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {certifications.map((c) => (
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
              <p className="relative font-heading text-base font-semibold">
                {siteConfig.brandName}
              </p>
              <p className="relative mt-1.5 text-slate-300">
                {siteConfig.tagline}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-t border-surface-line bg-surface-alt/60 py-16 sm:py-20">
        <div className="container-page">
          <header className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Rekam Jejak</span>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Angka yang Kami Banggakan
            </h2>
          </header>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="card-elevated p-7 text-center"
              >
                <div className="font-heading text-4xl font-bold tracking-tight text-gradient-brand sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-semibold text-ink">
                  {s.label}
                </div>
                <div className="mt-1 text-xs text-ink-subtle">
                  {s.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team (only if DB has rows) ── */}
      {team.length > 0 && (
        <section className="border-t border-surface-line bg-white py-16 sm:py-20">
          <div className="container-page">
            <header className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Tim Kami</span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Orang-Orang di Balik Proyek
              </h2>
              <p className="mt-3 text-pretty text-ink-muted">
                Engineer, operator, dan project manager bersertifikat.
              </p>
            </header>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <div
                  key={m.id}
                  className="card-elevated card-hover overflow-hidden"
                >
                  <div className="aspect-square w-full overflow-hidden bg-surface-alt">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 via-white to-brand-100/40">
                        <span className="font-heading text-7xl font-bold tracking-tight text-brand-300">
                          {m.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-ink">
                      {m.name}
                    </h3>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand-600">
                      {m.role}
                    </p>
                    {m.bio && (
                      <p className="mt-3 text-sm text-ink-muted">{m.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
