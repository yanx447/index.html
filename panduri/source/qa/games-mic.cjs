// Games, end to end through the real listening: the teacher's recorded fanduri notes and chords (media/strings) are laid
// out on a timeline, written to a WAV and fed to Chromium's fake microphone; the app's own detector (AudioWorklet YIN +
// onset) hears them, and the game judges what it heard. Nothing here touches the matching code — it only places sounds.
//   node qa/games-mic.cjs            (APP_DIR=dist/app by default; needs the built app)
// What is checked:
//   1. Note Rush level 1: 24 notes, one left out and one played wrong → the missing one is a miss, the wrong one a miss
//      with its reason, (almost) all others hits; the round is saved, with a practice session for the app's XP and streak.
//   2. Rhythm Battle, kazbeguri at 60 BPM: 24 strokes with ±20 ms of human jitter, accents louder, one stroke left out and
//      one extra stroke between two → one miss, the extra counted, accents mostly recognised.
//   3. Silence and 4. background noise: no note is ever heard as played, nothing counts as a wrong note.
//   5. The tuning check reads the settled pitch of each open string, as a tuner does.
//   6. Play-along timing: strokes placed 40 ms after the clicks are measured so (less the output latency).
//   7. Microphone refused: the game says why and does not start.
// A synthetic test is not a test on a real instrument in a room: it shows the chain works, not how well it hears a phone.
const fs = require('fs'), os = require('os'), path = require('path'), assert = require('assert/strict');
const { chromium } = require('playwright');
const http = require('http');
const DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '../dist/app'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'games-mic-'));
// getUserMedia needs a secure page: 127.0.0.1 is one, so the built app is served here by a tiny static server
let APP = '';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2' };
const server = http.createServer((q, r) => { const u = decodeURIComponent(new URL(q.url, 'http://x').pathname), f = path.resolve(DIR, '.' + u + (u.endsWith('/') ? 'index.html' : '')); if (!f.startsWith(DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); });
const P0 = 1.0, S0 = 3.0;   // the priming stroke at 1.0 s of the file; song time 0 at 3.0 s
let failed = 0; const results = [];
const step = async (name, fn) => { try { const r = await fn(); results.push([name, 'ok', r]); console.log('✓ ' + name + (r ? '  ' + JSON.stringify(r) : '')); } catch (e) { failed++; results.push([name, 'FAIL', String(e.message || e)]); console.log('✗ ' + name + '\n    ' + String(e.message || e).slice(0, 600)); } };

async function boot(b, opts) {
  const ctx = await b.newContext(Object.assign({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' }, opts || {}));
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load|net::|404|ERR_|fonts/.test(m.text())) errs.push(m.text().slice(0, 200)); });
  await p.route(u => !u.href.startsWith(APP), r => r.abort());
  await p.goto(APP); await p.waitForFunction(() => window.PD && PD.app && PD.games, null, { timeout: 30000 });
  await p.evaluate(() => { PD.i18n.set('ka'); PD.store.set('onboarded', true); PD.store.set('intro.done', true); PD.store.set('micExplained', true); PD.store.set('gm.calAsked', true); PD.store.set('gm.metro', false); document.querySelectorAll('.ob,.ag,.intro,.cine,.cine-boot').forEach(o => o.remove()); });
  return { ctx, p, errs };
}

/* ---------- 1. the test sounds, made in a browser from the app's own recordings ---------- */
async function makeWavs(b) {
  const { p } = await boot(b);
  return p.evaluate(async ([P0, S0]) => {
    const G = PD.gameCore, SR = 48000, cache = {};
    const dec = async f => {
      if (cache[f]) return cache[f];
      const ab = await (await fetch('media/strings/' + f)).arrayBuffer(), c = new OfflineAudioContext(1, 1, SR), b = await c.decodeAudioData(ab), d = b.getChannelData(0);
      let pk = 0; for (const v of d) pk = Math.max(pk, Math.abs(v)); let at = 0; while (at < d.length && Math.abs(d[at]) < pk * .12) at++;
      return (cache[f] = Float32Array.from(d.subarray(Math.max(0, at - 24)), v => v / (pk || 1)));   // the attack at sample 24 (0.5 ms)
    };
    const note = (s, f) => 's' + s + '-' + String(f).padStart(2, '0') + '.mp3';
    function render(len, events) {   // events: [{ at (s), buf, gain, s (string: a new note cuts the last one on its string) }]
      const out = new Float32Array(Math.ceil(len * SR)), lastOn = {};
      events.sort((a, b) => a.at - b.at).forEach((e, i) => { e.end = Math.ceil(len * SR); const nx = events.slice(i + 1).find(q => q.s != null && q.s === e.s); if (nx) e.end = Math.round(nx.at * SR); });
      events.forEach(e => { const st = Math.round(e.at * SR); for (let i = 0; i < e.buf.length && st + i < e.end; i++) { const fade = Math.min(1, (e.end - st - i) / 720); out[st + i] += e.buf[i] * e.gain * fade; } });
      let pk = 0; for (const v of out) pk = Math.max(pk, Math.abs(v)); const k = pk > .9 ? .9 / pk : 1;
      const buf = new ArrayBuffer(44 + out.length * 2), dv = new DataView(buf), w = (o, s) => [...s].forEach((c, i) => dv.setUint8(o + i, c.charCodeAt(0)));
      w(0, 'RIFF'); dv.setUint32(4, 36 + out.length * 2, true); w(8, 'WAVEfmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, SR, true); dv.setUint32(28, SR * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); w(36, 'data'); dv.setUint32(40, out.length * 2, true);
      out.forEach((v, i) => dv.setInt16(44 + i * 2, Math.max(-32767, Math.min(32767, Math.round(v * k * 32767))), true));
      let bin = ''; const u = new Uint8Array(buf); for (let i = 0; i < u.length; i += 32768) bin += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(bin);
    }
    const jit = i => ((i * 7919) % 41 - 20) / 1000;   // ±20 ms, the same every run
    // Note Rush, level 1 (normal): note 5 left out, note 9 played one fret off
    const R = G.rushChart(1, 'normal'), rushEv = [{ at: P0, buf: await dec(note(3, 0)), gain: .6, s: 3 }], wrong = 9, gap = 5, rushJit = R.chart.map(n => Math.round(jit(n.i) * .6 * 1000));
    for (const n of R.chart) {
      if (n.i === gap) continue;
      const s = n.s, f = n.i === wrong ? 1 : n.f;   // fret 1 instead of the open string: one semitone up, confidently
      rushEv.push({ at: S0 + n.t + jit(n.i) * .6, buf: await dec(note(s, f)), gain: .55, s });
    }
    // Rhythm Battle, kazbeguri at 60 BPM: accents louder; stroke 7 left out; one extra stroke after stroke 10
    const RH = PD.curriculum.rhythms().find(r => r.id === 'kazbeguri'), C = G.rhythmChart(RH, 60), chords = [await dec('chord-0-0-0-down-1.mp3'), await dec('chord-0-0-0-down-2.mp3'), await dec('chord-0-0-0-down-3.mp3')];
    const rhEv = [{ at: P0, buf: chords[0], gain: .5, s: 1 }];
    C.chart.forEach(x => { if (x.i === 7) return; rhEv.push({ at: S0 + x.t + jit(x.i), buf: chords[x.i % 3], gain: x.acc ? 1 : .32, s: 1 }); });
    rhEv.push({ at: S0 + C.chart[10].t + .5, buf: chords[1], gain: .32, s: 1 });
    // silence (a faint hiss) and noise (a room: broadband noise at a speaking level)
    const len = 14, hiss = new Float32Array(len * SR), noise = new Float32Array(len * SR); let b0 = 0, b1 = 0, b2 = 0, seed = 12345;
    const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff * 2 - 1; };
    for (let i = 0; i < hiss.length; i++) { hiss[i] = rnd() * .0015; const wv = rnd(); b0 = .99765 * b0 + wv * .099046; b1 = .963 * b1 + wv * .2965164; b2 = .57 * b2 + wv * 1.0526913; noise[i] = (b0 + b1 + b2 + wv * .1848) * .05 * (1 + .5 * Math.sin(i / SR * 2.1)); }
    // the tuning check: the three open strings, one after another
    const tuneEv = [1, 2, 3].map((s, k) => ({ at: 1 + k * 1.6, buf: null, s, gain: .6 }));
    for (const e of tuneEv) e.buf = await dec(note(e.s, 0));
    // play-along timing: 4 count-in clicks, then 8 strokes each 40 ms after its click (clicks at 3.0 s + k · 0.75 s)
    const offEv = [{ at: P0, buf: chords[0], gain: .5, s: 1 }]; for (let k = 4; k < 12; k++) offEv.push({ at: S0 + k * .75 + .04, buf: chords[k % 3], gain: .6, s: 1 });
    return {
      tune: render(6.5, tuneEv), offset: render(S0 + 12 * .75 + 1.5, offEv),
      rush: render(S0 + R.len + 2.5, rushEv), rhythm: render(S0 + C.len + 2, rhEv),
      silence: render(len, [{ at: 0, buf: hiss, gain: 1 }]), noise: render(len, [{ at: 0, buf: noise, gain: 1 }]),
      meta: { rush: { n: R.chart.length, len: R.len, wrong, gap, jit: rushJit }, rhythm: { n: C.chart.length, len: C.len, jit: C.chart.map(x => Math.round(jit(x.i) * 1000)), gap: 7 } }
    };
  }, [P0, S0]);
}

/* ---------- 2. one round through the fake microphone ---------- */
async function round(wavPath, g, l, d, maxSec) {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + wavPath + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
  try {
    const { p, errs } = await boot(b, { permissions: ['microphone'] });
    const out = await p.evaluate(async ([g, l, d, P0, S0, maxSec]) => {
      const ev = { notes: [], onsets: [] }; let A1 = null;
      PD.detector.on('onset', m => { if (A1 == null) A1 = m.t; ev.onsets.push(+m.t.toFixed(3)); });
      PD.detector.on('note', m => ev.notes.push([+m.t.toFixed(3), m.midi ? +m.midi.toFixed(2) : null, +(m.conf || 0).toFixed(2)]));
      PD.audio.ensure();
      const api = PD.games.play(g, { l, d, opts: {} });
      const S = api.S, t0 = performance.now();
      // song time 0 is 2 s after the priming stroke: align the game's clock with the file (lag + offset as the game applies them)
      while (performance.now() - t0 < 9000 && !(A1 != null && (api.state === 'playing' || api.state === 'countdown') && S.clock)) await new Promise(r => setTimeout(r, 20));
      if (A1 == null) return { error: 'no priming onset heard', state: api.state, ev };
      while (api.state !== 'playing' && performance.now() - t0 < 12000) await new Promise(r => setTimeout(r, 20));
      S.clock.reset(); S.clock.run(0, A1 + (S0 - P0) - S.lag - S.off);
      while (api.state === 'playing' && performance.now() - t0 < maxSec * 1000) await new Promise(r => setTimeout(r, 100));
      const s = S.sc.s, panel = document.querySelector('.gm-stage .gm-panel');
      const best = PD.store.get('games.best', null), ses = PD.lessons.progress.sessions().filter(x => String(x.id).startsWith('game:'));
      const r = { state: api.state, score: s.score, perfect: s.perfect, great: s.great, good: s.good, miss: s.miss, wrong: s.wrong, unsure: s.unsure, extra: s.extra, maxCombo: s.maxCombo, accN: s.acc.n, accOk: s.acc.ok,
        offs: s.offs.map(o => Math.round(o * 1000)), panel: panel ? panel.innerText.replace(/\s+/g, ' ').slice(0, 300) : null, saved: best && best.map ? Object.keys(best.map) : [], sessions: ses.map(x => x.id), lag: Math.round(S.lag * 1000),
        per: S.mode && S.mode.test ? S.mode.test() : [], notesHeard: ev.notes.length, onsets: ev.onsets.length };
      api.exit();
      return r;
    }, [g, l, d, P0, S0, maxSec]);
    return Object.assign(out, { errs });
  } finally { await b.close(); }
}

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r)); APP = 'http://127.0.0.1:' + server.address().port + '/';
  const b = await chromium.launch(); let W;
  try { W = await makeWavs(b); } finally { await b.close(); }
  const file = (k) => { const f = path.join(TMP, k + '.wav'); fs.writeFileSync(f, Buffer.from(W[k], 'base64')); return f; };
  const M = W.meta;
  console.log('test sounds in ' + TMP + ' · Note Rush ' + M.rush.n + ' notes · Rhythm Battle ' + M.rhythm.n + ' strokes');

  await step('Note Rush level 1 through the microphone: hits, the missing note, the wrong note, saved', async () => {
    const r = await round(file('rush'), 'rush', 1, 'normal', M.rush.len + 8);
    assert.equal(r.errs.length, 0, 'page errors: ' + r.errs.join(' | '));
    assert.ok(!r.error, r.error);
    const hits = r.perfect + r.great + r.good;
    assert.ok(r.state === 'completed' || r.state === 'failed', 'round ended: ' + r.state);
    assert.ok(hits >= M.rush.n - 4, 'hits ' + hits + ' of ' + (M.rush.n - 2) + ' played right (offsets ms: ' + r.offs.join(',') + ')');
    assert.ok(r.miss >= 2 && r.miss <= 4, 'misses ' + r.miss + ' (the gap and the wrong note, at most two more)');
    assert.ok(r.wrong >= 1, 'the wrong note was heard as wrong');
    assert.ok(r.saved.includes('rush:1:normal'), 'saved: ' + r.saved);
    assert.ok(r.sessions.includes('game:rush:1'), 'a practice session for XP and the streak');
    assert.equal(r.per[M.rush.gap][0], 'miss', 'the note left out is the miss'); assert.equal(r.per[M.rush.wrong][0], 'miss', 'the wrong note is a miss');
    const err = r.per.map((x, i) => x[1] == null ? null : x[1] - M.rush.jit[i]).filter(x => x != null), abs = err.map(Math.abs).sort((a, b) => a - b);
    assert.ok(abs[Math.floor(abs.length * .9)] <= 15, 'timing error vs the timing put in, 90th percentile ≤ 15 ms: ' + err.join(','));
    const byString = [1, 2, 3].map(st => r.per.filter(x => x[3] === st && x[2] != null).map(x => x[2] + '¢/' + x[0]).join(' ')); console.log('    cents by string A | C♯ | E: ' + byString.join(' | '));
    return { hits, miss: r.miss, wrong: r.wrong, unsure: r.unsure, extra: r.extra, maxCombo: r.maxCombo, timingErrMs: { median: abs[abs.length >> 1], p90: abs[Math.floor(abs.length * .9)], max: abs[abs.length - 1] }, lagMs: r.lag, panel: r.panel && r.panel.slice(0, 90) };
  });
  await step('Rhythm Battle kazbeguri 60 BPM: strokes, jitter, the missing stroke, the extra one, accents', async () => {
    const r = await round(file('rhythm'), 'rhythm', 'kazbeguri', 'easy', M.rhythm.len + 8);
    assert.equal(r.errs.length, 0, 'page errors: ' + r.errs.join(' | '));
    assert.ok(!r.error, r.error);
    const hits = r.perfect + r.great + r.good;
    assert.ok(hits >= M.rhythm.n - 3, 'hits ' + hits + ' of ' + (M.rhythm.n - 1) + ' (offsets ms: ' + r.offs.join(',') + ') state ' + r.state + ' onsets ' + r.onsets + ' notes ' + r.notesHeard + ' extra ' + r.extra + ' miss ' + r.miss);
    assert.ok(r.miss >= 1 && r.miss <= 3, 'misses ' + r.miss);
    assert.ok(r.extra >= 1 && r.extra <= 3, 'the one extra stroke counted, the later strings of each strum not: ' + r.extra);
    assert.equal(r.per[M.rhythm.gap][0], 'miss', 'the stroke left out is the miss');
    assert.ok(r.accN >= 15 && r.accOk / r.accN >= .7, 'accents recognised ' + r.accOk + '/' + r.accN);
    const err = r.per.map((x, i) => x[1] == null ? null : x[1] - M.rhythm.jit[i]).filter(x => x != null), abs = err.map(Math.abs).sort((a, b) => a - b);
    assert.ok(abs[Math.floor(abs.length * .9)] <= 15, 'timing error vs the timing put in, 90th percentile ≤ 15 ms: ' + err.join(','));
    return { hits, miss: r.miss, extra: r.extra, accents: r.accOk + '/' + r.accN, timingErrMs: { median: abs[abs.length >> 1], p90: abs[Math.floor(abs.length * .9)], max: abs[abs.length - 1] } };
  });
  for (const k of ['silence', 'noise']) await step(k + ': nothing is heard as a played note, nothing counts as a wrong note', async () => {
    const r = await round(file(k), 'rush', 1, 'easy', 13);
    assert.equal(r.errs.length, 0, 'page errors: ' + r.errs.join(' | '));
    if (r.error) return { note: 'no onset in the file (as expected for ' + k + '): ' + r.error, notesHeard: r.ev ? r.ev.notes.length : 0 };
    const hits = r.perfect + r.great + r.good; assert.equal(hits, 0, 'hits from ' + k); assert.equal(r.wrong, 0, 'wrong notes from ' + k);
    return { hits, wrong: r.wrong, notesHeard: r.notesHeard };
  });
  await step('tuning check: each open string within 7 cents of an independent measurement of the recording', async () => {
    const b2 = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + file('tune') + '%noloop'] });
    try {
      const { p, errs } = await boot(b2, { permissions: ['microphone'] });
      await p.evaluate(() => { PD.audio.ensure(); PD.games.tuneCheck(); });
      await p.waitForTimeout(7500);
      const rows = await p.$$eval('.sheet .gm-li', els => els.map(e => e.innerText.replace(/\s+/g, ' ')));
      await p.evaluate(() => document.querySelector('.sheet .btn.primary').click()); await p.waitForTimeout(400);
      const mic = await p.evaluate(() => PD.detector.active);
      // reference: the recordings' own settled pitch, 0.25–0.9 s after the attack, by a 0.5 s normalised autocorrelation
      // (McLeod NSDF) at 48 kHz — A +8 ¢, C♯ −5 ¢, E +14 ¢ against A4 = 440 Hz. The recordings are not perfectly in tune.
      const REF = [8, -5, 14];
      assert.equal(rows.length, 3); rows.forEach((r, i) => { const m = /([+-]\d+)¢/.exec(r); assert.ok(m, 'string ' + (i + 1) + ' read: ' + r); assert.ok(Math.abs(+m[1] - REF[i]) <= 7, 'string ' + (i + 1) + ': ' + m[1] + '¢ vs ' + REF[i] + '¢ measured'); });
      assert.equal(mic, false, 'the sheet let the microphone go'); assert.equal(errs.length, 0, errs.join(' | '));
      return { rows };
    } finally { await b2.close(); }
  });
  await step('play-along timing: strokes 40 ms after the clicks are measured as late by 40 ms (less the output latency)', async () => {
    const b2 = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + file('offset') + '%noloop', '--autoplay-policy=no-user-gesture-required'] });
    try {
      const { p, errs } = await boot(b2, { permissions: ['microphone'] });
      const r = await p.evaluate(async ([P0, S0]) => {
        let A1 = null; PD.detector.on('onset', m => { if (A1 == null) A1 = m.t; });
        PD.audio.ensure(); await PD.detector.start();
        const t0 = performance.now(); while (A1 == null && performance.now() - t0 < 6000) await new Promise(r => setTimeout(r, 20));
        if (A1 == null) return { error: 'no priming onset' };
        // the first click where the file expects it: 2 s after the priming stroke (clicks are judged as heard, so lag is added)
        const res = await PD.gameAudio.offsetTest({ n: 8, bpm: 80, t0: A1 + (S0 - P0) });
        return Object.assign(res, { lag: Math.round(PD.gameAudio.lag() * 1000) });
      }, [P0, S0]);
      assert.ok(!r.error, r.error); assert.ok(r.ok, 'measured: ' + JSON.stringify(r)); assert.ok(r.hits >= 7, 'strokes ' + r.hits);
      assert.ok(Math.abs(r.ms - (40 - r.lag)) <= 12, 'offset ' + r.ms + ' ms, expected ' + (40 - r.lag)); assert.equal(errs.length, 0, errs.join(' | '));
      return r;
    } finally { await b2.close(); }
  });
  await step('microphone refused: the game says why and does not start', async () => {
    const b2 = await chromium.launch({ args: ['--use-fake-device-for-media-stream'] });
    try {
      const { p, errs } = await boot(b2);
      await p.context().clearPermissions();
      await p.evaluate(() => { PD.audio.ensure(); PD.games.play('rush', { l: 1, d: 'normal', opts: {} }); });
      await p.waitForSelector('.gm-stage .gm-panel', { timeout: 15000 });
      const r = await p.evaluate(() => ({ state: PD.games.current.state, text: document.querySelector('.gm-stage .gm-panel').innerText.replace(/\s+/g, ' '), mic: PD.detector.active }));
      assert.equal(r.mic, false); assert.equal(r.state, 'idle', 'no countdown, no play: ' + r.state); assert.ok(/მიკროფონ/.test(r.text), r.text);
      assert.equal(errs.length, 0, errs.join(' | '));
      return { state: r.state, text: r.text.slice(0, 120) };
    } finally { await b2.close(); }
  });
  console.log(failed ? failed + ' failed' : 'all passed');
  server.close(); process.exitCode = failed ? 1 : 0;
})();
