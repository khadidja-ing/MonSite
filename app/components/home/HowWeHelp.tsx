import {
  ArrowRight,
  Ban,
  CircleHelp,
  CalendarCheck,
  ExternalLink,
  FileSearch,
  Flag,
  Handshake,
  Link2Off,
  Quote,
  Search,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { AccessBadge } from "~/components/tools/AccessBadge";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { canReceiveMessages } from "~/config/site";

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Search,
    title: "Décrivez votre besoin",
    text: "Partez de ce que vous voulez faire (rédiger, traduire, créer une image…) grâce à la recherche ou aux catégories.",
  },
  {
    icon: FileSearch,
    title: "Comparez des fiches claires",
    text: "Chaque fiche explique en langage simple à quoi sert l'outil, ses principaux usages et son modèle d'accès.",
  },
  {
    icon: ExternalLink,
    title: "Vérifiez sur le site officiel",
    text: "Les offres évoluent vite : chaque fiche renvoie vers le site de l'éditeur pour confirmer les conditions avant de vous lancer.",
  },
  {
    icon: Handshake,
    title: "Faites-vous accompagner si besoin",
    text: canReceiveMessages
      ? "Vous préférez être guidé ? Des prestations d'accompagnement sont en préparation : vous pouvez déjà nous faire part de votre besoin."
      : "Vous préférez être guidé ? Des prestations d'accompagnement sont en préparation : dès que le formulaire de contact sera activé, vous pourrez nous faire part de votre besoin.",
  },
];

/** Section « Comment nous vous aidons à choisir » : étapes et engagements éditoriaux. */
export function HowWeHelp() {
  return (
    <section aria-labelledby="methode-titre" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="methode-titre"
          eyebrow="Notre méthode"
          title="Comment nous vous aidons à choisir"
          description="Pas besoin d'être expert : quatre étapes simples pour passer de l'idée à l'outil adapté."
        />

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <li key={step.title} className="relative flex items-start gap-5 lg:block">
                <div className="flex shrink-0 items-center gap-4 pt-1 lg:pt-0">
                  <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-card ring-1 ring-ink-100">
                    <Icon aria-hidden="true" className="size-5" />
                    <span
                      aria-hidden="true"
                      className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white ring-2 ring-white"
                    >
                      {index + 1}
                    </span>
                  </span>
                  {!isLast && <span aria-hidden="true" className="hidden h-px flex-1 bg-ink-200 lg:block" />}
                </div>
                <div className="min-w-0 lg:mt-5">
                  <h3 className="text-lg font-semibold">
                    <span className="sr-only">Étape {index + 1} : </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{step.text}</p>
                  {isLast && (
                    <Link
                      to="/services"
                      className="mt-3 inline-flex min-h-10 items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline"
                    >
                      Découvrir les services
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <EditorialCommitments />
      </Container>
    </section>
  );
}

const inlineLink =
  "font-semibold text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-700";

const commitments: { icon: LucideIcon; title: string; text: ReactNode }[] = [
  {
    icon: CalendarCheck,
    title: "Des informations vérifiées et datées",
    text: "Chaque fiche indique la date à laquelle ses informations ont été vérifiées pour la dernière fois.",
  },
  {
    icon: Quote,
    title: "Des sources citées",
    text: "Les pages officielles consultées pour rédiger une fiche sont listées sur la fiche elle-même.",
  },
  {
    icon: CircleHelp,
    title: "« À confirmer » plutôt que deviné",
    text: (
      <>
        Si le modèle d'accès d'un outil n'a pas pu être vérifié, il est marqué{" "}
        <AccessBadge access="a-confirmer" /> au lieu d'être supposé.
      </>
    ),
  },
  {
    icon: Ban,
    title: "Aucun faux avis",
    text: "Ni notes, ni avis, ni témoignages inventés : uniquement des informations que vous pouvez vérifier.",
  },
  {
    icon: Link2Off,
    title: "Pas de lien sponsorisé",
    text: "Le site ne contient actuellement aucun lien sponsorisé.",
  },
  {
    icon: Flag,
    title: canReceiveMessages ? "Une erreur ? Signalez-la" : "Une erreur ? Vous pourrez la signaler",
    text: canReceiveMessages ? (
      <>
        Une information vous semble inexacte ou dépassée ?{" "}
        <Link to="/contact?sujet=signaler-erreur" className={inlineLink}>
          Signalez-la-nous
        </Link>{" "}
        pour que nous puissions la vérifier et la corriger.
      </>
    ) : (
      <>
        Une information vous semble inexacte ou dépassée ? Dès que le{" "}
        <Link to="/contact?sujet=signaler-erreur" className={inlineLink}>
          formulaire de contact
        </Link>{" "}
        sera activé, vous pourrez nous la signaler pour que nous puissions la vérifier et la corriger.
      </>
    ),
  },
];

/** Engagements éditoriaux réellement appliqués sur le site. */
function EditorialCommitments() {
  return (
    <div className="mt-16 grid grid-cols-1 gap-10 rounded-3xl bg-ink-50 p-6 ring-1 ring-ink-100 sm:p-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Nos engagements éditoriaux</h3>
        <p className="mt-3 leading-relaxed text-ink-600">
          Un catalogue n'est utile que s'il est fiable. Voici les règles que nous appliquons à chaque
          fiche.
        </p>
        <Link
          to="/a-propos"
          className="mt-4 inline-flex min-h-10 items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline"
        >
          En savoir plus sur notre démarche
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
        {commitments.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent-700 ring-1 ring-ink-100">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-ink-950">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
