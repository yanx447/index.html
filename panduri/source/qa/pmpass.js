// the free 4-hour studio session: reopening inside it, locked outside it, no limits with Premium
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errs = []; p.on('pageerror', e => errs.push('PE ' + e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts|Failed to load resource/.test(m.text())) errs.push('C ' + m.text().slice(0, 120)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); PD.store.set('cine', false); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.app.go('ai'); });
  await p.waitForTimeout(800);
  const put = nm => p.evaluate(async n => {
    const blob = await (await fetch('http://localhost:8766/qa/test.ogg')).blob();
    const dt = new DataTransfer(); dt.items.add(new File([blob], n, { type: 'audio/ogg' }));
    const inp = document.querySelector('input[type=file]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  }, nm);
  const say = async k => console.log(k, '| pass:', (await p.evaluate(() => (document.querySelector('.ai-pass') || {}).textContent || '—')).trim(),
    '| notice:', (await p.evaluate(() => (document.querySelector('.ai-status .notice') || {}).textContent || '—')).trim(),
    '| studio:', await p.evaluate(() => !!document.querySelector('.ai-trans')));
  // 1 · first song starts the session
  await put('one.ogg'); await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 }); await p.waitForTimeout(400);
  await say('1 opened ');
  // 2 · the same song again, inside the session — allowed as often as they like
  await p.evaluate(() => PD.app.go('home')); await p.waitForTimeout(400); await p.evaluate(() => PD.app.go('ai')); await p.waitForTimeout(600);
  await put('one.ogg'); await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 }); await p.waitForTimeout(400);
  await say('2 reopen ');
  // 3 · a different song inside the same session — refused
  await put('two.ogg'); await p.waitForTimeout(1500); await say('3 other  ');
  // 4 · the session has run out (4 h ago)
  await p.evaluate(() => { const q = PD.store.get('ai.pass', null); q.at = Date.now() - 4.1 * 3600e3; PD.store.set('ai.pass', q); });
  await put('one.ogg'); await p.waitForTimeout(1500); await say('4 expired');
  // 5 · yesterday's session: a new one may start
  await p.evaluate(() => PD.store.set('ai.pass', { at: Date.now() - 30 * 3600e3, name: 'one.ogg' }));
  await put('three.ogg'); await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 }); await p.waitForTimeout(400);
  await say('5 new day');
  // 6 · Premium: no session at all
  await p.evaluate(() => { PD.store.set('ai.test', true); PD.store.set('ai.pass', { at: Date.now() - 1e3, name: 'one.ogg' }); PD.app.go('home'); });
  await p.waitForTimeout(300); await p.evaluate(() => PD.app.go('ai')); await p.waitForTimeout(600);
  await put('four.ogg'); await p.waitForFunction(() => document.querySelector('.ai-trans'), null, { timeout: 180000 }); await p.waitForTimeout(400);
  await say('6 premium');
  console.log('errs', errs);
  await b.close();
})();
