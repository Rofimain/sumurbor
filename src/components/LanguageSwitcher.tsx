import Link from "next/link";
import { Globe } from "lucide-react";
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
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 p-1 text-xs font-semibold shadow-soft-sm backdrop-blur"
    >
      <Globe className="ml-1.5 h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
      {locales.map((l) => {
        const active = l === currentLocale;
        return (
          <Link
            key={l}
            href={`/${l}${tail}`}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className={
              "rounded-full px-2.5 py-1 transition-all " +
              (active
                ? "bg-slate-900 text-white shadow-soft-sm"
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
