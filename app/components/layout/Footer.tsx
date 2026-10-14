import { Link } from "react-router";
import { legalNav, mainNav, siteConfig } from "~/config/site";
import { categories } from "~/data/categories";
import { Container } from "../ui/Container";
import { Logo } from "./Logo";

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-ink-300 hover:text-white hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const topCategories = categories.slice(0, 6).map((category) => ({
    label: category.shortName,
    to: `/categories/${category.slug}`,
  }));

  return (
    <footer className="bg-ink-950 text-ink-300">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="col-span-2 max-w-sm lg:col-span-1">
            <Logo inverse />
            <p className="mt-4 text-sm leading-relaxed">{siteConfig.description}</p>
            <div className="mt-5 text-sm">
              {siteConfig.contact.email ? (
                <a href={`mailto:${siteConfig.contact.email}`} className="text-white hover:underline">
                  {siteConfig.contact.email}
                </a>
              ) : (
                <Link to="/contact" className="text-white hover:underline">
                  Écrire via le formulaire de contact
                </Link>
              )}
            </div>
          </div>
          <FooterColumn title="Plateforme" links={[...mainNav, { label: "Contact", to: "/contact" }]} />
          <FooterColumn title="Catégories populaires" links={topCategories} />
          <FooterColumn title="Informations légales" links={legalNav} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-800 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {siteConfig.legal.lastUpdated.slice(0, 4)} {siteConfig.name}
            {siteConfig.isNameProvisional ? " (nom provisoire)" : ""}.
          </p>
          <p>
            Les noms d'outils cités appartiennent à leurs éditeurs respectifs. Les informations sont
            fournies à titre indicatif.
          </p>
        </div>
      </Container>
    </footer>
  );
}
