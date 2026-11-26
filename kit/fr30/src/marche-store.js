/* ===== Le marché: the store (walk around), the shelves (browse), labels, list, basket, last check ===== */
const G={recipe:null,cart:{},ticked:{},lineErr:0,cookErr:0,checks:0,station:null,attempt:0,reflect:{}};
const cartCount=()=>Object.values(G.cart).reduce((a,b)=>a+b,0);
const cartTotal=()=>Object.entries(G.cart).reduce((a,[id,n])=>a+PRODUCTS[id].price*n,0);
function cartAdd(id,d){const n=Math.max(0,(G.cart[id]||0)+d);if(n)G.cart[id]=n;else delete G.cart[id];sfx(d>0?'pick':'drop');refreshHud();if(mode==='shelf')refreshShelfBadges();}

/* ---------- the store room ---------- */
const WALL_B=64,BASE=84;                                  /* wall meets floor at y 64; furniture against the wall stands on y 84 */
const gI=(g,k,x,y)=>{const i=IM['g_'+k];if(i&&i.width)g.drawImage(i,Math.round(x),Math.round(y));};
const ZONES={legumes:[8,132],boulange:[138,236],laitier:[242,334],epicerie:[340,468]};
let STOREBG=null,STOREL=null;
function buildStoreBG(){
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  /* wall: cream plaster, sage wainscot, white trim */
  g.fillStyle='#f0e4c8';g.fillRect(0,0,W,WALL_B);
  for(let x=0;x<W;x+=24){g.fillStyle='rgba(120,90,50,.07)';g.fillRect(x,0,1,WALL_B);}
  g.fillStyle='#8fb39a';g.fillRect(0,42,W,22);g.fillStyle='#a9cbb2';g.fillRect(0,44,W,1);g.fillStyle='#6f9980';g.fillRect(0,62,W,2);
  for(let x=6;x<W;x+=18){g.fillStyle='rgba(60,100,80,.18)';g.fillRect(x,46,1,15);}
  g.fillStyle='#fffaf0';g.fillRect(0,40,W,2);g.fillStyle='#d8c9a8';g.fillRect(0,42,W,1);g.fillStyle='#d8ccb2';g.fillRect(0,64,W,2);
  const tg=g.createLinearGradient(0,0,0,12);tg.addColorStop(0,'rgba(60,40,20,.28)');tg.addColorStop(1,'rgba(60,40,20,0)');g.fillStyle=tg;g.fillRect(0,0,W,12);
  /* floor: checker tiles */
  for(let y=66,r=0;y<H;y+=16,r++)for(let x=0,k=0;x<W;x+=16,k++){g.fillStyle=((r+k)%2)?'#e7dac0':'#f4ebd6';g.fillRect(x,y,16,16);g.fillStyle='rgba(130,95,55,.10)';g.fillRect(x,y,16,1);g.fillRect(x,y,1,16);
    if(((x*7+y*13)%5)===0){g.fillStyle='rgba(130,95,55,.08)';g.fillRect(x+5,y+7,2,1);}}
  const fg=g.createLinearGradient(0,66,0,100);fg.addColorStop(0,'rgba(60,40,20,.22)');fg.addColorStop(1,'rgba(60,40,20,0)');g.fillStyle=fg;g.fillRect(0,66,W,34);
  /* doormat */
  g.fillStyle='#7a4a3a';g.fillRect(70,252,64,14);g.fillStyle='#a8644a';g.fillRect(71,253,62,12);g.fillStyle='#e8c8a0';for(let x=74;x<130;x+=6)g.fillRect(x,257,3,3);
  drawLegumesWorld(g);drawBoulangeWorld(g);drawLaitierWorld(g);drawEpicerieWorld(g);
  return c;
}
function wShadow(g,cx,cy,rx,ry){g.save();g.fillStyle='rgba(40,25,12,.26)';g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);g.fill();g.restore();}
function drawLegumesWorld(g){
  wShadow(g,70,BASE+1,60,3);
  const crates=[['crate_brown1',10],['crate_green2',26],['crate_teal',58],['crate_brown2',74],['crate_green2',90],['crate_teal',122]];
  const piles=[['pile_grape',9,47],['pile_red',33,42],['pile_lemon',58,47],['pile_yellow',75,46],['pile_lime',93,43],['pile_pink',109,45],['pile_cherry',121,48]];
  for(const[k,x]of crates){const i=IM['g_'+k];if(i)gI(g,k,x,BASE-i.height+1);}
  for(const[k,x,y]of piles)gI(g,k,x,y);
}
function drawBoulangeWorld(g){
  wShadow(g,187,BASE+1,46,3);
  gI(g,'bakery_counter',151,BASE-40+1);
  [['bread_a',160],['bread_b',176],['bread_c',192],['bread_e',208]].forEach(([k,x])=>gI(g,k,x,BASE-34));
}
function frameBox(g,x,y,w,h,body,glass){
  g.fillStyle='#8e96ad';g.fillRect(x,y,w,h);g.fillStyle='#c7cde0';g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle='#6c7590';g.fillRect(x+1,y+h-3,w-2,3);
  g.fillStyle=glass;g.fillRect(x+4,y+4,w-8,h-9);
}
function drawLaitierWorld(g){
  const x=246,y=20,w=84,h=66;wShadow(g,x+w/2,y+h+1,w/2+2,3);
  frameBox(g,x,y,w,h,'#c7cde0','#d8eef6');
  const grad=g.createLinearGradient(x,y,x,y+h);grad.addColorStop(0,'rgba(255,255,255,.35)');grad.addColorStop(1,'rgba(150,200,230,.15)');g.fillStyle=grad;g.fillRect(x+4,y+4,w-8,h-9);
  const rows=[['lait1','lait2','laitsl','creme'],['oeuf12','oeuf6','parm100','ched200'],['mozza250','beurre','yogourt','parmbl']];
  rows.forEach((row,r)=>{const by=y+4+(r+1)*19+r*0;row.forEach((id,i)=>{g.drawImage(SPR(id),x+6+i*19,by-19);});g.fillStyle='#9fc4d4';g.fillRect(x+4,by,w-8,2);g.fillStyle='#e9f6fb';g.fillRect(x+4,by,w-8,1);});
  g.fillStyle='rgba(255,255,255,.22)';for(let k=0;k<3;k++){g.beginPath();g.moveTo(x+10+k*26,y+4);g.lineTo(x+18+k*26,y+4);g.lineTo(x+8+k*26,y+h-6);g.lineTo(x+k*26,y+h-6);g.fill();}
  g.fillStyle='#6c7590';g.fillRect(x+w/2-1,y+4,2,h-9);g.fillStyle='#fffaf0';g.fillRect(x+w/2-5,y+h/2-6,1,10);g.fillRect(x+w/2+4,y+h/2-6,1,10);
  g.fillStyle='#3a86d4';g.fillRect(x+w/2-12,y+1,24,3);
}
function drawEpicerieWorld(g){
  const x=346,y=22,w=118,h=64;wShadow(g,x+w/2,y+h+1,w/2+2,3);
  g.fillStyle='#7a4a22';g.fillRect(x,y,w,h);g.fillStyle='#a8743a';g.fillRect(x+2,y+2,w-4,h-3);g.fillStyle='#f1e6cc';g.fillRect(x+4,y+4,w-8,h-8);
  for(let yy=y+6;yy<y+h-4;yy+=4)for(let xx=x+6;xx<x+w-6;xx+=4){g.fillStyle='rgba(120,90,50,.18)';g.fillRect(xx,yy,1,1);}
  const rows=[['spag500','spag1k','fusilli','tomcon','sauce'],['huileo','huilec','vinaigre','boulleg','boulpou'],['boulleg5','farine','sel','riz']];
  rows.forEach((row,r)=>{const by=y+4+(r+1)*19+2*r-1;row.forEach((id,i)=>g.drawImage(SPR(id),x+8+i*21+(row.length<5?10:0),by-19));
    g.fillStyle='#8a5a2a';g.fillRect(x+4,by,w-8,3);g.fillStyle='#c08a4e';g.fillRect(x+4,by,w-8,1);g.fillStyle='rgba(40,25,12,.25)';g.fillRect(x+4,by+3,w-8,1);});
}
/* things that stand in front of the wall and must be depth-sorted with people */
const PROPS=[
  {k:'island',base:176,draw(){wS(244,176,28,4);drawIm('g_bench',222,154);drawIm('g_flowers',228,134);drawIm('g_plants_row',233,140);}},
  {k:'cart1',base:228,draw(){wS(176,229,9,2);drawIm('g_cart_blue',167,203);}},
  {k:'cart2',base:234,draw(){wS(198,235,9,2);drawIm('g_cart_red',189,209);}},
  {k:'plantL',base:100,draw(){wS(136,101,6,2);drawIm('g_plant2',131,86);}},
  {k:'plantR',base:100,draw(){wS(237,101,6,2);drawIm('g_plant1',232,86);}},
  {k:'counter',base:222,draw(){wS(424,223,36,3);drawIm('g_counter_white',392,198);drawIm('g_counter_white',424,198);drawIm('g_register',436,181);}}
];
function wS(cx,cy,rx,ry){shadow(cx,cy,rx,ry,.24);}
const HOT={
  legumes:{r:[8,38,132,88],stand:[70,100],tag:'Fruits et légumes'},
  boulange:{r:[138,44,236,88],stand:[187,100],tag:'Boulangerie'},
  laitier:{r:[242,20,334,90],stand:[288,100],tag:'Produits laitiers et œufs'},
  epicerie:{r:[340,22,468,90],stand:[404,100],tag:'Épicerie'},
  caisse:{r:[388,184,462,226],stand:[374,228],tag:'La caisse'}
};
const BLOCK=[[214,148,270,178],[384,196,466,226]];
const hitR=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
const blocked=(x,y)=>BLOCK.some(b=>hitR(x,y,b));
const WALK={x0:14,x1:466,y0:96,y1:258};

let me={x:92,y:236,dir:3,anim:'idle',tx:null,ty:null,onArrive:null},cash={x:412,y:196,dir:3},hover=null,keys={};
function startStore(first){
  mode='store';G.station=null;clearUI(['hud']);
  if(!STOREBG){STOREBG=buildStoreBG();STOREL=lightLayer('rgb(250,242,230)',[[70,46,90,'255,236,190',.30],[187,40,70,'255,224,170',.34],[288,40,70,'200,230,255',.25],[404,44,86,'255,230,180',.30],[240,150,150,'255,236,200',.22]]);}
  me.tx=me.ty=null;if(first){me.x=92;me.y=236;me.dir=1;}
  buildHud();signs();
  if(first)setTimeout(()=>{if(mode==='store')hintChip('Clique sur un rayon pour parcourir les étiquettes.');},400);
  onFrame=frameStore;
}
function signs(){const S={legumes:['Fruits et légumes','#3f9a5a'],boulange:['Boulangerie','#c0682a'],laitier:['Laitiers et œufs','#3a86d4'],epicerie:['Épicerie','#8a5a2a']};
  for(const k in S){const z=ZONES[k],cx=(z[0]+z[1])/2;el(`<div class="wsign" style="left:${cx*3}px;top:${(k==='laitier'?5:5)*3}px;background:${S[k][1]}">${S[k][0]}</div>`,'sign-'+k);}
  const cx=(388+462)/2;el(`<div class="wsign small" style="left:${cx*3}px;top:${170*3}px;background:#2a1c10">Caisse</div>`,'sign-caisse');}
function hintChip(t,top){closePanel('hint');el(`<div class="hint ${top?'top':''}">${t}</div>`,'hint');setTimeout(()=>closePanel('hint'),4200);}
function frameStore(dt){
  /* movement: keys or click target */
  let vx=0,vy=0;if(keys.ArrowLeft||keys.a)vx-=1;if(keys.ArrowRight||keys.d)vx+=1;if(keys.ArrowUp||keys.w)vy-=1;if(keys.ArrowDown||keys.s)vy+=1;
  if(vx||vy){me.tx=null;me.path=null;moveMe(vx,vy,dt);}
  else if(me.tx!=null){const dx=me.tx-me.x,dy=me.ty-me.y,d=Math.hypot(dx,dy);
    if(d<2){if(me.path&&me.path.length){const w=me.path.shift();me.tx=w[0];me.ty=w[1];}else{me.tx=null;me.anim='idle';const f=me.onArrive;me.onArrive=null;if(f)f();}}else moveMe(dx/d,dy/d,dt);}
  else me.anim='idle';
  drawStore();
}
function moveMe(vx,vy,dt){const sp=70,n=Math.hypot(vx,vy)||1;let nx=me.x+vx/n*sp*dt,ny=me.y+vy/n*sp*dt;
  nx=Math.max(WALK.x0,Math.min(WALK.x1,nx));ny=Math.max(WALK.y0,Math.min(WALK.y1,ny));
  if(!blocked(nx,me.y))me.x=nx;else if(me.tx!=null)me.tx=null;if(!blocked(me.x,ny))me.y=ny;else if(me.tx!=null)me.tx=null;
  me.anim='walk';me.dir=Math.abs(vx)>Math.abs(vy)?(vx>0?0:2):(vy>0?3:1);}
function drawStore(){
  ctx.drawImage(STOREBG,0,0);
  /* string lights */
  for(let x=10;x<W;x+=22){const y=4+Math.round(Math.sin(x*.07)*2+2);ctx.fillStyle='#4a3a2a';ctx.fillRect(x,y,1,2);ctx.fillStyle=(Math.floor(T*1.4+x*.03)%2)?'#ffe9a8':'#ffd77a';ctx.fillRect(x-1,y+2,3,3);}
  if(hover&&HOT[hover]&&hover!=='caisse'){const r=HOT[hover].r;ctx.save();ctx.strokeStyle='rgba(255,236,160,'+(.65+.25*Math.sin(T*6))+')';ctx.lineWidth=1;ctx.strokeRect(r[0]+.5,r[1]+.5,r[2]-r[0],r[3]-r[1]);ctx.fillStyle='rgba(255,236,160,.10)';ctx.fillRect(r[0],r[1],r[2]-r[0],r[3]-r[1]);ctx.restore();}
  /* depth-sorted: props, cashier, me */
  const list=PROPS.map(p=>({y:p.base,f:()=>p.draw()}));
  list.push({y:cash.y,f:()=>{shadow(cash.x,cash.y+1,6,2);spr(AV.cash,'idle',cash.dir,Math.floor(T*4),cash.x,cash.y);}});
  list.push({y:me.y,f:()=>{shadow(me.x,me.y+1,6,2,.32);spr(AV.me,me.anim,me.dir,Math.floor(T*8),me.x,me.y);}});
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.f());
  if(hover==='caisse')bubble('dots',cash.x,cash.y-32);
  applyLight(STOREL,.34,'30,18,10');
  /* basket button badge etc. handled by HUD */
}
function stageXY(e){const r=stage.getBoundingClientRect(),k=stage._k||1;return[(e.clientX-r.left)/k/3,(e.clientY-r.top)/k/3];}
function hotAt(x,y){for(const k in HOT)if(hitR(x,y,HOT[k].r))return k;return null;}
cv.addEventListener('mousemove',e=>{if(mode!=='store'&&mode!=='shelf')return;const[x,y]=stageXY(e);
  if(mode==='store'){hover=hotAt(x,y);cv.style.cursor=hover?'pointer':'default';}
  else shelfMove(x,y);});
cv.addEventListener('click',e=>{actx();const[x,y]=stageXY(e);
  if(mode==='store'){const h=hotAt(x,y);
    if(h){walkTo(HOT[h].stand[0],HOT[h].stand[1],()=>{me.dir=1;if(h==='caisse')openCart();else openShelf(h);});}
    else if(y>=WALK.y0-6&&!blocked(x,y)){me.tx=Math.max(WALK.x0,Math.min(WALK.x1,x));me.ty=Math.max(WALK.y0,Math.min(WALK.y1,y));me.onArrive=null;me.path=null;}}
  else if(mode==='shelf')shelfClick(x,y);});
addEventListener('keydown',e=>{keys[e.key]=true;if(mode==='store'&&(e.key==='e'||e.key==='Enter'||e.key===' ')){const h=nearHot();if(h){e.preventDefault();if(h==='caisse')openCart();else openShelf(h);}}
  if(e.key==='Escape'){if($('#label'))closePanel('label');else if($('#cartp'))closePanel('cartp');else if($('#listp'))closePanel('listp');else if(mode==='shelf')leaveShelf();}});
addEventListener('keyup',e=>{keys[e.key]=false;});
function nearHot(){for(const k in HOT){const s=HOT[k].stand;if(Math.hypot(me.x-s[0],me.y-s[1])<18)return k;}return null;}
function walkTo(x,y,cb){const L=112;me.path=[];if(me.y>L+6&&y<=L+6){me.path.push([me.x,L]);me.path.push([x,L]);}me.path.push([x,y]);const w=me.path.shift();me.tx=w[0];me.ty=w[1];me.onArrive=cb;}

/* ---------- HUD: list and basket buttons ---------- */
function buildHud(top){closePanel('hud');
  el(`<div id="hud" class="${top?'top':''}"><button class="btn" id="bList">Ma liste</button><button class="btn" id="bCart">Mon panier <span class="pill" id="cartN">0</span></button></div>`);
  $('#bList').onclick=()=>toggleList();$('#bCart').onclick=()=>openCart();refreshHud();}
function refreshHud(){const n=$('#cartN');if(n){n.textContent=cartCount();n.classList.toggle('on',cartCount()>0);}}

/* ---------- the shopping list ---------- */
function toggleList(){if($('#listp')){closePanel('listp');return;}openList();}
function openList(){closePanel('listp');const R=G.recipe;
  const rows=R.lines.map((L,i)=>`<label class="lrow"><input type="checkbox" data-i="${i}" ${G.ticked[i]?'checked':''}><span class="box"></span><span class="ltxt">${esc(L.say)}</span></label>`).join('');
  const e=el(`<div class="listp" id="listp"><div class="paper"><div class="ptop"><b>Liste de courses</b><span>Souper pour ${R.serves}</span></div><div class="pdish">${esc(R.nom)}</div>${rows}<div class="pnote">${esc(R.intro)}</div><button class="btn sm" id="listX">Fermer</button></div></div>`);
  $$('#listp input').forEach(c=>c.onchange=()=>{G.ticked[c.dataset.i]=c.checked;sfx(c.checked?'ok':'drop');});$('#listX').onclick=()=>closePanel('listp');}

/* ---------- shelves: browse the products ---------- */
const SHELF_STYLE={
  legumes:{wall:'#f3e8cf',wall2:'#e6d4ae',board:'#b9803f',boardL:'#d9a45e',boardD:'#7e4e24',up:'#7e4e24'},
  boulange:{wall:'#f1dcb6',wall2:'#e2c28e',board:'#b9803f',boardL:'#dcaa66',boardD:'#7e4e24',up:'#8a5a2a'},
  laitier:{wall:'#d9e9f2',wall2:'#c3dbe8',board:'#a9d4e4',boardL:'#e9f8fd',boardD:'#6aa2bb',up:'#8e96ad'},
  epicerie:{wall:'#f2e7cd',wall2:'#e2d1ac',board:'#a8743a',boardL:'#c9965a',boardD:'#6e4220',up:'#6e4220'}
};
let SH=null,shHover=-1;
function shelfLayout(st){const S=STATIONS[st],n=S.order.length,cols=S.cols,rows=Math.ceil(n/cols),sc=cols<=4?3:2,sw=Math.floor((W-60)/cols);
  const bases=sc===3?[138,232]:[124,222],items=[];
  S.order.forEach((id,i)=>{const r=Math.floor(i/cols),c=i%cols,cnt=Math.min(cols,n-r*cols),off=(cols-cnt)*sw/2,cx=30+off+sw*(c+.5);
    items.push({id,cx,base:bases[r],sc,r,c,w:16*sc,h:20*sc,sw});});
  return{items,sc,bases,rows,sw};}
function openShelf(st){
  sfx('ok');G.station=st;mode='shelf';SH=shelfLayout(st);shHover=-1;closePanel('label');closePanel('cartp');closePanel('listp');
  $$('#ui .wsign').forEach(e=>e.remove());closePanel('hint');
  const S=STATIONS[st];
  el(`<div class="shelfsign" id="shsign">${S.name}</div>`);
  el(`<button class="btn back" id="shBack">← Retour au marché</button>`);$('#shBack').onclick=leaveShelf;
  /* price tags */
  const tags=SH.items.map((it,i)=>{const p=PRODUCTS[it.id];return `<div class="ptag" data-i="${i}" style="left:${it.cx*3}px;top:${(it.base+11)*3}px;width:${(it.sw-4)*3}px"><span class="pn">${esc(p.n)}</span><span class="ps">${esc(p.size)}</span><b>${money(p.price)}</b></div>`;}).join('');
  el(`<div id="ptags">${tags}</div>`);
  $$('#ptags .ptag').forEach(t=>{t.onclick=()=>openLabel(SH.items[+t.dataset.i].id);t.onmouseenter=()=>shHover=+t.dataset.i;t.onmouseleave=()=>shHover=-1;});
  refreshShelfBadges();buildHud(true);
  onFrame=frameShelf;hintChip('Clique sur un produit pour lire l’étiquette.',true);
}
function leaveShelf(){sfx('drop');closePanel('label');['shsign','shBack','ptags','badges'].forEach(closePanel);startStore(false);me.x=HOT[G.station]?HOT[G.station].stand[0]:me.x;me.y=HOT[G.station]?HOT[G.station].stand[1]+4:me.y;G.station=null;}
function refreshShelfBadges(){closePanel('badges');if(!SH)return;const b=SH.items.map((it,i)=>{const n=G.cart[it.id]||0;if(!n)return'';return `<div class="badge" style="left:${(it.cx+it.w/2-4)*3}px;top:${(it.base-it.h-(shHover===i?it.sc*2:0)+2)*3}px">${n}</div>`;}).join('');el(`<div id="badges">${b}</div>`);}
function shelfItemAt(x,y){if(!SH)return-1;for(let i=0;i<SH.items.length;i++){const it=SH.items[i];if(x>=it.cx-it.w/2-2&&x<=it.cx+it.w/2+2&&y>=it.base-it.h-4&&y<=it.base+20)return i;}return-1;}
function shelfMove(x,y){const i=shelfItemAt(x,y);if(i!==shHover){shHover=i;refreshShelfBadges();}cv.style.cursor=i>=0?'pointer':'default';}
function shelfClick(x,y){const i=shelfItemAt(x,y);if(i>=0)openLabel(SH.items[i].id);}
function frameShelf(dt){drawShelf();}
function drawShelf(){
  const st=G.station,S=SHELF_STYLE[st],lay=SH,c=ctx;
  c.fillStyle=S.wall;c.fillRect(0,0,W,H);
  /* wall pattern */
  if(st==='legumes'){for(let x=0;x<W;x+=20){c.fillStyle=S.wall2;c.fillRect(x,0,1,H);}}
  else if(st==='boulange'){for(let y=0;y<H;y+=8)for(let x=((y/8)%2?0:12);x<W;x+=24){c.fillStyle=S.wall2;c.fillRect(x,y,22,1);c.fillRect(x,y,1,8);}}
  else if(st==='laitier'){for(let y=0;y<H;y+=18){c.fillStyle=S.wall2;c.fillRect(0,y,W,1);}for(let x=0;x<W;x+=18){c.fillStyle=S.wall2;c.fillRect(x,0,1,H);}}
  else{for(let y=6;y<H;y+=8)for(let x=6;x<W;x+=8){c.fillStyle=S.wall2;c.fillRect(x,y,2,2);}}
  /* top: awning or wooden beam */
  if(st==='legumes'){for(let x=0;x<W;x+=24){c.fillStyle=(x/24)%2?'#f6f0dc':'#3f9a5a';c.fillRect(x,0,24,22);c.fillStyle='rgba(0,0,0,.10)';c.fillRect(x,18,24,4);
      c.fillStyle=(x/24)%2?'#f6f0dc':'#3f9a5a';c.beginPath();c.ellipse(x+12,22,12,5,0,0,Math.PI);c.fill();}}
  else{c.fillStyle=st==='laitier'?'#8e96ad':'#7e4e24';c.fillRect(0,0,W,26);c.fillStyle=st==='laitier'?'#c7cde0':'#a8743a';c.fillRect(0,0,W,3);c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,26,W,3);
    if(st==='laitier'){c.fillStyle='#3a86d4';c.fillRect(0,22,W,4);}}
  /* decor beside the sign */
  const dec={legumes:[['g_pile_red',10],['g_pile_lemon',436]],boulange:[['g_bread_b',12],['g_bread_c',440]],epicerie:[['g_plant1',14],['g_plant2',440]],laitier:[]}[st]||[];
  dec.forEach(([k,x])=>{const i=IM[k];if(i&&i.width)c.drawImage(i,x,2,i.width*2,i.height*2);});
  /* boards */
  lay.bases.slice(0,lay.rows).forEach(b=>{
    c.fillStyle='rgba(40,25,12,.14)';c.fillRect(8,b+10,W-16,5);
    if(st==='laitier'){c.fillStyle='rgba(180,220,238,.55)';c.fillRect(8,b-1,W-16,11);c.fillStyle=S.boardL;c.fillRect(8,b-1,W-16,2);c.fillStyle=S.boardD;c.fillRect(8,b+8,W-16,2);}
    else{c.fillStyle=S.boardL;c.fillRect(8,b-1,W-16,3);c.fillStyle=S.board;c.fillRect(8,b+2,W-16,6);c.fillStyle=S.boardD;c.fillRect(8,b+8,W-16,2);
      for(let x=14;x<W-14;x+=38){c.fillStyle='rgba(0,0,0,.10)';c.fillRect(x,b+3,1,4);}}});
  c.fillStyle=S.up;c.fillRect(0,26,8,H-26);c.fillRect(W-8,26,8,H-26);c.fillStyle='rgba(255,255,255,.18)';c.fillRect(0,26,2,H-26);c.fillRect(W-8,26,2,H-26);
  /* products: contact shadow, lift when hovered, glow */
  lay.items.forEach((it,i)=>{const hov=i===shHover,lift=hov?it.sc*2:0;
    shadow(it.cx,it.base,it.w*.46,it.sc*1.6,hov?.2:.3);
    drawCv(SPR(it.id),it.cx-it.w/2,it.base-it.h-lift+1,it.sc);
    if(hov){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.22;ctx.drawImage(SPR(it.id),Math.round(it.cx-it.w/2),Math.round(it.base-it.h-lift+1),it.w,it.h);ctx.restore();}});
  /* light */
  const warm=st!=='laitier';
  applyLight(lightLayer(warm?'rgb(250,240,226)':'rgb(232,242,252)',[[W/2,40,240,warm?'255,232,180':'200,230,255',.34],[W/2,200,220,warm?'255,226,170':'190,225,255',.2]]),.32,warm?'40,24,10':'10,30,50');
  if(st==='laitier'){ctx.fillStyle='rgba(255,255,255,.07)';for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(60+k*110,28);ctx.lineTo(90+k*110,28);ctx.lineTo(50+k*110,H);ctx.lineTo(20+k*110,H);ctx.fill();}}
}

/* ---------- label card ---------- */
function unitPrice(p){if(p.u==='g')return money(p.price/p.amt*100)+' / 100 g';if(p.u==='mL')return money(p.price/p.amt*100)+' / 100 mL';return '';}
function openLabel(id){sfx('pick');closePanel('label');const p=PRODUCTS[id],st=STATIONS[p.st];
  const chips=p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('');
  const e=el(`<div class="overlay" id="label"><div class="labelcard"><div class="lhead" style="background:${labelColor(id)}"><span>${esc(p.brand)}</span></div>
    <div class="lbody"><div class="lart"><canvas id="lbcv" width="16" height="20"></canvas><div class="lshadow"></div></div>
    <div class="ltext"><h2>${esc(p.n)}</h2><div class="lsize">${esc(p.size)}</div><div class="tags">${chips}</div>
      <div class="lblock"><b>Ingrédients</b> ${esc(p.ing)}</div><div class="lblock"><b>Meilleur avant</b> ${esc(p.bb.replace(/^meilleur avant : /,''))}</div>
      <div class="lprice"><b>${money(p.price)}</b><span>${unitPrice(p)}</span></div></div></div>
    <div class="lfoot"><div class="step"><button class="sbtn" id="lMinus">−</button><span class="sn" id="lN">0</span><button class="sbtn" id="lPlus">+</button></div><span class="lcap">dans mon panier</span><button class="btn sm" id="lClose">Fermer</button></div></div></div>`);
  const g=$('#lbcv').getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(SPR(id),0,0);
  const upd=()=>{$('#lN').textContent=G.cart[id]||0;};upd();
  $('#lPlus').onclick=()=>{cartAdd(id,1);upd();};$('#lMinus').onclick=()=>{cartAdd(id,-1);upd();};$('#lClose').onclick=()=>{closePanel('label');if(mode==='shelf')refreshShelfBadges();};
  e.onclick=ev=>{if(ev.target===e){closePanel('label');if(mode==='shelf')refreshShelfBadges();}};
}
function labelColor(id){const a=PRODUCTS[id].art;const o=a[1];return o.band||o.head||o.label||o.cap||o.tie||'#c0682a';}

/* ---------- basket and last check ---------- */
function openCart(){closePanel('cartp');closePanel('label');
  const ids=Object.keys(G.cart);
  const rows=ids.length?ids.map(id=>{const p=PRODUCTS[id],n=G.cart[id];return `<div class="crow" data-id="${id}"><canvas class="cart-ic" width="16" height="20" data-id="${id}"></canvas><div class="cname"><b>${esc(p.n)}</b><small>${esc(p.size)}</small></div><div class="step"><button class="sbtn" data-d="-1">−</button><span class="sn">${n}</span><button class="sbtn" data-d="1">+</button></div><div class="cprice">${money(p.price*n)}</div></div>`;}).join(''):`<div class="empty">Ton panier est vide. Va voir les rayons !</div>`;
  el(`<div class="overlay" id="cartp"><div class="cartcard"><h2>Mon panier</h2><div class="crows">${rows}</div><div class="ctotal"><span>Total</span><b>${money(cartTotal())}</b></div><div class="cbtns"><button class="btn sm sec" id="cBack">Continuer mes achats</button><button class="btn" id="cPay" ${ids.length?'':'disabled'}>Passer à la caisse</button></div></div></div>`);
  $$('#cartp .cart-ic').forEach(c=>{const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(SPR(c.dataset.id),0,0);});
  $$('#cartp .crow').forEach(r=>r.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{cartAdd(r.dataset.id,+b.dataset.d);openCart();}));
  $('#cBack').onclick=()=>closePanel('cartp');$('#cPay').onclick=goCheckout;
}
function verifyCart(){
  const R=G.recipe,lines=[],inFam=new Set();
  for(const L of R.lines){L.fam.forEach(f=>inFam.add(f));const have=G.cart[L.id]||0,wrong=L.fam.filter(f=>f!==L.id&&(G.cart[f]||0)>0);let ok=have===L.n&&!wrong.length,msg='';
    if(!ok){const size=PRODUCTS[L.id].size;
      if(wrong.length)msg=L.hints[wrong[0]]||'Ce n’est pas le bon produit. Relis la liste.';
      else if(have===0)msg='Il manque : '+L.say+'.';
      else if(have<L.n)msg=`Il faut ${L.n} × « ${size} » pour « ${L.say} ». Tu n’en as que ${have}.`;
      else msg=L.note||`C’est trop : il en faut ${L.n} seulement.`;}
    lines.push({L,ok,msg});}
  const extras=Object.keys(G.cart).filter(id=>!inFam.has(id));
  return{lines,extras,ok:lines.every(l=>l.ok)&&!extras.length};
}
function goCheckout(){closePanel('cartp');closePanel('label');sfx('ok');
  const ids=Object.keys(G.cart);
  const rows=ids.map(id=>{const p=PRODUCTS[id],n=G.cart[id];return `<div class="rrow hidden"><span>${n>1?n+' × ':''}${esc(p.n)} <small>${esc(p.size)}</small></span><b>${money(p.price*n)}</b></div>`;}).join('');
  const e=el(`<div class="overlay" id="rcp"><div class="receipt"><div class="rtitle">MARCHÉ DU COIN</div><div class="rsub">Merci de votre visite !</div><div class="rline"></div><div id="rrows">${rows}</div><div class="rline"></div><div class="rtot hidden" id="rtot"><span>TOTAL</span><b>${money(cartTotal())}</b></div><div class="rbtn hidden" id="rbtn"><button class="btn" id="rGo">Avant de partir : vérifier mes sacs</button></div></div></div>`);
  const rr=$$('#rrows .rrow');let i=0;const iv=setInterval(()=>{if(!$('#rcp')){clearInterval(iv);return;}if(i<rr.length){rr[i].classList.remove('hidden');sfx('beep');i++;}else{clearInterval(iv);$('#rtot').classList.remove('hidden');$('#rbtn').classList.remove('hidden');sfx('ok');}},rr.length>10?150:260);
  setTimeout(()=>{const b=$('#rGo');if(b)b.onclick=lastCheck;},50);
  const wait=setInterval(()=>{const b=$('#rGo');if(b){b.onclick=lastCheck;clearInterval(wait);}},100);
}
function lastCheck(){closePanel('rcp');G.checks++;const v=verifyCart();
  const rows=v.lines.map(l=>`<div class="vrow ${l.ok?'ok':'ko'}"><span class="vmark">${l.ok?'✓':'✗'}</span><div><b>${esc(l.L.say)}</b>${l.ok?'':`<small>${esc(l.msg)}</small>`}</div></div>`).join('')+
    v.extras.map(id=>`<div class="vrow ko"><span class="vmark">✗</span><div><b>${esc(PRODUCTS[id].n)} <em>(${esc(PRODUCTS[id].size)})</em></b><small>Ce produit n’est pas sur la liste.</small></div></div>`).join('');
  if(v.ok){sfx('chime');}else{sfx('no');G.lineErr+=v.lines.filter(l=>!l.ok).length+v.extras.length;}
  el(`<div class="overlay" id="vchk"><div class="checkcard"><h2>${v.ok?'Tout est dans les sacs !':'Attends… regarde ta liste.'}</h2><div class="vrows">${rows}</div>
    <div class="cbtns">${v.ok?'<button class="btn" id="vGo">Rentrer à la maison →</button>':'<button class="btn" id="vBack">Retourner au marché</button>'}</div></div></div>`);
  if(v.ok)$('#vGo').onclick=()=>{closePanel('vchk');fadeTo(startCook);};else $('#vBack').onclick=()=>{closePanel('vchk');startStore(false);me.x=374;me.y=232;};
}
function fadeTo(cb,ms=600){const f=el(`<div class="fade"></div>`);requestAnimationFrame(()=>f.style.opacity=1);setTimeout(()=>{cb();f.style.opacity=0;setTimeout(()=>f.remove(),ms);},ms);}
