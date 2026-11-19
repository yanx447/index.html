/* =====================================================================
   PD.advTheory — „კონსერვატორია და ჯაზი": the advanced theory book and
   its ear training. Route 'adv':
     adv            the book: the conservatory course, the jazz course,
                    the ear-training exercises
     adv/c:<id>     a chapter (PD.advData.CONS / JAZZ): text, tables, every
                    example playable (piano), a self-check at the end
     adv/e:<id>     an ear-training exercise, three levels, rounds of ten
   Ear training (general music theory, no panduri technique): intervals,
   triads, seventh chords, scales and modes, cadences, jazz progressions,
   melodic dictation. A level counts as done at 80 % in a round of ten.
   In the app only (APP_ONLY).
   ===================================================================== */
'use strict';
PD.i18n.add({
  'av.title': ['კონსერვატორია და ჯაზი', 'Conservatory & jazz'],
  'av.lead': ['ჰარმონია, კონტრაპუნქტი, ფორმა და ჯაზის ენა — კონსერვატორიისა და ჯაზის სკოლის კურსი, ყველა მაგალითი ხმით, და სმენის ვარჯიში.', 'Harmony, counterpoint, form and the language of jazz — the conservatory and jazz-school course, every example with sound, and ear training.'],
  'av.cons': ['კონსერვატორიის კურსი', 'The conservatory course'], 'av.jazz': ['ჯაზის სკოლა', 'The jazz school'], 'av.ear': ['სმენის ვარჯიში', 'Ear training'],
  'av.read': ['{a} / {b} თავი', '{a} / {b} chapters'], 'av.ch': ['თავი {n} / {m}', 'Chapter {n} / {m}'], 'av.list': ['ყველა თავი', 'All chapters'],
  'av.next': ['შემდეგი თავი', 'Next chapter'], 'av.finish': ['დასრულება', 'Finish'], 'av.check': ['შეამოწმე თავი', 'Check yourself'],
  'av.right': ['სწორია!', 'Correct!'], 'av.wrong': ['არა — ', 'Not quite — '], 'av.tile': ['ჰარმონია, კონტრაპუნქტი, ჯაზი, სმენა', 'Harmony, counterpoint, jazz, ear'],
  'av.listen': ['მოსმენა', 'Listen'], 'av.again': ['კიდევ ერთხელ', 'Again'], 'av.arp': ['ნოტ-ნოტ', 'Note by note'], 'av.nextQ': ['შემდეგი', 'Next'],
  'av.round': ['{a} / {b}', '{a} / {b}'], 'av.score': ['ქულა: {a} / {b}', 'Score: {a} / {b}'], 'av.best': ['საუკეთესო: {p}%', 'Best: {p}%'],
  'av.done': ['რაუნდი დასრულდა: {p}%', 'Round finished: {p}%'], 'av.pass': ['დონე გავლილია!', 'Level passed!'], 'av.retry': ['80% საჭიროა — კიდევ სცადე.', '80% is needed — try again.'],
  'av.restart': ['ახალი რაუნდი', 'New round'], 'av.lvl': ['დონე {n}', 'Level {n}'], 'av.itWas': ['ეს იყო: {x}', 'It was: {x}'],
  'av.dictD': ['ჯერ „დო“ ჟღერს, შემდეგ მელოდია. ჩაწერე ნოტები თანმიმდევრობით.', 'First “do” sounds, then the melody. Enter its notes in order.'],
  'av.clear': ['წაშლა', 'Clear'], 'av.doRef': ['„დო“', '“do”']
});

PD.advTheory = (() => {
  const h = PD.h, t = PD.i18n.t, D = () => PD.advData || { CONS: [], JAZZ: [] };
  const L = (ka, en) => PD.i18n.pick({ ka, en }), LP = a => Array.isArray(a) ? L(a[0], a[1]) : a;
  const LET = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const M = n => { const m = /^([A-G])([#b♯♭]?)(-?\d)$/.exec(n.trim()); if (!m) return null; return 12 * (+m[3] + 1) + LET[m[1]] + (m[2] === '#' || m[2] === '♯' ? 1 : m[2] === 'b' || m[2] === '♭' ? -1 : 0); };
  const pretty = s => String(s).replace(/([A-G])#/g, '$1♯').replace(/([A-G])b(?=\d|\s|$)/g, '$1♭');

  /* ---------- sound: the piano, which has every note these chords need ---------- */
  function hit(m, when, dur) {
    const A = PD.audio; if (!A) return;
    if (A.piano) A.piano(m, { when, dur: dur || 1.6, vel: .62 }); else if (A.theory) A.theory.midi(m, { when, dur: dur || 1.6, vel: .62 });
  }
  function play(spec) {
    const A = PD.audio; if (!A || !A.ensure()) return; const ctx = A.ctx; let at = ctx.currentTime + .08;
    const items = spec.ch ? spec.ch : String(spec.mel || '').split(/\s+/);
    items.forEach((it, i) => {
      const ms = [...new Set(String(it).split(/\s+/).map(M).filter(x => x != null))];
      const gap = Array.isArray(spec.gap) ? spec.gap[i] : (spec.gap || .9);
      ms.forEach((m, k) => hit(m, at + (spec.ch ? k * .012 : 0), spec.ch ? Math.max(.5, gap * 1.1) : Math.max(.3, gap * 1.4)));
      at += gap;
    });
  }
  const playMidis = (chords, gap, arp) => { const A = PD.audio; if (!A || !A.ensure()) return; let at = A.ctx.currentTime + .08; chords.forEach(c => { [].concat(c).forEach((m, k) => hit(m, at + (arp ? k * .42 : k * .012), arp ? 1.2 : Math.max(.6, gap * 1.1))); at += arp ? [].concat(c).length * .42 + .2 : gap; }); };

  /* ---------- progress ---------- */
  const DONE = 'adv.done', EAR = 'adv.ear';
  const done = () => PD.store.get(DONE, {}), mark = id => { const d = done(); if (!d[id]) { d[id] = Date.now(); PD.store.set(DONE, d); } };
  const ear = () => PD.store.get(EAR, {});
  const earBest = (e, l) => (ear()[e + ':' + l] || 0), earDone = (e, l) => earBest(e, l) >= 80;
  const back = (to, param) => h('button', { class: 'btn small backbtn', html: PD.ic.back + '<span class="sr" data-t="back"></span>', onclick: () => to ? PD.app.go(to, param) : PD.app.back('mtheory') });

  /* ---------- the book ---------- */
  function hub(w) {
    const d = done(), all = D().CONS.concat(D().JAZZ), n = all.filter(c => d[c.id]).length;
    w.append(h('div', { class: 'row pg-head' }, [back(), h('h1', { 'data-t': 'av.title', style: 'margin:0' })]), h('p', { class: 'fg2', 'data-t': 'av.lead' }),
      h('div', { class: 'tb-prog' }, [h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(n / Math.max(1, all.length) * 100) + '%' })]), h('small', { class: 'muted', text: t('av.read', { a: n, b: all.length }) })]));
    const list = (key, arr) => [h('h2', { class: 'mth-h', 'data-t': key }), h('div', { class: 'tb-list' }, arr.map((c, i) => h('button', { class: 'tb-card' + (d[c.id] ? ' done' : ''), onclick: () => PD.app.go('adv', 'c:' + c.id) }, [
      h('span', { class: 'tb-num', text: d[c.id] ? '✓' : String(i + 1) }), h('span', { class: 'tb-ct' }, [h('b', { text: LP(c.t) }), h('small', { text: LP(c.lead) })])])))];
    w.append(...list('av.cons', D().CONS), ...list('av.jazz', D().JAZZ));
    w.append(h('h2', { class: 'mth-h', 'data-t': 'av.ear' }), h('div', { class: 'mth-sf av-ear' }, EX.map(x => h('button', { class: 'mth-sfc', onclick: () => PD.app.go('adv', 'e:' + x.id) }, [
      h('b', { text: LP(x.t) }), h('small', { text: LP(x.d) }), h('span', { class: 'mth-dots', 'aria-hidden': 'true' }, [1, 2, 3].map(l => h('i', { class: earDone(x.id, l) ? 'on' : '' })))]))));
    PD.i18n.apply(w);
  }
  function block(b) {
    const [k] = b;
    if (k === 'p') return h('p', { class: 'tb-p', html: L(b[1], b[2]) });
    if (k === 'h') return h('h3', { class: 'tb-h', text: L(b[1], b[2]) });
    if (k === 'note') return h('p', { class: 'tb-note', html: L(b[1], b[2]) });
    if (k === 'ul') return h('ul', { class: 'tb-ul' }, b[1].map(x => h('li', { html: LP(x) })));
    if (k === 'tb') return h('div', { class: 'tb-tw' }, [h('table', { class: 'tb-t' }, [h('thead', {}, [h('tr', {}, b[1].map(c => h('th', { text: LP(c) })))]), h('tbody', {}, b[2].map(r => h('tr', {}, r.map(c => h('td', { html: LP(c) })))))])]);
    if (k === 'play') return h('button', { class: 'btn small tb-play av-play', html: (PD.ic.play || '▶ ') + '<span>' + PD.esc(pretty(LP(b[1]))) + '</span>', onclick: () => play(b[2]) });
    return null;
  }
  function chapter(w, c) {
    const C = D().CONS.includes(c) ? D().CONS : D().JAZZ, i = C.indexOf(c), course = C === D().CONS ? 'av.cons' : 'av.jazz';
    w.append(h('div', { class: 'row' }, [back('adv'), h('small', { class: 'muted', text: t(course) + ' · ' + t('av.ch', { n: i + 1, m: C.length }) })]),
      h('h1', { class: 'tb-title', text: LP(c.t) }), h('p', { class: 'fg2', text: LP(c.lead) }));
    const body = h('article', { class: 'tb-body av-body' }); w.append(body);
    // play buttons that follow each other sit in one row
    let row = null;
    c.b.forEach(b => { const el = block(b); if (!el) return; if (b[0] === 'play') { if (!row) { row = h('div', { class: 'av-plays' }); body.append(row); } row.append(el); } else { row = null; body.append(el); } });
    if (c.q && c.q.length) {
      const qs = h('section', { class: 'tb-quiz' }, [h('h3', { 'data-t': 'av.check' })]); let right = 0;
      c.q.forEach(([q, opts, ok, why]) => {
        const order = opts.map((o, k) => k).sort(() => Math.random() - .5), fb = h('p', { class: 'tb-fb', hidden: true });
        const box = h('div', { class: 'tb-q' }, [h('b', { html: LP(q) }), h('div', { class: 'tb-opts' }, order.map(k => h('button', { class: 'btn small', html: LP(opts[k]), onclick: e => {
          const good = k === ok; box.querySelectorAll('.tb-opts button').forEach(x => { x.disabled = true; }); e.currentTarget.classList.add(good ? 'ok' : 'bad');
          if (!good) box.querySelectorAll('.tb-opts button')[order.indexOf(ok)].classList.add('ok');
          fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.innerHTML = (good ? t('av.right') + ' ' : t('av.wrong')) + LP(why);
          if (good && ++right === c.q.length) mark(c.id);
          if (good && PD.audio.ok) PD.audio.ok();
        } }))), fb]);
        qs.append(box);
      });
      w.append(qs);
    }
    const nx = C[i + 1], pv = C[i - 1];
    w.append(h('div', { class: 'tb-nav' }, [pv ? h('button', { class: 'btn', text: '‹ ' + LP(pv.t), onclick: () => PD.app.go('adv', 'c:' + pv.id) }) : h('span'),
      h('button', { class: 'btn primary', text: nx ? t('av.next') + ' ›' : t('av.finish'), onclick: () => { mark(c.id); PD.app.go('adv', nx ? 'c:' + nx.id : null); } })]));
    PD.i18n.apply(w);
  }

  /* ---------- ear training ---------- */
  const rnd = n => Math.floor(Math.random() * n), pick = a => a[rnd(a.length)];
  const IV = [['პრიმა', 'unison'], ['პატარა სეკუნდა', 'minor 2nd'], ['დიდი სეკუნდა', 'major 2nd'], ['პატარა ტერცია', 'minor 3rd'], ['დიდი ტერცია', 'major 3rd'], ['წმინდა კვარტა', 'perfect 4th'], ['ტრიტონი', 'tritone'], ['წმინდა კვინტა', 'perfect 5th'], ['პატარა სექსტა', 'minor 6th'], ['დიდი სექსტა', 'major 6th'], ['პატარა სეპტიმა', 'minor 7th'], ['დიდი სეპტიმა', 'major 7th'], ['ოქტავა', 'octave']];
  const TRI = { maj: [[0, 4, 7], ['მაჟორი', 'major']], min: [[0, 3, 7], ['მინორი', 'minor']], dim: [[0, 3, 6], ['შემცირებული', 'diminished']], aug: [[0, 4, 8], ['გადიდებული', 'augmented']] };
  const SEV = { maj7: [[0, 4, 7, 11], 'maj7'], dom7: [[0, 4, 7, 10], '7'], m7: [[0, 3, 7, 10], 'm7'], hd: [[0, 3, 6, 10], 'ø (m7♭5)'], dim7: [[0, 3, 6, 9], '°7'], mM7: [[0, 3, 7, 11], 'm(maj7)'], six: [[0, 4, 7, 9], '6'] };
  const SC = { ion: [[0, 2, 4, 5, 7, 9, 11, 12], ['მაჟორი (იონიური)', 'major (Ionian)']], aeo: [[0, 2, 3, 5, 7, 8, 10, 12], ['ნატურალური მინორი', 'natural minor']], harm: [[0, 2, 3, 5, 7, 8, 11, 12], ['ჰარმონიული მინორი', 'harmonic minor']],
    dor: [[0, 2, 3, 5, 7, 9, 10, 12], ['დორიული', 'Dorian']], phr: [[0, 1, 3, 5, 7, 8, 10, 12], ['ფრიგიული', 'Phrygian']], lyd: [[0, 2, 4, 6, 7, 9, 11, 12], ['ლიდიური', 'Lydian']], mix: [[0, 2, 4, 5, 7, 9, 10, 12], ['მიქსოლიდიური', 'Mixolydian']],
    loc: [[0, 1, 3, 5, 6, 8, 10, 12], ['ლოკრიული', 'Locrian']], mel: [[0, 2, 3, 5, 7, 9, 11, 12], ['მელოდიური მინორი', 'melodic minor']], wt: [[0, 2, 4, 6, 8, 10, 12], ['მთელტონიანი', 'whole tone']], blu: [[0, 3, 5, 6, 7, 10, 12], ['ბლუზის გამა', 'blues scale']] };
  // chords as offsets from the key's tonic, close voicing over a bass
  const triadAt = (r, q) => q === 'min' ? [r, r + 3, r + 7] : q === 'dim' ? [r, r + 3, r + 6] : [r, r + 4, r + 7];
  const withBass = (k, deg, q) => { const r = k + deg; return [r - 12].concat(triadAt(r, q)); };
  const CAD = {
    auth: [k => [withBass(k, 0), withBass(k, 5), withBass(k, 7), withBass(k, 0)], ['ავთენტური (V → I)', 'authentic (V → I)']],
    half: [k => [withBass(k, 0), withBass(k, 5), withBass(k, 0), withBass(k, 7)], ['ნახევარი (→ V)', 'half (→ V)']],
    plag: [k => [withBass(k, 0), withBass(k, 7), withBass(k, 5), withBass(k, 0)], ['პლაგალური (IV → I)', 'plagal (IV → I)']],
    dec: [k => [withBass(k, 0), withBass(k, 5), withBass(k, 7), withBass(k, 9, 'min')], ['შეწყვეტილი (V → vi)', 'deceptive (V → vi)']] };
  // jazz progressions as shells (root, 3rd/7th) from the key's tonic
  const sh = (k, deg, third, sev) => [k + deg - 12, k + deg + sev, k + deg + third + 12];
  const PROG = {
    iivi: [k => [sh(k, 2, 3, 10), sh(k, 7, 4, 10), sh(k, 0, 4, 11)], 'ii – V – I'],
    turn: [k => [sh(k, 0, 4, 11), sh(k, 9, 3, 10), sh(k, 2, 3, 10), sh(k, 7, 4, 10)], 'I – vi – ii – V'],
    iiivi: [k => [sh(k, 4, 3, 10), sh(k, 9, 3, 10), sh(k, 2, 3, 10), sh(k, 7, 4, 10)], 'iii – vi – ii – V'],
    back: [k => [sh(k, 5, 3, 10), sh(k, 10, 4, 10), sh(k, 0, 4, 11)], ['backdoor (iv – ♭VII7 – I)', 'backdoor (iv – ♭VII7 – I)']],
    trit: [k => [sh(k, 2, 3, 10), sh(k, 1, 4, 10), sh(k, 0, 4, 11)], ['ტრიტონული ჩანაცვლება (ii – ♭II7 – I)', 'tritone sub (ii – ♭II7 – I)']],
    minor: [k => [[k + 2 - 12, k + 2 + 6, k + 2 + 10, k + 2 + 15], [k + 7 - 12, k + 7 + 4, k + 7 + 10, k + 7 + 13], [k - 12, k + 3, k + 7, k + 9]], ['მინორული ii – V – i', 'minor ii – V – i']] };
  const SYL = [['დო', 'do'], ['რე', 're'], ['მი', 'mi'], ['ფა', 'fa'], ['სოლ', 'sol'], ['ლა', 'la'], ['სი', 'si'], ['დო′', 'do′']], STEP = [0, 2, 4, 5, 7, 9, 11, 12];
  const lab = x => LP(x);
  /* each exercise: levels (their names), and make(level) → a question { sound(arp), opts: [k, label], ok } */
  const EX = [
    { id: 'iv', t: ['ინტერვალები', 'Intervals'], d: ['ორი ბგერა — რა მანძილია მათ შორის?', 'Two notes — how far apart?'], lv: [['ზემოთ: სეკ., ტერც., კვარტა, კვინტა, ოქტავა', 'Up: 2nds, 3rds, 4th, 5th, octave'], ['ყველა, ზემოთ და ქვემოთ', 'All of them, up and down'], ['ყველა, ერთადაც (ჰარმონიული)', 'All of them, also together (harmonic)']],
      make(l) { const set = l === 1 ? [2, 3, 4, 5, 7, 12] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], iv = pick(set), r = 55 + rnd(12), mode = l === 1 ? 'up' : l === 2 ? pick(['up', 'down']) : pick(['up', 'down', 'harm']);
        const a = mode === 'down' ? r + iv : r, b = mode === 'down' ? r : r + iv;
        return { sound: arp => mode === 'harm' && !arp ? playMidis([[a, b]], 1.4) : playMidis([a, b], .75, false), opts: set.map(k => [k, lab(IV[k])]), ok: iv }; } },
    { id: 'tri', t: ['ტრიადები', 'Triads'], d: ['მაჟორი, მინორი, შემცირებული, გადიდებული', 'Major, minor, diminished, augmented'], lv: [['მაჟორი · მინორი', 'major · minor'], ['+ შემცირებული · გადიდებული', '+ diminished · augmented'], ['+ მიმართვებში', '+ in inversions']],
      make(l) { const ks = l === 1 ? ['maj', 'min'] : ['maj', 'min', 'dim', 'aug'], q = pick(ks), r = 52 + rnd(12); let ns = TRI[q][0].map(x => r + x);
        if (l === 3) { const inv = rnd(3); for (let i = 0; i < inv; i++) ns = ns.slice(1).concat(ns[0] + 12); }
        return { sound: arp => playMidis(arp ? [ns] : [ns], 1.5, arp), opts: ks.map(k => [k, lab(TRI[k][1])]), ok: q }; } },
    { id: 'sev', t: ['სეპტაკორდები', 'Seventh chords'], d: ['maj7, 7, m7, ø, °7 …', 'maj7, 7, m7, ø, °7 …'], lv: [['maj7 · 7 · m7', 'maj7 · 7 · m7'], ['+ ø · °7', '+ ø · °7'], ['+ m(maj7) · 6', '+ m(maj7) · 6']],
      make(l) { const ks = l === 1 ? ['maj7', 'dom7', 'm7'] : l === 2 ? ['maj7', 'dom7', 'm7', 'hd', 'dim7'] : ['maj7', 'dom7', 'm7', 'hd', 'dim7', 'mM7', 'six'], q = pick(ks), r = 48 + rnd(10), ns = SEV[q][0].map(x => r + x);
        return { sound: arp => playMidis([ns], 1.6, arp), opts: ks.map(k => [k, SEV[k][1]]), ok: q }; } },
    { id: 'mode', t: ['გამები და ლადები', 'Scales and modes'], d: ['რომელი გამა ჟღერს?', 'Which scale is it?'], lv: [['მაჟორი · მინორის სამი სახე', 'major · the three minors'], ['+ დორიული, ფრიგიული, ლიდიური, მიქსოლიდიური', '+ Dorian, Phrygian, Lydian, Mixolydian'], ['+ ლოკრიული, მთელტონიანი, ბლუზი', '+ Locrian, whole tone, blues']],
      make(l) { const ks = l === 1 ? ['ion', 'aeo', 'harm', 'mel'] : l === 2 ? ['ion', 'aeo', 'dor', 'phr', 'lyd', 'mix'] : ['ion', 'aeo', 'harm', 'mel', 'dor', 'phr', 'lyd', 'mix', 'loc', 'wt', 'blu'], q = pick(ks), r = 55 + rnd(8), ns = SC[q][0].map(x => r + x);
        return { sound: () => playMidis(ns, .3), opts: ks.map(k => [k, lab(SC[k][1])]), ok: q }; } },
    { id: 'cad', t: ['კადანსები', 'Cadences'], d: ['როგორ მთავრდება ფრაზა?', 'How does the phrase end?'], lv: [['ავთენტური · ნახევარი', 'authentic · half'], ['+ პლაგალური', '+ plagal'], ['+ შეწყვეტილი', '+ deceptive']],
      make(l) { const ks = l === 1 ? ['auth', 'half'] : l === 2 ? ['auth', 'half', 'plag'] : ['auth', 'half', 'plag', 'dec'], q = pick(ks), k = 55 + rnd(7);
        return { sound: () => playMidis(CAD[q][0](k), 1), opts: ks.map(x => [x, lab(CAD[x][1])]), ok: q }; } },
    { id: 'prog', t: ['ჯაზის გადასვლები', 'Jazz progressions'], d: ['ii – V – I, ტერნარაუნდები, ჩანაცვლებები', 'ii – V – I, turnarounds, substitutions'], lv: [['ii – V – I · I – vi – ii – V', 'ii – V – I · I – vi – ii – V'], ['+ iii – vi – ii – V · backdoor', '+ iii – vi – ii – V · backdoor'], ['+ ტრიტონული · მინორული ii – V – i', '+ tritone sub · minor ii – V – i']],
      make(l) { const ks = l === 1 ? ['iivi', 'turn'] : l === 2 ? ['iivi', 'turn', 'iiivi', 'back'] : ['iivi', 'turn', 'iiivi', 'back', 'trit', 'minor'], q = pick(ks), k = 55 + rnd(7);
        return { sound: () => playMidis(PROG[q][0](k), 1.1), opts: ks.map(x => [x, lab(PROG[x][1])]), ok: q }; } },
    { id: 'dict', t: ['მელოდიური კარნახი', 'Melodic dictation'], d: ['მოისმინე და ჩაწერე მელოდია', 'Hear a melody and write it down'], lv: [['3 ნოტი, დო-დან სოლამდე', '3 notes, do to sol'], ['4 ნოტი, მთელ ოქტავაში', '4 notes, the whole octave'], ['5 ნოტი, ნახტომებით', '5 notes, with leaps']], dict: true,
      make(l) { const n = l + 2, range = l === 1 ? 5 : 8, seq = [0]; while (seq.length < n) { const p = seq[seq.length - 1]; let q;
          do { q = l === 3 ? rnd(range) : clampI(p + pick([-2, -1, 1, 2]), 0, range - 1); } while (q === p); seq.push(q); }
        const k = 60 + (l === 3 ? rnd(5) - 2 : 0), ns = seq.map(i => k + STEP[i]);
        return { sound: () => { playMidis([k], .9); setTimeout(() => playMidis(ns, .6), 1100); }, seq, range, k, ok: seq.join(',') }; } }];
  const clampI = (v, a, b) => Math.max(a, Math.min(b, v));

  function exercise(w, x) {
    let lvl = [1, 2, 3].find(l => !earDone(x.id, l)) || 3, q = null, answered = false, n = 0, right = 0, entry = [];
    const ROUND = 10;
    w.append(h('div', { class: 'row pg-head' }, [back('adv'), h('h1', { text: LP(x.t), style: 'margin:0' })]), h('p', { class: 'fg2', text: x.dict ? t('av.dictD') : LP(x.d) }));
    const lv = h('div', { class: 'chips-row av-lv', role: 'radiogroup' }), box = h('section', { class: 'av-ex' }); w.append(lv, box);
    function drawLv() { lv.innerHTML = ''; [1, 2, 3].forEach(l => lv.append(h('button', { class: 'chip' + (l === lvl ? ' on' : ''), role: 'radio', 'aria-checked': String(l === lvl), onclick: () => { lvl = l; n = 0; right = 0; drawLv(); next(); } }, [h('b', { text: t('av.lvl', { n: l }) + (earDone(x.id, l) ? ' ✓' : '') }), h('small', { text: ' · ' + LP(x.lv[l - 1]) })]))); }
    function next() {
      if (n >= ROUND) return finish();
      q = x.make(lvl); answered = false; entry = []; box.innerHTML = '';
      const fb = h('p', { class: 'tb-fb', hidden: true, 'aria-live': 'polite' });
      const head = h('div', { class: 'av-top' }, [h('small', { class: 'muted', text: t('av.round', { a: n + 1, b: ROUND }) + ' · ' + t('av.score', { a: right, b: n }) }), h('span', { class: 'grow' }), h('small', { class: 'muted', text: t('av.best', { p: earBest(x.id, lvl) }) })]);
      const listen = h('button', { class: 'btn primary big av-listen', html: (PD.ic.play || '▶ ') + '<span>' + PD.esc(t('av.listen')) + '</span>', onclick: () => q.sound(false) });
      const tools = h('div', { class: 'av-tools' }, [listen, ['tri', 'sev', 'iv'].includes(x.id) ? h('button', { class: 'btn', text: t('av.arp'), onclick: () => q.sound(true) }) : null].filter(Boolean));
      const bar = h('div', { class: 'hx-bar' }, [h('i', { style: 'width:' + Math.round(n / ROUND * 100) + '%' })]);
      box.append(head, bar, tools);
      const nextB = h('button', { class: 'btn primary', text: t('av.nextQ') + ' ›', hidden: true, onclick: () => { n++; next(); } });
      if (x.dict) {
        const slots = h('div', { class: 'av-slots' }), pad = h('div', { class: 'av-pad' });
        const paint = () => { slots.innerHTML = ''; for (let i = 0; i < q.seq.length; i++) slots.append(h('span', { class: 'av-slot' + (i < entry.length ? ' on' : ''), text: i < entry.length ? L(SYL[entry[i]][0], SYL[entry[i]][1]) : i === 0 ? t('av.doRef') : '·' })); };
        for (let i = 0; i < q.range; i++) pad.append(h('button', { class: 'btn av-key', text: L(SYL[i][0], SYL[i][1]), onclick: () => { if (answered) return; playMidis([q.k + STEP[i]], .5);   // movable do: the keys sound in the melody's own key
 entry.push(i); paint(); if (entry.length === q.seq.length) judge(entry.join(',') === q.ok, q.seq.map(k => L(SYL[k][0], SYL[k][1])).join(' · ')); } }));
        box.append(slots, pad, h('button', { class: 'btn ghost small', text: t('av.clear'), onclick: () => { if (!answered) { entry = []; paint(); } } }), fb, nextB); paint();
      } else {
        const opts = h('div', { class: 'av-opts' }, q.opts.map(([k, label]) => h('button', { class: 'btn', text: pretty(label), 'data-k': String(k), onclick: e => { if (answered) return; const good = String(k) === String(q.ok); e.currentTarget.classList.add(good ? 'ok' : 'bad'); if (!good) { const c = opts.querySelector('[data-k="' + q.ok + '"]'); c && c.classList.add('ok'); } judge(good, (q.opts.find(o => String(o[0]) === String(q.ok)) || [])[1]); } })));
        box.append(opts, fb, nextB);
      }
      function judge(good, truth) {
        answered = true; if (good) { right++; PD.audio.ok && PD.audio.ok(); }
        fb.hidden = false; fb.className = 'tb-fb ' + (good ? 'ok' : 'bad'); fb.textContent = good ? t('av.right') : t('av.itWas', { x: pretty(truth || '') });
        box.querySelectorAll('.av-opts button').forEach(b => { b.disabled = true; }); nextB.hidden = false; nextB.focus();
      }
      setTimeout(() => q.sound(false), 250);
    }
    function finish() {
      const p = Math.round(right / ROUND * 100), E = ear(), key = x.id + ':' + lvl; if (p > (E[key] || 0)) { E[key] = p; PD.store.set(EAR, E); }
      box.innerHTML = ''; box.append(h('h2', { text: t('av.done', { p }) }), h('p', { class: p >= 80 ? 'tb-fb ok' : 'tb-fb bad', text: t(p >= 80 ? 'av.pass' : 'av.retry') }),
        h('button', { class: 'btn primary', text: t('av.restart'), onclick: () => { n = 0; right = 0; if (p >= 80 && lvl < 3) lvl++; drawLv(); next(); } }));
      drawLv();
    }
    drawLv(); next(); PD.i18n.apply(w);
  }

  function style() {
    if (PD.advTheory._s) return; PD.advTheory._s = true;
    document.head.appendChild(h('style', { text: `
.av-plays{display:flex;flex-wrap:wrap;gap:8px;margin:4px 0 8px}.av-play{display:inline-flex;align-items:center;gap:6px}.av-play svg{width:14px;height:14px}
.av-ex{display:grid;gap:14px;padding:18px;border-radius:20px;background:var(--surface,#141416);border:1px solid var(--line,rgba(255,255,255,.08))}
.av-top{display:flex;align-items:center;gap:8px}.av-top .grow{flex:1}.av-tools{display:flex;gap:10px;flex-wrap:wrap}
.av-listen{display:inline-flex;align-items:center;gap:8px}.av-listen svg{width:18px;height:18px}
.av-opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.av-opts .btn{min-height:48px;white-space:normal;line-height:1.25}
.av-opts .btn.ok{background:#3e7a45;color:#fff}.av-opts .btn.bad{background:#8e3b22;color:#fff}
.av-lv{flex-wrap:wrap}.av-lv .chip small{opacity:.7;font-weight:500}.av-lv .chip.on{background:#2a2622;color:#f2d2b3;box-shadow:inset 0 0 0 1px rgba(217,154,100,.55)}
.av-slots{display:flex;gap:8px;flex-wrap:wrap}.av-slot{min-width:64px;padding:10px 12px;border-radius:12px;text-align:center;background:#0e0f10;border:1px dashed rgba(255,255,255,.18);color:#8d8d93;font-weight:700}
.av-slot.on{border-style:solid;border-color:rgba(217,154,100,.7);color:#f2d2b3}
.av-pad{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:8px}.av-key{min-height:52px;font-weight:700}
` }));
  }

  function page(w, param) {
    style();
    const p = String(param || '');
    if (p.startsWith('c:')) { const id = p.slice(2), c = D().CONS.concat(D().JAZZ).find(x => x.id === id); if (c) return chapter(w, c); }
    if (p.startsWith('e:')) { const x = EX.find(e => e.id === p.slice(2)); if (x) return exercise(w, x); }
    return hub(w);
  }
  return { page, EX, done, earDone };
})();
