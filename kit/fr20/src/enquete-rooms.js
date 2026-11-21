/* ===== L'enquête: rooms, items and script. Style test: the museum hall (salle des Trésors). ===== */
const VP=[640,-400];
function floorPlanks(y0,y1,step){ const k=(y1-VP[1])/(y0-VP[1]); let d='';
 for(let x=-760;x<=2040;x+=step){ const x2=VP[0]+(x-VP[0])*k; d+=`M${x},${y0} L${x2.toFixed(1)},${y1} `; }
 let j=''; const rows=[452,462,474,488,505,525,548,575,606,642,684,732,790];
 rows.forEach((y,r)=>{ const kk=(y-VP[1])/(y0-VP[1]); const ky=(rows[r+1]||800);
  for(let i=0,x=-760;x<=2040;x+=step,i++){ if((i+r)%3) continue; const xa=VP[0]+(x-VP[0])*kk, xb=VP[0]+(x+step-VP[0])*kk; j+=`M${xa.toFixed(1)},${y} L${xb.toFixed(1)},${y} `; } });
 return `<path d="${d}" stroke="#20150B" stroke-width="1.6" opacity=".42" fill="none"/><path d="${j}" stroke="#20150B" stroke-width="1.4" opacity=".38" fill="none"/>
  <path d="${d}" stroke="#C08A55" stroke-width=".8" opacity=".10" fill="none" transform="translate(1.6 0)"/>`; }
function bootPrint(x,y,sc,left){ return `<g transform="translate(${x} ${y}) scale(${sc} ${sc*.42}) ${left?'scale(-1 1)':''}" fill="#3A2716">
 <path d="M-7,-30 C-2,-34 7,-32 8,-22 C9,-12 6,-4 4,0 C0,4 -6,2 -7,-4 C-9,-12 -10,-24 -7,-30 Z" opacity=".72"/>
 <path d="M-5,6 C-1,4 5,5 5,10 C5,16 -3,18 -5,13 Z" opacity=".72"/>
 <path d="M-4,-24 h9 M-5,-16 h11 M-5,-8 h10" stroke="#20150B" stroke-width="1.3" opacity=".4"/></g>`; }
function evidenceTent(x,y,n,sc){ return `<g transform="translate(${x} ${y}) scale(${sc})">${shadow(0,1,16,4,.35,'blurS')}
 <path d="M-13,0 L-6,-30 L6,-30 L13,0 Z" fill="#F2C230"/><path d="M0,-30 L6,-30 L13,0 L2,0 Z" fill="#C9961C"/>
 <path d="M-6,-30 L6,-30" stroke="#FFF1B8" stroke-width="1.4"/>
 <text x="-2" y="-9" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="15" fill="#1A1814">${n}</text></g>`; }

function advDefs(){ const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 const d= lg('mWall',['#5C6B72','#435159','#323D44','#283138'])
  +lg('mWallV',['#000','#000'],0,1)
  +lg('mWain',['#6A4529','#4E321D','#3A2414'])
  +lg('mRail',['#9A6E45','#6E4A2C'],0,1)
  +lg('mFloor',['#7A5535','#5E402A','#4A3220'],0,1)
  +lg('mFloorH',['#FFE6C0','#FFE6C0'])
  +lg('moon',['#2B3C60','#4E668E','#8EA6C8'],0,1)
  +lg('glassG',['#DDEBF3','#9FB6C6'],1,1)
  +lg('velvet',['#3E4E86','#2A3766','#18213F'])
  +lg('brass',['#F0D58A','#C69A44','#7E5E22'])
  +lg('banner',['#93353A','#742629','#561A1D'])
  +lg('ped',['#F3EDE1','#DCD3C2','#B5AA95'])
  +lg('pedTop',['#FBF7EF','#E9E1D2'])
  +lg('leather',['#6B4B38','#4A3326','#33231A'])
  +lg('benchWood',['#8A5A34','#6A4224','#4A2C16'])
  +lg('door',['#14181C','#232B31'],0,1)
  +lg('caseIn',['#2E3A42','#1C252B'],0,1)
  +lg('sashW',['#B3322B','#8E241F'])
  +lg('frameGold',['#E6C676','#B8913E','#7A5A20'])
  +`<linearGradient id="beam" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="#C9DAF0" stop-opacity=".28"/><stop offset="1" stop-color="#C9DAF0" stop-opacity=".02"/></linearGradient>`
  +`<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE4A8" stop-opacity=".30"/><stop offset="1" stop-color="#FFE4A8" stop-opacity="0"/></linearGradient>`
  +`<radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFDFA0" stop-opacity=".30"/><stop offset="1" stop-color="#FFDFA0" stop-opacity="0"/></radialGradient>`
  +`<radialGradient id="vig" cx=".45" cy=".42" r=".75"><stop offset=".55" stop-color="#05070C" stop-opacity="0"/><stop offset="1" stop-color="#05070C" stop-opacity=".62"/></radialGradient>`
  +`<radialGradient id="pearlG" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".5" stop-color="#ECE6DA"/><stop offset="1" stop-color="#A89E8C"/></radialGradient>`
  +`<clipPath id="winClip"><path d="M72,430 V174 A68,68 0 0 1 208,174 V430 Z"/></clipPath>`
  +`<radialGradient id="moonDisc" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="#FFFDF2"/><stop offset="1" stop-color="#D9DDE4"/></radialGradient>`
  +`<radialGradient id="moonGlow"><stop offset="0" stop-color="#DCE6F6" stop-opacity=".5"/><stop offset="1" stop-color="#DCE6F6" stop-opacity="0"/></radialGradient>`;
 return `<svg class="svgdefs" aria-hidden="true" focusable="false"><defs>${d}</defs></svg>`; }

/* ---------- items ---------- */
const ITEMS={
 gants:{ name:'Gants en nitrile',
  icon:`<g>${'<ellipse cx="24" cy="44" rx="13" ry="2.6" fill="#000" opacity=".2"/>'}<path d="M15,42 L14,26 C13,22 12,18 12,14 C12,11 16,11 16.5,14 L18,22 L18,9 C18,5.5 22.5,5.5 22.5,9 L23,21 L23.5,7 C23.5,3.5 28,3.5 28,7 L28,21 L29,9.5 C29,6 33.5,6 33.5,9.5 L33,26 C35,22 36,19 38,18 C41,17 41.5,20 40,23 L35,34 L34,42 Z" fill="#4E8FD9"/><path d="M28,21 L29,9.5 C29,6 33.5,6 33.5,9.5 L33,26 L35,30 L34,42 L27,42 Z" fill="#2F6CB3"/><path d="M16,20 C16,16 15,13 14,12" stroke="#BFE0FF" stroke-width="1.5" opacity=".7" fill="none" stroke-linecap="round"/><rect x="14" y="38" width="21" height="5" rx="1.5" fill="#2A5A96"/></g>`,
  look:'Des gants bleus en nitrile. **Il faut** les mettre avant de toucher une preuve. C\'est la règle numéro un. La règle numéro deux : ne pas oublier la règle numéro un.',
  async use(A){ if(A.G.wearing.gants) return A.say('Vous les portez déjà. Ils vous vont très bien, d\'ailleurs.');
   A.G.wearing.gants=true; A.score(2,'gloves'); A.tickClock(1); A.redraw(); return A.say('Vous enfilez les gants. Ils claquent sur vos poignets. Très professionnel.'); } },
 appareil:{ name:'Appareil photo',
  icon:`<g><ellipse cx="24" cy="42" rx="17" ry="2.6" fill="#000" opacity=".22"/><rect x="5" y="14" width="38" height="25" rx="4" fill="#3A404C"/><rect x="5" y="14" width="38" height="7" rx="3" fill="#525A68"/><rect x="15" y="9" width="12" height="7" rx="2" fill="#2A2F38"/><circle cx="26" cy="27" r="9.5" fill="#1A1D24"/><circle cx="26" cy="27" r="6.5" fill="#2E4A6A"/><circle cx="23.6" cy="24.6" r="2.2" fill="#A9E2FF" opacity=".85"/><rect x="34" y="16.5" width="6" height="3" rx="1" fill="#F2C46D"/></g>`,
  look:'L\'appareil photo du service. Il a vu plus de scènes de crime que vous. Il **faut** photographier une preuve avant de la ramasser.',
  async use(A){ return A.say('Vous prenez une photo de vos chaussures. Elle ira dans le dossier « Erreurs ». Choisissez plutôt l\'appareil, puis cliquez sur une preuve.'); } },
 sachets:{ name:'Sachets à preuves',
  icon:`<g><ellipse cx="24" cy="43" rx="15" ry="2.4" fill="#000" opacity=".18"/><path d="M10,8 H38 L39,42 H9 Z" fill="#E4EEF4" opacity=".85"/><path d="M10,8 H38 L39,42 H9 Z" fill="none" stroke="#8CA2B2" stroke-width="1.4"/><rect x="10" y="8" width="28" height="5" fill="#B9C9D4"/><rect x="14" y="24" width="20" height="12" rx="1" fill="#F7F1E3"/><rect x="14" y="24" width="20" height="3.5" fill="#B8443A"/><path d="M17,31 h12 M17,34 h8" stroke="#6B5A40" stroke-width="1"/><path d="M13,14 L16,40" stroke="#fff" stroke-width="1.6" opacity=".7"/></g>`,
  look:'Des sachets transparents avec une étiquette. Une preuve sans étiquette, ce n\'est plus une preuve. C\'est un souvenir.' },
 perle:{ name:'Perle (pièce n° 1)',
  icon:`<g><path d="M10,8 H38 L39,42 H9 Z" fill="#E4EEF4" opacity=".85"/><path d="M10,8 H38 L39,42 H9 Z" fill="none" stroke="#8CA2B2" stroke-width="1.4"/><rect x="10" y="8" width="28" height="5" fill="#B9C9D4"/><circle cx="24" cy="24" r="6" fill="url(#pearlG)"/><circle cx="22" cy="22" r="1.6" fill="#fff"/><rect x="14" y="32" width="20" height="7" rx="1" fill="#F7F1E3"/><rect x="14" y="32" width="20" height="2.5" fill="#B8443A"/></g>`,
  look:'La perle, dans son sachet. Étiquette : « Pièce n° 1. Perle trouvée sous la vitrine. » Elle devra aller à la salle des preuves. Ne l\'oubliez pas, ou elle disparaîtra comme le café de l\'équipe.' }
};

/* ---------- rooms ---------- */
const PEARL=[566,672];
const ROOMS={
 musee:{
  name:'Musée — salle des Trésors',
  depth:[462,.84,790,1.38],
  walk:[[40,790],[150,462],[1238,462],[1272,790]],
  obstacles:[ [[586,598],[794,598],[802,652],[578,652]], [[96,738],[434,738],[444,800],[86,800]] ],
  dyn:[ {when:G=>!G.flags.perle, poly:[[540,662],[592,662],[596,684],[536,684]]} ],
  start:{x:300,y:600,face:'right'},
  bg(G){ return `
   <rect width="1280" height="446" fill="url(#mWall)"/>
   <path d="M210,150 L420,190 L420,446 L210,446 Z" fill="#C9DAF0" opacity=".06" filter="url(#blurL)"/>
   <!-- wainscot -->
   <rect y="360" width="1280" height="86" fill="url(#mWain)"/>
   ${Array.from({length:11},(_,i)=>{ const x=20+i*118; return `<rect x="${x}" y="374" width="98" height="56" rx="2" fill="none" stroke="#2A190C" stroke-width="2" opacity=".6"/><path d="M${x+1},${429} H${x+98} V${375}" stroke="#8A6040" stroke-width="1.4" fill="none" opacity=".55"/>`; }).join('')}
   <rect y="354" width="1280" height="9" fill="url(#mRail)"/><rect y="362" width="1280" height="2" fill="#1E120A" opacity=".5"/>
   <rect y="436" width="1280" height="12" fill="#22150B"/><rect y="436" width="1280" height="2" fill="#6E4A2C" opacity=".6"/>
   <!-- ceiling and track lights -->
   <rect width="1280" height="46" fill="#161B20"/><rect y="46" width="1280" height="9" fill="#46535B"/><rect y="46" width="1280" height="2" fill="#77858D"/><rect y="55" width="1280" height="4" fill="#1A2025"/>
   <rect x="300" y="12" width="760" height="6" rx="2" fill="#0B0E11"/>
   ${[[362,'l'],[692,'c'],[930,'r']].map(([x])=>`<g><rect x="${x-9}" y="16" width="18" height="10" fill="#0B0E11"/><path d="M${x-11},26 h22 l-3,16 h-16 Z" fill="#2B3238"/><path d="M${x-11},26 h8 l-1,16 h-4 Z" fill="#46525A"/><ellipse cx="${x}" cy="42" rx="8" ry="2.4" fill="#FFF1C8"/></g>`).join('')}
   <!-- window, live oak and spanish moss outside -->
   <path d="M60,438 V172 A80,80 0 0 1 220,172 V438 Z" fill="#2A1C10"/>
   <path d="M72,430 V174 A68,68 0 0 1 208,174 V430 Z" fill="url(#moon)"/>
   <g clip-path="url(#winClip)"><circle cx="168" cy="160" r="40" fill="url(#moonGlow)"/><circle cx="168" cy="160" r="12" fill="url(#moonDisc)"/>
   <path d="M72,410 C110,398 170,402 208,394 V430 H72 Z" fill="#0E1522"/>
   <g fill="#111A2B"><path d="M150,430 C148,390 152,360 146,330 C140,300 126,286 104,276 L108,268 C128,276 142,288 150,304 C154,286 168,270 190,262 L194,270 C176,280 162,296 160,320 C158,350 160,392 164,430 Z"/>
    <path d="M104,276 C92,272 82,274 72,280 L72,272 C84,266 96,266 108,268 Z"/></g>
   <g fill="#15213A"><ellipse cx="90" cy="258" rx="34" ry="13"/><ellipse cx="124" cy="246" rx="34" ry="14"/><ellipse cx="160" cy="236" rx="34" ry="13"/><ellipse cx="190" cy="250" rx="30" ry="13"/><ellipse cx="208" cy="266" rx="20" ry="10"/><ellipse cx="76" cy="272" rx="18" ry="9"/><ellipse cx="142" cy="258" rx="40" ry="12"/></g>
   <g fill="#20304E"><ellipse cx="118" cy="240" rx="18" ry="5"/><ellipse cx="158" cy="230" rx="20" ry="5"/><ellipse cx="88" cy="252" rx="14" ry="4"/></g>
   <g stroke="#41557A" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".85"><path d="M82,266 q3,16 -1,34 q-1,8 1,14 M96,268 q3,20 0,46 M112,262 q-2,18 1,32 M128,260 q4,22 0,52 q-1,8 1,12 M146,266 q-3,16 0,30 M162,262 q-3,20 0,40 M178,262 q3,24 -2,48 M194,268 q2,16 0,30 M204,274 q2,10 0,20"/></g>
   <g stroke="#2C3C5C" stroke-width="1.4" stroke-linecap="round" fill="none" opacity=".9"><path d="M88,268 q2,12 0,22 M120,262 q2,14 0,26 M154,262 q-2,12 0,24 M186,264 q2,14 0,26"/></g>
   </g>
   <g fill="#3A2614"><rect x="136" y="174" width="8" height="256"/><rect x="72" y="262" width="136" height="7"/><rect x="72" y="346" width="136" height="7"/></g>
   <path d="M80,184 A60,60 0 0 1 136,116" stroke="#C9DAF0" stroke-width="2" opacity=".35" fill="none"/>
   <rect x="52" y="430" width="176" height="10" fill="#4A3220"/><rect x="52" y="430" width="176" height="3" fill="#8A6A4A"/>
   <!-- banner -->
   <path d="M520,58 L536,86 M842,58 L826,86" stroke="#151515" stroke-width="2"/>
   <rect x="472" y="86" width="416" height="78" fill="url(#banner)"/>
   <rect x="480" y="93" width="400" height="64" fill="none" stroke="#D9B45A" stroke-width="1.6" opacity=".8"/>
   <path d="M472,164 ${Array.from({length:26},(_,i)=>`L${488+i*16},164 L${480+i*16},172`).join(' ')} L888,164 Z" fill="#561A1D"/>
   <text x="680" y="128" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="27" textLength="372" lengthAdjust="spacingAndGlyphs" fill="#F0D58A">TRÉSORS DE LA FRANCOPHONIE</text>
   <text x="680" y="149" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="600" font-size="13" textLength="290" lengthAdjust="spacingAndGlyphs" fill="#E9D9B0" opacity=".9">EXPOSITION ITINÉRANTE · LAFAYETTE</text>
   <!-- wall case: ceinture fléchée -->
   ${shadow(366,348,80,6,.25,'blurS')}
   <rect x="290" y="178" width="152" height="168" rx="3" fill="#2A1C10"/><rect x="300" y="188" width="132" height="148" fill="url(#caseIn)"/>
   <ellipse cx="366" cy="196" rx="70" ry="40" fill="url(#pool)"/>
   <g transform="translate(352 196)"><rect width="28" height="118" fill="url(#sashW)"/>
    ${Array.from({length:9},(_,i)=>`<path d="M2,${8+i*12} l6,5 l6,-5 l6,5 l6,-5" stroke="${i%2?'#2F4F86':'#E2B860'}" stroke-width="2" fill="none" stroke-linejoin="round"/>`).join('')}
    <rect x="20" width="8" height="118" fill="#000" opacity=".18"/>
    <g stroke="#8C2420" stroke-width="1.6" stroke-linecap="round">${Array.from({length:7},(_,i)=>`<path d="M${2+i*4},118 v12"/>`).join('')}</g></g>
   <path d="M304,192 L326,192 L304,232 Z" fill="#fff" opacity=".10"/><path d="M406,192 L418,192 L338,332 L326,332 Z" fill="#fff" opacity=".05"/>
   <rect x="336" y="352" width="60" height="1" fill="none"/>
   <!-- framed comic page (moved: a paler patch on the wall, left of the frame) -->
   <rect x="858" y="176" width="124" height="156" fill="#6E7C83" opacity=".35"/>
   ${shadow(948,342,72,6,.25,'blurS')}
   <rect x="884" y="172" width="128" height="162" fill="url(#frameGold)"/><rect x="893" y="181" width="110" height="144" fill="#F4EEDC"/>
   ${[[897,185,50,42,'#9FC3E0'],[949,185,50,42,'#F2D28A'],[897,229,102,44,'#E9B49A'],[897,275,50,46,'#B9D6B0'],[949,275,50,46,'#C9C1E6']].map(([x,y,w,h,c])=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="#2A2014" stroke-width="1.4"/>`).join('')}
   <ellipse cx="914" cy="196" rx="12" ry="6" fill="#fff" stroke="#2A2014" stroke-width="1"/><circle cx="930" cy="214" r="6" fill="#F0C9A8" stroke="#2A2014" stroke-width="1"/><path d="M926,222 h8 v4 h-8z" fill="#3F7D86"/>
   <path d="M906,262 h34 l6,-8 h20 l6,8 h16 v6 h-82 Z" fill="#B8443A" stroke="#2A2014" stroke-width="1"/><circle cx="918" cy="268" r="4" fill="#2A2014"/><circle cx="972" cy="268" r="4" fill="#2A2014"/>
   <ellipse cx="972" cy="290" rx="16" ry="7" fill="#fff" stroke="#2A2014" stroke-width="1"/>
   <path d="M893,181 L936,181 L893,236 Z" fill="#fff" opacity=".18"/>
   <!-- service door -->
   <rect x="1082" y="196" width="140" height="252" fill="#3A2614"/><rect x="1082" y="196" width="140" height="7" fill="#7A5234"/>
   <rect x="1096" y="210" width="112" height="236" fill="url(#door)"/>
   <path d="M1096,446 L1130,300 L1176,300 L1208,446 Z" fill="#2E3A40" opacity=".55"/>
   <rect x="1136" y="300" width="34" height="2" fill="#7A8A92" opacity=".5"/>
   <rect x="1118" y="170" width="68" height="20" rx="2" fill="#1E5E3E"/><text x="1152" y="185" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="12.5" letter-spacing="1.5" fill="#E8F6EC">SORTIE</text>
   <!-- floor -->
   <rect y="446" width="1280" height="354" fill="url(#mFloor)"/>
   ${floorPlanks(446,800,46)}
   <rect y="446" width="1280" height="26" fill="#000" opacity=".22"/>
   <path d="M76,446 L214,446 L600,800 L250,800 Z" fill="url(#beam)" filter="url(#blur)"/>
   <!-- spotlight cone onto the vitrine and its pool on the floor -->
   <path d="M684,42 L700,42 L812,640 L572,640 Z" fill="url(#cone)"/>
   <ellipse cx="690" cy="650" rx="190" ry="40" fill="url(#pool)"/>
   <!-- mud footprints from the service door to the vitrine -->
   ${[[1140,474,.62,0],[1112,486,.66,1],[1086,500,.7,0],[1050,514,.74,1],[1018,532,.78,0],[984,546,.82,1],[950,566,.86,0],[918,580,.9,1],[880,598,.94,0],[846,612,.98,1]].map(([x,y,s,l])=>bootPrint(x,y,s,l)).join('')}
   ${!G.flags.perle?`<g>${shadow(PEARL[0],PEARL[1]+3,9,3,.4,'blurS')}<circle cx="${PEARL[0]}" cy="${PEARL[1]-2}" r="6.2" fill="url(#pearlG)"/><circle cx="${PEARL[0]-2}" cy="${PEARL[1]-4.4}" r="1.6" fill="#fff"/></g>`:''}
   ${G.flags.photoPerle&&!G.flags.perle?evidenceTent(604,686,1,1.15):''}
   ${G.flags.photoBoue?evidenceTent(1004,560,2,.95):''}
  `; },
  props:[
   { base:640, svg:()=>`
    ${shadow(690,642,118,13,.42)}
    <rect x="590" y="626" width="200" height="16" fill="#9C907A"/><rect x="590" y="626" width="200" height="3" fill="#D9D0BE"/>
    <rect x="598" y="494" width="184" height="134" fill="url(#ped)"/>
    <polygon points="606,480 774,480 782,494 598,494" fill="url(#pedTop)"/>
    <rect x="598" y="504" width="184" height="3" fill="#A69A84" opacity=".7"/>
    <rect x="752" y="494" width="30" height="134" fill="#000" opacity=".10"/>
    <rect x="648" y="540" width="84" height="34" rx="2" fill="url(#brass)"/><rect x="652" y="544" width="76" height="26" rx="1" fill="none" stroke="#5E4416" stroke-width="1" opacity=".6"/>
    <text x="690" y="556" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="9.5" fill="#3A2A0E">PARURE</text>
    <text x="690" y="567" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="9.5" fill="#3A2A0E">D'ÉVANGÉLINE</text>
    <!-- glass case -->
    <rect x="604" y="468" width="172" height="13" fill="#2A1C10"/><rect x="604" y="468" width="172" height="3" fill="#7A5234"/>
    <rect x="612" y="364" width="156" height="104" fill="#1C252B" opacity=".55"/>
    <path d="M650,468 C650,452 662,446 676,442 L678,418 C674,414 674,404 680,398 C686,394 694,394 700,398 C706,404 706,414 702,418 L704,442 C718,446 730,452 730,468 Z" fill="url(#velvet)"/>
    <path d="M704,442 C718,446 730,452 730,468 L716,468 C714,456 708,450 700,446 Z" fill="#000" opacity=".2"/>
    <path d="M668,450 C676,462 704,462 712,450" stroke="#6E7EB8" stroke-width="3" opacity=".45" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/>
    <circle cx="668" cy="450" r="1.6" fill="url(#brass)"/><circle cx="712" cy="450" r="1.6" fill="url(#brass)"/>
    <rect x="612" y="364" width="156" height="104" fill="url(#glassG)" opacity=".22"/>
    <rect x="612" y="364" width="156" height="104" fill="none" stroke="#D6E6EE" stroke-width="1.6" opacity=".55"/>
    <path d="M620,368 L648,368 L620,420 Z" fill="#fff" opacity=".16"/><path d="M740,368 L752,368 L700,464 L688,464 Z" fill="#fff" opacity=".08"/>
    <rect x="608" y="352" width="4" height="116" fill="#2A1C10"/><rect x="768" y="352" width="4" height="116" fill="#2A1C10"/>
    <!-- glass lid slid to the right: an opening on the left -->
    <polygon points="650,352 810,352 806,364 646,364" fill="url(#glassG)" opacity=".45"/>
    <polygon points="650,352 810,352 806,364 646,364" fill="none" stroke="#E6F1F6" stroke-width="1.4" opacity=".75"/>
    <path d="M654,354 H700" stroke="#fff" stroke-width="1.6" opacity=".6"/>
    <polygon points="612,352 646,352 646,364 612,364" fill="#0E1418" opacity=".55"/>` },
   { base:805, svg:()=>`
    ${shadow(266,798,196,11,.45)}
    <rect x="112" y="742" width="16" height="54" fill="#3A2412"/><rect x="404" y="742" width="16" height="54" fill="#2A190C"/>
    <rect x="112" y="742" width="5" height="54" fill="#6A4224" opacity=".7"/>
    <polygon points="112,698 420,698 434,722 98,722" fill="url(#leather)"/>
    <path d="M118,702 H300" stroke="#B88A6A" stroke-width="2" opacity=".35" stroke-linecap="round"/>
    ${Array.from({length:6},(_,i)=>`<circle cx="${150+i*48}" cy="710" r="1.8" fill="#2A1A12"/>`).join('')}
    <rect x="98" y="722" width="336" height="24" fill="url(#benchWood)"/><rect x="98" y="722" width="336" height="3" fill="#B07F55" opacity=".7"/><rect x="98" y="743" width="336" height="3" fill="#2A190C" opacity=".6"/>` }
  ],
  fg(){ return `<rect width="1280" height="800" fill="url(#vig)" pointer-events="none"/>`; },
  npcs:[ { id:'thib', look:{skin:3,hair:'#1E1612',style:'short',coat:'police',cap:true,badge:true,mustache:true,collar:'#C9D2DE'}, x:1010, y:560, face:'front',
          block:[[978,548],[1042,548],[1046,574],[974,574]] } ],
  hotspots:[
   { id:'fenetre', name:'La fenêtre', poly:[[60,438],[60,172],[100,110],[180,110],[220,172],[220,438]],
     look:'Une grande fenêtre, fermée de l\'intérieur. Dehors, un chêne couvert de mousse espagnole fait de son mieux pour avoir l\'air menaçant.',
     hand:'Elle est verrouillée de l\'intérieur. Le voleur n\'est pas passé par là. Les chênes, eux, n\'ont rien vu.' },
   { id:'banniere', name:'La banderole', rect:[472,86,416,86],
     look:'« Trésors de la francophonie. » Une exposition qui a voyagé de Québec à Dakar, puis de Bretagne à Bruxelles. Comme vous, mais avec une meilleure assurance.' },
   { id:'ceinture', name:'La ceinture fléchée', rect:[290,178,152,168], walkTo:[370,500], face:'back',
     look:'Une ceinture fléchée de Québec, tissée à la main. Le voleur ne l\'a pas touchée. Pourtant, elle vaut une petite fortune. Il savait exactement ce qu\'il cherchait.',
     hand:'Elle est dans sa vitrine murale, et elle y reste. Vous n\'êtes pas au Carnaval.' },
   { id:'bd', name:'Une planche de BD', rect:[856,172,156,162], walkTo:[930,500], face:'back',
     async look(A){ await A.say('Une planche de bande dessinée de Bruxelles, prêtée par un collectionneur belge.');
       await A.say('Tiens. Il y a un rectangle plus clair sur le mur, à gauche du cadre. Quelqu\'un a **déplacé** la planche. Récemment.');
       if(!A.G.scored.bd){ A.note('La planche de BD a été déplacée','Une marque plus claire sur le mur, à gauche du cadre. Qui l\'a bougée, et pourquoi?'); A.score(3,'bd'); } },
     hand:'Sans gants, vous ajouteriez vos empreintes à celles du coupable. Et avec des gants, vous ajouteriez des questions du collectionneur. Laissez-la.' },
   { id:'vitrine', name:'La vitrine vide', poly:[[600,346],[812,346],[790,642],[592,642]], walkTo:[710,672], face:'back',
     async look(A){ await A.say('La vitrine de la parure d\'Évangéline. Elle est vide. Le couvercle de verre a été **glissé** sur le côté, pas cassé.');
       await A.say('Votre voleur avait une clé. Ou beaucoup de politesse.');
       if(!A.G.scored.vitrine){ A.note('La vitrine n\'a pas été forcée','Le couvercle a été glissé, pas cassé. Le voleur avait peut-être une clé.'); A.score(3,'vitrine'); } },
     async hand(A){ if(!A.G.wearing.gants) return A.say('Sans gants? Vous voulez vraiment laisser vos empreintes sur la pièce à conviction la plus importante de la soirée? Mettez vos gants d\'abord.');
       await A.say('Avec vos gants, vous examinez le cadre et la serrure. Pas de rayures, pas de marques d\'outil. La serrure n\'a pas été forcée.'); A.score(2,'vitrineHand'); },
     talk:'Vous interrogez la vitrine. Elle garde le silence. Elle a sûrement un avocat.',
     use:{ appareil:async A=>{ await A.say('Clic. La vitrine vide est maintenant immortalisée. Le procureur adorera ce vide.'); A.score(2,'photoVitrine'); } } },
   { id:'perle', name:'Quelque chose qui brille', when:G=>!G.flags.perle, ell:[PEARL[0],PEARL[1]-2,24,16], walkTo:[528,700], face:'right',
     look:'Une perle, sous le bord de la vitrine. Elle est tombée de la parure… ou quelqu\'un l\'a laissée là pour vous. Dans les deux cas : ne marchez pas dessus.',
     async hand(A){
      if(!A.G.wearing.gants) return A.fail({ art:FAIL_ART.prints,
        text:'Bravo. Vos empreintes sont maintenant les seules sur la preuve. Vous êtes votre suspect principal.',
        lesson:'Procédure : il faut mettre des gants avant de toucher une preuve.' });
      if(!A.G.flags.photoPerle) return A.say('Il faut d\'abord **photographier** la preuve, puis la ramasser. Le procureur adore les photos. Faites-lui plaisir.');
      A.flag('perle',true); A.give('perle'); A.tickClock(2); A.score(5,'perle');
      A.note('Pièce n° 1 : une perle','Trouvée par terre, sous le bord de la vitrine. Elle vient sans doute de la parure.');
      A.redraw();
      return A.say('Vous glissez la perle dans un sachet à preuves. Sur l\'étiquette, vous écrivez : « Pièce n° 1. Perle trouvée sous la vitrine, ' + A.T(clockNow(A)) + '. » Le greffier sera presque content.', {icon:ITEMS.perle.icon}); },
     talk:'Vous parlez à une perle. Le capitaine l\'apprendra, et il ne sera pas surpris.',
     use:{ appareil:async A=>{ if(A.G.flags.photoPerle) return A.say('Vous l\'avez déjà photographiée. Trois fois. Elle commence à prendre la pose.');
        A.flag('photoPerle',true); A.score(3,'photoPerle'); A.tickClock(1); A.redraw();
        return A.say('Clic. Vous posez un cavalier jaune numéro 1 à côté. La perle a maintenant sa photo officielle. Elle est plus photogénique que vous, mais ne le dites à personne.'); },
       gants:'Mettez d\'abord les gants. Sur vos mains, de préférence.',
       sachets:async A=>A.say(A.G.flags.photoPerle?'Ramassez-la plutôt avec la main. Avec des gants, bien sûr. Le sachet suivra.':'Pas si vite. Il faut d\'abord la photographier.') },
     async onWalk(A){ return A.fail({ art:FAIL_ART.step,
       text:'Vous avez marché sur la preuve. L\'avocat de la défense vous enverra une carte de remerciement.',
       lesson:'Procédure : on ne marche jamais sur une preuve. On la photographie, puis on la ramasse avec des gants.' }); } },
   { id:'boue', name:'Des traces de boue', poly:[[830,604],[880,584],[1150,462],[1170,478],[900,624],[840,628]], walkTo:[900,640], face:'right',
     async look(A){ await A.say('Des traces de boue séchée. Elles viennent de la porte de service et vont jusqu\'à la vitrine. Des bottes, pointure 42 à vue d\'œil.');
       await A.say('La boue est grise et collante. Ce n\'est pas la boue du parking. C\'est de la boue de [[bayou|bayou (marécage)]].');
       if(!A.G.scored.boue){ A.note('Des traces de boue','Des bottes, environ pointure 42, de la porte de service jusqu\'à la vitrine. De la boue de bayou.'); A.score(3,'boue'); } },
     hand:'Ramasser de la boue avec les doigts? Photographiez-la plutôt. C\'est plus propre, et plus légal.',
     use:{ appareil:async A=>{ if(A.G.flags.photoBoue) return A.say('Elles sont déjà photographiées. Elles ne vont pas changer de pointure.');
       A.flag('photoBoue',true); A.score(3,'photoBoue'); A.tickClock(1); A.redraw(); return A.say('Clic. Vous posez le cavalier numéro 2. Les traces de boue ont maintenant un numéro. Elles ont l\'air fières.'); } } },
   { id:'thib', name:'Agent Thibodeaux', poly:[[976,320],[1044,320],[1050,566],[970,566]], walkTo:[930,580], face:'right',
     look:'L\'agent Thibodeaux. Vingt ans de service, dont dix-neuf à attendre que le café soit prêt.',
     async talk(A){ const who='Agent Thibodeaux';
       if(A.G.scored.boue && !A.G.flags.recoBoue){
         await A.say('Enquêt{eur|rice}? Vous avez une recommandation pour moi?',{who});
         const r=await A.task([
           { t:'tiles', prompt:'Recommandez à l\'agent Thibodeaux de suivre les traces de boue.', en:'Recommend that Officer Thibodeaux follow the mud tracks.',
             tiles:['Agent Thibodeaux,','je','vous','te','recommande','de','à','suivre','suivez','les traces de boue','.'],
             answer:'Agent Thibodeaux, je vous recommande de suivre les traces de boue.',
             hints:{ 'te':'Vous parlez à un agent en service : on utilise « vous », pas « te ».', 'à':'Après « recommander », on met « de » + l\'infinitif.', 'suivez':'Après « de », il faut l\'infinitif : « suivre ».' } },
           { t:'choose', prompt:'Le capitaine demande toujours : « Sur quelle base? » Quelle preuve appuie votre recommandation?',
             opts:[ {txt:'Les traces de boue : elles vont de la porte de service à la vitrine.', ok:true, icon:'<ellipse cx="24" cy="26" rx="10" ry="16" fill="#6B4A30"/>'},
                    {txt:'La planche de BD a été déplacée.', why:'C\'est un indice, mais il ne dit pas où le voleur est allé. Quelle preuve montre un chemin?'},
                    {txt:'Le couvercle de la vitrine n\'a pas été cassé.', why:'Ça explique comment la vitrine a été ouverte, pas où le voleur est allé.'} ] }
         ],{ title:'Recommandation à l\'agent Thibodeaux', kind:'Dossier · Recommandation', cancel:true,
             intro:'Une bonne recommandation = la bonne personne + **je vous recommande de** + un infinitif + une preuve.' });
         if(r.cancelled) return A.say('« Prenez votre temps, enquêt{eur|rice}. Le voleur, lui, ne prend pas le sien. »',{who});
         A.flag('recoBoue',true); A.score(Math.max(2,6-r.mistakes),'recoBoue'); A.tickClock(20);
         await A.say('Vingt minutes plus tard, l\'agent Thibodeaux revient. Il a de la boue jusqu\'aux genoux et l\'air content de lui.');
         await A.say('Nous **avons suivi** les traces jusqu\'au quai de chargement. Nous **avons trouvé** des traces de pneus. Et un voisin **a vu** une camionnette rouge vers 23 h.',{who});
         A.note('Rapport de l\'agent Thibodeaux','Les traces vont jusqu\'au quai. Traces de pneus. Un voisin a vu une camionnette rouge vers 23 h.');
         return;
       }
       await A.say('Bonsoir, enquêt{eur|rice}. Le gardien vous [[espère|attend (cajun)]] dans son poste. Moi, j\'[[espère|attends]] le café.',{who});
       if(!A.G.wearing.gants) await A.say('[[Asteur|maintenant (cajun)]], je vous recommande de mettre vos gants. Le capitaine a vu des gens perdre leur badge pour moins que ça.',{who});
       else if(A.G.flags.recoBoue) await A.say('Les traces de pneus sont photographiées. La camionnette rouge, elle, court toujours.',{who});
       else await A.say('Je vous recommande de photographier tout ce qui brille. Le capitaine aime les dossiers épais.',{who}); },
     hand:'Vous ne pouvez pas prendre l\'agent Thibodeaux. Il est syndiqué.',
     use:{ appareil:'Il sourit pour la photo. Personne ne lui avait rien demandé.', '*':'L\'agent Thibodeaux regarde l\'objet, puis vous regarde. « Non merci, enquêt{eur|rice}. »' } },
   { id:'banc', name:'Le banc', poly:[[98,698],[434,698],[444,800],[90,800]], walkTo:[300,712], face:'front',
     look:'Un banc pour les visiteurs fatigués. Vous êtes fatigué{|e}. Mais vous n\'êtes pas un visiteur.',
     hand:'Pas le temps de vous asseoir. Le capitaine compte les minutes. Et les heures supplémentaires.' },
   { id:'porte', name:'La porte de service', rect:[1082,196,140,252], walkTo:[1150,476], face:'back',
     look:'La porte de service. Elle mène au quai de chargement. Les traces de boue commencent juste devant.',
     async hand(A){ return A.say('Le quai de chargement n\'est pas encore construit. Revenez au prochain brouillon. (Fin de la salle d\'essai.)'); },
     async onWalk(A){ return A.say('Le quai de chargement n\'est pas encore construit. Revenez au prochain brouillon. (Fin de la salle d\'essai.)'); } }
  ],
  async onEnter(A){ if(A.G.seen.musee) return; A.G.seen.musee=1;
   await A.say(['Lafayette, Louisiane. Le musée, salle des Trésors. Quelqu\'un a volé la **parure d\'Évangéline**. Le reste de l\'exposition est intact, ce qui est soit une bonne nouvelle, soit une insulte.','Lafayette, Louisiana. The museum, Treasures Room. Someone has stolen the Évangéline jewellery set. The rest of the exhibition is untouched, which is either good news or an insult.']);
   await A.say(['Sauvegardez souvent. Les criminels, eux, ne vous attendront pas.','Save often. Criminals will not wait for you.']);
   await A.say(['Amenez la souris en haut de l\'écran pour voir la barre d\'icônes. Clic droit pour changer d\'action. Tab pour passer d\'une zone à l\'autre.','Move the mouse to the top of the screen to see the icon bar. Right-click to change action. Tab moves from one spot to the next.']); }
 }
};
function clockNow(A){ const c=A.G.clock, h=Math.floor(c/60)%24, m=c%60; return `${h} h ${String(m).padStart(2,'0')}`; }
const FAIL_ART={
 step:`<ellipse cx="100" cy="104" rx="70" ry="8" fill="#fff" opacity=".08"/><g transform="translate(100 72) rotate(-8)"><path d="M-26,-40 C-10,-50 22,-46 26,-20 C30,4 18,24 10,34 C-2,46 -24,40 -28,22 C-32,4 -36,-28 -26,-40 Z" fill="#6B4A30"/><path d="M-18,-26 h30 M-22,-10 h38 M-22,6 h34" stroke="#3A2716" stroke-width="3"/></g><g transform="translate(150 98)"><ellipse rx="12" ry="5" fill="#ECE6DA"/><path d="M-12,0 L-18,-4 M12,0 L18,-5 M0,-5 L2,-11" stroke="#ECE6DA" stroke-width="2"/></g>`,
 prints:`<g fill="none" stroke="#E9E4D6" stroke-width="2.4" opacity=".9" transform="translate(100 60)">${Array.from({length:7},(_,i)=>`<ellipse rx="${8+i*7}" ry="${11+i*8}" ${i%2?'stroke-dasharray="14 6"':''}/>`).join('')}</g>`
};


/* ---------- help from the team: the next useful thing to do (costs points) ---------- */
function HINT(G){ const w='Agent Thibodeaux';
 if(!G.wearing.gants) return {who:w,text:'Je vous recommande d\'ouvrir l\'inventaire et de mettre vos gants. Il faut les mettre avant de toucher une preuve.'};
 if(!G.flags.photoPerle) return {who:w,text:'Il y a quelque chose qui brille sous la vitrine. Je vous recommande de le photographier avec l\'appareil.'};
 if(!G.flags.perle) return {who:w,text:'La perle est photographiée. Maintenant, je vous recommande de la ramasser, avec vos gants.'};
 if(!G.scored.boue) return {who:w,text:'Regardez le plancher entre la porte et la vitrine. Quelqu\'un a laissé un souvenir.'};
 if(!G.flags.recoBoue) return {who:w,text:'Parlez-moi quand vous voulez. Je peux suivre ces traces, si vous me le recommandez.'};
 if(!G.scored.bd) return {who:w,text:'Je vous recommande de regarder la planche de BD, au mur. Quelque chose a bougé.'};
 return {who:w,text:'Vous avez tout vu ici. La porte de service mène au quai. Enfin, elle y mènera.'};
}
