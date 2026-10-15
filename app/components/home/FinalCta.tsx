import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";

/** Lien secondaire adapté aux fonds sombres (même gabarit que les boutons « lg »). */
const darkSecondary =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold whitespace-nowrap text-white ring-1 ring-white/25 transition-colors duration-150 ring-inset hover:bg-white/10 focus-visible:outline-white";

/** Rose des vents stylisée, purement décorative (rappel du logo). */
function CompassDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={className}>
      <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="2" strokeDasharray="2 8" />
      <path d="M100 18 116 100h-32z" fill="currentColor" />
      <path d="M100 182 84 100h32z" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="6" fill="currentColor" />
    </svg>
  );
}

/** Bandeau d'appel à l'action en bas de page, sur fond sombre. */
export function FinalCta({
  id = "cta-titre",
  title,
  description,
  primary,
  secondary,
}: {
  id?: string;
  title: string;
  description: ReactNode;
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
}) {
  return (
    <section aria-labelledby={id} className="pb-20 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-14 text-center sm:px-12 sm:py-16">
          <CompassDecoration className="pointer-events-none absolute -top-16 -right-16 size-64 text-white/[0.06] sm:size-80" />
          <CompassDecoration className="pointer-events-none absolute -bottom-20 -left-20 hidden size-56 text-white/[0.04] md:block" />
          <h2 id={id} className="relative mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <div className="relative mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-300">{description}</div>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink to={primary.to} size="lg" variant="inverse" className="focus-visible:outline-white">
              {primary.label}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <Link to={secondary.to} className={darkSecondary}>
              {secondary.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
