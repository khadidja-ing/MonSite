import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Catégorie", description: "Page en construction.", path: "/categories" });
}

export default function CategoriePage() {
  return <PageHeader title="Catégorie" description="Page en construction." />;
}
