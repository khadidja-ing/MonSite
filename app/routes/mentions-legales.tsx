import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Mentions légales", description: "Page en construction.", path: "/mentions-legales" });
}

export default function MentionsLegalesPage() {
  return <PageHeader title="Mentions légales" description="Page en construction." />;
}
