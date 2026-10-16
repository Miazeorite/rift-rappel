<script>
/* ============================================================
   PROFILS DE GUIDAGE
   ============================================================ */
const TIERS = {
  1:{name:"Recrue",   range:"Nouveau joueur",       color:"var(--teal)",   opts:3, hint:true,  lesson:"auto",  timer:0,  conf:true,  retry:true,  len:6,  dmin:1, dmax:2, scenMax:2, look:true,  full:true, path:true,
     does:["Un parcours pas à pas : les thèmes se débloquent un par un, du vocabulaire à la macro","Une fiche à lire avant chaque nouveau thème, puis des questions pour ancrer","3 choix de réponse et un indice à chaque question","Tes erreurs reviennent en fin de séance pour être corrigées tout de suite","Un rang par thème qui démarre en Fer et grimpe avec toi"]},
  2:{name:"Apprenti", range:"Fer → Or",             color:"var(--blue)",   opts:4, hint:true,  lesson:"first", timer:0,  conf:true,  retry:true,  len:8,  dmin:1, dmax:3, scenMax:3, look:true,  full:true, path:false,
     does:["Tous les thèmes ouverts, avec un ordre conseillé","Une fiche proposée la première fois que tu ouvres un thème","4 choix de réponse, indice disponible","Explications détaillées et erreurs rejouées en fin de séance","Mises en situation avec des repères de lecture","Un rang par thème, placements lancés depuis Argent"]},
  3:{name:"Confirmé", range:"Platine → Diamant",    color:"var(--violet)", opts:4, hint:false, lesson:"manual",timer:0,  conf:true,  retry:false, len:10, dmin:2, dmax:4, scenMax:4, look:false, full:false, path:false,
     does:["Accès libre à tout ; la difficulté suit ton rang dans chaque thème","Pas d’indice : tu récupères l’information seul","Explications courtes, centrées sur l’essentiel","Mises en situation complètes, sans repères de lecture"]},
  4:{name:"Élite",    range:"Maître → Challenger",  color:"var(--gold)",   opts:4, hint:false, lesson:"manual",timer:20, conf:false, retry:false, len:12, dmin:3, dmax:4, scenMax:4, look:false, full:false, path:false, scenTimer:40,
     does:["Placements lancés depuis Diamant : questions pointues d’emblée","Chrono de 20 secondes par question, 40 s par mise en situation","Aucun indice, aucune fiche imposée","Explications en une phrase : tu vérifies et tu enchaînes"]}
};
const RANKS = [["Fer","#8a7f78"],["Bronze","#a8744f"],["Argent","#9fb0c0"],["Or","#d9b45b"],["Platine","#4fb5a8"],["Émeraude","#3fbf7a"],["Diamant","#6d8df2"],["Maître","#b06ae0"],["Grand Maître","#e0605a"],["Challenger","#f2d27a"]];
function rankTier(r){ const i = RANKS.findIndex(x=>x[0]===r); if(i<0) return 2; if(i<=3) return 2; if(i<=6) return 3; return 4; }
const ROLES = [["Top","Combattants et tanks, souvent en 1v1"],["Jungle","Monstres, objectifs et ganks"],["Mid","Mages et assassins, beaucoup de roams"],["ADC","Tireur de la bot lane"],["Support","Protection, vision, engage"],["Je ne sais pas encore","On t’aidera à découvrir"]];
const PACES = [["5","Léger","5 questions par jour"],["10","Régulier","10 questions par jour"],["20","Intensif","20 questions par jour"]];
const INTERVALS = [0,1,2,4,8,16]; // jours par boîte (Leitner)
const DAY = 864e5;

/* ============================================================
   STOCKAGE LOCAL (dans ce navigateur uniquement)
   ============================================================ */
const KEY = "rift-rappel-v1";
function blank(){ return {profile:null, cards:{}, best:{}, lessons:{}, scen:{}, rank:{}, xp:0, streak:0, lastDay:null, daily:{day:null,count:0}}; }
let S = blank();
try{ const raw = localStorage.getItem(KEY); if(raw) S = Object.assign(blank(), JSON.parse(raw)); }catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
const today = () => new Date().toISOString().slice(0,10);

/* ============================================================
   OUTILS
   ============================================================ */
const $app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const catOf = id => CATS.find(c=>c.id===id);
const qById = id => QS.find(q=>q.id===id);
const T = () => TIERS[S.profile ? S.profile.tier : 1];
const pips = d => `<span class="pips" title="Difficulté ${d}/4" aria-label="Difficulté ${d} sur 4">${[1,2,3,4].map(i=>`<i class="${i<=d?"on":""}"></i>`).join("")}</span>`;
const firstSentence = s => (s.match(/^.*?[.!?](\s|$)/)||[s])[0].trim();
/* ---------- CLASSEMENT PAR THÈME (Fer → Challenger) ----------
   Une note par thème, façon MMR. Chaque question a sa propre cote selon
   sa difficulté. Réussir une question au-dessus de ton niveau rapporte
   beaucoup de LP ; rater une question facile en coûte beaucoup.
   Les 5 premières réponses d’un thème sont des matchs de placement. */
const LADDER = [["Fer","#8a7f78"],["Bronze","#b07a52"],["Argent","#a9b8c6"],["Or","#d9b45b"],["Platine","#4fbfae"],["Émeraude","#3fbf7a"],["Diamant","#7c95f5"],["Maître","#b774e6"],["Grand Maître","#e0605a"],["Challenger","#f4d98a"]];
const DIVS = ["IV","III","II","I"];
const PLACEMENTS = 5;
const Q_RATING = {1:500, 2:1200, 3:1900, 4:2700};
const SCEN_RATING = {1:900, 2:1500, 3:2300, 4:3000};
const SEED = {1:300, 2:1000, 3:1800, 4:2500};
function rankOf(r){
  if(r>=3400) return {i:9, name:"Challenger", div:"", lp:r-3400, apex:true};
  if(r>=3100) return {i:8, name:"Grand Maître", div:"", lp:r-3100, apex:true};
  if(r>=2800) return {i:7, name:"Maître", div:"", lp:r-2800, apex:true};
  const i=Math.floor(r/400); return {i, name:LADDER[i][0], div:DIVS[Math.floor((r%400)/100)], lp:r%100, apex:false};
}
const rankLabel = r => { const k=rankOf(r); return k.name+(k.div?" "+k.div:""); };
function catR(cat){ if(!S.rank) S.rank={}; if(!S.rank[cat]) S.rank[cat]={r:SEED[S.profile?S.profile.tier:1], n:0, peak:0}; return S.rank[cat]; }
const placed = cat => catR(cat).n>=PLACEMENTS;
function updateRank(cat, qR, score){
  const c=catR(cat), before=c.r, K = c.n<PLACEMENTS ? 120 : 50;
  const E = 1/(1+Math.pow(10,(qR-c.r)/400));
  let d = Math.round(K*(score-E)); if(score>=1 && d<2) d=2;
  c.r = Math.max(0, c.r+d); c.n++; if(c.n>=PLACEMENTS) c.peak=Math.max(c.peak||0,c.r);
  let note="";
  if(c.n===PLACEMENTS) note=`Placement terminé en ${catOf(cat).name} : ${rankLabel(c.r)}`;
  else if(c.n>PLACEMENTS && rankLabel(before)!==rankLabel(c.r)) note=(c.r>before?"Promotion en ":"Rétrogradation en ")+`${catOf(cat).name} : ${rankLabel(c.r)}`;
  return {cat, before, after:c.r, delta:c.r-before, note, placing:c.n<PLACEMENTS, n:c.n};
}
function emblem(cat, size){
  size=size||38; const c=catR(cat);
  if(c.n<PLACEMENTS) return `<svg class="emb" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 2 L36 11 V28 L20 38 L4 28 V11Z" fill="none" stroke="#5E6C86" stroke-width="2" stroke-dasharray="3 2"/><text x="20" y="25" text-anchor="middle" font-size="13" font-weight="700" fill="#8F9CB6" font-family="Chakra Petch, sans-serif">?</text></svg>`;
  const k=rankOf(c.r), col=LADDER[k.i][1];
  const wings = k.apex ? `<path d="M4 12 L0 6 L9 9Z M36 12 L40 6 L31 9Z" fill="${col}"/>`+(k.i>=8?`<path d="M20 0 L23 5 L17 5Z" fill="${col}"/>`:"")+(k.i===9?`<path d="M11 3 L14 7 L9 7Z M29 3 L31 7 L26 7Z" fill="${col}"/>`:"") : "";
  return `<svg class="emb" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true">${wings}<path d="M20 2 L36 11 V28 L20 38 L4 28 V11Z" fill="${col}" fill-opacity=".18" stroke="${col}" stroke-width="2"/><path d="M20 9 L29 14 V25 L20 31 L11 25 V14Z" fill="${col}"/><text x="20" y="${k.div?24:23.5}" text-anchor="middle" font-size="${k.div?9:7}" font-weight="700" fill="#0A101B" font-family="Chakra Petch, sans-serif">${k.div||"★"}</text></svg>`;
}
function rankText(cat){
  const c=catR(cat); if(c.n<PLACEMENTS) return `Placement ${c.n}/${PLACEMENTS}`;
  const k=rankOf(c.r); return `${k.name}${k.div?" "+k.div:""} · ${k.lp} LP`;
}
function rankBar(cat){ const c=catR(cat); if(c.n<PLACEMENTS) return `<div class="bar"><i style="width:${c.n/PLACEMENTS*100}%;background:#5E6C86"></i></div>`; const k=rankOf(c.r); return `<div class="bar"><i style="width:${k.apex?100:k.lp}%;background:${LADDER[k.i][1]}"></i></div>`; }
function bandFor(r){ if(r<800) return [1,2]; if(r<1600) return [1,3]; if(r<2400) return [2,4]; return [3,4]; }
function eligibleCat(cat){ const [a,b]=bandFor(catR(cat).r); let r=QS.filter(q=>q.c===cat && q.d>=a && q.d<=b); if(r.length<5) r=QS.filter(q=>q.c===cat && q.d>=a-1 && q.d<=b+1); return r; }
function eligible(cat){ return cat ? eligibleCat(cat) : CATS.flatMap(c=>eligibleCat(c.id)); }
function mastery(cat){ const el = eligible(cat); if(!el.length) return 0; return el.filter(q=>(S.cards[q.id]||{}).box>=3).length/el.length; }
function seenCount(cat){ return eligible(cat).filter(q=>S.cards[q.id]).length; }
function dueList(cat){ const now=Date.now(); return eligible(cat).filter(q=>{const c=S.cards[q.id]; return c && c.due<=now;}); }
function unlocked(cat){
  if(!T().path) return true;
  const i = PATH.indexOf(cat); if(i<=0) return true;
  return (S.best[PATH[i-1]]||0) >= .6;
}
function nextPathCat(){ return PATH.find(c=>unlocked(c) && (S.best[c]||0) < .6) || PATH.find(c=>mastery(c)<1) || PATH[0]; }
let toastTimer;
function toast(msg){ let t=document.querySelector(".toast"); if(!t){t=document.createElement("div");t.className="toast";t.setAttribute("role","status");document.body.appendChild(t);} t.textContent=msg; clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.remove(),2600); }
function touchDay(){
  const d = today();
  if(S.lastDay!==d){
    const y = new Date(Date.now()-DAY).toISOString().slice(0,10);
    S.streak = (S.lastDay===y) ? S.streak+1 : 1;
    S.lastDay = d;
  }
  if(S.daily.day!==d) S.daily={day:d,count:0};
}

/* ============================================================
   ÉTAT DE L’INTERFACE
   ============================================================ */
let V = { screen: S.profile ? "home" : "ob", ob:{step:0, data:{}}, quiz:null, lesson:null, scen:null, confirmReset:false };
let tick = null;
function go(screen, extra){ clearInterval(tick); tick=null; V.screen=screen; Object.assign(V, extra||{}); render(); window.scrollTo(0,0); }

/* ============================================================
   ONBOARDING
   ============================================================ */
function obSteps(){ return ["welcome","account"]; }
function buildTest(){
  const out=[];
  [1,2,3,4].forEach(d=>{ shuffle(QS.filter(q=>q.d===d)).slice(0,2).forEach(q=>out.push(q.id)); });
  return {items:out, i:0, answers:[], order:null};
}
function testTier(){
  const t = V.ob.data.test; if(!t) return 1;
  const pts = t.answers.reduce((s,a,i)=>s+(a?qById(t.items[i]).d:0),0); // max 20
  const hard = t.answers.filter((a,i)=>a && qById(t.items[i]).d===4).length;
  if(pts>=15 && hard>=1) return 4; if(pts>=10) return 3; if(pts>=4) return 2; return 1;
}
function declaredTier(){
  const d=V.ob.data;
  if(d.riot){ const r=d.riot.rank; if(!r) return (d.riot.level||0)<30?1:2; return r.tierIndex<=3?2:r.tierIndex<=6?3:4; }
  if(d.exp==="never"||d.exp==="casual") return 1;
  if(d.rank==="Non classé") return 2;
  return rankTier(d.rank);
}
function renderOb(){
  const steps = obSteps(), key = steps[V.ob.step], d = V.ob.data;
  const bar = `<div class="ob-steps" aria-hidden="true">${steps.map((s,i)=>`<i class="${i<=V.ob.step?"on":""}"></i>`).join("")}</div>`;
  let body="", canNext=true, nextLabel="Continuer", showBack = V.ob.step>0;
  if(key==="welcome"){
    body = `<div class="ob-art">${riftArt()}</div>
      <div class="eyebrow">Apprendre League of Legends par le rappel</div>
      <h1>Ce que tu retrouves de mémoire, tu le gardes.</h1>
      <p class="lead">Lire un guide ou regarder une vidéo encode l’information. Pour qu’elle tienne dans le temps, il faut aller la rechercher : c’est l’étape de récupération. Chaque question ici en est une.</p>
      <div class="loop">
        <div><span class="lic">${icon("book",20)}</span><b>Encodage</b><p>Tu lis une fiche, tu vois une situation.</p></div>
        <div><span class="lic">${icon("archive",20)}</span><b>Stockage</b><p>L’information est en mémoire, fragile.</p></div>
        <div><span class="lic">${icon("recall",20)}</span><b>Récupération</b><p>Tu la retrouves sans aide. C’est ce qui l’ancre.</p></div>
      </div>
      <p class="muted">Quelques questions pour savoir quel contenu te proposer et combien te guider. Deux minutes.</p>`;
    nextLabel="Commencer";
  } else if(key==="account"){
    body = `<div class="ob-art" style="height:120px">${riftArt()}</div><div class="eyebrow">Ton compte</div><h1>Quel est ton nom d’invocateur ?</h1>
      <p class="lead">Ton Riot ID, avec le #TAG si tu le connais. L’app prépare un résumé de tes parties et tes rangs par thème.</p>
      <input class="input" id="ob-riot" maxlength="30" placeholder="Pseudo#EUW" value="${esc(d.riotId||"")}" autocomplete="off" autocapitalize="off" spellcheck="false">
      <p class="muted" style="font-size:13.5px">Pour l’instant, les statistiques sont des <b>données d’exemple</b> générées à partir de ton nom : la connexion aux vraies parties viendra ensuite.</p>`;
    nextLabel="Entrer dans la Faille"; canNext = !!(d.riotId||"").trim();
  } else if(key==="exp"){
    const o=[["never","Je découvre le jeu","Jamais joué, ou tout juste le tutoriel"],["casual","Quelques parties","Je joue en normal, pas encore en classé"],["ranked","Je joue en classé","J’ai un rang, de Fer à Diamant"],["pro","Je joue à haut niveau","Maître et au-delà, ou compétitif"]];
    body = `<div class="eyebrow">Étape ${V.ob.step} · Expérience</div><h1>Où en es-tu avec League ?</h1>
      <div class="choices">${o.map(x=>`<button class="choice" data-a="ob-set" data-k="exp" data-v="${x[0]}" aria-pressed="${d.exp===x[0]}"><b>${x[1]}</b><span>${x[2]}</span></button>`).join("")}</div>`;
    canNext=!!d.exp;
  } else if(key==="rank"){
    const list = d.exp==="pro" ? RANKS.slice(6) : [["Non classé","#5e6c86"]].concat(RANKS);
    body = `<div class="eyebrow">Étape ${V.ob.step} · Rang</div><h1>Quel est ton rang actuel en solo/duo ?</h1>
      <div class="ranks">${list.map(r=>`<button class="rank" data-a="ob-set" data-k="rank" data-v="${r[0]}" aria-pressed="${d.rank===r[0]}"><i style="background:${r[1]}"></i>${r[0]}</button>`).join("")}</div>
      <p class="muted">Ton rang donne une première idée. Le petit test qui suit l’affine.</p>`;
    canNext=!!d.rank;
  } else if(key==="role"){
    body = `<div class="eyebrow">Étape ${V.ob.step} · Rôle</div><h1>Quel rôle joues-tu le plus ?</h1>
      <div class="choices two">${ROLES.map(r=>`<button class="choice" data-a="ob-set" data-k="role" data-v="${r[0]}" aria-pressed="${d.role===r[0]}"><b>${r[0]}</b><span>${r[1]}</span></button>`).join("")}</div>`;
    canNext=!!d.role;
  } else if(key==="pace"){
    body = `<div class="eyebrow">Étape ${V.ob.step} · Rythme</div><h1>Combien de temps par jour ?</h1>
      <p class="lead">Des séances courtes et régulières retiennent mieux qu’une longue séance de temps en temps.</p>
      <div class="choices">${PACES.map(p=>`<button class="choice" data-a="ob-set" data-k="pace" data-v="${p[0]}" aria-pressed="${d.pace===p[0]}"><b>${p[1]}</b><span>${p[2]}</span></button>`).join("")}</div>`;
    canNext=!!d.pace;
  } else if(key==="test"){
    if(!d.test) d.test = buildTest();
    const t=d.test;
    if(t.i < t.items.length){
      const q = qById(t.items[t.i]);
      if(!t.order) t.order = shuffle(q.o.map((_,i)=>i));
      body = `<div class="eyebrow">Test de placement · ${t.i+1} / ${t.items.length}</div>
        <div class="qmeta"><span class="code">${catOf(q.c).code}</span>${pips(q.d)}</div>
        <div class="qtext">${esc(q.q)}</div>
        <div class="opts">${t.order.map((oi,k)=>`<button class="opt" data-a="test-ans" data-v="${oi}"><span class="k">${"ABCD"[k]}</span><span>${esc(q.o[oi])}</span></button>`).join("")}
        <button class="opt" data-a="test-ans" data-v="-1"><span class="k">?</span><span class="muted">Je ne sais pas</span></button></div>
        <p class="muted">Pas de correction ici : réponds « je ne sais pas » plutôt que de deviner, le test sera plus juste.</p>`;
      canNext=false; nextLabel=null;
    } else {
      const ok = t.answers.filter(Boolean).length;
      body = `<div class="eyebrow">Test de placement</div><h1>Test terminé</h1>
        <p class="lead"><span class="num">${ok}</span> bonnes réponses sur <span class="num">${t.items.length}</span>, sur des questions de difficulté croissante.</p>`;
      nextLabel="Voir mon profil";
    }
  } else if(key==="result"){
    const dt = declaredTier(), tt = d.riot ? dt : (d.exp==="never" ? 1 : testTier());
    if(!d.tier) d.tier = d.riot ? dt : (d.exp==="never") ? 1 : tt;
    const tier = TIERS[d.tier];
    document.documentElement.style.setProperty("--tier", tier.color);
    const cmp = (dt!==tt && d.exp!=="never") ? `<div class="stack"><p class="muted">Ton ${d.exp==="casual"?"expérience":"rang"} suggère <b>${TIERS[dt].name}</b>, ton test suggère <b>${TIERS[tt].name}</b>. Choisis ton point de départ :</p>
        <div class="compare">
          <button class="choice" data-a="ob-set" data-k="tier" data-v="${tt}" aria-pressed="${d.tier===tt}"><b>${TIERS[tt].name} · d’après le test</b><span>Recommandé : basé sur ce que tu sais aujourd’hui</span></button>
          <button class="choice" data-a="ob-set" data-k="tier" data-v="${dt}" aria-pressed="${d.tier===dt}"><b>${TIERS[dt].name} · d’après ${d.exp==="casual"?"ton expérience":"ton rang"}</b><span>Tu pourras changer à tout moment</span></button>
        </div></div>` : "";
    body = `<div class="eyebrow">Ton profil</div>
      <div class="tiercard" style="--tier:${tier.color}">
        <div class="row" style="justify-content:space-between"><span class="pill tier">${tier.range}</span><span class="muted">${esc(d.role||"")}</span></div>
        <h2 style="margin-top:10px">${tier.name}</h2>
        <p class="muted" style="margin-top:4px">Voici comment l’app va te guider :</p>
        <ul class="checks">${tier.does.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </div>${cmp}`;
    nextLabel="Entrer dans la Faille";
  }
  $app.innerHTML = `<div class="ob"><div class="ob-in rise">${bar}${body}
    <div class="ob-foot">${showBack?`<button class="btn ghost" data-a="ob-back">Retour</button>`:"<span></span>"}
    ${nextLabel?`<button class="btn" data-a="ob-next" ${canNext?"":"disabled"}>${nextLabel}</button>`:""}</div></div></div>`;
  const ri=document.getElementById("ob-riot"); if(ri){ ri.focus(); ri.addEventListener("input",e=>{ d.riotId=e.target.value; const b=document.querySelector('[data-a="ob-next"]'); if(b) b.disabled=!e.target.value.trim(); }); ri.addEventListener("keydown",e=>{ if(e.key==="Enter" && e.target.value.trim()) act("ob-next"); }); const pl=document.getElementById("ob-platform"); if(pl) pl.addEventListener("change",e=>d.platform=e.target.value); }
  const inp=document.getElementById("ob-name"); if(inp){ inp.focus(); inp.addEventListener("input",e=>d.name=e.target.value); inp.addEventListener("keydown",e=>{if(e.key==="Enter") act("ob-next");}); }
}
function finishOb(){
  const d=V.ob.data;
  let id=(d.riotId||"").trim(); if(!id) return;
  if(!id.includes("#")) id+="#EUW";
  const data=fakeProfile(id);
  const r=data.rank, tier = !r ? 2 : r.tierIndex<=3 ? 2 : r.tierIndex<=6 ? 3 : 4;
  S.profile = {name:data.gameName, exp:"ranked", rank:r?r.tierFr:null, role:data.role, pace:10, tier, since:today()};
  S.rank = {};
  linkRiot(data, {riotId:data.riotId, platform:data.platform}, true);
  save(); go("home");
}

/* ============================================================
   SÉANCES DE QUESTIONS
   ============================================================ */
function weightedItems(len){
  const w=S.riot.data.weights||{}, now=Date.now();
  const cats=CATS.map(c=>c.id), tot=cats.reduce((a,c)=>a+(w[c]||1),0);
  let alloc=cats.map(c=>{const n=(w[c]||1)/tot*len; return {c, k:Math.floor(n), f:n-Math.floor(n)};});
  let left=len-alloc.reduce((a,x)=>a+x.k,0);
  alloc.slice().sort((a,b)=>b.f-a.f).forEach(x=>{ if(left>0){x.k++;left--;} });
  let out=[];
  for(const a of alloc){
    if(!a.k) continue;
    const pool=eligibleCat(a.c);
    const due=pool.filter(q=>{const c=S.cards[q.id];return c&&c.due<=now;});
    const fresh=shuffle(pool.filter(q=>!S.cards[q.id]));
    const rest=shuffle(pool.filter(q=>S.cards[q.id]&&S.cards[q.id].due>now));
    out=out.concat(due.concat(fresh,rest).slice(0,a.k));
  }
  return shuffle(out);
}
function buildSession(cat, mode){
  const t=T(), pool=eligible(cat), now=Date.now();
  let items;
  if(!cat && mode!=="review" && S.riot && S.riot.data){ items = weightedItems(t.len); }
  else if(mode==="review"){
    items = pool.filter(q=>{const c=S.cards[q.id];return c&&c.due<=now;}).sort((a,b)=>S.cards[a.id].due-S.cards[b.id].due).slice(0,t.len);
  } else {
    const due = pool.filter(q=>{const c=S.cards[q.id];return c&&c.due<=now;}).sort((a,b)=>S.cards[a.id].due-S.cards[b.id].due);
    let fresh = shuffle(pool.filter(q=>!S.cards[q.id]));
    if(t.full) fresh.sort((a,b)=>a.d-b.d);
    const rest = shuffle(pool.filter(q=>S.cards[q.id] && S.cards[q.id].due>now));
    items = due.slice(0,Math.ceil(t.len/2)).concat(fresh);
    items = items.concat(rest).slice(0,t.len);
    items = t.full ? items : shuffle(items);
  }
  return { cat, mode, items: items.map(q=>q.id), i:0, results:[], retried:{}, sel:null, phase:"ask", hint:false, order:null, xp:0, t0:0 };
}
function startQuiz(cat, mode){
  const q = buildSession(cat, mode);
  if(!q.items.length){ toast(mode==="review"?"Aucune révision due pour l’instant.":"Pas de question disponible ici."); return; }
  const t=T();
  if(cat && mode!=="review" && !S.lessons[cat] && (t.lesson==="auto"||t.lesson==="first")){ go("lesson",{lesson:{cat, then:q}}); return; }
  go("quiz",{quiz:q});
}
function optionOrder(q){
  const t=T(); let idx=[0,1,2,3];
  if(t.opts===3) idx=[0].concat(shuffle([1,2,3]).slice(0,2));
  return shuffle(idx);
}
function grade(qz, chosen, conf){
  const q = qById(qz.items[qz.i]), ok = chosen===0;
  const c = S.cards[q.id] || {box:0, n:0, ok:0};
  c.n++; if(ok) c.ok++;
  if(ok){
    if(conf==="sure" && !qz.hint) c.box = Math.min(5, c.box+1);
    else if(conf==="guess") c.box = 1;
    else c.box = Math.max(1, c.box);
  } else c.box = 0;
  c.due = Date.now() + INTERVALS[c.box]*DAY;
  S.cards[q.id]=c;
  const gain = ok ? (conf==="sure"?15:10) : 2;
  S.xp += gain; qz.xp += gain;
  touchDay(); S.daily.count++;
  const isRetry = !!qz.retried[q.id+"#"+qz.i];
  qz.rk = null;
  if(!isRetry){
    let sc = ok ? (conf==="sure"?1:conf==="hesit"?.85:.5) : 0;
    if(ok && qz.hint) sc=Math.min(sc,.7);
    const rk = updateRank(q.c, Q_RATING[q.d], sc);
    qz.rk = rk; qz.lp = qz.lp||{};
    if(!qz.lp[q.c]) qz.lp[q.c]={from:rk.before, n0:rk.n-1};
    qz.lp[q.c].to = rk.after; qz.lp[q.c].n = rk.n;
    if(rk.note) { qz.notes=(qz.notes||[]); qz.notes.push(rk.note); setTimeout(()=>toast(rk.note),50); }
  }
  qz.results.push({id:q.id, ok, conf, retry:isRetry});
  if(!ok && T().retry && !Object.keys(qz.retried).some(k=>k.startsWith(q.id+"#"))){
    qz.items.push(q.id); qz.retried[q.id+"#"+(qz.items.length-1)] = true;
  }
  qz.phase="feedback"; qz.sel=chosen; qz.conf=conf; qz.ok=ok;
  save();
}
function renderQuiz(){
  const qz=V.quiz, t=T(), q=qById(qz.items[qz.i]);
  if(!qz.order) qz.order = optionOrder(q);
  const cat=catOf(q.c), prog=(qz.i)/qz.items.length*100;
  const isRetry = !!qz.retried[q.id+"#"+qz.i];
  let opts = qz.order.map((oi,k)=>{
    let cls="opt";
    if(qz.phase==="feedback"){ if(oi===0) cls+=" ok"; else if(oi===qz.sel) cls+=" ko"; }
    else if(qz.pending===oi) cls+=" sel";
    return `<button class="${cls}" data-a="pick" data-v="${oi}" ${qz.phase==="feedback"?"disabled":""}><span class="k">${"ABCD"[k]}</span><span>${esc(q.o[oi])}</span></button>`;
  }).join("");
  let below="";
  if(qz.phase==="ask"){
    if(t.hint) below += qz.hint ? `<div class="hint">${icon("bulb",17)}<span><b>Indice :</b> ${esc(q.h)}</span></div>` : `<div><button class="btn ghost small" data-a="hint">${icon("bulb",15)}Voir un indice</button></div>`;
    if(t.conf && qz.pending!=null) below += `<div class="conf rise"><div class="eyebrow">Valider ta réponse · à quel point es-tu sûr·e ?</div>
      <div class="row"><button class="btn" data-a="conf" data-v="sure">Sûr·e</button><button class="btn ghost" data-a="conf" data-v="hesit">Hésitant·e</button><button class="btn ghost" data-a="conf" data-v="guess">Au hasard</button></div></div>`;
  } else {
    const r = qz.results[qz.results.length-1];
    let meta="";
    if(!qz.ok && qz.conf==="sure") meta="Tu étais sûr·e de toi : corriger une erreur dont on était certain est l’une des façons les plus efficaces de retenir.";
    else if(qz.ok && qz.conf==="guess") meta="Bonne réponse, mais au hasard : cette question reviendra vite.";
    else if(qz.ok && qz.hint) meta="Trouvée avec l’indice : elle reviendra pour être retrouvée sans aide.";
    else if(!qz.ok && t.retry && !isRetry) meta="Elle revient en fin de séance.";
    if(qz.sel===-1) meta="Temps écoulé. "+meta;
    const x = t.full ? q.x : firstSentence(q.x);
    below = `<div class="fb ${qz.ok?"good":"bad"} rise"><h3><span class="fbic">${icon(qz.ok?"check":"cross",16)}</span>${qz.ok?"Bien retrouvé":"Pas tout à fait"}</h3><p>${esc(x)}</p>${meta?`<p class="meta">${esc(meta)}</p>`:""}${qz.rk?`<div class="lpline">${emblem(q.c,26)}<span>${qz.rk.placing?`Placement ${qz.rk.n}/${PLACEMENTS} en ${esc(cat.name)}`:`<b class="${qz.rk.delta>=0?"up":"down"}">${qz.rk.delta>=0?"+":""}${qz.rk.delta} LP</b> · ${esc(cat.name)} · ${esc(rankText(q.c))}`}</span></div>`:""}</div>
      <div class="qfoot"><button class="btn" data-a="next" id="btn-next">${qz.i+1<qz.items.length?"Question suivante":"Voir le bilan"}</button></div>`;
  }
  const timer = (t.timer && qz.phase==="ask") ? `<div class="timer" id="timer"><i style="width:100%"></i></div>` : "";
  $app.innerHTML = `<div class="wrap">
    <div class="qhead"><button class="qx" data-a="quit" aria-label="Quitter la séance">✕</button><div class="bar"><i style="width:${prog}%"></i></div><span class="num muted">${qz.i+1}/${qz.items.length}</span></div>
    <div class="qcard rise">
      <span class="qwm" style="--c:${catCol(q.c)}">${icon(q.c,150)}</span>
      <div class="qmeta">${badge(q.c,30)}<span style="font-size:14px;font-weight:600">${cat.name}</span>${pips(q.d)}${isRetry?`<span class="pill">Deuxième essai</span>`:""}</div>
      ${timer}
      <div class="qtext">${esc(q.q)}</div>
      <div class="opts">${opts}</div>
      ${below}
    </div></div>`;
  if(t.timer && qz.phase==="ask"){
    if(!qz.t0) qz.t0=Date.now();
    clearInterval(tick);
    tick=setInterval(()=>{
      const el=document.querySelector("#timer i"); const left = t.timer - (Date.now()-qz.t0)/1000;
      if(el){ el.style.width = Math.max(0,left/t.timer*100)+"%"; el.parentElement.classList.toggle("low", left<6); }
      if(left<=0){ clearInterval(tick); grade(qz,-1,"sure"); render(); }
    },200);
  }
  const nb=document.getElementById("btn-next"); if(nb) nb.focus({preventScroll:true});
}
function renderResults(){
  const qz=V.quiz, first=qz.results.filter(r=>!r.retry), ok=first.filter(r=>r.ok).length, pct = first.length? ok/first.length : 0;
  let unlockMsg="";
  if(qz.cat && qz.mode!=="review"){
    const before = PATH.filter(unlocked);
    S.best[qz.cat] = Math.max(S.best[qz.cat]||0, pct);
    const after = PATH.filter(unlocked);
    if(T().path && after.length>before.length){ const nc = catOf(after[after.length-1]); unlockMsg=`<div class="hint rise"><b>Nouvelle étape débloquée :</b> ${esc(nc.name)}</div>`; }
    save();
  }
  const tomorrow = Object.values(S.cards).filter(c=>c.due<=Date.now()+DAY).length;
  const msg = pct>=.85 ? "Excellent rappel." : pct>=.6 ? "Solide. Les erreurs sont notées pour revenir au bon moment." : "Chaque erreur corrigée aujourd’hui se retient mieux demain.";
  const need = T().path && qz.cat && pct<.6 ? `<p class="muted">Atteins 60 % sur ce thème pour débloquer l’étape suivante.</p>` : "";
  $app.innerHTML = `<div class="wrap"><div class="stack rise" style="padding-top:30px">
    <div class="eyebrow">Bilan de séance${qz.cat?" · "+esc(catOf(qz.cat).name):""}</div>
    <div class="row" style="gap:18px">${scoreRing(pct)}
      <p class="muted"><span class="num">${ok}</span> / <span class="num">${first.length}</span> au premier essai · <span class="num">+${qz.xp}</span> XP</p></div>
    <p style="font-size:17px">${msg}</p>${need}${unlockMsg}
    ${qz.lp?`<div class="card"><div class="eyebrow" style="margin-bottom:10px">Classement</div><div class="lpres">${Object.entries(qz.lp).map(([c,v])=>{const d=v.to-v.from, pl=v.n<PLACEMENTS, justPlaced=v.n>=PLACEMENTS&&v.n0<PLACEMENTS;
      return `<div>${emblem(c,40)}<div><b>${esc(catOf(c).name)}</b><span class="muted">${pl?`Placement ${v.n}/${PLACEMENTS}`:justPlaced?`Placé ${rankLabel(v.to)} · ${rankOf(v.to).lp} LP`:`${rankLabel(v.from)!==rankLabel(v.to)?esc(rankLabel(v.from))+" → ":""}${esc(rankLabel(v.to))} · ${rankOf(v.to).lp} LP`}</span></div>${pl||justPlaced?"":`<b class="${d>=0?"up":"down"} num">${d>=0?"+":""}${d} LP</b>`}</div>`;}).join("")}</div></div>`:""}
    <div class="card"><div class="eyebrow" style="margin-bottom:6px">Détail</div><div class="recap">
      ${qz.results.map(r=>{const q=qById(r.id);return `<div>${icon(r.ok?"check":"cross",17,r.ok?"ok":"ko")}<span>${esc(q.q)}${r.retry?` <span class="muted">(2e essai)</span>`:""}</span></div>`;}).join("")}
    </div></div>
    <p class="muted"><span class="num">${tomorrow}</span> question${tomorrow>1?"s":""} à revoir d’ici demain. Revenir chaque jour, même 5 minutes, fait la différence.</p>
    <div class="row"><button class="btn" data-a="again">Nouvelle séance</button><button class="btn ghost" data-a="home">Accueil</button></div>
  </div></div>`;
}

/* ============================================================
   FICHES
   ============================================================ */
function renderLesson(){
  const L=V.lesson, cat=catOf(L.cat);
  $app.innerHTML = `<div class="wrap"><div class="lesson rise">
    <div class="stage"><span class="${L.then?"on":""}">1 · Encodage</span><span>2 · Récupération</span></div>
    <div class="lesson-h">${badge(L.cat,52)}<h1 style="font-size:30px">${esc(cat.name)}</h1></div>
    <p class="muted" style="margin-top:6px">Lis attentivement. Juste après, tu devras retrouver ces idées sans les avoir sous les yeux.</p>
    <ul>${LESSONS[L.cat].map((x,i)=>`<li style="--c:${catCol(L.cat)}"><span class="n">${i+1}</span><span>${esc(x)}</span></li>`).join("")}</ul>
    <div class="row" style="margin-top:20px">${L.then?`<button class="btn" data-a="lesson-go">J’ai lu, je m’entraîne</button>`:`<button class="btn" data-a="cat" data-v="${L.cat}">M’entraîner sur ce thème</button>`}<button class="btn ghost" data-a="home">Accueil</button></div>
  </div></div>`;
}

/* ============================================================
   MINI-CARTE
   ============================================================ */
const TOWERS=[[12,64],[12,38],[34,66],[42,58],[36,88],[62,88],[16,80],[22,78],[20,84]];
function miniMap(ms){
  const C={blue:"#4DA3F0",red:"#E4665F",gold:"#D9B45B",warn:"#E3A948",violet:"#A08CF2",text:"#E8EDF6",map:"#0D1822",map2:"#12222E",river:"#1D4A62",lane:"#3B4B60",faint:"#5E6C86"};
  const tw = TOWERS.map(([x,y])=>`<rect x="${x-1.4}" y="${y-1.4}" width="2.8" height="2.8" fill="${C["blue"]}" opacity=".85"/><rect x="${100-x-1.4}" y="${100-y-1.4}" width="2.8" height="2.8" fill="${C["red"]}" opacity=".85"/>`).join("");
  const mk = ms.map(m=>{
    let s="";
    if(m.k==="me") s=`<circle cx="${m.x}" cy="${m.y}" r="3.4" fill="${C["gold"]}" stroke="#fff" stroke-width=".8"/>`;
    else if(m.k==="ally") s=`<circle cx="${m.x}" cy="${m.y}" r="2.8" fill="${C["blue"]}" stroke="#0b1a2a" stroke-width=".6"/>`;
    else if(m.k==="enemy") s=`<circle cx="${m.x}" cy="${m.y}" r="2.8" fill="${C["red"]}" stroke="#2a0b0b" stroke-width=".6"/>`;
    else if(m.k==="unk") s=`<circle cx="${m.x}" cy="${m.y}" r="3" fill="none" stroke="${C["red"]}" stroke-width=".7" stroke-dasharray="1.4 1"/><text x="${m.x}" y="${m.y+1.3}" text-anchor="middle" font-size="3.6" font-weight="700" fill="${C["red"]}">?</text>`;
    else if(m.k==="ward") s=`<rect x="${m.x-1.5}" y="${m.y-1.5}" width="3" height="3" transform="rotate(45 ${m.x} ${m.y})" fill="${C["warn"]}"/>`;
    else if(m.k==="obj") s=`<circle cx="${m.x}" cy="${m.y}" r="4.2" fill="none" stroke="${C["violet"]}" stroke-width=".9"/>`;
    const lx = m.x>70 ? m.x-4.5 : m.x+4.5, anchor = m.x>70?"end":"start";
    const lab = m.l ? `<text x="${lx}" y="${m.y+1.2}" text-anchor="${anchor}" font-size="3.3" font-weight="600" fill="${C["text"]}" stroke="${C["map"]}" stroke-width="1" paint-order="stroke">${esc(m.l)}</text>` : "";
    return s+lab;
  }).join("");
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Mini-carte schématique de la situation">
    <rect width="100" height="100" fill="${C["map"]}"/>
    <path d="M22 30 L30 22 L46 40 L40 46Z M54 60 L60 54 L78 70 L70 78Z" fill="${C["map2"]}"/>
    <path d="M14 14 L86 86" stroke="${C["river"]}" stroke-width="8" stroke-linecap="round" opacity=".7"/>
    <g stroke="${C["lane"]}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 86 L12 12 L86 12"/><path d="M16 84 L84 16"/><path d="M14 88 L88 88 L88 14"/>
    </g>
    <circle cx="68" cy="70" r="3.4" fill="none" stroke="${C["faint"]}" stroke-width=".6"/>
    <circle cx="32" cy="30" r="3.4" fill="none" stroke="${C["faint"]}" stroke-width=".6"/>
    <circle cx="9" cy="91" r="7" fill="${C["blue"]}" opacity=".35"/><circle cx="91" cy="9" r="7" fill="${C["red"]}" opacity=".35"/>
    ${tw}${mk}
  </svg>`;
}

/* ============================================================
   MISES EN SITUATION
   ============================================================ */
function scenList(){ const t=T(); return SCENARIOS.filter(s=>s.tier<=t.scenMax && (t.dmin<3 || s.tier>=2)); }
/* Thème qui reçoit les LP : Macro pour les décisions de jeu, Objets pour les choix d’achat */
const scenCat = s => s.cat || "macro";
/* Tuile d’une situation, avec sa vignette */
function scenTile(s, sub){
  return `<button class="tile sc" data-a="scen" data-v="${s.id}">${scenThumb(s)}<div class="sc-body">
    <div class="row"><span class="code">${icon(ROLE_IC[s.role]||"top",12)}${esc(s.role).toUpperCase()} · ${s.time}</span>${pips(s.tier)}</div>
    <h3>${esc(s.t)}</h3><p>${sub}</p></div></button>`;
}
function renderScenList(){
  const list=scenList();
  const tiles = l => l.map(s=>{const b=S.scen[s.id];return scenTile(s, b!=null?(b===2?"Décision optimale trouvée":"Déjà tenté · à retenter"):"Pas encore tenté");}).join("");
  const game=list.filter(s=>!s.comp), buy=list.filter(s=>s.comp);
  $app.innerHTML = nav("scen")+`<div class="wrap"><div class="section" style="margin-top:26px">
    <div class="section-h"><h2 style="font-size:26px">Mises en situation</h2><span class="muted">${list.length} situations</span></div>
    <p class="muted" style="max-width:60ch">Un contexte, une décision. Il n’y a pas toujours une seule bonne réponse : chaque option est expliquée.</p></div>
    <div class="section"><div class="section-h"><h2>${icon("item",18)}Choix d’objets</h2><span class="muted">rang Objets</span></div>
      <p class="muted" style="font-size:13.5px;margin-top:-4px">Lis la composition adverse, puis choisis ton prochain achat.</p>
      <div class="grid">${tiles(buy)}</div></div>
    <div class="section"><div class="section-h"><h2>${icon("macro",18)}Décisions de jeu</h2><span class="muted">rang Macro</span></div>
      <div class="grid">${tiles(game)}</div></div>
  </div>`;
}
/* Composition adverse : remplace la mini-carte dans les choix d’objets */
const DMG = {AD:"Physique", AP:"Magique", MIX:"Mixte"};
function compPanel(s, t){
  const [champ, gold, items] = s.comp.me, foes = s.comp.foes;
  const n = k => foes.filter(f=>f[2]===k).length;
  const tally = t.look ? `<div class="tally">Dégâts adverses : <b class="num">${n("AD")}</b> physiques · <b class="num">${n("AP")}</b> magiques${n("MIX")?` · <b class="num">${n("MIX")}</b> mixte`:""}</div>` : "";
  return `<div class="comp">
    <div class="comp-me"><div class="row"><span class="code">${icon(ROLE_IC[s.role]||"top",13)}TOI</span><b>${esc(champ)}</b><span class="gold num">${icon("gold",15)} ${gold.toLocaleString("fr-FR")} or</span></div>
      <p>${items.length?esc(items.join(" · ")):"Aucun objet"}</p></div>
    <div class="comp-h">Équipe adverse</div>
    ${foes.map(([r,c,d,tags,it])=>`<div class="foe"><span class="code">${icon(ROLE_IC[r]||"top",13)}${esc(r)}</span><div>
      <div class="foe-n"><b>${esc(c)}</b><span class="dmg ${d.toLowerCase()}">${icon(d==="AP"?"ap":"ad",13)}${DMG[d]}</span></div>
      ${tags.length?`<div class="tags">${tags.map(g=>`<span>${TRAIT_IC[g]?icon(TRAIT_IC[g],12):""}${esc(g)}</span>`).join("")}</div>`:""}
      ${it?`<p>${esc(it.join(" · "))}</p>`:""}</div></div>`).join("")}
    ${tally}</div>`;
}
function renderScen(){
  const sc=V.scen, s=SCENARIOS.find(x=>x.id===sc.id), t=T();
  if(!sc.order) sc.order=shuffle([0,1,2]);
  const done = sc.pick!=null;
  const opts = sc.order.map((oi,k)=>{
    const o=s.o[oi]; let cls="opt long";
    if(done){ cls += o[1]===2?" ok":(oi===sc.pick?" ko":""); }
    return `<button class="${cls}" data-a="scen-pick" data-v="${oi}" ${done?"disabled":""}><span class="k">${"ABC"[k]}</span><span>${esc(o[0])}${done?`<div class="optx"><span class="verdict v${o[1]}">${["À éviter","Jouable","Optimal"][o[1]]}</span> ${esc(t.full?o[2]:firstSentence(o[2]))}</div>`:""}</span></button>`;
  }).join("");
  const timer = (t.scenTimer && !done) ? `<div class="timer" id="timer"><i style="width:100%"></i></div>` : "";
  $app.innerHTML = nav("scen")+`<div class="wrap">
    <div class="qhead"><button class="qx" data-a="scenlist" aria-label="Retour aux situations">←</button><span class="eyebrow">${icon(ROLE_IC[s.role]||"top",14)} ${esc(s.role)} · ${s.time}</span></div>
    <h1 style="font-size:26px;margin-top:12px">${esc(s.t)}</h1>
    <div class="scn">
      ${s.comp?compPanel(s,t):`<div class="mapbox">${miniMap(s.m)}
        <div class="legend"><span><i style="background:var(--gold)"></i>Toi</span><span><i style="background:var(--blue)"></i>Allié</span><span><i style="background:var(--red)"></i>Ennemi</span><span><i style="border:1px dashed var(--red)"></i>Position supposée</span></div></div>`}
      <div class="stack">
        ${timer}
        <p style="font-size:16px">${esc(s.ctx)}</p>
        ${t.look&&!done?`<div class="look"><b>À regarder avant de décider</b><ul>${s.look.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
        <div class="qtext" style="font-size:20px">${esc(s.q)}</div>
        <div class="opts">${opts}</div>
        ${done?`<div class="lpline">${emblem(scenCat(s),26)}<span>${sc.rk?(sc.rk.placing?`Placement ${sc.rk.n}/${PLACEMENTS} en ${esc(catOf(scenCat(s)).name)}`:`<b class="${sc.rk.delta>=0?"up":"down"}">${sc.rk.delta>=0?"+":""}${sc.rk.delta} LP</b> · ${esc(catOf(scenCat(s)).name)} · ${esc(rankText(scenCat(s)))}`):"Situation déjà jouée : pas de LP en jeu cette fois."}</span></div>`:""}
        ${done?`<div class="row"><button class="btn" data-a="scen-next">Situation suivante</button><button class="btn ghost" data-a="scen-retry">Recommencer</button></div>`:""}
      </div></div></div>`;
  if(t.scenTimer && !done){
    if(!sc.t0) sc.t0=Date.now();
    clearInterval(tick);
    tick=setInterval(()=>{ const el=document.querySelector("#timer i"); const left=t.scenTimer-(Date.now()-sc.t0)/1000;
      if(el){el.style.width=Math.max(0,left/t.scenTimer*100)+"%"; el.parentElement.classList.toggle("low",left<8);}
      if(left<=0){ clearInterval(tick); const worst=s.o.findIndex(o=>o[1]===0); pickScen(worst); toast("Temps écoulé : en jeu, ne pas décider est aussi une décision."); } },250);
  }
}
function pickScen(oi){
  const sc=V.scen, s=SCENARIOS.find(x=>x.id===sc.id), v=s.o[oi][1];
  sc.rk = (S.scen[s.id]==null) ? updateRank(scenCat(s), SCEN_RATING[s.tier], [0,.5,1][v]) : null;
  if(sc.rk && sc.rk.note) setTimeout(()=>toast(sc.rk.note),50);
  sc.pick=oi; S.scen[s.id]=Math.max(S.scen[s.id]??-1, v); S.xp += v===2?20:v===1?8:3; touchDay(); save(); clearInterval(tick); render();
}

/* ============================================================
   ACCUEIL
   ============================================================ */
function nav(cur){
  const t=T();
  const items=[["home","Accueil","home"],["scenlist","Situations","flag"],[t.lesson==="manual"?"lessons":"gloss", t.lesson==="manual"?"Fiches":"Lexique","book"],["profile","Profil","user"]];
  return `<header class="top"><div class="top-in">
    <div class="brand"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 L21 7 V17 L12 22 L3 17 V7 Z" fill="none" stroke="var(--gold)" stroke-width="1.8"/><path d="M12 7 A5 5 0 1 1 7.6 14.4" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-linecap="round"/><path d="M7 11.5 L7.6 14.6 L10.6 13.8" fill="none" stroke="var(--teal)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Rift Rappel</div>
    <nav class="nav">${items.map(([k,l,ic])=>`<button data-a="${k}" aria-current="${cur===k}">${icon(ic,16)}<span>${l}</span></button>`).join("")}</nav>
  </div></header>`;
}
function renderHome(){
  const p=S.profile, t=T();
  const due = dueList().length, daily = S.daily.day===today()?S.daily.count:0, goal=p.pace;
  const streak = (S.lastDay===today() || S.lastDay===new Date(Date.now()-DAY).toISOString().slice(0,10)) ? S.streak : 0;
  const r = S.riot && S.riot.data;
  const prio = new Set(r ? focusCats() : []);
  /* Thèmes prioritaires (points faibles) en premier, du plus urgent au moins urgent, puis les autres dans l’ordre habituel */
  const base = t.path ? PATH : CATS.map(c=>c.id), order = [...prio, ...base.filter(c=>!prio.has(c))];
  const themeTile = c => { const cat=catOf(c), u=unlocked(c);
    return `<button class="tile theme${u?"":" locked"}" data-a="cat" data-v="${c}" style="--c:${catCol(c)}">
      <div class="theme-top">${badge(c,44)}<div><h3>${esc(cat.name)}</h3><span class="rk num">${esc(rankText(c))}</span></div>${emblem(c,34)}</div>${prio.has(c)?`<span class="prio" style="margin-left:0">Priorité</span>`:""}
      <p>${u?esc(cat.blurb):"Verrouillé : valide d’abord le thème précédent."}</p>${rankBar(c)}</button>`; };
  const sl = scenList(), scen = [...sl.filter(s=>!s.comp).slice(0,2), ...sl.filter(s=>s.comp).slice(0,1)];
  $app.innerHTML = nav("home")+`<div class="wrap">
    <div class="banner">${riftArt()}<div class="eyebrow">Salut ${esc(p.name)}</div><h1>Que veux-tu travailler ?</h1>
      <div class="minis"><span class="pill tier">${t.name} · ${t.range}</span><span class="mini fire">${icon("flame",14)}<span class="num">${streak}</span> j</span><span class="mini">${icon("star",14)}<span class="num">${S.xp}</span> XP</span>${due?`<span class="mini">${icon("review",14)}<span class="num">${due}</span> à revoir</span>`:""}</div></div>
    ${r?accountStrip(r):""}
    ${r?overview(r):""}
    <div class="section"><div class="section-h"><h2>${icon("star",18)}Tes thèmes</h2>${r?`<button class="btn small" data-a="mix">Séance ciblée</button>`:`<button class="btn small" data-a="mix">Séance mixte</button>`}</div>
      <p class="muted" style="font-size:13.5px;margin-top:-4px">Choisis un thème. Chacun a son rang, de Fer à Challenger : 5 questions de placement, puis des LP à chaque réponse.${r?" Les thèmes marqués « Priorité » correspondent à tes points faibles.":""}</p>
      <div class="grid">${order.map(themeTile).join("")}</div></div>
    <div class="section"><div class="section-h"><h2>${icon("flag",18)}Mises en situation</h2><button class="link" data-a="scenlist">Tout voir</button></div>
      <div class="grid">${scen.map(s=>scenTile(s, esc(s.ctx.slice(0,80))+"…")).join("")}</div></div>
    <div class="section"><div class="section-h"><h2>${icon("flame",18)}Ta régularité</h2></div>
      <div class="stats" style="margin-top:0">
        <div class="stat fire">${icon("flame",18)}<b class="num">${streak}</b><span>jour${streak>1?"s":""} de suite</span></div>
        <div class="stat goal">${icon("target",18)}<b class="num">${Math.min(daily,goal)}/${goal}</b><span>objectif du jour</span></div>
        <div class="stat xp">${icon("star",18)}<b class="num">${S.xp}</b><span>XP</span></div>
      </div>
      <div class="card row" style="justify-content:space-between"><p>${due?`<b class="num">${due}</b> question${due>1?"s":""} à retrouver aujourd’hui : c’est le bon moment, juste avant l’oubli.`:"Aucune révision due. Les questions reviendront juste avant que tu les oublies."}</p>
      <button class="btn ${due?"":"ghost"} small" data-a="review" ${due?"":"disabled"}>${icon("review",15)}Réviser</button></div></div>
    <div class="why"><b>Pourquoi ça marche.</b> Une bonne réponse sûre fait revenir la question 1, 2, 4, 8 puis 16 jours plus tard. Une erreur la remet au début. Répondre « au hasard » compte comme une réponse à revoir.</div>
    <p class="legal">Rift Rappel n’est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ni de quiconque officiellement impliqué dans la production ou la gestion des propriétés de Riot Games. Riot Games et toutes les propriétés associées sont des marques ou des marques déposées de Riot Games, Inc.</p>
  </div>`;
}

/* ============================================================
   LEXIQUE, FICHES, PROFIL
   ============================================================ */
function renderGloss(){
  $app.innerHTML = nav("gloss")+`<div class="wrap"><div class="section" style="margin-top:26px"><h2 style="font-size:26px">Lexique</h2>
    <p class="muted">Les mots qu’on entend en partie. Garde-les en tête, ils reviennent dans les questions.</p>
    <div class="gloss">${GLOSSARY.map(g=>`<div><b>${icon(GLOSS_IC[g[0]]||"voc",16)}${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join("")}</div>
    <div class="section-h" style="margin-top:14px"><h2>Fiches par thème</h2></div>
    <div class="grid">${PATH.map(c=>`<button class="tile" data-a="lesson" data-v="${c}"><div class="row">${badge(c,36)}</div><h3>${esc(catOf(c).name)}</h3></button>`).join("")}</div>
  </div></div>`;
}
function renderLessons(){
  $app.innerHTML = nav("lessons")+`<div class="wrap"><div class="section" style="margin-top:26px"><h2 style="font-size:26px">Fiches</h2>
    <p class="muted">Des rappels courts, à consulter si tu en ressens le besoin. Le cœur de l’entraînement reste la récupération.</p>
    <div class="grid">${PATH.map(c=>`<button class="tile" data-a="lesson" data-v="${c}"><div class="row">${badge(c,36)}</div><h3>${esc(catOf(c).name)}</h3><p>${esc(catOf(c).blurb)}</p></button>`).join("")}</div>
    <div class="section-h" style="margin-top:14px"><h2>Lexique</h2></div>
    <div class="gloss">${GLOSSARY.map(g=>`<div><b>${icon(GLOSS_IC[g[0]]||"voc",16)}${esc(g[0])}</b><span>${esc(g[1])}</span></div>`).join("")}</div>
  </div></div>`;
}
function overall(){ const pl=PATH.filter(placed); if(pl.length<3) return `<span class="muted">Rang global après 3 thèmes placés (${pl.length}/3)</span>`; const avg=Math.round(pl.reduce((s,c)=>s+catR(c).r,0)/pl.length); return `<span class="pill" style="color:${LADDER[rankOf(avg).i][1]};border-color:currentColor">Global : ${esc(rankLabel(avg))}</span>`; }
function renderProfile(){
  const p=S.profile, t=T(), seen=Object.keys(S.cards).length, mastered=Object.values(S.cards).filter(c=>c.box>=3).length;
  $app.innerHTML = nav("profile")+`<div class="wrap"><div class="section" style="margin-top:26px">
    <div class="tiercard"><div class="row" style="justify-content:space-between"><span class="pill tier">${t.range}</span><span class="muted">${esc(p.role||"")}${p.rank?" · "+esc(p.rank):""}</span></div>
      <h2 style="margin-top:10px">${esc(p.name)} · ${t.name}</h2><ul class="checks">${t.does.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div class="section-h" style="margin-top:6px"><h2>Compte League</h2></div>
    ${S.riot?`<div class="card stack">${riotHead(S.riot.data)}<div class="row">${S.riot.demo?`<button class="btn ghost small" data-a="redo-ob">Changer de nom d’invocateur</button>`:`<button class="btn ghost small" data-a="riot-refresh">Actualiser l’analyse</button>`}<button class="btn ghost small danger" data-a="riot-unlink">Délier le compte</button></div></div>`:`<div class="card row" style="justify-content:space-between"><p>Aucun compte lié.</p><button class="btn small" data-a="link-riot">Connecter mon compte</button></div>`}
    <div class="section-h" style="margin-top:6px"><h2>Tes rangs</h2>${overall()}</div>
    <div class="rankgrid">${PATH.map(c=>`<button class="rankcell" data-a="cat" data-v="${c}">${emblem(c,46)}<b>${esc(catOf(c).name)}</b><span class="num">${esc(rankText(c))}</span>${placed(c)&&catR(c).peak>catR(c).r?`<span class="faint">Record : ${esc(rankLabel(catR(c).peak))}</span>`:""}</button>`).join("")}</div>
    <div class="stats"><div class="stat"><b class="num">${seen}</b><span>questions vues</span></div><div class="stat"><b class="num">${mastered}</b><span>bien ancrées</span></div><div class="stat"><b class="num">${QS.length}</b><span>au total</span></div></div>
    <div class="section-h" style="margin-top:10px"><h2>Changer de niveau de guidage</h2></div>
    <div class="tiers">${[1,2,3,4].map(n=>`<button class="choice" data-a="set-tier" data-v="${n}" aria-pressed="${p.tier===n}" style="--tier:${TIERS[n].color}"><b style="color:var(--tier)">${TIERS[n].name}</b><span>${TIERS[n].range}</span></button>`).join("")}</div>
    <div class="section-h" style="margin-top:10px"><h2>Rythme</h2></div>
    <div class="tiers">${PACES.map(x=>`<button class="choice" data-a="set-pace" data-v="${x[0]}" aria-pressed="${p.pace===+x[0]}"><b>${x[1]}</b><span>${x[2]}</span></button>`).join("")}</div>
    <div class="section-h" style="margin-top:10px"><h2>Recommencer</h2></div>
    <div class="row"><button class="btn ghost" data-a="redo-ob">Refaire l’accueil et le test</button>
      ${V.confirmReset?`<button class="btn ghost danger" data-a="reset-yes">Confirmer : tout effacer</button><button class="btn ghost" data-a="reset-no">Annuler</button>`:`<button class="btn ghost danger" data-a="reset">Effacer ma progression</button>`}</div>
    <p class="muted" style="font-size:13px">Ta progression est enregistrée dans ce navigateur. Les valeurs chiffrées du jeu (délais, or, timings) évoluent avec les patchs : le contenu se concentre sur les mécaniques de fond.</p>
  </div></div>`;
}

/* ============================================================
   COMPTE LEAGUE (API Riot via le serveur de l’app)
   ============================================================ */
const REGIONS=[["EUW1","Europe Ouest (EUW)"],["EUN1","Europe Nord & Est (EUNE)"],["NA1","Amérique du Nord (NA)"],["KR","Corée (KR)"],["BR1","Brésil (BR)"],["LA1","Amérique latine Nord (LAN)"],["LA2","Amérique latine Sud (LAS)"],["OC1","Océanie (OCE)"],["TR1","Turquie (TR)"],["RU","Russie (RU)"],["JP1","Japon (JP)"],["ME1","Moyen-Orient (ME)"],["SG2","Asie du Sud-Est (SEA)"],["TW2","Taïwan (TW)"],["VN2","Vietnam (VN)"]];
async function fetchRiot(params){
  let res, j;
  try{ res = await fetch("/api/profile?"+new URLSearchParams(params)); }
  catch(e){ throw new Error("Impossible de joindre le serveur de l’app. La connexion au compte ne fonctionne que sur la version hébergée."); }
  try{ j = await res.json(); }
  catch(e){ throw new Error("Le serveur de l’app ne répond pas. La connexion au compte ne fonctionne que sur la version hébergée."); }
  if(!res.ok) throw new Error(j.error || "Erreur du serveur.");
  return j;
}
async function connectRiot(where, demo){
  const st = where==="ob" ? V.ob.data : V.link;
  if(!demo){
    st.riotId = (document.getElementById(where+"-riot")||{}).value || st.riotId || "";
    st.platform = (document.getElementById(where+"-platform")||{}).value || st.platform || "EUW1";
    if(!/^.{3,16}#[A-Za-z0-9]{2,5}$/u.test(st.riotId.trim())){ st.err="Écris ton Riot ID complet, avec le #TAG (ex : Pseudo#EUW)."; return render(); }
  }
  st.loading=true; st.err=null; render();
  try{
    const data = await fetchRiot(demo?{demo:1}:{riotId:st.riotId.trim(), platform:st.platform});
    st.riot=data; if(demo){ st.riotId=data.riotId; st.platform=data.platform; }
    if(where==="ob"){ st.name=data.gameName; if(data.role) st.role=data.role; st.exp="ranked"; st.rank=data.rank?data.rank.tierFr:"Non classé"; delete st.tier; }
  }catch(e){ st.err=e.message; }
  st.loading=false; render();
}
function linkRiot(data, meta, reseedAll){
  S.riot = {data, riotId:meta.riotId||data.riotId, platform:meta.platform||data.platform, demo:!!data.demo};
  for(const c of CATS.map(x=>x.id)){
    const cur = S.rank && S.rank[c];
    if(reseedAll || !cur || !cur.n){ if(!S.rank) S.rank={}; S.rank[c]={r:(data.seed||{})[c] ?? SEED[S.profile?S.profile.tier:1], n:0, peak:0}; }
  }
  if(S.profile && data.role && (!S.profile.role || S.profile.role==="Je ne sais pas encore")) S.profile.role=data.role;
  save();
}
async function refreshRiot(){
  if(!S.riot) return;
  toast("Analyse de tes dernières parties…");
  try{
    const data = await fetchRiot(S.riot.demo?{demo:1}:{riotId:S.riot.riotId, platform:S.riot.platform, refresh:1});
    S.riot.data=data; save(); toast("Analyse mise à jour."); render();
  }catch(e){ toast(e.message); }
}
function focusCats(){ const w=(S.riot&&S.riot.data.weights)||{}; const top=Object.entries(w).filter(([,v])=>v>1.2).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c])=>c); return top.length?top:["macro"]; }
function ago(iso){ const m=Math.round((Date.now()-new Date(iso))/60000); if(m<2) return "à l’instant"; if(m<60) return `il y a ${m} min`; const h=Math.round(m/60); if(h<24) return `il y a ${h} h`; return `il y a ${Math.round(h/24)} j`; }
function riotHead(r){
  const rk = r.rank ? `${r.rank.tierFr}${r.rank.division?" "+r.rank.division:""} · ${r.rank.lp} LP` : "Non classé";
  return `<div class="acct">
    <div><div class="row" style="gap:8px"><b style="font-size:17px">${esc(r.riotId)}</b>${r.demo?`<span class="pill">Démo</span>`:""}</div>
      <span class="muted">${esc(rk)}${r.rank?` (${esc(r.rank.queue)})`:""}${r.role?" · "+esc(r.role):""}${r.winrate!=null?` · ${Math.round(r.winrate*100)} % de victoires sur ${r.games} parties`:""}</span></div>
    ${r.champions&&r.champions.length?`<div class="chips">${r.champions.slice(0,4).map(c=>`<span class="chip">${esc(c.name)} <span class="num muted">${c.games}</span></span>`).join("")}</div>`:""}
  </div>`;
}
function insightRow(i){ return `<div class="ins ${i.kind}"><span class="tag">${i.kind==="weak"?"À travailler":"Point fort"}</span><div><b>${esc(i.title)}</b><p>${esc(i.detail)} <span class="faint">→ ${esc(catOf(i.cat).name)}</span></p></div></div>`; }
function riotSection(){
  if(!S.riot) return `<div class="section"><div class="card row" style="justify-content:space-between"><p>Connecte ton compte League pour des séances basées sur tes vraies parties.</p><button class="btn ghost small" data-a="link-riot">Connecter</button></div></div>`;
  const r=S.riot.data;
  const mus=(r.matchups||[]).map(m=>({kind:"weak",cat:"mu",title:`Matchup difficile : ${m.champ} contre ${m.vs}`,detail:`${m.losses} défaite${m.losses>1?"s":""} sur ${m.games} partie${m.games>1?"s":""}.`}));
  const list=r.insights.filter(i=>i.kind==="weak").slice(0,4).concat(mus.slice(0,1), r.insights.filter(i=>i.kind==="strong").slice(0,2));
  return `<div class="section"><div class="section-h"><h2>Ton analyse</h2><span class="muted">${r.games} parties · ${ago(r.fetchedAt)}</span></div>
    <div class="card stack">${riotHead(r)}
      <div class="insights">${list.length?list.map(insightRow).join(""):`<p class="muted">Rien de marquant : tes indicateurs sont dans les repères de ton rang.</p>`}</div>
      <div class="row"><button class="btn ghost small" data-a="riot-refresh">Actualiser l’analyse</button></div>
    </div></div>`;
}
function acctForm(st, where){
  if(st.riot) return `<div class="card stack rise">${riotHead(st.riot)}
      <div class="insights">${st.riot.insights.slice(0,4).map(insightRow).join("")||`<p class="muted">Rien de marquant dans tes parties récentes.</p>`}</div>
      <p class="muted" style="font-size:13px">Tes rangs de départ par thème sont calculés à partir de ton rang et de ces indicateurs. <button class="link" data-a="riot-change" data-v="${where}">Changer de compte</button></p></div>`;
  if(st.loading) return `<div class="card row"><span class="spin" aria-hidden="true"></span><p>Analyse de tes parties… jusqu’à 30 secondes.</p></div>`;
  return `<div class="stack">
    <label class="eyebrow" for="${where}-riot">Riot ID</label>
    <input class="input" id="${where}-riot" placeholder="Pseudo#TAG" value="${esc(st.riotId||"")}" autocomplete="off" autocapitalize="off" spellcheck="false">
    <label class="eyebrow" for="${where}-platform">Région</label>
    <select class="input" id="${where}-platform">${REGIONS.map(([k,l])=>`<option value="${k}" ${(st.platform||"EUW1")===k?"selected":""}>${l}</option>`).join("")}</select>
    ${st.err?`<p class="err" role="alert">${esc(st.err)}</p>`:""}
    <div class="row"><button class="btn" data-a="riot-connect" data-v="${where}">Analyser mes parties</button><button class="btn ghost" data-a="riot-demo" data-v="${where}">Profil de démonstration</button></div>
    ${where==="ob"?`<p class="muted"><button class="link" data-a="ob-skipacct">Continuer sans compte</button> : un petit test remplacera l’analyse.</p>`:""}
  </div>`;
}
function renderLink(){
  const st=V.link||(V.link={});
  $app.innerHTML = nav("profile")+`<div class="wrap"><div class="section" style="margin-top:26px">
    <h2 style="font-size:26px">Connecter mon compte League</h2>
    <p class="muted" style="max-width:60ch">L’app lit tes 20 dernières parties. Les thèmes où tu n’as pas encore répondu reçoivent un rang de départ basé sur tes stats ; les autres gardent le leur.</p>
    ${acctForm(st,"link")}
    <div class="row">${st.riot?`<button class="btn" data-a="link-save">Lier ce compte</button>`:""}<button class="btn ghost" data-a="home">Annuler</button></div>
  </div></div>`;
  const inp=document.getElementById("link-riot"); if(inp) inp.addEventListener("keydown",e=>{ if(e.key==="Enter") connectRiot("link",false); });
}

/* ============================================================
   DONNÉES D’EXEMPLE (en attendant la vraie connexion Riot)
   Même forme que la réponse du serveur (lib/riot.js › analyze),
   générée à partir du nom : un même nom donne toujours le même profil.
   ============================================================ */
const USE_RIOT_API = false; // passer à true une fois l’app déployée avec une clé Riot
const BENCH = {
  csm:[4.5,5.0,5.5,6.0,6.5,7.0,7.3,7.8,8.0,8.3], vpmSup:[1.2,1.4,1.6,1.8,2.0,2.2,2.4,2.6,2.7,2.8], vpm:[.40,.50,.55,.60,.70,.80,.90,1.0,1.05,1.1],
  cwSup:[1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.0,4.5,4.5], cw:[.3,.5,.7,.9,1.1,1.3,1.5,1.7,1.8,2.0], deaths:[8,7.5,7,6.5,6,5.5,5,4.8,4.5,4.3],
  early:[2.5,2.2,2.0,1.8,1.6,1.4,1.2,1.1,1.0,.9], kp:[.45,.47,.49,.51,.53,.55,.57,.58,.59,.60], objp:[.45,.48,.51,.54,.57,.60,.63,.66,.68,.70]
};
const METRIC_CATS = { csm:{eco:1,lane:.6}, vpm:{map:1,macro:.3}, cw:{map:.7,item:.2}, deaths:{mu:.6,lane:.5,macro:.4}, early:{lane:1,mu:.8}, kp:{macro:.7}, objp:{obj:1,macro:.6}, antiheal:{item:1,mu:.4} };
const METRICS = [
  {k:"csm", label:"CS par minute", cat:"eco", fmt:v=>v.toFixed(1).replace(".",",")},
  {k:"vpm", label:"Score de vision par minute", cat:"map", fmt:v=>v.toFixed(2).replace(".",",")},
  {k:"cw", label:"Balises de contrôle par partie", cat:"map", fmt:v=>v.toFixed(1).replace(".",",")},
  {k:"deaths", label:"Morts par partie", cat:"mu", lower:true, fmt:v=>v.toFixed(1).replace(".",",")},
  {k:"early", label:"Morts avant 14 min", cat:"lane", lower:true, fmt:v=>v.toFixed(1).replace(".",",")},
  {k:"kp", label:"Participation aux kills", cat:"macro", fmt:v=>Math.round(v*100)+" %"},
  {k:"objp", label:"Participation aux objectifs", cat:"obj", fmt:v=>Math.round(v*100)+" %"},
  {k:"antiheal", label:"Anti-soin face aux soigneurs", cat:"item"}
];
const FAKE_CHAMPS = {Top:["Darius","Garen","Sett","Ornn","Fiora","Camille"],Jungle:["Lee Sin","Vi","Graves","Amumu","Kayn","Viego"],Mid:["Ahri","Orianna","Syndra","Yasuo","Viktor","Akali"],ADC:["Jinx","Caitlyn","Ezreal","Kai’Sa","Jhin","Ashe"],Support:["Thresh","Lulu","Nautilus","Leona","Nami","Karma"]};
function hashStr(str){ let h=2166136261; for(const ch of str){ h^=ch.codePointAt(0); h=Math.imul(h,16777619); } return h>>>0; }
function seeded(seed){ let x=(seed%2147483646)+1; return ()=>((x=x*16807%2147483647)-1)/2147483646; }
function fakeProfile(riotId){
  const [gameName, tag="EUW"] = riotId.split("#").map(x=>x.trim());
  const rnd = seeded(hashStr(riotId.toLowerCase()));
  const pickW = w => { let t=rnd()*w.reduce((a,b)=>a+b,0); for(let i=0;i<w.length;i++){ t-=w[i]; if(t<0) return i; } return w.length-1; };
  const ti = pickW([8,18,22,20,14,9,6,3]);
  const LAD = ["Fer","Bronze","Argent","Or","Platine","Émeraude","Diamant","Maître"];
  const division = ti>=7 ? "" : ["IV","III","II","I"][Math.floor(rnd()*4)];
  const lp = ti>=7 ? Math.floor(rnd()*250) : Math.floor(rnd()*100);
  const role = ["Top","Jungle","Mid","ADC","Support"][Math.floor(rnd()*5)];
  const sup = role==="Support", jgl = role==="Jungle";
  const target = {
    csm: BENCH.csm[ti]-(jgl?.8:0), vpm:(sup?BENCH.vpmSup:BENCH.vpm)[ti]+(jgl?.1:0), cw:(sup?BENCH.cwSup:BENCH.cw)[ti],
    deaths: BENCH.deaths[ti]+(sup?.5:0), early: BENCH.early[ti], kp: BENCH.kp[ti]+(sup||jgl?.08:0), objp: BENCH.objp[ti]
  };
  const lower = {deaths:true, early:true};
  const keys = Object.keys(target);
  const factor = {}; keys.forEach(k=>factor[k]=0.68+rnd()*0.62);
  // au moins deux vrais points faibles, pour que le profil soit parlant
  const weak = keys.filter(k=>factor[k]<0.9 && !(k==="csm"&&sup));
  for(const k of keys.filter(k=>!(k==="csm"&&sup)).sort(()=>rnd()-.5)){ if(weak.length>=2) break; if(!weak.includes(k)){ factor[k]=0.7+rnd()*0.12; weak.push(k); } }
  const values = {}; keys.forEach(k=>values[k] = lower[k] ? target[k]/factor[k] : target[k]*factor[k]);
  values.kp=Math.min(values.kp,.85); values.objp=Math.min(values.objp,.9);
  const ahGames = 3+Math.floor(rnd()*6), ahMissing = Math.floor(ahGames*rnd());
  const ratio = {}; keys.forEach(k=>{ if(k==="csm"&&sup) return; ratio[k] = lower[k] ? target[k]/values[k] : values[k]/target[k]; });
  ratio.antiheal = (ahGames-ahMissing)/ahGames/0.5;
  const cats = CATS.map(c=>c.id);
  const weights = Object.fromEntries(cats.map(c=>[c,1])), score = Object.fromEntries(cats.map(c=>[c,0]));
  for(const [k,r] of Object.entries(ratio)){ const d=Math.max(0,Math.min(1,1-r)), g=Math.max(0,Math.min(.5,r-1));
    for(const [c,w] of Object.entries(METRIC_CATS[k])){ weights[c]+=2.5*d*w; score[c]+=(g-d*1.5)*w; } }
  cats.forEach(c=>weights[c]=Math.round(Math.min(weights[c],4)*100)/100);
  const base = ti>=7 ? 2800+Math.min(lp,299) : ti*400+["IV","III","II","I"].indexOf(division)*100+lp;
  const seed = Object.fromEntries(cats.map(c=>[c, Math.max(0, Math.round(base+Math.max(-1,Math.min(.5,score[c]))*300))]));
  const insights=[];
  for(const m of METRICS){ const r=ratio[m.k]; if(r==null) continue;
    const kind = r<0.9 ? "weak" : r>=1.15 ? "strong" : null; if(!kind) continue;
    insights.push({key:m.k, kind, cat:m.cat, title:m.label, detail:"", score: kind==="weak"?1-r:r-1}); }
  insights.sort((a,b)=>a.kind===b.kind? b.score-a.score : a.kind==="weak"?-1:1);
  const pool = FAKE_CHAMPS[role].slice().sort(()=>rnd()-.5);
  const split=[8,5,4,3], wins=Math.round(20*(0.42+rnd()*0.2));
  const champions = pool.slice(0,4).map((n,i)=>({name:n, games:split[i], wins:Math.round(split[i]*(0.35+rnd()*0.35)), kda:1.6+rnd()*2}));
  const others = FAKE_CHAMPS[role].filter(n=>n!==champions[0].name);
  const matchups = [{champ:champions[0].name, vs:others[Math.floor(rnd()*others.length)], games:3, losses:2+Math.floor(rnd()*2)}];
  return { riotId:`${gameName}#${tag}`, gameName, platform:"EUW1", level:60+Math.floor(rnd()*400), iconId:null,
    rank:{queue:"Solo/Duo", tierIndex:ti, tierFr:LAD[ti], division, lp, wins:40+Math.floor(rnd()*80), losses:40+Math.floor(rnd()*80)},
    games:20, winrate:wins/20, role, values, targets:target, antiheal:{games:ahGames, missing:ahMissing}, ratio,
    insights, weights, seed, champions, matchups, fetchedAt:new Date().toISOString(), demo:true };
}
function metricRatio(r, m){
  if(r.ratio && r.ratio[m.k]!=null) return r.ratio[m.k];
  if(m.k==="antiheal") return null;
  const v=(r.values||{})[m.k], t=(r.targets||{})[m.k]; if(v==null||t==null) return null;
  return m.lower ? t/Math.max(v,.1) : v/Math.max(t,.01);
}
function accountStrip(r){
  const rk = r.rank ? `${r.rank.tierFr}${r.rank.division?" "+r.rank.division:""} · ${r.rank.lp} LP` : "Non classé";
  const col = r.rank ? LADDER[Math.min(r.rank.tierIndex,9)][1] : "#5E6C86";
  return `<div class="acctstrip">
    <div class="acct-id"><span class="rankdot" style="background:${col}"></span><div><b>${esc(r.riotId)}</b><span class="muted">${esc(rk)}${r.role?" · "+esc(r.role):""} · ${Math.round((r.winrate||0)*100)} % de victoires sur ${r.games} parties</span></div></div>
    <div class="chips">${(r.champions||[]).slice(0,4).map(c=>`<span class="chip">${esc(c.name)} <span class="num muted">${c.games}</span></span>`).join("")}${r.demo?`<span class="pill">Données d’exemple</span>`:""}</div>
  </div>`;
}
function overview(r){
  const tiles = METRICS.map(m=>{
    const sup = r.role==="Support";
    if(m.k==="csm" && sup) return `<div class="mtile na"><span class="mlabel">${icon(METRIC_IC[m.k],15)}${m.label}</span><b class="mval">—</b><span class="mref">Pas concerné en support</span></div>`;
    let val, ref;
    if(m.k==="antiheal"){ const a=r.antiheal||{games:0,missing:0}; val=`${a.games-a.missing}/${a.games}`; ref=`parties avec anti-soin, repère : au moins la moitié`; }
    else { const v=(r.values||{})[m.k], t=(r.targets||{})[m.k]; if(v==null) return ""; val=m.fmt(v); ref=`repère ${m.lower?"sous ":""}${m.fmt(t)}`; }
    const ra = metricRatio(r,m), st = ra==null ? "ok" : ra<0.9 ? "weak" : ra>=1.15 ? "strong" : "ok";
    const lab = {weak:"À travailler", ok:"Dans la moyenne", strong:"Point fort"}[st];
    return `<button class="mtile ${st}" data-a="cat" data-v="${m.cat}" aria-label="${esc(m.label)} : ${esc(val)}, ${lab}. Travailler ${esc(catOf(m.cat).name)}">
      <span class="mlabel">${icon(METRIC_IC[m.k],15)}${m.label}</span><b class="mval num">${val}</b><span class="mref">${ref}</span>
      <span class="mfoot"><span class="mstate">${lab}</span><span class="faint">${esc(catOf(m.cat).name)} →</span></span></button>`;
  }).join("");
  const mu = (r.matchups||[])[0];
  return `<div class="section"><div class="section-h"><h2>${icon("eye",18)}Vue générale</h2><span class="muted">${r.games} dernières parties · repères du rang ${r.rank?esc(r.rank.tierFr):""}</span></div>
    <div class="mgrid">${tiles}</div>
    ${mu?`<p class="muted" style="font-size:13.5px">Matchup le plus difficile : <b style="color:var(--text)">${esc(mu.champ)} contre ${esc(mu.vs)}</b>, ${mu.losses} défaites sur ${mu.games}. <button class="link" data-a="cat" data-v="mu">Travailler les matchups</button></p>`:""}
  </div>`;
}

/* ============================================================
   RENDU & ACTIONS
   ============================================================ */
function render(){
  if(S.profile) document.documentElement.style.setProperty("--tier", T().color);
  switch(V.screen){
    case "ob": return renderOb();
    case "home": return renderHome();
    case "quiz": return renderQuiz();
    case "results": return renderResults();
    case "lesson": return renderLesson();
    case "scenlist": return renderScenList();
    case "scen": return renderScen();
    case "gloss": return renderGloss();
    case "lessons": return renderLessons();
    case "profile": return renderProfile();
    case "link": return renderLink();
  }
}
function act(a, v, el){
  const d = V.ob.data;
  switch(a){
    case "ob-set": d[el.dataset.k] = el.dataset.k==="tier" ? +v : v;
      if(el.dataset.k==="exp"){ delete d.rank; delete d.test; delete d.tier; }
      if(el.dataset.k==="rank"){ delete d.tier; }
      return render();
    case "ob-next": { const steps=obSteps(); if(steps[V.ob.step]==="account" || steps[V.ob.step]==="result") return finishOb(); V.ob.step=Math.min(V.ob.step+1, obSteps().length-1); return render(); }
    case "ob-back": { const steps=obSteps(); if(steps[V.ob.step]==="result"){ delete d.tier; } if(steps[V.ob.step]==="test" && d.test && d.test.i>0 && d.test.i<d.test.items.length){ d.test=null; } V.ob.step=Math.max(0,V.ob.step-1); return render(); }
    case "test-ans": { const t=d.test, q=qById(t.items[t.i]); t.answers.push(+v===0); t.i++; t.order=null; delete d.tier; return render(); }
    case "home": return go("home");
    case "scenlist": return go("scenlist");
    case "gloss": return go("gloss");
    case "lessons": return go("lessons");
    case "profile": V.confirmReset=false; return go("profile");
    case "cat": if(!unlocked(v)){ toast("Valide d’abord l’étape précédente."); return; } return startQuiz(v,"learn");
    case "mix": return startQuiz(null,"learn");
    case "review": return startQuiz(null,"review");
    case "lesson": return go("lesson",{lesson:{cat:v, then:null}});
    case "lesson-go": S.lessons[V.lesson.cat]=true; save(); return go("quiz",{quiz:V.lesson.then});
    case "pick": { const qz=V.quiz; if(qz.phase!=="ask") return; if(T().conf){ qz.pending=+v; render(); } else { clearInterval(tick); grade(qz,+v,"sure"); render(); } return; }
    case "conf": { const qz=V.quiz; if(qz.pending==null) return; grade(qz,qz.pending,v); qz.pending=null; return render(); }
    case "hint": V.quiz.hint=true; return render();
    case "next": { const qz=V.quiz; qz.i++; qz.phase="ask"; qz.sel=null; qz.hint=false; qz.order=null; qz.t0=0; qz.pending=null; if(qz.i>=qz.items.length) return go("results"); return render(); }
    case "quit": return go("home");
    case "again": { const qz=V.quiz; return startQuiz(qz.cat, qz.mode==="review"?"learn":qz.mode); }
    case "scen": return go("scen",{scen:{id:v, pick:null, order:null, t0:0}});
    case "scen-pick": if(V.scen.pick==null) pickScen(+v); return;
    case "scen-retry": return go("scen",{scen:{id:V.scen.id, pick:null, order:null, t0:0}});
    case "scen-next": { const cur=SCENARIOS.find(s=>s.id===V.scen.id), l=scenList().filter(s=>!s.comp===!cur.comp); const i=l.findIndex(s=>s.id===V.scen.id); const n=l[(i+1)%l.length]; return go("scen",{scen:{id:n.id,pick:null,order:null,t0:0}}); }
    case "set-tier": S.profile.tier=+v; save(); toast(`Guidage : ${TIERS[+v].name}`); return render();
    case "set-pace": S.profile.pace=+v; save(); return render();
    case "ob-acct": d.acct=null; return render();
    case "ob-skipacct": d.acct="skip"; d.riot=null; return render();
    case "riot-connect": return connectRiot(v, false);
    case "riot-demo": return connectRiot(v, true);
    case "riot-change": { const st = v==="ob"?d:V.link; st.riot=null; st.err=null; return render(); }
    case "link-riot": if(!USE_RIOT_API){ V.ob={step:1,data:{riotId:""}}; return go("ob"); } V.link={}; return go("link");
    case "link-save": linkRiot(V.link.riot, {riotId:V.link.riotId, platform:V.link.platform}, false); toast("Compte lié. Tes séances sont maintenant ciblées."); return go("home");
    case "riot-refresh": return refreshRiot();
    case "riot-unlink": S.riot=null; save(); toast("Compte délié."); return render();
    case "redo-ob": V.ob={step:0,data:{name:S.profile.name}}; return go("ob");
    case "reset": V.confirmReset=true; return render();
    case "reset-no": V.confirmReset=false; return render();
    case "reset-yes": S=blank(); save(); V.confirmReset=false; V.ob={step:0,data:{}}; return go("ob");
  }
}
document.addEventListener("click", e=>{ const b=e.target.closest("[data-a]"); if(!b || b.disabled) return; act(b.dataset.a, b.dataset.v, b); });
document.addEventListener("keydown", e=>{
  if(V.screen!=="quiz" || e.target.tagName==="INPUT") return;
  const qz=V.quiz; if(!qz) return;
  const k=e.key.toUpperCase(), idx="ABCD".indexOf(k);
  if(qz.phase==="ask" && idx>=0 && qz.order && idx<qz.order.length){ act("pick", String(qz.order[idx])); }
  else if(qz.phase==="ask" && qz.pending!=null && ["1","2","3"].includes(e.key)){ act("conf", ["sure","hesit","guess"][+e.key-1]); }
});
render();
</script>
