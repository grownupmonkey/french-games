/* ===== Québec scenes (960 x 540). Each takes the player's look options. ===== */
const NPC={
 karine:{name:'Karine', role:'Organisatrice du Carnaval', look:{skin:5,hair:'#1E1612',style:'long',coat:'navy',noHat:true,headset:true,scarf:'#C9952F'}},
 josee:{name:'Josée', role:'Kiosque de queues de castor', look:{skin:3,hair:'#1E1612',style:'mid',coat:'rust',hat:'slate',band:'#C9CFDA',pompom:false}},
 patrice:{name:'Patrice', role:'Employé de la glissade', pitch:.85, look:{skin:1,hair:'#6B4428',style:'short',coat:'navy',hat:'red',band:'#EFE6D4'}},
 gagnon:{name:'Mme Gagnon', role:'Billetterie de la traverse', look:{skin:0,hair:'#B9B4AC',style:'mid',grey:true,coat:'grey',noHat:true,glasses:true,collar:'#F2EFE8'}},
 pauline:{name:'Pauline', role:'Grand-mère de Léo', look:{skin:2,hair:'#CFCBC4',style:'mid',grey:true,coat:'plum',hat:'cream',band:'#B8443A',glasses:true,apron:'#EFE6D6'}},
 leo:{name:'Léo', role:'9 ans, de Lévis', pitch:1.4, look:{skin:4,hair:'#1E1612',style:'short',coat:'olive',hat:'green',band:'#EFE6D4',pants:'url(#pantsDenim)'}}
};
function npcFig(id,o){ return person(Object.assign({},NPC[id].look,o)); }
function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }

function kioskBuilding(){
 return `${shadow(665,455,210,9,.28)}
 <rect x="478" y="196" width="372" height="258" fill="url(#logs)"/><rect x="830" y="196" width="20" height="258" fill="#000" opacity=".2"/>
 <polygon points="458,200 664,120 870,200" fill="#4A2E18"/>
 ${snowCap(452,876,204,664,114)}
 <path d="M466,212 Q664,224 862,212" stroke="#2A2A2A" stroke-width="1" fill="none"/>
 ${Array.from({length:15},(_,i)=>{const x=470+i*28,y=218+Math.sin(i*1.3)*1.5;return `<circle cx="${x}" cy="${y}" r="7" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="2.4" fill="#FFE2A0"/>`;}).join('')}
 <rect x="565" y="163" width="200" height="32" rx="4" fill="#232634"/><rect x="568" y="166" width="194" height="26" rx="3" fill="none" stroke="#E9C77B" stroke-width="1" opacity=".55"/>
 <rect x="528" y="216" width="272" height="124" rx="3" fill="url(#interior)"/>`;
}
function tireTrough(x,y){ /* x,y = front-left top corner of the box */
 return `${shadow(x+92,y+79,98,8,.28)}
 <rect x="${x+149}" y="${y+4}" width="8" height="64" rx="1.5" fill="#4A2E18"/>
 <rect x="${x+16}" y="${y+20}" width="10" height="58" rx="1.5" fill="url(#wood)"/><rect x="${x+156}" y="${y+20}" width="10" height="58" rx="1.5" fill="#4A2E18"/>
 <polygon points="${x},${y} ${x+170},${y} ${x+184},${y-16} ${x+14},${y-16}" fill="url(#snowTop)"/>
 <rect x="${x}" y="${y}" width="170" height="26" fill="url(#wood)"/>
 <polygon points="${x+170},${y} ${x+184},${y-16} ${x+184},${y+10} ${x+170},${y+26}" fill="#4A2E18"/>
 <rect x="${x}" y="${y}" width="170" height="2.5" fill="#B48558"/><rect x="${x}" y="${y+12}" width="170" height="1.2" fill="#3B2412" opacity=".5"/>
 <path d="M${x+26},${y-6} Q${x+30},${y-11} ${x+46},${y-11} L${x+80},${y-11} Q${x+88},${y-10} ${x+84},${y-6} Q${x+80},${y-3} ${x+64},${y-3} L${x+34},${y-3} Q${x+22},${y-3} ${x+26},${y-6} Z" fill="url(#syrup)"/>
 <path d="M${x+34},${y-9} L${x+72},${y-9}" stroke="#FFDFA0" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>
 <path d="M${x+92},${y-6} Q${x+96},${y-11} ${x+112},${y-11} L${x+140},${y-11} Q${x+148},${y-10} ${x+144},${y-6} Q${x+140},${y-3} ${x+126},${y-3} L${x+100},${y-3} Q${x+88},${y-3} ${x+92},${y-6} Z" fill="url(#syrup)"/>
 <path d="M${x+100},${y-9} L${x+134},${y-9}" stroke="#FFDFA0" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>
 <rect x="${x+147}" y="${y-24}" width="32" height="3.5" rx="1.5" fill="#E2CFA4" transform="rotate(-8 ${x+164} ${y-22})"/>
 <ellipse cx="${x+152}" cy="${y-15}" rx="8.5" ry="4.6" fill="url(#syrup)"/>`;
}

function sceneKiosque(pl){
 return `<rect width="960" height="540" fill="url(#sky)"/>
 ${chateau(710,66,1)}
 ${oldHouse(14,196,156,256,'stone','slate','')}${oldHouse(170,228,160,224,'ochre','redRoof','#2C4A63')}${oldHouse(330,210,160,242,'greyStone','slate','#2C4A63')}
 ${snowGround(438)}
 ${lampPost(912,502)}
 ${kioskBuilding()}
 ${npcFig('josee',{x:650,y:452,sc:.95,noShadow:true})}
 <rect x="528" y="216" width="272" height="9" fill="#000" opacity=".25"/>
 <rect x="478" y="340" width="372" height="114" fill="url(#logs)"/><rect x="830" y="340" width="20" height="114" fill="#000" opacity=".2"/>
 <polygon points="518,338 810,338 824,350 504,350" fill="url(#counterTop)"/>
 <rect x="504" y="350" width="320" height="11" rx="1" fill="url(#counterFront)"/><rect x="504" y="361" width="320" height="6" fill="#000" opacity=".18"/>
 ${shadow(582,348,44,5.5,.32,'blurS')}
 <ellipse cx="582" cy="345.5" rx="40" ry="6.5" fill="#EFEBE3"/><ellipse cx="582" cy="347" rx="40" ry="5" fill="#CFC7B8"/><ellipse cx="582" cy="344.5" rx="33" ry="4.6" fill="#FBF9F5"/>
 <path d="M553,341 C553,333 570,331 582,332 C596,331 611,333 611,341 C611,346 596,347 582,347 C568,347 553,346 553,341 Z" fill="#93591E"/>
 <path d="M555,339.5 C555,332.5 570,330.5 582,331 C595,330.5 609,332.5 609,339.5 C609,343.5 595,345 582,345 C569,345 555,343.5 555,339.5 Z" fill="url(#pastry)"/>
 <g fill="#6B3410" opacity=".6"><circle cx="567" cy="337" r="1.1"/><circle cx="576" cy="340.5" r="1"/><circle cx="587" cy="336" r="1.1"/><circle cx="596" cy="339.5" r="1"/><circle cx="583" cy="334.5" r=".9"/></g>
 <path d="M562,335 Q577,331 594,333" fill="none" stroke="#FFF0C8" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>
 ${shadow(736,348.5,20,4,.32,'blurS')}
 <path d="M721,312 L751,312 L747,346 Q736,349 725,346 Z" fill="url(#cup)"/><path d="M722.4,322 L749.6,322 L748.3,335 L723.7,335 Z" fill="url(#sleeve)"/>
 <rect x="719" y="306" width="34" height="7" rx="3" fill="#F3EFE7"/><rect x="719" y="310" width="34" height="3" fill="#CFC6B6"/>
 <path d="M725,316 L727,344" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".75"/>
 <path d="M731,298 q-5,-8 0,-15 q5,-7 0,-14" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>
 ${tireTrough(300,420)}
 ${person(Object.assign(playerLook(pl),{x:205,y:500,sc:1.08,map:true}))}
 ${snowfall(50,7)}`;
}

function gazebo(x,y,s){
 return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0,2,44,5,.22,'blurS')}
 <rect x="-34" y="-70" width="5" height="70" fill="#E9E4DA"/><rect x="29" y="-70" width="5" height="70" fill="#B9B3A8"/><rect x="-3" y="-70" width="5" height="70" fill="#D5CFC4"/>
 <rect x="-38" y="-24" width="76" height="3" fill="#2F4A40"/>
 <path d="M-44,-68 Q0,-120 44,-68 Z" fill="url(#chRoof)"/><path d="M0,-108 Q22,-96 44,-68 L22,-68 Z" fill="#000" opacity=".15"/>
 <path d="M-40,-70 Q0,-112 40,-70 Q20,-80 0,-76 Q-20,-80 -40,-70Z" fill="#F4F6F8" opacity=".9"/>
 <rect x="-46" y="-70" width="92" height="5" fill="#3E6B5C"/><path d="M0,-112 v-10" stroke="#2F4A40" stroke-width="2"/><circle cx="0" cy="-124" r="3" fill="#2F4A40"/></g>`;
}
function toboggan(x,y,s,rot){
 return `<g transform="translate(${x} ${y}) rotate(${rot||0}) scale(${s})">${shadow(0,2,46,4,.3,'blurS')}
 <path d="M-44,-2 L36,-2 C46,-2 52,-10 50,-20 C48,-28 40,-28 38,-20 C37,-14 34,-10 28,-10 L-44,-10 Z" fill="url(#sled)"/>
 <path d="M-44,-10 L28,-10" stroke="#E2BE8E" stroke-width="1.5"/><path d="M-40,-6 H30" stroke="#6E4524" stroke-width="1" opacity=".5"/>
 <path d="M-38,-12 C-30,-16 18,-16 26,-12" stroke="#9B2F2F" stroke-width="2" fill="none"/></g>`;
}
function sceneGlissade(pl){
 // slide: lanes run from high right (x 900,y 210) down-left to (x 470, y 418)
 const lane=(o)=>`<polygon points="${470+o},${418+o*.2} ${900+o},${210+o*.2} ${900+o},${220+o*.2} ${470+o},${428+o*.2}" fill="url(#ice)"/>`;
 return `<rect width="960" height="540" fill="url(#skyDay)"/>
 <path d="M0,300 L960,286 L960,380 L0,384 Z" fill="url(#river)"/>
 <g fill="url(#ice)" opacity=".9"><ellipse cx="120" cy="330" rx="46" ry="5"/><ellipse cx="330" cy="352" rx="70" ry="6"/><ellipse cx="610" cy="318" rx="54" ry="4"/><ellipse cx="820" cy="344" rx="60" ry="5"/><ellipse cx="460" cy="372" rx="40" ry="4"/></g>
 <path d="M0,300 C120,282 240,292 360,284 C520,274 700,288 960,276 L960,290 L0,304 Z" fill="#8E9DB0"/>
 <g fill="#E8E2D6"><rect x="560" y="270" width="10" height="10"/><rect x="590" y="272" width="14" height="8"/><rect x="640" y="268" width="10" height="12"/><rect x="700" y="270" width="16" height="10"/><rect x="760" y="268" width="10" height="12"/></g>
 <path d="M672,280 V252 L676,240 L680,252 V280 Z" fill="#E8E2D6"/>
 <path d="M0,290 L520,290 C560,300 580,330 600,384 L0,384 Z" fill="#9C9284"/>
 <path d="M0,290 L520,290 C540,294 552,300 560,306 L0,306 Z" fill="#F4F6F8"/>
 <path d="M520,290 C560,300 580,330 600,384 L560,384 C548,340 536,312 520,300 Z" fill="#7C7366"/>
 ${chateau(190,104,1.03,.97)}
 <rect x="0" y="384" width="960" height="40" fill="#E9EEF3"/>
 <g stroke="#2F4A40" stroke-width="3"><path d="M0,404 H960"/><path d="M0,420 H960" stroke-width="2"/></g>
 <g stroke="#2F4A40" stroke-width="2">${Array.from({length:40},(_,i)=>`<path d="M${i*24+6},404 V430"/>`).join('')}</g>
 <rect x="0" y="430" width="960" height="110" fill="url(#planks)"/>
 <rect x="0" y="430" width="960" height="110" fill="url(#snowG)" opacity=".55"/>
 <rect x="0" y="430" width="960" height="4" fill="#5E4129" opacity=".4"/>
 <!-- the slide -->
 ${shadow(700,440,240,10,.25)}
 ${[0,1,2,3,4].map(i=>{const x=520+i*92, yTop=400-i*45;return `<rect x="${x}" y="${yTop}" width="8" height="${438-yTop}" fill="url(#wood)"/><path d="M${x+4},${yTop+10} L${x+50},${438}" stroke="#5F3D22" stroke-width="3" opacity=".6"/>`;}).join('')}
 <polygon points="470,428 900,220 900,246 470,452" fill="url(#woodH)"/>
 ${lane(0)}${lane(-14)}${lane(-28)}
 <polygon points="470,390 900,182 900,192 470,400" fill="url(#ice)"/>
 <path d="M470,386 L900,178" stroke="#7A5233" stroke-width="5"/><path d="M470,426 L900,218" stroke="#7A5233" stroke-width="4"/>
 <path d="M470,404 L900,196 M470,414 L900,206" stroke="#7A5233" stroke-width="2" opacity=".7"/>
 ${toboggan(760,268,.55,-25)}
 <!-- start hut at top right -->
 <rect x="880" y="120" width="80" height="110" fill="url(#logs)"/>
 <polygon points="870,124 920,90 970,124" fill="#4A2E18"/>${snowCap(866,974,122,920,86)}
 <!-- sled stack and ticket hut at the bottom -->
 <rect x="300" y="350" width="110" height="88" fill="url(#logs)"/><rect x="398" y="350" width="12" height="88" fill="#000" opacity=".18"/>
 <polygon points="290,354 355,318 420,354" fill="#4A2E18"/>${snowCap(286,424,352,355,314)}
 <rect x="318" y="374" width="66" height="34" rx="2" fill="url(#interior)"/><rect x="314" y="406" width="74" height="6" fill="url(#counterTop)"/>
 <rect x="316" y="324" width="78" height="22" rx="3" fill="#232634"/>
 ${toboggan(430,470,.8,0)}${toboggan(436,460,.8,0)}${toboggan(442,450,.8,0)}
 ${npcFig('patrice',{x:560,y:498,sc:1.04})}
 ${person(Object.assign(playerLook(pl),{x:200,y:505,sc:1.1,map:true}))}
 ${snowfall(36,11)}`;
}

function ferry(){
 return `<g>${shadow(735,410,230,8,.3)}
 <path d="M500,330 L960,330 L960,404 L540,404 C522,394 508,360 500,330 Z" fill="url(#hull)"/>
 <path d="M506,356 L960,356 L960,368 L516,368 Z" fill="#2B4A9B"/>
 <path d="M540,404 L960,404 L960,410 L548,410 Z" fill="#1F2A40" opacity=".55"/>
 <rect x="560" y="276" width="400" height="56" fill="url(#hull)"/><rect x="560" y="276" width="400" height="5" fill="#9AA6B2"/>
 ${Array.from({length:11},(_,i)=>`<rect x="${578+i*34}" y="292" width="22" height="16" rx="2" fill="#5C7895"/><rect x="${578+i*34}" y="292" width="22" height="5" rx="2" fill="#A9C2D8" opacity=".6"/>`).join('')}
 <rect x="640" y="236" width="220" height="42" fill="url(#hull)"/>
 ${Array.from({length:6},(_,i)=>`<rect x="${656+i*34}" y="248" width="22" height="14" rx="2" fill="#5C7895"/>`).join('')}
 <rect x="700" y="206" width="90" height="32" fill="url(#hull)"/><rect x="708" y="214" width="74" height="12" rx="2" fill="#3F5B78"/>
 <rect x="742" y="170" width="6" height="38" fill="url(#metal)"/><path d="M745,176 L780,190 M745,176 L712,190" stroke="#5E6772" stroke-width="1.2"/>
 <path d="M560,276 L960,276" stroke="#C9D2DA" stroke-width="2"/>
 <g stroke="#B9C3CD" stroke-width="1.4">${Array.from({length:20},(_,i)=>`<path d="M${562+i*20},276 v-10"/>`).join('')}<path d="M560,266 H960"/></g></g>`;
}
function sceneTraversier(pl){
 return `<rect width="960" height="540" fill="url(#sky)"/>
 <path d="M0,262 C140,250 300,256 460,246 C640,236 800,250 960,240 L960,300 L0,300 Z" fill="#8E9DB0"/>
 <g fill="#E8E2D6" opacity=".9">${[60,96,150,210,260,330,380,450,520,580,640].map((x,i)=>`<rect x="${x}" y="${250-(i%3)*4}" width="${12+(i%2)*6}" height="${10+(i%3)*4}"/>`).join('')}</g>
 <path d="M300,254 V218 L305,204 L310,218 V254 Z" fill="#E8E2D6"/><path d="M296,254 h18 v6 h-18z" fill="#D8D0C2"/>
 <path d="M0,296 L960,290 L960,440 L0,440 Z" fill="url(#river)"/>
 <g fill="url(#ice)">${[[70,320,60],[240,350,90],[420,312,50],[150,392,70],[380,400,110],[60,425,50]].map(([x,y,r])=>`<path d="M${x-r},${y} q${r*.3},-7 ${r},-6 q${r*.6},1 ${r},6 q-${r*.4},6 -${r},5 q-${r*.6},0 -${r},-5Z"/>`).join('')}</g>
 <g fill="#fff" opacity=".35"><path d="M0,346 Q120,340 240,346 T480,344" stroke="#fff" fill="none"/></g>
 ${ferry()}
 <!-- quay -->
 <path d="M0,430 L960,430 L960,540 L0,540 Z" fill="#9AA3AD"/>
 <path d="M0,430 L960,430 L960,446 L0,446 Z" fill="#B8C0C8"/><path d="M0,440 H960" stroke="#E2B53A" stroke-width="3"/>
 <path d="M0,446 L960,446 L960,540 L0,540 Z" fill="url(#snowG)" opacity=".5"/>
 ${[470,900].map(x=>`${shadow(x,452,12,3,.3,'blurS')}<rect x="${x-8}" y="428" width="16" height="22" rx="4" fill="#2A2F3A"/><rect x="${x-11}" y="426" width="22" height="6" rx="3" fill="#3A404C"/>`).join('')}
 <path d="M470,432 C520,420 560,410 600,404" stroke="#C9A86A" stroke-width="3" fill="none"/>
 <!-- ticket booth -->
 ${shadow(165,452,120,8,.28)}
 <rect x="50" y="250" width="230" height="200" fill="url(#greyStone)"/><rect x="50" y="250" width="230" height="200" fill="url(#blocks)"/>
 <rect x="266" y="250" width="14" height="200" fill="#000" opacity=".14"/>
 <rect x="40" y="236" width="250" height="18" fill="url(#slate)"/><rect x="40" y="228" width="250" height="10" rx="3" fill="#F4F6F8"/>
 <rect x="70" y="262" width="190" height="28" rx="3" fill="#232634"/>
 <rect x="84" y="306" width="162" height="98" rx="3" fill="url(#interior)"/>
 <clipPath id="boothClip"><rect x="84" y="306" width="162" height="98"/></clipPath>
 <g clip-path="url(#boothClip)">${npcFig('gagnon',{x:165,y:525,sc:.92,noShadow:true})}</g>
 <rect x="84" y="306" width="162" height="98" rx="3" fill="#BFD5E6" opacity=".18"/>
 <path d="M96,312 L150,312 L110,400 L96,400 Z" fill="#fff" opacity=".12"/>
 <rect x="50" y="404" width="230" height="46" fill="url(#greyStone)"/><rect x="50" y="404" width="230" height="46" fill="url(#blocks)"/>
 <rect x="76" y="398" width="178" height="8" rx="1" fill="url(#counterTop)"/>
 ${person(Object.assign(playerLook(pl),{x:380,y:506,sc:1.1}))}
 ${snowfall(30,5)}`;
}

function cabane(){
 return `<g>${shadow(170,446,150,9,.28)}
 <rect x="40" y="250" width="270" height="196" fill="url(#logs)"/><rect x="290" y="250" width="20" height="196" fill="#000" opacity=".2"/>
 <polygon points="20,256 175,176 330,256" fill="#4A2E18"/>${snowCap(16,334,254,175,170)}
 <rect x="236" y="150" width="26" height="60" fill="url(#greyStone)"/><rect x="232" y="146" width="34" height="8" fill="#F4F6F8"/>
 <path d="M249,140 C240,120 262,110 252,90 C246,76 262,66 256,50" stroke="#E9EEF3" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>
 <rect x="150" y="320" width="54" height="126" rx="2" fill="#8E2E26"/><rect x="150" y="320" width="54" height="126" rx="2" fill="none" stroke="#5E1E19" stroke-width="3"/><circle cx="194" cy="388" r="3" fill="#D8B56A"/>
 <rect x="66" y="300" width="56" height="46" fill="url(#win)"/><path d="M94,300 V346 M66,323 H122" stroke="#3A2618" stroke-width="3"/><rect x="62" y="296" width="64" height="54" fill="none" stroke="#5A3A20" stroke-width="4"/>
 <rect x="226" y="300" width="50" height="46" fill="url(#win)"/><path d="M251,300 V346 M226,323 H276" stroke="#3A2618" stroke-width="3"/><rect x="222" y="296" width="58" height="54" fill="none" stroke="#5A3A20" stroke-width="4"/>
 <rect x="70" y="272" width="210" height="22" rx="3" fill="#232634"/></g>`;
}
function sceneLevis(pl){
 return `<rect width="960" height="540" fill="url(#sky)"/>
 <path d="M0,300 L960,290 L960,350 L0,354 Z" fill="url(#river)"/>
 <g fill="url(#ice)" opacity=".9"><ellipse cx="200" cy="330" rx="50" ry="4"/><ellipse cx="520" cy="318" rx="70" ry="5"/><ellipse cx="800" cy="336" rx="56" ry="4"/></g>
 <path d="M380,300 L380,262 C420,254 470,250 540,252 L760,256 L960,262 L960,292 L380,302 Z" fill="#8F8678"/>
 <path d="M380,262 C420,254 470,250 540,252 L760,256 L960,262 L960,268 L380,268 Z" fill="#F4F6F8" opacity=".8"/>
 ${chateau(640,214,.3,.9)}
 <g fill="#D8CFC2" opacity=".9">${[440,470,500,760,790,820,860].map((x,i)=>`<rect x="${x}" y="${246-(i%2)*4}" width="16" height="${12+(i%2)*4}"/>`).join('')}</g>
 ${snowGround(360)}
 ${mapleTree(330,380,.9)}${mapleTree(900,380,1)}
 ${bucket(327,330)}
 ${cabane()}
 ${npcFig('pauline',{x:510,y:470,sc:1})}
 ${tireTrough(420,430)}
 ${npcFig('leo',{x:690,y:500,sc:.72,holdSash:true})}
 ${person(Object.assign(playerLook(pl),{x:820,y:510,sc:1.1}))}
 ${snowfall(30,13)}`;
}

function floatSVG(){
 return `<g>${shadow(570,446,200,9,.4)}
 <rect x="390" y="350" width="360" height="80" rx="10" fill="url(#float)"/>
 <rect x="390" y="350" width="360" height="12" rx="6" fill="#4A7BC4"/>
 ${[430,520,620,710].map(x=>`<circle cx="${x}" cy="436" r="14" fill="#1A1D26"/><circle cx="${x}" cy="436" r="5" fill="#5E6772"/>`).join('')}
 <g fill="url(#ice)">
  <polygon points="470,350 500,250 530,350"/><polygon points="520,350 570,190 620,350"/><polygon points="610,350 640,260 670,350"/>
  <polygon points="440,350 455,300 470,350"/><polygon points="670,350 690,290 710,350"/></g>
 <g fill="#9FC3E0" opacity=".5"><polygon points="570,190 620,350 580,350"/><polygon points="500,250 530,350 512,350"/><polygon points="640,260 670,350 652,350"/></g>
 <path d="M520,350 L570,190 L572,350" fill="#fff" opacity=".4"/>
 ${Array.from({length:18},(_,i)=>{const x=398+i*20;return `<circle cx="${x}" cy="372" r="8" fill="url(#glowStrong)"/><circle cx="${x}" cy="372" r="2.6" fill="${['#FFE2A0','#A9D8FF','#FFB4A8'][i%3]}"/>`;}).join('')}
 <rect x="410" y="384" width="320" height="30" rx="4" fill="#15284D"/></g>`;
}
function crowd(){
 let g=''; const xs=[30,80,130,300,350,860,910,940]; xs.forEach((x,i)=>{ const h=64+(i%3)*10;
  g+=`<g transform="translate(${x} 540)"><path d="M-20,0 C-20,-${h-30} -16,-${h-22} 0,-${h-22} C16,-${h-22} 20,-${h-30} 20,0 Z" fill="#141A2E"/><circle cx="0" cy="-${h-8}" r="12" fill="#141A2E"/>${i%2?`<path d="M-12,-${h-4} Q0,-${h+16} 12,-${h-4}Z" fill="#1E2640"/>`:''}</g>`; });
 return g;
}
function sceneDefile(pl){
 let stars=''; let s=3; const r=()=>(s=(s*9301+49297)%233280)/233280;
 for(let i=0;i<60;i++) stars+=`<circle cx="${(r()*960).toFixed(0)}" cy="${(r()*220).toFixed(0)}" r="${(.5+r()*1.1).toFixed(1)}" fill="#fff" opacity="${(.3+r()*.6).toFixed(2)}"/>`;
 const burst=(x,y,c)=>`<g transform="translate(${x} ${y})" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".85">${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<path d="M${(Math.cos(a)*10).toFixed(1)},${(Math.sin(a)*10).toFixed(1)} L${(Math.cos(a)*30).toFixed(1)},${(Math.sin(a)*30).toFixed(1)}"/>`;}).join('')}<circle r="40" fill="${c}" opacity=".12" stroke="none"/></g>`;
 return `<rect width="960" height="540" fill="url(#skyNight)"/>${stars}
 ${burst(250,90,'#FFD27A')}${burst(720,70,'#9FD3FF')}${burst(860,150,'#FFB0A0')}
 <path d="M300,300 L660,300 L700,440 L260,440 Z" fill="#1C2748"/>
 ${chateau(480,200,.55,.6)}
 <path d="M200,330 L760,330 L800,440 L160,440 Z" fill="#18213F"/>
 <g fill="#F2C46D" opacity=".55">${[[230,350],[262,362],[300,346],[650,352],[690,364],[720,348],[600,370],[340,372]].map(([x,y])=>`<rect x="${x}" y="${y}" width="5" height="7"/>`).join('')}</g>
 <g>${oldHouse(-10,230,150,230,'stone','slate','')}${oldHouse(800,220,170,240,'greyStone','slate','#2C4A63')}</g>
 <rect width="960" height="540" fill="#0E1630" opacity=".42"/>
 ${[[24,260],[94,260],[24,340],[94,340],[834,250],[904,250],[834,330],[904,330]].map(([x,y])=>`<circle cx="${x+16}" cy="${y+22}" r="30" fill="url(#glow)"/>`).join('')}
 ${snowGround(440,true)}
 <path d="M0,40 Q480,110 960,40" stroke="#1A1D26" stroke-width="1.2" fill="none"/>
 ${Array.from({length:24},(_,i)=>{const x=i*42+10,y=40+Math.sin(i/23*Math.PI)*68;return `<circle cx="${x}" cy="${y+5}" r="9" fill="url(#glowStrong)"/><circle cx="${x}" cy="${y+5}" r="2.6" fill="${['#FFE2A0','#A9D8FF','#FFB4A8'][i%3]}"/>`;}).join('')}
 ${lampPost(70,470,true)}
 ${floatSVG()}
 ${npcFig('karine',{x:820,y:500,sc:1.05})}
 ${person(Object.assign(playerLook(pl),{x:220,y:505,sc:1.1,holdSash:true}))}
 ${crowd()}
 ${snowfall(36,17,true)}`;
}

/* Aerial map of Québec and Lévis */
function sceneMap(){
 return `<rect width="960" height="540" fill="#EEF2F5"/>
 <g stroke="#D7DEE6" stroke-width="1">${Array.from({length:24},(_,i)=>`<path d="M${i*40},0 V540"/>`).join('')}${Array.from({length:14},(_,i)=>`<path d="M0,${i*40} H960"/>`).join('')}</g>
 <path d="M0,330 C200,300 380,300 560,250 C700,210 820,190 960,150 L960,300 C820,330 700,350 560,380 C380,420 200,430 0,470 Z" fill="url(#river)"/>
 <path d="M0,330 C200,300 380,300 560,250 C700,210 820,190 960,150" stroke="#2C5070" stroke-width="2" fill="none" opacity=".5"/>
 <g fill="url(#ice)" opacity=".85">${[[90,380,40],[260,350,60],[420,340,46],[600,300,50],[760,250,60],[880,220,30],[330,410,50]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.16}"/>`).join('')}</g>
 <!-- Haute-Ville: old walls and streets -->
 <path d="M150,90 L470,70 L520,170 L470,232 L250,262 L170,220 Z" fill="#E4DCCD"/>
 <path d="M150,90 L470,70 L520,170 L470,232 L250,262 L170,220 Z" fill="none" stroke="#A99B88" stroke-width="5" stroke-linejoin="round"/>
 <path d="M330,190 L380,170 L410,200 L380,240 L330,236 L310,212 Z" fill="#D3C8B8" stroke="#8E7F6C" stroke-width="3"/>
 <g stroke="#C9BEAA" stroke-width="2">${[110,140,170,200].map(y=>`<path d="M170,${y} L480,${y-14}"/>`).join('')}${[220,280,340,400].map(x=>`<path d="M${x},80 L${x+20},240"/>`).join('')}</g>
 <!-- Plaines d'Abraham -->
 <path d="M60,150 L160,120 L180,240 L90,280 L40,230 Z" fill="#E9F0EC"/>
 <g fill="#7D9A86">${[[80,190],[110,170],[130,220],[70,240],[150,160],[100,250]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>
 <!-- Château -->
 <g transform="translate(470 150) scale(.18)">${chateau(0,0,1,1)}</g>
 <!-- Basse-Ville -->
 <g fill="#D8CFC2">${[[500,220],[520,236],[540,214],[560,228]].map(([x,y])=>`<rect x="${x}" y="${y}" width="14" height="10" rx="1"/>`).join('')}</g>
 <!-- Lévis -->
 <path d="M520,420 C640,380 760,350 960,320 L960,540 L480,540 Z" fill="#E7E1D6"/>
 <g fill="#D3C8B8">${[[600,430],[630,412],[660,440],[700,400],[740,420],[780,392],[820,410],[860,380],[690,450],[760,450]].map(([x,y])=>`<rect x="${x}" y="${y}" width="16" height="12" rx="1"/>`).join('')}</g>
 <path d="M728,404 V378 L732,368 L736,378 V404Z" fill="#B9AE9C"/>
 <!-- route -->
 <path d="M200,175 C280,150 360,130 440,140 C500,150 520,190 535,222 M535,222 C580,280 620,330 650,372" fill="none" stroke="#9B2F2F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>
 <path d="M650,372 C600,300 560,250 330,120" fill="none" stroke="#2C5E67" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" opacity=".7"/>
 <g transform="translate(590 300) rotate(-52)"><path d="M-14,-5 L10,-5 L16,0 L10,5 L-14,5 Z" fill="#fff" stroke="#2B4A9B" stroke-width="2"/></g>`;
}
const MAP_PINS={kiosque:[200,175], glissade:[440,140], traversier:[535,222], levis:[650,372], defile:[330,120]};
const SCENES={kiosque:sceneKiosque, glissade:sceneGlissade, traversier:sceneTraversier, levis:sceneLevis, defile:sceneDefile};
