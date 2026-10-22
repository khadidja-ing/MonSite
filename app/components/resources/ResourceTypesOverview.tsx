import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/Badge";
import { resourceTypes } from "~/data/resource-types";
import type { ResourceType } from "~/data/types";
import { cn } from "~/lib/cn";
import { plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";
import { resourceFilterHref } from "~/lib/resources";

/**
 * Vue d'ensemble des rubriques. Une rubrique sans article est présentée
 * honnêtement comme « À venir », sans contenu fictif.
 */
export function ResourceTypesOverview({
  counts,
  listAnchor,
}: {
  counts: Record<ResourceType, number>;
  /** Identifiant de la liste d'articles, pour y revenir après avoir choisi une rubrique. */
  listAnchor: string;
}) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {resourceTypes.map((type) => {
        const Icon = getIcon(type.icon);
        const count = counts[type.slug] ?? 0;
        const available = count > 0;
        return (
          <li key={type.slug}>
            <article
              className={cn(
                "relative flex h-full flex-col rounded-2xl p-6",
                available
                  ? "group bg-white shadow-card ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover"
                  : "border border-dashed border-ink-300 bg-white/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl ring-1 ring-inset",
                    available ? "bg-brand-50 text-brand-700 ring-brand-100" : "bg-ink-100/70 text-ink-500 ring-ink-200",
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                {available ? (
                  <Badge tone="success">{plural(count, "article")}</Badge>
                ) : (
                  <Badge>À venir</Badge>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink-950">
                {available ? (
                  <Link
                    to={`${resourceFilterHref(type.slug)}#${listAnchor}`}
                    replace
                    className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-brand-700"
                  >
                    {type.name}
                  </Link>
                ) : (
                  type.name
                )}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{type.description}</p>
              <div className="mt-auto pt-5 text-sm">
                {available ? (
                  <span aria-hidden="true" className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                    Voir {count > 1 ? "les articles" : "l'article"}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                ) : (
                  <span className="text-ink-500">Rubrique en préparation : aucun article publié pour l'instant.</span>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
