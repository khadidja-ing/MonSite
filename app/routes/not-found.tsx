import { NotFoundContent } from "~/components/layout/NotFoundContent";
import { pageMeta } from "~/lib/meta";

export function meta() {
  return pageMeta({
    title: "Page introuvable",
    description: "La page demandée n'existe pas ou a été déplacée.",
    path: "/404",
    noIndex: true,
  });
}

/** Toute adresse inconnue affiche la page « introuvable ». */
export default function NotFound() {
  return <NotFoundContent />;
}
