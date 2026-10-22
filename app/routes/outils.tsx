import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Route } from "./+types/outils";
import { AccessModelsGuide } from "~/components/catalog/AccessModelsGuide";
import { ActiveFilters, type FilterChip } from "~/components/catalog/ActiveFilters";
import { CatalogSearch } from "~/components/catalog/CatalogSearch";
import { FilterPanel } from "~/components/catalog/FilterPanel";
import { useCatalogState } from "~/components/catalog/useCatalogState";
import { ToolCard } from "~/components/tools/ToolCard";
import { Button, ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { EmptyState } from "~/components/ui/EmptyState";
import { Notice } from "~/components/ui/Notice";
import { PageHeader } from "~/components/ui/PageHeader";
import { getCategory } from "~/data/categories";
import { tools } from "~/data/tools";
import { canReceiveMessages } from "~/config/site";
import { getAccessLabel, normalize, sortOptions, type SortOption } from "~/lib/catalog";
import { activeFilterCount, resultsLabel } from "~/lib/catalog-ui";
import { cn } from "~/lib/cn";
import { pageMeta } from "~/lib/meta";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Explorer les outils IA",
    description:
      "Recherchez et comparez des outils d'intelligence artificielle par usage, catégorie et modèle d'accès (gratuit, freemium, payant), expliqués simplement.",
    path: "/outils",
  });
}

const SUGGEST_TOOL_LINK = "/contact?sujet=suggerer-outil";

/**
 * Annonce le nombre de résultats aux lecteurs d'écran, une fois la saisie
 * terminée (et pas à chaque lettre tapée), sans rien annoncer au chargement.
 */
function ResultsAnnouncer({ message, changeKey, enabled }: { message: string; changeKey: string; enabled: boolean }) {
  const [text, setText] = useState("");
  const settledKey = useRef<string | null>(null);
  const flip = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      if (settledKey.current === null) {
        settledKey.current = changeKey;
        return;
      }
      if (settledKey.current === changeKey) return;
      settledKey.current = changeKey;
      // Une espace insécable alternée force l'annonce même si le texte est identique.
      flip.current = !flip.current;
      setText(flip.current ? `${message} ` : message);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [changeKey, message, enabled]);

  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {text}
    </p>
  );
}

export default function OutilsPage() {
  const catalog = useCatalogState(tools);
  const { criteria, results, counts, isFiltered, hydrated } = catalog;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelId = useId();
  const sortId = useId();
  const resultsHeadingId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const countRef = useRef<HTMLParagraphElement>(null);

  const focusResults = useCallback(() => countRef.current?.focus(), []);

  const resetAndFocus = () => {
    catalog.resetFilters();
    focusResults();
  };

  const filterCount = activeFilterCount(criteria);
  const label = resultsLabel(results.length, isFiltered);
  // Une recherche sans lettre ni chiffre (« ? ») n'est pas prise en compte.
  const trimmedQuery = normalize(criteria.query) ? criteria.query.trim() : "";

  const chips: FilterChip[] = [];
  if (trimmedQuery) {
    chips.push({ key: "q", label: `Recherche\u00a0: «\u00a0${trimmedQuery}\u00a0»`, onRemove: catalog.clearQuery });
  }
  for (const slug of criteria.categories) {
    chips.push({
      key: `categorie:${slug}`,
      label: getCategory(slug)?.shortName ?? slug,
      onRemove: () => catalog.toggleCategory(slug),
    });
  }
  for (const value of criteria.access) {
    chips.push({
      key: `acces:${value}`,
      label: getAccessLabel(value),
      onRemove: () => catalog.toggleAccess(value),
    });
  }

  const changeKey = JSON.stringify([trimmedQuery, criteria.categories, criteria.access, criteria.sort]);

  const intro =
    tools.length > 1
      ? `Parcourez les ${tools.length} outils d'IA référencés, filtrez-les par catégorie ou par modèle d'accès, puis ouvrez une fiche pour découvrir leurs usages.`
      : "Recherchez un outil d'IA, filtrez par catégorie ou par modèle d'accès, puis ouvrez une fiche pour découvrir ses usages.";

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Explorer les outils" }]}
        title="Explorer les outils IA"
        description={<p>{intro}</p>}
      >
        <CatalogSearch
          value={hydrated ? catalog.query : ""}
          onChange={catalog.setQuery}
          onClear={catalog.clearQuery}
          onSubmit={catalog.commitQuery}
          inputRef={catalog.inputRef}
          hydrated={hydrated}
        />
      </PageHeader>

      <Container className="py-10 sm:py-12">
        {/* Mobile et tablette : bouton qui déplie le panneau des filtres. */}
        <div className="mb-4 lg:hidden">
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={filtersOpen}
            aria-controls={panelId}
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex h-12 w-full items-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-ink-900 shadow-sm ring-1 ring-ink-200 transition-colors ring-inset hover:bg-ink-50"
          >
            <SlidersHorizontal aria-hidden="true" className="size-4 text-brand-600" />
            <span>Filtres</span>
            {filterCount > 0 && (
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white tabular-nums">
                {filterCount}
                <span className="sr-only"> {filterCount > 1 ? "filtres actifs" : "filtre actif"}</span>
              </span>
            )}
            <ChevronDown
              aria-hidden="true"
              className={cn("ml-auto size-4 text-ink-500 transition-transform", filtersOpen && "rotate-180")}
            />
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <FilterPanel
            id={panelId}
            open={filtersOpen}
            criteria={criteria}
            counts={counts}
            resultCount={results.length}
            onToggleCategory={catalog.toggleCategory}
            onToggleAccess={catalog.toggleAccess}
            disabled={!hydrated}
            onShowResults={() => {
              setFiltersOpen(false);
              window.requestAnimationFrame(focusResults);
            }}
            onEscape={() => {
              setFiltersOpen(false);
              toggleRef.current?.focus();
            }}
          />

          <section aria-labelledby={resultsHeadingId} className="min-w-0">
            <h2 id={resultsHeadingId} className="sr-only">
              Résultats
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <p
                ref={countRef}
                tabIndex={-1}
                className="rounded-md font-display text-lg font-semibold text-ink-950 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
              >
                {label}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor={sortId} className="text-sm font-medium whitespace-nowrap text-ink-600">
                  Trier par
                </label>
                <div className="relative">
                  <select
                    id={sortId}
                    value={criteria.sort}
                    disabled={!hydrated}
                    onChange={(event) => catalog.setSort(event.target.value as SortOption)}
                    className="h-10 cursor-pointer appearance-none rounded-xl border-0 bg-white py-0 pr-9 pl-3 text-sm font-medium text-ink-900 shadow-sm ring-1 ring-ink-400 transition-shadow ring-inset hover:ring-ink-500 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-500"
                  />
                </div>
              </div>
            </div>

            <ResultsAnnouncer message={label} changeKey={changeKey} enabled={hydrated} />

            <div className={cn(chips.length > 0 && "mt-4")}>
              <ActiveFilters chips={chips} onReset={catalog.resetFilters} onFocusFallback={focusResults} />
            </div>

            {catalog.approximate && results.length > 0 && (
              <Notice className="mt-4" title="Résultats approchants">
                Aucun outil ne contient tous les mots de votre recherche. Voici ceux qui correspondent au
                moins en partie, du plus pertinent au moins pertinent.
              </Notice>
            )}

            <div className="mt-6">
              {results.length > 0 ? (
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((tool) => (
                    <li key={tool.slug}>
                      <ToolCard tool={tool} headingLevel="h3" />
                    </li>
                  ))}
                </ul>
              ) : tools.length === 0 ? (
                <EmptyState
                  title="Aucun outil n'est encore référencé"
                  description={
                    canReceiveMessages
                      ? "Le catalogue est en cours de constitution. Vous connaissez un outil utile ? Vous pouvez nous le proposer."
                      : "Le catalogue est en cours de constitution."
                  }
                  action={
                    canReceiveMessages ? <ButtonLink to={SUGGEST_TOOL_LINK}>Suggérer un outil</ButtonLink> : undefined
                  }
                />
              ) : (
                <EmptyState
                  title="Aucun outil ne correspond à votre recherche"
                  description={
                    <p>
                      {trimmedQuery && filterCount > 0
                        ? `Aucun résultat pour «\u00a0${trimmedQuery}\u00a0» avec les filtres choisis. Essayez un autre mot ou retirez un filtre.`
                        : trimmedQuery
                          ? `Aucun résultat pour «\u00a0${trimmedQuery}\u00a0». Essayez un mot plus court ou plus général, et vérifiez l'orthographe.`
                          : "Aucun outil ne remplit tous les filtres choisis. Retirez un filtre pour élargir la recherche."}{" "}
                      {canReceiveMessages
                        ? "Si un outil manque au catalogue, vous pouvez nous le suggérer."
                        : "Un outil manque\u00a0? Vous pourrez bientôt nous le suggérer, dès que le formulaire de contact sera activé."}
                    </p>
                  }
                  action={
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button onClick={resetAndFocus}>Réinitialiser les filtres</Button>
                      {canReceiveMessages && (
                        <ButtonLink to={SUGGEST_TOOL_LINK} variant="secondary">
                          Suggérer un outil
                        </ButtonLink>
                      )}
                    </div>
                  }
                />
              )}
            </div>
          </section>
        </div>
      </Container>

      <AccessModelsGuide />
    </>
  );
}
