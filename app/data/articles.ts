import type { Article } from "./types";

/** Articles de la rubrique « Ressources et guides ». PROVISOIRE. */
export const articles: Article[] = [];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
