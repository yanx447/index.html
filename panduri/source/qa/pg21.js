const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
const [r, ...offs] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const [route, param] = r.split(':');
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 })).newPage();
  p.on('pageerror', e => console.log('ERR', r, e.message)); p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
  await p.evaluate(([r, pa]) => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go(r, pa || null); }, [route, param]);
  await p.waitForTimeout(1500);
  for (const o of (offs.length ? offs : [0])) { await p.evaluate(o => { document.querySelector('.page').style.scrollBehavior = 'auto'; document.querySelector('.page').scrollTop = +o; }, o); await p.waitForTimeout(700); await p.screenshot({ path: OUT + 'pg-' + r.replace(':', '_') + '-' + o + '.png' }); }
  await b.close();
})();
