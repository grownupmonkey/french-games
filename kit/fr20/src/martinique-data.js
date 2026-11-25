/* ===== Escale 7 · La montagne Pelée — the script (approved Nov 21). French only; [[mot]] = hover gloss from GLOSSARY. ===== */
const CAST={
 joelle:{name:"Joëlle", look:{skin:4,hair:'#1E1612',style:'long',coat:'olive',noHat:true,scarf:'#E9A93A'}, pitch:1.05},
 kevin:{name:"Kévin", look:{skin:4,hair:'#1E1612',style:'short',coat:'rust',noHat:true}, pitch:1.2},
 lefevre:{name:"M. Lefèvre", look:{skin:1,hair:'#B8B2A6',style:'short',coat:'grey',noHat:true,glasses:true}, pitch:.85},
 marieline:{name:"Marie-Line", look:{skin:5,hair:'#1E1612',style:'mid',coat:'plum',noHat:true,apron:'#F4F1E8'}, pitch:1.05},
 op:{name:"112", phone:true},
 pompier:{name:"Le sauveteur", look:{skin:3,hair:'#1E1612',style:'short',coat:'rust',noHat:true}, pitch:.9}
};
const SIGNS=[{key:'parking',u:0,txt:['Parking','824 m']},{key:'aileron',u:.36,txt:['L\'Aileron','1 107 m']},{key:'refuge',u:.62,txt:['2e refuge','Chinois 30 min']},{key:'fourche',u:.78,txt:['Fourche','Parking ↙']},{key:'chinois',u:.98,txt:['Le Chinois','1 397 m']}];
const BREAKDOWN=[['sac','Le sac',12],['regles','Les règles',8],['montee','La montée et 1902',14],['refuge','Le choix et la peur du vide',14],['sommet','Le sommet',4],['descente','Navigation et premiers secours',20],['appel',"L'appel et l'attente",20],['bonus','Bonus',8]];
const GLOSSARY={
 'randonnée':['hike'],'randonneur':['hiker'],'randonneuse':['hiker (woman)'],'sentier':['trail'],'sommet':['summit'],'refuge':['mountain shelter'],'caldeira':['caldera (volcano crater)'],
 'fourche':['fork (in a trail)'],'piquet':['post, stake'],'piquets':['posts, stakes'],'ravine':['ravine, gully'],'crête':['ridge'],'vide':['empty space, drop'],'peur du vide':['fear of heights'],
 'brouillard':['fog'],'averse':['shower (rain)'],'averses':['showers (rain)'],'reliefs':['high ground'],'bulletin':['report, bulletin'],'humeur':['mood'],'nuages':['clouds'],
 'K-way':['rain jacket'],'trousse de secours':['first-aid kit'],'bande':['bandage'],'couverture de survie':['emergency blanket'],'lampe frontale':['head torch'],'sifflet':['whistle'],
 'collation':['snack'],'crème solaire':['sunscreen'],'casquette':['cap'],'tongs':['flip-flops'],'enceinte':['speaker (music)'],'parapluie':['umbrella'],'serviette de plage':['beach towel'],
 'cheville':['ankle'],'genou':['knee'],'dos':['back'],'pieds':['feet'],'jambe':['leg'],'immobiliser':['to keep still, to splint'],'masser':['to massage'],'glisser':['to slip'],'plâtre':['cast (for a broken bone)'],
 'secours':['rescue services'],'sauveteur':['rescuer'],'hélicoptère':['helicopter'],'treuil':['winch'],'civière':['stretcher'],'pompiers':['firefighters'],
 'éruption':['eruption'],'nuée ardente':['pyroclastic flow'],'cachot':['prison cell (underground)'],'survivant':['survivor'],'observatoire':['observatory'],'surveillé':['monitored'],
 'trigonocéphale':['fer-de-lance snake','Martinique'],'bèt-long':['snake','créole'],'protégé':['protected'],'reculer':['to move back'],
 'bonjou':['hello','créole'],'mèsi':['thank you','créole'],'an nou ay':["let's go",'créole'],'mèsi anpil':['thank you very much','créole'],'chef':['boss, leader'],
 'accras':['salt-cod fritters'],'jus de goyave':['guava juice'],'pain au beurre':['sweet butter bread','Martinique'],'véranda':['veranda, porch'],
 'altitude':['altitude, height'],'altimètre':['altimeter'],'boussole':['compass'],'bâton':['walking pole'],'marches':['steps'],'pâle':['pale'],'essoufflé':['out of breath'],'transpire':['sweats'],
 'grelotte':['shivers'],'sèche':['dry'],'demi-tour':['turn back'],'chic':['stylish']
};
/* ---------- stage helpers ---------- */
const sayAll=async(A,lines)=>{ for(const [w,t] of lines) await A.say(w,t); };
const DOC=(kind,title,lines)=>`<span class="k">${esc(kind)}</span><h3>${esc(title)}</h3>${lines.map(l=>`<p>${MQ.A.rich(l)}</p>`).join('')}`;

const STAGES=[
/* 0. Le sac — chez les Désir, 6 h 15 */
async A=>{ A.stage('Chez les Désir · Le Morne-Rouge'); A.at(6*60+15);
 await sayAll(A,[['marieline',"[[Bonjou]], [nom]! Bien dormi? Joëlle passe te chercher à 7 h. Elle t'a envoyé un message."],['marieline',"Prépare le sac du groupe. Moi, je fais le café."]]);
 const r=await A.task([
  {t:'number',prompt:"Combien d'eau faut-il pour le groupe? Relis le message de Joëlle.",rows:[{label:"Eau pour 4 personnes",ans:6,unit:'L',why:"4 personnes × 1,5 L. Calcule encore."},{label:"Poids de cette eau",ans:6,unit:'kg',why:"1 litre d'eau pèse 1 kilo."}],done:"6 litres, 6 kilos. C'est lourd!"},
  {t:'say',who:'marieline',text:"6 kilos, c'est trop pour toi seul{|e}. Chacun porte sa bouteille. Toi, tu portes la tienne et le sac du groupe : **7 kg maximum**."},
  {t:'sac',max:7,prompt:"Mets dans le sac ce qu'il faut pour la montagne. Pas plus de 7 kg.",
   items:[{id:'eau',txt:"Ta bouteille d'eau (1,5 L)",kg:1.5,need:true},{id:'reserve',txt:"Une bouteille de réserve (1,5 L)",kg:1.5},{id:'kway',txt:"Les [[K-way]] du groupe",kg:1.2,need:true},
    {id:'trousse',txt:"La [[trousse de secours]] (avec une [[bande]])",kg:.6,need:true},{id:'couverture',txt:"Une [[couverture de survie]]",kg:.1,need:true},{id:'lampe',txt:"Une [[lampe frontale]]",kg:.2,need:true},
    {id:'sifflet',txt:"Un [[sifflet]]",kg:.05,need:true},{id:'tel',txt:"Ton téléphone chargé",kg:.2,need:true},{id:'collation',txt:"Des bananes et du [[pain au beurre]]",kg:.8,need:true},{id:'casquette',txt:"Ta [[casquette]] et la [[crème solaire]]",kg:.3,need:true},
    {id:'parapluie',txt:"Un [[parapluie]]",kg:.6,trap:true,why:"Il ne faut pas prendre de parapluie : en haut, le vent est trop fort."},{id:'tongs',txt:"Des [[tongs]]",kg:.4,trap:true,why:"Il faut des chaussures fermées pour marcher sur les roches."},
    {id:'serviette',txt:"Une [[serviette de plage]]",kg:.8,trap:true,why:"Il n'y a pas de plage au sommet!"},{id:'enceinte',txt:"Une [[enceinte]] Bluetooth",kg:.7,trap:true,why:"Il ne faut pas faire de bruit en forêt. Les oiseaux te remercient."},
    {id:'soda',txt:"Une grande bouteille de soda",kg:2,trap:true,why:"Il faut de l'eau, pas du soda : le sucre donne encore plus soif."}],
   overWhy:"Le sac est trop lourd! Il faut enlever quelque chose.",missWhy:"Il manque quelque chose d'important. Relis le message de Joëlle et le bulletin.",
   goAnyway:"D'accord, on part comme ça. J'espère que tu n'auras pas besoin de ce qui manque…",done:"Parfait. Le sac est prêt, et il n'est pas trop lourd."}
 ],{title:"Le sac du groupe",kind:"Préparation",docs:[
  DOC('Message de Joëlle','6 h 02',["[[Bonjou]]! Départ 7 h. Il faut 1,5 L d'eau par personne. Il ne faut pas oublier ton [[K-way]] : en haut, la Pelée change d'[[humeur]] toutes les dix minutes. Prends aussi la [[trousse de secours]], une [[lampe frontale]] et de quoi manger."]),
  DOC('Bulletin météo','Nord de la Martinique',["Beau temps le matin. [[Nuages]] sur les [[reliefs]] en fin de matinée, [[averses]] possibles. Vent d'est 20 km/h."])]});
 A.score('sac',12,r.mistakes,2); A.S.water=4.5+(A.has('eau')?1.5:0)+(A.has('reserve')?1.5:0); A.water(0);
 await A.say('marieline',"Le café est prêt. Bonne randonnée! Et ramène-moi tout le monde, hein."); },

/* 1. Parking de l'Aileron, 824 m, 7 h 30 */
async A=>{ A.stage("Parking de l'Aileron · 824 m"); A.at(7*60+30);
 await sayAll(A,[['joelle',"Voilà le [[sentier]]. Le [[sommet]], le Chinois, est à 1 397 mètres. Deux heures de montée."],
  ['joelle',"Le volcan est [[surveillé]] jour et nuit par l'[[observatoire]]. Aujourd'hui, tout est calme. Le seul danger, c'est la météo."],
  ['joelle',"Trois règles. Restez ensemble. Ne quittez pas le sentier. Buvez souvent, même sans soif."],
  ['joelle',"Et toi, randonneu{r|se} : c'est toi qui répètes les règles à Kévin et à M. Lefèvre."]]);
 const r=await A.task([
  {t:'tiles',prompt:"Pour Kévin (tu) : la règle n° 1.",tiles:['Reste','avec','nous','!','Restes','Restez'],answer:'Reste avec nous!',hints:{Restes:"Avec tu, l'impératif des verbes en -er n'a pas de s : reste.",Restez:"Kévin, on le tutoie : reste."}},
  {t:'tiles',prompt:"Pour Kévin (tu) : la règle n° 2.",tiles:['Ne','quitte','pas','le','sentier','!','quittes','Quittez'],answer:'Ne quitte pas le sentier!',hints:{quittes:"Pas de s à l'impératif avec tu : quitte.",Quittez:"Kévin, c'est tu : ne quitte pas."},diagnose:t=>/^quitte pas/i.test(t)?"À l'impératif négatif, il faut le ne : ne quitte pas.":null},
  {t:'tiles',prompt:"Pour M. Lefèvre (vous) : la règle n° 3.",tiles:['Buvez','souvent',',','monsieur','.','Bois','Buvons'],answer:'Buvez souvent, monsieur.',hints:{Bois:"M. Lefèvre, on le vouvoie : buvez.",Buvons:"Buvons, c'est nous. Ici, c'est vous : buvez."}}
 ],{title:"Les trois règles",kind:"Au départ"});
 A.score('regles',8,r.mistakes,2);
 await sayAll(A,[['lefevre',"Merci. J'ai aussi mon [[bâton]], ma [[boussole]], mon [[altimètre]] et mon [[sifflet]]."],['kevin',"Moi, j'ai mon téléphone."],['joelle',"[[An nou ay]]!"]]); },

/* 2. La montée de l'Aileron, 1 107 m, 8 h 15 */
async A=>{ A.stage("La montée de l'Aileron"); await A.walk(.36); A.at(8*60+15); A.energy(-22); A.weather(.08);
 await A.say(null,"Les [[marches]] de l'Aileron sont raides. Le soleil tape. Le groupe ralentit.");
 const r=await A.task({t:'groupe',prompt:"Regarde le groupe. Qu'est-ce qu'ils ont? Choisis le bon diagnostic, puis ce que tu fais.",cards:[
   {who:'kevin',shows:"Il est tout rouge, il [[transpire]], il enlève sa casquette. « Il fait trop chaud! »",hint:"Regarde son visage et ce qu'il dit.",
    diag:[{txt:"Il a chaud.",ok:true},{txt:"Il a froid.",why:"Il est tout rouge et il transpire : il n'a pas froid."},{txt:"Il a peur.",why:"Il n'a pas peur : il dit qu'il fait trop chaud."}],
    give:[{txt:"« Remets ta casquette et bois un peu. » (0,25 L)",ok:true,water:.25,energy:5,res:"Kévin boit, à l'ombre. Il va mieux."},{txt:"« Enlève tes chaussures. »",why:"Sur ces roches? Il faut garder ses chaussures."}]},
   {who:'lefevre',shows:"Il s'arrête, [[essoufflé]]. « J'ai la bouche [[sèche]]… »",hint:"La bouche sèche, qu'est-ce que ça veut dire?",
    diag:[{txt:"Il a soif.",ok:true},{txt:"Il a faim.",why:"La bouche sèche, c'est la soif."},{txt:"Il a mal au dos.",why:"Il ne parle pas de son dos."}],
    give:[{txt:"« Buvez un peu d'eau, monsieur. » (0,25 L)",ok:true,water:.25,energy:5,res:"M. Lefèvre boit. « Merci, chef. »"},{txt:"« Courez jusqu'au sommet! »",why:"Courir quand on a soif? Il faut boire d'abord."}]},
   {who:'joelle',shows:"« Moi, ça va. Mais Kévin n'a rien mangé ce matin. Regarde : il est tout [[pâle]]. »",hint:"Il n'a rien mangé…",
    diag:[{txt:"Kévin a faim.",ok:true},{txt:"Kévin a soif.",why:"Il n'a rien mangé : il a faim."},{txt:"Kévin a chaud.",why:"Joëlle parle de manger."}],
    give:[{txt:"Une banane pour Kévin",ok:true,item:'collation',energy:10,res:"Kévin mange la banane en deux secondes."},{txt:"« Attends le pique-nique au sommet. »",why:"Il est pâle maintenant : il faut manger maintenant."}],none:"Pas de collation dans le sac… Kévin continue, le ventre vide."}
  ],done:"Tout le monde va mieux. On continue."},{title:"Le groupe",kind:"Pause"});
 await sayAll(A,[['joelle',"Regardez en bas, vers la mer. Voilà Saint-Pierre."],
  ['joelle',"Le 8 mai 1902, la montagne Pelée est entrée en [[éruption]]. Une [[nuée ardente]] a détruit la ville en quelques minutes."],
  ['joelle',"Environ 28 000 personnes sont mortes. Un homme a survécu dans son [[cachot]] : Cyparis. On ne l'oublie pas, ici."],
  ['joelle',"Plus tard, en 1929, une nouvelle éruption a construit le dôme du sommet. C'est le Chinois, là-haut."]]);
 const yr=new Date().getFullYear();
 const r2=await A.task({t:'number',prompt:"Calcule.",rows:[{label:"L'éruption de Saint-Pierre, c'était il y a combien d'années?",ans:yr-1902,unit:'ans',why:`${yr} − 1902. Calcule encore.`},{label:"Le Chinois est né en quelle année?",ans:1929,unit:'',why:"Relis ce que Joëlle a dit."}],done:"Exactement."},{title:"1902",kind:"Mémoire"});
 A.score('montee',14,r.mistakes+r2.mistakes,2); A.time(15); },

/* 3. Le bord de la caldeira, 2e refuge, 9 h 15 */
async A=>{ A.stage("Le 2e refuge · bord de la caldeira"); await A.walk(.62); A.at(9*60+15); A.energy(-15); A.weather(.32);
 if(A.S.energy<15){ await sayAll(A,[['joelle',"Le groupe est trop fatigué. On ne monte pas au sommet aujourd'hui. On redescend."]]); A.S.flags.noSummit=true; A.score('refuge',14,7,2); return; }
 await A.say('joelle',"La règle des guides : si le [[brouillard]] arrive, il faut être redescendus au [[refuge]] avant 11 h. Regarde le panneau.");
 const r=await A.task([
  {t:'number',prompt:"Il est 9 h 15. On monte au sommet (30 min), on reste 15 minutes, on redescend (30 min). À quelle heure est-on de retour au refuge?",rows:[{label:"Retour au refuge",ans:10*60+30,time:true,unit:'',why:"9 h 15 + 30 min + 15 min + 30 min."}],done:"10 h 30."},
  {t:'choose',prompt:"Alors, qu'est-ce qu'on fait?",opts:[{txt:"On monte au sommet : on sera de retour à 10 h 30, avant 11 h.",ok:true},{txt:"On redescend tout de suite : on n'a pas le temps.",why:"Calcule encore : on a le temps."},{txt:"On prend le sentier de Grande Savane.",why:"C'est un autre sentier, beaucoup plus long."}]}
 ],{title:"Le choix",kind:"Au refuge",docs:[DOC('Panneau','2e refuge',["Le Chinois (sommet) : 30 min","Grande Savane : 1 h 30","Macouba / Grand-Rivière : 4 h"])]});
 await A.walk(.84,.8);
 await A.say('lefevre',"Je… je ne peux pas. La [[crête]] est trop étroite. J'ai [[peur du vide]]…");
 const r2=await A.task([
  {t:'tiles',prompt:"Rassure M. Lefèvre (vous).",tiles:['Ne','regardez','pas','en','bas','.','regarde','Regardez'],answer:'Ne regardez pas en bas.',hints:{regarde:"M. Lefèvre, c'est vous : regardez."},diagnose:t=>/^regardez en bas/i.test(t)?"Au contraire! Il ne faut pas regarder en bas.":/^regardez pas/i.test(t)?"Il manque le ne : ne regardez pas.":null},
  {t:'choose',prompt:"Qu'est-ce que tu dis encore à M. Lefèvre?",opts:[{txt:"Donnez-moi la main. Respirez lentement.",ok:true},{txt:"Donne-moi la main. Respire lentement.",why:"On vouvoie M. Lefèvre : donnez, respirez."},{txt:"Regardez en bas, c'est joli!",why:"Surtout pas!"}]}
 ],{title:"La peur du vide",kind:"Sur la crête"});
 await A.say('lefevre',"Merci. Vous êtes un{|e} excellent{|e} guide. Ne le dites pas à Joëlle.");
 A.score('refuge',14,r.mistakes+r2.mistakes,2); },

/* 4. Le Chinois, 1 397 m, 10 h */
async A=>{ if(A.S.flags.noSummit){ A.score('sommet',4,2,2); return; }
 A.stage("Le Chinois · 1 397 m"); await A.walk(1,.8); A.at(10*60); A.energy(-8); A.weather(.15);
 await sayAll(A,[[null,"Le sommet! Pendant une minute, tout le nord de l'île est là : la mer, les forêts, Saint-Pierre."],['kevin',"Photo!"]]);
 A.weather(.88); await A.wait(2200);
 await A.say('joelle',"Photo rapide. Regardez derrière vous. On ne voit plus le refuge.");
 const r=await A.task({t:'choose',prompt:"Kévin veut attendre le soleil. Qu'est-ce que dit Joëlle?",opts:[{txt:"Il faut descendre tout de suite.",ok:true},{txt:"Il faut attendre le soleil.",why:"Avec ce brouillard? Souviens-toi de la règle des guides."},{txt:"Il ne faut pas descendre.",why:"Le brouillard arrive : il faut descendre."}]},{title:"Le brouillard",kind:"Au sommet"});
 A.score('sommet',4,r.mistakes,2); A.time(15); },

/* 5. La descente dans le brouillard, 10 h 30 */
async A=>{ A.stage("La descente · brouillard"); A.weather(.92); A.rain(true); await A.walk(.78,.7); A.at(10*60+30); A.energy(-8);
 await A.say(null,"Le brouillard est épais. On ne voit que le [[piquet]] suivant. Le sentier se sépare en deux.");
 const r=await A.task({t:'choose',prompt:"À gauche ou à droite? Trois indices : le piquet jaune est à gauche. M. Lefèvre : « Le parking est au sud-est. » Joëlle : « Il ne faut jamais quitter les [[piquets]] jaunes. »",
  opts:[{txt:"À gauche, vers le piquet jaune.",ok:true},{txt:"À droite : le chemin est plus large.",why:"Le chemin s'arrête au bord d'une [[ravine]]! On fait [[demi-tour]]. Relis les indices."},{txt:"Tout droit, dans les herbes.",why:"Il ne faut jamais quitter le sentier!"}]},{title:"La fourche",kind:"Navigation"});
 if(r.mistakes){ A.S.flags.wrongPath=true; A.time(15*r.mistakes); A.energy(-6*r.mistakes); }
 await A.walk(.74,.6); A.MAP.sit(1,true);
 await sayAll(A,[['joelle',"Aïe! Ma cheville…"],[null,"Joëlle a [[glissé]] sur une roche mouillée. Elle est assise par terre. Maintenant, c'est toi le [[chef]]."]]);
 const bande=A.has('trousse');
 const r2=await A.task([
  {t:'choose',prompt:"Qu'est-ce que tu demandes à Joëlle?",opts:[{txt:"Où est-ce que tu as mal?",ok:true},{txt:"Où est-ce que tu es mal?",why:"On dit avoir mal : tu as mal."},{txt:"Tu as mal où est-ce que?",why:"L'ordre des mots : où est-ce que tu as mal?"}]},
  {t:'say',who:'joelle',text:"J'ai mal à la [[cheville]]. La droite. Je ne peux pas marcher."},
  {t:'tiles',prompt:"Note-le pour les secours.",tiles:['Elle','a','mal','à','la','cheville','.','au','est'],answer:'Elle a mal à la cheville.',hints:{au:"Cheville est féminin : à la cheville.",est:"On dit avoir mal : elle a mal."}},
  {t:'choose',prompt:"Kévin : « Et moi, j'ai mal … pieds! »",opts:[{txt:"aux",ok:true},{txt:"au",why:"Pieds, c'est au pluriel : à + les = aux."},{txt:"à les",why:"À + les devient aux."}]},
  {t:'choose',prompt:"M. Lefèvre : « Moi, j'ai mal … dos. »",opts:[{txt:"au",ok:true},{txt:"à le",why:"À + le devient au."},{txt:"à la",why:"Dos est masculin : au dos."}]},
  {t:'order',prompt:"Qu'est-ce qu'il faut faire? Choisis dans l'ordre.",items:[{txt:"Il faut l'asseoir."},{txt:bande?"Il faut [[immobiliser]] la cheville avec la bande.":"Il faut immobiliser la cheville avec le t-shirt de Kévin."},{txt:"Il faut lever la [[jambe]] sur le sac."},{txt:"Il faut appeler les [[secours]]."}],
   traps:[{txt:"Il faut marcher pour voir.",why:"Non! Elle ne peut pas marcher. Il ne faut pas bouger la cheville."},{txt:"Il faut [[masser]] très fort.",why:"Il ne faut pas masser une cheville blessée."}],done:"Joëlle est bien installée."},
  {t:'tiles',prompt:"Dis à Joëlle de rester tranquille (tu).",tiles:['Ne','bouge','pas','.','bouges','bougez'],answer:'Ne bouge pas.',hints:{bouges:"Pas de s à l'impératif avec tu : bouge.",bougez:"Joëlle, on la tutoie : bouge."}},
  {t:'say',who:'joelle',text:"D'accord, chef."}
 ],{title:"Premiers secours",kind:"Urgence"});
 A.score('descente',20,r.mistakes+r2.mistakes+(bande?0:1),2); A.time(10); },

/* 6. L'appel au 112 et l'attente, 11 h */
async A=>{ A.stage("L'appel au 112"); A.at(11*60);
 await A.say(null,"Tu appelles le 112 avec ton téléphone.");
 const r=await A.task([
  {t:'phone',text:"112, j'écoute. Qu'est-ce qui se passe?",next:true},
  {t:'tiles',prompt:"Explique.",tiles:['Une','femme','a','mal','à','la','cheville','.','au','est'],answer:'Une femme a mal à la cheville.',hints:{au:"Cheville est féminin : à la cheville.",est:"Avoir mal : elle a mal."}},
  {t:'choose',prompt:"Et encore :",opts:[{txt:"Elle ne peut pas marcher.",ok:true},{txt:"Elle ne peut marcher pas.",why:"Ne… pas entoure le verbe conjugué : elle ne peut pas marcher."},{txt:"Elle peut ne pas marcher.",why:"Ça veut dire autre chose! Elle ne peut pas marcher."}]},
  {t:'phone',text:"Où êtes-vous exactement?",next:true},
  {t:'pick',prompt:"Clique sur le dernier panneau que vous avez passé, sur la carte.",keys:SIGNS.map(s=>s.key),ok:'fourche',why:"Non, ce n'est pas ce panneau. Regarde où est le groupe : quel panneau est juste derrière vous?",say:"Nous sommes près du panneau de la fourche, sur le sentier de l'Aileron.",done:"C'est ça."},
  {t:'number',live:true,prompt:"Et l'altitude? Lis-la en haut de l'écran.",rows:[{label:"Altitude",ans:0,live:()=>A.MAP.altitude(),tol:15,unit:'m',why:"Regarde en haut de l'écran : Altitude."}],done:"Parfait."},
  {t:'phone',text:"Vous êtes combien? Quelqu'un a froid?",next:true},
  {t:'choose',prompt:"Réponds.",opts:[{txt:"Nous sommes quatre. Kévin a froid.",ok:true},{txt:"Nous avons quatre. Kévin est froid.",why:"On dit : nous sommes quatre, il a froid."},{txt:"Nous sommes quatre. Kévin fait froid.",why:"Avoir froid : Kévin a froid."}]},
  {t:'phone',text:"Restez où vous êtes. Mettez des vêtements chauds. Quand vous entendez l'hélicoptère, allumez la lampe.",btn:"Compris"},
  {t:'choose',prompt:"Qu'est-ce que vous faites d'abord?",opts:[{txt:"On reste ici et on met des vêtements chauds.",ok:true},{txt:"On descend à pied avec Joëlle.",why:"L'opérateur a dit : restez où vous êtes."},{txt:"J'allume la lampe tout de suite.",why:"La lampe, c'est quand on entend l'hélicoptère."}]}
 ],{title:"L'appel",kind:"112"});
 await A.say(null,"Il pleut. Il fait froid. On attend.");
 const r2=await A.task({t:'groupe',prompt:"Pendant l'attente, occupe-toi du groupe.",cards:[
   {who:'kevin',shows:"Il [[grelotte]]. Ses bras sont mouillés.",hint:"Il grelotte…",diag:[{txt:"Il a froid.",ok:true},{txt:"Il a chaud.",why:"Il grelotte : il a froid."},{txt:"Il a faim.",why:"Il grelotte, ce n'est pas la faim."}],
    give:[{txt:"Son [[K-way]]",ok:true,item:'kway',energy:6,res:"Kévin met son K-way. Il arrête de grelotter."},{txt:"La [[couverture de survie]]",ok:true,item:'couverture',energy:6,res:"Kévin s'enroule dans la couverture dorée. « Je ressemble à un burrito. »"}],none:"Rien pour le réchauffer… Kévin grelotte jusqu'à l'arrivée des secours."},
   {who:'lefevre',shows:"Son ventre fait du bruit. « Excusez-moi. C'est l'heure du déjeuner, à Lyon. »",hint:"Son ventre fait du bruit.",diag:[{txt:"Il a faim.",ok:true},{txt:"Il a peur.",why:"Son ventre fait du bruit : il a faim."},{txt:"Il a soif.",why:"Son ventre fait du bruit."}],
    give:[{txt:"Du [[pain au beurre]]",ok:true,item:'collation',energy:5,res:"« Délicieux. Je reste en Martinique. »"}],none:"Pas de collation… M. Lefèvre a faim, mais il ne dit rien. Très poli."},
   {who:'joelle',shows:"Elle a les lèvres sèches. « Il reste de l'eau? »",hint:"Les lèvres sèches.",diag:[{txt:"Elle a soif.",ok:true},{txt:"Elle a froid.",why:"Les lèvres sèches : elle a soif."},{txt:"Elle a mal au dos.",why:"Elle a mal à la cheville, et soif."}],
    give:[{txt:"De l'eau (0,25 L)",ok:true,water:.25,energy:4,res:"Joëlle boit. « [[Mèsi]]. »"}],none:"Plus une goutte d'eau… Joëlle attend."}
  ],done:"Le groupe tient bon."},{title:"L'attente",kind:"Sous la pluie"});
 A.MAP.showSnake(); await A.say('kevin',"Un… un serpent! Là, sur la racine!");
 const r3=await A.task({t:'choose',prompt:"Qu'est-ce que tu dis à Kévin?",opts:[{txt:"Ne bouge pas. Recule doucement. Ne le touche pas.",ok:true},{txt:"Tue-le avec ton bâton!",why:"Joëlle : « Non! Il est protégé. Il ne nous a rien fait. »"},{txt:"Cours!",why:"Il ne faut pas courir : tu peux glisser."}]},{title:"Le serpent",kind:"Attention"});
 await A.MAP.hideSnake();
 await A.say('joelle',"C'est un [[trigonocéphale]]. Le [[bèt-long]]. Il existe seulement en Martinique, et il est [[protégé]]. Il ne nous a rien fait : il rentre chez lui.");
 A.score('appel',20,r.mistakes+r2.mistakes+r3.mistakes,2);
 A.bonus('bonus',(A.S.water>=1?4:A.S.water>=.5?2:0)+(A.S.flags.wrongPath?0:4)); },

/* 7. Le sauvetage et la soirée */
async A=>{ A.stage("Le sauvetage"); A.at(11*60+40);
 await A.say(null,"Un bruit de moteur, quelque part dans le brouillard…");
 await A.task({t:'choose',prompt:"Qu'est-ce que tu fais?",opts:[{txt:"J'allume la [[lampe frontale]]!",ok:true,after:"La lampe brille dans le brouillard."},{txt:"Je crie très fort.",why:"L'opérateur a dit : allumez la lampe."},{txt:"Je prends une photo.",why:"Kévin s'en occupe déjà. Toi : la lampe!"}]},{title:"L'hélicoptère",kind:"Secours"});
 A.MAP.lamp(true); A.rain(false); A.weather(.55);
 await A.MAP.rescue(1,ph=>{ if(ph==='down') A.toast("Un sauveteur descend au bout du câble."); if(ph==='up') A.toast("Joëlle monte sur la civière."); });
 A.MAP.lamp(false); A.MAP.sit(1,false); A.weather(.3);
 await sayAll(A,[['pompier',"Bravo pour l'appel. Position parfaite. On vous ramène au parking à pied. Doucement, hein."],[null,"Une heure plus tard, au parking. Puis, le soir, chez les Désir…"]]);
 const cine=document.querySelector('#cine'); cine.innerHTML=EVENING(A.P); cine.hidden=false;
 await sayAll(A,[['marieline',"Mangez! Vous avez faim, j'espère."],['kevin',"J'ai faim, j'ai soif, j'ai mal aux jambes et j'ai trois cents photos de brouillard."],
  ['joelle',"(au téléphone, depuis l'hôpital) J'ai mal à la cheville, mais j'ai un [[plâtre]] très [[chic]]. Et toi… [[mèsi anpil]], [[chef]]."],['lefevre',"L'année prochaine, je visite un musée. Au rez-de-chaussée."]]); }
];

/* the evening on the veranda (2D painted scene) */
function EVENING(P){ const me=playerLook(P,{coat:'teal',noHat:true});
 const fig=(look,x,y,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})">${person(Object.assign({},look,{x:0,y:0}))}</g>`;
 return `<svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs><linearGradient id="evSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E3A6E"/><stop offset=".55" stop-color="#C8607A"/><stop offset="1" stop-color="#F2B266"/></linearGradient>
  <linearGradient id="evWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E3C0"/><stop offset="1" stop-color="#D9C08A"/></linearGradient>
  <linearGradient id="evTable" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A55"/><stop offset="1" stop-color="#7A4A22"/></linearGradient>
  <radialGradient id="evBulb" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE7A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></radialGradient></defs>
  <rect width="960" height="540" fill="url(#evSky)"/>
  <path d="M0,300 C120,250 220,170 330,150 C420,135 470,180 560,230 C660,285 820,280 960,300 V540 H0Z" fill="#2E4A3A" opacity=".85"/><path d="M300,160 l30,-12 l26,10z" fill="#3E5A48"/>
  ${Array.from({length:18},(_,i)=>`<circle cx="${40+i*53}" cy="${40+(i*37)%90}" r="1.4" fill="#fff" opacity=".7"/>`).join('')}
  <rect x="0" y="250" width="960" height="290" fill="url(#evWall)"/><polygon points="-20,250 980,250 960,214 0,214" fill="#8C4A3A"/><rect x="0" y="246" width="960" height="8" fill="#6E3428"/>
  ${[60,300,560,820].map(x=>`<rect x="${x}" y="254" width="16" height="200" fill="#F4EAD6"/><rect x="${x+12}" y="254" width="4" height="200" fill="#C9B48A"/>`).join('')}
  <rect x="380" y="290" width="140" height="120" fill="#5A3A22"/><rect x="390" y="300" width="56" height="100" fill="#FFD48A" opacity=".85"/><rect x="454" y="300" width="56" height="100" fill="#FFD48A" opacity=".85"/>
  <circle cx="480" cy="268" r="70" fill="url(#evBulb)"/><circle cx="480" cy="268" r="8" fill="#FFE7A8"/>
  <rect y="454" width="960" height="86" fill="#A46B3A"/>${Array.from({length:12},(_,i)=>`<rect x="${i*80}" y="454" width="2" height="86" fill="#7A4A22" opacity=".5"/>`).join('')}
  <ellipse cx="480" cy="472" rx="240" ry="14" fill="#000" opacity=".22"/>
  ${fig(CAST.marieline.look,250,470,1.25)}${fig(me,380,470,1.25)}${fig(CAST.kevin.look,580,470,1.25)}${fig(CAST.lefevre.look,710,470,1.25)}
  <rect x="300" y="400" width="360" height="16" rx="3" fill="url(#evTable)"/><rect x="300" y="414" width="360" height="40" fill="#7A4A22"/>
  <ellipse cx="400" cy="398" rx="42" ry="9" fill="#F4F1E8"/>${[380,394,408,420].map((x,i)=>`<circle cx="${x}" cy="${392-(i%2)*3}" r="7" fill="#C9862F"/><circle cx="${x-2}" cy="${390-(i%2)*3}" r="2.2" fill="#E9B45E"/>`).join('')}
  <rect x="520" y="372" width="22" height="28" rx="3" fill="#F2A65A" opacity=".9"/><rect x="520" y="372" width="22" height="6" fill="#fff" opacity=".35"/><rect x="560" y="376" width="20" height="24" rx="3" fill="#F2A65A" opacity=".9"/>
  <g transform="translate(470 380)"><rect x="-10" y="-14" width="20" height="30" rx="4" fill="#2B2D42"/><rect x="-7" y="-10" width="14" height="20" rx="2" fill="#A9E2FF"/></g>
 </svg>`; }

MQ.start();
