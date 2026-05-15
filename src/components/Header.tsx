import Link from "next/link";
import { Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import type { SiteSettings } from "@/lib/content";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  locale: Locale;
  settings: SiteSettings;
  pathSegments?: string[];
}

export function Header({ locale, settings, pathSegments = [] }: HeaderProps) {
  const dict = getDictionary(locale);
  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/tentang`, label: dict.nav.about },
    { href: `/${locale}/layanan`, label: dict.nav.services },
    { href: `/${locale}/proyek`, label: dict.nav.projects },
    { href: `/${locale}/artikel`, label: dict.nav.articles },
    { href: `/${locale}/kontak`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo settings={settings} locale={locale} />

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${settings.phone}`}
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-brand-600 md:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>{settings.phoneDisplay}</span>
          </a>
          <LanguageSwitcher currentLocale={locale} pathSegments={pathSegments} />
        </div>
      </div>

      <nav className="border-t border-slate-200 bg-white lg:hidden">
        <div className="container -mx-1 flex gap-0.5 overflow-x-auto py-2 text-xs font-medium text-slate-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-2.5 py-1.5 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
