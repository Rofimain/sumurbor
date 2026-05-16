import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { JsonLd, localBusinessSchema } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const settings = getSiteSettings();

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  title: {
    default: settings.brandName,
    template: `%s · ${settings.brandName}`,
  },
  description: settings.brandTagline,
  icons: {
    icon: settings.favicon || "/favicon.ico",
  },
};

function hexToRgbTriplet(hex: string): string | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 3 && clean.length !== 6) return null;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return `${r} ${g} ${b}`;
}

function brandPaletteFromHex(hex: string): string {
  const triplet = hexToRgbTriplet(hex);
  if (!triplet) return "";
  // Generate full 50–900 palette by mixing toward white/black
  const [r, g, b] = triplet.split(" ").map(Number);
  const mix = (channel: number, target: number, t: number) =>
    Math.round(channel + (target - channel) * t);
  const shades: Record<string, [number, number, number]> = {
    50: [mix(r, 255, 0.93), mix(g, 255, 0.93), mix(b, 255, 0.93)],
    100: [mix(r, 255, 0.85), mix(g, 255, 0.85), mix(b, 255, 0.85)],
    200: [mix(r, 255, 0.7), mix(g, 255, 0.7), mix(b, 255, 0.7)],
    300: [mix(r, 255, 0.5), mix(g, 255, 0.5), mix(b, 255, 0.5)],
    400: [mix(r, 255, 0.25), mix(g, 255, 0.25), mix(b, 255, 0.25)],
    500: [r, g, b],
    600: [mix(r, 0, 0.15), mix(g, 0, 0.15), mix(b, 0, 0.15)],
    700: [mix(r, 0, 0.3), mix(g, 0, 0.3), mix(b, 0, 0.3)],
    800: [mix(r, 0, 0.45), mix(g, 0, 0.45), mix(b, 0, 0.45)],
    900: [mix(r, 0, 0.6), mix(g, 0, 0.6), mix(b, 0, 0.6)],
  };
  return Object.entries(shades)
    .map(([k, [r, g, b]]) => `--brand-${k}: ${r} ${g} ${b};`)
    .join(" ");
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const brandCss = settings.primaryColor
    ? brandPaletteFromHex(settings.primaryColor)
    : "";

  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <head>
        {brandCss && (
          <style dangerouslySetInnerHTML={{ __html: `:root{${brandCss}}` }} />
        )}
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-brand-200/60 selection:text-brand-900">
        <JsonLd data={localBusinessSchema(settings)} />
        <div className="flex min-h-screen flex-col">
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </div>
        <FloatingWhatsApp settings={settings} />
      </body>
    </html>
  );
}
