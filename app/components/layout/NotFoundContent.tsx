import { Compass } from "lucide-react";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";

/** Contenu de la page « introuvable » (erreur 404). */
export function NotFoundContent({
  title = "Cette page est introuvable",
  description = "L'adresse est peut-être incorrecte, ou la page a été déplacée.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Compass aria-hidden="true" className="size-7" />
      </span>
      <p className="mt-6 text-sm font-semibold text-brand-700">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-lg text-ink-600">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to="/">Retour à l'accueil</ButtonLink>
        <ButtonLink to="/outils" variant="secondary">
          Explorer les outils
        </ButtonLink>
      </div>
    </Container>
  );
}
