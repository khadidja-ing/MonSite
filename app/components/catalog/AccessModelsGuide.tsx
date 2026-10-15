import { Lightbulb } from "lucide-react";
import { accessModels } from "~/lib/catalog";
import { accessExplanations } from "~/lib/catalog-ui";
import { AccessBadge } from "../tools/AccessBadge";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { Notice } from "../ui/Notice";
import { SectionHeading } from "../ui/SectionHeading";

/**
 * Bloc d'information sous le catalogue : signification des modèles d'accès
 * et rappel que les informations doivent être confirmées sur le site officiel.
 */
export function AccessModelsGuide() {
  return (
    <section aria-labelledby="modeles-acces" className="border-t border-ink-100 bg-ink-50/60">
      <Container className="py-16 sm:py-20">
        <SectionHeading
          id="modeles-acces"
          eyebrow="Bon à savoir"
          title="Comprendre les modèles d'accès"
          description="Chaque fiche indique comment l'outil est proposé. Voici ce que signifient ces étiquettes."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accessModels.map((model) => (
            <li
              key={model.value}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100"
            >
              <h3 className="text-base">
                <AccessBadge access={model.value} />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{accessExplanations[model.value]}</p>
            </li>
          ))}
        </ul>

        <Notice className="mt-8" title="Des informations datées, à confirmer sur le site officiel">
          Chaque fiche indique la date à laquelle ses informations ont été vérifiées. Les offres et les
          prix évoluent souvent : confirmez-les toujours sur le site officiel de l'outil avant de vous
          inscrire ou de payer.
        </Notice>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
              <Lightbulb aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="font-display font-semibold text-ink-950">Un outil utile manque au catalogue ?</p>
              <p className="mt-1 text-sm text-ink-600">
                Vous pouvez nous le proposer via le formulaire de contact.
              </p>
            </div>
          </div>
          <ButtonLink to="/contact?sujet=suggerer-outil" variant="secondary" className="shrink-0">
            Suggérer un outil
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
