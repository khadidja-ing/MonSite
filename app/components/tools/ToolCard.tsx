import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { getCategory } from "~/data/categories";
import type { Tool } from "~/data/types";
import { displayDomain } from "~/lib/format";
import { Badge } from "../ui/Badge";
import { AccessBadge } from "./AccessBadge";
import { ToolLogo } from "./ToolLogo";

/**
 * Carte d'un outil dans le catalogue.
 * Le titre mène à la fiche détaillée ; un lien distinct ouvre le site officiel.
 */
export function ToolCard({ tool, headingLevel = "h3" }: { tool: Tool; headingLevel?: "h2" | "h3" }) {
  const category = getCategory(tool.category);
  const Heading = headingLevel;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start gap-4">
        <ToolLogo tool={tool} />
        <div className="min-w-0 flex-1">
          <Heading className="font-display text-lg font-semibold text-ink-950">
            <Link
              to={`/outils/${tool.slug}`}
              className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-brand-700"
            >
              {tool.name}
            </Link>
          </Heading>
          <p className="truncate text-sm text-ink-500">{tool.publisher}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-700">{tool.tagline}</p>

      <ul className="mt-4 space-y-1.5 text-sm text-ink-600" aria-label="Principaux usages">
        {tool.uses.slice(0, 3).map((use) => (
          <li key={use} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500" />
            <span>{use}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-2">
          {category && <Badge>{category.shortName}</Badge>}
          <AccessBadge access={tool.access} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-100 pt-4 text-sm">
          <span className="font-semibold text-brand-700 group-hover:underline" aria-hidden="true">
            En savoir plus
          </span>
          <a
            href={tool.website}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 rounded text-ink-600 hover:text-brand-700 hover:underline"
          >
            {displayDomain(tool.website)}
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only"> — site officiel de {tool.name} (nouvel onglet)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
