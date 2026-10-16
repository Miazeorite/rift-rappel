// Assemble src/ en une seule page : public/index.html
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const src = (f) => readFileSync(new URL(`./src/${f}`, import.meta.url), "utf8");
const head = src("head.html");
const title = head.match(/<title>.*?<\/title>/)[0];
const rest = head.replace(title, "");
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0A101B">
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="Apprendre League of Legends par la récupération en mémoire.">
${title}
<style>body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}img{max-width:100%}</style>
</head>
<body>
${rest}
${src("data.js")}
${src("icons.js")}
${src("app.js")}
</body>
</html>
`;
mkdirSync(new URL("./public/", import.meta.url), { recursive: true });
writeFileSync(new URL("./public/index.html", import.meta.url), html);
// copie à la racine : GitHub Pages sert le site depuis la racine du dépôt
writeFileSync(new URL("./index.html", import.meta.url), html);
writeFileSync(new URL("./.nojekyll", import.meta.url), "");
console.log("public/index.html et index.html générés");
