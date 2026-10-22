import { CalendarClock } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "~/components/ui/Container";
import { Notice } from "~/components/ui/Notice";
import { PageHeader } from "~/components/ui/PageHeader";
import { siteConfig } from "~/config/site";
import { formatDate } from "~/lib/format";

export interface LegalSection {
  /** Ancre de la section (lettres minuscules et tirets), ex. "hebergeur". */
  id: string;
  title: string;
  content: ReactNode;
}

/**
 * Mise en page commune des documents légaux : en-tête, avertissement de
 * contenu provisoire, date de mise à jour, sommaire et sections numérotées.
 */
export function LegalPage({
  title,
  intro,
  sections,
  showToc = true,
}: {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  showToc?: boolean;
}) {
  const { lastUpdated, isProvisional } = siteConfig.legal;
  const hasToc = showToc && sections.length > 1;

  return (
    <>
      <PageHeader
        eyebrow="Informations légales"
        title={title}
        breadcrumbs={[{ label: title }]}
        description={intro}
      >
        <div className="max-w-3xl space-y-4">
          {isProvisional && (
            <Notice tone="warning" title="Contenu provisoire" className="shadow-card">
              Ce document doit être complété et vérifié (idéalement par un professionnel du droit) avant
              la mise en ligne du site. Les passages surlignés en jaune signalent les informations
              encore manquantes.
            </Notice>
          )}
          <p className="flex items-center gap-2 text-sm text-ink-600">
            <CalendarClock aria-hidden="true" className="size-4 shrink-0 text-ink-400" />
            <span>
              Dernière mise à jour&nbsp;: <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
            </span>
          </p>
        </div>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <div
          className={
            hasToc
              ? "lg:grid lg:grid-cols-[15rem_minmax(0,48rem)] lg:gap-12 xl:grid-cols-[16rem_minmax(0,48rem)] xl:gap-16"
              : "max-w-3xl"
          }
        >
          {hasToc && (
            <div className="mb-10 lg:mb-0">
              <nav
                aria-labelledby="sommaire-titre"
                className="rounded-2xl bg-ink-50/70 p-4 ring-1 ring-ink-100 lg:sticky lg:top-24"
              >
                <p id="sommaire-titre" className="px-2 text-sm font-semibold text-ink-950">
                  Sommaire
                </p>
                <ol className="mt-2 space-y-0.5 text-sm">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex min-h-10 items-center gap-2.5 rounded-lg px-2 py-1.5 text-ink-700 transition-colors hover:bg-white hover:text-brand-700"
                      >
                        <span aria-hidden="true" className="w-5 shrink-0 text-right text-xs font-semibold text-ink-500 tabular-nums">
                          {index + 1}.
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}

          <div className="min-w-0 space-y-12">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-titre`}
                className="border-t border-ink-100 pt-10 first:border-0 first:pt-0"
              >
                <h2 id={`${section.id}-titre`} className="flex gap-3 text-2xl font-bold tracking-tight">
                  <span aria-hidden="true" className="text-brand-600 tabular-nums">
                    {index + 1}.
                  </span>
                  <span>{section.title}</span>
                </h2>
                <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-700">{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
