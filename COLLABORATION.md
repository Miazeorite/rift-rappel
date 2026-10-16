# Travailler sur Rift Rappel

## Une seule fois, au début

1. Installer **GitHub Desktop** (déjà fait pour Mouette) et **Node.js** (version
   LTS, <https://nodejs.org>) pour pouvoir lancer l’app et les tests.
2. Dans GitHub Desktop : `File` > `Add local repository…` > choisir
   `Documents\GitHub\rift-rappel`. GitHub Desktop répond que ce n’est pas
   encore un dépôt : cliquer **create a repository**, garder le nom
   `rift-rappel`, `Create repository`. Le premier commit se fait tout seul.
3. Fait le 4 octobre : le dépôt est publié en **public** sur le compte Miazeorite
   (nécessaire pour le site gratuit GitHub Pages).

Pour quelqu’un d’autre : `File` > `Clone repository` > choisir `rift-rappel`.

## Chaque séance de travail

**Avant de commencer** : dans GitHub Desktop, `Fetch origin` puis `Pull origin`
s’il propose. Ça récupère le travail de l’autre.

**Quand on a fini** : une phrase dans `Summary` (par exemple « 10 questions de
niveau 4 en macro »), `Commit to main`, puis `Push origin`. Le site
https://miazeorite.github.io/rift-rappel/ se met à jour une à deux minutes après.

Si on oublie de pousser, l’autre ne voit rien. C’est la seule erreur qui coûte cher.

## La règle qui évite tous les problèmes

`src/data.js` (le contenu) et `src/app.js` (l’app) sont de gros fichiers. Deux
personnes peuvent y travailler en même temps tant qu’elles ne touchent pas aux
**mêmes lignes** : on se prévient si on réécrit un bloc entier (toutes les
questions d’un thème, l’accueil…).

`public/index.html` est généré : on ne le modifie jamais à la main, et en cas
de conflit on relance `npm run build`.

## Coder avec Claude

Dans l’application Claude, ouvrir le dossier `rift-rappel` et parler en
français. Claude lit `CLAUDE.md` en démarrant : il connaît le projet, ses règles
et les décisions déjà prises (`VISION.md`). Exemples :

- « Ajoute 10 questions de niveau 4 sur les objectifs » (il suit `CONTENU.md`)
- « Montre-moi l’accueil sur téléphone »
- « Récupère le travail » et « envoie mon travail » (il fait le git)
- « Lance le test »

Claude demande l’autorisation avant de modifier un fichier, et rien ne part sur
GitHub sans accord explicite.

## Plus tard : le lien en ligne et les vraies stats

Quand on voudra un vrai lien (et les vraies parties), suivre `README.md` ›
« Mettre en ligne ». Résumé :

1. Sur <https://vercel.com>, se connecter avec GitHub, importer `rift-rappel`.
2. Ajouter la variable `RIOT_API_KEY` (clé de <https://developer.riotgames.com>).
3. `Deploy`, puis demander à Claude de « brancher les vraies stats » (`PLAN.md`).

Tout est gratuit pour un usage personnel. La clé de développement expire toutes
les 24 heures : la remplacer dans Vercel > `Settings` > `Environment Variables`,
puis `Redeploy`.
