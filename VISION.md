# Vision

> Une seule idée tient toute l’app : **on retient ce qu’on est allé chercher
> soi-même dans sa mémoire.** Chaque écran se juge là-dessus : est-ce qu’il
> fait récupérer quelque chose, oui ou non.

## 1. Le principe cognitif

| Étape | Ce qui se passe | Dans l’app |
| --- | --- | --- |
| Encodage | on lit, on voit, on entend | les fiches, les explications après chaque réponse |
| Stockage | l’information est en mémoire, fragile | — |
| Récupération | on la retrouve sans aide : c’est ce qui l’ancre | chaque question, chaque mise en situation |

Trois mécanismes en découlent, et ils sont tous dans le code :

1. **La répétition espacée.** Une bonne réponse sûre fait revenir la question
   1, 2, 4, 8 puis 16 jours plus tard (boîtes de Leitner, `INTERVALS` dans
   `src/app.js`). Une erreur la remet au début.
2. **Le jugement de confiance.** Avant la correction, le joueur dit s’il est
   sûr, hésitant ou s’il répond au hasard. Une bonne réponse au hasard est
   traitée comme à revoir. Une erreur commise en étant sûr est signalée : c’est
   celle qui se corrige le mieux.
3. **L’erreur rejouée.** Chez les débutants, une question ratée revient en fin
   de séance pour être retrouvée tout de suite.

## 2. Pour qui

Tous les niveaux, du joueur qui découvre au Challenger. Ce qui change avec le
niveau, c’est **le guidage**, pas le principe :

| Profil | Rang de jeu | Guidage |
| --- | --- | --- |
| Recrue | nouveau joueur | parcours débloqué pas à pas, fiche avant chaque thème, 3 choix, indices |
| Apprenti | Fer → Or | thèmes ouverts dans un ordre conseillé, 4 choix, indices |
| Confirmé | Platine → Diamant | accès libre, pas d’indice, explications courtes |
| Élite | Maître → Challenger | chrono 20 s, questions pointues, explications en une phrase |

Le profil est déduit du rang en jeu à l’entrée. Il se change dans Profil.

## 3. Les décisions de Marie

Ces choix ont été demandés explicitement. Ne pas revenir dessus sans elle.

- **Des questions fines.** Pas de réponse évidente : les mauvaises réponses sont
  des erreurs que font vraiment les joueurs, de longueur proche de la bonne.
  Voir `CONTENU.md`.
- **Un rang par thème, comme en classé.** Fer → Challenger, divisions IV → I,
  100 LP par division, 5 placements par thème. Réussir au-dessus de son niveau
  rapporte beaucoup, rater une question facile coûte cher.
- **On choisit ce qu’on travaille.** Après le nom d’invocateur, on arrive sur
  l’accueil, jamais directement sur des questions. Pas de test de placement
  imposé à l’entrée.
- **L’accueil montre tout.** Une vue générale des statistiques de jeu (chaque
  carte renvoie au thème qui la travaille) et les cartes de thèmes avec leur rang.
- **Les vraies stats viendront après.** Pour l’instant, les statistiques sont des
  données d’exemple générées à partir du nom. La connexion Riot est écrite et
  attend une clé et une mise en ligne (`PLAN.md`).

## 4. Ce que l’app ne fait pas

- Pas de vidéos ni de longs guides : il en existe déjà partout. L’app fait
  récupérer, elle ne fait pas lire.
- Pas de questions de culture générale sur le lore : on vise ce qui fait
  gagner des parties.
- Pas de classement entre joueurs pour l’instant : le rang mesure ta
  connaissance, pas celle des autres.
