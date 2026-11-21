/* ===== L'enquête: articulated actors, icons and cursors. Same palette and light (top left) as art.js. ===== */
/* actorSVG(o, view, phase): o is a person() look; view 'front'|'back'|'side' (side faces right; mirror for left);
   phase 0..1 walk cycle, or null when standing. Feet at (0,0), about 232 tall. No shadow (the engine draws it). */
function actorSVG(o, view, phase){
 const sk=SKIN[o.skin||0], skinG=`url(#skin${o.skin||0})`, h=o.hair||'#3A2418', style=o.style||'short';
 const C=COATS[o.coat||'trench'], coatG=`url(#coat-${o.coat||'trench'})`;
 const pants=o.pants||'url(#pantsDark)', glove=o.glove||sk.m;
 const walking = phase!=null, s = walking ? Math.sin(phase*2*Math.PI) : 0;
 const bob = walking ? -Math.abs(Math.cos(phase*2*Math.PI))*2.4+1.2 : 0;
 const trench = (o.coat||'trench')==='trench';
 const belt = trench ? `<path d="M-24,-128 Q0,-124 24,-128 L24.4,-121 Q0,-117 -24.4,-121 Z" fill="${C[2]}"/><rect x="-4" y="-129" width="8" height="9" rx="1.5" fill="none" stroke="#3A2E1E" stroke-width="1.4"/>` : '';
 const lapels = trench ? `<path d="M-14,-176 L-4,-150 L0,-170 Z" fill="${C[1]}"/><path d="M14,-176 L4,-150 L0,-170 Z" fill="${C[2]}"/><g fill="#3A2E1E" opacity=".75"><circle cx="-6" cy="-142" r="1.6"/><circle cx="-6" cy="-108" r="1.6"/><circle cx="6" cy="-142" r="1.6"/><circle cx="6" cy="-108" r="1.6"/></g>` : '';
 const boot=(x,flip)=>`<path d="M${x-7},-22 H${x+7} C${x+9},-20 ${x+10},-16 ${x+10},-12 C${x+11},-8 ${x+11},-4 ${x+10},0 H${x-10} C${x-11},-6 ${x-10},-12 ${x-8},-16 Z" fill="url(#boot)"/><rect x="${x-10.5}" y="-2" width="21" height="3" rx="1" fill="#1E140C"/>`;
 if(view==='side'){
  const a = s*24;               // near leg angle (negative = forward for a right-facing actor)
  const leg=(ang,dark)=>`<g transform="rotate(${-ang} 0 -98)"><rect x="-6.5" y="-100" width="13" height="80" rx="5" fill="${pants}"/>${dark?'':`<rect x="2" y="-98" width="4.5" height="76" rx="2" fill="#000" opacity=".2"/>`}
    <path d="M-7,-22 H6 C8,-20 10,-16 12,-12 C16,-9 18,-5 18,0 H-8 C-9,-8 -9,-16 -7,-22 Z" fill="url(#boot)"/><rect x="-8.5" y="-2" width="27" height="3" rx="1" fill="#1E140C"/>
    ${dark?`<rect x="-9" y="-100" width="28" height="104" fill="#0B0F1C" opacity=".28"/>`:''}</g>`;
  const arm=(ang,dark)=>`<g transform="rotate(${ang} 1 -166)"><path d="M-6,-170 C-8,-150 -8,-128 -6,-104 C-3,-100 3,-100 6,-104 C8,-128 8,-150 7,-170 Z" fill="${dark?C[2]:C[1]}"/>
    ${dark?'':`<path d="M-4,-160 C-5,-140 -5,-124 -4,-108" stroke="#fff" stroke-width="1.6" opacity=".14" fill="none" stroke-linecap="round"/>`}
    <ellipse cx="0" cy="-100" rx="5" ry="6" fill="${dark?sk.d:glove}"/></g>`;
  let hairBack, hairFront;
  if(style==='long') hairBack=`<path d="M-13,-212 C-17,-196 -18,-176 -16,-158 C-10,-155 -2,-156 2,-160 C0,-176 -1,-192 2,-206 Z" fill="${h}"/>`;
  else if(style==='mid') hairBack=`<path d="M-13,-212 C-16,-198 -16,-186 -14,-176 C-8,-174 -2,-175 1,-178 C0,-188 0,-198 2,-206 Z" fill="${h}"/>`;
  else hairBack=`<path d="M-12.5,-210 C-14,-200 -14,-194 -12,-188 L-2,-188 C-1,-196 0,-202 2,-206 Z" fill="${h}"/>`;
  hairFront=`<path d="M-12,-204 C-13,-213 -5,-216 2,-216 C9,-216 14,-212 14.5,-205 C9,-208 4,-208 0,-205 C-3,-202 -8,-200 -12,-204 Z" fill="${h}"/>`;
  return `<g transform="translate(0 ${bob.toFixed(2)})">
   ${hairBack}${leg(-a,true)}${arm(-a,true)}
   <path d="M-13,-174 C-4,-178 8,-178 15,-174 L19,-94 C6,-90 -8,-90 -17,-94 Z" fill="${coatG}"/>
   <path d="M-14,-150 C-16,-130 -16,-112 -15,-98" stroke="#fff" stroke-width="1.8" opacity=".13" fill="none" stroke-linecap="round"/>
   ${trench?`<path d="M-15,-128 Q2,-124 17,-128 L17.3,-121 Q2,-117 -15.3,-121 Z" fill="${C[2]}"/><path d="M6,-176 L12,-150" stroke="${C[2]}" stroke-width="1.5" opacity=".7"/>`:''}
   ${leg(a,false)}
   <rect x="-3" y="-188" width="9" height="12" fill="${sk.d}"/>
   <path d="M-11,-176 C-4,-171 7,-171 13,-176 C10,-182 -8,-182 -11,-176 Z" fill="${o.collar||C[1]}"/>
   <ellipse cx="2" cy="-200" rx="12" ry="15" fill="${skinG}"/>
   <path d="M12.6,-203 C15,-200 16.4,-196 15.4,-194.4 C14.6,-193.6 13.2,-193.8 12.6,-194" fill="${sk.m}"/>
   <ellipse cx="-3" cy="-199" rx="2.2" ry="3.4" fill="${sk.d}"/>
   <path d="M5.6,-204.6 Q8.4,-206 11,-204.6" stroke="${o.brow||h}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
   <ellipse cx="8.6" cy="-200.4" rx="1.4" ry="1.9" fill="#1F2433"/><circle cx="9" cy="-201" r=".5" fill="#fff"/>
   <path d="M8.2,-189.6 Q10.4,-188.6 12,-189.8" stroke="#7A3E30" stroke-width="1.3" fill="none" stroke-linecap="round"/>
   ${o.glasses?`<g fill="none" stroke="#2A2A30" stroke-width="1"><circle cx="8.6" cy="-200.4" r="3.6"/><path d="M5,-201 L-2,-202"/></g>`:''}
   ${hairFront}${o.cap?capSide():''}
   ${arm(a*0.85,false)}
  </g>`;
 }
 /* front and back */
 const lift=(v)=>Math.max(0,v)*7;
 const lL=lift(s), lR=lift(-s), aw=s*9;
 const legF=(x,l,shade)=>`<rect x="${x}" y="-98" width="11.5" height="${88-l}" rx="5" fill="${pants}"/>${shade?`<rect x="${x+6.5}" y="-96" width="5" height="${84-l}" rx="2.5" fill="#000" opacity=".22"/>`:''}<g transform="translate(0 ${-l})">${boot(x+5.75)}</g>`;
 const armL=`<g transform="rotate(${aw} -20 -168)"><path d="M-19,-170 C-29,-166 -31,-150 -30,-128 L-29,-104 C-26,-100 -22,-100 -20,-104 L-18,-150 Z" fill="${C[0]}"/><ellipse cx="-24.5" cy="-100" rx="5" ry="6" fill="${glove}"/></g>`;
 const armR=`<g transform="rotate(${-aw} 20 -168)"><path d="M19,-170 C29,-166 31,-150 30,-128 L29,-104 C26,-100 22,-100 20,-104 L18,-150 Z" fill="${C[2]}"/><ellipse cx="24.5" cy="-100" rx="5" ry="6" fill="${view==='back'?sk.d:glove}"/></g>`;
 const coat=`<path d="M-21,-172 C-8,-177 8,-177 21,-172 L26,-96 C10,-91 -10,-91 -26,-96 Z" fill="${coatG}"/>
   <path d="M-20,-150 C-22,-130 -22,-115 -21,-100" stroke="#fff" stroke-width="2" opacity=".15" fill="none" stroke-linecap="round"/>`;
 if(view==='back'){
  let hb;
  if(style==='long') hb=`<path d="M-14.5,-210 C-19,-192 -20,-176 -18,-158 C-10,-153 10,-153 18,-158 C20,-176 19,-192 14.5,-210 C10,-216 -10,-216 -14.5,-210 Z" fill="${h}"/>`;
  else if(style==='mid') hb=`<path d="M-14.5,-210 C-17,-196 -17,-184 -15,-174 C-8,-171 8,-171 15,-174 C17,-184 17,-196 14.5,-210 C10,-216 -10,-216 -14.5,-210 Z" fill="${h}"/>`;
  else hb=`<path d="M-13.5,-206 C-13.5,-214 -6,-216 0,-216 C6,-216 13.5,-214 13.5,-206 C14,-198 13,-192 11,-188 C4,-186 -4,-186 -11,-188 C-13,-192 -14,-198 -13.5,-206 Z" fill="${h}"/>`;
  return `<g transform="translate(0 ${bob.toFixed(2)})">
   ${legF(-13,lL,false)}${legF(1.5,lR,true)}
   ${armL}${armR}${coat}
   <path d="M0,-170 V-96" stroke="#000" stroke-width="1.2" opacity=".28"/>
   ${trench?`<path d="M-24,-128 Q0,-124 24,-128 L24.4,-121 Q0,-117 -24.4,-121 Z" fill="${C[2]}"/><path d="M-18,-170 Q0,-160 18,-170 L19,-158 Q0,-150 -19,-158 Z" fill="${C[1]}" opacity=".8"/>`:''}
   <rect x="-5" y="-188" width="10" height="12" fill="${sk.d}"/>
   <path d="M-15,-176 C-8,-170 8,-170 15,-176 C12,-183 -12,-183 -15,-176 Z" fill="${o.collar||C[1]}"/>
   <ellipse cx="0" cy="-200" rx="12.5" ry="15" fill="${skinG}"/>
   <ellipse cx="-12.2" cy="-199" rx="2" ry="3.2" fill="${sk.d}"/><ellipse cx="12.2" cy="-199" rx="2" ry="3.2" fill="${sk.d}"/>
   ${hb}${o.cap?capBack():''}
  </g>`;
 }
 let hairBack='';
 if(style==='long') hairBack=`<path d="M-15,-206 C-19,-190 -20,-176 -18,-160 C-10,-156 10,-156 18,-160 C20,-176 19,-190 15,-206 Z" fill="${h}"/><path d="M8,-200 C14,-186 16,-172 16,-160 L18,-160 C20,-176 19,-190 15,-206 Z" fill="#000" opacity=".2"/>`;
 else if(style==='mid') hairBack=`<path d="M-15,-206 C-17,-195 -17,-184 -15,-176 C-8,-173 8,-173 15,-176 C17,-184 17,-195 15,-206 Z" fill="${h}"/><path d="M9,-200 C13,-192 14,-182 13,-176 L15,-176 C17,-184 17,-195 15,-206 Z" fill="#000" opacity=".2"/>`;
 else hairBack=`<path d="M-13.5,-206 C-14.5,-198 -14,-192 -13,-189 L13,-189 C14,-192 14.5,-198 13.5,-206 Z" fill="${h}"/>`;
 const top = style==='short'
  ? `<path d="M-13,-203 C-14,-212 -6,-216 0,-216 C6,-216 14,-212 13,-203 C9,-207 -5,-208 -13,-203 Z" fill="${h}"/>`
  : `<path d="M-12.8,-202 C-14,-213 -6,-216 0,-216 C6,-216 14,-213 12.8,-202 C8,-207 -4,-208 -12.8,-202 Z" fill="${h}"/>`;
 return `<g transform="translate(0 ${bob.toFixed(2)})">
  ${hairBack}${legF(-13,lL,false)}${legF(1.5,lR,true)}
  ${armL}${coat}
  <path d="M0,-174 V-93" stroke="#000" stroke-width="1.2" opacity=".35"/>
  ${lapels}${belt}${o.badge?badgeChest():''}${armR}
  <rect x="-5" y="-188" width="10" height="12" fill="${sk.d}"/>
  <path d="M-15,-176 C-8,-170 8,-170 15,-176 C12,-182 -12,-182 -15,-176 Z" fill="${o.collar||'#E9E3D8'}"/>
  <ellipse cx="0" cy="-200" rx="12.5" ry="15" fill="${skinG}"/>
  <ellipse cx="-12.2" cy="-199" rx="2" ry="3.2" fill="${sk.d}"/>
  <path d="M-8.5,-204.5 Q-5.5,-206 -2.5,-204.8 M2.5,-204.8 Q5.5,-206 8.5,-204.5" stroke="${o.brow||h}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <ellipse cx="-5.2" cy="-200.5" rx="1.5" ry="1.9" fill="#1F2433"/><ellipse cx="5.2" cy="-200.5" rx="1.5" ry="1.9" fill="#1F2433"/>
  <circle cx="-4.7" cy="-201.1" r=".5" fill="#fff"/><circle cx="5.7" cy="-201.1" r=".5" fill="#fff"/>
  <path d="M0.5,-199 L1.8,-194.2 L-0.4,-193.7" stroke="${sk.d}" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-3.2,-189.6 Q0,-187.2 3.2,-189.6" stroke="#7A3E30" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  ${o.mustache?`<path d="M-5,-191.5 Q0,-194 5,-191.5 Q0,-190 -5,-191.5Z" fill="${h}"/>`:''}
  ${o.glasses?`<g fill="none" stroke="#2A2A30" stroke-width="1"><circle cx="-5.2" cy="-200.5" r="3.6"/><circle cx="5.2" cy="-200.5" r="3.6"/><path d="M-1.6,-200.8 h3.2"/></g>`:''}
  ${top}${o.cap?capFront():''}
 </g>`;
}
/* invented generic police cap and badge: a plain gold oval with a star-free chevron, no real insignia */
function capFront(){ return `<path d="M-15,-207 C-15,-218 -8,-223 0,-223 C8,-223 15,-218 15,-207 Z" fill="url(#coat-police)"/>
 <path d="M-17,-210 C-10,-214 10,-214 17,-210 L16,-205 C8,-208 -8,-208 -16,-205 Z" fill="#1E2740"/>
 <path d="M-14,-205 C-6,-209 6,-209 14,-205 L13,-200 C6,-202 -6,-202 -13,-200 Z" fill="#12172A"/>
 <ellipse cx="0" cy="-215" rx="3.6" ry="4.2" fill="#D9B45A"/><path d="M-1.8,-215 l1.8,-1.8 l1.8,1.8" stroke="#8C6A22" stroke-width=".9" fill="none"/>`; }
function capBack(){ return `<path d="M-15,-207 C-15,-218 -8,-223 0,-223 C8,-223 15,-218 15,-207 Z" fill="url(#coat-police)"/><path d="M-16,-210 C-10,-213 10,-213 16,-210 L15.5,-206 C8,-208 -8,-208 -15.5,-206 Z" fill="#1E2740"/>`; }
function capSide(){ return `<path d="M-13,-206 C-14,-218 -6,-223 2,-223 C10,-223 15,-218 15,-207 Z" fill="url(#coat-police)"/><path d="M8,-206 C14,-207 20,-205 22,-202 L10,-201 Z" fill="#12172A"/><ellipse cx="9" cy="-215" rx="2.4" ry="3.6" fill="#D9B45A"/>`; }
function badgeChest(){ return `<g transform="translate(-11 -150)"><path d="M0,-5 C3,-5 5,-3 5,0 C5,4 2,6 0,7 C-2,6 -5,4 -5,0 C-5,-3 -3,-5 0,-5 Z" fill="#D9B45A"/><path d="M-2,0 l2,-2 l2,2" stroke="#8C6A22" stroke-width=".9" fill="none"/></g>`; }

/* ---------- icons for the SCI icon bar (48x48) ---------- */
const ICONS={
 walk:`<g><circle cx="26" cy="9" r="4.6" fill="#F2E6CC"/><path d="M24,15 L20,27 L13,31 M22,21 L29,25 L34,22 M20,27 L25,34 L23,43 M20,27 L16,36 L10,40" stroke="#F2E6CC" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`,
 look:`<g><path d="M4,24 C11,13 37,13 44,24 C37,35 11,35 4,24 Z" fill="#F7F1E3"/><circle cx="24" cy="24" r="8.6" fill="#3E6E8E"/><circle cx="24" cy="24" r="4.2" fill="#10151F"/><circle cx="21" cy="21" r="2" fill="#fff"/><path d="M4,24 C11,13 37,13 44,24" stroke="#2A2014" stroke-width="2" fill="none"/></g>`,
 hand:`<g><path d="M17,44 C12,38 9,31 8,26 C7,23 11,21 13,24 L16,29 L16,10 C16,6 21,6 21,10 L21,22 L21,7 C21,3 26,3 26,7 L26,22 L26,9 C26,5 31,5 31,9 L31,23 L31,13 C31,9 36,9 36,13 L36,31 C36,37 33,41 31,44 Z" fill="#E7C29E" stroke="#5B3B22" stroke-width="1.6" stroke-linejoin="round"/><path d="M31,23 L31,30 M26,22 L26,30 M21,22 L21,30" stroke="#5B3B22" stroke-width="1" opacity=".5"/></g>`,
 talk:`<g><path d="M6,10 H42 C44,10 45,11 45,13 V31 C45,33 44,34 42,34 H22 L12,42 L14,34 H6 C4,34 3,33 3,31 V13 C3,11 4,10 6,10 Z" fill="#F7F1E3" stroke="#2A2014" stroke-width="1.8"/><path d="M11,19 H37 M11,25 H30" stroke="#6B5A40" stroke-width="2.4" stroke-linecap="round"/></g>`,
 inv:`<g><rect x="5" y="15" width="38" height="27" rx="3" fill="#7A4A26"/><rect x="5" y="15" width="38" height="9" rx="3" fill="#94603A"/><path d="M18,15 V10 C18,8 19,7 21,7 H27 C29,7 30,8 30,10 V15" stroke="#3B2412" stroke-width="2.6" fill="none"/><rect x="21" y="22" width="6" height="5" rx="1" fill="#D9B45A"/><path d="M5,38 H43" stroke="#3B2412" stroke-width="1.4" opacity=".5"/></g>`,
 note:`<g><rect x="10" y="5" width="30" height="39" rx="2" fill="#F4EEDC"/><rect x="10" y="5" width="30" height="39" rx="2" fill="none" stroke="#2A2014" stroke-width="1.6"/><path d="M16,15 H35 M16,21 H35 M16,27 H31 M16,33 H34" stroke="#6E8BA8" stroke-width="1.4"/><path d="M10,5 V44" stroke="#9B2F2F" stroke-width="2"/><g fill="#5D646E"><circle cx="10" cy="11" r="2.2"/><circle cx="10" cy="20" r="2.2"/><circle cx="10" cy="29" r="2.2"/><circle cx="10" cy="38" r="2.2"/></g></g>`,
 opt:`<g stroke="#2A2014" stroke-width="1.4"><rect x="9" y="6" width="5" height="36" rx="2.5" fill="#5D646E"/><rect x="21.5" y="6" width="5" height="36" rx="2.5" fill="#5D646E"/><rect x="34" y="6" width="5" height="36" rx="2.5" fill="#5D646E"/><rect x="5" y="25" width="13" height="8" rx="2" fill="#D9B45A"/><rect x="17.5" y="12" width="13" height="8" rx="2" fill="#D9B45A"/><rect x="30" y="31" width="13" height="8" rx="2" fill="#D9B45A"/></g>`,
 empty:`<g><rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="#C9BE9E" stroke-width="2" stroke-dasharray="4 4"/></g>`
};
/* cursor art (drawn as a crisp HTML/SVG element that follows the pointer): [svg body, hotspot x, hotspot y] on a 48 box */
const CURSORS={
 walk:[ICONS.walk.replace(/#F2E6CC/g,'#FFF6DE')+'', 24, 44],
 look:[ICONS.look, 24, 24],
 hand:[ICONS.hand, 18, 5],
 talk:[ICONS.talk, 12, 42],
 wait:[`<g><circle cx="24" cy="24" r="17" fill="#F7F1E3" stroke="#2A2014" stroke-width="2"/><path d="M24,13 V24 L31,29" stroke="#2A2014" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>`, 24, 24]
};
