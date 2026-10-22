import type { Tool } from "./types";

/**
 * Catalogue des outils d'IA.
 *
 * Chaque fiche a été recherchée puis revérifiée de façon indépendante le
 * 2026-10-14 (site officiel, éditeur, modèle d'accès), à partir des sources
 * listées dans "sources". Les offres évoluent souvent : pensez à revérifier
 * régulièrement et à mettre à jour "lastChecked".
 *
 * Pour ajouter un outil : copiez une fiche existante, modifiez ses champs,
 * et utilisez access: "a-confirmer" tant que le modèle d'accès n'est pas vérifié.
 * Pour le mettre en avant sur la page d'accueil : featured: true.
 */
export const tools: Tool[] = [
  {
    slug: "chatgpt",
    name: "ChatGPT",
    publisher: "OpenAI",
    website: "https://chatgpt.com",
    category: "texte",
    otherCategories: [
      "images",
      "agents-assistants"
    ],
    tagline: "Assistant conversationnel d'OpenAI pour rédiger, résumer, chercher sur le web et analyser des fichiers.",
    description: "ChatGPT est un assistant conversationnel développé par OpenAI : on lui écrit une question ou une consigne en langage courant et il répond par écrit. La version gratuite permet notamment de discuter, de faire des recherches sur le web, d'importer des fichiers et de créer des images ; l'import de fichiers, la création d'images et d'autres outils y sont soumis à des limites d'utilisation. Les réponses peuvent contenir des erreurs : il faut vérifier les informations importantes.",
    uses: [
      "Rédiger ou reformuler un e-mail",
      "Résumer un document importé",
      "Rechercher des informations à jour sur le web",
      "Générer une image à partir d'une description"
    ],
    access: "freemium",
    accessNote: "Version gratuite avec limites d'utilisation ; offres payantes pour un usage plus intensif",
    sources: [
      "https://chatgpt.com/pricing/",
      "https://chatgpt.com/plans/free/",
      "https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq",
      "https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt"
    ],
    lastChecked: "2026-10-14",
    featured: true
  },
  {
    slug: "claude",
    name: "Claude",
    publisher: "Anthropic",
    website: "https://claude.com",
    category: "texte",
    otherCategories: [
      "developpement",
      "agents-assistants"
    ],
    tagline: "Assistant conversationnel d'Anthropic pour rédiger, analyser des documents, coder et chercher sur le web.",
    description: "Claude est l'assistant d'IA conversationnel d'Anthropic, utilisable sur le web, sur ordinateur et sur mobile. L'offre gratuite permet de rédiger et modifier des textes, de chercher sur le web, de créer des fichiers et de générer du code ; d'autres fonctions, comme Claude Code ou Research, sont réservées aux offres payantes. Des limites d'utilisation s'appliquent à toutes les offres, et les réponses doivent être vérifiées.",
    uses: [
      "Rédiger et corriger un texte",
      "Analyser un document ou un fichier",
      "Générer du code ou visualiser des données",
      "Rechercher des informations sur le web"
    ],
    access: "freemium",
    accessNote: "Version gratuite avec limites d'utilisation ; certaines fonctions réservées aux offres payantes",
    sources: [
      "https://claude.com/pricing",
      "https://claude.com/"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "gemini",
    name: "Gemini",
    publisher: "Google",
    website: "https://gemini.google.com",
    category: "texte",
    otherCategories: [
      "images",
      "agents-assistants"
    ],
    tagline: "Assistant d'IA de Google pour discuter, rédiger, analyser des fichiers et mener des recherches approfondies.",
    description: "Gemini est l'assistant d'IA de Google, utilisable gratuitement avec un compte Google. La version gratuite inclut notamment la génération et la modification d'images, l'import de fichiers, les « Gems » (assistants personnalisés) et Deep Research, avec des limites d'utilisation qui dépendent de la complexité des demandes. Les abonnements Google AI relèvent ces limites et donnent accès à des modèles et des fonctions supplémentaires.",
    uses: [
      "Poser une question en langage courant",
      "Analyser un fichier importé",
      "Produire un rapport de recherche avec Deep Research",
      "Créer ou modifier une image"
    ],
    access: "freemium",
    accessNote: "Utilisable gratuitement avec un compte Google ; abonnements Google AI pour des limites plus élevées",
    sources: [
      "https://gemini.google/subscriptions/",
      "https://gemini.google/about/",
      "https://gemini.google.com/advanced",
      "https://support.google.com/gemini/answer/15719111?hl=en"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "mistral-vibe",
    name: "Mistral Vibe",
    publisher: "Mistral AI",
    website: "https://mistral.ai/products/vibe/",
    category: "texte",
    otherCategories: [
      "agents-assistants",
      "developpement"
    ],
    tagline: "Assistant d'IA de Mistral AI (anciennement Le Chat) pour discuter, chercher sur le web et confier des tâches.",
    description: "Mistral Vibe est le nouveau nom de Le Chat, l'assistant d'IA de l'entreprise française Mistral AI, renommé fin mai 2026 ; l'adresse chat.mistral.ai, les historiques et les abonnements ont été conservés. Il permet de discuter, de chercher sur le web et de confier des tâches en plusieurs étapes, et propose un volet « Code » pour la programmation. L'offre gratuite donne un accès limité, pensé pour les réponses rapides et les tâches simples.",
    uses: [
      "Obtenir une réponse rapide à une question",
      "Rechercher des informations sur le web",
      "Confier une tâche en plusieurs étapes",
      "Programmer avec l'aide du volet Code"
    ],
    access: "freemium",
    accessNote: "Version gratuite avec accès limité ; offres payantes pour les tâches complexes et un usage intensif",
    sources: [
      "https://mistral.ai/products/vibe/",
      "https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe",
      "https://mistral.ai/news/vibe-agent/",
      "https://mistral.ai/pricing/"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "deepl",
    name: "DeepL",
    publisher: "DeepL SE",
    website: "https://www.deepl.com",
    category: "texte",
    tagline: "Service de traduction automatique de textes et de documents, complété par un outil d'aide à la rédaction.",
    description: "DeepL est un outil de traduction automatique qui traduit des textes et des documents entiers (par exemple des PDF), complété par DeepL Write pour améliorer la formulation d'un texte. Les versions gratuites de DeepL Translator et de DeepL Write sont utilisables à titre privé comme professionnel, avec des limites ; les offres DeepL Pro relèvent ces limites. Point d'attention : selon les conditions de DeepL, la version gratuite ne doit pas servir à traiter des contenus confidentiels ou des données personnelles.",
    uses: [
      "Traduire un texte dans une autre langue",
      "Traduire un document PDF",
      "Corriger le style d'un e-mail avec DeepL Write",
      "Comparer une traduction avec le texte d'origine"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée ; essai gratuit de DeepL Pro disponible",
    sources: [
      "https://www.deepl.com/en/pro",
      "https://www.deepl.com/en/terms-of-use",
      "https://www.deepl.com/en/pro-license",
      "https://www.deepl.com/en/features/document-translation/pdf"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "microsoft-copilot",
    name: "Microsoft Copilot",
    publisher: "Microsoft",
    website: "https://copilot.cloud.microsoft",
    category: "agents-assistants",
    otherCategories: [
      "texte",
      "images"
    ],
    tagline: "Assistant d'IA de Microsoft pour discuter, rédiger, chercher sur le web et créer des images.",
    description: "Microsoft Copilot est l'assistant d'IA de Microsoft, disponible sur le web, sous Windows et sur mobile ; une version gratuite limitée est proposée aux particuliers. La connexion avec un compte personnel Microsoft donne accès à l'historique des conversations, à davantage de créations d'images et à des échanges vocaux plus longs. L'intégration plus poussée dans Word, Excel, PowerPoint et Outlook passe par un abonnement Microsoft 365 éligible.",
    uses: [
      "Poser une question et obtenir une réponse issue du web",
      "Rédiger ou résumer un texte",
      "Créer une image à partir d'une description",
      "Échanger à voix haute avec l'assistant"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée ; fonctions avancées incluses dans certains abonnements Microsoft 365",
    sources: [
      "https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/individuals",
      "https://support.microsoft.com/en-us/microsoft-365-copilot/what-is-microsoft-copilot-app",
      "https://support.microsoft.com/en-us/microsoft-365-copilot/what-s-the-difference-between-microsoft-copilot-free-and-copilot-in-microsoft-365",
      "https://support.microsoft.com/topic/understanding-the-different-microsoft-copilot-experiences-cfff4791-694a-4d90-9c9c-1eb3fb28e842"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "voiceflow",
    name: "Voiceflow",
    publisher: "Voiceflow",
    website: "https://www.voiceflow.com",
    category: "agents-assistants",
    otherCategories: [
      "automatisation"
    ],
    tagline: "Plateforme pour concevoir, tester et déployer des agents d'IA conversationnels, par écrit ou par la voix.",
    description: "Voiceflow permet de construire des agents d'IA conversationnels, principalement pour le service client, déployables en chat sur un site web, par téléphone ou sur des messageries. On peut leur ajouter une base de connaissances (documents, pages web) et les connecter à des outils comme Zendesk, Salesforce ou HubSpot. L'offre gratuite sert surtout à découvrir l'outil : ses fonctions et ses crédits sont limités, et Voiceflow la déconseille pour un usage en production.",
    uses: [
      "Créer un agent de support client",
      "Ajouter une base de connaissances à un agent",
      "Déployer un agent en chat sur un site web",
      "Connecter un agent à un outil de tickets"
    ],
    access: "freemium",
    accessNote: "Offre gratuite pour découvrir l'outil, déconseillée pour la production ; offres payantes ensuite",
    sources: [
      "https://www.voiceflow.com/docs/documentation/account-management/billing",
      "https://docs.voiceflow.com/docs/billing-plans",
      "https://www.voiceflow.com/pricing",
      "https://docs.voiceflow.com/"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "botpress",
    name: "Botpress",
    publisher: "Botpress",
    website: "https://botpress.com",
    category: "agents-assistants",
    otherCategories: [
      "automatisation"
    ],
    tagline: "Plateforme pour créer des agents d'IA et des chatbots, puis les publier sur un site web ou une messagerie.",
    description: "Botpress est une plateforme de création d'agents d'IA et de chatbots : on leur fournit une base de connaissances (documents, sources externes), puis on les publie sur un site web ou sur des canaux comme WhatsApp, Slack ou Microsoft Teams. Les nouveaux espaces de travail démarrent sur une offre gratuite limitée en nombre de conversations par mois ; les offres payantes relèvent ces limites. Certains canaux, comme WhatsApp, demandent aussi des démarches auprès de Meta.",
    uses: [
      "Créer un chatbot pour un site web",
      "Alimenter un agent avec ses propres documents",
      "Publier un agent sur WhatsApp ou Slack",
      "Connecter un agent à Notion ou Google Drive"
    ],
    access: "freemium",
    accessNote: "Offre gratuite limitée en nombre de conversations par mois ; offres payantes au-delà",
    sources: [
      "https://botpress.com/blog/pricing-update-may-2026",
      "https://botpress.com/en/academy-lesson/pricing-overview",
      "https://botpress.com/channels/whatsapp-chatbot-integration",
      "https://botpress.com/blog/channel-integration"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "microsoft-365-copilot",
    name: "Microsoft 365 Copilot",
    publisher: "Microsoft",
    website: "https://www.microsoft.com/fr-fr/microsoft-365-copilot",
    category: "entreprises",
    otherCategories: [
      "texte",
      "agents-assistants"
    ],
    tagline: "Assistant d'IA intégré à Word, Excel, PowerPoint, Outlook et Teams, qui s'appuie sur les données de l'entreprise.",
    description: "Microsoft 365 Copilot est la version professionnelle de Copilot : elle s'intègre aux applications Microsoft 365 et s'appuie sur les e-mails, réunions, fichiers et conversations de l'organisation, en respectant les autorisations existantes. Elle nécessite une licence payante, en complément d'un abonnement Microsoft 365 éligible ou incluse dans certaines offres groupées ; Copilot Chat, qui s'appuie sur le web, est inclus sans surcoût dans les abonnements éligibles. Microsoft présente désormais aussi cette offre sous le nom « Microsoft Copilot », dans une application commune aux comptes personnels et professionnels.",
    uses: [
      "Résumer un fil d'e-mails dans Outlook",
      "Récapituler une réunion Teams",
      "Rédiger un brouillon de document dans Word",
      "Analyser un tableau dans Excel"
    ],
    access: "payant",
    accessNote: "Essai gratuit d'un mois proposé sur certaines offres ; Copilot Chat inclus avec les abonnements Microsoft 365 éligibles",
    sources: [
      "https://www.microsoft.com/en-us/microsoft-365-copilot",
      "https://www.microsoft.com/en-us/microsoft-365-copilot/pricing",
      "https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/enterprise",
      "https://www.microsoft.com/en-us/microsoft-365-copilot/chat"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "google-workspace-gemini",
    name: "Google Workspace avec Gemini",
    publisher: "Google",
    website: "https://workspace.google.com",
    category: "entreprises",
    otherCategories: [
      "texte"
    ],
    tagline: "Suite bureautique de Google (Gmail, Docs, Meet…) avec l'assistant Gemini intégré aux offres professionnelles.",
    description: "Les offres professionnelles Google Workspace incluent Gemini sans module complémentaire : l'application Gemini et quelques fonctions d'IA dans Gmail dès l'offre d'entrée de gamme (Business Starter), puis Gemini dans Docs, Sheets, Slides, Drive et Meet à partir de l'offre Business Standard. Les fonctions disponibles et les limites d'utilisation varient selon l'offre choisie. Il s'agit d'un service payant, qui propose un essai gratuit aux nouvelles inscriptions.",
    uses: [
      "Rédiger un e-mail dans Gmail",
      "Résumer un fil de discussion par e-mail",
      "Rédiger un brouillon dans Google Docs",
      "Poser une question à Gemini pendant une réunion Meet"
    ],
    access: "payant",
    accessNote: "Essai gratuit disponible ; fonctions de Gemini variables selon l'offre",
    sources: [
      "https://workspace.google.com/pricing",
      "https://workspace.google.com/",
      "https://workspace.google.com/solutions/ai/",
      "https://knowledge.workspace.google.com/admin/getting-started/editions/compare-business-editions"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "glean",
    name: "Glean",
    publisher: "Glean",
    website: "https://www.glean.com",
    category: "entreprises",
    otherCategories: [
      "agents-assistants"
    ],
    tagline: "Plateforme d'IA pour entreprises : recherche dans les outils internes, assistant et création d'agents.",
    description: "Glean est une plateforme d'IA destinée aux entreprises, qui se connecte aux outils internes de l'organisation pour permettre d'y rechercher l'information et d'interroger un assistant d'IA. Elle propose aussi des outils pour créer, orchestrer et encadrer des agents. Elle s'adresse aux organisations plutôt qu'aux particuliers : la tarification se fait par utilisateur, et certaines fonctions avancées sont facturées à l'usage.",
    uses: [
      "Rechercher un document dans les outils de l'entreprise",
      "Poser une question sur des informations internes",
      "Créer un agent pour une tâche récurrente",
      "Retrouver une information répartie entre plusieurs outils"
    ],
    access: "payant",
    accessNote: "Offre réservée aux entreprises ; démonstration sur demande",
    sources: [
      "https://www.glean.com/",
      "https://www.glean.com/product/overview",
      "https://docs.glean.com/glean-core-suite-pricing",
      "https://docs.glean.com/glean-enterprise-flex-pricing"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "canva",
    name: "Canva",
    publisher: "Canva",
    website: "https://www.canva.com",
    category: "marketing",
    otherCategories: [
      "images"
    ],
    tagline: "Outil de création graphique en ligne, avec modèles et fonctions d'IA, pour réaliser visuels et documents.",
    description: "Canva permet de créer des visuels, des présentations et d'autres documents à partir de modèles, et intègre des fonctions d'IA comme Magic Write (génération de texte) ou la suppression d'arrière-plan. La version gratuite donne accès à certaines de ces fonctions avec un quota mensuel limité, tandis que Canva AI 2.0 (création de designs par conversation) est réservé aux offres payantes. Les règles d'utilisation de l'IA varient selon l'offre.",
    uses: [
      "Créer un visuel pour les réseaux sociaux",
      "Rédiger un texte avec Magic Write",
      "Supprimer l'arrière-plan d'une photo",
      "Agrandir une image avec l'IA"
    ],
    access: "freemium",
    accessNote: "Version gratuite avec fonctions d'IA limitées ; Canva AI 2.0 réservé aux offres payantes",
    sources: [
      "https://www.canva.com/pricing/",
      "https://www.canva.com/canva-ai/",
      "https://www.canva.com/help/ai-access-variantb/",
      "https://www.canva.com/en_au/help/new-canva-ai/"
    ],
    lastChecked: "2026-10-14",
    featured: true
  },
  {
    slug: "jasper",
    name: "Jasper",
    publisher: "Jasper",
    website: "https://www.jasper.ai",
    category: "marketing",
    otherCategories: [
      "texte"
    ],
    tagline: "Plateforme d'IA pour équipes marketing : création de contenus, voix de marque et agents spécialisés.",
    description: "Jasper est une plateforme d'IA destinée aux équipes marketing : elle aide à produire des contenus en appliquant la voix de marque, les publics cibles et les sources validées par l'entreprise. Elle propose des agents spécialisés et des chaînes de production de contenus automatisées, notamment avec l'outil Jasper Grid. Il n'existe pas de version gratuite permanente : l'offre Pro peut être testée gratuitement pendant une période limitée.",
    uses: [
      "Rédiger un article de blog avec un agent dédié",
      "Définir et appliquer une voix de marque",
      "Automatiser une chaîne de production de contenus",
      "Adapter un contenu à plusieurs publics"
    ],
    access: "payant",
    accessNote: "Essai gratuit disponible",
    sources: [
      "https://www.jasper.ai/pricing",
      "https://www.jasper.ai/free-trial",
      "https://www.jasper.ai/",
      "https://www.jasper.ai/jasper-iq"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "buffer",
    name: "Buffer",
    publisher: "Buffer",
    website: "https://buffer.com",
    category: "marketing",
    tagline: "Outil de programmation de publications sur les réseaux sociaux, avec un assistant d'IA pour rédiger les posts.",
    description: "Buffer permet de préparer et de programmer des publications sur plusieurs réseaux sociaux (Instagram, LinkedIn, TikTok, Facebook…) depuis une seule interface. Son assistant d'IA aide à trouver des idées de posts et à reformuler, raccourcir ou adapter un texte à chaque réseau. La version gratuite limite le nombre de canaux connectés et de publications programmées.",
    uses: [
      "Programmer des publications sur plusieurs réseaux",
      "Trouver des idées de posts avec l'IA",
      "Adapter un post d'un réseau à un autre",
      "Raccourcir ou reformuler une légende"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée en canaux et en publications ; offres payantes pour plus de fonctions",
    sources: [
      "https://buffer.com/pricing",
      "https://buffer.com/",
      "https://buffer.com/ai-assistant",
      "https://buffer.com/publish"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "midjourney",
    name: "Midjourney",
    publisher: "Midjourney, Inc.",
    website: "https://www.midjourney.com",
    category: "images",
    otherCategories: [
      "video"
    ],
    tagline: "Générateur d'images à partir de descriptions textuelles, accessible sur le web et via Discord.",
    description: "Midjourney est un service qui crée des images à partir d'une description écrite (un « prompt ») et permet aussi d'animer des images en courtes vidéos. Il s'adresse aux personnes qui veulent produire des illustrations ou des visuels créatifs. Un abonnement est nécessaire, et les créations sont publiques par défaut : le mode privé (« Stealth ») est réservé aux offres supérieures.",
    uses: [
      "Créer une illustration à partir d'un texte",
      "Explorer des idées visuelles pour un projet",
      "Animer une image en courte vidéo",
      "Retoucher une image avec l'éditeur intégré"
    ],
    access: "payant",
    accessNote: "Abonnement requis ; pas d'essai gratuit sur le site web ni sur Discord",
    sources: [
      "https://docs.midjourney.com/hc/en-us/articles/27870399340173-Free-Trials",
      "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
      "https://docs.midjourney.com/hc/en-us/sections/28005319720845-Plan-Information",
      "https://docs.midjourney.com/hc/en-us/articles/32019750070669-Stealth-Mode"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "adobe-firefly",
    name: "Adobe Firefly",
    publisher: "Adobe",
    website: "https://www.adobe.com/products/firefly.html",
    category: "images",
    otherCategories: [
      "video",
      "audio"
    ],
    tagline: "Application d'IA générative d'Adobe pour créer et retoucher images, vidéos et autres contenus à partir de texte.",
    description: "Adobe Firefly est l'application d'IA générative d'Adobe : elle génère des images et des vidéos à partir d'une description, permet de retoucher des images (remplissage génératif, extension d'image) et propose aussi des fonctions audio comme la création d'effets sonores. Elle s'adresse aux créateurs et aux professionnels, notamment ceux qui utilisent déjà les logiciels Adobe. Elle donne aussi accès à des modèles de partenaires tiers, dont les conditions d'utilisation commerciale peuvent différer de celles des modèles d'Adobe.",
    uses: [
      "Générer une image à partir d'un texte",
      "Compléter ou étendre une photo",
      "Créer une courte vidéo à partir d'une image",
      "Produire une illustration vectorielle"
    ],
    access: "freemium",
    accessNote: "Générations gratuites quotidiennes limitées ; offres payantes pour plus de modèles et de volume",
    sources: [
      "https://www.adobe.com/products/firefly.html",
      "https://www.adobe.com/cc-shared/fragments/products/firefly/plans/faq",
      "https://helpx.adobe.com/creative-cloud/apps/generative-ai/generative-credits-faq.html",
      "https://helpx.adobe.com/firefly/using/whats-new.html"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "leonardo-ai",
    name: "Leonardo.Ai",
    publisher: "Leonardo Interactive (Canva)",
    website: "https://leonardo.ai",
    category: "images",
    otherCategories: [
      "video",
      "marketing"
    ],
    tagline: "Plateforme en ligne de génération d'images et de vidéos par IA, appartenant à Canva.",
    description: "Leonardo.Ai est une plateforme en ligne qui génère des images et des vidéos à partir de descriptions textuelles, avec des outils dédiés comme la création de personnages cohérents. Elle s'adresse aux créateurs, illustrateurs et équipes marketing. Avec l'offre gratuite, les créations sont publiques et restent la propriété de Leonardo.Ai (l'utilisateur dispose d'une licence d'utilisation) ; les offres payantes permettent un mode privé.",
    uses: [
      "Générer une image à partir d'un texte",
      "Créer un personnage cohérent sur plusieurs images",
      "Transformer un texte en courte vidéo",
      "Produire des visuels pour les réseaux sociaux"
    ],
    access: "freemium",
    accessNote: "Version gratuite avec allocation quotidienne limitée ; offres payantes pour un usage avancé",
    sources: [
      "https://leonardo.ai/pricing",
      "https://leonardo.ai/news/midjourney-vs-leonardo-ai",
      "https://leonardo.ai/ai-character-generator",
      "https://leonardo.ai/text-to-video"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "ideogram",
    name: "Ideogram",
    publisher: "Ideogram AI",
    website: "https://ideogram.ai",
    category: "images",
    otherCategories: [
      "marketing"
    ],
    tagline: "Générateur d'images par IA conçu pour intégrer du texte lisible dans les visuels (affiches, logos).",
    description: "Ideogram est un outil en ligne qui crée des images à partir d'une description et met l'accent sur le rendu du texte à l'intérieur de l'image, utile pour des affiches, des logos ou des visuels de communication. Il s'adresse aux particuliers comme aux designers. Avec l'offre gratuite, les images générées sont publiques, et le texte produit doit être relu car des fautes restent possibles.",
    uses: [
      "Créer une affiche avec un titre lisible",
      "Imaginer des pistes de logo",
      "Générer une image à partir d'un texte",
      "Modifier le texte d'une image dans l'éditeur"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée (crédits gratuits seulement avec une connexion Google, Apple ou Microsoft) ; offres payantes pour un usage avancé",
    sources: [
      "https://ideogram.ai/pricing",
      "https://docs.ideogram.ai/plans-and-billing/available-plans",
      "https://docs.ideogram.ai/help/frequently-asked-questions",
      "https://docs.ideogram.ai/"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "runway",
    name: "Runway",
    publisher: "Runway AI, Inc.",
    website: "https://runwayml.com",
    category: "video",
    otherCategories: [
      "images"
    ],
    tagline: "Plateforme d'IA pour générer de courtes vidéos à partir d'un texte ou d'une image.",
    description: "Runway est une plateforme en ligne qui génère de courtes vidéos à partir d'une description écrite ou d'une image de départ, et propose aussi des outils de création d'images. Elle s'adresse aux créateurs de contenu, vidéastes et équipes créatives. L'offre gratuite fournit un nombre limité de crédits qui ne se renouvellent pas, et les vidéos générées avec cette offre portent un filigrane.",
    uses: [
      "Générer un court clip vidéo à partir d'un texte",
      "Animer une image fixe",
      "Tester des idées de plans pour un projet vidéo",
      "Créer une image à partir d'un texte"
    ],
    access: "freemium",
    accessNote: "Offre gratuite avec crédits attribués une seule fois ; abonnement payant pour un usage régulier",
    sources: [
      "https://runwayml.com/pricing",
      "https://help.runwayml.com/hc/en-us/articles/50404627334547-Free-plan-details",
      "https://help.runwayml.com/hc/en-us/articles/15124877443219-How-do-credits-work",
      "https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "synthesia",
    name: "Synthesia",
    publisher: "Synthesia Ltd",
    website: "https://www.synthesia.io",
    category: "video",
    otherCategories: [
      "entreprises",
      "formation"
    ],
    tagline: "Création de vidéos avec avatars IA à partir d'un script, dans de nombreuses langues.",
    description: "Synthesia permet de produire des vidéos dans lesquelles un avatar virtuel lit un texte, sans caméra ni micro, avec des voix disponibles dans de nombreuses langues. Il s'adresse surtout aux entreprises, par exemple pour la formation interne ou la communication. Avec l'offre gratuite, les vidéos portent le logo Synthesia et le téléchargement nécessite une offre payante.",
    uses: [
      "Transformer un script en vidéo avec avatar",
      "Créer un module de formation en vidéo",
      "Doubler une vidéo dans une autre langue",
      "Présenter un produit ou un processus en vidéo"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée (logo Synthesia, pas de téléchargement) ; offres payantes pour un usage avancé",
    sources: [
      "https://www.synthesia.io/pricing",
      "https://www.synthesia.io/",
      "https://help.synthesia.io/en/articles/17217419-what-s-changing-in-synthesia-plans-on-october-1-2026",
      "https://www.synthesia.io/features/ai-video-generator"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "heygen",
    name: "HeyGen",
    publisher: "HeyGen Inc.",
    website: "https://www.heygen.com",
    category: "video",
    otherCategories: [
      "marketing"
    ],
    tagline: "Création de vidéos avec avatars IA et traduction de vidéos avec synchronisation des lèvres.",
    description: "HeyGen génère des vidéos dans lesquelles un avatar, choisi dans une bibliothèque ou créé à partir d'un enregistrement de la personne, prononce un texte. Il peut aussi traduire une vidéo existante dans d'autres langues en synchronisant les lèvres, et s'adresse aux créateurs, marketeurs et entreprises. L'offre gratuite est limitée en nombre et en durée de vidéos.",
    uses: [
      "Transformer un script en vidéo avec avatar",
      "Traduire une vidéo dans une autre langue",
      "Créer son avatar à partir d'une courte vidéo",
      "Produire de courtes vidéos marketing"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée ; offres payantes pour un usage avancé",
    sources: [
      "https://www.heygen.com/pricing",
      "https://www.heygen.com/faq",
      "https://www.heygen.com/translate",
      "https://www.heygen.com/tool/text-to-video"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "capcut",
    name: "CapCut",
    publisher: "ByteDance",
    website: "https://www.capcut.com",
    category: "video",
    tagline: "Éditeur vidéo sur mobile, ordinateur et web, doté de fonctions d'IA (sous-titres, détourage…).",
    description: "CapCut est un logiciel de montage vidéo disponible en application mobile, sur ordinateur et en ligne, qui intègre des fonctions d'IA comme les sous-titres automatiques, la suppression d'arrière-plan ou la génération de vidéos. Il s'adresse notamment aux créateurs de vidéos pour les réseaux sociaux. Certaines fonctions d'IA et ressources marquées « Pro » sont réservées aux abonnés ou ajoutent un filigrane à l'export, et la disponibilité de l'application varie selon les pays.",
    uses: [
      "Monter une vidéo pour les réseaux sociaux",
      "Ajouter des sous-titres automatiques",
      "Supprimer l'arrière-plan d'une vidéo",
      "Générer une courte vidéo à partir d'un texte"
    ],
    access: "freemium",
    accessNote: "Version gratuite ; fonctions et ressources « Pro » réservées aux abonnés (essai gratuit possible pour les nouveaux utilisateurs éligibles)",
    sources: [
      "https://www.capcut.com/help/capcut-standard-vs-pro",
      "https://www.capcut.com/resource/capcut-standard-vs-pro",
      "https://www.capcut.com/help/capcut-pro-free-trail",
      "https://www.capcut.com/tools/video-background-remover"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    publisher: "ElevenLabs",
    website: "https://elevenlabs.io",
    category: "audio",
    otherCategories: [
      "agents-assistants",
      "developpement"
    ],
    tagline: "Plateforme d'IA vocale : synthèse vocale, transcription, doublage, effets sonores et musique.",
    description: "ElevenLabs transforme un texte en voix de synthèse, transcrit l'audio en texte et propose du doublage de vidéos, des effets sonores et de la génération de musique. Elle s'adresse aux créateurs, aux entreprises et aux développeurs, qui peuvent l'utiliser via une API ou pour créer des agents vocaux. L'offre gratuite est réservée à un usage personnel non commercial avec mention d'ElevenLabs, et cloner une voix nécessite d'en avoir l'autorisation.",
    uses: [
      "Lire un texte avec une voix de synthèse",
      "Transcrire un enregistrement audio",
      "Doubler une vidéo dans une autre langue",
      "Créer des effets sonores"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée à un usage personnel non commercial ; offres payantes pour un usage commercial",
    sources: [
      "https://elevenlabs.io/pricing",
      "https://elevenlabs.io/text-to-speech",
      "https://elevenlabs.io/voice-cloning",
      "https://elevenlabs.io/docs/eleven-creative/products/dubbing/dubbing-studio"
    ],
    lastChecked: "2026-10-14",
    featured: true
  },
  {
    slug: "suno",
    name: "Suno",
    publisher: "Suno, Inc.",
    website: "https://suno.com",
    category: "audio",
    tagline: "Générateur de chansons par IA à partir d'une description ou de vos propres paroles.",
    description: "Suno crée des morceaux de musique, chantés ou instrumentaux, à partir d'une description du style souhaité ou de paroles fournies par l'utilisateur. Il s'adresse aux curieux, aux musiciens amateurs et aux créateurs de contenu. Les morceaux créés avec l'offre gratuite sont réservés à un usage non commercial, et s'abonner ensuite ne donne pas de droits commerciaux rétroactifs sur ces morceaux.",
    uses: [
      "Composer une chanson à partir d'une idée",
      "Mettre en musique ses propres paroles",
      "Créer une musique instrumentale",
      "Trouver des idées de paroles"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée à un usage non commercial ; offres payantes avec droits d'usage commercial",
    sources: [
      "https://suno.com/pricing",
      "https://help.suno.com/en/articles/9601601",
      "https://help.suno.com/en/articles/2425729",
      "https://help.suno.com/en/articles/3197377"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "descript",
    name: "Descript",
    publisher: "Descript, Inc.",
    website: "https://www.descript.com",
    category: "audio",
    otherCategories: [
      "video"
    ],
    tagline: "Logiciel de montage audio et vidéo qui se pilote en modifiant le texte de la transcription.",
    description: "Descript transcrit automatiquement un enregistrement audio ou vidéo, puis permet de le monter en modifiant le texte : supprimer un mot dans la transcription le supprime de l'enregistrement. Il s'adresse notamment aux podcasteurs et créateurs de vidéos, et intègre des outils d'IA comme l'amélioration du son ou la suppression des mots de remplissage. Selon l'éditeur, le montage n'est pas pris en charge sur navigateur mobile ni sur tablette.",
    uses: [
      "Monter un podcast en éditant le texte",
      "Supprimer les « euh » et les silences",
      "Améliorer la qualité d'un enregistrement vocal",
      "Ajouter des sous-titres à une vidéo"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée ; offres payantes pour un usage avancé",
    sources: [
      "https://www.descript.com/pricing",
      "https://www.descript.com/",
      "https://help.descript.com/hc/en-us/articles/10255869838605",
      "https://www.descript.com/blog/article/best-ai-video-editor"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "github-copilot",
    name: "GitHub Copilot",
    publisher: "GitHub (Microsoft)",
    website: "https://github.com/features/copilot",
    category: "developpement",
    otherCategories: [
      "agents-assistants"
    ],
    tagline: "Assistant de programmation qui suggère du code et répond aux questions directement dans l’éditeur.",
    description: "GitHub Copilot est un assistant de programmation développé par GitHub. Il propose des complétions de code pendant la saisie, un chat pour poser des questions et un mode agent capable de réaliser certaines tâches de développement. Il s’adresse surtout aux personnes qui codent déjà ; le code suggéré doit toujours être relu et testé.",
    uses: [
      "Compléter du code pendant la saisie",
      "Expliquer un morceau de code",
      "Poser une question de programmation",
      "Confier une tâche de développement à l’agent"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée ; offres payantes pour un usage plus intensif",
    sources: [
      "https://github.com/features/copilot/plans",
      "https://github.blog/changelog/2026-06-01-updates-to-github-copilot-billing-and-plans/",
      "https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/",
      "https://docs.github.com/en/billing/concepts/product-billing/github-copilot-billing"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "cursor",
    name: "Cursor",
    publisher: "Anysphere (SpaceX)",
    website: "https://cursor.com",
    category: "developpement",
    otherCategories: [
      "agents-assistants"
    ],
    tagline: "Éditeur de code intégrant un assistant IA capable de proposer, modifier et expliquer du code.",
    description: "Cursor est un éditeur de code conçu autour de l’IA, édité par la société Anysphere, filiale de SpaceX depuis 2026. Destiné principalement aux développeurs, il propose des complétions automatiques et un agent qui réalise des tâches de programmation à partir d’instructions écrites ; le code produit doit toujours être relu et vérifié. L’offre gratuite est limitée ; les offres payantes permettent un usage plus intensif.",
    uses: [
      "Compléter du code automatiquement",
      "Demander à l’agent de modifier un projet",
      "Comprendre un code existant",
      "Corriger une erreur dans un programme"
    ],
    access: "freemium",
    accessNote: "Offre gratuite aux usages limités ; offres payantes pour un usage plus intensif",
    sources: [
      "https://cursor.com/pricing",
      "https://cursor.com/help/account-and-billing/pricing.md",
      "https://cursor.com/docs/models-and-pricing",
      "https://cursor.com/blog/joining-spacex"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "lovable",
    name: "Lovable",
    publisher: "Lovable",
    website: "https://lovable.dev",
    category: "developpement",
    tagline: "Plateforme qui crée des applications et sites web à partir d’une description écrite en langage courant.",
    description: "Lovable est une plateforme suédoise qui génère des applications web à partir d’instructions rédigées en langage naturel, sans avoir à écrire de code. Les projets peuvent être publiés en ligne et s’appuyer sur un back-end intégré (Lovable Cloud). L’offre gratuite repose sur un nombre limité de crédits quotidiens, et l’application générée doit être testée avant tout usage réel.",
    uses: [
      "Créer un prototype d’application",
      "Générer un site web à partir d’une idée",
      "Publier une application en ligne",
      "Modifier une application par instructions écrites"
    ],
    access: "freemium",
    accessNote: "Offre gratuite avec un nombre limité de crédits quotidiens ; offres payantes pour plus d’usage",
    sources: [
      "https://lovable.dev/pricing",
      "https://lovable.dev/faq/billing/plans",
      "https://lovable.dev/faq/billing/plans/lovable-pricing",
      "https://lovable.dev/blog/simplifying-billing"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "replit",
    name: "Replit",
    publisher: "Replit, Inc.",
    website: "https://replit.com",
    category: "developpement",
    otherCategories: [
      "agents-assistants"
    ],
    tagline: "Plateforme en ligne pour créer, tester et publier des applications avec l’aide d’un agent IA.",
    description: "Replit est un environnement de développement accessible depuis le navigateur, avec un agent IA (Replit Agent) qui construit des applications à partir de demandes écrites. Il s’adresse aux personnes qui veulent créer une application sans installer d’outils sur leur ordinateur. Sur l’offre gratuite, les crédits de l’agent sont limités et l’application publiée est mise hors ligne au bout de 30 jours.",
    uses: [
      "Créer une application à partir d’une description",
      "Programmer depuis le navigateur",
      "Publier une application en ligne",
      "Tester une idée de projet rapidement"
    ],
    access: "freemium",
    accessNote: "Offre gratuite (Starter) aux crédits limités ; offres payantes pour plus d’usage",
    sources: [
      "https://replit.com/pricing",
      "https://docs.replit.com/billing/plans/starter-plan",
      "https://docs.replit.com/billing/deployment-pricing",
      "https://docs.replit.com/help/pricing-and-plans"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "zapier",
    name: "Zapier",
    publisher: "Zapier, Inc.",
    website: "https://zapier.com",
    category: "automatisation",
    otherCategories: [
      "agents-assistants",
      "entreprises"
    ],
    tagline: "Service en ligne qui automatise des tâches en reliant des applications entre elles, avec des fonctions d’IA.",
    description: "Zapier permet de créer des automatisations (« Zaps ») qui déclenchent une action dans une application lorsqu’un événement se produit dans une autre, sans programmer. Il propose aussi un assistant IA (Copilot) pour construire ces automatisations, ainsi que des agents IA. L’offre gratuite est limitée à des Zaps en deux étapes (un déclencheur, une action) et à un volume de tâches mensuel.",
    uses: [
      "Relier un formulaire à un tableur",
      "Envoyer une notification automatiquement",
      "Créer une automatisation en la décrivant",
      "Construire un agent IA simple"
    ],
    access: "freemium",
    accessNote: "Offre gratuite limitée ; essai gratuit des fonctions payantes",
    sources: [
      "https://zapier.com/pricing",
      "https://help.zapier.com/hc/en-us/articles/32337438839565-What-s-included-in-Zapier-s-Free-plan",
      "https://help.zapier.com/hc/en-us/articles/8496197192461-Get-started-with-your-free-Zapier-trial",
      "https://help.zapier.com/hc/en-us/articles/15703650952077-Use-the-power-of-AI-to-generate-Zap-workflows"
    ],
    lastChecked: "2026-10-14",
    featured: true
  },
  {
    slug: "make",
    name: "Make",
    publisher: "Make (groupe Celonis)",
    website: "https://www.make.com",
    category: "automatisation",
    otherCategories: [
      "entreprises"
    ],
    tagline: "Plateforme visuelle pour créer des automatisations entre applications, y compris avec des étapes d’IA.",
    description: "Make (anciennement Integromat), qui appartient au groupe Celonis, permet de concevoir des scénarios d’automatisation dans un éditeur visuel, en reliant des applications avec des routeurs et des filtres. Il s’adresse aux personnes qui veulent automatiser des tâches répétitives sans coder. L’offre gratuite limite le nombre de crédits utilisables chaque mois et le nombre de scénarios actifs.",
    uses: [
      "Automatiser une tâche répétitive",
      "Synchroniser des données entre applications",
      "Ajouter une étape d’IA à un processus",
      "Planifier l’exécution d’un scénario"
    ],
    access: "freemium",
    accessNote: "Offre gratuite sans limite de durée, avec un volume mensuel de crédits limité",
    sources: [
      "https://www.make.com/en/pricing",
      "https://www.make.com/",
      "https://www.make.com/about",
      "https://www.make.com/en/blog/best-ai-automation-tools"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "n8n",
    name: "n8n",
    publisher: "n8n GmbH",
    website: "https://n8n.io",
    category: "automatisation",
    otherCategories: [
      "developpement",
      "agents-assistants"
    ],
    tagline: "Outil d’automatisation de workflows avec fonctions d’IA, utilisable en ligne ou installé sur son serveur.",
    description: "n8n est une plateforme d’automatisation éditée par une société allemande, dont le code source est consultable (licence dite « fair-code »). Elle permet de combiner un éditeur visuel et du code, de connecter de nombreuses applications et de construire des agents IA. Elle vise plutôt un public technique : la version gratuite doit être installée et hébergée soi-même, l’offre cloud étant payante.",
    uses: [
      "Automatiser un processus entre plusieurs outils",
      "Construire un agent IA",
      "Héberger ses automatisations sur son serveur",
      "Ajouter du code personnalisé à un workflow"
    ],
    access: "freemium",
    accessNote: "Version auto-hébergée gratuite (installation technique requise) ; offre cloud payante avec essai gratuit",
    sources: [
      "https://docs.n8n.io/choose-n8n/",
      "https://docs.n8n.io/choose-how-to-use-n8n",
      "https://n8n.io/pricing/startup-plan/",
      "https://github.com/n8n-io/n8n"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "notion-ai",
    name: "Notion AI",
    publisher: "Notion Labs, Inc.",
    website: "https://www.notion.com/product/ai",
    category: "automatisation",
    otherCategories: [
      "texte",
      "agents-assistants",
      "entreprises"
    ],
    tagline: "Fonctions d’IA intégrées à Notion pour rédiger, résumer des réunions et automatiser des tâches.",
    description: "Notion AI regroupe les fonctions d’intelligence artificielle de Notion, un outil de prise de notes et de gestion de projets. Il comprend un agent (Notion Agent), la prise de notes de réunion par IA et des agents personnalisés (Custom Agents) qui s’exécutent selon un planning ou à la suite d’un événement, et dont l’usage est facturé en crédits. Les offres Free et Plus ne donnent qu’un nombre limité de réponses pour essayer ; l’usage complet nécessite une offre Business ou Enterprise.",
    uses: [
      "Résumer une réunion",
      "Rédiger un document dans Notion",
      "Planifier un agent pour une tâche récurrente",
      "Remplir automatiquement une base de données"
    ],
    access: "payant",
    accessNote: "Essai limité dans les offres Free et Plus ; IA complète avec Business et Enterprise ; agents personnalisés facturés en crédits",
    sources: [
      "https://www.notion.com/product/ai",
      "https://www.notion.com/help/complimentary-ai-responses",
      "https://www.notion.com/pricing",
      "https://www.notion.com/help/custom-agents"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    publisher: "Perplexity AI, Inc.",
    website: "https://www.perplexity.ai",
    category: "donnees",
    otherCategories: [
      "texte",
      "agents-assistants"
    ],
    tagline: "Moteur de recherche conversationnel qui répond aux questions en citant ses sources web.",
    description: "Perplexity est un outil de recherche qui rédige des réponses à partir de sources trouvées sur le web, avec des liens pour les consulter. Il permet aussi d’analyser des fichiers envoyés par l’utilisateur. La version gratuite limite les recherches avancées (Pro Search) et l’envoi de fichiers ; comme pour tout outil d’IA, les réponses doivent être vérifiées auprès des sources citées.",
    uses: [
      "Rechercher une information avec ses sources",
      "Comparer plusieurs points de vue sur un sujet",
      "Analyser un document envoyé",
      "Préparer une synthèse sur un sujet"
    ],
    access: "freemium",
    accessNote: "Version gratuite limitée ; offres payantes pour un usage avancé",
    sources: [
      "https://www.perplexity.ai/hub/pricing",
      "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you",
      "https://www.perplexity.ai/help-center/fr/articles/11187416-quel-abonnement-perplexity-vous-convient-le-mieux",
      "https://www.perplexity.ai/help-center/en/articles/10352895-how-does-perplexity-work"
    ],
    lastChecked: "2026-10-14",
    featured: true
  },
  {
    slug: "gemini-notebook",
    name: "Gemini Notebook (ex-NotebookLM)",
    publisher: "Google",
    website: "https://notebooklm.google.com",
    category: "donnees",
    otherCategories: [
      "texte",
      "formation",
      "audio"
    ],
    tagline: "Outil de Google (ex-NotebookLM) qui analyse vos documents : réponses, fiches, quiz, résumés audio.",
    description: "Gemini Notebook, appelé NotebookLM jusqu’en juillet 2026, est un outil de recherche de Google qui travaille à partir des sources ajoutées par l’utilisateur, comme des documents. Il répond aux questions sur ces sources et peut générer des rapports, des fiches de révision, des quiz, des cartes mentales ou des résumés audio. Il est utilisable gratuitement avec un compte Google, avec des limites d’usage plus élevées dans les abonnements Google AI payants.",
    uses: [
      "Poser des questions sur ses documents",
      "Générer des fiches de révision ou un quiz",
      "Écouter un résumé audio de ses sources",
      "Créer une carte mentale d’un sujet"
    ],
    access: "freemium",
    accessNote: "Utilisable gratuitement avec un compte Google ; limites plus élevées avec les abonnements Google AI",
    sources: [
      "https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/",
      "https://notebook.google/",
      "https://notebook.google.com/",
      "https://notebooklm.google/?hl=en-US"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "julius-ai",
    name: "Julius AI",
    publisher: "Caesar Labs, Inc.",
    website: "https://julius.ai",
    category: "donnees",
    otherCategories: [
      "entreprises"
    ],
    tagline: "Assistant d’analyse de données qui crée graphiques et analyses à partir de questions en langage courant.",
    description: "Julius AI est un assistant d’analyse de données qui travaille sur des fichiers (par exemple CSV ou Excel) à partir de demandes formulées en langage naturel, sans écrire de SQL ni de Python. Il produit des graphiques, des analyses statistiques et des rapports. L’offre gratuite fonctionne avec un nombre limité de crédits quotidiens, et les résultats doivent être vérifiés avant d’être utilisés.",
    uses: [
      "Analyser un fichier Excel ou CSV",
      "Créer un graphique à partir de données",
      "Poser une question sur un jeu de données",
      "Rédiger un rapport d’analyse"
    ],
    access: "freemium",
    accessNote: "Offre gratuite avec des crédits quotidiens limités ; offres payantes pour plus d’usage",
    sources: [
      "https://julius.ai/pricing",
      "https://julius.ai/docs/billing/credits-overview",
      "https://julius.ai/tos"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "elements-of-ai",
    name: "Elements of AI",
    publisher: "Université d’Helsinki et MinnaLearn",
    website: "https://www.elementsofai.com",
    category: "formation",
    tagline: "Cours en ligne gratuit, disponible en français, pour comprendre les bases de l’intelligence artificielle.",
    description: "Elements of AI est une série de cours en ligne gratuits créés par l’Université d’Helsinki et MinnaLearn. La première partie, une introduction à l’IA, s’adresse à tous et ne demande pas de connaissances en mathématiques ni en programmation ; la seconde, consacrée à la construction de méthodes d’IA, recommande des bases en Python. Le cours se suit à son rythme et porte sur les principes de l’IA plutôt que sur l’usage d’outils précis.",
    uses: [
      "Comprendre ce qu’est l’intelligence artificielle",
      "Découvrir l’apprentissage automatique",
      "Réfléchir aux enjeux de société de l’IA",
      "Se former à son rythme et en français"
    ],
    access: "gratuit",
    accessNote: "Cours gratuit ; inscription gratuite pour accéder à l’ensemble du cours",
    sources: [
      "https://www.elementsofai.com/",
      "https://course.elementsofai.com/fr/2/",
      "https://course.elementsofai.com/fr-be/",
      "https://course.elementsofai.com/fr/1/3/"
    ],
    lastChecked: "2026-10-14",
    featured: true
  },
  {
    slug: "ai-for-everyone",
    name: "AI for Everyone (DeepLearning.AI)",
    publisher: "DeepLearning.AI",
    website: "https://www.deeplearning.ai/courses/ai-for-everyone",
    category: "formation",
    otherCategories: [
      "entreprises"
    ],
    tagline: "Cours d’initiation non technique à l’IA, conçu par Andrew Ng, aussi proposé en français sur Coursera.",
    description: "AI for Everyone est un cours de DeepLearning.AI animé par Andrew Ng, destiné aux personnes sans formation technique. Il présente le vocabulaire de l’IA, ce qu’elle peut ou ne peut pas faire et la façon de repérer des usages dans une organisation ; une version en français (« L’IA pour tous ») est proposée sur Coursera. Conçu en 2019, il est antérieur à la vague des outils d’IA générative, traitée dans un autre cours de DeepLearning.AI (« Generative AI for Everyone »).",
    uses: [
      "Comprendre le vocabulaire de l’IA",
      "Identifier ce que l’IA peut faire ou non",
      "Repérer des usages de l’IA au travail",
      "Préparer un projet d’IA en entreprise"
    ],
    access: "freemium",
    accessNote: "Vidéos accessibles gratuitement ; certificat payant",
    sources: [
      "https://www.deeplearning.ai/courses/ai-for-everyone",
      "https://www.coursera.org/learn/ai-for-everyone",
      "https://www.coursera.org/learn/ai-for-everyone-fr",
      "https://coursera.org/fr-FR/learn/ai-for-everyone"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "class-code-iai",
    name: "Class’Code IAI – L’Intelligence Artificielle… avec intelligence !",
    publisher: "Inria et Class’Code",
    website: "https://www.fun-mooc.fr/en/courses/lintelligence-artificielle-avec-intelligence/",
    category: "formation",
    tagline: "MOOC citoyen gratuit, en français, pour découvrir et comprendre l’intelligence artificielle.",
    description: "« L’Intelligence Artificielle… avec intelligence ! » (Class’Code IAI) est un MOOC coproduit par Inria et l’association Class’Code, hébergé sur la plateforme FUN MOOC. Ouvert à tous, sans connaissances préalables en informatique, il aborde l’apprentissage automatique, l’apprentissage profond, le rôle des données et la place de l’humain face à l’IA. Lancé en 2020, il se concentre sur la compréhension des notions plutôt que sur l’usage d’outils récents.",
    uses: [
      "Découvrir les notions de base de l’IA",
      "Comprendre le rôle des données",
      "Prendre du recul sur les usages de l’IA",
      "Obtenir un open badge de suivi"
    ],
    access: "gratuit",
    accessNote: "Formation gratuite ; open badge délivré sur demande",
    sources: [
      "https://www.fun-mooc.fr/en/courses/lintelligence-artificielle-avec-intelligence/",
      "https://www.fun-mooc.fr/en/categories/subjects/digital-and-technology/artificial-intelligence-ai/",
      "https://www.fun-mooc.fr/en/categories/thematiques/numerique-et-technologie/intelligence-artificielle-ia/",
      "https://www.fun-mooc.fr/en/actualites/5-raisons-de-suivre-le-mooc-lintelligence-artificielle-avec-inte/"
    ],
    lastChecked: "2026-10-14"
  },
  {
    slug: "google-ai-essentials",
    name: "Google AI Essentials",
    publisher: "Google",
    website: "https://grow.google/ai-essentials/",
    category: "formation",
    otherCategories: [
      "entreprises"
    ],
    tagline: "Formation de Google pour apprendre à utiliser l’IA générative au travail, de façon responsable.",
    description: "Google AI Essentials est une formation en ligne de Google, suivie à son rythme sur Coursera et destinée aux débutants sans profil technique. Elle aborde les bases de l’IA, l’utilisation d’outils d’IA au quotidien, la rédaction de prompts et l’usage responsable de l’IA, avec un certificat Google à la clé. Conçue en anglais, elle est aussi proposée sur Coursera avec un doublage français réalisé par IA ; l’accès passe par un abonnement après une période d’essai gratuite.",
    uses: [
      "Apprendre à rédiger des prompts",
      "Utiliser l’IA pour gagner du temps au travail",
      "Comprendre les risques liés à l’usage de l’IA",
      "Obtenir un certificat Google"
    ],
    access: "payant",
    accessNote: "Abonnement Coursera après un essai gratuit ; aide financière possible via Coursera",
    sources: [
      "https://grow.google/ai-essentials/",
      "https://www.coursera.org/specializations/ai-essentials-google",
      "https://www.coursera.org/fr-FR/specializations/ai-essentials-google",
      "https://grow.google/certificates/en_ca/ai-essentials/"
    ],
    lastChecked: "2026-10-14"
  }
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
