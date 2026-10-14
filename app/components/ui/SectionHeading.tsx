import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

/** Titre de section avec sur-titre et texte d'introduction facultatifs. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  id,
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** Lien ou bouton affiché à droite du titre (ex. « Tout voir »). */
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold tracking-wide text-brand-700 uppercase">{eyebrow}</p>
        )}
        <Heading id={id} className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </Heading>
        {description && <div className="mt-3 text-lg leading-relaxed text-ink-600">{description}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
