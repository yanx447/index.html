// the welcome screen at the end of the film: real layout (name, buttons) + the final frame
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/cine/';
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  for (const sz of (process.env.SIZES || '390x844,1440x900').split(',')) {
    const [W, H] = sz.split('x').map(Number);
    const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: +(process.env.DSF || 1) })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(() => { document.addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = "@font-face{font-family:'Noto Sans Georgian';src:url('/render/out/nsg.ttf');font-weight:100 900}"; document.head.appendChild(st); }); });
    if (process.env.HIDE) await p.addInitScript(() => { window.HIDE = 1; });
    await p.goto('http://localhost:8766/dist/app/');
    await p.waitForFunction(() => PD._cineCtl, null, { timeout: 60000 });
    for (const t of (process.env.TIMES || '17,22').split(',').map(Number)) {
      await p.evaluate(t => { const c = document.querySelector('.ag-card'); c.classList.remove('pre'); c.classList.add('reveal'); if (window.HIDE) c.style.visibility = 'hidden'; PD._cineCtl.still(t); }, t);
      await p.waitForTimeout(2500); await p.screenshot({ timeout: 120000, path: OUT + 'sp2_' + W + '_' + t + '.png' });
    }
    console.log(sz, errs.slice(0, 3)); await p.close();
  }
  await b.close();
})();
