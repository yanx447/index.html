// Games offline and across an update, through the service worker the installable app registers (pwa/sw.js):
//   1. installed once online, the app opens with the network off; the games hub and a Note Rush round work (the
//      virtual fanduri, qa/vpanduri.cjs, plays it); the finished round is saved and is still there after a reload offline,
//      and after reconnecting;
//   2. a new deploy (a new sw.js, index.html and tuner) is picked up: the new worker's shell comes from the server although
//      the browser's HTTP cache (max-age 600, as GitHub Pages sends) still holds the old files — checked on a file only the
//      install fetches (the tuner's main.js; a navigation would overwrite index.html anyway); the old shell cache is deleted.
// Served on http://localhost — a secure context, and the only plain-http address pwa.js registers the worker on.
//   node qa/games-offline.cjs        (APP_DIR=dist/app)
const path = require('path'), fs = require('fs'), http = require('http'), assert = require('assert/strict');
const { chromium } = require('playwright');
const VP = require('./vpanduri.cjs');
const DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '../dist/app'));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
let deploy = 1;   // 2 = "a new version was published"
const server = http.createServer((q, r) => {
  const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.resolve(DIR, '.' + u + (u.endsWith('/') ? 'index.html' : ''));
  if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
  let body = fs.readFileSync(f);
  if (deploy === 2 && /index\.html$/.test(f)) body = Buffer.from(String(body).replace('<head>', '<head><meta name="qa-deploy" content="2">'));
  if (deploy === 2 && /tuner[\\/]js[\\/]main\.js$/.test(f)) body = Buffer.concat([body, Buffer.from('\n/* qa-deploy-2 */\n')]);
  if (deploy === 2 && /sw\.js$/.test(f)) body = Buffer.from(String(body).replace(/const VERSION = '([^']+)'/, "const VERSION = '$1-qa2'"));
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': /sw\.js$/.test(f) ? 'no-cache' : 'max-age=600' }); r.end(body);
});
let failed = 0;
const step = async (name, fn) => { try { const r = await fn(); console.log('✓ ' + name + (r ? '  ' + JSON.stringify(r) : '')); } catch (e) { failed++; console.log('✗ ' + name + '\n    ' + String(e && e.message || e).slice(0, 700)); } };

(async () => {
  await new Promise(res => server.listen(0, 'localhost', res));
  const URL0 = 'http://localhost:' + server.address().port + '/';
  // fonts are not this test's business: they fail fast instead of hanging the page load
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--host-resolver-rules=MAP fonts.googleapis.com 127.0.0.1, MAP fonts.gstatic.com 127.0.0.1'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  await ctx.addInitScript(VP.inPage);
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const boot = async () => { await p.waitForFunction(() => window.PD && PD.app && PD.games, null, { timeout: 30000 }); await p.evaluate(() => { PD.i18n.set('en'); ['onboarded', 'intro.done', 'micExplained', 'gm.calAsked', 'gm.intro'].forEach(k => PD.store.set(k, true)); PD.store.set('gm.metro', false); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(x => x.remove()); }); };
  try {
    await step('installed online: the service worker controls the page and holds the shell', async () => {
      await p.goto(URL0, { waitUntil: 'domcontentloaded' }); await boot();
      await p.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 30000 }).catch(async () => { await p.reload({ waitUntil: 'domcontentloaded' }); await boot(); });
      await p.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 30000 });
      const r = await p.evaluate(async () => { const keys = await caches.keys(), shell = keys.find(k => k.startsWith('pd-shell-')), c = await caches.open(shell), all = (await c.keys()).map(q => new URL(q.url).pathname + new URL(q.url).search); return { shell, n: all.length, games: all.filter(x => /js\/game/.test(x)), build: PD.BUILD }; });
      assert.ok(r.games.length >= 4, 'the four games modules are in the shell: ' + r.games.join(', '));
      return { shell: r.shell, files: r.n, games: r.games.map(x => x.replace(/\?.*/, '')) };
    });
    await step('a round played online, then the network off: the app opens, the hub shows the round, a new round plays and is saved', async () => {
      // the recordings the virtual fanduri plays pass through the worker once, online (it keeps the instrument's own notes)
      await p.evaluate(async () => { PD.audio.ensure(); await PD.gameAudio.acquire(); await __vp.load([1, 2, 3].map(s => ({ s, f: 0 }))); await __vp.calibrate(); });
      const play = async () => {
        await p.evaluate(() => PD.app.go('games', 'rush:1:easy')); await p.waitForTimeout(800);
        await p.click('#page .gm-go .btn'); await p.waitForFunction(() => PD.games.current && PD.games.current.state === 'playing', null, { timeout: 30000 });
        await p.evaluate(() => { const VP = window.__vp, S = PD.games.current.S, q = S.mode.qa(), done = new Set(); const tk = () => { const c = PD.games.current; if (!c || c.S !== S || !S.alive) return; const now = S.now(); q.chart.forEach((n, i) => { if (done.has(i)) return; const at = S.clock.audio(n.t) + S.lag + S.off; if (at < now + .25) { done.add(i); if (at > now - .005) VP.note(n.s, n.f, at, .55); } }); setTimeout(tk, 25); }; tk(); });
        await p.waitForFunction(() => PD.games.current && ['completed', 'failed'].includes(PD.games.current.state), null, { timeout: 90000 });
        const r = await p.evaluate(() => ({ hits: PD.games.current.S.sc.s.perfect + PD.games.current.S.sc.s.great + PD.games.current.S.sc.s.good, plays: ((PD.store.get('games.best', null) || { map: {} }).map['rush:1:easy'] || {}).plays || 0 }));
        await p.evaluate(() => PD.games.current.exit()); await p.waitForTimeout(400);
        return r;
      };
      const on = await play();
      await ctx.setOffline(true);
      await p.reload({ waitUntil: 'domcontentloaded' }); await boot();
      await p.evaluate(() => PD.app.go('games')); await p.waitForTimeout(900);
      const hub = await p.evaluate(() => ({ cards: document.querySelectorAll('#page .gm-gc').length, recent: document.querySelector('#page .gm-list') ? document.querySelector('#page .gm-list').innerText.replace(/\s+/g, ' ').slice(0, 120) : '' }));
      await p.evaluate(async () => { PD.audio.ensure(); await PD.gameAudio.acquire(); await __vp.load([1, 2, 3].map(s => ({ s, f: 0 }))); await __vp.calibrate(); });
      const off = await play();
      await p.reload({ waitUntil: 'domcontentloaded' }); await boot();
      const kept = await p.evaluate(() => ((PD.store.get('games.best', null) || { map: {} }).map['rush:1:easy'] || {}).plays || 0);
      await ctx.setOffline(false);
      await p.reload({ waitUntil: 'domcontentloaded' }); await boot();
      const back = await p.evaluate(() => ((PD.store.get('games.best', null) || { map: {} }).map['rush:1:easy'] || {}).plays || 0);
      assert.equal(hub.cards, 8, 'the eight games offline'); assert.ok(/Note Rush/.test(hub.recent), 'the round from before: ' + hub.recent);
      assert.ok(on.hits >= 18 && off.hits >= 18, 'hits online ' + on.hits + ', offline ' + off.hits);
      assert.equal(off.plays, 2); assert.equal(kept, 2, 'after a reload offline'); assert.equal(back, 2, 'after reconnecting');
      return { hitsOnline: on.hits, hitsOffline: off.hits, roundsKept: back };
    });
    await step('a new deploy: picked up, the new shell from the server (not the 10-minute HTTP cache), the old cache gone', async () => {
      const before = await p.evaluate(async () => ({ shell: (await caches.keys()).find(k => k.startsWith('pd-shell-')), marker: !!document.querySelector('meta[name="qa-deploy"]') }));
      deploy = 2;
      // what the new worker packs, looked at before it takes over (the reload's navigation rewrites index.html itself)
      const packed = p.evaluate(() => new Promise(res => { const t0 = Date.now(); const tk = async () => { const k = (await caches.keys()).find(x => /-qa2$/.test(x)); if (k) { const c = await caches.open(k), r = await c.match('tuner/js/main.js'); if (r) return res(/qa-deploy-2/.test(await r.text())); } if (Date.now() - t0 > 20000) return res(null); setTimeout(tk, 50); }; tk(); }));
      const found = await p.evaluate(() => PD.pwa.update());
      const tunerNew = await packed.catch(() => null);
      await p.waitForEvent('load', { timeout: 30000 }).catch(() => {});   // the app reloads itself once the new worker takes over
      await boot(); await p.waitForTimeout(800);
      const after = await p.evaluate(async () => {
        const keys = await caches.keys(), shell = keys.find(k => k.startsWith('pd-shell-')), c = await caches.open(shell), idx = await c.match('index.html');
        return { keys: keys.filter(k => k.startsWith('pd-shell-')), shell, cachedIndexNew: idx ? /qa-deploy/.test(await idx.text()) : null, marker: !!document.querySelector('meta[name="qa-deploy"]') };
      });
      assert.equal(found, true, 'an update was found'); assert.ok(/-qa2$/.test(after.shell), 'the new shell cache: ' + after.shell);
      assert.equal(tunerNew, true, 'the new worker packed the new tuner, not the HTTP-cached old one');
      assert.equal(after.keys.length, 1, 'the old shell cache deleted: ' + after.keys.join(', '));
      assert.equal(after.cachedIndexNew, true, 'the new index.html in the new cache (not the HTTP-cached old one)'); assert.equal(after.marker, true, 'the page runs the new version');
      return { from: before.shell, to: after.shell, tunerFromServer: tunerNew };
    });
    assert.equal(errs.length, 0, errs.join(' | '));
  } catch (e) { failed++; console.log('✗ ' + (e && e.message || e)); }
  finally { await b.close(); server.close(); }
  console.log(failed ? failed + ' failed' : 'all passed'); process.exitCode = failed ? 1 : 0;
})();
