import { Check } from "lucide-react";
import { useId, type KeyboardEvent, type ReactNode } from "react";
import { categories } from "~/data/categories";
import type { AccessModel, CategorySlug } from "~/data/types";
import { accessModels, type CatalogCriteria } from "~/lib/catalog";
import { showResultsLabel, type FacetCounts } from "~/lib/catalog-ui";
import { cn } from "~/lib/cn";
import { plural } from "~/lib/format";
import { Button } from "../ui/Button";

/** Une case à cocher de filtre, avec son compteur de résultats. */
function FilterOption({
  label,
  description,
  count,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  const descriptionId = useId();
  const muted = count === 0 && !checked;

  return (
    <label
      className={cn(
        "grid min-h-10 cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl px-2.5 py-2 transition-colors",
        checked ? "bg-brand-50 hover:bg-brand-100/70" : "hover:bg-ink-50",
      )}
    >
      <span className="relative flex size-5 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-describedby={description ? descriptionId : undefined}
          className="peer size-5 cursor-pointer appearance-none rounded-md border border-ink-300 bg-white transition-colors checked:border-brand-600 checked:bg-brand-600 hover:border-ink-400 checked:hover:border-brand-700 checked:hover:bg-brand-700 forced-colors:appearance-auto"
        />
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100 forced-colors:hidden"
        />
      </span>
      <span
        className={cn(
          "text-sm leading-5 font-medium",
          checked ? "text-brand-800" : muted ? "text-ink-500" : "text-ink-800",
        )}
      >
        {label}
        <span className="sr-only">, {plural(count, "outil")}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "rounded-full px-2 py-0.5 text-xs leading-4 font-medium tabular-nums",
          checked ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600",
        )}
      >
        {count}
      </span>
      {description && (
        <span
          id={descriptionId}
          aria-hidden="true"
          className="col-span-2 col-start-2 mt-0.5 text-xs leading-snug text-ink-500"
        >
          {description}
        </span>
      )}
    </label>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="px-2.5 text-xs font-semibold tracking-wide text-ink-500 uppercase">{legend}</legend>
      <ul className="mt-2">{children}</ul>
    </fieldset>
  );
}

/**
 * Panneau des filtres : barre latérale fixe sur ordinateur, panneau
 * dépliable (bouton « Filtres ») sur mobile.
 */
export function FilterPanel({
  id,
  open,
  criteria,
  counts,
  resultCount,
  onToggleCategory,
  onToggleAccess,
  onShowResults,
  onEscape,
}: {
  id: string;
  open: boolean;
  criteria: CatalogCriteria;
  counts: FacetCounts;
  resultCount: number;
  onToggleCategory: (slug: CategorySlug) => void;
  onToggleAccess: (value: AccessModel) => void;
  /** Mobile : referme le panneau et amène aux résultats. */
  onShowResults: () => void;
  /** Mobile : touche Échap dans le panneau. */
  onEscape: () => void;
}) {
  const headingId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      onEscape();
    }
  };

  return (
    <aside
      id={id}
      aria-labelledby={headingId}
      onKeyDown={handleKeyDown}
      className={cn(
        open ? "block" : "hidden",
        // Ordinateur : la barre reste visible pendant le défilement si l'écran est assez haut.
        "mb-6 lg:top-20 lg:mb-0 lg:block lg:self-start lg:[@media(min-height:50rem)]:sticky",
      )}
    >
      <div className="rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100 sm:p-5 lg:p-4 lg:[@media(min-height:50rem)]:max-h-[calc(100dvh-6rem)] lg:[@media(min-height:50rem)]:overflow-y-auto lg:[@media(min-height:50rem)]:overscroll-contain">
        <div className="px-2.5">
          <h2 id={headingId} className="font-display text-base font-semibold text-ink-950">
            Filtrer les outils
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">Plusieurs choix possibles.</p>
        </div>

        <div className="mt-4">
          <FilterGroup legend="Catégories">
            {categories.map((category) => (
              <li key={category.slug}>
                <FilterOption
                  label={category.shortName}
                  count={counts.categories[category.slug]}
                  checked={criteria.categories.includes(category.slug)}
                  onChange={() => onToggleCategory(category.slug)}
                />
              </li>
            ))}
          </FilterGroup>
        </div>

        <div className="mt-4 border-t border-ink-100 pt-4">
          <FilterGroup legend="Modèle d'accès">
            {accessModels.map((model) => (
              <li key={model.value}>
                <FilterOption
                  label={model.label}
                  description={model.description}
                  count={counts.access[model.value]}
                  checked={criteria.access.includes(model.value)}
                  onChange={() => onToggleAccess(model.value)}
                />
              </li>
            ))}
          </FilterGroup>
        </div>

        <div className="mt-5 border-t border-ink-100 pt-4 lg:hidden">
          <Button className="w-full" onClick={onShowResults}>
            {showResultsLabel(resultCount)}
          </Button>
        </div>
      </div>
    </aside>
  );
}
