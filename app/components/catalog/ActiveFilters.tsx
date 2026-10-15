import { X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface FilterChip {
  /** Identifiant unique, ex. "categorie:images". */
  key: string;
  label: string;
  onRemove: () => void;
}

/**
 * Filtres actifs sous forme d'étiquettes, chacune supprimable d'un clic,
 * suivies du bouton « Réinitialiser les filtres ».
 * Après une suppression, le focus clavier passe à l'étiquette voisine
 * (ou, s'il n'en reste aucune, à l'élément indiqué par `onFocusFallback`).
 */
export function ActiveFilters({
  chips,
  onReset,
  onFocusFallback,
}: {
  chips: FilterChip[];
  onReset: () => void;
  onFocusFallback: () => void;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  /** Position de l'étiquette à focaliser après la mise à jour (-1 : élément de repli). */
  const pendingFocus = useRef<number | null>(null);
  const chipsKey = chips.map((chip) => chip.key).join("|");

  useEffect(() => {
    const index = pendingFocus.current;
    if (index === null) return;
    pendingFocus.current = null;
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("button");
    if (index >= 0 && buttons && buttons.length > 0) {
      buttons[Math.min(index, buttons.length - 1)].focus();
    } else {
      onFocusFallback();
    }
  }, [chipsKey, onFocusFallback]);

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <ul ref={listRef} aria-label="Filtres actifs" className="flex max-w-full min-w-0 flex-wrap gap-2">
        {chips.map((chip, index) => (
          <li key={chip.key} className="max-w-full min-w-0">
            <button
              type="button"
              onClick={() => {
                pendingFocus.current = index;
                chip.onRemove();
              }}
              className="relative inline-flex h-8 max-w-full items-center gap-1.5 rounded-full bg-brand-50 pr-2 pl-3 text-sm font-medium text-brand-800 ring-1 ring-brand-100 transition-colors ring-inset after:absolute after:inset-x-0 after:-inset-y-1 after:content-[''] hover:bg-brand-100"
            >
              <span className="min-w-0 truncate">{chip.label}</span>
              <X aria-hidden="true" className="size-4 shrink-0" />
              <span className="sr-only"> : retirer ce filtre</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          pendingFocus.current = -1;
          onReset();
        }}
        className="inline-flex min-h-10 items-center rounded-lg px-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
