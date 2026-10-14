/**
 * Réglages généraux du site.
 *
 * C'est le fichier à modifier en priorité : nom de la plateforme, adresse du
 * site, e-mail de contact, informations légales… Les pages lisent ces
 * valeurs, vous n'avez donc pas à les changer ailleurs.
 */

/**
 * Adresse publique du site (ex. "https://www.mon-domaine.fr"), sans « / » final.
 * Laissée vide tant que le nom de domaine n'est pas choisi : les balises qui
 * exigent une adresse complète (aperçus réseaux sociaux, plan du site) sont
 * alors simplement omises.
 */
const siteUrl = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");

/**
 * Adresse d'envoi du formulaire de contact (fournie par un service comme
 * Formspree). Ce n'est pas une clé secrète : elle peut figurer côté navigateur.
 * Tant qu'elle est vide, le formulaire indique honnêtement que l'envoi en
 * ligne n'est pas encore activé.
 */
const contactFormEndpoint = import.meta.env.VITE_CONTACT_FORM_ENDPOINT ?? "";

export const siteConfig = {
  /** Nom provisoire : à remplacer par le nom définitif. */
  name: "Boussole IA",
  isNameProvisional: true,
  tagline: "Trouvez l'outil d'IA adapté à votre besoin",
  description:
    "Une plateforme pour découvrir les outils et services d'intelligence artificielle, comprendre à quoi ils servent et choisir les solutions adaptées à vos besoins personnels ou professionnels.",
  url: siteUrl,
  locale: "fr_FR",
  language: "fr",

  contact: {
    /** E-mail public de contact. Vide tant qu'il n'est pas confirmé. */
    email: "",
    formEndpoint: contactFormEndpoint,
  },

  /**
   * Informations sur l'éditeur du site (mentions légales).
   * Valeurs provisoires : à compléter avant la mise en ligne.
   */
  legal: {
    isProvisional: true,
    publisherName: "",
    legalStatus: "",
    address: "",
    registrationNumber: "",
    publicationDirector: "",
    hostName: "",
    hostAddress: "",
    lastUpdated: "2026-10-14",
  },
} as const;

export interface NavItem {
  label: string;
  to: string;
}

/** Liens du menu principal. */
export const mainNav: NavItem[] = [
  { label: "Explorer les outils", to: "/outils" },
  { label: "Catégories", to: "/categories" },
  { label: "Services", to: "/services" },
  { label: "Ressources", to: "/ressources" },
  { label: "À propos", to: "/a-propos" },
];

/** Liens légaux du pied de page. */
export const legalNav: NavItem[] = [
  { label: "Mentions légales", to: "/mentions-legales" },
  { label: "Politique de confidentialité", to: "/confidentialite" },
  { label: "Conditions d'utilisation", to: "/conditions-utilisation" },
];
