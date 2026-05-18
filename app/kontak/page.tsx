import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getCanonicalBase, getSeoConfig } from "@/lib/seo-settings";
import { getSettings } from "@/lib/db";
import { siteConfig } from "@/data";
import { whatsappUrl } from "@/lib/utils";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/ui/ContactForm";
import { JsonLd, breadcrumbSchema } from "@/components/ui/JsonLd";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [canonicalBase, seo] = await Promise.all([
    getCanonicalBase(),
    getSeoConfig(),
  ]);
  return buildMetadata({
    title: "Kontak",
    description:
      "Konsultasi awal gratis untuk proyek pondasi bor pile, sumur bor, atau strauss pile.",
    pathSegments: ["kontak"],
    canonicalBase,
    noindex: seo.globalNoindex,
  });
}

export default async function ContactPage() {
  const dbSettings = await getSettings();
  const base = await getCanonicalBase();

  const settings = {
    brandName: dbSettings.site_name || siteConfig.brandName,
    phone: dbSettings.phone || siteConfig.phone,
    phoneDisplay: dbSettings.phone_display || siteConfig.phoneDisplay,
    whatsapp: dbSettings.whatsapp || siteConfig.whatsapp,
    email: dbSettings.email || siteConfig.email,
    address: dbSettings.address || siteConfig.address.street,
    city: dbSettings.city || siteConfig.address.city,
    region: dbSettings.region || siteConfig.address.region,
    postalCode: dbSettings.postal_code || siteConfig.address.postalCode,
    businessHours: dbSettings.business_hours || siteConfig.businessHours,
    googleMapsUrl: dbSettings.google_maps_url || siteConfig.googleMapsUrl,
  };

  const addressLine = [
    settings.address,
    settings.city,
    settings.region,
    settings.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", url: `${base}/` },
          { name: "Kontak", url: `${base}/kontak` },
        ])}
      />

      <PageHero
        eyebrow="Kontak"
        title="Hubungi Kami"
        subtitle="Konsultasi awal gratis. Kami akan respons dalam 1×24 jam kerja."
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Kontak" },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          <aside className="space-y-4 lg:col-span-2">
            <InfoCard
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              title="Alamat"
            >
              <p>{addressLine}</p>
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
                >
                  Buka di Google Maps →
                </a>
              )}
            </InfoCard>
            <InfoCard
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              title="Telepon"
            >
              <a
                href={`tel:${settings.phone}`}
                className="font-medium hover:text-brand-700"
              >
                {settings.phoneDisplay}
              </a>
            </InfoCard>
            <InfoCard
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              title="Email"
            >
              <a
                href={`mailto:${settings.email}`}
                className="font-medium hover:text-brand-700"
              >
                {settings.email}
              </a>
            </InfoCard>
            <InfoCard
              icon={<Clock className="h-5 w-5" aria-hidden="true" />}
              title="Jam Operasional"
            >
              {settings.businessHours}
            </InfoCard>
            {settings.whatsapp && (
              <a
                href={whatsappUrl(
                  settings.whatsapp,
                  `Halo ${settings.brandName}, saya mau konsultasi proyek.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat WhatsApp
              </a>
            )}
          </aside>

          <div className="lg:col-span-3">
            <div className="card-elevated relative overflow-hidden p-6 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-100 opacity-50 blur-3xl"
              />
              <div className="relative">
                <ContactForm
                  accessKey={accessKey}
                  brandName={settings.brandName}
                  whatsapp={settings.whatsapp}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card-elevated flex gap-3.5 p-5">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-brand-glow"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
        }}
      >
        {icon}
      </span>
      <div className="min-w-0 text-sm text-ink-soft">
        <p className="font-heading font-semibold text-ink">{title}</p>
        <div className="mt-1 break-words text-ink-muted">{children}</div>
      </div>
    </div>
  );
}
