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
        print('ACT 1 end:',G,'| autosave act2:',auto,flush=True)
        # ---------------- ACT 2 ----------------
        async def linknotes(a,b):
            await pg.mouse.move(640,4); await pg.wait_for_timeout(300); await pg.click('.vb[data-act="note"]'); await pg.wait_for_timeout(200)
            ids=await pg.evaluate('ADV.G.notes.map(n=>n.id)')
            for i in (ids.index(a),ids.index(b)): await pg.locator(f'#dlg .nchk input[data-i="{i}"]').check()
            await pg.click('.wbtn .sbtn:has-text("Relier")'); await pg.wait_for_timeout(200); await dismiss()
        await hs('arceneaux','talk'); await dismiss()        # too early: lists what is missing
        await hs('parking','walk'); await pg.wait_for_timeout(600)
        assert await pg.evaluate('ADV._room()')=='carte'
        await pg.screenshot(path=S+'p2_map.png')
        await hs('p-musee','walk'); await pg.wait_for_timeout(600); await dismiss()
        await hs('gagnon','talk'); await dismiss(2); await pg.wait_for_timeout(300)
        await cont(); await cont(); await cont()
        await tiles(['J\'','ai','pas','utilisé','mon badge','.']); fb3=await pg.locator('#dossier .fb').inner_text()
        await tiles(['Je','n\'','ai','pas','utilisé','mon badge','.'])
        await tiles(['Je','n\'','ai','parlé','à','personne','.']); await dismiss()
        await hs('photo','look'); await dismiss(); await hs('porte-manteau','look'); await dismiss()
        await hs('personnel','look'); await pg.wait_for_timeout(300); await cont(); await dismiss()
        await hs('carte','look'); await dismiss()
        await hs('dico','hand'); await dismiss()               # before reading the note: nothing
        await hs('note','look'); await dismiss(); await hs('ordi','hand'); await dismiss()
        await hs('dico','hand'); await dismiss(); await hs('boite','hand'); await dismiss(); await hs('armoire','hand'); await dismiss()
        await pg.screenshot(path=S+'p2_bureauG.png')
        await linknotes('badge3','badgelist'); await linknotes('tel','carte')
        await hs('voiture','walk'); await pg.wait_for_timeout(600)
        await hs('p-bal','walk'); await pg.wait_for_timeout(600); await dismiss()
        await hs('affiche','look'); await pg.wait_for_timeout(300); await cont()
        ins=pg.locator('#dossier input'); await ins.nth(0).fill('40'); await ins.nth(1).fill('20'); await ins.nth(2).fill('20'); await pg.click('#dossier .check'); await pg.wait_for_timeout(1200); await dismiss()
        await hs('tipaul','talk'); await dismiss(); await hs('cedric','talk'); await dismiss(); await hs('cedric','talk'); await menu(0); await dismiss()
        await pg.screenshot(path=S+'p2_bal.png')
        await linknotes('setlist','tipaul')
        await hs('voiture','walk'); await pg.wait_for_timeout(600)
        await hs('p-hotel','walk'); await pg.wait_for_timeout(600); await dismiss()
        await hs('commis','talk'); await menu(0); await dismiss(2); await pg.wait_for_timeout(300); await choose('Au bar'); await choose('Dans sa chambre'); await dismiss()
        await hs('commis','talk'); await menu(0); await dismiss()
        await hs('peeters','talk'); await pg.wait_for_timeout(300); await cont(); await cont(); await cont()
        ins=pg.locator('#dossier input'); await ins.nth(0).fill('75'); await ins.nth(1).fill('53'); await pg.click('#dossier .check'); await pg.wait_for_timeout(1200)
        await choose('Oui'); await dismiss()
        await pg.screenshot(path=S+'p2_hotel.png')
        await linknotes('hotelclerk','foulard'); await linknotes('peeters','camera'); await linknotes('tel','foulard')
        await hs('voiture','walk'); await pg.wait_for_timeout(600)
        await hs('p-poste','walk'); await pg.wait_for_timeout(600); await dismiss()
        await hs('arceneaux','talk'); await dismiss(3); await pg.wait_for_timeout(300)
        await plan('TIMELINE'); await choose('utilisé mon badge'); await choose('resté ici'); await choose('parlé à personne'); await dismiss(3); await pg.wait_for_timeout(300)
        # recommendations: wrong evidence, then three good ones (one each)
        await tiles(['Agente Broussard,','je','te','recommande','de','vérifier','la camionnette du groupe','.']); await choose('perle'); await dismiss(); await pg.wait_for_timeout(300)
        await tiles(['Agente Broussard,','je','te','recommande','de','vérifier','la camionnette du groupe','.']); await choose('peinture'); await dismiss(); await pg.wait_for_timeout(300)
        await tiles(['Agente Broussard,','je','te','recommande','de','surveiller','les prêteurs sur gages','.']); await choose('perle'); await dismiss(); await pg.wait_for_timeout(300)
        await tiles(['Agent Thibodeaux,','je','vous','recommande','de','surveiller','les prêteurs sur gages','.']); await choose('perle'); await dismiss(); await pg.wait_for_timeout(300)
        await pg.screenshot(path=S+'p2_reco.png')
        await tiles(['Je recommande au sergent LeBlanc','de','vérifier','l\'appel de 22 h 15','.']); await choose('cellulaire'); await dismiss()
        G2=await pg.evaluate('({score:ADV.G.score, clock:ADV.G.clock, act3:!!ADV.G.flags.act3, recos:ADV.G.recos2, links:ADV.G.notes.filter(n=>n.link).length, tries:ADV.G.linkTries||0})')
        auto=await pg.evaluate("!!JSON.parse(localStorage.getItem('jeuxFr20.enquete')).auto.state.flags.act3")
        print('ACT 2 end:',G2,flush=True)
        # ---------------- ACT 3 ----------------
        await hs('arceneaux','talk'); await dismiss(3); await pg.wait_for_timeout(300)
        for _ in range(3):
            await cont(); txtp=await pg.locator('#dossier .act .prompt').inner_text()
            await choose('une nouvelle piste')
        await dismiss()
        await hs('parking','walk'); await pg.wait_for_timeout(600)
        await hs('p-bb','walk'); await pg.wait_for_timeout(700); await dismiss()
        assert await pg.evaluate('ADV._room()')=='rue'
        await pg.screenshot(path=S+'p3_rue.png')
        await hs('boutique','hand'); await dismiss()           # too early: Broussard says wait
        await hs('broussard','talk'); await dismiss(3); await pg.wait_for_timeout(300)
        await choose('Dans la boutique')
        await tiles(['LeBlanc,','bloque','la porte de derrière','!']); fb4=await pg.locator('#dossier .fb').inner_text()
        await tiles(['LeBlanc,','bloquez','la porte de derrière','!'])
        await tiles(['Broussard,','entre','avec moi','!'])
        await tiles(['Thibodeaux,','ne','laissez','partir','personne','pas','!']); fb5=await pg.locator('#dossier .fb').inner_text()
        await tiles(['Thibodeaux,','ne','laissez','partir','personne','!']); await dismiss(); await pg.wait_for_timeout(700); await dismiss()
        assert await pg.evaluate('ADV._room()')=='boutique'
        await hs('porte','walk'); await pg.wait_for_timeout(500); f2=await vis('#fail'); await pg.screenshot(path=S+'p3_fail_rights.png'); await pg.click('#btnRetry'); await pg.wait_for_timeout(300)
        await hs('cedric','talk'); await pg.wait_for_timeout(300)
        await tiles(['Tu as','le droit','de','garder le silence','.']); await tiles(['Vous avez','le droit','de','garder le silence','.'])
        await tiles(['Tout ce que','vous direz','pourra être utilisé','contre vous','.']); await tiles(['Vous avez','le droit','à','un avocat','.']); await dismiss()
        await hs('bijoux','hand'); await dismiss(); await hs('bijoux','item','appareil'); await dismiss(); await hs('bijoux','hand'); await dismiss()
        await hs('camera','look'); await dismiss(2); await pg.wait_for_timeout(300); await pg.screenshot(path=S+'p3_camera.png')
        await choose('plus petite'); await choose('foulard vert'); await tiles(['C\'est','sa','foulard','.']); await tiles(['C\'est','son','foulard','.']); await dismiss()
        await hs('cedric','talk'); await menu(2); await dismiss()
        await hs('broussard','talk'); await dismiss(2); await pg.wait_for_timeout(300)
        await tiles(['C\'est','la conservatrice','que','a téléphoné','au gardien','à 22 h 15','.']); fb6=await pg.locator('#dossier .fb').inner_text()
        await tiles(['C\'est','la conservatrice','qui','a téléphoné','au gardien','à 22 h 15','.'])
        await tiles(['C\'est','la femme','que','le réceptionniste','a vue','avec Cédric','.']); await dismiss()
        await pg.screenshot(path=S+'p3_boutique.png')
        G3=await pg.evaluate('({score:ADV.G.score, clock:ADV.G.clock, act4:!!ADV.G.flags.act4, inv:ADV.G.inv})')
        auto=await pg.evaluate("!!JSON.parse(localStorage.getItem('jeuxFr20.enquete')).auto.state.flags.act4")
        print('ACT 3 end:',G3,flush=True)
        # ---------------- ACT 4 + FINALE ----------------
        await hs('porte','walk'); await pg.wait_for_timeout(600); await dismiss()
        await hs('voiture','hand'); await pg.wait_for_timeout(600)
        await hs('p-poste','walk'); await pg.wait_for_timeout(600); await dismiss()
        await hs('arceneaux','talk'); await dismiss()                      # jewels not logged yet
        await hs('p-preuves','walk'); await pg.wait_for_timeout(500); await dismiss()
        await hs('landry','item','moitie'); await dismiss()
        await hs('p-brief','walk'); await pg.wait_for_timeout(500); await dismiss()
        await hs('arceneaux','talk'); await dismiss(); await pg.wait_for_timeout(700); await dismiss()
        assert await pg.evaluate('ADV._room()')=='interro'
        async def ask(q,ev):
            await hs('cedric','talk'); await dismiss(1); await pg.wait_for_timeout(300); await choose(q); await choose(ev); await dismiss()
        await hs('cedric','talk'); await dismiss(1); await pg.wait_for_timeout(300); await choose('vous lui avez prise'); await choose('vous l\'avez prise'); await choose('foulard'); await dismiss()  # wrong pronoun, wrong evidence
        s_wrong=await pg.evaluate('ADV.G.score')
        await ask('vous l\'avez prise','Ti-Paul')
        await ask('vous les avez encore','Ti-Paul')
        await ask('vous les portiez','bottes de Cédric')
        await pg.screenshot(path=S+'p4_interro.png')
        await ask('vous l\'avez vue','texto de'); await dismiss()
        await hs('porte','walk'); await pg.wait_for_timeout(600)
        await hs('p-bureau','walk'); await pg.wait_for_timeout(600)
        print('pre-report:',await pg.evaluate('({f:ADV.G.flags.interroDone, i:ADV.G.interro, busy:ADV._busy()})'),flush=True)
        await hs('bureau','hand'); await pg.wait_for_timeout(400)
        bad={'faits':"Il a pris la parure. Il a allé au musée.",'ecarte':"Le gardien a pas ouvert la vitrine.",'coupables':"Cédric est coupable.",'reco':"Je recommande à arrêter Mme Gagnon."}
        good={'faits':"D'abord, la conservatrice a téléphoné au gardien vers 22 h 15. Ensuite, le gardien est monté au deuxième étage. Pendant la pause du groupe, Cédric Thériot est venu au musée avec la camionnette rouge. À 22 h 18, il a ouvert la porte de service avec le badge de Mme Gagnon. Puis, il a déplacé la planche et il a pris la parure. Enfin, il est retourné sur scène à 22 h 50.",
              'ecarte':"Le gardien n'a pas ouvert la vitrine : sa clé n'est jamais sortie. Le collectionneur n'a pas quitté l'hôtel : nous n'avons rien trouvé contre lui.",
              'coupables':"C'est Cédric Thériot qui a volé la parure. C'est Geneviève Gagnon qui a organisé le vol. C'est la femme que le réceptionniste a vue avec le voleur. Son badge et son appel le prouvent.",
              'reco':"Je vous recommande de délivrer un mandat contre Mme Gagnon avant minuit."}
        async def write(src):
            ta=pg.locator('#dossier textarea')
            for i in range(await ta.count()):
                await ta.nth(i).fill(src[['faits','ecarte','coupables','reco'][i]])
            await pg.click('#dossier .check'); await pg.wait_for_timeout(400)
        await write(bad); errs_bad=await pg.locator('#dossier .lerr').all_inner_texts()
        await pg.screenshot(path=S+'p4_report_bad.png')
        await write(good); await pg.wait_for_timeout(300)
        await pg.screenshot(path=S+'p4_report_ok.png')
        await pg.click('#dossier .cont'); await pg.wait_for_timeout(300); await cont(); await dismiss(2); await pg.wait_for_timeout(300)
        await dismiss(1); await pg.wait_for_timeout(3000); await pg.screenshot(path=S+'p4_chase.png'); await pg.wait_for_timeout(7800)
        await dismiss(1); await pg.wait_for_timeout(600); await pg.screenshot(path=S+'p4_dock.png'); await dismiss(6)
        await pg.wait_for_timeout(600); await pg.screenshot(path=S+'p4_end.png',full_page=True)
        endshown=await vis('#endscr'); FIN=await pg.evaluate('({score:ADV.G.score, final:ADV.API.finalScore(), rank:ADV.API.rank(), won:!!ADV.G.flags.won, bonus:ADV.G.bonus, fails:ADV.G.fails||0})')
        P=await pg.evaluate("JSON.parse(localStorage.getItem('jeuxFr20.voyage')).done"); J=await pg.evaluate("JSON.parse(localStorage.getItem('gv.v1')||'{}').played")
        print('report errors on the bad draft:',errs_bad); print('score after wrong evidence:',s_wrong)
        print('END:',endshown,FIN,'| passport:',P,'| jetons:',J)
        print('imperative hints:',fb4,'|',fb5); print('qui/que hint:',fb6); print('rights failure shown:',f2)
        print('qc hint:',fb3)
        print('cafe hint:',fb1); print('reco hint:',fb2); print('clock after bad reco',c_bad,'mismatch accepted?',mism)
        print('unlogged failure shown:',failed,'| ACT 3 end:',G3,'| autosave act4:',auto)
        print('ERR',errs)
        await b.close()
    srv.terminate()
asyncio.run(main())
