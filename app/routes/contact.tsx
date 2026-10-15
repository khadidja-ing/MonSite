import { ContactAside } from "~/components/contact/ContactAside";
import { ContactForm } from "~/components/contact/ContactForm";
import { Container } from "~/components/ui/Container";
import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/contact";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Nous contacter",
    description:
      "Une question sur un outil d'IA, une erreur à signaler, une suggestion ou un intérêt pour un service ? Écrivez-nous via le formulaire de contact.",
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Nous contacter"
        breadcrumbs={[{ label: "Contact" }]}
        description="Une question sur un outil, une erreur repérée sur une fiche, une idée d'outil à ajouter ou un intérêt pour l'un des services ? Écrivez-nous en quelques mots, simplement, sans jargon."
      />

      <section aria-label="Formulaire de contact" className="py-12 sm:py-16">
        <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-12">
          <ContactForm />
          <ContactAside />
        </Container>
      </section>
    </>
  );
}
