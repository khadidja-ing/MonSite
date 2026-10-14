import { CircleHelp } from "lucide-react";
import type { AccessModel } from "~/data/types";
import { getAccessLabel } from "~/lib/catalog";
import { Badge } from "../ui/Badge";

const tones = {
  gratuit: "success",
  freemium: "brand",
  payant: "neutral",
  "a-confirmer": "warning",
} as const;

/** Étiquette du modèle d'accès (gratuit, freemium, payant ou à confirmer). */
export function AccessBadge({ access }: { access: AccessModel }) {
  return (
    <Badge tone={tones[access]}>
      {access === "a-confirmer" && <CircleHelp aria-hidden="true" />}
      <span className="sr-only">Modèle d'accès : </span>
      {getAccessLabel(access)}
    </Badge>
  );
}
