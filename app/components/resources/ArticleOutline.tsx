import { ChevronDown, ListOrdered } from "lucide-react";
import { cn } from "~/lib/cn";
import { plural } from "~/lib/format";
import type { OutlineItem } from "~/lib/resources";
import { frenchSpacing } from "~/lib/resources";

/** Sommaire de l'article : liens vers chaque intertitre de la page. */
export function ArticleOutline({ items }: { items: OutlineItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Sommaire de l'article">
      <p className="px-3 text-xs font-semibold tracking-wide text-ink-500 uppercase">Sur cette page</p>
      <ol className="mt-3 space-y-0.5 border-l border-ink-200">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-ml-px flex min-h-10 items-center border-l-2 border-transparent py-1.5 pr-2 pl-3 text-sm leading-snug text-ink-600 transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              {frenchSpacing(item.text)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Sommaire repliable, pour les petits écrans (la colonne latérale n'y est
 * pas affichée). Repose sur <details>, utilisable au clavier sans script.
 */
export function ArticleOutlineDisclosure({ items, className }: { items: OutlineItem[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <details className={cn("group rounded-2xl bg-ink-50/70 ring-1 ring-ink-100 ring-inset", className)}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-3 font-display font-semibold text-ink-950 [&::-webkit-details-marker]:hidden">
        <ListOrdered aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
        <span className="flex-1">Sommaire de l'article</span>
        <span className="text-sm font-normal text-ink-500">{plural(items.length, "partie")}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-ink-500 transition-transform group-open:rotate-180"
        />
      </summary>
      <nav aria-label="Sommaire de l'article" className="px-2 pb-3">
        <ol className="space-y-0.5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="flex min-h-10 items-center gap-3 rounded-lg px-2 py-2 text-sm leading-snug text-ink-700 hover:bg-white hover:text-brand-700"
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent-500" />
                <span>{frenchSpacing(item.text)}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
