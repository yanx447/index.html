const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/cine/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const [W, H] = (process.env.SIZE || '390x844').split('x').map(Number);
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/TUNNEL|fonts|Failed to load/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = "@font-face{font-family:'Noto Sans Georgian';src:url('/render/out/nsg.ttf');font-weight:100 900}"; document.head.appendChild(st); }); }); await p.goto('http://localhost:8766/dist/app/'); 
  const t0 = Date.now();
  for (const s of [2, 5, 8, 11, 15.5]) { const w = s * 1000 - (Date.now() - t0); if (w > 0) await p.waitForTimeout(w); await p.screenshot({ path: OUT + 'sp_' + W + '_' + s + '.png' }); }
  const r = await p.evaluate(() => ({ cls: document.querySelector('.ag-card')?.className, cine: document.querySelector('.ag-cine')?.className, title: document.querySelector('.sp-name')?.textContent }));
  console.log(JSON.stringify(r), errs.slice(0, 4)); await b.close();
})();
