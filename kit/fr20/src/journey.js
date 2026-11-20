/* ===== The connected journey: order of stops, shared by the hub and the games. ===== */
const JOURNEY=[
 {id:'quebec',     place:'Québec',     sub:'Le Carnaval',          code:'YQB', file:'01-quebec.html',     ready:true,  color:'#9B2F2F'},
 {id:'montreal',   place:'Montréal',   sub:'Le métro',             code:'YUL', file:'02-montreal.html',   ready:true , color:'#2C5E67'},
 {id:'acadie',     place:'Acadie',     sub:'Le Tintamarre',        code:'YQM', file:'03-acadie.html',     ready:false, color:'#2F4F86'},
 {id:'dakar',      place:'Dakar',      sub:'La famille d\'accueil',code:'DSS', file:'04-dakar.html',      ready:false, color:'#B36A1F'},
 {id:'bretagne',   place:'Bretagne',   sub:'Le lycée',             code:'RNS', file:'05-bretagne.html',   ready:false, color:'#1F5F7A'},
 {id:'bruxelles',  place:'Bruxelles',  sub:'Le job d\'été',        code:'BRU', file:'06-bruxelles.html',  ready:false, color:'#7A5B1F'},
 {id:'martinique', place:'Martinique', sub:'La montagne Pelée',    code:'FDF', file:'07-martinique.html', ready:false, color:'#2E7A55'},
 {id:'louisiane',  place:'Louisiane',  sub:'Le concours d\'histoires', code:'LFT', file:'08-louisiane.html', ready:false, color:'#6E3F7A'}
];
function stampIcon(id,c){
 const s=`fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
 switch(id){
  case 'quebec': return `<g ${s}><path d="M-14,10 V-2 H14 V10"/><path d="M-6,-2 V-8 H6 V-2"/><path d="M-8,-8 L0,-18 L8,-8"/><path d="M-16,-2 L-11,-10 L-6,-2 M6,-2 L11,-10 L16,-2"/></g>`;
  case 'montreal': return `<g ${s}><rect x="-14" y="-12" width="28" height="20" rx="6"/><path d="M-14,-2 H14 M-8,8 L-11,14 M8,8 L11,14"/><circle cx="-7" cy="3" r="1.5"/><circle cx="7" cy="3" r="1.5"/></g>`;
  case 'acadie': return `<g ${s}><path d="M0,-15 L4,-4 L15,-4 L6,3 L9,14 L0,7 L-9,14 L-6,3 L-15,-4 L-4,-4 Z"/></g>`;
  case 'dakar': return `<g ${s}><path d="M-3,14 L-4,-2 M3,14 L4,-2 M-4,-2 C-10,-4 -14,-8 -14,-12 M4,-2 C10,-4 14,-8 14,-12 M0,-2 V-14"/><path d="M-16,-12 Q-10,-18 -4,-12 Q2,-20 8,-12 Q14,-18 18,-12"/></g>`;
  case 'bretagne': return `<g ${s}><path d="M-6,14 L-4,-8 H4 L6,14 Z M-6,-8 H6 L4,-14 H-4 Z M-4,2 H4"/><path d="M-12,-14 L-18,-17 M12,-14 L18,-17"/></g>`;
  case 'bruxelles': return `<g ${s}><path d="M-9,-2 L0,15 L9,-2 Z"/><path d="M-7,-2 L-8,-14 M-3,-2 L-3,-16 M2,-2 L3,-15 M6,-2 L8,-12"/></g>`;
  case 'martinique': return `<g ${s}><path d="M-16,12 L-5,-6 L0,-2 L5,-8 L16,12 Z"/><path d="M-2,-10 C-2,-14 2,-14 2,-17"/></g>`;
  case 'louisiane': return `<g ${s}><rect x="-14" y="-10" width="28" height="18" rx="2"/><path d="M-6,-10 V8 M0,-10 V8 M6,-10 V8"/><path d="M-14,-4 H-18 M14,-4 H18"/></g>`;
 }
 return '';
}
function stampSVG(stop, state, dateTxt){
 const c = state==='done'? stop.color : '#9AA3AE';
 const rot = state==='done'? (stop.place.length*7%13-6) : 0;
 return `<svg viewBox="-60 -60 120 120" role="img" aria-label="${stop.place}${state==='done'?', visité':''}">
  <g transform="rotate(${rot})" opacity="${state==='locked'?.55:1}">
  <circle r="52" fill="none" stroke="${c}" stroke-width="${state==='done'?3:2}" ${state==='done'?'':'stroke-dasharray="5 5"'}/>
  <g transform="translate(0 -14)">${stampIcon(stop.id,c)}</g>
  <text y="20" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="${Math.min(13,104/stop.place.length)}" fill="${c}">${stop.place.toUpperCase()}</text>
  <text y="33" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="600" font-size="7.5" letter-spacing=".8" fill="${c}">${state==='done'?(dateTxt||'VISITÉ'):state==='next'?'PROCHAINE':'À VENIR'}</text>
  </g></svg>`;
}
function nextStop(p){ return JOURNEY.find(s=>!(p&&p.done&&p.done[s.id])) || null; }
