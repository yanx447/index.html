/* =====================================================================
   Song lessons from the MUSIC library — one musical source for every view.

   A song is one object (schema panduri-song): its beat map, tempo map,
   sections, chord changes (seconds), rhythm per section, melody notes,
   lyrics with syllable times. The song page, the lesson engine (stages,
   microphone, scoring), the neck, the tablature and the editor all read
   that one object; nothing is copied into a second chart.

   Which copy is used, highest first:
     1. the owner's draft — only on the owner's device, only while he previews it
     2. what the owner published (Supabase song_lessons, readable by all)
     3. the file shipped with the app (lessons/songs.json, from the analysis
        in sounds/lessons/ — measured, never typed in)
   A later analysis rewrites only (3); it never touches what he edited.

   The recording: published by the owner (bucket lesson-audio), or the
   learner's own copy of the same track, kept on this device only and
   checked against the song's length. Nothing here is uploaded by a learner.
   ===================================================================== */
PD.i18n.add({
  'ml.artist': ['შემსრულებელი', 'Performer'], 'ml.key': ['ტონალობა', 'Key'], 'ml.meter': ['ზომა', 'Meter'], 'ml.len': ['ხანგრძლივობა', 'Length'],
  'ml.level': ['სირთულე', 'Level'], 'ml.tempo': ['ტემპი', 'Tempo'], 'ml.chords': ['აკორდები', 'Chords'], 'ml.rhythms': ['რითმები', 'Rhythms'],
  'ml.sections': ['ნაწილები', 'Sections'], 'ml.lyrics': ['ტექსტი და აკორდები', 'Lyrics and chords'], 'ml.chart': ['აკორდები ტაქტებით', 'Chords bar by bar'],
  'ml.melody': ['მელოდია და ტაბულატურა', 'Melody and tablature'], 'ml.now': ['ახლა', 'Now'], 'ml.next': ['შემდეგ', 'Next'],
  'ml.speed': ['სიჩქარე', 'Speed'], 'ml.loop': ['გამეორება', 'Loop'], 'ml.loopOff': ['გამეორება გამორთულია', 'Loop off'],
  'ml.play': ['დაკვრა', 'Play'], 'ml.pause': ['პაუზა', 'Pause'],
  'ml.noAudio': ['ამ გაკვეთილის ჩანაწერი ჯერ არ დამატებულა. თუ ეს ჩანაწერი გაქვს, ჩატვირთე — ის მხოლოდ ამ მოწყობილობაზე დარჩება.', 'The recording for this lesson has not been added yet. If you have this recording, load it — it stays on this device only.'],
  'ml.load': ['ჩანაწერის ჩატვირთვა', 'Load the recording'], 'ml.loaded': ['ჩანაწერი ჩაიტვირთა', 'Recording loaded'],
  'ml.mismatch': ['ეს ჩანაწერი {a} წამია, ამ გაკვეთილისა კი {b}. სხვა ვერსია ჩანს — აკორდები მას არ დაემთხვევა.', 'This recording is {a} s long, the lesson\'s is {b} s. It looks like another version — the chords would not line up.'],
  'ml.badFile': ['ფაილი ვერ წავიკითხე.', 'Could not read the file.'],
  'ml.own': ['შენი ჩანაწერი', 'Your copy'], 'ml.drop': ['წაშლა', 'Remove'],
  'ml.pan': ['ფანდურზე', 'On the panduri'], 'ml.panD': ['ორიგინალი {a} — ფანდურზე {b}', 'Original {a} — on the panduri {b}'],
  'ml.transp': ['მელოდია ფანდურისთვის {n} ოქტავით არის გადატანილი.', 'The melody is moved {n} octave(s) to fit the panduri.'],
  'ml.verified': ['დადასტურებული', 'Verified'], 'ml.tr': ['ჩანაწერიდან', 'From the recording'],
  'ml.nc': ['აკორდის გარეშე', 'No chord'], 'ml.tapSeek': ['შეეხე — იქიდან დაიწყება', 'Tap to start there'],
  'ml.sec.intro': ['შესავალი', 'Intro'], 'ml.sec.verse': ['კუპლეტი', 'Verse'], 'ml.sec.chorus': ['მისამღერი', 'Chorus'], 'ml.sec.inst': ['ინსტრუმენტული', 'Instrumental'],
  'ml.sec.solo': ['სოლო', 'Solo'], 'ml.sec.bridge': ['გადასვლა', 'Bridge'], 'ml.sec.outro': ['დასასრული', 'Ending'],
  'ml.desc': ['{c} · {r} · {b} BPM · {m}', '{c} · {r} · {b} BPM · {m}'],
  'ml.adm': ['მფლობელის რედაქტორი', 'Owner\'s editor'], 'ml.st.not-analyzed': ['არ არის გაანალიზებული', 'Not analyzed'], 'ml.st.analyzing': ['ანალიზი მიმდინარეობს', 'Analyzing'],
  'ml.st.analysis-completed': ['ანალიზი დასრულდა', 'Analysis completed'], 'ml.st.needs-review': ['გადასამოწმებელია', 'Needs review'],
  'ml.st.manually-edited': ['ხელით შესწორდა', 'Manually edited'], 'ml.st.teacher-verified': ['დადასტურებულია', 'Teacher verified'], 'ml.st.published': ['გამოქვეყნდა', 'Published'],
  'ml.e.lesson': ['გაკვეთილი', 'Edit Lesson'], 'ml.e.chords': ['აკორდები', 'Edit Chords'], 'ml.e.notes': ['ნოტები', 'Edit Notes'], 'ml.e.rhythm': ['რითმი', 'Edit Rhythm'],
  'ml.e.lyrics': ['ტექსტი', 'Edit Lyrics'], 'ml.e.tab': ['ტაბულატურა', 'Edit Tablature'], 'ml.e.tempo': ['ტემპი', 'Edit Tempo'], 'ml.e.verify': ['დადასტურება', 'Verify Lesson'],
  'ml.dash': ['სიმღერების გაკვეთილები', 'Song lessons'], 'ml.dashD': ['ყოველი სიმღერის მდგომარეობა. ეს გვერდი მხოლოდ შენ ჩანს.', 'The state of every song. Only you can see this page.'],
  'ml.review': ['{n} მონაკვეთი გადასამოწმებელია', '{n} passages to review'], 'ml.audioPub': ['ჩანაწერი გამოქვეყნებულია', 'Recording published'], 'ml.audioNone': ['ჩანაწერი არ არის გამოქვეყნებული', 'Recording not published'],
  'ml.previewOn': ['წინასწარი ნახვა: შენი შავი ვერსია', 'Preview: your draft'], 'ml.previewOff': ['წინასწარი ნახვის დასრულება', 'End preview'],
  'ml.offline': ['სერვერთან კავშირი არ არის — ჩანს ის, რაც ამ მოწყობილობაზეა შენახული.', 'No connection to the server — showing what this device has saved.']
});

PD.musicLib = (() => {
  const h = PD.h, t = PD.i18n.t, pick = o => o ? PD.i18n.pick(o) : '';
  const PUB = 'ml.published', PREV = 'ml.preview', OWN = 'ml.own.';
  let SHIPPED = {}, ORDER = [], REVIEW = null, loaded = false;

  /* ---------- chords ---------- */
  const ROOT = { C: 0, 'C♯': 1, 'D♭': 1, D: 2, 'D♯': 3, 'E♭': 3, E: 4, F: 5, 'F♯': 6, 'G♭': 6, G: 7, 'G♯': 8, 'A♭': 8, A: 9, 'A♯': 10, 'B♭': 10, B: 11 };
  /** 'B♭m7' → { root: 10, q: 'm7' } (also 'Bb', 'A#'); null for N.C. / unknown */
  function parse(nm) {
    if (!nm || /^n\.?c\.?$/i.test(nm)) return null;
    const s = String(nm).trim().replace(/^([A-G])b/, '$1♭').replace(/^([A-G])#/, '$1♯'), r2 = s.slice(0, 2), r1 = s.slice(0, 1);
    const root = ROOT[r2] != null ? r2 : ROOT[r1] != null ? r1 : null; if (root == null) return null;
    let q = s.slice(root.length).split('/')[0];
    if (q === 'min') q = 'm'; if (q === 'maj') q = '';
    return { root: ROOT[root], q, bass: s.includes('/') ? s.split('/')[1] : null };
  }
  const triadQ = q => /^(m(?!aj)|dim|m7♭5)/.test(q) ? 'm' : '';
  const SHAPES = {};
  /** the panduri shape of a chord: the app's library (computed from the tuning, the teacher's fingering rule) —
      { frets, fingers, name (what is played), adapted (true when the chord itself has no three-string form) } */
  function shape(nm) {
    if (!nm) return null; if (SHAPES[nm] !== undefined) return SHAPES[nm];
    const c = parse(nm); if (!c) return (SHAPES[nm] = null);
    const lib = PD.curriculum.chords(), at = (r, q) => lib.find(x => x.root === r && x.q === q && !x.none && x.frets);
    let x = at(c.root, c.q), adapted = false;
    if (!x) { x = at(c.root, triadQ(c.q)); adapted = true; }
    if (!x) return (SHAPES[nm] = null);
    return (SHAPES[nm] = { frets: x.frets.slice(), fingers: (x.fingers || []).map(f => f || 0), name: x.alias && /♭/.test(nm) ? x.alias : x.name, adapted, id: x.id });
  }
  PD.bus.on('instrument', () => Object.keys(SHAPES).forEach(k => delete SHAPES[k]));

  /* ---------- the data: shipped · published · the owner's draft ---------- */
  const published = () => PD.store.get(PUB, {}) || {};
  const previews = () => (PD.cloud && PD.cloud.isOwner && PD.store.get(PREV, {})) || {};
  function data(id) {
    const pv = previews()[id]; if (pv) return Object.assign({}, pv, { _from: 'preview' });
    const p = published()[id]; if (p && p.data && p.data.beats) return Object.assign({}, p.data, { _from: 'published', _verified: !!p.verified });
    return SHIPPED[id] ? Object.assign({}, SHIPPED[id], { _from: 'shipped' }) : null;
  }
  const ids = () => ORDER.concat(Object.keys(published()).filter(id => !ORDER.includes(id) && published()[id].data && published()[id].data.beats));
  const audioUrl = path => { const c = PD.cloud && PD.cloud.config && PD.cloud.config(); return c && c.url && path ? c.url.replace(/\/$/, '') + '/storage/v1/object/public/lesson-audio/' + path.split('/').map(encodeURIComponent).join('/') : null; };
  /** the recording of song id: { key (for the lesson engine), url (for the player) } or null */
  async function audioOf(id) {
    const p = published()[id], path = p && p.audio;
    if (path) { const u = audioUrl(path); if (u) { PD.assets.media['lesson-audio/' + path] = u; return { key: 'lesson-audio/' + path, url: u, kind: 'published' }; } }
    const b = await PD.blobs.get(OWN + id).catch(() => null);
    if (b) return { key: 'blob:' + OWN + id, url: URL.createObjectURL(b), kind: 'own' };
    return null;
  }
  const hasOwn = id => !!PD.store.get('ml.hasOwn', {})[id];
  function stemKey(id) {
    const p = published()[id];
    if (p && p.audio && audioUrl(p.audio)) { PD.assets.media['lesson-audio/' + p.audio] = audioUrl(p.audio); return 'lesson-audio/' + p.audio; }
    return hasOwn(id) ? 'blob:' + OWN + id : null;
  }

  /* ---------- time ---------- */
  /** seconds → beat (fractional), along the beat map */
  function beatAt(D, x) {
    const m = D.beats, n = m.length; if (n < 2) return 0;
    if (x <= m[0]) return (x - m[0]) / (m[1] - m[0]);
    if (x >= m[n - 1]) return n - 1 + (x - m[n - 1]) / (m[n - 1] - m[n - 2]);
    let lo = 0, hi = n - 1; while (hi - lo > 1) { const md = (lo + hi) >> 1; if (m[md] <= x) lo = md; else hi = md; }
    return lo + (x - m[lo]) / (m[lo + 1] - m[lo]);
  }
  function timeAt(D, b) {
    const m = D.beats, n = m.length; if (n < 2) return 0;
    if (b <= 0) return m[0] + b * (m[1] - m[0]); if (b >= n - 1) return m[n - 1] + (b - n + 1) * (m[n - 1] - m[n - 2]);
    const k = Math.floor(b); return m[k] + (b - k) * (m[k + 1] - m[k]);
  }
  /** index of the chord sounding at second x */
  function chordIdx(D, x) { const C = D.chords || []; let lo = 0, hi = C.length - 1, k = -1; while (lo <= hi) { const md = (lo + hi) >> 1; if (C[md].t <= x + 1e-4) { k = md; lo = md + 1; } else hi = md - 1; } return k; }
  const chordAt = (D, x) => { const k = chordIdx(D, x); return k >= 0 ? D.chords[k] : null; };
  const playName = c => c ? (c.play || c.chord) : null;

  /* ---------- rhythms: a stroke pattern per section ---------- */
  /** the pattern of a rhythm entry: { span (beats), strokes: [{ dir: down|up|rest|mute, pos (beats from the pattern start), acc, str }] } */
  function pattern(R) {
    if (!R) return { span: 1, strokes: [{ dir: 'down', pos: 0, acc: false }] };
    if (R.strokes && R.strokes.length) return { span: R.span || 1, strokes: R.strokes.map(s => ({ dir: s.dir || 'down', pos: +s.pos || 0, acc: !!s.acc, str: s.str || null })) };
    const r = PD.curriculum.anyRhythm(R.id);
    if (!r) return { span: R.span || 1, strokes: [{ dir: 'down', pos: 0, acc: false }] };
    const span = R.span || 1, dur = (r.timing && r.timing.durations && r.timing.durations.length === r.strokes.length) ? r.timing.durations : r.strokes.map(() => 1), tot = dur.reduce((a, b) => a + b, 0);
    const pos = R.pos && R.pos.length === r.strokes.length ? R.pos : null;   // where the strokes fall, measured from this song
    let at = 0; const out = r.strokes.map((s, i) => { const p = pos ? pos[i] * span : at / tot * span; at += dur[i]; return { dir: s.direction, pos: p, acc: !!s.accent }; });
    if (r.rest) out.push({ dir: 'rest', pos: pos && R.restPos != null ? R.restPos * span : (dur.slice(0, r.rest.after + 1).reduce((a, b) => a + b, 0) - dur[r.rest.after] * r.rest.frac) / tot * span, acc: false });
    return { span, strokes: out.sort((a, b) => a.pos - b.pos) };
  }
  const rhythmAt = (D, b) => { const R = D.rhythm || []; let cur = null; R.forEach(x => { if (x.from <= b + 1e-6) cur = x; }); return cur || R[0] || null; };

  /* ---------- the lesson the engine plays ---------- */
  const SEC_KEYS = ['intro', 'verse', 'chorus', 'inst', 'solo', 'bridge', 'outro'];
  function lessonOf(id) {
    const D = data(id); if (!D || !D.beats || D.beats.length < 3) return null;
    const { chord, N, sec } = PD.build, n = D.beats.length - 1, ev = [], shapes = {};
    for (let r = 0; r < n;) {
      const R = rhythmAt(D, r), P = pattern(R), from = R ? R.from : 0, span = P.span;
      if ((r - from) % span > 1e-6 && r > from) { r++; continue; }
      const st = P.strokes.filter(s => s.dir !== 'rest'), nextR = (D.rhythm || []).find(x => x.from > r + 1e-6);
      st.forEach((s, j) => {
        const b = r + s.pos; if (b >= n || (nextR && b >= nextR.from)) return;
        const nb = j + 1 < st.length ? r + st[j + 1].pos : r + span, all = P.strokes, rest = all.find(x => x.dir === 'rest' && x.pos > s.pos && r + x.pos < nb);
        const d = Math.max(.05, (rest ? r + rest.pos : nb) - b), x = timeAt(D, b), c = chordAt(D, x + .015), nm = playName(c), sh = shape(nm);
        if (!sh) return;
        shapes[nm] = { frets: sh.frets, fingers: sh.fingers, src: 'fact' };
        const dir = s.dir === 'mute' ? 'down' : s.dir;
        if (s.str) ev.push(N(b, s.str, sh.frets[s.str - 1], sh.fingers[s.str - 1], dir, d, s.acc));
        else ev.push(...chord(b, nm, sh.frets, sh.fingers, dir, d, s.acc, 'strum'));
      });
      r += span;
    }
    const cnt = {};
    const secs = (D.sections || []).map(s => {
      const k = SEC_KEYS.includes(s.kind) ? s.kind : 'inst'; cnt[k] = (cnt[k] || 0) + 1;
      const num = ['verse', 'chorus', 'inst', 'solo'].includes(k) ? ' ' + cnt[k] : '', own = s.name && (s.name.ka || s.name.en);
      return Object.assign(sec(own ? s.name.ka || s.name.en : SECKA[k] + num, own ? s.name.en || s.name.ka : SECEN[k] + num, s.from, s.to), { kind: k });
    });
    const used = [...new Set((D.chords || []).map(playName).filter(Boolean))], R0 = (D.rhythm || [])[0], r0 = R0 && PD.curriculum.anyRhythm(R0.id);
    const rnames = [...new Set((D.rhythm || []).map(x => { const r = PD.curriculum.anyRhythm(x.id); return r ? pick(r.name) : null; }).filter(Boolean))];
    const key = stemKey(id);
    return {
      id: D.id || id, v: 2, type: D.kind === 'dance' ? 'melody' : 'song', level: D.level || 2, demo: false, musiclib: true, path: 'songs',
      source: D._verified ? 'verified' : 'transcription', chartSrc: D._verified ? 'verified' : 'transcription',
      title: D.title, artist: D.artist || null,
      desc: { ka: used.slice(0, 6).join(' · ') + (rnames.length ? ' · ' + rnames.join(', ') : '') + ' · ' + Math.round(D.bpm) + ' BPM · ' + (D.meter && D.meter.label || ''), en: used.slice(0, 6).join(' · ') + (rnames.length ? ' · ' + rnames.join(', ') : '') + ' · ' + Math.round(D.bpm) + ' BPM · ' + (D.meter && D.meter.label || '') },
      bpm: D.bpm, meter: [D.meter && D.meter.beatsPerBar || 4, D.meter && D.meter.sub === 3 ? 8 : 4], meterLabel: D.meter && D.meter.label,
      song: D.id || id, stems: key ? { full: key } : null, refOffset: 0, beatMap: D.beats, countIn: 4, cycle: null,
      songRhythm: R0 ? R0.id : null, beatStrokes: r0 ? r0.strokes : null, shapes, events: ev, sections: secs,
      stages: ['demo', 'technique', 'chords', 'slow', 'perform'], technique: { kind: 'rhythm' }, skills: ['chords', 'strumming', 'rhythm']
    };
  }
  const SECKA = { intro: 'შესავალი', verse: 'კუპლეტი', chorus: 'მისამღერი', inst: 'ინსტრუმენტული', solo: 'სოლო', bridge: 'გადასვლა', outro: 'დასასრული' };
  const SECEN = { intro: 'Intro', verse: 'Verse', chorus: 'Chorus', inst: 'Instrumental', solo: 'Solo', bridge: 'Bridge', outro: 'Ending' };
  PD.lessons.provide(() => loaded ? ids().map(id => { try { return lessonOf(id); } catch (e) { console.warn('musiclib', id, e); return null; } }).filter(Boolean) : []);

  /* ---------- loading ---------- */
  async function loadShipped() {
    try {
      const r = await fetch('lessons/songs.json', { cache: 'no-cache' }); if (!r.ok) throw new Error('http ' + r.status);
      const j = await r.json(); SHIPPED = {}; ORDER = [];
      (j.songs || []).forEach(s => { SHIPPED[s.id] = s; ORDER.push(s.id); });
    } catch (e) { console.warn('musiclib: no lessons/songs.json', e); }
  }
  /** what the owner published (readable by everyone); cached for offline */
  async function loadPublished() {
    if (!PD.cloud || !PD.cloud.configured) return;
    try {
      const rows = await PD.cloud.db.select('song_lessons', { select: 'id,published,published_rev,verified,audio_path', published: 'not.is.null' });
      const out = {}; (rows || []).forEach(r => { out[r.id] = { data: r.published, rev: r.published_rev, verified: !!r.verified, audio: r.audio_path || null }; });
      PD.store.set(PUB, out);
    } catch (e) { if (e && e.code !== 'no-backend') console.warn('musiclib: published', e.code || e); }
  }
  let booting = null;
  function boot() {
    if (booting) return booting;
    booting = (async () => { await loadShipped(); loaded = true; PD.lessons.reload(); await loadPublished(); PD.lessons.reload(); })();
    return booting;
  }
  if (!PD.lessons.reload) PD.lessons.reload = () => {};
  setTimeout(boot, 0);
  PD.bus.on('cloud', () => { clearTimeout(boot._t); boot._t = setTimeout(() => loadPublished().then(() => PD.lessons.reload()), 400); });
  async function reviewData() {
    if (REVIEW) return REVIEW;
    try { const r = await fetch('lessons/review.json', { cache: 'no-cache' }); REVIEW = r.ok ? await r.json() : {}; } catch (_) { REVIEW = {}; }
    return REVIEW;
  }

  /* ---------- the learner's own copy of the recording ---------- */
  async function loadOwn(id, D) {
    const f = await PD.ui.pickFile('audio/*,video/*'); if (!f) return false;
    let dur = 0;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)(), buf = await f.arrayBuffer();
      const ab = await new Promise((res, rej) => { const p = ac.decodeAudioData(buf, res, rej); if (p && p.then) p.then(res, rej); });
      dur = ab.duration; try { ac.close(); } catch (_) {}
    } catch (_) { PD.ui.toast(t('ml.badFile')); return false; }
    if (D.duration && Math.abs(dur - D.duration) > 2.5) { PD.ui.toast(t('ml.mismatch', { a: Math.round(dur), b: Math.round(D.duration) }), 5000); return false; }
    await PD.blobs.put(OWN + id, f);
    const m = PD.store.get('ml.hasOwn', {}); m[id] = true; PD.store.set('ml.hasOwn', m);
    PD.ui.toast(t('ml.loaded')); PD.lessons.reload();
    return true;
  }
  async function dropOwn(id) { await PD.blobs.del(OWN + id); const m = PD.store.get('ml.hasOwn', {}); delete m[id]; PD.store.set('ml.hasOwn', m); PD.lessons.reload(); }

  /* ---------- melody on the panduri ---------- */
  const LO = 57, HI = 57 + 17 + 7;   // A3 (open A) … A5 (E string, 17th fret)
  /** the octave shift that puts the most notes on the neck (0 when the song's own register fits) */
  function octaveFor(D) {
    if (D.octave != null) return D.octave;
    const ns = (D.notes || []).map(n => n[2]); if (!ns.length) return 0;
    let best = 0, bs = -1; [-12, 0, 12, 24].forEach(k => { const s = ns.filter(m => m + k >= LO && m + k <= HI).length - (k ? .5 : 0); if (s > bs) { bs = s; best = k; } });
    return best;
  }
  /** string and fret for every note: the owner's own choice when he gave one, else the fingering that keeps the hand
      still (fewest fret jumps, a dynamic programme over the three strings) */
  function tab(D) {
    const k = octaveFor(D), ns = D.notes || [], out = new Array(ns.length);
    const opts = m => [1, 2, 3].map(s => ({ s, f: Math.round(m - PD.theory.midi(s, 0)) })).filter(o => o.f >= 0 && o.f <= PD.instrument.fretCount);
    let prev = [{ s: 0, f: 0, c: 0, path: [] }];
    ns.forEach((n, i) => {
      let m = n[2] + k, folded = 0;
      while (m < LO) { m += 12; folded++; } while (m > HI) { m -= 12; folded--; }   // the panduri version: a note off the neck moves by an octave (the original pitch is kept in the song)
      if (n[3] && n[4] != null) { out[i] = { s: n[3], f: n[4], m, own: true, ok: Math.round(PD.theory.midi(n[3], n[4])) === m }; prev = [{ s: n[3], f: n[4], c: 0 }]; return; }
      const o = opts(m);
      if (!o.length) { out[i] = { s: 0, f: null, m, ok: false }; return; }
      let best = null;
      o.forEach(c => { const p = prev.reduce((a, q) => { const cost = q.c + (q.s ? Math.abs((c.f || q.f) - (q.f || c.f)) * .6 + (c.f > 7 ? .2 * (c.f - 7) : 0) + (c.s !== q.s ? .15 : 0) : c.f * .05); return !a || cost < a.cost ? { cost, q } : a; }, null); if (!best || p.cost < best.cost) best = { cost: p.cost, c }; });
      out[i] = { s: best.c.s, f: best.c.f, m, ok: true, folded };
      prev = o.map(c => ({ s: c.s, f: c.f, c: best.cost }));
    });
    return { notes: out, octave: k };
  }

  /* ---------- the song page block ---------- */
  function css() {
    if (document.getElementById('ml-css')) return;
    document.head.appendChild(h('style', { id: 'ml-css', text: `
.ml{display:flex;flex-direction:column;gap:14px}
.ml-facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.ml-facts div{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.ml-facts small{color:var(--fg3,#8a8a90);font-size:11px;letter-spacing:.04em;text-transform:uppercase}.ml-facts b{font-size:15px}
.ml-src{align-self:flex-start;font-size:11px;padding:3px 9px;border-radius:99px;border:1px solid rgba(200,132,90,.35);color:#d9a27e}
.ml-src.ok{border-color:rgba(110,200,140,.4);color:#8fd6a5}
.ml-player{position:sticky;top:0;z-index:3;background:rgba(10,10,12,.78);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:12px;display:flex;flex-direction:column;gap:10px}
.ml-tr{display:flex;align-items:center;gap:10px}.ml-tr .grow{flex:1}
.ml-pp{width:46px;height:46px;border-radius:50%;border:0;background:linear-gradient(180deg,#d08a5c,#a9603a);color:#140b06;font-size:18px;font-weight:700;cursor:pointer}
.ml-time{font-variant-numeric:tabular-nums;font-size:13px;color:var(--fg2,#c9c9cf)}
.ml-bar{position:relative;height:28px;border-radius:9px;background:rgba(255,255,255,.05);cursor:pointer;overflow:hidden;touch-action:none}
.ml-bar i{position:absolute;top:0;bottom:0;border-right:1px solid rgba(0,0,0,.5)}.ml-bar i.verse,.ml-bar i.chorus{background:rgba(200,132,90,.22)}.ml-bar i.intro,.ml-bar i.outro{background:rgba(255,255,255,.05)}.ml-bar i.inst,.ml-bar i.solo,.ml-bar i.bridge{background:rgba(91,155,213,.16)}
.ml-bar .ph{position:absolute;top:0;bottom:0;width:2px;background:#f0b48a;box-shadow:0 0 8px #f0b48a}
.ml-bar .lp{position:absolute;top:0;bottom:0;background:rgba(240,180,138,.18);border-left:1px solid #f0b48a;border-right:1px solid #f0b48a}
.ml-sp{display:flex;gap:4px;flex-wrap:wrap}.ml-sp button{flex:1;min-width:44px}
.ml-now{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center}
.ml-now .c{font-size:34px;font-weight:800;letter-spacing:-.02em;min-width:2.6em}.ml-now .n{color:var(--fg3,#8a8a90);font-size:14px;text-align:right}
.ml-now .n b{display:block;font-size:20px;color:var(--fg2,#c9c9cf)}
.ml-now svg{width:100%;max-width:220px;height:auto}
.ml-strk{display:flex;gap:6px;justify-content:center;font-size:22px;font-weight:700}.ml-strk span{opacity:.32;transition:opacity .08s}.ml-strk span.on{opacity:1;color:#f0b48a}.ml-strk span.acc{color:#e2574c}
.ml-lyr{display:flex;flex-direction:column;gap:10px;font-size:17px;line-height:1.35}
.ml-line{padding:6px 8px;border-radius:10px}.ml-line.cur{background:rgba(200,132,90,.10)}
.ml-line .w{display:inline-flex;flex-direction:column;vertical-align:bottom}.ml-line .ch{font-size:13px;font-weight:700;color:#e3a37a;min-height:17px;white-space:pre}
.ml-line .sy{white-space:pre;transition:color .08s}.ml-line .sy.on{color:#f0b48a}
.ml-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:6px}
.ml-grid button{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);border-radius:10px;padding:8px 6px;color:inherit;font-weight:700;font-size:14px;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:1px}
.ml-grid button small{font-weight:400;font-size:10px;color:var(--fg3,#8a8a90)}.ml-grid button.cur{border-color:#d08a5c;background:rgba(208,138,92,.16)}
.ml-grid h4{grid-column:1/-1;margin:8px 0 0;font-size:12px;color:var(--fg3,#8a8a90);text-transform:uppercase;letter-spacing:.06em}
.ml-tab{width:100%;height:116px;display:block;border-radius:12px;background:rgba(255,255,255,.03)}
.ml-chips{display:flex;flex-wrap:wrap;gap:6px}.ml-chips button{display:inline-flex;align-items:center;gap:6px}
.ml-adm{border:1px dashed rgba(200,132,90,.45);border-radius:16px;padding:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.ml-adm b{width:100%;font-size:12px;color:#d9a27e;text-transform:uppercase;letter-spacing:.06em}
.ml-dash{display:flex;flex-direction:column;gap:8px}.ml-dash .rowi{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:10px 12px;background:rgba(255,255,255,.03)}
.ml-dash .pill{font-size:11px;padding:3px 9px;border-radius:99px;background:rgba(255,255,255,.07)}.ml-dash .pill.needs-review{background:rgba(226,87,76,.18);color:#f29a91}.ml-dash .pill.published{background:rgba(110,200,140,.18);color:#8fd6a5}.ml-dash .pill.teacher-verified{background:rgba(91,155,213,.2);color:#9cc6ee}.ml-dash .pill.manually-edited{background:rgba(208,138,92,.2);color:#f0b48a}
@media (max-width:560px){.ml-now{grid-template-columns:auto 1fr}.ml-now .n{grid-column:1/-1;text-align:left}}
` }));
  }
  /** a chord as a small neck picture (A string at the bottom, like the practice neck) */
  function chordSVG(sh) {
    if (!sh) return '';
    const maxF = Math.max(4, ...sh.frets), x0 = 28, fw = 26, W = x0 + fw * maxF + 6, ys = { 3: 16, 2: 38, 1: 60 };
    let g = '<svg viewBox="0 0 ' + W + ' 76" aria-hidden="true"><rect x="' + x0 + '" y="6" width="' + fw * maxF + '" height="64" rx="4" fill="#3a170b"/><rect x="' + (x0 - 3) + '" y="5" width="4" height="66" fill="#ddd"/>';
    for (let f = 1; f <= maxF; f++) g += '<line x1="' + (x0 + f * fw) + '" x2="' + (x0 + f * fw) + '" y1="6" y2="70" stroke="#bdbdc2" stroke-width="1.6"/>';
    [1, 2, 3].forEach(s => { g += '<line x1="' + (x0 - 3) + '" x2="' + (x0 + fw * maxF) + '" y1="' + ys[s] + '" y2="' + ys[s] + '" stroke="#e1e1e4" stroke-width="' + (s === 1 ? 2.4 : s === 2 ? 2 : 1.6) + '"/><text x="2" y="' + (ys[s] + 4) + '" fill="#c38c63" font-size="11" font-weight="600">' + PD.theory.stringName(s) + '</text>'; });
    sh.frets.forEach((f, i) => {
      const y = ys[i + 1];
      if (f > 0) { const fi = sh.fingers[i], cx = x0 + (f - .5) * fw; g += '<circle cx="' + cx + '" cy="' + y + '" r="9" fill="' + (PD.fingers ? PD.fingers.color(fi) : '#d08a5c') + '"/><text x="' + cx + '" y="' + (y + 4) + '" fill="' + (PD.fingers ? PD.fingers.ink(fi) : '#140b06') + '" font-size="11" font-weight="700" text-anchor="middle">' + (fi || '') + '</text>'; }
      else g += '<circle cx="' + (x0 - 11) + '" cy="' + y + '" r="4.5" fill="none" stroke="#e1e1e4" stroke-width="1.6"/>';
    });
    return g + '</svg>';
  }
  /** Georgian/any text → syllables with their character offsets: a vowel closes a syllable (ka), spaces stay with the word before */
  function syllables(text) {
    const V = /[აეიოუaeiouAEIOU]/, out = []; let cur = '', start = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i]; if (!cur) start = i; cur += c;
      const nx = text[i + 1] || '';
      if (V.test(c) && nx && !/\s/.test(nx) && !V.test(nx) && /[^\s.,!?;:–—-]/.test(text[i + 2] || '') && !V.test(text[i + 2] || '')) { /* consonant cluster: keep one with the next */ out.push({ i: start, s: cur }); cur = ''; continue; }
      if (V.test(c) && nx && !/\s/.test(nx) && !/[.,!?;:]/.test(nx)) { out.push({ i: start, s: cur }); cur = ''; continue; }
      if (/\s/.test(c)) { out.push({ i: start, s: cur }); cur = ''; }
    }
    if (cur) out.push({ i: start, s: cur });
    return out;
  }

  function sheet(l) {
    const id = l.song || l.id, D = data(id); if (!D) return null;
    css();
    const box = h('section', { class: 'ml', 'data-ml': id });
    const used = [...new Set((D.chords || []).map(playName).filter(Boolean))];
    const tempos = (D.tempo || []).filter(x => x.to - x.from >= 16).map(x => Math.round(x.bpm)), tmin = Math.min(...(tempos.length ? tempos : [Math.round(D.bpm)])), tmax = Math.max(...(tempos.length ? tempos : [Math.round(D.bpm)]));
    const fact = (k, v) => v ? h('div', {}, [h('small', { 'data-t': k }), h('b', { text: v })]) : null;
    box.append(h('span', { class: 'ml-src' + (D._verified ? ' ok' : ''), 'data-t': D._verified ? 'ml.verified' : 'ml.tr' }));
    box.append(h('div', { class: 'ml-facts' }, [fact('ml.artist', pick(D.artist)), fact('ml.key', D.key), fact('ml.tempo', tmin === tmax ? tmin + ' BPM' : tmin + '–' + tmax + ' BPM'),
      fact('ml.meter', D.meter && D.meter.label), fact('ml.len', PD.fmtTime(D.duration || 0)), fact('ml.level', t('lvl.' + (D.level || 2)))]));
    // chords used, each with its panduri shape (and the panduri version when the original has no three-string form)
    const chips = h('div', { class: 'ml-chips' }, used.map(nm => { const sh = shape(nm); return h('button', { class: 'chip', title: sh && sh.adapted ? t('ml.panD', { a: nm, b: sh.name }) : nm, onclick: () => sh && PD.audio.ensure() && PD.audio.strum(sh.frets, 'down', {}) }, [h('b', { text: nm }), sh && sh.adapted ? h('small', { text: '→ ' + sh.name }) : null]); }));
    const orig = [...new Set((D.chords || []).filter(c => c.play && c.play !== c.chord).map(c => c.chord + ' → ' + c.play))];
    box.append(h('div', {}, [h('h3', { 'data-t': 'ml.chords' }), chips, orig.length ? h('small', { class: 'muted', text: t('ml.pan') + ': ' + orig.join(' · ') }) : null]));
    const rids = [...new Set((D.rhythm || []).map(x => x.id))];
    if (rids.length) box.append(h('div', {}, [h('h3', { 'data-t': 'ml.rhythms' }), h('div', { class: 'ml-chips' }, rids.map(rid => { const r = PD.curriculum.anyRhythm(rid); return h('button', { class: 'chip', onclick: () => r && PD.app.go('rhythm', rid), text: r ? pick(r.name) + '  ' + patText(pattern({ id: rid })) : rid }); }))]));
    if (PD.cloud && PD.cloud.isOwner) box.append(adminBar(id, D));
    const pl = h('div', { class: 'ml-player' }); box.append(pl);
    const body = h('div', { class: 'ml', style: 'gap:18px' }); box.append(body);
    player(pl, body, id, D);
    return box;
  }
  const patText = P => P.strokes.map(s => s.dir === 'rest' ? '·' : (s.dir === 'up' ? '↑' : s.dir === 'mute' ? '×' : '↓') + (s.acc ? '>' : '')).join(' ');

  function adminBar(id, D) {
    const go = track => PD.lessonEditor ? PD.lessonEditor.open(id, track) : PD.ui.toast('…');
    return h('div', { class: 'ml-adm' }, [h('b', { 'data-t': 'ml.adm' }),
      ...[['lesson', 'ml.e.lesson'], ['chords', 'ml.e.chords'], ['notes', 'ml.e.notes'], ['rhythm', 'ml.e.rhythm'], ['lyrics', 'ml.e.lyrics'], ['tab', 'ml.e.tab'], ['tempo', 'ml.e.tempo'], ['verify', 'ml.e.verify']]
        .map(([k, key]) => h('button', { class: 'btn small' + (k === 'verify' ? ' primary' : ''), 'data-t': key, onclick: () => go(k) })),
      previews()[id] ? h('button', { class: 'btn small ghost', 'data-t': 'ml.previewOff', onclick: () => { setPreview(id, null); PD.app.render(); } }) : null]);
  }
  function setPreview(id, d) { const m = PD.store.get(PREV, {}) || {}; if (d) m[id] = d; else delete m[id]; PD.store.set(PREV, m); PD.lessons.reload(); }

  /* the player: the recording itself (pitch kept when slowed), everything else follows its clock */
  function player(pl, body, id, D) {
    const audio = new Audio(); audio.preload = 'auto'; audio.preservesPitch = true; audio.mozPreservesPitch = true; audio.webkitPreservesPitch = true;
    let loop = null, raf = 0, src = null;
    const dur = () => audio.duration || D.duration || 1;
    const pp = h('button', { class: 'ml-pp', 'aria-label': t('ml.play'), text: '▶' }), time = h('span', { class: 'ml-time', text: '0:00 / ' + PD.fmtTime(D.duration || 0) });
    const bar = h('div', { class: 'ml-bar', role: 'slider', 'aria-label': t('ml.tapSeek'), tabindex: '0' });
    (D.sections || []).forEach(s => { const a = timeAt(D, s.from), b = timeAt(D, s.to); bar.append(h('i', { class: s.kind, style: 'left:' + (a / (D.duration || 1) * 100) + '%;width:' + ((b - a) / (D.duration || 1) * 100) + '%', title: SECKA[s.kind] })); });
    const lp = h('div', { class: 'lp', hidden: true }), ph = h('div', { class: 'ph' }); bar.append(lp, ph);
    const seekTo = x => { audio.currentTime = Math.max(0, Math.min(dur() - .05, x)); paint(true); };
    bar.addEventListener('pointerdown', e => { const r = bar.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width * dur()); });
    bar.addEventListener('keydown', e => { if (e.key === 'ArrowRight') seekTo(audio.currentTime + 5); if (e.key === 'ArrowLeft') seekTo(audio.currentTime - 5); });
    const speeds = [50, 60, 70, 80, 90, 100], sp = h('div', { class: 'seg ml-sp', role: 'group', 'aria-label': t('ml.speed') }, speeds.map(v => h('button', { 'aria-pressed': String(v === 100), text: v + '%', onclick: e => { audio.playbackRate = v / 100; sp.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.target))); } })));
    const secSel = h('select', { class: 'input', 'aria-label': t('ml.loop'), onchange: e => { const v = e.target.value; if (v === '') { loop = null; lp.hidden = true; } else { const s = D.sections[+v]; loop = [timeAt(D, s.from), timeAt(D, s.to)]; lp.hidden = false; lp.style.left = (loop[0] / dur() * 100) + '%'; lp.style.width = ((loop[1] - loop[0]) / dur() * 100) + '%'; seekTo(loop[0]); } } },
      [h('option', { value: '', 'data-t': 'ml.loopOff' })].concat((D.sections || []).map((s, i) => h('option', { value: String(i), text: (SECKA[s.kind] || s.kind) + ' · ' + PD.fmtTime(timeAt(D, s.from)) }))));
    const nowC = h('div', { class: 'c', text: '—' }), neck = h('div'), nxt = h('div', { class: 'n' }), strk = h('div', { class: 'ml-strk', 'aria-hidden': 'true' });
    const msg = h('div');
    pl.append(msg, h('div', { class: 'ml-tr' }, [pp, h('div', { class: 'grow' }, [bar]), time]), h('div', { class: 'ml-tr' }, [sp, secSel]), h('div', { class: 'ml-now' }, [nowC, neck, nxt]), strk);
    pp.onclick = () => { if (!src) return; if (audio.paused) { audio.play().catch(() => {}); } else audio.pause(); };
    audio.onplay = () => { pp.textContent = '❚❚'; pp.setAttribute('aria-label', t('ml.pause')); tick(); };
    audio.onpause = () => { pp.textContent = '▶'; pp.setAttribute('aria-label', t('ml.play')); cancelAnimationFrame(raf); paint(true); };
    // the source of the sound
    async function attach() {
      const a = await audioOf(id); msg.innerHTML = '';
      if (a) { src = a; audio.src = a.url; pp.disabled = false; if (a.kind === 'own') msg.append(h('div', { class: 'row', style: 'gap:8px;align-items:center' }, [h('small', { class: 'muted', 'data-t': 'ml.own' }), h('button', { class: 'btn small ghost', 'data-t': 'ml.drop', onclick: async () => { audio.pause(); await dropOwn(id); src = null; attach(); } })])); }
      else { src = null; pp.disabled = true; msg.append(h('p', { class: 'notice', 'data-t': 'ml.noAudio' }), h('button', { class: 'btn small', 'data-t': 'ml.load', onclick: async () => { if (await loadOwn(id, D)) attach(); } })); }
      PD.i18n.apply(pl);
    }
    attach();
    // lyrics with chords over their syllables · otherwise the chords bar by bar
    const lyr = lyricsView(D, seekTo), grid = lyr ? null : gridView(D, seekTo), tabv = melodyView(D);
    if (lyr) body.append(h('div', {}, [h('h3', { 'data-t': 'ml.lyrics' }), lyr.el]));
    if (grid) body.append(h('div', {}, [h('h3', { 'data-t': 'ml.chart' }), grid.el]));
    if (tabv) body.append(h('div', {}, [h('h3', { 'data-t': 'ml.melody' }), tabv.el, tabv.note]));
    let lastC = null, lastS = null;
    function paint(force) {
      const x = audio.currentTime || 0;
      time.textContent = PD.fmtTime(x) + ' / ' + PD.fmtTime(dur());
      ph.style.left = (x / dur() * 100) + '%';
      const k = chordIdx(D, x), c = k >= 0 ? D.chords[k] : null, nm = playName(c);
      if (force || k !== lastC) {
        lastC = k; nowC.textContent = nm || '—'; const sh = shape(nm); neck.innerHTML = chordSVG(sh);
        const nc = D.chords[k + 1]; nxt.innerHTML = ''; if (nc) nxt.append(h('small', { 'data-t': 'ml.next' }), h('b', { text: playName(nc) || t('ml.nc') }), h('small', { text: (nc.t - x).toFixed(1) + ' s' }));
        PD.i18n.apply(nxt);
      } else if (D.chords[k + 1]) { const s = nxt.querySelectorAll('small')[1]; if (s) s.textContent = Math.max(0, D.chords[k + 1].t - x).toFixed(1) + ' s'; }
      // the stroke of the rhythm now
      const b = beatAt(D, x), R = rhythmAt(D, b), P = pattern(R), span = P.span, inP = (((b - (R ? R.from : 0)) % span) + span) % span;
      const key = (R ? R.id : '-') + ':' + span;
      if (strk._k !== key) { strk._k = key; strk.innerHTML = ''; P.strokes.forEach(s => strk.append(h('span', { class: s.acc ? 'acc' : '', text: s.dir === 'rest' ? '·' : s.dir === 'up' ? '↑' : s.dir === 'mute' ? '×' : '↓' }))); }
      let cur = -1; P.strokes.forEach((s, i) => { if (inP >= s.pos - .02) cur = i; });
      if (cur !== lastS || force) { lastS = cur; strk.querySelectorAll('span').forEach((e, i) => e.classList.toggle('on', i === cur && !audio.paused)); }
      if (lyr) lyr.at(x); if (grid) grid.at(x, b); if (tabv) tabv.at(x);
    }
    function tick() {
      if (!pl.isConnected) { audio.pause(); audio.src = ''; return; }
      if (loop && audio.currentTime >= loop[1]) audio.currentTime = loop[0];
      paint(false); raf = requestAnimationFrame(tick);
    }
    paint(true);
    PD.bus.on('route', () => { if (!pl.isConnected) { audio.pause(); if (src && src.kind === 'own') URL.revokeObjectURL(src.url); } });
  }
  function lyricsView(D, seekTo) {
    const L = D.lyrics || []; if (!L.length) return null;
    const el = h('div', { class: 'ml-lyr' }), lines = [];
    L.forEach((ln, li) => {
      const syl = ln.syl && ln.syl.length ? ln.syl : syllables(ln.text).map((s, k, a) => ({ i: s.i, t: ln.t + (ln.e - ln.t) * k / a.length }));
      const sylAll = syllables(ln.text), times = sylAll.map((s, k) => { const own = syl.find(y => y.i === s.i); return own ? own.t : ln.t + (ln.e - ln.t) * k / sylAll.length; });
      const row = h('div', { class: 'ml-line', onclick: () => seekTo(ln.t) }), spans = [];
      sylAll.forEach((s, k) => {
        const t0 = times[k], t1 = k + 1 < times.length ? times[k + 1] : ln.e;
        const ch = (D.chords || []).filter(c => c.t >= t0 - .001 && c.t < t1 - .001 && c.t >= ln.t - .3 && c.t < ln.e).map(playName).filter(Boolean);
        const sp = h('span', { class: 'sy', text: s.s });
        row.append(h('span', { class: 'w' }, [h('span', { class: 'ch', text: ch.join(' ') || ' ' }), sp]));
        spans.push({ el: sp, t0, t1 });
      });
      el.append(row); lines.push({ row, spans, t: ln.t, e: ln.e });
    });
    return { el, at(x) { lines.forEach(L2 => { const on = x >= L2.t - .15 && x < L2.e + .2; L2.row.classList.toggle('cur', on); L2.spans.forEach(s => s.el.classList.toggle('on', on && x >= s.t0 && x < s.t1)); }); } };
  }
  function gridView(D, seekTo) {
    const bpb = (D.meter && D.meter.beatsPerBar) || 4, ph = (D.meter && D.meter.phase) || 0, n = D.beats.length - 1, el = h('div', { class: 'ml-grid' }), bars = [];
    const secAt = b => (D.sections || []).find(s => s.from <= b && b < s.to);
    let lastSec = null;
    for (let b = ph > 0 ? ph - bpb : 0; b < n; b += bpb) {
      const a = Math.max(0, b), e = Math.min(n, b + bpb), t0 = D.beats[a], t1 = D.beats[e] || D.duration;
      const sec = secAt(a); if (sec && sec !== lastSec) { lastSec = sec; el.append(h('h4', { text: SECKA[sec.kind] || sec.kind })); }
      const names = []; (D.chords || []).forEach((c, k) => { const end = D.chords[k + 1] ? D.chords[k + 1].t : 1e9; if (c.t < t1 - .02 && end > t0 + .02) { const nm = playName(c) || '—'; if (names[names.length - 1] !== nm) names.push(nm); } });
      const btn = h('button', { onclick: () => seekTo(t0) }, [h('span', { text: names.join(' ') || '—' }), h('small', { text: PD.fmtTime(t0) })]);
      el.append(btn); bars.push({ btn, t0, t1 });
    }
    let cur = null;
    return { el, at(x) { const k = bars.find(B => x >= B.t0 && x < B.t1) || null; if (k !== cur) { if (cur) cur.btn.classList.remove('cur'); cur = k; if (k) { k.btn.classList.add('cur'); if (k.btn.offsetParent && !k.btn._seen) { k.btn.scrollIntoView({ block: 'nearest' }); } } } } };
  }
  function melodyView(D) {
    if (!D.notes || !D.notes.length) return null;
    const T = tab(D), cv = h('canvas', { class: 'ml-tab', 'aria-label': t('ml.melody') }), note = T.octave ? h('small', { class: 'muted', text: t('ml.transp', { n: (T.octave > 0 ? '+' : '') + T.octave / 12 }) }) : null;
    const NN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
    function at(x) {
      const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1, W = Math.max(200, r.width), H = 116;
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = H * dpr; }
      const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const span = 6, x0 = W * .25, px = (W - 30) / span, ys = { 3: 30, 2: 58, 1: 86 };
      g.font = '600 11px system-ui'; g.fillStyle = '#c38c63';
      [1, 2, 3].forEach(s => { g.strokeStyle = 'rgba(255,255,255,.22)'; g.lineWidth = s === 1 ? 2 : 1.4; g.beginPath(); g.moveTo(22, ys[s]); g.lineTo(W, ys[s]); g.stroke(); g.fillText(PD.theory.stringName(s), 4, ys[s] + 4); });
      g.strokeStyle = '#f0b48a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, 12); g.lineTo(x0, H - 8); g.stroke();
      D.notes.forEach((n, i) => {
        const xx = x0 + (n[0] - x) * px; if (xx < 10 || xx > W + 20) return;
        const tb = T.notes[i]; if (!tb) return; const on = x >= n[0] && x < n[0] + n[1];
        const y = tb.s ? ys[tb.s] : 100, w = Math.max(14, n[1] * px);
        g.fillStyle = on ? 'rgba(240,180,138,.9)' : tb.ok ? 'rgba(208,138,92,.32)' : 'rgba(226,87,76,.35)';
        g.beginPath(); g.roundRect ? g.roundRect(xx, y - 9, w, 18, 6) : g.rect(xx, y - 9, w, 18); g.fill();
        g.fillStyle = on ? '#140b06' : '#f3e2d4'; g.font = '700 12px system-ui'; g.fillText(tb.f == null ? '×' : String(tb.f), xx + 4, y + 4);
        if (on) { g.fillStyle = '#f0b48a'; g.font = '600 11px system-ui'; g.fillText(NN[tb.m % 12] + Math.floor(tb.m / 12 - 1), xx, 12); }
      });
    }
    requestAnimationFrame(() => at(0));
    return { el: cv, note, at };
  }

  /* ---------- the owner's dashboard: every song and its state ---------- */
  async function dashboard(w) {
    css();
    if (!(PD.cloud && PD.cloud.isOwner)) { PD.app.go('songs'); return; }
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: PD.ic.back, onclick: () => PD.app.back('profile') }), h('div', { class: 'grow' }, [h('h1', { 'data-t': 'ml.dash' }), h('p', { class: 'muted', 'data-t': 'ml.dashD' })])]));
    const box = h('div', { class: 'ml-dash' }); w.append(box);
    await boot();
    const R = await reviewData();
    let rows = [];
    try { rows = await PD.cloud.db.select('song_lesson_drafts', { select: 'id,status,rev,verified_rev,updated_at' }) || []; } catch (e) { box.append(h('p', { class: 'notice', 'data-t': 'ml.offline' })); }
    const pub = published();
    ids().forEach(id => {
      const D = data(id), row = rows.find(x => x.id === id), rv = (R[id] && R[id].review) || [];
      const status = row ? row.status : (R[id] && R[id].status) || 'analysis-completed';
      box.append(h('div', { class: 'rowi' }, [
        h('div', {}, [h('b', { text: pick(D.title) }), h('div', { class: 'row', style: 'gap:6px;flex-wrap:wrap;margin-top:4px' }, [
          h('span', { class: 'pill ' + status, 'data-t': 'ml.st.' + status }),
          rv.length ? h('span', { class: 'pill needs-review', text: t('ml.review', { n: rv.length }) }) : null,
          h('span', { class: 'pill', 'data-t': pub[id] && pub[id].audio ? 'ml.audioPub' : 'ml.audioNone' }),
          h('small', { class: 'muted', text: [D.key, Math.round(D.bpm) + ' BPM', D.meter && D.meter.label, PD.fmtTime(D.duration || 0)].filter(Boolean).join(' · ') })])]),
        h('div', { class: 'row', style: 'gap:6px' }, [h('button', { class: 'btn small', 'data-t': 'ml.e.lesson', onclick: () => PD.lessonEditor && PD.lessonEditor.open(id, 'lesson') }), h('button', { class: 'btn small ghost', 'data-t': 'home.start', onclick: () => PD.app.go('lesson', id) })])]));
    });
    PD.i18n.apply(box);
  }
  function route(r, w, p) {
    if (r !== 'songadmin') return false;
    dashboard(w); return true;
  }

  return {
    boot, data, ids, shipped: id => SHIPPED[id] || null, published, previews, setPreview, reviewData, loadPublished,
    lessonOf, sheet, route, shape, chordSVG, loadOwn, dropOwn, parse, pattern, patText, tab, octaveFor, syllables, beatAt, timeAt, chordIdx, chordAt, audioOf, audioUrl,
    get loaded() { return loaded; }
  };
})();
