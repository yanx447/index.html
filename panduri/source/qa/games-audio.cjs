// Games: how well the listening works, measured. The teacher's recorded notes and strums go through the virtual fanduri
// (qa/vpanduri.cjs) into the real detector (AudioWorklet YIN + onset) and the games' own rules (gamecore.js).
//   node qa/games-audio.cjs          (APP_DIR=dist/app; JSON=file keeps the numbers)
// Each scenario prints what was played, what was heard and whether that meets the rule it is checked against.
// A virtual microphone is not a room or a phone: these numbers are the chain's, not a real device's.
const path = require('path'), fs = require('fs'), assert = require('assert/strict');
const { chromium } = require('playwright');
const VP = require('./vpanduri.cjs');
const DIR = path.resolve(process.env.APP_DIR || path.join(__dirname, '../dist/app'));
let failed = 0; const OUT = {};
const step = async (name, fn) => { try { const r = await fn(); OUT[name] = r; console.log('✓ ' + name + (r ? '\n    ' + JSON.stringify(r) : '')); } catch (e) { failed++; OUT[name] = { error: String(e.message || e) }; console.log('✗ ' + name + '\n    ' + String(e.message || e).slice(0, 900)); } };

/* in the page: play a list of events, collect the detector's reports */
function lab() {
  const VP = window.__vp;
  /** ev: [{ at (s from now), s, f, gain } | { at, strum: frets, dir, gain } | { at, noise: level, dur } | { at, clap: gain }] → reports */
  VP.run = async (ev, tail) => {
    const out = { notes: [], onsets: [], inputs: [] }, offs = [PD.detector.on('note', m => out.notes.push({ t: m.t, midi: m.midi, conf: m.conf, unsure: !!m.unsure })), PD.detector.on('onset', m => out.onsets.push({ t: m.t, s: m.strength })), PD.detector.on('input', m => out.inputs.push(m.kind))];
    const T0 = VP.ctx.currentTime + .3;
    for (const e of ev) {
      const at = T0 + e.at;
      if (e.noise != null) VP.noise(e.noise, at, e.dur);
      else if (e.clap != null) { const c = VP.ctx, n = Math.round(c.sampleRate * .03), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * .004)); const s = c.createBufferSource(), g = c.createGain(); s.buffer = b; g.gain.value = e.clap; s.connect(g); g.connect(VP.bus); s.start(at); }
      else if (e.strum) VP.strum(e.strum, e.dir || 'down', at, e.gain);
      else VP.note(e.s, e.f, at, e.gain == null ? .55 : e.gain);
      e.abs = at;
    }
    const end = Math.max(...ev.map(e => e.at + (e.dur || 0))) + (tail || 1.2);
    await new Promise(r => setTimeout(r, end * 1000 + 400));
    offs.forEach(f => f()); VP.stopAll();
    return { out, ev: ev.map(e => Object.assign({}, e)) };
  };
}

async function page(b, url) {
  const o = await VP.open(b, url, { lang: 'en' });
  await o.p.evaluate(lab);
  const lat = await o.p.evaluate(async () => { PD.audio.ensure(); await PD.detector.start(); const pos = []; for (let s = 1; s <= 3; s++) for (let f = 0; f <= 17; f++) pos.push({ s, f }); await __vp.load(pos, []); return __vp.calibrate(); });
  return Object.assign(o, { lat });
}
const midiOf = (s, f) => [57, 61, 64][s - 1] + f;
const near = (list, at, w) => list.filter(x => x.t - at > -.03 && x.t - at < (w || .12));

(async () => {
  const { server, url } = await VP.serve(DIR), b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const { p, errs, lat } = await page(b, url);
  console.log('virtual path latency ' + lat + ' ms (calibrated as the app does)');
  const G = (ev, tail) => p.evaluate(([ev, tail]) => __vp.run(ev, tail), [ev, tail]);

  await step('pitch and octave: every string, every fret 0–17 (54 notes)', async () => {
    const ev = []; let k = 0; for (let s = 1; s <= 3; s++) for (let f = 0; f <= 17; f++) ev.push({ at: k++ * .7, s, f, gain: .55 });
    const { out, ev: E } = await G(ev);
    // what each recording really sounds at (its sample's own measured pitch), and what each difficulty would accept
    const meta = await p.evaluate(() => { const m = {}; for (let s = 1; s <= 3; s++) PD.SOUNDS.strings[s].forEach(x => { m[s + ':' + x.f] = x.hz || null; }); return { m, D: PD.gameCore.DIFFS.map(d => [d, PD.gameCore.diff(d).cents, PD.gameCore.diff(d).sharp]) }; });
    /* Two different questions: did the detector hear what the recording sounds (its sample's own measured pitch), and does
       the game accept the note as the one asked for (equal temperament ± the difficulty's tolerance)? The teacher's
       recordings are not all in tune (his A string reads up to +58 ¢ high on the neck), so the second can fail where the
       first does not. */
    let ok = 0, oct = 0, wrong = 0, uns = 0, none = 0; const cents = [], lats = [], vsRec = [], heard = [], bad = [], intonation = [];
    E.forEach(e => {
      const n = near(out.notes, e.abs, .15)[0], hz = meta.m[e.s + ':' + e.f], rec = hz ? 69 + 12 * Math.log2(hz / 440) : midiOf(e.s, e.f), tag = 's' + e.s + 'f' + e.f;
      intonation.push(Math.round((rec - midiOf(e.s, e.f)) * 100));
      if (!n) { none++; bad.push(tag + ':none'); return; } if (n.unsure) { uns++; bad.push(tag + ':unsure ' + n.conf.toFixed(2)); return; }
      heard.push({ e, n }); const d = n.midi - rec;
      if (Math.abs(d) < .5) { ok++; vsRec.push(Math.round(d * 100)); cents.push(Math.round((n.midi - midiOf(e.s, e.f)) * 100)); lats.push(Math.round((n.t - e.abs) * 1000)); }
      else if (Math.abs(Math.abs(d) - 12) < .5) { oct++; bad.push(tag + ':octave' + (d > 0 ? '+' : '-') + ' conf ' + n.conf.toFixed(2)); } else { wrong++; bad.push(tag + ':' + (d * 100).toFixed(0) + '¢ conf ' + n.conf.toFixed(2)); }
    });
    cents.sort((a, b) => a - b); lats.sort((a, b) => a - b); const absRec = vsRec.map(Math.abs).sort((a, b) => a - b), into = intonation.slice().sort((a, b) => a - b);
    // the games' own rule (gameCore.sharpAt: the sharp side grows with the fret); and the same after the open strings were
    // tuned (each string's recorded open-string offset taken off — what the tuning check asks of a learner)
    const open = { 1: intonation[0], 2: intonation[18], 3: intonation[36] };
    const acc = await p.evaluate(([hs, open]) => { const G = PD.gameCore, out = {}; G.DIFFS.forEach(d => { const D = G.diff(d), ok = sub => hs.filter(x => { const c = x.c - sub(x); return c >= -D.cents && c <= D.cents + G.sharpAt(D, x.f); }).length + '/54'; out[d] = ok(() => 0) + ' · tuned ' + ok(x => open[x.s]); }); return out; }, [heard.map(({ e, n }) => ({ s: e.s, f: e.f, c: (n.midi - midiOf(e.s, e.f)) * 100 })), open]);
    const accept = acc;
    const r = { heardAsRecorded: ok + '/54', octaveErrors: oct, wrongPitch: wrong, unsure: uns, notHeard: none, bad: bad.join(' · '),
      detectorVsRecordingCents: { medianAbs: absRec[absRec.length >> 1], p90Abs: absRec[Math.floor(absRec.length * .9)], maxAbs: absRec[absRec.length - 1] },
      recordingsVsEqualTemperamentCents: { median: into[into.length >> 1], range: [into[0], into[into.length - 1]], over50: intonation.filter(c => Math.abs(c) > 50).length },
      acceptedAsTheRightNote: accept, onsetVsAttackMs: { median: lats[lats.length >> 1], min: lats[0], max: lats[lats.length - 1] } };
    assert.ok(ok >= 52 && oct <= 1 && wrong === 0, JSON.stringify(r)); return r;
  });
  await step('the same note repeated fast: open A at 400 · 300 · 250 · 200 · 150 · 120 ms', async () => {
    const r = {};
    for (const gap of [.4, .3, .25, .2, .15, .12]) { const ev = []; for (let i = 0; i < 8; i++) ev.push({ at: i * gap, s: 1, f: 0, gain: .55 }); const { out, ev: E } = await G(ev, .8); r[Math.round(gap * 1000) + 'ms'] = E.filter(e => near(out.onsets, e.abs, Math.min(.09, gap * .6)).length).length + '/8 onsets, ' + E.filter(e => near(out.notes, e.abs, Math.min(.09, gap * .6)).some(n => !n.unsure && Math.abs(n.midi - 57) < .5)).length + '/8 right notes'; }
    return r;
  });
  await step('three different notes fast: A · C♯ · E (3 strings) at 250 · 180 · 130 ms', async () => {
    const r = {};
    for (const gap of [.25, .18, .13]) { const ev = []; for (let i = 0; i < 9; i++) ev.push({ at: i * gap, s: (i % 3) + 1, f: 0, gain: .55 }); const { out, ev: E } = await G(ev, .8); r[Math.round(gap * 1000) + 'ms'] = E.filter(e => near(out.notes, e.abs, Math.min(.09, gap * .6)).some(n => !n.unsure && Math.abs(n.midi - midiOf(e.s, e.f)) < .5)).length + '/9 right'; }
    return r;
  });
  await step('soft and loud: gain 0.02 · 0.05 · 0.1 · 0.25 · 0.6 · 1.5 (overload)', async () => {
    const r = {};
    for (const g of [.02, .05, .1, .25, .6, 1.5]) { const ev = []; for (let i = 0; i < 6; i++) ev.push({ at: i * .7, s: (i % 3) + 1, f: 2, gain: g }); const { out, ev: E } = await G(ev); r['g' + g] = E.filter(e => near(out.notes, e.abs).some(n => !n.unsure && Math.abs(n.midi - midiOf(e.s, e.f)) < .5)).length + '/6 right · ' + E.filter(e => near(out.notes, e.abs).some(n => n.unsure)).length + ' unsure · inputs ' + [...new Set(out.inputs)].join(',') ; }
    return r;
  });
  await step('a ringing string under new notes: open A left ringing, notes on C♯ and E strings', async () => {
    const ev = [{ at: 0, s: 1, f: 0, gain: .7 }]; [[2, 1], [3, 2], [2, 3], [3, 4], [2, 5], [3, 0]].forEach(([s, f], i) => ev.push({ at: .5 + i * .45, s, f, gain: .45 }));
    const { out, ev: E } = await G(ev); const right = E.slice(1).filter(e => near(out.notes, e.abs).some(n => !n.unsure && Math.abs(n.midi - midiOf(e.s, e.f)) < .5)).length, asA = E.slice(1).filter(e => near(out.notes, e.abs).some(n => !n.unsure && Math.abs(n.midi - 57) < .5)).length;
    const r = { right: right + '/6', heardAsTheRingingA: asA }; assert.ok(right >= 5, JSON.stringify(r)); return r;
  });
  await step('silence and room noise alone (−∞ · −40 · −32 · −26 dBFS): no note may be heard as played', async () => {
    const r = {};
    for (const lv of [0, .1, .25, .5]) { const { out } = await G(lv ? [{ at: 0, noise: lv, dur: 4 }] : [{ at: 0, noise: 0, dur: 4 }], .5); const conf = out.notes.filter(n => !n.unsure && n.conf >= .72); r[lv ? 'noise ' + lv : 'silence'] = out.onsets.length + ' onsets, ' + out.notes.length + ' notes (' + conf.length + ' confident: ' + conf.map(n => n.midi.toFixed(1)).join(' ') + ')'; }
    return r;
  });
  await step('notes in room noise: the right note still heard', async () => {
    const r = {};
    for (const lv of [.1, .25, .5]) { const ev = [{ at: 0, noise: lv, dur: 5 }]; for (let i = 0; i < 6; i++) ev.push({ at: .4 + i * .7, s: (i % 3) + 1, f: 1, gain: .45 }); const { out, ev: E } = await G(ev); r['noise ' + lv] = E.slice(1).filter(e => near(out.notes, e.abs).some(n => !n.unsure && Math.abs(n.midi - midiOf(e.s, e.f)) < .5)).length + '/6 right, ' + E.slice(1).filter(e => near(out.notes, e.abs).some(n => !n.unsure && Math.abs(n.midi - midiOf(e.s, e.f)) >= .5 && n.conf >= .72)).length + ' wrong'; }
    return r;
  });
  await step('claps and knocks: strokes may be heard, never a confident note', async () => {
    const ev = []; for (let i = 0; i < 8; i++) ev.push({ at: i * .5, clap: .6 });
    const { out } = await G(ev); const conf = out.notes.filter(n => !n.unsure && n.conf >= .72);
    const r = { onsets: out.onsets.length + '/8', notes: out.notes.length, confident: conf.map(n => n.midi.toFixed(1) + '@' + n.conf.toFixed(2)) }; return r;
  });
  await step('a soft stroke right after a loud one (acharuli ↓ after ↑>): Dm→Dm and C→Dm', async () => {
    const r = {};
    for (const [name, a, b2] of [['Dm→Dm', [0, 1, 1], [0, 1, 1]], ['C→Dm', [3, 3, 3], [0, 1, 1]], ['B♭→C', [1, 1, 1], [3, 3, 3]]]) {
      const ev = []; for (let k = 0; k < 6; k++) { ev.push({ at: k * .75 + .5, strum: a, dir: 'up', gain: .8, loud: 1 }); ev.push({ at: k * .75 + .75, strum: b2, dir: 'down', gain: .4 }); }
      const { out, ev: E } = await G(ev); r[name] = E.filter(e => !e.loud).filter(e => near(out.onsets, e.abs, .09).length).length + '/6 soft strokes heard';
    }
    return r;
  });
  if (errs.length) console.log('page errors: ' + errs.join(' | '));
  await b.close(); server.close();
  if (process.env.JSON) fs.writeFileSync(process.env.JSON, JSON.stringify(OUT, null, 1));
  console.log(failed ? failed + ' failed' : 'all checks done'); process.exitCode = failed ? 1 : 0;
})();
