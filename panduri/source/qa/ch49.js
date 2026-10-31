const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  const t0 = Date.now(); await p.click('.tabbar .navb:nth-child(3), nav .navb[data-r="chords"]').catch(async () => { await p.evaluate(() => PD.app.go('chords')); }); await p.waitForTimeout(1200);
  console.log('nav', await p.evaluate(() => [...document.querySelectorAll('.navb')].map(b => b.textContent.trim()).join('|')), 'ms', Date.now() - t0);
  const st = await p.evaluate(() => { const L = PD.curriculum.chords(); const by = {}; L.forEach(c => { by[c.q] = (by[c.q] || 0) + 1; }); return { total: L.length, none: L.filter(c => c.none).map(c => c.name), types: Object.keys(by).length, sample: ['C9', 'Fmaj9', 'Gm9', 'A11', 'D13', 'E7♭5', 'B7♯5', 'Cm(maj7)', 'D7sus4', 'Em(add9)', 'A♯', 'D♯m'].map(n => { const c = L.find(x => x.name === n); return n + '=' + (c ? (c.none ? 'none' : c.frets.join('-') + '/' + c.fingers.join('')) : 'missing'); }) }; });
  console.log(JSON.stringify(st));
  await p.screenshot({ path: OUT + 'c1.png' });
  for (const sec of ['pop', 'easy', 'prog']) { await p.evaluate(s => { [...document.querySelectorAll('.ce-sec button')].find(b => b.textContent === PD.i18n.t('ce.sec.' + s)).click(); }, sec); await p.waitForTimeout(500); console.log(sec, await p.evaluate(() => document.querySelectorAll('.csec button, .ce-prog').length)); }
  await p.evaluate(() => document.querySelector('.cgroups').scrollIntoView()); await p.screenshot({ path: OUT + 'c2.png' });
  await p.evaluate(() => { [...document.querySelectorAll('.ce-sec button')][0].click(); }); await p.fill('input[type=search]', 'bb'); await p.waitForTimeout(300); console.log('search bb', await p.evaluate(() => [...document.querySelectorAll('.csec button')].slice(0, 6).map(b => b.textContent).join(',')));
  await p.fill('input[type=search]', 'c9'); await p.waitForTimeout(300); await p.evaluate(() => document.querySelector('.csec button')?.click()); await p.waitForTimeout(500);
  console.log('c9 roles', await p.evaluate(() => [...document.querySelectorAll('.ce-r span')].map(x => x.textContent).join(' | ')));
  console.log('ERR', errs); await b.close();
})();
