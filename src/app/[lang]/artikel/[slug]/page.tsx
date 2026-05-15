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
        <header className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white py-12 lg:py-16">
          <div className="container max-w-3xl">
            <Breadcrumb
              items={[
                { label: dict.nav.home, href: `/${locale}` },
                { label: dict.nav.articles, href: `/${locale}/artikel` },
                { label: fm.title },
              ]}
            />
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {fm.title}
            </h1>
            <p className="mt-3 text-lg text-slate-600">{fm.excerpt}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {formatted}
              </span>
              {fm.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" aria-hidden="true" />
                  {fm.author}
                </span>
              )}
              {fm.readTime && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  {fm.readTime} {dict.articles.readTime}
                </span>
              )}
            </div>
          </div>
        </header>

        {fm.coverImage && (
          <div className="bg-white">
            <div className="container max-w-4xl py-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fm.coverImage}
                alt={fm.title}
                className="aspect-[16/9] w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        )}

        <section className="bg-white pb-16">
          <div
            className="container-prose prose-content"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        </section>
      </article>
    </>
  );
}
