/**
 * Petites fonctions utilisées par la page catalogue (/outils) et par les
 * fiches outils (/outils/<slug>) : libellés, compteurs des filtres, outils
 * similaires, description pour Google…
 *
 * Elles ne dépendent pas de l'affichage et sont vérifiées par des tests
 * automatiques (catalog-ui.test.ts). La logique de recherche et de filtrage
 * elle-même se trouve dans catalog.ts.
 */
import { categories } from "~/data/categories";
import type { AccessModel, CategorySlug, Tool } from "~/data/types";
import { accessModels, filterTools, type CatalogCriteria } from "./catalog";

const collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

/**
 * Explication détaillée de chaque modèle d'accès, pour un débutant.
 * Affichée sur la page catalogue et sur chaque fiche outil.
 */
export const accessExplanations: Record<AccessModel, string> = {
  gratuit:
    "L'outil peut être utilisé sans payer, sans offre payante principale. Une inscription peut toutefois être demandée.",
  freemium:
    "« Freemium » vient de l'anglais free (gratuit) et premium. Une version gratuite existe, mais elle est limitée (nombre d'utilisations, fonctions disponibles…). Des abonnements payants débloquent davantage de possibilités.",
  payant:
    "Il faut payer (abonnement ou achat) pour utiliser l'outil dans la durée. Un essai gratuit limité dans le temps peut parfois exister.",
  "a-confirmer":
    "Nous n'avons pas encore vérifié les conditions d'accès de cet outil. Consultez son site officiel pour connaître les offres actuelles.",
};

/** Phrase rappelant que les offres changent, affichée sur chaque fiche. */
export const pricingDisclaimer =
  "Les offres et les prix des outils d'IA changent souvent : vérifiez toujours les conditions actuelles sur le site officiel avant de vous inscrire ou de payer.";

/**
 * Nombre de résultats qu'on obtiendrait en cochant chaque option, compte tenu
 * de la recherche et des autres groupes de filtres déjà choisis.
 * Exemple : avec « Gratuit » coché, le compteur de « Images » indique combien
 * d'outils gratuits de création d'images existent.
 */
export interface FacetCounts {
  categories: Record<CategorySlug, number>;
  access: Record<AccessModel, number>;
}

export function facetCounts(tools: Tool[], criteria: CatalogCriteria): FacetCounts {
  const categoryCounts = {} as Record<CategorySlug, number>;
  for (const category of categories) {
    categoryCounts[category.slug] = filterTools(tools, {
      ...criteria,
      categories: [category.slug],
    }).length;
  }

  const accessCounts = {} as Record<AccessModel, number>;
  for (const model of accessModels) {
    accessCounts[model.value] = filterTools(tools, { ...criteria, access: [model.value] }).length;
  }

  return { categories: categoryCounts, access: accessCounts };
}

/**
 * Ajoute ou retire une valeur d'une liste, en gardant l'ordre de référence
 * (l'ordre d'affichage des filtres) pour que l'adresse reste stable.
 */
export function toggleInList<T>(list: readonly T[], value: T, order: readonly T[]): T[] {
  const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  return order.filter((item) => next.includes(item));
}

/** Nombre de filtres cochés (catégories + modèles d'accès), hors recherche texte. */
export function activeFilterCount(criteria: Pick<CatalogCriteria, "categories" | "access">): number {
  return criteria.categories.length + criteria.access.length;
}

/**
 * Phrase décrivant le nombre de résultats.
 * resultsLabel(0, true) → « Aucun outil trouvé »
 * resultsLabel(12, true) → « 12 outils trouvés »
 * resultsLabel(12, false) → « 12 outils référencés »
 */
export function resultsLabel(count: number, filtered: boolean): string {
  if (count <= 0) return filtered ? "Aucun outil trouvé" : "Aucun outil référencé pour le moment";
  const noun = count > 1 ? "outils" : "outil";
  const participle = filtered ? "trouvé" : "référencé";
  return `${count} ${noun} ${participle}${count > 1 ? "s" : ""}`;
}

/** Libellé du bouton qui referme le panneau des filtres sur mobile. */
export function showResultsLabel(count: number): string {
  if (count <= 0) return "Aucun résultat : fermer les filtres";
  if (count === 1) return "Afficher le résultat";
  return `Afficher les ${count} résultats`;
}

/** Catégorie principale puis catégories secondaires, sans doublon. */
export function toolCategorySlugs(tool: Pick<Tool, "category" | "otherCategories">): CategorySlug[] {
  return [...new Set([tool.category, ...(tool.otherCategories ?? [])])];
}

/**
 * Outils similaires : autres outils de la même catégorie principale,
 * ceux mis en avant d'abord, puis par ordre alphabétique.
 */
export function getSimilarTools(tools: Tool[], tool: Tool, max = 3): Tool[] {
  return tools
    .filter((other) => other.slug !== tool.slug && other.category === tool.category)
    .sort((a, b) => {
      if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
      return collator.compare(a.name, b.name);
    })
    .slice(0, Math.max(0, max));
}

/** Coupe un texte trop long à la fin d'un mot et ajoute « … ». */
export function truncateText(text: string, maxLength: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${base.replace(/[\s,;:.!?…-]+$/u, "")}…`;
}

const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 160;

/**
 * Description d'une fiche pour les moteurs de recherche (120 à 160 caractères
 * quand c'est possible), construite à partir de la phrase d'accroche.
 */
export function buildToolDescription(tool: Pick<Tool, "name" | "tagline">): string {
  let base = tool.tagline.replace(/\s+/g, " ").trim();
  if (!base) base = `${tool.name} : outil d'intelligence artificielle.`;
  if (!/[.!?…]$/u.test(base)) base += ".";

  if (base.length >= DESCRIPTION_MIN) return truncateText(base, DESCRIPTION_MAX);

  const suffixes = [
    ` Découvrez ses principaux usages, son modèle d'accès et le lien vers son site officiel.`,
    ` Principaux usages, modèle d'accès et lien vers le site officiel.`,
    ` Usages, modèle d'accès et site officiel.`,
    ` Usages et modèle d'accès.`,
  ];
  for (const suffix of suffixes) {
    if (base.length + suffix.length <= DESCRIPTION_MAX) return base + suffix;
  }
  return base;
}

/**
 * Découpe l'adresse d'une source en nom de domaine et chemin lisibles.
 * "https://www.example.com/fr/tarifs/" → { domain: "example.com", path: "/fr/tarifs" }
 */
export function describeSource(url: string): { domain: string; path: string } {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    let path = parsed.pathname;
    try {
      path = decodeURI(path);
    } catch {
      // Adresse mal encodée : on garde le chemin tel quel.
    }
    path = path.replace(/\/+$/, "");
    if (parsed.search) path += parsed.search;
    return { domain, path };
  } catch {
    return { domain: url, path: "" };
  }
}
