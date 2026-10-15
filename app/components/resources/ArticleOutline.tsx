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
