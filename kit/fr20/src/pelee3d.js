/* ===== Montagne Pelée in 3D: low-poly island terrain, sea, trail, hikers, clouds, rain, helicopter, follow camera.
   PELEE3D.mount(el, opts) → api (see the end of mount). PELEE2D.mount(el, opts) is the flat fallback with the same api.
   Light from the top left of the default view; flat-shaded with vertex colours (polished low-poly look). ===== */
const PELEE3D=(()=>{
 const T=THREE;
 const SIZE=260, SEG=200, HMAX=34;           // world units; HMAX ≈ 1397 m at the summit
 const SUMMIT={x:4,z:-6};
 function hash(x,z){ const s=Math.sin(x*127.1+z*311.7)*43758.5453; return s-Math.floor(s); }
 function noise(x,z){ const xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi, u=xf*xf*(3-2*xf), v=zf*zf*(3-2*zf);
  const a=hash(xi,zi), b=hash(xi+1,zi), c=hash(xi,zi+1), d=hash(xi+1,zi+1); return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v; }
 function fbm(x,z){ let s=0,a=.5,f=1; for(let i=0;i<4;i++){ s+=a*noise(x*f,z*f); a*=.5; f*=2.03; } return s; }
 /* height in world units; sea level 0. The island is the north of Martinique: sea to the west (Saint-Pierre), north and east. */
 function height(x,z){
  const dx=x-SUMMIT.x, dz=z-SUMMIT.z, r=Math.hypot(dx,dz), ang=Math.atan2(dz,dx);
  const cone=HMAX*Math.exp(-Math.pow(r/58,1.45));                    // volcano
  const dome=4.5*Math.exp(-Math.pow(r/6,2));                            // lava dome (« le Chinois »)
  const ridges=(1+.35*Math.sin(ang*7+1.3)+.2*Math.sin(ang*13))*(r>8?1:r/8); // radial ridges and ravines
  const land=Math.max(0,1-Math.pow(Math.max(0,Math.hypot(x*.92+6,z*1.05+18)-74)/22,2)); // island footprint, land continues south
  const south=z>30?Math.min(1,(z-30)/40)*9*fbm(x*.05,z*.05):0;
  let h=(cone*(.82+.18*ridges)+dome)+south+fbm(x*.07+3,z*.07)*3.2-1.6;
  h=h*land-(1-land)*6-2.2*(1-land);
  return h; }
 const C=(h)=>new T.Color(h);
 const PAL={sand:C('#E8D29A'),forestLo:C('#2F6B3A'),forest:C('#3E7D3F'),forestHi:C('#5E8F3E'),savanna:C('#93A453'),moss:C('#A9A867'),rock:C('#7C6F63'),rockHi:C('#9A8C7C'),wet:C('#4B5A3E')};
 function colourAt(h,slope,n){
  let c;
  if(h<1.2) c=PAL.sand.clone();
  else if(h<11) c=PAL.forestLo.clone().lerp(PAL.forest,h/11);
  else if(h<20) c=PAL.forest.clone().lerp(PAL.forestHi,(h-11)/9);
  else if(h<28) c=PAL.forestHi.clone().lerp(PAL.savanna,(h-20)/8);
  else c=PAL.savanna.clone().lerp(PAL.moss,Math.min(1,(h-28)/6));
  if(slope>.5&&h>3) c.lerp(h>24?PAL.rockHi:PAL.rock,Math.min(1,(slope-.5)*2.4));
  if(h>33) c.lerp(PAL.rock,.5);
  c.offsetHSL(0,0,(n-.5)*.06); return c; }
 function terrain(){
  const g=new T.PlaneGeometry(SIZE,SIZE,SEG,SEG); g.rotateX(-Math.PI/2);
  const p=g.attributes.position; for(let i=0;i<p.count;i++) p.setY(i,height(p.getX(i),p.getZ(i)));
  const geo=g.toNonIndexed(); const q=geo.attributes.position, cols=new Float32Array(q.count*3), a=new T.Vector3(), b=new T.Vector3(), c=new T.Vector3(), n=new T.Vector3();
  for(let i=0;i<q.count;i+=3){ a.fromBufferAttribute(q,i); b.fromBufferAttribute(q,i+1); c.fromBufferAttribute(q,i+2);
   n.subVectors(c,b).cross(new T.Vector3().subVectors(a,b)).normalize(); const h=(a.y+b.y+c.y)/3, slope=1-Math.abs(n.y);
   const col=colourAt(h,slope,hash(a.x*.3,a.z*.3)); for(let k=0;k<3;k++){ cols[(i+k)*3]=col.r; cols[(i+k)*3+1]=col.g; cols[(i+k)*3+2]=col.b; } }
  geo.setAttribute('color',new T.BufferAttribute(cols,3)); geo.computeVertexNormals();
  const m=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,flatShading:true,roughness:.95,metalness:0}));
  m.receiveShadow=true; m.castShadow=true; return m; }
 function sea(){
  const g=new T.PlaneGeometry(SIZE*4,SIZE*4,1,1); g.rotateX(-Math.PI/2);
  const mat=new T.ShaderMaterial({ transparent:true, uniforms:{uTime:{value:0},uFog:{value:new T.Color('#9FD3E8')},uNear:{value:120},uFar:{value:420}},
   vertexShader:`varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
   fragmentShader:`uniform float uTime; uniform vec3 uFog; uniform float uNear, uFar; varying vec3 vW;
    void main(){ float d=length(vW.xz-vec2(-6.,-18.)); float shore=smoothstep(64.,98.,d);
     vec3 lagoon=vec3(.27,.78,.78), deep=vec3(.05,.28,.52); vec3 col=mix(lagoon,deep,shore);
     float w=sin(vW.x*.35+uTime*.9)*sin(vW.z*.31-uTime*.7); col+=w*.025;
     float f=smoothstep(uNear,uFar,distance(cameraPosition,vW)); gl_FragColor=vec4(mix(col,uFog,f),1.); }`});
  const m=new T.Mesh(g,mat); m.position.y=.05; m.userData.mat=mat; return m; }
 /* low-poly hiker: legs, body, backpack, head, cap */
 function hiker(shirt,pack,skin,hat){
  const g=new T.Group(), M=(c)=>new T.MeshStandardMaterial({color:c,flatShading:true,roughness:.8});
  const legL=new T.Mesh(new T.CylinderGeometry(.13,.11,.8,6),M('#3B3F4A')); legL.position.set(-.16,.4,0);
  const legR=legL.clone(); legR.position.x=.16;
  const body=new T.Mesh(new T.CapsuleGeometry(.32,.5,3,8),M(shirt)); body.position.y=1.15;
  const bag=new T.Mesh(new T.BoxGeometry(.5,.6,.3),M(pack)); bag.position.set(0,1.2,-.32);
  const head=new T.Mesh(new T.IcosahedronGeometry(.26,1),M(skin)); head.position.y=1.82;
  const cap=new T.Mesh(new T.CylinderGeometry(.27,.29,.14,8),M(hat)); cap.position.y=2.0;
  const brim=new T.Mesh(new T.CylinderGeometry(.3,.3,.03,8,1,false,0,Math.PI),M(hat)); brim.position.set(0,1.95,.12); brim.rotation.y=-Math.PI/2;
  [legL,legR,body,bag,head,cap,brim].forEach(o=>{ o.castShadow=true; g.add(o); });
  g.userData.legs=[legL,legR]; g.userData.up=[body,bag,head,cap,brim]; g.scale.setScalar(1.5); return g; }
 function signpost(){ const g=new T.Group(), wood=new T.MeshStandardMaterial({color:'#8A5A32',flatShading:true});
  const pole=new T.Mesh(new T.CylinderGeometry(.14,.17,3.6,6),wood); pole.position.y=1.8;
  const board=new T.Mesh(new T.BoxGeometry(2.4,.7,.14),new T.MeshStandardMaterial({color:'#E9D9B0',flatShading:true})); board.position.set(.6,3.1,0); const tip=new T.Mesh(new T.ConeGeometry(.35,.5,3),new T.MeshStandardMaterial({color:'#E9D9B0',flatShading:true})); tip.rotation.z=-Math.PI/2; tip.position.set(2.0,3.1,0); tip.scale.z=.4; g.add(tip); tip.castShadow=true;
  [pole,board].forEach(o=>{o.castShadow=true; g.add(o);}); return g; }
 function tree(s){ const g=new T.Group(); const trunk=new T.Mesh(new T.CylinderGeometry(.12*s,.18*s,1.4*s,5),new T.MeshStandardMaterial({color:'#7A5636',flatShading:true})); trunk.position.y=.7*s;
  const cm=new T.MeshStandardMaterial({color:['#2E6A34','#3B7A3A','#285E30','#4A8A3C'][Math.floor(Math.random()*4)],flatShading:true});
  const crown=new T.Mesh(new T.IcosahedronGeometry(1*s,1),cm); crown.position.y=1.8*s; crown.scale.y=.75; const c2=new T.Mesh(new T.IcosahedronGeometry(.7*s,1),cm); c2.position.set(.55*s,1.5*s,.2*s);
  [trunk,crown,c2].forEach(o=>{o.castShadow=true; g.add(o);}); return g; }
 function fern(s){ const g=new T.Group(); const trunk=new T.Mesh(new T.CylinderGeometry(.08*s,.1*s,2.4*s,5),new T.MeshStandardMaterial({color:'#4A3A28',flatShading:true})); trunk.position.y=1.2*s; g.add(trunk);
  const leaf=new T.MeshStandardMaterial({color:['#5C9A3E','#6FA846','#4E8B38'][Math.floor(Math.random()*3)],flatShading:true,side:T.DoubleSide});
  for(let i=0;i<8;i++){ const f=new T.Mesh(new T.ConeGeometry(.32*s,1.9*s,4,1),leaf); f.scale.z=.25; const piv=new T.Group(); piv.position.y=2.4*s; piv.rotation.y=i*Math.PI/4; f.rotation.x=1.25; f.position.set(0,.15*s,.85*s); f.castShadow=true; piv.add(f); g.add(piv); }
  trunk.castShadow=true; return g; }
 function cloud(){ const g=new T.Group(), mat=new T.MeshStandardMaterial({color:'#FFFFFF',flatShading:true,roughness:1,transparent:true,opacity:.92});
  const n=5+Math.floor(Math.random()*4); for(let i=0;i<n;i++){ const m=new T.Mesh(new T.IcosahedronGeometry(2+Math.random()*2.6,1),mat); m.position.set((i-n/2)*2.4+Math.random(),Math.random()*1.4,Math.random()*2.4-1.2); m.scale.y=.62; m.castShadow=false; g.add(m); }
  g.userData.mat=mat; return g; }

 /* the trail: from the Aileron car park (east-southeast flank) up to the summit dome */
 const TRAIL_XZ=[[44,30],[38,24],[33,17],[27,13],[24,6],[19,2],[15,-1],[11,-3],[7,-5],[4,-6]];
 const ALT0=824, ALT1=1397;
 function heli(){ const g=new T.Group(), M=(c,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,flatShading:true,roughness:.5,metalness:.1},o));
  const body=new T.Mesh(new T.CapsuleGeometry(1.1,2.6,4,10),M('#D7262E')); body.rotation.z=Math.PI/2; g.add(body);
  const belly=new T.Mesh(new T.CapsuleGeometry(1.0,2.2,4,10),M('#F2C230')); belly.rotation.z=Math.PI/2; belly.position.y=-.35; belly.scale.set(1,1,.95); g.add(belly);
  const glass=new T.Mesh(new T.SphereGeometry(.95,10,8,0,Math.PI*2,0,Math.PI/2),M('#9FD3E8',{roughness:.1,metalness:.3})); glass.rotation.z=-Math.PI/2; glass.position.x=1.9; glass.position.y=.25; g.add(glass);
  const tail=new T.Mesh(new T.CylinderGeometry(.18,.42,4.4,6),M('#D7262E')); tail.rotation.z=Math.PI/2; tail.position.set(-3.6,.35,0); g.add(tail);
  const fin=new T.Mesh(new T.BoxGeometry(.9,1.3,.12),M('#F2C230')); fin.position.set(-5.6,.9,0); g.add(fin);
  const skidM=M('#2B2D42'); for(const z of [-.9,.9]){ const sk=new T.Mesh(new T.CylinderGeometry(.07,.07,3.6,6),skidM); sk.rotation.z=Math.PI/2; sk.position.set(.2,-1.5,z); g.add(sk); for(const x of [-.8,1.1]){ const st=new T.Mesh(new T.CylinderGeometry(.06,.06,.6,5),skidM); st.position.set(x,-1.2,z*.9); g.add(st);} }
  const rotor=new T.Group(); for(let i=0;i<4;i++){ const b=new T.Mesh(new T.BoxGeometry(6.4,.06,.32),M('#2B2D42')); b.rotation.y=i*Math.PI/4*2; rotor.add(b); } rotor.position.y=1.35; g.add(rotor);
  const trot=new T.Group(); for(let i=0;i<2;i++){ const b=new T.Mesh(new T.BoxGeometry(1.4,.05,.16),M('#2B2D42')); b.rotation.z=i*Math.PI/2; trot.add(b);} trot.position.set(-5.6,.9,.2); trot.rotation.x=Math.PI/2; g.add(trot);
  const cable=new T.Mesh(new T.CylinderGeometry(.03,.03,1,4),M('#E8E8E8')); cable.position.set(.4,-1.3,0); cable.visible=false; g.add(cable);
  const litter=new T.Group(); const lb=new T.Mesh(new T.BoxGeometry(2.2,.18,.8),M('#F07A2A')); litter.add(lb); litter.visible=false; g.add(litter);
  const rescuer=hiker('#D7262E','#2B2D42','#C38862','#F4F4F4'); rescuer.scale.setScalar(.75); rescuer.visible=false; g.add(rescuer);
  g.traverse(o=>{ if(o.isMesh) o.castShadow=true; }); g.userData={rotor,trot,cable,litter,rescuer}; g.scale.setScalar(1.15); return g; }
 function snake(){ const pts=[]; for(let i=0;i<14;i++) pts.push(new T.Vector3(i*.22,0,Math.sin(i*.9)*.25));
  const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),40,.09,6,false),new T.MeshStandardMaterial({color:'#7A6A3A',flatShading:true,roughness:.7}));
  const head=new T.Mesh(new T.ConeGeometry(.16,.36,4),new T.MeshStandardMaterial({color:'#6A5A2E',flatShading:true})); head.rotation.z=-Math.PI/2; head.position.set(3.1,0,Math.sin(13*.9)*.25); const g=new T.Group(); g.add(m); g.add(head); g.traverse(o=>{if(o.isMesh)o.castShadow=true;}); return g; }
 function mount(el,opts={}){
  const W=()=>el.clientWidth||1280, H=()=>el.clientHeight||800;
  const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); renderer.setSize(W(),H()); renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05; renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
  el.appendChild(renderer.domElement); renderer.domElement.style.display='block'; renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new T.Scene(), SKY=new T.Color('#9FD3E8'), GREY=new T.Color('#B9C2C6'); scene.background=SKY.clone(); scene.fog=new T.Fog(SKY.clone(),120,420);
  const cam=new T.PerspectiveCamera(42,W()/H(),.5,1200);
  scene.add(new T.HemisphereLight('#DDF2FF','#4A5A3A',.85));
  const sun=new T.DirectionalLight('#FFF1D6',2.4); sun.position.set(-70,130,110); sun.castShadow=true;
  Object.assign(sun.shadow.camera,{left:-90,right:90,top:90,bottom:-90,near:10,far:400}); sun.shadow.mapSize.set(2048,2048); sun.shadow.bias=-.0008; sun.shadow.normalBias=.4; scene.add(sun);
  const ground=terrain(); scene.add(ground); const water=sea(); scene.add(water);
  /* vegetation (instanced: a few draw calls for the whole forest): rainforest low, tree ferns higher, bare mossy summit */
  { const trees=[], ferns=[];
   for(let i=0;i<1700;i++){ const x=(hash(i,1)-.5)*200, z=(hash(i,2)-.5)*200, h=height(x,z); if(h<1.8||h>25) continue;
    if(TRAIL_XZ.some(([tx,tz])=>Math.hypot(tx-x,tz-z)<3.2)) continue; if(h>22&&hash(i,6)>.35) continue;
    (h>13?ferns:trees).push({x,y:h-.2,z,s:h>13?.55+hash(i,3)*.35:.75+hash(i,3)*.7,r:hash(i,4)*6.28,c:hash(i,5)}); }
   const M=new T.Matrix4(), Q=new T.Quaternion(), E=new T.Euler(), V=new T.Vector3(), S=new T.Vector3();
   const inst=(geo,mat,list,place,colours)=>{ const m=new T.InstancedMesh(geo,mat,list.length); m.castShadow=true; m.receiveShadow=true;
    list.forEach((it,i)=>{ place(it,M); m.setMatrixAt(i,M); if(colours) m.setColorAt(i,new T.Color(colours[Math.floor(it.c*colours.length)])); }); m.instanceMatrix.needsUpdate=true; if(m.instanceColor) m.instanceColor.needsUpdate=true; scene.add(m); return m; };
   const mat=(c)=>new T.MeshStandardMaterial({color:c,flatShading:true,roughness:.9});
   const greens=['#2E6A34','#3B7A3A','#285E30','#4A8A3C','#356F33'];
   const at=(it,ox,oy,oz,sx,sy,sz,rx=0)=>{ V.set(ox,oy,oz).multiplyScalar(it.s).applyAxisAngle(new T.Vector3(0,1,0),it.r).add(new T.Vector3(it.x,it.y,it.z)); Q.setFromEuler(E.set(rx,it.r,0)); S.set(sx*it.s,sy*it.s,sz*it.s); return M.compose(V,Q,S); };
   inst(new T.CylinderGeometry(.12,.18,1.4,5),mat('#7A5636'),trees,(it,m)=>at(it,0,.7,0,1,1,1));
   inst(new T.IcosahedronGeometry(1,1),mat('#ffffff'),trees,(it,m)=>at(it,0,1.8,0,1,.75,1),greens);
   inst(new T.IcosahedronGeometry(.7,1),mat('#ffffff'),trees,(it,m)=>at(it,.55,1.5,.2,1,.8,1),greens);
   inst(new T.CylinderGeometry(.08,.1,2.4,5),mat('#4A3A28'),ferns,(it,m)=>at(it,0,1.2,0,1,1,1));
   const fronds=[]; ferns.forEach(f=>{ for(let k=0;k<8;k++) fronds.push(Object.assign({},f,{r:f.r+k*Math.PI/4})); });
   const fg=new T.ConeGeometry(.32,1.9,4,1); fg.rotateX(1.25); fg.translate(0,.15,.85); fg.scale(1,1,1);
   const fm=new T.MeshStandardMaterial({color:'#ffffff',flatShading:true,side:T.DoubleSide});
   inst(fg,fm,fronds,(it,m)=>at(it,0,2.4,0,1,1,1),['#5C9A3E','#6FA846','#4E8B38']); }
  /* trail ribbon */
  const pts=TRAIL_XZ.map(([x,z])=>new T.Vector3(x,height(x,z)+.25,z)); const curve=new T.CatmullRomCurve3(pts,false,'centripetal');
  const sp=curve.getSpacedPoints(160).map(v=>{ v.y=height(v.x,v.z)+.22; return v; });
  { const pos=[], idx=[]; for(let i=0;i<sp.length;i++){ const a=sp[Math.max(0,i-1)], b=sp[Math.min(sp.length-1,i+1)]; const d=new T.Vector3().subVectors(b,a).setY(0).normalize(); const nx=-d.z*.7, nz=d.x*.7;
    for(const k of [-1,1]){ const x=sp[i].x+nx*k, z=sp[i].z+nz*k; pos.push(x,height(x,z)+.12,z); } if(i) idx.push((i-1)*2,(i-1)*2+1,i*2, (i-1)*2+1,i*2+1,i*2); }
   const rg=new T.BufferGeometry(); rg.setAttribute('position',new T.Float32BufferAttribute(pos,3)); rg.setIndex(idx); rg.computeVertexNormals();
   const rib=new T.Mesh(rg,new T.MeshStandardMaterial({color:'#E3C98F',roughness:1,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2})); rib.receiveShadow=true; scene.add(rib); }
  const at=u=>{ const p=curve.getPointAt(Math.max(0,Math.min(1,u))); p.y=height(p.x,p.z); return p; };
  const hSum=height(SUMMIT.x,SUMMIT.z), h0=at(0).y;
  /* signposts (clickable) */
  const label=txt=>{ const c=document.createElement('canvas'); c.width=512; c.height=160; const x=c.getContext('2d'); x.fillStyle='#E9D9B0'; x.fillRect(0,0,512,160); x.strokeStyle='#8A5A32'; x.lineWidth=10; x.strokeRect(5,5,502,150);
   x.fillStyle='#2B2D42'; x.textAlign='center'; x.font='700 58px Georgia,serif'; x.fillText(txt[0],256,72); x.font='600 44px Arial,sans-serif'; x.fillText(txt[1]||'',256,132); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; t.anisotropy=4; return t; };
  const signs=(opts.signs||[]).map(sg=>{ const o=signpost(); if(sg.txt){ const pl=new T.Mesh(new T.PlaneGeometry(2.3,.66),new T.MeshBasicMaterial({map:label(sg.txt)})); pl.position.set(.6,3.1,.075); o.add(pl); const pl2=pl.clone(); pl2.rotation.y=Math.PI; pl2.position.z=-.075; o.add(pl2); } const p=at(sg.u); const q=at(Math.min(1,sg.u+.01)); const side=new T.Vector3(q.z-p.z,0,p.x-q.x).normalize().multiplyScalar(1.8);
   o.position.set(p.x+side.x,height(p.x+side.x,p.z+side.z)-.2,p.z+side.z); o.lookAt(q.x,o.position.y,q.z); o.rotateY(Math.PI/2); o.userData.key=sg.key; scene.add(o);
   const glow=new T.Mesh(new T.RingGeometry(1.2,1.7,24),new T.MeshBasicMaterial({color:'#F2C46D',transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false})); glow.rotation.x=-Math.PI/2; glow.position.copy(o.position).add(new T.Vector3(0,.25,0)); scene.add(glow); o.userData.glow=glow; return o; });
  /* hikers: the traveller first, then Joëlle, Kévin, M. Lefèvre */
  const looks=opts.group||[['#C8102E','#2B2D42','#8D5524','#F2C46D'],['#2A9D8F','#E9A93A','#5A3A22','#E9E4D6'],['#5B5F80','#7FD6C8','#C68642','#2B2D42'],['#8C4A3A','#77804F','#F0C9A8','#E9E4D6']];
  const group=looks.map(l=>{ const h=hiker(...l); scene.add(h); return h; });
  const ring=new T.Mesh(new T.RingGeometry(1.1,1.45,28),new T.MeshBasicMaterial({color:'#F2C46D',transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false})); ring.rotation.x=-Math.PI/2; scene.add(ring);
  const lamp=new T.PointLight('#FFF4C8',0,30,1.6); scene.add(lamp); const lampBulb=new T.Mesh(new T.SphereGeometry(.12,8,6),new T.MeshBasicMaterial({color:'#FFF4C8'})); lampBulb.visible=false; scene.add(lampBulb);
  const pose={}; let dir=1;
  let along=opts.start||0;
  function placeGroup(t,phase){ group.forEach((h,i)=>{ if(h.userData.gone) return; const u=Math.max(0,Math.min(1,t-dir*i*.022)); const p=at(u), q=at(u+dir*.006);
    if(pose[i]==='sit'){ const s=at(u); h.position.set(s.x+1.4,height(s.x+1.4,s.z)-.35,s.z); h.userData.up.forEach(o=>o.rotation.x=-.25); h.userData.legs.forEach(l=>{ l.rotation.x=-1.4; l.position.z=.35; }); return; }
    h.position.copy(p); if(Math.hypot(q.x-p.x,q.z-p.z)>.01) h.lookAt(q.x,p.y,q.z);
    const sw=Math.sin(phase*9+i)*.5*(phase?1:0); h.userData.legs[0].rotation.x=sw; h.userData.legs[1].rotation.x=-sw; });
   ring.position.copy(group[0].position); ring.position.y+=.15; lamp.position.copy(group[0].position).add(new T.Vector3(0,3.4,0)); lampBulb.position.copy(group[0].position).add(new T.Vector3(0,3.0,.3)); }
  placeGroup(along,0);
  /* clouds; rain */
  const clouds=[]; for(let i=0;i<16;i++){ const c=cloud(); const a=i/16*6.28, r=26+hash(i,9)*40; c.position.set(SUMMIT.x+Math.cos(a)*r,34+hash(i,8)*14,SUMMIT.z+Math.sin(a)*r); c.userData.a=a; c.userData.r=r; c.userData.y=c.position.y; scene.add(c); clouds.push(c); }
  const RN=1400, rpos=new Float32Array(RN*6); const rainGeo=new T.BufferGeometry(); rainGeo.setAttribute('position',new T.BufferAttribute(rpos,3));
  const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#DDE6EE',transparent:true,opacity:.55})); rain.visible=false; rain.frustumCulled=false; scene.add(rain);
  const rseed=[]; for(let i=0;i<RN;i++) rseed.push([(hash(i,21)-.5)*60,hash(i,22)*30,(hash(i,23)-.5)*60]);
  let weather=opts.weather||0, raining=false;
  /* helicopter and snake */
  const hc=heli(); hc.visible=false; scene.add(hc); let heliAnim=null;
  const sn=snake(); sn.visible=false; scene.add(sn); let snakeAnim=null;
  /* camera: follows the traveller; drag to orbit, wheel to zoom */
  let yaw=.72, pitch=.5, dist=62, tgt=new T.Vector3(), camGoal=new T.Vector3(), camOverride=null;
  let drag=null, dragMoved=false;
  el.addEventListener('pointerdown',e=>{ drag={x:e.clientX,y:e.clientY,yaw,pitch}; dragMoved=false; });
  el.addEventListener('pointermove',e=>{ if(!drag) return; if(Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>5) dragMoved=true; yaw=drag.yaw-(e.clientX-drag.x)*.006; pitch=Math.max(.22,Math.min(1.25,drag.pitch+(e.clientY-drag.y)*.005)); });
  el.addEventListener('pointerup',e=>{ const wasDrag=dragMoved; drag=null; if(!wasDrag) clickAt(e); });
  el.addEventListener('wheel',e=>{ e.preventDefault(); dist=Math.max(22,Math.min(120,dist*(e.deltaY>0?1.08:.93))); },{passive:false});
  const ray=new T.Raycaster(), mouse=new T.Vector2(); let pickRes=null, pickKeys=null;
  function clickAt(e){ if(!pickRes) return; const r=renderer.domElement.getBoundingClientRect(); mouse.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1); ray.setFromCamera(mouse,cam);
   const hits=ray.intersectObjects(signs,true); if(!hits.length) return; let o=hits[0].object; while(o&&!o.userData.key) o=o.parent; if(o&&pickKeys.includes(o.userData.key)){ const r2=pickRes; pickRes=null; signs.forEach(s=>s.userData.glow.material.opacity=0); r2(o.userData.key); } }
  let walking=null, clock=new T.Clock(), running=true, phase=0;
  function frame(){ if(!running) return; const dt=Math.min(.05,clock.getDelta()), t=clock.elapsedTime;
   if(walking){ walking.t+=dt/walking.dur; const e=walking.t<1?(1-Math.cos(walking.t*Math.PI))/2:1; along=walking.from+(walking.to-walking.from)*e; phase+=dt; placeGroup(along,phase);
    if(walking.t>=1){ const r=walking.res; walking=null; placeGroup(along,0); r(); } }
   const lead=group[0].position;
   if(camOverride){ tgt.lerp(camOverride.tgt,.04); camGoal.copy(camOverride.pos(t)); }
   else { const look=new T.Vector3(lead.x+(SUMMIT.x-lead.x)*.3*dir,lead.y+3,lead.z+(SUMMIT.z-lead.z)*.3*dir); tgt.lerp(look,.06);
    const dd=dist*(1-weather*.45); camGoal.set(tgt.x+Math.cos(yaw)*Math.cos(pitch)*dd, tgt.y+Math.sin(pitch)*dd, tgt.z+Math.sin(yaw)*Math.cos(pitch)*dd); }
   cam.position.lerp(camGoal,.08); cam.lookAt(tgt);
   clouds.forEach(c=>{ c.userData.a+=dt*.01*(1+weather); const r=c.userData.r*(1-weather*.45); c.position.x=SUMMIT.x+Math.cos(c.userData.a)*r; c.position.z=SUMMIT.z+Math.sin(c.userData.a)*r;
    c.position.y+=((c.userData.y-weather*12)-c.position.y)*.02; c.userData.mat.color.setRGB(1-weather*.25,1-weather*.24,1-weather*.2); c.userData.mat.opacity=Math.max(.12,.92-weather*.85); c.visible=c.position.distanceTo(cam.position)>26&&c.userData.mat.opacity>.13; });
   const fc=SKY.clone().lerp(GREY,weather); scene.background.copy(fc); scene.fog.color.copy(fc); scene.fog.near=120-weather*110; scene.fog.far=420-weather*362;
   sun.intensity=2.4-weather*1.7; const U=water.userData.mat.uniforms; U.uTime.value=t; U.uFog.value.copy(fc); U.uNear.value=scene.fog.near; U.uFar.value=scene.fog.far;
   if(raining){ for(let i=0;i<RN;i++){ const s=rseed[i]; let y=(s[1]-t*22)%30; if(y<0) y+=30; const x=lead.x+s[0], z=lead.z+s[2], yy=lead.y+y-4; rpos.set([x,yy,z,x-.15,yy-1.1,z],i*6); } rainGeo.attributes.position.needsUpdate=true; }
   if(pickRes) signs.forEach(s=>{ if(pickKeys.includes(s.userData.key)) s.userData.glow.material.opacity=.45+.4*Math.sin(t*5); });
   if(heliAnim) heliAnim(dt,t); if(snakeAnim) snakeAnim(dt,t);
   if(hc.visible){ hc.userData.rotor.rotation.y+=dt*28; hc.userData.trot.rotation.y+=dt*40; }
   if(lampBulb.visible) lamp.intensity=40+8*Math.sin(t*20);
   renderer.render(scene,cam); requestAnimationFrame(frame); }
  { const lead=group[0].position; tgt.set(lead.x+(SUMMIT.x-lead.x)*.3,lead.y+3,lead.z+(SUMMIT.z-lead.z)*.3); cam.position.set(tgt.x+Math.cos(yaw)*Math.cos(pitch)*dist, tgt.y+Math.sin(pitch)*dist, tgt.z+Math.sin(yaw)*Math.cos(pitch)*dist); }
  frame();
  const ro=new ResizeObserver(()=>{ renderer.setSize(W(),H()); cam.aspect=W()/H(); cam.updateProjectionMatrix(); }); ro.observe(el);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  return {
   /* walk the group to trail position u (0 = car park, 1 = summit); resolves on arrival */
   walkTo(u,speed=1){ dir=u>=along?1:-1; return new Promise(res=>{ walking={from:along,to:u,t:0,dur:Math.max(1.2,Math.abs(u-along)*16/speed),res}; }); },
   setAt(u,d){ along=u; if(d) dir=d; placeGroup(along,0); },
   get u(){ return along; },
   altitude(){ const h=group[0].position.y; return Math.min(ALT1,Math.round(ALT0+(h-h0)/(hSum-h0)*(ALT1-ALT0))); },
   setWeather(w){ weather=Math.max(0,Math.min(1,w)); }, get weather(){ return weather; },
   rain(on){ raining=!!on; rain.visible=raining; },
   /* highlight the given signposts; resolves with the key of the one clicked */
   pickSign(keys){ pickKeys=keys; return new Promise(r=>pickRes=r); },
   cancelPick(){ pickRes=null; signs.forEach(s=>s.userData.glow.material.opacity=0); },
   _pick(k){ if(pickRes){ const r=pickRes; pickRes=null; signs.forEach(s=>s.userData.glow.material.opacity=0); r(k); } },
   sit(i,on){ pose[i]=on?'sit':null; if(!on){ const h=group[i]; h.userData.up.forEach(o=>o.rotation.x=0); h.userData.legs.forEach(l=>{ l.rotation.x=0; l.position.z=0; }); } placeGroup(along,0); },
   lamp(on){ lampBulb.visible=!!on; if(!on) lamp.intensity=0; },
   orbit(on){ if(!on){ camOverride=null; return; } const c=group[0].position.clone(); camOverride={tgt:c.clone().add(new T.Vector3(0,4,0)),pos:t=>new T.Vector3(c.x+Math.cos(t*.25)*36,c.y+22,c.z+Math.sin(t*.25)*36)}; },
   showSnake(){ const p=group[2].position; sn.position.set(p.x-4,height(p.x-4,p.z+1)+.08,p.z+1); sn.visible=true; snakeAnim=null; },
   hideSnake(){ return new Promise(res=>{ let k=0; snakeAnim=dt=>{ k+=dt; sn.position.x-=dt*2.2; sn.position.y=height(sn.position.x,sn.position.z)+.08; if(k>2.4){ sn.visible=false; snakeAnim=null; res(); } }; }); },
   /* the rescue: fly in, hover, winch the rescuer down, lift the injured hiker (index i), fly away */
   async rescue(i,onPhase){ const target=group[i].position.clone(), U=hc.userData; const hover=target.clone().add(new T.Vector3(0,14,0)); const start=target.clone().add(new T.Vector3(-90,40,60));
    hc.position.copy(start); hc.visible=true; this.orbit(true); const lerpTo=(to,sec)=>new Promise(r=>{ const from=hc.position.clone(); let k=0; heliAnim=dt=>{ k+=dt/sec; const e=Math.min(1,k), s=(1-Math.cos(e*Math.PI))/2; hc.position.lerpVectors(from,to,s); hc.lookAt(to.x,hc.position.y,to.z); hc.rotateY(-Math.PI/2); if(e>=1){ heliAnim=null; r(); } }; });
    await lerpTo(hover,6); onPhase&&onPhase('hover');
    U.cable.visible=true; U.rescuer.visible=true; const drop=(from,to,sec,lift)=>new Promise(r=>{ let k=0; heliAnim=dt=>{ k+=dt/sec; const e=Math.min(1,k); const L=from+(to-from)*e; U.cable.scale.y=L; U.cable.position.y=-1.3-L/2; U.rescuer.position.set(.4,-1.3-L-1.6,0); if(lift){ U.litter.visible=true; U.litter.position.set(.4,-1.3-L-.3,0);} if(e>=1){ heliAnim=null; r(); } }; });
    await drop(.1,10.4,3.5); onPhase&&onPhase('down'); await wait(900);
    group[i].visible=false; group[i].userData.gone=true; pose[i]=null; await drop(10.4,.4,4,true); U.cable.visible=false; U.rescuer.visible=false; onPhase&&onPhase('up');
    await lerpTo(target.clone().add(new T.Vector3(70,36,80)),6); hc.visible=false; this.orbit(false); onPhase&&onPhase('gone'); },
   dispose(){ running=false; ro.disconnect(); renderer.dispose(); el.innerHTML=''; }
  };
 }
 function supported(){ try{ const c=document.createElement('canvas'); return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl'))); }catch(e){ return false; } }
 return { mount, supported, height };
})();

/* ===== Flat fallback map (no WebGL, or « Carte simple »): same api, painted SVG trail seen from above. ===== */
const PELEE2D=(()=>{
 function mount(el,opts={}){
  const P=[[820,560],[760,500],[700,420],[640,370],[600,300],[540,250],[480,210],[420,180],[360,160],[310,150]];
  const path='M'+P.map(p=>p.join(',')).join(' L');
  el.innerHTML=`<svg viewBox="0 0 1280 800" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block" aria-hidden="true">
   <defs><radialGradient id="pz" cx="30%" cy="20%" r="80%"><stop offset="0" stop-color="#A9A867"/><stop offset=".35" stop-color="#5E8F3E"/><stop offset=".7" stop-color="#2F6B3A"/><stop offset="1" stop-color="#255A30"/></radialGradient>
   <linearGradient id="ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F8FB0"/><stop offset="1" stop-color="#0D3F6A"/></linearGradient></defs>
   <rect width="1280" height="800" fill="url(#ps)"/><path d="M80,800 C60,520 140,200 360,90 C560,0 900,60 1080,240 C1220,380 1260,620 1220,800 Z" fill="#E8D29A"/>
   <path d="M100,800 C84,530 160,216 366,108 C560,20 890,76 1062,250 C1196,388 1236,620 1196,800 Z" fill="url(#pz)"/>
   ${[[310,150,60],[310,150,120],[310,150,190],[310,150,270]].map(([x,y,r],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#24502A" stroke-width="2" opacity="${.35-i*.06}"/>`).join('')}
   <circle cx="310" cy="150" r="26" fill="#9A8C7C"/><path d="${path}" fill="none" stroke="#E3C98F" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
   <g id="p2signs"></g><g id="p2grp"><circle r="16" fill="#F2C46D" opacity=".85"/><circle r="9" fill="#C8102E" stroke="#fff" stroke-width="3"/></g>
   <g id="p2heli" visibility="hidden"><ellipse rx="34" ry="12" fill="#D7262E"/><rect x="-60" y="-3" width="120" height="6" fill="#2B2D42"/></g>
   <rect id="p2fog" width="1280" height="800" fill="#B9C2C6" opacity="0"/><g id="p2rain" opacity="0">${Array.from({length:120},(_,i)=>`<path d="M${(i*97)%1280},${(i*53)%800} l-6,18" stroke="#DDE6EE" stroke-width="2"/>`).join('')}</g></svg>`;
  const svg=el.querySelector('svg'), grp=svg.querySelector('#p2grp'), fog=svg.querySelector('#p2fog');
  const lens=[0]; for(let i=1;i<P.length;i++) lens.push(lens[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1])); const L=lens[lens.length-1];
  const pt=u=>{ const d=Math.max(0,Math.min(1,u))*L; let i=1; while(i<P.length-1&&lens[i]<d) i++; const k=(d-lens[i-1])/(lens[i]-lens[i-1]||1); return [P[i-1][0]+(P[i][0]-P[i-1][0])*k,P[i-1][1]+(P[i][1]-P[i-1][1])*k]; };
  let along=opts.start||0, weather=0, pickRes=null, pickKeys=null;
  const signsG=svg.querySelector('#p2signs');
  (opts.signs||[]).forEach(s=>{ const [x,y]=pt(s.u); signsG.insertAdjacentHTML('beforeend',`<g class="p2s" data-k="${s.key}" transform="translate(${x+18} ${y-10})" style="cursor:pointer"><circle r="18" fill="#F2C46D" opacity="0" class="gl"/><rect x="-3" y="-6" width="6" height="28" fill="#8A5A32"/><rect x="-4" y="-18" width="34" height="14" rx="2" fill="#E9D9B0" stroke="#8A5A32"/></g>`); });
  signsG.addEventListener('click',e=>{ const g=e.target.closest('.p2s'); if(!g||!pickRes||!pickKeys.includes(g.dataset.k)) return; const r=pickRes; pickRes=null; signsG.querySelectorAll('.gl').forEach(c=>c.setAttribute('opacity',0)); r(g.dataset.k); });
  const place=()=>{ const [x,y]=pt(along); grp.setAttribute('transform',`translate(${x} ${y})`); }; place();
  const ALT=[824,1397];
  return {
   walkTo(u){ return new Promise(res=>{ const from=along, dur=Math.max(800,Math.abs(u-from)*9000), t0=performance.now(); const step=n=>{ const k=Math.min(1,(n-t0)/dur); along=from+(u-from)*(1-Math.cos(k*Math.PI))/2; place(); k<1?requestAnimationFrame(step):res(); }; requestAnimationFrame(step); }); },
   setAt(u){ along=u; place(); }, get u(){ return along; },
   altitude(){ return Math.round(ALT[0]+(ALT[1]-ALT[0])*Math.pow(along,.85)); },
   setWeather(w){ weather=w; fog.setAttribute('opacity',(w*.62).toFixed(2)); }, get weather(){ return weather; },
   rain(on){ svg.querySelector('#p2rain').setAttribute('opacity',on?.8:0); },
   pickSign(keys){ pickKeys=keys; signsG.querySelectorAll('.p2s').forEach(g=>{ if(keys.includes(g.dataset.k)) g.querySelector('.gl').setAttribute('opacity',.7); }); return new Promise(r=>pickRes=r); },
   cancelPick(){ pickRes=null; signsG.querySelectorAll('.gl').forEach(c=>c.setAttribute('opacity',0)); },
   _pick(k){ if(pickRes){ const r=pickRes; pickRes=null; r(k); } },
   sit(){}, lamp(){}, orbit(){}, showSnake(){}, hideSnake(){ return Promise.resolve(); },
   async rescue(i,onPhase){ const h=svg.querySelector('#p2heli'); h.setAttribute('visibility','visible'); const [x,y]=pt(along); const fly=(x0,y0,x1,y1,ms)=>new Promise(r=>{ const t0=performance.now(); const st=n=>{ const k=Math.min(1,(n-t0)/ms); h.setAttribute('transform',`translate(${x0+(x1-x0)*k} ${y0+(y1-y0)*k})`); k<1?requestAnimationFrame(st):r(); }; requestAnimationFrame(st); });
    await fly(-100,100,x,y-40,3000); onPhase&&onPhase('hover'); await new Promise(r=>setTimeout(r,1500)); onPhase&&onPhase('down'); await new Promise(r=>setTimeout(r,1200)); onPhase&&onPhase('up'); await fly(x,y-40,1400,-100,3000); h.setAttribute('visibility','hidden'); onPhase&&onPhase('gone'); },
   dispose(){ el.innerHTML=''; }
  };
 }
 return { mount };
})();
