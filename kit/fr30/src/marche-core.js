/* ===== Le marché: core (stage, images, avatars, audio, light, main loop) ===== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const W=480,H=270,cv=$('#c'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const stage=$('#stage'),ui=$('#ui');
function fit(){const vw=document.documentElement.clientWidth||innerWidth||1440,vh=document.documentElement.clientHeight||innerHeight||810;
  const k=Math.max(.15,Math.min(vw/1440,vh/810));stage.style.transformOrigin='0 0';stage.style.transform=`scale(${k})`;
  stage.style.left=Math.round((vw-1440*k)/2)+'px';stage.style.top=Math.round((vh-810*k)/2)+'px';stage._k=k;}
addEventListener('resize',fit);try{new ResizeObserver(fit).observe(document.documentElement);}catch(e){}fit();setTimeout(fit,100);setTimeout(fit,600);
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const money=n=>n.toFixed(2).replace('.',',')+' $';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rnd=a=>a[Math.floor(Math.random()*a.length)];

/* ---------- images (all sprites are embedded in the page) ---------- */
const IM={};
function loadAll(){const jobs=[];
  for(const grp of ['g','p','k','t','l'])for(const k in ASSETS[grp])jobs.push(new Promise(r=>{const i=new Image();i.onload=()=>r();i.onerror=()=>r();i.src='data:image/png;base64,'+ASSETS[grp][k];IM[grp+'_'+k]=i;}));
  return Promise.all(jobs);}
const drawIm=(k,x,y,s=1,flip=false,a=1)=>{const i=IM[k];if(!i||!i.width)return;ctx.save();if(a!==1)ctx.globalAlpha=a;
  if(flip){ctx.translate(Math.round(x)+i.width*s,0);ctx.scale(-1,1);ctx.drawImage(i,0,Math.round(y),i.width*s,i.height*s);}else ctx.drawImage(i,Math.round(x),Math.round(y),i.width*s,i.height*s);ctx.restore();};
const drawCv=(c,x,y,s=1,a=1)=>{ctx.save();if(a!==1)ctx.globalAlpha=a;ctx.drawImage(c,Math.round(x),Math.round(y),c.width*s,c.height*s);ctx.restore();};
/* soft contact shadow under anything that rests on a surface */
function shadow(cx,cy,rx,ry,a=.28){ctx.save();ctx.fillStyle=`rgba(30,18,10,${a})`;ctx.beginPath();ctx.ellipse(Math.round(cx),Math.round(cy),rx,ry,0,0,7);ctx.fill();ctx.restore();}

/* ---------- avatars (same layers and storage as Ma semaine) ---------- */
const p2=n=>String(n).padStart(2,'0');
const DEF={body:3,eyes:2,hair:[2,1],outfit:[3,2],g:'m',name:''};
const INES={body:3,eyes:3,hair:[5,2],outfit:[4,1],name:'Inès'},THEO={body:7,eyes:5,hair:[4,3],outfit:[5,2],name:'Théo'},CASH={body:5,eyes:4,hair:[3,2],outfit:[2,1],name:'Caissière'};
const savedLook=()=>LS.get('jeuxFr30.look',null)||LS.get('jeuxFr30.semaine.look',null);
let look=Object.assign({},DEF,savedLook()||{});
function compose(l){const c=document.createElement('canvas');c.width=384;c.height=128;const g=c.getContext('2d');
  for(const k of ['body_'+p2(l.body),'eyes_'+p2(l.eyes),'outfit_'+p2(l.outfit[0])+'_'+p2(l.outfit[1]),'hair_'+p2(l.hair[0])+'_'+p2(l.hair[1])]){const im=IM['l_'+k];if(im&&im.width)g.drawImage(im,0,0);}return c;}
const ROW={idle:0,walk:1,sit:2,phone:3};
function spr(c,anim,dir,fr,x,y,s=1,a=1){const col=anim==='phone'?4+(fr%6):anim==='sit'?(dir*3)%12:dir*6+(fr%6);
  ctx.save();if(a!==1)ctx.globalAlpha=a;ctx.drawImage(c,col*16,ROW[anim]*32,16,32,Math.round(x-8*s),Math.round(y-30*s),16*s,32*s);ctx.restore();}
let AV={me:null,ines:null,theo:null,cash:null};
function buildAv(){AV.me=compose(look);AV.ines=compose(INES);AV.theo=compose(THEO);AV.cash=compose(CASH);}

/* ---------- audio (tiny, only after a click) ---------- */
const AU={c:null,on:true};
function actx(){if(!AU.c){try{AU.c=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return AU.c;}
function tone(f,t0,d,v=.05,type='sine'){const c=actx();if(!c||!AU.on)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;o.connect(g);g.connect(c.destination);
  const t=c.currentTime+t0;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.05);}
function sfx(k){try{
  if(k==='pick'){tone(520,0,.08,.05,'square');tone(780,.07,.1,.04,'square');}
  else if(k==='drop'){tone(420,0,.09,.05,'square');tone(300,.07,.1,.04,'square');}
  else if(k==='ok'){tone(660,0,.1,.05);tone(880,.09,.16,.05);}
  else if(k==='no'){tone(200,0,.16,.06,'sawtooth');}
  else if(k==='beep'){tone(1500,0,.07,.04,'square');}
  else if(k==='chop'){tone(180,0,.05,.07,'square');}
  else if(k==='pour'){for(let i=0;i<4;i++)tone(300+i*40,i*.05,.08,.025,'triangle');}
  else if(k==='chime'){[523,659,784,1047].forEach((f,i)=>tone(f,i*.16,.9,.045));}
  else if(k==='clink'){tone(2400,0,.25,.03);tone(3100,.04,.2,.02);}
}catch(e){}}

/* ---------- light: multiply layer, additive glows, vignette ---------- */
function lightLayer(base,glows,vig=.5){const L=document.createElement('canvas');L.width=W;L.height=H;const c=L.getContext('2d');c.fillStyle=base;c.fillRect(0,0,W,H);c.globalCompositeOperation='lighter';
  for(const[x,y,r,rgb,a]of glows){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
  return L;}
function applyLight(L,vig=.5,vigCol='8,10,26'){ctx.save();ctx.globalCompositeOperation='multiply';ctx.drawImage(L,0,0);ctx.restore();
  const g=ctx.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.98);g.addColorStop(0,`rgba(${vigCol},0)`);g.addColorStop(1,`rgba(${vigCol},${vig})`);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
function glowAdd(x,y,r,rgb,a){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------- pixel emote bubbles ---------- */
const BM={heart:['.XX.XX.','XXXXXXX','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'],check:['.......','......X','.....XX','X...XX.','XX.XX..','.XXX...','..X....'],excl:['..XXX..','..XXX..','..XXX..','..XXX..','...X...','.......','..XXX..'],dots:['.......','.......','X.X.X.X','.......','.......','.......','.......']};
const BC={heart:'#e0584f',check:'#2f9e44',excl:'#e0584f',dots:'#555'};
function bubble(kind,x,y,s=1){const bx=Math.round(x-6*s),by=Math.round(y-13*s);ctx.fillStyle='#2a1c10';ctx.fillRect(bx-s,by-s,15*s,15*s);ctx.fillRect(bx+5*s,by+14*s,3*s,2*s);
  ctx.fillStyle='#fff';ctx.fillRect(bx,by,13*s,13*s);ctx.fillRect(bx+6*s,by+14*s,s,s);ctx.fillStyle=BC[kind];const m=BM[kind];
  for(let j=0;j<7;j++)for(let i=0;i<7;i++)if(m[j][i]==='X')ctx.fillRect(bx+(3+i)*s,by+(3+j)*s,s,s);}

/* ---------- HTML helpers ---------- */
function clearUI(keep){$$('#ui > *').forEach(e=>{if(!keep||!keep.includes(e.id))e.remove();});}
function el(html,id){const d=document.createElement('div');d.innerHTML=html.trim();const e=d.firstChild;if(id)e.id=id;ui.appendChild(e);return e;}
function closePanel(id){const e=$('#'+id);if(e)e.remove();}
/* speech bubble in canvas coordinates (x,y = above the head) */
function speak(x,y,text,ms=3200,cls=''){const b=el(`<div class="speech ${cls}" style="left:${x*3}px;top:${y*3}px">${text}</div>`);b.style.opacity=0;requestAnimationFrame(()=>b.style.opacity=1);
  if(ms)setTimeout(()=>{b.style.opacity=0;setTimeout(()=>b.remove(),400);},ms);return b;}

/* ---------- main loop ---------- */
let mode='title',T=0,lastT=0,onFrame=null;
function frame(n){const dt=Math.min(.05,(n-lastT)/1000||0);lastT=n;T+=dt;try{if(onFrame)onFrame(dt);}catch(e){console.error(e);}requestAnimationFrame(frame);}
