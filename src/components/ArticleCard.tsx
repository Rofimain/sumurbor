import Link from "next/link";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ArticleFrontmatter } from "@/lib/content";
import type { Dictionary } from "@/i18n/getDictionary";

export function ArticleCard({
  locale,
  article,
  dict,
}: {
  locale: Locale;
  article: ArticleFrontmatter;
  dict: Dictionary;
}) {
  const date = new Date(article.date);
  const formatted = new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

  return (
    <Link
      href={`/${locale}/artikel/${article.slug}`}
      className="card-elevated card-hover group relative flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {article.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            />
          </>
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 via-white to-brand-100/40">
            <span className="font-display text-2xl font-semibold tracking-tight text-brand-300">
              {article.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
            {formatted}
          </span>
          {article.readTime && (
            <>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                {article.readTime} {dict.articles.readTime}
              </span>
            </>
          )}
        </div>

        <h3 className="mt-3 font-display text-base font-semibold leading-snug text-slate-900 group-hover:text-brand-700 sm:text-lg">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {article.excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <span>{dict.cta.readMore}</span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
