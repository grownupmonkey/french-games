/* ===== L'enquête: Sierra-style adventure engine (rooms, walking, verbs, text boxes, inventory, score, failures). ===== */
const ADV=(()=>{
 const W=1280,H=800, NS='http://www.w3.org/2000/svg';
 const $=s=>document.querySelector(s);
 const G={ roomId:null, flags:{}, inv:[], sel:null, verb:'walk', score:0, scored:{}, clock:22*60+47, notes:[], wearing:{}, px:0, py:0, face:'front', seen:{} };
 let ROOMS={}, ITEMS={}, CFG={}, profile=null, room=null, checkpoint=null;
 let player=null, npcs=[], props=[], busy=false, focusIdx=-1, showZones=false, hoverHs=null, ptr={x:-1,y:-1,in:false};
 const T=(s)=>fmt(s,profile);
 const SKEY='jeuxFr20.enquete', NSLOTS=6;
 const DB={ get(){ try{ return JSON.parse(localStorage.getItem(SKEY))||{slots:[],prefs:{}}; }catch(e){ return DB._m||{slots:[],prefs:{}}; } },
  set(d){ DB._m=d; try{ localStorage.setItem(SKEY,JSON.stringify(d)); }catch(e){} } };
 const prefs=()=>{ const d=DB.get(); d.prefs=d.prefs||{}; return d.prefs; };
 function setPref(k,v){ const d=DB.get(); d.prefs=d.prefs||{}; d.prefs[k]=v; DB.set(d); }
 /* French-only read-aloud (fr-CA, then fr-FR); never an English voice */
 let VOICE=null, noVoiceWarned=false;
 function pickVoice(){ if(!('speechSynthesis' in window)) return; const fr=speechSynthesis.getVoices().filter(x=>/^fr/i.test(x.lang));
   VOICE=fr.find(x=>/^fr[-_]CA/i.test(x.lang))||fr.find(x=>/^fr[-_]FR/i.test(x.lang))||fr[0]||null; }
 if('speechSynthesis' in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
 const plain=t=>T(t).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g,'$1').replace(/\*\*/g,'');
 function speak(t){ if(!('speechSynthesis' in window)){ toast('La lecture à voix haute n\'est pas disponible dans ce navigateur.'); return; } pickVoice();
   if(!VOICE){ if(!noVoiceWarned){ noVoiceWarned=true; toast('Aucune voix française sur cet appareil : la lecture est désactivée.'); } return; }
   speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(plain(t)); u.lang=VOICE.lang; u.voice=VOICE; u.rate=.92; speechSynthesis.speak(u); }
 function hush(){ if('speechSynthesis' in window) speechSynthesis.cancel(); }
 function toast(t){ const el=$('#advToast'); el.textContent=t; el.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>el.hidden=true,3200); }

 /* ---------- geometry ---------- */
 const inPoly=(p,poly)=>{ let c=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const a=poly[i],b=poly[j];
   if(((a[1]>p[1])!==(b[1]>p[1])) && (p[0] < (b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])) c=!c; } return c; };
 const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
 const segX=(a,b,c,d)=>{ const d1=cross(c,d,a),d2=cross(c,d,b),d3=cross(a,b,c),d4=cross(a,b,d); return ((d1>0&&d2<0)||(d1<0&&d2>0))&&((d3>0&&d4<0)||(d3<0&&d4>0)); };
 const edges=poly=>poly.map((p,i)=>[p,poly[(i+1)%poly.length]]);
 const blocks=()=>(room.obstacles||[]).concat(npcs.filter(n=>n.block).map(n=>n.block)).concat((room.dyn||[]).filter(o=>!o.when||o.when(G)).map(o=>o.poly));
 const valid=p=>inPoly(p,room.walk)&&!blocks().some(o=>inPoly(p,o));
 const segOK=(a,b)=>{ const all=[room.walk,...blocks()];
   for(const poly of all) for(const [c,d] of edges(poly)) if(segX(a,b,c,d)) return false;
   for(const t of [.2,.4,.6,.8]) if(!valid([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])) return false; return true; };
 const nearestValid=p=>{ if(valid(p)) return p; for(let r=6;r<500;r+=6) for(let k=0;k<24;k++){ const a=k/24*Math.PI*2, q=[p[0]+Math.cos(a)*r,p[1]+Math.sin(a)*r*.6]; if(valid(q)) return q; } return [player.x,player.y]; };
 function navNodes(){ const out=[]; const add=(v)=>{ for(let k=0;k<8;k++){ const a=k/8*Math.PI*2+Math.PI/8, q=[v[0]+Math.cos(a)*9,v[1]+Math.sin(a)*9]; if(valid(q)){ out.push(q); } } };
   room.walk.forEach(add); blocks().forEach(o=>o.forEach(add)); return out; }
 function findPath(a,b){ b=nearestValid(b); if(segOK(a,b)) return [b];
   const nodes=[a,...navNodes(),b], n=nodes.length, dist=new Array(n).fill(Infinity), prev=new Array(n).fill(-1), done=new Array(n).fill(false); dist[0]=0;
   const d=(i,j)=>Math.hypot(nodes[i][0]-nodes[j][0],(nodes[i][1]-nodes[j][1])*1.4);
   for(;;){ let u=-1; for(let i=0;i<n;i++) if(!done[i]&&dist[i]<Infinity&&(u<0||dist[i]+d(i,n-1)<dist[u]+d(u,n-1))) u=i;
     if(u<0||u===n-1) break; done[u]=true;
     for(let v=0;v<n;v++) if(!done[v]&&v!==u){ const nd=dist[u]+d(u,v); if(nd<dist[v]&&segOK(nodes[u],nodes[v])){ dist[v]=nd; prev[v]=u; } } }
   if(prev[n-1]<0) return [b];
   const path=[]; for(let i=n-1;i>0;i=prev[i]) path.unshift(nodes[i]); return path; }
 const depth=y=>{ const d=room.depth; const t=Math.max(0,Math.min(1,(y-d[0])/(d[2]-d[0]))); return d[1]+(d[3]-d[1])*t; };

 /* ---------- actors ---------- */
 function mkActor(look,x,y,face,opts){ const g=document.createElementNS(NS,'g'); g.setAttribute('class','actor');
   const a=Object.assign({look,x,y,face:face||'front',phase:null,path:[],g,cache:{},key:''},opts||{}); draw(a); return a; }
 function frame(a){ const view=a.face==='left'||a.face==='right'?'side':a.face; const pi=a.phase==null?-1:Math.floor(a.phase*8)%8;
   const key=view+pi; if(!a.cache[key]) a.cache[key]=actorSVG(a.look,view,pi<0?null:pi/8); return [key,a.cache[key]]; }
 function draw(a){ const sc=depth(a.y)*(a.size||1); const [key,svg]=frame(a);
   if(key!==a.key){ a.g.innerHTML=`<ellipse cx="0" cy="1" rx="36" ry="7" fill="#0B1020" opacity=".34" filter="url(#blur)"/><g class="fig">${svg}</g>`; a.key=key; }
   a.g.querySelector('.fig').setAttribute('transform', a.face==='left'?'scale(-1 1)':'');
   a.g.setAttribute('transform',`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) scale(${sc.toFixed(3)})`); a.base=a.y; }
 function sortWorld(){ const w=$('#world'); const items=[...props,...npcs,...(room.noPlayer?[]:[player])].sort((p,q)=>p.base-q.base);
   items.forEach(it=>{ if(w.lastChild!==it.g) w.appendChild(it.g); }); }

 /* ---------- walking ---------- */
 let walkDone=null, last=0;
 function walkTo(x,y,face){ return new Promise(res=>{ if(walkDone) walkDone(false);
   player.path=findPath([player.x,player.y],[x,y]); player.endFace=face; walkDone=res; }); }
 function tick(t){ const dt=Math.min(.05,(t-(last||t))/1000); last=t;
   npcs.forEach(n=>{ if(n.dance){ n.phase=((n.phase||0)+dt*n.dance)%1; n.x=n.x0+Math.sin((n.phase+n.off)*Math.PI*2)*n.sway; n.face=Math.sin((n.phase+n.off)*Math.PI*2)>0?'right':'left'; draw(n); } });
   if(player && player.path.length){ const [tx,ty]=player.path[0], dx=tx-player.x, dy=ty-player.y, dist=Math.hypot(dx,dy);
     const sc=depth(player.y), sp=200*sc*(Math.abs(dy)>Math.abs(dx)?.72:1), step=sp*dt;
     player.face = Math.abs(dx)>Math.abs(dy)*1.1 ? (dx<0?'left':'right') : (dy<0?'back':'front');
     if(dist<=step){ player.x=tx; player.y=ty; player.path.shift(); } else { player.x+=dx/dist*step; player.y+=dy/dist*step; }
     player.phase=((player.phase||0)+step/(80*sc))%1;
     if(room.onStep) room.onStep(G,player.x,player.y);
     if(!player.path.length){ player.phase=null; if(player.endFace) player.face=player.endFace; const r=walkDone; walkDone=null; r&&r(true); }
     draw(player); sortWorld(); }
   requestAnimationFrame(tick); }

 /* ---------- text ---------- */
 function gloss(w){ const g=CFG.glossary||{}; const k=Object.keys(g).find(x=>x.toLowerCase()===w.toLowerCase()); if(!k) return ''; const v=g[k]; return Array.isArray(v)?v[0]:v; }
 function rich(s){ return esc(T(s)).replace(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g,(m,w,g)=>{ g=g||gloss(w); return g?`<span class="gl" tabindex="0" data-g="${esc(g)}">${w}</span>`:w; })
   .replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>'); }
 let msgQ=Promise.resolve();
 function say(text,o={}){
   msgQ=msgQ.then(()=>new Promise(res=>{ const m=$('#msg');
   m.innerHTML=`<div class="box${o.who?' talk':''}" role="dialog" aria-live="assertive">${o.icon?`<div class="mi"><svg viewBox="0 0 48 48">${o.icon}</svg></div>`:''}<div class="mt">${o.who?`<p class="who">${esc(T(o.who))}</p>`:''}<p>${rich(text)}</p></div><button class="spk" type="button" aria-label="Écouter en français" title="Écouter"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg></button></div>`;
   m.querySelector('.spk').addEventListener('pointerdown',e=>{ e.stopPropagation(); speak(text); });
   if(prefs().voice) speak(text);
   m.hidden=false; hideBar(); setCursor();
   const close=e=>{ if(e && e.type==='keydown' && !['Enter',' ','Escape'].includes(e.key)) return; if(e && e.target.closest && e.target.closest('.gl') && e.type==='keydown' && e.key!=='Escape') return;
     e&&e.preventDefault(); hush(); m.hidden=true; m.removeEventListener('pointerdown',close); document.removeEventListener('keydown',close,true); setCursor(); res(); };
   setTimeout(()=>{ m.addEventListener('pointerdown',close); document.addEventListener('keydown',close,true); },120); })); return msgQ; }

 /* ---------- score, clock, flags ---------- */
 function score(n,key){ if(key){ if(G.scored[key]) return; G.scored[key]=1; } G.score+=n; updBar(); const b=$('#scoreTxt'); b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash');
   showBar(1600); }
 const clockTxt=()=>{ const h=Math.floor(G.clock/60)%24, m=G.clock%60; return `${h} h ${String(m).padStart(2,'0')}`; };
 function tickClock(min){ G.clock+=min; updBar(); }
 function updBar(){ $('#scoreTxt').textContent=`Points : ${G.score} sur ${CFG.maxScore||300}`; $('#clockTxt').textContent=clockTxt();
   const it=G.sel&&ITEMS[G.sel]; $('#vbItem').innerHTML=`<svg viewBox="0 0 48 48">${it?it.icon:ICONS.empty}</svg>`; $('#vbItem').title=it?T(it.name):'Aucun objet choisi';
   $('#vbItem').disabled=!it; document.querySelectorAll('.vb[data-verb]').forEach(b=>b.classList.toggle('on',b.dataset.verb===G.verb)); }

 /* ---------- icon bar ---------- */
 let barTimer=null;
 function showBar(ms){ const b=$('#bar'); b.classList.add('down'); clearTimeout(barTimer); if(ms) barTimer=setTimeout(()=>{ if(!b.matches(':hover,:focus-within')) hideBar(); },ms); }
 function hideBar(){ $('#bar').classList.remove('down'); }
 function setVerb(v){ if(v==='item'&&!G.sel) return; G.verb=v; updBar(); setCursor(); }
 const VERB_ORDER=['walk','look','hand','talk','item'];
 const VERB_NAMES={walk:'Marcher',look:'Regarder',hand:'Prendre / Utiliser',talk:'Parler',item:'Objet choisi'};
 function pickVerb(v){ if(v==='item'&&!G.sel){ toast('Choisissez d\'abord un objet dans l\'inventaire.'); return; } setVerb(v); toast('Action : '+(v==='item'?T(ITEMS[G.sel].name):VERB_NAMES[v])); }
 /* action wheel: long press (or right-click) opens the verbs around the pointer */
 function openWheel(p){ const w=$('#wheel'); const verbs=VERB_ORDER.filter(v=>v!=='item'||G.sel); const n=verbs.length, R=78;
   w.innerHTML=verbs.map((v,i)=>{ const a=-Math.PI/2+i*2*Math.PI/n, x=Math.cos(a)*R, y=Math.sin(a)*R; const icon=v==='item'?ITEMS[G.sel].icon:CURSORS[v][0];
     return `<button class="wv${v===G.verb?' on':''}" type="button" data-v="${v}" style="--x:${x.toFixed(1)};--y:${y.toFixed(1)}" aria-label="${esc(v==='item'?T(ITEMS[G.sel].name):VERB_NAMES[v])}"><svg viewBox="0 0 48 48">${icon}</svg><span>${i+1}</span></button>`; }).join('')
     +`<div class="wlab" aria-hidden="true"></div>`;
   w.style.left=(Math.min(Math.max(p[0],110),W-110)/W*100)+'%'; w.style.top=(Math.min(Math.max(p[1],110),H-110)/H*100)+'%'; w.hidden=false; hideBar(); setCursor();
   w.querySelectorAll('.wv').forEach(b=>{ b.onpointerenter=()=>{ w.querySelectorAll('.wv').forEach(x=>x.classList.toggle('hot',x===b)); w.querySelector('.wlab').textContent=b.getAttribute('aria-label'); };
     b.onclick=e=>{ e.stopPropagation(); closeWheel(); pickVerb(b.dataset.v); }; });
   wheelOpen=true; }
 function closeWheel(){ const w=$('#wheel'); w.hidden=true; w.innerHTML=''; wheelOpen=false; setCursor(); }
 let wheelOpen=false;

 /* ---------- cursor ---------- */
 function setCursor(){ const c=$('#cur'); const modal=anyModal();
   if(!ptr.in||modal||ptr.onBar){ c.hidden=true; $('#tag').hidden=true; return; }
   c.hidden=false; let art; if(busy) art=CURSORS.wait; else if(G.verb==='item'&&G.sel) art=[ITEMS[G.sel].icon,24,24]; else art=CURSORS[G.verb];
   const k=(busy?'wait':G.verb)+(G.sel||''); if(c.dataset.k!==k){ c.innerHTML=`<svg viewBox="0 0 48 48">${art[0]}</svg>`; c.dataset.k=k; c.style.setProperty('--hx',art[1]); c.style.setProperty('--hy',art[2]); }
   c.style.left=(ptr.x/W*100)+'%'; c.style.top=(ptr.y/H*100)+'%';
   const t=$('#tag'); if(hoverHs && !busy){ t.hidden=false; t.textContent=T(hoverHs.name); t.style.left=(ptr.x/W*100)+'%'; t.style.top=(ptr.y/H*100)+'%';
     t.classList.toggle('flipX',ptr.x>1040); t.classList.toggle('flipY',ptr.y>740); } else t.hidden=true; }

 function anyModal(){ return ['#msg','#dlg','#fail','#title','#dossier','#create','#lexique','#wheel'].some(q=>!$(q).hidden); }
 /* ---------- hotspots ---------- */
 const hsList=()=>(room.hotspots||[]).filter(h=>!h.when||h.when(G));
 function inShape(h,p){ if(h.rect){ const [x,y,w,hh]=h.rect; return p[0]>=x&&p[0]<=x+w&&p[1]>=y&&p[1]<=y+hh; }
   if(h.ell){ const [cx,cy,rx,ry]=h.ell; return ((p[0]-cx)/rx)**2+((p[1]-cy)/ry)**2<=1; } return inPoly(p,h.poly); }
 const hsAt=p=>{ const l=hsList(); for(let i=l.length-1;i>=0;i--) if(inShape(l[i],p)) return l[i]; return null; };
 function shapePath(h){ if(h.rect){ const [x,y,w,hh]=h.rect; return `<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="6"/>`; }
   if(h.ell){ const [cx,cy,rx,ry]=h.ell; return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`; } return `<polygon points="${h.poly.map(p=>p.join(',')).join(' ')}"/>`; }
 function drawZones(){ const z=$('#zones'); const l=hsList(); const f=l[focusIdx];
   z.innerHTML=(showZones?l.map(h=>`<g class="z">${shapePath(h)}</g>`).join(''):'')+(f?`<g class="z f">${shapePath(f)}</g>`:''); }
 const center=h=>h.rect?[h.rect[0]+h.rect[2]/2,h.rect[1]+h.rect[3]/2]:h.ell?[h.ell[0],h.ell[1]]:[h.poly.reduce((s,p)=>s+p[0],0)/h.poly.length,h.poly.reduce((s,p)=>s+p[1],0)/h.poly.length];

 const DEFAULTS={
  look:'Rien de particulier. Même pour un œil exercé comme le vôtre.',
  hand:'Vous ne pouvez pas prendre ça. Et franchement, pourquoi le voudriez-vous?',
  talk:'Vous parlez. Personne ne répond. C\'est souvent comme ça, la nuit, dans un musée.',
  item:'Ça ne sert à rien ici. Comme la machine à café du poste.',
  nothingLook:'Vous regardez le vide. Le vide, poli, vous regarde aussi.',
  nothingHand:'Il n\'y a rien à prendre ici.',
  nothingTalk:'Parler tout{|e} seul{|e}, déjà? La nuit sera longue.'
 };
 async function run(h,verb){ if(h.exit&&(verb==='hand'||verb==='walk')){ if(h.canExit&&!(await h.canExit(API))) return; const ex=typeof h.exit==='function'?h.exit(G):h.exit; return go(ex[0],ex[1],ex[2]); }
   let fn=verb==='item'?(h.use&&(h.use[G.sel]||h.use['*'])):h[verb];
   if(fn==null) fn=verb==='item'?DEFAULTS.item:DEFAULTS[verb];
   if(typeof fn==='string') return say(fn);
   return fn(API, verb==='item'?G.sel:undefined); }
 async function act(p){ if(busy) return;
   return actOn(hsAt(p),p); }
 async function actOn(h,p){ if(busy) return; checkpoint=snap();
   if(room.noPlayer){ if(!h) return; busy=true; setCursor(); try{ await run(h,G.verb==='look'?'look':(G.verb==='walk'?'walk':G.verb)); } finally{ busy=false; setCursor(); } return; }
   if(G.verb==='walk'){ if(h&&h.exit&&!h.onWalk){ busy=true; setCursor(); const wt=h.walkTo||p; const ok=await walkTo(wt[0],wt[1],h.face); busy=false; if(ok) await run(h,'walk'); setCursor(); return; }
     if(h&&h.onWalk){ busy=true; setCursor(); const wt=h.walkTo||p; const ok=await walkTo(wt[0],wt[1],h.face); if(ok) await h.onWalk(API); busy=false; setCursor(); return; }
     walkTo(p[0],p[1]); return; }
   if(!h){ return say(G.verb==='look'?DEFAULTS.nothingLook:G.verb==='talk'?DEFAULTS.nothingTalk:G.verb==='hand'?DEFAULTS.nothingHand:DEFAULTS.item); }
   busy=true; setCursor();
   const needWalk = h.walkTo && (G.verb!=='look' || h.walkToLook);
   if(needWalk){ const ok=await walkTo(h.walkTo[0],h.walkTo[1],h.face); if(!ok){ busy=false; setCursor(); return; } }
   else if(G.verb==='look'){ const c=center(h); player.face = Math.abs(c[0]-player.x)>Math.abs(c[1]-player.y)? (c[0]<player.x?'left':'right') : (c[1]<player.y?'back':'front'); draw(player); }
   try{ await run(h,G.verb); } finally { busy=false; setCursor(); drawZones(); }
 }

 /* ---------- dialogs: inventory, notebook, options ---------- */
 function dialog(title, body, buttons){ const d=$('#dlg'); hideBar();
   d.innerHTML=`<div class="win" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${esc(title)}</h2><div class="wb">${body}</div><div class="wbtn">${buttons.map((b,i)=>`<button class="sbtn" data-i="${i}" type="button">${esc(b[0])}</button>`).join('')}</div></div>`;
   d.hidden=false; setCursor(); d.querySelectorAll('.wbtn .sbtn').forEach(b=>b.onclick=()=>buttons[+b.dataset.i][1]());
   const first=d.querySelector('.slot,.sbtn'); first&&first.focus(); }
 function closeDlg(){ $('#dlg').hidden=true; setCursor(); }
 function openInv(){ let pick=G.sel||G.inv[0]||null;
   const body=()=>`<div class="slots">${G.inv.map(id=>`<button class="slot${id===pick?' on':''}" data-id="${id}" type="button" title="${esc(T(ITEMS[id].name))}"><svg viewBox="0 0 48 48">${ITEMS[id].icon}</svg><span>${esc(T(ITEMS[id].name))}</span></button>`).join('')||'<p>Vos poches sont vides. Comme votre agenda social.</p>'}</div>`;
   const btns=[['Regarder',async()=>{ if(!pick) return; closeDlg(); await say(ITEMS[pick].look,{icon:ITEMS[pick].icon}); openInv(); }],
    ['Utiliser',async()=>{ if(!pick) return; closeDlg(); const it=ITEMS[pick]; if(it.use) await it.use(API); else await say('Vous ne pouvez pas utiliser ça tout seul. Choisissez-le, puis cliquez sur quelque chose dans la pièce.'); }],
    ['Choisir',()=>{ if(!pick) return; G.sel=pick; G.verb='item'; updBar(); closeDlg(); }],
    ['OK',closeDlg]];
   dialog('Inventaire', body(), btns);
   $('#dlg').querySelectorAll('.slot').forEach(s=>s.onclick=()=>{ pick=s.dataset.id; $('#dlg').querySelectorAll('.slot').forEach(x=>x.classList.toggle('on',x===s)); });
 }
 function openNotes(){ const linkable=G.notes.some(n=>n.id);
   dialog('Carnet', G.notes.length?`${linkable?'<p class="small notehelp">Pour relier deux indices, cochez-les, puis « Relier ». Une bonne déduction devient un nouvel indice.</p>':''}<ol class="notes">${G.notes.map((n,i)=>`<li${n.link?' class="ded"':''}>${n.id?`<label class="nchk"><input type="checkbox" data-i="${i}" aria-label="Choisir cet indice"></label>`:''}<b>${rich(n.title)}</b><span>${rich(n.text)}</span></li>`).join('')}</ol>`:'<p>Votre carnet est vide. Pour l\'instant.</p>',
     [['Relier',()=>linkNotes()],['Lexique',()=>openLexique()],['Fermer',closeDlg]]); }
 async function linkNotes(){ const sel=[...$('#dlg').querySelectorAll('.nchk input:checked')].map(c=>G.notes[+c.dataset.i]);
   if(sel.length!==2){ toast('Cochez exactement deux indices.'); return; }
   const ids=sel.map(n=>n.id).sort(); const L=(CFG.links||[]).find(l=>l.pair.slice().sort().join('|')===ids.join('|'));
   closeDlg();
   if(!L){ G.linkTries=(G.linkTries||0)+1; return say('Vous relisez les deux indices. Ils ne disent rien ensemble. Pour l\'instant.'); }
   if(G.notes.some(n=>n.id===L.id)) return say('Vous avez déjà fait cette déduction. Elle est dans votre carnet.');
   G.notes.push({title:L.title,text:L.text,id:L.id,link:true}); score(L.points||5,'link_'+L.id);
   return say('**Déduction.** '+L.text); }
 /* lexique: word-level glossary only (French word → English word); never English sentences */
 function openLexique(){ const L=$('#lexique'), entries=Object.entries(CFG.glossary||{}).sort((a,b)=>a[0].localeCompare(b[0],'fr'));
   const row=([w,v])=>{ const [en,note]=Array.isArray(v)?v:[v]; return `<li data-w="${esc(STEPS.deaccent(w.toLowerCase()))}"><b>${esc(w)}</b><span>${esc(en)}</span>${note?`<i>${esc(note)}</i>`:''}</li>`; };
   L.innerHTML=`<div class="lexwin" role="dialog" aria-modal="true" aria-label="Lexique"><div class="lexhead"><h2>Lexique</h2><input type="search" id="lexQ" placeholder="Chercher un mot…" aria-label="Chercher un mot" autocomplete="off"><button class="btn" type="button" id="lexClose">Fermer</button></div>
     <p class="lexnote">Des mots, pas des phrases. Pour le reste, votre dictionnaire est votre meilleur{|e} coéquipi{er|ère}.</p><ul class="lexlist">${entries.map(row).join('')}</ul></div>`.replace('{|e}',T('{|e}')).replace('{er|ère}',T('{er|ère}'));
   L.hidden=false; setCursor(); const q=$('#lexQ'); q.focus();
   q.oninput=()=>{ const v=STEPS.deaccent(q.value.toLowerCase().trim()); L.querySelectorAll('.lexlist li').forEach(li=>li.hidden=!!v&&!li.dataset.w.includes(v)); };
   const close=()=>{ L.hidden=true; L.innerHTML=''; setCursor(); };
   $('#lexClose').onclick=close; L.onkeydown=e=>{ if(e.key==='Escape'){ e.stopPropagation(); close(); } }; }
 /* strip any English sentences from task data (teacher decision: words only, via the lexique and hover glosses) */
 function noEnglish(x){ if(Array.isArray(x)) return x.map(noEnglish); if(x&&typeof x==='object'){ const o={}; for(const k in x){ if(/^(en|whyEn|missingEn)$/.test(k)) continue; o[k]=noEnglish(x[k]); } return o; } return x; }
 function openOpts(){ const pr=prefs();
   dialog('Options', `<div class="optgrid">
    <button class="sbtn" type="button" data-o="save">Sauvegarder</button><button class="sbtn" type="button" data-o="restore">Restaurer</button>
    <button class="sbtn" type="button" data-o="hint">Demander de l'aide (−${CFG.hintCost||2} points)</button><button class="sbtn" type="button" data-o="restart">Recommencer</button></div>
    <label class="opt"><input type="checkbox" id="optZones" ${showZones?'checked':''}> Montrer les zones (gratuit)</label>
    <label class="opt"><input type="checkbox" id="optVoice" ${pr.voice?'checked':''}> Lire les textes à voix haute (voix française)</label>
    <p class="small">Changer d'action : touches 1 à 4 (1 Marcher, 2 Regarder, 3 Prendre / Utiliser, 4 Parler, 5 l'objet choisi), ou gardez le bouton de la souris enfoncé pour ouvrir la roue des actions. Tab pour passer d'une zone à l'autre, Entrée pour agir, Échap pour la barre d'icônes.</p>`,
   [['Reprendre',()=>{ applyOpts(); closeDlg(); }]]);
   $('#dlg').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{ applyOpts(); const o=b.dataset.o;
     if(o==='save') openSave(); else if(o==='restore') openRestore(); else if(o==='hint'){ closeDlg(); hint(); }
     else if(o==='restart'){ dialog('Recommencer?','<p>Recommencer l\'enquête depuis le début? Vos sauvegardes sont conservées.</p>',[['Oui, recommencer',()=>{ closeDlg(); newGame(); }],['Non',openOpts]]); } }); }
 function applyOpts(){ const z=$('#optZones'); if(!z) return; showZones=z.checked; setPref('voice',$('#optVoice').checked); 
   if(!$('#optVoice').checked) hush(); drawZones(); }

 /* ---------- save / restore (several slots, plus an automatic save at each act) ---------- */
 const slotLabel=st=>`${T(ROOMS[st.roomId]?ROOMS[st.roomId].name:'')} · ${clockOf(st.clock)} · ${st.score} pts`;
 const clockOf=c=>`${Math.floor(c/60)%24} h ${String(c%60).padStart(2,'0')}`;
 const today=()=>new Date().toLocaleString('fr-CA',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
 function slotList(d,mode){ const rows=[]; if(mode==='restore'&&d.auto) rows.push(`<button class="srow" type="button" data-k="auto"><b>Sauvegarde automatique</b><span>${esc(d.auto.label)}</span><i>${esc(d.auto.when)}</i></button>`);
   for(let i=0;i<NSLOTS;i++){ const sl=(d.slots||[])[i]; if(mode==='restore'&&!sl) continue;
     rows.push(`<button class="srow" type="button" data-k="${i}"><b>Emplacement ${i+1}</b><span>${sl?esc(sl.label):'— vide —'}</span><i>${sl?esc(sl.when):''}</i></button>`); }
   return rows.join('')||'<p>Aucune partie sauvegardée.</p>'; }
 function openSave(){ const d=DB.get();
   dialog('Sauvegarder', `<div class="slist">${slotList(d,'save')}</div>`, [['Annuler',closeDlg]]);
   $('#dlg').querySelectorAll('.srow').forEach(b=>b.onclick=()=>{ const st=snap(), dd=DB.get(); dd.slots=dd.slots||[]; dd.slots[+b.dataset.k]={label:slotLabel(st),when:today(),state:st}; DB.set(dd);
     closeDlg(); say('Partie sauvegardée. Le capitaine, lui, ne sauvegarde jamais rien. C\'est pour ça qu\'il a l\'air si fatigué.'); }); }
 function openRestore(after){ const d=DB.get();
   dialog('Restaurer', `<div class="slist">${slotList(d,'restore')}</div>`, [['Annuler',()=>{ closeDlg(); }]]);
   $('#dlg').querySelectorAll('.srow').forEach(b=>b.onclick=()=>{ const dd=DB.get(), sl=b.dataset.k==='auto'?dd.auto:dd.slots[+b.dataset.k]; if(!sl) return;
     closeDlg(); hideTitle(); restore(sl.state); checkpoint=snap(); after&&after(); }); }
 function autosave(){ const st=snap(), d=DB.get(); d.auto={label:slotLabel(st),when:today(),state:st}; DB.set(d); }

 /* ---------- help from the team (costs points, never below zero) ---------- */
 async function hint(){ const h=CFG.hint?CFG.hint(G,API):null;
   if(!h) return say('Le capitaine hausse les épaules. « Vous êtes l\'enquêt{eur|rice} principal{|e}. Enquêtez. »');
   const cost=CFG.hintCost||2; G.score=Math.max(0,G.score-cost); G.hints=(G.hints||0)+1; updBar();
   return say(h.text,{who:h.who||'Agent Thibodeaux'}); }

 /* ---------- dossier: learning tasks (steps.js) in a manila folder over the scene ---------- */
 function task(steps,o={}){ steps=Array.isArray(steps)?steps:[steps]; hideBar(); hush();
   steps=noEnglish(steps);
   return new Promise(res=>{ const d=$('#dossier'); let i=0, mistakes=0;
    d.innerHTML=`<div class="folder" role="dialog" aria-modal="true" aria-label="${esc(T(o.title||'Dossier'))}">
      <div class="ftab">${esc(T(o.kind||'Dossier'))}</div>
      <div class="fhead"><h2>${esc(T(o.title||'Dossier'))}</h2><span class="fbtns"><button class="btn" type="button" id="dosLex">Lexique</button>${o.cancel?'<button class="btn" type="button" id="dosClose">Fermer le dossier</button>':''}</span></div>
      ${o.intro?`<p class="fintro">${rich(o.intro)}</p>`:''}
      <div class="fbody"><div class="dlog" aria-live="polite"></div><div class="act"></div></div></div>`;
    d.hidden=false; setCursor();
    const act=d.querySelector('.act'), log=d.querySelector('.dlog');
    if(o.docs) o.docs.forEach(x=>{ const c=document.createElement('div'); c.className='doc'; c.innerHTML=x; log.appendChild(c); });
    const close=(r)=>{ d.hidden=true; d.innerHTML=''; setCursor(); res(r); };
    if(o.cancel) d.querySelector('#dosClose').onclick=()=>close({cancelled:true,mistakes});
    d.querySelector('#dosLex').onclick=()=>openLexique();
    const answers=[];
    const ctx={ act, P:profile, store:(G.writing=G.writing||{}), save:()=>{}, toast, wrong:()=>{ mistakes++; },
     docLink:()=>'', log:el=>{ log.appendChild(el); el.scrollIntoView({block:'nearest'}); },
     me:t=>{ const p=document.createElement('p'); p.className='mine'; p.textContent=fmt(t,profile); log.appendChild(p); p.scrollIntoView({block:'nearest'}); },
     fb:(kind,fr)=>{ let f=act.querySelector('.fb'); if(!f){ f=document.createElement('div'); act.appendChild(f); } f.className='fb '+kind; f.innerHTML=esc(fmt(fr,profile)); },
     cont:(label,fn)=>{ act.innerHTML=''; const b=document.createElement('button'); b.className='btn primary cont'; b.type='button'; b.textContent=label||'Continuer'; b.onclick=fn; act.appendChild(b); b.focus({preventScroll:true}); },
     done:(txt,hit)=>{ answers.push({txt,hit}); i++; run(); } };
    const run=()=>{ const s=steps[i]; if(!s) return close({mistakes,answers});
      if(s.t==='say'){ const p=document.createElement('div'); p.className='dsay'; p.innerHTML=(s.who?`<b>${esc(T(s.who))}</b> `:'')+rich(s.text); log.appendChild(p); ctx.cont(s.btn||'Continuer',ctx.done); return; }
      if(s.t==='choose'){ act.innerHTML=`<p class="prompt">${esc(T(s.prompt))}</p><div class="opts"></div>`; const box=act.querySelector('.opts');
        STEPS.shuffle(s.opts).forEach(op=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=op.icon?`<svg viewBox="0 0 48 48">${op.icon}</svg><span>${esc(T(op.txt))}</span>`:esc(T(op.txt));
          b.onclick=()=>{ if(op.ok||s.any){ box.querySelectorAll('button').forEach(x=>x.disabled=true); b.classList.add('right'); ctx.me(op.txt); setTimeout(()=>ctx.done(op.txt,op),500); }
            else { b.classList.add('wrong'); b.disabled=true; mistakes++; ctx.fb('err',op.why||'Non. Relisez le dossier.'); } }; box.appendChild(b); }); return; }
      STEPS.run(s,ctx); };
    run(); }); }

 /* ---------- title screen and new game ---------- */
 function hideTitle(){ $('#title').hidden=true; }
 function newGame(){ const keep={ }; Object.keys(G).forEach(k=>delete G[k]); Object.assign(G,JSON.parse(JSON.stringify(INIT)),keep); hideTitle(); enter(CFG.first); autosave(); }
 function showTitle(){ const d=DB.get(), t=$('#title');
   t.innerHTML=`<div class="tcard"><p class="tkick">Le grand voyage · Escale 8 · Lafayette, Louisiane</p><h1>L'enquête</h1><p class="tsub">Une enquête de l'${T('enquêt{eur|rice}')} ${esc(profile.name||'')}</p>
    <div class="tbtns"><button class="sbtn" type="button" id="tNew">Nouvelle enquête</button>${d.auto?'<button class="sbtn" type="button" id="tCont">Continuer</button>':''}${(d.slots||[]).some(Boolean)?'<button class="sbtn" type="button" id="tRest">Restaurer</button>':''}</div>
    <p class="tfoot">Un jeu d'aventure à la manière des années 90. Souris en haut de l'écran : la barre d'icônes. Touches 1 à 4, ou un clic long : changer d'action.</p></div>`;
   t.hidden=false; $('#tNew').onclick=()=>{ if(!d.reminded){ const dd=DB.get(); dd.reminded=1; DB.set(dd); } newGame(); };
   if($('#tCont')) $('#tCont').onclick=()=>{ hideTitle(); restore(DB.get().auto.state); checkpoint=snap(); };
   if($('#tRest')) $('#tRest').onclick=()=>openRestore(); t.querySelector('.sbtn').focus(); }

 /* ---------- failure ---------- */
 function fail(o){ busy=true; const f=$('#fail'); hideBar(); if(walkDone){ player.path=[]; }
   f.innerHTML=`<div class="fbox" role="alertdialog" aria-modal="true">${o.art?`<div class="fart"><svg viewBox="0 0 200 120">${o.art}</svg></div>`:''}<div class="win"><p>${rich(o.text)}</p>${o.lesson?`<p class="lesson">${rich(o.lesson)}</p>`:''}
   <div class="wbtn"><button class="sbtn" id="btnRetry" type="button">Réessayer</button>${(DB.get().slots||[]).some(Boolean)?'<button class="sbtn" id="btnRestore" type="button">Restaurer</button>':''}</div></div></div>`;
   f.hidden=false; setCursor(); $('#btnRetry').focus();
   return new Promise(res=>{ $('#btnRetry').onclick=()=>{ f.hidden=true; restore(checkpoint); busy=false; setCursor(); res(); };
     const rb=$('#btnRestore'); if(rb) rb.onclick=()=>{ openRestore(()=>{ f.hidden=true; busy=false; setCursor(); res(); }); }; }); }
 const snap=()=>JSON.parse(JSON.stringify(Object.assign({},G,{px:player?player.x:G.px,py:player?player.y:G.py,face:player?player.face:G.face})));
 function restore(s){ Object.assign(G,JSON.parse(JSON.stringify(s))); enter(G.roomId,true); }

 /* ---------- rooms ---------- */
 function enter(id,restoring,entry){ room=ROOMS[id]; G.roomId=id;
   $('#bg').innerHTML=room.bg(G); $('#fg').innerHTML=room.fg?room.fg(G):''; $('#world').innerHTML='';
   props=(room.props||[]).filter(p=>!p.when||p.when(G)).map(p=>{ const g=document.createElementNS(NS,'g'); g.innerHTML=p.svg(G); return {g,base:p.base}; });
   npcs=(room.npcs||[]).filter(n=>!n.when||n.when(G)).map(n=>{ const a=mkActor(n.look,n.x,n.y,n.face,{size:n.size,block:n.block,dance:n.dance,sway:n.sway||14,off:n.off||0,x0:n.x}); return a; });
   const st=restoring?{x:G.px,y:G.py,face:G.face}:((entry&&room.entries&&room.entries[entry])||room.start);
   player=mkActor(Object.assign({},CFG.playerLook,G.wearing.gants?{glove:'#4E8FD9'}:{}),st.x,st.y,st.face); G.px=st.x; G.py=st.y;
   npcs.forEach(draw); draw(player); sortWorld(); focusIdx=-1; drawZones(); updBar();
   if(!restoring){ checkpoint=snap(); if(room.onEnter) room.onEnter(API); }
 }
 function fade(on){ const f=$('#fade'); f.classList.toggle('on',on); return new Promise(r=>setTimeout(r,on?260:20)); }
 async function go(id,entry,min){ busy=true; setCursor(); hush(); await fade(true); if(min) tickClock(min); enter(id,false,entry); await new Promise(r=>setTimeout(r,60)); await fade(false); busy=false; setCursor(); }
 /* Sierra-style conversation menu: choose what to say or ask; returns the chosen option */
 function menu(title,opts){ opts=opts.filter(o=>!o.when||o.when(G)); return new Promise(res=>{ hideBar();
   dialog(T(title), `<div class="mlist">${opts.map((o,i)=>`<button class="mrow" type="button" data-i="${i}">${rich(o.txt)}</button>`).join('')}</div>`, [['Rien',()=>{ closeDlg(); res(null); }]]);
   $('#dlg').querySelectorAll('.mrow').forEach(b=>b.onclick=()=>{ closeDlg(); res(opts[+b.dataset.i]); }); $('#dlg .mrow')&&$('#dlg .mrow').focus(); }); }
 const API={ G, say, score, tickClock, walkTo, fail, enter, go, menu, get player(){return player;},
  give(id){ if(!G.inv.includes(id)) G.inv.push(id); updBar(); },
  drop(id){ G.inv=G.inv.filter(x=>x!==id); if(G.sel===id){ G.sel=null; if(G.verb==='item') G.verb='walk'; } updBar(); },
  has:id=>G.inv.includes(id), flag:(k,v)=>{ if(v===undefined) return G.flags[k]; G.flags[k]=v; },
  note(title,text,id){ if(id&&G.notes.some(n=>n.id===id)) return; G.notes.push({title,text,id}); },
  hasNote:id=>G.notes.some(n=>n.id===id),
  redraw(){ G.px=player.x; G.py=player.y; G.face=player.face; enter(G.roomId,true); },
  face(f){ player.face=f; draw(player); }, T, task, autosave, toast, speak,
  finalScore(){ return G.score; },
  rank(){ const r=API.finalScore()/(CFG.maxScore||300); const R=CFG.ranks||[]; let out=R[0]; R.forEach(x=>{ if(r>=x.min) out=x; }); return out?T(out.name):''; } };

 /* ---------- input ---------- */
 function toLogical(e){ const r=$('#stage').getBoundingClientRect(); return [(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]; }
 function bind(){ const st=$('#stage'), sc=$('#scene');
  st.addEventListener('pointermove',e=>{ const p=toLogical(e); ptr={x:p[0],y:p[1],in:true,onBar:!!e.target.closest('#bar')||p[1]<16};
    if(p[1]<16 && !anyModal()) showBar(); else if(p[1]>110 && !$('#bar').matches(':focus-within')) hideBar();
    hoverHs = (e.target.closest('#scene')) ? hsAt(p) : null; setCursor(); });
  st.addEventListener('pointerleave',()=>{ ptr.in=false; setCursor(); });
  let press=null;
  sc.addEventListener('pointerdown',e=>{ if(e.button!==0||anyModal()) return; const p=toLogical(e);
    press={p,x:e.clientX,y:e.clientY,t:setTimeout(()=>{ if(press&&!busy){ press.wheel=true; openWheel(p); } },420)}; });
  window.addEventListener('pointermove',e=>{ if(press&&!press.wheel&&Math.hypot(e.clientX-press.x,e.clientY-press.y)>10){ clearTimeout(press.t); } });
  window.addEventListener('pointerup',e=>{ if(!press) return; clearTimeout(press.t); const pr=press; press=null;
    if(pr.wheel){ const b=document.elementFromPoint(e.clientX,e.clientY); const v=b&&b.closest&&b.closest('.wv'); if(v){ closeWheel(); pickVerb(v.dataset.v); } return; }
    if(!anyModal()&&e.target.closest&&e.target.closest('#scene')) act(pr.p); });
  st.addEventListener('contextmenu',e=>{ e.preventDefault(); if(!anyModal()&&!busy) openWheel(toLogical(e)); });
  $('#wheel').addEventListener('pointerdown',e=>{ if(e.target.id==='wheel'){ closeWheel(); } });
  document.querySelectorAll('.vb').forEach(b=>b.addEventListener('click',()=>{ const v=b.dataset.verb, a=b.dataset.act;
    if(v) setVerb(v); else if(a==='inv') openInv(); else if(a==='note') openNotes(); else if(a==='opt') openOpts(); hideBar(); }));
  $('#bar').addEventListener('pointerleave',()=>{ if(!$('#bar').matches(':focus-within')) hideBar(); });
  document.addEventListener('keydown',e=>{ if(wheelOpen){ if(e.key==='Escape'){ e.preventDefault(); closeWheel(); } else if(/^[1-5]$/.test(e.key)){ closeWheel(); pickVerb(VERB_ORDER[+e.key-1]); } return; }
    if(/^[1-5]$/.test(e.key)&&!anyModal()&&!e.target.closest('input,textarea')){ e.preventDefault(); pickVerb(VERB_ORDER[+e.key-1]); return; }
    if(!$('#msg').hidden||!$('#fail').hidden||!$('#title').hidden||!$('#dossier').hidden||!$('#create').hidden||!$('#lexique').hidden) return;
    if(!$('#dlg').hidden){ if(e.key==='Escape') closeDlg(); return; }
    if(e.key==='Escape'){ e.preventDefault(); if($('#bar').classList.contains('down')){ hideBar(); document.activeElement.blur(); } else { showBar(); $('#bar .vb').focus(); } return; }
    if($('#bar').matches(':focus-within')) return;
    if(e.key==='Tab'){ e.preventDefault(); const l=hsList(); if(!l.length) return; focusIdx=(focusIdx+(e.shiftKey?-1:1)+l.length)%l.length; drawZones();
      const h=l[focusIdx]; const c=center(h); $('#kbTag').hidden=false; $('#kbTag').textContent=T(h.name); $('#kbTag').style.left=(c[0]/W*100)+'%'; $('#kbTag').style.top=(c[1]/H*100)+'%'; }
    else if(e.key==='Enter' && focusIdx>=0){ e.preventDefault(); const h=hsList()[focusIdx]; if(h) actOn(h, h.walkTo||center(h)); }
    else if(e.key==='Enter' && focusIdx<0){ e.preventDefault(); }
  });
 }

 let INIT=null;
 function start(cfg){ CFG=cfg; ROOMS=cfg.rooms; ITEMS=cfg.items; profile=cfg.profile; Object.assign(G,cfg.state||{}); INIT=JSON.parse(JSON.stringify(G));
   const tag=document.createElement('div'); tag.id='kbTag'; tag.hidden=true; $('#stage').appendChild(tag);
   bind(); requestAnimationFrame(tick);
   const go=()=>{ room=ROOMS[cfg.first]; enterQuiet(cfg.first); showTitle(); };
   if(!profile||!profile.name){ const c=$('#create'); c.hidden=false; mountCreator(c.querySelector('.cwrap'),p=>{ profile=p; CFG.playerLook=cfg.lookFor(p); c.hidden=true; go(); }); }
   else go(); }
 function enterQuiet(id){ const f=ROOMS[id].onEnter; ROOMS[id].onEnter=null; enter(id); ROOMS[id].onEnter=f; }
 /* test hooks (automated playthroughs) */
 const _hs=(id,verb,sel)=>{ G.verb=verb; if(sel){ G.sel=sel; G.verb='item'; } const h=hsList().find(x=>x.id===id); if(!h) return 'nohs:'+id; actOn(h,h.walkTo||center(h)); return 'ok'; };
 return { start, API, G, _task:task, _hs, _busy:()=>busy||anyModal(), _room:()=>G.roomId, _findPath:(a,b)=>findPath(a,b), _act:p=>act(p) };
})();
