import { Search, X } from "lucide-react";
import { useId, type RefObject } from "react";
import { Form } from "react-router";

/**
 * Champ de recherche du catalogue.
 * Les résultats se mettent à jour pendant la saisie ; la touche Échap ou le
 * bouton « × » effacent la recherche. Sans JavaScript, le formulaire envoie
 * simplement la recherche à la page /outils.
 */
export function CatalogSearch({
  value,
  onChange,
  onClear,
  onSubmit,
  inputRef,
  hydrated,
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  hydrated: boolean;
}) {
  const inputId = useId();
  const hintId = useId();

  const clear = () => {
    onClear();
    inputRef.current?.focus();
  };

  return (
    <Form
      method="get"
      action="/outils"
      role="search"
      aria-label="Rechercher dans le catalogue"
      className="max-w-2xl"
      onSubmit={(event) => {
        if (!hydrated) return;
        event.preventDefault();
        onSubmit();
      }}
    >
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-ink-800">
        Rechercher un outil
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-400"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          name="q"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && value) {
              event.preventDefault();
              onClear();
            }
          }}
          placeholder="Ex. : image, voix, traduction…"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          maxLength={100}
          aria-describedby={hintId}
          className="h-14 w-full appearance-none rounded-2xl border-0 bg-white pr-14 pl-12 text-base text-ink-950 shadow-card ring-1 ring-ink-400 transition-shadow ring-inset placeholder:text-ink-500 hover:ring-ink-500 focus:ring-2 focus:ring-brand-600 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Effacer la recherche</span>
          </button>
        )}
      </div>
      <p id={hintId} className="mt-2 text-sm text-ink-500">
        Tapez le nom d'un outil, un usage ou un éditeur : la liste se met à jour pendant la saisie.
      </p>
    </Form>
  );
}
