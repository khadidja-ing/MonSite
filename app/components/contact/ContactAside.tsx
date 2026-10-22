import { ArrowRight, Compass, Flag, Lightbulb, Mail, ShieldAlert, Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { canReceiveMessages, siteConfig } from "~/config/site";
import { services } from "~/data/services";
import { textLinkClasses } from "~/components/legal/TextLink";

// Typée « string » : l'adresse peut être renseignée plus tard dans les réglages.
const contactEmail: string = siteConfig.contact.email;
const allServicesInPreparation =
  services.length > 0 && services.every((service) => service.status === "en-preparation");

interface Topic {
  icon: LucideIcon;
  title: string;
  text: ReactNode;
  link?: { label: string; to: string };
}

const topics: Topic[] = [
  {
    icon: Compass,
    title: "Une question sur un outil",
    text: "Vous hésitez entre plusieurs outils ou ne savez pas lequel convient à votre besoin ? Le catalogue répond peut-être déjà à votre question.",
    link: { label: "Explorer les outils", to: "/outils" },
  },
  ...(services.length > 0
    ? [
        {
          icon: Sparkles,
          title: "Un intérêt pour un service",
          text: allServicesInPreparation
            ? canReceiveMessages
              ? "Les services d'accompagnement sont en préparation\u00a0: vous pouvez déjà manifester votre intérêt, sans engagement."
              : "Les services d'accompagnement sont en préparation\u00a0: dès que le formulaire de contact sera activé, vous pourrez manifester votre intérêt, sans engagement."
            : canReceiveMessages
              ? "Conseil, automatisation, formation… Décrivez votre situation pour en savoir plus sur un service."
              : "Conseil, automatisation, formation… Dès que le formulaire de contact sera activé, vous pourrez décrire votre situation pour en savoir plus sur un service.",
          link: { label: "Voir les services", to: "/services" },
        },
      ]
    : []),
  {
    icon: Flag,
    title: "Une erreur sur une fiche",
    text: canReceiveMessages
      ? "Vous signalez une erreur sur une fiche\u00a0? Précisez la fiche et la correction (avec la source, si possible)."
      : "Notez la fiche concernée et la correction à apporter (avec la source, si possible).",
  },
  {
    icon: Lightbulb,
    title: "Une idée d'outil à ajouter",
    text: "Indiquez son nom, son site officiel et l'usage que vous en faites.",
  },
];

/** Colonne d'accompagnement du formulaire : sujets possibles, liens utiles, conseils. */
export function ContactAside() {
  return (
    <aside aria-labelledby="contact-aide-titre" className="space-y-6">
      <div className="rounded-3xl bg-ink-50/70 p-5 ring-1 ring-ink-100 sm:p-6">
        <h2 id="contact-aide-titre" className="text-lg font-semibold tracking-tight">
          {canReceiveMessages ? "Ce que vous pouvez nous demander" : "Ce que vous pourrez nous demander"}
        </h2>
        {!canReceiveMessages && (
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Le formulaire de contact sera bientôt activé. En attendant, ces conseils vous aident à préparer
            votre message.
          </p>
        )}
        <ul className="mt-5 space-y-5">
          {topics.map(({ icon: Icon, title, text, link }) => (
            <li key={title} className="flex gap-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-card ring-1 ring-ink-100">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{text}</p>
                {link && (
                  <Link
                    to={link.to}
                    className="mt-1.5 inline-flex min-h-10 items-center gap-1.5 rounded text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                  >
                    {link.label}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {contactEmail && (
        <div className="flex gap-3.5 rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-100 sm:p-6">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <Mail aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Par e-mail</h2>
            <p className="mt-1 text-sm text-ink-600">
              Vous préférez votre messagerie&nbsp;? Écrivez à{" "}
              <a href={`mailto:${contactEmail}`} className={`${textLinkClasses} break-all`}>
                {contactEmail}
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3.5 rounded-3xl bg-white p-5 shadow-card ring-1 ring-ink-100 sm:p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
          <ShieldAlert aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold">Protégez vos informations</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-600">
            N'indiquez jamais de mot de passe, de coordonnées bancaires ou de données de santé dans votre
            message&nbsp;: elles ne sont pas nécessaires pour vous répondre.
          </p>
        </div>
      </div>
    </aside>
  );
}
