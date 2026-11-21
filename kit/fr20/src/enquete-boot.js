/* ---------- boot ---------- */
(function(){
 const lookFor=p=>Object.assign(playerLook(p,{coat:'trench',pants:'url(#pantsDark)'}),{collar:'#E9E3D8'});
 const p = Store.get();
 ADV.start({ rooms:ROOMS, items:ITEMS, profile:p, playerLook:p?lookFor(p):null, lookFor, first:'musee', maxScore:300,
   state:{ inv:['gants','appareil','sachets'] },
   hintCost:2, hint:HINT, glossary:GLOSSARY,
   ranks:[ {min:0,name:'Agent{|e} stagiaire'}, {min:.35,name:'Agent{|e} débutant{|e}'}, {min:.55,name:'Enquêt{eur|rice}'}, {min:.75,name:'Enquêt{eur|rice} principal{|e}'}, {min:.9,name:'Inspect{eur|rice} émérite'} ] });
})();
