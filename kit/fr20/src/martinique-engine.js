/* ===== Escale 7 engine: stages on the 3D trail, gauges, speech box, task panel, scoring, save, end screen.
   The script lives in martinique-data.js as STAGES (async functions that receive the api A). ===== */
const MQ=(()=>{
 const $=s=>document.querySelector(s);
 const KEY='jeuxFr20.martinique';
 const DB={ get(){ try{ return JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){ return DB._m||{}; } }, set(v){ DB._m=v; try{ localStorage.setItem(KEY,JSON.stringify(v)); }catch(e){} } };
 let P=null, MAP=null, flat=false, S=null, voice=false, VOICE=null;
 const INIT={stage:0, water:0, clock:6*60+15, energy:100, weather:0, bag:[], pts:{}, mist:{}, flags:{}, u:0};
 const T=s=>fmt(s,P);
 /* ---------- glosses and rich text ---------- */
 const norm=w=>w.toLowerCase().normalize('NFC').trim();
 function gloss(w){ const g=GLOSSARY[norm(w)]; return g?(Array.isArray(g)?g[0]+(g[1]?' ('+g[1]+')':''):g):null; }
 function rich(s){ return esc(T(s)).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g,(m,w,g)=>{ g=g||gloss(w); return g?`<span class="gl" tabindex="0" data-g="${esc(g)}">${w}</span>`:w; }); }
 const plain=s=>T(s).replace(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g,'$1').replace(/\*\*/g,'');
 function toast(t){ const el=$('#toast'); el.textContent=T(t); el.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>el.hidden=true,2800); }
 /* ---------- French-only read-aloud ---------- */
 function pickVoice(){ if(!('speechSynthesis' in window)) return; const v=speechSynthesis.getVoices().filter(x=>/^fr/i.test(x.lang)); VOICE=v.find(x=>/^fr[-_]CA/i.test(x.lang))||v.find(x=>/^fr[-_]FR/i.test(x.lang))||v[0]||null; }
 if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
 function speak(t,pitch){ if(!voice||!('speechSynthesis' in window)) return; pickVoice(); if(!VOICE){ toast('Aucune voix française sur cet appareil : la lecture est désactivée.'); voice=false; $('#bVoice').setAttribute('aria-pressed','false'); return; }
  speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(plain(t)); u.lang=VOICE.lang; u.voice=VOICE; u.rate=.92; u.pitch=pitch||1; speechSynthesis.speak(u); }
 /* ---------- gauges ---------- */
 const ICON={ eau:'<path d="M12 3C9 8 6 11 6 14.5a6 6 0 0 0 12 0C18 11 15 8 12 3z" fill="#3E8FD6"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  heure:'<circle cx="12" cy="12" r="8.5" fill="#FFF9EE" stroke="#2B2D42" stroke-width="2"/><path d="M12 7v5l3 2" stroke="#2B2D42" stroke-width="2" fill="none" stroke-linecap="round"/>',
  energie:'<path d="M13 2 5 14h6l-1 8 8-12h-6z" fill="#E9A93A" stroke="#9C6A1C" stroke-width="1.2" stroke-linejoin="round"/>',
  sun:'<circle cx="12" cy="12" r="4.5" fill="#F2C230"/><g stroke="#E9A93A" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g>',
  cloud:'<circle cx="9" cy="13" r="4.5" fill="#C9D3DC"/><circle cx="14.5" cy="11" r="5.5" fill="#DDE4EA"/><rect x="5" y="13" width="15" height="5" rx="2.5" fill="#DDE4EA"/>',
  fog:'<g stroke="#9AA6B0" stroke-width="2.2" stroke-linecap="round"><path d="M4 8h16M3 12h14M6 16h15M4 20h12"/></g>',
  rain:'<circle cx="9" cy="10" r="4" fill="#9AA6B0"/><circle cx="14.5" cy="9" r="5" fill="#B3BDC6"/><rect x="5" y="10" width="15" height="4.5" rx="2.2" fill="#B3BDC6"/><g stroke="#3E8FD6" stroke-width="1.8" stroke-linecap="round"><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/></g>' };
 const ico=k=>`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">${ICON[k]}</svg>`;
 const hhmm=m=>`${Math.floor(m/60)%24} h ${String(m%60).padStart(2,'0')}`;
 const meteoName=()=>S.flags.rain?['rain','Pluie']:S.weather>.6?['fog','Brouillard']:S.weather>.25?['cloud','Nuages']:['sun','Soleil'];
 function hud(){ if(!S) return; const set=(id,v,bar,low)=>{ const g=$('#'+id); g.querySelector('.gv').textContent=v; if(bar!=null) g.querySelector('.bar i').style.width=Math.max(0,Math.min(100,bar))+'%'; g.classList.toggle('low',!!low); };
  set('gEau',S.water.toFixed(2).replace(/\.?0+$/,'').replace('.',',')+' L',S.water/7.5*100,S.water<1);
  set('gHeure',hhmm(S.clock)); set('gEnergie',Math.round(S.energy)+' %',S.energy,S.energy<30);
  const [mk,mn]=meteoName(); $('#gMeteo .gi').innerHTML=ico(mk); set('gMeteo',mn);
  $('#hAlt').textContent=MAP?`Altitude : ${MAP.altitude().toLocaleString('fr-CA')} m`:'';
  $('#hPts').textContent=`${total()} points`; }
 setInterval(()=>{ if(MAP&&!$('#hud').hidden) $('#hAlt').textContent=`Altitude : ${MAP.altitude().toLocaleString('fr-CA')} m`; },400);
 const total=()=>Object.values(S.pts).reduce((a,b)=>a+b,0);
 /* ---------- speech box ---------- */
 function faceSVG(look){ return `<svg viewBox="-19 -232 38 46" aria-hidden="true"><rect x="-19" y="-232" width="38" height="46" fill="#C9D6E3"/>${person(Object.assign({},look,{x:0,y:0,noShadow:true}))}</svg>`; }
 function phoneFace(){ return `<svg viewBox="0 0 38 46" aria-hidden="true"><rect width="38" height="46" fill="#1F2433"/><rect x="11" y="7" width="16" height="30" rx="3" fill="#3A4058" stroke="#F2C46D" stroke-width="1.5"/><circle cx="19" cy="33" r="1.6" fill="#F2C46D"/><path d="M14 16h10M14 20h7" stroke="#F2C46D" stroke-width="1.4"/></svg>`; }
 function say(who,text){ return new Promise(res=>{ const c=who&&CAST[who]; const box=$('#say');
   $('#sFace').innerHTML=c?(c.phone?phoneFace():faceSVG(c.look)):who==='me'?faceSVG(lookMe()):`<svg viewBox="0 0 38 46"><rect width="38" height="46" fill="#2E7A55"/><path d="M8 34 L17 18 L21 24 L25 16 L31 34Z" fill="#E3C98F"/></svg>`;
   $('#sWho').textContent=c?T(c.name):who==='me'?P.name:''; $('#sTxt').innerHTML=rich(text); box.hidden=false; speak(text,c&&c.pitch);
   const nx=$('#sNext'); nx.focus({preventScroll:true}); const done=()=>{ nx.onclick=null; document.removeEventListener('keydown',key); box.hidden=true; if('speechSynthesis' in window) speechSynthesis.cancel(); res(); };
   const key=e=>{ if((e.key==='Enter'||e.key===' ')&&!e.repeat&&document.activeElement===nx){ e.preventDefault(); done(); } };
   nx.onclick=done; document.addEventListener('keydown',key); }); }
 function lookMe(){ return playerLook(P,{coat:'teal',noHat:false,hat:'mustard'}); }
 /* ---------- task panel ---------- */
 function task(steps,o={}){ steps=Array.isArray(steps)?steps:[steps];
  return new Promise(res=>{ const pn=$('#panel'), act=$('#pAct'), log=$('#pLog'); let i=0, mistakes=0; const answers=[];
   $('#pKind').textContent=T(o.kind||'Carnet de randonnée'); $('#pTitle').textContent=T(o.title||''); $('#pIntro').innerHTML=o.intro?rich(o.intro):''; log.innerHTML=''; act.innerHTML=''; pn.hidden=false; pn.classList.remove('pmin');
   (o.docs||[]).forEach(d=>{ const c=document.createElement('div'); c.className='doc'; c.innerHTML=d; log.appendChild(c); });
   const close=r=>{ pn.hidden=true; pn.classList.remove('pmin'); act.innerHTML=''; res(r); };
   const ctx={ act, P, store:(S.writing=S.writing||{}), save:()=>{}, toast, wrong:()=>{ mistakes++; }, docLink:()=>'',
    log:el=>{ log.appendChild(el); el.scrollIntoView({block:'nearest'}); },
    me:t=>{ const p=document.createElement('p'); p.className='mine'; p.textContent=T(t); log.appendChild(p); p.scrollIntoView({block:'nearest'}); },
    fb:(kind,fr)=>{ let f=act.querySelector('.fb'); if(!f){ f=document.createElement('div'); act.appendChild(f); } f.className='fb '+kind; f.innerHTML=rich(fr); },
    cont:(label,fn)=>{ act.innerHTML=''; const b=document.createElement('button'); b.className='btn primary cont'; b.type='button'; b.textContent=label||'Continuer'; b.onclick=fn; act.appendChild(b); b.focus({preventScroll:true}); },
    done:(txt,hit)=>{ answers.push({txt,hit}); i++; run(); } };
   const optBtn=(op,box,onPick)=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=rich(op.txt)+(op.note?`<small>${esc(T(op.note))}</small>`:''); if(op.disabled) b.disabled=true; b.onclick=()=>onPick(b); box.appendChild(b); return b; };
   const run=()=>{ const s=steps[i]; window.__step=s||null; if(!s) return close({mistakes,answers}); pn.classList.remove('pmin'); act.innerHTML='';
    if(s.t==='say'){ const p=document.createElement('div'); p.className='dsay'; p.innerHTML=(s.who?`<b>${esc(T(CAST[s.who]?CAST[s.who].name:s.who))} :</b> `:'')+rich(s.text); log.appendChild(p); p.scrollIntoView({block:'nearest'}); ctx.cont(s.btn||'Continuer',()=>ctx.done()); return; }
    if(s.t==='choose'){ act.innerHTML=`<p class="prompt">${rich(s.prompt)}</p><div class="opts"></div>`; const box=act.querySelector('.opts');
     (s.keep?s.opts:STEPS.shuffle(s.opts)).forEach(op=>optBtn(op,box,b=>{ if(op.ok||s.any){ box.querySelectorAll('button').forEach(x=>x.disabled=true); b.classList.add('right'); if(!s.silent) ctx.me(plain(op.txt)); if(op.after) ctx.fb('ok',op.after); setTimeout(()=>ctx.done(op.txt,op),op.after?1400:550); }
       else { b.classList.add('wrong'); b.disabled=true; mistakes++; ctx.fb('err',op.why||'Non. Relis bien.'); } })); return; }
    if(s.t==='order'){ const seq=[]; act.innerHTML=`<p class="prompt">${rich(s.prompt)}</p><ol class="ordered"></ol><div class="opts"></div><div class="row2"><button class="btn" type="button" data-a="clear">Effacer</button></div>`; const ol=act.querySelector('.ordered'), box=act.querySelector('.opts');
     const draw=()=>{ ol.innerHTML=seq.map(x=>`<li>${rich(x.txt)}</li>`).join(''); };
     STEPS.shuffle(s.items.concat(s.traps||[])).forEach(it=>optBtn(it,box,b=>{ if(it.why){ b.classList.add('wrong'); b.disabled=true; mistakes++; ctx.fb('err',it.why); return; }
       const k=seq.length; if(s.items[k]!==it){ mistakes++; ctx.fb('err',s.orderWhy||'Pas encore. Qu\'est-ce qu\'il faut faire d\'abord?'); return; }
       seq.push(it); b.disabled=true; b.classList.add('right'); act.querySelector('.fb')?.remove(); draw();
       if(seq.length===s.items.length){ box.querySelectorAll('button').forEach(x=>x.disabled=true); ctx.me(seq.map(x=>plain(x.txt)).join(' ')); ctx.fb('ok',s.done||'Dans le bon ordre!'); setTimeout(()=>ctx.done(),1100); } }));
     act.querySelector('[data-a=clear]').onclick=()=>{ seq.length=0; box.querySelectorAll('.opt.right').forEach(x=>{ x.disabled=false; x.classList.remove('right'); }); draw(); }; return; }
    if(s.t==='sac'){ const on=new Set(S.bag.length?S.bag:[]); let tries=0;
     act.innerHTML=`<p class="prompt">${rich(s.prompt)}</p><div class="scale"><span>Poids</span><span class="bar"><i></i></span><span class="kg"></span></div><div class="bag"></div><div class="row2"><button class="btn primary check" type="button">On part!</button></div>`;
     const bag=act.querySelector('.bag'), sc=act.querySelector('.scale');
     const kg=()=>s.items.filter(x=>on.has(x.id)).reduce((a,x)=>a+x.kg,0);
     const upd=()=>{ const w=kg(); sc.querySelector('.bar i').style.width=Math.min(100,w/s.max*100)+'%'; sc.querySelector('.kg').textContent=`${w.toFixed(1).replace('.',',')} kg / ${s.max} kg`; sc.classList.toggle('over',w>s.max); };
     s.items.forEach(x=>{ const b=document.createElement('button'); b.type='button'; b.className='it'+(on.has(x.id)?' on':''); b.setAttribute('aria-pressed',on.has(x.id)); b.innerHTML=`${rich(x.txt)}<span>${String(x.kg).replace('.',',')} kg</span>`;
      b.onclick=()=>{ on.has(x.id)?on.delete(x.id):on.add(x.id); b.classList.toggle('on',on.has(x.id)); b.setAttribute('aria-pressed',on.has(x.id)); act.querySelector('.fb')?.remove(); upd(); }; bag.appendChild(b); }); upd();
     act.querySelector('.check').onclick=()=>{ const trap=s.items.find(x=>x.trap&&on.has(x.id)); if(trap){ mistakes++; ctx.fb('err',`${trap.txt} : ${trap.why}`); return; }
      if(kg()>s.max){ mistakes++; ctx.fb('err',s.overWhy); return; }
      const miss=s.items.filter(x=>x.need&&!on.has(x.id)); if(miss.length&&tries===0){ tries++; mistakes++; ctx.fb('err',s.missWhy); return; }
      if(miss.length) mistakes+=miss.length-1;
      S.bag=[...on]; act.querySelectorAll('button').forEach(b=>b.disabled=true); ctx.me(s.items.filter(x=>on.has(x.id)).map(x=>plain(x.txt)).join(', ')); ctx.fb(miss.length?'err':'ok',miss.length?s.goAnyway:s.done); setTimeout(()=>ctx.done(),miss.length?2200:1100); }; return; }
    if(s.t==='groupe'){ act.innerHTML=`<p class="prompt">${rich(s.prompt)}</p><div class="cards"></div>`; const cards=act.querySelector('.cards'); let left=s.cards.length;
     s.cards.forEach(cd=>{ const el=document.createElement('div'); el.className='hcard'; const c=CAST[cd.who];
      el.innerHTML=`<div class="face">${faceSVG(c.look)}</div><div><h4>${esc(T(c.name))}</h4><p class="shows">${rich(cd.shows)}</p><div class="row diag"></div><div class="row give" hidden></div><p class="res" hidden></p></div>`; cards.appendChild(el);
      const diag=el.querySelector('.diag'), give=el.querySelector('.give'), resP=el.querySelector('.res');
      STEPS.shuffle(cd.diag).forEach(op=>optBtn(op,diag,b=>{ if(!op.ok){ b.classList.add('wrong'); b.disabled=true; mistakes++; ctx.fb('err',op.why||cd.hint); return; }
        diag.querySelectorAll('button').forEach(x=>x.disabled=true); b.classList.add('right'); act.querySelector('.fb')?.remove(); give.hidden=false;
        cd.give.forEach(g=>{ const miss=g.item&&!S.bag.includes(g.item), dry=g.water&&S.water<g.water-1e-6; const gg=Object.assign({},g,{disabled:miss||dry,note:miss?'pas dans le sac':dry?'plus assez d\'eau':''});
         optBtn(gg,give,b2=>{ if(!g.ok){ b2.classList.add('wrong'); b2.disabled=true; mistakes++; ctx.fb('err',g.why||'Ça ne l\'aide pas vraiment.'); return; }
          give.querySelectorAll('button').forEach(x=>x.disabled=true); b2.classList.add('right'); if(g.water) A.water(-g.water); if(g.energy) A.energy(g.energy); if(g.min) A.time(g.min);
          resP.hidden=false; resP.innerHTML=rich(g.res||'Ça va mieux.'); el.classList.add('done'); act.querySelector('.fb')?.remove(); if(--left===0){ ctx.fb('ok',s.done||'Tout le monde va mieux.'); setTimeout(()=>ctx.done(),1300); } }); });
        if(cd.give.every(g=>(g.item&&!S.bag.includes(g.item))||(g.water&&S.water<g.water-1e-6)||!g.ok)){ resP.hidden=false; resP.innerHTML=rich(cd.none||'Tu n\'as rien pour l\'aider. Dommage.'); el.classList.add('done'); A.energy(-10); mistakes++; if(--left===0){ setTimeout(()=>ctx.done(),1300); } } })); }); return; }
    if(s.t==='phone'){ const ph=document.createElement('div'); ph.className='phone'; ph.innerHTML=`<div class="op"><b>${esc(T(s.who||'112'))}</b>${rich(s.text)}</div>`; log.appendChild(ph); ph.scrollIntoView({block:'nearest'}); if(s.next) return ctx.done(); ctx.cont(s.btn||'Répondre',()=>ctx.done()); return; }
    if(s.t==='pick'){ pn.classList.add('pmin'); act.innerHTML=`<p class="prompt">${rich(s.prompt)}</p>`; MAP.pickSign(s.keys).then(k=>{ if(k===s.ok){ ctx.me(s.say||k); ctx.fb('ok',s.done||'Oui!'); setTimeout(()=>ctx.done(k),900); } else { mistakes++; ctx.fb('err',s.why); setTimeout(run,1400); } }); return; }
    if(s.t==='number'&&s.live) s.rows.forEach(r=>{ if(r.live) r.ans=r.live(); });
    STEPS.run(s,ctx); };
   run(); }); }
 /* ---------- lexique ---------- */
 function openLexique(){ const L=$('#lexique'); const entries=Object.keys(GLOSSARY).sort((a,b)=>a.localeCompare(b,'fr'));
  L.innerHTML=`<div class="lexwin" role="dialog" aria-modal="true" aria-label="Lexique"><div class="lexhead"><h2>Lexique</h2><input type="search" placeholder="Cherche un mot…" aria-label="Chercher un mot"><button class="btn" type="button">Fermer</button></div><ul></ul></div>`;
  const ul=L.querySelector('ul'), inp=L.querySelector('input'); const draw=()=>{ const q=STEPS.deaccent(inp.value.toLowerCase()); ul.innerHTML=entries.filter(w=>STEPS.deaccent(w).includes(q)).map(w=>{ const g=GLOSSARY[w]; const [en,note]=Array.isArray(g)?g:[g]; return `<li><b>${esc(w)}</b><span>${esc(en)}${note?` <i>${esc(note)}</i>`:''}</span></li>`; }).join(''); };
  draw(); inp.oninput=draw; L.hidden=false; inp.focus(); const close=()=>{ L.hidden=true; L.innerHTML=''; }; L.querySelector('.btn').onclick=close; L.onclick=e=>{ if(e.target===L) close(); }; }
 /* ---------- api for the script ---------- */
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const A={ get S(){ return S; }, get P(){ return P; }, get MAP(){ return MAP; }, T, rich, say, task, toast, wait,
  water(d){ S.water=Math.max(0,+(S.water+d).toFixed(2)); hud(); }, time(m){ S.clock+=m; hud(); }, at(m){ S.clock=Math.max(S.clock,m); hud(); },
  energy(d){ S.energy=Math.max(0,Math.min(100,S.energy+d)); hud(); }, weather(w){ S.weather=w; MAP&&MAP.setWeather(w); hud(); }, rain(on){ S.flags.rain=!!on; MAP&&MAP.rain(on); hud(); },
  has:id=>S.bag.includes(id), stage(name){ $('#hStage').textContent=T(name); },
  async walk(u,speed){ const d=Math.abs(u-S.u); S.u=u; await MAP.walkTo(u,speed); S.water=Math.max(0,+(S.water-d*2.6).toFixed(2)); hud(); },
  /* points for a stage: max minus per-mistake cost, never below the floor */
  score(id,max,mistakes,per=2,floor=0){ S.pts[id]=Math.max(floor,max-(mistakes||0)*per); S.mist[id]=mistakes||0; hud(); return S.pts[id]; },
  bonus(id,n){ S.pts[id]=n; hud(); } };
 /* ---------- game flow ---------- */
 function lookFor3D(){ const sk=k=>SKIN[k].m;
  return [[ '#3F7D86','#E9A93A',sk(P.skin??1),'#F2C46D' ],[ '#77804F','#9B2F2F',sk(4),'#E9A93A' ],[ '#C8102E','#2B2D42',sk(4),'#2B2D42' ],[ '#7D8590','#2A9D8F',sk(1),'#E9E4D6' ]]; }
 function mountMap(){ const el=$('#map'); if(MAP) MAP.dispose(); const o={group:lookFor3D(),signs:SIGNS,start:S?S.u:0};
  MAP=(!flat&&PELEE3D.supported())?PELEE3D.mount(el,o):(flat=true,PELEE2D.mount(el,o)); if(S){ MAP.setAt(S.u); MAP.setWeather(S.weather); MAP.rain(!!S.flags.rain); }
  $('#bFlat').textContent=flat?'Carte 3D':'Carte simple'; }
 function save(){ const d=DB.get(); d.state=S; DB.set(d); }
 async function play(){ $('#title').hidden=true; $('#hud').hidden=false; hud();
  while(S.stage<STAGES.length){ const st=STAGES[S.stage]; save(); await st(A); S.stage++; save(); }
  return endScreen(); }
 function fresh(){ S=JSON.parse(JSON.stringify(INIT)); mountMap(); hud(); play(); }
 function title(){ const d=DB.get(), t=$('#title');
  t.innerHTML=`<div class="tcard"><p class="tk">Le grand voyage · Escale 7 · Martinique</p><h1>La montagne Pelée</h1><p class="ts">Une randonnée avec Joëlle, Kévin et M. Lefèvre. ${esc(T('Prêt{|e}, [nom]?'))}</p>
   <div class="tb"><button class="btn accent" type="button" id="tNew">Nouvelle randonnée</button>${d.state&&d.state.stage>0&&d.state.stage<STAGES.length?'<button class="btn" type="button" id="tCont">Continuer</button>':''}</div>
   <p class="tf"><button class="pill" type="button" id="tFlat">${flat?'Carte 3D':'Carte simple (ordinateur lent)'}</button></p>
   <p class="tf">Fais glisser la souris pour tourner la vue. La molette : zoomer. Touche les mots soulignés pour voir leur sens.</p></div>`;
  t.hidden=false; $('#tNew').onclick=fresh; $('#tFlat').onclick=()=>{ flat=!flat; mountMap(); title(); }; const c=$('#tCont'); if(c) c.onclick=()=>{ S=d.state; mountMap(); hud(); play(); }; $('#tNew').focus(); }
 /* ---------- end screen ---------- */
 function stampCard(me,stars,date,score){ return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520"><rect x="6" y="6" width="788" height="508" rx="22" fill="#FFF9EE" stroke="${me.color}" stroke-width="4"/><rect x="20" y="20" width="760" height="480" rx="14" fill="none" stroke="${me.color}" stroke-width="1.5" stroke-dasharray="6 6"/>
  <svg x="50" y="90" width="300" height="300" viewBox="-60 -60 120 120">${stampSVG(me,'done',date.toUpperCase()).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>
  <text x="390" y="100" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="15" letter-spacing="2" fill="#6B6F7A">PASSEPORT · LE GRAND VOYAGE</text><text x="390" y="180" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="50" fill="#2B2D42">${esc(P.name)}</text>
  <text x="390" y="228" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="22" fill="#2B2D42">Martinique — La montagne Pelée</text><text x="390" y="262" font-family="Fraunces,Georgia,serif" font-style="italic" font-size="19" fill="#6B6F7A">${esc(T('Randonneu{r|se} et chef de groupe'))}</text>
  <text x="390" y="302" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="19" fill="#2B2D42">Visité le ${esc(date)} · ${score} points sur 100</text><text x="390" y="352" font-family="Arial,sans-serif" font-size="36" fill="#E9A93A" letter-spacing="4">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</text>
  <text x="390" y="416" font-family="Inter,Arial,sans-serif" font-size="16" fill="#6B6F7A">Escale réussie.</text><text x="390" y="440" font-family="Inter,Arial,sans-serif" font-size="16" fill="#6B6F7A">Présente ce tampon à ton enseignant·e.</text></svg>`; }
 function savePNG(svg,w,h,name){ const img=new Image(); const dl=(href,n)=>{ const a=document.createElement('a'); a.href=href; a.download=n; document.body.appendChild(a); a.click(); a.remove(); };
  img.onload=()=>{ const c=document.createElement('canvas'); c.width=w*2; c.height=h*2; const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height); c.toBlob(b=>dl(URL.createObjectURL(b),name),'image/png'); };
  img.onerror=()=>dl(URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),name.replace(/\.png$/,'.svg')); img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg); }
 function endScreen(){ $('#hud').hidden=true; $('#cine').hidden=true; const score=Math.min(100,total()), stars=score>=85?3:score>=60?2:1, date=new Date().toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:'numeric'});
  const p=Store.get()||P; p.done=p.done||{}; if(!p.done.martinique) p.done.martinique=date; p.stars=p.stars||{}; p.stars.martinique=Math.max(p.stars.martinique||0,stars); Store.set(p); P=p;
  const d=DB.get(); d.best=Math.max(d.best||0,score); d.state=null; DB.set(d);
  if(!S.awarded){ S.awarded=true; window.GVJetons&&GVJetons.award('fr20-martinique',score/100); }
  const me=JOURNEY.find(j=>j.id==='martinique'), nx=nextStop(p), slug=P.name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const E=$('#endscr'); E.innerHTML=`<div class="ecard"><div class="stampwrap">${stampSVG(me,'done',String(p.done.martinique).toUpperCase())}</div><div>
   <p class="eyebrow">Escale 7 réussie · Martinique</p><h1>${esc(T('Bravo, [nom]!'))}</h1><p>${esc(T('Tu as guidé le groupe, soigné Joëlle et appelé les secours. Joëlle va bien, et M. Lefèvre visite maintenant les musées. Au rez-de-chaussée.'))}</p>
   <div class="bigstars" aria-label="${stars} étoiles sur 3">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p><b>${score} points sur 100</b> (meilleur score : ${d.best})</p>
   <ul class="breakdown">${BREAKDOWN.map(([k,lab,max])=>`<li>${esc(lab)} : ${S.pts[k]||0} / ${max}</li>`).join('')}</ul>
   <p>Prochaine escale : <b>${nx?nx.place+' — '+nx.sub:'retour à Calgary'}</b>${nx&&!nx.ready?' (bientôt disponible)':''}</p>
   <div class="endbtns"><button class="btn accent" type="button" id="eStamp">Télécharger mon tampon (PNG)</button><button class="btn" type="button" id="ePrint">Imprimer mon tampon</button><a class="btn" href="voyage.html">Mon voyage</a><button class="btn" type="button" id="eAgain">Rejouer l'escale</button></div>
   <p class="hint">Ton tampon est ta preuve de réussite : enregistre-le et téléverse-le dans Teams, ou imprime-le.</p></div></div>`;
  E.hidden=false; const card=()=>stampCard(me,stars,String(p.done.martinique),score);
  $('#eStamp').onclick=()=>savePNG(card(),800,520,`passeport-${slug}-martinique.png`);
  $('#ePrint').onclick=()=>{ $('#printArea').innerHTML=card(); window.print(); };
  $('#eAgain').onclick=()=>{ E.hidden=true; fresh(); }; }
 /* ---------- start ---------- */
 function start(){ P=Store.get();
  [['gEau','eau'],['gHeure','heure'],['gEnergie','energie']].forEach(([id,k])=>{ $('#'+id+' .gi').innerHTML=ico(k); });
  $('#bLex').onclick=openLexique; $('#pLex').onclick=openLexique;
  $('#bVoice').onclick=()=>{ voice=!voice; $('#bVoice').setAttribute('aria-pressed',voice); if(voice){ pickVoice(); if(!VOICE){ toast('Aucune voix française sur cet appareil : la lecture est désactivée.'); voice=false; $('#bVoice').setAttribute('aria-pressed','false'); } } };
  $('#bFlat').onclick=()=>{ flat=!flat; mountMap(); };
  const go=()=>{ $('#create').hidden=true; S=S||JSON.parse(JSON.stringify(INIT)); mountMap(); title(); };
  if(P&&P.name) go(); else { const c=$('#create'); c.hidden=false; mountCreator(c.querySelector('.cwrap'),p=>{ P=p; go(); }); } }
 return { start, A, get S(){ return S; }, get MAP(){ return MAP; }, hud, _fresh:fresh };
})();
