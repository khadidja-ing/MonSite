import { describe, expect, it } from "vitest";
import { articleText, countWords } from "~/lib/resources";
import { articles, getArticle } from "./articles";
import { isCategorySlug } from "./categories";
import { isResourceType, resourceTypes } from "./resource-types";

/** Date au format AAAA-MM-JJ, et qui existe réellement dans le calendrier. */
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

describe("articles : intégrité des données", () => {
  it("chaque article a un slug unique, au format d'adresse", () => {
    const slugs = articles.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("chaque titre est unique et renseigné", () => {
    const titles = articles.map((article) => article.title.trim());
    expect(titles.every(Boolean)).toBe(true);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("chaque type d'article est un type de ressource connu", () => {
    for (const article of articles) expect(isResourceType(article.type), article.slug).toBe(true);
  });

  it("chaque catégorie liée existe et n'est pas répétée", () => {
    for (const article of articles) {
      const slugs = article.categories ?? [];
      expect(new Set(slugs).size, article.slug).toBe(slugs.length);
      for (const slug of slugs) expect(isCategorySlug(slug), `${article.slug} → ${slug}`).toBe(true);
    }
  });

  it("les dates sont au format AAAA-MM-JJ et cohérentes", () => {
    for (const article of articles) {
      expect(isIsoDate(article.publishedOn), article.slug).toBe(true);
      if (article.updatedOn !== undefined) {
        expect(isIsoDate(article.updatedOn), article.slug).toBe(true);
        expect(article.updatedOn >= article.publishedOn, article.slug).toBe(true);
      }
    }
  });

  it("le résumé sert de description pour Google : 120 à 160 caractères", () => {
    for (const article of articles) {
      expect(article.summary.length, article.slug).toBeGreaterThanOrEqual(120);
      expect(article.summary.length, article.slug).toBeLessThanOrEqual(160);
    }
  });

  it("le contenu n'est jamais vide", () => {
    for (const article of articles) {
      expect(article.body.length, article.slug).toBeGreaterThan(0);
      for (const block of article.body) {
        if (block.type === "list") {
          expect(block.items.length, article.slug).toBeGreaterThan(0);
          for (const item of block.items) expect(item.trim(), article.slug).not.toBe("");
        } else {
          expect(block.text.trim(), article.slug).not.toBe("");
        }
        if (block.type === "tip" && block.title !== undefined) {
          expect(block.title.trim(), article.slug).not.toBe("");
        }
      }
    }
  });

  it("chaque article commence par un paragraphe d'introduction et contient des intertitres", () => {
    for (const article of articles) {
      expect(article.body[0]?.type, article.slug).toBe("paragraph");
      expect(article.body.some((block) => block.type === "heading"), article.slug).toBe(true);
    }
  });

  it("le temps de lecture annoncé est réaliste", () => {
    for (const article of articles) {
      const words = countWords(articleText(article));
      expect(Number.isInteger(article.readingMinutes), article.slug).toBe(true);
      // Entre 150 et 250 mots par minute environ.
      expect(article.readingMinutes, article.slug).toBeGreaterThanOrEqual(Math.max(1, Math.floor(words / 250)));
      expect(article.readingMinutes, article.slug).toBeLessThanOrEqual(Math.ceil(words / 150));
    }
  });

  it("les liens internes éventuels ne pointent pas vers une ancre vide", () => {
    for (const article of articles) expect(articleText(article)).not.toMatch(/href="#"/);
  });

  it("getArticle retrouve un article par son slug", () => {
    for (const article of articles) expect(getArticle(article.slug)).toBe(article);
    expect(getArticle("article-inexistant")).toBeUndefined();
  });
});

describe("types de ressources", () => {
  it("couvrent les six rubriques prévues, sans doublon", () => {
    const slugs = resourceTypes.map((type) => type.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect([...slugs].sort()).toEqual(
      ["cas-usage", "comparatif", "conseil", "guide", "nouveautes", "tutoriel"].sort(),
    );
  });

  it("ont un nom, un nom au singulier et une description", () => {
    for (const type of resourceTypes) {
      expect(type.name.trim()).not.toBe("");
      expect(type.singular.trim()).not.toBe("");
      expect(type.description.trim().length).toBeGreaterThan(20);
    }
  });
});
