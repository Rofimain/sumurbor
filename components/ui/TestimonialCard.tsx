import { Star, Quote } from "lucide-react";
import type { TestimonialRow } from "@/lib/supabase";

export function TestimonialCard({ t }: { t: TestimonialRow }) {
  return (
    <article className="card-elevated relative h-full overflow-hidden p-7">
      <Quote
        className="absolute -top-2 -right-2 h-24 w-24 text-brand-100"
        aria-hidden="true"
      />
      <div className="relative">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < t.rating ? "fill-brand-500 text-brand-500" : "text-slate-200"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-4 text-pretty text-ink-soft leading-relaxed">
          “{t.content}”
        </p>
        <div className="mt-6 flex items-center gap-3 border-t border-surface-line pt-5">
          {t.image ? (
            <img
              src={t.image}
              alt={t.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div
              className="grid h-11 w-11 place-items-center rounded-full font-heading font-bold text-white"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
              }}
            >
              {t.name.charAt(0)}
            </div>
          )}
          <div className="text-sm">
            <p className="font-semibold text-ink">{t.name}</p>
            <p className="text-xs text-ink-subtle">
              {[t.role, t.company].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
