/* =====================================================================
   PD.s3core — Studio 3.0's shared layer. No DOM, no audio.

   1. One transport. Every engine that makes sound in the studio claims
      PD.transport before it starts; the engine that held it is paused
      first. Two players never sound at once.
   2. One timebase. Seconds ↔ beats over a song's measured beat grid, or
      over an arrangement's single tempo (a quarter note = 1 beat).
   3. One project shape (schema 3). The two studios keep their own
      storage — the AI studio's songs (`ai.recent` + IndexedDB) and Panduri
      Studio's projects (`pst.p.<id>`, the .panduri format v1). A Studio
      project is a view over them: nothing is copied, moved or rewritten,
      and each view turns back into the exact record it came from
      (qa/studio3-core.cjs proves the round trip).
   Every result carries where it came from (`source`) and what it is
   (`status`): confirmed · corrected · estimate · unavailable.
   In the app only (APP_ONLY). See docs/studio3/ARCHITECTURE.md.
   ===================================================================== */
'use strict';
PD.s3core = (() => {
  const SCHEMA = 3;
  const STATUS = ['confirmed', 'corrected', 'estimate', 'unavailable'];
  const SOURCES = ['teacher', 'ai', 'manual', 'general', 'computed', 'default'];
  const tag = (source, status, extra) => Object.assign({ source, status }, extra || {});

  /* ---------- 1. the transport: one engine sounds at a time ---------- */
  const transport = (() => {
    let owner = null; const subs = new Set();
    const emit = () => subs.forEach(f => { try { f(owner); } catch (_) {} });
    return {
      get active() { return owner; },
      /** an engine is about to sound: the one that held the transport is paused first */
      claim(o) {
        if (!o) return; const prev = owner; owner = o;
        if (prev && prev !== o) { try { (prev.pause || prev.stop).call(prev); } catch (_) {} }
        emit();
      },
      release(o) { if (o && owner === o) { owner = null; emit(); } },
      on(f) { subs.add(f); return () => subs.delete(f); }
    };
  })();

  /* ---------- 2. the timebase ---------- */
  /** the beat (fractional, 0 = the first beat of the grid) at a time in seconds: over a measured grid of beat times
      (a song), or at one tempo when there is no grid (an arrangement). The same rule as the AI studio's score. */
  function beatAt(sec, grid) {
    const B = grid && grid.beats, bpm = (grid && grid.bpm) || 100;
    if (!B || B.length < 2) return sec * bpm / 60;
    let lo = 0, hi = B.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (B[mid] <= sec) lo = mid; else hi = mid; }
    return lo + (sec - B[lo]) / (B[lo + 1] - B[lo]);
  }
  /** the time in seconds of a (fractional) beat */
  function secAt(beat, grid) {
    const B = grid && grid.beats, bpm = (grid && grid.bpm) || 100;
    if (!B || B.length < 2) return beat * 60 / bpm;
    const k = Math.max(0, Math.min(B.length - 2, Math.floor(beat)));
    return B[k] + (beat - k) * (B[k + 1] - B[k]);
  }
  /** a position in bars: bar and beat count from 1, as a musician counts. `phase` = beats before the first bar line */
  function barBeat(beat, beatsPerBar, phase) {
    const g = beatsPerBar || 4, rel = beat - (phase || 0), bar = Math.floor(rel / g + 1e-9);
    return { bar: bar + 1, beat: Math.floor(rel - bar * g + 1e-9) + 1, frac: rel - bar * g - Math.floor(rel - bar * g + 1e-9) };
  }
  const clock = s => { if (!(s >= 0)) s = 0; const m = Math.floor(s / 60), r = Math.floor(s - m * 60); return m + ':' + String(r).padStart(2, '0'); };

  /* ---------- 3. the instrument: always the approved profile, never a copy ---------- */
  function instrument() {
    const I = PD.instrument, P = I && I.profile; if (!P) return null;
    return { id: P.id, v: P.v, tuning: P.strings.map(s => s.label), open: P.strings.map(s => s.open), frets: P.frets.count,
      pitch: tag(P.fretPitch.src === 'measured' ? 'teacher' : 'computed', P.fretPitch.src === 'measured' ? 'confirmed' : 'estimate'), verifiedBy: P.verifiedBy || null };
  }

  /* ---------- 4. the project: views over the two studios' own records ---------- */
  const stripExt = n => String(n || '').replace(/\.[a-z0-9]{1,5}$/i, '');
  const isVideo = r => /^video\//.test(r.type || '') || /\.(mp4|m4v|mov|webm|mkv|avi|ogv)$/i.test(r.name || '');
  /** a song from the AI studio. Its file stays in IndexedDB (ai.song.<id>), its analysis too (ai.res.<id>);
      `res` is that analysis when it is at hand (the song is open), else the list entry's summary is used */
  function fromSong(r, res, live) {
    live = live || {};
    const corrected = !!(res && res.chords0), byHand = !!(res && res.bpmBy === 'hand');
    const cname = c => PD.ai && PD.ai.cname ? PD.ai.cname(c.root, c.q) : null;
    const chordNames = res ? [...new Set(res.chords.filter(c => c.root >= 0).map(cname).filter(Boolean))] : (r.chords || []);
    const tr = live.transcription, notes = tr && Array.isArray(tr.notes) ? tr.notes : null;
    const stems = live.stems && Array.isArray(live.stems.tracks) ? live.stems.tracks.map(x => ({ kind: x.name, predictedInstrument: x.name, assetId: null, kept: 'memory', from: live.stems.from || 0, seconds: live.stems.len || null })) : [];
    return {
      schemaVersion: SCHEMA, kind: 'song', id: 'ai:' + r.id, title: r.title || stripExt(r.name), created: r.at || null, modified: r.at || null, ownerId: null,
      sourceAssetId: r.stored ? 'ai.song.' + r.id : null,
      source: { name: r.name, size: r.size == null ? null : r.size, type: r.type || null, video: isVideo(r), stored: !!r.stored },
      audioClock: {
        durationSeconds: res ? res.dur : null,
        tempoMap: res && res.beats ? tag(byHand ? 'manual' : 'ai', byHand ? 'corrected' : 'estimate', { kind: 'beats', bpm: res.bpm, beats: res.beats.length, phase: res.phase || 0 })
          : r.bpm ? tag('ai', 'estimate', { kind: 'tempo', bpm: r.bpm }) : null
      },
      stems,   // separated stems live in memory while the song is open; they are not saved (AI-STUDIO.md §4.4)
      analyses: {
        key: r.key ? tag('ai', 'estimate', { name: r.key, scope: 'nearest major/minor' }) : null,
        // count: the different chords, as the AI studio counts them; segments: how many times the chord changes
        chords: res ? tag(corrected ? 'manual' : 'ai', corrected ? 'corrected' : 'estimate', { count: new Set(res.chords.filter(c => c.root >= 0).map(c => c.root + ':' + c.q)).size, segments: res.chords.length, names: chordNames.length ? chordNames : (r.chords || []) })
          : r.chords && r.chords.length ? tag('ai', 'estimate', { names: r.chords }) : null,
        notes: notes ? tag('ai', 'estimate', { count: notes.length }) : null,
        rhythms: [], sections: []
      },
      instrumentProfileId: (instrument() || {}).id || null,
      arrangements: [], lessons: live.lesson ? [{ id: 'ai-' + r.id, source: 'ai', status: 'estimate' }] : [],
      processingJobs: [{ kind: 'analysis', engine: 'on-device', status: res || r.key ? 'complete' : 'unknown' }].concat(stems.length ? [{ kind: 'separation', engine: 'on-device', status: 'complete', kept: 'memory' }] : []),
      revision: r.at || 0, saveStatus: r.stored ? 'saved' : 'unsaved',
      legacy: { store: 'ai.recent', record: r }
    };
  }
  const toSong = v => v && v.legacy && v.legacy.store === 'ai.recent' ? v.legacy.record : null;

  /** an arrangement: a Panduri Studio project (.panduri v1). The project itself rides along untouched */
  function fromArrangement(p) {
    const C = PD.pstCore, bpb = (p.meter[0] * 4) / p.meter[1], len = C ? C.length(p) : 0;
    const noteTracks = p.tracks.filter(t => t.kind === 'notes'), all = noteTracks.flatMap(t => t.notes || []);
    // A rhythm says whose it is only while it is unchanged: Panduri Studio keeps `src: 'teacher'` on a preset even after a
    // stroke or a length is edited, so the strokes and the lengths are compared with the preset they came from.
    const presets = (() => { try { return C ? C.presets() : []; } catch (_) { return []; } })();
    const rhythms = p.tracks.filter(t => t.kind === 'rhythm').map(t => {
      const R = t.rhythm || {}, S = R.steps || [], pr = R.preset ? presets.find(x => x.id === R.preset) : null;
      const sameStrokes = !!pr && pr.steps.length === S.length && pr.steps.every((s, i) => s.dir === S[i].dir && !!s.acc === !!S[i].acc);
      const sameDurs = !!pr && pr.steps.length === S.length && pr.steps.every((s, i) => Math.abs(s.dur - S[i].dur) < 1e-6);
      const from = pr ? pr.src : R.src === 'general' ? 'general' : 'manual';
      return { track: t.id, name: R.name, preset: R.preset || null, bars: R.bars,
        steps: S.map(s => ({ dir: s.dir, acc: !!s.acc, dur: s.dur })),
        strokes: pr ? (sameStrokes ? tag(from, 'confirmed') : tag('manual', 'corrected')) : tag(from, 'confirmed'),
        timing: pr && sameDurs ? (pr.timingSrc === 'default' ? tag('default', 'unavailable') : tag(from, 'confirmed')) : pr ? tag('manual', 'corrected') : tag(from, 'confirmed'),
        chords: (R.chords || []).map(c => ({ bar: c.bar, name: c.name, frets: c.frets, shape: tag('computed', 'confirmed') })) };
    });
    return {
      schemaVersion: SCHEMA, kind: 'arrangement', id: 'pst:' + p.id, title: p.name, created: p.created || null, modified: p.modified || null, ownerId: null,
      sourceAssetId: null, source: null,
      audioClock: { durationSeconds: len * 60 / p.bpm, tempoMap: tag('manual', 'confirmed', { kind: 'constant', bpm: p.bpm, meter: p.meter.slice(), beatsPerBar: bpb }) },
      stems: [],
      analyses: { key: null, chords: null, notes: tag('manual', 'confirmed', { count: all.length, unplayable: all.filter(n => !(n.s >= 1 && n.f >= 0)).length }), rhythms, sections: [] },
      instrumentProfileId: (instrument() || {}).id || null,
      arrangements: [{ id: p.id, format: p.format, v: p.v, tracks: p.tracks.map(t => ({ id: t.id, name: t.name, kind: t.kind, notes: t.kind === 'notes' ? (t.notes || []).length : 0, mute: !!t.mute, solo: !!t.solo })), data: p }],
      lessons: [], processingJobs: [], revision: p.modified || 0, saveStatus: 'saved',
      legacy: { store: 'pst', key: 'pst.p.' + p.id }
    };
  }
  const toArrangement = v => v && v.kind === 'arrangement' && v.arrangements[0] ? v.arrangements[0].data : null;

  /** any project the studio is handed, in the current shape: a .panduri project (v1) or a schema-3 view.
      A newer schema is refused rather than half read; nothing older is lost. */
  function migrate(o) {
    if (!o || typeof o !== 'object') throw new Error('not-a-project');
    if (o.schemaVersion != null) { if (o.schemaVersion > SCHEMA) throw new Error('newer-version'); if (o.schemaVersion === SCHEMA) return o; throw new Error('unknown-version'); }
    if (o.format === 'panduri-project') return fromArrangement(PD.pstCore ? PD.pstCore.parse(o) : o);
    if (o.name && o.id && ('at' in o || 'stored' in o)) return fromSong(o, null);
    throw new Error('not-a-project');
  }
  /** back to the record a studio stores: the inverse of migrate() */
  function down(v) { return toArrangement(v) || toSong(v); }

  /** every project on this device, newest first: the AI studio's songs and Panduri Studio's arrangements */
  function index() {
    const songs = (PD.store.get('ai.recent', []) || []).filter(r => r && r.id).map(r => ({ kind: 'song', id: 'ai:' + r.id, ref: r.id, title: r.title || stripExt(r.name), when: r.at || 0, key: r.key || null, bpm: r.bpm || null, stored: !!r.stored, video: isVideo(r) }));
    const arr = (PD.store.get('pst.list', []) || []).filter(x => x && x.id).map(x => {
      const p = PD.store.get('pst.p.' + x.id, null), tracks = p && Array.isArray(p.tracks) ? p.tracks : [];
      return { kind: 'arrangement', id: 'pst:' + x.id, ref: x.id, title: x.name, when: x.modified || 0, bpm: p ? p.bpm : null, meter: p && p.meter ? p.meter.join('/') : null, tracks: tracks.length, notes: tracks.reduce((a, t) => a + (t.kind === 'notes' && t.notes ? t.notes.length : 0), 0) };
    });
    return songs.concat(arr).sort((a, b) => b.when - a.when);
  }

  return { SCHEMA, STATUS, SOURCES, transport, beatAt, secAt, barBeat, clock, instrument, fromSong, toSong, fromArrangement, toArrangement, migrate, down, index };
})();
PD.transport = PD.s3core.transport;
