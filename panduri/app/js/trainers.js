/* =====================================================================
   Trainers: Metronome · Note & fret trainer (microphone, spaced
   repetition, ear training, speed challenge) · Daily practice plan.
   Every answer in the trainers comes from the real panduri through the
   microphone; touch answers exist only in the explicit demo mode.
   ===================================================================== */
PD.i18n.add({
  'mt.title': ['მეტრონომი', 'Metronome'], 'mt.tap': ['ტაპი', 'Tap tempo'], 'mt.sig': ['ზომა', 'Time signature'], 'mt.accent': ['პირველი დარტყმის აქცენტი', 'Accent the first beat'],
  'mt.sub': ['დაყოფა', 'Subdivision'], 'mt.sound': ['ხმა', 'Sound'], 'mt.haptic': ['ვიბრაცია', 'Haptic pulse'], 'mt.start': ['დაწყება', 'Start'], 'mt.stop': ['გაჩერება', 'Stop'], 'mt.vol': ['ხმის დონე', 'Volume'],
  'snd.click': ['კლიკი', 'Click'], 'snd.wood': ['ხე', 'Wood'], 'snd.beep': ['ტონი', 'Beep'], 'snd.soft': ['რბილი', 'Soft'],
  'tr.title': ['ნოტები და ლადები', 'Notes and frets'], 'tr.lead': ['აპი გეკითხება, შენ ნამდვილ ფანდურზე უკრავ — მიკროფონი ამოწმებს.', 'The app asks, you play it on your real panduri — the microphone checks.'],
  'tl.open': ['ღია სიმები', 'Open strings'], 'tl.f13': ['ლადები 1–3', 'Frets 1–3'], 'tl.f15': ['ლადები 1–5', 'Frets 1–5'], 'tl.f17': ['ლადები 1–7', 'Frets 1–7'], 'tl.full': ['მთელი ტარი', 'Full neck'],
  'tl.random': ['შემთხვევითი', 'Random notes'], 'tl.speed': ['სისწრაფე · 60 წმ', 'Speed · 60 s'], 'tl.ear': ['სმენით', 'Ear training'],
  'tr.playNote': ['დაუკარი {n}', 'Play {n}'], 'tr.playPos': ['დაუკარი {s} სიმის {f} ლადი', 'Play the {s} string, fret {f}'], 'tr.playOpen': ['დაუკარი ღია {s} სიმი', 'Play the open {s} string'],
  'tr.ear': ['მოუსმინე და გაიმეორე', 'Listen and play it back'], 'tr.again': ['კიდევ მოსმენა', 'Listen again'], 'tr.ok': ['სწორია', 'Correct'], 'tr.heard': ['მოვისმინე {p} — გვჭირდება {e}', 'I heard {p} — we need {e}'],
  'tr.where': ['ნახე ტარზე: {s} სიმი, ლადი {f}', 'See the neck: {s} string, fret {f}'], 'tr.score': ['{c} სწორი · {a} ცდა', '{c} correct · {a} tries'], 'tr.streak': ['სერია {n}', 'streak {n}'], 'tr.time': ['{s} წმ', '{s} s'], 'tr.done': ['დრო ამოიწურა: {c} სწორი', 'Time: {c} correct'],
  'tr.samePitch': ['ბგერა სწორია — სიმს მიკროფონი ვერ არჩევს, ამიტომ ჩაითვალა', 'Right pitch — the microphone cannot tell strings apart, so it counts'], 'tr.start': ['დაწყება', 'Start'],
  'tr.srs': ['რომელსაც ხშირად გეშლება, უფრო ხშირად მოვა.', 'Notes you miss come back more often.'], 'tr.needMic': ['ტრენაჟორი მიკროფონით მუშაობს.', 'The trainer works with the microphone.'],
  'dl.title': ['დღევანდელი ვარჯიში', 'Today’s practice'], 'dl.lead': ['{m} წუთი · შენი ბოლო შეცდომებიდან აწყობილი', '{m} minutes · built from your recent mistakes'],
  'dl.warm': ['გახურება', 'Warm-up'], 'dl.notes': ['ნოტები', 'Notes'], 'dl.rhythm': ['რიტმი', 'Rhythm'], 'dl.melody': ['მელოდია', 'Melody'], 'dl.song': ['სიმღერა', 'Song'],
  'dl.min': ['{n} წთ', '{n} min'], 'dl.done': ['შესრულებულია', 'Done'], 'dl.allDone': ['დღევანდელი გეგმა შესრულებულია.', 'Today’s plan is complete.'], 'dl.focus': ['ფოკუსი: {x}', 'Focus: {x}'], 'dl.noSong': ['სიმღერა ჯერ არ არის ჩაწერილი', 'No song recorded yet']
});

PD.pageScope = () => { const offs = []; const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); }); return f => offs.push(f); };

/* =================== METRONOME =================== */
PD.metronome = (() => {
  const h = PD.h, ic = PD.ic;
  const st = { on: false, timer: 0, next: 0, beat: 0, sub: 0, taps: [], pulse: null };
  const cfg = () => ({ bpm: PD.store.get('mBpm', 80), sig: PD.store.get('mSig', 4), accent: PD.store.get('mAccent', true), sub: PD.store.get('mSub', 1), haptic: PD.store.get('mHaptic', false) });
  function start() {
    const ctx = PD.audio.ensure(); if (!ctx || st.on) return;
    st.on = true; st.next = ctx.currentTime + .08; st.beat = 0; st.sub = 0;
    st.timer = setInterval(tick, 20); tick(); PD.bus.emit('metro', true);
  }
  function stop() { clearInterval(st.timer); st.on = false; PD.bus.emit('metro', false); }
  function tick() {
    const ctx = PD.audio.ctx, c = cfg(), spb = 60 / c.bpm, n = c.sub, sig = c.sig;
    while (st.next < ctx.currentTime + .12) {
      const first = st.sub === 0, beat = st.beat, accent = first && c.accent && (beat === 0 || (sig === 6 && beat === 3));
      PD.audio.click(st.next, accent, !first);
      if (first) {
        const delay = Math.max(0, (st.next - ctx.currentTime) * 1000);
        setTimeout(() => { if (st.pulse) st.pulse(beat, accent); if (c.haptic && navigator.vibrate) try { navigator.vibrate(accent ? 22 : 10); } catch (_) {} }, delay);
      }
      st.next += spb / n; st.sub++;
      if (st.sub >= n) { st.sub = 0; st.beat = (st.beat + 1) % sig; }
    }
  }
  function tap() {
    const now = performance.now(); st.taps = st.taps.filter(x => now - x < 2500); st.taps.push(now);
    if (st.taps.length >= 2) { const d = []; for (let i = 1; i < st.taps.length; i++) d.push(st.taps[i] - st.taps[i - 1]); const avg = d.reduce((a, b) => a + b, 0) / d.length; PD.store.set('mBpm', Math.max(30, Math.min(240, Math.round(60000 / avg)))); }
  }
  function page(w) {
    const own = PD.pageScope();
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => history.length > 1 ? history.back() : PD.app.go('practice') }), h('h1', { 'data-t': 'mt.title', style: 'margin:0' })]));
    const c = cfg();
    const bpmEl = h('b', { class: 'mt-bpm' }), dots = h('div', { class: 'mt-dots', 'aria-hidden': 'true' });
    const rng = h('input', { type: 'range', min: '30', max: '240', step: '1', 'aria-label': 'BPM', oninput: e => { PD.store.set('mBpm', +e.target.value); upd(); } });
    const go = h('button', { class: 'btn primary mt-go', onclick: () => { st.on ? stop() : start(); upd(); } });
    const seg = (key, opts, cur, on) => { const sg = h('div', { class: 'seg', role: 'group', 'aria-label': t(key) }, opts.map(([v, l]) => h('button', { 'data-v': String(v), 'aria-pressed': String(cur === v), html: l, onclick: e => { on(v); sg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget))); upd(); } }))); return sg; };
    const tg = (k, key, def) => { const i = h('input', { type: 'checkbox', 'aria-label': t(k) }); i.checked = PD.store.get(key, def); i.onchange = () => PD.store.set(key, i.checked); return h('label', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': k })]), i]); };
    function upd() { const c2 = cfg(); bpmEl.textContent = c2.bpm; rng.value = String(c2.bpm); go.textContent = t(st.on ? 'mt.stop' : 'mt.start'); dots.innerHTML = ''; for (let i = 0; i < c2.sig; i++) dots.appendChild(h('i', { class: (i === 0 || (c2.sig === 6 && i === 3)) && c2.accent ? 'acc' : '' })); }
    st.pulse = (b, acc) => { const d = dots.children[b]; if (!d) return; d.classList.remove('on'); void d.offsetWidth; d.classList.add('on'); };
    w.append(h('section', { class: 'mt' }, [
      h('div', { class: 'mt-main' }, [
        h('button', { class: 'btn icon', 'aria-label': '−1', text: '−', onclick: () => { PD.store.set('mBpm', Math.max(30, cfg().bpm - 1)); upd(); } }),
        h('div', { class: 'mt-read' }, [bpmEl, h('small', { text: 'BPM' })]),
        h('button', { class: 'btn icon', 'aria-label': '+1', text: '+', onclick: () => { PD.store.set('mBpm', Math.min(240, cfg().bpm + 1)); upd(); } })]),
      dots, rng,
      h('div', { class: 'row', style: 'justify-content:center' }, [go, h('button', { class: 'btn', 'data-t': 'mt.tap', onclick: () => { tap(); upd(); } })]),
      h('div', { class: 'set-sec' }, [h('div', { class: 'list' }, [
        h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'mt.sig' })]), seg('mt.sig', [[2, '2/4'], [3, '3/4'], [4, '4/4'], [6, '6/8']], c.sig, v => PD.store.set('mSig', v))]),
        h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'mt.sub' })]), seg('mt.sub', [[1, '♩'], [2, '♪♪'], [3, '3'], [4, '♬']], c.sub, v => PD.store.set('mSub', v))]),
        h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'mt.sound' })]), seg('mt.sound', ['click', 'wood', 'beep', 'soft'].map(k => [k, PD.esc(t('snd.' + k))]), PD.store.get('metroSound', 'click'), v => { PD.store.set('metroSound', v); PD.audio.ensure(); PD.audio.click(PD.audio.now() + .02, true); })]),
        tg('mt.accent', 'mAccent', true), tg('mt.haptic', 'mHaptic', false),
        h('div', { class: 'li' }, [h('div', { class: 'grow' }, [h('span', { 'data-t': 'mt.vol' })]), h('span', { class: 'set-ctl' }, [h('input', { type: 'range', min: '0', max: '1', step: '.05', value: String(PD.audio.vol.metro), oninput: e => PD.audio.setVol('metro', +e.target.value) })])])])])]));
    upd();
    own(() => { stop(); st.pulse = null; });
  }
  return { page, start, stop, get on() { return st.on; } };
})();

/* =================== NOTE & FRET TRAINER =================== */
PD.trainer = (() => {
  const h = PD.h, ic = PD.ic, TH = PD.theory;
  const FREE_TR = new Set(['open', 'f13', 'f15']);   // the rest of the trainer is premium
  const LEVELS = [
    { id: 'open', f: [0, 0], q: 'pos' }, { id: 'f13', f: [0, 3] }, { id: 'f15', f: [0, 5] }, { id: 'f17', f: [0, 7] }, { id: 'full', f: [0, 17] },
    { id: 'random', f: [0, 12] }, { id: 'speed', f: [0, 7], timed: 60 }, { id: 'ear', f: [0, 5], ear: true }];
  const IV = [0, 60e3, 10 * 60e3, 3600e3, 864e5, 3 * 864e5];   // spaced-repetition intervals by box
  const srs = () => PD.store.get('trainer.srs', {});
  function pick(level, last) {
    const L = LEVELS.find(x => x.id === level), S = srs(), now = Date.now(), items = [];
    for (let s = 1; s <= 3; s++) for (let f = L.f[0]; f <= L.f[1]; f++) items.push({ s, f, k: s + ':' + f });
    // weight: low boxes and due items come more often (the notes you miss come back)
    const w = items.map(it => { const r = S[it.k] || { box: 0, due: 0 }; return (it.k === last ? 0 : 1) * Math.pow(5 - Math.min(4, r.box), 2) * (r.due <= now ? 2 : .6); });
    let sum = w.reduce((a, b) => a + b, 0), x = Math.random() * sum;
    for (let i = 0; i < items.length; i++) { x -= w[i]; if (x <= 0) return items[i]; }
    return items[0];
  }
  function grade(k, ok) { const S = srs(), r = S[k] || { box: 0, due: 0, n: 0, ok: 0 }; r.n++; if (ok) { r.ok++; r.box = Math.min(5, r.box + 1); } else r.box = 0; r.due = Date.now() + IV[r.box]; S[k] = r; PD.store.set('trainer.srs', S); }
  function weakest() { const S = srs(), ks = Object.keys(S).filter(k => S[k].n >= 2).sort((a, b) => S[a].ok / S[a].n - S[b].ok / S[b].n); return ks.slice(0, 3); }

  function page(w, param) {
    const own = PD.pageScope();
    let level = param && LEVELS.some(l => l.id === param) ? param : PD.store.get('tr.level', 'open');
    let cur = null, last = null, stats = { a: 0, c: 0, streak: 0 }, t0 = 0, timer = 0, wrongN = 0, startedAt = Date.now(), done = false, locked = false, micMine = false;
    w.append(h('div', { class: 'row' }, [h('button', { class: 'btn small', html: ic.back + '<span data-t="back"></span>', onclick: () => history.length > 1 ? history.back() : PD.app.go('practice') }), h('h1', { 'data-t': 'tr.title', style: 'margin:0' })]),
      h('p', { class: 'muted', 'data-t': 'tr.lead' }));
    const tabs = h('div', { class: 'chips-row', role: 'tablist' }, LEVELS.map(L => h('button', { class: 'chip' + (FREE_TR.has(L.id) || PD.premium.active ? '' : ' locked'), role: 'tab', 'aria-pressed': String(L.id === level), 'data-t': 'tl.' + L.id, onclick: () => { if (!FREE_TR.has(L.id) && !PD.premium.active) return PD.premium.paywall('trainer.pro'); level = L.id; PD.store.set('tr.level', level); tabs.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.t === 'tl.' + level))); reset(); } })));
    const prompt = h('div', { class: 'tr-prompt' }), sub = h('div', { class: 'tr-sub' }), fb = h('div', { class: 'tr-fb', 'aria-live': 'polite' });
    const score = h('div', { class: 'tr-score mono' });
    const nv = h('div', { class: 'neckview' }), ncv = h('canvas'); nv.appendChild(ncv);
    const view = PD.Neck(ncv, { onTap: (s, f) => { if (PD.store.get('devTouch', false)) answer(TH.midi(s, f), true); } }); view.mirror = PD.store.get('lefty', false);
    const micBox = h('div', { class: 'mg-inline', hidden: true }, [h('span', { 'data-t': 'tr.needMic' }), h('button', { class: 'btn primary small', html: ic.mic + '<span data-t="gate.on"></span>', onclick: () => PD.practice.micOn(ok => { if (ok) micMine = true; updMic(); }) })]);
    const controls = h('div', { class: 'row' });
    w.append(tabs, h('section', { class: 'tr-card' }, [prompt, sub, fb, controls, micBox]), nv, h('div', { class: 'row', style: 'justify-content:space-between' }, [score, h('span', { class: 'muted', style: 'font-size:12.5px', 'data-t': 'tr.srs' })]));
    let raf = 0;
    const loop = () => { raf = requestAnimationFrame(loop); if (!document.hidden && !PD.practice.active) view.draw(); };
    requestAnimationFrame(() => { view.layout(); raf = requestAnimationFrame(loop); });
    const ro = new ResizeObserver(() => view.layout()); ro.observe(nv); own(() => ro.disconnect());
    function show(s, f, reveal) {
      // the shared instrument view shows the target (position questions) or the answer (after a miss)
      // finger shown only where the plain one-finger-per-fret convention applies (frets 1–4); otherwise just the target ring
      view.setTarget(s == null ? [] : [{ s, f, fi: f >= 1 && f <= 4 ? f : 0 }], []);
    }
    function updMic() { micBox.hidden = PD.detector.active || PD.store.get('devTouch', false); }
    function next() {
      const L = LEVELS.find(x => x.id === level);
      cur = pick(level, last && last.k); last = cur; wrongN = 0; fb.textContent = ''; fb.className = 'tr-fb';
      const m = TH.midi(cur.s, cur.f), byName = L.q !== 'pos' && (level === 'random' || level === 'full' || level === 'speed' ? Math.random() < .5 : Math.random() < .35);
      cur.m = m; cur.byName = byName && !L.ear;
      controls.innerHTML = '';
      if (L.ear) { prompt.textContent = t('tr.ear'); sub.textContent = ''; show(null); const play = () => { PD.audio.ensure(); PD.audio.note(cur.s, cur.f, { vel: .75 }); }; controls.append(h('button', { class: 'btn', html: ic.play + '<span data-t="tr.again"></span>', onclick: play })); PD.i18n.apply(controls); setTimeout(play, 250); return; }
      if (cur.byName) { prompt.textContent = t('tr.playNote', { n: TH.name(m) }); sub.textContent = TH.nameKa(m); show(null); }
      else { prompt.textContent = cur.f ? t('tr.playPos', { s: TH.stringName(cur.s), f: cur.f }) : t('tr.playOpen', { s: TH.stringName(cur.s) }); sub.textContent = ''; show(cur.s, cur.f); }
    }
    function answer(midi, touch) {
      if (!cur || done || locked) return;
      const L = LEVELS.find(x => x.id === level);
      if (L.timed && !t0) { t0 = performance.now(); timer = setInterval(tickTimer, 250); }
      stats.a++;
      const ok = Math.abs(midi - cur.m) < .45;
      if (ok) {
        stats.c++; stats.streak++; grade(cur.k, wrongN === 0);
        fb.textContent = '✓ ' + t('tr.ok') + (cur.byName && !touch && TH.positions(cur.m).length > 1 ? ' · ' + t('tr.samePitch') : ''); fb.className = 'tr-fb ok'; view.confirm(); view.pluck(cur.s, cur.f);
        if (L.ear || cur.byName) show(cur.s, cur.f, true);
        if (PD.store.get('haptics', true) && navigator.vibrate) try { navigator.vibrate(12); } catch (_) {}
        locked = true; const q = cur;
        setTimeout(() => { if (cur !== q) return; locked = false; if (!done) next(); updScore(); }, L.timed ? 350 : 900);
      } else {
        stats.streak = 0; wrongN++; if (wrongN === 1) grade(cur.k, false);
        fb.textContent = t('tr.heard', { p: TH.name(Math.round(midi)), e: TH.name(cur.m) }); fb.className = 'tr-fb fix'; view.wrong();
        if (wrongN >= 2) { show(cur.s, cur.f, true); fb.textContent += ' · ' + t('tr.where', { s: TH.stringName(cur.s), f: cur.f }); }
      }
      updScore();
    }
    function tickTimer() { const L = LEVELS.find(x => x.id === level), left = Math.max(0, L.timed - (performance.now() - t0) / 1000); updScore(left); if (left <= 0) { clearInterval(timer); done = true; prompt.textContent = t('tr.done', { c: stats.c }); sub.textContent = ''; fb.textContent = ''; controls.innerHTML = ''; controls.append(h('button', { class: 'btn primary', 'data-t': 'tr.start', onclick: reset })); PD.i18n.apply(controls); } }
    function updScore(left) { score.textContent = t('tr.score', { c: stats.c, a: stats.a }) + ' · ' + t('tr.streak', { n: stats.streak }) + (left != null ? ' · ' + t('tr.time', { s: Math.ceil(left) }) : ''); }
    function reset() { clearInterval(timer); t0 = 0; done = false; locked = false; stats = { a: 0, c: 0, streak: 0 }; updScore(); next(); }
    own(PD.detector.on('note', m => { if (m.unsure || m.conf < .6 || PD.practice.active) return; answer(m.midi, false); }));
    own(PD.detector.on('state', updMic));
    own(() => { cancelAnimationFrame(raf); clearInterval(timer); view.destroy(); if (micMine && !PD.practice.active && !PD.store.get('micStay', false)) PD.detector.stop(); if (stats.a) PD.lessons.progress.addSession({ id: 'trainer:' + level, date: Date.now(), dur: Math.round((Date.now() - startedAt) / 1000), firstTry: stats.c / stats.a, pitch: stats.c / stats.a, timing: null, bpm: null, tempo: null, mode: 'trainer', waited: true, probs: {} }); if (stats.a && Date.now() - startedAt > 45e3) PD.daily.markActive(); });
    updMic(); reset();
  }
  return { page, LEVELS, weakest, srs };
})();

/* =================== DAILY PRACTICE =================== */
PD.daily = (() => {
  const h = PD.h, LS = PD.lessons;
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };   // the learner's local day
  const doneMap = () => PD.store.get('daily.' + today(), {});
  function plan() {
    const goal = PD.store.get('goalMin', 15), k = goal / 15, mins = m => Math.max(1, Math.round(m * k));
    const out = [];
    const warm = LS.get('poc-three') || LS.all.find(l => l.type === 'melody' && l.events.length);
    if (warm) out.push({ id: 'warm', key: 'dl.warm', min: mins(2), title: PD.i18n.pick(warm.title), go: () => PD.app.startStage(warm, 'wait') });
    // notes: the trainer level that matches the frets the learner gets wrong most
    const weak = PD.trainer.weakest(), maxF = weak.length ? Math.max(...weak.map(x => +x.split(':')[1])) : 3, lvl = maxF <= 0 ? 'open' : maxF <= 3 ? 'f13' : maxF <= 5 ? 'f15' : maxF <= 7 ? 'f17' : 'full';
    out.push({ id: 'notes', key: 'dl.notes', min: mins(3), title: t('tr.title') + ' · ' + t('tl.' + lvl), focus: weak.length ? weak.map(x => { const [s, f] = x.split(':'); return PD.theory.stringName(+s) + ' ' + f; }).join(', ') : null, go: () => PD.app.go('trainer', lvl) });
    // rhythm: the teacher rhythm practised least
    const rh = PD.curriculum.rhythms().map(r => ({ r, p: LS.progress.lesson('rhythm-' + r.id).plays || 0 })).sort((a, b) => a.p - b.p)[0];
    const pr = LS.get('poc-rhythm');
    if (rh || pr) out.push({ id: 'rhythm', key: 'dl.rhythm', min: mins(3), title: rh ? PD.i18n.pick(rh.r.name) : PD.i18n.pick(pr.title), go: () => rh ? PD.app.go('rhythm', rh.r.id) : PD.app.startStage(pr, 'metro') });
    // melody: the weakest bars from history, else the next melody on the path
    const sug = PD.coach.today();
    const mel = sug ? sug.lesson : LS.all.find(l => l.type === 'melody' && l.events.length && LS.progress.lesson(l.id).mastery < .9) || LS.get('m1');
    if (mel) out.push({ id: 'melody', key: 'dl.melody', min: mins(4), title: PD.i18n.pick(mel.title), focus: sug ? t(sug.key) + ' · ' + t('w.bars', { a: sug.barA, b: sug.barB }) : null, go: () => sug ? PD.coach.start(sug) : PD.app.go('lesson', mel.id) });
    const song = LS.all.filter(l => l.type === 'song' && l.events.length).sort((a, b) => LS.progress.lesson(b.id).last - LS.progress.lesson(a.id).last)[0];
    out.push({ id: 'song', key: 'dl.song', min: mins(3), title: song ? PD.i18n.pick(song.title) : t('dl.noSong'), go: song ? () => PD.app.go('lesson', song.id) : null });
    const dm = doneMap(); out.forEach(x => x.done = !!dm[x.id]);
    return out;
  }
  function start(seg) { PD.store.set('daily.active', { id: seg.id, day: today(), at: Date.now() }); seg.go && seg.go(); }
  function markActive() { const a = PD.store.get('daily.active', null); if (!a || a.day !== today()) return; const dm = doneMap(); dm[a.id] = true; PD.store.set('daily.' + today(), dm); PD.store.del('daily.active'); }
  // a finished, scored session completes the active segment
  PD.engine.on('end', r => { if (r) markActive(); });
  function page(w) {
    const p = plan(), goal = PD.store.get('goalMin', 15), dn = p.filter(x => x.done).length;
    w.append(h('div', {}, [h('h1', { 'data-t': 'dl.title' }), h('p', { class: 'muted', style: 'margin-top:6px', text: t('dl.lead', { m: goal }) })]),
      h('div', { class: 'steps-line', style: 'max-width:420px' }, p.map(x => h('i', { class: x.done ? 'done' : '' }))));
    if (dn === p.length) w.append(h('p', { class: 'notice', text: t('dl.allDone') }));
    w.append(h('div', { class: 'list' }, p.map((x, i) => h('div', { class: 'step' }, [h('span', { class: 'num' + (x.done ? ' done' : !x.done && p.slice(0, i).every(y => y.done) ? ' cur' : ''), text: x.done ? '✓' : String(i + 1) }),
      h('div', { class: 'body' }, [h('b', { text: t(x.key) + ' · ' + t('dl.min', { n: x.min }) }), h('p', { text: x.title + (x.focus ? ' — ' + t('dl.focus', { x: x.focus }) : '') })]),
      x.go ? h('button', { class: 'btn small' + (!x.done && p.slice(0, i).every(y => y.done) ? ' primary' : ''), 'data-t': x.done ? 'dl.done' : 'home.start', onclick: () => start(x) }) : null]))));
  }
  return { plan, page, start, markActive };
})();
