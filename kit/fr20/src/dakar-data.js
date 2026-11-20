/* ===== Escale 4 : Dakar, Sénégal — La teranga =====
   Curriculum (French 20-3Y): 20 C 1.2 (friendships and relationships: a host family);
   20 R 2.1e déterminants possessifs (mon/ma/mes, son/sa/ses, notre/votre/leur(s)), 2.3a possessive de,
   2.12a agreement and placement of adjectives, 2.12b comparative and superlative (plus/moins/aussi … que, le plus, meilleur),
   2.4a questions, 3.2 tu / vous, 2.7b-c passé composé review.
   Culture (R 4.1a, 4.1e): la teranga, Wolof, Senghor, marché HLM, Gorée, les Lions de la Teranga, le thiéboudienne, l'attaya.
   Text markup: [[mot|français standard|English]] (here: Wolof words and Senegalese French), {masc|fém}, [nom]. */
const GAME={id:'dakar', title:'La teranga', place:'Dakar', eyebrow:'Escale 4 · Dakar, Sénégal',
 introName:'Arrivée à Dakar', mapAria:'Carte de Dakar et de l\'île de Gorée', playerExtra:{noHat:true, scarf:'', coat:'cream'},
 mapLabels:`<span class="maplabel river" style="left:4%;top:8%">océan Atlantique</span><span class="maplabel" style="left:44%;top:46%">Dakar</span><span class="maplabel" style="left:6%;top:44%;font-size:1.3cqw">pointe des Almadies</span>`,
 lede:"Ta famille d'accueil, les Diop, t'accueille avec beaucoup de teranga. Trouve un cadeau pour chaque personne avant le grand souper de vendredi!",
 endText:"Grâce à toi, chaque membre de la famille Diop a reçu un cadeau, et le souper a duré toute la soirée. Tu as gagné le tampon de Dakar dans ton passeport."};

const INTRO={who:'awa', steps:[
 {t:'npc', text:"[[Dalal ak jàmm|Bienvenue (wolof)|Welcome]], [nom]! Bienvenue à Dakar! Je suis Awa, ta sœur d'accueil. [[Nanga def?|Comment ça va? (wolof)|How are you?]]", en:"Welcome, [nom]! Welcome to Dakar! I'm Awa, your host sister. How are you?"},
 {t:'choice', prompt:"Réponds à Awa.", en:"Answer Awa.", opts:[
  {txt:"Ça va très bien, merci! C'est ma première visite en Afrique.", ok:true},
  {txt:"Ça va très bien, merci! C'est mon première visite en Afrique.", why:"Visite est féminin : ma première visite.", whyEn:"Visite is feminine: ma."},
  {txt:"Ça va très bien, merci! C'est mes première visite en Afrique.", why:"Mes, c'est pour le pluriel. Une visite, c'est singulier et féminin : ma première visite.", whyEn:"Mes is plural. Use ma."}]},
 {t:'npc', text:"En wolof, on répond : [[Mangi fi rekk|Ça va, je suis là (wolof)|I'm fine]]! Ici, la [[teranga|hospitalité (wolof)|hospitality]], c'est très important. Toute ma famille t'attend à la maison!", en:"In Wolof, you answer: Mangi fi rekk! Here, teranga (hospitality) is very important. My whole family is waiting for you at home!"},
 {t:'npc', text:"Vendredi soir, maman prépare un grand thiéboudienne pour toi. Ce sera ta fête!", en:"Friday night, Mom is making a big thiéboudienne for you. It'll be your party!"},
 {t:'choice', prompt:"Tu veux remercier la famille. Dis-le à Awa.", en:"You want to thank the family. Tell Awa.", opts:[
  {txt:"Je voudrais offrir un cadeau à chaque personne de ta famille.", ok:true},
  {txt:"Je voudrais offrir un cadeau à chaque personne de ton famille.", why:"Famille est féminin : ta famille.", whyEn:"Famille is feminine: ta famille."},
  {txt:"Je voudrais offrir un cadeau à chaque personne de sa famille.", why:"Tu parles à Awa de sa famille à elle : avec tu, on dit ta famille.", whyEn:"You're talking to Awa: use ta (your)."}]},
 {t:'npc', text:"C'est trop gentil! Je vais t'aider. [[On est ensemble|On est solidaires (expression sénégalaise)|We're in this together]]! Viens, on va à la maison d'abord.", en:"That's so kind! I'll help you. We're in this together! Come, let's go home first."},
 {t:'card', title:"Le Sénégal", text:"Le Sénégal est en Afrique de l'Ouest. Sa capitale, Dakar, est la ville la plus à l'ouest de l'Afrique continentale. Le français est la langue officielle, mais la plupart des Sénégalais parlent aussi wolof. Le premier président du pays, Léopold Sédar Senghor, était un grand poète. En 1983, il est devenu membre de l'Académie française.", en:"Senegal is in West Africa. Its capital, Dakar, is the westernmost city of mainland Africa. French is the official language, but most Senegalese people also speak Wolof. The country's first president, Léopold Sédar Senghor, was a great poet. In 1983 he became a member of the Académie française."}
]};

const STOPS=[
{id:'maison', name:'La maison des Diop', sub:'La famille d\'accueil', who:'fatou', toast:'En route vers la maison des Diop…',
 steps:[
 {t:'npc', text:"[[Dalal ak jàmm|Bienvenue (wolof)|Welcome]] chez nous, [nom]! Je suis Fatou, la mère d'Awa. Fais comme chez toi!", en:"Welcome to our home, [nom]! I'm Fatou, Awa's mother. Make yourself at home!"},
 {t:'choice', prompt:"Mme Diop est une adulte. Réponds poliment.", en:"Mme Diop is an adult. Answer politely.", opts:[
  {txt:"Merci beaucoup, madame. Votre maison est très belle!", ok:true},
  {txt:"Merci beaucoup, madame. Ta maison est très belle!", why:"Avec une adulte, on utilise vous, donc votre maison.", whyEn:"With an adult, use vous: votre maison."},
  {txt:"Merci beaucoup, madame. Votre maison est très beau!", why:"Maison est féminin : très belle.", whyEn:"Maison is feminine: belle."}]},
 {t:'npc', text:"Regarde la photo sur le mur. Voici mon mari, Moussa. Il est professeur. Voici notre fils, Ibou : il a dix ans et il adore le foot. Et voici [[Mame|grand-mère (wolof)|Grandma]] Coumba, la mère de Moussa.", en:"Look at the photo on the wall. Here's my husband, Moussa. He's a teacher. Here's our son, Ibou: he's ten and he loves soccer. And here's Grandma Coumba, Moussa's mother."},
 {t:'fill', prompt:"Qui est Mame Coumba?", en:"Who is Mame Coumba?", before:"Mame Coumba est la grand-mère", after:"Awa.", opts:["d'","de","à"], ans:"d'",
  why:{'de':"Devant une voyelle (Awa), de devient d' : la grand-mère d'Awa.", 'à':"Pour la possession, on écrit de : la grand-mère d'Awa."}},
 {t:'fill', prompt:"Parle d'Ibou.", en:"Talk about Ibou.", before:"Ibou adore le foot.", after:"équipe préférée, ce sont les Lions du Sénégal.", opts:['Son','Sa','Ses'], ans:'Son',
  why:{'Sa':"Équipe est féminin, mais elle commence par une voyelle : on dit son équipe.", 'Ses':"Ses, c'est pour le pluriel. Une équipe : son équipe."}},
 {t:'fill', prompt:"Parle de Moussa et Fatou.", en:"Talk about Moussa and Fatou.", before:"Moussa et Fatou ont deux enfants.", after:"enfants s'appellent Awa et Ibou.", opts:['Leurs','Leur','Ses'], ans:'Leurs',
  why:{'Leur':"Il y a plusieurs enfants (pluriel) : leurs enfants.", 'Ses':"Les parents sont deux : on utilise leurs (à eux), pas ses."}},
 {t:'choice', prompt:"Fatou dit : « Parle-moi de ta famille! » Compare.", en:"Fatou says: Tell me about your family! Compare.", opts:[
  {txt:"Ma sœur est plus âgée que moi, et mon frère est plus jeune.", ok:true},
  {txt:"Ma sœur est plus âgée de moi, et mon frère est plus jeune.", why:"Pour comparer, on utilise que : plus âgée que moi.", whyEn:"To compare, use que."},
  {txt:"Mon sœur est plus âgée que moi, et mon frère est plus jeune.", why:"Sœur est féminin : ma sœur.", whyEn:"Sœur is feminine: ma sœur."}]},
 {t:'npc', who:'awa', text:"(Tout bas) Psst! Maman adore les beaux tissus. Allons au marché HLM, c'est le meilleur marché de tissus de Dakar!", en:"(Whispering) Psst! Mom loves beautiful fabrics. Let's go to the HLM market, it's the best fabric market in Dakar!"},
 {t:'clue', text:"Cadeau pour Fatou : un beau tissu, au marché HLM."},
 {t:'card', title:"La famille et la teranga", text:"Au Sénégal, les familles sont souvent grandes, et les grands-parents habitent parfois avec leurs enfants et leurs petits-enfants. On respecte beaucoup les personnes âgées. Quand on arrive chez quelqu'un, on prend le temps de saluer chaque personne et de demander des nouvelles de toute la famille.", en:"In Senegal, families are often large, and grandparents sometimes live with their children and grandchildren. Elders are deeply respected. When you arrive at someone's home, you take time to greet each person and ask about the whole family."}
 ]},
{id:'marche', name:'Le marché HLM', sub:'Comparer et marchander', who:'ndiaye', toast:'En route vers le marché HLM…',
 steps:[
 {t:'npc', text:"[[Nanga def?|Comment ça va? (wolof)|How are you?]] Bienvenue! Regarde mes tissus : du wax, du bazin… Tout est beau ici!", en:"How are you? Welcome! Look at my fabrics: wax prints, bazin… Everything is beautiful here!"},
 {t:'choice', prompt:"Explique ce que tu cherches.", en:"Explain what you're looking for.", opts:[
  {txt:"Je cherche un cadeau pour ma mère d'accueil.", ok:true},
  {txt:"Je cherche un cadeau pour mon mère d'accueil.", why:"Mère est féminin : ma mère.", whyEn:"Mère is feminine: ma mère."},
  {txt:"Je cherche un cadeau pour mes mère d'accueil.", why:"Tu as une seule mère d'accueil : ma mère (singulier).", whyEn:"One mother: ma (singular)."}]},
 {t:'npc', text:"Ce tissu bleu est plus cher que le tissu jaune, mais il est plus beau! Le tissu vert est aussi cher que le tissu bleu.", en:"This blue fabric is more expensive than the yellow fabric, but it's more beautiful! The green fabric is as expensive as the blue fabric."},
 {t:'choice', prompt:"Quel tissu est le moins cher?", en:"Which fabric is the least expensive?", opts:[
  {txt:"Le tissu jaune est le moins cher.", ok:true},
  {txt:"Le tissu bleu est le moins cher.", why:"Le bleu est plus cher que le jaune. Le jaune est donc le moins cher.", whyEn:"Blue costs more than yellow."},
  {txt:"Le tissu vert est le moins cher.", why:"Le vert est aussi cher que le bleu, et le bleu est plus cher que le jaune.", whyEn:"Green costs the same as blue."}]},
 {t:'choice', prompt:"Décris le tissu que tu préfères. Attention à la place des adjectifs!", en:"Describe the fabric you prefer. Watch where the adjectives go!", opts:[
  {txt:"C'est un beau tissu bleu.", ok:true},
  {txt:"C'est un tissu beau bleu.", why:"Beau se place avant le nom : un beau tissu. Les couleurs vont après : un beau tissu bleu.", whyEn:"Beau goes before the noun; colours go after."},
  {txt:"C'est un bleu beau tissu.", why:"Les couleurs vont après le nom : un beau tissu bleu.", whyEn:"Colours go after the noun."}]},
 {t:'fill', prompt:"Tu admires une autre étoffe.", en:"You admire another cloth.", before:"Et cette couleur est très", after:"aussi!", opts:['belle','beau','bel'], ans:'belle',
  why:{'beau':"Couleur est féminin : belle.", 'bel':"Bel s'utilise devant un nom masculin qui commence par une voyelle (un bel oiseau). Ici : la couleur est belle."}},
 {t:'npc', text:"Pour toi, cinq mille francs CFA.", en:"For you, five thousand CFA francs."},
 {t:'npc', who:'awa', text:"(Tout bas) Au marché, on marchande! Demande un prix plus bas.", en:"(Whispering) At the market, you bargain! Ask for a lower price."},
 {t:'choice', prompt:"Marchande poliment avec Mme Ndiaye.", en:"Bargain politely with Mme Ndiaye.", opts:[
  {txt:"C'est un peu cher! Est-ce que vous pouvez faire un meilleur prix?", ok:true},
  {txt:"C'est un peu cher! Est-ce que vous pouvez faire un plus bon prix?", why:"On ne dit pas plus bon. Le comparatif de bon, c'est meilleur.", whyEn:"Not plus bon: the comparative of bon is meilleur."},
  {txt:"C'est un peu cher! Tu peux faire un prix plus cher?", why:"Tu veux un prix moins cher (ou meilleur), pas plus cher! Et avec une adulte, on dit vous.", whyEn:"You want a lower price, and use vous with an adult."}]},
 {t:'npc', text:"[[Waaw|Oui (wolof)|Yes]], d'accord : quatre mille. Et pour Mame Coumba, prends du thé vert et de la menthe pour l'attaya. Elle va adorer!", en:"Yes, OK: four thousand. And for Grandma Coumba, take some green tea and mint for attaya. She'll love it!"},
 {t:'clue', text:"Tu as le tissu pour Fatou et du thé pour Mame Coumba. Prochain arrêt : l'île de Gorée."},
 {t:'card', title:"Le wax et les tailleurs", text:"Au Sénégal, on achète souvent du tissu au marché, puis on va chez un tailleur, qui coud un vêtement sur mesure. Les tissus wax ont des motifs et des couleurs vives. Au marché, marchander est normal : on discute du prix avec le vendeur, toujours avec le sourire. La monnaie du Sénégal est le franc CFA.", en:"In Senegal, people often buy fabric at the market, then go to a tailor who sews a custom-made outfit. Wax fabrics have bold patterns and colours. At the market, bargaining is normal: you discuss the price with the seller, always with a smile. Senegal's currency is the CFA franc."}
 ]},
{id:'goree', name:'L\'île de Gorée', sub:'L\'artiste et la mémoire', who:'ousmane', toast:'En chaloupe vers l\'île de Gorée…', sign:'Tableaux de sable', signPos:[6.3,22.2,22.9,5.6],
 steps:[
 {t:'npc', text:"Bienvenue à Gorée! Ici, il n'y a pas de voitures. Moi, je fais des tableaux avec du sable de toutes les couleurs.", en:"Welcome to Gorée! There are no cars here. I make pictures with sand of every colour."},
 {t:'fill', prompt:"Utilise le superlatif.", en:"Use the superlative.", before:"C'est le tableau", after:"coloré de la boutique!", opts:['le plus','plus','la plus'], ans:'le plus',
  why:{'plus':"Quand le superlatif est après le nom, on répète l'article : le tableau le plus coloré.", 'la plus':"Tableau est masculin : le plus coloré."}},
 {t:'npc', text:"Ce tableau montre la Maison des Esclaves. C'est le lieu le plus important de l'île. On la visite avec respect.", en:"This picture shows the House of Slaves. It's the most important place on the island. People visit it with respect."},
 {t:'choice', prompt:"Pose une question à Ousmane sur la Maison des Esclaves.", en:"Ask Ousmane a question about the House of Slaves.", opts:[
  {txt:"Qu'est-ce qu'on peut voir dans la Maison des Esclaves?", ok:true},
  {txt:"Qu'est-ce que on peut voir dans la Maison des Esclaves?", why:"Devant une voyelle, que devient qu' : qu'est-ce qu'on.", whyEn:"Before a vowel, que becomes qu'."},
  {txt:"Quoi est-ce qu'on peut voir dans la Maison des Esclaves?", why:"Pour poser une question sur une chose, on dit qu'est-ce que (pas quoi est-ce que).", whyEn:"Use qu'est-ce que, not quoi est-ce que."}]},
 {t:'npc', text:"On peut voir les petites cellules et la « porte du voyage sans retour ». Pendant la traite des esclaves, des millions d'Africains ont été déportés vers les Amériques. Aujourd'hui, c'est un lieu de mémoire pour le monde entier.", en:"You can see the small cells and the \"door of no return.\" During the slave trade, millions of Africans were deported to the Americas. Today it's a place of remembrance for the whole world."},
 {t:'choice', prompt:"Choisis un tableau pour Moussa, le père d'Awa.", en:"Choose a picture for Moussa, Awa's father.", opts:[
  {txt:"Je prends ce tableau de la mer. C'est le plus beau!", ok:true},
  {txt:"Je prends ce tableau de la mer. C'est le plus belle!", why:"Tableau est masculin : le plus beau.", whyEn:"Tableau is masculine: beau."},
  {txt:"Je prends ce tableau de la mer. C'est la plus beau!", why:"Tableau est masculin : le plus beau (pas la).", whyEn:"Use le, not la."}]},
 {t:'npc', text:"Excellent choix! Et pour ton amie Awa? J'ai aussi de jolis bracelets en perles.", en:"Excellent choice! And for your friend Awa? I also have pretty bead bracelets."},
 {t:'fill', prompt:"Explique pour qui est le bracelet.", en:"Explain who the bracelet is for.", before:"Ce bracelet est pour", after:"sœur d'accueil, Awa.", opts:['ma','mon','mes'], ans:'ma',
  why:{'mon':"Sœur est féminin : ma sœur.", 'mes':"Une seule sœur : ma sœur."}},
 {t:'clue', text:"Tu as un tableau de sable pour Moussa et un bracelet pour Awa. Il reste un cadeau pour Ibou!"},
 {t:'card', title:"L'île de Gorée", text:"L'île de Gorée est à environ vingt minutes de Dakar en chaloupe. Ses maisons colorées et ses rues sans voitures sont très calmes. La Maison des Esclaves rappelle la traite des esclaves, un des plus grands crimes de l'histoire. L'île est inscrite au patrimoine mondial de l'UNESCO depuis 1978. Des chefs d'État comme Nelson Mandela et Barack Obama sont venus s'y recueillir.", en:"Gorée Island is about twenty minutes from Dakar by ferry. Its colourful houses and car-free streets are very calm. The House of Slaves recalls the slave trade, one of the greatest crimes in history. The island has been a UNESCO World Heritage Site since 1978. Leaders like Nelson Mandela and Barack Obama came there to pay their respects."}
 ]},
{id:'plage', name:'La plage', sub:'Le foot avec Ibou', who:'ibou', toast:'Retour à Dakar, direction la plage…',
 steps:[
 {t:'npc', text:"Salut [nom]! Tu joues au foot avec nous? Moi, je suis le meilleur joueur de mon équipe!", en:"Hi [nom]! Want to play soccer with us? I'm the best player on my team!"},
 {t:'choice', prompt:"Ibou court très vite. Compare-toi à lui.", en:"Ibou runs very fast. Compare yourself to him.", opts:[
  {txt:"D'accord! Mais tu es plus rapide que moi!", ok:true},
  {txt:"D'accord! Mais tu es plus rapide de moi!", why:"Pour comparer, on utilise que : plus rapide que moi.", whyEn:"To compare, use que."},
  {txt:"D'accord! Mais tu es plus rapide que je!", why:"Après que, on utilise moi (pronom tonique) : plus rapide que moi.", whyEn:"After que, use moi."}]},
 {t:'fill', prompt:"Ibou parle de son joueur préféré.", en:"Ibou talks about his favourite player.", before:"Pour moi, Sadio Mané est le", after:"joueur du Sénégal!", opts:['meilleur','plus bon','mieux'], ans:'meilleur',
  why:{'plus bon':"On ne dit pas plus bon. Le superlatif de bon, c'est le meilleur.", 'mieux':"Mieux est un adverbe (il joue mieux). Avec un nom, on dit le meilleur joueur."}},
 {t:'npc', text:"Mon rêve, c'est d'avoir le maillot des Lions de la [[Teranga|hospitalité (wolof)|hospitality]]. Mais il est trop cher pour moi…", en:"My dream is to have a Lions of Teranga jersey. But it's too expensive for me…"},
 {t:'choice', prompt:"Écris le rêve d'Ibou dans ton carnet.", en:"Write Ibou's dream in your notebook.", opts:[
  {txt:"Le rêve d'Ibou, c'est d'avoir le maillot des Lions.", ok:true},
  {txt:"Le rêve à Ibou, c'est d'avoir le maillot des Lions.", why:"À l'écrit, la possession se fait avec de : le rêve d'Ibou.", whyEn:"In writing, possession uses de."},
  {txt:"Le rêve de Ibou, c'est d'avoir le maillot des Lions.", why:"Devant une voyelle, de devient d' : le rêve d'Ibou.", whyEn:"Before a vowel, de becomes d'."}]},
 {t:'npc', text:"Regarde, un vendeur de maillots! Le vert coûte huit mille francs, et le blanc coûte huit mille francs aussi.", en:"Look, a jersey seller! The green one costs eight thousand francs, and the white one costs eight thousand too."},
 {t:'choice', prompt:"Compare les deux maillots.", en:"Compare the two jerseys.", opts:[
  {txt:"Le maillot vert est aussi cher que le maillot blanc.", ok:true},
  {txt:"Le maillot vert est plus cher que le maillot blanc.", why:"Ils coûtent le même prix : aussi cher que.", whyEn:"They cost the same: aussi cher que."},
  {txt:"Le maillot vert est aussi cher comme le maillot blanc.", why:"Avec aussi, on utilise que : aussi cher que.", whyEn:"Aussi takes que, not comme."}]},
 {t:'clue', text:"Tu as acheté un maillot vert des Lions pour Ibou. Tous les cadeaux sont prêts!"},
 {t:'card', title:"Le foot et la lutte", text:"Au Sénégal, on joue au foot partout, surtout sur les plages. L'équipe nationale, les Lions de la Teranga, a gagné la Coupe d'Afrique des nations en 2022. La lutte sénégalaise est aussi très populaire : les grands lutteurs sont de vraies vedettes, et les combats attirent des milliers de spectateurs.", en:"In Senegal, people play soccer everywhere, especially on beaches. The national team, the Lions of Teranga, won the Africa Cup of Nations in 2022. Senegalese wrestling is also very popular: top wrestlers are real stars, and matches draw thousands of spectators."}
 ]},
{id:'souper', name:'Le grand souper', sub:'Offrir les cadeaux', who:'fatou', night:true, toast:'Retour à la maison pour le souper…',
 steps:[
 {t:'npc', text:"À table! Voici le thiéboudienne : du riz, du poisson et des légumes. Au Sénégal, on mange ensemble, dans un grand plat.", en:"Dinner's ready! Here's thiéboudienne: rice, fish and vegetables. In Senegal, we eat together from one big dish."},
 {t:'choice', prompt:"Fatou demande : « Comment tu trouves le thiéboudienne? »", en:"Fatou asks: How do you like the thiéboudienne?", opts:[
  {txt:"C'est délicieux! C'est le meilleur repas de mon voyage!", ok:true},
  {txt:"C'est délicieux! C'est le plus bon repas de mon voyage!", why:"On ne dit pas le plus bon : le meilleur repas.", whyEn:"Not le plus bon: le meilleur."},
  {txt:"C'est délicieux! C'est la meilleure repas de mon voyage!", why:"Repas est masculin : le meilleur repas.", whyEn:"Repas is masculine."}]},
 {t:'choice', prompt:"Offre le tissu à Fatou (tu la vouvoies).", en:"Give the fabric to Fatou (you use vous with her).", opts:[
  {txt:"Madame Diop, voici votre cadeau : un beau tissu bleu.", ok:true},
  {txt:"Madame Diop, voici ton cadeau : un beau tissu bleu.", why:"Tu vouvoies Mme Diop : votre cadeau.", whyEn:"You use vous with her: votre."},
  {txt:"Madame Diop, voici votre cadeau : un tissu bleu beau.", why:"Beau se place avant le nom : un beau tissu bleu.", whyEn:"Beau goes before the noun."}]},
 {t:'fill', prompt:"Offre le maillot à Ibou (tu le tutoies).", en:"Give the jersey to Ibou (you use tu with him).", before:"Ibou, voici", after:"maillot des Lions!", opts:['ton','ta','votre'], ans:'ton',
  why:{'ta':"Maillot est masculin : ton maillot.", 'votre':"Ibou a dix ans : tu le tutoies, donc ton maillot."}},
 {t:'fill', prompt:"Offre le thé à Mame Coumba (une aînée : tu la vouvoies).", en:"Give the tea to Mame Coumba (an elder: use vous).", before:"Mame Coumba, voici du thé pour", after:"attaya.", opts:['votre','vos','ton'], ans:'votre',
  why:{'vos':"Attaya est singulier : votre attaya.", 'ton':"On vouvoie une personne âgée par respect : votre attaya."}},
 {t:'fill', prompt:"Offre le tableau aux deux parents.", en:"Give the picture to both parents.", before:"Monsieur et Madame Diop, ce tableau est pour", after:"salon.", opts:['votre','leur','ton'], ans:'votre',
  why:{'leur':"Tu parles directement aux parents : votre salon (à vous). Leur, c'est quand on parle d'eux.", 'ton':"Tu parles à deux personnes, et tu les vouvoies : votre salon."}},
 {t:'npc', who:'awa', text:"Et moi? Oh, un bracelet! [[Jërëjëf|Merci (wolof)|Thank you]], [nom]! C'est le plus beau cadeau!", en:"And me? Oh, a bracelet! Thank you, [nom]! It's the most beautiful gift!"},
 {t:'order', prompt:"Raconte ta semaine à la famille.", en:"Tell the family about your week.", done:"Bravo! Toute la famille applaudit.", items:[
  "Je suis arrivé{|e} chez la famille Diop.",
  "J'ai acheté un tissu au marché HLM.",
  "J'ai pris la chaloupe pour l'île de Gorée.",
  "J'ai joué au foot avec Ibou sur la plage.",
  "J'ai offert les cadeaux au souper."]},
 {t:'npc', text:"Merci, [nom]. Maintenant, tu fais partie de notre famille. [[Ba beneen yoon|À la prochaine (wolof)|See you next time]]! Demain, tu pars pour la Bretagne, c'est ça?", en:"Thank you, [nom]. Now you're part of our family. See you next time! Tomorrow you leave for Brittany, right?"},
 {t:'card', title:"Le thiéboudienne et l'attaya", text:"Le thiéboudienne (ceebu jën en wolof) est le plat national du Sénégal : du riz, du poisson et des légumes cuits dans une sauce tomate. Depuis 2021, il fait partie du patrimoine culturel immatériel de l'UNESCO. Après le repas, on prépare souvent l'attaya, un thé vert à la menthe servi en trois tournées : le premier verre est fort et amer, le dernier est très sucré.", en:"Thiéboudienne (ceebu jën in Wolof) is Senegal's national dish: rice, fish and vegetables cooked in a tomato sauce. Since 2021 it has been on UNESCO's Intangible Cultural Heritage list. After the meal, people often make attaya, a green mint tea served in three rounds: the first glass is strong and bitter, the last one is very sweet."}
 ]}
];
