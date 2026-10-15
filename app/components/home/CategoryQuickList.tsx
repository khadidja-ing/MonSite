import { ChevronRight, Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { categories } from "~/data/categories";
import type { Tool } from "~/data/types";
import { getToolsByCategory } from "~/lib/catalog";
import { cn } from "~/lib/cn";
import { plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";

const rowClasses =
  "flex min-h-16 items-center gap-4 px-4 py-3 transition-colors hover:bg-ink-50 focus-visible:-outline-offset-2";

/**
 * Version compacte de la grille des catégories, affichée sur téléphone :
 * une liste de liens plus rapide à parcourir que onze grandes cartes.
 */
export function CategoryQuickList({ tools, className }: { tools: Tool[]; className?: string }) {
  return (
    <ul
      className={cn(
        "divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100",
        className,
      )}
    >
      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        const count = getToolsByCategory(tools, category.slug).length;
        return (
          <li key={category.slug}>
            <Link to={`/categories/${category.slug}`} className={rowClasses}>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink-950">{category.name}</span>
                <span className="block text-sm text-ink-500">
                  {plural(count, "outil")} référencé{count > 1 ? "s" : ""}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-ink-400" />
            </Link>
          </li>
        );
      })}
      <li>
        <Link to="/contact?sujet=suggerer-outil" className={rowClasses}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent-700 ring-1 ring-ink-200 ring-inset">
            <Lightbulb aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink-950">Un outil vous manque ?</span>
            <span className="block text-sm text-brand-700">Suggérer un outil</span>
          </span>
          <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-ink-400" />
        </Link>
      </li>
    </ul>
  );
}
