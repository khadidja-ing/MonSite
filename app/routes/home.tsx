import { ArrowRight, PackageOpen } from "lucide-react";
import { CategoryCard } from "~/components/categories/CategoryCard";
import { CategoryQuickList } from "~/components/home/CategoryQuickList";
import { FinalCta } from "~/components/home/FinalCta";
import { HomeHero } from "~/components/home/HomeHero";
import { HowWeHelp } from "~/components/home/HowWeHelp";
import { LearnTeaser } from "~/components/home/LearnTeaser";
import { ServicesPreview } from "~/components/home/ServicesPreview";
import { SuggestToolCard } from "~/components/home/SuggestToolCard";
import { ToolCard } from "~/components/tools/ToolCard";
import { ButtonLink } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { EmptyState } from "~/components/ui/EmptyState";
import { Notice } from "~/components/ui/Notice";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { canReceiveMessages } from "~/config/site";
import { categories } from "~/data/categories";
import { services } from "~/data/services";
import { tools } from "~/data/tools";
import { getToolsByCategory } from "~/lib/catalog";
import { getFeaturedTools } from "~/lib/highlights";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Trouvez l'outil d'IA adapté à votre besoin",
    description:
      "Découvrez des outils d'intelligence artificielle classés par usage et expliqués simplement, avec des fiches vérifiées, datées et sourcées pour bien choisir.",
    path: "/",
  });
}

export default function HomePage() {
  const featuredTools = getFeaturedTools(tools, 6);

  return (
    <>
      <HomeHero />

      {/* Catégories */}
      <section aria-labelledby="categories-titre" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="categories-titre"
            eyebrow="Catégories"
            title="Explorez l'IA par usage"
            description="Chaque catégorie regroupe des outils qui servent un même objectif. Commencez simplement par ce que vous voulez faire."
            action={
              <ButtonLink to="/categories" variant="secondary">
                Voir toutes les catégories
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            }
          />
          {/* Sur téléphone : liste compacte. À partir des tablettes : grille de cartes. */}
          <CategoryQuickList tools={tools} className="mt-10 sm:hidden" />
          <ul className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <CategoryCard
                  category={category}
                  toolCount={getToolsByCategory(tools, category.slug).length}
                />
              </li>
            ))}
            <li>
              <SuggestToolCard />
            </li>
          </ul>
        </Container>
      </section>

      {/* Outils mis en avant */}
      <section
        aria-labelledby="selection-titre"
        className="border-y border-ink-100 bg-ink-50/60 py-20 sm:py-24"
      >
        <Container>
          <SectionHeading
            id="selection-titre"
            eyebrow="Sélection"
            title="Des outils pour bien démarrer"
            description="Une sélection d'outils polyvalents pour une première prise en main. Chaque fiche explique simplement à quoi sert l'outil et comment y accéder."
            action={
              <ButtonLink to="/outils" variant="secondary">
                Voir tout le catalogue
                <ArrowRight aria-hidden="true" />
              </ButtonLink>
            }
          />

          {featuredTools.length > 0 ? (
            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTools.map((tool) => (
                <li key={tool.slug}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12">
              <EmptyState
                icon={PackageOpen}
                title="Le catalogue est en cours de préparation"
                description="Les premières fiches d'outils seront publiées ici dès qu'elles auront été vérifiées."
              />
            </div>
          )}

          <Notice className="mt-8 max-w-3xl" title="Les offres changent souvent">
            Le modèle d'accès (gratuit, freemium, payant) de chaque outil a été vérifié à la date
            indiquée sur sa fiche. Les conditions pouvant évoluer à tout moment, confirmez-les
            toujours sur le site officiel de l'éditeur avant de vous engager.
          </Notice>
        </Container>
      </section>

      <HowWeHelp />

      <ServicesPreview services={services} />

      <LearnTeaser />

      <FinalCta
        title="Vous ne savez pas par où commencer ?"
        description={
          canReceiveMessages
            ? "Parcourez le catalogue à votre rythme, ou écrivez-nous en quelques mots ce que vous aimeriez faire avec l'IA."
            : "Parcourez le catalogue à votre rythme. Dès que le formulaire de contact sera activé, vous pourrez aussi nous décrire en quelques mots ce que vous aimeriez faire avec l'IA."
        }
        primary={{ label: "Explorer les outils", to: "/outils" }}
        secondary={{
          label: canReceiveMessages ? "Nous contacter" : "Voir comment nous contacter",
          to: "/contact",
        }}
      />
    </>
  );
}
