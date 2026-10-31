const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch();
  for (const [w, h, dpr] of [[1440, 900, 2], [390, 844, 3]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr })).newPage();
    await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
    await p.evaluate(() => { PD.store.set('onboarded', true); const o = document.querySelector('.ob'); o && o.remove(); PD.practice.open(PD.lessons.get('m1'), { wait: false, tempo: 1, view: '2d', mode: 'practice', autoplay: true }, 'm1', 'demo'); });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => new Promise(res => { const hw = PD.practice.hw, orig = hw.draw, ts = []; hw.draw = dt => { const t0 = performance.now(); orig(dt); ts.push(performance.now() - t0); }; let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else { hw.draw = orig; ts.sort((a, b) => a - b); res({ fps: Math.round(n / 3), med: ts[ts.length >> 1].toFixed(2), p95: ts[Math.floor(ts.length * .95)].toFixed(2) }); } }; requestAnimationFrame(f); }));
    console.log(w + 'x' + h + '@' + dpr, JSON.stringify(r));
  }
  await b.close(); })();
