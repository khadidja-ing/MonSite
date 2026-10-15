import { Link } from "react-router";
import type { Category, CategorySlug } from "~/data/types";
import { cn } from "~/lib/cn";
import { plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";

/**
 * Liste compacte de liens vers des catégories (pastilles avec icône et
 * nombre d'outils). Utilisée pour « Autres catégories ».
 */
export function CategoryChips({
  categories,
  counts,
  className,
}: {
  categories: Category[];
  counts: Record<CategorySlug, number>;
  className?: string;
}) {
  if (categories.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-3", className)}>
      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        const count = counts[category.slug] ?? 0;
        return (
          <li key={category.slug}>
            <Link
              to={`/categories/${category.slug}`}
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-white py-1.5 pr-2 pl-1.5 text-sm font-medium text-ink-800 shadow-card ring-1 ring-ink-100 transition hover:text-brand-700 hover:shadow-card-hover hover:ring-brand-200"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span>{category.shortName}</span>
              <span
                aria-hidden="true"
                className="min-w-7 rounded-full bg-ink-100 px-2 py-0.5 text-center text-xs font-semibold text-ink-600 tabular-nums group-hover:bg-brand-50 group-hover:text-brand-700"
              >
                {count}
              </span>
              <span className="sr-only">
                {" "}
                ({category.name}, {plural(count, "outil")})
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
