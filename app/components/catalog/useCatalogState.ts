import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { categories } from "~/data/categories";
import type { AccessModel, CategorySlug, Tool } from "~/data/types";
import {
  accessModels,
  criteriaFromSearchParams,
  criteriaToSearchParams,
  defaultCriteria,
  filterTools,
  hasActiveFilters,
  type CatalogCriteria,
  type SortOption,
} from "~/lib/catalog";
import { facetCounts, toggleInList } from "~/lib/catalog-ui";
import { useHydrated } from "~/lib/use-hydrated";

const categoryOrder = categories.map((category) => category.slug);
const accessOrder = accessModels.map((model) => model.value);

/** Délai avant d'inscrire la recherche dans l'adresse, pendant la saisie. */
const QUERY_DELAY_MS = 300;

/** Forme « propre » d'une adresse : seuls les critères reconnus, dans l'ordre. */
function canonicalKey(params: URLSearchParams): string {
  return criteriaToSearchParams(criteriaFromSearchParams(params)).toString();
}

/**
 * État de la page catalogue : recherche, filtres et tri.
 *
 * - Les critères sont recopiés dans l'adresse de la page (?q=…&categorie=…),
 *   ce qui permet de partager un lien vers une recherche précise.
 * - Avant que la page soit « active » dans le navigateur, on affiche les
 *   critères par défaut : c'est exactement ce que contient le HTML
 *   pré-généré. L'adresse n'est lue qu'ensuite.
 * - L'affichage réagit immédiatement (état local) ; l'adresse suit : tout de
 *   suite pour les filtres, après une courte pause de frappe pour la recherche.
 * - Si l'adresse change par ailleurs (lien du menu…), l'état local s'aligne.
 */
export function useCatalogState(tools: Tool[]) {
  const hydrated = useHydrated();
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsKey = searchParams.toString();

  const inputRef = useRef<HTMLInputElement>(null);
  const [criteria, setCriteriaState] = useState<CatalogCriteria>(() =>
    hydrated ? criteriaFromSearchParams(searchParams) : defaultCriteria,
  );
  const criteriaRef = useRef(criteria);
  /** Dernière adresse prise en compte. */
  const syncedKey = useRef<string | null>(hydrated ? paramsKey : null);
  /** Adresses que nous avons demandées et qui ne sont pas encore arrivées. */
  const pendingKeys = useRef<string[]>([]);
  const setParamsRef = useRef(setSearchParams);

  useLayoutEffect(() => {
    setParamsRef.current = setSearchParams;
  });

  const setCriteria = useCallback((next: CatalogCriteria) => {
    criteriaRef.current = next;
    setCriteriaState(next);
  }, []);

  /** Recopie les critères dans l'adresse, sans créer d'entrée d'historique ni remonter en haut. */
  const pushToUrl = useCallback((next: CatalogCriteria) => {
    const params = criteriaToSearchParams(next);
    const key = params.toString();
    const latest =
      pendingKeys.current.at(-1) ?? canonicalKey(new URLSearchParams(syncedKey.current ?? ""));
    if (key === latest) return;
    pendingKeys.current.push(key);
    setParamsRef.current(params, { replace: true, preventScrollReset: true });
  }, []);

  // Adresse → état local : au chargement, ou si l'adresse change par ailleurs.
  useLayoutEffect(() => {
    if (!hydrated || syncedKey.current === paramsKey) return;
    syncedKey.current = paramsKey;

    const index = pendingKeys.current.indexOf(paramsKey);
    if (index !== -1) {
      // C'est l'écho d'une mise à jour que nous avons demandée : rien à faire.
      pendingKeys.current = pendingKeys.current.slice(index + 1);
      return;
    }
    pendingKeys.current = [];
    const fromUrl = criteriaFromSearchParams(new URLSearchParams(paramsKey));
    // On ne remplace jamais le texte en cours de frappe.
    const typing = document.activeElement === inputRef.current;
    setCriteria({ ...fromUrl, query: typing ? criteriaRef.current.query : fromUrl.query });
  }, [hydrated, paramsKey, setCriteria]);

  // Recherche → adresse, après une courte pause de frappe.
  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => pushToUrl(criteriaRef.current), QUERY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [hydrated, criteria.query, pushToUrl]);

  /** Modifie les critères : affichage immédiat, puis mise à jour de l'adresse. */
  const update = useCallback(
    (change: (current: CatalogCriteria) => Partial<CatalogCriteria>) => {
      const current = criteriaRef.current;
      const next = { ...current, ...change(current) };
      setCriteria(next);
      pushToUrl(next);
    },
    [pushToUrl, setCriteria],
  );

  const setQuery = useCallback(
    (query: string) => setCriteria({ ...criteriaRef.current, query }),
    [setCriteria],
  );

  /** Inscrit tout de suite la recherche dans l'adresse (touche Entrée). */
  const commitQuery = useCallback(() => pushToUrl(criteriaRef.current), [pushToUrl]);

  const clearQuery = useCallback(() => update(() => ({ query: "" })), [update]);

  const toggleCategory = useCallback(
    (slug: CategorySlug) =>
      update((current) => ({ categories: toggleInList(current.categories, slug, categoryOrder) })),
    [update],
  );

  const toggleAccess = useCallback(
    (value: AccessModel) =>
      update((current) => ({ access: toggleInList(current.access, value, accessOrder) })),
    [update],
  );

  const setSort = useCallback((sort: SortOption) => update(() => ({ sort })), [update]);

  /** Efface la recherche et les filtres (le tri choisi est conservé). */
  const resetFilters = useCallback(
    () => update(() => ({ query: "", categories: [], access: [] })),
    [update],
  );

  const effective = hydrated ? criteria : defaultCriteria;
  const results = useMemo(() => filterTools(tools, effective), [tools, effective]);
  const counts = useMemo(() => facetCounts(tools, effective), [tools, effective]);

  return {
    hydrated,
    inputRef,
    query: effective.query,
    setQuery,
    commitQuery,
    clearQuery,
    criteria: effective,
    results,
    counts,
    isFiltered: hasActiveFilters(effective),
    toggleCategory,
    toggleAccess,
    setSort,
    resetFilters,
  };
}
