/* Which of the teacher's four rhythms does the AI studio name for a recording?
   Runs the studio's own pipeline (PD.ai.analyse → beats, PD.aimus onsets → metre → rhythm) in Chromium on real files
   and prints the metre, the stroke grid and every rhythm's score.
   node qa/geo-rhythm.cjs file.mp3[=expected] …   (needs dist/app: python3 build.py) */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const APP = path.join(__dirname, '..', 'dist', 'app');
const files = process.argv.slice(2).map(a => { const [f, want] = a.split('='); return { f: path.resolve(f), want: want || null }; });
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json' };
const srv = http.createServer((q, r) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  let f = u.startsWith('/__file/') ? files[+u.slice(8)].f : path.join(APP, u.endsWith('/') ? u + 'index.html' : u);
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
});
(async () => {
  await new Promise(r => srv.listen(0, r)); const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext()).newPage();
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.addInitScript(() => { localStorage.setItem('pd2:lang', '"ka"'); localStorage.setItem('pd2:language.chosen', 'true'); localStorage.setItem('pd2:onboarded', 'true'); localStorage.setItem('pd2:intro.done', 'true'); });
  await p.goto(base + 'index.html'); await p.waitForTimeout(1500);
  for (let i = 0; i < files.length; i++) {
    const out = await p.evaluate(async url => {
      const ab = await (await fetch(url)).arrayBuffer();
      const ac = new AudioContext(); const buf = await ac.decodeAudioData(ab); ac.close();
      const len = Math.ceil(buf.duration * 22050), oc = new OfflineAudioContext(1, len, 22050), s = oc.createBufferSource(); s.buffer = buf; s.connect(oc.destination); s.start();
      const mono = (await oc.startRendering()).getChannelData(0);
      const res = await PD.ai.analyse(mono, 22050, () => {}, { voc: 'ext', fast: 1 });
      const known = (PD.curriculum.rhythms() || []).concat(PD.curriculum.commonRhythms() || []);
      const run = on => { const mt = PD.aimus.metre(res.beats, on.env, on.dt, on.t0off, res.chords); const R = PD.aimus.rhythm(on, res.beats, mt, known, (PD.RHYTHM_REFS || []).concat(window.__REFS || []));
        return R && { metre: mt.num + '/' + mt.den + (mt.compound ? ' compound' : ''), bpb: mt.beatsPerBar, alts: (mt.alts || []).map(a => a.num + '/' + a.den + ' ' + a.score).join(', '), conf: mt.conf, print: R.print, basis: R.basis, ambig: R.ambig, ref: R.ref, sub: R.sub, cells: R.cells.map(c => c.acc ? 'X' : c.on ? 'x' : c.weak ? '-' : '.').join(''),
          best: R.best ? R.best.id : null, sure: R.sure, top: (R.matches || []).map(m => m.id + ' ' + m.score + (m.geo ? '*' : '') + ' c' + m.contrast + ' a' + m.attack + ' /' + m.perBeat).slice(0, 5), geo: (R.geo || []).map(m => m.id + ' ' + m.score) }; };
      const mix = run(PD.aimus.onsets(mono, 22050)), perc = run(await PD.aimus.percOnsets(mono, 22050));
      return { dur: Math.round(buf.duration), bpm: Math.round(res.bpm), beats: res.beats.length, mix, perc };
    }, base + '__file/' + i);
    console.log('\n## ' + path.basename(files[i].f) + (files[i].want ? '   (expected: ' + files[i].want + ')' : ''));
    console.log(JSON.stringify(out, null, 1));
  }
  await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
