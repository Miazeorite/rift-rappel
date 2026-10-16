# Écrire le contenu

Tout le contenu est dans `src/data.js`. Après une modification :
`npm run build` puis `npm test`.

## Les thèmes

| Code | Thème | Niv. 1 | Niv. 2 | Niv. 3 | Niv. 4 | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `voc` | Vocabulaire | 2 | 3 | 4 | 3 | 12 |
| `map` | La carte | 1 | 6 | 4 | 1 | 12 |
| `lane` | Lanes & rôles | 2 | 2 | 4 | 3 | 11 |
| `champ` | Champions & sorts | 1 | 5 | 6 | 3 | 15 |
| `item` | Objets | 1 | 8 | 8 | 2 | 19 |
| `eco` | Économie | 1 | 5 | 3 | 2 | 11 |
| `obj` | Objectifs | 1 | 5 | 4 | 2 | 12 |
| `rune` | Runes | 1 | 3 | 4 | 3 | 11 |
| `mu` | Matchups | 1 | 3 | 4 | 3 | 11 |
| `macro` | Macro | 0 | 2 | 4 | 5 | 11 |
| | **Total** | 11 | 42 | 45 | 27 | **125** |

Tableau du 5 octobre 2026. Le mettre à jour quand on ajoute des questions.
Le besoin le plus urgent : **des questions de niveau 4**, sinon les hauts rangs
se gagnent en répétant les trois mêmes questions.

## Une question

```js
Q("item", 3,
  "Contre des ennemis avec PEU de résistance magique, quelle pénétration rapporte le plus ?",
  ["La pénétration fixe", "La pénétration en pourcentage", "Les deux se valent toujours", "Aucune, mieux vaut de la puissance pure"],
  "La pénétration fixe retire la même valeur à tous : énorme sur une cible fragile. Le pourcentage devient meilleur contre les tanks.",
  "Fixe vs %.");
```

Thème, difficulté, énoncé, **bonne réponse en premier** puis trois fausses,
explication, indice. L’ordre des réponses est mélangé à l’affichage. Les
Recrues ne voient que 3 réponses (la bonne + 2 fausses tirées au hasard).

## Les niveaux de difficulté

| Niv. | Pour qui | Ce que ça demande | Exemple |
| --- | --- | --- | --- |
| 1 | découverte | un mot, une règle de base | Qui prend les sbires en bot lane ? |
| 2 | Fer → Or | une règle précise, un effet de sort ou d’objet | Combien de balises de contrôle peut-on avoir posées ? |
| 3 | Platine → Diamant | une mécanique fine, une exception | Quel sort n’est PAS bloqué par le Mur de vent ? |
| 4 | Maître et plus | un raisonnement, un timing, une interaction | Où finit un jungler qui a commencé rouge et fait un full clear ? |

La cote d’une question pour le classement vient de son niveau (`Q_RATING`
dans `src/app.js`) : 500, 1200, 1900, 2700.

## Les règles d’écriture (demande de Marie)

1. **Aucune réponse absurde.** Chaque fausse réponse est une erreur qu’un joueur
   fait vraiment, ou une confusion entre deux choses proches (Banshee et
   Malmortius, Purge et vif-argent, freeze et slow push).
2. **Même longueur, même forme.** Si la bonne réponse est la plus longue ou la
   seule nuancée, elle se repère sans rien savoir.
3. **Une seule bonne réponse défendable.** Si un bon joueur peut argumenter pour
   une fausse, la reformuler.
4. **L’explication dit pourquoi**, et nomme la confusion quand il y en a une.
5. **L’indice oriente sans donner la réponse.**
6. Textes en français, apostrophes typographiques (’), pas d’émoji.

## Les chiffres qui bougent avec les patchs

Ces questions sont justes à la rédaction mais à revérifier à chaque saison :
plaques (5, chute à 14:00), premier sang (400 or), buff Nashor (3 min, rappel
en 4 s), réapparition des inhibiteurs et des buffs (5 min), niveaux 2 en lane,
séquences de last hit sous tourelle, CS à 10 min, rythme des sbires canons,
effets des dragons, objet de support. Choix d’objets : noms français des objets, passif du Cœur gelé (vitesse d’attaque), Cimeterre mercuriel (purge les suppressions). Éviter d’en ajouter sans le signaler ici.

## Une mise en situation

Dans `SCENARIOS` : un titre, un rôle, une heure de jeu, un contexte, des repères
de lecture (montrés aux Recrues et Apprentis), des marqueurs sur la mini-carte
et **trois options défendables** notées 2 (optimal), 1 (jouable) ou 0 (à éviter),
chacune avec son explication. L’écart doit se jouer sur un détail du contexte.

Marqueurs (`m`) : `me` (toi), `ally`, `enemy`, `unk` (position supposée),
`ward`, `obj`. Coordonnées de 0 à 100 : base bleue en bas à gauche, Nashor
vers (32,30), dragon vers (68,70).

Les mises en situation comptent pour le rang **Macro** (ou **Objets** pour les choix
d’objets), à la première tentative
seulement.

## Un choix d’objets

Une mise en situation avec `cat:"item"` et `comp` à la place de `m` : l’app
affiche la composition adverse au lieu de la mini-carte, et les LP vont au rang
**Objets**. `comp.me` = `[champion, or, objets]`, `comp.foes` = cinq
`[rôle, champion, "AD" | "AP" | "MIX", traits, objets (facultatif)]`. Traits
courts : Soins, Contrôles, Suppression, Burst, Tank, Attaques rapides,
Combat long, Poke, Boucliers, Mobilité.

La question porte sur **le prochain achat**, et l’écart entre les options se lit
dans la compo : type de dégâts, soins, contrôles, tanks, objets déjà achetés.
Les Recrues et Apprentis voient en plus le décompte des dégâts adverses.
