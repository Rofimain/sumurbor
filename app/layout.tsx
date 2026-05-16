import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Space_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { siteConfig } from "@/data";
import { siteUrl } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { JsonLd, organizationSchema } from "@/components/ui/JsonLd";
import { getSettings } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  const db: Record<string, string> = await getSettings().catch(
    () => ({}) as Record<string, string>,
  );
  const brandName = db.site_name || siteConfig.brandName;
  const tagline = db.tagline || siteConfig.tagline;
  const description = db.description || siteConfig.description;
  const favicon = db.favicon || siteConfig.favicon || "/favicon.ico";
  const ogImage = db.og_image || siteConfig.ogImage;

  return {
    metadataBase: siteUrl() ? new URL(siteUrl()) : undefined,
    title: {
      default: `${brandName} — ${tagline}`,
      template: `%s · ${brandName}`,
    },
    description,
    keywords: [
      "sumur bor",
      "bored pile",
      "pondasi",
      "kontraktor sumur bor",
      "kontraktor pondasi",
      "strauss pile",
      "geoteknik",
      "Jakarta",
      brandName,
    ],
    authors: [{ name: brandName }],
    creator: brandName,
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: siteConfig.siteUrl,
      title: `${brandName} — ${tagline}`,
      description,
      siteName: brandName,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: brandName,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: { index: true, follow: true },
    icons: { icon: favicon, apple: favicon },
  };
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  // Merge DB settings on top of static fallback (best-effort)
  const dbSettings: Record<string, string> = await getSettings().catch(
    () => ({}) as Record<string, string>,
  );

  const settings = {
    brandName: dbSettings.site_name || siteConfig.brandName,
    tagline: dbSettings.tagline || siteConfig.tagline,
    description: dbSettings.description || siteConfig.description,
    logo: dbSettings.logo || siteConfig.logo || "",
    logoLight: dbSettings.logo_light || siteConfig.logoLight || "",
    phone: dbSettings.phone || siteConfig.phone,
    phoneDisplay: dbSettings.phone_display || siteConfig.phoneDisplay,
    whatsapp: dbSettings.whatsapp || siteConfig.whatsapp,
    email: dbSettings.email || siteConfig.email,
    address: dbSettings.address || siteConfig.address.street,
    city: dbSettings.city || siteConfig.address.city,
    region: dbSettings.region || siteConfig.address.region,
    postalCode: dbSettings.postal_code || siteConfig.address.postalCode,
    country: dbSettings.country || siteConfig.address.country,
    businessHours: dbSettings.business_hours || siteConfig.businessHours,
    googleMapsUrl: dbSettings.google_maps_url || siteConfig.googleMapsUrl,
    instagram: dbSettings.instagram || siteConfig.social.instagram,
    facebook: dbSettings.facebook || siteConfig.social.facebook,
    linkedin: dbSettings.linkedin || siteConfig.social.linkedin,
    youtube: dbSettings.youtube || siteConfig.social.youtube,
    tiktok: dbSettings.tiktok || siteConfig.social.tiktok,
    foundingYear: dbSettings.founding_year || String(siteConfig.foundingYear),
  };

  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body>
        {!isAdmin && <JsonLd data={organizationSchema(settings)} />}
        {!isAdmin && <Navbar settings={settings} />}
        <main className={isAdmin ? "" : "min-h-screen"}>{children}</main>
        {!isAdmin && <Footer settings={settings} />}
        {!isAdmin && settings.whatsapp && (
          <FloatingWhatsApp whatsapp={settings.whatsapp} />
        )}
      </body>
    </html>
  );
}
