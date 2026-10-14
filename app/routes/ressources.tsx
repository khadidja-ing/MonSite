import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Ressources et guides", description: "Page en construction.", path: "/ressources" });
}

export default function RessourcesPage() {
  return <PageHeader title="Ressources et guides" description="Page en construction." />;
}
