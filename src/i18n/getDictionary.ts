import "server-only";
import type { Locale } from "./config";

import id from "./dictionaries/id.json";
import en from "./dictionaries/en.json";

const dictionaries = { id, en } as const;

export type Dictionary = typeof id;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
