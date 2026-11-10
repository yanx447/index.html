/* The rhythm reader on clean, synthetic strumming: three strokes to a beat, accents where the pattern says, any tempo,
   with or without a drum on the beat. Shows what the reader can and cannot tell apart.  node qa/geo-synth.cjs */
const path = require('path'), fs = require('fs'), http = require('http');
const { chromium } = require(path.join(__dirname, '..', 'node_modules', 'playwright'));
const APP = path.join(__dirname, '..', 'dist', 'app');
const T = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = path.join(APP, u.endsWith('/') ? u + 'index.html' : u); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
const CASES = [
  ['acharuli-like accents (2,3), solo, 100 BPM', [.45, 1, 1], 100, false, 'acharuli'],
  ['acharuli-like accents (2,3), solo, 132 BPM', [.45, 1, 1], 132, false, 'acharuli'],
  ['kazbeguri-like accent (1), solo, 132 BPM', [1, .45, .45], 132, false, 'kazbeguri or ambiguous'],
  ['kazbeguri-like accent (1), solo, 100 BPM', [1, .45, .45], 100, false, '(near the Bani-Acharuli reference)'],
  ['even strokes + drum on the beat, 100 BPM', [.7, .7, .7], 100, true, '(the teacher recording’s situation)'],
  ['even strokes + drum on the beat, 140 BPM', [.7, .7, .7], 140, true, 'ambiguous']
];
(async () => {
  await new Promise(r => srv.listen(0, r));
  const b = await chromium.launch(), p = await (await b.newContext()).newPage();
  p.on('pageerror', e => console.log('PAGE ERROR', e.message));
  await p.addInitScript(() => { localStorage.setItem('pd2:lang', '"ka"'); localStorage.setItem('pd2:language.chosen', 'true'); localStorage.setItem('pd2:onboarded', 'true'); });
  await p.goto('http://127.0.0.1:' + srv.address().port + '/index.html'); await p.waitForTimeout(1500);
  for (const [label, acc, bpm, drum, want] of CASES) {
    const r = await p.evaluate(async ([acc, bpm, drum]) => {
      const sr = 22050, dur = 60, oc = new OfflineAudioContext(1, sr * dur, sr), beat = 60 / bpm;
      // a strum: three plucked strings (A·C♯·E chord tones) with a noisy attack; an accent is louder and brighter
      const pluck = (t, g) => { [220, 277.2, 329.6].forEach((f, i) => { const o = oc.createOscillator(), e = oc.createGain(), lp = oc.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = f; lp.frequency.value = 1500 + 2500 * g;
        e.gain.setValueAtTime(0, t + i * .006); e.gain.linearRampToValueAtTime(.18 * g, t + i * .006 + .004); e.gain.exponentialRampToValueAtTime(.001, t + .28); o.connect(lp).connect(e).connect(oc.destination); o.start(t); o.stop(t + .3); }); };
      const kick = t => { const o = oc.createOscillator(), e = oc.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + .12); e.gain.setValueAtTime(.9, t); e.gain.exponentialRampToValueAtTime(.001, t + .2); o.connect(e).connect(oc.destination); o.start(t); o.stop(t + .22); };
      for (let k = 0, t = .3; t < dur - 1; k++, t = .3 + k * beat) { for (let j = 0; j < 3; j++) pluck(t + j * beat / 3 + (Math.random() - .5) * .006, acc[j]); if (drum) kick(t); }
      const mono = (await oc.startRendering()).getChannelData(0);
      const res = await PD.ai.analyse(mono, sr, () => {}, { voc: 'ext', fast: 1 });
      const known = (PD.curriculum.rhythms() || []).concat(PD.curriculum.commonRhythms() || []);
      const on = PD.aimus.onsets(mono, sr), mt = PD.aimus.metre(res.beats, on.env, on.dt, on.t0off, res.chords), R = PD.aimus.rhythm(on, res.beats, mt, known, PD.RHYTHM_REFS || []);
      return { bpm: Math.round(res.bpm), metre: mt.num + '/' + mt.den, best: R && R.best && R.best.id, sure: R && R.sure, basis: R && R.basis, ambig: R && R.ambig && R.ambig.map(a => a.id).join('|'), ref: R && R.ref && R.ref.sim, top: R && R.matches.slice(0, 3).map(m => m.id + ' ' + m.score).join(', ') };
    }, [acc, bpm, drum]);
    console.log(label.padEnd(46), JSON.stringify(r), ' expected:', want);
  }
  await b.close(); srv.close();
})();
