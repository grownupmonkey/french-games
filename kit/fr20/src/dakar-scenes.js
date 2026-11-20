/* ===== Dakar scenes (960 x 540). Strong sun from the top left, three tones, contact shadows. ===== */
const NPC={
 awa:{name:'Awa', role:'Ta sœur d\'accueil', look:{skin:5,hair:'#1E1612',style:'long',coat:'magenta',noHat:true,scarf:''}},
 fatou:{name:'Fatou Diop', role:'Ta mère d\'accueil', look:{skin:4,hair:'#1E1612',style:'mid',coat:'saffron',noHat:true,collar:'#F4EFE6'}},
 ndiaye:{name:'Mme Ndiaye', role:'Marchande de tissus', look:{skin:5,hair:'#1E1612',style:'mid',coat:'emerald',noHat:true,glasses:true,collar:'#F2C46D'}},
 ousmane:{name:'Ousmane', role:'Artiste, île de Gorée', pitch:.85, look:{skin:5,hair:'#1E1612',style:'short',coat:'olive',noHat:true,collar:'#F4EFE6'}},
 ibou:{name:'Ibou', role:'10 ans, ton frère d\'accueil', pitch:1.35, look:{skin:4,hair:'#1E1612',style:'short',coat:'emerald',noHat:true,collar:'#F4F4F0'}},
 moussa:{name:'Moussa Diop', role:'Ton père d\'accueil', look:{skin:5,hair:'#1E1612',style:'short',coat:'blue',noHat:true,glasses:true}},
 mame:{name:'Mame Coumba', role:'La grand-mère', look:{skin:4,hair:'#CFCBC4',style:'mid',grey:true,coat:'plum',noHat:true}}
};
function npcFig(id,o){ return person(Object.assign({},NPC[id].look,o)); }
function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }
const ME=(pl,o)=>person(Object.assign(playerLook(pl,GAME.playerExtra),o));

const DK_DEFS=(()=>{
 const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 const pat=(id,bg,body)=>`<pattern id="${id}" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="${bg}"/>${body}</pattern>`;
 return `<defs>${lg('dkSky',['#5FA8DA','#A9D3EE','#F2E6C8'],0,1)}${lg('dkSea',['#4FB0C9','#2A85A8','#1C5E80'],0,1)}${lg('dkSand',['#F2DDB0','#DDBF86'],0,1)}
 ${lg('dkWall',['#F4E6C6','#E2CC9E'],0,1)}${lg('dkOchre',['#E2A84E','#C4862E'],0,1)}${lg('dkRose',['#D97C6A','#B85A4A'],0,1)}${lg('dkTerra',['#C9784A','#9C5630'],0,1)}
 ${lg('dkBlue',['#3C82B4','#25608A'],0,1)}${lg('dkTarp',['#3C82B4','#2A6A96'],0,1)}${lg('dkNight',['#14213F','#28406A','#3E5683'],0,1)}${lg('dkNightWall',['#4A4560','#2E2B40'],0,1)}
 ${lg('dkWood',['#A9744A','#7A4E2C'],0,1)}${lg('dkPirogueR',['#D9534A','#9C2A22'],0,1)}${lg('dkPirogueB',['#3C82B4','#1F4E78'],0,1)}${lg('dkPirogueG',['#3FA36B','#1E6A42'],0,1)}
 ${pat('dkWax1','#E9A93A','<circle cx="5" cy="5" r="3.5" fill="#B8332B"/><circle cx="15" cy="15" r="3.5" fill="#1F4E78"/><circle cx="15" cy="5" r="1.5" fill="#F4EFE6"/>')}
 ${pat('dkWax2','#1F6E8A','<path d="M0,10 L5,4 L10,10 L15,4 L20,10" stroke="#F2C230" stroke-width="2.4" fill="none"/><path d="M0,18 L5,12 L10,18 L15,12 L20,18" stroke="#F4EFE6" stroke-width="1.4" fill="none"/>')}
 ${pat('dkWax3','#B8332B','<circle cx="10" cy="10" r="6" fill="none" stroke="#F2C230" stroke-width="2"/><circle cx="10" cy="10" r="2" fill="#2A7A4E"/>')}
 ${pat('dkWax4','#2A7A4E','<rect x="2" y="2" width="7" height="7" fill="#F2C230"/><rect x="11" y="11" width="7" height="7" fill="#C2477A"/>')}
 ${pat('dkWax5','#5C3753','<path d="M0,0 L20,20 M20,0 L0,20" stroke="#F2B84B" stroke-width="2"/><circle cx="10" cy="10" r="2.5" fill="#F4EFE6"/>')}
 ${pat('dkMat','#D9B77A','<rect width="20" height="5" fill="#B8332B" opacity=".75"/><rect y="10" width="20" height="3" fill="#2A7A4E" opacity=".7"/>')}
 ${pat('dkTiles','#C9784A','<path d="M0,0 H20 V20" stroke="#9C5630" stroke-width="1" fill="none" opacity=".6"/>')}</defs>`;
})();
document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true">${DK_DEFS}</svg>`);

/* ---------- shared pieces ---------- */
function bougainvillea(x,y,n,seed){
 let s=seed||3; const r=()=>(s=(s*9301+49297)%233280)/233280; let g=`<path d="M${x},${y+40} C${x+20},${y} ${x+60},${y-10} ${x+n*14},${y+6}" stroke="#4A6E2E" stroke-width="3" fill="none"/>`;
 for(let i=0;i<n*5;i++){ const px=x+r()*n*14, py=y-14+r()*44; g+=`<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${(4+r()*4).toFixed(1)}" fill="${r()<.25?'#3E7A3A':['#D6337A','#E2509A','#B8205E'][i%3]}"/>`; }
 return g;
}
function palm(x,y,s){
 return `${shadow(x+20*s,y+2,40*s,6*s,.28,'blurS')}<path d="M${x},${y} C${x+6*s},${y-80*s} ${x+2*s},${y-150*s} ${x+18*s},${y-210*s}" stroke="#7A5A3A" stroke-width="${10*s}" fill="none" stroke-linecap="round"/>
 ${[[-70,-10],[-40,-40],[0,-50],[40,-38],[70,-6],[55,20],[-55,22]].map(([dx,dy])=>`<path d="M${x+18*s},${y-210*s} Q${x+18*s+dx*.5*s},${y-226*s+dy*.4*s} ${x+18*s+dx*s},${y-210*s+dy*s+30*s}" stroke="#3E7A3A" stroke-width="${7*s}" fill="none" stroke-linecap="round"/>`).join('')}
 <circle cx="${x+18*s}" cy="${y-206*s}" r="${6*s}" fill="#6B4A2A"/>`;
}

/* ---------- 1. La maison des Diop (courtyard) ---------- */
function sceneMaison(pl){
 return `<rect width="960" height="540" fill="url(#dkSky)"/>
 ${palm(860,300,1)}
 <rect x="0" y="110" width="960" height="320" fill="url(#dkWall)"/><rect x="0" y="104" width="960" height="12" fill="#D9C08E"/>
 <rect x="0" y="380" width="960" height="50" fill="#D9C08E" opacity=".5"/>
 ${bougainvillea(10,100,16,4)}${bougainvillea(640,100,12,9)}
 <!-- blue door and shuttered window -->
 ${shadow(140,432,70,5,.25,'blurS')}<rect x="80" y="210" width="120" height="220" rx="4" fill="url(#dkBlue)"/><path d="M140,214 V430" stroke="#1C4A6E" stroke-width="2"/>
 ${[230,270,310,350,390].map(y=>`<path d="M86,${y} H194" stroke="#1C4A6E" stroke-width="1.2" opacity=".5"/>`).join('')}<circle cx="128" cy="330" r="4" fill="#F2C46D"/>
 <rect x="690" y="180" width="140" height="120" fill="#F4EFE6"/><rect x="698" y="188" width="60" height="104" fill="url(#dkBlue)"/><rect x="762" y="188" width="60" height="104" fill="url(#dkBlue)"/>
 ${[200,214,228,242,256,270,284].map(y=>`<path d="M700,${y} H756 M764,${y} H820" stroke="#1C4A6E" stroke-width="1.4" opacity=".6"/>`).join('')}
 <!-- family photo on the wall -->
 ${shadow(450,250,74,5,.2,'blurS')}<rect x="370" y="150" width="160" height="104" rx="2" fill="#7A4E2C"/><rect x="380" y="160" width="140" height="84" fill="#E8D9B8"/>
 <rect x="380" y="160" width="140" height="84" fill="url(#dkSky)" opacity=".5"/>
 <g transform="translate(450 244) scale(.3)">${npcFig('moussa',{x:-150,y:0,noShadow:true})}${npcFig('mame',{x:-50,y:0,noShadow:true})}${npcFig('fatou',{x:50,y:0,noShadow:true})}${npcFig('ibou',{x:150,y:0,sc:.8,noShadow:true})}</g>
 <!-- floor -->
 <rect y="430" width="960" height="110" fill="url(#dkTiles)"/><rect y="430" width="960" height="110" fill="#000" opacity=".06"/>
 ${shadow(470,476,160,8,.25)}<path d="M330,450 L620,450 L660,500 L290,500 Z" fill="url(#dkMat)"/><path d="M290,500 L660,500 L660,506 L290,506 Z" fill="#9C7A42"/>
 ${npcFig('fatou',{x:560,y:478,sc:1.02})}
 ${npcFig('awa',{x:760,y:490,sc:1})}
 ${ME(pl,{x:280,y:512,sc:1.1})}`;
}

/* ---------- 2. Le marché HLM ---------- */
function fabricStack(x,y,pats){
 return `${shadow(x+50,y+2,56,5,.28,'blurS')}`+pats.map((p,i)=>`<rect x="${x}" y="${y-(i+1)*16}" width="100" height="15" rx="3" fill="url(#${p})"/><rect x="${x}" y="${y-(i+1)*16}" width="100" height="4" rx="2" fill="#fff" opacity=".22"/><rect x="${x+88}" y="${y-(i+1)*16}" width="12" height="15" fill="#000" opacity=".15"/>`).join('');
}
function hanging(x,p,len){ return `<rect x="${x}" y="84" width="70" height="${len}" fill="url(#${p})"/><path d="M${x},${84+len} q17,8 35,0 t35,0 V${84+len-4} H${x}Z" fill="url(#${p})"/><rect x="${x+56}" y="84" width="14" height="${len}" fill="#000" opacity=".18"/><rect x="${x}" y="84" width="10" height="${len}" fill="#fff" opacity=".15"/>`; }
function sceneMarcheHLM(pl){
 return `<rect width="960" height="540" fill="url(#dkSky)"/>
 <rect y="140" width="960" height="290" fill="#E9D6AE"/>
 <!-- tarp roof -->
 <path d="M0,40 H960 V84 H0 Z" fill="url(#dkTarp)"/><path d="M0,84 Q60,96 120,84 Q180,96 240,84 Q300,96 360,84 Q420,96 480,84 Q540,96 600,84 Q660,96 720,84 Q780,96 840,84 Q900,96 960,84" fill="#2A6A96"/>
 <path d="M0,84 H960" stroke="#1C4A6E" stroke-width="2"/>${[120,480,840].map(x=>`<rect x="${x-5}" y="84" width="10" height="346" fill="url(#dkWood)"/>`).join('')}
 ${hanging(150,'dkWax1',170)}${hanging(230,'dkWax2',200)}${hanging(310,'dkWax3',150)}${hanging(560,'dkWax4',190)}${hanging(640,'dkWax5',160)}${hanging(720,'dkWax2',180)}
 <rect y="430" width="960" height="110" fill="url(#dkSand)"/><rect y="430" width="960" height="8" fill="#000" opacity=".08"/>
 ${npcFig('ndiaye',{x:470,y:410,sc:1,noShadow:true})}
 <!-- table with stacks -->
 <polygon points="300,350 680,350 700,366 280,366" fill="url(#counterTop)"/>
 <rect x="280" y="366" width="420" height="80" fill="url(#dkWood)"/><rect x="684" y="366" width="16" height="80" fill="#000" opacity=".16"/>${shadow(490,452,220,7,.3)}
 ${fabricStack(300,356,['dkWax1','dkWax3','dkWax2','dkWax4'])}${fabricStack(420,356,['dkWax5','dkWax2'])}${fabricStack(560,356,['dkWax4','dkWax1','dkWax5'])}
 ${npcFig('awa',{x:820,y:500,sc:1})}
 ${ME(pl,{x:170,y:512,sc:1.1})}`;
}

/* ---------- 3. L'île de Gorée ---------- */
function goreeHouse(x,w,h,wall,shut){
 const y=420-h;
 return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${wall})"/><rect x="${x+w-10}" y="${y}" width="10" height="${h}" fill="#000" opacity=".12"/>
 <rect x="${x-6}" y="${y-10}" width="${w+12}" height="12" fill="#8A5A3A"/>
 ${[.15,.6].map(a=>`<rect x="${x+w*a}" y="${y+24}" width="${w*.25}" height="${h*.28}" fill="${shut}"/><path d="M${x+w*a+w*.125},${y+24} V${y+24+h*.28}" stroke="#000" stroke-width="1" opacity=".3"/>`).join('')}
 <rect x="${x+8}" y="${y+h*.46}" width="${w-16}" height="6" fill="#5A3A20"/>${Array.from({length:Math.floor((w-16)/10)},(_,i)=>`<path d="M${x+12+i*10},${y+h*.46} v-22" stroke="#3A2A1A" stroke-width="1.4"/>`).join('')}<path d="M${x+8},${y+h*.46-22} H${x+w-8}" stroke="#3A2A1A" stroke-width="2"/>
 <rect x="${x+w*.38}" y="${y+h*.62}" width="${w*.24}" height="${h*.38}" fill="${shut}"/>`;
}
function maisonEsclaves(x){ /* rose building with the twin curved staircase, set back */
 const y=200;
 return `<rect x="${x}" y="${y}" width="240" height="160" fill="url(#dkRose)"/><rect x="${x+228}" y="${y}" width="12" height="160" fill="#000" opacity=".12"/>
 <rect x="${x-6}" y="${y-10}" width="252" height="12" fill="#8A4A3A"/>
 ${[30,90,150,200].map(dx=>`<rect x="${x+dx}" y="${y+20}" width="22" height="34" fill="#5A2E24"/>`).join('')}
 <rect x="${x+104}" y="${y+108}" width="32" height="52" fill="#3A1E18"/>
 <path d="M${x+40},${y+160} C${x+60},${y+120} ${x+90},${y+92} ${x+110},${y+82} H${x+130} C${x+150},${y+92} ${x+180},${y+120} ${x+200},${y+160}" stroke="#F4E6C6" stroke-width="10" fill="none"/>
 <path d="M${x+40},${y+150} C${x+60},${y+110} ${x+90},${y+84} ${x+110},${y+74} H${x+130} C${x+150},${y+84} ${x+180},${y+110} ${x+200},${y+150}" stroke="#5A2E24" stroke-width="2" fill="none"/>`;
}
function sandPainting(x,y,i){
 const scenes=[`<rect x="${x+4}" y="${y+4}" width="52" height="24" fill="#5FA8DA"/><rect x="${x+4}" y="${y+28}" width="52" height="12" fill="#2A85A8"/><circle cx="${x+40}" cy="${y+14}" r="6" fill="#F2C230"/>`,
  `<rect x="${x+4}" y="${y+4}" width="52" height="36" fill="#E9A93A"/><path d="M${x+10},${y+40} L${x+22},${y+18} L${x+34},${y+40} Z" fill="#7A4E2C"/><circle cx="${x+42}" cy="${y+14}" r="5" fill="#B8332B"/>`,
  `<rect x="${x+4}" y="${y+4}" width="52" height="36" fill="#D97C6A"/><path d="M${x+14},${y+40} C${x+20},${y+26} ${x+40},${y+26} ${x+46},${y+40}" stroke="#F4E6C6" stroke-width="3" fill="none"/>`];
 return `${shadow(x+30,y+48,30,3,.25,'blurS')}<rect x="${x}" y="${y}" width="60" height="44" fill="#5A3A20"/>${scenes[i%3]}<rect x="${x+4}" y="${y+4}" width="52" height="8" fill="#fff" opacity=".12"/>`;
}
function sceneGoree(pl){
 return `<rect width="960" height="540" fill="url(#dkSky)"/>
 <rect y="300" width="960" height="60" fill="url(#dkSea)"/>
 ${maisonEsclaves(360)}
 ${goreeHouse(-10,200,250,'dkOchre','#2A7A4E')}${goreeHouse(640,170,230,'dkTerra','#25608A')}${goreeHouse(800,180,260,'dkOchre','#B8332B')}
 ${bougainvillea(170,170,10,5)}${bougainvillea(650,190,8,11)}
 <rect y="420" width="960" height="120" fill="url(#dkSand)"/><g fill="#C9A86A" opacity=".5">${Array.from({length:30},(_,i)=>`<circle cx="${(i*67)%960}" cy="${440+(i*37)%90}" r="1.6"/>`).join('')}</g>
 <!-- painting display -->
 ${shadow(170,152,100,4,.18,'blurS')}<rect x="60" y="120" width="220" height="30" rx="4" fill="#2B2D42"/><rect x="63" y="123" width="214" height="24" rx="3" fill="none" stroke="#E9C77B" stroke-width="1" opacity=".55"/>
 <rect x="60" y="160" width="220" height="200" fill="#E8D9B8" opacity=".9"/>
 ${[[74,176],[140,176],[206,176],[74,240],[140,240],[206,240]].map(([x,y],i)=>sandPainting(x,y,i)).join('')}
 ${shadow(170,424,110,6,.3)}<rect x="66" y="300" width="208" height="120" fill="url(#dkWood)"/><rect x="60" y="296" width="220" height="8" fill="#5A3A20"/>
 ${[0,1,2].map(i=>`<ellipse cx="${100+i*60}" cy="296" rx="18" ry="5" fill="${['#E9A93A','#B8332B','#2A85A8'][i]}"/>`).join('')}
 ${npcFig('ousmane',{x:340,y:500,sc:1.05})}
 ${ME(pl,{x:620,y:512,sc:1.1})}`;
}

/* ---------- 4. La plage ---------- */
function pirogue(x,y,s,g,flip){
 const k=flip?-1:1, X=v=>x+k*v*s;
 return `${shadow(X(110),y+6*s,120*s,6*s,.3,'blurS')}
 <path d="M${X(0)},${y-34*s} Q${X(30)},${y} ${X(110)},${y} Q${X(190)},${y} ${X(225)},${y-38*s} Q${X(110)},${y-20*s} ${X(0)},${y-34*s} Z" fill="url(#${g})"/>
 <path d="M${X(14)},${y-26*s} Q${X(110)},${y-12*s} ${X(212)},${y-30*s}" stroke="#F2C230" stroke-width="${4*s}" fill="none"/>
 <path d="M${X(20)},${y-18*s} Q${X(110)},${y-4*s} ${X(206)},${y-20*s}" stroke="#F4EFE6" stroke-width="${3*s}" fill="none"/>
 ${[50,90,130,170].map(v=>`<circle cx="${X(v)}" cy="${y-10*s}" r="${3*s}" fill="#F4EFE6"/>`).join('')}
 <path d="M${X(0)},${y-34*s} L${X(-6)},${y-48*s}" stroke="#3A2A1A" stroke-width="${3*s}"/><path d="M${X(225)},${y-38*s} L${X(232)},${y-54*s}" stroke="#3A2A1A" stroke-width="${3*s}"/>
 <rect x="${Math.min(X(232),X(232)+k*16*s)}" y="${y-62*s}" width="${16*s}" height="${10*s}" fill="#2A7A4E"/>`;
}
function scenePlage(pl){
 return `<rect width="960" height="540" fill="url(#dkSky)"/>
 <rect y="230" width="960" height="130" fill="url(#dkSea)"/>
 <g stroke="#E8F6FA" stroke-width="2" opacity=".55" fill="none">${[[40,260],[300,280],[620,250],[820,300],[160,320],[520,330]].map(([x,y])=>`<path d="M${x},${y} q24,-5 48,0 t48,0"/>`).join('')}</g>
 <path d="M0,356 Q240,344 480,352 T960,346 V360 H0Z" fill="#F4FAFC" opacity=".7"/>
 <path d="M0,360 Q240,350 480,356 T960,350 V540 H0 Z" fill="url(#dkSand)"/>
 ${pirogue(30,410,1,'dkPirogueR',false)}${pirogue(560,396,.85,'dkPirogueB',true)}${pirogue(700,420,1.05,'dkPirogueG',false)}
 <!-- stick goal -->
 ${shadow(420,444,60,4,.25,'blurS')}<path d="M370,444 V370 H470 V444" stroke="#7A5A3A" stroke-width="6" fill="none" stroke-linecap="round"/>
 ${[0,1,2,3,4].map(i=>`<path d="M${378+i*22},372 L${384+i*20},440" stroke="#E8E2D6" stroke-width="1" opacity=".7"/>`).join('')}
 ${shadow(560,500,10,3,.3,'blurS')}<circle cx="560" cy="490" r="10" fill="#F4F4F0"/><path d="M553,486 l7,-3 l6,4 l-2,7 l-8,0 z" fill="#2B2D42"/>
 ${[120,200,880].map((x,i)=>`<g transform="translate(${x} ${350+i*4}) scale(.45)">${person({x:0,y:0,coat:['saffron','blue','rust'][i],skin:[4,5,3][i],hair:'#1E1612',style:'short',noHat:true})}</g>`).join('')}
 ${npcFig('ibou',{x:680,y:505,sc:.9})}
 ${ME(pl,{x:280,y:512,sc:1.1})}`;
}

/* ---------- 5. Le grand souper (night courtyard) ---------- */
function attaya(x,y){
 return `${shadow(x+30,y+2,34,4,.3,'blurS')}<rect x="${x}" y="${y-24}" width="40" height="24" rx="3" fill="#3A3D45"/><ellipse cx="${x+20}" cy="${y-24}" rx="20" ry="4" fill="#E8742A" opacity=".8"/>
 <path d="M${x+8},${y-28} Q${x+6},${y-48} ${x+20},${y-50} Q${x+34},${y-48} ${x+32},${y-28} Z" fill="url(#metal)"/><path d="M${x+32},${y-40} L${x+44},${y-48}" stroke="#9BA4AE" stroke-width="3"/>
 <rect x="${x+16}" y="${y-56}" width="8" height="6" rx="2" fill="#5E6772"/>
 ${[0,1,2].map(i=>`<rect x="${x+50+i*10}" y="${y-12}" width="7" height="12" rx="1" fill="#A9D8C8" opacity=".85"/>`).join('')}`;
}
function sceneSouper(pl){
 let s=4; const r=()=>(s=(s*9301+49297)%233280)/233280; let stars='';
 for(let i=0;i<50;i++) stars+=`<circle cx="${(r()*960).toFixed(0)}" cy="${(r()*110).toFixed(0)}" r="${(.5+r()*1).toFixed(1)}" fill="#fff" opacity="${(.3+r()*.6).toFixed(2)}"/>`;
 const bulbs=Array.from({length:22},(_,i)=>{const x=i*45+10,y=118+Math.sin(i/21*Math.PI)*38;return `<circle cx="${x}" cy="${y+5}" r="10" fill="url(#glowStrong)"/><circle cx="${x}" cy="${y+5}" r="2.8" fill="${['#FFE2A0','#FFB4A8','#A9D8FF'][i%3]}"/>`;}).join('');
 return `<rect width="960" height="540" fill="url(#dkNight)"/>${stars}
 <rect x="0" y="130" width="960" height="300" fill="url(#dkNightWall)"/><rect x="0" y="124" width="960" height="10" fill="#3A3650"/>
 ${bougainvillea(20,130,14,7)}
 <rect x="80" y="230" width="120" height="200" rx="4" fill="#1F3A55"/>
 <path d="M0,118 Q480,170 960,118" stroke="#1A1D26" stroke-width="1.2" fill="none"/>${bulbs}
 <rect y="430" width="960" height="110" fill="url(#dkTiles)"/><rect y="430" width="960" height="110" fill="#0E1630" opacity=".45"/>
 <circle cx="480" cy="380" r="300" fill="url(#glow)" opacity=".6"/>
 ${npcFig('moussa',{x:250,y:450,sc:.95})}${npcFig('mame',{x:360,y:446,sc:.92})}${npcFig('fatou',{x:600,y:450,sc:.95})}${npcFig('ibou',{x:700,y:456,sc:.8})}
 <!-- mat and the big dish -->
 ${shadow(480,500,220,10,.35)}<path d="M290,462 L670,462 L720,520 L240,520 Z" fill="url(#dkMat)"/>
 ${shadow(480,494,90,8,.35,'blurS')}<ellipse cx="480" cy="486" rx="90" ry="20" fill="#C9CFD6"/><ellipse cx="480" cy="482" rx="80" ry="16" fill="#E2B05A"/>
 <ellipse cx="480" cy="480" rx="56" ry="10" fill="#B8441C"/>${[[454,478],[480,474],[506,479]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="12" ry="5" fill="#9AA3AE"/><ellipse cx="${x-3}" cy="${y-2}" rx="4" ry="1.5" fill="#fff" opacity=".6"/>`).join('')}
 <circle cx="440" cy="486" r="5" fill="#E8742A"/><circle cx="520" cy="488" r="5" fill="#3E7A3A"/><circle cx="498" cy="490" r="4" fill="#E8742A"/>
 ${attaya(640,512)}
 ${npcFig('awa',{x:830,y:500,sc:1})}
 ${ME(pl,{x:130,y:512,sc:1.08})}`;
}

/* ---------- Map: Dakar peninsula ---------- */
function sceneMap(){
 return `<rect width="960" height="540" fill="url(#dkSea)"/>
 <g stroke="#6FC0D6" stroke-width="1" opacity=".35">${Array.from({length:25},(_,i)=>`<path d="M${i*40},0 V540"/>`).join('')}${Array.from({length:14},(_,i)=>`<path d="M0,${i*40} H960"/>`).join('')}</g>
 <path d="M960,120 C860,130 760,140 660,150 C560,156 470,150 400,170 C330,190 260,170 200,190 C140,210 100,250 130,290 C160,320 230,310 300,330 C380,350 460,360 520,390 C580,420 640,420 680,400 C720,380 760,340 820,320 C880,300 930,300 960,300 Z" fill="url(#dkSand)" stroke="#C9A86A" stroke-width="3"/>
 <path d="M660,150 C640,220 600,280 560,330" stroke="#E2CC9E" stroke-width="10" fill="none"/>
 <g fill="#E2CC9E">${[[300,240],[360,260],[420,220],[480,250],[540,230],[600,260],[520,300],[580,320],[460,300],[640,300],[700,250],[760,220],[820,200],[240,250]].map(([x,y])=>`<rect x="${x}" y="${y}" width="24" height="16" rx="2"/>`).join('')}</g>
 <ellipse cx="760" cy="440" rx="22" ry="12" fill="url(#dkSand)" stroke="#C9A86A" stroke-width="2"/>
 <path d="M640,410 C680,430 720,440 740,440" stroke="#2B2D42" stroke-width="2" stroke-dasharray="4 6" fill="none"/>
 <path d="M310,200 L322,180 L334,200 Z" fill="#B8441C"/>
 <path d="M300,215 C380,240 460,250 520,250 C560,260 590,320 620,350 C680,380 720,420 760,430 M760,430 C700,400 620,360 600,360" stroke="#9B2F2F" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" fill="none"/>`;
}
const MAP_PINS={maison:[560,360], marche:[520,250], goree:[760,430], plage:[300,212], souper:[700,300]};
const SCENES={maison:sceneMaison, marche:sceneMarcheHLM, goree:sceneGoree, plage:scenePlage, souper:sceneSouper};
