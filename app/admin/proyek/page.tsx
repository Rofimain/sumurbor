"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Drawer } from "@/components/admin/Drawer";
import {
  ImageUploader,
  MultiImageUploader,
} from "@/components/ui/ImageUploader";
import { slugify } from "@/lib/utils";
import type { ProjectRow } from "@/lib/supabase";

type Draft = Partial<ProjectRow>;

const EMPTY: Draft = {
  title: "",
  subtitle: "",
  slug: "",
  category: "",
  location: "",
  depth: "",
  diameter: "",
  piles: 0,
  duration: "",
  year: new Date().getFullYear(),
  status: "completed",
  client: "",
  description: "",
  full_description: "",
  cover_image: "",
  images: [],
  tags: [],
  featured: false,
};

export default function AdminProyek() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/projects");
    setItems(await res.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setDraft({ ...EMPTY });
    setOpen(true);
  }
  function startEdit(p: ProjectRow) {
    setDraft({ ...p });
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.title || ""),
      tags:
        typeof draft.tags === "string"
          ? (draft.tags as unknown as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : draft.tags,
    };
    const res = await fetch("/api/projects", {
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
    if (!confirm("Hapus proyek ini?")) return;
    const res = await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Proyek"
        description="Kelola portofolio proyek yang sudah dikerjakan."
        onNew={startNew}
        newLabel="Tambah Proyek"
      />

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat...
          </div>
        ) : items.length === 0 ? (
          <Empty onAdd={startNew} label="proyek" />
        ) : (
          <ul className="divide-y divide-surface-line">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-surface-alt/60"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="hidden h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-alt sm:block">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-heading font-semibold text-ink">
                        {p.title}
                      </p>
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                          <Star className="h-3 w-3" aria-hidden="true" />
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {p.location} · {p.year} · {p.status}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="btn-ghost h-9 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
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
        title={draft.id ? "Edit Proyek" : "Tambah Proyek"}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori">
              <input
                className="field"
                value={draft.category || ""}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
                placeholder="Bored Pile / Sumur Bor Dalam / Strauss Pile"
              />
            </Field>
            <Field label="Lokasi">
              <input
                className="field"
                value={draft.location || ""}
                onChange={(e) =>
                  setDraft({ ...draft, location: e.target.value })
                }
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Kedalaman">
              <input
                className="field"
                value={draft.depth || ""}
                onChange={(e) => setDraft({ ...draft, depth: e.target.value })}
              />
            </Field>
            <Field label="Diameter">
              <input
                className="field"
                value={draft.diameter || ""}
                onChange={(e) =>
                  setDraft({ ...draft, diameter: e.target.value })
                }
              />
            </Field>
            <Field label="Jumlah titik">
              <input
                type="number"
                className="field"
                value={draft.piles ?? 0}
                onChange={(e) =>
                  setDraft({ ...draft, piles: Number(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Durasi">
              <input
                className="field"
                value={draft.duration || ""}
                onChange={(e) =>
                  setDraft({ ...draft, duration: e.target.value })
                }
              />
            </Field>
            <Field label="Tahun">
              <input
                type="number"
                className="field"
                value={draft.year || ""}
                onChange={(e) =>
                  setDraft({ ...draft, year: Number(e.target.value) || 0 })
                }
              />
            </Field>
            <Field label="Status">
              <select
                className="field"
                value={draft.status || "completed"}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    status: e.target.value as ProjectRow["status"],
                  })
                }
              >
                <option value="completed">Selesai</option>
                <option value="ongoing">Berjalan</option>
                <option value="upcoming">Akan datang</option>
              </select>
            </Field>
          </div>
          <Field label="Klien">
            <input
              className="field"
              value={draft.client || ""}
              onChange={(e) => setDraft({ ...draft, client: e.target.value })}
            />
          </Field>
          <Field label="Ringkasan">
            <textarea
              rows={3}
              className="field resize-y"
              value={draft.description || ""}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </Field>
          <Field label="Detail proyek (paragraf dipisah baris kosong)">
            <textarea
              rows={6}
              className="field resize-y font-mono text-xs"
              value={draft.full_description || ""}
              onChange={(e) =>
                setDraft({ ...draft, full_description: e.target.value })
              }
            />
          </Field>
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
          <Field label="Cover image">
            <ImageUploader
              folder="projects"
              value={draft.cover_image || ""}
              onChange={(url) => setDraft({ ...draft, cover_image: url })}
            />
          </Field>
          <Field label="Galeri">
            <MultiImageUploader
              folder="projects/gallery"
              values={draft.images || []}
              onChange={(urls) => setDraft({ ...draft, images: urls })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!draft.featured}
              onChange={(e) =>
                setDraft({ ...draft, featured: e.target.checked })
              }
              className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-500"
            />
            <span className="text-ink">Tampilkan sebagai featured di home</span>
          </label>
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
        Mulai dengan menambahkan data pertama.
      </p>
      <button type="button" onClick={onAdd} className="btn-primary mt-6 h-10 text-xs">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tambah
      </button>
    </div>
  );
}
