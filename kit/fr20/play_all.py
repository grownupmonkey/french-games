"""Automated playthrough of 20-3Y games 1-6 (Playwright + /usr/bin/google-chrome) using solve.js.
Usage: python3 play_all.py out/20-3y [wrong]   -- run after python3 build.py; prints ALL OK or FAIL."""
import asyncio, subprocess, sys, time
from playwright.async_api import async_playwright
OUT=sys.argv[1]; MODE=sys.argv[2] if len(sys.argv)>2 else 'good'
import pathlib
SOLVE=(pathlib.Path(__file__).parent/'solve.js').read_text()
GAMES=['01-quebec','02-montreal','03-acadie','04-dakar','05-bretagne','06-bruxelles']
async def run(b, g):
    pg=await b.new_page(viewport={'width':1280,'height':900})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.add_init_script("const _st=window.setTimeout; window.setTimeout=(f,t,...a)=>_st(f,Math.min(t||0,40),...a); window.print=()=>{};")
    await pg.goto('http://localhost:8766/voyage.html')
    await pg.evaluate("localStorage.clear(); localStorage.setItem('jeuxFr20.voyage', JSON.stringify({name:'Sam',gender:'nb',agree:'f',skin:2,hair:1,style:'mid',done:{},stars:{}}))")
    await pg.goto(f'http://localhost:8766/{g}.html'); await pg.wait_for_timeout(300)
    labels=[]
    for i in range(900):
        if await pg.locator('#scrEnd').is_visible(): break
        if await pg.locator('#scrMap').is_visible():
            await pg.click('#goNext'); await pg.wait_for_timeout(60); continue
        lab=await pg.evaluate(SOLVE, MODE); labels.append(lab)
        if lab.startswith('wait') or lab=='none': await pg.wait_for_timeout(120)
        await pg.wait_for_timeout(45)
    end=await pg.locator('#scrEnd').is_visible()
    wrongs=[l for l in labels if l.endswith('-wrong')]
    await pg.close()
    return end, len(labels), errs, wrongs
async def main():
    srv=subprocess.Popen(['python3','-m','http.server','8766'],cwd=OUT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    ok=True
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        for g in GAMES:
            end,n,errs,wr=await run(b,g); ok&=end and not errs
            print(f'{g}: finished={end} actions={n} errors={errs[:3]} wrong-tries={wr}')
        await b.close()
    srv.terminate(); print('ALL OK' if ok else 'FAIL')
asyncio.run(main())
