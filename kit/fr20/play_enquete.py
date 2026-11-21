"""Usage: python3 play_enquete.py [out/20-3y]  (after python3 build.py). Automated playthrough: prologue + Act 1 of L'enquête (good path, a bad recommendation, two failure screens)."""
import asyncio, subprocess, time, re
from playwright.async_api import async_playwright
import pathlib, sys
OUT=sys.argv[1] if len(sys.argv)>1 else str(pathlib.Path(__file__).parent/'out'/'20-3y'); S='/tmp/'
async def main():
    srv=subprocess.Popen(['python3','-m','http.server','8765'],cwd=OUT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
    errs=[]; log=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
        pg=await b.new_page(viewport={'width':1280,'height':800},device_scale_factor=1)
        pg.on('pageerror',lambda e:errs.append(str(e))); pg.set_default_timeout(5000)
        await pg.goto('http://localhost:8765/voyage.html')
        await pg.evaluate("localStorage.clear(); localStorage.setItem('jeuxFr20.voyage', JSON.stringify({name:'Léa',gender:'fille',agree:'f',skin:2,hair:3,style:'long',done:{},stars:{}}))")
        await pg.goto('http://localhost:8765/08-enquete.html'); await pg.wait_for_timeout(400)
        vis=lambda q: pg.locator(q).is_visible()
        async def dismiss(n=12):
            for _ in range(n):
                await pg.wait_for_timeout(140)
                if await vis('#msg'): await pg.keyboard.press('Enter')
                elif not await pg.evaluate('ADV._busy()'): return
        async def walkwait():
            for _ in range(80):
                await pg.wait_for_timeout(120)
                if await vis('#msg') or await vis('#dossier') or await vis('#dlg') or await vis('#fail'): return
                if not await pg.evaluate('ADV._busy()'): return
        async def hs(id,verb,sel=None):
            r=await pg.evaluate(f"ADV._hs('{id}','{verb}',{repr(sel) if sel else 'null'})"); log.append((id,verb,sel,r)); print('>',id,verb,sel or '',r,await pg.evaluate('ADV._room()'),flush=True)
            assert r=='ok', r
            await walkwait()
        async def tiles(words):
            await pg.click('#dossier [data-a=clear]')
            for t in words: await pg.locator('#dossier .tilebank .tile:not(:disabled)').filter(has_text=re.compile('^'+re.escape(t)+'$')).first.click()
            await pg.click('#dossier .check'); await pg.wait_for_timeout(1000)
        async def plan(const):
            await pg.evaluate(f"""(()=>{{ const s={const}; const chips=()=>[...document.querySelectorAll('#dossier .chip')];
              s.items.forEach(it=>{{ const c=chips().find(b=>b.textContent===fmt(it.txt,ADV.API.G&&null)||b.textContent===it.txt); c&&c.click(); document.querySelectorAll('#dossier .slots .slot')[it.ok[0]].click(); }}); }})()""")
            await pg.click('#dossier .check'); await pg.wait_for_timeout(1300)
        async def choose(text):
            await pg.locator('#dossier .opt', has_text=text).first.click(); await pg.wait_for_timeout(700)
        async def cont(): await pg.click('#dossier .cont'); await pg.wait_for_timeout(150)
        async def menu(i): await pg.locator('#dlg .mrow').nth(i).click(); await pg.wait_for_timeout(150)
        async def use(item): await pg.evaluate(f"ITEMS.{item}.use(ADV.API), 0"); await pg.wait_for_timeout(200)

        await pg.click('#tNew'); await dismiss()
        await hs('tiroir','hand'); await dismiss()
        await hs('porte','walk'); await pg.wait_for_timeout(500); await dismiss()
        assert await pg.evaluate('ADV._room()')=='briefing'
        await hs('p-preuves','walk'); await pg.wait_for_timeout(400); await dismiss()
        await hs('landry','talk'); await dismiss(3); await pg.wait_for_timeout(300)
        await plan('PROCEDURE'); await dismiss()
        await hs('p-brief','walk'); await pg.wait_for_timeout(500); await dismiss()   # the call comes in
        log.append(('call', await pg.evaluate('ADV.G.flags.call'), await pg.evaluate('ADV.G.clock')))
        await hs('p-cafe','walk'); await pg.wait_for_timeout(400); await dismiss()
        await hs('boudreaux','talk'); await dismiss(2); await pg.wait_for_timeout(300)
        await tiles(['Je voudrais','de le','café',',','des','beignets','et','de la','tarte aux noix de pécan',',','s\'il vous plaît','.'])
        fb1=await pg.locator('#dossier .fb').inner_text()
        await tiles(['Je voudrais','du','café',',','des','beignets','et','de la','tarte aux noix de pécan',',','s\'il vous plaît','.']); await dismiss()
        await hs('p-brief','walk'); await pg.wait_for_timeout(400); await dismiss()
        await hs('radio','hand'); await dismiss()
        await hs('parking','walk'); await pg.wait_for_timeout(600); await dismiss()
        assert await pg.evaluate('ADV._room()')=='musee'
        await use('gants'); await dismiss()
        await hs('perle','item','appareil'); await dismiss()
        await hs('perle','hand'); await dismiss()
        await hs('boue','look'); await dismiss()
        await hs('boue','item','appareil'); await dismiss()
        await hs('vitrine','look'); await dismiss()
        await hs('etiquettes','hand'); await pg.wait_for_timeout(300); await plan('LABELS'); await dismiss()
        await pg.screenshot(path=S+'p_musee_done.png')
        await hs('porte','walk'); await pg.wait_for_timeout(500); await dismiss()
        assert await pg.evaluate('ADV._room()')=='quai'
        await hs('pneus','item','appareil'); await dismiss()
        await hs('borne','item','appareil'); await dismiss()
        await hs('borne','hand'); await dismiss()
        await hs('hebert','talk'); await menu(0); await dismiss(); await hs('hebert','talk'); await menu(1); await dismiss()
        await hs('porte-poste','walk'); await pg.wait_for_timeout(500); await dismiss()
        await hs('guidry','talk'); await dismiss(2); await pg.wait_for_timeout(300)
        await cont(); await cont(); await cont(); await choose('Il mangeait'); await choose('Il vérifiait'); await choose('Le téléphone'); await dismiss()
        await hs('badges','look'); await pg.wait_for_timeout(300); await cont()
        ins=pg.locator('#dossier input'); await ins.nth(0).fill('22 h 18'); await ins.nth(1).fill('3'); await pg.click('#dossier .check'); await pg.wait_for_timeout(1200); await dismiss()
        await hs('tel','look'); await dismiss(); await hs('cles','look'); await dismiss()
        await pg.screenshot(path=S+'p_poste.png')
        # bad recommendation first, then evidence mismatch, then the good one
        await use('radio'); await dismiss(2); await pg.wait_for_timeout(300)
        await tiles(['Je recommande au sergent LeBlanc','de','interroger','le collectionneur belge','.']); fb2=await pg.locator('#dossier .fb').inner_text()
        await tiles(['Je recommande au sergent LeBlanc','d\'','interroger','le collectionneur belge','.']); await choose('planche'); await dismiss()
        c_bad=await pg.evaluate('ADV.G.clock')
        await use('radio'); await dismiss(2); await pg.wait_for_timeout(300)
        await tiles(['Agent Thibodeaux,','je','vous','recommande','de','suivre','les traces de boue','.']); await choose('peinture'); await dismiss()
        mism=await pg.evaluate('!!ADV.G.flags.recoBoue')
        await use('radio'); await dismiss(2); await pg.wait_for_timeout(300)
        await tiles(['Agent Thibodeaux,','je','vous','recommande','de','suivre','les traces de boue','.']); await pg.screenshot(path=S+'p_radio.png'); await choose('boue'); await dismiss()
        await hs('porte','walk'); await pg.wait_for_timeout(500); await dismiss()
        await hs('voiture','hand'); await menu(0); await pg.wait_for_timeout(600); await dismiss()
        assert await pg.evaluate('ADV._room()')=='briefing'
        await hs('arceneaux','talk'); await menu(0); await pg.wait_for_timeout(500)
        failed=await vis('#fail'); await pg.screenshot(path=S+'p_fail_unlogged.png')
        await pg.click('#btnRetry'); await pg.wait_for_timeout(300)
        await hs('p-preuves','walk'); await pg.wait_for_timeout(500); await dismiss()
        await hs('landry','item','perle'); await dismiss(); await hs('landry','item','peinture'); await dismiss()
        await hs('p-brief','walk'); await pg.wait_for_timeout(500); await dismiss()
        await hs('arceneaux','talk'); await menu(0); await dismiss()
        G=await pg.evaluate('({score:ADV.G.score, clock:ADV.G.clock, act2:!!ADV.G.flags.act2, notes:ADV.G.notes.length, inv:ADV.G.inv})')
        auto=await pg.evaluate("!!JSON.parse(localStorage.getItem('jeuxFr20.enquete')).auto.state.flags.act2")
        print('cafe hint:',fb1); print('reco hint:',fb2); print('clock after bad reco',c_bad,'mismatch accepted?',mism)
        print('unlogged failure shown:',failed,'| end:',G,'| autosave act2:',auto)
        print('ERR',errs)
        await b.close()
    srv.terminate()
asyncio.run(main())
