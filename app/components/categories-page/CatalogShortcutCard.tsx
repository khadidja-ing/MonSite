import { ArrowRight, LayoutGrid } from "lucide-react";
import { Link } from "react-router";
import { plural } from "~/lib/format";

/**
 * Dernière carte de la grille des catégories : accès au catalogue complet,
 * avec recherche et filtres. Le nombre d'outils est calculé à partir des données.
 */
export function CatalogShortcutCard({ toolCount }: { toolCount: number }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-brand-600 p-6 text-white shadow-card transition-colors hover:bg-brand-700">
      <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/25 ring-inset">
        <LayoutGrid aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">
        <Link
          to="/outils"
          className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-white"
        >
          Tout le catalogue
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-50">
        Recherchez un outil par mot-clé et combinez les filtres (catégorie, accès gratuit ou payant) pour
        affiner la liste.
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
        <span className="font-medium text-brand-50">
          {toolCount > 0 ? `${plural(toolCount, "outil")} au total` : "Catalogue en cours de constitution"}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 text-white transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </article>
  );
}
