import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { t } from "@/lib/strings";
import type { SiteSettings } from "@/lib/content";
import { Logo } from "./Logo";

interface HeaderProps {
  settings: SiteSettings;
}

export function Header({ settings }: HeaderProps) {
  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/tentang", label: t.nav.about },
    { href: "/layanan", label: t.nav.services },
    { href: "/proyek", label: t.nav.projects },
    { href: "/artikel", label: t.nav.articles },
    { href: "/kontak", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Logo settings={settings} />

        <nav className="hidden items-center gap-8 text-sm lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${settings.phone}`}
            className="hidden items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 xl:inline-flex"
          >
            <Phone className="h-4 w-4 text-brand-500" aria-hidden="true" />
            <span>{settings.phoneDisplay}</span>
          </a>
          <Link
            href="/kontak"
            className="btn-primary hidden h-10 px-4 text-xs sm:inline-flex"
          >
            {t.cta.quote}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <nav className="border-t border-slate-200/60 bg-white/50 backdrop-blur lg:hidden">
        <div className="container relative -mx-1 flex gap-1 overflow-x-auto py-2.5 text-xs font-semibold text-slate-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 transition-colors hover:bg-slate-900 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
