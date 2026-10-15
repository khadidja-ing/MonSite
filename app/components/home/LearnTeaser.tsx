import { ArrowRight, BookOpen } from "lucide-react";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";

/** Trois notions de base, expliquées simplement (contenu pédagogique, pas des données). */
const glossary: { term: string; definition: string }[] = [
  {
    term: "Prompt (ou consigne)",
    definition:
      "La demande que vous écrivez à l'outil, en langage courant. Plus elle est précise, plus la réponse a de chances d'être utile.",
  },
  {
    term: "Hallucination",
    definition:
      "Une réponse fausse ou inventée, présentée avec assurance. C'est pourquoi il faut toujours vérifier ce que l'IA produit.",
  },
  {
    term: "Freemium",
    definition: "Une version gratuite limitée, complétée par des offres payantes plus complètes.",
  },
];

/** Encart qui renvoie vers la rubrique « Ressources » (guides pour débutants). */
export function LearnTeaser() {
  return (
    <section aria-labelledby="ressources-titre" className="py-20 sm:py-24">
      <Container>
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink-100 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
              <BookOpen aria-hidden="true" className="size-6" />
            </span>
            <p className="mt-6 text-sm font-semibold tracking-wide text-brand-700 uppercase">Ressources</p>
            <h2 id="ressources-titre" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Débuter avec l'IA : des guides pour comprendre les bases
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              Comment fonctionne un assistant d'IA, comment bien formuler sa demande, quelles limites
              garder en tête : des explications pas à pas, pensées pour les débutants.
            </p>
            <div className="mt-8">
              <ButtonLink to="/ressources" size="lg">
                Découvrir les ressources
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>

          <div className="border-t border-ink-100 bg-ink-50/70 p-6 sm:p-10 lg:border-t-0 lg:border-l lg:p-12">
            <p className="font-display text-lg font-semibold text-ink-950">Trois mots pour bien démarrer</p>
            <dl className="mt-6 space-y-4">
              {glossary.map((entry) => (
                <div key={entry.term} className="rounded-2xl bg-white p-5 ring-1 ring-ink-100">
                  <dt className="font-semibold text-ink-950">{entry.term}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-600">{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
