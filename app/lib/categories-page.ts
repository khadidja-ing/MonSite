/**
 * Petites fonctions utilisées par les pages « Catégories » (/categories et
 * /categories/<slug>) : liens vers le catalogue filtré, nombre d'outils,
 * ordre d'affichage des outils d'une catégorie…
 *
 * Elles ne dépendent pas de l'affichage et sont vérifiées par des tests
 * automatiques (categories-page.test.ts).
 */
import type { Category, CategorySlug, Tool } from "~/data/types";
import { criteriaToSearchParams, defaultCriteria, getToolsByCategory } from "./catalog";

/** Lien vers le catalogue filtré sur une catégorie : categoryCatalogLink("texte") → "/outils?categorie=texte". */
export function categoryCatalogLink(slug: CategorySlug): string {
  const params = criteriaToSearchParams({ ...defaultCriteria, categories: [slug] });
  return `/outils?${params.toString()}`;
}

/**
 * Description de la page d'une catégorie pour les moteurs de recherche
 * (environ 120 à 170 caractères) : le résumé de la catégorie, complété.
 */
export function categoryMetaDescription(category: Pick<Category, "summary">): string {
  const summary = category.summary.trim();
  const sentence = /[.!?…]$/.test(summary) ? summary : `${summary}.`;
  return `${sentence} Exemples d'utilisation et outils d'IA expliqués simplement pour bien choisir.`;
}

/** Toutes les catégories sauf celle indiquée, dans l'ordre d'affichage. */
export function getOtherCategories(all: Category[], slug: CategorySlug): Category[] {
  return all.filter((category) => category.slug !== slug);
}

/**
 * Nombre d'outils de chaque catégorie (principale ou secondaire).
 * Un outil rattaché à deux catégories est compté dans chacune : la somme des
 * compteurs peut donc dépasser le nombre total d'outils.
 */
export function countToolsByCategory(
  tools: Tool[],
  all: Category[],
): Record<CategorySlug, number> {
  const counts = {} as Record<CategorySlug, number>;
  for (const category of all) {
    counts[category.slug] = getToolsByCategory(tools, category.slug).length;
  }
  return counts;
}

/**
 * Outils d'une catégorie, dans l'ordre d'affichage de sa page : d'abord ceux
 * dont c'est la catégorie principale, puis ceux qui y sont aussi rattachés,
 * chaque groupe étant trié par nom.
 */
export function getCategoryPageTools(tools: Tool[], slug: CategorySlug): Tool[] {
  const inCategory = getToolsByCategory(tools, slug);
  return [
    ...inCategory.filter((tool) => tool.category === slug),
    ...inCategory.filter((tool) => tool.category !== slug),
  ];
}

/** Vrai si au moins un outil de la liste a une autre catégorie principale que `slug`. */
export function hasToolsFromOtherCategories(tools: Tool[], slug: CategorySlug): boolean {
  return tools.some((tool) => tool.category !== slug);
}
