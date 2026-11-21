/* ===== Shared learning steps (games 5–8): doc, plan, tiles, pack, number, letter.
   STEPS.run(s, ctx) renders step s into ctx.act. ctx = {
     act: container element, P: profile, done(): step solved, wrong(): count a mistake,
     me(text): echo the student's answer, fb(kind, fr, en): feedback line, log(el): show a document or letter,
     store: object that keeps letter drafts, save(): persist store, toast(text), docLink(): html, onTilesOk(s): optional } ===== */
const STEPS=(()=>{
 const PRAISE=['Bravo!','Excellent!','Parfait!','Super!','Bien joué!','Exactement!'];
 const praise=()=>PRAISE[Math.floor(Math.random()*PRAISE.length)];
 function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
 function deaccent(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’]/g,"'"); }
 function normTxt(s){ return deaccent(s.toLowerCase()).replace(/\s+([.,!?])/g,'$1').replace(/\s+/g,' ').trim(); }
 function joinTiles(a){ return a.reduce((acc,t)=>acc+(acc===''||acc.endsWith("'")||/^[.,!?]/.test(t)?'':' ')+t,''); }
 const promptHTML=(s,P)=>`<p class="prompt">${esc(fmt(s.prompt,P))}</p>${s.en?`<p class="en">${esc(fmt(s.en,P))}</p>`:''}`;
 function letterParts(s,ctx){ const P=ctx.P, d=new Date().toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'});
  return {place:fmt(s.place||'Calgary',P)+', le '+d, greet:fmt(s.greet,P), paras:s.sections.map(x=>(ctx.store[x.id]||'').trim()), close:fmt(s.close||'Amitiés,',P), name:P.name}; }
 function letterHTML(s,ctx){ const L=letterParts(s,ctx); return `${s.heading?`<p class="lhead">${esc(fmt(s.heading,ctx.P))}</p>`:''}<p class="lplace">${esc(L.place)}</p><p>${esc(L.greet)}</p>${L.paras.map(p=>`<p>${esc(p)}</p>`).join('')}<p>${esc(L.close)}</p><p class="lsign">${esc(L.name)}</p>`; }
 function letterText(s,ctx){ const L=letterParts(s,ctx); return [...(s.heading?[fmt(s.heading,ctx.P),'']:[]),L.place,'',L.greet,'',...L.paras.flatMap(p=>[p,'']),L.close,L.name].join('\n'); }
 /* check one written section: returns a list of messages (grammar errors first) */
 function checkSection(x,txt){ const n=deaccent(txt.toLowerCase()), gram=[], need=[];
  const words=(txt.match(/[A-Za-zÀ-ÿ'’-]+/g)||[]).length;
  (x.checks||[]).forEach(c=>{ const re=new RegExp(c.re,'g'); const m=n.match(re)||[]; if(c.not){ if(m.length) gram.push(c.msg); } else if(m.length<(c.count||1)) need.push(c.msg); });
  const errs=[...gram,...need]; if(words<(x.min||10)) errs.push(`Écris au moins ${x.min||10} mots (tu en as ${words}).`); return errs; }

 function run(s,ctx){
  const act=ctx.act, P=ctx.P, fb=ctx.fb, docLink=ctx.docLink||(()=>'');
  act.innerHTML='';
  if(s.t==='doc'){
   const c=document.createElement('div'); c.className='doc'; let body='';
   if(s.table) body+=`<div class="tablewrap"><table class="board doctable"><thead><tr>${s.table[0].map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.slice(1).map(r=>`<tr>${r.map((v,j)=>j?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
   if(s.lines) body+=`<ul>${s.lines.map(l=>`<li>${esc(fmt(l,P))}</li>`).join('')}</ul>`;
   c.innerHTML=`<span class="k">${esc(s.kind||'Document')}</span><h3>${esc(s.title)}</h3>${body}${s.en?`<p class="en">${esc(s.en)}</p>`:''}`;
   ctx.log(c); ctx.cont?ctx.cont('J\'ai lu',ctx.done):ctx.done();
  }
  else if(s.t==='plan'){
   const pos={}; let sel=null;
   act.innerHTML=promptHTML(s,P)+docLink()+`<div class="plan"><div class="chips" role="group" aria-label="${esc(s.itemsLabel||'À placer')}"></div><ol class="slots"></ol></div><div class="row2"><button class="btn primary check" type="button">Vérifier</button></div>`;
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
    if(missing.length){ fb('err','Place tout avant de vérifier.','Place everything before checking.'); return; }
    if(bad.length){ ctx.wrong(); bad.forEach(it=>slots.querySelectorAll('.slot')[pos[it.id]].classList.add('bad')); const it=bad[0]; fb('err',`${fmt(it.txt,P)} : ${it.why}`+(bad.length>1?` (Encore ${bad.length-1} autre${bad.length>2?'s':''} à revoir.)`:''),it.whyEn); return; }
    act.querySelectorAll('button').forEach(b=>b.disabled=true);
    ctx.me(s.say||s.slots.map((lab,k)=>{const id=Object.keys(pos).find(i=>pos[i]===k);return id?`${lab} : ${s.items.find(x=>x.id===id).txt}`:null;}).filter(Boolean).join(' · '));
    fb('ok',s.done||'Ton plan fonctionne!'); setTimeout(ctx.done,1100);
   });
  }
  else if(s.t==='tiles'){
   const built=[];
   act.innerHTML=promptHTML(s,P)+docLink()+`<p class="sentence built" aria-live="polite"><span class="muted">Touche les mots dans l'ordre.</span></p><div class="tilebank"></div><div class="row2"><button class="btn" type="button" data-a="clear">Effacer</button><button class="btn primary check" type="button">Vérifier</button></div>`;
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
    const hit=(s.answers||[s.answer]).find(a=>normTxt(fmt(a,P))===normTxt(txt));
    if(hit!==undefined){ act.querySelectorAll('button').forEach(b=>b.disabled=true); ctx.me(txt); ctx.onTilesOk&&ctx.onTilesOk(s,txt,hit); fb('ok',s.okMsg||praise()); setTimeout(()=>ctx.done(txt,hit),850); return; }
    ctx.wrong(); const dg=s.diagnose&&s.diagnose(txt); const h=!dg&&built.map(o=>o.t).find(t=>s.hints&&s.hints[t]);
    if(dg){ fb('err',dg); return; }
    fb('err',h?s.hints[h]:(built.length<(s.min||3)?'Ta phrase n\'est pas complète.':(s.why||'Pas tout à fait. Vérifie la forme du verbe et l\'ordre des mots.')),h?null:s.whyEn);
   });
  }
  else if(s.t==='pack'){
   const on=new Set();
   act.innerHTML=promptHTML(s,P)+docLink()+`<div class="packgrid"></div><div class="row2"><button class="btn primary check" type="button">Vérifier</button></div>`;
   const grid=act.querySelector('.packgrid');
   s.items.forEach((it,k)=>{ const b=document.createElement('button'); b.type='button'; b.className='pack'; b.textContent=fmt(it.txt,P); b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{ on.has(k)?on.delete(k):on.add(k); b.setAttribute('aria-pressed',on.has(k)); b.classList.toggle('on',on.has(k)); act.querySelector('.fb')?.remove(); }); grid.appendChild(b); });
   act.querySelector('.check').addEventListener('click',()=>{
    const extra=s.items.filter((it,k)=>!it.need&&on.has(k)), miss=s.items.filter((it,k)=>it.need&&!on.has(k));
    if(!extra.length&&!miss.length){ act.querySelectorAll('button').forEach(b=>b.disabled=true); ctx.me(s.say||s.items.filter(it=>it.need).map(it=>it.txt).join(', ')); fb('ok',s.done||'Parfait, tu as tout!'); setTimeout(ctx.done,1000); return; }
    ctx.wrong();
    if(extra.length) fb('err',`${fmt(extra[0].txt,P)} : ${extra[0].why}`,extra[0].whyEn);
    else fb('err',s.missing||'Il manque encore quelque chose. Relis le document.',s.missingEn);
   });
  }
  else if(s.t==='number'){
   act.innerHTML=promptHTML(s,P)+docLink()+`<div class="numgrid">${s.rows.map((r,k)=>`<label class="numrow"><span>${esc(fmt(r.label,P))}</span><input type="text" inputmode="decimal" autocomplete="off" data-k="${k}" aria-label="${esc(r.label)}"><span class="unit">${esc(r.unit||'')}</span></label>`).join('')}</div><div class="row2"><button class="btn primary check" type="button">Vérifier</button></div>`;
   act.querySelector('.check').addEventListener('click',()=>{
    const ins=[...act.querySelectorAll('input')]; let firstBad=null;
    ins.forEach(inp=>{ const r=s.rows[+inp.dataset.k], raw=inp.value.trim(); let v;
     if(r.time){ const m=raw.match(/^(\d{1,2})\s*(?:h|:)\s*(\d{0,2})/i); v=m?(+m[1])*60+(+(m[2]||0)):NaN; }
     else v=parseFloat(raw.replace(',','.').replace(/[^0-9.\-]/g,''));
     const ok=!isNaN(v)&&Math.abs(v-r.ans)<=(r.tol||0);
     inp.classList.toggle('bad',!ok); inp.classList.toggle('good',ok); if(!ok&&firstBad===null) firstBad=r; });
    if(firstBad){ ctx.wrong(); fb('err',`${fmt(firstBad.label,P)} : ${firstBad.why||'Recalcule.'}`,firstBad.whyEn); return; }
    act.querySelectorAll('button,input').forEach(b=>b.disabled=true);
    ctx.me(s.say||s.rows.map(r=>`${r.label} : ${r.time?`${Math.floor(r.ans/60)} h ${String(r.ans%60).padStart(2,'0')}`:String(r.ans).replace('.',',')} ${r.unit||''}`).join(' · ')); fb('ok',s.done||'Calcul parfait!'); setTimeout(ctx.done,1000);
   });
  }
  else if(s.t==='letter'){
   const store=ctx.store;
   act.innerHTML=promptHTML(s,P)+`<div class="lettergrid">${s.sections.map((x,k)=>`<label class="lsec"><span class="lt">${k+1}. ${esc(x.label)}</span><span class="lp">${esc(fmt(x.prompt,P))}</span>${x.en?`<span class="en">${esc(x.en)}</span>`:''}<textarea rows="4" data-k="${k}" spellcheck="false" placeholder="${esc(x.placeholder||'')}"></textarea><span class="lerr" aria-live="polite"></span></label>`).join('')}</div><div class="row2"><button class="btn primary check" type="button">${esc(s.checkLabel||'Vérifier ma lettre')}</button></div>`;
   const areas=[...act.querySelectorAll('textarea')];
   areas.forEach(a=>{ a.value=store[s.sections[+a.dataset.k].id]||''; a.addEventListener('input',()=>{ store[s.sections[+a.dataset.k].id]=a.value; ctx.save(); }); });
   act.querySelector('.check').addEventListener('click',()=>{
    let bad=0;
    areas.forEach(a=>{ const x=s.sections[+a.dataset.k], errs=checkSection(x,a.value.trim());
     a.closest('.lsec').classList.toggle('bad',!!errs.length); a.closest('.lsec').classList.toggle('good',!errs.length);
     a.closest('.lsec').querySelector('.lerr').textContent=errs.slice(0,2).join(' '); if(errs.length) bad++; });
    if(bad){ ctx.wrong(); fb('err',`Encore ${bad} partie${bad>1?'s':''} à améliorer. Lis les conseils en rouge.`,'Read the red notes to improve your letter.'); return; }
    act.querySelectorAll('button,textarea').forEach(b=>b.disabled=true);
    const html=letterHTML(s,ctx); const c=document.createElement('div'); c.className='letter'; c.innerHTML=html; ctx.log(c);
    act.innerHTML=''; fb('ok',s.done||'Ta lettre est prête!');
    const row=document.createElement('div'); row.className='row2';
    row.innerHTML=`<button class="btn" type="button" data-a="print">${esc(s.printLabel||'Imprimer ma lettre')}</button><button class="btn" type="button" data-a="copy">Copier le texte</button><button class="btn primary cont" type="button">Continuer</button>`;
    act.appendChild(row);
    row.querySelector('[data-a=print]').addEventListener('click',()=>{ document.querySelector('#printArea').innerHTML=`<div class="printLetter">${html}</div>`; const pg=document.createElement('style'); pg.textContent='@page{size:portrait;margin:18mm}'; document.head.appendChild(pg); window.print(); setTimeout(()=>pg.remove(),500); });
    row.querySelector('[data-a=copy]').addEventListener('click',()=>{ const t=letterText(s,ctx); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>ctx.toast('Texte copié!')).catch(()=>ctx.toast('Copie impossible : utilise Imprimer.')); });
    row.querySelector('.cont').addEventListener('click',()=>ctx.done());
   });
  }
  else return false;
  return true;
 }
 return { run, shuffle, deaccent, normTxt, joinTiles, checkSection, praise };
})();
