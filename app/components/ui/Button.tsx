import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800",
  secondary:
    "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 shadow-sm hover:bg-ink-50 hover:ring-ink-300",
  ghost: "text-brand-700 hover:bg-brand-50",
  inverse: "bg-white text-ink-950 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

/** Bouton d'action (envoi de formulaire, ouverture d'un menu…). */
export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: CommonProps & ComponentProps<"button">) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

/** Lien interne qui a l'apparence d'un bouton. */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

/** Lien vers un site externe, ouvert dans un nouvel onglet. */
export function ExternalButtonLink({
  variant,
  size,
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentProps<"a"> & { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {children}
      <span className="sr-only"> (s'ouvre dans un nouvel onglet)</span>
    </a>
  );
}
