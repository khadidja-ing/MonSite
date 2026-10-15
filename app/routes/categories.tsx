import { ArrowRight, Compass } from "lucide-react";
import { CategoryCard } from "~/components/categories/CategoryCard";
import { CatalogShortcutCard } from "~/components/categories-page/CatalogShortcutCard";
import { GettingStarted } from "~/components/categories-page/GettingStarted";
import { FinalCta } from "~/components/home/FinalCta";
import { ButtonLink, buttonClasses } from "~/components/ui/Button";
import { Container } from "~/components/ui/Container";
import { PageHeader } from "~/components/ui/PageHeader";
import { SectionHeading } from "~/components/ui/SectionHeading";
import { categories } from "~/data/categories";
import { tools } from "~/data/tools";
import { countToolsByCategory } from "~/lib/categories-page";
import { plural } from "~/lib/format";
import { pageMeta } from "~/lib/meta";
import type { Route } from "./+types/categories";

export function meta(_: Route.MetaArgs) {
  return pageMeta({
    title: "Catégories d'outils d'IA",
    description:
      "Découvrez les outils d'intelligence artificielle classés par usage : rédaction, images, vidéo, audio, automatisation… Choisissez une catégorie pour commencer.",
    path: "/categories",
  });
}

/** Phrase de synthèse, calculée à partir des données réelles. */
function catalogSummary(): string {
  const categoriesLabel = plural(categories.length, "catégorie");
  if (tools.length === 0) {
    return `${categoriesLabel}. Les premières fiches d'outils seront publiées dès qu'elles auront été vérifiées.`;
  }
  return `${categoriesLabel} et ${plural(tools.length, "outil")} référencé${tools.length > 1 ? "s" : ""} à ce jour. Un outil rattaché à plusieurs catégories est compté dans chacune d'elles.`;
}

export default function CategoriesPage() {
  const counts = countToolsByCategory(tools, categories);

  return (
    <>
      <PageHeader
        eyebrow="Catégories"
        title="Catégories IA"
        breadcrumbs={[{ label: "Catégories" }]}
        description={
          <>
            <p>
              Les outils sont regroupés selon ce qu'ils vous aident à faire : écrire, créer des images,
              automatiser une tâche, analyser des données… Choisissez un usage pour découvrir des
              exemples concrets et les outils correspondants.
            </p>
            <p className="mt-3 text-base text-ink-500">
              Bon à savoir : un même outil peut appartenir à plusieurs catégories. Un assistant
              conversationnel, par exemple, peut aussi bien aider à rédiger qu'à programmer.
            </p>
          </>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/outils" size="lg">
            Explorer tout le catalogue
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <a href="#par-ou-commencer" className={buttonClasses("secondary", "lg")}>
            <Compass aria-hidden="true" />
            Par où commencer ?
          </a>
        </div>
      </PageHeader>

      <section aria-labelledby="liste-categories-titre" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            id="liste-categories-titre"
            title="Choisissez un usage"
            description={catalogSummary()}
          />

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <li key={category.slug}>
                <CategoryCard category={category} toolCount={counts[category.slug]} />
              </li>
            ))}
            <li>
              <CatalogShortcutCard toolCount={tools.length} />
            </li>
          </ul>
        </Container>
      </section>

      <GettingStarted id="par-ou-commencer" />

      <FinalCta
        id="suggestion-titre"
        title="Un outil manque à l'appel ?"
        description="Le catalogue s'enrichit progressivement. Si vous connaissez un outil utile qui n'y figure pas encore, proposez-le : s'il correspond aux critères de sélection, il sera vérifié avant d'être ajouté."
        primary={{ label: "Suggérer un outil", to: "/contact?sujet=suggerer-outil" }}
        secondary={{ label: "Explorer les outils", to: "/outils" }}
      />
    </>
  );
}
