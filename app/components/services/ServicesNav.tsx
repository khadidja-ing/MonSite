import type { Service } from "~/data/types";
import { getIcon } from "~/lib/icons";

/**
 * Sommaire de la page des services (grands écrans) : liens vers chaque
 * service et vers les sections suivantes de la page.
 */
export function ServicesNav({
  services,
  extraLinks = [],
}: {
  services: Service[];
  extraLinks?: { label: string; href: string }[];
}) {
  const linkClasses =
    "flex min-h-10 items-center gap-3 rounded-lg px-2.5 py-1.5 text-sm text-ink-700 transition-colors hover:bg-white hover:text-brand-700 hover:shadow-card";

  return (
    <nav aria-label="Sommaire des services" className="rounded-2xl bg-ink-50 p-3 ring-1 ring-ink-100">
      <p className="px-2.5 pt-1.5 pb-2 text-xs font-semibold tracking-wide text-ink-500 uppercase">
        Sur cette page
      </p>
      <ul className="space-y-0.5">
        {services.map((service) => {
          const Icon = getIcon(service.icon);
          return (
            <li key={service.slug}>
              <a href={`#${service.slug}`} className={linkClasses}>
                <Icon aria-hidden="true" className="size-4 shrink-0 text-ink-400" />
                <span>{service.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
      {extraLinks.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-ink-200/70 pt-2">
          {extraLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClasses}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
