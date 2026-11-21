/* ===== L'enquête: items, cast, help, failure art, lexique. Rooms are added by rooms-*.js. ===== */
const ROOMS={};
/* ---------- cast (looks for actorSVG; invented generic cap and badge, no real insignia) ---------- */
const CAST={
 broussard:{name:'Agente Broussard', look:{skin:4,hair:'#1E1612',style:'mid',coat:'police',cap:true,badge:true,collar:'#C9D2DE'}},
 thib:{name:'Agent Thibodeaux', look:{skin:3,hair:'#1E1612',style:'short',coat:'police',cap:true,badge:true,mustache:true,collar:'#C9D2DE'}},
 leblanc:{name:'Sergent LeBlanc', look:{skin:1,hair:'#6B4428',style:'short',coat:'police',cap:true,badge:true,collar:'#C9D2DE'}},
 arceneaux:{name:'Capitaine Arceneaux', look:{skin:1,hair:'#A8A39A',style:'short',coat:'grey',mustache:true,collar:'#F4F1E8'}},
 landry:{name:'M. Landry, greffier', look:{skin:0,hair:'#5A4030',style:'short',coat:'olive',glasses:true,collar:'#E9E3D8'}},
 boudreaux:{name:'Mme Boudreaux', look:{skin:2,hair:'#3A2418',style:'mid',coat:'cream',collar:'#B8443A'}},
 guidry:{name:'Roland Guidry, gardien de nuit', look:{skin:1,hair:'#B8B4AC',style:'short',coat:'navy',cap:true,mustache:true,collar:'#C9D2DE'}},
 gagnon:{name:'Geneviève Gagnon, conservatrice', look:{skin:0,hair:'#4A2E1C',style:'long',coat:'plum',glasses:true,collar:'#F4F1E8'}},
 cedric:{name:'Cédric Thériot, accordéoniste', look:{skin:1,hair:'#6B4428',style:'mid',coat:'rust',collar:'#E9E3D8'}},
 violon:{name:'La violoneuse', look:{skin:3,hair:'#1E1612',style:'long',coat:'teal',collar:'#E9E3D8'}},
 triangle:{name:'Le joueur de triangle', look:{skin:4,hair:'#1E1612',style:'short',coat:'yellow',collar:'#E9E3D8'}},
 tipaul:{name:'Ti-Paul, barman', look:{skin:2,hair:'#3A2418',style:'short',coat:'cream',mustache:true,collar:'#9B2F2F'}},
 peeters:{name:'Didier Peeters, collectionneur', look:{skin:0,hair:'#A8A39A',style:'short',coat:'navy',glasses:true,collar:'#F4F1E8'}},
 commis:{name:'Le réceptionniste', look:{skin:4,hair:'#1E1612',style:'short',coat:'emerald',collar:'#F4F1E8'}},
 dancer1:{name:'', look:{skin:2,hair:'#A2502B',style:'long',coat:'magenta'}}, dancer2:{name:'', look:{skin:3,hair:'#1E1612',style:'short',coat:'blue'}},
 dancer3:{name:'', look:{skin:5,hair:'#1E1612',style:'mid',coat:'saffron'}}, dancer4:{name:'', look:{skin:1,hair:'#C7A160',style:'short',coat:'olive'}},
 hebert:{name:'Mme Odile Hébert', look:{skin:0,hair:'#D8D4CC',style:'mid',coat:'plum',glasses:true,collar:'#F4F1E8'}}
};
const who=k=>CAST[k].name;
/* deductions: linking two notebook cards (« Relier » in the carnet) */
const LINKS=[
 {pair:['badge3','badgelist'], id:'L_badge', points:3, title:'Le badge n° 3 est à Mme Gagnon', text:'Le badge n° 3 est celui de Mme Gagnon. C\'est son badge qui a ouvert la porte de service à 22 h 18.'},
 {pair:['tel','carte'], id:'L_tel', points:3, title:'L\'appel venait de Mme Gagnon', text:'Le 337-555-0144 est le cellulaire de Mme Gagnon. C\'est elle qui a appelé le gardien à 22 h 15.'},
 {pair:['setlist','tipaul'], id:'L_pause', points:3, title:'Cédric est parti pendant la pause', text:'La pause a duré de 22 h 10 à 22 h 50, et Cédric est parti avec la camionnette pendant la pause.'},
 {pair:['hotelclerk','foulard'], id:'L_foulard', points:3, title:'La femme au foulard vert', text:'La femme au foulard vert, à l\'hôtel, ressemble beaucoup à Mme Gagnon sur la photo du vernissage.'},
 {pair:['peeters','camera'], id:'L_camera', points:3, title:'Qui a choisi l\'endroit de la planche?', text:'C\'est Mme Gagnon qui a suggéré le nouvel endroit de la planche : juste devant la caméra.'},
 {pair:['cles2','caseKey'], id:'L_cle', points:3, title:'La clé de la vitrine a disparu', text:'Seuls le gardien et Mme Gagnon ont une clé de la vitrine. La clé du gardien n\'est pas sortie. Celle de Mme Gagnon n\'est pas dans l\'armoire.'}
];
/* ---------- items ---------- */
const ITEMS={
 gants:{ name:'Gants en nitrile',
  icon:`<g>${'<ellipse cx="24" cy="44" rx="13" ry="2.6" fill="#000" opacity=".2"/>'}<path d="M15,42 L14,26 C13,22 12,18 12,14 C12,11 16,11 16.5,14 L18,22 L18,9 C18,5.5 22.5,5.5 22.5,9 L23,21 L23.5,7 C23.5,3.5 28,3.5 28,7 L28,21 L29,9.5 C29,6 33.5,6 33.5,9.5 L33,26 C35,22 36,19 38,18 C41,17 41.5,20 40,23 L35,34 L34,42 Z" fill="#4E8FD9"/><path d="M28,21 L29,9.5 C29,6 33.5,6 33.5,9.5 L33,26 L35,30 L34,42 L27,42 Z" fill="#2F6CB3"/><path d="M16,20 C16,16 15,13 14,12" stroke="#BFE0FF" stroke-width="1.5" opacity=".7" fill="none" stroke-linecap="round"/><rect x="14" y="38" width="21" height="5" rx="1.5" fill="#2A5A96"/></g>`,
  look:'Des gants bleus en nitrile. **Il faut** les mettre avant de toucher une preuve. C\'est la règle numéro un. La règle numéro deux : ne pas oublier la règle numéro un.',
  async use(A){ if(A.G.wearing.gants) return A.say('Vous les portez déjà. Ils vous vont très bien, d\'ailleurs.');
   A.G.wearing.gants=true; A.score(2,'gloves'); A.tickClock(1); A.redraw(); return A.say('Vous enfilez les gants. Ils claquent sur vos poignets. Très professionnel.'); } },
 appareil:{ name:'Appareil photo',
  icon:`<g><ellipse cx="24" cy="42" rx="17" ry="2.6" fill="#000" opacity=".22"/><rect x="5" y="14" width="38" height="25" rx="4" fill="#3A404C"/><rect x="5" y="14" width="38" height="7" rx="3" fill="#525A68"/><rect x="15" y="9" width="12" height="7" rx="2" fill="#2A2F38"/><circle cx="26" cy="27" r="9.5" fill="#1A1D24"/><circle cx="26" cy="27" r="6.5" fill="#2E4A6A"/><circle cx="23.6" cy="24.6" r="2.2" fill="#A9E2FF" opacity=".85"/><rect x="34" y="16.5" width="6" height="3" rx="1" fill="#F2C46D"/></g>`,
  look:'L\'appareil photo du service. Il a vu plus de scènes de crime que vous. Il **faut** photographier une preuve avant de la ramasser.',
  async use(A){ return A.say('Vous prenez une photo de vos chaussures. Elle ira dans le dossier « Erreurs ». Choisissez plutôt l\'appareil, puis cliquez sur une preuve.'); } },
 sachets:{ name:'Sachets à preuves',
  icon:`<g><ellipse cx="24" cy="43" rx="15" ry="2.4" fill="#000" opacity=".18"/><path d="M10,8 H38 L39,42 H9 Z" fill="#E4EEF4" opacity=".85"/><path d="M10,8 H38 L39,42 H9 Z" fill="none" stroke="#8CA2B2" stroke-width="1.4"/><rect x="10" y="8" width="28" height="5" fill="#B9C9D4"/><rect x="14" y="24" width="20" height="12" rx="1" fill="#F7F1E3"/><rect x="14" y="24" width="20" height="3.5" fill="#B8443A"/><path d="M17,31 h12 M17,34 h8" stroke="#6B5A40" stroke-width="1"/><path d="M13,14 L16,40" stroke="#fff" stroke-width="1.6" opacity=".7"/></g>`,
  look:'Des sachets transparents avec une étiquette. Une preuve sans étiquette, ce n\'est plus une preuve. C\'est un souvenir.' },
 radio:{ name:'Radio',
  icon:`<g><ellipse cx="24" cy="44" rx="10" ry="2.2" fill="#000" opacity=".2"/><rect x="15" y="12" width="18" height="31" rx="4" fill="#2A2E36"/><rect x="15" y="12" width="6" height="31" rx="3" fill="#3E444F"/><rect x="27" y="3" width="3" height="11" rx="1.5" fill="#1A1D24"/><rect x="18" y="16" width="12" height="8" rx="1" fill="#9AE07A"/><g fill="#5E6676"><circle cx="20" cy="30" r="1.4"/><circle cx="24" cy="30" r="1.4"/><circle cx="28" cy="30" r="1.4"/><circle cx="20" cy="35" r="1.4"/><circle cx="24" cy="35" r="1.4"/><circle cx="28" cy="35" r="1.4"/></g><circle cx="31" cy="15" r="1.4" fill="#E04A3A"/></g>`,
  look:'La radio du service. Elle grésille, mais elle marche. Utilisez-la pour donner une recommandation à l\'équipe.',
  async use(A){ return RADIO(A); } },
 peinture:{ name:'Peinture rouge (pièce n° 2)',
  icon:`<g><path d="M10,8 H38 L39,42 H9 Z" fill="#E4EEF4" opacity=".85"/><path d="M10,8 H38 L39,42 H9 Z" fill="none" stroke="#8CA2B2" stroke-width="1.4"/><rect x="10" y="8" width="28" height="5" fill="#B9C9D4"/><path d="M18,20 l8,-3 l5,5 l-6,6 l-8,-2 z" fill="#B8443A"/><path d="M19,21 l6,-2" stroke="#E07A6A" stroke-width="1.2"/><rect x="14" y="32" width="20" height="7" rx="1" fill="#F7F1E3"/><rect x="14" y="32" width="20" height="2.5" fill="#B8443A"/></g>`,
  look:'Des éclats de peinture rouge, grattés sur la borne du quai. Étiquette : « Pièce n° 2. » À apporter au greffier.' },
 perle:{ name:'Perle (pièce n° 1)',
  icon:`<g><path d="M10,8 H38 L39,42 H9 Z" fill="#E4EEF4" opacity=".85"/><path d="M10,8 H38 L39,42 H9 Z" fill="none" stroke="#8CA2B2" stroke-width="1.4"/><rect x="10" y="8" width="28" height="5" fill="#B9C9D4"/><circle cx="24" cy="24" r="6" fill="url(#pearlG)"/><circle cx="22" cy="22" r="1.6" fill="#fff"/><rect x="14" y="32" width="20" height="7" rx="1" fill="#F7F1E3"/><rect x="14" y="32" width="20" height="2.5" fill="#B8443A"/></g>`,
  look:'La perle, dans son sachet. Étiquette : « Pièce n° 1. Perle trouvée sous la vitrine. » Elle devra aller à la salle des preuves. Ne l\'oubliez pas, ou elle disparaîtra comme le café de l\'équipe.' }
};
function clockNow(A){ const c=A.G.clock, h=Math.floor(c/60)%24, m=c%60; return `${h} h ${String(m).padStart(2,'0')}`; }
const FAIL_ART={
 tires:`<ellipse cx="100" cy="104" rx="80" ry="8" fill="#fff" opacity=".08"/><g fill="none" stroke="#E9E4D6" stroke-width="6" opacity=".85"><path d="M10,70 C60,60 120,90 190,70"/><path d="M10,92 C60,82 120,112 190,92"/></g><g fill="none" stroke="#6E8BA8" stroke-width="8" opacity=".9"><path d="M30,40 C70,90 110,30 160,100"/><path d="M50,30 C90,80 130,20 180,90"/></g>`,
 coffee:`<ellipse cx="100" cy="104" rx="50" ry="7" fill="#fff" opacity=".08"/><path d="M70,40 h60 l-6,60 h-48 z" fill="#E9E4D6"/><path d="M130,52 q18,2 16,18 q-2,14 -18,12" stroke="#E9E4D6" stroke-width="6" fill="none"/><ellipse cx="100" cy="40" rx="30" ry="6" fill="#3B1E0C"/><text x="100" y="80" text-anchor="middle" font-family="Georgia,serif" font-size="28" fill="#3B1E0C">?</text>`,
 step:`<ellipse cx="100" cy="104" rx="70" ry="8" fill="#fff" opacity=".08"/><g transform="translate(100 72) rotate(-8)"><path d="M-26,-40 C-10,-50 22,-46 26,-20 C30,4 18,24 10,34 C-2,46 -24,40 -28,22 C-32,4 -36,-28 -26,-40 Z" fill="#6B4A30"/><path d="M-18,-26 h30 M-22,-10 h38 M-22,6 h34" stroke="#3A2716" stroke-width="3"/></g><g transform="translate(150 98)"><ellipse rx="12" ry="5" fill="#ECE6DA"/><path d="M-12,0 L-18,-4 M12,0 L18,-5 M0,-5 L2,-11" stroke="#ECE6DA" stroke-width="2"/></g>`,
 prints:`<g fill="none" stroke="#E9E4D6" stroke-width="2.4" opacity=".9" transform="translate(100 60)">${Array.from({length:7},(_,i)=>`<ellipse rx="${8+i*7}" ry="${11+i*8}" ${i%2?'stroke-dasharray="14 6"':''}/>`).join('')}</g>`
};


/* ---------- help from the team: the next useful thing to do (costs points) ---------- */
function HINT(G){ const b='Agente Broussard', t='Agent Thibodeaux', r=G.roomId;
 if(G.flags.act2) return HINT2(G);
 if(!G.flags.tools) return {who:b,text:'Ton matériel est dans le tiroir de ton bureau. Utilise la main sur le tiroir.'};
 if(!G.flags.procedure) return {who:b,text:'Va voir M. Landry à la salle des preuves, par la porte « PREUVES » du briefing. Parle-lui.'};
 if(!G.flags.call) return {who:b,text:'Le capitaine t\'attend dans la salle de briefing.'};
 if(!G.flags.arrived) return {who:b,text:'Prends la radio sur la table, puis va vers le parking, en bas de la salle de briefing.'};
 if(!G.wearing.gants) return {who:t,text:'Ouvrez l\'inventaire, choisissez les gants et « Utiliser ». Il faut les mettre avant de toucher une preuve.'};
 if(!G.flags.photoPerle) return {who:t,text:'Quelque chose brille sous la vitrine. Choisissez l\'appareil photo, puis cliquez dessus.'};
 if(!G.flags.perle) return {who:t,text:'La perle est photographiée. Maintenant, ramassez-la avec la main.'};
 if(!G.flags.labels) return {who:t,text:'Les étiquettes sont par terre, sous la vitrine murale. Remettez-les à leur place avec la main.'};
 if(!G.scored.boue) return {who:t,text:'Regardez le plancher entre la porte de service et la vitrine.'};
 if(!G.flags.guardStmt) return {who:t,text:'Le gardien vous attend dans son poste de sécurité. Passez par la porte de service, puis par le quai.'};
 if(!G.flags.badges) return {who:t,text:'Dans le poste de sécurité, regardez le registre des badges, sur le mur.'};
 if(!G.flags.photoPneus) return {who:t,text:'Sur le quai, il y a des traces de pneus. Photographiez-les avant de bouger la voiture.'};
 if(!G.flags.peinture) return {who:t,text:'La borne jaune du quai a de la peinture rouge. Photo, gants, puis la main.'};
 if(!G.flags.recoBoue) return {who:t,text:'Utilisez la radio de votre inventaire pour me recommander de suivre les traces de boue. N\'oubliez pas la preuve.'};
 if(G.flags.perle&&!G.flags.logged_perle||G.flags.peinture&&!G.flags.logged_peinture) return {who:b,text:'Rentre au poste avec la voiture, puis donne tes sachets à M. Landry : choisis un sachet, puis clique sur lui.'};
 return {who:b,text:'Parle au capitaine dans la salle de briefing. Tu es prêt{|e}.'};
}
/* ---------- lexique: difficult words, French → English (words only, never sentences) ---------- */
const GLOSSARY={
 'asteur':['now','cajun'], 'espérer':['to wait','cajun; also « j\'espère » = I wait'], 'espère':['waits / wait','cajun, from espérer'],
 'char':['car','cajun and québécois'], 'cher':['dear','cajun, said to anyone'], 'fais do-do':['late-night dance party','cajun'],
 'bayou':['bayou, slow swampy river'], 'parure':['matching jewellery set'], 'vitrine':['display case'], 'couvercle':['lid'],
 'perle':['pearl'], 'preuve':['evidence, proof'], 'sachet à preuves':['evidence bag'], 'empreintes':['fingerprints'],
 'boue':['mud'], 'pointure':['shoe size'], 'trace':['track, mark'], 'cavalier':['evidence marker (here)','also: rider'],
 'greffier':['evidence clerk','in court: court clerk'], 'gardien':['guard'], 'conservatrice':['curator (woman)'],
 'collectionneur':['collector'], 'accordéoniste':['accordion player'], 'prêteur sur gages':['pawnbroker'],
 'quai de chargement':['loading dock'], 'camionnette':['van'], 'pneu':['tire'], 'témoin':['witness'],
 'mandat':['warrant'], 'procureure':['prosecutor (woman)'], 'rapport d\'enquête':['police report'],
 'enquêteur':['investigator (man)'], 'enquêtrice':['investigator (woman)'], 'agent':['officer (man)'], 'agente':['officer (woman)'],
 'syndiqué':['in a union'], 'planche':['comic page (here)','also: board, plank'], 'banderole':['banner'],
 'mousse espagnole':['Spanish moss'], 'chêne':['oak'], 'menaçant':['threatening'], 'insulte':['insult'],
 'enfiler':['to pull on (gloves, clothes)'], 'gants':['gloves'], 'nitrile':['nitrile (glove material)'],
 'appareil photo':['camera'], 'étiquette':['label'], 'ramasser':['to pick up'], 'photographier':['to photograph'],
 'déplacer':['to move (an object)'], 'glisser':['to slide'], 'forcer':['to force open'], 'serrure':['lock'], 'rayure':['scratch'],
 'immortaliser':['to capture forever (in a photo)'], 'photogénique':['photogenic'], 'quelque chose qui brille':['something shiny'],
 'chum':['boyfriend','québécois'], 'pantoute':['not at all','québécois'], 'plate':['boring','québécois'], 'ben voyons':['come on!','québécois'],
 'dépanneur':['corner store','québécois'], 'septante':['seventy','Belgium and Switzerland'], 'nonante':['ninety','Belgium and Switzerland'],
 'à tantôt':['see you later','Belgium'], 'écrevisse':['crawfish'], 'écrevisses':['crawfish (plural)'], 'feuilleton':['TV series, soap opera'], 'borne':['bollard, post'],
 'gratter':['to scrape'], 'grésiller':['to crackle (radio)'], 'tiroir':['drawer'], 'liège':['cork'], 'classeur':['filing cabinet'], 'registre':['logbook, register'],
 'sonnette':['bell'], 'étagère':['shelf'], 'boîte à clés':['key box'], 'clé maîtresse':['master key'], 'crochet':['hook'], 'déclaration':['statement'],
 'étiquettes':['labels'], 'cuillères':['spoons'], 'théière':['teapot'], 'bol':['bowl'], 'billet':['ticket'], 'veillée':['evening gathering with music'],
 'galerie':['porch (Acadian / Cajun)'], 'robe de chambre':['bathrobe'], 'tutoyer':['to say « tu » to someone'], 'livraisons':['deliveries'], 'cadenassé':['padlocked'],
 'conservatrice':['curator (woman)'], 'vernissage':['exhibition opening night'], 'foulard':['scarf'], 'portemanteau':['coat rack'],
 'armoire à clés':['key cabinet'], 'clé de secours':['spare key'], 'dictionnaire':['dictionary'], 'derrière':['behind'], 'sous':['under'], 'sur':['on'],
 'carte de visite':['business card'], 'cellulaire':['cell phone','québécois / cajun'], 'liste du personnel':['staff list'], 'catalogue':['catalogue'],
 'salle de danse':['dance hall'], 'set':['set (of songs)'], 'pause':['break'], 'violon':['fiddle, violin'], 'violoneuse':['fiddler (woman)'], 'triangle':['triangle (instrument)'],
 'accordéon':['accordion'], 'barman':['bartender'], 'cigarettes':['cigarettes'], 'fumer':['to smoke'], 'souliers':['shoes','cajun / québécois'], 'bottes':['boots'],
 'réceptionniste':['hotel clerk'], 'chambre':['room (hotel)'], 'reçu':['receipt'], 'addition':['bill (restaurant)'], 'stationnement':['parking lot','québécois / cajun'],
 'monter':['to go up'], 'descendre':['to come down'], 'ligne du temps':['timeline'], 'contredire':['to contradict'], 'déduction':['deduction'], 'relier':['to link'],
 'pas pantoute':['not at all','québécois'], 'pis':['and then','québécois (puis)'], 'nonante':['ninety','Belgium'], 'septante-cinq':['seventy-five','Belgium'],
 'beignets':['doughnuts, beignets'], 'boudin':['Cajun rice sausage'], 'noix de pécan':['pecans'], 'quai':['loading dock (here)','also: platform, wharf'], 'sauvegarder':['to save (a game)'], 'restaurer':['to restore (a saved game)']
};

