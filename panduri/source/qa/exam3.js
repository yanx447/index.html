// when does the exam come? only after a unit is newly finished — and it waits across restarts
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  const boot = async () => { await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
    await p.evaluate(() => { PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); });
    await p.reload(); await p.waitForTimeout(1600);
    await p.evaluate(() => { document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); }); await p.waitForTimeout(400); };
  const state = () => p.evaluate(() => ({ screen: !!document.querySelector('.exz'), title: (document.querySelector('.exz-top b') || {}).textContent || '', on: (PD.exam.active() || {}).id || null, seen: PD.store.get('exam.seen', null) }));
  const finishUnit = id => p.evaluate(u => { const path = PD.lessons.PATHS.find(x => x.id === u);
    path.steps.forEach(s => { if (s.kind === 'exam' || s.kind === 'needs') return;
      if (s.kind === 'tip') PD.store.set('seen.tip.' + s.id, true);
      else if (s.kind === 'chapter') { const d = PD.store.get('theory.done', {}); d[s.id] = 1; PD.store.set('theory.done', d); }
      else if (s.kind === 'solfege') { const [e2, l2] = s.id.split(':'); const bst = PD.store.get('solfege.best', {}); bst[e2 + l2] = 1; PD.store.set('solfege.best', bst); }
      else PD.store.set('seen.' + s.kind, true); }); }, id);

  // A · a brand new student: nothing finished, nothing pops up
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1200);
  await p.evaluate(() => localStorage.clear());
  await boot();
  console.log('A new install     :', JSON.stringify(await state()));
  // B · finishes the first unit while using the app → the exam comes at once
  await finishUnit('instrument');
  await p.evaluate(() => PD.app.go('learn')); await p.waitForTimeout(900);
  console.log('B unit finished   :', JSON.stringify(await state()));
  // C · closes the app without passing → it is waiting on the next launch
  await boot();
  console.log('C app reopened    :', JSON.stringify(await state()));
  // D · passes it → free again
  await p.evaluate(() => { PD.exam.finish('ex-inst', 100); PD.exam.close(); PD.app.go('home'); }); await p.waitForTimeout(700);
  console.log('D passed          :', JSON.stringify(await state()));
  await boot();
  console.log('E reopened after  :', JSON.stringify(await state()));
  // F · a device where everything was already studied before the exams existed: no ambush at launch
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); });
  await finishUnit('instrument'); await finishUnit('rhythms'); await finishUnit('notes');
  await boot();
  console.log('F old device      :', JSON.stringify(await state()));
  // G · but finishing one more unit now does bring its exam
  await finishUnit('scales');
  await p.evaluate(() => PD.app.go('learn')); await p.waitForTimeout(900);
  console.log('G one more unit   :', JSON.stringify(await state()));
  console.log('errs', errs);
  await b.close();
})();
