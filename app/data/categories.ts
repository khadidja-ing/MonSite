import type { Category, CategorySlug } from "./types";

/**
 * Les grandes familles d'outils et de services d'IA.
 * L'ordre de cette liste est l'ordre d'affichage sur le site.
 */
export const categories: Category[] = [
  {
    slug: "texte",
    name: "Rédaction et génération de textes",
    shortName: "Textes",
    icon: "pen-line",
    summary: "Écrire, résumer, reformuler ou traduire des textes en quelques secondes.",
    description:
      "Ces outils, souvent appelés « assistants conversationnels », comprennent une demande écrite en langage courant et produisent du texte : un e-mail, un résumé, un plan, une traduction… Ils font gagner du temps sur l'écriture, mais leurs réponses doivent toujours être relues, car ils peuvent se tromper.",
    examples: [
      "Rédiger un premier jet d'e-mail ou de courrier",
      "Résumer un long document",
      "Reformuler un texte dans un ton plus professionnel",
      "Traduire un texte dans une autre langue",
    ],
  },
  {
    slug: "images",
    name: "Création d'images",
    shortName: "Images",
    icon: "image",
    summary: "Créer des visuels, illustrations ou retouches à partir d'une simple description.",
    description:
      "On décrit en quelques mots l'image souhaitée (une « consigne » ou « prompt ») et l'outil la génère. Certains outils permettent aussi de retoucher une photo, d'effacer un objet ou d'agrandir une image. Il faut rester attentif aux droits d'utilisation des images produites, qui varient selon les outils.",
    examples: [
      "Créer une illustration pour un article ou une présentation",
      "Imaginer un visuel pour les réseaux sociaux",
      "Retirer l'arrière-plan d'une photo",
      "Explorer des idées de logo ou d'ambiance",
    ],
  },
  {
    slug: "video",
    name: "Création et montage vidéo",
    shortName: "Vidéo",
    icon: "clapperboard",
    summary: "Générer des séquences vidéo, monter plus vite ou ajouter des sous-titres.",
    description:
      "Ces outils aident à produire des vidéos : génération de courtes séquences à partir d'un texte, montage assisté, sous-titrage automatique ou création de vidéos avec un présentateur virtuel. Ils réduisent fortement le temps de production, surtout pour les contenus courts.",
    examples: [
      "Ajouter automatiquement des sous-titres",
      "Transformer un texte en courte vidéo explicative",
      "Découper une longue vidéo en extraits",
      "Créer une vidéo de présentation avec un avatar",
    ],
  },
  {
    slug: "audio",
    name: "Voix, audio et musique",
    shortName: "Audio",
    icon: "audio-lines",
    summary: "Transformer un texte en voix, transcrire un enregistrement ou composer de la musique.",
    description:
      "L'IA sait aujourd'hui lire un texte avec une voix naturelle, transcrire une réunion ou un podcast en texte, nettoyer un enregistrement ou générer des morceaux de musique. L'utilisation de voix réelles (clonage de voix) pose des questions de consentement et doit être encadrée.",
    examples: [
      "Transcrire une réunion ou une interview",
      "Créer une voix off pour une vidéo",
      "Améliorer la qualité d'un enregistrement",
      "Composer une musique d'ambiance",
    ],
  },
  {
    slug: "developpement",
    name: "Programmation et développement",
    shortName: "Développement",
    icon: "code",
    summary: "Écrire, corriger et expliquer du code, ou créer un site et une application.",
    description:
      "Des assistants spécialisés aident les développeurs à écrire du code, à trouver des erreurs ou à comprendre un programme existant. D'autres outils permettent même à des non-spécialistes de créer un site ou une application en décrivant ce qu'ils veulent. Le résultat doit être vérifié, en particulier pour la sécurité.",
    examples: [
      "Obtenir une explication d'un morceau de code",
      "Générer une première version d'un site web",
      "Corriger une erreur dans un programme",
      "Automatiser l'écriture de tests",
    ],
  },
  {
    slug: "automatisation",
    name: "Automatisation et productivité",
    shortName: "Automatisation",
    icon: "workflow",
    summary: "Relier vos applications entre elles et confier les tâches répétitives à l'IA.",
    description:
      "Ces outils exécutent automatiquement des enchaînements de tâches : par exemple, enregistrer chaque pièce jointe reçue dans un dossier, puis prévenir une équipe. Avec l'IA, ils peuvent aussi trier, résumer ou classer des informations. Ils sont utiles pour gagner du temps sur le travail administratif.",
    examples: [
      "Trier et classer automatiquement des e-mails",
      "Créer un compte rendu de réunion",
      "Synchroniser des données entre plusieurs applications",
      "Organiser ses notes et ses tâches",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing et réseaux sociaux",
    shortName: "Marketing",
    icon: "megaphone",
    summary: "Créer des publications, des visuels de marque et des campagnes plus rapidement.",
    description:
      "Les outils de cette famille aident à produire du contenu pour les réseaux sociaux, à décliner des visuels aux couleurs d'une marque ou à préparer des textes publicitaires. Ils accélèrent la création, mais la stratégie et le ton restent à définir par vous.",
    examples: [
      "Préparer un calendrier de publications",
      "Décliner un visuel dans plusieurs formats",
      "Rédiger des accroches publicitaires",
      "Trouver des idées de contenus",
    ],
  },
  {
    slug: "donnees",
    name: "Analyse de données",
    shortName: "Données",
    icon: "chart",
    summary: "Comprendre des tableaux, créer des graphiques et poser des questions à vos données.",
    description:
      "L'IA peut lire un tableau ou un fichier de données, en tirer des tendances, produire des graphiques et répondre à des questions posées en langage courant. C'est une aide précieuse pour qui n'est pas expert en statistiques, à condition de vérifier les chiffres obtenus.",
    examples: [
      "Analyser un fichier de ventes",
      "Créer un graphique à partir d'un tableau",
      "Repérer des tendances ou des anomalies",
      "Rechercher et synthétiser des sources",
    ],
  },
  {
    slug: "agents-assistants",
    name: "Agents IA et assistants virtuels",
    shortName: "Agents IA",
    icon: "bot",
    summary: "Des assistants capables d'enchaîner plusieurs actions pour atteindre un objectif.",
    description:
      "Un « agent IA » ne se contente pas de répondre : il peut effectuer une suite d'actions (chercher une information, remplir un document, utiliser d'autres logiciels) pour accomplir une tâche. Les assistants virtuels, eux, répondent à vos clients ou à vos équipes. Ces technologies évoluent vite et doivent être utilisées avec des garde-fous.",
    examples: [
      "Créer un assistant qui répond aux questions fréquentes",
      "Déléguer une recherche en plusieurs étapes",
      "Construire un chatbot pour un site web",
      "Automatiser une tâche répétitive sur ordinateur",
    ],
  },
  {
    slug: "entreprises",
    name: "Solutions professionnelles et entreprises",
    shortName: "Entreprises",
    icon: "building",
    summary: "Des outils pensés pour les équipes, avec sécurité, gestion des accès et intégration.",
    description:
      "Les entreprises ont des besoins particuliers : confidentialité des données, gestion des accès des salariés, intégration avec les logiciels existants. Plusieurs éditeurs proposent des offres dédiées, souvent intégrées aux outils de bureautique déjà utilisés.",
    examples: [
      "Déployer un assistant IA pour toute une équipe",
      "Interroger les documents internes de l'entreprise",
      "Intégrer l'IA dans les outils bureautiques",
      "Encadrer l'usage de l'IA en interne",
    ],
  },
  {
    slug: "formation",
    name: "Formation et apprentissage de l'IA",
    shortName: "Formation",
    icon: "graduation-cap",
    summary: "Des ressources pour comprendre l'IA et apprendre à bien l'utiliser.",
    description:
      "Pour tirer parti de l'IA, il faut en comprendre les principes, les limites et les bons réflexes. Des cours en ligne, souvent gratuits, permettent d'apprendre à son rythme, du niveau débutant jusqu'à des notions plus techniques.",
    examples: [
      "Découvrir les bases de l'IA sans prérequis",
      "Apprendre à rédiger de bonnes consignes",
      "Comprendre les enjeux éthiques et juridiques",
      "Se former à un outil précis",
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}
