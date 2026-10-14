import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { mainNav } from "~/config/site";
import { cn } from "~/lib/cn";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Container";
import { Logo } from "./Logo";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "text-brand-700" : "text-ink-700 hover:bg-ink-50 hover:text-ink-950",
  );

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Referme le menu mobile après un changement de page.
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

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClasses}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink to="/contact" size="sm" className="hidden sm:inline-flex">
            Nous contacter
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

      <div id={menuId} hidden={!open} className="border-t border-ink-100 bg-white lg:hidden">
        <Container className="py-4">
          <nav aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
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
            Nous contacter
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
