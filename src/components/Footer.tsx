import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import type { SiteSettings } from "@/lib/content";
import { Logo } from "./Logo";

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

  const socials = [
    { url: settings.social.instagram, Icon: Instagram, label: "Instagram" },
    { url: settings.social.facebook, Icon: Facebook, label: "Facebook" },
    { url: settings.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.social.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => s.url);

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
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* gradient strip */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgb(var(--brand-500)) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(at 15% 0%, rgb(var(--brand-500)) 0px, transparent 50%), radial-gradient(at 85% 100%, rgb(var(--brand-400)) 0px, transparent 50%)",
        }}
      />

      <div className="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="space-y-5 lg:col-span-4">
          <Logo settings={settings} locale={locale} variant="light" />
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            {settings.brandTagline[locale]}
          </p>

          <Link
            href={`/${locale}/kontak`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
          >
            {dict.cta.quote}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
            {dict.footer.quickLinks}
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  className="text-slate-400 transition-colors hover:text-white"
                  href={l.href}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
            {dict.footer.contactUs}
          </h3>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              <span className="text-slate-400">{addressLine}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              <a
                href={`tel:${settings.phone}`}
                className="text-slate-400 transition-colors hover:text-white"
              >
                {settings.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              <a
                href={`mailto:${settings.email}`}
                className="text-slate-400 transition-colors hover:text-white"
              >
                {settings.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              <span className="text-slate-400">{settings.businessHours[locale]}</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
            {dict.footer.followUs}
          </h3>
          {socials.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/15 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">—</p>
          )}

          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
              {dict.cta.callUs}
            </p>
            <a
              href={`tel:${settings.phone}`}
              className="mt-1 block font-display text-lg font-bold tracking-tight text-white hover:text-brand-300"
            >
              {settings.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row">
          <p>
            &copy; {year} {settings.brandName}. {dict.footer.rights}
          </p>
          <p className="text-slate-600">
            Built with Next.js · Hosted on Cloudflare
          </p>
        </div>
      </div>
    </footer>
  );
}
