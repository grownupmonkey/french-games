/* ===== Escale 1 : Québec — La ceinture fléchée de Bonhomme =====
   Curriculum (French 20-3Y): 20 C 3.1–3.4 (loisirs, kiosques, transport en commun, interactions);
   20 R 2.1g partitifs, 2.1h contractés, 2.9a je voudrais / j'aimerais, 2.7a venir de + inf., 2.6a futur proche,
   2.10b faire de / jouer à / jouer de, 2.8c je te suggère de, 2.3a de possessif, 3.2 tu/vous, 3.3 accents régionaux,
   2.7b-c passé composé (avoir/être), 2.11b négation au passé composé.
   Text markup: [[mot québécois|français standard|English]], {masc|fém} agreement, [nom] player name. */
const GAME={id:'quebec', title:'La ceinture fléchée', place:'Québec', eyebrow:'Escale 1 · Québec, Carnaval'};

const INTRO={who:'karine', steps:[
 {t:'npc', text:"Bonjour [nom]! Bienvenue à Québec! Tu viens d'arriver de Calgary, c'est ça?", en:"Hello [nom]! Welcome to Québec City! You've just arrived from Calgary, right?"},
 {t:'choice', prompt:"Réponds à Karine.", en:"Answer Karine.", opts:[
  {txt:"Oui, je viens d'arriver! Je suis très content{|e} d'être ici.", ok:true},
  {txt:"Oui, je vais arriver de Calgary.", why:"Tu es déjà à Québec. Pour une action qui vient de finir, on dit venir de + infinitif : je viens d'arriver.", whyEn:"You're already here. For something that just happened, use venir de + infinitive."},
  {txt:"Oui, j'arrive de Calgary demain.", why:"Demain, c'est dans le futur, mais tu es déjà là! Dis : je viens d'arriver.", whyEn:"Tomorrow is in the future, but you're already here."}]},
 {t:'npc', text:"J'ai un gros problème. Bonhomme Carnaval a perdu sa ceinture fléchée! Le défilé de nuit commence à 19 h, [[pis|et puis|and]] Bonhomme [[peut pas|ne peut pas|can't]] défiler sans sa ceinture.", en:"I have a big problem. Bonhomme Carnaval lost his woven sash! The night parade starts at 7 p.m., and Bonhomme can't march without his sash."},
 {t:'npc', text:"Peux-tu m'aider? Commence au kiosque de queues de castor. Josée voit tout le monde passer!", en:"Can you help me? Start at the beaver tail kiosk. Josée sees everyone go by!"},
 {t:'choice', prompt:"Accepte la mission.", en:"Accept the mission.", opts:[
  {txt:"Bien sûr! Je vais chercher la ceinture.", ok:true},
  {txt:"Bien sûr! Je viens de chercher la ceinture.", why:"Venir de + infinitif = c'est déjà fait. Tu n'as pas encore cherché! Pour le futur proche : aller + infinitif (je vais chercher).", whyEn:"Venir de means it's already done. Use aller + infinitive for the near future."},
  {txt:"Bien sûr! Je cherche la ceinture la semaine prochaine.", why:"Le défilé est ce soir! Il faut chercher tout de suite.", whyEn:"The parade is tonight!"}]},
 {t:'card', title:"Le Carnaval de Québec", text:"Le premier Carnaval de Québec a eu lieu en 1894, et il revient chaque hiver depuis 1955. C'est un des plus grands carnavals d'hiver au monde. Sa mascotte, Bonhomme, porte une tuque rouge et une ceinture fléchée.", en:"The first Québec Winter Carnival took place in 1894, and it has come back every winter since 1955. It's one of the biggest winter carnivals in the world. Its mascot, Bonhomme, wears a red tuque and a woven sash."}
]};

const STOPS=[
{id:'kiosque', name:'Le kiosque', sub:'Commander à manger', who:'josee', sign:'Queues de castor', signPos:[58.85,30.2,20.8,5.9],
 steps:[
 {t:'npc', text:"Salut! Tu viens d'arriver? Il fait [[frette|très froid|really cold]] aujourd'hui, hein? Une queue de castor, ça te [[tente|intéresse|tempts (do you feel like)]]?", en:"Hi! Did you just arrive? It's freezing today, eh? Do you feel like a beaver tail?"},
 {t:'choice', prompt:"Commande poliment.", en:"Order politely.", opts:[
  {txt:"Oui, je voudrais une queue de castor, s'il vous plaît.", ok:true},
  {txt:"Oui, je veux mange une queue de castor.", why:"Après vouloir, le deuxième verbe reste à l'infinitif (manger). Et « je voudrais » est plus poli.", whyEn:"After vouloir, the second verb stays in the infinitive. Je voudrais is more polite."},
  {txt:"Oui, j'ai voudrais une queue de castor.", why:"On dit « je voudrais », pas « j'ai voudrais ».", whyEn:"Say je voudrais, not j'ai voudrais."}]},
 {t:'npc', text:"[[Tiguidou|Parfait|Perfect, OK]]! Avec ça?", en:"Perfect! Anything else?"},
 {t:'fill', prompt:"Choisis le bon partitif.", en:"Choose the right partitive (some).", before:"Je voudrais aussi", after:"chocolat chaud.", opts:['du','de la','des'], ans:'du',
  why:{'de la':"Chocolat est masculin : du chocolat.", 'des':"Des, c'est pour le pluriel. Un chocolat chaud, c'est masculin singulier : du chocolat."}},
 {t:'fill', prompt:"Et pour Karine?", en:"And for Karine?", before:"Pour Karine, je prends", after:"tire d'érable.", opts:['du','de la','de l\''], ans:'de la',
  why:{'du':"Tire est féminin : de la tire.", 'de l\'':"De l', c'est devant une voyelle (de l'eau). Tire commence par une consonne : de la tire."}},
 {t:'fill', prompt:"Tu as soif.", en:"You're thirsty.", before:"Est-ce que je peux avoir", after:"eau, s'il vous plaît?", opts:['du','de la','de l\''], ans:'de l\'',
  why:{'du':"Eau commence par une voyelle : de l'eau.", 'de la':"Devant une voyelle, de la devient de l' : de l'eau."}},
 {t:'npc', text:"Ça fait douze [[piasses|dollars|dollars]]. Merci ben!", en:"That's twelve bucks. Thanks a lot!"},
 {t:'choice', prompt:"Demande à Josée si elle a vu la ceinture.", en:"Ask Josée if she has seen the sash.", opts:[
  {txt:"Est-ce que tu as vu la ceinture fléchée de Bonhomme?", ok:true},
  {txt:"Est-ce que tu as vu le ceinture fléchée de Bonhomme?", why:"Ceinture est féminin : la ceinture.", whyEn:"Ceinture is feminine: la ceinture."},
  {txt:"Est-ce que tu vois la ceinture fléchée à Bonhomme hier?", why:"Hier = passé, donc passé composé : as-tu vu. Et en français standard, on écrit « la ceinture de Bonhomme ».", whyEn:"Yesterday is past: use the passé composé. In standard French, possession uses de."}]},
 {t:'npc', text:"[[Ben oui|Mais oui|Well yes]]! Un [[gars|garçon, homme|guy]] vient de passer avec une ceinture rouge. Il s'en allait à la glissade, sur la terrasse Dufferin. C'est [[le fun|amusant|fun]], la glissade!", en:"Well yes! A guy just walked by with a red sash. He was heading to the toboggan slide on Dufferin Terrace. The slide is fun!"},
 {t:'choice', prompt:"Qu'est-ce que Josée a dit?", en:"What did Josée say?", opts:[
  {txt:"Un gars vient de passer avec la ceinture.", ok:true},
  {txt:"Un gars va passer avec la ceinture.", why:"« Vient de passer » = c'est déjà arrivé (il y a quelques minutes). « Va passer », c'est le futur.", whyEn:"Vient de passer = it just happened. Va passer is the future."},
  {txt:"Josée a la ceinture dans son kiosque.", why:"Relis bien : le gars est parti à la glissade.", whyEn:"Read again: the guy went to the slide."}]},
 {t:'clue', text:"Un gars avec une ceinture rouge est parti vers la glissade de la terrasse Dufferin."},
 {t:'card', title:"La queue de castor", text:"La queue de castor est une pâte frite, plate et allongée comme la queue d'un castor. On la mange avec du sucre et de la cannelle.", en:"A beaver tail is a flat, stretched piece of fried dough shaped like a beaver's tail, eaten with cinnamon sugar."}
 ]},
{id:'glissade', name:'La glissade', sub:'Les loisirs', who:'patrice', sign:'Glissade', signPos:[32.9,60,8.1,4.1],
 steps:[
 {t:'npc', text:"Allô! Bienvenue à la glissade de la terrasse Dufferin! Ça descend vite en [[titi|très (vite)|really (fast)]]!", en:"Hi! Welcome to the Dufferin Terrace slide! It goes really fast!"},
 {t:'choice', prompt:"Patrice demande : « Qu'est-ce que t'aimes faire l'hiver? »", en:"Patrice asks: What do you like to do in winter?", opts:[
  {txt:"J'aime faire du patin et du ski.", ok:true},
  {txt:"J'aime faire le patin et le ski.", why:"Pour une activité, on dit faire du / de la : faire du patin, faire du ski.", whyEn:"For activities: faire du / de la."},
  {txt:"J'aime jouer du ski.", why:"Jouer de, c'est pour un instrument (jouer de la guitare). Pour un sport comme le ski, on dit faire du ski.", whyEn:"Jouer de is for instruments. For skiing, say faire du ski."}]},
 {t:'fill', prompt:"Parle de Calgary.", en:"Talk about Calgary.", before:"À Calgary, je joue", after:"hockey avec mes amis.", opts:['au','du','à le'], ans:'au',
  why:{'du':"Jouer du, c'est pour un instrument. Pour un sport d'équipe : jouer à + le = au hockey.", 'à le':"À + le se contracte : au. On dit jouer au hockey."}},
 {t:'fill', prompt:"Et ton ami Sam?", en:"And your friend Sam?", before:"Sam ne fait pas de sport. Il joue", after:"guitare.", opts:['à la','de la','au'], ans:'de la',
  why:{'à la':"Pour un instrument, on dit jouer de : jouer de la guitare.", 'au':"Guitare est un instrument (et féminin) : jouer de la guitare."}},
 {t:'npc', text:"Le [[fun|plaisir|fun]], c'est de descendre en toboggan! Pis si t'as le temps, je te suggère d'aller patiner à la place D'Youville. C'est gratuit!", en:"The fun is going down on a toboggan! And if you have time, I suggest you go skating at Place D'Youville. It's free!"},
 {t:'choice', prompt:"Qu'est-ce que Patrice te suggère?", en:"What does Patrice suggest?", opts:[
  {txt:"Il me suggère d'aller patiner à la place D'Youville.", ok:true},
  {txt:"Il me suggère de faire du ski à la place D'Youville.", why:"Écoute bien : il parle de patiner (faire du patin).", whyEn:"Listen: he's talking about skating."},
  {txt:"Il me suggère d'acheter des billets de patin.", why:"C'est gratuit! Il n'y a pas de billets à acheter.", whyEn:"It's free! No tickets to buy."}]},
 {t:'choice', prompt:"Demande à Patrice s'il a vu le gars avec la ceinture.", en:"Ask Patrice if he saw the guy with the sash.", opts:[
  {txt:"As-tu vu un gars avec une ceinture rouge?", ok:true},
  {txt:"As-tu voir un gars avec une ceinture rouge?", why:"Au passé composé, on utilise le participe passé : vu (pas voir).", whyEn:"Use the past participle vu, not voir."},
  {txt:"Tu vas voir un gars avec une ceinture rouge?", why:"C'est le futur proche. Tu veux savoir s'il l'a déjà vu : as-tu vu…?", whyEn:"That's the near future. Ask if he already saw him."}]},
 {t:'npc', text:"Oui! Il vient de descendre la glissade, [[pis|et puis|and then]] il [[s'en va|va|is going]] prendre le traversier pour Lévis. Il était pressé en [[titi|très|really]]!", en:"Yes! He just went down the slide, and now he's going to take the ferry to Lévis. He was in a real hurry!"},
 {t:'choice', prompt:"Où est-ce que le gars va?", en:"Where is the guy going?", opts:[
  {txt:"Il va prendre le traversier pour Lévis.", ok:true},
  {txt:"Il va patiner à la place D'Youville.", why:"Non, c'est la suggestion de Patrice pour toi. Le gars va au traversier.", whyEn:"No, that was Patrice's suggestion for you."},
  {txt:"Il vient de prendre le traversier.", why:"Pas encore! Il vient de descendre la glissade et il va prendre le traversier.", whyEn:"Not yet! He's going to take it."}]},
 {t:'clue', text:"Le gars va prendre le traversier pour Lévis."},
 {t:'card', title:"La terrasse Dufferin", text:"La terrasse Dufferin est une longue promenade en bois à côté du Château Frontenac, au-dessus du fleuve Saint-Laurent. L'hiver, on y installe une glissade de toboggans, une tradition depuis 1884. Le Vieux-Québec est inscrit au patrimoine mondial de l'UNESCO.", en:"Dufferin Terrace is a long wooden boardwalk beside the Château Frontenac, above the St. Lawrence River. In winter a toboggan slide is set up there, a tradition since 1884. Old Québec is a UNESCO World Heritage Site."}
 ]},
{id:'traversier', name:'Le traversier', sub:'Le transport en commun', who:'gagnon', sign:'Billets', signPos:[7.3,48.5,19.8,5.2],
 steps:[
 {t:'npc', text:"Bonjour! Bienvenue à la traverse Québec–Lévis. Je peux vous aider?", en:"Hello! Welcome to the Québec–Lévis ferry. Can I help you?"},
 {t:'choice', prompt:"Mme Gagnon travaille ici et elle te vouvoie. Comment est-ce que tu lui parles?", en:"Mme Gagnon works here and uses vous with you. How do you speak to her?", opts:[
  {txt:"Bonjour madame, je voudrais un billet pour Lévis, s'il vous plaît.", ok:true},
  {txt:"Salut! Donne-moi un billet.", why:"C'est trop familier pour une employée. Avec le personnel, on utilise vous et des formules polies.", whyEn:"Too casual. With staff, use vous and polite phrases."},
  {txt:"Allô! Je veux un billet, toi.", why:"On ne tutoie pas une employée qu'on ne connaît pas. Utilise vous et je voudrais.", whyEn:"Don't use tu with staff you don't know."}]},
 {t:'npc', text:"Un aller simple ou un aller-retour?", en:"One way or return?"},
 {t:'choice', prompt:"Tu reviens à Québec ce soir pour le défilé.", en:"You're coming back to Québec tonight for the parade.", opts:[
  {txt:"Un aller-retour, s'il vous plaît. Je reviens ce soir.", ok:true},
  {txt:"Un aller simple, s'il vous plaît.", why:"Un aller simple, c'est seulement pour aller. Tu dois revenir pour le défilé!", whyEn:"One way only goes there. You need to come back!"}]},
 {t:'npc', text:"Oh non! Le traversier de 14 h vient de partir. Regardez l'horaire.", en:"Oh no! The 2 p.m. ferry just left. Look at the schedule."},
 {t:'board', prompt:"Il est 14 h 10. Le prochain traversier part à quelle heure?", en:"It's 2:10 p.m. What time does the next ferry leave?",
  rows:[['13 h 30','Québec → Lévis','Parti'],['14 h 00','Québec → Lévis','Parti'],['14 h 30','Québec → Lévis','À l\'heure'],['15 h 00','Québec → Lévis','À l\'heure']],
  opts:[{txt:"Il part à 14 h 30.", ok:true},{txt:"Il part à 14 h.", why:"Le traversier de 14 h vient de partir.", whyEn:"The 2 p.m. ferry just left."},{txt:"Il part à 15 h.", why:"Il y en a un avant 15 h. Regarde bien l'horaire.", whyEn:"There's one before 3 p.m."}]},
 {t:'fill', prompt:"Complète.", en:"Complete.", before:"Le traversier", after:"partir. Je vais attendre le prochain.", opts:['vient de','va','est en train de'], ans:'vient de',
  why:{'va':"« Va partir » = futur. Mais il est déjà parti : vient de partir.", 'est en train de':"« Être en train de » = c'est en cours maintenant. Il est déjà parti : vient de partir."}},
 {t:'npc', text:"La traversée dure environ douze minutes. Habillez-vous chaudement, il fait [[frette|très froid|really cold]] sur le pont!", en:"The crossing takes about twelve minutes. Dress warmly, it's freezing on the deck!"},
 {t:'choice', prompt:"Mme Gagnon utilise l'impératif. Qu'est-ce qu'elle te dit de faire?", en:"Mme Gagnon uses the imperative. What does she tell you to do?", opts:[
  {txt:"De m'habiller chaudement.", ok:true},
  {txt:"D'acheter un chocolat chaud.", why:"Relis : « Habillez-vous chaudement ».", whyEn:"Read again: dress warmly."},
  {txt:"De rester à l'intérieur.", why:"Elle parle des vêtements : « Habillez-vous chaudement ».", whyEn:"She's talking about clothes."}]},
 {t:'clue', text:"Tu prends le traversier de 14 h 30 pour Lévis."},
 {t:'card', title:"La traverse Québec–Lévis", text:"Le traversier relie Québec et Lévis toute l'année, même quand il y a de la glace sur le fleuve Saint-Laurent. Pendant le Carnaval, des équipes font la course en canot à glace : elles traversent le fleuve en ramant et en poussant leur canot sur la glace!", en:"The ferry links Québec and Lévis all year, even when there's ice on the St. Lawrence. During Carnival, teams race ice canoes across the river, paddling and pushing their canoes over the ice!"}
 ]},
{id:'levis', name:'Lévis', sub:'La tire sur la neige', who:'pauline', who2:'leo', sign:'Cabane à sucre', signPos:[7.3,50.4,21.9,4.1],
 steps:[
 {t:'npc', text:"Allô, mon [[chou|chéri (affectueux)|sweetie]]! Veux-tu de la tire sur la neige? Elle est bonne en [[titi|très|really]]!", en:"Hello, sweetie! Would you like some maple taffy on snow? It's really good!"},
 {t:'fill', prompt:"Pauline est une dame âgée que tu ne connais pas. Réponds poliment.", en:"Pauline is an older lady you don't know. Answer politely.", before:"Oui, j'aimerais", after:"tire, s'il vous plaît.", opts:['de la','du','des'], ans:'de la',
  why:{'du':"Tire est féminin : de la tire.", 'des':"La tire n'est pas au pluriel ici : de la tire."}},
 {t:'npc', text:"Tiens, prends un bâton. Roule la tire sur le bâton, pis mange-la tout de suite!", en:"Here, take a stick. Roll the taffy onto the stick, then eat it right away!"},
 {t:'choice', prompt:"Tu vois un garçon avec une ceinture rouge! Demande à Pauline.", en:"You see a boy with a red sash! Ask Pauline.", opts:[
  {txt:"Excusez-moi, madame, qui est ce garçon?", ok:true},
  {txt:"Hé, c'est qui, ce gars-là, toi?", why:"Avec une dame âgée que tu ne connais pas, utilise vous et une formule polie (excusez-moi, madame).", whyEn:"With an older stranger, use vous and polite phrases."},
  {txt:"Excusez-moi, madame, que est ce garçon?", why:"Pour une personne, on utilise qui : qui est ce garçon?", whyEn:"For a person, use qui."}]},
 {t:'npc', who:'leo', text:"C'est moi, Léo! J'ai trouvé cette ceinture par terre, à côté de la glissade. Mon oncle m'a ramené à Lévis en traversier. Elle est belle, hein? Je veux la garder!", en:"It's me, Léo! I found this sash on the ground next to the slide. My uncle brought me back to Lévis on the ferry. It's nice, eh? I want to keep it!"},
 {t:'choice', prompt:"Explique à Léo à qui est la ceinture.", en:"Explain to Léo whose sash it is.", opts:[
  {txt:"Cette ceinture, c'est la ceinture de Bonhomme!", ok:true},
  {txt:"Cette ceinture, c'est son ceinture à Bonhomme!", why:"Ceinture est féminin : sa ceinture. Et pour la possession, on écrit de : la ceinture de Bonhomme. (Au Québec, on entend souvent « à Bonhomme » en parlant.)", whyEn:"Ceinture is feminine. In writing, possession uses de."},
  {txt:"Cette ceinture, c'est ta ceinture, Léo!", why:"Non, elle n'est pas à Léo. Elle est à Bonhomme!", whyEn:"No, it isn't Léo's."}]},
 {t:'choice', prompt:"Dis à Léo pourquoi c'est urgent.", en:"Tell Léo why it's urgent.", opts:[
  {txt:"Il faut la rapporter avant le défilé de ce soir!", ok:true},
  {txt:"Il faut rapporter la avant le défilé!", why:"Le pronom va avant l'infinitif : il faut la rapporter.", whyEn:"The pronoun goes before the infinitive."},
  {txt:"Il faut la rapporter la semaine prochaine.", why:"Le défilé est ce soir! C'est urgent.", whyEn:"The parade is tonight!"}]},
 {t:'npc', who:'leo', text:"Ah ben, OK d'abord! Je [[peux-tu|est-ce que je peux|can I]] venir avec toi au défilé? Grand-maman, on y va?", en:"Oh well, OK then! Can I come with you to the parade? Grandma, can we go?"},
 {t:'fill', prompt:"Annonce la bonne nouvelle à Karine (texto).", en:"Text the good news to Karine.", before:"Karine! Nous", after:"trouver la ceinture!", opts:['venons de','allons','sommes en train de'], ans:'venons de',
  why:{'allons':"« Nous allons trouver » = futur. Mais c'est fait! Nous venons de trouver.", 'sommes en train de':"C'est déjà fini : nous venons de trouver la ceinture."}},
 {t:'clue', text:"Tu as la ceinture! Léo l'a trouvée près de la glissade."},
 {t:'card', title:"La tire sur la neige", text:"Pour faire de la tire, on fait bouillir du sirop d'érable, puis on le verse sur de la neige propre. Il devient collant et on le roule sur un bâton. Le Québec produit environ 70 % du sirop d'érable du monde. Au printemps, au temps des sucres, les familles vont à la cabane à sucre.", en:"To make maple taffy, you boil maple syrup and pour it on clean snow. It gets sticky and you roll it on a stick. Québec produces about 70% of the world's maple syrup. In spring, during sugaring season, families go to the sugar shack."}
 ]},
{id:'defile', name:'Le défilé', sub:'Raconter ta journée', who:'karine', sign:'Carnaval de Québec', signPos:[42.7,71.1,33.3,5.6], night:true,
 steps:[
 {t:'npc', text:"Tu l'as! T'es [[écoeurant{|e}|génial{|e}|awesome]], [nom]! Vite, raconte-moi ta journée!", en:"You've got it! You're awesome, [nom]! Quick, tell me about your day!"},
 {t:'order', prompt:"Mets ta journée dans l'ordre.", en:"Put your day in order.", items:[
  "J'ai mangé une queue de castor au kiosque.",
  "Je suis allé{|e} à la glissade.",
  "J'ai pris le traversier pour Lévis.",
  "J'ai trouvé Léo et la ceinture.",
  "Je suis revenu{|e} pour le défilé."]},
 {t:'fill', prompt:"Avec être ou avoir?", en:"With être or avoir?", before:"Léo et moi, nous", after:"revenus ensemble en traversier.", opts:['avons','sommes','sont'], ans:'sommes',
  why:{'avons':"Revenir se conjugue avec être au passé composé : nous sommes revenus.", 'sont':"Avec nous, c'est sommes : nous sommes revenus."}},
 {t:'npc', text:"As-tu fait de la glissade?", en:"Did you go down the slide?"},
 {t:'choice', prompt:"Tu n'as pas eu le temps. Réponds au négatif.", en:"You didn't have time. Answer in the negative.", opts:[
  {txt:"Non, je n'ai pas fait de glissade. Je n'ai pas eu le temps!", ok:true},
  {txt:"Non, je ne pas ai fait de glissade.", why:"Au passé composé, ne… pas entoure l'auxiliaire : je n'ai pas fait.", whyEn:"In the passé composé, ne… pas goes around the auxiliary."},
  {txt:"Non, je n'ai fait pas de glissade.", why:"Pas va après l'auxiliaire (ai), avant le participe : je n'ai pas fait.", whyEn:"Pas goes right after the auxiliary."}]},
 {t:'npc', text:"Pas grave! Bonhomme vient de remettre sa ceinture. Regarde, le défilé commence! Merci mille fois, pis bon Carnaval!", en:"No worries! Bonhomme just put his sash back on. Look, the parade is starting! Thanks a million, and happy Carnival!"},
 {t:'card', title:"La ceinture fléchée", text:"La ceinture fléchée est tissée aux doigts, sans métier à tisser. Les voyageurs du commerce des fourrures la portaient autour de la taille. Elle est aussi un symbole important pour la Nation métisse, y compris les Métis de l'Alberta. Aujourd'hui, c'est un symbole du Carnaval de Québec.", en:"The woven sash (ceinture fléchée) is finger-woven, without a loom. Fur-trade voyageurs wore it around the waist. It is also an important symbol for the Métis Nation, including Métis people in Alberta. Today it's a symbol of the Québec Winter Carnival."}
 ]}
];
