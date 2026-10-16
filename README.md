# Rift Rappel

Application pour apprendre League of Legends par la **récupération en mémoire** :
on lit (encodage), on répond sans aide (récupération), et les questions reviennent
juste avant l’oubli (répétition espacée).

- 125 questions, 11 mises en situation sur mini-carte et 7 choix d’objets
  (lire la compo adverse, choisir son achat), répartis en 10 thèmes.
- Un **rang par thème**, de Fer à Challenger, avec placements et LP.
- Quatre niveaux de guidage, du nouveau joueur (Recrue) au Challenger (Élite).
- On entre son nom d’invocateur et on arrive sur l’**accueil** : une vue générale
  des statistiques de jeu et les cartes de thèmes, on choisit quoi travailler.

**État actuel** : les statistiques sont des **données d’exemple** générées à partir
du nom. La connexion aux vraies parties (API Riot) est écrite mais pas encore
branchée : voir `PLAN.md`.

## Les documents du projet

| Document | Contenu |
| --- | --- |
| `VISION.md` | le principe cognitif, les profils, les décisions de Marie |
| `CONTENU.md` | écrire des questions et des mises en situation, état par thème |
| `DA.md` | couleurs, typographie, ce qui encode une information |
| `PLAN.md` | ce qui est fait, ce qui reste |
| `CLAUDE.md` | règles de travail pour Claude, carte des fichiers |
| `COLLABORATION.md` | GitHub Desktop, travail à plusieurs, mise en ligne |

## Comment marchera la connexion Riot

```
Téléphone / navigateur ──► public/index.html (l’app, une seule page)
                               │  GET /api/profile?riotId=Pseudo%23TAG&platform=EUW1
                               ▼
                         api/profile.js (fonction Vercel)
                               │  clé RIOT_API_KEY, jamais envoyée au navigateur
                               ▼
                         API Riot : compte → rang → 20 parties → timelines
                               │
                         lib/riot.js : analyse (CS/min, vision, balises de contrôle,
                         morts avant 14 min, participation aux kills et aux objectifs,
                         anti-soin face aux soigneurs, matchups perdus)
```

Chaque indicateur est comparé à un repère du rang du joueur, puis converti en
priorités par thème (`weights`) et en rang de départ par thème (`seed`).
Les repères sont des ordres de grandeur, réglables dans `lib/riot.js` (objet `T`).

## Lancer sur son ordinateur

Il faut [Node.js](https://nodejs.org) 18 ou plus récent.

```sh
npm run build   # assemble src/ en public/index.html
npm run dev     # http://localhost:3000
npm test        # doit afficher VERDICT : OK
```

Sans clé d’API, seul le bouton **Profil de démonstration** fonctionne.
Pour ses vraies parties : copier `.env.example` en `.env` et y mettre sa clé.

## Obtenir une clé d’API Riot

1. Se connecter sur <https://developer.riotgames.com> avec son compte Riot.
2. Copier la **Development API Key** du tableau de bord.
   Elle expire **toutes les 24 heures** : il faut la régénérer puis la remettre
   dans Vercel (ou dans `.env`) avant chaque session de test.
3. Pour un usage durable : `Register Product` → **Personal API Key** (usage perso,
   pas de public). Pour ouvrir l’app à tout le monde : **Production API Key**,
   que Riot accorde après examen d’un prototype qui fonctionne.

Ne jamais mettre la clé dans le code ni dans GitHub. Le fichier `.env` est ignoré par git.

## Mettre en ligne (Vercel, gratuit)

1. Publier le dépôt sur GitHub (voir `COLLABORATION.md`).
2. Sur <https://vercel.com>, se connecter avec GitHub, `Add New…` → `Project`,
   importer `rift-rappel`. Les réglages sont lus dans `vercel.json` : ne rien changer.
3. Avant de cliquer `Deploy`, ouvrir `Environment Variables` et ajouter
   `RIOT_API_KEY` avec la clé.
4. Vercel donne une adresse en `https://rift-rappel-….vercel.app` : c’est le lien
   à ouvrir sur le téléphone.

Chaque push sur `main` redéploie automatiquement. Quand la clé de développement
expire : Vercel → le projet → `Settings` → `Environment Variables`, remplacer la
valeur, puis `Deployments` → `…` → `Redeploy`.

## Les fichiers

| Fichier | Rôle |
| --- | --- |
| `src/data.js` | tout le contenu : thèmes, questions, fiches, mises en situation, lexique |
| `src/app.js` | l’app : onboarding, quiz, rangs, répétition espacée, compte League |
| `src/head.html` | titre, polices, styles |
| `build.js` | assemble `src/` en `public/index.html` |
| `public/index.html` | la page servie (générée, mais suivie par git pour être lisible) |
| `api/profile.js` | la fonction serveur appelée par l’app |
| `lib/riot.js` | appels à l’API Riot et analyse des parties |
| `lib/handler.js` | validation, cache 5 min, messages d’erreur |
| `lib/demo.js` | profil de démonstration (fausses parties au format Riot) |
| `server.js` | serveur local pour tester sans Vercel |
| `test.js` | vérifications automatiques |

## Limites connues

- La progression (rangs, LP, révisions) est enregistrée dans le navigateur :
  elle ne suit pas d’un appareil à l’autre.
- Les valeurs chiffrées du jeu (plaques, timers, or) évoluent avec les patchs ;
  un joueur à jour doit relire les questions concernées.
- Environ 12 questions par thème : pour que les hauts rangs aient du sens,
  il faut ajouter des questions de niveau 4.

Rift Rappel n’est ni approuvé ni affilié à Riot Games. League of Legends est une
marque de Riot Games, Inc.
