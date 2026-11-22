/* ===== L'enquête: Act 4 (interrogation, written report), the finale, the end screen, passport and diploma. ===== */
async function ACT4(A){ const w=who('arceneaux'), G=A.G;
 if(A.has('moitie')) return A.say('D\'abord, la pièce n° 3 chez M. Landry. Une preuve qu\'il n\'a pas vue n\'existe pas. Il me le répète tous les matins.',{who:w});
 if(!G.flags.interroDone){ await A.say('Cédric est dans la salle d\'interrogatoire, avec son avocat. Moi, je regarde derrière le miroir. Vous, vous posez les questions et vous montrez les preuves.',{who:w});
  return A.go('interro','door',5); }
 if(!G.flags.report) return A.say('Le rapport, enquêt{eur|rice}. À votre bureau. Sans rapport, pas de mandat. Sans mandat, pas d\'arrestation. Sans arrestation, moi, à la télévision.',{who:w});
 return A.say('Le mandat est signé. Henderson, ce soir. Bonne chasse.',{who:w}); }

/* ---------- 12. La salle d'interrogatoire ---------- */
const INTERRO=[
 {id:'s1', says:'« Je suis resté à la salle pendant la pause. »',
  q:[{txt:'Votre camionnette, vous l\'avez prise pendant la pause?',ok:true},{txt:'Votre camionnette, vous lui avez prise pendant la pause?',why:'La camionnette est un COD : la, l\'. « Lui » = à quelqu\'un.'},{txt:'Votre camionnette, vous la avez prise pendant la pause?',why:'Devant « avez », la devient l\' : vous l\'avez prise.'}],
  ev:['tipaul','L_pause'], answer:'… Bon. Je l\'ai prise. Pour acheter des cigarettes. C\'est tout.'},
 {id:'s2', says:'« Je suis allé acheter des cigarettes. »',
  q:[{txt:'Les cigarettes, vous les avez encore?',ok:true},{txt:'Les cigarettes, vous leur avez encore?',why:'Les cigarettes sont un COD : les. « Leur » = à des personnes.'},{txt:'Les cigarettes, vous la avez encore?',why:'Les cigarettes, c\'est au pluriel : les.'}],
  ev:['tipaul'], answer:'… Non. Je ne fume pas. Vous le savez déjà, hein?'},
 {id:'s3', says:'« Je n\'ai jamais mis les pieds au musée. »',
  q:[{txt:'Ces bottes, vous les portiez hier soir?',ok:true},{txt:'Ces bottes, vous leur portiez hier soir?',why:'Les bottes sont un COD : les.'},{txt:'Ces bottes, vous lui portiez hier soir?',why:'Les bottes, c\'est un COD au pluriel : les.'}],
  ev:['bottes','R_van'], answer:'Son avocat lui parle à l\'oreille. Cédric regarde la table. « D\'accord. Je suis entré par la porte de service. Avec un badge. Pas le mien. »'},
 {id:'s4', says:'« La conservatrice? Je ne lui ai pas parlé. »',
  q:[{txt:'Mme Gagnon, vous l\'avez vue hier soir?',ok:true},{txt:'Mme Gagnon, vous lui avez vue hier soir?',why:'On voit quelqu\'un (COD) : la, l\'. « Lui » = parler à quelqu\'un.'},{txt:'Mme Gagnon, vous la avez vue hier soir?',why:'Devant « avez », la devient l\'.'}],
  ev:['hotelclerk','camImage','texto','L_foulard'], answer:'Cédric ferme les yeux. « C\'est elle qui a tout organisé. Elle avait la clé, et le badge. Elle a appelé le gardien. Moi, j\'ai juste conduit et ouvert la vitrine. Elle a gardé le collier. »'}
];
function evOptions(G){ return G.notes.filter(n=>n.id).map(n=>({id:n.id,txt:n.title})); }
ROOMS.interro={
 name:'Poste — salle d\'interrogatoire', depth:[480,.86,790,1.38], walk:[[40,790],[140,640],[1140,640],[1272,790]], obstacles:[],
 start:{x:640,y:740,face:'back'}, entries:{door:{x:640,y:740,face:'back'}},
 bg(G){ return `<rect width="1280" height="460" fill="#6E7478"/><rect width="1280" height="460" fill="url(#vigTop)"/>${Array.from({length:16},(_,i)=>`<rect x="${i*80}" y="54" width="2" height="400" fill="#000" opacity=".08"/>`).join('')}
  <rect width="1280" height="54" fill="#2A2E32"/><rect x="560" y="14" width="160" height="14" rx="2" fill="#F6F9EC"/><path d="M640,28 L460,460 L820,460 Z" fill="#F6F9EC" opacity=".06"/>
  <!-- the one-way mirror, the captain a shadow behind it -->
  <rect x="300" y="110" width="680" height="230" fill="#1A2026"/><rect x="310" y="120" width="660" height="210" fill="url(#glassDark)"/>
  <path d="M320,128 l160,0 l-160,140z" fill="#fff" opacity=".07"/><path d="M880,330 C880,280 900,262 920,262 C940,262 960,280 960,330 Z" fill="#000" opacity=".35"/><ellipse cx="920" cy="250" rx="16" ry="18" fill="#000" opacity=".35"/>
  <rect y="456" width="1280" height="8" fill="#3A3E42"/>
  ${linoFloor(460,800,80,'#8E9296','#7E8286')}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[ { base:640, svg:()=>`${shadow(640,640,300,14,.45)}<polygon points="360,540 920,540 950,566 330,566" fill="#9AA0A4"/><rect x="330" y="566" width="620" height="16" fill="#6E7478"/><rect x="350" y="582" width="14" height="56" fill="#3A3E42"/><rect x="916" y="582" width="14" height="56" fill="#3A3E42"/>
   ${mug(560,552,'#F4F1E8')}${papers(700,552)}<rect x="600" y="540" width="80" height="6" fill="#2A2E36" opacity=".6"/>` } ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".6" pointer-events="none"/>`; },
 npcs:[ { id:'cedric', look:CAST.cedric.look, x:560, y:520, face:'front' }, { id:'avocat', look:{skin:3,hair:'#1E1612',style:'short',coat:'grey',glasses:true,collar:'#F4F1E8'}, x:760, y:520, face:'front' } ],
 hotspots:[
  { id:'miroir', name:'Le miroir', rect:[300,110,680,230], look:'Un grand miroir. Derrière, le capitaine boit son café et vous regarde. Vous voyez votre reflet. Vous avez l\'air sérieu{x|se}. Bien.' },
  { id:'avocat', name:'L\'avocat', rect:[730,330,60,200], look:'L\'avocat de Cédric. Costume gris, cravate grise, sourire gris.', talk:'« Mon client a le droit de garder le silence. » Il sourit. « Moi, j\'ai le droit de facturer à l\'heure. »' },
  { id:'cedric', name:'Cédric Thériot', rect:[530,330,60,200], walkTo:[560,680], face:'back',
    look:'Cédric, assis devant la table. Il a l\'air fatigué, et il n\'a plus son accordéon pour se cacher.',
    async talk(A){ const G=A.G, done=G.interro||{}; G.interro=done;
      const next=INTERRO.find(s=>!done[s.id]);
      if(!next){ return A.say('Cédric a tout dit. Son avocat range ses papiers. Le capitaine frappe deux petits coups sur le miroir : il est content.'); }
      await A.say(next.says,{who:who('cedric')});
      const r=await A.task([
        {t:'choose',prompt:'Posez la bonne question. Attention aux pronoms (le, la, l\', les, lui, leur).',opts:next.q},
        {t:'choose',prompt:'Montrez la preuve qui contredit sa déclaration.',any:true,opts:evOptions(G)}
      ],{title:'Interrogatoire',kind:'Dossier · Interrogatoire',cancel:true,intro:'Rappel de Bruxelles : COD **le, la, l\', les** ; COI **lui, leur**. Devant une voyelle, **l\'**.'});
      if(r.cancelled) return;
      const evid=r.answers[1].hit.id;
      if(!next.ev.includes(evid)){ G.score=Math.max(0,G.score-1); return A.say('Cédric sourit. Son avocat sourit. Le capitaine, derrière le miroir, ne sourit pas. Cette preuve ne contredit pas ce qu\'il dit.'); }
      done[next.id]=true; A.score(Math.max(2,5-r.mistakes),'int_'+next.id); A.tickClock(15);
      await A.say(next.answer,{who:who('cedric')});
      if(next.id==='s4'){ G.flags.interroDone=true;
        A.note('Les aveux de Cédric','C\'est Mme Gagnon qui a tout organisé : la clé, le badge, l\'appel au gardien. Cédric a conduit et ouvert la vitrine. Elle a gardé le collier.','aveux');
        await A.say('Le capitaine entre. « Merci, monsieur Thériot. » Puis, à vous : « Le rapport. À votre bureau. Maintenant. »',{who:who('arceneaux')}); } } },
  { id:'porte', name:'La porte', rect:[1180,460,100,100], walkTo:[1180,700], face:'right', exit:['briefing','fromBureau'] }
 ],
 async onEnter(A){ if(A.G.seen.interro) return; A.G.seen.interro=1; await A.say('La salle d\'interrogatoire. Une table, trois chaises, un miroir. Le café est encore pire ici. Personne ne sait comment c\'est possible.'); }
};

/* ---------- 13. The written report (letter step, checked section by section) ---------- */
const REPORT_STEP={ t:'letter', checkLabel:'Vérifier mon rapport', printLabel:'Imprimer mon rapport', done:'Votre rapport est prêt. Le capitaine le lit deux fois.',
 heading:'Rapport d\'enquête — vol de la parure d\'Évangéline', place:'Lafayette', greet:'Madame la Procureure,', close:'Respectueusement,',
 prompt:'Écrivez votre rapport pour la procureure. Chaque partie est vérifiée. Les erreurs de grammaire sont signalées en premier.',
 sections:[
  {id:'faits',label:'Les faits',prompt:'Racontez la nuit du vol dans l\'ordre, au passé composé, avec au moins trois mots du temps (d\'abord, ensuite, puis, vers 22 h, quand, enfin).',min:40,placeholder:'D\'abord, …',
   checks:[ {re:"\\ba (alle|allee|parti|partie|venu|venue|arrive|arrivee|entre|entree|sorti|sortie|monte|montee|descendu|descendue|retourne|retournee|reste|restee|revenu|revenue)\\b",not:true,msg:'Les verbes de mouvement prennent « être » : il est allé, elle est partie, il est entré.'},
    {re:"\\b(ai|as|a|avons|avez|ont|suis|es|est|sommes|etes|sont)\\s+(\\w+(e|es|i|is|it|u|us|t|ts|ee|ees))\\b",count:5,msg:'Écrivez au moins cinq verbes au passé composé (il a pris, elle a téléphoné, il est entré).'},
    {re:"\\b(d'abord|ensuite|puis|apres|enfin|vers \\d|a \\d{1,2} ?h|quand|pendant que|avant de)",count:3,msg:'Utilisez au moins trois mots du temps : d\'abord, ensuite, puis, vers 22 h, quand, enfin.'} ]},
  {id:'ecarte',label:'Ce que l\'enquête a écarté',prompt:'Écrivez au moins deux phrases négatives au passé composé : ce qui n\'est pas arrivé, qui n\'est pas coupable.',min:15,placeholder:'Le gardien n\'a pas …',
   checks:[ {re:"n'(a|ont|avons|ai|est|sont) rien pas|n'(a|ont|avons|ai) pas rien|n'(a|ont) personne pas",not:true,msg:'Avec « rien » ou « personne », pas de « pas » : il n\'a rien trouvé.'},
    {re:"\\b[a-z]+ (a|ont|avons|ai|est|sont) (pas|rien|jamais|personne)\\b",not:true,msg:'Dans un rapport officiel, on écrit le « ne » : il n\'a pas…'},
    {re:"(n'|\\bne )[^.!?]{0,30}?\\b(pas|rien|personne|jamais|plus)\\b",count:2,msg:'Écrivez au moins deux phrases négatives (ne… pas, ne… rien, ne… personne, ne… jamais).'} ]},
  {id:'coupables',label:'Les coupables',prompt:'Nommez le voleur et la complice avec « qui » et « que », et citez au moins deux preuves.',min:20,placeholder:'C\'est … qui …',
   checks:[ {re:"\\bqui\\b",msg:'Utilisez « qui » : C\'est … qui a …'},{re:"\\bque\\b|\\bqu'",msg:'Utilisez « que » : C\'est la femme que …'},
    {re:"cedric|theriot|musicien|accordeoniste",msg:'Nommez le voleur.'},{re:"gagnon|conservatrice|genevieve",msg:'Nommez la complice.'},
    {re:"\\b(badge|cle|appel|telephone|foulard|boue|bottes|camionnette|peinture|camera|texto|message|perle|bijoux|recu)",count:2,msg:'Citez au moins deux preuves (le badge, l\'appel, le foulard, la boue, la camionnette…).'} ]},
  {id:'reco',label:'Recommandation',prompt:'Faites une recommandation à la procureure.',min:8,placeholder:'Je vous recommande de …',
   checks:[ {re:"recommande a \\w+(er|ir|re)\\b",not:true,msg:'On recommande DE faire, pas À faire.'},
    {re:"recommande d(e|') ?(delivrez|arretez|signez|lancez|envoyez)\\b",not:true,msg:'Après « de », il faut l\'infinitif : délivrer, arrêter, signer.'},
    {re:"vous recommande d(e |')\\w+",msg:'Utilisez « je vous recommande de » + infinitif.'} ]} ] };
const MODEL_REPORT=`D'abord, la conservatrice a téléphoné au gardien vers 22 h 15. Ensuite, le gardien est monté au deuxième étage. Pendant la pause du groupe, Cédric Thériot est venu au musée avec la camionnette rouge. À 22 h 18, il a ouvert la porte de service avec le badge de Mme Gagnon. Puis, il a déplacé la planche de BD et il a pris la parure. Enfin, il est retourné sur scène à 22 h 50.

Le gardien n'a pas ouvert la vitrine : sa clé n'est jamais sortie. Le collectionneur n'a pas quitté l'hôtel : nous n'avons rien trouvé contre lui.

C'est Cédric Thériot qui a volé la parure. C'est Geneviève Gagnon qui a organisé le vol. C'est la femme que le réceptionniste a vue avec le voleur. Son badge et son appel le prouvent.

Je vous recommande de délivrer un mandat contre Mme Gagnon avant minuit.`;
async function REPORT(A){ const r=await A.task(REPORT_STEP,{title:'Le rapport d\'enquête',kind:'Dossier · Rapport',cancel:true,intro:'Votre carnet est ouvert à côté : relisez vos indices. Le lexique est en haut.'});
 if(r.cancelled) return A.say('Le rapport attendra. La conservatrice, elle, n\'attendra pas. Son bateau part à minuit.');
 A.G.flags.report=true; A.score(Math.max(15,30-3*r.mistakes),'report'); A.tickClock(45);
 await A.task({t:'say',text:'**Un rapport modèle**, pour comparer avec le vôtre :\n\n'+MODEL_REPORT},{title:'Rapport modèle',kind:'Document'});
 await A.say('Le capitaine lit votre rapport. Deux fois. « Bon rapport. Je l\'ai lu deux fois. La deuxième fois, par plaisir. » Il signe le mandat.',{who:who('arceneaux')});
 return FINALE(A); }
(function(){ const h=ROOMS.bureau.hotspots.find(x=>x.id==='bureau'); const old=h.hand;
 h.hand=async A=>{ if(A.G.flags.interroDone&&!A.G.flags.report) return REPORT(A); return A.say(old); }; })();

/* ---------- the finale: airboat chase on the bayou, arrest at the fishing camp ---------- */
function bayouTrees(n,seed,y,sc,col){ let s=seed; const r=()=>(s=(s*9301+49297)%233280)/233280; let g='';
 for(let i=0;i<n;i++){ const x=i*(2400/n)+r()*60, h=(180+r()*120)*sc;
  g+=`<g transform="translate(${x.toFixed(0)} ${y})"><path d="M-10,0 C-8,-${h*.4} -6,-${h*.7} -3,-${h} L3,-${h} C6,-${h*.7} 8,-${h*.4} 12,0 Z" fill="${col}"/><path d="M-14,0 l6,-18 l4,18 M10,0 l4,-16 l6,16" fill="${col}"/>
   <ellipse cx="0" cy="-${h}" rx="${40*sc}" ry="${16*sc}" fill="${col}"/><ellipse cx="${-26*sc}" cy="-${h*.82}" rx="${26*sc}" ry="${10*sc}" fill="${col}"/><ellipse cx="${26*sc}" cy="-${h*.86}" rx="${28*sc}" ry="${10*sc}" fill="${col}"/>
   <g stroke="${col}" stroke-width="${2.4*sc}" opacity=".85">${[-34,-18,-4,12,28].map(dx=>`<path d="M${dx*sc},-${h*.82} q2,${30*sc} -1,${60*sc}"/>`).join('')}</g></g>`; } return g; }
function airboat(look,brLook,withSpot,riders=true){ return `<g>${withSpot?`<path d="M120,-120 L520,-200 L520,-40 Z" fill="#FFF4C8" opacity=".18"><animateTransform attributeName="transform" type="rotate" values="-4 120 -120;5 120 -120;-4 120 -120" dur="3s" repeatCount="indefinite"/></path>`:''}
 <path d="M-110,0 L150,0 C160,-6 162,-18 150,-24 L-120,-24 Z" fill="#5E6676"/><path d="M-110,-6 L150,-6" stroke="#9AA3AE" stroke-width="3"/>
 <g transform="translate(-140 -80)"><circle r="56" fill="none" stroke="#2A2E36" stroke-width="6"/><path d="M-50,0 H50 M0,-50 V50 M-36,-36 L36,36 M36,-36 L-36,36" stroke="#2A2E36" stroke-width="2.4"/>
  <g><path d="M-6,-44 L6,-44 L4,44 L-4,44 Z" fill="#8E969D"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur=".18s" repeatCount="indefinite"/></g></g>
 ${riders?`<g transform="translate(-60 -24) scale(.5)">${actorSVG(brLook,'side',.25)}</g><g transform="translate(60 -24) scale(.5)">${actorSVG(look,'side',null)}</g>`:''}
 <rect x="104" y="-46" width="16" height="10" rx="3" fill="#2A2E36"/><circle cx="120" cy="-41" r="5" fill="#FFF4C8"/></g>`; }
function sceneChase(look){ const br=CAST.broussard.look;
 return `<rect width="1280" height="460" fill="url(#skyNight)"/>${Array.from({length:50},(_,i)=>`<circle cx="${(i*263)%1280}" cy="${(i*97)%300}" r="${1+i%2}" fill="#fff" opacity="${.3+(i%5)/10}"/>`).join('')}
 <circle cx="1040" cy="120" r="34" fill="url(#moonDisc)"/><circle cx="1040" cy="120" r="90" fill="url(#moonGlow)"/>
 <g>${bayouTrees(16,3,470,.8,'#141D30')}<animateTransform attributeName="transform" type="translate" from="0 0" to="-700 0" dur="14s" fill="freeze"/></g>
 <rect y="460" width="1280" height="340" fill="url(#riverNight)"/><path d="M1000,470 l40,0 l-10,330 l-20,0 z" fill="#E8EEF8" opacity=".25"/>
 <g stroke="#7FA6C9" stroke-width="2" opacity=".35">${Array.from({length:14},(_,i)=>`<path d="M${(i*173)%1280},${500+i*22} h${60+i%3*30}"/>`).join('')}<animateTransform attributeName="transform" type="translate" from="0 0" to="-400 0" dur="5s" repeatCount="indefinite"/></g>
 <g><g transform="translate(0 600)"><path d="M-40,0 L40,0 L30,-14 L-36,-14 Z" fill="#6E5A44"/><g transform="translate(0 -14) scale(.42)">${actorSVG(CAST.gagnon.look,'side',null)}</g></g>
  <animateTransform attributeName="transform" type="translate" values="760 0;1000 -10;1080 0" dur="10s" fill="freeze"/></g>
 <g><g transform="translate(0 690)">${airboat(look,br,true)}<path d="M-260,-6 h-200 M-240,8 h-260" stroke="#E8EEF8" stroke-width="3" opacity=".4"/></g>
  <animateTransform attributeName="transform" type="translate" values="-200 0;520 -20;760 0" dur="10s" fill="freeze"/></g>
 <g>${bayouTrees(3,11,820,1.3,'#070B14')}<animateTransform attributeName="transform" type="translate" from="600 0" to="-2000 0" dur="11s" fill="freeze"/></g>`; }
function sceneDock(look){ return `<rect width="1280" height="460" fill="url(#skyNight)"/><circle cx="260" cy="110" r="30" fill="url(#moonDisc)"/><circle cx="260" cy="110" r="80" fill="url(#moonGlow)"/>
 ${bayouTrees(10,5,470,.7,'#141D30')}
 <rect y="460" width="1280" height="340" fill="url(#riverNight)"/>
 <!-- fishing camp on stilts -->
 <g><rect x="760" y="250" width="300" height="150" fill="#5A4632"/><polygon points="740,252 910,180 1080,252" fill="#3A3026"/><rect x="800" y="290" width="60" height="50" fill="url(#win)"/><circle cx="830" cy="315" r="70" fill="url(#glow)"/>
  ${[780,860,940,1020].map(x=>`<rect x="${x}" y="400" width="10" height="120" fill="#3A2A1C"/>`).join('')}</g>
 <rect x="380" y="640" width="760" height="20" fill="#7A5A3A"/><rect x="380" y="658" width="760" height="8" fill="#4A3420"/>${[400,580,760,940,1120].map(x=>`<rect x="${x}" y="658" width="12" height="110" fill="#3A2A1C"/>`).join('')}${shadow(640,646,300,10,.3)}
 <path d="M1100,640 v-120" stroke="#2A2E36" stroke-width="3"/><rect x="1092" y="508" width="16" height="16" rx="3" fill="#FFD48A"/><circle cx="1100" cy="516" r="50" fill="url(#bulb)" opacity=".7"/>
 <g transform="translate(900 642) scale(1.25)">${actorSVG(CAST.gagnon.look,'front',null)}<rect x="22" y="-110" width="26" height="34" rx="4" fill="#3A2A1C"/></g>
 <g transform="translate(600 642) scale(1.25)">${actorSVG(look,'side',null)}</g>
 <g transform="translate(470 642) scale(1.25)">${actorSVG(CAST.broussard.look,'side',null)}</g>
 <g transform="translate(220 730)">${airboat(look,CAST.broussard.look,false,false)}</g>
 <g stroke="#7FA6C9" stroke-width="2" opacity=".3">${Array.from({length:10},(_,i)=>`<path d="M${(i*211)%1280},${600+i*18} h${70}"/>`).join('')}</g>`; }
async function FINALE(A){ const G=A.G;
 const late=Math.max(0,G.clock-(24*60+13*60)); const speed=Math.max(0,15-Math.floor(late/20)); const clean=G.fails?0:5;
 G.bonus={speed,clean}; A.score(speed,'speed'); A.score(clean,'clean');
 G.clock=24*60+23*60+20; A.tickClock(0);
 await A.say('23 h 20, Henderson. Le bassin de l\'Atchafalaya. La lune, les cyprès, la mousse espagnole. Et quelque part dans le noir, un petit bateau sans lumières.');
 await A.cinema(sceneChase(A.look),10500);
 await A.say('« Tiens-toi bien, [[cher]]! » crie Broussard. L\'hydroglisseur rugit. Un héron s\'envole. Le petit bateau s\'échoue sur un banc de sable, près d\'un camp de pêche.');
 await A.cinema(sceneDock(A.look),400);
 await A.say(`Geneviève Gagnon, vous êtes en état d'arrestation pour le vol de la parure d'Évangéline. Vous avez le droit de garder le silence.`,{who:A.profile.name+', enquêt{eur|rice}'});
 await A.say('Ben voyons… C\'est plate.',{who:who('gagnon')});
 await A.say('Dans son sac : le collier et la dernière boucle d\'oreille. Ils brillent sous la lampe. Demain, M. Landry remettra la perle à sa place. Il en pleurera presque.');
 await A.say('« Félicitations. Vous avez retrouvé la parure, arrêté deux suspects et ruiné mon festival. Je vous recommande de dormir. C\'est un ordre, pas une recommandation. »',{who:who('arceneaux')});
 A.endCinema(); G.flags.won=true; A.autosave(); return ENDSCREEN(A); }

/* ---------- end screen: score, rank, stamp, full passport, diploma ---------- */
function endDate(){ return new Date().toLocaleDateString('fr-CA',{day:'numeric',month:'short',year:'numeric'}); }
function stampCard8(P,me,stars,date){ return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
 <rect x="6" y="6" width="788" height="508" rx="22" fill="#FFF9EE" stroke="${me.color}" stroke-width="4"/><rect x="20" y="20" width="760" height="480" rx="14" fill="none" stroke="${me.color}" stroke-width="1.5" stroke-dasharray="6 6"/>
 <svg x="50" y="90" width="300" height="300" viewBox="-60 -60 120 120">${stampSVG(me,'done',date.toUpperCase()).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>
 <text x="390" y="100" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="15" letter-spacing="2" fill="#6B6F7A">PASSEPORT · LE GRAND VOYAGE</text>
 <text x="390" y="180" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="50" fill="#2B2D42">${esc(P.name)}</text>
 <text x="390" y="228" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="22" fill="#2B2D42">Louisiane — L'enquête</text>
 <text x="390" y="262" font-family="Fraunces,Georgia,serif" font-style="italic" font-size="19" fill="#6B6F7A">${esc(fmt('Enquêt{eur|rice} principal{|e}',P))}</text>
 <text x="390" y="302" font-family="Inter,Arial,sans-serif" font-weight="600" font-size="19" fill="#2B2D42">Visité le ${esc(date)}</text>
 <text x="390" y="352" font-family="Arial,sans-serif" font-size="36" fill="#E9A93A" letter-spacing="4">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</text>
 <text x="390" y="416" font-family="Inter,Arial,sans-serif" font-size="16" fill="#6B6F7A">Escale réussie.</text><text x="390" y="440" font-family="Inter,Arial,sans-serif" font-size="16" fill="#6B6F7A">Présente ce tampon à ton enseignant·e.</text></svg>`; }
function diplomaSVG(P,rank,final){ const date=new Date().toLocaleDateString('fr-CA',{day:'numeric',month:'long',year:'numeric'});
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1130" viewBox="0 0 1600 1130">
 <rect width="1600" height="1130" fill="#FFF9EE"/><rect x="30" y="30" width="1540" height="1070" fill="none" stroke="#6E3F7A" stroke-width="8"/><rect x="54" y="54" width="1492" height="1022" fill="none" stroke="#C9952F" stroke-width="3"/>
 <text x="800" y="170" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-weight="700" font-size="26" letter-spacing="6" fill="#9B2F2F">FRANÇAIS 20-3Y · LE GRAND VOYAGE</text>
 <text x="800" y="270" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="88" fill="#2B2D42">Diplôme du grand voyage</text>
 <text x="800" y="350" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-style="italic" font-size="34" fill="#6B6F7A">est décerné à</text>
 <text x="800" y="450" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="700" font-size="96" fill="#6E1F1F">${esc(P.name)}</text>
 <text x="800" y="520" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="30" fill="#2B2D42">qui a réussi les huit escales de la francophonie, de Québec à la Louisiane,</text>
 <text x="800" y="562" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="30" fill="#2B2D42">et a résolu l'enquête de la parure d'Évangéline.</text>
 ${JOURNEY.map((s,i)=>`<svg x="${140+i*168}" y="620" width="150" height="150" viewBox="-60 -60 120 120">${stampSVG(s,'done',String((P.done||{})[s.id]||'').toUpperCase()).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>`).join('')}
 <text x="800" y="860" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-size="34" fill="#2B2D42">${esc(rank)} · ${final} points sur 300</text>
 <path d="M300,980 H700 M900,980 H1300" stroke="#6B6F7A" stroke-width="2"/>
 <text x="500" y="1016" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" fill="#6B6F7A">Capitaine Arceneaux, police de Lafayette</text>
 <text x="1100" y="1016" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" fill="#6B6F7A">Le ${esc(date)}</text></svg>`; }
function savePNG(svg,w,h,name){ const img=new Image(); const dl=(href,n)=>{ const a=document.createElement('a'); a.href=href; a.download=n; document.body.appendChild(a); a.click(); a.remove(); };
 img.onload=()=>{ const c=document.createElement('canvas'); c.width=w*2; c.height=h*2; const x=c.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,c.width,c.height); x.drawImage(img,0,0,c.width,c.height); c.toBlob(b=>dl(URL.createObjectURL(b),name),'image/png'); };
 img.onerror=()=>dl(URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),name.replace(/\.png$/,'.svg'));
 img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg); }
function printSVG(svg,landscape){ const pa=document.querySelector('#printArea'); pa.innerHTML=svg; const st=document.createElement('style'); st.textContent=`@page{size:${landscape?'landscape':'portrait'};margin:10mm}`; document.head.appendChild(st); window.print(); setTimeout(()=>st.remove(),600); }
function ENDSCREEN(A){ const P=Store.get()||A.profile, G=A.G, final=A.finalScore(), rank=A.rank(), ratio=final/300, stars=ratio>=.8?3:ratio>=.55?2:1, date=endDate();
 P.done=P.done||{}; if(!P.done.louisiane) P.done.louisiane=date; P.stars=P.stars||{}; P.stars.louisiane=Math.max(P.stars.louisiane||0,stars); Store.set(P);
 if(!G.flags.awarded){ G.flags.awarded=true; window.GVJetons&&GVJetons.award('fr20-louisiane',ratio); }
 const me=JOURNEY.find(j=>j.id==='louisiane'), missing=JOURNEY.filter(j=>!P.done[j.id]), slug=P.name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-');
 const E=document.querySelector('#endscr');
 E.innerHTML=`<div class="ewrap"><div class="ecard"><div class="stampwrap">${stampSVG(me,'done',date.toUpperCase())}</div><div>
  <p class="eyebrow">Escale 8 réussie · Louisiane</p><h1>${esc(fmt('Bravo, [nom]!',P))}</h1>
  <p class="rank">${esc(rank)}</p><p class="pts">${final} points sur 300 <span style="color:#E9A93A">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</span></p>
  <ul class="bonus"><li>Prime de rapidité : +${(G.bonus||{}).speed||0}</li><li>Aucun écran d'échec : +${(G.bonus||{}).clean||0}</li><li>Aide de l'équipe utilisée : ${G.hints||0} fois</li></ul>
  <div class="endbtns"><button class="btn accent" id="eStamp" type="button">Télécharger mon tampon (PNG)</button><button class="btn" id="ePrint" type="button">Imprimer mon tampon</button>
   <button class="btn" id="eDip" type="button" ${missing.length?'disabled':''}>Télécharger mon diplôme</button><button class="btn" id="eDipP" type="button" ${missing.length?'disabled':''}>Imprimer mon diplôme</button>
   <a class="btn" href="voyage.html">Mon passeport</a><button class="btn" id="eAgain" type="button">Rejouer l'enquête</button></div></div></div>
  <div class="pass" aria-label="Mon passeport">${JOURNEY.map(s=>`<figure>${stampSVG(s,P.done[s.id]?'done':'locked',String(P.done[s.id]||'').toUpperCase())}<figcaption>${esc(s.place)}</figcaption></figure>`).join('')}</div>
  <p class="dipnote">${missing.length?`Le diplôme du grand voyage demande les huit tampons. Il te manque : ${missing.map(m=>m.place).join(', ')}.`:'Les huit tampons sont dans ton passeport. Ton diplôme du grand voyage t\'attend!'}</p></div>`;
 E.hidden=false;
 E.querySelector('#eStamp').onclick=()=>savePNG(stampCard8(P,me,stars,date),800,520,`passeport-${slug}-louisiane.png`);
 E.querySelector('#ePrint').onclick=()=>printSVG(stampCard8(P,me,stars,date),true);
 E.querySelector('#eDip').onclick=()=>savePNG(diplomaSVG(P,rank,final),1600,1130,`diplome-${slug}.png`);
 E.querySelector('#eDipP').onclick=()=>printSVG(diplomaSVG(P,rank,final),true);
 E.querySelector('#eAgain').onclick=()=>{ E.hidden=true; location.reload(); }; }

function HINT4(G){ const b='Agente Broussard';
 if(G.inv.includes('moitie')) return {who:b,text:'Donne la pièce n° 3 à M. Landry, à la salle des preuves.'};
 if(!G.flags.interroDone) return {who:b,text:'Parle au capitaine au briefing, puis à Cédric dans la salle d\'interrogatoire. Choisis la bonne question, puis la preuve qui contredit sa phrase.'};
 if(!G.flags.report) return {who:b,text:'Écris ton rapport : utilise la main sur ton bureau, dans le bureau des enquêtes.'};
 return {who:b,text:'Le mandat est signé. On y va.'}; }
