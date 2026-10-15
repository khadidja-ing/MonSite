import { ArrowRight, BookOpen, CalendarDays, Clock, LayoutGrid, Library } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { FinalCta } from "~/components/home/FinalCta";
import { ArticleCard, FeaturedArticleCard } from "~/components/resources/ArticleCard";
import { ResourceTypeFilter } from "~/components/resources/ResourceTypeFilter";
import { ResourceTypesOverview } from "~/components/resources/ResourceTypesOverview";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { EmptyState } from "~/components/ui/EmptyState";
import { Notice } from "~/components/ui/Notice";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { articles } from "~/data/articles";
import { getResourceType, resourceTypes } from "~/data/resource-types";
import { formatDate, plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";
import { pageMeta } from "~/lib/meta";
import {
  countArticlesByType,
  filterArticlesByType,
  frenchSpacing,
  getStartingArticle,
  joinFrench,
  lastModified,
  parseResourceType,
  sortArticles,
} from "~/lib/resources";
import { useHydrated } from "~/lib/use-hydrated";
import type { Route } from "./+types/ressources";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Ressources et guides pour débuter avec l'IA",
    description:
      "Guides, tutoriels et conseils pour débuter avec l'intelligence artificielle : comprendre les bases, bien formuler vos demandes et utiliser l'IA prudemment.",
    path: "/ressources",
  });
}

/** Identifiant de la liste d'articles (ancre /ressources#articles). */
const LIST_ID = "articles";

/* Valeurs calculées une fois, à partir des données réelles. */
const sortedArticles = sortArticles(articles);
const counts = countArticlesByType(articles);
const startingArticle = getStartingArticle(articles);
const publishedTypes = resourceTypes.filter((type) => counts[type.slug] > 0);
const upcomingTypes = resourceTypes.filter((type) => counts[type.slug] === 0);
const latestDate = articles.map(lastModified).sort().at(-1);
const readingTimes = articles.map((article) => article.readingMinutes);

function readingRangeLabel(): string | null {
  if (readingTimes.length === 0) return null;
  const min = Math.min(...readingTimes);
  const max = Math.max(...readingTimes);
  return min === max ? `${min} min de lecture` : `De ${min} à ${max} min de lecture`;
}

function lowerNames(types: { name: string }[]): string {
  return joinFrench(types.map((type) => type.name.toLowerCase()));
}

export default function RessourcesPage() {
  const hydrated = useHydrated();
  const [searchParams] = useSearchParams();
  // L'adresse n'est lue qu'une fois la page active : le premier affichage
  // correspond exactement au HTML pré-généré (tous les articles).
  const activeType = hydrated ? parseResourceType(searchParams.get("type")) : null;
  const activeInfo = activeType ? getResourceType(activeType) : undefined;

  const visible = filterArticlesByType(sortedArticles, activeType);
  const featured =
    !activeType && visible.length >= 2 && startingArticle && visible.includes(startingArticle)
      ? startingArticle
      : undefined;
  const gridArticles = featured ? visible.filter((article) => article !== featured) : visible;

  const PanelIcon = activeInfo ? getIcon(activeInfo.icon) : LayoutGrid;
  const panelTitle = activeInfo?.name ?? "Tous les contenus";
  const panelDescription =
    activeInfo?.description ??
    (publishedTypes.length > 0
      ? `Tous les articles publiés, du plus récent au plus ancien : ${lowerNames(publishedTypes)}.`
      : "Les premiers articles sont en préparation.");
  const countLabel = activeType
    ? visible.length > 0
      ? `${plural(visible.length, "article")} dans cette rubrique`
      : "Aucun article pour l'instant"
    : visible.length > 0
      ? `${plural(visible.length, "article")} au total`
      : "Aucun article pour l'instant";

  const readingRange = readingRangeLabel();

  return (
    <>
      <PageHeader
        eyebrow="Ressources"
        title="Ressources et guides"
        breadcrumbs={[{ label: "Ressources" }]}
        description={
          <p>
            Des explications claires pour comprendre l'intelligence artificielle, bien formuler vos
            demandes et l'utiliser de façon responsable. Aucune connaissance technique n'est
            nécessaire : chaque article part des bases et explique le vocabulaire employé.
          </p>
        }
      >
        {articles.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
            <li className="flex items-center gap-2">
              <BookOpen aria-hidden="true" className="size-4 text-accent-600" />
              {plural(articles.length, "article")} publié{articles.length > 1 ? "s" : ""}
            </li>
            {readingRange && (
              <li className="flex items-center gap-2">
                <Clock aria-hidden="true" className="size-4 text-accent-600" />
                {readingRange}
              </li>
            )}
            {latestDate && (
              <li className="flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="size-4 text-accent-600" />
                <span>
                  Dernière mise à jour le <time dateTime={latestDate}>{formatDate(latestDate)}</time>
                </span>
              </li>
            )}
          </ul>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {startingArticle ? (
            <ButtonLink to={`/ressources/${startingArticle.slug}`} size="lg">
              Commencer par les bases
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          ) : null}
          <ButtonLink to="/outils" variant={startingArticle ? "secondary" : "primary"} size="lg">
            Explorer les outils
          </ButtonLink>
        </div>
      </PageHeader>

      {/* Liste des articles, filtrable par type */}
      <section id={LIST_ID} aria-labelledby="articles-titre" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 id="articles-titre" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Parcourir les articles
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink-600">
              Choisissez un type de contenu pour affiner la liste.
            </p>
          </div>

          <ResourceTypeFilter
            className="mt-8"
            active={activeType}
            counts={counts}
            total={articles.length}
          />

          <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-ink-50/70 p-5 ring-1 ring-ink-100 ring-inset sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-card ring-1 ring-ink-100">
                <PanelIcon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-display font-semibold text-ink-950">{panelTitle}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{frenchSpacing(panelDescription)}</p>
              </div>
            </div>
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="shrink-0 text-sm font-semibold text-ink-700 sm:text-right"
            >
              {countLabel}
            </p>
          </div>

          {visible.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                icon={activeInfo ? getIcon(activeInfo.icon) : Library}
                title={frenchSpacing(
                  activeInfo
                    ? `Aucun article dans « ${activeInfo.name} » pour l'instant`
                    : "Les premiers articles arrivent bientôt",
                )}
                description={
                  articles.length > 0
                    ? "Cette rubrique est en préparation : les contenus y seront ajoutés progressivement, une fois rédigés et vérifiés. En attendant, découvrez les articles déjà disponibles."
                    : "Les premiers guides sont en cours de rédaction. En attendant, vous pouvez parcourir le catalogue des outils, classés par usage."
                }
                action={
                  articles.length > 0 ? (
                    <ButtonLink to="/ressources" replace preventScrollReset>
                      Voir tous les articles
                    </ButtonLink>
                  ) : (
                    <ButtonLink to="/outils">Explorer les outils</ButtonLink>
                  )
                }
              />
            </div>
          ) : (
            <div key={activeType ?? "tout"} className="animate-fade-in">
              {featured && (
                <div className="mt-8">
                  <FeaturedArticleCard article={featured} />
                </div>
              )}
              {gridArticles.length > 0 && (
                <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {gridArticles.map((article) => (
                    <li key={article.slug}>
                      <ArticleCard article={article} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* Vue d'ensemble des rubriques (publiées et à venir) */}
      <section aria-labelledby="rubriques-titre" className="border-y border-ink-100 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="rubriques-titre"
            eyebrow="Rubriques"
            title="Ce que vous trouverez ici"
            description={frenchSpacing(
              `${plural(resourceTypes.length, "type")} de contenus pour comprendre l'IA, passer à la pratique et suivre ses évolutions.` +
                (upcomingTypes.length > 0
                  ? upcomingTypes.length > 1
                    ? ` Les rubriques ${lowerNames(upcomingTypes)} sont en préparation.`
                    : ` La rubrique ${lowerNames(upcomingTypes)} est en préparation.`
                  : ""),
            )}
          />

          <div className="mt-10">
            <ResourceTypesOverview counts={counts} listAnchor={LIST_ID} />
          </div>

          <Notice className="mt-10 max-w-3xl" title="Une rubrique qui s'enrichit progressivement">
            <p>
              De nouveaux contenus sont ajoutés au fil du temps, une fois rédigés et vérifiés. Les
              articles de la rubrique «&nbsp;Nouveautés&nbsp;» citeront toujours leurs sources et leur
              date de publication, pour que vous sachiez d'où vient l'information et si elle est encore
              d'actualité.
            </p>
            <p className="mt-2">
              Une question, ou un sujet que vous aimeriez voir traité&nbsp;?{" "}
              <Link to="/contact" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800">
                Écrivez-nous
              </Link>
              .
            </p>
          </Notice>
        </Container>
      </section>

      <div className="pt-20 sm:pt-24">
        <FinalCta
          id="ressources-cta-titre"
          title="Prêt à passer à la pratique ?"
          description="Parcourez le catalogue : les outils y sont classés par usage et présentés simplement, avec leur modèle d'accès et un lien vers leur site officiel."
          primary={{ label: "Explorer les outils", to: "/outils" }}
          secondary={{ label: "Voir les catégories", to: "/categories" }}
        />
      </div>
    </>
  );
}
