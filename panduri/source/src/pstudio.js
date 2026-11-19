/* =====================================================================
   PANDURI STUDIO — writing and playing music for the panduri, in the app.
   Route 'pstudio'. One project, one engine, five views:
     Fretboard · Piano roll · Rhythm · Arrange · Mixer
   The music model is PD.pstCore (no DOM; the rules a native plugin will
   share). The sound is the app's own: the teacher's panduri recorded on
   every fret of every string (PD.samples), struck stroke by stroke —
   a rhythm is played string after string in the stroke's direction, not
   as three notes at once. Each track has its own channel (volume, pan,
   mute, solo, a meter). Projects save themselves on this device; a
   project file (.panduri) and MIDI go in and out.
   In the app only (APP_ONLY). See docs/studio/ARCHITECTURE.md.
   ===================================================================== */
'use strict';
PD.i18n.add({
  'pst.title': ['Fanduri Studio', 'Fanduri Studio'], 'pst.tile': ['ნოტები, რითმები, სოლო, ტრეკები, MIDI', 'Notes, rhythms, solos, tracks, MIDI'],
  'pst.fret': ['ტარი', 'Fretboard'], 'pst.roll': ['Piano roll', 'Piano roll'], 'pst.rhythm': ['რითმი', 'Rhythm'], 'pst.arrange': ['ტრეკები', 'Arrange'], 'pst.mixer': ['მიქშერი', 'Mixer'],
  'pst.play': ['დაკვრა', 'Play'], 'pst.stop': ['გაჩერება', 'Stop'], 'pst.loop': ['ციკლი', 'Loop'], 'pst.metro': ['მეტრონომი', 'Metronome'], 'pst.count': ['ათვლა', 'Count-in'],
  'pst.bpm': ['BPM', 'BPM'], 'pst.meter': ['ზომა', 'Metre'], 'pst.saved': ['შენახულია', 'Saved'], 'pst.saving': ['ინახება…', 'Saving…'],
  'pst.projects': ['პროექტები', 'Projects'], 'pst.new': ['ახალი პროექტი', 'New project'], 'pst.open': ['გახსნა', 'Open'], 'pst.dup': ['დუბლირება', 'Duplicate'], 'pst.del': ['წაშლა', 'Delete'],
  'pst.delQ': ['წაიშალოს „{n}"?', 'Delete “{n}”?'], 'pst.untitled': ['უსახელო', 'Untitled'], 'pst.copy': ['{n} (ასლი)', '{n} (copy)'],
  'pst.exp': ['.panduri ფაილი', '.panduri file'], 'pst.imp': ['ფაილის გახსნა (.panduri / MIDI)', 'Open a file (.panduri / MIDI)'], 'pst.midi': ['MIDI ექსპორტი', 'Export MIDI'], 'pst.midiT': ['მხოლოდ ეს ტრეკი (MIDI)', 'This track only (MIDI)'],
  'pst.impBad': ['ფაილი ვერ წავიკითხე: {e}', 'The file could not be read: {e}'], 'pst.impNew': ['ეს ფაილი აპის უფრო ახალი ვერსიითაა შექმნილი — განაახლე აპი.', 'This file was made by a newer version of the app — update the app.'],
  'pst.midiIn': ['MIDI-დან დაემატა {n} ტრეკი; {u} ნოტი ფანდურს არ აქვს (ნაჩვენებია, არ ჟღერს).', '{n} track(s) added from MIDI; {u} note(s) the fanduri does not have (shown, not played).'],
  'pst.track': ['ტრეკი', 'Track'], 'pst.addNotes': ['+ მელოდიის ტრეკი', '+ Melody track'], 'pst.addRhythm': ['+ რითმის ტრეკი', '+ Rhythm track'], 'pst.kNotes': ['მელოდია / სოლო', 'Melody / solo'], 'pst.kRhythm': ['რითმი', 'Rhythm'],
  'pst.mute': ['M', 'M'], 'pst.solo': ['S', 'S'], 'pst.vol': ['ხმა', 'Volume'], 'pst.pan': ['მხარე', 'Pan'], 'pst.name': ['სახელი', 'Name'],
  'pst.insert': ['ჩაწერა ტარიდან', 'Write from the neck'], 'pst.chordMode': ['აკორდი (ერთ დროზე)', 'Chord (same time)'], 'pst.len': ['ხანგრძლივობა', 'Length'], 'pst.velo': ['სიმძლავრე', 'Velocity'],
  'pst.cursor': ['კურსორი: ტაქტი {b} · დარტყმა {k}', 'Cursor: bar {b} · beat {k}'], 'pst.back1': ['← უკან', '← Back'], 'pst.fwd1': ['წინ →', 'Forward →'], 'pst.home': ['დასაწყისში', 'To the start'],
  'pst.fretHint': ['შეეხე სიმსა და ლადს — მოისმენ. ჩართე „ჩაწერა ტარიდან", და ნოტი კურსორის ადგილზე ჩაიწერება.', 'Touch a string at a fret to hear it. Turn on “Write from the neck” and the note is written at the cursor.'],
  'pst.pickNotes': ['აირჩიე მელოდიის ტრეკი', 'Choose a melody track'], 'pst.pickRhythm': ['აირჩიე რითმის ტრეკი', 'Choose a rhythm track'],
  'pst.sel': ['არჩეული ნოტი', 'Selected note'], 'pst.none': ['ნოტი არ არის არჩეული', 'No note selected'], 'pst.str': ['სიმი', 'String'], 'pst.fretN': ['ლადი', 'Fret'],
  'pst.dur': ['ხანგრძლ. (დარტყ.)', 'Duration (beats)'], 'pst.art': ['არტიკულაცია', 'Articulation'], 'pst.offset': ['გადახრა (მწმ)', 'Offset (ms)'], 'pst.alt': ['სხვა ადგილი ტარზე', 'Another place on the neck'],
  'pst.unplay': ['ფანდურს ეს ნოტი არ აქვს — ნაჩვენებია, მაგრამ არ ჟღერს', 'The fanduri does not have this note — shown, not played'],
  'pst.a.pluck': ['ჩვეულებრივი', 'Normal pluck'], 'pst.a.down': ['ჩაკვრა', 'Downstroke'], 'pst.a.up': ['ამოკვრა', 'Upstroke'], 'pst.a.mute': ['ჩახშობილი', 'Muted'],
  'pst.quant': ['კვანტიზაცია', 'Quantize'], 'pst.human': ['ჰუმანიზაცია', 'Humanize'], 'pst.tr': ['ტრანსპოზიცია', 'Transpose'], 'pst.dupN': ['ნოტის გამრავლება', 'Duplicate note'], 'pst.delN': ['ნოტის წაშლა', 'Delete note'],
  'pst.undo': ['უკან', 'Undo'], 'pst.redo': ['წინ', 'Redo'], 'pst.grid': ['ბადე', 'Grid'],
  'pst.preset': ['რითმი', 'Rhythm'], 'pst.bars': ['ტაქტები', 'Bars'], 'pst.swing': ['სვინგი', 'Swing'], 'pst.addStep': ['+ დარტყმა', '+ Stroke'], 'pst.delStep': ['დარტყმის წაშლა', 'Remove stroke'],
  'pst.down': ['ჩაკვრა ↓', 'Down ↓'], 'pst.up': ['ამოკვრა ↑', 'Up ↑'], 'pst.acc': ['აქცენტი', 'Accent'], 'pst.mutedS': ['ჩახშობა', 'Mute'], 'pst.stepLen': ['ხანგრძლ.', 'Length'],
  'pst.chords': ['აკორდები ტაქტებზე', 'Chords by bar'], 'pst.chordNone': ['—', '—'], 'pst.pickChord': ['აკორდი ტაქტისთვის {n}', 'Chord for bar {n}'], 'pst.noShape': ['ფანდურზე ფორმა არ აქვს', 'No shape on the fanduri'],
  'pst.voicing': ['ფორმა', 'Voicing'], 'pst.preview': ['მხოლოდ ეს რითმი', 'This rhythm only'],
  'pst.tDefault': ['მასწავლებელს ამ რითმის დარტყმების ხანგრძლივობა ჯერ არ მოუცია — აქ თანაბარია. მიმართულება და აქცენტები მისია; ხანგრძლივობა შენი პროექტისთვის შეცვალე.', 'The teacher has not given this rhythm\'s stroke lengths yet — here they are even. The directions and accents are his; set the lengths for your project.'],
  'pst.teacherR': ['მასწავლებლის რითმი', 'The teacher\'s rhythm'],
  'pst.loopFrom': ['ციკლი: ტაქტიდან', 'Loop: from bar'], 'pst.loopTo': ['ტაქტამდე', 'to bar'],
  'pst.sound': ['ხმა', 'Sound'], 'pst.soundD': ['მასწავლებლის ფანდური, ჩაწერილი ყოველ ლადზე (ერთი ჩანაწერი ნოტზე). სიმძლავრე ხმას ცვლის; სხვადასხვა ძალით და რამდენჯერმე ჩაწერილი ნოტები (velocity layers, round robin) ჯერ არ არის — ძრავი მათ მიიღებს, როგორც კი ჩაიწერება.', 'The teacher\'s fanduri, recorded on every fret (one take per note). Velocity changes the level; notes recorded at several strengths and several times (velocity layers, round robin) are not there yet — the engine takes them as soon as they are recorded.'],
  'pst.synth': ['ამ ფაილში ჩანაწერები არ არის — ჟღერს ფიზიკური მოდელი.', 'This build carries no recordings — a physical model sounds instead.'],
  'pst.empty': ['ამ ტრეკზე ნოტი ჯერ არ არის.', 'No notes on this track yet.']
});

PD.pstudio = (() => {
  const h = PD.h, t = PD.i18n.t, C = () => PD.pstCore, A = () => PD.audio, T = () => PD.theory;
  const L = o => o && typeof o === 'object' && !Array.isArray(o) ? PD.i18n.pick(o) : o;
  const LIST = 'pst.list', KEY = id => 'pst.p.' + id, LAST = 'pst.last';
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const SNAME = s => T().stringName(s);

  /* ---------- the project, saved by itself ---------- */
  let P = null, undo = [], redo = [], saveT = 0, onSaved = null;
  function list() { return PD.store.get(LIST, []); }
  function persist(now) {
    clearTimeout(saveT);
    const go = () => { if (!P) return; P.modified = Date.now(); PD.store.set(KEY(P.id), P); const l = list().filter(x => x.id !== P.id); l.unshift({ id: P.id, name: P.name, modified: P.modified }); PD.store.set(LIST, l.slice(0, 200)); PD.store.set(LAST, P.id); onSaved && onSaved(true); };
    if (now) go(); else { onSaved && onSaved(false); saveT = setTimeout(go, 600); }
  }
  /** every change goes through here: undo, the save, the redraw */
  function change(fn, quiet) { undo.push(JSON.stringify(P)); if (undo.length > 120) undo.shift(); redo = []; const b0 = P.bpm; fn(P); persist(); refreshPlay(b0); if (!quiet) redraw(); }
  function doUndo() { if (!undo.length) return; redo.push(JSON.stringify(P)); P = C().parse(undo.pop()); persist(); redraw(); }
  function doRedo() { if (!redo.length) return; undo.push(JSON.stringify(P)); P = C().parse(redo.pop()); persist(); redraw(); }
  function load(id) { const o = PD.store.get(KEY(id), null); if (!o) return null; try { return C().parse(o); } catch (_) { return null; } }
  function openProject(p) { stop(); P = p; undo = []; redo = []; persist(true); selTrack = (P.tracks.find(x => x.kind === 'notes') || P.tracks[0] || {}).id; cursor = 0; build(); }
  function fresh() { const p = C().project(t('pst.untitled')); p.tracks[0].name = t('pst.kRhythm'); p.tracks[1].name = t('pst.kNotes'); return p; }

  /* ---------- the engine: one channel per track, a look-ahead scheduler ---------- */
  const ch = new Map();   // track id → { g, pan, an }
  function channel(tr) {
    const ctx = A().ensure(); if (!ctx) return null;
    let c = ch.get(tr.id);
    if (!c) { const g = ctx.createGain(), pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null, an = ctx.createAnalyser(); an.fftSize = 512;
      if (pan) { g.connect(pan); pan.connect(an); } else g.connect(an); an.connect(A().inst || ctx.destination); c = { g, pan, an, buf: new Float32Array(512) }; ch.set(tr.id, c); }
    const solo = P.tracks.some(x => x.solo), on = solo ? tr.solo : !tr.mute;
    c.g.gain.setTargetAtTime(on ? tr.vol : 0, ctx.currentTime, .02); if (c.pan) c.pan.pan.setTargetAtTime(tr.pan, ctx.currentTime, .02);
    return c;
  }
  const spb = () => 60 / P.bpm;
  let playing = false, t0 = 0, from = 0, evs = [], ei = 0, timer = 0, raf = 0, metroNext = 0, only = null, loopEnd = 0, countEnd = 0;
  function play(opt) {
    const ctx = A().ensure(); if (!ctx || !P) return;
    stop(); opt = opt || {}; only = opt.only || null;
    P.tracks.forEach(channel);
    const lp = P.loop && P.loop.on, bar = C().bpb(P);
    from = lp ? P.loop.from * bar : (opt.from != null ? opt.from : head);
    loopEnd = lp ? P.loop.to * bar : C().length(P) + .5;
    const ci = P.countIn && !opt.noCount ? bar : 0;
    t0 = ctx.currentTime + .12 + ci * spb() - from * spb(); countEnd = from;
    evs = C().events(P, { only }); ei = evs.findIndex(e => e.t >= from - 1e-6); if (ei < 0) ei = evs.length;
    metroNext = Math.ceil(from - ci - 1e-6);
    playing = true; timer = setInterval(pump, 25); pump(); tickUI(); paintTransport();
  }
  const firstAt = b => { const i = evs.findIndex(e => e.t >= b - 1e-6); return i < 0 ? evs.length : i; };
  function pump() {
    const ctx = A().ctx; if (!ctx || !playing) return;
    const ahead = ctx.currentTime + .16, s = spb(), lp = P.loop && P.loop.on, bar = C().bpb(P);
    for (let pass = 0; pass < 4; pass++) {
      const edge = t0 + loopEnd * s;
      // the metronome (and the count-in: a bar of clicks before the start)
      while ((P.metro || metroNext < countEnd) && metroNext < loopEnd && t0 + metroNext * s < ahead) { const w = t0 + metroNext * s; if (w >= ctx.currentTime - .01) A().click(w, ((metroNext % bar) + bar) % bar === 0); metroNext++; }
      while (ei < evs.length && evs[ei].t < loopEnd && t0 + evs[ei].t * s < ahead) {
        const e = evs[ei++], tr = P.tracks.find(x => x.id === e.track), c = tr && channel(tr); if (!c) continue;
        const when = Math.max(ctx.currentTime, t0 + e.t * s);
        if (e.kind === 'note') A().note(e.s, e.f, { when, vel: e.v, dur: Math.max(.08, e.d * s), out: c.g, art: e.art === 'mute' ? 'mute' : e.art === 'up' ? 'up' : e.art === 'down' ? 'down' : 'pluck' });
        else A().strum(e.frets, e.dir, { when, vel: e.v, mute: e.mute, out: c.g, dur: e.mute ? .1 : Math.max(.12, e.d * s), gap: .016 });
      }
      // the loop goes round without a gap: the next turn is scheduled before this one ends
      if (lp && edge < ahead) { t0 += (loopEnd - from) * s; ei = firstAt(from); metroNext = Math.ceil(from - 1e-6); countEnd = from; continue; }
      break;
    }
    if (!lp && t0 + loopEnd * s < ctx.currentTime) stop(true);
  }
  /** an edit while playing: the new notes are heard from the next beat on, a new tempo keeps the place */
  function refreshPlay(oldBpm) {
    if (!playing) return; const ctx = A().ctx;
    if (oldBpm && oldBpm !== P.bpm) { const b = (ctx.currentTime - t0) / (60 / oldBpm); t0 = ctx.currentTime - b * spb(); }
    evs = C().events(P, { only }); ei = firstAt(Math.max(from, (ctx.currentTime + .17 - t0) / spb()));
    if (!(P.loop && P.loop.on)) loopEnd = C().length(P) + .5;
  }
  let head = 0;   // the playhead, in beats
  function stop(atEnd) {
    if (!playing) { paintTransport(); return; }
    playing = false; clearInterval(timer); cancelAnimationFrame(raf);
    const ctx = A().ctx; if (ctx) ch.forEach(c => { c.g.gain.cancelScheduledValues(ctx.currentTime); c.g.gain.setTargetAtTime(0, ctx.currentTime, .03); });   // the ringing strings are damped
    setTimeout(() => { if (!playing && P) P.tracks.forEach(channel); }, 180);
    if (atEnd) head = 0;
    paintTransport(); views[mode] && views[mode].tick && views[mode].tick(head);
  }
  function tickUI() {
    if (!playing) return; const ctx = A().ctx;
    head = Math.max(0, (ctx.currentTime - t0) / spb()); if (P.loop && P.loop.on && head < from) head += P.loop.to * C().bpb(P) - from;   // just before a turn of the loop
    if (posEl) { const bar = C().bpb(P), b = Math.floor(head / bar), k = head - b * bar; posEl.textContent = (b + 1) + '.' + (Math.floor(k) + 1); }
    views[mode] && views[mode].tick && views[mode].tick(head);
    meters();
    raf = requestAnimationFrame(tickUI);
  }
  function meters() { document.querySelectorAll('.pst-meter[data-t]').forEach(m => { const c = ch.get(m.dataset.t); if (!c) return; c.an.getFloatTimeDomainData(c.buf); let pk = 0; for (let i = 0; i < c.buf.length; i++) pk = Math.max(pk, Math.abs(c.buf[i])); m.firstChild.style.height = Math.min(100, Math.sqrt(pk) * 110) + '%'; m.classList.toggle('hot', pk > .95); }); }
  const audition = (s, f, v) => { const tr = curTrack(), c = tr && channel(tr); A().note(s, f, { vel: v || vel, dur: .9, out: c ? c.g : undefined }); };

  /* ---------- the page ---------- */
  let root = null, mode = 'fret', selTrack = null, cursor = 0, len = .5, vel = .78, insert = false, chordMode = false, posEl = null, playB = null, saveEl = null, views = {}, wrapEl = null;
  const curTrack = () => P && P.tracks.find(x => x.id === selTrack);
  function page(w, param) {
    style(); wrapEl = w;
    if (!P) { const last = PD.store.get(LAST, null); P = (last && load(last)) || null; if (!P) { P = fresh(); persist(true); } selTrack = (P.tracks.find(x => x.kind === 'notes') || P.tracks[0]).id; }
    if (param && ['fret', 'roll', 'rhythm', 'arrange', 'mixer'].includes(param)) mode = param;
    build();
    document.removeEventListener('keydown', keys); document.addEventListener('keydown', keys);
    const off = PD.bus.on('route', () => { stop(); document.removeEventListener('keydown', keys); off && off(); });
  }
  function keys(e) {
    if (!root || !root.isConnected) return; if (e.target.closest('input,textarea,select,[contenteditable]')) return;
    if (e.code === 'Space') { e.preventDefault(); playing ? stop() : play(); }
    else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? doRedo() : doUndo(); }
  }
  function build() {
    const w = wrapEl; if (!w) return; w.innerHTML = '';
    root = h('section', { class: 'pst' }); w.append(root);
    // the top bar: the project, the transport, the tempo
    const name = h('input', { class: 'pst-name', value: P.name, 'aria-label': t('pst.name'), onchange: e => change(p => { p.name = e.target.value.trim() || t('pst.untitled'); }, true) });
    playB = h('button', { class: 'btn primary pst-play', onclick: () => playing ? stop() : play() });
    const stopB = h('button', { class: 'btn', 'aria-label': t('pst.stop'), text: '■', onclick: () => { stop(); head = 0; cursor = 0; redraw(); } });
    const bpm = h('input', { class: 'pst-num', type: 'number', min: 20, max: 320, value: P.bpm, 'aria-label': t('pst.bpm'), onchange: e => change(p => { p.bpm = clamp(+e.target.value || 90, 20, 320); }) });
    const meter = h('select', { class: 'pst-sel', 'aria-label': t('pst.meter'), onchange: e => change(p => { p.meter = e.target.value.split('/').map(Number); }) }, ['2/4', '3/4', '4/4', '5/8', '6/8', '7/8', '9/8', '12/8'].map(m => h('option', { value: m, text: m, selected: P.meter.join('/') === m })));
    const tg = (k, get, set) => { const b = h('button', { class: 'chip pst-tg', 'aria-pressed': String(!!get()), text: t(k), onclick: () => { change(p => set(p, !get())); b.setAttribute('aria-pressed', String(!!get())); } }); return b; };
    posEl = h('b', { class: 'pst-pos mono', text: '1.1' }); saveEl = h('small', { class: 'muted pst-saved', text: t('pst.saved') });
    onSaved = ok => { if (saveEl) saveEl.textContent = t(ok ? 'pst.saved' : 'pst.saving'); };
    root.append(h('div', { class: 'pst-top' }, [
      h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => PD.app.back('practice') }),
      h('b', { class: 'pst-brand', text: 'Fanduri Studio' }), name, saveEl, h('span', { class: 'grow' }),
      h('button', { class: 'btn small', text: t('pst.projects'), onclick: projects }),
      h('button', { class: 'btn small', text: t('pst.undo'), onclick: doUndo }), h('button', { class: 'btn small', text: t('pst.redo'), onclick: doRedo })]),
      h('div', { class: 'pst-transport' }, [playB, stopB, posEl, h('label', { class: 'pst-lab' }, [h('small', { text: 'BPM' }), bpm]), h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.meter') }), meter]),
        tg('pst.loop', () => P.loop.on, (p, v) => { p.loop.on = v; }), tg('pst.metro', () => P.metro, (p, v) => { p.metro = v; }), tg('pst.count', () => P.countIn, (p, v) => { p.countIn = v; })]));
    // the tracks, as chips (the views follow the chosen one)
    const tracks = h('div', { class: 'pst-tracks chips-row' }, P.tracks.map(tr => h('button', { class: 'chip pst-tc' + (tr.id === selTrack ? ' on' : ''), style: '--c:' + tr.color, onclick: () => { selTrack = tr.id; build(); } }, [h('i'), h('span', { text: (tr.kind === 'rhythm' ? '↓↑ ' : '♪ ') + (tr.name || t('pst.track')) })])));
    const tabs = h('div', { class: 'pst-tabs', role: 'tablist' }, [['fret', 'pst.fret'], ['roll', 'pst.roll'], ['rhythm', 'pst.rhythm'], ['arrange', 'pst.arrange'], ['mixer', 'pst.mixer']].map(([k, key]) => h('button', { role: 'tab', class: k === mode ? 'on' : '', 'aria-selected': String(k === mode), text: t(key), onclick: () => { mode = k; const want = k === 'rhythm' ? 'rhythm' : (k === 'fret' || k === 'roll') ? 'notes' : null, cur = curTrack(); if (want && (!cur || cur.kind !== want)) { const x = P.tracks.find(q => q.kind === want); if (x) selTrack = x.id; } build(); } })));   // a view picks a track it can show
    const body = h('div', { class: 'pst-body' });
    root.append(tabs, tracks, body);
    Object.values(views).forEach(v => v && v.stop && v.stop()); views = {};
    views[mode] = ({ fret: fretView, roll: rollView, rhythm: rhythmView, arrange: arrangeView, mixer: mixerView })[mode](body);
    paintTransport(); PD.i18n.apply(root);
  }
  function redraw() { if (!root || !root.isConnected) return; const v = views[mode]; if (v && v.redraw) v.redraw(); else build(); }
  function paintTransport() { if (playB) playB.innerHTML = (playing ? '❚❚ ' : '▶ ') + '<span>' + PD.esc(t(playing ? 'pst.stop' : 'pst.play')) + '</span>'; }

  /* ---------- Fretboard ---------- */
  function fretView(box) {
    const tr = curTrack(); const FR = T().FRETS || 17;
    if (!tr || tr.kind !== 'notes') { box.append(h('p', { class: 'notice', text: t('pst.pickNotes') })); return null; }
    const cv = h('canvas', { class: 'pst-neck', role: 'application', 'aria-label': t('pst.fret') }), g = cv.getContext('2d');
    const curEl = h('small', { class: 'muted mono' });
    const lens = h('select', { class: 'pst-sel', 'aria-label': t('pst.len'), onchange: e => { len = +e.target.value; } }, [[4, '1'], [2, '1/2'], [1, '1/4'], [.5, '1/8'], [.25, '1/16'], [1 / 3, '1/8 ³']].map(([v, l]) => h('option', { value: v, text: l, selected: Math.abs(v - len) < 1e-6 })));
    const velIn = h('input', { type: 'range', min: 5, max: 100, value: Math.round(vel * 100), 'aria-label': t('pst.velo'), oninput: e => { vel = +e.target.value / 100; } });
    const insB = h('button', { class: 'chip pst-tg', 'aria-pressed': String(insert), text: t('pst.insert'), onclick: () => { insert = !insert; insB.setAttribute('aria-pressed', String(insert)); } });
    const chB = h('button', { class: 'chip pst-tg', 'aria-pressed': String(chordMode), text: t('pst.chordMode'), onclick: () => { chordMode = !chordMode; chB.setAttribute('aria-pressed', String(chordMode)); } });
    const step = k => { cursor = Math.max(0, cursor + k * len); paint(); };
    box.append(h('div', { class: 'pst-tools' }, [insB, chB, h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.len') }), lens]), h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.velo') }), velIn]),
      h('button', { class: 'btn small', text: t('pst.back1'), onclick: () => step(-1) }), h('button', { class: 'btn small', text: t('pst.fwd1'), onclick: () => step(1) }), h('button', { class: 'btn small', text: t('pst.home'), onclick: () => { cursor = 0; paint(); } }), curEl]),
      h('div', { class: 'pst-neckwrap' }, [cv]), h('small', { class: 'muted', text: t('pst.fretHint') }));
    let insp = inspector(); box.append(insp);
    const reInsp = () => { const n2 = inspector(); insp.replaceWith(n2); insp = n2; PD.i18n.apply(n2); };
    let W = 0, H = 0, dpr = 1, lit = new Set();
    const geo = () => { const L = 46, R = W - 12, top = 18, bot = H - 30, u = (R - L) / (FR + 1); return { L, R, top, bot, u, y: s => top + (3 - s + .5) * (bot - top) / 3 }; };
    function paint() {
      if (!W) return; const q = geo(); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      const wood = g.createLinearGradient(0, q.top, 0, q.bot); wood.addColorStop(0, '#5b3620'); wood.addColorStop(.5, '#6d4128'); wood.addColorStop(1, '#4a2b18');
      g.fillStyle = '#0b0b0c'; g.fillRect(0, 0, W, H); g.fillStyle = wood; g.fillRect(q.L, q.top, q.R - q.L, q.bot - q.top);
      for (let f = 0; f <= FR + 1; f++) { const x = q.L + f * q.u; g.fillStyle = f === 1 ? '#eee2c8' : 'rgba(225,225,232,.65)'; g.fillRect(x - (f === 1 ? 2 : .8), q.top, f === 1 ? 4 : 1.6, q.bot - q.top); }
      [3, 5, 7, 9, 12, 15].forEach(f => { if (f > FR) return; const x = q.L + (f + .5) * q.u; g.fillStyle = 'rgba(240,200,90,.7)'; (f === 12 ? [q.top + (q.bot - q.top) * .3, q.top + (q.bot - q.top) * .7] : [(q.top + q.bot) / 2]).forEach(y => { g.beginPath(); g.arc(x, y, 3.4, 0, 7); g.fill(); }); });
      const COL = { 1: '#e58a4e', 2: '#6fa9e0', 3: '#efe3c4' };
      [1, 2, 3].forEach(s => { const y = q.y(s); g.strokeStyle = COL[s]; g.lineWidth = s === 1 ? 2.6 : s === 2 ? 2 : 1.5; g.beginPath(); g.moveTo(q.L, y); g.lineTo(q.R, y); g.stroke(); g.fillStyle = COL[s]; g.font = '700 12px system-ui'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(SNAME(s), q.L - 10, y); });
      g.textAlign = 'center'; g.font = '600 11px system-ui'; for (let f = 0; f <= FR; f++) { g.fillStyle = [3, 5, 7, 9, 12, 15].includes(f) ? '#cbb27a' : '#77777d'; g.fillText(String(f), q.L + (f + .5) * q.u, H - 14); }
      // the notes at the cursor (being written) and those sounding now
      const at = playing ? head : cursor, here = tr.notes.filter(n => C().reach(n) && n.t <= at + 1e-6 && n.t + n.d > at + 1e-6);
      here.forEach(n => { const x = q.L + (n.f + .5) * q.u, y = q.y(n.s); g.fillStyle = playing ? '#ffd7a8' : 'rgba(217,154,100,.9)'; g.shadowColor = 'rgba(255,190,120,.9)'; g.shadowBlur = playing ? 14 : 0; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); g.shadowBlur = 0; g.fillStyle = '#1a0f07'; g.font = '800 11px system-ui'; g.fillText(String(n.f), x, y + .5); });
      lit.forEach(k => { const [s, f] = k.split(':').map(Number), x = q.L + (f + .5) * q.u, y = q.y(s); g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 13, 0, 7); g.stroke(); });
      const bar = C().bpb(P), b = Math.floor(cursor / bar); curEl.textContent = t('pst.cursor', { b: b + 1, k: (Math.round((cursor - b * bar) * 100) / 100 + 1) });
    }
    function resize() { const r = cv.getBoundingClientRect(); if (!r.width) return; dpr = Math.min(2, devicePixelRatio || 1); W = Math.round(r.width); H = Math.round(r.height); cv.width = W * dpr; cv.height = H * dpr; paint(); }
    cv.addEventListener('pointerdown', e => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, q = geo();
      const f = Math.floor((x - q.L) / q.u), s = clamp(3 - Math.floor((y - q.top) / ((q.bot - q.top) / 3)), 1, 3);
      if (f < 0 || f > FR || y < q.top - 6 || y > q.bot + 6) return;
      audition(s, f); const k = s + ':' + f; lit.add(k); paint(); setTimeout(() => { lit.delete(k); paint(); }, 260);
      if (insert) { change(p => { const tr2 = p.tracks.find(x => x.id === tr.id); tr2.notes = tr2.notes.filter(n => !(n.s === s && Math.abs(n.t - cursor) < 1e-6)); const nn = C().note({ s, f, t: cursor, d: len, v: vel }); tr2.notes.push(nn); selNote = nn.id; if (!chordMode) cursor += len; }, true); paint(); reInsp(); }
    });
    const ro = window.ResizeObserver ? new ResizeObserver(resize) : null; if (ro) ro.observe(cv); requestAnimationFrame(resize);
    return { tick: () => paint(), redraw: () => { paint(); reInsp(); }, stop: () => ro && ro.disconnect() };
  }

  /* ---------- the note inspector (fretboard and roll share it) ---------- */
  let selNote = null;
  function inspector() {
    const box = h('div', { class: 'pst-insp' }), tr = curTrack();
    const n = tr && tr.notes && tr.notes.find(x => x.id === selNote);
    if (!n) { box.append(h('small', { class: 'muted', text: t('pst.none') })); return box; }
    const set = patch => change(p => { const x = p.tracks.find(k => k.id === tr.id).notes.find(k => k.id === n.id); Object.assign(x, patch); if (patch.m != null || patch.s != null) Object.assign(x, C().note(x)); });
    const nm = T().name(n.m), alts = C().places(n.m).filter(pp => !(pp.s === n.s && pp.f === n.f));
    box.append(h('b', { text: t('pst.sel') + ' · ' + nm }),
      C().reach(n) ? h('small', { class: 'muted', text: t('pst.str') + ' ' + SNAME(n.s) + ' · ' + t('pst.fretN') + ' ' + n.f }) : h('small', { class: 'notice', text: t('pst.unplay') }),
      h('label', {}, [h('span', { text: t('pst.velo') }), h('input', { type: 'number', min: 1, max: 127, value: Math.round(n.v * 127), onchange: e => set({ v: clamp(+e.target.value / 127, .01, 1) }) })]),
      h('label', {}, [h('span', { text: t('pst.dur') }), h('input', { type: 'number', min: .03, step: .25, value: +n.d.toFixed(3), onchange: e => set({ d: Math.max(1 / 32, +e.target.value) }) })]),
      h('label', {}, [h('span', { text: t('pst.art') }), h('select', { onchange: e => set({ art: e.target.value }) }, ['pluck', 'down', 'up', 'mute'].map(a => h('option', { value: a, text: t('pst.a.' + a), selected: n.art === a })))]),
      h('label', {}, [h('span', { text: t('pst.offset') }), h('input', { type: 'number', step: 5, value: Math.round((n.off || 0) * spb() * 1000), onchange: e => set({ off: (+e.target.value / 1000) / spb() }) })]),
      alts.length ? h('div', { class: 'pst-alts' }, [h('small', { text: t('pst.alt') + ':' })].concat(alts.map(pp => h('button', { class: 'chip', text: SNAME(pp.s) + ' · ' + pp.f, onclick: () => set({ s: pp.s, f: pp.f }) })))) : null);
    return box;
  }

  /* ---------- Piano roll: the AI studio's canvas roll, on this track ---------- */
  const rollState = {};
  function rollView(box) {
    const tr = curTrack(); if (!tr || tr.kind !== 'notes') { box.append(h('p', { class: 'notice', text: t('pst.pickNotes') })); return null; }
    const s = spb(), Lb = Math.max(C().length(P), 16) + 8, beats = Array.from({ length: Math.ceil(Lb) + 1 }, (_, i) => i * s);
    const rch = P.tracks.find(x => x.kind === 'rhythm'), bar = C().bpb(P);
    const M = { bpm: P.bpm, beats, dur: Lb * s, metre: { beatsPerBar: bar }, key: null,
      chords: rch ? (rch.rhythm.chords || []).map(c => ({ name: c.name, t0: c.bar * bar * s, t1: (c.bar + 1) * bar * s })) : [],
      notes: tr.notes.map(n => ({ id: n.id, m: n.m, t0: n.t * s, t1: (n.t + n.d) * s, velocity: Math.round(n.v * 127), conf: 1, reach: C().reach(n), s: n.s, f: n.f })) };
    const toNote = (x, n) => Object.assign(x, { t: Math.max(0, n.t0 / s), d: Math.max(1 / 32, (n.t1 - n.t0) / s), v: clamp((n.velocity || 90) / 127, .01, 1) });
    let insp = null; const roll = (PD.aiRoll || PD.aiPiano)(M, { state: rollState, pos: () => head * s, seek: sec => { head = sec / s; cursor = head; if (insp && rollState.selected !== selNote) { selNote = rollState.selected; const n2 = inspector(); insp.replaceWith(n2); insp = n2; PD.i18n.apply(n2); } }, playing: () => playing, canEdit: () => true, canUndo: () => undo.length > 0, undo: doUndo,
      change: (n, patch) => { change(p => { const x = p.tracks.find(k => k.id === tr.id).notes.find(k => k.id === n.id); if (!x) return; const m = patch.m != null ? patch.m : x.m; toNote(x, Object.assign({}, n, patch)); if (m !== x.m) Object.assign(x, C().note({ m, t: x.t, d: x.d, v: x.v, art: x.art, prefer: { s: x.s }, id: x.id })); }); selNote = n.id; },
      remove: n => change(p => { const k = p.tracks.find(x => x.id === tr.id); k.notes = k.notes.filter(x => x.id !== n.id); }),
      add: n => change(p => { const k = p.tracks.find(x => x.id === tr.id), nn = C().note({ m: n.m, t: n.t0 / s, d: (n.t1 - n.t0) / s, v: (n.velocity || 90) / 127 }); k.notes.push(nn); rollState.selected = nn.id; selNote = nn.id; }) });
    // the studio's own edits on top: on the selected note, or on the whole track
    const gridSel = h('select', { class: 'pst-sel', 'aria-label': t('pst.grid') }, [[1, '1/4'], [.5, '1/8'], [.25, '1/16'], [.125, '1/32'], [1 / 3, '1/8 ³'], [4, '1/1'], [2, '1/2']].map(([v, l]) => h('option', { value: v, text: l, selected: v === .25 })));
    const sel = () => rollState.selected;
    const tools = h('div', { class: 'pst-tools' }, [
      h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.grid') }), gridSel]),
      h('button', { class: 'btn small', text: t('pst.quant'), onclick: () => change(p => { const k = p.tracks.find(x => x.id === tr.id); k.notes = C().quantize(k.notes, +gridSel.value); }) }),
      h('button', { class: 'btn small', text: t('pst.human'), onclick: () => change(p => { const k = p.tracks.find(x => x.id === tr.id); k.notes = C().humanize(k.notes, .02, .08, Date.now() & 65535); }) }),
      h('span', { class: 'pst-lab' }, [h('small', { text: t('pst.tr') })].concat([-12, -1, 1, 12].map(k => h('button', { class: 'btn small', text: (k > 0 ? '+' : '') + k, onclick: () => change(p => { const x = p.tracks.find(q => q.id === tr.id); x.notes = C().transpose(x.notes, k); }) })))),
      h('button', { class: 'btn small', text: t('pst.dupN'), onclick: () => { const id = sel(); if (!id) return; change(p => { const k = p.tracks.find(x => x.id === tr.id), n = k.notes.find(x => x.id === id); if (!n) return; const c = C().note(Object.assign({}, n, { id: null, t: n.t + n.d })); k.notes.push(c); rollState.selected = c.id; }); } })]);
    box.append(tools, roll.el);
    selNote = sel() || null; insp = inspector(); box.append(insp);
    return { tick: b => roll.tick(b * s), stop: () => roll.stop() };
  }

  /* ---------- Rhythm designer ---------- */
  function rhythmView(box) {
    const tr = curTrack(); if (!tr || tr.kind !== 'rhythm') { box.append(h('p', { class: 'notice', text: t('pst.pickRhythm') })); return null; }
    const R = tr.rhythm, PR = C().presets(), ed = fn => change(p => fn(p.tracks.find(x => x.id === tr.id).rhythm));
    const preset = h('select', { class: 'pst-sel', 'aria-label': t('pst.preset'), onchange: e => { const pr = PR.find(x => x.id === e.target.value); if (pr) ed(r => { r.preset = pr.id; r.name = pr.name; r.src = pr.src; r.timingSrc = pr.timingSrc; r.steps = JSON.parse(JSON.stringify(pr.steps)); }); } },
      [h('option', { value: '', text: '—' })].concat(PR.map(pr => h('option', { value: pr.id, text: L(pr.name) + (pr.src === 'teacher' ? ' · ' + t('pst.teacherR') : ''), selected: R.preset === pr.id }))));
    const bars = h('input', { class: 'pst-num', type: 'number', min: 1, max: 256, value: R.bars, 'aria-label': t('pst.bars'), onchange: e => ed(r => { r.bars = clamp(Math.round(+e.target.value || 4), 1, 256); }) });
    const swing = h('input', { type: 'range', min: 0, max: 100, value: Math.round((R.swing || 0) * 100), 'aria-label': t('pst.swing'), onchange: e => ed(r => { r.swing = +e.target.value / 100; }) });
    box.append(h('div', { class: 'pst-tools' }, [h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.preset') }), preset]), h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.bars') }), bars]), h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.swing') }), swing]),
      h('button', { class: 'btn small', text: '▶ ' + t('pst.preview'), onclick: () => play({ only: tr.id, from: 0 }) })]));
    if (R.src === 'teacher' && R.timingSrc === 'default') box.append(h('p', { class: 'notice', text: t('pst.tDefault') }));
    // the strokes
    const durs = [[.25, '1/16'], [1 / 3, '1/8 ³'], [.5, '1/8'], [.75, '3/16'], [1, '1/4'], [1.5, '3/8'], [2, '1/2']];
    const grid = h('div', { class: 'pst-steps' }, R.steps.map((st, i) => h('div', { class: 'pst-step' + (st.acc ? ' acc' : '') + (st.mute ? ' muted' : '') }, [
      h('button', { class: 'pst-dir', 'aria-label': t(st.dir === 'up' ? 'pst.up' : 'pst.down'), html: st.dir === 'up' ? '↑' : '↓', onclick: () => ed(r => { r.steps[i].dir = r.steps[i].dir === 'up' ? 'down' : 'up'; }) }),
      h('small', { class: 'mono', text: String(i + 1) }),
      h('label', { class: 'pst-chk' }, [h('input', { type: 'checkbox', checked: !!st.acc, onchange: e => ed(r => { r.steps[i].acc = e.target.checked; }) }), h('span', { text: t('pst.acc') })]),
      h('label', { class: 'pst-chk' }, [h('input', { type: 'checkbox', checked: !!st.mute, onchange: e => ed(r => { r.steps[i].mute = e.target.checked; }) }), h('span', { text: t('pst.mutedS') })]),
      h('input', { type: 'range', min: 5, max: 100, value: Math.round(st.vel * 100), 'aria-label': t('pst.velo'), onchange: e => ed(r => { r.steps[i].vel = +e.target.value / 100; }) }),
      h('select', { class: 'pst-sel', 'aria-label': t('pst.stepLen'), onchange: e => ed(r => { r.steps[i].dur = +e.target.value; }) }, durs.map(([v, l]) => h('option', { value: v, text: l, selected: Math.abs(v - st.dur) < 1e-6 }))),
      h('div', { class: 'pst-strs' }, [3, 2, 1].map(s => h('button', { class: 'pst-str' + (st.str[s - 1] ? ' on' : ''), 'aria-pressed': String(!!st.str[s - 1]), text: SNAME(s), onclick: () => ed(r => { r.steps[i].str[s - 1] = r.steps[i].str[s - 1] ? 0 : 1; }) }))),
      h('button', { class: 'btn ghost small', 'aria-label': t('pst.delStep'), text: '×', onclick: () => ed(r => { if (r.steps.length > 1) r.steps.splice(i, 1); }) })])).concat([
      h('button', { class: 'pst-step pst-add', text: t('pst.addStep'), onclick: () => ed(r => { r.steps.push({ dir: 'down', acc: false, vel: .72, dur: 1, mute: false, str: [1, 1, 1], off: 0 }); r.src = 'user'; }) })]));
    box.append(grid);
    // chords by bar
    const bpb = C().bpb(P), chordRow = h('div', { class: 'pst-bars' });
    for (let b = 0; b < R.bars; b++) { const c = (R.chords || []).find(x => x.bar === b), cur = C().chordAt(R, b);
      chordRow.append(h('button', { class: 'pst-bar' + (c ? ' set' : ''), onclick: () => chordPick(tr, b) }, [h('small', { class: 'mono', text: String(b + 1) }), h('b', { text: cur ? cur.name : '—' }), cur && cur.frets ? h('small', { class: 'mono muted', text: cur.frets.map(f => f == null ? '×' : f).join(' · ') }) : null].filter(Boolean))); }
    box.append(h('h3', { class: 'pst-h', text: t('pst.chords') }), chordRow);
    // where the strokes fall in a bar
    const total = R.steps.reduce((a, s) => a + s.dur, 0);
    box.append(h('small', { class: 'muted', text: R.steps.length + ' · ' + Math.round(total * 100) / 100 + ' / ' + bpb + ' ' + t('pst.dur') }));
    return { redraw: build };
  }
  function chordPick(tr, bar) {
    const names = []; for (let r = 0; r < 12; r++) ['', 'm', '7', 'm7'].forEach(q => names.push({ r, q, nm: PD.ai.cname(r, q) }));
    PD.ui.sheet((b, close) => {
      b.append(h('h2', { text: t('pst.pickChord', { n: bar + 1 }) }));
      const set = (nm, frets) => { change(p => { const R = p.tracks.find(x => x.id === tr.id).rhythm; R.chords = (R.chords || []).filter(c => c.bar !== bar); if (nm) R.chords.push({ bar, name: nm, frets }); }); close(); };
      b.append(h('button', { class: 'btn small', text: t('pst.chordNone'), onclick: () => set(null) }));
      const grid = h('div', { class: 'pst-chgrid' });
      names.forEach(({ r, q, nm }) => { const sh = PD.ai.shapeOf(r, q), vs = sh ? (sh.voicings && sh.voicings.length ? sh.voicings : [sh]).filter(v => v.frets && v.frets.some(f => f >= 0)) : [];
        grid.append(h('div', { class: 'pst-chc' }, [h('b', { text: nm })].concat(vs.length ? vs.slice(0, 3).map((v, i) => h('button', { class: 'chip', text: v.frets.map(f => f < 0 ? '×' : f).join('·'), title: t('pst.voicing') + ' ' + (i + 1), onclick: () => { A().strum(v.frets.map(f => f < 0 ? null : f), 'down', { vel: .75 }); set(nm, v.frets.map(f => f < 0 ? null : f)); } })) : [h('small', { class: 'muted', text: t('pst.noShape') })]))); });
      b.append(grid);
    });
  }

  /* ---------- Arrange ---------- */
  function arrangeView(box) {
    const bar = C().bpb(P), bars = Math.max(8, Math.ceil(C().length(P) / bar));
    const rows = h('div', { class: 'pst-arr' });
    P.tracks.forEach((tr, i) => {
      const ed = fn => change(p => fn(p.tracks.find(x => x.id === tr.id)));
      const lane = h('div', { class: 'pst-lane', style: '--bars:' + bars }, (tr.kind === 'notes' ? tr.notes.map(n => h('i', { class: C().reach(n) ? '' : 'bad', style: 'left:' + (n.t / (bars * bar) * 100) + '%;width:' + Math.max(.3, n.d / (bars * bar) * 100) + '%;bottom:' + clamp((n.m - 48) / 40 * 100, 0, 92) + '%' }))
        : [h('b', { class: 'pst-clip', style: 'width:' + (tr.rhythm.bars / bars * 100) + '%', text: L(tr.rhythm.name) })]));
      lane.addEventListener('click', e => { const r = lane.getBoundingClientRect(); head = cursor = (e.clientX - r.left) / r.width * bars * bar; selTrack = tr.id; redraw(); });
      rows.append(h('div', { class: 'pst-row' + (tr.id === selTrack ? ' on' : ''), style: '--c:' + tr.color }, [
        h('div', { class: 'pst-rhead' }, [h('i', { class: 'pst-sw' }), h('input', { class: 'pst-tname', value: tr.name, 'aria-label': t('pst.name'), onchange: e => ed(x => { x.name = e.target.value; }) }),
          h('small', { class: 'muted', text: t(tr.kind === 'rhythm' ? 'pst.kRhythm' : 'pst.kNotes') }),
          h('button', { class: 'pst-ms' + (tr.mute ? ' on' : ''), text: 'M', 'aria-label': 'Mute', onclick: () => ed(x => { x.mute = !x.mute; }) }),
          h('button', { class: 'pst-ms s' + (tr.solo ? ' on' : ''), text: 'S', 'aria-label': 'Solo', onclick: () => ed(x => { x.solo = !x.solo; }) }),
          h('button', { class: 'btn ghost small', text: '×', 'aria-label': t('pst.del'), onclick: () => PD.ui.confirm(t('pst.delQ', { n: tr.name }), () => change(p => { p.tracks = p.tracks.filter(x => x.id !== tr.id); if (selTrack === tr.id) selTrack = (p.tracks[0] || {}).id; })) })]),
        lane]));
    });
    const ph = h('div', { class: 'pst-ph' }); rows.append(ph);
    const loopFrom = h('input', { class: 'pst-num', type: 'number', min: 1, value: P.loop.from + 1, onchange: e => change(p => { p.loop.from = Math.max(0, Math.round(+e.target.value) - 1); }) });
    const loopTo = h('input', { class: 'pst-num', type: 'number', min: 1, value: P.loop.to / 1 || 4, onchange: e => change(p => { p.loop.to = Math.max(p.loop.from + 1, Math.round(+e.target.value)); }) });
    box.append(h('div', { class: 'pst-tools' }, [h('button', { class: 'btn small', text: t('pst.addNotes'), onclick: () => change(p => { const x = C().track('notes', p.tracks.length); x.name = t('pst.kNotes') + ' ' + (p.tracks.length + 1); p.tracks.push(x); selTrack = x.id; }) }),
      h('button', { class: 'btn small', text: t('pst.addRhythm'), onclick: () => change(p => { const x = C().track('rhythm', p.tracks.length); x.name = t('pst.kRhythm') + ' ' + (p.tracks.length + 1); p.tracks.push(x); selTrack = x.id; }) }),
      h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.loopFrom') }), loopFrom]), h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.loopTo') }), loopTo])]), rows);
    const tick = b => { ph.style.left = 'calc(var(--head) + (100% - var(--head)) * ' + (b / (bars * bar)) + ')'; };
    tick(head);
    return { tick, redraw: build };
  }

  /* ---------- Mixer ---------- */
  function mixerView(box) {
    const strips = h('div', { class: 'pst-mix' }, P.tracks.map(tr => {
      const ed = (fn, quiet) => { change(p => fn(p.tracks.find(x => x.id === tr.id)), quiet); channel(P.tracks.find(x => x.id === tr.id)); };
      return h('div', { class: 'pst-strip', style: '--c:' + tr.color }, [h('b', { text: tr.name || t('pst.track') }), h('small', { class: 'muted', text: t(tr.kind === 'rhythm' ? 'pst.kRhythm' : 'pst.kNotes') }),
        h('div', { class: 'pst-fader' }, [h('div', { class: 'pst-meter', 'data-t': tr.id }, [h('i')]), h('input', { type: 'range', min: 0, max: 120, value: Math.round(tr.vol * 100), 'aria-label': t('pst.vol'), oninput: e => ed(x => { x.vol = +e.target.value / 100; }, true) })]),
        h('label', { class: 'pst-lab' }, [h('small', { text: t('pst.pan') }), h('input', { type: 'range', min: -100, max: 100, value: Math.round(tr.pan * 100), 'aria-label': t('pst.pan'), oninput: e => ed(x => { x.pan = +e.target.value / 100; }, true) })]),
        h('div', { class: 'pst-msrow' }, [h('button', { class: 'pst-ms' + (tr.mute ? ' on' : ''), text: 'M', onclick: () => ed(x => { x.mute = !x.mute; }) }), h('button', { class: 'pst-ms s' + (tr.solo ? ' on' : ''), text: 'S', onclick: () => ed(x => { x.solo = !x.solo; }) })])]);
    }));
    const banked = PD.samples && PD.samples.hasBank;
    box.append(strips, h('section', { class: 'pst-soundinfo' }, [h('b', { text: t('pst.sound') }), h('small', { class: 'muted', text: t(banked || (PD.SOUNDS && PD.SOUNDS.strings) ? 'pst.soundD' : 'pst.synth') })]));
    return { tick: () => {}, redraw: build };
  }

  /* ---------- projects and files ---------- */
  function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  const fname = (ext) => (P.name || 'panduri').replace(/[\\/:*?"<>|]+/g, '').slice(0, 60) + ext;
  async function importFile(f) {
    try {
      if (/\.(mid|midi)$/i.test(f.name) || /midi/.test(f.type)) {
        const m = C().fromMidi(new Uint8Array(await f.arrayBuffer())); let un = 0;
        change(p => { if (m.bpm) p.bpm = clamp(Math.round(m.bpm), 20, 320); m.tracks.forEach(x => { const k = C().track('notes', p.tracks.length); k.name = x.name; k.notes = x.notes; un += x.notes.filter(n => !C().reach(n)).length; p.tracks.push(k); }); });
        PD.ui.toast(t('pst.midiIn', { n: m.tracks.length, u: un }), 5000); return;
      }
      const p = C().parse(await f.text()); p.id = C().uid('p'); openProject(p);
    } catch (e) { PD.ui.toast(e && e.message === 'newer-version' ? t('pst.impNew') : t('pst.impBad', { e: (e && e.message) || e }), 5000); }
  }
  function projects() {
    PD.ui.sheet((b, close) => {
      b.append(h('h2', { text: t('pst.projects') }));
      const input = h('input', { type: 'file', accept: '.panduri,.json,.mid,.midi,audio/midi', hidden: true, onchange: () => { const f = input.files[0]; if (f) { close(); importFile(f); } } });
      b.append(h('div', { class: 'pst-pacts' }, [
        h('button', { class: 'btn primary small', text: t('pst.new'), onclick: () => { close(); openProject(fresh()); } }),
        h('button', { class: 'btn small', text: t('pst.imp'), onclick: () => input.click() }), input,
        h('button', { class: 'btn small', text: t('pst.exp'), onclick: () => download(new Blob([C().serialize(P)], { type: 'application/json' }), fname('.panduri')) }),
        h('button', { class: 'btn small', text: t('pst.midi'), onclick: () => download(new Blob([C().toMidi(P)], { type: 'audio/midi' }), fname('.mid')) }),
        h('button', { class: 'btn small', text: t('pst.midiT'), onclick: () => download(new Blob([C().toMidi(P, { only: selTrack })], { type: 'audio/midi' }), fname(' - ' + ((curTrack() || {}).name || 'track') + '.mid')) })]));
      const rows = h('div', { class: 'pst-plist' });
      list().forEach(x => rows.append(h('div', { class: 'pst-prow' + (x.id === P.id ? ' on' : '') }, [h('b', { class: 'grow', text: x.name }), h('small', { class: 'muted', text: new Date(x.modified).toLocaleString(PD.i18n.locale) }),
        h('button', { class: 'btn small', text: t('pst.open'), onclick: () => { const p = load(x.id); if (p) { close(); openProject(p); } } }),
        h('button', { class: 'btn small', text: t('pst.dup'), onclick: () => { const p = load(x.id); if (!p) return; p.id = C().uid('p'); p.name = t('pst.copy', { n: p.name }); p.created = Date.now(); close(); openProject(p); } }),
        h('button', { class: 'btn ghost small', text: t('pst.del'), onclick: () => PD.ui.confirm(t('pst.delQ', { n: x.name }), () => { PD.store.del(KEY(x.id)); PD.store.set(LIST, list().filter(k => k.id !== x.id)); if (x.id === P.id) { P = null; openProject(fresh()); } close(); }) })])));
      b.append(rows);
    });
  }

  function style() {
    if (PD.pstudio._s) return; PD.pstudio._s = true;
    document.head.appendChild(h('style', { text: `
.pst{display:grid;gap:12px;min-width:0}.pst .grow{flex:1}
.pst-top,.pst-transport,.pst-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.pst-brand{font-size:15px;letter-spacing:.02em;color:#e8c3a0}
.pst-name{min-width:120px;max-width:260px;flex:1 1 140px;background:#0e0f10;border:1px solid rgba(255,255,255,.12);border-radius:10px;color:inherit;padding:7px 10px;font:600 14px inherit}
.pst-transport{padding:10px 12px;border-radius:16px;background:#121315;border:1px solid rgba(255,255,255,.08)}.pst-play{min-width:110px}
.pst-pos{font-size:18px;min-width:54px;text-align:center}.pst-lab{display:inline-flex;align-items:center;gap:6px}.pst-lab small{color:#8a8a90}
.pst-num{width:70px;min-height:34px;background:#0e0f10;border:1px solid rgba(255,255,255,.12);border-radius:9px;color:inherit;padding:0 8px}
.pst-sel{min-height:34px;background:#0e0f10;border:1px solid rgba(255,255,255,.12);border-radius:9px;color:inherit;padding:0 8px}
.pst-tg[aria-pressed="true"],.pst-tc.on{background:#2a2622;color:#f2d2b3;box-shadow:inset 0 0 0 1px rgba(217,154,100,.55)}
.pst-tabs{display:flex;gap:4px;padding:4px;border-radius:14px;background:#0e0f10;border:1px solid rgba(255,255,255,.08);overflow-x:auto;scrollbar-width:none}
.pst-tabs button{flex:1 0 auto;min-height:38px;padding:0 14px;border:0;border-radius:10px;background:none;color:#a9a9ae;font:600 14px inherit;cursor:pointer}.pst-tabs button.on{background:#2a2622;color:#f2d2b3}
.pst-tc i{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--c);margin-inline-end:6px}
.pst-body{display:grid;gap:12px;min-width:0}.pst-neck{display:block;width:100%;height:190px;border-radius:14px;cursor:pointer;touch-action:manipulation}
.pst-insp{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;padding:12px;border-radius:14px;background:#121315;border:1px solid rgba(255,255,255,.07)}
.pst-insp label{display:inline-flex;flex-direction:column;gap:3px;font-size:12px;color:#8a8a90}.pst-insp input,.pst-insp select{width:96px;min-height:32px;background:#0e0f10;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#eee;padding:0 6px}
.pst-alts{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.pst-steps{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
.pst-step{display:grid;gap:6px;justify-items:center;padding:10px 8px;border-radius:14px;background:#141416;border:1px solid rgba(255,255,255,.08)}
.pst-step.acc{border-color:rgba(236,107,86,.75);background:linear-gradient(180deg,rgba(214,96,74,.2),#141416)}.pst-step.muted{opacity:.6}
.pst-dir{width:54px;height:54px;border-radius:14px;border:0;background:#0e0f10;color:#e8e8ec;font:800 30px/1 system-ui;cursor:pointer}.pst-step.acc .pst-dir{color:#ec6b56}
.pst-chk{display:flex;gap:4px;align-items:center;font-size:12px}.pst-step input[type=range]{width:100%}
.pst-strs{display:flex;gap:3px}.pst-str{min-width:30px;min-height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.14);background:none;color:#8d8d93;font:700 11px inherit;cursor:pointer}.pst-str.on{background:#2a2622;color:#f2d2b3;border-color:rgba(217,154,100,.5)}
.pst-add{place-items:center;color:#c9a07c;cursor:pointer;font-weight:700;min-height:120px}
.pst-bars{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:6px}.pst-bar{display:grid;gap:2px;justify-items:start;padding:8px 10px;border-radius:12px;background:#121315;border:1px solid rgba(255,255,255,.08);color:inherit;cursor:pointer}.pst-bar.set{border-color:rgba(217,154,100,.5)}.pst-bar b{font-size:17px}
.pst-h{margin:6px 0 0;font-size:15px}.pst-chgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;max-height:60vh;overflow:auto}.pst-chc{display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:8px;border-radius:12px;background:#121315}.pst-chc b{width:100%}
.pst-arr{position:relative;display:grid;gap:6px;--head:236px}.pst-row{display:grid;grid-template-columns:var(--head) 1fr;gap:6px;align-items:stretch}
.pst-rhead{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:12px;background:#121315;border-left:4px solid var(--c);min-width:0}.pst-row.on .pst-rhead{background:#1c1a18}
.pst-tname{width:90px;flex:1;min-width:0;background:none;border:0;color:inherit;font:600 13px inherit}.pst-rhead small{white-space:nowrap}
.pst-ms{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.14);background:none;color:#a9a9ae;font:800 12px inherit;cursor:pointer}.pst-ms.on{background:#d99a64;color:#1a0f07}.pst-ms.s.on{background:#e5c06a}
.pst-lane{position:relative;min-height:54px;border-radius:12px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 1px,transparent 1px calc(100% / var(--bars))),#0e0f10;overflow:hidden;cursor:pointer}
.pst-lane i{position:absolute;height:5px;border-radius:3px;background:var(--c)}.pst-lane i.bad{background:repeating-linear-gradient(45deg,#8e3b22 0 3px,transparent 3px 6px)}
.pst-clip{position:absolute;left:0;top:6px;bottom:6px;border-radius:10px;background:color-mix(in srgb,var(--c) 35%,transparent);border:1px solid var(--c);padding:6px 10px;font-size:12px;overflow:hidden;white-space:nowrap}
.pst-ph{position:absolute;top:0;bottom:0;width:2px;background:#ffcf9a;pointer-events:none;left:var(--head)}
.pst-mix{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px}.pst-strip{display:grid;gap:8px;justify-items:center;min-width:120px;padding:12px;border-radius:16px;background:#121315;border-top:3px solid var(--c)}
.pst-fader{display:flex;gap:10px;align-items:center;height:170px}.pst-fader input{writing-mode:vertical-lr;direction:rtl;height:160px}
.pst-meter{width:10px;height:160px;border-radius:5px;background:#0b0b0c;position:relative;overflow:hidden}.pst-meter i{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(0deg,#58c28a,#e5c06a 75%,#e5604a)}.pst-meter.hot{box-shadow:0 0 0 1px #e5604a}
.pst-msrow{display:flex;gap:6px}.pst-soundinfo{display:grid;gap:4px;padding:12px;border-radius:14px;background:#121315}
.pst-pacts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}.pst-plist{display:grid;gap:6px;max-height:50vh;overflow:auto}.pst-prow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 10px;border-radius:12px;background:#121315}.pst-prow.on{box-shadow:inset 0 0 0 1px rgba(217,154,100,.5)}
.pst-neckwrap{overflow-x:auto;scrollbar-width:thin;border-radius:14px}
@media (max-width:640px){.pst-arr{--head:0px}.pst-row{grid-template-columns:1fr}.pst-ph{display:none}.pst-rhead small{display:none}.pst-neck{width:820px;height:170px}.pst-name{max-width:none}}
` }));
  }
  return { page, get project() { return P; }, play, stop, importFile, _open: openProject };
})();
