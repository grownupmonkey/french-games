/* ===== Escale 3 : Acadie (Caraquet, 15 août) — La veillée =====
   Curriculum (French 20-3Y): 20 C 1.1 (interests, collections), 20 C 1.3 (social outings);
   20 R 2.10b jouer à / jouer de / faire de, 2.5d verb + à / de + infinitive (essayer de, oublier de, finir de,
   apprendre à, commencer à), 2.2c pronoms relatifs qui / que, 3.3 regional French (acadien, chiac),
   2.7b-c passé composé review. Culture: Fête nationale de l'Acadie, Tintamarre, Grand Dérangement, Antonine Maillet,
   Acadian music (R 4.1d). Text markup: [[mot régional|français standard|English]], {masc|fém}, [nom]. */
const GAME={id:'acadie', title:'La veillée', place:'Acadie', eyebrow:'Escale 3 · Caraquet, Acadie, le 15 août',
 introName:'Arrivée à Caraquet', mapAria:'Plan de Caraquet', playerExtra:{noHat:true, scarf:''},
 mapLabels:`<span class="maplabel river" style="left:40%;top:8%">baie des Chaleurs</span><span class="maplabel" style="left:4%;top:86%">Caraquet, Nouveau-Brunswick</span><span class="maplabel" style="left:8%;top:57%;font-size:1.3cqw">boulevard Saint-Pierre</span>`,
 lede:"Ce soir, la famille d'Émilie fait une veillée de cuisine. Le groupe a besoin d'un musicien de plus : apprends à jouer des cuillères avant le Tintamarre!",
 endText:"Grâce à toi, le groupe de Pépère avait ses cuillères, et la veillée a duré jusqu'à minuit. Tu as gagné le tampon de l'Acadie dans ton passeport."};

const INTRO={who:'emilie', steps:[
 {t:'npc', text:"Allô [nom]! [[Welcome|Bienvenue (chiac)|Welcome]] à Caraquet! Moi, c'est Émilie. Je viens de Moncton, mais je passe l'été chez mes grands-parents. Aujourd'hui, c'est le 15 août, la fête nationale de l'Acadie!", en:"Hi [nom]! Welcome to Caraquet! I'm Émilie. I'm from Moncton, but I spend the summer at my grandparents'. Today is August 15, Acadia's national holiday!"},
 {t:'choice', prompt:"Réponds à Émilie.", en:"Answer Émilie.", opts:[
  {txt:"Bonne fête de l'Acadie! Qu'est-ce qu'on fait aujourd'hui?", ok:true},
  {txt:"Bon fête de l'Acadie! Qu'est-ce qu'on fait aujourd'hui?", why:"Fête est féminin : bonne fête.", whyEn:"Fête is feminine: bonne fête."},
  {txt:"Bonne fête de l'Acadie! Qu'est-ce que on fait aujourd'hui?", why:"Devant une voyelle, que devient qu' : qu'est-ce qu'on fait.", whyEn:"Before a vowel, que becomes qu'."}]},
 {t:'npc', text:"À 17 h 55, il y a le Tintamarre : tout le monde fait du bruit dans la rue! Pis ce soir, mon pépère fait une veillée dans sa cuisine. On joue de la musique [[right|très (chiac)|really]] tard!", en:"At 5:55 p.m., there's the Tintamarre: everyone makes noise in the street! And tonight, my grandpa is having a kitchen party. We play music really late!"},
 {t:'npc', text:"Mais on a un problème. Notre groupe a besoin d'un musicien de plus. Pépère cherche quelqu'un qui peut jouer des cuillères. Veux-tu essayer?", en:"But we have a problem. Our band needs one more musician. Grandpa is looking for someone who can play the spoons. Do you want to try?"},
 {t:'choice', prompt:"Accepte. Attention au verbe essayer!", en:"Accept. Watch the verb essayer!", opts:[
  {txt:"Oui! Je vais essayer de jouer des cuillères!", ok:true},
  {txt:"Oui! Je vais essayer à jouer des cuillères!", why:"Essayer est suivi de de : essayer de + infinitif.", whyEn:"Essayer takes de: essayer de + infinitive."},
  {txt:"Oui! Je vais essayer jouer des cuillères!", why:"Il manque la préposition : essayer de jouer.", whyEn:"The preposition is missing: essayer de jouer."}]},
 {t:'npc', text:"[[Awesome|Génial (chiac)|Awesome]]! Avant, va chercher l'accordéon de mon oncle Réjean. Il a oublié de le rapporter à la maison. Il est sur son bateau, au quai.", en:"Awesome! First, go get my uncle Réjean's accordion. He forgot to bring it home. It's on his boat, at the wharf."},
 {t:'card', title:"La fête nationale de l'Acadie", text:"Les Acadiens ont choisi le 15 août comme fête nationale en 1881. Leur drapeau, adopté en 1884, est bleu, blanc et rouge, avec une étoile jaune : l'étoile de la mer (Stella Maris). Aujourd'hui, des Acadiens vivent surtout au Nouveau-Brunswick, en Nouvelle-Écosse, à l'Île-du-Prince-Édouard et en Louisiane.", en:"Acadians chose August 15 as their national holiday in 1881. Their flag, adopted in 1884, is blue, white and red with a yellow star: the star of the sea (Stella Maris). Today, Acadians live mostly in New Brunswick, Nova Scotia, Prince Edward Island and Louisiana."}
]};

const STOPS=[
{id:'quai', name:'Le quai', sub:'Les bateaux de pêche', who:'rejean', toast:'En route vers le quai de Caraquet…',
 steps:[
 {t:'npc', text:"Salut! T'es l'ami{|e} d'Émilie? Bienvenue au quai! Aujourd'hui, tout le monde décore son bateau avec des drapeaux acadiens.", en:"Hi! You're Émilie's friend? Welcome to the wharf! Today everyone decorates their boat with Acadian flags."},
 {t:'npc', text:"Mon bateau, c'est le bateau rouge qui a le grand drapeau en haut du mât. C'est le bateau que mon père a construit!", en:"My boat is the red boat that has the big flag at the top of the mast. It's the boat my father built!"},
 {t:'fill', prompt:"Qui ou que? Après qui, il y a un verbe. Après que, il y a un sujet.", en:"Qui or que? Qui is followed by a verb; que is followed by a subject.", before:"C'est le bateau", after:"a le grand drapeau.", opts:['qui','que','qu\''], ans:'qui',
  why:{'que':"Après le blanc, il y a un verbe (a) : on utilise qui, le sujet du verbe.", "qu'":"Qu' remplace que devant une voyelle, mais ici il faut qui : le bateau a le drapeau, donc qui est le sujet."}},
 {t:'fill', prompt:"Et maintenant?", en:"And now?", before:"C'est le bateau", after:"mon père a construit.", opts:['qui','que','quoi'], ans:'que',
  why:{'qui':"Après le blanc, il y a un sujet (mon père) : on utilise que.", 'quoi':"Quoi n'est pas un pronom relatif ici. Il y a un sujet après : que."}},
 {t:'npc', text:"L'accordéon? Ah oui, j'ai oublié de le rapporter! Il est dans la cabine. Je joue de l'accordéon depuis quarante ans!", en:"The accordion? Oh yes, I forgot to bring it back! It's in the cabin. I've been playing the accordion for forty years!"},
 {t:'fill', prompt:"Pour un instrument, jouer de…", en:"For an instrument, jouer de…", before:"Réjean joue", after:"accordéon.", opts:["de l'","à l'","du"], ans:"de l'",
  why:{"à l'":"Jouer à, c'est pour un sport ou un jeu. Pour un instrument : jouer de. Devant une voyelle : de l'accordéon.", 'du':"Accordéon commence par une voyelle : de l'accordéon (pas du)."}},
 {t:'choice', prompt:"Réjean demande : « Pis toi, qu'est-ce que tu fais pour t'amuser? »", en:"Réjean asks: And you, what do you do for fun?", opts:[
  {txt:"Je joue au soccer et je fais de la natation.", ok:true},
  {txt:"Je joue du soccer et je fais de la natation.", why:"Jouer de, c'est pour un instrument. Pour un sport d'équipe : jouer au soccer.", whyEn:"Jouer de is for instruments. For a team sport: jouer au."},
  {txt:"Je joue au soccer et je joue à la natation.", why:"La natation n'est pas un jeu : on dit faire de la natation.", whyEn:"Swimming isn't a game: faire de la natation."}]},
 {t:'npc', text:"Tiens, l'accordéon. Fais attention, il est vieux! [[Asteure|Maintenant (acadien)|Now]], va au magasin général chercher du maquillage pour le Tintamarre.", en:"Here's the accordion. Be careful, it's old! Now go to the general store and get some face paint for the Tintamarre."},
 {t:'clue', text:"Tu as l'accordéon de Réjean. Prochain arrêt : le magasin général, pour du maquillage."},
 {t:'card', title:"Caraquet et la pêche", text:"Caraquet est un port de pêche de la Péninsule acadienne, au bord de la baie des Chaleurs. On y pêche le homard, le crabe des neiges et le hareng. Chaque mois d'août, pendant le Festival acadien, les bateaux décorés reçoivent une bénédiction pour une saison de pêche sans danger.", en:"Caraquet is a fishing port on the Acadian Peninsula, on the Bay of Chaleur. People fish for lobster, snow crab and herring. Every August, during the Acadian Festival, the decorated boats are blessed for a safe fishing season."}
 ]},
{id:'magasin', name:'Le magasin général', sub:'Les collections', who:'nicole', sign:'Magasin général', signPos:[33.3,9.3,33.3,6.5], toast:'En route vers le magasin général…',
 steps:[
 {t:'npc', text:"Bonjour! Bonne fête de l'Acadie! Qu'est-ce que je peux faire pour toi?", en:"Hello! Happy Acadia Day! What can I do for you?"},
 {t:'choice', prompt:"Demande du maquillage aux couleurs du drapeau.", en:"Ask for face paint in the flag's colours.", opts:[
  {txt:"Je cherche du maquillage bleu, blanc et rouge pour le Tintamarre.", ok:true},
  {txt:"Je cherche de la maquillage bleu, blanc et rouge.", why:"Maquillage est masculin : du maquillage.", whyEn:"Maquillage is masculine: du maquillage."},
  {txt:"Je cherche du maquillage bleue, blanche et rouge.", why:"Les adjectifs s'accordent avec maquillage, qui est masculin : bleu, blanc et rouge.", whyEn:"The adjectives agree with maquillage, which is masculine."}]},
 {t:'npc', text:"Regarde sur le comptoir, à côté des casseroles. Pour le Tintamarre, tu peux aussi taper sur une casserole avec une cuillère de bois!", en:"Look on the counter, next to the pots. For the Tintamarre, you can also bang on a pot with a wooden spoon!"},
 {t:'npc', text:"Moi, je collectionne les vieilles cartes postales de Caraquet. Regarde, j'en ai plus de deux cents!", en:"I collect old postcards of Caraquet. Look, I have more than two hundred!"},
 {t:'fill', prompt:"Nicole te montre sa collection.", en:"Nicole shows you her collection.", before:"Voici la carte", after:"je préfère.", opts:['que','qui','qu\''], ans:'que',
  why:{'qui':"Après le blanc, il y a un sujet (je) : on utilise que.", "qu'":"Qu', c'est devant une voyelle. Ici, je commence par une consonne : que."}},
 {t:'fill', prompt:"Et celle-là?", en:"And that one?", before:"Et voici une carte", after:"montre le vieux quai.", opts:['qui','que','où'], ans:'qui',
  why:{'que':"Après le blanc, il y a un verbe (montre) : on utilise qui.", 'où':"Où, c'est pour un lieu ou un moment. La carte montre le quai : qui."}},
 {t:'choice', prompt:"Nicole demande : « Pis toi, est-ce que tu collectionnes quelque chose? »", en:"Nicole asks: And you, do you collect anything?", opts:[
  {txt:"Oui, je collectionne les cartes de hockey.", ok:true},
  {txt:"Oui, je collection les cartes de hockey.", why:"Le verbe est collectionner : je collectionne.", whyEn:"The verb is collectionner: je collectionne."},
  {txt:"Oui, je collectionne de les cartes de hockey.", why:"Après collectionner, on met directement l'article : je collectionne les cartes.", whyEn:"No de after collectionner."}]},
 {t:'choice', prompt:"Nicole demande ce que tu vas faire ce soir. Utilise apprendre.", en:"Nicole asks what you're doing tonight. Use apprendre.", opts:[
  {txt:"J'apprends à jouer des cuillères pour la veillée!", ok:true},
  {txt:"J'apprends de jouer des cuillères pour la veillée!", why:"Apprendre est suivi de à : apprendre à + infinitif.", whyEn:"Apprendre takes à."},
  {txt:"J'apprends jouer des cuillères pour la veillée!", why:"Il manque la préposition : apprendre à jouer.", whyEn:"The preposition is missing."}]},
 {t:'npc', text:"Bonne chance! Commence à pratiquer tout de suite. Va voir Pépère Léonard : c'est le meilleur violoneux du village!", en:"Good luck! Start practising right away. Go see Grandpa Léonard: he's the best fiddler in the village!"},
 {t:'clue', text:"Tu as le maquillage. Prochain arrêt : la cuisine de Pépère et Mémère, pour apprendre les cuillères."},
 {t:'card', title:"Antonine Maillet", text:"L'écrivaine Antonine Maillet est née à Bouctouche, au Nouveau-Brunswick, en 1929. Elle a écrit La Sagouine (1971), l'histoire d'une femme de ménage acadienne qui parle en français acadien. En 1979, elle a gagné le prix Goncourt, un grand prix littéraire de France, pour Pélagie-la-Charrette.", en:"Writer Antonine Maillet was born in Bouctouche, New Brunswick, in 1929. She wrote La Sagouine (1971), the story of an Acadian cleaning woman who speaks Acadian French. In 1979 she won the Prix Goncourt, a major French literary prize, for Pélagie-la-Charrette."}
 ]},
{id:'cuisine', name:'La cuisine', sub:'Apprendre les cuillères', who:'pepere', who2:'memere', toast:'En route vers la maison de Pépère…',
 steps:[
 {t:'npc', text:"Bienvenue chez nous! [[Espère|Attends (acadien)|Wait]] une minute, je finis de jouer ma [[toune|chanson|tune]].", en:"Welcome to our home! Wait a minute, I'm finishing my tune."},
 {t:'fill', prompt:"Pépère joue un instrument.", en:"Grandpa plays an instrument.", before:"Pépère joue", after:"violon depuis soixante ans.", opts:['du','au','de la'], ans:'du',
  why:{'au':"Jouer au, c'est pour un sport. Pour un instrument : jouer du violon.", 'de la':"Violon est masculin : du violon."}},
 {t:'npc', text:"Bon! Les cuillères, c'est facile. Prends deux cuillères pis mets-les dos à dos. Tiens-les entre tes doigts, pis tape sur ta cuisse, en rythme avec le violon.", en:"OK! The spoons are easy. Take two spoons and put them back to back. Hold them between your fingers, and tap them on your thigh, in rhythm with the fiddle."},
 {t:'order', prompt:"Mets les étapes dans l'ordre.", en:"Put the steps in order.", done:"Bravo! Tu sais jouer des cuillères!", items:[
  "Prends deux cuillères.",
  "Mets-les dos à dos.",
  "Tiens-les entre tes doigts.",
  "Tape sur ta cuisse en rythme."]},
 {t:'choice', prompt:"Dis à Pépère que tu commences à comprendre le rythme.", en:"Tell Grandpa you're starting to understand the rhythm.", opts:[
  {txt:"Je commence à comprendre le rythme!", ok:true},
  {txt:"Je commence comprendre le rythme!", why:"Commencer est suivi de à : je commence à comprendre.", whyEn:"Commencer takes à."},
  {txt:"Je commence de le rythme!", why:"Il faut un verbe à l'infinitif après commencer à : je commence à comprendre le rythme.", whyEn:"Commencer à needs an infinitive after it."}]},
 {t:'npc', who:'memere', text:"As-tu faim, mon [[p'tit cœur|petit cœur|sweetheart]]? Mon fricot au poulet est prêt. Pis il y a de la poutine râpée!", en:"Are you hungry, sweetheart? My chicken fricot is ready. And there's poutine râpée!"},
 {t:'fill', prompt:"Réponds à Mémère.", en:"Answer Grandma.", before:"Oui! J'ai fini", after:"pratiquer, et j'ai très faim!", opts:['de','à','pour'], ans:'de',
  why:{'à':"Finir est suivi de de : finir de + infinitif.", 'pour':"Après finir, on utilise de : j'ai fini de pratiquer."}},
 {t:'npc', text:"Asteure, c'est presque l'heure du Tintamarre! Mets ton maquillage, prends une casserole, pis va rejoindre Émilie dans la rue!", en:"Now it's almost time for the Tintamarre! Put on your face paint, grab a pot, and go join Émilie in the street!"},
 {t:'clue', text:"Tu sais jouer des cuillères! Va au Tintamarre avec Émilie à 17 h 55."},
 {t:'card', title:"La cuisine acadienne", text:"Le fricot est un ragoût de poulet ou de lapin avec des pommes de terre et des boulettes de pâte. La poutine râpée est une grosse boule de pommes de terre râpées avec du porc au centre. Rien à voir avec la poutine du Québec!", en:"Fricot is a chicken or rabbit stew with potatoes and dumplings. Poutine râpée is a big ball of grated potatoes with pork in the middle. Nothing like Québec poutine!"}
 ]},
{id:'tintamarre', name:'Le Tintamarre', sub:'Faire du bruit', who:'emilie', toast:'Il est 17 h 55…',
 steps:[
 {t:'npc', text:"Il est 17 h 55! Le Tintamarre commence! Fais du bruit!", en:"It's 5:55! The Tintamarre is starting! Make some noise!"},
 {t:'fill', prompt:"Complète.", en:"Complete.", before:"Pendant le Tintamarre, on fait", after:"bruit avec des casseroles.", opts:['du','de la','des'], ans:'du',
  why:{'de la':"Bruit est masculin : du bruit.", 'des':"Ici, bruit est singulier : du bruit."}},
 {t:'npc', text:"Tu sais pourquoi 17 h 55? En 1755, les Britanniques ont déporté les Acadiens loin de leurs terres. C'est le Grand Dérangement. Asteure, on fait du bruit pour dire : on est encore là!", en:"Do you know why 5:55? In 1755, the British deported the Acadians far from their lands. It's the Great Upheaval. Now we make noise to say: we're still here!"},
 {t:'choice', prompt:"Pourquoi est-ce que le Tintamarre commence à 17 h 55?", en:"Why does the Tintamarre start at 5:55?", opts:[
  {txt:"Pour rappeler 1755, l'année du Grand Dérangement.", ok:true},
  {txt:"Parce que les gens finissent de travailler à 17 h 55.", why:"Relis Émilie : 17 h 55 rappelle l'année 1755.", whyEn:"Read again: 5:55 recalls the year 1755."},
  {txt:"Parce que c'est l'heure du souper.", why:"Non, c'est pour se rappeler 1755, l'année de la déportation.", whyEn:"No, it's to remember 1755."}]},
 {t:'fill', prompt:"Émilie te montre les gens.", en:"Émilie points out people.", before:"Tu vois le monsieur", after:"porte le grand drapeau? C'est mon prof!", opts:['qui','que','qu\''], ans:'qui',
  why:{'que':"Après le blanc, il y a un verbe (porte) : qui.", "qu'":"Il faut qui : le monsieur porte le drapeau, il est le sujet."}},
 {t:'npc', text:"C'est [[right|très (chiac)|really]] le fun, hein? J'ai [[enjoyé|aimé (chiac)|enjoyed]] ça en masse!", en:"It's really fun, eh? I enjoyed it a lot!"},
 {t:'choice', prompt:"Émilie parle chiac. Comment est-ce qu'on dit ça en français standard?", en:"Émilie speaks chiac. How do you say that in standard French?", opts:[
  {txt:"C'est vraiment amusant! J'ai beaucoup aimé ça!", ok:true},
  {txt:"C'est right amusant! J'ai enjoyé ça!", why:"Right et enjoyé sont des mots anglais du chiac. En français standard : vraiment, aimé.", whyEn:"Right and enjoyé come from English. Standard French: vraiment, aimé."},
  {txt:"C'est très ennuyant! Je n'ai pas aimé ça!", why:"Émilie adore le Tintamarre! Elle dit que c'est vraiment amusant.", whyEn:"Émilie loves it!"}]},
 {t:'clue', text:"Le Tintamarre est fini. La veillée commence chez Pépère!"},
 {t:'card', title:"Le Tintamarre et le chiac", text:"Chaque 15 août, des milliers de personnes défilent dans les rues de Caraquet avec des casseroles, des sifflets et des drapeaux. Dans la région de Moncton, beaucoup de jeunes parlent le chiac, un mélange de français acadien et d'anglais. Le groupe Radio Radio rappe dans ce français acadien plein de mots anglais.", en:"Every August 15, thousands of people parade through Caraquet's streets with pots, whistles and flags. In the Moncton area, many young people speak chiac, a mix of Acadian French and English. The group Radio Radio raps in this Acadian French full of English words."}
 ]},
{id:'veillee', name:'La veillée', sub:'Jouer avec le groupe', who:'pepere', night:true, toast:'Retour chez Pépère pour la veillée…',
 steps:[
 {t:'npc', text:"Mesdames et messieurs, voici {notre nouveau musicien|notre nouvelle musicienne}, [nom], de Calgary!", en:"Ladies and gentlemen, here is our new musician, [nom], from Calgary!"},
 {t:'choice', prompt:"Présente-toi aux invités.", en:"Introduce yourself to the guests.", opts:[
  {txt:"Bonsoir tout le monde! Ce soir, je joue des cuillères!", ok:true},
  {txt:"Bonsoir tout le monde! Ce soir, je joue aux cuillères!", why:"Les cuillères sont un instrument ici : jouer de + les = jouer des cuillères.", whyEn:"Here the spoons are an instrument: jouer des cuillères."},
  {txt:"Bonsoir tout le monde! Ce soir, je fais les cuillères!", why:"Pour un instrument, on dit jouer de : je joue des cuillères.", whyEn:"For an instrument, use jouer de."}]},
 {t:'npc', who:'emilie', text:"Pendant la pause, raconte ta journée à tout le monde!", en:"During the break, tell everyone about your day!"},
 {t:'order', prompt:"Raconte ta journée dans l'ordre.", en:"Tell about your day in order.", done:"Bravo! Tout le monde applaudit.", items:[
  "Je suis allé{|e} au quai chercher l'accordéon.",
  "J'ai acheté du maquillage au magasin général.",
  "J'ai appris à jouer des cuillères avec Pépère.",
  "J'ai fait du bruit au Tintamarre.",
  "J'ai joué avec le groupe à la veillée."]},
 {t:'fill', prompt:"Émilie te remercie.", en:"Émilie thanks you.", before:"C'est toi", after:"as sauvé la veillée!", opts:['qui','que','quoi'], ans:'qui',
  why:{'que':"Après le blanc, il y a un verbe (as sauvé) : qui.", 'quoi':"Ici, il faut le pronom relatif qui (sujet du verbe as sauvé)."}},
 {t:'choice', prompt:"Émilie demande : « Tu vas pratiquer à Calgary? » Réponds avec oublier.", en:"Émilie asks: Will you practise in Calgary? Answer with oublier.", opts:[
  {txt:"Oui, et je ne vais pas oublier de pratiquer!", ok:true},
  {txt:"Oui, et je ne vais pas oublier à pratiquer!", why:"Oublier est suivi de de : oublier de + infinitif.", whyEn:"Oublier takes de."},
  {txt:"Oui, et je ne vais pas oublier pratiquer!", why:"Il manque la préposition : oublier de pratiquer.", whyEn:"The preposition is missing."}]},
 {t:'npc', who:'emilie', text:"Merci, [nom]! Demain, tu pars pour Dakar, au Sénégal, c'est ça? [[Wow|Wow|Wow]]! Écris-moi!", en:"Thanks, [nom]! Tomorrow you leave for Dakar, in Senegal, right? Wow! Write to me!"},
 {t:'card', title:"La musique acadienne", text:"Dans les veillées acadiennes, on chante, on danse et on joue du violon, de la guitare, de l'accordéon et des cuillères. La chanteuse Édith Butler vient de Paquetville, tout près de Caraquet. Aujourd'hui, des artistes comme Lisa LeBlanc, du Nouveau-Brunswick, font connaître la musique acadienne partout dans le monde.", en:"At Acadian kitchen parties, people sing, dance and play fiddle, guitar, accordion and spoons. Singer Édith Butler comes from Paquetville, very close to Caraquet. Today, artists like Lisa LeBlanc, from New Brunswick, bring Acadian music to the whole world."}
 ]}
];
