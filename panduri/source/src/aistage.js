/* =====================================================================
   What comes out of the AI studio first: the song as a panduri lesson.

   A recording dropped into the studio is measured (beats, chords, key);
   the rhythm reader then listens for the strokes. As soon as both are in,
   the song is made into a lesson of the same shape as Bani-Acharuli
   (PD.aiLessons.make) — the chords with their strokes, the neck, the
   recording to play along with — and, the first time for a song, the
   lesson opens at once in its listening stage: the same player the
   teacher's songs use. The card stays at the top of the studio, so the
   song can be played as a lesson again, or its chords and rhythm changed.

   In the app only (APP_ONLY): the single file has no room for it.
   ===================================================================== */
'use strict';
PD.i18n.add({
  'ah.title': ['ფანდურის გაკვეთილი', 'As a panduri lesson'],
  'ah.wait': ['AI ამზადებს გაკვეთილს — უსმენს რითმს…', 'The AI is making the lesson — listening for the rhythm…'],
  'ah.ready': ['აკორდები რითმით, გრიფი და შენი დაკვრის მოსმენა — ისე, როგორც ბანი-აჭარულში.', 'The chords with their strokes, the neck, and listening to your playing — the way Bani-Acharuli is learned.'],
  'ah.play': ['დაკვრა გაკვეთილად', 'Play it as a lesson'],
  'ah.page': ['გაკვეთილის გვერდი', 'Lesson page'],
  'ah.edit': ['აკორდი ან რითმი შეცვალე', 'Change a chord or the rhythm'],
  'ah.lock': ['გახსენი Premium-ით', 'Open with Premium'],
  'ah.lockD': ['სიმღერის გაკვეთილად ქცევა Premium-შია.', 'Turning a song into a lesson is part of Premium.'],
  'ah.made': ['სიმღერა გაკვეთილად იქცა', 'The song is now a lesson'],
  'ah.fail': ['გაკვეთილი ვერ შეიქმნა: {e}', 'The lesson could not be made: {e}'],
  'ah.noBeats': ['ამ ჩანაწერში დარტყმები ვერ ვიპოვე — გაკვეთილი ვერ შეიქმნება.', 'No beat was found in this recording — no lesson can be made.'],
  'ah.est': ['AI-ის შეფასება ჩანაწერიდან — შეამოწმე ყურით.', 'Measured by the AI from the recording — check it by ear.'],
  'ah.legend': ['↓ ჩაკვრა · ↑ ამოკვრა · წითელი = აქცენტი', '↓ down · ↑ up · red = accent'],
  'ah.beats': ['{n} თვლა', '{n} beats'], 'ah.beat': ['1 თვლა', '1 beat']
});

PD.aiStage = (() => {
  const h = PD.h, t = PD.i18n.t;
  const OPENED = 'ah.opened';   // the songs whose lesson has already opened by itself once
  const arrow = (up, acc) => '<svg class="ah-ar' + (acc ? ' acc' : '') + '" viewBox="0 0 24 52" aria-hidden="true"><path d="' + (up ? 'M12 48V6M3 15l9-9 9 9' : 'M12 4v42M3 37l9 9 9-9') + '"/></svg>';
  let styled = false;
  function style() {
    if (styled) return; styled = true;
    document.head.appendChild(h('style', { text: `
.ah{display:grid;gap:14px;padding:18px;border-radius:22px;background:linear-gradient(180deg,rgba(199,139,94,.10),rgba(255,255,255,.02));border:1px solid rgba(199,139,94,.32);margin-bottom:14px;min-width:0}
.ah-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.ah-top h2{margin:0;font-size:19px}.ah-top .grow{flex:1}
.ah-row{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.ah-row::-webkit-scrollbar{display:none}
.ah-c{flex:1 0 auto;min-width:118px;display:grid;grid-template-rows:auto 1fr auto;gap:6px;padding:12px 12px 8px;border-radius:18px;background:#141416;border:1px solid rgba(255,255,255,.08)}
.ah-c.on{background:linear-gradient(180deg,rgba(214,96,74,.26),rgba(214,96,74,.10));border-color:rgba(232,112,90,.75)}
.ah-ch{display:flex;align-items:baseline;justify-content:space-between;gap:8px}.ah-ch b{font-size:30px;line-height:1;font-weight:800;letter-spacing:-.02em}.ah-ch small{color:var(--fg3,#9a9a9f);font-size:12px;white-space:nowrap}
.ah-st{display:flex;align-items:center;justify-content:space-around;gap:2px;min-height:70px}.ah-bt{display:flex;flex:1;justify-content:space-around;align-items:center}.ah-bt+.ah-bt{border-left:1px dashed rgba(255,255,255,.14)}
.ah-ar{width:22px;height:48px;fill:none;stroke:#d9d9de;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.ah-ar.acc{stroke:#ec6b56}
.ah-n{display:flex;justify-content:space-around;color:var(--fg3,#8d8d93);font-size:12px}
.ah-msg{color:var(--fg2,#c9c9cd);margin:0;line-height:1.5}.ah-acts{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.ah-leg{color:var(--fg3,#8d8d93);font-size:12px}.ah-spin{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.18);border-top-color:var(--acc,#c78b5e);animation:ah-r .9s linear infinite;display:inline-block;vertical-align:-2px;margin-inline-end:8px}
@keyframes ah-r{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.ah-spin{animation:none}}
` }));
  }

  /** the cycle the AI found (or the first measured changes), as chord cards with their strokes, one card per run */
  function cards(res, D, pat) {
    const C = PD.aiLessons.chart(res, D && D.cycle);
    let seq = C.cycle ? C.cycle.cycle : C.names.filter(Boolean).slice(0, 8);
    if (!seq.length) return null;
    const runs = []; seq.forEach(c => { const r = runs[runs.length - 1]; if (r && r.c === c) r.n++; else runs.push({ c, n: 1 }); });
    const strokes = (PD.aiLessons.patterns().find(p => p.id === pat) || { strokes: [{ direction: 'down' }] }).strokes;
    return h('div', { class: 'ah-row', role: 'list' }, runs.slice(0, 8).map((r, i) => h('div', { class: 'ah-c' + (i === 0 ? ' on' : ''), role: 'listitem' }, [
      h('div', { class: 'ah-ch' }, [h('b', { text: r.c }), h('small', { text: r.n === 1 ? t('ah.beat') : t('ah.beats', { n: r.n }) })]),
      h('div', { class: 'ah-st', html: Array.from({ length: Math.min(r.n, 4) }, () => '<span class="ah-bt">' + strokes.map(k => arrow(k.direction === 'up', !!k.accent)).join('') + '</span>').join('') }),
      h('div', { class: 'ah-n' }, Array.from({ length: Math.min(r.n, 4) }, (_, j) => h('span', { text: String(j + 1) })))])));
  }

  /** o: { S (getter), pro(), lock(), edit() }. Puts the card before `before` inside `parent`. */
  function mount(parent, before, o) {
    if (!PD.aiLessons) return;
    style();
    const box = h('section', { class: 'ah', 'aria-live': 'polite' });
    parent.insertBefore(box, before);
    const S0 = o.S;
    let gone = false, tries = 0;
    const alive = () => !gone && box.isConnected && o.S === S0;
    function head(extra) { return h('div', { class: 'ah-top' }, [h('h2', { text: t('ah.title') }), h('span', { class: 'ai-badge', text: 'AI' }), h('span', { class: 'grow' })].concat(extra || [])); }
    function waiting() { box.innerHTML = ''; box.append(head(), h('p', { class: 'ah-msg' }, [h('i', { class: 'ah-spin', 'aria-hidden': 'true' }), h('span', { text: t('ah.wait') })])); }
    function show(D, pat, locked, err) {
      const S = o.S, res = S.res; box.innerHTML = '';
      const row = cards(res, D, pat);
      const play = h('button', { class: 'btn primary big', html: (PD.ic && PD.ic.play ? PD.ic.play : '▶ ') + '<span>' + PD.esc(t(locked ? 'ah.lock' : 'ah.play')) + '</span>', onclick: () => locked ? o.lock() : openLesson(D, false) });
      box.append(head([h('small', { class: 'ah-leg', text: t('ah.legend') })]));
      if (row) box.append(row);
      box.append(h('p', { class: 'ah-msg', text: err ? t('ah.fail', { e: err }) : t(locked ? 'ah.lockD' : 'ah.ready') }),
        h('div', { class: 'ah-acts' }, [play,
          !locked && D ? h('button', { class: 'btn', text: t('ah.page'), onclick: () => PD.app.go('lesson', D.id) }) : null,
          h('button', { class: 'btn quiet', text: t('ah.edit'), onclick: () => o.edit && o.edit() }),
          h('small', { class: 'muted', text: t('ah.est') })].filter(Boolean)));
    }
    function openLesson(D, auto) {
      const l = PD.lessons.get(D.id);
      if (!l) { PD.app.go('lesson', D.id); return; }
      if (auto) PD.ui.toast(t('ah.made'), 3500);
      PD.app.startStage(l, 'demo');
    }
    async function ready() {
      if (!alive()) return;
      const S = o.S, res = S.res;
      if (!res.beats || res.beats.length < 8) { box.innerHTML = ''; box.append(head(), h('p', { class: 'ah-msg', text: t('ah.noBeats') })); return; }
      // the song must be stored (its id) and the rhythm reader must have spoken — or had 30 s to
      if ((!S.id || (!S.rhy && tries < 60)) && tries++ < 120) { setTimeout(ready, 500); return; }
      if (!S.id) return;
      const pat = S.rhy ? PD.aiLessons.suggest(S.rhy) : 'down';
      let D = PD.aiLessons.find(S.id);
      if (!o.pro()) { show(D, (D && D.pattern) || pat, true); return; }
      if (!D) {
        try {
          await PD.aiLessons.make(S, { pattern: pat, bpb: (S.rhyMt && S.rhyMt.beatsPerBar) || 4 });
          D = PD.aiLessons.find(S.id); S.onLearn && S.onLearn();
        } catch (e) { if (alive()) show(null, pat, false, (e && e.message) || String(e)); return; }
      }
      if (!alive() || !D) return;
      show(D, D.pattern || pat, false);
      // the first time for this song, the lesson opens by itself: that is what the studio is for
      const seen = PD.store.get(OPENED, []);
      if (seen.indexOf(S.id) < 0) {
        PD.store.set(OPENED, seen.concat(S.id).slice(-200));
        setTimeout(() => { if (alive() && PD.app.route === 'ai') openLesson(D, true); }, 900);
      }
    }
    waiting(); ready();
    return { destroy() { gone = true; box.remove(); }, refresh: () => { tries = 999; ready(); } };
  }
  return { mount };
})();
