import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

/** Affiché lorsqu'une recherche ou un filtre ne donne aucun résultat. */
export function EmptyState({
  title,
  description,
  action,
  icon: Icon = SearchX,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: typeof SearchX;
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-ink-500 shadow-card ring-1 ring-ink-100">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <p className="font-display text-lg font-semibold text-ink-950">{title}</p>
      {description && <div className="mt-2 max-w-md text-ink-600">{description}</div>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
