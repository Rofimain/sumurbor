import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getCanonicalBase, getSeoConfig } from "@/lib/seo-settings";
import { getArticle, getArticles } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { resolveSlugParam } from "@/lib/route-params";
import { siteConfig } from "@/data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContentRenderer } from "@/components/ui/ContentRenderer";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
} from "@/components/ui/JsonLd";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles({ published: true }).catch(() => []);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = await resolveSlugParam(params);
  const article = await getArticle(slug);
  if (!article) return {};
  const [canonicalBase, seo] = await Promise.all([
    getCanonicalBase(),
    getSeoConfig(),
  ]);
  return buildMetadata({
    title: article.title,
    description: article.excerpt || article.title,
    pathSegments: ["artikel", slug],
    ogImage: article.cover_image || undefined,
    type: "article",
    publishedTime: article.published_at || undefined,
    canonicalBase,
    noindex: seo.globalNoindex,
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const slug = await resolveSlugParam(params);
  const article = await getArticle(slug);
  if (!article || !article.published) notFound();

  const base = siteUrl();
  const url = base ? `${base}/artikel/${slug}` : `/artikel/${slug}`;
  const publishedLabel = formatDate(article.published_at);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: article.title,
          excerpt: article.excerpt,
          cover_image: article.cover_image,
          published_at: article.published_at,
          author: article.author,
          slug: article.slug,
          brandName: siteConfig.brandName,
          url,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: base ? `${base}/` : "/" },
          { name: "Artikel", url: base ? `${base}/artikel` : "/artikel" },
          { name: article.title, url },
        ])}
      />

      <article>
        <header className="relative overflow-hidden border-b border-surface-line">
          <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="container-page relative max-w-3xl py-14 sm:py-20">
            <Breadcrumb
              items={[
                { label: "Beranda", href: "/" },
                { label: "Artikel", href: "/artikel" },
                { label: article.title },
              ]}
            />
            {article.category && (
              <span className="mt-6 inline-block eyebrow">
                {article.category}
              </span>
            )}
            <h1 className="mt-4 text-balance font-heading text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-muted">
                {article.excerpt}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-subtle">
              {publishedLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar
                    className="h-4 w-4 text-brand-500"
                    aria-hidden="true"
                  />
                  {publishedLabel}
                </span>
              )}
              {article.author && (
                <>
                  {publishedLabel && (
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-slate-300"
                    />
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <User
                      className="h-4 w-4 text-brand-500"
                      aria-hidden="true"
                    />
                    {article.author}
                  </span>
                </>
              )}
              {article.read_time > 0 && (
                <>
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 rounded-full bg-slate-300"
                  />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock
                      className="h-4 w-4 text-brand-500"
                      aria-hidden="true"
                    />
                    {article.read_time} menit baca
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {article.cover_image && (
          <div className="bg-white">
            <div className="container-page max-w-4xl py-10">
              <img
                src={article.cover_image}
                alt={article.title}
                className="aspect-[16/9] w-full rounded-3xl object-cover shadow-soft-lg"
              />
            </div>
          </div>
        )}

        <section className="bg-white pb-20">
          <div className="container-prose prose-content">
            <ContentRenderer text={article.content} />
            {article.tags.length > 0 && (
              <div className="not-prose mt-12 flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      </article>
    </>
  );
}

