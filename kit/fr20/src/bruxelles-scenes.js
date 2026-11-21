/* ===== Bruxelles: comic panel art (450 x 240 each), animated album finale, map. ===== */
const NPC={
 lucas:{name:'Lucas', role:'Étudiant en BD', look:{skin:4,hair:'#1E1612',style:'short',coat:'olive',noHat:true,scarf:''}},
 nadia:{name:'Nadia', role:'Patronne de la friterie', look:{skin:2,hair:'#2A1A12',style:'mid',coat:'rust',noHat:true,apron:'#EFE6D6'}},
 lambert:{name:'Mme Lambert', role:'Éditrice de BD', pitch:.95, look:{skin:5,hair:'#B9B4AC',style:'mid',grey:true,coat:'navy',noHat:true,glasses:true,collar:'#F2EFE8'}}
};
const XTRA={client:{skin:1,hair:'#C7A160',style:'short',coat:'blue',noHat:true}, t1:{skin:0,hair:'#A2502B',style:'long',coat:'yellow',noHat:true}, t2:{skin:3,hair:'#1E1612',style:'short',coat:'magenta',noHat:true}};
function npcFig(id,o){ return person(Object.assign({},NPC[id].look,o)); }
function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }
const ME=(pl,o)=>person(Object.assign(playerLook(pl,GAME.playerExtra),o));
const F=(look,x,y,sc,o)=>person(Object.assign({},look,{x,y,sc:sc||.66},o||{}));

const BX_DEFS=(()=>{
 const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 return `<defs><pattern id="bdDots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.4" fill="#C9C1B0"/></pattern>
 <pattern id="bxTiles" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#F6F7F5"/><path d="M30,0 V30 H0" stroke="#D9DEDF" stroke-width="1.5" fill="none"/></pattern>
 <pattern id="bxBrick" width="36" height="18" patternUnits="userSpaceOnUse"><rect width="36" height="18" fill="#B8664A"/><path d="M0,9 H36 M0,18 H36 M18,0 V9 M0,9 V18 M36,9 V18" stroke="#8E4A34" stroke-width="1.2"/></pattern>
 <pattern id="bxCobble" width="22" height="14" patternUnits="userSpaceOnUse"><rect width="22" height="14" fill="#6E6A70"/><rect x="1" y="1" width="9" height="5" rx="2" fill="#86818A"/><rect x="12" y="1" width="9" height="5" rx="2" fill="#7E7A82"/><rect x="6" y="8" width="9" height="5" rx="2" fill="#8A858E"/></pattern>
 <pattern id="bxStripe" width="24" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="#C8282E"/><rect x="12" width="12" height="10" fill="#F4F1E8"/></pattern>
 <pattern id="bxWaffle" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#E2A44E"/><rect x="1.5" y="1.5" width="5" height="5" fill="#C9852E"/></pattern>
 ${lg('bxSky',['#7FB0DA','#CFE3F0'],0,1)}${lg('bxEve',['#1E2A52','#3E4F86','#7A6F9E'],0,1)}${lg('bxCounter',['#C8282E','#8E1C20'],0,1)}${lg('bxSteel',['#E3E7EC','#9AA3AE'],0,1)}
 ${lg('bxGold',['#F2D27A','#C9952F'],0,1)}${lg('bxStone',['#D9CDB4','#B3A586'],0,1)}${lg('bxCream',['#F6EEDC','#E6D8BA'],0,1)}${lg('bxGlass',['#CFE6F2','#A3C8DD'],0,1)}${lg('bxFries',['#F7D56A','#E2A93A'],0,1)}</defs>`;
})();
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true">${BX_DEFS}</svg>`);

/* ---------- props ---------- */
function cornet(x,y,s){ s=s||1;
 return `${Array.from({length:7},(_,i)=>`<rect x="${x-10*s+i*3*s}" y="${y-14*s-(i%3)*3*s}" width="${2.6*s}" height="${18*s}" rx="${1*s}" fill="url(#bxFries)" transform="rotate(${(i-3)*5} ${x} ${y})"/>`).join('')}
 <path d="M${x-13*s},${y} L${x+13*s},${y} L${x},${y+30*s} Z" fill="url(#bxStripe)"/><path d="M${x},${y} L${x+13*s},${y} L${x},${y+30*s} Z" fill="#000" opacity=".12"/>`; }
function sauce(x,y,rot){ return `<g transform="rotate(${rot||0} ${x} ${y})"><rect x="${x-6}" y="${y-30}" width="12" height="30" rx="3" fill="#F2F2EE"/><rect x="${x-6}" y="${y-22}" width="12" height="12" fill="#E2602A"/><path d="M${x-3},${y} L${x},${y+8} L${x+3},${y} Z" fill="#E2602A"/></g>`; }
function apronProp(x,y){ return `<path d="M${x-12},${y-20} H${x+12} L${x+16},${y+22} Q${x},${y+26} ${x-16},${y+22} Z" fill="#2B3A5E"/><path d="M${x-12},${y-20} q-6,-10 0,-16 M${x+12},${y-20} q6,-10 0,-16" stroke="#2B3A5E" stroke-width="2" fill="none"/><rect x="${x-7}" y="${y}" width="14" height="8" rx="1" fill="#3E5384"/>`; }
function coins(x,y){ return [0,6,12].map(d=>`<ellipse cx="${x+d}" cy="${y-d*.2}" rx="5" ry="2.2" fill="url(#bxGold)" stroke="#9C6A1C" stroke-width=".6"/>`).join(''); }
function phone(x,y,s,rot){ s=s||1; return `<g transform="rotate(${rot||0} ${x} ${y})"><rect x="${x-7*s}" y="${y-12*s}" width="${14*s}" height="${24*s}" rx="${2.5*s}" fill="#22252E"/><rect x="${x-5.5*s}" y="${y-10*s}" width="${11*s}" height="${19*s}" rx="${1.2*s}" fill="#7FB8E0"/></g>`; }
function sheets(x,y){ return `<g transform="rotate(-6 ${x} ${y})"><rect x="${x-22}" y="${y-28}" width="44" height="56" fill="#FBFAF6" stroke="#1F2433" stroke-width="1.2"/><path d="M${x-18},${y-24} h36 v22 h-36 z M${x-18},${y+2} h17 v22 h-17 z M${x+1},${y+2} h17 v22 h-17 z" fill="none" stroke="#5A6172" stroke-width="1"/><circle cx="${x-6}" cy="${y-14}" r="4" fill="#E9A93A"/></g>`; }
function boom(x,y,txt,c){ return `<g transform="translate(${x} ${y}) rotate(-8)"><path d="M0,-30 L9,-12 L30,-18 L18,-2 L32,12 L12,12 L8,32 L-4,15 L-24,24 L-16,4 L-32,-6 L-12,-10 Z" fill="${c||'#FFE98A'}" stroke="#1F2433" stroke-width="2"/><text y="6" text-anchor="middle" font-family="'Comic Neue','Comic Sans MS',Inter,sans-serif" font-weight="800" font-size="14" fill="#C8282E">${txt}</text></g>`; }

/* ---------- backgrounds ---------- */
function bgFrit(){ return `<rect width="450" height="240" fill="url(#bxTiles)"/><rect y="96" width="450" height="10" fill="#2F6FB5"/>
 <rect x="268" y="40" width="166" height="56" rx="3" fill="#2B2D42"/><text x="351" y="60" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#F2C46D">FRITES · SAUCES</text>
 <path d="M282,72 h70 M282,84 h54 M372,72 h46 M372,84 h40" stroke="#E8E2D6" stroke-width="2" opacity=".7"/>
 <rect x="16" y="110" width="110" height="62" rx="3" fill="url(#bxSteel)"/><rect x="26" y="102" width="40" height="18" rx="2" fill="#5E6772"/><rect x="74" y="102" width="40" height="18" rx="2" fill="#5E6772"/><path d="M46,102 v-14 M94,102 v-14" stroke="#3A3D45" stroke-width="3"/>`; }
function counterFrit(){ return `<polygon points="0,202 450,202 450,210 0,210" fill="#E6E9ED"/><rect y="210" width="450" height="30" fill="url(#bxCounter)"/><rect y="210" width="450" height="5" fill="#000" opacity=".15"/>`; }
function bgMural(){ return `<rect width="450" height="240" fill="url(#bxSky)"/><rect x="0" y="16" width="450" height="190" fill="url(#bxBrick)"/>
 <rect x="30" y="34" width="250" height="150" fill="#F2E6C8"/><rect x="30" y="34" width="250" height="150" fill="none" stroke="#1F2433" stroke-width="4"/>
 <g transform="translate(155 112)"><circle r="48" fill="#F2A93A" stroke="#1F2433" stroke-width="3"/><path d="M-40,-24 L-30,-62 L-12,-42 Z M40,-24 L30,-62 L12,-42 Z" fill="#F2A93A" stroke="#1F2433" stroke-width="3"/>
  <ellipse cx="-16" cy="-8" rx="8" ry="11" fill="#fff" stroke="#1F2433" stroke-width="2"/><ellipse cx="16" cy="-8" rx="8" ry="11" fill="#fff" stroke="#1F2433" stroke-width="2"/><circle cx="-14" cy="-6" r="4" fill="#1F2433"/><circle cx="18" cy="-6" r="4" fill="#1F2433"/>
  <path d="M-6,10 L6,10 L0,16 Z" fill="#C8282E"/><path d="M-16,22 Q0,34 16,22" stroke="#1F2433" stroke-width="3" fill="none"/><path d="M-30,12 h-24 M-30,18 h-22 M30,12 h24 M30,18 h22" stroke="#1F2433" stroke-width="2"/>
  <path d="M-34,-40 Q0,-70 34,-40 Q0,-50 -34,-40 Z" fill="#2F6FB5" stroke="#1F2433" stroke-width="2"/></g>
 <path d="M226,50 h44 v26 h-30 l-10,10 v-10 h-4 z" fill="#fff" stroke="#1F2433" stroke-width="2"/><text x="248" y="69" text-anchor="middle" font-family="'Comic Sans MS',Inter,sans-serif" font-weight="800" font-size="16" fill="#C8282E">!!</text>
 <rect y="200" width="450" height="40" fill="#B9B4AA"/><path d="M0,206 H450" stroke="#9A958C" stroke-width="2"/>`; }
function bgWaffle(){ return `<rect width="450" height="240" fill="url(#bxSky)"/><rect y="150" width="450" height="90" fill="#B9B4AA"/>
 <rect x="20" y="70" width="180" height="110" rx="4" fill="#F4EFE6"/><path d="M10,58 H210 L200,82 H20 Z" fill="url(#bxStripe)"/><text x="110" y="104" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="17" fill="#C8282E">GAUFRES</text>
 ${[50,90,130].map(x=>`<rect x="${x}" y="118" width="28" height="18" rx="2" fill="url(#bxWaffle)"/>`).join('')}<rect x="20" y="140" width="180" height="40" fill="#C9852E"/>`; }
function bgCentre(){ return `<rect width="450" height="240" fill="url(#bxCream)"/>
 <rect x="0" y="0" width="450" height="56" fill="url(#bxGlass)"/>${[0,90,180,270,360,450].map(x=>`<path d="M${x},56 Q${x+45},-6 ${x+90},56" stroke="#2E4A3A" stroke-width="5" fill="none"/>`).join('')}<path d="M0,56 H450" stroke="#2E4A3A" stroke-width="6"/>
 ${[40,150,260,370].map(x=>`<rect x="${x}" y="80" width="60" height="78" fill="#FBFAF6" stroke="#5A3A20" stroke-width="3"/><path d="M${x+6},${86} h48 v30 h-48z M${x+6},${120} h22 v32 h-22z M${x+32},${120} h22 v32 h-22z" fill="none" stroke="#9AA3AE" stroke-width="1.4"/>`).join('')}
 <rect y="196" width="450" height="44" fill="#B79C76"/><path d="M0,196 H450" stroke="#8A6E4A" stroke-width="2"/>`; }
function bgGP(){ let s=`<rect width="450" height="240" fill="url(#bxEve)"/>`;
 s+=`<rect x="200" y="10" width="50" height="190" fill="url(#bxStone)"/><path d="M200,10 L225,-20 L250,10 Z" fill="url(#bxStone)"/>${[30,60,90,120,150].map(y=>`<rect x="216" y="${y}" width="18" height="16" rx="8" fill="#F2C46D" opacity=".8"/>`).join('')}`;
 [[0,60,'#5A4A3A'],[60,70,'#4A3E52'],[260,64,'#4A4252'],[330,60,'#5A4A3A'],[390,60,'#4E4458']].forEach(([x,w,c],i)=>{ const top=40+(i%2)*14;
  s+=`<rect x="${x}" y="${top}" width="${w}" height="${200-top}" fill="${c}"/><path d="M${x},${top} L${x+w/2},${top-26} L${x+w},${top} Z" fill="${c}"/><path d="M${x},${top} L${x+w/2},${top-26} L${x+w},${top}" stroke="url(#bxGold)" stroke-width="3" fill="none"/>`;
  for(let r=0;r<3;r++) for(let c2=0;c2<2;c2++) s+=`<rect x="${x+10+c2*(w/2-6)}" y="${top+16+r*42}" width="${w/2-18}" height="24" rx="2" fill="#F2C46D" opacity="${.55+((r+c2+i)%2)*.3}"/>`;
  s+=`<rect x="${x}" y="${top+6}" width="${w}" height="3" fill="url(#bxGold)"/>`; });
 return s+`<rect y="196" width="450" height="44" fill="url(#bxCobble)"/><rect y="196" width="450" height="44" fill="#1E2A52" opacity=".25"/>`; }

/* ---------- panels ---------- */
const Y=340, S=.95;
const PANEL_ART={
 f1:pl=>`${bgFrit()}${npcFig('nadia',{x:120,y:Y,sc:S,noShadow:true})}${ME(pl,{x:330,y:Y,sc:S,noShadow:true})}${apronProp(225,178)}${counterFrit()}`,
 f2:pl=>`${bgFrit()}${npcFig('nadia',{x:350,y:Y,sc:S,noShadow:true})}${counterFrit()}${F(XTRA.client,150,Y,S)}`,
 f3:pl=>`${bgFrit()}${ME(pl,{x:180,y:Y,sc:S,noShadow:true})}${counterFrit()}${cornet(250,180,1.3)}${sauce(240,154,-150)}${F(XTRA.client,380,Y,S)}`,
 f4:pl=>`${bgFrit()}${ME(pl,{x:250,y:Y,sc:S,noShadow:true})}${npcFig('nadia',{x:395,y:Y,sc:S,noShadow:true})}${counterFrit()}${cornet(190,176,1.2)}${coins(230,204)}${F(XTRA.client,90,Y,S)}`,
 fx:pl=>`${bgFrit()}${npcFig('nadia',{x:180,y:Y,sc:S,noShadow:true})}${ME(pl,{x:350,y:Y,sc:S,noShadow:true})}${counterFrit()}${cornet(250,180,1.3)}${sauce(240,154,-150)}`,
 p1:pl=>`${bgMural()}${npcFig('lucas',{x:90,y:Y,sc:S})}${ME(pl,{x:350,y:Y,sc:S})}${phone(372,150,1.4,-10)}`,
 p2:pl=>`${bgMural()}${npcFig('lucas',{x:140,y:Y,sc:S})}${F(XTRA.t1,300,Y,S)}${F(XTRA.t2,390,Y,S)}<g transform="rotate(-8 340 205)"><rect x="315" y="188" width="54" height="36" fill="#F4EFE6" stroke="#9AA3AE"/><path d="M320,198 h40 M324,208 h28 M330,216 l10,-16" stroke="#2F6FB5" stroke-width="2"/></g>`,
 p3:pl=>`${bgWaffle()}${npcFig('lucas',{x:140,y:Y,sc:S})}${coins(170,214)}${ME(pl,{x:330,y:Y,sc:S})}<rect x="344" y="200" width="34" height="22" rx="2" fill="url(#bxWaffle)" transform="rotate(-10 361 211)"/>`,
 p4:pl=>`${bgMural()}<rect width="450" height="240" fill="#1F2433" opacity=".25"/>${ME(pl,{x:120,y:Y,sc:S})}${phone(150,204,1.3,0)}
  <rect x="236" y="54" width="150" height="176" rx="16" fill="#22252E"/><rect x="246" y="66" width="130" height="152" rx="8" fill="#F4F6F8"/><rect x="254" y="74" width="114" height="66" rx="4" fill="#F2A93A"/><circle cx="311" cy="104" r="20" fill="#F2A93A" stroke="#1F2433" stroke-width="2"/><circle cx="304" cy="100" r="3" fill="#1F2433"/><circle cx="318" cy="100" r="3" fill="#1F2433"/>
  <rect x="270" y="150" width="96" height="40" rx="10" fill="#2F6FB5"/><text x="318" y="168" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" font-weight="600" fill="#fff">Coucou maman!</text><text x="318" y="183" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" fill="#fff">Bruxelles ♥</text>`,
 px:pl=>`${bgWaffle()}${ME(pl,{x:140,y:Y,sc:S})}${coins(170,214)}${npcFig('lucas',{x:330,y:Y,sc:S})}<rect x="344" y="200" width="34" height="22" rx="2" fill="url(#bxWaffle)" transform="rotate(-10 361 211)"/>`,
 c1:pl=>`${bgCentre()}${npcFig('lucas',{x:130,y:Y,sc:S})}${sheets(190,196)}${npcFig('lambert',{x:340,y:Y,sc:S})}`,
 c2:pl=>`${bgCentre()}${npcFig('lucas',{x:120,y:Y,sc:S})}${npcFig('lambert',{x:340,y:Y,sc:S})}<text x="222" y="196" font-family="'Comic Sans MS',Inter,sans-serif" font-size="34" font-weight="800" fill="#2F6FB5">?</text>`,
 c3:pl=>`${bgCentre()}${npcFig('lucas',{x:70,y:Y,sc:S})}${npcFig('lambert',{x:225,y:Y,sc:S})}${sheets(262,200)}${ME(pl,{x:385,y:Y,sc:S})}${boom(330,86,'HA HA!')}`,
 c4:pl=>`${bgCentre()}${npcFig('lambert',{x:110,y:Y,sc:S})}${npcFig('lucas',{x:270,y:Y,sc:S})}${ME(pl,{x:385,y:Y,sc:S})}<circle cx="300" cy="74" r="22" fill="#FBFAF6" stroke="#1F2433" stroke-width="3"/><path d="M300,74 V60 M300,74 L310,80" stroke="#1F2433" stroke-width="3" stroke-linecap="round"/>`,
 cx:pl=>`${bgCentre()}${npcFig('lucas',{x:70,y:Y,sc:S})}${npcFig('lambert',{x:225,y:Y,sc:S})}${sheets(262,200)}${ME(pl,{x:385,y:Y,sc:S})}<text x="270" y="86" font-family="'Comic Sans MS',Inter,sans-serif" font-size="22" font-weight="800" fill="#5A6172">Bof… zzz</text>`,
 g1:pl=>`${bgGP()}${ME(pl,{x:150,y:Y,sc:S})}${npcFig('lucas',{x:350,y:Y,sc:S})}${[[110,108],[136,90],[90,88]].map(([x,y])=>`<path d="M${x},${y-6} L${x+2},${y-2} L${x+6},${y} L${x+2},${y+2} L${x},${y+6} L${x-2},${y+2} L${x-6},${y} L${x-2},${y-2} Z" fill="#F2C46D"/>`).join('')}`,
 g2:pl=>`${bgGP()}${npcFig('lucas',{x:330,y:Y,sc:S})}<ellipse cx="250" cy="212" rx="70" ry="12" fill="#E8E2D6"/><rect x="246" y="216" width="8" height="30" fill="#3A3D45"/>${sheets(236,196)}<rect x="272" y="180" width="5" height="30" fill="#E9A93A" transform="rotate(30 274 195)"/>`,
 g3:pl=>`${bgGP()}${ME(pl,{x:70,y:Y,sc:S})}${npcFig('nadia',{x:225,y:Y,sc:S})}<rect x="186" y="196" width="80" height="9" rx="2" fill="#8A5E3A"/>${cornet(198,178,1)}${cornet(226,178,1)}${cornet(254,178,1)}${npcFig('lucas',{x:385,y:Y,sc:S})}${boom(330,86,'MIAM!')}`,
 g4:pl=>`${bgGP()}<rect x="30" y="60" width="140" height="170" rx="16" fill="#22252E"/><rect x="40" y="72" width="120" height="146" rx="8" fill="#DDE6EE"/>
  <g transform="translate(78 300) scale(.62)">${person({x:0,y:0,skin:pl.skin??1,hair:'#6B6460',style:'short',coat:'navy',noHat:true,noShadow:true})}</g><g transform="translate(124 300) scale(.62)">${person({x:0,y:0,skin:pl.skin??1,hair:'#3A2418',style:'long',coat:'plum',noHat:true,noShadow:true})}</g>
  <rect x="30" y="218" width="140" height="22" fill="#22252E"/>${ME(pl,{x:320,y:Y,sc:S})}${phone(350,204,1.3,0)}`,
 gx:pl=>`${bgGP()}${npcFig('lucas',{x:150,y:Y,sc:S})}${phone(176,150,1.4,-10)}${ME(pl,{x:350,y:Y,sc:S})}`
};

/* ---------- Animated finale: the album ---------- */
function bdCover(pl){
 const name=esc(pl.name||'');
 return `<rect width="960" height="540" fill="#2F6FB5"/><rect width="960" height="540" fill="url(#bdDots)" opacity=".35"/>
 <g transform="translate(250 300)"><path d="M0,-210 L40,-90 L170,-140 L90,-30 L200,40 L70,50 L90,190 L0,90 L-90,190 L-70,50 L-200,40 L-90,-30 L-170,-140 L-40,-90 Z" fill="#FFE98A" stroke="#1F2433" stroke-width="5"/></g>
 <g transform="translate(250 470) scale(1.45)">${ME(pl,{x:0,y:0})}</g>
 <text x="640" y="150" text-anchor="middle" font-family="'Comic Sans MS',Inter,sans-serif" font-weight="800" font-size="34" fill="#FFE98A" stroke="#1F2433" stroke-width="1.5">LES AVENTURES DE</text>
 <text x="640" y="250" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="${Math.min(96,700/Math.max(4,name.length))}" fill="#fff" stroke="#1F2433" stroke-width="3">${name.toUpperCase()}</text>
 <text x="640" y="320" text-anchor="middle" font-family="'Comic Sans MS',Inter,sans-serif" font-weight="800" font-size="40" fill="#FFE98A" stroke="#1F2433" stroke-width="1.5">À BRUXELLES</text>
 <g transform="translate(560 360)">${bgGP().replace(/url\(#bxEve\)/,'#1E2A52')}</g>
 <text x="640" y="525" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="600" fill="#fff">Scénario : ${name} · Dessin : Lucas · Éditions Lambert</text>`;
}
const FINALES={bd:(()=>{
 let timer=0;
 const pages=pr=>STOPS.map(s=>({pg:s.page, cs:(pr.comic&&pr.comic[s.id])||{placed:s.page.panels.map(p=>p.id),bubbles:{},done:true}}));
 const sfx=['MIAM!','CLIC!','WOW!','BRAVO!'];
 return {
  svg(pl){
   const pr=window.__game.state.PR;
   const pgs=pages(pr).map((o,i)=>`<g class="pg" id="bdpg${i+1}">${window.__comic.page(o.pg,o.cs)}${boom(880,500,sfx[i])}</g>`).join('');
   return `<style>.pg{opacity:0;transition:opacity .5s}.pg.on{opacity:1}.pg.on [data-frame]{animation:pop .55s cubic-bezier(.3,1.5,.6,1) backwards}.pg.on [data-frame="1"]{animation-delay:.45s}.pg.on [data-frame="2"]{animation-delay:.9s}.pg.on [data-frame="3"]{animation-delay:1.35s}
   @keyframes pop{0%{opacity:0}100%{opacity:1}}@media (prefers-reduced-motion:reduce){.pg.on [data-frame]{animation:none}.pg{transition:none}}</style>
   <g class="pg on" id="bdpg0">${bdCover(pl)}</g>${pgs}`;
  },
  start(svg){
   let i=0; const all=[...svg.querySelectorAll('.pg')];
   timer=setInterval(()=>{ all[i].classList.remove('on'); i=(i+1)%all.length; void all[i].offsetWidth; all[i].classList.add('on'); }, 4200);
  },
  stop(){ clearInterval(timer); },
  download(pl,pr){
   const defs=[...document.querySelectorAll('svg[width="0"] defs, body > svg defs')].map(d=>d.outerHTML).join('');
   const body=`<g>${bdCover(pl)}</g>`+pages(pr).map((o,i)=>`<g transform="translate(0 ${540*(i+1)})">${window.__comic.page(o.pg,o.cs)}</g>`).join('');
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="2700" viewBox="0 0 960 2700">${defs}${body}</svg>`;
   const img=new Image(), name='bd-'+(pl.name||'moi').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-bruxelles.png';
   img.onload=()=>{ const c=document.createElement('canvas'); c.width=1440; c.height=4050; const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height);
    c.toBlob(b=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); a.remove(); },'image/png'); };
   img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  }
 };
})()};

/* ---------- Map: central Brussels ---------- */
function sceneMap(){
 return `<rect width="960" height="540" fill="#EFEAE0"/>
 <g stroke="#E0D9C8" stroke-width="1">${Array.from({length:25},(_,i)=>`<path d="M${i*40},0 V540"/>`).join('')}${Array.from({length:14},(_,i)=>`<path d="M0,${i*40} H960"/>`).join('')}</g>
 <path d="M300,60 L700,90 L820,300 L640,500 L280,470 L160,260 Z" fill="#F8F4EA" stroke="#C9C0AE" stroke-width="14" stroke-linejoin="round"/>
 <g stroke="#DDD3BE" stroke-width="6" fill="none"><path d="M300,60 L480,280 L640,500"/><path d="M160,260 L480,280 L820,300"/><path d="M700,90 L480,280 L280,470"/></g>
 <rect x="450" y="250" width="60" height="50" fill="url(#bxGold)" stroke="#9C6A1C" stroke-width="2"/><path d="M476,250 V210 L480,198 L484,210 V250Z" fill="#B3A586"/>
 <g fill="#D8CDB8">${[[340,140],[400,170],[560,150],[620,200],[250,280],[330,330],[600,340],[680,280],[400,400],[520,420]].map(([x,y])=>`<rect x="${x}" y="${y}" width="30" height="20" rx="2"/>`).join('')}</g>
 <path d="M300,400 C360,330 420,300 470,290 M470,290 C520,240 560,170 600,150 M600,150 C560,200 520,250 482,275" stroke="#9B2F2F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"/>`;
}
const MAP_PINS={friterie:[300,400], parcours:[400,300], centre:[600,150], grandplace:[480,250]};
const SCENES={};
