/// <reference types="vite/client" />

/** Variables de configuration lues au moment de la construction du site. */
interface ImportMetaEnv {
  /** Adresse publique du site, ex. https://www.mon-domaine.fr */
  readonly VITE_SITE_URL?: string;
  /** Adresse d'envoi du formulaire de contact (ex. Formspree). */
  readonly VITE_CONTACT_FORM_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
