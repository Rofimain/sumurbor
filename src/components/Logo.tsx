import Link from "next/link";
import type { SiteSettings } from "@/lib/content";

interface LogoProps {
  settings: SiteSettings;
  variant?: "default" | "light";
}

export function Logo({ settings, variant = "default" }: LogoProps) {
  const src = variant === "light" ? settings.logoLight || settings.logo : settings.logo;
  const useImage = src && src.trim().length > 0;
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5 font-display font-semibold tracking-tight"
      aria-label={settings.brandName}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={settings.brandName} className="h-9 w-auto" />
      ) : (
        <span
          className="relative grid h-10 w-10 place-items-center rounded-xl text-white shadow-brand-glow transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
              d="M12 2 14 8h6l-5 4 2 8-7-4-7 4 2-8-5-4h6z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span className={`text-base sm:text-lg ${isLight ? "text-white" : "text-slate-900"}`}>
          {settings.brandName}
        </span>
        <span
          className={`mt-1 text-[10px] font-medium uppercase tracking-[0.18em] ${
            isLight ? "text-white/60" : "text-slate-400"
          }`}
        >
          {settings.brandTagline?.split(" ").slice(0, 3).join(" ") || "Drilling"}
        </span>
      </span>
    </Link>
  );
}
