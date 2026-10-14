import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Catégories IA", description: "Page en construction.", path: "/categories" });
}

export default function CategoriesPage() {
  return <PageHeader title="Catégories IA" description="Page en construction." />;
}
