import Link from "next/link";
import {
  Briefcase,
  Layers,
  Newspaper,
  Users,
  MessageSquare,
  Settings,
  ArrowRight,
} from "lucide-react";
import { requireAuth } from "@/lib/auth";
import {
  getServices,
  getProjects,
  getArticles,
  getTeam,
  getTestimonials,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAuth();
  const [services, projects, articles, team, testimonials] = await Promise.all([
    getServices(),
    getProjects(),
    getArticles(),
    getTeam(),
    getTestimonials(),
  ]);

  const stats = [
    {
      label: "Layanan",
      value: services.length,
      href: "/admin/layanan",
      icon: Layers,
    },
    {
      label: "Proyek",
      value: projects.length,
      href: "/admin/proyek",
      icon: Briefcase,
    },
    {
      label: "Artikel",
      value: articles.length,
      href: "/admin/artikel",
      icon: Newspaper,
    },
    { label: "Tim", value: team.length, href: "/admin/tim", icon: Users },
    {
      label: "Testimoni",
      value: testimonials.length,
      href: "/admin/testimoni",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-600">
          Dashboard
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Selamat datang kembali
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          {String(session.email)} · Kelola konten website dari panel ini.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
          Ringkasan Konten
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(({ label, value, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="card-elevated card-hover group block p-5"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-4 font-heading text-3xl font-bold tracking-tight text-ink">
                {value}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
          Aksi Cepat
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/admin/proyek", label: "Tambah Proyek", icon: Briefcase },
            {
              href: "/admin/artikel",
              label: "Tulis Artikel",
              icon: Newspaper,
            },
            {
              href: "/admin/pengaturan",
              label: "Edit Pengaturan",
              icon: Settings,
            },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="card group flex items-center gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-brand-glow">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="flex-1 font-semibold text-ink">{label}</span>
              <ArrowRight
                className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
