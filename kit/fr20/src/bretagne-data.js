/* ===== Escale 5 : Bretagne (Quimper) — La semaine bretonne =====
   Gameplay: planning puzzles, sentence building, calculation and a guided letter (not multiple choice).
   Curriculum (French 20-3Y): 20 C 2.1 (school events and traditions), 2.2 (interacting with school personnel),
   2.3 (tasks and responsibilities related to schoolwork);
   20 R 2.5e pronominal verbs (je me lève, ne se réveille pas), 2.8c il faut + infinitive, 2.1f déterminants exclamatifs
   (quel, quelle, quels, quelles), 3.2 tu / vous. Culture: la Bretagne, le breton, le lycée en France, crêpes et galettes,
   le kouign-amann, le fest-noz (UNESCO 2012).
   Reward: the letter to a Breton correspondent must pass its checks before the fest-noz animation plays. */
const GAME={id:'bretagne', title:'La semaine bretonne', place:'Bretagne', eyebrow:'Escale 5 · Quimper, Bretagne',
 introName:'Arrivée en Bretagne', mapAria:'Plan de Quimper', playerExtra:{noHat:true},
 mapLabels:`<span class="maplabel" style="left:4%;top:6%">Quimper</span><span class="maplabel river" style="left:52%;top:66%">l'Odet</span>`,
 lede:"Une semaine d'échange au lycée de Maëlle. Organise tes journées, aide à préparer le fest-noz du samedi, et écris ta lettre de correspondant.",
 endText:"Grâce à toi, la semaine s'est bien passée, ta lettre est partie vers la classe de M. Kervella, et tu as dansé au fest-noz jusqu'à minuit. Tu as gagné le tampon de la Bretagne dans ton passeport."};

const INTRO={who:'maelle', steps:[
 {t:'npc', text:"[[Degemer mat|Bienvenue (breton)|Welcome]], [nom]! Je suis Maëlle, ta correspondante. De Rennes à Quimper, il y a un peu plus de deux heures de train, et après… une semaine incroyable!", en:"Welcome, [nom]! I'm Maëlle, your exchange partner. From Rennes to Quimper it's a little over two hours by train, and then… an amazing week!"},
 {t:'npc', text:"Samedi soir, notre lycée organise un fest-noz : une grande fête avec de la musique et des danses bretonnes. Mais avant, il faut survivre à une semaine de lycée français!", en:"Saturday night, our school is holding a fest-noz: a big party with Breton music and dances. But first, you have to survive a week of French high school!"},
 {t:'tiles', prompt:"Le train longe la côte. Réagis avec une exclamation.", en:"The train runs along the coast. React with an exclamation.", tiles:['Quelle','Quel','Quels','belle','beau','région','!'], answers:['Quelle belle région!'],
  hints:{'Quel':"Région est féminin : quelle (et belle).", 'Quels':"Quels, c'est masculin pluriel. Région est féminin singulier : quelle.", 'beau':"Région est féminin : belle."}},
 {t:'card', title:"La Bretagne", text:"La Bretagne est une région de l'ouest de la France, entourée par la mer sur trois côtés. On y parle français, mais aussi breton, une langue celtique proche du gallois et du cornique. Dans beaucoup de villes, les panneaux sont écrits dans les deux langues. Le drapeau breton s'appelle le Gwenn-ha-du (« blanc et noir »).", en:"Brittany is a region in western France, surrounded by the sea on three sides. People speak French there, but also Breton, a Celtic language related to Welsh and Cornish. In many towns, signs are written in both languages. The Breton flag is called the Gwenn-ha-du (\"white and black\")."}
]};

const STOPS=[
{id:'maison', name:'Le lundi matin', sub:'Organiser ta routine', who:'maelle', toast:'Dimanche soir, chez les Le Goff…',
 steps:[
 {t:'npc', text:"Demain, c'est lundi. Chez nous, le matin, c'est la course! Il y a une seule salle de bain pour cinq personnes. Lis bien les notes sur le frigo.", en:"Tomorrow is Monday. At our place, mornings are a race! There's only one bathroom for five people. Read the notes on the fridge carefully."},
 {t:'doc', kind:'Sur le frigo', title:"Le matin chez les Le Goff", lines:[
  "Papa se douche de 6 h 30 à 6 h 45.",
  "Maëlle se douche de 6 h 45 à 7 h.",
  "Le petit-déjeuner est servi de 7 h à 7 h 15, dans la cuisine.",
  "Erwan se lave à 7 h 30 (il se lève tard!).",
  "Le bus part à 7 h 35. L'arrêt est à cinq minutes à pied."],
  en:"Dad showers 6:30–6:45. Maëlle showers 6:45–7:00. Breakfast is 7:00–7:15 in the kitchen. Erwan washes at 7:30. The bus leaves at 7:35; the stop is a five-minute walk."},
 {t:'plan', prompt:"Planifie ton lundi matin. Chaque activité dure un quart d'heure. Respecte les notes du frigo!", en:"Plan your Monday morning. Each activity takes fifteen minutes. Follow the fridge notes!", itemsLabel:'Activités',
  slots:['6 h 00','6 h 15','6 h 30','6 h 45','7 h 00','7 h 15','7 h 30'],
  items:[
   {id:'rev', txt:'se réveiller', ok:[0], why:"Il faut te réveiller en premier, avant toutes les autres activités.", whyEn:"Wake up first."},
   {id:'dou', txt:'se doucher', ok:[1], why:"La salle de bain n'est pas libre à cette heure-là. Relis les notes : qui utilise la salle de bain, et quand?", whyEn:"The bathroom isn't free then. Who uses it, and when?"},
   {id:'hab', txt:"s'habiller", ok:[2,3], why:"Habille-toi après la douche et avant le petit-déjeuner.", whyEn:"Get dressed after showering and before breakfast."},
   {id:'dej', txt:'prendre le petit-déjeuner', ok:[4], why:"Relis les heures du petit-déjeuner.", whyEn:"Check the breakfast times."},
   {id:'den', txt:'se brosser les dents', ok:[5], why:"On se brosse les dents après le petit-déjeuner, quand la salle de bain est libre.", whyEn:"Brush after breakfast, when the bathroom is free."},
   {id:'par', txt:"partir à l'arrêt de bus", ok:[6], why:"Le bus part à 7 h 35 et l'arrêt est à cinq minutes. À quelle heure faut-il partir?", whyEn:"The bus leaves at 7:35 and the stop is five minutes away."}],
  done:"Ton plan fonctionne : tu vas attraper le bus!"},
 {t:'tiles', prompt:"Explique ton plan à Maëlle : ta douche.", en:"Explain your plan to Maëlle: your shower.", tiles:['Je','me','te','se','douche','douches','à','6 h 15','.'], answers:['Je me douche à 6 h 15.'],
  hints:{'te':"Avec je, le pronom est me : je me douche.", 'se':"Se, c'est pour il ou elle. Avec je : je me douche.", 'douches':"Avec je, pas de s : je me douche."}},
 {t:'tiles', prompt:"Et après le petit-déjeuner?", en:"And after breakfast?", tiles:['Je','me','brosse','brosses','les','mes','dents','à','7 h 15','.'], answers:['Je me brosse les dents à 7 h 15.'],
  hints:{'mes':"Avec un verbe pronominal, on dit les dents (le pronom me montre déjà que ce sont tes dents).", 'brosses':"Avec je, pas de s : je me brosse."}},
 {t:'npc', text:"Parfait! Moi, je me réveille à 6 h 30. [[Ya|Oui (breton)|Yes]], je sais, c'est tard! Mon frère Erwan, lui, ne se réveille jamais avant 7 h 15.", en:"Perfect! I wake up at 6:30. Yes, I know, it's late! My brother Erwan never wakes up before 7:15."},
 {t:'tiles', prompt:"Raconte à ta famille de Calgary : parle d'Erwan (à la forme négative).", en:"Tell your family in Calgary about Erwan (negative form).", tiles:['Erwan','ne','se','me','réveille','réveilles','pas','avant','7 h 15','.'], answers:['Erwan ne se réveille pas avant 7 h 15.'],
  hints:{'me':"Me, c'est pour je. Pour Erwan (il) : se.", 'réveilles':"Avec il, pas de s : il se réveille."}, why:"Avec un verbe pronominal, ne… pas entoure le pronom et le verbe : ne se réveille pas."},
 {t:'clue', text:"Lundi : douche à 6 h 15, départ pour le bus à 7 h 30."},
 {t:'card', title:"Le petit-déjeuner en France", text:"En France, le petit-déjeuner est souvent simple et sucré : des tartines de pain avec du beurre et de la confiture, des céréales, et un chocolat chaud ou un café… souvent dans un bol! On mange rarement des œufs ou du bacon le matin.", en:"In France, breakfast is often simple and sweet: bread with butter and jam, cereal, and hot chocolate or coffee… often in a bowl! People rarely eat eggs or bacon in the morning."}
 ]},
{id:'lycee', name:'Le lycée', sub:'L\'emploi du temps', who:'kervella', toast:'Lundi, 7 h 50 : arrivée au lycée…',
 steps:[
 {t:'npc', text:"Bonjour! Je suis M. Kervella, le professeur d'anglais de Maëlle. Bienvenue au lycée! Voici l'emploi du temps de sa classe de seconde.", en:"Hello! I'm Mr. Kervella, Maëlle's English teacher. Welcome to the lycée! Here's her grade 10 (seconde) class timetable."},
 {t:'doc', kind:'Emploi du temps', title:"Classe de seconde B", table:[
  ['','Lundi','Mardi','Mercredi','Jeudi','Vendredi'],
  ['8 h – 9 h','Maths','Anglais','Français','Physique-chimie','Maths'],
  ['9 h – 10 h','Français','Histoire-géo','Maths','Anglais','SVT'],
  ['10 h – 12 h','Physique-chimie','Maths','Anglais','Français','Histoire-géo'],
  ['12 h – 13 h 30','Cantine','Cantine','—','Cantine','Cantine'],
  ['13 h 30 – 15 h 30','SVT','EPS (sport)','Libre','Breton (option)','Arts plastiques'],
  ['15 h 30 – 17 h','Histoire-géo','EPS (sport)','Libre','Maths','Anglais']],
  en:"SVT = life and earth sciences. EPS = physical education. Libre = free."},
 {t:'pack', prompt:"Prépare ton sac pour mardi. Qu'est-ce qu'il faut apporter? Choisis tout ce qu'il faut, et rien d'autre.", en:"Pack your bag for Tuesday. What do you need to bring? Choose everything needed, and nothing else.",
  items:[
   {txt:'une calculatrice', need:true},
   {txt:"un dictionnaire d'anglais", need:true},
   {txt:'des baskets et un short', need:true},
   {txt:'la carte de cantine', need:true},
   {txt:'une blouse de chimie', need:false, why:"Regarde mardi : il n'y a pas de physique-chimie.", whyEn:"No chemistry on Tuesday."},
   {txt:'des pinceaux', need:false, why:"Les arts plastiques, c'est le vendredi.", whyEn:"Art is on Friday."},
   {txt:'le cahier de breton', need:false, why:"Le cours de breton, c'est le jeudi.", whyEn:"Breton is on Thursday."},
   {txt:'un maillot de bain', need:false, why:"L'EPS est le mardi, mais rien ne dit qu'on va à la piscine.", whyEn:"Nothing says you're going swimming."}],
  missing:"Il manque encore quelque chose. Relis la colonne du mardi, cours par cours (et le midi!).", missingEn:"Something is still missing. Reread Tuesday, class by class (and lunch!).",
  say:"Mardi, j'apporte une calculatrice, un dictionnaire d'anglais, des baskets, un short et ma carte de cantine.", done:"Ton sac est prêt!"},
 {t:'tiles', prompt:"Écris un rappel pour mardi avec il faut.", en:"Write a reminder for Tuesday with il faut.", tiles:['Il','faut','apporter','apporte','apportons','mes','baskets','mardi','.'], answers:['Il faut apporter mes baskets mardi.','Mardi il faut apporter mes baskets.'],
  hints:{'apporte':"Après il faut, le verbe reste à l'infinitif : il faut apporter.", 'apportons':"Après il faut, le verbe reste à l'infinitif : il faut apporter."}},
 {t:'number', prompt:"M. Kervella compare avec Calgary. Calcule à partir de l'emploi du temps.", en:"Mr. Kervella compares with Calgary. Calculate from the timetable.",
  rows:[
   {label:"Heures de maths par semaine", unit:'h', ans:6.5, why:"Compte jour par jour. Attention : certains cours durent 2 h ou 1 h 30. (Écris 1 h 30 comme 1,5.)", whyEn:"Count day by day; some classes last 2 h or 1 h 30 (write 1.5)."},
   {label:"Durée de la pause du midi", unit:'h', ans:1.5, why:"De 12 h à 13 h 30 : combien d'heures? (Écris 1 h 30 comme 1,5.)", whyEn:"From 12:00 to 1:30 — how many hours?"},
   {label:"Heures de cours le mercredi", unit:'h', ans:4, why:"Le mercredi, les cours s'arrêtent à midi. Compte à partir de 8 h.", whyEn:"Wednesday classes stop at noon."}],
  say:"Maëlle a 6,5 heures de maths par semaine, une pause d'une heure et demie à midi, et seulement 4 heures de cours le mercredi."},
 {t:'npc', text:"Exactement! Le mercredi après-midi, il n'y a pas cours : les élèves font du sport, de la musique… ou ils se reposent! Pour manger à la cantine demain, il faut aller à la vie scolaire chercher ta carte.", en:"Exactly! Wednesday afternoon there's no class: students do sports, music… or rest! To eat in the cafeteria tomorrow, you have to go to the vie scolaire (student office) to get your card."},
 {t:'tiles', prompt:"À la vie scolaire, demande ta carte à la conseillère (tu la vouvoies).", en:"At the student office, ask the counsellor for your card (use vous).", tiles:['Bonjour','madame,','est-ce que','je','peux','avoir','ma','mon','carte de cantine','s\'il vous plaît','s\'il te plaît','?'],
  answers:["Bonjour madame, est-ce que je peux avoir ma carte de cantine s'il vous plaît?"],
  hints:{'mon':"Carte est féminin : ma carte.", "s'il te plaît":"Avec une adulte du lycée, on vouvoie : s'il vous plaît."}, why:"Commence par Bonjour madame, puis pose la question avec est-ce que."},
 {t:'clue', text:"Mardi : calculatrice, dictionnaire, baskets, short et carte de cantine."},
 {t:'card', title:"Le lycée en France", text:"Au lycée, la seconde correspond à peu près à la 10e année en Alberta. Les journées sont longues : souvent de 8 h à 17 h, avec une pause d'une heure et demie à midi pour manger à la cantine. Beaucoup de lycées n'ont pas cours le mercredi après-midi. À la fin de la terminale, les élèves passent le bac.", en:"In a French lycée, seconde is roughly grade 10 in Alberta. Days are long: often 8 a.m. to 5 p.m., with a ninety-minute lunch break in the cafeteria. Many lycées have no classes on Wednesday afternoon. At the end of terminale (grade 12), students take the bac."}
 ]},
{id:'crepes', name:'Les crêpes', sub:'Recette pour le fest-noz', who:'gaelle', toast:'Mercredi après-midi : pas de cours!',
 steps:[
 {t:'npc', text:"Pas de cours cet après-midi? Parfait! On prépare les crêpes pour le stand du fest-noz. Ma recette est pour 4 personnes, mais il faut nourrir 12 personnes!", en:"No class this afternoon? Perfect! We're making crêpes for the fest-noz stand. My recipe serves 4, but we have to feed 12!"},
 {t:'doc', kind:'Recette', title:"Crêpes de Gaëlle (pour 4 personnes)", lines:[
  "250 g de farine",
  "4 œufs",
  "50 cl de lait",
  "2 cuillères à soupe de sucre",
  "50 g de beurre fondu",
  "1 pincée de sel"], en:"cl = centilitres (50 cl = half a litre)."},
 {t:'number', prompt:"Pour 12 personnes, il faut combien de…?", en:"For 12 people, how much do you need?",
  rows:[
   {label:"farine", unit:'g', ans:750, why:"12 personnes, c'est combien de fois 4 personnes?", whyEn:"How many times 4 is 12?"},
   {label:"œufs", unit:'', ans:12, why:"La recette demande 4 œufs pour 4 personnes. Et pour 12?", whyEn:"4 eggs for 4 people. And for 12?"},
   {label:"lait", unit:'cl', ans:150, why:"Multiplie 50 cl par le bon nombre.", whyEn:"Multiply 50 cl by the right number."},
   {label:"beurre fondu", unit:'g', ans:150, why:"Multiplie 50 g par le bon nombre.", whyEn:"Multiply 50 g by the right number."}],
  say:"Pour 12 personnes, il faut 750 g de farine, 12 œufs, 150 cl de lait et 150 g de beurre."},
 {t:'order', prompt:"Gaëlle explique la recette. Mets les étapes dans un ordre logique.", en:"Gaëlle explains the recipe. Put the steps in a logical order.", done:"Bravo! La pâte est prête.", items:[
  "Il faut mélanger la farine, le sucre et le sel.",
  "Il faut ajouter les œufs, puis le lait, petit à petit.",
  "Il faut laisser reposer la pâte une heure.",
  "Il faut faire chauffer la poêle avec un peu de beurre.",
  "Il faut verser la pâte et retourner la crêpe."]},
 {t:'npc', text:"Regarde bien… hop! Je retourne la crêpe en l'air!", en:"Watch closely… hop! I flip the crêpe in the air!"},
 {t:'tiles', prompt:"Réagis : tu es impressionné{|e} par son talent.", en:"React: you're impressed by her talent.", tiles:['Quel','Quelle','Quels','talent','!'], answers:['Quel talent!'],
  hints:{'Quelle':"Talent est masculin : quel talent!", 'Quels':"Il y a un seul talent (singulier) : quel."}},
 {t:'tiles', prompt:"Tu goûtes les premières crêpes.", en:"You taste the first crêpes.", tiles:['Quelles','Quels','Quelle','bonnes','bons','crêpes','!'], answers:['Quelles bonnes crêpes!'],
  hints:{'Quels':"Crêpes est féminin pluriel : quelles.", 'Quelle':"Il y a plusieurs crêpes : quelles (pluriel).", 'bons':"Bonnes s'accorde avec crêpes : féminin pluriel."}},
 {t:'npc', text:"Ici, on mange aussi des galettes de sarrasin. La galette complète, c'est avec du jambon, un œuf et du fromage. Et le kouign-amann, ce gâteau au beurre, vient de Douarnenez, tout près d'ici!", en:"Here, we also eat buckwheat galettes. A galette complète has ham, an egg and cheese. And kouign-amann, that butter cake, comes from Douarnenez, very close to here!"},
 {t:'clue', text:"Crêpes pour 12 : 750 g de farine, 12 œufs, 150 cl de lait, 150 g de beurre."},
 {t:'card', title:"Crêpes et galettes", text:"En Bretagne, la crêpe est faite avec de la farine de blé et elle est sucrée. La galette est faite avec de la farine de sarrasin (le « blé noir ») et elle est salée. Dans une crêperie, on mange souvent une galette en plat principal, puis une crêpe en dessert.", en:"In Brittany, a crêpe is made with wheat flour and is sweet. A galette is made with buckwheat flour and is savoury. At a crêperie, people often eat a galette as a main course, then a crêpe for dessert."}
 ]},
{id:'preparatifs', name:'Les préparatifs', sub:'Qui fait quoi?', who:'maelle', toast:'Samedi matin : le grand jour!',
 steps:[
 {t:'npc', text:"C'est samedi! Il faut tout préparer pour le fest-noz. M. Kervella nous a donné quatre tâches. Mais attention : chaque personne a ses habitudes!", en:"It's Saturday! We have to get everything ready for the fest-noz. Mr. Kervella gave us four tasks. But careful: everyone has their habits!"},
 {t:'doc', kind:'Notes de Maëlle', title:"Samedi : les habitudes de chacun", lines:[
  "Erwan se lève tard le samedi : il ne se réveille jamais avant 11 h. Et il déteste danser!",
  "Moi, Maëlle, je m'entraîne avec mon groupe de danse de 9 h à 11 h. Je suis la seule de la famille dans le groupe.",
  "Maman (Gaëlle) se repose l'après-midi, de 14 h à 16 h.",
  "Les musiciens connaissent seulement maman.",
  "[nom] est libre toute la journée, mais ne connaît pas les musiciens et ne danse pas dans le groupe."],
  en:"Erwan never wakes before 11 and hates dancing. Maëlle trains with her dance group 9–11 and is the only one in the group. Gaëlle rests 2–4 p.m. The musicians only know Gaëlle. You are free all day but don't know the musicians or dance in the group."},
 {t:'plan', prompt:"Qui fait quoi? Donne une tâche à chaque personne. Utilise les notes pour justifier chaque choix.", en:"Who does what? Give each person one task. Use the notes to justify each choice.", itemsLabel:'Personnes',
  slots:["9 h 30 : aller chercher les crêpes chez la voisine","12 h : installer les tables dans la salle","15 h : répéter la danse d'ouverture","18 h : accueillir les musiciens"],
  items:[
   {id:'moi', txt:'[nom]', ok:[0], why:"Tu ne connais pas les musiciens et tu ne danses pas dans le groupe. Quelle tâche est possible pour toi, le matin?", whyEn:"You don't know the musicians and don't dance in the group."},
   {id:'erwan', txt:'Erwan', ok:[1], why:"Erwan ne se réveille pas avant 11 h et il déteste danser. Relis ses notes.", whyEn:"Erwan doesn't wake before 11 and hates dancing."},
   {id:'maelle', txt:'Maëlle', ok:[2], why:"Maëlle s'entraîne de 9 h à 11 h, et c'est la seule de la famille dans le groupe de danse.", whyEn:"Maëlle trains 9–11 and is the only one in the dance group."},
   {id:'gaelle', txt:'Gaëlle', ok:[3], why:"Relis : les musiciens connaissent seulement une personne. Et Gaëlle se repose de 14 h à 16 h.", whyEn:"The musicians only know one person, and Gaëlle rests 2–4."}],
  done:"Tout le monde a une tâche, et personne n'est en retard!"},
 {t:'tiles', prompt:"Justifie un choix pour M. Kervella.", en:"Justify one choice for Mr. Kervella.", tiles:['Gaëlle','accueille','les musiciens','parce qu\'','parce que','ils','la','connaissent','.'], answers:["Gaëlle accueille les musiciens parce qu'ils la connaissent."],
  hints:{'parce que':"Devant une voyelle (ils), que devient qu' : parce qu'ils."}, why:"Le pronom la (Gaëlle) se place avant le verbe : ils la connaissent."},
 {t:'npc', text:"Bravo, tout est organisé! Ce soir, les sonneurs vont jouer de la bombarde et du biniou. Mais d'abord, M. Kervella veut ta lettre.", en:"Great, everything's organized! Tonight the pipers will play the bombarde and the biniou. But first, Mr. Kervella wants your letter."},
 {t:'clue', text:"Samedi : toi (crêpes, 9 h 30), Erwan (tables, 12 h), Maëlle (danse, 15 h), Gaëlle (musiciens, 18 h)."},
 {t:'card', title:"Le fest-noz", text:"Fest-noz veut dire « fête de nuit » en breton. On danse en chaîne ou en ronde, souvent en se tenant par le petit doigt, sur la musique des sonneurs : la bombarde (un instrument à vent) et le biniou (une petite cornemuse). Tout le monde peut danser, des enfants aux grands-parents. Depuis 2012, le fest-noz fait partie du patrimoine culturel immatériel de l'UNESCO.", en:"Fest-noz means \"night party\" in Breton. People dance in a line or circle, often holding little fingers, to the music of the sonneurs: the bombarde (a wind instrument) and the biniou (a small bagpipe). Everyone dances, from children to grandparents. Since 2012 the fest-noz has been on UNESCO's Intangible Cultural Heritage list."}
 ]},
{id:'festnoz', name:'Le fest-noz', sub:'Ta lettre, puis la danse', who:'kervella', night:true, toast:'Samedi soir, à la salle des fêtes…', sign:'Fest-noz du lycée', signPos:[36.5,12,27,6],
 steps:[
 {t:'npc', text:"Avant la danse, je vais lire les lettres des élèves de Calgary à ma classe. Mes élèves cherchent des correspondants! Écris une vraie lettre pour te présenter. Je vérifie chaque partie.", en:"Before the dancing, I'll read the letters from the Calgary students to my class. My students are looking for pen pals! Write a real letter to introduce yourself. I check each part."},
 {t:'letter', prompt:"Écris ta lettre. Chaque partie doit montrer ce que tu as appris cette semaine. La danse commence quand ta lettre est prête!", en:"Write your letter. Each part must show what you learned this week. The dancing starts when your letter is ready!",
  greet:'Cher correspondant, chère correspondante,', close:'À bientôt, j\'espère!', place:'Calgary',
  sections:[
   {id:'moi', label:"Présente-toi", prompt:"Ton nom, ton âge, ta ville, ton école.", en:"Your name, age, city, school.", min:15, placeholder:"Je m'appelle… J'ai… ans. J'habite à…",
    checks:[{re:"je m'appelle|mon nom est|mon nom, c'est", msg:"Dis comment tu t'appelles (Je m'appelle…)."},{re:"\\d+ ans|[a-z]+ ans\\b", msg:"Dis ton âge (J'ai … ans)."},{re:"j'habite|je viens de|je vis", msg:"Dis où tu habites (J'habite à…)."}]},
   {id:'routine', label:"Ta routine", prompt:"Décris ton matin avec au moins trois verbes pronominaux et une heure.", en:"Describe your morning with at least three reflexive verbs and a time.", min:18, placeholder:"Le matin, je me réveille à…",
    checks:[{re:"\\b(je|tu|il|elle|on) (me|m'|te|t'|se|s') ?[a-z]+", count:3, msg:"Utilise au moins trois verbes pronominaux (je me réveille, je me douche, je m'habille…)."},
     {re:"\\d+ ?h", msg:"Donne au moins une heure (à 7 h…)."},
     {re:"\\bje (leve|reveille|douche|couche|brosse|habille|prepare|lave)\\b", not:true, msg:"Avec un verbe pronominal, il faut le pronom : je me lève, pas je lève."},
     {re:"\\bje m(e |')[a-z]+er\\b", not:true, msg:"Conjugue le verbe : je me lève (pas je me lever)."}]},
   {id:'ecole', label:"Ton école", prompt:"Compare ton école et le lycée de Quimper. Utilise il faut + infinitif.", en:"Compare your school with the lycée in Quimper. Use il faut + infinitive.", min:15, placeholder:"Chez moi, les cours finissent à… Au lycée, il faut…",
    checks:[{re:"il faut", msg:"Utilise il faut (Chez moi, il faut…)."},{re:"il faut ([a-z']+ )?[a-z]+(er|ir|re)\\b", msg:"Après il faut, mets un verbe à l'infinitif (il faut porter, il faut prendre…)."}]},
   {id:'question', label:"Une question et une exclamation", prompt:"Pose une question à ton correspondant, et écris une exclamation avec quel, quelle, quels ou quelles.", en:"Ask your pen pal a question, and write an exclamation with quel/quelle/quels/quelles.", min:8, placeholder:"Est-ce que tu…? Quelle belle…!",
    checks:[{re:"\\?", msg:"Pose une question (avec un point d'interrogation)."},{re:"\\bquel(le)?s? [^!?.]*!", msg:"Ajoute une exclamation qui commence par quel / quelle / quels / quelles et finit par !"},
     {re:"\\bquel (belle|bonne|jolie|grande|petite|super belle)\\b", not:true, msg:"Accorde quel : quelle belle…, quelle bonne… (avec un nom féminin)."},
     {re:"\\bquelle (beau|bon|joli|grand|petit)\\b", not:true, msg:"Accorde quelle : quel beau…, quel bon… (avec un nom masculin)."}]}],
  done:"Ta lettre est prête! M. Kervella va la lire à sa classe."},
 {t:'npc', who:'maelle', text:"Ta lettre est super! Écoute… les sonneurs commencent. Viens danser la gavotte avec nous! Donne-moi ton petit doigt!", en:"Your letter is great! Listen… the pipers are starting. Come dance the gavotte with us! Give me your little finger!"},
 {t:'finale', scene:'festnoz', who:'maelle', sign:'Fest-noz du lycée', signPos:[36.5,4,27,6], text:"[[Kenavo|Au revoir (breton)|Goodbye]], [nom]! Demain, tu pars pour Bruxelles. N'oublie pas d'écrire!", en:"Goodbye, [nom]! Tomorrow you leave for Brussels. Don't forget to write!", btn:'Terminer la soirée'}
 ]}
];
