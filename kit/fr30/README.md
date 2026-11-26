# kit/fr30: sources des jeux 30-3Y (« La colocation »)

Même idée que `kit/fr20/` : le code source vit ici, `python3 build.py` assemble chaque jeu en **un seul fichier HTML** dans `out/30-3y/`, puis on copie la page finie dans `30-3y/`.

## Jeux
| Jeu | Source | Page publiée | État |
|---|---|---|---|
| 1 Ma semaine | (source hors dépôt) | `30-3y/01-ma-semaine.html` | publié |
| 2 Le marché | `src/marche-*.js`, `src/marche.css`, `src/game.html` | `30-3y/02-le-marche.html` | en construction |

## Construire
```
cd kit/fr30
python3 build.py          # écrit out/30-3y/02-le-marche.html
cp out/30-3y/02-le-marche.html ../../30-3y/
```

## Règles
- **Le pack Modern Interiors (LimeZu) ne va jamais dans le dépôt.** Les feuilles brutes restent sur l'ordinateur ; ici, `assets-private/` est ignoré par git. Seuls les sprites découpés et intégrés dans la page finale (data URI) sont publiés. Crédit : limezu.itch.io.
- Art 16 px, agrandi par des multiples entiers (`image-rendering: pixelated` pour les sprites raster seulement). Un seul éclairage chaud. Police Jersey 15 (accents français).
- Chaque page appelle `GVJetons.award(id, ratio)` à la fin d'une partie (`../jetons.js` est inséré par `build.py`).
- Les réflexions en anglais sont permises au niveau 30.
- Pas de thème voyage ni passeport au niveau 30.
