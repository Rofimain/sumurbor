import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ProjectFrontmatter } from "@/lib/content";

export function ProjectCard({
  locale,
  project,
}: {
  locale: Locale;
  project: ProjectFrontmatter;
}) {
  return (
    <Link
      href={`/${locale}/proyek/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-brand-300"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {project.serviceType}
        </span>
        <h3 className="mt-2 text-base font-semibold text-slate-900 group-hover:text-brand-700">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
          {project.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {project.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {project.year}
          </span>
        </div>
      </div>
    </Link>
  );
}
