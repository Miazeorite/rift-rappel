<script>
/* ============================================================
   ICÔNES & ILLUSTRATIONS — dessinées pour l’app (pas de visuel Riot, pas d’émoji)
   Trait 24×24, couleur héritée (currentColor). Couleurs de thème : --c-<id> dans :root.
   ============================================================ */
const ICONS = {
  /* thèmes */
  voc:'<path d="M4 5h16v11H10l-6 4z"/><path d="M8 9h8M8 12.5h5"/>',
  map:'<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  lane:'<path d="M5 19V5h14"/><path d="M5 19L19 5"/><path d="M5 19h14V5"/>',
  champ:'<path d="M4 18h16l1-10-5 4-4-7-4 7-5-4z"/><path d="M4 21h16"/>',
  item:'<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  eco:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  obj:'<path d="M2.5 12S6.5 5 12 5s9.5 7 9.5 7-4 7-9.5 7-9.5-7-9.5-7z"/><path d="M12 7.5c-1.3 2.5-1.3 6.5 0 9 1.3-2.5 1.3-6.5 0-9z"/>',
  rune:'<path d="M12 2.5l8 4.5v10l-8 4.5-8-4.5V7z"/><path d="M12 7.5v9M9 10.5l3-3 3 3"/>',
  mu:'<path d="M5 5l9.5 9.5M19 5l-9.5 9.5"/><path d="M12.5 16.5l4-4M11.5 16.5l-4-4"/><path d="M15.5 15.5L19 19M8.5 15.5L5 19"/>',
  macro:'<circle cx="5" cy="18" r="2.2"/><circle cx="12" cy="6" r="2.2"/><circle cx="19" cy="18" r="2.2"/><path d="M6.2 16l4.6-8M13.2 8l4.6 8M7.2 18h9.6"/>',
  /* rôles */
  top:'<path d="M5 19V5h14" stroke-width="2.6"/><path d="M5 19L19 5M19 5v14H5" opacity=".3"/>',
  jgl:'<path d="M5 19C5 10.5 10.5 5 19 5c0 8.5-5.5 14-14 14z"/><path d="M5 19l8.5-8.5"/>',
  mid:'<path d="M5 19L19 5" stroke-width="2.6"/><path d="M5 19V5h14M19 5v14H5" opacity=".3"/>',
  adc:'<path d="M5 19h14V5" stroke-width="2.6"/><path d="M5 19V5h14M5 19L19 5" opacity=".3"/>',
  sup:'<path d="M12 21s-7-3.8-7-10V5.5L12 3l7 2.5V11c0 6.2-7 10-7 10z"/><path d="M12 8.5v6M9 11.5h6"/>',
  /* traits */
  heal:'<path d="M12 20s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.6C20 15.4 12 20 12 20z"/>',
  chain:'<rect x="2.5" y="9" width="11" height="6" rx="3"/><rect x="10.5" y="9" width="11" height="6" rx="3"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  bolt:'<path d="M13 2.5L4.5 14H11l-1 7.5L19.5 10H13z"/>',
  tank:'<path d="M5 21V9l2-2 2 2 3-3 3 3 2-2 2 2v12z"/><path d="M10 21v-4h4v4"/>',
  fast:'<path d="M5 6l6 6-6 6M13 6l6 6-6 6"/>',
  long:'<path d="M6 3h12M6 21h12M7.5 3c0 5 4.5 6 4.5 9s-4.5 4-4.5 9M16.5 3c0 5-4.5 6-4.5 9s4.5 4 4.5 9"/>',
  poke:'<circle cx="12" cy="12" r="7"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
  shield:'<circle cx="12" cy="12" r="8.5"/><path d="M8 10a4.5 4.5 0 0 1 4-3"/>',
  dash:'<path d="M3 8h10.5a3 3 0 1 0-3-3M3 16h14a3 3 0 1 1-3 3M3 12h7"/>',
  /* types de dégâts */
  ad:'<path d="M19.5 4.5L9 15M19.5 4.5H15M19.5 4.5V9"/><path d="M6.5 12.5l5 5M4.5 19.5l3.5-3.5"/>',
  ap:'<path d="M12 3l2 6.2 6.2 2-6.2 2L12 19.5l-2-6.3-6.2-2 6.2-2z"/><path d="M19 3.5v3M17.5 5h3"/>',
  /* interface */
  home:'<path d="M4 11l8-7 8 7v9h-5.5v-6h-5v6H4z"/>',
  flag:'<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>',
  book:'<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  flame:'<path d="M12 21.5c4 0 7-2.9 7-6.8 0-5-5-7-5-12.2-3 2-4 5-4 7-1-1-2-2-2-3.8-2 2-3 5-3 9 0 3.9 3 6.8 7 6.8z"/>',
  target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  cross:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  review:'<path d="M20 11.5a8 8 0 1 0-2.3 5.6"/><path d="M20 4.5v7h-7"/>',
  bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  archive:'<rect x="3" y="4" width="18" height="5" rx="1.2"/><path d="M5 9v11h14V9M10 13h4"/>',
  recall:'<path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 4h14"/>',
  eye:'<path d="M2.5 12S6.5 5 12 5s9.5 7 9.5 7-4 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="3"/>',
  ward:'<path d="M12 2.5l5 7.5-5 11.5L7 10z"/><path d="M12 10v4"/>',
  skull:'<path d="M12 3a8 8 0 0 0-5 14.2V21h10v-3.8A8 8 0 0 0 12 3z"/><circle cx="9" cy="11.5" r="1.7"/><circle cx="15" cy="11.5" r="1.7"/><path d="M10.5 21v-2.5M13.5 21v-2.5"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  noheal:'<path d="M12 20s-8-4.6-8-10.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.6C20 15.4 12 20 12 20z"/><path d="M4 4l16 16"/>',
  gold:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};
const icon = (name, size, cls) => `<svg class="ic${cls?" "+cls:""}" width="${size||20}" height="${size||20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||""}</svg>`;

/* Couleur d’un thème, et pastille carrée avec son icône */
const catCol = id => `var(--c-${id})`;
const badge = (id, size) => `<span class="tbadge" style="--c:${catCol(id)};--s:${size||44}px">${icon(id, Math.round((size||44)*.5))}</span>`;

/* Rôles : noms longs (profil, situations) et codes courts (compos) */
const ROLE_IC = {Top:"top", Jungle:"jgl", Mid:"mid", ADC:"adc", Support:"sup", TOP:"top", JGL:"jgl", MID:"mid", SUP:"sup"};
const TRAIT_IC = {"Soins":"heal", "Contrôles":"chain", "Suppression":"lock", "Burst":"bolt", "Tank":"tank", "Attaques rapides":"fast",
  "Combat long":"long", "Poke":"poke", "Boucliers":"shield", "Mobilité":"dash"};
const METRIC_IC = {csm:"eco", vpm:"eye", cw:"ward", deaths:"skull", early:"clock", kp:"mu", objp:"obj", antiheal:"noheal"};

/* Lexique : une icône par mot */
const GLOSS_IC = {"ADC":"adc","Aggro":"target","All-in":"bolt","Back / Recall":"home","Bush":"jgl","CC":"chain","CS":"eco","Dive":"tank","Facecheck":"eye","Farm":"eco","Freeze":"long","Gank":"jgl","Kite":"dash","Last hit":"gold","Peel":"sup","Poke":"poke","Prio":"flag","Roam":"mid","Scaling":"star","Shutdown":"gold","Smite":"obj","Split push":"top","Tank":"tank","Ward":"ward"};

/* Illustration de la Faille : rivière, trois lanes, tourelles, lueurs. Décorative. */
function riftArt(){
  const tw=[[18,92],[18,62],[48,98],[60,86],[52,112],[86,112]];
  const towers = tw.map(([x,y])=>`<rect x="${x-2}" y="${y-2}" width="4" height="4" transform="rotate(45 ${x} ${y})" style="fill:var(--blue)"/><rect x="${200-x-2}" y="${120-y+0-2}" width="4" height="4" transform="rotate(45 ${200-x} ${120-y})" style="fill:var(--red)"/>`).join("");
  const sparks = [[150,30,1.4],[120,18,1],[172,62,1.2],[96,40,.9],[60,30,1.1],[140,90,1],[30,20,.8],[182,96,.9]]
    .map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:var(--gold)" opacity=".7"/>`).join("");
  return `<svg class="riftart" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="ra-glow" cx="50%" cy="50%" r="50%"><stop offset="0" style="stop-color:var(--teal);stop-opacity:.45"/><stop offset="1" style="stop-color:var(--teal);stop-opacity:0"/></radialGradient>
      <linearGradient id="ra-river" x1="0" y1="1" x2="1" y2="0"><stop offset="0" style="stop-color:var(--blue);stop-opacity:.05"/><stop offset=".5" style="stop-color:var(--teal);stop-opacity:.5"/><stop offset="1" style="stop-color:var(--violet);stop-opacity:.05"/></linearGradient>
    </defs>
    <path d="M-10 70 C 50 80, 70 40, 110 50 S 170 20, 210 10" style="stroke:url(#ra-river)" stroke-width="16" fill="none" stroke-linecap="round"/>
    <g fill="none" style="stroke:var(--line2)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 116 L14 8 L190 8"/><path d="M18 112 L186 10"/><path d="M14 116 L196 116 L196 12"/>
    </g>
    <circle cx="100" cy="62" r="34" style="fill:url(#ra-glow)"/>
    <path d="M100 46 L114 54 V70 L100 78 L86 70 V54Z" fill="none" style="stroke:var(--gold)" stroke-width="1.6"/>
    <path d="M100 54 A8 8 0 1 1 93 66" fill="none" style="stroke:var(--teal)" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="70" cy="74" r="5" fill="none" style="stroke:var(--violet)" stroke-width="1.2" opacity=".8"/>
    <circle cx="132" cy="44" r="5" fill="none" style="stroke:var(--violet)" stroke-width="1.2" opacity=".8"/>
    ${towers}${sparks}
    <circle cx="10" cy="112" r="14" style="fill:var(--blue)" opacity=".25"/><circle cx="192" cy="8" r="14" style="fill:var(--red)" opacity=".25"/>
  </svg>`;
}

/* Anneau de score (bilan de séance) */
function scoreRing(pct){
  const r=46, c=2*Math.PI*r, col = pct>=.85?"var(--good)":pct>=.6?"var(--gold)":"var(--red)";
  return `<div class="ring"><svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="${r}" fill="none" style="stroke:var(--panel2)" stroke-width="9"/>
    <circle cx="55" cy="55" r="${r}" fill="none" style="stroke:${col}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-pct)}" transform="rotate(-90 55 55)"/></svg>
    <b class="num"><span>${Math.round(pct*100)}<small>%</small></span></b></div>`;
}

/* Vignette d’une mise en situation : mini-carte réduite, ou les cinq ennemis colorés par type de dégâts */
function scenThumb(s){
  if(s.comp) return `<div class="thumb comp-thumb">${s.comp.foes.map(f=>`<span class="dot ${f[2].toLowerCase()}" title="${esc(f[1])}">${icon(ROLE_IC[f[0]]||"top",12)}</span>`).join("")}</div>`;
  return `<div class="thumb">${miniMap(s.m)}</div>`;
}
</script>
