/* ===== Le marché: data. Products (what the labels say), the four rayons, three recipes with their lists and cooking steps. ===== */
const SAVE = 'jeuxFr30.marche';
const GAME_ID = 'le-marche';

/* Products. size = what the pack says; amt/u = the same thing as a number so quantities can be checked (u: g, mL, u = pièces).
   art = [painter, options] (see marche-art.js). tags = chips on the label. ing = « Ingrédients ». bb = meilleur avant. */
const PRODUCTS = {
  /* ---- Fruits et légumes ---- */
  tom500:   {st:'legumes', n:'Tomates fraîches', brand:'Ferme Bellevue', size:'sachet de 500 g', amt:500, u:'g', price:3.99, art:['netbag',{items:'tomato',tie:'#e0584f'}], tags:['frais'], ing:'Tomates. Produit de l’Ontario.', bb:'à consommer sous 5 jours'},
  tomcer:   {st:'legumes', n:'Tomates cerises', brand:'Ferme Bellevue', size:'barquette de 250 g', amt:250, u:'g', price:3.49, art:['netbag',{items:'cherry',tie:'#e0584f'}], tags:['frais'], ing:'Tomates cerises. Produit du Mexique.', bb:'à consommer sous 5 jours'},
  car500:   {st:'legumes', n:'Carottes', brand:'Ferme Bellevue', size:'sachet de 500 g', amt:500, u:'g', price:1.99, art:['netbag',{items:'carrot',tie:'#e08a2c'}], tags:['frais'], ing:'Carottes. Produit du Québec.', bb:'à consommer sous 2 semaines'},
  car1k:    {st:'legumes', n:'Carottes', brand:'Ferme Bellevue', size:'sachet de 1 kg', amt:1000, u:'g', price:2.99, art:['netbag',{items:'carrot',tie:'#e08a2c',big:1}], tags:['frais'], ing:'Carottes. Produit du Québec.', bb:'à consommer sous 2 semaines'},
  pdt1k:    {st:'legumes', n:'Pommes de terre', brand:'Ferme Bellevue', size:'sachet de 1 kg', amt:1000, u:'g', price:3.49, art:['netbag',{items:'potato',tie:'#8a6a3c'}], tags:['frais'], ing:'Pommes de terre jaunes. Produit du Québec.', bb:'à consommer sous 3 semaines'},
  pdt2k:    {st:'legumes', n:'Pommes de terre', brand:'Ferme Bellevue', size:'sac de 2 kg', amt:2000, u:'g', price:5.49, art:['netbag',{items:'potato',tie:'#8a6a3c',big:1}], tags:['frais'], ing:'Pommes de terre jaunes. Produit du Québec.', bb:'à consommer sous 3 semaines'},
  oignon:   {st:'legumes', n:'Oignon jaune', brand:'Ferme Bellevue', size:'1 oignon', amt:1, u:'u', price:0.89, art:['onion',{c:'#d9a85a'}], tags:['frais','à l’unité'], ing:'Oignon jaune.', bb:'à consommer sous 4 semaines'},
  oignonr:  {st:'legumes', n:'Oignon rouge', brand:'Ferme Bellevue', size:'1 oignon', amt:1, u:'u', price:0.99, art:['onion',{c:'#a8456e'}], tags:['frais','à l’unité'], ing:'Oignon rouge.', bb:'à consommer sous 4 semaines'},
  ail:      {st:'legumes', n:'Ail', brand:'Ferme Bellevue', size:'1 tête (environ 10 gousses)', amt:1, u:'u', price:0.99, art:['garlic',{}], tags:['frais','à l’unité'], ing:'Ail blanc. Une tête contient environ dix gousses.', bb:'à consommer sous 6 semaines'},
  champ:    {st:'legumes', n:'Champignons blancs', brand:'Ferme Bellevue', size:'barquette de 227 g', amt:227, u:'g', price:2.99, art:['mushrooms',{}], tags:['frais'], ing:'Champignons de Paris.', bb:'à consommer sous 4 jours'},
  laitue:   {st:'legumes', n:'Laitue romaine', brand:'Ferme Bellevue', size:'1 laitue', amt:1, u:'u', price:2.49, art:['lettuce',{}], tags:['frais','à l’unité'], ing:'Laitue romaine.', bb:'à consommer sous 5 jours'},
  poivron:  {st:'legumes', n:'Poivron rouge', brand:'Ferme Bellevue', size:'1 poivron', amt:1, u:'u', price:1.79, art:['pepper',{c:'#d8382f'}], tags:['frais','à l’unité'], ing:'Poivron rouge.', bb:'à consommer sous 7 jours'},
  citron:   {st:'legumes', n:'Citron', brand:'Ferme Bellevue', size:'1 citron', amt:1, u:'u', price:0.79, art:['lemon',{}], tags:['frais','à l’unité'], ing:'Citron.', bb:'à consommer sous 2 semaines'},
  pomme:    {st:'legumes', n:'Pommes Gala', brand:'Verger des Cantons', size:'sachet de 1 kg', amt:1000, u:'g', price:4.49, art:['netbag',{items:'apple',tie:'#d8382f'}], tags:['frais'], ing:'Pommes Gala. Produit du Québec.', bb:'à consommer sous 3 semaines'},

  /* ---- Boulangerie ---- */
  baguette: {st:'boulange', n:'Baguette tradition', brand:'Boulangerie du Coin', size:'1 baguette, non tranchée', amt:1, u:'u', price:2.25, art:['baguette',{}], tags:['entier','frais du jour'], ing:'Farine de blé, eau, sel, levain.', bb:'à manger aujourd’hui'},
  pblanc:   {st:'boulange', n:'Pain blanc tranché', brand:'Boulangerie du Coin', size:'675 g, 20 tranches', amt:20, u:'tr', price:3.49, art:['sliced',{c:'#efd9a0',tie:'#2a7fba'}], tags:['tranché'], ing:'Farine de blé enrichie, eau, sucre, levure, sel.', bb:'meilleur avant : dans 6 jours'},
  pble:     {st:'boulange', n:'Pain de blé entier tranché', brand:'Boulangerie du Coin', size:'675 g, 20 tranches', amt:20, u:'tr', price:3.79, art:['sliced',{c:'#b98443',tie:'#3a8f4a'}], tags:['tranché','blé entier'], ing:'Farine de blé entier, eau, miel, levure, sel.', bb:'meilleur avant : dans 6 jours'},
  seigle:   {st:'boulange', n:'Pain de seigle tranché', brand:'Boulangerie du Coin', size:'500 g, 14 tranches', amt:14, u:'tr', price:4.29, art:['sliced',{c:'#8b6a47',tie:'#a8456e'}], tags:['tranché'], ing:'Farine de seigle, farine de blé, eau, sel, graines de carvi.', bb:'meilleur avant : dans 6 jours'},
  pcamp:    {st:'boulange', n:'Pain de campagne', brand:'Boulangerie du Coin', size:'1 miche entière, non tranchée', amt:1, u:'u', price:4.5, art:['round',{}], tags:['entier'], ing:'Farine de blé, farine de seigle, eau, sel, levain.', bb:'à manger dans les 2 jours'},
  crois:    {st:'boulange', n:'Croissants au beurre', brand:'Boulangerie du Coin', size:'sachet de 4 croissants', amt:4, u:'u', price:4.99, art:['croissants',{}], tags:['frais du jour'], ing:'Farine de blé, beurre, lait, sucre, levure, sel.', bb:'à manger aujourd’hui'},
  brioche:  {st:'boulange', n:'Brioche', brand:'Boulangerie du Coin', size:'400 g', amt:400, u:'g', price:3.99, art:['brioche',{}], tags:['sucré'], ing:'Farine de blé, œufs, beurre, sucre, lait, levure.', bb:'meilleur avant : dans 4 jours'},
  pita:     {st:'boulange', n:'Pain pita', brand:'Boulangerie du Coin', size:'sachet de 6 pains', amt:6, u:'u', price:2.99, art:['pita',{}], tags:['entier'], ing:'Farine de blé, eau, huile, levure, sel.', bb:'meilleur avant : dans 7 jours'},

  /* ---- Produits laitiers et œufs ---- */
  lait1:    {st:'laitier', n:'Lait 2 %', brand:'Laiterie Dubé', size:'1 litre', amt:1000, u:'mL', price:2.29, art:['carton',{body:'#f3f1ea',band:'#3a86d4',cap:'#3a86d4'}], tags:['frais'], ing:'Lait partiellement écrémé, vitamine D.', bb:'meilleur avant : dans 8 jours'},
  lait2:    {st:'laitier', n:'Lait 2 %', brand:'Laiterie Dubé', size:'2 litres', amt:2000, u:'mL', price:4.19, art:['carton',{body:'#f3f1ea',band:'#3a86d4',cap:'#3a86d4',big:1}], tags:['frais'], ing:'Lait partiellement écrémé, vitamine D.', bb:'meilleur avant : dans 8 jours'},
  laitsl:   {st:'laitier', n:'Lait sans lactose', brand:'Laiterie Dubé', size:'1 litre', amt:1000, u:'mL', price:3.19, art:['carton',{body:'#eef3f4',band:'#2aa59a',cap:'#2aa59a'}], tags:['sans lactose','frais'], ing:'Lait écrémé, lactase (enzyme).', bb:'meilleur avant : dans 10 jours'},
  creme:    {st:'laitier', n:'Crème 35 %', brand:'Laiterie Dubé', size:'250 mL', amt:250, u:'mL', price:3.29, art:['carton',{body:'#fbf6e6',band:'#d9a441',cap:'#d9a441'}], tags:['frais'], ing:'Crème, gomme de guar.', bb:'meilleur avant : dans 12 jours'},
  oeuf12:   {st:'laitier', n:'Œufs gros', brand:'Ferme Lambert', size:'une douzaine (12 œufs)', amt:12, u:'u', price:4.29, art:['eggs',{n:12}], tags:['frais'], ing:'Œufs de poules élevées au sol.', bb:'meilleur avant : dans 21 jours'},
  oeuf6:    {st:'laitier', n:'Œufs gros', brand:'Ferme Lambert', size:'une demi-douzaine (6 œufs)', amt:6, u:'u', price:2.49, art:['eggs',{n:6}], tags:['frais'], ing:'Œufs de poules élevées au sol.', bb:'meilleur avant : dans 21 jours'},
  parm100:  {st:'laitier', n:'Parmesan râpé', brand:'Fromagerie Alpina', size:'sachet de 100 g', amt:100, u:'g', price:4.49, art:['bag',{body:'#f1d36b',win:'#fff3b8',label:'#c0392b',grated:1}], tags:['râpé'], ing:'Parmesan (lait, sel, présure).', bb:'meilleur avant : dans 3 mois'},
  parmbl:   {st:'laitier', n:'Parmesan en bloc', brand:'Fromagerie Alpina', size:'bloc de 200 g', amt:200, u:'g', price:7.99, art:['cheeseblock',{c:'#efc94f',w:'#c0392b'}], tags:['en bloc'], ing:'Parmesan (lait, sel, présure).', bb:'meilleur avant : dans 3 mois'},
  ched200:  {st:'laitier', n:'Cheddar en tranches', brand:'Fromagerie Alpina', size:'200 g, 10 tranches', amt:10, u:'tr', price:4.29, art:['slices',{c:'#f2a83a'}], tags:['tranché'], ing:'Cheddar (lait, sel, présure), colorant (rocou).', bb:'meilleur avant : dans 2 mois'},
  mozza250: {st:'laitier', n:'Mozzarella râpée', brand:'Fromagerie Alpina', size:'sachet de 250 g', amt:250, u:'g', price:5.49, art:['bag',{body:'#fffaf0',win:'#fff7da',label:'#3a8f4a',grated:1}], tags:['râpé'], ing:'Mozzarella (lait, sel, présure).', bb:'meilleur avant : dans 2 mois'},
  beurre:   {st:'laitier', n:'Beurre salé', brand:'Laiterie Dubé', size:'250 g', amt:250, u:'g', price:4.99, art:['butter',{}], tags:['frais'], ing:'Crème pasteurisée, sel.', bb:'meilleur avant : dans 2 mois'},
  yogourt:  {st:'laitier', n:'Yogourt nature', brand:'Laiterie Dubé', size:'pot de 650 g', amt:650, u:'g', price:3.99, art:['tub',{c:'#ffffff',band:'#e8668a'}], tags:['frais'], ing:'Lait, ferments lactiques.', bb:'meilleur avant : dans 3 semaines'},

  /* ---- Épicerie ---- */
  spag500:  {st:'epicerie', n:'Spaghetti', brand:'Pasta Nonna', size:'500 g', amt:500, u:'g', price:2.49, art:['pastabox',{head:'#c0392b',c:'#e9b949'}], tags:['pâtes'], ing:'Semoule de blé dur.', bb:'meilleur avant : dans 2 ans'},
  spag1k:   {st:'epicerie', n:'Spaghetti', brand:'Pasta Nonna', size:'1 kg', amt:1000, u:'g', price:4.29, art:['pastabox',{head:'#c0392b',c:'#e9b949',big:1}], tags:['pâtes'], ing:'Semoule de blé dur.', bb:'meilleur avant : dans 2 ans'},
  fusilli:  {st:'epicerie', n:'Fusilli', brand:'Pasta Nonna', size:'500 g', amt:500, u:'g', price:2.49, art:['pastabox',{head:'#3a8f4a',c:'#e9b949',fusilli:1}], tags:['pâtes'], ing:'Semoule de blé dur.', bb:'meilleur avant : dans 2 ans'},
  tomcon:   {st:'epicerie', n:'Tomates en conserve', brand:'Casa Rossa', size:'796 mL', amt:796, u:'mL', price:2.19, art:['can',{label:'#d8382f',stripe:'#f2d45a',icon:'tomato',big:1}], tags:['en conserve'], ing:'Tomates, jus de tomate, sel.', bb:'meilleur avant : dans 2 ans'},
  sauce:    {st:'epicerie', n:'Sauce tomate', brand:'Casa Rossa', size:'pot de 650 mL', amt:650, u:'mL', price:3.49, art:['jar',{content:'#c9382b',lid:'#2c8a4a',label:'#f6e7c4',icon:'tomato'}], tags:['prête à servir'], ing:'Tomates, oignons, ail, basilic, huile, sel.', bb:'meilleur avant : dans 18 mois'},
  huileo:   {st:'epicerie', n:'Huile d’olive', brand:'Olivia', size:'500 mL', amt:500, u:'mL', price:9.99, art:['bottle',{liquid:'#a6b83a',glass:'#7e9a2c',cap:'#2a5d2a',label:'#f4ecd0',icon:'olive'}], tags:['extra vierge'], ing:'Huile d’olive extra vierge.', bb:'meilleur avant : dans 18 mois'},
  huilec:   {st:'epicerie', n:'Huile de canola', brand:'Olivia', size:'1 litre', amt:1000, u:'mL', price:5.49, art:['bottle',{liquid:'#e8c548',glass:'#d6a82b',cap:'#e8a22a',label:'#f4ecd0',icon:'flower'}], tags:[], ing:'Huile de canola.', bb:'meilleur avant : dans 18 mois'},
  vinaigre: {st:'epicerie', n:'Vinaigre balsamique', brand:'Olivia', size:'250 mL', amt:250, u:'mL', price:4.99, art:['bottle',{liquid:'#4a2a1c',glass:'#3a2016',cap:'#1f1f1f',label:'#f4ecd0',icon:'grape'}], tags:[], ing:'Vinaigre de vin, moût de raisin.', bb:'meilleur avant : dans 3 ans'},
  boulleg:  {st:'epicerie', n:'Bouillon de légumes', brand:'Maison Dumas', size:'1 litre', amt:1000, u:'mL', price:3.29, art:['carton',{body:'#f1ecd4',band:'#4a9a3a',cap:'#4a9a3a',icon:'leaf'}], tags:['végétarien'], ing:'Eau, carottes, oignons, céleri, sel, herbes.', bb:'meilleur avant : dans 1 an'},
  boulpou:  {st:'epicerie', n:'Bouillon de poulet', brand:'Maison Dumas', size:'1 litre', amt:1000, u:'mL', price:3.29, art:['carton',{body:'#f6e3b0',band:'#d98a2b',cap:'#d98a2b',icon:'chicken'}], tags:[], ing:'Eau, poulet, sel, oignons, carottes, herbes.', bb:'meilleur avant : dans 1 an'},
  boulleg5: {st:'epicerie', n:'Bouillon de légumes', brand:'Maison Dumas', size:'500 mL', amt:500, u:'mL', price:2.19, art:['carton',{body:'#f1ecd4',band:'#4a9a3a',cap:'#4a9a3a',icon:'leaf'}], tags:['végétarien'], ing:'Eau, carottes, oignons, céleri, sel, herbes.', bb:'meilleur avant : dans 1 an'},
  farine:   {st:'epicerie', n:'Farine tout usage', brand:'Moulin Rivard', size:'sac de 1 kg', amt:1000, u:'g', price:3.29, art:['bag',{body:'#f4efe3',win:'#ffffff',label:'#b5834a',flour:1}], tags:[], ing:'Farine de blé, acide ascorbique.', bb:'meilleur avant : dans 1 an'},
  sel:      {st:'epicerie', n:'Sel fin', brand:'Moulin Rivard', size:'1 kg', amt:1000, u:'g', price:1.49, art:['box',{head:'#2a7fba',body:'#f2f2ee',icon:'drop'}], tags:[], ing:'Sel.', bb:'sans date limite'},
  riz:      {st:'epicerie', n:'Riz basmati', brand:'Pasta Nonna', size:'sac de 900 g', amt:900, u:'g', price:3.99, art:['bag',{body:'#e8d9b0',win:'#fff8e0',label:'#8a5a2a',rice:1}], tags:[], ing:'Riz basmati.', bb:'meilleur avant : dans 2 ans'}
};

/* The four rayons. order = the products in the order they sit on the shelves. */
const STATIONS = {
  legumes:  {name:'Fruits et légumes', sign:'Fruits et légumes', order:['tom500','tomcer','car500','car1k','pdt1k','pdt2k','oignon','oignonr','ail','champ','laitue','poivron','citron','pomme'], cols:7},
  boulange: {name:'Boulangerie',       sign:'Boulangerie',       order:['baguette','pblanc','pble','seigle','pcamp','crois','brioche','pita'], cols:4},
  laitier:  {name:'Produits laitiers et œufs', sign:'Laitiers et œufs', order:['lait1','lait2','laitsl','creme','oeuf12','oeuf6','parm100','parmbl','ched200','mozza250','beurre','yogourt'], cols:6},
  epicerie: {name:'Épicerie',          sign:'Épicerie',          order:['spag500','spag1k','fusilli','tomcon','sauce','huileo','huilec','vinaigre','boulleg','boulpou','boulleg5','farine','sel','riz'], cols:7}
};

/* The three dinners. A list line = what the student must buy: {say, id, n} (n packs of that exact product).
   hints = what to tell the student when a wrong product from the same family is in the basket.
   Steps are the cooking: measure (jug, mL), scale (balance, g), count (click n times), cut (click the board n times), wait (simmer). */
const RECIPES = [
  { id:'pates', nom:'Spaghetti à la sauce tomate', dish:'pasta', serves:3,
    intro:'Inès est végétarienne. Théo n’aime pas les champignons. Ce soir, c’est toi qui fais le souper !',
    lines:[
      {say:'500 g de spaghetti', id:'spag500', n:1, fam:['spag500','spag1k','fusilli'], hints:{spag1k:'Un kilo, c’est trop : il faut un demi-kilo.', fusilli:'Ce sont des fusilli. Il faut des spaghetti.'}},
      {say:'1 kg de tomates fraîches', id:'tom500', n:2, fam:['tom500','tomcer','tomcon','sauce'], hints:{tomcon:'Ce sont des tomates en conserve. Il faut des tomates fraîches.', sauce:'C’est de la sauce toute faite. Il faut des tomates fraîches.', tomcer:'Ce sont des tomates cerises, en petite quantité. Relis la liste.'}},
      {say:'1 oignon jaune', id:'oignon', n:1, fam:['oignon','oignonr'], hints:{oignonr:'Cet oignon est rouge. La liste demande un oignon jaune.'}},
      {say:'2 gousses d’ail', id:'ail', n:1, fam:['ail'], hints:{}, note:'Une tête d’ail contient environ dix gousses : une seule tête suffit.'},
      {say:'100 g de parmesan râpé', id:'parm100', n:1, fam:['parm100','parmbl','ched200','mozza250'], hints:{parmbl:'Ce parmesan est en bloc, pas râpé.', ched200:'Ce n’est pas du parmesan.', mozza250:'Ce n’est pas du parmesan.'}},
      {say:'de l’huile d’olive', id:'huileo', n:1, fam:['huileo','huilec','vinaigre'], hints:{huilec:'C’est de l’huile de canola. Il faut de l’huile d’olive.', vinaigre:'C’est du vinaigre, pas de l’huile.'}}
    ],
    steps:[
      {t:'measure', tool:'jug',   say:'Verse deux litres d’eau dans la casserole.', tgt:2000, u:'mL', inc:250, what:'eau'},
      {t:'cut',     item:'oignon', say:'Coupe l’oignon en dés.', n:4},
      {t:'count',   item:'ail',    say:'Épluche deux gousses d’ail.', n:2, what:'gousses'},
      {t:'count',   item:'huileo', say:'Verse trois cuillères à soupe d’huile d’olive.', n:3, what:'cuillères'},
      {t:'cut',     item:'tom500', say:'Coupe les tomates en morceaux.', n:5},
      {t:'scale',   item:'spag500', say:'Pèse un demi-kilo de spaghetti.', tgt:500, u:'g', inc:50},
      {t:'wait',    say:'Fais cuire les pâtes dix minutes.', mins:10}
    ],
    table:'Du parmesan sur les pâtes : un vrai souper de coloc !' },
  { id:'soupe', nom:'Soupe de légumes et pain grillé', dish:'soup', serves:3,
    intro:'Inès est végétarienne : regarde bien ce qu’il y a dans le bouillon. Ce soir, c’est toi qui fais le souper !',
    lines:[
      {say:'500 g de carottes', id:'car500', n:1, fam:['car500','car1k'], hints:{car1k:'Un kilo, c’est trop : il faut 500 g.'}},
      {say:'1 kg de pommes de terre', id:'pdt1k', n:1, fam:['pdt1k','pdt2k'], hints:{pdt2k:'Ce sac fait 2 kg. Il faut 1 kg.'}},
      {say:'1 oignon jaune', id:'oignon', n:1, fam:['oignon','oignonr'], hints:{oignonr:'Cet oignon est rouge. La liste demande un oignon jaune.'}},
      {say:'1 litre de bouillon de légumes', id:'boulleg', n:1, fam:['boulleg','boulpou','boulleg5'], hints:{boulpou:'Ce bouillon contient du poulet. Inès est végétarienne !', boulleg5:'Ce bouillon fait seulement 500 mL. Il faut un litre.'}},
      {say:'250 mL de crème', id:'creme', n:1, fam:['creme','lait1','lait2','laitsl'], hints:{lait1:'C’est du lait, pas de la crème.', lait2:'C’est du lait, pas de la crème.', laitsl:'C’est du lait, pas de la crème.'}},
      {say:'du pain blanc tranché', id:'pblanc', n:1, fam:['pblanc','pble','seigle','baguette','pcamp','pita'], hints:{pble:'Ce pain est de blé entier. La liste demande du pain blanc.', seigle:'Ce pain est de seigle. La liste demande du pain blanc.', baguette:'La baguette n’est pas tranchée.', pcamp:'Cette miche n’est pas tranchée.', pita:'Ce sont des pitas. Il faut du pain tranché.'}}
    ],
    steps:[
      {t:'cut',     item:'car500', say:'Coupe les carottes en rondelles.', n:5},
      {t:'cut',     item:'pdt1k',  say:'Coupe les pommes de terre en cubes.', n:6},
      {t:'cut',     item:'oignon', say:'Coupe l’oignon en dés.', n:4},
      {t:'measure', tool:'jug', item:'boulleg', say:'Verse un litre de bouillon dans la marmite.', tgt:1000, u:'mL', inc:250, what:'bouillon'},
      {t:'wait',    say:'Laisse mijoter vingt minutes.', mins:20},
      {t:'measure', tool:'jug', item:'creme', say:'Ajoute un quart de litre de crème.', tgt:250, u:'mL', inc:50, what:'crème'},
      {t:'count',   item:'pblanc', say:'Fais griller six tranches de pain.', n:6, what:'tranches'}
    ],
    table:'Une soupe chaude et du pain grillé : parfait pour une soirée d’hiver.' },
  { id:'omelette', nom:'Omelette au fromage et salade', dish:'omelet', serves:3,
    intro:'Théo ne digère pas le lactose. Ce soir, c’est toi qui fais le souper !',
    lines:[
      {say:'une demi-douzaine d’œufs', id:'oeuf6', n:1, fam:['oeuf6','oeuf12'], hints:{oeuf12:'Une douzaine, c’est 12 œufs. Il faut une demi-douzaine.'}},
      {say:'1 litre de lait sans lactose', id:'laitsl', n:1, fam:['laitsl','lait1','lait2'], hints:{lait1:'Ce lait contient du lactose. Théo ne le digère pas.', lait2:'Ce lait contient du lactose. Théo ne le digère pas.'}},
      {say:'200 g de cheddar en tranches', id:'ched200', n:1, fam:['ched200','parm100','parmbl','mozza250'], hints:{parm100:'Ce fromage est râpé, pas en tranches.', parmbl:'Ce fromage est en bloc, pas en tranches.', mozza250:'Ce fromage est râpé, pas en tranches.'}},
      {say:'1 laitue romaine', id:'laitue', n:1, fam:['laitue'], hints:{}},
      {say:'1 poivron rouge', id:'poivron', n:1, fam:['poivron'], hints:{}},
      {say:'1 baguette', id:'baguette', n:1, fam:['baguette','pblanc','pble','seigle','pcamp','pita'], hints:{pblanc:'C’est du pain tranché. La liste demande une baguette.', pble:'C’est du pain tranché. La liste demande une baguette.', seigle:'C’est du pain tranché. La liste demande une baguette.', pcamp:'C’est une miche. La liste demande une baguette.', pita:'Ce sont des pitas. Il faut une baguette.'}}
    ],
    steps:[
      {t:'count',   item:'oeuf6', say:'Casse une demi-douzaine d’œufs dans le bol.', n:6, what:'œufs'},
      {t:'measure', tool:'jug', item:'laitsl', say:'Ajoute un quart de litre de lait.', tgt:250, u:'mL', inc:50, what:'lait'},
      {t:'cut',     item:'poivron', say:'Coupe le poivron en lanières.', n:4},
      {t:'count',   item:'ched200', say:'Ajoute quatre tranches de fromage.', n:4, what:'tranches'},
      {t:'wait',    say:'Fais cuire l’omelette cinq minutes.', mins:5},
      {t:'cut',     item:'laitue', say:'Déchire la laitue pour la salade.', n:5},
      {t:'cut',     item:'baguette', say:'Coupe la baguette en quatre morceaux.', n:4}
    ],
    table:'Une omelette dorée, une salade croquante et du pain frais.' }
];

/* Roommate lines at the table (all friendly: the dinner is a reward, not a verdict). */
const TABLE_TALK = {
  ines: ['Mmm, ça sent tellement bon !', 'Merci d’avoir fait les courses !', 'Je reprends une assiette, si tu veux bien.'],
  theo: ['On mange comme des rois, ce soir.', 'À la tienne, chef !', 'Tu as bien lu les étiquettes, bravo.']
};
