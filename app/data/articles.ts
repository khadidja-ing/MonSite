import type { Article } from "./types";

/**
 * Articles de la rubrique « Ressources et guides ».
 *
 * Chaque article est découpé en « blocs » :
 * - { type: "paragraph", text: "…" } : un paragraphe ;
 * - { type: "heading", text: "…" } : un intertitre (il apparaît aussi dans le sommaire) ;
 * - { type: "list", items: ["…", "…"] } : une liste à puces ;
 * - { type: "tip", title: "…", text: "…" } : un encadré (astuce, exemple, à retenir…).
 *
 * Pour ajouter un article : copier un bloc { … } ci-dessous, changer le
 * « slug » (l'adresse de la page : /ressources/<slug>), le titre, le résumé
 * (120 à 160 caractères, il sert aussi de description pour Google) et le
 * contenu. Les tests automatiques (articles.test.ts) vérifient que rien ne
 * manque. L'ordre de la liste sert d'ordre éditorial : le premier guide de
 * niveau débutant est proposé comme point de départ.
 *
 * Règle éditoriale : contenus intemporels et vérifiables. Les articles de
 * type « nouveautes » doivent toujours citer leurs sources et leur date.
 */
export const articles: Article[] = [
  {
    slug: "intelligence-artificielle-expliquee-simplement",
    title: "L'intelligence artificielle expliquée simplement",
    type: "guide",
    summary:
      "Ce qu'est l'IA, comment fonctionne l'IA générative, ce qu'elle sait faire, ses limites et pourquoi elle peut se tromper : les bases, sans jargon.",
    level: "debutant",
    categories: ["formation", "texte"],
    publishedOn: "2026-10-14",
    readingMinutes: 5,
    body: [
      {
        type: "paragraph",
        text: "On entend parler d'intelligence artificielle partout : au travail, dans les médias, dans les applications de notre téléphone. Pourtant, on explique rarement simplement de quoi il s'agit. Ce guide pose les bases, sans formule mathématique ni vocabulaire technique, pour que vous puissiez utiliser ces outils en sachant ce qu'ils font… et ce qu'ils ne font pas.",
      },
      { type: "heading", text: "Qu'est-ce que l'intelligence artificielle ?" },
      {
        type: "paragraph",
        text: "L'intelligence artificielle, souvent abrégée « IA », désigne des programmes informatiques capables de réaliser des tâches qui semblaient réservées aux humains : reconnaître un visage sur une photo, comprendre une phrase, traduire un texte, recommander un film ou répondre à une question.",
      },
      {
        type: "paragraph",
        text: "La plupart des IA actuelles ne suivent pas une liste de règles écrites à la main. Elles « apprennent » à partir de très grandes quantités d'exemples : on parle d'apprentissage automatique (en anglais, machine learning). En analysant ces exemples, le programme repère des régularités, puis s'en sert pour traiter de nouveaux cas qu'il n'a jamais vus.",
      },
      {
        type: "paragraph",
        text: "Vous utilisez probablement déjà l'IA sans y penser : le filtre anti-spam d'une messagerie, la correction automatique d'un clavier de téléphone ou les suggestions de vidéos d'une plateforme reposent souvent sur ce type de technique.",
      },
      { type: "heading", text: "L'IA générative, celle dont tout le monde parle" },
      {
        type: "paragraph",
        text: "Depuis quelques années, une famille d'IA attire particulièrement l'attention : l'IA générative. Comme son nom l'indique, elle génère, c'est-à-dire qu'elle produit un contenu nouveau (un texte, une image, une voix, une musique ou une courte vidéo) à partir d'une demande formulée en langage courant.",
      },
      {
        type: "paragraph",
        text: "Cette demande s'appelle une consigne, ou « prompt » en anglais. Vous écrivez par exemple « Propose-moi trois idées de titre pour l'affiche d'un vide-grenier », et l'outil vous répond en quelques secondes.",
      },
      {
        type: "paragraph",
        text: "Pour le texte, ces outils s'appuient sur ce qu'on appelle des « grands modèles de langage ». Pour simplifier, un modèle de langage a été entraîné sur une immense quantité de textes et a appris à prédire la suite la plus probable d'une phrase, morceau de mot après morceau de mot. C'est ce mécanisme, répété très rapidement, qui donne l'impression d'une conversation naturelle.",
      },
      {
        type: "tip",
        title: "À retenir",
        text: "Un assistant d'IA ne « comprend » pas le monde comme vous et moi. Il produit le texte qui lui paraît le plus plausible au regard de ce qu'il a appris et de votre demande. C'est très puissant, mais ce n'est pas la même chose que savoir ou vérifier.",
      },
      { type: "heading", text: "Ce que l'IA sait bien faire" },
      {
        type: "paragraph",
        text: "Utilisée à bon escient, l'IA générative est une aide précieuse pour de nombreuses tâches du quotidien :",
      },
      {
        type: "list",
        items: [
          "Rédiger un premier jet : un e-mail, une lettre, une annonce, le plan d'une présentation.",
          "Résumer un long texte ou en extraire les points importants.",
          "Reformuler un message, corriger l'orthographe ou adapter le ton.",
          "Traduire un texte ou expliquer une notion avec des mots plus simples.",
          "Trouver des idées : des noms, des titres, des activités, des angles pour aborder un sujet.",
          "Créer une image, une illustration ou une voix off à partir d'une description.",
        ],
      },
      {
        type: "paragraph",
        text: "Dans tous ces cas, l'IA vous fait gagner du temps sur la partie la plus fastidieuse. Votre rôle reste essentiel : préciser ce que vous voulez, relire, corriger et décider.",
      },
      { type: "heading", text: "Ce que l'IA ne sait pas faire (ou fait mal)" },
      { type: "paragraph", text: "Il est tout aussi important de connaître ses limites :" },
      {
        type: "list",
        items: [
          "Elle ne garantit pas l'exactitude de ce qu'elle affirme : une réponse bien écrite n'est pas forcément une réponse juste.",
          "Ses connaissances peuvent être datées : selon l'outil, elle n'a pas toujours accès aux informations récentes ni à internet.",
          "Elle ne connaît de votre situation que ce que vous lui en dites, et ne remplace pas l'avis d'un médecin, d'un avocat ou d'un expert-comptable.",
          "Elle peut reproduire des stéréotypes présents dans les textes et les images à partir desquels elle a appris.",
          "Elle n'a ni opinion, ni intention, ni conscience, même si sa façon de s'exprimer peut le laisser croire.",
        ],
      },
      { type: "heading", text: "Pourquoi l'IA peut se tromper : les « hallucinations »" },
      {
        type: "paragraph",
        text: "On appelle « hallucination » une réponse fausse ou inventée, présentée avec autant d'assurance qu'une information exacte. L'outil peut par exemple citer un livre qui n'existe pas, attribuer une phrase à une personne qui ne l'a jamais prononcée ou donner une date erronée.",
      },
      {
        type: "paragraph",
        text: "Ce n'est pas un mensonge volontaire. Souvenez-vous du fonctionnement décrit plus haut : le modèle produit ce qui lui semble le plus plausible. Quand il ne dispose pas de la bonne information, il ne répond pas toujours « je ne sais pas » ; il peut combler le vide avec quelque chose qui ressemble à une bonne réponse, sans en être une.",
      },
      {
        type: "paragraph",
        text: "Ces erreurs sont plus probables sur les sujets pointus, les chiffres, les dates, les citations, les références précises et l'actualité récente. Les outils progressent, mais aucun n'en est totalement à l'abri.",
      },
      {
        type: "tip",
        title: "Le bon réflexe",
        text: "Considérez chaque réponse comme le travail d'un assistant rapide mais parfois distrait : utile pour avancer, à vérifier avant de s'en servir. Pour toute information importante, recoupez avec une source fiable, comme un site officiel ou un document de référence.",
      },
      { type: "heading", text: "Par où commencer ?" },
      {
        type: "paragraph",
        text: "Le plus simple est d'essayer sur une tâche concrète et sans enjeu : demander le résumé d'un article que vous avez déjà lu, reformuler un message ou chercher des idées de menus pour la semaine. Vous verrez rapidement ce que l'outil fait bien, et sur quels points il faut rester vigilant.",
      },
      {
        type: "paragraph",
        text: "Pour aller plus loin, deux autres ressources de cette rubrique vous seront utiles : l'une explique comment rédiger une consigne claire, l'autre présente les bons réflexes pour utiliser l'IA de façon responsable. Et lorsque vous serez prêt à choisir un outil, le catalogue les présente classés par usage.",
      },
    ],
  },
  {
    slug: "rediger-une-bonne-consigne-prompt",
    title: "Rédiger une bonne consigne (prompt) en 5 étapes",
    type: "tutoriel",
    summary:
      "Une méthode simple en cinq étapes pour obtenir de meilleures réponses d'un assistant d'IA : contexte, tâche, format, exemple et ajustements.",
    level: "debutant",
    categories: ["texte", "images"],
    publishedOn: "2026-10-14",
    readingMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "Une « consigne », ou « prompt » en anglais, c'est la demande que vous écrivez à un outil d'IA. La qualité de la réponse dépend en grande partie de la qualité de cette demande. Bonne nouvelle : nul besoin d'être expert. Il suffit d'apprendre à donner à l'outil les informations qu'un collègue vous demanderait avant de se mettre au travail.",
      },
      { type: "paragraph", text: "Partons d'un exemple volontairement vague :" },
      {
        type: "tip",
        title: "Consigne de départ",
        text: "« Écris un message pour annoncer une fermeture. »",
      },
      {
        type: "paragraph",
        text: "L'outil va répondre, mais au hasard : la fermeture de quoi, pour qui, quand, sur quel ton ? Voyons comment améliorer cette demande en cinq étapes.",
      },
      { type: "heading", text: "Étape 1 : donner un rôle et du contexte" },
      {
        type: "paragraph",
        text: "Commencez par expliquer la situation : qui vous êtes, à qui s'adresse le résultat et pourquoi vous en avez besoin. Vous pouvez aussi attribuer un rôle à l'outil, par exemple « Tu es un assistant qui aide les commerçants à communiquer avec leur clientèle ». Ce cadrage oriente le vocabulaire, le niveau de détail et le ton de la réponse.",
      },
      {
        type: "tip",
        title: "Exemple de contexte",
        text: "« Je tiens une petite boulangerie de quartier. Je dois prévenir mes clients habitués que la boutique sera fermée pour congés pendant deux semaines. »",
      },
      { type: "heading", text: "Étape 2 : décrire précisément la tâche" },
      {
        type: "paragraph",
        text: "Dites clairement ce que vous attendez, avec un verbe d'action : rédiger, résumer, traduire, comparer, lister, corriger… Précisez aussi les éléments à ne pas oublier. Une tâche floue donne une réponse floue.",
      },
      {
        type: "tip",
        title: "Exemple de tâche",
        text: "« Rédige un court message à afficher en vitrine et à publier sur notre page de réseau social. Indique les dates de fermeture et de réouverture, et remercie les clients pour leur fidélité. »",
      },
      { type: "heading", text: "Étape 3 : préciser le format attendu" },
      {
        type: "paragraph",
        text: "Le format, c'est la forme que doit prendre la réponse. Sans indication, l'outil choisit pour vous, et le résultat est souvent trop long ou trop général. Quelques précisions suffisent :",
      },
      {
        type: "list",
        items: [
          "La longueur : « en cinq lignes maximum », « environ 100 mots ».",
          "La structure : un paragraphe, une liste à puces, un tableau, un plan.",
          "Le ton : chaleureux, professionnel, humoristique, neutre.",
          "Le public : des enfants, des clients, des collègues, des débutants.",
          "La langue, si elle diffère de celle de votre demande.",
        ],
      },
      { type: "heading", text: "Étape 4 : montrer un exemple" },
      {
        type: "paragraph",
        text: "Si vous avez déjà un texte dont vous aimez le style, copiez-le dans votre consigne en indiquant qu'il sert de modèle. L'outil s'en inspirera pour le ton et la mise en forme. C'est souvent plus efficace qu'une longue description. Pensez simplement à retirer les informations personnelles ou confidentielles avant de coller un texte.",
      },
      {
        type: "tip",
        title: "Exemple",
        text: "« Voici un message que j'avais publié l'an dernier et qui avait plu : [collez ici votre texte]. Inspire-toi de son ton, simple et chaleureux. »",
      },
      { type: "heading", text: "Étape 5 : ajuster la réponse en dialoguant" },
      {
        type: "paragraph",
        text: "La première réponse est rarement parfaite, et c'est normal. L'avantage d'un assistant conversationnel, c'est que vous pouvez poursuivre l'échange pour améliorer le résultat, sans tout réécrire. Par exemple :",
      },
      {
        type: "list",
        items: [
          "« Plus court, s'il te plaît. »",
          "« Remplace le tutoiement par le vouvoiement. »",
          "« Propose-moi trois autres versions de la première phrase. »",
          "« Ajoute une phrase pour rappeler nos horaires habituels. »",
        ],
      },
      {
        type: "paragraph",
        text: "Relisez toujours la version finale : vérifiez les dates, les noms et les informations pratiques, car l'outil peut se tromper ou inventer un détail.",
      },
      { type: "heading", text: "Avant, après : la différence en pratique" },
      {
        type: "paragraph",
        text: "Voici la consigne de départ et sa version améliorée, qui reprend les cinq étapes :",
      },
      {
        type: "tip",
        title: "Avant",
        text: "« Écris un message pour annoncer une fermeture. »",
      },
      {
        type: "tip",
        title: "Après",
        text: "« Je tiens une petite boulangerie de quartier et je dois prévenir mes clients habitués de notre fermeture pour congés. Rédige un message à afficher en vitrine et à publier sur notre page de réseau social. Indique les dates de fermeture et de réouverture (je les compléterai moi-même) et remercie les clients pour leur fidélité. Le message doit tenir en cinq lignes maximum, avec un ton simple et chaleureux. Inspire-toi de ce message de l'an dernier : [texte]. »",
      },
      {
        type: "paragraph",
        text: "La seconde consigne est plus longue, mais elle évite plusieurs allers-retours et donne d'emblée un résultat proche de ce que vous vouliez. Vous n'avez pas besoin d'appliquer les cinq étapes à chaque fois : pour une question simple, une phrase suffit. Plus la tâche est importante, plus il vaut la peine de préciser.",
      },
      { type: "heading", text: "Les erreurs fréquentes à éviter" },
      {
        type: "list",
        items: [
          "Poser plusieurs questions différentes dans un même message : mieux vaut avancer une demande à la fois.",
          "Oublier de préciser le public visé : un texte pour des enfants ne s'écrit pas comme un texte pour des professionnels.",
          "Croire qu'il existe une consigne parfaite : on progresse en essayant, en observant et en ajustant.",
          "Copier-coller la réponse sans la relire.",
        ],
      },
      {
        type: "tip",
        title: "Bon à savoir",
        text: "Cette méthode fonctionne aussi avec les outils de création d'images : décrivez le sujet, le style, les couleurs, le cadrage et l'ambiance souhaités, puis ajustez au fil des essais.",
      },
    ],
  },
  {
    slug: "utiliser-l-ia-de-facon-responsable",
    title: "Utiliser l'IA de façon responsable : les bons réflexes",
    type: "conseil",
    summary:
      "Vérifier les réponses, protéger vos données, connaître les règles d'utilisation et rester transparent : les bons réflexes pour utiliser l'IA sereinement.",
    level: "debutant",
    categories: ["formation", "entreprises"],
    publishedOn: "2026-10-14",
    readingMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "Les outils d'IA sont simples à utiliser : quelques mots suffisent pour obtenir un texte ou une image. Cette simplicité ne doit pas faire oublier quelques précautions. Elles ne demandent aucune compétence technique, seulement de bonnes habitudes, et elles vous éviteront bien des mauvaises surprises.",
      },
      { type: "heading", text: "1. Vérifier ce que l'IA produit" },
      {
        type: "paragraph",
        text: "Un outil d'IA peut se tromper tout en paraissant très sûr de lui : c'est ce qu'on appelle une « hallucination ». Il peut inventer une référence, mal recopier un chiffre ou donner une information dépassée. Avant d'utiliser une réponse, en particulier pour une décision importante, prenez le temps de la vérifier.",
      },
      {
        type: "list",
        items: [
          "Recoupez les faits, les chiffres et les dates avec une source fiable : site officiel, administration, document de référence.",
          "Méfiez-vous des citations et des références précises (livres, articles, textes de loi) : vérifiez qu'elles existent vraiment.",
          "Pour la santé, le droit ou l'argent, considérez la réponse comme une première piste et consultez un professionnel.",
          "Relisez toujours un texte généré avant de l'envoyer ou de le publier : c'est vous qui en restez responsable.",
        ],
      },
      { type: "heading", text: "2. Ne jamais partager de données sensibles" },
      {
        type: "paragraph",
        text: "Ce que vous écrivez dans un outil d'IA est généralement envoyé sur les serveurs de l'éditeur, c'est-à-dire l'entreprise qui le propose. Selon l'outil et vos réglages, ces échanges peuvent être conservés, consultés dans certains cas ou utilisés pour améliorer le service. La règle la plus sûre : n'y écrivez rien que vous ne confieriez pas à un inconnu.",
      },
      { type: "paragraph", text: "Évitez notamment de saisir :" },
      {
        type: "list",
        items: [
          "Vos mots de passe, codes d'accès ou numéros de carte bancaire.",
          "Des informations sur votre santé ou sur celle de vos proches.",
          "Des données personnelles concernant d'autres personnes : nom, adresse, téléphone, situation familiale.",
          "Des documents confidentiels de votre employeur ou de vos clients : contrats, fichiers clients, informations financières.",
        ],
      },
      {
        type: "tip",
        title: "Astuce",
        text: "Si vous voulez de l'aide sur un document, remplacez d'abord les noms et les informations qui permettent d'identifier quelqu'un par des termes génériques, comme « le client », « la société A » ou « [adresse] ». L'outil pourra vous aider tout autant.",
      },
      { type: "heading", text: "3. Régler les paramètres de confidentialité" },
      {
        type: "paragraph",
        text: "De nombreux outils proposent des réglages pour mieux contrôler vos données : désactiver l'historique des conversations, refuser que vos échanges servent à entraîner les futurs modèles ou supprimer vos anciennes discussions. Ces options varient d'un outil à l'autre et évoluent régulièrement.",
      },
      {
        type: "paragraph",
        text: "Prenez quelques minutes, lors de votre première utilisation, pour parcourir les paramètres de votre compte et la politique de confidentialité. Dans un cadre professionnel, renseignez-vous aussi sur les règles de votre organisation : certaines limitent l'usage de ces outils ou fournissent des versions dédiées, avec des engagements plus stricts sur les données.",
      },
      { type: "heading", text: "4. Connaître les droits d'utilisation des contenus" },
      {
        type: "paragraph",
        text: "Pouvez-vous utiliser librement un texte ou une image créés avec l'IA, par exemple pour votre activité professionnelle ? La réponse dépend de l'outil : chaque éditeur fixe ses propres conditions d'utilisation, qui peuvent différer entre l'offre gratuite et les offres payantes. Le cadre juridique sur ce sujet est par ailleurs encore en construction et varie selon les pays.",
      },
      {
        type: "list",
        items: [
          "Lisez les conditions d'utilisation de l'outil avant tout usage commercial.",
          "Évitez de demander des contenus qui copient une œuvre protégée, une marque ou le style reconnaissable d'un artiste.",
          "N'utilisez pas la voix ou l'image d'une personne réelle sans son accord.",
          "En cas de doute pour un projet important, demandez conseil à un professionnel du droit.",
        ],
      },
      { type: "heading", text: "5. Être transparent sur l'usage de l'IA" },
      {
        type: "paragraph",
        text: "Indiquer qu'un contenu a été créé ou assisté par l'IA est une marque de respect envers vos lecteurs, vos clients ou vos collègues. C'est particulièrement important pour les images réalistes, qui peuvent prêter à confusion, et pour les contenus qui engagent votre parole.",
      },
      {
        type: "paragraph",
        text: "À l'école, à l'université ou au travail, renseignez-vous sur les règles en vigueur : de nombreux établissements et employeurs encadrent désormais l'usage de ces outils.",
      },
      { type: "heading", text: "6. Garder un regard critique sur les biais" },
      {
        type: "paragraph",
        text: "Les IA apprennent à partir de textes et d'images produits par des humains. Elles peuvent donc reproduire, voire accentuer, des stéréotypes liés aux métiers, au genre, aux origines ou à l'âge. Par exemple, une image générée pour « un chef d'entreprise » peut représenter toujours le même type de personne.",
      },
      {
        type: "paragraph",
        text: "Restez attentif à ces biais, en particulier lorsque le contenu sera diffusé ou qu'il sert à prendre une décision concernant des personnes, comme un recrutement. Vous pouvez aussi préciser dans votre consigne que vous souhaitez des exemples variés.",
      },
      {
        type: "tip",
        title: "En résumé",
        text: "Vérifiez avant d'utiliser, protégez vos données et celles des autres, respectez les règles de l'outil, dites quand vous utilisez l'IA et gardez votre esprit critique. L'IA reste un outil : la décision et la responsabilité vous appartiennent.",
      },
    ],
  },
  {
    slug: "choisir-un-outil-d-ia-adapte",
    title: "Comment choisir un outil d'IA adapté à son besoin",
    type: "guide",
    summary:
      "Partir de votre besoin, comprendre gratuit, freemium et payant, vérifier l'usage de vos données et tester sur un cas réel : la méthode pour bien choisir.",
    level: "debutant",
    categories: ["texte", "images", "audio", "automatisation"],
    publishedOn: "2026-10-14",
    readingMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "Il existe aujourd'hui un très grand nombre d'outils d'IA, et de nouveaux apparaissent régulièrement. Face à ce choix, il est tentant de tester tout ce dont on entend parler… et de s'y perdre. Voici une méthode simple, en six questions, pour choisir un outil adapté à votre situation plutôt qu'à la mode du moment.",
      },
      { type: "heading", text: "1. Quel est votre besoin, concrètement ?" },
      {
        type: "paragraph",
        text: "Le point de départ n'est pas l'outil, mais la tâche que vous voulez accomplir. Essayez de la formuler en une phrase, avec un verbe d'action : « résumer mes comptes rendus de réunion », « créer des visuels pour mes publications », « transcrire des entretiens enregistrés », « répondre plus vite aux e-mails fréquents ».",
      },
      {
        type: "paragraph",
        text: "Cette phrase vous indique la famille d'outils à explorer : rédaction, images, vidéo, audio, automatisation, analyse de données… C'est justement ainsi qu'est organisé le catalogue de ce site : par usage plutôt que par marque. Un assistant conversationnel généraliste couvre déjà de nombreux besoins liés au texte ; pour des tâches plus spécifiques, un outil spécialisé est souvent plus adapté.",
      },
      {
        type: "tip",
        title: "Astuce",
        text: "Notez aussi la fréquence de la tâche. Un besoin ponctuel justifie rarement un abonnement ; une tâche répétée chaque semaine peut valoir la peine d'y consacrer un peu de temps, voire un budget.",
      },
      { type: "heading", text: "2. Gratuit, freemium ou payant : que choisir ?" },
      { type: "paragraph", text: "Les outils d'IA sont proposés selon trois grands modèles d'accès :" },
      {
        type: "list",
        items: [
          "Gratuit : l'outil est utilisable sans payer. Demandez-vous tout de même comment il est financé et ce qu'il fait de vos données.",
          "Freemium : une version gratuite limitée (nombre de demandes, fonctionnalités, qualité du résultat), complétée par des offres payantes plus complètes. Pratique pour découvrir un outil avant de s'engager.",
          "Payant : un abonnement ou un achat est nécessaire, parfois après une période d'essai.",
        ],
      },
      {
        type: "paragraph",
        text: "Pour débuter, une version gratuite ou freemium suffit généralement pour se faire une idée. Avant de payer, vérifiez ce que l'offre inclut réellement, les conditions de résiliation et la durée d'engagement éventuelle. Les prix et les limites changent souvent : fiez-vous toujours au site officiel de l'éditeur, à la date où vous le consultez.",
      },
      { type: "heading", text: "3. Que deviennent vos données ?" },
      {
        type: "paragraph",
        text: "C'est une question que l'on oublie souvent, alors qu'elle est essentielle, surtout dans un cadre professionnel. Avant d'adopter un outil, cherchez dans sa politique de confidentialité ou sa foire aux questions la réponse à ces points :",
      },
      {
        type: "list",
        items: [
          "Les échanges sont-ils conservés, et pendant combien de temps ?",
          "Servent-ils à entraîner les modèles de l'éditeur, et peut-on le refuser ?",
          "Où les données sont-elles hébergées ?",
          "Existe-t-il une offre pour les professionnels, avec des engagements plus stricts ?",
        ],
      },
      {
        type: "paragraph",
        text: "Si vous ne trouvez pas de réponse claire, considérez-le comme un signal d'alerte et évitez d'y confier des informations sensibles.",
      },
      { type: "heading", text: "4. L'outil fonctionne-t-il bien en français ?" },
      {
        type: "paragraph",
        text: "Beaucoup d'outils sont d'abord conçus pour l'anglais. La plupart comprennent le français, mais la qualité peut varier : tournures maladroites, traductions approximatives, voix de synthèse peu naturelles. L'interface elle-même n'est pas toujours traduite.",
      },
      {
        type: "paragraph",
        text: "Si vous travaillez en français, testez l'outil directement dans votre langue, avec le vocabulaire de votre métier, et vérifiez que le résultat sonne juste.",
      },
      { type: "heading", text: "5. Faites un essai sur un cas réel" },
      {
        type: "paragraph",
        text: "Les démonstrations et les vidéos de présentation montrent les outils sous leur meilleur jour. Le seul vrai test, c'est votre propre besoin. Choisissez une tâche réelle mais sans enjeu, en retirant toute donnée sensible, et essayez-la avec deux ou trois outils. Posez-vous ensuite ces questions :",
      },
      {
        type: "list",
        items: [
          "Le résultat est-il utilisable sans trop de retouches ?",
          "L'outil est-il simple à prendre en main pour vous ?",
          "Combien de temps avez-vous réellement gagné, retouches comprises ?",
          "Les limites de la version gratuite sont-elles gênantes pour votre usage ?",
        ],
      },
      {
        type: "tip",
        title: "Bon à savoir",
        text: "Notez vos impressions au fur et à mesure. Après quelques essais, il devient beaucoup plus facile de comparer les outils de façon objective, plutôt que de vous fier à votre première impression.",
      },
      { type: "heading", text: "6. L'outil s'intègre-t-il à vos habitudes ?" },
      {
        type: "paragraph",
        text: "Un bon outil est un outil que vous utiliserez vraiment. Vérifiez qu'il fonctionne sur les appareils dont vous vous servez (ordinateur, téléphone), qu'il peut se connecter aux logiciels que vous utilisez déjà, comme votre messagerie ou votre suite bureautique, et que vous pourrez facilement récupérer votre travail si vous changez d'outil.",
      },
      { type: "heading", text: "En résumé" },
      {
        type: "list",
        items: [
          "Partez de la tâche à accomplir, pas de l'outil à la mode.",
          "Commencez par une version gratuite ou freemium.",
          "Vérifiez ce que deviennent vos données.",
          "Testez en français, sur un cas réel.",
          "Choisissez l'outil que vous utiliserez vraiment au quotidien.",
        ],
      },
      {
        type: "paragraph",
        text: "Pour passer à la pratique, explorez le catalogue par catégorie : chaque fiche présente simplement l'outil, ses principaux usages et son modèle d'accès, avec la date de la dernière vérification et un lien vers le site officiel pour confirmer les conditions actuelles.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
