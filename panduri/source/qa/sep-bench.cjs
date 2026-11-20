/* Separation quality on a real Georgian song with real ground truth.
   „ბანი — აჭარული" exists as two separate recordings, the voice (VOCAL.mp3) and the music (MUSIC.mp3). Their sum is
   the mix, so every engine's vocals can be compared with the real voice and its other stems together with the real music.
   SDR = 10·log10(Σ s² / Σ (s − ŝ)²) over both channels (the plain signal-to-distortion ratio; higher is better).
   Usage: node qa/sep-bench.cjs [seconds = 40] [variants = d4,d4o50,d4s2,spl] [out.json] [from seconds = the window with most voice]
     d4 = Demucs v4 4-stem, 25 % overlap, one pass (what the studio does today) · d4o50 = 50 % overlap ·
     d4s2 = two passes with shifted segment edges · d6 = the 6-stem model · spl = Spleeter (the light engine)
   Needs the models in panduri/ai/ (they are in the repository). Chrome; WebGPU when the machine has it, else WASM. */
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../../..');
const SECS = +(process.argv[2] || 40), VARIANTS = (process.argv[3] || 'd4,d4o50,d4s2,spl').split(','), OUT = process.argv[4], FROM = process.argv[5] == null ? null : +process.argv[5];
const DIR = 'MUSIC/ბანი - აჭარული';
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/__bench') { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end('<!doctype html><title>bench</title>'); return; }
  const file = path.resolve(root, '.' + u);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
  res.writeHead(200, { 'Content-Length': fs.statSync(file).size, 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--enable-unsafe-webgpu'] });
  const p = await b.newPage(); p.on('console', m => { if (/^bench:/.test(m.text())) console.log(m.text()); });
  await p.goto(origin + '/__bench');
  const out = await p.evaluate(async ({ origin, DIR, SECS, VARIANTS, FROM }) => {
    const SR = 44100;
    const dec = async u => { const buf = await (await fetch(u)).arrayBuffer(); return new OfflineAudioContext(2, 1, SR).decodeAudioData(buf); };
    const V = await dec(origin + '/' + encodeURI(DIR) + '/VOCAL.mp3'), M = await dec(origin + '/' + encodeURI(DIR) + '/MUSIC.mp3');
    const ch = (ab, c) => ab.getChannelData(Math.min(c, ab.numberOfChannels - 1));
    // the window: the SECS seconds with the most voice in them (5 s steps)
    const n = Math.min(V.length, M.length), W = SECS * SR, v0 = ch(V, 0);
    let best = 0, bestE = -1; for (let a = 0; a + W <= n; a += 5 * SR) { let e = 0; for (let i = a; i < a + W; i += 7) e += v0[i] * v0[i]; if (e > bestE) { bestE = e; best = a; } }
    if (FROM != null) best = Math.min(Math.round(FROM * SR), n - W);
    const cut = (ab, c) => ch(ab, c).slice(best, best + W);
    const tv = [cut(V, 0), cut(V, 1)], tm = [cut(M, 0), cut(M, 1)], mix = [0, 1].map(c => { const x = new Float32Array(W); for (let i = 0; i < W; i++) x[i] = tv[c][i] + tm[c][i]; return x; });
    let peak = 0; mix.forEach(x => x.forEach(y => { if (Math.abs(y) > peak) peak = Math.abs(y); }));
    const sdr = (ref, est) => { let s = 0, d = 0; for (let c = 0; c < 2; c++) for (let i = 0; i < W; i++) { const r = ref[c][i], e = est[c][i] || 0; s += r * r; d += (r - e) * (r - e); } return +(10 * Math.log10(s / d)).toFixed(2); };
    const gpu = !!(navigator.gpu && await navigator.gpu.requestAdapter().catch(() => null));
    const src = { d: await (await fetch(origin + '/panduri/source/src/aiworker.js')).text(), s: await (await fetch(origin + '/panduri/source/src/aispl.js')).text() };
    const workers = {};
    function run(kind, dir, opt) {
      const key = kind + dir;
      return new Promise((resolve, reject) => {
        let w = workers[key]; const t0 = performance.now(); let ep = null;
        const go = () => { const L = mix[0].slice(), R = mix[1].slice(); w.postMessage(Object.assign({ cmd: 'separate', L, R }, opt), [L.buffer, R.buffer]); };
        const onm = e => { const m = e.data;
          if (m.type === 'ready') { ep = m.ep || 'wasm'; w.ready = ep; go(); }
          else if (m.type === 'error') reject(new Error(m.msg));
          else if (m.type === 'done') resolve({ m, ms: Math.round(performance.now() - t0), ep: w.ready }); };
        if (!w) { w = workers[key] = new Worker(URL.createObjectURL(new Blob([(kind === 'd' ? src.d + '\nAIW();' : src.s + '\nAISPL();')], { type: 'text/javascript' }))); w.onmessage = onm; w.postMessage(kind === 'd' ? { cmd: 'load', base: origin + '/panduri/ai/', prefer: gpu ? 'webgpu' : 'wasm', dir } : { cmd: 'load', base: origin + '/panduri/ai/' }); }
        else { w.onmessage = onm; go(); }
      });
    }
    const SPEC = { d4: ['d', 'model', {}], d4o50: ['d', 'model', { overlap: .5 }], d4s2: ['d', 'model', { shifts: 2 }], d4s3: ['d', 'model', { shifts: 3 }], d6: ['d', 'model6', {}], spl: ['s', '', {}] };
    const rows = [];
    for (const v of VARIANTS) {
      const [kind, dir, opt] = SPEC[v];
      const { m, ms, ep } = await run(kind, dir, opt);
      const S = m.sources, st = m.stems, vi = S.indexOf('vocals');
      const acc = [0, 1].map(c => { const x = new Float32Array(W); S.forEach((nm, i) => { if (i !== vi) { const a = st[i][c] || st[i][0]; for (let j = 0; j < W; j++) x[j] += a[j]; } }); return x; });
      const voc = [st[vi][0], st[vi][1] || st[vi][0]];
      // where the energy of the real music went (share of each stem's energy in the music-only part is not separable here;
      // this is each stem's share of the separated total)
      const energy = S.map((nm, i) => { let e = 0; for (let c = 0; c < 2; c++) { const a = st[i][c] || st[i][0]; for (let j = 0; j < W; j += 3) e += a[j] * a[j]; } return e; });
      const tot = energy.reduce((a, x) => a + x, 0);
      const row = { variant: v, ep, seconds: SECS, ms, rtf: +(ms / 1000 / SECS).toFixed(3), sdrVocals: sdr(tv, voc), sdrMusic: sdr(tm, acc), share: Object.fromEntries(S.map((nm, i) => [nm, +(energy[i] / tot).toFixed(3)])), vsVoice: Object.fromEntries(S.map((nm, i) => [nm, sdr(tv, [st[i][0], st[i][1] || st[i][0]])])) };
      console.log('bench: ' + JSON.stringify(row)); rows.push(row);
    }
    Object.values(workers).forEach(w => w.terminate());
    return { from: +(best / SR).toFixed(1), seconds: SECS, peak: +peak.toFixed(3), gpu, rows };
  }, { origin, DIR, SECS, VARIANTS, FROM });
  console.log(JSON.stringify(out, null, 1));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  await b.close(); server.close();
})().catch(e => { console.error(e); server.close(); process.exit(1); });
