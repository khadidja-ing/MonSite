import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { NavLink, useLocation } from "react-router";
import { canReceiveMessages, mainNav } from "~/config/site";
import { cn } from "~/lib/cn";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { Logo } from "./Logo";

/**
 * Lien actif : couleur + soulignement (l'information ne repose pas
 * uniquement sur la couleur).
 */
const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors",
    isActive
      ? "text-brand-700 underline decoration-2 underline-offset-8"
      : "text-ink-700 hover:bg-ink-50 hover:text-ink-950",
  );

/** Libellé du bouton de contact : neutre tant qu'aucun message ne peut être reçu. */
const contactLabel = canReceiveMessages ? "Nous contacter" : "Contact";

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // « page » uniquement pour la page exacte ; « true » pour une sous-page
  // de la rubrique (ex. une fiche outil dans « Explorer les outils »).
  const ariaCurrent = (to: string) => (location.pathname === to ? "page" : "true");

  // Referme le menu mobile après un changement de page (y compris avec
  // les boutons Précédent / Suivant du navigateur).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Touche Échap : referme le menu et replace le focus sur le bouton.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Referme le menu quand le focus clavier quitte l'en-tête, pour ne pas
  // laisser le menu masquer l'élément qui reçoit le focus.
  const closeWhenFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  };

  // Referme le menu dès qu'un lien est suivi, même vers la page courante.
  const closeOnLinkClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  };

  return (
    <header
      onBlur={closeWhenFocusLeaves}
      onClick={closeOnLinkClick}
      className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClasses} aria-current={ariaCurrent(item.to)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink to="/contact" size="sm" className="max-sm:hidden">
            {contactLabel}
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl text-ink-800 hover:bg-ink-50 lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          </button>
        </div>
      </Container>

      <div
        id={menuId}
        hidden={!open}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-ink-100 bg-white lg:hidden"
      >
        <Container className="py-4">
          <nav aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    aria-current={ariaCurrent(item.to)}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-4 py-3 text-base font-medium",
                        isActive ? "bg-brand-50 text-brand-700" : "text-ink-800 hover:bg-ink-50",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ButtonLink to="/contact" className="mt-4 w-full">
            {contactLabel}
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
