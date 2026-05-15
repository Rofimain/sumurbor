import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandStyle } from "@/components/BrandStyle";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { HtmlLang } from "@/components/HtmlLang";
import { JsonLd, localBusinessSchema } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const settings = getSiteSettings();
  const locale = lang as Locale;

  return (
    <>
      <HtmlLang lang={locale} />
      <BrandStyle settings={settings} />
      <JsonLd data={localBusinessSchema(settings, locale)} />
      <div className="flex min-h-screen flex-col">
        <Header locale={locale} settings={settings} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} settings={settings} />
      </div>
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
