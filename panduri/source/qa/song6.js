const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); PD.store.set('devTouch', true); document.querySelector('.ob')?.remove(); PD.app.startStage(PD.lessons.get('bani-acharuli'), 'demo'); });
  // sample inside the page every animation frame for 8 s: player position vs the engine's own song time at the same instant
  const r = await p.evaluate(() => new Promise(res => { const out = []; const t0 = performance.now(); const f = () => { const R = PD.audio.ref, c = PD.audio.ctx, E = PD.engine;
      if (R.cur && c && c.currentTime >= R.cur.when && E.S.playing && !E.S.ci) { const pos = (R.cur.off + (c.currentTime - R.cur.when)) * R.cur.r; const want = E.W(E.Wi(E.W(E.S.anchorBeat) + (c.currentTime - E.S.anchorTime) * E.rf())); out.push((pos - want) * 1000); }
      if (performance.now() - t0 < 9000) requestAnimationFrame(f); else res({ n: out.length, max: Math.max(...out.map(Math.abs)), starts: PD.audio.ref.starts }); }; requestAnimationFrame(f); }));
  console.log(JSON.stringify(r));
  const boxes = []; for (let i = 0; i < 20; i++) { boxes.push(await p.evaluate(() => ['.pz-lanes', '.pz-prompt', '.pz-neck', '.pz-bot'].map(s => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? Math.round(r.top) + '/' + Math.round(r.height) : '-'; }).join(' '))); await p.waitForTimeout(130); }
  console.log('layout states over 2.6 s of playback:', [...new Set(boxes)].join(' || '));
  await b.close();
})();
