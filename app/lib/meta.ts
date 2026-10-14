/**
 * Balises de référencement et de partage sur les réseaux sociaux.
 * Chaque page appelle `pageMeta(...)` dans sa fonction `meta`.
 */
import { siteConfig } from "~/config/site";

export interface PageMetaInput {
  /** Titre de la page (le nom du site est ajouté automatiquement). */
  title: string;
  /** Description de 120 à 160 caractères environ, affichée par Google. */
  description: string;
  /** Chemin de la page, ex. "/outils". */
  path: string;
  /** "article" pour les guides, "website" sinon. */
  type?: "website" | "article";
  /** Empêche l'indexation (ex. page 404). */
  noIndex?: boolean;
}

export function absoluteUrl(path: string): string | null {
  if (!siteConfig.url) return null;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMeta({ title, description, path, type = "website", noIndex }: PageMetaInput) {
  const fullTitle = path === "/" ? `${siteConfig.name} — ${title}` : `${title} | ${siteConfig.name}`;
  const url = absoluteUrl(path);
  const image = absoluteUrl("/og-image.png");

  const tags: Record<string, unknown>[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:site_name", content: siteConfig.name },
    { property: "og:locale", content: siteConfig.locale },
    { property: "og:type", content: type },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];

  if (url && !noIndex) {
    tags.push({ property: "og:url", content: url });
    tags.push({ tagName: "link", rel: "canonical", href: url });
  }
  if (image) {
    tags.push({ property: "og:image", content: image });
    tags.push({ name: "twitter:image", content: image });
  }
  if (noIndex) {
    tags.push({ name: "robots", content: "noindex" });
  }
  return tags;
}
