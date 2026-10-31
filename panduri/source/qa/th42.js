const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/th/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1000);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); Object.defineProperty(PD.cloud, 'session', { get: () => ({ user: { id: 'x' } }), configurable: true }); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); });
  for (const lang of ['ka', 'en']) {
    await p.evaluate(l => PD.i18n.set(l), lang);
    const rows = [];
    for (const ch of await p.evaluate(() => PD.theoryBook.CHAPTERS.map(c => c.id))) {
      await p.evaluate(id => PD.app.go('theory', id), ch); await p.waitForTimeout(450);
      rows.push(await p.evaluate(id => { const S = PD.theorySimple.get(id); const linked = [...document.querySelectorAll('#page .tb-term')].map(x => x.textContent); return id + ' easy:' + (document.querySelectorAll('#page .tbs-easy p').length) + ' try:' + (!!document.querySelector('#page .tbs-try')) + ' terms ' + linked.length + '/' + S.words.length + ' [' + linked.join(', ') + ']'; }, ch));
    }
    console.log('--', lang); rows.forEach(r => console.log(r));
  }
  await p.evaluate(() => PD.i18n.set('ka'));
  await p.evaluate(() => PD.app.go('theory')); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'list.png' });
  await p.evaluate(() => PD.app.go('theory', 'semitone')); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'ch-top.png' });
  await p.evaluate(() => { const t = document.querySelector('#page .tb-term'); t.scrollIntoView({ block: 'center' }); }); await p.waitForTimeout(300);
  await p.click('#page .tb-term'); await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'ch-term.png' });
  await p.evaluate(() => PD.app.go('theory', 'glossary')); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'gloss.png' });
  await p.fill('#page input[type=search]', 'ოქტ'); await p.waitForTimeout(200); console.log('search "ოქტ":', await p.evaluate(() => [...document.querySelectorAll('.tbs-gl dt')].map(x => x.textContent).join(', ')));
  console.log('glossary words', await p.evaluate(() => PD.theorySimple.glossary().length), 'ERRORS', errs.length ? errs : 'none');
  await b.close();
})();
