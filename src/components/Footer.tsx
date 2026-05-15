import Link from "next/link";
import { Instagram, Facebook, Linkedin, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import type { SiteSettings } from "@/lib/content";

interface FooterProps {
  locale: Locale;
  settings: SiteSettings;
}

export function Footer({ locale, settings }: FooterProps) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  const links = [
    { href: `/${locale}/tentang`, label: dict.nav.about },
    { href: `/${locale}/layanan`, label: dict.nav.services },
    { href: `/${locale}/proyek`, label: dict.nav.projects },
    { href: `/${locale}/artikel`, label: dict.nav.articles },
    { href: `/${locale}/kontak`, label: dict.nav.contact },
  ];

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

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-sm text-slate-700">
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="text-base font-semibold text-slate-900">
            {settings.brandName}
          </div>
          <p className="text-slate-600">
            {settings.brandTagline[locale]}
          </p>
          <p className="text-slate-500">{dict.footer.tagline}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            {dict.footer.quickLinks}
          </h3>
          <ul className="space-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-brand-600" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            {dict.footer.contactUs}
          </h3>
          <ul className="space-y-2.5">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <span>{addressLine}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <a href={`tel:${settings.phone}`} className="hover:text-brand-600">
                {settings.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <a href={`mailto:${settings.email}`} className="hover:text-brand-600">
                {settings.email}
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
              <span>{settings.businessHours[locale]}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900">
            {dict.footer.followUs}
          </h3>
          <div className="flex flex-wrap gap-2">
            {settings.social.instagram && (
              <a
                href={settings.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-brand-600"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.social.facebook && (
              <a
                href={settings.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-brand-600"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.social.linkedin && (
              <a
                href={settings.social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-brand-600"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {settings.social.youtube && (
              <a
                href={settings.social.youtube}
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-brand-600"
              >
                <Youtube className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {year} {settings.brandName}. {dict.footer.rights}
          </p>
          <p>Built with Next.js · Hosted on Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}
