const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/ln/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  await p.evaluate(() => PD.app.go('learn')); await p.waitForTimeout(700); await p.screenshot({ path: OUT + 'learn-theory.png' });
  console.log('theory paths:', await p.evaluate(() => [...document.querySelectorAll('#page .lp h2')].map(x => x.textContent).join(' | ')));
  console.log('first steps:', await p.evaluate(() => [...document.querySelectorAll('#lp-first .lp-tx b')].map(x => x.textContent).join(' | ')));
  await p.click('#page .ln-seg button[data-k=practice]'); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'learn-practice.png' });
  console.log('practice paths:', await p.evaluate(() => [...document.querySelectorAll('#page .lp h2')].map(x => x.textContent + '(' + x.closest('.lp').querySelector('.lp-diff')?.textContent + ')').join(' | ')));
  console.log('practice steps w/o title:', await p.evaluate(() => [...document.querySelectorAll('#page .lp-tx b')].filter(x => !x.textContent.trim()).length));
  for (const id of ['sit', 'hold', 'hands', 'strokes', 'fingers', 'stringnum', 'warmup', 'care', 'tab', 'beat', 'pitch', 'chordwhat', 'dyn', 'sync', 'triplet', 'transpose', 'inversion']) {
    await p.evaluate(i => PD.app.go('tips', i), id); await p.waitForTimeout(id === 'sit' || id === 'strokes' || id === 'fingers' || id === 'stringnum' ? 1600 : 350);
    if (['sit', 'hold', 'hands', 'strokes', 'fingers', 'stringnum', 'care', 'tab', 'transpose', 'sync'].includes(id)) await p.screenshot({ path: OUT + 'tip-' + id + '.png' });
    const r = await p.evaluate(() => ({ t: document.querySelector('#page h1')?.textContent, svg: !!document.querySelector('#page .tp-hero svg'), steps: document.querySelectorAll('#page .tp-steps li').length, badge: document.querySelector('#page .tp-src')?.textContent }));
    console.log(id, JSON.stringify(r));
  }
  await p.evaluate(() => PD.app.go('rhythms')); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'rhythms.png', fullPage: false });
  console.log('rhythms:', await p.evaluate(() => [...document.querySelectorAll('#page .path h2')].map(x => x.textContent).join(' | ')));
  await p.evaluate(() => { const h = [...document.querySelectorAll('#page .rh-sec')][1]; h.scrollIntoView(); }); await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'rhythms-common.png' });
  await p.evaluate(() => PD.app.go('rhythm', 'g-pop')); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'rh-pop.png' });
  console.log('pop counts:', await p.evaluate(() => [...document.querySelectorAll('#page .rh-row.big .rh-n')].map(x => x.textContent).join(' ')));
  await p.click('#page .btn.primary'); await p.waitForTimeout(1500); await p.click('#page .btn.primary');
  for (const id of ['g-gallop', 'g-shuffle', 'g-68', 'kazbeguri']) { await p.evaluate(i => PD.app.go('rhythm', i), id); await p.waitForTimeout(400); console.log(id, await p.evaluate(() => [...document.querySelectorAll('#page .rh-row.big .rh-n')].map(x => x.textContent).join(' ') + ' tag=' + document.querySelector('#page .tag')?.textContent)); }
  const L = await p.evaluate(() => { const l = PD.lessons.get('rhythm-g-pop'); return l && { ev: l.events.length, bpm: l.bpm, src: l.source, meter: l.meter }; }); console.log('lesson', JSON.stringify(L));
  await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(500); await p.screenshot({ path: OUT + 'home.png' });
  console.log('ERRORS', errs.length ? errs : 'none');
  await b.close();
})();
