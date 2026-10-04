// Vérifie l'analyse sur le profil de démonstration et la syntaxe de la page.
// `npm test` doit afficher VERDICT : OK avant tout push.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { demoProfile } from "./lib/demo.js";
import { profileHandler } from "./lib/handler.js";

const d = demoProfile();
assert.equal(d.games, 20, "20 parties analysées");
assert.equal(d.role, "Mid");
assert.ok(d.rank && d.rank.tierFr === "Or");
for (const c of ["voc", "map", "lane", "champ", "item", "eco", "obj", "rune", "mu", "macro"]) {
  assert.ok(d.weights[c] >= 1 && d.weights[c] <= 4, `poids ${c}`);
  assert.ok(Number.isFinite(d.seed[c]) && d.seed[c] >= 0, `rang de départ ${c}`);
}
assert.ok(d.insights.some((i) => i.kind === "weak"), "au moins un point faible");

const bad = await profileHandler({ riotId: "sans-tag", platform: "EUW1" }, {});
assert.equal(bad.status, 400);
const nokey = await profileHandler({ riotId: "Test#EUW", platform: "EUW1" }, {});
assert.equal(nokey.status, 503);

// La page se compile (les scripts inline)
const html = readFileSync(new URL("./public/index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n");
new vm.Script(scripts);

console.log("VERDICT : OK");
