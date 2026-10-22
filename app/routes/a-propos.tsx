import { MissionVision, WhySection } from "~/components/about/AboutIntro";
import { EditorialPrinciples } from "~/components/about/EditorialPrinciples";
import { SiteOverview } from "~/components/about/SiteOverview";
import { FinalCta } from "~/components/home/FinalCta";
import { Container } from "~/components/ui/Container";
import { Notice } from "~/components/ui/Notice";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { canReceiveMessages, siteConfig } from "~/config/site";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/a-propos";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "À propos",
    description:
      "Notre mission : rendre l'IA accessible et compréhensible. Découvrez pourquoi cette plateforme existe et les principes éditoriaux appliqués à chaque fiche.",
    path: "/a-propos",
  });
}

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="Vous aider à y voir clair dans l'intelligence artificielle"
        description={`${siteConfig.name} aide les débutants comme les professionnels à découvrir les outils d'intelligence artificielle, à comprendre à quoi ils servent et à choisir ceux qui répondent vraiment à leurs besoins.`}
        breadcrumbs={[{ label: "À propos" }]}
      />

      <MissionVision />

      <WhySection />

      <EditorialPrinciples />

      <SiteOverview />

      {/* Présentation du créateur ou de la créatrice : à rédiger par le propriétaire du site. */}
      <section aria-labelledby="equipe-titre" className="py-20 sm:py-24">
        <Container>
          <div className="max-w-3xl">
            <SectionHeading
              id="equipe-titre"
              eyebrow="Le projet"
              title={`Qui est derrière ${siteConfig.name} ?`}
            />
            <Notice tone="warning" title="Contenu à compléter" className="mt-8">
              La présentation de la personne à l'origine de la plateforme sera ajoutée ici : qui porte
              ce projet, pourquoi, et comment il est mené. Cette section reste volontairement vide tant
              que ce texte n'a pas été rédigé et validé.
            </Notice>
          </div>
        </Container>
      </section>

      <FinalCta
        id="contact-titre"
        title="Une question, une suggestion ?"
        description={
          canReceiveMessages
            ? "Un outil à proposer, une erreur à signaler, une question sur la plateforme ? Écrivez-nous."
            : "Un outil à proposer, une erreur à signaler, une question sur la plateforme ? Dès que le formulaire de contact sera activé, vous pourrez nous écrire."
        }
        primary={{
          label: canReceiveMessages ? "Nous contacter" : "Voir comment nous contacter",
          to: "/contact",
        }}
        secondary={{
          label: canReceiveMessages ? "Suggérer un outil" : "Préparer ma suggestion",
          to: "/contact?sujet=suggerer-outil",
        }}
      />
    </>
  );
}
