import type { Metadata } from "next";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getArticles } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { JsonLd, breadcrumbSchema } from "@/components/ui/JsonLd";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Artikel",
  description:
    "Panduan teknis, tips memilih jasa pondasi, dan update industri sumur bor & bor pile.",
  pathSegments: ["artikel"],
});

export default async function ArticlesPage() {
  const articles = await getArticles({ published: true });
  const base = siteUrl();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: `${base}/` },
          { name: "Artikel", url: `${base}/artikel` },
        ])}
      />
      <PageHero
        eyebrow="Insight"
        title="Artikel & Edukasi"
        subtitle="Panduan teknis dan tips memilih jasa pondasi dari tim engineer kami."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Artikel" },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          {articles.length === 0 ? (
            <div className="card-elevated mx-auto max-w-md p-10 text-center">
              <p className="font-heading text-lg font-semibold text-ink">
                Belum ada artikel
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Artikel akan tampil di sini setelah dipublikasikan dari admin panel.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
