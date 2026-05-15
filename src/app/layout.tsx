import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";
import { getSiteSettings } from "@/lib/content";

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
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
