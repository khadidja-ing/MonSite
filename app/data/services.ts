import type { Service } from "./types";

/**
 * Prestations professionnelles.
 *
 * Statut par défaut : "en-preparation". Le site invite alors seulement à
 * manifester son intérêt, sans prétendre que la prestation est disponible.
 * Quand une prestation est confirmée, remplacez son statut par "disponible".
 */
export const services: Service[] = [
  {
    slug: "conseil-accompagnement",
    title: "Conseil et accompagnement en IA",
    icon: "compass",
    summary: "Identifier où l'IA peut réellement vous aider, et par où commencer.",
    description:
      "Un échange pour comprendre votre activité, repérer les tâches où l'IA peut faire gagner du temps et choisir des outils adaptés à votre budget et à votre niveau. L'objectif : avancer avec une feuille de route claire plutôt que de tester des outils au hasard.",
    benefits: [
      "Une vision claire des usages pertinents pour votre activité",
      "Des recommandations d'outils adaptées à votre budget",
      "Des priorités concrètes pour démarrer",
    ],
    audience: ["Indépendants", "Petites entreprises", "Porteurs de projet"],
    status: "en-preparation",
  },
  {
    slug: "automatisation-processus",
    title: "Automatisation des processus",
    icon: "workflow",
    summary: "Confier les tâches répétitives à des automatisations fiables.",
    description:
      "Analyse de vos tâches répétitives (saisie, tri d'e-mails, relances, comptes rendus…) puis mise en place d'enchaînements automatiques entre vos outils, avec l'IA lorsque c'est utile. Chaque automatisation est documentée pour que vous puissiez la comprendre et la faire évoluer.",
    benefits: [
      "Moins de temps passé sur les tâches à faible valeur",
      "Moins d'erreurs de saisie",
      "Des automatisations documentées et compréhensibles",
    ],
    audience: ["Entrepreneurs", "Équipes administratives", "PME"],
    status: "en-preparation",
  },
  {
    slug: "chatbots-assistants",
    title: "Création de chatbots et d'assistants IA",
    icon: "message-circle",
    summary: "Un assistant qui répond aux questions de vos clients ou de vos équipes.",
    description:
      "Conception d'un assistant conversationnel alimenté par vos propres contenus (questions fréquentes, documentation, catalogue) pour répondre aux demandes courantes, sur votre site ou en interne. Le périmètre, le ton et les limites de l'assistant sont définis avec vous.",
    benefits: [
      "Des réponses disponibles à toute heure",
      "Un temps de réponse réduit sur les questions fréquentes",
      "Un assistant qui s'appuie sur vos propres informations",
    ],
    audience: ["Sites e-commerce", "Services clients", "Organismes de formation"],
    status: "en-preparation",
  },
  {
    slug: "integration-outils",
    title: "Intégration d'outils d'intelligence artificielle",
    icon: "plug",
    summary: "Connecter l'IA aux logiciels que vous utilisez déjà.",
    description:
      "Mise en place et paramétrage d'outils d'IA dans votre environnement de travail existant (messagerie, bureautique, gestion client…), en tenant compte de la confidentialité de vos données et des coûts d'utilisation.",
    benefits: [
      "Des outils d'IA intégrés à vos habitudes de travail",
      "Une attention portée à la confidentialité des données",
      "Des coûts d'utilisation anticipés",
    ],
    audience: ["PME", "Équipes", "Professions libérales"],
    status: "en-preparation",
  },
  {
    slug: "creation-sites-web",
    title: "Création de sites web avec l'aide de l'IA",
    icon: "globe",
    summary: "Un site professionnel, conçu plus rapidement grâce à l'IA.",
    description:
      "Création d'un site vitrine moderne et adapté au téléphone, en utilisant l'IA pour accélérer la rédaction, la conception et le développement. Chaque contenu généré est relu et adapté à votre activité.",
    benefits: [
      "Un site moderne, rapide et adapté au mobile",
      "Des délais de réalisation réduits",
      "Des contenus relus et personnalisés",
    ],
    audience: ["Indépendants", "Commerçants", "Associations"],
    status: "en-preparation",
  },
  {
    slug: "formation-initiation",
    title: "Formation et initiation à l'IA",
    icon: "graduation-cap",
    summary: "Apprendre à utiliser l'IA de façon efficace et responsable.",
    description:
      "Des séances d'initiation pour comprendre les principes de l'IA, découvrir les principaux outils et apprendre à rédiger de bonnes consignes. Les contenus sont adaptés au niveau des participants, y compris les grands débutants.",
    benefits: [
      "Des bases solides, sans jargon",
      "Des exercices pratiques sur des cas concrets",
      "Les bons réflexes : vérification, confidentialité, limites",
    ],
    audience: ["Débutants", "Équipes", "Étudiants"],
    status: "en-preparation",
  },
  {
    slug: "accompagnement-entreprises",
    title: "Accompagnement des projets IA en entreprise",
    icon: "building",
    summary: "Un suivi de vos projets IA, du cadrage à l'adoption par les équipes.",
    description:
      "Accompagnement d'un projet IA sur la durée : définition des objectifs, choix des solutions, test sur un périmètre limité, puis déploiement et adoption par les équipes. Une attention particulière est portée au cadre légal et à la protection des données.",
    benefits: [
      "Un projet cadré, avec des objectifs mesurables",
      "Un test à petite échelle avant tout déploiement",
      "Des équipes accompagnées dans le changement",
    ],
    audience: ["PME", "Directions métiers", "Associations"],
    status: "en-preparation",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
