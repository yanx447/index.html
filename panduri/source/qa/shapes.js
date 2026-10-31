// the two new teaching pages: the scale positions, the chord shapes and the 3D hand on both
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/TUNNEL|fonts/.test(m.text())) errs.push('C ' + m.text().slice(0, 160)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1600);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  // the scale maths, checked against the theory
  console.log('scale paths:', await p.evaluate(() => {
    const out = [], bad = [];
    [[9, 'major'], [9, 'minor'], [0, 'major'], [2, 'minor'], [7, 'major'], [3, 'penta']].forEach(([r, k]) => {
      const sp = PD.shapes.scalePath(r, k);
      if (!sp) { bad.push('no path ' + r + k); return; }
      const iv = PD.shapes.SCALES[k].iv;
      sp.notes.forEach((n, i) => { const want = (r + iv[i]) % 12, got = PD.theory.pc(PD.theory.midi(n.s, n.f));
        if (want !== got) bad.push('wrong note ' + r + k + ' #' + i); });
      const ms = sp.notes.map(n => PD.theory.midi(n.s, n.f));
      for (let i = 1; i < ms.length; i++) if (ms[i] <= ms[i - 1]) bad.push('not rising ' + r + k + ' #' + i);
      sp.notes.forEach((n, i) => { if (n.f > 0 && !(n.fi >= 1 && n.fi <= 4)) bad.push('bad finger ' + r + k + ' #' + i); if (n.f === 0 && n.fi !== 0) bad.push('finger on open ' + r + k); });
      out.push(r + ':' + k + ' · ' + sp.notes.map(n => n.name.replace(/ .*/, '') + ' s' + n.s + 'f' + n.f + (n.fi ? '·' + n.fi : '·0') + (n.shift ? '↷' : '')).join('  '));
    });
    return { bad, out };
  }));
  await p.evaluate(() => PD.app.go('scales')); await p.waitForTimeout(6000);
  console.log('scales page:', await p.evaluate(() => ({ notes: document.querySelectorAll('.sh-n').length, canvas: !!document.querySelector('.sh-3d canvas'), head: (document.querySelector('.sh-head b') || {}).textContent })));
  await p.screenshot({ path: OUT + 'sh_scales.png' });
  await p.evaluate(() => { const n = document.querySelectorAll('.sh-n')[4]; if (n) n.click(); }); await p.waitForTimeout(2500);
  await p.screenshot({ path: OUT + 'sh_scales2.png' });
  await p.evaluate(() => PD.app.go('chordhow')); await p.waitForTimeout(6000);
  console.log('chord page:', await p.evaluate(() => ({ chips: document.querySelectorAll('.sh-list .chip').length, rows: document.querySelectorAll('.sh-row').length, canvas: !!document.querySelector('.sh-3d canvas'), name: (document.querySelector('.sh-info b') || {}).textContent })));
  await p.screenshot({ path: OUT + 'sh_chords.png' });
  console.log('rawkeys:', await p.evaluate(() => [...document.querySelectorAll('#page [data-t]')].filter(e => e.textContent.trim() === e.dataset.t).map(e => e.dataset.t)));
  console.log('errs', errs);
  await b.close();
})();
