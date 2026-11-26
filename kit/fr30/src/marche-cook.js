/* ===== Le marché: cooking in the flat, then dinner by candlelight ===== */
let KBG=null,stepIdx=0,part=[],steam=[],dusk=0;
const KB=88;                                              /* kitchen furniture stands on y 88 */
function kImg(k,x,base){const i=IM[k];if(!i||!i.width)return;ctx.drawImage(i,Math.round(x),Math.round(base-i.height));}
function buildKitchenBG(){
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  g.fillStyle='#2b2236';g.fillRect(0,0,W,H);
  for(let x=0;x<W;x+=16){g.drawImage(IM.t_wall,x,40);}
  for(let y=72;y<H;y+=16)for(let x=0;x<W;x+=16)g.drawImage(IM.t_floor,x,y);
  const gr=g.createLinearGradient(0,40,0,0);gr.addColorStop(0,'rgba(20,12,30,0)');gr.addColorStop(1,'rgba(20,12,30,.9)');g.fillStyle=gr;g.fillRect(0,0,W,40);
  const sh=g.createLinearGradient(0,72,0,100);sh.addColorStop(0,'rgba(30,18,10,.30)');sh.addColorStop(1,'rgba(30,18,10,0)');g.fillStyle=sh;g.fillRect(0,72,W,28);
  const put=(k,x,base)=>{const i=IM[k];if(i&&i.width){g.save();g.fillStyle='rgba(30,18,10,.28)';g.beginPath();g.ellipse(x+i.width/2,base,i.width/2,2,0,0,7);g.fill();g.restore();g.drawImage(i,Math.round(x),Math.round(base-i.height));}};
  put('k_fridge',92,KB);put('k_counter',112,KB);put('k_counter',141,KB);put('k_stove',170,KB);put('k_sink',188,KB);put('k_counter',212,KB);put('k_counter',241,KB);put('k_counter',270,KB);
  const hd=IM.k_hood;g.drawImage(hd,171,KB-28-hd.height+4);
  g.drawImage(IM.p_window_curtain,200,38);g.drawImage(IM.k_paint2,130,48);g.drawImage(IM.k_paint1,262,46);
  g.drawImage(IM.p_plant_big,318,KB-30);
  return c;
}
/* the groceries you bought appear on the counters: your choices are on show */
function counterItems(){const slots=[118,134,150,225,241,257,273,289],ids=G.recipe.lines.map(l=>l.id);return ids.map((id,i)=>({id,x:slots[i]}));}
function startCook(){
  mode='cook';stepIdx=0;dusk=0;clearUI();onFrame=frameCook;if(!KBG)KBG=buildKitchenBG();
  me.x=186;me.y=98;me.dir=1;me.anim='idle';steam=[];buildHud0();
  runStep();
}
function buildHud0(){el(`<div id="hud"><button class="btn" id="bList">Ma recette</button></div>`);$('#bList').onclick=()=>toggleRecipe();}
function toggleRecipe(){if($('#listp')){closePanel('listp');return;}const R=G.recipe;
  el(`<div class="listp" id="listp"><div class="paper"><div class="ptop"><b>Recette</b><span>pour ${R.serves}</span></div><div class="pdish">${esc(R.nom)}</div>${R.steps.map((s,i)=>`<div class="lrow ${i<stepIdx?'done':''}"><span class="box ${i<stepIdx?'on':''}"></span><span class="ltxt">${esc(s.say)}</span></div>`).join('')}<button class="btn sm" id="listX">Fermer</button></div></div>`);
  $('#listX').onclick=()=>closePanel('listp');}
function frameCook(dt){
  dusk=Math.min(1,dusk+dt*.04);
  const KZ=2,KX=240,KY=95,kx=x=>KX+(x-190)*KZ,ky=y=>KY+(y-70)*KZ;
  ctx.save();ctx.translate(KX,KY);ctx.scale(KZ,KZ);ctx.translate(-190,-70);ctx.imageSmoothingEnabled=false;
  ctx.drawImage(KBG,0,0);
  /* the groceries on the counters */
  counterItems().forEach(o=>{shadow(o.x+8,76,6,1.6,.3);drawCv(SPR(o.id),o.x,57,1);});
  /* pot on the stove + steam */
  const potY=70;ctx.fillStyle='#3a3f4e';ctx.fillRect(173,potY,12,6);ctx.fillStyle='#5b6378';ctx.fillRect(173,potY,12,2);ctx.fillStyle='#2a2e3a';ctx.fillRect(172,potY+1,1,3);ctx.fillRect(185,potY+1,1,3);
  const boil=(window.__boil||0);if(Math.random()<(.1+boil*.5))steam.push({x:177+Math.random()*6,y:potY-1,vy:-(10+Math.random()*8),a:.7,s:1+Math.random()});
  steam.forEach(p=>{p.y+=p.vy*dt;p.x+=Math.sin(T*3+p.y)*.1;p.a-=dt*.5;ctx.fillStyle=`rgba(255,255,255,${Math.max(0,p.a*.6)})`;ctx.fillRect(Math.round(p.x),Math.round(p.y),Math.ceil(p.s),Math.ceil(p.s));});
  steam=steam.filter(p=>p.a>0);
  shadow(me.x,me.y+1,6,2,.32);spr(AV.me,'idle',me.dir,Math.floor(T*4),me.x,me.y);
  if(window.__emote&&window.__emote>T)bubble('check',me.x,me.y-32);
  ctx.restore();
  /* light: dusk turns to evening as you cook; stove and lamp stay warm */
  const k=dusk,r=Math.round(220-110*k),gg=Math.round(208-96*k),b=Math.round(226-30*k);
  applyLight(lightLayer(`rgb(${r},${gg},${b})`,[[kx(186),ky(70),220,'255,200,130',.45],[kx(250),ky(60),160,'255,220,160',.28],[kx(120),ky(60),120,'255,220,160',.20]]),.5+.15*k);
}

/* ---------- a cooking step ---------- */
function runStep(){
  closePanel('cook');const R=G.recipe,s=R.steps[stepIdx];window.__boil=0;
  const dots=R.steps.map((_,i)=>`<i class="${i<stepIdx?'d':i===stepIdx?'c':''}"></i>`).join('');
  const p=el(`<div class="cookp" id="cook"><div class="cl"><div class="cstep">Étape ${stepIdx+1} sur ${R.steps.length}</div><div class="cinstr">${esc(s.say)}</div><div class="cdots">${dots}</div><div class="cmsg" id="cmsg"></div></div><div class="cw" id="cw"></div></div>`);
  ({measure:wMeasure,scale:wScale,count:wCount,cut:wCut,wait:wWait})[s.t](s,$('#cw'));
}
function stepDone(msg){sfx('ok');window.__emote=T+1.4;const m=$('#cmsg');if(m){m.className='cmsg good';m.textContent=msg||'Bien !';}
  setTimeout(()=>{stepIdx++;if(stepIdx>=G.recipe.steps.length){closePanel('cook');fadeTo(startDinner,800);}else runStep();},900);}
function stepWrong(msg){sfx('no');G.cookErr++;const m=$('#cmsg');if(m){m.className='cmsg bad';m.textContent=msg;}}
function icv(id,s){const c=document.createElement('canvas');c.width=16;c.height=20;c.style.cssText=`width:${16*s}px;height:${20*s}px;image-rendering:pixelated`;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(SPR(id),0,0);return c;}
const nfr=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');

/* measure: a jug, + and − buttons by the step size */
function wMeasure(s,box){let v=0;const max=Math.max(500,Math.ceil(s.tgt*1.6/250)*250);
  const ticks=[];for(let m=s.inc;m<=max;m+=s.inc){const lab=(s.inc>=250||m%250===0)?`<span>${nfr(m)}</span>`:'';ticks.push(`<div class="tick" style="bottom:${m/max*100}%">${lab}</div>`);}
  box.innerHTML=`<div class="jugwrap"><div class="jug"><div class="liq" id="liq"></div>${ticks.join('')}</div><div class="jinfo"><div class="read" id="read">0 mL</div><div class="jb"><button class="sbtn" id="mMinus">−</button><button class="sbtn" id="mPlus">+</button></div><small>+ ou − ${nfr(s.inc)} ${s.u}</small><button class="btn" id="mOk">C’est bon !</button></div></div>`;
  const upd=()=>{$('#liq').style.height=(v/max*100)+'%';$('#read').textContent=nfr(v)+' '+s.u;};upd();
  $('#mPlus').onclick=()=>{if(v+s.inc<=max){v+=s.inc;sfx('pour');upd();}};$('#mMinus').onclick=()=>{if(v-s.inc>=0){v-=s.inc;sfx('drop');upd();}};
  $('#mOk').onclick=()=>{if(v===s.tgt)stepDone('Exactement la bonne quantité.');else stepWrong(v<s.tgt?`Pas assez : tu as ${nfr(v)} ${s.u}. Relis la consigne.`:`Trop : tu as ${nfr(v)} ${s.u}. Relis la consigne.`);};}
/* scale: a kitchen balance with a digital display */
function wScale(s,box){let v=0;
  box.innerHTML=`<div class="balwrap"><div class="bal"><div class="pan" id="pan"></div><div class="stem"></div><div class="base"><div class="disp" id="disp">0 g</div></div></div><div class="jinfo"><div class="jb"><button class="sbtn" id="mMinus">−</button><button class="sbtn" id="mPlus">+</button></div><small>+ ou − ${nfr(s.inc)} ${s.u}</small><button class="btn" id="mOk">C’est bon !</button></div></div>`;
  const pan=$('#pan');const upd=()=>{$('#disp').textContent=nfr(v)+' '+s.u;pan.innerHTML='';const n=Math.min(8,Math.round(v/s.inc));for(let i=0;i<n;i++){const c=icv(s.item,2);c.style.cssText+=`;position:absolute;left:${10+(i%4)*34}px;bottom:${6+Math.floor(i/4)*18}px`;pan.appendChild(c);}};upd();
  $('#mPlus').onclick=()=>{v+=s.inc;sfx('pick');upd();};$('#mMinus').onclick=()=>{if(v>=s.inc){v-=s.inc;sfx('drop');upd();}};
  $('#mOk').onclick=()=>{if(v===s.tgt)stepDone('Le poids est exact.');else stepWrong(v<s.tgt?`Pas assez : ${nfr(v)} ${s.u}. Relis la consigne.`:`Trop : ${nfr(v)} ${s.u}. Relis la consigne.`);};}
/* count: click the ingredient once for each one you take, then confirm */
function wCount(s,box){let n=0;
  box.innerHTML=`<div class="cntwrap"><button class="bigitem" id="bi"></button><div class="bowl" id="bowl"></div><div class="jinfo"><div class="read" id="read">0 ${s.what}</div><small>Clique sur le produit pour en prendre un.</small><div class="jb"><button class="sbtn" id="mMinus">−</button></div><button class="btn" id="mOk">C’est bon !</button></div></div>`;
  $('#bi').appendChild(icv(s.item,7));
  const upd=()=>{$('#read').textContent=n+' '+s.what;const b=$('#bowl');b.innerHTML='';for(let i=0;i<Math.min(n,12);i++){const c=icv(s.item,2);c.style.cssText+=`;margin:0 -4px`;b.appendChild(c);}};upd();
  $('#bi').onclick=()=>{if(n<20){n++;sfx('pick');upd();}};$('#mMinus').onclick=()=>{if(n>0){n--;sfx('drop');upd();}};
  $('#mOk').onclick=()=>{if(n===s.n)stepDone('Le compte est bon.');else stepWrong(n<s.n?`Pas assez : tu en as ${n}. Relis la consigne.`:`Trop : tu en as ${n}. Relis la consigne.`);};}
/* cut: chop on the board */
function wCut(s,box){let n=0;
  box.innerHTML=`<div class="cutwrap"><div class="board" id="board"><button class="bigitem" id="bi"></button><div class="pieces" id="pieces"></div></div><div class="jinfo"><div class="read" id="read">0 / ${s.n}</div><small>Clique sur la planche pour couper.</small></div></div>`;
  $('#bi').appendChild(icv(s.item,6));
  const upd=()=>{$('#read').textContent=n+' / '+s.n;const p=$('#pieces');p.innerHTML='';for(let i=0;i<n;i++){const c=icv(s.item,2);c.style.cssText+=`;transform:rotate(${(i*47)%40-20}deg) scale(.8);margin:0 -3px`;p.appendChild(c);}};upd();
  $('#bi').onclick=()=>{if(n<s.n){n++;sfx('chop');const b=$('#bi');b.classList.remove('chop');void b.offsetWidth;b.classList.add('chop');upd();if(n===s.n)setTimeout(()=>stepDone('Bien coupé.'),300);}};}
/* wait: start the timer and watch the pot */
function wWait(s,box){
  box.innerHTML=`<div class="waitwrap"><div class="clock" id="clk">${s.mins} min</div><div class="pot"><div class="water"></div><div class="lid"></div></div><div class="jinfo"><small>La minuterie va plus vite que dans la vraie vie.</small><button class="btn" id="mOk">Lancer la minuterie</button></div></div>`;
  $('#mOk').onclick=()=>{const b=$('#mOk');b.disabled=true;window.__boil=1;sfx('pour');const t0=performance.now(),D=3200,iv=setInterval(()=>{const f=Math.min(1,(performance.now()-t0)/D);$('#clk').textContent=Math.max(0,Math.ceil(s.mins*(1-f)))+' min';if(f>=1){clearInterval(iv);window.__boil=0;sfx('chime');stepDone('C’est prêt !');}},80);};
}

/* ---------- dinner by candlelight (drawn at double size: every unit below is 2 canvas pixels) ---------- */
const Z=2;
let dTimer=0,dLines=[],dBubbles=[],dust=[],dSteam=[],dStage=0;
const zim=(k,x,y,flip)=>drawIm(k,x*Z,y*Z,Z,flip);
const zcv=(c,x,y)=>drawCv(c,x*Z,y*Z,Z);
const zr=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x*Z),Math.round(y*Z),Math.round(w*Z),Math.round(h*Z));};
const zs=(cx,cy,rx,ry,a)=>shadow(cx*Z,cy*Z,rx*Z,ry*Z,a);
let CANDLE=null,PLATE=null,GLASS=null,BASKET=null,DBG=null;
function startDinner(){
  mode='dinner';clearUI();onFrame=frameDinner;dTimer=0;dStage=0;dBubbles=[];dust=Array.from({length:26},()=>({x:Math.random()*240,y:Math.random()*135,s:.3+Math.random()*.6,p:Math.random()*6}));dSteam=[];
  CANDLE=candleSprite();PLATE=plateSprite(G.recipe.dish);GLASS=glassSprite();BASKET=breadBasket();DBG=buildDinnerBG();
  sfx('chime');
  el(`<div class="dcap"><b>${esc(G.recipe.nom)}</b><span>${esc(G.recipe.table)}</span></div>`,'dcap');
  const lines=[[2.2,'ines',rnd(TABLE_TALK.ines)],[5.2,'theo',rnd(TABLE_TALK.theo)],[8.2,'me','Bon appétit, la coloc !']];
  lines.forEach(([t,who,txt])=>setTimeout(()=>{if(mode!=='dinner')return;sfx('clink');const pos={ines:[156,52],theo:[120,34],me:[76,52]}[who];dBubbles.push({who,t:T});speak(pos[0]*Z/1,pos[1]*Z,esc(txt),3400,who);},t*1000));
  setTimeout(()=>{if(mode!=='dinner')return;el(`<button class="btn dgo" id="dGo">Continuer →</button>`);$('#dGo').onclick=()=>{closePanel('dGo');fadeTo(startReflect,700);};},9800);
}
function buildDinnerBG(){
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  const Zr=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x*Z,y*Z,w*Z,h*Z);};
  /* wall: warm panelling */
  Zr(0,0,240,46,'#7a5448');for(let x=0;x<240;x+=20){Zr(x,0,1,46,'#6a463c');}Zr(0,30,240,2,'#a07058');Zr(0,32,240,14,'#5e3e34');for(let x=6;x<240;x+=20)Zr(x,34,8,10,'#6a463c');Zr(0,46,240,2,'#3a2420');
  /* floor */
  for(let y=48;y<135;y+=16)for(let x=0;x<240;x+=16)g.drawImage(IM.t_floor,x*Z,y*Z,16*Z,16*Z);
  const fg=g.createLinearGradient(0,48*Z,0,70*Z);fg.addColorStop(0,'rgba(20,10,5,.45)');fg.addColorStop(1,'rgba(20,10,5,0)');g.fillStyle=fg;g.fillRect(0,48*Z,W,22*Z);
  /* night window */
  Zr(158,7,32,26,'#0e1536');for(let i=0;i<14;i++)Zr(160+((i*37)%28),9+((i*19)%20),1,1,i%3?'#fff4c8':'#ffd77a');
  g.fillStyle='#fff4d0';g.beginPath();g.arc(178*Z,16*Z,3.4*Z,0,7);g.fill();g.fillStyle='#0e1536';g.beginPath();g.arc(179.6*Z,15*Z,3*Z,0,7);g.fill();
  Zr(156,5,36,3,'#c8a070');Zr(156,33,36,3,'#a8804e');Zr(156,5,3,31,'#c8a070');Zr(189,5,3,31,'#c8a070');Zr(172,5,2,31,'#c8a070');
  /* pictures, plant, rug */
  g.drawImage(IM.k_paint1,40*Z,12*Z,10*Z,13*Z);g.drawImage(IM.k_paint2,60*Z,16*Z,10*Z,9*Z);g.drawImage(IM.k_paint1,105*Z,10*Z,10*Z,13*Z);
  g.drawImage(IM.p_plant_big,206*Z,18*Z,18*Z*1,31*Z*1);
  g.drawImage(IM.p_rug_red,60*Z,76*Z,120*0+60*Z,39*Z);
  return c;
}
function frameDinner(dt){
  dTimer+=dt;ctx.drawImage(DBG,0,0);
  /* string lights along the top of the wall */
  for(let i=0;i<14;i++){const x=10+i*17,y=3+Math.sin(i*.9)*2+2;zr(x,y,1,3,'#2a1c10');const on=(Math.floor(T*1.2+i)%2);zr(x-1,y+3,3,3,on?'#ffe9a8':'#ffc860');}
  /* table cloth */
  zs(120,104,38,5,.34);
  zr(86,78,68,24,'#e8d6c0');zr(86,78,68,2,'#fff6e8');zr(86,98,68,6,'#c0392b');
  for(let y=80;y<98;y+=4)for(let x=88;x<152;x+=4){if(((x-88)/4+(y-80)/4)%2===0)zr(x,y,4,4,'#d85a4a');else zr(x,y,4,4,'#fffaf0');}
  zr(86,98,68,1,'#8a2a20');for(let x=88;x<152;x+=6)zr(x,99,3,4,'#a8301f');
  zr(86,78,1,26,'#b8a890');zr(153,78,1,26,'#9a8a72');
  /* Théo sits behind the table */
  zs(120,70,8,2,.3);spr(AV.theo,'sit',3,0,120*Z,76*Z,Z);
  /* chairs + people on the sides */
  zim('k_chair_r',70,76);zs(76,100,7,2,.3);spr(AV.me,'sit',0,0,76*Z,100*Z,Z);
  zim('k_chair_r',160,76,true);zs(164,100,7,2,.3);spr(AV.ines,'sit',2,0,164*Z,100*Z,Z);
  /* the table in front of everyone: dishes, glasses, bread, candles */
  const plates=[[92,88],[132,88],[112,84]];plates.forEach(([x,y])=>{zcv(PLATE,x,y);});
  zcv(GLASS,86,84);zcv(GLASS,146,84);zcv(BASKET,142,78);
  zcv(CANDLE,114,72);zcv(CANDLE,123,74);
  /* steam above the plates */
  if(Math.random()<.35)dSteam.push({x:(plates[Math.floor(Math.random()*3)][0]+9)*Z,y:(plates[0][1]+2)*Z,a:.5});
  dSteam.forEach(p=>{p.y-=14*dt;p.x+=Math.sin(T*2+p.y*.1)*.3;p.a-=dt*.3;ctx.fillStyle=`rgba(255,255,255,${Math.max(0,p.a)*.55})`;ctx.fillRect(Math.round(p.x),Math.round(p.y),3,3);});dSteam=dSteam.filter(p=>p.a>0);
  /* flames */
  const fl=(x,y,s)=>{const f=1+.25*Math.sin(T*9+s)+.15*Math.sin(T*17+s*2);ctx.fillStyle='#ffd34a';ctx.fillRect(Math.round((x+2)*Z),Math.round((y-2-f)*Z),Z,Math.round((2+f)*Z));ctx.fillStyle='#fff3b0';ctx.fillRect(Math.round((x+2)*Z),Math.round((y-1)*Z),Z,Z);ctx.fillStyle='#ff9a2e';ctx.fillRect(Math.round((x+2)*Z),Math.round((y-3-f)*Z),Z,Z);};
  fl(114,72,1);fl(123,74,3);
  /* hearts now and then */
  dBubbles=dBubbles.filter(b=>T-b.t<2.6);dBubbles.forEach(b=>{const pos={ines:[164,60],theo:[120,42],me:[76,60]}[b.who];bubble('heart',pos[0]*Z+14,pos[1]*Z-4,Z/2);});
  /* dust floating in the candle light */
  dust.forEach(d=>{d.y-=d.s*3*dt;d.x+=Math.sin(T+d.p)*.1;if(d.y<0)d.y=135;const dist=Math.hypot(d.x-118,d.y-76);if(dist<70){ctx.fillStyle=`rgba(255,230,170,${.5-dist/160})`;ctx.fillRect(Math.round(d.x*Z),Math.round(d.y*Z),Z,Z);}});
  /* light: dark blue evening, everything near the candles glows warm */
  const f=1+.06*Math.sin(T*8)+.04*Math.sin(T*13.7);
  applyLight(lightLayer('rgb(82,74,112)',[[118*Z,80*Z,95*Z*f,'255,196,120',.95],[118*Z,76*Z,45*Z*f,'255,222,160',.7],[40*Z,8*Z,50*Z,'255,220,150',.25],[110*Z,10*Z,60*Z,'255,220,150',.22],[185*Z,10*Z,50*Z,'255,220,150',.25]]),.62);
  glowAdd(118*Z,76*Z,40*Z*f,'255,170,80',.22);
}
