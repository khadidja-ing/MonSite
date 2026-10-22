import { describe, expect, it } from "vitest";
import type { Tool } from "~/data/types";
import { tools as realTools } from "~/data/tools";
import {
  criteriaFromSearchParams,
  criteriaToSearchParams,
  defaultCriteria,
  filterTools,
  getToolsByCategory,
  hasActiveFilters,
  normalize,
  queryTerms,
  scoreTool,
  searchCatalog,
} from "./catalog";

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
  makeTool({ slug: "alpha", name: "Alpha Écrit", category: "texte", access: "freemium", featured: true }),
  makeTool({
    slug: "beta",
    name: "Beta Vidéo",
    category: "video",
    otherCategories: ["marketing"],
    access: "payant",
    tagline: "Montage vidéo rapide",
  }),
  makeTool({ slug: "gamma", name: "Gamma Voix", category: "audio", access: "gratuit", uses: ["Transcrire une réunion"] }),
  makeTool({ slug: "delta", name: "Delta", category: "donnees", access: "a-confirmer", publisher: "Société Voix" }),
];

describe("normalize", () => {
  it("retire les accents, la casse et la ponctuation", () => {
    expect(normalize("  Vidéo & Écriture ! ")).toBe("video ecriture");
  });
});

describe("scoreTool", () => {
  it("renvoie 0 si un mot est introuvable", () => {
    expect(scoreTool(sample[0], "alpha inexistant")).toBe(0);
  });
  it("favorise une correspondance dans le nom", () => {
    expect(scoreTool(sample[2], "voix")).toBeGreaterThan(scoreTool(sample[3], "voix"));
  });
  it("trouve un mot présent dans les usages", () => {
    expect(scoreTool(sample[2], "reunion")).toBeGreaterThan(0);
  });
  it("trouve un outil par le nom de sa catégorie", () => {
    expect(scoreTool(sample[1], "marketing")).toBeGreaterThan(0);
  });
});

describe("filterTools", () => {
  it("sans critère, renvoie tous les outils (mis en avant d'abord)", () => {
    const result = filterTools(sample, defaultCriteria);
    expect(result).toHaveLength(4);
    expect(result[0].slug).toBe("alpha");
  });

  it("recherche sans tenir compte des accents", () => {
    const result = filterTools(sample, { ...defaultCriteria, query: "video" });
    expect(result.map((t) => t.slug)).toEqual(["beta"]);
  });

  it("filtre par catégorie, y compris les catégories secondaires", () => {
    const result = filterTools(sample, { ...defaultCriteria, categories: ["marketing"] });
    expect(result.map((t) => t.slug)).toEqual(["beta"]);
  });

  it("combine catégories et modèle d'accès", () => {
    const result = filterTools(sample, {
      ...defaultCriteria,
      categories: ["audio", "video"],
      access: ["gratuit"],
    });
    expect(result.map((t) => t.slug)).toEqual(["gamma"]);
  });

  it("combine recherche et filtres", () => {
    const result = filterTools(sample, { ...defaultCriteria, query: "voix", access: ["a-confirmer"] });
    expect(result.map((t) => t.slug)).toEqual(["delta"]);
  });

  it("renvoie une liste vide si rien ne correspond", () => {
    expect(filterTools(sample, { ...defaultCriteria, query: "zzz" })).toEqual([]);
  });

  it("trie par nom", () => {
    const result = filterTools(sample, { ...defaultCriteria, sort: "nom" });
    expect(result.map((t) => t.slug)).toEqual(["alpha", "beta", "delta", "gamma"]);
  });

  it("trie par accès, gratuit d'abord", () => {
    const result = filterTools(sample, { ...defaultCriteria, sort: "acces" });
    expect(result.map((t) => t.access)).toEqual(["gratuit", "freemium", "payant", "a-confirmer"]);
  });
});

describe("paramètres d'adresse", () => {
  it("lit les critères et ignore les valeurs inconnues", () => {
    const criteria = criteriaFromSearchParams(
      new URLSearchParams("q=voix&categorie=audio,inconnue,audio&acces=gratuit,faux&tri=nom"),
    );
    expect(criteria).toEqual({ query: "voix", categories: ["audio"], access: ["gratuit"], sort: "nom" });
  });

  it("utilise le tri par défaut si la valeur est invalide", () => {
    expect(criteriaFromSearchParams(new URLSearchParams("tri=hack")).sort).toBe("pertinence");
  });

  it("aller-retour critères → adresse → critères", () => {
    const criteria = { query: "image", categories: ["images" as const], access: ["freemium" as const], sort: "acces" as const };
    expect(criteriaFromSearchParams(criteriaToSearchParams(criteria))).toEqual(criteria);
  });

  it("n'écrit rien pour les critères par défaut", () => {
    expect(criteriaToSearchParams(defaultCriteria).toString()).toBe("");
    expect(hasActiveFilters(defaultCriteria)).toBe(false);
  });
});

describe("getToolsByCategory", () => {
  it("inclut les outils dont la catégorie est secondaire", () => {
    expect(getToolsByCategory(sample, "marketing").map((t) => t.slug)).toEqual(["beta"]);
  });
});

describe("recherche en langage naturel", () => {
  it("ignore les mots courants", () => {
    expect(queryTerms("Je veux faire une vidéo")).toEqual(["video"]);
    expect(queryTerms("un")).toEqual(["un"]);
    expect(queryTerms("écrire un e-mail")).toEqual(["ecrire", "mail"]);
  });

  it("rapproche les mots de même famille (traduire / traduction)", () => {
    const tool = makeTool({ slug: "x", name: "X", category: "audio", tagline: "Service de traduction" });
    expect(scoreTool(tool, "traduire")).toBeGreaterThan(0);
    expect(scoreTool(tool, "je veux traduire un poème")).toBe(0); // « poème » absent
  });

  it("propose des résultats approchants quand aucun outil ne contient tous les mots", () => {
    const result = searchCatalog(sample, { ...defaultCriteria, query: "voix inexistant" });
    expect(result.approximate).toBe(true);
    expect(result.tools.map((t) => t.slug)).toContain("gamma");
  });

  it("n'est pas « approchant » quand tous les mots sont trouvés", () => {
    const result = searchCatalog(sample, { ...defaultCriteria, query: "gamma voix" });
    expect(result.approximate).toBe(false);
    expect(result.tools.map((t) => t.slug)).toEqual(["gamma"]);
  });

  it("respecte les filtres même en mode approchant", () => {
    const result = searchCatalog(sample, {
      ...defaultCriteria,
      query: "voix inexistant",
      access: ["payant"],
    });
    expect(result.tools).toEqual([]);
  });

  it("une recherche faite de ponctuation n'est pas un filtre actif", () => {
    expect(hasActiveFilters({ ...defaultCriteria, query: "?" })).toBe(false);
  });
});

describe("recherche sur le catalogue réel", () => {
  const search = (query: string) =>
    searchCatalog(realTools, { ...defaultCriteria, query }).tools.map((tool) => tool.slug);

  it.each([
    ["je veux traduire un document", "deepl"],
    ["traduction", "deepl"],
    ["générer de la musique", "suno"],
    ["faire de la musique", "suno"],
  ])("« %s » trouve %s", (query, slug) => {
    expect(search(query)).toContain(slug);
  });

  it("classe d'abord les outils dont c'est la catégorie principale", () => {
    const first = searchCatalog(realTools, { ...defaultCriteria, query: "faire une vidéo" }).tools[0];
    expect(first.category).toBe("video");
  });

  it.each(["faire une vidéo", "transcrire une réunion", "écrire un e-mail", "créer un logo", "image, voix, traduction"])(
    "« %s » donne des résultats, sans renvoyer tout le catalogue",
    (query) => {
      const found = search(query).length;
      expect(found).toBeGreaterThan(0);
      expect(found).toBeLessThan(realTools.length);
    },
  );
});
