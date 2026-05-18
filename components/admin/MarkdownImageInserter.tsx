"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface MarkdownImageInserterProps {
  textareaId: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
}

export function MarkdownImageInserter({
  textareaId,
  value,
  onChange,
  folder = "articles",
}: MarkdownImageInserterProps) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");

  function insertImage() {
    if (!imageUrl.trim()) return;
    const alt = altText.trim() || "Gambar ilustrasi";
    const snippet = `![${alt}](${imageUrl.trim()})\n\n`;

    const el = document.getElementById(textareaId) as HTMLTextAreaElement | null;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      onChange(value.slice(0, start) + snippet + value.slice(end));
      requestAnimationFrame(() => {
        el.focus();
        const pos = start + snippet.length;
        el.setSelectionRange(pos, pos);
      });
    } else {
      onChange(
        value + (value && !value.endsWith("\n\n") ? "\n\n" : "") + snippet,
      );
    }

    setImageUrl("");
    setAltText("");
    setOpen(false);
  }

  return (
    <div className="rounded-xl border border-dashed border-brand-200/80 bg-brand-50/30 p-4">
      <p className="text-xs text-ink-subtle">
        Sisipkan gambar di tengah artikel (bukan hanya cover). Format:{" "}
        <code className="rounded bg-surface-alt px-1">![alt](url)</code>
      </p>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 inline-flex h-9 items-center gap-2 rounded-full border border-surface-line bg-white px-4 text-xs font-semibold text-ink transition-colors hover:border-brand-300 hover:bg-brand-50"
        >
          <ImagePlus className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          Tambah gambar ke isi konten
        </button>
      ) : (
        <div className="mt-3 space-y-3 rounded-xl border border-surface-line bg-white p-4">
          <ImageUploader
            folder={folder}
            value={imageUrl}
            onChange={setImageUrl}
            previewAlt={altText || "Preview gambar konten"}
          />
          <label className="block text-sm">
            <span className="field-label">Alt text (untuk SEO & aksesibilitas)</span>
            <input
              className="field"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Contoh: Proses pengeboran bored pile di lokasi proyek"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setImageUrl("");
                setAltText("");
              }}
              className="btn-ghost h-9 text-xs"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={insertImage}
              disabled={!imageUrl.trim()}
              className="btn-primary h-9 text-xs disabled:opacity-50"
            >
              Sisipkan ke konten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
