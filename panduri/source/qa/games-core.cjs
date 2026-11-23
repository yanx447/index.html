// Games: the rules (src/gamecore.js) checked in Node, on the app's own instrument profile, theory and teacher rhythms.
// node qa/games-core.cjs
const fs = require('fs'), vm = require('vm'), path = require('path'), assert = require('assert/strict');
const SRC = path.join(__dirname, '..', 'src');
function load() {
  const store = {};
  const ctx = {
    console, Math, Date, JSON, Object, Array, Set, Map, Promise, setTimeout, clearTimeout, TextEncoder, TextDecoder, btoa, atob, Uint8Array, Float32Array,
    performance: { now: () => Date.now() },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; }, key: i => Object.keys(store)[i], get length() { return Object.keys(store).length; } },
    navigator: { languages: ['ka'], language: 'ka', userAgent: 'node', hardwareConcurrency: 8 },
    document: { documentElement: { lang: '', dir: '', dataset: {}, classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} } }, getElementById: () => null, querySelectorAll: () => [], querySelector: () => null, addEventListener() {}, createElement: () => ({ setAttribute() {}, appendChild() {}, style: {} }), head: { appendChild() {} } },
    matchMedia: () => ({ matches: false }), addEventListener() {}, devicePixelRatio: 1
  };
  ctx.window = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const n of ['core', 'instrument', 'theory', 'geom', 'songdata', 'sounddata', 'pianodata', 'curriculum', 'lessons', 'gamecore'])
    vm.runInContext(fs.readFileSync(path.join(SRC, n + '.js'), 'utf8'), ctx, { filename: n + '.js' });
  return ctx.PD;
}
const PD = load(), G = PD.gameCore, TH = PD.theory;
let n = 0; const ok = (name, fn) => { fn(); n++; console.log('  ✓ ' + name); };
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
// values made inside the VM have its own Array/Object prototypes: compare their data
const J = x => x === undefined ? x : JSON.parse(JSON.stringify(x)), same = (a, b, m) => assert.deepStrictEqual(J(a), J(b), m), notSame = (a, b, m) => assert.notDeepStrictEqual(J(a), J(b), m);

console.log('pitch');
ok('the instrument is A3 · C♯4 · E4, 17 frets (from the profile)', () => { same([1, 2, 3].map(s => TH.midi(s, 0)), [57, 61, 64]); assert.equal(TH.FRETS, 17); assert.equal(TH.STRINGS, 3); });
ok('in tune, sharp, flat, semitone, octave, unsure', () => {
  assert.equal(G.judgePitch(57, { midi: 57.1, conf: .9 }, 38).ok, true);
  assert.equal(G.judgePitch(57, { midi: 57.38, conf: .9 }, 38).ok, true);
  assert.equal(G.judgePitch(57, { midi: 57.39, conf: .9 }, 38).kind, 'sharp');
  assert.equal(G.judgePitch(57, { midi: 56.5, conf: .9 }, 38).kind, 'flat');
  assert.equal(G.judgePitch(57, { midi: 58, conf: .9 }, 38).kind, 'semitone');
  assert.equal(G.judgePitch(57, { midi: 69, conf: .9 }, 38).kind, 'octave');
  assert.equal(G.judgePitch(57, { midi: 69, conf: .7 }, 38).kind, 'unsure', 'an octave reading needs conf ≥ .8');
  assert.equal(G.judgePitch(57, { midi: 62, conf: .65 }, 38).kind, 'unsure', 'a wrong note needs conf ≥ .72');
  assert.equal(G.judgePitch(57, { midi: 62, conf: .9 }, 38).kind, 'wrong');
  assert.equal(G.judgePitch(57, { midi: 57, conf: .5 }, 38).kind, 'unsure', 'even the right pitch is unsure below .55');
  assert.equal(G.judgePitch(57, { midi: 57, conf: .9, unsure: true }, 38).kind, 'unsure');
});
ok('timing grades; pitch decides right or wrong and caps a note near the edge at Great', () => {
  const D = G.diff('normal');
  assert.equal(G.timingGrade(.05, D), 'perfect'); assert.equal(G.timingGrade(-.0951, D), 'good'); assert.equal(G.timingGrade(.16, D), null);
  assert.equal(G.pitchGrade(19, 38), 'perfect'); assert.equal(G.pitchGrade(-30, 38), 'great'); assert.equal(G.pitchGrade(38, 38), 'good');
  assert.equal(G.worse('perfect', 'good'), 'good'); assert.equal(G.worse('great', 'perfect'), 'great');
  assert.equal(G.gradeOf('perfect', 26, 38), 'perfect', 'the A string read sharp in its attack keeps its Perfect');
  assert.equal(G.gradeOf('perfect', -31, 38), 'great', 'near the edge of the tolerance: at most Great');
  assert.equal(G.gradeOf('good', 2, 38), 'good', 'timing decides the grade of a right note');
  for (const d of G.DIFFS) { const x = G.diff(d); assert.ok(x.perfect < x.great && x.great < x.good && x.good < x.win, d + ' windows nest'); }
});

console.log('Note Rush matching');
const chart = [{ t: 2, midi: 57 }, { t: 3, midi: 61 }, { t: 4, midi: 64 }, { t: 4.5, midi: 57 }];
ok('right notes on time → perfect hits; combo and score grow', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  chart.forEach(c => assert.equal(m.input({ t: c.t + .01, midi: c.midi, conf: .9 }).grade, 'perfect'));
  assert.equal(sc.s.combo, 4); assert.equal(sc.s.score, 400);
  const r = G.result(sc.s, chart.length, D); assert.equal(r.acc, 1); assert.equal(r.stars, 3); assert.equal(r.passed, true);
});
ok('late but inside the window → lower grade; outside → not this note', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  assert.equal(m.input({ t: 2.12, midi: 57, conf: .9 }).grade, 'good');
  const r = m.input({ t: 3.3, midi: 61, conf: .9 }); assert.equal(r.extra, true, '0.30 s late is no longer note 2');
});
ok('a note never played becomes a miss once its window closes; the combo breaks', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  m.input({ t: 2, midi: 57, conf: .9 });
  assert.equal(m.advance(3.2).length, 0, 'not yet');
  const out = m.advance(3.3); assert.equal(out.length, 1); assert.equal(out[0].miss, true); assert.equal(sc.s.combo, 0); assert.equal(sc.s.miss, 1);
});
ok('a stroke near a note holds the miss until its pitch arrives', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  m.onset(2.02);
  assert.equal(m.advance(2.4).length, 0, 'waiting for the pitch of the stroke at 2.02');
  assert.equal(m.input({ t: 2.02, midi: 57, conf: .9 }).grade, 'perfect');
});
ok('unsure readings never count as mistakes and never earn points', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  assert.equal(m.input({ t: 2, midi: 57, conf: .3, unsure: true }).unsure, true);
  m.advance(10);
  assert.equal(m.st[0].res, 'unsure'); assert.equal(sc.s.unsure, 1); assert.equal(sc.s.score, 0);
  const r = G.result(sc.s, chart.length, D); assert.equal(r.judged, 3, 'unsure is left out of accuracy');
});
ok('an unsure reading followed by a clear right one is a hit', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  m.input({ t: 1.95, midi: 57, conf: .4, unsure: true });
  assert.equal(m.input({ t: 2.03, midi: 57, conf: .9 }).grade, 'perfect');
});
ok('a confident wrong pitch is a miss with its reason; a stray note far from any note is only "extra"', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher(chart, D, sc);
  const r = m.input({ t: 2, midi: 58, conf: .95 }); assert.equal(r.miss, true); assert.equal(r.kind, 'semitone'); assert.equal(sc.s.wrong, 1);
  assert.equal(m.input({ t: 6, midi: 50, conf: .95 }).extra, true); assert.equal(sc.s.extra, 1); assert.equal(sc.s.miss, 1, 'extra notes cost nothing');
});
ok('of two notes in reach, the one whose pitch was played is taken', () => {
  const c2 = [{ t: 2, midi: 57 }, { t: 2.2, midi: 64 }], D = G.diff('easy'), sc = G.scorer(), m = G.noteMatcher(c2, D, sc);
  const r = m.input({ t: 2.05, midi: 64, conf: .9 }); assert.equal(r.i, 1);
});
ok('the same pitch on another string counts (the microphone hears pitch, not the string)', () => {
  const D = G.diff('normal'), sc = G.scorer(), m = G.noteMatcher([{ t: 1, midi: TH.midi(2, 0), s: 2, f: 0 }], D, sc);
  assert.equal(TH.midi(1, 4), TH.midi(2, 0));
  assert.equal(m.input({ t: 1, midi: TH.midi(1, 4), conf: .9 }).grade, 'perfect');
});
ok('combo multiplier ×1 ×2 ×3 ×4 at 10, 25, 50', () => {
  same([1, 9, 10, 24, 25, 49, 50, 200].map(G.mult), [1, 1, 2, 2, 3, 3, 4, 4]);
  const sc = G.scorer(); for (let i = 0; i < 10; i++) sc.hit('perfect'); assert.equal(sc.s.score, 9 * 100 + 200);
  sc.miss(); assert.equal(sc.s.combo, 0); assert.equal(sc.s.maxCombo, 10);
});
ok('stars: 90 / 75 / 50 %; most notes unheard → no stars and not failed', () => {
  const s = G.scorer().s; Object.assign(s, { perfect: 8, miss: 2 }); assert.equal(G.result(s, 10).stars, 2);
  Object.assign(s, { perfect: 9, miss: 1 }); assert.equal(G.result(s, 10).stars, 3, 'exactly 90 % is three stars');
  Object.assign(s, { perfect: 10, miss: 0 }); assert.equal(G.result(s, 10).stars, 3);
  Object.assign(s, { perfect: 4, miss: 6 }); const r = G.result(s, 10); assert.equal(r.stars, 0); assert.equal(r.passed, false);
  Object.assign(s, { perfect: 3, miss: 0, unsure: 7 }); const u = G.result(s, 10); assert.equal(u.lowHeard, true); assert.equal(u.stars, 0);
});

console.log('Rhythm Battle matching');
ok('strokes on time; accents judged only once three strokes are known', () => {
  const ch = [0, 1, 2, 3, 4, 5].map(i => ({ t: 1 + i * .5, acc: i % 3 === 0 })), D = G.diff('normal'), sc = G.scorer(), m = G.rhythmMatcher(ch, D, sc);
  const res = ch.map((c, i) => m.input({ t: c.t + .01, strength: c.acc ? .3 : .1 }));
  res.forEach(r => assert.equal(r.grade, 'perfect'));
  assert.equal(res[0].accOk, null); assert.equal(res[2].accOk, null); assert.equal(res[3].accOk, true); assert.equal(res[4].accOk, true);
  assert.equal(sc.s.acc.n, 3); assert.equal(sc.s.acc.ok, 3);
});
ok('a missed stroke, an extra stroke between two', () => {
  const ch = [{ t: 1 }, { t: 2 }, { t: 3 }], D = G.diff('normal'), sc = G.scorer(), m = G.rhythmMatcher(ch, D, sc);
  m.input({ t: 1, strength: .2 }); m.input({ t: 1.5, strength: .2 }); m.input({ t: 3.02, strength: .2 });
  m.advance(5); assert.equal(m.st[1].res, 'miss'); assert.equal(sc.s.extra, 1); assert.equal(sc.s.miss, 1);
});
ok('close strokes keep half the gap each, so a stroke is never stolen by its neighbour', () => {
  const ch = [{ t: 1 }, { t: 1.2 }], D = G.diff('easy'), sc = G.scorer(), m = G.rhythmMatcher(ch, D, sc);
  assert.equal(m.input({ t: 1.0, strength: .2 }).i, 0); assert.equal(m.input({ t: 1.11, strength: .2 }).i, 1, '110 ms later: the second stroke, not the first one again');
});
ok('the later strings of one strum are the same stroke, never an extra one', () => {
  const ch = [{ t: 1 }, { t: 2 }, { t: 3 }], D = G.diff('normal'), sc = G.scorer(), m = G.rhythmMatcher(ch, D, sc);
  assert.equal(m.input({ t: 1.0, strength: .4 }).grade, 'perfect');
  assert.equal(m.input({ t: 1.08, strength: .1 }).same, true, 'the E string 80 ms after the A string');
  assert.equal(m.input({ t: 1.16, strength: .05 }).same, true, 'a slow strum: a third attack');
  assert.equal(m.input({ t: 2.0, strength: .4 }).grade, 'perfect', 'the next written stroke is its own');
  assert.equal(sc.s.extra, 0);
  const fast = [{ t: 1 }, { t: 1.12 }], sc2 = G.scorer(), m2 = G.rhythmMatcher(fast, G.diff('easy'), sc2);
  m2.input({ t: 1, strength: .3 }); assert.equal(m2.input({ t: 1.12, strength: .3 }).i, 1, 'two written strokes 120 ms apart stay two');
});
ok('a stroke held back by the click guard (arrives late) still counts', () => {
  const ch = [{ t: 1 }], D = G.diff('expert'), sc = G.scorer(), m = G.rhythmMatcher(ch, D, sc);
  assert.equal(m.advance(1.25).length, 0, 'no miss 0.25 s after the stroke');
  assert.equal(m.input({ t: 1.01, strength: .2 }).grade, 'perfect');
});

console.log('charts from the instrument');
ok('Note Rush level 1 uses only the open strings A · C♯ · E at 60–75 BPM', () => {
  const c = G.rushChart(1, 'normal'); assert.ok(c.bpm >= 60 && c.bpm <= 75);
  same([...new Set(c.chart.map(x => x.midi))].sort(), [57, 61, 64]);
  c.chart.forEach(x => { assert.equal(x.f, 0); assert.equal(TH.midi(x.s, x.f), x.midi); });
});
ok('every level: playable positions inside its frets, rising times, eighths paired, deterministic', () => {
  for (const L of G.RUSH) for (const d of G.DIFFS) {
    const c = G.rushChart(L.id, d), c2 = G.rushChart(L.id, d);
    same(c.chart, c2.chart, 'same level, same chart');
    assert.equal(c.chart.length, L.n);
    c.chart.forEach((x, i) => {
      assert.ok(x.f >= L.frets[0] && x.f <= L.frets[1] && x.f <= 17 && x.s >= 1 && x.s <= 3, 'L' + L.id + ' position');
      assert.ok(near(TH.midi(x.s, x.f), x.midi), 'pitch from the profile');
      if (L.scale) assert.ok([0, 2, 4, 5, 7, 9, 11].includes(((x.midi - 9) % 12 + 12) % 12), 'A major');
      if (i) assert.ok(x.t > c.chart[i - 1].t, 'times rise');
      if (x.b % 1) assert.ok(c.chart[i - 1] && c.chart[i - 1].d === .5 || c.chart[i - 1].d === 1.5, 'an off-beat note follows an eighth or a dotted quarter');
    });
  }
  notSame(G.rushChart(3, 'normal', 7).chart, G.rushChart(3, 'normal', 8).chart, 'another seed, another chart (arena / daily)');
});
ok('Rhythm Battle keeps the teacher\'s order and accents exactly; count-in 4 beats', () => {
  const R = PD.curriculum.rhythms(); same(R.map(r => r.id), ['kazbeguri', 'mtiuluri', 'khorumi', 'acharuli']);
  const want = { kazbeguri: 'D> U D', mtiuluri: 'D> D U> D U', khorumi: 'D> D U D D> D U', acharuli: 'D D> U>' };
  R.forEach(r => {
    const c = G.rhythmChart(r, 85), per = r.strokes.length;
    assert.equal(c.chart[0].t, +(4 * 60 / 85).toFixed(4));
    const cyc = c.chart.slice(0, per).map(x => (x.dir === 'down' ? 'D' : 'U') + (x.acc ? '>' : '')).join(' ');
    assert.equal(cyc, want[r.id], r.id);
    c.chart.forEach((x, i) => { const s = r.strokes[i % per]; assert.equal(x.dir, s.direction); assert.equal(x.acc, !!s.accent); });
  });
});
ok('Melody Memory lengths 3 · 4 · 5 · 6–8, notes from the pool', () => {
  const want = { 1: [3, 3], 2: [4, 4], 3: [5, 5], 4: [6, 8] };
  for (const L of G.MEMORY) for (let r = 0; r < 5; r++) {
    const m = G.melody(L.id, r);
    if (want[L.id]) assert.ok(m.length >= want[L.id][0] && m.length <= want[L.id][1], 'L' + L.id);
    m.forEach(x => { assert.ok(x.f >= L.frets[0] && x.f <= L.frets[1]); assert.ok(near(TH.midi(x.s, x.f), x.midi)); });
  }
  assert.equal(G.rhythmMatch([1, 1, 2], [.5, .5, 1]), 1, 'the same rhythm, twice as fast, is the same rhythm');
  assert.ok(G.rhythmMatch([1, 1, 2], [1, 2, 1]) < .7);
});
ok('Fret Hunter: targets inside the level\'s frets, never the same note twice in a row', () => {
  for (const L of G.HUNT) { const T = G.huntTargets(L.id); assert.equal(T.length, L.n); T.forEach((x, i) => { assert.ok(TH.positions(x.midi).some(p => p.f >= L.frets[0] && p.f <= L.frets[1])); if (i) assert.notEqual(x.midi, T[i - 1].midi); }); }
});
ok('Chord Master: every chord comes from the computed library, fingers by the teacher\'s rule', () => {
  for (const L of G.CHORD_SETS) { const S = G.chordSet(L.id); assert.equal(S.length, L.names.length, 'level ' + L.id + ' all found');
    S.forEach(c => { const lib = TH.chordLibrary().find(x => x.name === c.name); same(c.frets, lib.voicings[0].frets); same(c.fingers, TH.teacherFingers(c.frets).fingers); c.midis.forEach((m, i) => assert.equal(m, TH.midi(i + 1, c.frets[i]))); }); }
});

console.log('progress, sync, achievements, daily, arena');
ok('records keep the best of everything', () => {
  let st = null;
  ({ state: st } = G.record(st, { g: 'rush', l: 1, d: 'normal', score: 900, acc: .8, stars: 2, maxCombo: 12, date: 10 }));
  const r2 = G.record(st, { g: 'rush', l: 1, d: 'normal', score: 700, acc: .95, stars: 3, maxCombo: 5, date: 20 });
  same(r2.rec, { best: 900, acc: .95, stars: 3, combo: 12, plays: 2, first: 10, last: 20 });
  assert.equal(r2.improved.stars, 1); assert.equal(r2.improved.score, false); assert.equal(r2.improved.first, false);
});
ok('two devices merge without losing a round', () => {
  const K = G.KEYS;
  const a = { v: 1, map: { 'rush:1:normal': { best: 900, acc: .8, stars: 2, combo: 12, plays: 3, first: 10, last: 30 } } };
  const b = { v: 1, map: { 'rush:1:normal': { best: 1000, acc: .7, stars: 1, combo: 20, plays: 5, first: 5, last: 25 }, 'rhythm:mtiuluri:easy': { best: 5, acc: .5, stars: 1, combo: 3, plays: 1, first: 1, last: 1 } } };
  const m = G.merge(K.best, a, b); same(m.map['rush:1:normal'], { best: 1000, acc: .8, stars: 2, combo: 20, plays: 5, first: 5, last: 30 }); assert.ok(m.map['rhythm:mtiuluri:easy']);
  const h = G.merge(K.hist, { v: 1, list: [{ date: 1, g: 'rush', l: 1 }, { date: 3, g: 'rush', l: 2 }] }, { v: 1, list: [{ date: 2, g: 'rush', l: 1 }, { date: 3, g: 'rush', l: 2 }] });
  same(h.list.map(x => x.date), [1, 2, 3]);
  same(G.merge(K.ach, { v: 1, map: { first: 50 } }, { v: 1, map: { first: 40, combo25: 60 } }).map, { first: 40, combo25: 60 });
  assert.equal(G.merge(K.best, 'garbage', null), 'garbage'); same(G.merge(K.best, 'garbage', a).map, a.map, 'an old or broken copy never wins over a good one');
});
ok('achievements are facts about the records', () => {
  const best = { v: 1, map: { 'rush:1:normal': { best: 1, stars: 3, combo: 30, plays: 1 }, 'rhythm:kazbeguri:easy': { stars: 1, combo: 2 }, 'rhythm:mtiuluri:hard': { stars: 1 } } };
  const st = G.stats(best, { v: 1, list: [{ date: 1, g: 'rush' }] }, null, 100);
  const got = G.newAchievements(st, null);
  assert.ok(got.includes('first') && got.includes('rush1') && got.includes('rush3s') && got.includes('combo25') && got.includes('rhythmFast'));
  assert.ok(!got.includes('combo50') && !got.includes('rhythm4'));
  same(G.newAchievements(st, { v: 1, map: { first: 1, rush1: 1, rush3s: 1, combo25: 1, rhythmFast: 1 } }), []);
});
ok('the daily challenge is the same all day and is met only by a matching round', () => {
  const day = G.dayNum(new Date(2026, 10, 23)), a = G.daily(day, null), b = G.daily(day, null);
  same(a, b);
  const days = new Set(); for (let d = 0; d < 30; d++) days.add(JSON.stringify(G.daily(day + d, null))); assert.ok(days.size > 10);
  const ch = { g: 'rush', l: 2, d: 'normal', goal: { kind: 'stars', v: 2 } };
  assert.equal(G.dailyMet(ch, { g: 'rush', l: 2, d: 'normal', stars: 2 }), true);
  assert.equal(G.dailyMet(ch, { g: 'rush', l: 2, d: 'hard', stars: 3 }), true, 'harder counts');
  assert.equal(G.dailyMet(ch, { g: 'rush', l: 2, d: 'easy', stars: 3 }), false, 'easier does not');
  assert.equal(G.dailyMet(ch, { g: 'rush', l: 3, d: 'normal', stars: 3 }), false);
  const st = G.stats(null, null, { v: 1, map: { [day]: { done: 1 }, [day - 1]: { done: 1 }, [day - 2]: { done: 1 } } }, day); assert.equal(st.dailyStreak, 3);
});
ok('a challenge code round-trips; a mistyped one is refused', () => {
  const o = { g: 'rush', l: 3, d: 'normal', seed: 123456, score: 12345, acc: .923, pitchAcc: .95, timing: .81, mistakes: 3, maxCombo: 27, name: 'ნიკა', date: 5 };
  const c = G.encodeChallenge(o), back = G.decodeChallenge(c);
  same(back, o);
  same(G.decodeChallenge('https://x/app/#gmc=' + c), o, 'from a link');
  const bad = c.slice(0, 10) + (c[10] === 'A' ? 'B' : 'A') + c.slice(11); assert.equal(G.decodeChallenge(bad), null);
  assert.equal(G.decodeChallenge('nonsense'), null);
  const cmp = G.compare({ score: 10, acc: .9, mistakes: 1 }, { score: 8, acc: .95, mistakes: 0 }); assert.equal(cmp.win, 1); assert.equal(cmp.rows.find(r => r.k === 'mistakes').win, -1);
});
ok('the session state machine refuses impossible steps', () => {
  const log = [], m = G.machine((n, p) => log.push(p + '→' + n));
  assert.equal(m.go('playing'), false);
  ['preparing', 'countdown', 'playing', 'paused', 'countdown', 'playing', 'completed', 'preparing', 'countdown', 'playing', 'failed', 'exiting'].forEach(s => assert.equal(m.go(s), true, s));
  assert.equal(m.go('preparing'), false, 'nothing after exiting');
  assert.equal(log.length, 12);
});
ok('the clock across pauses: song time stops, audio time goes on; a moment inside a pause has no song time', () => {
  const c = G.clock();
  c.run(0, 100);                       // song 0 at audio 100
  assert.equal(c.song(102), 2); assert.equal(c.at(102.5), 2.5);
  c.stop(103);                         // paused at song 3
  assert.equal(c.at(110), 3); assert.equal(c.song(105), null, 'during the pause');
  assert.ok(near(c.song(102.9), 2.9, 1e-9), 'a late report of a stroke before the pause still maps');
  c.run(3, 120);                       // resumed
  assert.equal(c.song(121), 4); assert.equal(c.audio(5), 122); assert.equal(c.song(99.5), -.5);
});
ok('XP shown is the app\'s own rule (correct notes + 5 per minute) plus the level bonus', () => {
  assert.equal(G.sessionXP(20, 120), 30); assert.equal(G.bonusXP({ first: true, stars: 2 }), 40);
});
console.log(n + ' checks passed');
