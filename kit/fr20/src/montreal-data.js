/* ===== Escale 2 : Montréal — Le grand spectacle =====
   Curriculum (French 20-3Y): 20 C 3.3 (transport en commun), 3.4 (interactions in the community);
   20 R 2.8a-b impératif (tu / vous / nous, affirmative and negative), 2.13a-c prepositions, prepositional phrases
   and adverbs of location (devant, derrière, entre, à côté de, en face de, tout droit, à gauche, à droite, ici, là-bas),
   2.6a futur proche, 2.1h contractions (au, du), quantities + de, 3.2 tu / vous, 3.3 Québécois features (Montréal),
   2.7b-c passé composé review. 20 R 4.1d francophone figures (Michel Tremblay).
   Text markup: [[mot québécois|français standard|English]], {masc|fém} agreement, [nom] player name. */
const GAME={id:'montreal', title:'Le grand spectacle', place:'Montréal', eyebrow:'Escale 2 · Montréal, Montréal en lumière',
 introName:'Arrivée à Montréal', mapAria:'Plan du métro de Montréal',
 mapLabels:`<span class="maplabel" style="left:22%;top:30%">Mont Royal</span><span class="maplabel" style="left:4%;top:6%">Montréal</span><span class="maplabel river" style="left:62%;top:88%">fleuve Saint-Laurent</span>`,
 lede:"Va chercher les billets du spectacle de Malik et rejoins Amira devant la Place des Arts à 19 h 30. Prends le métro!",
 endText:"Grâce à toi, Amira a eu ses billets, et vous êtes arrivé{s|es} à l'heure au spectacle de Malik. Tu as gagné le tampon de Montréal dans ton passeport."};

const INTRO={who:'amira', steps:[
 {t:'npc', text:"Salut [nom]! T'es arrivé{|e} à Montréal? Bienvenue! Ce soir, on va voir le spectacle de mon frère Malik à la Place des Arts. Il chante pendant le festival Montréal en lumière!", en:"Hi [nom]! You've arrived in Montréal? Welcome! Tonight we're going to see my brother Malik's show at Place des Arts. He's singing during the Montréal en lumière festival!"},
 {t:'choice', prompt:"Réponds à Amira. Le spectacle, c'est ce soir.", en:"Answer Amira. The show is tonight.", opts:[
  {txt:"Super! On va voir le spectacle ce soir!", ok:true},
  {txt:"Super! On vient de voir le spectacle!", why:"Venir de = c'est déjà fini. Le spectacle est ce soir, dans le futur : on va voir (aller + infinitif).", whyEn:"Venir de means it's already over. The show is tonight: use aller + infinitive."},
  {txt:"Super! On va vu le spectacle ce soir!", why:"Au futur proche, le deuxième verbe est à l'infinitif : on va voir.", whyEn:"In the futur proche, the second verb is an infinitive: on va voir."}]},
 {t:'npc', text:"Petit problème : la batterie de mon [[cell|téléphone cellulaire|cell phone]] est presque morte, pis j'ai oublié les billets chez ma tante Samira, au marché Jean-Talon. Va les chercher, s'il te plaît!", en:"Little problem: my cell phone battery is almost dead, and I forgot the tickets at my aunt Samira's, at the Jean-Talon market. Please go get them!"},
 {t:'choice', prompt:"Amira utilise l'impératif. Qu'est-ce qu'elle te demande?", en:"Amira uses the imperative. What is she asking you?", opts:[
  {txt:"D'aller chercher les billets au marché Jean-Talon.", ok:true},
  {txt:"D'acheter des billets à la Place des Arts.", why:"Relis : « Va les chercher » chez sa tante, au marché Jean-Talon.", whyEn:"Read again: go get them at her aunt's, at the market."},
  {txt:"De charger son cellulaire.", why:"Sa batterie est morte, mais elle te demande d'aller chercher les billets.", whyEn:"Her battery is dead, but she's asking you to get the tickets."}]},
 {t:'npc', text:"Le spectacle commence à 20 h. Rejoins-moi devant la Place des Arts à 19 h 30. Prends le métro, c'est facile!", en:"The show starts at 8 p.m. Meet me in front of Place des Arts at 7:30. Take the métro, it's easy!"},
 {t:'fill', prompt:"Écris un rappel dans ton carnet.", en:"Write a reminder in your notebook.", before:"Rendez-vous avec Amira", after:"la Place des Arts à 19 h 30.", opts:['devant','derrière','sous'], ans:'devant',
  why:{'derrière':"Derrière = behind. Amira a dit « devant » (in front of).", 'sous':"Sous = under. On ne se rencontre pas sous un édifice! Amira a dit « devant »."}},
 {t:'card', title:"Montréal, ville francophone", text:"Montréal est la plus grande ville francophone des Amériques. On y entend aussi beaucoup d'anglais et d'autres langues. Dans les magasins du centre-ville, on vous accueille souvent avec « Bonjour-Hi! » pour vous laisser choisir la langue.", en:"Montréal is the largest French-speaking city in the Americas. You also hear a lot of English and other languages there. In downtown stores, people often greet you with \"Bonjour-Hi!\" to let you choose the language."}
]};

const STOPS=[
{id:'metro', name:'Le métro', sub:'Acheter un billet, choisir la ligne', who:'stephane', sign:'Berri-UQAM', signPos:[37.5,20.4,25,8.5], toast:'En route vers la station Berri-UQAM…',
 signs:[['Billets',6.3,33.3,20.8,5.2]],
 steps:[
 {t:'npc', text:"Bonjour! Bienvenue dans le métro de Montréal. Je peux vous aider?", en:"Hello! Welcome to the Montréal métro. Can I help you?"},
 {t:'choice', prompt:"Stéphane travaille ici et il te vouvoie. Demande un billet.", en:"Stéphane works here and uses vous. Ask for a ticket.", opts:[
  {txt:"Bonjour monsieur, je voudrais acheter un billet, s'il vous plaît.", ok:true},
  {txt:"Salut! Donne-moi un billet.", why:"C'est trop familier avec un employé. Utilise vous et une formule polie : je voudrais…, s'il vous plaît.", whyEn:"Too casual with an employee. Use vous and a polite phrase."},
  {txt:"Bonjour monsieur, je voudrais achète un billet.", why:"Après je voudrais, le verbe reste à l'infinitif : acheter.", whyEn:"After je voudrais, the verb stays in the infinitive."}]},
 {t:'npc', text:"Voilà votre billet. Vous allez où?", en:"Here's your ticket. Where are you going?"},
 {t:'choice', prompt:"Tu vas au marché Jean-Talon.", en:"You're going to the Jean-Talon market.", opts:[
  {txt:"Je vais au marché Jean-Talon.", ok:true},
  {txt:"Je vais à le marché Jean-Talon.", why:"À + le se contracte : au. Je vais au marché.", whyEn:"À + le contracts to au."},
  {txt:"Je vais en marché Jean-Talon.", why:"Pour un endroit comme un marché, on dit à : à + le = au marché.", whyEn:"For a place like a market, use à: au marché."}]},
 {t:'npc', text:"Alors, écoutez bien. Prenez la ligne orange, direction Montmorency. Descendez à la station Jean-Talon. Ne prenez pas la ligne verte, ce n'est pas la bonne!", en:"So, listen carefully. Take the orange line, toward Montmorency. Get off at Jean-Talon station. Don't take the green line, it's not the right one!"},
 {t:'board', prompt:"Regarde le plan. Quelle ligne est-ce que tu vas prendre?", en:"Look at the map. Which line are you going to take?", cols:['Ligne','Directions','Arrêt'],
  rows:[['Verte','Angrignon / Honoré-Beaugrand','Place-des-Arts','ontime'],['Orange','Côte-Vertu / Montmorency','Jean-Talon','ontime'],['Jaune','Longueuil','Jean-Drapeau','ontime'],['Bleue','Snowdon / Saint-Michel','Jean-Talon','ontime']],
  opts:[{txt:"Je vais prendre la ligne orange, direction Montmorency.", ok:true},
   {txt:"Je vais prendre la ligne verte, direction Angrignon.", why:"La ligne verte va à la Place des Arts, mais c'est pour plus tard! Stéphane a dit : ligne orange, direction Montmorency.", whyEn:"The green line goes to Place des Arts, but that's for later."},
   {txt:"Je vais prendre la ligne orange, direction Côte-Vertu.", why:"C'est la bonne ligne, mais pas la bonne direction. Pour Jean-Talon, c'est direction Montmorency.", whyEn:"Right line, wrong direction."}]},
 {t:'fill', prompt:"Complète l'instruction de Stéphane (il te vouvoie).", en:"Complete Stéphane's instruction (he uses vous).", before:"", after:"à la station Jean-Talon.", opts:['Descendez','Descendre','Descendons'], ans:'Descendez',
  why:{'Descendre':"C'est l'infinitif. Pour donner une instruction avec vous, on dit : descendez.", 'Descendons':"Descendons = nous (let's get off). Stéphane te parle avec vous : descendez."}},
 {t:'choice', prompt:"Qu'est-ce que Stéphane t'a dit de ne pas faire?", en:"What did Stéphane tell you not to do?", opts:[
  {txt:"Ne prenez pas la ligne verte.", ok:true},
  {txt:"Ne prenez la ligne verte pas.", why:"À l'impératif négatif, ne… pas entoure le verbe : ne prenez pas.", whyEn:"In the negative imperative, ne… pas goes around the verb."},
  {txt:"Ne pas prenez la ligne verte.", why:"Ne va avant le verbe et pas va après : ne prenez pas.", whyEn:"Ne goes before the verb and pas after it."}]},
 {t:'clue', text:"Ligne orange, direction Montmorency, jusqu'à la station Jean-Talon."},
 {t:'card', title:"Le métro de Montréal", text:"Le métro de Montréal a ouvert en 1966. Ses trains roulent sur des pneus, pas seulement sur des roues de métal, alors ils sont plus silencieux. Presque chaque station a sa propre architecture et ses œuvres d'art : c'est comme un musée sous la ville!", en:"The Montréal métro opened in 1966. Its trains run on rubber tires, not just metal wheels, so they're quieter. Almost every station has its own architecture and artwork: it's like a museum under the city!"}
 ]},
{id:'marche', name:'Le marché Jean-Talon', sub:'Trouver les billets', who:'samira', sign:'Fruits et légumes Samira', signPos:[39,17.6,36.5,5.9], toast:'Ligne orange, direction Montmorency…',
 steps:[
 {t:'npc', text:"Ah, c'est toi, l'ami{|e} d'Amira! Bienvenue au marché! Nos pommes viennent des vergers de la Montérégie. Elles sont bonnes, hein?", en:"Ah, you're Amira's friend! Welcome to the market! Our apples come from the orchards of Montérégie. They're good, eh?"},
 {t:'fill', prompt:"Tu veux acheter des pommes pour ton voyage.", en:"You want to buy apples for your trip.", before:"Je voudrais un kilo", after:"pommes, s'il vous plaît.", opts:['de','des','du'], ans:'de',
  why:{'des':"Après une quantité (un kilo, une douzaine, beaucoup), on dit de : un kilo de pommes.", 'du':"Après une quantité, on dit seulement de : un kilo de pommes."}},
 {t:'npc', text:"Les billets? Amira les a laissés ici ce matin… mais où? [[Attends|Attends|Wait]], je pense qu'ils sont dans une enveloppe blanche. Regarde sur mon comptoir!", en:"The tickets? Amira left them here this morning… but where? Wait, I think they're in a white envelope. Look on my counter!"},
 {t:'choice', prompt:"Regarde la scène. Où est l'enveloppe blanche?", en:"Look at the scene. Where is the white envelope?", opts:[
  {txt:"Elle est entre les courges et le sirop d'érable.", ok:true},
  {txt:"Elle est sous les pommes.", why:"Regarde bien : l'enveloppe n'est pas sous les pommes. Elle est entre deux choses.", whyEn:"Look again: it's between two things."},
  {txt:"Elle est derrière Samira.", why:"Non, elle est sur le comptoir, devant Samira, entre les courges et le sirop.", whyEn:"No, it's on the counter in front of Samira."}]},
 {t:'fill', prompt:"Précise.", en:"Be more precise.", before:"L'enveloppe est à côté", after:"sirop d'érable.", opts:['du','de le','de la'], ans:'du',
  why:{'de le':"De + le se contracte : du. À côté du sirop.", 'de la':"Sirop est masculin : à côté du sirop."}},
 {t:'npc', text:"Ben oui, la voilà! Deux billets pour le spectacle de Malik, à 20 h. Qu'est-ce que tu vas faire maintenant?", en:"Well yes, there it is! Two tickets for Malik's show at 8 p.m. What are you going to do now?"},
 {t:'choice', prompt:"Réponds au futur proche.", en:"Answer in the futur proche.", opts:[
  {txt:"Je vais reprendre le métro pour aller à la Place des Arts.", ok:true},
  {txt:"Je vais reprends le métro pour aller à la Place des Arts.", why:"Au futur proche, aller + infinitif : je vais reprendre.", whyEn:"Futur proche = aller + infinitive."},
  {txt:"Je viens de reprendre le métro pour aller à la Place des Arts.", why:"Venir de = c'est déjà fait. Tu vas le faire bientôt : je vais reprendre.", whyEn:"Venir de means it's done. You're going to do it."}]},
 {t:'npc', text:"Avant, arrête-toi sur le Plateau. Amira adore les bagels! Prends la ligne orange vers le sud, direction Côte-Vertu, pis descends à la station Mont-Royal. N'oublie pas les billets!", en:"First, stop on the Plateau. Amira loves bagels! Take the orange line south, toward Côte-Vertu, and get off at Mont-Royal station. Don't forget the tickets!"},
 {t:'choice', prompt:"Samira te tutoie. Quelle phrase est à l'impératif avec tu?", en:"Samira uses tu. Which sentence is in the imperative with tu?", opts:[
  {txt:"Descends à la station Mont-Royal.", ok:true},
  {txt:"Descendez à la station Mont-Royal.", why:"C'est l'impératif avec vous. Samira te tutoie : descends.", whyEn:"That's the vous form. Samira uses tu."},
  {txt:"Tu descendre à la station Mont-Royal.", why:"À l'impératif, il n'y a pas de sujet, et le verbe est conjugué : descends.", whyEn:"The imperative has no subject, and the verb is conjugated."}]},
 {t:'clue', text:"Tu as les billets! Prochain arrêt : station Mont-Royal (ligne orange, direction Côte-Vertu) pour des bagels."},
 {t:'card', title:"Le marché Jean-Talon", text:"Le marché Jean-Talon a ouvert en 1933 dans le quartier de la Petite-Italie. C'est un des plus grands marchés publics en plein air d'Amérique du Nord. Il est ouvert toute l'année, et les agriculteurs du Québec y vendent leurs fruits, leurs légumes et leurs produits de l'érable.", en:"The Jean-Talon market opened in 1933 in the Little Italy neighbourhood. It's one of the largest open-air public markets in North America. It's open all year, and Québec farmers sell their fruit, vegetables and maple products there."}
 ]},
{id:'plateau', name:'Le Plateau', sub:'Demander son chemin', who:'gab', sign:'Bagels', signPos:[79.2,33.3,13.5,5.6], toast:'Ligne orange, direction Côte-Vertu…',
 steps:[
 {t:'npc', text:"Salut! [[T'as|Tu as|You have]] l'air perdu{|e}. Je peux t'aider?", en:"Hi! You look lost. Can I help you?"},
 {t:'choice', prompt:"Gab a ton âge et il te tutoie. Demande ton chemin.", en:"Gab is your age and uses tu. Ask for directions.", opts:[
  {txt:"Oui, merci! Où est la boulangerie de bagels, s'il te plaît?", ok:true},
  {txt:"Oui, merci! Où est le boulangerie de bagels?", why:"Boulangerie est féminin : la boulangerie.", whyEn:"Boulangerie is feminine."},
  {txt:"Oui! Où est la boulangerie, toi?", why:"« Toi » à la fin, c'est impoli. Dis plutôt : s'il te plaît.", whyEn:"Adding toi at the end sounds rude. Say s'il te plaît."}]},
 {t:'npc', text:"C'est pas loin [[pantoute|pas du tout|at all]]! Continue tout droit sur la rue, pis tourne à gauche au coin. La boulangerie est en face du parc, à côté d'un [[dep|dépanneur|corner store]].", en:"It's not far at all! Keep going straight on the street, then turn left at the corner. The bakery is across from the park, next to a corner store."},
 {t:'order', prompt:"Mets les directions de Gab dans l'ordre.", en:"Put Gab's directions in order.", done:"Bravo! Tu as bien compris le chemin.", items:[
  "Continue tout droit sur la rue.",
  "Tourne à gauche au coin.",
  "Cherche le parc.",
  "La boulangerie est en face du parc, à côté du dépanneur."]},
 {t:'choice', prompt:"Gab te tutoie. Comment est-ce qu'il dit « turn left »?", en:"Gab uses tu. How does he say \"turn left\"?", opts:[
  {txt:"Tourne à gauche.", ok:true},
  {txt:"Tournes à gauche.", why:"À l'impératif avec tu, les verbes en -er perdent le s : tourne.", whyEn:"In the tu imperative, -er verbs drop the s."},
  {txt:"Tu tourner à gauche.", why:"À l'impératif, pas de sujet, et le verbe est conjugué : tourne.", whyEn:"No subject in the imperative, and the verb is conjugated."}]},
 {t:'fill', prompt:"Où est la boulangerie?", en:"Where is the bakery?", before:"La boulangerie est en face", after:"parc.", opts:['du','de le','des'], ans:'du',
  why:{'de le':"De + le se contracte : du parc.", 'des':"Des, c'est pour le pluriel. Il y a un seul parc : du parc."}},
 {t:'npc', text:"Pis regarde les escaliers dehors, devant les maisons! C'est typique du Plateau. L'hiver, c'est [[glissant en titi|très glissant|really slippery]]!", en:"And look at the outdoor staircases in front of the houses! It's typical of the Plateau. In winter, they're really slippery!"},
 {t:'fill', prompt:"À la boulangerie, tu commandes.", en:"At the bakery, you order.", before:"Je voudrais une douzaine", after:"bagels au sésame, s'il vous plaît.", opts:['de','des','du'], ans:'de',
  why:{'des':"Après une quantité (une douzaine), on dit de : une douzaine de bagels.", 'du':"Après une quantité, on dit de : une douzaine de bagels."}},
 {t:'clue', text:"Tu as des bagels pour Amira. Ligne orange jusqu'à Berri-UQAM, puis ligne verte jusqu'à Place-des-Arts."},
 {t:'card', title:"Le Plateau-Mont-Royal", text:"Sur le Plateau, beaucoup de maisons ont des escaliers à l'extérieur, en bois ou en fer. Comme ça, il y a plus d'espace à l'intérieur des logements. Le quartier est aussi célèbre pour ses bagels : à Montréal, on les fait bouillir dans de l'eau avec du miel, puis on les cuit dans un four à bois.", en:"On the Plateau, many houses have outdoor staircases, made of wood or iron. That way, there's more space inside the apartments. The neighbourhood is also famous for its bagels: in Montréal they're boiled in honey water, then baked in a wood-fired oven."}
 ]},
{id:'souterrain', name:'La ville souterraine', sub:'Suivre les panneaux', who:'melanie', toast:'Ligne verte, direction Angrignon…',
 signs:[['← Complexe Desjardins',4.2,18.5,24,6.3,'dark'],['Place des Arts →',71.9,18.5,24,6.3,'dark'],['Information',16.7,66.7,16.7,4.8]],
 steps:[
 {t:'npc', text:"Bonsoir! Vous avez l'air pressé{|e}. Vous cherchez quelque chose?", en:"Good evening! You look like you're in a hurry. Are you looking for something?"},
 {t:'choice', prompt:"Mélanie travaille au comptoir d'information. Pose ta question poliment.", en:"Mélanie works at the information desk. Ask your question politely.", opts:[
  {txt:"Excusez-moi, madame, comment est-ce que je vais à la Place des Arts?", ok:true},
  {txt:"Excusez-moi, madame, comment est-ce que je va à la Place des Arts?", why:"Avec je, le verbe aller est : je vais.", whyEn:"With je, aller is je vais."},
  {txt:"Hé! La Place des Arts, c'est où, toi?", why:"Avec une employée que tu ne connais pas, utilise vous et une formule polie.", whyEn:"With staff you don't know, use vous and a polite phrase."}]},
 {t:'npc', text:"C'est facile. Suivez les panneaux. Allez tout droit, puis montez l'escalier mécanique à droite. Ne sortez pas dehors : il fait [[frette|très froid|really cold]] ce soir!", en:"It's easy. Follow the signs. Go straight ahead, then take the escalator up on the right. Don't go outside: it's freezing tonight!"},
 {t:'choice', prompt:"Regarde les panneaux dans la scène. La Place des Arts est de quel côté?", en:"Look at the signs in the scene. Which side is Place des Arts on?", opts:[
  {txt:"À droite.", ok:true},
  {txt:"À gauche.", why:"À gauche, c'est le Complexe Desjardins. Regarde la flèche du panneau « Place des Arts ».", whyEn:"On the left is Complexe Desjardins. Look at the arrow."},
  {txt:"Derrière moi.", why:"Regarde les panneaux devant toi : la flèche pour la Place des Arts va à droite.", whyEn:"Look at the signs in front of you."}]},
 {t:'fill', prompt:"Complète l'instruction de Mélanie (elle te vouvoie).", en:"Complete Mélanie's instruction (she uses vous).", before:"", after:"l'escalier mécanique à droite.", opts:['Montez','Monter','Montes'], ans:'Montez',
  why:{'Monter':"C'est l'infinitif. Avec vous, à l'impératif : montez.", 'Montes':"Avec tu, ce serait monte (sans s). Mélanie te vouvoie : montez."}},
 {t:'choice', prompt:"Qu'est-ce qu'il ne faut pas faire?", en:"What shouldn't you do?", opts:[
  {txt:"Il ne faut pas sortir dehors.", ok:true},
  {txt:"Il ne faut pas suivre les panneaux.", why:"Au contraire! Mélanie a dit : « Suivez les panneaux ».", whyEn:"On the contrary, she said to follow the signs."},
  {txt:"Il ne faut pas monter l'escalier.", why:"Non, elle a dit de monter l'escalier mécanique à droite.", whyEn:"No, she said to take the escalator up."}]},
 {t:'npc', who:'amira', text:"(Texto) T'es où?? Il est 19 h 25! Le spectacle va commencer bientôt!", en:"(Text) Where are you?? It's 7:25! The show is going to start soon!"},
 {t:'fill', prompt:"Réponds à Amira par texto.", en:"Text Amira back.", before:"J'arrive! Je", after:"monter l'escalier mécanique. À tantôt!", opts:['vais','viens de','suis'], ans:'vais',
  why:{'viens de':"Venir de = c'est déjà fait. Tu n'es pas encore monté{|e} : je vais monter.", 'suis':"Je suis monter n'existe pas. Pour le futur proche : je vais monter."}},
 {t:'clue', text:"Suis les panneaux « Place des Arts », puis monte l'escalier mécanique à droite."},
 {t:'card', title:"La ville souterraine", text:"Sous le centre-ville de Montréal, plus de 30 kilomètres de tunnels relient des stations de métro, des centres commerciaux, des universités et des salles de spectacle. L'hiver, on peut traverser une partie de la ville sans mettre son manteau!", en:"Under downtown Montréal, more than 30 kilometres of tunnels link métro stations, shopping centres, universities and concert halls. In winter, you can cross part of the city without putting on your coat!"}
 ]},
{id:'spectacle', name:'Le spectacle', sub:'Raconter ton trajet', who:'amira', sign:'Place des Arts', signPos:[35.4,10.2,29.2,6.5], night:true, toast:'Tu montes l\'escalier mécanique…',
 steps:[
 {t:'npc', text:"Te voilà! T'as les billets? Pis… des bagels?! T'es ben [[fin{|e}|gentil{|le}|kind]]!", en:"There you are! You have the tickets? And… bagels?! You're really kind!"},
 {t:'order', prompt:"Raconte ton trajet à Amira.", en:"Tell Amira about your trip.", done:"Bravo! Tu as bien raconté ton trajet.", items:[
  "J'ai pris la ligne orange jusqu'à Jean-Talon.",
  "J'ai trouvé les billets au marché.",
  "Je suis descendu{|e} à Mont-Royal pour acheter des bagels.",
  "J'ai suivi les panneaux dans la ville souterraine.",
  "Je suis arrivé{|e} devant la Place des Arts."]},
 {t:'npc', text:"Nos places sont dans la première rangée, juste devant la scène! Malik va nous voir!", en:"Our seats are in the first row, right in front of the stage! Malik is going to see us!"},
 {t:'choice', prompt:"Où sont vos places?", en:"Where are your seats?", opts:[
  {txt:"Nos places sont devant la scène.", ok:true},
  {txt:"Nos places sont derrière la scène.", why:"Derrière la scène, c'est pour les artistes! Amira a dit « devant la scène ».", whyEn:"Behind the stage is for the performers."},
  {txt:"Nos places sont loin de la scène.", why:"Elles sont dans la première rangée : près de la scène, devant.", whyEn:"They're in the first row, close to the stage."}]},
 {t:'choice', prompt:"Le spectacle commence! Propose à Amira d'entrer (impératif avec nous).", en:"The show is starting! Suggest going in (imperative with nous).", opts:[
  {txt:"Vite, entrons!", ok:true},
  {txt:"Vite, nous entrons!", why:"Nous entrons, c'est une description. Pour proposer, on enlève le sujet : entrons!", whyEn:"That's a statement. To suggest, drop the subject: entrons!"},
  {txt:"Vite, entrez nous!", why:"À l'impératif avec nous, la forme est : entrons.", whyEn:"The nous imperative is entrons."}]},
 {t:'fill', prompt:"Fais un plan pour après le spectacle.", en:"Make a plan for after the show.", before:"Après le spectacle, nous", after:"manger une poutine avec Malik!", opts:['allons','venons de','sommes'], ans:'allons',
  why:{'venons de':"Venir de = c'est déjà fait. C'est après le spectacle, dans le futur : nous allons manger.", 'sommes':"Nous sommes manger n'existe pas. Futur proche : nous allons manger."}},
 {t:'npc', text:"Merci mille fois, [nom]! Sans toi, on n'avait pas de billets. Demain, tu pars pour l'Acadie, c'est ça? Chanceu{x|se}!", en:"Thanks a million, [nom]! Without you, we had no tickets. Tomorrow you're leaving for Acadia, right? Lucky you!"},
 {t:'card', title:"Montréal et ses artistes", text:"Le Quartier des spectacles, autour de la Place des Arts, accueille des festivals toute l'année, comme Montréal en lumière en hiver. Montréal est aussi la ville de nombreux artistes francophones. L'écrivain Michel Tremblay, né sur le Plateau-Mont-Royal, a écrit la pièce Les Belles-sœurs (1968) en joual, le français populaire de Montréal.", en:"The Quartier des spectacles, around Place des Arts, hosts festivals all year, like Montréal en lumière in winter. Montréal is also home to many francophone artists. Writer Michel Tremblay, born on the Plateau-Mont-Royal, wrote the play Les Belles-sœurs (1968) in joual, the popular French of Montréal."}
 ]}
];
