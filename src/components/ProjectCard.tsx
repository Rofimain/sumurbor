import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { ProjectFrontmatter } from "@/lib/content";

export function ProjectCard({ project }: { project: ProjectFrontmatter }) {
  return (
    <Link
      href={`/proyek/${project.slug}`}
      className="card-elevated card-hover group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {project.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
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
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="font-display text-5xl font-bold tracking-tight text-slate-300">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-soft-sm backdrop-blur">
          {project.year}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex w-fit items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-700">
          {project.serviceType}
        </span>
        <h3 className="mt-3 font-display text-base font-semibold leading-snug text-slate-900 group-hover:text-brand-700 sm:text-lg">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {project.summary}
        </p>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
            {project.location}
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-900 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
