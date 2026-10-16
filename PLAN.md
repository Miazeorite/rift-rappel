# État du projet

Les cases sont cochées sur preuve (test qui passe ou essai réel).

## Fait

- [x] 125 questions fines sur 10 thèmes, 4 niveaux de difficulté (`CONTENU.md`).
- [x] 11 mises en situation sur mini-carte, trois options défendables chacune.
- [x] 7 choix d’objets : lire la compo adverse, choisir son prochain achat (rang Objets).
- [x] Répétition espacée, jugement de confiance, erreurs rejouées.
- [x] Quatre profils de guidage, de Recrue à Élite.
- [x] Un rang par thème (Fer → Challenger, placements, LP, record), rang global.
- [x] Entrée : bienvenue → nom d’invocateur → accueil, sans question imposée.
- [x] Accueil : vue générale des stats (8 indicateurs, repères du rang) et
  cartes de thèmes avec leur rang et la pastille « Priorité ».
- [x] Données d’exemple générées à partir du nom (`fakeProfile` dans `src/app.js`).
- [x] Serveur et analyse Riot écrits (`api/`, `lib/`), testés sur le profil de
  démonstration (`npm test`).
- [x] Mention légale Riot dans l’app.

## À faire

- [x] Dépôt publié sur GitHub (public) : github.com/Miazeorite/rift-rappel.
- [x] GitHub Pages activé (main, / root) : le site est sur
  https://miazeorite.github.io/rift-rappel/ , non référencé par Google (`noindex`).
- [ ] **Brancher les vraies stats.** Mettre en ligne sur Vercel avec une clé Riot,
  puis passer `USE_RIOT_API` à `true` dans `src/app.js` et remettre l’écran de
  connexion (`acctForm`) à l’étape du nom. Le code des appels Riot n’a jamais
  tourné sur un vrai compte : prévoir une séance de correction.
- [ ] Demander une clé Riot « Personal » (la clé de développement expire en 24 h).
- [ ] Ajouter des questions de niveau 4 : viser 20 par thème.
- [ ] Faire relire les chiffres liés aux patchs par un joueur à jour (`CONTENU.md`).
- [ ] Tester sur un vrai téléphone (lien claude.ai en attendant Vercel).
- [ ] Progression partagée entre appareils (aujourd’hui : dans le navigateur).
- [ ] Ajuster les repères de stats par rang (`BENCH` dans `src/app.js`, `T` dans
  `lib/riot.js`) avec de vraies données.

## Où voir l’app

- Version de test : l’artefact claude.ai « Rift Rappel » (privé, compte de Marie).
- Version en ligne : https://miazeorite.github.io/rift-rappel/ (GitHub Pages, accessible
  à qui a le lien, pas référencée par Google). Les vraies stats Riot demanderont Vercel.
