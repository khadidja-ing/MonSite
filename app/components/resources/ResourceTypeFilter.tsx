import { LayoutGrid } from "lucide-react";
import { Link } from "react-router";
import { resourceTypes } from "~/data/resource-types";
import type { ResourceType } from "~/data/types";
import { cn } from "~/lib/cn";
import { plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";
import { resourceFilterHref } from "~/lib/resources";

/**
 * Filtre par type de contenu, sous forme de pastilles.
 * Chaque pastille est un lien (?type=…) : le filtre peut être partagé ou
 * ajouté aux favoris, et fonctionne au clavier comme n'importe quel lien.
 */
export function ResourceTypeFilter({
  active,
  counts,
  total,
  className,
}: {
  active: ResourceType | null;
  counts: Record<ResourceType, number>;
  total: number;
  className?: string;
}) {
  const items = [
    { slug: null, name: "Tout", Icon: LayoutGrid, count: total },
    ...resourceTypes.map((type) => ({
      slug: type.slug,
      name: type.name,
      Icon: getIcon(type.icon),
      count: counts[type.slug] ?? 0,
    })),
  ];

  return (
    <nav aria-label="Filtrer les ressources par type" className={className}>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ slug, name, Icon, count }) => {
          const isActive = slug === active;
          const upcoming = slug !== null && count === 0;
          return (
            <li key={slug ?? "tout"}>
              <Link
                to={resourceFilterHref(slug)}
                replace
                preventScrollReset
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full py-1.5 pr-3 pl-3.5 text-sm font-medium ring-1 transition-colors ring-inset",
                  isActive
                    ? "bg-brand-600 text-white ring-brand-600 hover:bg-brand-700"
                    : "bg-white text-ink-700 ring-ink-200 hover:bg-ink-50 hover:text-ink-950 hover:ring-ink-300",
                )}
              >
                <Icon aria-hidden="true" className={cn("size-4 shrink-0", !isActive && "text-ink-400")} />
                <span>{name}</span>
                {upcoming ? (
                  <span aria-hidden="true" className={cn("text-xs", isActive ? "text-brand-100" : "text-ink-500")}>
                    À venir
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums",
                      isActive ? "bg-white text-brand-700" : "bg-ink-100 text-ink-600",
                    )}
                  >
                    {count}
                  </span>
                )}
                <span className="sr-only">{` (${upcoming ? "à venir" : plural(count, "article")})`}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
