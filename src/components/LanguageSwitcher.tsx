import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localeShort, locales } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  pathSegments?: string[];
}

export function LanguageSwitcher({
  currentLocale,
  pathSegments = [],
}: LanguageSwitcherProps) {
  const tail = pathSegments.length ? "/" + pathSegments.join("/") : "";
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-full border border-slate-200 bg-white p-0.5 text-xs font-medium"
    >
      {locales.map((l) => {
        const active = l === currentLocale;
        return (
          <Link
            key={l}
            href={`/${l}${tail}`}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className={
              "rounded-full px-2.5 py-1 transition-colors " +
              (active
                ? "bg-brand-500 text-white"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            {localeShort[l]}
          </Link>
        );
      })}
    </div>
  );
}
