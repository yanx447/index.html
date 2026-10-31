const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const out = [];
  for (const [vw, vh] of [[390, 844], [844, 390]]) {
    const p = await (await b.newContext({ viewport: { width: vw, height: vh }, permissions: ['microphone'] })).newPage();
    let cur = '';
    p.on('pageerror', e => out.push(`@${vw} ${cur} PAGEERROR ${e.message}`));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_TUNNEL|fonts\.g/.test(m.text())) out.push(`@${vw} ${cur} CONSOLE ${m.text().slice(0, 160)}`); });
    await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
    const list = await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('author', true); Object.defineProperty(PD.premium, 'active', { get: () => true }); PD.premium.canOpen = () => true; document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove();
      const L = PD.lessons.all.concat(PD.lessons.rhythmLessons ? PD.lessons.rhythmLessons() : []).filter(l => l.events && l.events.length);
      return L.map(l => [l.id, (PD.curriculum.stagesFor ? PD.curriculum.stagesFor(l) : null) || (l.type === 'song' ? ['demo', 'technique', 'chords', 'slow', 'perform'] : ['listen', 'guided', 'wait', 'practice', 'perform'])]); });
    for (const [id, stages] of list) for (const st of stages) {
      cur = id + '/' + st;
      const r = await p.evaluate(([id, st]) => { try { const l = PD.lessons.get(id) || PD.lessons.rhythmLessons().find(x => x.id === id); PD.app.startStage(l, st); return 'ok'; } catch (e) { return 'THROW ' + e.message; } }, [id, st]);
      if (r !== 'ok') out.push(`@${vw} ${cur} ${r}`);
      await p.waitForTimeout(700);
      const chk = await p.evaluate(() => { const pz = document.querySelector('.pz'); if (!pz) return 'NO SCREEN'; const bad = []; pz.querySelectorAll('.pz-over').forEach(e => e.hidden = true); const E = PD.engine; try { if (!E.S.playing) E.play(); } catch (e) { bad.push('PLAY ' + e.message); }
        const tx = pz.innerText; if (/undefined|NaN|\[object/.test(tx)) bad.push('TEXT ' + tx.match(/.{0,20}(undefined|NaN|\[object).{0,20}/)[0]);
        const r = pz.getBoundingClientRect(); pz.querySelectorAll('button,.pz-big,.pz-c').forEach(e => { const q = e.getBoundingClientRect(); if (q.width && (q.right > r.right + 2 || q.bottom > r.bottom + 2)) bad.push('OUTSIDE ' + e.className + ' "' + e.textContent.trim().slice(0, 20) + '"'); });
        return bad.join(' | '); });
      if (chk) out.push(`@${vw} ${cur} ${chk}`);
      await p.waitForTimeout(900);
      await p.evaluate(() => PD.practice.close && PD.practice.close()); await p.waitForTimeout(250);
    }
    await p.close();
  }
  console.log(out.length + ' issues'); console.log([...new Set(out)].join('\n'));
  await b.close();
})();
