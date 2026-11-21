/* ===== L'enquête: Act 1 rooms (museum hall, loading dock, guard post). ===== */
/* ---------- rooms ---------- */
const PEARL=[566,672];
ROOMS.musee={
  name:'Musée — salle des Trésors',
  depth:[462,.84,790,1.38],
  walk:[[40,790],[150,462],[1238,462],[1272,790]],
  obstacles:[ [[586,598],[794,598],[802,652],[578,652]], [[96,738],[434,738],[444,800],[86,800]] ],
  dyn:[ {when:G=>!G.flags.perle, poly:[[540,662],[592,662],[596,684],[536,684]]} ],
  start:{x:640,y:770,face:'back'}, entries:{arrive:{x:640,y:770,face:'back'}, fromQuai:{x:1150,y:478,face:'front'}},
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
   <!-- glass cabinet: four more exhibits from the journey -->
   ${shadow(522,358,80,6,.25,'blurS')}<rect x="452" y="192" width="140" height="160" rx="3" fill="#2A1C10"/><rect x="460" y="200" width="124" height="144" fill="url(#caseIn)"/>
   <rect x="460" y="262" width="124" height="5" fill="#7A5234"/><rect x="460" y="336" width="124" height="5" fill="#7A5234"/>
   <g transform="translate(486 262)">${shadow(0,0,16,3,.4,'blurS')}<path d="M-14,-2 C-12,-10 -8,-26 -4,-34 C-2,-38 2,-37 1,-33 C-1,-26 -6,-12 -8,-2 Z" fill="url(#steel)"/><ellipse cx="-2" cy="-36" rx="4" ry="6" fill="url(#steel)" transform="rotate(20 -2 -36)"/><path d="M10,-2 C8,-10 4,-26 0,-34 C-2,-38 -6,-37 -5,-33 C-3,-26 2,-12 4,-2 Z" fill="#B5BCC2"/></g>
   <g transform="translate(554 262)">${shadow(0,0,18,3,.4,'blurS')}<path d="M-12,-2 C-14,-12 -12,-20 -6,-22 H6 C12,-20 14,-12 12,-2 Z" fill="url(#steel)"/><path d="M12,-14 C20,-16 22,-22 26,-26" stroke="#B5BCC2" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-12,-16 C-18,-16 -20,-10 -14,-6" stroke="#8E969D" stroke-width="2.4" fill="none"/><path d="M-4,-22 C-4,-28 4,-28 4,-22" fill="#8E969D"/><circle cx="0" cy="-29" r="2" fill="#8E969D"/><path d="M-8,-18 V-6" stroke="#fff" stroke-width="1.6" opacity=".5"/></g>
   <g transform="translate(490 336)">${shadow(0,0,18,3,.4,'blurS')}<path d="M-14,-18 C-14,-6 -8,0 0,0 C8,0 14,-6 14,-18 Z" fill="#F4F1E8"/><path d="M-14,-18 C-14,-6 -8,0 0,0 L0,-18 Z" fill="#fff"/><path d="M-11,-12 C-5,-8 5,-8 11,-12" stroke="#2F4F86" stroke-width="2" fill="none"/><path d="M-6,-8 l2,-3 l2,3 M2,-8 l2,-3 l2,3" stroke="#B8443A" stroke-width="1.2" fill="none"/><path d="M-14,-17 C-20,-18 -21,-12 -15,-12 M14,-17 C20,-18 21,-12 15,-12" stroke="#E4DED0" stroke-width="3" fill="none"/><ellipse cx="0" cy="-18" rx="14" ry="3" fill="#D8D1C2"/></g>
   <g transform="translate(556 336)">${shadow(0,0,14,2.4,.35,'blurS')}<rect x="-8" y="-4" width="16" height="4" fill="#2A1C10"/><rect x="-11" y="-30" width="22" height="26" fill="#F2E6CC"/><rect x="-11" y="-30" width="22" height="6" fill="#2F4F86"/><path d="M-7,-18 h14 M-7,-13 h10" stroke="#6B5A40" stroke-width="1.2"/></g>
   <path d="M466,204 L492,204 L466,250 Z" fill="#fff" opacity=".10"/><path d="M560,204 L572,204 L480,340 L468,340 Z" fill="#fff" opacity=".05"/>
   ${G.flags.labels?[[366,358],[486,358],[554,358],[876,346]].map(([x,y])=>`<rect x="${x-18}" y="${y}" width="36" height="12" rx="1" fill="#F2E6CC"/><path d="M${x-12},${y+5} h24" stroke="#6B5A40" stroke-width="1"/>`).join(''):''}
   <!-- the camera, now hidden behind the comic page -->
   <path d="M1004,150 v18" stroke="#2A2E36" stroke-width="3"/><rect x="970" y="160" width="40" height="18" rx="4" fill="#3A404C"/><rect x="970" y="160" width="40" height="6" rx="3" fill="#525A68"/>
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
   ${!G.flags.labels?[[470,492,-12],[512,498,8],[548,488,-4],[586,500,14],[440,504,4],[530,510,-8]].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})">${shadow(0,3,12,2,.3,'blurS')}<polygon points="-12,-3 12,-3 13,3 -13,3" fill="#F2E6CC"/><path d="M-8,-0.5 h14" stroke="#6B5A40" stroke-width=".8"/></g>`).join(''):''}
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
   { id:'cabinet', name:'La vitrine murale', rect:[452,192,140,160], walkTo:[522,500], face:'back',
     look:'Une vitrine murale : des cuillères en bois et en métal, une petite théière en métal, un bol blanc et bleu, et un vieux billet de métro. Les étiquettes ne sont plus là. Elles sont… par terre.' },
   { id:'etiquettes', name:'Des étiquettes par terre', when:G=>!G.flags.labels, ell:[514,498,96,22], walkTo:[514,540], face:'back',
     look:'Six petites étiquettes, tombées par terre. Le gardien les a fait tomber quand il a couru vers la vitrine. Il faut les remettre à leur place.',
     async hand(A){ if(!A.G.wearing.gants) return A.say('Ce ne sont pas des preuves, mais vous êtes sur une scène de crime. Il faut mettre vos gants, même pour des étiquettes.');
       const r=await A.task(LABELS,{title:'Les étiquettes de l\'exposition',kind:'Dossier · Exposition',cancel:true,
         intro:'Chaque étiquette décrit un objet de votre grand voyage. Rappelez-vous : Québec, Montréal, l\'Acadie, Dakar, la Bretagne, Bruxelles.'});
       if(r.cancelled) return;
       A.flag('labels',true); A.score(Math.max(4,8-r.mistakes),'labels'); A.tickClock(4); A.redraw();
       await A.say('Toutes les étiquettes sont à leur place. Sauf une chose : l\'étiquette de la planche de BD est sur le mur… à un mètre du cadre.');
       await A.say('Le cadre, lui, est accroché juste devant la caméra de surveillance. Quelqu\'un a déplacé la planche pour cacher la caméra. Quelqu\'un qui savait où était la caméra.');
       A.note('La planche cache la caméra','Quelqu\'un a déplacé la planche de BD devant la caméra. Cette personne savait où était la caméra.'); } },
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
       await A.say('La boue est grise et collante. Ce n\'est pas la boue du parking. C\'est de la boue de [[bayou]].');
       if(!A.G.scored.boue){ A.note('Des traces de boue','Des bottes, environ pointure 42, de la porte de service jusqu\'à la vitrine. De la boue de bayou.'); A.score(3,'boue'); } },
     hand:'Ramasser de la boue avec les doigts? Photographiez-la plutôt. C\'est plus propre, et plus légal.',
     use:{ appareil:async A=>{ if(A.G.flags.photoBoue) return A.say('Elles sont déjà photographiées. Elles ne vont pas changer de pointure.');
       A.flag('photoBoue',true); A.score(3,'photoBoue'); A.tickClock(1); A.redraw(); return A.say('Clic. Vous posez le cavalier numéro 2. Les traces de boue ont maintenant un numéro. Elles ont l\'air fières.'); } } },
   { id:'thib', name:'Agent Thibodeaux', poly:[[976,320],[1044,320],[1050,566],[970,566]], walkTo:[930,580], face:'right',
     look:'L\'agent Thibodeaux. Vingt ans de service, dont dix-neuf à attendre que le café soit prêt.',
     async talk(A){ const w=who('thib');
       const o=await A.menu('Parler à l\'agent Thibodeaux',[ {txt:'Qu\'est-ce qui s\'est passé?'}, {txt:'Où est le gardien?'}, {txt:'Je peux vous donner une recommandation?'}, {txt:'Quelque chose à ajouter?'} ]);
       if(!o) return;
       if(o.txt.startsWith('Qu\'est')) return A.say('Le gardien a trouvé la vitrine vide à 22 h 32. Il nous a appelés. Personne n\'a rien touché. Enfin, à part le gardien, qui a fait tomber les étiquettes.',{who:w});
       if(o.txt.startsWith('Où')) return A.say('Dans son poste de sécurité. On y va par la porte de service, puis par le quai. Il vous [[espère]]. Moi, j\'[[espère]] le café.',{who:w});
       if(o.txt.startsWith('Je peux')) return A.say('Par la radio, enquêt{eur|rice}. Comme ça, tout le monde entend, et le capitaine aussi. Surtout le capitaine.',{who:w});
       if(!A.G.wearing.gants) return A.say('[[Asteur]], je vous recommande de mettre vos gants. Le capitaine a vu des gens perdre leur badge pour moins que ça.',{who:w});
       return A.say('Je vous recommande de photographier tout ce qui brille. Le capitaine aime les dossiers épais.',{who:w}); },
     hand:'Vous ne pouvez pas prendre l\'agent Thibodeaux. Il est syndiqué.',
     use:{ appareil:'Il sourit pour la photo. Personne ne lui avait rien demandé.', radio:'Il est juste là. Vous pouvez lui parler sans radio. C\'est une technologie ancienne, mais elle marche.', '*':'L\'agent Thibodeaux regarde l\'objet, puis vous regarde. « Non merci, enquêt{eur|rice}. »' } },
   { id:'banc', name:'Le banc', poly:[[98,698],[434,698],[444,800],[90,800]], walkTo:[300,712], face:'front',
     look:'Un banc pour les visiteurs fatigués. Vous êtes fatigué{|e}. Mais vous n\'êtes pas un visiteur.',
     hand:'Pas le temps de vous asseoir. Le capitaine compte les minutes. Et les heures supplémentaires.' },
   { id:'porte', name:'La porte de service', rect:[1082,196,140,252], walkTo:[1150,476], face:'back', exit:['quai','fromMusee'],
     look:'La porte de service. Elle mène au quai de chargement. Les traces de boue commencent juste devant.' }
  ],
  async onEnter(A){ if(A.G.seen.musee) return; A.G.seen.musee=1; A.flag('arrived',true); A.autosave();
   await A.say('Musée de Lafayette, 22 h 47. Salle des Trésors. Quelqu\'un a volé la [[parure]] d\'Évangéline. Le reste de l\'exposition est intact, ce qui est soit une bonne nouvelle, soit une insulte.');
   await A.say('Rappel de M. Landry : photographier, mettre des gants, ramasser, étiqueter, apporter au greffier. Dans cet ordre.'); }
};

/* ---------- the exhibit labels (recall from the six earlier stops) ---------- */
const LABELS={ t:'plan', prompt:'Remettez chaque étiquette sous le bon objet.', itemsLabel:'Étiquettes',
 slots:['La ceinture fléchée','Les cuillères','La petite théière','Le bol blanc et bleu','Le vieux billet de métro','La planche de BD'],
 items:[
  {id:'qc',txt:'Prêt de Québec. On la porte autour de la taille, au Carnaval.',ok:[0],why:'Au Carnaval de Québec, qu\'est-ce qu\'on porte autour de la taille?'},
  {id:'ac',txt:'Prêt de Caraquet. On en joue pendant la veillée, en rythme.',ok:[1],why:'À la veillée acadienne, on joue de quel instrument très simple?'},
  {id:'dk',txt:'Prêt de Dakar. On y prépare l\'attaya, un thé très sucré, en trois verres.',ok:[2],why:'L\'attaya, c\'est du thé. On le prépare dans quoi?'},
  {id:'br',txt:'Prêt de Quimper. On y boit le cidre, avec des crêpes.',ok:[3],why:'En Bretagne, on boit le cidre dans un bol, pas dans un verre.'},
  {id:'mt',txt:'Prêt de Montréal. Pour voyager sous la ville.',ok:[4],why:'À Montréal, qu\'est-ce qui voyage sous la ville?'},
  {id:'bx',txt:'Prêt d\'un collectionneur de Bruxelles. Une histoire en cases.',ok:[5],why:'Une histoire en cases, c\'est une bande dessinée.'} ],
 say:'Toutes les étiquettes sont sous le bon objet.', done:'Vous avez une bonne mémoire de voyage.' };

/* ---------- 7. Le quai de chargement ---------- */
ROOMS.quai={
 name:'Musée — quai de chargement', depth:[474,.8,790,1.3],
 walk:[[20,600],[250,474],[1040,474],[1270,600],[1270,790],[20,790]],
 obstacles:[ [[34,708],[440,708],[452,790],[24,790]], [[884,518],[920,518],[922,534],[882,534]] ],
 start:{x:840,y:486,face:'front'}, entries:{fromMusee:{x:840,y:486,face:'front'}, fromPoste:{x:326,y:492,face:'front'}, fromCar:{x:520,y:720,face:'right'}},
 bg(G){ let st=7; const rn=()=>(st=(st*9301+49297)%233280)/233280;
  return `<rect width="1280" height="470" fill="url(#skyNight)"/>
  ${Array.from({length:40},()=>`<circle cx="${(900+rn()*380).toFixed(0)}" cy="${(rn()*200).toFixed(0)}" r="${(.6+rn()*1.2).toFixed(1)}" fill="#fff" opacity="${(.4+rn()*.5).toFixed(2)}"/>`).join('')}
  <!-- live oak and house across the street -->
  <g fill="#0E1626"><ellipse cx="1150" cy="196" rx="170" ry="70"/><ellipse cx="1040" cy="222" rx="90" ry="44"/><ellipse cx="1250" cy="214" rx="80" ry="46"/><path d="M1130,260 C1126,300 1130,330 1124,380 L1146,380 C1142,330 1148,300 1150,262 Z"/></g>
  <g stroke="#1F2C44" stroke-width="2" fill="none" opacity=".9">${[980,1010,1046,1080,1120,1160,1196,1230,1262].map((x,i)=>`<path d="M${x},${226+i%3*6} q2,${18+i%4*6} -1,${36+i%3*10}"/>`).join('')}</g>
  <polygon points="1000,300 1120,240 1244,300" fill="url(#roofDark)"/><rect x="1012" y="300" width="220" height="104" fill="url(#house)"/><rect x="1012" y="300" width="220" height="104" fill="#0A1020" opacity=".45"/>
  <rect x="1000" y="370" width="244" height="8" fill="#6E5A44"/>${[1010,1060,1110,1160,1210,1236].map(x=>`<rect x="${x}" y="300" width="5" height="76" fill="#D9CDB4" opacity=".6"/>`).join('')}
  <rect x="1060" y="318" width="40" height="36" fill="url(#win)"/><path d="M1080,318 v36 M1060,336 h40" stroke="#3A3226" stroke-width="2"/><circle cx="1080" cy="336" r="44" fill="url(#glow)"/>
  <rect x="1140" y="320" width="26" height="54" fill="#3A2A1C"/><rect x="1176" y="318" width="40" height="36" fill="#1A2236"/>
  <rect x="1020" y="404" width="210" height="14" fill="#4A3E30"/>
  <!-- the museum's back wall -->
  <rect x="0" y="40" width="960" height="430" fill="url(#brickWall)"/><rect x="0" y="40" width="960" height="430" fill="url(#brickP)"/>
  <rect x="0" y="34" width="968" height="14" fill="#2E1E18"/><rect x="940" y="40" width="20" height="430" fill="#000" opacity=".25"/>
  <!-- roll-up door -->
  <rect x="520" y="196" width="244" height="274" fill="#55606A"/>${Array.from({length:17},(_,i)=>`<rect x="520" y="${200+i*16}" width="244" height="2" fill="#2E363C" opacity=".6"/>`).join('')}<rect x="512" y="188" width="260" height="10" fill="#2E363C"/>
  ${txt(642,250,'LIVRAISONS',14,{mid:1,ls:2,fill:'#D9DDE0'})}
  <!-- guard post window and door -->
  ${nightWindow(110,240,140,104,9).replace('url(#city)','#E8C98A').replace(/fill="#0C1224"/g,'fill="#B99A5E"')}
  ${door(296,276,72,194,{label:'SÉCURITÉ',metal:true})}
  <!-- service door (open) -->
  ${door(800,292,82,178,{open:true,label:'MUSÉE'})}
  <!-- sodium lamp -->
  <path d="M664,136 h-24 v14" stroke="#1A1D24" stroke-width="4" fill="none"/><path d="M624,150 h32 l-4,10 h-24 z" fill="#2A2E36"/><ellipse cx="640" cy="160" rx="13" ry="3" fill="#FFD48A"/>
  <path d="M630,162 L652,162 L790,470 L470,470 Z" fill="#FFB45A" opacity=".08"/>
  <!-- ground: asphalt, mud near the door, tire tracks to the street -->
  <rect y="470" width="1280" height="330" fill="url(#asphalt)"/>
  <path d="M960,470 L1280,520 L1280,560 L960,470 Z" fill="#2A2D32"/><path d="M960,470 L1280,470 L1280,520 Z" fill="#33373D"/>
  <path d="M970,486 L1280,540" stroke="#C9B26A" stroke-width="3" stroke-dasharray="26 22" opacity=".6"/>
  <ellipse cx="660" cy="600" rx="280" ry="90" fill="url(#sodiumPool)"/>
  <path d="M700,480 C760,470 900,476 980,500 C1000,520 960,560 880,566 C800,570 720,540 700,520 Z" fill="#4A3826" opacity=".85"/>
  <g fill="none" stroke="#2A1E12" stroke-width="7" opacity=".75" stroke-linecap="round">
   <path d="M820,486 C900,500 980,520 1060,548 C1120,568 1190,586 1270,600"/><path d="M800,510 C880,526 960,548 1040,576 C1100,596 1180,616 1270,632"/></g>
  <g fill="none" stroke="#5E4A34" stroke-width="2" opacity=".6" stroke-dasharray="3 5"><path d="M820,486 C900,500 980,520 1060,548 C1120,568 1190,586 1270,600"/><path d="M800,510 C880,526 960,548 1040,576 C1100,596 1180,616 1270,632"/></g>
  <ellipse cx="560" cy="650" rx="70" ry="12" fill="#5A6878" opacity=".45"/><ellipse cx="548" cy="648" rx="20" ry="3" fill="#FFD48A" opacity=".5"/>
  ${G.flags.photoPneus?evidenceTent(1010,560,3,1):''}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:532, svg:G=>`${shadow(902,532,24,5,.4,'blurS')}<rect x="888" y="478" width="28" height="54" fill="#E0B640"/><rect x="888" y="478" width="9" height="54" fill="#F2CE60"/><rect x="908" y="478" width="8" height="54" fill="#A8841E"/><ellipse cx="902" cy="478" rx="14" ry="4" fill="#F2CE60"/>
    <rect x="886" y="496" width="32" height="6" fill="#2A2E36"/><rect x="886" y="512" width="32" height="6" fill="#2A2E36"/>${G.flags.peinture?'':'<path d="M898,488 l12,-2 l4,8 l-10,6 l-8,-4 z" fill="#B8443A"/><path d="M900,490 l9,-1" stroke="#E07A6A" stroke-width="1.4"/>'}` },
  { base:800, svg:()=>`${shadow(238,790,220,14,.5)}
    <path d="M40,700 C44,668 70,660 110,656 L160,620 C178,606 196,600 230,600 H318 C346,600 362,610 380,626 L410,656 C432,660 446,672 448,700 L450,760 H36 Z" fill="url(#carBody)"/>
    <path d="M60,690 H436 V716 H60 Z" fill="url(#carBlue)"/><path d="M40,740 H450 V760 H36 Z" fill="#2A2E36"/>
    <path d="M168,624 C182,612 196,608 228,608 H252 V656 H124 Z" fill="url(#glassDark)"/><path d="M262,608 H316 C340,608 352,616 368,632 L392,656 H262 Z" fill="url(#glassDark)"/>
    <path d="M176,624 l30,-10 l-40,36 z" fill="#fff" opacity=".18"/>
    <rect x="214" y="588" width="90" height="12" rx="3" fill="#2A2E36"/><rect x="218" y="590" width="40" height="8" rx="2" fill="#E04A3A"/><rect x="260" y="590" width="40" height="8" rx="2" fill="#3A6AE0"/>
    ${txt(250,710,'POLICE',18,{mid:1,ls:3,fill:'#F4F6F8'})}
    ${[120,370].map(x=>`<circle cx="${x}" cy="758" r="32" fill="#16181C"/><circle cx="${x}" cy="758" r="16" fill="url(#steel)"/><circle cx="${x-4}" cy="754" r="5" fill="#fff" opacity=".35"/>`).join('')}
    <rect x="436" y="676" width="14" height="10" rx="2" fill="#FFE8B0"/><rect x="38" y="676" width="10" height="10" rx="2" fill="#B8443A"/>` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".7" pointer-events="none"/>`; },
 npcs:[ { id:'hebert', look:CAST.hebert.look, x:1152, y:404, face:'front', size:.62 } ],
 hotspots:[
  { id:'porte-musee', name:'La porte du musée', rect:[800,292,82,178], walkTo:[840,480], face:'back', exit:['musee','fromQuai'] },
  { id:'porte-poste', name:'Le poste de sécurité', rect:[296,276,72,194], walkTo:[330,484], face:'back', exit:['poste','fromQuai'] },
  { id:'fenetre-poste', name:'La fenêtre du poste', rect:[100,230,160,124], look:'La fenêtre du poste de sécurité. Derrière les stores, une télévision montre un match de football. Sans le son.' },
  { id:'rideau', name:'La porte de livraison', rect:[520,196,244,274], look:'La grande porte des livraisons. Fermée, cadenassée. Le voleur est passé par la petite porte. C\'est plus discret.' },
  { id:'lampe', name:'La lampe', ell:[640,155,26,16], look:'Une lampe orange. Elle éclaire le quai, les traces de pneus et votre mauvaise humeur.' },
  { id:'boue2', name:'La boue', poly:[[700,480],[980,500],[880,566],[700,520]], walkTo:[760,580], face:'right',
    look:'De la boue grise et collante devant la porte. La même que dans la salle des Trésors. Ce n\'est pas de la boue de parking. C\'est de la boue de [[bayou]].' },
  { id:'pneus', name:'Des traces de pneus', poly:[[960,500],[1270,590],[1270,640],[960,540]], walkTo:[960,600], face:'right',
    async look(A){ await A.say('Des traces de pneus dans la boue. Une camionnette, à vue d\'œil. Elle est partie vite, vers la rue.');
      if(!A.G.scored.pneus){ A.note('Des traces de pneus','Une camionnette est partie du quai, vite, vers la rue. Il y a de la boue dans les traces.'); A.score(2,'pneus'); } },
    hand:'Vous ne pouvez pas ramasser des traces de pneus. Mais vous pouvez les photographier.',
    use:{ appareil:async A=>{ if(A.G.flags.photoPneus) return A.say('Elles sont déjà photographiées. Les pneus ne vont pas revenir poser.');
      A.flag('photoPneus',true); A.score(3,'photoPneus'); A.tickClock(1); A.redraw(); return A.say('Clic. Cavalier numéro 3. Les traces de pneus sont maintenant officielles.'); } } },
  { id:'borne', name:'La borne jaune', rect:[880,470,44,66], walkTo:[860,560], face:'right',
    async look(A){ await A.say(A.G.flags.peinture?'La borne jaune. Vous avez gratté la peinture rouge. Elle est dans un sachet.':'Une borne jaune, cognée. Il y a de la peinture rouge dessus. Un véhicule rouge l\'a touchée en partant.');
      if(!A.G.scored.borne&&!A.G.flags.peinture){ A.note('De la peinture rouge sur la borne','Un véhicule rouge a touché la borne du quai en partant.'); A.score(2,'borne'); } },
    async hand(A){ if(A.G.flags.peinture) return A.say('Il n\'y a plus de peinture à prendre. Vous avez tout. Même un peu de jaune.');
      if(!A.G.wearing.gants) return A.fail({ art:FAIL_ART.prints, text:'Bravo. Vos empreintes sont maintenant sur la borne, à côté de la peinture. Vous êtes votre suspect principal.', lesson:'Procédure : il faut mettre des gants avant de toucher une preuve.' });
      if(!A.G.flags.photoPeinture) return A.say('Il faut d\'abord photographier la peinture. Ensuite, vous pourrez la gratter.');
      A.flag('peinture',true); A.give('peinture'); A.score(5,'peinture'); A.tickClock(2); A.redraw();
      return A.say('Avec vos gants, vous grattez la peinture rouge dans un sachet. Étiquette : « Pièce n° 2. Peinture rouge, borne du quai. »',{icon:ITEMS.peinture.icon}); },
    use:{ appareil:async A=>{ if(A.G.flags.photoPeinture) return A.say('Déjà photographiée. La borne commence à se sentir importante.');
      A.flag('photoPeinture',true); A.score(2,'photoPeinture'); return A.say('Clic. La peinture rouge est photographiée.'); },
      sachets:'D\'abord la photo, ensuite les gants, puis vous grattez la peinture avec la main. Le sachet suivra.' } },
  { id:'maison', name:'La maison d\'en face', poly:[[1000,240],[1244,240],[1244,420],[1000,420]], walkTo:[1120,500], face:'back',
    look:'Une petite maison acadienne, avec une galerie. Une fenêtre est allumée. Une dame vous regarde derrière son rideau. Elle a sûrement vu quelque chose.',
    async talk(A){ return HEBERT(A); } },
  { id:'hebert', name:'Mme Hébert', rect:[1134,270,40,136], walkTo:[1120,500], face:'back', look:'Mme Odile Hébert, la voisine. Elle porte une robe de chambre violette et l\'air de quelqu\'un qui sait tout.', async talk(A){ return HEBERT(A); } },
  { id:'voiture', name:'La voiture de police', poly:[[40,600],[450,600],[450,770],[36,770]], walkTo:[520,720], face:'left',
    look:'Votre voiture de police. Elle sent le café et les vieux sandwichs. Elle vous ramène au poste quand vous voulez.',
    async hand(A){ return CAR(A); }, async onWalk(A){ return CAR(A); } }
 ],
 async onEnter(A){ if(A.G.seen.quai) return; A.G.seen.quai=1; await A.say('Le quai de chargement, derrière le musée. Il fait chaud et humide. Une lampe orange bourdonne. En face, une maison acadienne a encore une fenêtre allumée.'); }
};
async function CAR(A){
 if(!A.G.flags.photoPneus) return A.fail({ art:FAIL_ART.tires, text:'Vous reculez la voiture pour aller plus vite. Bravo. Les traces de pneus sont maintenant celles de la police de Lafayette.', lesson:'Procédure : il faut photographier les traces avant de bouger quoi que ce soit.' });
 const o=await A.menu('Retourner au poste?',[{txt:'Oui, rentrer au poste.'},{txt:'Non, rester ici.'}]);
 if(o&&o.txt.startsWith('Oui')) return A.go('briefing','fromParking',12); }
async function HEBERT(A){ const w=who('hebert');
 if(A.G.flags.hebert) return A.say('Je vous ai tout dit, mon petit{|e}. La camionnette rouge, les écrevisses. Maintenant, mon feuilleton recommence.',{who:w});
 const o=await A.menu('Que dites-vous à Mme Hébert?',[ {txt:'Salut! Tu as vu quelque chose ce soir?'}, {txt:'Bonsoir, madame. Est-ce que vous avez vu quelque chose ce soir?'} ]);
 if(!o) return;
 if(o.txt.startsWith('Salut')){ await A.say('Salut? Tu? On ne tutoie pas une dame de mon âge, jeune homme ou jeune fille. Recommencez. Poliment.',{who:w}); return; }
 A.flag('hebert',true); A.score(3,'hebert'); A.tickClock(5);
 await A.say('Ah, bonsoir! J\'**étais en train de** regarder mon feuilleton quand une camionnette rouge **est partie** très vite. Vers 22 h 30, je pense.',{who:w});
 await A.say('Il y avait des autocollants dessus. Des [[écrevisses]], je crois. Elle a cogné la borne jaune. Ça a fait un bruit! J\'ai raté la fin de mon épisode.',{who:w});
 A.note('Témoin : Mme Hébert','Une camionnette rouge avec des autocollants d\'écrevisses est partie très vite vers 22 h 30. Elle a cogné la borne.'); }

/* ---------- 6. Le poste du gardien ---------- */
const BADGES={ t:'doc', kind:'Registre', title:'Registre des badges — vendredi',
 table:[['Heure','Badge','Porte'],['18 h 02','n° 1','entrée principale'],['20 h 00','n° 3','entrée principale (sortie)'],['21 h 40','n° 2','escalier, 2e étage'],['22 h 18','n° 3','porte de service'],['22 h 33','n° 2','porte de service']] };
const BADGE_Q={ t:'number', prompt:'Lisez le registre. Le gardien a le badge n° 2.',
 rows:[ {label:'À quelle heure la porte de service s\'est-elle ouverte la première fois?',ans:22*60+18,time:true,unit:'',why:'Cherchez la première ligne « porte de service ». Écrivez l\'heure comme 22 h 18.'},
  {label:'Quel badge l\'a ouverte?',ans:3,unit:'(numéro)',why:'Regardez la colonne « Badge » sur la même ligne.'} ],
 say:'La porte de service s\'est ouverte à 22 h 18 avec le badge n° 3.', done:'Bonne lecture. Maintenant, il faut savoir à qui est le badge n° 3.' };
const GUARD_STATEMENT=[
 {t:'say',who:'Roland Guidry',text:'J\'**étais en train de** manger mon sandwich quand le téléphone **a sonné**. C\'était vers 22 h 15. On m\'a demandé de vérifier une fenêtre au deuxième étage.'},
 {t:'say',who:'Roland Guidry',text:'Je suis monté. J\'**étais en train de** vérifier la fenêtre quand j\'**ai entendu** un bruit en bas. Je suis descendu, mais je n\'ai vu personne. J\'ai trouvé la vitrine vide à 22 h 32. Mon pauvre cœur, [[cher]].'},
 {t:'say',text:'**Indice de grammaire.** « *Était en train de* + infinitif » = l\'action en cours, au fond de l\'histoire. Le passé composé = l\'action qui l\'interrompt. Exemple : *J\'étais en train de manger* (au fond) *quand le téléphone a sonné* (interruption).'},
 {t:'choose',prompt:'Qu\'est-ce que le gardien faisait quand il a entendu le bruit?',opts:[
  {txt:'Il vérifiait la fenêtre du deuxième étage.',ok:true},
  {txt:'Il mangeait son sandwich.',why:'Le sandwich, c\'était quand le téléphone a sonné. Relisez la deuxième partie.'},
  {txt:'Il regardait le match à la télévision.',why:'Il ne parle pas du match dans sa déclaration.'} ]},
 {t:'choose',prompt:'Qu\'est-ce qui a interrompu son sandwich?',opts:[
  {txt:'Le téléphone a sonné.',ok:true},
  {txt:'Il a entendu un bruit en bas.',why:'Le bruit a interrompu autre chose. Qu\'est-ce qui a sonné?'},
  {txt:'Il a trouvé la vitrine vide.',why:'Ça, c\'est à la fin, à 22 h 32.'} ]}
];
ROOMS.poste={
 name:'Musée — poste de sécurité', depth:[474,.86,790,1.38], walk:STATION_WALK,
 obstacles:[ [[376,600],[780,600],[788,650],[368,650]] ],
 start:{x:1170,y:494,face:'front'}, entries:{fromQuai:{x:1170,y:494,face:'front'}},
 bg(G){ return `${interior({fluo:[640],wall:'stWall',c1:'#9C9888',c2:'#888476'})}
  <!-- key box -->
  ${shadow(232,308,58,5,.25,'blurS')}<rect x="180" y="160" width="104" height="142" rx="3" fill="#7A5234"/><rect x="188" y="168" width="88" height="126" fill="#E9E3D4"/>
  ${[0,1,2].map(r=>[0,1,2].map(c=>{ const x=204+c*28, y=186+r*38; const has=!(r===0&&c===1); return `<circle cx="${x}" cy="${y}" r="2.4" fill="#5E666C"/>${has?`<path d="M${x},${y} v10" stroke="#C69A44" stroke-width="2"/><circle cx="${x}" cy="${y+14}" r="4" fill="none" stroke="#C69A44" stroke-width="2"/>`:''}<rect x="${x-10}" y="${y+22}" width="20" height="6" fill="#F7F1E3" stroke="#B9B19C" stroke-width=".6"/>`; }).join('')).join('')}
  ${txt(232,182,'CLÉS',10,{mid:1,ls:1.5,fill:'#6E4A2C'})}
  <!-- CCTV bank -->
  <rect x="404" y="128" width="344" height="210" rx="4" fill="#22262C"/>
  ${[[414,138],[580,138],[414,236],[580,236]].map(([x,y],i)=>`<rect x="${x}" y="${y}" width="158" height="92" fill="${['#2E3A44','#26323C','#2A3640','#24303A'][i]}"/><path d="M${x+4},${y+4} l40,0 l-40,30z" fill="#fff" opacity=".07"/>${txt(x+8,y+86,['CAM 1 · ENTRÉE','CAM 2 · TRÉSORS','CAM 3 · ESCALIER','CAM 4 · QUAI'][i],9,{w:700,fill:'#9AE07A'})}`).join('')}
  <rect x="454" y="152" width="40" height="40" fill="#3A4652"/><rect x="420" y="190" width="140" height="20" fill="#34404A"/>
  <rect x="604" y="146" width="110" height="74" fill="#6E5A44"/><rect x="610" y="152" width="98" height="62" fill="#4A3A2A"/>${txt(659,186,'(dos du cadre)',10,{mid:1,w:600,fill:'#C9B79A'})}
  <rect x="440" y="252" width="20" height="60" fill="#3A4652"/><rect x="480" y="262" width="60" height="6" fill="#3A4652"/>
  <rect x="600" y="300" width="130" height="10" fill="#3A4652"/><rect x="640" y="262" width="40" height="38" fill="#3A4652"/>
  <ellipse cx="576" cy="232" rx="210" ry="130" fill="url(#screenGlow)" opacity=".6"/>
  <!-- badge terminal -->
  ${shadow(826,300,44,4,.25,'blurS')}<rect x="782" y="196" width="88" height="100" rx="5" fill="#2A2E36"/><rect x="790" y="204" width="72" height="56" fill="url(#screenGreen)"/>
  ${[0,1,2,3].map(i=>`<rect x="796" y="${212+i*11}" width="${[56,44,58,40][i]}" height="4" fill="#C9F0B0" opacity=".8"/>`).join('')}<rect x="806" y="268" width="40" height="18" rx="3" fill="#3E444F"/>
  <!-- TV -->
  <rect x="930" y="250" width="160" height="10" fill="url(#deskTop)"/><rect x="944" y="168" width="132" height="82" rx="4" fill="#1A1D24"/><rect x="950" y="174" width="120" height="70" fill="#3E8A4A"/><path d="M1010,174 v70 M950,209 h120" stroke="#E6F2E0" stroke-width="1.4" opacity=".7"/><circle cx="1010" cy="209" r="12" fill="none" stroke="#E6F2E0" stroke-width="1.4" opacity=".7"/>
  ${door(1120,206,100,232,{label:'QUAI',metal:true})}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:520, svg:()=>chairBack(574,526,.95) },
  { base:650, svg:G=>`${desk(370,540,420,108)}${phone(470,552)}${papers(540,552)}
    ${shadow(640,552,22,3,.35,'blurS')}<polygon points="616,552 664,552 670,546 622,546" fill="#F4F1E8"/><path d="M626,546 C628,536 652,536 656,546 Z" fill="url(#pastry)"/><path d="M630,542 h20" stroke="#5E8C4A" stroke-width="2"/>
    ${shadow(712,552,10,3,.35,'blurS')}<rect x="704" y="514" width="16" height="38" rx="5" fill="url(#steel)"/><rect x="702" y="510" width="20" height="8" rx="3" fill="#2A2E36"/>${mug(750,552,'#2F4F86')}` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".55" pointer-events="none"/>`; },
 npcs:[ { id:'guidry', look:CAST.guidry.look, x:900, y:560, face:'front', block:[[870,548],[930,548],[934,574],[866,574]] } ],
 hotspots:[
  { id:'cles', name:'La boîte à clés', rect:[180,160,104,142], walkTo:[232,500], face:'back',
    async look(A){ await A.say('La boîte à clés. Il manque une clé : celle du bureau de la conservatrice, sur le deuxième crochet. La clé maîtresse du gardien est à sa place.');
      await A.say('Le petit registre des clés dit : « Clé maîtresse : aucune sortie ce soir. » Le gardien n\'a pas ouvert la vitrine avec sa clé.');
      if(!A.G.scored.cles){ A.note('La clé du gardien','La clé maîtresse n\'est jamais sortie ce soir. Le gardien n\'a pas ouvert la vitrine avec sa clé.'); A.score(3,'cles'); } },
    hand:'Ce ne sont pas vos clés. Et vous avez déjà assez de responsabilités.' },
  { id:'cameras', name:'Les écrans de surveillance', rect:[404,128,344,210], walkTo:[576,600], face:'back',
    async look(A){ await A.say('Quatre caméras. Entrée, escalier, quai… et la salle des Trésors. Sur l\'écran de la salle des Trésors, on ne voit que le dos d\'un cadre.');
      if(A.G.flags.labels) return A.say('Le dos de la planche de BD. Celle qu\'on a déplacée devant la caméra. Le voleur savait exactement où elle était.');
      return A.say('Un cadre devant une caméra? Bizarre. Allez voir la salle des Trésors de plus près.'); } },
  { id:'badges', name:'Le registre des badges', rect:[782,196,88,100], walkTo:[826,500], face:'back',
    async look(A){ if(A.G.flags.badges){ await A.task(BADGES,{title:'Le registre des badges',kind:'Document'}); return; }
      const r=await A.task([BADGES,BADGE_Q],{title:'Le registre des badges',kind:'Dossier · Document',cancel:true});
      if(r.cancelled) return;
      A.flag('badges',true); A.score(Math.max(2,4-r.mistakes),'badges'); A.tickClock(3);
      A.note('Badge n° 3 à 22 h 18','La porte de service s\'est ouverte à 22 h 18 avec le badge n° 3. Le gardien a le badge n° 2. À qui est le badge n° 3?'); },
    hand:'Vous touchez l\'écran. Il affiche « ACCÈS REFUSÉ ». Il a raison.' },
  { id:'tel', name:'Le téléphone', rect:[450,522,44,34], walkTo:[470,676], face:'back',
    async look(A){ await A.say('Le journal des appels du téléphone : « Vendredi, 22 h 15, appel reçu du 337-555-0144. Durée : 42 secondes. » Un seul appel ce soir.');
      if(!A.G.scored.tel){ A.note('Appel de 22 h 15','Le gardien a reçu un appel du 337-555-0144 à 22 h 15. À qui est ce numéro?'); A.score(2,'tel'); } },
    hand:'Vous décrochez. Tonalité. Vous raccrochez. Une enquête téléphonique très courte.' },
  { id:'sandwich', name:'Le sandwich', rect:[612,530,64,24], walkTo:[640,676], face:'back', look:'Un demi-sandwich au jambon. Il a été interrompu à 22 h 15, comme son propriétaire.', hand:'Ce n\'est pas une preuve. C\'est le dîner de quelqu\'un. Le respect, c\'est important.' },
  { id:'tele', name:'La télévision', rect:[944,168,132,82], look:'Un match de football, sans le son. Les Tigers perdent. Le gardien aussi a passé une mauvaise soirée.' },
  { id:'guidry', name:'Roland Guidry, le gardien', poly:[[866,330],[934,330],[940,570],[860,570]], walkTo:[820,590], face:'right',
    look:'Roland Guidry, gardien de nuit. Soixante-deux ans, une moustache grise, et l\'air de quelqu\'un qui voudrait être chez lui.',
    async talk(A){ const w=who('guidry');
      if(!A.G.flags.guardStmt){
        await A.say('Bonsoir, enquêt{eur|rice}. Je vais tout vous raconter. Lisez bien, c\'est important.',{who:w});
        const r=await A.task(GUARD_STATEMENT,{title:'Déclaration du gardien',kind:'Dossier · Déclaration'});
        A.flag('guardStmt',true); A.score(Math.max(3,6-r.mistakes),'guardStmt'); A.tickClock(8);
        A.note('Déclaration du gardien','Vers 22 h 15, un appel l\'a envoyé au 2e étage. Il vérifiait la fenêtre quand il a entendu un bruit. Vitrine vide à 22 h 32.');
        return; }
      const o=await A.menu('Parler au gardien',[ {txt:'Qui vous a téléphoné à 22 h 15?'}, {txt:'Qui a une clé de la vitrine?'}, {txt:'Vous avez vu quelqu\'un?'} ]);
      if(!o) return;
      if(o.txt.startsWith('Qui vous')){ await A.say('Une voix de femme, je pense. Avec un accent du Nord. J\'ai pas fait attention, j\'étais en train de manger.',{who:w}); if(!A.G.scored.voix){ A.note('La voix au téléphone','Le gardien pense que c\'était une femme, avec un accent « du Nord ».'); A.score(2,'voix'); } return; }
      if(o.txt.startsWith('Qui a')){ await A.say('Moi, avec la clé maîtresse. Et la conservatrice, Mme Gagnon. Elle a sa propre clé. Elle est partie à 20 h. Elle m\'a dit bonsoir.',{who:w}); if(!A.G.scored.cle2){ A.note('Les clés de la vitrine','Deux personnes ont une clé : le gardien (clé maîtresse) et la conservatrice, Mme Gagnon.'); A.score(2,'cle2'); } return; }
      return A.say('Personne. Quand je suis descendu, il n\'y avait plus personne. Juste de la boue par terre. Et moi, je n\'ai pas de boue sur mes souliers. Regardez.',{who:w}); },
    use:{ '*':'Le gardien regarde l\'objet. « Je suis gardien, pas détective, [[cher]]. »' } },
  { id:'porte', name:'La porte du quai', rect:[1120,206,100,232], walkTo:[1170,488], face:'back', exit:['quai','fromPoste'] }
 ],
 async onEnter(A){ if(A.G.seen.poste) return; A.G.seen.poste=1; await A.say('Le poste de sécurité. Il sent le café froid et le jambon. Le gardien est debout, comme s\'il attendait le directeur. Ou un avocat.'); }
};

/* ---------- the radio: the first recommendation (good → passé composé report; bad → negation report) ---------- */
const RECO_OFFICERS=[['Agent Thibodeaux, je vous recommande','vous'],['Agente Broussard, je te recommande','tu'],['Je recommande au sergent LeBlanc','au']];
const RECO_ACTIONS=[['de suivre les traces de boue','boue'],['de chercher la camionnette rouge dans les parkings','parkings'],['d\'interroger le collectionneur belge','collectionneur']];
function recoAnswers(){ const out=[]; RECO_OFFICERS.forEach(o=>RECO_ACTIONS.forEach(a=>out.push(`${o[0]} ${a[0]}.`))); return out; }
function recoDiagnose(t){ const n=' '+t.toLowerCase().replace(/\s+/g,' ')+' ';
 if(/thibodeaux/.test(n)&&/ te /.test(n)) return 'L\'agent Thibodeaux n\'est pas votre partenaire : on lui dit « vous ».';
 if(/broussard/.test(n)&&/ vous /.test(n)) return 'L\'agente Broussard est votre partenaire : on la tutoie (« je te recommande »).';
 if(/sergent/.test(n)&&/ (vous|te) /.test(n)) return 'Avec « au sergent LeBlanc », pas de pronom : « Je recommande au sergent LeBlanc de… ».';
 if(/ de interroger/.test(n)) return 'Devant une voyelle, « de » devient « d\' » : d\'interroger.';
 if(/ d' (suivre|chercher)/.test(n)) return 'Devant une consonne, on garde « de » : de suivre, de chercher.';
 if(/ recommande (suivre|chercher|interroger)/.test(n)) return 'Après « recommander », il faut « de » + infinitif.';
 if(/ à (suivre|chercher|interroger)/.test(n)) return 'On ne dit pas « recommander à faire » : on dit « recommander de faire ».';
 return null; }
async function RADIO(A){ const w=who('broussard'), cap=who('arceneaux');
 if(A.G.flags.recoBoue) return A.say('L\'équipe suit votre piste. Finissez au musée, puis rentrez au poste avec les preuves.',{who:w});
 if(!A.G.flags.arrived) return A.say('Le capitaine veut vous voir au musée d\'abord. Des recommandations sans scène de crime, c\'est de la poésie.',{who:w});
 const ev=[]; const G=A.G;
 if(G.scored.boue) ev.push({txt:'Les traces de boue : elles vont de la porte de service à la vitrine.',id:'boue'});
 if(G.flags.peinture||G.scored.borne) ev.push({txt:'La peinture rouge sur la borne du quai.',id:'peinture'});
 if(G.flags.hebert) ev.push({txt:'Mme Hébert a vu une camionnette rouge partir vers 22 h 30.',id:'hebert'});
 if(G.scored.bd||G.flags.labels) ev.push({txt:'La planche de BD a été déplacée.',id:'planche'});
 if(G.scored.vitrine) ev.push({txt:'Le couvercle de la vitrine n\'a pas été cassé.',id:'vitrine'});
 if(!ev.length) return A.say('Une recommandation? Il vous faut des preuves d\'abord, enquêt{eur|rice}. Regardez autour de vous.',{who:w});
 await A.say('Ici Broussard. On t\'écoute. Qui doit faire quoi?',{who:w});
 const r=await A.task([
  { t:'tiles', prompt:'Donnez une recommandation à un membre de l\'équipe. Choisissez la personne, l\'action et la cible.',
    tiles:['Agent Thibodeaux,','Agente Broussard,','Je recommande au sergent LeBlanc','je','vous','te','recommande','de','d\'','suivre','chercher','interroger','les traces de boue','la camionnette rouge dans les parkings','le collectionneur belge','.'],
    answers:recoAnswers(), diagnose:recoDiagnose, min:5 },
  { t:'choose', prompt:'Le capitaine demande : « Sur quelle base? » Choisissez la preuve qui appuie votre recommandation.', any:true, opts:ev }
 ],{ title:'Recommandation à l\'équipe', kind:'Dossier · Radio', cancel:true,
     intro:'Une bonne recommandation = la bonne personne (**tu** avec votre partenaire, **vous** avec un agent) + **recommander de** + infinitif + une preuve.' });
 if(r.cancelled) return A.say('« Prenez votre temps, enquêt{eur|rice}. Le voleur, lui, ne prend pas le sien. »',{who:cap});
 const sent=r.answers[0].txt, evid=r.answers[1].hit.id, act=RECO_ACTIONS.find(a=>sent.includes(a[0]))[1];
 const fits={boue:['boue'], parkings:['peinture','hebert'], collectionneur:['planche']}[act];
 if(!fits.includes(evid)) return A.say(`« Sur quelle base? » Le capitaine n'est pas convaincu : cette preuve ne justifie pas cette recommandation. ${act==='boue'?'Quelle preuve montre un chemin?':act==='parkings'?'Quelle preuve parle d\'un véhicule rouge?':'Quelle preuve parle du collectionneur?'}`,{who:cap});
 if(act==='boue'){
  A.flag('recoBoue',true); A.score(Math.max(2,6-r.mistakes),'reco1'); A.tickClock(20);
  await A.say('Vingt minutes plus tard, l\'agent Thibodeaux revient. Il a de la boue jusqu\'aux genoux et l\'air content de lui.');
  await A.say('Nous **avons suivi** les traces jusqu\'au quai. Nous **avons trouvé** un autocollant d\'[[écrevisse]] dans la boue. Mme Hébert **a vu** une camionnette rouge partir vers 22 h 30.',{who:who('thib')});
  A.note('Rapport de l\'agent Thibodeaux','Les traces vont jusqu\'au quai. Un autocollant d\'écrevisse dans la boue. Une camionnette rouge vers 22 h 30.');
  return; }
 if(act==='parkings'){ A.tickClock(90); A.flag('bad_parkings',true);
  await A.say('Une heure et demie plus tard, la radio grésille.');
  await A.say('Nous **n\'avons rien trouvé**. Nous **n\'avons vu aucune** camionnette rouge dans les parkings du centre-ville. **Personne n\'a** rien remarqué.',{who:who('broussard')});
  A.note('Écarté : les parkings du centre-ville','Aucune camionnette rouge dans les parkings du centre-ville. Personne n\'a rien remarqué.');
  return A.say('Le temps passe. Le capitaine soupire à la radio. Un long soupir, très professionnel.'); }
 A.tickClock(60); A.flag('bad_collect',true);
 await A.say('Une heure plus tard, le sergent LeBlanc vous rappelle.');
 await A.say('Le collectionneur **n\'est pas sorti** de l\'hôtel. Il **n\'a jamais visité** le musée ce soir. Le portier de l\'hôtel **ne l\'a pas vu** partir.',{who:who('leblanc')});
 A.note('Écarté (pour l\'instant) : le collectionneur','Il n\'est pas sorti de l\'hôtel ce soir. Il n\'a jamais visité le musée ce soir.');
 return A.say('Ce n\'est pas une piste. C\'est une piste en moins. Le capitaine appelle ça « éliminer ». Vous appelez ça « perdre une heure ».'); }

/* ---------- end of Act 1: back at the station ---------- */
async function ACT1_END(A){ const w=who('arceneaux'), G=A.G;
 const o=await A.menu('Parler au capitaine',[{txt:'Je suis prêt{|e} pour le briefing.'},{txt:'Qu\'est-ce qu\'il me reste à faire?'}]);
 if(!o) return;
 const todo=[];
 if(!G.flags.perle) todo.push('la perle dans la salle des Trésors');
 if(!G.flags.peinture) todo.push('la peinture rouge sur le quai');
 if(!G.flags.labels) todo.push('les étiquettes de l\'exposition');
 if(!G.flags.guardStmt) todo.push('la déclaration du gardien');
 if(!G.flags.badges) todo.push('le registre des badges');
 if(!G.flags.recoBoue) todo.push('une bonne recommandation à l\'équipe, par radio');
 if(o.txt.startsWith('Qu\'est')){ if(!todo.length) return A.say('Rien. Vous avez fini. Ça m\'étonne aussi.',{who:w}); return A.say('Il vous manque : '+todo.join(', ')+'. Le musée ne va pas venir à vous.',{who:w}); }
 if(todo.length) return A.say('Prêt{|e}? Il vous manque encore : '+todo.join(', ')+'. Revenez quand c\'est fait.',{who:w});
 const unlogged=['perle','peinture'].filter(id=>A.has(id));
 if(unlogged.length) return A.fail({ art:FAIL_ART.coffee, text:'Vous commencez le briefing avec les preuves dans votre poche. Le lendemain, elles ont disparu dans la salle des preuves. Comme la moitié du café de l\'équipe.', lesson:'Procédure : il faut apporter chaque preuve au greffier avant de continuer.' });
 A.G.flags.act2=true; A.autosave();
 await A.say('Bon travail, enquêt{eur|rice}. Deux preuves enregistrées, un témoin, une déclaration, et une piste. Pour une troisième journée, c\'est presque inquiétant.',{who:w});
 await A.say('Fin de l\'acte 1. (Brouillon : l\'acte 2 arrive bientôt. Votre partie est sauvegardée.)'); }
