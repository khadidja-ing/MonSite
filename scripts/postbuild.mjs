/**
 * Étape exécutée après la construction du site (npm run build).
 *
 * 1. Crée la page 404.html : les hébergeurs (Netlify, Cloudflare Pages…)
 *    l'affichent automatiquement pour toute adresse inconnue.
 * 2. Crée le plan du site (sitemap.xml) pour les moteurs de recherche,
 *    uniquement si l'adresse du site (VITE_SITE_URL) est renseignée.
 * 3. Affiche un avertissement si aucun moyen de contact n'est configuré.
 */
import { readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const clientDir = fileURLToPath(new URL("../build/client/", import.meta.url));

// Lit les réglages comme Vite (variables d'environnement, puis fichiers .env).
const env = loadEnv("production", projectRoot, "VITE_");
const siteUrl = (env.VITE_SITE_URL ?? "").trim().replace(/\/+$/, "");
const formEndpoint = (env.VITE_CONTACT_FORM_ENDPOINT ?? "").trim();

/* ---------- 0. Publication dans un sous-dossier (ex. GitHub Pages) ---------- */

// Avec BASE_PATH="/MonSite/", les pages sont générées dans build/client/MonSite/
// alors que les fichiers communs (assets…) sont dans build/client/. On remet
// tout au même niveau : l'hébergeur publie build/client à l'adresse /MonSite/.
const basePath = (process.env.BASE_PATH || "/").replace(/^\/+|\/+$/g, "");
if (basePath) {
  const nested = join(clientDir, ...basePath.split("/"));
  const exists = await stat(nested).then(() => true, () => false);
  if (exists) {
    // À la racine se trouve la page de secours : on lui donne son nom habituel.
    await rename(join(clientDir, "index.html"), join(clientDir, "__spa-fallback.html")).catch(() => {});
    for (const entry of await readdir(nested)) {
      await rename(join(nested, entry), join(clientDir, entry));
    }
    await rm(join(clientDir, basePath.split("/")[0]), { recursive: true, force: true });
    console.log(`Post-build : pages remises à la racine (publication sous /${basePath}/).`);
  }
}

/* ---------- 1. Page 404 ---------- */

// La page de secours sert de page 404 : elle affiche « Page introuvable »
// une fois le site chargé. On lui ajoute un titre et l'interdiction
// d'indexation pour qu'elle soit correcte même avant ce chargement.
const fallback = join(clientDir, "__spa-fallback.html");
let html = await readFile(fallback, "utf8");
if (!html.includes("<title>")) {
  html = html.replace(
    "</head>",
    '<title>Page introuvable</title><meta name="robots" content="noindex"/></head>',
  );
}
await writeFile(join(clientDir, "404.html"), html);
console.log("Post-build : 404.html créé.");

/* ---------- 2. Plan du site ---------- */

async function findPages(dir) {
  const pages = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) {
      if (entry !== "assets") pages.push(...(await findPages(full)));
    } else if (entry === "index.html") {
      const rel = relative(clientDir, dir).split(sep).join("/");
      // Chaque page est publiée sous la forme dossier/index.html :
      // son adresse définitive se termine donc par « / ».
      pages.push(rel ? `/${rel}/` : "/");
    }
  }
  return pages;
}

if (siteUrl) {
  const pages = (await findPages(clientDir)).sort();
  const urls = pages.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  await writeFile(join(clientDir, "sitemap.xml"), xml);
  await writeFile(join(clientDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log(`Post-build : sitemap.xml créé (${pages.length} pages).`);
} else {
  console.log("Post-build : VITE_SITE_URL non renseignée, sitemap.xml non généré.");
}

/* ---------- 3. Vérification du moyen de contact ---------- */

const siteConfigSource = await readFile(join(projectRoot, "app/config/site.ts"), "utf8");
const hasEmail = /email:\s*"[^"]+"/.test(siteConfigSource);
if (!formEndpoint && !hasEmail) {
  console.warn(
    "\n⚠️  Post-build : aucun moyen de contact n'est configuré (ni VITE_CONTACT_FORM_ENDPOINT, ni e-mail dans app/config/site.ts).\n" +
      "    Le site l'indique honnêtement aux visiteurs, mais il faut en configurer un avant la mise en ligne.\n",
  );
}
