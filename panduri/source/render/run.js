// usage: node run.js script.js  — opens the app, loads the scene, runs the given page script (exports async function main(HS))
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 960, height: 600 } });
  p.on('console', m => { const t = m.text(); if (!/Failed to load resource|ERR_TUNNEL|fonts/.test(t)) console.log('c:', t.slice(0, 400)); });
  p.on('pageerror', e => console.log('E', e.message));
  await p.goto('http://localhost:8766/dist/app/'); await p.waitForTimeout(800);
  await p.addScriptTag({ type: 'module', url: '/render/scene.js' });
  await p.waitForFunction(() => window.HS_READY, null, { timeout: 120000 });
  await p.exposeFunction('saveFrame', async (name) => { await p.locator('canvas[style*="2147483647"]').screenshot({ path: name }); });
  const script = process.argv[2];
  if (process.env.NOFRAMES) await p.evaluate(() => { window.NO_FRAMES = true; });
  if (process.env.STILL) await p.evaluate(() => { window.STILL_ONLY = true; });
  if (process.env.NO_VIEW_RULE) await p.evaluate(() => { window.NO_VIEW_RULE = true; });
  if (process.env.POSE_FILE) await p.evaluate(j => { window.POSE_LIST = j; }, JSON.parse(fs.readFileSync(process.env.POSE_FILE, 'utf8')));
  if (process.env.SEED_FILE) await p.evaluate(j => { window.SEEDS = j; }, JSON.parse(fs.readFileSync(process.env.SEED_FILE, 'utf8')));
  if (process.env.HAND_JOB) await p.evaluate(j => { window.HAND_JOB = j; }, process.env.HAND_JOB);
  await p.addScriptTag({ type: 'module', url: '/render/' + script + '?' + Date.now() });
  await p.waitForFunction(() => window.JOB_DONE, null, { timeout: 3600000 });
  const res = await p.evaluate(() => window.JOB_RESULT);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(res)); else if (res) console.log(typeof res === 'string' ? res : JSON.stringify(res).slice(0, 4000));
  await b.close();
})();
