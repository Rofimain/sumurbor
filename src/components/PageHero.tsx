import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  children?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100">
      <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container relative py-14 sm:py-20">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        {eyebrow && <span className="mt-6 inline-block eyebrow">{eyebrow}</span>}
        <h1
          className={`${
            eyebrow ? "mt-4" : breadcrumb ? "mt-6" : ""
          } max-w-3xl text-balance font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
