import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import { useEffect, useRef, useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { NotFoundContent } from "./components/layout/NotFoundContent";
import { ButtonLink } from "./components/ui/Button";
import { Container } from "./components/ui/Container";
import { siteConfig } from "./config/site";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
];

/** Structure HTML commune à toutes les pages. */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="sr-only z-50 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Accessibilité des changements de page : place le focus au début du
 * contenu et annonce le titre de la nouvelle page aux lecteurs d'écran.
 * Les changements de filtres (même adresse, paramètres différents) et les
 * liens vers une ancre (#…) ne sont pas concernés.
 */
function RouteAnnouncer() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (hash) return;
    document.getElementById("contenu")?.focus({ preventScroll: true });
    // Laisse le temps au nouveau titre de la page d'être appliqué.
    const frame = requestAnimationFrame(() => setMessage(`Page chargée : ${document.title}`));
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <p role="status" aria-live="polite" className="sr-only">
      {message}
    </p>
  );
}

export default function App() {
  return (
    <>
      <RouteAnnouncer />
      <Outlet />
    </>
  );
}

/** Page affichée en cas d'erreur (page introuvable ou problème inattendu). */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundContent />;
  }

  let details: string | undefined;
  if (import.meta.env.DEV && error instanceof Error) {
    details = error.stack ?? error.message;
  }

  return (
    <Container className="py-24">
      <p className="text-sm font-semibold text-brand-700">Erreur</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Une erreur inattendue est survenue</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-600">
        Nous sommes désolés. Vous pouvez recharger la page ou revenir à l'accueil.
      </p>
      <ButtonLink to="/" className="mt-8">
        Retour à l'accueil
      </ButtonLink>
      {details && (
        <pre className="mt-8 overflow-x-auto rounded-xl bg-ink-950 p-4 text-xs text-ink-100">
          <code>{details}</code>
        </pre>
      )}
    </Container>
  );
}
