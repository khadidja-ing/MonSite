import { FileText, LifeBuoy, MessagesSquare, Wrench, type LucideIcon } from "lucide-react";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";

/**
 * Démarche prévue pour un accompagnement. Formulée comme une intention :
 * aucune promesse de prix, de délai ou de résultat.
 */
const steps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MessagesSquare,
    title: "Un premier échange",
    text: "Pour comprendre votre activité, votre besoin et votre point de départ, et vérifier ensemble si l'IA peut vraiment vous être utile.",
  },
  {
    icon: FileText,
    title: "Une proposition adaptée",
    text: "Une proposition claire, qui décrit ce qui pourrait être mis en place et les outils envisagés. Vous restez libre d'y donner suite ou non.",
  },
  {
    icon: Wrench,
    title: "La réalisation",
    text: "La mise en place se fait étape par étape, en vous associant aux choix importants et en documentant ce qui est fait.",
  },
  {
    icon: LifeBuoy,
    title: "Suivi et autonomie",
    text: "L'objectif est que vous soyez autonome : explications, documentation et conseils pour utiliser et faire évoluer la solution par vous-même.",
  },
];

/** Section « Comment se déroulera un accompagnement ». */
export function ProcessSteps({ id = "deroulement" }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titre`}
      className="border-y border-ink-100 bg-ink-50/60 py-20 sm:py-24"
    >
      <Container>
        <SectionHeading
          id={`${id}-titre`}
          eyebrow="Démarche"
          title="Comment se déroulera un accompagnement"
          description="Voici la démarche envisagée. Elle sera ajustée à chaque situation : tous les accompagnements ne comportent pas forcément chacune de ces étapes."
        />

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative flex flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-3xl font-bold text-ink-300 tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  <span className="sr-only">Étape {index + 1} : </span>
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-600">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
