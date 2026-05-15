import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
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
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-brand-300"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.title}
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
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-brand-700">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
          {article.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatted}
          </span>
          {article.readTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {article.readTime} {dict.articles.readTime}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
