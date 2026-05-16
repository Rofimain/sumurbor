"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";

interface NavbarProps {
  settings: {
    brandName: string;
    phone: string;
    phoneDisplay: string;
    logo?: string;
  };
}

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/layanan", label: "Layanan" },
  { href: "/proyek", label: "Proyek" },
  { href: "/artikel", label: "Artikel" },
  { href: "/kontak", label: "Kontak" },
];

export function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-line bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 font-heading"
          aria-label={settings.brandName}
        >
          {settings.logo ? (
            <img
              src={settings.logo}
              alt={settings.brandName}
              className="h-11 w-auto max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-12"
            />
          ) : (
            <>
              <span
                className="relative grid h-10 w-10 place-items-center rounded-xl text-white shadow-brand-glow transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2L4 7v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V7l-8-5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7v8M8 11h8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-base font-bold text-ink sm:text-lg">
                  {settings.brandName}
                </span>
                <span className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  Drilling Specialist
                </span>
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-8 text-sm lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${settings.phone}`}
            className="hidden items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink xl:inline-flex"
          >
            <Phone className="h-4 w-4 text-brand-500" aria-hidden="true" />
            <span>{settings.phoneDisplay}</span>
          </a>
          <Link
            href="/kontak"
            className="btn-primary hidden h-10 px-4 text-xs sm:inline-flex"
          >
            Minta Penawaran
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-surface-line bg-white text-ink shadow-soft-xs transition-colors hover:bg-surface-alt lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <nav className="border-t border-surface-line bg-white lg:hidden">
          <div className="container-page py-4">
            <ul className="space-y-1 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    data-active={pathname === item.href}
                    className="block rounded-xl px-4 py-3 font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink data-[active=true]:bg-brand-50 data-[active=true]:text-brand-700"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2 border-t border-surface-line pt-4">
              <a
                href={`tel:${settings.phone}`}
                className="btn-outline h-11 flex-1 text-xs"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Telepon
              </a>
              <Link
                href="/kontak"
                onClick={() => setOpen(false)}
                className="btn-primary h-11 flex-1 text-xs"
              >
                Minta Penawaran
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
