"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  CheckCircle2,
  ExternalLink,
  Globe,
  FileText,
  Bot,
  Link2,
  BarChart3,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { normalizeGa4Id, normalizeGtmId } from "@/lib/analytics";
import { SEO_SETTING_KEYS } from "@/lib/seo-settings";

type SeoStats = {
  urlCount: number;
  sitemapEnabled: boolean;
  canonicalBase: string;
  sitemapUrl: string | null;
  robotsUrl: string | null;
  includes: {
    services: boolean;
    projects: boolean;
    articles: boolean;
    extraUrls: number;
  };
};

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-surface-line bg-white p-4 transition-colors hover:bg-surface-alt/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-500"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-ink-muted">{description}</span>
        )}
      </span>
    </label>
  );
}

export default function AdminSeoPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<SeoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [settingsRes, statsRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/seo/stats"),
      ]);
      const settings = (await settingsRes.json()) || {};
      const merged = { ...SEO_SETTING_KEYS, ...settings };
      setData(merged);
      if (statsRes.ok) setStats(await statsRes.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      const statsRes = await fetch("/api/seo/stats");
      if (statsRes.ok) setStats(await statsRes.json());
    }
  }

  function set(key: string, value: string) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function bool(key: string) {
    return data[key] === "true";
  }

  function setBool(key: string, value: boolean) {
    set(key, value ? "true" : "false");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-subtle">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Memuat pengaturan SEO...
      </div>
    );
  }

  const previewBase =
    data.canonical_url?.trim() || stats?.canonicalBase || "https://domain-anda.com";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="SEO & Sitemap"
        description="Kelola sitemap.xml, robots.txt, canonical URL, dan verifikasi search console — seperti plugin SEO di WordPress."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Tersimpan — sitemap & robots diperbarui otomatis
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-primary h-11 px-5 text-xs"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {saving ? "Menyimpan..." : "Simpan SEO"}
            </button>
          </div>
        }
      />

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="URL di sitemap" value={String(stats.urlCount)} />
          <StatCard
            label="Sitemap"
            value={stats.sitemapEnabled ? "Aktif" : "Nonaktif"}
          />
          <StatCard label="Layanan" value={stats.includes.services ? "Ya" : "Tidak"} />
          <StatCard label="Artikel publish" value={stats.includes.articles ? "Ya" : "Tidak"} />
        </div>
      )}

      <section className="card-elevated p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
              <Link2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Canonical URL
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              URL utama website untuk canonical tag & Open Graph. Kosongkan untuk
              pakai <code className="text-xs">NEXT_PUBLIC_SITE_URL</code> dari
              Cloudflare.
            </p>
          </div>
        </header>
        <label className="mt-5 block text-sm">
          <span className="field-label">Canonical base URL</span>
          <input
            className="field font-mono text-xs"
            value={data.canonical_url || ""}
            onChange={(e) => set("canonical_url", e.target.value)}
            placeholder="https://sumurbor.rofimain.com"
          />
          <p className="mt-1.5 text-xs text-ink-subtle">
            Contoh halaman:{" "}
            <span className="font-mono">{previewBase}/layanan/bored-pile</span>
          </p>
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bool("seo_global_noindex")}
            onChange={(e) => setBool("seo_global_noindex", e.target.checked)}
            className="h-4 w-4 rounded border-surface-line text-brand-600"
          />
          <span className="text-ink">
            Sembunyikan seluruh situs dari Google (noindex global) — hanya untuk
            staging
          </span>
        </label>
      </section>

      <section className="card-elevated p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <SeoSitemapTitle />
          {stats?.sitemapUrl && (
            <a
              href={stats.sitemapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline h-9 gap-2 px-4 text-xs"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Buka sitemap.xml
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </header>
        <div className="mt-5 space-y-4">
          <Toggle
            checked={bool("sitemap_enabled")}
            onChange={(v) => setBool("sitemap_enabled", v)}
            label="Aktifkan sitemap.xml"
            description="Otomatis daftarkan halaman statis + konten dari database."
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Toggle
              checked={bool("sitemap_include_services")}
              onChange={(v) => setBool("sitemap_include_services", v)}
              label="Sertakan layanan"
            />
            <Toggle
              checked={bool("sitemap_include_projects")}
              onChange={(v) => setBool("sitemap_include_projects", v)}
              label="Sertakan proyek"
            />
            <Toggle
              checked={bool("sitemap_include_articles")}
              onChange={(v) => setBool("sitemap_include_articles", v)}
              label="Sertakan artikel (publish)"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="field-label">Priority beranda (0–1)</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                className="field"
                value={data.sitemap_priority_home || "1"}
                onChange={(e) => set("sitemap_priority_home", e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="field-label">Change frequency beranda</span>
              <select
                className="field"
                value={data.sitemap_changefreq_home || "weekly"}
                onChange={(e) => set("sitemap_changefreq_home", e.target.value)}
              >
                {["always", "hourly", "daily", "weekly", "monthly", "yearly"].map(
                  (f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
          <label className="block text-sm">
            <span className="field-label">URL tambahan (satu per baris)</span>
            <textarea
              rows={4}
              className="field resize-y font-mono text-xs"
              value={data.sitemap_extra_urls || ""}
              onChange={(e) => set("sitemap_extra_urls", e.target.value)}
              placeholder={"/halaman-khusus\nhttps://sumurbor.rofimain.com/landing"}
            />
            <p className="mt-1.5 text-xs text-ink-subtle">
              Path relatif atau URL lengkap. Berguna untuk halaman landing di luar
              CMS.
            </p>
          </label>
        </div>
      </section>

      <section className="card-elevated p-6">
        <header>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
            <Bot className="h-4 w-4 text-brand-600" aria-hidden="true" />
            robots.txt
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Aturan default: blokir <code className="text-xs">/admin</code>,{" "}
            <code className="text-xs">/api</code>,{" "}
            <code className="text-xs">/_next</code>. Tambah path lain di bawah.
          </p>
        </header>
        <label className="mt-5 block text-sm">
          <span className="field-label">Disallow tambahan (satu path per baris)</span>
          <textarea
            rows={4}
            className="field resize-y font-mono text-xs"
            value={data.robots_disallow_extra || ""}
            onChange={(e) => set("robots_disallow_extra", e.target.value)}
            placeholder="/private&#10;/draft"
          />
        </label>
        {stats?.robotsUrl && (
          <a
            href={stats.robotsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-600"
          >
            Lihat robots.txt live
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
      </section>

      <section className="card-elevated p-6">
        <header>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
            <BarChart3 className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Google Analytics & Tag Manager
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Lacak pengunjung website. Script hanya dimuat di halaman publik (bukan
            admin). Data juga membantu evaluasi traffic dari mesin pencari & AI.
          </p>
        </header>
        <div className="mt-5 space-y-4">
          <Toggle
            checked={bool("analytics_enabled")}
            onChange={(v) => setBool("analytics_enabled", v)}
            label="Aktifkan tracking analytics"
            description="Matikan sementara tanpa menghapus ID yang sudah disimpan."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="field-label">Google Analytics 4 (Measurement ID)</span>
              <input
                className="field font-mono text-xs"
                value={data.google_analytics_id || ""}
                onChange={(e) => set("google_analytics_id", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              {data.google_analytics_id && (
                <p className="mt-1.5 text-xs text-ink-subtle">
                  Terdeteksi:{" "}
                  <span className="font-mono font-semibold text-brand-700">
                    {normalizeGa4Id(data.google_analytics_id) || "format tidak valid"}
                  </span>
                </p>
              )}
              <p className="mt-1 text-xs text-ink-subtle">
                Ambil dari Google Analytics → Admin → Data Streams → Measurement ID.
              </p>
            </label>
            <label className="block text-sm">
              <span className="field-label">Google Tag Manager (opsional)</span>
              <input
                className="field font-mono text-xs"
                value={data.google_tag_manager_id || ""}
                onChange={(e) => set("google_tag_manager_id", e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
              {data.google_tag_manager_id && (
                <p className="mt-1.5 text-xs text-ink-subtle">
                  Terdeteksi:{" "}
                  <span className="font-mono font-semibold text-brand-700">
                    {normalizeGtmId(data.google_tag_manager_id) || "format tidak valid"}
                  </span>
                </p>
              )}
              <p className="mt-1 text-xs text-ink-subtle">
                Isi hanya jika pakai GTM. Bisa dikosongkan jika cukup GA4 saja.
              </p>
            </label>
          </div>
        </div>
      </section>

      <section className="card-elevated p-6">
        <header>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
            <Globe className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Search Console & Webmaster
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Verifikasi kepemilikan domain (meta tag) — Google & Bing.
          </p>
        </header>
        <SeoVerificationFields data={data} set={set} />
      </section>

      <section className="rounded-2xl border border-brand-200/60 bg-brand-50/40 p-5 text-sm text-ink-muted">
        <p className="font-semibold text-ink">Cara pakai (mirip plugin WP)</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            Setelah simpan, submit{" "}
            <strong>{stats?.sitemapUrl || "/sitemap.xml"}</strong> ke Google Search
            Console.
          </li>
          <li>
            Konten baru (artikel/layanan/proyek) otomatis masuk sitemap — tidak perlu
            generate manual.
          </li>
          <li>
            Gambar di isi artikel: pakai tombol &quot;Tambah gambar ke isi konten&quot;
            di editor Artikel + isi alt text.
          </li>
          <li>
            Google Analytics: isi Measurement ID (G-...) di atas, simpan, lalu cek
            Realtime di dashboard GA dalam 1–2 menit.
          </li>
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-elevated p-4">
      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-600">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function SeoSitemapTitle() {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
        <FileText className="h-4 w-4 text-brand-600" aria-hidden="true" />
        Sitemap XML
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Dibuat otomatis dari konten CMS + pengaturan di bawah. Diperbarui setiap
        ~60 detik (ISR).
      </p>
    </div>
  );
}

function SeoVerificationFields({
  data,
  set,
}: {
  data: Record<string, string>;
  set: (key: string, value: string) => void;
}) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="field-label">Google Search Console</span>
        <input
          className="field font-mono text-xs"
          value={data.google_site_verification || ""}
          onChange={(e) => set("google_site_verification", e.target.value)}
          placeholder="kode verifikasi meta"
        />
      </label>
      <label className="block text-sm">
        <span className="field-label">Bing Webmaster</span>
        <input
          className="field font-mono text-xs"
          value={data.bing_site_verification || ""}
          onChange={(e) => set("bing_site_verification", e.target.value)}
          placeholder="msvalidate.01"
        />
      </label>
    </div>
  );
}
