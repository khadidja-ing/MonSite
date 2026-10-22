import {
  Ban,
  CalendarCheck,
  CircleHelp,
  Flag,
  Link2Off,
  ListChecks,
  Quote,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { AccessBadge } from "~/components/tools/AccessBadge";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { canReceiveMessages } from "~/config/site";
import { accessModels } from "~/lib/catalog";

const inlineLink =
  "font-semibold text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-700";

const principles: { icon: LucideIcon; title: string; text: ReactNode }[] = [
  {
    icon: ListChecks,
    title: "Comment les outils sont sélectionnés",
    text: "Nous retenons des outils qui répondent à un usage concret, qui disposent d'un site officiel et dont les informations essentielles (à quoi ils servent, comment y accéder) peuvent être vérifiées à partir de sources publiques. Être présent dans le catalogue ne signifie pas être adapté à tous les besoins : les fiches sont là pour vous aider à comparer.",
  },
  {
    icon: CalendarCheck,
    title: "Une date de vérification sur chaque fiche",
    text: "Chaque fiche indique la date à laquelle ses informations ont été vérifiées pour la dernière fois. Elles sont exactes à cette date, mais peuvent avoir évolué depuis : les éditeurs modifient régulièrement leurs offres.",
  },
  {
    icon: Quote,
    title: "Des sources citées",
    text: "Les pages consultées pour rédiger une fiche (site officiel, page des offres, documentation…) sont listées sur la fiche, pour que vous puissiez tout vérifier par vous-même.",
  },
  {
    icon: CircleHelp,
    title: "« À confirmer » plutôt qu'une approximation",
    text: (
      <>
        Quand le modèle d'accès d'un outil n'a pas pu être vérifié avec certitude, il est marqué{" "}
        <AccessBadge access="a-confirmer" /> au lieu d'être deviné. Pour les tarifs exacts, référez-vous
        toujours au site officiel de l'éditeur.
      </>
    ),
  },
  {
    icon: Ban,
    title: "Ni faux avis, ni chiffres inventés",
    text: "Vous ne trouverez ici ni notes, ni avis d'utilisateurs, ni témoignages, ni statistiques inventés. Seules des informations vérifiables sont publiées.",
  },
  {
    icon: Link2Off,
    title: "Liens sponsorisés",
    text: "Le site ne contient actuellement aucun lien sponsorisé. Si cela devait changer, ces liens seraient clairement signalés comme tels.",
  },
  {
    icon: Flag,
    title: "Des corrections bienvenues",
    text: canReceiveMessages ? (
      <>
        Une erreur, une information dépassée ?{" "}
        <Link to="/contact?sujet=signaler-erreur" className={inlineLink}>
          Signalez-la via le formulaire de contact
        </Link> : elle sera vérifiée, puis corrigée si nécessaire.
      </>
    ) : (
      <>
        Une erreur, une information dépassée ? Dès que le{" "}
        <Link to="/contact?sujet=signaler-erreur" className={inlineLink}>
          formulaire de contact
        </Link>{" "}
        sera activé, vous pourrez nous la signaler : elle sera alors vérifiée, puis corrigée si
        nécessaire.
      </>
    ),
  },
];

/** Principes éditoriaux détaillés et légende des modèles d'accès. */
export function EditorialPrinciples() {
  return (
    <section aria-labelledby="principes-titre" className="py-20 sm:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading
            id="principes-titre"
            eyebrow="Notre démarche"
            title="Nos principes éditoriaux"
            description="Ces règles s'appliquent à chaque fiche du catalogue. Elles servent un seul objectif : vous donner des informations utiles, sans jamais vous induire en erreur."
          />

          <div className="mt-8 rounded-2xl bg-ink-50 p-6 ring-1 ring-ink-100">
            <h3 className="text-lg font-semibold">Comprendre les modèles d'accès</h3>
            <p className="mt-1 text-sm text-ink-600">Chaque fiche affiche l'une de ces quatre étiquettes.</p>
            <dl className="mt-5 space-y-4">
              {accessModels.map((model) => (
                <div key={model.value} className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <dt className="shrink-0 sm:w-28">
                    <AccessBadge access={model.value} />
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-700">{model.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <ol className="divide-y divide-ink-100 rounded-3xl bg-white px-5 shadow-card ring-1 ring-ink-100 sm:px-8">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <li key={principle.title} className="flex flex-col gap-4 py-7 sm:flex-row sm:gap-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{principle.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{principle.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
