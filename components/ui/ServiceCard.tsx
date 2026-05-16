import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "./ServiceIcon";
import type { ServiceRow } from "@/lib/supabase";

export function ServiceCard({ service }: { service: ServiceRow }) {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="card-elevated card-hover group relative flex h-full flex-col overflow-hidden p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-100 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />

      <div
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-brand-glow"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
        }}
      >
        <ServiceIcon name={service.icon} className="h-[22px] w-[22px]" />
      </div>

      <h3 className="relative mt-5 font-heading text-lg font-semibold text-ink group-hover:text-brand-700">
        {service.title}
      </h3>
      {service.subtitle && (
        <p className="relative mt-1 text-xs font-mono uppercase tracking-wider text-brand-600">
          {service.subtitle}
        </p>
      )}
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
        {service.description}
      </p>

      <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
        <span>Lihat detail</span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-mute text-ink transition-all duration-300 group-hover:bg-ink group-hover:text-white">
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12"
            aria-hidden="true"
          />
        </span>
      </span>
    </Link>
  );
}
