/**
 * Logique du catalogue : recherche, filtres et tri des outils.
 *
 * Ces fonctions ne dépendent pas de l'affichage : elles reçoivent une liste
 * d'outils et des critères, et renvoient la liste à afficher. Elles sont
 * vérifiées par des tests automatiques (catalog.test.ts).
 */
import { categories } from "~/data/categories";
import type { AccessModel, CategorySlug, Tool } from "~/data/types";

export type SortOption = "pertinence" | "nom" | "acces";

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: "pertinence", label: "Pertinence" },
  { value: "nom", label: "Nom (A → Z)" },
  { value: "acces", label: "Accès gratuit d'abord" },
];

export const accessModels: { value: AccessModel; label: string; description: string }[] = [
  { value: "gratuit", label: "Gratuit", description: "Utilisable gratuitement." },
  {
    value: "freemium",
    label: "Freemium",
    description: "Version gratuite limitée, avec des offres payantes.",
  },
  { value: "payant", label: "Payant", description: "Abonnement ou achat nécessaire." },
  {
    value: "a-confirmer",
    label: "À confirmer",
    description: "Information non vérifiée : consultez le site officiel.",
  },
];

export function getAccessLabel(access: AccessModel): string {
  return accessModels.find((model) => model.value === access)?.label ?? access;
}

export interface CatalogCriteria {
  query: string;
  categories: CategorySlug[];
  access: AccessModel[];
  sort: SortOption;
}

export const defaultCriteria: CatalogCriteria = {
  query: "",
  categories: [],
  access: [],
  sort: "pertinence",
};

/** Met en minuscules et retire les accents : « Vidéo » et « video » se valent. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function categoryNames(tool: Tool): string[] {
  const slugs = [tool.category, ...(tool.otherCategories ?? [])];
  return slugs.flatMap((slug) => {
    const category = categories.find((c) => c.slug === slug);
    return category ? [category.name, category.shortName] : [];
  });
}

/**
 * Mots trop courants pour aider la recherche (« je veux faire une vidéo »
 * → « vidéo »). Ils sont ignorés, sauf si la recherche ne contient qu'eux.
 */
const STOP_WORDS = new Set(
  (
    "a au aux avec c ce ces cet cette d dans de des du en est et il j je l la le les leur " +
    "m ma me mes mon n ne nos notre on ou par pas pour qu que qui sa se ses son sur " +
    "ta te tes ton un une vos votre y faire fais veux voudrais aimerais souhaite besoin " +
    "comment quel quelle quels quelles outil outils ia logiciel application app"
  ).split(" "),
);

/** Mots utiles d'une recherche, sans accents ni mots courants. */
export function queryTerms(query: string): string[] {
  const words = normalize(query).split(" ").filter(Boolean);
  const meaningful = words.filter((word) => !STOP_WORDS.has(word));
  return meaningful.length > 0 ? meaningful : words;
}

/** Racine approximative d'un mot : « traduire » et « traduction » partagent « tradu ». */
function stem(term: string): string {
  return term.length > 5 ? term.slice(0, 5) : term;
}

interface SearchableTool {
  name: string;
  publisher: string;
  summary: string;
  details: string;
  words: { publisher: string[]; summary: string[]; details: string[]; name: string[] };
}

function searchable(tool: Tool): SearchableTool {
  const name = normalize(tool.name);
  const publisher = normalize(tool.publisher);
  const summary = normalize([tool.tagline, ...tool.uses].join(" "));
  const details = normalize([tool.description, ...categoryNames(tool)].join(" "));
  const split = (text: string) => text.split(" ");
  return {
    name,
    publisher,
    summary,
    details,
    words: { name: split(name), publisher: split(publisher), summary: split(summary), details: split(details) },
  };
}

/** Pertinence d'un seul mot pour un outil (0 si le mot n'apparaît pas). */
function scoreTerm(entry: SearchableTool, term: string): number {
  const root = stem(term);
  const hasWordStartingWith = (words: string[]) => words.some((word) => word.startsWith(root));

  if (entry.name === term) return 100;
  if (entry.name.startsWith(term)) return 60;
  if (entry.name.includes(term)) return 40;
  if (hasWordStartingWith(entry.words.name)) return 30;
  if (entry.publisher.includes(term)) return 20;
  if (hasWordStartingWith(entry.words.publisher)) return 15;
  if (entry.summary.includes(term)) return 10;
  if (hasWordStartingWith(entry.words.summary)) return 8;
  if (entry.details.includes(term)) return 5;
  if (hasWordStartingWith(entry.words.details)) return 4;
  return 0;
}

/**
 * Calcule la pertinence d'un outil pour une recherche.
 * Renvoie 0 si un des mots utiles de la recherche est absent de la fiche.
 */
export function scoreTool(tool: Tool, query: string): number {
  const terms = queryTerms(query);
  if (terms.length === 0) return 1;
  const entry = searchable(tool);
  let score = 0;
  for (const term of terms) {
    const termScore = scoreTerm(entry, term);
    if (termScore === 0) return 0;
    score += termScore;
  }
  return score;
}

/**
 * Pertinence « souple » : nombre de mots trouvés d'abord, puis leur score.
 * Utilisée quand aucun outil ne contient tous les mots recherchés.
 */
function scoreToolLoosely(tool: Tool, terms: string[]): number {
  const entry = searchable(tool);
  let matched = 0;
  let score = 0;
  for (const term of terms) {
    const termScore = scoreTerm(entry, term);
    if (termScore > 0) {
      matched += 1;
      score += termScore;
    }
  }
  return matched === 0 ? 0 : matched * 1000 + score;
}

const accessOrder: Record<AccessModel, number> = {
  gratuit: 0,
  freemium: 1,
  payant: 2,
  "a-confirmer": 3,
};

const collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

function matchesFilters(tool: Tool, criteria: CatalogCriteria): boolean {
  if (criteria.categories.length > 0) {
    const toolCategories = [tool.category, ...(tool.otherCategories ?? [])];
    if (!criteria.categories.some((slug) => toolCategories.includes(slug))) return false;
  }
  if (criteria.access.length > 0 && !criteria.access.includes(tool.access)) return false;
  return true;
}

export interface CatalogSearchResult {
  tools: Tool[];
  /**
   * Vrai quand aucun outil ne contient tous les mots recherchés : on affiche
   * alors ceux qui en contiennent au moins un (« résultats approchants »).
   */
  approximate: boolean;
}

/** Applique la recherche, les filtres et le tri. */
export function searchCatalog(tools: Tool[], criteria: CatalogCriteria): CatalogSearchResult {
  const candidates = tools.filter((tool) => matchesFilters(tool, criteria));
  let approximate = false;

  let scored = candidates
    .map((tool) => ({ tool, score: scoreTool(tool, criteria.query) }))
    .filter(({ score }) => score > 0);

  const terms = queryTerms(criteria.query);
  if (scored.length === 0 && terms.length > 1) {
    scored = candidates
      .map((tool) => ({ tool, score: scoreToolLoosely(tool, terms) }))
      .filter(({ score }) => score > 0);
    approximate = scored.length > 0;
  }

  const byName = (a: Tool, b: Tool) => collator.compare(a.name, b.name);

  scored.sort((a, b) => {
    switch (criteria.sort) {
      case "nom":
        return byName(a.tool, b.tool);
      case "acces":
        return accessOrder[a.tool.access] - accessOrder[b.tool.access] || byName(a.tool, b.tool);
      case "pertinence":
      default:
        if (b.score !== a.score) return b.score - a.score;
        if (Boolean(b.tool.featured) !== Boolean(a.tool.featured)) return b.tool.featured ? 1 : -1;
        return byName(a.tool, b.tool);
    }
  });

  return { tools: scored.map(({ tool }) => tool), approximate };
}

/** Liste des outils correspondant aux critères (voir searchCatalog). */
export function filterTools(tools: Tool[], criteria: CatalogCriteria): Tool[] {
  return searchCatalog(tools, criteria).tools;
}

/* ---------- Lecture et écriture des critères dans l'adresse de la page ---------- */

const categorySlugs = new Set<string>(categories.map((c) => c.slug));
const accessValues = new Set<string>(accessModels.map((m) => m.value));
const sortValues = new Set<string>(sortOptions.map((o) => o.value));

function parseList(value: string | null): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Lit les critères depuis l'adresse, ex. /outils?q=voix&categorie=audio&acces=gratuit,freemium
 * Les valeurs inconnues sont ignorées.
 */
export function criteriaFromSearchParams(params: URLSearchParams): CatalogCriteria {
  const sort = params.get("tri") ?? "";
  return {
    query: (params.get("q") ?? "").slice(0, 100),
    categories: [...new Set(parseList(params.get("categorie")))].filter((slug) =>
      categorySlugs.has(slug),
    ) as CategorySlug[],
    access: [...new Set(parseList(params.get("acces")))].filter((value) =>
      accessValues.has(value),
    ) as AccessModel[],
    sort: sortValues.has(sort) ? (sort as SortOption) : defaultCriteria.sort,
  };
}

/** Écrit les critères dans l'adresse (seulement ceux qui diffèrent des valeurs par défaut). */
export function criteriaToSearchParams(criteria: CatalogCriteria): URLSearchParams {
  const params = new URLSearchParams();
  const query = criteria.query.trim();
  if (query) params.set("q", query);
  if (criteria.categories.length) params.set("categorie", criteria.categories.join(","));
  if (criteria.access.length) params.set("acces", criteria.access.join(","));
  if (criteria.sort !== defaultCriteria.sort) params.set("tri", criteria.sort);
  return params;
}

export function hasActiveFilters(criteria: CatalogCriteria): boolean {
  // Une recherche faite uniquement de ponctuation (« ? », « c++ »…) n'est pas prise en compte.
  return normalize(criteria.query) !== "" || criteria.categories.length > 0 || criteria.access.length > 0;
}

/** Outils d'une catégorie (principale ou secondaire), triés par nom. */
export function getToolsByCategory(tools: Tool[], slug: CategorySlug): Tool[] {
  return tools
    .filter((tool) => tool.category === slug || tool.otherCategories?.includes(slug))
    .sort((a, b) => collator.compare(a.name, b.name));
}
