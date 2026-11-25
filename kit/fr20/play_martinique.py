#!/usr/bin/env python3
"""Plays Escale 7 (La montagne Pelée) end to end: one wrong answer per task type first, then the right one."""
import asyncio, sys, subprocess, time, pathlib, json
from playwright.async_api import async_playwright
OUT=sys.argv[1] if len(sys.argv)>1 else str(pathlib.Path(__file__).parent/'out'/'20-3y'); FLAT='flat' in sys.argv; S='/tmp/'
async def main():
  srv=subprocess.Popen(['python3','-m','http.server','8766'],cwd=OUT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
  try:
    async with async_playwright() as p:
      b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
      pg=await b.new_page(viewport={'width':1280,'height':800}); errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
      await pg.goto('http://localhost:8766/07-martinique.html')
      await pg.evaluate("localStorage.setItem('jeuxFr20.voyage',JSON.stringify({name:'Léa',gender:'fille',agree:'f',skin:2,hair:3,done:{quebec:'1',montreal:'1',acadie:'1',dakar:'1',bretagne:'1',bruxelles:'1'},stars:{}}))")
      await pg.reload(); await pg.wait_for_timeout(2500)
      if FLAT: await pg.click('#tFlat'); await pg.wait_for_timeout(500)
      await pg.screenshot(path=S+'m_title.png'); await pg.click('#tNew'); await pg.wait_for_timeout(500)
      vis=lambda sel: pg.evaluate(f"!!document.querySelector('{sel}') && !document.querySelector('{sel}').hidden")
      shots={}; wrong_done=set(); n=0; last=None; stuck=0
      while n<900:
        n+=1
        if await vis('#endscr'): break
        if await vis('#say'):
          txt=await pg.inner_text('#sTxt'); st=await pg.inner_text('#hStage')
          if st not in shots: shots[st]=1; await pg.screenshot(path=S+f'm_s{len(shots)}.png')
          await pg.click('#sNext'); await pg.wait_for_timeout(120); continue
        if await vis('#panel'):
          s=await pg.evaluate('window.__step'); 
          if not s: await pg.wait_for_timeout(200); continue
          t=s['t']; key=t+str(s.get('prompt',''))[:30]
          if key==last: stuck+=1
          else: stuck=0; last=key
          if stuck>40: print('STUCK at',key); break
          if t in('say','phone') : await pg.click('#pAct .cont'); await pg.wait_for_timeout(150); continue
          tryWrong= t not in wrong_done
          if t=='choose':
            opts=s['opts']; w=[o for o in opts if not o.get('ok')] if not s.get('any') else []
            if tryWrong and w:
              wrong_done.add(t); await pg.locator('#pAct .opt').filter(has_text=w[0]['txt'].replace('[[','').replace(']]','').split('|')[0][:25]).first.click(); await pg.wait_for_timeout(300)
              fb=await pg.locator('#pAct .fb').inner_text(); print('choose wrong →',fb[:70])
            ok=[o for o in opts if o.get('ok')][0]['txt']; import re; ok=re.sub(r'\[\[([^|\]]+)(\|[^\]]+)?\]\]',r'\1',ok)
            await pg.locator('#pAct .opt').filter(has_text=ok[:25]).first.click(); await pg.wait_for_timeout(1700 if 'after' in json.dumps(s) else 800); continue
          if t=='tiles':
            import re
            if tryWrong and s.get('hints'):
              wrong_done.add(t); hk=list(s['hints'].keys())[0]
              await pg.locator('#pAct .tilebank .tile',has_text=re.compile('^'+re.escape(hk)+'$')).first.click(); await pg.click('#pAct .check'); await pg.wait_for_timeout(200)
              print('tiles wrong →',(await pg.locator('#pAct .fb').inner_text())[:70]); await pg.click('#pAct [data-a=clear]')
            ans=s['answer']; toks=[]
            rest=ans
            pool=sorted(set(s['tiles']),key=len,reverse=True)
            while rest.strip():
              rest=rest.lstrip()
              for tk in pool:
                if rest.startswith(tk) and (len(rest)==len(tk) or not rest[len(tk)].isalpha() or not tk[-1].isalpha()): toks.append(tk); rest=rest[len(tk):]; break
              else: raise Exception('tile parse '+rest)
            for tk in toks:
              await pg.locator('#pAct .tilebank .tile:not([disabled])',has_text=re.compile('^'+re.escape(tk)+'$')).first.click()
            await pg.click('#pAct .check'); await pg.wait_for_timeout(1100); continue
          if t=='number':
            ins=pg.locator('#pAct input'); rows=s['rows']
            if tryWrong: wrong_done.add(t); await ins.nth(0).fill('999'); await pg.click('#pAct .check'); await pg.wait_for_timeout(200); print('number wrong →',(await pg.locator('#pAct .fb').inner_text())[:70])
            for i,r in enumerate(rows):
              a=r['ans']; v=f"{a//60} h {a%60:02d}" if r.get('time') else str(a)
              await ins.nth(i).fill(v)
            await pg.click('#pAct .check'); await pg.wait_for_timeout(1200); continue
          if t=='sac':
            items=s['items']
            await pg.locator('#pAct .it').filter(has_text='Bluetooth').click(); await pg.click('#pAct .check'); await pg.wait_for_timeout(200); print('sac trap →',(await pg.locator('#pAct .fb').inner_text())[:70])
            await pg.locator('#pAct .it').filter(has_text='Bluetooth').click()
            for it in items:
              if it.get('need') or it['id']=='reserve':
                await pg.locator('#pAct .it').nth(items.index(it)).click()
            await pg.click('#pAct .check'); await pg.wait_for_timeout(1400); continue
          if t=='order':
            import re
            strip=lambda x: re.sub(r'\[\[([^|\]]+)(\|[^\]]+)?\]\]',r'\1',x)
            await pg.locator('#pAct .opts .opt').filter(has_text=strip(s['traps'][0]['txt'])[:20]).click(); await pg.wait_for_timeout(150); print('order trap →',(await pg.locator('#pAct .fb').inner_text())[:70])
            for it in s['items']: await pg.locator('#pAct .opts .opt:not([disabled])').filter(has_text=strip(it['txt'])[:22]).first.click(); await pg.wait_for_timeout(120)
            await pg.wait_for_timeout(1300); continue
          if t=='groupe':
            import re
            strip=lambda x: re.sub(r'\[\[([^|\]]+)(\|[^\]]+)?\]\]',r'\1',x)
            cards=pg.locator('#pAct .hcard')
            for i,cd in enumerate(s['cards']):
              c=cards.nth(i); wd=[d for d in cd['diag'] if not d.get('ok')][0]
              if i==0: await c.locator('.diag .opt').filter(has_text=wd['txt'][:14]).click(); await pg.wait_for_timeout(150); print('groupe wrong →',(await pg.locator('#pAct .fb').inner_text())[:60])
              okd=[d for d in cd['diag'] if d.get('ok')][0]; await c.locator('.diag .opt').filter(has_text=okd['txt'][:14]).click(); await pg.wait_for_timeout(150)
              if await c.locator('.res').is_visible(): continue
              for g in cd['give']:
                if not g.get('ok'): continue
                btn=c.locator('.give .opt').filter(has_text=strip(g['txt'])[:16]).first
                if await btn.is_enabled(): await btn.click(); break
              await pg.wait_for_timeout(150)
            await pg.wait_for_timeout(1500); continue
          if t=='pick':
            await pg.screenshot(path=S+'m_pick.png')
            await pg.evaluate("MQ.MAP._pick('aileron')"); await pg.wait_for_timeout(300); print('pick wrong →',(await pg.locator('#pAct .fb').inner_text())[:60]); await pg.wait_for_timeout(1500)
            await pg.evaluate(f"MQ.MAP._pick('{s['ok']}')"); await pg.wait_for_timeout(1200); continue
          print('unknown step',t); break
        await pg.wait_for_timeout(250)
        if n%40==0 and await vis('#cine'): await pg.screenshot(path=S+'m_evening.png')
      await pg.wait_for_timeout(800); await pg.screenshot(path=S+'m_end.png')
      res=await pg.evaluate("({pts:MQ.S&&MQ.S.pts, water:MQ.S&&MQ.S.water, energy:MQ.S&&MQ.S.energy, done:JSON.parse(localStorage.getItem('jeuxFr20.voyage')).done.martinique, jet:JSON.parse(localStorage.getItem('gv.v1')||'{}').played})")
      print('END', await vis('#endscr'), res); print('ERR', errs[:6])
      await b.close()
  finally: srv.terminate()
asyncio.run(main())
