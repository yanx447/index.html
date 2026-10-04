/* =====================================================================
   Lesson data: schema v2, built-in content, curriculum, user lessons,
   progress records. Lessons are data; the engine never hard-codes songs.
   ---------------------------------------------------------------------
   Lesson  { id, v:2, type:'song'|'melody'|'solo'|'exercise', title:{ka,en},
             level:1..4, bpm, meter:[n,d], tuning, link?, refAudio?, refOffset?,
             sections:[{id,name:{ka,en},from,to}], events:[Event], user?, desc? }
   Event   { id, t (beats), d (beats), s 1..3, f 0..17, fi 0..4, st 'down'|'up',
             acc?, chordId?, chord?, technique?:'pluck'|'strum', hint?:{ka,en},
             hand? (index-finger fret), diff?:1..4 }
   Derived per event: measure, beat, pitch (computed from tuning).
   ===================================================================== */
PD.lessons = (() => {
  const { id, chord, strum, sec } = PD.build;
  let PATHS = PD.curriculum.paths();
  /** learning stages an author can choose per lesson (result + next practice are always shown) */
  const STAGES = ['intro', 'demo', 'watch', 'chords', 'technique', 'guided', 'slow', 'wait', 'metro', 'loop', 'phrase', 'perform'];
  function stagesOf(l) {
    if (Array.isArray(l.stages) && l.stages.length) return l.stages.filter(s => STAGES.includes(s));
    const out = [];
    if (l.intro || (l.media && l.media.length)) out.push('intro');
    out.push('demo');
    if (l.technique) out.push('technique');
    out.push('guided', 'wait', 'slow');
    if (l.type !== 'exercise' && (l.sections || []).length > 1) out.push('phrase');
    out.push('perform');
    return out;
  }

  /* ---- user lessons ---- */
  const KEY = 'lessons.user';
  const all = PD.curriculum.lessons();
  function reloadCurriculum() { all.length = 0; PD.curriculum.lessons().forEach(l => all.push(normalize(l))); PATHS = PD.curriculum.paths(); mergeUser(); PD.bus.emit('lessons'); }
  PD.bus.on('curriculum', reloadCurriculum);
  function mergeUser() {
    const saved = PD.store.get(KEY, []);
    saved.forEach(l => { if (!l || !l.id) return; const i = all.findIndex(x => x.id === l.id);
      if (i >= 0 && l.builtinUser && !(l.events && l.events.length) && all[i].events.length) return;   // an empty placeholder never hides a built-in song
      const n = normalize(l); if (i >= 0) all[i] = n; else all.push(n); });
  }
  function normalize(l) {
    const o = Object.assign({ v: 2, level: 1, tuning: 'std', meter: [4, 4], sections: [], events: [] }, l);
    if (typeof o.title === 'string') o.title = { ka: o.title, en: o.title };
    if (!Array.isArray(o.meter)) o.meter = [o.bpb || 4, 4];
    o.events = (o.events || []).filter(e => e && e.s >= 1 && e.s <= PD.instrument.stringCount && e.f >= 0 && e.f <= PD.instrument.fretCount && e.t >= 0).map(e => Object.assign({ id: id(), d: .5, fi: 0, st: 'down', technique: e.chordId ? 'strum' : 'pluck' }, e)).sort((a, b) => a.t - b.t || a.s - b.s);
    if (!o.sections || !o.sections.length) o.sections = autoSections(o);
    return o;
  }
  function bpb(l) { return l.meter ? l.meter[0] : 4; }
  /** where beat b of a lesson sounds in its recording (s): the song's beat map, or a fixed tempo + offset */
  function timeOf(l, b) {
    const m = l.beatMap;
    if (m && m.length > 1) { const k = Math.max(0, Math.min(m.length - 2, Math.floor(b))); return m[k] + (b - k) * (m[k + 1] - m[k]); }
    return b * 60 / l.bpm + (l.refOffset || 0);
  }
  function end(l) { return l.events.length ? Math.max(...l.events.map(e => e.t + e.d)) : bpb(l); }
  function autoSections(l) {
    const b = bpb(l), n = Math.max(1, Math.ceil(end(l) / b - 1e-6)), out = [];
    for (let i = 0; i < n; i += 4) out.push({ id: 'a' + i, name: { ka: 'ტაქტები ' + (i + 1) + '–' + Math.min(n, i + 4), en: 'Bars ' + (i + 1) + '–' + Math.min(n, i + 4) }, from: i * b, to: Math.min(n, i + 4) * b });
    return out;
  }
  function saveUser() { PD.store.set(KEY, all.filter(l => l.user).map(l => { const c = Object.assign({}, l); return c; })); }
  /* one-time migration from the earlier version of this app (localStorage 'panduri-user-lessons') */
  (function migrateV1() {
    if (PD.store.get('migratedV1', false)) return;
    try {
      const old = JSON.parse(localStorage.getItem('panduri-user-lessons') || '[]'), lang = localStorage.getItem('panduri-lang');
      if (lang === 'en' || lang === 'ka') PD.store.set('lang', PD.store.get('lang', lang));
      const out = PD.store.get(KEY, []);
      (Array.isArray(old) ? old : []).forEach(o => {
        if (!o || !o.id || !Array.isArray(o.events) || !o.events.length) return;
        if (out.some(x => x.id === o.id && x.events && x.events.length)) return;
        const typ = { song: 'song', mel: 'melody', solo: 'solo' }[o.cat] || 'exercise', bb = o.bpb || 4;
        const l = { id: o.id, v: 2, user: true, type: typ, title: { ka: o.ka || o.en || o.id, en: o.en || o.ka || o.id }, bpm: o.bpm || 100, meter: [bb, bb === 6 ? 8 : 4], grid: o.grid, link: o.link || undefined, recorded: o.recorded,
          events: o.events.filter(e => e.type === 'note' || e.type == null).map(e => ({ id: id(), t: +e.t, d: +e.d || .5, s: +e.s, f: +e.f, fi: +e.fi || 0, st: e.st === 'up' ? 'up' : 'down', acc: !!e.acc, technique: 'pluck' })) };
        if (o.id === 'bani-acharuli') Object.assign(l, { path: 'songs', builtinUser: true, desc: { ka: 'აჭარა · ბანის პარტია. ნოტები შენი დაკვრით იწერება.', en: 'Adjara · bass part. Notes are recorded from your playing.' } });
        const i = out.findIndex(x => x.id === o.id); if (i >= 0) out[i] = l; else out.push(l);
      });
      PD.store.set(KEY, out);
    } catch (_) {}
    PD.store.set('migratedV1', true);
  })();
  mergeUser();

  /** Steps: events grouped into what the student plays at one moment. */
  function steps(l) {
    const groups = new Map();
    l.events.forEach(e => {
      const k = e.chordId ? 'c:' + e.chordId : 'n:' + e.id;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(e);
    });
    const out = [];
    groups.forEach(evs => {
      evs.sort((a, b) => a.s - b.s);
      const e0 = evs[0], kind = evs.length > 1 ? (e0.technique === 'strum' && evs.every(e => e.f === 0) && (!e0.chord || e0.chord === 'A') && evs.length === 3 ? 'strum' : 'chord') : 'note';
      out.push({ t: e0.t, d: Math.max(...evs.map(e => e.d)), kind, notes: evs, name: e0.chord || '', st: e0.st, acc: evs.some(e => e.acc), hint: e0.hint, chordId: e0.chordId, wait: e0.wait, tol: e0.tol });
    });
    out.sort((a, b) => a.t - b.t);
    out.forEach((s, i) => { s.i = i; s.frets = [1, 2, 3].map(k => { const n = s.notes.find(x => x.s === k); return n ? n.f : null; }); s.fingers = [1, 2, 3].map(k => { const n = s.notes.find(x => x.s === k); return n ? n.fi : 0; }); });
    return out;
  }

  /* ---- progress records ---- */
  const P = {
    lesson(id) { return PD.store.get('prog.' + id, { stages: {}, best: null, mastery: 0, maxTempo: 0, last: 0, plays: 0, heat: {} }); },
    saveLesson(id, p) { PD.store.set('prog.' + id, p); },
    sessions() { return PD.store.get('sessions', []); },
    addSession(s) { const a = P.sessions(); a.push(s); PD.store.set('sessions', a.slice(-400)); PD.bus.emit('session', s); },
    favorites() { return PD.store.get('favorites', []); },
    toggleFav(id) { const f = P.favorites(), i = f.indexOf(id); if (i >= 0) f.splice(i, 1); else f.push(id); PD.store.set('favorites', f); return i < 0; }
  };

  /** song: one strum per chord bar, in WAIT — the recording pauses until the chord is heard */
  function songChanges(l) {
    const out = Object.assign({}, l, { id: l.id + '~chords', derived: l.id, title: { ka: l.title.ka + ' · აკორდების ცვლა', en: l.title.en + ' · chord changes' }, user: false, stages: null, events: [] });
    // one step per chord change: the recording plays until the next chord, then waits for it
    const runs = []; let cur = null;
    steps(l).forEach(st => { if (cur && cur.name === st.name && st.t <= cur.end + 1e-6) { cur.end = st.t + st.d; return; } cur = { name: st.name, t: st.t, end: st.t + st.d, frets: st.frets, fingers: st.fingers }; runs.push(cur); });
    runs.forEach(r => out.events.push(...chord(r.t, r.name, r.frets, r.fingers, 'down', r.end - r.t, false, 'strum')));
    return normalize(out);
  }
  /** song: the song's rhythm pattern on its first chord, 8 bars, no recording */
  function songRhythm(l) {
    const ss = steps(l), bb = bpb(l), first = ss[0]; if (!first) return l;
    const per = ss.filter(s => s.t < first.t + bb - 1e-6), ev = [];
    for (let k = 0; k < 8; k++) per.forEach(s => ev.push(...chord(s.t - first.t + k * bb, s.name, s.frets, s.fingers, s.st, s.d, s.acc, 'strum')));
    return normalize(Object.assign({}, l, { id: l.id + '~rhythm', derived: l.id, title: { ka: l.title.ka + ' · რიტმი', en: l.title.en + ' · rhythm' }, user: false, stems: null, beatMap: null, stages: null, events: ev, sections: [] }));
  }
  /** derived lesson: the same timing and stroke directions on open strings (rhythm stage) */
  function rhythmOf(l) {
    const out = Object.assign({}, l, { id: l.id + '~rhythm', derived: l.id, title: { ka: l.title.ka + ' · რიტმი', en: l.title.en + ' · rhythm' }, user: false, events: [] });
    steps(l).forEach(st => { out.events.push(...strum(st.t, st.st, st.d, st.acc)); });
    return out;
  }
  /** lesson generated from a teacher rhythm: the stroke pattern repeated as cycles.
      Strokes are played on the open strings (the sound only); judging checks direction and time, never pitch. */
  function fromRhythm(r, cycles) {
    cycles = cycles || 4;
    const d = r.timing.durations, per = d.reduce((a, b) => a + b, 0), ev = [], secs = [];
    for (let c = 0; c < cycles; c++) {
      let tt = c * per;
      r.strokes.forEach((s, i) => { ev.push(...strum(tt, s.direction, d[i], s.accent)); tt += d[i]; });
      secs.push(sec('ციკლი ' + (c + 1), 'Cycle ' + (c + 1), c * per, (c + 1) * per));
    }
    const per4 = Math.max(1, Math.round(per * 1000) / 1000);
    return normalize({ id: 'rhythm-' + r.id, type: 'exercise', rhythm: r.id, demo: false, source: 'teacher', title: r.name, level: 1, bpm: r.timing.bpm, meter: [per4, 4],
      desc: { ka: r.usage.ka.join(' · '), en: r.usage.en.join(' · ') }, events: ev, sections: secs, stages: ['demo', 'watch', 'slow', 'wait', 'metro', 'loop', 'perform'] });
  }
  function rhythmLesson(rid) { const r = (PD.curriculum.rhythms ? PD.curriculum.rhythms() : []).find(x => x.id === rid); return r ? fromRhythm(r) : undefined; }
  /** derived lesson: alternate two chords (chord-transition exercise) */
  function transition(a, b, bpm) {
    const ev = []; for (let i = 0; i < 8; i++) { const c = i % 2 ? b : a; ev.push(...chord(i * 2, c.name, c.frets, c.fingers, 'down', 2, i % 4 === 0)); }
    return normalize({ id: 'tr-' + a.id + '-' + b.id, type: 'exercise', derived: 'chords', title: { ka: a.name + ' → ' + b.name, en: a.name + ' → ' + b.name }, bpm: bpm || 60, events: ev, sections: [sec(a.name + ' ↔ ' + b.name, a.name + ' ↔ ' + b.name, 0, 8), sec('×2', '×2', 8, 16)] });
  }
  return {
    all, get PATHS() { return PATHS; }, STAGES, stagesOf, fromRhythm, steps, rhythmOf, songChanges, songRhythm, transition, normalize, bpb, timeOf, end, autoSections, progress: P,
    get: lid => all.find(l => l.id === lid) || (/^rhythm-/.test(lid || '') ? rhythmLesson(lid.slice(7)) : undefined),
    /** lessons generated from the teacher rhythms (not stored; rebuilt from curriculum data) */
    rhythmLessons: () => (PD.curriculum.rhythms ? PD.curriculum.rhythms() : []).map(r => fromRhythm(r)),
    add(l) { const n = normalize(Object.assign({ user: true }, l)); const i = all.findIndex(x => x.id === n.id); if (i >= 0) all[i] = n; else all.push(n); saveUser(); PD.bus.emit('lessons'); return n; },
    update(l) { const i = all.findIndex(x => x.id === l.id); if (i >= 0) { all[i] = l; if (l.user) saveUser(); PD.bus.emit('lessons'); } },
    remove(lid) { const i = all.findIndex(x => x.id === lid && x.user); if (i < 0) return; if (all[i].builtinUser) { all[i].events = []; all[i].sections = autoSections(all[i]); } else all.splice(i, 1); saveUser(); PD.bus.emit('lessons'); },
    newId: () => id(),
    newChordId: () => PD.build.newChordId(),
    /** export / import (schema v2) */
    toJSON(l) { return JSON.stringify({ schema: 'panduri-lesson', v: 2, lesson: Object.assign({}, l, { refAudio: undefined, media: (l.media || []).filter(m => m.url) }) }, null, 1); },
    fromJSON(txt) { const o = JSON.parse(txt); const l = o.lesson || o; if (!l.events) throw new Error('events'); return normalize(Object.assign({ id: 'u-' + Date.now().toString(36), user: true }, l)); }
  };
})();
