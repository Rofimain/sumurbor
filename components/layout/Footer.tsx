import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface FooterProps {
  settings: {
    brandName: string;
    tagline: string;
    phone: string;
    phoneDisplay: string;
    email: string;
    address: string;
    city: string;
    region?: string;
    postalCode?: string;
    businessHours: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    logo?: string;
    logoLight?: string;
  };
}

const QUICK_LINKS = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/proyek", label: "Proyek" },
  { href: "/artikel", label: "Artikel" },
  { href: "/kontak", label: "Kontak" },
];

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const addressLine = [
    settings.address,
    settings.city,
    settings.region,
    settings.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const socials = [
    { url: settings.instagram, Icon: Instagram, label: "Instagram" },
    { url: settings.facebook, Icon: Facebook, label: "Facebook" },
    { url: settings.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { url: settings.youtube, Icon: Youtube, label: "YouTube" },
  ].filter((s) => !!s.url);

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgb(var(--brand-500)) 50%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(at 15% 0%, rgb(var(--brand-500)) 0px, transparent 50%), radial-gradient(at 85% 100%, rgb(var(--brand-400)) 0px, transparent 50%)",
        }}
      />

      <div className="container-page relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="space-y-5 lg:col-span-4">
          {(() => {
            const footerLogo = settings.logoLight || settings.logo;
            return (
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 font-heading"
                aria-label={settings.brandName}
              >
                {footerLogo ? (
                  <img
                    src={footerLogo}
                    alt={settings.brandName}
                    className="h-11 w-11 shrink-0 rounded-xl bg-white/5 object-contain p-1"
                  />
                ) : (
                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-brand-glow"
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
                )}
                <span className="flex flex-col leading-none">
                  <span className="text-base font-bold text-white sm:text-lg">
                    {settings.brandName}
                  </span>
                  <span className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                    Drilling Specialist
                  </span>
                </span>
              </Link>
            );
          })()}
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">
            {settings.tagline}
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Minta Penawaran
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Tautan
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  className="text-slate-400 transition-colors hover:text-white"
                  href={l.href}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Kontak
          </h3>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li className="flex gap-2.5">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <span className="text-slate-400">{addressLine}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <a
                href={`tel:${settings.phone}`}
                className="text-slate-400 transition-colors hover:text-white"
              >
                {settings.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <a
                href={`mailto:${settings.email}`}
                className="text-slate-400 transition-colors hover:text-white"
              >
                {settings.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
                aria-hidden="true"
              />
              <span className="text-slate-400">{settings.businessHours}</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
            Ikuti Kami
          </h3>
          {socials.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2.5">
              {socials.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-brand-400/40 hover:bg-brand-500/15 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">—</p>
          )}
          <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-400">
              Telepon Kami
            </p>
            <a
              href={`tel:${settings.phone}`}
              className="mt-1 block font-heading text-lg font-bold tracking-tight text-white hover:text-brand-300"
            >
              {settings.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="container-page py-6 text-center text-xs text-slate-500">
          <p>
            &copy; {year} {settings.brandName}. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
