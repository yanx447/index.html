const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/v55/';
require('fs').mkdirSync(OUT, { recursive: true });
const NUL = () => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) if (/\bnull\b|undefined|NaN|\[object/.test(n.nodeValue) && !n.parentNode.closest('script,style')) out.push(n.nodeValue.trim().slice(0, 60)); return out; };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('intro.done', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home'); });
  await p.waitForTimeout(800);
  const shot = async name => { const H = await p.evaluate(() => document.getElementById('page').scrollHeight); await p.setViewportSize({ width: 390, height: Math.min(H + 80, 5000) }); await p.waitForTimeout(500); await p.screenshot({ path: OUT + name + '.png' }); await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200); };
  const r = {};
  r.tabs = await p.$$eval('.tabbar .navb', a => a.map(x => x.textContent));
  await shot('home'); r.homeNull = await p.evaluate(NUL);
  r.quick = await p.$$eval('.hq', a => a.map(x => x.textContent));
  // tuner from quick access: overlay as before
  await p.click('.hq >> nth=0'); await p.waitForTimeout(1500); r.tunerOverlay = await p.evaluate(() => !!document.querySelector('.ss-wrap')); await p.screenshot({ path: OUT + 'tuner.png' });
  await p.evaluate(() => PD.samiSimi.close()); await p.waitForTimeout(500);
  // chords catalogue -> detail -> back
  await p.click('.tabbar .navb[data-go=chords]'); await p.waitForTimeout(900); await shot('chords'); r.cat = await p.evaluate(() => ({ hero: !!document.querySelector('.ce-hero'), grid: document.querySelectorAll('.cgrid button').length }));
  await p.click('.cgrid button >> nth=2'); await p.waitForTimeout(900); await shot('chord'); r.det = await p.evaluate(() => ({ hero: !!document.querySelector('.ce-hero'), grid: document.querySelectorAll('.cgrid button').length, name: document.querySelector('.ce-name h2')?.textContent, frets: document.querySelector('.ce-frets')?.textContent }));
  r.detNull = await p.evaluate(NUL);
  await p.click('.ce-dhead .backbtn'); await p.waitForTimeout(800); r.back = await p.evaluate(() => PD.app.route + ':' + PD.app.param);
  // a tip: no other cards, path footer
  await p.evaluate(() => PD.app.go('tips', 'hold')); await p.waitForTimeout(800); await shot('tip'); r.tip = await p.evaluate(() => ({ cards: document.querySelectorAll('#page .tp-card').length, next: document.querySelector('.ls-next')?.textContent, path: !!document.querySelector('.ls-path') }));
  await p.click('.ls-next'); await p.waitForTimeout(800); r.afterNext = await p.evaluate(() => PD.app.route + ':' + PD.app.param);
  await p.click('.tabbar .navb[data-go=ai]'); await p.waitForTimeout(900); await shot('ai'); r.ai = await p.evaluate(() => document.querySelector('#page h1')?.textContent);
  await p.click('.tabbar .navb[data-go=learn]'); await p.waitForTimeout(900); r.learnLib = await p.$$eval('.lib-card b', a => a.map(x => x.textContent));
  console.log(JSON.stringify(r, null, 1), 'ERR', errs); await b.close();
})();
