/* =====================================================================
   Games: each game's start page (levels, difficulty, options) and its
   screen during play. The stage (games.js) runs the flow and the clock;
   the rules are gamecore.js. A game here only draws and forwards what the
   microphone reported: notes (pitch + stroke time), onsets (strokes) and
   the chord check, all in song time (S.toSong).
   ===================================================================== */
PD.i18n.add({
  'gm.nr.h1': ['ზოლები სიმებია: A · C♯ · E. ნოტზე წერია ლადი (0 = ღია სიმი) და ნოტის სახელი.', 'The lanes are the strings: A · C♯ · E. A note shows its fret (0 = open string) and its name.'],
  'gm.nr.h2': ['დაუკარი, როცა ნოტი ნათელ ხაზს მიაღწევს.', 'Play as the note reaches the glowing line.'], 'gm.nr.h3': ['ზედიზედ სწორი ნოტები ზრდის კომბოს: ×2 10-დან, ×3 25-დან, ×4 50-დან.', 'Right notes in a row build the combo: ×2 from 10, ×3 from 25, ×4 from 50.'],
  'gm.nr.dd': ['ზუსტი ±{p} ms · ბგერა ±{c}¢', 'Perfect ±{p} ms · pitch ±{c}¢'], 'gm.nr.bpm': ['{n} BPM · {k} ნოტი', '{n} BPM · {k} notes'],
  'gm.rb.pick': ['რიტმი', 'Rhythm'], 'gm.rb.tempo': ['ტემპი', 'Tempo'],
  'gm.rb.h1': ['ჯერ 4 ათვლა, შემდეგ რიტმი წრეზე. მეტრონომი ყოველ დარტყმაზე წკაპუნებს, აქცენტზე — უფრო ხმამაღლა.', 'First a count of 4, then the rhythm round and round. The metronome clicks on every stroke, louder on an accent.'],
  'gm.rb.h2': ['წითელი ისარი — აქცენტი (ძლიერად), სპილენძისფერი — ჩვეულებრივი.', 'A red arrow is an accent (strong), copper is a normal stroke.'], 'gm.rb.h3': ['დაარტყი, როცა ისარი ვერტიკალურ ხაზს მიაღწევს.', 'Strike as the arrow reaches the vertical line.'],
  'gm.rb.cycles': ['{n} წრე · {s} დარტყმა', '{n} rounds · {s} strokes'], 'gm.rb.lockT': ['ჯერ ნელი ტემპი გაიარე ★-ით', 'Clear the slower tempo with a ★ first'], 'gm.rb.accOk': ['აქცენტი ✓', 'Accent ✓'],
  'gm.mm.h1': ['აპი ფანდურის ხმით დაუკრავს მოკლე მელოდიას.', 'The app plays a short melody in the sound of a fanduri.'], 'gm.mm.h2': ['როცა „ახლა შენ“ გამოჩნდება, გაიმეორე ნოტები იმავე რიგით.', 'When “Your turn” appears, play the notes back in the same order.'],
  'gm.mm.h3': ['შეცდომის შემდეგ იმავე ნოტს თავიდან სცადე. მინიშნება შემდეგ ნოტს გიჩვენებს.', 'After a mistake, try the same note again. A hint shows the next note.'],
  'gm.mm.l': ['{n} ნოტი', '{n} notes'], 'gm.mm.lr': ['{n} ნოტი · რიტმით', '{n} notes · with rhythm'], 'gm.mm.lp': ['{n} ნოტი · რიტმი და პაუზები', '{n} notes · rhythm and rests'],
  'gm.mm.listen': ['მოუსმინე…', 'Listen…'], 'gm.mm.your': ['ახლა შენ', 'Your turn'], 'gm.mm.again': ['კიდევ მოსმენა', 'Listen again'], 'gm.mm.hint': ['მინიშნება', 'Hint'], 'gm.mm.hintN': ['შემდეგი: {n} · {p}', 'Next: {n} · {p}'],
  'gm.mm.ok': ['სწორია!', 'Correct!'], 'gm.mm.wrong': ['გავიგე {p} — სცადე {i}-ე ნოტი კიდევ', 'Heard {p} — try note {i} again'], 'gm.mm.round': ['მელოდია {a} / {b}', 'Melody {a} / {b}'], 'gm.mm.clean': ['უშეცდომოდ!', 'No mistakes!'],
  'gm.mm.rhythm': ['რიტმი: {p}', 'Rhythm: {p}'], 'gm.mm.skip': ['გამოტოვება', 'Skip'], 'gm.mm.first': ['პირველივე ცდით', 'On the first try'], 'gm.mm.replays': ['დამატებითი მოსმენები', 'Extra listens'], 'gm.mm.target': ['მელოდია', 'Melody'], 'gm.mm.you': ['შენ', 'You'],
  'gm.fh.h1': ['ზემოთ ნოტის სახელია. იპოვე ის ნებისმიერ სიმზე და დაუკარი.', 'The name of a note is at the top. Find it on any string and play it.'], 'gm.fh.h2': ['ითვლება სწორი ბგერა სწორ ოქტავაში; სწრაფად პოვნა მეტ ქულას იძლევა.', 'The right pitch in the right octave counts; finding it fast earns more.'],
  'gm.fh.find': ['იპოვე', 'Find'], 'gm.fh.pos': ['{s} სიმი · {f} ლადი', 'string {s} · fret {f}'], 'gm.fh.open': ['{s} — ღია', '{s} — open'], 'gm.fh.ok': ['იპოვე — {s} წმ', 'Found — {s} s'],
  'gm.fh.octave': ['ბგერა სწორია, ოქტავა — არა: სცადე {d}', 'Right note, other octave — try {d}'], 'gm.fh.higher': ['უფრო მაღლა', 'higher'], 'gm.fh.lower': ['უფრო დაბლა', 'lower'], 'gm.fh.heard': ['გავიგე {p}', 'Heard {p}'],
  'gm.fh.time': ['დრო ამოიწურა — აქ იყო: {p}', 'Time is up — it was here: {p}'], 'gm.fh.hintIn': ['მინიშნება {s} წამში', 'A hint in {s} s'], 'gm.fh.l': ['ლადები {a}–{b}', 'Frets {a}–{b}'], 'gm.fh.found': ['ნაპოვნია', 'Found'], 'gm.fh.avg': ['საშუალო დრო', 'Average time'], 'gm.fh.n': ['ნოტი {a} / {b}', 'Note {a} / {b}'], 'gm.fh.sec': ['{s} წმ', '{s} s'],
  'gm.cm.h1': ['გრიფზე თითებია მასწავლებლის წესით: ცერა ბანზე, დანარჩენი თითები ზედა ორ ხმაზე.', "The neck shows the fingers by the teacher's rule: the thumb on the bass, the other fingers on the two voices above."],
  'gm.cm.h2': ['დაუკარი სიმები სათითაოდ, ბანიდან ზემოთ. აპი თითოეულ ბგერას ცალკე ამოწმებს.', 'Play the strings one at a time, from the bass up. The app checks every tone on its own.'],
  'gm.cm.chordN': ['აკორდი {a} / {b}', 'Chord {a} / {b}'], 'gm.cm.ok': ['აკორდი გამოვიდა!', 'Chord done!'], 'gm.cm.strumNow': ['ჩამოკარი მთლიანი აკორდი', 'Strum the whole chord'], 'gm.cm.heardN': ['გავიგე {k} / 3 ბგერა', 'Heard {k} / 3 tones'],
  'gm.cm.missing': ['არ ისმის: {s} სიმი', 'Not heard: string {s}'], 'gm.cm.skip': ['შემდეგი აკორდი', 'Next chord'], 'gm.cm.done': ['აკორდები', 'Chords'], 'gm.cm.firstNotes': ['ნოტები პირველივე ცდით', 'Notes on the first try'], 'gm.cm.fingersT': ['თითები: მასწავლებლის წესი', "Fingers: the teacher's rule"],
  'gm.sq.pick': ['სიმღერა ან მელოდია', 'Song or melody'], 'gm.sq.notes': ['{n} ნოტი', '{n} notes'], 'gm.sq.strokes': ['{n} დარტყმა', '{n} strokes'], 'gm.sq.mine': ['შენი', 'Yours'], 'gm.sq.ai': ['AI-ს შეფასება', 'AI estimate'],
  'gm.sq.tempo': ['ტემპი', 'Tempo'], 'gm.sq.section': ['სექცია', 'Section'], 'gm.sq.whole': ['მთლიანად', 'The whole piece'], 'gm.sq.loop': ['სექციის გამეორება (3-ჯერ)', 'Loop the section (3 times)'],
  'gm.sq.listen': ['მოსმენა', 'Listen'], 'gm.sq.listenD': ['აპი დაუკრავს და ტაბი იმავე დროს მოძრაობს — ქულა არ ითვლება.', 'The app plays and the tab moves with it — nothing is scored.'], 'gm.sq.none': ['ნოტებიანი მასალა ჯერ არ არის.', 'No material with notes yet.'],
  'gm.sq.h1': ['ტაბის სამი ხაზი სამი სიმია (E ზემოთ, A ქვემოთ), რიცხვი — ლადი.', 'The three lines of the tab are the strings (E on top, A at the bottom); a number is a fret.'], 'gm.sq.h2': ['დაუკარი, როცა რიცხვი ნათელ ხაზს მიაღწევს. აკორდზე — ერთი დარტყმა.', 'Play as a number reaches the glowing line. On a chord — one stroke.'],
  'gm.sq.pass': ['გავლა {a} / {b}', 'Pass {a} / {b}'], 'gm.sq.chordCk': ['აკორდის შემოწმება (ბეტა)', 'Chord check (beta)'], 'gm.sq.played': ['გავლილია', 'Played'],
  'gm.bj.mix': ['რა ისმის', 'What you hear'], 'gm.bj.full': ['ბენდი და ხმა', 'Band and voice'], 'gm.bj.music': ['მხოლოდ ბენდი', 'Band only'], 'gm.bj.vocals': ['მხოლოდ ხმა', 'Voice only'], 'gm.bj.off': ['მხოლოდ მეტრონომი', 'Metronome only'],
  'gm.bj.vol': ['ჩანაწერის ხმა', 'Recording volume'], 'gm.bj.metro': ['მეტრონომი', 'Metronome'], 'gm.bj.tempo': ['ტემპი', 'Tempo'], 'gm.bj.loading': ['ჩანაწერი იტვირთება…', 'Loading the recording…'], 'gm.bj.prep': ['ტემპი მზადდება… {p}%', 'Preparing the tempo… {p}%'],
  'gm.bj.err': ['ჩანაწერი ვერ ჩაიტვირთა — დაუკრავ მეტრონომთან.', 'The recording could not be loaded — you will play with the metronome.'],
  'gm.bj.noStems': ['დოლის და ბასის ცალკე ჩანაწერი არ გვაქვს — ბენდი აქ თავად ჩანაწერია, ხმით ან უხმოდ.', 'There are no separate drum or bass recordings — the band here is the recording itself, with or without the voice.'],
  'gm.bj.h1': ['რიტმი აჭარულია: ↓ · ↓> · ↑>. აკორდები: Dm Dm · B♭ · C — მთელ სიმღერაში.', 'The rhythm is Acharuli: ↓ · ↓> · ↑>. The chords: Dm Dm · B♭ · C — through the whole song.'],
  'gm.bj.h2': ['ფასდება დარტყმის დრო ჩანაწერის საკუთარ დარტყმებთან და აკორდის ბგერები.', "Each stroke's timing against the recording's own beats, and the chord's tones, are scored."],
  'gm.bj.chordDraft': ['B♭ და C-ს ფორმა აპმა გამოითვალა — მასწავლებელს ჯერ არ დაუდასტურებია.', 'The B♭ and C shapes were worked out by the app — the teacher has not confirmed them yet.'], 'gm.bj.chordOk': ['აკორდის ბგერები', 'Chord tones'],
  'gm.bj.practiceNote': ['ვარჯიშის რეჟიმში შედეგი არ ინახება.', 'In practice mode the result is not saved.']
});

PD.gameModes = (() => {
  const h = PD.h, G = PD.gameCore, GA = PD.gameAudio, TH = PD.theory;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const FONT = "'Inter','Noto Sans Georgian',system-ui,sans-serif";
  const COL = { cu: '#C58A52', cu2: '#F1B674', ok: '#55D697', err: '#ED6464', tx: '#F8F5F1', tx2: '#B6AAA0', perfect: '#F1B674', great: '#E9CF9F', good: '#BFAE98', miss: '#ED6464' };

  /* ---------- drawing helpers ---------- */
  /** a canvas filling the play field, sized for the screen (device pixels capped by the quality setting) */
  function canvasIn(S, onFit) {
    const cv = h('canvas', { 'aria-hidden': 'true' }), g = { cv, ctx: cv.getContext('2d'), W: 1, H: 1, dpr: 1 };
    S.field.prepend(cv);
    const fit = () => {
      const r = S.field.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
      const q = PD.store.get('quality', 'auto');
      g.dpr = Math.min(q === 'low' ? 1 : q === 'medium' ? 1.5 : 2, window.devicePixelRatio || 1);
      cv.width = Math.round(r.width * g.dpr); cv.height = Math.round(r.height * g.dpr); g.W = r.width; g.H = r.height;
      g.ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
      if (onFit) onFit(g);
    };
    const ro = new ResizeObserver(fit); ro.observe(S.field); fit();
    g.destroy = () => { ro.disconnect(); cv.remove(); };
    return g;
  }
  /** an offscreen layer drawn once per size */
  function layer(g, draw) { const c = document.createElement('canvas'); c.width = Math.round(g.W * g.dpr); c.height = Math.round(g.H * g.dpr); const x = c.getContext('2d'); x.setTransform(g.dpr, 0, 0, g.dpr, 0, 0); draw(x); return c; }
  function rrect(c, x, y, w, hh, r) { r = Math.min(r, w / 2, hh / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + hh, r); c.arcTo(x + w, y + hh, x, y + hh, r); c.arcTo(x, y + hh, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  /** sparks and rings for a hit — pooled, a few dozen at most, drawn additively */
  function sparks(on) {
    const P = [];
    return {
      burst(x, y, n, col) { if (!on) return; for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 180; P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: 1, col, r: 1.5 + Math.random() * 2.2 }); } P.push({ ring: true, x, y, life: 1, col }); if (P.length > 140) P.splice(0, P.length - 140); },
      draw(c, dt) {
        if (!P.length) return;
        c.save(); c.globalCompositeOperation = 'lighter';
        for (let i = P.length - 1; i >= 0; i--) {
          const p = P[i]; p.life -= dt * (p.ring ? 2.4 : 1.9); if (p.life <= 0) { P.splice(i, 1); continue; }
          if (p.ring) { const k = 1 - p.life; c.globalAlpha = p.life * .7; c.strokeStyle = p.col; c.lineWidth = 2.5 * p.life + .5; c.beginPath(); c.arc(p.x, p.y, 10 + k * 46, 0, Math.PI * 2); c.stroke(); continue; }
          p.vy += 320 * dt; p.x += p.vx * dt; p.y += p.vy * dt; c.globalAlpha = p.life; c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.r * p.life + .4, 0, Math.PI * 2); c.fill();
        }
        c.restore();
      }
    };
  }
  /** a stroke arrow ↓/↑ centred at (x, y) */
  function arrow(c, x, y, down, size, col, w) {
    const d = down ? 1 : -1, L = size / 2;
    c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(x, y - d * L); c.lineTo(x, y + d * L); c.moveTo(x - L * .55, y + d * L * .3); c.lineTo(x, y + d * L); c.lineTo(x + L * .55, y + d * L * .3); c.stroke();
  }

  /* ---------- page helpers ---------- */
  const sec = (title, kids) => h('section', { class: 'gm-card gm-sec' }, [title ? h('h2', { text: title }) : null].concat(kids));
  const bullets = keys => h('ul', { class: 'gm-ul' }, keys.map(k => h('li', { text: t(k) })));
  /** a row of choices; items: [{ id, label, title, lock }] */
  function seg(items, cur, pick, label) {
    const el = h('div', { class: 'gm-seg', role: 'group', 'aria-label': label || '' });
    items.forEach(it => el.append(h('button', { type: 'button', class: it.lock ? 'lock' : '', 'aria-pressed': String(it.id === cur), title: it.title || '', text: it.label, onclick: e => { if (it.lock) { PD.ui.toast(it.lockMsg || t('gm.unlockHint'), 2600); return; } const me = e.currentTarget; el.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === me))); pick(it.id); } })));
    return el;
  }
  /** a grid of levels; items: [{ id, n, name, desc, open, stars }] */
  function levels(items, cur, pick) {
    const el = h('div', { class: 'gm-levels', role: 'list' });
    items.forEach(it => {
      const b = h('button', { type: 'button', role: 'listitem', class: 'gm-lv' + (it.open ? '' : ' lock'), 'aria-pressed': String(String(it.id) === String(cur)), 'aria-disabled': it.open ? null : 'true', 'aria-label': it.name + (it.open ? '' : ' · ' + t('gm.locked')) },
        [h('span', { class: 'gm-lvn', text: it.n }), h('b', { text: it.name }), it.desc ? h('small', { text: it.desc }) : null, h('span', { class: 'gm-st', html: starsHTML(it.stars) })]);
      b.onclick = () => { if (!it.open) { PD.ui.toast(t('gm.unlockHint'), 2600); return; } el.querySelectorAll('.gm-lv').forEach(x => x.setAttribute('aria-pressed', String(x === b))); pick(it.id); };
      el.append(b);
    });
    return el;
  }
  const starsHTML = n => Array.from({ length: 3 }, (_, i) => '<svg viewBox="0 0 24 24" class="gm-star' + (i < n ? ' on' : '') + '" aria-hidden="true"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.4L12 17.2l-5.8 3.1 1.2-6.4L2.6 9.4l6.5-.8z"/></svg>').join('');
  /** the best result on the chosen level, and the start button locked on a locked level */
  function bestLine(c, open) {
    const p = h('p', { class: 'gm-note' });
    return { el: p, upd() { const r = c.P.rec(c.st.g, c.st.l, c.st.d); p.textContent = r ? t('gm.best', { s: r.best, a: Math.round((r.acc || 0) * 100) }) + ' · ' + '★'.repeat(r.stars || 0) : t('gm.noBest'); const ok = open ? open() : true; c.btn.disabled = !ok; } };
  }
  const fmtS = s => (Math.round(s * 10) / 10).toFixed(1);
  const posText = p => p.f ? t('gm.fh.pos', { s: TH.stringName(p.s), f: p.f }) : t('gm.fh.open', { s: TH.stringName(p.s) });
  /** a note's name as the learner reads it: C♯4 · დო♯ */
  const noteName = m => TH.name(m) + (PD.i18n.lang === 'ka' ? ' · ' + TH.nameKa(m) : '');

  /* =================================================================
     NOTE RUSH — notes fall down three lanes (the strings) to the line
     ================================================================= */
  const rush = {
    page(c) {
      const { st, w } = c; st.l = +st.l || 1; if (!G.DIFFS.includes(st.d)) st.d = 'normal';
      w.append(sec(t('gm.how'), [bullets(['gm.nr.h1', 'gm.nr.h2', 'gm.nr.h3'])]), sec(t('gm.listens'), [bullets(['gm.n.pitch', 'gm.n.unsure'])]));
      const D = d => G.diff(d), dsec = sec(t('gm.diff'), []), lsec = sec(t('gm.levels'), []), best = bestLine(c, () => c.P.open('rush', st.l));
      dsec.append(seg(G.DIFFS.map(d => ({ id: d, label: t('gm.d.' + d), title: t('gm.nr.dd', { p: Math.round(D(d).perfect * 1000), c: D(d).cents }) })), st.d, d => { st.d = d; sub.textContent = t('gm.nr.dd', { p: Math.round(D(d).perfect * 1000), c: D(d).cents }); drawL(); best.upd(); }, t('gm.diff')));
      const sub = h('p', { class: 'gm-note', text: t('gm.nr.dd', { p: Math.round(D(st.d).perfect * 1000), c: D(st.d).cents }) }); dsec.append(sub);
      const drawL = () => { lsec.querySelector('.gm-levels') && lsec.querySelector('.gm-levels').remove(); lsec.insertBefore(levels(G.RUSH.map(L => ({ id: L.id, n: t('gm.lvl', { n: L.id }), name: t('gm.rush.l.' + L.key), desc: t('gm.rush.ld.' + L.key) + ' · ' + t('gm.nr.bpm', { n: L.bpm, k: L.n }), open: c.P.open('rush', L.id), stars: (c.P.rec('rush', L.id, st.d) || {}).stars || 0 })), st.l, l => { st.l = l; best.upd(); }), best.el); };
      lsec.append(best.el); drawL();
      w.append(dsec, lsec);
      return () => best.upd();
    },
    nextOf(S) { return +S.l < G.RUSH.length ? { l: +S.l + 1, d: S.d } : null; },
    create(S) {
      const L = G.RUSH.find(x => x.id === +S.l) || G.RUSH[0], seed = S.opts.seed != null ? S.opts.seed >>> 0 : G.hash('rush:' + L.id);
      const C = G.rushChart(L.id, S.d, seed), chart = C.chart, D = S.D, M = G.noteMatcher(chart, D, S.sc);
      const lefty = !!PD.store.get('lefty', false), metro = PD.store.get('gm.metro', true) !== false, order = lefty ? [3, 2, 1] : [1, 2, 3];
      const res = chart.map(() => null), fx = sparks(S.fx);
      let g = null, geo = {}, bg = null, flash = 0, lastT = performance.now(), last = null, lastOff = null, nextBeat = -Math.floor(C.start / C.spb);
      function layout(g0) {
        const W = g0.W, H = g0.H, lw = Math.min(150, (W - 16) / 3), x0 = (W - lw * 3) / 2, hitY = Math.round(H * .76);
        geo = { W, H, lw, x0, hitY, topY: -46, nw: Math.min(92, lw * .68), nh: clamp(H * .052, 30, 42) };
        geo.lx = s => x0 + lw * (order.indexOf(s) + .5);
        const cb = S.field.querySelector('.gm-combo'); if (cb) cb.style.top = Math.round(hitY + geo.nh * .5 + 44) + 'px';
        bg = layer(g0, c => {
          order.forEach((s, i) => {
            const x = x0 + i * lw, gr = c.createLinearGradient(0, 0, 0, H);
            gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.75, 'rgba(197,138,82,.06)'); gr.addColorStop(1, 'rgba(197,138,82,.02)');
            c.fillStyle = gr; c.fillRect(x + 3, 0, lw - 6, H);
            c.strokeStyle = 'rgba(241,182,116,.09)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x + .5, 0); c.lineTo(x + .5, H); c.stroke();
            // the string itself, faint, down the lane
            c.strokeStyle = TH.color(s); c.globalAlpha = .16; c.lineWidth = s === 1 ? 2.2 : s === 2 ? 1.7 : 1.3; c.beginPath(); c.moveTo(x + lw / 2, 0); c.lineTo(x + lw / 2, H); c.stroke(); c.globalAlpha = 1;
            // the lane's name under the line
            const ly = hitY + geo.nh * .5 + 22;
            c.fillStyle = TH.color(s); c.beginPath(); c.arc(x + lw / 2 - 14, ly, 4, 0, Math.PI * 2); c.fill();
            c.fillStyle = COL.tx2; c.font = '700 14px ' + FONT; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(TH.stringName(s), x + lw / 2 - 6, ly);
          });
          c.strokeStyle = 'rgba(241,182,116,.09)'; c.beginPath(); c.moveTo(x0 + lw * 3 - .5, 0); c.lineTo(x0 + lw * 3 - .5, H); c.stroke();
          const hg = c.createLinearGradient(0, hitY - 26, 0, hitY + 26); hg.addColorStop(0, 'rgba(241,182,116,0)'); hg.addColorStop(.5, 'rgba(241,182,116,.18)'); hg.addColorStop(1, 'rgba(241,182,116,0)');
          c.fillStyle = hg; c.fillRect(x0, hitY - 26, lw * 3, 52);
        });
      }
      function hitFx(n, grade) { const x = geo.lx(n.s); fx.burst(x, geo.hitY, grade === 'perfect' ? 16 : grade === 'great' ? 10 : 6, COL[grade]); }
      function drawNote(c, n, y, i, st) {
        const x = geo.lx(n.s), w = geo.nw, hh = geo.nh, r = res[i], near = !r && Math.abs(n.t - st) < .14;
        let a = 1; if (r === 'miss' || r === 'unsure') a = clamp(1 - (st - n.t - D.win) / .6, 0, 1) * .8; if (a <= 0) return;
        c.globalAlpha = a;
        if (n.d >= 1.5 && !r) { const len = n.d * C.spb / D.lead * (geo.hitY - geo.topY); const tg = c.createLinearGradient(0, y - len, 0, y); tg.addColorStop(0, 'rgba(241,182,116,0)'); tg.addColorStop(1, 'rgba(241,182,116,.28)'); c.fillStyle = tg; rrect(c, x - 5, y - len, 10, len, 5); c.fill(); }
        if (near && S.fx) { c.fillStyle = 'rgba(241,182,116,.22)'; rrect(c, x - w / 2 - 6, y - hh / 2 - 6, w + 12, hh + 12, (hh + 12) / 2); c.fill(); }
        const gr = c.createLinearGradient(0, y - hh / 2, 0, y + hh / 2);
        if (r === 'miss') { gr.addColorStop(0, '#6b3434'); gr.addColorStop(1, '#3d2121'); } else if (r === 'unsure') { gr.addColorStop(0, '#4a4a50'); gr.addColorStop(1, '#2e2e33'); } else { gr.addColorStop(0, '#F6C38A'); gr.addColorStop(1, '#B57441'); }
        c.fillStyle = gr; rrect(c, x - w / 2, y - hh / 2, w, hh, hh / 2); c.fill();
        c.strokeStyle = r ? 'rgba(255,255,255,.08)' : 'rgba(255,236,210,.55)'; c.lineWidth = 1; rrect(c, x - w / 2 + .5, y - hh / 2 + .5, w - 1, hh - 1, hh / 2); c.stroke();
        c.fillStyle = r ? 'rgba(255,255,255,.55)' : '#1A0F07'; c.textAlign = 'center'; c.textBaseline = 'middle';
        if (S.names) { c.font = '800 ' + Math.round(hh * .46) + 'px ' + FONT; c.fillText(String(n.f), x - w * .18, y + 1); c.font = '700 ' + Math.round(hh * .32) + 'px ' + FONT; c.fillText(TH.pcName(n.midi), x + w * .2, y + 1); }
        else { c.font = '800 ' + Math.round(hh * .5) + 'px ' + FONT; c.fillText(String(n.f), x, y + 1); }
        c.globalAlpha = 1;
      }
      function draw(st) {
        if (!g || !bg) return;
        const c = g.ctx, { W, H, hitY, x0, lw } = geo, now = performance.now(), dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
        c.clearRect(0, 0, W, H); c.drawImage(bg, 0, 0, W, H);
        // the lane of the next note lights up a little
        const nx = chart.findIndex((n, i) => !res[i] && n.t > st - D.win);
        if (nx >= 0 && chart[nx].t - st < D.lead) { const x = geo.lx(chart[nx].s) - lw / 2; c.fillStyle = 'rgba(241,182,116,' + (.07 * (1 - (chart[nx].t - st) / D.lead)).toFixed(3) + ')'; c.fillRect(x + 3, 0, lw - 6, hitY); }
        // the line: brighter for a moment whenever a stroke is heard
        flash = Math.max(0, flash - dt * 4);
        c.fillStyle = 'rgba(241,182,116,' + (.75 + .25 * flash).toFixed(3) + ')'; c.fillRect(x0, hitY - 1.5 - flash * 1.5, lw * 3, 3 + flash * 3);
        if (S.fx && flash > 0) { c.fillStyle = 'rgba(241,182,116,' + (.18 * flash).toFixed(3) + ')'; c.fillRect(x0, hitY - 14, lw * 3, 28); }
        const span = geo.hitY - geo.topY;
        for (let i = 0; i < chart.length; i++) {
          const n = chart[i]; if (n.t - st > D.lead + .3) break;
          if (res[i] && res[i] !== 'miss' && res[i] !== 'unsure') continue;
          const y = geo.hitY - (n.t - st) / D.lead * span; if (y < -geo.nh * 2 || y > H + geo.nh) continue;
          drawNote(c, n, y, i, st);
        }
        fx.draw(c, dt);
      }
      let sideL = null, sideR = null, sideT = 0;
      function side(st) {
        const s0 = S.sc.s, n = s0.perfect + s0.great + s0.good + s0.miss, rec = PD.games.P.rec('rush', L.id, S.d);
        sideL.innerHTML = ''; sideL.append(h('h3', { text: t('gm.live') }));
        [['gm.j.perfect', s0.perfect], ['gm.j.great', s0.great], ['gm.j.good', s0.good], ['gm.j.miss', s0.miss], ['gm.acc', n ? Math.round((s0.perfect + s0.great * .8 + s0.good * .5) / n * 100) + '%' : '—'], ['gm.maxCombo', s0.maxCombo]]
          .forEach(([k, v]) => sideL.append(h('div', { class: 'gm-sr' }, [h('span', { text: t(k) }), h('b', { text: String(v) })])));
        if (rec) sideL.append(h('div', { class: 'gm-sr' }, [h('span', { text: t('gm.record') }), h('b', { text: String(rec.best) })]));
        sideR.innerHTML = ''; sideR.append(h('h3', { text: t('gm.nextUp') }));
        chart.filter((x, i) => !res[i] && x.t > st - D.win).slice(0, 5).forEach((x, k) => sideR.append(h('div', { class: 'gm-nx' + (k ? '' : ' gm-now') }, [h('b', { text: TH.pcName(x.midi) }), h('small', { text: posText(x) })])));
      }
      function tap(e) {   // the developer touch test only: a tap in a lane plays that lane's nearest note (or its open string)
        if (!S.dev || S.state !== 'playing') return;
        const r = S.field.getBoundingClientRect(), x = e.clientX - r.left, k = Math.floor((x - geo.x0) / geo.lw); if (k < 0 || k > 2) return;
        const s = order[k], st = S.songNow(), n = chart.find((q, i) => !res[i] && q.s === s && Math.abs(q.t - st) < D.win);
        api.onNote({ t: S.now() + S.off, midi: n ? n.midi : TH.midi(s, 0), conf: 1, src: 'touch' });
      }
      const api = {
        seed, total: chart.length,
        mount() {
          S.root.style.setProperty('--gm-fw', '600px'); g = canvasIn(S, layout); S.field.addEventListener('pointerdown', tap);
          // wide screens: live statistics on the left, the next notes on the right (CSS shows them only where there is room)
          sideL = h('div', { class: 'gm-side gm-side-l', 'aria-hidden': 'true' }); sideR = h('div', { class: 'gm-side gm-side-r', 'aria-hidden': 'true' });
          S.root.append(sideL, sideR);
        },
        schedule(hz) {
          if (!metro) return;
          for (;;) { const ts = C.start + nextBeat * C.spb; if (ts > C.len + C.spb) return; const a = S.clock.audio(ts); if (!(a < hz)) return; if (a > S.now() - .005) GA.click(a, ((nextBeat % 4) + 4) % 4 === 0); nextBeat++; }
        },
        pause() { nextBeat = Math.ceil((S.clock.at(S.now()) - C.start) / C.spb); },
        frame(st, state) {
          if (state === 'playing') {
            M.advance(st).forEach(r => { const n = chart[r.i]; res[r.i] = r.unsure ? 'unsure' : 'miss'; S.pop(r.unsure ? 'unsure' : 'miss', t(r.unsure ? 'gm.j.unsure' : 'gm.j.miss'), geo.lx(n.s), geo.hitY - 52); S.hud.combo(S.sc.s.combo); });
            S.hud.progress(st / C.len);
          }
          draw(st);
          const now = performance.now(); if (sideL && now - sideT > 200 && sideL.offsetParent) { sideT = now; side(st); }
        },
        onOnset(ev) { const tt = S.toSong(ev.t); if (tt == null) return; M.onset(tt); flash = 1; },
        onNote(ev) {
          last = ev; const tt = S.toSong(ev.t); if (tt == null) return;
          const r = M.input({ t: tt, midi: ev.midi, conf: ev.conf, unsure: ev.unsure });
          if (r.extra || r.unsure) return;
          const n = chart[r.i], x = geo.lx(n.s);
          if (r.grade) {
            res[r.i] = r.grade; lastOff = r.off; hitFx(n, r.grade);
            S.pop(r.grade, t('gm.j.' + r.grade), x, geo.hitY - 52); S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
            if (Math.abs(r.cents) > D.cents * .6) S.say(r.cents > 0 ? 'gm.k.sharp' : 'gm.k.flat', null, 'cu', 1100);
          } else if (r.miss) {
            res[r.i] = 'miss'; lastOff = r.off != null ? r.off : lastOff;
            S.pop('miss', t(r.kind === 'early' ? 'gm.j.early' : r.kind === 'late' ? 'gm.j.late' : 'gm.j.miss'), x, geo.hitY - 52); S.hud.combo(0);
            if (r.kind && t('gm.k.' + r.kind) !== 'gm.k.' + r.kind) S.hud.say(t('gm.k.' + r.kind) + (r.heard != null ? ' · ' + TH.name(r.heard) : ''), 'bad', 1500);
          }
        },
        done: st => M.done(st) && st > C.len,
        result: () => ({ total: chart.length }),
        test: () => M.st.map((x, i) => [x.res, x.off == null ? null : Math.round(x.off * 1000), x.cents == null ? null : Math.round(x.cents), chart[i].s]),
        dbgNote(ev) { last = ev; },
        dbg() { const nx = chart.find((n, i) => !res[i]); return { pitch: last && last.f ? Math.round(last.f) + ' Hz · ' + TH.name(last.midi) + ' ' + (last.cents > 0 ? '+' : '') + Math.round(last.cents || 0) + '¢' : '—', conf: last ? (last.conf || 0).toFixed(2) + (last.unsure ? ' ?' : '') : '—', off: lastOff != null ? Math.round(lastOff * 1000) + ' ms' : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS', exp: nx ? TH.name(nx.midi) + ' (' + TH.stringName(nx.s) + ' ' + nx.f + ')' : '—', got: last && last.midi ? TH.name(last.midi) : '—' }; },
        destroy() { S.field.removeEventListener('pointerdown', tap); if (g) g.destroy(); if (sideL) { sideL.remove(); sideR.remove(); } S.root.style.removeProperty('--gm-fw'); }
      };
      return api;
    }
  };

  /* =================================================================
     RHYTHM BATTLE — the teacher's rhythms against the metronome
     ================================================================= */
  const rhythm = {
    page(c) {
      const { st, w } = c, R = PD.curriculum.rhythms();
      if (!R.some(r => r.id === st.l)) st.l = R[0].id; if (!G.DIFFS.includes(st.d)) st.d = 'easy';
      w.append(sec(t('gm.how'), [bullets(['gm.rb.h1', 'gm.rb.h2', 'gm.rb.h3'])]), sec(t('gm.listens'), [bullets(['gm.n.dir'])]));
      const best = bestLine(c, () => c.P.tempoOpen(st.l, st.d)), list = h('div', { class: 'gm-songs', role: 'list' }), tsec = sec(t('gm.rb.tempo'), []), note = h('p', { class: 'gm-note' });
      const drawT = () => { const old = tsec.querySelector('.gm-seg'); if (old) old.remove(); tsec.prepend(seg(G.DIFFS.map(d => ({ id: d, label: t('gm.rb.d.' + d) + ' · ' + G.RB_BPM[d], lock: !c.P.tempoOpen(st.l, d), lockMsg: t('gm.rb.lockT') })), st.d, d => { st.d = d; best.upd(); }, t('gm.rb.tempo'))); };
      R.forEach(r => {
        const b = h('button', { type: 'button', role: 'listitem', class: 'gm-song', 'aria-pressed': String(r.id === st.l) }, [h('span', {}, [h('b', { text: PD.i18n.pick(r.name) }), h('small', { text: r.strokes.map(s => (s.direction === 'down' ? '↓' : '↑') + (s.accent ? '>' : '')).join(' ') + ' · ' + t('gm.rb.cycles', { n: G.RB_CYCLES[r.id] || 6, s: (G.RB_CYCLES[r.id] || 6) * r.strokes.length }) })]),
          h('span', { class: 'gm-st', style: 'display:flex;gap:2px', html: starsHTML(Math.max(0, ...G.DIFFS.map(d => (c.P.rec('rhythm', r.id, d) || {}).stars || 0))) })]);
        b.onclick = () => { st.l = r.id; list.querySelectorAll('.gm-song').forEach(x => x.setAttribute('aria-pressed', String(x === b))); if (!c.P.tempoOpen(st.l, st.d)) st.d = 'easy'; drawT(); drawN(); best.upd(); };
        list.append(b);
      });
      const drawN = () => { const r = R.find(x => x.id === st.l); note.textContent = (r && r.timing && r.timing.src === 'default' ? t('gm.n.timing') : '') + (st.l === 'khorumi' ? ' ' + t('gm.n.khorumi') : ''); };
      w.append(sec(t('gm.rb.pick'), [h('span', { class: 'tp-src teacher', style: 'justify-self:start', text: PD.ui.srcLabel('tp.src.teacher') }), list, note]), tsec);
      tsec.append(best.el); drawT(); drawN();
      return () => best.upd();
    },
    nextOf(S) { const i = G.DIFFS.indexOf(S.d); return i < G.DIFFS.length - 1 ? { l: S.l, d: G.DIFFS[i + 1] } : null; },
    create(S) {
      const R = PD.curriculum.rhythms(), r = R.find(x => x.id === S.l) || R[0], bpm = G.RB_BPM[S.d] || 60;
      const C = G.rhythmChart(r, bpm), chart = C.chart, D = S.D, M = G.rhythmMatcher(chart, D, S.sc), res = chart.map(() => null);
      const clicks = [0, 1, 2, 3].map(k => ({ t: k * C.spb, acc: k === 0 })).concat(chart.map(x => ({ t: x.t, acc: x.acc })));
      const fx = sparks(S.fx), recent = [];
      let g = null, geo = {}, bg = null, ci = 0, lastT = performance.now(), lastOff = null, strk = 0;
      S.hud.sub(PD.i18n.pick(r.name) + ' · ' + bpm + ' BPM');
      function layout(g0) {
        const W = g0.W, H = g0.H, cx = Math.round(W * .26), cy = Math.round(H * .5), gap = C.spb, pps = (W - cx) / ((W < 600 ? 4.2 : 6) * gap);
        const sz = clamp(Math.min(H * .12, pps * gap * .62), 26, 74);
        geo = { W, H, cx, cy, sz, pps };
        bg = layer(g0, c => {
          const band = c.createLinearGradient(0, cy - sz * 1.1, 0, cy + sz * 1.1); band.addColorStop(0, 'rgba(255,255,255,0)'); band.addColorStop(.5, 'rgba(197,138,82,.08)'); band.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = band; c.fillRect(0, cy - sz * 1.1, W, sz * 2.2);
          c.strokeStyle = 'rgba(241,182,116,.14)'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, cy + .5); c.lineTo(W, cy + .5); c.stroke();
          const cg = c.createLinearGradient(cx - 22, 0, cx + 22, 0); cg.addColorStop(0, 'rgba(241,182,116,0)'); cg.addColorStop(.5, 'rgba(241,182,116,.16)'); cg.addColorStop(1, 'rgba(241,182,116,0)');
          c.fillStyle = cg; c.fillRect(cx - 22, cy - sz * 1.6, 44, sz * 3.2);
          c.fillStyle = 'rgba(241,182,116,.85)'; c.fillRect(cx - 1.5, cy - sz * 1.45, 3, sz * 2.9);
          // the timing meter: early ← · → late
          const mw = Math.min(320, W * .72), mx = (W - mw) / 2, my = Math.round(H * .86);
          c.fillStyle = 'rgba(255,255,255,.06)'; rrect(c, mx, my - 4, mw, 8, 4); c.fill();
          c.fillStyle = 'rgba(85,214,151,.25)'; const pw = mw * D.perfect / D.win; rrect(c, W / 2 - pw / 2, my - 4, pw, 8, 4); c.fill();
          c.fillStyle = COL.tx2; c.font = '600 11px ' + FONT; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillText(t('gm.j.early'), mx, my + 16); c.textAlign = 'right'; c.fillText(t('gm.j.late'), mx + mw, my + 16);
          geo.meter = { mx, mw, my };
        });
      }
      function draw(st) {
        if (!g || !bg) return;
        const c = g.ctx, { W, H, cx, cy, sz, pps } = geo, now = performance.now(), dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
        c.clearRect(0, 0, W, H); c.drawImage(bg, 0, 0, W, H);
        // the pendulum: at an end on every click
        const px = W / 2, py = Math.round(H * .13), ln = Math.min(70, H * .1), ph = st / C.spb, ang = .42 * Math.cos(Math.PI * ph), k = 1 - Math.min(1, Math.abs(ph - Math.round(ph)) * 4);
        c.strokeStyle = 'rgba(241,182,116,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(px, py - 8); c.lineTo(px + Math.sin(ang) * ln, py - 8 + Math.cos(ang) * ln); c.stroke();
        c.fillStyle = st >= -.1 ? 'rgba(241,182,116,' + (.5 + .5 * k).toFixed(3) + ')' : 'rgba(241,182,116,.4)'; c.beginPath(); c.arc(px + Math.sin(ang) * ln, py - 8 + Math.cos(ang) * ln, 6 + k * 3, 0, Math.PI * 2); c.fill();
        // the count-in: 1 2 3 4
        if (st < C.countIn * C.spb && st > -.2) { const n = Math.floor(st / C.spb) + 1; c.fillStyle = 'rgba(248,245,241,' + (.35 + .65 * k).toFixed(3) + ')'; c.font = '800 ' + Math.round(sz * 1.25) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(clamp(n, 1, 4)), cx, cy - sz * 2.1); }
        for (let i = 0; i < chart.length; i++) {
          const s = chart[i], x = cx + (s.t - st) * pps; if (x > W + sz) break; if (x < -sz * 2) continue;
          if (s.k === 0) { c.strokeStyle = 'rgba(241,182,116,.18)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x - sz * .7, cy - sz * 1.25); c.lineTo(x - sz * .7, cy + sz * 1.25); c.stroke(); c.fillStyle = 'rgba(182,170,160,.7)'; c.font = '600 11px ' + FONT; c.textAlign = 'left'; c.fillText(String(s.c + 1), x - sz * .7 + 4, cy - sz * 1.12); }
          const rr = res[i], big = s.acc ? 1 : .72, col = rr === 'miss' ? 'rgba(237,100,100,.35)' : rr ? COL[rr] : s.acc ? COL.err : '#D9A06B';
          let a = 1; if (x < cx - 4) a = clamp(1 - (cx - x) / (sz * 2.4), .15, 1);
          c.globalAlpha = a;
          if (rr && rr !== 'miss' && S.fx) { c.fillStyle = 'rgba(241,182,116,.16)'; c.beginPath(); c.arc(x, cy, sz * .62, 0, Math.PI * 2); c.fill(); }
          arrow(c, x, cy, s.dir === 'down', sz * big * 1.15, col, s.acc ? 7 : 4);
          if (s.acc && !rr) { c.fillStyle = COL.err; c.font = '800 ' + Math.round(sz * .3) + 'px ' + FONT; c.textAlign = 'center'; c.fillText('>', x + sz * .45, cy - sz * .62); }
          c.globalAlpha = 1;
        }
        // the last strokes on the meter
        const mt = geo.meter;
        recent.forEach((o, j) => { const x = W / 2 + clamp(o / D.win, -1, 1) * mt.mw / 2, al = (j + 1) / recent.length; c.fillStyle = Math.abs(o) <= D.perfect ? 'rgba(85,214,151,' + al + ')' : 'rgba(241,182,116,' + al + ')'; c.fillRect(x - 1.5, mt.my - 9, 3, 18); });
        fx.draw(c, dt);
      }
      function tap() { if (!S.dev || S.state !== 'playing') return; api.onOnset({ t: S.now() + S.off, strength: .2 + (strk++ % 3 === 0 ? .2 : 0), src: 'touch' }); }
      const api = {
        seed: 0, total: chart.length, countIn: true,
        mount() { g = canvasIn(S, layout); S.field.addEventListener('pointerdown', tap); },
        schedule(hz) { while (ci < clicks.length) { const a = S.clock.audio(clicks[ci].t); if (!(a < hz)) return; if (a > S.now() - .005) GA.click(a, clicks[ci].acc); ci++; } },
        pause() { const at = S.clock.at(S.now()); ci = clicks.findIndex(x => x.t >= at - 1e-6); if (ci < 0) ci = clicks.length; },
        frame(st, state) {
          if (state === 'playing') {
            M.advance(st).forEach(x => { res[x.i] = 'miss'; S.pop('miss', t('gm.j.miss'), geo.cx, geo.cy - geo.sz * 1.35); S.hud.combo(0); });
            S.hud.progress(st / C.len);
            // the accuracy so far, beside the tempo, a few times a second
            const s0 = S.sc.s, n = s0.perfect + s0.great + s0.good + s0.miss, now = performance.now();
            if (n && now - (api._accT || 0) > 250) { api._accT = now; S.hud.sub(PD.i18n.pick(r.name) + ' · ' + bpm + ' BPM · ' + Math.round((s0.perfect + s0.great * .8 + s0.good * .5) / n * 100) + '%'); }
          }
          draw(st);
        },
        onOnset(ev) {
          const tt = S.toSong(ev.t); if (tt == null) return;
          const x = M.input({ t: tt, strength: ev.strength });
          if (x.same) return;   // the later strings of the same stroke
          if (x.extra) { if (tt > C.countIn * C.spb - D.win) S.pop('unsure', '+1', geo.cx, geo.cy + geo.sz * 1.5); return; }
          lastOff = x.off; recent.push(x.off); if (recent.length > 8) recent.shift();
          if (x.grade) {
            res[x.i] = x.grade; fx.burst(geo.cx, geo.cy, x.grade === 'perfect' ? 14 : 8, COL[x.grade]);
            S.pop(x.grade, t('gm.j.' + x.grade), geo.cx, geo.cy - geo.sz * 1.35); S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
            if (x.accOk === false) S.say(chart[x.i].acc ? 'h.accWeak' : 'h.accExtra', null, 'cu', 1500);
            else if (x.accOk && chart[x.i].acc) S.say('gm.rb.accOk', null, 'ok', 900);
          } else { res[x.i] = 'miss'; S.pop('miss', t(x.kind === 'early' ? 'gm.j.early' : 'gm.j.late'), geo.cx, geo.cy - geo.sz * 1.35); S.hud.combo(0); }
        },
        done: st => M.done(st),
        result: () => ({ total: chart.length }),
        test: () => M.st.map(x => [x.res, x.off == null ? null : Math.round(x.off * 1000), x.accOk == null ? null : x.accOk]),
        dbg() { return { off: lastOff != null ? Math.round(lastOff * 1000) + ' ms' : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS', exp: 'BPM ' + bpm }; },
        destroy() { S.field.removeEventListener('pointerdown', tap); if (g) g.destroy(); }
      };
      return api;
    }
  };


  /* =================================================================
     MELODY MEMORY — the app plays, the learner answers
     ================================================================= */
  const memory = {
    page(c) {
      const { st, w } = c; st.l = +st.l || 1; st.d = 'normal';
      w.append(sec(t('gm.how'), [bullets(['gm.mm.h1', 'gm.mm.h2', 'gm.mm.h3'])]), sec(t('gm.listens'), [bullets(['gm.n.pitch', 'gm.n.unsure'])]));
      const best = bestLine(c, () => c.P.open('memory', st.l));
      const desc = L => t(L.rests ? 'gm.mm.lp' : L.rhythm ? 'gm.mm.lr' : 'gm.mm.l', { n: L.n2 ? L.n + '–' + L.n2 : L.n });
      w.append(sec(t('gm.levels'), [levels(G.MEMORY.map(L => ({ id: L.id, n: t('gm.lvl', { n: L.id }), name: desc(L), desc: t('gm.fh.l', { a: L.frets[0], b: L.frets[1] }), open: c.P.open('memory', L.id), stars: (c.P.rec('memory', L.id, 'normal') || {}).stars || 0 })), st.l, l => { st.l = l; best.upd(); }), best.el]));
      return () => best.upd();
    },
    nextOf(S) { return +S.l < G.MEMORY.length ? { l: +S.l + 1, d: 'normal' } : null; },
    create(S) {
      const L = G.MEMORY.find(x => x.id === +S.l) || G.MEMORY[0], N = G.MEM_ROUNDS, tol = S.D.cents, spb = 60 / 84;
      const wrap = h('div', { class: 'gm-mode', style: 'position:absolute;inset:0;display:grid;align-content:center;justify-items:center;gap:20px;padding:16px;text-align:center' });
      const label = h('div', { class: 'gm-k' }), ringT = h('b', { style: 'font-size:19px;max-width:124px;line-height:1.2' });
      const ring = h('div', { style: 'width:136px;height:136px;border-radius:68px;display:grid;place-items:center;border:2px solid var(--gm-line2);background:radial-gradient(circle,rgba(197,138,82,.24),rgba(197,138,82,0) 70%);transition:transform 90ms linear' }, [ringT]);
      const pads = h('div', { style: 'display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:520px' }), cmp = h('div', { class: 'gm-rrows', style: 'min-width:min(100%,340px)' });
      const bAgain = h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.mm.again' }), bHint = h('button', { class: 'btn small', type: 'button', 'data-t': 'gm.mm.hint' }), bSkip = h('button', { class: 'btn small quiet', type: 'button', 'data-t': 'gm.mm.skip' });
      wrap.append(label, ring, pads, cmp, h('div', { class: 'gm-acts', style: 'justify-content:center' }, [bAgain, bHint, bSkip]));
      // a note counts 1 on the first try, ½ after a mistake, ¼ after a hint, 0 when skipped
      let ri = -1, mel = [], idx = 0, phase = 'idle', srcs = [], playedT = [], noteW = [], hinted = false, mistakes = 0, replays = 0, clean6 = false, rhy = [], firstTry = 0, total = 0, weighted = 0, lv = 0, gen = 0;
      const setPad = (k, v) => { const p = pads.children[k]; if (!p) return; p.dataset.st = v || ''; p.style.background = v === 'on' ? 'linear-gradient(180deg,#F1B674,#C58A52)' : v === 'ok' ? 'rgba(85,214,151,.85)' : v === 'bad' ? 'rgba(237,100,100,.82)' : '#201A15'; p.style.color = v ? '#1A0F07' : 'var(--gm-tx2)'; p.style.transform = v === 'on' ? 'scale(1.14)' : ''; };
      function drawPads() { pads.innerHTML = ''; mel.forEach((n, k) => pads.append(h('span', { style: 'width:42px;height:42px;border-radius:21px;display:grid;place-items:center;font-weight:800;background:#201A15;border:1px solid var(--gm-line);color:var(--gm-tx2);transition:background-color .15s,transform .18s var(--spring)', text: String(k + 1) }))); }
      function stopSound() { srcs.forEach(s => { try { if (s) s.stop(); } catch (_) {} }); srcs = []; }
      function listen(again) {
        stopSound(); phase = 'listen'; const g0 = ++gen; if (again) replays++;
        label.textContent = t('gm.mm.round', { a: ri + 1, b: N }); ringT.textContent = t('gm.mm.listen'); cmp.innerHTML = '';
        PD.audio.ensure(); const now = PD.audio.now(); let at = now + .35;
        mel.forEach((n, k) => {
          const dur = n.d * spb; srcs.push(PD.audio.note(n.s, n.f, { when: at, vel: .78, dur: Math.min(1.6, dur + .25) }));
          S.after((at - now + GA.lag()) * 1000, () => { if (gen !== g0) return; for (let j = 0; j < mel.length; j++) if (pads.children[j] && pads.children[j].dataset.st === 'on') setPad(j, j < idx ? 'ok' : ''); setPad(k, 'on'); });
          at += dur + n.rest * spb;
        });
        S.after((at - now + GA.lag()) * 1000 + 200, () => { if (gen !== g0) return; for (let j = 0; j < mel.length; j++) setPad(j, j < idx ? 'ok' : ''); phase = 'play'; ringT.textContent = t('gm.mm.your'); });
      }
      function next() {
        ri++; if (ri >= N) { phase = 'done'; S.finish(); return; }
        mel = G.melody(L.id, ri, S.opts.seed != null ? (S.opts.seed >>> 0) + ri : undefined); idx = 0; playedT = []; hinted = false; mistakes = 0; noteW = mel.map(() => 1);
        total += mel.length; drawPads(); listen(false);
      }
      function roundDone() {
        phase = 'between'; weighted += noteW.reduce((a, b) => a + b, 0);
        const clean = !mistakes && !hinted && noteW.every(x => x === 1); if (clean && mel.length >= 6) clean6 = true;
        let rr = null;
        if (L.rhythm && playedT.length === mel.length && mel.length >= 3) { rr = G.rhythmMatch(mel.slice(0, -1).map(n => n.d + n.rest), playedT.slice(1).map((x, k) => x - playedT[k])); if (rr != null) rhy.push(rr); }
        ringT.textContent = t(clean ? 'gm.mm.clean' : 'gm.mm.ok');
        cmp.innerHTML = ''; cmp.append(h('div', {}, [h('span', { text: t('gm.mm.target') }), h('b', { text: mel.map(n => TH.name(n.midi)).join(' ') })]));
        if (rr != null) cmp.append(h('div', {}, [h('span', { text: t('gm.mm.rhythm', { p: Math.round(rr * 100) + '%' }) }), h('b')]));
        if (PD.fx) PD.fx.feedback('success');
        S.after(1500, next);
      }
      bAgain.onclick = () => { if (phase === 'play' || phase === 'listen') listen(true); };
      bHint.onclick = () => { if (phase !== 'play' || idx >= mel.length) return; hinted = true; noteW[idx] = Math.min(noteW[idx], .25); const n = mel[idx]; S.hud.say(t('gm.mm.hintN', { n: noteName(n.midi), p: posText(n) }), 'cu', 4000); };
      bSkip.onclick = () => { if (phase !== 'play' && phase !== 'listen') return; stopSound(); gen++; for (let k = idx; k < mel.length; k++) { noteW[k] = 0; S.sc.miss(false); } idx = mel.length; roundDone(); };
      return {
        seed: null, total: 0,
        mount() { S.field.append(wrap); PD.i18n.apply(wrap); },
        start() { next(); },
        pause() { stopSound(); gen++; },
        resume() { if (phase === 'listen' || phase === 'idle') listen(false); else if (phase === 'between') next(); },
        frame() { lv = Math.max(lv * .8, S.level || 0); ring.style.transform = phase === 'play' ? 'scale(' + (1 + Math.min(.18, lv * 3)).toFixed(3) + ')' : ''; S.hud.progress((Math.max(0, ri) + idx / Math.max(1, mel.length)) / N); },
        onNote(ev) {
          if (phase !== 'play' || idx >= mel.length) return;
          const n = mel[idx], p = G.judgePitch(n.midi, ev, tol);
          if (p.ok) {
            playedT.push(ev.t); setPad(idx, 'ok');
            if (noteW[idx] === 1) { firstTry++; S.sc.hit('perfect'); } else S.sc.hit('good');
            idx++; S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
            if (idx >= mel.length) roundDone();
            return;
          }
          if (p.kind === 'unsure') { S.say('h.unsure', null, '', 1600); return; }
          mistakes++; noteW[idx] = Math.min(noteW[idx], .5); S.sc.miss(true); S.hud.combo(0);
          const k = idx; setPad(k, 'bad'); S.after(600, () => { if (pads.children[k] && pads.children[k].dataset.st === 'bad') setPad(k, ''); });
          S.hud.say(t('gm.mm.wrong', { p: TH.name(ev.midi), i: idx + 1 }), 'bad', 1800);
        },
        result() {
          const acc = total ? weighted / total : 0, r = rhy.length ? rhy.reduce((a, b) => a + b, 0) / rhy.length : null;
          const rows = [[t('gm.mm.first'), firstTry + ' / ' + total], [t('gm.mistakes'), String(S.sc.s.wrong)], [t('gm.mm.replays'), String(replays)]];
          if (r != null) rows.push([t('gm.mm.rhythm', { p: Math.round(r * 100) + '%' }), '']);
          return { total, acc, stars: acc >= .9 ? 3 : acc >= .75 ? 2 : acc >= .5 ? 1 : 0, grid: false, lowHeard: false, hits: S.sc.s.perfect + S.sc.s.good, rows, save: { clean6, firstTry } };
        },
        dbg() { return { exp: mel[idx] ? TH.name(mel[idx].midi) : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS' }; },
        destroy() { stopSound(); gen++; wrap.remove(); }
      };
    }
  };

  /* =================================================================
     FRET HUNTER — a note's name; the learner finds it on the neck
     ================================================================= */
  PD.i18n.add({ 'gm.fh.scale': ['ლა მაჟორის ბგერები', 'Notes of A major'], 'gm.fh.chrom': ['ყველა ბგერა', 'Every note'] });
  /** the shared fingerboard view (neck.js), as in the note trainer */
  function neckIn(parent) {
    const nv = h('div', { class: 'neckview', style: 'width:100%;max-width:980px;margin:0 auto' }), cv = h('canvas');
    nv.append(cv); parent.append(nv);
    const view = PD.Neck(cv, {}); view.mirror = !!PD.store.get('lefty', false);
    const ro = new ResizeObserver(() => { const nh = view.natH(nv.clientWidth) + 'px'; if (nv.style.height !== nh) nv.style.height = nh; view.layout(); });
    ro.observe(nv); requestAnimationFrame(() => view.layout());
    return { view, el: nv, destroy() { ro.disconnect(); view.destroy(); nv.remove(); } };
  }
  const hunt = {
    page(c) {
      const { st, w } = c; st.l = +st.l || 1; if (!['learn', 'challenge', 'expert'].includes(st.d)) st.d = 'learn';
      w.append(sec(t('gm.how'), [bullets(['gm.fh.h1', 'gm.fh.h2'])]), sec(t('gm.listens'), [bullets(['gm.n.pitch', 'gm.n.unsure'])]));
      const best = bestLine(c, () => c.P.open('hunt', st.l)), sub = h('p', { class: 'gm-note', text: t('gm.dd.' + st.d) });
      w.append(sec(t('gm.diff'), [seg(['learn', 'challenge', 'expert'].map(d => ({ id: d, label: t('gm.d.' + d) })), st.d, d => { st.d = d; sub.textContent = t('gm.dd.' + d); best.upd(); }, t('gm.diff')), sub]),
        sec(t('gm.levels'), [levels(G.HUNT.map(L => ({ id: L.id, n: t('gm.lvl', { n: L.id }), name: t('gm.fh.l', { a: L.frets[0], b: L.frets[1] }), desc: t(L.scale ? 'gm.fh.scale' : 'gm.fh.chrom') + ' · ' + L.n, open: c.P.open('hunt', L.id), stars: c.P.starsOf('hunt', L.id) })), st.l, l => { st.l = l; best.upd(); }), best.el]));
      return () => best.upd();
    },
    nextOf(S) { return +S.l < G.HUNT.length ? { l: +S.l + 1, d: S.d } : null; },
    create(S) {
      const L = G.HUNT.find(x => x.id === +S.l) || G.HUNT[0], MODE = G.HUNT_MODE[S.d] || G.HUNT_MODE.learn, T = G.huntTargets(L.id, S.opts.seed != null ? S.opts.seed >>> 0 : undefined), tol = 40;
      const wrap = h('div', { class: 'gm-mode', style: 'position:absolute;inset:0;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:10px;padding:8px 0 4px' });
      const kick = h('div', { class: 'gm-k' }), big = h('div', { style: 'font:800 clamp(54px,14vw,96px)/1 var(--f-display);letter-spacing:-.02em;color:var(--gm-tx);text-shadow:0 0 40px rgba(241,182,116,.35)' }), sm = h('div', { style: 'color:var(--gm-tx2);font-size:var(--t-headline)' });
      const bar = h('div', { class: 'gm-xpbar', style: 'width:min(70%,320px);margin:6px auto 0', hidden: !MODE.limit }, [h('i', { style: 'transition:none;width:100%' })]), hintL = h('small', { style: 'color:var(--gm-tx2);min-height:18px' });
      const card = h('div', { style: 'display:grid;align-content:center;justify-items:center;gap:6px;text-align:center;padding:0 16px' }, [kick, big, sm, bar, hintL]);
      wrap.append(card);
      let nk = null, i = -1, target = null, pos = [], t0 = 0, el0 = 0, running = false, wrongN = 0, found = 0, firstTry = 0, mistakes = 0, times = [], busy = false, hinted = false;
      const elapsed = () => el0 + (running ? (performance.now() - t0) / 1000 : 0);
      const showPos = () => nk.view.setTarget(pos.map(p => ({ s: p.s, f: p.f, fi: 0 })), []);
      function next() {
        i++; if (i >= T.length) { S.finish(); return; }
        target = T[i]; pos = TH.positions(target.midi); wrongN = 0; busy = false; hinted = false; el0 = 0; t0 = performance.now(); running = true;
        kick.textContent = t('gm.fh.find') + ' · ' + t('gm.fh.n', { a: i + 1, b: T.length });
        big.textContent = TH.name(target.midi); sm.textContent = PD.i18n.lang === 'ka' ? TH.nameKa(target.midi) : TH.pcName(target.midi);
        nk.view.setTarget([], []); if (MODE.hint === 0) { showPos(); hinted = true; }
        S.hud.say('');
      }
      function solved(dt) {
        running = false; busy = true; found++; times.push(dt); if (!wrongN) firstTry++;
        const g = wrongN ? 'good' : dt <= 3 ? 'perfect' : 'great';
        S.sc.hit(g, null, null, Math.round(60 * Math.max(0, 1 - dt / 8))); S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
        showPos(); nk.view.confirm(); S.pop(g, t('gm.fh.ok', { s: fmtS(dt) }), null, 70);
        S.hud.say(pos.map(posText).join(' · '), 'ok', 1400);
        S.after(1000, next);
      }
      return {
        seed: null, total: T.length,
        mount() { S.field.append(wrap); nk = neckIn(wrap); },
        start() { next(); },
        pause() { if (running) { el0 = elapsed(); running = false; } },
        resume() { if (target && !busy) { t0 = performance.now(); running = true; } },
        frame() {
          if (nk) nk.view.draw();
          if (!target || busy) return;
          const el = elapsed();
          if (MODE.hint > 0 && !hinted) { const left = Math.ceil(MODE.hint - el); hintL.textContent = left > 0 ? t('gm.fh.hintIn', { s: left }) : ''; if (left <= 0) { hinted = true; showPos(); } }
          else if (MODE.hint !== -1) hintL.textContent = '';
          if (MODE.limit) {
            bar.firstChild.style.width = (Math.max(0, 1 - el / MODE.limit) * 100).toFixed(1) + '%';
            if (el >= MODE.limit) { running = false; busy = true; S.sc.miss(false); S.hud.combo(0); showPos(); nk.view.wrong(); S.hud.say(t('gm.fh.time', { p: pos.map(posText).join(' · ') }), 'bad', 2000); S.after(1800, next); }
          }
          S.hud.progress((i + (busy ? 1 : 0)) / T.length);
        },
        onNote(ev) {
          if (!target || busy || S.state !== 'playing') return;
          const p = G.judgePitch(target.midi, ev, tol);
          if (p.ok) { solved(elapsed()); return; }
          if (p.kind === 'unsure') { S.say('h.unsure', null, '', 1400); return; }
          wrongN++; mistakes++; nk.view.wrong(); if (MODE.limit || MODE.hint > 0) { S.sc.miss(true); S.hud.combo(0); }
          if (p.kind === 'octave') S.hud.say(t('gm.fh.octave', { d: t(p.dir > 0 ? 'gm.fh.lower' : 'gm.fh.higher') }), 'cu', 2200);
          else S.hud.say(t('gm.fh.heard', { p: TH.name(ev.midi) }), 'bad', 1600);
        },
        result() {
          const acc = T.length ? (firstTry + .5 * (found - firstTry)) / T.length : 0, avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : null;
          return { total: T.length, acc, stars: acc >= .9 ? 3 : acc >= .75 ? 2 : acc >= .5 ? 1 : 0, grid: false, lowHeard: false, hits: found,
            rows: [[t('gm.fh.found'), found + ' / ' + T.length], [t('gm.fh.avg'), avg == null ? '—' : t('gm.fh.sec', { s: fmtS(avg) })], [t('gm.mistakes'), String(mistakes)]], save: { avgFind: avg, found } };
        },
        dbg() { return { exp: target ? TH.name(target.midi) : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS' }; },
        destroy() { if (nk) nk.destroy(); wrap.remove(); }
      };
    }
  };

  /* =================================================================
     CHORD MASTER — the computed shapes, fingers by the teacher's rule
     ================================================================= */
  const chord = {
    page(c) {
      const { st, w } = c; st.l = +st.l || 1; if (!['notes', 'strum'].includes(st.d)) st.d = 'notes';
      w.append(sec(t('gm.how'), [h('span', { class: 'tp-src teacher', style: 'justify-self:start', text: PD.ui.srcLabel('tp.src.teacher') + ' · ' + t('gm.cm.fingersT') }), bullets(['gm.cm.h1', 'gm.cm.h2'])]), sec(t('gm.listens'), [bullets(['gm.n.pitch', 'gm.n.unsure'])]));
      const best = bestLine(c, () => c.P.open('chord', st.l)), sub = h('p', { class: 'gm-note' }), drawSub = () => { sub.textContent = t('gm.dd.' + st.d) + (st.d === 'strum' ? ' · ' + t('gm.n.strumBeta') : ''); };
      w.append(sec(t('gm.diff'), [seg([{ id: 'notes', label: t('gm.d.notes') }, { id: 'strum', label: t('gm.d.strum') + ' · ' + t('gm.beta') }], st.d, d => { st.d = d; drawSub(); best.upd(); }, t('gm.diff')), sub]),
        sec(t('gm.levels'), [levels(G.CHORD_SETS.map(L => ({ id: L.id, n: t('gm.lvl', { n: L.id }), name: L.names.join(' · '), open: c.P.open('chord', L.id), stars: c.P.starsOf('chord', L.id) })), st.l, l => { st.l = l; best.upd(); }), best.el]));
      drawSub();
      return () => best.upd();
    },
    nextOf(S) { return +S.l < G.CHORD_SETS.length ? { l: +S.l + 1, d: S.d } : null; },
    create(S) {
      const set = G.chordSet(+S.l), strum = S.d === 'strum', tol = S.D.cents;
      const wrap = h('div', { class: 'gm-mode', style: 'position:absolute;inset:0;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:8px;padding:6px 0 4px' });
      const kick = h('div', { class: 'gm-k' }), name = h('div', { style: 'font:800 clamp(46px,12vw,84px)/1 var(--f-display);color:var(--gm-tx);text-shadow:0 0 40px rgba(241,182,116,.35)' }), long = h('div', { style: 'color:var(--gm-tx2)' });
      const rows = h('div', { style: 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:min(100%,460px)' }), skip = h('button', { class: 'btn small quiet', type: 'button', 'data-t': 'gm.cm.skip' });
      wrap.append(h('div', { style: 'display:grid;align-content:center;justify-items:center;gap:8px;text-align:center;padding:0 16px' }, [kick, name, long, rows, skip]));
      let nk = null, ci = -1, cur = null, step = 0, wrongStep = 0, busy = false, firstNotes = 0, notesOk = 0, mistakes = 0, chordMist = 0, attempts = 0, okList = [], strumW = 0;
      function drawRows() {
        rows.innerHTML = '';
        cur.midis.forEach((m, k) => {
          const done = !strum && k < step, now = !strum && k === step && !busy;
          rows.append(h('div', { style: 'padding:8px 6px;border-radius:12px;border:1px solid ' + (now ? 'var(--gm-cu)' : 'rgba(255,255,255,.07)') + ';background:' + (done ? 'rgba(85,214,151,.16)' : now ? 'rgba(197,138,82,.14)' : 'rgba(255,255,255,.03)') },
            [h('small', { style: 'display:block;color:var(--gm-tx2)', text: TH.stringName(k + 1) + ' · ' + (cur.frets[k] ? cur.frets[k] : '0') }), h('b', { style: 'font-size:18px', text: (done ? '✓ ' : '') + TH.name(m) })]));
        });
      }
      function next() {
        ci++; if (ci >= set.length) { S.finish(); return; }
        cur = set[ci]; step = 0; wrongStep = 0; chordMist = 0; busy = false; attempts = 0;
        kick.textContent = t('gm.cm.chordN', { a: ci + 1, b: set.length }); name.textContent = cur.name;
        const lib = TH.chordLibrary().find(x => x.name === cur.name); long.textContent = lib ? TH.chordLong(lib) : '';
        nk.view.setTarget(cur.frets.map((f, k) => ({ s: k + 1, f, fi: f > 0 ? cur.fingers[k] : 0 })), []);
        if (strum) { PD.detector.expect(cur.midis.map(m => TH.freq(m))); S.say('gm.cm.strumNow', null, 'cu', 0); } else S.hud.say('');
        drawRows();
      }
      function chordOk(g) {
        busy = true; okList.push(cur.name); nk.view.confirm(); S.sc.hit(g); S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
        S.pop(g, t('gm.cm.ok'), null, 60); drawRows(); S.after(1100, next);
      }
      skip.onclick = () => { if (busy || !cur) return; busy = true; S.sc.miss(false); S.hud.combo(0); S.after(200, next); };
      return {
        seed: null, total: set.length,
        mount() { S.field.append(wrap); nk = neckIn(wrap); PD.i18n.apply(wrap); },
        start() { next(); },
        frame() { if (nk) nk.view.draw(); S.hud.progress((ci + (busy ? 1 : strum ? 0 : step / 3)) / set.length); },
        onNote(ev) {
          if (strum || busy || !cur || S.state !== 'playing') return;
          const p = G.judgePitch(cur.midis[step], ev, tol);
          if (p.ok) { notesOk++; if (!wrongStep) firstNotes++; nk.view.pluck(step + 1, cur.frets[step]); step++; wrongStep = 0; if (step >= 3) chordOk(chordMist ? 'great' : 'perfect'); else { drawRows(); S.hud.say(''); } return; }
          if (p.kind === 'unsure') { S.say('h.unsure', null, '', 1400); return; }
          wrongStep++; mistakes++; chordMist++; nk.view.wrong(); S.hud.say(t('gm.fh.heard', { p: TH.name(ev.midi) }) + ' · ' + TH.stringName(step + 1) + ': ' + TH.name(cur.midis[step]), 'bad', 1800);
        },
        onChord(ev) {
          if (!strum || busy || !cur || S.state !== 'playing') return;
          const want = cur.midis.map(m => Math.round(TH.freq(m))).join(','), got = (ev.exp || []).map(Math.round).join(',');
          if (ev.exp && want !== got) return;   // measured against another chord's notes
          const pr = ev.present || [], n = pr.filter(Boolean).length; attempts++;
          if (n >= 3) { strumW += attempts === 1 ? 1 : attempts === 2 ? .75 : .5; chordOk(attempts === 1 ? 'perfect' : attempts === 2 ? 'great' : 'good'); return; }
          const miss = pr.map((x, k) => x ? null : TH.stringName(k + 1)).filter(Boolean).join(', ');
          S.hud.say(t('gm.cm.heardN', { k: n }) + (miss ? ' · ' + t('gm.cm.missing', { s: miss }) : ''), 'cu', 2200);
          if (attempts >= 4) { busy = true; S.sc.miss(false); S.hud.combo(0); S.after(900, next); }
        },
        result() {
          const acc = strum ? (set.length ? strumW / set.length : 0) : (set.length ? (firstNotes + .5 * (notesOk - firstNotes)) / (3 * set.length) : 0);
          const rows = [[t('gm.cm.done'), okList.length + ' / ' + set.length]];
          if (!strum) rows.push([t('gm.cm.firstNotes'), firstNotes + ' / ' + 3 * set.length], [t('gm.mistakes'), String(mistakes)]);
          return { total: set.length, acc, stars: acc >= .9 ? 3 : acc >= .75 ? 2 : acc >= .5 ? 1 : 0, grid: false, lowHeard: false, hits: strum ? okList.length * 3 : notesOk, rows, save: { chordsOk: okList.slice() } };
        },
        dbg() { return { exp: cur ? (strum ? cur.name : TH.name(cur.midis[step] || 0)) : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS' }; },
        destroy() { PD.detector.expect(null); if (nk) nk.destroy(); wrap.remove(); }
      };
    }
  };

  /* =================================================================
     timeline helpers for the tab (Song Quest) and the band (Band Jam)
     ================================================================= */
  /** a lesson's events between beats [from, to) as steps: one note, or one stroke of a chord */
  function stepsOf(l, from, to) {
    const by = new Map();
    l.events.forEach(e => { if (e.t < from - 1e-6 || e.t >= to - 1e-6) return; const k = Math.round(e.t * 1000); if (!by.has(k)) by.set(k, []); by.get(k).push(e); });
    return [...by.keys()].sort((a, b) => a - b).map(k => {
      const es = by.get(k), e0 = es[0], strum = es.length > 1 || es.some(e => e.chordId || e.technique === 'strum');
      return strum ? { kind: 'strum', b: e0.t, d: e0.d, notes: es.map(e => ({ s: e.s, f: e.f, midi: TH.midi(e.s, e.f) })), dir: e0.st === 'up' ? 'up' : 'down', acc: !!e0.acc, name: e0.chord || '' }
        : { kind: 'note', b: e0.t, d: e0.d, s: e0.s, f: e0.f, midi: TH.midi(e0.s, e0.f) };
    });
  }
  const songs = () => PD.lessons.all.filter(l => l.events && l.events.length && !l.song && !l.beatMap && !l.stems && l.id !== 'bani-acharuli');
  const srcOf = l => l.ai ? 'ai' : l.user ? 'mine' : /teacher/.test(l.source || '') ? 'teacher' : l.demo ? 'demo' : '';
  const TEMPO = { easy: .7, normal: .85, hard: 1 };

  /* =================================================================
     SONG QUEST — the app's own material on a scrolling tab
     ================================================================= */
  const song = {
    page(c) {
      const { st, w } = c, list = songs().sort((a, b) => (srcOf(a) === 'teacher' ? 0 : 1) - (srcOf(b) === 'teacher' ? 0 : 1) || (a.level || 1) - (b.level || 1));
      if (!list.length) { w.append(sec('', [h('p', { class: 'gm-note', 'data-t': 'gm.sq.none' })])); c.btn.disabled = true; return () => { c.btn.disabled = true; }; }
      if (!list.some(l => l.id === st.l)) st.l = list[0].id; if (!TEMPO[st.d]) st.d = 'normal';
      st.opts.sec = st.opts.sec == null ? -1 : st.opts.sec;
      w.append(sec(t('gm.how'), [bullets(['gm.sq.h1', 'gm.sq.h2'])]), sec(t('gm.listens'), [bullets(['gm.n.pitch', 'gm.n.unsure'])]));
      const best = bestLine(c), box = h('div', { class: 'gm-songs', role: 'list' }), secSel = h('select', { class: 'input', 'aria-label': t('gm.sq.section') }), loop = h('input', { type: 'checkbox', 'aria-label': t('gm.sq.loop') });
      const badge = k => k === 'teacher' ? h('span', { class: 'tp-src teacher', text: PD.ui.srcLabel('tp.src.teacher') }) : k === 'demo' ? h('span', { class: 'gm-tag', text: t('demo.badge') }) : k === 'mine' ? h('span', { class: 'gm-tag', text: t('gm.sq.mine') }) : k === 'ai' ? h('span', { class: 'gm-tag beta', text: t('gm.sq.ai') }) : null;
      list.forEach(l => {
        const steps = stepsOf(l, 0, 1e9), nN = steps.filter(x => x.kind === 'note').length, nS = steps.length - nN, r = c.P.rec('song', l.id, st.d);
        const b = h('button', { type: 'button', role: 'listitem', class: 'gm-song', 'aria-pressed': String(l.id === st.l) }, [h('span', {}, [h('b', { text: PD.i18n.pick(l.title) }), h('small', { text: [nN ? t('gm.sq.notes', { n: nN }) : '', nS ? t('gm.sq.strokes', { n: nS }) : '', l.bpm + ' BPM'].filter(Boolean).join(' · ') })]),
          h('span', { style: 'display:grid;gap:4px;justify-items:end' }, [badge(srcOf(l)), h('span', { style: 'display:flex;gap:1px', html: starsHTML(r ? r.stars : 0) })])]);
        b.onclick = () => { st.l = l.id; st.opts.sec = -1; box.querySelectorAll('.gm-song').forEach(x => x.setAttribute('aria-pressed', String(x === b))); fillSec(); best.upd(); };
        box.append(b);
      });
      const fillSec = () => { const l = PD.lessons.get(st.l); secSel.innerHTML = ''; secSel.append(h('option', { value: '-1', text: t('gm.sq.whole') })); (l.sections || []).forEach((s, i) => secSel.append(h('option', { value: String(i), text: PD.i18n.pick(s.name) || t('gm.sq.section') + ' ' + (i + 1) }))); secSel.value = String(st.opts.sec); loop.disabled = st.opts.sec < 0; };
      secSel.onchange = () => { st.opts.sec = +secSel.value; loop.disabled = st.opts.sec < 0; if (loop.disabled) { loop.checked = false; st.opts.loop = false; } };
      loop.onchange = () => { st.opts.loop = loop.checked; };
      const listen = h('button', { class: 'btn small', type: 'button', html: PD.ic.play + '<span>' + PD.esc(t('gm.sq.listen')) + '</span>', onclick: () => { st.opts.listen = true; c.start(); st.opts.listen = false; } });
      w.append(sec(t('gm.sq.pick'), [box]), sec(t('gm.sq.tempo'), [seg(['easy', 'normal', 'hard'].map(d => ({ id: d, label: Math.round(TEMPO[d] * 100) + '%' })), st.d, d => { st.d = d; best.upd(); }, t('gm.sq.tempo')),
        h('div', { class: 'gm-field2' }, [h('label', { 'data-t': 'gm.sq.section' }), secSel]), h('label', { class: 'gm-li', style: 'cursor:pointer' }, [h('span', { 'data-t': 'gm.sq.loop' }), loop]),
        h('div', { class: 'gm-acts' }, [listen]), h('p', { class: 'gm-note', 'data-t': 'gm.sq.listenD' }), best.el]));
      fillSec();
      return () => best.upd();
    },
    create(S) {
      const l = PD.lessons.get(S.l) || songs()[0], listen = !!S.opts.listen, tf = TEMPO[S.d] || .85, bpm = l.bpm * tf, spb = 60 / bpm, D = S.D;
      const sc0 = (l.sections || [])[S.opts.sec], from = sc0 ? sc0.from : 0, to = sc0 ? sc0.to : Math.max(...l.events.map(e => e.t + e.d)) + .001;
      const passes = sc0 && S.opts.loop ? 3 : 1, len = to - from, bpb = (l.meter && l.meter[0]) || 4, ci = bpb;   // a bar of count-in
      const base = stepsOf(l, from, to), steps = [];
      for (let p = 0; p < passes; p++) base.forEach(x => steps.push(Object.assign({}, x, { p, t: (ci + p * len + (x.b - from)) * spb })));
      const notes = steps.filter(x => x.kind === 'note'), strums = steps.filter(x => x.kind === 'strum');
      const MN = G.noteMatcher(notes, D, S.sc), MR = G.rhythmMatcher(strums, D, S.sc), res = new Map(), chk = new Map();
      const endT = (ci + passes * len) * spb + .5, metro = PD.store.get('gm.metro', true) !== false || listen, fx = sparks(S.fx);
      const beats = []; for (let k = 0; k < ci + passes * len; k++) beats.push({ t: k * spb, acc: k % bpb === 0 });
      let g = null, geo = {}, bg = null, bi = 0, pi = 0, first = 0, lastT = performance.now(), expKey = '';
      if (listen) S.hud.sub(PD.i18n.pick(l.title) + ' · ' + t('gm.sq.listen'));
      function layout(g0) {
        const W = g0.W, H = g0.H, gap = clamp(H * .14, 34, 70), top = Math.round(H * .5 - gap), px = Math.round(W * .24);
        geo = { W, H, top, gap, px, pps: (W - px) / 3.2, y: s => top + (3 - s) * gap, box: clamp(gap * .62, 24, 40) };
        bg = layer(g0, c => {
          [3, 2, 1].forEach(s => { c.strokeStyle = 'rgba(233,220,192,' + (s === 1 ? .42 : .3) + ')'; c.lineWidth = s === 1 ? 2 : 1.4; c.beginPath(); c.moveTo(0, geo.y(s) + .5); c.lineTo(W, geo.y(s) + .5); c.stroke(); c.fillStyle = TH.color(s); c.font = '700 12px ' + FONT; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(TH.stringName(s), 8, geo.y(s) - 10); });
          const cg = c.createLinearGradient(px - 24, 0, px + 24, 0); cg.addColorStop(0, 'rgba(241,182,116,0)'); cg.addColorStop(.5, 'rgba(241,182,116,.15)'); cg.addColorStop(1, 'rgba(241,182,116,0)');
          c.fillStyle = cg; c.fillRect(px - 24, top - gap * 1.2, 48, gap * 4.4); c.fillStyle = 'rgba(241,182,116,.9)'; c.fillRect(px - 1.5, top - gap, 3, gap * 4);
        });
      }
      function draw(st) {
        if (!g || !bg) return;
        const c = g.ctx, { W, H, px, pps, gap, box, top } = geo, now = performance.now(), dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
        c.clearRect(0, 0, W, H); c.drawImage(bg, 0, 0, W, H);
        // bar lines
        for (let k = Math.max(0, Math.floor((st - 1) / spb)); ; k++) { const x = px + (k * spb - st) * pps; if (x > W) break; if (k % bpb === 0 && x > 0) { c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, top - gap * .9); c.lineTo(x, top + gap * 2.9); c.stroke(); } }
        if (st < ci * spb && st > -.2) { c.fillStyle = 'rgba(248,245,241,.8)'; c.font = '800 ' + Math.round(gap * 1.1) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(clamp(Math.floor(st / spb) + 1, 1, ci)), px, top - gap * 1.6); }
        while (first < steps.length && steps[first].t < st - 2.2) first++;
        for (let i = first; i < steps.length; i++) {
          const x0 = steps[i], x = px + (x0.t - st) * pps; if (x > W + box) break;
          const r = res.get(x0), col = r === 'miss' ? 'rgba(237,100,100,.45)' : r ? COL[r] : null, a = x < px - 4 ? clamp(1 - (px - x) / (W * .3), .15, 1) : 1;
          c.globalAlpha = a;
          const cell = (s, f) => { const y = geo.y(s); c.fillStyle = col ? 'rgba(20,16,13,.9)' : '#201A15'; rrect(c, x - box / 2, y - box / 2, box, box, 9); c.fill(); c.strokeStyle = col || 'rgba(241,182,116,.75)'; c.lineWidth = col ? 2 : 1.4; rrect(c, x - box / 2, y - box / 2, box, box, 9); c.stroke(); c.fillStyle = col || '#F1B674'; c.font = '800 ' + Math.round(box * .5) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(f), x, y + 1); };
          if (x0.kind === 'note') cell(x0.s, x0.f);
          else {
            x0.notes.forEach(n => cell(n.s, n.f));
            arrow(c, x, top - gap * .95, x0.dir === 'down', box * .7, col || (x0.acc ? COL.err : '#D9A06B'), x0.acc ? 5 : 3);
            if (x0.name && (i === 0 || steps[i - 1].name !== x0.name || steps[i - 1].kind !== 'strum')) { c.fillStyle = COL.tx; c.font = '700 13px ' + FONT; c.textAlign = 'center'; c.fillText(x0.name, x, top - gap * 1.55); }
            const k = chk.get(x0); if (k != null) { c.fillStyle = k >= x0.notes.length ? COL.ok : COL.cu2; c.font = '700 11px ' + FONT; c.fillText(k >= x0.notes.length ? '✓' : k + '/' + x0.notes.length, x, top + gap * 2.75); }
          }
          c.globalAlpha = 1;
        }
        fx.draw(c, dt);
      }
      function mark(x0, grade) { res.set(x0, grade); if (grade !== 'miss') { const y = x0.kind === 'note' ? geo.y(x0.s) : geo.y(2); fx.burst(geo.px, y, grade === 'perfect' ? 12 : 7, COL[grade]); } }
      return {
        seed: null, total: listen ? 0 : steps.length, countIn: true, practice: listen,
        mount() { g = canvasIn(S, layout); },
        schedule(hz) {
          if (metro) while (bi < beats.length) { const a = S.clock.audio(beats[bi].t); if (!(a < hz)) break; if (a > S.now() - .005) GA.click(a, beats[bi].acc); bi++; }
          if (listen) while (pi < steps.length) { const x0 = steps[pi], a = S.clock.audio(x0.t); if (!(a < hz)) break; if (a > S.now() - .005) { if (x0.kind === 'note') PD.audio.note(x0.s, x0.f, { when: a, vel: .75, dur: Math.max(.25, x0.d * spb) }); else { const fr = [null, null, null]; x0.notes.forEach(n => { fr[n.s - 1] = n.f; }); PD.audio.strum(fr, x0.dir, { when: a, vel: x0.acc ? .9 : .7 }); } } pi++; }
          else {   // the chord check listens for the notes of the stroke that comes next (beta)
            const nx = strums.find(x0 => !MR.st[strums.indexOf(x0)].res && x0.t > S.songNow() - .05);
            const key = nx && nx.t - S.songNow() < .4 ? nx.notes.map(n => n.midi).join(',') : '';
            if (key !== expKey) { expKey = key; PD.detector.expect(key ? nx.notes.map(n => TH.freq(n.midi)) : null); }
          }
        },
        pause() { const at = S.clock.at(S.now()); bi = beats.findIndex(b => b.t >= at - 1e-6); if (bi < 0) bi = beats.length; pi = steps.findIndex(x0 => x0.t >= at - 1e-6); if (pi < 0) pi = steps.length; },
        frame(st, state) {
          if (state === 'playing' && !listen) {
            MN.advance(st).forEach(r => { mark(notes[r.i], r.unsure ? 'unsure' : 'miss'); if (!r.unsure) { S.pop('miss', t('gm.j.miss'), geo.px, geo.y(notes[r.i].s) - 30); S.hud.combo(0); } });
            MR.advance(st).forEach(r => { mark(strums[r.i], 'miss'); S.pop('miss', t('gm.j.miss'), geo.px, geo.top - geo.gap * .4); S.hud.combo(0); });
          }
          S.hud.progress(st / endT); draw(st);
        },
        onOnset(ev) {
          if (listen) return; const tt = S.toSong(ev.t); if (tt == null) return;
          MN.onset(tt); if (!strums.length) return;
          const r = MR.input({ t: tt, strength: ev.strength }); if (r.extra || r.same) return;
          const x0 = strums[r.i]; mark(x0, r.grade || 'miss'); S.pop(r.grade || 'miss', t('gm.j.' + (r.grade || (r.kind === 'early' ? 'early' : 'late'))), geo.px, geo.top - geo.gap * .4); S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
        },
        onNote(ev) {
          if (listen || !notes.length) return; const tt = S.toSong(ev.t); if (tt == null) return;
          const r = MN.input({ t: tt, midi: ev.midi, conf: ev.conf, unsure: ev.unsure }); if (r.extra || r.unsure) return;
          const x0 = notes[r.i]; mark(x0, r.grade || 'miss'); S.pop(r.grade || 'miss', t('gm.j.' + (r.grade || 'miss')), geo.px, geo.y(x0.s) - 30); S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
          if (r.miss && r.kind && t('gm.k.' + r.kind) !== 'gm.k.' + r.kind) S.hud.say(t('gm.k.' + r.kind) + (r.heard != null ? ' · ' + TH.name(r.heard) : ''), 'bad', 1400);
        },
        onChord(ev) {
          if (listen) return; const tt = S.toSong(ev.t); if (tt == null) return;
          let best = null, bd = .2; strums.forEach(x0 => { const d = Math.abs(x0.t - tt); if (d < bd) { bd = d; best = x0; } });
          if (best && (!ev.exp || ev.exp.map(Math.round).join(',') === best.notes.map(n => Math.round(TH.freq(n.midi))).join(','))) chk.set(best, (ev.present || []).filter(Boolean).length);
        },
        done: st => st > endT,
        result() {
          if (listen) return { total: 0, grid: false, stars: 0, acc: null, lowHeard: false, rows: [] };
          const n = [...chk.values()], full = [...chk.entries()].filter(([x0, k]) => k >= x0.notes.length).length;
          return { total: steps.length, rows: n.length ? [[t('gm.sq.chordCk'), Math.round(full / n.length * 100) + '%']] : [] };
        },
        dbg() { return { exp: steps[first] ? (steps[first].kind === 'note' ? TH.name(steps[first].midi) : steps[first].name) : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS' }; },
        destroy() { PD.detector.expect(null); if (g) g.destroy(); }
      };
    }
  };

  /* =================================================================
     BAND JAM — Bani-Acharuli, along with its own recording
     ================================================================= */
  const MIX = ['music', 'full', 'vocals', 'off'], PCT = [60, 70, 80, 90, 100];
  const band = {
    page(c) {
      const { st, w } = c, S0 = PD.SONGS && PD.SONGS['bani-acharuli'], les = PD.lessons.get('bani-acharuli');
      st.l = 'bani-acharuli'; if (!['practice', 'perform'].includes(st.d)) st.d = 'perform';
      const o = st.opts; o.mix = MIX.includes(o.mix) ? o.mix : PD.store.get('gm.bj.mix', 'music'); o.tempo = PCT.includes(o.tempo) ? o.tempo : PD.store.get('gm.bj.tempo', 80); o.sec = o.sec == null ? 1 : o.sec; o.metro = o.metro == null ? false : o.metro;
      if (!S0 || !les) { w.append(sec('', [h('p', { class: 'gm-note', 'data-t': 'gm.sq.none' })])); c.btn.disabled = true; return () => {}; }
      w.append(sec(t('gm.how'), [h('span', { class: 'tp-src teacher', style: 'justify-self:start', text: PD.ui.srcLabel('tp.src.teacher') }), bullets(['gm.bj.h1', 'gm.bj.h2'])]),
        sec(t('gm.listens'), [bullets(['gm.n.headphones', 'gm.n.dir', 'gm.bj.noStems']), h('p', { class: 'gm-note' }, [h('span', { class: 'tp-src draft', text: PD.ui.srcLabel('tp.src.draft') }), ' ', h('span', { 'data-t': 'gm.bj.chordDraft' })])]));
      const best = bestLine(c), secSel = h('select', { class: 'input', 'aria-label': t('gm.sq.section') }), loop = h('input', { type: 'checkbox' }), metro = h('input', { type: 'checkbox' }), note = h('p', { class: 'gm-note' });
      secSel.append(h('option', { value: '-1', text: t('gm.sq.whole') })); (les.sections || []).forEach((s, i) => secSel.append(h('option', { value: String(i), text: PD.i18n.pick(s.name) + ' · ' + (s.to - s.from) })));
      secSel.value = String(o.sec); secSel.onchange = () => { o.sec = +secSel.value; loop.disabled = o.sec < 0; if (loop.disabled) loop.checked = o.loop = false; };
      loop.checked = !!o.loop; loop.disabled = o.sec < 0; loop.onchange = () => { o.loop = loop.checked; };
      metro.checked = !!o.metro; metro.onchange = () => { o.metro = metro.checked; };
      const vol = h('input', { type: 'range', class: 'gm-range', min: '0', max: '1', step: '0.05', value: String(PD.audio.vol.ref == null ? .8 : PD.audio.vol.ref), 'aria-label': t('gm.bj.vol'), oninput: e => PD.audio.setVol('ref', +e.target.value) });
      const drawN = () => { note.textContent = st.d === 'practice' ? t('gm.dd.practice') + ' · ' + t('gm.bj.practiceNote') : t('gm.dd.perform'); };
      w.append(sec(t('gm.diff'), [seg(['perform', 'practice'].map(d => ({ id: d, label: t('gm.d.' + d) })), st.d, d => { st.d = d; drawN(); best.upd(); }, t('gm.diff')), note]),
        sec(t('gm.bj.mix'), [seg(MIX.map(m => ({ id: m, label: t('gm.bj.' + m) })), o.mix, m => { o.mix = m; PD.store.set('gm.bj.mix', m); if (m === 'off') { metro.checked = o.metro = true; } }, t('gm.bj.mix')), h('div', { class: 'gm-field2' }, [h('label', { 'data-t': 'gm.bj.vol' }), vol])]),
        sec(t('gm.bj.tempo'), [seg(PCT.map(p => ({ id: p, label: p + '%' })), o.tempo, p => { o.tempo = p; PD.store.set('gm.bj.tempo', p); }, t('gm.bj.tempo')),
          h('div', { class: 'gm-field2' }, [h('label', { 'data-t': 'gm.sq.section' }), secSel]), h('label', { class: 'gm-li', style: 'cursor:pointer' }, [h('span', { 'data-t': 'gm.sq.loop' }), loop]), h('label', { class: 'gm-li', style: 'cursor:pointer' }, [h('span', { 'data-t': 'gm.bj.metro' }), metro]), best.el]));
      drawN();
      // decoding starts now, so the round can begin at once
      try { PD.audio.ref.preload(S0.stems, o.mix === 'off' ? 'music' : o.mix); } catch (_) {}
      return () => best.upd();
    },
    create(S) {
      const S0 = PD.SONGS['bani-acharuli'], les = PD.lessons.get('bani-acharuli'), ref = PD.audio.ref, o = S.opts;
      const R = PD.curriculum.rhythms().find(x => x.id === S0.rhythm) || PD.curriculum.rhythms()[0], B = S0.beats, rate = (o.tempo || 80) / 100;
      const scs = les.sections || [], sc0 = scs[o.sec], from = sc0 ? sc0.from : 0, to = sc0 ? Math.min(sc0.to, B.length - 1) : B.length - 1;
      const per = k => B[Math.min(k + 1, B.length - 1)] - B[Math.min(k, B.length - 2)];
      const x0 = Math.max(0, B[from] - 2 * per(from)), passes = sc0 && o.loop ? 3 : 1, passRec = B[to] - x0 + .4, passLen = passRec / rate;
      const chart = [];
      for (let p = 0; p < passes; p++) for (let k = from; k < to; k++) R.strokes.forEach((s, j) => chart.push({ t: p * passLen + (B[k] + j / R.strokes.length * per(k) - x0) / rate, acc: !!s.accent, dir: s.direction, k, j, chord: S0.cycle[k % S0.cycle.length] }));
      const D = S.D, M = G.rhythmMatcher(chart, D, S.sc), res = chart.map(() => null), tones = chart.map(() => null), practice = S.d === 'practice';
      const shapes = S0.chords, endT = passes * passLen, fx = sparks(S.fx);
      let g = null, geo = {}, bg = null, ci = 0, first = 0, lastT = performance.now(), expKey = '', live = o.mix !== 'off', toneOk = 0, toneN = 0;
      const xOf = tau => x0 + (tau - Math.floor(tau / passLen) * passLen) * rate;
      S.hud.sub(PD.i18n.pick(les.title) + ' · ' + (o.tempo || 80) + '%' + (sc0 ? ' · ' + PD.i18n.pick(sc0.name) : ''));
      function layout(g0) {
        const W = g0.W, H = g0.H, cx = Math.round(W * .26), cy = Math.round(H * .58), gap = (B[Math.min(to, B.length - 1)] - B[from]) / Math.max(1, to - from) / R.strokes.length / rate;
        const pps = (W - cx) / ((W < 600 ? 7 : 10) * gap), sz = clamp(Math.min(H * .1, pps * gap * .7), 22, 64);
        geo = { W, H, cx, cy, sz, pps, ry: Math.round(H * .3) };
        bg = layer(g0, c => {
          const band2 = c.createLinearGradient(0, cy - sz, 0, cy + sz); band2.addColorStop(0, 'rgba(255,255,255,0)'); band2.addColorStop(.5, 'rgba(197,138,82,.08)'); band2.addColorStop(1, 'rgba(255,255,255,0)');
          c.fillStyle = band2; c.fillRect(0, cy - sz, W, sz * 2);
          c.fillStyle = 'rgba(241,182,116,.88)'; c.fillRect(cx - 1.5, geo.ry - sz * .9, 3, cy - geo.ry + sz * 1.9);
        });
      }
      function draw(st) {
        if (!g || !bg) return;
        const c = g.ctx, { W, H, cx, cy, sz, pps, ry } = geo, now = performance.now(), dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
        c.clearRect(0, 0, W, H); c.drawImage(bg, 0, 0, W, H);
        while (first < chart.length && chart[first].t < st - 2.5) first++;
        for (let i = first; i < chart.length; i++) {
          const s = chart[i], x = cx + (s.t - st) * pps; if (x > W + sz * 2) break;
          const a = x < cx - 4 ? clamp(1 - (cx - x) / (W * .3), .15, 1) : 1; c.globalAlpha = a;
          if (s.j === 0) {   // the chord of this rhythm, on its card; a shape the teacher has not confirmed is drawn dashed
            const name = s.chord, draft = shapes[name] && shapes[name].src !== 'teacher', cw = Math.max(56, sz * 1.5);
            if (i === 0 || chart[i - 1].chord !== name || chart[i - 1].k !== s.k - 1) {
              c.fillStyle = 'rgba(32,26,21,.95)'; rrect(c, x - 10, ry - sz * .55, cw, sz * 1.1, 12); c.fill();
              c.strokeStyle = 'rgba(241,182,116,.6)'; c.lineWidth = 1.5; if (draft) c.setLineDash([5, 4]); rrect(c, x - 10, ry - sz * .55, cw, sz * 1.1, 12); c.stroke(); c.setLineDash([]);
              c.fillStyle = COL.tx; c.font = '800 ' + Math.round(sz * .48) + 'px ' + FONT; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(name, x, ry + 1);
            }
            c.strokeStyle = 'rgba(241,182,116,.14)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x - sz * .5, cy - sz); c.lineTo(x - sz * .5, cy + sz); c.stroke();
          }
          const rr = res[i], col = rr === 'miss' ? 'rgba(237,100,100,.35)' : rr ? COL[rr] : s.acc ? COL.err : '#D9A06B';
          arrow(c, x, cy, s.dir === 'down', sz * (s.acc ? 1 : .74), col, s.acc ? 6 : 4);
          if (tones[i] != null) { c.fillStyle = tones[i] >= 3 ? COL.ok : COL.cu2; c.font = '700 11px ' + FONT; c.textAlign = 'center'; c.fillText(tones[i] >= 3 ? '✓' : tones[i] + '/3', x, cy + sz * .95); }
          c.globalAlpha = 1;
        }
        fx.draw(c, dt);
      }
      function setExp(st) {   // the chord check listens for the chord of the next stroke
        const nx = chart.find((s, i) => i >= first && !res[i] && s.t > st - .05);
        const key = nx && nx.t - st < .4 ? nx.chord : '';
        if (key !== expKey) { expKey = key; const sh = key && shapes[key]; PD.detector.expect(sh ? sh.frets.map((f, i) => TH.freq(TH.midi(i + 1, f))) : null); }
      }
      return {
        seed: null, total: practice ? 0 : chart.length, practice,
        async prepare() {
          if (live) {
            S.status(t('gm.bj.loading'));
            const off = PD.bus.on('refstate', e => { if (e.state === 'stretching') S.status(t('gm.bj.prep', { p: Math.round((e.progress || 0) * 100) })); });
            try { ref.loadStems(S0.stems); ref.use(o.mix, true); const ok = await ref.whenReady(rate); if (!ok || ref.error) { live = false; PD.ui.toast(t('gm.bj.err'), 4200); } } catch (_) { live = false; PD.ui.toast(t('gm.bj.err'), 4200); }
            off();
            if (live && PD.detector.active) await PD.detector.setAEC(true);
          }
          return true;
        },
        mount() { g = canvasIn(S, layout); },
        schedule(hz) {
          const a = S.now() + .03, tau = S.clock.song(a);
          if (live) { if (tau != null && tau >= 0 && tau < endT) ref.sync(xOf(tau), a, rate, true); else if (tau != null && tau >= endT) ref.sync(0, 0, rate, false); }
          if (o.metro || !live) while (ci < chart.length) { const s = chart[ci], at = S.clock.audio(s.t); if (!(at < hz)) break; if (s.j === 0 && at > S.now() - .005) GA.click(at, s.k % 4 === 0); ci++; }
          setExp(S.songNow());
        },
        pause() { if (live) ref.sync(0, 0, rate, false); const at = S.clock.at(S.now()); ci = chart.findIndex(s => s.t >= at - 1e-6); if (ci < 0) ci = chart.length; },
        frame(st, state) {
          if (state === 'playing') { M.advance(st).forEach(x => { res[x.i] = 'miss'; if (!practice) { S.pop('miss', t('gm.j.miss'), geo.cx, geo.cy - geo.sz * 1.3); S.hud.combo(0); } }); }
          S.hud.progress(st / endT); draw(st);
        },
        onOnset(ev) {
          const tt = S.toSong(ev.t); if (tt == null) return;
          const x = M.input({ t: tt, strength: ev.strength }); if (x.extra || x.same) return;
          res[x.i] = x.grade || 'miss';
          if (x.grade) { fx.burst(geo.cx, geo.cy, x.grade === 'perfect' ? 12 : 7, COL[x.grade]); S.pop(x.grade, t('gm.j.' + x.grade), geo.cx, geo.cy - geo.sz * 1.3); }
          else S.pop('miss', t(x.kind === 'early' ? 'gm.j.early' : 'gm.j.late'), geo.cx, geo.cy - geo.sz * 1.3);
          S.hud.score(S.sc.s.score); S.hud.combo(S.sc.s.combo);
        },
        onChord(ev) {
          const tt = S.toSong(ev.t); if (tt == null) return;
          let bi = -1, bd = .2; for (let i = first; i < chart.length; i++) { const d = Math.abs(chart[i].t - tt); if (chart[i].t - tt > .3) break; if (d < bd) { bd = d; bi = i; } }
          if (bi < 0 || tones[bi] != null) return;
          const sh = shapes[chart[bi].chord], want = sh ? sh.frets.map((f, i) => Math.round(TH.freq(TH.midi(i + 1, f)))).join(',') : '';
          if (ev.exp && ev.exp.map(Math.round).join(',') !== want) return;
          const n = (ev.present || []).filter(Boolean).length; tones[bi] = n; toneN++; if (n >= 3) { toneOk++; S.sc.s.score += 10 * G.mult(S.sc.s.combo); S.hud.score(S.sc.s.score); }
        },
        done: st => st > endT + .3,
        result() { const r = { total: practice ? 0 : chart.length, rows: toneN ? [[t('gm.bj.chordOk'), Math.round(toneOk / toneN * 100) + '%']] : [] }; if (practice) r.grid = false; return r; },
        dbg() { return { exp: chart[first] ? chart[first].chord : '—', level: Math.round(GA.db(S.level || 0)) + ' dBFS', state: 'ref ' + ref.state }; },
        destroy() { try { ref.unload(); } catch (_) {} PD.detector.expect(null); if (PD.detector.aec) PD.detector.setAEC(false); if (g) g.destroy(); }
      };
    }
  };

  return { rush, rhythm, memory, hunt, chord, song, band };
})();
