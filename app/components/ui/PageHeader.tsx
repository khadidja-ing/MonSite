import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Container } from "./Container";

/** En-tête des pages intérieures : fil d'Ariane, titre et introduction. */
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  breadcrumbs?: Crumb[];
  /** Contenu supplémentaire sous l'introduction (ex. barre de recherche). */
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-ink-100 bg-ink-50/60">
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-60" />
      <Container className="relative py-12 sm:py-16">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold tracking-wide text-brand-700 uppercase">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && (
          <div className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">{description}</div>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}
