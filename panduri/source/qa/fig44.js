const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/fig/';
const which = process.argv[2] || 'all';
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 1.5 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1200);
  const jobs = [['sit', 'side', [0, 3.4, 6]], ['sit', 'front', [1.5]], ['sit', 'top', [0]], ['hold', '', [1, 6.5]], ['hands', '', [1, 5]], ['strokes', '', [.2, .85, .95, 1.05, 1.6, 2.3, 2.45, 2.6, 3.0]], ['fingers', '', [.5, 2.0, 6.5]], ['warmup', '', [0, 1, 2]], ['care', '', [1.5, 4.5, 7.5]], ['lefthand', 'top', [0.3, 2.2, 5]], ['lefthand', 'section', [1, 2.2]]].filter(j => which === 'all' || which.split(',').includes(j[0]));
  await p.evaluate(jobs => {
    document.body.innerHTML = '<div id="g" style="display:grid;grid-template-columns:repeat(3,420px);gap:10px;background:#141210;padding:10px"></div>';
    const g = document.getElementById('g');
    jobs.forEach(([n, v, ts]) => ts.forEach(t => { const S = PD.fig.SCENES[n], id = 'q' + Math.random().toString(36).slice(2, 7) + '_', vv = v || (S.views ? S.views[0][0] : '');
      const d = document.createElement('div'); d.style.cssText = 'background:#1b1815;border-radius:12px;padding:6px;color:#aaa;font:12px sans-serif';
      d.innerHTML = n + ' ' + vv + ' t=' + t + '<svg viewBox="' + S.vb + '" style="width:100%;display:block">' + '<defs>' + S.defs(id) + '</defs>' + S.draw(t, id, vv) + '</svg>'; g.appendChild(d); }));
  }, jobs);
  await p.waitForTimeout(300);
  await p.screenshot({ path: OUT + 'sheet.png', fullPage: true });
  console.log('ERR', errs);
  await b.close();
})();
