import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Explorer les outils IA", description: "Page en construction.", path: "/outils" });
}

export default function OutilsPage() {
  return <PageHeader title="Explorer les outils IA" description="Page en construction." />;
}
