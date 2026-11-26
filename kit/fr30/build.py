#!/usr/bin/env python3
"""Stitch the French 30-3Y sources into single-file pages in out/30-3y/."""
import pathlib
HERE = pathlib.Path(__file__).parent
S = HERE / 'src'
OUT = HERE / 'out' / '30-3y'
OUT.mkdir(parents=True, exist_ok=True)
r = lambda n: (S / n).read_text()

def page(tpl, **parts):
    h = r(tpl)
    for k, v in parts.items():
        h = h.replace(k, v)
    return h

(OUT / '02-le-marche.html').write_text(page('game.html', **{
    '/*TITLE*/': 'Le marché — La colocation',
    '/*CSS*/': r('marche.css'),
    '/*JETONS*/': r('../../jetons.js'),
    '/*DATA*/': r('marche-data.js'),
    '/*ENGINE*/': r('marche-engine.js')}))

for f in sorted(OUT.iterdir()):
    print(f.name, f.stat().st_size)
