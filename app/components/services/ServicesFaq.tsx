import { ArrowRight, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";

const inlineLink =
  "font-semibold text-brand-700 underline decoration-brand-200 underline-offset-2 hover:decoration-brand-700";

interface FaqItem {
  question: string;
  answer: ReactNode;
}

function buildItems(hasServicesInPreparation: boolean): FaqItem[] {
  const items: FaqItem[] = [
    {
      question: "Faut-il des connaissances techniques ?",
      answer: (
        <p>
          Non. Ces services sont pensés pour des personnes qui débutent avec l'intelligence
          artificielle. Le vocabulaire technique vous sera expliqué simplement, et chaque choix vous
          sera présenté de façon compréhensible avant d'être mis en œuvre.
        </p>
      ),
    },
    {
      question: "Quels sont les tarifs ?",
      answer: (
        <p>
          Les tarifs ne sont pas encore définis. Ils seront précisés selon votre besoin et communiqués
          clairement avant tout engagement de votre part. Prendre contact ou manifester votre intérêt
          ne vous engage à rien.
        </p>
      ),
    },
    {
      question: "Mes données sont-elles protégées ?",
      answer: (
        <>
          <p>
            La protection de vos données est un principe de base. Seules les informations utiles à
            votre demande vous sont demandées, et elles servent à vous répondre. Lors d'un
            accompagnement, la confidentialité est prise en compte dans le choix des outils : où les
            données sont-elles stockées ? Sont-elles réutilisées par l'éditeur de l'outil ?
          </p>
          <p className="mt-3">
            Par prudence, évitez de transmettre des informations sensibles dès votre premier message.
            Pour en savoir plus, consultez la{" "}
            <Link to="/confidentialite" className={inlineLink}>
              politique de confidentialité
            </Link>
            .
          </p>
        </>
      ),
    },
  ];

  if (hasServicesInPreparation) {
    items.push({
      question: "Comment être informé de l'ouverture ?",
      answer: (
        <p>
          Utilisez le bouton « Manifester mon intérêt » du service qui vous intéresse, ou écrivez-nous
          via le{" "}
          <Link to="/contact" className={inlineLink}>
            formulaire de contact
          </Link>{" "}
          en précisant ce que vous attendez. Votre message permettra de vous recontacter au sujet de ce
          service. Aucune date d'ouverture n'est annoncée pour l'instant.
        </p>
      ),
    });
  }

  items.push({
    question: "Puis-je utiliser le site sans faire appel à un service ?",
    answer: (
      <p>
        Oui. Le{" "}
        <Link to="/outils" className={inlineLink}>
          catalogue d'outils
        </Link>
        , les{" "}
        <Link to="/categories" className={inlineLink}>
          catégories
        </Link>{" "}
        et les{" "}
        <Link to="/ressources" className={inlineLink}>
          ressources
        </Link>{" "}
        sont accessibles librement, sans inscription. Les services s'adressent à celles et ceux qui
        préfèrent être accompagnés.
      </p>
    ),
  });

  return items;
}

/** Questions fréquentes sur les services (éléments dépliables, utilisables au clavier). */
export function ServicesFaq({
  id = "questions",
  hasServicesInPreparation,
}: {
  id?: string;
  hasServicesInPreparation: boolean;
}) {
  const items = buildItems(hasServicesInPreparation);

  return (
    <section id={id} aria-labelledby={`${id}-titre`} className="py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <SectionHeading
            id={`${id}-titre`}
            eyebrow="Questions fréquentes"
            title="Vos questions sur les services"
            description="Des réponses simples aux questions que l'on se pose avant de se faire accompagner."
          />
          <Link
            to="/contact"
            className="mt-6 inline-flex min-h-10 items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline"
          >
            Une autre question ? Écrivez-nous
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="divide-y divide-ink-100 self-start rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
          {items.map((item) => (
            <details key={item.question} className="group px-5 sm:px-6">
              <summary className="-mx-2 flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-2 py-4 font-display font-semibold text-ink-950 transition-colors hover:text-brand-700 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="pb-5 leading-relaxed text-ink-600">{item.answer}</div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
