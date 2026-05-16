import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { ProjectRow } from "@/lib/supabase";

export function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    <Link
      href={`/proyek/${project.slug}`}
      className="card-elevated card-hover group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-alt">
        {project.cover_image ? (
          <>
            <img
              src={project.cover_image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent"
            />
          </>
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 via-white to-brand-100/40">
            <span className="font-heading text-5xl font-bold tracking-tight text-brand-300">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {project.year && (
          <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-ink shadow-soft-sm backdrop-blur">
            {project.year}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {project.category && (
          <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-700">
            {project.category}
          </span>
        )}
        <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-ink group-hover:text-brand-700 sm:text-lg">
          {project.title}
        </h3>
        {project.description && (
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">
            {project.description}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between text-xs text-ink-subtle">
          {project.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin
                className="h-3.5 w-3.5 text-brand-500"
                aria-hidden="true"
              />
              {project.location}
            </span>
          )}
          <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-mute text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
