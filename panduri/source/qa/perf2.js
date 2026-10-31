const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, d] of [[390, 844, 3], [1440, 900, 2]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: d })).newPage();
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.practice.open(PD.lessons.get('m1'), { wait: false, tempo: 1, mode: 'practice', autoplay: true }, 'm1', 'demo'); });
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => new Promise(res => { const sc = PD.practice.screen, ts = []; const wrap = o => { const f = o.draw; o.draw = () => { const t0 = performance.now(); const v = f(); ts.push(performance.now() - t0); return v; }; }; wrap(sc.neck); wrap(sc.lanes); let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else { ts.sort((a, b) => a - b); res({ fps: Math.round(n / 3), medMs: ts[ts.length >> 1].toFixed(2), p95Ms: ts[Math.floor(ts.length * .95)].toFixed(2) }); } }; requestAnimationFrame(f); }));
    console.log(w + 'x' + h + '@' + d, JSON.stringify(r));
  }
  await b.close();
})();
