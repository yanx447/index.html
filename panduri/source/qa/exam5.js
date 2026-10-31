// no repeats across attempts · the final exam comes last · the certificate
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/exam/';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/TUNNEL|fonts/.test(m.text())) errs.push('C ' + m.text().slice(0, 140)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1400);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); PD.store.set('author', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  // 1 · three attempts at the same exam: no question repeats while the bank lasts
  console.log('1 repeats:', await p.evaluate(() => {
    const seen = new Set(); let dup = 0, total = 0;
    for (let a = 0; a < 3; a++) PD.exam.draw('inst', 10, 'ex-inst').forEach(q => { total++; const k = String(q.q); if (seen.has(k)) dup++; seen.add(k); });
    return { total, dup, remembered: PD.exam.askedOf('ex-inst').length };
  }));
  // 2 · the bank runs out and starts again without breaking
  console.log('2 exhausted:', await p.evaluate(() => { let n = 0; for (let a = 0; a < 12; a++) n += PD.exam.draw('first', 10, 'ex-first').length; return { drawn: n, ok: n === 120 }; }));
  // 3 · the final exam waits for everything
  const fin = await p.evaluate(() => {
    const finish = id => { const r = PD.store.get('exam.done', {}); r[id] = { at: Date.now(), p: 100 }; PD.store.set('exam.done', r); };
    const doPath = u => { const path = PD.lessons.PATHS.find(x => x.id === u);
      path.steps.forEach(s => { if (s.kind === 'exam' || s.kind === 'needs') return;
        if (s.kind === 'tip') PD.store.set('seen.tip.' + s.id, true);
        else if (s.kind === 'chapter') { const d = PD.store.get('theory.done', {}); d[s.id] = 1; PD.store.set('theory.done', d); }
        else if (s.kind === 'solfege') { const [e2, l2] = s.id.split(':'); const bs = PD.store.get('solfege.best', {}); bs[e2 + l2] = 1; PD.store.set('solfege.best', bs); }
        else if (s.kind === 'lesson' || s.kind === 'rhythm') { const key = s.kind === 'rhythm' ? 'rhythm-' + s.id : s.id; PD.store.set('prog.' + key, Object.assign({ stages: {}, best: null, maxTempo: 0, last: 0, plays: 1, heat: {} }, PD.store.get('prog.' + key, {}), { mastery: 1 })); }
        else PD.store.set('seen.' + s.kind, true); }); };
    const out = {};
    PD.lessons.PATHS.forEach(x => doPath(x.id));
    out.beforeExams = { due: PD.exam.dueExam(), courseDone: PD.exam.courseDone() };
    ['ex-first', 'ex-inst', 'ex-rhythm', 'ex-notes', 'ex-harmony', 'ex-solfege'].forEach(finish);
    out.afterExams = { due: PD.exam.dueExam(), courseDone: PD.exam.courseDone(), graduated: PD.exam.graduated() };
    return out;
  });
  console.log('3 final:', JSON.stringify(fin));
  // 4 · pass the final → the certificate
  await p.evaluate(() => { PD.store.set('author', false); PD.account.setProfile({ name: 'ნუკრი' }); PD.exam.open('ex-final'); });
  await p.waitForTimeout(700);
  const cert = await p.evaluate(async () => {
    const cur = PD.exam._cur, z = document.querySelector('.exz');
    cur.answers.forEach((x, i) => { cur.answers[i] = cur.qs[i].ok; });
    PD.exam.finishNow(false); await new Promise(r => setTimeout(r, 600));
    const z2 = document.querySelector('.exz');
    return { graduated: PD.exam.graduated(), cert: !!z2.querySelector('.cert'), name: (z2.querySelector('.cert-name') || {}).textContent, head: (z2.querySelector('.exr h1') || {}).textContent, foot: [...z2.querySelectorAll('.exz-foot .btn')].map(x => x.textContent.trim()) };
  });
  console.log('4 certificate:', JSON.stringify(cert));
  await p.screenshot({ path: OUT + 'cert.png', fullPage: false });
  // 5 · saving it as a picture
  console.log('5 png:', await p.evaluate(async () => { const blobs = []; const old = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (cb, ty) { return old.call(this, b2 => { blobs.push(b2 ? b2.size : 0); cb(b2); }, ty); };
    await PD.exam.saveCert(); await new Promise(r => setTimeout(r, 300)); return blobs; }));
  // 6 · the profile and the certificate page
  await p.evaluate(() => { PD.exam.close(); PD.app.go('profile'); }); await p.waitForTimeout(700);
  console.log('6 profile:', await p.evaluate(() => ({ role: (document.querySelector('.pf2-head small') || {}).textContent, certItem: [...document.querySelectorAll('.pf2-i')].some(x => /სერთიფიკატი/.test(x.textContent)) })));
  await p.evaluate(() => PD.app.go('cert')); await p.waitForTimeout(600);
  console.log('7 cert page:', await p.evaluate(() => ({ cert: !!document.querySelector('.cert'), name: (document.querySelector('.cert-name') || {}).textContent })));
  await p.screenshot({ path: OUT + 'certpage.png', fullPage: true });
  console.log('errs', errs);
  await b.close();
})();
