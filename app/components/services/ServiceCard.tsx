import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "~/components/ui/Button";
import { canReceiveMessages } from "~/config/site";
import type { Service } from "~/data/types";
import { getIcon } from "~/lib/icons";
import { serviceContactLink, serviceCtaLabel } from "~/lib/services-page";
import { ServiceStatusBadge } from "./ServiceStatusBadge";

/**
 * Présentation complète d'un service : statut, description, bénéfices,
 * public visé et bouton de contact. Le libellé du bouton dépend du statut du
 * service et du fait qu'un moyen de contact fonctionne déjà : sinon, il invite
 * seulement à préparer sa demande, sans promettre qu'elle sera envoyée.
 */
export function ServiceCard({ service }: { service: Service }) {
  const Icon = getIcon(service.icon);
  const titleId = `${service.slug}-titre`;

  return (
    <article
      id={service.slug}
      aria-labelledby={titleId}
      className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-100 sm:p-8"
    >
      {/* Sur téléphone : texte, bénéfices, puis bouton. Sur grand écran : bouton sous le texte. */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:gap-y-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="flex items-center justify-between gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <ServiceStatusBadge status={service.status} />
          </div>

          <h3 id={titleId} className="mt-6 text-2xl font-bold tracking-tight">
            {service.title}
          </h3>
          <p className="mt-3 text-lg leading-relaxed font-medium text-ink-800">{service.summary}</p>
          <p className="mt-3 leading-relaxed text-ink-600">{service.description}</p>
        </div>

        <div className="rounded-2xl bg-ink-50/80 p-5 ring-1 ring-ink-100 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <h4 className="text-base font-semibold">Ce que vous y gagnez</h4>
          {service.benefits.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {service.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                  <span className="leading-relaxed text-ink-800">{benefit}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-600">Les bénéfices de ce service ne sont pas encore détaillés.</p>
          )}

          {service.audience.length > 0 && (
            <div className="mt-6 border-t border-ink-200/70 pt-6">
              <h4 className="text-base font-semibold">Pour qui ?</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {service.audience.map((audience) => (
                  <li
                    key={audience}
                    className="rounded-full bg-white px-3 py-1 text-sm font-medium text-ink-700 ring-1 ring-ink-200 ring-inset"
                  >
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-start-1 lg:row-start-2 lg:self-end">
          <ButtonLink
            to={serviceContactLink(service.slug)}
            variant={service.status === "disponible" ? "primary" : "secondary"}
            className="w-full sm:w-auto"
          >
            {canReceiveMessages ? serviceCtaLabel(service.status) : "Préparer ma demande"}
            <span className="sr-only"> : {service.title}</span>
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
