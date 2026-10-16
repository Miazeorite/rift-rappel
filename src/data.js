<script>
/* ============================================================
   CONTENU — Rift Rappel
   Format question : Q(catégorie, difficulté 1-4, énoncé,
     [bonne réponse, faux1, faux2, faux3], explication, indice)
   La bonne réponse est toujours écrite en premier ; l'ordre est
   mélangé à l'affichage. Difficulté : 1 découverte, 2 bases,
   3 confirmé, 4 expert.
   ============================================================ */
const CATS = [
  { id:"voc",  name:"Vocabulaire",        code:"VOC", blurb:"Le jargon qu’on entend en partie et dans le chat." },
  { id:"map",  name:"La carte",           code:"MAP", blurb:"Lanes, jungle, buissons, tourelles, vision." },
  { id:"lane", name:"Lanes & rôles",      code:"LAN", blurb:"Top, jungle, mid, ADC, support : qui fait quoi." },
  { id:"champ",name:"Champions & sorts",  code:"CHP", blurb:"Passifs, sorts, ultimes qui changent un combat." },
  { id:"item", name:"Objets",             code:"OBJ", blurb:"Bottes, objets de support, anti-soin, défense." },
  { id:"eco",  name:"Économie",           code:"ECO", blurb:"Or, last hit, primes, plaques." },
  { id:"obj",  name:"Objectifs",          code:"OBJ", blurb:"Dragons, Nashor, Héraut, larves." },
  { id:"rune", name:"Runes",              code:"RUN", blurb:"Arbres, runes clés, pages adaptées." },
  { id:"mu",   name:"Matchups",           code:"MUP", blurb:"Lire un affrontement et jouer autour." },
  { id:"macro",name:"Macro",              code:"MAC", blurb:"Rotations, gestion des vagues, décisions d’équipe." }
];
CATS.find(c=>c.id==="obj").code="OBT";

/* Ordre du parcours guidé pour les nouveaux joueurs */
const PATH = ["voc","map","lane","champ","item","eco","obj","rune","mu","macro"];

const QS = [];
let _qid = 0;
function Q(c,d,q,o,x,h){ QS.push({id:c+"-"+(++_qid), c, d, q, o, x, h:h||""}); }

/* ---------- VOCABULAIRE ---------- */
Q("voc",1,"Dans le tableau des scores, le « CS » compte…",["Les sbires et monstres que tu as achevés","Les sbires et monstres que tu as touchés","Tes kills et assistances cumulés","Les balises que tu as posées et détruites"],"Seul le coup fatal compte. Toucher un sbire sans l’achever ne rapporte rien, ni en CS ni en or.","Seul le dernier coup compte.");
Q("voc",1,"Quelle est la différence entre « gank » et « roam » ?",["Roamer, c’est quitter sa lane ; ganker, c’est attaquer une lane par surprise","Le gank est réservé au jungler, le roam au support","Le gank vise un champion, le roam vise une tourelle","Aucune, ce sont deux synonymes selon les régions"],"Un mid qui roam peut ganker le bot. Le jungler gank sans « roamer » puisqu’il n’a pas de lane.","L’un décrit un déplacement, l’autre une attaque.");
Q("voc",2,"Ton support « peel ». Concrètement, il…",["Utilise ses contrôles sur ceux qui attaquent ses carries","Utilise ses contrôles pour lancer le combat","Pose de la vision autour de son équipe","Se place devant pour prendre les tirs de tourelle"],"Peel est défensif : on retire la menace de son carry. Lancer le combat, c’est « engage ».","Défensif ou offensif ?");
Q("voc",2,"« Kiter » un champion de mêlée, c’est…",["Glisser des déplacements entre tes attaques pour rester hors de portée","Reculer sans attaquer jusqu’à ce qu’il abandonne","Attaquer sans bouger pour maximiser tes dégâts","Garder ton Flash pour le moment où il te rattrape"],"On attaque, on bouge, on attaque. Reculer sans frapper, c’est simplement fuir.","Attaquer ET bouger.");
Q("voc",2,"« Zoner » un adversaire signifie…",["L’empêcher d’approcher d’une zone par la menace que tu représentes","Le repousser hors de sa lane avec des projections","Poser des balises dans sa moitié de jungle","Le suivre sur la carte pour connaître sa position"],"Un ADC zoné ne peut pas approcher de ses sbires : il perd de l’or sans même se battre.","Pas besoin de le toucher.");
Q("voc",3,"Quelle description correspond à un « slow push » ?",["Tu tues surtout les sbires à distance adverses et ta vague grossit peu à peu","Tu nettoies toute la vague au plus vite avec tes sorts de zone","Tu ne donnes que les derniers coups pour garder la vague devant ta tourelle","Tu laisses la vague ennemie détruire la tienne pour qu’elle revienne"],"En enlevant d’abord les sbires à distance ennemis, ta vague survit et accumule les renforts : elle arrive énorme sur la tourelle.","Ta vague doit survivre.");
Q("voc",3,"Après un crash, on dit que la vague « rebondit ». Pourquoi ?",["La tourelle détruit ta vague, puis la vague ennemie suivante revient pousser vers toi","Tes sbires survivants font demi-tour vers ta tourelle","La vague ennemie change de lane après le crash","Les sbires ennemis deviennent plus forts à chaque crash"],"C’est ce rebond qui rend le cheater recall rentable : pendant ton absence, la vague revient vers ta tourelle au lieu de mourir.","Qui reste sur la lane après le crash ?");
Q("voc",3,"Avoir la « prio » en mid signifie…",["Pouvoir quitter ta lane en premier sans perdre de sbires","Avoir plus de kills que ton adversaire direct","Avoir atteint le niveau 6 avant lui","Avoir plus d’or que ton adversaire direct"],"La prio dépend de l’état de la vague, pas du score. On peut être derrière en kills et avoir la prio.","Pense à la vague, pas au score.");
Q("voc",3,"Un « pick » (ou « catch ») désigne…",["Tuer un ennemi isolé avant un combat ou un objectif","Choisir son champion en premier lors de la draft","Voler un objectif au Châtiment","Récupérer le buff d’un allié qui vient de mourir"],"Un pick crée un 5 contre 4 : la fenêtre idéale pour prendre un objectif.","Avant l’objectif…");
Q("voc",4,"Pourquoi le « cheater recall » coûte-t-il si peu ?",["Ta vague crashée occupe la tourelle ennemie pendant que tu achètes","Le rappel est plus court après avoir poussé une vague","Tu reçois l’or des sbires tués par ta vague pendant ton absence","L’ennemi ne peut pas savoir que tu es parti"],"Ton adversaire doit rester last-hit sous sa tourelle pendant que tu achètes. Tu reviens à temps pour la vague qui rebondit.","Qui est occupé pendant ton absence ?");
Q("voc",4,"« Flip » un objectif, c’est…",["Gagner le combat lancé par l’ennemi sur son objectif pour le prendre","Échanger un dragon contre une tourelle ailleurs sur la carte","Voler l’objectif au Châtiment sans engager de combat","Abandonner l’objectif pour éviter un combat perdu"],"L’équipe qui fait l’objectif perd des PV sur le monstre : c’est une fenêtre pour la retourner.","L’objectif change de camp.");
Q("voc",4,"Le « setup » d’un objectif consiste à…",["Pousser les vagues proches et prendre la vision 45 à 60 s avant son apparition","Désigner qui utilisera le Châtiment","Attendre que l’ennemi commence l’objectif pour le punir","Placer toute l’équipe dans la fosse au moment de l’apparition"],"Le combat pour un objectif se gagne souvent avant l’apparition : vagues, vision, position.","Avant l’apparition.");

/* ---------- LA CARTE ---------- */
Q("map",1,"Tu es dans un buisson. Qui peut te voir ?",["Les ennemis qui ont de la vision dans ce buisson","Tous les ennemis proches : le buisson ne cache qu’à distance","Seulement les tourelles ennemies","Personne, même si une balise ennemie y est posée"],"Il faut une présence ou une balise dans le buisson pour voir à l’intérieur. D’où les balises de contrôle dans les buissons clés.","La vision, pas la distance.");
Q("map",2,"Combien de balises de contrôle un joueur peut-il avoir posées en même temps ?",["1","2","3","Aucune limite"],"Si tu en poses une deuxième, la première disparaît. Tu peux en porter plusieurs dans ton inventaire.","Très peu.");
Q("map",2,"La lentille d’oracle (trinket rouge)…",["Révèle et désactive les balises et pièges invisibles autour de toi","Révèle les champions ennemis cachés dans les buissons","Donne une vision lointaine en un point de la carte","Pose une balise invisible pendant un temps limité"],"Elle ne révèle pas les champions. La vision lointaine, c’est la longue-vue (bleue).","Elle nettoie.");
Q("map",2,"Tu attaques un champion ennemi au milieu de ses sbires. Que font-ils ?",["Ils te ciblent en priorité","Ils continuent de frapper tes sbires","Ils te ciblent seulement si tu utilises un sort","Ils ciblent ton sbire le plus proche de toi"],"C’est l’aggro des sbires : échanger au milieu de la vague ennemie te coûte des PV cachés.","Ils protègent leur champion.");
Q("map",2,"Une tourelle tire plusieurs fois de suite sur le même champion. Ses dégâts…",["Augmentent à chaque tir consécutif","Restent identiques à chaque tir","Diminuent pour laisser le temps de fuir","Doublent seulement après 14 minutes"],"C’est pourquoi un dive doit être court, ou partagé entre plusieurs champions.","Elle « chauffe ».");
Q("map",2,"Un inhibiteur détruit réapparaît après…",["5 minutes","3 minutes","8 minutes","Il ne réapparaît jamais"],"Pendant ce temps, les super-sbires de l’équipe adverse poussent cette lane.","Quelques minutes.");
Q("map",2,"Tu tues un jungler ennemi qui porte le buff rouge. Le buff…",["Est transféré à celui qui l’a tué","Disparaît définitivement","Retourne à son camp d’origine","Est partagé entre les ennemis proches"],"Voler un buff sur un champion est un double gain : tu l’obtiens, il le perd.","Il change de propriétaire.");
Q("map",3,"Au minimum, combien de tourelles faut-il détruire avant de pouvoir attaquer le Nexus ?",["5","3","7","11"],"Une lane entière (3 tourelles), puis l’inhibiteur, puis les 2 tourelles du Nexus.","Une lane + le Nexus.");
Q("map",3,"Après avoir été tué, un buff rouge ou bleu réapparaît au bout de…",["5 minutes","2 minutes 30","3 minutes","7 minutes"],"Noter l’heure des buffs adverses permet d’anticiper le trajet du jungler.","Comme l’inhibiteur.");
Q("map",3,"En plein dive, la tourelle te cible. Comment la faire changer de cible ?",["Un allié frappe un champion ennemi à portée de cette tourelle","Tu arrêtes d’attaquer pendant deux secondes","Tu utilises un sort plutôt qu’une attaque de base","Un sbire allié entre dans la portée de la tourelle"],"La tourelle bascule sur le champion qui agresse un de ses champions. Ne plus attaquer ne suffit pas : elle garde sa cible.","Qui agresse sous la tourelle ?");
Q("map",3,"Pourquoi une balise de contrôle dans un buisson de rivière plutôt qu’une balise invisible ?",["Elle reste en place et refuse durablement la vision ennemie ici","Elle offre un rayon de vision bien plus large","Elle est invisible pour l’ennemi","Elle rapporte de l’or à chaque ennemi repéré"],"La balise invisible expire. La balise de contrôle reste et désactive les balises invisibles adverses dans la zone.","Durée et refus de vision.");
Q("map",4,"Le jungler ennemi a commencé par son buff rouge (côté bot) et fait un full clear. Où finit-il probablement ?",["Côté top, à la fin de son chemin de camps","Côté bot, en train de refaire son buff rouge","Dans ta jungle, en train de voler ton buff bleu","En base, juste après son dernier camp"],"Un full clear traverse sa jungle d’un côté à l’autre. Le buff rouge ne réapparaîtra pas avant 5 minutes : le côté top est la zone à surveiller.","Il traverse sa jungle.");

/* ---------- LANES & RÔLES ---------- */
Q("lane",1,"Qui prend les sbires en bot lane ?",["L’ADC ; le support seulement si un sbire va être perdu","Le support et l’ADC, à parts égales","Le support, pour faire évoluer son objet plus vite","Celui des deux qui a le plus de PV"],"Chaque sbire pris par le support retarde les objets de l’ADC, qui dépend de l’or bien plus que lui.","Qui dépend le plus des objets ?");
Q("lane",1,"Pourquoi les joueurs top prennent-ils souvent Téléportation ?",["Pour rejoindre vite l’action depuis une lane longue et isolée","Parce que le rappel est plus long en top","Pour se téléporter sur un sbire et esquiver les ganks","Parce qu’Embrasement est peu utile au corps à corps"],"Le top est loin des dragons et de la plupart des combats. La Téléportation compense cet isolement.","Distance.");
Q("lane",2,"Le jungler ennemi est vu en haut de la carte à 3:20. Tu es bot. Qu’est-ce que ça change ?",["Tu peux jouer plus agressif : aucun gank bot n’est possible dans l’immédiat","Rien, cette information ne concerne que ton top","Tu peux pousser sous la tourelle ennemie sans limite de temps","Tu dois aller aider ton top à deux"],"Une info sur le jungler a une durée de vie : elle vaut une trentaine de secondes, pas plus.","Où ne peut-il PAS être ?");
Q("lane",2,"Pourquoi le mid est-il la lane qui roam le plus ?",["Lane courte, avec un accès direct aux deux moitiés de rivière","Le mid reçoit plus de sbires par vague","Le mid n’a pas de tourelle intérieure","Le mid gagne l’or passif plus vite"],"Proximité avec les deux rivières et les deux objectifs : le mid influence toute la carte.","Géographie.");
Q("lane",3,"Pour qu’un freeze devant ta tourelle tienne, la vague ennemie doit…",["Compter quelques sbires de plus que la tienne","Compter autant de sbires que la tienne","Compter moins de sbires que la tienne","Être composée uniquement de sbires de mêlée"],"Une vague ennemie légèrement plus grosse pousse naturellement vers toi et reste stable devant ta tourelle.","Qui pousse vers qui ?");
Q("lane",3,"Last hit sous ta tourelle en début de partie : quelle séquence pour un sbire de mêlée ?",["2 tirs de tourelle, puis ton attaque","1 attaque, 1 tir de tourelle, 1 attaque","1 tir de tourelle, puis 2 attaques","3 tirs de tourelle, puis ton attaque"],"Les sbires à distance, eux : une attaque, un tir de tourelle, puis ton attaque.","La tourelle frappe fort les mêlées.");
Q("lane",3,"Et pour un sbire à distance sous ta tourelle ?",["Une attaque, un tir de tourelle, puis ton attaque","2 tirs de tourelle, puis ton attaque","1 tir de tourelle, puis 2 attaques","Laisser la tourelle le tuer seule"],"Un tir de tourelle sur un sbire à distance le laisse trop bas pour une attaque… sauf si tu l’as entamé avant.","Il faut le préparer.");
Q("lane",3,"Quand un support peut-il quitter la bot lane pour roam en mid ?",["Quand la vague bot vient d’être crashée et que l’ADC peut rester en sécurité","Dès le niveau 2, pour accompagner le jungler","Quand l’ADC est bas en PV et doit rappeler","Quand la vague ennemie arrive sur la tourelle alliée"],"Roamer pendant que la vague pousse vers ton ADC le laisse seul en 2 contre 1.","L’état de la vague d’abord.");
Q("lane",4,"En bot lane (duo), à quel moment atteint-on le niveau 2 ?",["1re vague entière + les 3 mêlées de la 2e","1re vague entière seulement","Les 3 mêlées de la 1re vague","Deux vagues complètes"],"Le duo partage l’XP. Savoir qui l’atteint en premier permet de lancer (ou d’éviter) un échange niveau 2.","Plus qu’une vague.");
Q("lane",4,"Et en solo lane (top ou mid) ?",["1re vague entière + 1 mêlée de la 2e","1re vague entière seulement","Les 3 mêlées de la 1re vague","1re vague entière + les 3 mêlées de la 2e"],"Le premier à atteindre le niveau 2 a un sort de plus : c’est le moment d’un échange rentable.","Un sbire de plus que la vague.");
Q("lane",4,"Pourquoi un jungler préfère-t-il ganker une lane dont la vague pousse vers sa propre tourelle ?",["L’adversaire est avancé, loin de sa tourelle, avec un long chemin de fuite","Les sbires alliés l’aident à infliger plus de dégâts","L’adversaire a moins de sbires à last-hit, donc plus d’attention","La tourelle alliée peut participer au kill"],"Plus l’ennemi est loin de sa tourelle, plus il est exposé.","Où est l’ennemi ?");

/* ---------- CHAMPIONS & SORTS ---------- */
Q("champ",1,"Pour la plupart des champions, à quels niveaux améliore-t-on l’ultime après le 6 ?",["11 et 16","9 et 13","10 et 15","12 et 18"],"Les niveaux 6, 11 et 16 sont des paliers de puissance à surveiller chez l’adversaire.","Tous les 5 niveaux.");
Q("champ",2,"Lequel de ces sorts n’est PAS bloqué par le Mur de vent de Yasuo ?",["L’ultime de Lux (laser)","L’ultime de Jinx (roquette)","Le grappin de Blitzcrank","L’ultime d’Ezreal"],"Le Mur de vent arrête les projectiles. Un laser n’en est pas un.","Projectile ou pas ?");
Q("champ",2,"La cage (E) de Veigar étourdit…",["Les ennemis qui traversent son bord","Tous les ennemis présents à l’intérieur quand elle apparaît","Les ennemis restés à l’intérieur plus d’une seconde","Uniquement le premier ennemi touché"],"Rester au centre de la cage évite l’étourdissement : seul le bord est dangereux.","Le mur, pas l’intérieur.");
Q("champ",2,"Le Bouclier noir (E) de Morgana protège…",["Des dégâts magiques et des contrôles","De tous les dégâts, physiques compris","Des contrôles seulement, pas des dégâts","Des dégâts de tourelle"],"Tant que le bouclier tient, la cible est immunisée aux contrôles. Des dégâts physiques ne le cassent pas.","Magique.");
Q("champ",2,"L’ultime de Master Yi le rend immunisé…",["Aux ralentissements","Aux étourdissements","À tous les contrôles","Aux dégâts magiques"],"Un étourdissement l’arrête toujours. Garde-le pour son engage.","Il court.");
Q("champ",2,"Qui peut utiliser la lanterne (W) de Thresh ?",["Un allié qui clique dessus","Thresh seul, pour se déplacer","N’importe quel champion, ennemi compris","Les sbires alliés proches"],"L’allié est tiré vers Thresh : sauvetage ou engage surprise d’un jungler.","Un allié.");
Q("champ",3,"Le passif de Katarina réduit ses délais quand…",["Un champion ennemi qu’elle a touché récemment meurt","Elle achève un sbire","Elle lance son ultime jusqu’au bout","Elle reste plusieurs secondes hors de vue"],"Kill ou assistance récente = reset. Un contrôle au bon moment casse la chaîne.","Kill ou assistance.");
Q("champ",3,"L’ultime de Darius se réinitialise quand…",["Il tue la cible avec","Il atteint 5 charges d’hémorragie","Il touche au moins deux ennemis","Il est sous la moitié de ses PV"],"Dans un combat où plusieurs ennemis sont bas, il peut enchaîner les exécutions.","Une élimination.");
Q("champ",3,"Anivia se transforme en œuf. Comment l’empêcher de renaître ?",["Détruire l’œuf avant la fin de sa durée","Lui appliquer des blessures graves","L’étourdir pendant la transformation","Impossible, elle renaît toujours"],"L’œuf a peu de résistances : il faut le focus immédiatement.","Frapper l’œuf.");
Q("champ",3,"Pourquoi rester derrière ses sbires protège-t-il du grappin de Blitzcrank ?",["Le grappin s’arrête sur la première unité touchée","Le grappin ne peut pas cibler un champion caché par des sbires","Les sbires rendent les champions invisibles","Le grappin ne fait des dégâts qu’aux sbires"],"C’est un projectile en ligne droite : le premier sbire l’intercepte.","Projectile.");
Q("champ",3,"Le Bouclier magique (E) de Sivir bloque…",["La prochaine compétence ennemie","Tous les dégâts pendant deux secondes","Les attaques de base uniquement","Tous les projectiles pendant sa durée"],"Un seul sort, au bon moment. Même principe que le W de Nocturne.","Une seule chose.");
Q("champ",3,"Kindred lance son ultime au milieu d’un combat. Quel est le risque ?",["Il empêche aussi les ennemis dans la zone de mourir","Kindred ne peut plus attaquer pendant sa durée","Il ne protège que Kindred","Il empêche les alliés de lancer leurs sorts"],"Mal placé, il offre un sursis à l’ennemi que ton équipe allait tuer.","Qui est dans la zone ?");
Q("champ",4,"Tu subis l’ultime de Malzahar (suppression). Qu’est-ce qui te libère ?",["Le Ceinturon de vif-argent ou son évolution","Le sort d’invocateur Purge","La ténacité des sandales de mercure","La Bénédiction de Mikael d’un allié"],"La suppression résiste à Purge et à la ténacité. Seul l’actif vif-argent la retire.","Un objet précis.");
Q("champ",4,"Quelle affirmation sur la ténacité est vraie ?",["Elle ne réduit pas la durée des projections en l’air","Elle réduit aussi les dégâts des sorts ennemis","Elle réduit les projections mais pas les étourdissements","Elle rend immunisé aux ralentissements au-delà de 50 %"],"Les projections en l’air ignorent la ténacité : c’est ce qui rend les ultimes comme celui de Malphite si fiables.","En l’air…");
Q("champ",4,"Zed t’a posé son ultime. Tu as un Sablier de Zhonya. Quand l’activer ?",["Juste avant l’explosion de la marque","Dès que la marque est posée","Juste après l’explosion de la marque","Dès que tu passes sous 50 % de PV"],"En stase pendant l’explosion, tu annules les dégâts accumulés. Trop tôt, la marque éclate après ta stase.","Le moment critique.");

/* ---------- OBJETS ---------- */
Q("item",1,"Les bottes d’acier renforcées sont faites contre…",["Les attaques de base","Les sorts magiques","Les contrôles","Les dégâts de tourelle"],"Elles réduisent les dégâts des attaques de base. Contre la magie et les contrôles : sandales de mercure.","Pense aux ADC.");
Q("item",2,"Les sandales de mercure apportent…",["Résistance magique et ténacité","Armure et ténacité","Résistance magique et vitesse d’attaque","Ténacité et accélération de compétence"],"Utiles contre une équipe qui a beaucoup de magie ET de contrôles.","Magie + contrôles.");
Q("item",2,"Quel composant d’anti-soin achète un champion AD ?",["Appel de l’exécuteur","Orbe de l’oubli","Gilet épineux","Épée longue"],"L’Orbe de l’oubli est l’équivalent mage, le Gilet épineux l’équivalent tank.","Physique.");
Q("item",2,"Et quel composant d’anti-soin achète un mage ?",["Orbe de l’oubli","Appel de l’exécuteur","Gilet épineux","Tome d’amplification"],"Il évolue en Morellonomicon.","Magique.");
Q("item",2,"Pendant la stase du Sablier de Zhonya, tu…",["Es invulnérable et ne peux rien faire","Es invulnérable et peux te déplacer","Te soignes rapidement","Es invisible mais vulnérable aux sorts"],"Tu gagnes du temps, pas de la position : les ennemis peuvent t’attendre à la sortie.","Figé.");
Q("item",2,"L’objet de support termine sa quête. Que se passe-t-il ?",["Il s’améliore et donne des charges de balises","Il se revend automatiquement contre de l’or","Il transfère son or à l’ADC","Il augmente l’or que le support gagne sur les sbires"],"C’est ce qui permet au support de tenir la vision de l’équipe.","Vision.");
Q("item",3,"Contre des ennemis avec PEU de résistance magique, quelle pénétration rapporte le plus ?",["La pénétration fixe","La pénétration en pourcentage","Les deux se valent toujours","Aucune, mieux vaut de la puissance pure"],"La pénétration fixe retire la même valeur à tous : énorme sur une cible fragile. Le pourcentage devient meilleur contre les tanks.","Fixe vs %.");
Q("item",3,"Pourquoi une réduction d’armure (Couperet noir) aide plus l’équipe qu’une pénétration ?",["Elle profite à tous les alliés qui frappent la cible","Elle retire aussi la résistance magique","Elle reste active toute la partie","Elle s’applique aussi aux tourelles"],"La pénétration ne sert qu’à toi. La réduction modifie la cible pour tout le monde.","Qui en profite ?");
Q("item",3,"Tu es ADC, deux tanks ennemis empilent l’armure. Quel objet en priorité ?",["Salutations de Lord Dominik","Lame d’infini","Soif-de-sang","Canon ultrarapide"],"Pénétration d’armure en pourcentage : ce qui compte contre des cibles très résistantes.","Pénétration.");
Q("item",3,"Que fait le passif du Voile de la banshee ?",["Un bouclier qui bloque la prochaine compétence ennemie","Un bouclier contre la magie quand tu passes bas","Une réduction de durée des contrôles","Une résistance magique qui grandit en combat"],"Le bouclier « quand tu passes bas », c’est la Gueule de Malmortius.","Un sort bloqué.");
Q("item",3,"Le Visage spirituel augmente…",["Les soins et boucliers que tu reçois","Les soins que tu donnes à tes alliés","Ta résistance magique selon tes PV manquants","Ta régénération de mana en combat"],"Excellent sur les champions qui se soignent eux-mêmes, ou avec un support enchanteur.","Reçus.");
Q("item",3,"L’Armure de ronces applique des blessures graves quand…",["Un ennemi te frappe d’une attaque de base, ou quand tu l’immobilises","Tu frappes un ennemi avec une attaque de base","Un ennemi te touche avec un sort","Tu passes sous la moitié de tes PV"],"Elle punit surtout les champions qui se soignent en frappant.","Quand on te frappe.");
Q("item",2,"L’Appel de l’exécuteur évolue en…",["Rappel mortel","Morellonomicon","Armure de ronces","Couperet noir"],"Rappel mortel : l’anti-soin des tireurs. Le Morellonomicon est celui des mages, l’Armure de ronces celui des tanks.","Un objet de tireur.");
Q("item",2,"Le Bâton du vide est surtout fort contre…",["Des cibles avec beaucoup de résistance magique","Des cibles avec peu de résistance magique","Des champions qui se soignent beaucoup","Des champions qui ont des boucliers"],"Sa pénétration est en pourcentage : plus la cible est résistante, plus elle rapporte. Contre une cible fragile, la pénétration fixe vaut mieux.","Pourcentage.");
Q("item",2,"Que fait l’Ange gardien ?",["Il te ramène à la vie une fois après une mort","Il te donne un bouclier quand tu passes bas","Il te rend invulnérable deux secondes et demie","Il bloque la prochaine compétence ennemie"],"La résurrection a un temps de recharge. L’invulnérabilité, c’est le Sablier de Zhonya ; bloquer un sort, le Voile de la banshee.","Une seconde vie.");
Q("item",3,"Malzahar te bloque avec son ultime. Qu’est-ce qui t’en libère ?",["Une purification comme le Cimeterre mercuriel","La ténacité des Sandales de mercure","La résistance magique du Voile de la banshee","Le passif de l’Armure de ronces"],"La ténacité ne raccourcit pas les suppressions : seule une purification les arrête.","Suppression.");
Q("item",3,"Contre Master Yi et Jinx, pourquoi le Cœur gelé plaît aux tanks ?",["Il réduit la vitesse d’attaque des ennemis proches","Il renvoie des dégâts à chaque attaque reçue","Il donne un bouclier contre les coups critiques","Il ralentit chaque ennemi que tu frappes"],"Renvoyer des dégâts, c’est l’Armure de ronces. Le Cœur gelé casse le rythme des champions qui frappent vite.","Leur rythme.");
Q("item",4,"Tu es mage face à Zed et Talon. Premier objet défensif le plus rentable ?",["Sablier de Zhonya","Voile de la banshee","Morellonomicon","Cœur gelé"],"Deux assassins AD : armure et stase. La banshee protège surtout contre la magie.","Leurs dégâts sont physiques.");
Q("item",4,"Pourquoi acheter la Larme de la déesse tôt quand on la prend ?",["Elle se charge avec le temps et les sorts : plus tôt, plus vite complète","Son prix augmente après 10 minutes","Elle donne un bouclier dès l’achat","Elle réduit le coût en mana de tes sorts"],"Les objets à charges récompensent l’achat précoce.","Elle se remplit.");

/* ---------- ÉCONOMIE ---------- */
Q("eco",1,"Quelle source d’or est la plus régulière en lane ?",["Les sbires","Les kills","Les assistances","Les plaques"],"Une vague complète vaut à peu près un kill, et elle revient toutes les 30 secondes.","Elle revient sans cesse.");
Q("eco",2,"Combien d’or rapporte le premier sang ?",["400","300","500","150"],"300 or de base + 100 de bonus.","Un bonus sur un kill normal.");
Q("eco",2,"Un joueur qui meurt plusieurs fois de suite…",["Rapporte moins d’or à chaque nouvelle mort","Rapporte plus d’or à chaque mort","Rapporte toujours 300 or","Ne rapporte plus rien après 3 morts"],"Le jeu limite l’effet boule de neige. Tuer un joueur en série (prime) rapporte au contraire plus.","Le jeu freine l’avalanche.");
Q("eco",2,"En début de partie, les sbires canons arrivent…",["Toutes les 3 vagues, puis plus souvent","À chaque vague dès le début","Seulement après 15 minutes","Toutes les 2 vagues toute la partie"],"Toutes les 3 vagues au début, toutes les 2 ensuite, puis à chaque vague en fin de partie.","Pas à chaque vague.");
Q("eco",2,"Combien de plaques porte une tourelle extérieure ?",["5","3","4","6"],"Chaque plaque donne de l’or. Elles tombent à 14:00.","Une main.");
Q("eco",2,"Les plaques des tourelles extérieures tombent à…",["14:00","10:00","15:00","20:00"],"Après, la tourelle n’est plus qu’un seul bloc de PV.","Juste avant le quart d’heure.");
Q("eco",3,"Un sbire est achevé par ta tourelle, près de toi. Tu reçois…",["L’XP, mais pas l’or","L’or et l’XP","La moitié de l’or et l’XP","Ni or ni XP"],"L’XP se partage entre les champions proches. L’or, lui, exige le dernier coup.","L’XP ne demande pas le dernier coup.");
Q("eco",3,"À 10 minutes, quel total de CS correspond à une lane très bien farmée ?",["80 à 90","50 à 60","30 à 40","Plus de 150"],"Le maximum théorique se situe un peu au-dessus de 100. 80-90 est un farm solide.","Proche du maximum.");
Q("eco",3,"Comment l’or d’un kill est-il partagé avec les assistants ?",["Une part est répartie entre les assistants","Chaque assistant reçoit 300 or","Seul le tueur reçoit de l’or","L’or va à celui qui a fait le plus de dégâts"],"Le tueur garde la plus grosse part. Laisser le kill au carry est donc un choix.","Répartition.");
Q("eco",4,"Quand les « primes d’objectif » apparaissent-elles ?",["Quand une équipe est nettement en retard : ses objectifs rapportent plus","Quand une équipe prend trois objectifs d’affilée","Quand un joueur est en série de kills","Après 25 minutes, sur tous les objectifs"],"Un mécanisme de rattrapage : l’équipe en avance doit rester prudente.","Rattrapage.");
Q("eco",4,"Tu as 1 250 or, ton composant clé coûte 1 300. Une vague ennemie de 7 sbires arrive sur ta tourelle, sans danger. Meilleur choix ?",["Nettoyer la vague sous ta tourelle, puis rappeler","Rappeler tout de suite et acheter un composant moins cher","Rester en lane jusqu’à 2 500 or","Laisser la vague à la tourelle et rappeler"],"La vague te donne l’or manquant. Rappeler avant, c’est perdre 7 sbires et ton composant.","Il te manque 50 or.");

/* ---------- OBJECTIFS ---------- */
Q("obj",1,"Combien de dragons élémentaires une équipe doit-elle tuer pour l’âme ?",["4","3","5","2"],"Le 4e dragon d’une même équipe donne l’âme ; le Dragon ancestral apparaît ensuite.","Un de plus que 3.");
Q("obj",2,"Après quel dragon la Faille se transforme-t-elle ?",["Le 2e","Le 1er","Le 3e","Le 4e"],"L’élément révélé à ce moment est celui de tous les dragons suivants, et donc de l’âme.","Tôt.");
Q("obj",2,"Quel dragon donne de la ténacité et renforce les soins et boucliers ?",["Chimtech","Océan","Montagne","Hextech"],"Océan régénère, Montagne donne des résistances, Hextech de l’accélération et de la vitesse d’attaque.","Le plus « chimique ».");
Q("obj",2,"Quel dragon donne de l’armure et de la résistance magique ?",["Montagne","Océan","Infernal","Nuages"],"Infernal donne des dégâts, Nuages de la vitesse, Océan de la régénération.","Solide comme…");
Q("obj",2,"Combien de temps dure le buff du Nashor ?",["3 minutes","2 minutes","5 minutes","90 secondes"],"Trois minutes pour convertir : chaque seconde de buff non utilisée est perdue.","Pas longtemps.");
Q("obj",2,"Avec le buff du Nashor, le rappel dure…",["4 secondes","8 secondes","2 secondes","6 secondes"],"Rappel rapide = retour rapide sur la carte pour assiéger.","Moitié moins.");
Q("obj",3,"Qui reçoit le buff du Nashor ?",["Tous les membres vivants de l’équipe","Seulement celui qui l’a achevé","Toute l’équipe, morts compris","Seulement les joueurs proches de la fosse"],"Un allié mort au moment du kill ne l’a pas : d’où l’intérêt de ne pas perdre de joueur juste avant.","Il faut être en vie.");
Q("obj",3,"Le Dragon ancestral apparaît…",["Quand une équipe a obtenu l’âme du dragon","Après 35 minutes, quoi qu’il arrive","Après le 6e dragon de la partie","Après le deuxième Nashor"],"Il remplace les dragons élémentaires une fois l’âme prise.","Après l’âme.");
Q("obj",3,"Qu’apporte le buff du Dragon ancestral ?",["Brûlure et exécution des ennemis bas en PV","Des PV bonus et de la régénération","Il double l’effet de l’âme du dragon","Des sbires renforcés dans toutes les lanes"],"Des sbires renforcés, c’est le Nashor.","Exécution.");
Q("obj",3,"L’ennemi fait le Nashor avec sa vision. Tu es jungler. Quand tenter un vol au Châtiment ?",["Quand les PV du Nashor passent à portée de ton Châtiment","Dès l’entrée de l’équipe ennemie dans la fosse","Quand l’équipe ennemie passe sous 50 % de PV","Juste après le Châtiment du jungler ennemi, quels que soient les PV"],"Châtiment inflige des dégâts fixes : il ne sert qu’à la fin.","Des dégâts fixes.");
Q("obj",4,"Vous venez de tuer le jungler adverse et le Nashor est disponible. Pourquoi c’est le moment ?",["Sans Châtiment ennemi, le risque de vol est très faible","Le Nashor est plus faible quand un jungler est mort","Le jungler mort perd son or de prime","Les tourelles adverses sont désactivées pendant sa mort"],"Pick sur le jungler = fenêtre d’objectif. Convertis ton avantage.","Qui peut le voler ?");
Q("obj",4,"Point d’âme adverse, dragon dans 1 minute. Qu’est-ce qui compte le plus maintenant ?",["Pousser les vagues proches et installer la vision","Farmer ta jungle pour prendre un niveau","Rester groupés en base pour réapparaître ensemble","Prendre le Héraut de l’autre côté"],"Le combat se prépare avant l’apparition : l’équipe qui arrive en premier avec la vision a l’avantage.","Avant l’apparition.");

/* ---------- RUNES ---------- */
Q("rune",1,"Lequel de ces arbres de runes n’existe pas ?",["Agilité","Précision","Sorcellerie","Inspiration"],"Les cinq arbres : Précision, Domination, Sorcellerie, Volonté, Inspiration.","Il y en a cinq.");
Q("rune",2,"Arbre secondaire : quelle règle ?",["2 runes de deux lignes différentes, sans rune clé","2 runes, qui peuvent être de la même ligne","1 rune clé et 1 rune","3 runes au choix"],"On ne peut pas prendre deux runes de la même ligne, ni une rune clé en secondaire.","Deux lignes différentes.");
Q("rune",2,"Électrocution se déclenche avec…",["3 attaques ou sorts distincts sur un champion en peu de temps","3 attaques de base sur n’importe quelle unité","Le premier sort qui touche un champion","Un contrôle posé sur un champion"],"Un combo rapide de trois éléments différents : la rune des assassins.","Trois éléments différents.");
Q("rune",2,"Conquérant à charges maximales…",["Convertit une partie de tes dégâts en soins","Te donne un bouclier","Te donne de la vitesse de déplacement","Rend ton prochain sort gratuit"],"C’est ce soin qui rend les combattants si durs à tuer dans les longs combats.","Longs combats.");
Q("rune",3,"Répercussion s’active quand…",["Tu immobilises un champion ennemi","Tu passes sous 30 % de PV","Tu subis trois attaques","Tu touches un champion avec ton ultime"],"Tu gagnes des résistances, puis une explosion : parfait pour les tanks qui engagent.","Un contrôle.");
Q("rune",3,"Pourquoi Poigne du mort-vivant est-elle moins forte sur un champion à distance ?",["Ses effets sont réduits pour les champions à distance","Elle ne se déclenche qu’au corps à corps","Elle exige d’abord de subir des dégâts","Elle ne fonctionne que sur les sbires"],"Elle reste jouable à distance, mais rapporte moins.","Réduite.");
Q("rune",3,"Plaque osseuse…",["Réduit les dégâts des prochains coups d’un champion après avoir été touché","Donne de l’armure qui grandit avec le temps","Renvoie une partie des dégâts subis","Réduit la durée des contrôles"],"Idéale contre les combos courts : elle amortit la suite de l’échange.","Après le premier coup.");
Q("rune",3,"Rush de phase convient surtout à…",["Un mage qui veut frapper puis s’éloigner d’un combattant","Un tank qui veut rester au contact","Un jungler qui veut sécuriser les objectifs","Un support qui veut protéger son ADC"],"Après 3 touches, un gros bonus de vitesse : frapper et partir.","Mobilité.");
Q("rune",4,"Comment se déclenche le bouclier de Gardien ?",["Un allié proche subit des dégâts d’un champion","Tu lances un sort de soin","Tu immobilises un ennemi","Tu passes sous 30 % de PV"],"Il suffit d’être proche de l’allié ciblé : le placement fait tout.","Proximité.");
Q("rune",4,"Contre un mage de poke en mid, quelle rune secondaire de Volonté aide le plus à tenir ?",["Second souffle","Démolition","Surcroissance","Inébranlable"],"Démolition vise les tourelles, Surcroissance le long terme, Inébranlable les contrôles.","Régénérer.");
Q("rune",4,"Premier coup (First Strike)…",["Donne de l’or et des dégâts bonus si tu infliges les premiers dégâts à un champion","Double les dégâts de ta toute première attaque de la partie","Donne de l’or pour chaque premier kill de la partie","Rend ton premier sort de chaque combat gratuit"],"Elle récompense ceux qui initient les échanges.","Qui frappe en premier ?");

/* ---------- MATCHUPS ---------- */
Q("mu",1,"Contre un duo bot avec Blitzcrank, ta priorité ?",["Rester derrière tes sbires","Rester dans les buissons de ta lane","Rester loin de ton support","Rester collé à ta tourelle toute la phase de lane"],"Coller sa tourelle coûte trop de sbires. Les sbires suffisent comme bouclier.","Un bouclier.");
Q("mu",2,"Tu es un mêlée contre un tireur en top. Quand chercher un échange ?",["Quand il s’avance pour achever un sbire","Dès qu’il t’attaque en premier","Quand tu es plus bas que lui en PV","Quand ses sbires sont plus nombreux que les tiens"],"Pour last-hit, il doit entrer dans ta portée. C’est ta fenêtre.","Il doit s’approcher.");
Q("mu",2,"Pourquoi un Malphite niveau 6 change-t-il la lane ?",["Son ultime est un engage imparable avec projection","Il devient insensible aux dégâts physiques","Son ultime le soigne entièrement","Il gagne une portée d’attaque supérieure"],"Une projection ne se purge pas et ignore la ténacité : il faut respecter sa portée.","L’ultime.");
Q("mu",2,"Quel champion stoppe les ruées adverses avec un sort ?",["Poppy","Garen","Nasus","Annie"],"Son W arrête les dash : un contre direct à Yasuo, Irelia, Lee Sin…","Une gardienne.");
Q("mu",3,"Contre Soraka et Aatrox, qui achète l’anti-soin ?",["Au moins un joueur par type de dégâts utile, tôt dans la partie","Uniquement le support, qui a peu d’objets","Personne avant 25 minutes","Toute l’équipe, en premier objet"],"Un anti-soin appliqué en continu suffit : pas besoin que tout le monde l’achète.","Suffisamment, pas trop.");
Q("mu",3,"Contre Darius, quel type d’échange éviter ?",["Les échanges longs au corps à corps","Les échanges courts où tu recules vite","Les échanges sous ta tourelle","Les échanges où tu frappes en premier"],"À 5 charges d’hémorragie, il devient très fort. Frappe et recule.","Il accumule.");
Q("mu",3,"Contre Yasuo, tu es un mage à projectiles. Meilleur ordre ?",["Lui faire utiliser son Mur de vent, puis lancer tes sorts clés","Lancer ton sort clé en premier pour le forcer à esquiver","Toujours lancer tous tes sorts ensemble","Ne jouer que tes sorts non bloquables même s’ils sont faibles"],"Son Mur de vent a un long délai : une fois utilisé, ta fenêtre s’ouvre.","Attendre.");
Q("mu",3,"Tryndamere lance son ultime. Que fais-tu ?",["Tu le kites jusqu’à la fin de l’ultime, puis tu punis","Tu lances tout immédiatement pendant l’ultime","Tu lui appliques Embrasement pour l’annuler","Tu le laisses te suivre sous ta tourelle quoi qu’il arrive"],"Il ne peut pas mourir pendant quelques secondes : les dégâts sont gâchés.","Il ne meurt pas encore.");
Q("mu",4,"Tu joues Kayle contre Darius, niveaux 1 à 6. Objectif principal ?",["Perdre le moins de sbires possible en restant près de ta tourelle","Chercher à égaliser les kills","Échanger dès que ton E est prêt","Laisser la lane pour farmer la jungle"],"Kayle gagne la partie plus tard. Survivre et farmer, c’est gagner la lane.","Scaling.");
Q("mu",4,"Tu joues un champion faible tôt mais fort tard, contre une composition agressive. Plan de partie ?",["Éviter les combats inutiles, céder certains objectifs, atteindre tes objets clés","Surprendre l’ennemi en forçant les combats dès le début","Délaisser le farm pour roam","Forcer le Nashor tôt"],"Céder un dragon coûte moins que perdre un combat que tu ne peux pas gagner.","Gagner du temps.");
Q("mu",4,"Face à un mid qui roam beaucoup (Talon), meilleure réponse ?",["Pinguer et pousser ta vague pour punir chaque roam","Le suivre à chaque fois, même sans prio","Rester sous ta tourelle pour ne rien risquer","Ignorer ses déplacements et farmer"],"Chaque roam doit lui coûter des sbires ou des plaques. Le suivre sans prio te fait perdre ta vague.","Qu’est-ce que son roam lui coûte ?");

/* ---------- MACRO ---------- */
Q("macro",2,"Ton ADC est mort, vous êtes 4 contre 5 au dragon. Que faire ?",["Céder le dragon et prendre autre chose si possible","Contester en espérant un vol au Châtiment","Engager vite avant la réapparition de l’ADC","Rester groupés dans la fosse pour défendre"],"Un combat en infériorité se perd souvent. Céder un dragon coûte moins qu’un ace.","Compte les joueurs.");
Q("macro",2,"Tu as poussé ta vague, tu as tous tes PV, ton jungler va au crabe. Que faire ?",["Aller l’aider à prendre le crabe","Rester en lane pour la vague suivante","Rentrer acheter une potion","Frapper la tourelle ennemie sans sbires"],"Ta vague travaille pour toi : c’est le moment le plus gratuit pour agir ailleurs.","Tu es libre.");
Q("macro",3,"Le jungler ennemi est vu en bot. Ton jungler devrait…",["Jouer du côté opposé : envahir ou objectif côté top","Aller en bot pour l’affronter","Rentrer en base","Rester au mid en attendant"],"Chaque apparition du jungler adverse dit où il n’est PAS.","Le côté opposé.");
Q("macro",3,"Après la chute de la tourelle extérieure bot, le duo bot…",["Déplace souvent la pression vers le mid ou les objectifs","Reste en bot pour attaquer la tourelle intérieure seul","Part en top à deux","Retourne farmer la jungle alliée"],"Une tourelle tombée libère du temps : ce temps s’utilise ailleurs.","Rotation.");
Q("macro",3,"Vous ne pouvez pas contester un objectif ennemi. Que faire ?",["Prendre un objectif ailleurs en échange","Rester en base pour ne rien donner","Contester quand même en infériorité","Poser des balises autour de l’objectif perdu"],"Tour contre dragon, larves contre dragon… On compare les valeurs.","Un échange.");
Q("macro",3,"Vous avez gagné un combat à 24:00, 3 ennemis morts pour 35 s. Nashor en vie. Choix ?",["Prendre le Nashor si c’est rapide et sûr, sinon la tourelle mid","Rentrer en base pour acheter","Chasser les 2 survivants dans leur jungle","Se séparer pour pousser les 3 lanes"],"Transformer un combat gagné en objectif. La poursuite peut tout rendre.","Convertir.");
Q("macro",4,"Avant le Nashor, pourquoi pousser les lanes latérales ?",["Pour obliger l’ennemi à défendre ses vagues ou à les perdre","Pour gagner de l’XP avant le combat","Pour empêcher le Nashor de se déplacer","Pour attirer les sbires dans la fosse"],"Des vagues qui arrivent sur l’ennemi le forcent à choisir.","Des problèmes pour l’ennemi.");
Q("macro",4,"La formation « 1-3-1 », c’est…",["Un joueur sur chaque lane latérale, trois au centre","Un joueur top, trois bot, un en jungle","Un tank devant, trois au milieu, un carry derrière","Une rotation : un objectif, trois tourelles, un Nashor"],"Elle étire l’adversaire : s’il se regroupe, les côtés tombent ; s’il se divise, le mid attaque.","Top, mid, bot.");
Q("macro",4,"Quelles conditions rendent un dive sous tourelle raisonnable ?",["Vague alliée sous la tourelle, surnombre, et quelqu’un pour prendre l’aggro","Être seul avec beaucoup de PV et Flash disponible","Avoir l’ultime prêt, peu importe la vague","Que la tourelle ait perdu au moins trois plaques"],"Les sbires alliés et un tank qui prend les tirs rendent le dive propre.","Préparer la tourelle.");
Q("macro",4,"Vous menez largement. Quelle erreur éviter ?",["Engager des combats sans objectif ni vision","Prendre des tourelles en groupe","Poser des balises profondes","Forcer le Nashor après un pick"],"Chaque combat inutile donne une chance de retour, et des primes, à l’adversaire.","Convertir.");
Q("macro",4,"Qui doit défendre un split push adverse ?",["Un joueur capable de le tenir seul, pendant que les 4 autres jouent ailleurs","Toute l’équipe, pour le tuer à coup sûr","Personne, les tourelles suffisent","Le support, qui a le moins d’objets"],"Envoyer deux joueurs, c’est lui donner ce qu’il cherche.","Un seul, le bon.");

/* ============================================================
   FICHES — l’étape d’encodage avant la récupération
   ============================================================ */
const LESSONS = {
  voc:["Le CS est le nombre de sbires et monstres achevés : ta source d’or principale.","Un gank, c’est un joueur qui arrive par surprise dans une lane pour créer un 2 contre 1.","Le poke inflige des dégâts à distance ; le peel protège un allié ; le kiting consiste à bouger entre les attaques.","Le « back » (touche B) te ramène en base en 8 secondes."],
  map:["3 lanes (top, mid, bot), une jungle entre elles, coupée par une rivière.","Un buisson cache ceux qui sont dedans : sans vision, tu ne vois pas qui s’y trouve.","Chaque équipe a 11 tourelles et 3 inhibiteurs. Une tourelle tire sur un champion qui attaque un de ses alliés.","Buff bleu : mana et accélération de compétence. Buff rouge : attaques qui brûlent et ralentissent."],
  lane:["Top : lane isolée, beaucoup de 1v1. Mid : lane courte, beaucoup de roams.","Bot : ADC (farm) + support (protection, vision). Le support laisse les sbires à l’ADC.","Le jungler parcourt la jungle et aide les lanes (gank).","Près de ta tourelle, tu es à l’abri. Loin d’elle, tu es une cible de gank."],
  champ:["Q, W, E : sorts de base. R : ultime, disponible au niveau 6.","Beaucoup de champions ont un passif qui change leur façon de jouer (accumuler, se réinitialiser…).","Certains sorts sont des contres directs : le Mur de vent de Yasuo bloque les projectiles.","Les projections en l’air ne peuvent pas être purgées : ce sont les contrôles les plus sûrs."],
  item:["Avant d’acheter, lis la compo adverse : qui fait le plus de dégâts (physiques ou magiques), qui se soigne, qui contrôle, qui tue en un combo.","Les bottes augmentent la vitesse, puis ajoutent un effet selon ta paire (armure, résistance magique…).","Contre des soins, achète de l’anti-soin : Morellonomicon (mage), Appel de l’exécuteur (AD), Armure de ronces (tank).","Le Sablier de Zhonya te met en stase : invulnérable, mais immobile.","L’objet de support génère de l’or et, amélioré, des balises."],
  eco:["Seul le dernier coup sur un sbire donne son or.","Un kill vaut 300 or de base ; tuer un joueur en série donne une prime.","Les plaques des tourelles extérieures donnent de l’or jusqu’à 14 minutes.","Mourir coûte aussi du temps : sbires, XP et objectifs perdus."],
  obj:["Pour gagner : détruire le Nexus adverse.","4 dragons pour une même équipe = âme du dragon. Le Dragon ancestral exécute les ennemis bas.","Nashor : sbires renforcés et rappel accéléré pour assiéger.","Héraut et larves : outils pour détruire les tourelles. Le jungler sécurise avec Châtiment."],
  rune:["5 arbres : Précision, Domination, Sorcellerie, Volonté, Inspiration.","Arbre principal : 1 rune clé + 3 runes. Arbre secondaire : 2 runes. Plus 3 fragments de stats.","Conquérant : combats longs. Électrocution : burst. Comète : poke. Poigne : échanges courts.","Gardien protège un allié ; Répercussion récompense les tanks qui engagent."],
  mu:["Un matchup, c’est ton champion contre celui d’en face : qui est plus fort, et quand.","Contre les grappins, reste derrière tes sbires.","Respecte les paliers adverses : niveau 6, premier objet.","Contre les soins : anti-soin. Contre le burst : objets défensifs."],
  macro:["Pousse ta vague avant de bouger : elle travaille pendant ton absence.","Chaque apparition du jungler ennemi dit où il n’est pas.","Compte les joueurs avant un combat : à 4 contre 5, on recule.","Transforme un avantage (kill, pick) en objectif, pas en poursuite."]
};

/* ============================================================
   MISES EN SITUATION — markers : k = me | ally | enemy | unk | ward
   coordonnées 0-100 : base bleue (toi) en bas à gauche
   options : [texte, verdict 2 optimal / 1 jouable / 0 à éviter, explication]
   ============================================================ */
const SCENARIOS = [
 { id:"s1", t:"Le mid a disparu", tier:1, role:"Mid", time:"6:10",
   ctx:"Ta vague pousse vers la tourelle adverse. Pas de balise dans la rivière. Le jungler ennemi n’a pas été vu depuis 1 minute et le mid adverse vient de disparaître de ta vision.",
   look:["Où est la dernière vision de la rivière ?","Combien d’ennemis ne sont pas visibles ?"],
   m:[{k:"me",x:57,y:43,l:"Toi"},{k:"unk",x:42,y:30,l:"Mid ?"},{k:"unk",x:66,y:52,l:"Jungler ?"},{k:"ally",x:12,y:40,l:"Top"}],
   q:"Que fais-tu ?",
   o:[["Tu recules vers ta tourelle, tu pings le mid manquant et tu poses une balise en rentrant",2,"Deux menaces invisibles : configuration classique d’un gank à deux. Reculer protège ta vie et le ping protège tes alliés si le mid est parti roam."],
      ["Tu finis la vague sous la tourelle ennemie, puis tu recules par le côté opposé à la rivière",1,"Tu gagnes quelques sbires, mais ces secondes suffisent à un gank à deux. Et tes alliés ne sont pas prévenus du roam possible."],
      ["Tu poses ta balise dans le buisson de rivière le plus proche pour vérifier",0,"Pour poser cette balise, tu dois t’approcher du buisson où les deux ennemis peuvent t’attendre : c’est un facecheck déguisé."]] },
 { id:"s2", t:"Des sbires sous la tourelle", tier:1, role:"ADC", time:"4:30",
   ctx:"Tu as 1 350 or et 60 % de PV. Une grosse vague ennemie arrive sur toi ; la tienne vient de mourir. Ton support a peu de mana.",
   look:["Où sont les vagues ?","Que coûte un retour maintenant ?"],
   m:[{k:"me",x:66,y:86,l:"Toi"},{k:"ally",x:60,y:84,l:"Sup"},{k:"enemy",x:80,y:86,l:"ADC"},{k:"enemy",x:82,y:80,l:"Sup"}],
   q:"Tu veux acheter. Quelle option ?",
   o:[["Tu farmes la vague sous ta tourelle, puis tu rentres une fois qu’elle est nettoyée",2,"Tu récupères l’or et l’XP de la vague, puis tu rentres sans rien laisser mourir sous ta tourelle. Ton support peut rentrer en même temps."],
      ["Tu rappelles immédiatement pour revenir le plus vite possible",1,"Jouable à 60 % de PV, mais toute la vague meurt sous ta tourelle pendant ton absence : or et XP perdus."],
      ["Tu restes jusqu’à avoir l’or de ton objet complet",0,"Tu retardes un composant déjà disponible, et ton support à court de mana ne peut plus te protéger."]] },
 { id:"s3", t:"Dragon dans une minute", tier:2, role:"Jungle", time:"8:55",
   ctx:"Dragon disponible à 9:00. Ton mid et ton bot ont la prio. Le jungler ennemi vient d’être vu en train de ganker le top. Ton top est à 40 % de PV sous sa tourelle.",
   look:["Où est le jungler ennemi ?","Qui peut bouger en premier vers la fosse ?"],
   m:[{k:"me",x:55,y:68,l:"Toi"},{k:"ally",x:52,y:46,l:"Mid"},{k:"ally",x:74,y:84,l:"ADC"},{k:"ally",x:72,y:88,l:"Sup"},{k:"enemy",x:14,y:22,l:"Jungler"},{k:"ally",x:12,y:60,l:"Top"},{k:"obj",x:68,y:70,l:"Dragon"}],
   q:"Que fais-tu ?",
   o:[["Tu démarres le dragon avec ton mid et ton duo bot dès qu’il apparaît",2,"Le jungler ennemi est à l’autre bout de la carte, sans Châtiment à proximité. Avec la prio sur les lanes proches, c’est un dragon presque gratuit."],
      ["Tu vas contre-ganker le top, puis tu reviens pour le dragon",1,"Tu peux sauver ton top, mais l’aller-retour te coûte la fenêtre : le jungler ennemi reviendra en même temps que toi."],
      ["Tu finis un camp de ta jungle puis le dragon, pour arriver niveau supérieur",0,"Trente secondes de plus laissent au jungler ennemi le temps de revenir. Le niveau gagné ne compense pas un dragon contesté."]] },
 { id:"s4", t:"13:30, plaques en jeu", tier:2, role:"Top", time:"13:30",
   ctx:"Ton adversaire direct vient de rappeler. Ta vague pousse vers sa tourelle, qui a encore 3 plaques. Le jungler ennemi est vu en bot. Tu as 900 or.",
   look:["Quelle heure est-il ?","Où est le jungler ennemi ?"],
   m:[{k:"me",x:14,y:22,l:"Toi"},{k:"enemy",x:80,y:84,l:"Jungler"}],
   q:"Quelle est la meilleure action ?",
   o:[["Tu pousses la vague et frappes la tourelle pour prendre des plaques avant 14:00",2,"Les plaques tombent à 14:00 : c’est de l’or qui disparaît. Le jungler ennemi est loin, ton adversaire est en base : c’est gratuit."],
      ["Tu rappelles aussi pour revenir en même temps que lui",1,"Tu évites un désavantage d’objets, mais tu laisses sur la table l’or de plusieurs plaques."],
      ["Tu pousses la vague puis tu pars aider ton mid",0,"Ton mid n’est pas en danger et la fenêtre de plaques ne revient jamais. Le roam n’a pas de cible."]] },
 { id:"s5", t:"Tenir le freeze", tier:2, role:"Top", time:"11:00",
   ctx:"Tu as 2 kills d’avance sur ton adversaire. La vague est gelée juste devant ta tourelle. Ton adversaire est à mi-PV et a besoin d’or. Ton jungler est côté bot.",
   look:["Où est la vague ?","Qui a besoin de farmer ?"],
   m:[{k:"me",x:12,y:62,l:"Toi"},{k:"enemy",x:12,y:44,l:"Top"}],
   q:"Que fais-tu ?",
   o:[["Tu gardes le freeze en ne donnant que les derniers coups",2,"Pour farmer, il doit s’avancer près de ta tourelle et s’exposer. Tu lui refuses or et XP, et ton avance grandit."],
      ["Tu pousses la vague pour prendre des plaques",1,"Tu gagnes un peu d’or, mais tu le libères : il farme en sécurité sous sa tourelle et ton avantage de lane s’efface."],
      ["Tu profites de l’avance pour roam en mid",0,"Tu casses ton freeze et ton adversaire récupère toute la vague. Ton avance vient justement de ce blocage."]] },
 { id:"s6", t:"Plongée en bot", tier:3, role:"Support", time:"7:40",
   ctx:"Niveau 6 pour vous deux. L’ADC ennemi est à 30 % de PV sous sa tourelle. Ta vague de 8 sbires vient d’arriver sous la tourelle. Ton jungler (un tank) arrive par la rivière.",
   look:["Qui peut prendre les tirs de la tourelle ?","Combien de sbires alliés sous la tourelle ?"],
   m:[{k:"me",x:78,y:84,l:"Toi"},{k:"ally",x:74,y:88,l:"ADC"},{k:"ally",x:70,y:74,l:"Jungler"},{k:"enemy",x:88,y:74,l:"ADC"},{k:"enemy",x:86,y:80,l:"Sup"}],
   q:"Comment joues-tu ?",
   o:[["Le jungler tank entre en premier et prend l’aggro, l’ADC et toi suivez pour achever",2,"Sbires sous la tourelle + surnombre + un tank pour prendre les tirs : c’est un dive propre."],
      ["Tu engages toi-même avec ton contrôle, le jungler suit derrière",1,"Ça peut marcher, mais c’est toi qui prends les premiers tirs de la tourelle, qui montent à chaque coup."],
      ["Tu attends que ton jungler se place dans le buisson, puis l’ADC ouvre avec un sort à distance",0,"Le sort de ton ADC sur un champion ennemi sous la tourelle attire l’aggro sur ton carry, et la fenêtre se referme pendant l’attente."]] },
 { id:"s7", t:"Peel ou engage ?", tier:2, role:"Support", time:"22:00",
   ctx:"Teamfight au mid. Tu joues un support protecteur. Un assassin ennemi vient de sauter sur ton ADC, qui est le plus riche de ton équipe. L’ADC ennemi est à portée de ton sort principal.",
   look:["Qui est la cible ?","Qui porte les dégâts de ton équipe ?"],
   m:[{k:"me",x:44,y:62,l:"Toi"},{k:"ally",x:40,y:64,l:"ADC"},{k:"enemy",x:42,y:60,l:"Assassin"},{k:"enemy",x:58,y:42,l:"ADC"},{k:"ally",x:52,y:52,l:"Top"}],
   q:"Que fais-tu ?",
   o:[["Tu gardes tes contrôles et boucliers pour l’assassin sur ton ADC",2,"Si ton ADC survit, il gagne le combat. Ton rôle ici est de retirer la menace sur lui."],
      ["Tu mets ton bouclier sur ton ADC et ton contrôle sur l’ADC ennemi",1,"Le bouclier aide, mais l’assassin reste libre de finir ton ADC. Ton contrôle était plus utile sur lui."],
      ["Tu utilises tout sur l’ADC ennemi : il est à portée et c’est leur carry",0,"Échange de carries défavorable : l’ADC ennemi est loin et protégé, le tien est déjà attaqué."]] },
 { id:"s8", t:"Pick sur le jungler", tier:3, role:"Mid", time:"25:10",
   ctx:"Vous venez de tuer le jungler adverse (réapparition dans 40 s). Le Nashor est disponible, vous avez de la vision dans la zone et vos 5 joueurs ont 70 % de PV. La tourelle bot extérieure ennemie est encore debout.",
   look:["Qui peut voler un objectif ?","Combien de temps a-t-on ?"],
   m:[{k:"me",x:40,y:36,l:"Toi"},{k:"ally",x:36,y:40,l:"Jng"},{k:"ally",x:44,y:40,l:"ADC"},{k:"ally",x:34,y:34,l:"Sup"},{k:"ally",x:28,y:26,l:"Top"},{k:"obj",x:32,y:30,l:"Nashor"},{k:"ward",x:40,y:22,l:""},{k:"ward",x:24,y:36,l:""}],
   q:"Quelle décision ?",
   o:[["Nashor immédiatement, à cinq",2,"Pas de Châtiment ennemi, un joueur de plus, de la vision : c’est la fenêtre idéale. Le buff servira à assiéger."],
      ["Nashor à quatre pendant que le top pousse la lane bot",1,"Le top attire du monde, mais le Nashor prend plus de temps à quatre et un 4 contre 4 devient possible si l’ennemi conteste."],
      ["Prendre d’abord la tourelle bot, puis le Nashor au retour",0,"Le jungler adverse aura réapparu : tu échanges un Nashor sûr contre une tourelle."]] },
 { id:"s9", t:"Nashor adverse", tier:3, role:"Top", time:"29:00",
   ctx:"Les 4 ennemis visibles commencent le Nashor, avec de la vision tout autour. Votre équipe est en retard de 3 000 or. Toi, tu es en split en bot près de leur tourelle d’inhibiteur, avec la Téléportation disponible.",
   look:["Peut-on gagner le combat au Nashor ?","Que peut-on prendre ailleurs ?"],
   m:[{k:"me",x:88,y:40,l:"Toi"},{k:"enemy",x:34,y:28,l:""},{k:"enemy",x:30,y:32,l:""},{k:"enemy",x:36,y:32,l:""},{k:"enemy",x:32,y:26,l:""},{k:"obj",x:32,y:30,l:"Nashor"},{k:"ally",x:40,y:62,l:"Équipe"}],
   q:"Quelle est la meilleure réponse ?",
   o:[["Tu prends la tourelle et l’inhibiteur bot pendant que ton équipe sécurise le dragon ou la vision",2,"Contester à 4 contre 4 en retard d’or et sans vision est perdant. L’échange cross-map limite les dégâts."],
      ["Tu te téléportes derrière la fosse pour un 5 contre 4 avec ton équipe",1,"Tentant, mais tu arrives dans une zone contrôlée par l’ennemi, en retard d’or. Si le combat tourne mal, c’est un ace."],
      ["Ton équipe poke l’entrée de la fosse pour forcer l’ennemi à arrêter",0,"Sans vision, s’approcher de la fosse expose ton équipe à un engage. Et le Nashor tombe vite à quatre."]] },
 { id:"s10", t:"Point d’âme adverse", tier:4, role:"Jungle", time:"24:00",
   ctx:"L’équipe adverse a 3 dragons (point d’âme). Le prochain dragon apparaît dans 1 minute. Vous êtes à 2 000 or de retard. Les vagues bot et mid arrivent vers vos tourelles.",
   look:["Peut-on laisser cette âme ?","Que faut-il faire des 60 prochaines secondes ?"],
   m:[{k:"me",x:48,y:62,l:"Toi"},{k:"ally",x:44,y:52,l:"Mid"},{k:"ally",x:64,y:86,l:"ADC"},{k:"ally",x:60,y:88,l:"Sup"},{k:"obj",x:68,y:70,l:"Dragon"},{k:"unk",x:74,y:60,l:"?"}],
   q:"Quel plan ?",
   o:[["Nettoyer les vagues bot et mid, puis poser et nettoyer la vision autour de la fosse 45 s avant, groupés",2,"L’âme peut décider la partie : il faut la contester. Ça se joue avant l’apparition, par les vagues et la vision, pour arriver en premier et chercher un pick."],
      ["Aller tout de suite poser la vision autour de la fosse, sans toucher aux vagues",1,"La vision est bonne, mais les vagues ennemies vont frapper vos tourelles pendant le combat : vous arriverez sans prio."],
      ["Prendre les larves et la tourelle top pendant qu’ils font le dragon",0,"Céder l’âme en retard d’or, c’est donner un bonus définitif qui ferme la partie. Les larves ne compensent pas."]] },
 { id:"s11", t:"Formation 1-3-1", tier:4, role:"Top", time:"32:00",
   ctx:"Ton équipe joue 1-3-1 : toi en top, votre ADC en bot, 3 au mid. L’ennemi envoie 2 joueurs sur toi et 3 au mid. Pas d’information sur le bot.",
   look:["Combien d’ennemis viennent sur toi ?","Que devient le bot ?"],
   m:[{k:"me",x:30,y:12,l:"Toi"},{k:"enemy",x:22,y:18,l:""},{k:"enemy",x:26,y:22,l:""},{k:"ally",x:46,y:54,l:"×3"},{k:"enemy",x:58,y:44,l:"×3"},{k:"ally",x:88,y:40,l:"ADC"}],
   q:"Que fais-tu ?",
   o:[["Tu recules sans mourir en gardant ces 2 ennemis occupés, et tu pings le mid pour jouer le 4 contre 3",2,"Tu as réussi le travail du split : attirer plus d’un joueur. Ton équipe joue en surnombre ailleurs. Ne pas mourir est la clé."],
      ["Tu te téléportes au mid pour un 4 contre 3 immédiat",1,"Possible si le combat démarre, mais tu libères les 2 ennemis qui rejoignent le mid en quelques secondes."],
      ["Tu tiens la vague sous ta tourelle en combattant les 2 ennemis",0,"À 1 contre 2, même sous tourelle, tu risques de mourir, ce qui annule tout l’intérêt de la formation."]] },

 /* ---------- CHOIX D’OBJETS : cat "item", comp à la place de la mini-carte ----------
    comp.me : [champion, or, objets] ; comp.foes : [rôle, champion, AD | AP | MIX, traits, objets] */
 { id:"a1", cat:"item", t:"Ils se soignent", tier:1, role:"ADC", time:"9:30",
   comp:{ me:["Caitlyn",1300,["Bottes"]], foes:[
     ["TOP","Aatrox","AD",["Soins","Combat long"]],["JGL","Vi","AD",["Contrôles"]],["MID","Vladimir","AP",["Soins"]],["ADC","Ezreal","AD",["Poke"]],["SUP","Soraka","AP",["Soins"]]] },
   ctx:"Premier retour en base. Trois ennemis se soignent : Aatrox en frappant, Vladimir avec ses sorts, Soraka en soignant ses alliés.",
   look:["Combien d’ennemis se soignent ?","Tes dégâts sont-ils physiques ou magiques ?"],
   q:"Que fais-tu de tes 1 300 or ?",
   o:[["Appel de l’exécuteur, puis tu reprends ton objet principal",2,"Trois sources de soins : l’anti-soin compte dès maintenant. L’Appel de l’exécuteur est la version physique, peu chère, et il évoluera en Rappel mortel."],
      ["Ton premier objet d’abord, l’anti-soin viendra en troisième",1,"Ton objet principal augmente tes dégâts, mais pendant 15 minutes chaque combat contre Aatrox ou Soraka se perd à cause de leurs soins."],
      ["Orbe de l’oubli, pour couper les soins de Soraka",0,"C’est l’anti-soin des mages : il donne de la puissance magique, inutile pour Caitlyn. L’équivalent physique est l’Appel de l’exécuteur."]] },
 { id:"a2", cat:"item", t:"Une équipe magique", tier:1, role:"Top", time:"7:00",
   comp:{ me:["Darius",1100,["Bottes"]], foes:[
     ["TOP","Kennen","AP",["Contrôles"]],["JGL","Amumu","AP",["Tank","Contrôles"]],["MID","Syndra","AP",["Burst","Contrôles"]],["ADC","Jinx","AD",["Attaques rapides"]],["SUP","Leona","AP",["Tank","Contrôles"]]] },
   ctx:"Tu rentres en base. Kennen te harcèle depuis le début, et toute leur équipe aligne les étourdissements.",
   look:["Combien d’ennemis font des dégâts magiques ?","Combien ont des contrôles ?"],
   q:"Quelles bottes ?",
   o:[["Sandales de mercure maintenant",2,"Quatre ennemis sur cinq font des dégâts magiques, et presque tous ont des contrôles : résistance magique et ténacité, c’est exactement la réponse."],
      ["Rien en bottes, tout dans ton premier objet",1,"Ton objet t’aide contre Kennen, mais tu restes plus longtemps sous chaque étourdissement, et ils en ont quatre."],
      ["Bottes d’acier renforcées maintenant",0,"Elles réduisent les dégâts des attaques de base : seule Jinx en dépend. Contre Kennen et Syndra, elles ne servent à rien."]] },
 { id:"a3", cat:"item", t:"Trois qui frappent vite", tier:2, role:"Top", time:"18:00",
   comp:{ me:["Sion",2600,["Bottes d’acier renforcées","Égide de feu solaire"]], foes:[
     ["TOP","Jax","AD",["Attaques rapides","Combat long"]],["JGL","Master Yi","AD",["Attaques rapides"]],["MID","Ahri","AP",["Burst"]],["ADC","Jinx","AD",["Attaques rapides"]],["SUP","Lulu","AP",["Boucliers"]]] },
   ctx:"Tu es le tank de ton équipe. En face, trois champions tuent avec leurs attaques de base, et presque aucun ne se soigne.",
   look:["Comment font-ils leurs dégâts : sorts ou attaques de base ?","Qui se soigne vraiment ?"],
   q:"Ton prochain objet ?",
   o:[["Cœur gelé",2,"De l’armure, et un passif qui réduit la vitesse d’attaque des ennemis proches : Jax, Master Yi et Jinx perdent une grosse part de leurs dégâts."],
      ["Armure de ronces",1,"Bonne armure contre les attaques de base, mais son anti-soin sert peu ici et elle ne ralentit pas leurs attaques comme le Cœur gelé."],
      ["Force de la nature",0,"De la résistance magique contre Ahri seule, alors que trois ennemis font des dégâts physiques."]] },
 { id:"a4", cat:"item", t:"L’ultime qui bloque", tier:2, role:"ADC", time:"24:00",
   comp:{ me:["Caitlyn",3000,["Bottes","Lame d’infini","Ouragan de Runaan"]], foes:[
     ["TOP","Sion","AD",["Tank","Contrôles"]],["JGL","Warwick","AD",["Soins","Suppression"]],["MID","Malzahar","AP",["Suppression"]],["ADC","Ashe","AD",["Contrôles"]],["SUP","Rakan","AP",["Contrôles"]]] },
   ctx:"Dans les deux derniers combats, tu t’es fait tuer sous l’ultime de Malzahar, puis sous celui de Warwick, sans pouvoir tirer.",
   look:["Quels contrôles ont décidé ces combats ?","La ténacité réduit-elle ce type de contrôle ?"],
   q:"Ton prochain objet ?",
   o:[["Cimeterre mercuriel",2,"Il te libère de presque tous les contrôles, suppressions comprises : l’ultime de Malzahar ou de Warwick s’arrête dès que tu l’actives."],
      ["Sandales de mercure à la place de tes bottes",1,"La ténacité raccourcit les étourdissements, mais pas les suppressions : contre Malzahar et Warwick, elle ne change rien."],
      ["Un troisième objet de dégâts pour tuer avant",0,"Malzahar n’a qu’un sort à lancer pour te neutraliser : plus de dégâts ne servent à rien si tu ne peux pas tirer."]] },
 { id:"a5", cat:"item", t:"Un mur de tanks", tier:2, role:"Mid", time:"26:00",
   comp:{ me:["Orianna",3000,["Bottes","Tourment de Liandry","Sablier de Zhonya"]], foes:[
     ["TOP","Malphite","AP",["Tank","Contrôles"]],["JGL","Sejuani","AP",["Tank","Contrôles"],["Force de la nature"]],["MID","Galio","AP",["Tank","Contrôles"]],["ADC","Kai’Sa","MIX",[]],["SUP","Braum","AP",["Tank","Contrôles"]]] },
   ctx:"Quatre ennemis ont beaucoup de résistance magique. Tes sorts ne leur enlèvent presque plus rien.",
   look:["Combien d’ennemis sont des tanks ?","Ont-ils peu ou beaucoup de résistance magique ?"],
   q:"Ton prochain objet ?",
   o:[["Bâton du vide",2,"Pénétration magique en pourcentage : plus la cible a de résistance magique, plus elle rapporte. C’est l’objet fait contre un mur de tanks."],
      ["Voile de la banshee",1,"Il te protège de Galio et de Kai’Sa, mais il ne t’aide pas à entamer leurs tanks : le combat traîne et tu finis par le perdre."],
      ["Morellonomicon",0,"De l’anti-soin, alors qu’aucun d’eux ne se soigne vraiment. Contre des tanks, c’est la pénétration qui compte."]] },
 { id:"a6", cat:"item", t:"L’anti-soin, mais quand ?", tier:3, role:"Mid", time:"8:30",
   comp:{ me:["Lux",1300,["Anneau de Doran","Bottes"]], foes:[
     ["TOP","Darius","AD",["Soins","Combat long"]],["JGL","Lee Sin","AD",["Mobilité"]],["MID","Vladimir","AP",["Soins"]],["ADC","Ezreal","AD",["Poke"]],["SUP","Soraka","AP",["Soins"]]] },
   ctx:"Vladimir regagne presque toute sa vie entre deux échanges, et Soraka soigne tout le bot.",
   look:["Leurs soins comptent-ils maintenant ou plus tard ?","Quel est l’anti-soin le moins cher pour un mage ?"],
   q:"Que fais-tu de tes 1 300 or ?",
   o:[["Orbe de l’oubli maintenant, Morellonomicon plus tard",2,"Le composant suffit à couper les soins de Vladimir en lane, et il retarde à peine ton objet principal. Tu le finiras quand les combats d’équipe commenceront."],
      ["Morellonomicon en premier objet complet",1,"L’anti-soin est là, mais tu retardes de plusieurs minutes l’objet qui fait tes dégâts : l’orbe seule suffisait pour l’instant."],
      ["Ton objet principal d’abord, l’anti-soin au troisième",0,"Vladimir gagne ses échanges grâce à ses soins dès maintenant. Sans anti-soin, tu perds la lane avant que ton objet fasse la différence."]] },
 { id:"a7", cat:"item", t:"Il perce ton armure", tier:4, role:"Jungle", time:"27:00",
   comp:{ me:["Sejuani",2800,["Bottes d’acier renforcées","Égide de feu solaire","Cœur gelé"]], foes:[
     ["TOP","Fiora","AD",["Soins","Combat long"]],["JGL","Lee Sin","AD",["Mobilité"]],["MID","Zed","AD",["Burst"]],["ADC","Jinx","AD",["Attaques rapides"],["Lame d’infini","Salutations de Lord Dominik","Ouragan de Runaan"]],["SUP","Nautilus","AP",["Tank","Contrôles"]]] },
   ctx:"Tu as déjà trois objets d’armure. Jinx vient de finir les Salutations de Lord Dominik et te fait fondre dans les combats.",
   look:["Que fait l’objet que Jinx vient d’acheter ?","Te manque-t-il plutôt de l’armure ou des PV ?"],
   q:"Ton prochain objet ?",
   o:[["Un objet surtout en PV : tu as déjà beaucoup d’armure",2,"Sa pénétration en pourcentage retire une part de ton armure, et l’armure ne vaut que s’il y a des PV derrière. Avec déjà trois objets d’armure, des PV te rendent plus solide qu’une quatrième pièce."],
      ["Une quatrième pièce d’armure, ils sont quatre AD",1,"L’instinct est juste, ils font des dégâts physiques, mais Jinx ignore une partie de cette armure et chaque point rapporte de moins en moins face à tes PV."],
      ["De la résistance magique contre Nautilus",0,"Nautilus est le seul à faire des dégâts magiques et ce n’est pas lui qui te tue : le problème, c’est Jinx."]] }
];

/* ============================================================
   LEXIQUE — pour les joueurs guidés
   ============================================================ */
const GLOSSARY = [
 ["ADC","Tireur de la bot lane, qui fait des dégâts avec ses attaques de base."],
 ["Aggro","Quand une tourelle ou un monstre te cible."],
 ["All-in","Engager avec tous ses sorts pour tuer."],
 ["Back / Recall","Retour à la base (touche B, 8 s)."],
 ["Bush","Buisson qui cache ceux qui sont dedans."],
 ["CC","Contrôle : étourdissement, ralentissement, projection…"],
 ["CS","Nombre de sbires et monstres achevés."],
 ["Dive","Attaquer un ennemi sous sa propre tourelle."],
 ["Facecheck","Entrer dans un buisson sans vision."],
 ["Farm","Accumuler de l’or en tuant des sbires et monstres."],
 ["Freeze","Garder la vague près de sa tourelle."],
 ["Gank","Attaque surprise sur une lane, souvent par le jungler."],
 ["Kite","Bouger entre ses attaques pour garder la distance."],
 ["Last hit","Porter le coup fatal à un sbire pour gagner son or."],
 ["Peel","Protéger un allié de ceux qui l’attaquent."],
 ["Poke","Dégâts à distance sans engagement."],
 ["Prio","Pouvoir quitter sa lane en premier sans perte."],
 ["Roam","Quitter sa lane pour aider ailleurs."],
 ["Scaling","Capacité d’un champion à devenir fort en fin de partie."],
 ["Shutdown","Prime pour avoir tué un joueur en série."],
 ["Smite","Châtiment : sort du jungler pour les monstres."],
 ["Split push","Pousser seul une lane latérale."],
 ["Tank","Champion résistant qui encaisse et engage."],
 ["Ward","Balise qui donne de la vision."]
];
</script>
