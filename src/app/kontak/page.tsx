import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { t } from "@/lib/strings";
import { getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: t.contact.heading,
    description: t.contact.subheading,
    pathSegments: ["kontak"],
  });
}

export default async function ContactPage() {
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl.replace(/\/$/, "");
  const addr = settings.address;
  const addressLine = [
    addr.street,
    addr.district,
    addr.city,
    addr.region,
    addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, url: `${baseUrl}/` },
          { name: t.nav.contact, url: `${baseUrl}/kontak` },
        ])}
      />

      <PageHero
        eyebrow={t.nav.contact}
        title={t.contact.heading}
        subtitle={t.contact.subheading}
        breadcrumb={[
          { label: t.nav.home, href: "/" },
          { label: t.nav.contact },
        ]}
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-5">
          <aside className="space-y-4 lg:col-span-2">
            <InfoCard
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              title={t.contact.address}
            >
              <p>{addressLine}</p>
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-brand-600 hover:underline"
                >
                  Buka di Google Maps →
                </a>
              )}
            </InfoCard>
            <InfoCard
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              title={t.contact.phone}
            >
              <a
                href={`tel:${settings.phone}`}
                className="font-medium hover:text-brand-600"
              >
                {settings.phoneDisplay}
              </a>
            </InfoCard>
            <InfoCard
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              title={t.contact.email}
            >
              <a
                href={`mailto:${settings.email}`}
                className="font-medium hover:text-brand-600"
              >
                {settings.email}
              </a>
            </InfoCard>
            <InfoCard
              icon={<Clock className="h-5 w-5" aria-hidden="true" />}
              title={t.contact.hours}
            >
              {settings.businessHours}
            </InfoCard>
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
      <div className="min-w-0 text-sm text-slate-700">
        <p className="font-display font-semibold text-slate-900">{title}</p>
        <div className="mt-1 break-words text-slate-600">{children}</div>
      </div>
    </div>
  );
}
