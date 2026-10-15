import { CalendarDays, Clock } from "lucide-react";
import { Badge } from "~/components/ui/Badge";
import { getResourceType } from "~/data/resource-types";
import type { Article, ResourceType } from "~/data/types";
import { cn } from "~/lib/cn";
import { formatDate } from "~/lib/format";
import { getIcon } from "~/lib/icons";
import { levelLabels } from "~/lib/resources";

/** Étiquette du type de contenu (Guide, Tutoriel, Conseil…). */
export function ResourceTypeBadge({ type }: { type: ResourceType }) {
  const info = getResourceType(type);
  if (!info) return null;
  const Icon = getIcon(info.icon);
  return (
    <Badge tone="brand">
      <Icon aria-hidden="true" />
      <span className="sr-only">Type de contenu : </span>
      {info.singular}
    </Badge>
  );
}

/** Étiquette du niveau de l'article. */
export function LevelBadge({ level }: { level: Article["level"] }) {
  return <Badge tone="accent">Niveau {levelLabels[level].toLowerCase()}</Badge>;
}

/** Temps de lecture estimé. */
export function ReadingTime({ minutes, className }: { minutes: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Clock aria-hidden="true" className="size-4 shrink-0 text-ink-400" />
      {minutes} min de lecture
    </span>
  );
}

/** Date de publication (avec un préfixe facultatif, ex. « Publié le »). */
export function ArticleDate({ date, prefix, className }: { date: string; prefix?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-ink-400" />
      <span>
        {prefix ? `${prefix} ` : <span className="sr-only">Publié le </span>}
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
    </span>
  );
}
