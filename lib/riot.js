// Accès à l'API Riot et analyse des parties.
// La clé d'API ne quitte jamais le serveur : ce fichier n'est exécuté que côté serveur.

export const PLATFORMS = {
  EUW1: "europe", EUN1: "europe", TR1: "europe", RU: "europe", ME1: "europe",
  NA1: "americas", BR1: "americas", LA1: "americas", LA2: "americas",
  KR: "asia", JP1: "asia",
  OC1: "sea", SG2: "sea", TW2: "sea", VN2: "sea",
};
// account-v1 n'existe que sur americas / asia / europe
const accountRegion = (r) => (r === "sea" ? "asia" : r);

const SUMMONERS_RIFT_QUEUES = new Set([400, 420, 430, 440, 490]);
const TIERS = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
const TIERS_FR = ["Fer", "Bronze", "Argent", "Or", "Platine", "Émeraude", "Diamant", "Maître", "Grand Maître", "Challenger"];
const DIVS = ["IV", "III", "II", "I"];
const ROLE_FR = { TOP: "Top", JUNGLE: "Jungle", MIDDLE: "Mid", BOTTOM: "ADC", UTILITY: "Support" };

// Champions qui se soignent beaucoup (ou soignent leur équipe)
const HEALERS = new Set(["Soraka", "Aatrox", "Vladimir", "Yuumi", "Sona", "Nami", "Warwick", "DrMundo", "Swain", "Illaoi", "Briar", "Sylas", "Fiddlesticks", "Senna", "Seraphine", "Renata", "Milio", "Olaf", "Kayn", "Maokai", "Zac", "Volibear"]);
// Objets d'anti-soin (composants inclus)
const ANTIHEAL_ITEMS = new Set([3123, 3033, 6609, 3165, 3916, 3076, 3075, 3011]);

export class RiotError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function riotGet(url, key, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { "X-Riot-Token": key } });
    if (res.ok) return res.json();
    if (res.status === 429 && i < tries - 1) {
      const wait = Math.min(Number(res.headers.get("retry-after") || 2), 10);
      await sleep(wait * 1000);
      continue;
    }
    if (res.status === 404) throw new RiotError(404, "Compte ou donnée introuvable.");
    if (res.status === 401 || res.status === 403) throw new RiotError(502, "Clé d’API Riot invalide ou expirée (les clés de développement expirent toutes les 24 h).");
    if (res.status === 429) throw new RiotError(429, "Trop de requêtes vers Riot. Réessaie dans deux minutes.");
    throw new RiotError(502, `Erreur Riot (${res.status}).`);
  }
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      try { out[i] = await fn(items[i]); } catch (e) { if (e.status === 502 && /Clé/.test(e.message)) throw e; out[i] = null; }
    }
  }));
  return out;
}

export async function fetchProfile({ name, tag, platform, key, count = 20 }) {
  const region = PLATFORMS[platform];
  if (!region) throw new RiotError(400, "Région inconnue.");
  const p = platform.toLowerCase();
  const acc = await riotGet(`https://${accountRegion(region)}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, key);
  const puuid = acc.puuid;
  const [summoner, league] = await Promise.all([
    riotGet(`https://${p}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, key).catch(() => null),
    riotGet(`https://${p}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`, key).catch(() => []),
  ]);
  const base = `https://${region}.api.riotgames.com/lol/match/v5/matches`;
  let ids = await riotGet(`${base}/by-puuid/${puuid}/ids?queue=420&start=0&count=${count}`, key);
  if (ids.length < 8) ids = await riotGet(`${base}/by-puuid/${puuid}/ids?start=0&count=${count}`, key);
  let matches = (await pool(ids, 5, (id) => riotGet(`${base}/${id}`, key))).filter(Boolean)
    .filter((m) => m.info && m.info.mapId === 11 && SUMMONERS_RIFT_QUEUES.has(m.info.queueId) && m.info.gameDuration > 600);
  // Timelines (morts avant 14 min) sur les 10 parties les plus récentes
  const tl = await pool(matches.slice(0, 10), 5, (m) => riotGet(`${base}/${m.metadata.matchId}/timeline`, key));
  const timelines = {};
  matches.slice(0, 10).forEach((m, i) => { if (tl[i]) timelines[m.metadata.matchId] = tl[i]; });
  return analyze({ account: acc, summoner, league, matches, timelines, platform });
}

/* ------------------------------------------------------------------ */
/*  ANALYSE                                                           */
/* ------------------------------------------------------------------ */
const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pick = (arr, i) => arr[clamp(i, 0, arr.length - 1)];

// Repères par rang (index 0 = Fer … 9 = Challenger). Ordres de grandeur, pas des vérités.
const T = {
  csm:      [4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.3, 7.8, 8.0, 8.3],
  vpmSup:   [1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.7, 2.8],
  vpm:      [0.40, 0.50, 0.55, 0.60, 0.70, 0.80, 0.90, 1.00, 1.05, 1.10],
  cwSup:    [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.0, 4.5, 4.5],
  cw:       [0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.8, 2.0],
  deaths:   [8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.8, 4.5, 4.3],
  early:    [2.5, 2.2, 2.0, 1.8, 1.6, 1.4, 1.2, 1.1, 1.0, 0.9],
  kp:       [0.45, 0.47, 0.49, 0.51, 0.53, 0.55, 0.57, 0.58, 0.59, 0.60],
  objp:     [0.45, 0.48, 0.51, 0.54, 0.57, 0.60, 0.63, 0.66, 0.68, 0.70],
};

// Quels thèmes chaque indicateur alimente
const MAP = {
  csm:      { eco: 1.0, lane: 0.6 },
  vpm:      { map: 1.0, macro: 0.3 },
  cw:       { map: 0.7, item: 0.2 },
  deaths:   { mu: 0.6, lane: 0.5, macro: 0.4 },
  early:    { lane: 1.0, mu: 0.8 },
  kp:       { macro: 0.7 },
  objp:     { obj: 1.0, macro: 0.6 },
  antiheal: { item: 1.0, mu: 0.4 },
};
const CATS = ["voc", "map", "lane", "champ", "item", "eco", "obj", "rune", "mu", "macro"];

function rankRating(rank, level) {
  if (!rank) return level && level < 30 ? 400 : 900;
  const i = rank.tierIndex;
  if (i >= 9) return 3400 + Math.min(Math.round(rank.lp / 5), 300);
  if (i === 8) return 3100 + Math.min(rank.lp, 299);
  if (i === 7) return 2800 + Math.min(rank.lp, 299);
  return i * 400 + DIVS.indexOf(rank.division) * 100 + Math.min(rank.lp, 99);
}

export function analyze({ account, summoner, league, matches, timelines = {}, platform }) {
  const solo = (league || []).find((e) => e.queueType === "RANKED_SOLO_5x5") || (league || []).find((e) => e.queueType === "RANKED_FLEX_SR");
  const rank = solo ? {
    queue: solo.queueType === "RANKED_SOLO_5x5" ? "Solo/Duo" : "Flex",
    tier: solo.tier, tierIndex: TIERS.indexOf(solo.tier), tierFr: TIERS_FR[TIERS.indexOf(solo.tier)],
    division: solo.tier === "MASTER" || solo.tier === "GRANDMASTER" || solo.tier === "CHALLENGER" ? "" : solo.rank,
    lp: solo.leaguePoints, wins: solo.wins, losses: solo.losses,
  } : null;
  const ti = rank ? rank.tierIndex : 2; // Argent par défaut pour les repères

  const rows = [];
  const champs = {};
  const vs = {};
  const roles = {};
  for (const m of matches) {
    const info = m.info;
    const me = info.participants.find((x) => x.puuid === account.puuid);
    if (!me) continue;
    const min = info.gameDuration / 60;
    const team = info.participants.filter((x) => x.teamId === me.teamId);
    const enemies = info.participants.filter((x) => x.teamId !== me.teamId);
    const teamKills = team.reduce((s, x) => s + x.kills, 0);
    const ch = me.challenges || {};
    const tObj = (info.teams.find((t) => t.teamId === me.teamId) || {}).objectives || {};
    const teamObj = ((tObj.dragon || {}).kills || 0) + ((tObj.baron || {}).kills || 0) + ((tObj.riftHerald || {}).kills || 0);
    const myObj = (ch.dragonTakedowns || 0) + (ch.baronTakedowns || 0) + (ch.riftHeraldTakedowns || 0);
    const items = [me.item0, me.item1, me.item2, me.item3, me.item4, me.item5, me.item6];
    const healers = enemies.filter((x) => HEALERS.has(x.championName)).length;
    let early = null;
    const tl = timelines[m.metadata.matchId];
    if (tl) {
      early = 0;
      for (const f of tl.info.frames) for (const e of f.events || []) {
        if (e.type === "CHAMPION_KILL" && e.victimId === me.participantId && e.timestamp < 14 * 60000) early++;
      }
    }
    const role = me.teamPosition || me.individualPosition || "";
    roles[role] = (roles[role] || 0) + 1;
    rows.push({
      win: me.win, role,
      csm: (me.totalMinionsKilled + me.neutralMinionsKilled) / min,
      vpm: me.visionScore / min,
      cw: ch.controlWardsPlaced ?? me.visionWardsBoughtInGame ?? 0,
      deaths: me.deaths,
      kp: teamKills ? (me.kills + me.assists) / teamKills : 0,
      objp: teamObj ? myObj / teamObj : null,
      early,
      healers, antiheal: items.some((id) => ANTIHEAL_ITEMS.has(id)),
    });
    const c = (champs[me.championName] ||= { name: me.championName, games: 0, wins: 0, k: 0, d: 0, a: 0 });
    c.games++; if (me.win) c.wins++; c.k += me.kills; c.d += me.deaths; c.a += me.assists;
    const opp = enemies.find((x) => x.teamPosition && x.teamPosition === me.teamPosition);
    if (opp) {
      const key = me.championName + "|" + opp.championName;
      const v = (vs[key] ||= { champ: me.championName, vs: opp.championName, games: 0, losses: 0 });
      v.games++; if (!me.win) v.losses++;
    }
  }

  const n = rows.length;
  const mainRole = Object.entries(roles).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const isSup = mainRole === "UTILITY", isJgl = mainRole === "JUNGLE";
  const val = {
    csm: avg(rows.map((r) => r.csm)),
    vpm: avg(rows.map((r) => r.vpm)),
    cw: avg(rows.map((r) => r.cw)),
    deaths: avg(rows.map((r) => r.deaths)),
    early: avg(rows.filter((r) => r.early != null).map((r) => r.early)),
    kp: avg(rows.map((r) => r.kp)),
    objp: avg(rows.filter((r) => r.objp != null).map((r) => r.objp)),
  };
  const ahGames = rows.filter((r) => r.healers >= 2);
  const ahMissing = ahGames.filter((r) => !r.antiheal).length;

  const target = {
    csm: pick(T.csm, ti) - (isJgl ? 0.8 : 0),
    vpm: pick(isSup ? T.vpmSup : T.vpm, ti) + (isJgl ? 0.1 : 0),
    cw: pick(isSup ? T.cwSup : T.cw, ti),
    deaths: pick(T.deaths, ti) + (isSup ? 0.5 : 0),
    early: pick(T.early, ti),
    kp: pick(T.kp, ti) + (isSup || isJgl ? 0.08 : 0),
    objp: pick(T.objp, ti),
  };
  const lowerIsBetter = { deaths: true, early: true };

  // ratio > 1 = mieux que le repère
  const ratio = {};
  for (const k of Object.keys(target)) {
    if (val[k] == null) continue;
    if (k === "csm" && isSup) continue; // le support ne farme pas
    ratio[k] = lowerIsBetter[k] ? target[k] / Math.max(val[k], 0.1) : val[k] / Math.max(target[k], 0.01);
  }
  if (ahGames.length >= 2) ratio.antiheal = (ahGames.length - ahMissing) / ahGames.length / 0.5;

  const deficit = {};
  const weights = Object.fromEntries(CATS.map((c) => [c, 1]));
  const catScore = Object.fromEntries(CATS.map((c) => [c, 0]));
  for (const [k, r] of Object.entries(ratio)) {
    const d = clamp(1 - r, 0, 1);
    const s = clamp(r - 1, 0, 0.5);
    deficit[k] = d;
    for (const [c, w] of Object.entries(MAP[k])) {
      weights[c] += 2.5 * d * w;
      catScore[c] += (s - d * 1.5) * w;
    }
  }
  for (const c of CATS) weights[c] = Math.round(Math.min(weights[c], 4) * 100) / 100;

  const base = rankRating(rank, summoner?.summonerLevel);
  const seed = Object.fromEntries(CATS.map((c) => [c, Math.max(0, Math.round(base + clamp(catScore[c], -1, 0.5) * 300))]));

  const f1 = (x) => x.toFixed(1).replace(".", ",");
  const pct = (x) => Math.round(x * 100) + " %";
  const tierName = rank ? rank.tierFr : "ton niveau";
  const TXT = {
    csm: { cat: "eco", weak: "Farm en dessous de ton rang", strong: "Farm solide", detail: () => `${f1(val.csm)} CS/min en moyenne, repère autour de ${f1(target.csm)} en ${tierName}.` },
    vpm: { cat: "map", weak: "Vision faible", strong: "Bonne vision", detail: () => `Score de vision de ${f1(val.vpm)} par minute, repère autour de ${f1(target.vpm)}.` },
    cw: { cat: "map", weak: "Peu de balises de contrôle", strong: "Balises de contrôle régulières", detail: () => `${f1(val.cw)} balise(s) de contrôle posée(s) par partie, repère autour de ${f1(target.cw)}.` },
    deaths: { cat: "mu", weak: "Trop de morts", strong: "Peu de morts", detail: () => `${f1(val.deaths)} morts par partie, repère sous ${f1(target.deaths)}.` },
    early: { cat: "lane", weak: "Morts en début de partie", strong: "Phase de lane sûre", detail: () => `${f1(val.early)} mort(s) avant 14 min par partie, repère sous ${f1(target.early)}.` },
    kp: { cat: "macro", weak: "Peu présent dans les combats", strong: "Très présent dans les combats", detail: () => `Participation aux kills de ${pct(val.kp)}, repère autour de ${pct(target.kp)}.` },
    objp: { cat: "obj", weak: "Peu présent sur les objectifs", strong: "Présent sur les objectifs", detail: () => `Tu participes à ${pct(val.objp)} des dragons, Nashor et Hérauts de ton équipe, repère autour de ${pct(target.objp)}.` },
    antiheal: { cat: "item", weak: "Pas d’anti-soin face aux soigneurs", strong: "Anti-soin acheté au bon moment", detail: () => `Face à 2 soigneurs ou plus, pas d’anti-soin dans ${ahMissing} partie(s) sur ${ahGames.length}.` },
  };
  const insights = [];
  for (const [k, r] of Object.entries(ratio)) {
    if (r < 0.9) insights.push({ key: k, kind: "weak", cat: TXT[k].cat, title: TXT[k].weak, detail: TXT[k].detail(), score: 1 - r });
    else if (r >= 1.15) insights.push({ key: k, kind: "strong", cat: TXT[k].cat, title: TXT[k].strong, detail: TXT[k].detail(), score: r - 1 });
  }
  insights.sort((a, b) => (a.kind === b.kind ? b.score - a.score : a.kind === "weak" ? -1 : 1));

  const champions = Object.values(champs).sort((a, b) => b.games - a.games).slice(0, 5)
    .map((c) => ({ name: c.name, games: c.games, wins: c.wins, kda: c.d ? (c.k + c.a) / c.d : c.k + c.a }));
  const matchups = Object.values(vs).filter((v) => v.losses >= 2).sort((a, b) => b.losses - a.losses).slice(0, 3);

  return {
    riotId: `${account.gameName}#${account.tagLine}`,
    gameName: account.gameName, platform,
    level: summoner?.summonerLevel ?? null, iconId: summoner?.profileIconId ?? null,
    rank, games: n, winrate: n ? rows.filter((r) => r.win).length / n : null,
    role: ROLE_FR[mainRole] || null,
    values: val, targets: target, insights, weights, seed, champions, matchups,
    fetchedAt: new Date().toISOString(),
  };
}
