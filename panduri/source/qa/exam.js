// the exams: bank sanity, the lock, pass and fail, the timer, the exercise
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/exam/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  for (const lang of ['ka', 'en']) {
    const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
    const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 140)); });
    await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
    await p.evaluate(l => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); PD.i18n.set(l); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); }, lang);
    await p.waitForTimeout(400);
    // 1 · every generator runs and every question is well formed
    const bank = await p.evaluate(() => {
      const bad = [], names = Object.keys(PD.exam.GEN);
      names.forEach(n => { for (let i = 0; i < 40; i++) { let q; try { q = PD.exam.GEN[n](); } catch (e) { bad.push(n + ' THREW ' + e.message); break; }
        if (!q || !q.q || !q.opts || q.opts.length < 3) { bad.push(n + ' SHAPE ' + JSON.stringify(q && q.opts)); break; }
        if (!(q.ok >= 0 && q.ok < q.opts.length)) { bad.push(n + ' OK ' + q.ok); break; }
        const txt = q.opts.map(o => Array.isArray(o) ? o[0] : String(o));
        if (new Set(txt).size !== txt.length) { bad.push(n + ' DUP ' + txt.join('|')); break; }
        if (txt.some(x => !x || /undefined|NaN|null/.test(x))) { bad.push(n + ' EMPTY ' + txt.join('|')); break; }
        if (/undefined|NaN/.test(String(q.q) + String(q.why))) { bad.push(n + ' TEXT ' + q.q); break; } } });
      const sizes = PD.exam.EXAMS.map(e => { const d = PD.exam.draw(e.topic, e.n); return e.id + ':' + d.length + '/' + e.n; });
      return { gens: names.length, bad, sizes };
    });
    console.log('==', lang, 'generators', bank.gens, '| draws', bank.sizes.join(' '), '| bad', bank.bad);
    // 2 · start an exam → the lock
    const lock = await p.evaluate(() => { PD.app.go('exams'); PD.exam.begin('ex-inst');
      PD.app.go('home'); PD.app.go('chords'); PD.app.go('ai');
      return { route: PD.app.route, param: PD.app.param, navHidden: getComputedStyle(document.querySelector('.tabbar')).display, body: document.body.classList.contains('exam-on') }; });
    console.log('lock:', JSON.stringify(lock));
    await p.waitForTimeout(400);
    await p.screenshot({ path: OUT + lang + '_exam.png', fullPage: false });
    // 3 · answer everything right → pass
    const pass = await p.evaluate(async () => {
      const page = document.querySelector('#page');
      for (let n = 0; n < 40; n++) {
        const opts = [...page.querySelectorAll('.exq-opts .btn')];
        if (!opts.length) break;
        // the right option is known from the drawn question list via the DOM order: ask the module instead
        const qtext = page.querySelector('.exq-q').textContent;
        const right = window.__ANS && window.__ANS[qtext];
        (right != null ? opts[right] : opts[0]).click();
        await new Promise(r => setTimeout(r, 220));
        const fin = [...page.querySelectorAll('.exq-foot .btn')].find(x => /დასრულება|Finish/.test(x.textContent));
        if (fin) { fin.click(); break; }
      }
      await new Promise(r => setTimeout(r, 300));
      return { res: (document.querySelector('.exr b') || {}).textContent, head: (document.querySelector('.exr h1') || {}).textContent, review: document.querySelectorAll('.exrev-q').length };
    });
    console.log('submit (answers not chosen for correctness):', JSON.stringify(pass));
    // 4 · a forced pass unlocks the app
    const after = await p.evaluate(() => { PD.exam.finish('ex-inst', 100); PD.app.go('home'); return { route: PD.app.route, on: !!PD.exam.active(), passed: PD.exam.passed('ex-inst'), body: document.body.classList.contains('exam-on') }; });
    console.log('after pass:', JSON.stringify(after));
    // 5 · the exercise page
    await p.evaluate(() => PD.app.go('drill', 'solfege')); await p.waitForTimeout(600);
    console.log('drill:', await p.evaluate(() => ({ q: !!document.querySelector('.exq-q'), opts: document.querySelectorAll('.exq-opts .btn').length, listen: !!document.querySelector('[data-t="ex.listen"]') })));
    await p.evaluate(() => { const o = document.querySelectorAll('.exq-opts .btn'); o[0].click(); }); await p.waitForTimeout(300);
    console.log('drill answer:', await p.evaluate(() => ({ fb: !!document.querySelector('.tb-fb:not([hidden])'), next: !!document.querySelector('[data-t="ex.more"]'), score: (document.querySelector('.exd-score')||{}).textContent })));
    await p.evaluate(() => PD.app.go('exams')); await p.waitForTimeout(500);
    await p.screenshot({ path: OUT + lang + '_list.png', fullPage: true });
    // raw i18n keys anywhere?
    console.log('rawkeys:', await p.evaluate(() => [...document.querySelectorAll('#page [data-t]')].filter(e => e.textContent.trim() === e.dataset.t).map(e => e.dataset.t)));
    console.log('errs', errs);
    await p.close();
  }
  await b.close();
})();
