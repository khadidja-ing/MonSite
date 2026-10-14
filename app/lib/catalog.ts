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
 * Calcule la pertinence d'un outil pour une recherche.
 * Renvoie 0 si un des mots recherchés est absent de la fiche.
 */
export function scoreTool(tool: Tool, query: string): number {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (terms.length === 0) return 1;

  const name = normalize(tool.name);
  const publisher = normalize(tool.publisher);
  const summary = normalize([tool.tagline, ...tool.uses].join(" "));
  const details = normalize([tool.description, ...categoryNames(tool)].join(" "));

  let score = 0;
  for (const term of terms) {
    if (name === term) score += 100;
    else if (name.startsWith(term)) score += 60;
    else if (name.includes(term)) score += 40;
    else if (publisher.includes(term)) score += 20;
    else if (summary.includes(term)) score += 10;
    else if (details.includes(term)) score += 5;
    else return 0;
  }
  return score;
}

const accessOrder: Record<AccessModel, number> = {
  gratuit: 0,
  freemium: 1,
  payant: 2,
  "a-confirmer": 3,
};

const collator = new Intl.Collator("fr", { sensitivity: "base", numeric: true });

/** Applique la recherche, les filtres et le tri. */
export function filterTools(tools: Tool[], criteria: CatalogCriteria): Tool[] {
  const scored = tools
    .map((tool) => ({ tool, score: scoreTool(tool, criteria.query) }))
    .filter(({ tool, score }) => {
      if (score === 0) return false;
      if (criteria.categories.length > 0) {
        const toolCategories = [tool.category, ...(tool.otherCategories ?? [])];
        if (!criteria.categories.some((slug) => toolCategories.includes(slug))) return false;
      }
      if (criteria.access.length > 0 && !criteria.access.includes(tool.access)) return false;
      return true;
    });

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

  return scored.map(({ tool }) => tool);
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
  return Boolean(criteria.query.trim()) || criteria.categories.length > 0 || criteria.access.length > 0;
}

/** Outils d'une catégorie (principale ou secondaire), triés par nom. */
export function getToolsByCategory(tools: Tool[], slug: CategorySlug): Tool[] {
  return tools
    .filter((tool) => tool.category === slug || tool.otherCategories?.includes(slug))
    .sort((a, b) => collator.compare(a.name, b.name));
}
