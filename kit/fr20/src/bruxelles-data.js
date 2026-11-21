/* ===== Escale 6 : Bruxelles — La BD de l'été =====
   Gameplay: comic pages. Students drag each picture into the frame whose caption it shows (reading comprehension:
   the captions use object pronouns, so "who does what to whom" decides the frame; one decoy per page), then
   rewrite the speech bubbles, replacing repeated nouns with the right pronoun in the right place (word tiles).
   Reward: the finished comic, starring the student, plays as an animated album and downloads as an image.
   Curriculum (French 20-3Y): 20 C 4.1 / 4.3 (summer job; leisure in the city);
   20 R 2.2b pronoms compléments directs et indirects (le, la, l', les, lui, leur), placement before the verb
   and before an infinitive (il faut la finir), élision (je l'envoie; je les adore, not j'les).
   Culture: Belgian French (septante, GSM, dîner, à tantôt, s'il vous plaît), frites, the Parcours BD, the Centre belge
   de la bande dessinée (Horta), gaufres, the Grand-Place (UNESCO 1998). R 4.1f. */
const GAME={id:'bruxelles', title:'La BD de l\'été', place:'Bruxelles', eyebrow:'Escale 6 · Bruxelles, Belgique',
 introName:'Arrivée à Bruxelles', endDownload:{finale:'bd', label:'Télécharger ma BD'}, mapAria:'Plan du centre de Bruxelles', playerExtra:{noHat:true, scarf:''},
 mapLabels:`<span class="maplabel" style="left:4%;top:6%">Bruxelles</span><span class="maplabel" style="left:62%;top:86%;font-size:1.3cqw">la petite ceinture</span>`,
 lede:"Ton job d'été dans une friterie devient une bande dessinée! Aide Lucas à monter ses quatre planches : place les images, puis corrige les bulles.",
 endText:"Grâce à toi, la BD de Lucas est finie, et l'éditrice veut la publier. Tu es {le héros|l'héroïne} de « Les aventures de [nom] à Bruxelles ». Tu as gagné le tampon de Bruxelles dans ton passeport."};

const INTRO={who:'lucas', steps:[
 {t:'npc', text:"Salut [nom]! Bienvenue à Bruxelles! Moi, c'est Lucas. J'étudie la bande dessinée, et cet été, je travaille à la friterie de ma tante Nadia… comme toi!", en:"Hi [nom]! Welcome to Brussels! I'm Lucas. I study comics, and this summer I work at my aunt Nadia's friterie… like you!"},
 {t:'npc', text:"J'ai une idée : je vais faire une BD sur ton été. Une éditrice veut la voir samedi! Mais j'ai un problème : mes images sont dans le désordre, et dans mes bulles, je répète toujours les mêmes mots.", en:"I have an idea: I'm going to make a comic about your summer. An editor wants to see it on Saturday! But I have a problem: my pictures are out of order, and in my speech bubbles I always repeat the same words."},
 {t:'npc', text:"Ici, on dit aussi [[septante|soixante-dix (belge)|seventy]] et [[nonante|quatre-vingt-dix (belge)|ninety]]. Et ton téléphone, c'est ton [[GSM|téléphone portable (belge)|cell phone]]! Allez, [[à tantôt|à plus tard (belge)|see you later]] à la friterie!", en:"Here we also say septante (70) and nonante (90). And your phone is your GSM! Come on, see you later at the friterie!"},
 {t:'tiles', prompt:"Lucas te demande : « Tu vas m'aider avec ma BD? » Réponds avec un pronom (la BD = la).", en:"Lucas asks: Will you help me with my comic? Answer with a pronoun.", tiles:['Oui,','je','vais','la','le','lire','lis','tout de suite','!'], answers:['Oui, je vais la lire tout de suite!'],
  hints:{'le':"BD (bande dessinée) est féminin : la.", 'lis':"Après je vais, le verbe reste à l'infinitif : je vais la lire."}, why:"Le pronom se place devant l'infinitif : je vais la lire."},
 {t:'card', title:"La Belgique et le français", text:"La Belgique a trois langues officielles : le français, le néerlandais et l'allemand. Bruxelles, la capitale, est officiellement bilingue (français et néerlandais). Le français de Belgique a ses propres mots : septante (70), nonante (90), le GSM (le téléphone portable), le dîner (le repas de midi) et le souper (le repas du soir).", en:"Belgium has three official languages: French, Dutch and German. Brussels, the capital, is officially bilingual (French and Dutch). Belgian French has its own words: septante (70), nonante (90), GSM (cell phone), dîner (lunch) and souper (dinner)."}
]};

const STOPS=[
{id:'friterie', name:'Planche 1 : La friterie', sub:'Premier jour au travail', who:'nadia', toast:'En route vers la friterie de Nadia…',
 page:{panels:[
  {id:'f1', art:'f1', caption:"Nadia te donne un tablier. Tu le mets tout de suite.", alt:"Nadia tend un tablier au personnage principal.",
   why:"Relis la légende : c'est Nadia qui te donne quelque chose, et toi, tu le mets.", whyEn:"Nadia gives you something, and you put it on.",
   bubbles:[{x:250,y:48,w:190,tail:'l',lead:"Voilà ton tablier! ",text:"Tu le mets, d'accord?"}]},
  {id:'f2', art:'f2', caption:"Un client arrive. Il commande un grand cornet de frites.", alt:"Un client au comptoir parle à Nadia.",
   why:"Cette case montre l'arrivée du client et sa commande.", whyEn:"This frame shows the customer arriving and ordering.",
   bubbles:[{x:20,y:56,w:200,tail:'r',lead:"Un grand cornet, s'il vous plaît! ",text:"Vous le préparez tout de suite?"}]},
  {id:'f3', art:'f3', caption:"Il veut de la sauce andalouse. Tu la mets sur ses frites.", alt:"Le personnage principal met de la sauce sur les frites.",
   why:"« Tu la mets » : c'est toi qui mets la sauce, pas Nadia.", whyEn:"You put the sauce on, not Nadia.", bubbles:[]},
  {id:'f4', art:'f4', caption:"Tu lui donnes son cornet, et il te paie.", alt:"Le personnage principal donne le cornet au client.",
   why:"« Tu lui donnes son cornet » : tu donnes le cornet au client.", whyEn:"You give the cone to the customer.",
   bubbles:[{x:228,y:50,w:200,tail:'r',lead:"",text:"Tu lui donnes la monnaie?"}]}],
  decoys:[{id:'fx', art:'fx', decoy:true, alt:"Nadia met de la sauce sur les frites.", why:"Cette image ne va dans aucune case : la légende dit « Tu la mets » (toi), mais ici, c'est Nadia qui met la sauce.", whyEn:"The caption says you put the sauce on; here it's Nadia."}]},
 steps:[
 {t:'npc', text:"Bienvenue à la friterie, [nom]! Lucas dessine ta première journée. Aide-le à mettre ses images dans l'ordre!", en:"Welcome to the friterie, [nom]! Lucas is drawing your first day. Help him put his pictures in order!"},
 {t:'arrange', prompt:"Lis les légendes de la planche 1. Mets chaque image dans la bonne case.", en:"Read the captions for page 1. Put each picture in the right frame."},
 {t:'tiles', bubble:[0,0], prompt:"Case 1. Nadia a dit : « Voilà ton tablier! Tu mets le tablier, d'accord? » Remplace le nom répété par un pronom.", en:"Frame 1. Replace the repeated noun with a pronoun.", tiles:['Tu','le','la','les','mets',', d\'accord','?'], answers:["Tu le mets, d'accord?"],
  hints:{'la':"Tablier est masculin : le.", 'les':"Les, c'est pour le pluriel. Un tablier : le."}, why:"Le pronom se place devant le verbe : tu le mets."},
 {t:'tiles', bubble:[1,0], prompt:"Case 2. Le client a dit : « Vous préparez le cornet tout de suite? » Remplace le cornet par un pronom.", en:"Frame 2. Replace le cornet with a pronoun.", tiles:['Vous','le','la','lui','préparez','tout de suite','?'], answers:['Vous le préparez tout de suite?'],
  hints:{'la':"Cornet est masculin : le.", 'lui':"Lui remplace une personne (à quelqu'un). Le cornet est une chose, complément direct : le."}, why:"Le pronom se place devant le verbe : vous le préparez."},
 {t:'tiles', bubble:[3,0], prompt:"Case 4. Nadia te demande : « Tu donnes la monnaie au client? » Remplace au client par un pronom.", en:"Frame 4. Replace au client with a pronoun.", tiles:['Tu','lui','leur','le','donnes','la monnaie','?'], answers:['Tu lui donnes la monnaie?'],
  hints:{'leur':"Leur, c'est pour plusieurs personnes. Il y a un seul client : lui.", 'le':"Au client = à quelqu'un : c'est un complément indirect, donc lui."}, why:"Le pronom se place devant le verbe : tu lui donnes."},
 {t:'npc', text:"Bravo! Tu sais pourquoi nos frites sont si bonnes? On les cuit deux fois! Et quand on donne quelque chose, on dit [[s'il vous plaît|voici, tenez (belge)|here you go]].", en:"Great! Do you know why our fries are so good? We fry them twice! And when we hand something over, we say s'il vous plaît."},
 {t:'clue', text:"Planche 1 finie : la friterie. Prochaine planche : le Parcours BD, pendant le dîner."},
 {t:'card', title:"Les frites belges", text:"En Belgique, les frites sont cuites deux fois : une première fois pour les cuire, une deuxième fois pour les rendre croustillantes. On les achète dans une friterie (ou une « baraque à frites ») et on les mange dans un cornet en papier, avec une sauce : mayonnaise, andalouse, samouraï…", en:"In Belgium, fries are cooked twice: once to cook them, and a second time to make them crispy. People buy them at a friterie and eat them from a paper cone, with a sauce: mayonnaise, andalouse, samouraï…"}
 ]},
{id:'parcours', name:'Planche 2 : Le Parcours BD', sub:'La pause du dîner', who:'lucas', toast:'C\'est l\'heure du dîner…',
 page:{panels:[
  {id:'p1', art:'p1', caption:"Lucas te montre une grande fresque. Tu la prends en photo.", alt:"Le personnage principal photographie une fresque.",
   why:"« Tu la prends en photo » : c'est toi qui prends la photo de la fresque.", whyEn:"You take the photo of the mural.",
   bubbles:[{x:238,y:46,w:200,tail:'l',lead:"",text:"Je la trouve magnifique!"}]},
  {id:'p2', art:'p2', caption:"Des touristes sont perdus. Lucas leur explique le chemin.", alt:"Lucas montre le chemin à deux touristes avec un plan.",
   why:"« Lucas leur explique » : Lucas explique aux touristes.", whyEn:"Lucas explains to the tourists.",
   bubbles:[{x:20,y:50,w:170,tail:'r',lead:"Ils sont perdus. ",text:"On leur parle?"}]},
  {id:'p3', art:'p3', caption:"Vous achetez des gaufres. Lucas les paie.", alt:"Lucas paie les gaufres au stand.",
   why:"« Lucas les paie » : c'est Lucas qui paie les gaufres.", whyEn:"Lucas pays for the waffles.",
   bubbles:[{x:228,y:50,w:180,tail:'l',lead:"",text:"Je les adore!"}]},
  {id:'p4', art:'p4', caption:"Tu envoies la photo à ta mère. Tu lui écris un message.", alt:"Le personnage principal écrit un message sur son téléphone.",
   why:"« Tu lui écris » : tu écris à ta mère, sur ton GSM.", whyEn:"You write to your mother on your phone.", bubbles:[]}],
  decoys:[{id:'px', art:'px', decoy:true, alt:"Le personnage principal paie les gaufres.", why:"Cette image est de trop : la légende dit « Lucas les paie », mais ici, c'est toi qui paies.", whyEn:"The caption says Lucas pays; here it's you."}]},
 steps:[
 {t:'npc', text:"C'est l'heure du [[dîner|repas de midi (belge)|lunch]]! Je t'emmène sur le Parcours BD : il y a des fresques de bande dessinée partout dans la ville.", en:"It's lunchtime! I'm taking you on the Comic Strip Route: there are comic murals all over the city."},
 {t:'arrange', prompt:"Lis les légendes de la planche 2. Mets chaque image dans la bonne case.", en:"Read the captions for page 2. Put each picture in the right frame."},
 {t:'tiles', bubble:[0,0], prompt:"Case 1. Tu as dit : « Je trouve la fresque magnifique! » Remplace la fresque par un pronom.", en:"Frame 1. Replace la fresque with a pronoun.", tiles:['Je','la','le','lui','trouve','magnifique','!'], answers:['Je la trouve magnifique!'],
  hints:{'le':"Fresque est féminin : la.", 'lui':"La fresque est une chose (complément direct) : la."}},
 {t:'tiles', bubble:[1,0], prompt:"Case 2. Lucas a dit : « On parle aux touristes? » Remplace aux touristes par un pronom.", en:"Frame 2. Replace aux touristes with a pronoun.", tiles:['On','leur','lui','les','parle','?'], answers:['On leur parle?'],
  hints:{'lui':"Il y a plusieurs touristes : leur.", 'les':"On parle à quelqu'un : complément indirect, donc leur (pas les)."}},
 {t:'tiles', bubble:[2,0], prompt:"Case 3. Tu as dit : « J'adore les gaufres! » Remplace les gaufres par un pronom.", en:"Frame 3. Replace les gaufres with a pronoun.", tiles:['Je','J\'','les','la','adore','!'], answers:['Je les adore!'],
  hints:{"J'":"Devant les, je ne change pas : je les adore (pas j'les).", 'la':"Les gaufres, c'est pluriel : les."}},
 {t:'clue', text:"Planche 2 finie : le Parcours BD. Prochaine planche : le Centre belge de la bande dessinée."},
 {t:'card', title:"Bruxelles, capitale de la BD", text:"Beaucoup d'auteurs célèbres de bande dessinée sont belges : Hergé (Tintin), Peyo (les Schtroumpfs), Franquin (Gaston Lagaffe)… Sur le Parcours BD, plus de cinquante fresques géantes décorent les murs de Bruxelles. Et la gaufre de Bruxelles, légère et rectangulaire, n'est pas la même que la gaufre de Liège, plus sucrée!", en:"Many famous comic artists are Belgian: Hergé (Tintin), Peyo (the Smurfs), Franquin (Gaston Lagaffe)… On the Comic Strip Route, more than fifty giant murals decorate Brussels walls. And the light, rectangular Brussels waffle is not the same as the sweeter Liège waffle!"}
 ]},
{id:'centre', name:'Planche 3 : Le Centre BD', sub:'Rencontre avec l\'éditrice', who:'lambert', toast:'En route vers le Centre belge de la bande dessinée…',
 page:{panels:[
  {id:'c1', art:'c1', caption:"Lucas montre ses dessins à l'éditrice. Elle les regarde.", alt:"L'éditrice regarde les dessins de Lucas.",
   why:"« Elle les regarde » : l'éditrice regarde les dessins de Lucas.", whyEn:"The editor looks at Lucas's drawings.",
   bubbles:[{x:20,y:50,w:180,tail:'r',lead:"Voici mes dessins. ",text:"Vous les regardez?"}]},
  {id:'c2', art:'c2', caption:"Elle pose une question à Lucas. Il lui répond.", alt:"L'éditrice parle avec Lucas.",
   why:"Cette case montre une question et une réponse entre l'éditrice et Lucas.", whyEn:"A question and answer between the editor and Lucas.",
   bubbles:[{x:236,y:46,w:200,tail:'l',lead:"Et Nadia? ",text:"Vous la dessinez dans la BD?"}]},
  {id:'c3', art:'c3', caption:"Elle aime l'histoire de la friterie. Elle la trouve drôle.", alt:"L'éditrice rit en lisant une planche.",
   why:"« Elle la trouve drôle » : l'éditrice rit. Elle aime l'histoire.", whyEn:"She finds it funny: she laughs.", bubbles:[]},
  {id:'c4', art:'c4', caption:"Elle vous donne une mission : finir la planche ce soir!", alt:"L'éditrice montre l'horloge à Lucas et au personnage principal.",
   why:"Cette case montre la mission : l'éditrice montre l'heure.", whyEn:"This frame shows the mission: she points at the clock.",
   bubbles:[{x:18,y:48,w:190,tail:'r',lead:"",text:"Il faut la finir ce soir!"}]}],
  decoys:[{id:'cx', art:'cx', decoy:true, alt:"L'éditrice s'ennuie et bâille.", why:"Cette image est de trop : la légende dit qu'elle trouve l'histoire drôle, mais ici, elle s'ennuie.", whyEn:"The caption says she finds it funny; here she's bored."}]},
 steps:[
 {t:'npc', text:"Bonjour! Je suis Mme Lambert, éditrice. Bienvenue au Centre belge de la bande dessinée. Alors, Lucas, cette BD?", en:"Hello! I'm Ms. Lambert, an editor. Welcome to the Belgian Comic Strip Center. So, Lucas, this comic?"},
 {t:'arrange', prompt:"Lis les légendes de la planche 3. Mets chaque image dans la bonne case.", en:"Read the captions for page 3. Put each picture in the right frame."},
 {t:'tiles', bubble:[0,0], prompt:"Case 1. Lucas a dit : « Vous regardez mes dessins? » Remplace mes dessins par un pronom.", en:"Frame 1. Replace mes dessins with a pronoun.", tiles:['Vous','les','leur','le','regardez','?'], answers:['Vous les regardez?'],
  hints:{'leur':"On regarde quelque chose (complément direct) : les, pas leur.", 'le':"Mes dessins, c'est pluriel : les."}},
 {t:'tiles', bubble:[1,0], prompt:"Case 2. Mme Lambert a dit : « Vous dessinez Nadia dans la BD? » Remplace Nadia par un pronom.", en:"Frame 2. Replace Nadia with a pronoun.", tiles:['Vous','la','lui','le','dessinez','dans la BD','?'], answers:['Vous la dessinez dans la BD?'],
  hints:{'lui':"On dessine quelqu'un (complément direct, sans à) : la.", 'le':"Nadia est une femme : la."}},
 {t:'tiles', bubble:[3,0], prompt:"Case 4. Mme Lambert a dit : « Il faut finir la planche ce soir! » Remplace la planche par un pronom.", en:"Frame 4. Replace la planche with a pronoun.", tiles:['Il faut','la','le','finir','ce soir','!'], answers:['Il faut la finir ce soir!'],
  hints:{'le':"Planche est féminin : la."}, why:"Avec un infinitif, le pronom se place devant l'infinitif : il faut la finir."},
 {t:'clue', text:"Planche 3 finie : l'éditrice. Dernière planche ce soir, sur la Grand-Place."},
 {t:'card', title:"Le Centre belge de la bande dessinée", text:"Le Centre belge de la bande dessinée est un musée installé dans un ancien grand magasin de style Art nouveau, dessiné par l'architecte belge Victor Horta. On y découvre l'histoire de la BD, des planches originales et le travail des auteurs, du crayon jusqu'au livre imprimé.", en:"The Belgian Comic Strip Center is a museum in a former Art Nouveau department store designed by Belgian architect Victor Horta. Visitors discover the history of comics, original pages and how artists work, from pencil to printed book."}
 ]},
{id:'grandplace', name:'Planche 4 : La Grand-Place', sub:'Finir la BD', who:'lucas', night:true, toast:'Le soir, sur la Grand-Place…',
 page:{panels:[
  {id:'g1', art:'g1', caption:"Le soir, vous allez sur la Grand-Place. Tu la trouves magnifique.", alt:"Le personnage principal admire la Grand-Place illuminée.",
   why:"Cette case montre l'arrivée sur la Grand-Place, le soir.", whyEn:"This frame shows arriving at the Grand-Place.",
   bubbles:[{x:236,y:52,w:190,tail:'l',lead:"",text:"Tout le monde l'adore!"}]},
  {id:'g2', art:'g2', caption:"Lucas colorie la dernière case. Il la finit à 21 h.", alt:"Lucas colorie une case à une table de café.",
   why:"« Il la finit » : c'est Lucas qui colorie et finit la case.", whyEn:"Lucas colours and finishes the frame.",
   bubbles:[{x:236,y:48,w:200,tail:'l',lead:"La dernière case? ",text:"Je la finis maintenant!"}]},
  {id:'g3', art:'g3', caption:"Nadia arrive avec des frites pour tout le monde.", alt:"Nadia arrive avec un plateau de cornets de frites.",
   why:"Cette case montre l'arrivée de Nadia avec les frites.", whyEn:"Nadia arrives with fries.", bubbles:[]},
  {id:'g4', art:'g4', caption:"Tu appelles tes parents. Tu leur montres la BD.", alt:"Le personnage principal montre la BD à ses parents sur son téléphone.",
   why:"« Tu leur montres la BD » : c'est toi qui appelles tes parents.", whyEn:"You call your parents and show them.",
   bubbles:[{x:236,y:50,w:200,tail:'l',lead:"",text:"Je leur montre la BD!"}]}],
  decoys:[{id:'gx', art:'gx', decoy:true, alt:"Lucas appelle ses parents.", why:"Cette image est de trop : la légende dit « Tu appelles tes parents », mais ici, c'est Lucas qui téléphone.", whyEn:"The caption says you call; here it's Lucas."}]},
 steps:[
 {t:'npc', text:"Dernière planche! On s'installe sur la Grand-Place pour la finir. Regarde comme elle est belle, le soir!", en:"Last page! Let's sit on the Grand-Place to finish it. Look how beautiful it is at night!"},
 {t:'arrange', prompt:"Lis les légendes de la planche 4. Mets chaque image dans la bonne case.", en:"Read the captions for page 4. Put each picture in the right frame."},
 {t:'tiles', bubble:[0,0], prompt:"Case 1. Lucas a dit : « Tout le monde adore la Grand-Place! » Remplace la Grand-Place par un pronom.", en:"Frame 1. Replace la Grand-Place with a pronoun.", tiles:['Tout le monde','l\'','la','le','adore','!'], answers:["Tout le monde l'adore!"],
  hints:{'la':"Devant une voyelle (adore), la devient l' : l'adore.", 'le':"Grand-Place est féminin, et devant une voyelle : l'."}},
 {t:'tiles', bubble:[1,0], prompt:"Case 2. Lucas a dit : « Je finis la case maintenant! » Remplace la case par un pronom.", en:"Frame 2. Replace la case with a pronoun.", tiles:['Je','la','lui','finis','finir','maintenant','!'], answers:['Je la finis maintenant!'],
  hints:{'lui':"On finit quelque chose (complément direct) : la.", 'finir':"Avec je, conjugue : je la finis."}},
 {t:'tiles', bubble:[3,0], prompt:"Case 4. Tu as dit : « Je montre la BD à mes parents! » Remplace à mes parents par un pronom.", en:"Frame 4. Replace à mes parents with a pronoun.", tiles:['Je','leur','lui','les','montre','la BD','!'], answers:['Je leur montre la BD!'],
  hints:{'lui':"Tes parents, ce sont deux personnes : leur.", 'les':"Montrer à quelqu'un : complément indirect, donc leur (pas les)."}},
 {t:'npc', text:"C'est fini! Mme Lambert vient de m'écrire : elle veut publier notre BD! Regarde le résultat!", en:"It's done! Ms. Lambert just wrote to me: she wants to publish our comic! Look at the result!"},
 {t:'card', title:"La Grand-Place", text:"La Grand-Place est le cœur de Bruxelles. Ses maisons décorées d'or et son hôtel de ville gothique, avec sa grande tour, sont inscrits au patrimoine mondial de l'UNESCO depuis 1998. Tous les deux ans, en août, un immense tapis de fleurs couvre la place.", en:"The Grand-Place is the heart of Brussels. Its gold-decorated guild houses and Gothic town hall with its tall tower have been a UNESCO World Heritage Site since 1998. Every two years in August, a huge carpet of flowers covers the square."},
 {t:'finale', scene:'bd', who:'lucas', text:"Voilà « Les aventures de [nom] à Bruxelles »! Télécharge ta BD pour la garder. Demain, tu pars pour la Martinique? Bon voyage, [[à tantôt|à plus tard (belge)|see you later]]!", en:"Here's \"The Adventures of [nom] in Brussels\"! Download your comic to keep it. Tomorrow you leave for Martinique? Have a good trip, see you!", btn:'Terminer', downloadLabel:'Télécharger ma BD'}
 ]}
];
