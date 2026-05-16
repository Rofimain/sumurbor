import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteSettings } from "@/lib/content";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const settings = getSiteSettings();
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-white p-6">
      <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative text-center">
        <p className="font-display text-[10rem] font-bold leading-none tracking-tight text-gradient-brand sm:text-[14rem]">
          404
        </p>
        <h1 className="-mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-slate-600">
          Halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <Link href="/" className="btn-primary mt-8 h-12 px-6 text-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke {settings.brandName}
        </Link>
      </div>
    </main>
  );
}
