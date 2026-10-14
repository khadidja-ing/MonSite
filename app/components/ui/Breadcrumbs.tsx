import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/cn";

export interface Crumb {
  label: string;
  /** Lien ; absent pour la page courante. */
  to?: string;
}

/** Fil d'Ariane : montre où l'on se trouve dans le site. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Accueil", to: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-500">
        {all.map((item, index) => {
          const isLast = index === all.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.to && !isLast ? (
                <Link to={item.to} className="rounded hover:text-brand-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="font-medium text-ink-800">
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight aria-hidden="true" className="size-3.5 text-ink-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
