import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { t } from "@/lib/strings";
import { getArticle, getArticles, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ slug: a.frontmatter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return buildMetadata({
    title: article.frontmatter.title,
    description: article.frontmatter.excerpt,
    pathSegments: ["artikel", slug],
    ogImage: article.frontmatter.coverImage,
    type: "article",
    publishedTime: article.frontmatter.date,
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const url = `${baseUrl}/artikel/${slug}`;
  const fm = article.frontmatter;
  const date = new Date(fm.date);
  const formatted = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return (
    <>
      <JsonLd data={articleSchema(fm, url, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.articles, url: `${baseUrl}/artikel` },
          { name: fm.title, url },
        ])}
      />

      <article>
        <header className="relative overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
            aria-hidden="true"
          />
          <div className="container relative max-w-3xl py-14 sm:py-20">
            <Breadcrumb
              items={[
                { label: t.nav.home, href: "/" },
                { label: t.nav.articles, href: "/artikel" },
                { label: fm.title },
              ]}
            />
            <span className="mt-6 inline-block eyebrow">{t.nav.articles}</span>
            <h1 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {fm.title}
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-slate-600">
              {fm.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-500" aria-hidden="true" />
                {formatted}
              </span>
              {fm.author && (
                <>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4 text-brand-500" aria-hidden="true" />
                    {fm.author}
                  </span>
                </>
              )}
              {fm.readTime && (
                <>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-500" aria-hidden="true" />
                    {fm.readTime} {t.articles.readTime}
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {fm.coverImage && (
          <div className="bg-white">
            <div className="container max-w-4xl py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fm.coverImage}
                alt={fm.title}
                className="aspect-[16/9] w-full rounded-3xl object-cover shadow-soft-lg"
              />
            </div>
          </div>
        )}

        <section className="bg-white pb-20">
          <div
            className="container-prose prose-content"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </section>
      </article>
    </>
  );
}
