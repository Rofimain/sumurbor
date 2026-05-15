import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";

export function localePath(locale: Locale, segments: string[] = []): string {
  const parts = [locale, ...segments.filter(Boolean)];
  return "/" + parts.join("/");
}

export function alternateUrls(siteUrl: string, segments: string[]): {
  canonical: string;
  languages: Record<string, string>;
} {
  const stripTrailing = siteUrl.replace(/\/$/, "");
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${stripTrailing}${localePath(l, segments)}`;
  }
  languages["x-default"] = `${stripTrailing}${localePath(defaultLocale, segments)}`;
  return {
    canonical: languages[defaultLocale],
    languages,
  };
}

export function externalWhatsappUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleaned}${text}`;
}
