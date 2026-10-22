import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/Badge";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { canReceiveMessages } from "~/config/site";
import type { Service } from "~/data/types";
import { areAllServicesInPreparation, getServiceStatusLabel } from "~/lib/highlights";
import { getIcon } from "~/lib/icons";

/** Aperçu de quelques prestations, avec leur statut réel (lu dans les données). */
export function ServicesPreview({ services, max = 4 }: { services: Service[]; max?: number }) {
  if (services.length === 0) return null;
  const shown = services.slice(0, max);
  const allInPreparation = areAllServicesInPreparation(services);

  return (
    <section aria-labelledby="services-titre" className="border-t border-ink-100 bg-ink-50/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="services-titre"
          eyebrow="Services"
          title="Envie d'être accompagné ?"
          description={
            allInPreparation
              ? canReceiveMessages
                ? "Nous préparons des prestations pour vous aider à passer à l'action. Elles ne sont pas encore disponibles, mais vous pouvez dès maintenant nous indiquer celles qui vous intéressent."
                : "Nous préparons des prestations pour vous aider à passer à l'action. Elles ne sont pas encore disponibles. Dès que le formulaire de contact sera activé, vous pourrez nous indiquer celles qui vous intéressent."
              : canReceiveMessages
                ? "Des prestations pour vous aider à passer à l'action. Certaines sont encore en préparation : vous pouvez déjà nous indiquer celles qui vous intéressent."
                : "Des prestations pour vous aider à passer à l'action. Certaines sont encore en préparation. Dès que le formulaire de contact sera activé, vous pourrez nous indiquer celles qui vous intéressent."
          }
          action={
            <ButtonLink to="/services" variant="secondary">
              Voir tous les services
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          }
        />

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((service) => {
            const Icon = getIcon(service.icon);
            const available = service.status === "disponible";
            return (
              <li key={service.slug}>
                <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <Badge tone={available ? "success" : "neutral"}>
                      {!available && <Clock aria-hidden="true" />}
                      <span className="sr-only">Statut : </span>
                      {getServiceStatusLabel(service.status)}
                    </Badge>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{service.summary}</p>
                  <div className="mt-auto pt-5">
                    <Link
                      to={`/contact?service=${encodeURIComponent(service.slug)}`}
                      className="inline-flex min-h-10 items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline"
                    >
                      {canReceiveMessages
                        ? available
                          ? "Demander des informations"
                          : "Manifester mon intérêt"
                        : "Préparer ma demande"}
                      <span className="sr-only"> : {service.title}</span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
