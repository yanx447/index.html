/* Where Georgian instruments land in today's stem models — measured, not assumed.
   Real recordings from the repository, each holding ONE known source:
     · the teacher's panduri alone (რითმები/*.wav: the rhythms; ფანდურის თითოელი სიმი/*.wav: single strings and all three)
     · Bani's „Acharuli": the music without the voices (MUSIC.mp3) and the voices alone (VOCAL.mp3, Georgian polyphony)
   Each is separated by Demucs v4 (4 stems) and its 6-stem model; the share of each stem in the separated energy is printed.
   A source that a model "knows" goes to its own stem; the panduri has no stem of its own, so this shows where it goes.
   Doli, garmoni, chonguri and salamuri have no isolated recording in the repository: they are NOT measured here.
   Usage: node qa/geo-routing.cjs [seconds per file = 20] [out.json] */
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../../..'), SECS = +(process.argv[2] || 20), OUT = process.argv[3];
const FILES = [
  ['panduri · rhythm acharuli (slow)', 'რითმები/აჭარული ნელი.wav'], ['panduri · rhythm acharuli (very slow)', 'რითმები/აჭარული ძალიან ნელი.wav'],
  ['panduri · rhythm mtiuluri (normal)', 'რითმები/მთიულური ნორმალური.wav'], ['panduri · rhythm mtiuluri (very slow)', 'რითმები/მთიულური ძალიან ნელი.wav'],
  ['panduri · bass string (A)', 'ფანდურის თითოელი სიმი/ბანი სიმი.wav'], ['panduri · 2nd voice (C♯)', 'ფანდურის თითოელი სიმი/მეორე სიმი.wav'],
  ['panduri · 1st voice (E)', 'ფანდურის თითოელი სიმი/პირველი სიმი.wav'], ['panduri · all three strings', 'ფანდურის თითოელი სიმი/სამივე სიმი.wav'],
  ['Bani · music without voices', 'MUSIC/ბანი - აჭარული/MUSIC.mp3', 120], ['Bani · Georgian polyphonic voices', 'MUSIC/ბანი - აჭარული/VOCAL.mp3', 120]
];
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/__b') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><title>geo</title>'); return; }
  const f = path.resolve(root, '.' + u);
  if (!f.startsWith(root + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  const T = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json' };
  res.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Content-Length': fs.statSync(f).size }); fs.createReadStream(f).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch({ channel: 'chrome', headless: true }); const p = await b.newPage();
  p.on('console', m => { if (/^geo:/.test(m.text())) console.log(m.text().slice(4)); });
  await p.goto(origin + '/__b');
  const out = await p.evaluate(async ({ origin, FILES, SECS }) => {
    const SR = 44100, src = await (await fetch(origin + '/panduri/source/src/aiworker.js')).text();
    const gpu = !!(navigator.gpu && await navigator.gpu.requestAdapter().catch(() => null)), W = {};
    const run = (dir, L, R) => new Promise((res, rej) => {
      let w = W[dir]; const go = () => w.postMessage({ cmd: 'separate', L, R }, [L.buffer, R.buffer]);
      const onm = e => { const m = e.data; if (m.type === 'ready') { w.ep = m.ep; go(); } else if (m.type === 'error') rej(new Error(m.msg)); else if (m.type === 'done') res(m); };
      if (!w) { w = W[dir] = new Worker(URL.createObjectURL(new Blob([src + '\nAIW();'], { type: 'text/javascript' }))); w.onmessage = onm; w.postMessage({ cmd: 'load', base: origin + '/panduri/ai/', prefer: gpu ? 'webgpu' : 'wasm', dir }); }
      else { w.onmessage = onm; go(); }
    });
    const rows = [];
    for (const [label, file, from] of FILES) {
      const ab = await new OfflineAudioContext(2, 1, SR).decodeAudioData(await (await fetch(origin + '/' + encodeURI(file))).arrayBuffer());
      // the window: from the given second, or else the loudest SECS seconds (a quiet lead-in says nothing about the instrument)
      const n = Math.min(ab.length, SECS * SR), x0 = ab.getChannelData(0); let a = 0;
      if (from != null) a = Math.min(Math.round(from * SR), ab.length - n); else { let best = -1; for (let s = 0; s + n <= ab.length; s += SR / 2) { let e = 0; for (let i = s; i < s + n; i += 9) e += x0[i] * x0[i]; if (e > best) { best = e; a = s; } } }
      const c0 = ab.getChannelData(0).slice(a, a + n), c1 = (ab.numberOfChannels > 1 ? ab.getChannelData(1) : ab.getChannelData(0)).slice(a, a + n);
      const row = { label, file, seconds: +(n / SR).toFixed(1), from: +(a / SR).toFixed(1) };
      for (const dir of ['model', 'model6']) {
        let m; try { m = await run(dir, c0.slice(), c1.slice()); } catch (e) { row[dir === 'model' ? 'd4' : 'd6'] = { error: e.message }; W[dir].terminate(); delete W[dir]; continue; }
        const e = m.stems.map(s => { let x = 0; for (const ch of s) for (let i = 0; i < ch.length; i += 2) x += ch[i] * ch[i]; return x; }), tot = e.reduce((p, q) => p + q, 0);
        row[dir === 'model' ? 'd4' : 'd6'] = Object.fromEntries(m.sources.map((s, i) => [s, +(e[i] / tot).toFixed(3)]));
      }
      console.log('geo:' + JSON.stringify(row)); rows.push(row);
    }
    Object.values(W).forEach(w => w.terminate());
    return { gpu, rows };
  }, { origin, FILES, SECS });
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  await b.close(); server.close();
})().catch(e => { console.error(e); server.close(); process.exit(1); });
