import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/cn";

/** Style commun des champs de saisie (texte, liste, zone de texte). */
export const controlClasses = cn(
  "block w-full rounded-xl bg-white px-3.5 py-2.5 text-base text-ink-950 shadow-sm ring-1 ring-ink-400 ring-inset transition-shadow",
  "placeholder:text-ink-500 hover:ring-ink-500 focus:ring-2 focus:ring-brand-600 focus:outline-hidden",
  "aria-[invalid=true]:ring-red-500 aria-[invalid=true]:focus:ring-red-600",
  "disabled:cursor-not-allowed disabled:bg-ink-50",
);

/** Identifiants des textes liés à un champ (aide et erreur). */
export function fieldIds(id: string) {
  return { hint: `${id}-aide`, error: `${id}-erreur` };
}

/** Liste des identifiants à placer dans aria-describedby (sans les vides). */
export function describedBy(...ids: (string | false | null | undefined)[]): string | undefined {
  const list = ids.filter(Boolean).join(" ");
  return list || undefined;
}

/**
 * Champ de formulaire : libellé visible, aide facultative, champ, puis
 * message d'erreur lié au champ (aria-describedby).
 */
export function FormField({
  id,
  label,
  hint,
  error,
  children,
  footer,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  /** Contenu affiché sous le champ, à droite (ex. compteur de caractères). */
  footer?: ReactNode;
}) {
  const ids = fieldIds(id);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
      </label>
      {hint && (
        <p id={ids.hint} className="mt-1 text-sm leading-relaxed text-ink-600">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {(error || footer) && (
        <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {error ? (
            <p id={ids.error} className="flex gap-1.5 text-sm font-medium text-red-700">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </p>
          ) : (
            <span className="hidden sm:block" />
          )}
          {footer}
        </div>
      )}
    </div>
  );
}
