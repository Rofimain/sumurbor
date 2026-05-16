"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Newspaper,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/layanan", label: "Layanan", icon: Layers },
  { href: "/admin/proyek", label: "Proyek", icon: Briefcase },
  { href: "/admin/artikel", label: "Artikel", icon: Newspaper },
  { href: "/admin/tim", label: "Tim", icon: Users },
  { href: "/admin/testimoni", label: "Testimoni", icon: MessageSquare },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [brand, setBrand] = useState<{ brandName: string; logo: string }>({
    brandName: "Admin",
    logo: "",
  });

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((s) =>
        setBrand({
          brandName: s.brandName || "Admin",
          logo: s.logo || "",
        }),
      )
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-surface-alt">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-surface-line bg-white px-4 py-6 lg:flex lg:flex-col">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          {brand.logo ? (
            <img
              src={brand.logo}
              alt={brand.brandName}
              className="h-10 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <>
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
              <div className="min-w-0 leading-none">
                <p className="truncate font-heading text-sm font-bold text-ink">
                  {brand.brandName}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Admin Console
                </p>
              </div>
            </>
          )}
        </Link>

        <nav className="mt-8 flex-1 space-y-1 text-sm">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-muted hover:bg-surface-alt hover:text-ink",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-brand-600" : "text-slate-400",
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{label}</span>
                {active && (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-brand-500"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-surface-line pt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
          >
            <ExternalLink
              className="h-4 w-4 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span>Buka Website</span>
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-surface-line bg-white px-4 lg:hidden">
          <Link
            href="/admin"
            className="flex items-center gap-2 truncate font-heading text-sm font-bold text-ink"
          >
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.brandName}
                className="h-8 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <span className="truncate">{brand.brandName}</span>
            )}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-surface-line bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Keluar
          </button>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
