# Rift Rappel

App web en français pour apprendre League of Legends par la récupération en
mémoire. Une seule page (`public/index.html`, assemblée depuis `src/`) et une
fonction serveur Vercel (`api/profile.js`) pour l’API Riot, pas encore branchée.
Lire `VISION.md` pour le pourquoi, `PLAN.md` pour l’état, `COLLABORATION.md`
pour le travail avec GitHub Desktop.

## Lancer et tester

```sh
npm run build   # src/ -> public/index.html (à relancer après chaque modif de src/)
npm run dev     # http://localhost:3000 ; lit RIOT_API_KEY dans .env si présent
npm test        # doit afficher VERDICT : OK avant tout push
```

Pas de dépendance npm : Node 18+ suffit (fetch natif). Garder ça comme ça.

## Le parcours actuel

Bienvenue → nom d’invocateur → accueil. Pas de question avant l’accueil :
c’est une demande de Marie. Le nom génère des **données d’exemple**
(`fakeProfile`, même nom = même profil), signalées « Données d’exemple » dans
l’app. `USE_RIOT_API = false` dans `src/app.js` : la connexion Riot existe
(`fetchRiot`, `acctForm`, `renderLink`) mais n’est pas montrée.

## Les règles du projet

**On modifie `src/`, jamais `public/index.html` à la main.** Il est régénéré
par `build.js`. Committer les deux.

**La clé Riot reste côté serveur.** `process.env.RIOT_API_KEY` (Vercel) ou
`.env` (local). Jamais dans le code, dans `src/`, dans un commit ou dans un
message. `.env` est dans `.gitignore`.

**Le contenu suit `CONTENU.md`.** Bonne réponse en premier, fausses réponses
crédibles et de même longueur, une seule réponse défendable. Mettre à jour le
tableau des thèmes de `CONTENU.md` quand on ajoute des questions.

**Les décisions de `VISION.md` §3 ne se changent pas sans Marie** (questions
fines, rang par thème, accueil avant les questions, accueil complet).

**Le style suit `DA.md`.** Couleurs uniquement via les jetons de `:root`, pas
d’émoji, pas de visuel Riot, mobile d’abord (400 px).

**La progression est dans `localStorage`** (clé `rift-rappel-v1`, objet `S`).
Toute nouvelle donnée s’ajoute dans `blank()` pour que les anciennes
sauvegardes restent lisibles. Ne jamais renommer la clé sans migration.

**Limites de l’API Riot** : clé de développement = 20 requêtes/s et 100 par
2 min. Une analyse coûte environ 45 requêtes : ne pas augmenter le nombre de
parties sans clé de production.

**Textes en français avec accents**, apostrophes typographiques (’) dans les
chaînes affichées. Commentaires en français.

## La carte des fichiers

| Fichier | Rôle |
| --- | --- |
| `src/data.js` | thèmes (`CATS`), parcours (`PATH`), questions (`Q`), fiches (`LESSONS`), mises en situation (`SCENARIOS`), lexique |
| `src/app.js` | toute l’app, par blocs : profils de guidage (`TIERS`), stockage, classement par thème, onboarding, séances, fiches, mini-carte, mises en situation, accueil, données d’exemple, compte Riot, actions |
| `src/head.html` | titre, polices, styles (jetons de `DA.md`) |
| `build.js` | assemble `src/` en `public/index.html` |
| `api/profile.js` | fonction Vercel `GET /api/profile?riotId=…&platform=…` |
| `lib/riot.js` | appels Riot (compte, rang, 20 parties, 10 timelines) et `analyze` |
| `lib/handler.js` | validation, cache 5 min, messages d’erreur |
| `lib/demo.js` | fausses parties au format Riot pour tester `analyze` |
| `server.js` | serveur local sans dépendance |
| `test.js` | vérifications (analyse, erreurs, compilation de la page) |

Pour que l’artefact claude.ai de test reste à jour : concaténer
`src/head.html`, `src/data.js` et `src/app.js` (sans doctype) et republier.

## Git

GitHub Desktop, branche `main`. Toujours récupérer (`Fetch` / `Pull`) avant de
commencer et pousser après. Une fois Vercel branché, chaque push sur `main`
redéploie.
