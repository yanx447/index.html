// the exam screen: it opens by itself when a unit is finished, covers everything and has no way out
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/exam/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 140)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('home'); });
  await p.waitForTimeout(600);
  console.log('tabs:', await p.evaluate(() => [...document.querySelectorAll('.tabbar .navb')].map(x => x.dataset.go)));
  console.log('no exam yet:', await p.evaluate(() => ({ screen: !!document.querySelector('.exz'), due: PD.exam.dueExam() })));
  // finish the "instrument" unit: every step except its exam
  const fin = await p.evaluate(() => {
    const path = PD.lessons.PATHS.find(x => x.id === 'instrument');
    path.steps.forEach(s => { if (s.kind === 'exam' || s.kind === 'needs') return;
      if (s.kind === 'tip') PD.store.set('seen.tip.' + s.id, true);
      else if (s.kind === 'chapter') { const d = PD.store.get('theory.done', {}); d[s.id] = 1; PD.store.set('theory.done', d); }
      else PD.store.set('seen.' + s.kind, true); });
    return { due: PD.exam.dueExam() };
  });
  console.log('unit finished →', JSON.stringify(fin));
  await p.evaluate(() => PD.app.go('learn')); await p.waitForTimeout(900);
  const open = await p.evaluate(() => ({ screen: !!document.querySelector('.exz'), nav: getComputedStyle(document.querySelector('.tabbar')).display, title: (document.querySelector('.exz-top b') || {}).textContent, clock: (document.querySelector('.exz-clock') || {}).textContent }));
  console.log('opened by itself:', JSON.stringify(open));
  await p.screenshot({ path: OUT + 'screen.png' });
  // no way out: navigation behind, Back, reload
  const esc = await p.evaluate(async () => { PD.app.go('home'); PD.app.go('chords'); history.back(); await new Promise(r => setTimeout(r, 400)); return { screen: !!document.querySelector('.exz'), route: PD.app.route }; });
  console.log('escape attempts:', JSON.stringify(esc));
  await p.reload(); await p.waitForTimeout(1800);
  console.log('after reload:', await p.evaluate(() => ({ screen: !!document.querySelector('.exz'), on: !!PD.exam.active() })));
  // fail → the exercise inside the screen → back to the exam
  const fail = await p.evaluate(async () => {
    for (let n = 0; n < 40; n++) {
      const z = document.querySelector('.exz'), cur = PD.exam._cur;
      const opts = [...z.querySelectorAll('.exq-opts .btn')]; if (!opts.length) break;
      const qt = z.querySelector('.exq-q').textContent.trim();
      const q = cur.qs.find(x => String(Array.isArray(x.q) ? x.q[0] : x.q).replace(/<[^>]*>/g, '').trim() === qt);
      opts[q ? (q.ok + 1) % opts.length : 0].click();
      await new Promise(r => setTimeout(r, 230));
      if (!cur.answers.some(x => x < 0)) { const f = [...z.querySelectorAll('.exz-foot .btn')].find(x => /დასრულება|Finish/.test(x.textContent)); if (f) { f.click(); break; } }
    }
    await new Promise(r => setTimeout(r, 300));
    const z = document.querySelector('.exz');
    return { head: (z.querySelector('.exr h1') || {}).textContent, foot: [...z.querySelectorAll('.exz-foot .btn')].map(x => x.textContent.trim()), review: z.querySelectorAll('.exrev-q').length };
  });
  console.log('failed:', JSON.stringify(fail));
  await p.screenshot({ path: OUT + 'screen_fail.png', fullPage: false });
  const dm = await p.evaluate(async () => { [...document.querySelectorAll('.exz-foot .btn')].find(x => /ვარჯიში|Exercise/.test(x.textContent)).click(); await new Promise(r => setTimeout(r, 300));
    const z = document.querySelector('.exz'); return { head: (z.querySelector('.exz-top b') || {}).textContent, q: !!z.querySelector('.exq-q'), foot: [...z.querySelectorAll('.exz-foot .btn')].map(x => x.textContent.trim()) }; });
  console.log('exercise inside:', JSON.stringify(dm));
  await p.screenshot({ path: OUT + 'screen_drill.png', fullPage: false });
  // back to the exam and pass it
  const pass = await p.evaluate(async () => {
    [...document.querySelectorAll('.exz-foot .btn')].find(x => /ხელახლა|again/i.test(x.textContent)).click();
    await new Promise(r => setTimeout(r, 400));
    for (let n = 0; n < 40; n++) {
      const z = document.querySelector('.exz'), cur = PD.exam._cur;
      const opts = [...z.querySelectorAll('.exq-opts .btn')]; if (!opts.length) break;
      const qt = z.querySelector('.exq-q').textContent.trim();
      const q = cur.qs.find(x => String(Array.isArray(x.q) ? x.q[0] : x.q).replace(/<[^>]*>/g, '').trim() === qt);
      opts[q ? q.ok : 0].click();
      await new Promise(r => setTimeout(r, 230));
      if (!cur.answers.some(x => x < 0)) { const f = [...z.querySelectorAll('.exz-foot .btn')].find(x => /დასრულება|Finish/.test(x.textContent)); if (f) { f.click(); break; } }
    }
    await new Promise(r => setTimeout(r, 300));
    const z = document.querySelector('.exz');
    return { head: (z.querySelector('.exr h1') || {}).textContent, foot: [...z.querySelectorAll('.exz-foot .btn')].map(x => x.textContent.trim()) };
  });
  console.log('passed:', JSON.stringify(pass));
  await p.screenshot({ path: OUT + 'screen_pass.png', fullPage: false });
  const out = await p.evaluate(async () => { [...document.querySelectorAll('.exz-foot .btn')][0].click(); await new Promise(r => setTimeout(r, 600));
    return { screen: !!document.querySelector('.exz'), nav: getComputedStyle(document.querySelector('.tabbar')).display, route: PD.app.route, passed: PD.exam.passed('ex-inst'), due: PD.exam.dueExam(), xp: PD.levels.xp }; });
  console.log('after passing:', JSON.stringify(out));
  console.log('errs', errs);
  await b.close();
})();
