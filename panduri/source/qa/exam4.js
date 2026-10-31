// "later": the exam waits, the next unit stays shut, the tools stay open
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/exam/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 140)); });
  const boot = async () => { await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1300);
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); });
    await p.reload(); await p.waitForTimeout(1600); await p.evaluate(() => { document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); }); await p.waitForTimeout(300); };
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => localStorage.clear());
  await boot();
  // finish the first unit → the exam comes
  await p.evaluate(() => { const path = PD.lessons.PATHS.find(x => x.id === 'instrument');
    path.steps.forEach(s => { if (s.kind === 'exam' || s.kind === 'needs') return;
      if (s.kind === 'tip') PD.store.set('seen.tip.' + s.id, true);
      else if (s.kind === 'chapter') { const d = PD.store.get('theory.done', {}); d[s.id] = 1; PD.store.set('theory.done', d); }
      else PD.store.set('seen.' + s.kind, true); }); PD.app.go('learn'); });
  await p.waitForTimeout(900);
  console.log('1 exam opened     :', await p.evaluate(() => !!document.querySelector('.exz')));
  // press "later"
  await p.evaluate(() => [...document.querySelectorAll('.exz .btn')].find(x => /მოგვიანებით|Later/.test(x.textContent)).click());
  await p.waitForTimeout(700);
  console.log('2 after "later"   :', await p.evaluate(() => ({ screen: !!document.querySelector('.exz'), route: PD.app.route, on: !!PD.exam.active() })));
  // the tools are open
  const tools = await p.evaluate(async () => { const out = {}; for (const r of ['tuner', 'metronome', 'chords', 'ai', 'home']) { PD.app.go(r); await new Promise(x => setTimeout(x, 220)); out[r] = PD.app.route; } return out; });
  console.log('3 tools open      :', JSON.stringify(tools));
  // the next unit is shut
  await p.evaluate(() => PD.app.go('learn')); await p.waitForTimeout(900);
  const learn = await p.evaluate(() => {
    const ban = document.querySelector('.ex-banner');
    const u = document.querySelector('#lp-rhythms');
    if (u && !u.open) u.open = true;
    return { banner: ban ? ban.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) : null,
      blocked: PD.exam.blocking('rhythms'), waitRow: !!(u && u.querySelector('.ex-wait')), lockedSteps: u ? u.querySelectorAll('.lp-s.locked').length : -1 };
  });
  console.log('4 next unit       :', JSON.stringify(learn));
  await p.screenshot({ path: OUT + 'wait_learn.png', fullPage: false });
  // a lesson of the blocked unit opens the exam instead
  const les = await p.evaluate(async () => { const u = document.querySelector('#lp-rhythms'); if (u) u.open = true;
    const b2 = u && u.querySelector('.lp-c'); if (b2) b2.click(); await new Promise(x => setTimeout(x, 500));
    return { screen: !!document.querySelector('.exz'), title: (document.querySelector('.exz-top b') || {}).textContent }; });
  console.log('5 blocked step    :', JSON.stringify(les));
  // the exam comes back on the next launch
  await p.evaluate(() => PD.exam.postpone()); await p.waitForTimeout(300);
  await boot();
  console.log('6 next launch     :', await p.evaluate(() => ({ screen: !!document.querySelector('.exz'), on: (PD.exam.active() || {}).id })));
  // pass it → everything opens
  await p.evaluate(() => { PD.exam.finish('ex-inst', 100); PD.exam.close(); PD.app.go('learn'); }); await p.waitForTimeout(800);
  console.log('7 after passing   :', await p.evaluate(() => ({ banner: !!document.querySelector('.ex-banner'), blocked: PD.exam.blocking('rhythms'), screen: !!document.querySelector('.exz') })));
  console.log('errs', errs);
  await b.close();
})();
