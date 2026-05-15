import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { SiteSettings } from "@/lib/content";

interface LogoProps {
  settings: SiteSettings;
  locale: Locale;
  variant?: "default" | "light";
}

export function Logo({ settings, locale, variant = "default" }: LogoProps) {
  const src = variant === "light" ? settings.logoLight || settings.logo : settings.logo;
  const useImage = src && src.trim().length > 0;

  return (
    <Link
      href={`/${locale}`}
      className="inline-flex items-center gap-2.5 font-display font-semibold tracking-tight text-slate-900"
      aria-label={settings.brandName}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={settings.brandName} className="h-8 w-auto" />
      ) : (
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M12 2l3 6 6 .8-4.5 4.2 1 6.5L12 16.8 6.5 19.5l1-6.5L3 8.8 9 8l3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
      <span className="text-base sm:text-lg">{settings.brandName}</span>
    </Link>
  );
}
