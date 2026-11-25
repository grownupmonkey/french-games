/* ===== L'enquête: Act 3 (morning reports, Breaux Bridge stakeout and bust, rights, camera image, qui / que). ===== */
const REPORTS={
 van:{who:'broussard',good:true,text:'J\'**ai trouvé** la camionnette derrière la salle. La peinture rouge **est** la même que sur la borne. Et il y **a** de la boue grise sur les pédales.',note:['Rapport : la camionnette du groupe','Même peinture rouge que sur la borne du quai. Boue grise sur les pédales.']},
 pawn:{who:'thib',good:true,text:'Nous **avons appelé** tous les prêteurs sur gages de la région. M. Fontenot, à Breaux Bridge, **a reçu** un appel : un client veut vendre des bijoux anciens ce matin, vers 10 h.',note:['Rapport : les prêteurs sur gages','Un client veut vendre des bijoux anciens chez Fontenot, à Breaux Bridge, vers 10 h.']},
 call:{who:'leblanc',good:true,text:'Nous **avons vérifié** l\'appel de 22 h 15. Il **est parti** du cellulaire de Mme Gagnon, à deux rues du musée. Pas de chez elle.',note:['Rapport : l\'appel de 22 h 15','L\'appel est parti du cellulaire de Mme Gagnon, à deux rues du musée.']},
 room:{who:'leblanc',good:false,text:'Nous **n\'avons rien trouvé** dans la chambre du collectionneur. Il **n\'a rien caché**. **Personne n\'est entré** dans sa chambre cette nuit.',note:['Écarté : la chambre du collectionneur','Rien trouvé. Il n\'a rien caché. Personne n\'est entré.']},
 guard:{who:'thib',good:false,text:'Le gardien **n\'a rien ajouté**. Il **n\'est jamais sorti** du musée, sauf pour vérifier la fenêtre du deuxième.',note:['Écarté : le gardien','Il n\'a rien ajouté. Il n\'est jamais sorti du musée.']},
 bayou:{who:'broussard',good:false,text:'Nous **n\'avons trouvé personne** dans le bayou. Juste un alligator. Il **n\'a rien vu** non plus.',note:['Écarté : le bayou','Personne dans le bayou. Juste un alligator.']}
};
async function ACT3(A){ const w=who('arceneaux'), G=A.G;
 if(G.flags.act4) return ACT4(A);
 if(G.flags.morning) return A.say('Breaux Bridge, enquêt{eur|rice}. Le client de M. Fontenot arrive vers 10 h. L\'agente Broussard vous attend dans la voiture.',{who:w});
 G.flags.morning=true; G.clock=24*60+8*60; A.tickClock(0);
 await A.say('Samedi, 8 h. Trois heures de sommeil. Le café du poste a le goût de la veille. C\'est normal : c\'est le café de la veille.');
 await A.say('Les rapports sont arrivés. Lisez-les bien. Un bon rapport donne une piste. Un mauvais rapport donne quelque chose d\'écarté. Les deux vont dans votre rapport final.',{who:w});
 const steps=[];
 (G.recos2||[]).forEach(r=>{ const R=REPORTS[r.act]; steps.push({t:'say',who:who(R.who),text:R.text});
  steps.push({t:'choose',prompt:'Ce rapport donne…',opts:[{txt:'une nouvelle piste.',ok:R.good,why:'Relisez : ils n\'ont rien trouvé. C\'est écarté, pas une piste.'},{txt:'quelque chose d\'écarté.',ok:!R.good,why:'Relisez : ils ont trouvé quelque chose de nouveau.'}]}); });
 const r=await A.task(steps,{title:'Les rapports du matin',kind:'Dossier · Rapports',intro:'Bon rapport : **passé composé** (« nous avons trouvé »). Mauvais rapport : **négation** (« nous n\'avons rien trouvé »).'});
 A.score(Math.max(2,5-r.mistakes),'reports');
 (G.recos2||[]).forEach(x=>{ const R=REPORTS[x.act]; A.note(R.note[0],R.note[1],'R_'+x.act); });
 if(!(G.recos2||[]).some(x=>x.act==='pawn')){
  await A.say('Personne n\'a surveillé les prêteurs sur gages? J\'ai appelé moi-même. M. Fontenot, à Breaux Bridge, attend un client à 10 h. Ne me remerciez pas. Enlevez-vous cinq points.',{who:w});
  A.G.score=Math.max(0,A.G.score-5); A.note('Le capitaine : les prêteurs sur gages','Un client veut vendre des bijoux chez Fontenot, à Breaux Bridge, vers 10 h.','R_pawn'); }
 await A.say('Breaux Bridge, chez Fontenot. Le client arrive vers 10 h. Allez-y avec l\'agente Broussard, et prenez le sergent LeBlanc et l\'agent Thibodeaux avec vous. Sans bruit.',{who:w});
 A.autosave(); }

/* ---------- 11a. Breaux Bridge, la rue (stakeout) ---------- */
const BB_D=[500,.8,790,1.3];
const ORDERS=[
 {t:'tiles',prompt:'Ordre 1, à la radio, pour le sergent LeBlanc (vous) : qu\'il bloque la porte de derrière.',tiles:['LeBlanc,','bloquez','bloque','bloquer','la porte de derrière','!'],answer:'LeBlanc, bloquez la porte de derrière!',
  hints:{'bloque':'Le sergent LeBlanc, on le vouvoie : bloquez.','bloquer':'À l\'impératif, on conjugue le verbe : bloquez.'}},
 {t:'tiles',prompt:'Ordre 2, pour votre partenaire Broussard (tu) : qu\'elle entre avec vous.',tiles:['Broussard,','entre','entres','entrez','avec moi','!'],answer:'Broussard, entre avec moi!',
  hints:{'entrez':'Broussard est votre partenaire : on la tutoie.','entres':'À l\'impératif, les verbes en -er perdent le « s » : entre.'}},
 {t:'tiles',prompt:'Ordre 3, pour l\'agent Thibodeaux (vous) : il ne doit laisser partir personne.',tiles:['Thibodeaux,','ne','laissez','laisse','partir','personne','pas','!'],answer:'Thibodeaux, ne laissez partir personne!',
  hints:{'pas':'Avec « personne », pas de « pas » : ne… personne.','laisse':'L\'agent Thibodeaux, on le vouvoie : laissez.'}}
];
function shopFront(x,y,w,h,fill,sign,signFill){ return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${fill})"/><rect x="${x+w-10}" y="${y}" width="10" height="${h}" fill="#000" opacity=".12"/>
  <rect x="${x-6}" y="${y-10}" width="${w+12}" height="14" fill="#5A4A3A"/>${sign?`<rect x="${x+16}" y="${y+14}" width="${w-32}" height="34" rx="3" fill="${signFill||'#2A3A30'}"/>${txt(x+w/2,y+37,sign,15,{mid:1,ls:1.5,fill:'#F4E2A8',serif:1})}`:''}`; }
ROOMS.rue={
 name:'Breaux Bridge — la rue', depth:BB_D, walk:[[20,790],[80,520],[1200,520],[1272,790]],
 obstacles:[ [[40,690],[440,690],[452,790],[30,790]], [[700,520],[1000,520],[1004,560],[696,560]] ],
 start:{x:520,y:700,face:'right'}, entries:{car:{x:520,y:700,face:'right'}, fromShop:{x:560,y:540,face:'front'}},
 bg(G){ return `<rect width="1280" height="520" fill="url(#skyMorning)"/>
  <ellipse cx="200" cy="90" rx="90" ry="22" fill="#fff" opacity=".7"/><ellipse cx="900" cy="70" rx="120" ry="24" fill="#fff" opacity=".6"/>
  <!-- the bridge over the bayou, far right -->
  <rect x="980" y="360" width="300" height="70" fill="url(#water)"/>
  <path d="M960,350 H1280 M960,330 H1280" stroke="url(#bridgeGreen)" stroke-width="8"/>${Array.from({length:9},(_,i)=>`<path d="M${970+i*36},350 L${988+i*36},330 L${1006+i*36},350" stroke="#3E6A4A" stroke-width="4" fill="none"/>`).join('')}
  <rect x="1060" y="230" width="40" height="120" fill="url(#bridgeGreen)"/><rect x="1200" y="230" width="40" height="120" fill="url(#bridgeGreen)"/><rect x="1060" y="226" width="180" height="16" fill="#3E6A4A"/>
  <!-- shop fronts -->
  ${shopFront(0,170,300,350,'shopA','BOULANGERIE')}<rect x="40" y="260" width="110" height="140" fill="url(#glassDark)"/><rect x="180" y="260" width="80" height="200" fill="#5A3A22"/>
  ${[60,84,108].map(x=>`<ellipse cx="${x+10}" cy="388" rx="12" ry="6" fill="url(#pastry)"/>`).join('')}
  ${shopFront(300,140,420,380,'shopC','FONTENOT · PRÊTS SUR GAGES','#6E1F1F')}
  <rect x="330" y="240" width="220" height="190" fill="url(#glassDark)"/><rect x="330" y="240" width="220" height="190" fill="none" stroke="#3A2A1C" stroke-width="6"/>
  <path d="M370,420 L380,300 C380,288 400,288 400,300 L404,420 Z" fill="#A0622A"/><rect x="386" y="262" width="8" height="40" fill="#2A1C10"/><rect x="430" y="330" width="60" height="44" rx="4" fill="#2A2E36"/><rect x="436" y="336" width="48" height="32" fill="#4E6E8E"/>
  <path d="M340,250 l40,0 l-40,60z" fill="#fff" opacity=".12"/>
  <rect x="590" y="260" width="96" height="260" fill="#3A2416"/><rect x="598" y="268" width="80" height="244" fill="#5A3A22"/><rect x="610" y="280" width="56" height="80" fill="url(#glassDark)"/>
  ${txt(638,320,'OUVERT',11,{mid:1,ls:1,fill:'#E8F6EC'})}<rect x="660" y="400" width="10" height="6" rx="2" fill="url(#steel)"/>
  ${shopFront(720,190,260,330,'shopB','QUINCAILLERIE')}<rect x="750" y="270" width="200" height="140" fill="url(#glassDark)"/>
  <!-- sidewalk and road -->
  <rect y="510" width="1280" height="60" fill="url(#sidewalk)"/><rect y="510" width="1280" height="4" fill="#E0DAD0"/>
  ${Array.from({length:16},(_,i)=>`<rect x="${i*80}" y="514" width="2" height="56" fill="#8C867A" opacity=".5"/>`).join('')}
  <rect y="570" width="1280" height="230" fill="url(#road)"/><rect y="570" width="1280" height="8" fill="#4A4C50"/>
  <path d="M0,690 H1280" stroke="#E8D88A" stroke-width="4" stroke-dasharray="40 30"/>
  <rect width="1280" height="800" fill="url(#vigTop)" opacity=".5"/>`; },
 props:[
  { base:560, svg:G=>`${shadow(850,560,170,12,.45)}<path d="M700,540 V430 C700,410 712,400 740,400 H930 C960,400 990,420 1000,450 L1004,540 Z" fill="url(#vanRed)"/>
    <path d="M940,410 C962,412 984,430 992,456 H940 Z" fill="url(#glassDark)"/><rect x="720" y="414" width="190" height="40" rx="4" fill="url(#glassDark)" opacity=".85"/>
    ${[760,820,880].map(x=>`<g transform="translate(${x} 488)"><ellipse rx="16" ry="9" fill="#F2C46D"/><path d="M-16,0 l-8,-6 M-16,0 l-8,6 M16,0 l7,-7 M16,0 l7,7" stroke="#F2C46D" stroke-width="3"/><circle cx="10" cy="-3" r="2" fill="#2A2014"/></g>`).join('')}
    <rect x="700" y="526" width="304" height="14" fill="#2A2E36"/>${[750,950].map(x=>`<circle cx="${x}" cy="540" r="22" fill="#16181C"/><circle cx="${x}" cy="540" r="10" fill="url(#steel)"/>`).join('')}` },
  { base:800, svg:()=>`${shadow(238,790,220,14,.5)}
    <path d="M40,700 C44,668 70,660 110,656 L160,620 C178,606 196,600 230,600 H318 C346,600 362,610 380,626 L410,656 C432,660 446,672 448,700 L450,760 H36 Z" fill="url(#carGrey)"/>
    <path d="M168,624 C182,612 196,608 228,608 H252 V656 H124 Z" fill="url(#glassDark)"/><path d="M262,608 H316 C340,608 352,616 368,632 L392,656 H262 Z" fill="url(#glassDark)"/>
    <path d="M40,740 H450 V760 H36 Z" fill="#2A2E36"/>${[120,370].map(x=>`<circle cx="${x}" cy="758" r="32" fill="#16181C"/><circle cx="${x}" cy="758" r="16" fill="url(#steel)"/>`).join('')}` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".35" pointer-events="none"/>`; },
 npcs:[ { id:'broussard', look:CAST.broussard.look, x:600, y:690, face:'left', block:[[570,678],[630,678],[634,702],[566,702]] } ],
 hotspots:[
  { id:'boutique', name:'Chez Fontenot', rect:[300,140,420,380], walkTo:[560,540], face:'back',
    look:'« Fontenot, prêts sur gages ». Des guitares, une télévision, un accordéon dans la vitrine. Et la camionnette rouge garée juste devant.',
    async hand(A){ if(!A.G.flags.bust) return A.say('Pas encore. Si vous entrez maintenant, le client va vous voir. Attendez le signal de M. Fontenot. Parlez à Broussard.',{who:who('broussard')}); return A.go('boutique','door',0); } },
  { id:'camionnette', name:'La camionnette rouge', rect:[700,400,304,160], walkTo:[680,600], face:'right',
    async look(A){ await A.say('La camionnette rouge du groupe, avec ses autocollants d\'écrevisses. Une éraflure jaune sur le pare-chocs : la borne du quai.');
      if(A.G.flags.camImage) await A.say('Le siège du passager est vide. La femme au foulard vert est partie.'); } },
  { id:'pont', name:'Le pont', rect:[960,220,320,210], look:'Le vieux pont de Breaux Bridge, sur le bayou. La ville a un pont dans son nom. Elle en est fière.' },
  { id:'boulangerie', name:'La boulangerie', rect:[0,170,300,350], look:'Une boulangerie. L\'odeur des beignets traverse la rue. C\'est de la torture, et ce n\'est pas légal.' },
  { id:'broussard', name:'Agente Broussard', poly:[[566,460],[634,460],[640,700],[560,700]], walkTo:[520,700], face:'right',
    look:'L\'agente Broussard, au volant de la voiture banalisée. Elle mange un beignet. Elle ne vous en propose pas.',
    async talk(A){ const w=who('broussard');
      if(A.G.flags.bust) return A.say('Il est dedans, avec les bijoux. Allons-y.',{who:w});
      await A.say('On attend le signal de M. Fontenot. LeBlanc est derrière la boutique, Thibodeaux au coin de la rue. Tu donneras les ordres à la radio.',{who:w});
      A.G.clock=Math.max(A.G.clock,24*60+10*60+5); A.tickClock(0);
      await A.say('10 h 05. La radio grésille. C\'est M. Fontenot, tout bas : « Il **vient d\'**entrer! Il **va** me montrer les bijoux. »',{who:who('fontenot')});
      const r=await A.task([
        {t:'choose',prompt:'Où est le client maintenant?',opts:[{txt:'Dans la boutique : il vient d\'entrer.',ok:true},{txt:'Dans la rue : il va entrer.',why:'« Il vient d\'entrer » = c\'est fait, juste avant. Il est dans la boutique.'}]},
        ...ORDERS ],{title:'L\'opération',kind:'Dossier · Radio',intro:'Rappel de Montréal : l\'**impératif**. **Tu** : entre (sans « s »). **Vous** : entrez. Négatif : **ne** laissez partir **personne**.'});
      A.score(Math.max(1,3-Math.min(2,r.mistakes)),'venirde2'); A.score(Math.max(4,9-r.mistakes),'orders'); A.flag('bust',true);
      await A.say('« Bien reçu! » LeBlanc bloque la porte de derrière. Thibodeaux surveille la rue. Broussard ouvre la porte de la boutique.');
      return A.go('boutique','bust',2); } },
  { id:'voiture', name:'La voiture banalisée', poly:[[40,600],[450,600],[450,770],[36,770]], walkTo:[520,720], face:'left',
    async hand(A){ if(A.G.flags.bust&&!A.G.flags.act4) return A.say('Pas avant d\'avoir fini ici. Les bijoux, les droits, le téléphone.',{who:who('broussard')});
      return A.go('carte',null,0); } }
 ],
 async onEnter(A){ if(A.G.seen.rue) return; A.G.seen.rue=1;
  await A.say('Breaux Bridge, la capitale mondiale de l\'écrevisse. Un samedi matin tranquille. Trop tranquille, dirait le capitaine. Il dit ça tout le temps.');
  await A.say('La camionnette rouge du groupe est garée devant chez Fontenot. Broussard l\'a vue aussi. Elle mâche son beignet plus lentement.'); }
};

/* ---------- 11b. Chez Fontenot, la boutique ---------- */
const RIGHTS=[
 {t:'tiles',prompt:'Lisez ses droits au suspect. Phrase 1.',tiles:['Vous avez','Tu as','le droit','de','à','garder le silence','.'],answer:'Vous avez le droit de garder le silence.',
  hints:{'Tu as':'On vouvoie toujours un suspect. C\'est la loi, et c\'est poli.','à':'Le droit **de** + infinitif : de garder.'}},
 {t:'tiles',prompt:'Phrase 2.',tiles:['Tout ce que','vous direz','pourra être utilisé','contre vous','.'],answer:'Tout ce que vous direz pourra être utilisé contre vous.'},
 {t:'tiles',prompt:'Phrase 3.',tiles:['Vous avez','le droit','à','de','un avocat','.'],answer:'Vous avez le droit à un avocat.',hints:{'de':'Le droit **à** + nom : à un avocat.'}}
];
const CAM_IMG=`<svg viewBox="0 0 400 240" role="img" aria-label="Image de la caméra"><rect width="400" height="240" fill="#4A5656"/>
 <rect x="196" y="14" width="196" height="150" fill="#2A2018"/><rect x="202" y="20" width="184" height="138" fill="#C9D8D8"/><rect x="202" y="110" width="184" height="48" fill="#8C8A84"/>
 <path d="M208,150 V78 C208,66 218,58 236,58 H340 C362,58 376,72 382,90 L384,150 Z" fill="#9A4A40"/><path d="M290,62 H342 C362,62 376,76 382,96 V124 H290 Z" fill="#3A4A4A"/>
 <ellipse cx="330" cy="82" rx="11" ry="12" fill="#D9B89A"/><path d="M318,80 C318,66 342,66 342,80 L343,94 H337 L337,80 C330,76 326,76 322,80 L322,94 H317 Z" fill="#4A3A2C"/>
 <path d="M316,96 C322,104 338,104 344,96 L346,106 H314 Z" fill="#3EAA5E"/><path d="M336,100 L340,118 L332,118 L330,102 Z" fill="#2E8A4A"/><path d="M314,106 H346 V114 H314 Z" fill="#6E4A62"/>
 <rect x="0" y="170" width="400" height="70" fill="#6E6258"/><rect x="0" y="164" width="400" height="10" fill="#9C8A78"/>
 <ellipse cx="110" cy="44" rx="15" ry="17" fill="#D9B89A"/><path d="M95,40 C95,24 125,24 125,40 L126,50 H94 Z" fill="#6B4428"/><path d="M86,168 L88,64 C88,58 132,58 132,64 L134,168 Z" fill="#9A5A3A"/>
 <rect x="96" y="58" width="28" height="6" fill="#E9E3D8"/>
 <text x="10" y="232" font-family="monospace" font-size="12" fill="#C9F0B0">CAM 1 · SAM 10:06:14</text>
 <text x="294" y="34" font-family="monospace" font-size="10" fill="#4A5656">vitrine</text></svg>`;
const CAMERA_Q=[
 {t:'choose',prompt:'Comparez la femme dans la camionnette et Cédric (au comptoir).',opts:[{txt:'Elle est plus petite que lui.',ok:true},{txt:'Elle est plus grande que lui.',why:'Regardez la hauteur de sa tête dans la camionnette, et la hauteur de Cédric.'},{txt:'Elle est aussi grande que lui.',why:'Comparez bien : elle est assise, mais sa tête est beaucoup plus basse.'}]},
 {t:'choose',prompt:'Qu\'est-ce qu\'elle porte?',opts:[{txt:'Un foulard vert.',ok:true},{txt:'Une casquette rouge.',why:'Regardez autour de son cou.'},{txt:'Des lunettes de soleil.',why:'Regardez autour de son cou, pas ses yeux.'}]},
 {t:'tiles',prompt:'À qui est ce foulard? Écrivez une phrase avec un possessif.',tiles:['C\'est','son','sa','ses','foulard','.'],answer:'C\'est son foulard.',hints:{'sa':'« Foulard » est masculin : son foulard.','ses':'Un seul foulard : son, pas ses.'}}
];
const QUI_QUE=[
 {t:'tiles',prompt:'Pour le mandat : identifiez l\'accomplice avec « qui ».',tiles:['C\'est','la conservatrice','qui','que','a téléphoné','au gardien','à 22 h 15','.'],answer:'C\'est la conservatrice qui a téléphoné au gardien à 22 h 15.',
  hints:{'que':'Après « que », il faut un sujet. Ici, c\'est la conservatrice qui fait l\'action : « qui » + verbe.'}},
 {t:'tiles',prompt:'Maintenant avec « que ».',tiles:['C\'est','la femme','qui','que','le réceptionniste','a vue','avec Cédric','.'],answer:'C\'est la femme que le réceptionniste a vue avec Cédric.',
  hints:{'qui':'Après « qui », il y a un verbe. Ici, il y a un sujet (le réceptionniste) : « que ».'}}
];
ROOMS.boutique={
 name:'Chez Fontenot — la boutique', depth:[480,.84,790,1.34], walk:[[30,790],[110,480],[1170,480],[1272,790]],
 obstacles:[ [[560,540],[1040,540],[1048,580],[552,580]] ],
 start:{x:200,y:720,face:'right'}, entries:{door:{x:200,y:720,face:'right'}, bust:{x:420,y:640,face:'right'}},
 bg(G){ return `<rect width="1280" height="446" fill="url(#shopWall)"/><rect width="1280" height="46" fill="#4A3A2C"/><rect y="46" width="1280" height="6" fill="#7A6450"/>
  <!-- shop window and door on the left wall -->
  <rect x="40" y="110" width="220" height="250" fill="#3A2A1C"/><rect x="50" y="120" width="200" height="230" fill="url(#skyMorning)"/><rect x="50" y="250" width="200" height="100" fill="#8C8A84"/>
  <path d="M60,320 V280 C60,272 70,266 84,266 H170 C186,266 196,274 200,286 L202,320 Z" fill="url(#vanRed)"/><rect x="70" y="272" width="70" height="20" fill="#3A4A4A"/>
  ${G.flags.camImage?'':`<circle cx="104" cy="278" r="5" fill="#C9B8A0"/><path d="M97,286 C101,290 107,290 111,286 L112,292 H96 Z" fill="#3FA36B"/>`}
  <path d="M60,130 l60,0 l-60,90z" fill="#fff" opacity=".18"/>
  <!-- the security camera above the window -->
  <path d="M276,96 h22" stroke="#2A2E36" stroke-width="4"/><rect x="290" y="88" width="40" height="18" rx="4" fill="#3A404C"/><circle cx="330" cy="97" r="6" fill="#1A1D24"/><circle cx="324" cy="92" r="2" fill="#E04A3A"/>
  <!-- wall of pawned treasures -->
  ${[[360,120],[420,128],[480,118]].map(([x,y],i)=>`<g transform="translate(${x} ${y})"><path d="M0,140 L8,40 C8,26 30,26 30,40 L36,140 Z" fill="${['#A0622A','#C9952F','#5E3A22'][i]}"/><rect x="14" y="-6" width="8" height="50" fill="#2A1C10"/><circle cx="18" cy="96" r="7" fill="#2A1C10"/></g>`).join('')}
  <rect x="560" y="120" width="520" height="10" fill="url(#deskTop)"/><rect x="560" y="220" width="520" height="10" fill="url(#deskTop)"/><rect x="560" y="320" width="520" height="10" fill="url(#deskTop)"/>
  <g transform="translate(600 80)"><path d="M0,40 C20,20 70,18 110,28 C140,34 170,30 190,38 L188,44 C150,40 120,46 80,44 C40,44 20,48 0,46 Z" fill="#4E6A3A"/><path d="M110,28 l6,-6 l4,6 l6,-6 l4,6" stroke="#3A5228" stroke-width="2" fill="none"/><circle cx="20" cy="36" r="2.4" fill="#F2C46D"/></g>
  <rect x="820" y="170" width="70" height="50" rx="4" fill="#2A2E36"/><rect x="826" y="176" width="58" height="38" fill="#4E6E8E"/>
  <rect x="920" y="174" width="60" height="46" rx="4" fill="#B8443A"/><rect x="926" y="180" width="18" height="34" fill="#E9E3D4" opacity=".6"/>${[0,1,2,3].map(i=>`<path d="M${948+i*7},180 v34" stroke="#2A1C10" stroke-width="1.6"/>`).join('')}
  <rect x="600" y="270" width="80" height="50" rx="6" fill="#C9A878"/><circle cx="640" cy="295" r="16" fill="#3A2A1C"/><rect x="700" y="276" width="110" height="44" rx="3" fill="#2A2E36"/>
  ${[0,1,2,3,4].map(i=>`<rect x="${840+i*44}" y="${280-i%2*6}" width="30" height="${40+i%2*6}" rx="3" fill="${['#7A4E6E','#2F4F86','#9C6A1C','#3E6A30','#7A2020'][i]}"/>`).join('')}
  <rect y="436" width="1280" height="12" fill="#2A2014"/>
  ${linoFloor(446,800,70,'#B8A888','#A39274')}
  <rect width="1280" height="800" fill="url(#vigTop)" opacity=".6"/>`; },
 props:[
  { base:580, svg:G=>`${shadow(800,580,250,12,.45)}<rect x="560" y="470" width="480" height="108" fill="url(#doorWood)"/><rect x="552" y="456" width="496" height="16" fill="url(#glassCase)" opacity=".9"/>
    <rect x="576" y="478" width="448" height="70" fill="url(#glassCase)" opacity=".35"/><path d="M580,480 l40,0 l-30,60z" fill="#fff" opacity=".2"/>
    ${[620,700,780,860,940].map((x,i)=>`<ellipse cx="${x}" cy="530" rx="16" ry="5" fill="#E6C676" opacity=".7"/>`).join('')}
    ${G.flags.moitie?'':`${shadow(800,458,60,4,.35,'blurS')}<polygon points="742,456 858,456 864,450 748,450" fill="#3E4E86"/><path d="M760,452 C780,446 820,446 840,452" stroke="#E6C676" stroke-width="2.4" fill="none"/>${[766,784,800,816,834].map(x=>`<circle cx="${x}" cy="450" r="3" fill="url(#pearlG)"/>`).join('')}<circle cx="852" cy="451" r="3.4" fill="#9B2F2F"/>`}
    ${G.flags.photoBijoux&&!G.flags.moitie?evidenceTent(890,458,4,.9):''}` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".4" pointer-events="none"/>`; },
 npcs:[
  { id:'fontenot', look:CAST.fontenot.look, x:900, y:500, face:'front' },
  { id:'cedric', when:G=>!G.flags.act4, look:CAST.cedric.look, x:640, y:610, face:'left', block:[[610,598],[670,598],[674,622],[606,622]] },
  { id:'broussard', look:CAST.broussard.look, x:300, y:660, face:'right', block:[[270,648],[330,648],[334,672],[266,672]] }
 ],
 hotspots:[
  { id:'bijoux', name:'Les bijoux', when:G=>!G.flags.moitie, rect:[740,436,128,26], walkTo:[800,620], face:'back',
    look:'Sur un tissu de velours bleu : un bracelet, une broche et une boucle d\'oreille. La moitié de la parure d\'Évangéline. Il manque le collier et l\'autre boucle.',
    async hand(A){ if(!A.G.wearing.gants) return A.fail({art:FAIL_ART.prints,text:'Bravo. Vos empreintes sont maintenant sur les bijoux, à côté de celles du voleur. L\'avocat de Cédric vous remercie.',lesson:'Procédure : il faut mettre des gants avant de toucher une preuve.'});
      if(!A.G.flags.photoBijoux) return A.say('Il faut d\'abord photographier les bijoux. Vous connaissez la règle de M. Landry.');
      A.flag('moitie',true); A.give('moitie'); A.score(2,'moitie'); A.redraw();
      return A.say('Avec vos gants, vous mettez les bijoux dans un sachet. Étiquette : « Pièce n° 3. La moitié de la parure. »',{icon:ITEMS.moitie.icon}); },
    use:{ appareil:async A=>{ if(A.G.flags.photoBijoux) return A.say('Déjà photographiés. Les bijoux sont photogéniques. Plus que le suspect.');
      A.flag('photoBijoux',true); A.score(2,'photoBijoux'); A.redraw(); return A.say('Clic. Cavalier numéro 4.'); } } },
  { id:'cedric', name:'Cédric Thériot', when:G=>!G.flags.act4, poly:[[606,380],[674,380],[680,616],[600,616]], walkTo:[540,640], face:'right',
    look:'Cédric Thériot. Il était en train de vendre les bijoux quand vous êtes arrivé{|e}. Il ne joue plus de l\'accordéon. Il regarde ses bottes.',
    async talk(A){ const w=who('cedric');
      if(!A.G.flags.rights){ const r=await A.task(RIGHTS,{title:'Les droits du suspect',kind:'Dossier · Arrestation',intro:'Avant tout, on lit ses droits au suspect. En Louisiane comme ailleurs, c\'est la loi.'});
        A.flag('rights',true); A.score(Math.max(5,10-r.mistakes),'rights');
        return A.say('Cédric Thériot, vous êtes en état d\'arrestation pour le vol de la parure d\'Évangéline. Cédric hoche la tête. Il ne dit rien. Il a écouté ses droits.'); }
      const o=await A.menu('Parler à Cédric',[ {txt:'Où est l\'autre moitié de la parure?'}, {txt:'Qui était dans la camionnette avec vous?'}, {txt:'Donnez-moi votre téléphone.', when:G=>!G.flags.texto} ]);
      if(!o) return;
      if(o.txt.startsWith('Où')) return A.say('Je sais pas de quoi vous parlez. J\'ai le droit de garder le silence. Vous me l\'avez dit.',{who:w});
      if(o.txt.startsWith('Qui')) return A.say('Personne. Je suis venu tout seul. Toujours tout seul. C\'est ma vie, ça.',{who:w});
      A.flag('texto',true); A.score(2,'texto');
      await A.say('Broussard prend le téléphone de Cédric. Un message, reçu ce matin à 8 h 12 :');
      await A.say('« Garde ta moitié cachée. Moi, je pars demain soir à minuit, du camp de pêche. Ne m\'appelle plus. — G. »',{who:'Message'});
      A.note('Le texto de « G. »','« Garde ta moitié cachée. Moi, je pars demain soir à minuit, du camp de pêche. Ne m\'appelle plus. — G. »','texto'); },
    use:{ '*':'Cédric regarde l\'objet. « J\'ai le droit de garder le silence. Même devant ça. »' } },
  { id:'camera', name:'La caméra de surveillance', rect:[276,82,64,30], walkTo:[300,560], face:'back',
    async look(A){ if(A.G.flags.camImage){ await A.task({t:'say',text:'L\'image de 10 h 06 : Cédric au comptoir, et une femme au foulard vert dans la camionnette.'},{title:'La caméra',kind:'Document',docs:[CAM_IMG]}); return; }
      await A.say('M. Fontenot vous montre l\'image de sa caméra, prise à 10 h 06. On voit Cédric au comptoir. Et par la vitrine, quelqu\'un dans la camionnette.');
      const r=await A.task(CAMERA_Q,{title:'L\'image de la caméra',kind:'Dossier · Image',docs:[CAM_IMG],intro:'Rappel de Dakar : **plus… que**, **aussi… que**, et les possessifs **son / sa / ses**.'});
      A.flag('camImage',true); A.score(Math.max(4,8-r.mistakes),'camImage'); A.redraw();
      A.note('L\'image de la caméra','10 h 06 : une femme plus petite que Cédric, avec un foulard vert, attend dans la camionnette. Elle est partie avant votre arrivée.','camImage'); } },
  { id:'fontenot', name:'M. Fontenot', rect:[870,320,60,180], walkTo:[900,620], face:'back',
    look:'M. Fontenot, prêteur sur gages depuis quarante ans. Il a tout acheté, tout vendu, et rien oublié.',
    async talk(A){ const w=who('fontenot');
      if(!A.G.flags.camImage) return A.say('Il est arrivé avec les bijoux à 10 h 05. Quelqu\'un l\'attendait dans la camionnette. Regardez ma caméra, au-dessus de la vitrine.',{who:w});
      return A.say('Quarante ans de métier, et c\'est la première fois que j\'aide la police. Ma mère serait fière. Ou surprise.',{who:w}); } },
  { id:'broussard', name:'Agente Broussard', poly:[[266,420],[334,420],[340,668],[260,668]], walkTo:[380,680], face:'left',
    look:'L\'agente Broussard. Elle garde la porte. Personne ne sort sans son permis. Et elle ne donne pas de permis.',
    async talk(A){ const w=who('broussard'), G=A.G;
      if(!G.flags.rights) return A.say('Ses droits d\'abord, cher. Sinon, tout ce qu\'on trouve ici, son avocat le jette à la poubelle.',{who:w});
      if(!G.flags.moitie||!G.flags.texto||!G.flags.camImage) return A.say('Il nous faut les bijoux dans un sachet, son téléphone, et l\'image de la caméra de M. Fontenot.',{who:w});
      if(!G.flags.quique){ await A.say('Le capitaine veut un mandat contre « G. » avant minuit demain. Il faut écrire pour qui, et pourquoi. Avec des phrases précises.',{who:w});
        const r=await A.task(QUI_QUE,{title:'Pour le mandat',kind:'Dossier · Identification',intro:'Rappel d\'Acadie : **qui** + verbe, **que** + sujet.'});
        A.flag('quique',true); A.score(Math.max(5,10-r.mistakes),'quique');
        A.note('« G. », c\'est Geneviève Gagnon','C\'est la conservatrice qui a téléphoné au gardien à 22 h 15. C\'est la femme que le réceptionniste a vue avec Cédric.','quique'); }
      return ACT3_END(A); } },
  { id:'porte', name:'La porte', rect:[40,110,220,250], walkTo:[200,700], face:'left',
    async hand(A){ return LEAVE_SHOP(A); }, async onWalk(A){ return LEAVE_SHOP(A); } }
 ],
 async onEnter(A){ if(A.G.seen.boutique) return; A.G.seen.boutique=1;
  await A.say('Le voleur **était en train de** vendre les bijoux quand vous **êtes arrivé{|e}**. Il a l\'air presque soulagé. Presque.');
  await A.say('Sur le comptoir, sur un velours bleu : la moitié de la parure d\'Évangéline. M. Fontenot recule lentement, les mains en l\'air. Par habitude.'); }
};
async function LEAVE_SHOP(A){
 if(A.G.flags.bust&&!A.G.flags.rights) return A.fail({art:FAIL_ART.rights,text:'Vous emmenez Cédric à la voiture sans lui lire ses droits. Son avocat, lui, ne les oubliera pas. Il est déjà en route, avec un sourire.',lesson:'Procédure : il faut lire ses droits au suspect avant de l\'emmener.'});
 return A.go('rue','fromShop',0); }
async function ACT3_END(A){ const w=who('arceneaux'); if(A.G.flags.act4) return A.say('Au poste, enquêt{eur|rice}. Le capitaine attend.',{who:who('broussard')});
 A.G.flags.act4=true; A.tickClock(30); A.autosave();
 await A.say('Le capitaine, à la radio : « Un mandat pour la conservatrice? Il me faut votre rapport d\'abord. Écrit. En français. Avec des verbes. »',{who:w});
 await A.say('« Et ramenez Cédric. On va avoir une petite conversation. Moi, je parle. Vous, vous montrez les preuves. »',{who:w});
 await A.say('Fin de l\'acte 3. Retournez au poste avec la pièce n° 3. Votre partie est sauvegardée.'); }
function HINT3(G){ const b='Agente Broussard';
 if(!G.flags.morning) return {who:b,text:'Parle au capitaine au briefing : les rapports du matin sont arrivés.'};
 if(G.roomId!=='rue'&&G.roomId!=='boutique'&&!G.flags.bust) return {who:b,text:'Va à Breaux Bridge : prends la voiture au parking, puis choisis Breaux Bridge sur la carte.'};
 if(!G.flags.bust) return {who:b,text:'Parle-moi. On attend le signal de M. Fontenot.'};
 if(!G.flags.rights) return {who:b,text:'Lis ses droits à Cédric : parle-lui.'};
 if(!G.flags.photoBijoux) return {who:b,text:'Les bijoux sont une preuve. Photo d\'abord.'};
 if(!G.flags.moitie) return {who:b,text:'Ramasse les bijoux avec la main. Tu as tes gants.'};
 if(!G.flags.camImage) return {who:b,text:'Regarde la caméra au-dessus de la vitrine.'};
 if(!G.flags.texto) return {who:b,text:'Demande son téléphone à Cédric.'};
 return {who:b,text:'Parle-moi. On prépare le mandat.'}; }
