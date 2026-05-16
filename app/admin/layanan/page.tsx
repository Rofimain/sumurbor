"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Drawer } from "@/components/admin/Drawer";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { SERVICE_ICON_OPTIONS } from "@/components/ui/ServiceIcon";
import { slugify } from "@/lib/utils";
import type { ServiceRow } from "@/lib/supabase";

type Draft = Partial<ServiceRow>;

const EMPTY: Draft = {
  title: "",
  subtitle: "",
  slug: "",
  description: "",
  full_description: "",
  icon: "Drill",
  cover_image: "",
  features: [],
  process: [],
  faq: [],
  featured: false,
  order: 0,
};

export default function AdminLayanan() {
  const [items, setItems] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
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
  function startEdit(s: ServiceRow) {
    setDraft({ ...s });
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.title || ""),
      features:
        typeof draft.features === "string"
          ? (draft.features as unknown as string)
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : draft.features,
    };
    const res = await fetch("/api/services", {
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
    if (!confirm("Hapus layanan ini?")) return;
    const res = await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Layanan"
        description="Kelola daftar layanan yang tampil di website."
        onNew={startNew}
        newLabel="Tambah Layanan"
      />

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat...
          </div>
        ) : items.length === 0 ? (
          <EmptyTable onAdd={startNew} />
        ) : (
          <ul className="divide-y divide-surface-line">
            {items.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-surface-alt/60"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading font-semibold text-ink">
                      {s.title}
                    </p>
                    {s.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Star className="h-3 w-3" aria-hidden="true" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    /layanan/{s.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="btn-ghost h-9 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
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
        title={draft.id ? "Edit Layanan" : "Tambah Layanan"}
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
              {saving && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              )}
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
          <Field label="Slug (URL)" hint="Otomatis dari judul jika dikosongkan">
            <input
              className="field font-mono text-xs"
              value={draft.slug || ""}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              placeholder={slugify(draft.title || "") || "bored-pile"}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className="field"
              value={draft.subtitle || ""}
              onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
            />
          </Field>
          <Field label="Deskripsi singkat">
            <textarea
              rows={3}
              className="field resize-y"
              value={draft.description || ""}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </Field>
          <Field label="Deskripsi lengkap (paragraf dipisah baris kosong)">
            <textarea
              rows={6}
              className="field resize-y font-mono text-xs"
              value={draft.full_description || ""}
              onChange={(e) =>
                setDraft({ ...draft, full_description: e.target.value })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Icon">
              <select
                className="field"
                value={draft.icon || "Drill"}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
              >
                {SERVICE_ICON_OPTIONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Urutan">
              <input
                type="number"
                className="field"
                value={draft.order ?? 0}
                onChange={(e) =>
                  setDraft({ ...draft, order: Number(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
          <Field label="Cover image">
            <ImageUploader
              folder="services"
              value={draft.cover_image || ""}
              onChange={(url) => setDraft({ ...draft, cover_image: url })}
            />
          </Field>
          <Field label="Fitur / Spesifikasi (1 baris per item)">
            <textarea
              rows={5}
              className="field resize-y"
              value={
                Array.isArray(draft.features)
                  ? draft.features.join("\n")
                  : (draft.features as unknown as string) || ""
              }
              onChange={(e) =>
                setDraft({
                  ...draft,
                  features: e.target.value as unknown as string[],
                })
              }
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
            <span className="text-ink">Tampilkan sebagai layanan unggulan</span>
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

function EmptyTable({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-heading text-lg font-semibold text-ink">
        Belum ada data
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Mulai dengan menambahkan layanan pertama.
      </p>
      <button type="button" onClick={onAdd} className="btn-primary mt-6 h-10 text-xs">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Tambah Layanan
      </button>
    </div>
  );
}
