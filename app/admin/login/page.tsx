"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Login gagal");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-surface-alt p-6">
      <div className="absolute inset-0 bg-mesh" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-ink-subtle transition-colors hover:text-ink"
        >
          ← Kembali ke website
        </Link>
        <div className="card-elevated relative overflow-hidden p-8">
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-brand-100 opacity-60 blur-3xl"
          />
          <div className="relative">
            <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-brand-glow"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(var(--brand-400)) 0%, rgb(var(--brand-600)) 100%)",
              }}
            >
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight text-ink">
              Admin Sign-in
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Masuk untuk mengelola konten website.
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-4">
              <label className="block">
                <span className="field-label">Email</span>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    className="field pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>
              <label className="block">
                <span className="field-label">Password</span>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    className="field pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary h-12 w-full text-sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                )}
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
