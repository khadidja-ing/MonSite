import { ArrowRight, Search } from "lucide-react";
import type { FormEvent } from "react";
import { Form, Link, useNavigate } from "react-router";
import { siteConfig } from "~/config/site";
import { buttonClasses, ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { catalogSearchLink } from "~/lib/highlights";
import { HeroPreview } from "./HeroPreview";

/**
 * Idées de recherche proposées sous le champ.
 * Ce sont de vraies recherches dans le catalogue ou de vraies catégories.
 */
const suggestions: { label: string; to: string }[] = [
  { label: "Traduction", to: catalogSearchLink("traduction") },
  { label: "Résumer un document", to: catalogSearchLink("résumer") },
  { label: "Transcription", to: catalogSearchLink("transcription") },
  { label: "Créer des images", to: "/categories/images" },
  { label: "Automatiser", to: "/categories/automatisation" },
];

/** Grand en-tête de la page d'accueil : titre, recherche et appels à l'action. */
export function HomeHero() {
  const navigate = useNavigate();

  // Recherche vide : on ouvre simplement le catalogue complet (adresse plus propre que « /outils?q= »).
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const query = new FormData(event.currentTarget).get("q");
    if (typeof query === "string" && query.trim() === "") {
      event.preventDefault();
      navigate("/outils");
    }
  }

  return (
    <section
      aria-labelledby="accueil-titre"
      className="relative overflow-hidden border-b border-ink-100 bg-linear-to-b from-brand-50/70 via-white to-white"
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-24">
        <div className="animate-fade-in">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-ink-700 shadow-card ring-1 ring-ink-100">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent-500" />
            Pour débuter avec l'IA, sans jargon
          </p>

          <h1
            id="accueil-titre"
            className="mt-6 text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl xl:text-6xl"
          >
            Trouvez l'outil d'IA qu'il vous faut,{" "}
            <span className="text-brand-600">expliqué simplement</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
            Écrire, traduire, créer des visuels, automatiser une tâche… Dites-nous ce que vous voulez
            faire : {siteConfig.name} vous présente des outils d'intelligence artificielle classés par
            usage, avec des fiches claires, vérifiées et datées.
          </p>

          <Form method="get" action="/outils" role="search" onSubmit={handleSubmit} className="mt-8 max-w-xl">
            <label htmlFor="accueil-recherche" className="text-sm font-semibold text-ink-900">
              Que voulez-vous faire ?
            </label>
            <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-card-hover ring-1 ring-ink-200 transition-shadow focus-within:ring-2 focus-within:ring-brand-500 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ink-400"
                />
                <input
                  id="accueil-recherche"
                  type="search"
                  name="q"
                  maxLength={100}
                  autoComplete="off"
                  enterKeyHint="search"
                  placeholder="Ex. : traduire un document"
                  className="h-12 w-full rounded-xl bg-transparent pr-3 pl-11 text-base text-ink-950 placeholder:text-ink-500 focus:outline-none"
                />
              </div>
              <button type="submit" className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
                Rechercher
              </button>
            </div>
          </Form>

          <div className="mt-4 flex max-w-xl flex-wrap items-center gap-2">
            <p className="mr-1 text-sm text-ink-500">Idées :</p>
            <ul role="list" className="contents">
              {suggestions.map((suggestion) => (
                <li key={suggestion.label}>
                  <Link
                    to={suggestion.to}
                    className="inline-flex min-h-10 items-center rounded-full bg-white px-3.5 text-sm font-medium text-ink-700 ring-1 ring-ink-200 transition-colors ring-inset hover:text-brand-700 hover:ring-brand-300"
                  >
                    {suggestion.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/outils" size="lg">
              Explorer les outils
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/services" size="lg" variant="secondary">
              Être accompagné
            </ButtonLink>
          </div>
        </div>

        <HeroPreview />
      </Container>
    </section>
  );
}
