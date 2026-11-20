/* ===== Acadie scenes (Caraquet, August; 960 x 540). Light from the top left, three tones, contact shadows. ===== */
const NPC={
 emilie:{name:'Émilie', role:'Ton amie de Moncton', look:{skin:1,hair:'#3A2418',style:'long',coat:'blue',noHat:true,scarf:''}},
 rejean:{name:'Oncle Réjean', role:'Pêcheur, quai de Caraquet', pitch:.85, look:{skin:2,hair:'#6B6460',style:'short',coat:'yellow',hat:'slate',band:'#363E52',pompom:false}},
 nicole:{name:'Nicole', role:'Magasin général', look:{skin:4,hair:'#1E1612',style:'mid',coat:'olive',noHat:true,glasses:true,collar:'#F2EFE8'}},
 pepere:{name:'Pépère Léonard', role:'Violoneux', pitch:.8, look:{skin:1,hair:'#D9D4CC',style:'short',grey:true,coat:'rust',noHat:true,glasses:true,collar:'#F2EFE8'}},
 memere:{name:'Mémère Rose', role:'Grand-mère d\'Émilie', look:{skin:1,hair:'#CFCBC4',style:'mid',grey:true,coat:'plum',noHat:true,apron:'#EFE6D6'}}
};
function npcFig(id,o){ return person(Object.assign({},NPC[id].look,o)); }
function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }
const ME=(pl,o)=>person(Object.assign(playerLook(pl,GAME.playerExtra),o));

const AC_DEFS=(()=>{
 const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 return `<defs>${lg('acSky',['#7FB0DA','#B9D6EC','#E8F1F6'],0,1)}${lg('acEve',['#7FA6D0','#C9B8C8','#F6C88A'],0,1)}${lg('acSea',['#8CC0DC','#4C8AB6','#2D5F86'],0,1)}
 ${lg('acPlank',['#C99F6E','#A57A4C'],0,1)}${lg('acPlankEdge',['#7A5233','#5A3A20'],0,1)}
 ${lg('acHullR',['#D9534A','#B8332B','#7E1E19'],0,1)}${lg('acHullB',['#4E84C4','#2F5E98','#1C3D66'],0,1)}${lg('acHullG',['#4F9A6E','#2E7350','#1C4A33'],0,1)}
 ${lg('acCabin',['#FFFFFF','#E6EAEE','#B9C1C9'])}${lg('acFlagShade',['#FFFFFF','#FFFFFF','#000000'])}
 ${lg('acKitchen',['#F6E7BE','#E6CF96'],0,1)}${lg('acWainscot',['#A97B50','#7A5233'],0,1)}${lg('acStove',['#4A4E58','#22252C','#121418'])}
 ${lg('acNightWall',['#B9875A','#8A5E3A'],0,1)}${lg('acStreet',['#9CA0A6','#7A7E85'],0,1)}${lg('acFiddle',['#C77B32','#8A4A16','#5A2E0C'])}
 ${lg('acTrap',['#E2C04A','#B8952A'],0,1)}${lg('acShelf',['#B07F55','#7A5233'],0,1)}${lg('acLand',['#EFE8D8','#E2D8C2'],0,1)}
 <radialGradient id="acLamp"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".8"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs>`;
})();
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true">${AC_DEFS}</svg>`);

/* ---------- shared pieces ---------- */
function star(cx,cy,r){ let d=''; for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*.42:r; d+=(i?'L':'M')+(cx+Math.cos(a)*rr).toFixed(1)+','+(cy+Math.sin(a)*rr).toFixed(1); } return `<path d="${d}Z" fill="#F2C230"/>`; }
function acFlag(x,y,w,pole){ /* Acadian tricolour with the gold star; (x,y) = top-left of the cloth */
 const h=w*.62, t=w/3, wave=`Q${x+w*.5},${y-w*.06} ${x+w},${y}`;
 return `${pole?`<rect x="${x-3}" y="${y-6}" width="3.5" height="${pole}" rx="1.5" fill="url(#metal)"/>`:''}
 <path d="M${x},${y} Q${x+t*.5},${y-w*.03} ${x+t},${y-w*.02} V${y+h-w*.02} Q${x+t*.5},${y+h-w*.03} ${x},${y+h} Z" fill="#1F4E9A"/>
 <path d="M${x+t},${y-w*.02} Q${x+t*1.5},${y-w*.01} ${x+2*t},${y+w*.01} V${y+h+w*.01} Q${x+t*1.5},${y+h-w*.01} ${x+t},${y+h-w*.02} Z" fill="#F4F4F0"/>
 <path d="M${x+2*t},${y+w*.01} Q${x+t*2.5},${y+w*.03} ${x+w},${y+w*.02} V${y+h+w*.02} Q${x+t*2.5},${y+h+w*.03} ${x+2*t},${y+h+w*.01} Z" fill="#C8282E"/>
 ${star(x+t*.5,y+h*.3,w*.075)}
 <path d="M${x},${y} H${x+w} V${y+h} H${x} Z" fill="#000" opacity="0"/>
 <path d="M${x+2*t},${y+w*.01} Q${x+t*2.5},${y+w*.03} ${x+w},${y+w*.02} V${y+h+w*.02} Q${x+t*2.5},${y+h+w*.03} ${x+2*t},${y+h+w*.01} Z" fill="#000" opacity=".12"/>`;
}
function bunting(x1,x2,y,sag){
 const n=Math.floor((x2-x1)/26), cols=['#1F4E9A','#F4F4F0','#C8282E','#F2C230'];
 let g=`<path d="M${x1},${y} Q${(x1+x2)/2},${y+sag} ${x2},${y}" stroke="#3A3D45" stroke-width="1.2" fill="none"/>`;
 for(let i=0;i<n;i++){ const t=(i+.5)/n, px=x1+(x2-x1)*t, py=y+sag*4*t*(1-t)*.98; g+=`<path d="M${px-9},${py} L${px+9},${py} L${px},${py+16} Z" fill="${cols[i%4]}"/><path d="M${px},${py} L${px+9},${py} L${px},${py+16} Z" fill="#000" opacity=".12"/>`; }
 return g;
}
function fiddle(px,py,s){ const x=px+16*s, y=py-160*s;
 return `<g transform="rotate(-38 ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${8*s}" ry="${13*s}" fill="url(#acFiddle)"/><ellipse cx="${x}" cy="${y-3*s}" rx="${5*s}" ry="${4*s}" fill="#5A2E0C" opacity=".35"/><rect x="${x-1.2*s}" y="${y-30*s}" width="${2.4*s}" height="${20*s}" fill="#2A1A10"/><circle cx="${x}" cy="${y-31*s}" r="${2.2*s}" fill="#2A1A10"/></g>
 <path d="M${px-14*s},${py-128*s} L${px+46*s},${py-176*s}" stroke="#E8DCC4" stroke-width="${1.4*s}" stroke-linecap="round"/>`;
}
function accordion(px,py,s){ const x=px-24*s, y=py-150*s, w=48*s, h=34*s;
 return `<rect x="${x}" y="${y}" width="${10*s}" height="${h}" rx="${2*s}" fill="#B8332B"/><rect x="${x+w-10*s}" y="${y}" width="${10*s}" height="${h}" rx="${2*s}" fill="#7E1E19"/>
 <rect x="${x+10*s}" y="${y+2*s}" width="${w-20*s}" height="${h-4*s}" fill="#2A2D36"/>${Array.from({length:6},(_,i)=>`<path d="M${x+(12+i*4.4)*s},${y+2*s} V${y+h-2*s}" stroke="#7A7F8A" stroke-width="${1*s}"/>`).join('')}
 ${Array.from({length:4},(_,i)=>`<circle cx="${x+5*s}" cy="${y+(7+i*7)*s}" r="${1.6*s}" fill="#F4EFE6"/>`).join('')}`;
}
function guitar(px,py,s){ const x=px+2*s, y=py-118*s;
 return `<g transform="rotate(-32 ${x} ${y})"><rect x="${x-1.8*s}" y="${y-58*s}" width="${3.6*s}" height="${46*s}" fill="#3A2418"/><rect x="${x-3*s}" y="${y-64*s}" width="${6*s}" height="${8*s}" rx="${1*s}" fill="#2A1A10"/>
 <ellipse cx="${x}" cy="${y-6*s}" rx="${11*s}" ry="${11*s}" fill="url(#acFiddle)"/><ellipse cx="${x}" cy="${y+12*s}" rx="${15*s}" ry="${14*s}" fill="url(#acFiddle)"/><circle cx="${x}" cy="${y+1*s}" r="${4.4*s}" fill="#2A1A10"/></g>`;
}
function spoons(px,py,s){ const x=px+20*s, y=py-104*s;
 return `<g transform="rotate(20 ${x} ${y})">${[0,3].map(d=>`<rect x="${x-1*s+d*s}" y="${y-16*s}" width="${2*s}" height="${18*s}" rx="${1*s}" fill="url(#metal)"/><ellipse cx="${x+d*s}" cy="${y+5*s}" rx="${3.4*s}" ry="${5*s}" fill="#C9CFD6"/><ellipse cx="${x-1*s+d*s}" cy="${y+4*s}" rx="${1.2*s}" ry="${2.4*s}" fill="#fff" opacity=".7"/>`).join('')}</g>`;
}
function potInHand(px,py,s){ const x=px+24*s, y=py-100*s;
 return `<rect x="${x-14*s}" y="${y}" width="${28*s}" height="${18*s}" rx="${3*s}" fill="url(#metal)"/><ellipse cx="${x}" cy="${y}" rx="${14*s}" ry="${3.5*s}" fill="#C9CFD6"/><rect x="${x+12*s}" y="${y+2*s}" width="${14*s}" height="${3*s}" rx="${1.5*s}" fill="#2A2D36"/>
 <rect x="${x-20*s}" y="${y-24*s}" width="${3*s}" height="${24*s}" rx="${1.5*s}" fill="#B07F55" transform="rotate(-25 ${x-18*s} ${y})"/>`;
}

/* ---------- 1. Le quai ---------- */
function boat(x,y,s,hull,bigFlag){
 const W=240*s;
 return `<ellipse cx="${x+W/2}" cy="${y+10*s}" rx="${W*.52}" ry="${8*s}" fill="#1E4A6E" opacity=".35"/>
 <path d="M${x},${y-46*s} L${x+W},${y-56*s} L${x+W-18*s},${y} L${x+22*s},${y} Z" fill="url(#${hull})"/>
 <path d="M${x+2*s},${y-40*s} L${x+W-2*s},${y-50*s}" stroke="#F4F4F0" stroke-width="${4*s}"/>
 <rect x="${x+118*s}" y="${y-100*s}" width="${76*s}" height="${52*s}" rx="${3*s}" fill="url(#acCabin)"/><rect x="${x+186*s}" y="${y-100*s}" width="${8*s}" height="${52*s}" fill="#000" opacity=".1"/>
 <rect x="${x+128*s}" y="${y-90*s}" width="${22*s}" height="${16*s}" rx="${2*s}" fill="#4A6E8E"/><rect x="${x+158*s}" y="${y-90*s}" width="${22*s}" height="${16*s}" rx="${2*s}" fill="#4A6E8E"/>
 <rect x="${x+128*s}" y="${y-90*s}" width="${22*s}" height="${5*s}" fill="#A9C2D8" opacity=".6"/>
 <rect x="${x+114*s}" y="${y-104*s}" width="${84*s}" height="${6*s}" rx="${2*s}" fill="#2B2D42"/>
 <rect x="${x+150*s}" y="${y-210*s}" width="${4*s}" height="${110*s}" fill="url(#metal)"/>
 ${acFlag(x+154*s,y-210*s,(bigFlag?64:34)*s,0)}
 <path d="M${x+152*s},${y-200*s} L${x+20*s},${y-46*s} M${x+152*s},${y-200*s} L${x+W-10*s},${y-56*s}" stroke="#5E6772" stroke-width="${1*s}"/>
 ${acFlag(x+18*s,y-82*s,20*s,40*s)}`;
}
function trap(x,y){
 return `${shadow(x+34,y+2,36,4,.3,'blurS')}<path d="M${x},${y} V${y-30} Q${x},${y-44} ${x+14},${y-44} H${x+54} Q${x+68},${y-44} ${x+68},${y-30} V${y} Z" fill="url(#acTrap)" opacity=".35"/>
 <path d="M${x},${y} V${y-30} Q${x},${y-44} ${x+14},${y-44} H${x+54} Q${x+68},${y-44} ${x+68},${y-30} V${y} Z M${x+17},${y-44} V${y} M${x+34},${y-44} V${y} M${x+51},${y-44} V${y} M${x},${y-15} H${x+68} M${x},${y-30} H${x+68}" stroke="#9C7A1E" stroke-width="2" fill="none"/>`;
}
function sceneQuai(pl){
 return `<rect width="960" height="540" fill="url(#acSky)"/>
 <path d="M0,232 C120,214 260,222 380,210 C520,198 700,216 960,206 V252 H0 Z" fill="#9FB6CA"/>
 <path d="M0,244 C160,236 320,240 480,234 C660,228 800,238 960,232 V252 H0 Z" fill="#8AA3BA"/>
 <rect y="250" width="960" height="170" fill="url(#acSea)"/>
 <g stroke="#E8F2F8" stroke-width="1.4" opacity=".45" fill="none">${[[60,280],[300,300],[620,276],[820,310],[180,340],[520,350]].map(([x,y])=>`<path d="M${x},${y} q20,-4 40,0 t40,0"/>`).join('')}</g>
 ${boat(20,380,.85,'acHullB',false)}${boat(330,392,1.05,'acHullR',true)}${boat(690,378,.8,'acHullG',false)}
 <!-- wharf -->
 <rect y="410" width="960" height="130" fill="url(#acPlank)"/><rect y="410" width="960" height="10" fill="#E0BE8E"/>
 <g stroke="#7A5233" stroke-width="1.2" opacity=".5">${[440,472,506].map(y=>`<path d="M0,${y} H960"/>`).join('')}${Array.from({length:12},(_,i)=>`<path d="M${i*90+(i%2)*40},420 v20 M${i*90+30},${472} v34"/>`).join('')}</g>
 <rect y="420" width="960" height="8" fill="#000" opacity=".12"/>
 ${[120,520,900].map(x=>`${shadow(x,432,14,4,.3,'blurS')}<rect x="${x-10}" y="404" width="20" height="28" rx="5" fill="#2A2F3A"/><rect x="${x-13}" y="400" width="26" height="8" rx="4" fill="#3A404C"/>`).join('')}
 ${trap(560,470)}${trap(590,428)}${trap(630,470)}
 ${npcFig('rejean',{x:800,y:500,sc:1.05})}
 ${ME(pl,{x:300,y:510,sc:1.1})}`;
}

/* ---------- 2. Le magasin général ---------- */
function jar(x,y,c){ return `${shadow(x+9,y+1,10,2.5,.25,'blurS')}<rect x="${x}" y="${y-26}" width="18" height="26" rx="3" fill="${c}"/><rect x="${x}" y="${y-30}" width="18" height="6" rx="2" fill="#E6E9ED"/><rect x="${x+3}" y="${y-22}" width="3" height="18" fill="#fff" opacity=".4"/>`; }
function sceneMagasin(pl){
 const shelfItems=(y)=>Array.from({length:11},(_,i)=>jar(352+i*26,y,['#C8282E','#E9A93A','#4E7FB8','#7A8F4A','#9B5B8A'][i%5])).join('');
 return `<rect width="960" height="540" fill="url(#woodH)"/><rect width="960" height="540" fill="url(#planks)"/>
 <g stroke="#6A4528" stroke-width="1.5" opacity=".4">${Array.from({length:20},(_,i)=>`<path d="M${i*50},0 V420"/>`).join('')}</g>
 <rect width="960" height="40" fill="#5A3A20"/>
 <!-- sign board -->
 ${shadow(480,90,160,5,.2,'blurS')}<rect x="320" y="50" width="320" height="35" rx="4" fill="#2B2D42"/><rect x="323" y="53" width="314" height="29" rx="3" fill="none" stroke="#E9C77B" stroke-width="1" opacity=".55"/>
 <!-- window -->
 <rect x="40" y="90" width="200" height="170" rx="3" fill="#F4EFE6"/><rect x="50" y="100" width="180" height="150" fill="url(#acSky)"/><rect x="50" y="200" width="180" height="50" fill="url(#acSea)"/>
 <path d="M140,100 V250 M50,175 H230" stroke="#F4EFE6" stroke-width="6"/><path d="M60,106 L110,106 L70,244 L60,244 Z" fill="#fff" opacity=".25"/>
 ${acFlag(270,110,70,0)}
 <!-- shelves -->
 <rect x="340" y="110" width="300" height="200" fill="#6A4528"/>
 ${[170,240,300].map(y=>`<rect x="340" y="${y}" width="300" height="10" fill="url(#acShelf)"/>`).join('')}
 ${shelfItems(170)}${shelfItems(240)}
 ${Array.from({length:9},(_,i)=>`<rect x="${356+i*31}" y="${266}" width="22" height="34" rx="2" fill="${['#E6D3A8','#C99F6E','#D9C7A0'][i%3]}"/>`).join('')}
 <!-- hanging pots -->
 <path d="M680,120 H920" stroke="#3A3D45" stroke-width="4"/>
 ${[700,760,820,880].map((x,i)=>`<path d="M${x},120 v${12+i%2*8}" stroke="#3A3D45" stroke-width="2"/><g transform="translate(${x} ${132+i%2*8})"><rect x="-24" y="10" width="48" height="34" rx="5" fill="url(#metal)"/><ellipse cx="0" cy="10" rx="24" ry="5" fill="#C9CFD6"/><rect x="-24" y="14" width="10" height="28" fill="#fff" opacity=".25"/><circle cx="0" cy="2" r="5" fill="none" stroke="#3A3D45" stroke-width="2"/></g>`).join('')}
 <!-- postcard rack -->
 ${shadow(110,452,50,6,.3)}<rect x="106" y="290" width="8" height="160" fill="url(#metal)"/>
 ${[0,1,2].map(r=>[0,1,2].map(c=>`<rect x="${70+c*28}" y="${300+r*40}" width="24" height="34" rx="1" fill="${['#9FC3E0','#F2C46D','#C9E0B8','#F4C2B0'][(r+c)%4]}"/><rect x="${72+c*28}" y="${302+r*40}" width="20" height="16" fill="#fff" opacity=".45"/>`).join('')).join('')}
 <!-- floor -->
 <rect y="420" width="960" height="120" fill="#8A6440"/><g stroke="#5A3A20" stroke-width="1" opacity=".5"><path d="M0,450 H960 M0,488 H960"/></g>
 ${npcFig('nicole',{x:560,y:404,sc:.98,noShadow:true})}
 <!-- counter -->
 <polygon points="380,350 820,350 836,366 364,366" fill="url(#counterTop)"/>
 <rect x="364" y="366" width="472" height="96" fill="url(#acWainscot)"/><path d="M364,394 H836 M364,426 H836" stroke="#4A2E18" stroke-width="1.2" opacity=".4"/>
 <rect x="820" y="366" width="16" height="96" fill="#000" opacity=".16"/>${shadow(600,466,250,7,.3)}
 ${jar(640,354,'#1F4E9A')}${jar(664,354,'#F4F4F0')}${jar(688,354,'#C8282E')}
 ${shadow(750,356,26,3,.25,'blurS')}<rect x="726" y="350" width="50" height="4" rx="2" fill="#B07F55" transform="rotate(-6 750 352)"/><ellipse cx="780" cy="349" rx="8" ry="4" fill="#B07F55"/>
 ${ME(pl,{x:200,y:520,sc:1.1})}`;
}

/* ---------- 3. La cuisine ---------- */
function stove(x,y){
 return `${shadow(x+80,y+2,90,6,.32)}
 <rect x="${x}" y="${y-110}" width="160" height="110" rx="4" fill="url(#acStove)"/><rect x="${x}" y="${y-118}" width="160" height="10" rx="3" fill="#5E6772"/>
 <rect x="${x+16}" y="${y-90}" width="60" height="44" rx="3" fill="#121418"/><rect x="${x+20}" y="${y-86}" width="52" height="36" rx="2" fill="#E8742A" opacity=".55"/><rect x="${x+20}" y="${y-86}" width="52" height="36" rx="2" fill="url(#glow)"/>
 <rect x="${x+90}" y="${y-90}" width="54" height="70" rx="3" fill="#2E323A"/><circle cx="${x+136}" cy="${y-56}" r="3" fill="#C9CFD6"/>
 <rect x="${x+4}" y="${y-12}" width="10" height="12" fill="#121418"/><rect x="${x+146}" y="${y-12}" width="10" height="12" fill="#121418"/>
 <rect x="${x+120}" y="${y-250}" width="18" height="134" fill="url(#acStove)"/>
 <rect x="${x+20}" y="${y-150}" width="64" height="32" rx="4" fill="url(#metal)"/><ellipse cx="${x+52}" cy="${y-150}" rx="32" ry="6" fill="#C9CFD6"/><rect x="${x+22}" y="${y-146}" width="10" height="26" fill="#fff" opacity=".25"/>
 <g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".45"><path d="M${x+40},${y-160} q-8,-14 0,-26 q8,-12 0,-24"/><path d="M${x+62},${y-162} q8,-14 0,-26 q-8,-12 0,-24"/></g>`;
}
function sceneCuisine(pl){
 return `<rect width="960" height="540" fill="url(#acKitchen)"/>
 <g stroke="#D9BE84" stroke-width="2" opacity=".5">${Array.from({length:30},(_,i)=>`<path d="M${i*34},0 V300"/>`).join('')}</g>
 <rect y="300" width="960" height="140" fill="url(#acWainscot)"/><rect y="296" width="960" height="8" fill="#5A3A20"/>
 <g stroke="#5A3A20" stroke-width="1.4" opacity=".4">${Array.from({length:24},(_,i)=>`<path d="M${i*42},304 V440"/>`).join('')}</g>
 <!-- window with sea view and gingham curtains -->
 <rect x="560" y="70" width="240" height="190" rx="3" fill="#F4EFE6"/><rect x="572" y="82" width="216" height="166" fill="url(#acSky)"/><rect x="572" y="190" width="216" height="58" fill="url(#acSea)"/>
 <path d="M680,82 V248 M572,165 H788" stroke="#F4EFE6" stroke-width="7"/><path d="M582,88 L640,88 L596,242 L582,242 Z" fill="#fff" opacity=".22"/>
 <pattern id="acGingham" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#F4EFE6"/><rect width="7" height="14" fill="#C8282E" opacity=".55"/><rect width="14" height="7" fill="#C8282E" opacity=".55"/></pattern>
 <path d="M548,60 H612 Q600,160 616,270 H548 Z" fill="url(#acGingham)"/><path d="M748,60 H812 V270 H744 Q760,160 748,60 Z" fill="url(#acGingham)"/>
 <path d="M540,58 H820" stroke="#5A3A20" stroke-width="6" stroke-linecap="round"/>
 ${acFlag(370,90,90,0)}
 <rect y="440" width="960" height="100" fill="#9A6E44"/><g stroke="#5A3A20" stroke-width="1" opacity=".45"><path d="M0,470 H960 M0,505 H960"/></g>
 ${stove(30,452)}
 ${npcFig('memere',{x:250,y:470,sc:1})}
 ${npcFig('pepere',{x:620,y:478,sc:1.02})}${fiddle(620,478,1.02)}
 <!-- table -->
 ${shadow(450,500,170,8,.32)}
 <polygon points="300,410 610,410 640,440 270,440" fill="url(#acGingham)"/>
 <path d="M270,440 H640 L636,470 Q455,478 274,470 Z" fill="url(#acGingham)"/><path d="M270,440 H640 L636,470 Q455,478 274,470 Z" fill="#000" opacity=".12"/>
 <rect x="292" y="470" width="12" height="38" fill="url(#acWainscot)"/><rect x="606" y="470" width="12" height="38" fill="url(#acWainscot)"/>
 ${shadow(380,428,26,4,.3,'blurS')}<ellipse cx="380" cy="420" rx="26" ry="7" fill="#F4EFE6"/><ellipse cx="380" cy="418" rx="20" ry="4.5" fill="#C98B44"/><circle cx="374" cy="417" r="2.5" fill="#E9D3A0"/><circle cx="386" cy="419" r="2.5" fill="#E9D3A0"/>
 ${shadow(480,428,22,3,.25,'blurS')}${[0,8].map(d=>`<rect x="${462+d}" y="418" width="26" height="3" rx="1.5" fill="url(#metal)" transform="rotate(-4 ${475+d} 420)"/><ellipse cx="${494+d}" cy="418" rx="7" ry="4" fill="#C9CFD6"/>`).join('')}
 ${ME(pl,{x:820,y:512,sc:1.1})}`;
}

/* ---------- 4. Le Tintamarre ---------- */
function acHouse(x,w,h,wall,trim,door){
 const y=430-h, peak=y-w*.32;
 return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wall}"/>
 <g stroke="#000" stroke-width="1" opacity=".12">${Array.from({length:Math.floor(h/9)},(_,i)=>`<path d="M${x},${y+5+i*9} H${x+w}"/>`).join('')}</g>
 <rect x="${x+w-10}" y="${y}" width="10" height="${h}" fill="#000" opacity=".12"/>
 <polygon points="${x-8},${y+2} ${x+w/2},${peak} ${x+w+8},${y+2}" fill="#4A4E58"/><polygon points="${x+w/2},${peak} ${x+w+8},${y+2} ${x+w*.62},${y+2}" fill="#000" opacity=".2"/>
 ${[[.18,.2],[.62,.2]].map(([a,b])=>`<rect x="${x+w*a-2}" y="${y+h*b-2}" width="${w*.22+4}" height="${h*.26+4}" fill="${trim}"/><rect x="${x+w*a}" y="${y+h*b}" width="${w*.22}" height="${h*.26}" fill="#5C7895"/><rect x="${x+w*a}" y="${y+h*b}" width="${w*.22}" height="${h*.08}" fill="#A9C2D8" opacity=".6"/>`).join('')}
 <rect x="${x+w*.4}" y="${y+h*.58}" width="${w*.2}" height="${h*.42}" fill="${door}"/><rect x="${x+w*.4-3}" y="${y+h*.58-3}" width="${w*.2+6}" height="4" fill="${trim}"/>`;
}
function sceneTintamarre(pl){
 const marchers=[[90,'olive','#6B4428',2,'short'],[170,'navy','#1E1612',4,'long'],[860,'rust','#C7A160',0,'mid'],[930,'teal','#1E1612',5,'short']];
 return `<rect width="960" height="540" fill="url(#acEve)"/>
 <path d="M440,190 V90 L452,60 L464,90 V190 Z" fill="#E8E2D6"/><path d="M452,60 L464,90 V190 H452 Z" fill="#000" opacity=".12"/><path d="M452,40 V60" stroke="#8E8170" stroke-width="2"/>
 ${acHouse(-20,190,200,'#E9C46A','#F4F4F0','#2F5E98')}${acHouse(180,170,180,'#5E8FC2','#F4F4F0','#B8332B')}${acHouse(360,200,210,'#F4F1E8','#2F5E98','#B8332B')}${acHouse(570,180,190,'#C9504A','#F4F4F0','#2F5E98')}${acHouse(760,220,200,'#7FB08C','#F4F4F0','#E9A93A')}
 ${bunting(0,480,150,40)}${bunting(480,960,150,40)}
 <rect y="430" width="960" height="110" fill="url(#acStreet)"/><path d="M0,430 H960" stroke="#5E6772" stroke-width="3"/>
 <g stroke="#F4F4F0" stroke-width="4" opacity=".6"><path d="M80,490 h60 M260,490 h60 M440,490 h60 M620,490 h60 M800,490 h60"/></g>
 ${marchers.map(([x,c,h,sk,st],i)=>person({x,y:480+(i%2)*14,sc:.88,coat:c,hair:h,skin:sk,style:st,noHat:true})+acFlag(x+18,480+(i%2)*14-250*.88,40,110)).join('')}
 ${npcFig('emilie',{x:640,y:505,sc:1.05})}${acFlag(640+20,505-262,56,150)}
 ${ME(pl,{x:380,y:512,sc:1.1})}${potInHand(380,512,1.1)}`;
}

/* ---------- 5. La veillée (night) ---------- */
function sceneVeillee(pl){
 let s=9; const r=()=>(s=(s*9301+49297)%233280)/233280; let stars='';
 for(let i=0;i<24;i++) stars+=`<circle cx="${(640+r()*200).toFixed(0)}" cy="${(80+r()*120).toFixed(0)}" r="${(.6+r()*1).toFixed(1)}" fill="#fff" opacity="${(.4+r()*.5).toFixed(2)}"/>`;
 return `<rect width="960" height="540" fill="url(#acNightWall)"/>
 <g stroke="#6A4528" stroke-width="2" opacity=".35">${Array.from({length:30},(_,i)=>`<path d="M${i*34},0 V440"/>`).join('')}</g>
 <rect x="630" y="70" width="220" height="150" rx="3" fill="#E8DCC4"/><rect x="640" y="80" width="200" height="130" fill="url(#skyNight)"/>${stars}<path d="M740,80 V210 M640,145 H840" stroke="#E8DCC4" stroke-width="6"/>
 ${bunting(20,600,60,50)}
 <circle cx="420" cy="60" r="220" fill="url(#acLamp)"/>
 <path d="M420,0 V40" stroke="#2A2D36" stroke-width="2"/><path d="M396,40 H444 L432,62 H408 Z" fill="#C8282E"/><circle cx="420" cy="66" r="6" fill="#FFF1C8"/>
 <rect y="440" width="960" height="100" fill="#6A4528"/><g stroke="#3E2814" stroke-width="1" opacity=".5"><path d="M0,470 H960 M0,505 H960"/></g>
 ${npcFig('rejean',{x:170,y:470,sc:1,noHat:true})}${accordion(170,470,1)}
 ${npcFig('pepere',{x:360,y:476,sc:1.02})}${fiddle(360,476,1.02)}
 ${npcFig('emilie',{x:540,y:472,sc:1})}${guitar(540,472,1)}
 ${ME(pl,{x:740,y:486,sc:1.06})}${spoons(740,486,1.06)}
 <rect width="960" height="540" fill="#1A1020" opacity=".18"/>
 ${[60,140,230,330,440,560,650,790,880].map((x,i)=>{const h=70+(i%3)*12;return `<g transform="translate(${x} 540)"><path d="M-24,0 C-24,-${h-34} -18,-${h-24} 0,-${h-24} C18,-${h-24} 24,-${h-34} 24,0 Z" fill="#20141C"/><circle cx="0" cy="-${h-8}" r="14" fill="#20141C"/></g>`;}).join('')}`;
}

/* ---------- Map: plan of Caraquet ---------- */
function sceneMap(){
 return `<rect width="960" height="540" fill="url(#acLand)"/>
 <g stroke="#E2D8C2" stroke-width="1">${Array.from({length:25},(_,i)=>`<path d="M${i*40},0 V540"/>`).join('')}${Array.from({length:14},(_,i)=>`<path d="M0,${i*40} H960"/>`).join('')}</g>
 <path d="M0,0 H960 V150 C820,170 700,160 600,190 C480,220 360,200 240,220 C140,236 60,230 0,240 Z" fill="url(#acSea)"/>
 <path d="M0,240 C60,230 140,236 240,220 C360,200 480,220 600,190 C700,160 820,170 960,150" stroke="#2D5F86" stroke-width="2" fill="none" opacity=".5"/>
 <rect x="720" y="70" width="40" height="110" fill="url(#acPlank)"/><rect x="700" y="70" width="80" height="22" fill="url(#acPlank)"/>
 ${[[690,110],[790,120]].map(([x,y])=>`<path d="M${x},${y} l30,-4 l-4,12 h-22 z" fill="#B8332B"/>`).join('')}
 <path d="M0,310 C200,300 400,290 600,270 C740,256 860,250 960,246" stroke="#C9C0AE" stroke-width="18" fill="none" stroke-linecap="round"/>
 <path d="M0,310 C200,300 400,290 600,270 C740,256 860,250 960,246" stroke="#F4F1E8" stroke-width="2" stroke-dasharray="10 10" fill="none"/>
 <path d="M740,180 V256" stroke="#C9C0AE" stroke-width="12"/><path d="M250,302 V420" stroke="#C9C0AE" stroke-width="10"/>
 <g fill="#D8CDB8">${[[60,330],[110,340],[170,330],[300,320],[360,330],[420,316],[540,300],[600,290],[660,286],[820,270],[880,268],[90,380],[160,400],[340,380],[460,350],[520,360],[700,320],[780,310]].map(([x,y])=>`<rect x="${x}" y="${y}" width="22" height="16" rx="2"/>`).join('')}</g>
 <rect x="232" y="380" width="40" height="30" rx="2" fill="#C8504A"/><polygon points="226,382 252,362 278,382" fill="#4A4E58"/>
 <path d="M452,250 V218 L458,206 L464,218 V250 Z" fill="#B9AE9C"/>
 <path d="M740,140 C740,200 640,270 600,280 C520,295 470,300 470,300 C400,306 300,340 260,380" stroke="#9B2F2F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"/>
 ${acFlag(820,330,60,0)}`;
}
const MAP_PINS={quai:[740,130], magasin:[600,270], cuisine:[230,372], tintamarre:[460,300], veillee:[320,430]};
const SCENES={quai:sceneQuai, magasin:sceneMagasin, cuisine:sceneCuisine, tintamarre:sceneTintamarre, veillee:sceneVeillee};
