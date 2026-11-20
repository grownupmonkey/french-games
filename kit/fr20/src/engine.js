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
 svg.innerHTML = stop.scene==='map' ? sceneMap() : SCENES[stop.id](P);
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
 row.innerHTML=`<div class="mini">${faceSVG(playerLook(P))}</div><div class="bubble">${esc(fmt(text,P))}</div>`;
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
 const d=new Date(), date=d.toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:'numeric'});
 P.done=P.done||{}; if(!P.done[GAME.id]) P.done[GAME.id]=date; P.stars=P.stars||{}; P.stars[GAME.id]=Math.max(P.stars[GAME.id]||0,avg); save();
 const me=JOURNEY.find(j=>j.id===GAME.id), nx=nextStop(P);
 $('#scrEnd').innerHTML=`<div class="card endcard"><div class="stampwrap go">${stampSVG(me,'done',String(P.done[GAME.id]).toUpperCase())}</div>
  <div><p class="eyebrow">Escale réussie</p><h1>${esc(fmt('Bravo, [nom]!',P))}</h1>
  <p>${esc(fmt(GAME.endText,P))}</p>
  <div class="bigstars" aria-label="${avg} étoiles sur 3">${'★'.repeat(avg)}${'☆'.repeat(3-avg)}</div>
  <p>Prochaine escale : <b>${nx?nx.place+' — '+nx.sub:'retour à Calgary'}</b>${nx&&!nx.ready?' (bientôt disponible)':''}</p>
  <div class="endbtns"><button class="btn accent" type="button" id="dlStamp">Télécharger mon tampon (PNG)</button><button class="btn" type="button" id="printStamp">Imprimer mon tampon</button><button class="btn" type="button" id="replay">Rejouer l'escale</button></div>
  <p class="hint">Ton tampon est ton preuve de réussite : enregistre-le et téléverse-le dans Teams, ou imprime-le.</p></div></div>`;
 $('#replay').addEventListener('click',()=>{ PR={i:0,stars:{},clues:[],qc:PR.qc,cur:0}; save(); runStop(0); });
 $('#dlStamp').addEventListener('click',()=>downloadStamp(me,avg));
 $('#printStamp').addEventListener('click',()=>printStamp(me,avg));
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
window.__game={runStop,renderMap,endScreen,get state(){return {P,PR,stepI,stop:stop&&stop.id};}};
})();
