import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "À propos", description: "Page en construction.", path: "/a-propos" });
}

export default function AProposPage() {
  return <PageHeader title="À propos" description="Page en construction." />;
}
