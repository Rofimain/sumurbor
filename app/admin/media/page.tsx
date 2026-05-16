"use client";
import { useEffect, useState } from "react";
import { Copy, Loader2, Trash2, Check } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface FileItem {
  url: string;
  name: string;
  size?: number;
  created_at?: string;
}

export default function AdminMedia() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const json = await res.json();
      setFiles(json.files || []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }
  async function remove(url: string) {
    if (!confirm("Hapus file ini?")) return;
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media"
        description="Galeri semua file gambar yang sudah di-upload."
      />

      <div className="card-elevated p-6">
        <h2 className="text-sm font-semibold text-ink">Upload baru</h2>
        <p className="mt-1 text-xs text-ink-muted">
          Upload gambar yang bisa dipakai di mana saja. URL otomatis siap copy.
        </p>
        <div className="mt-4">
          <ImageUploader
            folder="library"
            value=""
            onChange={() => load()}
          />
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat...
          </div>
        ) : files.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-heading text-lg font-semibold text-ink">
              Belum ada file
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              File yang diupload akan tampil di sini.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((f) => (
              <div
                key={f.url}
                className="group overflow-hidden rounded-xl border border-surface-line bg-surface-alt"
              >
                <img
                  src={f.url}
                  alt={f.name}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="flex items-center justify-between gap-2 bg-white p-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(f.url)}
                    className="inline-flex flex-1 items-center gap-1.5 truncate rounded-lg px-2 py-1.5 text-xs font-semibold text-ink hover:bg-surface-alt"
                  >
                    {copied === f.url ? (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Copy
                        className="h-3.5 w-3.5 shrink-0 text-brand-600"
                        aria-hidden="true"
                      />
                    )}
                    <span className="truncate">{copied === f.url ? "Tersalin!" : "Copy URL"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(f.url)}
                    className="grid h-7 w-7 place-items-center rounded-lg text-rose-700 hover:bg-rose-50"
                    aria-label="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
