/* ===== L'enquête: the prologue at the police station (bureau, salle de briefing, cafétéria, salle des preuves). ===== */
const STATION_WALK=[[40,790],[140,470],[1240,470],[1272,790]];
const ST_DEPTH=[470,.84,790,1.36];

/* ---------- 1. Le bureau des enquêtes (tutorial) ---------- */
ROOMS.bureau={
 name:'Poste — bureau des enquêtes', depth:ST_DEPTH, walk:STATION_WALK,
 obstacles:[ [[510,600],[830,600],[838,650],[502,650]], [[868,456],[962,456],[966,480],[864,480]] ],
 start:{x:300,y:650,face:'right'}, entries:{fromBriefing:{x:1130,y:492,face:'front'}},
 bg(G){ return `${interior({fluo:[300,820]})}
  ${nightWindow(90,112,190,196,5)}
  <!-- the journey corkboard: six trips, one investigator -->
  ${shadow(476,300,130,6,.22,'blurS')}<rect x="356" y="118" width="240" height="172" fill="#6E4A2C"/><rect x="364" y="126" width="224" height="156" fill="url(#cork)"/>
  ${[[378,140,'#9FC3E0'],[452,134,'#E9B49A'],[524,142,'#B9D6B0'],[388,206,'#F2D28A'],[462,212,'#C9C1E6'],[534,204,'#E8A0A0']].map(([x,y,c],i)=>`<g transform="rotate(${[-4,3,-2,5,-3,2][i]} ${x+22} ${y+26})"><rect x="${x}" y="${y}" width="44" height="52" fill="#FFFDF6"/><rect x="${x+4}" y="${y+4}" width="36" height="34" fill="${c}"/><path d="M${x+4},${y+30} l10,-10 l8,6 l8,-9 l10,13 v4 h-36z" fill="#000" opacity=".18"/></g>`).join('')}
  <path d="M400,140 L474,134 L546,142 L410,206 L484,212 L556,204" stroke="#B8443A" stroke-width="1.6" fill="none"/>
  ${[[400,140],[474,134],[546,142],[410,206],[484,212],[556,204]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" fill="#B8443A"/><circle cx="${x-1}" cy="${y-1}" r="1.2" fill="#fff" opacity=".6"/>`).join('')}
  ${wallClock(700,120,10,G.clock%60)}
  ${door(1080,206,110,232,{label:'BRIEFING',glass:true})}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:520, svg:()=>chairBack(668,524,.95) },
  { base:648, svg:()=>`${desk(512,532,316,110)}<ellipse cx="770" cy="560" rx="110" ry="30" fill="url(#lampPool)"/>${monitor(612,540)}${papers(668,544)}${mug(714,544,'#2A9D8F')}${deskLamp(786,542)}` },
  { base:478, svg:()=>cabinet(872,334,88,142) }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".55" pointer-events="none"/>`; },
 npcs:[ { id:'broussard', look:CAST.broussard.look, x:1000, y:560, face:'front', block:[[970,548],[1030,548],[1034,574],[966,574]] } ],
 hotspots:[
  { id:'fenetre', name:'La fenêtre', rect:[80,102,210,216], look:'Lafayette, la nuit. Toute la ville danse pour le festival. Vous, vous regardez la ville danser. Par la fenêtre.' },
  { id:'liege', name:'Le tableau de liège', rect:[356,118,240,172], walkTo:[476,500], face:'back',
    look:'Six photos de votre grand voyage : Québec, Montréal, l\'Acadie, Dakar, la Bretagne, Bruxelles. Un fil rouge les relie. Vous avez beaucoup voyagé. Maintenant, vous restez assis{|e}.' },
  { id:'horloge', name:'L\'horloge', ell:[700,120,24,24], async look(A){ return A.say(`Il est ${clockNow(A)}. Le soir le plus calme de l'année, d'après le capitaine. Le capitaine se trompe souvent.`); } },
  { id:'ordi', name:'L\'ordinateur', rect:[574,470,76,72], walkTo:[620,676], face:'back',
    look:'Votre ordinateur. Deux cent quatorze courriels non lus. Ils attendront. Ils attendent toujours.', hand:'Vous ouvrez vos courriels, puis vous les refermez. Certaines enquêtes peuvent attendre.' },
  { id:'tasse', name:'La tasse de café', rect:[702,512,26,34], walkTo:[700,676], face:'back',
    look:'Votre tasse. Le café est froid depuis 19 h. Il était déjà froid à 19 h.', hand:'Vous buvez une gorgée. Vous le regrettez immédiatement. C\'est une tradition au poste.' },
  { id:'tiroir', name:'Le tiroir du bureau', rect:[722,560,94,78], walkTo:[770,680], face:'back',
    async look(A){ return A.say(A.G.flags.tools?'Le tiroir est vide, à part un trombone et une vieille gomme. L\'essentiel.':'Le tiroir du bureau. Il contient votre matériel d\'enquête : des gants, un appareil photo, des sachets à preuves.'); },
    async hand(A){ if(A.G.flags.tools) return A.say('Il ne reste qu\'un trombone. Il peut rester là.');
      A.flag('tools',true); A.give('gants'); A.give('appareil'); A.give('sachets'); A.score(3,'tools');
      await A.say('Vous prenez vos gants, votre appareil photo et vos sachets à preuves. Ils sont maintenant dans votre inventaire.',{icon:ITEMS.sachets.icon});
      return A.say('Pour les voir, ouvrez l\'inventaire dans la barre d\'icônes (la mallette). Pour utiliser un objet sur quelque chose, choisissez-le, puis cliquez sur la chose.'); } },
  { id:'bureau', name:'Votre bureau', rect:[512,532,200,110], walkTo:[600,676], face:'back',
    look:'Votre bureau. Propre. Ça ne durera pas.', hand:'Vous rangez un crayon. Le bureau est maintenant parfait. Vous avez trois jours d\'expérience.' },
  { id:'classeur', name:'Le classeur', rect:[872,334,88,142], walkTo:[900,500], face:'back',
    look:'Un classeur métallique. Les vieilles enquêtes du poste dorment dedans. Certaines ronflent.', hand:'Il est fermé à clé. Le capitaine a la clé. Le capitaine a toutes les clés.' },
  { id:'broussard', name:'Agente Broussard', poly:[[966,330],[1034,330],[1040,570],[960,570]], walkTo:[920,590], face:'right',
    look:'L\'agente Mireille Broussard, votre partenaire. Elle connaît tout le monde à Lafayette, et tout le monde a peur de sa mère.',
    async talk(A){ const w=who('broussard');
      const o=await A.menu('Parler à l\'agente Broussard',[
        {txt:'Comment est-ce que je fais pour agir?'}, {txt:'Où est mon matériel?', when:G=>!G.flags.tools},
        {txt:'On va où, maintenant?'}, {txt:'Tu as une recommandation pour moi?'} ]);
      if(!o) return;
      if(o.txt.startsWith('Comment')){ await A.say('Mets la souris en haut de l\'écran. Les icônes, c\'est comme un menu au restaurant, mais en moins bon.',{who:w});
        return A.say('L\'œil pour regarder, la main pour prendre ou utiliser, la bouche pour parler. Et si t\'es pressé{|e} : les touches 1, 2, 3, 4. Ou tu gardes le bouton enfoncé, et une roue apparaît.',{who:w}); }
      if(o.txt.startsWith('Où')) return A.say('Dans le tiroir de ton bureau, cher. Tes gants, ton appareil photo, tes sachets. Sans ça, t\'es juste une personne qui regarde des choses.',{who:w});
      if(o.txt.startsWith('On va')) return A.say('Passe voir M. Landry à la salle des preuves. Il a une règle. Il a toujours une règle. Après, le capitaine veut te voir au briefing.',{who:w});
      return A.say('Je te recommande de manger quelque chose à la cafétéria. La nuit va être longue. Moi, je le sens.',{who:w}); } },
  { id:'porte', name:'La porte du briefing', rect:[1080,206,110,232], walkTo:[1134,486], face:'back', exit:['briefing','fromBureau'] }
 ],
 async onEnter(A){ if(A.G.seen.bureau) return; A.G.seen.bureau=1;
  await A.say('Lafayette, Louisiane. La veille des Festivals acadiens et créoles. Toute la ville danse. Sauf vous.');
  await A.say('Vous êtes enquêt{eur|rice} principal{|e} depuis exactement trois jours. Le café du poste, lui, est là depuis 1987.');
  await A.say('Amenez la souris en haut de l\'écran pour voir la barre d\'icônes. Pour changer d\'action : les touches 1 à 4, ou un clic long sur la scène. Les mots soulignés ont une traduction : passez la souris dessus. Le lexique est dans le carnet.');
  await A.say('Sauvegardez souvent. Les criminels, eux, ne vous attendront pas.'); }
};

/* ---------- 2. La salle de briefing (the call comes in here) ---------- */
ROOMS.briefing={
 name:'Poste — salle de briefing', depth:ST_DEPTH, walk:STATION_WALK,
 obstacles:[ [[452,620],[838,620],[846,660],[444,660]], [[178,520],[342,520],[346,544],[174,544]] ],
 start:{x:640,y:720,face:'back'},
 entries:{fromBureau:{x:126,y:494,face:'front'}, fromCafe:{x:1190,y:494,face:'front'}, fromPreuves:{x:1050,y:494,face:'front'}, fromParking:{x:640,y:760,face:'back'}},
 bg(G){ const call=G.flags.call;
  return `${interior({fluo:[260,640,1020]})}
  ${door(70,206,110,232,{label:'ENQUÊTES',glass:true})}
  <!-- whiteboard -->
  ${shadow(590,338,240,7,.25,'blurS')}<rect x="356" y="104" width="468" height="232" rx="4" fill="#B9BEC2"/><rect x="364" y="112" width="452" height="216" fill="url(#board)"/>
  <rect x="376" y="330" width="428" height="7" rx="2" fill="#9AA0A6"/><rect x="430" y="324" width="22" height="6" rx="2" fill="#2F6CB3"/><rect x="460" y="324" width="22" height="6" rx="2" fill="#B8443A"/>
  ${call?`${txt(590,150,'AFFAIRE : PARURE D\'ÉVANGÉLINE',20,{mid:1,fill:'#9B2F2F',ls:1})}<path d="M400,162 H780" stroke="#9B2F2F" stroke-width="2"/>
    ${txt(400,196,'Musée de Lafayette · salle des Trésors',14,{w:600,fill:'#2F4F86'})}${txt(400,222,'Vol signalé à 22 h 32 par le gardien',14,{w:600,fill:'#2F4F86'})}
    ${G.flags.act2?`<rect x="610" y="232" width="190" height="84" fill="#F7E98A" transform="rotate(2 705 274)"/>${txt(622,256,'1. conservatrice',14,{w:600})}${txt(622,278,'2. musicien',14,{w:600})}${txt(622,300,'3. collectionneur',14,{w:600})}`
     :`<rect x="640" y="236" width="150" height="72" fill="#F7E98A" transform="rotate(2 715 272)"/>${txt(652,262,'Suspects : ?',14,{w:600})}${txt(652,286,'Preuves : ?',14,{w:600})}`}`
   :`${txt(590,150,'BRIEFING DU SOIR',20,{mid:1,fill:'#2F4F86',ls:1})}<path d="M440,162 H740" stroke="#2F4F86" stroke-width="2"/>
    ${txt(400,198,'Festival : circulation fermée rue Jefferson',14,{w:600,fill:'#2F4F86'})}${txt(400,224,'Machine à café : NE PAS TOUCHER',14,{w:600,fill:'#9B2F2F'})}
    <rect x="652" y="240" width="140" height="66" fill="#F7E98A" transform="rotate(-3 722 273)"/>${txt(664,270,'Bienvenue',14,{w:600})}${txt(664,292,'au poste!',14,{w:600})}`}
  <!-- map of Acadiana with drive times -->
  ${shadow(922,330,80,5,.22,'blurS')}<rect x="852" y="114" width="140" height="210" fill="#F4EEDC"/><rect x="852" y="114" width="140" height="210" fill="none" stroke="#8C8470" stroke-width="2"/>
  <path d="M862,160 C890,170 900,200 930,206 C956,212 970,250 984,262" stroke="#6E8BA8" stroke-width="5" fill="none" opacity=".7"/>
  <path d="M870,290 C900,280 940,300 984,288" stroke="#6E8BA8" stroke-width="3" fill="none" opacity=".6"/>
  ${[[900,232,'Lafayette'],[946,206,'Breaux Bridge'],[966,170,'Henderson'],[934,268,'St. Martinville']].map(([x,y,n])=>`<circle cx="${x}" cy="${y}" r="4" fill="#9B2F2F"/>${txt(x-2,y-8,n,8.5,{mid:1,w:700})}`).join('')}
  ${txt(922,136,'ACADIANA',11,{mid:1,ls:1.5,fill:'#6E4A2C'})}
  ${door(1000,206,100,232,{label:'PREUVES',metal:true})}
  ${door(1140,206,100,232,{label:'CAFÉTÉRIA',glass:true})}
  ${call?`<path d="M560,800 L600,770 H680 L720,800 Z" fill="#F2C46D" opacity=".25"/>`:''}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:540, svg:()=>`${shadow(260,542,90,8,.35)}<rect x="180" y="470" width="160" height="12" fill="url(#deskTop)"/><rect x="186" y="482" width="8" height="58" fill="#4E3220"/><rect x="326" y="482" width="8" height="58" fill="#3A2416"/>
    <rect x="200" y="436" width="74" height="36" rx="4" fill="#2A2E36"/><rect x="206" y="442" width="38" height="14" rx="2" fill="#9AE07A" opacity=".85"/><circle cx="258" cy="452" r="7" fill="#3E444F"/><circle cx="258" cy="452" r="3" fill="#5E6676"/><rect x="262" y="404" width="4" height="34" fill="#1A1D24"/>
    <rect x="290" y="448" width="34" height="24" rx="3" fill="#3A3F48"/><path d="M296,454 h22 M296,460 h22 M296,466 h22" stroke="#1A1D24" stroke-width="1.6"/>` },
  { base:660, svg:()=>[490,580,670,760].map(x=>chairBack(x,656,1.08)).join('') }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".5" pointer-events="none"/>`; },
 npcs:[ { id:'arceneaux', look:CAST.arceneaux.look, x:390, y:560, face:'right', block:[[360,548],[420,548],[424,574],[356,574]] } ],
 hotspots:[
  { id:'tableau', name:'Le tableau blanc', rect:[356,104,468,232], walkTo:[640,600], face:'back',
    async look(A){ return A.say(A.G.flags.call?'« Affaire : parure d\'Évangéline. » Suspects : point d\'interrogation. Preuves : point d\'interrogation. C\'est un bon début. C\'est surtout un début.':'Le briefing du soir. La circulation est fermée pour le festival, et quelqu\'un a écrit « NE PAS TOUCHER » sur la machine à café. Sage conseil.'); } },
  { id:'carte', name:'La carte de l\'Acadiana', rect:[852,114,140,210], walkTo:[922,500], face:'back',
    async look(A){ await A.task({t:'doc',kind:'Carte',title:'Temps de route (voiture)',lines:['Poste de police → musée de Lafayette : 12 minutes','Musée → salle Chez Babineaux : 10 minutes','Lafayette → Breaux Bridge : 15 minutes','Lafayette → Henderson (bayou) : 25 minutes']},{title:'La carte de l\'Acadiana',kind:'Document'});
      if(!A.G.scored.carte){ A.note('Temps de route','Musée → Chez Babineaux : 10 min · Lafayette → Breaux Bridge : 15 min · Lafayette → Henderson : 25 min.'); A.score(1,'carte'); } } },
  { id:'radio', name:'La radio', rect:[196,400,132,76], walkTo:[260,560], face:'back',
    look:'La radio du poste. Elle grésille depuis 1994. Personne ne sait pourquoi. Personne n\'ose demander.',
    async hand(A){ if(A.G.flags.call&&!A.has('radio')){ A.give('radio'); return A.say('Vous prenez une radio portative. Maintenant, l\'équipe peut vous entendre. Et vous pouvez entendre l\'équipe. C\'est le prix à payer.',{icon:ITEMS.radio.icon}); }
      return A.say(A.has('radio')?'Vous avez déjà une radio. Deux, ce serait de la gourmandise.':'La radio grésille. Rien d\'important. Pour l\'instant.'); } },
  { id:'chaises', name:'Les chaises', rect:[452,540,394,120], look:'Des chaises en plastique, alignées pour le briefing. Elles ont entendu tous les discours du capitaine. Elles ne disent rien.' },
  { id:'arceneaux', name:'Capitaine Arceneaux', poly:[[356,330],[424,330],[430,570],[350,570]], walkTo:[460,590], face:'left',
    look:'Le capitaine Arceneaux. Trente ans de service. Il a tout vu, et il n\'a rien aimé.',
    async talk(A){ const w=who('arceneaux');
      if(A.G.flags.act2) return ACT2_BOARD(A);
      if(A.G.flags.arrived) return ACT1_END(A);
      if(A.G.flags.call) return A.say('Le musée, enquêt{eur|rice}. Pas la cafétéria. Pas votre bureau. Le musée. Le parking est par là.',{who:w});
      if(!A.G.flags.tools) return A.say('Vous n\'avez même pas vos gants? Votre matériel est dans votre bureau. Dans le tiroir. Là où on range le matériel. En général.',{who:w});
      if(!A.G.flags.procedure) return A.say('Passez voir M. Landry à la salle des preuves. S\'il ne vous explique pas sa règle, il ne dormira pas cette nuit. Et moi non plus.',{who:w});
      return A.say('Tout est calme. C\'est ça qui m\'inquiète.',{who:w}); } },
  { id:'p-bureau', name:'La porte des enquêtes', rect:[70,206,110,232], walkTo:[124,488], face:'back', exit:['bureau','fromBriefing'] },
  { id:'p-preuves', name:'La salle des preuves', rect:[1000,206,100,232], walkTo:[1050,488], face:'back', exit:['preuves','fromBriefing'] },
  { id:'p-cafe', name:'La cafétéria', rect:[1140,206,100,232], walkTo:[1190,488], face:'back', exit:['cafe','fromBriefing'] },
  { id:'parking', name:'Vers le parking', when:G=>G.flags.call, rect:[540,760,200,40], walkTo:[640,780], face:'front', exit:G=>G.flags.act2?['carte']:G.flags.arrived?['quai','fromCar',12]:['musee','arrive',12],
    async canExit(A){ if(!A.has('radio')){ await A.say('« Vous oubliez la radio, enquêt{eur|rice}. Sans radio, vous êtes juste quelqu\'un qui se promène la nuit. » Elle est sur la table.',{who:who('arceneaux')}); return false; } return true; } }
 ],
 async onEnter(A){ if(A.G.flags.call||!A.G.flags.tools||!A.G.flags.procedure) return;
  A.flag('call',true); A.G.clock=22*60+35; A.tickClock(0);
  await A.say('22 h 35. La radio grésille plus fort que d\'habitude.');
  await A.say('« À toutes les unités : vol au musée de Lafayette. La parure d\'Évangéline a disparu. Le gardien est sur place. »',{who:'Radio'});
  await A.say('Une parure acadienne volée la veille du festival. Si vous ne la retrouvez pas, toute la Louisiane va en parler. Et moi, je vais devoir parler à la télévision.',{who:who('arceneaux')});
  await A.say('Je déteste la télévision. Prenez une radio sur la table et allez au musée. Le parking est par là, en bas.',{who:who('arceneaux')});
  A.redraw(); }
};

/* ---------- 3. La cafétéria (Québec recall: partitifs) ---------- */
const FOODS=[['café','du'],['tarte aux noix de pécan','de la'],['beignets','des'],['boudin','du']];
function orderAnswers(){ const out=[]; const others=FOODS.slice(1);
 for(let i=0;i<others.length;i++) for(let j=0;j<others.length;j++){ if(i===j) continue;
  const a=others[i], b=others[j]; out.push(`Je voudrais du café, ${a[1]} ${a[0]} et ${b[1]} ${b[0]}, s'il vous plaît.`); } return out; }
function orderDiagnose(t){ const n=' '+t.toLowerCase()+' ';
 if(/ de le /.test(n)) return '« de » + « le » = « du ». On dit « du café », pas « de le café ».';
 if(/ (des|de la) café/.test(n)) return '« Café » est masculin singulier : du café.';
 if(/ (du|de la) beignets/.test(n)) return '« Beignets » est au pluriel : des beignets.';
 if(/ (du|des) tarte/.test(n)) return '« Tarte » est féminin : de la tarte.';
 if(/ (de la|des) boudin/.test(n)) return '« Boudin » est masculin : du boudin.';
 if(!/s'il vous plaît/.test(n)) return 'Mme Boudreaux attend une formule de politesse. Elle attend depuis 1987.';
 if(!/ du café/.test(n)) return 'Le café d\'abord. C\'est la loi du poste. Commencez par le café.';
 return null; }
ROOMS.cafe={
 name:'Poste — cafétéria', depth:[500,.9,790,1.36], walk:[[40,790],[120,500],[1250,500],[1272,790]],
 obstacles:[ [[196,704],[352,704],[360,742],[188,742]], [[928,704],[1084,704],[1092,742],[920,742]] ],
 start:{x:640,y:700,face:'back'}, entries:{fromBriefing:{x:124,y:520,face:'front'}},
 bg(G){ return `${interior({fluo:[400,880]})}
  ${door(70,206,110,232,{label:'BRIEFING',glass:true})}
  <!-- menu board -->
  ${shadow(640,214,220,6,.25,'blurS')}<rect x="420" y="80" width="440" height="130" rx="4" fill="#6E4A2C"/><rect x="430" y="90" width="420" height="110" fill="#22302A"/>
  ${txt(640,118,'MENU DE NUIT',18,{mid:1,ls:2,fill:'#F2E6CC',serif:1})}
  ${txt(470,146,'Café',15,{w:600,fill:'#EDE6D2'})}${txt(800,146,'1 $',15,{w:600,fill:'#EDE6D2'})}
  ${txt(470,168,'Tarte aux noix de pécan',15,{w:600,fill:'#EDE6D2'})}${txt(800,168,'3 $',15,{w:600,fill:'#EDE6D2'})}
  ${txt(470,190,'Beignets · Boudin',15,{w:600,fill:'#EDE6D2'})}${txt(800,190,'2 $',15,{w:600,fill:'#EDE6D2'})}
  <!-- shelf with coffee urns -->
  <rect x="300" y="250" width="680" height="10" fill="url(#deskTop)"/><rect x="300" y="260" width="680" height="4" fill="#4E3220"/>
  ${[360,440,880,940].map(x=>`<rect x="${x-14}" y="214" width="28" height="36" rx="3" fill="#F4F1E8"/><rect x="${x-14}" y="214" width="8" height="36" rx="3" fill="#fff"/><rect x="${x-8}" y="208" width="16" height="6" rx="2" fill="#9AA3AE"/>`).join('')}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:503, svg:()=>`${counter(220,398,840,104)}
    <rect x="300" y="352" width="200" height="50" fill="#E4EEF4" opacity=".35"/><rect x="300" y="352" width="200" height="50" fill="none" stroke="#C9D8E4" stroke-width="2"/>
    ${[320,350,380].map(x=>`<ellipse cx="${x}" cy="392" rx="13" ry="7" fill="url(#pastry)"/><ellipse cx="${x}" cy="390" rx="5" ry="2" fill="#7A410F" opacity=".5"/>`).join('')}
    <path d="M410,394 L450,394 L470,384 L430,384 Z" fill="url(#pastry)"/><path d="M412,392 L448,392" stroke="#5E2E0E" stroke-width="2" opacity=".6"/>
    ${[464,480].map(x=>`<ellipse cx="${x}" cy="378" rx="6" ry="3" fill="#7A3A1E"/>`).join('')}
    <path d="M304,356 L330,356 L304,384 Z" fill="#fff" opacity=".25"/>
    <rect x="800" y="326" width="70" height="72" rx="4" fill="url(#steel)"/><rect x="812" y="338" width="46" height="18" rx="2" fill="#1E2128"/><rect x="816" y="342" width="16" height="6" fill="#9AE07A"/><rect x="828" y="372" width="14" height="14" fill="#2A2E36"/>${mug(835,398,'#F4F1E8')}
    ${mug(700,398,'#B8443A')}${papers(560,398)}` },
  { base:742, svg:()=>[[274,700],[1006,700]].map(([x,y])=>`${shadow(x,y+44,82,9,.38)}<ellipse cx="${x}" cy="${y}" rx="76" ry="16" fill="url(#deskTop)"/><ellipse cx="${x}" cy="${y+4}" rx="76" ry="16" fill="#6E4A2C" opacity=".6"/><ellipse cx="${x}" cy="${y-2}" rx="74" ry="14" fill="url(#deskTop)"/><rect x="${x-5}" y="${y+12}" width="10" height="28" fill="#2A2E36"/><ellipse cx="${x}" cy="${y+42}" rx="26" ry="5" fill="#2A2E36"/>${mug(x+20,y-2,'#F4F1E8')}`).join('') }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".5" pointer-events="none"/>`; },
 npcs:[ { id:'boudreaux', look:CAST.boudreaux.look, x:640, y:478, face:'front' } ],
 hotspots:[
  { id:'menu', name:'Le menu', rect:[420,80,440,130], look:'Le menu de nuit : café, tarte aux noix de pécan, beignets et boudin. Le boudin est excellent. Le café est une épreuve.' },
  { id:'vitrine', name:'Les pâtisseries', rect:[300,352,200,50], walkTo:[400,560], face:'back', look:'Des beignets et une tarte aux noix de pécan. La tarte a l\'air de quelqu\'un qui a passé une bonne journée. Contrairement à vous.' },
  { id:'machine', name:'La machine à café', rect:[800,326,70,72], walkTo:[836,560], face:'back',
    look:'La machine à café. Quelqu\'un a écrit « NE PAS TOUCHER » sur le tableau du briefing. Elle a l\'air de mordre.',
    hand:'Vous approchez la main. La machine fait un bruit menaçant. Vous reculez. Vous avez des instincts d\'enquêt{eur|rice}.' },
  { id:'boudreaux', name:'Mme Boudreaux', poly:[[606,280],[674,280],[680,400],[600,400]], walkTo:[640,560], face:'back',
    look:'Mme Boudreaux. Elle nourrit le poste depuis 1987. Elle connaît le secret de chaque enquête et la commande de chaque policier.',
    async talk(A){ const w=who('boudreaux');
      if(A.G.flags.order) return A.say('Tu as déjà ta commande, cher. Mange. Tu es tout{|e} pâle.',{who:w});
      await A.say('Bonsoir, enquêt{eur|rice}! Qu\'est-ce que je te sers pour l\'équipe? Un café pour chacun, c\'est obligatoire. Et quelque chose à manger : deux choses du menu.',{who:w});
      const r=await A.task({ t:'tiles', prompt:'Commandez un café et deux choses à manger pour l\'équipe. Soyez poli{|e}.',
        tiles:['Je voudrais','du','du','de la','des','de le','café',',','tarte aux noix de pécan','beignets','boudin','et',',','s\'il vous plaît','.'],
        answers:orderAnswers(), diagnose:orderDiagnose, min:6 },{title:'La commande',kind:'Dossier · Cafétéria',cancel:true,
        intro:'Rappel de Québec : **du** (masculin), **de la** (féminin), **des** (pluriel).'});
      if(r.cancelled) return A.say('Pas faim? Personne n\'a jamais refusé ma tarte. Personne.',{who:w});
      A.flag('order',true); A.score(Math.max(3,6-r.mistakes),'order'); A.tickClock(5);
      return A.say('Voilà. Le café est frais. Enfin, il était frais mardi.',{who:w}); } },
  { id:'p-brief', name:'La porte du briefing', rect:[70,206,110,232], walkTo:[124,516], face:'back', exit:['briefing','fromCafe'] }
 ]
};

/* ---------- 4. La salle des preuves (procedure; evidence is logged here) ---------- */
const PROCEDURE={ t:'plan', prompt:'Remettez les étapes de la procédure dans l\'ordre de M. Landry.', itemsLabel:'Étapes',
 slots:['1.','2.','3.','4.','5.'],
 items:[ {id:'photo',txt:'photographier la preuve',ok:[0],why:'D\'abord, on ne touche à rien. Qu\'est-ce qu\'on fait sans toucher?'},
  {id:'gants',txt:'mettre des gants',ok:[1],why:'Les gants, c\'est juste avant de toucher la preuve.'},
  {id:'ramasser',txt:'ramasser la preuve et la mettre dans un sachet',ok:[2],why:'On la ramasse avec des gants, donc après les gants.'},
  {id:'etiquette',txt:'écrire l\'étiquette',ok:[3],why:'L\'étiquette va sur le sachet. Il faut d\'abord le sachet.'},
  {id:'greffier',txt:'apporter le sachet au greffier',ok:[4],why:'Le greffier, c\'est la fin du voyage de la preuve.'} ],
 say:'D\'abord photographier, ensuite mettre des gants, puis ramasser la preuve, écrire l\'étiquette et enfin l\'apporter au greffier.', done:'M. Landry hoche la tête. C\'est l\'émotion la plus forte qu\'il ait montrée depuis 2009.' };
ROOMS.preuves={
 name:'Poste — salle des preuves', depth:[500,.9,790,1.36], walk:[[40,790],[120,500],[1250,500],[1272,790]], obstacles:[],
 start:{x:640,y:700,face:'back'}, entries:{fromBriefing:{x:124,y:520,face:'front'}},
 bg(G){ return `${interior({fluo:[640],low:true,wall:'stWall'})}
  ${door(70,206,110,232,{label:'BRIEFING',metal:true})}
  <!-- wire cage with evidence boxes -->
  <rect x="250" y="80" width="790" height="320" fill="#2A2E32"/>
  ${[0,1,2].map(r=>`<rect x="262" y="${120+r*92}" width="766" height="8" fill="url(#steel)"/>`+Array.from({length:9},(_,i)=>{ const x=280+i*82, y=120+r*92; return `<rect x="${x}" y="${y-44}" width="64" height="44" fill="${['#C9A878','#B89868','#D2B888'][(i+r)%3]}"/><rect x="${x}" y="${y-44}" width="64" height="8" fill="#000" opacity=".12"/><rect x="${x+18}" y="${y-30}" width="28" height="12" fill="#F7F1E3"/>`; }).join('')).join('')}
  <path d="${Array.from({length:40},(_,i)=>`M${250+i*20},80 V400`).join(' ')} ${Array.from({length:16},(_,i)=>`M250,${80+i*20} H1040`).join(' ')}" stroke="#9AA3AE" stroke-width="1" opacity=".45"/>
  <rect x="246" y="76" width="798" height="328" fill="none" stroke="#5E666C" stroke-width="8"/>
  ${poster(1080,110,150,190,`${txt(1155,136,'PROCÉDURE',13,{mid:1,ls:1.5,fill:'#9B2F2F'})}${['1. Photo','2. Gants','3. Sachet','4. Étiquette','5. Greffier'].map((t,i)=>txt(1098,164+i*26,t,13,{w:600})).join('')}`)}
  <rect width="1280" height="800" fill="url(#vigTop)"/>`; },
 props:[
  { base:503, svg:()=>`${counter(220,398,860,104)}
    <rect x="470" y="300" width="340" height="100" fill="none" stroke="#5E666C" stroke-width="8"/>
    ${shadow(380,398,40,4,.35,'blurS')}<polygon points="340,392 420,392 428,398 332,398" fill="#2E4A6A"/><polygon points="343,390 418,390 424,394 337,394" fill="#F7F4EC"/><path d="M380,390 v6" stroke="#9AA3AE" stroke-width="1"/>
    ${shadow(900,398,14,3,.35,'blurS')}<ellipse cx="900" cy="396" rx="12" ry="3.4" fill="#5E666C"/><path d="M890,395 Q900,378 910,395 Z" fill="url(#steel)"/><circle cx="900" cy="378" r="2" fill="#5E666C"/>` }
 ],
 fg(){ return `<rect width="1280" height="800" fill="url(#vig)" opacity=".5" pointer-events="none"/>`; },
 npcs:[ { id:'landry', look:CAST.landry.look, x:640, y:478, face:'front' } ],
 hotspots:[
  { id:'cage', name:'Les étagères de preuves', rect:[250,80,790,220], look:'Des centaines de boîtes. Chaque boîte est une histoire. La plupart sont ennuyeuses. M. Landry les aime toutes.' },
  { id:'affiche', name:'L\'affiche', rect:[1080,110,150,190], walkTo:[1150,520], face:'back', look:'« Procédure : 1. Photo. 2. Gants. 3. Sachet. 4. Étiquette. 5. Greffier. » Quelqu\'un a ajouté au crayon : « 6. Café ». M. Landry a effacé le 6. Trois fois.' },
  { id:'registre', name:'Le registre', rect:[330,380,100,20], walkTo:[380,560], face:'back', look:'Le registre des preuves. L\'écriture de M. Landry est parfaite. Même ses ratures sont droites.' },
  { id:'cloche', name:'La sonnette', rect:[884,372,32,28], walkTo:[900,560], face:'back', look:'Une sonnette.', hand:'Ding. M. Landry vous regarde comme si vous aviez sonné à trois heures du matin. Il est 22 h. C\'est presque pire.' },
  { id:'landry', name:'M. Landry', poly:[[606,280],[674,280],[680,400],[600,400]], walkTo:[640,560], face:'back',
    look:'M. Landry, le greffier. Il garde les preuves comme d\'autres gardent un trésor. Il n\'a jamais perdu une preuve. Il a perdu deux amis, mais jamais une preuve.',
    async talk(A){ const w=who('landry');
      if(!A.G.flags.procedure){
        await A.say('Une preuve, il faut la photographier, la ramasser avec des gants, la mettre dans un sachet, l\'étiqueter et me l\'apporter. Dans cet ordre. Sinon, elle n\'existe pas.',{who:w});
        await A.say('Comme mes vacances. Répétez-moi l\'ordre, s\'il vous plaît. Je veux être sûr que vous avez écouté.',{who:w});
        const r=await A.task(PROCEDURE,{title:'La règle de M. Landry',kind:'Dossier · Procédure',intro:'Rappel de Bretagne : **il faut** + infinitif.'});
        A.flag('procedure',true); A.score(Math.max(2,5-r.mistakes),'procedure');
        return A.say('Bien. Le capitaine vous attend au briefing. Et n\'oubliez pas : une preuve que je n\'ai pas vue n\'existe pas.',{who:w}); }
      const pend=['perle','peinture'].filter(id=>A.has(id));
      if(pend.length) return A.say('Vous avez des preuves pour moi? Donnez-les-moi. Choisissez le sachet dans votre inventaire, puis cliquez sur moi.',{who:w});
      return A.say('Rien à déclarer? Alors, rien à faire ici. Sauf admirer mes étagères.',{who:w}); },
    use:{ perle:A=>LOG(A,'perle'), peinture:A=>LOG(A,'peinture'), '*':'M. Landry regarde l\'objet. « Ce n\'est pas une preuve, ça. C\'est un objet. Je ne prends que les preuves. »' } },
  { id:'p-brief', name:'La porte du briefing', rect:[70,206,110,232], walkTo:[124,516], face:'back', exit:['briefing','fromPreuves'] }
 ]
};
async function LOG(A,id){ const w=who('landry'); A.drop(id); A.flag('logged_'+id,true); A.score(2,'log_'+id);
 await A.say(`M. Landry prend le sachet, vérifie l'étiquette, écrit dans le registre. « ${id==='perle'?'Pièce n° 1. Une perle.':'Pièce n° 2. De la peinture rouge.'} Merci. » Il sourit presque.`,{who:w});
 if(A.G.flags.logged_perle&&A.G.flags.logged_peinture) await A.say('Toutes les preuves sont enregistrées. Le capitaine attend votre rapport au briefing. Enfin, il attend surtout le café.',{who:w}); }
