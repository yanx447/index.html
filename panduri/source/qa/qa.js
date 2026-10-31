const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const FILE = process.env.URL || 'http://localhost:8765/panduri-app.html';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const sizes = process.argv[2] ? [process.argv[2]] : ['desktop'];
  const dims = { desktop: [1440, 900], tablet: [834, 1112], phone: [390, 844], land: [844, 390] };
  for (const sz of sizes) {
    const [w, h] = dims[sz];
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: sz !== 'desktop' });
    const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
    p.on('pageerror', e => errs.push('PAGEERR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
    await p.goto(FILE); await p.waitForTimeout(800);
    const shot = async n => { await p.screenshot({ path: `${sz}-${n}.png` }); };
    await shot('0-onboard');
    // missing keys
    const keys = JSON.parse(fs.readFileSync('keys.json'));
    const missing = await p.evaluate(ks => ks.filter(k => PD.i18n.t(k) === k), keys);
    if (missing.length) console.log('MISSING', missing.join(' '));
    // onboarding through
    await p.evaluate(() => { PD.store.set('onboarded', true); document.querySelector('.ob') && document.querySelector('.ob').remove(); });
    const routes = process.env.ROUTES ? process.env.ROUTES.split(',') : ['home', 'learn', 'tools', 'tuner', 'chords', 'fretboard', 'explore', 'progress', 'settings'];
    for (const r of routes) { await p.evaluate(r => PD.app.go(r, r === 'lesson' ? 'm1' : null), r); await p.waitForTimeout(r === 'explore' || r === 'chords' ? 1500 : 400); await shot('r-' + r); }
    await p.evaluate(() => PD.app.go('lesson', 'm1')); await p.waitForTimeout(300); await shot('lesson');
    // practice
    await p.evaluate(() => PD.app.startStage(PD.lessons.get('m1'), 'wait')); await p.waitForTimeout(600); await shot('ws-2d');
    await p.evaluate(() => { PD.engine.S.countIn = false; PD.engine.play(); }); await p.waitForTimeout(1200);
    // feed correct touch notes
    for (let i = 0; i < 6; i++) { await p.evaluate(() => { const S = PD.engine.S, st = S.steps[S.cur]; if (!st) return; const n = st.notes[0]; PD.engine.input({ kind: 'note', src: 'touch', midi: PD.theory.midi(n.s, n.f), s: n.s, f: n.f, conf: 1, t: PD.audio.now() }); }); await p.waitForTimeout(250); }
    await p.evaluate(() => { const S = PD.engine.S, st = S.steps[S.cur]; PD.engine.input({ kind: 'note', src: 'touch', midi: 70, s: 3, f: 6, conf: 1, t: PD.audio.now() }); });
    await p.waitForTimeout(300); await shot('ws-play');
    await p.evaluate(() => document.querySelector('.ws .seg [data-v="3d"]').click()); await p.waitForTimeout(2500); await shot('ws-3d');
    await p.evaluate(() => { for (let i = 0; i < 20; i++) { const S = PD.engine.S, st = S.steps[S.cur]; if (!st) break; const n = st.notes[0]; PD.engine.input({ kind: 'note', src: 'touch', midi: PD.theory.midi(n.s, n.f), s: n.s, f: n.f, conf: 1, t: PD.audio.now() }); } });
    await p.waitForTimeout(1500); await shot('ws-result');
    await p.evaluate(() => { document.querySelectorAll('.sheet-back').forEach(x => x.remove()); PD.practice.close(); });
    await p.waitForTimeout(300); await shot('lesson-after');
    // studio
    await p.evaluate(() => { PD.store.set('author', true); PD.studio.open('m1'); }); await p.waitForTimeout(600); await shot('studio');
    await p.evaluate(() => { const c = document.querySelector('.st-grid canvas'), r = c.getBoundingClientRect(); const ev = new PointerEvent('pointerdown', { clientX: r.left + 120, clientY: r.top + r.height * .6, bubbles: true, pointerId: 1 }); c.dispatchEvent(ev); c.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1 })); });
    await p.waitForTimeout(300); await shot('studio-sel');
    await p.evaluate(() => PD.studio.close(true));
    // calib wizard UI (no real mic) + onboarding
    await p.evaluate(() => PD.onboard.open()); await p.waitForTimeout(300); await shot('onboard');
    await p.evaluate(() => document.querySelector('.ob').remove());
    console.log(sz, 'errors:', errs.length ? '\n' + [...new Set(errs)].slice(0, 30).join('\n') : 0);
    await ctx.close();
  }
  await b.close();
})();
