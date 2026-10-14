import { PageHeader } from "~/components/ui/PageHeader";
import { pageMeta } from "~/lib/meta";

// PAGE PROVISOIRE — à construire.
export function meta() {
  return pageMeta({ title: "Services professionnels", description: "Page en construction.", path: "/services" });
}

export default function ServicesPage() {
  return <PageHeader title="Services professionnels" description="Page en construction." />;
}
