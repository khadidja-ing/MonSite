import { describe, expect, it } from "vitest";
import type { Service, Tool } from "~/data/types";
import {
  areAllServicesInPreparation,
  areAllToolsSourced,
  catalogSearchLink,
  getFeaturedTools,
  getLatestCheckDate,
  getServiceStatusLabel,
} from "./highlights";

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

function makeService(slug: string, status: Service["status"]): Service {
  return {
    slug,
    title: slug,
    icon: "compass",
    summary: "",
    description: "",
    benefits: [],
    audience: [],
    status,
  };
}

describe("getFeaturedTools", () => {
  it("garde uniquement les outils mis en avant, dans l'ordre", () => {
    const tools = [makeTool("a"), makeTool("b", { featured: true }), makeTool("c", { featured: true })];
    expect(getFeaturedTools(tools).map((t) => t.slug)).toEqual(["b", "c"]);
  });

  it("limite le nombre d'outils", () => {
    const tools = Array.from({ length: 10 }, (_, i) => makeTool(`t${i}`, { featured: true }));
    expect(getFeaturedTools(tools, 6)).toHaveLength(6);
  });

  it("prend les premiers outils si aucun n'est mis en avant", () => {
    const tools = Array.from({ length: 8 }, (_, i) => makeTool(`t${i}`));
    expect(getFeaturedTools(tools, 6).map((t) => t.slug)).toEqual(["t0", "t1", "t2", "t3", "t4", "t5"]);
  });

  it("renvoie une liste vide pour un catalogue vide", () => {
    expect(getFeaturedTools([])).toEqual([]);
  });
});

describe("getLatestCheckDate", () => {
  it("renvoie la date la plus récente", () => {
    const tools = [
      makeTool("a", { lastChecked: "2026-03-02" }),
      makeTool("b", { lastChecked: "2026-10-14" }),
      makeTool("c", { lastChecked: "2025-12-31" }),
    ];
    expect(getLatestCheckDate(tools)).toBe("2026-10-14");
  });

  it("ignore les dates mal formées", () => {
    const tools = [makeTool("a", { lastChecked: "bientôt" }), makeTool("b", { lastChecked: "2026-02-01" })];
    expect(getLatestCheckDate(tools)).toBe("2026-02-01");
  });

  it("renvoie undefined sans fiche", () => {
    expect(getLatestCheckDate([])).toBeUndefined();
  });
});

describe("areAllToolsSourced", () => {
  it("vérifie que chaque fiche cite une source", () => {
    expect(areAllToolsSourced([makeTool("a", { sources: ["https://example.com"] })])).toBe(true);
    expect(
      areAllToolsSourced([makeTool("a", { sources: ["https://example.com"] }), makeTool("b", { sources: [] })]),
    ).toBe(false);
    expect(areAllToolsSourced([])).toBe(false);
  });
});

describe("services", () => {
  it("traduit le statut en libellé lisible", () => {
    expect(getServiceStatusLabel("en-preparation")).toBe("En préparation");
    expect(getServiceStatusLabel("disponible")).toBe("Disponible");
  });

  it("détecte si toutes les prestations sont en préparation", () => {
    expect(areAllServicesInPreparation([makeService("a", "en-preparation")])).toBe(true);
    expect(
      areAllServicesInPreparation([makeService("a", "en-preparation"), makeService("b", "disponible")]),
    ).toBe(false);
  });
});

describe("catalogSearchLink", () => {
  it("encode la recherche dans l'adresse", () => {
    expect(catalogSearchLink("résumer")).toBe("/outils?q=r%C3%A9sumer");
    expect(new URLSearchParams(catalogSearchLink("  créer une image ").split("?")[1]).get("q")).toBe(
      "créer une image",
    );
  });
});
