import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import type { Category } from "~/data/types";
import { plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";

/** Carte d'une catégorie, menant à la page de la catégorie. */
export function CategoryCard({
  category,
  toolCount,
  headingLevel = "h3",
}: {
  category: Category;
  toolCount?: number;
  headingLevel?: "h2" | "h3";
}) {
  const Icon = getIcon(category.icon);
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <Heading className="mt-5 font-display text-lg font-semibold text-ink-950">
        <Link
          to={`/categories/${category.slug}`}
          className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-brand-700"
        >
          {category.name}
        </Link>
      </Heading>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{category.summary}</p>
      <div className="mt-auto flex items-center justify-between pt-5 text-sm">
        {typeof toolCount === "number" ? (
          <span className="text-ink-500">{plural(toolCount, "outil")} référencé{toolCount > 1 ? "s" : ""}</span>
        ) : (
          <span />
        )}
        <ArrowRight
          aria-hidden="true"
          className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </article>
  );
}
