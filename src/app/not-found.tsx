import Link from "next/link";
import { defaultLocale } from "@/i18n/config";
import { getSiteSettings } from "@/lib/content";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const settings = getSiteSettings();
  return (
    <main className="grid min-h-[60vh] place-items-center bg-white p-6">
      <div className="text-center">
        <p className="text-sm font-medium text-brand-600">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-slate-600">
          The page you are looking for is unavailable or has been moved.
        </p>
        <Link href={`/${defaultLocale}`} className="btn-primary mt-6">
          Back to {settings.brandName}
        </Link>
      </div>
    </main>
  );
}
