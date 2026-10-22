import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/cn";

/** Style des liens placés dans un texte courant (souligné discret, bien lisible). */
export const textLinkClasses =
  "rounded-sm font-medium text-brand-700 underline decoration-brand-200 underline-offset-2 transition-colors hover:text-brand-800 hover:decoration-brand-700";

/** Lien interne dans un paragraphe. */
export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cn(textLinkClasses, className)} {...props} />;
}

/** Lien « mailto: » vers une adresse e-mail, affichée telle quelle. */
export function MailtoLink({ email, className }: { email: string; className?: string }) {
  return (
    <a href={`mailto:${email}`} className={cn(textLinkClasses, className)}>
      {email}
    </a>
  );
}

/** Lien vers un site externe dans un paragraphe, ouvert dans un nouvel onglet. */
export function ExternalTextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(textLinkClasses, "inline-flex items-baseline gap-0.5", className)}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 self-center" />
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );
}
