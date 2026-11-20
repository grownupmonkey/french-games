/* ===== Montréal scenes (960 x 540). Light from the top left, three tones per object, contact shadows. ===== */
const NPC={
 amira:{name:'Amira', role:'Ton amie de Montréal', look:{skin:3,hair:'#1E1612',style:'long',coat:'plum',noHat:true,scarf:'#E9A93A'}},
 stephane:{name:'Stéphane', role:'Agent de station, métro', pitch:.85, look:{skin:4,hair:'#1E1612',style:'short',coat:'navy',noHat:true,glasses:true,collar:'#F2EFE8'}},
 samira:{name:'Tante Samira', role:'Marchande, marché Jean-Talon', look:{skin:3,hair:'#B9B4AC',style:'mid',grey:true,coat:'rust',noHat:true,apron:'#EFE6D6'}},
 gab:{name:'Gab', role:'Passant sur le Plateau', pitch:.9, look:{skin:0,hair:'#A2502B',style:'short',coat:'olive',hat:'red',band:'#EFE6D4'}},
 melanie:{name:'Mélanie', role:'Comptoir d\'information', look:{skin:5,hair:'#1E1612',style:'mid',coat:'grey',noHat:true,collar:'#F2EFE8'}}
};
function npcFig(id,o){ return person(Object.assign({},NPC[id].look,o)); }
function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }

/* Local gradients for Montréal (prefixed mt). */
const MT_DEFS=(()=>{
 const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 const rg=(id,stops)=>`<radialGradient id="${id}" cx=".35" cy=".3" r=".75">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</radialGradient>`;
 return `<defs>${lg('mtWall',['#EEE8DD','#D9D0C2'],0,1)}${lg('mtFloor',['#B7B1A7','#8C877F'],0,1)}${lg('mtCeil',['#2E323C','#454B57'],0,1)}
 ${lg('mtOrange',['#F39A4A','#D9742A','#A9541A'],0,1)}${lg('mtSteel',['#E3E7EC','#B5BDC6','#7F8893'])}${lg('mtSteelV',['#E3E7EC','#9AA3AE'],0,1)}
 ${lg('mtGlass',['#DCEBF5','#A9C6DA'],0,1)}${lg('mtNavy',['#33436A','#1E2A47'],0,1)}${lg('mtBeam',['#9A6A44','#6A4528'],0,1)}
 ${lg('mtCrate',['#C99A62','#9C6E3E'],0,1)}${lg('mtCrateSide',['#8A5E33','#5E3E20'],0,1)}${lg('mtCan',['#C9CFD6','#F4F6F8','#A7AFB8','#7D8590'])}
 ${lg('mtLabel',['#B8443A','#8C2A22'],0,1)}${lg('mtBrick',['#A65A42','#86422E'],0,1)}${lg('mtBrick2',['#8E5B4C','#6F4337'],0,1)}
 ${lg('mtIron',['#3A3D45','#1C1E24'],0,1)}${lg('mtDoor',['#2F6E6A','#1E4A47'],0,1)}${lg('mtDoorR',['#A23A33','#73241F'],0,1)}
 ${lg('mtShop',['#FFE6B5','#E7A85A'],0,1)}${lg('mtFacade',['#2A3150','#161B30'],0,1)}${lg('mtTunnel',['#D7CFC1','#B4AB9C'],0,1)}
 ${rg('mtApple',['#FF8A78','#C9302C','#7E1416'])}${rg('mtApple2',['#E8E070','#A9B83A','#5E7020'])}${rg('mtSquash',['#FFC777','#E2862A','#9A4E10'])}
 ${rg('mtOven',['#FFE7A6','#F59B3A','#B8441C','#4A1A0C'])}${rg('mtBagel',['#F4C98A','#C98B44','#8A5320'])}</defs>`;
})();

/* Gradients must live outside hidden sections, or Chrome won't paint them. */
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true">${MT_DEFS}</svg>`);

/* ---------- 1. Métro, station Berri-UQAM ---------- */
function turnstile(x){
 return `${shadow(x+28,452,40,6,.3,'blurS')}
 <rect x="${x}" y="370" width="56" height="80" rx="5" fill="url(#mtSteel)"/><rect x="${x+48}" y="370" width="8" height="80" rx="3" fill="#000" opacity=".15"/>
 <rect x="${x}" y="366" width="56" height="10" rx="4" fill="#F4F6F8"/><rect x="${x+8}" y="384" width="22" height="12" rx="2" fill="#2B2D42"/><rect x="${x+11}" y="387" width="16" height="6" rx="1" fill="#4FD18B"/>
 <path d="M${x+56},392 L${x+100},388 L${x+100},420 L${x+56},424 Z" fill="url(#mtGlass)" opacity=".75"/><path d="M${x+60},394 L${x+70},393 L${x+70},420 L${x+60},421 Z" fill="#fff" opacity=".45"/>`;
}
function metroMap(x,y){ /* small wall poster of the four lines */
 return `${shadow(x+118,y+182,110,6,.22,'blurS')}
 <rect x="${x}" y="${y}" width="236" height="172" rx="4" fill="#2B2D42"/><rect x="${x+6}" y="${y+6}" width="224" height="160" rx="2" fill="#FBFAF6"/>
 <path d="M${x+40},${y+30} V${y+90} Q${x+40},${y+112} ${x+62},${y+112} H${x+150} Q${x+168},${y+112} ${x+168},${y+94} V${y+40} L${x+196},${y+22}" fill="none" stroke="#E98A2C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M${x+20},${y+96} H${x+216}" stroke="#2E9B4F" stroke-width="7" stroke-linecap="round"/>
 <path d="M${x+168},${y+96} L${x+206},${y+140}" stroke="#E7C22B" stroke-width="7" stroke-linecap="round"/>
 <path d="M${x+52},${y+60} Q${x+120},${y+48} ${x+176},${y+52} H${x+212}" stroke="#2F6FB5" stroke-width="7" stroke-linecap="round" fill="none"/>
 ${[[40,30],[40,112],[100,96],[130,96],[168,96],[168,70],[176,52],[196,22],[206,140]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="4.5" fill="#fff" stroke="#2B2D42" stroke-width="2"/>`).join('')}`;
}
function sceneMetro(pl){
 return `<rect width="960" height="540" fill="url(#mtWall)"/>
 <g stroke="#B9AE9C" stroke-width="1" opacity=".5">${Array.from({length:24},(_,i)=>`<path d="M${i*40},70 V420"/>`).join('')}${Array.from({length:9},(_,i)=>`<path d="M0,${70+i*40} H960"/>`).join('')}</g>
 <rect y="236" width="960" height="40" fill="url(#mtOrange)"/><rect y="236" width="960" height="4" fill="#FFC48A" opacity=".7"/><rect y="272" width="960" height="4" fill="#000" opacity=".15"/>
 <rect width="960" height="70" fill="url(#mtCeil)"/>
 ${[120,420,720].map(x=>`<ellipse cx="${x+60}" cy="78" rx="120" ry="26" fill="#FFF6DE" opacity=".18"/><rect x="${x}" y="54" width="120" height="10" rx="3" fill="#FFF8E6"/><rect x="${x}" y="62" width="120" height="3" fill="#C9BFA8"/>`).join('')}
 <!-- station name panel (text is HTML) -->
 ${shadow(480,166,124,6,.2,'blurS')}<rect x="360" y="110" width="240" height="46" rx="5" fill="url(#mtNavy)"/><rect x="360" y="110" width="240" height="4" rx="2" fill="#5E72A3"/>
 ${metroMap(686,96)}
 <!-- floor -->
 <path d="M0,420 H960 V540 H0 Z" fill="url(#mtFloor)"/><path d="M0,420 H960" stroke="#6E6A63" stroke-width="2"/>
 <g stroke="#6E6A63" stroke-width="1" opacity=".35">${[-400,-200,0,200,400,600,800,1000,1200,1400].map(x=>`<path d="M${480+(x-480)*.55},420 L${x},540"/>`).join('')}<path d="M0,462 H960"/><path d="M0,505 H960"/></g>
 <!-- ticket booth -->
 ${shadow(170,452,140,8,.3)}
 <rect x="40" y="198" width="260" height="254" rx="6" fill="url(#mtSteelV)"/><rect x="284" y="198" width="16" height="254" fill="#000" opacity=".14"/>
 <rect x="56" y="180" width="228" height="30" rx="4" fill="url(#mtNavy)"/>
 <clipPath id="mtBoothClip"><rect x="66" y="240" width="208" height="122" rx="3"/></clipPath>
 <rect x="66" y="240" width="208" height="122" rx="3" fill="#E8DCC6"/><rect x="66" y="240" width="208" height="30" fill="#D8C9AE"/>
 <g clip-path="url(#mtBoothClip)">${npcFig('stephane',{x:170,y:455,sc:.92,noShadow:true})}</g>
 <rect x="66" y="240" width="208" height="122" rx="3" fill="url(#mtGlass)" opacity=".28"/><path d="M78,246 L130,246 L96,356 L78,356 Z" fill="#fff" opacity=".18"/>
 <rect x="56" y="360" width="228" height="12" rx="2" fill="url(#counterTop)"/><rect x="146" y="352" width="48" height="8" rx="2" fill="#7F8893"/>
 <rect x="40" y="372" width="260" height="80" fill="url(#mtSteel)" opacity=".9"/><path d="M40,392 H300 M40,412 H300 M40,432 H300" stroke="#8D96A1" stroke-width="1" opacity=".5"/>
 ${turnstile(372)}${turnstile(492)}
 ${person(Object.assign(playerLook(pl),{x:690,y:500,sc:1.1}))}`;
}

/* ---------- 2. Marché Jean-Talon ---------- */
function crate(x,y,fruit){
 const balls=[]; const g=fruit==='squash'?'mtSquash':fruit==='green'?'mtApple2':'mtApple', r=fruit==='squash'?15:10.5;
 const cols=fruit==='squash'?3:6, gap=fruit==='squash'?28:19;
 for(let row=0;row<2;row++) for(let i=0;i<cols-row;i++){ const cx=x+16+i*gap+row*gap/2, cy=y-4-row*(r*1.2);
  balls.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${g})"/>${fruit==='squash'?`<path d="M${cx},${cy-r} q2,-6 6,-7" stroke="#5E7020" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${cx-r*.5},${cy-r*.6} Q${cx},${cy} ${cx-r*.4},${cy+r*.7}" stroke="#9A4E10" stroke-width="1" fill="none" opacity=".5"/>`:`<path d="M${cx},${cy-r+1} l1,-4" stroke="#4A2E18" stroke-width="1.6" stroke-linecap="round"/>`}<circle cx="${cx-r*.35}" cy="${cy-r*.4}" r="${r*.22}" fill="#fff" opacity=".45"/>`); }
 const w=cols*gap+8;
 return `${shadow(x+w/2,y+44,w/2+6,5,.3,'blurS')}${balls.join('')}
 <rect x="${x}" y="${y}" width="${w}" height="40" fill="url(#mtCrate)"/><rect x="${x}" y="${y}" width="${w}" height="3" fill="#E2BC86"/>
 <path d="M${x},${y+13} H${x+w} M${x},${y+27} H${x+w}" stroke="#7A5233" stroke-width="1.2" opacity=".55"/><rect x="${x+w-6}" y="${y}" width="6" height="40" fill="#000" opacity=".15"/>`;
}
function syrupCan(x,y){
 return `${shadow(x+15,y+2,17,3.5,.3,'blurS')}
 <rect x="${x}" y="${y-46}" width="30" height="46" rx="2" fill="url(#mtCan)"/><rect x="${x}" y="${y-34}" width="30" height="22" fill="url(#mtLabel)"/>
 <path d="M${x+15},${y-30} l4,5 l-2,0 l3,5 h-10 l3,-5 l-2,0 z" fill="#F2C46D"/>
 <ellipse cx="${x+15}" cy="${y-46}" rx="15" ry="3.5" fill="#E8ECF0"/><rect x="${x+20}" y="${y-54}" width="6" height="8" rx="1" fill="#9AA3AE"/>
 <rect x="${x+4}" y="${y-44}" width="4" height="42" fill="#fff" opacity=".55"/>`;
}
function sceneMarche(pl){
 const lights=Array.from({length:20},(_,i)=>{const x=20+i*48,y=74+Math.sin(i/19*Math.PI)*26;return `<circle cx="${x}" cy="${y}" r="9" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="2.8" fill="#FFE2A0"/>`;}).join('');
 return `<rect width="960" height="540" fill="#E9DDC8"/>
 <!-- hall roof structure -->
 <rect width="960" height="60" fill="#5A4A3A"/>
 ${[0,240,480,720,960].map(x=>`<rect x="${x-9}" y="0" width="18" height="300" fill="url(#mtBeam)"/><rect x="${x+3}" y="0" width="6" height="300" fill="#000" opacity=".15"/>`).join('')}
 <path d="M0,60 H960" stroke="#3E3226" stroke-width="6"/>
 <path d="M0,70 Q480,110 960,70" stroke="#2A2A2A" stroke-width="1" fill="none"/>${lights}
 <!-- stalls in the background -->
 ${[[30,'#2C5E67'],[690,'#9B2F2F']].map(([x,c])=>`<rect x="${x}" y="168" width="240" height="130" fill="#D5C6AE"/><path d="M${x-8},150 H${x+248} L${x+240},176 H${x} Z" fill="${c}"/>${Array.from({length:8},(_,i)=>`<path d="M${x-8+i*32},150 h16 l-2,26 h-14 z" fill="#fff" opacity=".85"/>`).join('')}<rect x="${x+20}" y="230" width="200" height="68" fill="#B99B74"/>${Array.from({length:12},(_,i)=>`<circle cx="${x+34+i*16}" cy="226" r="7" fill="${['#C9302C','#E2862A','#A9B83A'][i%3]}"/>`).join('')}`).join('')}
 <rect width="960" height="300" fill="#E9DDC8" opacity=".35"/>
 <path d="M0,300 H960 V540 H0 Z" fill="#B9AC98"/><path d="M0,300 H960" stroke="#8E8170" stroke-width="2"/>
 <g stroke="#8E8170" stroke-width="1" opacity=".3"><path d="M0,350 H960 M0,410 H960 M0,480 H960"/></g>
 <!-- Samira's stall: awning, back shelf -->
 <rect x="330" y="140" width="430" height="200" fill="#CDBB9C"/>
 <rect x="350" y="170" width="390" height="10" fill="url(#wood)"/><rect x="350" y="230" width="390" height="10" fill="url(#wood)"/>
 ${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${362+i*38}" y="${i%2?186:192}" width="26" height="${i%2?44:38}" rx="2" fill="${i%2?'#7A8F4A':'#C98B44'}"/><rect x="${362+i*38}" y="${i%2?186:192}" width="6" height="${i%2?44:38}" fill="#fff" opacity=".25"/>`).join('')}
 <path d="M318,92 H772 L760,136 H330 Z" fill="#2E7A55"/>${Array.from({length:14},(_,i)=>`<path d="M${318+i*32.4},92 h16.2 l-1.4,44 h-14.8 z" fill="#F4EFE6"/>`).join('')}
 <path d="M330,136 H760 Q752,148 740,136 Q728,148 716,136 Q704,148 692,136 Q680,148 668,136 Q656,148 644,136 Q632,148 620,136 Q608,148 596,136 Q584,148 572,136 Q560,148 548,136 Q536,148 524,136 Q512,148 500,136 Q488,148 476,136 Q464,148 452,136 Q440,148 428,136 Q416,148 404,136 Q392,148 380,136 Q368,148 356,136 Q344,148 330,136 Z" fill="#2E7A55"/>
 <rect x="372" y="92" width="350" height="34" rx="4" fill="#2B2D42"/><rect x="375" y="95" width="344" height="28" rx="3" fill="none" stroke="#E9C77B" stroke-width="1" opacity=".55"/>
 ${npcFig('samira',{x:530,y:372,sc:.98,noShadow:true})}
 <!-- counter -->
 <polygon points="330,330 790,330 806,346 314,346" fill="url(#counterTop)"/>
 <rect x="314" y="346" width="492" height="110" fill="url(#mtCrateSide)"/><path d="M314,372 H806 M314,400 H806 M314,428 H806" stroke="#3E2814" stroke-width="1.2" opacity=".45"/>
 <rect x="790" y="346" width="16" height="110" fill="#000" opacity=".18"/>${shadow(560,460,264,8,.3)}
 ${crate(334,296,'red')}${crate(462,296,'green')}
 <!-- squash crate, envelope, syrup cans -->
 ${crate(590,296,'squash')}
 ${shadow(707,343,18,3,.28,'blurS')}<g transform="rotate(-6 707 336)"><rect x="689" y="330" width="36" height="14" rx="1.5" fill="#FBFAF6"/><path d="M689,330 L707,339 L725,330" stroke="#C9C1B2" stroke-width="1.2" fill="none"/><rect x="689" y="342" width="36" height="2" fill="#000" opacity=".1"/></g>
 ${syrupCan(732,342)}${syrupCan(758,344)}
 <!-- price sign -->
 <rect x="350" y="352" width="78" height="40" rx="3" fill="#2B2D42"/><rect x="354" y="356" width="70" height="32" rx="2" fill="none" stroke="#F4EFE6" stroke-width="1" opacity=".5"/>
 ${person(Object.assign(playerLook(pl),{x:180,y:512,sc:1.1}))}`;
}

/* ---------- 3. Le Plateau ---------- */
function plexStairs(x,y,flip){ /* curved iron staircase from the sidewalk (y) up to a second-floor balcony (y-150) */
 const s=flip?-1:1, X=v=>x+s*v;
 let steps=''; for(let i=0;i<12;i++){ const t=i/11, px=X(10+Math.sin(t*Math.PI/2)*70), py=y-12-t*136; steps+=`<rect x="${Math.min(px,px+s*26)}" y="${py}" width="26" height="4" fill="#2C2F36"/>`; }
 return `${shadow(X(48),y+2,46,4,.3,'blurS')}
 <path d="M${X(4)},${y} C${X(10)},${y-60} ${X(60)},${y-90} ${X(78)},${y-150}" stroke="url(#mtIron)" stroke-width="5" fill="none"/>
 <path d="M${X(30)},${y} C${X(36)},${y-60} ${X(86)},${y-90} ${X(104)},${y-150}" stroke="url(#mtIron)" stroke-width="5" fill="none"/>
 ${steps}
 <path d="M${X(4)},${y-34} C${X(10)},${y-94} ${X(60)},${y-124} ${X(78)},${y-184}" stroke="#1C1E24" stroke-width="2.5" fill="none"/>
 ${Array.from({length:9},(_,i)=>{const t=i/8, bx=X(4+Math.sin(t*Math.PI/2)*74), by=y-t*150; return `<path d="M${bx},${by} v-34" stroke="#1C1E24" stroke-width="1.4"/>`;}).join('')}`;
}
function plex(x,w,wall,door1,door2){
 const y=150, h=290, base=440;
 const win=(wx,wy)=>`<rect x="${wx-3}" y="${wy-3}" width="46" height="66" fill="#E9DFD0"/><rect x="${wx}" y="${wy}" width="40" height="60" fill="#5C7895"/><rect x="${wx}" y="${wy}" width="40" height="18" fill="#A9C2D8" opacity=".6"/><path d="M${wx+20},${wy} V${wy+60} M${wx},${wy+30} H${wx+40}" stroke="#E9DFD0" stroke-width="3"/><rect x="${wx-6}" y="${wy+60}" width="52" height="6" fill="#DCD3C4"/>${snowRidge(wx-6,wx+46,wy+60)}`;
 return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${wall})"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#brick)"/>
 <rect x="${x+w-12}" y="${y}" width="12" height="${h}" fill="#000" opacity=".12"/>
 <rect x="${x-6}" y="${y-18}" width="${w+12}" height="22" fill="#3E3A38"/><rect x="${x-6}" y="${y-22}" width="${w+12}" height="6" fill="#F4F6F8"/>
 ${win(x+24,y+30)}${win(x+w-64,y+30)}
 <!-- balcony -->
 <rect x="${x+10}" y="${y+138}" width="${w-20}" height="8" fill="#3E3A38"/>${snowRidge(x+10,x+w-10,y+138)}
 <path d="M${x+10},${y+110} H${x+w-10}" stroke="#1C1E24" stroke-width="2.5"/>${Array.from({length:Math.floor((w-20)/12)},(_,i)=>`<path d="M${x+14+i*12},${y+110} V${y+138}" stroke="#1C1E24" stroke-width="1.3"/>`).join('')}
 <rect x="${x+w/2-22}" y="${y+64}" width="34" height="74" fill="url(#${door1})"/><rect x="${x+w/2-18}" y="${y+70}" width="26" height="22" fill="#A9C2D8" opacity=".55"/>
 <rect x="${x+w/2+20}" y="${y+64}" width="34" height="74" fill="url(#${door2})"/><rect x="${x+w/2+24}" y="${y+70}" width="26" height="22" fill="#A9C2D8" opacity=".55"/>
 <!-- ground floor -->
 ${win(x+20,y+182)}<rect x="${x+w-66}" y="${y+176}" width="40" height="${base-y-176}" fill="url(#${door1})"/><rect x="${x+w-62}" y="${y+182}" width="32" height="26" fill="#A9C2D8" opacity=".55"/>`;
}
function snowRidge(x1,x2,y){ return `<path d="M${x1},${y} Q${(x1+x2)/2},${y-7} ${x2},${y} Z" fill="url(#snowTop)"/>`; }
function bagelShop(){
 const x=700,y=170;
 return `<rect x="${x}" y="${y}" width="260" height="270" fill="url(#mtBrick2)"/><rect x="${x}" y="${y}" width="260" height="270" fill="url(#brick)"/>
 <rect x="${x-6}" y="${y-16}" width="272" height="20" fill="#3E3A38"/><rect x="${x-6}" y="${y-20}" width="272" height="6" fill="#F4F6F8"/>
 <rect x="${x+50}" y="${y+6}" width="160" height="34" rx="4" fill="#2B2D42"/><rect x="${x+53}" y="${y+9}" width="154" height="28" rx="3" fill="none" stroke="#E9C77B" stroke-width="1" opacity=".55"/>
 <rect x="${x+14}" y="${y+60}" width="170" height="130" fill="#3A2418"/>
 <path d="M${x+40},${y+190} V${y+130} A60,58 0 0 1 ${x+160},${y+130} V${y+190} Z" fill="#8C5A3A"/>
 <path d="M${x+56},${y+190} V${y+138} A44,42 0 0 1 ${x+144},${y+138} V${y+190} Z" fill="url(#mtOven)"/>
 ${[[78,176],[100,170],[122,176],[96,184]].map(([a,b])=>`<ellipse cx="${x+a}" cy="${y+b}" rx="9" ry="4" fill="#5A2810" opacity=".55"/>`).join('')}
 <rect x="${x+14}" y="${y+60}" width="170" height="130" fill="url(#mtGlass)" opacity=".22"/><path d="M${x+24},${y+66} L${x+70},${y+66} L${x+36},${y+184} L${x+24},${y+184} Z" fill="#fff" opacity=".16"/>
 <rect x="${x+8}" y="${y+190}" width="182" height="8" fill="#DCD3C4"/>${snowRidge(x+8,x+190,y+190)}
 <rect x="${x+202}" y="${y+100}" width="44" height="170" fill="url(#mtDoorR)"/><rect x="${x+208}" y="${y+108}" width="32" height="60" fill="#FFE2A0" opacity=".75"/>
 <circle cx="${x+70}" cy="${y+232}" r="0"/>`;
}
function scenePlateau(pl){
 return `<rect width="960" height="540" fill="url(#sky)"/>
 <path d="M0,170 L60,120 L130,150 L190,100 L250,140 L320,110 L380,150 L380,440 L0,440 Z" fill="#B9C6D3" opacity=".6"/>
 ${plex(-20,250,'mtBrick','mtDoor','mtDoorR')}${plex(236,240,'mtBrick2','mtDoorR','mtDoor')}${plex(482,210,'mtBrick','mtDoor','mtDoor')}
 ${bagelShop()}
 <!-- sidewalk and street -->
 <path d="M0,440 H960 V470 H0 Z" fill="#C9CED6"/><path d="M0,440 H960" stroke="#8E96A1" stroke-width="2"/>
 ${snowGround(476)}
 <path d="M0,470 H960" stroke="#9AA3AD" stroke-width="3"/>
 ${plexStairs(40,446,false)}${plexStairs(290,446,false)}${plexStairs(660,446,true)}
 ${npcFig('gab',{x:820,y:505,sc:1.05})}
 ${person(Object.assign(playerLook(pl),{x:470,y:510,sc:1.1}))}
 ${snowfall(28,23)}`;
}

/* ---------- 4. La ville souterraine ---------- */
function shopFront(pts,c){ return `<polygon points="${pts}" fill="url(#mtShop)"/><polygon points="${pts}" fill="${c}" opacity=".15"/>`; }
function sceneSouterrain(pl){
 /* one-point perspective, vanishing point (480,250) */
 return `<rect width="960" height="540" fill="url(#mtTunnel)"/>
 <polygon points="0,0 960,0 600,190 360,190" fill="#5A5F6B"/><polygon points="0,0 960,0 960,12 0,12" fill="#3E424C"/>
 ${[0,1,2,3].map(i=>{const t=[.12,.38,.6,.78][i], y=t*190, w=(1-t)*300+40; return `<rect x="${480-w/2}" y="${y+4}" width="${w}" height="${(1-t)*8+3}" rx="2" fill="#FFF8E6"/><ellipse cx="480" cy="${y+12}" rx="${w*.7}" ry="${(1-t)*18+6}" fill="#FFF6DE" opacity=".12"/>`;}).join('')}
 <!-- left wall shops -->
 <polygon points="0,0 360,190 360,330 0,470" fill="#C8BFAF"/>
 ${shopFront('20,120 170,180 170,360 20,420','#E9A93A')}${shopFront('200,192 300,230 300,340 200,370','#2C5E67')}
 <path d="M170,180 V360 M300,230 V340" stroke="#8E8170" stroke-width="6"/>
 <!-- right wall shops and escalator -->
 <polygon points="960,0 600,190 600,330 960,470" fill="#BDB4A4"/>
 ${shopFront('660,230 760,192 760,370 660,340','#9B2F2F')}
 <path d="M660,230 V340" stroke="#8E8170" stroke-width="6"/>
 <!-- escalator going up on the right -->
 <polygon points="790,470 960,470 960,150 900,150" fill="#7F8893"/>
 <polygon points="806,462 944,462 944,170 902,170" fill="#3A3D45"/>
 ${Array.from({length:16},(_,i)=>{const t=i/15, x1=806+t*96, x2=944, y=462-t*292; return `<path d="M${x1},${y} H${x2}" stroke="#6E7580" stroke-width="2"/>`;}).join('')}
 <path d="M790,470 L900,150" stroke="#1C1E24" stroke-width="8" stroke-linecap="round"/><path d="M788,466 L898,146" stroke="#5E6772" stroke-width="2"/>
 <!-- end of corridor -->
 <rect x="360" y="190" width="240" height="140" fill="#E8E1D4"/><rect x="420" y="220" width="120" height="110" fill="#FFF3D6"/><rect x="420" y="220" width="120" height="110" fill="url(#glow)"/>
 <!-- floor -->
 <polygon points="0,470 360,330 600,330 960,470 960,540 0,540" fill="#CFC6B6"/>
 <g stroke="#A99E8C" stroke-width="1.2" opacity=".6">${[-600,-300,0,240,480,720,960,1260,1560].map(x=>`<path d="M${480+(x-480)*.25},330 L${x},540"/>`).join('')}<path d="M262,368 H698"/><path d="M150,412 H810"/><path d="M0,470 H960"/></g>
 <!-- hanging signs (text is HTML) -->
 ${[[40,100,230],[690,100,230]].map(([x,y,w])=>`<path d="M${x+30},12 V${y} M${x+w-30},12 V${y}" stroke="#3A3D45" stroke-width="2"/>${shadow(x+w/2,y+40,w/2,4,.18,'blurS')}<rect x="${x}" y="${y}" width="${w}" height="34" rx="4" fill="url(#mtNavy)"/><rect x="${x}" y="${y}" width="${w}" height="3" rx="1.5" fill="#5E72A3"/>`).join('')}
 <!-- information kiosk -->
 ${shadow(240,452,110,7,.3)}
 ${npcFig('melanie',{x:240,y:440,sc:.95,noShadow:true})}
 <polygon points="140,340 340,340 350,352 130,352" fill="url(#counterTop)"/>
 <rect x="130" y="352" width="220" height="98" rx="3" fill="url(#mtSteel)"/><rect x="334" y="352" width="16" height="98" fill="#000" opacity=".14"/>
 <rect x="150" y="360" width="180" height="26" rx="3" fill="url(#mtNavy)"/>
 <circle cx="240" cy="418" r="16" fill="#2F6FB5"/><text x="240" y="425" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="20" fill="#fff">i</text>
 ${person(Object.assign(playerLook(pl),{x:600,y:510,sc:1.12}))}`;
}

/* ---------- 5. Le spectacle, Place des Arts, la nuit ---------- */
function lightHoop(x,y,r,c){
 return `<circle cx="${x}" cy="${y}" r="${r*1.5}" fill="${c}" opacity=".1"/>
 <path d="M${x-r},${y+r*.9} A${r},${r} 0 1 1 ${x+r},${y+r*.9}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>
 <path d="M${x-r},${y+r*.9} A${r},${r} 0 1 1 ${x+r},${y+r*.9}" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>
 ${shadow(x,y+r*.95,r*.9,5,.35,'blurS')}`;
}
function mtCrowd(){
 let g=''; [40,96,150,820,876,930].forEach((x,i)=>{ const h=64+(i%3)*10;
  g+=`<g transform="translate(${x} 540)"><path d="M-20,0 C-20,-${h-30} -16,-${h-22} 0,-${h-22} C16,-${h-22} 20,-${h-30} 20,0 Z" fill="#141A2E"/><circle cx="0" cy="-${h-8}" r="12" fill="#141A2E"/>${i%2?`<path d="M-12,-${h-4} Q0,-${h+16} 12,-${h-4}Z" fill="#1E2640"/>`:''}</g>`; });
 return g;
}
function sceneSpectacle(pl){
 let s=5; const r=()=>(s=(s*9301+49297)%233280)/233280; let stars='';
 for(let i=0;i<40;i++) stars+=`<circle cx="${(r()*960).toFixed(0)}" cy="${(r()*120).toFixed(0)}" r="${(.5+r()*1).toFixed(1)}" fill="#fff" opacity="${(.3+r()*.5).toFixed(2)}"/>`;
 return `<rect width="960" height="540" fill="url(#skyNight)"/>${stars}
 <!-- city towers -->
 <g fill="#1A2342">${[[0,120,90],[80,150,70],[860,110,100],[780,160,80]].map(([x,y,w])=>`<rect x="${x}" y="${y}" width="${w}" height="${440-y}"/>`).join('')}</g>
 <g fill="#F2C46D" opacity=".5">${Array.from({length:30},(_,i)=>{const x=[10,30,50,90,110,130,870,890,910,930,800,820][i%12], y=140+Math.floor(i/12)*40+(i%5)*12;return `<rect x="${x}" y="${y}" width="6" height="8"/>`;}).join('')}</g>
 <!-- Place des Arts facade -->
 <rect x="230" y="110" width="500" height="330" fill="url(#mtFacade)"/>
 <rect x="230" y="100" width="500" height="18" fill="#3A4366"/>
 ${Array.from({length:11},(_,i)=>`<rect x="${252+i*44}" y="150" width="22" height="290" fill="#2F3A60"/><rect x="${252+i*44}" y="150" width="6" height="290" fill="#5A6894" opacity=".5"/>`).join('')}
 <rect x="250" y="150" width="460" height="290" fill="url(#mtShop)" opacity=".18"/>
 <rect x="250" y="300" width="460" height="140" fill="#FFE6B5" opacity=".28"/>
 <rect x="340" y="56" width="280" height="36" rx="4" fill="#15284D"/><rect x="343" y="59" width="274" height="30" rx="3" fill="none" stroke="#E9C77B" stroke-width="1" opacity=".6"/>
 <!-- coloured projections on the facade -->
 <ellipse cx="330" cy="230" rx="90" ry="60" fill="#E05A8A" opacity=".22"/><ellipse cx="620" cy="210" rx="100" ry="70" fill="#4FB3E0" opacity=".22"/><ellipse cx="480" cy="270" rx="80" ry="50" fill="#F2C46D" opacity=".2"/>
 ${snowGround(440,true)}
 <path d="M0,440 H960" stroke="#3A4A70" stroke-width="2" opacity=".6"/>
 ${lightHoop(150,370,60,'#E05A8A')}${lightHoop(810,372,58,'#4FB3E0')}${lightHoop(480,392,40,'#F2C46D')}
 ${npcFig('amira',{x:640,y:505,sc:1.05})}
 ${person(Object.assign(playerLook(pl),{x:330,y:510,sc:1.1}))}
 ${mtCrowd()}
 ${snowfall(30,29,true)}`;
}

/* ---------- Map: stylised métro plan ---------- */
function sceneMap(){
 return `<rect width="960" height="540" fill="#F1ECE2"/>
 <g stroke="#E2DACB" stroke-width="1">${Array.from({length:25},(_,i)=>`<path d="M${i*40},0 V540"/>`).join('')}${Array.from({length:14},(_,i)=>`<path d="M0,${i*40} H960"/>`).join('')}</g>
 <!-- island -->
 <path d="M30,250 C60,150 180,60 360,40 C540,20 760,10 930,30 L950,120 C900,230 820,330 700,420 C600,480 420,500 260,470 C140,450 40,380 30,250 Z" fill="#FBF8F1" stroke="#CFC5B3" stroke-width="3"/>
 <!-- river -->
 <path d="M0,540 L0,470 C140,500 300,520 470,500 C640,480 780,420 960,300 L960,540 Z" fill="url(#river)"/>
 <path d="M0,470 C140,500 300,520 470,500 C640,480 780,420 960,300" stroke="#2C5070" stroke-width="2" fill="none" opacity=".5"/>
 <!-- Mont Royal -->
 <path d="M240,200 C260,150 340,140 380,170 C420,200 410,270 360,290 C300,310 230,270 240,200 Z" fill="#CFE0C8"/>
 <path d="M250,210 C270,170 330,160 365,182" stroke="#A9C49E" stroke-width="6" fill="none" stroke-linecap="round"/>
 <g fill="#8FAF84">${[[280,200],[310,180],[340,210],[300,250],[350,260],[270,240]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g>
 <!-- lines -->
 <path d="M300,140 Q480,120 640,140 L760,120" stroke="#2F6FB5" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M120,80 V250 Q120,300 170,320 L230,330 Q250,382 300,382 H560 Q590,382 590,350 L600,280 L610,230 L640,140 L700,60" stroke="#E98A2C" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M60,330 H900" stroke="#2E9B4F" stroke-width="9" stroke-linecap="round"/>
 <path d="M590,330 L700,430" stroke="#E7C22B" stroke-width="9" stroke-linecap="round"/>
 ${[[120,80],[230,330],[400,330],[470,330],[530,330],[590,330],[600,280],[610,230],[640,140],[700,60],[700,430],[60,330],[900,330],[300,140],[760,120]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#fff" stroke="#2B2D42" stroke-width="3"/>`).join('')}
 <!-- route -->
 <path d="M590,330 L600,280 L610,230 L640,140" stroke="#9B2F2F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none" transform="translate(16 0)"/>
 <path d="M626,230 L616,280 L606,330 L470,346" stroke="#2C5E67" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none" opacity=".75"/>`;
}
const MAP_PINS={metro:[590,330], marche:[640,140], plateau:[610,230], souterrain:[470,330], spectacle:[440,262]};
const SCENES={metro:sceneMetro, marche:sceneMarche, plateau:scenePlateau, souterrain:sceneSouterrain, spectacle:sceneSpectacle};
