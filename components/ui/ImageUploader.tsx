"use client";
import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value?: string | null;
  folder?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUploader({
  value,
  folder = "misc",
  onChange,
  className = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Upload gagal");
      } else {
        onChange(json.url);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-surface-line bg-surface-alt">
          <img
            src={value}
            alt="Preview"
            className="aspect-video w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-ink shadow-soft-sm transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Hapus"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-surface-line bg-surface-alt text-ink-subtle transition-colors hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-7 w-7" aria-hidden="true" />
          )}
          <span className="text-sm font-medium">
            {uploading ? "Mengupload..." : "Klik untuk upload gambar"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider">
            JPG · PNG · WebP · maks 10MB
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-600"
        >
          <Upload className="h-3.5 w-3.5" aria-hidden="true" />
          {uploading ? "Mengupload..." : "Ganti gambar"}
        </button>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}

interface MultiImageUploaderProps {
  values: string[];
  folder?: string;
  onChange: (urls: string[]) => void;
}

export function MultiImageUploader({
  values,
  folder = "gallery",
  onChange,
}: MultiImageUploaderProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {values.map((url, i) => (
          <div
            key={url + i}
            className="relative overflow-hidden rounded-xl border border-surface-line"
          >
            <img
              src={url}
              alt={`Image ${i + 1}`}
              className="aspect-square w-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-white/95 text-ink shadow-soft-sm transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label="Hapus"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <ImageUploader
        folder={folder}
        onChange={(url) => onChange([...values, url])}
      />
    </div>
  );
}
