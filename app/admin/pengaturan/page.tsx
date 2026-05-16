"use client";
import { useEffect, useState } from "react";
import { Loader2, Save, CheckCircle2, ImageIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUploader } from "@/components/ui/ImageUploader";

const FIELDS: {
  group: string;
  description?: string;
  rows: { key: string; label: string; type?: string; hint?: string }[];
}[] = [
  {
    group: "Brand",
    rows: [
      { key: "site_name", label: "Nama Brand" },
      { key: "tagline", label: "Tagline" },
      { key: "description", label: "Deskripsi", type: "textarea" },
      { key: "founding_year", label: "Tahun berdiri" },
    ],
  },
  {
    group: "Kontak",
    rows: [
      { key: "phone", label: "Telepon (E.164)", hint: "+628123456789" },
      { key: "phone_display", label: "Telepon (tampilan)" },
      { key: "whatsapp", label: "WhatsApp (angka saja)", hint: "6281234567890" },
      { key: "email", label: "Email" },
      { key: "address", label: "Alamat (jalan)" },
      { key: "city", label: "Kota" },
      { key: "region", label: "Provinsi" },
      { key: "postal_code", label: "Kode Pos" },
      { key: "country", label: "Negara" },
      { key: "business_hours", label: "Jam operasional" },
      { key: "google_maps_url", label: "Google Maps URL" },
    ],
  },
  {
    group: "Sosial Media",
    description: "URL lengkap (kosongkan jika tidak punya akun).",
    rows: [
      { key: "instagram", label: "Instagram URL" },
      { key: "facebook", label: "Facebook URL" },
      { key: "linkedin", label: "LinkedIn URL" },
      { key: "youtube", label: "YouTube URL" },
      { key: "tiktok", label: "TikTok URL" },
    ],
  },
];

export default function AdminPengaturan() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      setData((await res.json()) || {});
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
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-subtle">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Memuat...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pengaturan"
        description="Brand, kontak, sosial media, dan info global website."
        action={
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Tersimpan
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
              {saving ? "Menyimpan..." : "Simpan Semua"}
            </button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* ─── Brand Assets ─────────────────────────── */}
        <section className="card-elevated p-6">
          <header>
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-ink">
              <ImageIcon className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Brand Assets
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Logo, favicon, dan gambar default untuk share di sosial media.
            </p>
          </header>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="field-label">Logo Utama</p>
              <p className="mb-2 text-xs text-ink-subtle">
                Tampil di header (sidebar putih). Disarankan PNG transparan,
                rasio 1:1 atau landscape (≥256px).
              </p>
              <ImageUploader
                folder="brand"
                value={data.logo || ""}
                onChange={(url) => setData({ ...data, logo: url })}
              />
            </div>
            <div>
              <p className="field-label">Logo Light (Footer)</p>
              <p className="mb-2 text-xs text-ink-subtle">
                Varian terang untuk footer (background gelap). Kalau kosong,
                pakai logo utama.
              </p>
              <ImageUploader
                folder="brand"
                value={data.logo_light || ""}
                onChange={(url) => setData({ ...data, logo_light: url })}
              />
            </div>
            <div>
              <p className="field-label">Favicon</p>
              <p className="mb-2 text-xs text-ink-subtle">
                Icon untuk tab browser. PNG/ICO 32×32 atau 64×64.
              </p>
              <ImageUploader
                folder="brand"
                value={data.favicon || ""}
                onChange={(url) => setData({ ...data, favicon: url })}
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="field-label">Gambar OG Default (Social Share)</p>
              <p className="mb-2 text-xs text-ink-subtle">
                Tampil saat link di-share di WhatsApp/IG/FB. Rasio 1200×630.
              </p>
              <ImageUploader
                folder="brand"
                value={data.og_image || ""}
                onChange={(url) => setData({ ...data, og_image: url })}
              />
            </div>
          </div>
        </section>

        {/* ─── Other field groups ───────────────────── */}
        {FIELDS.map((g) => (
          <section key={g.group} className="card-elevated p-6">
            <header>
              <h2 className="font-heading text-lg font-semibold text-ink">
                {g.group}
              </h2>
              {g.description && (
                <p className="mt-1 text-sm text-ink-muted">{g.description}</p>
              )}
            </header>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {g.rows.map((r) => (
                <label key={r.key} className="block text-sm">
                  <span className="field-label">{r.label}</span>
                  {r.type === "textarea" ? (
                    <textarea
                      rows={3}
                      className="field resize-y"
                      value={data[r.key] || ""}
                      onChange={(e) =>
                        setData({ ...data, [r.key]: e.target.value })
                      }
                    />
                  ) : (
                    <input
                      className="field"
                      value={data[r.key] || ""}
                      onChange={(e) =>
                        setData({ ...data, [r.key]: e.target.value })
                      }
                    />
                  )}
                  {r.hint && (
                    <p className="mt-1 text-xs text-ink-subtle">{r.hint}</p>
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
