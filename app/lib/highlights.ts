/**
 * Petites fonctions utilisées par la page d'accueil et la page « À propos »
 * pour choisir quoi mettre en avant. Elles ne dépendent pas de l'affichage et
 * sont vérifiées par des tests automatiques (highlights.test.ts).
 */
import type { Service, ServiceStatus, Tool } from "~/data/types";

/**
 * Outils mis en avant (champ `featured`), dans l'ordre du catalogue.
 * Si aucun outil n'est mis en avant, on prend simplement les premiers.
 */
export function getFeaturedTools(tools: Tool[], max = 6): Tool[] {
  const featured = tools.filter((tool) => tool.featured);
  return (featured.length > 0 ? featured : tools).slice(0, Math.max(0, max));
}

/**
 * Date de vérification la plus récente parmi les fiches (AAAA-MM-JJ),
 * ou `undefined` s'il n'y a aucune fiche datée.
 */
export function getLatestCheckDate(tools: Tool[]): string | undefined {
  let latest: string | undefined;
  for (const tool of tools) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tool.lastChecked)) continue;
    if (!latest || tool.lastChecked > latest) latest = tool.lastChecked;
  }
  return latest;
}

/** Vrai si toutes les fiches citent au moins une source (et qu'il y a au moins une fiche). */
export function areAllToolsSourced(tools: Tool[]): boolean {
  return tools.length > 0 && tools.every((tool) => tool.sources.length > 0);
}

const serviceStatusLabels: Record<ServiceStatus, string> = {
  disponible: "Disponible",
  "en-preparation": "En préparation",
};

/** "en-preparation" → « En préparation », "disponible" → « Disponible ». */
export function getServiceStatusLabel(status: ServiceStatus): string {
  return serviceStatusLabels[status] ?? status;
}

/** Vrai si aucune prestation n'est encore disponible. */
export function areAllServicesInPreparation(services: Service[]): boolean {
  return services.every((service) => service.status !== "disponible");
}

/** Lien de recherche dans le catalogue : catalogSearchLink("résumer") → "/outils?q=r%C3%A9sumer". */
export function catalogSearchLink(query: string): string {
  const params = new URLSearchParams({ q: query.trim() });
  return `/outils?${params.toString()}`;
}
