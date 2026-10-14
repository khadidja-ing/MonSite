import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Fiche outil", description: "Page en construction.", path: "/outils" });
}

export default function OutilPage() {
  return <PageHeader title="Fiche outil" description="Page en construction." />;
}
