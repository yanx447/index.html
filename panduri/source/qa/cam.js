// render the intro scene from fixed cameras: VIEWS='[[name,[px,py,pz],[tx,ty,tz],[ux,uy,uz],fov],...]'
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-claude/d17ed486-e6cb-5d9f-80bb-ed664a9aab9c/scratchpad/qa/cam/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const [W, H] = (process.env.SIZE || '800x600').split('x').map(Number);
  const p = await (await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/TUNNEL|fonts/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(1000);
  await p.evaluate(async () => { const host = document.createElement('div'); host.className = 'cine playing'; host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#3a3028'; document.body.appendChild(host); const m = await import(new URL('intro3d.js', document.baseURI).href); window.CINE = m.create(host, { still: true }); });
  for (const [n, pos, tgt, up, fov] of JSON.parse(process.env.VIEWS)) { await p.evaluate(a => CINE.debugCam(...a), [pos, tgt, up, fov, 0]); await p.waitForTimeout(200); await p.screenshot({ path: OUT + n + '.png' }); }
  console.log(errs.slice(0, 4)); await b.close();
})();
