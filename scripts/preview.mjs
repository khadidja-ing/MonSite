/**
 * Affiche le site construit (dossier build/client) sur http://localhost:4173,
 * comme le ferait un hébergeur de fichiers statiques :
 * - /outils sert build/client/outils/index.html ;
 * - une adresse inconnue renvoie la page 404.html (statut 404).
 * Sans dépendance : utilise uniquement Node.js.
 */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../build/client/", import.meta.url));
const port = Number(process.env.PORT ?? 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(/^([/\\])+/, "");
  const candidate = join(root, safe);
  // Interdit de sortir du dossier du site (ex. /../../secret).
  if (!candidate.startsWith(root)) return null;
  for (const path of [candidate, join(candidate, "index.html")]) {
    try {
      if ((await stat(path)).isFile()) return path;
    } catch {
      // essaie la possibilité suivante
    }
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = await resolveFile(pathname).catch(() => null);
  const status = file ? 200 : 404;
  const path = file ?? join(root, "404.html");
  res.writeHead(status, { "Content-Type": types[extname(path)] ?? "application/octet-stream" });
  createReadStream(path).pipe(res);
}).listen(port, () => {
  console.log(`Site construit disponible sur http://localhost:${port} (Ctrl+C pour arrêter)`);
});
