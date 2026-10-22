import type { ReactNode } from "react";

/**
 * Repère bien visible d'une information encore manquante, par exemple
 * « [À compléter : nom de l'hébergeur] ». À remplacer avant la mise en ligne.
 */
export function ToComplete({ children, label = "À compléter" }: { children: ReactNode; label?: string }) {
  return (
    <mark className="rounded-md bg-amber-100 px-1.5 py-0.5 font-medium text-amber-950 ring-1 ring-amber-300 ring-inset box-decoration-clone">
      [{label}&nbsp;: {children}]
    </mark>
  );
}

/**
 * Affiche une valeur des réglages du site (app/config/site.ts) ou, si elle
 * est vide, un repère « À compléter ».
 */
export function SiteValue({ value, missing }: { value: string; missing: ReactNode }) {
  const text = value.trim();
  return text ? <span className="whitespace-pre-line">{text}</span> : <ToComplete>{missing}</ToComplete>;
}

/**
 * Repère affiché tant qu'aucun moyen de contact ne fonctionne : ni e-mail
 * public, ni formulaire relié à un service d'envoi (voir app/config/site.ts).
 */
export function MissingContact() {
  return <ToComplete>moyen de contact de l'éditeur — e-mail, ou formulaire une fois l'envoi activé</ToComplete>;
}
