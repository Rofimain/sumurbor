"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Drawer } from "@/components/admin/Drawer";
import { ImageUploader } from "@/components/ui/ImageUploader";
import type { TeamRow } from "@/lib/supabase";

type Draft = Partial<TeamRow>;

const EMPTY: Draft = {
  name: "",
  role: "",
  bio: "",
  image: "",
  order: 0,
  linkedin: "",
  instagram: "",
  whatsapp: "",
};

export default function AdminTim() {
  const [items, setItems] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/team");
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
  function startEdit(m: TeamRow) {
    setDraft({ ...m });
    setOpen(true);
  }
  async function save() {
    setSaving(true);
    const res = await fetch("/api/team", {
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
    if (!confirm("Hapus anggota tim ini?")) return;
    await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tim"
        description="Kelola anggota tim yang tampil di halaman tentang."
        onNew={startNew}
        newLabel="Tambah Anggota"
      />

      <div className="card-elevated overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-ink-subtle">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="font-heading text-lg font-semibold text-ink">
              Belum ada anggota tim
            </p>
            <button
              type="button"
              onClick={startNew}
              className="btn-primary mt-6 h-10 text-xs"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Tambah Anggota
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-surface-line">
            {items.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-surface-alt/60"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 font-heading font-bold text-brand-700">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-semibold text-ink">{m.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{m.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(m)}
                    className="btn-ghost h-9 text-xs"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
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
        title={draft.id ? "Edit Anggota Tim" : "Tambah Anggota Tim"}
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
          <Field label="Nama" required>
            <input
              className="field"
              value={draft.name || ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <Field label="Posisi / role">
            <input
              className="field"
              value={draft.role || ""}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            />
          </Field>
          <Field label="Bio">
            <textarea
              rows={3}
              className="field resize-y"
              value={draft.bio || ""}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            />
          </Field>
          <Field label="Foto">
            <ImageUploader
              folder="team"
              value={draft.image || ""}
              onChange={(url) => setDraft({ ...draft, image: url })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="LinkedIn URL">
              <input
                className="field"
                value={draft.linkedin || ""}
                onChange={(e) => setDraft({ ...draft, linkedin: e.target.value })}
              />
            </Field>
            <Field label="Instagram URL">
              <input
                className="field"
                value={draft.instagram || ""}
                onChange={(e) =>
                  setDraft({ ...draft, instagram: e.target.value })
                }
              />
            </Field>
            <Field label="WhatsApp">
              <input
                className="field"
                value={draft.whatsapp || ""}
                onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })}
              />
            </Field>
          </div>
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
