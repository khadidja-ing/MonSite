/**
 * Étape exécutée après la construction du site (npm run build).
 *
 * 1. Crée la page 404.html : les hébergeurs (Netlify, Cloudflare Pages…)
 *    l'affichent automatiquement pour toute adresse inconnue.
 * 2. Crée le plan du site (sitemap.xml) pour les moteurs de recherche,
 *    uniquement si l'adresse du site (VITE_SITE_URL) est renseignée.
 */
import { copyFile, readdir, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const clientDir = new URL("../build/client/", import.meta.url).pathname;
const siteUrl = (process.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");

await copyFile(join(clientDir, "__spa-fallback.html"), join(clientDir, "404.html"));
console.log("Post-build : 404.html créé.");

async function findPages(dir) {
  const pages = [];
  for (const entry of await readdir(dir)) {
    const full = join(dir, entry);
    if ((await stat(full)).isDirectory()) {
      if (entry !== "assets") pages.push(...(await findPages(full)));
    } else if (entry === "index.html") {
      const rel = relative(clientDir, dir).split(sep).join("/");
      pages.push(rel ? `/${rel}` : "/");
    }
  }
  return pages;
}

if (siteUrl) {
  const pages = (await findPages(clientDir)).sort();
  const urls = pages.map((path) => `  <url><loc>${siteUrl}${path === "/" ? "/" : `${path}`}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  await writeFile(join(clientDir, "sitemap.xml"), xml);
  await writeFile(
    join(clientDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
  console.log(`Post-build : sitemap.xml créé (${pages.length} pages).`);
} else {
  console.log("Post-build : VITE_SITE_URL non renseignée, sitemap.xml non généré.");
}
