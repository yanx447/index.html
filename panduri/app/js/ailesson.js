/* =====================================================================
   A song from the AI studio, learned the way Bani-Acharuli is learned.

   The studio has measured the song: its beats, its chords, its key. Here
   that measurement becomes a song lesson of exactly the shape the
   built-in songs have (curriculum.js · songLesson): one lesson beat per
   beat of the recording (beatMap), a chord on every beat played with a
   stroke pattern, the recording itself to play along with, parts to loop,
   the five song stages (listen · rhythm · chords · slow · full) and the
   microphone that waits for the learner.

   What is measured and what is chosen:
   · beats, chords, key — measured from the recording (AI estimate).
   · the chord cycle — found as the progression the beats repeat. A stretch
     that clearly follows a cycle of its own keeps it; where the recording is
     unclear the song's cycle goes on, and the page says how much that is.
     With no cycle at all, the measured chords are played as they are.
     Measured on the teacher's song (qa/ai-bani.cjs): the chart comes out as
     his Dm · Dm · B♭ · C, on the mix with and without the voice.
   · the stroke pattern — chosen by the learner. Down or up cannot be heard
     in a recording; the AI only suggests one, and says so.
   · chord shapes — the app's own library, computed from the tuning.
   Nothing here is the teacher's: every lesson is marked as an AI estimate.
   Only compact data is stored (ai.lessons); the lesson is rebuilt on load.
   ===================================================================== */
PD.i18n.add({
  'al.tab': ['ისწავლე', 'Learn it'],
  'al.title': ['ისწავლე ეს სიმღერა', 'Learn this song'],
  'al.lead': ['AI ამ სიმღერას ისეთ გაკვეთილად აქცევს, როგორიც ბანი-აჭარულია: აკორდები რითმით, გრიფი, შენელება, ნაწილების გამეორება და მიკროფონი, რომელიც შენს დაკვრას ელოდება.', 'The AI turns this song into a lesson like Bani-Acharuli: the chords with a rhythm, the neck, slowing down, looping parts and the microphone that waits for your playing.'],
  'al.cycle': ['AI-მ იპოვა მეორებადი წრე — ემთხვევა სიმღერის {p}%-ს', 'The AI found a repeating cycle — it matches {p}% of the song'],
  'al.cycleD': ['სადაც სიმღერა მკაფიოდ სხვა წრეს მიჰყვება, იქ ის წრე იქნება. შეეხე აკორდს და შეცვალე, თუ ყურით სხვა ისმის.', 'Where the song clearly follows a different cycle, that cycle is used. Tap a chord to change it if your ear hears something else.'],
  'al.noCycle': ['მეორებადი წრე ვერ ვიპოვე — აკორდები ისე გადავა, როგორც ჩანაწერში გაიზომა.', 'No repeating cycle was found — the chords follow what was measured in the recording.'],
  'al.rhythms': ['{n} რითმი', '{n} rhythm(s)'],
  'al.unsure': ['{n} თვლაზე ({p}%) ჩანაწერი ბუნდოვანია (მაგ. სოლო ან ხმაური) — იქ წრე გრძელდება. შეამოწმე ყურით.', 'On {n} beats ({p}%) the recording is unclear (a solo or a busy mix, for example) — the cycle goes on there. Check it by ear.'],
  'al.chords': ['აკორდები ფანდურზე', 'The chords on the panduri'],
  'al.noShape': ['ამ აკორდს სამ სიმზე ფორმა არ აქვს — გაკვეთილში გამოტოვდება', 'This chord has no three-string shape — the lesson leaves it out'],
  'al.rhythm': ['რითმი (ერთი თვლა)', 'Rhythm (one beat)'],
  'al.rhythmD': ['ჩაკვრა თუ ამოკვრა ჩანაწერიდან არ ისმის — აირჩიე, როგორ დაუკრავ. „AI" აღნიშნავს იმას, რაც დარტყმების ნახატს ყველაზე ახლოს მიესადაგება.', 'Down or up cannot be heard in a recording — choose how you will play. “AI” marks the pattern closest to the measured strokes.'],
  'al.pDown': ['ჩაკვრა ყოველ თვლაზე', 'One down per beat'], 'al.pDU': ['ჩაკვრა · ამოკვრა', 'Down · up'],
  'al.teacher': ['მასწავლებლის', 'teacher'], 'al.general': ['ზოგადი', 'general'], 'al.ai': ['AI', 'AI'],
  'al.sound': ['ჩანაწერი', 'The recording'],
  'al.stemsYes': ['მთელი სიმღერა დაყოფილია — გაკვეთილში იქნება „ვოკალით", „ვოკალის გარეშე" და „მხოლოდ ვოკალი".', 'The whole song has been split — the lesson will have “with vocals”, “no vocals” and “vocals only”.'],
  'al.stemsNo': ['გაკვეთილი ორიგინალ ჩანაწერთან ერთად დაიკვრება. „ვოკალის გარეშე" ვერსიისთვის ჯერ „ინსტრუმენტებში" დაყავი მთელი სიმღერა.', 'The lesson plays along with the original recording. For a “no vocals” version, first split the whole song under “Instruments”.'],
  'al.est': ['ეს AI-ის შეფასებაა და არა მასწავლებლის ჩარტი: აკორდები და დრო ჩანაწერიდან გაიზომა. შეამოწმე ყურით და საჭიროებისას შეასწორე.', 'This is an AI estimate, not the teacher\'s chart: the chords and timing were measured from the recording. Check it by ear and correct it where needed.'],
  'al.make': ['გაკვეთილის შექმნა', 'Make the lesson'], 'al.remake': ['გაკვეთილის განახლება', 'Update the lesson'],
  'al.open': ['გაკვეთილის გახსნა', 'Open the lesson'], 'al.del': ['გაკვეთილის წაშლა', 'Delete the lesson'],
  'al.making': ['გაკვეთილი მზადდება…', 'Making the lesson…'],
  'al.made': ['გაკვეთილი მზადაა — „სიმღერებშიც" იპოვი.', 'The lesson is ready — you will also find it under Songs.'],
  'al.noStore': ['სიმღერა ამ მოწყობილობაზე ვერ შეინახა, ამიტომ გაკვეთილი ვერ შეიქმნება. გაათავისუფლე ადგილი და ჩატვირთე ხელახლა.', 'The song could not be stored on this device, so a lesson cannot be made. Free some space and load it again.'],
  'al.noBeats': ['ამ ჩანაწერში დარტყმები ვერ გაიზომა — გაკვეთილი ვერ შეიქმნება.', 'No beats could be measured in this recording — a lesson cannot be made.'],
  'al.badge': ['AI', 'AI'], 'al.part': ['ნაწილი {n}', 'Part {n}'],
  'al.pick': ['აირჩიე აკორდი', 'Choose a chord'],
  'al.wait': ['ჯერ რითმს ვზომავ…', 'Measuring the rhythm first…']
});

PD.aiLessons = (() => {
  const h = PD.h, t = PD.i18n.t, KEY = 'ai.lessons', SR = 32000;
  const list = () => PD.store.get(KEY, []);
  const save = a => { PD.store.set(KEY, a); PD.lessons.reload(); };
  const find = sid => list().find(d => d.sid === sid) || null;

  /* ---------- the chart: one chord per beat ---------- */
  const isMinorQ = q => /^(m(?!aj)|dim)/.test(q || '');
  /** the chord a beginner holds for it: its triad (sevenths, sus and add chords fall back to major/minor) */
  function triad(root, q) {
    if (root < 0) return null;
    const tq = /^(dim|dim7|m7♭5)$/.test(q) ? 'dim' : /^(aug|7♯5)$/.test(q) ? 'aug' : isMinorQ(q) ? 'm' : '';
    const sh = PD.ai.shapeOf(root, tq), q2 = sh ? sh.q : (tq === 'dim' ? 'm' : tq === 'aug' ? '' : tq);   // no shape for dim/aug: its own triad
    return { root, q: q2, name: PD.ai.cname(root, q2) };
  }
  /** a chord name back to its root and quality ('B♭m' → 10, 'm') */
  function parse(nm) {
    let best = null; for (let r = 0; r < 12; r++) { const n0 = PD.ai.cname(r, ''); if (nm.indexOf(n0) === 0 && (!best || n0.length > best.n)) best = { r, n: n0.length }; }
    return best ? { root: best.r, q: nm.slice(best.n) } : null;
  }
  /** the app's own shape for a chord name (computed from the tuning), or null */
  function shapeFor(nm) {
    const c = parse(nm), sh = c && PD.ai.shapeOf(c.root, c.q), v = sh && ((sh.voicings && sh.voicings[0]) || sh);
    return v && v.frets && v.frets.some(f => f >= 0) ? { sh, frets: v.frets, fingers: (v.fingers || []).map(f => f || 0) } : null;
  }
  /** chords as measured, one per beat (the chord sounding in the middle of the beat) */
  function measured(res) {
    const B = res.beats || [], out = [];
    for (let k = 0; k + 1 < B.length; k++) {
      const mid = (B[k] + B[k + 1]) / 2, c = res.chords.find(x => mid >= x.t0 && mid < x.t1), tr = c ? triad(c.root, c.q) : null;
      out.push(tr ? tr.name : null);
    }
    // a chord heard on fewer than 1.5 % of the beats is almost always a slip of the reading: it takes its neighbour's place
    const cnt = {}; out.forEach(n => { if (n) cnt[n] = (cnt[n] || 0) + 1; });
    const rare = n => n && cnt[n] < Math.max(2, out.length * .015);
    for (let k = 0; k < out.length; k++) if (rare(out[k])) { let j = k - 1; while (j >= 0 && (rare(out[j]) || !out[j])) j--; out[k] = j >= 0 ? out[j] : null; }
    return out;
  }
  /** the progression the beats repeat: for every length 1–16 beats, the most common chord at each place of the
      cycle, and how much of the song agrees with it. A longer cycle has to agree clearly better to be believed. */
  function findCycle(seq, tonic) {
    const idx = seq.map((n, k) => n ? k : -1).filter(k => k >= 0); if (idx.length < 8) return null;
    let best = null;
    for (let P = 1; P <= Math.min(16, Math.floor(seq.length / 3)); P++) {   // a cycle has to come round at least three times
      const cnt = Array.from({ length: P }, () => ({}));
      idx.forEach(k => { const m = cnt[k % P]; m[seq[k]] = (m[seq[k]] || 0) + 1; });
      const modes = cnt.map(m => Object.keys(m).sort((a, b) => m[b] - m[a])[0] || null);
      let ok = 0; idx.forEach(k => { if (seq[k] === modes[k % P]) ok++; });
      const agree = ok / idx.length, score = agree - .006 * P;
      if (!best || score > best.score + 1e-9) best = { P, modes, agree, score };
    }
    // a cycle that is two copies of a shorter one is the shorter one
    for (let d = 1; d < best.P; d++) if (best.P % d === 0 && best.modes.every((m, i) => m === best.modes[i % d])) { best = Object.assign({}, best, { P: d, modes: best.modes.slice(0, d) }); break; }
    // start it where a chord begins — on the key's own chord when there is one
    const M = best.modes, P = best.P, starts = [];
    for (let s = 0; s < P; s++) if (P === 1 || M[s] !== M[(s - 1 + P) % P]) starts.push(s);
    const s0 = starts.find(s => M[s] === tonic) ?? starts[0] ?? 0;
    return { P, s: s0, cycle: M.slice(s0).concat(M.slice(0, s0)), agree: best.agree };
  }
  /** the chart the lesson plays: the cycle where the song follows it, the measured chords where it does not */
  function chart(res, cycleOverride) {
    const meas = measured(res), tonic = res.key ? PD.ai.cname(res.key.r, res.key.q) : null;
    // where the song follows the cycle is judged against the cycle the AI heard; the chords written are the
    // learner's, when they corrected one
    const heard = findCycle(meas, tonic);
    let cyc = heard;
    if (cyc && cycleOverride && cycleOverride.length === cyc.P) cyc = Object.assign({}, cyc, { cycle: cycleOverride.slice() });
    const n = meas.length, names = meas.slice(), use = new Array(n).fill(false);
    if (cyc && cyc.agree >= .45 && cyc.P > 1) {
      const at = k => cyc.cycle[((k - cyc.s) % cyc.P + cyc.P) % cyc.P], at0 = k => heard.cycle[((k - heard.s) % heard.P + heard.P) % heard.P], W = Math.max(8, cyc.P * 2);
      for (let k = 0; k < n; k++) {
        let ok = 0, tot = 0; for (let j = Math.max(0, k - W); j <= Math.min(n - 1, k + W); j++) { if (!meas[j]) continue; tot++; if (meas[j] === at0(j)) ok++; }
        if (tot && ok / tot >= .4) { names[k] = at(k); use[k] = true; }
      }
    }
    // what the cycle does not explain: a stretch that clearly follows a cycle of its own (a chorus, a bridge) gets that
    // cycle; a stretch where nothing is clear (a solo on top, a busy mix) is where the song's own cycle most likely
    // goes on — it is kept, and marked as unsure
    const unsure = new Array(n).fill(false);
    let local = 0;
    if (cyc && cyc.agree >= .45 && cyc.P > 1) {
      const at = k => cyc.cycle[((k - cyc.s) % cyc.P + cyc.P) % cyc.P], same = (a, b) => a.length === b.length && a.some((_, r) => a.every((x, i) => x === b[(i + r) % b.length]));
      for (let k = 0; k < n;) {
        if (use[k]) { k++; continue; }
        let e = k; while (e < n && !use[e]) e++;
        const L = e >= k + 3 * 2 ? findCycle(meas.slice(k, e), tonic) : null;
        if (L && L.agree >= .8 && L.P > 1 && new Set(L.cycle).size > 1 && !same(L.cycle, heard.cycle)) { for (let j = k; j < e; j++) names[j] = L.cycle[(((j - k) - L.s) % L.P + L.P) % L.P]; local += e - k; }   // as clear as a plain verse reads
        else for (let j = k; j < e; j++) { names[j] = at(j); unsure[j] = true; }
        k = e;
      }
    }
    const cover = n ? use.filter(Boolean).length / n : 0;
    return { names, measured: meas, cycle: cyc && cover >= .5 ? cyc : null, cyc, cover, unsure: unsure.filter(Boolean).length, local };
  }

  /* ---------- stroke patterns (one beat) ---------- */
  function patterns() {
    const T = (PD.curriculum.rhythms && PD.curriculum.rhythms()) || [], out = [];
    ['acharuli', 'kazbeguri'].forEach(id => { const r = T.find(x => x.id === id); if (r && r.strokes.length <= 4) out.push({ id, name: r.name, strokes: r.strokes, src: 'teacher' }); });
    out.push({ id: 'down', name: { ka: 'ჩაკვრა ყოველ თვლაზე', en: 'One down per beat' }, key: 'al.pDown', strokes: [{ direction: 'down', accent: false }], src: 'general' });
    out.push({ id: 'du', name: { ka: 'ჩაკვრა · ამოკვრა', en: 'Down · up' }, key: 'al.pDU', strokes: [{ direction: 'down', accent: false }, { direction: 'up', accent: false }], src: 'general' });
    return out;
  }
  const patOf = id => patterns().find(p => p.id === id) || patterns().find(p => p.id === 'down');
  /** the AI's suggestion, from the measured strokes: a teacher rhythm only when it was named with confidence and fits one beat */
  function suggest(rhy) {
    if (rhy && rhy.best && rhy.best.geo && patterns().some(p => p.id === rhy.best.id) && (rhy.best.perBeat === 3 || rhy.best.span === 1)) return rhy.best.id;
    if (rhy && (rhy.sub === 2 || rhy.sub === 4)) return 'du';
    return 'down';
  }

  /* ---------- the lesson, rebuilt from the stored data ---------- */
  function lessonOf(D) {
    const { chord, sec } = PD.build, pat = patOf(D.pattern), per = pat.strokes.length, d = 1 / per, ev = [];
    const n = D.beats.length - 1;
    for (let r = 0; r < n; r++) {
      const nm = D.chords[D.idx[r]], sh = nm && D.shapes[nm]; if (!sh) continue;
      pat.strokes.forEach((k, j) => ev.push(...chord(r + j * d, nm, sh.frets, sh.fingers, k.direction, d, k.accent, 'strum')));
    }
    const secs = (D.parts || []).map((p, i) => Object.assign(sec('ნაწილი ' + (i + 1), 'Part ' + (i + 1), p[0], p[1]), { kind: 'part' }));
    const list = D.chords.filter(c => D.shapes[c]).join(' · ');
    return {
      id: D.id, v: 2, type: 'song', level: 1, demo: false, ai: true, source: 'ai', chartSrc: 'ai',
      title: { ka: D.title, en: D.title },
      desc: { ka: 'AI-მ ჩანაწერიდან ამოიცნო: ' + list + ' · ' + Math.round(D.bpm) + ' BPM. ეს AI-ის შეფასებაა და არა მასწავლებლის ჩარტი — შეამოწმე ყურით.',
        en: 'Measured by the AI from the recording: ' + list + ' · ' + Math.round(D.bpm) + ' BPM. An AI estimate, not the teacher\'s chart — check it by ear.' },
      bpm: D.bpm, meter: [D.bpb || 4, 4], song: D.id, stems: D.stems, refOffset: 0, beatMap: D.beats, countIn: 4,
      cycle: D.cycle || null, songRhythm: pat.id, beatStrokes: pat.strokes, shapes: D.shapes, events: ev, sections: secs,
      stages: ['demo', 'technique', 'chords', 'slow', 'perform'], technique: { kind: 'rhythm' }, skills: ['chords', 'strumming', 'rhythm']
    };
  }
  PD.lessons.provide && PD.lessons.provide(() => list().map(D => { try { return lessonOf(D); } catch (_) { return null; } }).filter(Boolean));

  /* ---------- audio for the lesson ---------- */
  async function monoWav(buf) {   // an AudioBuffer → mono 16-bit WAV at 32 kHz (what the lesson player keeps anyway)
    const len = Math.max(1, Math.ceil(buf.duration * SR)), oc = new OfflineAudioContext(1, len, SR), s = oc.createBufferSource();
    s.buffer = buf; s.connect(oc.destination); s.start(0);
    const x = (await oc.startRendering()).getChannelData(0), n = x.length, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const w = (o, str) => { for (let i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, SR, true); v.setUint32(28, SR * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0, o = 44; i < n; i++, o += 2) v.setInt16(o, Math.max(-1, Math.min(1, x[i])) * 32767, true);
    return new Blob([b], { type: 'audio/wav' });
  }
  function bufOf(tracks, sr) {   // stem tracks (L/R) summed into one stereo buffer
    const n = tracks[0].L.length, b = new AudioBuffer({ numberOfChannels: 2, length: n, sampleRate: sr }), L = b.getChannelData(0), R = b.getChannelData(1);
    tracks.forEach(tk => { for (let i = 0; i < n; i++) { L[i] += tk.L[i]; R[i] += tk.R[i]; } });
    return b;
  }

  /* ---------- make / delete ---------- */
  async function make(S, opt) {
    const res = S.res, sid = S.id;
    if (!sid) throw new Error('nostore');
    if (!res.beats || res.beats.length < 8) throw new Error('nobeats');
    const C = chart(res, opt.cycle);
    const id = 'ai-' + sid, names = [...new Set(C.names.filter(Boolean))];
    const shapes = {};
    names.forEach(nm => { const f = shapeFor(nm); if (f) shapes[nm] = { frets: f.frets.slice(), fingers: f.fingers, src: 'fact' }; });
    // the recording: the stored file itself, unless it is a video or a format only taken while playing — then its sound as WAV
    const stems = {};
    const kept = !S.isVid && !S.cap && await PD.blobs.get('ai.song.' + sid).then(b => !!b).catch(() => false);
    if (!kept) { const b = await monoWav(S.ab); await PD.blobs.put('ai.les.' + sid + '.full', b); stems.full = 'blob:ai.les.' + sid + '.full'; }
    else stems.full = 'blob:ai.song.' + sid;
    // with and without the voice, when the whole song has been split
    const st = S.stems;
    if (st && st.from < .5 && st.from + st.len >= res.dur - .5) {
      const voc = st.tracks.filter(x => x.name === 'vocals'), rest = st.tracks.filter(x => x.name !== 'vocals');
      if (voc.length && rest.length) {
        await PD.blobs.put('ai.les.' + sid + '.vocals', await monoWav(bufOf(voc, st.sr)));
        await PD.blobs.put('ai.les.' + sid + '.music', await monoWav(bufOf(rest, st.sr)));
        stems.vocals = 'blob:ai.les.' + sid + '.vocals'; stems.music = 'blob:ai.les.' + sid + '.music';
      }
    }
    // an update without a fresh split keeps the voice and no-voice versions the lesson already had
    const prev = find(sid);
    if (!stems.music && prev && prev.stems && prev.stems.music && prev.stems.vocals) { stems.music = prev.stems.music; stems.vocals = prev.stems.vocals; }
    const beats = res.beats.map(x => +x.toFixed(3)), n = beats.length - 1;
    const P = C.cycle ? C.cycle.P : 4, per = Math.max(P, Math.round(20 / (60 / (res.bpm || 100)) / P) * P), off = C.cycle ? C.cycle.s % P : 0;
    const parts = []; let a = 0; for (let b = off || per; a < n; b += per) { const e = Math.min(n, b); if (e - a >= 2) parts.push([a, e]); else if (parts.length) parts[parts.length - 1][1] = e; a = e; }
    const D = { id, sid, title: S.file.name.replace(/\.[^.]+$/, ''), at: Date.now(), bpm: res.bpm, bpb: opt.bpb || 4, key: res.key ? PD.ai.cname(res.key.r, res.key.q) : null,
      beats, chords: names, idx: C.names.map(nm => nm ? names.indexOf(nm) : -1), shapes, pattern: opt.pattern || 'down',
      cycle: C.cycle ? C.cycle.cycle.slice() : null, agree: C.cycle ? +C.cycle.agree.toFixed(2) : null, stems, parts };
    save(list().filter(x => x.sid !== sid).concat(D));
    return id;
  }
  function remove(sid) {
    const D = find(sid); if (!D) return;
    ['full', 'vocals', 'music'].forEach(k => { try { PD.blobs.del('ai.les.' + sid + '.' + k); } catch (_) {} });
    save(list().filter(x => x.sid !== sid));
  }

  /* ---------- the panel inside the studio ---------- */
  function panel(o) {
    const box = h('section', { class: 'ai-learn' });
    let cyc = null, pat = null, busy = false;   // pat: what the learner picked (until then the AI's suggestion, or what the lesson already has)
    function draw() {
      const S = o.S, res = S.res, D = find(S.id);
      box.innerHTML = '';
      box.append(h('div', { class: 'row pg-head' }, [h('h2', { text: t('al.title'), style: 'margin:0' }), h('span', { class: 'ai-badge', text: 'AI' })]), h('p', { class: 'fg2', text: t('al.lead') }));
      if (!res.beats || res.beats.length < 8) { box.append(h('p', { class: 'notice', text: t('al.noBeats') })); return; }
      const C = chart(res, cyc);
      if (!cyc && D && D.cycle && C.cyc && D.cycle.length === C.cyc.P) { cyc = D.cycle.slice(); return draw(); }
      // the chart
      const used = [...new Set(C.names.filter(Boolean))];
      if (C.cycle) {
        const runs = []; C.cycle.cycle.forEach((c, i) => { const r = runs[runs.length - 1]; if (r && r.c === c) { r.n++; r.is.push(i); } else runs.push({ c, n: 1, is: [i] }); });
        box.append(h('div', { class: 'al-blk' }, [h('b', { class: 'al-h', text: t('al.cycle', { p: Math.round(C.cycle.agree * 100) }) }),
          h('div', { class: 'al-cy' }, runs.map(r => h('button', { class: 'al-c', style: 'flex:' + r.n, onclick: () => pickChord(r, C) }, [h('b', { text: r.c }), h('small', { text: t('al.rhythms', { n: r.n }) })]))),
          h('small', { class: 'muted', text: t('al.cycleD') }), C.unsure ? h('small', { class: 'muted', text: t('al.unsure', { n: C.unsure, p: Math.round(C.unsure / C.names.length * 100) }) }) : null].filter(Boolean)));
      } else box.append(h('p', { class: 'notice', text: t('al.noCycle') }));
      // the shapes
      const sh = h('div', { class: 'al-shapes' });
      used.forEach(nm => { const f = shapeFor(nm);
        sh.append(h('div', { class: 'al-sh' }, [h('b', { text: nm }), f ? h('div', { class: 'ai-sdia', html: PD.tools.chordDiagram(Object.assign({}, f.sh, { frets: f.frets, fingers: f.fingers })) }) : h('small', { class: 'notice', text: t('al.noShape') }),
          f ? h('small', { class: 'muted mono', text: f.frets.map(x => x === 0 ? '0' : x < 0 ? '×' : x).join(' · ') }) : null].filter(Boolean))); });
      box.append(h('div', { class: 'al-blk' }, [h('b', { class: 'al-h', text: t('al.chords') }), sh]));
      // the stroke pattern
      const ai = S.rhy ? suggest(S.rhy) : null;
      const cur = pat || (D && D.pattern) || ai || 'down';
      const row = h('div', { class: 'chips-row' }, patterns().map(p => h('button', { class: 'chip' + (cur === p.id ? ' on' : ''), onclick: () => { pat = p.id; draw(); } }, [
        h('span', { class: 'al-st', text: p.strokes.map(k => k.direction === 'up' ? '↑' : '↓').join('') }), h('span', { text: ' ' + (p.key ? t(p.key) : PD.i18n.pick(p.name)) }),
        h('em', { class: 'al-src', text: ' · ' + t(p.src === 'teacher' ? 'al.teacher' : 'al.general') }), ai === p.id ? h('em', { class: 'al-ai', text: ' · ' + t('al.ai') }) : null].filter(Boolean))));
      box.append(h('div', { class: 'al-blk' }, [h('b', { class: 'al-h', text: t('al.rhythm') }), row, h('small', { class: 'muted', text: S.rhy ? t('al.rhythmD') : t('al.wait') })]));
      // the sound
      const whole = (S.stems && S.stems.from < .5 && S.stems.from + S.stems.len >= res.dur - .5) || !!(D && D.stems && D.stems.music);
      box.append(h('div', { class: 'al-blk' }, [h('b', { class: 'al-h', text: t('al.sound') }), h('small', { class: 'muted', text: t(whole ? 'al.stemsYes' : 'al.stemsNo') })]));
      box.append(h('p', { class: 'notice', text: t('al.est') }));
      const msg = h('small', { class: 'muted', 'aria-live': 'polite' });
      const go = h('button', { class: 'btn primary big', text: t(D ? 'al.remake' : 'al.make'), disabled: busy, onclick: async () => {
        if (!o.pro()) return o.lock();
        busy = true; go.disabled = true; msg.textContent = t('al.making');
        try { const id = await make(S, { cycle: cyc, pattern: cur, bpb: (S.rhyMt && S.rhyMt.beatsPerBar) || 4 }); busy = false; PD.ui.toast(t('al.made'), 3500); PD.app.go('lesson', id); }
        catch (e) { busy = false; go.disabled = false; msg.textContent = t(e && e.message === 'nostore' ? 'al.noStore' : e && e.message === 'nobeats' ? 'al.noBeats' : 'ai.fail', { e: (e && e.message) || e }); }
      } });
      const acts = h('div', { class: 'row', style: 'gap:8px;flex-wrap:wrap;align-items:center' }, [go,
        D ? h('button', { class: 'btn', text: t('al.open'), onclick: () => PD.app.go('lesson', D.id) }) : null,
        D ? h('button', { class: 'btn ghost small', text: t('al.del'), onclick: () => PD.ui.confirm(t('al.del') + '?', () => { remove(S.id); draw(); }) }) : null, msg].filter(Boolean));
      box.append(acts);
    }
    function pickChord(run, C) {
      const res = o.S.res, key = res.key, opts = new Set(C.cycle.cycle);
      // the key's own chords first, then every major and minor chord
      if (key) (key.q ? [[0, 'm'], [3, ''], [5, 'm'], [7, 'm'], [7, ''], [8, ''], [10, '']] : [[0, ''], [2, 'm'], [4, 'm'], [5, ''], [7, ''], [9, 'm']]).forEach(([d, q]) => opts.add(PD.ai.cname((key.r + d) % 12, q)));
      for (let r = 0; r < 12; r++) { opts.add(PD.ai.cname(r, '')); opts.add(PD.ai.cname(r, 'm')); }
      PD.ui.sheet((b, close) => {
        b.append(h('h2', { text: t('al.pick') }), h('div', { class: 'chips-row' }, [...opts].map(nm => h('button', { class: 'chip' + (nm === run.c ? ' on' : ''), text: nm, onclick: () => {
          const c2 = (cyc || C.cycle.cycle).slice(); run.is.forEach(i => { c2[i] = nm; }); cyc = c2; close(); draw(); } }))));
      });
    }
    draw();
    return { el: box, draw };
  }

  /** a chord name moved by semitones ('Dm', 2 → 'Em') */
  const transpose = (nm, d) => { if (!d) return nm; const c = parse(nm); return c ? PD.ai.cname(((c.root + d) % 12 + 12) % 12, c.q) : nm; };
  return { list, find, chart, findCycle, measured, suggest, patterns, lessonOf, make, remove, panel, transpose, shapeFor, usesSong: sid => !!find(sid) };
})();
