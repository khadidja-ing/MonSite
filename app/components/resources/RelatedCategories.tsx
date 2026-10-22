import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Category } from "~/data/types";
import { getIcon } from "~/lib/icons";

/** Liens vers les catégories d'outils en rapport avec un article. */
export function RelatedCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {categories.map((category) => {
        const Icon = getIcon(category.icon);
        return (
          <li key={category.slug}>
            <Link
              to={`/categories/${category.slug}`}
              className="group flex h-full min-h-14 items-center gap-3 rounded-xl bg-white p-3 pr-4 text-ink-800 shadow-card ring-1 ring-ink-100 transition hover:text-brand-700 hover:shadow-card-hover hover:ring-brand-200"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0 flex-1 text-sm leading-snug font-semibold">{category.name}</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
