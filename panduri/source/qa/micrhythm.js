const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + require('path').resolve('audio/rhy60.wav') + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ permissions: ['microphone'], viewport: { width: 1280, height: 800 } })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/panduri-app.html'); await p.waitForTimeout(400);
  await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('micExplained', true); const o = document.querySelector('.ob'); o && o.remove(); PD.engine.setCountIn(false);
    PD.practice.open(PD.lessons.get('poc-rhythm'), { wait: false, tempo: 1, mode: 'practice', metro: true }, 'poc-rhythm', 'metro'); });
  await p.evaluate(async () => {
    await PD.detector.start();
    // align the lesson clock with the audio: beat 0 = 2.0 s after the priming pluck
    await new Promise(res => { const off = PD.detector.on('onset', m => { off(); const E = PD.engine, S = E.S; E.play(); S.anchorBeat = 0; S.now = 0; S.anchorTime = m.t + 2.0; S.nextClick = 0; res(); }); });
  });
  await p.waitForTimeout(11500);
  const r = await p.evaluate(() => { const S = PD.engine.S; return S.steps.map((s, i) => { const r = S.res[i]; return i + ':' + (r.missed ? 'MISSED' : r.ok ? (r.grade + ' ' + (r.off != null ? Math.round(r.off * 1000) + 'ms' : '')) : 'pending'); }).join('\n'); });
  console.log(r);
  await p.waitForTimeout(500);
  console.log('results sheet:', await p.evaluate(() => { const sh = document.querySelector('.sheet'); return sh ? sh.innerText.replace(/\n+/g, ' | ').slice(0, 400) : 'none'; }));
  await p.screenshot({ path: 'qa/micrhythm.png' });
  await b.close();
})();
