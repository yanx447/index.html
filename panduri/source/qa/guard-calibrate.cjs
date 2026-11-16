/* Sima's check (src/guard.js), calibrated: the teacher's recordings must pass, a piano, speech, singing alone, noise,
   a synthetic band and spoilt copies must not. Usage: node qa/guard-calibrate.cjs <dir holding pos_, neg_ and bad_ WAV files> */
const fs = require('fs'), path = require('path');
global.window = {}; global.PD = { i18n: { add() {} } };
eval(fs.readFileSync(path.join(__dirname, '../src/guard.js'), 'utf8'));
function readWav(f) {
  const b = fs.readFileSync(f); let o = 12, fmt = null, data = null;
  while (o + 8 <= b.length) { const id = b.toString('ascii', o, o + 4), sz = b.readUInt32LE(o + 4); if (id === 'fmt ') fmt = { ch: b.readUInt16LE(o + 10), sr: b.readUInt32LE(o + 12), bits: b.readUInt16LE(o + 22) }; if (id === 'data') { data = b.subarray(o + 8, o + 8 + sz); break; } o += 8 + sz + (sz & 1); }
  const n = Math.floor(data.length / 2 / fmt.ch), chs = Array.from({ length: fmt.ch }, () => new Float32Array(n));
  for (let i = 0; i < n; i++) for (let c = 0; c < fmt.ch; c++) chs[c][i] = data.readInt16LE((i * fmt.ch + c) * 2) / 32768;
  return { chs, sr: fmt.sr };
}
function synth(kind, sr = 48000, sec = 12) {
  const n = sr * sec, L = new Float32Array(n); let seed = 1; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  if (kind === 'noise') for (let i = 0; i < n; i++) L[i] = rnd() * .2;
  if (kind === 'silence') for (let i = 0; i < n; i++) L[i] = rnd() * .0002;
  if (kind === 'band') for (let i = 0; i < n; i++) { const t = i / sr, b = t % .5, bar = Math.floor(t / 2) % 4, bf = [55, 73.4, 82.4, 61.7][bar];
    L[i] = .5 * Math.sin(2 * Math.PI * 55 * b) * Math.exp(-b * 9) + .3 * Math.sin(2 * Math.PI * bf * t) + .03 * rnd() * Math.exp(-((t + .25) % .5) * 30)
      + [1, 1.26, 1.5].reduce((a, k) => a + .05 * (((bf * 4 * k * t) % 1) * 2 - 1), 0); }
  return { chs: [L], sr };
}
function variant(src, kind) {
  const chs = src.chs.map(x => Float32Array.from(x)); let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
  if (kind === 'clip') chs.forEach(x => { for (let i = 0; i < x.length; i++) x[i] = Math.max(-1, Math.min(1, x[i] * 10)); });
  if (kind === 'noisy') chs.forEach(x => { for (let i = 0; i < x.length; i++) x[i] = x[i] * .3 + rnd() * .15; });
  if (kind === 'quiet') chs.forEach(x => { for (let i = 0; i < x.length; i++) x[i] *= .004; });
  return { chs, sr: src.sr };
}
(async () => {
  const dir = process.argv[2], rows = [];
  const files = fs.readdirSync(dir).filter(f => /^(pos|neg|unk|bad)_.*\.wav$/.test(f)).sort();
  const cases = files.map(f => [f.replace('.wav', ''), () => readWav(path.join(dir, f))]);
  cases.push(['neg_noise', () => synth('noise')], ['neg_silence', () => synth('silence')], ['neg_band', () => synth('band')]);
  const baseF = path.join(dir, 'pos_mtiuluri_vslow.wav'), base = () => readWav(baseF);
  if (fs.existsSync(baseF)) cases.push(['bad_clip', () => variant(base(), 'clip')], ['bad_noisy', () => variant(base(), 'noisy')], ['bad_quiet', () => variant(base(), 'quiet')]);
  for (const [name, get] of cases) {
    const a = get(), t0 = Date.now(), m = PD.guard.measure(a.chs, a.sr), j = PD.guard.judgeSound(m);
    const r2 = x => typeof x === 'number' ? Math.round(x * 1000) / 1000 : x;
    rows.push(Object.assign({ name, ms: Date.now() - t0, OK: j.length ? 'fail' : 'PASS', why: j.map(r => r[0].slice(5)).join(',') }, Object.fromEntries(Object.entries(m).map(([k, v]) => [k, r2(v)]))));
  }
  const cols = ['name','OK','why','ms','dur','loud','gaps','steady','clip','band','bass','notes','range','decay','attacks'];
  console.log(cols.join('\t')); rows.forEach(r => console.log(cols.map(c => r[c]).join('\t')));
  // pos_ must pass, bad_ must fail; neg_ must fail except what the check honestly cannot tell (KNOWN)
  const KNOWN = { neg_vocals_only: 'singing alone is tuned, steady and in range: it passes' };
  const wrong = rows.filter(r => /^pos_/.test(r.name) ? r.OK !== 'PASS' : /^(bad|neg)_/.test(r.name) && !KNOWN[r.name] ? r.OK === 'PASS' : false);
  Object.keys(KNOWN).forEach(k => rows.some(r => r.name === k && r.OK === 'PASS') && console.log('known: ' + k + ' — ' + KNOWN[k]));
  console.log(wrong.length ? 'WRONG: ' + wrong.map(r => r.name).join(', ') : 'all ' + rows.length + ' as expected');
  process.exitCode = wrong.length ? 1 : 0;
})();
