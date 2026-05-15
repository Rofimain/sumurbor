import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { getSiteSettings } from "@/lib/content";

export const metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: `/${defaultLocale}` },
};

export default function RootRedirect() {
  const settings = getSiteSettings();
  const target = `/${defaultLocale}`;
  return (
    <main className="grid min-h-screen place-items-center bg-white p-6">
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
      </noscript>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(target)});`,
        }}
      />
      <div className="text-center">
        <p className="text-sm text-slate-600">
          Redirecting to {settings.brandName}…
        </p>
        <Link
          href={target}
          className="mt-3 inline-block text-brand-600 underline"
        >
          Continue
        </Link>
      </div>
    </main>
  );
}
