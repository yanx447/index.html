const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) console.log('CERR', m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); PD.store.set('devTouch', true); document.querySelector('.ob')?.remove(); });
  const posErr = () => p.evaluate(() => { const r = PD.audio.ref, c = PD.audio.ctx, E = PD.engine; if (!r.cur || c.currentTime < r.cur.when) return null; const pos = (r.cur.off + (c.currentTime - r.cur.when)) * r.cur.r; return { err: (pos - E.W(E.visualNow())) * 1000, rate: r.cur.r, now: E.S.now.toFixed(2) }; });
  async function run(stage, label, secs) {
    await p.evaluate(st => { PD.practice.active && PD.practice.close(); PD.app.startStage(PD.lessons.get('bani-acharuli'), st); }, stage);
    const t0 = Date.now(); let st;
    while (Date.now() - t0 < 30000) { st = await p.evaluate(() => ({ playing: PD.engine.S.playing, state: PD.audio.ref.state, prog: PD.audio.ref.progress, cur: !!PD.audio.ref.cur })); if (st.cur) break; await p.waitForTimeout(150); }
    console.log(label, 'music started after', ((Date.now() - t0) / 1000).toFixed(1), 's', JSON.stringify(st));
    const errs = [], boxes = [];
    for (let i = 0; i < secs * 6; i++) {
      const e = await posErr(); if (e) errs.push(e.err);
      boxes.push(await p.evaluate(() => ['.pz-lanes', '.pz-prompt', '.pz-neck', '.pz-bot'].map(s => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? Math.round(r.top) + '/' + Math.round(r.height) : '-'; }).join(' ')));
      await p.waitForTimeout(160);
    }
    errs.sort((a, b) => Math.abs(a) - Math.abs(b));
    const ds = [...new Set(boxes)]; if (ds.length > 1) console.log('   layout states:', ds.join('  ||  '));
    console.log('   music vs chart: samples', errs.length, 'max |err|', errs.length ? Math.abs(errs[errs.length - 1]).toFixed(1) : '-', 'ms', '| layout boxes distinct:', new Set(boxes).size, boxes[0]);
  }
  await run('demo', 'listen 100%', 4);
  await run('slow', 'slow 70%  ', 4);
  // mix switch while playing
  await p.evaluate(() => { PD.audio.ref.use('music'); });
  await p.waitForTimeout(600);
  console.log('right after mix switch:', JSON.stringify(await posErr()));
  await p.waitForTimeout(2500);
  console.log('after mix switch:', JSON.stringify(await posErr()), 'mix', await p.evaluate(() => PD.audio.ref.mix + ' playing ' + PD.audio.ref.playing));
  await p.evaluate(() => PD.audio.ref.use('full'));
  // chord stage: waits with the music stopped, continues after the chord
  await p.evaluate(() => { PD.practice.close(); PD.app.startStage(PD.lessons.get('bani-acharuli'), 'chords'); });
  for (let i = 0; i < 60 && !(await p.evaluate(() => PD.engine.S.waiting)); i++) await p.waitForTimeout(150);
  console.log('chords stage waiting:', JSON.stringify(await p.evaluate(() => ({ waiting: PD.engine.S.waiting, name: PD.engine.S.steps[PD.engine.S.cur]?.name, music: PD.audio.ref.playing }))));
  await p.evaluate(() => PD.engine.input({ kind: 'strum', src: 'touch', dir: 'down', t: PD.audio.now() }));
  await p.waitForTimeout(400);
  console.log('after the chord:', JSON.stringify(await p.evaluate(() => ({ waiting: PD.engine.S.waiting, now: PD.engine.S.now.toFixed(2), music: PD.audio.ref.playing }))), JSON.stringify(await posErr()));
  await p.screenshot({ path: 'qa/s5-chords.png' });
  await p.evaluate(() => PD.practice.close());
  await p.waitForTimeout(300);
  console.log('after close: engine lesson', await p.evaluate(() => !!PD.engine.S.lesson), 'music', await p.evaluate(() => PD.audio.ref.playing));
  await b.close();
})();
