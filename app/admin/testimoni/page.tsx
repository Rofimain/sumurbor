"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Drawer } from "@/components/admin/Drawer";
import { ImageUploader } from "@/components/ui/ImageUploader";
import type { TestimonialRow } from "@/lib/supabase";

type Draft = Partial<TestimonialRow>;

const EMPTY: Draft = {
  name: "",
  role: "",
  company: "",
  content: "",
  rating: 5,
  image: "",
  featured: false,
};

export default function AdminTestimoni() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/testimonials");
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
  function startEdit(t: TestimonialRow) {
    setDraft({ ...t });
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      load();
    }
  }
  async function remove(id: string) {
    if (!confirm("Hapus testimoni ini?")) return;
    await fetch("/api/testimonials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimoni"
        description="Kelola testimoni klien yang tampil di home."
        onNew={startNew}
        newLabel="Tambah Testimoni"
      />

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-heading text-lg font-semibold text-ink">
              Belum ada testimoni
            </p>
            <button
              type="button"
              onClick={startNew}
              className="btn-primary mt-6 h-10 text-xs"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-surface-line">
            {items.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-surface-alt/60"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading font-semibold text-ink">
                      {t.name}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < t.rating
                              ? "fill-brand-500 text-brand-500"
                              : "text-slate-200"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {t.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-muted">
                    {t.content}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(t)}
                    className="btn-ghost h-9 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
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
        title={draft.id ? "Edit Testimoni" : "Tambah Testimoni"}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama" required>
              <input
                className="field"
                value={draft.name || ""}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label="Rating">
              <select
                className="field"
                value={draft.rating ?? 5}
                onChange={(e) =>
                  setDraft({ ...draft, rating: Number(e.target.value) })
                }
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} bintang
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Posisi / role">
              <input
                className="field"
                value={draft.role || ""}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </Field>
            <Field label="Perusahaan">
              <input
                className="field"
                value={draft.company || ""}
                onChange={(e) =>
                  setDraft({ ...draft, company: e.target.value })
                }
              />
            </Field>
          </div>
          <Field label="Testimoni">
            <textarea
              rows={5}
              className="field resize-y"
              value={draft.content || ""}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />
          </Field>
          <Field label="Foto klien (opsional)">
            <ImageUploader
              folder="testimonials"
              value={draft.image || ""}
              onChange={(url) => setDraft({ ...draft, image: url })}
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
            <span className="text-ink">Tampilkan di home</span>
          </label>
        </div>
      </Drawer>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
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
    </label>
  );
}
