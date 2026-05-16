import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, User } from "lucide-react";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getArticle, getArticles, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
} from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    const articles = await getArticles(lang);
    for (const a of articles) {
      params.push({ lang, slug: a.frontmatter.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const article = await getArticle(lang, slug);
  if (!article) return {};
  return buildMetadata({
    locale: lang,
    title: article.frontmatter.title,
    description: article.frontmatter.excerpt,
    pathSegments: ["artikel", slug],
    ogImage: article.frontmatter.coverImage,
    type: "article",
    publishedTime: article.frontmatter.date,
  });
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const article = await getArticle(locale, slug);
  if (!article) notFound();
  const dict = getDictionary(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const url = `${baseUrl}/${locale}/artikel/${slug}`;
  const fm = article.frontmatter;
  const date = new Date(fm.date);
  const formatted = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  ).format(date);

  return (
    <>
      <JsonLd data={articleSchema(fm, url, settings)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.articles, url: `${baseUrl}/${locale}/artikel` },
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
                { label: dict.nav.home, href: `/${locale}` },
                { label: dict.nav.articles, href: `/${locale}/artikel` },
                { label: fm.title },
              ]}
            />
            <span className="mt-6 inline-block eyebrow">{dict.nav.articles}</span>
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
                    {fm.readTime} {dict.articles.readTime}
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
