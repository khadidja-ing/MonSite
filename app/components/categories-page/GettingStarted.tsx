import { ArrowRight, Search } from "lucide-react";
import type { ReactNode } from "react";
import { useId } from "react";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { getCategory } from "~/data/categories";

const textLink =
  "inline-flex min-h-10 items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline";

function ArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={textLink}>
      {children}
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  );
}

/** Petit formulaire de recherche qui ouvre le catalogue avec les résultats. */
function CatalogSearchForm() {
  const inputId = useId();
  return (
    <Form method="get" action="/outils" role="search" className="mt-4">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-800">
        Rechercher dans le catalogue
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-400"
          />
          <input
            id={inputId}
            type="search"
            name="q"
            maxLength={100}
            autoComplete="off"
            placeholder="Ex. : résumer un document"
            className="h-11 w-full rounded-xl bg-white pr-3 pl-10 text-base text-ink-900 shadow-sm ring-1 ring-ink-200 ring-inset placeholder:text-ink-500 hover:ring-ink-300 sm:text-sm"
          />
        </div>
        <Button type="submit">Rechercher</Button>
      </div>
    </Form>
  );
}

/**
 * Bloc « Par où commencer ? » de la page des catégories : trois conseils
 * simples pour un débutant, chacun menant à une page existante.
 */
export function GettingStarted({ id = "par-ou-commencer" }: { id?: string }) {
  const texte = getCategory("texte");
  const formation = getCategory("formation");

  const steps: { title: string; content: ReactNode }[] = [
    {
      title: "Commencez par un assistant conversationnel",
      content: (
        <>
          <p>
            C'est l'outil le plus polyvalent pour débuter : vous lui écrivez votre demande comme à une
            personne, et il vous aide à rédiger, résumer, reformuler ou trouver des idées.
            {texte && <> Ces assistants sont regroupés dans la catégorie « {texte.name} ».</>}
          </p>
          {texte && (
            <div className="mt-2">
              <ArrowLink to={`/categories/${texte.slug}`}>Voir la catégorie {texte.shortName}</ArrowLink>
            </div>
          )}
        </>
      ),
    },
    {
      title: "Explorez ensuite selon votre besoin",
      content: (
        <>
          <p>
            Une image à créer, une réunion à transcrire, une tâche à automatiser ? Choisissez la
            catégorie qui correspond à ce que vous voulez faire, ou décrivez votre besoin en quelques
            mots.
          </p>
          <CatalogSearchForm />
        </>
      ),
    },
    {
      title: "Prenez les bons réflexes",
      content: (
        <>
          <p>
            Relire les réponses, protéger vos données personnelles, bien formuler vos demandes :
            quelques bases suffisent pour utiliser l'IA sereinement.
          </p>
          <div className="mt-2 flex flex-wrap gap-x-6">
            <ArrowLink to="/ressources">Lire les ressources</ArrowLink>
            {formation && (
              <ArrowLink to={`/categories/${formation.slug}`}>
                Voir la catégorie {formation.shortName}
              </ArrowLink>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <section id={id} aria-labelledby={`${id}-titre`} className="pb-20 sm:pb-24">
      <Container>
        <div className="grid gap-10 rounded-3xl bg-ink-50 p-5 ring-1 ring-ink-100 sm:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <SectionHeading
            id={`${id}-titre`}
            eyebrow="Vous débutez ?"
            title="Par où commencer ?"
            description="Inutile de tout tester : trois étapes suffisent pour trouver vos premiers outils et les utiliser en confiance."
            className="lg:sticky lg:top-24 lg:self-start"
          />

          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100 sm:p-6"
              >
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold">
                    <span className="sr-only">Étape {index + 1} : </span>
                    {step.title}
                  </h3>
                </div>
                <div className="mt-3 leading-relaxed text-ink-600 sm:pl-13">{step.content}</div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
