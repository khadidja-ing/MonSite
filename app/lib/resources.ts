/**
 * Logique de la rubrique « Ressources » : filtre par type, tri, sommaire
 * des articles, articles liés et données structurées pour Google.
 *
 * Ces fonctions ne dépendent pas de l'affichage et sont vérifiées par des
 * tests automatiques (resources.test.ts).
 */
import { isResourceType, resourceTypes } from "~/data/resource-types";
import type { Article, ArticleBlock, ResourceType } from "~/data/types";

export const levelLabels: Record<Article["level"], string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
};

/** Lit le type demandé dans l'adresse (?type=…). Une valeur inconnue est ignorée. */
export function parseResourceType(value: string | null | undefined): ResourceType | null {
  const cleaned = (value ?? "").trim().toLowerCase();
  return cleaned && isResourceType(cleaned) ? cleaned : null;
}

/** Adresse de la liste filtrée par type (ou de la liste complète). */
export function resourceFilterHref(type: ResourceType | null): string {
  return type ? `/ressources?type=${type}` : "/ressources";
}

/** Date de la dernière modification d'un article (mise à jour ou publication). */
export function lastModified(article: Article): string {
  return article.updatedOn ?? article.publishedOn;
}

/**
 * Trie les articles du plus récent au plus ancien (date de publication).
 * À date égale, l'ordre du fichier de données est conservé.
 */
export function sortArticles(list: Article[]): Article[] {
  return [...list].sort((a, b) => (a.publishedOn < b.publishedOn ? 1 : a.publishedOn > b.publishedOn ? -1 : 0));
}

export function filterArticlesByType(list: Article[], type: ResourceType | null): Article[] {
  return type ? list.filter((article) => article.type === type) : list;
}

/** Nombre d'articles publiés pour chaque type (0 pour un type encore vide). */
export function countArticlesByType(list: Article[]): Record<ResourceType, number> {
  const counts = Object.fromEntries(resourceTypes.map((type) => [type.slug, 0])) as Record<ResourceType, number>;
  for (const article of list) {
    if (article.type in counts) counts[article.type] += 1;
  }
  return counts;
}

/**
 * Article proposé comme point de départ : le premier guide de niveau
 * débutant dans l'ordre éditorial (à défaut, le premier article).
 */
export function getStartingArticle(list: Article[]): Article | undefined {
  return list.find((article) => article.type === "guide" && article.level === "debutant") ?? list[0];
}

/**
 * Autres articles à proposer en fin de lecture : d'abord ceux qui partagent
 * des catégories ou le même type, puis les plus récents.
 */
export function getOtherArticles(list: Article[], current: Article, limit = 3): Article[] {
  const currentCategories = new Set(current.categories ?? []);
  const score = (article: Article) =>
    (article.categories ?? []).filter((slug) => currentCategories.has(slug)).length +
    (article.type === current.type ? 1 : 0);

  return sortArticles(list.filter((article) => article.slug !== current.slug))
    .map((article, index) => ({ article, index, score: score(article) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(0, limit))
    .map(({ article }) => article);
}

/* ---------- Sommaire et ancres des intertitres ---------- */

/** "Étape 1 : donner un rôle" → "etape-1-donner-un-role" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface OutlineItem {
  id: string;
  text: string;
}

export type BlockWithId = ArticleBlock & { id?: string };

/**
 * Ajoute un identifiant unique à chaque intertitre, pour pouvoir y accéder
 * directement depuis le sommaire (/ressources/mon-article#mon-intertitre).
 */
export function withHeadingIds(body: ArticleBlock[]): BlockWithId[] {
  const used = new Set<string>();
  return body.map((block) => {
    if (block.type !== "heading") return block;
    const base = slugify(block.text) || "section";
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    return { ...block, id };
  });
}

/** Liste des intertitres d'un article (sommaire). */
export function getOutline(body: ArticleBlock[]): OutlineItem[] {
  return withHeadingIds(body).flatMap((block) =>
    block.type === "heading" && block.id ? [{ id: block.id, text: block.text }] : [],
  );
}

/* ---------- Texte ---------- */

/** Un encadré dont le texte est entre guillemets est un exemple de consigne. */
export function isExampleTip(block: ArticleBlock): boolean {
  return block.type === "tip" && block.text.trim().startsWith("«");
}

/** Tout le texte lisible d'un article (titre compris). */
export function articleText(article: Article): string {
  const parts = article.body.flatMap((block) => {
    switch (block.type) {
      case "list":
        return block.items;
      case "tip":
        return block.title ? [block.title, block.text] : [block.text];
      default:
        return [block.text];
    }
  });
  return [article.title, ...parts].join(" ");
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}

/**
 * Typographie française : espace insécable avant « : ; ! ? » et à
 * l'intérieur des guillemets, pour qu'un signe ne se retrouve jamais seul
 * en début de ligne.
 */
export function frenchSpacing(text: string): string {
  return text
    .replace(/«[  ]*/g, "« ")
    .replace(/[  ]*»/g, " »")
    .replace(/(\S)[  ]+([:;!?])/g, "$1 $2");
}

/** Assemble une liste en français : ["a", "b", "c"] → "a, b et c". */
export function joinFrench(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} et ${items[items.length - 1]}`;
}

/* ---------- Données structurées (Google) ---------- */

/**
 * Données structurées « Article » (schema.org). Aucun auteur n'est inventé :
 * seul l'éditeur du site est indiqué.
 */
export function articleJsonLd(
  article: Article,
  { siteName, url, section }: { siteName: string; url?: string | null; section?: string },
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedOn,
    ...(article.updatedOn ? { dateModified: article.updatedOn } : {}),
    inLanguage: "fr",
    ...(section ? { articleSection: section } : {}),
    ...(url ? { url, mainEntityOfPage: url } : {}),
    publisher: { "@type": "Organization", name: siteName },
  };
}
