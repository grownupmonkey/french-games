/* ===== L'enquête: Act 2 (driving map, curator's office, Chez Babineaux, hôtel Evangeline, timeline board, briefing recommendations). ===== */
const dsc=(d,y)=>{ const t=Math.max(0,Math.min(1,(y-d[0])/(d[2]-d[0]))); return d[1]+(d[3]-d[1])*t; };
const BACK_TO_MAP=(rect,walkTo)=>({ id:'voiture', name:'Retour à la voiture', rect, walkTo, face:'back', exit:['carte',null,0] });

/* ---------- the driving map (no walking: choose a destination) ---------- */
ROOMS.carte={
 name:'Lafayette — de nuit', noPlayer:true, depth:[470,.84,790,1.36], walk:[[0,0],[1,0],[1,1]], start:{x:-100,y:-100,face:'front'},
 bg(G){ const v=G.seen; const pin=(x,y,lab,done,sub)=>`<g>${shadow(x,y+4,16,5,.35,'blurS')}<path d="M${x},${y} C${x-16},${y-22} ${x-18},${y-40} ${x},${y-48} C${x+18},${y-40} ${x+16},${y-22} ${x},${y} Z" fill="${done?'#5E8C4A':'#9B2F2F'}"/><circle cx="${x}" cy="${y-34}" r="7" fill="#FFFDF6"/>
   ${done?`<path d="M${x-4},${y-34} l3,3 l6,-6" stroke="#5E8C4A" stroke-width="2.4" fill="none"/>`:''}<rect x="${x-110}" y="${y+10}" width="220" height="${sub?48:30}" rx="4" fill="#FFFDF6" stroke="#8C7A54" stroke-width="1.5"/>
   ${txt(x,y+31,lab,16,{mid:1,serif:1})}${sub?txt(x,y+50,sub,12,{mid:1,w:600,fill:'#6E5A40'}):''}</g>`;
  return `<rect width="1280" height="800" fill="#1A1814"/><rect x="40" y="30" width="1200" height="740" rx="6" fill="url(#parch)"/>
  <rect x="40" y="30" width="1200" height="740" rx="6" fill="none" stroke="#8C7A54" stroke-width="3"/><rect x="54" y="44" width="1172" height="712" fill="none" stroke="#B9A67E" stroke-width="1.5" stroke-dasharray="6 6"/>
  <g stroke="#D2C29C" stroke-width="10" opacity=".75" fill="none">${[160,280,400,520,640].map(y=>`<path d="M60,${y} H1220"/>`).join('')}${[200,380,560,740,920,1100].map(x=>`<path d="M${x},50 V750"/>`).join('')}</g>
  <g stroke="#C9B68C" stroke-width="3" fill="none">${[220,340,460,580,700].map(y=>`<path d="M60,${y} H1220"/>`).join('')}${[290,470,650,830,1010].map(x=>`<path d="M${x},50 V750"/>`).join('')}</g>
  <path d="M60,710 C220,660 300,720 460,640 C600,570 640,470 760,430 C900,380 980,300 1220,260" stroke="url(#river2)" stroke-width="30" fill="none" opacity=".9"/>
  ${txt(980,330,'Rivière Vermilion',14,{w:600,fill:'#3E6688',serif:1})}
  <ellipse cx="300" cy="300" rx="80" ry="40" fill="#B9D6A0" opacity=".7"/>${txt(300,305,'Parc',12,{mid:1,w:600,fill:'#4E7A3E'})}
  <rect x="60" y="56" width="360" height="72" rx="4" fill="#FFFDF6" stroke="#8C7A54" stroke-width="1.5"/>${txt(240,88,'LAFAYETTE — DE NUIT',22,{mid:1,serif:1,ls:1})}${txt(240,114,'Choisissez une destination.',14,{mid:1,w:600,fill:'#6E5A40'})}
  <g transform="translate(1140 680)"><circle r="34" fill="#FFFDF6" stroke="#8C7A54" stroke-width="1.5"/><path d="M0,-28 L8,0 L0,28 L-8,0 Z" fill="#9B2F2F"/><path d="M0,-28 L8,0 L0,0 Z" fill="#6E1F1F"/>${txt(0,-38,'N',13,{mid:1})}</g>
  ${pin(220,560,'Poste de police',false,'Le capitaine, le tableau')}
  ${G.flags.morning?pin(1060,420,'Breaux Bridge',v.rue,'Prêteur sur gages Fontenot'):`${pin(560,340,'Musée de Lafayette',v.curator,'Bureau de la conservatrice')}
  ${pin(900,580,'Chez Babineaux',v.babineaux,'Bal cajun')}
  ${pin(760,170,'Hôtel Evangeline',v.hotel,'Le collectionneur')}`}
  ${G.flags.morning?`<rect x="0" y="0" width="1280" height="800" fill="#FFF4D8" opacity=".08"/>${txt(240,140,'Samedi matin',13,{mid:1,w:600,fill:'#6E5A40'})}`:''}`; },
 props:[], npcs:[],
 hotspots:[
  { id:'p-poste', name:'Poste de police', ell:[220,530,120,70], exit:['briefing','fromParking',10] },
  { id:'p-musee', name:'Musée de Lafayette', when:G=>!G.flags.morning, ell:[560,310,130,70], exit:['bureauG','fromHall',10] },
  { id:'p-bal', name:'Chez Babineaux', when:G=>!G.flags.morning, ell:[900,550,120,70], exit:['babineaux','door',10] },
  { id:'p-hotel', name:'Hôtel Evangeline', when:G=>!G.flags.morning, ell:[760,140,130,70], exit:['hotel','door',10] },
  { id:'p-bb', name:'Breaux Bridge', when:G=>G.flags.morning, ell:[1060,390,130,70], exit:['rue','car',15] }
 ]
};

/* ---------- 8. Le bureau de la conservatrice ---------- */
const CUR_D=[474,.86,790,1.38];
const QC_REWRITE=[
 {t:'say',who:'Geneviève Gagnon',text:'Ben là! J\'ai quitté le musée à 20 h. Après, je suis passée au [[dépanneur]], [[pis]] je suis rentrée chez nous. J\'ai **pas** utilisé mon badge de la soirée. J\'ai parlé à **personne**.'},
 {t:'say',who:'Geneviève Gagnon',text:'C\'était [[plate]], [[pas pantoute]] excitant. Mon [[chum]]? Il joue de l\'accordéon, mais il était sur scène toute la soirée.'},
 {t:'say',text:'**Le savais-tu?** En français parlé, surtout au Québec, le *ne* de la négation disparaît souvent : *J\'ai pas utilisé* = *Je n\'ai pas utilisé*. Dans un rapport de police, on écrit toujours le *ne*.'},
 {t:'tiles',prompt:'Réécrivez sa première phrase en français standard, pour le rapport.',tiles:['Je','J\'','n\'','ne','ai','pas','utilisé','mon badge','.'],answer:'Je n\'ai pas utilisé mon badge.',
  hints:{'J\'':'Avec la négation, « je » devient « je n\' » : Je n\'ai pas…','ne':'Devant une voyelle, « ne » devient « n\' ».'}},
 {t:'tiles',prompt:'Réécrivez sa deuxième phrase en français standard.',tiles:['Je','n\'','ai','parlé','à','personne','pas','.'],answer:'Je n\'ai parlé à personne.',
  hints:{'pas':'Avec « personne », on n\'ajoute pas « pas » : ne… personne.'}}
];
ROOMS.bureauG={
 name:'Musée — bureau de la conservatrice', depth:CUR_D, walk:STATION_WALK,
 obstacles:[ [[470,600],[830,600],[838,650],[462,650]], [[984,456],[1028,456],[1030,476],[982,476]] ],
 start:{x:1170,y:494,face:'front'}, entries:{fromHall:{x:1170,y:494,face:'front'}},
 bg(G){ const open=G.flags.cabOpen;
  return `<rect width="1280" height="446" fill="url(#cuWall)"/><rect y="360" width="1280" height="86" fill="url(#mWain)"/><rect y="354" width="1280" height="9" fill="url(#mRail)"/>
  <rect y="436" width="1280" height="12" fill="#22150B"/><rect width="1280" height="48" fill="#3A2E24"/><rect y="48" width="1280" height="6" fill="#6E5A44"/>
  ${nightWindow(70,110,170,190,11)}
  <!-- bookshelf -->
  ${shadow(410,446,120,8,.35)}<rect x="300" y="110" width="220" height="330" fill="#5E3A22"/><rect x="310" y="120" width="200" height="314" fill="#3A2416"/>
  ${[0,1,2,3].map(r=>`<rect x="306" y="${190+r*78}" width="208" height="8" fill="#7A5234"/>`+Array.from({length:12},(_,i)=>{ const h=48+(i*7+r*5)%22, x=314+i*16; return `<rect x="${x}" y="${190+r*78-h}" width="${12+(i%3)}" height="${h}" fill="url(#book${'ABCD'[(i+r)%4]})"/><rect x="${x+2}" y="${190+r*78-h+8}" width="8" height="2" fill="#E9D9B0" opacity=".6"/>`; }).join('')).join('')}
  <!-- vernissage photo: the curator in her green scarf -->
  ${shadow(612,250,56,5,.25,'blurS')}<rect x="560" y="140" width="104" height="110" fill="url(#frameGold)"/><rect x="568" y="148" width="88" height="94" fill="#C9B79A"/>
  <rect x="568" y="148" width="88" height="94" fill="#3A4652" opacity=".35"/>
  <path d="M592,242 C592,214 600,202 612,200 C624,202 632,214 632,242 Z" fill="#7A4E6E"/><path d="M598,206 C606,214 618,214 626,206 L628,214 C618,222 606,222 596,214 Z" fill="#3FA36B"/><path d="M620,212 L624,236 L616,236 L614,214 Z" fill="#2A7A4E"/>
  <ellipse cx="612" cy="188" rx="11" ry="13" fill="#F0C9A8"/><path d="M600,186 C600,170 624,170 624,186 L626,206 L620,206 L620,186 C614,182 608,182 604,186 L604,206 L598,206 Z" fill="#4A2E1C"/><circle cx="607" cy="188" r="3" fill="none" stroke="#2A2A30"/><circle cx="617" cy="188" r="3" fill="none" stroke="#2A2A30"/>
  ${txt(612,236,'',1)}
  <!-- staff list on a small corkboard -->
  ${shadow(746,268,50,4,.22,'blurS')}<rect x="696" y="150" width="100" height="112" fill="#6E4A2C"/><rect x="702" y="156" width="88" height="100" fill="url(#cork)"/><rect x="712" y="164" width="68" height="84" fill="#FFFDF6"/>${txt(746,180,'PERSONNEL',8.5,{mid:1,ls:1})}
  ${[0,1,2,3].map(i=>`<path d="M718,${196+i*14} h56" stroke="#9AA3AE" stroke-width="1.4"/>`).join('')}<circle cx="746" cy="160" r="3" fill="#B8443A"/>
  <!-- key cabinet -->
  ${shadow(882,290,40,4,.25,'blurS')}<rect x="842" y="168" width="80" height="116" rx="3" fill="url(#cabMetal)"/>
  ${open?`<rect x="848" y="174" width="68" height="104" fill="#3A4046"/>${[0,1,2].map(i=>`<circle cx="${862+i*20}" cy="196" r="2.4" fill="#C9CED2"/>${i!==1?`<path d="M${862+i*20},196 v10" stroke="#C69A44" stroke-width="2"/><circle cx="${862+i*20}" cy="210" r="4" fill="none" stroke="#C69A44" stroke-width="2"/>`:''}<rect x="${854+i*20}" y="222" width="16" height="6" fill="#F7F1E3"/>`).join('')}<path d="M842,168 L812,178 L812,294 L842,284 Z" fill="url(#cabMetal)"/>`
   :`<rect x="900" y="220" width="10" height="16" rx="2" fill="#3A4046"/><circle cx="905" cy="226" r="2" fill="#C9CED2"/>`}
  ${door(1120,206,100,232,{label:'COULOIR',glass:true})}
  <rect y="446" width="1280" height="354" fill="url(#mFloor)"/>${floorPlanks(446,800,46)}<rect y="446" width="1280" height="26" fill="#000" opacity=".22"/>
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:476, svg:G=>`${shadow(1006,476,26,5,.35,'blurS')}<rect x="1003" y="300" width="6" height="176" fill="#3A2416"/><path d="M984,476 h44" stroke="#3A2416" stroke-width="6" stroke-linecap="round"/>
    <path d="M1006,306 l-18,10 M1006,306 l18,10 M1006,326 l-16,8 M1006,326 l16,8" stroke="#3A2416" stroke-width="4" stroke-linecap="round"/>
    <path d="M1022,334 C1030,350 1032,400 1028,440 L1018,440 C1020,400 1018,360 1014,338 Z" fill="#C8A878"/><path d="M1018,440 L1028,440 L1024,450 Z" fill="#3A2416"/>` },
  { base:520, svg:()=>chairBack(650,524,.95) },
  { base:648, svg:G=>`${desk(466,540,370,108)}
    ${G.flags.dico?`${shadow(700,548,20,3,.35,'blurS')}<rect x="682" y="526" width="40" height="22" rx="2" fill="#2F6CB3"/><rect x="682" y="526" width="40" height="6" rx="2" fill="#4E8FD9"/>${shadow(760,548,24,3,.35,'blurS')}<polygon points="738,548 784,548 788,538 742,538" fill="#7A2020"/><polygon points="740,540 786,540 788,532 742,532" fill="#9B2F2F"/>`
     :`${shadow(700,548,22,3,.35,'blurS')}<rect x="682" y="526" width="40" height="22" rx="2" fill="#2F6CB3"/><rect x="678" y="500" width="48" height="26" rx="2" fill="#9B2F2F"/><rect x="678" y="500" width="48" height="6" fill="#B8443A"/><rect x="684" y="510" width="36" height="2" fill="#E2B860"/>`}
    ${monitor(636,548)}${papers(510,548)}<rect x="532" y="538" width="26" height="8" fill="#FFFDF6" transform="rotate(-6 545 542)"/>
    ${shadow(800,548,12,2,.3,'blurS')}<rect x="790" y="536" width="20" height="12" rx="1" fill="#2A2E36"/><rect x="793" y="530" width="14" height="8" fill="#FFFDF6"/>` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".5" pointer-events="none"/>`; },
 npcs:[ { id:'gagnon', look:CAST.gagnon.look, x:930, y:570, face:'left', block:[[900,558],[960,558],[964,584],[896,584]] } ],
 hotspots:[
  { id:'livres', name:'La bibliothèque', rect:[300,110,220,330], walkTo:[410,500], face:'back', look:'Des livres d\'art, des catalogues, et un guide « Montréal pour les nuls ». La conservatrice s\'ennuie peut-être de chez elle.' },
  { id:'photo', name:'La photo du vernissage', rect:[560,140,104,110], walkTo:[612,500], face:'back',
    async look(A){ await A.say('Une photo du vernissage de l\'exposition. Mme Gagnon sourit devant la vitrine de la parure. Elle porte un [[foulard]] vert. Très vert. On le remarque de loin.');
      A.note('Le foulard vert','Sur la photo du vernissage, Mme Gagnon porte un foulard vert très visible.','foulard'); } },
  { id:'porte-manteau', name:'Le portemanteau', rect:[980,296,56,180], walkTo:[960,520], face:'right',
    async look(A){ await A.say('Le [[portemanteau]]. Un parapluie beige. Un crochet vide. Ce soir, Mme Gagnon ne porte pas de foulard.');
      if(A.hasNote('foulard')) await A.say('Le foulard vert de la photo n\'est ni sur elle, ni sur le portemanteau. Où est-il?');
      if(!A.G.scored.crochet){ A.score(2,'crochet'); } } },
  { id:'personnel', name:'La liste du personnel', rect:[696,150,100,112], walkTo:[746,500], face:'back',
    async look(A){ await A.task({t:'doc',kind:'Liste',title:'Personnel du musée — badges',table:[['Badge','Nom','Poste'],['n° 1','J. Broussard','directeur'],['n° 2','R. Guidry','gardien de nuit'],['n° 3','G. Gagnon','conservatrice'],['n° 4','L. Romero','entretien']]},{title:'La liste du personnel',kind:'Document'});
      if(!A.hasNote('badgelist')){ A.note('La liste des badges','Badge n° 1 : directeur. N° 2 : R. Guidry, gardien. N° 3 : G. Gagnon, conservatrice. N° 4 : entretien.','badgelist'); A.score(2,'badgelist'); } } },
  { id:'carte', name:'Les cartes de visite', rect:[786,524,30,26], walkTo:[790,676], face:'back',
    async look(A){ await A.say('Des cartes de visite : « Geneviève Gagnon, conservatrice. Cellulaire : 337-555-0144. »');
      if(!A.hasNote('carte')){ A.note('La carte de Mme Gagnon','Cellulaire de Mme Gagnon : 337-555-0144.','carte'); A.score(2,'carteV'); } } },
  { id:'note', name:'Une note', rect:[530,530,32,18], walkTo:[540,676], face:'back',
    async look(A){ A.flag('readNote',true); return A.say('Une note de son assistante : « La [[clé de secours]] est dans la boîte bleue, [[sous]] le dictionnaire, [[derrière]] l\'ordinateur. »'); } },
  { id:'ordi', name:'L\'ordinateur', rect:[602,480,68,64], walkTo:[636,676], face:'back',
    look:'L\'ordinateur de la conservatrice. Fond d\'écran : le Vieux-Port de Montréal.',
    async hand(A){ if(!A.G.flags.readNote) return A.say('L\'ordinateur demande un mot de passe. Vous essayez « parure ». Non.');
      return A.say('Vous cherchez [[sur]] l\'ordinateur. Rien. La note dit « derrière l\'ordinateur », pas « sur ».'); } },
  { id:'dico', name:'Le dictionnaire', when:G=>!G.flags.dico, rect:[674,496,56,32], walkTo:[700,676], face:'back',
    look:'Un gros dictionnaire rouge, derrière l\'ordinateur.',
    async hand(A){ if(!A.G.flags.readNote) return A.say('Un dictionnaire. Vous n\'avez pas besoin d\'un dictionnaire. Enfin, pas tout de suite.');
      A.flag('dico',true); A.redraw(); return A.say('Vous soulevez le dictionnaire. Dessous, il y a une petite boîte bleue.'); } },
  { id:'boite', name:'La boîte bleue', when:G=>G.flags.dico, rect:[680,524,44,26], walkTo:[700,676], face:'back',
    look:'Une petite boîte bleue. Elle était sous le dictionnaire, derrière l\'ordinateur. Exactement comme la note le dit.',
    async hand(A){ if(A.G.flags.spareKey) return A.say('La boîte est vide. Vous avez déjà la clé de secours.'); A.flag('spareKey',true); A.score(4,'spareKey');
      return A.say('Dans la boîte bleue : une petite clé. La clé de secours de l\'armoire à clés.'); } },
  { id:'tiroir', name:'Le tiroir', rect:[740,570,90,70], walkTo:[780,690], face:'back', hand:'La note ne parle pas du tiroir. Relisez la note : dans, sous, derrière.' },
  { id:'armoire', name:'L\'armoire à clés', rect:[842,168,80,116], walkTo:[882,500], face:'back',
    async look(A){ if(!A.G.flags.cabOpen) return A.say('Une armoire à clés, fermée. Mme Gagnon dit qu\'elle a oublié sa clé. Il y a peut-être une clé de secours quelque part.');
      return A.say('L\'armoire est ouverte. Trois crochets, trois étiquettes : « bureau », « vitrine — parure », « réserve ». Le crochet « vitrine — parure » est vide.'); },
    async hand(A){ if(A.G.flags.cabOpen) return A.say('Elle est déjà ouverte.');
      if(!A.G.flags.spareKey) return A.say('Fermée à clé. Il faut trouver la clé de secours.');
      A.flag('cabOpen',true); A.score(3,'cabOpen'); A.redraw();
      await A.say('Vous ouvrez l\'armoire avec la clé de secours. Le crochet « vitrine — parure » est vide.');
      await A.say('« Ben voyons, ma clé, je l\'ai à la maison! » dit Mme Gagnon. Un peu trop vite.',{who:who('gagnon')});
      A.note('La clé de la vitrine n\'est pas là','Dans l\'armoire du bureau, le crochet « vitrine — parure » est vide. Mme Gagnon dit que sa clé est chez elle.','caseKey'); } },
  { id:'gagnon', name:'Geneviève Gagnon', poly:[[896,340],[964,340],[970,580],[890,580]], walkTo:[840,600], face:'right',
    look:'Geneviève Gagnon, la conservatrice, venue de Montréal. Elle est revenue au musée en pleine nuit. Elle a l\'air fatiguée, et un peu trop calme.',
    async talk(A){ const w=who('gagnon');
      if(!A.G.flags.curatorStmt){
        await A.say('Bonsoir, enquêt{eur|rice}. C\'est terrible, terrible. Je vais tout vous dire.',{who:w});
        const r=await A.task(QC_REWRITE,{title:'Déclaration de la conservatrice',kind:'Dossier · Déclaration',intro:'Mme Gagnon parle en français québécois. Lisez bien, puis réécrivez deux phrases en français standard.'});
        A.flag('curatorStmt',true); A.score(Math.max(3,6-r.mistakes),'curatorStmt'); A.tickClock(10);
        A.note('Déclaration de Mme Gagnon','Elle dit : « Je n\'ai pas utilisé mon badge de la soirée. Je n\'ai parlé à personne. » Elle est partie du musée à 20 h. Son chum joue de l\'accordéon.','gagnon');
        return; }
      const o=await A.menu('Parler à Mme Gagnon',[ {txt:'Qui a une clé de la vitrine?'}, {txt:'Où est votre foulard vert?', when:G=>G.notes.some(n=>n.id==='foulard')}, {txt:'Votre chum, c\'est qui?'} ]);
      if(!o) return;
      if(o.txt.startsWith('Qui')) return A.say('Moi, et le gardien avec sa clé maîtresse. Ma clé est dans l\'armoire. Enfin… je pense.',{who:w});
      if(o.txt.startsWith('Où')) return A.say('Mon foulard? Je l\'ai… perdu. Ben, je sais pas où. Ça arrive, non? C\'est juste un foulard.',{who:w});
      return A.say('Cédric. Cédric Thériot. Il joue de l\'accordéon Chez Babineaux. Il était sur scène toute la soirée. Toute. La. Soirée.',{who:w}); } },
  BACK_TO_MAP([1120,206,100,232],[1170,488])
 ],
 async onEnter(A){ if(A.G.seen.curator) return; A.G.seen.curator=1; await A.say('Le bureau de la conservatrice, au deuxième étage du musée. Ça sent le papier ancien et le parfum cher. Mme Gagnon vous attend, les bras croisés.'); }
};

/* ---------- 9. Chez Babineaux (bal cajun) ---------- */
const BAL_D=[480,.82,790,1.32];
const SETLIST={t:'doc',kind:'Affiche',title:'Les Écrevisses de la Vermilion — ce soir',lines:['1er set : 20 h 30 – 22 h 10','Pause : 22 h 10 – 22 h 50','2e set : 22 h 50 – minuit','Fais do-do jusqu\'à 1 h']};
const SET_Q={t:'number',prompt:'Lisez l\'affiche. Le trajet entre le musée et Chez Babineaux prend 10 minutes.',
 rows:[ {label:'Combien de minutes dure la pause?',ans:40,unit:'minutes',why:'De 22 h 10 à 22 h 50 : comptez les minutes.'},
  {label:'Un aller-retour au musée prend combien de minutes?',ans:20,unit:'minutes',why:'10 minutes pour aller, 10 minutes pour revenir.'},
  {label:'Combien de minutes Cédric aurait-il pu passer au musée?',ans:20,unit:'minutes',why:'La pause, moins le trajet aller-retour.'} ],
 say:'La pause dure 40 minutes. Moins 20 minutes de route, il reste 20 minutes au musée.', done:'Vingt minutes. C\'est assez pour ouvrir une vitrine avec une clé.'};
function instr(kind,x,y,s){ // instruments drawn on top of a musician (feet at x,y, scale s)
 const cy=y-120*s;
 if(kind==='acc') return `<g transform="translate(${x} ${cy}) scale(${s})"><rect x="-26" y="-22" width="14" height="44" rx="3" fill="#B8443A"/><rect x="12" y="-22" width="14" height="44" rx="3" fill="#9B2F2F"/>
  <path d="M-12,-20 l4,40 M-6,-20 l4,40 M0,-20 l4,40 M6,-20 l4,40" stroke="#2A2014" stroke-width="2"/><rect x="-12" y="-22" width="24" height="44" fill="#E9E3D4" opacity=".4"/>${[-14,-6,2].map(yy=>`<circle cx="-19" cy="${yy}" r="2" fill="#F4F1E8"/>`).join('')}</g>`;
 if(kind==='fid') return `<g transform="translate(${x+10*s} ${cy-24*s}) rotate(-30) scale(${s})"><path d="M-8,-18 C-14,-12 -14,-4 -8,0 C-14,4 -14,14 -8,18 L8,18 C14,14 14,4 8,0 C14,-4 14,-12 8,-18 Z" fill="#A0622A"/><rect x="-2" y="-46" width="4" height="30" fill="#2A1C10"/><path d="M-30,-10 L34,20" stroke="#D9C69A" stroke-width="2"/></g>`;
 return `<g transform="translate(${x+18*s} ${cy}) scale(${s})"><path d="M0,-18 L14,10 L-14,10 Z" fill="none" stroke="url(#steel)" stroke-width="3"/><path d="M0,-28 v10" stroke="#5E666C" stroke-width="1.5"/></g>`; }
ROOMS.babineaux={
 name:'Chez Babineaux — bal cajun', depth:BAL_D,
 walk:[[30,790],[120,484],[860,484],[860,540],[1250,540],[1272,790]],
 obstacles:[], start:{x:640,y:760,face:'back'}, entries:{door:{x:640,y:760,face:'back'}},
 bg(G){ const bulbs=Array.from({length:22},(_,i)=>{ const x=40+i*57, y=70+Math.sin(i/21*Math.PI*3)*14+ (i%7)*1; return [x,y]; });
  return `<rect width="1280" height="480" fill="url(#dhWall)"/>${Array.from({length:32},(_,i)=>`<rect x="${i*40}" y="0" width="2" height="480" fill="#2A1A0E" opacity=".35"/>`).join('')}
  <path d="M0,74 ${bulbs.map(([x,y])=>`L${x},${y}`).join(' ')} L1280,74" stroke="#1A1208" stroke-width="2" fill="none"/>
  ${bulbs.map(([x,y],i)=>`<circle cx="${x}" cy="${y+6}" r="26" fill="url(#bulb)" opacity=".55"/><circle cx="${x}" cy="${y+6}" r="5" fill="${['#FFE08A','#FF9A7A','#9AD0FF','#B0F0A0'][i%4]}"/>`).join('')}
  <!-- stage with curtain and sign -->
  <rect x="120" y="110" width="520" height="320" fill="url(#curtain)"/>${Array.from({length:13},(_,i)=>`<path d="M${130+i*40},110 V430" stroke="#4A1010" stroke-width="6" opacity=".35"/>`).join('')}
  <rect x="200" y="124" width="360" height="56" rx="6" fill="#1A1208"/><rect x="206" y="130" width="348" height="44" rx="4" fill="none" stroke="#F2C46D" stroke-width="2"/>
  ${txt(380,160,'CHEZ BABINEAUX · BAL CAJUN',20,{mid:1,serif:1,ls:1,fill:'#F2C46D'})}
  <rect x="110" y="420" width="540" height="14" fill="#B07F55"/><rect x="110" y="434" width="540" height="46" fill="#6E4226"/>${Array.from({length:9},(_,i)=>`<rect x="${110+i*60}" y="434" width="2" height="46" fill="#3A2212" opacity=".5"/>`).join('')}
  <!-- set list poster -->
  ${poster(680,190,110,138,`${txt(735,214,'CE SOIR',11,{mid:1,ls:1.5,fill:'#9B2F2F'})}${txt(735,232,'Les Écrevisses',10.5,{mid:1})}${txt(735,246,'de la Vermilion',10.5,{mid:1})}${['20 h 30 · set 1','22 h 10 · pause','22 h 50 · set 2','minuit · do-do'].map((t,i)=>txt(694,270+i*15,t,10,{w:600})).join('')}`)}
  <!-- bar shelves -->
  <rect x="880" y="200" width="380" height="10" fill="url(#deskTop)"/><rect x="880" y="280" width="380" height="10" fill="url(#deskTop)"/>
  ${Array.from({length:14},(_,i)=>{ const x=896+i*26; return `<rect x="${x}" y="${162+(i%3)*4}" width="12" height="${38-(i%3)*4}" rx="2" fill="${['#3E6A30','#7A2020','#C9952F','#2F4F86'][i%4]}" opacity=".9"/><rect x="${x+3}" y="${154+(i%3)*4}" width="6" height="10" fill="#2A2014"/>`; }).join('')}
  ${Array.from({length:12},(_,i)=>`<rect x="${900+i*30}" y="252" width="16" height="28" rx="3" fill="#E9E3D4" opacity=".8"/>`).join('')}
  <rect y="478" width="1280" height="322" fill="url(#mFloor)"/>${floorPlanks(478,800,52)}<rect y="478" width="1280" height="20" fill="#000" opacity=".25"/>
  <ellipse cx="560" cy="640" rx="320" ry="90" fill="url(#lampPool)" opacity=".5"/>
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:429, svg:()=>`${instr('acc',300,428,dsc(BAL_D,480)*.95)}${instr('fid',400,428,dsc(BAL_D,480)*.95)}${instr('tri',500,428,dsc(BAL_D,480)*.95)}` },
  { base:540, svg:()=>`${counter(880,436,370,104)}${mug(940,436,'#F4F1E8')}${shadow(1000,436,12,2,.3,'blurS')}<rect x="994" y="400" width="12" height="36" rx="2" fill="#3E6A30"/><rect x="997" y="390" width="6" height="12" fill="#2A2014"/>` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".55" pointer-events="none"/>`; },
 npcs:[
  { id:'cedric', look:CAST.cedric.look, x:300, y:428, face:'front', size:.95 },
  { id:'violon', look:CAST.violon.look, x:400, y:428, face:'front', size:.95 },
  { id:'triangle', look:CAST.triangle.look, x:500, y:428, face:'front', size:.95 },
  { id:'tipaul', look:CAST.tipaul.look, x:1070, y:470, face:'front' },
  { id:'d1', look:CAST.dancer1.look, x:520, y:610, dance:.9, sway:16, off:0, block:[[470,598],[580,598],[584,622],[466,622]] },
  { id:'d2', look:CAST.dancer2.look, x:560, y:612, dance:.9, sway:16, off:.5 },
  { id:'d3', look:CAST.dancer3.look, x:760, y:680, dance:1.1, sway:18, off:.25, block:[[710,668],[820,668],[824,694],[706,694]] },
  { id:'d4', look:CAST.dancer4.look, x:800, y:682, dance:1.1, sway:18, off:.75 }
 ],
 hotspots:[
  { id:'affiche', name:'L\'affiche du groupe', rect:[680,190,110,138], walkTo:[735,500], face:'back',
    async look(A){ if(A.G.flags.setlist){ await A.task(SETLIST,{title:'L\'affiche',kind:'Document'}); return; }
      const r=await A.task([SETLIST,SET_Q],{title:'L\'affiche du groupe',kind:'Dossier · Document',cancel:true});
      if(r.cancelled) return;
      A.flag('setlist',true); A.score(Math.max(4,8-r.mistakes),'setlist'); A.tickClock(3);
      A.note('L\'horaire du groupe','1er set 20 h 30 – 22 h 10. Pause 22 h 10 – 22 h 50 (40 minutes). Le musée est à 10 minutes : il reste 20 minutes.','setlist'); } },
  { id:'scene', name:'La scène', rect:[110,110,540,370], walkTo:[380,548], face:'back',
    look:'Les Écrevisses de la Vermilion : un accordéon, un violon, un triangle. La musique est si entraînante que même votre enquête a envie de danser.' },
  { id:'cedric', name:'Cédric Thériot, accordéoniste', rect:[272,240,56,190], walkTo:[300,548], face:'back',
    look:'Cédric Thériot, à l\'accordéon. Une chemise rouille, un sourire nerveux, et de la boue grise séchée sur ses bottes.',
    async talk(A){ const w=who('cedric');
      if(!A.G.flags.cedricStmt){ A.flag('cedricStmt',true); A.score(3,'cedricStmt'); A.tickClock(5);
        await A.say('Entre deux chansons, Cédric descend de la scène. Il ne vous regarde pas dans les yeux.');
        await A.say('Pendant la pause? Je me suis reposé. Je suis resté ici, à la salle. La conservatrice? Je la connais un peu. Je ne lui ai pas parlé ce soir.',{who:w});
        A.note('Déclaration de Cédric','« Je me suis reposé pendant la pause. Je suis resté ici. Je ne lui ai pas parlé ce soir » (à la conservatrice).','cedric'); return; }
      const o=await A.menu('Parler à Cédric',[ {txt:'Vos bottes, elles sont pleines de boue. Pourquoi?'}, {txt:'Vous avez une camionnette?'}, {txt:'Vous connaissez Mme Gagnon?'} ]);
      if(!o) return;
      if(o.txt.startsWith('Vos')){ await A.say('J\'habite sur le bayou, à Breaux Bridge. Tout le monde a de la boue sur ses bottes, là-bas. Même le maire.',{who:w}); A.note('Les bottes de Cédric','De la boue grise sur ses bottes. Il habite sur le bayou, à Breaux Bridge.','bottes'); return; }
      if(o.txt.startsWith('Vous avez')) return A.say('La camionnette du groupe. Elle est rouge, avec des écrevisses dessus. Elle est derrière la salle. Pourquoi?',{who:w});
      return A.say('Un peu. On… se voit, des fois. Je l\'ai pas vue ce soir. Je vous l\'ai dit.',{who:w}); },
    use:{ '*':'Cédric regarde l\'objet, puis sa montre. « Le deuxième set commence. Excusez-moi. »' } },
  { id:'violon', name:'La violoneuse', rect:[372,240,56,190], walkTo:[400,548], face:'back', look:'La violoneuse joue les yeux fermés. Elle connaît chaque note, et elle ne connaît pas le mot « fausse ».', talk:'Elle joue. Elle ne s\'arrête pas pour la police. Elle ne s\'arrête pour personne.' },
  { id:'triangle', name:'Le joueur de triangle', rect:[472,240,56,190], walkTo:[500,548], face:'back', look:'Le triangle. Le plus petit instrument du groupe, et le plus fier.', talk:'« Ting! » C\'est sa réponse à toutes les questions.' },
  { id:'danseurs', name:'Les danseurs', rect:[440,420,420,280], look:'Des couples dansent le two-step. Ils tournent, ils rient. Personne ne pense au vol de la parure. C\'est le festival.' },
  { id:'tipaul', name:'Ti-Paul, le barman', rect:[1040,300,60,170], walkTo:[1060,560], face:'back',
    look:'Ti-Paul, le barman. Il sert des boissons, des conseils et des potins, dans cet ordre.',
    async talk(A){ const w=who('tipaul');
      if(A.G.flags.tipaul) return A.say('Je t\'ai tout dit, [[cher]]. Asteur, je sers les danseurs. Ils ont soif, eux.',{who:w});
      A.flag('tipaul',true); A.score(3,'tipaul'); A.tickClock(5);
      await A.say('Cédric? Pendant la pause, il est parti avec son [[char]]. La camionnette du groupe. Il est revenu juste avant le deuxième set.',{who:w});
      await A.say('Il a dit qu\'il avait oublié ses cigarettes. Il fume pas, Cédric. Jamais. [[Asteur]], tu fais ce que tu veux avec ça.',{who:w});
      A.note('Ti-Paul, le barman','Pendant la pause, Cédric est parti avec la camionnette. Il est revenu juste avant le 2e set. Il a parlé de cigarettes, mais il ne fume pas.','tipaul'); } },
  BACK_TO_MAP([560,770,160,30],[640,780])
 ],
 async onEnter(A){ if(A.G.seen.babineaux) return; A.G.seen.babineaux=1; await A.say('Chez Babineaux. L\'accordéon, le violon, le triangle, et deux cents personnes qui dansent. Le plancher tremble. Vous aussi, un peu.'); }
};

/* ---------- 10. L'hôtel Evangeline ---------- */
const HO_D=[476,.84,790,1.36];
const PEETERS_Q=[
 {t:'say',who:'Didier Peeters',text:'Je suis rentré à l\'hôtel vers vingt-deux heures. Je me suis installé au bar et j\'ai payé [[septante-cinq]] dollars. Une bouteille de vin, je l\'avoue. Je me suis couché vers minuit.'},
 {t:'say',who:'Didier Peeters',text:'Ma planche? Je l\'ai déplacée cet après-midi, pour vérifier le cadre. C\'est Madame Gagnon qui m\'a suggéré le nouvel endroit. À [[tantôt]], j\'espère.'},
 {t:'doc',kind:'Reçu',title:'Bar de l\'hôtel Evangeline',lines:['Chambre 214 — M. D. Peeters','Ouverture : 22 h 05','1 bouteille de vin rouge : 75,00 $','Fermeture : 22 h 58','Total : 75,00 $']},
 {t:'number',prompt:'Vérifiez l\'alibi avec le reçu.',rows:[
  {label:'« Septante-cinq » = combien?',ans:75,unit:'dollars',why:'En Belgique, septante = soixante-dix. Septante-cinq = soixante-quinze.'},
  {label:'Combien de minutes est-il resté au bar?',ans:53,unit:'minutes',why:'De 22 h 05 à 22 h 58.'} ]},
 {t:'choose',prompt:'Le reçu confirme-t-il qu\'il était à l\'hôtel à 22 h 18, quand la porte du musée s\'est ouverte?',opts:[
  {txt:'Oui : il était au bar de 22 h 05 à 22 h 58.',ok:true},
  {txt:'Non : le reçu ne dit pas l\'heure.',why:'Relisez le reçu : il y a l\'ouverture et la fermeture.'},
  {txt:'On ne peut pas savoir : il a payé septante dollars.',why:'Septante-cinq, et le prix ne change rien à l\'heure.'} ]}
];
ROOMS.hotel={
 name:'Hôtel Evangeline — le hall', depth:HO_D, walk:[[30,790],[120,480],[1000,480],[1160,600],[1272,790]],
 obstacles:[ [[640,520],[970,520],[978,560],[632,560]], [[1050,700],[1180,700],[1190,740],[1040,740]], [[60,690],[170,690],[176,720],[54,720]] ],
 start:{x:520,y:760,face:'back'}, entries:{door:{x:520,y:760,face:'back'}},
 bg(G){ return `<rect width="1280" height="446" fill="url(#hoWall)"/>${Array.from({length:32},(_,i)=>`<rect x="${i*40+18}" y="54" width="4" height="300" fill="#D9C69A" opacity=".12"/>`).join('')}
  <rect y="354" width="1280" height="92" fill="url(#hoWain)"/><rect y="348" width="1280" height="8" fill="#9A6E45"/><rect y="436" width="1280" height="12" fill="#1E120A"/>
  <rect width="1280" height="50" fill="#2A3A30"/><rect y="50" width="1280" height="6" fill="#C9A85A"/>
  ${[360,900].map(x=>`<path d="M${x},50 v26" stroke="#2A2014" stroke-width="3"/><ellipse cx="${x}" cy="80" rx="12" ry="6" fill="#3A2A1C"/><path d="M${x-96},84 Q${x-48},78 ${x},82 Q${x+48},78 ${x+96},84 L${x+96},88 Q${x+48},84 ${x},86 Q${x-48},84 ${x-96},88 Z" fill="#5E3A22"/><ellipse cx="${x}" cy="90" rx="10" ry="6" fill="#F4E2A8"/><ellipse cx="${x}" cy="150" rx="160" ry="90" fill="url(#lampPool)" opacity=".4"/>`).join('')}
  <!-- bar arch -->
  <path d="M70,446 V230 A100,100 0 0 1 270,230 V446 Z" fill="#2A1A0E"/><path d="M84,446 V236 A86,86 0 0 1 256,236 V446 Z" fill="#5A3A1E"/><ellipse cx="170" cy="380" rx="90" ry="70" fill="url(#lampPool)" opacity=".7"/>
  ${Array.from({length:8},(_,i)=>`<rect x="${104+i*18}" y="${300+(i%2)*6}" width="10" height="${30-(i%2)*6}" rx="2" fill="${['#3E6A30','#7A2020','#C9952F'][i%3]}"/>`).join('')}<rect x="96" y="330" width="150" height="6" fill="#7A5234"/>
  ${txt(170,218,'BAR',18,{mid:1,serif:1,ls:3,fill:'#F2C46D'})}
  <!-- key rack behind the desk -->
  <rect x="680" y="146" width="250" height="160" fill="#4A2C18"/>${Array.from({length:4},(_,r)=>Array.from({length:8},(_,c)=>{ const x=690+c*30, y=156+r*36; const k=(r*8+c)%5; return `<rect x="${x}" y="${y}" width="26" height="30" fill="#2A1A0E"/>${k?`<path d="M${x+13},${y+6} v10" stroke="#C69A44" stroke-width="2"/><rect x="${x+8}" y="${y+16}" width="10" height="8" rx="2" fill="#C69A44"/>`:''}`; }).join('')).join('')}
  ${txt(805,136,'RÉCEPTION',14,{mid:1,serif:1,ls:3,fill:'#F2C46D'})}
  <!-- staircase -->
  <path d="M1000,446 ${Array.from({length:9},(_,i)=>`L${1000+i*30},${446-i*30} L${1030+i*30},${446-i*30}`).join(' ')} L1280,176 L1280,446 Z" fill="#6E4226"/>
  ${Array.from({length:9},(_,i)=>`<rect x="${1000+i*30}" y="${440-i*30}" width="30" height="6" fill="#B07F55"/>`).join('')}
  <path d="M990,380 L1270,110" stroke="#3A2212" stroke-width="6"/>${Array.from({length:9},(_,i)=>`<path d="M${1000+i*30},${370-i*30} v${60}" stroke="#3A2212" stroke-width="3"/>`).join('')}
  ${linoFloor(446,800,90,'#D6CDB8','#5A6A62')}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:560, svg:()=>`${shadow(805,560,180,12,.45)}<rect x="640" y="440" width="330" height="118" fill="url(#doorWood)"/><rect x="630" y="430" width="350" height="14" rx="2" fill="#B07F55"/><rect x="630" y="430" width="350" height="4" fill="#E0B888"/>
    ${[0,1,2].map(i=>`<rect x="${660+i*104}" y="460" width="84" height="84" rx="2" fill="none" stroke="#3A2212" stroke-width="2" opacity=".5"/>`).join('')}
    ${shadow(900,430,12,3,.35,'blurS')}<ellipse cx="900" cy="428" rx="11" ry="3.4" fill="#C69A44"/><path d="M890,427 Q900,412 910,427 Z" fill="#E6C676"/>${papers(720,430)}` },
  { base:742, svg:()=>`${shadow(1115,742,80,10,.4)}<path d="M1050,740 L1060,660 C1062,640 1080,632 1115,632 C1150,632 1168,640 1170,660 L1180,740 Z" fill="#7A2020"/><path d="M1040,700 C1040,680 1050,676 1062,680 L1068,740 L1044,740 Z" fill="#5A1616"/><path d="M1190,700 C1190,680 1180,676 1168,680 L1162,740 L1186,740 Z" fill="#5A1616"/><rect x="1060" y="690" width="110" height="20" rx="6" fill="#9B2F2F"/>` },
  { base:722, svg:()=>`${shadow(115,722,64,8,.4)}<path d="M84,722 L74,660 H156 L146,722 Z" fill="#B8642A"/><rect x="70" y="652" width="90" height="12" rx="3" fill="#D27A3A"/>
    ${[-60,-30,0,30,60,90,120].map(a=>`<path d="M115,652 Q${115+Math.cos((a-90)*Math.PI/180)*80},${652+Math.sin((a-90)*Math.PI/180)*120-40} ${115+Math.cos((a-90)*Math.PI/180)*120},${652+Math.sin((a-90)*Math.PI/180)*140}" stroke="#3E6A30" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".5" pointer-events="none"/>`; },
 npcs:[ { id:'commis', look:CAST.commis.look, x:805, y:470, face:'front' },
  { id:'peeters', when:G=>G.flags.peetersHere, look:CAST.peeters.look, x:980, y:640, face:'left', block:[[950,628],[1010,628],[1014,654],[946,654]] } ],
 hotspots:[
  { id:'cles', name:'Le tableau des clés', rect:[680,146,250,160], look:'Les clés des chambres. Il manque la clé de la chambre 214. Son client est donc dans sa chambre. Ou il a perdu sa clé.' },
  { id:'escalier', name:'L\'escalier', poly:[[1000,446],[1270,176],[1280,446]], look:'L\'escalier vers les chambres. Les marches craquent. Personne ne peut monter ici discrètement.' },
  { id:'bar', name:'Le bar', poly:[[70,446],[70,230],[170,130],[270,230],[270,446]], walkTo:[170,500], face:'back', look:'Le bar de l\'hôtel. Une dame joue du piano. Elle joue mieux que le gardien ne surveille.' },
  { id:'palmier', name:'Le palmier', rect:[60,560,120,160], look:'Un palmier en pot. Il a vu passer plus de clients que le réceptionniste.' },
  { id:'fauteuil', name:'Le fauteuil', rect:[1040,630,150,110], look:'Un fauteuil en velours rouge. Confortable. Trop confortable pour une enquête.' },
  { id:'commis', name:'Le réceptionniste', rect:[780,300,50,170], walkTo:[805,600], face:'back',
    look:'Le réceptionniste de nuit. Il a l\'air de quelqu\'un qui sait tout et qui ne dit rien. Sauf si on demande poliment.',
    async talk(A){ const w=who('commis');
      const o=await A.menu('Parler au réceptionniste',[ {txt:'Je cherche M. Peeters, le collectionneur belge.', when:G=>!G.flags.peetersHere}, {txt:'Vous avez vu quelque chose d\'inhabituel cette nuit?'} ]);
      if(!o) return;
      if(o.txt.startsWith('Je cherche')){
        await A.say('M. Peeters? Il **vient de** monter dans sa chambre. Il **va** redescendre au bar dans dix minutes. Il redescend toujours.',{who:w});
        const r=await A.task({t:'choose',prompt:'Où est M. Peeters maintenant?',opts:[
          {txt:'Dans sa chambre : il vient de monter.',ok:true},
          {txt:'Au bar : il va descendre.',why:'« Il va descendre » = plus tard. Maintenant, il vient de monter : il est en haut.'},
          {txt:'Dans le stationnement.',why:'Le réceptionniste ne parle pas du stationnement.'} ]},{title:'Venir de ou aller?',kind:'Dossier · Grammaire',intro:'Rappel de Québec : **venir de** + infinitif = juste avant. **aller** + infinitif = bientôt.'});
        A.score(Math.max(1,3-r.mistakes),'venirde'); if(r.mistakes){ A.tickClock(30); await A.say('Vous l\'attendez au bar pendant une demi-heure. Il ne vient pas. Il était en haut. Évidemment.'); }
        else { A.tickClock(10); await A.say('Vous attendez dix minutes au pied de l\'escalier. Les marches craquent. M. Peeters descend.'); }
        A.flag('peetersHere',true); A.redraw(); return; }
      await A.say('Vers minuit moins vingt, une camionnette rouge s\'est arrêtée au stationnement. Une femme est sortie de l\'hôtel pour parler au chauffeur.',{who:w});
      await A.say('Je ne l\'ai pas bien vue. Mais elle portait un foulard vert. Très vert. On le remarque de loin.',{who:w});
      if(!A.hasNote('hotelclerk')){ A.note('Le réceptionniste de l\'hôtel','Vers 23 h 40, une camionnette rouge au stationnement. Une femme avec un foulard vert a parlé au chauffeur.','hotelclerk'); A.score(3,'hotelclerk'); } } },
  { id:'peeters', name:'Didier Peeters', when:G=>G.flags.peetersHere, rect:[952,440,56,200], walkTo:[880,690], face:'right',
    look:'Didier Peeters, collectionneur belge. Costume bleu, lunettes rondes. Il a prêté sa planche de BD à l\'exposition. Il a l\'air plus inquiet pour sa planche que pour la parure.',
    async talk(A){ const w=who('peeters');
      if(A.G.flags.peeters) return A.say('J\'ai tout dit, enquêt{eur|rice}. Je retourne au bar. La bouteille de vin n\'est pas finie, et moi non plus.',{who:w});
      const r=await A.task(PEETERS_Q,{title:'Déclaration de M. Peeters',kind:'Dossier · Déclaration',intro:'M. Peeters parle avec des nombres belges : **septante** = 70, **nonante** = 90.'});
      A.flag('peeters',true); A.score(Math.max(3,6-r.mistakes),'peeters'); A.tickClock(10);
      A.note('Déclaration de M. Peeters','Au bar de 22 h 05 à 22 h 58 (reçu : 75 $). Il a déplacé sa planche l\'après-midi. C\'est Mme Gagnon qui a suggéré le nouvel endroit.','peeters'); } },
  BACK_TO_MAP([440,770,160,30],[520,780])
 ],
 async onEnter(A){ if(A.G.seen.hotel) return; A.G.seen.hotel=1; await A.say('L\'hôtel Evangeline. Des ventilateurs tournent lentement au plafond. Au bar, quelqu\'un joue du piano. Le réceptionniste vous regarde entrer comme on regarde la pluie.'); }
};

/* ---------- the timeline board, contradictions and three recommendations (salle de briefing) ---------- */
const TIMELINE={ t:'plan', prompt:'Placez chaque événement à la bonne heure. Utilisez votre carnet.', itemsLabel:'Événements',
 slots:['20 h 00','20 h 30','22 h 10','22 h 15','22 h 18','22 h 25','22 h 32','22 h 50','23 h 40'],
 items:[
  {id:'e1',txt:'D\'abord, la conservatrice a quitté le musée.',ok:[0],why:'Le gardien et Mme Gagnon disent la même heure : 20 h.'},
  {id:'e2',txt:'Le groupe a commencé le premier set.',ok:[1],why:'Regardez l\'affiche du groupe.'},
  {id:'e3',txt:'Pendant que le groupe faisait la pause, Cédric est parti avec la camionnette.',ok:[2],why:'La pause commence à quelle heure?'},
  {id:'e4',txt:'Quelqu\'un a téléphoné au gardien.',ok:[3],why:'Regardez le journal des appels du gardien.'},
  {id:'e5',txt:'Le badge n° 3 a ouvert la porte de service.',ok:[4],why:'Regardez le registre des badges.'},
  {id:'e6',txt:'Quand il vérifiait la fenêtre, le gardien a entendu un bruit.',ok:[5],why:'Le bruit, c\'est quelques minutes après le badge.'},
  {id:'e7',txt:'Ensuite, le gardien a trouvé la vitrine vide.',ok:[6],why:'Le gardien donne l\'heure exacte dans sa déclaration.'},
  {id:'e8',txt:'Cédric est remonté sur scène.',ok:[7],why:'Le deuxième set commence à quelle heure?'},
  {id:'e9',txt:'Enfin, une femme au foulard vert a parlé au chauffeur d\'une camionnette rouge.',ok:[8],why:'Le réceptionniste de l\'hôtel donne l\'heure.'} ],
 say:'La ligne du temps est complète.', done:'Le capitaine recule d\'un pas et regarde le tableau longtemps.' };
const CONTRA=[
 {t:'choose',prompt:'Quelle déclaration est contredite par le registre des badges (badge n° 3, 22 h 18)?',opts:[
  {txt:'Mme Gagnon : « Je n\'ai pas utilisé mon badge de la soirée. »',ok:true},
  {txt:'Le gardien : « Je n\'ai vu personne. »',why:'Le registre ne dit rien sur ce que le gardien a vu.'},
  {txt:'M. Peeters : « Je suis rentré à l\'hôtel vers 22 h. »',why:'M. Peeters n\'a pas de badge du musée.'} ]},
 {t:'choose',prompt:'Quelle déclaration est contredite par Ti-Paul, le barman?',opts:[
  {txt:'Cédric : « Je suis resté ici pendant la pause. »',ok:true},
  {txt:'Mme Gagnon : « Je n\'ai parlé à personne. »',why:'Ti-Paul parle de Cédric, pas de Mme Gagnon.'},
  {txt:'Le gardien : « J\'étais en train de manger mon sandwich. »',why:'Ti-Paul n\'était pas au musée.'} ]},
 {t:'choose',prompt:'Et quelle déclaration de Mme Gagnon est contredite par le journal des appels et sa carte de visite?',opts:[
  {txt:'« Je n\'ai parlé à personne. » (Elle a appelé le gardien à 22 h 15.)',ok:true},
  {txt:'« J\'ai quitté le musée à 20 h. »',why:'Le gardien confirme 20 h. Cherchez l\'appel de 22 h 15.'},
  {txt:'« Mon chum joue de l\'accordéon. »',why:'C\'est vrai : Cédric joue de l\'accordéon.'} ]}
];
const R2_OFF=[['Agent Thibodeaux, je vous recommande','thib'],['Agente Broussard, je te recommande','broussard'],['Je recommande au sergent LeBlanc','leblanc']];
const R2_ACT=[
 ['de vérifier la camionnette du groupe','van',true,['peinture','hebert','thibReport','tipaul']],
 ['de surveiller les prêteurs sur gages','pawn',true,['perle']],
 ['de vérifier l\'appel de 22 h 15','call',true,['tel','L_tel']],
 ['de fouiller la chambre du collectionneur','room',false,['peeters','camera']],
 ['d\'interroger le gardien encore une fois','guard',false,['guard']],
 ['de chercher dans le bayou','bayou',false,['bottes','boue']] ];
function r2Answers(){ const o=[]; R2_OFF.forEach(a=>R2_ACT.forEach(b=>o.push(`${a[0]} ${b[0]}.`))); return o; }
async function RECO2(A){ const cap=who('arceneaux'), G=A.G; G.recos2=G.recos2||[];
 while(G.recos2.length<3){
  const used=G.recos2.map(r=>r.off);
  const ev=[];
  if(G.flags.perle) ev.push({id:'perle',txt:'La perle trouvée sous la vitrine (le voleur va vouloir vendre les bijoux).'});
  if(G.flags.peinture) ev.push({id:'peinture',txt:'La peinture rouge sur la borne du quai.'});
  if(G.flags.hebert) ev.push({id:'hebert',txt:'Mme Hébert : une camionnette rouge avec des écrevisses.'});
  if(G.flags.tipaul) ev.push({id:'tipaul',txt:'Ti-Paul : Cédric est parti avec la camionnette pendant la pause.'});
  if(A.hasNote('tel')) ev.push({id:'tel',txt:'L\'appel reçu par le gardien à 22 h 15.'});
  if(A.hasNote('L_tel')) ev.push({id:'L_tel',txt:'Déduction : l\'appel venait du cellulaire de Mme Gagnon.'});
  if(G.flags.peeters) ev.push({id:'peeters',txt:'M. Peeters a déplacé sa planche l\'après-midi.'});
  if(G.flags.guardStmt) ev.push({id:'guard',txt:'La déclaration du gardien.'});
  if(A.hasNote('bottes')) ev.push({id:'bottes',txt:'La boue sur les bottes de Cédric.'});
  const r=await A.task([
   {t:'tiles',prompt:`Recommandation ${G.recos2.length+1} sur 3. Chaque membre de l'équipe reçoit une seule mission.${used.length?' Déjà en mission : '+used.map(u=>({thib:'Thibodeaux',broussard:'Broussard',leblanc:'LeBlanc'})[u]).join(', ')+'.':''}`,
    tiles:['Agent Thibodeaux,','Agente Broussard,','Je recommande au sergent LeBlanc','je','vous','te','recommande','de','d\'','vérifier','surveiller','fouiller','interroger','chercher','la camionnette du groupe','les prêteurs sur gages','l\'appel de 22 h 15','la chambre du collectionneur','le gardien encore une fois','dans le bayou','.'],
    answers:r2Answers(), diagnose:recoDiagnose, min:5},
   {t:'choose',prompt:'« Sur quelle base? » Choisissez la preuve qui appuie cette recommandation.',any:true,opts:ev}
  ],{title:'Le briefing : trois recommandations',kind:'Dossier · Briefing',cancel:true,
     intro:'**Tu** avec votre partenaire (Broussard), **vous** avec l\'agent Thibodeaux, **au sergent LeBlanc** quand vous parlez de lui à l\'équipe.'});
  if(r.cancelled) return A.say('« Le tableau ne va pas se remplir tout seul, enquêt{eur|rice}. » Revenez quand vous êtes prêt{|e}.',{who:cap});
  const s=r.answers[0].txt, off=R2_OFF.find(o=>s.startsWith(o[0]))[1], act=R2_ACT.find(a=>s.includes(a[0])), evid=r.answers[1].hit.id;
  if(used.includes(off)){ await A.say('« Cette personne a déjà une mission. Choisissez quelqu\'un d\'autre. »',{who:cap}); continue; }
  if(G.recos2.some(x=>x.act===act[1])){ await A.say('« Quelqu\'un s\'occupe déjà de ça. Une autre mission, s\'il vous plaît. »',{who:cap}); continue; }
  if(!act[3].includes(evid)){ await A.say('« Sur quelle base? » Cette preuve ne justifie pas cette mission. Le capitaine attend une meilleure raison.',{who:cap}); continue; }
  G.recos2.push({off,act:act[1],good:act[2]}); A.tickClock(act[2]?15:45);
  if(act[2]) A.score(Math.max(2,6-r.mistakes),'r2_'+act[1]);
  await A.say(act[2]?'Le capitaine hoche la tête. « Bonne mission. Elle partira à l\'aube. »':'Le capitaine lève un sourcil. « Si vous le dites. Ça va prendre du temps. » La mission partira à l\'aube.',{who:cap});
 }
 return ACT2_END(A); }
async function ACT2_BOARD(A){ const w=who('arceneaux'), G=A.G;
 if(G.flags.act3) return ACT3(A);
 if(G.flags.board) return RECO2(A);
 const todo=[];
 if(!G.flags.curatorStmt) todo.push('la déclaration de la conservatrice (au musée)');
 if(!G.flags.setlist) todo.push('l\'horaire du groupe (Chez Babineaux)');
 if(!G.flags.tipaul) todo.push('le barman de Chez Babineaux');
 if(!G.flags.cedricStmt) todo.push('la déclaration du musicien');
 if(!G.flags.peeters) todo.push('la déclaration du collectionneur (à l\'hôtel)');
 if(!A.hasNote('hotelclerk')) todo.push('le réceptionniste de l\'hôtel');
 if(todo.length) return A.say('Pas encore. Il vous manque : '+todo.join(', ')+'. La voiture est au parking.',{who:w});
 await A.say('Bon. Au tableau, enquêt{eur|rice}. Une ligne du temps, de 20 h à minuit. Et ensuite, on cherche ce qui ne colle pas.',{who:w});
 const r=await A.task(TIMELINE,{title:'La ligne du temps',kind:'Dossier · Tableau',cancel:true,intro:'Les mots du temps vous aident : **d\'abord, pendant que, quand, ensuite, enfin**.'});
 if(r.cancelled) return;
 A.score(Math.max(8,15-r.mistakes),'timeline'); A.tickClock(15);
 const c=await A.task(CONTRA,{title:'Ce qui ne colle pas',kind:'Dossier · Contradictions',intro:'Une contradiction = une déclaration + une preuve qui dit le contraire.'});
 A.score(Math.max(4,10-c.mistakes*2),'contra'); G.flags.board=true;
 A.note('Contradictions','Mme Gagnon dit qu\'elle n\'a pas utilisé son badge et qu\'elle n\'a parlé à personne : faux (badge à 22 h 18, appel à 22 h 15). Cédric dit qu\'il est resté à la salle : faux (Ti-Paul).','contra');
 await A.say('Le capitaine regarde le tableau. Puis il regarde son café. Puis le tableau. « Deux personnes nous mentent. Une conservatrice et un accordéoniste. »',{who:w});
 await A.say('« Mais un mensonge, ce n\'est pas une preuve. Il nous faut plus. Donnez une mission à chaque membre de l\'équipe. »',{who:w});
 return RECO2(A); }
async function ACT2_END(A){ const w=who('arceneaux'); A.G.flags.act3=true; A.autosave();
 await A.say('Trois missions, trois agents. Il est trois heures du matin. Le capitaine éteint la lumière du tableau.',{who:w});
 await A.say('« Allez dormir trois heures. Les rapports arrivent à l\'aube. Et ne rêvez pas d\'accordéon. »',{who:w});
 await A.say('Fin de l\'acte 2. Parlez au capitaine quand vous êtes prêt{|e} pour le matin.'); }
function HINT2(G){ const b='Agente Broussard';
 if(!G.seen.curator||!G.flags.curatorStmt) return {who:b,text:'Va au musée parler à Mme Gagnon. La voiture est au parking, en bas de la salle de briefing.'};
 if(!G.flags.setlist) return {who:b,text:'Chez Babineaux, lis l\'affiche du groupe, à côté de la scène.'};
 if(!G.flags.tipaul) return {who:b,text:'Les barmans voient tout. Parle à Ti-Paul, derrière le bar de Chez Babineaux.'};
 if(!G.flags.cedricStmt) return {who:b,text:'Parle à l\'accordéoniste, sur la scène de Chez Babineaux.'};
 if(!G.flags.peeters) return {who:b,text:'À l\'hôtel Evangeline, demande M. Peeters au réceptionniste.'};
 if(!G.notes.some(n=>n.id==='hotelclerk')) return {who:b,text:'Demande au réceptionniste de l\'hôtel s\'il a vu quelque chose d\'inhabituel.'};
 if(!G.notes.some(n=>n.id==='L_badge')) return {who:b,text:'Dans ton carnet, relie la note du badge n° 3 et la liste du personnel. Coche les deux, puis « Relier ».'};
 if(!G.flags.board) return {who:b,text:'Retourne au poste et parle au capitaine. C\'est l\'heure du tableau.'};
 return {who:b,text:'Donne une mission à chacun : moi, Thibodeaux et LeBlanc. Pense aux preuves : la perle, la peinture rouge, l\'appel de 22 h 15.'}; }
