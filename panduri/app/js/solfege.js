/* =====================================================================
   Solfège — ear training with do · re · mi, on the panduri's own sound.
   Three exercises (general music theory, no panduri technique):
     hear  – "do" sounds first, then a note of the scale: name it
     iv    – two notes: name the interval (second, third, fourth, fifth, octave …)
     sing  – a syllable is shown; "do" sounds, you sing the note, the
             microphone checks the pitch (any octave)
   Each exercise has three steps of difficulty. Scores are kept per
   device; the learning path counts a level as done at 80 % over 10 rounds.
   ===================================================================== */
PD.i18n.add({
  'sf.title': ['სოლფეჯიო', 'Solfège'], 'sf.lead': ['სმენის ვარჯიში: დო · რე · მი — ჯერ ისმენ, მერე ასახელებ და მღერი.', 'Ear training: do · re · mi — listen, name it, sing it.'],
  'sf.hear': ['გაიგონე და დაასახელე', 'Hear it, name it'], 'sf.hearD': ['ჯერ „დო“ ჟღერს, მერე სხვა ნოტი. რომელია?', 'First “do” sounds, then another note. Which one?'],
  'sf.iv': ['ინტერვალები', 'Intervals'], 'sf.ivD': ['ორი ნოტი: რამდენით არიან დაშორებული?', 'Two notes: how far apart are they?'],
  'sf.sing': ['იმღერე', 'Sing it'], 'sf.singD': ['ჯერ „დო“ ჟღერს. იმღერე ნაჩვენები ნოტი — მიკროფონი გეტყვის, ზუსტია თუ არა.', 'First “do” sounds. Sing the note shown — the microphone tells you if you are in tune.'],
  'sf.lvl': ['დონე {n}', 'Level {n}'], 'sf.l1': ['დო · რე · მი', 'do · re · mi'], 'sf.l2': ['დო — სოლ', 'do to sol'], 'sf.l3': ['მთელი ოქტავა', 'the whole octave'],
  'sf.i1': ['სეკუნდა · ტერცია · კვინტა', 'second · third · fifth'], 'sf.i2': ['+ კვარტა · ოქტავა', '+ fourth · octave'], 'sf.i3': ['ყველა, დიდი და პატარა', 'all, major and minor'],
  'sf.play': ['▶ კიდევ მოსმენა', '▶ Listen again'], 'sf.do': ['▶ დო', '▶ do'], 'sf.next': ['შემდეგი', 'Next'], 'sf.right': ['სწორია!', 'Right!'], 'sf.wrong': ['არა — ეს იყო {x}', 'No — it was {x}'],
  'sf.score': ['{a} / {b} · სერია {s}', '{a} / {b} · streak {s}'], 'sf.best': ['საუკეთესო: {p}%', 'Best: {p}%'],
  'sf.singNow': ['იმღერე: {x}', 'Sing: {x}'], 'sf.mic': ['მიკროფონის ჩართვა', 'Turn on the microphone'], 'sf.low': ['დაბლა ხარ — აიწიე', 'Too low — go up'], 'sf.high': ['მაღლა ხარ — დაიწიე', 'Too high — go down'], 'sf.ok': ['ზუსტია! ✓', 'In tune! ✓'], 'sf.listening': ['გისმენ…', 'Listening…']
});
PD.solfege = (() => {
  const h = PD.h, t = PD.i18n.t, TH = PD.theory, ic = PD.ic;
  const L = (ka, en) => PD.i18n.pick({ ka, en });
  const SYL = [['დო', 'do'], ['რე', 're'], ['მი', 'mi'], ['ფა', 'fa'], ['სოლ', 'sol'], ['ლა', 'la'], ['სი', 'si'], ['დო', 'do']], STEP = [0, 2, 4, 5, 7, 9, 11, 12];
  const DO = 60;   // C4, playable on the panduri (C♯ string open = 61, A string fret 3 = 60)
  const syl = i => L(SYL[i][0], SYL[i][1]) + (i === 7 ? '′' : '');
  const IVS = [['პრიმა', 'unison'], ['პატარა სეკუნდა', 'minor 2nd'], ['დიდი სეკუნდა', 'major 2nd'], ['პატარა ტერცია', 'minor 3rd'], ['დიდი ტერცია', 'major 3rd'], ['კვარტა', 'fourth'], ['ტრიტონი', 'tritone'], ['კვინტა', 'fifth'], ['პატარა სექსტა', 'minor 6th'], ['დიდი სექსტა', 'major 6th'], ['პატარა სეპტიმა', 'minor 7th'], ['დიდი სეპტიმა', 'major 7th'], ['ოქტავა', 'octave']];
  const IVN = k => L(IVS[k][0], IVS[k][1]);
  const LEVELS = { hear: [3, 5, 8], iv: [[2, 4, 7], [2, 4, 5, 7, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]], sing: [3, 5, 8] };
  /* ---------- sound ---------- */
  function playM(m, when, vel) { const pos = TH.positions(m).sort((a, b) => a.f - b.f)[0]; if (pos) PD.audio.note(pos.s, pos.f, { when, vel: vel || .8 }); else PD.audio.tone && PD.audio.tone(m, .9); }
  function seq(ms, gap) { PD.audio.ensure(); const c = PD.audio.ctx; if (!c) return; let t0 = c.currentTime + .06; ms.forEach(m => { if (m != null) [].concat(m).forEach(x => playM(x, t0)); t0 += gap; }); }
  /* ---------- scores ---------- */
  const K = 'solfege.best';
  const best = () => PD.store.get(K, {});
  const done = (ex, lv) => (best()[ex + lv] || 0) >= .8;
  function saveBest(ex, lv, p) { const b = best(); if (!(b[ex + lv] >= p)) { b[ex + lv] = p; PD.store.set(K, b); PD.bus.emit('solfege', b); } }

  /* ---------- page ---------- */
  function page(w, param) {
    const own = (() => { const offs = []; const un = PD.bus.on('route', () => { offs.forEach(f => { try { f(); } catch (_) {} }); un(); }); return f => offs.push(f); })();
    const back = () => PD.app.back('learn');
    w.append(h('div', { class: 'row pg-head' }, [h('button', { class: 'btn small backbtn', html: ic.back + '<span class="sr" data-t="back"></span>', onclick: back }), h('h1', { 'data-t': 'sf.title', style: 'margin:0' })]), h('p', { class: 'muted', 'data-t': 'sf.lead' }));
    let [ex, lv] = String(param || 'hear:1').split(':'); if (!LEVELS[ex]) ex = 'hear'; lv = Math.max(1, Math.min(3, +lv || 1));
    const tabs = h('div', { class: 'seg sf-tabs', role: 'tablist' }, ['hear', 'iv', 'sing'].map(k => h('button', { role: 'tab', 'aria-pressed': String(k === ex), 'data-t': 'sf.' + k, onclick: () => PD.app.go('solfege', k + ':' + lv, true) })));
    const lvls = h('div', { class: 'chips-row' }, [1, 2, 3].map(n => h('button', { class: 'chip' + (done(ex, n) ? ' done' : ''), 'aria-pressed': String(n === lv), text: t('sf.lvl', { n }) + ' · ' + t((ex === 'iv' ? 'sf.i' : 'sf.l') + n), onclick: () => PD.app.go('solfege', ex + ':' + n, true) })));
    const card = h('section', { class: 'sf-card' }), desc = h('p', { class: 'fg2', 'data-t': 'sf.' + ex + 'D' });
    const score = h('div', { class: 'sf-score' });
    w.append(tabs, lvls, desc, card, score);
    let n = 0, right = 0, streak = 0, cur = null, locked = false, micMine = false, lockT = 0, frames = [];
    const ROUNDS = 10;
    const showScore = () => { score.innerHTML = ''; score.append(h('span', { text: t('sf.score', { a: right, b: n, s: streak }) }), h('span', { class: 'muted', text: t('sf.best', { p: Math.round((best()[ex + lv] || 0) * 100) }) })); };
    function finishRound(ok) {
      n++; if (ok) { right++; streak++; } else streak = 0;
      if (n >= ROUNDS) { saveBest(ex, lv, right / n); }
      showScore();
    }
    function feedback(el, ok, txt) { el.className = 'sf-fb ' + (ok ? 'ok' : 'no'); el.textContent = txt; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); if (ok && PD.audio.ok) PD.audio.ok(); }
    /* hear & name */
    function hearRound() {
      card.innerHTML = ''; locked = false;
      const pool = LEVELS.hear[lv - 1], i = 1 + Math.floor(Math.random() * (pool - 1));   // never "do" itself (it is the reference)
      cur = i; const play = () => seq([DO, null, DO + STEP[i]], .55);
      const fb = h('div', { class: 'sf-fb', 'aria-live': 'polite' });
      const btns = h('div', { class: 'sf-btns' }, SYL.slice(0, pool).map((_, k) => h('button', { class: 'sf-b', text: syl(k), onclick: e => { if (locked) return; const ok = k === cur; locked = ok; e.currentTarget.classList.add(ok ? 'ok' : 'no'); feedback(fb, ok, ok ? t('sf.right') : t('sf.wrong', { x: syl(cur) })); if (!ok) { locked = true; btns.children[cur].classList.add('ok'); seq([DO + STEP[cur]], .5); } finishRound(ok); setTimeout(hearRound, ok ? 900 : 1700); } })));
      card.append(h('div', { class: 'sf-big', html: '<span class="sf-wave"><i></i><i></i><i></i><i></i><i></i></span>' }), h('div', { class: 'row', style: 'justify-content:center;gap:8px' }, [h('button', { class: 'btn', text: t('sf.play'), onclick: play }), h('button', { class: 'btn small', text: t('sf.do'), onclick: () => seq([DO], .5) })]), btns, fb);
      setTimeout(play, 250);
    }
    /* intervals */
    function ivRound() {
      card.innerHTML = ''; locked = false;
      const pool = LEVELS.iv[lv - 1], k = pool[Math.floor(Math.random() * pool.length)], base = 57 + Math.floor(Math.random() * 7);
      cur = k; const play = () => seq([base, base + k, [base, base + k]], .7);
      const fb = h('div', { class: 'sf-fb', 'aria-live': 'polite' });
      const btns = h('div', { class: 'sf-btns' }, pool.map(x => h('button', { class: 'sf-b wide', text: IVN(x), onclick: e => { if (locked) return; const ok = x === cur; locked = true; e.currentTarget.classList.add(ok ? 'ok' : 'no'); if (!ok) [...btns.children].forEach((b, j) => { if (pool[j] === cur) b.classList.add('ok'); }); feedback(fb, ok, ok ? t('sf.right') : t('sf.wrong', { x: IVN(cur) })); finishRound(ok); setTimeout(ivRound, ok ? 1000 : 1900); } })));
      card.append(h('div', { class: 'sf-big', html: '<span class="sf-wave"><i></i><i></i><i></i><i></i><i></i></span>' }), h('div', { class: 'row', style: 'justify-content:center' }, [h('button', { class: 'btn', text: t('sf.play'), onclick: play })]), btns, fb);
      setTimeout(play, 250);
    }
    /* sing */
    const needle = h('div', { class: 'sf-needle' }, [h('i')]);
    function singRound() {
      card.innerHTML = ''; locked = false; lockT = 0; frames = [];
      const pool = LEVELS.sing[lv - 1], i = Math.floor(Math.random() * pool); cur = i;
      const fb = h('div', { class: 'sf-fb', 'aria-live': 'polite', text: PD.detector.active ? t('sf.listening') : '' });
      const mic = h('button', { class: 'btn primary', html: ic.mic + '<span>' + PD.esc(t('sf.mic')) + '</span>', hidden: PD.detector.active, onclick: () => PD.practice.micOn(ok => { if (ok) { micMine = true; mic.hidden = true; fb.textContent = t('sf.listening'); } }) });
      card.append(h('div', { class: 'sf-big sing', text: syl(i) }), h('div', { class: 'row', style: 'justify-content:center;gap:8px' }, [h('button', { class: 'btn', text: t('sf.do'), onclick: () => seq([DO], .5) }), h('button', { class: 'btn small', text: '▶ ' + syl(i), onclick: () => seq([DO + STEP[i]], .5) })]), needle, mic, fb);
      card.fb = fb; setTimeout(() => seq([DO], .5), 250);
    }
    function onPitch(m) {
      if (ex !== 'sing' || locked || !(m.f > 0) || m.conf < .8 || !card.fb) return;
      frames.push(m.f); if (frames.length > 5) frames.shift();
      const f = frames.slice().sort((a, b) => a - b)[Math.floor(frames.length / 2)], mm = TH.midiOf(f), target = DO + STEP[cur];
      let d = ((mm - target) % 12 + 18) % 12 - 6;   // the nearest octave: men and women sing the same syllable
      const c = d * 100; needle.firstChild.style.transform = 'translateX(' + Math.max(-50, Math.min(50, c / 2)) + '%)';
      needle.classList.toggle('ok', Math.abs(c) <= 35);
      if (Math.abs(c) <= 35) { if (!lockT) lockT = performance.now(); if (performance.now() - lockT > 500) { locked = true; feedback(card.fb, true, t('sf.ok')); finishRound(true); setTimeout(singRound, 1200); } }
      else { lockT = 0; card.fb.className = 'sf-fb'; card.fb.textContent = c < 0 ? t('sf.low') : t('sf.high'); }
    }
    own(PD.detector.on('pitch', onPitch));
    own(() => { if (micMine && PD.detector.active) PD.detector.stop(); });
    showScore();
    ({ hear: hearRound, iv: ivRound, sing: singRound })[ex]();
  }
  return { page, done, best };
})();
