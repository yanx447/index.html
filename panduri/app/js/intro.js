/* =====================================================================
   The required introduction: six existing cards from „ხრიკები და
   რჩევები“ (sitting, holding, the two hands, strokes, finger numbers,
   string numbers) are read one after another before the rest of the
   app opens. The teacher asked for it to be required for everyone, so
   there is no skip; Back does not close it. The cards' text comes from
   PD.tips.all(), so edits made in Author Studio show here too.
   ===================================================================== */
PD.i18n.add({
  'in.kicker': ['შესავალი · {i} / {n}', 'Introduction · {i} / {n}'],
  'in.lead': ['სანამ დაიწყებ — {n} მოკლე ბარათი', 'Before you start — {n} short cards'],
  'in.next': ['შემდეგი', 'Next'], 'in.prev': ['უკან', 'Back'], 'in.go': ['დავიწყოთ სწავლა', 'Start learning'],
  'in.steps': ['როგორ', 'How'], 'in.why': ['რატომ', 'Why'],
  'in.doneT': ['შესავალი გავლილია', 'Introduction done'], 'in.doneD': ['ახლა აპი სრულად გახსნილია. გააგრძელე „სწავლაში“ — ლეველი 1.', 'The whole app is open now. Continue in Learn — level 1.']
});
PD.intro = (() => {
  const h = PD.h, t = PD.i18n.t, IDS = ['sit', 'hold', 'hands', 'strokes', 'fingers', 'stringnum'];
  const L = x => Array.isArray(x) ? (PD.i18n.lang === 'en' ? x[1] || x[0] : x[0]) : (x || '');
  let el = null;
  const done = () => !!PD.store.get('intro.done', false);
  function cards() { const all = PD.tips.all(true); return IDS.map(id => all.find(c => c.id === id)).filter(Boolean); }
  function open() {
    if (el) return;
    const list = cards(); if (!list.length) { PD.store.set('intro.done', true); return; }
    let i = Math.min(PD.store.get('intro.at', 0) || 0, list.length - 1);
    const bar = h('div', { class: 'in-bar' }, list.map(() => h('i')));
    const kick = h('small', { class: 'in-kick' }), body = h('div', { class: 'in-body' });
    const prev = h('button', { class: 'btn in-prev', onclick: () => { if (i > 0) { i--; draw(-1); } } });
    const next = h('button', { class: 'btn primary in-next', onclick: () => { if (i < list.length - 1) { i++; draw(1); } else finish(); } });
    el = h('div', { class: 'intro', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('in.lead', { n: list.length }) }, [
      h('div', { class: 'in-top' }, [h('b', { class: 'in-lead', text: t('in.lead', { n: list.length }) }), bar, kick]),
      h('div', { class: 'in-scroll' }, [body]),
      h('div', { class: 'in-foot' }, [prev, next])]);
    document.body.appendChild(el); document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => el && el.classList.add('in'));
    function draw(dir) {
      PD.store.set('intro.at', i);
      PD.store.set('seen.tip.' + list[i].id, true);   // a card read here counts as read in Learn too
      const c = list[i], art = c.art && PD.tips.ART[c.art] ? PD.tips.ART[c.art]() : '';
      bar.querySelectorAll('i').forEach((x, k) => { x.className = k < i ? 'done' : k === i ? 'on' : ''; });
      kick.textContent = t('in.kicker', { i: i + 1, n: list.length });
      const sec = [h('div', { class: 'in-art', html: art }), h('h1', { class: 'in-title', text: L(c.title) }), h('p', { class: 'in-short', text: L(c.short) })];
      if (c.steps && c.steps.length) sec.push(h('section', { class: 'in-sec' }, [h('h3', { text: t('in.steps') }), h('ol', { class: 'tp-steps' }, c.steps.map(s => h('li', { text: L(s) })))]));
      if (c.why) sec.push(h('section', { class: 'in-sec' }, [h('h3', { text: t('in.why') }), h('p', { text: L(c.why) })]));
      body.innerHTML = ''; body.append(...sec);
      if (dir && PD.ui && PD.ui.motion && PD.ui.motion()) body.animate([{ opacity: 0, transform: 'translateX(' + (dir * 24) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)' });
      el.querySelector('.in-scroll').scrollTop = 0;
      prev.textContent = t('in.prev'); prev.disabled = i === 0;
      next.textContent = i === list.length - 1 ? t('in.go') : t('in.next');
    }
    function finish() {
      PD.store.set('intro.done', true); PD.store.del('intro.at');
      const e = el; el = null; document.body.style.overflow = '';
      e.classList.add('out'); setTimeout(() => e.remove(), 280);
      PD.ui && PD.ui.toast && PD.ui.toast(t('in.doneT') + ' — ' + t('in.doneD'), 4500);
      PD.app.go('learn', null, true);
    }
    draw(0);
  }
  /** shown after sign-in and onboarding until it has been read once */
  function maybe() { if (!done()) open(); }
  return { open, maybe, get done() { return done(); }, get active() { return !!el; } };
})();
