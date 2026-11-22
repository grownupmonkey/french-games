/* ===== Game engine: map -> stops -> dialogue steps. Data comes from GAME, INTRO, STOPS, NPC, SCENES. ===== */
(function(){
const $=s=>document.querySelector(s);
const SPEAK_ICON=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`;
let P=null, PR=null, stop=null, stepI=0, mistakes=0;
const ALL=[Object.assign({id:'intro',name:GAME.introName||'Arrivée',sub:'La mission',scene:'map'},INTRO)].concat(STOPS);
const MAP_LABELS=GAME.mapLabels||'';

function save(){ P.prog=P.prog||{}; P.prog[GAME.id]=PR; Store.set(P); }
function starsFor(m){ return m<=1?3:m<=3?2:1; }
function show(id){ ['scrCreate','scrMap','scrStop','scrEnd'].forEach(s=>$('#'+s).hidden=(s!==id)); window.scrollTo({top:0}); }
function toast(t){ const el=$('#toast'); el.textContent=t; el.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>el.hidden=true,2600); }

/* ---------- text with Québécois glosses ---------- */
function rich(s){
 s=fmt(s,P);
 return esc(s).replace(/\[\[([^|\]]+)\|([^|\]]+)\|([^\]]+)\]\]/g,(m,w,std,en)=>{
  const key=w.toLowerCase();
  if(!PR.qc[key]){ PR.qc[key]=[w,std,en]; save(); updateCount(); }
  return `<button type="button" class="qc" data-std="${std}" data-en="${en}">${w}</button>`;
 });
}
function plain(s){ return fmt(s,P).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g,'$1'); }
function updateCount(){ $('#carnetCount').textContent=PR.clues.length+Object.keys(PR.qc).length; }
document.addEventListener('click',e=>{
 const q=e.target.closest('.qc'), pop=$('#pop');
 if(!q){ pop.hidden=true; return; }
 pop.innerHTML=`<b>${esc(q.textContent)}</b> = ${esc(q.dataset.std)}<br><span style="opacity:.8">${esc(q.dataset.en)}</span>`;
 pop.hidden=false; const r=q.getBoundingClientRect();
 pop.style.left=Math.min(window.innerWidth-270,Math.max(8,r.left))+'px'; pop.style.top=(r.bottom+8)+'px';
});

/* ---------- voice ---------- */
let VOICE=null;
function pickVoice(){ if(!('speechSynthesis' in window)) return; const v=speechSynthesis.getVoices();
 // Only a real French voice is ever used. Without one, Chrome reads French with an English voice, so reading is switched off instead.
 const fr=v.filter(x=>/^fr/i.test(x.lang));
 VOICE=fr.find(x=>/^fr[-_]CA/i.test(x.lang))||fr.find(x=>/^fr[-_]FR/i.test(x.lang))||fr[0]||null; }
if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
let noVoiceWarned=false;
function speak(text,who){
 if(!('speechSynthesis' in window)) return;
 pickVoice();
 if(!VOICE){ if(!noVoiceWarned){ noVoiceWarned=true; toast('Aucune voix française sur cet appareil : la lecture est désactivée.'); } return; }
 speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(plain(text));
 u.lang=VOICE.lang; u.voice=VOICE; u.rate=.92; u.pitch=(NPC[who]&&NPC[who].pitch)||1;
 speechSynthesis.speak(u);
}

/* ---------- creator ---------- */
function ensureProfile(then){
 P=Store.get();
 if(P&&P.name){ then(); return; }
 show('scrCreate'); mountCreator($('#scrCreate'),p=>{P=p; then();});
}

/* ---------- map ---------- */
function renderMap(){
 show('scrMap');
 $('#mapSvg').innerHTML=sceneMap();
 const nextI=PR.i;
 const ov=$('#mapOverlay');
 ov.innerHTML=MAP_LABELS
  +STOPS.map((s,k)=>{ const i=k+1, [x,y]=MAP_PINS[s.id], st=i<nextI?'done':i===nextI?'next':'locked';
   return `<button class="pin ${st}" style="left:${x/9.6}%;top:${y/5.4}%" data-i="${i}" ${st==='next'?'':'disabled'} aria-label="${s.name}${st==='done'?' (fait)':''}"><span class="dot"><i>${st==='done'?'✓':i}</i></span><span class="lbl">${s.name}</span></button>`; }).join('');
 ov.querySelectorAll('.pin.next').forEach(b=>b.addEventListener('click',()=>travel(+b.dataset.i)));
 $('#mapLede').innerHTML=esc(fmt(GAME.lede,P));
 $('#mapSvg').setAttribute('aria-label',GAME.mapAria||'Carte');
 $('#missionList').innerHTML=STOPS.map((s,k)=>{const i=k+1, st=i<nextI?'done':i===nextI?'next':'';
  return `<li class="${st}"><span class="n">${st==='done'?'✓':i}</span><span>${s.name}<small>${s.sub}</small></span><span class="st">${PR.stars[s.id]?'★'.repeat(PR.stars[s.id]):''}</span></li>`;}).join('');
 const nx=STOPS[nextI-1];
 $('#mapAction').innerHTML= nx?`<button class="btn accent" id="goNext" type="button">Aller : ${nx.name}</button>`:'';
 if(nx) $('#goNext').addEventListener('click',()=>travel(nextI));
}
function travel(i){ toast(ALL[i].toast||`En route : ${ALL[i].name}`); runStop(i); }

/* ---------- stop ---------- */
function runStop(i){
 stop=ALL[i]; stepI=0; mistakes=0; PR.cur=i;
 show('scrStop');
 const svg=$('#stageSvg');
 svg.ondrop=svg.onclick=svg.ondragover=null;
 if(stop.page){ PR.comic=PR.comic||{}; PR.comic[stop.id]={placed:[null,null,null,null],bubbles:{}}; }
 svg.innerHTML = stop.scene==='map' ? sceneMap() : stop.page ? comicSVG() : SCENES[stop.id](P);
 svg.setAttribute('aria-label', stop.name);
 const ov=$('#stageOverlay');
 ov.innerHTML = stop.scene==='map' ? MAP_LABELS : '';
 if(stop.sign){ const [l,t,w,h]=stop.signPos; ov.innerHTML+=`<div class="sign" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%">${esc(stop.sign)}</div>`; }
 (stop.signs||[]).forEach(([txt,l,t,w,h,cls])=>{ ov.innerHTML+=`<div class="sign ${cls||''}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%">${esc(txt)}</div>`; });
 $('#stopName').textContent=stop.name; $('#stopSub').textContent=stop.sub; $('#stopStars').textContent='';
 setNpc(stop.who);
 $('#log').innerHTML=''; $('#act').innerHTML='';
 step();
}
function setNpc(id){ const n=NPC[id]; $('#npcFace').innerHTML=faceSVG(n.look); $('#npcName').textContent=n.name; $('#npcRole').textContent=n.role; }
function scrollLog(){ const l=$('#log'); l.scrollTop=l.scrollHeight; }
function npcBubble(who,text,en){
 const n=NPC[who]; const row=document.createElement('div'); row.className='row npc';
 row.innerHTML=`<div class="mini">${faceSVG(n.look)}</div><div class="bubble"><span class="who">${esc(n.name)}</span>${rich(text)}<button class="say" type="button" aria-label="Écouter">${SPEAK_ICON}</button>${en?`<span class="en">${esc(fmt(en,P))}</span>`:''}</div>`;
 row.querySelector('.say').addEventListener('click',()=>speak(text,who));
 $('#log').appendChild(row); scrollLog();
 if($('#optVoice').checked) speak(text,who);
}
function meBubble(text){
 const row=document.createElement('div'); row.className='row me';
 row.innerHTML=`<div class="mini">${faceSVG(playerLook(P,GAME.playerExtra))}</div><div class="bubble">${esc(fmt(text,P))}</div>`;
 $('#log').appendChild(row); scrollLog();
}
function contBtn(label,fn){
 const b=document.createElement('button'); b.className='btn primary cont'; b.type='button'; b.textContent=label||'Continuer'; b.addEventListener('click',fn);
 $('#act').innerHTML=''; $('#act').appendChild(b); b.focus({preventScroll:true});
}
function promptHTML(s){ return `<p class="prompt">${esc(fmt(s.prompt,P))}</p>${s.en?`<p class="en">${esc(fmt(s.en,P))}</p>`:''}`; }
function feedback(kind,fr,en){ let fb=$('#act .fb'); if(!fb){ fb=document.createElement('div'); $('#act').appendChild(fb);} fb.className='fb '+kind; fb.innerHTML=esc(fmt(fr,P))+(en?`<span class="en">${esc(fmt(en,P))}</span>`:''); }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
const PRAISE=['Bravo!','Excellent!','Parfait!','Super!','Bien joué!','Exactement!'];

/* ---------- comic pages (Bruxelles): stage shows a 2x2 page; panels and bubbles fill in ---------- */
const FRAMES=[[20,20],[490,20],[20,280],[490,280]], FW=450, FH=240;
function comicState(){ PR.comic=PR.comic||{}; return PR.comic[stop.id]=PR.comic[stop.id]||{placed:[null,null,null,null],bubbles:{}}; }
function wrapWords(t,n){ const w=String(t).split(' '), out=[]; let line=''; w.forEach(x=>{ if((line+' '+x).trim().length>n){ if(line) out.push(line); line=x; } else line=(line+' '+x).trim(); }); if(line) out.push(line); return out; }
function bubbleSVG(b,txt,solved){
 const fs=b.fs||16, lines=wrapWords(txt,b.chars||Math.round(b.w/(fs*.52))), h=lines.length*fs*1.18+16, tx=b.tail==='r'?b.x+b.w-30:b.x+30;
 return `<g class="bub"><path d="M${b.x+12},${b.y} H${b.x+b.w-12} Q${b.x+b.w},${b.y} ${b.x+b.w},${b.y+12} V${b.y+h-12} Q${b.x+b.w},${b.y+h} ${b.x+b.w-12},${b.y+h} H${tx+10} L${tx+(b.tail==='r'?14:-6)},${b.y+h+18} L${tx-4},${b.y+h} H${b.x+12} Q${b.x},${b.y+h} ${b.x},${b.y+h-12} V${b.y+12} Q${b.x},${b.y} ${b.x+12},${b.y} Z" fill="#fff" stroke="#1F2433" stroke-width="2"/>
 <text font-family="'Comic Neue','Comic Sans MS','Chalkboard SE',Inter,sans-serif" font-size="${fs}" font-weight="${solved?700:400}" fill="${solved?'#1F2433':'#9AA3AE'}">${lines.map((l,i)=>`<tspan x="${b.x+10}" y="${b.y+8+fs*(i+1)*1.1}">${esc(l)}</tspan>`).join('')}</text></g>`;
}
function panelSVG(p,withBubbles,cs,pi,caption){
 let s=`<svg x="0" y="0" width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}" overflow="hidden">${PANEL_ART[p.art](P)}`;
 if(withBubbles) (p.bubbles||[]).forEach((b,j)=>{ const solved=cs.bubbles[`${pi}-${j}`]; s+=bubbleSVG(b,solved?fmt((b.lead||'')+b.text,P):(b.lead?fmt(b.lead,P)+'…':'…'),solved); });
 const cap=wrapWords(fmt(caption||p.caption||'',P),46); const ch=cap.length*17+10;
 s+=`<rect x="0" y="0" width="${Math.min(FW,Math.max(...cap.map(l=>l.length))*8.2+20)}" height="${ch}" fill="#FFE98A" stroke="#1F2433" stroke-width="2"/><text font-family="Inter,Arial,sans-serif" font-size="14" font-weight="600" fill="#1F2433">${cap.map((l,i)=>`<tspan x="9" y="${19+i*17}">${esc(l)}</tspan>`).join('')}</text>`;
 return s+'</svg>';
}
function comicSVG(pg,cs){
 pg=pg||stop.page; cs=cs||comicState(); const arranged=!!cs.done;
 let s=`<rect width="960" height="540" fill="#F4F1E8"/><rect width="960" height="540" fill="url(#bdDots)" opacity=".5"/>`;
 FRAMES.forEach(([x,y],k)=>{ const id=cs.placed[k], p=id&&pg.panels.concat(pg.decoys||[]).find(q=>q.id===id);
  s+=`<g transform="translate(${x} ${y})" data-frame="${k}"><rect x="4" y="5" width="${FW}" height="${FH}" fill="#1F2433" opacity=".25"/>`;
  s+= p ? panelSVG(p,arranged,cs,k,pg.panels[k].caption) : `<rect width="${FW}" height="${FH}" fill="#FFFFFF"/><rect x="10" y="10" width="${FW-20}" height="${FH-20}" fill="none" stroke="#C3CCD6" stroke-width="2" stroke-dasharray="8 8"/><text x="${FW/2}" y="${FH/2+16}" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="48" font-weight="700" fill="#D5DCE3">${k+1}</text>`;
  s+=`<rect width="${FW}" height="${FH}" fill="none" stroke="#1F2433" stroke-width="4"/></g>`; });
 return s;
}
function renderComic(){ $('#stageSvg').innerHTML=comicSVG(); }
function thumbSVG(p){ return `<svg viewBox="0 0 ${FW} ${FH}" aria-hidden="true"><svg width="${FW}" height="${FH}" viewBox="0 0 ${FW} ${FH}" overflow="hidden">${PANEL_ART[p.art](P)}</svg><rect width="${FW}" height="${FH}" fill="none" stroke="#1F2433" stroke-width="6"/></svg>`; }
/* ---------- helpers for the newer step types ---------- */
const DOCS=[];
function docLink(){ return document.querySelector('#log .doc')?`<p class="doclink"><button type="button" class="linkbtn" onclick="document.querySelector('#log .doc:last-of-type')?.scrollIntoView({behavior:'smooth',block:'center'})">Relire le document</button></p>`:''; }
function deaccent(s){ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’]/g,"'"); }
function normTxt(s){ return deaccent(s.toLowerCase()).replace(/\s+([.,!?])/g,'$1').replace(/\s+/g,' ').trim(); }
const PUNCT_FR={'.':'un point (.)','!':"un point d'exclamation (!)",'?':"un point d'interrogation (?)"};
/* If the words match an accepted answer and only the final punctuation differs, return [fr, en] feedback; else null. */
function punctMsg(txt,answers){
 const end=s=>{ const m=normTxt(s).match(/[.!?]+$/); return m?m[0].slice(-1):''; }, core=s=>normTxt(s).replace(/[.!?]+$/,'').trim();
 const mine=end(txt), c=core(txt), hit=answers.filter(a=>core(a)===c);
 if(!hit.length||hit.some(a=>end(a)===mine)) return null;
 const want=end(hit[0]);
 if(!mine) return want?[`Tes mots sont bons, mais il manque la ponctuation à la fin de la phrase : ajoute ${PUNCT_FR[want]}.`,`Your words are right, but the sentence needs its final punctuation: add ${want==='.'?'a period':want==='!'?'an exclamation mark':'a question mark'}.`]:null;
 if(!want) return ['Tes mots sont bons, mais cette phrase ne prend pas de ponctuation finale : enlève-la.','Your words are right, but this sentence takes no final punctuation: remove it.'];
 return [`Tes mots sont bons, mais change la ponctuation finale : cette phrase se termine par ${PUNCT_FR[want]}.`,`Your words are right, but change the final punctuation: this sentence ends with ${want==='.'?'a period':want==='!'?'an exclamation mark':'a question mark'}.`];
}
function joinTiles(a){ return a.reduce((acc,t)=>acc+(acc===''||acc.endsWith("'")||/^[.,!?]/.test(t)?'':' ')+t,''); }
function letterParts(s){ const d=new Date().toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'});
 return {place:fmt(s.place||'Calgary',P)+', le '+d, greet:fmt(s.greet,P), paras:s.sections.map(x=>(PR.letter[x.id]||'').trim()), close:fmt(s.close||'Amitiés,',P), name:P.name}; }
function letterHTML(s){ const L=letterParts(s); return `<p class="lplace">${esc(L.place)}</p><p>${esc(L.greet)}</p>${L.paras.map(p=>`<p>${esc(p)}</p>`).join('')}<p>${esc(L.close)}</p><p class="lsign">${esc(L.name)}</p>`; }
function letterText(s){ const L=letterParts(s); return [L.place,'',L.greet,'',...L.paras.flatMap(p=>[p,'']),L.close,L.name].join('\n'); }
function next(){ stepI++; step(); }
function wrong(){ mistakes++; }

function step(){
 const s=stop.steps[stepI];
 if(!s){ finishStop(); return; }
 const act=$('#act'); act.innerHTML='';
 if(s.t==='npc'){
  const who=s.who||stop.who; if(who!==stop.who||$('#npcName').textContent!==NPC[who].name) setNpc(who);
  npcBubble(who,s.text,s.en); contBtn('Continuer',next);
 }
 else if(s.t==='choice'||s.t==='board'){
  let html=promptHTML(s);
  if(s.t==='board') html+=`${s.clock?`<p style="margin:0 0 8px">Heure : <span class="clock">${s.clock}</span></p>`:''}<table class="board"><thead><tr>${(s.cols||['Départ','Trajet','État']).map(c=>`<th>${c}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="${r[3]||(r[2]==='Parti'?'gone':'ontime')}">${r[2]}</td></tr>`).join('')}</tbody></table>`;
  act.innerHTML=html+`<div class="opts"></div>`;
  const box=act.querySelector('.opts');
  shuffle(s.opts).forEach(o=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.textContent=fmt(o.txt,P);
   b.addEventListener('click',()=>{
    if(o.ok){ b.classList.add('right'); box.querySelectorAll('button').forEach(x=>x.disabled=true); meBubble(o.txt); feedback('ok',PRAISE[Math.floor(Math.random()*PRAISE.length)]); setTimeout(next,750); }
    else{ b.classList.add('wrong'); b.disabled=true; wrong(); feedback('err',o.why||'Essaie encore.',o.whyEn); }
   }); box.appendChild(b); });
 }
 else if(s.t==='fill'){
  act.innerHTML=promptHTML(s)+`<p class="sentence">${esc(fmt(s.before,P))} <span class="blank">?</span> ${esc(fmt(s.after,P))}</p><div class="optrow"></div>`;
  const box=act.querySelector('.optrow');
  s.opts.forEach(o=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.textContent=o;
   b.addEventListener('click',()=>{
    if(o===s.ans){ b.classList.add('right'); box.querySelectorAll('button').forEach(x=>x.disabled=true); act.querySelector('.blank').textContent=o;
     const joined=(fmt(s.before,P)+' '+o+(o.endsWith("'")?'':' ')+fmt(s.after,P)).replace(/\s+/g,' ');
     meBubble(joined); feedback('ok',PRAISE[Math.floor(Math.random()*PRAISE.length)]); setTimeout(next,750); }
    else{ b.classList.add('wrong'); b.disabled=true; wrong(); feedback('err',(s.why&&s.why[o])||'Essaie encore.'); }
   }); box.appendChild(b); });
 }
 else if(s.t==='order'){
  const items=s.items.map(x=>fmt(x,P)); let k=0;
  act.innerHTML=promptHTML(s)+`<ol class="orderBuilt"></ol><div class="opts"></div>`;
  const built=act.querySelector('.orderBuilt'), box=act.querySelector('.opts');
  shuffle(items).forEach(it=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.textContent=it;
   b.addEventListener('click',()=>{
    if(it===items[k]){ k++; const li=document.createElement('li'); li.textContent=it; built.appendChild(li); b.remove(); act.querySelector('.fb')?.remove();
     if(k===items.length){ meBubble(items.join(' ')); feedback('ok',s.done||'Bravo! Tu as bien raconté ta journée.'); setTimeout(next,900); } }
    else{ wrong(); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); feedback('err','Pas encore. Qu\'est-ce que tu as fait avant ça?','What did you do before that?'); }
   }); box.appendChild(b); });
 }
 else if(s.t==='card'){
  const c=document.createElement('div'); c.className='culture';
  c.innerHTML=`<span class="k">Le savais-tu?</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${s.en?`<p class="en">${esc(s.en)}</p>`:''}`;
  $('#log').appendChild(c); scrollLog(); contBtn('Continuer',next);
 }
 /* ----- documents to read (timetables, notes, recipes) ----- */
 else if(s.t==='doc'){
  const c=document.createElement('div'); c.className='doc';
  let body='';
  if(s.table) body+=`<div class="tablewrap"><table class="board doctable"><thead><tr>${s.table[0].map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.slice(1).map(r=>`<tr>${r.map((v,j)=>j?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if(s.lines) body+=`<ul>${s.lines.map(l=>`<li>${esc(fmt(l,P))}</li>`).join('')}</ul>`;
  c.innerHTML=`<span class="k">${esc(s.kind||'Document')}</span><h3>${esc(s.title)}</h3>${body}${s.en?`<p class="en">${esc(s.en)}</p>`:''}`;
  $('#log').appendChild(c); scrollLog(); DOCS.push(c.outerHTML); contBtn('J\'ai lu',next);
 }
 /* ----- planning grid: place each item in a slot that satisfies the constraints ----- */
 else if(s.t==='plan'){
  const pos={}; let sel=null;
  act.innerHTML=promptHTML(s)+docLink()+`<div class="plan"><div class="chips" role="group" aria-label="${esc(s.itemsLabel||'À placer')}"></div><ol class="slots"></ol></div><div class="row2"><button class="btn primary check" type="button">Vérifier</button></div>`;
  const chips=act.querySelector('.chips'), slots=act.querySelector('.slots');
  const render=()=>{
   chips.innerHTML=''; s.items.forEach(it=>{ if(it.id in pos) return; const b=document.createElement('button'); b.type='button'; b.className='chip'+(sel===it.id?' sel':''); b.textContent=fmt(it.txt,P); b.setAttribute('aria-pressed',sel===it.id);
    b.addEventListener('click',()=>{ sel=sel===it.id?null:it.id; render(); }); chips.appendChild(b); });
   if(!chips.children.length) chips.innerHTML='<span class="muted">Tout est placé. Vérifie ton plan!</span>';
   slots.innerHTML=''; s.slots.forEach((lab,k)=>{ const id=Object.keys(pos).find(i=>pos[i]===k), it=s.items.find(x=>x.id===id);
    const li=document.createElement('li'); li.innerHTML=`<span class="slab">${esc(fmt(lab,P))}</span>`; const b=document.createElement('button'); b.type='button';
    b.className='slot'+(it?' full':'')+(sel&&!it?' ready':''); b.textContent=it?fmt(it.txt,P):(sel?'Placer ici':'—');
    b.setAttribute('aria-label',`${lab} : ${it?fmt(it.txt,P):'vide'}`);
    b.addEventListener('click',()=>{ if(sel){ if(it) delete pos[it.id]; pos[sel]=k; sel=null; } else if(it){ delete pos[it.id]; } act.querySelector('.fb')?.remove(); render(); });
    li.appendChild(b); slots.appendChild(li); });
  };
  render();
  act.querySelector('.check').addEventListener('click',()=>{
   const missing=s.items.filter(it=>!(it.id in pos)), bad=s.items.filter(it=>(it.id in pos)&&!it.ok.includes(pos[it.id]));
   slots.querySelectorAll('.slot').forEach(b=>b.classList.remove('bad'));
   if(missing.length){ feedback('err','Place tout avant de vérifier.','Place everything before checking.'); return; }
   if(bad.length){ wrong(); bad.forEach(it=>slots.querySelectorAll('.slot')[pos[it.id]].classList.add('bad')); const it=bad[0]; feedback('err',`${fmt(it.txt,P)} : ${it.why}`+(bad.length>1?` (Encore ${bad.length-1} autre${bad.length>2?'s':''} à revoir.)`:''),it.whyEn); return; }
   act.querySelectorAll('button').forEach(b=>b.disabled=true);
   meBubble(s.say||s.slots.map((lab,k)=>{const id=Object.keys(pos).find(i=>pos[i]===k);return id?`${lab} : ${s.items.find(x=>x.id===id).txt}`:null;}).filter(Boolean).join(' · '));
   feedback('ok',s.done||'Ton plan fonctionne!'); setTimeout(next,1100);
  });
 }
 /* ----- word tiles: build a sentence ----- */
 else if(s.t==='tiles'){
  const built=[];
  act.innerHTML=promptHTML(s)+docLink()+`<p class="sentence built" aria-live="polite"><span class="muted">Touche les mots dans l'ordre.</span></p><div class="tilebank"></div><div class="row2"><button class="btn" type="button" data-a="clear">Effacer</button><button class="btn primary check" type="button">Vérifier</button></div>`;
  const bank=act.querySelector('.tilebank'), out=act.querySelector('.built');
  const tiles=shuffle(s.tiles.map((t,i)=>({t:fmt(t,P),i})));
  const render=()=>{
   bank.innerHTML=''; tiles.forEach(o=>{ const b=document.createElement('button'); b.type='button'; b.className='tile'; b.textContent=o.t; b.disabled=built.includes(o);
    b.addEventListener('click',()=>{ built.push(o); act.querySelector('.fb')?.remove(); render(); }); bank.appendChild(b); });
   out.innerHTML=built.length?'':'<span class="muted">Touche les mots dans l\'ordre.</span>';
   built.forEach((o,k)=>{ const b=document.createElement('button'); b.type='button'; b.className='tile on'; b.textContent=o.t; b.setAttribute('aria-label','Enlever '+o.t);
    b.addEventListener('click',()=>{ built.splice(k,1); render(); }); out.appendChild(b); });
  };
  render();
  act.querySelector('[data-a=clear]').addEventListener('click',()=>{ built.length=0; render(); });
  act.querySelector('.check').addEventListener('click',()=>{
   const txt=joinTiles(built.map(o=>o.t));
   if((s.answers||[s.answer]).map(a=>normTxt(fmt(a,P))).includes(normTxt(txt))){
    act.querySelectorAll('button').forEach(b=>b.disabled=true); meBubble(txt); if(s.bubble){ comicState().bubbles[s.bubble.join('-')]=1; save(); renderComic(); } feedback('ok',PRAISE[Math.floor(Math.random()*PRAISE.length)]); setTimeout(next,850); return; }
   wrong();
   /* right words, wrong or missing end punctuation: say so, instead of a grammar hint that does not apply */
   const pm=punctMsg(txt,(s.answers||[s.answer]).map(a=>fmt(a,P)));
   if(pm){ feedback('err',pm[0],pm[1]); return; }
   const h=built.map(o=>o.t).find(t=>s.hints&&s.hints[t]);
   feedback('err',h?s.hints[h]:(built.length<(s.min||3)?'Ta phrase n\'est pas complète.':(s.why||'Pas tout à fait. Vérifie la forme du verbe et l\'ordre des mots.')),h?null:s.whyEn);
  });
 }
 /* ----- checklist: select everything that is needed, and nothing else ----- */
 else if(s.t==='pack'){
  const on=new Set();
  act.innerHTML=promptHTML(s)+docLink()+`<div class="packgrid"></div><div class="row2"><button class="btn primary check" type="button">Vérifier</button></div>`;
  const grid=act.querySelector('.packgrid');
  s.items.forEach((it,k)=>{ const b=document.createElement('button'); b.type='button'; b.className='pack'; b.textContent=fmt(it.txt,P); b.setAttribute('aria-pressed','false');
   b.addEventListener('click',()=>{ on.has(k)?on.delete(k):on.add(k); b.setAttribute('aria-pressed',on.has(k)); b.classList.toggle('on',on.has(k)); act.querySelector('.fb')?.remove(); }); grid.appendChild(b); });
  act.querySelector('.check').addEventListener('click',()=>{
   const extra=s.items.filter((it,k)=>!it.need&&on.has(k)), miss=s.items.filter((it,k)=>it.need&&!on.has(k));
   if(!extra.length&&!miss.length){ act.querySelectorAll('button').forEach(b=>b.disabled=true); meBubble(s.say||s.items.filter(it=>it.need).map(it=>it.txt).join(', ')); feedback('ok',s.done||'Parfait, tu as tout!'); setTimeout(next,1000); return; }
   wrong();
   if(extra.length) feedback('err',`${fmt(extra[0].txt,P)} : ${extra[0].why}`,extra[0].whyEn);
   else feedback('err',s.missing||'Il manque encore quelque chose. Relis le document.',s.missingEn);
  });
 }
 /* ----- numbers: calculate from a document ----- */
 else if(s.t==='number'){
  act.innerHTML=promptHTML(s)+docLink()+`<div class="numgrid">${s.rows.map((r,k)=>`<label class="numrow"><span>${esc(fmt(r.label,P))}</span><input type="text" inputmode="decimal" autocomplete="off" data-k="${k}" aria-label="${esc(r.label)}"><span class="unit">${esc(r.unit||'')}</span></label>`).join('')}</div><div class="row2"><button class="btn primary check" type="button">Vérifier</button></div>`;
  act.querySelector('.check').addEventListener('click',()=>{
   const ins=[...act.querySelectorAll('input')]; let firstBad=null;
   ins.forEach(inp=>{ const r=s.rows[+inp.dataset.k], v=parseFloat(inp.value.replace(',','.').replace(/[^0-9.\-]/g,'')); const ok=!isNaN(v)&&Math.abs(v-r.ans)<=(r.tol||0);
    inp.classList.toggle('bad',!ok); inp.classList.toggle('good',ok); if(!ok&&firstBad===null) firstBad=r; });
   if(firstBad){ wrong(); feedback('err',`${fmt(firstBad.label,P)} : ${firstBad.why||'Recalcule.'}`,firstBad.whyEn); return; }
   act.querySelectorAll('button,input').forEach(b=>b.disabled=true);
   meBubble(s.say||s.rows.map(r=>`${r.label} : ${String(r.ans).replace('.',',')} ${r.unit||''}`).join(' · ')); feedback('ok',s.done||'Calcul parfait!'); setTimeout(next,1000);
  });
 }
 /* ----- guided letter: every section is checked for specific language features ----- */
 else if(s.t==='letter'){
  PR.letter=PR.letter||{};
  act.innerHTML=promptHTML(s)+`<div class="lettergrid">${s.sections.map((x,k)=>`<label class="lsec"><span class="lt">${k+1}. ${esc(x.label)}</span><span class="lp">${esc(fmt(x.prompt,P))}</span>${x.en?`<span class="en">${esc(x.en)}</span>`:''}<textarea rows="4" data-k="${k}" spellcheck="false" placeholder="${esc(x.placeholder||'')}"></textarea><span class="lerr" aria-live="polite"></span></label>`).join('')}</div><div class="row2"><button class="btn primary check" type="button">Vérifier ma lettre</button></div>`;
  const areas=[...act.querySelectorAll('textarea')];
  areas.forEach(a=>{ a.value=PR.letter[s.sections[+a.dataset.k].id]||''; a.addEventListener('input',()=>{ PR.letter[s.sections[+a.dataset.k].id]=a.value; save(); }); });
  act.querySelector('.check').addEventListener('click',()=>{
   let bad=0;
   areas.forEach(a=>{ const x=s.sections[+a.dataset.k], txt=a.value.trim(), n=deaccent(txt.toLowerCase()), errs=[];
    const words=(txt.match(/[A-Za-zÀ-ÿ'’-]+/g)||[]).length;
    const gram=[], need=[];
    (x.checks||[]).forEach(c=>{ const re=new RegExp(c.re,'g'); const m=n.match(re)||[]; if(c.not){ if(m.length) gram.push(c.msg); } else if(m.length<(c.count||1)) need.push(c.msg); });
    errs.push(...gram,...need);
    if(words<(x.min||10)) errs.push(`Écris au moins ${x.min||10} mots (tu en as ${words}).`);
    a.closest('.lsec').classList.toggle('bad',!!errs.length); a.closest('.lsec').classList.toggle('good',!errs.length);
    a.closest('.lsec').querySelector('.lerr').textContent=errs.slice(0,2).join(' '); if(errs.length) bad++; });
   if(bad){ wrong(); feedback('err',`Encore ${bad} partie${bad>1?'s':''} à améliorer. Lis les conseils en rouge.`,'Read the red notes to improve your letter.'); return; }
   act.querySelectorAll('button,textarea').forEach(b=>b.disabled=true);
   const html=letterHTML(s); const c=document.createElement('div'); c.className='letter'; c.innerHTML=html; $('#log').appendChild(c); scrollLog();
   act.innerHTML=''; feedback('ok',s.done||'Ta lettre est prête!');
   const row=document.createElement('div'); row.className='row2';
   row.innerHTML=`<button class="btn" type="button" data-a="print">Imprimer ma lettre</button><button class="btn" type="button" data-a="copy">Copier le texte</button><button class="btn primary cont" type="button">Continuer</button>`;
   act.appendChild(row);
   row.querySelector('[data-a=print]').addEventListener('click',()=>{ $('#printArea').innerHTML=`<div class="printLetter">${html}</div>`; const pg=document.createElement('style'); pg.textContent='@page{size:portrait;margin:18mm}'; document.head.appendChild(pg); window.print(); setTimeout(()=>pg.remove(),500); });
   row.querySelector('[data-a=copy]').addEventListener('click',()=>{ const t=letterText(s); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast('Lettre copiée!')).catch(()=>toast('Copie impossible : utilise Imprimer.')); });
   row.querySelector('.cont').addEventListener('click',next);
  });
 }
 /* ----- animated finale (unlocked by the step before) ----- */
 else if(s.t==='finale'){
  const svg=$('#stageSvg'); const f=FINALES[s.scene]; svg.innerHTML=f.svg(P); $('#stageOverlay').innerHTML=s.sign?`<div class="sign" style="left:${s.signPos[0]}%;top:${s.signPos[1]}%;width:${s.signPos[2]}%;height:${s.signPos[3]}%">${esc(s.sign)}</div>`:'';
  if(f.start) f.start(svg);
  window.scrollTo({top:0,behavior:'smooth'});
  if(s.text) npcBubble(s.who||stop.who,s.text,s.en);
  contBtn(s.btn||'Continuer',()=>{ if(f.stop) f.stop(); next(); });
  if(f.download){ const d=document.createElement('button'); d.type='button'; d.className='btn accent'; d.textContent=s.downloadLabel||'Télécharger'; d.style.marginRight='8px'; d.addEventListener('click',()=>f.download(P,PR)); $('#act').prepend(d); }
 }
 /* ----- comic: drag (or tap) each picture into the frame whose caption it shows ----- */
 else if(s.t==='arrange'){
  const cs=comicState(), pg=stop.page, all=shuffle(pg.panels.concat(pg.decoys||[])); let sel=null;
  act.innerHTML=promptHTML(s)+`<ol class="caps">${pg.panels.map((p,k)=>`<li><span class="capn">${k+1}</span><span class="capt">${esc(fmt(p.caption,P))}</span><button type="button" class="slot capslot" data-k="${k}"></button></li>`).join('')}</ol><p class="muted">Glisse chaque image dans la bonne case de la planche (ou touche une image, puis une case). ${pg.decoys&&pg.decoys.length?'Attention : il y a une image de trop!':''}</p><div class="thumbs"></div><div class="row2"><button class="btn primary check" type="button">Vérifier la planche</button></div>`;
  const thumbs=act.querySelector('.thumbs');
  const placeAt=(id,k)=>{ const old=cs.placed.indexOf(id); if(old>-1) cs.placed[old]=null; cs.placed[k]=id; sel=null; act.querySelector('.fb')?.remove(); save(); render(); };
  const render=()=>{
   thumbs.innerHTML=''; all.forEach(p=>{ if(cs.placed.includes(p.id)) return; const b=document.createElement('button'); b.type='button'; b.className='thumb'+(sel===p.id?' sel':''); b.draggable=true; b.innerHTML=thumbSVG(p); b.setAttribute('aria-label','Image : '+fmt(p.alt||p.caption,P)); b.setAttribute('aria-pressed',sel===p.id);
    b.addEventListener('click',()=>{ sel=sel===p.id?null:p.id; render(); });
    b.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text/plain',p.id); sel=p.id; }); thumbs.appendChild(b); });
   act.querySelectorAll('.capslot').forEach(b=>{ const k=+b.dataset.k, id=cs.placed[k], p=all.find(q=>q.id===id); b.classList.toggle('full',!!p); b.classList.toggle('ready',!p&&!!sel); b.innerHTML=p?thumbSVG(p):(sel?'Placer ici':'Case vide'); });
   renderComic();
  };
  act.querySelectorAll('.capslot').forEach(b=>{ const k=+b.dataset.k;
   b.addEventListener('click',()=>{ if(sel) placeAt(sel,k); else if(cs.placed[k]){ cs.placed[k]=null; save(); render(); } });
   b.addEventListener('dragover',e=>e.preventDefault()); b.addEventListener('drop',e=>{ e.preventDefault(); placeAt(e.dataTransfer.getData('text/plain'),k); }); });
  const svg=$('#stageSvg');
  const frameAt=e=>{ const r=svg.getBoundingClientRect(), x=(e.clientX-r.left)*960/r.width, y=(e.clientY-r.top)*540/r.height; return FRAMES.findIndex(([fx,fy])=>x>=fx&&x<=fx+FW&&y>=fy&&y<=fy+FH); };
  svg.ondragover=e=>e.preventDefault();
  svg.ondrop=e=>{ e.preventDefault(); const k=frameAt(e); if(k>-1) placeAt(e.dataTransfer.getData('text/plain'),k); };
  svg.onclick=e=>{ if(stop.page&&sel&&!cs.done){ const k=frameAt(e); if(k>-1) placeAt(sel,k); } };
  render();
  act.querySelector('.check').addEventListener('click',()=>{
   if(cs.placed.some(x=>!x)){ feedback('err','Remplis les quatre cases avant de vérifier.','Fill all four frames first.'); return; }
   const badK=cs.placed.map((id,k)=>id===pg.panels[k].id?-1:k).filter(k=>k>-1);
   act.querySelectorAll('.capslot').forEach((b,k)=>b.classList.toggle('bad',badK.includes(k)));
   if(badK.length){ wrong(); const k=badK[0], id=cs.placed[k], p=all.find(q=>q.id===id);
    feedback('err',`Case ${k+1} : ${p.decoy?p.why:(pg.panels[k].why||'Relis la légende : qui fait quoi?')}`+(badK.length>1?` (Encore ${badK.length-1} autre${badK.length>2?'s':''} à revoir.)`:''),p.decoy?p.whyEn:pg.panels[k].whyEn); return; }
   cs.done=true; save(); svg.ondrop=svg.onclick=null; renderComic();
   act.querySelectorAll('button').forEach(b=>b.disabled=true); feedback('ok',s.done||'Bravo! La planche est dans le bon ordre.'); setTimeout(next,1100);
  });
 }
 else if(s.t==='clue'){
  if(!PR.clues.includes(s.text)) PR.clues.push(s.text); save(); updateCount();
  toast('Nouvel indice dans ton carnet'); next();
 }
}
function finishStop(){
 const i=PR.cur, st=starsFor(mistakes);
 if(stop.id!=='intro'){ PR.stars[stop.id]=Math.max(PR.stars[stop.id]||0,st); $('#stopStars').textContent='★'.repeat(st); }
 if(PR.i<=i) PR.i=i+1; save();
 const last=i===ALL.length-1;
 contBtn(last?'Terminer l\'escale':'Retour à la carte', ()=> last?endScreen():renderMap());
 if(stop.id!=='intro') feedback('ok', `Escale réussie! ${'★'.repeat(st)}${'☆'.repeat(3-st)}`);
}

/* ---------- end ---------- */
function endScreen(){
 show('scrEnd');
 const vals=STOPS.map(s=>PR.stars[s.id]||1), avg=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
 window.GVJetons && GVJetons.award('fr20-'+GAME.id, avg/3);
 const d=new Date(), date=d.toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:'numeric'});
 P.done=P.done||{}; if(!P.done[GAME.id]) P.done[GAME.id]=date; P.last=GAME.id; P.stars=P.stars||{}; P.stars[GAME.id]=Math.max(P.stars[GAME.id]||0,avg); save();
 const me=JOURNEY.find(j=>j.id===GAME.id), nx=nextStop(P);
 $('#scrEnd').innerHTML=`<div class="card endcard"><div class="stampwrap go">${stampSVG(me,'done',String(P.done[GAME.id]).toUpperCase())}</div>
  <div><p class="eyebrow">Escale réussie</p><h1>${esc(fmt('Bravo, [nom]!',P))}</h1>
  <p>${esc(fmt(GAME.endText,P))}</p>
  <div class="bigstars" aria-label="${avg} étoiles sur 3">${'★'.repeat(avg)}${'☆'.repeat(3-avg)}</div>
  <p>Prochaine escale : <b>${nx?nx.place+' — '+nx.sub:'retour à Calgary'}</b>${nx&&!nx.ready?' (bientôt disponible)':''}</p>
  <div class="endbtns">${nx&&nx.ready?`<a class="btn accent" id="nextLeg" href="${nx.file}">Embarquer pour ${esc(nx.place)} →</a>`:''}<a class="btn${nx&&nx.ready?'':' accent'}" id="toPassport" href="voyage.html">Retour au passeport</a><button class="btn" type="button" id="dlStamp">Télécharger mon tampon (PNG)</button><button class="btn" type="button" id="printStamp">Imprimer mon tampon</button>${GAME.endDownload?`<button class="btn" type="button" id="dlExtra">${esc(GAME.endDownload.label)}</button>`:''}<button class="btn" type="button" id="replay">Rejouer l'escale</button></div>
  <p class="hint">Ton tampon est ta preuve de réussite : enregistre-le et téléverse-le dans Teams, ou imprime-le.</p></div></div>`;
 $('#replay').addEventListener('click',()=>{ PR={i:0,stars:{},clues:[],qc:PR.qc,cur:0}; save(); runStop(0); });
 $('#dlStamp').addEventListener('click',()=>downloadStamp(me,avg));
 $('#printStamp').addEventListener('click',()=>printStamp(me,avg));
 if(GAME.endDownload) $('#dlExtra').addEventListener('click',()=>FINALES[GAME.endDownload.finale].download(P,PR));
}

/* ---------- printable passport stamp ---------- */
function stampCard(me,avg){
 const date=String(P.done[GAME.id]||'');
 const stars='★'.repeat(avg)+'☆'.repeat(3-avg);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
  <rect x="6" y="6" width="788" height="508" rx="22" fill="#FFF9EE" stroke="${me.color}" stroke-width="4"/>
  <rect x="20" y="20" width="760" height="480" rx="14" fill="none" stroke="${me.color}" stroke-width="1.5" stroke-dasharray="6 6"/>
  <svg x="50" y="90" width="300" height="300" viewBox="-60 -60 120 120">${stampSVG(me,'done',date.toUpperCase()).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>
  <text x="390" y="100" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="15" letter-spacing="2" fill="#6B6F7A">PASSEPORT · LE GRAND VOYAGE</text>
  <text x="390" y="180" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="50" fill="#2B2D42">${esc(P.name)}</text>
  <text x="390" y="228" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="22" fill="#2B2D42">${esc(me.place)} — ${esc(me.sub)}</text>
  <text x="390" y="262" font-family="Fraunces,Georgia,serif" font-style="italic" font-size="19" fill="#6B6F7A">${esc(GAME.title)}</text>
  <text x="390" y="302" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="19" fill="#2B2D42">Visité le ${esc(date)}</text>
  <text x="390" y="352" font-family="Arial,sans-serif" font-size="36" fill="#E9A93A" letter-spacing="4">${stars}</text>
  <text x="390" y="416" font-family="Inter,Arial,sans-serif" font-size="16" fill="#6B6F7A">Escale réussie.</text>
  <text x="390" y="440" font-family="Inter,Arial,sans-serif" font-size="16" fill="#6B6F7A">Présente ce tampon à ton enseignant·e.</text>
 </svg>`;
}
function stampFileName(){ return 'passeport-'+P.name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-'+GAME.id+'.png'; }
function downloadStamp(me,avg){
 const svg=stampCard(me,avg), url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 const img=new Image();
 const save=(href,name)=>{ const a=document.createElement('a'); a.href=href; a.download=name; document.body.appendChild(a); a.click(); a.remove(); };
 img.onload=()=>{ const c=document.createElement('canvas'); c.width=1600; c.height=1040; const x=c.getContext('2d'); x.fillStyle='#FFFFFF'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height);
   c.toBlob(b=>{ save(URL.createObjectURL(b), stampFileName()); URL.revokeObjectURL(url); },'image/png'); };
 img.onerror=()=>{ save(url, stampFileName().replace(/\.png$/,'.svg')); };
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function printStamp(me,avg){
 $('#printArea').innerHTML=stampCard(me,avg);
 window.print();
}

/* ---------- carnet ---------- */
function openCarnet(){
 $('#clueList').innerHTML=PR.clues.length?PR.clues.map(c=>`<li>${esc(c)}</li>`).join(''):'<li style="list-style:none;color:var(--muted)">Pas encore d\'indice.</li>';
 const q=Object.values(PR.qc); $('#qcList').innerHTML=q.length?q.map(([w,s,e])=>`<dt>${esc(w)}</dt><dd>${esc(s)} · <i>${esc(e)}</i></dd>`).join(''):'<dd style="grid-column:1/-1">Pas encore d\'expression.</dd>';
 $('#carnet').hidden=false; $('#closeCarnet').focus();
}
$('#btnCarnet').addEventListener('click',openCarnet);
$('#closeCarnet').addEventListener('click',()=>{ $('#carnet').hidden=true; $('#btnCarnet').focus(); });
$('#carnet').addEventListener('click',e=>{ if(e.target.id==='carnet') $('#carnet').hidden=true; });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ $('#carnet').hidden=true; $('#pop').hidden=true; } });
$('#optEn').addEventListener('change',e=>{ document.body.classList.toggle('showEn',e.target.checked); try{localStorage.setItem('jeuxFr20.en',e.target.checked?'1':'0');}catch(_){} });
$('#optVoice').addEventListener('change',e=>{ if(!e.target.checked&&'speechSynthesis' in window) speechSynthesis.cancel(); try{localStorage.setItem('jeuxFr20.voice',e.target.checked?'1':'0');}catch(_){} });
try{ if(localStorage.getItem('jeuxFr20.en')==='1'){ $('#optEn').checked=true; document.body.classList.add('showEn'); } if(localStorage.getItem('jeuxFr20.voice')==='0') $('#optVoice').checked=false; }catch(_){}

/* ---------- start ---------- */
$('#eyebrow').textContent=GAME.eyebrow; $('#title').textContent=GAME.title;
ensureProfile(()=>{
 P.prog=P.prog||{}; PR=P.prog[GAME.id]||{i:0,stars:{},clues:[],qc:{},cur:0};
 PR.qc=PR.qc||{}; PR.clues=PR.clues||[]; PR.stars=PR.stars||{};
 updateCount();
 if(PR.i===0) runStop(0);
 else if(PR.i>=ALL.length) endScreen();
 else renderMap();
});
window.__comic={page:(pg,cs)=>comicSVG(pg,cs),thumb:p=>thumbSVG(p)};
window.__game={runStop,renderMap,endScreen,get state(){return {P,PR,stepI,stop:stop&&stop.id,step:stop&&stop.steps[stepI]};}};
})();
