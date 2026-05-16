import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
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
  description: settings.brandTagline.id,
  icons: {
    icon: settings.favicon || "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-brand-200/60 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}
