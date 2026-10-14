import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Conditions d'utilisation", description: "Page en construction.", path: "/conditions-utilisation" });
}

export default function ConditionsUtilisationPage() {
  return <PageHeader title="Conditions d'utilisation" description="Page en construction." />;
}
