const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_/.test(m.text())) errs.push(m.text()); });
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(700);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('theory'); });
  await p.waitForTimeout(600); await p.screenshot({ path: 'qa/tb-index.png' });
  const ids = await p.evaluate(() => PD.theoryBook.CHAPTERS.map(c => c.id));
  for (const lang of ['ka', 'en']) {
    await p.evaluate(l => PD.i18n.set(l), lang);
    for (const id of ids) {
      await p.evaluate(id => PD.app.go('theory', id), id); await p.waitForTimeout(250);
      const r = await p.evaluate(() => { const pg = document.querySelector('.page'); const txt = pg.innerText; return { ov: pg.scrollWidth - pg.clientWidth, keys: (txt.match(/\b(tb|ce|sg)\.[a-zA-Z]+\b|undefined|NaN|\[object/g) || []).join(','), h: pg.scrollHeight }; });
      if (r.ov > 1 || r.keys) console.log(lang, id, 'overflow', r.ov, 'keys', r.keys);
      if (lang === 'ka' && ['names', 'staff', 'durations', 'meter', 'neck', 'chords'].includes(id)) await p.screenshot({ path: `qa/tb-${id}.png`, fullPage: false });
    }
  }
  // answer a quiz correctly → chapter marked
  await p.evaluate(() => { PD.i18n.set('ka'); PD.app.go('theory', 'names'); }); await p.waitForTimeout(300);
  await p.evaluate(() => { const C = PD.theoryBook.CHAPTERS[0]; document.querySelectorAll('.tb-q').forEach((q, i) => { const w0 = C.q[i][1][C.q[i][2]], want = Array.isArray(w0) ? w0[0] : w0; [...q.querySelectorAll('.tb-opts button')].find(b => b.innerHTML === want).click(); }); });
  await p.waitForTimeout(200);
  console.log('after quiz: done =', await p.evaluate(() => JSON.stringify(Object.keys(PD.store.get('theory.done', {})))), 'progress', await p.evaluate(() => PD.theoryBook.progress().toFixed(3)));
  await p.evaluate(() => document.querySelector('.tb-quiz').scrollIntoView()); await p.waitForTimeout(200); await p.screenshot({ path: 'qa/tb-quiz.png' });
  await p.evaluate(() => PD.app.go('learn')); await p.waitForTimeout(500); await p.screenshot({ path: 'qa/tb-learn.png' });
  console.log('errors:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
