import { ContactAside } from "~/components/contact/ContactAside";
import { ContactForm } from "~/components/contact/ContactForm";
import { Container } from "~/components/ui/Container";
import { PageHeader } from "~/components/ui/PageHeader";
import { canReceiveMessages, hasContactEmail, isContactFormActive } from "~/config/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/contact";

// Tant qu'aucun moyen de contact ne fonctionne, ces textes ne promettent pas
// qu'un message peut nous parvenir : ils invitent à préparer son message.
const metaDescription = isContactFormActive
  ? "Une question sur un outil d'IA, une erreur à signaler, une suggestion ou un intérêt pour un service ? Écrivez-nous via le formulaire de contact."
  : hasContactEmail
    ? "Une question sur un outil d'IA, une erreur à signaler, une suggestion ou un intérêt pour un service ? Écrivez-nous par e-mail."
    : "Une question sur un outil d'IA, une erreur à signaler ou un intérêt pour un service ? Le formulaire de contact sera bientôt activé : préparez-y déjà votre message.";

const headerDescription = canReceiveMessages
  ? "Une question sur un outil, une erreur repérée sur une fiche, une idée d'outil à ajouter ou un intérêt pour l'un des services ? Écrivez-nous en quelques mots, simplement, sans jargon."
  : "Une question sur un outil, une erreur repérée sur une fiche, une idée d'outil à ajouter ou un intérêt pour l'un des services ? Le formulaire de contact sera bientôt activé. En attendant, vous pouvez y préparer votre message en quelques mots, simplement, sans jargon.";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Nous contacter",
    description: metaDescription,
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Nous contacter"
        breadcrumbs={[{ label: "Contact" }]}
        description={headerDescription}
      />

      <div className="py-12 sm:py-16">
        <Container className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-12">
          <ContactForm />
          <ContactAside />
        </Container>
      </div>
    </>
  );
}
