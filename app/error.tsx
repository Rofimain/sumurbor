"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-white px-4">
      <div className="card-elevated max-w-md p-10 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-600">
          Terjadi kesalahan
        </p>
        <h1 className="mt-3 font-heading text-2xl font-bold text-ink">
          Halaman tidak dapat dimuat
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Silakan coba lagi. Jika masalah berlanjut, hubungi kami lewat halaman
          kontak.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[10px] text-ink-subtle">
            Ref: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-primary h-10 px-5 text-xs"
          >
            Coba lagi
          </button>
          <Link href="/" className="btn-outline h-10 px-5 text-xs">
            Ke beranda
          </Link>
        </div>
      </div>
    </section>
  );
}
