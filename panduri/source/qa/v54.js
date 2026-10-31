const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/v54/';
require('fs').mkdirSync(OUT, { recursive: true });
const NUL = () => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) if (/\bnull\b|undefined|NaN|\[object/.test(n.nodeValue) && !n.parentNode.closest('script,style')) out.push(n.nodeValue.trim().slice(0, 60)); return out; };
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  const r = {};
  // intro
  await p.evaluate(() => PD.intro.maybe()); await p.waitForTimeout(700);
  await p.screenshot({ path: OUT + 'intro1.png' }); r.introNull = await p.evaluate(NUL);
  const titles = [];
  for (let i = 0; i < 6; i++) { titles.push(await p.$eval('.in-title', e => e.textContent)); if (i === 3) await p.screenshot({ path: OUT + 'intro4.png' }); await p.click('.in-next'); await p.waitForTimeout(450); }
  r.titles = titles; r.introDone = await p.evaluate(() => PD.store.get('intro.done')); r.route = await p.evaluate(() => document.querySelector('.navb[aria-current]')?.dataset.go);
  await p.waitForTimeout(800);
  const shot = async name => { const H = await p.evaluate(() => document.getElementById('page').scrollHeight); await p.setViewportSize({ width: 390, height: Math.min(H + 80, 5000) }); await p.waitForTimeout(500); await p.screenshot({ path: OUT + name + '.png' }); await p.setViewportSize({ width: 390, height: 844 }); await p.waitForTimeout(200); };
  await shot('learn'); r.learnH = await p.evaluate(() => document.getElementById('page').scrollHeight); r.learnNull = await p.evaluate(NUL);
  await p.click('.lv-node >> nth=1'); await p.waitForTimeout(400); await shot('learn2');
  r.tabs = await p.$$eval('.tabbar .navb', a => a.map(x => x.textContent + ':' + x.offsetWidth));
  await p.click('.tabbar .navb[data-go=tuner]'); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + 'tuner.png' }); r.tuner = await p.evaluate(() => [!!document.querySelector('.ss-inline'), !!document.querySelector('.tuner')]);
  await p.click('.tabbar .navb[data-go=home]'); await p.waitForTimeout(800); await shot('home'); r.homeNull = await p.evaluate(NUL);
  r.iframeAfter = await p.evaluate(() => document.querySelector('.ss-inline')?.src || 'none');
  console.log(JSON.stringify(r, null, 1), 'ERR', errs); await b.close();
})();
