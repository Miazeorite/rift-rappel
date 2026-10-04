// Profil de démonstration : des parties fictives au format de l'API Riot,
// passées dans la même analyse que les vraies. Sert à tester sans clé d'API.
import { analyze } from "./riot.js";

function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

export function demoProfile() {
  const r = rng(42);
  const puuid = "demo-puuid";
  const champs = ["Ahri", "Ahri", "Orianna", "Viktor", "Ahri", "Syndra"];
  const foes = ["Zed", "Yasuo", "Vladimir", "Sylas", "Talon", "Akali", "Swain"];
  const allies = ["Garen", "LeeSin", "Jinx", "Thresh"];
  const enemyBase = ["Darius", "Vi", "Caitlyn", "Soraka"];
  const matches = [], timelines = {};
  for (let i = 0; i < 20; i++) {
    const dur = 1500 + Math.floor(r() * 900);
    const win = r() < 0.52;
    const id = "DEMO_" + i;
    const mid = foes[Math.floor(r() * foes.length)];
    const me = {
      participantId: 3, puuid, teamId: 100, win, championName: champs[i % champs.length], teamPosition: "MIDDLE",
      kills: 3 + Math.floor(r() * 8), deaths: 4 + Math.floor(r() * 6), assists: 3 + Math.floor(r() * 9),
      totalMinionsKilled: Math.floor((dur / 60) * (5.9 + r() * 0.8)), neutralMinionsKilled: Math.floor(r() * 12),
      visionScore: Math.floor((dur / 60) * (0.35 + r() * 0.15)), visionWardsBoughtInGame: r() < 0.4 ? 1 : 0,
      item0: 3089, item1: 3020, item2: 6655, item3: 0, item4: 0, item5: 0, item6: 3340,
      challenges: { controlWardsPlaced: r() < 0.4 ? 1 : 0, dragonTakedowns: Math.floor(r() * 2), baronTakedowns: r() < 0.3 ? 1 : 0, riftHeraldTakedowns: 0 },
    };
    const mk = (name, team, pos, pid) => ({ participantId: pid, puuid: "x" + pid, teamId: team, win: team === 100 ? win : !win, championName: name, teamPosition: pos, kills: Math.floor(r() * 8), deaths: Math.floor(r() * 7), assists: Math.floor(r() * 10), totalMinionsKilled: 150, neutralMinionsKilled: 0, visionScore: 20, challenges: {} });
    const participants = [
      mk(allies[0], 100, "TOP", 1), mk(allies[1], 100, "JUNGLE", 2), me, mk(allies[2], 100, "BOTTOM", 4), mk(allies[3], 100, "UTILITY", 5),
      mk(enemyBase[0], 200, "TOP", 6), mk(enemyBase[1], 200, "JUNGLE", 7), mk(mid, 200, "MIDDLE", 8), mk(enemyBase[2], 200, "BOTTOM", 9), mk(enemyBase[3], 200, "UTILITY", 10),
    ];
    matches.push({
      metadata: { matchId: id },
      info: { mapId: 11, queueId: 420, gameDuration: dur, participants,
        teams: [{ teamId: 100, objectives: { dragon: { kills: 2 + Math.floor(r() * 2) }, baron: { kills: r() < 0.5 ? 1 : 0 }, riftHerald: { kills: 1 } } }, { teamId: 200, objectives: {} }] },
    });
    if (i < 10) {
      const events = [];
      const n = 1 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) events.push({ type: "CHAMPION_KILL", victimId: 3, timestamp: 180000 + Math.floor(r() * 600000) });
      timelines[id] = { info: { frames: [{ events }] } };
    }
  }
  const data = analyze({
    account: { puuid, gameName: "Démo", tagLine: "RIFT" },
    summoner: { summonerLevel: 187, profileIconId: 29 },
    league: [{ queueType: "RANKED_SOLO_5x5", tier: "GOLD", rank: "II", leaguePoints: 47, wins: 61, losses: 58 }],
    matches, timelines, platform: "EUW1",
  });
  return { ...data, demo: true };
}
