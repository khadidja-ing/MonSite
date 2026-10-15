import { ArrowRight, MessageSquareText } from "lucide-react";
import { Link } from "react-router";
import { NotFoundContent } from "~/components/layout/NotFoundContent";
import { FinalCta } from "~/components/home/FinalCta";
import { ArticleBody } from "~/components/resources/ArticleBody";
import { ArticleCard } from "~/components/resources/ArticleCard";
import { ArticleOutline } from "~/components/resources/ArticleOutline";
import { RelatedCategories } from "~/components/resources/RelatedCategories";
import { ArticleDate, LevelBadge, ReadingTime, ResourceTypeBadge } from "~/components/resources/ResourceBadges";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { siteConfig } from "~/config/site";
import { articles, getArticle } from "~/data/articles";
import { getCategory } from "~/data/categories";
import { getResourceType } from "~/data/resource-types";
import type { Category } from "~/data/types";
import { absoluteUrl, pageMeta } from "~/lib/meta";
import { articleJsonLd, frenchSpacing, getOtherArticles, getOutline, sortArticles } from "~/lib/resources";
import type { Route } from "./+types/article";

export function meta({ params }: Route.MetaArgs) {
  const article = getArticle(params.slug);
  if (!article) {
    return pageMeta({
      title: "Ressource introuvable",
      description:
        "Cet article n'existe pas ou a changé d'adresse. Retrouvez tous les guides, tutoriels et conseils pour débuter avec l'intelligence artificielle.",
      path: `/ressources/${params.slug}`,
      noIndex: true,
    });
  }

  const path = `/ressources/${article.slug}`;
  return [
    ...pageMeta({ title: article.title, description: article.summary, path, type: "article" }),
    { property: "article:published_time", content: article.publishedOn },
    ...(article.updatedOn ? [{ property: "article:modified_time", content: article.updatedOn }] : []),
    {
      "script:ld+json": articleJsonLd(article, {
        siteName: siteConfig.name,
        url: absoluteUrl(path),
        section: getResourceType(article.type)?.name,
      }),
    },
  ];
}

/** Page affichée lorsqu'aucun article ne correspond à l'adresse. */
function ArticleNotFound() {
  const available = sortArticles(articles).slice(0, 6);
  return (
    <>
      <NotFoundContent
        title="Ressource introuvable"
        description="Cet article n'existe pas ou a changé d'adresse. Retrouvez tous nos guides dans la rubrique Ressources."
      />
      <section aria-labelledby="articles-disponibles-titre" className="pb-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 id="articles-disponibles-titre" className="text-center text-xl font-semibold">
              Articles disponibles
            </h2>
            {available.length > 0 ? (
              <ul className="mt-6 divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
                {available.map((article) => (
                  <li key={article.slug}>
                    <Link
                      to={`/ressources/${article.slug}`}
                      className="group flex min-h-14 items-center justify-between gap-4 px-5 py-3.5 text-ink-800 transition-colors hover:bg-ink-50 hover:text-brand-700 focus-visible:-outline-offset-2"
                    >
                      <span className="font-medium">{frenchSpacing(article.title)}</span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-center text-ink-600">Les premiers articles sont en préparation.</p>
            )}
            <div className="mt-8 flex justify-center">
              <ButtonLink to="/ressources" variant="secondary">
                Toutes les ressources
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function ArticlePage({ params }: Route.ComponentProps) {
  const article = getArticle(params.slug);
  if (!article) return <ArticleNotFound />;

  const outline = getOutline(article.body);
  const others = getOtherArticles(articles, article, 3);
  const relatedCategories = (article.categories ?? []).flatMap((slug): Category[] => {
    const category = getCategory(slug);
    return category ? [category] : [];
  });

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Ressources", to: "/ressources" }, { label: frenchSpacing(article.title) }]}
        title={frenchSpacing(article.title)}
        description={<p>{frenchSpacing(article.summary)}</p>}
      >
        <div className="flex flex-wrap items-center gap-2">
          <ResourceTypeBadge type={article.type} />
          <LevelBadge level={article.level} />
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
          <ReadingTime minutes={article.readingMinutes} />
          <ArticleDate date={article.publishedOn} prefix="Publié le" />
          {article.updatedOn && <ArticleDate date={article.updatedOn} prefix="Mis à jour le" />}
        </div>
      </PageHeader>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="min-w-0 max-w-3xl">
            <ArticleBody body={article.body} />

            {relatedCategories.length > 0 && (
              <section aria-labelledby="categories-liees-titre" className="mt-16 border-t border-ink-100 pt-10">
                <h2 id="categories-liees-titre" className="text-2xl font-bold tracking-tight">
                  Catégories d'outils liées
                </h2>
                <p className="mt-2 text-ink-600">
                  Pour mettre en pratique, découvrez les outils de ces catégories.
                </p>
                <div className="mt-6">
                  <RelatedCategories categories={relatedCategories} />
                </div>
              </section>
            )}

            <p className="mt-12 flex gap-3 rounded-2xl bg-ink-50 p-5 text-sm leading-relaxed text-ink-600 ring-1 ring-ink-100 ring-inset">
              <MessageSquareText aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink-400" />
              <span>
                Une information vous semble inexacte, dépassée ou peu claire&nbsp;?{" "}
                <Link
                  to="/contact"
                  className="font-semibold whitespace-nowrap text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  Signalez-la-nous
                </Link>
                &nbsp;: vos remarques aident à améliorer ces guides.
              </span>
            </p>
          </div>

          {outline.length > 0 && (
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <ArticleOutline items={outline} />
                <div className="mt-8 rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
                  <p className="font-display font-semibold text-ink-950">Passer à la pratique</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    Trouvez un outil adapté à votre besoin dans le catalogue.
                  </p>
                  <ButtonLink to="/outils" size="sm" className="mt-4 w-full">
                    Explorer les outils
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>

      <section aria-labelledby="autres-ressources-titre" className="border-t border-ink-100 bg-ink-50/60 py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="autres-ressources-titre"
            title="Autres ressources"
            description={
              others.length > 0
                ? "Poursuivez votre découverte avec d'autres articles de la rubrique."
                : "La rubrique s'enrichit progressivement : de nouveaux articles y seront ajoutés au fil du temps."
            }
            action={
              <ButtonLink to="/ressources" variant="secondary">
                Toutes les ressources
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            }
          />
          {others.length > 0 && (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <li key={other.slug}>
                  <ArticleCard article={other} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <div className="pt-20 sm:pt-24">
        <FinalCta
          id="article-cta-titre"
          title="Prêt à passer à la pratique ?"
          description="Parcourez le catalogue : les outils y sont classés par usage et présentés simplement, avec leur modèle d'accès et un lien vers leur site officiel."
          primary={{ label: "Explorer les outils", to: "/outils" }}
          secondary={{ label: "Voir les catégories", to: "/categories" }}
        />
      </div>
    </>
  );
}
