import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarCheck, Check, ExternalLink, Flag, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/outil";
import { NotFoundContent } from "~/components/layout/NotFoundContent";
import { AccessBadge } from "~/components/tools/AccessBadge";
import { ToolCard } from "~/components/tools/ToolCard";
import { ToolLogo } from "~/components/tools/ToolLogo";
import { Badge } from "~/components/ui/Badge";
import type { Crumb } from "~/components/ui/Breadcrumbs";
import { ButtonLink, ExternalButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { Notice } from "~/components/ui/Notice";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { getCategory } from "~/data/categories";
import { getTool, tools } from "~/data/tools";
import type { Tool } from "~/data/types";
import { accessModels } from "~/lib/catalog";
import {
  accessExplanations,
  buildToolDescription,
  describeSource,
  getSimilarTools,
  pricingDisclaimer,
  toolCategorySlugs,
} from "~/lib/catalog-ui";
import { formatDate } from "~/lib/format";
import { getIcon } from "~/lib/icons";
import { pageMeta } from "~/lib/meta";

export function meta({ params }: Route.MetaArgs) {
  const tool = getTool(params.slug);
  if (!tool) {
    return pageMeta({
      title: "Outil introuvable",
      description:
        "Cet outil n'est pas référencé dans le catalogue. Parcourez la liste complète des outils d'IA, classés par catégorie et par modèle d'accès.",
      path: `/outils/${params.slug}`,
      noIndex: true,
    });
  }

  const category = getCategory(tool.category);
  return [
    ...pageMeta({
      title: `${tool.name} — fiche, usages et accès`,
      description: buildToolDescription(tool),
      path: `/outils/${tool.slug}`,
    }),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        url: tool.website,
        description: tool.tagline,
        applicationCategory: category?.name ?? tool.category,
        publisher: { "@type": "Organization", name: tool.publisher },
      },
    },
  ];
}

/** Section de la fiche, avec un titre de niveau 2. */
function DetailSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AccessSection({ tool }: { tool: Tool }) {
  const model = accessModels.find((item) => item.value === tool.access);
  const toBeConfirmed = tool.access === "a-confirmer";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <AccessBadge access={tool.access} />
        {model && !toBeConfirmed && <span className="text-sm text-ink-500">{model.description}</span>}
      </div>

      {toBeConfirmed ? (
        <Notice tone="warning" title="Information à confirmer" className="mt-5">
          Le modèle d'accès de cet outil (gratuit, freemium ou payant) n'a pas encore été vérifié.
          Consultez son site officiel pour connaître les conditions actuelles avant de l'utiliser.
        </Notice>
      ) : (
        <p className="mt-4 leading-relaxed text-ink-700">{accessExplanations[tool.access]}</p>
      )}

      {tool.accessNote && (
        <p className="mt-4 leading-relaxed text-ink-700">
          <span className="font-semibold text-ink-900">Précision : </span>
          {tool.accessNote}
        </p>
      )}

      <p className="mt-5 flex gap-2.5 border-t border-ink-100 pt-5 text-sm leading-relaxed text-ink-600">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-400" />
        <span>{pricingDisclaimer}</span>
      </p>
    </div>
  );
}

function CategoryLinks({ tool }: { tool: Tool }) {
  const items = toolCategorySlugs(tool).flatMap((slug) => {
    const category = getCategory(slug);
    return category ? [category] : [];
  });

  if (items.length === 0) {
    return <p className="text-ink-600">Aucune catégorie n'est indiquée pour cet outil.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {items.map((category, index) => {
        const Icon = getIcon(category.icon);
        const isMain = index === 0;
        return (
          <li key={category.slug}>
            <Link
              to={`/categories/${category.slug}`}
              className="group inline-flex min-h-12 items-center gap-3 rounded-xl bg-white py-2 pr-4 pl-2 text-sm font-medium text-ink-800 shadow-card ring-1 ring-ink-100 transition hover:text-brand-700 hover:shadow-card-hover hover:ring-brand-200"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span>{category.name}</span>
              {isMain && (
                <>
                  <span aria-hidden="true">
                    <Badge tone="accent">Principale</Badge>
                  </span>
                  <span className="sr-only"> (catégorie principale)</span>
                </>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SourcesCard({ tool }: { tool: Tool }) {
  return (
    <section
      aria-labelledby="sources-verification"
      className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 lg:sticky lg:top-24"
    >
      <h2 id="sources-verification" className="text-lg font-semibold">
        Sources et vérification
      </h2>

      <p className="mt-4 flex items-start gap-3 rounded-xl bg-accent-50 p-3.5 text-sm text-accent-800 ring-1 ring-accent-100 ring-inset">
        <CalendarCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <span>
          Informations vérifiées le{" "}
          <time dateTime={tool.lastChecked} className="font-semibold whitespace-nowrap">
            {formatDate(tool.lastChecked)}
          </time>
        </span>
      </p>

      <h3 className="mt-6 text-sm font-semibold text-ink-900">Sources consultées</h3>
      {tool.sources.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {tool.sources.map((url) => {
            const { domain, path } = describeSource(url);
            return (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-2 flex min-h-10 items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-ink-50"
                >
                  <ExternalLink
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-ink-400 group-hover:text-brand-600"
                  />
                  <span className="min-w-0 text-sm">
                    <span className="block font-medium text-brand-700 group-hover:underline">{domain}</span>
                    {path && <span className="block truncate text-xs text-ink-500">{path}</span>}
                    <span className="sr-only"> (nouvel onglet)</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-600">Aucune source n'est encore indiquée pour cette fiche.</p>
      )}

      <div className="mt-6 border-t border-ink-100 pt-5">
        <p className="text-sm leading-relaxed text-ink-600">
          Ces informations sont données à titre indicatif. Une erreur ou une information dépassée ?
        </p>
        <Link
          to={`/contact?sujet=signaler-erreur&outil=${encodeURIComponent(tool.slug)}`}
          className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-brand-700 hover:underline"
        >
          <Flag aria-hidden="true" className="size-4 shrink-0" />
          Signaler une erreur sur cette fiche
        </Link>
      </div>
    </section>
  );
}

export default function OutilPage({ params }: Route.ComponentProps) {
  const tool = getTool(params.slug);

  if (!tool) {
    return (
      <NotFoundContent
        title="Outil introuvable"
        description="Cet outil n'est pas (ou plus) référencé dans notre catalogue. Vérifiez l'adresse ou parcourez la liste complète des outils."
      />
    );
  }

  const category = getCategory(tool.category);
  const similar = getSimilarTools(tools, tool, 3);

  const breadcrumbs: Crumb[] = [
    { label: "Explorer les outils", to: "/outils" },
    ...(category ? [{ label: category.shortName, to: `/categories/${category.slug}` }] : []),
    { label: tool.name },
  ];

  return (
    <>
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={
          <span className="flex items-center gap-4 sm:gap-5">
            <ToolLogo tool={tool} size="lg" />
            <span className="min-w-0 break-words">{tool.name}</span>
          </span>
        }
        description={
          <>
            <p className="text-base font-medium text-ink-500">
              Édité par <span className="text-ink-800">{tool.publisher}</span>
            </p>
            <p className="mt-3">{tool.tagline}</p>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <Badge>
              <span className="sr-only">Catégorie : </span>
              {category.shortName}
            </Badge>
          )}
          <AccessBadge access={tool.access} />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ExternalButtonLink href={tool.website} size="lg">
            Visiter le site officiel
            <ArrowUpRight aria-hidden="true" />
          </ExternalButtonLink>
          <ButtonLink to="/outils" variant="secondary" size="lg">
            <ArrowLeft aria-hidden="true" />
            Retour au catalogue
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          <div className="space-y-12 sm:space-y-14">
            <DetailSection id="presentation" title="Présentation">
              <p className="max-w-3xl text-lg leading-relaxed text-ink-700">{tool.description}</p>
            </DetailSection>

            <DetailSection id="usages" title="Principaux usages">
              {tool.uses.length > 0 ? (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {tool.uses.map((use) => (
                    <li
                      key={use}
                      className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
                        <Check aria-hidden="true" className="size-4" />
                      </span>
                      <span className="pt-0.5 text-ink-800">{use}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ink-600">Les usages de cet outil n'ont pas encore été détaillés.</p>
              )}
            </DetailSection>

            <DetailSection id="modele-acces" title="Modèle d'accès">
              <AccessSection tool={tool} />
            </DetailSection>

            <DetailSection id="categories-outil" title="Catégories">
              <CategoryLinks tool={tool} />
            </DetailSection>
          </div>

          <aside aria-label="Sources et vérification de la fiche" className="min-w-0">
            <SourcesCard tool={tool} />
          </aside>
        </div>
      </Container>

      {similar.length > 0 && category && (
        <section aria-labelledby="outils-similaires" className="border-t border-ink-100 bg-ink-50/60">
          <Container className="py-16 sm:py-20">
            <SectionHeading
              id="outils-similaires"
              title="Outils similaires"
              description={`D'autres outils de la catégorie «\u00a0${category.name}\u00a0».`}
              action={
                <ButtonLink to={`/categories/${category.slug}`} variant="secondary">
                  Voir toute la catégorie
                  <ArrowRight aria-hidden="true" />
                </ButtonLink>
              }
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((other) => (
                <li key={other.slug}>
                  <ToolCard tool={other} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
