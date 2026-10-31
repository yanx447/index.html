const { chromium } = require('/opt/node-tools/node_modules/playwright');
const NUL = () => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) if (/null|undefined|NaN|\[object/.test(n.nodeValue) && !n.parentNode.closest('script,style')) out.push(n.nodeValue.trim().slice(0, 80)); document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(e => ['aria-label', 'title', 'placeholder'].forEach(a => { const v = e.getAttribute(a); if (v && /null|undefined|NaN/.test(v)) out.push(a + ':' + v); })); return out; };
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  const res = {};
  const names = await p.evaluate(() => PD.theory.chordLibrary ? PD.theory.chordLibrary().map(c => c.name) : []);
  console.log('lib', names.length);
  // every chord: show, scan
  const bad = {};
  for (const n of names) { await p.evaluate(n => PD.app.go('chords', n), n); await p.waitForTimeout(60); const x = await p.evaluate(NUL); if (x.length) bad[n] = x; }
  res.badChords = bad;
  await p.evaluate(() => PD.app.go('chords', 'Bm')); await p.waitForTimeout(800);
  await p.$$eval('details', a => a.forEach(d => d.open = true));
  await p.click('text=' + await p.evaluate(() => PD.i18n.t('ce.trans'))); await p.waitForTimeout(2500);
  res.trans = await p.evaluate(NUL); res.transText = await p.evaluate(() => document.body.innerText.slice(0, 0));
  await p.screenshot({ path: '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/c52-trans.png' });
  console.log(JSON.stringify(res, null, 1), 'ERR', errs); await b.close();
})();
