/* ===== Traveller profile, shared by the journey page and every game (same site => same storage). ===== */
const STORE_KEY='jeuxFr20.voyage';
const Store={
 get(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY))||null; }catch(e){ return Store._mem||null; } },
 set(p){ Store._mem=p; try{ localStorage.setItem(STORE_KEY, JSON.stringify(p)); }catch(e){} },
 clear(){ Store._mem=null; try{ localStorage.removeItem(STORE_KEY); }catch(e){} }
};
/* agreement helper: {m|f} picks the masculine or feminine form for the player */
function agree(p){ return p && (p.agree||(p.gender==='fille'?'f':'m')); }
function fmt(text,p){
 const a=agree(p);
 return String(text).replace(/\{([^{}|]*)\|([^{}]*)\}/g,(m,mm,ff)=>a==='f'?ff:mm).replace(/\[nom\]/g,(p&&p.name)||'Voyageur');
}
function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* Character creator. host: element; onDone(profile). */
function mountCreator(host, onDone, existing){
 const p=Object.assign({name:'',gender:'fille',agree:'f',skin:1,hair:1,style:null,done:{},stars:{}}, existing||{});
 const opt=(name,val,label,checked,extra='')=>`<label ${extra}><input type="radio" name="${name}" value="${val}" ${checked?'checked':''}>${label}</label>`;
 host.innerHTML=`<form class="card creator" novalidate>
  <div class="preview"><svg viewBox="-70 -250 140 262" role="img" aria-label="Aperçu de ton personnage"><g class="pv"></g></svg></div>
  <div>
   <h2>Crée ton voyageur</h2>
   <div class="field"><label class="lab" for="cr-name">Comment tu t'appelles?</label>
    <input type="text" id="cr-name" maxlength="20" autocomplete="off" value="${esc(p.name)}" placeholder="Ton prénom"></div>
   <fieldset class="field"><legend>Tu es…</legend><div class="choices">
    ${opt('gender','fille','une fille',p.gender==='fille')}${opt('gender','garcon','un garçon',p.gender==='garcon')}${opt('gender','nb','non binaire',p.gender==='nb')}</div></fieldset>
   <fieldset class="field agreeRow" ${p.gender==='nb'?'':'hidden'}><legend>Pour les accords en français (je suis arrivé / arrivée), utilise :</legend><div class="choices">
    ${opt('agree','m','le masculin',p.agree==='m')}${opt('agree','f','le féminin',p.agree==='f')}</div></fieldset>
   <fieldset class="field"><legend>Teint</legend><div class="choices">
    ${SKIN.map((s,i)=>opt('skin',i,`<span style="background:${s.m}"></span>`,p.skin===i,`class="swatch" title="${s.name}" aria-label="${s.name}"`)).join('')}</div></fieldset>
   <fieldset class="field"><legend>Cheveux</legend><div class="choices">
    ${HAIR.map((s,i)=>opt('hair',i,`<span style="background:${s.c}"></span>`,p.hair===i,`class="swatch" title="${s.name}" aria-label="${s.name}"`)).join('')}</div>
    <div class="choices" style="margin-top:8px">${opt('style','long','longs',p.style==='long')}${opt('style','mid','mi-longs',p.style==='mid')}${opt('style','short','courts',p.style==='short')}</div></fieldset>
   <button class="btn primary" type="submit">C'est moi! Allons-y</button>
   <p class="note err" hidden>Écris ton prénom pour continuer.</p>
  </div></form>`;
 const f=host.querySelector('form'), pv=host.querySelector('.pv');
 const read=()=>{
  const g=f.gender.value; p.gender=g; p.name=f.querySelector('#cr-name').value.trim();
  p.agree = g==='fille'?'f': g==='garcon'?'m': (f.agree.value||'m');
  p.skin=+f.skin.value; p.hair=+f.hair.value;
  p.style = f.style.value || (g==='fille'?'long':g==='garcon'?'short':'mid');
  f.querySelector('.agreeRow').hidden = g!=='nb';
  pv.innerHTML = person(Object.assign(playerLook(p),{x:0,y:0,noShadow:false}));
 };
 if(!p.style){ p.style = p.gender==='fille'?'long':p.gender==='garcon'?'short':'mid'; f.querySelector(`input[name=style][value=${p.style}]`).checked=true; }
 f.addEventListener('input', e=>{
  if(e.target.name==='gender'){ const d=e.target.value==='fille'?'long':e.target.value==='garcon'?'short':'mid'; f.querySelector(`input[name=style][value=${d}]`).checked=true; }
  read();
 });
 f.addEventListener('submit', e=>{ e.preventDefault(); read();
  if(!p.name){ f.querySelector('.err').hidden=false; f.querySelector('#cr-name').focus(); return; }
  p.name=p.name.charAt(0).toUpperCase()+p.name.slice(1);
  Store.set(p); onDone(p);
 });
 read();
}
