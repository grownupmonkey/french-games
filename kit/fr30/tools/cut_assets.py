#!/usr/bin/env python3
"""Cut the sprites Le marché needs and write assets-private/assets.json (gitignored).

Usage:
  python3 tools/cut_assets.py --grocery "<.../Theme_Sorter/16_Grocery_store_16x16.png>" \
        --ma-page ../../30-3y/01-ma-semaine.html [--preview preview.png]

The Modern Interiors pack (LimeZu, limezu.itch.io) must never be committed. The shared
character layers, kitchen props and the Jersey 15 font come out of the already-built page
of Ma semaine, so only the grocery sheet is read from the pack.
Groups in the JSON: g (grocery crops), p/k/t/l (copied from Ma semaine), font (woff2, base64).
"""
import argparse, base64, io, json, pathlib, re
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ap = argparse.ArgumentParser()
ap.add_argument('--grocery', required=True)
ap.add_argument('--ma-page', required=True)
ap.add_argument('--out', default=str(pathlib.Path(__file__).parent.parent / 'assets-private' / 'assets.json'))
ap.add_argument('--preview')
a = ap.parse_args()

sheet = Image.open(a.grocery).convert('RGBA')
alpha = np.array(sheet)[:, :, 3] > 0
lab, _ = ndi.label(ndi.binary_dilation(alpha, structure=np.ones((3, 3))))
comps = []
for i, sl in enumerate(ndi.find_objects(lab), 1):
    m = (lab[sl] == i) & alpha[sl]
    if m.sum() >= 12:
        comps.append((sl[0].start, sl[1].start, sl[0].stop, sl[1].stop))
comps.sort(key=lambda c: (c[0] // 24, c[1]))      # same order as the contact sheets used to pick indices

def comp(i):
    y0, x0, y1, x1 = comps[i]
    return (x0, y0, x1, y1)

# name: component index (int) or (x0, y0, x1, y1) rectangle; every crop is trimmed to its alpha box
CROPS = {
    'shelf_lav': 32, 'shelf_cream': 34, 'shelf_lav_n': 33, 'shelf_cream_n': 35,
    'fridge_cream': 73, 'fridge_lav': 74,
    'cart_blue': 13, 'cart_red': 14, 'cart_green': 15, 'carts': 6,
    'bakery_counter': 135, 'bakery_counter2': 143, 'pastry_counter': 211, 'bench': 223,
    'register': 190, 'checkout': 216, 'counter_white': 202,
    'plant1': 240, 'plant2': 246, 'plant3': 250, 'flowers': 233, 'plants_row': 239,
    'crate_teal': (32, 971, 48, 996), 'crate_brown1': (16, 971, 32, 996), 'crate_brown2': (48, 971, 64, 997),
    'crate_green2': (64, 977, 96, 1006),
    'pile_lime': (64, 960, 80, 976), 'pile_lemon': (80, 959, 95, 977), 'pile_orange': (96, 959, 112, 990),
    'pile_red': (112, 959, 129, 977), 'pile_cherry': (128, 959, 144, 977), 'pile_pink': (127, 978, 144, 992),
    'pile_grape': (127, 992, 144, 1010), 'pile_yellow': (96, 992, 112, 1010), 'pile_greens': (128, 1022, 144, 1040),
    'pile_pumpkin': (96, 1022, 112, 1040),
    'bread_a': (112, 434, 127, 448), 'bread_b': (128, 434, 143, 448), 'bread_c': (144, 434, 160, 448),
    'bread_d': (112, 449, 127, 463), 'bread_e': (128, 449, 143, 464), 'bread_f': (144, 449, 160, 464),
    'bread_g': (80, 465, 96, 479), 'bread_h': (96, 465, 112, 479),
}

def trim(im):
    bb = im.getbbox()
    return im.crop(bb) if bb else im

def b64(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

out = {'g': {}}
for name, spec in CROPS.items():
    box = comp(spec) if isinstance(spec, int) else spec
    out['g'][name] = b64(trim(sheet.crop(box)))

page = pathlib.Path(a.ma_page).read_text()
j = page.index('{', page.index('ASSETS='))
assets, _ = json.JSONDecoder().raw_decode(page[j:])
for k in 'pktl':
    out[k] = assets[k]
m = re.search(r"@font-face\{font-family:Pix;font-weight:400;src:url\(data:font/woff2;base64,([A-Za-z0-9+/=]+)\)", page)
out['font'] = m.group(1)

pathlib.Path(a.out).parent.mkdir(parents=True, exist_ok=True)
pathlib.Path(a.out).write_text(json.dumps(out, separators=(',', ':')))
print('wrote', a.out, len(json.dumps(out)) // 1024, 'KB;', len(out['g']), 'grocery crops')

if a.preview:                                       # contact sheet to check every crop by eye
    from PIL import ImageDraw
    names = list(out['g']); cols = 8; cw, ch = 120, 100
    sh = Image.new('RGBA', (cols * cw, ((len(names) + cols - 1) // cols) * ch), (70, 60, 80, 255)); d = ImageDraw.Draw(sh)
    for n, name in enumerate(names):
        im = Image.open(io.BytesIO(base64.b64decode(out['g'][name]))).convert('RGBA')
        sc = max(1, min(4, 70 // max(im.size)))
        im = im.resize((im.width * sc, im.height * sc), Image.NEAREST)
        x, y = (n % cols) * cw, (n // cols) * ch
        sh.alpha_composite(im, (x + 4, y + 16)); d.text((x + 3, y + 2), '%s %dx%d' % (name, *Image.open(io.BytesIO(base64.b64decode(out['g'][name]))).size), fill=(255, 255, 120, 255))
    sh.save(a.preview)
