/* ===== Shared art: one light from the top left, three tones per object, soft contact shadows. ===== */
const SKIN = [
 {name:'Très claire', l:'#F6D9C4', m:'#E9BC9E', d:'#CB967C'},
 {name:'Claire',      l:'#F0C9A8', m:'#DDA884', d:'#C08966'},
 {name:'Moyenne',     l:'#DCA77F', m:'#C38862', d:'#A06A49'},
 {name:'Mate',        l:'#BC8762', m:'#9C6946', d:'#7C4F32'},
 {name:'Foncée',      l:'#92603F', m:'#77492D', d:'#58341F'},
 {name:'Très foncée', l:'#6C4532', m:'#543424', d:'#3B2318'}
];
const HAIR = [
 {name:'Noir', c:'#1E1612'}, {name:'Brun', c:'#3A2418'}, {name:'Châtain', c:'#6B4428'},
 {name:'Roux', c:'#A2502B'}, {name:'Blond', c:'#C7A160'}
];
const COATS = {
 teal:['#3F7D86','#2C5E67','#1B3E45'], rust:['#8C4A3A','#6E3428','#4A2119'], navy:['#4A5C8A','#33436A','#202B47'],
 plum:['#7A4E6E','#5C3753','#3C2236'], olive:['#77804F','#5A633A','#3C4226'], grey:['#7D8590','#5D646E','#3D434B'],
 cream:['#EFE6D6','#D8CCB8','#B3A58E'], yellow:['#F2C94C','#D9A82B','#9C7414'], blue:['#4E7FB8','#355E91','#223F66']
};
const HATS = { mustard:['#D9A84A','#A97A26'], slate:['#5B6680','#363E52'], red:['#B8443A','#7E2620'], cream:['#EFE6D4','#C9BEA8'], green:['#5E8C6A','#3B5E45'] };

function svgDefs(){
 const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 let d='';
 SKIN.forEach((s,i)=>{ d+=lg('skin'+i,[s.l,s.m,s.d]); });
 for(const k in COATS) d+=lg('coat-'+k,COATS[k]);
 for(const k in HATS) d+=lg('hat-'+k,HATS[k]);
 d+=lg('sky',['#5E7CA3','#8FA6C2','#C9D1DC','#EAD7C3'],0,1)
  +lg('skyNight',['#0E1630','#1D2B52','#34497A','#4E5F8E'],0,1)
  +lg('skyDay',['#7FA3C9','#AFC6DC','#DCE6EE'],0,1)
  +lg('snowG',['#F4F6F8','#C9D5E1'],0,1)
  +lg('snowNight',['#9AA9C6','#5F6F93'],0,1)
  +`<linearGradient id="snowTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBFCFD"/><stop offset="1" stop-color="#C7D3E0"/></linearGradient>`
  +lg('chWall',['#B98B80','#93695F'])+lg('chRoof',['#8DB3A6','#5F8A7D'])
  +lg('stone',['#D3C8B8','#A99B88'])+lg('ochre',['#D8C29A','#B09670'])+lg('greyStone',['#BFC5C9','#8E979E'])
  +lg('slate',['#4E5568','#2C3140'])+lg('redRoof',['#8A4238','#5E2B25'])
  +lg('win',['#FFE3A3','#E9A54E'],0,1)
  +`<radialGradient id="glow"><stop offset="0" stop-color="#FFD98A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>`
  +`<radialGradient id="glowStrong"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".9"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>`
  +lg('logGrad',['#9C6E46','#7E5534','#5A3A20'],0,1)
  +`<pattern id="logs" width="40" height="17" patternUnits="userSpaceOnUse"><rect width="40" height="17" fill="url(#logGrad)"/><rect y="15.8" width="40" height="1.2" fill="#3B2412" opacity=".6"/><path d="M8,6 h10 M26,10 h7" stroke="#3B2412" stroke-width=".7" opacity=".3"/></pattern>`
  +`<pattern id="brick" width="12" height="6" patternUnits="userSpaceOnUse"><path d="M0,6 H12 M6,0 V3 M0,3 H12 M0,3 V6" stroke="#7E5A51" stroke-width=".6" opacity=".35" fill="none"/></pattern>`
  +`<pattern id="blocks" width="28" height="14" patternUnits="userSpaceOnUse"><path d="M0,14 H28 M0,7 H28 M14,0 V7 M0,7 V14 M28,7 V14" stroke="#5E5446" stroke-width=".7" opacity=".22" fill="none"/></pattern>`
  +`<pattern id="planks" width="60" height="12" patternUnits="userSpaceOnUse"><rect width="60" height="12" fill="#A4794F"/><rect y="11" width="60" height="1" fill="#5E4129" opacity=".5"/><rect x="38" width="1" height="12" fill="#5E4129" opacity=".35"/></pattern>`
  +lg('interior',['#2E1E14','#4E3423'],0,1)
  +lg('counterTop',['#D3A475','#AD7F52'],0,1)+lg('counterFront',['#7F532F','#58371C'],0,1)
  +`<linearGradient id="pastry" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EDC67E"/><stop offset=".55" stop-color="#C98A3D"/><stop offset="1" stop-color="#93591E"/></linearGradient>`
  +lg('cup',['#FAF7F1','#E3DCCF','#B9AF9E'])+lg('sleeve',['#A36D3F','#6E4524'])
  +`<linearGradient id="syrup" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#DE9C46"/><stop offset=".5" stop-color="#B66A1F"/><stop offset="1" stop-color="#7A410F"/></linearGradient>`
  +lg('wood',['#906340','#5F3D22'],0,1)+lg('woodH',['#B07F55','#7A5233'])
  +lg('pole',['#4A5060','#1A1D26'])
  +lg('pantsDark',['#3B3F4C','#22252E'])+lg('pantsDenim',['#4D6286','#2D3B57'])
  +lg('boot',['#6B4A30','#36251A'],0,1)
  +lg('river',['#5F8FB0','#3D6A8C','#2C5070'],0,1)
  +lg('riverNight',['#2B4166','#1A2A47'],0,1)
  +lg('ice',['#F5F8FA','#C9D8E4'],1,1)
  +lg('hull',['#FFFFFF','#DCE2E8','#AEB8C2'],0,1)
  +lg('metal',['#9BA4AE','#5E6772'])
  +lg('sash',['#B3322B','#7E211C'])
  +lg('sled',['#C99A62','#8F6236'],0,1)
  +lg('trunk',['#6E5A4A','#3E3128'])
  +lg('float',['#2F5DA8','#1C3A70'])
  +`<filter id="blur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="4"/></filter>`
  +`<filter id="blurS" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="1.4"/></filter>`
  +`<filter id="blurL" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>`;
 return `<svg class="svgdefs" aria-hidden="true" focusable="false"><defs>${d}</defs></svg>`;
}

const shadow=(cx,cy,rx,ry,op=.3,f='blur')=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#1F2A40" opacity="${op}" filter="url(#${f})"/>`;

/* A person. Feet at (0,0), about 232 tall at scale 1. o: skin (0-5), hair colour, style long|mid|short,
   coat key, hat key, pants id, plus extras: scarf, sash (worn), holdSash, map, headset, apron, noShadow, noHat. */
function person(o){
 const sk=SKIN[o.skin||0], skinG=`url(#skin${o.skin||0})`, h=o.hair||'#3A2418';
 const C=COATS[o.coat||'teal'], coatG=`url(#coat-${o.coat||'teal'})`, H=HATS[o.hat||'mustard'];
 const pants=o.pants||'url(#pantsDark)', glove=o.glove||'#2B2E38', style=o.style||'short';
 let hairBack='';
 if(style==='long') hairBack=`<path d="M-15,-206 C-19,-190 -20,-176 -18,-160 C-10,-156 10,-156 18,-160 C20,-176 19,-190 15,-206 Z" fill="${h}"/><path d="M8,-200 C14,-186 16,-172 16,-160 L18,-160 C20,-176 19,-190 15,-206 Z" fill="#000" opacity=".2"/>`;
 else if(style==='mid') hairBack=`<path d="M-15,-206 C-17,-195 -17,-184 -15,-176 C-8,-173 8,-173 15,-176 C17,-184 17,-195 15,-206 Z" fill="${h}"/><path d="M9,-200 C13,-192 14,-182 13,-176 L15,-176 C17,-184 17,-195 15,-206 Z" fill="#000" opacity=".2"/>`;
 else hairBack=`<path d="M-13.5,-206 C-14.5,-198 -14,-192 -13,-189 L13,-189 C14,-192 14.5,-198 13.5,-206 Z" fill="${h}"/>`;
 const fringe = style==='short'
  ? `<path d="M-13,-203 C-13,-211 -6,-214 0,-214 C6,-214 13,-211 13,-203 C9,-206 -5,-207 -13,-203 Z" fill="${h}"/>`
  : `<path d="M-12.8,-202 C-13,-212 -6,-214 0,-214 C6,-214 13,-212 12.8,-202 C8,-207 -4,-208 -12.8,-202 Z" fill="${h}"/>`;
 const sash = o.sash ? `
  <path d="M-25,-110 Q0,-104 25,-110 L25.5,-100 Q0,-94 -25.5,-100 Z" fill="url(#sash)"/>
  <path d="M-24,-107 l5,3.5 l5,-3.5 l5,3.5 l5,-3.5 l5,3.5 l5,-3.5 l5,3.5 l5,-3.5 l5,3.5 l4,-2.5" fill="none" stroke="#E2B860" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M-24,-102 l5,3.5 l5,-3.5 l5,3.5 l5,-3.5 l5,3.5 l5,-3.5 l5,3.5 l5,-3.5 l5,3.5 l4,-2.5" fill="none" stroke="#2F4F86" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M25,-104 L26,-100 L31,-62 L24,-62 L21,-98 Z" fill="#8C2420"/>
  <path d="M24,-90 l3,2.5 l3,-2.5 M24.5,-80 l3,2.5 l3,-2.5 M25,-70 l3,2.5 l3,-2.5" stroke="#E2B860" stroke-width="1.1" fill="none"/>
  <g stroke="#8C2420" stroke-width="1" stroke-linecap="round"><path d="M25,-62 v6"/><path d="M27,-62 v7"/><path d="M29,-62 v6"/><path d="M31,-62 v7"/></g>` : '';
 const apron = o.apron ? `<path d="M-16,-150 H16 L19,-96 Q0,-92 -19,-96 Z" fill="${o.apron}"/><path d="M-16,-150 H16 L16.6,-142 H-16.6 Z" fill="#000" opacity=".12"/><path d="M-10,-120 h20" stroke="#000" stroke-width="1" opacity=".15"/>` : '';
 let right;
 if(o.map) right=`<path d="M19,-170 C30,-166 31,-150 30,-138 C29,-130 24,-126 16,-122 L10,-124 L9,-131 L19,-136 C20,-146 20,-156 19,-170 Z" fill="${C[2]}"/>
   <g transform="translate(-6 -134) rotate(-6)"><polygon points="0,0 22,-2 24,14 2,16" fill="#F4EDE0"/><polygon points="11,-1 13,15 2,16 0,0" fill="#E4DACA"/><path d="M4,5 L19,4 M5,10 L13,9" stroke="#2C5E67" stroke-width="1.1" opacity=".7"/><path d="M15,7 l3,0" stroke="#9B2F2F" stroke-width="2" stroke-linecap="round"/></g>
   <ellipse cx="12" cy="-124" rx="5.5" ry="4.5" fill="${glove}"/>`;
 else if(o.holdSash) right=`<path d="M19,-170 C30,-166 31,-150 30,-138 C29,-130 24,-126 16,-122 L10,-124 L9,-131 L19,-136 C20,-146 20,-156 19,-170 Z" fill="${C[2]}"/>
   <path d="M2,-134 C10,-138 18,-132 22,-124 L26,-70 L18,-70 L15,-120 C12,-126 6,-126 2,-126 Z" fill="url(#sash)"/>
   <path d="M17,-118 l3,2.5 l3,-2.5 M18,-106 l3,2.5 l3,-2.5 M19,-94 l3,2.5 l3,-2.5 M19.5,-82 l3,2.5 l3,-2.5" stroke="#E2B860" stroke-width="1.2" fill="none"/>
   <g stroke="#8C2420" stroke-width="1.1" stroke-linecap="round"><path d="M19,-70 v6"/><path d="M21.5,-70 v7"/><path d="M24,-70 v6"/></g>
   <ellipse cx="12" cy="-126" rx="5.5" ry="4.5" fill="${glove}"/>`;
 else if(o.wave) right=`<path d="M19,-170 C28,-170 34,-180 36,-196 L42,-214 C44,-218 38,-220 36,-216 L28,-198 C26,-188 22,-182 18,-180 Z" fill="${C[2]}"/><ellipse cx="40" cy="-218" rx="5" ry="6" fill="${glove}"/>`;
 else right=`<path d="M19,-170 C29,-166 31,-150 30,-128 L29,-104 C26,-100 22,-100 20,-104 L18,-150 Z" fill="${C[2]}"/><ellipse cx="24.5" cy="-100" rx="5" ry="6" fill="${glove}" opacity=".95"/>`;
 const scarf = o.scarf ? `<path d="M-14,-178 C-6,-172 6,-172 14,-178 L15,-170 C6,-165 -6,-165 -15,-170 Z" fill="${o.scarf}"/><path d="M6,-170 L9,-142 L2,-142 L0,-168 Z" fill="${o.scarf}"/><path d="M6,-170 L9,-142 L6,-142 Z" fill="#000" opacity=".2"/><g stroke="${o.scarf}" stroke-width="1.2"><path d="M3,-142 v4"/><path d="M5.5,-142 v5"/><path d="M8,-142 v4"/></g>` : '';
 const headset = o.headset ? `<path d="M-13.5,-204 C-14,-222 14,-222 13.5,-204" fill="none" stroke="#22252E" stroke-width="2.2"/><rect x="-16" y="-206" width="5" height="9" rx="2" fill="#22252E"/><path d="M-14,-198 C-14,-190 -9,-188 -4,-188" stroke="#22252E" stroke-width="1.4" fill="none"/>` : '';
 const hat = o.noHat ? '' : `
  <path d="M-13.5,-207 C-13.5,-222 -6,-226 0,-226 C6,-226 13.5,-222 13.5,-207 Z" fill="url(#hat-${o.hat||'mustard'})"/>
  <path d="M-7,-208 V-222 M-2.3,-208 V-225 M2.3,-208 V-225 M7,-208 V-222" stroke="#000" stroke-width=".8" opacity=".15"/>
  <rect x="-14.5" y="-211" width="29" height="7" rx="3" fill="${o.band||'#EFE6D4'}"/><rect x="-14.5" y="-207" width="29" height="3" rx="1.5" fill="#000" opacity=".15"/>
  ${o.pompom===false?'':`<circle cx="0" cy="-228" r="5" fill="${o.band||'#EFE6D4'}"/><circle cx="-1.6" cy="-229.6" r="2" fill="#fff" opacity=".6"/>`}`;
 return `<g transform="translate(${o.x} ${o.y}) scale(${o.sc||1})">
  ${o.noShadow?'':shadow(0,1,38,7,.3)}
  ${hairBack}
  <rect x="-13" y="-98" width="11.5" height="88" rx="5" fill="${pants}"/>
  <rect x="1.5" y="-98" width="11.5" height="88" rx="5" fill="${pants}"/><rect x="8" y="-96" width="5" height="84" rx="2.5" fill="#000" opacity=".22"/>
  <path d="M-15,-16 C-15,-20 -13,-22 -10,-22 H-1 V0 H-19 C-20,-8 -17,-12 -15,-16 Z" fill="url(#boot)"/>
  <path d="M1,-22 H10 C13,-22 15,-20 15,-16 C17,-12 20,-8 19,0 H1 Z" fill="url(#boot)"/>
  <rect x="-19" y="-2" width="18" height="3" rx="1" fill="#1E140C"/><rect x="1" y="-2" width="18.5" height="3" rx="1" fill="#1E140C"/>
  <path d="M-14,-24 h13 v4 h-13z" fill="#D9D2C6"/><path d="M1,-24 h13 v4 h-13z" fill="#B9B1A4"/>
  <path d="M-19,-170 C-29,-166 -31,-150 -30,-128 L-29,-104 C-26,-100 -22,-100 -20,-104 L-18,-150 Z" fill="${C[0]}"/>
  <ellipse cx="-24.5" cy="-100" rx="5" ry="6" fill="${glove}"/>
  <path d="M-21,-172 C-8,-177 8,-177 21,-172 L26,-96 C10,-91 -10,-91 -26,-96 Z" fill="${coatG}"/>
  <path d="M0,-174 V-93" stroke="#000" stroke-width="1.2" opacity=".35"/>
  <path d="M-20,-150 C-22,-130 -22,-115 -21,-100" stroke="#fff" stroke-width="2" opacity=".15" fill="none" stroke-linecap="round"/>
  ${apron}${sash}${right}
  <rect x="-5" y="-188" width="10" height="12" fill="${sk.d}"/>
  <path d="M-15,-176 C-8,-170 8,-170 15,-176 C12,-182 -12,-182 -15,-176 Z" fill="${o.collar||'#E9E3D8'}"/>
  ${scarf}
  <ellipse cx="0" cy="-200" rx="12.5" ry="15" fill="${skinG}"/>
  <ellipse cx="-12.2" cy="-199" rx="2" ry="3.2" fill="${sk.d}"/>
  <path d="M-8.5,-204.5 Q-5.5,-206 -2.5,-204.8 M2.5,-204.8 Q5.5,-206 8.5,-204.5" stroke="${o.brow||h}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <ellipse cx="-5.2" cy="-200.5" rx="1.5" ry="1.9" fill="#1F2433"/><ellipse cx="5.2" cy="-200.5" rx="1.5" ry="1.9" fill="#1F2433"/>
  <circle cx="-4.7" cy="-201.1" r=".5" fill="#fff"/><circle cx="5.7" cy="-201.1" r=".5" fill="#fff"/>
  <path d="M0.5,-199 L1.8,-194.2 L-0.4,-193.7" stroke="${sk.d}" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-3.2,-189.6 Q0,-187.2 3.2,-189.6" stroke="#7A3E30" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  ${o.glasses?`<g fill="none" stroke="#2A2A30" stroke-width="1"><circle cx="-5.2" cy="-200.5" r="3.6"/><circle cx="5.2" cy="-200.5" r="3.6"/><path d="M-1.6,-200.8 h3.2"/></g>`:''}
  ${o.grey?`<path d="M-12.8,-202 C-13,-212 -6,-214 0,-214 C6,-214 13,-212 12.8,-202 C8,-207 -4,-208 -12.8,-202 Z" fill="${h}"/>`:fringe}
  ${hat}${headset}
 </g>`;
}

/* the player's look, from the saved profile */
function playerLook(p, extra){
 const style = p.style || (p.gender==='fille'?'long':p.gender==='garcon'?'short':'mid');
 return Object.assign({skin:p.skin??1, hair:(HAIR[p.hair??1]||HAIR[1]).c, style, coat:'teal', hat:'mustard', scarf:'#9B2F2F', pants:'url(#pantsDark)'}, extra||{});
}

/* ---------- scene pieces ---------- */
function snowfall(n, seed, night){
 let s=seed||7; const r=()=>(s=(s*9301+49297)%233280)/233280; let g='';
 for(let i=0;i<n;i++) g+=`<circle class="flake" cx="${(r()*960).toFixed(1)}" cy="${(r()*520).toFixed(1)}" r="${(.9+r()*1.9).toFixed(1)}" opacity="${((night?.35:.5)+r()*.45).toFixed(2)}" style="animation-duration:${(9+r()*9).toFixed(1)}s;animation-delay:${(-r()*18).toFixed(1)}s"/>`;
 return `<g fill="#fff">${g}</g>`;
}
function chateau(x,y,s,op){
 return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op??.82}">
 <rect x="-154" y="52" width="308" height="130" fill="url(#chWall)"/><rect x="-154" y="52" width="308" height="130" fill="url(#brick)"/>
 <polygon points="-162,54 162,54 142,24 -142,24" fill="url(#chRoof)"/>
 <rect x="-48" y="0" width="96" height="182" fill="url(#chWall)"/><rect x="-48" y="0" width="96" height="182" fill="url(#brick)"/>
 <polygon points="-58,2 58,2 24,-60 -24,-60" fill="url(#chRoof)"/>
 <g fill="url(#chRoof)"><polygon points="-34,-14 -20,-14 -27,-28"/><polygon points="-7,-20 7,-20 0,-36"/><polygon points="20,-14 34,-14 27,-28"/></g>
 <rect x="-1" y="-66" width="2" height="8" fill="#5F8A7D"/>
 <rect x="-138" y="32" width="38" height="150" fill="url(#chWall)"/><polygon points="-142,34 -96,34 -119,-14" fill="url(#chRoof)"/>
 <rect x="100" y="32" width="38" height="150" fill="url(#chWall)"/><polygon points="96,34 142,34 119,-14" fill="url(#chRoof)"/>
 <g fill="#F5D394" opacity=".78">
  <rect x="-34" y="20" width="7" height="11" rx="1"/><rect x="-16" y="20" width="7" height="11" rx="1"/><rect x="2" y="20" width="7" height="11" rx="1"/><rect x="20" y="20" width="7" height="11" rx="1"/>
  <rect x="-34" y="44" width="7" height="11" rx="1"/><rect x="2" y="44" width="7" height="11" rx="1"/><rect x="20" y="44" width="7" height="11" rx="1"/>
  <rect x="-88" y="66" width="6" height="10" rx="1"/><rect x="-72" y="66" width="6" height="10" rx="1"/><rect x="66" y="66" width="6" height="10" rx="1"/><rect x="82" y="66" width="6" height="10" rx="1"/>
  <rect x="-126" y="52" width="6" height="10" rx="1"/><rect x="114" y="52" width="6" height="10" rx="1"/>
  <rect x="-88" y="96" width="6" height="10" rx="1"/><rect x="-72" y="96" width="6" height="10" rx="1"/><rect x="66" y="96" width="6" height="10" rx="1"/><rect x="82" y="96" width="6" height="10" rx="1"/>
 </g></g>`;
}
function snowCap(x1,x2,yTop,peakX,peakY){ /* scalloped snow on a gable roof */
 const steps=7, w=(x2-x1)/steps; let p=`M${x1},${yTop} L${peakX},${peakY} L${x2},${yTop}`;
 for(let i=steps;i>0;i--){const a=x1+i*w, b=a-w; p+=` C${a-w*.3},${yTop+6} ${b+w*.3},${yTop+4} ${b},${yTop+(i%2?5:2)}`;}
 return `<path d="${p} Z" fill="url(#snowTop)"/>`;
}
function oldHouse(x,y,w,h,wall,roof,shutter,seed){
 const peak=y-w*.48, cx=x+w/2;
 let wins='';
 const cols=w>140?2:1;
 for(let r=0;r<2;r++) for(let c=0;c<cols;c++){
  const wx= cols===1? cx-15 : x+w*.2+c*(w*.6-30)/(cols-1||1), wy=y+30+r*80;
  if(wy+46>y+h-10) continue;
  wins+=`<rect x="${wx}" y="${wy}" width="30" height="44" fill="url(#win)"/><path d="M${wx+15},${wy} V${wy+44} M${wx},${wy+22} H${wx+30}" stroke="#3A3226" stroke-width="2"/><rect x="${wx-2}" y="${wy-2}" width="34" height="48" fill="none" stroke="#EFE7DA" stroke-width="3"/><rect x="${wx-5}" y="${wy+45}" width="40" height="5" rx="1" fill="#F4F6F8"/>`
   +(shutter?`<path d="M${wx-6},${wy} h6 v44 h-6z M${wx+30},${wy} h6 v44 h-6z" fill="${shutter}"/>`:'');
 }
 return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${wall})"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#blocks)"/>
 <rect x="${x+w-10}" y="${y}" width="10" height="${h}" fill="#000" opacity=".1"/>
 <polygon points="${x-12},${y+4} ${cx},${peak} ${x+w+12},${y+4}" fill="url(#${roof})"/><polygon points="${cx},${peak} ${x+w+12},${y+4} ${cx+w*.3},${y+4}" fill="#000" opacity=".18"/>
 ${snowCap(x-6,x+w+6,y,cx,peak+5)}${wins}</g>`;
}
function lampPost(x,y,night){
 return `${shadow(x,y+2,24,5,.3,'blurS')}<rect x="${x-5}" y="${y-266}" width="10" height="268" rx="3" fill="url(#pole)"/>
 <rect x="${x-13}" y="${y-300}" width="26" height="38" rx="3" fill="#1F2230"/><rect x="${x-9}" y="${y-295}" width="18" height="28" rx="2" fill="url(#win)"/>
 <path d="M${x-17},${y-298} L${x},${y-314} L${x+17},${y-298} Z" fill="#1F2230"/><path d="M${x-15},${y-301} L${x},${y-316} L${x+15},${y-301} Q${x},${y-305} ${x-15},${y-301}Z" fill="#F4F6F8"/>
 <circle cx="${x}" cy="${y-280}" r="${night?70:40}" fill="url(#${night?'glowStrong':'glow'})"/>`;
}
function snowGround(y,night){ return `<path d="M0,${y} Q240,${y-12} 480,${y-4} T960,${y-8} V540 H0 Z" fill="url(#${night?'snowNight':'snowG'})"/>`; }
function mapleTree(x,y,s){
 return `<g transform="translate(${x} ${y}) scale(${s})">${shadow(0,2,30,5,.22,'blurS')}
 <path d="M-6,0 L-4,-90 L-20,-140 M-4,-90 L10,-150 M-4,-60 L-30,-96 M4,-70 L26,-110 M-14,-120 L-26,-150 M10,-150 L2,-176" stroke="url(#trunk)" stroke-width="8" stroke-linecap="round" fill="none"/>
 <path d="M-7,0 L-5,-92 L5,-92 L7,0 Z" fill="url(#trunk)"/>
 <path d="M-30,-96 q4,-3 8,0 M26,-110 q-4,-3 -8,0 M-20,-140 q4,-3 8,0 M10,-150 q4,-3 8,0" stroke="#F4F6F8" stroke-width="3" stroke-linecap="round" fill="none"/>
 <path d="M-4,-150 L2,-176" stroke="#F4F6F8" stroke-width="2" opacity=".7"/></g>`;
}
function bucket(x,y){ /* sap bucket on a tree */
 return `<g transform="translate(${x} ${y})"><path d="M-7,0 L7,0 L6,14 L-6,14 Z" fill="url(#metal)"/><path d="M-8,0 Q0,-4 8,0" fill="#C9D2DA"/><path d="M-8,-2 L8,-2 L4,-7 L-4,-7Z" fill="#7C8792"/><rect x="-1" y="-10" width="2" height="5" fill="#5E6772"/></g>`;
}
