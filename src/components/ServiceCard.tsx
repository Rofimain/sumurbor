import Link from "next/link";
import { ArrowRight, Droplets, Construction, Drill } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { ServiceFrontmatter } from "@/lib/content";

const ICONS = {
  droplets: Droplets,
  construction: Construction,
  drill: Drill,
} as const;

export function ServiceCard({
  locale,
  service,
}: {
  locale: Locale;
  service: ServiceFrontmatter;
}) {
  const Icon = ICONS[(service.icon ?? "droplets") as keyof typeof ICONS] ?? Droplets;
  return (
    <Link
      href={`/${locale}/layanan/${service.slug}`}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-600">{service.excerpt}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700">
        Detail
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
