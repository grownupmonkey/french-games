/* ===== L'enquête: shared scenery pieces and room gradients (advDefs). Light from the top left. ===== */
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
  +`<radialGradient id="moonGlow"><stop offset="0" stop-color="#DCE6F6" stop-opacity=".5"/><stop offset="1" stop-color="#DCE6F6" stop-opacity="0"/></radialGradient>`
  +advDefs2();
 return `<svg class="svgdefs" aria-hidden="true" focusable="false"><defs>${d}</defs></svg>`; }


/* ---------- station and street gradients (added to the defs at build time) ---------- */
function advDefs2(){ const lg=(id,stops,x2=1,y2=0)=>`<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map((c,i)=>`<stop offset="${(i/(stops.length-1)).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
 return lg('stWall',['#A3AE97','#8C977F','#737D68','#646D5A'])+lg('stLow',['#6A755E','#5A644F','#4A5241'])+lg('stCeil',['#2E3438','#252A2E'],0,1)
  +lg('linoShade',['#FFF7E0','#000000'])+lg('linoDepth',['#000000','#000000'],0,1)
  +lg('deskTop',['#C79A6B','#A97C50'])+lg('deskFront',['#8A5F3B','#6A4529','#4E3220'])+lg('cabMetal',['#A9B0B6','#8A9299','#6B737A'])
  +lg('cork',['#C99B66','#A97A48'])+lg('board',['#FBFBF6','#E6E8E2'])+lg('screen',['#3E8FD6','#1E4E86'],0,1)+lg('screenGreen',['#4E9A5A','#2E6A3A'],0,1)
  +lg('city',['#121B33','#24345A','#3E5280'],0,1)+lg('blind',['#E8E2D2','#B9B19C'])+lg('doorWood',['#9A6E48','#7A5233','#5A3A20'])+lg('doorMetal',['#8E979E','#6E777E','#555D63'])
  +lg('counterTopG',['#D9D4C8','#B9B3A6'],0,1)+lg('counterFrontG',['#7E8A92','#636E76','#4C565D'])+lg('steel',['#E3E7EA','#B5BCC2','#878F96'])
  +lg('brickWall',['#7E4A3A','#6A3C2F','#552E24'])+lg('asphalt',['#3A3E44','#2A2D32','#1E2125'],0,1)+lg('concrete',['#8C8A84','#706E68'],0,1)
  +lg('carBody',['#E9ECEF','#C3C9CE','#8E969D'],0,1)+lg('carBlue',['#3F5E9A','#2A4372','#1A2C4E'],0,1)+lg('glassDark',['#3A4A5E','#1A2433'],1,1)
  +lg('sodium',['#FFC870','#FFC870'])+lg('house',['#C9B79A','#A99678'])+lg('roofDark',['#3A3A44','#24242C'])
  +`<radialGradient id="sodiumPool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFB45A" stop-opacity=".42"/><stop offset="1" stop-color="#FFB45A" stop-opacity="0"/></radialGradient>`
  +`<radialGradient id="lampPool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE2A0" stop-opacity=".55"/><stop offset="1" stop-color="#FFE2A0" stop-opacity="0"/></radialGradient>`
  +`<radialGradient id="fluoGlow" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#F4F8E8" stop-opacity=".35"/><stop offset="1" stop-color="#F4F8E8" stop-opacity="0"/></radialGradient>`
  +`<radialGradient id="screenGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#7FB8F0" stop-opacity=".35"/><stop offset="1" stop-color="#7FB8F0" stop-opacity="0"/></radialGradient>`
  +`<linearGradient id="vigTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".25" stop-color="#000" stop-opacity="0"/></linearGradient>`
  +`<pattern id="brickP" width="40" height="20" patternUnits="userSpaceOnUse"><rect width="40" height="20" fill="none"/><path d="M0,20 H40 M0,10 H40 M20,0 V10 M0,10 V20 M40,10 V20" stroke="#3A2018" stroke-width="1.4" opacity=".45" fill="none"/></pattern>`
  +`<pattern id="slats" width="10" height="9" patternUnits="userSpaceOnUse"><rect width="10" height="9" fill="url(#blind)"/><rect y="7.4" width="10" height="1.6" fill="#7A725E" opacity=".55"/></pattern>`;
}

/* ---------- interior shell: back wall, painted lower band, fluorescent ceiling, linoleum floor ---------- */
function linoFloor(y0,y1,cols,c1,c2){ const rows=[y0,452,460,470,482,497,515,537,563,594,630,672,720,776,800].filter(y=>y>=y0&&y<=y1);
 const X=(x,y)=>VP[0]+(x-VP[0])*(y-VP[1])/(y0-VP[1]); let q='';
 for(let r=0;r<rows.length-1;r++){ const ya=rows[r], yb=rows[r+1];
  for(let i=0,x=-1000;x<2280;x+=cols,i++){ const p=[[X(x,ya),ya],[X(x+cols,ya),ya],[X(x+cols,yb),yb],[X(x,yb),yb]].map(v=>v[0].toFixed(1)+','+v[1]).join(' ');
   q+=`<polygon points="${p}" fill="${(i+r)%2?c1:c2}"/>`; } }
 return `<g>${q}</g><rect y="${y0}" width="1280" height="${y1-y0}" fill="url(#linoShade)" opacity=".24"/><rect y="${y0}" width="1280" height="34" fill="#000" opacity=".18"/>`; }
function interior(o={}){ const low=o.low!==false;
 return `<rect width="1280" height="446" fill="url(#${o.wall||'stWall'})"/>
  ${low?`<rect y="350" width="1280" height="96" fill="url(#stLow)"/><rect y="344" width="1280" height="8" fill="#8A9578"/><rect y="351" width="1280" height="2" fill="#2E3428" opacity=".5"/>`:''}
  <rect y="436" width="1280" height="12" fill="#2A2E26"/><rect y="436" width="1280" height="2" fill="#7A846C" opacity=".6"/>
  <rect width="1280" height="48" fill="url(#stCeil)"/><rect y="48" width="1280" height="6" fill="#4A5248"/><rect y="48" width="1280" height="2" fill="#8C9688"/>
  ${(o.fluo||[260,640,1020]).map(x=>`<rect x="${x-90}" y="14" width="180" height="16" rx="2" fill="#C9CEC2"/><rect x="${x-84}" y="17" width="168" height="10" rx="2" fill="#F6F9EC"/><ellipse cx="${x}" cy="60" rx="230" ry="120" fill="url(#fluoGlow)"/>`).join('')}
  ${linoFloor(446,800,o.tile||56,o.c1||'#ADA690',o.c2||'#9D9681')}`; }
/* a night window with half-open blinds and city lights */
function nightWindow(x,y,w,h,seed){ let s=seed||3; const r=()=>(s=(s*9301+49297)%233280)/233280; let lights='';
 for(let i=0;i<26;i++){ const lx=x+8+r()*(w-16), ly=y+h*.45+r()*(h*.5); lights+=`<rect x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" width="${(2+r()*3).toFixed(1)}" height="${(2+r()*3).toFixed(1)}" fill="${r()>.5?'#FFD98A':'#F4F1E4'}" opacity="${(.5+r()*.5).toFixed(2)}"/>`; }
 const sk=h*.42;
 return `<g>${shadow(x+w/2,y+h+8,w*.55,5,.25,'blurS')}<rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+20}" fill="#E4E0D4"/><rect x="${x-10}" y="${y-10}" width="${w+20}" height="${h+20}" fill="none" stroke="#9C9686" stroke-width="2"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#city)"/>
  <g fill="#0C1224"><rect x="${x+w*.05}" y="${y+h*.5}" width="${w*.18}" height="${h*.5}"/><rect x="${x+w*.27}" y="${y+h*.38}" width="${w*.14}" height="${h*.62}"/><rect x="${x+w*.46}" y="${y+h*.58}" width="${w*.22}" height="${h*.42}"/><rect x="${x+w*.72}" y="${y+h*.44}" width="${w*.2}" height="${h*.56}"/></g>
  ${lights}
  <rect x="${x}" y="${y}" width="${w}" height="${sk}" fill="url(#slats)"/><rect x="${x}" y="${y+sk-3}" width="${w}" height="5" fill="#9C947E"/>
  <path d="M${x+w/2},${y} V${y+h}" stroke="#E4E0D4" stroke-width="5"/><path d="M${x+w*.8},${y+sk} v${h*.3}" stroke="#D9D1BC" stroke-width="1.2"/>
  <rect x="${x-14}" y="${y+h+8}" width="${w+28}" height="9" fill="#D2CCBE"/><rect x="${x-14}" y="${y+h+8}" width="${w+28}" height="2" fill="#F4F1E8"/></g>`; }
/* a door in the back wall with a label plate */
function door(x,y,w,h,o={}){ const fill=o.metal?'url(#doorMetal)':'url(#doorWood)';
 return `<g><rect x="${x-9}" y="${y-9}" width="${w+18}" height="${h+9}" fill="#3A3226"/><rect x="${x-9}" y="${y-9}" width="${w+18}" height="4" fill="#7A6A52"/>
  ${o.open?`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#141A1E"/><path d="M${x},${y+h} L${x+w*.25},${y+h*.55} L${x+w*.75},${y+h*.55} L${x+w},${y+h} Z" fill="#242C32" opacity=".7"/>`
   :`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/><rect x="${x+w-10}" y="${y}" width="10" height="${h}" fill="#000" opacity=".15"/>
   ${o.glass?`<rect x="${x+w*.2}" y="${y+18}" width="${w*.6}" height="${h*.28}" fill="url(#glassDark)"/><path d="M${x+w*.22},${y+22} l${w*.2},0 l${-w*.18},${h*.24}z" fill="#fff" opacity=".12"/>`:`<rect x="${x+12}" y="${y+16}" width="${w-24}" height="${h*.38}" fill="none" stroke="#000" stroke-width="1.5" opacity=".18"/><rect x="${x+12}" y="${y+h*.5}" width="${w-24}" height="${h*.42}" fill="none" stroke="#000" stroke-width="1.5" opacity=".18"/>`}
   <rect x="${x+w-22}" y="${y+h*.52}" width="12" height="5" rx="2" fill="url(#steel)"/>`}
  ${o.label?`<rect x="${x+w/2-62}" y="${y-38}" width="124" height="22" rx="3" fill="#1F2A3A"/><text x="${x+w/2}" y="${y-22}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="12" letter-spacing="1.6" fill="#E8EEF6">${o.label}</text>`:''}</g>`; }
/* an office desk seen from the front; base on y+h */
function desk(x,y,w,h){ return `<g>${shadow(x+w/2,y+h+2,w*.56,9,.4)}
  <rect x="${x+8}" y="${y+18}" width="${w-16}" height="${h-18}" fill="url(#deskFront)"/>
  <rect x="${x+w-112}" y="${y+24}" width="96" height="${h-30}" fill="#000" opacity=".1"/>
  ${[0,1,2].map(i=>`<rect x="${x+w-104}" y="${y+30+i*((h-40)/3)}" width="80" height="${(h-40)/3-8}" rx="2" fill="none" stroke="#2E1E12" stroke-width="1.6" opacity=".5"/><rect x="${x+w-72}" y="${y+30+i*((h-40)/3)+((h-40)/3-8)/2-2}" width="16" height="4" rx="2" fill="url(#steel)"/>`).join('')}
  <polygon points="${x+6},${y} ${x+w-6},${y} ${x+w},${y+16} ${x},${y+16}" fill="url(#deskTop)"/><rect x="${x}" y="${y+16}" width="${w}" height="5" fill="#6E4A2C"/>
  <path d="M${x+12},${y+3} H${x+w*.45}" stroke="#F0D2A8" stroke-width="1.6" opacity=".5"/></g>`; }
function chairBack(x,y,s){ return `<g transform="translate(${x} ${y}) scale(${s||1})">${shadow(0,2,30,6,.35,'blurS')}<path d="M-4,0 v-40 M4,0 v-40" stroke="#22262C" stroke-width="4"/><path d="M-24,2 l24,-6 l24,6" stroke="#22262C" stroke-width="4" fill="none"/>
  <rect x="-28" y="-60" width="56" height="16" rx="6" fill="#3A404C"/><rect x="-24" y="-118" width="48" height="58" rx="10" fill="#4A5160"/><rect x="-24" y="-118" width="14" height="58" rx="7" fill="#5E6676"/></g>`; }
function cabinet(x,y,w,h){ return `<g>${shadow(x+w/2,y+h+1,w*.6,6,.35,'blurS')}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#cabMetal)"/>
  ${[0,1,2,3].map(i=>`<rect x="${x+6}" y="${y+6+i*(h-12)/4}" width="${w-12}" height="${(h-12)/4-6}" rx="2" fill="none" stroke="#4A5258" stroke-width="1.4"/><rect x="${x+w/2-10}" y="${y+12+i*(h-12)/4}" width="20" height="5" rx="2" fill="#3A4046"/><rect x="${x+w/2-9}" y="${y+22+i*(h-12)/4}" width="18" height="8" fill="#F4F1E4"/>`).join('')}
  <rect x="${x}" y="${y}" width="5" height="${h}" fill="#fff" opacity=".18"/></g>`; }
function mug(x,y,c){ return `<g>${shadow(x,y+1,8,2.2,.35,'blurS')}<path d="M${x-6},${y-14} h12 l-1,14 h-10 z" fill="${c||'#F4F1E8'}"/><path d="M${x+2},${y-14} h4 l-1,14 h-3 z" fill="#000" opacity=".15"/><path d="M${x+6},${y-11} q5,1 4,5 q-1,3 -5,3" stroke="${c||'#F4F1E8'}" stroke-width="2" fill="none"/><ellipse cx="${x}" cy="${y-14}" rx="6" ry="1.6" fill="#3B1E0C"/><ellipse cx="${x-2}" cy="${y-14.4}" rx="2" ry=".5" fill="#fff" opacity=".4"/></g>`; }
function papers(x,y){ return `<g>${shadow(x+14,y+1,18,2,.25,'blurS')}<polygon points="${x},${y} ${x+28},${y} ${x+32},${y-6} ${x+4},${y-6}" fill="#F7F4EC"/><polygon points="${x+3},${y-2} ${x+30},${y-2} ${x+33},${y-8} ${x+6},${y-8}" fill="#FFFDF6"/><path d="M${x+9},${y-5} h16" stroke="#9AA3AE" stroke-width=".8"/></g>`; }
function deskLamp(x,y){ return `<g>${shadow(x,y+1,14,3,.35,'blurS')}<ellipse cx="${x}" cy="${y-2}" rx="12" ry="4" fill="#2A3A30"/><path d="M${x},${y-4} L${x+8},${y-40} L${x-14},${y-58}" stroke="#2A3A30" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <path d="M${x-28},${y-48} L${x-4},${y-68} L${x+6},${y-58} L${x-14},${y-38} Z" fill="#2E5A44"/><path d="M${x-26},${y-46} L${x-12},${y-36}" stroke="#FFE8B0" stroke-width="3" stroke-linecap="round"/></g>`; }
function monitor(x,y,fill,glow){ return `<g>${shadow(x,y+1,22,3,.35,'blurS')}<rect x="${x-10}" y="${y-8}" width="20" height="8" fill="#2A2E36"/><rect x="${x-3}" y="${y-18}" width="6" height="12" fill="#2A2E36"/>
  <rect x="${x-36}" y="${y-66}" width="72" height="50" rx="3" fill="#1E2128"/><rect x="${x-32}" y="${y-62}" width="64" height="42" fill="${fill||'url(#screen)'}"/><path d="M${x-30},${y-60} l22,0 l-22,22z" fill="#fff" opacity=".12"/>
  ${glow!==false?`<ellipse cx="${x}" cy="${y-40}" rx="60" ry="40" fill="url(#screenGlow)"/>`:''}</g>`; }
function phone(x,y){ return `<g>${shadow(x,y+1,14,3,.35,'blurS')}<path d="M${x-14},${y} l3,-10 h22 l3,10 z" fill="#2A2E36"/><path d="M${x-16},${y-12} q16,-8 32,0 l-2,4 q-14,-6 -28,0 z" fill="#3A3F48"/><rect x="${x-6}" y="${y-8}" width="12" height="5" fill="#9AE07A" opacity=".8"/></g>`; }
function wallClock(x,y,h,m){ const a=(h%12+m/60)/12*Math.PI*2, b=m/60*Math.PI*2;
 return `<g>${shadow(x+3,y+4,18,18,.25,'blurS')}<circle cx="${x}" cy="${y}" r="20" fill="#F7F4EC" stroke="#2A2E36" stroke-width="3"/><path d="M${x},${y} L${x+Math.sin(a)*10},${y-Math.cos(a)*10} M${x},${y} L${x+Math.sin(b)*15},${y-Math.cos(b)*15}" stroke="#1A1D24" stroke-width="2" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="1.8" fill="#9B2F2F"/></g>`; }
function counter(x,y,w,h){ return `<g>${shadow(x+w/2,y+h+2,w*.52,10,.4)}<rect x="${x}" y="${y+14}" width="${w}" height="${h-14}" fill="url(#counterFrontG)"/>
  ${Array.from({length:Math.floor(w/120)},(_,i)=>`<rect x="${x+14+i*120}" y="${y+28}" width="96" height="${h-42}" rx="2" fill="none" stroke="#2E363C" stroke-width="1.5" opacity=".5"/>`).join('')}
  <polygon points="${x+4},${y} ${x+w-4},${y} ${x+w+6},${y+14} ${x-6},${y+14}" fill="url(#counterTopG)"/><rect x="${x-6}" y="${y+14}" width="${w+12}" height="5" fill="#5A646B"/>
  <path d="M${x+10},${y+3} H${x+w*.4}" stroke="#fff" stroke-width="1.6" opacity=".5"/></g>`; }
function poster(x,y,w,h,inner){ return `<g>${shadow(x+w/2+3,y+h+4,w*.45,4,.2,'blurS')}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FFFDF6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#B9B19C" stroke-width="1.5"/>${inner||''}<circle cx="${x+w/2}" cy="${y+5}" r="2.4" fill="#B8443A"/></g>`; }
function txt(x,y,s,size,o={}){ return `<text x="${x}" y="${y}" ${o.mid?'text-anchor="middle"':''} font-family="${o.serif?'Fraunces,Georgia,serif':'Inter,system-ui,sans-serif'}" font-weight="${o.w||700}" font-size="${size}" ${o.ls?`letter-spacing="${o.ls}"`:''} fill="${o.fill||'#1F2433'}">${s}</text>`; }
