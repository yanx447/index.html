const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) console.log('CERR', m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home'); });
  await p.waitForTimeout(400);
  const st = () => p.evaluate(() => ({ playing: PD.engine.S.playing, gate: !document.querySelector('.pz-over')?.hidden && !!document.querySelector('.pz-over .pz-card [data-t="gate.title"]'), watch: PD.engine.S.autoplay, turn: !document.querySelector('.pz-turn')?.hidden, pause: !!document.querySelector('[data-t="p.paused"]'), mode: PD.engine.S.mode, wait: PD.engine.S.wait, tempo: PD.engine.S.tempo, now: +PD.engine.S.now.toFixed(2), drill: !!PD.engine.S.drill }));
  // 1 drill behind the gate (no mic, no dev touch)
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('poc-three') || PD.lessons.all.find(l => l.type === 'melody' && l.events.length), 'phrase'));
  await p.waitForTimeout(900); console.log('drill, no mic:', JSON.stringify(await st()));
  // 2 listen first, then "Now you play"
  await p.click('[data-t="p.listenFirst"]'); await p.waitForTimeout(800); console.log('listen first:', JSON.stringify(await st()));
  await p.screenshot({ path: OUT + 'turn.png' });
  await p.click('.pz-turn'); await p.waitForTimeout(500); console.log('my turn (no mic):', JSON.stringify(await st()));
  // 3 the focus and the page behind
  console.log('focus:', await p.evaluate(() => document.activeElement && (document.activeElement.className + '|' + document.activeElement.textContent.slice(0, 30))), 'inert behind:', await p.evaluate(() => [...document.body.children].filter(e => e.inert).length));
  await p.evaluate(() => PD.practice.close());
  console.log('after close inert:', await p.evaluate(() => [...document.body.children].filter(e => e.inert).length));
  // 4 with dev touch (stands in for a working mic): demo stage → finish card / my turn gentler
  await p.evaluate(() => { PD.store.set('devTouch', true); PD.app.startStage(PD.lessons.get('poc-three') || PD.lessons.all.find(l => l.type === 'melody' && l.events.length), 'demo'); });
  await p.waitForTimeout(1500); console.log('demo:', JSON.stringify(await st()));
  await p.click('.pz-turn'); await p.waitForTimeout(600); console.log('my turn after demo:', JSON.stringify(await st()));
  // 5 More sheet pauses
  await p.waitForTimeout(1500);
  await p.click('.pz-top .pz-ic[aria-label]:last-child'); await p.waitForTimeout(300); console.log('more open:', JSON.stringify(await st()));
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  await p.click('.pz-card [data-t="p.resume"]'); await p.waitForTimeout(400); console.log('resumed:', JSON.stringify(await st()));
  // 6 background → pause card
  await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); delete document.hidden; });
  await p.waitForTimeout(300); console.log('autopause:', JSON.stringify(await st()), await p.evaluate(() => !!document.querySelector('.pz-card [data-t="ws.autopause"]')));
  // 7 keys
  await p.click('.pz-card [data-t="p.resume"]'); await p.waitForTimeout(300);
  await p.evaluate(() => document.activeElement && document.activeElement.blur());
  const b0 = await p.evaluate(() => PD.engine.bpm());
  await p.evaluate(() => PD.engine.setBpm(77)); await p.keyboard.press('ArrowUp'); console.log('bpm 77 → ↑ →', await p.evaluate(() => PD.engine.bpm()));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(100); console.log('→ now', await p.evaluate(() => PD.engine.S.now));
  await p.keyboard.press('m'); console.log('M metro', await p.evaluate(() => PD.engine.S.metro));
  await p.keyboard.press('w'); console.log('W mode', JSON.stringify(await st()));
  console.log('g.miss:', await p.evaluate(() => PD.i18n.t('g.miss')));
  await p.evaluate(() => PD.practice.close());
  // 8 song header at 360 px
  await p.evaluate(() => PD.app.startStage(PD.lessons.get('bani-acharuli'), 'slow')); await p.waitForTimeout(1200);
  console.log('title box:', await p.evaluate(() => { const r = document.querySelector('.pz-title b').getBoundingClientRect(); return Math.round(r.width) + 'px "' + document.querySelector('.pz-title b').textContent + '" fits=' + (document.querySelector('.pz-title b').scrollWidth <= document.querySelector('.pz-title b').clientWidth); }));
  await p.screenshot({ path: OUT + 'song360.png' });
  // 9 song results: everything before the end missed
  await p.evaluate(() => { const E = PD.engine, S = E.S; E.stop(); const n = S.steps.length; for (let i = 0; i < n - 6; i++) { S.res[i].missed = true; S.res[i].attempts = 1; if (i % 3 === 0) { S.res[i].missed = false; S.res[i].ok = true; S.res[i].off = (Math.random() - .5) * .2; } } E.configure({ mode: 'perform', wait: false }); E.seek(S.steps[n - 6].t); S.cur = n - 6; E.play(); });
  for (let i = 0; i < 30 && !(await p.evaluate(() => !!document.querySelector('.sheet [data-t="r.title"]'))); i++) await p.waitForTimeout(500);
  await p.waitForTimeout(400);
  console.log('results:', await p.evaluate(() => ({ marks: document.querySelectorAll('.errline b').length, labels: [...document.querySelectorAll('.errline .sec')].filter(x => x.textContent).length, pts: document.querySelectorAll('.tgraph circle, .tgraph text').length })));
  await p.screenshot({ path: OUT + 'songres.png', fullPage: false });
  await b.close();
})();
