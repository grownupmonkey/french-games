// Runs in the page: performs one correct action for the current step; returns a label.
(mode)=>{
 const g=window.__game, st=g.state, s=st.step, P=st.P, $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
 const cont=$('#act .cont'); if(cont && !cont.disabled){ cont.click(); return 'cont'; }
 if(!s) return 'none';
 const byText=(sel,txt)=>$$(sel).find(b=>b.textContent.trim()===txt && !b.disabled);
 if(s.t==='choice'||s.t==='board'){ const o=s.opts.find(o=>o.ok); byText('#act .opt',fmt(o.txt,P))?.click(); return 'choice'; }
 if(s.t==='fill'){ byText('#act .opt',s.ans)?.click(); return 'fill'; }
 if(s.t==='order'){ const items=s.items.map(x=>fmt(x,P)); const done=$$('#act .orderBuilt li').length; byText('#act .opt',items[done])?.click(); return 'order'; }
 if(s.t==='plan'){
  if(mode==='wrong' && !window.__wrongPlan){ window.__wrongPlan=1; s.items.forEach((it,k)=>{ byText('#act .chip',fmt(it.txt,P))?.click(); $$('#act .slot')[k]?.click(); }); $('#act .check').click(); return 'plan-wrong'; }
  if($('#act .fb.err')){ $$('#act .slot.full').forEach(b=>b.click()); }
  s.items.forEach(it=>{ byText('#act .chip',fmt(it.txt,P))?.click(); $$('#act .slot')[it.ok[0]]?.click(); });
  $('#act .check')?.click(); return 'plan';
 }
 if(s.t==='tiles'){
  $$('#act .built .tile').forEach(b=>b.click());
  let rest=fmt(s.answers?s.answers[0]:s.answer,P);
  for(let guard=0;guard<30&&rest.length;guard++){ rest=rest.replace(/^\s+/,''); const b=$$('#act .tilebank .tile:not(:disabled)').sort((a,b)=>b.textContent.length-a.textContent.length).find(b=>rest.startsWith(b.textContent)); if(!b) break; rest=rest.slice(b.textContent.length); b.click(); }
  $('#act .check')?.click(); return 'tiles';
 }
 if(s.t==='arrange'){
  const pg=window.__game.state.PR && document.querySelector('#act .caps') && null;
  const stopObj=STOPS.find(x=>x.id===st.stop), page=stopObj.page;
  const place=(alt,k)=>{ const b=$$('#act .thumb').find(t=>t.getAttribute('aria-label')==='Image : '+fmt(alt,P)); if(b){ b.click(); $$('#act .capslot')[k].click(); } };
  if(mode==='wrong' && !window.__wrongArr){ window.__wrongArr=1; page.panels.forEach((p,k)=>place(k===2&&page.decoys?page.decoys[0].alt:p.alt,k)); $('#act .check').click(); return 'arrange-wrong'; }
  page.panels.forEach((p,k)=>place(p.alt,k)); $('#act .check')?.click(); return 'arrange';
 }
 if(s.t==='pack'){ $$('#act .pack').forEach((b,k)=>{ const need=s.items[k]?.need; if(b.classList.contains('on')!==!!need) b.click(); }); $('#act .check')?.click(); return 'pack'; }
 if(s.t==='number'){ $$('#act input').forEach(inp=>{ inp.value=String(s.rows[+inp.dataset.k].ans).replace('.',','); }); $('#act .check')?.click(); return 'number'; }
 if(s.t==='letter'){
  const good={moi:"Bonjour! Je m'appelle Sam. J'ai quinze ans. J'habite à Calgary, en Alberta, et je vais à une grande école secondaire.",
   routine:"Le matin, je me réveille à 6 h 45. Ensuite, je me douche et je m'habille vite. Je me brosse les dents après le petit-déjeuner.",
   ecole:"Chez moi, les cours finissent à 15 h. Au lycée de Quimper, ils finissent à 17 h. À Calgary, il faut prendre le bus jaune.",
   question:"Est-ce que tu aimes le hockey? Quelle belle ville, Quimper!"};
  const bad={moi:"Salut.",routine:"Je lève à 7 h et je me lever tard.",ecole:"Mon école est grande.",question:"Quel belle région."};
  const src=(mode==='wrong'&&!window.__wrongLetter)?bad:good; if(src===bad) window.__wrongLetter=1;
  $$('#act textarea').forEach(a=>{ a.value=src[s.sections[+a.dataset.k].id]; a.dispatchEvent(new Event('input')); }); $('#act .check')?.click(); return src===bad?'letter-wrong':'letter';
 }
 return 'wait:'+s.t;
}
