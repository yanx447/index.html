const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(1500);
  console.log(await p.evaluate(async () => { const out = []; for (const f of ['bani/full.mp3', 'bani/full-60.mp3', 'bani/music-70.mp3']) { const ab = await (await fetch('media/' + f)).arrayBuffer(); const c = new OfflineAudioContext(1, 1, 32000); const buf = await c.decodeAudioData(ab); out.push(f + ' ' + buf.duration.toFixed(4)); } return out.join(' | '); }));
  await b.close(); })();
