/**
 * Formes des données de la plateforme.
 *
 * Le contenu (outils, catégories, services, articles) est stocké dans des
 * fichiers séparés de l'affichage. Ces types décrivent les champs attendus :
 * TypeScript signale une erreur si une fiche oublie un champ obligatoire.
 * Plus tard, ces mêmes formes pourront être alimentées par une base de
 * données ou un outil de gestion de contenu, sans réécrire les pages.
 */

/** Identifiant d'une icône (voir app/lib/icons.ts). */
export type IconName =
  | "pen-line"
  | "image"
  | "clapperboard"
  | "audio-lines"
  | "code"
  | "workflow"
  | "megaphone"
  | "chart"
  | "bot"
  | "building"
  | "graduation-cap"
  | "compass"
  | "message-circle"
  | "plug"
  | "globe"
  | "users"
  | "lightbulb"
  | "search"
  | "shield"
  | "book-open";

export type CategorySlug =
  | "texte"
  | "images"
  | "video"
  | "audio"
  | "developpement"
  | "automatisation"
  | "marketing"
  | "donnees"
  | "agents-assistants"
  | "entreprises"
  | "formation";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Nom court pour les filtres et les badges. */
  shortName: string;
  icon: IconName;
  /** Une phrase simple, affichée sur les cartes. */
  summary: string;
  /** Explication plus complète, pour un débutant. */
  description: string;
  /** Exemples concrets de ce qu'on peut faire. */
  examples: string[];
}

/**
 * Modèle d'accès d'un outil.
 * - "gratuit" : utilisable gratuitement sans offre payante principale.
 * - "freemium" : version gratuite limitée + offres payantes.
 * - "payant" : pas de version gratuite permanente (un essai peut exister).
 * - "a-confirmer" : information non vérifiée, à contrôler sur le site officiel.
 */
export type AccessModel = "gratuit" | "freemium" | "payant" | "a-confirmer";

export interface Tool {
  /** Identifiant utilisé dans l'adresse de la fiche : /outils/<slug>. */
  slug: string;
  name: string;
  /** Entreprise ou organisation qui édite l'outil. */
  publisher: string;
  /** Adresse du site officiel (https://…). */
  website: string;
  /** Catégorie principale. */
  category: CategorySlug;
  /** Autres catégories pertinentes (facultatif). */
  otherCategories?: CategorySlug[];
  /** Description courte (une phrase). */
  tagline: string;
  /** Présentation plus détaillée (2 à 4 phrases). */
  description: string;
  /** Principaux usages (3 à 5). */
  uses: string[];
  access: AccessModel;
  /** Précision sur l'accès, ex. « Essai gratuit limité ». */
  accessNote?: string;
  /** Pages consultées pour vérifier les informations. */
  sources: string[];
  /** Date de la dernière vérification (AAAA-MM-JJ). */
  lastChecked: string;
  /** Mis en avant sur la page d'accueil. */
  featured?: boolean;
}

/**
 * Statut d'une prestation.
 * Tant qu'une prestation n'est pas confirmée, elle reste « en-preparation »
 * et le site invite seulement à manifester son intérêt.
 */
export type ServiceStatus = "disponible" | "en-preparation";

export interface Service {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  description: string;
  benefits: string[];
  /** À qui s'adresse la prestation. */
  audience: string[];
  status: ServiceStatus;
}

export type ResourceType =
  | "guide"
  | "tutoriel"
  | "comparatif"
  | "conseil"
  | "cas-usage"
  | "nouveautes";

export interface ResourceTypeInfo {
  slug: ResourceType;
  name: string;
  description: string;
  icon: IconName;
}

/** Blocs de contenu d'un article (structure simple, facile à migrer). */
export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; title?: string; text: string };

export interface Article {
  slug: string;
  title: string;
  type: ResourceType;
  summary: string;
  level: "debutant" | "intermediaire";
  /** Catégories d'outils liées (facultatif). */
  categories?: CategorySlug[];
  /** Date de publication (AAAA-MM-JJ). */
  publishedOn: string;
  updatedOn?: string;
  readingMinutes: number;
  body: ArticleBlock[];
}
