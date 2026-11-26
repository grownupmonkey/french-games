/* ===== Le marché: title, avatar, intro, reflection, bilan, start ===== */
function pickRecipe(){const prev=LS.get(SAVE+'.last',null);const pool=RECIPES.filter(r=>r.id!==prev);return rnd(pool.length?pool:RECIPES);}
function newGame(){G.recipe=pickRecipe();LS.set(SAVE+'.last',G.recipe.id);G.cart={};G.ticked={};G.lineErr=0;G.cookErr=0;G.checks=0;G.station=null;G.reflect={};}

/* ---------- title ---------- */
function startTitle(){
  mode='title';clearUI();if(!STOREBG){STOREBG=buildStoreBG();STOREL=lightLayer('rgb(250,242,230)',[[70,46,90,'255,236,190',.30],[187,40,70,'255,224,170',.34],[288,40,70,'200,230,255',.25],[404,44,86,'255,230,180',.30]]);}
  onFrame=()=>{ctx.drawImage(STOREBG,0,0);const list=PROPS.map(p=>({y:p.base,f:()=>p.draw()}));list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
    shadow(300,206,6,2,.3);spr(AV.me||(AV.me=compose(look)),'walk',3,Math.floor(T*8),300+Math.sin(T*.8)*0,206);applyLight(STOREL,.5,'30,18,10');ctx.fillStyle='rgba(20,12,30,.45)';ctx.fillRect(0,0,W,H);};
  const have=!!savedLook()&&!!look.name,best=LS.get(SAVE+'.best',0);
  el(`<div class="title"><div class="tlogo">Le marché</div><div class="tsub">La colocation · jeu 2</div><p class="tp">Ce soir, c’est ton tour de faire le souper. Lis bien les étiquettes !</p>
    <div class="tbtns">${have?`<button class="btn" id="tGo">Jouer avec ${esc(look.name)}</button><button class="btn sec" id="tAv">Changer d’avatar</button>`:`<button class="btn" id="tAv">Créer mon avatar</button>`}</div>
    ${best?`<div class="tbest">Meilleur score : ${best} / 100</div>`:''}<div class="tkeys">Souris ou flèches · E pour parcourir un rayon</div></div>`);
  if(have)$('#tGo').onclick=()=>{actx();sfx('ok');buildAv();startIntro();};$('#tAv').onclick=()=>{actx();sfx('ok');startCreator();};
}

/* ---------- avatar creator (same parts as Ma semaine; the avatar is shared between the 30-3Y games) ---------- */
let crDir=3;
function startCreator(){mode='creator';clearUI();onFrame=()=>{ctx.drawImage(STOREBG,0,0);ctx.fillStyle='rgba(20,12,30,.7)';ctx.fillRect(0,0,W,H);};buildCreator();}
function prevCanvas(l,dir){const c=document.createElement('canvas');c.width=16;c.height=32;c.className='pv';const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(compose(l),dir*6*16,0,16,32,0,0,16,32);return c;}
function buildCreator(){closePanel('creator');
  const cl=()=>JSON.parse(JSON.stringify(look)),R=n=>Array.from({length:n},(_,k)=>k+1);
  const e=el(`<div class="creator" id="creator"><h2>Mon avatar</h2><div class="cr-main"><div class="cr-big" id="crBig"></div><div class="cr-opts" id="crOpts"></div></div></div>`);
  const big=prevCanvas(look,crDir);big.className='pvbig';$('#crBig').appendChild(big);
  const dirs=document.createElement('div');dirs.className='cr-dir';[['Face',3],['Dos',1],['Gauche',2],['Droite',0]].forEach(([t,v])=>{const b=document.createElement('button');b.textContent=t;b.className=crDir===v?'sel':'';b.onclick=()=>{crDir=v;buildCreator();};dirs.appendChild(b);});$('#crBig').appendChild(dirs);
  const o=$('#crOpts');
  const grp=(title,ids,cur,set,mk)=>{const d=document.createElement('div');d.className='grp';d.innerHTML=`<h3>${title}</h3>`;const row=document.createElement('div');row.className='opts';
    ids.forEach(i=>{const b=document.createElement('button');b.className='opt'+(i===cur?' sel':'');b.appendChild(prevCanvas(mk(i),crDir));b.onclick=()=>{set(i);buildCreator();};row.appendChild(b);});d.appendChild(row);o.appendChild(d);};
  grp('Peau',R(9),look.body,v=>look.body=v,i=>Object.assign(cl(),{body:i}));
  grp('Yeux',R(7),look.eyes,v=>look.eyes=v,i=>Object.assign(cl(),{eyes:i}));
  grp('Coiffure',R(6),look.hair[0],v=>look.hair[0]=v,i=>Object.assign(cl(),{hair:[i,look.hair[1]]}));
  grp('Couleur',R(3),look.hair[1],v=>look.hair[1]=v,i=>Object.assign(cl(),{hair:[look.hair[0],i]}));
  grp('Tenue',R(5),look.outfit[0],v=>look.outfit[0]=v,i=>Object.assign(cl(),{outfit:[i,look.outfit[1]]}));
  grp('Couleur',R(3),look.outfit[1],v=>look.outfit[1]=v,i=>Object.assign(cl(),{outfit:[look.outfit[0],i]}));
  const nm=document.createElement('div');nm.className='namerow';nm.innerHTML=`<h3>Prénom</h3><input type="text" id="nm" maxlength="14" value="${esc(look.name||'')}" placeholder="Ton prénom"><span class="acc">Accord :</span><span class="tog"><button data-g="m" class="${look.g==='m'?'sel':''}">prêt</button><button data-g="f" class="${look.g==='f'?'sel':''}">prête</button></span><button class="btn" id="crOk">Entrer dans le marché ▶</button>`;o.appendChild(nm);
  $('#nm').oninput=ev=>look.name=ev.target.value;$$('.tog button').forEach(b=>b.onclick=()=>{look.g=b.dataset.g;buildCreator();});
  $('#crOk').onclick=()=>{look.name=($('#nm').value||'').trim()||'Alex';LS.set('jeuxFr30.look',look);buildAv();startIntro();};
}

/* ---------- intro: Inès gives you the list ---------- */
function startIntro(){
  newGame();mode='intro';clearUI();onFrame=()=>{ctx.drawImage(STOREBG,0,0);ctx.fillStyle='rgba(20,12,30,.6)';ctx.fillRect(0,0,W,H);};
  const R=G.recipe;
  const e=el(`<div class="intro"><div class="ines"><canvas id="inCv" width="16" height="32"></canvas></div><div class="ibox"><b>Inès</b><p>Salut ${esc(look.name||'')} ! ${esc(R.intro)}</p><p>Voici la liste pour : <em>${esc(R.nom)}</em>.</p><p class="small">Ça fait ${R.serves} personnes. Lis bien les étiquettes : le format, les ingrédients, ce qui est écrit en petit.</p><button class="btn" id="inGo">Aller au marché →</button></div></div>`);
  const g=$('#inCv').getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(AV.ines,3*6*16,0,16,32,0,0,16,32);
  $('#inGo').onclick=()=>{sfx('ok');fadeTo(()=>{clearUI();startStore(true);setTimeout(openList,500);});};
}

/* ---------- reflection (English is fine here) ---------- */
function startReflect(){
  mode='reflect';clearUI();onFrame=()=>{ctx.drawImage(DBG||STOREBG,0,0);ctx.fillStyle='rgba(20,12,30,.78)';ctx.fillRect(0,0,W,H);};
  const labels=['The ingredients','The size or weight','The price per 100 g','The best-before date','The tags (végétarien, sans lactose…)'];
  const words=['une douzaine','une demi-douzaine','un demi-litre','un quart de litre','un demi-kilo','une cuillère à soupe'];
  const chips=a=>a.map(x=>`<button class="chip" data-v="${esc(x)}">${esc(x)}</button>`).join('');
  el(`<div class="reflect"><h2>Réflexion <small>· you can answer in English</small></h2>
    <div class="q"><b>1. Which part of a label helped you the most?</b><div class="chips" data-q="label">${chips(labels)}</div></div>
    <div class="q"><b>2. Which quantity words were hardest to turn into numbers?</b><div class="chips" data-q="words">${chips(words)}</div></div>
    <div class="q"><b>3. Next time I shop for food in French, I will…</b><textarea id="rText" rows="3" placeholder="Write one sentence."></textarea></div>
    <div class="cbtns"><button class="btn" id="rDone">Voir mon bilan →</button></div></div>`);
  $$('.chips').forEach(ch=>ch.querySelectorAll('.chip').forEach(b=>b.onclick=()=>b.classList.toggle('sel')));
  $('#rDone').onclick=()=>{G.reflect={label:$$('.chips[data-q=label] .sel').map(b=>b.dataset.v),words:$$('.chips[data-q=words] .sel').map(b=>b.dataset.v),text:$('#rText').value.trim()};LS.set(SAVE+'.reflect',G.reflect);fadeTo(startBilan,500);};
}

/* ---------- bilan ---------- */
const scoreNow=()=>Math.max(40,100-Math.min(40,10*G.lineErr)-Math.min(20,4*G.cookErr));
function startBilan(){
  mode='bilan';clearUI();const score=scoreNow(),stars=score>=90?3:score>=75?2:1,best=Math.max(LS.get(SAVE+'.best',0),score);LS.set(SAVE+'.best',best);
  onFrame=()=>{ctx.drawImage(DBG||STOREBG,0,0);ctx.fillStyle='rgba(20,12,30,.72)';ctx.fillRect(0,0,W,H);};
  try{if(window.GVJetons&&!startBilan.paid){startBilan.paid=1;GVJetons.award(GAME_ID,score/100);}}catch(e){}
  const msg=score>=90?'Un souper parfait : liste, étiquettes et quantités, tout y est.':score>=75?'Très bon souper ! Quelques détails à revoir dans les étiquettes ou les quantités.':'Le souper est servi. La prochaine fois, relis la liste et les étiquettes avec plus de calme.';
  el(`<div class="bilan"><h2>Bilan du souper</h2><div class="stars">${'★'.repeat(stars)}<i>${'★'.repeat(3-stars)}</i></div><div class="bscore">${score} <small>/ 100</small></div><p>${msg}</p>
    <div class="bstats"><div><b>${G.checks}</b><span>vérification${G.checks>1?'s':''} avant de partir</span></div><div><b>${G.lineErr}</b><span>erreur${G.lineErr>1?'s':''} de liste</span></div><div><b>${G.cookErr}</b><span>erreur${G.cookErr>1?'s':''} de quantité</span></div></div>
    <div class="cbtns"><button class="btn sec" id="bRec">Télécharger mon reçu</button><button class="btn" id="bAgain">Un autre souper</button></div><a class="bhome" href="../index.html">← Retour aux jeux</a></div>`);
  $('#bRec').onclick=()=>downloadReceipt(score);$('#bAgain').onclick=()=>{startIntro();};
}
function downloadReceipt(score){
  const R=G.recipe,c=document.createElement('canvas'),lines=R.lines.length;c.width=620;c.height=360+lines*34;const g=c.getContext('2d');
  g.fillStyle='#fbf6e8';g.fillRect(0,0,c.width,c.height);g.fillStyle='#2a1c10';g.font='700 40px Pix, monospace';g.textAlign='center';g.fillText('MARCHÉ DU COIN',c.width/2,56);
  g.font='24px Pix, monospace';g.fillText('La colocation · Le marché',c.width/2,90);g.textAlign='left';
  g.fillText(new Date().toLocaleDateString('fr-CA'),30,130);g.textAlign='right';g.fillText(look.name||'',c.width-30,130);g.textAlign='left';
  g.fillRect(30,146,c.width-60,2);g.font='26px Pix, monospace';let y=184;
  R.lines.forEach(L=>{g.textAlign='left';g.fillText(L.say,30,y);g.textAlign='right';g.fillText(money(PRODUCTS[L.id].price*L.n),c.width-30,y);y+=34;});
  g.fillRect(30,y-14,c.width-60,2);g.textAlign='left';g.font='700 28px Pix, monospace';g.fillText('Repas : '+R.nom,30,y+24);g.fillText('Score : '+score+' / 100',30,y+62);
  g.font='22px Pix, monospace';g.fillText('Erreurs de liste : '+G.lineErr+' · de quantité : '+G.cookErr,30,y+96);
  c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='mon-souper.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);});
}

/* ---------- start (and a few hooks for testing: #store, #shelf-legumes, #cook, #dinner, #bilan) ---------- */
window.__G=G;window.__go={store:()=>{newGame();buildAv();startStore(true);},shelf:st=>{newGame();buildAv();startStore(true);openShelf(st);},cook:()=>{newGame();buildAv();for(const l of G.recipe.lines)G.cart[l.id]=l.n;startCook();},dinner:()=>{newGame();buildAv();startDinner();},bilan:()=>{newGame();buildAv();startBilan();},creator:()=>{buildAv();startCreator();}};
Promise.all([loadAll(),document.fonts?document.fonts.load('28px Pix'):0]).then(()=>{
  buildAv();requestAnimationFrame(frame);
  const h=location.hash.replace('#','');
  if(h==='store')__go.store();else if(h.startsWith('shelf-'))__go.shelf(h.slice(6));else if(h==='cook')__go.cook();else if(h==='dinner')__go.dinner();else if(h==='bilan')__go.bilan();else if(h==='creator')__go.creator();
  else startTitle();
});
