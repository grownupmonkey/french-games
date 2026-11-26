#!/usr/bin/env python3
"""Stitch the French 30-3Y sources into single-file pages in out/30-3y/.

Needs assets-private/assets.json (made by tools/cut_assets.py from the LimeZu pack; never committed).
Usage: python3 build.py [path/to/assets.json]
"""
import json, pathlib, subprocess, sys
HERE = pathlib.Path(__file__).parent
S = HERE / 'src'
OUT = HERE / 'out' / '30-3y'
OUT.mkdir(parents=True, exist_ok=True)
r = lambda n: (S / n).read_text()

assets_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'assets-private' / 'assets.json'
if not assets_path.exists():
    sys.exit('Missing %s.\nRun: python3 tools/cut_assets.py --grocery "<pack>/1_Interiors/16x16/Theme_Sorter/16_Grocery_store_16x16.png" --ma-page ../../30-3y/01-ma-semaine.html' % assets_path)
assets = json.loads(assets_path.read_text())
font = assets.pop('font')

def page(tpl, **parts):
    h = r(tpl)
    for k, v in parts.items():
        h = h.replace(k, v)
    return h

engine = ''.join(r(n) for n in ['marche-core.js', 'marche-store.js', 'marche-cook.js', 'marche-end.js'])
html = page('game.html', **{
    '/*TITLE*/': 'Le marché — La colocation',
    '/*FONT*/': font,
    '/*CSS*/': r('marche.css'),
    '/*ASSETS*/': json.dumps(assets, separators=(',', ':')),
    '/*JETONS*/': r('../../jetons.js'),
    '/*DATA*/': r('marche-data.js'),
    '/*ART*/': r('marche-art.js'),
    '/*ENGINE*/': engine})
(OUT / '02-le-marche.html').write_text(html)
for f in sorted(OUT.iterdir()):
    print(f.name, f.stat().st_size // 1024, 'KB')

# syntax check of the script block
js = html[html.rindex('<script>') + 8:html.rindex('</script>')]
p = subprocess.run(['node', '--check', '-'], input=js, text=True, capture_output=True)
print('SYNTAX_OK' if p.returncode == 0 else p.stderr)
