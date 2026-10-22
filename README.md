# Boussole IA (nom provisoire)

Plateforme web en français pour **découvrir les outils et services d'intelligence artificielle**, comprendre à quoi ils servent et choisir ceux qui correspondent à ses besoins.

> Le nom « Boussole IA » est provisoire. Il se change à un seul endroit : `app/config/site.ts`.

---

## Ce que contient la première version

| Page | Adresse | Contenu |
|---|---|---|
| Accueil | `/` | Recherche, catégories, outils mis en avant, méthode, services, guides |
| Explorer les outils | `/outils` | Catalogue de 40 outils : recherche, filtres (catégorie, modèle d'accès), tri |
| Fiche outil | `/outils/<nom>` | Présentation, usages, modèle d'accès, sources, date de vérification |
| Catégories | `/categories` et `/categories/<nom>` | 11 familles d'outils, expliquées simplement |
| Services | `/services` | 7 prestations, affichées « En préparation » |
| Ressources | `/ressources` | 4 guides pour débutants, classés par type |
| À propos | `/a-propos` | Mission, vision, principes éditoriaux |
| Contact | `/contact` | Formulaire avec validation et protection anti-abus |
| Pages légales | `/mentions-legales`, `/confidentialite`, `/conditions-utilisation` | Modèles **provisoires** à compléter |

Toutes les pages sont générées à l'avance en HTML : le site est rapide, lisible par les moteurs de recherche, et ne nécessite **aucun serveur** (hébergement gratuit possible).

---

## Où modifier le contenu

Le contenu est séparé de la mise en page : pour changer un texte, on modifie un fichier de données, pas les pages.

| Je veux modifier… | Fichier |
|---|---|
| Le nom du site, l'e-mail de contact, les informations légales | `app/config/site.ts` |
| Les outils du catalogue (ajouter, corriger, mettre en avant) | `app/data/tools.ts` |
| Les catégories | `app/data/categories.ts` |
| Les services (et les passer de « en-preparation » à « disponible ») | `app/data/services.ts` |
| Les articles et guides | `app/data/articles.ts` |
| Les couleurs et polices | `app/app.css` |

**Règles pour les fiches outils** (`app/data/tools.ts`) :
- n'indiquez un modèle d'accès (`gratuit`, `freemium`, `payant`) que s'il est vérifié sur le site officiel ; sinon utilisez `"a-confirmer"` ;
- n'indiquez jamais de prix (ils changent trop souvent) ;
- mettez à jour `lastChecked` (date de vérification) et `sources` à chaque contrôle ;
- `featured: true` affiche l'outil sur la page d'accueil.

---

## À compléter avant la mise en ligne

- [ ] Choisir le **nom définitif** (et vérifier qu'il n'est pas déjà utilisé comme marque).
- [ ] Choisir un **hébergeur** et un **nom de domaine**, puis renseigner `VITE_SITE_URL` (voir plus bas).
- [ ] Prévoir **au moins un moyen de contact qui fonctionne** : l'**e-mail de contact** (`contact.email` dans `app/config/site.ts`) **ou** l'adresse d'envoi du formulaire (`VITE_CONTACT_FORM_ENDPOINT`, voir plus bas). Sans l'un des deux, les pages légales n'indiquent aucun moyen de joindre l'éditeur ni d'exercer ses droits sur ses données (elles affichent un repère « À compléter »), et le site invite seulement à préparer son message.
- [ ] Pour activer le formulaire : brancher un **service d'envoi** (ex. Formspree), renseigner `VITE_CONTACT_FORM_ENDPOINT` **et, en même temps**, compléter dans `app/config/site.ts` `contact.formProvider` (nom du service, lieu de traitement des données, lien vers sa politique de confidentialité) et `legal.messageRetention` (durée de conservation des messages) : la politique de confidentialité les affiche. Tant que l'adresse d'envoi est vide, le formulaire indique honnêtement que l'envoi n'est pas activé.
- [ ] Compléter les **informations légales** dans `app/config/site.ts` (éditeur, hébergeur, durée de conservation des journaux de l'hébergeur `legal.hostLogRetention`…) et faire relire les pages légales, idéalement par un professionnel. Quelques repères « À compléter / À confirmer » se trouvent directement dans les pages légales (`app/routes/confidentialite.tsx`, `mentions-legales.tsx`, `conditions-utilisation.tsx`) : base légale, transferts hors de l'Union européenne, droit applicable…
- [ ] Rédiger la **présentation** dans la page À propos (bloc « Contenu à compléter »).
- [ ] Confirmer les **services** réellement proposés.
- [ ] Si le nom change : régénérer l'image de partage `public/og-image.png`.

---

## Réglages (variables de configuration)

Ces valeurs ne sont **pas secrètes** ; elles se renseignent chez l'hébergeur (ou dans un fichier `.env` en local, sur le modèle de `.env.example`).

| Variable | Rôle | Exemple |
|---|---|---|
| `VITE_SITE_URL` | Adresse publique du site (aperçus réseaux sociaux, plan du site) | `https://www.mon-domaine.fr` |
| `VITE_CONTACT_FORM_ENDPOINT` | Adresse d'envoi du formulaire (ex. Formspree) | `https://formspree.io/f/xxxxxxx` |

⚠️ Ne mettez **jamais** de mot de passe ni de clé API secrète dans ce projet : tout ce qui est ici est visible publiquement dans le navigateur.

---

## Commandes (pour les développeurs)

Prérequis : Node.js 20 ou plus récent.

```bash
npm install          # installe les dépendances (une seule fois)
npm run dev          # lance le site en local sur http://localhost:5173
npm test             # lance les tests automatiques
npm run typecheck    # vérifie le code TypeScript
npm run build        # construit le site final dans build/client
npm run preview      # affiche le site construit
```

Le dossier à publier chez l'hébergeur est **`build/client`** (commande de construction : `npm run build`).

---

## Organisation technique

```
app/
├── config/site.ts      Réglages généraux
├── data/               Contenu : outils, catégories, services, articles
├── components/         Briques réutilisables (cartes, boutons, en-tête…)
├── routes/             Une page = un fichier
├── lib/                Logique (recherche, filtres, formulaire…) et ses tests
├── app.css             Charte graphique
├── root.tsx            Structure commune à toutes les pages
└── routes.ts           Liste des pages et de leurs adresses
public/                 Fichiers publiés tels quels (icône, image de partage…)
scripts/postbuild.mjs   Crée la page 404 et le plan du site après la construction
```

Technologies : React Router (mode « framework », pages pré-générées), React, TypeScript, Vite, Tailwind CSS, icônes Lucide, tests Vitest.
