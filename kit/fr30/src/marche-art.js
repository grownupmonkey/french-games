/* ===== Le marché: pixel painters. Light from the top left. Every shape gets three tones (light edge, body, shade edge) and a dark outline. ===== */
const OUTL = '#2a1c10';
function hx(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function rgbHex(a){return '#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function shade(c,f){const a=hx(c),t=f>0?255:0,k=Math.abs(f);return rgbHex(a.map(v=>v+(t-v)*k));}

/* mk(w,h,build): build(A) draws shapes with A.rect / A.ell / A.shape (auto-shaded), A.fill / A.put (flat details). Outline is added at the end. */
function mk(w,h,build){
  const M=new Array(w*h).fill(null);
  const A={w,h,
    put(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<w&&y<h)M[y*w+x]=c;},
    get(x,y){return(x>=0&&y>=0&&x<w&&y<h)?M[y*w+x]:null;},
    fill(x0,y0,x1,y1,c){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)A.put(x,y,c);},
    shape(test,col,mode){
      const pts=[],has=new Set();let x0=1e9,y0=1e9,x1=-1,y1=-1;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(test(x,y)){pts.push([x,y]);has.add(y*w+x);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
      if(!pts.length)return;
      const cx=(x0+x1)/2,cy=(y0+y1)/2,rx=(x1-x0+1)/2,ry=(y1-y0+1)/2,H=(x,y)=>has.has(y*w+x);
      for(const[x,y]of pts){let c=col;
        if(mode==='round'){const nx=(x-cx)/rx,ny=(y-cy)/ry,d=-.6*nx-.8*ny;c=d>.45?shade(col,.3):d<-.25?shade(col,-.28):col;}
        else if(mode!=='none'){if(!H(x,y-1)||!H(x-1,y))c=shade(col,.28);else if(!H(x+1,y)||!H(x,y+1))c=shade(col,-.26);}
        M[y*w+x]=c;}
    },
    rect(x0,y0,x1,y1,c,mode){A.shape((x,y)=>x>=x0&&x<=x1&&y>=y0&&y<=y1,c,mode||'flat');},
    ell(cx,cy,rx,ry,c,mode){A.shape((x,y)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1.02,c,mode||'round');}
  };
  build(A);
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d'),id=g.createImageData(w,h);
  const set=(x,y,c)=>{const a=hx(c),i=(y*w+x)*4;id.data[i]=a[0];id.data[i+1]=a[1];id.data[i+2]=a[2];id.data[i+3]=255;};
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=M[y*w+x];
    if(c)set(x,y,c);else if(A.get(x-1,y)||A.get(x+1,y)||A.get(x,y-1)||A.get(x,y+1))set(x,y,OUTL);}
  g.putImageData(id,0,0);return cv;
}

/* tiny pictograms for labels: 5x5 around (cx,cy) */
function icon(A,k,cx,cy){
  const P=(dx,dy,c)=>A.put(cx+dx,cy+dy,c);
  if(k==='tomato'){A.fill(cx-2,cy-1,cx+2,cy+2,'#d8382f');A.fill(cx-1,cy+3,cx+1,cy+3,'#d8382f');P(-1,-2,'#3a8f4a');P(0,-2,'#3a8f4a');P(1,-2,'#3a8f4a');P(-1,0,'#ff8a7a');}
  else if(k==='leaf'){A.fill(cx-1,cy-2,cx+1,cy+1,'#3a8f4a');P(0,-3,'#3a8f4a');P(-2,0,'#3a8f4a');P(2,0,'#3a8f4a');P(0,2,'#2a6a34');P(0,3,'#6a4a2a');P(-1,-1,'#8ad07a');}
  else if(k==='chicken'){A.fill(cx-2,cy-1,cx+2,cy+2,'#e8a64a');A.fill(cx-1,cy-2,cx+1,cy-2,'#e8a64a');P(2,-2,'#d8382f');P(-3,0,'#e8a64a');P(-1,-1,'#fff3c0');P(1,3,'#8a5a2a');P(-1,3,'#8a5a2a');}
  else if(k==='olive'){A.fill(cx-1,cy-1,cx+1,cy+2,'#5a7a22');P(0,-2,'#5a7a22');P(0,-3,'#7a5a2a');P(-1,-1,'#a9c64a');P(2,-3,'#3a8f4a');P(3,-3,'#3a8f4a');}
  else if(k==='flower'){P(0,0,'#f2c230');P(-1,0,'#fff');P(1,0,'#fff');P(0,-1,'#fff');P(0,1,'#fff');P(0,2,'#3a8f4a');P(0,3,'#3a8f4a');}
  else if(k==='grape'){P(-1,-1,'#7a3a8a');P(1,-1,'#7a3a8a');P(0,0,'#7a3a8a');P(-1,1,'#7a3a8a');P(1,1,'#7a3a8a');P(0,2,'#7a3a8a');P(0,-2,'#3a8f4a');}
  else if(k==='drop'){P(0,-2,'#3a86d4');A.fill(cx-1,cy-1,cx+1,cy,'#3a86d4');A.fill(cx-2,cy+1,cx+2,cy+2,'#3a86d4');P(-1,0,'#a8d4ff');}
  else if(k==='wheat'){for(let i=-2;i<=2;i++){P(i,0,'#d9a441');}P(0,-2,'#d9a441');P(0,-1,'#d9a441');P(0,1,'#d9a441');P(0,2,'#d9a441');}
}

const ART = {
  carton(A,o){const big=!!o.big,x0=big?3:4,x1=big?12:11,y0=big?6:7;
    A.shape((x,y)=>y>=y0-3&&y<y0&&x>=x0+(y0-1-y)&&x<=x1-(y0-1-y),shade(o.body,.04));
    A.rect(x0,y0,x1,18,o.body);
    A.fill(x0+1,y0+4,x1-1,y0+8,o.band);A.fill(x0+1,y0+6,x1-1,y0+6,'#ffffff');
    if(o.icon)icon(A,o.icon,(x0+x1)/2|0,y0+6);
    A.fill(x1-3,y0-3,x1-2,y0-2,o.cap);A.put(x0+1,y0+1,'#ffffff');A.put(x0+1,y0+2,shade(o.body,.35));},
  bottle(A,o){A.rect(7,2,8,5,o.glass);A.rect(6,0,9,1,o.cap);
    A.shape((x,y)=>(y>=8&&y<=18&&x>=4&&x<=11)||(y>=6&&y<8&&x>=5&&x<=10)||(y>=5&&y<6&&x>=6&&x<=9),o.liquid,'round');
    A.fill(4,11,11,16,o.label);A.fill(4,16,11,16,shade(o.label,-.12));
    icon(A,o.icon,7,13);A.put(5,8,'#ffffff');A.put(5,9,shade(o.liquid,.55));},
  can(A,o){const big=!!o.big,x0=big?3:4,x1=big?12:11,y0=big?5:8,m='#c9ced6';
    A.rect(x0,y0,x1,18,m,'round');A.fill(x0+1,y0,x1-1,y0+1,shade(m,.5));
    A.fill(x0,y0+3,x1,17,o.label);A.fill(x0,y0+5,x1,y0+5,o.stripe);A.fill(x0,16,x1,16,shade(o.label,-.2));
    icon(A,o.icon,(x0+x1)/2|0,y0+9);A.put(x0+1,y0+4,shade(o.label,.45));A.put(x0+1,y0+7,shade(o.label,.35));A.fill(x0,18,x1,18,shade(m,-.2));},
  jar(A,o){A.rect(4,5,11,7,o.lid);A.fill(5,5,10,5,shade(o.lid,.35));
    A.shape((x,y)=>y>=8&&y<=18&&x>=3&&x<=12,o.content,'round');
    A.fill(4,11,11,17,o.label);A.fill(4,17,11,17,shade(o.label,-.15));icon(A,o.icon,7,14);A.put(4,9,'#ffffff');A.put(4,10,shade(o.content,.55));A.put(11,9,shade(o.content,-.2));},
  box(A,o){A.rect(3,3,12,18,o.body);A.fill(3,3,12,6,o.head);A.fill(4,3,11,3,shade(o.head,.3));
    A.fill(5,8,10,13,shade(o.body,-.08));if(o.icon)icon(A,o.icon,7,10);A.fill(5,15,10,15,shade(o.body,-.2));A.fill(5,16,8,16,shade(o.body,-.12));},
  pastabox(A,o){const big=!!o.big,x0=big?2:3,x1=big?13:12;
    A.rect(x0,2,x1,18,'#f6edd2');A.fill(x0,2,x1,6,o.head);A.fill(x0+1,2,x1-1,2,shade(o.head,.3));
    A.fill(x0+2,8,x1-2,14,shade(o.c,.1));
    if(o.fusilli){for(let y=8;y<=14;y++)for(let x=x0+2;x<=x1-2;x++)if((x+y)%2===0)A.put(x,y,shade(o.c,-.15));}
    else{for(let x=x0+2;x<=x1-2;x+=2)A.fill(x,8,x,14,shade(o.c,-.18));}
    A.fill(x0,15,x1,15,o.head);A.fill(x0+2,16,x1-4,16,shade(o.head,.1));A.put(x0+1,9,'#fff');},
  bag(A,o){A.rect(2,2,13,3,o.body);for(let x=2;x<=13;x+=2)A.put(x,2,shade(o.body,-.3));
    A.shape((x,y)=>y>=4&&y<=18&&x>=2&&x<=13&&!((y===18)&&(x===2||x===13)),o.body);
    A.fill(4,6,11,12,o.win);
    if(o.grated){for(let y=7;y<=11;y++)for(let x=5;x<=10;x++)if((x*3+y*5)%4<2)A.put(x,y,shade(o.body,-.2));}
    if(o.flour){A.put(6,8,'#e2d6bc');A.put(9,10,'#e2d6bc');A.put(7,11,'#e2d6bc');}
    if(o.rice){for(let y=7;y<=11;y++)for(let x=5;x<=10;x++)if((x+y*2)%3===0)A.put(x,y,'#fff');}
    A.fill(3,14,12,17,o.label);A.fill(3,17,12,17,shade(o.label,-.2));A.fill(5,15,9,15,shade(o.label,.4));},
  netbag(A,o){const big=!!o.big,y0=big?2:4;
    A.shape((x,y)=>y>=y0&&y<=18&&x>=2&&x<=13&&!((y===18)&&(x===2||x===13)),'#ece3c6','round');
    for(let y=y0+1;y<=17;y++)for(let x=3;x<=12;x++)if((x+y)%2===0)A.put(x,y,shade('#ece3c6',-.12));
    const it=o.items,cols={tomato:'#d8382f',cherry:'#e0463a',carrot:'#e8892c',potato:'#b88a52',apple:'#cf3d36'};
    const pos=big?[[5,7],[9,7],[7,10],[4,12],[10,12],[7,15],[11,15],[4,16]]:[[5,9],[10,9],[7,12],[11,14],[5,15]];
    pos.forEach(([x,y],i)=>{
      if(it==='carrot'){A.fill(x-1,y-1,x+1,y+1,cols.carrot);A.put(x,y+2,'#c46a1a');A.put(x-1,y-2,'#3a8f4a');A.put(x+1,y-2,'#3a8f4a');A.put(x-1,y-1,'#ffc06a');}
      else if(it==='cherry'){A.fill(x-1,y-1,x,y,cols.cherry);A.put(x-1,y-1,'#ff9a8a');A.put(x,y-2,'#3a8f4a');}
      else{const c=cols[it];A.fill(x-1,y-1,x+1,y+1,c);A.put(x-1,y-1,shade(c,.45));A.put(x+1,y+1,shade(c,-.25));if(it==='tomato'||it==='apple')A.put(x,y-2,'#3a8f4a');}
    });
    A.fill(3,y0-1<0?0:y0-1,12,y0,o.tie);for(let x=3;x<=12;x+=2)A.put(x,y0-1<0?0:y0-1,shade(o.tie,-.25));},
  onion(A,o){A.shape((x,y)=>((x-8)/5.6)**2+((y-12)/5.8)**2<=1,o.c,'round');A.fill(7,4,8,6,shade(o.c,.2));A.put(8,3,shade(o.c,-.1));
    for(let y=9;y<=17;y++){A.put(5,y,shade(o.c,-.18));A.put(11,y,shade(o.c,-.1));}A.put(6,9,shade(o.c,.5));A.put(6,10,shade(o.c,.4));A.fill(7,18,9,18,'#b8a07a');},
  garlic(A,o){A.shape((x,y)=>((x-8)/5.4)**2+((y-12)/5.6)**2<=1,'#f1ead8','round');A.fill(7,4,8,6,'#e6dcc2');A.put(8,3,'#cdbf9c');
    for(let y=8;y<=17;y++){A.put(6,y,'#d6c9a6');A.put(10,y,'#d6c9a6');}A.put(5,10,'#fff');A.put(5,11,'#fff');A.fill(7,18,9,18,'#9a7a5a');},
  mushrooms(A,o){A.rect(1,15,14,18,'#f4f1e6');A.fill(2,16,13,16,'#e0dccb');A.fill(2,18,13,18,'#c8c3ae');
    [[4,10],[8,8],[12,10]].forEach(([x,y])=>{A.fill(x-1,y+2,x,y+5,'#efe6d2');A.ell(x,y,3.2,2.6,'#b98a5a');A.fill(x-3,y+2,x+3,y+2,'#6a4a30');A.put(x-1,y-1,'#e0bf94');A.put(x-2,y,'#d6ad7c');});},
  lettuce(A,o){A.ell(8,12,6.5,6,'#5aa83e');A.ell(7,11,4.5,4.4,'#7cc656');A.ell(6,9,2.6,2.4,'#a9e37f');A.fill(7,15,9,18,'#d9e8a8');
    for(let y=8;y<=16;y++)A.put(8,y,'#bfe08a');},
  pepper(A,o){A.shape((x,y)=>((x-8)/5)**2+((y-11.5)/6)**2<=1&&!(y<9&&x===8),o.c,'round');A.fill(7,3,8,6,'#3a8f4a');A.put(9,4,'#3a8f4a');A.put(6,8,shade(o.c,.5));A.put(6,9,shade(o.c,.4));
    for(let y=9;y<=17;y++)A.put(8,y,shade(o.c,-.2));},
  lemon(A,o){A.shape((x,y)=>((x-8)/6.4)**2+((y-12)/4.6)**2<=1,'#f4d33a','round');A.put(1,12,'#e6c22a');A.put(14,12,'#e6c22a');A.put(5,10,'#fff3a8');A.put(6,10,'#fff3a8');A.put(11,6,'#3a8f4a');A.put(10,7,'#3a8f4a');},
  baguette(A,o){
    A.shape((x,y)=>{const ax=2,ay=17,bx=13,by=2,vx=bx-ax,vy=by-ay,L=vx*vx+vy*vy,t=Math.max(0,Math.min(1,((x-ax)*vx+(y-ay)*vy)/L)),px=ax+t*vx,py=ay+t*vy;return Math.hypot(x-px,y-py)<=2.3;},'#d9a24f','round');
    [[5,13],[7,10],[9,7],[11,4]].forEach(([x,y])=>{A.put(x,y,'#a8702a');A.put(x+1,y-1,'#a8702a');A.put(x-1,y,'#f1cc82');});},
  sliced(A,o){
    A.shape((x,y)=>(y>=9&&y<=18&&x>=1&&x<=14)||(((x-7.5)/6.6)**2+((y-9.5)/3.6)**2<=1&&y<9),o.c,'round');
    A.fill(3,6,12,7,shade(o.c,-.28));A.fill(2,8,13,8,shade(o.c,-.22));A.fill(4,6,6,6,shade(o.c,-.1));
    for(let x=4;x<=12;x+=2)A.fill(x,10,x,17,shade(o.c,-.18));
    A.fill(1,9,2,18,shade(o.c,.15));A.rect(14,10,15,15,o.tie);A.put(14,11,shade(o.tie,.5));
    A.fill(2,16,13,17,o.tie);A.fill(3,16,8,16,shade(o.tie,.45));A.put(2,10,'#ffffff');A.put(2,11,'#ffffff');},
  round(A,o){A.ell(8,13,7,5.2,'#c98a3d');A.ell(8,12,5,3.2,'#dba04c','none');
    [[5,11],[8,10],[11,11]].forEach(([x,y])=>{A.put(x,y,'#8f5a1e');A.put(x+1,y+1,'#8f5a1e');});for(let i=0;i<7;i++)A.put(3+((i*5)%10),9+(i%3),'#f6e7c4');},
  croissants(A,o){const cr=(cx,cy)=>{A.ell(cx,cy,4.4,2.6,'#d99a3e');A.ell(cx-3,cy+1.4,1.8,1.7,'#c8832e');A.ell(cx+3,cy+1.4,1.8,1.7,'#c8832e');A.put(cx-1,cy-1,'#f4c46a');A.put(cx,cy-1,'#f4c46a');
      A.put(cx-1,cy,'#a8641e');A.put(cx+1,cy,'#a8641e');};
    A.rect(1,13,14,18,'#f6edd2');A.fill(1,13,14,13,'#e0523a');A.fill(2,15,13,17,'#fff3d6');cr(5,10);cr(11,10);cr(8,8);},
  brioche(A,o){A.ell(8,14,6.5,4.4,'#e0a24a');A.ell(8,9,4.2,3.1,'#e8b45c');A.put(7,8,'#fbe0a0');A.put(8,8,'#fbe0a0');A.put(5,13,'#fbe0a0');A.put(6,13,'#fbe0a0');A.put(11,15,'#a8641e');A.put(4,15,'#b0701e');},
  pita(A,o){A.ell(8,11,6.4,5.4,'#e8cb8e');A.ell(8,10,5,3.8,'#f1dba6','none');A.ell(8,15,5.5,2.4,'#dcba76');A.put(6,9,'#c9a25a');A.put(10,10,'#c9a25a');A.put(8,12,'#c9a25a');},
  eggs(A,o){const n=o.n,x0=n===12?1:3,x1=n===12?14:12,F={'1':'010110010010111','2':'110001010100111','6':'011100110101010'};
    const bumps=n===12?[3,6,9,12]:[5,8,11].map(x=>x-1);
    bumps.forEach(x=>{A.ell(x+.5,10,1.6,1.8,'#fbf7ee','round');A.put(x,9,'#ffffff');});
    A.rect(x0,11,x1,18,'#d9c9a0');A.fill(x0+1,11,x1-1,11,'#efe3c0');A.fill(x0+1,17,x1-1,17,'#b8a878');
    const txt=String(n),tw=txt.length*4-1,sx=Math.round((x0+x1)/2-tw/2+.5);
    txt.split('').forEach((ch,k)=>{for(let r=0;r<5;r++)for(let c=0;c<3;c++)if(F[ch][r*3+c]==='1')A.put(sx+k*4+c,12+r,'#5a3a1a');});},
  cheeseblock(A,o){A.rect(2,9,13,18,o.c);A.fill(2,9,13,10,shade(o.c,.25));A.fill(11,9,13,18,o.w);A.fill(11,9,13,9,shade(o.w,.3));A.put(5,13,shade(o.c,-.28));A.put(8,15,shade(o.c,-.28));A.put(4,16,shade(o.c,-.2));A.put(7,11,shade(o.c,-.2));},
  slices(A,o){A.rect(2,6,13,18,'#f6f4ee');A.fill(3,8,12,16,o.c);for(let y=9;y<=15;y+=2)A.fill(3,y,12,y,shade(o.c,-.18));A.fill(3,8,12,8,shade(o.c,.35));A.fill(2,17,13,17,'#d8d4c8');A.put(3,7,'#fff');},
  butter(A,o){A.rect(2,10,13,18,'#f6ecc4');A.fill(2,10,13,11,'#f8e08a');A.fill(2,14,13,17,'#2a7fba');A.fill(3,15,8,15,'#ffffff');A.put(4,12,'#fff6c8');A.put(11,16,'#f2c230');},
  tub(A,o){A.shape((x,y)=>y>=7&&y<=18&&x>=(3+(y-7)*0.0)&&x<=12,o.c,'flat');A.fill(3,5,12,7,'#e6e6e6');A.fill(4,5,11,5,'#fff');A.fill(3,10,12,15,o.band);A.fill(3,12,12,12,'#fff');A.put(5,8,'#fff');}
};

/* sprite cache: SPR(id) -> canvas 16x20 */
const _spr={};
function SPR(id){if(!_spr[id]){const p=PRODUCTS[id];_spr[id]=mk(16,20,A=>ART[p.art[0]](A,p.art[1]));}return _spr[id];}

/* ---- dinner props ---- */
function candleSprite(){return mk(7,13,A=>{A.rect(2,5,4,11,'#f3ead2');A.fill(2,5,4,5,'#fffaf0');A.fill(4,6,4,11,'#d8cba6');A.fill(1,12,5,12,'#b8913c');A.rect(1,11,5,12,'#c8a24a');A.put(3,4,'#3a2a1a');});}
function plateSprite(dish){return mk(18,10,A=>{
  A.shape((x,y)=>((x-9)/8.2)**2+((y-5)/3.9)**2<=1,'#f6f2e8','round');
  A.shape((x,y)=>((x-9)/5.8)**2+((y-5)/2.6)**2<=1,'#ece6d6','none');
  if(dish==='pasta'){A.shape((x,y)=>((x-9)/4.6)**2+((y-4.4)/2.2)**2<=1,'#f1c95a','round');[[7,3],[9,2],[11,3],[8,5],[10,5]].forEach(([x,y])=>A.put(x,y,'#fbe08a'));A.fill(8,4,10,4,'#c9382b');A.put(9,3,'#c9382b');A.put(7,4,'#3a8f4a');}
  else if(dish==='soup'){A.shape((x,y)=>((x-9)/5)**2+((y-4.6)/2.4)**2<=1,'#e89a3a','round');A.put(7,4,'#fff3d0');A.put(10,3,'#3a8f4a');A.put(9,5,'#f6d890');A.put(11,5,'#e0693a');A.put(8,3,'#f6d890');}
  else{A.shape((x,y)=>((x-9)/4.8)**2+((y-4.6)/2.3)**2<=1&&x>5,'#f2cd48','round');A.fill(7,4,11,4,'#e8a82a');A.put(12,3,'#3a8f4a');A.put(13,4,'#3a8f4a');A.put(5,5,'#9ad06a');A.put(5,4,'#d8382f');}
});}
function glassSprite(){return mk(6,9,A=>{A.rect(1,2,4,7,'#cfe8f2');A.fill(2,3,3,3,'#ffffff');A.fill(1,5,4,7,'#9a1f3a');A.put(2,5,'#d8506a');});}
function breadBasket(){return mk(16,10,A=>{A.rect(1,5,14,8,'#a8742f');A.fill(2,6,13,6,'#c08a3e');A.ell(5,4,3,2,'#d9a24f');A.ell(10,4,3.2,2.2,'#c98a3d');A.put(4,3,'#f1cc82');A.put(9,3,'#f1cc82');});}
function steamPuff(){return mk(5,5,A=>{A.ell(2,2,1.6,1.6,'#ffffff','none');});}
