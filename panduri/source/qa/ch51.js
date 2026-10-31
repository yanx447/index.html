const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
const NUL = () => { const w = document.createTreeWalker(document.getElementById('page'), NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) if (/null|undefined|NaN|\[object/.test(n.nodeValue)) out.push(n.nodeValue.trim().slice(0, 60)); return out; };
(async () => {
  const b = await chromium.launch();
  for (const [W, tag] of [[390, 'm'], [1280, 'd']]) {
    const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 1.5 })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
    await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
    await p.evaluate(() => PD.app.go('chords', 'Bm')); await p.waitForTimeout(1500);
    const shot = async name => { const H = await p.evaluate(() => document.getElementById('page').scrollHeight); await p.setViewportSize({ width: W, height: Math.min(H + 100, 7000) }); await p.waitForTimeout(600); await p.screenshot({ path: OUT + name + '.png' }); await p.setViewportSize({ width: W, height: 844 }); };
    await shot('c51' + tag);
    const r = {};
    r.name = await p.$eval('.ce-name h2', e => e.textContent); r.frets = await p.$eval('.ce-frets', e => e.textContent + ' vis=' + (e.offsetWidth > 0));
    r.navRowH = await p.$eval('.ce-nb', e => e.offsetHeight);
    r.accs = await p.$$eval('.ce-acc', a => a.map(d => d.querySelector('summary b').textContent + (d.open ? '[open]' : '')));
    r.sh = await p.$$eval('details.csec', a => a.map(d => d.querySelector('b').textContent + ':' + d.querySelector('.csec-n').textContent + (d.open ? '' : '[closed]')));
    await p.click('.ce-nav >> nth=1'); await p.waitForTimeout(400); r.next = await p.$eval('.ce-name h2', e => e.textContent);
    await p.click('.ce-nav >> nth=0'); await p.waitForTimeout(400); r.prev = await p.$eval('.ce-name h2', e => e.textContent);
    await p.click('.ce-fav'); r.fav = await p.evaluate(() => PD.store.get('ce.fav'));
    await p.click('.ce-play'); await p.click('.ce-str >> nth=0');
    // step by step captions
    const caps = new Set(); await p.click('.ce-stepb'); for (let i = 0; i < 16; i++) { await p.waitForTimeout(300); caps.add(await p.$eval('.ce-cap', e => e.textContent)); } r.stepCaps = [...caps];
    // open all accordions and the change one
    await p.$$eval('details', a => a.forEach(d => d.open = true)); await p.waitForTimeout(300);
    const caps2 = new Set(); await p.click('text=' + await p.evaluate(() => PD.i18n.t('ce.showCh'))); for (let i = 0; i < 20; i++) { await p.waitForTimeout(300); caps2.add(await p.$eval('.ce-cap', e => e.textContent)); } r.chCaps = [...caps2];
    r.nulls = await p.evaluate(NUL);
    await shot('c51' + tag + '-open');
    r.filtSub = await p.$eval('.ce-filt .ce-acc-sub', e => e.textContent);
    await p.click('.ce-filt .chip >> nth=2'); await p.waitForTimeout(300); r.filtSub2 = await p.$eval('.ce-filt .ce-acc-sub', e => e.textContent); r.count = await p.$eval('.ce-lib-h small', e => e.textContent);
    await p.fill('.ce-top input', 'Cm'); await p.waitForTimeout(400);
    await p.evaluate(() => PD.app.go('chords', 'Cm')); await p.waitForTimeout(800); r.none = await p.$eval('.ce-acts', e => e.textContent);
    // progressions tab
    await p.click('.ce-sec button >> nth=4'); await p.waitForTimeout(400); r.prog = await p.$$eval('.ce-prog', a => a.length);
    r.nulls2 = await p.evaluate(NUL);
    console.log(tag, JSON.stringify(r, null, 1), 'ERR', errs); await p.close();
  }
  await b.close();
})();
