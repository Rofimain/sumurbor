"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Drawer } from "@/components/admin/Drawer";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { MarkdownImageInserter } from "@/components/admin/MarkdownImageInserter";
import { formatDateShort, slugify } from "@/lib/utils";
import type { ArticleRow } from "@/lib/supabase";

type Draft = Partial<ArticleRow>;

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "Tim Engineering",
  category: "",
  tags: [],
  cover_image: "",
  published_at: new Date().toISOString(),
  featured: false,
  read_time: 5,
  published: true,
};

export default function AdminArtikel() {
  const [items, setItems] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/articles");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setDraft({ ...EMPTY, published_at: new Date().toISOString() });
    setOpen(true);
  }
  function startEdit(a: ArticleRow) {
    setDraft({ ...a });
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.title || ""),
      content: draft.content ?? "",
      excerpt: draft.excerpt ?? "",
      published_at: draft.published_at || new Date().toISOString(),
      tags:
        typeof draft.tags === "string"
          ? (draft.tags as unknown as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : draft.tags ?? [],
    };
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      load();
    } else {
      alert("Gagal menyimpan");
    }
  }
  async function remove(id: string) {
    if (!confirm("Hapus artikel ini?")) return;
    const res = await fetch("/api/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Artikel"
        description="Kelola artikel & insight yang dipublikasikan di website."
        onNew={startNew}
        newLabel="Tulis Artikel"
      />

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat...
          </div>
        ) : items.length === 0 ? (
          <Empty onAdd={startNew} label="artikel" />
        ) : (
          <ul className="divide-y divide-surface-line">
            {items.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-surface-alt/60"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading font-semibold text-ink">
                      {a.title}
                    </p>
                    {a.published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        Publish
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        <EyeOff className="h-3 w-3" aria-hidden="true" />
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {formatDateShort(a.published_at)} · {a.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(a)}
                    className="btn-ghost h-9 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={draft.id ? "Edit Artikel" : "Tulis Artikel"}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost h-10 text-xs">
              Batal
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-primary h-10 text-xs"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Judul" required>
            <input
              className="field"
              value={draft.title || ""}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </Field>
          <Field label="Slug" hint="Otomatis dari judul jika kosong">
            <input
              className="field font-mono text-xs"
              value={draft.slug || ""}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              placeholder={slugify(draft.title || "")}
            />
          </Field>
          <Field label="Ringkasan (excerpt)">
            <textarea
              rows={3}
              className="field resize-y"
              value={draft.excerpt || ""}
              onChange={(e) =>
                setDraft({ ...draft, excerpt: e.target.value })
              }
            />
          </Field>
          <Field label="Konten (## H2, ### H3, - list, > quote, ![alt](url) untuk gambar)">
            <MarkdownImageInserter
              textareaId="article-content"
              value={draft.content || ""}
              onChange={(content) => setDraft({ ...draft, content })}
              folder="articles"
            />
            <textarea
              id="article-content"
              rows={14}
              className="field mt-3 resize-y font-mono text-xs"
              value={draft.content || ""}
              onChange={(e) =>
                setDraft({ ...draft, content: e.target.value })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori">
              <input
                className="field"
                value={draft.category || ""}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
              />
            </Field>
            <Field label="Penulis">
              <input
                className="field"
                value={draft.author || ""}
                onChange={(e) =>
                  setDraft({ ...draft, author: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tanggal publish">
              <input
                type="datetime-local"
                className="field"
                value={
                  draft.published_at
                    ? new Date(draft.published_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setDraft({
                    ...draft,
                    published_at: value
                      ? new Date(value).toISOString()
                      : new Date().toISOString(),
                  });
                }}
              />
            </Field>
            <Field label="Estimasi waktu baca (menit)">
              <input
                type="number"
                className="field"
                value={draft.read_time ?? 5}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    read_time: Number(e.target.value) || 5,
                  })
                }
              />
            </Field>
          </div>
          <Field label="Tag (pisahkan dengan koma)">
            <input
              className="field"
              value={
                Array.isArray(draft.tags)
                  ? draft.tags.join(", ")
                  : (draft.tags as unknown as string) || ""
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  tags: e.target.value as unknown as string[],
                })
              }
            />
          </Field>
          <Field label="Cover image (featured / thumbnail)">
            <p className="mb-2 text-xs text-ink-subtle">
              Tampil di kartu artikel & bagian atas halaman. Alt otomatis dari judul
              artikel.
            </p>
            <ImageUploader
              folder="articles"
              value={draft.cover_image || ""}
              onChange={(url) => setDraft({ ...draft, cover_image: url })}
              previewAlt={draft.title || "Cover artikel"}
            />
          </Field>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!draft.published}
                onChange={(e) =>
                  setDraft({ ...draft, published: e.target.checked })
                }
                className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-500"
              />
              <span className="text-ink">Publish</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!draft.featured}
                onChange={(e) =>
                  setDraft({ ...draft, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-500"
              />
              <span className="text-ink">Featured</span>
            </label>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="field-label">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-subtle">{hint}</p>}
    </label>
  );
}

function Empty({ onAdd, label }: { onAdd: () => void; label: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-heading text-lg font-semibold text-ink">
        Belum ada {label}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Mulai dengan menulis artikel pertama.
      </p>
      <button type="button" onClick={onAdd} className="btn-primary mt-6 h-10 text-xs">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tulis Artikel
      </button>
    </div>
  );
}
