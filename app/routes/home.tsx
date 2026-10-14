import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Accueil", description: "Page en construction.", path: "/" });
}

export default function HomePage() {
  return <PageHeader title="Accueil" description="Page en construction." />;
}
