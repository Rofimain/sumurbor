import { Plus } from "lucide-react";

interface Props {
  title: string;
  description: string;
  onNew?: () => void;
  newLabel?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  onNew,
  newLabel = "Tambah",
  action,
}: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-surface-line pb-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">{description}</p>
      </div>
      {action ||
        (onNew && (
          <button type="button" onClick={onNew} className="btn-primary h-11 px-5 text-xs">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {newLabel}
          </button>
        ))}
    </header>
  );
}
