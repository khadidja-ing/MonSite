import { describe, expect, it } from "vitest";
import { categories } from "~/data/categories";
import type { Tool } from "~/data/types";
import {
  categoryCatalogLink,
  categoryMetaDescription,
  countToolsByCategory,
  getCategoryPageTools,
  getOtherCategories,
  hasToolsFromOtherCategories,
} from "./categories-page";

/** Fiches fictives utilisées uniquement pour les tests (jamais affichées). */
function makeTool(slug: string, overrides: Partial<Tool> = {}): Tool {
  return {
    slug,
    name: slug,
    publisher: "Éditeur test",
    website: "https://example.com",
    category: "texte",
    tagline: "Outil de test",
    description: "Description de test",
    uses: [],
    access: "a-confirmer",
    sources: [],
    lastChecked: "2026-01-01",
    ...overrides,
  };
}

describe("categoryCatalogLink", () => {
  it("renvoie l'adresse du catalogue filtré sur la catégorie", () => {
    expect(categoryCatalogLink("texte")).toBe("/outils?categorie=texte");
    expect(categoryCatalogLink("agents-assistants")).toBe("/outils?categorie=agents-assistants");
  });
});

describe("categoryMetaDescription", () => {
  it("complète le résumé et reste d'une longueur adaptée aux moteurs de recherche", () => {
    for (const category of categories) {
      const description = categoryMetaDescription(category);
      expect(description.startsWith(category.summary)).toBe(true);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(175);
    }
  });

  it("ajoute un point final au résumé s'il en manque un", () => {
    expect(categoryMetaDescription({ summary: "Créer des images" })).toMatch(/^Créer des images\. /);
  });
});

describe("getOtherCategories", () => {
  it("retire la catégorie courante et garde l'ordre d'affichage", () => {
    const others = getOtherCategories(categories, "video");
    expect(others).toHaveLength(categories.length - 1);
    expect(others.map((c) => c.slug)).not.toContain("video");
    expect(others.map((c) => c.slug)).toEqual(
      categories.filter((c) => c.slug !== "video").map((c) => c.slug),
    );
  });
});

describe("countToolsByCategory", () => {
  it("compte les outils de chaque catégorie, principale ou secondaire", () => {
    const tools = [
      makeTool("a", { category: "texte", otherCategories: ["images"] }),
      makeTool("b", { category: "images" }),
      makeTool("c", { category: "texte" }),
    ];
    const counts = countToolsByCategory(tools, categories);
    expect(counts.texte).toBe(2);
    expect(counts.images).toBe(2);
    expect(counts.video).toBe(0);
    expect(Object.keys(counts)).toHaveLength(categories.length);
  });

  it("renvoie zéro partout sans aucun outil", () => {
    const counts = countToolsByCategory([], categories);
    expect(Object.values(counts).every((count) => count === 0)).toBe(true);
  });
});

describe("getCategoryPageTools", () => {
  it("place d'abord les outils dont c'est la catégorie principale, triés par nom", () => {
    const tools = [
      makeTool("zeta", { name: "Zeta", category: "images" }),
      makeTool("beta", { name: "Beta", category: "texte", otherCategories: ["images"] }),
      makeTool("alpha", { name: "Alpha", category: "images" }),
      makeTool("autre", { name: "Autre", category: "audio" }),
      makeTool("aaa", { name: "Aaa", category: "video", otherCategories: ["images"] }),
    ];
    expect(getCategoryPageTools(tools, "images").map((t) => t.slug)).toEqual([
      "alpha",
      "zeta",
      "aaa",
      "beta",
    ]);
  });

  it("renvoie une liste vide si aucun outil n'appartient à la catégorie", () => {
    expect(getCategoryPageTools([makeTool("a")], "formation")).toEqual([]);
  });
});

describe("hasToolsFromOtherCategories", () => {
  it("détecte les outils rattachés à titre secondaire", () => {
    expect(hasToolsFromOtherCategories([makeTool("a", { category: "texte" })], "texte")).toBe(false);
    expect(
      hasToolsFromOtherCategories(
        [makeTool("a", { category: "texte" }), makeTool("b", { category: "images" })],
        "texte",
      ),
    ).toBe(true);
    expect(hasToolsFromOtherCategories([], "texte")).toBe(false);
  });
});
