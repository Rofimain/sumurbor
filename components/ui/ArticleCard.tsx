import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import type { ArticleRow } from "@/lib/supabase";

export function ArticleCard({ article }: { article: ArticleRow }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="card-elevated card-hover group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-alt">
        {article.cover_image ? (
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 via-white to-brand-100/40">
            <span className="font-heading text-6xl font-bold tracking-tight text-brand-300">
              {article.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-ink-subtle">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
            {formatDateShort(article.published_at)}
          </span>
          {article.read_time > 0 && (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                {article.read_time} menit baca
              </span>
            </>
          )}
        </div>

        <h3 className="mt-3 font-heading text-base font-semibold leading-snug text-ink group-hover:text-brand-700 sm:text-lg">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {article.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
          <span>Baca selengkapnya</span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
