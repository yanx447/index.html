const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/cine/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const [W, H] = (process.env.SIZE || '390x844').split('x').map(Number);
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/TUNNEL|fonts/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1000); if (process.env.TBG) await p.evaluate(c => { window.TBG = c; }, process.env.TBG); if (process.env.SAFE) await p.evaluate(s => { window.SAFE = JSON.parse(s); }, process.env.SAFE);
  await p.evaluate(async () => { const host = document.createElement('div'); host.className = 'cine playing'; host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:' + (window.TBG || '#000'); document.body.appendChild(host); const m = await import(new URL('intro3d.js', document.baseURI).href); window.CINE = m.create(host, { still: true, safe: window.SAFE ? () => window.SAFE : null }); });
  for (const t of (process.env.TIMES || '0.5,1.8,3.2,4.6,5.9,7.4,8.8,10.2,11.4,13.5').split(',').map(Number)) { await p.evaluate(t => CINE.still(t), t); await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'c_' + W + '_' + t + '.png' }); }
  console.log(errs.slice(0, 4)); await b.close();
})();
