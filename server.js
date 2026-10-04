// Serveur local, sans dépendance : `npm run dev` puis http://localhost:3000
// Lit la clé d'API dans le fichier .env (RIOT_API_KEY=...).
import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { profileHandler } from "./lib/handler.js";

const root = fileURLToPath(new URL("./public/", import.meta.url));
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/manifest+json" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/profile") {
    const { status, body } = await profileHandler(Object.fromEntries(url.searchParams), process.env);
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(JSON.stringify(body));
  }
  const path = normalize(join(root, url.pathname === "/" ? "index.html" : url.pathname));
  if (!path.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(path);
    res.writeHead(200, { "Content-Type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(data);
  } catch { res.writeHead(404); res.end("Introuvable"); }
}).listen(process.env.PORT || 3000, () => {
  console.log(`Rift Rappel : http://localhost:${process.env.PORT || 3000}`);
  if (!process.env.RIOT_API_KEY) console.log("Pas de RIOT_API_KEY : seul le profil de démonstration fonctionnera.");
});
