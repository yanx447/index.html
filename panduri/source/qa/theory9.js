const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude-index-html/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
  await p.evaluate(() => { localStorage.clear(); PD.store.set('onboarded', true); PD.store.set('auth.skip', true); document.querySelector('.ag')?.remove(); document.querySelector('.ob')?.remove(); PD.i18n.set('en'); PD.app.go('theory', 'durations'); });
  await p.waitForTimeout(400);
  const svgs = await p.$$('.tb-svg'); const last = svgs[svgs.length - 1]; await last.scrollIntoViewIfNeeded(); await last.screenshot({ path: OUT + 'dotted.png' });
  await p.evaluate(() => PD.app.go('theory', 'neck')); await p.waitForTimeout(400);
  console.log(await p.evaluate(() => [...document.querySelectorAll('p, div')].map(n => n.textContent).filter(x => /Fret markers sit/.test(x)).sort((a, b) => a.length - b.length)[0]));
  console.log('mk cols:', await p.evaluate(() => [...new Set([...document.querySelectorAll('.tb-cell.mk')].map(c => [...c.parentElement.parentElement.children].indexOf(c.parentElement)))].join(',')));
  // chord thumbnails on the song page
  await p.evaluate(() => PD.app.go('lesson', 'bani-acharuli')); await p.waitForTimeout(500);
  const th = await p.$('svg[viewBox^="0 0 166"]'); if (th) { await th.scrollIntoViewIfNeeded(); await th.evaluate(e => e.parentElement.parentElement.style.background = '#222'); await th.screenshot({ path: OUT + 'thumb.png' }); } else console.log('no thumb');
  await p.setViewportSize({ width: 320, height: 700 }); await p.waitForTimeout(300);
  console.log('320 overflow:', await p.evaluate(() => [...document.querySelectorAll('.lx-actions .btn')].map(b => Math.round(b.getBoundingClientRect().right)).join(',') + ' sw=' + document.documentElement.scrollWidth));
  const la = await p.$('.lx-actions'); if (la) await la.screenshot({ path: OUT + 'lx320.png' });
  await b.close();
})();
