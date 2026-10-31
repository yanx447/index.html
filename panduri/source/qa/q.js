const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('http://localhost:8765/app/'); await p.waitForTimeout(2500);
console.log(await p.evaluate(() => JSON.stringify({ songs: PD.lessons.all.filter(l => l.type === 'song' || l.song).map(l => l.id + (l.events.length ? '' : '(empty)')), paths: PD.lessons.PATHS.map(p => p.id + ':' + p.steps.map(s => s.kind + (s.id ? '=' + s.id : '')).join(',')) }, null, 1)));
await b.close(); })();
