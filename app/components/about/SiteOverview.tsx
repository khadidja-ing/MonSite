import { ArrowRight, BookOpen, Handshake, LayoutGrid, Search, type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { Container } from "~/components/ui/Container";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { articles } from "~/data/articles";
import { categories } from "~/data/categories";
import { services } from "~/data/services";
import { tools } from "~/data/tools";
import { plural } from "~/lib/format";
import { areAllServicesInPreparation } from "~/lib/highlights";

interface SiteSection {
  to: string;
  icon: LucideIcon;
  title: string;
  text: string;
  /** Petite information calculée à partir des données (facultative). */
  meta?: string;
}

function getSections(): SiteSection[] {
  const availableServices = services.filter((service) => service.status === "disponible").length;
  return [
    {
      to: "/outils",
      icon: Search,
      title: "Le catalogue d'outils",
      text: "Tous les outils référencés, avec une recherche et des filtres par catégorie et par modèle d'accès.",
      meta: `${plural(tools.length, "outil")} référencé${tools.length > 1 ? "s" : ""}`,
    },
    {
      to: "/categories",
      icon: LayoutGrid,
      title: "Les catégories",
      text: "Les grandes familles d'usages de l'IA, expliquées simplement avec des exemples concrets.",
      meta: plural(categories.length, "catégorie"),
    },
    {
      to: "/ressources",
      icon: BookOpen,
      title: "Les ressources",
      text: "Des guides pour débuter : comprendre les bases, bien formuler ses demandes, connaître les limites.",
      meta: articles.length > 0 ? `${plural(articles.length, "guide")} publié${articles.length > 1 ? "s" : ""}` : undefined,
    },
    {
      to: "/services",
      icon: Handshake,
      title: "Les services",
      text: "Des prestations d'accompagnement pour passer à l'action : conseil, automatisation, formation…",
      meta:
        services.length === 0
          ? undefined
          : areAllServicesInPreparation(services)
            ? "En préparation"
            : `${plural(availableServices, "prestation")} disponible${availableServices > 1 ? "s" : ""}`,
    },
  ];
}

/** « Ce que vous trouverez sur le site » : liens vers les grandes rubriques. */
export function SiteOverview() {
  const sections = getSections();
  return (
    <section aria-labelledby="rubriques-titre" className="border-y border-ink-100 bg-ink-50/60 py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="rubriques-titre"
          eyebrow="Sur le site"
          title="Ce que vous trouverez ici"
          description="Quatre rubriques complémentaires, pour découvrir, comprendre et passer à l'action à votre rythme."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.to}>
                <article className="group relative flex h-full flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-shadow hover:shadow-card-hover">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">
                    <Link
                      to={section.to}
                      className="rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-brand-700"
                    >
                      {section.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{section.text}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
                    <span className="text-ink-500">{section.meta}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-brand-600 transition-transform group-hover:translate-x-0.5"
                    />
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
