/* =====================================================================
   The opening film (welcome screen / launch): plays src3d/intro3d.js
   (loaded only here) behind the page, with a skip button; tap anywhere
   also skips. Where it cannot run (no WebGL, the file is missing in the
   single-file build, reduced motion, or switched off in Settings) the
   still render of the same final shot is shown instead.
   ===================================================================== */
PD.i18n.add({
  'cine.skip': ['გამოტოვება', 'Skip'], 'set.cine': ['გახსნის ფილმი', 'Opening film'],
  'set.cineD': ['აპის გახსნისას — კამერა ხვრელიდან მთელ ფანდურამდე. ყოველთვის შეიძლება გამოტოვება.', 'When the app opens — the camera from the sound hole to the whole panduri. You can always skip it.']
});
PD.cine = (() => {
  const h = PD.h, t = PD.i18n.t;
  const reduced = () => document.documentElement.classList.contains('rm') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const enabled = () => PD.store.get('cine', true) && !reduced();
  function still() { const ph = (PD.assets && PD.assets.photos) || {}; return innerHeight > innerWidth ? (ph.splashP || ph.splashL || ph.body) : (ph.splashL || ph.splashP || ph.body); }
  /** put the film (or its still) into `layer`; onEnd() when the title may appear */
  function mount(layer, onEnd) {
    let ctl = null, ended = false, skipB = null;
    const end = () => { if (ended) return; ended = true; if (skipB) { skipB.classList.add('out'); setTimeout(() => skipB && skipB.remove(), 300); } onEnd && onEnd(); };
    layer.classList.add('cine'); layer.style.setProperty('--cine-still', 'url("' + (still() || '') + '")');
    // the stage behind the instrument: light beams from above, haze, out-of-focus lights, a pool of light on the floor
    const bok = h('div', { class: 'cine-bokeh' }); for (let i = 0; i < 22; i++) bok.append(h('i', { style: '--x:' + (Math.random() * 100).toFixed(1) + '%;--y:' + (Math.random() * 100).toFixed(1) + '%;--s:' + (8 + Math.random() * 34).toFixed(0) + 'px;--d:' + (6 + Math.random() * 10).toFixed(1) + 's;--o:' + (.15 + Math.random() * .45).toFixed(2) + ';--h:' + (Math.random() < .7 ? '32' : '205') }));
    layer.append(h('div', { class: 'cine-bg', 'aria-hidden': 'true' }, [h('div', { class: 'cine-beam b1' }), h('div', { class: 'cine-beam b2' }), h('div', { class: 'cine-beam b3' }), h('div', { class: 'cine-haze' }), bok, h('div', { class: 'cine-floor' })]));
    const tune = h('div', { class: 'cine-tune', 'aria-live': 'polite' }, ['A', 'C♯', 'E'].map(n => h('span', { 'data-n': n, text: n })));
    layer.append(h('div', { class: 'cine-fx', 'aria-hidden': 'true' }), tune);
    const cue = n => { const el = tune.querySelector('[data-n="' + n + '"]'); tune.classList.add('on'); if (el) el.classList.add('ok'); if (n === 'E') setTimeout(() => tune.classList.remove('on'), 1600); };
    if (!enabled()) { layer.classList.add('still'); setTimeout(end, 60); return { stop() {} }; }
    const stage = h('div', { class: 'cine-stage' }); layer.prepend(stage);
    skipB = h('button', { class: 'cine-skip', text: t('cine.skip'), onclick: e => { e.stopPropagation(); if (ctl) ctl.skip(); end(); } });
    layer.append(skipB);
    layer.addEventListener('pointerdown', () => { if (!ended && ctl) { ctl.skip(); end(); } }, { once: true });
    let alive = true;
    (PD._cineP = PD._cineP || import(new URL('intro3d.js', document.baseURI).href)).then(mod => {
      if (!alive) return; let c = null;
      try { c = mod.create(stage, { onEnd: end, onCue: cue }); } catch (e) { console.warn(e); }
      if (!c) { layer.classList.add('still'); end(); return; }
      ctl = c; layer.classList.add('playing'); c.play();
    }, () => { PD._cineP = null; layer.classList.add('still'); end(); });
    return { stop() { alive = false; if (ctl) ctl.stop(); ctl = null; }, skip() { if (ctl) ctl.skip(); end(); } };
  }
  /** at launch (signed in): the film over the app, once a day */
  function boot() {
    if (!enabled() || PD.store.get('cine.day', '') === new Date().toDateString()) return;
    PD.store.set('cine.day', new Date().toDateString());
    const layer = h('div', { class: 'cine-boot', role: 'presentation' }), title = h('div', { class: 'cine-title' }, [h('h1', { class: 'sp-name', html: titleHTML() }), h('p', { class: 'sp-tag', 'data-t': 'au.tagline' })]);
    layer.append(title); document.body.appendChild(layer); PD.i18n.apply(layer);
    let ctl = null; const close = () => { layer.classList.add('out'); setTimeout(() => { if (ctl) ctl.stop(); layer.remove(); }, 600); };
    ctl = mount(layer, () => { layer.classList.add('titled'); setTimeout(close, 2600); });
  }
  /** the name, letter by letter (each letter animates in on its own) */
  function titleHTML() { return [...t('sp.title')].map((c, i) => '<span style="--i:' + i + '">' + PD.esc(c) + '</span>').join(''); }
  return { mount, boot, titleHTML, get enabled() { return enabled(); } };
})();
