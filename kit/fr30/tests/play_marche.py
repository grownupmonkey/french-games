#!/usr/bin/env python3
"""Automated playthrough of Le marché (Playwright + system Chrome).
Usage: python3 tests/play_marche.py [out/30-3y/02-le-marche.html] [screenshot_dir]
Plays: avatar -> intro -> store -> shelves -> wrong basket (must be refused) -> fixed basket -> cooking -> dinner -> reflection -> bilan."""
import sys, pathlib, json
from playwright.sync_api import sync_playwright
HERE = pathlib.Path(__file__).resolve().parent.parent
page_path = pathlib.Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else HERE / 'out' / '30-3y' / '02-le-marche.html'
shots = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else pathlib.Path('/tmp/marche-shots')
shots.mkdir(parents=True, exist_ok=True)
errors = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 1440, 'height': 810})
    pg.on('pageerror', lambda e: errors.append('PAGEERROR ' + str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    snap = lambda n: pg.screenshot(path=str(shots / (n + '.png')))
    pg.goto('file://' + str(page_path)); pg.wait_for_timeout(700); snap('01-title')
    pg.click('#tAv'); pg.wait_for_timeout(300); snap('02-creator')
    pg.fill('#nm', 'Alex'); pg.click('#crOk'); pg.wait_for_timeout(300); snap('03-intro')
    pg.click('#inGo'); pg.wait_for_timeout(1700); snap('04-store-list')
    pg.click('#listX')
    recipe = pg.evaluate('G.recipe'); print('recipe:', recipe['id'])
    lines = recipe['lines']
    STAND = {'legumes': (70, 60), 'boulange': (187, 60), 'laitier': (288, 55), 'epicerie': (404, 55)}
    def goto_station(st):
        x, y = STAND[st]
        pg.mouse.click(x * 3, y * 3)
        pg.wait_for_function("mode==='shelf'", timeout=15000); pg.wait_for_timeout(300)
    def take(pid, n):
        i = pg.evaluate(f"SH.items.findIndex(it=>it.id==={json.dumps(pid)})")
        assert i >= 0, ('not on this shelf', pid)
        pg.click(f'#ptags .ptag[data-i="{i}"]'); pg.wait_for_selector('#label')
        for _ in range(n): pg.click('#lPlus')
        return i
    def leave(): pg.click('#shBack'); pg.wait_for_function("mode==='store'"); pg.wait_for_timeout(200)
    products = json.loads(pg.evaluate('JSON.stringify(PRODUCTS)'))
    # 1) first attempt: one deliberately wrong product (from the first line's wrong family), the rest right
    wrong_id = next(iter(lines[0]['hints'].keys()))
    for k, L in enumerate(lines):
        pid, n = (wrong_id, 1) if k == 0 else (L['id'], L['n'])
        goto_station(products[pid]['st'])
        if k == 0: snap('05-shelf')
        take(pid, n)
        if k == 0: snap('06-label')
        pg.click('#lClose'); leave()
    pg.click('#bCart'); pg.wait_for_selector('#cartp'); snap('07-cart'); pg.click('#cPay')
    pg.wait_for_selector('#rGo:visible', timeout=15000); snap('08-receipt'); pg.click('#rGo')
    pg.wait_for_selector('#vchk'); snap('09-check-wrong')
    assert 'Attends' in pg.inner_text('#vchk'), 'a wrong basket must be refused'
    pg.click('#vBack'); pg.wait_for_function("mode==='store'")
    # 2) fix: swap the wrong item for the right one
    pg.evaluate(f"cartAdd({json.dumps(wrong_id)},-1)")
    goto_station(products[lines[0]['id']]['st']); take(lines[0]['id'], lines[0]['n']); pg.click('#lClose'); leave()
    pg.click('#bCart'); pg.click('#cPay'); pg.wait_for_selector('#rGo:visible', timeout=15000); pg.click('#rGo')
    pg.wait_for_selector('#vchk'); snap('10-check-ok')
    assert 'Tout est dans les sacs' in pg.inner_text('#vchk')
    pg.click('#vGo'); pg.wait_for_function("mode==='cook'", timeout=10000); pg.wait_for_timeout(900)
    # 3) cooking
    for si, s in enumerate(recipe['steps']):
        pg.wait_for_selector('#cw', timeout=8000)
        assert f"étape {si+1} sur" in pg.inner_text("#cook").lower()
        if si == 0: snap('11-cook-1')
        t = s['t']
        if t in ('measure', 'scale'):
            for _ in range(s['tgt'] // s['inc']): pg.click('#mPlus')
            if si == 0:  # try a wrong amount first
                pg.click('#mMinus'); pg.click('#mOk'); pg.wait_for_timeout(200); assert 'Pas assez' in pg.inner_text('#cmsg'); snap('12-cook-wrong'); pg.click('#mPlus')
            pg.click('#mOk')
        elif t == 'count':
            for _ in range(s['n']): pg.click('#bi')
            pg.click('#mOk')
        elif t == 'cut':
            for _ in range(s['n']): pg.click('#bi')
        elif t == 'wait':
            pg.click('#mOk'); snap('13-cook-wait')
        pg.wait_for_function(f"stepIdx>{si}", timeout=9000); pg.wait_for_timeout(250)
    pg.wait_for_function("mode==='dinner'", timeout=9000); pg.wait_for_timeout(5500); snap('14-dinner-a')
    pg.wait_for_timeout(5200); snap('15-dinner-b')
    pg.click('#dGo'); pg.wait_for_selector('.reflect', timeout=5000); pg.wait_for_timeout(900); snap('16-reflect')
    pg.click('.chips[data-q=label] .chip >> nth=2'); pg.click('.chips[data-q=words] .chip >> nth=1'); pg.fill('#rText', 'I will read the size and the ingredients first.')
    pg.click('#rDone'); pg.wait_for_selector('.bilan', timeout=5000); pg.wait_for_timeout(900); snap('17-bilan')
    print('score', pg.evaluate('scoreNow()'), 'lineErr', pg.evaluate('G.lineErr'), 'cookErr', pg.evaluate('G.cookErr'))
    b.close()
real = [e for e in errors if 'AudioContext' not in e]
print('ERRORS:', real if real else 'none')
sys.exit(1 if real else 0)
