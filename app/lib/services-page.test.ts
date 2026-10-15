import { describe, expect, it } from "vitest";
import type { Service } from "~/data/types";
import { countServicesByStatus, serviceContactLink, serviceCtaLabel } from "./services-page";

/** Prestations fictives utilisées uniquement pour les tests (jamais affichées). */
function makeService(slug: string, status: Service["status"]): Service {
  return {
    slug,
    title: slug,
    icon: "compass",
    summary: "Résumé de test",
    description: "Description de test",
    benefits: [],
    audience: [],
    status,
  };
}

describe("serviceContactLink", () => {
  it("préremplit le formulaire de contact avec le service", () => {
    expect(serviceContactLink("conseil-accompagnement")).toBe("/contact?service=conseil-accompagnement");
  });

  it("encode les caractères spéciaux", () => {
    expect(serviceContactLink("a b&c")).toBe("/contact?service=a%20b%26c");
  });
});

describe("serviceCtaLabel", () => {
  it("invite à manifester son intérêt tant que le service est en préparation", () => {
    expect(serviceCtaLabel("en-preparation")).toBe("Manifester mon intérêt");
  });

  it("propose un échange quand le service est disponible", () => {
    expect(serviceCtaLabel("disponible")).toBe("Demander un échange");
  });
});

describe("countServicesByStatus", () => {
  it("compte les services de chaque statut", () => {
    const counts = countServicesByStatus([
      makeService("a", "en-preparation"),
      makeService("b", "disponible"),
      makeService("c", "en-preparation"),
    ]);
    expect(counts).toEqual({ disponible: 1, "en-preparation": 2 });
  });

  it("renvoie zéro pour une liste vide", () => {
    expect(countServicesByStatus([])).toEqual({ disponible: 0, "en-preparation": 0 });
  });
});
