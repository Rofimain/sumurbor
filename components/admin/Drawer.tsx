"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />
      <div className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-soft-lg">
        <header className="flex items-start justify-between gap-4 border-b border-surface-line px-6 py-5">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-tight text-ink">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-ink-muted">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-surface-line bg-white text-ink-subtle hover:bg-surface-alt"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && (
          <footer className="flex flex-wrap justify-end gap-3 border-t border-surface-line bg-surface-alt px-6 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
