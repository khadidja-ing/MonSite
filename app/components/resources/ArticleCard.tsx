import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router";
import type { Article } from "~/data/types";
import { frenchSpacing, getOutline } from "~/lib/resources";
import { ArticleDate, LevelBadge, ReadingTime, ResourceTypeBadge } from "./ResourceBadges";

/** Lien du titre : toute la carte devient cliquable (pseudo-élément). */
const titleLinkClasses =
  "rounded after:absolute after:inset-0 after:rounded-[inherit] after:content-[''] hover:text-brand-700";

/** Carte d'un article dans la liste des ressources. */
export function ArticleCard({ article, headingLevel = "h3" }: { article: Article; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover">
      <div className="flex flex-wrap items-center gap-2">
        <ResourceTypeBadge type={article.type} />
        <LevelBadge level={article.level} />
      </div>
      <Heading className="mt-4 font-display text-xl leading-snug font-semibold text-ink-950">
        <Link to={`/ressources/${article.slug}`} className={titleLinkClasses}>
          {frenchSpacing(article.title)}
        </Link>
      </Heading>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">{frenchSpacing(article.summary)}</p>
      <div className="mt-auto pt-6">
        <div className="flex items-end justify-between gap-3 border-t border-ink-100 pt-4 text-sm text-ink-500">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <ArticleDate date={article.publishedOn} />
            <ReadingTime minutes={article.readingMinutes} />
          </div>
          <ArrowRight
            aria-hidden="true"
            className="mb-0.5 size-4 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </article>
  );
}

/**
 * Grande carte mise en avant (« Par où commencer ? »), avec le sommaire de
 * l'article pour donner un aperçu de son contenu.
 */
export function FeaturedArticleCard({ article, headingLevel = "h3" }: { article: Article; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const outline = getOutline(article.body).slice(0, 6);

  return (
    <article className="group relative grid overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="flex flex-col p-6 sm:p-8 lg:p-10">
        <p className="flex items-center gap-2 text-sm font-semibold text-accent-700">
          <Compass aria-hidden="true" className="size-4" />
          Par où commencer ?
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ResourceTypeBadge type={article.type} />
          <LevelBadge level={article.level} />
        </div>
        <Heading className="mt-4 font-display text-2xl leading-tight font-bold tracking-tight text-ink-950 sm:text-3xl">
          <Link to={`/ressources/${article.slug}`} className={titleLinkClasses}>
            {frenchSpacing(article.title)}
          </Link>
        </Heading>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
          {frenchSpacing(article.summary)}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-4 pt-8">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-500">
            <ArticleDate date={article.publishedOn} />
            <ReadingTime minutes={article.readingMinutes} />
          </div>
          <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            Lire l'article
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>

      {outline.length > 0 && (
        <div className="hidden border-t border-ink-100 bg-ink-50/70 p-6 sm:p-8 md:block lg:border-t-0 lg:border-l lg:p-10">
          <p className="text-xs font-semibold tracking-wide text-ink-500 uppercase">Au sommaire</p>
          <ul className="mt-4 space-y-3">
            {outline.map((item) => (
              <li key={item.id} className="flex gap-3 text-sm leading-snug text-ink-700">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-500" />
                <span>{frenchSpacing(item.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
