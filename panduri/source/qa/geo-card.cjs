/* the rhythm card as the learner sees it after dropping a recording into the AI studio.  node qa/geo-card.cjs file.mp3 [owner] */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const APP = path.join(__dirname, '..', 'dist', 'app'), FILE = path.resolve(process.argv[2]), OWNER = process.argv[3] === 'owner';
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u === '/__file' ? FILE : path.join(APP, u.endsWith('/') ? u + 'index.html' : u); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
(async () => {
  await new Promise(r => srv.listen(0, r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport: { width: 420, height: 900 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(o => { const S = (k, v) => localStorage.setItem('pd2:' + k, JSON.stringify(v)); S('lang', 'ka'); S('language.chosen', true); S('onboarded', true); S('intro.done', true); S('cine', false); if (o) S('cloud.profile', { owner: true, role: 'admin', display_name: 'owner', vip_until: '2099-01-01' }); }, OWNER);
  await p.goto(base + 'index.html'); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelectorAll('.ag,.ob,.lf,.cine-boot').forEach(x => x.remove()); PD.app.go('ai'); }); await p.waitForTimeout(600);
  await p.evaluate(async () => { const blob = await (await fetch('/__file')).blob(); const f = new File([blob], 'განდაგანა.mp3', { type: 'audio/mpeg' }); const dt = new DataTransfer(); dt.items.add(f); const i = document.querySelector('input[type=file]'); i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.waitForFunction(() => document.querySelector('.ai-rhy .ai-geo'), null, { timeout: 300000 });
  await p.waitForTimeout(500);
  const card = await p.evaluate(() => ({ metre: [...document.querySelectorAll('.ai-rhy .ai-fact')].map(x => x.textContent.trim()).join(' | '), geo: document.querySelector('.ai-rhy .ai-geo').textContent, notes: [...document.querySelectorAll('.ai-rhy > small.muted')].map(x => x.textContent).slice(0, 3), teach: !!document.querySelector('.ai-teach') }));
  console.log(JSON.stringify(card, null, 1)); console.log('errors', errs);
  await p.evaluate(() => { const tab = [...document.querySelectorAll('button,[role=tab]')].find(x => /^რითმი$/.test(x.textContent.trim())); if (tab) tab.click(); }); await p.waitForTimeout(500);
  const el = await p.$('.ai-rhy'); if (await el.isVisible()) await el.screenshot({ path: path.join(__dirname, 'out', 'geo-card' + (OWNER ? '-owner' : '') + '.png') }); else console.log('(card not on screen: no screenshot)');
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
