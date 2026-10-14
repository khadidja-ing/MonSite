import { Link } from "react-router";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/cn";

/** Symbole du logo : une aiguille de boussole stylisée. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" className="fill-brand-600" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
      <path d="M16 6.5 19 16h-6z" fill="white" />
      <path d="M16 25.5 13 16h6z" className="fill-accent-200" />
      <circle cx="16" cy="16" r="1.6" className="fill-brand-600" />
    </svg>
  );
}

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-center gap-2.5 rounded-lg", className)}
      aria-label={`${siteConfig.name} — retour à l'accueil`}
    >
      <LogoMark />
      <span
        className={cn(
          "font-display text-lg font-bold tracking-tight",
          inverse ? "text-white" : "text-ink-950",
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
