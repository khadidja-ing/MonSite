import { Lightbulb, MessageSquareQuote } from "lucide-react";
import type { ArticleBlock } from "~/data/types";
import { cn } from "~/lib/cn";
import { frenchSpacing, isExampleTip, withHeadingIds } from "~/lib/resources";

/**
 * Affiche le contenu d'un article, bloc par bloc, avec une mise en forme
 * pensée pour la lecture (taille de texte confortable, interlignage aéré).
 * Les intertitres sont de niveau 2 : le titre de la page est le seul h1.
 * Un encadré dont le texte est entre guillemets (« … ») est présenté comme
 * un exemple de consigne ; les autres comme une astuce.
 */
export function ArticleBody({ body, className }: { body: ArticleBlock[]; className?: string }) {
  const blocks = withHeadingIds(body);

  return (
    <div className={cn("text-lg leading-8 text-ink-700", className)}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        const isFirst = index === 0;

        switch (block.type) {
          case "heading":
            return (
              <h2
                key={key}
                id={block.id}
                className={cn(
                  "scroll-mt-4 text-2xl leading-tight font-bold tracking-tight sm:text-[1.75rem]",
                  isFirst ? "mt-0" : "mt-12 sm:mt-14",
                )}
              >
                {frenchSpacing(block.text)}
              </h2>
            );

          case "list":
            return (
              <ul key={key} className="mt-5 space-y-3">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-3.5">
                    <span aria-hidden="true" className="mt-[0.8rem] size-1.5 shrink-0 rounded-full bg-accent-500" />
                    <span>{frenchSpacing(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "tip": {
            const example = isExampleTip(block);
            const TipIcon = example ? MessageSquareQuote : Lightbulb;
            return (
              <div
                key={key}
                role="note"
                aria-label={block.title ?? (example ? "Exemple" : "Bon à savoir")}
                className={cn(
                  "mt-7 flex gap-3.5 rounded-2xl p-4 ring-1 ring-inset sm:gap-4 sm:p-6",
                  example ? "bg-white shadow-card ring-ink-200" : "bg-accent-50/70 ring-accent-100",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset sm:size-9 sm:rounded-xl",
                    example ? "bg-brand-50 text-brand-700 ring-brand-100" : "bg-white text-accent-700 ring-accent-100",
                  )}
                >
                  <TipIcon aria-hidden="true" className="size-4 sm:size-5" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-display text-base font-semibold text-ink-950">
                    {frenchSpacing(block.title ?? (example ? "Exemple" : "Bon à savoir"))}
                  </p>
                  <p className="mt-1.5 text-base leading-7 text-ink-800">{frenchSpacing(block.text)}</p>
                </div>
              </div>
            );
          }

          case "paragraph":
          default:
            return (
              <p
                key={key}
                className={cn(isFirst ? "text-xl leading-9 text-ink-800" : "mt-5")}
              >
                {frenchSpacing(block.text)}
              </p>
            );
        }
      })}
    </div>
  );
}
