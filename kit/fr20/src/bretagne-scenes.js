/* ===== Bretagne scenes (Quimper, October; 960 x 540) + animated fest-noz finale. ===== */
const NPC={
 maelle:{name:'Maëlle', role:'Ta correspondante', look:{skin:0,hair:'#A2502B',style:'long',coat:'navy',noHat:true,scarf:'#C9952F'}},
 erwan:{name:'Erwan', role:'Le frère de Maëlle', pitch:1.15, look:{skin:0,hair:'#A2502B',style:'short',coat:'olive',noHat:true}},
 gaelle:{name:'Gaëlle Le Goff', role:'La mère de Maëlle', look:{skin:0,hair:'#6B4428',style:'mid',coat:'rust',noHat:true,apron:'#EFE6D6'}},
 kervella:{name:'M. Kervella', role:'Professeur d\'anglais', pitch:.85, look:{skin:3,hair:'#2A2A2A',style:'short',coat:'grey',noHat:true,glasses:true,collar:'#F2EFE8'}}
};
function npcFig(id,o){ return person(Object.assign({},NPC[id].look,o)); }
function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }
const ME=(pl,o)=>person(Object.assign(playerLook(pl,GAME.playerExtra),o));

const BZ_DEFS=(()=>{
 const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 return `<defs>${lg('bzSky',['#8FA9C2','#C3D1DD','#E6ECF0'],0,1)}${lg('bzGranite',['#B9B6B0','#8E8B85'],0,1)}${lg('bzSlate',['#5A6270','#3A404C'],0,1)}
 ${lg('bzKitchen',['#EEF0EA','#D9DDD2'],0,1)}${lg('bzTile',['#F4F1E8','#E2DDD0'],0,1)}${lg('bzFridge',['#FFFFFF','#E3E7EB','#BFC6CD'])}${lg('bzWood',['#B98A5E','#8A5E3A'],0,1)}
 ${lg('bzHall',['#E9DFCC','#CFC2A8'],0,1)}${lg('bzNightHall',['#3A3348','#241F30'],0,1)}${lg('bzFloor',['#A27A52','#7A5634'],0,1)}${lg('bzStage',['#6A4528','#4A2E18'],0,1)}
 ${lg('bzBilig',['#4A4E58','#1C1E24'])}${lg('bzCrepe',['#F2D08A','#D9A54E'],0,1)}${lg('bzRiver',['#7FA8C2','#4E7A98'],0,1)}${lg('bzLand',['#EEEADF','#E0D9C8'],0,1)}
 <radialGradient id="bzSpot"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".55"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient></defs>`;
})();
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true">${BZ_DEFS}</svg>`);

/* ---------- shared pieces ---------- */
function gwennHaDu(x,y,w){ /* Breton flag: nine stripes, ermine canton */
 const h=w*.6, sh=h/9; let g='';
 for(let i=0;i<9;i++) g+=`<rect x="${x}" y="${y+i*sh}" width="${w}" height="${sh+.3}" fill="${i%2?'#F4F4F0':'#1C1E24'}"/>`;
 const cw=w*.42, ch=sh*5;
 g+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#F4F4F0"/>`;
 for(let r=0;r<3;r++) for(let c=0;c<(r%2?3:4);c++){ const ex=x+cw*(.14+c*.24+(r%2?.12:0)), ey=y+ch*(.2+r*.3); g+=`<path d="M${ex},${ey-3} L${ex+2},${ey+3} L${ex-2},${ey+3} Z" fill="#1C1E24"/><circle cx="${ex}" cy="${ey-3.5}" r="1" fill="#1C1E24"/>`; }
 return g+`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hull)" opacity=".12"/>`;
}
function bowl(x,y,c,name){ return `${shadow(x,y+2,18,3,.25,'blurS')}<path d="M${x-18},${y-14} Q${x-16},${y+2} ${x},${y+2} Q${x+16},${y+2} ${x+18},${y-14} Z" fill="#F4F1E8"/><ellipse cx="${x}" cy="${y-14}" rx="18" ry="4" fill="#E2DDD0"/><path d="M${x-14},${y-8} Q${x},${y-4} ${x+14},${y-8}" stroke="${c}" stroke-width="2" fill="none"/><text x="${x}" y="${y-2}" text-anchor="middle" font-family="Georgia,serif" font-size="6" fill="${c}">${name}</text><path d="M${x+18},${y-12} q8,2 2,8" stroke="#F4F1E8" stroke-width="3" fill="none"/>`; }
function bombarde(px,py,s){ return `<path d="M${px+2*s},${py-196*s} L${px+30*s},${py-150*s}" stroke="#3A2418" stroke-width="${3*s}" stroke-linecap="round"/><path d="M${px+26*s},${py-156*s} L${px+34*s},${py-146*s}" stroke="#C9952F" stroke-width="${6*s}" stroke-linecap="round"/>`; }
function biniou(px,py,s){ return `<ellipse cx="${px-12*s}" cy="${py-150*s}" rx="${12*s}" ry="${9*s}" fill="#5A2E4A"/><path d="M${px-4*s},${py-196*s} L${px-10*s},${py-158*s}" stroke="#3A2418" stroke-width="${2.6*s}"/><path d="M${px-16*s},${py-156*s} L${px-30*s},${py-206*s}" stroke="#3A2418" stroke-width="${3*s}" stroke-linecap="round"/><circle cx="${px-30*s}" cy="${py-207*s}" r="${2.4*s}" fill="#C9952F"/>`; }

/* ---------- 1. Le lundi matin : la cuisine des Le Goff ---------- */
function sceneMaison(pl){
 return `<rect width="960" height="540" fill="url(#bzKitchen)"/>
 <rect y="300" width="960" height="140" fill="url(#bzTile)"/><g stroke="#CFC8B8" stroke-width="1">${Array.from({length:24},(_,i)=>`<path d="M${i*40},300 V440"/>`).join('')}${[340,380,420].map(y=>`<path d="M0,${y} H960"/>`).join('')}</g>
 <!-- window: grey Breton sky and slate roofs -->
 <rect x="380" y="70" width="220" height="170" rx="3" fill="#F4F4F0"/><rect x="392" y="82" width="196" height="146" fill="url(#bzSky)"/>
 <polygon points="392,190 450,150 510,190" fill="url(#bzSlate)"/><rect x="400" y="190" width="100" height="38" fill="url(#bzGranite)"/><polygon points="500,200 550,164 588,200" fill="url(#bzSlate)"/><rect x="505" y="200" width="83" height="28" fill="#EDE8DC"/>
 <path d="M490,82 V228 M392,155 H588" stroke="#F4F4F0" stroke-width="6"/><path d="M400,88 L446,88 L410,222 L400,222 Z" fill="#fff" opacity=".2"/>
 ${gwennHaDu(640,90,90)}
 <!-- fridge with notes -->
 ${shadow(140,442,80,6,.3)}<rect x="70" y="120" width="150" height="322" rx="8" fill="url(#bzFridge)"/><path d="M70,250 H220" stroke="#A9B1B9" stroke-width="2"/><rect x="200" y="140" width="6" height="90" rx="3" fill="#9AA3AE"/><rect x="200" y="270" width="6" height="120" rx="3" fill="#9AA3AE"/>
 ${[[90,140,'#FFF3A6',-4],[150,150,'#BDE3F2',5],[100,190,'#FFD3C2',3],[160,200,'#D8F0C8',-6]].map(([x,y,c,r])=>`<g transform="rotate(${r} ${x+22} ${y+18})"><rect x="${x}" y="${y}" width="44" height="36" fill="${c}"/><path d="M${x+6},${y+10} h30 M${x+6},${y+18} h26 M${x+6},${y+26} h22" stroke="#5A6172" stroke-width="1.4"/><circle cx="${x+22}" cy="${y+2}" r="3" fill="#C8282E"/></g>`).join('')}
 <rect y="440" width="960" height="100" fill="url(#bzWood)"/><g stroke="#6A4528" stroke-width="1" opacity=".4"><path d="M0,470 H960 M0,505 H960"/></g>
 ${npcFig('maelle',{x:560,y:476,sc:1})}
 <!-- breakfast table with Breton bowls -->
 ${shadow(560,506,180,8,.3)}<polygon points="400,420 720,420 750,446 370,446" fill="url(#counterTop)"/><rect x="370" y="446" width="380" height="12" fill="url(#counterFront)"/>
 <rect x="390" y="458" width="12" height="44" fill="url(#bzWood)"/><rect x="720" y="458" width="12" height="44" fill="url(#bzWood)"/>
 ${bowl(450,436,'#1F4E9A','ERWAN')}${bowl(530,436,'#C8282E','MAËLLE')}${bowl(610,436,'#2E7A55','PAPA')}
 ${shadow(680,440,20,3,.25,'blurS')}<rect x="664" y="422" width="34" height="18" rx="3" fill="#F2D08A"/><rect x="664" y="422" width="34" height="5" rx="2" fill="#FFF0C8"/>
 ${ME(pl,{x:820,y:512,sc:1.1})}`;
}

/* ---------- 2. Le lycée ---------- */
function sceneLycee(pl){
 return `<rect width="960" height="540" fill="url(#bzSky)"/>
 <rect x="80" y="120" width="800" height="300" fill="url(#bzGranite)"/><rect x="80" y="120" width="800" height="300" fill="url(#blocks)"/>
 <polygon points="60,124 480,40 900,124" fill="url(#bzSlate)"/><polygon points="480,40 900,124 600,124" fill="#000" opacity=".15"/>
 ${[140,240,340,560,660,760].map(x=>`<rect x="${x}" y="160" width="60" height="80" fill="#4A6E8E"/><rect x="${x}" y="160" width="60" height="22" fill="#A9C2D8" opacity=".6"/><path d="M${x+30},160 V240" stroke="#E8E2D6" stroke-width="4"/><rect x="${x-4}" y="240" width="68" height="6" fill="#E8E2D6"/>`).join('')}
 <rect x="410" y="250" width="140" height="170" fill="#2F4F6E"/><path d="M480,250 V420" stroke="#1C2E44" stroke-width="3"/><path d="M400,250 A80,40 0 0 1 560,250" fill="url(#bzGranite)"/>
 ${shadow(480,236,110,5,.2,'blurS')}<rect x="370" y="196" width="220" height="36" rx="4" fill="#2B2D42"/><text x="480" y="220" text-anchor="middle" font-family="Georgia,serif" font-size="17" font-weight="700" fill="#E9C77B">LYCÉE</text>
 ${gwennHaDu(820,80,60)}<rect x="816" y="76" width="4" height="120" fill="url(#metal)"/>
 <rect y="420" width="960" height="120" fill="#B9B4AA"/><g stroke="#9A958C" stroke-width="1" opacity=".6">${Array.from({length:16},(_,i)=>`<path d="M${i*64},420 L${i*64-40},540"/>`).join('')}<path d="M0,470 H960"/></g>
 ${[60,110,900].map((x,i)=>`<g transform="translate(${x} ${430}) scale(.55)">${person({x:0,y:0,coat:['teal','rust','plum'][i],skin:[2,4,1][i],hair:['#1E1612','#3A2418','#C7A160'][i],style:['long','short','mid'][i],noHat:true})}</g>`).join('')}
 ${npcFig('kervella',{x:620,y:500,sc:1.05})}
 ${ME(pl,{x:300,y:512,sc:1.1})}`;
}

/* ---------- 3. Les crêpes ---------- */
function bilig(x,y){
 return `${shadow(x,y+18,90,8,.32)}<rect x="${x-80}" y="${y}" width="160" height="18" rx="4" fill="url(#bzBilig)"/><ellipse cx="${x}" cy="${y}" rx="80" ry="16" fill="#2A2D36"/><ellipse cx="${x}" cy="${y-1}" rx="66" ry="12" fill="url(#bzCrepe)"/><ellipse cx="${x-20}" cy="${y-4}" rx="20" ry="3" fill="#FFF0C8" opacity=".6"/>
 <g fill="#B8792E" opacity=".45">${[[-30,2],[10,-3],[30,3],[-5,5],[45,-2]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="2"/>`).join('')}</g>`;
}
function sceneCrepes(pl){
 return `<rect width="960" height="540" fill="url(#bzKitchen)"/>
 <rect y="300" width="960" height="140" fill="url(#bzTile)"/><g stroke="#CFC8B8" stroke-width="1">${Array.from({length:24},(_,i)=>`<path d="M${i*40},300 V440"/>`).join('')}${[340,380,420].map(y=>`<path d="M0,${y} H960"/>`).join('')}</g>
 <rect x="80" y="90" width="300" height="12" fill="url(#bzWood)"/>${[100,150,200,250,300,340].map((x,i)=>`<rect x="${x}" y="${60-(i%2)*10}" width="30" height="${30+(i%2)*10}" rx="3" fill="${['#C8282E','#F2C46D','#2E7A55'][i%3]}"/>`).join('')}
 <rect x="640" y="70" width="220" height="160" rx="3" fill="#F4F4F0"/><rect x="652" y="82" width="196" height="136" fill="url(#bzSky)"/><path d="M750,82 V218 M652,150 H848" stroke="#F4F4F0" stroke-width="6"/>
 <rect y="440" width="960" height="100" fill="url(#bzWood)"/>
 ${npcFig('gaelle',{x:440,y:450,sc:1,noShadow:true})}
 <!-- counter -->
 <polygon points="200,380 740,380 760,396 180,396" fill="url(#counterTop)"/><rect x="180" y="396" width="580" height="74" fill="url(#counterFront)"/><rect x="744" y="396" width="16" height="74" fill="#000" opacity=".16"/>${shadow(470,474,300,7,.3)}
 ${bilig(330,384)}
 <!-- stack of crêpes on a plate -->
 ${shadow(560,390,40,4,.3,'blurS')}<ellipse cx="560" cy="386" rx="40" ry="8" fill="#F4F1E8"/>${Array.from({length:7},(_,i)=>`<ellipse cx="560" cy="${382-i*3.2}" rx="32" ry="6" fill="url(#bzCrepe)"/><path d="M528,${382-i*3.2} Q560,${388-i*3.2} 592,${382-i*3.2}" stroke="#B8792E" stroke-width=".8" fill="none" opacity=".6"/>`).join('')}
 <!-- flour, eggs, milk -->
 ${shadow(650,388,22,3,.25,'blurS')}<path d="M630,388 L634,350 Q650,344 666,350 L670,388 Z" fill="#EDE8DC"/><rect x="636" y="362" width="28" height="14" fill="#1F4E9A"/>
 ${[690,706,722].map(x=>`<ellipse cx="${x}" cy="382" rx="7" ry="9" fill="#F2E6D0"/><ellipse cx="${x-2}" cy="379" rx="2" ry="3" fill="#fff" opacity=".7"/>`).join('')}
 ${ME(pl,{x:150,y:512,sc:1.1})}`;
}

/* ---------- 4. Les préparatifs (salle des fêtes, daytime) ---------- */
function hallBack(night){
 return `<rect width="960" height="540" fill="url(#${night?'bzNightHall':'bzHall'})"/>
 <g stroke="${night?'#2A2438':'#BFB29A'}" stroke-width="2" opacity=".5">${Array.from({length:12},(_,i)=>`<path d="M${i*90},0 V420"/>`).join('')}</g>
 <rect x="230" y="120" width="500" height="200" fill="url(#bzStage)"/><rect x="230" y="300" width="500" height="20" fill="#3A2412"/><rect x="220" y="110" width="520" height="14" fill="#7E1E19"/>
 ${gwennHaDu(80,90,110)}${gwennHaDu(770,90,110)}
 <rect y="420" width="960" height="120" fill="url(#bzFloor)"/><g stroke="#5A3A20" stroke-width="1" opacity=".4">${Array.from({length:16},(_,i)=>`<path d="M${i*64},420 V540"/>`).join('')}</g>`;
}
function bzBunting(y,night){
 const cols=['#1C1E24','#F4F4F0']; let g=`<path d="M0,${y} Q480,${y+40} 960,${y}" stroke="#3A3D45" stroke-width="1.2" fill="none"/>`;
 for(let i=0;i<36;i++){ const t=(i+.5)/36, px=960*t, py=y+40*4*t*(1-t)*.98; g+=`<path d="M${px-9},${py} L${px+9},${py} L${px},${py+16} Z" fill="${cols[i%2]}" opacity="${night?.8:1}"/>`; }
 return g;
}
function table(x,y){ return `${shadow(x+60,y+40,70,5,.3,'blurS')}<polygon points="${x},${y} ${x+120},${y} ${x+130},${y+10} ${x-10},${y+10}" fill="url(#counterTop)"/><rect x="${x-10}" y="${y+10}" width="140" height="6" fill="url(#counterFront)"/><rect x="${x}" y="${y+16}" width="6" height="26" fill="#5A3A20"/><rect x="${x+114}" y="${y+16}" width="6" height="26" fill="#5A3A20"/>`; }
function scenePreparatifs(pl){
 return `${hallBack(false)}${bzBunting(40,false)}
 ${table(80,430)}${table(740,440)}
 ${[0,1,2,3].map(i=>`<g transform="translate(${600+i*6} ${470-i*10})"><rect x="0" y="0" width="40" height="6" rx="2" fill="#2E7A55"/><rect x="2" y="6" width="4" height="30" fill="#1E5A3A"/><rect x="34" y="6" width="4" height="30" fill="#1E5A3A"/></g>`).join('')}
 ${npcFig('erwan',{x:420,y:470,sc:.92})}
 ${npcFig('maelle',{x:520,y:480,sc:1})}
 ${ME(pl,{x:250,y:512,sc:1.1})}`;
}

/* ---------- 5. Le fest-noz (stop scene, before the letter) ---------- */
function sonneurs(){ return `${npcFig('kervella',{x:400,y:300,sc:.72,noShadow:true,coat:'navy'})}${bombarde(400,300,.72)}${person({x:560,y:300,sc:.72,noShadow:true,coat:'plum',skin:1,hair:'#6B6460',style:'short',noHat:true})}${biniou(560,300,.72)}`; }
function bulbs(){ return Array.from({length:24},(_,i)=>{const x=i*42+10,y=26+Math.sin(i/23*Math.PI)*30;return `<circle class="bulb" style="animation-delay:${(i%6)*.25}s" cx="${x}" cy="${y+5}" r="9" fill="url(#glowStrong)"/><circle cx="${x}" cy="${y+5}" r="2.8" fill="${['#FFE2A0','#FFB4A8','#A9D8FF'][i%3]}"/>`;}).join(''); }
function sceneFestnoz(pl){
 return `${hallBack(true)}<path d="M0,22 Q480,70 960,22" stroke="#1A1D26" stroke-width="1.2" fill="none"/>${bulbs()}
 <ellipse cx="480" cy="200" rx="260" ry="140" fill="url(#bzSpot)"/>
 ${sonneurs()}
 ${[[90,'teal',2],[160,'rust',4],[830,'plum',1],[900,'olive',5]].map(([x,c,sk])=>person({x,y:470,sc:.9,coat:c,skin:sk,hair:'#3A2418',style:'mid',noHat:true})).join('')}
 ${npcFig('maelle',{x:600,y:490,sc:1})}
 ${npcFig('kervella',{x:720,y:500,sc:1.04})}
 ${ME(pl,{x:330,y:512,sc:1.1})}`;
}

/* ---------- Animated finale: the gavotte ---------- */
const FINALES={festnoz:(()=>{
 let raf=0;
 const dancers=[{id:'me'},{npc:'maelle'},{npc:'erwan'},{npc:'gaelle'},{look:{coat:'teal',skin:2,hair:'#1E1612',style:'long',noHat:true}},{look:{coat:'rust',skin:4,hair:'#1E1612',style:'short',noHat:true}},{look:{coat:'plum',skin:1,hair:'#C7A160',style:'mid',noHat:true}},{look:{coat:'olive',skin:5,hair:'#1E1612',style:'short',noHat:true}},{look:{coat:'navy',skin:3,hair:'#3A2418',style:'long',noHat:true}},{look:{coat:'yellow',skin:0,hair:'#A2502B',style:'mid',noHat:true}}];
 return {
  svg(pl){
   const figs=dancers.map((d,i)=>{ const look=d.id==='me'?playerLook(pl,GAME.playerExtra):d.npc?NPC[d.npc].look:d.look;
    return `<g class="dz" data-i="${i}"><ellipse cx="0" cy="2" rx="26" ry="6" fill="#0E0A14" opacity=".35"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}${d.id==='me'?'<text x="0" y="-242" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="15" fill="#F2C46D">toi</text>':''}</g>`; }).join('');
   const notes=Array.from({length:8},(_,i)=>`<text class="note" style="animation-delay:${i*.6}s" x="${380+(i%4)*60}" y="230" font-size="22" fill="#F2C46D">${i%2?'♪':'♫'}</text>`).join('');
   return `<style>.bulb{animation:tw 1.4s ease-in-out infinite}@keyframes tw{0%,100%{opacity:.35}50%{opacity:1}}.note{animation:up 4.8s linear infinite;opacity:0}@keyframes up{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-170px);opacity:0}}@media (prefers-reduced-motion:reduce){.bulb,.note{animation:none}.note{opacity:.6}}</style>
   ${hallBack(true)}<path d="M0,22 Q480,70 960,22" stroke="#1A1D26" stroke-width="1.2" fill="none"/>${bulbs()}
   <ellipse cx="480" cy="200" rx="300" ry="160" fill="url(#bzSpot)"/>${sonneurs()}${notes}
   <ellipse cx="480" cy="452" rx="330" ry="66" fill="#000" opacity=".12"/>
   <g id="ring">${figs}</g>`;
  },
  start(svg){
   const g=svg.querySelector('#ring'), els=[...g.querySelectorAll('.dz')], n=els.length;
   const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
   const t0=performance.now();
   const frame=now=>{
    const t=(now-t0)/1000, base=reduce?0:t*.32;
    const pos=els.map((el,i)=>{ const a=base+i*2*Math.PI/n, x=480+Math.cos(a)*320, y=452+Math.sin(a)*62, depth=(Math.sin(a)+1)/2;
     const hop=reduce?0:Math.abs(Math.sin(t*4.2+i*.9))*7; const sc=.62+depth*.38; return {el,x,y:y-hop*sc,sc,z:y}; });
    pos.sort((a,b)=>a.z-b.z).forEach(p=>{ p.el.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${p.sc.toFixed(3)})`); g.appendChild(p.el); });
    if(!reduce) raf=requestAnimationFrame(frame);
   };
   raf=requestAnimationFrame(frame);
  },
  stop(){ cancelAnimationFrame(raf); }
 };
})()};

/* ---------- Map: Quimper ---------- */
function sceneMap(){
 return `<rect width="960" height="540" fill="url(#bzLand)"/>
 <g stroke="#E0D9C8" stroke-width="1">${Array.from({length:25},(_,i)=>`<path d="M${i*40},0 V540"/>`).join('')}${Array.from({length:14},(_,i)=>`<path d="M0,${i*40} H960"/>`).join('')}</g>
 <path d="M0,300 C140,290 260,320 380,330 C500,340 560,300 640,320 C740,345 840,420 960,450 V480 C840,460 740,380 640,356 C560,338 500,376 380,368 C260,358 140,330 0,338 Z" fill="url(#bzRiver)"/>
 ${[200,420,600].map(x=>`<rect x="${x}" y="300" width="14" height="80" fill="#B9B4AA"/>`).join('')}
 <g fill="#D8D0BE">${[[80,200],[140,220],[260,210],[320,240],[380,250],[520,240],[580,210],[700,220],[760,260],[820,300],[100,420],[200,430],[300,410],[420,420],[520,430],[640,420],[740,470]].map(([x,y])=>`<rect x="${x}" y="${y}" width="28" height="18" rx="2"/>`).join('')}</g>
 <g transform="translate(470 250)"><rect x="-26" y="-30" width="52" height="40" fill="#B9B4AA"/><path d="M-22,-30 V-80 L-16,-100 L-10,-80 V-30 Z M10,-30 V-80 L16,-100 L22,-80 V-30 Z" fill="#9A958C"/></g>
 <rect x="150" y="120" width="120" height="70" rx="3" fill="#C9C0AE"/><polygon points="140,124 210,96 280,124" fill="#7A808C"/>
 <rect x="690" y="130" width="110" height="60" rx="3" fill="#E2B05A"/>
 <path d="M300,430 C300,380 280,330 220,170 M220,170 C300,180 380,190 360,230 C340,260 330,300 330,330 C400,360 600,360 740,170" stroke="#9B2F2F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"/>
 ${gwennHaDu(860,40,70)}`;
}
const MAP_PINS={maison:[300,430], lycee:[210,150], crepes:[360,250], preparatifs:[745,160], festnoz:[780,210]};
const SCENES={maison:sceneMaison, lycee:sceneLycee, crepes:sceneCrepes, preparatifs:scenePreparatifs, festnoz:sceneFestnoz};
