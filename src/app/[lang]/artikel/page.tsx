import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getArticles, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: dict.articles.heading,
    description: dict.articles.subheading,
    pathSegments: ["artikel"],
  });
}

export default async function ArticlesPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const articles = await getArticles(locale);
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.articles, url: `${baseUrl}/${locale}/artikel` },
        ])}
      />
      <PageHero
        eyebrow={dict.nav.articles}
        title={dict.articles.heading}
        subtitle={dict.articles.subheading}
        breadcrumb={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.articles },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard
                key={a.frontmatter.slug}
                locale={locale}
                article={a.frontmatter}
                dict={dict}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
