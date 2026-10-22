import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { AccessBadge } from "~/components/tools/AccessBadge";
import { ToolLogo } from "~/components/tools/ToolLogo";
import { categories, getCategory } from "~/data/categories";
import { tools } from "~/data/tools";
import { formatDate, plural } from "~/lib/format";
import { areAllToolsSourced, getFeaturedTools, getLatestCheckDate } from "~/lib/highlights";

/**
 * Aperçu du catalogue affiché à côté du titre : quelques vraies fiches
 * (lues dans les données), présentées comme une petite pile de cartes.
 */
export function HeroPreview() {
  const previewTools = getFeaturedTools(tools, 3);
  const latestCheck = getLatestCheckDate(tools);
  const allSourced = areAllToolsSourced(tools);

  return (
    <div className="relative mx-auto w-full max-w-md animate-fade-in [animation-delay:120ms] sm:pb-10 lg:max-w-none">
      {/* Cartes d'arrière-plan : donnent l'effet de « pile ». */}
      <div
        aria-hidden="true"
        className="absolute inset-x-10 -top-6 h-24 rounded-3xl bg-brand-100/60 ring-1 ring-brand-200/60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-5 -top-3 h-24 rounded-3xl bg-white shadow-card ring-1 ring-ink-100"
      />

      <div className="relative rounded-3xl bg-white p-5 shadow-card-hover ring-1 ring-ink-100 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p id="apercu-catalogue" className="font-display text-base font-semibold text-ink-950">
            Outils à la une
          </p>
          <p className="text-sm text-ink-500">
            {plural(tools.length, "outil")} · {plural(categories.length, "catégorie")}
          </p>
        </div>

        {previewTools.length > 0 ? (
          <ul aria-labelledby="apercu-catalogue" className="mt-4 space-y-2">
            {previewTools.map((tool) => {
              const category = getCategory(tool.category);
              return (
                <li key={tool.slug}>
                  <Link
                    to={`/outils/${tool.slug}`}
                    className="group flex items-center gap-3 rounded-2xl p-3 ring-1 ring-ink-100 transition-colors ring-inset hover:bg-ink-50 hover:ring-ink-200"
                  >
                    <ToolLogo tool={tool} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink-950 group-hover:text-brand-700">
                        {tool.name}
                      </span>
                      <span className="block truncate text-sm text-ink-500">
                        {tool.publisher}
                        {category ? ` · ${category.shortName}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0">
                      <AccessBadge access={tool.access} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 rounded-2xl bg-ink-50 p-4 text-sm text-ink-600">
            Les premières fiches sont en cours de préparation.
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-4">
          <p className="text-sm text-ink-600">Modèle d'accès indiqué sur chaque fiche</p>
          <Link
            to="/outils"
            className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-lg text-sm font-semibold text-brand-700 hover:underline"
          >
            Tout voir<span className="sr-only"> : tous les outils du catalogue</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>

      {latestCheck && (
        <div className="relative mx-3 -mt-3 flex items-center gap-3 rounded-2xl bg-white py-2.5 pr-4 pl-3 shadow-card-hover ring-1 ring-ink-100 sm:absolute sm:bottom-0 sm:-left-6 sm:mx-0 sm:mt-0">
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <p className="text-sm leading-tight">
            <span className="block font-semibold text-ink-950">
              {allSourced ? "Fiches datées et sourcées" : "Fiches datées"}
            </span>
            <span className="block text-ink-500">Dernière vérification : {formatDate(latestCheck)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
