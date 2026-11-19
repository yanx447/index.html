/* Studio 3.0's shared layer (src/s3core.js) on the app's real instrument, theory, curriculum and Panduri Studio model:
   an old .panduri project (v1, from before the Studio) and two AI-studio songs become Studio projects (schema 3) and
   turn back into exactly what they were; a newer schema is refused; provenance is told truthfully — including a teacher
   rhythm that was edited afterwards; the timebase; the one transport. Usage: node qa/studio3-core.cjs */
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const store = {}; global.window = global; global.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
global.PD = { i18n: { add() {}, pick: o => (o && o.en) || o, t: k => k }, bus: { on() {}, emit() {} }, store: { get: (k, d) => (k in store ? JSON.parse(store[k]) : d), set: (k, v) => { store[k] = JSON.stringify(v); }, del: k => { delete store[k]; } } };
const load = f => eval(fs.readFileSync(path.join(__dirname, '../src', f), 'utf8'));
['instrument.js', 'theory.js', 'curriculum.js', 'pstcore.js', 's3core.js'].forEach(load);
const X = PD.s3core, C = PD.pstCore, FIX = path.join(__dirname, 'fixtures/studio3');
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; }, eq = (a, b, m) => { assert.deepEqual(a, b, m); n++; };

// 1. the instrument is the approved profile: A (string 1, the bass) · C♯ · E, 17 frets, its pitch map marked computed
const I = X.instrument();
eq([I.id, I.tuning, I.open, I.frets], ['teacher-panduri', ['A', 'C♯', 'E'], [57, 61, 64], 17], 'the approved profile: A · C♯ · E, 17 frets');
eq(I.pitch, { source: 'computed', status: 'estimate' }, 'equal temperament is computed, not measured — said so');

// 2. an old .panduri project (v1) → a Studio project → exactly the project again
const raw = fs.readFileSync(path.join(FIX, 'old-v1.panduri'), 'utf8'), old = JSON.parse(raw);
const v = X.migrate(JSON.parse(raw));
eq([v.schemaVersion, v.kind, v.id, v.title], [3, 'arrangement', 'pst:p-old-fixture', old.name], 'schema 3, an arrangement, the same id and name');
eq([v.audioClock.tempoMap.bpm, v.audioClock.tempoMap.meter, v.audioClock.tempoMap.beatsPerBar], [84, [3, 4], 3], 'tempo and metre from the file');
eq(v.analyses.notes, { source: 'manual', status: 'confirmed', count: 3, unplayable: 1 }, 'three notes, one the panduri cannot play (kept, flagged)');
eq(v.instrumentProfileId, 'teacher-panduri', 'the project points at the approved instrument profile');
const back = X.down(v), lifted = C.parse(JSON.parse(raw));
eq(C.serialize(back), C.serialize(lifted), 'down(migrate(file)) is what Panduri Studio itself reads from the file');
for (const k of Object.keys(old)) if (k !== 'tracks') eq(back[k], old[k], 'field kept: ' + k);
old.tracks.forEach((t0, i) => { const t1 = back.tracks[i]; for (const k of Object.keys(t0)) if (k !== 'notes' && k !== 'rhythm') eq(t1[k], t0[k], 'track field kept: ' + k);
  if (t0.notes) eq(t1.notes.map(q => [q.id, q.m, q.s, q.f, q.t, q.d]), t0.notes.map(q => [q.id, q.m, q.s, q.f, q.t, q.d]), 'every note: pitch, string, fret, time, length');
  if (t0.rhythm) eq([t1.rhythm.steps.map(s => [s.dir, s.acc, s.dur]), t1.rhythm.chords], [t0.rhythm.steps.map(s => [s.dir, s.acc, s.dur]), t0.rhythm.chords], 'the rhythm: strokes, accents, lengths, chords by bar'); });
ok(X.toArrangement(X.fromArrangement(lifted)) === lifted, 'the view wraps the project itself — nothing is copied');
// 3. what the rhythm is, told truthfully
const r0 = v.analyses.rhythms[0];
eq([r0.preset, r0.strokes, r0.timing], ['kazbeguri', { source: 'teacher', status: 'confirmed' }, { source: 'default', status: 'unavailable' }], "Kazbeguri as given: the teacher's strokes; its lengths not given by him");
eq(r0.steps.map(s => (s.dir === 'down' ? 'D' : 'U') + (s.acc ? '!' : '')).join(' '), 'D! U D', "the teacher's Kazbeguri: ↓! ↑ ↓");
eq(r0.chords.map(c => [c.bar, c.name, c.shape.source]), [[0, 'Dm', 'computed'], [1, 'C', 'computed']], 'chord shapes are computed from the tuning');
const edited = C.parse(JSON.parse(raw)); edited.tracks[0].rhythm.steps[1].acc = true;   // src stays 'teacher' in the file
eq(X.fromArrangement(edited).analyses.rhythms[0].strokes, { source: 'manual', status: 'corrected' }, 'an accent changed by hand is no longer called the teacher\'s');
eq(X.fromArrangement(edited).analyses.rhythms[0].timing, { source: 'default', status: 'unavailable' }, '…while its lengths are still the default');
const longer = C.parse(JSON.parse(raw)); longer.tracks[0].rhythm.steps[0].dur = 1.5;
eq([X.fromArrangement(longer).analyses.rhythms[0].strokes.source, X.fromArrangement(longer).analyses.rhythms[0].timing], ['teacher', { source: 'manual', status: 'corrected' }], 'a length set by hand: the strokes stay his, the lengths are yours');
// 4. versions: a newer file is refused, not half read
assert.throws(() => X.migrate({ schemaVersion: 4 }), /newer-version/); n++;
assert.throws(() => X.migrate({ format: 'panduri-project', v: 2 }), /newer-version/); n++;
assert.throws(() => X.migrate({ hello: 1 }), /not-a-project/); n++;
ok(X.migrate(v) === v, 'a schema-3 project is taken as it is');

// 5. the AI studio's songs: the list entry stays the record; the analysis is read where it is
const songs = JSON.parse(fs.readFileSync(path.join(FIX, 'ai-recent.json'), 'utf8'));
const s1 = X.fromSong(songs[0], null), s2 = X.fromSong(songs[1], null);
eq([s1.kind, s1.id, s1.title, s1.sourceAssetId, s1.saveStatus], ['song', 'ai:s-fixture-1', 'მრავალჟამიერი', 'ai.song.s-fixture-1', 'saved'], 'a stored song: its file is the IndexedDB record');
eq([s2.title, s2.source.video, s2.sourceAssetId, s2.saveStatus], ['concert', true, null, 'unsaved'], 'a video that was not stored says so');
eq([s1.analyses.key, s1.audioClock.tempoMap], [{ source: 'ai', status: 'estimate', name: 'Dm', scope: 'nearest major/minor' }, { source: 'ai', status: 'estimate', kind: 'tempo', bpm: 96.4 }], 'key and tempo are AI estimates');
ok(X.toSong(s1) === songs[0] && X.down(X.migrate(songs[1])) === songs[1], 'a song turns back into its list entry');
const res = { dur: 210, bpm: 92, beats: [0.5, 1.15, 1.8], phase: 1, chords: [{ t0: 0, t1: 4, root: 2, q: 'm' }, { t0: 4, t1: 8, root: 0, q: '' }, { t0: 8, t1: 9, root: 2, q: 'm' }, { t0: 9, t1: 10, root: -1, q: '' }] };
const a = X.fromSong(songs[0], res);
eq([a.audioClock.durationSeconds, a.analyses.chords.count, a.analyses.chords.segments, a.analyses.chords.status], [210, 2, 4, 'estimate'], 'chords: two different ones, four segments, an estimate');
const fixedChords = X.fromSong(songs[0], Object.assign({}, res, { chords0: res.chords.slice(), bpmBy: 'hand' }));
eq([fixedChords.analyses.chords.status, fixedChords.analyses.chords.source, fixedChords.audioClock.tempoMap.status, fixedChords.audioClock.tempoMap.source], ['corrected', 'manual', 'corrected', 'manual'], 'chords and tempo corrected by hand say so');
const live = X.fromSong(songs[0], res, { stems: { from: 30, len: 60, tracks: [{ name: 'vocals' }, { name: 'drums' }, { name: 'bass' }, { name: 'other' }] }, transcription: { notes: [1, 2, 3] }, lesson: true });
eq(live.stems.map(s => [s.kind, s.kept, s.assetId]), [['vocals', 'memory', null], ['drums', 'memory', null], ['bass', 'memory', null], ['other', 'memory', null]], 'stems: their kind; kept in memory only; no saved asset');
eq([live.analyses.notes.count, live.lessons.length, live.processingJobs.map(j => j.kind)], [3, 1, ['analysis', 'separation']], 'transcribed notes, the lesson, the jobs that ran');

// 6. every project on the device, newest first, from both studios' own lists
PD.store.set('ai.recent', songs); PD.store.set('pst.list', [{ id: 'p-old-fixture', name: old.name, modified: 1763503600000 }, { id: 'p-gone', name: 'gone', modified: 1763600000000 }]); PD.store.set('pst.p.p-old-fixture', lifted);
const ix = X.index();
eq(ix.map(x => x.id), ['pst:p-gone', 'ai:s-fixture-1', 'pst:p-old-fixture', 'ai:s-fixture-2'], 'songs and arrangements together, newest first');
eq([ix[2].tracks, ix[2].notes, ix[2].bpm, ix[2].meter, ix[0].tracks], [2, 3, 84, '3/4', 0], 'an arrangement\'s summary; a listed project whose file is gone does not break the list');

// 7. one timebase: seconds ↔ beats over a measured grid, and at one tempo
const grid = { beats: [0.5, 1.1, 1.75, 2.35, 3.0], bpm: 100 };
eq([X.beatAt(0.5, grid), X.beatAt(1.1, grid), +X.beatAt(1.425, grid).toFixed(3)], [0, 1, 1.5], 'beats over the measured grid');
for (const b of [0, 0.25, 1.5, 2.9, 3.4]) ok(Math.abs(X.beatAt(X.secAt(b, grid), grid) - b) < 1e-9, 'secAt and beatAt are inverse at beat ' + b);
eq([X.beatAt(3, { bpm: 120 }), X.secAt(6, { bpm: 120 })], [6, 3], 'one tempo: 120 BPM, 3 s = 6 beats');
eq([X.barBeat(0, 4), X.barBeat(5.5, 4).bar, X.barBeat(5.5, 4).beat, X.barBeat(2.5, 2.5).bar], [{ bar: 1, beat: 1, frac: 0 }, 2, 2, 2], 'bar.beat as a musician counts (5/8 = 2.5 quarters)');
eq([X.clock(0), X.clock(61.9), X.clock(NaN)], ['0:00', '1:01', '0:00'], 'clock');

// 8. one transport: an engine that starts pauses the one that was sounding
const log = [], A = { id: 'a', pause: () => log.push('a paused') }, B = { id: 'b', stop: () => log.push('b stopped') };
const seen = []; const off = X.transport.on(o => seen.push(o && o.id));
X.transport.claim(A); X.transport.claim(A); eq(log, [], 'claiming again does not pause itself');
X.transport.claim(B); eq(log, ['a paused'], 'B starts: A is paused');
X.transport.claim(A); eq(log, ['a paused', 'b stopped'], 'A again: B is stopped (an engine with stop() only)');
X.transport.release(B); eq(X.transport.active, A, 'releasing an engine that is not active changes nothing');
X.transport.release(A); eq(X.transport.active, null, 'released'); off();
eq(seen, ['a', 'a', 'b', 'a', null], 'listeners hear every change');
ok(PD.transport === X.transport, 'PD.transport is the same object');
console.log('studio3-core: ' + n + ' checks passed');
