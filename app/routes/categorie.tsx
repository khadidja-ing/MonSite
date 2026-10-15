import { ArrowLeft, ArrowRight, Check, Info, Lightbulb, PackageOpen, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router";
import { CategoryChips } from "~/components/categories-page/CategoryChips";
import { NotFoundContent } from "~/components/layout/NotFoundContent";
import { ToolCard } from "~/components/tools/ToolCard";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { EmptyState } from "~/components/ui/EmptyState";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { categories, getCategory } from "~/data/categories";
import { tools } from "~/data/tools";
import {
  categoryCatalogLink,
  categoryMetaDescription,
  countToolsByCategory,
  getCategoryPageTools,
  getOtherCategories,
  hasToolsFromOtherCategories,
} from "~/lib/categories-page";
import { plural } from "~/lib/format";
import { getIcon } from "~/lib/icons";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/categorie";

const SUGGEST_TOOL_LINK = "/contact?sujet=suggerer-outil";

export function meta({ params }: Route.MetaArgs) {
  const category = getCategory(params.slug);
  if (!category) {
    return pageMeta({
      title: "Catégorie introuvable",
      description:
        "Cette catégorie n'existe pas ou a changé d'adresse. Retrouvez toutes les catégories d'outils d'intelligence artificielle, classées par usage.",
      path: `/categories/${params.slug}`,
      noIndex: true,
    });
  }
  return pageMeta({
    title: `${category.name} : outils d'IA`,
    description: categoryMetaDescription(category),
    path: `/categories/${category.slug}`,
  });
}

export default function CategoriePage({ params }: Route.ComponentProps) {
  const category = getCategory(params.slug);
  const counts = countToolsByCategory(tools, categories);

  if (!category) {
    return (
      <>
        <NotFoundContent
          title="Catégorie introuvable"
          description="Cette catégorie n'existe pas ou a changé d'adresse. Choisissez l'une des catégories ci-dessous."
        />
        <section aria-labelledby="categories-disponibles-titre" className="pb-24">
          <Container className="flex flex-col items-center text-center">
            <h2 id="categories-disponibles-titre" className="text-xl font-semibold">
              Toutes les catégories
            </h2>
            <CategoryChips categories={categories} counts={counts} className="mt-6 justify-center" />
            <Link
              to="/categories"
              className="mt-6 inline-flex min-h-10 items-center gap-1 rounded text-sm font-semibold text-brand-700 hover:underline"
            >
              Voir la page des catégories
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Container>
        </section>
      </>
    );
  }

  const Icon = getIcon(category.icon);
  const categoryTools = getCategoryPageTools(tools, category.slug);
  const toolCount = categoryTools.length;
  const showMainCategoryNote = hasToolsFromOtherCategories(categoryTools, category.slug);
  const catalogLink = categoryCatalogLink(category.slug);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Catégories", to: "/categories" }, { label: category.name }]}
        title={
          <span className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-card ring-1 ring-ink-100 sm:size-16">
              <Icon aria-hidden="true" className="size-7" />
            </span>
            <span className="min-w-0 break-words hyphens-auto">{category.name}</span>
          </span>
        }
        description={category.description}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to={catalogLink} size="lg">
            <SlidersHorizontal aria-hidden="true" />
            Filtrer dans le catalogue
          </ButtonLink>
          <ButtonLink to="/categories" variant="secondary" size="lg">
            <ArrowLeft aria-hidden="true" />
            Toutes les catégories
          </ButtonLink>
        </div>
      </PageHeader>

      {/* Exemples d'utilisation */}
      <section aria-labelledby="exemples-titre" className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading
            id="exemples-titre"
            eyebrow="Concrètement"
            title="Exemples d'utilisation"
            description="Quelques idées de ce que permettent les outils de cette catégorie, pour vous aider à vous projeter."
          />
          {category.examples.length > 0 ? (
            <ul className="grid gap-3 self-center sm:grid-cols-2">
              {category.examples.map((example) => (
                <li
                  key={example}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card ring-1 ring-ink-100"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-700 ring-1 ring-accent-100 ring-inset">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <span className="pt-0.5 text-ink-800">{example}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="self-center text-ink-600">
              Aucun exemple d'utilisation n'est encore indiqué pour cette catégorie.
            </p>
          )}
        </Container>
      </section>

      {/* Outils de la catégorie */}
      <section
        id="outils"
        aria-labelledby="outils-titre"
        className="border-y border-ink-100 bg-ink-50/60 py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            id="outils-titre"
            eyebrow="Catalogue"
            title="Les outils de cette catégorie"
            description={
              toolCount > 0
                ? `${plural(toolCount, "outil")} référencé${toolCount > 1 ? "s" : ""}. Chaque fiche explique simplement à quoi sert l'outil et comment y accéder.`
                : "Aucun outil n'est encore référencé dans cette catégorie."
            }
          />

          {toolCount > 0 ? (
            <>
              {showMainCategoryNote && (
                <p className="mt-6 flex max-w-3xl gap-2.5 text-sm leading-relaxed text-ink-600">
                  <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-400" />
                  <span>
                    Certains outils sont aussi rattachés à d'autres catégories : l'étiquette grise de
                    chaque carte indique leur catégorie principale. Les outils dont c'est la catégorie
                    principale apparaissent en premier.
                  </span>
                </p>
              )}

              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => (
                  <li key={tool.slug}>
                    <ToolCard tool={tool} />
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <p className="text-ink-700">
                  Besoin d'un outil gratuit, ou d'affiner votre recherche ? Le catalogue permet de
                  combiner plusieurs filtres.
                </p>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <ButtonLink to={catalogLink} variant="secondary">
                    <SlidersHorizontal aria-hidden="true" />
                    Filtrer dans le catalogue
                  </ButtonLink>
                  <Link
                    to={SUGGEST_TOOL_LINK}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded text-sm font-semibold text-brand-700 hover:underline"
                  >
                    <Lightbulb aria-hidden="true" className="size-4" />
                    Suggérer un outil
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-10">
              <EmptyState
                icon={PackageOpen}
                title="Aucun outil référencé pour l'instant"
                description="Aucun outil de cette catégorie n'a encore été ajouté au catalogue. Vous en connaissez un qui mériterait d'y figurer ? Proposez-le : il sera vérifié avant d'être ajouté."
                action={
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <ButtonLink to={SUGGEST_TOOL_LINK}>
                      <Lightbulb aria-hidden="true" />
                      Suggérer un outil
                    </ButtonLink>
                    <ButtonLink to="/outils" variant="secondary">
                      Explorer tout le catalogue
                    </ButtonLink>
                  </div>
                }
              />
            </div>
          )}
        </Container>
      </section>

      {/* Autres catégories */}
      <section aria-labelledby="autres-categories-titre" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="autres-categories-titre"
            title="Autres catégories"
            description="Explorez d'autres usages de l'intelligence artificielle."
          />
          <CategoryChips
            categories={getOtherCategories(categories, category.slug)}
            counts={counts}
            className="mt-8"
          />
        </Container>
      </section>
    </>
  );
}
