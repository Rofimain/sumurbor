import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { getSiteSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";
import { ContactForm } from "@/components/ContactForm";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    title: dict.contact.heading,
    description: dict.contact.subheading,
    pathSegments: ["kontak"],
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
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
          { name: dict.nav.home, url: `${baseUrl}/${locale}` },
          { name: dict.nav.contact, url: `${baseUrl}/${locale}/kontak` },
        ])}
      />

      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50 to-white py-12 lg:py-16">
        <div className="container">
          <Breadcrumb
            items={[
              { label: dict.nav.home, href: `/${locale}` },
              { label: dict.nav.contact },
            ]}
          />
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            {dict.contact.heading}
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            {dict.contact.subheading}
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container grid gap-10 lg:grid-cols-5">
          <aside className="space-y-5 lg:col-span-2">
            <InfoCard
              icon={<MapPin className="h-5 w-5" aria-hidden="true" />}
              title={dict.contact.address}
            >
              <p>{addressLine}</p>
              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-medium text-brand-600 hover:underline"
                >
                  Buka di Google Maps
                </a>
              )}
            </InfoCard>
            <InfoCard
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              title={dict.contact.phone}
            >
              <a href={`tel:${settings.phone}`} className="hover:text-brand-600">
                {settings.phoneDisplay}
              </a>
            </InfoCard>
            <InfoCard
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              title={dict.contact.email}
            >
              <a href={`mailto:${settings.email}`} className="hover:text-brand-600">
                {settings.email}
              </a>
            </InfoCard>
            <InfoCard
              icon={<Clock className="h-5 w-5" aria-hidden="true" />}
              title={dict.contact.hours}
            >
              {settings.businessHours[locale]}
            </InfoCard>
          </aside>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <ContactForm
                dict={dict}
                accessKey={accessKey}
                brandName={settings.brandName}
              />
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
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{title}</p>
        <div className="mt-1 text-slate-600">{children}</div>
      </div>
    </div>
  );
}
