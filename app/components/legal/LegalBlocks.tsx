import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

/** Liste à puces dans un document légal. */
export function LegalList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul className={cn("space-y-2 pl-5 marker:text-accent-600 [&>li]:list-disc [&>li]:pl-1", className)}>
      {children}
    </ul>
  );
}

/** Sous-titre à l'intérieur d'une section. */
export function LegalSubheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-lg font-semibold tracking-tight">{children}</h3>;
}

/** Tableau « libellé → valeur » (coordonnées de l'éditeur, de l'hébergeur…). */
export function LegalInfoList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-ink-100">
      {items.map((item) => (
        <div key={item.label} className="gap-6 px-5 py-4 sm:grid sm:grid-cols-[13rem_minmax(0,1fr)]">
          <dt className="text-sm font-medium text-ink-500">{item.label}</dt>
          <dd className="mt-1 break-words text-ink-900 sm:mt-0">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Remarque secondaire (conseil, précision à vérifier…). */
export function LegalNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-l-4 border-ink-200 bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-600">
      {children}
    </p>
  );
}
