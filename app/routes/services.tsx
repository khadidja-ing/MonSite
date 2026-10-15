import { FinalCta } from "~/components/home/FinalCta";
import { ProcessSteps } from "~/components/services/ProcessSteps";
import { ServiceCard } from "~/components/services/ServiceCard";
import { ServicesFaq } from "~/components/services/ServicesFaq";
import { ServicesNav } from "~/components/services/ServicesNav";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { EmptyState } from "~/components/ui/EmptyState";
import { Notice } from "~/components/ui/Notice";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { siteConfig } from "~/config/site";
import { services } from "~/data/services";
import { pageMeta } from "~/lib/meta";
import { countServicesByStatus } from "~/lib/services-page";
import type { Route } from "./+types/services";

const statusCounts = countServicesByStatus(services);
const inPreparation = statusCounts["en-preparation"];
const allInPreparation = services.length > 0 && inPreparation === services.length;

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Services professionnels en intelligence artificielle",
    description:
      inPreparation > 0
        ? "Conseil, automatisation, chatbots, formation, création de sites : découvrez les services d'accompagnement en IA en préparation et manifestez votre intérêt."
        : "Conseil, automatisation, chatbots, formation, création de sites : découvrez nos services d'accompagnement en IA et échangez avec nous sur votre besoin.",
    path: "/services",
  });
}

function PreparationNotice() {
  if (inPreparation === 0) return null;

  return allInPreparation ? (
    <Notice title="Ces services sont en cours de préparation" className="max-w-3xl">
      Ils ne sont pas encore proposés et aucune date d'ouverture n'est fixée pour l'instant. Si l'un
      d'eux vous intéresse, vous pouvez déjà manifester votre intérêt via le formulaire de contact :
      cela ne vous engage à rien.
    </Notice>
  ) : (
    <Notice title="Certains services sont encore en préparation" className="max-w-3xl">
      Ils sont signalés par l'étiquette « En préparation » : ils ne sont pas encore proposés et aucune
      date d'ouverture n'est fixée. Vous pouvez déjà manifester votre intérêt, sans engagement.
    </Notice>
  );
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Services professionnels"
        breadcrumbs={[{ label: "Services" }]}
        description={`Au-delà du catalogue, ${siteConfig.name} prépare des services pour aider les particuliers, les indépendants et les entreprises à passer à l'action : choisir les bons outils, automatiser des tâches, se former ou mener un projet d'intelligence artificielle.`}
      >
        <PreparationNotice />
      </PageHeader>

      <section aria-labelledby="liste-services-titre" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="liste-services-titre"
            title={allInPreparation ? "Les services en préparation" : "Nos services"}
            description="Pour chacun : ce qu'il recouvre, ce que vous pouvez en attendre et à qui il s'adresse."
          />

          {services.length > 0 ? (
            <div className="mt-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[16rem_minmax(0,1fr)]">
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <ServicesNav
                    services={services}
                    extraLinks={[
                      { label: "Déroulement d'un accompagnement", href: "#deroulement" },
                      { label: "Questions fréquentes", href: "#questions" },
                    ]}
                  />
                </div>
              </div>

              <ul className="space-y-6">
                {services.map((service) => (
                  <li key={service.slug}>
                    <ServiceCard service={service} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="Aucun service n'est présenté pour l'instant"
                description="Vous pouvez néanmoins nous écrire pour nous parler de votre besoin."
                action={<ButtonLink to="/contact">Nous contacter</ButtonLink>}
              />
            </div>
          )}
        </Container>
      </section>

      <ProcessSteps id="deroulement" />

      <ServicesFaq id="questions" hasServicesInPreparation={inPreparation > 0} />

      <FinalCta
        id="contact-services-titre"
        title="Un besoin, un projet, une question ?"
        description={
          inPreparation > 0
            ? "Décrivez votre situation en quelques mots. Même si les services sont encore en préparation, votre message permet de mieux comprendre vos attentes."
            : "Décrivez votre situation en quelques mots pour échanger sur votre besoin."
        }
        primary={{ label: "Nous contacter", to: "/contact" }}
        secondary={{ label: "Explorer les outils", to: "/outils" }}
      />
    </>
  );
}
