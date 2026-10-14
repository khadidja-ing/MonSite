import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Politique de confidentialité", description: "Page en construction.", path: "/confidentialite" });
}

export default function ConfidentialitePage() {
  return <PageHeader title="Politique de confidentialité" description="Page en construction." />;
}
