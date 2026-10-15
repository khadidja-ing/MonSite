/**
 * Petites fonctions utilisées par la page « Services » (/services) : lien de
 * contact, libellé du bouton selon le statut, décompte des statuts.
 *
 * Elles ne dépendent pas de l'affichage et sont vérifiées par des tests
 * automatiques (services-page.test.ts).
 */
import type { Service, ServiceStatus } from "~/data/types";

/** Lien vers le formulaire de contact, prérempli avec le service : "/contact?service=<slug>". */
export function serviceContactLink(slug: string): string {
  return `/contact?service=${encodeURIComponent(slug)}`;
}

/**
 * Libellé du bouton de contact d'un service.
 * Tant qu'un service est en préparation, on invite seulement à manifester son intérêt.
 */
export function serviceCtaLabel(status: ServiceStatus): string {
  return status === "disponible" ? "Demander un échange" : "Manifester mon intérêt";
}

/** Nombre de services par statut. */
export function countServicesByStatus(services: Service[]): Record<ServiceStatus, number> {
  const counts: Record<ServiceStatus, number> = { disponible: 0, "en-preparation": 0 };
  for (const service of services) {
    counts[service.status] += 1;
  }
  return counts;
}
