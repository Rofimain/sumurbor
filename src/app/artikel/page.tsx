import type { Metadata } from "next";
import { t } from "@/lib/strings";
import { getArticles, getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ArticleCard } from "@/components/ArticleCard";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: t.articles.heading,
    description: t.articles.subheading,
    pathSegments: ["artikel"],
  });
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.articles, url: `${baseUrl}/artikel` },
        ])}
      />
      <PageHero
        eyebrow={t.nav.articles}
        title={t.articles.heading}
        subtitle={t.articles.subheading}
        breadcrumb={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.articles },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container">
          {articles.length === 0 ? (
            <div className="card-elevated mx-auto max-w-md p-10 text-center">
              <p className="font-display text-lg font-semibold text-slate-900">
                Belum ada artikel
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Artikel akan tampil di sini setelah dipublikasikan dari admin.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.frontmatter.slug} article={a.frontmatter} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
