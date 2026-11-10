/* The AI studio, measured against the teacher's own song.
   Bani-Acharuli has real data (src/songdata.js): the start of every rhythm in the recording
   (beats[]) and the teacher's chord cycle Dm · Dm · B♭ · C, one chord per rhythm. The studio's
   analysis runs on the same recording and every number below is compared with that data.

   Run:  node qa/ai-bani.cjs            (serves ../app itself, needs playwright in node_modules)
         FILE=full node qa/ai-bani.cjs  (the mix with the voice; default: music = without the voice) */
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const ROOT = path.join(__dirname, '..', '..', 'app'), PORT = 8797;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.mp3': 'audio/mpeg', '.json': 'application/json', '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
(async () => {
  await new Promise(res => srv.listen(PORT, res));
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(() => { localStorage.setItem('pd2:onboarded', 'true'); localStorage.setItem('pd2:auth.skip', 'true'); localStorage.setItem('pd2:cine', 'false'); localStorage.setItem('pd2:lang', '"ka"'); });
  await p.goto('http://localhost:' + PORT + '/'); await p.waitForTimeout(1500);
  const r = await p.evaluate(async ([file, opt0]) => {
    const S = PD.SONGS['bani-acharuli'], TB = S.beats, CYC = S.cycle;
    const PC = { 'Dm': [2, 'm'], 'B♭': [10, ''], 'C': [0, ''] };
    const buf = await (await fetch('/media/bani/' + file + '.mp3')).arrayBuffer();
    const oc = new OfflineAudioContext(1, 1, 22050), ab = await oc.decodeAudioData(buf);
    const len = Math.ceil(ab.duration * 22050), oc2 = new OfflineAudioContext(1, len, 22050), s = oc2.createBufferSource(); s.buffer = ab; s.connect(oc2.destination); s.start();
    const mono = (await oc2.startRendering()).getChannelData(0);
    const t0 = performance.now();
    const res = await PD.ai._analyse(mono, 22050, null, Object.assign({ voc: 'ext', fast: 1 }, opt0));
    const tA = performance.now() - t0;
    const bt = res.beats ? { beats: res.beats, bpm: res.bpm } : await PD.ai._beatsOf(mono, 22050, res.bpm, res.chords);
    if (PD.ai._snap) res.chords = PD.ai._snap(res.chords, bt.beats, bt.bpm);
    // beats: F-measure, ±70 ms, against the start of every rhythm
    const tol = .07; let hit = 0; const used = new Set();
    TB.forEach(x => { let bi = -1, bd = 1e9; bt.beats.forEach((y, i) => { const d = Math.abs(x - y); if (d < bd && !used.has(i)) { bd = d; bi = i; } }); if (bd <= tol) { hit++; used.add(bi); } });
    const P = hit / bt.beats.length, R = hit / TB.length, F = 2 * P * R / (P + R || 1);
    // chords: the chord sounding in the middle of every rhythm, root and major/minor
    const minor = q => /^(m(?!aj)|dim)/.test(q);
    let ok = 0, okRoot = 0, n = 0; const conf = {};
    for (let k = 0; k < TB.length - 1; k++) {
      const mid = (TB[k] + TB[k + 1]) / 2, want = PC[CYC[k % CYC.length]], c = res.chords.find(x => mid >= x.t0 && mid < x.t1);
      n++; if (!c || c.root < 0) { conf['—'] = (conf['—'] || 0) + 1; continue; }
      const name = PD.ai.cname(c.root, c.q); conf[CYC[k % CYC.length] + '→' + name] = (conf[CYC[k % CYC.length] + '→' + name] || 0) + 1;
      if (c.root === want[0]) { okRoot++; if (minor(c.q) === (want[1] === 'm')) ok++; }
    }
    // the lesson chart (PD.aiLessons): the cycle where the song follows it, the measured chords elsewhere
    let lesson = null;
    if (PD.aiLessons) { res.beats = bt.beats; const C = PD.aiLessons.chart(res); let ok2 = 0, n2 = 0;
      for (let k = 0; k < TB.length - 1; k++) { const mid = (TB[k] + TB[k + 1]) / 2; let j = -1; for (let i = 0; i + 1 < bt.beats.length; i++) if (mid >= bt.beats[i] && mid < bt.beats[i + 1]) { j = i; break; } n2++; if (j >= 0 && C.names[j] === CYC[k % CYC.length]) ok2++; }
      lesson = { acc: +(ok2 / n2).toFixed(3), cycle: C.cyc ? C.cyc.cycle.join(' ') + ' (' + Math.round(C.cyc.agree * 100) + '%)' : null, cover: +C.cover.toFixed(2), unsure: C.unsure, local: C.local, chords: [...new Set(C.names.filter(Boolean))].join(' ') }; }
    const top = Object.entries(conf).sort((a, b2) => b2[1] - a[1]).slice(0, 8).map(([k2, v]) => k2 + ' ' + v).join(', ');
    // rhythm: which of the app's rhythms it names
    let rhy = null;
    try { const on = await PD.aimus.percOnsets(mono, 22050), mt = PD.aimus.metre(bt.beats, on.env, on.dt, on.t0off, res.chords);
      const R2 = PD.aimus.rhythm(on, bt.beats, mt, PD.curriculum.rhythms().concat(PD.curriculum.commonRhythms()));
      rhy = R2 ? { named: R2.best ? R2.best.id : null, top: (R2.matches || []).slice(0, 3).map(m => m.id + ' ' + m.score).join(', '), sub: R2.sub } : null; } catch (e) { rhy = 'error ' + e.message; }
    return { tune: res.tune, file, dur: +ab.duration.toFixed(1), ms: Math.round(tA), bpm: bt.bpm, key: PD.ai.cname(res.key.r, res.key.q), beatsF: +F.toFixed(3), beatsP: +P.toFixed(3), beatsR: +R.toFixed(3),
      chordAcc: +(ok / n).toFixed(3), lesson, rootAcc: +(okRoot / n).toFixed(3), changes: res.chords.filter(c => c.root >= 0).length, distinct: new Set(res.chords.filter(c => c.root >= 0).map(c => c.root + c.q)).size, top, rhythm: rhy };
  }, [process.env.FILE || 'music', JSON.parse(process.env.OPT || '{}')]);
  console.log(JSON.stringify(r, null, 1));
  console.log('truth: key Dm (Dm · B♭ · C), 100 BPM in rhythms, ' + 464 + ' rhythms · 348 chord changes · 3 chords · rhythm acharuli');
  if (errs.length) console.log('page errors:', errs);
  await b.close(); srv.close();
})();
