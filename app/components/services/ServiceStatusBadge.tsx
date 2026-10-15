import { CircleCheck, Clock } from "lucide-react";
import { Badge } from "~/components/ui/Badge";
import type { ServiceStatus } from "~/data/types";
import { getServiceStatusLabel } from "~/lib/highlights";

/** Étiquette du statut d'un service, lu dans les données (« En préparation » ou « Disponible »). */
export function ServiceStatusBadge({ status }: { status: ServiceStatus }) {
  const available = status === "disponible";
  return (
    <Badge tone={available ? "success" : "warning"}>
      {available ? <CircleCheck aria-hidden="true" /> : <Clock aria-hidden="true" />}
      <span className="sr-only">Statut : </span>
      {getServiceStatusLabel(status)}
    </Badge>
  );
}
