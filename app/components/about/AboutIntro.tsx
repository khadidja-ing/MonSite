import { Layers, MessageCircleQuestion, RefreshCw, Target, Telescope, type LucideIcon } from "lucide-react";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";

const obstacles: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Layers,
    title: "Une offre foisonnante",
    text: "De nouveaux outils apparaissent sans cesse, souvent avec des promesses semblables. Difficile de savoir lequel essayer en premier.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Un vocabulaire technique",
    text: "Prompt, modèle, agent, freemium… Le jargon peut décourager avant même d'avoir commencé.",
  },
  {
    icon: RefreshCw,
    title: "Des offres qui changent",
    text: "Fonctionnalités, limites de la version gratuite, tarifs : les conditions évoluent souvent, et les informations trouvées en ligne sont vite dépassées.",
  },
];

/** « Pourquoi cette plateforme existe » : le constat de départ. */
export function WhySection() {
  return (
    <section aria-labelledby="pourquoi-titre" className="border-y border-ink-100 bg-ink-50/60 py-20 sm:py-24">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="pourquoi-titre"
            eyebrow="Pourquoi cette plateforme"
            title="L'IA est partout. S'y retrouver, beaucoup moins."
            description="L'intelligence artificielle s'invite au travail, dans les études comme dans la vie de tous les jours. Pourtant, quand on débute, il est difficile de savoir par où commencer."
          />
          <div className="mt-8 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100">
            <p className="font-display text-lg font-semibold text-brand-950">Notre réponse</p>
            <p className="mt-2 leading-relaxed text-brand-950/80">
              Un catalogue classé par usage plutôt que par marque, des explications sans jargon, et des
              informations datées et sourcées pour savoir à quoi vous fier.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-4">
          {obstacles.map((obstacle) => {
            const Icon = obstacle.icon;
            return (
              <li
                key={obstacle.title}
                className="flex gap-5 rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700 ring-1 ring-ink-100 ring-inset">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{obstacle.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-600">{obstacle.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/** Mission et vision de la plateforme. */
export function MissionVision() {
  const items: { icon: LucideIcon; label: string; title: string; text: string }[] = [
    {
      icon: Target,
      label: "Notre mission",
      title: "Rendre l'IA accessible et compréhensible",
      text: "Expliquer, avec des mots simples, à quoi sert chaque outil, dans quels cas il peut vous être utile et comment y accéder. Pour que chacun, même sans connaissances techniques, puisse choisir en connaissance de cause.",
    },
    {
      icon: Telescope,
      label: "Notre vision",
      title: "Une plateforme de confiance, qui grandit avec vous",
      text: "Devenir un repère fiable pour découvrir l'IA, enrichi au fil du temps : de nouvelles catégories, de nouveaux outils vérifiés, des guides pour progresser et, à terme, des services pour passer à l'action.",
    },
  ];

  return (
    <section aria-labelledby="mission-titre" className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="mission-titre"
          eyebrow="Ce qui nous guide"
          title="Notre mission et notre vision"
          align="center"
        />
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="rounded-3xl bg-white p-8 shadow-card ring-1 ring-ink-100 sm:p-10">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{item.label}</p>
                </div>
                <h3 className="mt-6 text-2xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink-600">{item.text}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
