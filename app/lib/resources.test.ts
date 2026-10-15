import { describe, expect, it } from "vitest";
import type { Article } from "~/data/types";
import {
  articleJsonLd,
  countArticlesByType,
  countWords,
  filterArticlesByType,
  frenchSpacing,
  getOtherArticles,
  getOutline,
  getStartingArticle,
  isExampleTip,
  joinFrench,
  parseResourceType,
  resourceFilterHref,
  slugify,
  sortArticles,
  withHeadingIds,
} from "./resources";

/** Articles fictifs utilisés uniquement pour les tests (jamais affichés). */
function makeArticle(slug: string, overrides: Partial<Article> = {}): Article {
  return {
    slug,
    title: `Titre ${slug}`,
    type: "guide",
    summary: "Résumé de test.",
    level: "debutant",
    publishedOn: "2026-10-14",
    readingMinutes: 3,
    body: [{ type: "paragraph", text: "Texte." }],
    ...overrides,
  };
}

describe("parseResourceType", () => {
  it("accepte uniquement les types connus", () => {
    expect(parseResourceType("tutoriel")).toBe("tutoriel");
    expect(parseResourceType(" Guide ")).toBe("guide");
    expect(parseResourceType("inconnu")).toBeNull();
    expect(parseResourceType("")).toBeNull();
    expect(parseResourceType(null)).toBeNull();
    expect(parseResourceType(undefined)).toBeNull();
  });
});

describe("resourceFilterHref", () => {
  it("construit l'adresse du filtre", () => {
    expect(resourceFilterHref(null)).toBe("/ressources");
    expect(resourceFilterHref("cas-usage")).toBe("/ressources?type=cas-usage");
  });
});

describe("tri, filtre et comptage", () => {
  const a = makeArticle("a", { publishedOn: "2026-01-10" });
  const b = makeArticle("b", { publishedOn: "2026-03-01", type: "tutoriel" });
  const c = makeArticle("c", { publishedOn: "2026-01-10", type: "conseil" });

  it("trie du plus récent au plus ancien, en gardant l'ordre à date égale", () => {
    expect(sortArticles([a, b, c]).map((x) => x.slug)).toEqual(["b", "a", "c"]);
  });

  it("ne modifie pas la liste d'origine", () => {
    const list = [a, b, c];
    sortArticles(list);
    expect(list.map((x) => x.slug)).toEqual(["a", "b", "c"]);
  });

  it("filtre par type, ou renvoie tout sans type", () => {
    expect(filterArticlesByType([a, b, c], "tutoriel")).toEqual([b]);
    expect(filterArticlesByType([a, b, c], "comparatif")).toEqual([]);
    expect(filterArticlesByType([a, b, c], null)).toEqual([a, b, c]);
  });

  it("compte les articles de chaque type, y compris les types vides", () => {
    const counts = countArticlesByType([a, b, c]);
    expect(counts).toEqual({ guide: 1, tutoriel: 1, comparatif: 0, conseil: 1, "cas-usage": 0, nouveautes: 0 });
    expect(countArticlesByType([])).toEqual({
      guide: 0,
      tutoriel: 0,
      comparatif: 0,
      conseil: 0,
      "cas-usage": 0,
      nouveautes: 0,
    });
  });
});

describe("getStartingArticle", () => {
  it("propose le premier guide débutant, sinon le premier article", () => {
    const tuto = makeArticle("tuto", { type: "tutoriel" });
    const expert = makeArticle("expert", { level: "intermediaire" });
    const guide = makeArticle("guide");
    expect(getStartingArticle([tuto, expert, guide])?.slug).toBe("guide");
    expect(getStartingArticle([tuto])?.slug).toBe("tuto");
    expect(getStartingArticle([])).toBeUndefined();
  });
});

describe("getOtherArticles", () => {
  const current = makeArticle("courant", { categories: ["texte"], type: "guide" });
  const sameCategory = makeArticle("meme-categorie", { categories: ["texte"], type: "conseil" });
  const sameType = makeArticle("meme-type", { type: "guide", publishedOn: "2026-01-01" });
  const unrelated = makeArticle("autre", { type: "conseil", publishedOn: "2026-12-01" });

  it("exclut l'article en cours et privilégie les articles proches", () => {
    const result = getOtherArticles([current, unrelated, sameType, sameCategory], current, 3);
    expect(result.map((x) => x.slug)).toEqual(["meme-categorie", "meme-type", "autre"]);
  });

  it("respecte la limite demandée", () => {
    expect(getOtherArticles([current, unrelated, sameType, sameCategory], current, 1)).toHaveLength(1);
    expect(getOtherArticles([current], current, 3)).toEqual([]);
  });
});

describe("sommaire", () => {
  it("transforme un intertitre en ancre lisible", () => {
    expect(slugify("Étape 1 : donner un rôle et du contexte")).toBe("etape-1-donner-un-role-et-du-contexte");
    expect(slugify("Qu'est-ce que l'IA ?")).toBe("qu-est-ce-que-l-ia");
    expect(slugify("Œuvres protégées")).toBe("oeuvres-protegees");
    expect(slugify("« ? »")).toBe("");
  });

  it("donne un identifiant unique à chaque intertitre", () => {
    const body = withHeadingIds([
      { type: "paragraph", text: "Intro" },
      { type: "heading", text: "En résumé" },
      { type: "heading", text: "En résumé" },
      { type: "heading", text: "?" },
    ]);
    expect(body.map((block) => block.id)).toEqual([undefined, "en-resume", "en-resume-2", "section"]);
  });

  it("liste les intertitres dans l'ordre", () => {
    expect(
      getOutline([
        { type: "heading", text: "Premier" },
        { type: "paragraph", text: "Texte" },
        { type: "heading", text: "Second" },
      ]),
    ).toEqual([
      { id: "premier", text: "Premier" },
      { id: "second", text: "Second" },
    ]);
  });
});

describe("texte", () => {
  it("reconnaît un encadré d'exemple (texte entre guillemets)", () => {
    expect(isExampleTip({ type: "tip", title: "Avant", text: "« Écris un message. »" })).toBe(true);
    expect(isExampleTip({ type: "tip", text: "Relisez toujours." })).toBe(false);
    expect(isExampleTip({ type: "paragraph", text: "« Citation »" })).toBe(false);
  });

  it("compte les mots en ignorant la ponctuation isolée", () => {
    expect(countWords("Bonjour : voici « trois mots » !")).toBe(4);
    expect(countWords("")).toBe(0);
  });

  it("applique les espaces insécables de la typographie française", () => {
    expect(frenchSpacing("Bonjour : « oui » ?")).toBe("Bonjour : « oui » ?");
    expect(frenchSpacing("https://exemple.fr")).toBe("https://exemple.fr");
  });

  it("assemble une liste en français", () => {
    expect(joinFrench([])).toBe("");
    expect(joinFrench(["guides"])).toBe("guides");
    expect(joinFrench(["guides", "tutoriels"])).toBe("guides et tutoriels");
    expect(joinFrench(["guides", "tutoriels", "conseils"])).toBe("guides, tutoriels et conseils");
  });
});

describe("articleJsonLd", () => {
  it("décrit l'article sans inventer d'auteur", () => {
    const article = makeArticle("test", { updatedOn: "2026-11-02" });
    const data = articleJsonLd(article, { siteName: "Site", url: "https://exemple.fr/ressources/test", section: "Guides" });
    expect(data).toMatchObject({
      "@type": "Article",
      headline: article.title,
      description: article.summary,
      datePublished: "2026-10-14",
      dateModified: "2026-11-02",
      inLanguage: "fr",
      url: "https://exemple.fr/ressources/test",
      publisher: { "@type": "Organization", name: "Site" },
    });
    expect(data).not.toHaveProperty("author");
  });

  it("omet la date de mise à jour et l'adresse si elles sont inconnues", () => {
    const data = articleJsonLd(makeArticle("test"), { siteName: "Site", url: null });
    expect(data).not.toHaveProperty("dateModified");
    expect(data).not.toHaveProperty("url");
  });
});
