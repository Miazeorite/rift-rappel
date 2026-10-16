# Direction artistique

> La Faille de nuit : un écran sombre, du laiton pour ce qui compte, du
> turquoise pour ce qui guide. Ça doit évoquer League sans copier Riot.

## 1. Couleurs

Toutes définies une seule fois dans `src/head.html` (`:root`). Thème sombre
unique, choisi exprès.

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| `--bg` | `#0A101B` | fond de page |
| `--panel` / `--panel2` | `#131C2E` / `#19243B` | cartes, survol |
| `--line` / `--line2` | `#26344F` / `#33445F` | bordures |
| `--text` / `--muted` / `--faint` | `#E8EDF6` / `#8F9CB6` / `#5E6C86` | texte |
| `--gold` | `#D9B45B` | action principale, sélection, toi sur la carte |
| `--teal` | `#43C6B4` | guidage : indices, repères de lecture |
| `--blue` / `--red` | `#4DA3F0` / `#E4665F` | alliés / ennemis, et erreur |
| `--good` / `--warn` | `#4CC38A` / `#E3A948` | réussite / jouable |

Le profil de guidage colore les pastilles (`--tier`) : Recrue turquoise,
Apprenti bleu, Confirmé violet, Élite laiton.

Couleurs des rangs (emblèmes, barres de LP) : `LADDER` dans `src/app.js`.

## 2. Typographie

- **Chakra Petch** (titres, étiquettes en capitales, chiffres) : l’allure
  « interface de jeu ».
- **Figtree** (texte courant) : lisible sur téléphone.
- Les chiffres alignés utilisent `font-variant-numeric: tabular-nums` (`.num`).

## 3. Ce qui encode une information

- **Bande de couleur à gauche d’une carte de stat** : rouge à travailler, vert
  point fort, gris dans la moyenne. Toujours doublée d’un mot.
- **Pastille « Priorité »** sur un thème : il correspond à un point faible.
- **Emblème de rang** : hexagone à la couleur du rang, division au centre ;
  ailes à partir de Maître ; hexagone pointillé avec « ? » pendant les placements.
- **Pips de difficulté** : quatre carrés, remplis en laiton.
- **Verdicts** des mises en situation : Optimal (vert), Jouable (orange), À éviter (rouge).

## 4. Icônes et illustrations

Toutes dessinées pour l’app, dans `src/icons.js` : trait fin 24×24, couleur héritée.

- **Une couleur et une icône par thème** (`--c-voc` … `--c-macro` dans `:root`) :
  pastille sur les tuiles, en tête de fiche, à côté de chaque question, et en
  filigrane derrière la question.
- **Rôles** (Top, Jungle, Mid, ADC, Support) : position schématique sur une carte
  carrée, pas les icônes de Riot.
- **Types de dégâts** : physique en orange (`--phys`, épée), magique en violet
  (`--magic`, étoile). **Traits** des champions : une icône chacun (Soins, Contrôles…).
- **Illustration de la Faille** (`riftArt`) : rivière, lanes, tourelles, lueurs. En
  haut de l’accueil et de la bienvenue.
- **Vignettes** des situations : mini-carte réduite, ou les cinq ennemis colorés par
  type de dégâts. **Anneau** de score dans le bilan.
- Fond de page : motif d’hexagones presque invisible.

## 5. Règles

- Pas d’émoji, pas de visuels ni de logos Riot, pas de splash arts.
- Pas de champion dessiné : la mini-carte reste schématique (points et lettres).
- Mobile d’abord : tout doit tenir à 400 px de large, marge latérale de 16 px.
- Une seule action principale (bouton laiton) par écran.
- Les animations restent discrètes et respectent `prefers-reduced-motion`.
