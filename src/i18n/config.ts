export const locales = ["id", "en"] as const;
export const defaultLocale = "id" as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};
