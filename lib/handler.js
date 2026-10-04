// Logique commune à Vercel (api/profile.js) et au serveur local (server.js).
import { fetchProfile, PLATFORMS, RiotError } from "./riot.js";
import { demoProfile } from "./demo.js";

const cache = new Map(); // évite de refaire 40 appels Riot si on recharge la page
const TTL = 5 * 60 * 1000;

export async function profileHandler(query, env) {
  try {
    if (query.demo === "1") return { status: 200, body: demoProfile() };

    const riotId = String(query.riotId || "").trim();
    const platform = String(query.platform || "").toUpperCase();
    const m = riotId.match(/^(.{3,16})#([A-Za-z0-9]{2,5})$/u);
    if (!m) return { status: 400, body: { error: "Riot ID attendu au format Pseudo#TAG (ex : Faker#KR1)." } };
    if (!PLATFORMS[platform]) return { status: 400, body: { error: "Région inconnue." } };
    const key = env.RIOT_API_KEY;
    if (!key) return { status: 503, body: { error: "Le serveur n’a pas de clé d’API Riot (variable RIOT_API_KEY). Essaie le profil de démonstration." } };

    const ck = `${platform}|${riotId.toLowerCase()}`;
    const hit = cache.get(ck);
    if (hit && Date.now() - hit.t < TTL && query.refresh !== "1") return { status: 200, body: hit.data };

    const data = await fetchProfile({ name: m[1].trim(), tag: m[2], platform, key });
    if (!data.games) return { status: 404, body: { error: "Aucune partie récente sur la Faille de l’invocateur trouvée pour ce compte." } };
    cache.set(ck, { t: Date.now(), data });
    return { status: 200, body: data };
  } catch (e) {
    if (e instanceof RiotError) {
      const msg = e.status === 404 ? "Ce Riot ID est introuvable dans cette région. Vérifie le pseudo, le #TAG et la région." : e.message;
      return { status: e.status, body: { error: msg } };
    }
    console.error(e);
    return { status: 500, body: { error: "Erreur inattendue du serveur." } };
  }
}
