import { describe, expect, it } from "vitest";
import { categories } from "~/data/categories";
import type { Tool } from "~/data/types";
import { accessModels, defaultCriteria } from "./catalog";
import {
  accessExplanations,
  activeFilterCount,
  buildToolDescription,
  describeSource,
  facetCounts,
  getSimilarTools,
  resultsLabel,
  showResultsLabel,
  toggleInList,
  toolCategorySlugs,
  truncateText,
} from "./catalog-ui";

/** Fiches fictives utilisées uniquement pour les tests (jamais affichées). */
function makeTool(overrides: Partial<Tool> & Pick<Tool, "slug" | "name">): Tool {
  return {
    publisher: "Éditeur test",
    website: "https://example.com",
    category: "texte",
    tagline: "Outil de test",
    description: "Description de test",
    uses: ["Usage de test"],
    access: "a-confirmer",
    sources: [],
    lastChecked: "2026-01-01",
    ...overrides,
  };
}

const sample: Tool[] = [
  makeTool({ slug: "alpha", name: "Alpha", category: "texte", access: "freemium" }),
  makeTool({ slug: "beta", name: "Beta", category: "texte", access: "gratuit", featured: true }),
  makeTool({
    slug: "gamma",
    name: "Gamma",
    category: "images",
    otherCategories: ["texte"],
    access: "freemium",
  }),
  makeTool({ slug: "delta", name: "Delta", category: "audio", access: "payant", uses: ["Transcrire"] }),
  makeTool({ slug: "epsilon", name: "Epsilon", category: "texte", access: "payant" }),
];

describe("accessExplanations", () => {
  it("explique chaque modèle d'accès", () => {
    for (const model of accessModels) {
      expect(accessExplanations[model.value].length).toBeGreaterThan(20);
    }
  });
});

describe("facetCounts", () => {
  it("compte les outils par catégorie (principale ou secondaire) et par accès", () => {
    const counts = facetCounts(sample, defaultCriteria);
    expect(counts.categories.texte).toBe(4);
    expect(counts.categories.images).toBe(1);
    expect(counts.categories.audio).toBe(1);
    expect(counts.categories.video).toBe(0);
    expect(counts.access.freemium).toBe(2);
    expect(counts.access.payant).toBe(2);
    expect(counts.access.gratuit).toBe(1);
    expect(counts.access["a-confirmer"]).toBe(0);
  });

  it("renvoie une valeur pour toutes les catégories et tous les modèles", () => {
    const counts = facetCounts([], defaultCriteria);
    expect(Object.keys(counts.categories)).toHaveLength(categories.length);
    expect(Object.keys(counts.access)).toHaveLength(accessModels.length);
    expect(Object.values(counts.categories).every((n) => n === 0)).toBe(true);
  });

  it("tient compte des autres groupes de filtres et de la recherche", () => {
    const withAccess = facetCounts(sample, { ...defaultCriteria, access: ["payant"] });
    expect(withAccess.categories.texte).toBe(1);
    expect(withAccess.categories.audio).toBe(1);
    // Le compteur d'un modèle d'accès ignore les modèles déjà cochés (OU dans le groupe).
    expect(withAccess.access.freemium).toBe(2);

    const withCategory = facetCounts(sample, { ...defaultCriteria, categories: ["images"] });
    expect(withCategory.access.freemium).toBe(1);
    expect(withCategory.access.payant).toBe(0);
    // Le compteur d'une catégorie ignore les catégories déjà cochées.
    expect(withCategory.categories.texte).toBe(4);

    const withQuery = facetCounts(sample, { ...defaultCriteria, query: "transcrire" });
    expect(withQuery.categories.audio).toBe(1);
    expect(withQuery.categories.texte).toBe(0);
  });
});

describe("toggleInList", () => {
  const order = ["a", "b", "c", "d"] as const;

  it("ajoute une valeur absente en respectant l'ordre de référence", () => {
    expect(toggleInList(["c"], "a", order)).toEqual(["a", "c"]);
    expect(toggleInList([], "d", order)).toEqual(["d"]);
  });

  it("retire une valeur présente", () => {
    expect(toggleInList(["a", "c"], "a", order)).toEqual(["c"]);
    expect(toggleInList(["b"], "b", order)).toEqual([]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const list = ["a"] as ("a" | "b" | "c" | "d")[];
    toggleInList(list, "b", order);
    expect(list).toEqual(["a"]);
  });
});

describe("activeFilterCount", () => {
  it("additionne les catégories et les modèles d'accès cochés", () => {
    expect(activeFilterCount(defaultCriteria)).toBe(0);
    expect(activeFilterCount({ categories: ["texte", "images"], access: ["gratuit"] })).toBe(3);
  });
});

describe("resultsLabel", () => {
  it("accorde correctement au singulier et au pluriel", () => {
    expect(resultsLabel(0, true)).toBe("Aucun outil trouvé");
    expect(resultsLabel(1, true)).toBe("1 outil trouvé");
    expect(resultsLabel(12, true)).toBe("12 outils trouvés");
    expect(resultsLabel(1, false)).toBe("1 outil référencé");
    expect(resultsLabel(40, false)).toBe("40 outils référencés");
    expect(resultsLabel(0, false)).toBe("Aucun outil référencé pour le moment");
  });
});

describe("showResultsLabel", () => {
  it("adapte le libellé au nombre de résultats", () => {
    expect(showResultsLabel(0)).toBe("Aucun résultat : fermer les filtres");
    expect(showResultsLabel(1)).toBe("Afficher le résultat");
    expect(showResultsLabel(7)).toBe("Afficher les 7 résultats");
  });
});

describe("toolCategorySlugs", () => {
  it("place la catégorie principale en premier, sans doublon", () => {
    expect(toolCategorySlugs({ category: "texte" })).toEqual(["texte"]);
    expect(toolCategorySlugs({ category: "images", otherCategories: ["texte", "images", "marketing"] })).toEqual([
      "images",
      "texte",
      "marketing",
    ]);
  });
});

describe("getSimilarTools", () => {
  it("propose d'autres outils de la même catégorie principale, mis en avant d'abord", () => {
    const alpha = sample[0];
    expect(getSimilarTools(sample, alpha).map((t) => t.slug)).toEqual(["beta", "epsilon"]);
  });

  it("exclut l'outil lui-même et respecte le maximum", () => {
    const beta = sample[1];
    expect(getSimilarTools(sample, beta, 1).map((t) => t.slug)).toEqual(["alpha"]);
    expect(getSimilarTools(sample, beta, 0)).toEqual([]);
  });

  it("renvoie une liste vide s'il n'y a aucun autre outil dans la catégorie", () => {
    const delta = sample[3];
    expect(getSimilarTools(sample, delta)).toEqual([]);
  });
});

describe("truncateText", () => {
  it("laisse un texte court intact", () => {
    expect(truncateText("Bonjour  le monde", 50)).toBe("Bonjour le monde");
  });

  it("coupe à la fin d'un mot et ajoute des points de suspension", () => {
    const result = truncateText("Un assistant qui rédige, résume et traduit des textes variés", 30);
    expect(result.length).toBeLessThanOrEqual(30);
    expect(result.endsWith("…")).toBe(true);
    expect(result).toBe("Un assistant qui rédige…");
  });
});

describe("buildToolDescription", () => {
  it("complète une accroche courte pour atteindre 120 à 160 caractères", () => {
    const description = buildToolDescription({
      name: "Exemple",
      tagline: "Assistant conversationnel généraliste pour écrire, résumer et répondre à des questions.",
    });
    expect(description.startsWith("Assistant conversationnel")).toBe(true);
    expect(description.length).toBeGreaterThanOrEqual(120);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("ajoute un point final si besoin", () => {
    const description = buildToolDescription({ name: "Exemple", tagline: "Créer des images" });
    expect(description.startsWith("Créer des images. ")).toBe(true);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("raccourcit une accroche trop longue", () => {
    const tagline = "Un outil très complet ".repeat(12);
    const description = buildToolDescription({ name: "Exemple", tagline });
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description.endsWith("…")).toBe(true);
  });

  it("garde une accroche déjà de bonne longueur", () => {
    const tagline =
      "Plateforme de création graphique en ligne qui propose des modèles prêts à l'emploi et des fonctions d'IA pour générer et retoucher des visuels.";
    expect(buildToolDescription({ name: "Exemple", tagline })).toBe(tagline);
  });

  it("produit un texte même sans accroche", () => {
    expect(buildToolDescription({ name: "Exemple", tagline: "" })).toContain("Exemple");
  });
});

describe("describeSource", () => {
  it("sépare le domaine et le chemin", () => {
    expect(describeSource("https://www.example.com/fr/tarifs/")).toEqual({
      domain: "example.com",
      path: "/fr/tarifs",
    });
    expect(describeSource("https://example.com")).toEqual({ domain: "example.com", path: "" });
    expect(describeSource("https://example.com/aide?page=2")).toEqual({
      domain: "example.com",
      path: "/aide?page=2",
    });
  });

  it("décode les caractères accentués et tolère une adresse invalide", () => {
    expect(describeSource("https://example.com/caf%C3%A9").path).toBe("/café");
    expect(describeSource("pas une adresse")).toEqual({ domain: "pas une adresse", path: "" });
  });
});
