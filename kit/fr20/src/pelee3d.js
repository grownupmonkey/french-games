/* ===== Montagne Pelée in 3D: low-poly island terrain, sea, trail, hikers, clouds, follow camera.
   PELEE3D.mount(el, opts) → api { setWeather(0..1), moveTo(nodeIndex) → Promise, focus(nodeIndex), setGroup(list), nodes, dispose() }
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
  g.userData.legs=[legL,legR]; g.scale.setScalar(1.5); return g; }
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
 function mount(el,opts={}){
  const W=()=>el.clientWidth, H=()=>el.clientHeight;
  const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1)); renderer.setSize(W(),H()); renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05; renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap;
  el.appendChild(renderer.domElement); renderer.domElement.style.display='block';
  const scene=new T.Scene(), sky=new T.Color('#9FD3E8'); scene.background=sky; scene.fog=new T.Fog(sky,120,420);
  const cam=new T.PerspectiveCamera(42,W()/H(),.5,1200);
  scene.add(new T.HemisphereLight('#DDF2FF','#4A5A3A',.85));
  const sun=new T.DirectionalLight('#FFF1D6',2.4); sun.position.set(-70,130,110); sun.castShadow=true;   // top left of the default view
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
  const nodes=opts.nodes||[0,3,5,7,9];
  const nodePos=nodes.map(i=>pts[i].clone());
  nodePos.forEach((p,i)=>{ const s=signpost(); s.position.copy(p).add(new T.Vector3(1.4,-.25,0)); s.rotation.y=-.6; scene.add(s); });
  /* group of hikers */
  const looks=opts.group||[['#C8102E','#2B2D42','#8D5524','#F2C46D'],['#2A9D8F','#E9A93A','#5A3A22','#E9E4D6'],['#5B5F80','#7FD6C8','#C68642','#2B2D42']];
  const group=looks.map(l=>{ const h=hiker(...l); scene.add(h); return h; });
  const ring=new T.Mesh(new T.RingGeometry(1.1,1.45,28),new T.MeshBasicMaterial({color:'#F2C46D',transparent:true,opacity:.9,side:T.DoubleSide,depthWrite:false})); ring.rotation.x=-Math.PI/2; scene.add(ring);
  let along=0; const placeGroup=(t,phase)=>{ group.forEach((h,i)=>{ const u=Math.max(0,Math.min(1,t-i*.022+(t<.03?.044:0))); const p=curve.getPointAt(u), q=curve.getPointAt(Math.min(1,u+.004));
    p.y=height(p.x,p.z); h.position.copy(p); h.lookAt(q.x,p.y,q.z); 
    const sw=Math.sin(phase*9+i)*.5*(phase?1:0); h.userData.legs[0].rotation.x=sw; h.userData.legs[1].rotation.x=-sw; });
   ring.position.copy(group[0].position); ring.position.y+=.15; };
  placeGroup(0,0);
  /* clouds that drift around the summit; more and lower in bad weather */
  const clouds=[]; for(let i=0;i<16;i++){ const c=cloud(); const a=i/16*6.28, r=26+hash(i,9)*40; c.position.set(SUMMIT.x+Math.cos(a)*r,34+hash(i,8)*14,SUMMIT.z+Math.sin(a)*r); c.userData.a=a; c.userData.r=r; c.userData.y=c.position.y; scene.add(c); clouds.push(c); }
  let weather=opts.weather||0;
  function setWeather(w){ weather=Math.max(0,Math.min(1,w)); }
  /* follow camera with drag-to-orbit */
  let yaw=.72, pitch=.5, dist=62, tgt=new T.Vector3(), camGoal=new T.Vector3();
  let drag=null; el.addEventListener('pointerdown',e=>{ drag={x:e.clientX,y:e.clientY,yaw,pitch}; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointermove',e=>{ if(!drag) return; yaw=drag.yaw-(e.clientX-drag.x)*.006; pitch=Math.max(.25,Math.min(1.25,drag.pitch+(e.clientY-drag.y)*.005)); });
  el.addEventListener('pointerup',()=>drag=null);
  el.addEventListener('wheel',e=>{ e.preventDefault(); dist=Math.max(26,Math.min(120,dist*(e.deltaY>0?1.08:.93))); },{passive:false});
  let walking=null, clock=new T.Clock(), running=true, phase=0;
  function moveTo(k){ const to=curve.getUtoTmapping?0:0; const goal=k/(nodes.length-1)*0+(nodes[k]/(pts.length-1));
   return new Promise(res=>{ walking={from:along,to:goal,t:0,dur:Math.max(1.2,Math.abs(goal-along)*14),res}; }); }
  function focus(k){ along=nodes[k]/(pts.length-1); placeGroup(along,0); }
  function frame(){ if(!running) return; const dt=Math.min(.05,clock.getDelta()), t=clock.elapsedTime;
   if(walking){ walking.t+=dt/walking.dur; const e=walking.t<1?(1-Math.cos(walking.t*Math.PI))/2:1; along=walking.from+(walking.to-walking.from)*e; phase+=dt; placeGroup(along,phase);
    if(walking.t>=1){ const r=walking.res; walking=null; placeGroup(along,0); r(); } }
   const lead=group[0].position; const look=new T.Vector3(lead.x+(SUMMIT.x-lead.x)*.3,lead.y+3,lead.z+(SUMMIT.z-lead.z)*.3); tgt.lerp(look,.06);
   camGoal.set(tgt.x+Math.cos(yaw)*Math.cos(pitch)*dist, tgt.y+Math.sin(pitch)*dist, tgt.z+Math.sin(yaw)*Math.cos(pitch)*dist);
   cam.position.lerp(camGoal,.08); cam.lookAt(tgt);
   clouds.forEach((c,i)=>{ c.userData.a+=dt*.01*(1+weather); const r=c.userData.r*(1-weather*.45); c.position.x=SUMMIT.x+Math.cos(c.userData.a)*r; c.position.z=SUMMIT.z+Math.sin(c.userData.a)*r;
    c.position.y+=((c.userData.y-weather*12)-c.position.y)*.02; c.userData.mat.color.setRGB(1-weather*.25,1-weather*.24,1-weather*.2); c.visible=c.position.distanceTo(cam.position)>26; });
   const fc=new T.Color('#9FD3E8').lerp(new T.Color('#B9C2C6'),weather); scene.background=fc; scene.fog.color=fc; scene.fog.near=120-weather*110; scene.fog.far=420-weather*360;
   sun.intensity=2.4-weather*1.7; const U=water.userData.mat.uniforms; U.uTime.value=t; U.uFog.value.copy(fc); U.uNear.value=scene.fog.near; U.uFar.value=scene.fog.far;
   renderer.render(scene,cam); requestAnimationFrame(frame); }
  { const lead=group[0].position; tgt.set(lead.x+(SUMMIT.x-lead.x)*.3,lead.y+3,lead.z+(SUMMIT.z-lead.z)*.3); cam.position.set(tgt.x+Math.cos(yaw)*Math.cos(pitch)*dist, tgt.y+Math.sin(pitch)*dist, tgt.z+Math.sin(yaw)*Math.cos(pitch)*dist); }
  frame();
  const ro=new ResizeObserver(()=>{ renderer.setSize(W(),H()); cam.aspect=W()/H(); cam.updateProjectionMatrix(); }); ro.observe(el);
  return { setWeather, moveTo, focus, nodes:nodePos, get yaw(){return yaw;}, dispose(){ running=false; ro.disconnect(); renderer.dispose(); el.innerHTML=''; } };
 }
 function supported(){ try{ const c=document.createElement('canvas'); return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl'))); }catch(e){ return false; } }
 return { mount, supported, height };
})();
