import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Article", description: "Page en construction.", path: "/ressources" });
}

export default function ArticlePage() {
  return <PageHeader title="Article" description="Page en construction." />;
}
