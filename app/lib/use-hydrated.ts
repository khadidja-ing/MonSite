import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Indique si la page est « active » dans le navigateur.
 *
 * Les pages sont pré-générées en HTML (pour Google et la vitesse), puis
 * React prend le relais dans le navigateur. Tout ce qui dépend du navigateur
 * (adresse avec filtres, stockage local…) doit attendre ce moment pour que
 * le premier affichage corresponde exactement au HTML pré-généré.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
