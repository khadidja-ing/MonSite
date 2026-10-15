import type { ResourceType, ResourceTypeInfo } from "./types";

/**
 * Les différents types de contenus de la rubrique « Ressources ».
 * L'ordre de cette liste est l'ordre d'affichage sur le site.
 *
 * Un type sans article publié reste affiché, mais signalé « À venir » :
 * aucun contenu n'est inventé pour remplir une rubrique.
 */
export interface ResourceTypeEntry extends ResourceTypeInfo {
  /** Nom au singulier, utilisé sur l'étiquette d'un article (ex. « Guide »). */
  singular: string;
}

export const resourceTypes: ResourceTypeEntry[] = [
  {
    slug: "guide",
    name: "Guides",
    singular: "Guide",
    description: "Des explications de fond pour comprendre une notion pas à pas, sans prérequis technique.",
    icon: "book-open",
  },
  {
    slug: "tutoriel",
    name: "Tutoriels",
    singular: "Tutoriel",
    description: "Des méthodes concrètes, étape par étape, pour réaliser une tâche précise avec l'IA.",
    icon: "graduation-cap",
  },
  {
    slug: "comparatif",
    name: "Comparatifs",
    singular: "Comparatif",
    description: "Des outils d'une même catégorie mis côte à côte, selon des critères clairs et datés.",
    icon: "chart",
  },
  {
    slug: "conseil",
    name: "Conseils",
    singular: "Conseil",
    description: "Les bons réflexes pour utiliser l'IA efficacement, prudemment et en toute sécurité.",
    icon: "lightbulb",
  },
  {
    slug: "cas-usage",
    name: "Cas d'usage",
    singular: "Cas d'usage",
    description: "Des exemples d'utilisation de l'IA dans des situations courantes, personnelles ou professionnelles.",
    icon: "users",
  },
  {
    slug: "nouveautes",
    name: "Nouveautés",
    singular: "Nouveauté",
    description: "Les évolutions importantes du secteur, toujours datées et accompagnées de leurs sources.",
    icon: "globe",
  },
];

export function getResourceType(slug: string): ResourceTypeEntry | undefined {
  return resourceTypes.find((type) => type.slug === slug);
}

export function isResourceType(value: string): value is ResourceType {
  return resourceTypes.some((type) => type.slug === value);
}
